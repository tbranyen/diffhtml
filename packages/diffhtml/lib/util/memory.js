import Pool from './pool';
import { EMPTY, NodeCache } from './types';

const { protect, unprotect, memory } = Pool;

/**
 * Ensures that vTree is not recycled during a render cycle. This effectively
 * allocates a VTree to a DOM node representation for as long as it's needed.
 *
 * @param {import('./types').VTree} vTree
 * @return {void}
 */
export function protectVTree(vTree) {
  protect(vTree);

  if (vTree.childNodes.length) {
    for (let i = 0; i < vTree.childNodes.length; i++) {
      protectVTree(vTree.childNodes[i]);
    }
  }
}

/**
 * Recycles a VTree by unprotecting itself, removing its DOM Node reference,
 * and recursively unprotecting all nested children. Resets the VTree
 * attributes and childNode properties as these can contribute to unwanted
 * increases in the heap.
 *
 * @param {import('./types').VTree} vTree
 * @return {void}
 */
export function unprotectVTree(vTree) {
  if (vTree.childNodes.length) {
    for (let i = 0; i < vTree.childNodes.length; i++) {
      unprotectVTree(vTree.childNodes[i]);
    }
  }

  NodeCache.delete(vTree);
  unprotect(vTree);
}

/**
 * Collects any unused VTrees and puts them back into circulation. Scrubs all
 * attributes and childNodes from the object to minimize memory impact. This
 * function is scheduled after each render with either setTimeout or
 * requestIdleCallback.
 *
 * This is also called automatically during tests to ensure all objects are
 * tracked correctly.
 *
 * @return {void}
 */
export function gc() {
  memory.allocated.forEach(vTree => {
    // Scrub a VTree of attributes and childNodes to avoid ever increasing RAM.
    vTree.attributes = {};
    vTree.childNodes.length = 0;
    vTree.key = EMPTY.STR;

    // Make the VTree available for future renders.
    memory.free.add(vTree);
    memory.allocated.delete(vTree);
    NodeCache.delete(vTree);
  });
}
