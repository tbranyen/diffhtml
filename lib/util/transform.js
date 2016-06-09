import { pools } from './pools';
import escape from './escape';
import makeNode from '../node/make';

/**
 * TODO Phase this out if possible, super slow iterations...
 *
 * @param childNodes
 * @return
 */
function normalizeChildNodes(childNodes) {
  let newChildNodes = [];

  [].concat(childNodes).forEach(childNode => {
    if (typeof childNode !== 'object') {
      newChildNodes.push(createElement('#text', null, String(childNode)));
    }
    else if ('length' in childNode) {
      for (let i = 0; i < childNode.length; i++) {
        let newChild = childNode[i];
        let newNode = newChild.ownerDocument ? makeNode(newChild) : newChild;

        newChildNodes.push(newNode);
      }
    }
    else {
      let node = childNode.ownerDocument ? makeNode(childNode) : childNode;
      newChildNodes.push(node);
    }
  });

  return newChildNodes;
}

/**
 * Creates a virtual element used in or as a virtual tree.
 *
 * @param nodeName
 * @param attributes
 * @param childNodes
 * @return {Object} element
 */
export function createElement(nodeName, attributes, childNodes) {
  if (nodeName === '') {
    return normalizeChildNodes(childNodes);
  }

  const entry = pools.elementObject.get();
  const isTextNode = nodeName === 'text' || nodeName === '#text';

  entry.key = '';
  entry.nodeName = nodeName;

  if (!isTextNode) {
    entry.nodeType = 1;
    entry.nodeValue = '';
    entry.attributes = attributes || [];
    entry.childNodes = normalizeChildNodes(childNodes);

    // Set the key prop if passed as an attr.
    entry.attributes.some(attr => {
      if (attr.name === 'key') {
        entry.key = attr.value;
        return true;
      }
    });
  }
  else {
    let value = Array.isArray(childNodes) ? childNodes.join('') : childNodes;

    entry.nodeType = 3;
    entry.nodeValue = escape(String(value));
    entry.attributes.length = 0;
    entry.childNodes.length = 0;
  }

  return entry;
}

/**
 * Creates a virtual attribute used in a virtual element.
 *
 * @param name
 * @param value
 * @return {Object} attribute
 */
export function createAttribute(name, value) {
  const entry = pools.attributeObject.get();

  entry.name = name;
  entry.value = value;

  return entry;
}
