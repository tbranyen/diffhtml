import { syncTrees } from '../lib/tasks';

const reconcileTrees = transaction => {
  transaction.oldTree = transaction.domNode;
  transaction.newTree = transaction.markup;
};

const endAsPatches = transaction => {
  const { patches } = transaction;
  const { TREE_OPS, SET_ATTRIBUTE, REMOVE_ATTRIBUTE, NODE_VALUE } = patches;

  return {
    hasPatches() {
      return Boolean(
        TREE_OPS.length ||
        SET_ATTRIBUTE.length ||
        REMOVE_ATTRIBUTE.length ||
        NODE_VALUE.length
      );
    }
  };
};

export default [
  reconcileTrees,
  syncTrees,
  endAsPatches,
];
