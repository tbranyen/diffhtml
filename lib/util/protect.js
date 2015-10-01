import { pools as _pools } from '../util/pools';

let pools = _pools;

export function protectElement(element) {
  pools.elementObject.protect(element);

  element.childNodes.forEach(protectElement);
  element.attributes.forEach(pools.attributeObject.protect,
    pools.attributeObject);
}

export function unprotectElement(element) {
  pools.elementObject.unprotect(element);

  element.childNodes.forEach(unprotectElement);
  element.attributes.forEach(pools.attributeObject.unprotect,
    pools.attributeObject);
}
