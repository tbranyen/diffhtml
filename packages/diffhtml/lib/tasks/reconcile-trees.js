import { StateCache } from '../util/caches';
import { protectVTree } from '../util/memory';
import createTree from '../tree/create';
import Transaction from '../transaction';
import release from '../release';

/**
 * This task ensures that the Virtual DOM matches the Browser DOM. If any of
 * the markup changes between renders, the old tree is recalculated to ensure
 * accuracy.
 *
 * @param {Transaction} transaction
 */
export default function reconcileTrees(transaction) {
  const { state, domNode, input, options } = transaction;
  const { previousMarkup } = state;
  const { inner } = options;
  const domNodeAsHTMLEl = /** @type {HTMLElement} */ (domNode);
  const { outerHTML } = domNodeAsHTMLEl;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== outerHTML || !state.oldTree || !outerHTML) {
    release(domNode);
    state.oldTree = createTree(domNodeAsHTMLEl);
    protectVTree(state.oldTree);

    // Reset the state cache after releasing.
    StateCache.set(domNode, state);
  }

  // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).
  if (!transaction.newTree) {
    // Reset the old tree with the newly created VTree association.
    transaction.newTree = createTree(input);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  const { oldTree, newTree } = transaction;

  // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.
  if (inner && oldTree && newTree) {
    const { nodeName, attributes } = oldTree;
    const isUnknown = typeof newTree.rawNodeName !== 'string';
    const isFragment = newTree.nodeType === 11;
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;

    transaction.newTree = createTree(nodeName, attributes, children);
  }
}
