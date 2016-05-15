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
  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

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
export function unprotectElement(element, makeNode) {
  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

  elementObject.unprotect(element);
  elementObject.cache.uuid.delete(element.uuid);

  element.attributes.forEach(attributeObject.unprotect, attributeObject);
  element.childNodes.forEach(node => unprotectElement(node, makeNode));

  if (makeNode && makeNode.nodes) {
    delete makeNode.nodes[element.uuid];
  }

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
export function cleanMemory(makeNode) {
  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

  // Clean out unused elements.
  if (makeNode && makeNode.nodes) {
    for (let uuid in makeNode.nodes) {
      if (!elementObject.cache.uuid.has(uuid)) {
        delete makeNode.nodes[uuid];
      }
    }
  }

  // Empty all element allocations.
  elementObject.cache.allocated.forEach(v => {
    elementObject.cache.free.push(v);
  });

  elementObject.cache.allocated.clear();

  // Empty all attribute allocations.
  attributeObject.cache.allocated.forEach(v => {
    attributeObject.cache.free.push(v);
  });

  attributeObject.cache.allocated.clear();
}
