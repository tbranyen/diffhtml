import * as transition from '../transitions';
import { pools } from '../util/pools';
import makeElement from '../element/make';
import * as sync from '../node/sync';
import { TreeCache } from '../node/tree';
import { protectElement, unprotectElement } from '../util/memory';
import { decodeEntities } from '../util/entities';

const blockTextElements = [
  'script', 'noscript', 'style', 'pre', 'template'
];

const isElement = element => element.nodeType === 1;
const slice = Array.prototype.slice;

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

    var el = makeElement(descriptor);

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

      triggerTransition('textChanged', textPromises);
    }

    if (descriptor.attributes && descriptor.attributes.length) {
      descriptor.attributes.forEach(attr => {
        let attrChangePromises = transition.makePromises('attributeChanged',
          [el], attr.name, null, attr.value);

        triggerTransition('attributeChanged', attrChangePromises);
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
    let el = patch.element ? makeElement(patch.element) : null;
    let oldEl = patch.old ? makeElement(patch.old) : null;
    let newEl = patch.new ? makeElement(patch.new) : null;

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === sync.REMOVE_ELEMENT_CHILDREN) {
      let childNodes = slice.call(el.childNodes).filter(isElement);
      let detachPromises = transition.makePromises('detached', childNodes);

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
    else if (patch.__do__ === sync.REMOVE_ENTIRE_ELEMENT) {
      let childNodes = [el].filter(isElement);
      let detachPromises = transition.makePromises('detached', childNodes);

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
    else if (patch.__do__ === sync.REPLACE_ENTIRE_ELEMENT) {
      let allPromises = [];

      let attachedPromises = transition.makePromises('attached', [
        newEl
      ].filter(isElement));

      let detachedPromises = transition.makePromises('detached', [
        oldEl
      ].filter(isElement));

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

      unprotectElement(patch.old);

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
            unprotectElement(patch.new);

            throw new Error('Can\'t replace without parent, is this the ' +
              'document root?');
          }

          oldEl.parentNode.replaceChild(newEl, oldEl);
        }, ex => console.log(ex));
      }
      else {
        if (!oldEl.parentNode) {
          unprotectElement(patch.new);

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
        }).filter(isElement);

        // Turn elements into childNodes of the patch element.
        el.appendChild(fragment);

        // Trigger transitions.
        let makeAttached = transition.makePromises('attached', toAttach);
        triggerTransition('attached', makeAttached);
      }

      // Remove.
      else if (oldEl && !newEl) {
        if (!oldEl.parentNode) {
          unprotectElement(patch.old);

          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        let makeDetached = transition.makePromises('detached', [oldEl]);

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
        if (!oldEl.parentNode) {
          unprotectElement(patch.old);
          unprotectElement(patch.new);

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

        let attachPromises = transition.makePromises('attached', [
          newEl
        ].filter(isElement));

        let detachPromises = transition.makePromises('detached', [
          oldEl
        ].filter(isElement));

        let replacePromises = transition.makePromises(
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

          attached(patch.new);
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
          if (!oldEl.parentNode) {
            unprotectElement(patch.old);
            unprotectElement(patch.new);

            throw new Error('Can\'t replace without parent, is this the ' +
              'document root?');
          }

          oldEl.parentNode.replaceChild(newEl, oldEl);
          unprotectElement(patch.old);
          protectElement(patch.new);
        }
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === sync.MODIFY_ATTRIBUTE) {
      let attrChangePromises = transition.makePromises('attributeChanged',
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
            let isObject = typeof patch.value === 'object';
            let isFunction = typeof patch.value === 'function';

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
    else if (patch.__do__ === sync.CHANGE_TEXT) {
      let textChangePromises = transition.makePromises('textChanged',
        [el], el.nodeValue, patch.value);

      triggerTransition('textChanged', textChangePromises, promises => {
        const callback = () => {
          patch.element.nodeValue = decodeEntities(patch.value);
          el.nodeValue = patch.element.nodeValue;

          if (el.parentNode) {
            let nodeName = el.parentNode.nodeName.toLowerCase();

            if (blockTextElements.indexOf(nodeName) > -1) {
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
