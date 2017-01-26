import * as Tree from '../tree';

export default function syncTrees(transaction) {
  const { state: { measure, oldTree }, newTree } = transaction;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  if (oldTree.nodeName !== newTree.nodeName) {
    transaction.patches = { TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }] };
    transaction.oldTree = transaction.state.oldTree = newTree;
  }
  // Otherwise only diff the children.
  else {
    transaction.patches = Tree.syncTree(oldTree, newTree);
  }

  measure('sync trees');
}
