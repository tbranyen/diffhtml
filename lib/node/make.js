import { NodeCache } from '../util/cache';
import * as svg from '../util/svg';
import { decodeEntities} from '../util/entities';

/**
 * Gets a specific type of DOM Node depending on the passed in nodeName.
 *
 * @param nodeName {String} - The nodeName to disambiguate the type
 * @param nodeValue {String} - The nodeValue to set if a Text Node
 * @return {Object} - A DOM Node matching the nodeName
 */
const createNodeFromName = vTree => {
  const { nodeName, childNodes, attributes, nodeValue } = vTree;

  // Shorthand the lookup method.
  const lookupNode = NodeCache.get;

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    return document.createTextNode(nodeValue);
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
    return document.createDocumentFragment();
  }
  // If the nodeName matches any of the known SVG element names, mark it as
  // SVG. The reason for doing this over detecting if nested in an <svg>
  // element, is that we do not currently have circular dependencies in the
  // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
  else if (svg.elements.indexOf(nodeName) > -1) {
    return document.createElementNS(svg.namespace, nodeName);
  }
  // Render the stateful component.
  else if (typeof nodeName === 'function') {
    // Props are an immutable object inspired by React. They always contain
    // a childNodes
    const props = Object.freeze(Object.assign({}, attributes, {
      children: childNodes.map(lookupNode),
    }));

    // Make the stateful component.
    const instance = new nodeName(props);

    // Initial render.
    const node = instance.render();

    // Return a single Node or multiple nodes depending on the return value.
    instance.getDOMNode = () => {
      return Array.isArray(node) ? node.map(lookupNode) : lookupNode(node);
    };

    return { domNode: createNodeFromName(node), vTree: node };
  }
  else if (typeof nodeName === 'object') {
    // Props are an immutable object inspired by React. They always contain
    // a childNodes
    const props = Object.freeze(Object.assign({}, attributes, {
      children: childNodes.map(lookupNode),
    }));

    // Initial render.
    const node = nodeName.render(props);

    // Return a single Node or multiple nodes depending on the return value.
    nodeName.getDOMNode = () => {
      return Array.isArray(node) ? node.map(lookupNode) : lookupNode(node);
    };

    return { domNode: createNodeFromName(node), vTree: node };
  }
  // If not a Text or SVG Node, then create with the standard method.
  else {
    return document.createElement(nodeName);
  }
};

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @return {Object} - A DOM Node matching the vTree
 */
export default function make(vTree) {
  // If no Virtual Tree Element was specified, return null.
  if (!vTree) {
    return null;
  }

  // If the DOM Node was already created, reuse the existing node.
  if (NodeCache.has(vTree)) {
    return NodeCache.get(vTree);
  }

  const node = createNodeFromName(vTree);

  if (node.vTree) {
    NodeCache.set(node.vTree, node.domNode);
    return node.domNode;
  }

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.
  for (let i = 0; i < (vTree.attributes || []).length; i++) {
    const attr = vTree.attributes[i];
    const isObject = typeof attr.value === 'object';
    const isFunction = typeof attr.value === 'function';

    // If not a dynamic type, set as an attribute, since it's a valid
    // attribute value.
    if (attr.name && !isObject && !isFunction) {
      node.setAttribute(attr.name, decodeEntities(attr.value));
    }
    else if (attr.name && typeof attr.value !== 'string') {
      // Necessary to track the attribute/prop existence.
      node.setAttribute(attr.name, '');

      // Since this is a dynamic value it gets set as a property.
      node[attr.name] = attr.value;
    }
  }

  // Append all the children into the node, making sure to run them
  // through this `make` function as well.
  for (let i = 0; i < (vTree.childNodes || []).length; i++) {
    node.appendChild(make(vTree.childNodes[i]));
  }

  // Add to the nodes cache.
  NodeCache.set(vTree, node);

  return node;
}
