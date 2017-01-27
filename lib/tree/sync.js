const { assign, keys } = Object;
const empty = null;

// Reuse these maps, it's more performant to clear them than recreate.
const oldKeys = new Map();
const newKeys = new Map();

const propToAttrMap = {
  className: 'class',
  htmlFor: 'for',
};

export default function syncTree(oldTree, newTree, patches) {
  if (!oldTree) { throw new Error('Missing existing tree to sync from'); }
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  const { nodeName: oldTreeName } = oldTree;
  const { nodeName: newTreeName } = newTree;

  if (oldTreeName !== newTreeName) {
    throw new Error(
      `Sync failure, cannot compare ${newTreeName} with ${oldTreeName}`
    );
  }

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
    INSERT_BEFORE: empty,
    REMOVE_CHILD: empty,
    REPLACE_CHILD: empty,
  };

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

      const { key } = newChildNode;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        // Prefer an existing match to a brand new element.
        let newElement = null;

        // Prefer existing to new and remove from old position.
        if (oldKeys.has(key)) {
          newElement = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(newElement), 1);
        }
        else {
          newElement = newKeys.get(key) || newChildNode;
        }

        if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push([oldTree, newElement]);
        oldChildNodes.push(newElement);
        continue;
      }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (key !== oldChildNode.key) {
        let newElement = newChildNode;

        // Prefer existing to new and remove from old position.
        if (key && oldKeys.has(key)) {
          newElement = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(newElement), 1);
        }
        else if (key) {
          newElement = newKeys.get(key);
        }

        if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push([oldTree, newElement, oldChildNode]);
        oldChildNodes.splice(i, 0, newElement);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([newChildNode, oldChildNode]);
        oldTree.childNodes[i] = newChildNode;
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
        if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push([oldTree, newChildNode]);
        oldChildNodes.push(newChildNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([newChildNode, oldChildNode]);
        oldTree.childNodes[i] = newChildNode;
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      if (patchset.REMOVE_CHILD === empty) { patchset.REMOVE_CHILD = []; }
      patchset.REMOVE_CHILD.push(oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // If both VTrees are text nodes and the values are different, change the
  // NODE_VALUE.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;
      NODE_VALUE.push(oldTree, oldTree.nodeValue);

      const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;

      // We want to look if anything has changed, if nothing has we won't add
      // it to the patchset.
      if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
        TREE_OPS.push(patchset);
      }

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

      // Alias prop names to attr names for patching purposes.
      if (key in propToAttrMap) {
        key = propToAttrMap[key];
      }

      SET_ATTRIBUTE.push(oldTree, key, value);
    }

    // Search for removals.
    for (let key in oldAttributes) {
      if (key in newAttributes) { continue; }
      REMOVE_ATTRIBUTE.push(oldTree, key);
      delete oldAttributes[key];
    }
  }

  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
    TREE_OPS.push(patchset);
  }

  return patches;
}
