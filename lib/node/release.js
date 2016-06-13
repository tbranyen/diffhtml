import { StateCache } from '../util/cache';
import { cleanMemory, unprotectElement } from '../util/memory';

/**
 * Releases state and recycles internal memory.
 *
 * @param node {Object} - A DOM Node to lookup state from
 */
export default function releaseNode(node) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(node);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    unprotectElement(state.oldTree);
  }

  // Remove the Node's state object from the cache.
  StateCache.delete(node);

  // Recycle all unprotected objects.
  cleanMemory();
}
