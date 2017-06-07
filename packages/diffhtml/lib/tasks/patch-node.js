import patchNode from '../node/patch';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
export default function patch(transaction) {
  const { domNode, state, state: { measure }, patches } = transaction;
  const { promises = [] } = transaction;

  // Is the root SVG?
  state.isSVG = transaction.oldTree.nodeName === 'svg';

  // Set the ownerDocument.
  state.ownerDocument = domNode.ownerDocument || document;

  measure('patch node');
  promises.push(...patchNode(patches, state));
  measure('patch node');

  transaction.promises = promises;
}
