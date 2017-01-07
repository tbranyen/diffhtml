import * as Tree from '../tree';

export default function syncTrees(transaction) {
  const { state: { measure, oldTree }, newTree } = transaction;

  measure('sync trees');
  transaction.patches = Tree.syncTree(oldTree, newTree);
  measure('sync trees');
}
