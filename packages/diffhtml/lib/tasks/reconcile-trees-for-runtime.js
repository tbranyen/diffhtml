import { NodeCache } from '../util/caches';
import { protectVTree, unprotectVTree } from '../util/memory';
import createTree from '../tree/create';

export default function reconcileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup } = state;
  const { inner } = options;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);
    }

    state.oldTree = createTree(domNode);
    NodeCache.set(state.oldTree, domNode);
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  const { rawNodeName, nodeName, attributes } = transaction.oldTree;
  const newTree = createTree(markup);
  const isFragment = newTree.nodeType === 11;
  const isUnknown = typeof newTree.rawNodeName !== 'string';

  transaction.newTree = newTree;

  if (inner) {
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
    transaction.newTree = createTree(nodeName, attributes, children);
  }
}
