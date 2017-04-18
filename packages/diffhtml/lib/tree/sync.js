import { TreePointerCache, MiddlewareCache } from '../util/caches';

const { SyncTreeHookCache } = MiddlewareCache;
const { assign, keys } = Object;
const empty = {};
const keyNames = ['old', 'new'];

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
export default function syncTree(oldTree, newTree, patches) {
  // Allow a pointer to be set to a different render tree.
  if (TreePointerCache.has(oldTree)) {
    oldTree = TreePointerCache.get(oldTree);
  }

  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;

  const oldNodeName = oldTree.nodeName;
  const newNodeName = newTree.nodeName;
  const isFragment = newTree.nodeType === 11;
  const isEmpty = oldTree === empty;

  // Reuse these maps, it's more efficient to clear them than to re-create.
  const keysLookup = { old: new Map(), new: new Map() };

  if (process.env.NODE_ENV !== 'production') {
    if (newTree === empty) {
      throw new Error('Missing new Virtual Tree to sync changes from');
    }

    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error(
        `Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`
      );
    }
  }

  // Reduce duplicate logic by condensing old and new operations in a loop.
  for (let i = 0; i < keyNames.length; i++) {
    const keyName = keyNames[i];
    const map = keysLookup[keyName];
    const vTree = arguments[i];
    const nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const vTree = nodes[i];

        if (vTree.key) {
          map.set(vTree.key, vTree);
        }
        else if (map.size && vTree.nodeType === 1) {
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(
              `Missing \`key\` all siblings must supply this attribute.

Virtual Element: ${JSON.stringify(vTree, null, 2)}`
            );
          }
        }
      }
    }
  }

  // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.
  SyncTreeHookCache.forEach((fn, retVal) => {
    if (retVal = fn(oldTree, newTree, null)) {
      newTree = retVal;
    }

    for (let i = 0; i < newTree.childNodes.length; i++) {
      const oldChildNode = isEmpty ? empty : oldTree.childNodes[i];
      const newChildNode = newTree.childNodes[i];

      if (retVal = fn(oldChildNode, newChildNode, keysLookup)) {
        newTree.childNodes[i] = retVal;
      }
    }
  });

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
    TREE_OPS: [],
    NODE_VALUE: [],
  };

  const { SET_ATTRIBUTE, REMOVE_ATTRIBUTE, TREE_OPS, NODE_VALUE } = patches;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: [],
    REMOVE_CHILD: [],
    REPLACE_CHILD: [],
  };

  // USED: INSERT_BEFORE: 3x, REMOVE_CHILD: 2x, REPLACE_CHILD: 3x.
  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;
  const isElement = newTree.nodeType === 1;

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newTree.nodeName === '#text') {
    // If there was no previous element to compare to, simply set the value
    // on the new node.
    if (oldTree.nodeName !== '#text') {
      NODE_VALUE.push(newTree, newTree.nodeValue, null);
    }
    // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
    else if (!isEmpty && oldTree.nodeValue !== newTree.nodeValue) {
      NODE_VALUE.push(oldTree, newTree.nodeValue, oldTree.nodeValue);
      oldTree.nodeValue = newTree.nodeValue;
    }

    return patches;
  }

  // Seek out attribute changes first, but only from element Nodes.
  if (isElement) {
    const oldAttributes = isEmpty ? empty : oldTree.attributes;
    const newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      SET_ATTRIBUTE.push(isEmpty ? newTree : oldTree, key, value);
    }

    // Search for removals.
    if (!isEmpty) {
      for (let key in oldAttributes) {
        if (key in newAttributes) { continue; }
        REMOVE_ATTRIBUTE.push(oldTree, key);
        delete oldAttributes[key];
      }
    }
  }

  // If there was no `oldTree` provided, we have sync'd all the attributes and
  // the node value of the `newTree` so we can early abort and not worry about
  // tree operations.
  if (isEmpty) {
    return patches;
  }

  // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  if (process.env.NODE_ENV !== 'production') {
    if (oldNodeName !== newNodeName && !isFragment) {
      throw new Error(
        `Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`
      );
    }
  }

  const oldChildNodes = oldTree.childNodes;
  const newChildNodes = newTree.childNodes;

  // If we are working with keys, we can follow an optimized path.
  if (keysLookup.old.size || keysLookup.new.size) {
    const values = keysLookup.old.values();

    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      const oldChildNode = oldChildNodes[i];
      const newChildNode = newChildNodes[i];
      const newKey = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      const oldKey = oldChildNode.key;
      const oldInNew = keysLookup.new.has(oldKey);
      const newInOld = keysLookup.old.has(newKey);

      // Remove the old Node and insert the new node (aka replace).
      if (!oldInNew && !newInOld) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }
      // Remove the old node instead of replacing.
      else if (!oldInNew) {
        REMOVE_CHILD.push(oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
        i = i - 1;
        continue;
      }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        let optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (newKey && newInOld) {
          optimalNewNode = keysLookup.old.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        }
        else if (newKey) {
          optimalNewNode = newChildNode;

          // Find attribute changes for this Node.
          syncTree(null, newChildNode, patches);
        }

        INSERT_BEFORE.push(oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(i, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
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
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
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
      REMOVE_CHILD.push(oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE.length || REMOVE_CHILD.length || REPLACE_CHILD.length) {
    // Null out the empty arrays.
    if (!INSERT_BEFORE.length) { patchset.INSERT_BEFORE = null; }
    if (!REMOVE_CHILD.length) { patchset.REMOVE_CHILD = null; }
    if (!REPLACE_CHILD.length) { patchset.REPLACE_CHILD = null; }

    TREE_OPS.push(patchset);
  }

  return patches;
}
