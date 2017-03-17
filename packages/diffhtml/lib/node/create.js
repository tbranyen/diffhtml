import { NodeCache, CreateNodeHookCache, elements, namespace } from '../util';

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @return {Object} - A DOM Node matching the vTree
 */
export default function createNode(vTree, doc = document) {
  if (!vTree) {
    throw new Error('Missing VTree when trying to create DOM Node');
  }

  const existingNode = NodeCache.get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  const { nodeName, childNodes = [] } = vTree;

  // Will vary based on the properties of the VTree.
  let domNode = null;

  CreateNodeHookCache.forEach(fn => {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    domNode = fn(vTree);
  });

  if (domNode) {
    return domNode;
  }

  // Create empty text elements. They will get filled in during the patch
  // process.
  if (nodeName === '#text') {
    domNode = doc.createTextNode(vTree.nodeValue);
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
    domNode = doc.createDocumentFragment();
  }
  // If the nodeName matches any of the known SVG element names, mark it as
  // SVG. The reason for doing this over detecting if nested in an <svg>
  // element, is that we do not currently have circular dependencies in the
  // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
  else if (elements.indexOf(nodeName) > -1) {
    domNode = doc.createElementNS(namespace, nodeName);
  }
  // If not a Text or SVG Node, then create with the standard method.
  else {
    domNode = doc.createElement(nodeName);
  }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], doc));
  }

  return domNode;
}
