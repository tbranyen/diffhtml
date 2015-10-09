import { pools as _pools } from '../util/pools';
import _makeNode from '../node/make';

var pools = _pools;
var makeNode = _makeNode;

export function protectElement(element) {
  pools.elementObject.protect(element);

  element.childNodes.forEach(protectElement);
  element.attributes.forEach(pools.attributeObject.protect,
    pools.attributeObject);
}

export function unprotectElement(element) {
  element.childNodes.forEach(unprotectElement);
  element.attributes.forEach(pools.attributeObject.unprotect,
    pools.attributeObject);

  pools.elementObject.unprotect(element);
}

export function cleanMemory() {
  // Free all memory after each iteration.
  pools.attributeObject.freeAll();
  pools.elementObject.freeAll();

  // Empty out the `make.nodes` if on main thread.
  if (typeof makeNode !== 'undefined') {
    for (let uuid in makeNode.nodes) {
      // If this is not a protected uuid, remove it.
      if (!pools.elementObject._uuid[uuid]) {
        makeNode.nodes[uuid] = undefined;
      }
    }
  }
}
