import * as transition from '../transitions';
import { pools } from '../util/pools';
import getElement from '../element/get';
import { components } from '../element/custom';
import makeNode from '../node/make';
import * as sync from '../node/sync';
import { unprotectElement } from '../util/memory';
import { decodeEntities } from '../util/entities';

const blockTextElements = ['script', 'noscript', 'style', 'pre'];

/**
 * Processes an Array of patches.
 *
 * @param element - Element to process patchsets on.
 * @param e - Object that contains patches.
 */
export default function process(element, patches) {
  var promises = [];
  var triggerTransition = transition.buildTrigger(promises);

  // Trigger the attached transition state for this element and all childNodes.
  var attached = function(descriptor, fragment) {
    var element = getElement(descriptor).element;

    // If the element added was a DOM text node or SVG text element, trigger
    // the textChanged transition.
    if (descriptor.nodeName === '#text' || descriptor.nodeName === 'text') {
      let textPromises = transition.makePromises('textChanged',
        [element], null, descriptor.nodeValue);

      if (descriptor.nodeName === 'text') {
        element.innerText = descriptor.nodeValue;
      } else {
        element.innerHTML = descriptor.nodeValue;
      }

      triggerTransition('textChanged', textPromises, promises => {});
    }

    // Call all `childNodes` attached callbacks as well.
    descriptor.childNodes.forEach(descriptor => attached(descriptor));

    // If a document fragment was specified, append the real element into it.
    if (fragment) {
      fragment.appendChild(element);
    }

    return element;
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

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === sync.REMOVE_ELEMENT_CHILDREN) {
      let childNodes = patch.element.childNodes;
      let detachPromises = transition.makePromises('detached', childNodes);

      triggerTransition('detached', detachPromises, promises => {
        patch.toRemove.forEach(x => unprotectElement(x, makeNode));
        patch.element.innerHTML = '';
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === sync.REMOVE_ENTIRE_ELEMENT) {
      let detachPromises = transition.makePromises('detached', [patch.elemnt]);

      if (patch.element.parentNode) {
        triggerTransition('detached', detachPromises, promises => {
          patch.element.parentNode.removeChild(patch.element);
          patch.toRemove.forEach(x => unprotectElement(x, makeNode));
        });
      }
      else {
        patch.toRemove.forEach(x => unprotectElement(x, makeNode));
      }
    }

    // Replace the entire Node.
    else if (patch.__do__ === sync.REPLACE_ENTIRE_ELEMENT) {
      let allPromises = [];
      let attachedPromises = transition.makePromises('attached', [patch.new]);
      let detachedPromises = transition.makePromises('detached', [patch.old]);
      let replacedPromises = transition.makePromises(
        'replaced', [patch.old], patch.new
      );

      // Add all the transition state promises into the main array, we'll use
      // them all to decide when to alter the DOM.
      triggerTransition('detached', detachedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
      });

      triggerTransition('attached', attachedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
        attached(newDescriptor);
      });

      triggerTransition('replaced', replacedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
      });

      // Once all the promises have completed, invoke the action, if no
      // promises were added, this will be a synchronous operation.
      if (allPromises.length) {
        Promise.all(allPromises).then(function() {
          patch.old.parentNode.replaceChild(patch.new, patch.old);
          unprotectElement(oldDescriptor, makeNode);
        });
      }
      else {
        patch.old.parentNode.replaceChild(patch.new, patch.old);
        unprotectElement(oldDescriptor, makeNode);
      }
    }

    // Node manip.
    else if (patch.__do__ === sync.MODIFY_ELEMENT) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        let fragment = document.createDocumentFragment();

        // Loop over every element to be added and process the descriptor
        // into the real element and append into the DOM fragment.
        var toAttach = patch.fragment.map(x => attached(x, fragment));

        // Turn elements into childNodes of the patch element.
        patch.element.appendChild(fragment);

        // Trigger transitions.
        let makeAttached = transition.makePromises('attached', toAttach);
        triggerTransition('attached', makeAttached);
      }

      // Remove.
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        let makeDetached = transition.makePromises('detached', [patch.old]);

        triggerTransition('detached', makeDetached, () => {
          // And then empty out the entire contents.
          patch.old.innerHTML = '';

          if (patch.old.parentNode) {
            patch.old.parentNode.removeChild(patch.old);
          }

          unprotectElement(oldDescriptor, makeNode);
        });
      }

      // Replace.
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        // Append the element first, before doing the replacement.
        if (patch.old.nextSibling) {
          patch.old.parentNode.insertBefore(patch.new, patch.old.nextSibling);
        }
        else {
          patch.old.parentNode.appendChild(patch.new);
        }

        // Removed state for transitions API.
        let allPromises = [];
        let attachPromises = transition.makePromises('attached', [patch.new]);
        let detachPromises = transition.makePromises('detached', [patch.old]);
        let replacePromises = transition.makePromises(
          'replaced', [patch.old], patch.new
        );

        triggerTransition('detached', detachPromises, promises => {
          allPromises.push.apply(allPromises, promises);
        });

        triggerTransition('attached', attachPromises, promises => {
          allPromises.push.apply(allPromises, promises);
          attached(newDescriptor);
        });

        triggerTransition('replaced', replacePromises, promises => {
          allPromises.push.apply(allPromises, promises);
        });

        // Once all the promises have completed, invoke the action, if no
        // promises were added, this will be a synchronous operation.
        if (allPromises.length) {
          Promise.all(allPromises).then(function() {
            patch.old.parentNode.replaceChild(patch.new, patch.old);
            unprotectElement(oldDescriptor, makeNode);
          });
        }
        else {
          patch.old.parentNode.replaceChild(patch.new, patch.old);
          unprotectElement(oldDescriptor, makeNode);
        }
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === sync.MODIFY_ATTRIBUTE) {
      let attrChangePromises = transition.makePromises('attributeChanged',
        [patch.element], patch.name, patch.element.getAttribute(patch.name),
          patch.value);

      triggerTransition('attributeChanged', attrChangePromises, promises => {
        // Remove.
        if (patch.value === undefined) {
          patch.element.removeAttribute(patch.name);
        }
        // Change.
        else {
          patch.element.setAttribute(patch.name, patch.value);

          // Support live updating of the value attribute.
          if (patch.name === 'value') {
            patch.element[patch.name] = patch.value;
          }
        }
      });
    }

    // Text node manipulation.
    else if (patch.__do__ === sync.CHANGE_TEXT) {
      let textChangePromises = transition.makePromises('textChanged',
        [patch.element], patch.element.nodeValue, patch.value);

      triggerTransition('textChanged', textChangePromises, promises => {
        patch.element.nodeValue = decodeEntities(patch.value);

        if (patch.element.parentNode) {
          let nodeName = patch.element.parentNode.nodeName.toLowerCase();

          if (blockTextElements[nodeName]) {
            patch.element.parentNode.nodeValue = decodeEntities(patch.value);
          }
        }
      });
    }
  }

  var activePromises = promises.filter(Boolean);

  // Wait until all transition promises have resolved.
  if (activePromises.length) {
    return Promise.all(promises.filter(Boolean));
  }
}
