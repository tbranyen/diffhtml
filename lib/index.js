import createTransaction from './node/transaction';
import { states as transitionStates } from './util/transitions';
import { MiddlewareCache } from './util/cache';

/**
 * The purpose of this method is to parse strings of HTML into Virtual Tree
 * objects. These strings can be simple static strings, values produced by
 * template engines, or even complex tagged template strings with dynamic
 * interpolated values.
 *
 * @example
 *
 *    import { html } from 'diffhtml'
 *
 *    // Parses HTML directly from a string, which is useful for consuming
 *    // template engine output and inlining markup.
 *    const fromString = html('<center>Markup</center>')
 *
 *    // Parses a tagged template string, which can contain interpolated
 *    // values in between the `${...}` symbols. These values may typically
 *    // be strings, but you can pass any value to any property or attribute.
 *    const fromTaggedTemplate = html`<center>${'Markup'}</center>`
 *
 *    // You can pass functions to event handlers and basically any value to
 *    // property or attribute. If diffHTML encounters a value that is not a
 *    // string it will still create an attribute, but the value will be an
 *    // empty string. This is necessary for tracking changes.
 *    const dynamicValues = html`<center onclick=${
 *      ev => console.log('Clicked the center tag')
 *    }>Markup</center>`
 *
 *
 * @param {String} markup - A string or tagged template string containing HTML
 * @return {Object|Array} - A single instance or array of Virtual Tree objects
 */
export { html } from './util/tagged-template';

/**
 * Recycles internal memory, removes state, and cancels all scheduled render
 * transactions. This is mainly going to be used in unit tests and not
 * typically in production. The reason for this is that components are usually
 * going to live the lifetime of the page, with a refresh cleaning slate.
 *
 * @example
 *
 *    import { innerHTML, release } from 'diffhtml'
 *
 *    // Associate state and reuse pre-allocated memory.
 *    innerHTML(document.body, 'Hello world')
 *
 *    // Free all association to `document.body`.
 *    release(document.body)
 *
 *
 * @param {Object} node - A DOM Node that is being tracked by diffHTML
 */
export { default as release } from './node/release';

/**
 * A convenient helper to create Virtual Tree elements. This can be used in
 * place of HTML parsing and is what the Babel transform compiles down to.
 *
 * @example
 *
 *    import { createElement } from 'diffhtml'
 *
 *    // Creates a div with the test class and a nested text node.
 *    const vTree = createElement('div', { 'class': 'test' }, 'Hello world')
 *
 *    // Creates an empty div.
 *    const vTree = createElement('div')
 *
 *
 * @param {String} nodeName - The tagName passed to `document.createElement`
 * @param {Array =} attributes - List of key/val attributes
 * @param {Array|Object =} childNodes - A single Virtual Tree element or a list
 * of elements, all remaining arguments are concatenated together.
 * @return {Object} A pooled object representing the virtual element
 */
export { createElement } from './tree/helpers';

/**
 * Recycles internal memory, removes state, and cancels all scheduled render
 * transactions. This is mainly going to be used in unit tests and not
 * typically in production. The reason for this is that components are usually
 * going to live the lifetime of the page, with a refresh cleaning slate.
 *
 * @example
 *
 *    import { innerHTML, release } from 'diffhtml'
 *
 *    // Associate state and reuse pre-allocated memory.
 *    innerHTML(document.body, 'Hello world')
 *
 *    // Free all association to `document.body`.
 *    release(document.body)
 *
 *
 * @param {Object} node - A DOM Node that is being tracked by diffHTML
 * @return {Object} A pooled object representing the virtual attribute
 */
export { createAttribute } from './tree/helpers';

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents. Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @example
 *
 *    import { outerHTML } from 'diffhtml'
 *
 *    // Remove all attributes and set the children to be a single text node
 *    // containing the text 'Hello world',
 *    outerHTML(document.body, '<body>Hello world</body>')
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
export function outerHTML(element, markup='', options={}) {
  options.inner = false;
  createTransaction(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents. This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @example
 *
 *    import { innerHTML } from 'diffhtml'
 *
 *    // Sets the body children to be a single text node containing the text
 *    // 'Hello world'.
 *    innerHTML(document.body, 'Hello world')
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
export function innerHTML(element, markup='', options={}) {
  options.inner = true;
  createTransaction(element, markup, options);
}

/**
 * Used to diff two elements. The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior. By default it is
 * outerHTML.
 *
 * @example
 *
 *    // It is usually better to rename this method to something descriptive.
 *    import { element as diffElement } from 'diffhtml'
 *
 *    // Create a new body tag.
 *    const newBody = $(`<body>
 *      <strong>Hello world!</strong>
 *    </body>`).get();
 *
 *
 *    diffElement(document.body, newBody);
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {Object} newElement - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
export function element(element, newElement, options={}) {
  createTransaction(element, newElement, options);
}

/**
 * Adds a global transition listener. With many elements this could be an
 * expensive operation, so try to limit the amount of listeners added if you're
 * concerned about performance.
 *
 * Since the callback triggers with various elements, most of which you
 * probably don't care about, you'll want to filter. A good way of filtering
 * is to use the DOM `matches` method. It's fairly well supported
 * (http://caniuse.com/#feat=matchesselector) and may suit many projects. If
 * you need backwards compatibility, consider using jQuery's `is`.
 *
 * @example
 *
 *    import { addTransitionState } from 'diffhtml'
 *
 *    // Fade in all elements as they are added to the DOM.
 *    addTransitionState('attached', el => $(el).fadeIn().promise())
 *
 *    // Fade out all elements as they leave the DOM.
 *    addTransitionState('detached', el => $(el).fadeOut().promise())
 *
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */
export function addTransitionState(state, callback) {
  if (!state) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (Object.keys(transitionStates).indexOf(state) === -1) {
    throw new Error('Invalid state name: ' + state);
  }

  transitionStates[state].push(callback);
}

/**
 * Removes a global transition listener.
 *
 * When invoked with no arguments, this method will remove all transition
 * callbacks. When invoked with the name argument it will remove all transition
 * state callbacks matching the name, and so on for the callback.
 *
 * @example
 *
 *    import { removeTransitionState } from 'diffhtml'
 *
 *    // Remove all transition state handlers.
 *    removeTransitionState()
 *
 *    // Remove all `attached` state handlers.
 *    removeTransitionState('attached')
 *
 *
 * @param {String =} state - Name that matches what's available in the
 * documentation above
 * @param {Function =} callback - Callback to receive the matching elements
 */
export function removeTransitionState(state, callback) {
  if (!callback && state) {
    transitionStates[state].length = 0;
  }
  else if (state && callback) {
    // Not a valid state name.
    if (Object.keys(transitionStates).indexOf(state) === -1) {
      throw new Error('Invalid state name ' + state);
    }

    let index = transitionStates[state].indexOf(callback);
    transitionStates[state].splice(index, 1);
  }
  else {
    for (let state in transitionStates) {
      transitionStates[state].length = 0;
    }
  }
}

/**
 * Registers middleware functions which are called during the render
 * transaction flow. These should be very fast and ideally asynchronous to
 * avoid blocking the render.
 *
 * @example
 *
 *    import { use } from 'diffhtml'
 *    import logger from 'diffhtml-logger'
 *
 *    // Add the diffHTML logger middleware, to console out render information.
 *    use(logger)
 *
 *
 * @param {Function} middleware - A function that gets passed internals
 * @return {Function} - When invoked removes and deactivates the middleware
 */
export function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe();
  };
}
