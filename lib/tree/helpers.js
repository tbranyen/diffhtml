import * as pools from '../util/pools';
import escape from '../util/escape';
import makeTree from '../tree/make';

/**
 * Normalizes items that are not Virtual Tree Elements.
 *
 * @api private
 * @return {Array} of childNodes
 */
const normalize = childNodes => {
  return childNodes.reduce((newChildNodes, childNode) => {
    // Is a text Node.
    if (typeof childNode !== 'object') {
      newChildNodes.push(createElement('#text', null, String(childNode)));
    }
    // Is a NodeList or HTMLCollection or array-like.
    else if ('length' in childNode) {
      for (let i = 0; i < childNode.length; i++) {
        newChildNodes.push(
          childNode[i].ownerDocument ? makeTree(childNode[i]) : childNode[i]
        );
      }
    }
    // Is a Virtual Tree Element.
    else {
      newChildNodes.push(childNode);
    }

    return newChildNodes;
  }, []);
};

/**
 * Creates a virtual element used in or as a virtual tree.
 *
 * @api public
 * @param nodeName
 * @param attributes
 * @param childNodes
 * @return {Object} element
 */
export function createElement(nodeName, attributes, ...childNodes) {
  if (nodeName === '') {
    return normalize(childNodes);
  }

  if (typeof nodeName === 'function') {
    const props = attributes || {};
    props.children = childNodes;
    return new nodeName(props).render(props);
  }
  else if (typeof nodeName === 'object') {
    const props = attributes || {};
    props.children = childNodes;
    return nodeName.render(props);
  }

  // Convert an attributes Object into an Array.
  if (attributes && !Array.isArray(attributes)) {
    attributes = Object.keys(attributes).map(name => {
      return createAttribute(name, attributes[name]);
    });
  }

  const entry = pools.elementObject.get();
  const isTextNode = nodeName === 'text' || nodeName === '#text';

  entry.key = '';
  entry.nodeName = nodeName.toLowerCase();
  entry.rawNodeName = nodeName;

  if (isTextNode) {
    entry.nodeType = 3;
    entry.nodeValue = escape(String(childNodes.join('')));
    entry.attributes.length = 0;
    entry.childNodes.length = 0;
  }
  else {
    entry.nodeType = nodeName === '#document-fragment' ? 11 : 1;
    entry.nodeValue = '';
    entry.attributes = attributes || [];
    entry.childNodes = normalize(childNodes);

    // Set the key prop if passed as an attr.
    entry.attributes.some(attr => {
      if (attr.name === 'key') {
        entry.key = attr.value;
        return true;
      }
    });
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
