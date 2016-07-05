// Export the patch action type constants.
export const REMOVE_ELEMENT_CHILDREN = -2;
export const REMOVE_ENTIRE_ELEMENT = -1;
export const REPLACE_ENTIRE_ELEMENT = 0;
export const MODIFY_ELEMENT = 1;
export const MODIFY_ATTRIBUTE = 2;
export const CHANGE_TEXT = 3;

/**
 * Synchronizes changes from the newTree into the oldTree. This is a rather
 * naive implement that could be greatly improved over time. The goal is
 * currently to be accurate first, performant second. This logic should be as
 * simple as possible, therefore no memory management occurs here. This means
 * that every patch must contain all references to be cleaned up along with the
 * references necessary to apply the patch.
 *
 * @param {Object} oldTree - The original Virtual Tree Element
 * @param {Object} newTree -  The new Virtual Tree Element
 */
export default function sync(oldTree, newTree) {
  // If there is no old Virtual Tree Element to reconcile changes into, throw
  // an error.
  if (!oldTree) {
    throw new Error('Missing existing tree to sync');
  }

  // Automatically create the patches array internally. It's the last argument
  // here, because we want to provide in each recursive iteration.
  const patches = arguments[2] || [];

  // Short-hand the common old Virtual Tree Element properties.
  const oldNodeName = oldTree.nodeName;
  const oldNodeValue = oldTree.nodeValue;
  const oldChildNodes = oldTree.childNodes;
  const oldAttributes = oldTree.attributes;
  const oldIsTextNode = oldNodeName === '#text';

  // If there is no new Virtual Tree Element to sync from, remove the entire
  // DOM Node.
  if (!newTree) {
    patches.push({
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: oldChildNodes,
    });

    return patches;
  }

  // Short-hand the common new Virtual Tree Element properties.
  const newNodeName = newTree.nodeName;
  const newNodeValue = newTree.nodeValue;
  const newChildNodes = newTree.childNodes;
  const newAttributes = newTree.attributes;
  const newIsTextNode = newNodeName === '#text';
  const newIsFragment = newNodeName === '#document-fragment';

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. This will
  // fail during the DOM Node patching if the associated DOM Node does not have
  // a parentNode (since the DOM requires that to do a replaceChild).
  if (oldNodeName !== newNodeName) {
    const toRemove = oldTree.childNodes;

    // Shallow clone is fine here, we just need to merge the newTree into the
    // oldTree.
    Object.assign(oldTree, newTree);

    patches.push({
      __do__: REPLACE_ENTIRE_ELEMENT,
      old: oldTree,
      new: newTree,
      toRemove,
    });

    return patches;
  }
  // This element never changes.
  else if (oldTree === newTree) {
    return patches;
  }

  // If the top level nodeValue has changed we should reflect it.
  if (oldIsTextNode && newIsTextNode && oldNodeValue !== newNodeValue) {
    patches.push({
      __do__: CHANGE_TEXT,
      element: oldTree,
      value: newNodeValue,
    });

    oldTree.nodeValue = newNodeValue;

    return patches;
  }

  // Ensure keys exist for all the old & new elements.
  const noOldKeys = !oldChildNodes.some(oldChildNode => oldChildNode.key);

  // Find all the old keys.
  const oldKeys = noOldKeys || new Set(
    oldChildNodes.map(vTree => String(vTree.key))
  );

  // Find all the new keys.
  const newKeys = noOldKeys || new Set(
    newChildNodes.map(vTree => String(vTree.key))
  );

  // We merge the addition and replacement of Nodes into the same operation.
  // This trick is supported by the awesome utility of Document Fragments.
  if (newChildNodes.length >= oldChildNodes.length) {
    // Store elements in a Document Fragment to increase performance and be
    // generally simplier to work with. We can add and replace DOM Nodes in
    // this container trivially.
    const fragment = [];

    // If these elements are not using keys to track position, we simply need
    // to add the new elements into the fragment.
    if (noOldKeys) {
      for (let i = 0; i < newChildNodes.length; i++) {
        const oldTree = oldChildNodes[i];
        const newTree = newChildNodes[i];

        oldChildNodes.push(newTree);
        fragment.push(newTree);

        if (oldTree) {
          sync(oldTree, newTree, patches);
        }
      }
    }
    // Handle key attribute special to position offset.
    else {
      // Find the keys in the sets to remove.
      for (let i = 0; i < newChildNodes.length; i++) {
        const oldTree = oldChildNodes[i];
        const newTree = newChildNodes[i];
        const key = String(newTree.key);

        // If there is an existing element in this position, we're dealing with
        // a key'd new element, and it is brand new.
        if (oldTree && key && !oldKeys.has(key) && newKeys.has(key)) {
          oldChildNodes.splice(i, 0, newTree);

          const nextChildNode = newChildNodes[i + 1];

          if (nextChildNode && nextChildNode.nodeName === '#text') {
            oldChildNodes.splice(i + 1, 0, newChildNodes[i + 1]);
          }
        }
        else if (!oldTree) {
          oldChildNodes.splice(i, 0, newTree);
        }

        fragment.push(newTree);

        // Synchronize each new tree against the previous recursively.
        sync(oldTree, newTree, patches);
      }
    }

    // Assign the fragment to the patches to be injected.
    if (fragment.length) {
      patches.push({
        __do__: MODIFY_ELEMENT,
        element: oldTree,
        fragment,
      });
    }
  }

  // Remove these elements.
  if (oldChildNodes.length > newChildNodes.length) {
    // For now just splice out the end items.
    const diff = oldChildNodes.length - newChildNodes.length;
    const shallowClone = [...oldChildNodes];

    let toRemove = [];

    // There needs to be keys to diff, if not, there's no point in checking.
    if (noOldKeys) {
      toRemove = oldChildNodes.splice(oldChildNodes.length - diff, diff);
    }
    // This is an expensive operation so we do the above check to ensure that a
    // key was specified.
    else {
      const keysToRemove = new Set();

      // Find the keys in the sets to remove.
      oldKeys.forEach(key => !newKeys.has(key) && keysToRemove.add(key));

      // If the original childNodes contain a key attribute, use this to
      // compare over the naive method below.
      shallowClone.forEach((oldChildNode, i) => {
        if (keysToRemove.has(String(oldChildNode.key))) {
          const nextChild = oldChildNodes[i + 1];
          const nextIsTextNode = nextChild && nextChild.nodeType === 3;
          const removeText = nextIsTextNode && toRemove.length + 2 <= diff;
          const start = oldChildNodes.indexOf(oldChildNode);
          const end = removeText ? 2 : 1;

          toRemove.push.apply(toRemove, oldChildNodes.splice(start, end));
        }
      });
    }

    // Ensure we don't remove too many elements by accident;
    toRemove.length = diff;

    if (newChildNodes.length === 0) {
      oldChildNodes.length = 0;

      patches.push({
        __do__: REMOVE_ELEMENT_CHILDREN,
        element: oldTree,
        toRemove,
      });
    }
    else {
      // Remove the element, this happens before the splice so that we still
      // have access to the element.
      toRemove.forEach(old => patches.push({
        __do__: MODIFY_ELEMENT,
        old,
      }));
    }
  }

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (!newIsFragment && newAttributes) {
    // Cache the lengths for performance and readability.
    const oldLength = oldAttributes.length;
    const newLength = newAttributes.length;

    // Construct a single patch for the entire changeset.
    const patch = {
      __do__: MODIFY_ATTRIBUTE,
      element: oldTree,
      attributes: [],
    };

    // Find additions.
    if (newLength > oldLength) {
      for (let i = oldLength; i < newLength; i++) {
        const oldAttr = oldAttributes[i];
        const newAttr = newAttributes[i];

        patch.attributes.push({ oldAttr, newAttr, });
        oldAttributes.push(newAttr);
      }
    }

    // Find removals.
    if (oldLength > newLength) {
      for (let i = newLength; i < oldLength; i++) {
        const oldAttr = oldAttributes[i];
        const newAttr = newAttributes[i];

        patch.attributes.push({ oldAttr, newAttr, });
      }

      oldAttributes.length = newLength;
    }

    // Find changes.
    for (let i = 0; i < newAttributes.length; i++) {
      const oldAttr = oldAttributes[i];
      const newAttr = newAttributes[i];
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

        oldAttributes[i] = newAttr;
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
