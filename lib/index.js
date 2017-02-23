import Transaction from './transaction';

/**
 * A convenient helper to create Virtual Tree elements. This can be used in
 * place of HTML parsing and is what the Babel transform will compile down to.
 *
 * @example
 *
 *    import { createTree } from 'diffhtml';
 *
 *    // Creates a div with the test class and a nested text node.
 *    const vTree = createTree('div', { 'class': 'test' }, 'Hello world');
 *
 *    // Creates an empty div.
 *    const vTree = createTree('div');
 *
 *    // Creates a VTree and associates it with a DOM Node.
 *    const div = document.createElement('div');
 *    const vTree = createTree(div);
 *
 *    // Create a fragment of Nodes (is wrapped by a #document-fragment).
 *    const vTree = createTree([createTree('div'), createTree('h1')]);
 *    console.log(vTree.nodeName === '#document-fragment'); // true
 *
 *    // Any other object passed to `createTree` will be returned and assumed
 *    // to be an object that is shaped like a VTree.
 *    const vTree = createTree({
 *      nodeName: 'div',
 *      attributes: { 'class': 'on' },
 *    });
 *
 *
 * @param {Array|Object|Node} nodeName - Value used to infer making the DOM Node
 * @param {Object =} attributes - Attributes to assign
 * @param {Array|Object|String|Node =} childNodes - Children to assign
 * @return {Object} A VTree object
 */
import createTree from './tree/create';

/**
 * Parses HTML strings into Virtual Tree elements. This can be a single static
 * string, like that produced by a template engine, or a complex tagged
 * template string.
 *
 * @example
 *
 *    import { html } from 'diffhtml';
 *
 *    // Parses HTML directly from a string, useful for consuming template
 *    // engine output and inlining markup.
 *    const fromString = html('<center>Markup</center>');
 *
 *    // Parses a tagged template string. This can contain interpolated
 *    // values in between the `${...}` symbols. The values are typically
 *    // going to be strings, but you can pass any value to any property or
 *    // attribute.
 *    const fromTaggedTemplate = html`<center>${'Markup'}</center>`;
 *
 *    // You can pass functions to event handlers and basically any value to
 *    // property or attribute. If diffHTML encounters a value that is not a
 *    // string it will still create an attribute, but the value will be an
 *    // empty string. This is necessary for tracking changes.
 *    const dynamicValues = html`<center onclick=${
 *      ev => console.log('Clicked the center tag')
 *    }>Markup</center>`;
 *
 *
 * @param {String} markup - A string or tagged template string containing HTML
 * @return {Object|Array} - A single instance or array of Virtual Tree elements
 */
import html from './html';

/**
 * Recycles internal memory, removes state, and cancels all scheduled render
 * transactions. This is mainly going to be used in unit tests and not
 * typically in production. The reason for this is that components are usually
 * going to live the lifetime of the page, with a refresh cleaning slate.
 *
 * @example
 *
 *    import { innerHTML, release } from 'diffhtml';
 *
 *    // Associate state and reuse pre-allocated memory.
 *    innerHTML(document.body, 'Hello world');
 *
 *    // Free all association to `document.body`.
 *    release(document.body);
 *
 *
 * @param {Object} node - A DOM Node that is being tracked by diffHTML
 */
import release from './release';

import {
  /**
   * Adds a global transition listener. With many elements this could be an
   * expensive operation, so try to limit the amount of listeners added if
   * you're concerned about performance.
   *
   * Since the callback triggers with various elements, most of which you
   * probably don't care about, you'll want to filter. A good way of filtering
   * is to use the DOM `matches` method. It's fairly well supported
   * (http://caniuse.com/#feat=matchesselector) and may suit many projects. If
   * you need backwards compatibility, consider using jQuery's `is`.
   *
   * @example
   *
   *    import { addTransitionState } from 'diffhtml';
   *
   *    // Fade in all elements as they are added to the DOM.
   *    addTransitionState('attached', el => $(el).fadeIn().promise());
   *
   *    // Fade out all elements as they leave the DOM.
   *    addTransitionState('detached', el => $(el).fadeOut().promise());
   *
   *
   * @param state - String name that matches what's available in the
   * documentation above.
   * @param callback - Function to receive the matching elements.
   */
  addTransitionState,

  /**
   * Removes a global transition listener.
   *
   * When invoked with no arguments, this method will remove all transition
   * callbacks. When invoked with the name argument it will remove all
   * transition state callbacks matching the name, and so on for the callback.
   *
   * @example
   *
   *    import { removeTransitionState } from 'diffhtml';
   *
   *    // Remove all transition state handlers.
   *    removeTransitionState();
   *
   *    // Remove all `attached` state handlers.
   *    removeTransitionState('attached');
   *
   * @param {String =} state - Name that matches what's available in the
   * documentation above
   * @param {Function =} callback - Callback to receive the matching elements
   */
  removeTransitionState,
} from './transition';

/**
 * Registers middleware functions which are called during the render
 * transaction flow. These should be very fast and ideally asynchronous to
 * avoid blocking the render.
 *
 * @example
 *
 *    import { use } from 'diffhtml';
 *    import logger from 'diffhtml-logger';
 *    import devTools from 'diffhtml-devtools';
 *
 *    use(logger());
 *    use(devTools());
 *
 *
 * @param {Function} middleware - A function that gets passed internals
 * @return Function - When invoked removes and deactivates the middleware
 */
import use from './use';

import * as internals from './util';
import * as tasks from './tasks';

/**
 * Export the version based on the package.json version field value, is inlined
 * with babel.
 */
const VERSION = __VERSION__;

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents. Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @example
 *
 *    import { outerHTML } from 'diffhtml';
 *
 *    // Remove all attributes and set the children to be a single text node
 *    // containing the text 'Hello world',
 *    outerHTML(document.body, '<body>Hello world</body>');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function outerHTML(element, markup='', options={}) {
  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents. This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @example
 *
 *    import { innerHTML } from 'diffhtml';
 *
 *    // Sets the body children to be a single text node containing the text
 *    // 'Hello world'.
 *    innerHTML(document.body, 'Hello world');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function innerHTML(element, markup='', options={}) {
  options.inner = true;
  return Transaction.create(element, markup, options).start();
}

function element(element, markup='', options={}) {
  return Transaction.create(element, markup, options).start();
}

// Public API. Passed to subscribed middleware.
const diff = {
  VERSION: __VERSION__,
  addTransitionState,
  removeTransitionState,
  release,
  createTree,
  use,
  outerHTML,
  innerHTML,
  html,
  internals,
  tasks,
};

// Ensure the `diff` property is nonenumerable so it doesn't show up in logs.
if (!use.diff) {
  Object.defineProperty(use, 'diff', { value: diff, enumerable: false });
}

export {
  VERSION as __VERSION__,
  addTransitionState,
  removeTransitionState,
  release,
  createTree,
  createTree as createElement,
  use,
  outerHTML,
  innerHTML,
  element,
  html,
};

export default diff;
