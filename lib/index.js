import { patchNode } from './node';

/**
 * outer
 *
 * @param element
 * @param markup=''
 * @param options={}
 * @return
 */
export function outerHTML(element, markup='', options={}) {
  options.inner = false;
  patchNode(element, markup, options);
}

/**
 * inner
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
 * element
 *
 * @param element
 * @param newElement
 * @param options={}
 * @return
 */
export function element(element, newElement, options={}) {
  options.inner = false;
  patchNode(element, newElement, options);
}

/**
 * enableProllyfill
 *
 * @return
 */
export function enableProllyfill() {
  Object.defineProperty(Element.prototype, 'addTransitionState', {
    configurable: true,

    value(name, callback) {
      var states = this._transitionStates = this._transitionStates || {};

      states[name] = states[name] || [];

      states[name].push(callback);
    }
  });

  Object.defineProperty(Element.prototype, 'removeTransitionState', {
    configurable: true,

    value(name, callback) {
      var states = this._transitionStates = this._transitionStates || {};

      states[name] = states[name] || [];

      if (!callback) {
        state[name] = [];
      }
      else {
        states[name].splice(states.indexOf(callback), 1);
      }
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
