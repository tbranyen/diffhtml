import * as Node from '../node';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
export default function patch(transaction) {
  const { domNode, state, state: { measure }, patches } = transaction;
  const { promises = [] } = transaction;

  measure('patch node');
  promises.push(...Node.patchNode(patches, state));
  measure('patch node');

  transaction.promises = promises;
}
