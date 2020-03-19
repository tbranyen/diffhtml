import patchNode from '../node/patch';
import Transaction from '../transaction';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Transaction} transaction
 * @return {void}
 */
export default function patch(transaction) {
  const { domNode, state, state: { measure }, patches } = transaction;
  const { nodeName } = domNode;
  const promises = transaction.promises || [];
  const namespaceURI = domNode.namespaceURI || '';

  state.isSVG = nodeName.toLowerCase() === 'svg' || namespaceURI.includes('svg');
  state.ownerDocument = domNode.ownerDocument || document;

  measure('patch node');
  promises.push(...patchNode(patches, state));
  measure('patch node');

  transaction.promises = promises;
}