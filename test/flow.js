import { syncTrees } from '../lib/tasks';

const reconcileTrees = transaction => {
  transaction.oldTree = domNode;
  transaction.newTree = markup;
};

const endAsPatches = transaction => transaction.patches;

const tasks = [
  reconcileTrees,
  syncTrees,
  endAsPatches,
];

export default tasks;
