import { pools as _pools } from '../util/pools';
import { components, upgrade } from '../element/custom';

var pools = _pools;
var empty = {};

// Cache created nodes inside this object.
make.nodes = {};

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

  // Associate this newly allocated uuid with this Node.
  make.nodes[entry.uuid] = node;

  // Set a lowercased (normalized) version of the element's nodeName.
  entry.nodeName = node.nodeName.toLowerCase();

  // If the element is a text node set the nodeValue.
  if (nodeType === 3) {
    entry.nodeValue = node.textContent;
    entry.nodeType = 3;
  }
  else {
    entry.nodeValue = '';
    entry.nodeType = 1;
  }

  entry.childNodes.length = 0;
  entry.attributes.length = 0;

  // Collect attributes.
  let attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    let attributesLength = attributes.length;

    if (attributesLength) {
      for (let i = 0; i < attributesLength; i++) {
        let attr = pools.attributeObject.get();

        attr.name = attributes[i].name;
        attr.value = attributes[i].value;

        entry.attributes[entry.attributes.length] = attr;
      }
    }
  }

  // Collect childNodes.
  let childNodes = node.childNodes ? node.childNodes : [];
  let childNodesLength = childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (nodeType !== 3 && childNodesLength) {
    for (let i = 0; i < childNodesLength; i++) {
      let newNode = make(childNodes[i]);

      if (newNode) {
        entry.childNodes[entry.childNodes.length] = newNode;
      }
    }
  }

  // Prune out whitespace from between HTML tags in markup.
  if (entry.nodeName === 'html') {
    entry.childNodes = entry.childNodes.filter(function(el) {
      return el.nodeName === 'head' || el.nodeName === 'body';
    });
  }

  // Reset the prototype chain for this element. Upgrade will return `true`
  // if the element was upgraded for the first time. This is useful so we
  // don't end up in a loop when working with the same element.
  upgrade(entry.nodeName, node, entry, true);

  return entry;
}
