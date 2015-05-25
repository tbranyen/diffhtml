var humanizeNodeType = {
  1: 'tag',
  2: 'attribute',
  3: 'text',
  4: 'cdata',
  8: 'comment'
};

var id = 0;
var nodePool = {};

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
function makeNode(node) {
  // If this node has already been converted, do not attempt to convert again.
  if (node && node.node) {
    return node.node;
  }

  // Get a humanized representation of the `nodeType`.
  var type = humanizeNodeType[node.nodeType];

  // If the element found is irrelevant for our uses, skip it.
  if (!type || type === 'attribute' || type === 'cdata' || type === 'comment') {
    return;
  }

  // Skip over empty text nodes.
  else if (type === 'text' && !node.nodeValue.trim()) {
    return;
  }

  // Store nodes in the pool.
  id = id + 1;
  nodePool[id] = node;

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = {
    type: type,
    element: id,
    nodeName: node.nodeName.toLowerCase(),
    nodeValue: node.nodeValue,
    attributes: [],
    dataset: [],
    style: [],
    childNodes: [],
  };

  // Collect attributes.
  var attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    var attributesLength = attributes.length;

    if (attributesLength) {
      // Copy all attribute values into the attributes object.
      for (var i = 0; i < attributesLength; i++) {
        entry.attributes.push({
          name: attributes[i].name,
          value: attributes[i].value,
        });
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes;

  // If the element has child nodes, convert them all to virtual nodes.
  if (type !== 'text' && childNodes) {
    entry.childNodes = Array.prototype.map.call(childNodes, makeNode)
      .filter(Boolean);
  }

  // Also attach to the actual element.
  node.node = entry;

  return entry;
}

makeNode.getNodeById = function(id) {
  return nodePool[id];
};

window.makeNode = module.exports = makeNode;
