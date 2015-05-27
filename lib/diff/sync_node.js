var pools = require('../util/pools');
var slice = Array.prototype.slice;
var filter = Array.prototype.filter;

/**
 * filterNode
 *
 * @param node
 * @return
 */
function filterNode(node) {
  if (!node) { return false; }

  var nodeType = node.nodeType;

  if (node.nodeName === '#documentType') { return false; }

  if (!nodeType || nodeType === 2 || nodeType === 4 || nodeType === 8) {
    return false;
  }

  return nodeType !== 3 || node.nodeValue.trim();
}

/**
 * syncNode
 *
 * @param virtualNode
 * @param liveNode
 * @return
 */
function syncNode(virtualNode, liveNode) {
  var patches = this;

  // For now always sync the children.  In the future we'll be smarter about
  // when this is necessary.
  var oldChildNodesLength = virtualNode.childNodes.length;
  var nodeValue = liveNode.nodeValue;

  // Filter down the childNodes to only what we care about.
  var childNodes = filter.call(liveNode.childNodes, filterNode);
  var newChildNodesLength = childNodes.length;

  // Replace text node values if they are different.
  if (liveNode.nodeType === 3 && virtualNode.nodeType === 3) {
    // Text changed.
    if (virtualNode.nodeValue !== liveNode.nodeValue) {
      virtualNode.nodeValue = nodeValue;

      patches.push({
        __do__: 3,
        element: virtualNode,
        value: nodeValue
      });
    }

    return;
  }

  if (newChildNodesLength) {
    // Most common additive elements.
    if (newChildNodesLength > oldChildNodesLength) {
      // Store elements in a DocumentFragment to increase performance and be
      // generally simplier to work with.
      var fragment = [];

      for (var i = oldChildNodesLength; i < newChildNodesLength; i++) {
        // Internally add to the tree.
        virtualNode.childNodes.push(childNodes[i]);

        // Add to the document fragment.
        fragment.push(childNodes[i]);
      }

      // Assign the fragment to the patches to be injected.
      patches.push({
        __do__: 1,
        element: virtualNode,
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
        patches.push({ __do__: 1, old: toRemove[i] });
      }

      virtualNode.childNodes.splice(newChildNodesLength, oldChildNodesLength - newChildNodesLength);
    }

    // Replace elements if they are different.
    for (var i = 0; i < newChildNodesLength; i++) {
      if (virtualNode.childNodes[i].nodeName !== childNodes[i].nodeName) {
        // Add to the patches.
        patches.push({
          __do__: 1,
          old: virtualNode.childNodes[i],
          new: childNodes[i]
        });

        // Replace the internal tree's point of view of this element.
        virtualNode.childNodes[i] = childNodes[i];
      }
    }
  }
  // Remove all children if the new live node has none.
  else if (oldChildNodesLength && !newChildNodesLength) {
    patches.push({ __do__: -1, element: virtualNode });
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
          element: virtualNode,
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
          element: virtualNode,
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
        element: virtualNode,
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

exports.filter = filterNode;
exports.sync = syncNode;
