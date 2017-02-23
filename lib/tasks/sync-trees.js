import * as Tree from '../tree';
import { createNode } from '../node';
import { StateCache, unprotectVTree } from '../util';

export default function syncTrees(transaction) {
  const { state: { measure, oldTree }, newTree, domNode } = transaction;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    transaction.patches = {
      TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }],
      SET_ATTRIBUTE: [],
      REMOVE_ATTRIBUTE: [],
      NODE_VALUE: [],
    };

    unprotectVTree(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;

    // Update the StateCache since we are changing the top level element.
    StateCache.set(createNode(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
    transaction.patches = Tree.syncTree(oldTree, newTree);
  }

  measure('sync trees');
}
