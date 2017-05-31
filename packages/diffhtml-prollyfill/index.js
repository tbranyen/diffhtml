import {
  html,
  use,
  addTransitionState,
  removeTransitionState,
  createTree,
  innerHTML,
  outerHTML,
  release,
} from 'diffhtml';

const root = typeof global !== 'undefined' ? global : window;

/**
 * By calling this function your browser environment is enhanced globally. This
 * project would love to hit the standards track and allow all developers to
 * benefit from the performance gains of DOM diffing.
 */
export default function enableProllyfill(window = root) {
  const {
    document,
    Element,
    HTMLElement,
    ShadowRoot,
    DocumentFragment,
  } = window;

  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'html', {
    configurable: true,
    value: html,
  });

  // Exposes the `use` middleware function.
  Object.defineProperty(window, 'use', {
    configurable: true,
    value: use,
  });

  // Allows a developer to create Virtual Tree Elements.
  Object.defineProperty(document, 'createTree', {
    configurable: true,
    value: createTree,
  });

  // Allows a developer to add transition state callbacks.
  Object.defineProperty(document, 'addTransitionState', {
    configurable: true,
    value: (state, callback) => addTransitionState(state, callback),
  });

  // Allows a developer to remove transition state callbacks.
  Object.defineProperty(document, 'removeTransitionState', {
    configurable: true,
    value: (state, callback) => removeTransitionState(state, callback),
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
    Object.defineProperty(Ctor.prototype, 'innerHTML', {
      configurable: true,
      set: newHTML => innerHTML(this, newHTML),
    });

    // Allows a developer to set the `outerHTML` of an element.
    Object.defineProperty(Ctor.prototype, 'outerHTML', {
      configurable: true,
      set: newHTML => outerHTML(this, newHTML),
    });

    // Releases the retained memory.
    Object.defineProperty(Ctor.prototype, 'release', {
      configurable: true,
      value: release,
    });
  });
}
