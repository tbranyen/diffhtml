/**
 * @typedef {import('../util/types').VTreeLike} VTreeLike
 * @typedef {import('../util/types').VTree} VTree
 * @typedef {import('../util/types').ValidNode} ValidNode
 */
import internalProcess from '../util/process';
import globalThis from '../util/global';
import { NodeCache, CreateNodeHookCache, EMPTY } from '../util/types';
import createTree from '../tree/create';

const namespace = 'http://www.w3.org/2000/svg';

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {VTreeLike} vTreeLike - A Virtual Tree Element or VTree-like element
 * @param {Document=} ownerDocument - Document to create Nodes in, defaults to document
 * @param {Boolean=} isSVG - Indicates if the root element is SVG
 * @return {ValidNode | null} A DOM Node matching the vTree
 */
export default function createNode(vTreeLike, ownerDocument = globalThis.document, isSVG) {
  if (internalProcess.env.NODE_ENV !== 'production') {
    if (!vTreeLike) {
      throw new Error('Missing VTree when trying to create DOM Node');
    }
  }

  const vTree = createTree(vTreeLike);
  const existingNode = NodeCache.get(vTree);

  // If the DOM Node was already created, reuse the existing node. This is
  // required to ensure that passed in DOM Nodes are preserved, and to ensure
  // that elements are not constantly created with the same VTree instance.
  if (existingNode) {
    return existingNode;
  }

  const {
    nodeName,
    rawNodeName = nodeName,
    childNodes = /** @type {VTree[]} */ ([]),
  } = vTree;

  isSVG = isSVG || nodeName === 'svg';

  /** @type {ValidNode | null} */
  let domNodeCheck = null;

  /** @type {ValidNode | null | void} */
  let retVal = null;

  CreateNodeHookCache.forEach((fn) => {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    if (retVal = fn(vTree)) {
      domNodeCheck = retVal;
    }
  });

  // It is not possible to continue if this object is falsy. By returning null,
  // patching can gracefully no-op.
  if (!ownerDocument) {
    return domNodeCheck;
  }

  /**
   * If no DOM Node was provided by CreateNode hooks, we must create it
   * ourselves.
   *
   * @type {ValidNode | null}
   */
  let domNode = domNodeCheck;

  // Create empty text elements. They will get filled in during the patch
  // process.
  if (!domNode) {
    if (nodeName === '#comment') {
      domNode = ownerDocument.createComment(vTree.nodeValue || EMPTY.STR);
    }
    else if (nodeName === '#text') {
      domNode = ownerDocument.createTextNode(vTree.nodeValue || EMPTY.STR);
    }
    // Support dynamically creating document fragments.
    else if (nodeName === '#document-fragment') {
      domNode = ownerDocument.createDocumentFragment();
    }
    // Support SVG.
    else if (isSVG) {
      domNode = ownerDocument.createElementNS(namespace, rawNodeName);
    }
    // If not a Text or SVG Node, then create with the standard method.
    else {
      domNode = ownerDocument.createElement(rawNodeName);
    }

    // Do not execute scripts by default.
    if (nodeName === 'script') {
      // Set the type to 'no-execute'. This will be toggled after patching,
      // unless disabled by the consumer.
      /** @type {any} */(domNode).type = 'no-execute';
    }
  }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    const validChildNode = createNode(childNodes[i], ownerDocument, isSVG);

    if (domNode && validChildNode) {
      domNode.appendChild(validChildNode);
    }
  }

  return domNode;
}
