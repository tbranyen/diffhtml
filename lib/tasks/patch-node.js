import { patchNode } from '../node/patch';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
export default function patch(transaction) {
  const { state, patches } = transaction;

  state.mark('patch');

  // Set the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  transaction.promises = patchNode(patches, state).filter(Boolean);

  state.mark('patch');
}
