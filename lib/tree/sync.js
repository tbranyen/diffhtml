import { pools } from '../util/pools';

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

  // Flatten out childNodes that are arrays.
  if (newTree && newTree.childNodes) {
    const hasArray = newTree.childNodes.some(node => Array.isArray(node));

    if (hasArray) {
      const newChildNodes = [];

      newTree.childNodes.forEach(childNode => {
        if (Array.isArray(childNode)) {
          newChildNodes.push.apply(newChildNodes, childNode);
        }
        else {
          newChildNodes.push(childNode);
        }
      });

      newTree.childNodes = newChildNodes;
    }
  }

  const oldNodeValue = oldTree.nodeValue;
  const oldChildNodes = oldTree.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  const oldIsTextNode = oldTree.nodeName === '#text';

  if (!newTree) {
    const removed = [oldTree].concat(
      oldChildNodes.splice(0, oldChildNodesLength)
    );

    patches.push({
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: removed
    });

    return patches;
  }

  const nodeValue = newTree.nodeValue;
  const childNodes = newTree.childNodes;
  const childNodesLength = childNodes ? childNodes.length : 0;
  const nodeName = newTree.nodeName;
  const attributes = newTree.attributes;
  const newIsTextNode = nodeName === '#text';
  const newIsFragment = newTree.nodeName === '#document-fragment';
  var skipAttributeCompare = false;

  // Replace the key attributes.
  oldTree.key = newTree.key;

  // Fragments should not compare attributes.
  if (newIsFragment) {
    skipAttributeCompare = true;
  }
  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  else if (oldTree.nodeName !== newTree.nodeName) {
    patches.push({
      __do__: REPLACE_ENTIRE_ELEMENT,
      old: oldTree,
      new: newTree
    });

    return patches;
  }
  // This element never changes.
  else if (oldTree === newTree) {
    return patches;
  }

  // Clean up the newTree since we're not using it.
  pools.elementObject.unprotect(newTree);

  const areTextNodes = oldIsTextNode && newIsTextNode;

  // If the top level nodeValue has changed we should reflect it.
  if (areTextNodes && oldNodeValue !== nodeValue) {
    patches.push({
      __do__: CHANGE_TEXT,
      element: oldTree,
      value: newTree.nodeValue
    });

    oldTree.nodeValue = newTree.nodeValue;

    return patches;
  }

  // Ensure keys exist for all the old & new elements.
  const noOldKeys = !oldChildNodes.some(oldChildNode => oldChildNode.key);
  var newKeys = null;
  var oldKeys = null;

  if (!noOldKeys) {
    newKeys = new Set(
      childNodes
        .map(childNode => String(childNode.key))
        .filter(Boolean)
    );

    oldKeys = new Set(
      oldChildNodes
        .map(childNode => String(childNode.key))
        .filter(Boolean)
    );
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    const fragment = [];

    for (let i = oldChildNodesLength; i < childNodesLength; i++) {
      // Internally add to the tree.
      oldChildNodes.push(childNodes[i]);

      // Add to the document fragment.
      fragment.push(childNodes[i]);
    }

    oldChildNodesLength = oldChildNodes.length;

    // Assign the fragment to the patches to be injected.
    patches.push({
      __do__: MODIFY_ELEMENT,
      element: oldTree,
      fragment: fragment
    });
  }

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    // For now just splice out the end items.
    const diff = oldChildNodesLength - childNodesLength;
    let toRemove = [];
    const shallowClone = [...oldChildNodes];

    // There needs to be keys to diff, if not, there's no point in checking.
    if (noOldKeys) {
      toRemove = oldChildNodes.splice(oldChildNodesLength - diff, diff);
    }
    // This is an expensive operation so we do the above check to ensure that a
    // key was specified.
    else {
      const keysToRemove = new Set();

      // Find the keys in the sets to remove.
      oldKeys.forEach(key => {
        if (!newKeys.has(key)) {
          keysToRemove.add(key);
        }
      });

      // If the original childNodes contain a key attribute, use this to
      // compare over the naive method below.
      shallowClone.forEach((oldChildNode, i) => {
        if (toRemove.length >= diff) {
          return;
        }
        else if (keysToRemove.has(oldChildNode.key)) {
          const nextChild = oldChildNodes[i + 1];
          const nextIsTextNode = nextChild && nextChild.nodeType === 3;
          let count = 1;

          // Always remove whitespace in between the elements.
          if (nextIsTextNode && (toRemove.length + 2) <= diff) {
            count = 2;
          }
          // All siblings must contain a key attribute if they exist.
          else if (nextChild && nextChild.nodeType === 1 && !nextChild.key) {
            throw new Error(`
              All element siblings must consistently contain key attributes.
            `.trim());
          }

          // Find the index position from the original array.
          const indexPos = oldChildNodes.indexOf(oldChildNode);

          // Find all the items to remove.
          toRemove.push.apply(toRemove, oldChildNodes.splice(indexPos, count));
        }
      });
    }

    // Ensure we don't remove too many elements by accident;
    toRemove.length = diff;

    // Ensure our internal length check is matched.
    oldChildNodesLength = oldChildNodes.length;

    if (childNodesLength === 0) {
      patches.push({
        __do__: REMOVE_ELEMENT_CHILDREN,
        element: oldTree,
        toRemove
      });
    }
    else {
      // Remove the element, this happens before the splice so that we still
      // have access to the element.
      toRemove.forEach(old => patches.push({
        __do__: MODIFY_ELEMENT,
        old
      }));
    }
  }

  // Replace elements if they are different.
  if (oldChildNodesLength >= childNodesLength) {
    for (let i = 0; i < childNodesLength; i++) {
      if (oldChildNodes[i].nodeName !== childNodes[i].nodeName) {
        // Add to the patches.
        patches.push({
          __do__: MODIFY_ELEMENT,
          old: oldChildNodes[i],
          new: childNodes[i]
        });

        // Replace the internal tree's point of view of this element.
        oldChildNodes[i] = childNodes[i];
      }
      else {
        sync(oldChildNodes[i], childNodes[i], patches);
      }
    }
  }

  // Synchronize attributes
  if (!skipAttributeCompare && attributes) {
    const oldLength = oldTree.attributes.length;
    const newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      const toAdd = slice.call(attributes, oldLength);

      for (let i = 0; i < toAdd.length; i++) {
        const change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toAdd[i].name,
          value: toAdd[i].value,
        };

        const attr = pools.attributeObject.get();
        attr.name = toAdd[i].name;
        attr.value = toAdd[i].value;

        pools.attributeObject.protect(attr);

        // Push the change object into into the virtual tree.
        oldTree.attributes.push(attr);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      const toRemove = slice.call(oldTree.attributes, newLength);

      for (let i = 0; i < toRemove.length; i++) {
        const change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toRemove[i].name,
          value: undefined,
        };

        // Remove the attribute from the virtual node.
        const removed = oldTree.attributes.splice(i, 1);

        for (let i = 0; i < removed.length; i++) {
          pools.attributeObject.unprotect(removed[i]);
        }

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    for (let i = 0; i < attributes.length; i++) {
      const oldAttr = oldTree.attributes[i];
      const newAttr = attributes[i];
      const oldAttrName = oldAttr ? oldAttr.name : undefined;
      const oldAttrValue = oldAttr ? oldAttr.value : undefined;
      const newAttrName = newAttr ? newAttr.name : undefined;
      const newAttrValue = newAttr ? newAttr.value : undefined;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        const change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: oldAttrName,
          value: newAttrValue,
        };

        // If the attribute names change, this is a removal.
        if (oldAttrName === newAttrName) {
          oldAttr.value = newAttrValue;
        }
        else {
          // Set the patch values.
          change.name = newAttrName || oldAttrName;
          change.value = newAttrValue;

          // Set the Virtual Tree Attribute values.
          oldAttr.name = newAttrName;
          oldAttr.value = newAttrValue;
        }

        // Add the change to the series of patches.
        patches.push(change);
      }
    }
  }

  return patches;
}
