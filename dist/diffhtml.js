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