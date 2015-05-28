var pools = require('../util/pools');
var slice = Array.prototype.slice;
var filter = Array.prototype.filter;

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
  var oldChildNodes = virtualNode.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  var nodeValue = liveNode.nodeValue;

  // Filter down the childNodes to only what we care about.
  var childNodes = liveNode.childNodes;
  var newChildNodesLength = childNodes ? childNodes.length : 0;

  // Replace text node values if they are different.
  if (liveNode.nodeName === '#text' && virtualNode.nodeName === '#text') {
    // Text changed.
    if (virtualNode.nodeValue !== liveNode.nodeValue) {
      virtualNode.nodeValue = liveNode.nodeValue;

      patches.push({
        __do__: 3,
        element: virtualNode.element,
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
      var fragment = pools.array.get();

      for (var i = oldChildNodesLength; i < newChildNodesLength; i++) {
        // Internally add to the tree.
        virtualNode.childNodes.push(childNodes[i]);

        // Add to the document fragment.
        fragment.push(childNodes[i]);
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

        // Push the change object into into the virtual tree.
        virtualNode.attributes.push(toAdd[i]);

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
      var oldAttrValue = virtualNode.attributes[i] && virtualNode.attributes[i].value;
      var newAttrValue = attributes[i] && attributes[i].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toModify[i].name,
          value: toModify[i].value,
        };

        // Replace the attribute in the virtual node.
        virtualNode.attributes[i].name = toModify[i].name;
        virtualNode.attributes[i].value = toModify[i].value;

        // Add the change to the series of patches.
        patches.push(change);
      }
    }
  }

  // Sync each current node.
  for (var i = 0; i < virtualNode.childNodes.length; i++) {
    if (virtualNode.childNodes[i] !== childNodes[i]) {
      syncNode.call(patches, virtualNode.childNodes[i], childNodes[i]);
    }
  }
}

exports.sync = syncNode;
