const slice = Array.prototype.slice;
const filter = Array.prototype.filter;

// Patch actions.
export const REMOVE_ELEMENT_CHILDREN = -2;
export const REMOVE_ENTIRE_ELEMENT = -1;
export const REPLACE_ENTIRE_ELEMENT = 0;
export const MODIFY_ELEMENT = 1;
export const MODIFY_ATTRIBUTE = 2;
export const CHANGE_TEXT = 3;

const runCtor = (vTree) => {
  const props = Object.freeze(Object.assign({}, vTree.attributes, {
    children: Object.freeze(vTree.childNodes)
  }));

  const instance = new vTree.nodeName(props);
  const newTree = instance.render();

  return newTree;
};

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

  const oldIsCtor = oldTree && typeof oldTree.nodeName === 'function';
  const newIsCtor = newTree && typeof newTree.nodeName === 'function';

  if (oldIsCtor || newIsCtor) {
    if (oldTree && newTree && oldTree.nodeName === newTree.nodeName) {
      return patches;
    }

    if (oldIsCtor) {
      oldTree = runCtor(oldTree);
    }

    if (newIsCtor) {
      newTree = runCtor(newTree);
    }
  }

  const oldNodeValue = oldTree.nodeValue;
  const oldChildNodes = oldTree.childNodes;
  const oldIsTextNode = oldTree.nodeName === '#text';

  // TODO Make this static...
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;

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

  // Replace the key attributes.
  oldTree.key = newTree.key;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (oldTree.nodeName !== newTree.nodeName) {
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

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (!newIsFragment && attributes) {
    // Cache the lengths for performance and readability.
    const oldLength = oldTree.attributes.length;
    const newLength = attributes.length;

    // Construct a single patch for the entire changeset.
    const patch = {
      __do__: MODIFY_ATTRIBUTE,
      element: oldTree,
      attributes: [],
    };

    // Find additions.
    if (newLength > oldLength) {
      for (let i = oldLength; i < newLength; i++) {
        const oldAttr = oldTree.attributes[i];
        const newAttr = attributes[i];

        patch.attributes.push({ oldAttr, newAttr, });
        oldTree.attributes.push(newAttr);
      }
    }

    // Find removals.
    if (oldLength > newLength) {
      for (let i = newLength; i < oldLength; i++) {
        const oldAttr = oldTree.attributes[i];
        const newAttr = attributes[i];

        patch.attributes.push({ oldAttr, newAttr, });
      }

      // Reset the internal attributes to be less.
      oldTree.attributes = oldTree.attributes.slice(0, newLength);
    }

    // Find changes.
    for (let i = 0; i < attributes.length; i++) {
      const oldAttr = oldTree.attributes[i];
      const newAttr = attributes[i];
      const oldAttrName = oldAttr ? oldAttr.name : undefined;
      const oldAttrValue = oldAttr ? oldAttr.value : undefined;
      const newAttrName = newAttr ? newAttr.name : undefined;
      const newAttrValue = newAttr ? newAttr.value : undefined;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        // Add the attribute items to add and remove.
        patch.attributes.push({
          oldAttr,
          newAttr,
        });

        oldTree.attributes[i] = newAttr;
      }
    }

    // Add the attribute changes patch to the series of patches, unless there
    // are no attributes to change.
    if (patch.attributes.length) {
      patches.push(patch);
    }
  }

  return patches;
}
