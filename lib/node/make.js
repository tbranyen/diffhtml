import {
  NodeCache,
  decodeEntities,
  elements,
  namespace,
} from '../util';

const { keys } = Object;

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @return {Object} - A DOM Node matching the vTree
 */
export function makeNode(vTree) {
  if (!vTree) {
    throw new Error('Missing VTree when trying to create DOM Node');
  }

  // If the DOM Node was already created, reuse the existing node.
  if (NodeCache.has(vTree)) {
    return NodeCache.get(vTree);
  }

  const { nodeName, childNodes, attributes, nodeValue } = vTree;

  // Will vary based on the properties of the VTree.
  let domNode = null;

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    domNode = document.createTextNode(decodeEntities(nodeValue));
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
    domNode = document.createDocumentFragment();
  }
  // If the nodeName matches any of the known SVG element names, mark it as
  // SVG. The reason for doing this over detecting if nested in an <svg>
  // element, is that we do not currently have circular dependencies in the
  // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
  else if (elements.indexOf(nodeName) > -1) {
    domNode = document.createElementNS(namespace, nodeName);
  }
  // If not a Text or SVG Node, then create with the standard method.
  else {
    domNode = document.createElement(nodeName);
  }

  // Get an array of all the attribute names.
  const attributeNames = keys(attributes);

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.
  for (let i = 0; i < attributeNames.length; i++) {
    const name = attributeNames[i];
    const value = attributes[name];
    const isString = typeof value === 'string';
    const isBoolean = typeof value === 'boolean';
    const isNumber = typeof value === 'number';

    // If not a dynamic type, set as an attribute, since it's a valid
    // attribute value.
    if (name && (isString || isBoolean || isNumber)) {
      domNode.setAttribute(name, decodeEntities(value));
    }
    else if (name) {
      // Necessary to track the attribute/prop existence.
      domNode.setAttribute(name, '');

      // Since this is a dynamic value it gets set as a property.
      domNode[name] = value;
    }
  }

  // Append all the children into the domNode, making sure to run them
  // through this `make` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(makeNode(childNodes[i]));
  }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  return domNode;
}
