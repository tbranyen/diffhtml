import syncTree from '../tree/sync';
import createNode from '../node/create';
import { StateCache, NODE_TYPE, PATCH_TYPE, EMPTY, Mount } from '../util/types';
import process from '../util/process';
import Transaction from '../transaction';

export default function syncTrees(/** @type {Transaction} */ transaction) {
  const { state, state: { measure }, oldTree, newTree, mount } = transaction;

  measure('sync trees');

  if (process.env.NODE_ENV !== 'production') {
    if (!oldTree) {
      throw new Error('Missing old tree during synchronization');
    }

    if (!newTree) {
      throw new Error('Missing new tree during synchronization');
    }
  }

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (
    oldTree &&
    newTree &&
    oldTree.nodeName !== newTree.nodeName &&
    newTree.nodeType !== NODE_TYPE.FRAGMENT
  ) {
    // If there is no `parentNode` for the replace operation, we will need to
    // throw an error and prevent the `StateCache` from being updated.
    if (process.env.NODE_ENV !== 'production') {
      if (!/** @type {HTMLElement} */ (mount).parentNode) {
        throw new Error('Unable to replace top level node without a parent');
      }
    }

    // Replace the top level elements.
    transaction.patches = [
      PATCH_TYPE.REPLACE_CHILD,
      newTree,
      oldTree,
    ];

    // Clean up the existing old tree, and mount the new tree.
    transaction.oldTree = state.oldTree = newTree;

    const newNode = createNode(newTree);

    // Update the StateCache since we are changing the top level element.
    StateCache.delete(mount);
    StateCache.set(/** @type {Mount} */ (newNode), state);

    transaction.mount = /** @type {HTMLElement} */ (newNode);

    if (newTree.nodeName === 'script') {
      state.scriptsToExecute.set(newTree, newTree.attributes.type || EMPTY.STR);
    }
  }
  // Synchronize the top level elements.
  else {
    transaction.patches = syncTree(
      oldTree || null,
      newTree || null,
      [],
      state,
    );
  }

  measure('sync trees');
}
