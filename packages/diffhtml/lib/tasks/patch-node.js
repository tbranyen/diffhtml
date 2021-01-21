import patchNode from '../node/patch';
import Transaction from '../transaction';
import { CreateNodeHookCache } from '../util/caches';
import { VTree } from '../util/types';
import globalThis from '../util/global';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Transaction} transaction
 * @return {void}
 */
export default function patch(transaction) {
  const { domNode, state, state: { measure, scriptsToExecute }, patches } = transaction;

  measure('patch node');

  const { ownerDocument } = /** @type {HTMLElement} */ (domNode);
  const promises = transaction.promises || [];

  state.ownerDocument = ownerDocument || globalThis.document;

  // Hook into the Node creation process to find all script tags, and mark them
  // for execution.
  const collectScripts = (/** @type {VTree} */vTree) => {
    if (vTree.nodeName === 'script') {
      scriptsToExecute.set(vTree, vTree.attributes.type);
    }
  };

  CreateNodeHookCache.add(collectScripts);

  // Skip patching completely if we aren't in a DOM environment.
  if (state.ownerDocument) {
    promises.push(...patchNode(patches, state));
  }

  CreateNodeHookCache.delete(collectScripts);

  transaction.promises = promises;
  measure('patch node');
}
