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

  if (element.childNodes) {
    element.childNodes.forEach(protectElement);
  }

  element.attributes.forEach(pools.attributeObject.protect,
    pools.attributeObject);

  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */
export function unprotectElement(element, makeNode) {
  if (element.childNodes) {
    element.childNodes.forEach(function(element) {
      unprotectElement(element, makeNode);
    });
  }

  element.attributes.forEach(pools.attributeObject.unprotect,
    pools.attributeObject);

  pools.elementObject.unprotect(element);

  if (makeNode && makeNode.nodes) {
    delete makeNode.nodes[element.uuid];
  }

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
export function cleanMemory() {
  // Free all memory after each iteration.
  pools.attributeObject.freeAll();
  pools.elementObject.freeAll();
}
