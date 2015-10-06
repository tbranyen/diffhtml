import { transitionStates } from '../transitions';
import { pools as _pools } from '../util/pools';
import decodeEntities from '../util/decode';
import getElement from '../element/get';
import { components } from '../element/custom';
import makeNode from '../node/make';

let pools = _pools;
let forEach = Array.prototype.forEach;

/**
 * Processes an Array of patches.
 *
 * @param element
 * @param e
 */
export default function process(element, e) {
  let patches = e.data;
  let states = transitionStates;

  let callCallback = function(callback) {
    callback(this);
  };

  let attachedCallback = function(elementDescriptor) {
    let el = getElement(elementDescriptor).element;
    let fragment = this.fragment;
    let customElement = components[elementDescriptor.nodeName] || {};

    if (customElement.attachedCallback) {
      customElement.attachedCallback.call(el);
    }

    if (el.nodeName === '#text') {
      el.textContent = decodeEntities(el.textContent);
    }

    fragment.appendChild(el);
  };

  let titleCallback = function(elementDescriptor) {
    let el = getElement(elementDescriptor).element;

    // Ensure the title is set correctly.
    if (el.tagName === 'title') {
      el.ownerDocument.title = el.childNodes[0].nodeValue;
    }
  };

  // Loop through all the patches and apply them.
  for (let i = 0; i < patches.length; i++) {
    let patch = patches[i];
    let newDescriptor, oldDescriptor, elementDescriptor;
    let element = patch.new;

    if (patch.element) {
      elementDescriptor = patch.element;

      let result = getElement(patch.element);
      patch.element = result.element;
    }

    if (patch.old) {
      oldDescriptor = patch.old;

      let result = getElement(patch.old);
      patch.old = result.element;
    }

    if (patch.new) {
      newDescriptor = patch.new;

      let result = getElement(patch.new);
      patch.new = result.element;
    }

    if (element && element.nodeName === '#text') {
      patch.new.textContent = decodeEntities(element.nodeValue);
    }

    // Replace the entire Node.
    if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch.new, patch.old);

      let oldCustomElement = components[oldDescriptor.nodeName] || {};
      let newCustomElement = components[newDescriptor.nodeName] || {};

      if (oldCustomElement.detachedCallback) {
        oldCustomElement.detachedCallback.call(patch.old);
      }

      if (newCustomElement.attachedCallback) {
        newCustomElement.attachedCallback.call(patch.new);
      }
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        let fragment = document.createDocumentFragment();

        patch.fragment.forEach(attachedCallback, { fragment });
        patch.element.appendChild(fragment);

        forEach.call(patch.fragment, function(el) {
          var element = getElement(el);

          // Trigger all the text changed values.
          if (states && el.nodeName === '#text' && states.textChanged) {
            for (let x = 0; x < states.textChanged.length; x++) {
              let callback = states.textChanged[x];
              callback(element.parentNode || element, null, el.nodeValue);
            }
          }

          // Added state for transitions API.
          if (states && states.attached) {
            states.attached.forEach(callCallback, el);
          }

          titleCallback(el);
        });
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        if (states && states.detached) {
          states.detached.forEach(callCallback, patch.old);
        }

        // Ensure the title is emptied.
        if (patch.old.tagName === 'title') {
          patch.old.ownerDocument.title = '';
        }

        let customElement = components[oldDescriptor.nodeName] || {};

        if (customElement.detachedCallback) {
          customElement.detachedCallback.call(patch.old);
        }

        patch.old.parentNode.removeChild(patch.old);

        makeNode.nodes[oldDescriptor.element] = undefined;
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        // Append the element first, before doing the replacement.
        patch.old.parentNode.insertBefore(patch.new, patch.old.nextSibling);

        // Removed state for transitions API.
        if (states && states.detached) {
          states.detached.forEach(function(callback) {
            callback(patch.old);
          });
        }

        // Replaced state for transitions API.
        if (states && states.replaced) {
          states.replaced.forEach(function(callback) {
            callback(patch.old, patch.new);
          });
        }

        // Ensure the title is set correctly.
        if (patch.new.tagName === 'title') {
          patch.old.ownerDocument.title = patch.new.childNodes[0].nodeValue;
        }

        patch.old.parentNode.replaceChild(patch.new, patch.old);

        let oldCustomElement = components[oldDescriptor.nodeName] || {};
        let newCustomElement = components[newDescriptor.nodeName] || {};

        if (oldCustomElement.detachedCallback) {
          oldCustomElement.detachedCallback.call(patch.old);
        }

        if (newCustomElement.attachedCallback) {
          newCustomElement.attachedCallback.call(patch.new);
        }

        // Added state for transitions API.
        if (states && states.attached) {
          states.attached.forEach(function(callback) {
            callback(patch.new);
          });
        }

        makeNode.nodes[oldDescriptor.element] = undefined;
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === 2) {
      let originalValue = patch.element.getAttribute(patch.name);

      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }

      // Trigger all the attribute changed values.
      if (states && states.attributeChanged) {
        for (let x = 0; x < states.attributeChanged.length; x++) {
          let callback = states.attributeChanged[x];
          callback(patch.element, patch.name, originalValue, patch.value);

          let customElement = components[elementDescriptor.nodeName] || {};

          if (customElement.attributeChangedCallback) {
            customElement.attributeChangedCallback.call(patch.old,
              patch.name, originalValue, patch.value);
          }
        }
      }
    }

    // Text node manipulation.
    else if (patch.__do__ === 3) {
      let originalValue = patch.element.textContent;

      patch.element.textContent = decodeEntities(patch.value);

      // Trigger all the text changed values.
      if (states && states.textChanged) {
        for (let x = 0; x < states.textChanged.length; x++) {
          let callback = states.textChanged[x];
          callback(patch.element.parentNode, originalValue, patch.value);
        }
      }
    }
  }
}
