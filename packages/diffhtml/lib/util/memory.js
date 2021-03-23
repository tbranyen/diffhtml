import Pool from './pool';
import { NodeCache, VTree } from './types';

const { protect, unprotect, memory } = Pool;

/**
 * Ensures that vTree is not recycled during a render cycle.
 *
 * @param {VTree} vTree
 * @return {void}
 */
export function protectVTree(vTree) {
  protect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }
}

/**
 * Recycles a VTree by unprotecting itself, removing its DOM Node reference, and
 * recursively unprotecting all nested children. Resets the VTree's attributes
 * and childNode properties afterwards, as these can contribute to unwanted
 * increases in the heap.
 *
 * @param {VTree} vTree
 * @return {void}
 */
export function unprotectVTree(vTree) {
  unprotect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  //vTree.attributes = {};
  //vTree.childNodes.length = 0;

  NodeCache.delete(vTree);
}

/**
 * Collects any unused VTree's and puts them back into the free Set. This is
 * primarily used by tests, but could also be useful for specific niche cases
 * as a way to ease memory/CPU pressure when lots of temporary trees are
 * created but never used.
 *
 * @return {void}
 */
export function gc() {
  memory.allocated.forEach(vTree => {
    memory.free.add(vTree);
    memory.allocated.delete(vTree);
    NodeCache.delete(vTree);
  });
}