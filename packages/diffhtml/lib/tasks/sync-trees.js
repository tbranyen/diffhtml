import syncTree, { PATCH_TYPE } from '../tree/sync';
import createNode from '../node/create';
import { StateCache } from '../util/caches';
import { protectVTree, unprotectVTree } from '../util/memory';

export default function syncTrees(transaction) {
  const { state: { measure }, oldTree, newTree, domNode } = transaction;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // If there is no `parentNode` for the replace operation, we will need to
    // throw an error and prevent the `StateCache` from being updated.
    if (!domNode.parentNode) {
      throw new Error('Unable to replace top level node without a parent');
    }

    // Replace the top level elements.
    transaction.patches = [
      PATCH_TYPE.REPLACE_CHILD,
      newTree,
      oldTree,
    ];

    // Clean up the existing old tree, and mount the new tree.
    unprotectVTree(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    protectVTree(transaction.oldTree);

    // Update the StateCache since we are changing the top level element.
    StateCache.delete(domNode);
    StateCache.set(createNode(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
    transaction.patches = syncTree(oldTree, newTree, []);
  }

  measure('sync trees');
}
