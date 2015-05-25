var makeNode = require('./make_node');
var pools = require('../util/pools');
var slice = Array.prototype.slice;
var filter = Array.prototype.filter;

function filterNode(node) {
  var nodeType = node.nodeType;

  if (!nodeType || nodeType === 2 || nodeType === 4 || nodeType === 8) {
    return false;
  }

  return nodeType !== 3 || node.nodeValue.trim();
}

function syncNode(virtualNode, liveNode) {
  var patches = this;

  // For now always sync the children.  In the future we'll be smarter about
  // when this is necessary.
  var oldChildNodesLength = virtualNode.childNodes.length;
  var nodeValue = liveNode.nodeValue;

  // Filter down the childNodes to only what we care about.
  var childNodes = filter.call(liveNode.childNodes, filterNode);
  var newChildNodesLength = childNodes.length;

  // Replace text nodes if their values are different.
  if (liveNode.nodeType === 3 && virtualNode.nodeType === 3) {
    // Text changed.
    if (nodeValue !== virtualNode.nodeValue) {
      virtualNode.nodeValue = nodeValue;

      patches.push({
        __do__: 3,
        element: virtualNode.element,
        value: nodeValue
      });
    }

    return;
  }

  // Wipe out reference.
  nodeValue = null;

  if (newChildNodesLength) {
    // Most common additive elements.
    if (newChildNodesLength > oldChildNodesLength) {
      // Store elements in a DocumentFragment to increase performance and be
      // generally simplier to work with.
      var fragment = document.createDocumentFragment();

      for (var i = oldChildNodesLength; i < newChildNodesLength; i++) {
        // Move the element.
        document.adoptNode(childNodes[i]);

        // Internally add to the tree.
        virtualNode.childNodes.push(makeNode(childNodes[i]));

        // Add to the document fragment.
        fragment.appendChild(childNodes[i]);
      }

      // Assign the fragment to the patches to be injected.
      patches.push({
        __do__: 1,
        element: virtualNode.element,
        fragment: fragment
      });
    }

    // Remove these elements.
    if (oldChildNodesLength > newChildNodesLength) {
      // Elements to remove.
      var toRemove = slice.call(virtualNode.childNodes, -1 * (oldChildNodesLength - newChildNodesLength));

      for (var i = 0; i < toRemove.length; i++) {
        // Remove the element, this happens before the splice so that we still
        // have access to the element.
        patches.push({ __do__: 1, old: toRemove[i].element });

        // Return object to free pool.
        pools.array.free(toRemove[i].attributes);
        pools.array.free(toRemove[i].childNodes);
        pools.object.free(toRemove[i]);
      }

      virtualNode.childNodes.splice(newChildNodesLength, oldChildNodesLength - newChildNodesLength);
    }

    // Replace elements if they are different.
    for (var i = 0; i < newChildNodesLength; i++) {
      if (virtualNode.childNodes[i].nodeName !== childNodes[i].nodeName) {
        // Add to the patches.
        patches.push({
          __do__: 1,
          old: virtualNode.childNodes[i].element,
          new: childNodes[i]
        });

        // Return object to pool.
        pools.array.free(virtualNode.childNodes[i].attributes);
        pools.array.free(virtualNode.childNodes[i].childNodes);
        pools.object.free(virtualNode.childNodes[i]);

        // Replace the internal tree's point of view of this element.
        virtualNode.childNodes[i] = makeNode(childNodes[i]);
      }
    }
  }
  // Remove all children if the new live node has none.
  else if (oldChildNodesLength && !newChildNodesLength) {
    patches.push({ __do__: -1, element: virtualNode.element });
    virtualNode.childNodes.splice(0, oldChildNodesLength);
  }

  // Synchronize attributes
  var attributes = liveNode.attributes;

  if (attributes) {
    var oldLength = virtualNode.attributes.length;
    var newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      var toAdd = slice.call(attributes, oldLength - 1);

      for (var i = 0; i < toAdd.length; i++) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toAdd[i].name,
          value: toAdd[i].value,
        };

        // Push the change object directly into the virtual tree, the `__do__`
        // property won't be inspected by anything so we save on total # of
        // objects created.
        var index = virtualNode.attributes.push(change);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      var toRemove = slice.call(virtualNode.attributes, newLength);

      for (var i = 0; i < toRemove.length; i++) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toRemove[i].name,
          value: undefined,
        };

        // Remove the attribute from the virtual node.
        virtualNode.attributes.splice(i, 1);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for modifications.
    var toModify = slice.call(attributes);

    for (var i = 0; i < toModify.length; i++) {
      var change = {
        __do__: 2,
        element: virtualNode.element,
        name: toModify[i].name,
        value: toModify[i].value,
      };

      // Only push in a change if the attribute or value changes.
      if (virtualNode.attributes[i].value !== attributes[i].value) {
        // Replace the attribute in the virtual node.
        virtualNode.attributes.splice(i, 1, change);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }
  }

  // Sync each current node.
  for (var i = 0; i < virtualNode.childNodes.length; i++) {
    syncNode.call(patches, virtualNode.childNodes[i], childNodes[i]);
  }
}

module.exports = syncNode;
