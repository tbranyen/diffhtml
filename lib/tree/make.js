import { createElement, createAttribute } from './helpers';
import { pools } from '../util/pools';
import { NodeCache } from '../util/cache';

/**
 * Converts a DOM Node into a Virtual Tree Element.
 *
 * @param {Object} node - A DOM Node
 * @return {Object} - A Virtual Tree Element
 */
export default function makeNode(node) {
  // These are the only DOM Node properties we care about.
  const nodeName = node.nodeName;
  const nodeType = node.nodeType;
  const nodeValue = node.nodeValue;
  const attributes = node.attributes || [];
  const childNodes = node.childNodes || [];

  // We ignore any DOM Node that isn't an: Element, Text, Document Fragment, or
  // Shadow Root.
  if (nodeType !== 1 && nodeType !== 3 && nodeType !== 11) {
    return false;
  }

  // We can consider either of these DOM Nodes as Text Nodes.
  const isTextNode = nodeName === '#text' || nodeName === 'text';

  // In the case of Text Node's we can have the createElement function set
  // the nodeValue for us.
  const initialValue = isTextNode ? nodeValue : [];

  // Creates a Virtual Tree Element based off this nodeName. We aren't going
  // to set the attributes right away since we want to set the key on the vTree
  // and push directly into the pre-existing array.
  const vTree = createElement(node.nodeName, [], initialValue);

  // Creates Virtual Tree Attributes for each attribute in the DOM Node.
  for (let i = 0; i < attributes.length; i++) {
    const attr = createAttribute(attributes[i].name, attributes[i].value);

    // If the `key` attribute is found, set the respective value on the vTree.
    if (attr.name === 'key') {
      vTree.key = attr.value;
    }

    vTree.attributes.push(attr);
  }

  // Associate this newly allocated vTree with this DOM Node.
  NodeCache.set(vTree, node);

  // If the element has child nodes, convert them all to virtual nodes.
  for (let i = 0; i < childNodes.length; i++) {
    const newNode = makeNode(childNodes[i]);

    // We may get a falsy value back if we pass in a Comment Node or other
    // DOM Nodes that we intentionally ignore.
    if (newNode) {
      vTree.childNodes.push(newNode);
    }
  }

  // Prune out whitespace/everything from between tags nested under the HTML
  // tag, since this behavior can be observed in browsers and specification.
  if (vTree.nodeName === 'html') {
    vTree.childNodes = vTree.childNodes.filter(childNode => {
      return childNode.nodeName === 'head' || childNode.nodeName === 'body';
    });
  }

  return vTree;
}
