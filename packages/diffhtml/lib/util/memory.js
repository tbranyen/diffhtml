import Pool from './pool';
import { NodeCache, ReleaseHookCache } from './caches';
import { VTree } from './types';

const { protect, unprotect, memory } = Pool;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param {VTree} vTree
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
 * Recyles a VTree by deallocating, removing its DOM Node reference, and
 * recursively applying to all nested children.
 *
 * @param {VTree} vTree
 * @return
 */
export function unprotectVTree(vTree) {
  unprotect(vTree);

  ReleaseHookCache.forEach(fn => fn(vTree));

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  NodeCache.delete(vTree);

  return vTree;
}

/**
 * Collects any unused VTree's and puts them back into the free Set. This is
 * primarily used by tests, but could also be useful for specific niche cases
 * as a way to ease memory/CPU pressure when lots of temporary trees are
 * created but never used.
 */
export function gc() {
  // Ensure all detached VTree's are properly cleaned up.
  memory.allocated.forEach(vTree => {
    memory.free.add(vTree);
    memory.allocated.delete(vTree);
    NodeCache.delete(vTree);
  });
}