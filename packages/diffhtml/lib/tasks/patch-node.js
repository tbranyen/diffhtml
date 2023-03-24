/**
 * @typedef {import('../transaction').default} Transaction
 * @typedef {import('../util/types').VTree} VTree
 */
import patch from '../node/patch';
import { CreateNodeHookCache } from '../util/types';
import globalThis from '../util/global';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Transaction} transaction
 * @return {void}
 */
export default function patchNode(transaction) {
  const { mount, state, patches } = transaction;
  const { measure, scriptsToExecute } = state;

  measure('patch node');

  const { ownerDocument } = /** @type {HTMLElement} */ (mount);

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
    patch(patches, state);
  }

  CreateNodeHookCache.delete(collectScripts);

  measure('patch node');
}
