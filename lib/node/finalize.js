import createTransaction from '../node/transaction';
import { StateCache } from '../util/cache';
import { cleanMemory } from '../util/memory';

/**
 * Pulls the next render object (containing the respective arguments to
 * patchNode) and invokes the next transaction.
 *
 * @param state
 */
const renderNext = (state) => {
  const nextRender = state.nextRender;
  state.nextRender = undefined;

  createTransaction(nextRender.node, nextRender.newHTML, nextRender.options);
};

/**
 * Returns a callback that finalizes the transaction, setting the isRendering
 * flag to false. This allows us to pick off and invoke the next available
 * transaction to render. This code recyles the unprotected allocated pool
 * objects and triggers a `renderComplete` event.
 *
 * @param {Object} node - A DOM Node that has just had patches applied
 * @param {Object} state - The current state object associated with the Node
 * @return {Function} - Closure that when called completes the transaction
 */
export default function getFinalizeCallback(node, state) {
  /**
   * When the render completes, clean up memory, and schedule the next render
   * if necessary.
   */
  return function finalizeTransaction() {
    const isInner = state.options.inner;

    state.previousMarkup = isInner ? node.innerHTML : node.outerHTML;
    state.previousText = node.textContent;

    state.isRendering = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises. If this element has a next
    // render state, trigger it first as priority.
    if (state.nextRender) {
      renderNext(state);
    }
    // Otherwise dig into the other states and pick off the first one
    // available.
    else {
      for (let state of StateCache.entries()) {
        if (state.nextRender) {
          renderNext(state);
          break;
        }
      }
    }

    // Clean out all the existing allocations.
    cleanMemory();

    // Dispatch an event on the node once rendering has completed.
    node.dispatchEvent(new CustomEvent('renderComplete'));
  };
}
