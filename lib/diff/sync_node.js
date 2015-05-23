var slice = Array.prototype.slice;

function syncNode(virtualNode, liveNode) {
  var patches = this;

  // For now always sync the children.  In the future we'll be smarter about
  // when this is necessary.
  var childNodes = liveNode.childNodes;
  var newChildNodesLength = childNodes.length;
  var oldChildNodesLength = virtualNode.childNodes.length;

  // Replace text nodes if their values are different.
  if (liveNode.type === 'text' && virtualNode.type === 'text') {
    // Text changed.
    if (liveNode.nodeValue !== virtualNode.nodeValue) {
      virtualNode.nodeValue = liveNode.nodeValue;

      patches.push({
        __do__: 3,
        element: virtualNode.element,
        value: liveNode.nodeValue
      });
    }

    return;
  }

  if (newChildNodesLength) {
    // Most common additive elements.
    if (newChildNodesLength > oldChildNodesLength) {
      // Elements to add.
      var toAdd = slice.call(childNodes, oldChildNodesLength);
      // Store elements in a DocumentFragment to increase performance and be
      // generally simplier to work with.
      var fragment = document.createDocumentFragment();

      for (var i = oldChildNodesLength; i < newChildNodesLength; i++) {
        // Internally add to the tree.
        virtualNode.childNodes.push(childNodes[i]);

        childNodes[i].__skip__ = true;

        // Add to the document fragment.
        fragment.appendChild(childNodes[i].element);
      }

      if (fragment.length === 0) { throw new Error("what"); }

      // Assign the fragment to the patches to be injected.
      patches.push({ __do__: 1, element: virtualNode.element, new: fragment });
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
          old: virtualNode.childNodes[i].element,
          new: childNodes[i].element
        });

        childNodes[i].__skip__ = true;

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
    var newLength = liveNode.attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      var toAdd = slice.call(liveNode.attributes, oldLength - 1);

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
    var toModify = slice.call(liveNode.attributes);

    for (var i = 0; i < toModify.length; i++) {
      var change = {
        __do__: 2,
        element: virtualNode.element,
        name: toModify[i].name,
        value: toModify[i].value,
      };

      // Only push in a change if the attribute or value changes.
      if (virtualNode.attributes[i].name !== liveNode.attributes[i].name ||
        virtualNode.attributes[i].value !== liveNode.attributes[i].value) {

        // Replace the attribute in the virtual node.
        virtualNode.attributes.splice(i, 1, change);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }
  }

  // Sync each current node.
  for (var i = 0; i < virtualNode.childNodes.length; i++) {
    if (!childNodes[i].__skip__) {
      syncNode.call(patches, virtualNode.childNodes[i], childNodes[i]);
    }
    else {
      delete childNodes[i].__skip__;
    }
  }
}

module.exports = syncNode;
