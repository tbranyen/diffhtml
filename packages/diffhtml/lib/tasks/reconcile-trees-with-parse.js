import { NodeCache } from '../util/caches';
import { protectVTree, unprotectVTree } from '../util/memory';
import parse from '../util/parser';
import createTree from '../tree/create';

export default function reconcileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup, measure } = state;
  const { inner } = options;

  measure('reconcile trees');

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

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    const { childNodes } = parse(markup, null, options);

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.
    transaction.newTree = createTree(
      inner ? childNodes : childNodes[0] || childNodes
    );
  }
  // Otherwise the value passed is a Virtual Tree or an Array.
  else {
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

  measure('reconcile trees');
}
