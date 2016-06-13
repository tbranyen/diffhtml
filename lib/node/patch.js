import makeNode from './make';
import { makePromises, buildTrigger } from '../util/transitions';
import { blockText } from '../util/parser';
import { StateCache } from '../util/cache';
import { protectElement, unprotectElement } from '../util/memory';
import { decodeEntities } from '../util/entities';
import {
  REMOVE_ELEMENT_CHILDREN,
  REMOVE_ENTIRE_ELEMENT,
  REPLACE_ENTIRE_ELEMENT,
  MODIFY_ELEMENT,
  MODIFY_ATTRIBUTE,
  CHANGE_TEXT,
} from '../tree/sync';

const isElementNode = node => node.nodeType === 1;
const filter = Array.prototype.filter;


/**
 * Looks to see if an element can be replaced. It must have a parentNode to do
 * so. This will trigger an error when the element does not have a parentNode.
 * This typically happens when trying to replace a disconnected DOM Node or the
 * documentElement.
 *
 * @param {String} verb - Verb to replace in the template string
 * @param {Object} oldNode - Old DOM Node to check if able to be replaced
 * @param {Object} patch - Used to clean up vTree references
 */
const checkForMissingParent = (verb, oldNode, patch) => {
  if (!oldNode.parentNode) {
    // Clean up these elements to keep memory consistent.
    unprotectElement(patch.old);
    unprotectElement(patch.new);

    // Throw an error to stop rendering/inform the developer.
    throw new Error(`
      Can't ${verb} without parent, is this the document root?
    `.trim());
  }
};

// Trigger the attached transition state for this element and all childNodes.
const attached = ({ vTree, fragment, parentNode, triggerTransition }) => {
  // This element has been attached, so it should definitely be marked as
  // protected.
  protectElement(vTree);

  // Create a DOM Node for this Virtual Tree element.
  const node = makeNode(vTree);

  // If the element added was a DOM text node or SVG text element, trigger
  // the textChanged transition.
  if (vTree.nodeName === '#text') {
    const promises = makePromises(
      'textChanged', [node], null, vTree.nodeValue
    );

    node.nodeValue = decodeEntities(vTree.nodeValue);

    if (parentNode) {
      const nodeName = parentNode.nodeName.toLowerCase();

      if (blockText.has(nodeName)) {
        parentNode.nodeValue = decodeEntities(vTree.nodeValue);
      }
    }

    triggerTransition('textChanged', promises);
  }

  vTree.attributes.forEach(attr => {
    triggerTransition('attributeChanged', makePromises(
      'attributeChanged', [node], attr.name, null, attr.value
    ));
  });

  // Call all `childNodes` attached callbacks as well.
  vTree.childNodes.forEach(vTree => attached({
    vTree, parentNode: node, triggerTransition
  }));

  // If a Document Fragment was specified, append the DOM Node into it.
  if (fragment) {
    fragment.appendChild(node);
  }

  return node;
};

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
export default function patchNode(node, patches) {
  const state = StateCache.get(state);
  const promises = [];
  const triggerTransition = buildTrigger(promises);

  // Loop through all the patches and apply them.
  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    const el = makeNode(patch.element);
    const oldEl = makeNode(patch.old);
    const newEl = makeNode(patch.new);

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === REMOVE_ELEMENT_CHILDREN) {
      const childNodes = filter.call(el.childNodes, isElementNode);
      const detachPromises = makePromises('detached', childNodes);

      triggerTransition('detached', detachPromises, promises => {
        const callback = () => {
          unprotectElement(patch.toRemove);
          el.innerHTML = '';
        };

        if (promises && promises.length) {
          Promise.all(promises).then(callback);
        }
        else {
          callback();
        }
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === REMOVE_ENTIRE_ELEMENT) {
      const childNodes = [el].filter(isElementNode);
      const detachPromises = makePromises('detached', childNodes);

      if (el.parentNode) {
        triggerTransition('detached', detachPromises, promises => {
          const callback = () => {
            el.parentNode.removeChild(el);
            unprotectElement(patch.toRemove);
          };

          if (promises && promises.length) {
            Promise.all(promises).then(callback);
          }
          else {
            callback();
          }
        });
      }
      else {
        unprotectElement(patch.toRemove);
      }
    }

    // Replace the entire Node.
    else if (patch.__do__ === REPLACE_ENTIRE_ELEMENT) {
      const allPromises = [];

      const attachedPromises = makePromises('attached', [
        newEl
      ].filter(isElementNode));

      const detachedPromises = makePromises('detached', [
        oldEl
      ].filter(isElementNode));

      const replacedPromises = makePromises(
        'replaced', [oldEl], newEl
      );

      // Add all the transition state promises into the main array, we'll use
      // them all to decide when to alter the DOM.
      triggerTransition('detached', detachedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
      });

      triggerTransition('attached', attachedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
        attached({ vTree: patch.new, triggerTransition });
      });

      triggerTransition('replaced', replacedPromises, promises => {
        allPromises.push.apply(allPromises, promises);
      });

      unprotectElement(patch.old);

      // Reset the tree cache. TODO Look into this...
      StateCache.set(newEl, {
        oldTree: patch.new,
        element: newEl
      });

      // Once all the promises have completed, invoke the action, if no
      // promises were added, this will be a synchronous operation.
      if (allPromises.length) {
        Promise.all(allPromises).then(function replaceEntireElement() {
          checkForMissingParent(oldEl, patch);
          oldEl.parentNode.replaceChild(newEl, oldEl);
        }, ex => console.log(ex));
      }
      else {
        if (!oldEl.parentNode) {
          unprotectElement(patch.new);
          throw new Error(replaceFailMsg);
        }

        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
    }

    // Node manip.
    else if (patch.__do__ === MODIFY_ELEMENT) {
      // Add.
      if (el && patch.fragment && !oldEl) {
        const fragment = document.createDocumentFragment();

        // Loop over every element to be added and process the Virtual Tree
        // element into the DOM Node and append into the DOM fragment.
        const toAttach = patch.fragment.map(vTree => attached({
          vTree, fragment, triggerTransition
        })).filter(isElementNode);

        // Turn elements into childNodes of the patch element.
        el.appendChild(fragment);

        // Trigger transitions.
        const makeAttached = makePromises('attached', toAttach);
        triggerTransition('attached', makeAttached);
      }

      // Remove.
      else if (oldEl && !newEl) {
        // Ensure we can remove the old DOM Node.
        checkForMissingParent('remove', oldEl, patch);

        const makeDetached = makePromises('detached', [oldEl]);

        triggerTransition('detached', makeDetached, (promises) => {
          const callback = () => {
            if (oldEl.parentNode) {
              oldEl.parentNode.removeChild(oldEl);
            }

            // And then empty out the entire contents.
            oldEl.innerHTML = '';

            unprotectElement(patch.old);
          };

          if (promises && promises.length) {
            Promise.all(promises).then(callback);
          }
          else {
            callback();
          }
        });
      }

      // Replace.
      else if (oldEl && newEl) {
        // Ensure we can replace the old DOM Node.
        checkForMissingParent('replace', oldEl, patch);

        // Append the element first, before doing the replacement.
        if (oldEl.nextSibling) {
          oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
        }
        else {
          oldEl.parentNode.appendChild(newEl);
        }

        // Removed state for transitions API.
        const allPromises = [];

        const attachPromises = makePromises('attached', [
          newEl
        ].filter(isElementNode));

        const detachPromises = makePromises('detached', [
          oldEl
        ].filter(isElementNode));

        const replacePromises = makePromises(
          'replaced', [oldEl], newEl
        );

        triggerTransition('replaced', replacePromises, promises => {
          if (promises && promises.length) {
            allPromises.push.apply(allPromises, promises);
          }
        });

        triggerTransition('detached', detachPromises, promises => {
          if (promises && promises.length) {
            allPromises.push.apply(allPromises, promises);
          }
        });

        triggerTransition('attached', attachPromises, promises => {
          if (promises && promises.filter(Boolean).length) {
            allPromises.push.apply(allPromises, promises);
          }

          attached({ vTree: patch.new, triggerTransition });
        });

        // Once all the promises have completed, invoke the action, if no
        // promises were added, this will be a synchronous operation.
        if (allPromises.length) {
          Promise.all(allPromises).then(function replaceElement() {
            if (oldEl.parentNode) {
              oldEl.parentNode.replaceChild(newEl, oldEl);
            }

            unprotectElement(patch.old);

            protectElement(patch.new);
          }, ex => console.log(ex));
        }
        else {
          checkForMissingParent('replace', oldEl, patch);

          oldEl.parentNode.replaceChild(newEl, oldEl);
          unprotectElement(patch.old);
          protectElement(patch.new);
        }
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === MODIFY_ATTRIBUTE) {
      const attrChangePromises = makePromises('attributeChanged',
        [el], patch.name, el.getAttribute(patch.name), patch.value);

      triggerTransition('attributeChanged', attrChangePromises, promises => {
        const callback = () => {
          // Remove.
          if (patch.value === undefined) {
            el.removeAttribute(patch.name);

            if (patch.name in el) {
              el[patch.name] = undefined;
            }
          }
          // Change attributes.
          else {
            const isObject = typeof patch.value === 'object';
            const isFunction = typeof patch.value === 'function';

            // If not a dynamic type, set as an attribute, since it's a valid
            // attribute value.
            if (!isObject && !isFunction) {
              if (patch.name) {
                el.setAttribute(patch.name, patch.value);
              }
            }
            else if (typeof patch.value !== 'string') {
              // Necessary to track the attribute/prop existence.
              el.setAttribute(patch.name, '');

              // Since this is a dynamic value it gets set as a property.
              el[patch.name] = patch.value;
            }

            // Support live updating of the value attribute.
            if (patch.name === 'value' || patch.name === 'checked') {
              el[patch.name] = patch.value;
            }
          }
        };

        if (promises && promises.length) {
          Promise.all(promises).then(
            callback, function unhandledException() {}
          );
        }
        else {
          callback();
        }
      });
    }

    // Text node manipulation.
    else if (patch.__do__ === CHANGE_TEXT) {
      const textChangePromises = makePromises('textChanged',
        [el], el.nodeValue, patch.value);

      triggerTransition('textChanged', textChangePromises, promises => {
        const callback = () => {
          patch.element.nodeValue = decodeEntities(patch.value);
          el.nodeValue = patch.element.nodeValue;

          if (el.parentNode) {
            const nodeName = el.parentNode.nodeName.toLowerCase();

            if (blockText.has(nodeName)) {
              el.parentNode.nodeValue = decodeEntities(patch.element.nodeValue);
            }
          }
        };

        if (promises && promises.length) {
          Promise.all(promises).then(callback);
        }
        else {
          callback();
        }
      });
    }
  }

  // Return the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  return promises.filter(Boolean);
}
