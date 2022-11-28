/**
 * @typedef {import('../util/types').TransactionState} TransactionState
 * @typedef {import('../util/types').VTree} VTree
 * @typedef {import('../transaction').default} Transaction
 */
import internalProcess from '../util/process';
import {
  SyncTreeHookCache,
  PATCH_TYPE,
  NODE_TYPE,
  EMPTY,
} from '../util/types';

const { assign } = Object;
const { max } = Math;
const keyNames = ['old', 'new'];
const textName = '#text';

/**
 * Compares how the new state should look to the old state and mutates it,
 * while recording the changes along the way.
 *
 * @param {Partial<VTree> | null} oldTree
 * @param {Partial<VTree> | null=} newTree
 * @param {any[]} patches
 * @param {Partial<TransactionState>} state
 * @param {Transaction} transaction
 * @param {boolean=} attributesOnly
 *
 * @return {any[] | false | null}
 */
export default function syncTree(
  oldTree,
  newTree,
  patches = [],
  state = {},
  transaction = EMPTY.OBJ,
  attributesOnly,
) {
  if (!oldTree) oldTree = /** @type {VTree} */ (EMPTY.OBJ);
  if (!newTree) newTree = /** @type {VTree} */ (EMPTY.OBJ);

  const { svgElements = new Set() } = state;
  const isEmpty = oldTree === EMPTY.OBJ || attributesOnly;

  let shortCircuit = null;

  // Invoke the SyncTree hooks which allow middleware to do their own custom
  // sync logic. This may mean short-circuiting the sync completely by
  // returning the previous tree. This effectively sandboxes an element in the
  // DOM from changes or diffs. Another useful way to use these hooks are to
  // take the new tree, and convert it into something else. This is how
  // components are implemented.
  if (SyncTreeHookCache.size) {
    SyncTreeHookCache.forEach(fn => {
      // Call the user provided middleware function for a single root node.
      // Allow the consumer to specify a return value of a different VTree
      // (useful for components).
      const entry = fn(oldTree, newTree, transaction);

      // If the value returned matches the original element, then short circuit
      // and do not dig further.
      if (entry && entry === oldTree) {
        shortCircuit = patches;
      }
      // Allow skipping an element for diffing. It will be preserved and kept
      // in the DOM.
      else if (entry === false) {
        shortCircuit = false;
      }
      // Merge the returned tree into the newTree.
      else if (entry) {
        assign(/** @type {Partial<VTree>} */ (newTree), entry);
      }
    });
  }

  if (shortCircuit !== null || !newTree) {
    return shortCircuit;
  }

  const oldNodeName = oldTree.nodeName;
  const newNodeName = newTree.nodeName;

  // Check for SVG in parent.
  const isSVG = newNodeName === 'svg' || svgElements.has(
    /** @type {VTree} */ (newTree)
  );

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newNodeName === textName) {
    if (oldNodeName === textName && oldTree.nodeValue !== newTree.nodeValue) {
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

  const newChildNodes = newTree.childNodes || [];

  // Seek out attribute changes first, but only from element Nodes.
  if (newTree.nodeType === NODE_TYPE.ELEMENT) {
    const oldAttributes = isEmpty ? EMPTY.OBJ : oldTree.attributes;
    const newAttributes = newTree.attributes || EMPTY.OBJ;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      // Skip script types as these are handled special by the transaction
      // patch and end tasks.
      if (
        // Do not block existing scripts being modified.
        (!oldTree || oldTree.nodeName !== 'script')
        && newTree.nodeName === 'script' && key === 'type') {
        continue;
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

  // Scan all childNodes for attribute changes.
  if (attributesOnly) {
    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      // Ensure all SVG elements are tracked.
      isSVG && svgElements.add(newChildNodes[i]);
      syncTree(null, newChildNodes[i], patches, state, transaction, true);
    }

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
          if (internalProcess.env.NODE_ENV !== 'production') {
            if (map.has(vTree.key)) {
              throw new Error(`Key: ${vTree.key} cannot be duplicated`);
            }
          }

          map.set(vTree.key, vTree);
        }
      }
    }
  }

  /** @type {VTree[]} */
  const oldChildNodes = (oldTree.childNodes) || [];

  // Used when skipping over nodes during syncTreeHook.
  let maxLength = max(newChildNodes.length, oldChildNodes.length);

  // Always perform a full diff based on the largest set of nodes. The end user
  // may want to do something with any of them, so while it may be more
  // performant to only loop over the new nodes, we loop over all instead.
  for (let i = 0; i < maxLength; i++) {
    const oldChildNode = oldChildNodes && oldChildNodes[i];
    const newChildNode = newChildNodes[i];

    // Check for SVG in child as well.
    if (isSVG || (newChildNode && newChildNode.nodeName === 'svg')) {
      svgElements.add(newChildNode);
    }

    // If there is no new child node, we will skip this comparison. If the old
    // node is something we want to preserve, we can migrate it to the new
    // nodes.
    if (!newChildNode) {
      if (syncTree(oldChildNode, null, patches, state, transaction, true) === false) {
        newChildNodes.splice(i, 0, oldChildNode);
      }

      continue;
    }

    // If there is no old element to compare to, this is a simple addition.
    if (!oldChildNode) {
      oldChildNodes.push(newChildNode);

      // Crawl this Node for any changes to apply.
      syncTree(null, newChildNode, patches, state, transaction, true);

      patches.push(
        PATCH_TYPE.INSERT_BEFORE,
        oldTree,
        newChildNode,
        null,
      );

      continue;
    }

    const newKey = newChildNode.key;
    const oldKey = oldChildNode.key;
    const oldInNew = keysLookup.new.has(oldKey);
    const newInOld = keysLookup.old.has(newKey);

    // If we are working with keys, we can follow an optimized path.
    if (oldKey || newKey) {
      // Remove the old node instead of replacing.
      if (!oldInNew && !newInOld) {
        syncTree(oldChildNode, newChildNode, patches, state, transaction, true);
        patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);

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
        syncTree(null, optimalNewNode, patches, state, transaction, true);

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

    const sameType = oldChildNode.nodeName === newChildNode.nodeName;
    const retVal = syncTree(oldChildNode, newChildNode, patches, state, transaction, !sameType);

    if (retVal === false) {
      newChildNodes.splice(i, 0, oldChildNode);
      maxLength += 1;
      continue;
    }

    // If the element we're replacing is totally different from the previous
    // replace the entire element, don't bother investigating children.
    if (!sameType) {
      oldChildNodes[i] = newChildNode;

      // This only works if VTrees are identical.
      const lookupIndex = oldChildNodes.lastIndexOf(newChildNode);

      if (lookupIndex > i) {
        oldChildNodes.splice(lookupIndex, 1);
      }

      patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);
    }
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
