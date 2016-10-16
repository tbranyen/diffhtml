import { pools } from '../util/pools';
import escape from '../util/escape';
import makeTree from '../tree/make';

/**
 * TODO Phase this out if possible, super slow iterations...
 *
 * @param childNodes
 * @return
 */
const normalizeChildNodes = (_childNodes) => {
  const newChildNodes = [];
  const childNodes = Array.isArray(_childNodes) ? _childNodes : [_childNodes];

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
    else {
      const node = childNode.ownerDocument ? makeTree(childNode) : childNode;
      newChildNodes.push(node);
    }
  });

  return newChildNodes;
};

/**
 * Creates a virtual element used in or as a virtual tree.
 *
 * @param nodeName
 * @param attributes
 * @param childNodes
 * @return {Object} element
 */
export function createElement(nodeName, attributes, ...childNodes) {
  attributes = attributes || [];

  if (nodeName === '') {
    return normalizeChildNodes(childNodes);
  }

  // A stateful component is a constructor that will be invoked with `new`.
  // Typically described as a `class`. Must export a `render` method on the
  // instance, this function should return a VTree representing the component.
  //
  // The class constructor is passed a `props` object containing the attributes
  // converted to a flat object. A special property `children` is also attached
  // to allow for nesting the passed children.
  if (typeof nodeName === 'function') {
    return {
      attributes: Object.assign({}, attributes),
      childNodes,
      nodeName,
    };
  }

  // A stateless component is a singleton object that is a singular state.
  // This object must contain a `render` function. This function should return
  // a VTree representing the component. It is passed a `props` object
  // containing the attributes converted to a flat object. A special property
  // `children` is also attached to allow for nesting the passed children.
  else if (typeof nodeName === 'object') {
    const props = Object.freeze(Object.assign({}, attributes, {
      children: childNodes,
    }));

    return nodeName.render(props);
  }

  const entry = pools.elementObject.get();
  const isTextNode = nodeName === 'text' || nodeName === '#text';

  entry.key = '';
  entry.nodeName = nodeName.toLowerCase();
  entry.rawNodeName = nodeName;

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
    const value = Array.isArray(childNodes) ? childNodes.join('') : childNodes;

    entry.nodeType = nodeName === '#document-fragment' ? 11 : 3;
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
