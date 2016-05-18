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

  let oldNodeValue = oldTree.nodeValue;
  let oldChildNodes = oldTree.childNodes;
  let oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  let oldElement = oldTree.uuid;
  let oldNodeName = oldTree.nodeName;
  let oldIsTextNode = oldNodeName === '#text';

  if (!newTree) {
    let removed = [oldTree].concat(
      oldChildNodes.splice(0, oldChildNodesLength)
    );

    patches.push({
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: removed
    });

    return patches;
  }

  let nodeValue = newTree.nodeValue;
  let childNodes = newTree.childNodes;
  let childNodesLength = childNodes ? childNodes.length : 0;
  let newElement = newTree.uuid;
  let nodeName = newTree.nodeName;
  let newIsTextNode = nodeName === '#text';
  let oldIsFragment = oldTree.nodeName === '#document-fragment';
  let newIsFragment = newTree.nodeName === '#document-fragment';
  let skipAttributeCompare = false;

  // Replace the key attributes.
  oldTree.key = newTree.key;

  // Fragments should not compare attributes.
  if (oldIsFragment || newIsFragment) {
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

  // If the top level nodeValue has changed we should reflect it.
  if (oldIsTextNode && newIsTextNode && oldNodeValue !== nodeValue) {
    patches.push({
      __do__: CHANGE_TEXT,
      element: oldTree,
      value: newTree.nodeValue
    });

    oldTree.nodeValue = newTree.nodeValue;

    return patches;
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    let fragment = [];

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

  // Ensure keys exist for all the old & new elements.
  let noOldKeys = !oldChildNodes.some(oldChildNode => oldChildNode.key);

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    // For now just splice out the end items.
    let diff = oldChildNodesLength - childNodesLength;
    let toRemove = [];
    let shallowClone = [...oldChildNodes];

    // There needs to be keys to diff, if not, there's no point in checking.
    if (noOldKeys) {
      toRemove = oldChildNodes.splice(oldChildNodesLength - diff, diff);
    }
    // This is an expensive operation so we do the above check to ensure that a
    // key was specified.
    else {
      let newKeys = new Set(
        childNodes
          .map(childNode => String(childNode.key))
          .filter(Boolean)
      );

      let oldKeys = new Set(
        oldChildNodes
          .map(childNode => String(childNode.key))
          .filter(Boolean)
      );

      let keysToRemove = {};
      let truthy = 1;

      // Find the keys in the sets to remove.
      oldKeys.forEach(key => {
        if (!newKeys.has(key)) {
          keysToRemove[key] = truthy;
        }
      });

      // If the original childNodes contain a key attribute, use this to
      // compare over the naive method below.
      shallowClone.forEach((oldChildNode, i) => {
        if (toRemove.length >= diff) {
          return;
        }
        else if (keysToRemove[oldChildNode.key]) {
          let nextChild = oldChildNodes[i + 1];
          let nextIsTextNode = nextChild && nextChild.nodeType === 3;
          let count = 1;

          // Always remove whitespace in between the elements.
          if (emptyTextNode && (toRemove.length + 2) <= diff) {
            count = 2;
          }
          // All siblings must contain a key attribute if they exist.
          else if (nextChild && nextChild.nodeType === 1 && !nextChild.key) {
            throw new Error(`
              All element siblings must consistently contain key attributes.
            `.trim());
          }

          // Find the index position from the original array.
          let indexPos = oldChildNodes.indexOf(oldChildNode);

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
  let attributes = newTree.attributes;

  if (attributes && !skipAttributeCompare) {
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
        oldTree.attributes.push(attr);

        // Add the change to the series of patches.
        patches.push(change);
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
        patches.push(change);
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
        patches.push(change);
      }
    }
  }

  return patches;
}
