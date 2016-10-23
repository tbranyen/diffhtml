import makeNode from './make';
import makeTree from '../tree/make';
import { makePromises, buildTrigger } from '../util/transitions';
import { blockText } from '../util/parser';
import { StateCache } from '../util/cache';
import * as pools from '../util/pools';
import { protectElement, unprotectElement } from '../util/memory';
import { decodeEntities } from '../util/entities';
import {
  REPLACE_ELEMENT,
  REMOVE_ELEMENT,
  APPEND_ELEMENT,
  PREPEND_ELEMENT,
  MODIFY_ATTRIBUTE,
  CHANGE_TEXT,
} from '../tree/sync';

const isElementNode = node => node.nodeType === 1;
const { filter } = Array.prototype;
const empty = () => {};
const emptyArray = [];

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
    unprotectElement(patch.oldTree);
    unprotectElement(patch.newTree);
    unprotectElement(patch.element);
    unprotectElement(patch.toRemove);

    // Empty the state caches for all existing elements.
    StateCache.delete(patch.oldTree);
    StateCache.delete(patch.newTree);
    StateCache.delete(patch.element);

    // Throw an error to stop rendering/inform the developer.
    throw new Error(`
      Can't ${verb} without parent, is this the document root?
    `.trim());
  }
};

// Trigger the attached transition state for this element and all childNodes.
const attach = ({ vTree, fragment, parentNode, trigger, state }) => {
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

    trigger('textChanged', promises, empty);
  }

  vTree.attributes.forEach(attr => {
    trigger('attributeChanged', makePromises(
      'attributeChanged', [node], attr.name, null, attr.value
    ), empty);
  });

  // Call all `childNodes` attached callbacks as well.
  vTree.childNodes.forEach(vTree => attach({
    vTree, parentNode: node, trigger, state
  }));

  // If a Document Fragment was specified, append the DOM Node into it.
  if (fragment) {
    fragment.innerHTML = '';
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
  const state = StateCache.get(node);
  const promises = [];
  const trigger = buildTrigger(promises);

  // Loop through all the patches and apply them.
  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    const node = makeNode(patch.element);
    const oldNode = makeNode(patch.oldTree);
    const newNode = makeNode(patch.newTree);

    // Node manip.
    if (patch.type === APPEND_ELEMENT) {
      const fragment = document.createDocumentFragment();

      // Loop over every element to be added and process the Virtual Tree
      // element into the DOM Node and append into the DOM fragment.
      const toAttach = patch.fragment.map(vTree => attach({
        vTree, fragment, trigger, state
      })).filter(isElementNode);

      // Turn elements into childNodes of the patch element.
      node.appendChild(fragment);

      // Add the new virtual trees into the existing tree.
      for (let i = 0; i < patch.fragment.length; i++) {
        patch.element.childNodes.push(patch.fragment[i]);
      }

      // Trigger the attached transitions.
      trigger('attached', makePromises('attached', toAttach), empty);
    }

    else if (patch.type === PREPEND_ELEMENT) {
      const fragment = document.createDocumentFragment();

      // Loop over every element to be added and process the Virtual Tree
      // element into the DOM Node and append into the DOM fragment.
      const toAttach = patch.fragment.map(vTree => attach({
        vTree, fragment, trigger, state
      })).filter(isElementNode);

      // Turn elements into childNodes of the patch element.
      node.insertBefore(fragment, oldNode);

      // Protect all the new elements being added.
      patch.fragment.forEach(protectElement);

      const index = patch.element.childNodes.indexOf(patch.oldTree);

      // Add the new virtual trees into the existing tree.
      const childNodes = patch.element.childNodes;

      if (index !== -1) {
        childNodes.splice.apply(childNodes, [index, 0].concat(patch.fragment));
      }

      // Trigger the attached transitions.
      trigger('attached', makePromises('attached', toAttach), empty);
    }

    else if (patch.type === REMOVE_ELEMENT) {
      // Ensure we can remove from the DOM Node.
      //checkForMissingParent('remove', node, patch);
      const { oldTree } = patch;
      const fragment = patch.fragment || emptyArray;

      if (oldTree) {
        fragment.push(oldTree);
      }

      const normalize = fragment.map(makeNode).filter(isElementNode);

      // Synchronously complete, unless there are transitions. If there are
      // transitions this callback will be called once the Promise resolves.
      const callback = () => {
        // Remove these items from the fragment and unprotect them.
        for (let i = 0; i < fragment.length; i++) {
          const tree = fragment[i];
          const childNode = makeNode(tree);

          if (node) {
            node.removeChild(childNode);
          }
          else if (childNode.parentNode) {
            childNode.parentNode.removeChild(childNode);
          }

          unprotectElement(tree);

          if (patch.element) {
            const index = patch.element.childNodes.indexOf(tree);
            patch.element.childNodes.splice(index, 1);
          }
        }
      };

      // Trigger the detached transitions.
      trigger('detached', makePromises('detached', normalize), (promises) => {
        if (promises.length) {
          Promise.all(promises).then(callback);
        }
        else {
          callback();
        }
      });
    }

    else if (patch.type === REPLACE_ELEMENT) {
      // Ensure we can replace the old DOM Node.
      checkForMissingParent('replace', oldNode, patch);

      // Append the element first, before doing the replacement.
      if (oldNode.nextSibling) {
        oldNode.parentNode.insertBefore(newNode, oldNode.nextSibling);
      }
      else {
        oldNode.parentNode.appendChild(newNode);
      }

      // Removed state for transitions API.
      const allPromises = [];

      const attachPromises = makePromises('attached', [
        newNode
      ].filter(isElementNode));

      const detachPromises = makePromises('detached', [
        oldNode
      ].filter(isElementNode));

      const replacePromises = makePromises(
        'replaced', [oldNode], newNode
      );

      trigger('replaced', replacePromises, promises => {
        if (promises.length) {
          allPromises.push.apply(allPromises, promises);
        }
      });

      trigger('detached', detachPromises, promises => {
        if (promises.length) {
          allPromises.push.apply(allPromises, promises);
        }
      });

      trigger('attached', attachPromises, promises => {
        if (promises.length) {
          allPromises.push.apply(allPromises, promises);
        }

        attach({ vTree: patch.newTree, trigger, state });
      });

      const callback = () => {
        checkForMissingParent('replace', oldNode, patch);

        const parent = node || oldNode.parentNode;

        parent.replaceChild(newNode, oldNode);

        // Try and get the parent as a virtual node.
        const childNodes = (patch.element || makeTree(parent)).childNodes;
        const oldIndex = childNodes.indexOf(patch.oldTree);

        // Update the previous nodes with the new values.
        childNodes.splice(oldIndex, 1, patch.newTree);

        // Top-level element, and we need to reset the StateCache.
        if (!node) {
          StateCache.set(newNode, {
            oldTree: patch.newTree,
            element: newNode,
          });
        }

        // Since we have replaced the element, do not track.
        unprotectElement(patch.oldTree);
      };

      // Once all the promises have completed, invoke the action, if no
      // promises were added, this will be a synchronous operation.
      if (allPromises.length) {
        Promise.all(allPromises).then(callback);
      }
      else {
        callback();
      }
    }

    // Attribute manipulation.
    else if (patch.type === MODIFY_ATTRIBUTE) {
      const attributes = patch.attributes;

      attributes.forEach(({ oldAttr, newAttr }) => {
        const name = newAttr ? newAttr.name : oldAttr.name;
        const value = (oldAttr ? oldAttr.value : undefined) || null;
        const newValue = newAttr ? newAttr.value : null;

        const attrChangePromises = makePromises(
          'attributeChanged', [node], name, value, newValue
        );

        const callback = () => {
          // Always remove the old attribute, we never re-use it.
          if (oldAttr) {
            pools.attributeObject.unprotect(oldAttr);

            // Remove the Virtual Tree Attribute from the element and memory.
            if (!newAttr || !newAttr.name) {
              node.removeAttribute(oldAttr.name);

              if (oldAttr.name in node) {
                node[oldAttr.name] = undefined;
              }
            }
          }

          // Add/Change the attribute or property.
          if (newAttr) {
            const isObject = typeof newAttr.value === 'object';
            const isFunction = typeof newAttr.value === 'function';

            // Protect the Virtual Attribute object.
            pools.attributeObject.protect(newAttr);

            // If not a dynamic type, set as an attribute, since it's a valid
            // attribute value.
            if (!isObject && !isFunction) {
              node.setAttribute(newAttr.name, decodeEntities(newAttr.value));
            }
            else {
              // Necessary to track the attribute/prop existence.
              node.setAttribute(newAttr.name, '');

              // Since this is a dynamic value it gets set as a property.
              node[newAttr.name] = newAttr.value;
            }

            // Support live updating of the value attribute.
            if (newAttr.name === 'value' || newAttr.name === 'checked') {
              node[newAttr.name] = newAttr.value;
            }
          }
        };

        trigger('attributeChanged', attrChangePromises, promises => {
          if (promises.length) {
            Promise.all(promises).then(callback);
          }
          else {
            callback();
          }
        });
      });
    }

    // Text node manipulation.
    else if (patch.type === CHANGE_TEXT) {
      const textChangePromises = makePromises(
        'textChanged', [node], node.nodeValue, patch.value
      );

      const callback = () => {
        patch.element.nodeValue = decodeEntities(patch.value);
        node.nodeValue = patch.element.nodeValue;

        const nodeName = node.parentNode.nodeName.toLowerCase();

        if (blockText.has(nodeName)) {
          node.parentNode.nodeValue = decodeEntities(patch.element.nodeValue);
        }

        unprotectElement(patch.newTree);
      };

      trigger('textChanged', textChangePromises, promises => {
        if (promises.length) {
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
  return promises;
}
