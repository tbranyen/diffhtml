import { decodeEntities } from '../util';

const { assign, keys } = Object;
const empty = null;
const oldKeys = new Map();
const newKeys = new Map();

export default function syncTree(oldTree, newTree) {
  if (!oldTree) { throw new Error('Missing existing tree to sync from'); }
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. The
  // exception is if the `newTree` is a document fragment / shadow dom.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // Shallow clone the `newTree` into the `oldTree`. We want to get the same
    // references/values inside here.
    throw new Error('Unable to replace top level elements');
  }

  // Create new arrays for patches or use existing from a recursive call.
  const patches = arguments[2] || {
    TREE_OPERATIONS: [],
    NODE_VALUE: [],
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
  };

  const {
    TREE_OPERATIONS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE
  } = patches;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: empty,
    REMOVE_CHILD: empty,
    REPLACE_CHILD: empty,
  };

  const { childNodes: oldChildNodes } = oldTree;
  const { childNodes: newChildNodes } = newTree;

  debugger;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  const hasOldKeys = oldChildNodes.some(vTree => vTree.key);
  const hasNewKeys = newChildNodes.some(vTree => vTree.key);

  // Build up the key caches for each set of children.
  if (hasOldKeys && hasNewKeys) {
    oldKeys.clear();
    newKeys.clear();

    // Put the old `childNode` VTree's into the key cache for lookup.
    if (oldChildNodes.length) {
      for (let i = 0; i < oldChildNodes.length; i++) {
        const vTree = oldChildNodes[i];

        // Only add references if the key exists, otherwise ignore it. This
        // allows someone to specify a single key and keep that element around.
        if (vTree.key) {
          oldKeys.set(vTree.key, vTree);
        }
      }
    }

    // Put the new `childNode` VTree's into the key cache for lookup.
    if (newChildNodes.length) {
      for (let i = 0; i < newChildNodes.length; i++) {
        const vTree = newChildNodes[i];

        // Only add references if the key exists, otherwise ignore it. This
        // allows someone to specify a single key and keep that element around.
        if (vTree.key) {
          newKeys.set(vTree.key, vTree);
        }
      }
    }
  }

  // First check for new elements to add, this is the most common in my
  // experience.
  if (newChildNodes.length > oldChildNodes.length) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    const fragment = [];

    if (newChildNodes.length) {
      for (let i = oldChildNodes.length; i < newChildNodes.length; i++) {
        // Internally add to the tree.
        oldChildNodes.push(newChildNodes[i]);

        // Add to the document fragment.
        fragment.push(newChildNodes[i]);
      }
    }

    if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }

    // Assign the fragment to the patches to be injected.
    patchset.INSERT_BEFORE.push([oldTree, fragment]);
  }

  // Find elements to replace and remove.
  for (let i = 0; i < oldChildNodes.length; i++) {
    const oldChildNode = oldChildNodes[i];
    const newChildNode = newChildNodes[i];

    // If there was no new child to compare to, remove from the childNodes.
    if (!newChildNode) {
      if (patchset.REMOVE_CHILD === empty) { patchset.REMOVE_CHILD = []; }
      patchset.REMOVE_CHILD.push([oldTree, oldChildNode]);
      oldTree.childNodes.splice(i, 1);
      i--;
      continue;
    }

    const isOldInNewSet = newKeys.has(oldChildNode.key);
    const isNewInOldSet = oldKeys.has(newChildNode.key);
    const keyedNewChildNode = isOldInNewSet && newKeys.get(oldChildNode.key);
    const keyedOldChildNode = isNewInOldSet && oldKeys.get(newChildNode.key);
    const hasNoKeys = !hasOldKeys && !hasNewKeys;

    if (hasNoKeys && oldChildNode.nodeName !== newChildNode.nodeName) {
      if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
      patchset.REPLACE_CHILD.push([oldTree, newChildNode, oldChildNode]);
      oldTree.childNodes.splice(i, 1, newChildNode);
      continue;
    }

    // If using `keys` and this node exists in the new set, and is located at
    // the same index.
    if (!hasNoKeys && newChildNodes.indexOf(keyedNewChildNode) === i) {
      syncTree(oldChildNode, newChildNode, patches);
    }
    // If not using `keys` but the nodeNames match, sync the trees.
    else if (oldChildNode.nodeName === newChildNode.nodeName) {
      // Do not synchronize text nodes.
      syncTree(oldChildNode, newChildNode, patches);
    }
    // Replace the remaining elements, do not traverse further.
    else {
      // If we're using keys and we found a matching new node using the old key
      // we can do a direct replacement.
      if (keyedNewChildNode) {
        const newIndex = newChildNodes.indexOf(keyedNewChildNode);
        const prevTree = oldChildNodes[newIndex];

        oldChildNodes[i] = prevTree;
        oldChildNodes[newIndex] = oldChildNode;

        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([oldTree, oldChildNode, prevTree]);
        continue;
      }

      // If we're using keys and found a matching old node using the new key
      // we can do a direct replacement.
      if (keyedOldChildNode) {
        // Remove from old position.
        oldChildNodes.splice(oldChildNodes.indexOf(keyedOldChildNode), 1);

        const oldChildNode = oldChildNodes[i];

        // Assign to the new position.
        oldChildNodes[i] = keyedOldChildNode;

        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([oldTree, keyedOldChildNode, oldChildNode]);
      }

      if (!hasOldKeys && !hasNewKeys && oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([oldTree, newChildNode, oldChildNode]);
        oldTree.childNodes[i] = newChildNode;
        newChildNodes.splice(newChildNodes.indexOf(newChildNode), 1);
      }
    }
  }

  // If both VTrees are text nodes then copy the value over.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;
      NODE_VALUE.push([oldTree, decodeEntities(oldTree.nodeValue)]);
      TREE_OPERATIONS.push(patchset);
      return patches;
    }
  }

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (newTree.nodeType === 1) {
    const setAttributes = [];
    const removeAttributes = [];
    const { attributes: oldAttributes } = oldTree;
    const { attributes: newAttributes } = newTree;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      oldTree.attributes[key] = value;
      setAttributes.push([key, value]);
    }

    // Search for removals.
    for (let key in oldAttributes) {
      if (key in newAttributes) { continue; }
      removeAttributes.push(key);
      delete oldAttributes[key];
    }

    if (setAttributes.length) {
      SET_ATTRIBUTE.push([oldTree, setAttributes]);
    }

    if (removeAttributes.length) {
      REMOVE_ATTRIBUTE.push([oldTree, removeAttributes]);
    }
  }

  // We want to look if anything has changed, if nothing has we'll splice out
  // the array to clean up the aptches array.
  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;
  const treeHasChanged = INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD;

  // Remove the patch set if nothing changed.
  if (treeHasChanged) { TREE_OPERATIONS.push(patchset); }

  return patches;
}
