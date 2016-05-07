import * as transition from '../transitions';
import { pools } from '../util/pools';
import getElement from '../element/get';
import { components, upgrade } from '../element/custom';
import makeNode from '../node/make';
import * as sync from '../node/sync';
import { TreeCache } from '../node/tree';
import { protectElement, unprotectElement } from '../util/memory';
import { decodeEntities } from '../util/entities';

const blockTextElements = [
  'script', 'noscript', 'style', 'pre', 'template'
];

/**
 * Processes an array of patches.
 *
 * @param element - Element to process patchsets on.
 * @param patches - Array that contains patch objects.
 */
export default function process(element, patches) {
  const elementMeta = TreeCache.get(element);
  const promises = [];
  const triggerTransition = transition.buildTrigger(promises);

  // Trigger the attached transition state for this element and all childNodes.
  var attached = function attached(descriptor, fragment, parentNode) {
    protectElement(descriptor);

    if (elementMeta.workerCache) {
      elementMeta.workerCache.push(descriptor);
    }

    var el = getElement(descriptor).element;

    // If the element added was a DOM text node or SVG text element, trigger
    // the textChanged transition.
    if (descriptor.nodeName === '#text') {
      let textPromises = transition.makePromises('textChanged',
        [el], null, descriptor.nodeValue);

      el.textContent = decodeEntities(descriptor.nodeValue);

      if (parentNode) {
        let nodeName = parentNode.nodeName.toLowerCase();

        if (blockTextElements.indexOf(nodeName) > -1) {
          parentNode.nodeValue = decodeEntities(descriptor.nodeValue);
        }
      }

      triggerTransition('textChanged', textPromises, promises => {});
    }

    if (descriptor.attributes && descriptor.attributes.length) {
      descriptor.attributes.forEach(attr => {
        let attrChangePromises = transition.makePromises('attributeChanged',
          [el], attr.name, null, attr.value);

        triggerTransition('attributeChanged', attrChangePromises,
          promises => {});
      });
    }

    // Call all `childNodes` attached callbacks as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      descriptor.childNodes.forEach(x => attached(x, null, el));
    }

    // If a document fragment was specified, append the real element into it.
    if (fragment) {
      fragment.appendChild(el);
    }

    return el;
  };

  // Loop through all the patches and apply them.
  for (let i = 0; i < patches.length; i++) {
    let patch = patches[i];
    let el = patch.element ? getElement(patch.element).element : null;
    let oldEl = patch.old ? getElement(patch.old).element : null;
    let newEl = patch.new ? getElement(patch.new).element : null;

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === sync.REMOVE_ELEMENT_CHILDREN) {
      let childNodes = el.childNodes;
      let detachPromises = transition.makePromises('detached', childNodes);

      triggerTransition('detached', detachPromises, promises => {
        patch.toRemove.forEach(x => unprotectElement(x, makeNode));
        el.innerHTML = '';
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === sync.REMOVE_ENTIRE_ELEMENT) {
      let detachPromises = transition.makePromises('detached', [el]);

      if (el.parentNode) {
        triggerTransition('detached', detachPromises, promises => {
          el.parentNode.removeChild(el);
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
      let attachedPromises = transition.makePromises('attached', [newEl]);
      let detachedPromises = transition.makePromises('detached', [oldEl]);
      let replacedPromises = transition.makePromises(
        'replaced', [oldEl], newEl
      );

      // Add all the transition state promises into the main array, we'll use
      // them all to decide when to alter the DOM.
      triggerTransition('detached', detachedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
      });

      triggerTransition('attached', attachedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
        attached(patch.new, null, newEl);
      });

      triggerTransition('replaced', replacedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
      });

      unprotectElement(patch.old, makeNode);

      // Reset the tree cache.
      TreeCache.set(newEl, {
        oldTree: patch.new,
        element: newEl
      });

      // Once all the promises have completed, invoke the action, if no
      // promises were added, this will be a synchronous operation.
      if (allPromises.length) {
        Promise.all(allPromises).then(function replaceEntireElement() {
          if (!oldEl.parentNode) {
            unprotectElement(patch.new, makeNode);

            throw new Error('Can\'t replace without parent, is this the ' +
              'document root?');
          }

          oldEl.parentNode.replaceChild(newEl, oldEl);
        }, ex => console.log(ex));
      }
      else {
        if (!oldEl.parentNode) {
          unprotectElement(patch.new, makeNode);

          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
    }

    // Node manip.
    else if (patch.__do__ === sync.MODIFY_ELEMENT) {
      // Add.
      if (el && patch.fragment && !oldEl) {
        let fragment = document.createDocumentFragment();

        // Loop over every element to be added and process the descriptor
        // into the real element and append into the DOM fragment.
        var toAttach = patch.fragment.map(el => {
          return attached(el, fragment, el);
        });

        // Turn elements into childNodes of the patch element.
        el.appendChild(fragment);

        // Trigger transitions.
        let makeAttached = transition.makePromises('attached', toAttach);
        triggerTransition('attached', makeAttached);
      }

      // Remove.
      else if (oldEl && !newEl) {
        if (!oldEl.parentNode) {
          unprotectElement(patch.old, makeNode);

          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        let makeDetached = transition.makePromises('detached', [oldEl]);

        triggerTransition('detached', makeDetached, () => {
          // And then empty out the entire contents.
          oldEl.innerHTML = '';

          if (oldEl.parentNode) {
            oldEl.parentNode.removeChild(oldEl);
          }

          unprotectElement(patch.old, makeNode);
        });
      }

      // Replace.
      else if (oldEl && newEl) {
        if (!oldEl.parentNode) {
          unprotectElement(patch.old, makeNode);
          unprotectElement(patch.new, makeNode);

          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        // Append the element first, before doing the replacement.
        if (oldEl.nextSibling) {
          oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
        }
        else {
          oldEl.parentNode.appendChild(newEl);
        }

        // Removed state for transitions API.
        let allPromises = [];
        let attachPromises = transition.makePromises('attached', [newEl]);
        let detachPromises = transition.makePromises('detached', [oldEl]);
        let replacePromises = transition.makePromises(
          'replaced', [oldEl], newEl
        );

        triggerTransition('detached', detachPromises, promises => {
          allPromises.push.apply(allPromises, promises);
        });

        triggerTransition('attached', attachPromises, promises => {
          allPromises.push.apply(allPromises, promises);
          attached(patch.new);
        });

        triggerTransition('replaced', replacePromises, promises => {
          allPromises.push.apply(allPromises, promises);
        });

        // Once all the promises have completed, invoke the action, if no
        // promises were added, this will be a synchronous operation.
        if (allPromises.length) {
          Promise.all(allPromises).then(function replaceElement() {
            oldEl.parentNode.replaceChild(newEl, oldEl);
            unprotectElement(patch.old, makeNode);

            protectElement(patch.new);

            if (elementMeta.workerCache) {
              elementMeta.workerCache.push(patch.new);
            }
          }, ex => console.log(ex));
        }
        else {
          if (!oldEl.parentNode) {
            unprotectElement(patch.old, makeNode);
            unprotectElement(patch.new, makeNode);

            throw new Error('Can\'t replace without parent, is this the ' +
              'document root?');
          }

          oldEl.parentNode.replaceChild(newEl, oldEl);
          unprotectElement(patch.old, makeNode);
          protectElement(patch.new);

          if (elementMeta.workerCache) {
            elementMeta.workerCache.push(patch.new);
          }
        }
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === sync.MODIFY_ATTRIBUTE) {
      let attrChangePromises = transition.makePromises('attributeChanged',
        [el], patch.name, el.getAttribute(patch.name), patch.value);

      triggerTransition('attributeChanged', attrChangePromises, promises => {
        // Remove.
        if (patch.value === undefined) {
          el.removeAttribute(patch.name);

          if (patch.name in el) {
            el[patch.name] = undefined;
          }
        }
        // Change.
        else {
          // Is an attribute.
          if (typeof patch.value === 'string') {
            el.setAttribute(patch.name, patch.value);
          }
          // Is a property.
          else {
            // Necessary to track the attribute/prop existence.
            el.setAttribute(patch.name, '');
            el[patch.name] = patch.value;
          }

          // If an `is` attribute was set, we should upgrade it.
          upgrade(patch.element.nodeName, el, patch.element);

          // Support live updating of the value attribute.
          // Support live updating of the value attribute.
          if (patch.name === 'value' || patch.name === 'checked') {
            el[patch.name] = patch.value;
          }
        }
      });
    }

    // Text node manipulation.
    else if (patch.__do__ === sync.CHANGE_TEXT) {
      let textChangePromises = transition.makePromises('textChanged',
        [el], el.nodeValue, patch.value);

      triggerTransition('textChanged', textChangePromises, promises => {
        patch.element.nodeValue = decodeEntities(patch.value);
        el.nodeValue = patch.element.nodeValue;

        if (el.parentNode) {
          let nodeName = el.parentNode.nodeName.toLowerCase();

          if (blockTextElements.indexOf(nodeName) > -1) {
            el.parentNode.nodeValue = patch.element.nodeValue;
          }
        }
      });
    }
  }

  // Return the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  return promises.filter(Boolean);
}
