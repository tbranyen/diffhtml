import createTransaction from './node/transaction';
import { states as transitionStates } from './util/transitions';
import { MiddlewareCache } from './util/cache';

// Export the HTML tagged template helper util.
export { html } from './util/tagged-template';

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
