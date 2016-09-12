// Export the patch action type constants.
export const REPLACE_ELEMENT = 'REPLACE_ELEMENT';
export const REMOVE_ELEMENT = 'REMOVE_ELEMENT';
export const APPEND_ELEMENT = 'APPEND_ELEMENT';
export const PREPEND_ELEMENT = 'PREPEND_ELEMENT';
export const MODIFY_ATTRIBUTE = 'MODIFY_ATTRIBUTE';
export const CHANGE_TEXT = 'CHANGE_TEXT';

// This useful function helps us track the various states t
const handleOperationChange = (baton, type) => {
  const { patch, patches } = baton;

  // This is part of a batch operation.
  if (patch && patch.type === type) {
    return;
  }

  // If there was a previous operation, push this into patches.
  if (patch && patch.type) {
    patches.push(patch);
  }

  // Reset the operation.
  baton.patch = { type };

  // If the new type is an element operation, we can add a fragment property
  // to make it easier later on (no need to guard).
  if (type && type.indexOf('ELEMENT') > -1) {
    baton.patch.fragment = [];
  }
};

/**
 * Synchronizes changes from the newTree into the oldTree. This is a rather
 * naive implement that could be greatly improved over time. The goal is
 * currently to be accurate first, performant second. This logic should be as
 * simple as possible, therefore no memory management occurs here. This means
 * that every patch must contain all references to be cleaned up along with the
 * references necessary to apply the patch.
 *
 * @param {Object} oldTree - The original Virtual Tree Element
 * @param {Object} newTree - The new Virtual Tree Element
 */
export default function sync(oldTree, newTree) {
  // If there is no old Virtual Tree Element to reconcile changes into, throw
  // an error.
  if (!oldTree) {
    throw new Error('Missing existing tree to sync');
  }

  // Shorten the `oldTree` properties to make code columns shorter later.
  const oldNodeName = oldTree.nodeName;
  const oldNodeValue = oldTree.nodeValue;
  const oldChildNodes = oldTree.childNodes;
  const oldAttributes = oldTree.attributes;
  const oldIsTextNode = oldNodeName === '#text';

  // Automatically create the patches array internally. It's the last argument
  // here, because we want to provide in each recursive iteration.
  const patches = arguments[2] || [];
  const element = arguments[3];

  // If there is no new Virtual Tree Element to sync from, remove the entire
  // DOM Node. If the element we're replacing is totally different from the
  // previous replace the entire element, don't bother investigating children.
  // This will fail during the DOM Node patching if the associated DOM Node
  // does not have a parentNode (since the DOM requires that to do a
  // replaceChild).
  if (!newTree || oldTree.nodeName !== newTree.nodeName) {
    patches.push({
      type: !newTree ? REMOVE_ELEMENT : REPLACE_ELEMENT,
      oldTree,
      newTree,

      // This is the parent element that will replace/remove.
      element,
    });

    return patches;
  }
  // Comparing the exact same elements so therefore we can abort early.
  else if (oldTree === newTree) {
    return patches;
  }

  // Shorten the `newTree` properties to make code columns shorter later.
  const newNodeName = newTree.nodeName;
  const newNodeValue = newTree.nodeValue;
  const newChildNodes = newTree.childNodes;
  const newAttributes = newTree.attributes;
  const newIsTextNode = newNodeName === '#text';
  const newIsFragment = newNodeName === '#document-fragment';

  // If the top level nodeValue has changed we should reflect it.
  if (oldIsTextNode && newIsTextNode && oldNodeValue !== newNodeValue) {
    patches.push({
      type: CHANGE_TEXT,
      element: oldTree,
      newTree,
      value: newNodeValue,
    });

    // Update the existing tree with the new value.
    oldTree.nodeValue = newNodeValue;

    return patches;
  }

  // Look for the existence of a single key attribute in the existing
  // childNodes, this will determine if that optimization path is necessary to
  // take or not. Also find all the old and new keys if there were any old
  // keys.
  const hasOldKeys = oldChildNodes.some(oldChildNode => oldChildNode.key);
  const oldKeys = hasOldKeys && new Set(oldChildNodes.map(vTree => vTree.key));
  const newKeys = hasOldKeys && new Set(newChildNodes.map(vTree => vTree.key));

  // Store information about the current operation. This helps optimize bulk
  // additions, removals, etc. Also serves as a baton into the externalized
  // function helpers, so there is no need to pass `patches` around.
  const baton = { patches };

  // Allows us to maintain symmetry between the old and new trees when
  // modifying.
  let oldIndex = 0;

  // Only loop the `newChildNodes` to discover changes. If we use keys, the
  // element lengths will have parity through the modifications here.
  for (let i = 0; i < newChildNodes.length; i++) {
    const oldChildNode = oldChildNodes[oldIndex];
    const newChildNode = newChildNodes[i];
    const oldKey = oldChildNode && oldChildNode.key;
    const newKey = newChildNode && newChildNode.key;
    const keysMatch = oldKey && newKey && oldKey === newKey;

    // First look for new children to append.
    if (!oldChildNode) {
      handleOperationChange(baton, APPEND_ELEMENT);

      const { patch } = baton;

      patch.element = oldTree;
      patch.fragment.push(newChildNode);
    }
    // Prepend new items that exist in between elements.
    else if (hasOldKeys && !oldKeys.has(newKey) && newKeys.has(oldKey) && oldChildNodes.length < newChildNodes.length) {
      handleOperationChange(baton, PREPEND_ELEMENT);

      const { patch } = baton;
      const nextChildNode = oldChildNodes[i];

      patch.element = oldTree;
      patch.fragment.push(newChildNode);
      patch.oldTree = nextChildNode;

      oldIndex--;

      if (nextChildNode && nextChildNode.nodeName === '#text') {
        patch.fragment.push(nextChildNode);
        i++;
      }
    }
    // Replace elements when the ids are different.
    else if (hasOldKeys && oldKey && newKey && oldKey !== newKey) {
      handleOperationChange(baton, REPLACE_ELEMENT);

      const { patch } = baton;

      patch.oldTree = oldChildNode;
      patch.newTree = newChildNode;
      patch.element = oldTree;
    }
    // Remove missing items.
    else if (hasOldKeys && !newKeys.has(oldKey)) {
      handleOperationChange(baton, REMOVE_ELEMENT);

      const { patch } = baton;
      const nextChildNode = oldChildNodes[i + 1];

      patch.element = oldTree;
      patch.fragment.push(oldChildNode);

      i++;

      if (nextChildNode && nextChildNode.nodeName === '#text') {
        patch.fragment.push(nextChildNode);

        // Since we're looking ahead, change our increment to account for this.
        i++;

        // And since we're lining up with the newChildNodes, set back the old
        // index.
        oldIndex--;
      }
    }
    else {
      sync(oldChildNode, newChildNode, patches, oldTree);
    }

    oldIndex++;
  }

  // Find any leftover elements and remove them, ensuring a consistent render.
  if (oldChildNodes.length > newChildNodes.length) {
    const fragment = oldChildNodes.slice(oldIndex);

    for (let i = 0; i < fragment.length; i++) {
      const vTree = fragment[i];
      const nextVTree = fragment[i + 1];

      handleOperationChange(baton, REMOVE_ELEMENT);

      const { patch } = baton;

      patch.element = oldTree;
      patch.fragment.push(fragment[i]);

      if (nextVTree && nextVTree.nodeName === '#text') {
        patch.fragment.push(nextVTree);

        // Since we're looking ahead, change our increment to account for this.
        i++;
      }
    }
  }

  // If there was a previous operation, push this into patches.
  handleOperationChange(baton, null);

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
      type: MODIFY_ATTRIBUTE,
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
