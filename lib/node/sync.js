import { pools as _pools } from '../util/pools';
import { protectElement as _protectElement } from '../util/memory';

var pools = _pools;
var protectElement = _protectElement;

const slice = Array.prototype.slice;
const filter = Array.prototype.filter;

// Patch actions.
export const REMOVE_ELEMENT_CHILDREN = -2;
export const REMOVE_ENTIRE_ELEMENT = -1;
export const REPLACE_ENTIRE_ELEMENT = 0;
export const MODIFY_ELEMENT = 1;
export const MODIFY_ATTRIBUTE = 2;
export const CHANGE_TEXT = 3;

/**
 * Synchronizes changes from the newTree into the oldTree.
 *
 * @param oldTree
 * @param newTree
 * @param patches - optional
 */
export default function sync(oldTree, newTree, patches) {
  patches = patches || [];

  if (!Array.isArray(patches)) {
    throw new Error('Missing Array to sync patches into');
  }

  if (!oldTree) {
    throw new Error('Missing existing tree to sync');
  }

  let oldChildNodes = oldTree.childNodes;
  let oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  let oldElement = oldTree.uuid;

  if (!newTree) {
    let removed = oldChildNodes.splice(0, oldChildNodesLength);

    patches[patches.length] = {
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: removed
    };

    for (let i = 0; i < removed.length; i++) {
      // Used by the Worker to track elements removed.
      if (patches.removals) { patches.removals.push(removed[i].uuid); }
    }

    return patches;
  }

  let nodeValue = newTree.nodeValue;
  let childNodes = newTree.childNodes;
  let childNodesLength = childNodes ? childNodes.length : 0;
  let newElement = newTree.uuid;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (oldTree.nodeName !== newTree.nodeName) {
    patches[patches.length] = {
      __do__: REPLACE_ENTIRE_ELEMENT,
      old: oldTree,
      new: newTree
    };

    return patches;
  }

  // If the top level nodeValue has changed we should reflect it.
  if ((oldTree.nodeValue !== nodeValue) && !(!oldTree.nodeValue && !nodeValue)) {
    if (oldTree.nodeValue !== null) {
      patches[patches.length] = {
        __do__: CHANGE_TEXT,
        element: oldTree,
        value: newTree.nodeValue,
      };
    }
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    let fragment = [];

    for (let i = oldChildNodesLength; i < childNodesLength; i++) {
      // Used by the Worker to track elements added.
      if (patches.additions) { patches.additions.push(childNodes[i].uuid); }

      protectElement(childNodes[i]);

      // Internally add to the tree.
      oldChildNodes[oldChildNodes.length] = childNodes[i];

      // Add to the document fragment.
      fragment[fragment.length] = childNodes[i];

      if (childNodes[i].nodeName === '#text') {
        childNodes[i].nodeValue = childNodes[i].nodeValue;
      }
    }

    oldChildNodesLength = oldChildNodes.length;

    // Assign the fragment to the patches to be injected.
    patches[patches.length] = {
      __do__: MODIFY_ELEMENT,
      element: oldTree,
      fragment: fragment
    };
  }

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    let cloneOldChildNodes = slice.call(oldChildNodes, 0);

    // Find the correct elements to remove, is smart about keeping existing
    // elements.
    let toRemove = filter.call(cloneOldChildNodes, function(el, index) {
      var newChild = childNodes[oldChildNodes.indexOf(el)];
      var notSame = newChild ? el.nodeName !== newChild.nodeName : true;

      if (notSame && oldChildNodes.indexOf(el) > -1) {
        oldChildNodes.splice(oldChildNodes.indexOf(el), 1);
      }

      return notSame;
    });

    oldChildNodesLength = oldChildNodes.length;

    if (oldChildNodesLength === 0) {
      patches[patches.length] = {
        __do__: REMOVE_ELEMENT_CHILDREN,
        element: oldTree,
        toRemove
      };
    }
    else {
      for (let i = 0; i < toRemove.length; i++) {
        // Remove the element, this happens before the splice so that we
        // still have access to the element.
        patches[patches.length] = {
          __do__: MODIFY_ELEMENT,
          old: toRemove[i]
        };
      }

      for (let i = 0; i < toRemove.length; i++) {
        // Used by the Worker to track elements removed.
        if (patches.removals) { patches.removals.push(toRemove[i].uuid); }
      }
    }
  }

  // Replace elements if they are different.
  if (oldChildNodesLength) {
    for (let i = 0; i < childNodesLength; i++) {
      if (oldChildNodes[i].nodeName !== childNodes[i].nodeName) {
        // Add to the patches.
        patches[patches.length] = {
          __do__: MODIFY_ELEMENT,
          old: oldChildNodes[i],
          new: childNodes[i]
        };

        // Used by the Worker to track elements removed.
        if (patches.removals) {
          patches.removals.push(oldChildNodes[i].uuid);
        }

        // Used by the Worker to track elements added.
        if (patches.additions) { patches.additions.push(childNodes[i].uuid); }

        // Replace the internal tree's point of view of this element.
        oldChildNodes[i] = childNodes[i];
        protectElement(childNodes[i]);
      }
    }
  }

  // Synchronize attributes
  let attributes = newTree.attributes;

  if (attributes) {
    let oldLength = oldTree.attributes.length;
    let newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      let toAdd = slice.call(attributes, oldLength);

      for (let i = 0; i < toAdd.length; i++) {
        let change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toAdd[i].name,
          value: toAdd[i].value,
        };

        let attr = pools.attributeObject.get();
        attr.name = toAdd[i].name;
        attr.value = toAdd[i].value;

        pools.attributeObject.protect(attr);

        // Push the change object into into the virtual tree.
        oldTree.attributes[oldTree.attributes.length] = attr;

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      let toRemove = slice.call(oldTree.attributes, newLength);

      for (let i = 0; i < toRemove.length; i++) {
        let change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toRemove[i].name,
          value: undefined,
        };

        // Remove the attribute from the virtual node.
        let removed = oldTree.attributes.splice(i, 1);

        for (let i = 0; i < removed.length; i++) {
          pools.attributeObject.unprotect(removed[i]);
        }

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }

    // Check for modifications.
    let toModify = attributes;

    for (let i = 0; i < toModify.length; i++) {
      let oldAttrValue = oldTree.attributes[i] && oldTree.attributes[i].value;
      let newAttrValue = attributes[i] && attributes[i].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        let change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toModify[i].name,
          value: toModify[i].value,
        };

        // Replace the attribute in the virtual node.
        let attr = oldTree.attributes[i];
        attr.name = toModify[i].name;
        attr.value = toModify[i].value;

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }
  }

  // Sync each current node.
  for (let i = 0; i < oldChildNodes.length; i++) {
    if (oldChildNodes[i].uuid !== childNodes[i].uuid) {
      sync(oldTree.childNodes[i], childNodes[i], patches);
    }
  }

  return patches;
}
