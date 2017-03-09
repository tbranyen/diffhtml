import {
  html,
  use,
  addTransitionState,
  removeTransitionState,
  createElement,
  createAttribute,
  innerHTML,
  outerHTML,
  element,
  releaseNode,
} from 'diffhtml';

/**
 * By calling this function your browser environment is enhanced globally. This
 * project would love to hit the standards track and allow all developers to
 * benefit from the performance gains of DOM diffing.
 */
export function enableProllyfill() {
  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'diffHTML', {
    configurable: true,
    value: html
  });

  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'diffUse', {
    configurable: true,
    value: use
  });

  // Allows a developer to create Virtual Tree Elements.
  Object.defineProperty(document, 'createTreeElement', {
    configurable: true,
    value(nodeName, attributes, childNodes) {
      return createElement(nodeName, attributes, childNodes);
    }
  });

  // Allows a developer to add transition state callbacks.
  Object.defineProperty(document, 'addTransitionState', {
    configurable: true,
    value(state, callback) { addTransitionState(state, callback); }
  });

  // Allows a developer to remove transition state callbacks.
  Object.defineProperty(document, 'removeTransitionState', {
    configurable: true,
    value(state, callback) { removeTransitionState(state, callback); }
  });

  // Look for the following constructors and filter down to as many valid as
  // possible.
  const constructors = [
    typeof Element !== 'undefined' ? Element : undefined,
    typeof HTMLElement !== 'undefined' ? HTMLElement : undefined,
    typeof ShadowRoot !== 'undefined' ? ShadowRoot : undefined,
    typeof DocumentFragment !== 'undefined' ? DocumentFragment : undefined,
  ].filter(Boolean);

  // Exposes the API into the Element, ShadowDOM, and DocumentFragment
  // constructors.
  constructors.forEach(Ctor => {
    Object.defineProperty(Ctor.prototype, 'diffInnerHTML', {
      configurable: true,
      set(newHTML) { innerHTML(this, newHTML); }
    });

    // Allows a developer to set the `outerHTML` of an element.
    Object.defineProperty(Ctor.prototype, 'diffOuterHTML', {
      configurable: true,
      set(newHTML) { outerHTML(this, newHTML); }
    });

    // Allows a developer to diff the current element with a new element.
    Object.defineProperty(Ctor.prototype, 'diffElement', {
      configurable: true,
      value(newElement, options) { element(this, newElement, options); }
    });

    // Releases the retained memory.
    Object.defineProperty(Ctor.prototype, 'diffRelease', {
      configurable: true,
      value() { releaseNode(this); }
    });
  });
}

// Expose all diffHTML properties/methods, making this a direct drop in
// replacement.
export * from 'diffhtml';
