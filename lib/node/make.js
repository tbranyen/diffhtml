import { pools as _pools } from '../util/pools';
import {
  protectElement as _protectElement,
  unprotectElement as _unprotectElement
} from '../util/protect';

let pools = _pools;
let protectElement = _protectElement;
let unprotectElement = _unprotectElement;

// Cache created nodes inside this object.
make.nodes = {};

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
export default function make(node, protect) {
  let nodeType = node.nodeType;
  let nodeValue = node.nodeValue;

  if (!nodeType || nodeType === 2 || nodeType === 4 || nodeType === 8) {
    return false;
  }

  if (nodeType === 3 && !nodeValue.trim()) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  let entry = pools.elementObject.get();

  if (protect) {
    protectElement(entry);
  }

  // Add to internal lookup.
  make.nodes[entry.element] = node;

  entry.nodeName = node.nodeName.toLowerCase();
  entry.nodeValue = nodeValue;
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

        if (protect) {
          pools.attributeObject.protect(attr);
        }

        attr.name = attributes[i].name;
        attr.value = attributes[i].value;

        entry.attributes[entry.attributes.length] = attr;
      }
    }
  }

  // Collect childNodes.
  let childNodes = node.childNodes;
  let childNodesLength = node.childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (node.nodeType !== 3 && childNodes) {
    for (let i = 0; i < childNodesLength; i++) {
      let newNode = make(childNodes[i], protect);

      if (newNode) {
        protectElement(newNode);
        entry.childNodes[entry.childNodes.length] = newNode;
      }
    }
  }

  return entry;
}
