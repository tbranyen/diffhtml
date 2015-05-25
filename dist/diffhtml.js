(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diffhtml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var DOMParser = require('../util/dom_parser');
var parseHTML = require('../util/parse_html');
var makeNode = require('./make_node');

var fn = require('../worker').toString();
var workerBody = fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}'));
var workerBlob = new Blob([workerBody], { type: 'text/javascript' });
var worker = new Worker(window.URL.createObjectURL(workerBlob));

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML) {
  var isNew = false;

  // This is called one time to produce the virtual tree representation of the
  // live element tree.  We attach this directly to the element, because we're
  // fearless like that.
  if (!element.__tree__) {
    isNew = true;
    element.__tree__ = makeNode(element);
  }

  // Create a live representation of the new markup.
  var liveTree = makeNode(parseHTML(newHTML));
  var syncRequest = [liveTree];

  if (isNew) {
    syncRequest.push(element.__tree__);
  }

  // Fire off a sync request.
  worker.postMessage(syncRequest);

  // Await patches.
  worker.onmessage = function(e) {
    var patches = e.data;

    // Loop through all the patches and apply them.
    for (var i = 0; i < patches.length; i++) {
      var patch = patches[i];

      // Convert ids to nodes.
      if (patch.element) {
        patch.element = makeNode.getNodeById(patch.element);
      }

      // Quickly empty entire childNodes.
      if (patch.__do__ === -1) {
        patch.element.innerHTML = '';
        continue;
      }

      // Node manip.
      else if (patch.__do__ === 1) {

        if (patch.old) {
          patch.old = makeNode.getNodeById(patch.old);
        }

        if (patch.new) {
          patch.new = makeNode.getNodeById(patch.new);
        }

        if (patch.fragment) {
          var fragment = document.createDocumentFragment();
          patch.fragment.forEach(function(id) {
            fragment.appendChild(makeNode.getNodeById(id));
          });
          patch.fragment = fragment;
        }

        // Add.
        if (patch.element && patch.fragment && !patch.old) {
          patch.element.appendChild(patch.fragment);
        }

        // Remove
        else if (patch.old && !patch.new) {
          if (!patch.old.parentNode) {
            throw new Error('Cannot remove the document element');
          }

          patch.old.parentNode.removeChild(patch.old);
        }

        // Replace
        else if (patch.old && patch.new) {
          if (!patch.old.parentNode) {
            throw new Error('Cannot replace the document element');
          }

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
  };
}

module.exports = patch;

},{"../util/dom_parser":4,"../util/parse_html":5,"../worker":6,"./make_node":1}],3:[function(require,module,exports){
var patch = require('./diff/patch');

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patch(this, newHTML);
  }
});

},{"./diff/patch":2}],4:[function(require,module,exports){
/*! @source https://gist.github.com/1129031 */

var DOMParser = window.DOMParser || function() {};
var DOMParser_proto = DOMParser.prototype;
var real_parseFromString = DOMParser_proto.parseFromString;

module.exports = DOMParser;

// Firefox/Opera/IE throw errors on unsupported types
try {
  // WebKit returns null on unsupported types
  if ((new DOMParser).parseFromString("", "text/html")) {
    // text/html parsing is natively supported
    return;
  }
} catch (unhandledException) {}

DOMParser_proto.parseFromString = function(markup, type) {
  if (!/^\s*text\/html\s*(?:;|$)/i.test(type)) {
    return real_parseFromString.apply(this, arguments);
  }

  var doc = document.implementation.createHTMLDocument("");
  var doc_elt = doc.documentElement;
  var first_elt;

  doc_elt.innerHTML = markup;
  first_elt = doc_elt.firstElementChild;

  if (doc_elt.childElementCount === 1
    && first_elt.localName.toLowerCase() === "html") {
    doc.replaceChild(first_elt, doc_elt);
  }

  return doc;
};

},{}],5:[function(require,module,exports){
var DOMParser = window.DOMParser || function() {};
var parser = new DOMParser();

function parseHTML(markup) {
  return parser.parseFromString(markup, 'text/html').documentElement;
}

module.exports = parseHTML;

},{}],6:[function(require,module,exports){
module.exports = function() {
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
        var fragment = [];

        for (var i = oldChildNodesLength; i < newChildNodesLength; i++) {
          // Internally add to the tree.
          virtualNode.childNodes.push(childNodes[i]);

          childNodes[i].__skip__ = true;

          // Add to the document fragment.
          fragment.push(childNodes[i].element);
        }

        // Assign the fragment to the patches to be injected.
        patches.push({ __do__: 1, element: virtualNode.element, fragment: fragment });
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

  var virtualTree = null;

  self.onmessage = function(e) {
    var patches = [];
    var syncRequest = e.data;

    if (syncRequest[1]) { virtualTree = syncRequest[1]; }

    // Create a live representation of the new markup.
    var liveTree = syncRequest[0];

    // Synchronize the element virtual tree with the new live element tree.  This
    // will produce a series of patches that will be excuted to update the DOM.
    syncNode.call(patches, virtualTree, liveTree);

    self.postMessage(patches);
  };
};

},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZGlmZi9tYWtlX25vZGUuanMiLCJsaWIvZGlmZi9wYXRjaC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlsL2RvbV9wYXJzZXIuanMiLCJsaWIvdXRpbC9wYXJzZV9odG1sLmpzIiwibGliL3dvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaHVtYW5pemVOb2RlVHlwZSA9IHtcbiAgMTogJ3RhZycsXG4gIDI6ICdhdHRyaWJ1dGUnLFxuICAzOiAndGV4dCcsXG4gIDQ6ICdjZGF0YScsXG4gIDg6ICdjb21tZW50J1xufTtcblxudmFyIGlkID0gMDtcbnZhciBub2RlUG9vbCA9IHt9O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgbGl2ZSBub2RlIGludG8gYSB2aXJ0dWFsIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGVcbiAqIEByZXR1cm5cbiAqL1xuZnVuY3Rpb24gbWFrZU5vZGUobm9kZSkge1xuICAvLyBJZiB0aGlzIG5vZGUgaGFzIGFscmVhZHkgYmVlbiBjb252ZXJ0ZWQsIGRvIG5vdCBhdHRlbXB0IHRvIGNvbnZlcnQgYWdhaW4uXG4gIGlmIChub2RlICYmIG5vZGUubm9kZSkge1xuICAgIHJldHVybiBub2RlLm5vZGU7XG4gIH1cblxuICAvLyBHZXQgYSBodW1hbml6ZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBub2RlVHlwZWAuXG4gIHZhciB0eXBlID0gaHVtYW5pemVOb2RlVHlwZVtub2RlLm5vZGVUeXBlXTtcblxuICAvLyBJZiB0aGUgZWxlbWVudCBmb3VuZCBpcyBpcnJlbGV2YW50IGZvciBvdXIgdXNlcywgc2tpcCBpdC5cbiAgaWYgKCF0eXBlIHx8IHR5cGUgPT09ICdhdHRyaWJ1dGUnIHx8IHR5cGUgPT09ICdjZGF0YScgfHwgdHlwZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU2tpcCBvdmVyIGVtcHR5IHRleHQgbm9kZXMuXG4gIGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0JyAmJiAhbm9kZS5ub2RlVmFsdWUudHJpbSgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3RvcmUgbm9kZXMgaW4gdGhlIHBvb2wuXG4gIGlkID0gaWQgKyAxO1xuICBub2RlUG9vbFtpZF0gPSBub2RlO1xuXG4gIC8vIFZpcnR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBub2RlLCBjb250YWluaW5nIG9ubHkgdGhlIGRhdGEgd2Ugd2lzaCB0b1xuICAvLyBkaWZmIGFuZCBwYXRjaC5cbiAgdmFyIGVudHJ5ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZWxlbWVudDogaWQsXG4gICAgbm9kZU5hbWU6IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICBub2RlVmFsdWU6IG5vZGUubm9kZVZhbHVlLFxuICAgIGF0dHJpYnV0ZXM6IFtdLFxuICAgIGRhdGFzZXQ6IFtdLFxuICAgIHN0eWxlOiBbXSxcbiAgICBjaGlsZE5vZGVzOiBbXSxcbiAgfTtcblxuICAvLyBDb2xsZWN0IGF0dHJpYnV0ZXMuXG4gIHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBubyBhdHRyaWJ1dGVzLCBza2lwIG92ZXIuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXNMZW5ndGggPSBhdHRyaWJ1dGVzLmxlbmd0aDtcblxuICAgIGlmIChhdHRyaWJ1dGVzTGVuZ3RoKSB7XG4gICAgICAvLyBDb3B5IGFsbCBhdHRyaWJ1dGUgdmFsdWVzIGludG8gdGhlIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZW50cnkuYXR0cmlidXRlcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVzW2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNbaV0udmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbGxlY3QgY2hpbGROb2Rlcy5cbiAgdmFyIGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIGNoaWxkIG5vZGVzLCBjb252ZXJ0IHRoZW0gYWxsIHRvIHZpcnR1YWwgbm9kZXMuXG4gIGlmICh0eXBlICE9PSAndGV4dCcgJiYgY2hpbGROb2Rlcykge1xuICAgIGVudHJ5LmNoaWxkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoY2hpbGROb2RlcywgbWFrZU5vZGUpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgLy8gQWxzbyBhdHRhY2ggdG8gdGhlIGFjdHVhbCBlbGVtZW50LlxuICBub2RlLm5vZGUgPSBlbnRyeTtcblxuICByZXR1cm4gZW50cnk7XG59XG5cbm1ha2VOb2RlLmdldE5vZGVCeUlkID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIG5vZGVQb29sW2lkXTtcbn07XG5cbndpbmRvdy5tYWtlTm9kZSA9IG1vZHVsZS5leHBvcnRzID0gbWFrZU5vZGU7XG4iLCJ2YXIgRE9NUGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbC9kb21fcGFyc2VyJyk7XG52YXIgcGFyc2VIVE1MID0gcmVxdWlyZSgnLi4vdXRpbC9wYXJzZV9odG1sJyk7XG52YXIgbWFrZU5vZGUgPSByZXF1aXJlKCcuL21ha2Vfbm9kZScpO1xuXG52YXIgZm4gPSByZXF1aXJlKCcuLi93b3JrZXInKS50b1N0cmluZygpO1xudmFyIHdvcmtlckJvZHkgPSBmbi5zbGljZShmbi5pbmRleE9mKCd7JykgKyAxLCBmbi5sYXN0SW5kZXhPZignfScpKTtcbnZhciB3b3JrZXJCbG9iID0gbmV3IEJsb2IoW3dvcmtlckJvZHldLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xudmFyIHdvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwod29ya2VyQmxvYikpO1xuXG4vKipcbiAqIFBhdGNoZXMgYW4gZWxlbWVudCdzIERPTSB0byBtYXRjaCB0aGF0IG9mIHRoZSBwYXNzZWQgbWFya3VwLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbmV3SFRNTFxuICovXG5mdW5jdGlvbiBwYXRjaChlbGVtZW50LCBuZXdIVE1MKSB7XG4gIHZhciBpc05ldyA9IGZhbHNlO1xuXG4gIC8vIFRoaXMgaXMgY2FsbGVkIG9uZSB0aW1lIHRvIHByb2R1Y2UgdGhlIHZpcnR1YWwgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgLy8gbGl2ZSBlbGVtZW50IHRyZWUuICBXZSBhdHRhY2ggdGhpcyBkaXJlY3RseSB0byB0aGUgZWxlbWVudCwgYmVjYXVzZSB3ZSdyZVxuICAvLyBmZWFybGVzcyBsaWtlIHRoYXQuXG4gIGlmICghZWxlbWVudC5fX3RyZWVfXykge1xuICAgIGlzTmV3ID0gdHJ1ZTtcbiAgICBlbGVtZW50Ll9fdHJlZV9fID0gbWFrZU5vZGUoZWxlbWVudCk7XG4gIH1cblxuICAvLyBDcmVhdGUgYSBsaXZlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBuZXcgbWFya3VwLlxuICB2YXIgbGl2ZVRyZWUgPSBtYWtlTm9kZShwYXJzZUhUTUwobmV3SFRNTCkpO1xuICB2YXIgc3luY1JlcXVlc3QgPSBbbGl2ZVRyZWVdO1xuXG4gIGlmIChpc05ldykge1xuICAgIHN5bmNSZXF1ZXN0LnB1c2goZWxlbWVudC5fX3RyZWVfXyk7XG4gIH1cblxuICAvLyBGaXJlIG9mZiBhIHN5bmMgcmVxdWVzdC5cbiAgd29ya2VyLnBvc3RNZXNzYWdlKHN5bmNSZXF1ZXN0KTtcblxuICAvLyBBd2FpdCBwYXRjaGVzLlxuICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBwYXRjaGVzID0gZS5kYXRhO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGF0Y2hlcyBhbmQgYXBwbHkgdGhlbS5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXRjaCA9IHBhdGNoZXNbaV07XG5cbiAgICAgIC8vIENvbnZlcnQgaWRzIHRvIG5vZGVzLlxuICAgICAgaWYgKHBhdGNoLmVsZW1lbnQpIHtcbiAgICAgICAgcGF0Y2guZWxlbWVudCA9IG1ha2VOb2RlLmdldE5vZGVCeUlkKHBhdGNoLmVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBRdWlja2x5IGVtcHR5IGVudGlyZSBjaGlsZE5vZGVzLlxuICAgICAgaWYgKHBhdGNoLl9fZG9fXyA9PT0gLTEpIHtcbiAgICAgICAgcGF0Y2guZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vZGUgbWFuaXAuXG4gICAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDEpIHtcblxuICAgICAgICBpZiAocGF0Y2gub2xkKSB7XG4gICAgICAgICAgcGF0Y2gub2xkID0gbWFrZU5vZGUuZ2V0Tm9kZUJ5SWQocGF0Y2gub2xkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXRjaC5uZXcpIHtcbiAgICAgICAgICBwYXRjaC5uZXcgPSBtYWtlTm9kZS5nZXROb2RlQnlJZChwYXRjaC5uZXcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhdGNoLmZyYWdtZW50KSB7XG4gICAgICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgIHBhdGNoLmZyYWdtZW50LmZvckVhY2goZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKG1ha2VOb2RlLmdldE5vZGVCeUlkKGlkKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcGF0Y2guZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZC5cbiAgICAgICAgaWYgKHBhdGNoLmVsZW1lbnQgJiYgcGF0Y2guZnJhZ21lbnQgJiYgIXBhdGNoLm9sZCkge1xuICAgICAgICAgIHBhdGNoLmVsZW1lbnQuYXBwZW5kQ2hpbGQocGF0Y2guZnJhZ21lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlXG4gICAgICAgIGVsc2UgaWYgKHBhdGNoLm9sZCAmJiAhcGF0Y2gubmV3KSB7XG4gICAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVtb3ZlIHRoZSBkb2N1bWVudCBlbGVtZW50Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGF0Y2gub2xkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlcGxhY2VcbiAgICAgICAgZWxzZSBpZiAocGF0Y2gub2xkICYmIHBhdGNoLm5ldykge1xuICAgICAgICAgIGlmICghcGF0Y2gub2xkLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlcGxhY2UgdGhlIGRvY3VtZW50IGVsZW1lbnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0Y2gubmV3LCBwYXRjaC5vbGQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEF0dHJpYnV0ZSBtYW5pcHVsYXRpb24uXG4gICAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDIpIHtcbiAgICAgICAgLy8gUmVtb3ZlLlxuICAgICAgICBpZiAoIXBhdGNoLnZhbHVlKSB7IHBhdGNoLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHBhdGNoLm5hbWUpOyB9XG4gICAgICAgIGVsc2UgeyBwYXRjaC5lbGVtZW50LnNldEF0dHJpYnV0ZShwYXRjaC5uYW1lLCBwYXRjaC52YWx1ZSk7IH1cbiAgICAgIH1cblxuICAgICAgLy8gVGV4dCBub2RlIG1hbmlwdWxhdGlvbi5cbiAgICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMykge1xuICAgICAgICBwYXRjaC5lbGVtZW50Lm5vZGVWYWx1ZSA9IHBhdGNoLnZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaDtcbiIsInZhciBwYXRjaCA9IHJlcXVpcmUoJy4vZGlmZi9wYXRjaCcpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdvdXRlckRpZmZIVE1MJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgc2V0OiBmdW5jdGlvbihuZXdIVE1MKSB7XG4gICAgcGF0Y2godGhpcywgbmV3SFRNTCk7XG4gIH1cbn0pO1xuIiwiLyohIEBzb3VyY2UgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTEyOTAzMSAqL1xuXG52YXIgRE9NUGFyc2VyID0gd2luZG93LkRPTVBhcnNlciB8fCBmdW5jdGlvbigpIHt9O1xudmFyIERPTVBhcnNlcl9wcm90byA9IERPTVBhcnNlci5wcm90b3R5cGU7XG52YXIgcmVhbF9wYXJzZUZyb21TdHJpbmcgPSBET01QYXJzZXJfcHJvdG8ucGFyc2VGcm9tU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTVBhcnNlcjtcblxuLy8gRmlyZWZveC9PcGVyYS9JRSB0aHJvdyBlcnJvcnMgb24gdW5zdXBwb3J0ZWQgdHlwZXNcbnRyeSB7XG4gIC8vIFdlYktpdCByZXR1cm5zIG51bGwgb24gdW5zdXBwb3J0ZWQgdHlwZXNcbiAgaWYgKChuZXcgRE9NUGFyc2VyKS5wYXJzZUZyb21TdHJpbmcoXCJcIiwgXCJ0ZXh0L2h0bWxcIikpIHtcbiAgICAvLyB0ZXh0L2h0bWwgcGFyc2luZyBpcyBuYXRpdmVseSBzdXBwb3J0ZWRcbiAgICByZXR1cm47XG4gIH1cbn0gY2F0Y2ggKHVuaGFuZGxlZEV4Y2VwdGlvbikge31cblxuRE9NUGFyc2VyX3Byb3RvLnBhcnNlRnJvbVN0cmluZyA9IGZ1bmN0aW9uKG1hcmt1cCwgdHlwZSkge1xuICBpZiAoIS9eXFxzKnRleHRcXC9odG1sXFxzKig/Ojt8JCkvaS50ZXN0KHR5cGUpKSB7XG4gICAgcmV0dXJuIHJlYWxfcGFyc2VGcm9tU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICB2YXIgZG9jID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFwiXCIpO1xuICB2YXIgZG9jX2VsdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciBmaXJzdF9lbHQ7XG5cbiAgZG9jX2VsdC5pbm5lckhUTUwgPSBtYXJrdXA7XG4gIGZpcnN0X2VsdCA9IGRvY19lbHQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgaWYgKGRvY19lbHQuY2hpbGRFbGVtZW50Q291bnQgPT09IDFcbiAgICAmJiBmaXJzdF9lbHQubG9jYWxOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaHRtbFwiKSB7XG4gICAgZG9jLnJlcGxhY2VDaGlsZChmaXJzdF9lbHQsIGRvY19lbHQpO1xuICB9XG5cbiAgcmV0dXJuIGRvYztcbn07XG4iLCJ2YXIgRE9NUGFyc2VyID0gd2luZG93LkRPTVBhcnNlciB8fCBmdW5jdGlvbigpIHt9O1xudmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblxuZnVuY3Rpb24gcGFyc2VIVE1MKG1hcmt1cCkge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhtYXJrdXAsICd0ZXh0L2h0bWwnKS5kb2N1bWVudEVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VIVE1MO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4gIGZ1bmN0aW9uIHN5bmNOb2RlKHZpcnR1YWxOb2RlLCBsaXZlTm9kZSkge1xuICAgIHZhciBwYXRjaGVzID0gdGhpcztcblxuICAgIC8vIEZvciBub3cgYWx3YXlzIHN5bmMgdGhlIGNoaWxkcmVuLiAgSW4gdGhlIGZ1dHVyZSB3ZSdsbCBiZSBzbWFydGVyIGFib3V0XG4gICAgLy8gd2hlbiB0aGlzIGlzIG5lY2Vzc2FyeS5cbiAgICB2YXIgY2hpbGROb2RlcyA9IGxpdmVOb2RlLmNoaWxkTm9kZXM7XG4gICAgdmFyIG5ld0NoaWxkTm9kZXNMZW5ndGggPSBjaGlsZE5vZGVzLmxlbmd0aDtcbiAgICB2YXIgb2xkQ2hpbGROb2Rlc0xlbmd0aCA9IHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgLy8gUmVwbGFjZSB0ZXh0IG5vZGVzIGlmIHRoZWlyIHZhbHVlcyBhcmUgZGlmZmVyZW50LlxuICAgIGlmIChsaXZlTm9kZS50eXBlID09PSAndGV4dCcgJiYgdmlydHVhbE5vZGUudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAvLyBUZXh0IGNoYW5nZWQuXG4gICAgICBpZiAobGl2ZU5vZGUubm9kZVZhbHVlICE9PSB2aXJ0dWFsTm9kZS5ub2RlVmFsdWUpIHtcbiAgICAgICAgdmlydHVhbE5vZGUubm9kZVZhbHVlID0gbGl2ZU5vZGUubm9kZVZhbHVlO1xuXG4gICAgICAgIHBhdGNoZXMucHVzaCh7XG4gICAgICAgICAgX19kb19fOiAzLFxuICAgICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgICAgdmFsdWU6IGxpdmVOb2RlLm5vZGVWYWx1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgICAvLyBNb3N0IGNvbW1vbiBhZGRpdGl2ZSBlbGVtZW50cy5cbiAgICAgIGlmIChuZXdDaGlsZE5vZGVzTGVuZ3RoID4gb2xkQ2hpbGROb2Rlc0xlbmd0aCkge1xuICAgICAgICAvLyBFbGVtZW50cyB0byBhZGQuXG4gICAgICAgIHZhciB0b0FkZCA9IHNsaWNlLmNhbGwoY2hpbGROb2Rlcywgb2xkQ2hpbGROb2Rlc0xlbmd0aCk7XG4gICAgICAgIC8vIFN0b3JlIGVsZW1lbnRzIGluIGEgRG9jdW1lbnRGcmFnbWVudCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZSBhbmQgYmVcbiAgICAgICAgLy8gZ2VuZXJhbGx5IHNpbXBsaWVyIHRvIHdvcmsgd2l0aC5cbiAgICAgICAgdmFyIGZyYWdtZW50ID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IG9sZENoaWxkTm9kZXNMZW5ndGg7IGkgPCBuZXdDaGlsZE5vZGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAvLyBJbnRlcm5hbGx5IGFkZCB0byB0aGUgdHJlZS5cbiAgICAgICAgICB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLnB1c2goY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgICAgICBjaGlsZE5vZGVzW2ldLl9fc2tpcF9fID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIEFkZCB0byB0aGUgZG9jdW1lbnQgZnJhZ21lbnQuXG4gICAgICAgICAgZnJhZ21lbnQucHVzaChjaGlsZE5vZGVzW2ldLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXNzaWduIHRoZSBmcmFnbWVudCB0byB0aGUgcGF0Y2hlcyB0byBiZSBpbmplY3RlZC5cbiAgICAgICAgcGF0Y2hlcy5wdXNoKHsgX19kb19fOiAxLCBlbGVtZW50OiB2aXJ0dWFsTm9kZS5lbGVtZW50LCBmcmFnbWVudDogZnJhZ21lbnQgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSB0aGVzZSBlbGVtZW50cy5cbiAgICAgIGlmIChvbGRDaGlsZE5vZGVzTGVuZ3RoID4gbmV3Q2hpbGROb2Rlc0xlbmd0aCkge1xuICAgICAgICAvLyBFbGVtZW50cyB0byByZW1vdmUuXG4gICAgICAgIHZhciB0b1JlbW92ZSA9IHNsaWNlLmNhbGwodmlydHVhbE5vZGUuY2hpbGROb2RlcywgLTEgKiAob2xkQ2hpbGROb2Rlc0xlbmd0aCAtIG5ld0NoaWxkTm9kZXNMZW5ndGgpKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBlbGVtZW50LCB0aGlzIGhhcHBlbnMgYmVmb3JlIHRoZSBzcGxpY2Ugc28gdGhhdCB3ZSBzdGlsbFxuICAgICAgICAgIC8vIGhhdmUgYWNjZXNzIHRvIHRoZSBlbGVtZW50LlxuICAgICAgICAgIHBhdGNoZXMucHVzaCh7IF9fZG9fXzogMSwgb2xkOiB0b1JlbW92ZVtpXS5lbGVtZW50IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmlydHVhbE5vZGUuY2hpbGROb2Rlcy5zcGxpY2UobmV3Q2hpbGROb2Rlc0xlbmd0aCwgb2xkQ2hpbGROb2Rlc0xlbmd0aCAtIG5ld0NoaWxkTm9kZXNMZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXBsYWNlIGVsZW1lbnRzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3Q2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzW2ldLm5vZGVOYW1lICE9PSBjaGlsZE5vZGVzW2ldLm5vZGVOYW1lKSB7XG4gICAgICAgICAgLy8gQWRkIHRvIHRoZSBwYXRjaGVzLlxuICAgICAgICAgIHBhdGNoZXMucHVzaCh7XG4gICAgICAgICAgICBfX2RvX186IDEsXG4gICAgICAgICAgICBvbGQ6IHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0uZWxlbWVudCxcbiAgICAgICAgICAgIG5ldzogY2hpbGROb2Rlc1tpXS5lbGVtZW50XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjaGlsZE5vZGVzW2ldLl9fc2tpcF9fID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGludGVybmFsIHRyZWUncyBwb2ludCBvZiB2aWV3IG9mIHRoaXMgZWxlbWVudC5cbiAgICAgICAgICB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzW2ldID0gY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgYWxsIGNoaWxkcmVuIGlmIHRoZSBuZXcgbGl2ZSBub2RlIGhhcyBub25lLlxuICAgIGVsc2UgaWYgKG9sZENoaWxkTm9kZXNMZW5ndGggJiYgIW5ld0NoaWxkTm9kZXNMZW5ndGgpIHtcbiAgICAgIHBhdGNoZXMucHVzaCh7IF9fZG9fXzogLTEsIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQgfSk7XG4gICAgICB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLnNwbGljZSgwLCBvbGRDaGlsZE5vZGVzTGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBTeW5jaHJvbml6ZSBhdHRyaWJ1dGVzXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBsaXZlTm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgIHZhciBvbGRMZW5ndGggPSB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICAgIHZhciBuZXdMZW5ndGggPSBsaXZlTm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDtcblxuICAgICAgLy8gU3RhcnQgd2l0aCB0aGUgbW9zdCBjb21tb24sIGFkZGl0aXZlLlxuICAgICAgaWYgKG5ld0xlbmd0aCA+IG9sZExlbmd0aCkge1xuICAgICAgICB2YXIgdG9BZGQgPSBzbGljZS5jYWxsKGxpdmVOb2RlLmF0dHJpYnV0ZXMsIG9sZExlbmd0aCAtIDEpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9BZGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgICAgIG5hbWU6IHRvQWRkW2ldLm5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogdG9BZGRbaV0udmFsdWUsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIFB1c2ggdGhlIGNoYW5nZSBvYmplY3QgZGlyZWN0bHkgaW50byB0aGUgdmlydHVhbCB0cmVlLCB0aGUgYF9fZG9fX2BcbiAgICAgICAgICAvLyBwcm9wZXJ0eSB3b24ndCBiZSBpbnNwZWN0ZWQgYnkgYW55dGhpbmcgc28gd2Ugc2F2ZSBvbiB0b3RhbCAjIG9mXG4gICAgICAgICAgLy8gb2JqZWN0cyBjcmVhdGVkLlxuICAgICAgICAgIHZhciBpbmRleCA9IHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXMucHVzaChjaGFuZ2UpO1xuXG4gICAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGZvciByZW1vdmFscy5cbiAgICAgIGlmIChvbGRMZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbCh2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLCBuZXdMZW5ndGgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgICAgIG5hbWU6IHRvUmVtb3ZlW2ldLm5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZSBmcm9tIHRoZSB2aXJ0dWFsIG5vZGUuXG4gICAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlcy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgICAgcGF0Y2hlcy5wdXNoKGNoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIG1vZGlmaWNhdGlvbnMuXG4gICAgICB2YXIgdG9Nb2RpZnkgPSBzbGljZS5jYWxsKGxpdmVOb2RlLmF0dHJpYnV0ZXMpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvTW9kaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9Nb2RpZnlbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9Nb2RpZnlbaV0udmFsdWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gT25seSBwdXNoIGluIGEgY2hhbmdlIGlmIHRoZSBhdHRyaWJ1dGUgb3IgdmFsdWUgY2hhbmdlcy5cbiAgICAgICAgaWYgKHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gbGl2ZU5vZGUuYXR0cmlidXRlc1tpXS5uYW1lIHx8XG4gICAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlc1tpXS52YWx1ZSAhPT0gbGl2ZU5vZGUuYXR0cmlidXRlc1tpXS52YWx1ZSkge1xuXG4gICAgICAgICAgLy8gUmVwbGFjZSB0aGUgYXR0cmlidXRlIGluIHRoZSB2aXJ0dWFsIG5vZGUuXG4gICAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlcy5zcGxpY2UoaSwgMSwgY2hhbmdlKTtcblxuICAgICAgICAgIC8vIEFkZCB0aGUgY2hhbmdlIHRvIHRoZSBzZXJpZXMgb2YgcGF0Y2hlcy5cbiAgICAgICAgICBwYXRjaGVzLnB1c2goY2hhbmdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN5bmMgZWFjaCBjdXJyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWNoaWxkTm9kZXNbaV0uX19za2lwX18pIHtcbiAgICAgICAgc3luY05vZGUuY2FsbChwYXRjaGVzLCB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzW2ldLCBjaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWxldGUgY2hpbGROb2Rlc1tpXS5fX3NraXBfXztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgdmlydHVhbFRyZWUgPSBudWxsO1xuXG4gIHNlbGYub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBwYXRjaGVzID0gW107XG4gICAgdmFyIHN5bmNSZXF1ZXN0ID0gZS5kYXRhO1xuXG4gICAgaWYgKHN5bmNSZXF1ZXN0WzFdKSB7IHZpcnR1YWxUcmVlID0gc3luY1JlcXVlc3RbMV07IH1cblxuICAgIC8vIENyZWF0ZSBhIGxpdmUgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5ldyBtYXJrdXAuXG4gICAgdmFyIGxpdmVUcmVlID0gc3luY1JlcXVlc3RbMF07XG5cbiAgICAvLyBTeW5jaHJvbml6ZSB0aGUgZWxlbWVudCB2aXJ0dWFsIHRyZWUgd2l0aCB0aGUgbmV3IGxpdmUgZWxlbWVudCB0cmVlLiAgVGhpc1xuICAgIC8vIHdpbGwgcHJvZHVjZSBhIHNlcmllcyBvZiBwYXRjaGVzIHRoYXQgd2lsbCBiZSBleGN1dGVkIHRvIHVwZGF0ZSB0aGUgRE9NLlxuICAgIHN5bmNOb2RlLmNhbGwocGF0Y2hlcywgdmlydHVhbFRyZWUsIGxpdmVUcmVlKTtcblxuICAgIHNlbGYucG9zdE1lc3NhZ2UocGF0Y2hlcyk7XG4gIH07XG59O1xuIl19
