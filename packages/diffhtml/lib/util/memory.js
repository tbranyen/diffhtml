import Pool from './pool';
import { NodeCache, StateCache, MiddlewareCache } from './caches';

const { ReleaseHookCache } = MiddlewareCache;
const { memory, protect, unprotect } = Pool;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */
export function protectVTree(vTree) {
  protect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
export function unprotectVTree(vTree) {
  unprotect(vTree);

  if (ReleaseHookCache.size) {
    ReleaseHookCache.forEach(fn => fn(vTree));
  }

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
export function cleanMemory(isBusy = false) {
  StateCache.forEach(state => (isBusy = state.isRendering || isBusy));

  memory.allocated.forEach(vTree => memory.free.add(vTree));
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  NodeCache.forEach((node, vTree) => {
    if (!memory.protected.has(vTree)) {
      NodeCache.delete(vTree);

      if (ReleaseHookCache.size) {
        ReleaseHookCache.forEach(fn => fn(vTree));
      }
    }
  });
}
