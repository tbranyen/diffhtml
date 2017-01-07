import Pool from './pool';
import { NodeCache } from './caches';

const { memory, protect, unprotect } = Pool;

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
export function protectElement(element) {
  protect(element);
  element.childNodes.forEach(protectElement);
  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */
export function unprotectElement(element) {
  unprotect(element);
  element.childNodes.forEach(unprotectElement);
  NodeCache.delete(element);
  return element;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
export function cleanMemory() {
  memory.allocated.forEach(vTree => memory.free.add(vTree));
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove it from the cache.
  NodeCache.forEach((node, descriptor) => {
    if (!memory.protected.has(descriptor)) {
      NodeCache.delete(descriptor);
    }
  });
}
