import * as Node from '../node';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
export default function patch(transaction) {
  const { state, state: { measure }, patches } = transaction;

  measure('patch node');
  transaction.promises = Node.patchNode(patches, state).filter(Boolean);
  measure('patch node');
}
