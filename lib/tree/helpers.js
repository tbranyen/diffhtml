import { PoolCache } from '../util/caches';
import escape from '../util/escape';
import { makeTree } from '../tree';

const { isArray } = Array;
const { assign } = Object;

const empty = [];

/**
 * TODO Phase this out if possible, super slow iterations...
 *
 * @param childNodes
 * @return
 */
const normalizeChildNodes = (_childNodes) => {
  const newChildNodes = [];
  const childNodes = isArray(_childNodes) ? _childNodes : [_childNodes];

  childNodes.forEach(childNode => {
    if (typeof childNode !== 'object') {
      newChildNodes.push(createElement('#text', null, String(childNode)));
    }
    else if ('length' in childNode) {
      for (let i = 0; i < childNode.length; i++) {
        const newChild = childNode[i];
        const newNode = newChild.ownerDocument ? makeTree(newChild) : newChild;

        newChildNodes.push(newNode);
      }
    }
    // Ignore undefined/falsy values.
    else if (childNode) {
      const node = childNode.ownerDocument ? makeTree(childNode) : childNode;
      newChildNodes.push(node);
    }
  });

  return newChildNodes;
};

export function createElement(nodeName, attributes, childNodes) {
  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (Array.isArray(nodeName)) {
    return createElement('#document-fragment', nodeName.map(createElement));
  }

  if (typeof nodeName === 'function') {
    return assign(PoolCache.get('element').get(), {
      key: '',
      nodeType: 1,
      nodeValue: '',
      rawNodeName: nodeName,
      nodeName,
      attributes: attributes || empty,
    });
  }
  else if (typeof nodeName === 'object') {
    const props = attributes;
    props.children = childNodes;

    const instance = nodeName.render(props);
    instance.rawNodeName = instance;

    return instance;
  }

  const entry = PoolCache.get('element').get();
  const isTextNode = nodeName === 'text' || nodeName === '#text';

  entry.key = '';
  entry.nodeName = nodeName.toLowerCase();
  entry.rawNodeName = nodeName;

  if (!isTextNode) {
    const getChildNodes = (attributes, childNodes) => {
      const nodes = arguments.length === 2 ? attributes : childNodes;
      return nodes ? normalizeChildNodes(nodes) : empty;
    };

    entry.nodeType = nodeName === '#document-fragment' ? 11 : 1;
    entry.nodeValue = '';
    entry.attributes = arguments.length === 2 ? empty : attributes || empty;
    entry.childNodes = getChildNodes(attributes, childNodes);

    // Set the key prop if passed as an attr.
    entry.attributes.some(attr => {
      if (attr.name === 'key') {
        entry.key = attr.value;
        return true;
      }
    });
  }
  else {
    const getValue = (attributes, childNodes) => {
      const nodes = arguments.length === 2 ? attributes : childNodes;
      return isArray(nodes) ? nodes.join('') : nodes;
    };

    const value = getValue(attributes, childNodes);

    entry.nodeType = 3;
    entry.nodeValue = escape(String(value || ''));
    entry.attributes.length = 0;
    entry.childNodes.length = 0;
  }

  return entry;
}

export const createAttribute = (name, value) => {
  return assign(PoolCache.get('attribute').get(), { name, value });
};
