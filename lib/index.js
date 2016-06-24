import createTransaction from './node/transaction';
import { states as transitionStates } from './util/transitions';
import { MiddlewareCache } from './util/cache';

// Export the HTML tagged template helper util.
export { html } from './util/tagged-template';
import { html } from './util/tagged-template';

// Export the DOM Node release method.
export { default as release } from './node/release';

// Export the Virtual Tree Element/Attribute helpers.
export { createElement, createAttribute } from './tree/helpers';

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents.  Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @param element
 * @param markup=''
 * @param options={}
 */
export function outerHTML(element, markup='', options={}) {
  options.inner = false;
  createTransaction(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents.  This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @param element
 * @param markup=''
 * @param options={}
 */
export function innerHTML(element, markup='', options={}) {
  options.inner = true;
  createTransaction(element, markup, options);
}

/**
 * Used to diff two elements.  The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior.  By default it is
 * outerHTML.
 *
 * @param element
 * @param newElement
 * @param options={}
 */
export function element(element, newElement, options={}) {
  createTransaction(element, newElement, options);
}

/**
 * Adds a global transition listener.  With many elements this could be an
 * expensive operation, so try to limit the amount of listeners added if you're
 * concerned about performance.
 *
 * Since the callback triggers with various elements, most of which you
 * probably don't care about, you'll want to filter.  A good way of filtering
 * is to use the DOM `matches` method.  It's fairly well supported
 * (http://caniuse.com/#feat=matchesselector) and may suit many projects.  If
 * you need backwards compatibility, consider using jQuery's `is`.
 *
 * You can do fun, highly specific, filters:
 *
 * addTransitionState('attached', function(element) {
 *   // Fade in the main container after it's added.
 *   if (element.matches('body main.container')) {
 *     $(element).stop(true, true).fadeIn();
 *   }
 * });
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
 * callbacks.  When invoked with the name argument it will remove all
 * transition state callbacks matching the name, and so on for the callback.
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
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
 * Registers middleware to be consumed lightly.
 *
 * @param {Function} middleware - A function that gets passed internals
 * @return {Function} - That when invoked removes the middleware
 */
export function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // This function will remove the middleware from the set when called.
  return () => MiddlewareCache.delete(middleware);
}

/**
 * By calling this function your browser environment is enhanced globally. This
 * project would love to hit the standards track and allow all developers to
 * benefit from the performance gains of DOM diffing.
 */
export function enableProllyfill() {
  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'html', {
    configurable: true,

    value: html
  });

  // Allows a developer to add transition state callbacks.
  Object.defineProperty(document, 'addTransitionState', {
    configurable: true,

    value(state, callback) {
      addTransitionState(state, callback);
    }
  });

  // Allows a developer to remove transition state callbacks.
  Object.defineProperty(document, 'removeTransitionState', {
    configurable: true,

    value(state, callback) {
      removeTransitionState(state, callback);
    }
  });

  // Exposes the API into the Element, ShadowDOM, and DocumentFragment
  // constructors.
  [
    typeof Element !== 'undefined' ? Element : undefined,
    typeof HTMLElement !== 'undefined' ? HTMLElement : undefined,
    typeof ShadowRoot !== 'undefined' ? ShadowRoot : undefined,
    typeof DocumentFragment !== 'undefined' ? DocumentFragment : undefined,
  ].filter(Boolean).forEach(Ctor => {
    Object.defineProperty(Ctor.prototype, 'diffInnerHTML', {
      configurable: true,

      set(newHTML) {
        innerHTML(this, newHTML);
      }
    });

    // Allows a developer to set the `outerHTML` of an element.
    Object.defineProperty(Ctor.prototype, 'diffOuterHTML', {
      configurable: true,

      set(newHTML) {
        outerHTML(this, newHTML);
      }
    });

    // Allows a developer to diff the current element with a new element.
    Object.defineProperty(Ctor.prototype, 'diffElement', {
      configurable: true,

      value(newElement, options) {
        element(this, newElement, options);
      }
    });

    // Releases the retained memory.
    Object.defineProperty(Ctor.prototype, 'diffRelease', {
      configurable: true,

      value() {
        releaseNode(this);
      }
    });
  });
}
