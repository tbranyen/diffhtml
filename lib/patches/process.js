import { transitionStates } from '../transitions';
import { pools as _pools } from '../util/pools';
import getElement from '../element/get';
import makeNode from '../node/make';

let pools = _pools;

/**
 * Processes an Array of patches.
 *
 * @param e
 * @return
 */
export default function process(element, e) {
  var patches = e.data;
  var states = transitionStates;

  var callCallback = function(callback) {
    callback(this);
  };

  var attachedCallback = function(elementDescriptor) {
    var el = getElement(elementDescriptor).element;

    this.fragment.appendChild(el);

    // Trigger all the text changed values.
    if (states && el.nodeName === '#text' && states.textChanged) {
      for (var x = 0; x < states.textChanged.length; x++) {
        var callback = states.textChanged[x];
        callback(fragment.parentNode || element, null, fragment.textContent);
      }
    }

    // Added state for transitions API.
    if (states && states.attached) {
      states.attached.forEach(callCallback, el);
    }
  };

  var titleCallback = function(elementDescriptor) {
    var el = getElement(elementDescriptor).element;

    // Ensure the title is set correctly.
    if (el.tagName === 'title') {
      el.ownerDocument.title = el.childNodes[0].nodeValue;
    }
  };

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    let patch = patches[i];
    let elementId, oldId, newId, result;

    if (patch.element) {
      result = getElement(patch.element);
      patch.element = result.element;
      elementId = result.uuid;
    }

    if (patch.old) {
      result = getElement(patch.old);
      patch.old = result.element;
      oldId = result.uuid;
    }

    if (patch.new) {
      result = getElement(patch.new);
      patch.new = result.element;
      newId = result.uuid;
    }

    // Replace the entire Node.
    if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch.new, patch.old);
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        var fragment = document.createDocumentFragment();

        patch.fragment.forEach(attachedCallback, { fragment });
        patch.element.appendChild(fragment);
        patch.fragment.forEach(titleCallback);
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

        patch.old.parentNode.removeChild(patch.old);

        pools.uuid.free(oldId);

        makeNode.nodes[oldId] = undefined;
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        // Append the element first, before doing the replacement.
        patch.old.parentNode.insertBefore(patch.new, patch.old.nextSibling);

        // Added state for transitions API.
        if (states && states.attached) {
          states.attached.forEach(function(callback) {
            callback(patch.new);
          });
        }

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

        pools.uuid.free(oldId);

        makeNode.nodes[oldId] = undefined;
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === 2) {
      var originalValue = patch.element.getAttribute(patch.name);

      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }

      // Trigger all the attribute changed values.
      if (states && states.attributeChanged) {
        for (var x = 0; x < states.attributeChanged.length; x++) {
          var callback = states.attributeChanged[x];
          callback(patch.element, patch.name, originalValue, patch.value);
        }
      }
    }

    // Text node manipulation.
    else if (patch.__do__ === 3) {
      var originalValue = patch.element.textContent;

      patch.element.textContent = patch.value;

      if (patch.element.parentNode === null) {
        document.title = patch.value;
      }
      else {
        // Trigger all the text changed values.
        if (states && states.textChanged) {
          for (var x = 0; x < states.textChanged.length; x++) {
            var callback = states.textChanged[x];
            callback(patch.element.parentNode, originalValue, patch.value);
          }
        }
      }
    }
  }
}
