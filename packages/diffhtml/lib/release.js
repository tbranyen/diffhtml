import { StateCache, NodeCache } from './util/caches';
import { unprotectVTree } from './util/memory';
import createTree from './tree/create';
import { ValidInput } from './util/types';

/**
 *
 * @param {ValidInput} domNode
 * @return {ValidInput}
 */
export default function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(domNode);

  // If this was a top-level rendered element, deallocate the VTree
  // and remove the StateCache reference.
  if (state) {
    unprotectVTree(createTree(state.oldTree));
    StateCache.delete(domNode);
  }
  else {
    // If there is a Virtual Tree element, recycle all objects allocated for it.
    NodeCache.forEach((value, key) => {
      if (value === domNode) {
        unprotectVTree(key);
      }
    });
  }

  return domNode;
}