var pools = require('../util/pools');
var push = Array.prototype.push;

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
function makeNode(node) {
  // If this node has already been converted, do not attempt to convert again.
  if (node && node.__node__) {
    return node.__node__;
  }

  var nodeType = node.nodeType;
  var nodeValue = node.nodeValue;

  if (!nodeType || nodeType === 2 || nodeType === 4 || nodeType === 8) {
    return false;
  }

  if (nodeType === 3 && !nodeValue.trim()) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = pools.object.get();

  entry.element = node;
  entry.nodeName = node.nodeName;
  entry.nodeValue = node.nodeValue;
  entry.nodeType = nodeType;
  entry.childNodes = pools.array.get();
  entry.attributes = pools.array.get();

  // Collect attributes.
  var attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    var attributesLength = attributes.length;

    if (attributesLength) {
      for (var i = 0; i < attributesLength; i++) {
        push.call(entry.attributes, attributes[i]);
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes;
  var childNodesLength = node.childNodes.length;
  var newNode = null;

  // If the element has child nodes, convert them all to virtual nodes.
  if (node.nodeType !== 3 && childNodes) {
    for (var i = 0; i < childNodesLength; i++) {
      newNode = makeNode(childNodes[i]);

      if (newNode) {
        entry.childNodes.push(newNode);
      }
    }
  }

  return entry;
}

module.exports = makeNode;
