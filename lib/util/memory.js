import { pools as _pools } from '../util/pools';
import _makeNode from '../node/make';

var pools = _pools;
var makeNode = _makeNode;

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
export function protectElement(element) {
  pools.elementObject.protect(element);

  element.attributes.forEach(pools.attributeObject.protect,
    pools.attributeObject);

  if (element.childNodes) {
    element.childNodes.forEach(protectElement);
  }

  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */
export function unprotectElement(element, makeNode) {
  pools.elementObject.unprotect(element);

  element.attributes.forEach(pools.attributeObject.unprotect,
    pools.attributeObject);

  if (element.childNodes) {
    element.childNodes.forEach(node => unprotectElement(node, makeNode));
  }

  if (makeNode && makeNode.nodes) {
    delete makeNode.nodes[element.uuid];
  }

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
export function cleanMemory(makeNode) {
  // Free all memory after each iteration.
  pools.attributeObject.freeAll();
  pools.elementObject.freeAll();

  // Clean out unused elements.
  if (makeNode && makeNode.nodes) {
    for (let uuid in makeNode.nodes) {
      if (!pools.elementObject.cache.uuid[uuid]) {
        delete makeNode.nodes[uuid];
      }
    }
  }
}
