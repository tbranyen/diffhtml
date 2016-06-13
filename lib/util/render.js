import createTransaction from '../node/transaction';
import { StateCache } from '../util/cache';
import { cleanMemory } from '../util/memory';

/**
 * Pulls the next render buffer object (containing the respective arguments to
 * patchNode) and invokes the next render transaction.
 *
 * @param state
 */
const renderNext = (state) => {
  const nextRender = state.nextRender;
  state.nextRender = undefined;

  createTransaction(nextRender.node, nextRender.newHTML, nextRender.options);
};

/**
 * When the render completes, clean up memory, and schedule the next render if
 * necessary.
 *
 * @param node
 * @param state
 * @return {Function} - Closure that when called completes rendering
 */
export function completeRender(node, state) {
  return function invokeRender() {
    const isInner = state.options.inner;

    state.previousMarkup = isInner ? node.innerHTML : node.outerHTML;
    state.previousText = node.textContent;

    state.isRendering = false;

    // Boolean to stop operations in the StateCache loop below.
    var stopLooping = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises. If this element has a next
    // render state, trigger it first as priority.
    if (state.nextRender) {
      renderNext(state);
    }
    // Otherwise dig into the other states and pick off the first one
    // available.
    else {
      StateCache.forEach(state => {
        if (!stopLooping && state.nextRender) {
          renderNext(state);
          stopLooping = true;
        }
      });
    }

    // Clean out all the existing allocations.
    cleanMemory();

    // Dispatch an event on the node once rendering has completed.
    node.dispatchEvent(new CustomEvent('renderComplete'));
  };
}
