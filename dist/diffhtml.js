(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diffhtml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../util/pools":6}],2:[function(require,module,exports){
var pools = require('../util/pools');
var parseHTML = require('../util/parse_html');
var makeNode = require('./make_node');
var syncNode = require('./sync_node');

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML) {
  // This is called one time to produce the virtual tree representation of the
  // live element tree.  We attach this directly to the element, because we're
  // fearless like that.
  if (!element.__tree__) { element.__tree__ = makeNode(element); }

  // Nothing to do here.
  if (element.__tree__.source === newHTML) {
    return;
  }

  // Keep a copy of the source.
  element.__tree__.source = newHTML;

  var nodeName = element.nodeName;

  // Create a live representation of the new markup.
  var liveTree = parseHTML(nodeName, newHTML);
  var patches = pools.array.get();

  // Synchronize the element virtual tree with the new live element tree.  This
  // will produce a series of patches that will be excuted to update the DOM.
  syncNode.call(patches, element.__tree__, liveTree);

  // Clear out the live tree.
  liveTree = null;

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    var patch = patches[i];

    // Quickly empty entire childNodes.
    if (patch.__do__ === -1) {
      patch.element.innerHTML = '';
      continue;
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        patch.element.appendChild(patch.fragment);
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Attempting to remove element without a parentNode');
        }

        patch.old.parentNode.removeChild(patch.old);
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Cannot replace the document element');
        }

        document.adoptNode(patch.new);
        patch.old.parentNode.replaceChild(patch.new, patch.old);
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === 2) {
      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }
    }

    // Text node manipulation.
    else if (patch.__do__ === 3) {
      patch.element.nodeValue = patch.value;
    }
  }

  pools.array.free(patches);
}

module.exports = patch;

},{"../util/parse_html":5,"../util/pools":6,"./make_node":1,"./sync_node":3}],3:[function(require,module,exports){
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

},{"../util/pools":6,"./make_node":1}],4:[function(require,module,exports){
var patch = require('./diff/patch');

Object.defineProperty(Element.prototype, 'innerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patch(this, newHTML, true);
  }
});

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patch(this, newHTML);
  }
});

},{"./diff/patch":2}],5:[function(require,module,exports){
var DOMParser = window.DOMParser;
var parser = new DOMParser();

function parseHTML(nodeName, markup) {
  var dom = parser.parseFromString(markup, 'text/html');

  if (nodeName === 'HTML') {
    return dom.documentElement;
  }
  else if (nodeName === 'HEAD') {
    return dom.documentElement.querySelector('head');
  }
  else if (nodeName === 'BODY') {
    return dom.documentElement.querySelector('body');
  }

  return dom.documentElement.querySelector('body').firstChild;
}

module.exports = parseHTML;

},{}],6:[function(require,module,exports){
var COUNT = 15000;

function createPool(size, fill) {
  var free = [];
  var allocated = [];

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    get: function() {
      var obj = null;

      if (free.length) {
        obj = free.pop();
      }
      else {
        obj = fill();
      }

      allocated.push(obj);
      return obj;
    },

    free: function(obj) {
      var idx = allocated.indexOf(obj);

      // Clean.
      if (Array.isArray(obj)) {
        obj.length = 0;
      }
      else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            delete obj[key];
          }
        }
      }

      free.push(obj);
      allocated.splice(idx, 1);
    }
  };
}

exports.object = createPool(COUNT / 2, function() {
  return {};
});

exports.array = createPool(COUNT, function() {
  return [];
});

},{}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZGlmZi9tYWtlX25vZGUuanMiLCJsaWIvZGlmZi9wYXRjaC5qcyIsImxpYi9kaWZmL3N5bmNfbm9kZS5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlsL3BhcnNlX2h0bWwuanMiLCJsaWIvdXRpbC9wb29scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBwb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcbnZhciBwdXNoID0gQXJyYXkucHJvdG90eXBlLnB1c2g7XG5cbi8qKlxuICogQ29udmVydHMgYSBsaXZlIG5vZGUgaW50byBhIHZpcnR1YWwgbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHJldHVyblxuICovXG5mdW5jdGlvbiBtYWtlTm9kZShub2RlKSB7XG4gIC8vIElmIHRoaXMgbm9kZSBoYXMgYWxyZWFkeSBiZWVuIGNvbnZlcnRlZCwgZG8gbm90IGF0dGVtcHQgdG8gY29udmVydCBhZ2Fpbi5cbiAgaWYgKG5vZGUgJiYgbm9kZS5fX25vZGVfXykge1xuICAgIHJldHVybiBub2RlLl9fbm9kZV9fO1xuICB9XG5cbiAgdmFyIG5vZGVUeXBlID0gbm9kZS5ub2RlVHlwZTtcbiAgdmFyIG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xuXG4gIGlmICghbm9kZVR5cGUgfHwgbm9kZVR5cGUgPT09IDIgfHwgbm9kZVR5cGUgPT09IDQgfHwgbm9kZVR5cGUgPT09IDgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobm9kZVR5cGUgPT09IDMgJiYgIW5vZGVWYWx1ZS50cmltKCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBWaXJ0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgbm9kZSwgY29udGFpbmluZyBvbmx5IHRoZSBkYXRhIHdlIHdpc2ggdG9cbiAgLy8gZGlmZiBhbmQgcGF0Y2guXG4gIHZhciBlbnRyeSA9IHBvb2xzLm9iamVjdC5nZXQoKTtcblxuICBlbnRyeS5lbGVtZW50ID0gbm9kZTtcbiAgZW50cnkubm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lO1xuICBlbnRyeS5ub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZTtcbiAgZW50cnkubm9kZVR5cGUgPSBub2RlVHlwZTtcbiAgZW50cnkuY2hpbGROb2RlcyA9IHBvb2xzLmFycmF5LmdldCgpO1xuICBlbnRyeS5hdHRyaWJ1dGVzID0gcG9vbHMuYXJyYXkuZ2V0KCk7XG5cbiAgLy8gQ29sbGVjdCBhdHRyaWJ1dGVzLlxuICB2YXIgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAvLyBJZiB0aGUgZWxlbWVudCBoYXMgbm8gYXR0cmlidXRlcywgc2tpcCBvdmVyLlxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBhdHRyaWJ1dGVzTGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICBpZiAoYXR0cmlidXRlc0xlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcHVzaC5jYWxsKGVudHJ5LmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbGxlY3QgY2hpbGROb2Rlcy5cbiAgdmFyIGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG4gIHZhciBjaGlsZE5vZGVzTGVuZ3RoID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgdmFyIG5ld05vZGUgPSBudWxsO1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBjaGlsZCBub2RlcywgY29udmVydCB0aGVtIGFsbCB0byB2aXJ0dWFsIG5vZGVzLlxuICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMyAmJiBjaGlsZE5vZGVzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIG5ld05vZGUgPSBtYWtlTm9kZShjaGlsZE5vZGVzW2ldKTtcblxuICAgICAgaWYgKG5ld05vZGUpIHtcbiAgICAgICAgZW50cnkuY2hpbGROb2Rlcy5wdXNoKG5ld05vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnRyeTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlTm9kZTtcbiIsInZhciBwb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcbnZhciBwYXJzZUhUTUwgPSByZXF1aXJlKCcuLi91dGlsL3BhcnNlX2h0bWwnKTtcbnZhciBtYWtlTm9kZSA9IHJlcXVpcmUoJy4vbWFrZV9ub2RlJyk7XG52YXIgc3luY05vZGUgPSByZXF1aXJlKCcuL3N5bmNfbm9kZScpO1xuXG4vKipcbiAqIFBhdGNoZXMgYW4gZWxlbWVudCdzIERPTSB0byBtYXRjaCB0aGF0IG9mIHRoZSBwYXNzZWQgbWFya3VwLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbmV3SFRNTFxuICovXG5mdW5jdGlvbiBwYXRjaChlbGVtZW50LCBuZXdIVE1MKSB7XG4gIC8vIFRoaXMgaXMgY2FsbGVkIG9uZSB0aW1lIHRvIHByb2R1Y2UgdGhlIHZpcnR1YWwgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgLy8gbGl2ZSBlbGVtZW50IHRyZWUuICBXZSBhdHRhY2ggdGhpcyBkaXJlY3RseSB0byB0aGUgZWxlbWVudCwgYmVjYXVzZSB3ZSdyZVxuICAvLyBmZWFybGVzcyBsaWtlIHRoYXQuXG4gIGlmICghZWxlbWVudC5fX3RyZWVfXykgeyBlbGVtZW50Ll9fdHJlZV9fID0gbWFrZU5vZGUoZWxlbWVudCk7IH1cblxuICAvLyBOb3RoaW5nIHRvIGRvIGhlcmUuXG4gIGlmIChlbGVtZW50Ll9fdHJlZV9fLnNvdXJjZSA9PT0gbmV3SFRNTCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEtlZXAgYSBjb3B5IG9mIHRoZSBzb3VyY2UuXG4gIGVsZW1lbnQuX190cmVlX18uc291cmNlID0gbmV3SFRNTDtcblxuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xuXG4gIC8vIENyZWF0ZSBhIGxpdmUgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5ldyBtYXJrdXAuXG4gIHZhciBsaXZlVHJlZSA9IHBhcnNlSFRNTChub2RlTmFtZSwgbmV3SFRNTCk7XG4gIHZhciBwYXRjaGVzID0gcG9vbHMuYXJyYXkuZ2V0KCk7XG5cbiAgLy8gU3luY2hyb25pemUgdGhlIGVsZW1lbnQgdmlydHVhbCB0cmVlIHdpdGggdGhlIG5ldyBsaXZlIGVsZW1lbnQgdHJlZS4gIFRoaXNcbiAgLy8gd2lsbCBwcm9kdWNlIGEgc2VyaWVzIG9mIHBhdGNoZXMgdGhhdCB3aWxsIGJlIGV4Y3V0ZWQgdG8gdXBkYXRlIHRoZSBET00uXG4gIHN5bmNOb2RlLmNhbGwocGF0Y2hlcywgZWxlbWVudC5fX3RyZWVfXywgbGl2ZVRyZWUpO1xuXG4gIC8vIENsZWFyIG91dCB0aGUgbGl2ZSB0cmVlLlxuICBsaXZlVHJlZSA9IG51bGw7XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGF0Y2hlcyBhbmQgYXBwbHkgdGhlbS5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBhdGNoID0gcGF0Y2hlc1tpXTtcblxuICAgIC8vIFF1aWNrbHkgZW1wdHkgZW50aXJlIGNoaWxkTm9kZXMuXG4gICAgaWYgKHBhdGNoLl9fZG9fXyA9PT0gLTEpIHtcbiAgICAgIHBhdGNoLmVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBOb2RlIG1hbmlwLlxuICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMSkge1xuICAgICAgLy8gQWRkLlxuICAgICAgaWYgKHBhdGNoLmVsZW1lbnQgJiYgcGF0Y2guZnJhZ21lbnQgJiYgIXBhdGNoLm9sZCkge1xuICAgICAgICBwYXRjaC5lbGVtZW50LmFwcGVuZENoaWxkKHBhdGNoLmZyYWdtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlXG4gICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgIXBhdGNoLm5ldykge1xuICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0aW5nIHRvIHJlbW92ZSBlbGVtZW50IHdpdGhvdXQgYSBwYXJlbnROb2RlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwYXRjaC5vbGQpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXBsYWNlXG4gICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgcGF0Y2gubmV3KSB7XG4gICAgICAgIGlmICghcGF0Y2gub2xkLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZXBsYWNlIHRoZSBkb2N1bWVudCBlbGVtZW50Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUocGF0Y2gubmV3KTtcbiAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoLm5ldywgcGF0Y2gub2xkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdHRyaWJ1dGUgbWFuaXB1bGF0aW9uLlxuICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMikge1xuICAgICAgLy8gUmVtb3ZlLlxuICAgICAgaWYgKCFwYXRjaC52YWx1ZSkgeyBwYXRjaC5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShwYXRjaC5uYW1lKTsgfVxuICAgICAgZWxzZSB7IHBhdGNoLmVsZW1lbnQuc2V0QXR0cmlidXRlKHBhdGNoLm5hbWUsIHBhdGNoLnZhbHVlKTsgfVxuICAgIH1cblxuICAgIC8vIFRleHQgbm9kZSBtYW5pcHVsYXRpb24uXG4gICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAzKSB7XG4gICAgICBwYXRjaC5lbGVtZW50Lm5vZGVWYWx1ZSA9IHBhdGNoLnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHBvb2xzLmFycmF5LmZyZWUocGF0Y2hlcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2g7XG4iLCJ2YXIgbWFrZU5vZGUgPSByZXF1aXJlKCcuL21ha2Vfbm9kZScpO1xudmFyIHBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7XG5cbmZ1bmN0aW9uIGZpbHRlck5vZGUobm9kZSkge1xuICB2YXIgbm9kZVR5cGUgPSBub2RlLm5vZGVUeXBlO1xuXG4gIGlmICghbm9kZVR5cGUgfHwgbm9kZVR5cGUgPT09IDIgfHwgbm9kZVR5cGUgPT09IDQgfHwgbm9kZVR5cGUgPT09IDgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gbm9kZVR5cGUgIT09IDMgfHwgbm9kZS5ub2RlVmFsdWUudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBzeW5jTm9kZSh2aXJ0dWFsTm9kZSwgbGl2ZU5vZGUpIHtcbiAgdmFyIHBhdGNoZXMgPSB0aGlzO1xuXG4gIC8vIEZvciBub3cgYWx3YXlzIHN5bmMgdGhlIGNoaWxkcmVuLiAgSW4gdGhlIGZ1dHVyZSB3ZSdsbCBiZSBzbWFydGVyIGFib3V0XG4gIC8vIHdoZW4gdGhpcyBpcyBuZWNlc3NhcnkuXG4gIHZhciBvbGRDaGlsZE5vZGVzTGVuZ3RoID0gdmlydHVhbE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XG4gIHZhciBub2RlVmFsdWUgPSBsaXZlTm9kZS5ub2RlVmFsdWU7XG5cbiAgLy8gRmlsdGVyIGRvd24gdGhlIGNoaWxkTm9kZXMgdG8gb25seSB3aGF0IHdlIGNhcmUgYWJvdXQuXG4gIHZhciBjaGlsZE5vZGVzID0gZmlsdGVyLmNhbGwobGl2ZU5vZGUuY2hpbGROb2RlcywgZmlsdGVyTm9kZSk7XG4gIHZhciBuZXdDaGlsZE5vZGVzTGVuZ3RoID0gY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgLy8gUmVwbGFjZSB0ZXh0IG5vZGVzIGlmIHRoZWlyIHZhbHVlcyBhcmUgZGlmZmVyZW50LlxuICBpZiAobGl2ZU5vZGUubm9kZVR5cGUgPT09IDMgJiYgdmlydHVhbE5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAvLyBUZXh0IGNoYW5nZWQuXG4gICAgaWYgKG5vZGVWYWx1ZSAhPT0gdmlydHVhbE5vZGUubm9kZVZhbHVlKSB7XG4gICAgICB2aXJ0dWFsTm9kZS5ub2RlVmFsdWUgPSBub2RlVmFsdWU7XG5cbiAgICAgIHBhdGNoZXMucHVzaCh7XG4gICAgICAgIF9fZG9fXzogMyxcbiAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgdmFsdWU6IG5vZGVWYWx1ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gV2lwZSBvdXQgcmVmZXJlbmNlLlxuICBub2RlVmFsdWUgPSBudWxsO1xuXG4gIGlmIChuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gTW9zdCBjb21tb24gYWRkaXRpdmUgZWxlbWVudHMuXG4gICAgaWYgKG5ld0NoaWxkTm9kZXNMZW5ndGggPiBvbGRDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgICAvLyBTdG9yZSBlbGVtZW50cyBpbiBhIERvY3VtZW50RnJhZ21lbnQgdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2UgYW5kIGJlXG4gICAgICAvLyBnZW5lcmFsbHkgc2ltcGxpZXIgdG8gd29yayB3aXRoLlxuICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gb2xkQ2hpbGROb2Rlc0xlbmd0aDsgaSA8IG5ld0NoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBNb3ZlIHRoZSBlbGVtZW50LlxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgICAgLy8gSW50ZXJuYWxseSBhZGQgdG8gdGhlIHRyZWUuXG4gICAgICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMucHVzaChtYWtlTm9kZShjaGlsZE5vZGVzW2ldKSk7XG5cbiAgICAgICAgLy8gQWRkIHRvIHRoZSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFzc2lnbiB0aGUgZnJhZ21lbnQgdG8gdGhlIHBhdGNoZXMgdG8gYmUgaW5qZWN0ZWQuXG4gICAgICBwYXRjaGVzLnB1c2goe1xuICAgICAgICBfX2RvX186IDEsXG4gICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgIGZyYWdtZW50OiBmcmFnbWVudFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZXNlIGVsZW1lbnRzLlxuICAgIGlmIChvbGRDaGlsZE5vZGVzTGVuZ3RoID4gbmV3Q2hpbGROb2Rlc0xlbmd0aCkge1xuICAgICAgLy8gRWxlbWVudHMgdG8gcmVtb3ZlLlxuICAgICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbCh2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLCAtMSAqIChvbGRDaGlsZE5vZGVzTGVuZ3RoIC0gbmV3Q2hpbGROb2Rlc0xlbmd0aCkpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgZWxlbWVudCwgdGhpcyBoYXBwZW5zIGJlZm9yZSB0aGUgc3BsaWNlIHNvIHRoYXQgd2Ugc3RpbGxcbiAgICAgICAgLy8gaGF2ZSBhY2Nlc3MgdG8gdGhlIGVsZW1lbnQuXG4gICAgICAgIHBhdGNoZXMucHVzaCh7IF9fZG9fXzogMSwgb2xkOiB0b1JlbW92ZVtpXS5lbGVtZW50IH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBvYmplY3QgdG8gZnJlZSBwb29sLlxuICAgICAgICBwb29scy5hcnJheS5mcmVlKHRvUmVtb3ZlW2ldLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwb29scy5hcnJheS5mcmVlKHRvUmVtb3ZlW2ldLmNoaWxkTm9kZXMpO1xuICAgICAgICBwb29scy5vYmplY3QuZnJlZSh0b1JlbW92ZVtpXSk7XG4gICAgICB9XG5cbiAgICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMuc3BsaWNlKG5ld0NoaWxkTm9kZXNMZW5ndGgsIG9sZENoaWxkTm9kZXNMZW5ndGggLSBuZXdDaGlsZE5vZGVzTGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIGVsZW1lbnRzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld0NoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0ubm9kZU5hbWUgIT09IGNoaWxkTm9kZXNbaV0ubm9kZU5hbWUpIHtcbiAgICAgICAgLy8gQWRkIHRvIHRoZSBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzLnB1c2goe1xuICAgICAgICAgIF9fZG9fXzogMSxcbiAgICAgICAgICBvbGQ6IHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0uZWxlbWVudCxcbiAgICAgICAgICBuZXc6IGNoaWxkTm9kZXNbaV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIG9iamVjdCB0byBwb29sLlxuICAgICAgICBwb29scy5hcnJheS5mcmVlKHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0uYXR0cmlidXRlcyk7XG4gICAgICAgIHBvb2xzLmFycmF5LmZyZWUodmlydHVhbE5vZGUuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzKTtcbiAgICAgICAgcG9vbHMub2JqZWN0LmZyZWUodmlydHVhbE5vZGUuY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgaW50ZXJuYWwgdHJlZSdzIHBvaW50IG9mIHZpZXcgb2YgdGhpcyBlbGVtZW50LlxuICAgICAgICB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzW2ldID0gbWFrZU5vZGUoY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFJlbW92ZSBhbGwgY2hpbGRyZW4gaWYgdGhlIG5ldyBsaXZlIG5vZGUgaGFzIG5vbmUuXG4gIGVsc2UgaWYgKG9sZENoaWxkTm9kZXNMZW5ndGggJiYgIW5ld0NoaWxkTm9kZXNMZW5ndGgpIHtcbiAgICBwYXRjaGVzLnB1c2goeyBfX2RvX186IC0xLCBlbGVtZW50OiB2aXJ0dWFsTm9kZS5lbGVtZW50IH0pO1xuICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMuc3BsaWNlKDAsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuICB9XG5cbiAgLy8gU3luY2hyb25pemUgYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlcyA9IGxpdmVOb2RlLmF0dHJpYnV0ZXM7XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgb2xkTGVuZ3RoID0gdmlydHVhbE5vZGUuYXR0cmlidXRlcy5sZW5ndGg7XG4gICAgdmFyIG5ld0xlbmd0aCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gICAgLy8gU3RhcnQgd2l0aCB0aGUgbW9zdCBjb21tb24sIGFkZGl0aXZlLlxuICAgIGlmIChuZXdMZW5ndGggPiBvbGRMZW5ndGgpIHtcbiAgICAgIHZhciB0b0FkZCA9IHNsaWNlLmNhbGwoYXR0cmlidXRlcywgb2xkTGVuZ3RoIC0gMSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9BZGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b0FkZFtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB0b0FkZFtpXS52YWx1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBQdXNoIHRoZSBjaGFuZ2Ugb2JqZWN0IGRpcmVjdGx5IGludG8gdGhlIHZpcnR1YWwgdHJlZSwgdGhlIGBfX2RvX19gXG4gICAgICAgIC8vIHByb3BlcnR5IHdvbid0IGJlIGluc3BlY3RlZCBieSBhbnl0aGluZyBzbyB3ZSBzYXZlIG9uIHRvdGFsICMgb2ZcbiAgICAgICAgLy8gb2JqZWN0cyBjcmVhdGVkLlxuICAgICAgICB2YXIgaW5kZXggPSB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLnB1c2goY2hhbmdlKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciByZW1vdmFscy5cbiAgICBpZiAob2xkTGVuZ3RoID4gbmV3TGVuZ3RoKSB7XG4gICAgICB2YXIgdG9SZW1vdmUgPSBzbGljZS5jYWxsKHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXMsIG5ld0xlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b1JlbW92ZVtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZnJvbSB0aGUgdmlydHVhbCBub2RlLlxuICAgICAgICB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLnNwbGljZShpLCAxKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBtb2RpZmljYXRpb25zLlxuICAgIHZhciB0b01vZGlmeSA9IHNsaWNlLmNhbGwoYXR0cmlidXRlcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvTW9kaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICBfX2RvX186IDIsXG4gICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgIG5hbWU6IHRvTW9kaWZ5W2ldLm5hbWUsXG4gICAgICAgIHZhbHVlOiB0b01vZGlmeVtpXS52YWx1ZSxcbiAgICAgIH07XG5cbiAgICAgIC8vIE9ubHkgcHVzaCBpbiBhIGNoYW5nZSBpZiB0aGUgYXR0cmlidXRlIG9yIHZhbHVlIGNoYW5nZXMuXG4gICAgICBpZiAodmlydHVhbE5vZGUuYXR0cmlidXRlc1tpXS52YWx1ZSAhPT0gYXR0cmlidXRlc1tpXS52YWx1ZSkge1xuICAgICAgICAvLyBSZXBsYWNlIHRoZSBhdHRyaWJ1dGUgaW4gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlcy5zcGxpY2UoaSwgMSwgY2hhbmdlKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmMgZWFjaCBjdXJyZW50IG5vZGUuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlydHVhbE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHN5bmNOb2RlLmNhbGwocGF0Y2hlcywgdmlydHVhbE5vZGUuY2hpbGROb2Rlc1tpXSwgY2hpbGROb2Rlc1tpXSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzeW5jTm9kZTtcbiIsInZhciBwYXRjaCA9IHJlcXVpcmUoJy4vZGlmZi9wYXRjaCcpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdpbm5lckRpZmZIVE1MJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgc2V0OiBmdW5jdGlvbihuZXdIVE1MKSB7XG4gICAgcGF0Y2godGhpcywgbmV3SFRNTCwgdHJ1ZSk7XG4gIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdvdXRlckRpZmZIVE1MJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgc2V0OiBmdW5jdGlvbihuZXdIVE1MKSB7XG4gICAgcGF0Y2godGhpcywgbmV3SFRNTCk7XG4gIH1cbn0pO1xuIiwidmFyIERPTVBhcnNlciA9IHdpbmRvdy5ET01QYXJzZXI7XG52YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXG5mdW5jdGlvbiBwYXJzZUhUTUwobm9kZU5hbWUsIG1hcmt1cCkge1xuICB2YXIgZG9tID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhtYXJrdXAsICd0ZXh0L2h0bWwnKTtcblxuICBpZiAobm9kZU5hbWUgPT09ICdIVE1MJykge1xuICAgIHJldHVybiBkb20uZG9jdW1lbnRFbGVtZW50O1xuICB9XG4gIGVsc2UgaWYgKG5vZGVOYW1lID09PSAnSEVBRCcpIHtcbiAgICByZXR1cm4gZG9tLmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJyk7XG4gIH1cbiAgZWxzZSBpZiAobm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgIHJldHVybiBkb20uZG9jdW1lbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbiAgfVxuXG4gIHJldHVybiBkb20uZG9jdW1lbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5maXJzdENoaWxkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlSFRNTDtcbiIsInZhciBDT1VOVCA9IDE1MDAwO1xuXG5mdW5jdGlvbiBjcmVhdGVQb29sKHNpemUsIGZpbGwpIHtcbiAgdmFyIGZyZWUgPSBbXTtcbiAgdmFyIGFsbG9jYXRlZCA9IFtdO1xuXG4gIC8vIFByaW1lIHRoZSBjYWNoZSB3aXRoIG4gb2JqZWN0cy5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBmcmVlW2ldID0gZmlsbCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IG51bGw7XG5cbiAgICAgIGlmIChmcmVlLmxlbmd0aCkge1xuICAgICAgICBvYmogPSBmcmVlLnBvcCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG9iaiA9IGZpbGwoKTtcbiAgICAgIH1cblxuICAgICAgYWxsb2NhdGVkLnB1c2gob2JqKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuICAgIGZyZWU6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGlkeCA9IGFsbG9jYXRlZC5pbmRleE9mKG9iaik7XG5cbiAgICAgIC8vIENsZWFuLlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICBvYmoubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZyZWUucHVzaChvYmopO1xuICAgICAgYWxsb2NhdGVkLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0cy5vYmplY3QgPSBjcmVhdGVQb29sKENPVU5UIC8gMiwgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7fTtcbn0pO1xuXG5leHBvcnRzLmFycmF5ID0gY3JlYXRlUG9vbChDT1VOVCwgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXTtcbn0pO1xuIl19
