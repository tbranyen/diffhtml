import { SyncTreeHookCache } from '../util/caches';
import process from '../util/process';
import { PATCH_TYPE, VTree } from '../util/types';

const empty = {};
const keyNames = ['old', 'new'];
const textName = '#text';

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
/**
 *
 * @param {Partial<VTree> | null} oldTree
 * @param {Partial<VTree> | null} newTree
 * @param {any[]} patches
 */
export default function syncTree(oldTree, newTree, patches = []) {
  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;

  const oldNodeName = oldTree.nodeName;
  const isFragment = newTree.nodeType === 11 || oldTree.nodeType === 11;
  const isEmpty = oldTree === empty;

  if (process.env.NODE_ENV !== 'production') {
    if (newTree === empty) {
      throw new Error('Missing new Virtual Tree to sync changes from');
    }

    // FIXME: Causes issues w/ React, we need to normalize at a higher level.
    if (!isEmpty && oldNodeName !== newTree.nodeName && !isFragment) {
      throw new Error(
        `Sync failure, cannot compare ${newTree.nodeName} with ${oldNodeName}`
      );
    }
  }

  let shortCircuit = null;

  // Invoke the SyncTree hooks which allow middleware to do their own custom
  // sync logic. This may mean short-circuiting the sync completely by
  // returning the previous tree. This effectively sandboxes an element in the
  // DOM from changes or diffs. Another useful way to use these hooks are to
  // take the new tree, and convert it into something else. This is how
  // components are implemented.
  SyncTreeHookCache.forEach(fn => {
    // Call the user provided middleware function for a single root node. Allow
    // the consumer to specify a return value of a different VTree (useful for
    // components).
    const entry = fn(oldTree, newTree);

    // If the value returned matches the original element, then short circuit
    // and do not dig further.
    if (entry && entry === oldTree) {
      shortCircuit = true;
    }
    // If the user has returned a value, treat it as the new tree.
    else if (entry) {
      newTree = entry;
    }
  });

  if (shortCircuit) {
    return patches;
  }

  /** @type {any} */
  const keysLookup = { old: new Map(), new: new Map() };

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
          if (process.env.NODE_ENV !== 'production') {
            if (map.has(vTree.key)) {
              throw new Error(`Key: ${vTree.key} cannot be duplicated`);
            }
          }

          map.set(vTree.key, vTree);
        }
      }
    }
  }

  const isElement = newTree.nodeType === 1;

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newTree.nodeName === textName) {
    if (oldTree.nodeName === textName && oldTree.nodeValue !== newTree.nodeValue) {
    // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
      patches.push(
        PATCH_TYPE.NODE_VALUE,
        oldTree,
        newTree.nodeValue,
        oldTree.nodeValue,
      );

      oldTree.nodeValue = newTree.nodeValue;

      return patches;
    }
    // Ensure new text nodes have decoded entities.
    else if (isEmpty) {
      patches.push(
        PATCH_TYPE.NODE_VALUE,
        newTree,
        newTree.nodeValue,
        null,
      );

      return patches;
    }
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

      patches.push(
        PATCH_TYPE.SET_ATTRIBUTE,
        isEmpty ? newTree : oldTree,
        key,
        value,
      );
    }

    // Search for removals.
    if (!isEmpty) {
      for (let key in oldAttributes) {
        if (key in newAttributes) { continue; }
        patches.push(PATCH_TYPE.REMOVE_ATTRIBUTE, oldTree, key);
        delete oldAttributes[key];
      }
    }
  }

  const newChildNodes = newTree.childNodes || [];

  // Scan all childNodes for attribute changes.
  if (isEmpty) {
    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      syncTree(null, newChildNodes[i], patches, newTree);
    }

    return patches;
  }

  /** @type {VTree[]} */
  const oldChildNodes = (oldTree.childNodes);

  // Do a single pass over the new child nodes.
  for (let i = 0; i < newChildNodes.length; i++) {
    const oldChildNode = oldChildNodes && oldChildNodes[i];
    const newChildNode = newChildNodes[i];
    const newKey = newChildNode.key;

    // If there is no old element to compare to, this is a simple addition.
    if (!oldChildNode) {
      oldChildNodes.push(newChildNode);

      // Crawl this Node for any changes to apply.
      syncTree(null, newChildNode, patches, oldTree);

      patches.push(
        PATCH_TYPE.INSERT_BEFORE,
        oldTree,
        newChildNode,
        null,
      );

      continue;
    }

    const oldKey = oldChildNode.key;
    const oldInNew = keysLookup.new.has(oldKey);
    const newInOld = keysLookup.old.has(newKey);

    // If we are working with keys, we can follow an optimized path.
    if (oldKey || newKey) {
      // Remove the old node instead of replacing.
      if (!oldInNew && !newInOld) {
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches, newTree);

        patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);

        i = i - 1;

        continue;
      }
      else if (!oldInNew) {
        patches.push(PATCH_TYPE.REMOVE_CHILD, oldChildNode);
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
        else {
          optimalNewNode = newChildNode;
        }

        // Crawl this Node for any changes to apply.
        syncTree(null, optimalNewNode, patches, oldTree);

        patches.push(
          PATCH_TYPE.INSERT_BEFORE,
          oldTree,
          optimalNewNode,
          oldChildNode,
        );

        oldChildNodes.splice(i, 0, optimalNewNode);
        continue;
      }
    }

    // If the element we're replacing is totally different from the previous
    // replace the entire element, don't bother investigating children.
    if (oldChildNode.nodeName !== newChildNode.nodeName) {
      oldChildNodes[i] = newChildNode;

      // This only works if VTrees are identical...
      const lookupIndex = oldChildNodes.lastIndexOf(newChildNode);

      if (lookupIndex > i) {
        oldChildNodes.splice(lookupIndex, 1);
      }

      syncTree(null, newChildNode, patches, newTree);

      patches.push(
        PATCH_TYPE.REPLACE_CHILD,
        newChildNode,
        oldChildNode,
      );

      continue;
    }

    syncTree(oldChildNode, newChildNode, patches, oldTree);
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      patches.push(PATCH_TYPE.REMOVE_CHILD, oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  return patches;
}
