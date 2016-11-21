import { size } from '../util/pools';
import { NodeCache, PoolCache } from './caches';

const elementPool = PoolCache.get('element');
const attributePool = PoolCache.get('attribute');

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
export function protectElement(element) {
  if (Array.isArray(element)) {
    return element.forEach(protectElement);
  }

  elementPool.protect(element);

  element.attributes.forEach(attributePool.protect, attributePool);
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
  if (Array.isArray(element)) {
    return element.forEach(unprotectElement);
  }

  elementPool.unprotect(element);

  element.attributes.forEach(attributePool.unprotect, attributePool);

  function findLeaks(e) {
    e.childNodes.forEach(el => {
      let b = e;
      if (el === element) { debugger; } else { findLeaks(el); }
    });
  }
  findLeaks(element);

  element.childNodes.forEach(unprotectElement);

  NodeCache.delete(element);

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
export function cleanMemory() {
  const { cache: elementCache } = elementPool;
  const { cache: attributeCache } = attributePool;

  // Empty all element allocations.
  elementCache.allocated.forEach(v => {
    if (elementCache.free.length < size) {
      elementCache.free.push(v);
    }
  });

  elementCache.allocated.clear();

  // Clean out unused elements.
  NodeCache.forEach((node, descriptor) => {
    if (!elementCache.protected.has(descriptor)) {
      NodeCache.delete(descriptor);
    }
  });

  // Empty all attribute allocations.
  attributeCache.allocated.forEach(v => {
    if (attributeCache.free.length < size) {
      attributeCache.free.push(v);
    }
  });

  attributeCache.allocated.clear();
}
