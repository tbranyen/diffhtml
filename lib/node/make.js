import { pools } from '../util/pools';

const empty = {};

// Cache created nodes inside this object.
make.nodes = new Map();

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
export default function make(node) {
  let nodeType = node.nodeType;

  // Whitelist: Elements, TextNodes, and Shadow Root.
  if (nodeType !== 1 && nodeType !== 3 && nodeType !== 11) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  let entry = pools.elementObject.get();

  // Associate this newly allocated descriptor with this Node.
  make.nodes.set(entry, node);

  // Set a lowercased (normalized) version of the element's nodeName.
  entry.nodeName = node.nodeName.toLowerCase();

  // If the element is a text node set the nodeValue.
  entry.nodeValue = nodeType === 3 ? node.textContent : '';
  entry.nodeType = nodeType;
  entry.childNodes.length = 0;
  entry.attributes.length = 0;

  // Collect attributes.
  let attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes && attributes.length) {
    for (let i = 0; i < attributes.length; i++) {
      let attr = pools.attributeObject.get();

      attr.name = attributes[i].name;
      attr.value = attributes[i].value;

      if (attr.name === 'key') {
        entry.key = attr.value;
      }

      entry.attributes.push(attr);
    }
  }

  // Collect childNodes.
  let childNodes = node.childNodes ? node.childNodes : [];
  let childNodesLength = childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (childNodesLength) {
    for (let i = 0; i < childNodesLength; i++) {
      let newNode = make(childNodes[i]);

      if (newNode) {
        entry.childNodes.push(newNode);
      }
    }
  }

  // Prune out whitespace from between HTML tags in markup.
  if (entry.nodeName === 'html') {
    entry.childNodes = entry.childNodes.filter(function(el) {
      return el.nodeName === 'head' || el.nodeName === 'body';
    });
  }

  return entry;
}
