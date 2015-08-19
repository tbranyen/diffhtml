import { patchNode } from './node';
import { transitionStates } from './transitions';
import { TransitionStateError } from './errors';
export { TransitionStateError } from './errors';

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
  patchNode(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents.  This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @param element
 * @param markup=''
 * @param options={}
 * @return
 */
export function innerHTML(element, markup='', options={}) {
  options.inner = true;
  patchNode(element, markup, options);
}

/**
 * Used to diff two elements.  The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior.  By default it is
 * outerHTML.
 *
 * @param element
 * @param newElement
 * @param options={}
 * @return
 */
export function element(element, newElement, options={}) {
  patchNode(element, newElement, options);
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
 * addTransitionState('added', function(element) {
 *   // Fade in the main container after it's added.
 *   if (element.matches('body main.container')) {
 *     $(element).stop(true, true).fadeIn();
 *   }
 * });
 *
 * The transition state's are:
 *
 * - added - For when elements come into the DOM.  The callback triggers
 *   immediately after the element enters the DOM.
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */
export function addTransitionState(state, callback) {
  if (!state) {
    throw new TransitionStateError('Missing transition state name');
  }

  if (!callback) {
    throw new TransitionStateError('Missing transition state callback');
  }

  transitionStates[state] = transitionStates[state] || [];
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
  transitionStates[state] = transitionStates[state] || [];

  if (!callback && state) {
    transitionStates[state] = [];
  }
  else if (state && callback) {
    transitionStates[state].splice(transitionStates[state].indexOf(callback), 1);
  }
  else {
    for (let state in transitionStates) {
      delete transitionStates[state];
    }
  }
}

/**
 * enableProllyfill
 *
 * @return
 */
export function enableProllyfill() {
  Object.defineProperty(Element.prototype, 'addTransitionState', {
    configurable: true,

    value(state, callback) {
      addTransitionState(state, callback);
    }
  });

  Object.defineProperty(Element.prototype, 'removeTransitionState', {
    configurable: true,

    value(state, callback) {
      removeTransitionState(state, callback);
    }
  });

  Object.defineProperty(Element.prototype, 'diffInnerHTML', {
    configurable: true,

    set(newHTML) {
      innerHTML(this, newHTML);
    }
  });

  Object.defineProperty(Element.prototype, 'diffOuterHTML', {
    configurable: true,

    set(newHTML) {
      outerHTML(this, newHTML);
    }
  });

  Object.defineProperty(Element.prototype, 'diffElement', {
    configurable: true,

    value(newElement) {
      element(this, newElement);
    }
  });
}
