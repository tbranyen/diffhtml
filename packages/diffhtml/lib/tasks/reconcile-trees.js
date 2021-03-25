import { StateCache, NODE_TYPE, VTree } from '../util/types';
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
  const { state, mount, input, config: options } = transaction;
  const { previousMarkup } = state;
  const { inner } = options;
  const mountAsHTMLEl = /** @type {HTMLElement} */ (mount);
  const { outerHTML } = mountAsHTMLEl;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== outerHTML || !state.oldTree || !outerHTML) {
    release(mount);
    state.oldTree = createTree(mountAsHTMLEl);
    protectVTree(state.oldTree);

    // Reset the state cache after releasing.
    StateCache.set(mount, state);
  }

  const { nodeName, attributes } = state.oldTree;
  const inputAsVTree = /** @type {VTree} */(input);

  // TODO When `inner === false` this means we are doing outerHTML operation.
  // The way this works is that anything that doesn't match the oldTree element
  // gets diffed internally. Anything that matches the root element at the top
  // level gets absorbed into the root element. Order is not important. Elements
  // which are matched subsequently are merged, but only the first occurance of
  // an attribute is counted. The rules are complicated, but if we match the
  // browser behavior here, it will be significantly easier to convince of it's
  // validity and to document.

  // To mimic browser behavior, we loop the input and take any tree that matches
  // the root element and unwrap into the root element. We take the attributes
  // from that element and apply to the root element. This ultimately renders a
  // flat tree and allows for whitespace to be provided in the `html` function
  // without needing to trim.
  if (
    !inner &&
    inputAsVTree.nodeType === NODE_TYPE.FRAGMENT &&
    // Do not modify the new children when comparing two fragments.
    state.oldTree.nodeType !== NODE_TYPE.FRAGMENT
  ) {
    /** @type {VTree[]} */
    let foundElements = [];

    inputAsVTree.childNodes.forEach(value => {
      const isText = value.nodeType === NODE_TYPE.TEXT;

      // This is most likely the element that is requested to compare to. Will
      // need to keep checking or more input though to be totally sure.
      if (!isText || value.nodeValue.trim()) {
        foundElements.push(value);
      }
    });

    // If only one element is found, we can use this directly.
    if (foundElements.length === 1) {
      transaction.newTree = foundElements[0];
    }
    // Otherwise consider the entire fragment.
    else if (foundElements.length > 1) {
      transaction.newTree = createTree(inputAsVTree.childNodes);
    }
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
    const isUnknown = typeof newTree.rawNodeName !== 'string';
    const isFragment = newTree.nodeType === NODE_TYPE.FRAGMENT;
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;

    transaction.newTree = createTree(nodeName, attributes, children);
  }
}
