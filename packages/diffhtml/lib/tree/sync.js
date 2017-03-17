import { SyncTreeHookCache } from '../util/caches';

const { assign, keys } = Object;
const empty = {};

// Reuse these maps, it's more performant to clear them than to recreate.
const oldKeys = new Map();
const newKeys = new Map();

const propToAttrMap = {
  className: 'class',
  htmlFor: 'for',
};

const addTreeOperations = (TREE_OPS, patchset) => {
  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
    TREE_OPS.push(patchset);
  }
};

export default function syncTree(oldTree, newTree, patches) {
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  SyncTreeHookCache.forEach(fn => {
    // Invoke all the `syncTreeHook` functions passing along the old and new
    // VTrees. These functions must return valid vTree values.
    const retVal = fn(oldTree, newTree);

    if (retVal) {
      newTree = retVal;
    }
  });

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    TREE_OPS: [],
    NODE_VALUE: [],
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
  };

  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: null,
    REMOVE_CHILD: null,
    REPLACE_CHILD: null,
  };

  // Seek out attribute changes first, but only from element Nodes.
  if (newTree.nodeType === 1) {
    const oldAttributes = oldTree ? oldTree.attributes : empty;
    const { attributes: newAttributes } = newTree;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (oldTree) {
        oldAttributes[key] = value;
      }

      // Alias prop names to attr names for patching purposes.
      if (key in propToAttrMap) {
        key = propToAttrMap[key];
      }

      SET_ATTRIBUTE.push(oldTree || newTree, key, value);
    }

    if (oldTree) {
      // Search for removals.
      for (let key in oldAttributes) {
        if (key in newAttributes) { continue; }
        REMOVE_ATTRIBUTE.push(oldTree || newTree, key);
        delete oldAttributes[key];
      }
    }
  }

  // If both VTrees are text nodes and the values are different, change the
  // NODE_VALUE.
  if (newTree.nodeName === '#text') {
    if (oldTree && oldTree.nodeName === '#text') {
      if (oldTree.nodeValue !== newTree.nodeName) {
        NODE_VALUE.push(oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
        addTreeOperations(TREE_OPS, patchset);
        return patches;
      }
    }
    else {
      NODE_VALUE.push(newTree, newTree.nodeValue, null);
      addTreeOperations(TREE_OPS, patchset);
      return patches;
    }
  }

  // If there was no oldTree specified, this is a new element so scan for
  // attributes.
  if (!oldTree) {
    // Dig into all nested children for attribute changes.
    for (let i = 0; i < newTree.childNodes.length; i++) {
      syncTree(null, newTree.childNodes[i], patches);
    }

    return patches;
  }

  const { nodeName: oldNodeName } = oldTree;
  const { nodeName: newNodeName } = newTree;

  if (oldNodeName !== newNodeName && newTree.nodeType !== 11) {
    throw new Error(
      `Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`
    );
  }

  const { childNodes: oldChildNodes } = oldTree;
  const { childNodes: newChildNodes } = newTree;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  const hasOldKeys = oldChildNodes.some(vTree => vTree.key);
  const hasNewKeys = newChildNodes.some(vTree => vTree.key);

  // If we are working with keys, we can follow an optimized path.
  if (hasOldKeys || hasNewKeys) {
    oldKeys.clear();
    newKeys.clear();

    // Put the old `childNode` VTree's into the key cache for lookup.
    for (let i = 0; i < oldChildNodes.length; i++) {
      const vTree = oldChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        oldKeys.set(vTree.key, vTree);
      }
    }

    // Put the new `childNode` VTree's into the key cache for lookup.
    for (let i = 0; i < newChildNodes.length; i++) {
      const vTree = newChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        newKeys.set(vTree.key, vTree);
      }
    }

    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      const oldChildNode = oldChildNodes[i];
      const newChildNode = newChildNodes[i];
      const { key: newKey } = newChildNode;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        if (patchset.INSERT_BEFORE === null) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      const { key: oldKey } = oldChildNode;

      // Remove the old Node and insert the new node (aka replace).
      if (!newKeys.has(oldKey) && !oldKeys.has(newKey)) {
        if (patchset.REPLACE_CHILD === null) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }
      // Remove the old node instead of replacing.
      else if (!newKeys.has(oldKey)) {
        if (patchset.REMOVE_CHILD === null) { patchset.REMOVE_CHILD = []; }
        patchset.REMOVE_CHILD.push(oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
        i = i - 1;
        continue;
      }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        let optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (newKey && oldKeys.has(newKey)) {
          optimalNewNode = oldKeys.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        }
        else if (newKey) {
          optimalNewNode = newChildNode;

          // Find attribute changes for this Node.
          syncTree(null, newChildNode, patches);
        }

        if (patchset.INSERT_BEFORE === null) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push(oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(i, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === null) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldTree.childNodes[i] = newChildNode;
        syncTree(null, newChildNode, patches);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      const oldChildNode = oldChildNodes[i];
      const newChildNode = newChildNodes[i];

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        if (patchset.INSERT_BEFORE === null) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === null) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldTree.childNodes[i] = newChildNode;
        syncTree(null, newChildNode, patches);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      if (patchset.REMOVE_CHILD === null) { patchset.REMOVE_CHILD = []; }
      patchset.REMOVE_CHILD.push(oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  addTreeOperations(TREE_OPS, patchset);

  return patches;
}
