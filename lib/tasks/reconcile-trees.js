import { protectVTree, unprotectVTree, parse } from '../util';
import { createTree } from '../tree';

const { assign, keys } = Object;
const { isArray } = Array;

export default function reconcileTrees(transaction) {
  const { state, state: { measure }, domNode, markup, options } = transaction;
  const { previousMarkup, previousText } = state;
  const { inner } = options;

  measure('reconcile trees');

  // This looks for changes in the DOM from what we'd expect. This means we
  // need to rebuild the old Virtual Tree. This allows for keeping our tree
  // in sync with unexpected DOM changes. It's not very performant, so
  // ideally you should never change markup that diffHTML affects from
  // outside of diffHTML if performance is a concern.
  const sameInnerHTML = inner ? previousMarkup === domNode.innerHTML : true;
  const sameOuterHTML = inner ? true : previousMarkup === domNode.outerHTML;
  const sameTextContent = previousText === domNode.textContent;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);
    }

    // Set the `oldTree` in the state as-well-as the transaction. This allows
    // it to persist with the DOM Node and also be easily available to
    // middleware and transaction tasks.
    state.oldTree = createTree(domNode);

    // We need to keep these objects around for comparisons.
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // We need to ensure that our target to diff is a Virtual Tree Element. This
  // function takes in whatever `markup` is and normalizes to a tree object.
  // The callback function runs on every normalized Node to wrap childNodes
  // in the case of setting innerHTML.

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    const { childNodes } = parse(markup, null, options);

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one.
    transaction.newTree = createTree(
      !inner && childNodes.length === 1 ? childNodes[0] : childNodes
    );
  }

  // Only create a document fragment for inner nodes if the user didn't already
  // pass an array. If they pass an array, `createTree` will auto convert to
  // a fragment.
  else if (options.inner) {
    const { nodeName, attributes } = transaction.oldTree;
    const newChildNodes = createTree(markup);

    transaction.newTree = createTree(nodeName, attributes, newChildNodes);

    // Flatten the fragment.
    if (newChildNodes.nodeType === 11) {
      transaction.newTree.childNodes = newChildNodes.childNodes;
    }
  }

  // Everything else gets passed into `createTree` to be figured out.
  else {
    transaction.newTree = createTree(markup);
  }

  measure('reconcile trees');
}
