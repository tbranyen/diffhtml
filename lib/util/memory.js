import * as pools from '../util/pools';
import { NodeCache } from './cache';

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
export function protectElement(element) {
  if (!element) {
    return;
  }
  else if (Array.isArray(element)) {
    return element.forEach(protectElement);
  }

  const elementObject = pools.elementObject;
  const attributeObject = pools.attributeObject;

  elementObject.protect(element);

  element.attributes.forEach(attributeObject.protect, attributeObject);
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
  if (!element) {
    return;
  }
  else if (Array.isArray(element)) {
    return element.forEach(unprotectElement);
  }

  const elementObject = pools.elementObject;
  const attributeObject = pools.attributeObject;

  elementObject.unprotect(element);

  element.attributes.forEach(attributeObject.unprotect, attributeObject);
  element.childNodes.forEach(unprotectElement);

  NodeCache.delete(element);

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
export function cleanMemory() {
  const elementCache = pools.elementObject.cache;
  const attributeCache = pools.attributeObject.cache;

  // Empty all element allocations.
  elementCache.allocated.forEach(v => {
    if (elementCache.free.length < pools.count) {
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
    if (attributeCache.free.length < pools.count) {
      attributeCache.free.push(v);
    }
  });

  attributeCache.allocated.clear();
}
