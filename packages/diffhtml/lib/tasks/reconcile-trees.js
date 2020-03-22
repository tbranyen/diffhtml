import { NodeCache } from '../util/caches';
import { protectVTree, unprotectVTree } from '../util/memory';
import createTree from '../tree/create';
import Transaction from '../transaction';

/**
 *
 * @param {Transaction} transaction
 */
export default function reconcileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup } = state;
  const { inner } = options;
  const { outerHTML } = /** @type {any} */ (domNode);

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== outerHTML || !state.oldTree || !outerHTML) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);

      // Wipe out the existing root if it exists.
      NodeCache.delete(state.oldTree);
    }

    // Reset the old tree with the newly created VTree association.
    state.oldTree = createTree(domNode);
    NodeCache.set(state.oldTree, /** @type {any} */ (domNode));
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).
  if (!transaction.newTree) {
    transaction.newTree = createTree(markup);
  }

  // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.
  const { oldTree, newTree } = transaction;

  if (inner && oldTree && newTree) {
    const { nodeName, attributes } = oldTree;
    const isUnknown = typeof newTree.rawNodeName !== 'string';
    const isFragment = newTree.nodeType === 11;
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;

    transaction.newTree = createTree(nodeName, attributes, children);
  }
}
