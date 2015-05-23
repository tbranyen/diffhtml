(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diffhtml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var humanizeNodeType = {
  1: 'tag',
  2: 'attribute',
  3: 'text',
  4: 'cdata',
  8: 'comment'
};

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

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = {
    type: type,
    element: node,
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

window.makeNode = module.exports = makeNode;

},{}],2:[function(require,module,exports){
var DOMParser = require('../util/dom_parser');
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

  // Create a live representation of the new markup.
  var liveTree = makeNode(parseHTML(newHTML));
  var patches = [];

  // Synchronize the element virtual tree with the new live element tree.  This
  // will produce a series of patches that will be excuted to update the DOM.
  syncNode.call(patches, element.__tree__, liveTree);

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
      if (patch.element && patch.new && !patch.old) {
        patch.element.appendChild(patch.new);
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
}

module.exports = patch;

},{"../util/dom_parser":5,"../util/parse_html":6,"./make_node":1,"./sync_node":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var patch = require('./diff/patch');

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patch(this, newHTML);
  }
});

},{"./diff/patch":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
var DOMParser = window.DOMParser || function() {};
var parser = new DOMParser();

function parseHTML(markup) {
  return parser.parseFromString(markup, 'text/html').documentElement;
}

module.exports = parseHTML;

},{}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZGlmZi9tYWtlX25vZGUuanMiLCJsaWIvZGlmZi9wYXRjaC5qcyIsImxpYi9kaWZmL3N5bmNfbm9kZS5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlsL2RvbV9wYXJzZXIuanMiLCJsaWIvdXRpbC9wYXJzZV9odG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaHVtYW5pemVOb2RlVHlwZSA9IHtcbiAgMTogJ3RhZycsXG4gIDI6ICdhdHRyaWJ1dGUnLFxuICAzOiAndGV4dCcsXG4gIDQ6ICdjZGF0YScsXG4gIDg6ICdjb21tZW50J1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGxpdmUgbm9kZSBpbnRvIGEgdmlydHVhbCBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlXG4gKiBAcmV0dXJuXG4gKi9cbmZ1bmN0aW9uIG1ha2VOb2RlKG5vZGUpIHtcbiAgLy8gSWYgdGhpcyBub2RlIGhhcyBhbHJlYWR5IGJlZW4gY29udmVydGVkLCBkbyBub3QgYXR0ZW1wdCB0byBjb252ZXJ0IGFnYWluLlxuICBpZiAobm9kZSAmJiBub2RlLm5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5ub2RlO1xuICB9XG5cbiAgLy8gR2V0IGEgaHVtYW5pemVkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgbm9kZVR5cGVgLlxuICB2YXIgdHlwZSA9IGh1bWFuaXplTm9kZVR5cGVbbm9kZS5ub2RlVHlwZV07XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgZm91bmQgaXMgaXJyZWxldmFudCBmb3Igb3VyIHVzZXMsIHNraXAgaXQuXG4gIGlmICghdHlwZSB8fCB0eXBlID09PSAnYXR0cmlidXRlJyB8fCB0eXBlID09PSAnY2RhdGEnIHx8IHR5cGUgPT09ICdjb21tZW50Jykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFNraXAgb3ZlciBlbXB0eSB0ZXh0IG5vZGVzLlxuICBlbHNlIGlmICh0eXBlID09PSAndGV4dCcgJiYgIW5vZGUubm9kZVZhbHVlLnRyaW0oKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFZpcnR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBub2RlLCBjb250YWluaW5nIG9ubHkgdGhlIGRhdGEgd2Ugd2lzaCB0b1xuICAvLyBkaWZmIGFuZCBwYXRjaC5cbiAgdmFyIGVudHJ5ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZWxlbWVudDogbm9kZSxcbiAgICBub2RlTmFtZTogbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgIG5vZGVWYWx1ZTogbm9kZS5ub2RlVmFsdWUsXG4gICAgYXR0cmlidXRlczogW10sXG4gICAgZGF0YXNldDogW10sXG4gICAgc3R5bGU6IFtdLFxuICAgIGNoaWxkTm9kZXM6IFtdLFxuICB9O1xuXG4gIC8vIENvbGxlY3QgYXR0cmlidXRlcy5cbiAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIG5vIGF0dHJpYnV0ZXMsIHNraXAgb3Zlci5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgYXR0cmlidXRlc0xlbmd0aCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXNMZW5ndGgpIHtcbiAgICAgIC8vIENvcHkgYWxsIGF0dHJpYnV0ZSB2YWx1ZXMgaW50byB0aGUgYXR0cmlidXRlcyBvYmplY3QuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXNMZW5ndGg7IGkrKykge1xuICAgICAgICBlbnRyeS5hdHRyaWJ1dGVzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGF0dHJpYnV0ZXNbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlc1tpXS52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29sbGVjdCBjaGlsZE5vZGVzLlxuICB2YXIgY2hpbGROb2RlcyA9IG5vZGUuY2hpbGROb2RlcztcblxuICAvLyBJZiB0aGUgZWxlbWVudCBoYXMgY2hpbGQgbm9kZXMsIGNvbnZlcnQgdGhlbSBhbGwgdG8gdmlydHVhbCBub2Rlcy5cbiAgaWYgKHR5cGUgIT09ICd0ZXh0JyAmJiBjaGlsZE5vZGVzKSB7XG4gICAgZW50cnkuY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChjaGlsZE5vZGVzLCBtYWtlTm9kZSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gIH1cblxuICAvLyBBbHNvIGF0dGFjaCB0byB0aGUgYWN0dWFsIGVsZW1lbnQuXG4gIG5vZGUubm9kZSA9IGVudHJ5O1xuXG4gIHJldHVybiBlbnRyeTtcbn1cblxud2luZG93Lm1ha2VOb2RlID0gbW9kdWxlLmV4cG9ydHMgPSBtYWtlTm9kZTtcbiIsInZhciBET01QYXJzZXIgPSByZXF1aXJlKCcuLi91dGlsL2RvbV9wYXJzZXInKTtcbnZhciBwYXJzZUhUTUwgPSByZXF1aXJlKCcuLi91dGlsL3BhcnNlX2h0bWwnKTtcbnZhciBtYWtlTm9kZSA9IHJlcXVpcmUoJy4vbWFrZV9ub2RlJyk7XG52YXIgc3luY05vZGUgPSByZXF1aXJlKCcuL3N5bmNfbm9kZScpO1xuXG4vKipcbiAqIFBhdGNoZXMgYW4gZWxlbWVudCdzIERPTSB0byBtYXRjaCB0aGF0IG9mIHRoZSBwYXNzZWQgbWFya3VwLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbmV3SFRNTFxuICovXG5mdW5jdGlvbiBwYXRjaChlbGVtZW50LCBuZXdIVE1MKSB7XG4gIC8vIFRoaXMgaXMgY2FsbGVkIG9uZSB0aW1lIHRvIHByb2R1Y2UgdGhlIHZpcnR1YWwgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgLy8gbGl2ZSBlbGVtZW50IHRyZWUuICBXZSBhdHRhY2ggdGhpcyBkaXJlY3RseSB0byB0aGUgZWxlbWVudCwgYmVjYXVzZSB3ZSdyZVxuICAvLyBmZWFybGVzcyBsaWtlIHRoYXQuXG4gIGlmICghZWxlbWVudC5fX3RyZWVfXykgeyBlbGVtZW50Ll9fdHJlZV9fID0gbWFrZU5vZGUoZWxlbWVudCk7IH1cblxuICAvLyBDcmVhdGUgYSBsaXZlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBuZXcgbWFya3VwLlxuICB2YXIgbGl2ZVRyZWUgPSBtYWtlTm9kZShwYXJzZUhUTUwobmV3SFRNTCkpO1xuICB2YXIgcGF0Y2hlcyA9IFtdO1xuXG4gIC8vIFN5bmNocm9uaXplIHRoZSBlbGVtZW50IHZpcnR1YWwgdHJlZSB3aXRoIHRoZSBuZXcgbGl2ZSBlbGVtZW50IHRyZWUuICBUaGlzXG4gIC8vIHdpbGwgcHJvZHVjZSBhIHNlcmllcyBvZiBwYXRjaGVzIHRoYXQgd2lsbCBiZSBleGN1dGVkIHRvIHVwZGF0ZSB0aGUgRE9NLlxuICBzeW5jTm9kZS5jYWxsKHBhdGNoZXMsIGVsZW1lbnQuX190cmVlX18sIGxpdmVUcmVlKTtcblxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBwYXRjaGVzIGFuZCBhcHBseSB0aGVtLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGF0Y2ggPSBwYXRjaGVzW2ldO1xuXG4gICAgLy8gUXVpY2tseSBlbXB0eSBlbnRpcmUgY2hpbGROb2Rlcy5cbiAgICBpZiAocGF0Y2guX19kb19fID09PSAtMSkge1xuICAgICAgcGF0Y2guZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIE5vZGUgbWFuaXAuXG4gICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAxKSB7XG4gICAgICAvLyBBZGQuXG4gICAgICBpZiAocGF0Y2guZWxlbWVudCAmJiBwYXRjaC5uZXcgJiYgIXBhdGNoLm9sZCkge1xuICAgICAgICBwYXRjaC5lbGVtZW50LmFwcGVuZENoaWxkKHBhdGNoLm5ldyk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZVxuICAgICAgZWxzZSBpZiAocGF0Y2gub2xkICYmICFwYXRjaC5uZXcpIHtcbiAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlbW92ZSB0aGUgZG9jdW1lbnQgZWxlbWVudCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGF0Y2gub2xkKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVwbGFjZVxuICAgICAgZWxzZSBpZiAocGF0Y2gub2xkICYmIHBhdGNoLm5ldykge1xuICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVwbGFjZSB0aGUgZG9jdW1lbnQgZWxlbWVudCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoLm5ldywgcGF0Y2gub2xkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdHRyaWJ1dGUgbWFuaXB1bGF0aW9uLlxuICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMikge1xuICAgICAgLy8gUmVtb3ZlLlxuICAgICAgaWYgKCFwYXRjaC52YWx1ZSkgeyBwYXRjaC5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShwYXRjaC5uYW1lKTsgfVxuICAgICAgZWxzZSB7IHBhdGNoLmVsZW1lbnQuc2V0QXR0cmlidXRlKHBhdGNoLm5hbWUsIHBhdGNoLnZhbHVlKTsgfVxuICAgIH1cblxuICAgIC8vIFRleHQgbm9kZSBtYW5pcHVsYXRpb24uXG4gICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAzKSB7XG4gICAgICBwYXRjaC5lbGVtZW50Lm5vZGVWYWx1ZSA9IHBhdGNoLnZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoO1xuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBzeW5jTm9kZSh2aXJ0dWFsTm9kZSwgbGl2ZU5vZGUpIHtcbiAgdmFyIHBhdGNoZXMgPSB0aGlzO1xuXG4gIC8vIEZvciBub3cgYWx3YXlzIHN5bmMgdGhlIGNoaWxkcmVuLiAgSW4gdGhlIGZ1dHVyZSB3ZSdsbCBiZSBzbWFydGVyIGFib3V0XG4gIC8vIHdoZW4gdGhpcyBpcyBuZWNlc3NhcnkuXG4gIHZhciBjaGlsZE5vZGVzID0gbGl2ZU5vZGUuY2hpbGROb2RlcztcbiAgdmFyIG5ld0NoaWxkTm9kZXNMZW5ndGggPSBjaGlsZE5vZGVzLmxlbmd0aDtcbiAgdmFyIG9sZENoaWxkTm9kZXNMZW5ndGggPSB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAvLyBSZXBsYWNlIHRleHQgbm9kZXMgaWYgdGhlaXIgdmFsdWVzIGFyZSBkaWZmZXJlbnQuXG4gIGlmIChsaXZlTm9kZS50eXBlID09PSAndGV4dCcgJiYgdmlydHVhbE5vZGUudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgLy8gVGV4dCBjaGFuZ2VkLlxuICAgIGlmIChsaXZlTm9kZS5ub2RlVmFsdWUgIT09IHZpcnR1YWxOb2RlLm5vZGVWYWx1ZSkge1xuICAgICAgdmlydHVhbE5vZGUubm9kZVZhbHVlID0gbGl2ZU5vZGUubm9kZVZhbHVlO1xuXG4gICAgICBwYXRjaGVzLnB1c2goe1xuICAgICAgICBfX2RvX186IDMsXG4gICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgIHZhbHVlOiBsaXZlTm9kZS5ub2RlVmFsdWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gTW9zdCBjb21tb24gYWRkaXRpdmUgZWxlbWVudHMuXG4gICAgaWYgKG5ld0NoaWxkTm9kZXNMZW5ndGggPiBvbGRDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgICAvLyBFbGVtZW50cyB0byBhZGQuXG4gICAgICB2YXIgdG9BZGQgPSBzbGljZS5jYWxsKGNoaWxkTm9kZXMsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuICAgICAgLy8gU3RvcmUgZWxlbWVudHMgaW4gYSBEb2N1bWVudEZyYWdtZW50IHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGFuZCBiZVxuICAgICAgLy8gZ2VuZXJhbGx5IHNpbXBsaWVyIHRvIHdvcmsgd2l0aC5cbiAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IG9sZENoaWxkTm9kZXNMZW5ndGg7IGkgPCBuZXdDaGlsZE5vZGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gSW50ZXJuYWxseSBhZGQgdG8gdGhlIHRyZWUuXG4gICAgICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMucHVzaChjaGlsZE5vZGVzW2ldKTtcblxuICAgICAgICBjaGlsZE5vZGVzW2ldLl9fc2tpcF9fID0gdHJ1ZTtcblxuICAgICAgICAvLyBBZGQgdG8gdGhlIGRvY3VtZW50IGZyYWdtZW50LlxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZE5vZGVzW2ldLmVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZnJhZ21lbnQubGVuZ3RoID09PSAwKSB7IHRocm93IG5ldyBFcnJvcihcIndoYXRcIik7IH1cblxuICAgICAgLy8gQXNzaWduIHRoZSBmcmFnbWVudCB0byB0aGUgcGF0Y2hlcyB0byBiZSBpbmplY3RlZC5cbiAgICAgIHBhdGNoZXMucHVzaCh7IF9fZG9fXzogMSwgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCwgbmV3OiBmcmFnbWVudCB9KTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlc2UgZWxlbWVudHMuXG4gICAgaWYgKG9sZENoaWxkTm9kZXNMZW5ndGggPiBuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgICAvLyBFbGVtZW50cyB0byByZW1vdmUuXG4gICAgICB2YXIgdG9SZW1vdmUgPSBzbGljZS5jYWxsKHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMsIC0xICogKG9sZENoaWxkTm9kZXNMZW5ndGggLSBuZXdDaGlsZE5vZGVzTGVuZ3RoKSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBlbGVtZW50LCB0aGlzIGhhcHBlbnMgYmVmb3JlIHRoZSBzcGxpY2Ugc28gdGhhdCB3ZSBzdGlsbFxuICAgICAgICAvLyBoYXZlIGFjY2VzcyB0byB0aGUgZWxlbWVudC5cbiAgICAgICAgcGF0Y2hlcy5wdXNoKHsgX19kb19fOiAxLCBvbGQ6IHRvUmVtb3ZlW2ldLmVsZW1lbnQgfSk7XG4gICAgICB9XG5cbiAgICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMuc3BsaWNlKG5ld0NoaWxkTm9kZXNMZW5ndGgsIG9sZENoaWxkTm9kZXNMZW5ndGggLSBuZXdDaGlsZE5vZGVzTGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIGVsZW1lbnRzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld0NoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0ubm9kZU5hbWUgIT09IGNoaWxkTm9kZXNbaV0ubm9kZU5hbWUpIHtcbiAgICAgICAgLy8gQWRkIHRvIHRoZSBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzLnB1c2goe1xuICAgICAgICAgIF9fZG9fXzogMSxcbiAgICAgICAgICBvbGQ6IHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0uZWxlbWVudCxcbiAgICAgICAgICBuZXc6IGNoaWxkTm9kZXNbaV0uZWxlbWVudFxuICAgICAgICB9KTtcblxuICAgICAgICBjaGlsZE5vZGVzW2ldLl9fc2tpcF9fID0gdHJ1ZTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBpbnRlcm5hbCB0cmVlJ3MgcG9pbnQgb2YgdmlldyBvZiB0aGlzIGVsZW1lbnQuXG4gICAgICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0gPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBSZW1vdmUgYWxsIGNoaWxkcmVuIGlmIHRoZSBuZXcgbGl2ZSBub2RlIGhhcyBub25lLlxuICBlbHNlIGlmIChvbGRDaGlsZE5vZGVzTGVuZ3RoICYmICFuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgcGF0Y2hlcy5wdXNoKHsgX19kb19fOiAtMSwgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCB9KTtcbiAgICB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLnNwbGljZSgwLCBvbGRDaGlsZE5vZGVzTGVuZ3RoKTtcbiAgfVxuXG4gIC8vIFN5bmNocm9uaXplIGF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZXMgPSBsaXZlTm9kZS5hdHRyaWJ1dGVzO1xuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIG9sZExlbmd0aCA9IHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXMubGVuZ3RoO1xuICAgIHZhciBuZXdMZW5ndGggPSBsaXZlTm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDtcblxuICAgIC8vIFN0YXJ0IHdpdGggdGhlIG1vc3QgY29tbW9uLCBhZGRpdGl2ZS5cbiAgICBpZiAobmV3TGVuZ3RoID4gb2xkTGVuZ3RoKSB7XG4gICAgICB2YXIgdG9BZGQgPSBzbGljZS5jYWxsKGxpdmVOb2RlLmF0dHJpYnV0ZXMsIG9sZExlbmd0aCAtIDEpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9BZGRbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9BZGRbaV0udmFsdWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUHVzaCB0aGUgY2hhbmdlIG9iamVjdCBkaXJlY3RseSBpbnRvIHRoZSB2aXJ0dWFsIHRyZWUsIHRoZSBgX19kb19fYFxuICAgICAgICAvLyBwcm9wZXJ0eSB3b24ndCBiZSBpbnNwZWN0ZWQgYnkgYW55dGhpbmcgc28gd2Ugc2F2ZSBvbiB0b3RhbCAjIG9mXG4gICAgICAgIC8vIG9iamVjdHMgY3JlYXRlZC5cbiAgICAgICAgdmFyIGluZGV4ID0gdmlydHVhbE5vZGUuYXR0cmlidXRlcy5wdXNoKGNoYW5nZSk7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzLnB1c2goY2hhbmdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgcmVtb3ZhbHMuXG4gICAgaWYgKG9sZExlbmd0aCA+IG5ld0xlbmd0aCkge1xuICAgICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbCh2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLCBuZXdMZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9SZW1vdmVbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlcy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzLnB1c2goY2hhbmdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbW9kaWZpY2F0aW9ucy5cbiAgICB2YXIgdG9Nb2RpZnkgPSBzbGljZS5jYWxsKGxpdmVOb2RlLmF0dHJpYnV0ZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b01vZGlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgX19kb19fOiAyLFxuICAgICAgICBlbGVtZW50OiB2aXJ0dWFsTm9kZS5lbGVtZW50LFxuICAgICAgICBuYW1lOiB0b01vZGlmeVtpXS5uYW1lLFxuICAgICAgICB2YWx1ZTogdG9Nb2RpZnlbaV0udmFsdWUsXG4gICAgICB9O1xuXG4gICAgICAvLyBPbmx5IHB1c2ggaW4gYSBjaGFuZ2UgaWYgdGhlIGF0dHJpYnV0ZSBvciB2YWx1ZSBjaGFuZ2VzLlxuICAgICAgaWYgKHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXNbaV0ubmFtZSAhPT0gbGl2ZU5vZGUuYXR0cmlidXRlc1tpXS5uYW1lIHx8XG4gICAgICAgIHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXNbaV0udmFsdWUgIT09IGxpdmVOb2RlLmF0dHJpYnV0ZXNbaV0udmFsdWUpIHtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBhdHRyaWJ1dGUgaW4gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlcy5zcGxpY2UoaSwgMSwgY2hhbmdlKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmMgZWFjaCBjdXJyZW50IG5vZGUuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlydHVhbE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghY2hpbGROb2Rlc1tpXS5fX3NraXBfXykge1xuICAgICAgc3luY05vZGUuY2FsbChwYXRjaGVzLCB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzW2ldLCBjaGlsZE5vZGVzW2ldKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWxldGUgY2hpbGROb2Rlc1tpXS5fX3NraXBfXztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzeW5jTm9kZTtcbiIsInZhciBwYXRjaCA9IHJlcXVpcmUoJy4vZGlmZi9wYXRjaCcpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdvdXRlckRpZmZIVE1MJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgc2V0OiBmdW5jdGlvbihuZXdIVE1MKSB7XG4gICAgcGF0Y2godGhpcywgbmV3SFRNTCk7XG4gIH1cbn0pO1xuIiwiLyohIEBzb3VyY2UgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTEyOTAzMSAqL1xuXG52YXIgRE9NUGFyc2VyID0gd2luZG93LkRPTVBhcnNlciB8fCBmdW5jdGlvbigpIHt9O1xudmFyIERPTVBhcnNlcl9wcm90byA9IERPTVBhcnNlci5wcm90b3R5cGU7XG52YXIgcmVhbF9wYXJzZUZyb21TdHJpbmcgPSBET01QYXJzZXJfcHJvdG8ucGFyc2VGcm9tU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTVBhcnNlcjtcblxuLy8gRmlyZWZveC9PcGVyYS9JRSB0aHJvdyBlcnJvcnMgb24gdW5zdXBwb3J0ZWQgdHlwZXNcbnRyeSB7XG4gIC8vIFdlYktpdCByZXR1cm5zIG51bGwgb24gdW5zdXBwb3J0ZWQgdHlwZXNcbiAgaWYgKChuZXcgRE9NUGFyc2VyKS5wYXJzZUZyb21TdHJpbmcoXCJcIiwgXCJ0ZXh0L2h0bWxcIikpIHtcbiAgICAvLyB0ZXh0L2h0bWwgcGFyc2luZyBpcyBuYXRpdmVseSBzdXBwb3J0ZWRcbiAgICByZXR1cm47XG4gIH1cbn0gY2F0Y2ggKHVuaGFuZGxlZEV4Y2VwdGlvbikge31cblxuRE9NUGFyc2VyX3Byb3RvLnBhcnNlRnJvbVN0cmluZyA9IGZ1bmN0aW9uKG1hcmt1cCwgdHlwZSkge1xuICBpZiAoIS9eXFxzKnRleHRcXC9odG1sXFxzKig/Ojt8JCkvaS50ZXN0KHR5cGUpKSB7XG4gICAgcmV0dXJuIHJlYWxfcGFyc2VGcm9tU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICB2YXIgZG9jID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFwiXCIpO1xuICB2YXIgZG9jX2VsdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciBmaXJzdF9lbHQ7XG5cbiAgZG9jX2VsdC5pbm5lckhUTUwgPSBtYXJrdXA7XG4gIGZpcnN0X2VsdCA9IGRvY19lbHQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgaWYgKGRvY19lbHQuY2hpbGRFbGVtZW50Q291bnQgPT09IDFcbiAgICAmJiBmaXJzdF9lbHQubG9jYWxOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaHRtbFwiKSB7XG4gICAgZG9jLnJlcGxhY2VDaGlsZChmaXJzdF9lbHQsIGRvY19lbHQpO1xuICB9XG5cbiAgcmV0dXJuIGRvYztcbn07XG4iLCJ2YXIgRE9NUGFyc2VyID0gd2luZG93LkRPTVBhcnNlciB8fCBmdW5jdGlvbigpIHt9O1xudmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblxuZnVuY3Rpb24gcGFyc2VIVE1MKG1hcmt1cCkge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhtYXJrdXAsICd0ZXh0L2h0bWwnKS5kb2N1bWVudEVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VIVE1MO1xuIl19
