(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diffhtml = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var makeNode = require('./make_node');
var svg = require('./svg');

function makeElement(descriptor) {
  var element = null;
  var isSvg = false;

  if (descriptor.nodeName === '#text') {
    element = document.createTextNode(descriptor.nodeValue);
  }
  else {
    if (svg.elements.indexOf(descriptor.nodeName) > -1) {
      isSvg = true;
      element = document.createElementNS(svg.namespace, descriptor.nodeName);
    }
    else {
      element = document.createElement(descriptor.nodeName);
    }

    if (descriptor.attributes && descriptor.attributes.length) {
      for (var i = 0; i < descriptor.attributes.length; i++) {
        var attribute = descriptor.attributes[i];
        if (isSvg) {
          element.setAttributeNS(null, attribute.name, attribute.value);
        }
        else {
          element.setAttribute(attribute.name, attribute.value);
        }
      }
    }

    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (var i = 0; i < descriptor.childNodes.length; i++) {
        element.appendChild(makeElement(descriptor.childNodes[i]));
      }
    }
  }

  // Add to the nodes cache using the designated id.
  makeNode.nodes[descriptor.element] = element;

  return element;
}

module.exports = makeElement;

},{"./make_node":2,"./svg":4}],2:[function(require,module,exports){
var pools = require('../util/pools');
var push = Array.prototype.push;

var nodes = makeNode.nodes = {};

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
  var entry = {};

  // Cache the element in the ids.
  var id = pools.uuid.get();

  // Add to internal lookup.
  nodes[id] = node;

  // Save a reference to this object.
  node.__node__ = entry;

  entry.element = id;
  entry.nodeName = node.nodeName.toLowerCase();
  entry.nodeValue = nodeValue;
  entry.childNodes = [];
  entry.attributes = [];

  // Collect attributes.
  var attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    var attributesLength = attributes.length;

    if (attributesLength) {
      for (var i = 0; i < attributesLength; i++) {
        push.call(entry.attributes, {
          name: attributes[i].name,
          value: attributes[i].value
        });
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

},{"../util/pools":10}],3:[function(require,module,exports){
var pools = require('../util/pools');
var poolCount = 10000;

// Initialize with a reasonable amount of objects.
pools.initialize(poolCount);

var htmls = require('../util/htmls');
var parser = require('../util/parser');
var buffers = require('../util/buffers');
var syncNode = require('./sync_node');
var makeNode = require('./make_node');
var makeElement = require('./make_element');

var hasWorker = typeof Worker === 'function';
var oldTree = null;
var isRendering = false;
var synced = false;

// Set up a WebWorker if available.
if (hasWorker) {
  // Construct the worker reusing code already organized into modules.
  var workerBlob = new Blob([
    [
      // Reusable Array methods.
      'var slice = Array.prototype.slice;',
      'var filter = Array.prototype.filter;',

      // Add a namespace to attach pool methods to.
      'var pools = {};',
      'var nodes = 0;',

      // Adds in a global `uuid` function.
      require('../util/uuid'),

      // Add in pool manipulation methods.
      pools.create,
      pools.initialize,
      'initializePools(' + poolCount + ');',

      // Add in Node manipulation.
      syncNode.filter,
      syncNode.sync,

      // Add in the ability to parseHTML.
      htmls.parseHTML,

      // Give the webworker utilities.
      buffers.stringToBuffer,
      buffers.bufferToString,

      parser.makeParser,
      'var parser = makeParser();',

      // Add in the worker source.
      require('../worker'),

      // Metaprogramming up this worker call.
      'startup(self);'
    ].join('\n')
  ], { type: 'application/javascript' });

  // Construct the worker and start it up.
  var worker = new Worker(URL.createObjectURL(workerBlob));
}

function getElement(ref) {
  var element = ref.element || ref;

  // Already created.
  if (element in makeNode.nodes) {
    return makeNode.nodes[element];
  }
  // Need to create.
  else {
    return makeElement(ref);
  }
}

/**
 * Processes an Array of patches.
 *
 * @param e
 * @return
 */
function processPatches(e) {
  var patches = e.data;
  var isInner = e.isInner;

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    var patch = patches[i];

    if (patch.element) {
      patch.element = getElement(patch.element);
      var elementId = patch.element;
    }

    if (patch.old) {
      patch.old = getElement(patch.old);
      var oldId = patch.old.element;
    }

    if (patch.new) {
      patch.new = getElement(patch.new);
      var newId = patch.new.element;
    }

    // Quickly empty entire childNodes.
    if (patch.__do__ === -1) {
      patch.element.innerHTML = '';
      continue;
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        var fragment = document.createDocumentFragment();

        patch.fragment.forEach(function(element) {
          fragment.appendChild(getElement(element));
        });

        patch.element.appendChild(fragment);
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        patch.old.parentNode.removeChild(patch.old);
        makeNode.nodes[oldId] = null;
        delete makeNode.nodes[oldId];
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        patch.old.parentNode.replaceChild(patch.new, patch.old);

        makeNode.nodes[oldId] = null;
        delete makeNode.nodes[oldId];
      }
    }

    // Attribute manipulation.
    else if (!isInner && patch.__do__ === 2) {
      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }
    }

    // Text node manipulation.
    else if (!isInner && patch.__do__ === 3) {
      patch.element.nodeValue = patch.value;
    }
  }
}

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML, isInner) {
  if (isRendering) { return; }

  // Attach all properties here to transport.
  var transferObject = {};

  // Only calculate the parent's initial state one time.
  if (!oldTree) {
    oldTree = makeNode(element);
    transferObject.oldTree = oldTree;
    element.__source__ = newHTML;
  }
  // Same markup being applied, early exit.
  else if (element.__source__ === newHTML) {
    return;
  }

  // Optionally disable workers.
  hasWorker = !Boolean(document.DISABLE_WORKER);

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (hasWorker && element.__has_rendered__) {
    // First time syncing needs the current tree.
    if (!synced) {
      transferObject.oldTree = oldTree;
    }

    synced = true;

    var start = Date.now();

    // Used to specify the outerHTML offset if passing the parent's markup.
    var offset = 0;

    // Craft a new buffer with the new contents.
    var newBuffer = buffers.stringToBuffer(newHTML);

    // Set the offset to be this byte length.
    offset = newBuffer.byteLength;

    // Calculate the bytelength for the transfer buffer, contains one extra for
    // the offset.
    var transferByteLength = newBuffer.byteLength;

    // This buffer starts with the offset and contains the data to be carried
    // to the worker.
    var transferBuffer = new Uint16Array(transferByteLength);

    // Set the newHTML payload.
    transferBuffer.set(newBuffer, 0);

    // Add properties to send to worker.
    transferObject.offset = newBuffer.byteLength;
    transferObject.buffer = transferBuffer.buffer;
    transferObject.isInner = isInner;

    // Set a render lock as to not flood the worker.
    isRendering = true;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject, [transferBuffer.buffer]);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function(e) {
      processPatches(e);
      isRendering = false;
    };
  }
  else if (!hasWorker || !element.__has_rendered__) {
    var newTree = htmls.parseHTML(newHTML);
    var patches = [];

    // Synchronize the tree.
    syncNode.sync.call(patches, oldTree, newTree);

    // Attach inner state.
    patches.isInner = isInner;

    // Process the patches immediately.
    processPatches({ data: patches });

    // Clean out this array.
    patches.length = 0;

    // Mark this element as initially rendered.
    if (!element.__has_rendered__) {
      element.__has_rendered__ = true;
    }

    //pools.object.freeAll();
    //pools.array.freeAll();
    //pools.uuid.freeAll();
  }
}

module.exports = patch;

},{"../util/buffers":7,"../util/htmls":8,"../util/parser":9,"../util/pools":10,"../util/uuid":11,"../worker":12,"./make_element":1,"./make_node":2,"./sync_node":5}],4:[function(require,module,exports){
// List of SVG elements.
exports.elements = [
  'altGlyph',
  'altGlyphDef',
  'altGlyphItem',
  'animate',
  'animateColor',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'color-profile',
  'cursor',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'font',
  'font-face',
  'font-face-format',
  'font-face-name',
  'font-face-src',
  'font-face-uri',
  'foreignObject',
  'g',
  'glyph',
  'glyphRef',
  'hkern',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'missing-glyph',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'script',
  'set',
  'stop',
  'style',
  'svg',
  'switch',
  'symbol',
  'text',
  'textPath',
  'title',
  'tref',
  'tspan',
  'use',
  'view',
  'vkern',
];

// Namespace.
exports.namespace = 'http://www.w3.org/2000/svg';

},{}],5:[function(require,module,exports){
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

  if (!liveNode) {
    patches.push({ __do__: -1, element: virtualNode.element });

    virtualNode.childNodes.splice(0, oldChildNodesLength);
    return;
  }

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
      var toAdd = slice.call(attributes, oldLength);

      for (var i = 0; i < toAdd.length; i++) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toAdd[i].name,
          value: toAdd[i].value,
        };

        // Push the change object into into the virtual tree.
        virtualNode.attributes.push({
          name: toAdd[i].name,
          value: toAdd[i].value
        });

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
    var toModify = attributes;

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

},{"../util/pools":10}],6:[function(require,module,exports){
var patchNode = require('./diff/patch_node');

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML);
  }
});

Object.defineProperty(Element.prototype, 'innerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML, true);
  }
});

},{"./diff/patch_node":3}],7:[function(require,module,exports){
/**
 * stringToBuffer
 *
 * @param string
 * @return
 */
exports.stringToBuffer = function stringToBuffer(string) {
  var buffer = new Uint16Array(string.length);

  for (var i = 0; i < string.length; i++) {
    buffer[i] = string.codePointAt(i);
  }

  return buffer;
};

/**
 * bufferToString
 *
 * @param buffer
 * @return
 */
exports.bufferToString = function bufferToString(buffer) {
  var tmpBuffer = new Uint16Array(buffer, 0, buffer.length);
  var string = '';

  for (var i = 0; i < tmpBuffer.length; i++) {
    string += String.fromCodePoint(tmpBuffer[i]);
  }

  return string;
};

},{}],8:[function(require,module,exports){
var pools = require('./pools');
var parser = require('./parser').makeParser();

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
function parseHTML(newHTML) {
  return parser.parse(newHTML).childNodes[0];
}

window.parseHTML = exports.parseHTML = parseHTML;

},{"./parser":9,"./pools":10}],9:[function(require,module,exports){
(function (global){
var pools = require('./pools');

module.exports.makeParser = function makeParser() {
  var g = {};
  (function(f){g.htmlParser = f()})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof dynamicRequire=="function"&&dynamicRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof dynamicRequire=="function"&&dynamicRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(dynamicRequire,module,exports){
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }

  },{}],2:[function(dynamicRequire,module,exports){
  // shim for using process in browser

  var process = module.exports = {};
  var queue = [];
  var draining = false;

  function drainQueue() {
      if (draining) {
          return;
      }
      draining = true;
      var currentQueue;
      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          var i = -1;
          while (++i < len) {
              currentQueue[i]();
          }
          len = queue.length;
      }
      draining = false;
  }
  process.nextTick = function (fun) {
      queue.push(fun);
      if (!draining) {
          setTimeout(drainQueue, 0);
      }
  };

  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};

  function noop() {}

  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;

  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };

  // TODO(shtylman)
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };

  },{}],3:[function(dynamicRequire,module,exports){
  module.exports = function isBuffer(arg) {
    return arg && typeof arg === 'object'
      && typeof arg.copy === 'function'
      && typeof arg.fill === 'function'
      && typeof arg.readUInt8 === 'function';
  }
  },{}],4:[function(dynamicRequire,module,exports){
  (function (process,global){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  var formatRegExp = /%[sdj%]/g;
  exports.format = function(f) {
    if (!isString(f)) {
      var objects = [];
      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }
      return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
        default:
          return x;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }
    return str;
  };


  // Mark that a method should not be used.
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.
  exports.deprecate = function(fn, msg) {
    // Allow for deprecating things in the process of starting up.
    if (isUndefined(global.process)) {
      return function() {
        return exports.deprecate(fn, msg).apply(this, arguments);
      };
    }

    if (process.noDeprecation === true) {
      return fn;
    }

    var warned = false;
    function deprecated() {
      if (!warned) {
        if (process.throwDeprecation) {
          throw new Error(msg);
        } else if (process.traceDeprecation) {
          console.trace(msg);
        } else {
          console.error(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }

    return deprecated;
  };


  var debugs = {};
  var debugEnviron;
  exports.debuglog = function(set) {
    if (isUndefined(debugEnviron))
      debugEnviron = process.env.NODE_DEBUG || '';
    set = set.toUpperCase();
    if (!debugs[set]) {
      if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
        var pid = process.pid;
        debugs[set] = function() {
          var msg = exports.format.apply(exports, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function() {};
      }
    }
    return debugs[set];
  };


  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */
  /* legacy: obj, showHidden, depth, colors*/
  function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      exports._extend(ctx, opts);
    }
    // set default options
    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }
  exports.inspect = inspect;


  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  inspect.colors = {
    'bold' : [1, 22],
    'italic' : [3, 23],
    'underline' : [4, 24],
    'inverse' : [7, 27],
    'white' : [37, 39],
    'grey' : [90, 39],
    'black' : [30, 39],
    'blue' : [34, 39],
    'cyan' : [36, 39],
    'green' : [32, 39],
    'magenta' : [35, 39],
    'red' : [31, 39],
    'yellow' : [33, 39]
  };

  // Don't use 'blue' not visible on cmd.exe
  inspect.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  };


  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];

    if (style) {
      return '\u001b[' + inspect.colors[style][0] + 'm' + str +
             '\u001b[' + inspect.colors[style][1] + 'm';
    } else {
      return str;
    }
  }


  function stylizeNoColor(str, styleType) {
    return str;
  }


  function arrayToHash(array) {
    var hash = {};

    array.forEach(function(val, idx) {
      hash[val] = true;
    });

    return hash;
  }


  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }

    // Primitive types cannot have properties
    var primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }

    // Look up the keys of the object.
    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    }

    // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
    if (isError(value)
        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    }

    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }
      if (isError(value)) {
        return formatError(value);
      }
    }

    var base = '', array = false, braces = ['{', '}'];

    // Make Array say that they are Array
    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    }

    // Make functions say that they are functions
    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    }

    // Make RegExps say that they are RegExps
    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    }

    // Make error with message first say the error
    if (isError(value)) {
      base = ' ' + formatError(value);
    }

    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);

    var output;
    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }

    ctx.seen.pop();

    return reduceToSingleString(output, base, braces);
  }


  function formatPrimitive(ctx, value) {
    if (isUndefined(value))
      return ctx.stylize('undefined', 'undefined');
    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }
    if (isNumber(value))
      return ctx.stylize('' + value, 'number');
    if (isBoolean(value))
      return ctx.stylize('' + value, 'boolean');
    // For some reason typeof null is "object", so special case here.
    if (isNull(value))
      return ctx.stylize('null', 'null');
  }


  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }


  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            String(i), true));
      } else {
        output.push('');
      }
    }
    keys.forEach(function(key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            key, true));
      }
    });
    return output;
  }


  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function(line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function(line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify('' + key);
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'")
                   .replace(/\\"/g, '"')
                   .replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }

    return name + ': ' + str;
  }


  function reduceToSingleString(output, base, braces) {
    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return braces[0] +
             (base === '' ? '' : base + '\n ') +
             ' ' +
             output.join(',\n  ') +
             ' ' +
             braces[1];
    }

    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  }


  // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.
  function isArray(ar) {
    return Array.isArray(ar);
  }
  exports.isArray = isArray;

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }
  exports.isBoolean = isBoolean;

  function isNull(arg) {
    return arg === null;
  }
  exports.isNull = isNull;

  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports.isNullOrUndefined = isNullOrUndefined;

  function isNumber(arg) {
    return typeof arg === 'number';
  }
  exports.isNumber = isNumber;

  function isString(arg) {
    return typeof arg === 'string';
  }
  exports.isString = isString;

  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }
  exports.isSymbol = isSymbol;

  function isUndefined(arg) {
    return arg === void 0;
  }
  exports.isUndefined = isUndefined;

  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }
  exports.isRegExp = isRegExp;

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  exports.isObject = isObject;

  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }
  exports.isDate = isDate;

  function isError(e) {
    return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error);
  }
  exports.isError = isError;

  function isFunction(arg) {
    return typeof arg === 'function';
  }
  exports.isFunction = isFunction;

  function isPrimitive(arg) {
    return arg === null ||
           typeof arg === 'boolean' ||
           typeof arg === 'number' ||
           typeof arg === 'string' ||
           typeof arg === 'symbol' ||  // ES6 symbol
           typeof arg === 'undefined';
  }
  exports.isPrimitive = isPrimitive;

  exports.isBuffer = dynamicRequire('./support/isBuffer');

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }


  function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
  }


  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];

  // 26 Feb 16:19:34
  function timestamp() {
    var d = new Date();
    var time = [pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds())].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  }


  // log is just a thin wrapper to console.log that prepends a timestamp
  exports.log = function() {
    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
  };


  /**
   * Inherit the prototype methods from one constructor into another.
   *
   * The Function.prototype.inherits from lang.js rewritten as a standalone
   * function (not on Function.prototype). NOTE: If this file is to be loaded
   * during bootstrapping this function needs to be rewritten using some native
   * functions as prototype setup using normal JavaScript does not work as
   * expected during bootstrapping (see mirror.js in r114903).
   *
   * @param {function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {function} superCtor Constructor function to inherit prototype from.
   */
  exports.inherits = dynamicRequire('inherits');

  exports._extend = function(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  };

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  }).call(this,dynamicRequire('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"./support/isBuffer":3,"_process":2,"inherits":1}],5:[function(dynamicRequire,module,exports){
  module.exports={
    "name": "apollojs",
    "author": {
      "name": "Xiaoyi Shi",
      "email": "ashi009@gmail.com"
    },
    "description": "A framework to extend global objects with advance features.",
    "version": "1.3.0",
    "contributors": [
      {
        "name": "Yan Dong",
        "email": "idy0013@gmail.com"
      },
      {
        "name": "Steve Yang",
        "email": "me@iyyang.com"
      }
    ],
    "repository": {
      "type": "git",
      "url": "https://github.com/apollojs/apollojs.git"
    },
    "scripts": {
      "prepublish": "make clean server",
      "test": "mocha",
      "posttest": "mocha -R travis-cov",
      "coverage": "mocha -R html-cov > coverage.html",
      "start": "node server.js"
    },
    "main": "./server.js",
    "license": "MIT",
    "engines": {
      "node": ">=0.8"
    },
    "devDependencies": {
      "mocha": "*",
      "should": "*",
      "blanket": "*",
      "travis-cov": "*"
    },
    "config": {
      "blanket": {
        "pattern": "server.js"
      },
      "travis-cov": {
        "threshold": 70
      }
    },
    "bugs": {
      "url": "https://github.com/apollojs/apollojs/issues"
    },
    "homepage": "https://github.com/apollojs/apollojs",
    "_id": "apollojs@1.3.0",
    "_shasum": "5f7b00304d9740e2a7be5b52c7c0807d51f9255e",
    "_from": "apollojs@>=1.3.0 <2.0.0",
    "_npmVersion": "1.4.10",
    "_npmUser": {
      "name": "ashi009",
      "email": "ashi009@gmail.com"
    },
    "maintainers": [
      {
        "name": "ashi009",
        "email": "ashi009@gmail.com"
      }
    ],
    "dist": {
      "shasum": "5f7b00304d9740e2a7be5b52c7c0807d51f9255e",
      "tarball": "http://registry.npmjs.org/apollojs/-/apollojs-1.3.0.tgz"
    },
    "directories": {},
    "_resolved": "https://registry.npmjs.org/apollojs/-/apollojs-1.3.0.tgz"
  }

  },{}],6:[function(dynamicRequire,module,exports){
  (function (global){










  if (!global.$apollo) {



  /**
   * Extend an object with another object
   * @param  {Object} obj      object to be extended
   * @param  {Object} ext      extension object
   * @param  {bool} override   Overwrite existing properties in obj
   * @param  {bool} deep       Doing an deep extend (perform extend on every object property)
   * @return {Object}          reference to obj
   */
  function $extend(obj, ext, override, deep) {
    var key;
    if (override) {
      if (deep)
        _overrideDeepExtend(obj, ext);
      else
        for (key in ext)
          obj[key] = ext[key];
    } else {
      if (deep)
        _deepExtend(obj, ext);
      else
        for (key in ext)
          if (!(key in obj))
            obj[key] = ext[key];
    }
    return obj;
  }

  function _overrideDeepExtend(obj, ext) {
    for (var key in ext)
      if (Object.isObjectStrict(obj[key]) && Object.isObjectStrict(ext[key]))
        _overrideDeepExtend(obj[key], ext[key]);
      else
        obj[key] = ext[key];
  }

  function _deepExtend(obj, ext) {
    for (var key in ext)
      if (Object.isObjectStrict(obj[key]) && Object.isObjectStrict(ext[key]))
        _deepExtend(obj[key], ext[key]);
      else if (!(key in obj))
        obj[key] = ext[key];
  }

  /**
   * Define properties of an Object, Which usually used to extend prototype
   *   of an object, as it will set properties as non-enumerable, and will
   *   turn setValue(value) and getValue() functions to setter and getters.
   * Note: You should only use $define or Object.defineProperty on prototype,
   *   or on a class' itself (to define static methods), instead of on instances
   *   which could lead to severe performance issue.
   * @param  {Object} object    target object
   * @param  {Object} prototype extension object
   * @param  {bool} preserve    preserve existing property
   * @return {Object}           reference to object
   */
  function $define(object, prototype, preserve) {
    Object.getOwnPropertyNames(prototype).forEach(function(key) {
      if (preserve && (key in object))
        return;
      var desc = Object.getOwnPropertyDescriptor(prototype, key);
      if ('value' in desc)
        desc.writable = true;
      delete desc.enumerable;
      delete desc.configurable;
      Object.defineProperty(object, key, desc);
    });
    return object;
  }

  /**
   * Declare a Class.
   * @param  {Function} fn      constructor of the Class
   * @param  {Object} prototype prototype of Class
   * @return {Function}         reference to constructor
   */
  function $declare(fn, prototype) {
    fn.prototype.constructor = fn;
    $define(fn.prototype, prototype);
    return fn;
  }

  /**
   * Inherit another Class to current Class
   * @param  {Function} fn      constructor of the Class
   * @param  {Function} parent  parent Class
   * @param  {Object} prototype prototype of Class
   * @return {Function}         reference to constructor
   */


  function $inherit(fn, parent, prototype) {
    fn.prototype = {
      constructor: fn,
      __proto__: parent.prototype
    };
    if (prototype)
      $define(fn.prototype, prototype);
    return fn;
  }



  /**
   * Adding enumerations to a Class (both static and prototype).
   * @param  {Function} fn     constructor of the Class
   * @param  {Object}   values object holding all enumerates want to define
   * @return {Function}        reference to constructor
   */
  function $defenum(fn, values) {
    $define(fn, values);
    $define(fn.prototype, values);
    return fn;
  }

  /**
   * Format a string with given pattern.
   * @param  {string} str pattern
   * @return {string}     formatted string
   */


  var $format = dynamicRequire('util').format;



  /**
   * Making an Error instance with given format and parameters.
   * Note: this is a helper function works like util.format(),
   *   apart from it returns an Error object instead of string.
   * @return {Error} generated Error instance
   */
  function $error() {
    return new Error($format.apply(null, arguments));
  }


  /**
   * Generate a deep copy of an Object with its primitive typed
   * fields (exclude functions).
   * @param  {mixed} obj  source object
   * @return {mixed}      cloned object
   */
  function $valueCopy(obj) {
    var res;
    if (Array.isArray(obj)) {
      res = obj.slice(0);
      for (var i = 0; i < res.length; i++)
        if (Object.isObject(res[i]))
          res[i] = $valueCopy(res[i]);
    } else if (Object.isObjectStrict(obj)) {
      res = {};
      for (var key in obj)
        res[key] = $valueCopy(obj[key]);
    } else if (Function.isFunction(obj)) {
      return undefined;
    } else {
      return obj;
    }
    return res;
  }

  /**
   * Generates a copy of an Object.
   * @param  {Mixed} org  source object
   * @param  {bool} deep  perform a deep clone
   * @return {Mixed}      cloned object
   */
  function $clone(obj, deep) {
    var res;
    var _deep = deep === true || deep - 1;
    if (Array.isArray(obj)) {
      res = obj.slice(0);
      if (deep)
        for (var i = 0; i < res.length; i++)
          if (Object.isObject(res[i]))
            res[i] = $clone(res[i], _deep);
    } else if (Object.isObjectStrict(obj)) {
      res = {};
      for (var key in obj)
        res[key] = obj[key];
      if (deep)
        for (var key in obj)
          if (Object.isObject(res[key]))
            res[key] = $clone(res[key], _deep);
    } else {
      return obj;
    }
    return res;
  }

  /**
   * Return default value of an undefined variable.
   * @param  {Mixed} val  value
   * @param  {Mixed} def  default value
   * @return {Mixed}
   */
  function $default(val, def) {
    return val === undefined ? def : val;
  }

  /**
   * Wrap an object with given Class.
   * Note: it will call Class.__wrap method to do custom wrapping.
   * @param  {Object} obj     object to be wrapped
   * @param  {Function} Type  wrapping Class
   * @return {Object}         wrapped object
   */


  function $wrap(obj, Type) {
    obj.__proto__ = Type.prototype;
    if (Type.__wrap)
      Type.__wrap(obj);
    return obj;
  }

  /**
   * Removing prototype chain from a given object.
   * @param  {Object} object   object to be stripped
   * @return {Object}          object stripped
   */
  function $strip(object) {
    object.__proto__ = Object.prototype;
    return object;
  }

  /**
   * Use Object.prototype.toString to determine an element's type
   * This method provide more stricter strategy on type detection,
   * can be worked with typeof.
   * @param  {Mixed}  obj  Variable
   * @return {String}      type of the variable, like typeof,
   *                       but with better precision.
   */
  function $typeof(obj) {
    var type = Object.prototype.toString.call(obj);
    return type.substring(8, type.length - 1).toLowerCase();
  }



  $define(global, {
    $extend: $extend,
    $define: $define,
    $declare: $declare,
    $inherit: $inherit,
    $defenum: $defenum,
    $format: $format,
    $error: $error,
    $valueCopy: $valueCopy,
    $clone: $clone,
    $default: $default,
    $wrap: $wrap

    ,
    $apollo: dynamicRequire('./package').version,
    $strip: $strip,
    $typeof: $typeof

  });

  $define(String.prototype, {
    /**
     * Repeat current string for given times.
     * @param  {int} times  Times to repeat
     * @return {string}     result
     */
    repeat: function(times) {
      var res = '';
      for (var i = 0; i < times; i++)
        res += this;
      return res;
    },
    /**
     * Padding this to given length with specified char from left.
     * @param  {char} ch    padding char
     * @param  {int} length desired length
     * @return {string}     result
     */
    paddingLeft: function(ch, length) {
      if (this.length < length)
        return ch.repeat(length - this.length) + this;
      return this;
    },
    /**
     * Padding this to given length with specified char from right.
     * @param  {char} ch    padding char
     * @param  {int} length desired length
     * @return {string}     result
     */
    paddingRight: function(ch, length) {
      if (this.length < length)
        return this + ch.repeat(length - this.length);
      return this;
    },

    /**
     * get last character in this string
     * @return {String} last character
     */
    get back() {
      return this[this.length - 1];
    },
    /**
     * get first character in this string
     * @return {String} first character
     */
    get front() {
      return this[0];
    },

    /**
     * Tests if this string starts with the given one.
     * @param  {string} str string to test with
     * @param  {number} pos optional, position to start compare, defaults
     *                      to 0
     * @return {bool}       result
     */
    startsWith: function(str, pos) {
      if (str === null || str === undefined || str.length === 0)
        return true;
      return this.substr(pos || 0, str.length) === str;
    },
    /**
     * Tests if this string ends with the given one.
     * @param  {string} str string to test with
     * @param  {number} len optional, pretend this string is of given length,
     *                      defaults to actual length
     * @return {bool}       result
     */
    endsWith: function(str, len) {
      if (str === null || str === undefined || str.length === 0)
        return true;
      return this.substr((len || this.length) - str.length, str.length) === str;
    },
    /**
     * Return a string in it's title form.
     * @return {string} string in title case
     * Note: if a word containing upper case, nothing
     *   will be done.
     */
    toTitleCase: function() {
      return this.replace(/\b([a-z])(['a-z]*)\b/g, function(all, letter, rest) {
        return letter.toUpperCase() + rest;
      });
    },
    /**
     * Trim whitespaces at the begining of the string
     * @return {string} trimmed string
     */
    trimLeft: function() {
      return this.replace(/^\s+/, '');
    },
    /**
     * Trim whitespaces at the ending of the string
     * @return {string} trimmed string
     */
    trimRight: function() {
      return this.replace(/\s+$/, '');
    }
  }, true);

  $define(Number.prototype, {
    /**
     * Clamp current value to the given range [lb, ub]
     * @param  {number} lb lower bound
     * @param  {number} ub upper bound
     * @return {number}    result
     */
    clamp: function(lb, ub) {
      var rtn = Number(this);
      if (lb !== undefined && rtn < lb)
        rtn = lb;
      if (ub !== undefined && rtn > ub)
        rtn = ub;
      return rtn;
    },
    /**
     * Shortcut to Math.floor(this)
     * @return {number} Math.floor(this)
     */
    floor: function() {
      return Math.floor(this);
    },
    /**
     * Shortcut to Math.ceil(this)
     * @return {number} Math.ceil(this)
     */
    ceil: function() {
      return Math.ceil(this);
    },
    /**
     * Shortcut to Math.round(this) with additional parameters
     * @param  {number} decimals number of decimal digits to round up to
     * @return {number}          rounded number
     */
    round: function(decimals) {
      if (decimals) {
        var unit = Math.pow(10, decimals);
        return Math.round(this * unit) / unit;
      }
      return Math.round(this);
    },
    /**
     * Get the thousands separated number
     * @param  {number} decimals  number of decimal digits to remain
     * @param  {string} separator separator
     * @return {string}           separated number
     */
    toGroup: function(decimals, separator) {

      decimals = decimals || 0;

      if (this > -1000 && this < 1000)
        return this.toFixed(decimals);

      separator = separator || ',';

      var sign = this < 0 ? '-' : '';
      var tmp = Math.abs(this).toFixed(decimals);

      var intPart, decimalPart;
      if (decimals > 0) {
        intPart = tmp.substr(0, tmp.length - decimals - 1);
        decimalPart = tmp.substr(tmp.length - decimals - 1);
      } else {
        intPart = tmp;
        decimalPart = '';
      }

      var res = '';
      for (var pos = 0, len = intPart.length % 3 || 3;
          pos < intPart.length; pos += len, len = 3) {
        if (res !== '')
          res += separator;
        res += intPart.substr(pos, len);
      }
      return sign + res + decimalPart;

    }
  });

  $define(Array.prototype, {
    /**
     * get minimum value in this array
     * @return {Mixed} minimal value
     */
    min: function() {
      var res = this[0];
      for (var i = 1; i < this.length; i++)
        if (this[i] < res)
          res = this[i];
      return res;
    },
    /**
     * get maximum value in this array
     * @return {Mixed} maximum value
     */
    max: function() {
      var res = this[0];
      for (var i = 1; i < this.length; i++)
        if (this[i] > res)
          res = this[i];
      return res;
    },
    /**
     * Push a value iif it's not in this array, and return value's index.
     * @param  {Mixed} val  new value
     * @return {int}        index of the value
     * Note: This only works with primitive typed elements, which can be found
     *       with Array#indexOf().
     */
    add: function(val) {
      var index = this.indexOf(val);
      if (index === -1)
        return this.push(val) - 1;
      return index;
    },
    /**
     * Find a value in the array and remove it.
     * @param  {Mixed} val  value to remove
     * @return {Array}      this
     * Note: This only works with primitive typed elements, which can be found
     *       with Array#indexOf().
     */
    remove: function(val) {
      var index = this.indexOf(val);
      if (index > -1) {
        // Shift copy elements instead of Array#splice() for better performance.
        // http://jsperf.com/fast-array-splice/18
        while (++index < this.length)
          this[index - 1] = this[index];
        this.pop();
      }
      return this;
    },
    /**
     * Rotate this array (n->0, n+1->1, ...)
     * @param  {int} n   the offset
     * @return {Array}   this
     */
    rotate: function(n) {
      if (n < 0)
        n = n % this.length + this.length;
      n %= this.length;
      var middle = n;
      var next = n;
      var first = 0;
      while (first < this.length) {
        var t = this[first];
        this[first] = this[next];
        this[next] = t;
        first++;
        next++;
        if (next == this.length) next = middle;
        else if (first == middle) middle = next;
      }
      return this;
    },

    /**
     * get last element in this array
     * Note: It's not a reference when returning a non-object!
     * @return {Mixed} last element
     */
    get back() {
      return this[this.length - 1];
    },
    /**
     * get first element in this array
     * Note: It's not a reference when returning a non-object!
     * @return {Mixed} first element
     */
    get front() {
      return this[0];
    },

    /**
     * Flattern a array with sub arrays.
     * @param  {bool} deep if continue to flatten sub arrays
     * @return {Array}     flattened array.
     */
    flatten: function(deep) {
      var res = [];
      if (!deep)
        return res.concat.apply(res, this);
      for (var i = 0; i < this.length; i++)
        if (Array.isArray(this[i]))
          res.push.apply(res, this[i].flatten(true));
        else
          res.push(this[i]);
      return res;
    },
    /**
     * Return unique elements in the array
     * @return {Array}
     */
    unique: function() {
      var res = [];
      var dict = {};
      for (var i = 0; i < this.length; ++i) {
        var key = this[i].toString();
        if (dict.hasOwnProperty(key))
          continue;
        dict[key] = true;
        res.push(this[i]);
      }
      return res;
    },
    /**
     * shuffle elements in the array in-place
     * @return {Array}
     */
    shuffle: function() {
      for (var n = this.length; n > 0; n--) {
        var idx = Math.floor(n * Math.random());
        if (idx != n - 1) {
          var tmp = this[idx];
          this[idx] = this[n - 1];
          this[n - 1] = tmp;
        }
      }
      return this;
    }
  });

  /**
   * Forward declaring prototype functions to Array's static
   * methods.
   */
  if (Array.map === undefined)
    ['forEach', 'every', 'some', 'filter', 'map', 'reduce', 'reduceRight', 'slice']
      .forEach(function(method) {
        var fn = Array.prototype[method];
        Object.defineProperty(Array, method, {
          value: function(a, b, c) {
            return fn.call(a, b, c);
          }
        });
      });

  if (String.trim === undefined)
    ['trim', 'trimLeft', 'trimRight']
      .forEach(function(method) {
        var fn = String.prototype[method];
        Object.defineProperty(String, method, {
          value: function(a) {
            return fn.call(a);
          }
        });
      });

  $define(Object, {
    /**
     * Determine if an object is empty
     * @param  {Object} obj  object to test
     * @return {bool}        object is empty
     */
    isEmpty: function(obj) {
      if (!obj)
        return true;
      for (var key in obj)
        return false;
      return true;
    },
    /**
     * Get values of an object, like Object.keys().
     * @param  {Object} obj  object to extract
     * @return {Array}       values in the object
     */
    values: function(obj) {
      return Object.keys(obj).map(function(k) {
        return obj[k];
      });
    },
    /**
     * Vague but fast isObject test
     * Note: new String(), function, array, etc will return true
     * @param  {Mixed} obj  object to test
     * @return {bool}       true if obj is an object and not null
     */
    isObject: function(obj) {
      /**
       * Known fastest way to test, the order of the test
       * following: http://jsperf.com/typeof-vs-bool.
       */
      return obj && typeof obj === 'object';
    },
    /**
     * Strict isObject test, only pure Object will return true
     * Note: only {} will return true
     * @param  {Mixed} obj  object to test
     * @return {bool}       true if obj is strictly an object
     */
    isObjectStrict: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    }

    ,
    /**
     * project $object with projectiong, same behaviour with mongodb projection
     * @param  {Object} object      target object
     * @param  {Object} projection  An object mapping fields to values
     * @param  {Boolean} deep       if true, go deep for sub objects
     * @param  {Boolean} keep       if true, keep undefined field of this
     * @return {Object}             projected object
     */
    project: function(object, projection, deep, keep) {
      if (!Object.isObject(projection))
        return object;
      var res = {};
      Object.keys(projection).forEach(function(key) {
        var proj = projection[key];
        if (proj) {
          var obj = object[key];
          if (deep && Object.isObjectStrict(obj) && Object.isObjectStrict(proj)) {
            res[key] = Object.project(obj, projection[key], deep, keep);
          } else {
            if (keep)
              res[key] = obj;
            else if (obj !== undefined)
              res[key] = obj;
          }
        }
      });
      return res;
    },
    Transformer: function(mapping) {
      var expr = [];
      expr.push('exec=function (object) {');
      expr.push('var res = {};');
      (function loop(lhv, mapping) {
        Object.keys(mapping).forEach(function(key) {
          var source = mapping[key];
          if (/\W/.test(key)) key = '["' + key + '"]';
          else key = '.' + key;


          var target = lhv + key;
          if ($typeof(source) == 'object') {
            expr.push(target + ' = {};');
            return loop(target, source);
          }

          if (true === source)
            source = 'object' + key;
          else if ($typeof(source) == 'string')
            source = 'object' + source;
          else if ($typeof(source) == 'function')
            source = '('+source.toString()+')(object)';
          expr.push(target + ' = ' + source + ';');
        });
      })('res', mapping);
      expr.push('return res;');
      expr.push('}');
      this.exec = eval(expr.join(''));
    }

  });

  $define(Function, {
    /**
     * Test if an object is a function
     * @param  {Mixed} obj  object to test
     * @return {bool}       true if so
     */
    isFunction: function(obj) {
      return typeof obj === 'function';
    }
  });

  $define(Date, {
    /**
     * Cast a value to Date
     * @param  {Mixed} obj  object to cast
     * @return {Date}       casted value
     */
    cast: function(obj) {
      if (obj instanceof Date)
        return obj;
      if (typeof obj === 'string')
        obj = Date.parse(obj);
      if (typeof obj === 'number') {
        if (isNaN(obj))
          return null;
        obj = new Date(obj);
        if (isNaN(obj.valueOf()))
          return null;
        return obj;
      }
      return null;
    },
    /**
     * Determine if an object is a Date
     * @param  {Object}     object to test
     * @return {bool}       true iif it's a date.
     */
    isDate: function(obj) {
      obj = Date.cast(obj);
      if (obj)
        return obj >= 0 && obj < 2147483647000;
      return false;
    }
  });

  $define(Boolean, {
    /**
     * Cast a value to bool
     * @param  {Object} obj  object to cast
     * @return {bool}        casted value
     */
    cast: function(obj) {
      if (obj === true || obj === false)
        return obj;
      if (typeof obj === 'string')
        return (/^(true|yes|ok|y|on)$/i).test(obj);
      return Boolean(obj);
    }
  });

  $define(RegExp, {
    /**
     * Escape a string to work within a regular expression
     * @param  {string} str string to escape
     * @return {strign}     escaped string
     */
    escape: function(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
  });

  $define(JSON, {
    /**
     * Try to parse a json string
     * @param  {string} str json string
     * @return {mixed}      parsed result
     */
    tryParse: function(str) {
      try {
        return JSON.parse(str);
      } catch(e) {
        return;
      }
    }
  });





  }




  }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"./package":5,"util":4}],7:[function(dynamicRequire,module,exports){
  var encode = dynamicRequire("./lib/encode.js"),
      decode = dynamicRequire("./lib/decode.js");

  exports.decode = function(data, level){
    return (!level || level <= 0 ? decode.XML : decode.HTML)(data);
  };

  exports.decodeStrict = function(data, level){
    return (!level || level <= 0 ? decode.XML : decode.HTMLStrict)(data);
  };

  exports.encode = function(data, level){
    return (!level || level <= 0 ? encode.XML : encode.HTML)(data);
  };

  exports.encodeXML = encode.XML;

  exports.encodeHTML4 =
  exports.encodeHTML5 =
  exports.encodeHTML  = encode.HTML;

  exports.decodeXML =
  exports.decodeXMLStrict = decode.XML;

  exports.decodeHTML4 =
  exports.decodeHTML5 =
  exports.decodeHTML = decode.HTML;

  exports.decodeHTML4Strict =
  exports.decodeHTML5Strict =
  exports.decodeHTMLStrict = decode.HTMLStrict;

  exports.escape = encode.escape;

  },{"./lib/decode.js":8,"./lib/encode.js":10}],8:[function(dynamicRequire,module,exports){
  var entityMap = dynamicRequire("../maps/entities.json"),
      legacyMap = dynamicRequire("../maps/legacy.json"),
      xmlMap    = dynamicRequire("../maps/xml.json"),
      decodeCodePoint = dynamicRequire("./decode_codepoint.js");

  var decodeXMLStrict  = getStrictDecoder(xmlMap),
      decodeHTMLStrict = getStrictDecoder(entityMap);

  function getStrictDecoder(map){
    var keys = Object.keys(map).join("|"),
        replace = getReplacer(map);

    keys += "|#[xX][\\da-fA-F]+|#\\d+";

    var re = new RegExp("&(?:" + keys + ");", "g");

    return function(str){
      return String(str).replace(re, replace);
    };
  }

  var decodeHTML = (function(){
    var legacy = Object.keys(legacyMap)
      .sort(sorter);

    var keys = Object.keys(entityMap)
      .sort(sorter);

    for(var i = 0, j = 0; i < keys.length; i++){
      if(legacy[j] === keys[i]){
        keys[i] += ";?";
        j++;
      } else {
        keys[i] += ";";
      }
    }

    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"),
        replace = getReplacer(entityMap);

    function replacer(str){
      if(str.substr(-1) !== ";") str += ";";
      return replace(str);
    }

    //TODO consider creating a merged map
    return function(str){
      return String(str).replace(re, replacer);
    };
  }());

  function sorter(a, b){
    return a < b ? 1 : -1;
  }

  function getReplacer(map){
    return function replace(str){
      if(str.charAt(1) === "#"){
        if(str.charAt(2) === "X" || str.charAt(2) === "x"){
          return decodeCodePoint(parseInt(str.substr(3), 16));
        }
        return decodeCodePoint(parseInt(str.substr(2), 10));
      }
      return map[str.slice(1, -1)];
    };
  }

  module.exports = {
    XML: decodeXMLStrict,
    HTML: decodeHTML,
    HTMLStrict: decodeHTMLStrict
  };
  },{"../maps/entities.json":12,"../maps/legacy.json":13,"../maps/xml.json":14,"./decode_codepoint.js":9}],9:[function(dynamicRequire,module,exports){
  var decodeMap = dynamicRequire("../maps/decode.json");

  module.exports = decodeCodePoint;

  // modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
  function decodeCodePoint(codePoint){

    if((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF){
      return "\uFFFD";
    }

    if(codePoint in decodeMap){
      codePoint = decodeMap[codePoint];
    }

    var output = "";

    if(codePoint > 0xFFFF){
      codePoint -= 0x10000;
      output += String.fromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    output += String.fromCharCode(codePoint);
    return output;
  }

  },{"../maps/decode.json":11}],10:[function(dynamicRequire,module,exports){
  var inverseXML = getInverseObj(dynamicRequire("../maps/xml.json")),
      xmlReplacer = getInverseReplacer(inverseXML);

  exports.XML = getInverse(inverseXML, xmlReplacer);

  var inverseHTML = getInverseObj(dynamicRequire("../maps/entities.json")),
      htmlReplacer = getInverseReplacer(inverseHTML);

  exports.HTML = getInverse(inverseHTML, htmlReplacer);

  function getInverseObj(obj){
    return Object.keys(obj).sort().reduce(function(inverse, name){
      inverse[obj[name]] = "&" + name + ";";
      return inverse;
    }, {});
  }

  function getInverseReplacer(inverse){
    var single = [],
        multiple = [];

    Object.keys(inverse).forEach(function(k){
      if(k.length === 1){
        single.push("\\" + k);
      } else {
        multiple.push(k);
      }
    });

    //TODO add ranges
    multiple.unshift("[" + single.join("") + "]");

    return new RegExp(multiple.join("|"), "g");
  }

  var re_nonASCII = /[^\0-\x7F]/g,
      re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  function singleCharReplacer(c){
    return "&#x" + c.charCodeAt(0).toString(16).toUpperCase() + ";";
  }

  function astralReplacer(c){
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    var high = c.charCodeAt(0);
    var low  = c.charCodeAt(1);
    var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
    return "&#x" + codePoint.toString(16).toUpperCase() + ";";
  }

  function getInverse(inverse, re){
    function func(name){
      return inverse[name];
    }

    return function(data){
      return data
          .replace(re, func)
          .replace(re_astralSymbols, astralReplacer)
          .replace(re_nonASCII, singleCharReplacer);
    };
  }

  var re_xmlChars = getInverseReplacer(inverseXML);

  function escapeXML(data){
    return data
        .replace(re_xmlChars, singleCharReplacer)
        .replace(re_astralSymbols, astralReplacer)
        .replace(re_nonASCII, singleCharReplacer);
  }

  exports.escape = escapeXML;

  },{"../maps/entities.json":12,"../maps/xml.json":14}],11:[function(dynamicRequire,module,exports){
  module.exports={"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}
  },{}],12:[function(dynamicRequire,module,exports){
  module.exports={"Aacute":"\u00C1","aacute":"\u00E1","Abreve":"\u0102","abreve":"\u0103","ac":"\u223E","acd":"\u223F","acE":"\u223E\u0333","Acirc":"\u00C2","acirc":"\u00E2","acute":"\u00B4","Acy":"\u0410","acy":"\u0430","AElig":"\u00C6","aelig":"\u00E6","af":"\u2061","Afr":"\uD835\uDD04","afr":"\uD835\uDD1E","Agrave":"\u00C0","agrave":"\u00E0","alefsym":"\u2135","aleph":"\u2135","Alpha":"\u0391","alpha":"\u03B1","Amacr":"\u0100","amacr":"\u0101","amalg":"\u2A3F","amp":"&","AMP":"&","andand":"\u2A55","And":"\u2A53","and":"\u2227","andd":"\u2A5C","andslope":"\u2A58","andv":"\u2A5A","ang":"\u2220","ange":"\u29A4","angle":"\u2220","angmsdaa":"\u29A8","angmsdab":"\u29A9","angmsdac":"\u29AA","angmsdad":"\u29AB","angmsdae":"\u29AC","angmsdaf":"\u29AD","angmsdag":"\u29AE","angmsdah":"\u29AF","angmsd":"\u2221","angrt":"\u221F","angrtvb":"\u22BE","angrtvbd":"\u299D","angsph":"\u2222","angst":"\u00C5","angzarr":"\u237C","Aogon":"\u0104","aogon":"\u0105","Aopf":"\uD835\uDD38","aopf":"\uD835\uDD52","apacir":"\u2A6F","ap":"\u2248","apE":"\u2A70","ape":"\u224A","apid":"\u224B","apos":"'","ApplyFunction":"\u2061","approx":"\u2248","approxeq":"\u224A","Aring":"\u00C5","aring":"\u00E5","Ascr":"\uD835\uDC9C","ascr":"\uD835\uDCB6","Assign":"\u2254","ast":"*","asymp":"\u2248","asympeq":"\u224D","Atilde":"\u00C3","atilde":"\u00E3","Auml":"\u00C4","auml":"\u00E4","awconint":"\u2233","awint":"\u2A11","backcong":"\u224C","backepsilon":"\u03F6","backprime":"\u2035","backsim":"\u223D","backsimeq":"\u22CD","Backslash":"\u2216","Barv":"\u2AE7","barvee":"\u22BD","barwed":"\u2305","Barwed":"\u2306","barwedge":"\u2305","bbrk":"\u23B5","bbrktbrk":"\u23B6","bcong":"\u224C","Bcy":"\u0411","bcy":"\u0431","bdquo":"\u201E","becaus":"\u2235","because":"\u2235","Because":"\u2235","bemptyv":"\u29B0","bepsi":"\u03F6","bernou":"\u212C","Bernoullis":"\u212C","Beta":"\u0392","beta":"\u03B2","beth":"\u2136","between":"\u226C","Bfr":"\uD835\uDD05","bfr":"\uD835\uDD1F","bigcap":"\u22C2","bigcirc":"\u25EF","bigcup":"\u22C3","bigodot":"\u2A00","bigoplus":"\u2A01","bigotimes":"\u2A02","bigsqcup":"\u2A06","bigstar":"\u2605","bigtriangledown":"\u25BD","bigtriangleup":"\u25B3","biguplus":"\u2A04","bigvee":"\u22C1","bigwedge":"\u22C0","bkarow":"\u290D","blacklozenge":"\u29EB","blacksquare":"\u25AA","blacktriangle":"\u25B4","blacktriangledown":"\u25BE","blacktriangleleft":"\u25C2","blacktriangleright":"\u25B8","blank":"\u2423","blk12":"\u2592","blk14":"\u2591","blk34":"\u2593","block":"\u2588","bne":"=\u20E5","bnequiv":"\u2261\u20E5","bNot":"\u2AED","bnot":"\u2310","Bopf":"\uD835\uDD39","bopf":"\uD835\uDD53","bot":"\u22A5","bottom":"\u22A5","bowtie":"\u22C8","boxbox":"\u29C9","boxdl":"\u2510","boxdL":"\u2555","boxDl":"\u2556","boxDL":"\u2557","boxdr":"\u250C","boxdR":"\u2552","boxDr":"\u2553","boxDR":"\u2554","boxh":"\u2500","boxH":"\u2550","boxhd":"\u252C","boxHd":"\u2564","boxhD":"\u2565","boxHD":"\u2566","boxhu":"\u2534","boxHu":"\u2567","boxhU":"\u2568","boxHU":"\u2569","boxminus":"\u229F","boxplus":"\u229E","boxtimes":"\u22A0","boxul":"\u2518","boxuL":"\u255B","boxUl":"\u255C","boxUL":"\u255D","boxur":"\u2514","boxuR":"\u2558","boxUr":"\u2559","boxUR":"\u255A","boxv":"\u2502","boxV":"\u2551","boxvh":"\u253C","boxvH":"\u256A","boxVh":"\u256B","boxVH":"\u256C","boxvl":"\u2524","boxvL":"\u2561","boxVl":"\u2562","boxVL":"\u2563","boxvr":"\u251C","boxvR":"\u255E","boxVr":"\u255F","boxVR":"\u2560","bprime":"\u2035","breve":"\u02D8","Breve":"\u02D8","brvbar":"\u00A6","bscr":"\uD835\uDCB7","Bscr":"\u212C","bsemi":"\u204F","bsim":"\u223D","bsime":"\u22CD","bsolb":"\u29C5","bsol":"\\","bsolhsub":"\u27C8","bull":"\u2022","bullet":"\u2022","bump":"\u224E","bumpE":"\u2AAE","bumpe":"\u224F","Bumpeq":"\u224E","bumpeq":"\u224F","Cacute":"\u0106","cacute":"\u0107","capand":"\u2A44","capbrcup":"\u2A49","capcap":"\u2A4B","cap":"\u2229","Cap":"\u22D2","capcup":"\u2A47","capdot":"\u2A40","CapitalDifferentialD":"\u2145","caps":"\u2229\uFE00","caret":"\u2041","caron":"\u02C7","Cayleys":"\u212D","ccaps":"\u2A4D","Ccaron":"\u010C","ccaron":"\u010D","Ccedil":"\u00C7","ccedil":"\u00E7","Ccirc":"\u0108","ccirc":"\u0109","Cconint":"\u2230","ccups":"\u2A4C","ccupssm":"\u2A50","Cdot":"\u010A","cdot":"\u010B","cedil":"\u00B8","Cedilla":"\u00B8","cemptyv":"\u29B2","cent":"\u00A2","centerdot":"\u00B7","CenterDot":"\u00B7","cfr":"\uD835\uDD20","Cfr":"\u212D","CHcy":"\u0427","chcy":"\u0447","check":"\u2713","checkmark":"\u2713","Chi":"\u03A7","chi":"\u03C7","circ":"\u02C6","circeq":"\u2257","circlearrowleft":"\u21BA","circlearrowright":"\u21BB","circledast":"\u229B","circledcirc":"\u229A","circleddash":"\u229D","CircleDot":"\u2299","circledR":"\u00AE","circledS":"\u24C8","CircleMinus":"\u2296","CirclePlus":"\u2295","CircleTimes":"\u2297","cir":"\u25CB","cirE":"\u29C3","cire":"\u2257","cirfnint":"\u2A10","cirmid":"\u2AEF","cirscir":"\u29C2","ClockwiseContourIntegral":"\u2232","CloseCurlyDoubleQuote":"\u201D","CloseCurlyQuote":"\u2019","clubs":"\u2663","clubsuit":"\u2663","colon":":","Colon":"\u2237","Colone":"\u2A74","colone":"\u2254","coloneq":"\u2254","comma":",","commat":"@","comp":"\u2201","compfn":"\u2218","complement":"\u2201","complexes":"\u2102","cong":"\u2245","congdot":"\u2A6D","Congruent":"\u2261","conint":"\u222E","Conint":"\u222F","ContourIntegral":"\u222E","copf":"\uD835\uDD54","Copf":"\u2102","coprod":"\u2210","Coproduct":"\u2210","copy":"\u00A9","COPY":"\u00A9","copysr":"\u2117","CounterClockwiseContourIntegral":"\u2233","crarr":"\u21B5","cross":"\u2717","Cross":"\u2A2F","Cscr":"\uD835\uDC9E","cscr":"\uD835\uDCB8","csub":"\u2ACF","csube":"\u2AD1","csup":"\u2AD0","csupe":"\u2AD2","ctdot":"\u22EF","cudarrl":"\u2938","cudarrr":"\u2935","cuepr":"\u22DE","cuesc":"\u22DF","cularr":"\u21B6","cularrp":"\u293D","cupbrcap":"\u2A48","cupcap":"\u2A46","CupCap":"\u224D","cup":"\u222A","Cup":"\u22D3","cupcup":"\u2A4A","cupdot":"\u228D","cupor":"\u2A45","cups":"\u222A\uFE00","curarr":"\u21B7","curarrm":"\u293C","curlyeqprec":"\u22DE","curlyeqsucc":"\u22DF","curlyvee":"\u22CE","curlywedge":"\u22CF","curren":"\u00A4","curvearrowleft":"\u21B6","curvearrowright":"\u21B7","cuvee":"\u22CE","cuwed":"\u22CF","cwconint":"\u2232","cwint":"\u2231","cylcty":"\u232D","dagger":"\u2020","Dagger":"\u2021","daleth":"\u2138","darr":"\u2193","Darr":"\u21A1","dArr":"\u21D3","dash":"\u2010","Dashv":"\u2AE4","dashv":"\u22A3","dbkarow":"\u290F","dblac":"\u02DD","Dcaron":"\u010E","dcaron":"\u010F","Dcy":"\u0414","dcy":"\u0434","ddagger":"\u2021","ddarr":"\u21CA","DD":"\u2145","dd":"\u2146","DDotrahd":"\u2911","ddotseq":"\u2A77","deg":"\u00B0","Del":"\u2207","Delta":"\u0394","delta":"\u03B4","demptyv":"\u29B1","dfisht":"\u297F","Dfr":"\uD835\uDD07","dfr":"\uD835\uDD21","dHar":"\u2965","dharl":"\u21C3","dharr":"\u21C2","DiacriticalAcute":"\u00B4","DiacriticalDot":"\u02D9","DiacriticalDoubleAcute":"\u02DD","DiacriticalGrave":"`","DiacriticalTilde":"\u02DC","diam":"\u22C4","diamond":"\u22C4","Diamond":"\u22C4","diamondsuit":"\u2666","diams":"\u2666","die":"\u00A8","DifferentialD":"\u2146","digamma":"\u03DD","disin":"\u22F2","div":"\u00F7","divide":"\u00F7","divideontimes":"\u22C7","divonx":"\u22C7","DJcy":"\u0402","djcy":"\u0452","dlcorn":"\u231E","dlcrop":"\u230D","dollar":"$","Dopf":"\uD835\uDD3B","dopf":"\uD835\uDD55","Dot":"\u00A8","dot":"\u02D9","DotDot":"\u20DC","doteq":"\u2250","doteqdot":"\u2251","DotEqual":"\u2250","dotminus":"\u2238","dotplus":"\u2214","dotsquare":"\u22A1","doublebarwedge":"\u2306","DoubleContourIntegral":"\u222F","DoubleDot":"\u00A8","DoubleDownArrow":"\u21D3","DoubleLeftArrow":"\u21D0","DoubleLeftRightArrow":"\u21D4","DoubleLeftTee":"\u2AE4","DoubleLongLeftArrow":"\u27F8","DoubleLongLeftRightArrow":"\u27FA","DoubleLongRightArrow":"\u27F9","DoubleRightArrow":"\u21D2","DoubleRightTee":"\u22A8","DoubleUpArrow":"\u21D1","DoubleUpDownArrow":"\u21D5","DoubleVerticalBar":"\u2225","DownArrowBar":"\u2913","downarrow":"\u2193","DownArrow":"\u2193","Downarrow":"\u21D3","DownArrowUpArrow":"\u21F5","DownBreve":"\u0311","downdownarrows":"\u21CA","downharpoonleft":"\u21C3","downharpoonright":"\u21C2","DownLeftRightVector":"\u2950","DownLeftTeeVector":"\u295E","DownLeftVectorBar":"\u2956","DownLeftVector":"\u21BD","DownRightTeeVector":"\u295F","DownRightVectorBar":"\u2957","DownRightVector":"\u21C1","DownTeeArrow":"\u21A7","DownTee":"\u22A4","drbkarow":"\u2910","drcorn":"\u231F","drcrop":"\u230C","Dscr":"\uD835\uDC9F","dscr":"\uD835\uDCB9","DScy":"\u0405","dscy":"\u0455","dsol":"\u29F6","Dstrok":"\u0110","dstrok":"\u0111","dtdot":"\u22F1","dtri":"\u25BF","dtrif":"\u25BE","duarr":"\u21F5","duhar":"\u296F","dwangle":"\u29A6","DZcy":"\u040F","dzcy":"\u045F","dzigrarr":"\u27FF","Eacute":"\u00C9","eacute":"\u00E9","easter":"\u2A6E","Ecaron":"\u011A","ecaron":"\u011B","Ecirc":"\u00CA","ecirc":"\u00EA","ecir":"\u2256","ecolon":"\u2255","Ecy":"\u042D","ecy":"\u044D","eDDot":"\u2A77","Edot":"\u0116","edot":"\u0117","eDot":"\u2251","ee":"\u2147","efDot":"\u2252","Efr":"\uD835\uDD08","efr":"\uD835\uDD22","eg":"\u2A9A","Egrave":"\u00C8","egrave":"\u00E8","egs":"\u2A96","egsdot":"\u2A98","el":"\u2A99","Element":"\u2208","elinters":"\u23E7","ell":"\u2113","els":"\u2A95","elsdot":"\u2A97","Emacr":"\u0112","emacr":"\u0113","empty":"\u2205","emptyset":"\u2205","EmptySmallSquare":"\u25FB","emptyv":"\u2205","EmptyVerySmallSquare":"\u25AB","emsp13":"\u2004","emsp14":"\u2005","emsp":"\u2003","ENG":"\u014A","eng":"\u014B","ensp":"\u2002","Eogon":"\u0118","eogon":"\u0119","Eopf":"\uD835\uDD3C","eopf":"\uD835\uDD56","epar":"\u22D5","eparsl":"\u29E3","eplus":"\u2A71","epsi":"\u03B5","Epsilon":"\u0395","epsilon":"\u03B5","epsiv":"\u03F5","eqcirc":"\u2256","eqcolon":"\u2255","eqsim":"\u2242","eqslantgtr":"\u2A96","eqslantless":"\u2A95","Equal":"\u2A75","equals":"=","EqualTilde":"\u2242","equest":"\u225F","Equilibrium":"\u21CC","equiv":"\u2261","equivDD":"\u2A78","eqvparsl":"\u29E5","erarr":"\u2971","erDot":"\u2253","escr":"\u212F","Escr":"\u2130","esdot":"\u2250","Esim":"\u2A73","esim":"\u2242","Eta":"\u0397","eta":"\u03B7","ETH":"\u00D0","eth":"\u00F0","Euml":"\u00CB","euml":"\u00EB","euro":"\u20AC","excl":"!","exist":"\u2203","Exists":"\u2203","expectation":"\u2130","exponentiale":"\u2147","ExponentialE":"\u2147","fallingdotseq":"\u2252","Fcy":"\u0424","fcy":"\u0444","female":"\u2640","ffilig":"\uFB03","fflig":"\uFB00","ffllig":"\uFB04","Ffr":"\uD835\uDD09","ffr":"\uD835\uDD23","filig":"\uFB01","FilledSmallSquare":"\u25FC","FilledVerySmallSquare":"\u25AA","fjlig":"fj","flat":"\u266D","fllig":"\uFB02","fltns":"\u25B1","fnof":"\u0192","Fopf":"\uD835\uDD3D","fopf":"\uD835\uDD57","forall":"\u2200","ForAll":"\u2200","fork":"\u22D4","forkv":"\u2AD9","Fouriertrf":"\u2131","fpartint":"\u2A0D","frac12":"\u00BD","frac13":"\u2153","frac14":"\u00BC","frac15":"\u2155","frac16":"\u2159","frac18":"\u215B","frac23":"\u2154","frac25":"\u2156","frac34":"\u00BE","frac35":"\u2157","frac38":"\u215C","frac45":"\u2158","frac56":"\u215A","frac58":"\u215D","frac78":"\u215E","frasl":"\u2044","frown":"\u2322","fscr":"\uD835\uDCBB","Fscr":"\u2131","gacute":"\u01F5","Gamma":"\u0393","gamma":"\u03B3","Gammad":"\u03DC","gammad":"\u03DD","gap":"\u2A86","Gbreve":"\u011E","gbreve":"\u011F","Gcedil":"\u0122","Gcirc":"\u011C","gcirc":"\u011D","Gcy":"\u0413","gcy":"\u0433","Gdot":"\u0120","gdot":"\u0121","ge":"\u2265","gE":"\u2267","gEl":"\u2A8C","gel":"\u22DB","geq":"\u2265","geqq":"\u2267","geqslant":"\u2A7E","gescc":"\u2AA9","ges":"\u2A7E","gesdot":"\u2A80","gesdoto":"\u2A82","gesdotol":"\u2A84","gesl":"\u22DB\uFE00","gesles":"\u2A94","Gfr":"\uD835\uDD0A","gfr":"\uD835\uDD24","gg":"\u226B","Gg":"\u22D9","ggg":"\u22D9","gimel":"\u2137","GJcy":"\u0403","gjcy":"\u0453","gla":"\u2AA5","gl":"\u2277","glE":"\u2A92","glj":"\u2AA4","gnap":"\u2A8A","gnapprox":"\u2A8A","gne":"\u2A88","gnE":"\u2269","gneq":"\u2A88","gneqq":"\u2269","gnsim":"\u22E7","Gopf":"\uD835\uDD3E","gopf":"\uD835\uDD58","grave":"`","GreaterEqual":"\u2265","GreaterEqualLess":"\u22DB","GreaterFullEqual":"\u2267","GreaterGreater":"\u2AA2","GreaterLess":"\u2277","GreaterSlantEqual":"\u2A7E","GreaterTilde":"\u2273","Gscr":"\uD835\uDCA2","gscr":"\u210A","gsim":"\u2273","gsime":"\u2A8E","gsiml":"\u2A90","gtcc":"\u2AA7","gtcir":"\u2A7A","gt":">","GT":">","Gt":"\u226B","gtdot":"\u22D7","gtlPar":"\u2995","gtquest":"\u2A7C","gtrapprox":"\u2A86","gtrarr":"\u2978","gtrdot":"\u22D7","gtreqless":"\u22DB","gtreqqless":"\u2A8C","gtrless":"\u2277","gtrsim":"\u2273","gvertneqq":"\u2269\uFE00","gvnE":"\u2269\uFE00","Hacek":"\u02C7","hairsp":"\u200A","half":"\u00BD","hamilt":"\u210B","HARDcy":"\u042A","hardcy":"\u044A","harrcir":"\u2948","harr":"\u2194","hArr":"\u21D4","harrw":"\u21AD","Hat":"^","hbar":"\u210F","Hcirc":"\u0124","hcirc":"\u0125","hearts":"\u2665","heartsuit":"\u2665","hellip":"\u2026","hercon":"\u22B9","hfr":"\uD835\uDD25","Hfr":"\u210C","HilbertSpace":"\u210B","hksearow":"\u2925","hkswarow":"\u2926","hoarr":"\u21FF","homtht":"\u223B","hookleftarrow":"\u21A9","hookrightarrow":"\u21AA","hopf":"\uD835\uDD59","Hopf":"\u210D","horbar":"\u2015","HorizontalLine":"\u2500","hscr":"\uD835\uDCBD","Hscr":"\u210B","hslash":"\u210F","Hstrok":"\u0126","hstrok":"\u0127","HumpDownHump":"\u224E","HumpEqual":"\u224F","hybull":"\u2043","hyphen":"\u2010","Iacute":"\u00CD","iacute":"\u00ED","ic":"\u2063","Icirc":"\u00CE","icirc":"\u00EE","Icy":"\u0418","icy":"\u0438","Idot":"\u0130","IEcy":"\u0415","iecy":"\u0435","iexcl":"\u00A1","iff":"\u21D4","ifr":"\uD835\uDD26","Ifr":"\u2111","Igrave":"\u00CC","igrave":"\u00EC","ii":"\u2148","iiiint":"\u2A0C","iiint":"\u222D","iinfin":"\u29DC","iiota":"\u2129","IJlig":"\u0132","ijlig":"\u0133","Imacr":"\u012A","imacr":"\u012B","image":"\u2111","ImaginaryI":"\u2148","imagline":"\u2110","imagpart":"\u2111","imath":"\u0131","Im":"\u2111","imof":"\u22B7","imped":"\u01B5","Implies":"\u21D2","incare":"\u2105","in":"\u2208","infin":"\u221E","infintie":"\u29DD","inodot":"\u0131","intcal":"\u22BA","int":"\u222B","Int":"\u222C","integers":"\u2124","Integral":"\u222B","intercal":"\u22BA","Intersection":"\u22C2","intlarhk":"\u2A17","intprod":"\u2A3C","InvisibleComma":"\u2063","InvisibleTimes":"\u2062","IOcy":"\u0401","iocy":"\u0451","Iogon":"\u012E","iogon":"\u012F","Iopf":"\uD835\uDD40","iopf":"\uD835\uDD5A","Iota":"\u0399","iota":"\u03B9","iprod":"\u2A3C","iquest":"\u00BF","iscr":"\uD835\uDCBE","Iscr":"\u2110","isin":"\u2208","isindot":"\u22F5","isinE":"\u22F9","isins":"\u22F4","isinsv":"\u22F3","isinv":"\u2208","it":"\u2062","Itilde":"\u0128","itilde":"\u0129","Iukcy":"\u0406","iukcy":"\u0456","Iuml":"\u00CF","iuml":"\u00EF","Jcirc":"\u0134","jcirc":"\u0135","Jcy":"\u0419","jcy":"\u0439","Jfr":"\uD835\uDD0D","jfr":"\uD835\uDD27","jmath":"\u0237","Jopf":"\uD835\uDD41","jopf":"\uD835\uDD5B","Jscr":"\uD835\uDCA5","jscr":"\uD835\uDCBF","Jsercy":"\u0408","jsercy":"\u0458","Jukcy":"\u0404","jukcy":"\u0454","Kappa":"\u039A","kappa":"\u03BA","kappav":"\u03F0","Kcedil":"\u0136","kcedil":"\u0137","Kcy":"\u041A","kcy":"\u043A","Kfr":"\uD835\uDD0E","kfr":"\uD835\uDD28","kgreen":"\u0138","KHcy":"\u0425","khcy":"\u0445","KJcy":"\u040C","kjcy":"\u045C","Kopf":"\uD835\uDD42","kopf":"\uD835\uDD5C","Kscr":"\uD835\uDCA6","kscr":"\uD835\uDCC0","lAarr":"\u21DA","Lacute":"\u0139","lacute":"\u013A","laemptyv":"\u29B4","lagran":"\u2112","Lambda":"\u039B","lambda":"\u03BB","lang":"\u27E8","Lang":"\u27EA","langd":"\u2991","langle":"\u27E8","lap":"\u2A85","Laplacetrf":"\u2112","laquo":"\u00AB","larrb":"\u21E4","larrbfs":"\u291F","larr":"\u2190","Larr":"\u219E","lArr":"\u21D0","larrfs":"\u291D","larrhk":"\u21A9","larrlp":"\u21AB","larrpl":"\u2939","larrsim":"\u2973","larrtl":"\u21A2","latail":"\u2919","lAtail":"\u291B","lat":"\u2AAB","late":"\u2AAD","lates":"\u2AAD\uFE00","lbarr":"\u290C","lBarr":"\u290E","lbbrk":"\u2772","lbrace":"{","lbrack":"[","lbrke":"\u298B","lbrksld":"\u298F","lbrkslu":"\u298D","Lcaron":"\u013D","lcaron":"\u013E","Lcedil":"\u013B","lcedil":"\u013C","lceil":"\u2308","lcub":"{","Lcy":"\u041B","lcy":"\u043B","ldca":"\u2936","ldquo":"\u201C","ldquor":"\u201E","ldrdhar":"\u2967","ldrushar":"\u294B","ldsh":"\u21B2","le":"\u2264","lE":"\u2266","LeftAngleBracket":"\u27E8","LeftArrowBar":"\u21E4","leftarrow":"\u2190","LeftArrow":"\u2190","Leftarrow":"\u21D0","LeftArrowRightArrow":"\u21C6","leftarrowtail":"\u21A2","LeftCeiling":"\u2308","LeftDoubleBracket":"\u27E6","LeftDownTeeVector":"\u2961","LeftDownVectorBar":"\u2959","LeftDownVector":"\u21C3","LeftFloor":"\u230A","leftharpoondown":"\u21BD","leftharpoonup":"\u21BC","leftleftarrows":"\u21C7","leftrightarrow":"\u2194","LeftRightArrow":"\u2194","Leftrightarrow":"\u21D4","leftrightarrows":"\u21C6","leftrightharpoons":"\u21CB","leftrightsquigarrow":"\u21AD","LeftRightVector":"\u294E","LeftTeeArrow":"\u21A4","LeftTee":"\u22A3","LeftTeeVector":"\u295A","leftthreetimes":"\u22CB","LeftTriangleBar":"\u29CF","LeftTriangle":"\u22B2","LeftTriangleEqual":"\u22B4","LeftUpDownVector":"\u2951","LeftUpTeeVector":"\u2960","LeftUpVectorBar":"\u2958","LeftUpVector":"\u21BF","LeftVectorBar":"\u2952","LeftVector":"\u21BC","lEg":"\u2A8B","leg":"\u22DA","leq":"\u2264","leqq":"\u2266","leqslant":"\u2A7D","lescc":"\u2AA8","les":"\u2A7D","lesdot":"\u2A7F","lesdoto":"\u2A81","lesdotor":"\u2A83","lesg":"\u22DA\uFE00","lesges":"\u2A93","lessapprox":"\u2A85","lessdot":"\u22D6","lesseqgtr":"\u22DA","lesseqqgtr":"\u2A8B","LessEqualGreater":"\u22DA","LessFullEqual":"\u2266","LessGreater":"\u2276","lessgtr":"\u2276","LessLess":"\u2AA1","lesssim":"\u2272","LessSlantEqual":"\u2A7D","LessTilde":"\u2272","lfisht":"\u297C","lfloor":"\u230A","Lfr":"\uD835\uDD0F","lfr":"\uD835\uDD29","lg":"\u2276","lgE":"\u2A91","lHar":"\u2962","lhard":"\u21BD","lharu":"\u21BC","lharul":"\u296A","lhblk":"\u2584","LJcy":"\u0409","ljcy":"\u0459","llarr":"\u21C7","ll":"\u226A","Ll":"\u22D8","llcorner":"\u231E","Lleftarrow":"\u21DA","llhard":"\u296B","lltri":"\u25FA","Lmidot":"\u013F","lmidot":"\u0140","lmoustache":"\u23B0","lmoust":"\u23B0","lnap":"\u2A89","lnapprox":"\u2A89","lne":"\u2A87","lnE":"\u2268","lneq":"\u2A87","lneqq":"\u2268","lnsim":"\u22E6","loang":"\u27EC","loarr":"\u21FD","lobrk":"\u27E6","longleftarrow":"\u27F5","LongLeftArrow":"\u27F5","Longleftarrow":"\u27F8","longleftrightarrow":"\u27F7","LongLeftRightArrow":"\u27F7","Longleftrightarrow":"\u27FA","longmapsto":"\u27FC","longrightarrow":"\u27F6","LongRightArrow":"\u27F6","Longrightarrow":"\u27F9","looparrowleft":"\u21AB","looparrowright":"\u21AC","lopar":"\u2985","Lopf":"\uD835\uDD43","lopf":"\uD835\uDD5D","loplus":"\u2A2D","lotimes":"\u2A34","lowast":"\u2217","lowbar":"_","LowerLeftArrow":"\u2199","LowerRightArrow":"\u2198","loz":"\u25CA","lozenge":"\u25CA","lozf":"\u29EB","lpar":"(","lparlt":"\u2993","lrarr":"\u21C6","lrcorner":"\u231F","lrhar":"\u21CB","lrhard":"\u296D","lrm":"\u200E","lrtri":"\u22BF","lsaquo":"\u2039","lscr":"\uD835\uDCC1","Lscr":"\u2112","lsh":"\u21B0","Lsh":"\u21B0","lsim":"\u2272","lsime":"\u2A8D","lsimg":"\u2A8F","lsqb":"[","lsquo":"\u2018","lsquor":"\u201A","Lstrok":"\u0141","lstrok":"\u0142","ltcc":"\u2AA6","ltcir":"\u2A79","lt":"<","LT":"<","Lt":"\u226A","ltdot":"\u22D6","lthree":"\u22CB","ltimes":"\u22C9","ltlarr":"\u2976","ltquest":"\u2A7B","ltri":"\u25C3","ltrie":"\u22B4","ltrif":"\u25C2","ltrPar":"\u2996","lurdshar":"\u294A","luruhar":"\u2966","lvertneqq":"\u2268\uFE00","lvnE":"\u2268\uFE00","macr":"\u00AF","male":"\u2642","malt":"\u2720","maltese":"\u2720","Map":"\u2905","map":"\u21A6","mapsto":"\u21A6","mapstodown":"\u21A7","mapstoleft":"\u21A4","mapstoup":"\u21A5","marker":"\u25AE","mcomma":"\u2A29","Mcy":"\u041C","mcy":"\u043C","mdash":"\u2014","mDDot":"\u223A","measuredangle":"\u2221","MediumSpace":"\u205F","Mellintrf":"\u2133","Mfr":"\uD835\uDD10","mfr":"\uD835\uDD2A","mho":"\u2127","micro":"\u00B5","midast":"*","midcir":"\u2AF0","mid":"\u2223","middot":"\u00B7","minusb":"\u229F","minus":"\u2212","minusd":"\u2238","minusdu":"\u2A2A","MinusPlus":"\u2213","mlcp":"\u2ADB","mldr":"\u2026","mnplus":"\u2213","models":"\u22A7","Mopf":"\uD835\uDD44","mopf":"\uD835\uDD5E","mp":"\u2213","mscr":"\uD835\uDCC2","Mscr":"\u2133","mstpos":"\u223E","Mu":"\u039C","mu":"\u03BC","multimap":"\u22B8","mumap":"\u22B8","nabla":"\u2207","Nacute":"\u0143","nacute":"\u0144","nang":"\u2220\u20D2","nap":"\u2249","napE":"\u2A70\u0338","napid":"\u224B\u0338","napos":"\u0149","napprox":"\u2249","natural":"\u266E","naturals":"\u2115","natur":"\u266E","nbsp":"\u00A0","nbump":"\u224E\u0338","nbumpe":"\u224F\u0338","ncap":"\u2A43","Ncaron":"\u0147","ncaron":"\u0148","Ncedil":"\u0145","ncedil":"\u0146","ncong":"\u2247","ncongdot":"\u2A6D\u0338","ncup":"\u2A42","Ncy":"\u041D","ncy":"\u043D","ndash":"\u2013","nearhk":"\u2924","nearr":"\u2197","neArr":"\u21D7","nearrow":"\u2197","ne":"\u2260","nedot":"\u2250\u0338","NegativeMediumSpace":"\u200B","NegativeThickSpace":"\u200B","NegativeThinSpace":"\u200B","NegativeVeryThinSpace":"\u200B","nequiv":"\u2262","nesear":"\u2928","nesim":"\u2242\u0338","NestedGreaterGreater":"\u226B","NestedLessLess":"\u226A","NewLine":"\n","nexist":"\u2204","nexists":"\u2204","Nfr":"\uD835\uDD11","nfr":"\uD835\uDD2B","ngE":"\u2267\u0338","nge":"\u2271","ngeq":"\u2271","ngeqq":"\u2267\u0338","ngeqslant":"\u2A7E\u0338","nges":"\u2A7E\u0338","nGg":"\u22D9\u0338","ngsim":"\u2275","nGt":"\u226B\u20D2","ngt":"\u226F","ngtr":"\u226F","nGtv":"\u226B\u0338","nharr":"\u21AE","nhArr":"\u21CE","nhpar":"\u2AF2","ni":"\u220B","nis":"\u22FC","nisd":"\u22FA","niv":"\u220B","NJcy":"\u040A","njcy":"\u045A","nlarr":"\u219A","nlArr":"\u21CD","nldr":"\u2025","nlE":"\u2266\u0338","nle":"\u2270","nleftarrow":"\u219A","nLeftarrow":"\u21CD","nleftrightarrow":"\u21AE","nLeftrightarrow":"\u21CE","nleq":"\u2270","nleqq":"\u2266\u0338","nleqslant":"\u2A7D\u0338","nles":"\u2A7D\u0338","nless":"\u226E","nLl":"\u22D8\u0338","nlsim":"\u2274","nLt":"\u226A\u20D2","nlt":"\u226E","nltri":"\u22EA","nltrie":"\u22EC","nLtv":"\u226A\u0338","nmid":"\u2224","NoBreak":"\u2060","NonBreakingSpace":"\u00A0","nopf":"\uD835\uDD5F","Nopf":"\u2115","Not":"\u2AEC","not":"\u00AC","NotCongruent":"\u2262","NotCupCap":"\u226D","NotDoubleVerticalBar":"\u2226","NotElement":"\u2209","NotEqual":"\u2260","NotEqualTilde":"\u2242\u0338","NotExists":"\u2204","NotGreater":"\u226F","NotGreaterEqual":"\u2271","NotGreaterFullEqual":"\u2267\u0338","NotGreaterGreater":"\u226B\u0338","NotGreaterLess":"\u2279","NotGreaterSlantEqual":"\u2A7E\u0338","NotGreaterTilde":"\u2275","NotHumpDownHump":"\u224E\u0338","NotHumpEqual":"\u224F\u0338","notin":"\u2209","notindot":"\u22F5\u0338","notinE":"\u22F9\u0338","notinva":"\u2209","notinvb":"\u22F7","notinvc":"\u22F6","NotLeftTriangleBar":"\u29CF\u0338","NotLeftTriangle":"\u22EA","NotLeftTriangleEqual":"\u22EC","NotLess":"\u226E","NotLessEqual":"\u2270","NotLessGreater":"\u2278","NotLessLess":"\u226A\u0338","NotLessSlantEqual":"\u2A7D\u0338","NotLessTilde":"\u2274","NotNestedGreaterGreater":"\u2AA2\u0338","NotNestedLessLess":"\u2AA1\u0338","notni":"\u220C","notniva":"\u220C","notnivb":"\u22FE","notnivc":"\u22FD","NotPrecedes":"\u2280","NotPrecedesEqual":"\u2AAF\u0338","NotPrecedesSlantEqual":"\u22E0","NotReverseElement":"\u220C","NotRightTriangleBar":"\u29D0\u0338","NotRightTriangle":"\u22EB","NotRightTriangleEqual":"\u22ED","NotSquareSubset":"\u228F\u0338","NotSquareSubsetEqual":"\u22E2","NotSquareSuperset":"\u2290\u0338","NotSquareSupersetEqual":"\u22E3","NotSubset":"\u2282\u20D2","NotSubsetEqual":"\u2288","NotSucceeds":"\u2281","NotSucceedsEqual":"\u2AB0\u0338","NotSucceedsSlantEqual":"\u22E1","NotSucceedsTilde":"\u227F\u0338","NotSuperset":"\u2283\u20D2","NotSupersetEqual":"\u2289","NotTilde":"\u2241","NotTildeEqual":"\u2244","NotTildeFullEqual":"\u2247","NotTildeTilde":"\u2249","NotVerticalBar":"\u2224","nparallel":"\u2226","npar":"\u2226","nparsl":"\u2AFD\u20E5","npart":"\u2202\u0338","npolint":"\u2A14","npr":"\u2280","nprcue":"\u22E0","nprec":"\u2280","npreceq":"\u2AAF\u0338","npre":"\u2AAF\u0338","nrarrc":"\u2933\u0338","nrarr":"\u219B","nrArr":"\u21CF","nrarrw":"\u219D\u0338","nrightarrow":"\u219B","nRightarrow":"\u21CF","nrtri":"\u22EB","nrtrie":"\u22ED","nsc":"\u2281","nsccue":"\u22E1","nsce":"\u2AB0\u0338","Nscr":"\uD835\uDCA9","nscr":"\uD835\uDCC3","nshortmid":"\u2224","nshortparallel":"\u2226","nsim":"\u2241","nsime":"\u2244","nsimeq":"\u2244","nsmid":"\u2224","nspar":"\u2226","nsqsube":"\u22E2","nsqsupe":"\u22E3","nsub":"\u2284","nsubE":"\u2AC5\u0338","nsube":"\u2288","nsubset":"\u2282\u20D2","nsubseteq":"\u2288","nsubseteqq":"\u2AC5\u0338","nsucc":"\u2281","nsucceq":"\u2AB0\u0338","nsup":"\u2285","nsupE":"\u2AC6\u0338","nsupe":"\u2289","nsupset":"\u2283\u20D2","nsupseteq":"\u2289","nsupseteqq":"\u2AC6\u0338","ntgl":"\u2279","Ntilde":"\u00D1","ntilde":"\u00F1","ntlg":"\u2278","ntriangleleft":"\u22EA","ntrianglelefteq":"\u22EC","ntriangleright":"\u22EB","ntrianglerighteq":"\u22ED","Nu":"\u039D","nu":"\u03BD","num":"#","numero":"\u2116","numsp":"\u2007","nvap":"\u224D\u20D2","nvdash":"\u22AC","nvDash":"\u22AD","nVdash":"\u22AE","nVDash":"\u22AF","nvge":"\u2265\u20D2","nvgt":">\u20D2","nvHarr":"\u2904","nvinfin":"\u29DE","nvlArr":"\u2902","nvle":"\u2264\u20D2","nvlt":"<\u20D2","nvltrie":"\u22B4\u20D2","nvrArr":"\u2903","nvrtrie":"\u22B5\u20D2","nvsim":"\u223C\u20D2","nwarhk":"\u2923","nwarr":"\u2196","nwArr":"\u21D6","nwarrow":"\u2196","nwnear":"\u2927","Oacute":"\u00D3","oacute":"\u00F3","oast":"\u229B","Ocirc":"\u00D4","ocirc":"\u00F4","ocir":"\u229A","Ocy":"\u041E","ocy":"\u043E","odash":"\u229D","Odblac":"\u0150","odblac":"\u0151","odiv":"\u2A38","odot":"\u2299","odsold":"\u29BC","OElig":"\u0152","oelig":"\u0153","ofcir":"\u29BF","Ofr":"\uD835\uDD12","ofr":"\uD835\uDD2C","ogon":"\u02DB","Ograve":"\u00D2","ograve":"\u00F2","ogt":"\u29C1","ohbar":"\u29B5","ohm":"\u03A9","oint":"\u222E","olarr":"\u21BA","olcir":"\u29BE","olcross":"\u29BB","oline":"\u203E","olt":"\u29C0","Omacr":"\u014C","omacr":"\u014D","Omega":"\u03A9","omega":"\u03C9","Omicron":"\u039F","omicron":"\u03BF","omid":"\u29B6","ominus":"\u2296","Oopf":"\uD835\uDD46","oopf":"\uD835\uDD60","opar":"\u29B7","OpenCurlyDoubleQuote":"\u201C","OpenCurlyQuote":"\u2018","operp":"\u29B9","oplus":"\u2295","orarr":"\u21BB","Or":"\u2A54","or":"\u2228","ord":"\u2A5D","order":"\u2134","orderof":"\u2134","ordf":"\u00AA","ordm":"\u00BA","origof":"\u22B6","oror":"\u2A56","orslope":"\u2A57","orv":"\u2A5B","oS":"\u24C8","Oscr":"\uD835\uDCAA","oscr":"\u2134","Oslash":"\u00D8","oslash":"\u00F8","osol":"\u2298","Otilde":"\u00D5","otilde":"\u00F5","otimesas":"\u2A36","Otimes":"\u2A37","otimes":"\u2297","Ouml":"\u00D6","ouml":"\u00F6","ovbar":"\u233D","OverBar":"\u203E","OverBrace":"\u23DE","OverBracket":"\u23B4","OverParenthesis":"\u23DC","para":"\u00B6","parallel":"\u2225","par":"\u2225","parsim":"\u2AF3","parsl":"\u2AFD","part":"\u2202","PartialD":"\u2202","Pcy":"\u041F","pcy":"\u043F","percnt":"%","period":".","permil":"\u2030","perp":"\u22A5","pertenk":"\u2031","Pfr":"\uD835\uDD13","pfr":"\uD835\uDD2D","Phi":"\u03A6","phi":"\u03C6","phiv":"\u03D5","phmmat":"\u2133","phone":"\u260E","Pi":"\u03A0","pi":"\u03C0","pitchfork":"\u22D4","piv":"\u03D6","planck":"\u210F","planckh":"\u210E","plankv":"\u210F","plusacir":"\u2A23","plusb":"\u229E","pluscir":"\u2A22","plus":"+","plusdo":"\u2214","plusdu":"\u2A25","pluse":"\u2A72","PlusMinus":"\u00B1","plusmn":"\u00B1","plussim":"\u2A26","plustwo":"\u2A27","pm":"\u00B1","Poincareplane":"\u210C","pointint":"\u2A15","popf":"\uD835\uDD61","Popf":"\u2119","pound":"\u00A3","prap":"\u2AB7","Pr":"\u2ABB","pr":"\u227A","prcue":"\u227C","precapprox":"\u2AB7","prec":"\u227A","preccurlyeq":"\u227C","Precedes":"\u227A","PrecedesEqual":"\u2AAF","PrecedesSlantEqual":"\u227C","PrecedesTilde":"\u227E","preceq":"\u2AAF","precnapprox":"\u2AB9","precneqq":"\u2AB5","precnsim":"\u22E8","pre":"\u2AAF","prE":"\u2AB3","precsim":"\u227E","prime":"\u2032","Prime":"\u2033","primes":"\u2119","prnap":"\u2AB9","prnE":"\u2AB5","prnsim":"\u22E8","prod":"\u220F","Product":"\u220F","profalar":"\u232E","profline":"\u2312","profsurf":"\u2313","prop":"\u221D","Proportional":"\u221D","Proportion":"\u2237","propto":"\u221D","prsim":"\u227E","prurel":"\u22B0","Pscr":"\uD835\uDCAB","pscr":"\uD835\uDCC5","Psi":"\u03A8","psi":"\u03C8","puncsp":"\u2008","Qfr":"\uD835\uDD14","qfr":"\uD835\uDD2E","qint":"\u2A0C","qopf":"\uD835\uDD62","Qopf":"\u211A","qprime":"\u2057","Qscr":"\uD835\uDCAC","qscr":"\uD835\uDCC6","quaternions":"\u210D","quatint":"\u2A16","quest":"?","questeq":"\u225F","quot":"\"","QUOT":"\"","rAarr":"\u21DB","race":"\u223D\u0331","Racute":"\u0154","racute":"\u0155","radic":"\u221A","raemptyv":"\u29B3","rang":"\u27E9","Rang":"\u27EB","rangd":"\u2992","range":"\u29A5","rangle":"\u27E9","raquo":"\u00BB","rarrap":"\u2975","rarrb":"\u21E5","rarrbfs":"\u2920","rarrc":"\u2933","rarr":"\u2192","Rarr":"\u21A0","rArr":"\u21D2","rarrfs":"\u291E","rarrhk":"\u21AA","rarrlp":"\u21AC","rarrpl":"\u2945","rarrsim":"\u2974","Rarrtl":"\u2916","rarrtl":"\u21A3","rarrw":"\u219D","ratail":"\u291A","rAtail":"\u291C","ratio":"\u2236","rationals":"\u211A","rbarr":"\u290D","rBarr":"\u290F","RBarr":"\u2910","rbbrk":"\u2773","rbrace":"}","rbrack":"]","rbrke":"\u298C","rbrksld":"\u298E","rbrkslu":"\u2990","Rcaron":"\u0158","rcaron":"\u0159","Rcedil":"\u0156","rcedil":"\u0157","rceil":"\u2309","rcub":"}","Rcy":"\u0420","rcy":"\u0440","rdca":"\u2937","rdldhar":"\u2969","rdquo":"\u201D","rdquor":"\u201D","rdsh":"\u21B3","real":"\u211C","realine":"\u211B","realpart":"\u211C","reals":"\u211D","Re":"\u211C","rect":"\u25AD","reg":"\u00AE","REG":"\u00AE","ReverseElement":"\u220B","ReverseEquilibrium":"\u21CB","ReverseUpEquilibrium":"\u296F","rfisht":"\u297D","rfloor":"\u230B","rfr":"\uD835\uDD2F","Rfr":"\u211C","rHar":"\u2964","rhard":"\u21C1","rharu":"\u21C0","rharul":"\u296C","Rho":"\u03A1","rho":"\u03C1","rhov":"\u03F1","RightAngleBracket":"\u27E9","RightArrowBar":"\u21E5","rightarrow":"\u2192","RightArrow":"\u2192","Rightarrow":"\u21D2","RightArrowLeftArrow":"\u21C4","rightarrowtail":"\u21A3","RightCeiling":"\u2309","RightDoubleBracket":"\u27E7","RightDownTeeVector":"\u295D","RightDownVectorBar":"\u2955","RightDownVector":"\u21C2","RightFloor":"\u230B","rightharpoondown":"\u21C1","rightharpoonup":"\u21C0","rightleftarrows":"\u21C4","rightleftharpoons":"\u21CC","rightrightarrows":"\u21C9","rightsquigarrow":"\u219D","RightTeeArrow":"\u21A6","RightTee":"\u22A2","RightTeeVector":"\u295B","rightthreetimes":"\u22CC","RightTriangleBar":"\u29D0","RightTriangle":"\u22B3","RightTriangleEqual":"\u22B5","RightUpDownVector":"\u294F","RightUpTeeVector":"\u295C","RightUpVectorBar":"\u2954","RightUpVector":"\u21BE","RightVectorBar":"\u2953","RightVector":"\u21C0","ring":"\u02DA","risingdotseq":"\u2253","rlarr":"\u21C4","rlhar":"\u21CC","rlm":"\u200F","rmoustache":"\u23B1","rmoust":"\u23B1","rnmid":"\u2AEE","roang":"\u27ED","roarr":"\u21FE","robrk":"\u27E7","ropar":"\u2986","ropf":"\uD835\uDD63","Ropf":"\u211D","roplus":"\u2A2E","rotimes":"\u2A35","RoundImplies":"\u2970","rpar":")","rpargt":"\u2994","rppolint":"\u2A12","rrarr":"\u21C9","Rrightarrow":"\u21DB","rsaquo":"\u203A","rscr":"\uD835\uDCC7","Rscr":"\u211B","rsh":"\u21B1","Rsh":"\u21B1","rsqb":"]","rsquo":"\u2019","rsquor":"\u2019","rthree":"\u22CC","rtimes":"\u22CA","rtri":"\u25B9","rtrie":"\u22B5","rtrif":"\u25B8","rtriltri":"\u29CE","RuleDelayed":"\u29F4","ruluhar":"\u2968","rx":"\u211E","Sacute":"\u015A","sacute":"\u015B","sbquo":"\u201A","scap":"\u2AB8","Scaron":"\u0160","scaron":"\u0161","Sc":"\u2ABC","sc":"\u227B","sccue":"\u227D","sce":"\u2AB0","scE":"\u2AB4","Scedil":"\u015E","scedil":"\u015F","Scirc":"\u015C","scirc":"\u015D","scnap":"\u2ABA","scnE":"\u2AB6","scnsim":"\u22E9","scpolint":"\u2A13","scsim":"\u227F","Scy":"\u0421","scy":"\u0441","sdotb":"\u22A1","sdot":"\u22C5","sdote":"\u2A66","searhk":"\u2925","searr":"\u2198","seArr":"\u21D8","searrow":"\u2198","sect":"\u00A7","semi":";","seswar":"\u2929","setminus":"\u2216","setmn":"\u2216","sext":"\u2736","Sfr":"\uD835\uDD16","sfr":"\uD835\uDD30","sfrown":"\u2322","sharp":"\u266F","SHCHcy":"\u0429","shchcy":"\u0449","SHcy":"\u0428","shcy":"\u0448","ShortDownArrow":"\u2193","ShortLeftArrow":"\u2190","shortmid":"\u2223","shortparallel":"\u2225","ShortRightArrow":"\u2192","ShortUpArrow":"\u2191","shy":"\u00AD","Sigma":"\u03A3","sigma":"\u03C3","sigmaf":"\u03C2","sigmav":"\u03C2","sim":"\u223C","simdot":"\u2A6A","sime":"\u2243","simeq":"\u2243","simg":"\u2A9E","simgE":"\u2AA0","siml":"\u2A9D","simlE":"\u2A9F","simne":"\u2246","simplus":"\u2A24","simrarr":"\u2972","slarr":"\u2190","SmallCircle":"\u2218","smallsetminus":"\u2216","smashp":"\u2A33","smeparsl":"\u29E4","smid":"\u2223","smile":"\u2323","smt":"\u2AAA","smte":"\u2AAC","smtes":"\u2AAC\uFE00","SOFTcy":"\u042C","softcy":"\u044C","solbar":"\u233F","solb":"\u29C4","sol":"/","Sopf":"\uD835\uDD4A","sopf":"\uD835\uDD64","spades":"\u2660","spadesuit":"\u2660","spar":"\u2225","sqcap":"\u2293","sqcaps":"\u2293\uFE00","sqcup":"\u2294","sqcups":"\u2294\uFE00","Sqrt":"\u221A","sqsub":"\u228F","sqsube":"\u2291","sqsubset":"\u228F","sqsubseteq":"\u2291","sqsup":"\u2290","sqsupe":"\u2292","sqsupset":"\u2290","sqsupseteq":"\u2292","square":"\u25A1","Square":"\u25A1","SquareIntersection":"\u2293","SquareSubset":"\u228F","SquareSubsetEqual":"\u2291","SquareSuperset":"\u2290","SquareSupersetEqual":"\u2292","SquareUnion":"\u2294","squarf":"\u25AA","squ":"\u25A1","squf":"\u25AA","srarr":"\u2192","Sscr":"\uD835\uDCAE","sscr":"\uD835\uDCC8","ssetmn":"\u2216","ssmile":"\u2323","sstarf":"\u22C6","Star":"\u22C6","star":"\u2606","starf":"\u2605","straightepsilon":"\u03F5","straightphi":"\u03D5","strns":"\u00AF","sub":"\u2282","Sub":"\u22D0","subdot":"\u2ABD","subE":"\u2AC5","sube":"\u2286","subedot":"\u2AC3","submult":"\u2AC1","subnE":"\u2ACB","subne":"\u228A","subplus":"\u2ABF","subrarr":"\u2979","subset":"\u2282","Subset":"\u22D0","subseteq":"\u2286","subseteqq":"\u2AC5","SubsetEqual":"\u2286","subsetneq":"\u228A","subsetneqq":"\u2ACB","subsim":"\u2AC7","subsub":"\u2AD5","subsup":"\u2AD3","succapprox":"\u2AB8","succ":"\u227B","succcurlyeq":"\u227D","Succeeds":"\u227B","SucceedsEqual":"\u2AB0","SucceedsSlantEqual":"\u227D","SucceedsTilde":"\u227F","succeq":"\u2AB0","succnapprox":"\u2ABA","succneqq":"\u2AB6","succnsim":"\u22E9","succsim":"\u227F","SuchThat":"\u220B","sum":"\u2211","Sum":"\u2211","sung":"\u266A","sup1":"\u00B9","sup2":"\u00B2","sup3":"\u00B3","sup":"\u2283","Sup":"\u22D1","supdot":"\u2ABE","supdsub":"\u2AD8","supE":"\u2AC6","supe":"\u2287","supedot":"\u2AC4","Superset":"\u2283","SupersetEqual":"\u2287","suphsol":"\u27C9","suphsub":"\u2AD7","suplarr":"\u297B","supmult":"\u2AC2","supnE":"\u2ACC","supne":"\u228B","supplus":"\u2AC0","supset":"\u2283","Supset":"\u22D1","supseteq":"\u2287","supseteqq":"\u2AC6","supsetneq":"\u228B","supsetneqq":"\u2ACC","supsim":"\u2AC8","supsub":"\u2AD4","supsup":"\u2AD6","swarhk":"\u2926","swarr":"\u2199","swArr":"\u21D9","swarrow":"\u2199","swnwar":"\u292A","szlig":"\u00DF","Tab":"\t","target":"\u2316","Tau":"\u03A4","tau":"\u03C4","tbrk":"\u23B4","Tcaron":"\u0164","tcaron":"\u0165","Tcedil":"\u0162","tcedil":"\u0163","Tcy":"\u0422","tcy":"\u0442","tdot":"\u20DB","telrec":"\u2315","Tfr":"\uD835\uDD17","tfr":"\uD835\uDD31","there4":"\u2234","therefore":"\u2234","Therefore":"\u2234","Theta":"\u0398","theta":"\u03B8","thetasym":"\u03D1","thetav":"\u03D1","thickapprox":"\u2248","thicksim":"\u223C","ThickSpace":"\u205F\u200A","ThinSpace":"\u2009","thinsp":"\u2009","thkap":"\u2248","thksim":"\u223C","THORN":"\u00DE","thorn":"\u00FE","tilde":"\u02DC","Tilde":"\u223C","TildeEqual":"\u2243","TildeFullEqual":"\u2245","TildeTilde":"\u2248","timesbar":"\u2A31","timesb":"\u22A0","times":"\u00D7","timesd":"\u2A30","tint":"\u222D","toea":"\u2928","topbot":"\u2336","topcir":"\u2AF1","top":"\u22A4","Topf":"\uD835\uDD4B","topf":"\uD835\uDD65","topfork":"\u2ADA","tosa":"\u2929","tprime":"\u2034","trade":"\u2122","TRADE":"\u2122","triangle":"\u25B5","triangledown":"\u25BF","triangleleft":"\u25C3","trianglelefteq":"\u22B4","triangleq":"\u225C","triangleright":"\u25B9","trianglerighteq":"\u22B5","tridot":"\u25EC","trie":"\u225C","triminus":"\u2A3A","TripleDot":"\u20DB","triplus":"\u2A39","trisb":"\u29CD","tritime":"\u2A3B","trpezium":"\u23E2","Tscr":"\uD835\uDCAF","tscr":"\uD835\uDCC9","TScy":"\u0426","tscy":"\u0446","TSHcy":"\u040B","tshcy":"\u045B","Tstrok":"\u0166","tstrok":"\u0167","twixt":"\u226C","twoheadleftarrow":"\u219E","twoheadrightarrow":"\u21A0","Uacute":"\u00DA","uacute":"\u00FA","uarr":"\u2191","Uarr":"\u219F","uArr":"\u21D1","Uarrocir":"\u2949","Ubrcy":"\u040E","ubrcy":"\u045E","Ubreve":"\u016C","ubreve":"\u016D","Ucirc":"\u00DB","ucirc":"\u00FB","Ucy":"\u0423","ucy":"\u0443","udarr":"\u21C5","Udblac":"\u0170","udblac":"\u0171","udhar":"\u296E","ufisht":"\u297E","Ufr":"\uD835\uDD18","ufr":"\uD835\uDD32","Ugrave":"\u00D9","ugrave":"\u00F9","uHar":"\u2963","uharl":"\u21BF","uharr":"\u21BE","uhblk":"\u2580","ulcorn":"\u231C","ulcorner":"\u231C","ulcrop":"\u230F","ultri":"\u25F8","Umacr":"\u016A","umacr":"\u016B","uml":"\u00A8","UnderBar":"_","UnderBrace":"\u23DF","UnderBracket":"\u23B5","UnderParenthesis":"\u23DD","Union":"\u22C3","UnionPlus":"\u228E","Uogon":"\u0172","uogon":"\u0173","Uopf":"\uD835\uDD4C","uopf":"\uD835\uDD66","UpArrowBar":"\u2912","uparrow":"\u2191","UpArrow":"\u2191","Uparrow":"\u21D1","UpArrowDownArrow":"\u21C5","updownarrow":"\u2195","UpDownArrow":"\u2195","Updownarrow":"\u21D5","UpEquilibrium":"\u296E","upharpoonleft":"\u21BF","upharpoonright":"\u21BE","uplus":"\u228E","UpperLeftArrow":"\u2196","UpperRightArrow":"\u2197","upsi":"\u03C5","Upsi":"\u03D2","upsih":"\u03D2","Upsilon":"\u03A5","upsilon":"\u03C5","UpTeeArrow":"\u21A5","UpTee":"\u22A5","upuparrows":"\u21C8","urcorn":"\u231D","urcorner":"\u231D","urcrop":"\u230E","Uring":"\u016E","uring":"\u016F","urtri":"\u25F9","Uscr":"\uD835\uDCB0","uscr":"\uD835\uDCCA","utdot":"\u22F0","Utilde":"\u0168","utilde":"\u0169","utri":"\u25B5","utrif":"\u25B4","uuarr":"\u21C8","Uuml":"\u00DC","uuml":"\u00FC","uwangle":"\u29A7","vangrt":"\u299C","varepsilon":"\u03F5","varkappa":"\u03F0","varnothing":"\u2205","varphi":"\u03D5","varpi":"\u03D6","varpropto":"\u221D","varr":"\u2195","vArr":"\u21D5","varrho":"\u03F1","varsigma":"\u03C2","varsubsetneq":"\u228A\uFE00","varsubsetneqq":"\u2ACB\uFE00","varsupsetneq":"\u228B\uFE00","varsupsetneqq":"\u2ACC\uFE00","vartheta":"\u03D1","vartriangleleft":"\u22B2","vartriangleright":"\u22B3","vBar":"\u2AE8","Vbar":"\u2AEB","vBarv":"\u2AE9","Vcy":"\u0412","vcy":"\u0432","vdash":"\u22A2","vDash":"\u22A8","Vdash":"\u22A9","VDash":"\u22AB","Vdashl":"\u2AE6","veebar":"\u22BB","vee":"\u2228","Vee":"\u22C1","veeeq":"\u225A","vellip":"\u22EE","verbar":"|","Verbar":"\u2016","vert":"|","Vert":"\u2016","VerticalBar":"\u2223","VerticalLine":"|","VerticalSeparator":"\u2758","VerticalTilde":"\u2240","VeryThinSpace":"\u200A","Vfr":"\uD835\uDD19","vfr":"\uD835\uDD33","vltri":"\u22B2","vnsub":"\u2282\u20D2","vnsup":"\u2283\u20D2","Vopf":"\uD835\uDD4D","vopf":"\uD835\uDD67","vprop":"\u221D","vrtri":"\u22B3","Vscr":"\uD835\uDCB1","vscr":"\uD835\uDCCB","vsubnE":"\u2ACB\uFE00","vsubne":"\u228A\uFE00","vsupnE":"\u2ACC\uFE00","vsupne":"\u228B\uFE00","Vvdash":"\u22AA","vzigzag":"\u299A","Wcirc":"\u0174","wcirc":"\u0175","wedbar":"\u2A5F","wedge":"\u2227","Wedge":"\u22C0","wedgeq":"\u2259","weierp":"\u2118","Wfr":"\uD835\uDD1A","wfr":"\uD835\uDD34","Wopf":"\uD835\uDD4E","wopf":"\uD835\uDD68","wp":"\u2118","wr":"\u2240","wreath":"\u2240","Wscr":"\uD835\uDCB2","wscr":"\uD835\uDCCC","xcap":"\u22C2","xcirc":"\u25EF","xcup":"\u22C3","xdtri":"\u25BD","Xfr":"\uD835\uDD1B","xfr":"\uD835\uDD35","xharr":"\u27F7","xhArr":"\u27FA","Xi":"\u039E","xi":"\u03BE","xlarr":"\u27F5","xlArr":"\u27F8","xmap":"\u27FC","xnis":"\u22FB","xodot":"\u2A00","Xopf":"\uD835\uDD4F","xopf":"\uD835\uDD69","xoplus":"\u2A01","xotime":"\u2A02","xrarr":"\u27F6","xrArr":"\u27F9","Xscr":"\uD835\uDCB3","xscr":"\uD835\uDCCD","xsqcup":"\u2A06","xuplus":"\u2A04","xutri":"\u25B3","xvee":"\u22C1","xwedge":"\u22C0","Yacute":"\u00DD","yacute":"\u00FD","YAcy":"\u042F","yacy":"\u044F","Ycirc":"\u0176","ycirc":"\u0177","Ycy":"\u042B","ycy":"\u044B","yen":"\u00A5","Yfr":"\uD835\uDD1C","yfr":"\uD835\uDD36","YIcy":"\u0407","yicy":"\u0457","Yopf":"\uD835\uDD50","yopf":"\uD835\uDD6A","Yscr":"\uD835\uDCB4","yscr":"\uD835\uDCCE","YUcy":"\u042E","yucy":"\u044E","yuml":"\u00FF","Yuml":"\u0178","Zacute":"\u0179","zacute":"\u017A","Zcaron":"\u017D","zcaron":"\u017E","Zcy":"\u0417","zcy":"\u0437","Zdot":"\u017B","zdot":"\u017C","zeetrf":"\u2128","ZeroWidthSpace":"\u200B","Zeta":"\u0396","zeta":"\u03B6","zfr":"\uD835\uDD37","Zfr":"\u2128","ZHcy":"\u0416","zhcy":"\u0436","zigrarr":"\u21DD","zopf":"\uD835\uDD6B","Zopf":"\u2124","Zscr":"\uD835\uDCB5","zscr":"\uD835\uDCCF","zwj":"\u200D","zwnj":"\u200C"}
  },{}],13:[function(dynamicRequire,module,exports){
  module.exports={"Aacute":"\u00C1","aacute":"\u00E1","Acirc":"\u00C2","acirc":"\u00E2","acute":"\u00B4","AElig":"\u00C6","aelig":"\u00E6","Agrave":"\u00C0","agrave":"\u00E0","amp":"&","AMP":"&","Aring":"\u00C5","aring":"\u00E5","Atilde":"\u00C3","atilde":"\u00E3","Auml":"\u00C4","auml":"\u00E4","brvbar":"\u00A6","Ccedil":"\u00C7","ccedil":"\u00E7","cedil":"\u00B8","cent":"\u00A2","copy":"\u00A9","COPY":"\u00A9","curren":"\u00A4","deg":"\u00B0","divide":"\u00F7","Eacute":"\u00C9","eacute":"\u00E9","Ecirc":"\u00CA","ecirc":"\u00EA","Egrave":"\u00C8","egrave":"\u00E8","ETH":"\u00D0","eth":"\u00F0","Euml":"\u00CB","euml":"\u00EB","frac12":"\u00BD","frac14":"\u00BC","frac34":"\u00BE","gt":">","GT":">","Iacute":"\u00CD","iacute":"\u00ED","Icirc":"\u00CE","icirc":"\u00EE","iexcl":"\u00A1","Igrave":"\u00CC","igrave":"\u00EC","iquest":"\u00BF","Iuml":"\u00CF","iuml":"\u00EF","laquo":"\u00AB","lt":"<","LT":"<","macr":"\u00AF","micro":"\u00B5","middot":"\u00B7","nbsp":"\u00A0","not":"\u00AC","Ntilde":"\u00D1","ntilde":"\u00F1","Oacute":"\u00D3","oacute":"\u00F3","Ocirc":"\u00D4","ocirc":"\u00F4","Ograve":"\u00D2","ograve":"\u00F2","ordf":"\u00AA","ordm":"\u00BA","Oslash":"\u00D8","oslash":"\u00F8","Otilde":"\u00D5","otilde":"\u00F5","Ouml":"\u00D6","ouml":"\u00F6","para":"\u00B6","plusmn":"\u00B1","pound":"\u00A3","quot":"\"","QUOT":"\"","raquo":"\u00BB","reg":"\u00AE","REG":"\u00AE","sect":"\u00A7","shy":"\u00AD","sup1":"\u00B9","sup2":"\u00B2","sup3":"\u00B3","szlig":"\u00DF","THORN":"\u00DE","thorn":"\u00FE","times":"\u00D7","Uacute":"\u00DA","uacute":"\u00FA","Ucirc":"\u00DB","ucirc":"\u00FB","Ugrave":"\u00D9","ugrave":"\u00F9","uml":"\u00A8","Uuml":"\u00DC","uuml":"\u00FC","Yacute":"\u00DD","yacute":"\u00FD","yen":"\u00A5","yuml":"\u00FF"}
  },{}],14:[function(dynamicRequire,module,exports){
  module.exports={"amp":"&","apos":"'","gt":">","lt":"<","quot":"\""}

  },{}],"fast-html-parser":[function(dynamicRequire,module,exports){
  dynamicRequire('apollojs');

  var entities = dynamicRequire('entities');

  /**
   * Node Class as base class for TextNode and HTMLElement.
   */
  function Node() {

  }
  $declare(Node, {

  });
  $defenum(Node, {
    ELEMENT_NODE:  1,
    TEXT_NODE:     3
  });

  /**
   * TextNode to contain a text element in DOM tree.
   * @param {string} value [description]
   */
  function TextNode(value) {
    this.nodeValue = entities.decodeHTML5(value);
    this.nodeName = '#text';
    this.element = pools.uuid.get();
  }
  $inherit(TextNode, Node, {
    /**
     * Node Type declaration.
     * @type {Number}
     */
    nodeType: Node.TEXT_NODE,

    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
      return entities.decodeHTML5(this.rawText);
    },

    /**
     * Detect if the node contains only white space.
     * @return {bool}
     */
    get isWhitespace() {
      return /^(\s|&nbsp;)*$/.test(this.nodeValue);
    }

  });

  var kBlockElements = {
    div: true,
    p: true,
    // ul: true,
    // ol: true,
    li: true,
    // table: true,
    // tr: true,
    td: true,
    section: true,
    br: true
  };

  /**
   * HTMLElement, which contains a set of children.
   * Note: this is a minimalist implementation, no complete tree
   *   structure provided (no parentNode, nextSibling,
   *   previousSibling etc).
   * @param {string} name     nodeName
   * @param {Object} keyAttrs id and class attribute
   * @param {Object} rawAttrs attributes in string
   */
  function HTMLElement(name, keyAttrs, rawAttrs) {
    this.nodeName = name;
    this.attributes = [];

    if (rawAttrs) {
      var re = /\b([a-z][a-z0-9\-]*)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;

      for (var match; match = re.exec(rawAttrs); ) {
        var attr = {};
        attr.name = match[1];
        attr.value = match[3] || match[4] || match[5];
        this.attributes.push(attr);
      }
    }

    // this.parentNode = null;
    this.childNodes = [];
    this.element = pools.uuid.get();
  }
  $inherit(HTMLElement, Node, {

    /**
     * Node Type declaration.
     * @type {Number}
     */
    nodeType: Node.ELEMENT_NODE,

    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
      return entities.decodeHTML5(this.rawText);
    },

    /**
     * Get escpaed (as-it) text value of current node and its children.
     * @return {string} text content
     */
    get rawText() {
      var res = '';
      for (var i = 0; i < this.childNodes.length; i++)
        res += this.childNodes[i].rawText;
      return res;
    },

    /**
     * Remove whitespaces in this sub tree.
     * @return {HTMLElement} pointer to this
     */
    removeWhitespace: function() {
      var i = 0, o = 0;
      for (; i < this.childNodes.length; i++) {
        var node = this.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.isWhitespace)
            continue;
          node.nodeValue = node.nodeValue.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.removeWhitespace();
        }
        this.childNodes[o++] = node;
      }
      this.childNodes.length = o;
      return this;
    }
  });
  $define(HTMLElement, {
    __wrap: function(el) {
      el.childNodes.forEach(function(node) {
        if (node.rawText) {
          $wrap(node, TextNode);
        } else {
          $wrap(node, HTMLElement);
        }
      });
    }
  });

  /**
   * Cache to store generated match functions
   * @type {Object}
   */
  var pMatchFunctionCache = {};

  /**
   * Matcher class to make CSS match
   * @param {string} selector Selector
   */
  function Matcher(selector) {
    this.matchers = selector.split(' ').map(function(matcher) {
      if (pMatchFunctionCache[matcher])
        return pMatchFunctionCache[matcher];
      var parts = matcher.split('.');
      var nodeName = parts[0];
      var classes = parts.slice(1).sort();
      var source = '';
      if (nodeName && nodeName != '*') {
        if (nodeName[0] == '#')
          source += 'if (el.id != ' + JSON.stringify(nodeName.substr(1)) + ') return false;';
        else
          source += 'if (el.nodeName != ' + JSON.stringify(nodeName) + ') return false;';
      }
      if (classes.length > 0)
        source += 'for (var cls = ' + JSON.stringify(classes) + ', i = 0; i < cls.length; i++) if (el.classNames.indexOf(cls[i]) === -1) return false;';
      source += 'return true;';
      return pMatchFunctionCache[matcher] = new Function('el', source);
    });
    this.nextMatch = 0;
  }
  $declare(Matcher, {
    /**
     * Trying to advance match pointer
     * @param  {HTMLElement} el element to make the match
     * @return {bool}           true when pointer advanced.
     */
    advance: function(el) {
      if (this.nextMatch < this.matchers.length &&
          this.matchers[this.nextMatch](el)) {
        this.nextMatch++;
        return true;
      }
      return false;
    },
    /**
     * Rewind the match pointer
     */
    rewind: function() {
      this.nextMatch--;
    },
    /**
     * Trying to determine if match made.
     * @return {bool} true when the match is made
     */
    get matched() {
      return this.nextMatch == this.matchers.length;
    },
    /**
     * Rest match pointer.
     * @return {[type]} [description]
     */
    reset: function() {
      this.nextMatch = 0;
    }
  });
  $define(Matcher, {
    /**
     * flush cache to free memory
     */
    flushCache: function() {
      pMatchFunctionCache = {};
    }
  });

  var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/ig;
  var kAttributePattern = /\b(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
  var kSelfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
  };
  var kElementsClosedByOpening = {
    li: {li: true},
    p: {p: true, div: true},
    td: {td: true, th: true},
    th: {td: true, th: true}
  };
  var kElementsClosedByClosing = {
    li: {ul: true, ol: true},
    a: {div: true},
    b: {div: true},
    i: {div: true},
    p: {div: true},
    td: {tr: true, table: true},
    th: {tr: true, table: true}
  };
  var kBlockTextElements = {
    script: true,
    noscript: true,
    style: true,
    pre: true
  };

  /**
   * Parses HTML and returns a root element
   */
  module.exports = {

    Matcher: Matcher,
    Node: Node,
    HTMLElement: HTMLElement,
    TextNode: TextNode,

    /**
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    parse: function(data, options) {

      var root = new HTMLElement(null, {});
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      options = options || {};

      for (var match, text; match = kMarkupPattern.exec(data); ) {
        if (lastTextPos > -1) {
          if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
            // if has content
            text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
            if (text.trim()) {
              currentParent.childNodes.push({
                nodeName: '#text',
                element: pools.uuid.get(),
                nodeValue: entities.decodeHTML5(text)
              });
            }
          }
        }
        lastTextPos = kMarkupPattern.lastIndex;
        if (match[0][1] == '!') {
          // this is a comment
          continue;
        }
        if (options.lowerCaseTagName)
          match[2] = match[2].toLowerCase();
        if (!match[1]) {
          // not </ tags
          var attrs = {};
          for (var attMatch; attMatch = kAttributePattern.exec(match[3]); )
            attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
          if (!match[4] && kElementsClosedByOpening[currentParent.nodeName]) {
            if (kElementsClosedByOpening[currentParent.nodeName][match[2]]) {
              stack.pop();
              currentParent = stack.back;
            }
          }
          currentParent = currentParent.childNodes[currentParent.childNodes.push(
              new HTMLElement(match[2], attrs, match[3])) - 1];
          stack.push(currentParent);
          if (kBlockTextElements[match[2]]) {
            // a little test to find next </script> or </style> ...
            var closeMarkup = '</' + match[2] + '>';
            var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
            if (options[match[2]]) {
              if (index == -1) {
                // there is no matching ending for the text element.
                text = data.substr(kMarkupPattern.lastIndex);
              } else {
                text = data.substring(kMarkupPattern.lastIndex, index);
              }
              if (text.length > 0)
                currentParent.childNodes.push({
                  nodeValue: entities.decodeHTML5(text),
                  nodeName: '#text',
                  element: pools.uuid.get()
                });
            }
            if (index == -1) {
              lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
            } else {
              lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
              match[1] = true;
            }
          }
        }
        if (match[1] || match[4] ||
            kSelfClosingElements[match[2]]) {
          // </ or /> or <br> etc.
          while (true) {
            if (currentParent.nodeName == match[2]) {
              stack.pop();
              currentParent = stack.back;
              break;
            } else {
              // Trying to close current tag, and move on
              if (kElementsClosedByClosing[currentParent.nodeName]) {
                if (kElementsClosedByClosing[currentParent.nodeName][match[2]]) {
                  stack.pop();
                  currentParent = stack.back;
                  continue;
                }
              }
              // Use aggressive strategy to handle unmatching markups.
              break;
            }
          }
        }
      }

      return root;

    }

  };

  },{"apollojs":6,"entities":7}]},{},[])("fast-html-parser")
  });

  return g.htmlParser;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./pools":10}],10:[function(require,module,exports){
var pools = exports;
var uuid = require('./uuid');

function createPool(size, name, fill) {
  var free = [];
  var allocated = [];
  var index = new WeakMap();

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    _free: free,
    _allocated: allocated,

    get: function() {
      var obj = null;
      var freeLength = free.length;
      var minusOne = freeLength - 1;

      if (freeLength) {
        obj = free[minusOne];
        free.length = minusOne;
      }
      else {
        obj = fill();
      }

      var idx = allocated.push(obj);

      if (typeof obj === 'string') {
        index[obj] = idx;
      }
      else {
        index.set(obj, idx - 1);
      }

      return obj;
    },

    freeAll: function() {
      var allocatedLength = allocated.length;

      for (var i = 0; i < allocatedLength; i++) {
        var obj = allocated[i];

        if (typeof obj === 'string') {
          var idx = index[obj];
          delete index[obj];
        }
        else {
          var idx = index.get(obj);
          // Remove from index map.
          index.delete(obj);
        }

        idx = idx || -1;

        // Already freed.
        if (idx === -1) { continue; }

        // Clean.
        if (obj.length) {
          obj.length = 0;
        }
        else {
          for (var key in obj) {
            obj[key] = void 0;
          }
        }

        // Only put back into the free queue if we're under the size.
        free.push(obj);
      }

      allocated.length = 0;
    },

    free: function(obj) {
      if (typeof obj === 'string') {
        var idx = index[obj];
        delete index[obj];
      }
      else {
        var idx = index.get(obj);
        // Remove from index map.
        index.delete(obj);
      }

      idx = idx || -1;

      // Already freed.
      if (idx === -1) { return; }

      // Clean.
      if (obj.length) {
        obj.length = 0;
      }
      else {
        for (var key in obj) {
          obj[key] = void 0;
        }
      }

      // Only put back into the free queue if we're under the size.
      if (free.length < size) {
        free.push(obj);
      }

      allocated.splice(idx, 1);
    }
  };
}


function initializePools(COUNT) {
  pools.object = createPool(COUNT, 'object', function() {
    return {};
  });

  pools.array = createPool(COUNT, 'array', function() {
    return [];
  });

  pools.uuid = createPool(COUNT, 'uuid', function() {
    return uuid();
  });
}

exports.create = createPool;
exports.initialize = initializePools;

},{"./uuid":11}],11:[function(require,module,exports){
/**
 * Generates a uuid.
 *
 * @see http://stackoverflow.com/a/2117523/282175
 * @return {string} uuid
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports = uuid;

},{}],12:[function(require,module,exports){
function startup(worker) {
  var oldTree = null;
  var patches = [];

  worker.onmessage = function(e) {
    //console.time('render');
    var data = e.data;
    var offset = data.offset;
    var transferBuffer = data.buffer;
    var isInner = data.isInner;

    var newBuffer = transferBuffer.slice(0, offset);
    var newHTML = bufferToString(newBuffer);

    if (offset && !oldTree) {
      // Keep a virtual tree in memory to diff against.
      oldTree = e.data.oldTree;
    }

    // Calculate a new tree.
    //console.time('parse');
    var newTree = parseHTML(newHTML);
    //console.timeEnd('parse');

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be excuted to update the DOM.
    //console.time('sync');
    syncNode.call(patches, oldTree, newTree);
    //console.timeEnd('sync');

    // Attach inner state.
    patches.isInner = isInner;

    // Send the patches back to the userland.
    worker.postMessage(patches);

    // Free the new tree, as this node will never change.
    //console.time('clean');
    //console.log(pools.uuid._allocated.length);

    // Cleanup sync node allocations.
    pools.uuid.freeAll();
    pools.object.freeAll();
    pools.array.freeAll();

    //console.timeEnd('clean');
    //console.info('Objects free: %s', pools.array._free.length);
    //console.info('Arrays allocated: %o', pools.array._allocated);
    //console.info('Objects allocated: %o', pools.object._allocated);
    //console.info('UUIDs allocated: %o', pools.uuid._allocated);

    // Wipe out the patches in memory.
    patches.length = 0;
    //console.timeEnd('render');
  };
}

module.exports = startup;

},{}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZGlmZi9tYWtlX2VsZW1lbnQuanMiLCJsaWIvZGlmZi9tYWtlX25vZGUuanMiLCJsaWIvZGlmZi9wYXRjaF9ub2RlLmpzIiwibGliL2RpZmYvc3ZnLmpzIiwibGliL2RpZmYvc3luY19ub2RlLmpzIiwibGliL2luZGV4LmpzIiwibGliL3V0aWwvYnVmZmVycy5qcyIsImxpYi91dGlsL2h0bWxzLmpzIiwibGliL3V0aWwvcGFyc2VyLmpzIiwibGliL3V0aWwvcG9vbHMuanMiLCJsaWIvdXRpbC91dWlkLmpzIiwibGliL3dvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNucEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtYWtlTm9kZSA9IHJlcXVpcmUoJy4vbWFrZV9ub2RlJyk7XG52YXIgc3ZnID0gcmVxdWlyZSgnLi9zdmcnKTtcblxuZnVuY3Rpb24gbWFrZUVsZW1lbnQoZGVzY3JpcHRvcikge1xuICB2YXIgZWxlbWVudCA9IG51bGw7XG4gIHZhciBpc1N2ZyA9IGZhbHNlO1xuXG4gIGlmIChkZXNjcmlwdG9yLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRlc2NyaXB0b3Iubm9kZVZhbHVlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoc3ZnLmVsZW1lbnRzLmluZGV4T2YoZGVzY3JpcHRvci5ub2RlTmFtZSkgPiAtMSkge1xuICAgICAgaXNTdmcgPSB0cnVlO1xuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmcubmFtZXNwYWNlLCBkZXNjcmlwdG9yLm5vZGVOYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkZXNjcmlwdG9yLm5vZGVOYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRvci5hdHRyaWJ1dGVzICYmIGRlc2NyaXB0b3IuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzY3JpcHRvci5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyaWJ1dGUgPSBkZXNjcmlwdG9yLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChpc1N2Zykge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRvci5jaGlsZE5vZGVzICYmIGRlc2NyaXB0b3IuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzY3JpcHRvci5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobWFrZUVsZW1lbnQoZGVzY3JpcHRvci5jaGlsZE5vZGVzW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIHRvIHRoZSBub2RlcyBjYWNoZSB1c2luZyB0aGUgZGVzaWduYXRlZCBpZC5cbiAgbWFrZU5vZGUubm9kZXNbZGVzY3JpcHRvci5lbGVtZW50XSA9IGVsZW1lbnQ7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZUVsZW1lbnQ7XG4iLCJ2YXIgcG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG52YXIgcHVzaCA9IEFycmF5LnByb3RvdHlwZS5wdXNoO1xuXG52YXIgbm9kZXMgPSBtYWtlTm9kZS5ub2RlcyA9IHt9O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgbGl2ZSBub2RlIGludG8gYSB2aXJ0dWFsIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGVcbiAqIEByZXR1cm5cbiAqL1xuZnVuY3Rpb24gbWFrZU5vZGUobm9kZSkge1xuICAvLyBJZiB0aGlzIG5vZGUgaGFzIGFscmVhZHkgYmVlbiBjb252ZXJ0ZWQsIGRvIG5vdCBhdHRlbXB0IHRvIGNvbnZlcnQgYWdhaW4uXG4gIGlmIChub2RlICYmIG5vZGUuX19ub2RlX18pIHtcbiAgICByZXR1cm4gbm9kZS5fX25vZGVfXztcbiAgfVxuXG4gIHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGU7XG4gIHZhciBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZTtcblxuICBpZiAoIW5vZGVUeXBlIHx8IG5vZGVUeXBlID09PSAyIHx8IG5vZGVUeXBlID09PSA0IHx8IG5vZGVUeXBlID09PSA4KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG5vZGVUeXBlID09PSAzICYmICFub2RlVmFsdWUudHJpbSgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVmlydHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIG5vZGUsIGNvbnRhaW5pbmcgb25seSB0aGUgZGF0YSB3ZSB3aXNoIHRvXG4gIC8vIGRpZmYgYW5kIHBhdGNoLlxuICB2YXIgZW50cnkgPSB7fTtcblxuICAvLyBDYWNoZSB0aGUgZWxlbWVudCBpbiB0aGUgaWRzLlxuICB2YXIgaWQgPSBwb29scy51dWlkLmdldCgpO1xuXG4gIC8vIEFkZCB0byBpbnRlcm5hbCBsb29rdXAuXG4gIG5vZGVzW2lkXSA9IG5vZGU7XG5cbiAgLy8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGlzIG9iamVjdC5cbiAgbm9kZS5fX25vZGVfXyA9IGVudHJ5O1xuXG4gIGVudHJ5LmVsZW1lbnQgPSBpZDtcbiAgZW50cnkubm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGVudHJ5Lm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcbiAgZW50cnkuY2hpbGROb2RlcyA9IFtdO1xuICBlbnRyeS5hdHRyaWJ1dGVzID0gW107XG5cbiAgLy8gQ29sbGVjdCBhdHRyaWJ1dGVzLlxuICB2YXIgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAvLyBJZiB0aGUgZWxlbWVudCBoYXMgbm8gYXR0cmlidXRlcywgc2tpcCBvdmVyLlxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBhdHRyaWJ1dGVzTGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICBpZiAoYXR0cmlidXRlc0xlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcHVzaC5jYWxsKGVudHJ5LmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVzW2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNbaV0udmFsdWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29sbGVjdCBjaGlsZE5vZGVzLlxuICB2YXIgY2hpbGROb2RlcyA9IG5vZGUuY2hpbGROb2RlcztcbiAgdmFyIGNoaWxkTm9kZXNMZW5ndGggPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuICB2YXIgbmV3Tm9kZSA9IG51bGw7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIGNoaWxkIG5vZGVzLCBjb252ZXJ0IHRoZW0gYWxsIHRvIHZpcnR1YWwgbm9kZXMuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSAzICYmIGNoaWxkTm9kZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgbmV3Tm9kZSA9IG1ha2VOb2RlKGNoaWxkTm9kZXNbaV0pO1xuXG4gICAgICBpZiAobmV3Tm9kZSkge1xuICAgICAgICBlbnRyeS5jaGlsZE5vZGVzLnB1c2gobmV3Tm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VOb2RlO1xuIiwidmFyIHBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xudmFyIHBvb2xDb3VudCA9IDEwMDAwO1xuXG4vLyBJbml0aWFsaXplIHdpdGggYSByZWFzb25hYmxlIGFtb3VudCBvZiBvYmplY3RzLlxucG9vbHMuaW5pdGlhbGl6ZShwb29sQ291bnQpO1xuXG52YXIgaHRtbHMgPSByZXF1aXJlKCcuLi91dGlsL2h0bWxzJyk7XG52YXIgcGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbC9wYXJzZXInKTtcbnZhciBidWZmZXJzID0gcmVxdWlyZSgnLi4vdXRpbC9idWZmZXJzJyk7XG52YXIgc3luY05vZGUgPSByZXF1aXJlKCcuL3N5bmNfbm9kZScpO1xudmFyIG1ha2VOb2RlID0gcmVxdWlyZSgnLi9tYWtlX25vZGUnKTtcbnZhciBtYWtlRWxlbWVudCA9IHJlcXVpcmUoJy4vbWFrZV9lbGVtZW50Jyk7XG5cbnZhciBoYXNXb3JrZXIgPSB0eXBlb2YgV29ya2VyID09PSAnZnVuY3Rpb24nO1xudmFyIG9sZFRyZWUgPSBudWxsO1xudmFyIGlzUmVuZGVyaW5nID0gZmFsc2U7XG52YXIgc3luY2VkID0gZmFsc2U7XG5cbi8vIFNldCB1cCBhIFdlYldvcmtlciBpZiBhdmFpbGFibGUuXG5pZiAoaGFzV29ya2VyKSB7XG4gIC8vIENvbnN0cnVjdCB0aGUgd29ya2VyIHJldXNpbmcgY29kZSBhbHJlYWR5IG9yZ2FuaXplZCBpbnRvIG1vZHVsZXMuXG4gIHZhciB3b3JrZXJCbG9iID0gbmV3IEJsb2IoW1xuICAgIFtcbiAgICAgIC8vIFJldXNhYmxlIEFycmF5IG1ldGhvZHMuXG4gICAgICAndmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlOycsXG4gICAgICAndmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7JyxcblxuICAgICAgLy8gQWRkIGEgbmFtZXNwYWNlIHRvIGF0dGFjaCBwb29sIG1ldGhvZHMgdG8uXG4gICAgICAndmFyIHBvb2xzID0ge307JyxcbiAgICAgICd2YXIgbm9kZXMgPSAwOycsXG5cbiAgICAgIC8vIEFkZHMgaW4gYSBnbG9iYWwgYHV1aWRgIGZ1bmN0aW9uLlxuICAgICAgcmVxdWlyZSgnLi4vdXRpbC91dWlkJyksXG5cbiAgICAgIC8vIEFkZCBpbiBwb29sIG1hbmlwdWxhdGlvbiBtZXRob2RzLlxuICAgICAgcG9vbHMuY3JlYXRlLFxuICAgICAgcG9vbHMuaW5pdGlhbGl6ZSxcbiAgICAgICdpbml0aWFsaXplUG9vbHMoJyArIHBvb2xDb3VudCArICcpOycsXG5cbiAgICAgIC8vIEFkZCBpbiBOb2RlIG1hbmlwdWxhdGlvbi5cbiAgICAgIHN5bmNOb2RlLmZpbHRlcixcbiAgICAgIHN5bmNOb2RlLnN5bmMsXG5cbiAgICAgIC8vIEFkZCBpbiB0aGUgYWJpbGl0eSB0byBwYXJzZUhUTUwuXG4gICAgICBodG1scy5wYXJzZUhUTUwsXG5cbiAgICAgIC8vIEdpdmUgdGhlIHdlYndvcmtlciB1dGlsaXRpZXMuXG4gICAgICBidWZmZXJzLnN0cmluZ1RvQnVmZmVyLFxuICAgICAgYnVmZmVycy5idWZmZXJUb1N0cmluZyxcblxuICAgICAgcGFyc2VyLm1ha2VQYXJzZXIsXG4gICAgICAndmFyIHBhcnNlciA9IG1ha2VQYXJzZXIoKTsnLFxuXG4gICAgICAvLyBBZGQgaW4gdGhlIHdvcmtlciBzb3VyY2UuXG4gICAgICByZXF1aXJlKCcuLi93b3JrZXInKSxcblxuICAgICAgLy8gTWV0YXByb2dyYW1taW5nIHVwIHRoaXMgd29ya2VyIGNhbGwuXG4gICAgICAnc3RhcnR1cChzZWxmKTsnXG4gICAgXS5qb2luKCdcXG4nKVxuICBdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblxuICAvLyBDb25zdHJ1Y3QgdGhlIHdvcmtlciBhbmQgc3RhcnQgaXQgdXAuXG4gIHZhciB3b3JrZXIgPSBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwod29ya2VyQmxvYikpO1xufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50KHJlZikge1xuICB2YXIgZWxlbWVudCA9IHJlZi5lbGVtZW50IHx8IHJlZjtcblxuICAvLyBBbHJlYWR5IGNyZWF0ZWQuXG4gIGlmIChlbGVtZW50IGluIG1ha2VOb2RlLm5vZGVzKSB7XG4gICAgcmV0dXJuIG1ha2VOb2RlLm5vZGVzW2VsZW1lbnRdO1xuICB9XG4gIC8vIE5lZWQgdG8gY3JlYXRlLlxuICBlbHNlIHtcbiAgICByZXR1cm4gbWFrZUVsZW1lbnQocmVmKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb2Nlc3NlcyBhbiBBcnJheSBvZiBwYXRjaGVzLlxuICpcbiAqIEBwYXJhbSBlXG4gKiBAcmV0dXJuXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NQYXRjaGVzKGUpIHtcbiAgdmFyIHBhdGNoZXMgPSBlLmRhdGE7XG4gIHZhciBpc0lubmVyID0gZS5pc0lubmVyO1xuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHBhdGNoZXMgYW5kIGFwcGx5IHRoZW0uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXRjaCA9IHBhdGNoZXNbaV07XG5cbiAgICBpZiAocGF0Y2guZWxlbWVudCkge1xuICAgICAgcGF0Y2guZWxlbWVudCA9IGdldEVsZW1lbnQocGF0Y2guZWxlbWVudCk7XG4gICAgICB2YXIgZWxlbWVudElkID0gcGF0Y2guZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGF0Y2gub2xkKSB7XG4gICAgICBwYXRjaC5vbGQgPSBnZXRFbGVtZW50KHBhdGNoLm9sZCk7XG4gICAgICB2YXIgb2xkSWQgPSBwYXRjaC5vbGQuZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGF0Y2gubmV3KSB7XG4gICAgICBwYXRjaC5uZXcgPSBnZXRFbGVtZW50KHBhdGNoLm5ldyk7XG4gICAgICB2YXIgbmV3SWQgPSBwYXRjaC5uZXcuZWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBRdWlja2x5IGVtcHR5IGVudGlyZSBjaGlsZE5vZGVzLlxuICAgIGlmIChwYXRjaC5fX2RvX18gPT09IC0xKSB7XG4gICAgICBwYXRjaC5lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gTm9kZSBtYW5pcC5cbiAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDEpIHtcbiAgICAgIC8vIEFkZC5cbiAgICAgIGlmIChwYXRjaC5lbGVtZW50ICYmIHBhdGNoLmZyYWdtZW50ICYmICFwYXRjaC5vbGQpIHtcbiAgICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICAgIHBhdGNoLmZyYWdtZW50LmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGdldEVsZW1lbnQoZWxlbWVudCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwYXRjaC5lbGVtZW50LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlXG4gICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgIXBhdGNoLm5ldykge1xuICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHJlbW92ZSB3aXRob3V0IHBhcmVudCwgaXMgdGhpcyB0aGUgJyArXG4gICAgICAgICAgICAnZG9jdW1lbnQgcm9vdD8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGNoLm9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBhdGNoLm9sZCk7XG4gICAgICAgIG1ha2VOb2RlLm5vZGVzW29sZElkXSA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSBtYWtlTm9kZS5ub2Rlc1tvbGRJZF07XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcGxhY2VcbiAgICAgIGVsc2UgaWYgKHBhdGNoLm9sZCAmJiBwYXRjaC5uZXcpIHtcbiAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCByZXBsYWNlIHdpdGhvdXQgcGFyZW50LCBpcyB0aGlzIHRoZSAnICtcbiAgICAgICAgICAgICdkb2N1bWVudCByb290PycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoLm5ldywgcGF0Y2gub2xkKTtcblxuICAgICAgICBtYWtlTm9kZS5ub2Rlc1tvbGRJZF0gPSBudWxsO1xuICAgICAgICBkZWxldGUgbWFrZU5vZGUubm9kZXNbb2xkSWRdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF0dHJpYnV0ZSBtYW5pcHVsYXRpb24uXG4gICAgZWxzZSBpZiAoIWlzSW5uZXIgJiYgcGF0Y2guX19kb19fID09PSAyKSB7XG4gICAgICAvLyBSZW1vdmUuXG4gICAgICBpZiAoIXBhdGNoLnZhbHVlKSB7IHBhdGNoLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHBhdGNoLm5hbWUpOyB9XG4gICAgICBlbHNlIHsgcGF0Y2guZWxlbWVudC5zZXRBdHRyaWJ1dGUocGF0Y2gubmFtZSwgcGF0Y2gudmFsdWUpOyB9XG4gICAgfVxuXG4gICAgLy8gVGV4dCBub2RlIG1hbmlwdWxhdGlvbi5cbiAgICBlbHNlIGlmICghaXNJbm5lciAmJiBwYXRjaC5fX2RvX18gPT09IDMpIHtcbiAgICAgIHBhdGNoLmVsZW1lbnQubm9kZVZhbHVlID0gcGF0Y2gudmFsdWU7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUGF0Y2hlcyBhbiBlbGVtZW50J3MgRE9NIHRvIG1hdGNoIHRoYXQgb2YgdGhlIHBhc3NlZCBtYXJrdXAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBuZXdIVE1MXG4gKi9cbmZ1bmN0aW9uIHBhdGNoKGVsZW1lbnQsIG5ld0hUTUwsIGlzSW5uZXIpIHtcbiAgaWYgKGlzUmVuZGVyaW5nKSB7IHJldHVybjsgfVxuXG4gIC8vIEF0dGFjaCBhbGwgcHJvcGVydGllcyBoZXJlIHRvIHRyYW5zcG9ydC5cbiAgdmFyIHRyYW5zZmVyT2JqZWN0ID0ge307XG5cbiAgLy8gT25seSBjYWxjdWxhdGUgdGhlIHBhcmVudCdzIGluaXRpYWwgc3RhdGUgb25lIHRpbWUuXG4gIGlmICghb2xkVHJlZSkge1xuICAgIG9sZFRyZWUgPSBtYWtlTm9kZShlbGVtZW50KTtcbiAgICB0cmFuc2Zlck9iamVjdC5vbGRUcmVlID0gb2xkVHJlZTtcbiAgICBlbGVtZW50Ll9fc291cmNlX18gPSBuZXdIVE1MO1xuICB9XG4gIC8vIFNhbWUgbWFya3VwIGJlaW5nIGFwcGxpZWQsIGVhcmx5IGV4aXQuXG4gIGVsc2UgaWYgKGVsZW1lbnQuX19zb3VyY2VfXyA9PT0gbmV3SFRNTCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIE9wdGlvbmFsbHkgZGlzYWJsZSB3b3JrZXJzLlxuICBoYXNXb3JrZXIgPSAhQm9vbGVhbihkb2N1bWVudC5ESVNBQkxFX1dPUktFUik7XG5cbiAgLy8gV2lsbCB3YW50IHRvIGVuc3VyZSB0aGF0IHRoZSBmaXJzdCByZW5kZXIgd2VudCB0aHJvdWdoLCB0aGUgd29ya2VyIGNhblxuICAvLyB0YWtlIGEgYml0IHRvIHN0YXJ0dXAgYW5kIHdlIHdhbnQgdG8gc2hvdyBjaGFuZ2VzIGFzIHNvb24gYXMgcG9zc2libGUuXG4gIGlmIChoYXNXb3JrZXIgJiYgZWxlbWVudC5fX2hhc19yZW5kZXJlZF9fKSB7XG4gICAgLy8gRmlyc3QgdGltZSBzeW5jaW5nIG5lZWRzIHRoZSBjdXJyZW50IHRyZWUuXG4gICAgaWYgKCFzeW5jZWQpIHtcbiAgICAgIHRyYW5zZmVyT2JqZWN0Lm9sZFRyZWUgPSBvbGRUcmVlO1xuICAgIH1cblxuICAgIHN5bmNlZCA9IHRydWU7XG5cbiAgICB2YXIgc3RhcnQgPSBEYXRlLm5vdygpO1xuXG4gICAgLy8gVXNlZCB0byBzcGVjaWZ5IHRoZSBvdXRlckhUTUwgb2Zmc2V0IGlmIHBhc3NpbmcgdGhlIHBhcmVudCdzIG1hcmt1cC5cbiAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgIC8vIENyYWZ0IGEgbmV3IGJ1ZmZlciB3aXRoIHRoZSBuZXcgY29udGVudHMuXG4gICAgdmFyIG5ld0J1ZmZlciA9IGJ1ZmZlcnMuc3RyaW5nVG9CdWZmZXIobmV3SFRNTCk7XG5cbiAgICAvLyBTZXQgdGhlIG9mZnNldCB0byBiZSB0aGlzIGJ5dGUgbGVuZ3RoLlxuICAgIG9mZnNldCA9IG5ld0J1ZmZlci5ieXRlTGVuZ3RoO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBieXRlbGVuZ3RoIGZvciB0aGUgdHJhbnNmZXIgYnVmZmVyLCBjb250YWlucyBvbmUgZXh0cmEgZm9yXG4gICAgLy8gdGhlIG9mZnNldC5cbiAgICB2YXIgdHJhbnNmZXJCeXRlTGVuZ3RoID0gbmV3QnVmZmVyLmJ5dGVMZW5ndGg7XG5cbiAgICAvLyBUaGlzIGJ1ZmZlciBzdGFydHMgd2l0aCB0aGUgb2Zmc2V0IGFuZCBjb250YWlucyB0aGUgZGF0YSB0byBiZSBjYXJyaWVkXG4gICAgLy8gdG8gdGhlIHdvcmtlci5cbiAgICB2YXIgdHJhbnNmZXJCdWZmZXIgPSBuZXcgVWludDE2QXJyYXkodHJhbnNmZXJCeXRlTGVuZ3RoKTtcblxuICAgIC8vIFNldCB0aGUgbmV3SFRNTCBwYXlsb2FkLlxuICAgIHRyYW5zZmVyQnVmZmVyLnNldChuZXdCdWZmZXIsIDApO1xuXG4gICAgLy8gQWRkIHByb3BlcnRpZXMgdG8gc2VuZCB0byB3b3JrZXIuXG4gICAgdHJhbnNmZXJPYmplY3Qub2Zmc2V0ID0gbmV3QnVmZmVyLmJ5dGVMZW5ndGg7XG4gICAgdHJhbnNmZXJPYmplY3QuYnVmZmVyID0gdHJhbnNmZXJCdWZmZXIuYnVmZmVyO1xuICAgIHRyYW5zZmVyT2JqZWN0LmlzSW5uZXIgPSBpc0lubmVyO1xuXG4gICAgLy8gU2V0IGEgcmVuZGVyIGxvY2sgYXMgdG8gbm90IGZsb29kIHRoZSB3b3JrZXIuXG4gICAgaXNSZW5kZXJpbmcgPSB0cnVlO1xuXG4gICAgLy8gVHJhbnNmZXIgdGhpcyBidWZmZXIgdG8gdGhlIHdvcmtlciwgd2hpY2ggd2lsbCB0YWtlIG92ZXIgYW5kIHByb2Nlc3MgdGhlXG4gICAgLy8gbWFya3VwLlxuICAgIHdvcmtlci5wb3N0TWVzc2FnZSh0cmFuc2Zlck9iamVjdCwgW3RyYW5zZmVyQnVmZmVyLmJ1ZmZlcl0pO1xuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHdvcmtlciB0byBmaW5pc2ggcHJvY2Vzc2luZyBhbmQgdGhlbiBhcHBseSB0aGUgcGF0Y2hzZXQuXG4gICAgd29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHByb2Nlc3NQYXRjaGVzKGUpO1xuICAgICAgaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICB9O1xuICB9XG4gIGVsc2UgaWYgKCFoYXNXb3JrZXIgfHwgIWVsZW1lbnQuX19oYXNfcmVuZGVyZWRfXykge1xuICAgIHZhciBuZXdUcmVlID0gaHRtbHMucGFyc2VIVE1MKG5ld0hUTUwpO1xuICAgIHZhciBwYXRjaGVzID0gW107XG5cbiAgICAvLyBTeW5jaHJvbml6ZSB0aGUgdHJlZS5cbiAgICBzeW5jTm9kZS5zeW5jLmNhbGwocGF0Y2hlcywgb2xkVHJlZSwgbmV3VHJlZSk7XG5cbiAgICAvLyBBdHRhY2ggaW5uZXIgc3RhdGUuXG4gICAgcGF0Y2hlcy5pc0lubmVyID0gaXNJbm5lcjtcblxuICAgIC8vIFByb2Nlc3MgdGhlIHBhdGNoZXMgaW1tZWRpYXRlbHkuXG4gICAgcHJvY2Vzc1BhdGNoZXMoeyBkYXRhOiBwYXRjaGVzIH0pO1xuXG4gICAgLy8gQ2xlYW4gb3V0IHRoaXMgYXJyYXkuXG4gICAgcGF0Y2hlcy5sZW5ndGggPSAwO1xuXG4gICAgLy8gTWFyayB0aGlzIGVsZW1lbnQgYXMgaW5pdGlhbGx5IHJlbmRlcmVkLlxuICAgIGlmICghZWxlbWVudC5fX2hhc19yZW5kZXJlZF9fKSB7XG4gICAgICBlbGVtZW50Ll9faGFzX3JlbmRlcmVkX18gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vcG9vbHMub2JqZWN0LmZyZWVBbGwoKTtcbiAgICAvL3Bvb2xzLmFycmF5LmZyZWVBbGwoKTtcbiAgICAvL3Bvb2xzLnV1aWQuZnJlZUFsbCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2g7XG4iLCIvLyBMaXN0IG9mIFNWRyBlbGVtZW50cy5cbmV4cG9ydHMuZWxlbWVudHMgPSBbXG4gICdhbHRHbHlwaCcsXG4gICdhbHRHbHlwaERlZicsXG4gICdhbHRHbHlwaEl0ZW0nLFxuICAnYW5pbWF0ZScsXG4gICdhbmltYXRlQ29sb3InLFxuICAnYW5pbWF0ZU1vdGlvbicsXG4gICdhbmltYXRlVHJhbnNmb3JtJyxcbiAgJ2NpcmNsZScsXG4gICdjbGlwUGF0aCcsXG4gICdjb2xvci1wcm9maWxlJyxcbiAgJ2N1cnNvcicsXG4gICdkZWZzJyxcbiAgJ2Rlc2MnLFxuICAnZWxsaXBzZScsXG4gICdmZUJsZW5kJyxcbiAgJ2ZlQ29sb3JNYXRyaXgnLFxuICAnZmVDb21wb25lbnRUcmFuc2ZlcicsXG4gICdmZUNvbXBvc2l0ZScsXG4gICdmZUNvbnZvbHZlTWF0cml4JyxcbiAgJ2ZlRGlmZnVzZUxpZ2h0aW5nJyxcbiAgJ2ZlRGlzcGxhY2VtZW50TWFwJyxcbiAgJ2ZlRGlzdGFudExpZ2h0JyxcbiAgJ2ZlRmxvb2QnLFxuICAnZmVGdW5jQScsXG4gICdmZUZ1bmNCJyxcbiAgJ2ZlRnVuY0cnLFxuICAnZmVGdW5jUicsXG4gICdmZUdhdXNzaWFuQmx1cicsXG4gICdmZUltYWdlJyxcbiAgJ2ZlTWVyZ2UnLFxuICAnZmVNZXJnZU5vZGUnLFxuICAnZmVNb3JwaG9sb2d5JyxcbiAgJ2ZlT2Zmc2V0JyxcbiAgJ2ZlUG9pbnRMaWdodCcsXG4gICdmZVNwZWN1bGFyTGlnaHRpbmcnLFxuICAnZmVTcG90TGlnaHQnLFxuICAnZmVUaWxlJyxcbiAgJ2ZlVHVyYnVsZW5jZScsXG4gICdmaWx0ZXInLFxuICAnZm9udCcsXG4gICdmb250LWZhY2UnLFxuICAnZm9udC1mYWNlLWZvcm1hdCcsXG4gICdmb250LWZhY2UtbmFtZScsXG4gICdmb250LWZhY2Utc3JjJyxcbiAgJ2ZvbnQtZmFjZS11cmknLFxuICAnZm9yZWlnbk9iamVjdCcsXG4gICdnJyxcbiAgJ2dseXBoJyxcbiAgJ2dseXBoUmVmJyxcbiAgJ2hrZXJuJyxcbiAgJ2ltYWdlJyxcbiAgJ2xpbmUnLFxuICAnbGluZWFyR3JhZGllbnQnLFxuICAnbWFya2VyJyxcbiAgJ21hc2snLFxuICAnbWV0YWRhdGEnLFxuICAnbWlzc2luZy1nbHlwaCcsXG4gICdtcGF0aCcsXG4gICdwYXRoJyxcbiAgJ3BhdHRlcm4nLFxuICAncG9seWdvbicsXG4gICdwb2x5bGluZScsXG4gICdyYWRpYWxHcmFkaWVudCcsXG4gICdyZWN0JyxcbiAgJ3NjcmlwdCcsXG4gICdzZXQnLFxuICAnc3RvcCcsXG4gICdzdHlsZScsXG4gICdzdmcnLFxuICAnc3dpdGNoJyxcbiAgJ3N5bWJvbCcsXG4gICd0ZXh0JyxcbiAgJ3RleHRQYXRoJyxcbiAgJ3RpdGxlJyxcbiAgJ3RyZWYnLFxuICAndHNwYW4nLFxuICAndXNlJyxcbiAgJ3ZpZXcnLFxuICAndmtlcm4nLFxuXTtcblxuLy8gTmFtZXNwYWNlLlxuZXhwb3J0cy5uYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuIiwidmFyIHBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7XG5cbi8qKlxuICogc3luY05vZGVcbiAqXG4gKiBAcGFyYW0gdmlydHVhbE5vZGVcbiAqIEBwYXJhbSBsaXZlTm9kZVxuICogQHJldHVyblxuICovXG5mdW5jdGlvbiBzeW5jTm9kZSh2aXJ0dWFsTm9kZSwgbGl2ZU5vZGUpIHtcbiAgdmFyIHBhdGNoZXMgPSB0aGlzO1xuXG4gIC8vIEZvciBub3cgYWx3YXlzIHN5bmMgdGhlIGNoaWxkcmVuLiAgSW4gdGhlIGZ1dHVyZSB3ZSdsbCBiZSBzbWFydGVyIGFib3V0XG4gIC8vIHdoZW4gdGhpcyBpcyBuZWNlc3NhcnkuXG4gIHZhciBvbGRDaGlsZE5vZGVzID0gdmlydHVhbE5vZGUuY2hpbGROb2RlcztcbiAgdmFyIG9sZENoaWxkTm9kZXNMZW5ndGggPSBvbGRDaGlsZE5vZGVzID8gb2xkQ2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuXG4gIGlmICghbGl2ZU5vZGUpIHtcbiAgICBwYXRjaGVzLnB1c2goeyBfX2RvX186IC0xLCBlbGVtZW50OiB2aXJ0dWFsTm9kZS5lbGVtZW50IH0pO1xuXG4gICAgdmlydHVhbE5vZGUuY2hpbGROb2Rlcy5zcGxpY2UoMCwgb2xkQ2hpbGROb2Rlc0xlbmd0aCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5vZGVWYWx1ZSA9IGxpdmVOb2RlLm5vZGVWYWx1ZTtcblxuICAvLyBGaWx0ZXIgZG93biB0aGUgY2hpbGROb2RlcyB0byBvbmx5IHdoYXQgd2UgY2FyZSBhYm91dC5cbiAgdmFyIGNoaWxkTm9kZXMgPSBsaXZlTm9kZS5jaGlsZE5vZGVzO1xuICB2YXIgbmV3Q2hpbGROb2Rlc0xlbmd0aCA9IGNoaWxkTm9kZXMgPyBjaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG5cbiAgLy8gUmVwbGFjZSB0ZXh0IG5vZGUgdmFsdWVzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgaWYgKGxpdmVOb2RlLm5vZGVOYW1lID09PSAnI3RleHQnICYmIHZpcnR1YWxOb2RlLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgLy8gVGV4dCBjaGFuZ2VkLlxuICAgIGlmICh2aXJ0dWFsTm9kZS5ub2RlVmFsdWUgIT09IGxpdmVOb2RlLm5vZGVWYWx1ZSkge1xuICAgICAgdmlydHVhbE5vZGUubm9kZVZhbHVlID0gbGl2ZU5vZGUubm9kZVZhbHVlO1xuXG4gICAgICBwYXRjaGVzLnB1c2goe1xuICAgICAgICBfX2RvX186IDMsXG4gICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgIHZhbHVlOiBub2RlVmFsdWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gTW9zdCBjb21tb24gYWRkaXRpdmUgZWxlbWVudHMuXG4gICAgaWYgKG5ld0NoaWxkTm9kZXNMZW5ndGggPiBvbGRDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgICAvLyBTdG9yZSBlbGVtZW50cyBpbiBhIERvY3VtZW50RnJhZ21lbnQgdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2UgYW5kIGJlXG4gICAgICAvLyBnZW5lcmFsbHkgc2ltcGxpZXIgdG8gd29yayB3aXRoLlxuICAgICAgdmFyIGZyYWdtZW50ID0gcG9vbHMuYXJyYXkuZ2V0KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSBvbGRDaGlsZE5vZGVzTGVuZ3RoOyBpIDwgbmV3Q2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIEludGVybmFsbHkgYWRkIHRvIHRoZSB0cmVlLlxuICAgICAgICB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzLnB1c2goY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgICAgLy8gQWRkIHRvIHRoZSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgICAgZnJhZ21lbnQucHVzaChjaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgLy8gQXNzaWduIHRoZSBmcmFnbWVudCB0byB0aGUgcGF0Y2hlcyB0byBiZSBpbmplY3RlZC5cbiAgICAgIHBhdGNoZXMucHVzaCh7XG4gICAgICAgIF9fZG9fXzogMSxcbiAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgZnJhZ21lbnQ6IGZyYWdtZW50XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlc2UgZWxlbWVudHMuXG4gICAgaWYgKG9sZENoaWxkTm9kZXNMZW5ndGggPiBuZXdDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgICAvLyBFbGVtZW50cyB0byByZW1vdmUuXG4gICAgICB2YXIgdG9SZW1vdmUgPSBzbGljZS5jYWxsKHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMsIC0xICogKG9sZENoaWxkTm9kZXNMZW5ndGggLSBuZXdDaGlsZE5vZGVzTGVuZ3RoKSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBlbGVtZW50LCB0aGlzIGhhcHBlbnMgYmVmb3JlIHRoZSBzcGxpY2Ugc28gdGhhdCB3ZSBzdGlsbFxuICAgICAgICAvLyBoYXZlIGFjY2VzcyB0byB0aGUgZWxlbWVudC5cbiAgICAgICAgcGF0Y2hlcy5wdXNoKHsgX19kb19fOiAxLCBvbGQ6IHRvUmVtb3ZlW2ldLmVsZW1lbnQgfSk7XG4gICAgICB9XG5cbiAgICAgIHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMuc3BsaWNlKG5ld0NoaWxkTm9kZXNMZW5ndGgsIG9sZENoaWxkTm9kZXNMZW5ndGggLSBuZXdDaGlsZE5vZGVzTGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIGVsZW1lbnRzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld0NoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0ubm9kZU5hbWUgIT09IGNoaWxkTm9kZXNbaV0ubm9kZU5hbWUpIHtcbiAgICAgICAgLy8gQWRkIHRvIHRoZSBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzLnB1c2goe1xuICAgICAgICAgIF9fZG9fXzogMSxcbiAgICAgICAgICBvbGQ6IHZpcnR1YWxOb2RlLmNoaWxkTm9kZXNbaV0sXG4gICAgICAgICAgbmV3OiBjaGlsZE5vZGVzW2ldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGludGVybmFsIHRyZWUncyBwb2ludCBvZiB2aWV3IG9mIHRoaXMgZWxlbWVudC5cbiAgICAgICAgdmlydHVhbE5vZGUuY2hpbGROb2Rlc1tpXSA9IGNoaWxkTm9kZXNbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFJlbW92ZSBhbGwgY2hpbGRyZW4gaWYgdGhlIG5ldyBsaXZlIG5vZGUgaGFzIG5vbmUuXG4gIGVsc2UgaWYgKG9sZENoaWxkTm9kZXNMZW5ndGggJiYgIW5ld0NoaWxkTm9kZXNMZW5ndGgpIHtcbiAgICBwYXRjaGVzLnB1c2goeyBfX2RvX186IC0xLCBlbGVtZW50OiB2aXJ0dWFsTm9kZS5lbGVtZW50IH0pO1xuXG4gICAgdmlydHVhbE5vZGUuY2hpbGROb2Rlcy5zcGxpY2UoMCwgb2xkQ2hpbGROb2Rlc0xlbmd0aCk7XG4gIH1cblxuICAvLyBTeW5jaHJvbml6ZSBhdHRyaWJ1dGVzXG4gIHZhciBhdHRyaWJ1dGVzID0gbGl2ZU5vZGUuYXR0cmlidXRlcztcblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBvbGRMZW5ndGggPSB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICB2YXIgbmV3TGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICAvLyBTdGFydCB3aXRoIHRoZSBtb3N0IGNvbW1vbiwgYWRkaXRpdmUuXG4gICAgaWYgKG5ld0xlbmd0aCA+IG9sZExlbmd0aCkge1xuICAgICAgdmFyIHRvQWRkID0gc2xpY2UuY2FsbChhdHRyaWJ1dGVzLCBvbGRMZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IHZpcnR1YWxOb2RlLmVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9BZGRbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9BZGRbaV0udmFsdWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUHVzaCB0aGUgY2hhbmdlIG9iamVjdCBpbnRvIGludG8gdGhlIHZpcnR1YWwgdHJlZS5cbiAgICAgICAgdmlydHVhbE5vZGUuYXR0cmlidXRlcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiB0b0FkZFtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB0b0FkZFtpXS52YWx1ZVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciByZW1vdmFscy5cbiAgICBpZiAob2xkTGVuZ3RoID4gbmV3TGVuZ3RoKSB7XG4gICAgICB2YXIgdG9SZW1vdmUgPSBzbGljZS5jYWxsKHZpcnR1YWxOb2RlLmF0dHJpYnV0ZXMsIG5ld0xlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogdmlydHVhbE5vZGUuZWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b1JlbW92ZVtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZnJvbSB0aGUgdmlydHVhbCBub2RlLlxuICAgICAgICB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzLnNwbGljZShpLCAxKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXMucHVzaChjaGFuZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBtb2RpZmljYXRpb25zLlxuICAgIHZhciB0b01vZGlmeSA9IGF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvTW9kaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2xkQXR0clZhbHVlID0gdmlydHVhbE5vZGUuYXR0cmlidXRlc1tpXSAmJiB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgdmFyIG5ld0F0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbaV0gJiYgYXR0cmlidXRlc1tpXS52YWx1ZTtcblxuICAgICAgLy8gT25seSBwdXNoIGluIGEgY2hhbmdlIGlmIHRoZSBhdHRyaWJ1dGUgb3IgdmFsdWUgY2hhbmdlcy5cbiAgICAgIGlmIChvbGRBdHRyVmFsdWUgIT09IG5ld0F0dHJWYWx1ZSkge1xuICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgIF9fZG9fXzogMixcbiAgICAgICAgICBlbGVtZW50OiB2aXJ0dWFsTm9kZS5lbGVtZW50LFxuICAgICAgICAgIG5hbWU6IHRvTW9kaWZ5W2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IHRvTW9kaWZ5W2ldLnZhbHVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGF0dHJpYnV0ZSBpbiB0aGUgdmlydHVhbCBub2RlLlxuICAgICAgICB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzW2ldLm5hbWUgPSB0b01vZGlmeVtpXS5uYW1lO1xuICAgICAgICB2aXJ0dWFsTm9kZS5hdHRyaWJ1dGVzW2ldLnZhbHVlID0gdG9Nb2RpZnlbaV0udmFsdWU7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzLnB1c2goY2hhbmdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTeW5jIGVhY2ggY3VycmVudCBub2RlLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpcnR1YWxOb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodmlydHVhbE5vZGUuY2hpbGROb2Rlc1tpXSAhPT0gY2hpbGROb2Rlc1tpXSkge1xuICAgICAgc3luY05vZGUuY2FsbChwYXRjaGVzLCB2aXJ0dWFsTm9kZS5jaGlsZE5vZGVzW2ldLCBjaGlsZE5vZGVzW2ldKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5zeW5jID0gc3luY05vZGU7XG4iLCJ2YXIgcGF0Y2hOb2RlID0gcmVxdWlyZSgnLi9kaWZmL3BhdGNoX25vZGUnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnb3V0ZXJEaWZmSFRNTCcsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gIHNldDogZnVuY3Rpb24obmV3SFRNTCkge1xuICAgIHBhdGNoTm9kZSh0aGlzLCBuZXdIVE1MKTtcbiAgfVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2lubmVyRGlmZkhUTUwnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICBzZXQ6IGZ1bmN0aW9uKG5ld0hUTUwpIHtcbiAgICBwYXRjaE5vZGUodGhpcywgbmV3SFRNTCwgdHJ1ZSk7XG4gIH1cbn0pO1xuIiwiLyoqXG4gKiBzdHJpbmdUb0J1ZmZlclxuICpcbiAqIEBwYXJhbSBzdHJpbmdcbiAqIEByZXR1cm5cbiAqL1xuZXhwb3J0cy5zdHJpbmdUb0J1ZmZlciA9IGZ1bmN0aW9uIHN0cmluZ1RvQnVmZmVyKHN0cmluZykge1xuICB2YXIgYnVmZmVyID0gbmV3IFVpbnQxNkFycmF5KHN0cmluZy5sZW5ndGgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgYnVmZmVyW2ldID0gc3RyaW5nLmNvZGVQb2ludEF0KGkpO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbi8qKlxuICogYnVmZmVyVG9TdHJpbmdcbiAqXG4gKiBAcGFyYW0gYnVmZmVyXG4gKiBAcmV0dXJuXG4gKi9cbmV4cG9ydHMuYnVmZmVyVG9TdHJpbmcgPSBmdW5jdGlvbiBidWZmZXJUb1N0cmluZyhidWZmZXIpIHtcbiAgdmFyIHRtcEJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShidWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGgpO1xuICB2YXIgc3RyaW5nID0gJyc7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0bXBCdWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICBzdHJpbmcgKz0gU3RyaW5nLmZyb21Db2RlUG9pbnQodG1wQnVmZmVyW2ldKTtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmc7XG59O1xuIiwidmFyIHBvb2xzID0gcmVxdWlyZSgnLi9wb29scycpO1xudmFyIHBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2VyJykubWFrZVBhcnNlcigpO1xuXG4vKipcbiAqIHBhcnNlSFRNTFxuICpcbiAqIEBwYXJhbSBuZXdIVE1MXG4gKiBAcmV0dXJuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlSFRNTChuZXdIVE1MKSB7XG4gIHJldHVybiBwYXJzZXIucGFyc2UobmV3SFRNTCkuY2hpbGROb2Rlc1swXTtcbn1cblxud2luZG93LnBhcnNlSFRNTCA9IGV4cG9ydHMucGFyc2VIVE1MID0gcGFyc2VIVE1MO1xuIiwidmFyIHBvb2xzID0gcmVxdWlyZSgnLi9wb29scycpO1xuXG5tb2R1bGUuZXhwb3J0cy5tYWtlUGFyc2VyID0gZnVuY3Rpb24gbWFrZVBhcnNlcigpIHtcbiAgdmFyIGcgPSB7fTtcbiAgKGZ1bmN0aW9uKGYpe2cuaHRtbFBhcnNlciA9IGYoKX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiBkeW5hbWljUmVxdWlyZT09XCJmdW5jdGlvblwiJiZkeW5hbWljUmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgZHluYW1pY1JlcXVpcmU9PVwiZnVuY3Rpb25cIiYmZHluYW1pY1JlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihkeW5hbWljUmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4gIGlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gICAgfVxuICB9XG5cbiAgfSx7fV0sMjpbZnVuY3Rpb24oZHluYW1pY1JlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuICAvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxuICB2YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG4gIHZhciBxdWV1ZSA9IFtdO1xuICB2YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgICAgfVxuICAgICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgfVxuICBwcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgICAgcXVldWUucHVzaChmdW4pO1xuICAgICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgICB9XG4gIH07XG5cbiAgcHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbiAgcHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbiAgcHJvY2Vzcy5lbnYgPSB7fTtcbiAgcHJvY2Vzcy5hcmd2ID0gW107XG4gIHByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xuICBwcm9jZXNzLnZlcnNpb25zID0ge307XG5cbiAgZnVuY3Rpb24gbm9vcCgpIHt9XG5cbiAgcHJvY2Vzcy5vbiA9IG5vb3A7XG4gIHByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xuICBwcm9jZXNzLm9uY2UgPSBub29wO1xuICBwcm9jZXNzLm9mZiA9IG5vb3A7XG4gIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xuICBwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG4gIHByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbiAgcHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgfTtcblxuICAvLyBUT0RPKHNodHlsbWFuKVxuICBwcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xuICBwcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgfTtcbiAgcHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuICB9LHt9XSwzOltmdW5jdGlvbihkeW5hbWljUmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gICAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xuICB9XG4gIH0se31dLDQ6W2Z1bmN0aW9uKGR5bmFtaWNSZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbiAgKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4gIC8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuICAvL1xuICAvLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuICAvLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gIC8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICAvLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gIC8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbiAgLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4gIC8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICAvL1xuICAvLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICAvLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAgLy9cbiAgLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuICAvLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gIC8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbiAgLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gIC8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICAvLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gIC8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbiAgdmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG4gIGV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICAgIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICAgIHZhciBvYmplY3RzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgICB9XG5cbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICAgIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICAgIHN3aXRjaCAoeCkge1xuICAgICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH07XG5cblxuICAvLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuICAvLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuICAvLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuICBleHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICAgIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICB2YXIgd2FybmVkID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICAgIGlmICghd2FybmVkKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwcmVjYXRlZDtcbiAgfTtcblxuXG4gIHZhciBkZWJ1Z3MgPSB7fTtcbiAgdmFyIGRlYnVnRW52aXJvbjtcbiAgZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICAgIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVidWdzW3NldF07XG4gIH07XG5cblxuICAvKipcbiAgICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICAgKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAgICovXG4gIC8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbiAgZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICB2YXIgY3R4ID0ge1xuICAgICAgc2VlbjogW10sXG4gICAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICAgIH07XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gICAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgICAgLy8gbGVnYWN5Li4uXG4gICAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gICAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgICB9XG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gICAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gICAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gICAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICAgIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gICAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xuICB9XG4gIGV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3NcbiAgaW5zcGVjdC5jb2xvcnMgPSB7XG4gICAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgICAnaXRhbGljJyA6IFszLCAyM10sXG4gICAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAgICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICAgJ3doaXRlJyA6IFszNywgMzldLFxuICAgICdncmV5JyA6IFs5MCwgMzldLFxuICAgICdibGFjaycgOiBbMzAsIDM5XSxcbiAgICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgICAneWVsbG93JyA6IFszMywgMzldXG4gIH07XG5cbiAgLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG4gIGluc3BlY3Quc3R5bGVzID0ge1xuICAgICdzcGVjaWFsJzogJ2N5YW4nLFxuICAgICdudW1iZXInOiAneWVsbG93JyxcbiAgICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAgICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICAgJ251bGwnOiAnYm9sZCcsXG4gICAgJ3N0cmluZyc6ICdncmVlbicsXG4gICAgJ2RhdGUnOiAnbWFnZW50YScsXG4gICAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgICAncmVnZXhwJzogJ3JlZCdcbiAgfTtcblxuXG4gIGZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgICB2YXIgaGFzaCA9IHt9O1xuXG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBoYXNoO1xuICB9XG5cblxuICBmdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gICAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gICAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICAgIHZhbHVlICYmXG4gICAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICAgIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gICAgaWYgKHByaW1pdGl2ZSkge1xuICAgICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgICB9XG5cbiAgICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gICAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBhcnJheSA9IHRydWU7XG4gICAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICAgIH1cblxuICAgIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICAgIH1cblxuICAgIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gICAgfVxuXG4gICAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gICAgdmFyIG91dHB1dDtcbiAgICBpZiAoYXJyYXkpIHtcbiAgICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xuICB9XG5cblxuICBmdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICAgIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gICAgfVxuICAgIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICAgIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gICAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICAgIGlmIChpc051bGwodmFsdWUpKVxuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xuICB9XG5cblxuICBmdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gICAgdmFyIG91dHB1dCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgICAgfVxuICAgIH1cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICAgIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgICBpZiAoZGVzYy5nZXQpIHtcbiAgICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICAgIH1cbiAgICBpZiAoIXN0cikge1xuICAgICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gICAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICAgIG51bUxpbmVzRXN0Kys7XG4gICAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gICAgfSwgMCk7XG5cbiAgICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgIGJyYWNlc1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xuICB9XG5cblxuICAvLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbiAgLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG4gIGZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG4gIH1cbiAgZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuICBmdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbiAgfVxuICBleHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuICBmdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbiAgfVxuICBleHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuICBmdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgICByZXR1cm4gYXJnID09IG51bGw7XG4gIH1cbiAgZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbiAgfVxuICBleHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbiAgZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xuICB9XG4gIGV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuICBmdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG4gIH1cbiAgZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICAgIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbiAgfVxuICBleHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbiAgZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG4gIH1cbiAgZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG4gIH1cbiAgZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG4gIGZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG4gIH1cbiAgZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbiAgZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xuICB9XG4gIGV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbiAgZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuICBleHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG4gIGZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICAgIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xuICB9XG4gIGV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuICBleHBvcnRzLmlzQnVmZmVyID0gZHluYW1pY1JlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG4gIGZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xuICB9XG5cblxuICBmdW5jdGlvbiBwYWQobikge1xuICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xuICB9XG5cblxuICB2YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbiAgLy8gMjYgRmViIDE2OjE5OjM0XG4gIGZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gICAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbiAgfVxuXG5cbiAgLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuICBleHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAgICpcbiAgICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICAgKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAgICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAgICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gICAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gICAqICAgICBwcm90b3R5cGUuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICAgKi9cbiAgZXhwb3J0cy5pbmhlcml0cyA9IGR5bmFtaWNSZXF1aXJlKCdpbmhlcml0cycpO1xuXG4gIGV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICAgIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICAgIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gb3JpZ2luO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbiAgfVxuXG4gIH0pLmNhbGwodGhpcyxkeW5hbWljUmVxdWlyZSgnX3Byb2Nlc3MnKSx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuICB9LHtcIi4vc3VwcG9ydC9pc0J1ZmZlclwiOjMsXCJfcHJvY2Vzc1wiOjIsXCJpbmhlcml0c1wiOjF9XSw1OltmdW5jdGlvbihkeW5hbWljUmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4gIG1vZHVsZS5leHBvcnRzPXtcbiAgICBcIm5hbWVcIjogXCJhcG9sbG9qc1wiLFxuICAgIFwiYXV0aG9yXCI6IHtcbiAgICAgIFwibmFtZVwiOiBcIlhpYW95aSBTaGlcIixcbiAgICAgIFwiZW1haWxcIjogXCJhc2hpMDA5QGdtYWlsLmNvbVwiXG4gICAgfSxcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBmcmFtZXdvcmsgdG8gZXh0ZW5kIGdsb2JhbCBvYmplY3RzIHdpdGggYWR2YW5jZSBmZWF0dXJlcy5cIixcbiAgICBcInZlcnNpb25cIjogXCIxLjMuMFwiLFxuICAgIFwiY29udHJpYnV0b3JzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiWWFuIERvbmdcIixcbiAgICAgICAgXCJlbWFpbFwiOiBcImlkeTAwMTNAZ21haWwuY29tXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIlN0ZXZlIFlhbmdcIixcbiAgICAgICAgXCJlbWFpbFwiOiBcIm1lQGl5eWFuZy5jb21cIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vYXBvbGxvanMvYXBvbGxvanMuZ2l0XCJcbiAgICB9LFxuICAgIFwic2NyaXB0c1wiOiB7XG4gICAgICBcInByZXB1Ymxpc2hcIjogXCJtYWtlIGNsZWFuIHNlcnZlclwiLFxuICAgICAgXCJ0ZXN0XCI6IFwibW9jaGFcIixcbiAgICAgIFwicG9zdHRlc3RcIjogXCJtb2NoYSAtUiB0cmF2aXMtY292XCIsXG4gICAgICBcImNvdmVyYWdlXCI6IFwibW9jaGEgLVIgaHRtbC1jb3YgPiBjb3ZlcmFnZS5odG1sXCIsXG4gICAgICBcInN0YXJ0XCI6IFwibm9kZSBzZXJ2ZXIuanNcIlxuICAgIH0sXG4gICAgXCJtYWluXCI6IFwiLi9zZXJ2ZXIuanNcIixcbiAgICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgICBcImVuZ2luZXNcIjoge1xuICAgICAgXCJub2RlXCI6IFwiPj0wLjhcIlxuICAgIH0sXG4gICAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgICAgXCJtb2NoYVwiOiBcIipcIixcbiAgICAgIFwic2hvdWxkXCI6IFwiKlwiLFxuICAgICAgXCJibGFua2V0XCI6IFwiKlwiLFxuICAgICAgXCJ0cmF2aXMtY292XCI6IFwiKlwiXG4gICAgfSxcbiAgICBcImNvbmZpZ1wiOiB7XG4gICAgICBcImJsYW5rZXRcIjoge1xuICAgICAgICBcInBhdHRlcm5cIjogXCJzZXJ2ZXIuanNcIlxuICAgICAgfSxcbiAgICAgIFwidHJhdmlzLWNvdlwiOiB7XG4gICAgICAgIFwidGhyZXNob2xkXCI6IDcwXG4gICAgICB9XG4gICAgfSxcbiAgICBcImJ1Z3NcIjoge1xuICAgICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vYXBvbGxvanMvYXBvbGxvanMvaXNzdWVzXCJcbiAgICB9LFxuICAgIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vYXBvbGxvanMvYXBvbGxvanNcIixcbiAgICBcIl9pZFwiOiBcImFwb2xsb2pzQDEuMy4wXCIsXG4gICAgXCJfc2hhc3VtXCI6IFwiNWY3YjAwMzA0ZDk3NDBlMmE3YmU1YjUyYzdjMDgwN2Q1MWY5MjU1ZVwiLFxuICAgIFwiX2Zyb21cIjogXCJhcG9sbG9qc0A+PTEuMy4wIDwyLjAuMFwiLFxuICAgIFwiX25wbVZlcnNpb25cIjogXCIxLjQuMTBcIixcbiAgICBcIl9ucG1Vc2VyXCI6IHtcbiAgICAgIFwibmFtZVwiOiBcImFzaGkwMDlcIixcbiAgICAgIFwiZW1haWxcIjogXCJhc2hpMDA5QGdtYWlsLmNvbVwiXG4gICAgfSxcbiAgICBcIm1haW50YWluZXJzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiYXNoaTAwOVwiLFxuICAgICAgICBcImVtYWlsXCI6IFwiYXNoaTAwOUBnbWFpbC5jb21cIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJkaXN0XCI6IHtcbiAgICAgIFwic2hhc3VtXCI6IFwiNWY3YjAwMzA0ZDk3NDBlMmE3YmU1YjUyYzdjMDgwN2Q1MWY5MjU1ZVwiLFxuICAgICAgXCJ0YXJiYWxsXCI6IFwiaHR0cDovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9hcG9sbG9qcy8tL2Fwb2xsb2pzLTEuMy4wLnRnelwiXG4gICAgfSxcbiAgICBcImRpcmVjdG9yaWVzXCI6IHt9LFxuICAgIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvYXBvbGxvanMvLS9hcG9sbG9qcy0xLjMuMC50Z3pcIlxuICB9XG5cbiAgfSx7fV0sNjpbZnVuY3Rpb24oZHluYW1pY1JlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuICAoZnVuY3Rpb24gKGdsb2JhbCl7XG5cblxuXG5cblxuXG5cblxuXG5cbiAgaWYgKCFnbG9iYWwuJGFwb2xsbykge1xuXG5cblxuICAvKipcbiAgICogRXh0ZW5kIGFuIG9iamVjdCB3aXRoIGFub3RoZXIgb2JqZWN0XG4gICAqIEBwYXJhbSAge09iamVjdH0gb2JqICAgICAgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gICAqIEBwYXJhbSAge09iamVjdH0gZXh0ICAgICAgZXh0ZW5zaW9uIG9iamVjdFxuICAgKiBAcGFyYW0gIHtib29sfSBvdmVycmlkZSAgIE92ZXJ3cml0ZSBleGlzdGluZyBwcm9wZXJ0aWVzIGluIG9ialxuICAgKiBAcGFyYW0gIHtib29sfSBkZWVwICAgICAgIERvaW5nIGFuIGRlZXAgZXh0ZW5kIChwZXJmb3JtIGV4dGVuZCBvbiBldmVyeSBvYmplY3QgcHJvcGVydHkpXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgcmVmZXJlbmNlIHRvIG9ialxuICAgKi9cbiAgZnVuY3Rpb24gJGV4dGVuZChvYmosIGV4dCwgb3ZlcnJpZGUsIGRlZXApIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChvdmVycmlkZSkge1xuICAgICAgaWYgKGRlZXApXG4gICAgICAgIF9vdmVycmlkZURlZXBFeHRlbmQob2JqLCBleHQpO1xuICAgICAgZWxzZVxuICAgICAgICBmb3IgKGtleSBpbiBleHQpXG4gICAgICAgICAgb2JqW2tleV0gPSBleHRba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRlZXApXG4gICAgICAgIF9kZWVwRXh0ZW5kKG9iaiwgZXh0KTtcbiAgICAgIGVsc2VcbiAgICAgICAgZm9yIChrZXkgaW4gZXh0KVxuICAgICAgICAgIGlmICghKGtleSBpbiBvYmopKVxuICAgICAgICAgICAgb2JqW2tleV0gPSBleHRba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vdmVycmlkZURlZXBFeHRlbmQob2JqLCBleHQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZXh0KVxuICAgICAgaWYgKE9iamVjdC5pc09iamVjdFN0cmljdChvYmpba2V5XSkgJiYgT2JqZWN0LmlzT2JqZWN0U3RyaWN0KGV4dFtrZXldKSlcbiAgICAgICAgX292ZXJyaWRlRGVlcEV4dGVuZChvYmpba2V5XSwgZXh0W2tleV0pO1xuICAgICAgZWxzZVxuICAgICAgICBvYmpba2V5XSA9IGV4dFtrZXldO1xuICB9XG5cbiAgZnVuY3Rpb24gX2RlZXBFeHRlbmQob2JqLCBleHQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZXh0KVxuICAgICAgaWYgKE9iamVjdC5pc09iamVjdFN0cmljdChvYmpba2V5XSkgJiYgT2JqZWN0LmlzT2JqZWN0U3RyaWN0KGV4dFtrZXldKSlcbiAgICAgICAgX2RlZXBFeHRlbmQob2JqW2tleV0sIGV4dFtrZXldKTtcbiAgICAgIGVsc2UgaWYgKCEoa2V5IGluIG9iaikpXG4gICAgICAgIG9ialtrZXldID0gZXh0W2tleV07XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHByb3BlcnRpZXMgb2YgYW4gT2JqZWN0LCBXaGljaCB1c3VhbGx5IHVzZWQgdG8gZXh0ZW5kIHByb3RvdHlwZVxuICAgKiAgIG9mIGFuIG9iamVjdCwgYXMgaXQgd2lsbCBzZXQgcHJvcGVydGllcyBhcyBub24tZW51bWVyYWJsZSwgYW5kIHdpbGxcbiAgICogICB0dXJuIHNldFZhbHVlKHZhbHVlKSBhbmQgZ2V0VmFsdWUoKSBmdW5jdGlvbnMgdG8gc2V0dGVyIGFuZCBnZXR0ZXJzLlxuICAgKiBOb3RlOiBZb3Ugc2hvdWxkIG9ubHkgdXNlICRkZWZpbmUgb3IgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9uIHByb3RvdHlwZSxcbiAgICogICBvciBvbiBhIGNsYXNzJyBpdHNlbGYgKHRvIGRlZmluZSBzdGF0aWMgbWV0aG9kcyksIGluc3RlYWQgb2Ygb24gaW5zdGFuY2VzXG4gICAqICAgd2hpY2ggY291bGQgbGVhZCB0byBzZXZlcmUgcGVyZm9ybWFuY2UgaXNzdWUuXG4gICAqIEBwYXJhbSAge09iamVjdH0gb2JqZWN0ICAgIHRhcmdldCBvYmplY3RcbiAgICogQHBhcmFtICB7T2JqZWN0fSBwcm90b3R5cGUgZXh0ZW5zaW9uIG9iamVjdFxuICAgKiBAcGFyYW0gIHtib29sfSBwcmVzZXJ2ZSAgICBwcmVzZXJ2ZSBleGlzdGluZyBwcm9wZXJ0eVxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICByZWZlcmVuY2UgdG8gb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiAkZGVmaW5lKG9iamVjdCwgcHJvdG90eXBlLCBwcmVzZXJ2ZSkge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvdHlwZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChwcmVzZXJ2ZSAmJiAoa2V5IGluIG9iamVjdCkpXG4gICAgICAgIHJldHVybjtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIGtleSk7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKVxuICAgICAgICBkZXNjLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIGRlbGV0ZSBkZXNjLmVudW1lcmFibGU7XG4gICAgICBkZWxldGUgZGVzYy5jb25maWd1cmFibGU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIGRlc2MpO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogRGVjbGFyZSBhIENsYXNzLlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICBjb25zdHJ1Y3RvciBvZiB0aGUgQ2xhc3NcbiAgICogQHBhcmFtICB7T2JqZWN0fSBwcm90b3R5cGUgcHJvdG90eXBlIG9mIENsYXNzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgIHJlZmVyZW5jZSB0byBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gJGRlY2xhcmUoZm4sIHByb3RvdHlwZSkge1xuICAgIGZuLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZuO1xuICAgICRkZWZpbmUoZm4ucHJvdG90eXBlLCBwcm90b3R5cGUpO1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmhlcml0IGFub3RoZXIgQ2xhc3MgdG8gY3VycmVudCBDbGFzc1xuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICBjb25zdHJ1Y3RvciBvZiB0aGUgQ2xhc3NcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IHBhcmVudCAgcGFyZW50IENsYXNzXG4gICAqIEBwYXJhbSAge09iamVjdH0gcHJvdG90eXBlIHByb3RvdHlwZSBvZiBDbGFzc1xuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICByZWZlcmVuY2UgdG8gY29uc3RydWN0b3JcbiAgICovXG5cblxuICBmdW5jdGlvbiAkaW5oZXJpdChmbiwgcGFyZW50LCBwcm90b3R5cGUpIHtcbiAgICBmbi5wcm90b3R5cGUgPSB7XG4gICAgICBjb25zdHJ1Y3RvcjogZm4sXG4gICAgICBfX3Byb3RvX186IHBhcmVudC5wcm90b3R5cGVcbiAgICB9O1xuICAgIGlmIChwcm90b3R5cGUpXG4gICAgICAkZGVmaW5lKGZuLnByb3RvdHlwZSwgcHJvdG90eXBlKTtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuXG5cbiAgLyoqXG4gICAqIEFkZGluZyBlbnVtZXJhdGlvbnMgdG8gYSBDbGFzcyAoYm90aCBzdGF0aWMgYW5kIHByb3RvdHlwZSkuXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICAgY29uc3RydWN0b3Igb2YgdGhlIENsYXNzXG4gICAqIEBwYXJhbSAge09iamVjdH0gICB2YWx1ZXMgb2JqZWN0IGhvbGRpbmcgYWxsIGVudW1lcmF0ZXMgd2FudCB0byBkZWZpbmVcbiAgICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICByZWZlcmVuY2UgdG8gY29uc3RydWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uICRkZWZlbnVtKGZuLCB2YWx1ZXMpIHtcbiAgICAkZGVmaW5lKGZuLCB2YWx1ZXMpO1xuICAgICRkZWZpbmUoZm4ucHJvdG90eXBlLCB2YWx1ZXMpO1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgYSBzdHJpbmcgd2l0aCBnaXZlbiBwYXR0ZXJuLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciBwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgIGZvcm1hdHRlZCBzdHJpbmdcbiAgICovXG5cblxuICB2YXIgJGZvcm1hdCA9IGR5bmFtaWNSZXF1aXJlKCd1dGlsJykuZm9ybWF0O1xuXG5cblxuICAvKipcbiAgICogTWFraW5nIGFuIEVycm9yIGluc3RhbmNlIHdpdGggZ2l2ZW4gZm9ybWF0IGFuZCBwYXJhbWV0ZXJzLlxuICAgKiBOb3RlOiB0aGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIHdvcmtzIGxpa2UgdXRpbC5mb3JtYXQoKSxcbiAgICogICBhcGFydCBmcm9tIGl0IHJldHVybnMgYW4gRXJyb3Igb2JqZWN0IGluc3RlYWQgb2Ygc3RyaW5nLlxuICAgKiBAcmV0dXJuIHtFcnJvcn0gZ2VuZXJhdGVkIEVycm9yIGluc3RhbmNlXG4gICAqL1xuICBmdW5jdGlvbiAkZXJyb3IoKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcigkZm9ybWF0LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICB9XG5cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBkZWVwIGNvcHkgb2YgYW4gT2JqZWN0IHdpdGggaXRzIHByaW1pdGl2ZSB0eXBlZFxuICAgKiBmaWVsZHMgKGV4Y2x1ZGUgZnVuY3Rpb25zKS5cbiAgICogQHBhcmFtICB7bWl4ZWR9IG9iaiAgc291cmNlIG9iamVjdFxuICAgKiBAcmV0dXJuIHttaXhlZH0gICAgICBjbG9uZWQgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiAkdmFsdWVDb3B5KG9iaikge1xuICAgIHZhciByZXM7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgcmVzID0gb2JqLnNsaWNlKDApO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmIChPYmplY3QuaXNPYmplY3QocmVzW2ldKSlcbiAgICAgICAgICByZXNbaV0gPSAkdmFsdWVDb3B5KHJlc1tpXSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuaXNPYmplY3RTdHJpY3Qob2JqKSkge1xuICAgICAgcmVzID0ge307XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICByZXNba2V5XSA9ICR2YWx1ZUNvcHkob2JqW2tleV0pO1xuICAgIH0gZWxzZSBpZiAoRnVuY3Rpb24uaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGNvcHkgb2YgYW4gT2JqZWN0LlxuICAgKiBAcGFyYW0gIHtNaXhlZH0gb3JnICBzb3VyY2Ugb2JqZWN0XG4gICAqIEBwYXJhbSAge2Jvb2x9IGRlZXAgIHBlcmZvcm0gYSBkZWVwIGNsb25lXG4gICAqIEByZXR1cm4ge01peGVkfSAgICAgIGNsb25lZCBvYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uICRjbG9uZShvYmosIGRlZXApIHtcbiAgICB2YXIgcmVzO1xuICAgIHZhciBfZGVlcCA9IGRlZXAgPT09IHRydWUgfHwgZGVlcCAtIDE7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgcmVzID0gb2JqLnNsaWNlKDApO1xuICAgICAgaWYgKGRlZXApXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgIGlmIChPYmplY3QuaXNPYmplY3QocmVzW2ldKSlcbiAgICAgICAgICAgIHJlc1tpXSA9ICRjbG9uZShyZXNbaV0sIF9kZWVwKTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5pc09iamVjdFN0cmljdChvYmopKSB7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgIHJlc1trZXldID0gb2JqW2tleV07XG4gICAgICBpZiAoZGVlcClcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iailcbiAgICAgICAgICBpZiAoT2JqZWN0LmlzT2JqZWN0KHJlc1trZXldKSlcbiAgICAgICAgICAgIHJlc1trZXldID0gJGNsb25lKHJlc1trZXldLCBfZGVlcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGRlZmF1bHQgdmFsdWUgb2YgYW4gdW5kZWZpbmVkIHZhcmlhYmxlLlxuICAgKiBAcGFyYW0gIHtNaXhlZH0gdmFsICB2YWx1ZVxuICAgKiBAcGFyYW0gIHtNaXhlZH0gZGVmICBkZWZhdWx0IHZhbHVlXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZnVuY3Rpb24gJGRlZmF1bHQodmFsLCBkZWYpIHtcbiAgICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyBkZWYgOiB2YWw7XG4gIH1cblxuICAvKipcbiAgICogV3JhcCBhbiBvYmplY3Qgd2l0aCBnaXZlbiBDbGFzcy5cbiAgICogTm90ZTogaXQgd2lsbCBjYWxsIENsYXNzLl9fd3JhcCBtZXRob2QgdG8gZG8gY3VzdG9tIHdyYXBwaW5nLlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgb2JqZWN0IHRvIGJlIHdyYXBwZWRcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IFR5cGUgIHdyYXBwaW5nIENsYXNzXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICB3cmFwcGVkIG9iamVjdFxuICAgKi9cblxuXG4gIGZ1bmN0aW9uICR3cmFwKG9iaiwgVHlwZSkge1xuICAgIG9iai5fX3Byb3RvX18gPSBUeXBlLnByb3RvdHlwZTtcbiAgICBpZiAoVHlwZS5fX3dyYXApXG4gICAgICBUeXBlLl9fd3JhcChvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZpbmcgcHJvdG90eXBlIGNoYWluIGZyb20gYSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSAge09iamVjdH0gb2JqZWN0ICAgb2JqZWN0IHRvIGJlIHN0cmlwcGVkXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgb2JqZWN0IHN0cmlwcGVkXG4gICAqL1xuICBmdW5jdGlvbiAkc3RyaXAob2JqZWN0KSB7XG4gICAgb2JqZWN0Ll9fcHJvdG9fXyA9IE9iamVjdC5wcm90b3R5cGU7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyB0byBkZXRlcm1pbmUgYW4gZWxlbWVudCdzIHR5cGVcbiAgICogVGhpcyBtZXRob2QgcHJvdmlkZSBtb3JlIHN0cmljdGVyIHN0cmF0ZWd5IG9uIHR5cGUgZGV0ZWN0aW9uLFxuICAgKiBjYW4gYmUgd29ya2VkIHdpdGggdHlwZW9mLlxuICAgKiBAcGFyYW0gIHtNaXhlZH0gIG9iaiAgVmFyaWFibGVcbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgIHR5cGUgb2YgdGhlIHZhcmlhYmxlLCBsaWtlIHR5cGVvZixcbiAgICogICAgICAgICAgICAgICAgICAgICAgIGJ1dCB3aXRoIGJldHRlciBwcmVjaXNpb24uXG4gICAqL1xuICBmdW5jdGlvbiAkdHlwZW9mKG9iaikge1xuICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG4gICAgcmV0dXJuIHR5cGUuc3Vic3RyaW5nKDgsIHR5cGUubGVuZ3RoIC0gMSkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG5cblxuICAkZGVmaW5lKGdsb2JhbCwge1xuICAgICRleHRlbmQ6ICRleHRlbmQsXG4gICAgJGRlZmluZTogJGRlZmluZSxcbiAgICAkZGVjbGFyZTogJGRlY2xhcmUsXG4gICAgJGluaGVyaXQ6ICRpbmhlcml0LFxuICAgICRkZWZlbnVtOiAkZGVmZW51bSxcbiAgICAkZm9ybWF0OiAkZm9ybWF0LFxuICAgICRlcnJvcjogJGVycm9yLFxuICAgICR2YWx1ZUNvcHk6ICR2YWx1ZUNvcHksXG4gICAgJGNsb25lOiAkY2xvbmUsXG4gICAgJGRlZmF1bHQ6ICRkZWZhdWx0LFxuICAgICR3cmFwOiAkd3JhcFxuXG4gICAgLFxuICAgICRhcG9sbG86IGR5bmFtaWNSZXF1aXJlKCcuL3BhY2thZ2UnKS52ZXJzaW9uLFxuICAgICRzdHJpcDogJHN0cmlwLFxuICAgICR0eXBlb2Y6ICR0eXBlb2ZcblxuICB9KTtcblxuICAkZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBSZXBlYXQgY3VycmVudCBzdHJpbmcgZm9yIGdpdmVuIHRpbWVzLlxuICAgICAqIEBwYXJhbSAge2ludH0gdGltZXMgIFRpbWVzIHRvIHJlcGVhdFxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgIHJlc3VsdFxuICAgICAqL1xuICAgIHJlcGVhdDogZnVuY3Rpb24odGltZXMpIHtcbiAgICAgIHZhciByZXMgPSAnJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKylcbiAgICAgICAgcmVzICs9IHRoaXM7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUGFkZGluZyB0aGlzIHRvIGdpdmVuIGxlbmd0aCB3aXRoIHNwZWNpZmllZCBjaGFyIGZyb20gbGVmdC5cbiAgICAgKiBAcGFyYW0gIHtjaGFyfSBjaCAgICBwYWRkaW5nIGNoYXJcbiAgICAgKiBAcGFyYW0gIHtpbnR9IGxlbmd0aCBkZXNpcmVkIGxlbmd0aFxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgIHJlc3VsdFxuICAgICAqL1xuICAgIHBhZGRpbmdMZWZ0OiBmdW5jdGlvbihjaCwgbGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5sZW5ndGggPCBsZW5ndGgpXG4gICAgICAgIHJldHVybiBjaC5yZXBlYXQobGVuZ3RoIC0gdGhpcy5sZW5ndGgpICsgdGhpcztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUGFkZGluZyB0aGlzIHRvIGdpdmVuIGxlbmd0aCB3aXRoIHNwZWNpZmllZCBjaGFyIGZyb20gcmlnaHQuXG4gICAgICogQHBhcmFtICB7Y2hhcn0gY2ggICAgcGFkZGluZyBjaGFyXG4gICAgICogQHBhcmFtICB7aW50fSBsZW5ndGggZGVzaXJlZCBsZW5ndGhcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICByZXN1bHRcbiAgICAgKi9cbiAgICBwYWRkaW5nUmlnaHQ6IGZ1bmN0aW9uKGNoLCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmxlbmd0aCA8IGxlbmd0aClcbiAgICAgICAgcmV0dXJuIHRoaXMgKyBjaC5yZXBlYXQobGVuZ3RoIC0gdGhpcy5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBsYXN0IGNoYXJhY3RlciBpbiB0aGlzIHN0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ30gbGFzdCBjaGFyYWN0ZXJcbiAgICAgKi9cbiAgICBnZXQgYmFjaygpIHtcbiAgICAgIHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBnZXQgZmlyc3QgY2hhcmFjdGVyIGluIHRoaXMgc3RyaW5nXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBmaXJzdCBjaGFyYWN0ZXJcbiAgICAgKi9cbiAgICBnZXQgZnJvbnQoKSB7XG4gICAgICByZXR1cm4gdGhpc1swXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdGhpcyBzdHJpbmcgc3RhcnRzIHdpdGggdGhlIGdpdmVuIG9uZS5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciBzdHJpbmcgdG8gdGVzdCB3aXRoXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBwb3Mgb3B0aW9uYWwsIHBvc2l0aW9uIHRvIHN0YXJ0IGNvbXBhcmUsIGRlZmF1bHRzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgdG8gMFxuICAgICAqIEByZXR1cm4ge2Jvb2x9ICAgICAgIHJlc3VsdFxuICAgICAqL1xuICAgIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uKHN0ciwgcG9zKSB7XG4gICAgICBpZiAoc3RyID09PSBudWxsIHx8IHN0ciA9PT0gdW5kZWZpbmVkIHx8IHN0ci5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyKHBvcyB8fCAwLCBzdHIubGVuZ3RoKSA9PT0gc3RyO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdGhpcyBzdHJpbmcgZW5kcyB3aXRoIHRoZSBnaXZlbiBvbmUuXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBzdHIgc3RyaW5nIHRvIHRlc3Qgd2l0aFxuICAgICAqIEBwYXJhbSAge251bWJlcn0gbGVuIG9wdGlvbmFsLCBwcmV0ZW5kIHRoaXMgc3RyaW5nIGlzIG9mIGdpdmVuIGxlbmd0aCxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0cyB0byBhY3R1YWwgbGVuZ3RoXG4gICAgICogQHJldHVybiB7Ym9vbH0gICAgICAgcmVzdWx0XG4gICAgICovXG4gICAgZW5kc1dpdGg6IGZ1bmN0aW9uKHN0ciwgbGVuKSB7XG4gICAgICBpZiAoc3RyID09PSBudWxsIHx8IHN0ciA9PT0gdW5kZWZpbmVkIHx8IHN0ci5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyKChsZW4gfHwgdGhpcy5sZW5ndGgpIC0gc3RyLmxlbmd0aCwgc3RyLmxlbmd0aCkgPT09IHN0cjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIHN0cmluZyBpbiBpdCdzIHRpdGxlIGZvcm0uXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmcgaW4gdGl0bGUgY2FzZVxuICAgICAqIE5vdGU6IGlmIGEgd29yZCBjb250YWluaW5nIHVwcGVyIGNhc2UsIG5vdGhpbmdcbiAgICAgKiAgIHdpbGwgYmUgZG9uZS5cbiAgICAgKi9cbiAgICB0b1RpdGxlQ2FzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9cXGIoW2Etel0pKFsnYS16XSopXFxiL2csIGZ1bmN0aW9uKGFsbCwgbGV0dGVyLCByZXN0KSB7XG4gICAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKSArIHJlc3Q7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRyaW0gd2hpdGVzcGFjZXMgYXQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRyaW1tZWQgc3RyaW5nXG4gICAgICovXG4gICAgdHJpbUxlZnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccysvLCAnJyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUcmltIHdoaXRlc3BhY2VzIGF0IHRoZSBlbmRpbmcgb2YgdGhlIHN0cmluZ1xuICAgICAqIEByZXR1cm4ge3N0cmluZ30gdHJpbW1lZCBzdHJpbmdcbiAgICAgKi9cbiAgICB0cmltUmlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgfVxuICB9LCB0cnVlKTtcblxuICAkZGVmaW5lKE51bWJlci5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBDbGFtcCBjdXJyZW50IHZhbHVlIHRvIHRoZSBnaXZlbiByYW5nZSBbbGIsIHViXVxuICAgICAqIEBwYXJhbSAge251bWJlcn0gbGIgbG93ZXIgYm91bmRcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHViIHVwcGVyIGJvdW5kXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAgICByZXN1bHRcbiAgICAgKi9cbiAgICBjbGFtcDogZnVuY3Rpb24obGIsIHViKSB7XG4gICAgICB2YXIgcnRuID0gTnVtYmVyKHRoaXMpO1xuICAgICAgaWYgKGxiICE9PSB1bmRlZmluZWQgJiYgcnRuIDwgbGIpXG4gICAgICAgIHJ0biA9IGxiO1xuICAgICAgaWYgKHViICE9PSB1bmRlZmluZWQgJiYgcnRuID4gdWIpXG4gICAgICAgIHJ0biA9IHViO1xuICAgICAgcmV0dXJuIHJ0bjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNob3J0Y3V0IHRvIE1hdGguZmxvb3IodGhpcylcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IE1hdGguZmxvb3IodGhpcylcbiAgICAgKi9cbiAgICBmbG9vcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNob3J0Y3V0IHRvIE1hdGguY2VpbCh0aGlzKVxuICAgICAqIEByZXR1cm4ge251bWJlcn0gTWF0aC5jZWlsKHRoaXMpXG4gICAgICovXG4gICAgY2VpbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU2hvcnRjdXQgdG8gTWF0aC5yb3VuZCh0aGlzKSB3aXRoIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSAge251bWJlcn0gZGVjaW1hbHMgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIHRvIHJvdW5kIHVwIHRvXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAgICAgICAgICByb3VuZGVkIG51bWJlclxuICAgICAqL1xuICAgIHJvdW5kOiBmdW5jdGlvbihkZWNpbWFscykge1xuICAgICAgaWYgKGRlY2ltYWxzKSB7XG4gICAgICAgIHZhciB1bml0ID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodGhpcyAqIHVuaXQpIC8gdW5pdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB0aG91c2FuZHMgc2VwYXJhdGVkIG51bWJlclxuICAgICAqIEBwYXJhbSAge251bWJlcn0gZGVjaW1hbHMgIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyB0byByZW1haW5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBzZXBhcmF0b3JcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBzZXBhcmF0ZWQgbnVtYmVyXG4gICAgICovXG4gICAgdG9Hcm91cDogZnVuY3Rpb24oZGVjaW1hbHMsIHNlcGFyYXRvcikge1xuXG4gICAgICBkZWNpbWFscyA9IGRlY2ltYWxzIHx8IDA7XG5cbiAgICAgIGlmICh0aGlzID4gLTEwMDAgJiYgdGhpcyA8IDEwMDApXG4gICAgICAgIHJldHVybiB0aGlzLnRvRml4ZWQoZGVjaW1hbHMpO1xuXG4gICAgICBzZXBhcmF0b3IgPSBzZXBhcmF0b3IgfHwgJywnO1xuXG4gICAgICB2YXIgc2lnbiA9IHRoaXMgPCAwID8gJy0nIDogJyc7XG4gICAgICB2YXIgdG1wID0gTWF0aC5hYnModGhpcykudG9GaXhlZChkZWNpbWFscyk7XG5cbiAgICAgIHZhciBpbnRQYXJ0LCBkZWNpbWFsUGFydDtcbiAgICAgIGlmIChkZWNpbWFscyA+IDApIHtcbiAgICAgICAgaW50UGFydCA9IHRtcC5zdWJzdHIoMCwgdG1wLmxlbmd0aCAtIGRlY2ltYWxzIC0gMSk7XG4gICAgICAgIGRlY2ltYWxQYXJ0ID0gdG1wLnN1YnN0cih0bXAubGVuZ3RoIC0gZGVjaW1hbHMgLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludFBhcnQgPSB0bXA7XG4gICAgICAgIGRlY2ltYWxQYXJ0ID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXMgPSAnJztcbiAgICAgIGZvciAodmFyIHBvcyA9IDAsIGxlbiA9IGludFBhcnQubGVuZ3RoICUgMyB8fCAzO1xuICAgICAgICAgIHBvcyA8IGludFBhcnQubGVuZ3RoOyBwb3MgKz0gbGVuLCBsZW4gPSAzKSB7XG4gICAgICAgIGlmIChyZXMgIT09ICcnKVxuICAgICAgICAgIHJlcyArPSBzZXBhcmF0b3I7XG4gICAgICAgIHJlcyArPSBpbnRQYXJ0LnN1YnN0cihwb3MsIGxlbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2lnbiArIHJlcyArIGRlY2ltYWxQYXJ0O1xuXG4gICAgfVxuICB9KTtcblxuICAkZGVmaW5lKEFycmF5LnByb3RvdHlwZSwge1xuICAgIC8qKlxuICAgICAqIGdldCBtaW5pbXVtIHZhbHVlIGluIHRoaXMgYXJyYXlcbiAgICAgKiBAcmV0dXJuIHtNaXhlZH0gbWluaW1hbCB2YWx1ZVxuICAgICAqL1xuICAgIG1pbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzID0gdGhpc1swXTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5sZW5ndGg7IGkrKylcbiAgICAgICAgaWYgKHRoaXNbaV0gPCByZXMpXG4gICAgICAgICAgcmVzID0gdGhpc1tpXTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBnZXQgbWF4aW11bSB2YWx1ZSBpbiB0aGlzIGFycmF5XG4gICAgICogQHJldHVybiB7TWl4ZWR9IG1heGltdW0gdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlcyA9IHRoaXNbMF07XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRoaXMubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmICh0aGlzW2ldID4gcmVzKVxuICAgICAgICAgIHJlcyA9IHRoaXNbaV07XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUHVzaCBhIHZhbHVlIGlpZiBpdCdzIG5vdCBpbiB0aGlzIGFycmF5LCBhbmQgcmV0dXJuIHZhbHVlJ3MgaW5kZXguXG4gICAgICogQHBhcmFtICB7TWl4ZWR9IHZhbCAgbmV3IHZhbHVlXG4gICAgICogQHJldHVybiB7aW50fSAgICAgICAgaW5kZXggb2YgdGhlIHZhbHVlXG4gICAgICogTm90ZTogVGhpcyBvbmx5IHdvcmtzIHdpdGggcHJpbWl0aXZlIHR5cGVkIGVsZW1lbnRzLCB3aGljaCBjYW4gYmUgZm91bmRcbiAgICAgKiAgICAgICB3aXRoIEFycmF5I2luZGV4T2YoKS5cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKHZhbCk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKVxuICAgICAgICByZXR1cm4gdGhpcy5wdXNoKHZhbCkgLSAxO1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRmluZCBhIHZhbHVlIGluIHRoZSBhcnJheSBhbmQgcmVtb3ZlIGl0LlxuICAgICAqIEBwYXJhbSAge01peGVkfSB2YWwgIHZhbHVlIHRvIHJlbW92ZVxuICAgICAqIEByZXR1cm4ge0FycmF5fSAgICAgIHRoaXNcbiAgICAgKiBOb3RlOiBUaGlzIG9ubHkgd29ya3Mgd2l0aCBwcmltaXRpdmUgdHlwZWQgZWxlbWVudHMsIHdoaWNoIGNhbiBiZSBmb3VuZFxuICAgICAqICAgICAgIHdpdGggQXJyYXkjaW5kZXhPZigpLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2YodmFsKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIC8vIFNoaWZ0IGNvcHkgZWxlbWVudHMgaW5zdGVhZCBvZiBBcnJheSNzcGxpY2UoKSBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlxuICAgICAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9mYXN0LWFycmF5LXNwbGljZS8xOFxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IHRoaXMubGVuZ3RoKVxuICAgICAgICAgIHRoaXNbaW5kZXggLSAxXSA9IHRoaXNbaW5kZXhdO1xuICAgICAgICB0aGlzLnBvcCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSb3RhdGUgdGhpcyBhcnJheSAobi0+MCwgbisxLT4xLCAuLi4pXG4gICAgICogQHBhcmFtICB7aW50fSBuICAgdGhlIG9mZnNldFxuICAgICAqIEByZXR1cm4ge0FycmF5fSAgIHRoaXNcbiAgICAgKi9cbiAgICByb3RhdGU6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChuIDwgMClcbiAgICAgICAgbiA9IG4gJSB0aGlzLmxlbmd0aCArIHRoaXMubGVuZ3RoO1xuICAgICAgbiAlPSB0aGlzLmxlbmd0aDtcbiAgICAgIHZhciBtaWRkbGUgPSBuO1xuICAgICAgdmFyIG5leHQgPSBuO1xuICAgICAgdmFyIGZpcnN0ID0gMDtcbiAgICAgIHdoaWxlIChmaXJzdCA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpc1tmaXJzdF07XG4gICAgICAgIHRoaXNbZmlyc3RdID0gdGhpc1tuZXh0XTtcbiAgICAgICAgdGhpc1tuZXh0XSA9IHQ7XG4gICAgICAgIGZpcnN0Kys7XG4gICAgICAgIG5leHQrKztcbiAgICAgICAgaWYgKG5leHQgPT0gdGhpcy5sZW5ndGgpIG5leHQgPSBtaWRkbGU7XG4gICAgICAgIGVsc2UgaWYgKGZpcnN0ID09IG1pZGRsZSkgbWlkZGxlID0gbmV4dDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgbGFzdCBlbGVtZW50IGluIHRoaXMgYXJyYXlcbiAgICAgKiBOb3RlOiBJdCdzIG5vdCBhIHJlZmVyZW5jZSB3aGVuIHJldHVybmluZyBhIG5vbi1vYmplY3QhXG4gICAgICogQHJldHVybiB7TWl4ZWR9IGxhc3QgZWxlbWVudFxuICAgICAqL1xuICAgIGdldCBiYWNrKCkge1xuICAgICAgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIGdldCBmaXJzdCBlbGVtZW50IGluIHRoaXMgYXJyYXlcbiAgICAgKiBOb3RlOiBJdCdzIG5vdCBhIHJlZmVyZW5jZSB3aGVuIHJldHVybmluZyBhIG5vbi1vYmplY3QhXG4gICAgICogQHJldHVybiB7TWl4ZWR9IGZpcnN0IGVsZW1lbnRcbiAgICAgKi9cbiAgICBnZXQgZnJvbnQoKSB7XG4gICAgICByZXR1cm4gdGhpc1swXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmxhdHRlcm4gYSBhcnJheSB3aXRoIHN1YiBhcnJheXMuXG4gICAgICogQHBhcmFtICB7Ym9vbH0gZGVlcCBpZiBjb250aW51ZSB0byBmbGF0dGVuIHN1YiBhcnJheXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgIGZsYXR0ZW5lZCBhcnJheS5cbiAgICAgKi9cbiAgICBmbGF0dGVuOiBmdW5jdGlvbihkZWVwKSB7XG4gICAgICB2YXIgcmVzID0gW107XG4gICAgICBpZiAoIWRlZXApXG4gICAgICAgIHJldHVybiByZXMuY29uY2F0LmFwcGx5KHJlcywgdGhpcyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXNbaV0pKVxuICAgICAgICAgIHJlcy5wdXNoLmFwcGx5KHJlcywgdGhpc1tpXS5mbGF0dGVuKHRydWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlcy5wdXNoKHRoaXNbaV0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybiB1bmlxdWUgZWxlbWVudHMgaW4gdGhlIGFycmF5XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgdW5pcXVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgIHZhciBkaWN0ID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXNbaV0udG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgZGljdFtrZXldID0gdHJ1ZTtcbiAgICAgICAgcmVzLnB1c2godGhpc1tpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogc2h1ZmZsZSBlbGVtZW50cyBpbiB0aGUgYXJyYXkgaW4tcGxhY2VcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBzaHVmZmxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIG4gPSB0aGlzLmxlbmd0aDsgbiA+IDA7IG4tLSkge1xuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcihuICogTWF0aC5yYW5kb20oKSk7XG4gICAgICAgIGlmIChpZHggIT0gbiAtIDEpIHtcbiAgICAgICAgICB2YXIgdG1wID0gdGhpc1tpZHhdO1xuICAgICAgICAgIHRoaXNbaWR4XSA9IHRoaXNbbiAtIDFdO1xuICAgICAgICAgIHRoaXNbbiAtIDFdID0gdG1wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBGb3J3YXJkIGRlY2xhcmluZyBwcm90b3R5cGUgZnVuY3Rpb25zIHRvIEFycmF5J3Mgc3RhdGljXG4gICAqIG1ldGhvZHMuXG4gICAqL1xuICBpZiAoQXJyYXkubWFwID09PSB1bmRlZmluZWQpXG4gICAgWydmb3JFYWNoJywgJ2V2ZXJ5JywgJ3NvbWUnLCAnZmlsdGVyJywgJ21hcCcsICdyZWR1Y2UnLCAncmVkdWNlUmlnaHQnLCAnc2xpY2UnXVxuICAgICAgLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBmbiA9IEFycmF5LnByb3RvdHlwZVttZXRob2RdO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXksIG1ldGhvZCwge1xuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uY2FsbChhLCBiLCBjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgaWYgKFN0cmluZy50cmltID09PSB1bmRlZmluZWQpXG4gICAgWyd0cmltJywgJ3RyaW1MZWZ0JywgJ3RyaW1SaWdodCddXG4gICAgICAuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGZuID0gU3RyaW5nLnByb3RvdHlwZVttZXRob2RdO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RyaW5nLCBtZXRob2QsIHtcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oYSkge1xuICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwoYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICRkZWZpbmUoT2JqZWN0LCB7XG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb2JqICBvYmplY3QgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2x9ICAgICAgICBvYmplY3QgaXMgZW1wdHlcbiAgICAgKi9cbiAgICBpc0VtcHR5OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmICghb2JqKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2V0IHZhbHVlcyBvZiBhbiBvYmplY3QsIGxpa2UgT2JqZWN0LmtleXMoKS5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgb2JqZWN0IHRvIGV4dHJhY3RcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgdmFsdWVzIGluIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICB2YWx1ZXM6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgcmV0dXJuIG9ialtrXTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVmFndWUgYnV0IGZhc3QgaXNPYmplY3QgdGVzdFxuICAgICAqIE5vdGU6IG5ldyBTdHJpbmcoKSwgZnVuY3Rpb24sIGFycmF5LCBldGMgd2lsbCByZXR1cm4gdHJ1ZVxuICAgICAqIEBwYXJhbSAge01peGVkfSBvYmogIG9iamVjdCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbH0gICAgICAgdHJ1ZSBpZiBvYmogaXMgYW4gb2JqZWN0IGFuZCBub3QgbnVsbFxuICAgICAqL1xuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIC8qKlxuICAgICAgICogS25vd24gZmFzdGVzdCB3YXkgdG8gdGVzdCwgdGhlIG9yZGVyIG9mIHRoZSB0ZXN0XG4gICAgICAgKiBmb2xsb3dpbmc6IGh0dHA6Ly9qc3BlcmYuY29tL3R5cGVvZi12cy1ib29sLlxuICAgICAgICovXG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU3RyaWN0IGlzT2JqZWN0IHRlc3QsIG9ubHkgcHVyZSBPYmplY3Qgd2lsbCByZXR1cm4gdHJ1ZVxuICAgICAqIE5vdGU6IG9ubHkge30gd2lsbCByZXR1cm4gdHJ1ZVxuICAgICAqIEBwYXJhbSAge01peGVkfSBvYmogIG9iamVjdCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbH0gICAgICAgdHJ1ZSBpZiBvYmogaXMgc3RyaWN0bHkgYW4gb2JqZWN0XG4gICAgICovXG4gICAgaXNPYmplY3RTdHJpY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcbiAgICB9XG5cbiAgICAsXG4gICAgLyoqXG4gICAgICogcHJvamVjdCAkb2JqZWN0IHdpdGggcHJvamVjdGlvbmcsIHNhbWUgYmVoYXZpb3VyIHdpdGggbW9uZ29kYiBwcm9qZWN0aW9uXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmplY3QgICAgICB0YXJnZXQgb2JqZWN0XG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBwcm9qZWN0aW9uICBBbiBvYmplY3QgbWFwcGluZyBmaWVsZHMgdG8gdmFsdWVzXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gZGVlcCAgICAgICBpZiB0cnVlLCBnbyBkZWVwIGZvciBzdWIgb2JqZWN0c1xuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGtlZXAgICAgICAgaWYgdHJ1ZSwga2VlcCB1bmRlZmluZWQgZmllbGQgb2YgdGhpc1xuICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgcHJvamVjdGVkIG9iamVjdFxuICAgICAqL1xuICAgIHByb2plY3Q6IGZ1bmN0aW9uKG9iamVjdCwgcHJvamVjdGlvbiwgZGVlcCwga2VlcCkge1xuICAgICAgaWYgKCFPYmplY3QuaXNPYmplY3QocHJvamVjdGlvbikpXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB2YXIgcmVzID0ge307XG4gICAgICBPYmplY3Qua2V5cyhwcm9qZWN0aW9uKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB2YXIgcHJvaiA9IHByb2plY3Rpb25ba2V5XTtcbiAgICAgICAgaWYgKHByb2opIHtcbiAgICAgICAgICB2YXIgb2JqID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgaWYgKGRlZXAgJiYgT2JqZWN0LmlzT2JqZWN0U3RyaWN0KG9iaikgJiYgT2JqZWN0LmlzT2JqZWN0U3RyaWN0KHByb2opKSB7XG4gICAgICAgICAgICByZXNba2V5XSA9IE9iamVjdC5wcm9qZWN0KG9iaiwgcHJvamVjdGlvbltrZXldLCBkZWVwLCBrZWVwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGtlZXApXG4gICAgICAgICAgICAgIHJlc1trZXldID0gb2JqO1xuICAgICAgICAgICAgZWxzZSBpZiAob2JqICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgIHJlc1trZXldID0gb2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG4gICAgVHJhbnNmb3JtZXI6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcbiAgICAgIHZhciBleHByID0gW107XG4gICAgICBleHByLnB1c2goJ2V4ZWM9ZnVuY3Rpb24gKG9iamVjdCkgeycpO1xuICAgICAgZXhwci5wdXNoKCd2YXIgcmVzID0ge307Jyk7XG4gICAgICAoZnVuY3Rpb24gbG9vcChsaHYsIG1hcHBpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMobWFwcGluZykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICB2YXIgc291cmNlID0gbWFwcGluZ1trZXldO1xuICAgICAgICAgIGlmICgvXFxXLy50ZXN0KGtleSkpIGtleSA9ICdbXCInICsga2V5ICsgJ1wiXSc7XG4gICAgICAgICAgZWxzZSBrZXkgPSAnLicgKyBrZXk7XG5cblxuICAgICAgICAgIHZhciB0YXJnZXQgPSBsaHYgKyBrZXk7XG4gICAgICAgICAgaWYgKCR0eXBlb2Yoc291cmNlKSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXhwci5wdXNoKHRhcmdldCArICcgPSB7fTsnKTtcbiAgICAgICAgICAgIHJldHVybiBsb29wKHRhcmdldCwgc291cmNlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHJ1ZSA9PT0gc291cmNlKVxuICAgICAgICAgICAgc291cmNlID0gJ29iamVjdCcgKyBrZXk7XG4gICAgICAgICAgZWxzZSBpZiAoJHR5cGVvZihzb3VyY2UpID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgc291cmNlID0gJ29iamVjdCcgKyBzb3VyY2U7XG4gICAgICAgICAgZWxzZSBpZiAoJHR5cGVvZihzb3VyY2UpID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBzb3VyY2UgPSAnKCcrc291cmNlLnRvU3RyaW5nKCkrJykob2JqZWN0KSc7XG4gICAgICAgICAgZXhwci5wdXNoKHRhcmdldCArICcgPSAnICsgc291cmNlICsgJzsnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSgncmVzJywgbWFwcGluZyk7XG4gICAgICBleHByLnB1c2goJ3JldHVybiByZXM7Jyk7XG4gICAgICBleHByLnB1c2goJ30nKTtcbiAgICAgIHRoaXMuZXhlYyA9IGV2YWwoZXhwci5qb2luKCcnKSk7XG4gICAgfVxuXG4gIH0pO1xuXG4gICRkZWZpbmUoRnVuY3Rpb24sIHtcbiAgICAvKipcbiAgICAgKiBUZXN0IGlmIGFuIG9iamVjdCBpcyBhIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtICB7TWl4ZWR9IG9iaiAgb2JqZWN0IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sfSAgICAgICB0cnVlIGlmIHNvXG4gICAgICovXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG4gIH0pO1xuXG4gICRkZWZpbmUoRGF0ZSwge1xuICAgIC8qKlxuICAgICAqIENhc3QgYSB2YWx1ZSB0byBEYXRlXG4gICAgICogQHBhcmFtICB7TWl4ZWR9IG9iaiAgb2JqZWN0IHRvIGNhc3RcbiAgICAgKiBAcmV0dXJuIHtEYXRlfSAgICAgICBjYXN0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBjYXN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKVxuICAgICAgICBvYmogPSBEYXRlLnBhcnNlKG9iaik7XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGlzTmFOKG9iaikpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIG9iaiA9IG5ldyBEYXRlKG9iaik7XG4gICAgICAgIGlmIChpc05hTihvYmoudmFsdWVPZigpKSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIERhdGVcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgICBvYmplY3QgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2x9ICAgICAgIHRydWUgaWlmIGl0J3MgYSBkYXRlLlxuICAgICAqL1xuICAgIGlzRGF0ZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICBvYmogPSBEYXRlLmNhc3Qob2JqKTtcbiAgICAgIGlmIChvYmopXG4gICAgICAgIHJldHVybiBvYmogPj0gMCAmJiBvYmogPCAyMTQ3NDgzNjQ3MDAwO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgJGRlZmluZShCb29sZWFuLCB7XG4gICAgLyoqXG4gICAgICogQ2FzdCBhIHZhbHVlIHRvIGJvb2xcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgb2JqZWN0IHRvIGNhc3RcbiAgICAgKiBAcmV0dXJuIHtib29sfSAgICAgICAgY2FzdGVkIHZhbHVlXG4gICAgICovXG4gICAgY2FzdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXG4gICAgICAgIHJldHVybiAoL14odHJ1ZXx5ZXN8b2t8eXxvbikkL2kpLnRlc3Qob2JqKTtcbiAgICAgIHJldHVybiBCb29sZWFuKG9iaik7XG4gICAgfVxuICB9KTtcblxuICAkZGVmaW5lKFJlZ0V4cCwge1xuICAgIC8qKlxuICAgICAqIEVzY2FwZSBhIHN0cmluZyB0byB3b3JrIHdpdGhpbiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gc3RyIHN0cmluZyB0byBlc2NhcGVcbiAgICAgKiBAcmV0dXJuIHtzdHJpZ259ICAgICBlc2NhcGVkIHN0cmluZ1xuICAgICAqL1xuICAgIGVzY2FwZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cbiAgfSk7XG5cbiAgJGRlZmluZShKU09OLCB7XG4gICAgLyoqXG4gICAgICogVHJ5IHRvIHBhcnNlIGEganNvbiBzdHJpbmdcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciBqc29uIHN0cmluZ1xuICAgICAqIEByZXR1cm4ge21peGVkfSAgICAgIHBhcnNlZCByZXN1bHRcbiAgICAgKi9cbiAgICB0cnlQYXJzZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cblxuXG5cbiAgfVxuXG5cblxuXG4gIH0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuICB9LHtcIi4vcGFja2FnZVwiOjUsXCJ1dGlsXCI6NH1dLDc6W2Z1bmN0aW9uKGR5bmFtaWNSZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbiAgdmFyIGVuY29kZSA9IGR5bmFtaWNSZXF1aXJlKFwiLi9saWIvZW5jb2RlLmpzXCIpLFxuICAgICAgZGVjb2RlID0gZHluYW1pY1JlcXVpcmUoXCIuL2xpYi9kZWNvZGUuanNcIik7XG5cbiAgZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbihkYXRhLCBsZXZlbCl7XG4gICAgcmV0dXJuICghbGV2ZWwgfHwgbGV2ZWwgPD0gMCA/IGRlY29kZS5YTUwgOiBkZWNvZGUuSFRNTCkoZGF0YSk7XG4gIH07XG5cbiAgZXhwb3J0cy5kZWNvZGVTdHJpY3QgPSBmdW5jdGlvbihkYXRhLCBsZXZlbCl7XG4gICAgcmV0dXJuICghbGV2ZWwgfHwgbGV2ZWwgPD0gMCA/IGRlY29kZS5YTUwgOiBkZWNvZGUuSFRNTFN0cmljdCkoZGF0YSk7XG4gIH07XG5cbiAgZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbihkYXRhLCBsZXZlbCl7XG4gICAgcmV0dXJuICghbGV2ZWwgfHwgbGV2ZWwgPD0gMCA/IGVuY29kZS5YTUwgOiBlbmNvZGUuSFRNTCkoZGF0YSk7XG4gIH07XG5cbiAgZXhwb3J0cy5lbmNvZGVYTUwgPSBlbmNvZGUuWE1MO1xuXG4gIGV4cG9ydHMuZW5jb2RlSFRNTDQgPVxuICBleHBvcnRzLmVuY29kZUhUTUw1ID1cbiAgZXhwb3J0cy5lbmNvZGVIVE1MICA9IGVuY29kZS5IVE1MO1xuXG4gIGV4cG9ydHMuZGVjb2RlWE1MID1cbiAgZXhwb3J0cy5kZWNvZGVYTUxTdHJpY3QgPSBkZWNvZGUuWE1MO1xuXG4gIGV4cG9ydHMuZGVjb2RlSFRNTDQgPVxuICBleHBvcnRzLmRlY29kZUhUTUw1ID1cbiAgZXhwb3J0cy5kZWNvZGVIVE1MID0gZGVjb2RlLkhUTUw7XG5cbiAgZXhwb3J0cy5kZWNvZGVIVE1MNFN0cmljdCA9XG4gIGV4cG9ydHMuZGVjb2RlSFRNTDVTdHJpY3QgPVxuICBleHBvcnRzLmRlY29kZUhUTUxTdHJpY3QgPSBkZWNvZGUuSFRNTFN0cmljdDtcblxuICBleHBvcnRzLmVzY2FwZSA9IGVuY29kZS5lc2NhcGU7XG5cbiAgfSx7XCIuL2xpYi9kZWNvZGUuanNcIjo4LFwiLi9saWIvZW5jb2RlLmpzXCI6MTB9XSw4OltmdW5jdGlvbihkeW5hbWljUmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4gIHZhciBlbnRpdHlNYXAgPSBkeW5hbWljUmVxdWlyZShcIi4uL21hcHMvZW50aXRpZXMuanNvblwiKSxcbiAgICAgIGxlZ2FjeU1hcCA9IGR5bmFtaWNSZXF1aXJlKFwiLi4vbWFwcy9sZWdhY3kuanNvblwiKSxcbiAgICAgIHhtbE1hcCAgICA9IGR5bmFtaWNSZXF1aXJlKFwiLi4vbWFwcy94bWwuanNvblwiKSxcbiAgICAgIGRlY29kZUNvZGVQb2ludCA9IGR5bmFtaWNSZXF1aXJlKFwiLi9kZWNvZGVfY29kZXBvaW50LmpzXCIpO1xuXG4gIHZhciBkZWNvZGVYTUxTdHJpY3QgID0gZ2V0U3RyaWN0RGVjb2Rlcih4bWxNYXApLFxuICAgICAgZGVjb2RlSFRNTFN0cmljdCA9IGdldFN0cmljdERlY29kZXIoZW50aXR5TWFwKTtcblxuICBmdW5jdGlvbiBnZXRTdHJpY3REZWNvZGVyKG1hcCl7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhtYXApLmpvaW4oXCJ8XCIpLFxuICAgICAgICByZXBsYWNlID0gZ2V0UmVwbGFjZXIobWFwKTtcblxuICAgIGtleXMgKz0gXCJ8I1t4WF1bXFxcXGRhLWZBLUZdK3wjXFxcXGQrXCI7XG5cbiAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwiJig/OlwiICsga2V5cyArIFwiKTtcIiwgXCJnXCIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cil7XG4gICAgICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZShyZSwgcmVwbGFjZSk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBkZWNvZGVIVE1MID0gKGZ1bmN0aW9uKCl7XG4gICAgdmFyIGxlZ2FjeSA9IE9iamVjdC5rZXlzKGxlZ2FjeU1hcClcbiAgICAgIC5zb3J0KHNvcnRlcik7XG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVudGl0eU1hcClcbiAgICAgIC5zb3J0KHNvcnRlcik7XG5cbiAgICBmb3IodmFyIGkgPSAwLCBqID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuICAgICAgaWYobGVnYWN5W2pdID09PSBrZXlzW2ldKXtcbiAgICAgICAga2V5c1tpXSArPSBcIjs/XCI7XG4gICAgICAgIGorKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXNbaV0gKz0gXCI7XCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIiYoPzpcIiArIGtleXMuam9pbihcInxcIikgKyBcInwjW3hYXVtcXFxcZGEtZkEtRl0rOz98I1xcXFxkKzs/KVwiLCBcImdcIiksXG4gICAgICAgIHJlcGxhY2UgPSBnZXRSZXBsYWNlcihlbnRpdHlNYXApO1xuXG4gICAgZnVuY3Rpb24gcmVwbGFjZXIoc3RyKXtcbiAgICAgIGlmKHN0ci5zdWJzdHIoLTEpICE9PSBcIjtcIikgc3RyICs9IFwiO1wiO1xuICAgICAgcmV0dXJuIHJlcGxhY2Uoc3RyKTtcbiAgICB9XG5cbiAgICAvL1RPRE8gY29uc2lkZXIgY3JlYXRpbmcgYSBtZXJnZWQgbWFwXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cil7XG4gICAgICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZShyZSwgcmVwbGFjZXIpO1xuICAgIH07XG4gIH0oKSk7XG5cbiAgZnVuY3Rpb24gc29ydGVyKGEsIGIpe1xuICAgIHJldHVybiBhIDwgYiA/IDEgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcGxhY2VyKG1hcCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcGxhY2Uoc3RyKXtcbiAgICAgIGlmKHN0ci5jaGFyQXQoMSkgPT09IFwiI1wiKXtcbiAgICAgICAgaWYoc3RyLmNoYXJBdCgyKSA9PT0gXCJYXCIgfHwgc3RyLmNoYXJBdCgyKSA9PT0gXCJ4XCIpe1xuICAgICAgICAgIHJldHVybiBkZWNvZGVDb2RlUG9pbnQocGFyc2VJbnQoc3RyLnN1YnN0cigzKSwgMTYpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVjb2RlQ29kZVBvaW50KHBhcnNlSW50KHN0ci5zdWJzdHIoMiksIDEwKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwW3N0ci5zbGljZSgxLCAtMSldO1xuICAgIH07XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBYTUw6IGRlY29kZVhNTFN0cmljdCxcbiAgICBIVE1MOiBkZWNvZGVIVE1MLFxuICAgIEhUTUxTdHJpY3Q6IGRlY29kZUhUTUxTdHJpY3RcbiAgfTtcbiAgfSx7XCIuLi9tYXBzL2VudGl0aWVzLmpzb25cIjoxMixcIi4uL21hcHMvbGVnYWN5Lmpzb25cIjoxMyxcIi4uL21hcHMveG1sLmpzb25cIjoxNCxcIi4vZGVjb2RlX2NvZGVwb2ludC5qc1wiOjl9XSw5OltmdW5jdGlvbihkeW5hbWljUmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4gIHZhciBkZWNvZGVNYXAgPSBkeW5hbWljUmVxdWlyZShcIi4uL21hcHMvZGVjb2RlLmpzb25cIik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBkZWNvZGVDb2RlUG9pbnQ7XG5cbiAgLy8gbW9kaWZpZWQgdmVyc2lvbiBvZiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9oZS9ibG9iL21hc3Rlci9zcmMvaGUuanMjTDk0LUwxMTlcbiAgZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50KGNvZGVQb2ludCl7XG5cbiAgICBpZigoY29kZVBvaW50ID49IDB4RDgwMCAmJiBjb2RlUG9pbnQgPD0gMHhERkZGKSB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRil7XG4gICAgICByZXR1cm4gXCJcXHVGRkZEXCI7XG4gICAgfVxuXG4gICAgaWYoY29kZVBvaW50IGluIGRlY29kZU1hcCl7XG4gICAgICBjb2RlUG9pbnQgPSBkZWNvZGVNYXBbY29kZVBvaW50XTtcbiAgICB9XG5cbiAgICB2YXIgb3V0cHV0ID0gXCJcIjtcblxuICAgIGlmKGNvZGVQb2ludCA+IDB4RkZGRil7XG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRjtcbiAgICB9XG5cbiAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlUG9pbnQpO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICB9LHtcIi4uL21hcHMvZGVjb2RlLmpzb25cIjoxMX1dLDEwOltmdW5jdGlvbihkeW5hbWljUmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4gIHZhciBpbnZlcnNlWE1MID0gZ2V0SW52ZXJzZU9iaihkeW5hbWljUmVxdWlyZShcIi4uL21hcHMveG1sLmpzb25cIikpLFxuICAgICAgeG1sUmVwbGFjZXIgPSBnZXRJbnZlcnNlUmVwbGFjZXIoaW52ZXJzZVhNTCk7XG5cbiAgZXhwb3J0cy5YTUwgPSBnZXRJbnZlcnNlKGludmVyc2VYTUwsIHhtbFJlcGxhY2VyKTtcblxuICB2YXIgaW52ZXJzZUhUTUwgPSBnZXRJbnZlcnNlT2JqKGR5bmFtaWNSZXF1aXJlKFwiLi4vbWFwcy9lbnRpdGllcy5qc29uXCIpKSxcbiAgICAgIGh0bWxSZXBsYWNlciA9IGdldEludmVyc2VSZXBsYWNlcihpbnZlcnNlSFRNTCk7XG5cbiAgZXhwb3J0cy5IVE1MID0gZ2V0SW52ZXJzZShpbnZlcnNlSFRNTCwgaHRtbFJlcGxhY2VyKTtcblxuICBmdW5jdGlvbiBnZXRJbnZlcnNlT2JqKG9iail7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuc29ydCgpLnJlZHVjZShmdW5jdGlvbihpbnZlcnNlLCBuYW1lKXtcbiAgICAgIGludmVyc2Vbb2JqW25hbWVdXSA9IFwiJlwiICsgbmFtZSArIFwiO1wiO1xuICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgfSwge30pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW52ZXJzZVJlcGxhY2VyKGludmVyc2Upe1xuICAgIHZhciBzaW5nbGUgPSBbXSxcbiAgICAgICAgbXVsdGlwbGUgPSBbXTtcblxuICAgIE9iamVjdC5rZXlzKGludmVyc2UpLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICBpZihrLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgIHNpbmdsZS5wdXNoKFwiXFxcXFwiICsgayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtdWx0aXBsZS5wdXNoKGspO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9UT0RPIGFkZCByYW5nZXNcbiAgICBtdWx0aXBsZS51bnNoaWZ0KFwiW1wiICsgc2luZ2xlLmpvaW4oXCJcIikgKyBcIl1cIik7XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChtdWx0aXBsZS5qb2luKFwifFwiKSwgXCJnXCIpO1xuICB9XG5cbiAgdmFyIHJlX25vbkFTQ0lJID0gL1teXFwwLVxceDdGXS9nLFxuICAgICAgcmVfYXN0cmFsU3ltYm9scyA9IC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdL2c7XG5cbiAgZnVuY3Rpb24gc2luZ2xlQ2hhclJlcGxhY2VyKGMpe1xuICAgIHJldHVybiBcIiYjeFwiICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpICsgXCI7XCI7XG4gIH1cblxuICBmdW5jdGlvbiBhc3RyYWxSZXBsYWNlcihjKXtcbiAgICAvLyBodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuICAgIHZhciBoaWdoID0gYy5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBsb3cgID0gYy5jaGFyQ29kZUF0KDEpO1xuICAgIHZhciBjb2RlUG9pbnQgPSAoaGlnaCAtIDB4RDgwMCkgKiAweDQwMCArIGxvdyAtIDB4REMwMCArIDB4MTAwMDA7XG4gICAgcmV0dXJuIFwiJiN4XCIgKyBjb2RlUG9pbnQudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkgKyBcIjtcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEludmVyc2UoaW52ZXJzZSwgcmUpe1xuICAgIGZ1bmN0aW9uIGZ1bmMobmFtZSl7XG4gICAgICByZXR1cm4gaW52ZXJzZVtuYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSl7XG4gICAgICByZXR1cm4gZGF0YVxuICAgICAgICAgIC5yZXBsYWNlKHJlLCBmdW5jKVxuICAgICAgICAgIC5yZXBsYWNlKHJlX2FzdHJhbFN5bWJvbHMsIGFzdHJhbFJlcGxhY2VyKVxuICAgICAgICAgIC5yZXBsYWNlKHJlX25vbkFTQ0lJLCBzaW5nbGVDaGFyUmVwbGFjZXIpO1xuICAgIH07XG4gIH1cblxuICB2YXIgcmVfeG1sQ2hhcnMgPSBnZXRJbnZlcnNlUmVwbGFjZXIoaW52ZXJzZVhNTCk7XG5cbiAgZnVuY3Rpb24gZXNjYXBlWE1MKGRhdGEpe1xuICAgIHJldHVybiBkYXRhXG4gICAgICAgIC5yZXBsYWNlKHJlX3htbENoYXJzLCBzaW5nbGVDaGFyUmVwbGFjZXIpXG4gICAgICAgIC5yZXBsYWNlKHJlX2FzdHJhbFN5bWJvbHMsIGFzdHJhbFJlcGxhY2VyKVxuICAgICAgICAucmVwbGFjZShyZV9ub25BU0NJSSwgc2luZ2xlQ2hhclJlcGxhY2VyKTtcbiAgfVxuXG4gIGV4cG9ydHMuZXNjYXBlID0gZXNjYXBlWE1MO1xuXG4gIH0se1wiLi4vbWFwcy9lbnRpdGllcy5qc29uXCI6MTIsXCIuLi9tYXBzL3htbC5qc29uXCI6MTR9XSwxMTpbZnVuY3Rpb24oZHluYW1pY1JlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuICBtb2R1bGUuZXhwb3J0cz17XCIwXCI6NjU1MzMsXCIxMjhcIjo4MzY0LFwiMTMwXCI6ODIxOCxcIjEzMVwiOjQwMixcIjEzMlwiOjgyMjIsXCIxMzNcIjo4MjMwLFwiMTM0XCI6ODIyNCxcIjEzNVwiOjgyMjUsXCIxMzZcIjo3MTAsXCIxMzdcIjo4MjQwLFwiMTM4XCI6MzUyLFwiMTM5XCI6ODI0OSxcIjE0MFwiOjMzOCxcIjE0MlwiOjM4MSxcIjE0NVwiOjgyMTYsXCIxNDZcIjo4MjE3LFwiMTQ3XCI6ODIyMCxcIjE0OFwiOjgyMjEsXCIxNDlcIjo4MjI2LFwiMTUwXCI6ODIxMSxcIjE1MVwiOjgyMTIsXCIxNTJcIjo3MzIsXCIxNTNcIjo4NDgyLFwiMTU0XCI6MzUzLFwiMTU1XCI6ODI1MCxcIjE1NlwiOjMzOSxcIjE1OFwiOjM4MixcIjE1OVwiOjM3Nn1cbiAgfSx7fV0sMTI6W2Z1bmN0aW9uKGR5bmFtaWNSZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHM9e1wiQWFjdXRlXCI6XCJcXHUwMEMxXCIsXCJhYWN1dGVcIjpcIlxcdTAwRTFcIixcIkFicmV2ZVwiOlwiXFx1MDEwMlwiLFwiYWJyZXZlXCI6XCJcXHUwMTAzXCIsXCJhY1wiOlwiXFx1MjIzRVwiLFwiYWNkXCI6XCJcXHUyMjNGXCIsXCJhY0VcIjpcIlxcdTIyM0VcXHUwMzMzXCIsXCJBY2lyY1wiOlwiXFx1MDBDMlwiLFwiYWNpcmNcIjpcIlxcdTAwRTJcIixcImFjdXRlXCI6XCJcXHUwMEI0XCIsXCJBY3lcIjpcIlxcdTA0MTBcIixcImFjeVwiOlwiXFx1MDQzMFwiLFwiQUVsaWdcIjpcIlxcdTAwQzZcIixcImFlbGlnXCI6XCJcXHUwMEU2XCIsXCJhZlwiOlwiXFx1MjA2MVwiLFwiQWZyXCI6XCJcXHVEODM1XFx1REQwNFwiLFwiYWZyXCI6XCJcXHVEODM1XFx1REQxRVwiLFwiQWdyYXZlXCI6XCJcXHUwMEMwXCIsXCJhZ3JhdmVcIjpcIlxcdTAwRTBcIixcImFsZWZzeW1cIjpcIlxcdTIxMzVcIixcImFsZXBoXCI6XCJcXHUyMTM1XCIsXCJBbHBoYVwiOlwiXFx1MDM5MVwiLFwiYWxwaGFcIjpcIlxcdTAzQjFcIixcIkFtYWNyXCI6XCJcXHUwMTAwXCIsXCJhbWFjclwiOlwiXFx1MDEwMVwiLFwiYW1hbGdcIjpcIlxcdTJBM0ZcIixcImFtcFwiOlwiJlwiLFwiQU1QXCI6XCImXCIsXCJhbmRhbmRcIjpcIlxcdTJBNTVcIixcIkFuZFwiOlwiXFx1MkE1M1wiLFwiYW5kXCI6XCJcXHUyMjI3XCIsXCJhbmRkXCI6XCJcXHUyQTVDXCIsXCJhbmRzbG9wZVwiOlwiXFx1MkE1OFwiLFwiYW5kdlwiOlwiXFx1MkE1QVwiLFwiYW5nXCI6XCJcXHUyMjIwXCIsXCJhbmdlXCI6XCJcXHUyOUE0XCIsXCJhbmdsZVwiOlwiXFx1MjIyMFwiLFwiYW5nbXNkYWFcIjpcIlxcdTI5QThcIixcImFuZ21zZGFiXCI6XCJcXHUyOUE5XCIsXCJhbmdtc2RhY1wiOlwiXFx1MjlBQVwiLFwiYW5nbXNkYWRcIjpcIlxcdTI5QUJcIixcImFuZ21zZGFlXCI6XCJcXHUyOUFDXCIsXCJhbmdtc2RhZlwiOlwiXFx1MjlBRFwiLFwiYW5nbXNkYWdcIjpcIlxcdTI5QUVcIixcImFuZ21zZGFoXCI6XCJcXHUyOUFGXCIsXCJhbmdtc2RcIjpcIlxcdTIyMjFcIixcImFuZ3J0XCI6XCJcXHUyMjFGXCIsXCJhbmdydHZiXCI6XCJcXHUyMkJFXCIsXCJhbmdydHZiZFwiOlwiXFx1Mjk5RFwiLFwiYW5nc3BoXCI6XCJcXHUyMjIyXCIsXCJhbmdzdFwiOlwiXFx1MDBDNVwiLFwiYW5nemFyclwiOlwiXFx1MjM3Q1wiLFwiQW9nb25cIjpcIlxcdTAxMDRcIixcImFvZ29uXCI6XCJcXHUwMTA1XCIsXCJBb3BmXCI6XCJcXHVEODM1XFx1REQzOFwiLFwiYW9wZlwiOlwiXFx1RDgzNVxcdURENTJcIixcImFwYWNpclwiOlwiXFx1MkE2RlwiLFwiYXBcIjpcIlxcdTIyNDhcIixcImFwRVwiOlwiXFx1MkE3MFwiLFwiYXBlXCI6XCJcXHUyMjRBXCIsXCJhcGlkXCI6XCJcXHUyMjRCXCIsXCJhcG9zXCI6XCInXCIsXCJBcHBseUZ1bmN0aW9uXCI6XCJcXHUyMDYxXCIsXCJhcHByb3hcIjpcIlxcdTIyNDhcIixcImFwcHJveGVxXCI6XCJcXHUyMjRBXCIsXCJBcmluZ1wiOlwiXFx1MDBDNVwiLFwiYXJpbmdcIjpcIlxcdTAwRTVcIixcIkFzY3JcIjpcIlxcdUQ4MzVcXHVEQzlDXCIsXCJhc2NyXCI6XCJcXHVEODM1XFx1RENCNlwiLFwiQXNzaWduXCI6XCJcXHUyMjU0XCIsXCJhc3RcIjpcIipcIixcImFzeW1wXCI6XCJcXHUyMjQ4XCIsXCJhc3ltcGVxXCI6XCJcXHUyMjREXCIsXCJBdGlsZGVcIjpcIlxcdTAwQzNcIixcImF0aWxkZVwiOlwiXFx1MDBFM1wiLFwiQXVtbFwiOlwiXFx1MDBDNFwiLFwiYXVtbFwiOlwiXFx1MDBFNFwiLFwiYXdjb25pbnRcIjpcIlxcdTIyMzNcIixcImF3aW50XCI6XCJcXHUyQTExXCIsXCJiYWNrY29uZ1wiOlwiXFx1MjI0Q1wiLFwiYmFja2Vwc2lsb25cIjpcIlxcdTAzRjZcIixcImJhY2twcmltZVwiOlwiXFx1MjAzNVwiLFwiYmFja3NpbVwiOlwiXFx1MjIzRFwiLFwiYmFja3NpbWVxXCI6XCJcXHUyMkNEXCIsXCJCYWNrc2xhc2hcIjpcIlxcdTIyMTZcIixcIkJhcnZcIjpcIlxcdTJBRTdcIixcImJhcnZlZVwiOlwiXFx1MjJCRFwiLFwiYmFyd2VkXCI6XCJcXHUyMzA1XCIsXCJCYXJ3ZWRcIjpcIlxcdTIzMDZcIixcImJhcndlZGdlXCI6XCJcXHUyMzA1XCIsXCJiYnJrXCI6XCJcXHUyM0I1XCIsXCJiYnJrdGJya1wiOlwiXFx1MjNCNlwiLFwiYmNvbmdcIjpcIlxcdTIyNENcIixcIkJjeVwiOlwiXFx1MDQxMVwiLFwiYmN5XCI6XCJcXHUwNDMxXCIsXCJiZHF1b1wiOlwiXFx1MjAxRVwiLFwiYmVjYXVzXCI6XCJcXHUyMjM1XCIsXCJiZWNhdXNlXCI6XCJcXHUyMjM1XCIsXCJCZWNhdXNlXCI6XCJcXHUyMjM1XCIsXCJiZW1wdHl2XCI6XCJcXHUyOUIwXCIsXCJiZXBzaVwiOlwiXFx1MDNGNlwiLFwiYmVybm91XCI6XCJcXHUyMTJDXCIsXCJCZXJub3VsbGlzXCI6XCJcXHUyMTJDXCIsXCJCZXRhXCI6XCJcXHUwMzkyXCIsXCJiZXRhXCI6XCJcXHUwM0IyXCIsXCJiZXRoXCI6XCJcXHUyMTM2XCIsXCJiZXR3ZWVuXCI6XCJcXHUyMjZDXCIsXCJCZnJcIjpcIlxcdUQ4MzVcXHVERDA1XCIsXCJiZnJcIjpcIlxcdUQ4MzVcXHVERDFGXCIsXCJiaWdjYXBcIjpcIlxcdTIyQzJcIixcImJpZ2NpcmNcIjpcIlxcdTI1RUZcIixcImJpZ2N1cFwiOlwiXFx1MjJDM1wiLFwiYmlnb2RvdFwiOlwiXFx1MkEwMFwiLFwiYmlnb3BsdXNcIjpcIlxcdTJBMDFcIixcImJpZ290aW1lc1wiOlwiXFx1MkEwMlwiLFwiYmlnc3FjdXBcIjpcIlxcdTJBMDZcIixcImJpZ3N0YXJcIjpcIlxcdTI2MDVcIixcImJpZ3RyaWFuZ2xlZG93blwiOlwiXFx1MjVCRFwiLFwiYmlndHJpYW5nbGV1cFwiOlwiXFx1MjVCM1wiLFwiYmlndXBsdXNcIjpcIlxcdTJBMDRcIixcImJpZ3ZlZVwiOlwiXFx1MjJDMVwiLFwiYmlnd2VkZ2VcIjpcIlxcdTIyQzBcIixcImJrYXJvd1wiOlwiXFx1MjkwRFwiLFwiYmxhY2tsb3plbmdlXCI6XCJcXHUyOUVCXCIsXCJibGFja3NxdWFyZVwiOlwiXFx1MjVBQVwiLFwiYmxhY2t0cmlhbmdsZVwiOlwiXFx1MjVCNFwiLFwiYmxhY2t0cmlhbmdsZWRvd25cIjpcIlxcdTI1QkVcIixcImJsYWNrdHJpYW5nbGVsZWZ0XCI6XCJcXHUyNUMyXCIsXCJibGFja3RyaWFuZ2xlcmlnaHRcIjpcIlxcdTI1QjhcIixcImJsYW5rXCI6XCJcXHUyNDIzXCIsXCJibGsxMlwiOlwiXFx1MjU5MlwiLFwiYmxrMTRcIjpcIlxcdTI1OTFcIixcImJsazM0XCI6XCJcXHUyNTkzXCIsXCJibG9ja1wiOlwiXFx1MjU4OFwiLFwiYm5lXCI6XCI9XFx1MjBFNVwiLFwiYm5lcXVpdlwiOlwiXFx1MjI2MVxcdTIwRTVcIixcImJOb3RcIjpcIlxcdTJBRURcIixcImJub3RcIjpcIlxcdTIzMTBcIixcIkJvcGZcIjpcIlxcdUQ4MzVcXHVERDM5XCIsXCJib3BmXCI6XCJcXHVEODM1XFx1REQ1M1wiLFwiYm90XCI6XCJcXHUyMkE1XCIsXCJib3R0b21cIjpcIlxcdTIyQTVcIixcImJvd3RpZVwiOlwiXFx1MjJDOFwiLFwiYm94Ym94XCI6XCJcXHUyOUM5XCIsXCJib3hkbFwiOlwiXFx1MjUxMFwiLFwiYm94ZExcIjpcIlxcdTI1NTVcIixcImJveERsXCI6XCJcXHUyNTU2XCIsXCJib3hETFwiOlwiXFx1MjU1N1wiLFwiYm94ZHJcIjpcIlxcdTI1MENcIixcImJveGRSXCI6XCJcXHUyNTUyXCIsXCJib3hEclwiOlwiXFx1MjU1M1wiLFwiYm94RFJcIjpcIlxcdTI1NTRcIixcImJveGhcIjpcIlxcdTI1MDBcIixcImJveEhcIjpcIlxcdTI1NTBcIixcImJveGhkXCI6XCJcXHUyNTJDXCIsXCJib3hIZFwiOlwiXFx1MjU2NFwiLFwiYm94aERcIjpcIlxcdTI1NjVcIixcImJveEhEXCI6XCJcXHUyNTY2XCIsXCJib3hodVwiOlwiXFx1MjUzNFwiLFwiYm94SHVcIjpcIlxcdTI1NjdcIixcImJveGhVXCI6XCJcXHUyNTY4XCIsXCJib3hIVVwiOlwiXFx1MjU2OVwiLFwiYm94bWludXNcIjpcIlxcdTIyOUZcIixcImJveHBsdXNcIjpcIlxcdTIyOUVcIixcImJveHRpbWVzXCI6XCJcXHUyMkEwXCIsXCJib3h1bFwiOlwiXFx1MjUxOFwiLFwiYm94dUxcIjpcIlxcdTI1NUJcIixcImJveFVsXCI6XCJcXHUyNTVDXCIsXCJib3hVTFwiOlwiXFx1MjU1RFwiLFwiYm94dXJcIjpcIlxcdTI1MTRcIixcImJveHVSXCI6XCJcXHUyNTU4XCIsXCJib3hVclwiOlwiXFx1MjU1OVwiLFwiYm94VVJcIjpcIlxcdTI1NUFcIixcImJveHZcIjpcIlxcdTI1MDJcIixcImJveFZcIjpcIlxcdTI1NTFcIixcImJveHZoXCI6XCJcXHUyNTNDXCIsXCJib3h2SFwiOlwiXFx1MjU2QVwiLFwiYm94VmhcIjpcIlxcdTI1NkJcIixcImJveFZIXCI6XCJcXHUyNTZDXCIsXCJib3h2bFwiOlwiXFx1MjUyNFwiLFwiYm94dkxcIjpcIlxcdTI1NjFcIixcImJveFZsXCI6XCJcXHUyNTYyXCIsXCJib3hWTFwiOlwiXFx1MjU2M1wiLFwiYm94dnJcIjpcIlxcdTI1MUNcIixcImJveHZSXCI6XCJcXHUyNTVFXCIsXCJib3hWclwiOlwiXFx1MjU1RlwiLFwiYm94VlJcIjpcIlxcdTI1NjBcIixcImJwcmltZVwiOlwiXFx1MjAzNVwiLFwiYnJldmVcIjpcIlxcdTAyRDhcIixcIkJyZXZlXCI6XCJcXHUwMkQ4XCIsXCJicnZiYXJcIjpcIlxcdTAwQTZcIixcImJzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I3XCIsXCJCc2NyXCI6XCJcXHUyMTJDXCIsXCJic2VtaVwiOlwiXFx1MjA0RlwiLFwiYnNpbVwiOlwiXFx1MjIzRFwiLFwiYnNpbWVcIjpcIlxcdTIyQ0RcIixcImJzb2xiXCI6XCJcXHUyOUM1XCIsXCJic29sXCI6XCJcXFxcXCIsXCJic29saHN1YlwiOlwiXFx1MjdDOFwiLFwiYnVsbFwiOlwiXFx1MjAyMlwiLFwiYnVsbGV0XCI6XCJcXHUyMDIyXCIsXCJidW1wXCI6XCJcXHUyMjRFXCIsXCJidW1wRVwiOlwiXFx1MkFBRVwiLFwiYnVtcGVcIjpcIlxcdTIyNEZcIixcIkJ1bXBlcVwiOlwiXFx1MjI0RVwiLFwiYnVtcGVxXCI6XCJcXHUyMjRGXCIsXCJDYWN1dGVcIjpcIlxcdTAxMDZcIixcImNhY3V0ZVwiOlwiXFx1MDEwN1wiLFwiY2FwYW5kXCI6XCJcXHUyQTQ0XCIsXCJjYXBicmN1cFwiOlwiXFx1MkE0OVwiLFwiY2FwY2FwXCI6XCJcXHUyQTRCXCIsXCJjYXBcIjpcIlxcdTIyMjlcIixcIkNhcFwiOlwiXFx1MjJEMlwiLFwiY2FwY3VwXCI6XCJcXHUyQTQ3XCIsXCJjYXBkb3RcIjpcIlxcdTJBNDBcIixcIkNhcGl0YWxEaWZmZXJlbnRpYWxEXCI6XCJcXHUyMTQ1XCIsXCJjYXBzXCI6XCJcXHUyMjI5XFx1RkUwMFwiLFwiY2FyZXRcIjpcIlxcdTIwNDFcIixcImNhcm9uXCI6XCJcXHUwMkM3XCIsXCJDYXlsZXlzXCI6XCJcXHUyMTJEXCIsXCJjY2Fwc1wiOlwiXFx1MkE0RFwiLFwiQ2Nhcm9uXCI6XCJcXHUwMTBDXCIsXCJjY2Fyb25cIjpcIlxcdTAxMERcIixcIkNjZWRpbFwiOlwiXFx1MDBDN1wiLFwiY2NlZGlsXCI6XCJcXHUwMEU3XCIsXCJDY2lyY1wiOlwiXFx1MDEwOFwiLFwiY2NpcmNcIjpcIlxcdTAxMDlcIixcIkNjb25pbnRcIjpcIlxcdTIyMzBcIixcImNjdXBzXCI6XCJcXHUyQTRDXCIsXCJjY3Vwc3NtXCI6XCJcXHUyQTUwXCIsXCJDZG90XCI6XCJcXHUwMTBBXCIsXCJjZG90XCI6XCJcXHUwMTBCXCIsXCJjZWRpbFwiOlwiXFx1MDBCOFwiLFwiQ2VkaWxsYVwiOlwiXFx1MDBCOFwiLFwiY2VtcHR5dlwiOlwiXFx1MjlCMlwiLFwiY2VudFwiOlwiXFx1MDBBMlwiLFwiY2VudGVyZG90XCI6XCJcXHUwMEI3XCIsXCJDZW50ZXJEb3RcIjpcIlxcdTAwQjdcIixcImNmclwiOlwiXFx1RDgzNVxcdUREMjBcIixcIkNmclwiOlwiXFx1MjEyRFwiLFwiQ0hjeVwiOlwiXFx1MDQyN1wiLFwiY2hjeVwiOlwiXFx1MDQ0N1wiLFwiY2hlY2tcIjpcIlxcdTI3MTNcIixcImNoZWNrbWFya1wiOlwiXFx1MjcxM1wiLFwiQ2hpXCI6XCJcXHUwM0E3XCIsXCJjaGlcIjpcIlxcdTAzQzdcIixcImNpcmNcIjpcIlxcdTAyQzZcIixcImNpcmNlcVwiOlwiXFx1MjI1N1wiLFwiY2lyY2xlYXJyb3dsZWZ0XCI6XCJcXHUyMUJBXCIsXCJjaXJjbGVhcnJvd3JpZ2h0XCI6XCJcXHUyMUJCXCIsXCJjaXJjbGVkYXN0XCI6XCJcXHUyMjlCXCIsXCJjaXJjbGVkY2lyY1wiOlwiXFx1MjI5QVwiLFwiY2lyY2xlZGRhc2hcIjpcIlxcdTIyOURcIixcIkNpcmNsZURvdFwiOlwiXFx1MjI5OVwiLFwiY2lyY2xlZFJcIjpcIlxcdTAwQUVcIixcImNpcmNsZWRTXCI6XCJcXHUyNEM4XCIsXCJDaXJjbGVNaW51c1wiOlwiXFx1MjI5NlwiLFwiQ2lyY2xlUGx1c1wiOlwiXFx1MjI5NVwiLFwiQ2lyY2xlVGltZXNcIjpcIlxcdTIyOTdcIixcImNpclwiOlwiXFx1MjVDQlwiLFwiY2lyRVwiOlwiXFx1MjlDM1wiLFwiY2lyZVwiOlwiXFx1MjI1N1wiLFwiY2lyZm5pbnRcIjpcIlxcdTJBMTBcIixcImNpcm1pZFwiOlwiXFx1MkFFRlwiLFwiY2lyc2NpclwiOlwiXFx1MjlDMlwiLFwiQ2xvY2t3aXNlQ29udG91ckludGVncmFsXCI6XCJcXHUyMjMyXCIsXCJDbG9zZUN1cmx5RG91YmxlUXVvdGVcIjpcIlxcdTIwMURcIixcIkNsb3NlQ3VybHlRdW90ZVwiOlwiXFx1MjAxOVwiLFwiY2x1YnNcIjpcIlxcdTI2NjNcIixcImNsdWJzdWl0XCI6XCJcXHUyNjYzXCIsXCJjb2xvblwiOlwiOlwiLFwiQ29sb25cIjpcIlxcdTIyMzdcIixcIkNvbG9uZVwiOlwiXFx1MkE3NFwiLFwiY29sb25lXCI6XCJcXHUyMjU0XCIsXCJjb2xvbmVxXCI6XCJcXHUyMjU0XCIsXCJjb21tYVwiOlwiLFwiLFwiY29tbWF0XCI6XCJAXCIsXCJjb21wXCI6XCJcXHUyMjAxXCIsXCJjb21wZm5cIjpcIlxcdTIyMThcIixcImNvbXBsZW1lbnRcIjpcIlxcdTIyMDFcIixcImNvbXBsZXhlc1wiOlwiXFx1MjEwMlwiLFwiY29uZ1wiOlwiXFx1MjI0NVwiLFwiY29uZ2RvdFwiOlwiXFx1MkE2RFwiLFwiQ29uZ3J1ZW50XCI6XCJcXHUyMjYxXCIsXCJjb25pbnRcIjpcIlxcdTIyMkVcIixcIkNvbmludFwiOlwiXFx1MjIyRlwiLFwiQ29udG91ckludGVncmFsXCI6XCJcXHUyMjJFXCIsXCJjb3BmXCI6XCJcXHVEODM1XFx1REQ1NFwiLFwiQ29wZlwiOlwiXFx1MjEwMlwiLFwiY29wcm9kXCI6XCJcXHUyMjEwXCIsXCJDb3Byb2R1Y3RcIjpcIlxcdTIyMTBcIixcImNvcHlcIjpcIlxcdTAwQTlcIixcIkNPUFlcIjpcIlxcdTAwQTlcIixcImNvcHlzclwiOlwiXFx1MjExN1wiLFwiQ291bnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbFwiOlwiXFx1MjIzM1wiLFwiY3JhcnJcIjpcIlxcdTIxQjVcIixcImNyb3NzXCI6XCJcXHUyNzE3XCIsXCJDcm9zc1wiOlwiXFx1MkEyRlwiLFwiQ3NjclwiOlwiXFx1RDgzNVxcdURDOUVcIixcImNzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I4XCIsXCJjc3ViXCI6XCJcXHUyQUNGXCIsXCJjc3ViZVwiOlwiXFx1MkFEMVwiLFwiY3N1cFwiOlwiXFx1MkFEMFwiLFwiY3N1cGVcIjpcIlxcdTJBRDJcIixcImN0ZG90XCI6XCJcXHUyMkVGXCIsXCJjdWRhcnJsXCI6XCJcXHUyOTM4XCIsXCJjdWRhcnJyXCI6XCJcXHUyOTM1XCIsXCJjdWVwclwiOlwiXFx1MjJERVwiLFwiY3Vlc2NcIjpcIlxcdTIyREZcIixcImN1bGFyclwiOlwiXFx1MjFCNlwiLFwiY3VsYXJycFwiOlwiXFx1MjkzRFwiLFwiY3VwYnJjYXBcIjpcIlxcdTJBNDhcIixcImN1cGNhcFwiOlwiXFx1MkE0NlwiLFwiQ3VwQ2FwXCI6XCJcXHUyMjREXCIsXCJjdXBcIjpcIlxcdTIyMkFcIixcIkN1cFwiOlwiXFx1MjJEM1wiLFwiY3VwY3VwXCI6XCJcXHUyQTRBXCIsXCJjdXBkb3RcIjpcIlxcdTIyOERcIixcImN1cG9yXCI6XCJcXHUyQTQ1XCIsXCJjdXBzXCI6XCJcXHUyMjJBXFx1RkUwMFwiLFwiY3VyYXJyXCI6XCJcXHUyMUI3XCIsXCJjdXJhcnJtXCI6XCJcXHUyOTNDXCIsXCJjdXJseWVxcHJlY1wiOlwiXFx1MjJERVwiLFwiY3VybHllcXN1Y2NcIjpcIlxcdTIyREZcIixcImN1cmx5dmVlXCI6XCJcXHUyMkNFXCIsXCJjdXJseXdlZGdlXCI6XCJcXHUyMkNGXCIsXCJjdXJyZW5cIjpcIlxcdTAwQTRcIixcImN1cnZlYXJyb3dsZWZ0XCI6XCJcXHUyMUI2XCIsXCJjdXJ2ZWFycm93cmlnaHRcIjpcIlxcdTIxQjdcIixcImN1dmVlXCI6XCJcXHUyMkNFXCIsXCJjdXdlZFwiOlwiXFx1MjJDRlwiLFwiY3djb25pbnRcIjpcIlxcdTIyMzJcIixcImN3aW50XCI6XCJcXHUyMjMxXCIsXCJjeWxjdHlcIjpcIlxcdTIzMkRcIixcImRhZ2dlclwiOlwiXFx1MjAyMFwiLFwiRGFnZ2VyXCI6XCJcXHUyMDIxXCIsXCJkYWxldGhcIjpcIlxcdTIxMzhcIixcImRhcnJcIjpcIlxcdTIxOTNcIixcIkRhcnJcIjpcIlxcdTIxQTFcIixcImRBcnJcIjpcIlxcdTIxRDNcIixcImRhc2hcIjpcIlxcdTIwMTBcIixcIkRhc2h2XCI6XCJcXHUyQUU0XCIsXCJkYXNodlwiOlwiXFx1MjJBM1wiLFwiZGJrYXJvd1wiOlwiXFx1MjkwRlwiLFwiZGJsYWNcIjpcIlxcdTAyRERcIixcIkRjYXJvblwiOlwiXFx1MDEwRVwiLFwiZGNhcm9uXCI6XCJcXHUwMTBGXCIsXCJEY3lcIjpcIlxcdTA0MTRcIixcImRjeVwiOlwiXFx1MDQzNFwiLFwiZGRhZ2dlclwiOlwiXFx1MjAyMVwiLFwiZGRhcnJcIjpcIlxcdTIxQ0FcIixcIkREXCI6XCJcXHUyMTQ1XCIsXCJkZFwiOlwiXFx1MjE0NlwiLFwiRERvdHJhaGRcIjpcIlxcdTI5MTFcIixcImRkb3RzZXFcIjpcIlxcdTJBNzdcIixcImRlZ1wiOlwiXFx1MDBCMFwiLFwiRGVsXCI6XCJcXHUyMjA3XCIsXCJEZWx0YVwiOlwiXFx1MDM5NFwiLFwiZGVsdGFcIjpcIlxcdTAzQjRcIixcImRlbXB0eXZcIjpcIlxcdTI5QjFcIixcImRmaXNodFwiOlwiXFx1Mjk3RlwiLFwiRGZyXCI6XCJcXHVEODM1XFx1REQwN1wiLFwiZGZyXCI6XCJcXHVEODM1XFx1REQyMVwiLFwiZEhhclwiOlwiXFx1Mjk2NVwiLFwiZGhhcmxcIjpcIlxcdTIxQzNcIixcImRoYXJyXCI6XCJcXHUyMUMyXCIsXCJEaWFjcml0aWNhbEFjdXRlXCI6XCJcXHUwMEI0XCIsXCJEaWFjcml0aWNhbERvdFwiOlwiXFx1MDJEOVwiLFwiRGlhY3JpdGljYWxEb3VibGVBY3V0ZVwiOlwiXFx1MDJERFwiLFwiRGlhY3JpdGljYWxHcmF2ZVwiOlwiYFwiLFwiRGlhY3JpdGljYWxUaWxkZVwiOlwiXFx1MDJEQ1wiLFwiZGlhbVwiOlwiXFx1MjJDNFwiLFwiZGlhbW9uZFwiOlwiXFx1MjJDNFwiLFwiRGlhbW9uZFwiOlwiXFx1MjJDNFwiLFwiZGlhbW9uZHN1aXRcIjpcIlxcdTI2NjZcIixcImRpYW1zXCI6XCJcXHUyNjY2XCIsXCJkaWVcIjpcIlxcdTAwQThcIixcIkRpZmZlcmVudGlhbERcIjpcIlxcdTIxNDZcIixcImRpZ2FtbWFcIjpcIlxcdTAzRERcIixcImRpc2luXCI6XCJcXHUyMkYyXCIsXCJkaXZcIjpcIlxcdTAwRjdcIixcImRpdmlkZVwiOlwiXFx1MDBGN1wiLFwiZGl2aWRlb250aW1lc1wiOlwiXFx1MjJDN1wiLFwiZGl2b254XCI6XCJcXHUyMkM3XCIsXCJESmN5XCI6XCJcXHUwNDAyXCIsXCJkamN5XCI6XCJcXHUwNDUyXCIsXCJkbGNvcm5cIjpcIlxcdTIzMUVcIixcImRsY3JvcFwiOlwiXFx1MjMwRFwiLFwiZG9sbGFyXCI6XCIkXCIsXCJEb3BmXCI6XCJcXHVEODM1XFx1REQzQlwiLFwiZG9wZlwiOlwiXFx1RDgzNVxcdURENTVcIixcIkRvdFwiOlwiXFx1MDBBOFwiLFwiZG90XCI6XCJcXHUwMkQ5XCIsXCJEb3REb3RcIjpcIlxcdTIwRENcIixcImRvdGVxXCI6XCJcXHUyMjUwXCIsXCJkb3RlcWRvdFwiOlwiXFx1MjI1MVwiLFwiRG90RXF1YWxcIjpcIlxcdTIyNTBcIixcImRvdG1pbnVzXCI6XCJcXHUyMjM4XCIsXCJkb3RwbHVzXCI6XCJcXHUyMjE0XCIsXCJkb3RzcXVhcmVcIjpcIlxcdTIyQTFcIixcImRvdWJsZWJhcndlZGdlXCI6XCJcXHUyMzA2XCIsXCJEb3VibGVDb250b3VySW50ZWdyYWxcIjpcIlxcdTIyMkZcIixcIkRvdWJsZURvdFwiOlwiXFx1MDBBOFwiLFwiRG91YmxlRG93bkFycm93XCI6XCJcXHUyMUQzXCIsXCJEb3VibGVMZWZ0QXJyb3dcIjpcIlxcdTIxRDBcIixcIkRvdWJsZUxlZnRSaWdodEFycm93XCI6XCJcXHUyMUQ0XCIsXCJEb3VibGVMZWZ0VGVlXCI6XCJcXHUyQUU0XCIsXCJEb3VibGVMb25nTGVmdEFycm93XCI6XCJcXHUyN0Y4XCIsXCJEb3VibGVMb25nTGVmdFJpZ2h0QXJyb3dcIjpcIlxcdTI3RkFcIixcIkRvdWJsZUxvbmdSaWdodEFycm93XCI6XCJcXHUyN0Y5XCIsXCJEb3VibGVSaWdodEFycm93XCI6XCJcXHUyMUQyXCIsXCJEb3VibGVSaWdodFRlZVwiOlwiXFx1MjJBOFwiLFwiRG91YmxlVXBBcnJvd1wiOlwiXFx1MjFEMVwiLFwiRG91YmxlVXBEb3duQXJyb3dcIjpcIlxcdTIxRDVcIixcIkRvdWJsZVZlcnRpY2FsQmFyXCI6XCJcXHUyMjI1XCIsXCJEb3duQXJyb3dCYXJcIjpcIlxcdTI5MTNcIixcImRvd25hcnJvd1wiOlwiXFx1MjE5M1wiLFwiRG93bkFycm93XCI6XCJcXHUyMTkzXCIsXCJEb3duYXJyb3dcIjpcIlxcdTIxRDNcIixcIkRvd25BcnJvd1VwQXJyb3dcIjpcIlxcdTIxRjVcIixcIkRvd25CcmV2ZVwiOlwiXFx1MDMxMVwiLFwiZG93bmRvd25hcnJvd3NcIjpcIlxcdTIxQ0FcIixcImRvd25oYXJwb29ubGVmdFwiOlwiXFx1MjFDM1wiLFwiZG93bmhhcnBvb25yaWdodFwiOlwiXFx1MjFDMlwiLFwiRG93bkxlZnRSaWdodFZlY3RvclwiOlwiXFx1Mjk1MFwiLFwiRG93bkxlZnRUZWVWZWN0b3JcIjpcIlxcdTI5NUVcIixcIkRvd25MZWZ0VmVjdG9yQmFyXCI6XCJcXHUyOTU2XCIsXCJEb3duTGVmdFZlY3RvclwiOlwiXFx1MjFCRFwiLFwiRG93blJpZ2h0VGVlVmVjdG9yXCI6XCJcXHUyOTVGXCIsXCJEb3duUmlnaHRWZWN0b3JCYXJcIjpcIlxcdTI5NTdcIixcIkRvd25SaWdodFZlY3RvclwiOlwiXFx1MjFDMVwiLFwiRG93blRlZUFycm93XCI6XCJcXHUyMUE3XCIsXCJEb3duVGVlXCI6XCJcXHUyMkE0XCIsXCJkcmJrYXJvd1wiOlwiXFx1MjkxMFwiLFwiZHJjb3JuXCI6XCJcXHUyMzFGXCIsXCJkcmNyb3BcIjpcIlxcdTIzMENcIixcIkRzY3JcIjpcIlxcdUQ4MzVcXHVEQzlGXCIsXCJkc2NyXCI6XCJcXHVEODM1XFx1RENCOVwiLFwiRFNjeVwiOlwiXFx1MDQwNVwiLFwiZHNjeVwiOlwiXFx1MDQ1NVwiLFwiZHNvbFwiOlwiXFx1MjlGNlwiLFwiRHN0cm9rXCI6XCJcXHUwMTEwXCIsXCJkc3Ryb2tcIjpcIlxcdTAxMTFcIixcImR0ZG90XCI6XCJcXHUyMkYxXCIsXCJkdHJpXCI6XCJcXHUyNUJGXCIsXCJkdHJpZlwiOlwiXFx1MjVCRVwiLFwiZHVhcnJcIjpcIlxcdTIxRjVcIixcImR1aGFyXCI6XCJcXHUyOTZGXCIsXCJkd2FuZ2xlXCI6XCJcXHUyOUE2XCIsXCJEWmN5XCI6XCJcXHUwNDBGXCIsXCJkemN5XCI6XCJcXHUwNDVGXCIsXCJkemlncmFyclwiOlwiXFx1MjdGRlwiLFwiRWFjdXRlXCI6XCJcXHUwMEM5XCIsXCJlYWN1dGVcIjpcIlxcdTAwRTlcIixcImVhc3RlclwiOlwiXFx1MkE2RVwiLFwiRWNhcm9uXCI6XCJcXHUwMTFBXCIsXCJlY2Fyb25cIjpcIlxcdTAxMUJcIixcIkVjaXJjXCI6XCJcXHUwMENBXCIsXCJlY2lyY1wiOlwiXFx1MDBFQVwiLFwiZWNpclwiOlwiXFx1MjI1NlwiLFwiZWNvbG9uXCI6XCJcXHUyMjU1XCIsXCJFY3lcIjpcIlxcdTA0MkRcIixcImVjeVwiOlwiXFx1MDQ0RFwiLFwiZUREb3RcIjpcIlxcdTJBNzdcIixcIkVkb3RcIjpcIlxcdTAxMTZcIixcImVkb3RcIjpcIlxcdTAxMTdcIixcImVEb3RcIjpcIlxcdTIyNTFcIixcImVlXCI6XCJcXHUyMTQ3XCIsXCJlZkRvdFwiOlwiXFx1MjI1MlwiLFwiRWZyXCI6XCJcXHVEODM1XFx1REQwOFwiLFwiZWZyXCI6XCJcXHVEODM1XFx1REQyMlwiLFwiZWdcIjpcIlxcdTJBOUFcIixcIkVncmF2ZVwiOlwiXFx1MDBDOFwiLFwiZWdyYXZlXCI6XCJcXHUwMEU4XCIsXCJlZ3NcIjpcIlxcdTJBOTZcIixcImVnc2RvdFwiOlwiXFx1MkE5OFwiLFwiZWxcIjpcIlxcdTJBOTlcIixcIkVsZW1lbnRcIjpcIlxcdTIyMDhcIixcImVsaW50ZXJzXCI6XCJcXHUyM0U3XCIsXCJlbGxcIjpcIlxcdTIxMTNcIixcImVsc1wiOlwiXFx1MkE5NVwiLFwiZWxzZG90XCI6XCJcXHUyQTk3XCIsXCJFbWFjclwiOlwiXFx1MDExMlwiLFwiZW1hY3JcIjpcIlxcdTAxMTNcIixcImVtcHR5XCI6XCJcXHUyMjA1XCIsXCJlbXB0eXNldFwiOlwiXFx1MjIwNVwiLFwiRW1wdHlTbWFsbFNxdWFyZVwiOlwiXFx1MjVGQlwiLFwiZW1wdHl2XCI6XCJcXHUyMjA1XCIsXCJFbXB0eVZlcnlTbWFsbFNxdWFyZVwiOlwiXFx1MjVBQlwiLFwiZW1zcDEzXCI6XCJcXHUyMDA0XCIsXCJlbXNwMTRcIjpcIlxcdTIwMDVcIixcImVtc3BcIjpcIlxcdTIwMDNcIixcIkVOR1wiOlwiXFx1MDE0QVwiLFwiZW5nXCI6XCJcXHUwMTRCXCIsXCJlbnNwXCI6XCJcXHUyMDAyXCIsXCJFb2dvblwiOlwiXFx1MDExOFwiLFwiZW9nb25cIjpcIlxcdTAxMTlcIixcIkVvcGZcIjpcIlxcdUQ4MzVcXHVERDNDXCIsXCJlb3BmXCI6XCJcXHVEODM1XFx1REQ1NlwiLFwiZXBhclwiOlwiXFx1MjJENVwiLFwiZXBhcnNsXCI6XCJcXHUyOUUzXCIsXCJlcGx1c1wiOlwiXFx1MkE3MVwiLFwiZXBzaVwiOlwiXFx1MDNCNVwiLFwiRXBzaWxvblwiOlwiXFx1MDM5NVwiLFwiZXBzaWxvblwiOlwiXFx1MDNCNVwiLFwiZXBzaXZcIjpcIlxcdTAzRjVcIixcImVxY2lyY1wiOlwiXFx1MjI1NlwiLFwiZXFjb2xvblwiOlwiXFx1MjI1NVwiLFwiZXFzaW1cIjpcIlxcdTIyNDJcIixcImVxc2xhbnRndHJcIjpcIlxcdTJBOTZcIixcImVxc2xhbnRsZXNzXCI6XCJcXHUyQTk1XCIsXCJFcXVhbFwiOlwiXFx1MkE3NVwiLFwiZXF1YWxzXCI6XCI9XCIsXCJFcXVhbFRpbGRlXCI6XCJcXHUyMjQyXCIsXCJlcXVlc3RcIjpcIlxcdTIyNUZcIixcIkVxdWlsaWJyaXVtXCI6XCJcXHUyMUNDXCIsXCJlcXVpdlwiOlwiXFx1MjI2MVwiLFwiZXF1aXZERFwiOlwiXFx1MkE3OFwiLFwiZXF2cGFyc2xcIjpcIlxcdTI5RTVcIixcImVyYXJyXCI6XCJcXHUyOTcxXCIsXCJlckRvdFwiOlwiXFx1MjI1M1wiLFwiZXNjclwiOlwiXFx1MjEyRlwiLFwiRXNjclwiOlwiXFx1MjEzMFwiLFwiZXNkb3RcIjpcIlxcdTIyNTBcIixcIkVzaW1cIjpcIlxcdTJBNzNcIixcImVzaW1cIjpcIlxcdTIyNDJcIixcIkV0YVwiOlwiXFx1MDM5N1wiLFwiZXRhXCI6XCJcXHUwM0I3XCIsXCJFVEhcIjpcIlxcdTAwRDBcIixcImV0aFwiOlwiXFx1MDBGMFwiLFwiRXVtbFwiOlwiXFx1MDBDQlwiLFwiZXVtbFwiOlwiXFx1MDBFQlwiLFwiZXVyb1wiOlwiXFx1MjBBQ1wiLFwiZXhjbFwiOlwiIVwiLFwiZXhpc3RcIjpcIlxcdTIyMDNcIixcIkV4aXN0c1wiOlwiXFx1MjIwM1wiLFwiZXhwZWN0YXRpb25cIjpcIlxcdTIxMzBcIixcImV4cG9uZW50aWFsZVwiOlwiXFx1MjE0N1wiLFwiRXhwb25lbnRpYWxFXCI6XCJcXHUyMTQ3XCIsXCJmYWxsaW5nZG90c2VxXCI6XCJcXHUyMjUyXCIsXCJGY3lcIjpcIlxcdTA0MjRcIixcImZjeVwiOlwiXFx1MDQ0NFwiLFwiZmVtYWxlXCI6XCJcXHUyNjQwXCIsXCJmZmlsaWdcIjpcIlxcdUZCMDNcIixcImZmbGlnXCI6XCJcXHVGQjAwXCIsXCJmZmxsaWdcIjpcIlxcdUZCMDRcIixcIkZmclwiOlwiXFx1RDgzNVxcdUREMDlcIixcImZmclwiOlwiXFx1RDgzNVxcdUREMjNcIixcImZpbGlnXCI6XCJcXHVGQjAxXCIsXCJGaWxsZWRTbWFsbFNxdWFyZVwiOlwiXFx1MjVGQ1wiLFwiRmlsbGVkVmVyeVNtYWxsU3F1YXJlXCI6XCJcXHUyNUFBXCIsXCJmamxpZ1wiOlwiZmpcIixcImZsYXRcIjpcIlxcdTI2NkRcIixcImZsbGlnXCI6XCJcXHVGQjAyXCIsXCJmbHRuc1wiOlwiXFx1MjVCMVwiLFwiZm5vZlwiOlwiXFx1MDE5MlwiLFwiRm9wZlwiOlwiXFx1RDgzNVxcdUREM0RcIixcImZvcGZcIjpcIlxcdUQ4MzVcXHVERDU3XCIsXCJmb3JhbGxcIjpcIlxcdTIyMDBcIixcIkZvckFsbFwiOlwiXFx1MjIwMFwiLFwiZm9ya1wiOlwiXFx1MjJENFwiLFwiZm9ya3ZcIjpcIlxcdTJBRDlcIixcIkZvdXJpZXJ0cmZcIjpcIlxcdTIxMzFcIixcImZwYXJ0aW50XCI6XCJcXHUyQTBEXCIsXCJmcmFjMTJcIjpcIlxcdTAwQkRcIixcImZyYWMxM1wiOlwiXFx1MjE1M1wiLFwiZnJhYzE0XCI6XCJcXHUwMEJDXCIsXCJmcmFjMTVcIjpcIlxcdTIxNTVcIixcImZyYWMxNlwiOlwiXFx1MjE1OVwiLFwiZnJhYzE4XCI6XCJcXHUyMTVCXCIsXCJmcmFjMjNcIjpcIlxcdTIxNTRcIixcImZyYWMyNVwiOlwiXFx1MjE1NlwiLFwiZnJhYzM0XCI6XCJcXHUwMEJFXCIsXCJmcmFjMzVcIjpcIlxcdTIxNTdcIixcImZyYWMzOFwiOlwiXFx1MjE1Q1wiLFwiZnJhYzQ1XCI6XCJcXHUyMTU4XCIsXCJmcmFjNTZcIjpcIlxcdTIxNUFcIixcImZyYWM1OFwiOlwiXFx1MjE1RFwiLFwiZnJhYzc4XCI6XCJcXHUyMTVFXCIsXCJmcmFzbFwiOlwiXFx1MjA0NFwiLFwiZnJvd25cIjpcIlxcdTIzMjJcIixcImZzY3JcIjpcIlxcdUQ4MzVcXHVEQ0JCXCIsXCJGc2NyXCI6XCJcXHUyMTMxXCIsXCJnYWN1dGVcIjpcIlxcdTAxRjVcIixcIkdhbW1hXCI6XCJcXHUwMzkzXCIsXCJnYW1tYVwiOlwiXFx1MDNCM1wiLFwiR2FtbWFkXCI6XCJcXHUwM0RDXCIsXCJnYW1tYWRcIjpcIlxcdTAzRERcIixcImdhcFwiOlwiXFx1MkE4NlwiLFwiR2JyZXZlXCI6XCJcXHUwMTFFXCIsXCJnYnJldmVcIjpcIlxcdTAxMUZcIixcIkdjZWRpbFwiOlwiXFx1MDEyMlwiLFwiR2NpcmNcIjpcIlxcdTAxMUNcIixcImdjaXJjXCI6XCJcXHUwMTFEXCIsXCJHY3lcIjpcIlxcdTA0MTNcIixcImdjeVwiOlwiXFx1MDQzM1wiLFwiR2RvdFwiOlwiXFx1MDEyMFwiLFwiZ2RvdFwiOlwiXFx1MDEyMVwiLFwiZ2VcIjpcIlxcdTIyNjVcIixcImdFXCI6XCJcXHUyMjY3XCIsXCJnRWxcIjpcIlxcdTJBOENcIixcImdlbFwiOlwiXFx1MjJEQlwiLFwiZ2VxXCI6XCJcXHUyMjY1XCIsXCJnZXFxXCI6XCJcXHUyMjY3XCIsXCJnZXFzbGFudFwiOlwiXFx1MkE3RVwiLFwiZ2VzY2NcIjpcIlxcdTJBQTlcIixcImdlc1wiOlwiXFx1MkE3RVwiLFwiZ2VzZG90XCI6XCJcXHUyQTgwXCIsXCJnZXNkb3RvXCI6XCJcXHUyQTgyXCIsXCJnZXNkb3RvbFwiOlwiXFx1MkE4NFwiLFwiZ2VzbFwiOlwiXFx1MjJEQlxcdUZFMDBcIixcImdlc2xlc1wiOlwiXFx1MkE5NFwiLFwiR2ZyXCI6XCJcXHVEODM1XFx1REQwQVwiLFwiZ2ZyXCI6XCJcXHVEODM1XFx1REQyNFwiLFwiZ2dcIjpcIlxcdTIyNkJcIixcIkdnXCI6XCJcXHUyMkQ5XCIsXCJnZ2dcIjpcIlxcdTIyRDlcIixcImdpbWVsXCI6XCJcXHUyMTM3XCIsXCJHSmN5XCI6XCJcXHUwNDAzXCIsXCJnamN5XCI6XCJcXHUwNDUzXCIsXCJnbGFcIjpcIlxcdTJBQTVcIixcImdsXCI6XCJcXHUyMjc3XCIsXCJnbEVcIjpcIlxcdTJBOTJcIixcImdsalwiOlwiXFx1MkFBNFwiLFwiZ25hcFwiOlwiXFx1MkE4QVwiLFwiZ25hcHByb3hcIjpcIlxcdTJBOEFcIixcImduZVwiOlwiXFx1MkE4OFwiLFwiZ25FXCI6XCJcXHUyMjY5XCIsXCJnbmVxXCI6XCJcXHUyQTg4XCIsXCJnbmVxcVwiOlwiXFx1MjI2OVwiLFwiZ25zaW1cIjpcIlxcdTIyRTdcIixcIkdvcGZcIjpcIlxcdUQ4MzVcXHVERDNFXCIsXCJnb3BmXCI6XCJcXHVEODM1XFx1REQ1OFwiLFwiZ3JhdmVcIjpcImBcIixcIkdyZWF0ZXJFcXVhbFwiOlwiXFx1MjI2NVwiLFwiR3JlYXRlckVxdWFsTGVzc1wiOlwiXFx1MjJEQlwiLFwiR3JlYXRlckZ1bGxFcXVhbFwiOlwiXFx1MjI2N1wiLFwiR3JlYXRlckdyZWF0ZXJcIjpcIlxcdTJBQTJcIixcIkdyZWF0ZXJMZXNzXCI6XCJcXHUyMjc3XCIsXCJHcmVhdGVyU2xhbnRFcXVhbFwiOlwiXFx1MkE3RVwiLFwiR3JlYXRlclRpbGRlXCI6XCJcXHUyMjczXCIsXCJHc2NyXCI6XCJcXHVEODM1XFx1RENBMlwiLFwiZ3NjclwiOlwiXFx1MjEwQVwiLFwiZ3NpbVwiOlwiXFx1MjI3M1wiLFwiZ3NpbWVcIjpcIlxcdTJBOEVcIixcImdzaW1sXCI6XCJcXHUyQTkwXCIsXCJndGNjXCI6XCJcXHUyQUE3XCIsXCJndGNpclwiOlwiXFx1MkE3QVwiLFwiZ3RcIjpcIj5cIixcIkdUXCI6XCI+XCIsXCJHdFwiOlwiXFx1MjI2QlwiLFwiZ3Rkb3RcIjpcIlxcdTIyRDdcIixcImd0bFBhclwiOlwiXFx1Mjk5NVwiLFwiZ3RxdWVzdFwiOlwiXFx1MkE3Q1wiLFwiZ3RyYXBwcm94XCI6XCJcXHUyQTg2XCIsXCJndHJhcnJcIjpcIlxcdTI5NzhcIixcImd0cmRvdFwiOlwiXFx1MjJEN1wiLFwiZ3RyZXFsZXNzXCI6XCJcXHUyMkRCXCIsXCJndHJlcXFsZXNzXCI6XCJcXHUyQThDXCIsXCJndHJsZXNzXCI6XCJcXHUyMjc3XCIsXCJndHJzaW1cIjpcIlxcdTIyNzNcIixcImd2ZXJ0bmVxcVwiOlwiXFx1MjI2OVxcdUZFMDBcIixcImd2bkVcIjpcIlxcdTIyNjlcXHVGRTAwXCIsXCJIYWNla1wiOlwiXFx1MDJDN1wiLFwiaGFpcnNwXCI6XCJcXHUyMDBBXCIsXCJoYWxmXCI6XCJcXHUwMEJEXCIsXCJoYW1pbHRcIjpcIlxcdTIxMEJcIixcIkhBUkRjeVwiOlwiXFx1MDQyQVwiLFwiaGFyZGN5XCI6XCJcXHUwNDRBXCIsXCJoYXJyY2lyXCI6XCJcXHUyOTQ4XCIsXCJoYXJyXCI6XCJcXHUyMTk0XCIsXCJoQXJyXCI6XCJcXHUyMUQ0XCIsXCJoYXJyd1wiOlwiXFx1MjFBRFwiLFwiSGF0XCI6XCJeXCIsXCJoYmFyXCI6XCJcXHUyMTBGXCIsXCJIY2lyY1wiOlwiXFx1MDEyNFwiLFwiaGNpcmNcIjpcIlxcdTAxMjVcIixcImhlYXJ0c1wiOlwiXFx1MjY2NVwiLFwiaGVhcnRzdWl0XCI6XCJcXHUyNjY1XCIsXCJoZWxsaXBcIjpcIlxcdTIwMjZcIixcImhlcmNvblwiOlwiXFx1MjJCOVwiLFwiaGZyXCI6XCJcXHVEODM1XFx1REQyNVwiLFwiSGZyXCI6XCJcXHUyMTBDXCIsXCJIaWxiZXJ0U3BhY2VcIjpcIlxcdTIxMEJcIixcImhrc2Vhcm93XCI6XCJcXHUyOTI1XCIsXCJoa3N3YXJvd1wiOlwiXFx1MjkyNlwiLFwiaG9hcnJcIjpcIlxcdTIxRkZcIixcImhvbXRodFwiOlwiXFx1MjIzQlwiLFwiaG9va2xlZnRhcnJvd1wiOlwiXFx1MjFBOVwiLFwiaG9va3JpZ2h0YXJyb3dcIjpcIlxcdTIxQUFcIixcImhvcGZcIjpcIlxcdUQ4MzVcXHVERDU5XCIsXCJIb3BmXCI6XCJcXHUyMTBEXCIsXCJob3JiYXJcIjpcIlxcdTIwMTVcIixcIkhvcml6b250YWxMaW5lXCI6XCJcXHUyNTAwXCIsXCJoc2NyXCI6XCJcXHVEODM1XFx1RENCRFwiLFwiSHNjclwiOlwiXFx1MjEwQlwiLFwiaHNsYXNoXCI6XCJcXHUyMTBGXCIsXCJIc3Ryb2tcIjpcIlxcdTAxMjZcIixcImhzdHJva1wiOlwiXFx1MDEyN1wiLFwiSHVtcERvd25IdW1wXCI6XCJcXHUyMjRFXCIsXCJIdW1wRXF1YWxcIjpcIlxcdTIyNEZcIixcImh5YnVsbFwiOlwiXFx1MjA0M1wiLFwiaHlwaGVuXCI6XCJcXHUyMDEwXCIsXCJJYWN1dGVcIjpcIlxcdTAwQ0RcIixcImlhY3V0ZVwiOlwiXFx1MDBFRFwiLFwiaWNcIjpcIlxcdTIwNjNcIixcIkljaXJjXCI6XCJcXHUwMENFXCIsXCJpY2lyY1wiOlwiXFx1MDBFRVwiLFwiSWN5XCI6XCJcXHUwNDE4XCIsXCJpY3lcIjpcIlxcdTA0MzhcIixcIklkb3RcIjpcIlxcdTAxMzBcIixcIklFY3lcIjpcIlxcdTA0MTVcIixcImllY3lcIjpcIlxcdTA0MzVcIixcImlleGNsXCI6XCJcXHUwMEExXCIsXCJpZmZcIjpcIlxcdTIxRDRcIixcImlmclwiOlwiXFx1RDgzNVxcdUREMjZcIixcIklmclwiOlwiXFx1MjExMVwiLFwiSWdyYXZlXCI6XCJcXHUwMENDXCIsXCJpZ3JhdmVcIjpcIlxcdTAwRUNcIixcImlpXCI6XCJcXHUyMTQ4XCIsXCJpaWlpbnRcIjpcIlxcdTJBMENcIixcImlpaW50XCI6XCJcXHUyMjJEXCIsXCJpaW5maW5cIjpcIlxcdTI5RENcIixcImlpb3RhXCI6XCJcXHUyMTI5XCIsXCJJSmxpZ1wiOlwiXFx1MDEzMlwiLFwiaWpsaWdcIjpcIlxcdTAxMzNcIixcIkltYWNyXCI6XCJcXHUwMTJBXCIsXCJpbWFjclwiOlwiXFx1MDEyQlwiLFwiaW1hZ2VcIjpcIlxcdTIxMTFcIixcIkltYWdpbmFyeUlcIjpcIlxcdTIxNDhcIixcImltYWdsaW5lXCI6XCJcXHUyMTEwXCIsXCJpbWFncGFydFwiOlwiXFx1MjExMVwiLFwiaW1hdGhcIjpcIlxcdTAxMzFcIixcIkltXCI6XCJcXHUyMTExXCIsXCJpbW9mXCI6XCJcXHUyMkI3XCIsXCJpbXBlZFwiOlwiXFx1MDFCNVwiLFwiSW1wbGllc1wiOlwiXFx1MjFEMlwiLFwiaW5jYXJlXCI6XCJcXHUyMTA1XCIsXCJpblwiOlwiXFx1MjIwOFwiLFwiaW5maW5cIjpcIlxcdTIyMUVcIixcImluZmludGllXCI6XCJcXHUyOUREXCIsXCJpbm9kb3RcIjpcIlxcdTAxMzFcIixcImludGNhbFwiOlwiXFx1MjJCQVwiLFwiaW50XCI6XCJcXHUyMjJCXCIsXCJJbnRcIjpcIlxcdTIyMkNcIixcImludGVnZXJzXCI6XCJcXHUyMTI0XCIsXCJJbnRlZ3JhbFwiOlwiXFx1MjIyQlwiLFwiaW50ZXJjYWxcIjpcIlxcdTIyQkFcIixcIkludGVyc2VjdGlvblwiOlwiXFx1MjJDMlwiLFwiaW50bGFyaGtcIjpcIlxcdTJBMTdcIixcImludHByb2RcIjpcIlxcdTJBM0NcIixcIkludmlzaWJsZUNvbW1hXCI6XCJcXHUyMDYzXCIsXCJJbnZpc2libGVUaW1lc1wiOlwiXFx1MjA2MlwiLFwiSU9jeVwiOlwiXFx1MDQwMVwiLFwiaW9jeVwiOlwiXFx1MDQ1MVwiLFwiSW9nb25cIjpcIlxcdTAxMkVcIixcImlvZ29uXCI6XCJcXHUwMTJGXCIsXCJJb3BmXCI6XCJcXHVEODM1XFx1REQ0MFwiLFwiaW9wZlwiOlwiXFx1RDgzNVxcdURENUFcIixcIklvdGFcIjpcIlxcdTAzOTlcIixcImlvdGFcIjpcIlxcdTAzQjlcIixcImlwcm9kXCI6XCJcXHUyQTNDXCIsXCJpcXVlc3RcIjpcIlxcdTAwQkZcIixcImlzY3JcIjpcIlxcdUQ4MzVcXHVEQ0JFXCIsXCJJc2NyXCI6XCJcXHUyMTEwXCIsXCJpc2luXCI6XCJcXHUyMjA4XCIsXCJpc2luZG90XCI6XCJcXHUyMkY1XCIsXCJpc2luRVwiOlwiXFx1MjJGOVwiLFwiaXNpbnNcIjpcIlxcdTIyRjRcIixcImlzaW5zdlwiOlwiXFx1MjJGM1wiLFwiaXNpbnZcIjpcIlxcdTIyMDhcIixcIml0XCI6XCJcXHUyMDYyXCIsXCJJdGlsZGVcIjpcIlxcdTAxMjhcIixcIml0aWxkZVwiOlwiXFx1MDEyOVwiLFwiSXVrY3lcIjpcIlxcdTA0MDZcIixcIml1a2N5XCI6XCJcXHUwNDU2XCIsXCJJdW1sXCI6XCJcXHUwMENGXCIsXCJpdW1sXCI6XCJcXHUwMEVGXCIsXCJKY2lyY1wiOlwiXFx1MDEzNFwiLFwiamNpcmNcIjpcIlxcdTAxMzVcIixcIkpjeVwiOlwiXFx1MDQxOVwiLFwiamN5XCI6XCJcXHUwNDM5XCIsXCJKZnJcIjpcIlxcdUQ4MzVcXHVERDBEXCIsXCJqZnJcIjpcIlxcdUQ4MzVcXHVERDI3XCIsXCJqbWF0aFwiOlwiXFx1MDIzN1wiLFwiSm9wZlwiOlwiXFx1RDgzNVxcdURENDFcIixcImpvcGZcIjpcIlxcdUQ4MzVcXHVERDVCXCIsXCJKc2NyXCI6XCJcXHVEODM1XFx1RENBNVwiLFwianNjclwiOlwiXFx1RDgzNVxcdURDQkZcIixcIkpzZXJjeVwiOlwiXFx1MDQwOFwiLFwianNlcmN5XCI6XCJcXHUwNDU4XCIsXCJKdWtjeVwiOlwiXFx1MDQwNFwiLFwianVrY3lcIjpcIlxcdTA0NTRcIixcIkthcHBhXCI6XCJcXHUwMzlBXCIsXCJrYXBwYVwiOlwiXFx1MDNCQVwiLFwia2FwcGF2XCI6XCJcXHUwM0YwXCIsXCJLY2VkaWxcIjpcIlxcdTAxMzZcIixcImtjZWRpbFwiOlwiXFx1MDEzN1wiLFwiS2N5XCI6XCJcXHUwNDFBXCIsXCJrY3lcIjpcIlxcdTA0M0FcIixcIktmclwiOlwiXFx1RDgzNVxcdUREMEVcIixcImtmclwiOlwiXFx1RDgzNVxcdUREMjhcIixcImtncmVlblwiOlwiXFx1MDEzOFwiLFwiS0hjeVwiOlwiXFx1MDQyNVwiLFwia2hjeVwiOlwiXFx1MDQ0NVwiLFwiS0pjeVwiOlwiXFx1MDQwQ1wiLFwia2pjeVwiOlwiXFx1MDQ1Q1wiLFwiS29wZlwiOlwiXFx1RDgzNVxcdURENDJcIixcImtvcGZcIjpcIlxcdUQ4MzVcXHVERDVDXCIsXCJLc2NyXCI6XCJcXHVEODM1XFx1RENBNlwiLFwia3NjclwiOlwiXFx1RDgzNVxcdURDQzBcIixcImxBYXJyXCI6XCJcXHUyMURBXCIsXCJMYWN1dGVcIjpcIlxcdTAxMzlcIixcImxhY3V0ZVwiOlwiXFx1MDEzQVwiLFwibGFlbXB0eXZcIjpcIlxcdTI5QjRcIixcImxhZ3JhblwiOlwiXFx1MjExMlwiLFwiTGFtYmRhXCI6XCJcXHUwMzlCXCIsXCJsYW1iZGFcIjpcIlxcdTAzQkJcIixcImxhbmdcIjpcIlxcdTI3RThcIixcIkxhbmdcIjpcIlxcdTI3RUFcIixcImxhbmdkXCI6XCJcXHUyOTkxXCIsXCJsYW5nbGVcIjpcIlxcdTI3RThcIixcImxhcFwiOlwiXFx1MkE4NVwiLFwiTGFwbGFjZXRyZlwiOlwiXFx1MjExMlwiLFwibGFxdW9cIjpcIlxcdTAwQUJcIixcImxhcnJiXCI6XCJcXHUyMUU0XCIsXCJsYXJyYmZzXCI6XCJcXHUyOTFGXCIsXCJsYXJyXCI6XCJcXHUyMTkwXCIsXCJMYXJyXCI6XCJcXHUyMTlFXCIsXCJsQXJyXCI6XCJcXHUyMUQwXCIsXCJsYXJyZnNcIjpcIlxcdTI5MURcIixcImxhcnJoa1wiOlwiXFx1MjFBOVwiLFwibGFycmxwXCI6XCJcXHUyMUFCXCIsXCJsYXJycGxcIjpcIlxcdTI5MzlcIixcImxhcnJzaW1cIjpcIlxcdTI5NzNcIixcImxhcnJ0bFwiOlwiXFx1MjFBMlwiLFwibGF0YWlsXCI6XCJcXHUyOTE5XCIsXCJsQXRhaWxcIjpcIlxcdTI5MUJcIixcImxhdFwiOlwiXFx1MkFBQlwiLFwibGF0ZVwiOlwiXFx1MkFBRFwiLFwibGF0ZXNcIjpcIlxcdTJBQURcXHVGRTAwXCIsXCJsYmFyclwiOlwiXFx1MjkwQ1wiLFwibEJhcnJcIjpcIlxcdTI5MEVcIixcImxiYnJrXCI6XCJcXHUyNzcyXCIsXCJsYnJhY2VcIjpcIntcIixcImxicmFja1wiOlwiW1wiLFwibGJya2VcIjpcIlxcdTI5OEJcIixcImxicmtzbGRcIjpcIlxcdTI5OEZcIixcImxicmtzbHVcIjpcIlxcdTI5OERcIixcIkxjYXJvblwiOlwiXFx1MDEzRFwiLFwibGNhcm9uXCI6XCJcXHUwMTNFXCIsXCJMY2VkaWxcIjpcIlxcdTAxM0JcIixcImxjZWRpbFwiOlwiXFx1MDEzQ1wiLFwibGNlaWxcIjpcIlxcdTIzMDhcIixcImxjdWJcIjpcIntcIixcIkxjeVwiOlwiXFx1MDQxQlwiLFwibGN5XCI6XCJcXHUwNDNCXCIsXCJsZGNhXCI6XCJcXHUyOTM2XCIsXCJsZHF1b1wiOlwiXFx1MjAxQ1wiLFwibGRxdW9yXCI6XCJcXHUyMDFFXCIsXCJsZHJkaGFyXCI6XCJcXHUyOTY3XCIsXCJsZHJ1c2hhclwiOlwiXFx1Mjk0QlwiLFwibGRzaFwiOlwiXFx1MjFCMlwiLFwibGVcIjpcIlxcdTIyNjRcIixcImxFXCI6XCJcXHUyMjY2XCIsXCJMZWZ0QW5nbGVCcmFja2V0XCI6XCJcXHUyN0U4XCIsXCJMZWZ0QXJyb3dCYXJcIjpcIlxcdTIxRTRcIixcImxlZnRhcnJvd1wiOlwiXFx1MjE5MFwiLFwiTGVmdEFycm93XCI6XCJcXHUyMTkwXCIsXCJMZWZ0YXJyb3dcIjpcIlxcdTIxRDBcIixcIkxlZnRBcnJvd1JpZ2h0QXJyb3dcIjpcIlxcdTIxQzZcIixcImxlZnRhcnJvd3RhaWxcIjpcIlxcdTIxQTJcIixcIkxlZnRDZWlsaW5nXCI6XCJcXHUyMzA4XCIsXCJMZWZ0RG91YmxlQnJhY2tldFwiOlwiXFx1MjdFNlwiLFwiTGVmdERvd25UZWVWZWN0b3JcIjpcIlxcdTI5NjFcIixcIkxlZnREb3duVmVjdG9yQmFyXCI6XCJcXHUyOTU5XCIsXCJMZWZ0RG93blZlY3RvclwiOlwiXFx1MjFDM1wiLFwiTGVmdEZsb29yXCI6XCJcXHUyMzBBXCIsXCJsZWZ0aGFycG9vbmRvd25cIjpcIlxcdTIxQkRcIixcImxlZnRoYXJwb29udXBcIjpcIlxcdTIxQkNcIixcImxlZnRsZWZ0YXJyb3dzXCI6XCJcXHUyMUM3XCIsXCJsZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjE5NFwiLFwiTGVmdFJpZ2h0QXJyb3dcIjpcIlxcdTIxOTRcIixcIkxlZnRyaWdodGFycm93XCI6XCJcXHUyMUQ0XCIsXCJsZWZ0cmlnaHRhcnJvd3NcIjpcIlxcdTIxQzZcIixcImxlZnRyaWdodGhhcnBvb25zXCI6XCJcXHUyMUNCXCIsXCJsZWZ0cmlnaHRzcXVpZ2Fycm93XCI6XCJcXHUyMUFEXCIsXCJMZWZ0UmlnaHRWZWN0b3JcIjpcIlxcdTI5NEVcIixcIkxlZnRUZWVBcnJvd1wiOlwiXFx1MjFBNFwiLFwiTGVmdFRlZVwiOlwiXFx1MjJBM1wiLFwiTGVmdFRlZVZlY3RvclwiOlwiXFx1Mjk1QVwiLFwibGVmdHRocmVldGltZXNcIjpcIlxcdTIyQ0JcIixcIkxlZnRUcmlhbmdsZUJhclwiOlwiXFx1MjlDRlwiLFwiTGVmdFRyaWFuZ2xlXCI6XCJcXHUyMkIyXCIsXCJMZWZ0VHJpYW5nbGVFcXVhbFwiOlwiXFx1MjJCNFwiLFwiTGVmdFVwRG93blZlY3RvclwiOlwiXFx1Mjk1MVwiLFwiTGVmdFVwVGVlVmVjdG9yXCI6XCJcXHUyOTYwXCIsXCJMZWZ0VXBWZWN0b3JCYXJcIjpcIlxcdTI5NThcIixcIkxlZnRVcFZlY3RvclwiOlwiXFx1MjFCRlwiLFwiTGVmdFZlY3RvckJhclwiOlwiXFx1Mjk1MlwiLFwiTGVmdFZlY3RvclwiOlwiXFx1MjFCQ1wiLFwibEVnXCI6XCJcXHUyQThCXCIsXCJsZWdcIjpcIlxcdTIyREFcIixcImxlcVwiOlwiXFx1MjI2NFwiLFwibGVxcVwiOlwiXFx1MjI2NlwiLFwibGVxc2xhbnRcIjpcIlxcdTJBN0RcIixcImxlc2NjXCI6XCJcXHUyQUE4XCIsXCJsZXNcIjpcIlxcdTJBN0RcIixcImxlc2RvdFwiOlwiXFx1MkE3RlwiLFwibGVzZG90b1wiOlwiXFx1MkE4MVwiLFwibGVzZG90b3JcIjpcIlxcdTJBODNcIixcImxlc2dcIjpcIlxcdTIyREFcXHVGRTAwXCIsXCJsZXNnZXNcIjpcIlxcdTJBOTNcIixcImxlc3NhcHByb3hcIjpcIlxcdTJBODVcIixcImxlc3Nkb3RcIjpcIlxcdTIyRDZcIixcImxlc3NlcWd0clwiOlwiXFx1MjJEQVwiLFwibGVzc2VxcWd0clwiOlwiXFx1MkE4QlwiLFwiTGVzc0VxdWFsR3JlYXRlclwiOlwiXFx1MjJEQVwiLFwiTGVzc0Z1bGxFcXVhbFwiOlwiXFx1MjI2NlwiLFwiTGVzc0dyZWF0ZXJcIjpcIlxcdTIyNzZcIixcImxlc3NndHJcIjpcIlxcdTIyNzZcIixcIkxlc3NMZXNzXCI6XCJcXHUyQUExXCIsXCJsZXNzc2ltXCI6XCJcXHUyMjcyXCIsXCJMZXNzU2xhbnRFcXVhbFwiOlwiXFx1MkE3RFwiLFwiTGVzc1RpbGRlXCI6XCJcXHUyMjcyXCIsXCJsZmlzaHRcIjpcIlxcdTI5N0NcIixcImxmbG9vclwiOlwiXFx1MjMwQVwiLFwiTGZyXCI6XCJcXHVEODM1XFx1REQwRlwiLFwibGZyXCI6XCJcXHVEODM1XFx1REQyOVwiLFwibGdcIjpcIlxcdTIyNzZcIixcImxnRVwiOlwiXFx1MkE5MVwiLFwibEhhclwiOlwiXFx1Mjk2MlwiLFwibGhhcmRcIjpcIlxcdTIxQkRcIixcImxoYXJ1XCI6XCJcXHUyMUJDXCIsXCJsaGFydWxcIjpcIlxcdTI5NkFcIixcImxoYmxrXCI6XCJcXHUyNTg0XCIsXCJMSmN5XCI6XCJcXHUwNDA5XCIsXCJsamN5XCI6XCJcXHUwNDU5XCIsXCJsbGFyclwiOlwiXFx1MjFDN1wiLFwibGxcIjpcIlxcdTIyNkFcIixcIkxsXCI6XCJcXHUyMkQ4XCIsXCJsbGNvcm5lclwiOlwiXFx1MjMxRVwiLFwiTGxlZnRhcnJvd1wiOlwiXFx1MjFEQVwiLFwibGxoYXJkXCI6XCJcXHUyOTZCXCIsXCJsbHRyaVwiOlwiXFx1MjVGQVwiLFwiTG1pZG90XCI6XCJcXHUwMTNGXCIsXCJsbWlkb3RcIjpcIlxcdTAxNDBcIixcImxtb3VzdGFjaGVcIjpcIlxcdTIzQjBcIixcImxtb3VzdFwiOlwiXFx1MjNCMFwiLFwibG5hcFwiOlwiXFx1MkE4OVwiLFwibG5hcHByb3hcIjpcIlxcdTJBODlcIixcImxuZVwiOlwiXFx1MkE4N1wiLFwibG5FXCI6XCJcXHUyMjY4XCIsXCJsbmVxXCI6XCJcXHUyQTg3XCIsXCJsbmVxcVwiOlwiXFx1MjI2OFwiLFwibG5zaW1cIjpcIlxcdTIyRTZcIixcImxvYW5nXCI6XCJcXHUyN0VDXCIsXCJsb2FyclwiOlwiXFx1MjFGRFwiLFwibG9icmtcIjpcIlxcdTI3RTZcIixcImxvbmdsZWZ0YXJyb3dcIjpcIlxcdTI3RjVcIixcIkxvbmdMZWZ0QXJyb3dcIjpcIlxcdTI3RjVcIixcIkxvbmdsZWZ0YXJyb3dcIjpcIlxcdTI3RjhcIixcImxvbmdsZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjdGN1wiLFwiTG9uZ0xlZnRSaWdodEFycm93XCI6XCJcXHUyN0Y3XCIsXCJMb25nbGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTI3RkFcIixcImxvbmdtYXBzdG9cIjpcIlxcdTI3RkNcIixcImxvbmdyaWdodGFycm93XCI6XCJcXHUyN0Y2XCIsXCJMb25nUmlnaHRBcnJvd1wiOlwiXFx1MjdGNlwiLFwiTG9uZ3JpZ2h0YXJyb3dcIjpcIlxcdTI3RjlcIixcImxvb3BhcnJvd2xlZnRcIjpcIlxcdTIxQUJcIixcImxvb3BhcnJvd3JpZ2h0XCI6XCJcXHUyMUFDXCIsXCJsb3BhclwiOlwiXFx1Mjk4NVwiLFwiTG9wZlwiOlwiXFx1RDgzNVxcdURENDNcIixcImxvcGZcIjpcIlxcdUQ4MzVcXHVERDVEXCIsXCJsb3BsdXNcIjpcIlxcdTJBMkRcIixcImxvdGltZXNcIjpcIlxcdTJBMzRcIixcImxvd2FzdFwiOlwiXFx1MjIxN1wiLFwibG93YmFyXCI6XCJfXCIsXCJMb3dlckxlZnRBcnJvd1wiOlwiXFx1MjE5OVwiLFwiTG93ZXJSaWdodEFycm93XCI6XCJcXHUyMTk4XCIsXCJsb3pcIjpcIlxcdTI1Q0FcIixcImxvemVuZ2VcIjpcIlxcdTI1Q0FcIixcImxvemZcIjpcIlxcdTI5RUJcIixcImxwYXJcIjpcIihcIixcImxwYXJsdFwiOlwiXFx1Mjk5M1wiLFwibHJhcnJcIjpcIlxcdTIxQzZcIixcImxyY29ybmVyXCI6XCJcXHUyMzFGXCIsXCJscmhhclwiOlwiXFx1MjFDQlwiLFwibHJoYXJkXCI6XCJcXHUyOTZEXCIsXCJscm1cIjpcIlxcdTIwMEVcIixcImxydHJpXCI6XCJcXHUyMkJGXCIsXCJsc2FxdW9cIjpcIlxcdTIwMzlcIixcImxzY3JcIjpcIlxcdUQ4MzVcXHVEQ0MxXCIsXCJMc2NyXCI6XCJcXHUyMTEyXCIsXCJsc2hcIjpcIlxcdTIxQjBcIixcIkxzaFwiOlwiXFx1MjFCMFwiLFwibHNpbVwiOlwiXFx1MjI3MlwiLFwibHNpbWVcIjpcIlxcdTJBOERcIixcImxzaW1nXCI6XCJcXHUyQThGXCIsXCJsc3FiXCI6XCJbXCIsXCJsc3F1b1wiOlwiXFx1MjAxOFwiLFwibHNxdW9yXCI6XCJcXHUyMDFBXCIsXCJMc3Ryb2tcIjpcIlxcdTAxNDFcIixcImxzdHJva1wiOlwiXFx1MDE0MlwiLFwibHRjY1wiOlwiXFx1MkFBNlwiLFwibHRjaXJcIjpcIlxcdTJBNzlcIixcImx0XCI6XCI8XCIsXCJMVFwiOlwiPFwiLFwiTHRcIjpcIlxcdTIyNkFcIixcImx0ZG90XCI6XCJcXHUyMkQ2XCIsXCJsdGhyZWVcIjpcIlxcdTIyQ0JcIixcImx0aW1lc1wiOlwiXFx1MjJDOVwiLFwibHRsYXJyXCI6XCJcXHUyOTc2XCIsXCJsdHF1ZXN0XCI6XCJcXHUyQTdCXCIsXCJsdHJpXCI6XCJcXHUyNUMzXCIsXCJsdHJpZVwiOlwiXFx1MjJCNFwiLFwibHRyaWZcIjpcIlxcdTI1QzJcIixcImx0clBhclwiOlwiXFx1Mjk5NlwiLFwibHVyZHNoYXJcIjpcIlxcdTI5NEFcIixcImx1cnVoYXJcIjpcIlxcdTI5NjZcIixcImx2ZXJ0bmVxcVwiOlwiXFx1MjI2OFxcdUZFMDBcIixcImx2bkVcIjpcIlxcdTIyNjhcXHVGRTAwXCIsXCJtYWNyXCI6XCJcXHUwMEFGXCIsXCJtYWxlXCI6XCJcXHUyNjQyXCIsXCJtYWx0XCI6XCJcXHUyNzIwXCIsXCJtYWx0ZXNlXCI6XCJcXHUyNzIwXCIsXCJNYXBcIjpcIlxcdTI5MDVcIixcIm1hcFwiOlwiXFx1MjFBNlwiLFwibWFwc3RvXCI6XCJcXHUyMUE2XCIsXCJtYXBzdG9kb3duXCI6XCJcXHUyMUE3XCIsXCJtYXBzdG9sZWZ0XCI6XCJcXHUyMUE0XCIsXCJtYXBzdG91cFwiOlwiXFx1MjFBNVwiLFwibWFya2VyXCI6XCJcXHUyNUFFXCIsXCJtY29tbWFcIjpcIlxcdTJBMjlcIixcIk1jeVwiOlwiXFx1MDQxQ1wiLFwibWN5XCI6XCJcXHUwNDNDXCIsXCJtZGFzaFwiOlwiXFx1MjAxNFwiLFwibUREb3RcIjpcIlxcdTIyM0FcIixcIm1lYXN1cmVkYW5nbGVcIjpcIlxcdTIyMjFcIixcIk1lZGl1bVNwYWNlXCI6XCJcXHUyMDVGXCIsXCJNZWxsaW50cmZcIjpcIlxcdTIxMzNcIixcIk1mclwiOlwiXFx1RDgzNVxcdUREMTBcIixcIm1mclwiOlwiXFx1RDgzNVxcdUREMkFcIixcIm1ob1wiOlwiXFx1MjEyN1wiLFwibWljcm9cIjpcIlxcdTAwQjVcIixcIm1pZGFzdFwiOlwiKlwiLFwibWlkY2lyXCI6XCJcXHUyQUYwXCIsXCJtaWRcIjpcIlxcdTIyMjNcIixcIm1pZGRvdFwiOlwiXFx1MDBCN1wiLFwibWludXNiXCI6XCJcXHUyMjlGXCIsXCJtaW51c1wiOlwiXFx1MjIxMlwiLFwibWludXNkXCI6XCJcXHUyMjM4XCIsXCJtaW51c2R1XCI6XCJcXHUyQTJBXCIsXCJNaW51c1BsdXNcIjpcIlxcdTIyMTNcIixcIm1sY3BcIjpcIlxcdTJBREJcIixcIm1sZHJcIjpcIlxcdTIwMjZcIixcIm1ucGx1c1wiOlwiXFx1MjIxM1wiLFwibW9kZWxzXCI6XCJcXHUyMkE3XCIsXCJNb3BmXCI6XCJcXHVEODM1XFx1REQ0NFwiLFwibW9wZlwiOlwiXFx1RDgzNVxcdURENUVcIixcIm1wXCI6XCJcXHUyMjEzXCIsXCJtc2NyXCI6XCJcXHVEODM1XFx1RENDMlwiLFwiTXNjclwiOlwiXFx1MjEzM1wiLFwibXN0cG9zXCI6XCJcXHUyMjNFXCIsXCJNdVwiOlwiXFx1MDM5Q1wiLFwibXVcIjpcIlxcdTAzQkNcIixcIm11bHRpbWFwXCI6XCJcXHUyMkI4XCIsXCJtdW1hcFwiOlwiXFx1MjJCOFwiLFwibmFibGFcIjpcIlxcdTIyMDdcIixcIk5hY3V0ZVwiOlwiXFx1MDE0M1wiLFwibmFjdXRlXCI6XCJcXHUwMTQ0XCIsXCJuYW5nXCI6XCJcXHUyMjIwXFx1MjBEMlwiLFwibmFwXCI6XCJcXHUyMjQ5XCIsXCJuYXBFXCI6XCJcXHUyQTcwXFx1MDMzOFwiLFwibmFwaWRcIjpcIlxcdTIyNEJcXHUwMzM4XCIsXCJuYXBvc1wiOlwiXFx1MDE0OVwiLFwibmFwcHJveFwiOlwiXFx1MjI0OVwiLFwibmF0dXJhbFwiOlwiXFx1MjY2RVwiLFwibmF0dXJhbHNcIjpcIlxcdTIxMTVcIixcIm5hdHVyXCI6XCJcXHUyNjZFXCIsXCJuYnNwXCI6XCJcXHUwMEEwXCIsXCJuYnVtcFwiOlwiXFx1MjI0RVxcdTAzMzhcIixcIm5idW1wZVwiOlwiXFx1MjI0RlxcdTAzMzhcIixcIm5jYXBcIjpcIlxcdTJBNDNcIixcIk5jYXJvblwiOlwiXFx1MDE0N1wiLFwibmNhcm9uXCI6XCJcXHUwMTQ4XCIsXCJOY2VkaWxcIjpcIlxcdTAxNDVcIixcIm5jZWRpbFwiOlwiXFx1MDE0NlwiLFwibmNvbmdcIjpcIlxcdTIyNDdcIixcIm5jb25nZG90XCI6XCJcXHUyQTZEXFx1MDMzOFwiLFwibmN1cFwiOlwiXFx1MkE0MlwiLFwiTmN5XCI6XCJcXHUwNDFEXCIsXCJuY3lcIjpcIlxcdTA0M0RcIixcIm5kYXNoXCI6XCJcXHUyMDEzXCIsXCJuZWFyaGtcIjpcIlxcdTI5MjRcIixcIm5lYXJyXCI6XCJcXHUyMTk3XCIsXCJuZUFyclwiOlwiXFx1MjFEN1wiLFwibmVhcnJvd1wiOlwiXFx1MjE5N1wiLFwibmVcIjpcIlxcdTIyNjBcIixcIm5lZG90XCI6XCJcXHUyMjUwXFx1MDMzOFwiLFwiTmVnYXRpdmVNZWRpdW1TcGFjZVwiOlwiXFx1MjAwQlwiLFwiTmVnYXRpdmVUaGlja1NwYWNlXCI6XCJcXHUyMDBCXCIsXCJOZWdhdGl2ZVRoaW5TcGFjZVwiOlwiXFx1MjAwQlwiLFwiTmVnYXRpdmVWZXJ5VGhpblNwYWNlXCI6XCJcXHUyMDBCXCIsXCJuZXF1aXZcIjpcIlxcdTIyNjJcIixcIm5lc2VhclwiOlwiXFx1MjkyOFwiLFwibmVzaW1cIjpcIlxcdTIyNDJcXHUwMzM4XCIsXCJOZXN0ZWRHcmVhdGVyR3JlYXRlclwiOlwiXFx1MjI2QlwiLFwiTmVzdGVkTGVzc0xlc3NcIjpcIlxcdTIyNkFcIixcIk5ld0xpbmVcIjpcIlxcblwiLFwibmV4aXN0XCI6XCJcXHUyMjA0XCIsXCJuZXhpc3RzXCI6XCJcXHUyMjA0XCIsXCJOZnJcIjpcIlxcdUQ4MzVcXHVERDExXCIsXCJuZnJcIjpcIlxcdUQ4MzVcXHVERDJCXCIsXCJuZ0VcIjpcIlxcdTIyNjdcXHUwMzM4XCIsXCJuZ2VcIjpcIlxcdTIyNzFcIixcIm5nZXFcIjpcIlxcdTIyNzFcIixcIm5nZXFxXCI6XCJcXHUyMjY3XFx1MDMzOFwiLFwibmdlcXNsYW50XCI6XCJcXHUyQTdFXFx1MDMzOFwiLFwibmdlc1wiOlwiXFx1MkE3RVxcdTAzMzhcIixcIm5HZ1wiOlwiXFx1MjJEOVxcdTAzMzhcIixcIm5nc2ltXCI6XCJcXHUyMjc1XCIsXCJuR3RcIjpcIlxcdTIyNkJcXHUyMEQyXCIsXCJuZ3RcIjpcIlxcdTIyNkZcIixcIm5ndHJcIjpcIlxcdTIyNkZcIixcIm5HdHZcIjpcIlxcdTIyNkJcXHUwMzM4XCIsXCJuaGFyclwiOlwiXFx1MjFBRVwiLFwibmhBcnJcIjpcIlxcdTIxQ0VcIixcIm5ocGFyXCI6XCJcXHUyQUYyXCIsXCJuaVwiOlwiXFx1MjIwQlwiLFwibmlzXCI6XCJcXHUyMkZDXCIsXCJuaXNkXCI6XCJcXHUyMkZBXCIsXCJuaXZcIjpcIlxcdTIyMEJcIixcIk5KY3lcIjpcIlxcdTA0MEFcIixcIm5qY3lcIjpcIlxcdTA0NUFcIixcIm5sYXJyXCI6XCJcXHUyMTlBXCIsXCJubEFyclwiOlwiXFx1MjFDRFwiLFwibmxkclwiOlwiXFx1MjAyNVwiLFwibmxFXCI6XCJcXHUyMjY2XFx1MDMzOFwiLFwibmxlXCI6XCJcXHUyMjcwXCIsXCJubGVmdGFycm93XCI6XCJcXHUyMTlBXCIsXCJuTGVmdGFycm93XCI6XCJcXHUyMUNEXCIsXCJubGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTIxQUVcIixcIm5MZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjFDRVwiLFwibmxlcVwiOlwiXFx1MjI3MFwiLFwibmxlcXFcIjpcIlxcdTIyNjZcXHUwMzM4XCIsXCJubGVxc2xhbnRcIjpcIlxcdTJBN0RcXHUwMzM4XCIsXCJubGVzXCI6XCJcXHUyQTdEXFx1MDMzOFwiLFwibmxlc3NcIjpcIlxcdTIyNkVcIixcIm5MbFwiOlwiXFx1MjJEOFxcdTAzMzhcIixcIm5sc2ltXCI6XCJcXHUyMjc0XCIsXCJuTHRcIjpcIlxcdTIyNkFcXHUyMEQyXCIsXCJubHRcIjpcIlxcdTIyNkVcIixcIm5sdHJpXCI6XCJcXHUyMkVBXCIsXCJubHRyaWVcIjpcIlxcdTIyRUNcIixcIm5MdHZcIjpcIlxcdTIyNkFcXHUwMzM4XCIsXCJubWlkXCI6XCJcXHUyMjI0XCIsXCJOb0JyZWFrXCI6XCJcXHUyMDYwXCIsXCJOb25CcmVha2luZ1NwYWNlXCI6XCJcXHUwMEEwXCIsXCJub3BmXCI6XCJcXHVEODM1XFx1REQ1RlwiLFwiTm9wZlwiOlwiXFx1MjExNVwiLFwiTm90XCI6XCJcXHUyQUVDXCIsXCJub3RcIjpcIlxcdTAwQUNcIixcIk5vdENvbmdydWVudFwiOlwiXFx1MjI2MlwiLFwiTm90Q3VwQ2FwXCI6XCJcXHUyMjZEXCIsXCJOb3REb3VibGVWZXJ0aWNhbEJhclwiOlwiXFx1MjIyNlwiLFwiTm90RWxlbWVudFwiOlwiXFx1MjIwOVwiLFwiTm90RXF1YWxcIjpcIlxcdTIyNjBcIixcIk5vdEVxdWFsVGlsZGVcIjpcIlxcdTIyNDJcXHUwMzM4XCIsXCJOb3RFeGlzdHNcIjpcIlxcdTIyMDRcIixcIk5vdEdyZWF0ZXJcIjpcIlxcdTIyNkZcIixcIk5vdEdyZWF0ZXJFcXVhbFwiOlwiXFx1MjI3MVwiLFwiTm90R3JlYXRlckZ1bGxFcXVhbFwiOlwiXFx1MjI2N1xcdTAzMzhcIixcIk5vdEdyZWF0ZXJHcmVhdGVyXCI6XCJcXHUyMjZCXFx1MDMzOFwiLFwiTm90R3JlYXRlckxlc3NcIjpcIlxcdTIyNzlcIixcIk5vdEdyZWF0ZXJTbGFudEVxdWFsXCI6XCJcXHUyQTdFXFx1MDMzOFwiLFwiTm90R3JlYXRlclRpbGRlXCI6XCJcXHUyMjc1XCIsXCJOb3RIdW1wRG93bkh1bXBcIjpcIlxcdTIyNEVcXHUwMzM4XCIsXCJOb3RIdW1wRXF1YWxcIjpcIlxcdTIyNEZcXHUwMzM4XCIsXCJub3RpblwiOlwiXFx1MjIwOVwiLFwibm90aW5kb3RcIjpcIlxcdTIyRjVcXHUwMzM4XCIsXCJub3RpbkVcIjpcIlxcdTIyRjlcXHUwMzM4XCIsXCJub3RpbnZhXCI6XCJcXHUyMjA5XCIsXCJub3RpbnZiXCI6XCJcXHUyMkY3XCIsXCJub3RpbnZjXCI6XCJcXHUyMkY2XCIsXCJOb3RMZWZ0VHJpYW5nbGVCYXJcIjpcIlxcdTI5Q0ZcXHUwMzM4XCIsXCJOb3RMZWZ0VHJpYW5nbGVcIjpcIlxcdTIyRUFcIixcIk5vdExlZnRUcmlhbmdsZUVxdWFsXCI6XCJcXHUyMkVDXCIsXCJOb3RMZXNzXCI6XCJcXHUyMjZFXCIsXCJOb3RMZXNzRXF1YWxcIjpcIlxcdTIyNzBcIixcIk5vdExlc3NHcmVhdGVyXCI6XCJcXHUyMjc4XCIsXCJOb3RMZXNzTGVzc1wiOlwiXFx1MjI2QVxcdTAzMzhcIixcIk5vdExlc3NTbGFudEVxdWFsXCI6XCJcXHUyQTdEXFx1MDMzOFwiLFwiTm90TGVzc1RpbGRlXCI6XCJcXHUyMjc0XCIsXCJOb3ROZXN0ZWRHcmVhdGVyR3JlYXRlclwiOlwiXFx1MkFBMlxcdTAzMzhcIixcIk5vdE5lc3RlZExlc3NMZXNzXCI6XCJcXHUyQUExXFx1MDMzOFwiLFwibm90bmlcIjpcIlxcdTIyMENcIixcIm5vdG5pdmFcIjpcIlxcdTIyMENcIixcIm5vdG5pdmJcIjpcIlxcdTIyRkVcIixcIm5vdG5pdmNcIjpcIlxcdTIyRkRcIixcIk5vdFByZWNlZGVzXCI6XCJcXHUyMjgwXCIsXCJOb3RQcmVjZWRlc0VxdWFsXCI6XCJcXHUyQUFGXFx1MDMzOFwiLFwiTm90UHJlY2VkZXNTbGFudEVxdWFsXCI6XCJcXHUyMkUwXCIsXCJOb3RSZXZlcnNlRWxlbWVudFwiOlwiXFx1MjIwQ1wiLFwiTm90UmlnaHRUcmlhbmdsZUJhclwiOlwiXFx1MjlEMFxcdTAzMzhcIixcIk5vdFJpZ2h0VHJpYW5nbGVcIjpcIlxcdTIyRUJcIixcIk5vdFJpZ2h0VHJpYW5nbGVFcXVhbFwiOlwiXFx1MjJFRFwiLFwiTm90U3F1YXJlU3Vic2V0XCI6XCJcXHUyMjhGXFx1MDMzOFwiLFwiTm90U3F1YXJlU3Vic2V0RXF1YWxcIjpcIlxcdTIyRTJcIixcIk5vdFNxdWFyZVN1cGVyc2V0XCI6XCJcXHUyMjkwXFx1MDMzOFwiLFwiTm90U3F1YXJlU3VwZXJzZXRFcXVhbFwiOlwiXFx1MjJFM1wiLFwiTm90U3Vic2V0XCI6XCJcXHUyMjgyXFx1MjBEMlwiLFwiTm90U3Vic2V0RXF1YWxcIjpcIlxcdTIyODhcIixcIk5vdFN1Y2NlZWRzXCI6XCJcXHUyMjgxXCIsXCJOb3RTdWNjZWVkc0VxdWFsXCI6XCJcXHUyQUIwXFx1MDMzOFwiLFwiTm90U3VjY2VlZHNTbGFudEVxdWFsXCI6XCJcXHUyMkUxXCIsXCJOb3RTdWNjZWVkc1RpbGRlXCI6XCJcXHUyMjdGXFx1MDMzOFwiLFwiTm90U3VwZXJzZXRcIjpcIlxcdTIyODNcXHUyMEQyXCIsXCJOb3RTdXBlcnNldEVxdWFsXCI6XCJcXHUyMjg5XCIsXCJOb3RUaWxkZVwiOlwiXFx1MjI0MVwiLFwiTm90VGlsZGVFcXVhbFwiOlwiXFx1MjI0NFwiLFwiTm90VGlsZGVGdWxsRXF1YWxcIjpcIlxcdTIyNDdcIixcIk5vdFRpbGRlVGlsZGVcIjpcIlxcdTIyNDlcIixcIk5vdFZlcnRpY2FsQmFyXCI6XCJcXHUyMjI0XCIsXCJucGFyYWxsZWxcIjpcIlxcdTIyMjZcIixcIm5wYXJcIjpcIlxcdTIyMjZcIixcIm5wYXJzbFwiOlwiXFx1MkFGRFxcdTIwRTVcIixcIm5wYXJ0XCI6XCJcXHUyMjAyXFx1MDMzOFwiLFwibnBvbGludFwiOlwiXFx1MkExNFwiLFwibnByXCI6XCJcXHUyMjgwXCIsXCJucHJjdWVcIjpcIlxcdTIyRTBcIixcIm5wcmVjXCI6XCJcXHUyMjgwXCIsXCJucHJlY2VxXCI6XCJcXHUyQUFGXFx1MDMzOFwiLFwibnByZVwiOlwiXFx1MkFBRlxcdTAzMzhcIixcIm5yYXJyY1wiOlwiXFx1MjkzM1xcdTAzMzhcIixcIm5yYXJyXCI6XCJcXHUyMTlCXCIsXCJuckFyclwiOlwiXFx1MjFDRlwiLFwibnJhcnJ3XCI6XCJcXHUyMTlEXFx1MDMzOFwiLFwibnJpZ2h0YXJyb3dcIjpcIlxcdTIxOUJcIixcIm5SaWdodGFycm93XCI6XCJcXHUyMUNGXCIsXCJucnRyaVwiOlwiXFx1MjJFQlwiLFwibnJ0cmllXCI6XCJcXHUyMkVEXCIsXCJuc2NcIjpcIlxcdTIyODFcIixcIm5zY2N1ZVwiOlwiXFx1MjJFMVwiLFwibnNjZVwiOlwiXFx1MkFCMFxcdTAzMzhcIixcIk5zY3JcIjpcIlxcdUQ4MzVcXHVEQ0E5XCIsXCJuc2NyXCI6XCJcXHVEODM1XFx1RENDM1wiLFwibnNob3J0bWlkXCI6XCJcXHUyMjI0XCIsXCJuc2hvcnRwYXJhbGxlbFwiOlwiXFx1MjIyNlwiLFwibnNpbVwiOlwiXFx1MjI0MVwiLFwibnNpbWVcIjpcIlxcdTIyNDRcIixcIm5zaW1lcVwiOlwiXFx1MjI0NFwiLFwibnNtaWRcIjpcIlxcdTIyMjRcIixcIm5zcGFyXCI6XCJcXHUyMjI2XCIsXCJuc3FzdWJlXCI6XCJcXHUyMkUyXCIsXCJuc3FzdXBlXCI6XCJcXHUyMkUzXCIsXCJuc3ViXCI6XCJcXHUyMjg0XCIsXCJuc3ViRVwiOlwiXFx1MkFDNVxcdTAzMzhcIixcIm5zdWJlXCI6XCJcXHUyMjg4XCIsXCJuc3Vic2V0XCI6XCJcXHUyMjgyXFx1MjBEMlwiLFwibnN1YnNldGVxXCI6XCJcXHUyMjg4XCIsXCJuc3Vic2V0ZXFxXCI6XCJcXHUyQUM1XFx1MDMzOFwiLFwibnN1Y2NcIjpcIlxcdTIyODFcIixcIm5zdWNjZXFcIjpcIlxcdTJBQjBcXHUwMzM4XCIsXCJuc3VwXCI6XCJcXHUyMjg1XCIsXCJuc3VwRVwiOlwiXFx1MkFDNlxcdTAzMzhcIixcIm5zdXBlXCI6XCJcXHUyMjg5XCIsXCJuc3Vwc2V0XCI6XCJcXHUyMjgzXFx1MjBEMlwiLFwibnN1cHNldGVxXCI6XCJcXHUyMjg5XCIsXCJuc3Vwc2V0ZXFxXCI6XCJcXHUyQUM2XFx1MDMzOFwiLFwibnRnbFwiOlwiXFx1MjI3OVwiLFwiTnRpbGRlXCI6XCJcXHUwMEQxXCIsXCJudGlsZGVcIjpcIlxcdTAwRjFcIixcIm50bGdcIjpcIlxcdTIyNzhcIixcIm50cmlhbmdsZWxlZnRcIjpcIlxcdTIyRUFcIixcIm50cmlhbmdsZWxlZnRlcVwiOlwiXFx1MjJFQ1wiLFwibnRyaWFuZ2xlcmlnaHRcIjpcIlxcdTIyRUJcIixcIm50cmlhbmdsZXJpZ2h0ZXFcIjpcIlxcdTIyRURcIixcIk51XCI6XCJcXHUwMzlEXCIsXCJudVwiOlwiXFx1MDNCRFwiLFwibnVtXCI6XCIjXCIsXCJudW1lcm9cIjpcIlxcdTIxMTZcIixcIm51bXNwXCI6XCJcXHUyMDA3XCIsXCJudmFwXCI6XCJcXHUyMjREXFx1MjBEMlwiLFwibnZkYXNoXCI6XCJcXHUyMkFDXCIsXCJudkRhc2hcIjpcIlxcdTIyQURcIixcIm5WZGFzaFwiOlwiXFx1MjJBRVwiLFwiblZEYXNoXCI6XCJcXHUyMkFGXCIsXCJudmdlXCI6XCJcXHUyMjY1XFx1MjBEMlwiLFwibnZndFwiOlwiPlxcdTIwRDJcIixcIm52SGFyclwiOlwiXFx1MjkwNFwiLFwibnZpbmZpblwiOlwiXFx1MjlERVwiLFwibnZsQXJyXCI6XCJcXHUyOTAyXCIsXCJudmxlXCI6XCJcXHUyMjY0XFx1MjBEMlwiLFwibnZsdFwiOlwiPFxcdTIwRDJcIixcIm52bHRyaWVcIjpcIlxcdTIyQjRcXHUyMEQyXCIsXCJudnJBcnJcIjpcIlxcdTI5MDNcIixcIm52cnRyaWVcIjpcIlxcdTIyQjVcXHUyMEQyXCIsXCJudnNpbVwiOlwiXFx1MjIzQ1xcdTIwRDJcIixcIm53YXJoa1wiOlwiXFx1MjkyM1wiLFwibndhcnJcIjpcIlxcdTIxOTZcIixcIm53QXJyXCI6XCJcXHUyMUQ2XCIsXCJud2Fycm93XCI6XCJcXHUyMTk2XCIsXCJud25lYXJcIjpcIlxcdTI5MjdcIixcIk9hY3V0ZVwiOlwiXFx1MDBEM1wiLFwib2FjdXRlXCI6XCJcXHUwMEYzXCIsXCJvYXN0XCI6XCJcXHUyMjlCXCIsXCJPY2lyY1wiOlwiXFx1MDBENFwiLFwib2NpcmNcIjpcIlxcdTAwRjRcIixcIm9jaXJcIjpcIlxcdTIyOUFcIixcIk9jeVwiOlwiXFx1MDQxRVwiLFwib2N5XCI6XCJcXHUwNDNFXCIsXCJvZGFzaFwiOlwiXFx1MjI5RFwiLFwiT2RibGFjXCI6XCJcXHUwMTUwXCIsXCJvZGJsYWNcIjpcIlxcdTAxNTFcIixcIm9kaXZcIjpcIlxcdTJBMzhcIixcIm9kb3RcIjpcIlxcdTIyOTlcIixcIm9kc29sZFwiOlwiXFx1MjlCQ1wiLFwiT0VsaWdcIjpcIlxcdTAxNTJcIixcIm9lbGlnXCI6XCJcXHUwMTUzXCIsXCJvZmNpclwiOlwiXFx1MjlCRlwiLFwiT2ZyXCI6XCJcXHVEODM1XFx1REQxMlwiLFwib2ZyXCI6XCJcXHVEODM1XFx1REQyQ1wiLFwib2dvblwiOlwiXFx1MDJEQlwiLFwiT2dyYXZlXCI6XCJcXHUwMEQyXCIsXCJvZ3JhdmVcIjpcIlxcdTAwRjJcIixcIm9ndFwiOlwiXFx1MjlDMVwiLFwib2hiYXJcIjpcIlxcdTI5QjVcIixcIm9obVwiOlwiXFx1MDNBOVwiLFwib2ludFwiOlwiXFx1MjIyRVwiLFwib2xhcnJcIjpcIlxcdTIxQkFcIixcIm9sY2lyXCI6XCJcXHUyOUJFXCIsXCJvbGNyb3NzXCI6XCJcXHUyOUJCXCIsXCJvbGluZVwiOlwiXFx1MjAzRVwiLFwib2x0XCI6XCJcXHUyOUMwXCIsXCJPbWFjclwiOlwiXFx1MDE0Q1wiLFwib21hY3JcIjpcIlxcdTAxNERcIixcIk9tZWdhXCI6XCJcXHUwM0E5XCIsXCJvbWVnYVwiOlwiXFx1MDNDOVwiLFwiT21pY3JvblwiOlwiXFx1MDM5RlwiLFwib21pY3JvblwiOlwiXFx1MDNCRlwiLFwib21pZFwiOlwiXFx1MjlCNlwiLFwib21pbnVzXCI6XCJcXHUyMjk2XCIsXCJPb3BmXCI6XCJcXHVEODM1XFx1REQ0NlwiLFwib29wZlwiOlwiXFx1RDgzNVxcdURENjBcIixcIm9wYXJcIjpcIlxcdTI5QjdcIixcIk9wZW5DdXJseURvdWJsZVF1b3RlXCI6XCJcXHUyMDFDXCIsXCJPcGVuQ3VybHlRdW90ZVwiOlwiXFx1MjAxOFwiLFwib3BlcnBcIjpcIlxcdTI5QjlcIixcIm9wbHVzXCI6XCJcXHUyMjk1XCIsXCJvcmFyclwiOlwiXFx1MjFCQlwiLFwiT3JcIjpcIlxcdTJBNTRcIixcIm9yXCI6XCJcXHUyMjI4XCIsXCJvcmRcIjpcIlxcdTJBNURcIixcIm9yZGVyXCI6XCJcXHUyMTM0XCIsXCJvcmRlcm9mXCI6XCJcXHUyMTM0XCIsXCJvcmRmXCI6XCJcXHUwMEFBXCIsXCJvcmRtXCI6XCJcXHUwMEJBXCIsXCJvcmlnb2ZcIjpcIlxcdTIyQjZcIixcIm9yb3JcIjpcIlxcdTJBNTZcIixcIm9yc2xvcGVcIjpcIlxcdTJBNTdcIixcIm9ydlwiOlwiXFx1MkE1QlwiLFwib1NcIjpcIlxcdTI0QzhcIixcIk9zY3JcIjpcIlxcdUQ4MzVcXHVEQ0FBXCIsXCJvc2NyXCI6XCJcXHUyMTM0XCIsXCJPc2xhc2hcIjpcIlxcdTAwRDhcIixcIm9zbGFzaFwiOlwiXFx1MDBGOFwiLFwib3NvbFwiOlwiXFx1MjI5OFwiLFwiT3RpbGRlXCI6XCJcXHUwMEQ1XCIsXCJvdGlsZGVcIjpcIlxcdTAwRjVcIixcIm90aW1lc2FzXCI6XCJcXHUyQTM2XCIsXCJPdGltZXNcIjpcIlxcdTJBMzdcIixcIm90aW1lc1wiOlwiXFx1MjI5N1wiLFwiT3VtbFwiOlwiXFx1MDBENlwiLFwib3VtbFwiOlwiXFx1MDBGNlwiLFwib3ZiYXJcIjpcIlxcdTIzM0RcIixcIk92ZXJCYXJcIjpcIlxcdTIwM0VcIixcIk92ZXJCcmFjZVwiOlwiXFx1MjNERVwiLFwiT3ZlckJyYWNrZXRcIjpcIlxcdTIzQjRcIixcIk92ZXJQYXJlbnRoZXNpc1wiOlwiXFx1MjNEQ1wiLFwicGFyYVwiOlwiXFx1MDBCNlwiLFwicGFyYWxsZWxcIjpcIlxcdTIyMjVcIixcInBhclwiOlwiXFx1MjIyNVwiLFwicGFyc2ltXCI6XCJcXHUyQUYzXCIsXCJwYXJzbFwiOlwiXFx1MkFGRFwiLFwicGFydFwiOlwiXFx1MjIwMlwiLFwiUGFydGlhbERcIjpcIlxcdTIyMDJcIixcIlBjeVwiOlwiXFx1MDQxRlwiLFwicGN5XCI6XCJcXHUwNDNGXCIsXCJwZXJjbnRcIjpcIiVcIixcInBlcmlvZFwiOlwiLlwiLFwicGVybWlsXCI6XCJcXHUyMDMwXCIsXCJwZXJwXCI6XCJcXHUyMkE1XCIsXCJwZXJ0ZW5rXCI6XCJcXHUyMDMxXCIsXCJQZnJcIjpcIlxcdUQ4MzVcXHVERDEzXCIsXCJwZnJcIjpcIlxcdUQ4MzVcXHVERDJEXCIsXCJQaGlcIjpcIlxcdTAzQTZcIixcInBoaVwiOlwiXFx1MDNDNlwiLFwicGhpdlwiOlwiXFx1MDNENVwiLFwicGhtbWF0XCI6XCJcXHUyMTMzXCIsXCJwaG9uZVwiOlwiXFx1MjYwRVwiLFwiUGlcIjpcIlxcdTAzQTBcIixcInBpXCI6XCJcXHUwM0MwXCIsXCJwaXRjaGZvcmtcIjpcIlxcdTIyRDRcIixcInBpdlwiOlwiXFx1MDNENlwiLFwicGxhbmNrXCI6XCJcXHUyMTBGXCIsXCJwbGFuY2toXCI6XCJcXHUyMTBFXCIsXCJwbGFua3ZcIjpcIlxcdTIxMEZcIixcInBsdXNhY2lyXCI6XCJcXHUyQTIzXCIsXCJwbHVzYlwiOlwiXFx1MjI5RVwiLFwicGx1c2NpclwiOlwiXFx1MkEyMlwiLFwicGx1c1wiOlwiK1wiLFwicGx1c2RvXCI6XCJcXHUyMjE0XCIsXCJwbHVzZHVcIjpcIlxcdTJBMjVcIixcInBsdXNlXCI6XCJcXHUyQTcyXCIsXCJQbHVzTWludXNcIjpcIlxcdTAwQjFcIixcInBsdXNtblwiOlwiXFx1MDBCMVwiLFwicGx1c3NpbVwiOlwiXFx1MkEyNlwiLFwicGx1c3R3b1wiOlwiXFx1MkEyN1wiLFwicG1cIjpcIlxcdTAwQjFcIixcIlBvaW5jYXJlcGxhbmVcIjpcIlxcdTIxMENcIixcInBvaW50aW50XCI6XCJcXHUyQTE1XCIsXCJwb3BmXCI6XCJcXHVEODM1XFx1REQ2MVwiLFwiUG9wZlwiOlwiXFx1MjExOVwiLFwicG91bmRcIjpcIlxcdTAwQTNcIixcInByYXBcIjpcIlxcdTJBQjdcIixcIlByXCI6XCJcXHUyQUJCXCIsXCJwclwiOlwiXFx1MjI3QVwiLFwicHJjdWVcIjpcIlxcdTIyN0NcIixcInByZWNhcHByb3hcIjpcIlxcdTJBQjdcIixcInByZWNcIjpcIlxcdTIyN0FcIixcInByZWNjdXJseWVxXCI6XCJcXHUyMjdDXCIsXCJQcmVjZWRlc1wiOlwiXFx1MjI3QVwiLFwiUHJlY2VkZXNFcXVhbFwiOlwiXFx1MkFBRlwiLFwiUHJlY2VkZXNTbGFudEVxdWFsXCI6XCJcXHUyMjdDXCIsXCJQcmVjZWRlc1RpbGRlXCI6XCJcXHUyMjdFXCIsXCJwcmVjZXFcIjpcIlxcdTJBQUZcIixcInByZWNuYXBwcm94XCI6XCJcXHUyQUI5XCIsXCJwcmVjbmVxcVwiOlwiXFx1MkFCNVwiLFwicHJlY25zaW1cIjpcIlxcdTIyRThcIixcInByZVwiOlwiXFx1MkFBRlwiLFwicHJFXCI6XCJcXHUyQUIzXCIsXCJwcmVjc2ltXCI6XCJcXHUyMjdFXCIsXCJwcmltZVwiOlwiXFx1MjAzMlwiLFwiUHJpbWVcIjpcIlxcdTIwMzNcIixcInByaW1lc1wiOlwiXFx1MjExOVwiLFwicHJuYXBcIjpcIlxcdTJBQjlcIixcInBybkVcIjpcIlxcdTJBQjVcIixcInBybnNpbVwiOlwiXFx1MjJFOFwiLFwicHJvZFwiOlwiXFx1MjIwRlwiLFwiUHJvZHVjdFwiOlwiXFx1MjIwRlwiLFwicHJvZmFsYXJcIjpcIlxcdTIzMkVcIixcInByb2ZsaW5lXCI6XCJcXHUyMzEyXCIsXCJwcm9mc3VyZlwiOlwiXFx1MjMxM1wiLFwicHJvcFwiOlwiXFx1MjIxRFwiLFwiUHJvcG9ydGlvbmFsXCI6XCJcXHUyMjFEXCIsXCJQcm9wb3J0aW9uXCI6XCJcXHUyMjM3XCIsXCJwcm9wdG9cIjpcIlxcdTIyMURcIixcInByc2ltXCI6XCJcXHUyMjdFXCIsXCJwcnVyZWxcIjpcIlxcdTIyQjBcIixcIlBzY3JcIjpcIlxcdUQ4MzVcXHVEQ0FCXCIsXCJwc2NyXCI6XCJcXHVEODM1XFx1RENDNVwiLFwiUHNpXCI6XCJcXHUwM0E4XCIsXCJwc2lcIjpcIlxcdTAzQzhcIixcInB1bmNzcFwiOlwiXFx1MjAwOFwiLFwiUWZyXCI6XCJcXHVEODM1XFx1REQxNFwiLFwicWZyXCI6XCJcXHVEODM1XFx1REQyRVwiLFwicWludFwiOlwiXFx1MkEwQ1wiLFwicW9wZlwiOlwiXFx1RDgzNVxcdURENjJcIixcIlFvcGZcIjpcIlxcdTIxMUFcIixcInFwcmltZVwiOlwiXFx1MjA1N1wiLFwiUXNjclwiOlwiXFx1RDgzNVxcdURDQUNcIixcInFzY3JcIjpcIlxcdUQ4MzVcXHVEQ0M2XCIsXCJxdWF0ZXJuaW9uc1wiOlwiXFx1MjEwRFwiLFwicXVhdGludFwiOlwiXFx1MkExNlwiLFwicXVlc3RcIjpcIj9cIixcInF1ZXN0ZXFcIjpcIlxcdTIyNUZcIixcInF1b3RcIjpcIlxcXCJcIixcIlFVT1RcIjpcIlxcXCJcIixcInJBYXJyXCI6XCJcXHUyMURCXCIsXCJyYWNlXCI6XCJcXHUyMjNEXFx1MDMzMVwiLFwiUmFjdXRlXCI6XCJcXHUwMTU0XCIsXCJyYWN1dGVcIjpcIlxcdTAxNTVcIixcInJhZGljXCI6XCJcXHUyMjFBXCIsXCJyYWVtcHR5dlwiOlwiXFx1MjlCM1wiLFwicmFuZ1wiOlwiXFx1MjdFOVwiLFwiUmFuZ1wiOlwiXFx1MjdFQlwiLFwicmFuZ2RcIjpcIlxcdTI5OTJcIixcInJhbmdlXCI6XCJcXHUyOUE1XCIsXCJyYW5nbGVcIjpcIlxcdTI3RTlcIixcInJhcXVvXCI6XCJcXHUwMEJCXCIsXCJyYXJyYXBcIjpcIlxcdTI5NzVcIixcInJhcnJiXCI6XCJcXHUyMUU1XCIsXCJyYXJyYmZzXCI6XCJcXHUyOTIwXCIsXCJyYXJyY1wiOlwiXFx1MjkzM1wiLFwicmFyclwiOlwiXFx1MjE5MlwiLFwiUmFyclwiOlwiXFx1MjFBMFwiLFwickFyclwiOlwiXFx1MjFEMlwiLFwicmFycmZzXCI6XCJcXHUyOTFFXCIsXCJyYXJyaGtcIjpcIlxcdTIxQUFcIixcInJhcnJscFwiOlwiXFx1MjFBQ1wiLFwicmFycnBsXCI6XCJcXHUyOTQ1XCIsXCJyYXJyc2ltXCI6XCJcXHUyOTc0XCIsXCJSYXJydGxcIjpcIlxcdTI5MTZcIixcInJhcnJ0bFwiOlwiXFx1MjFBM1wiLFwicmFycndcIjpcIlxcdTIxOURcIixcInJhdGFpbFwiOlwiXFx1MjkxQVwiLFwickF0YWlsXCI6XCJcXHUyOTFDXCIsXCJyYXRpb1wiOlwiXFx1MjIzNlwiLFwicmF0aW9uYWxzXCI6XCJcXHUyMTFBXCIsXCJyYmFyclwiOlwiXFx1MjkwRFwiLFwickJhcnJcIjpcIlxcdTI5MEZcIixcIlJCYXJyXCI6XCJcXHUyOTEwXCIsXCJyYmJya1wiOlwiXFx1Mjc3M1wiLFwicmJyYWNlXCI6XCJ9XCIsXCJyYnJhY2tcIjpcIl1cIixcInJicmtlXCI6XCJcXHUyOThDXCIsXCJyYnJrc2xkXCI6XCJcXHUyOThFXCIsXCJyYnJrc2x1XCI6XCJcXHUyOTkwXCIsXCJSY2Fyb25cIjpcIlxcdTAxNThcIixcInJjYXJvblwiOlwiXFx1MDE1OVwiLFwiUmNlZGlsXCI6XCJcXHUwMTU2XCIsXCJyY2VkaWxcIjpcIlxcdTAxNTdcIixcInJjZWlsXCI6XCJcXHUyMzA5XCIsXCJyY3ViXCI6XCJ9XCIsXCJSY3lcIjpcIlxcdTA0MjBcIixcInJjeVwiOlwiXFx1MDQ0MFwiLFwicmRjYVwiOlwiXFx1MjkzN1wiLFwicmRsZGhhclwiOlwiXFx1Mjk2OVwiLFwicmRxdW9cIjpcIlxcdTIwMURcIixcInJkcXVvclwiOlwiXFx1MjAxRFwiLFwicmRzaFwiOlwiXFx1MjFCM1wiLFwicmVhbFwiOlwiXFx1MjExQ1wiLFwicmVhbGluZVwiOlwiXFx1MjExQlwiLFwicmVhbHBhcnRcIjpcIlxcdTIxMUNcIixcInJlYWxzXCI6XCJcXHUyMTFEXCIsXCJSZVwiOlwiXFx1MjExQ1wiLFwicmVjdFwiOlwiXFx1MjVBRFwiLFwicmVnXCI6XCJcXHUwMEFFXCIsXCJSRUdcIjpcIlxcdTAwQUVcIixcIlJldmVyc2VFbGVtZW50XCI6XCJcXHUyMjBCXCIsXCJSZXZlcnNlRXF1aWxpYnJpdW1cIjpcIlxcdTIxQ0JcIixcIlJldmVyc2VVcEVxdWlsaWJyaXVtXCI6XCJcXHUyOTZGXCIsXCJyZmlzaHRcIjpcIlxcdTI5N0RcIixcInJmbG9vclwiOlwiXFx1MjMwQlwiLFwicmZyXCI6XCJcXHVEODM1XFx1REQyRlwiLFwiUmZyXCI6XCJcXHUyMTFDXCIsXCJySGFyXCI6XCJcXHUyOTY0XCIsXCJyaGFyZFwiOlwiXFx1MjFDMVwiLFwicmhhcnVcIjpcIlxcdTIxQzBcIixcInJoYXJ1bFwiOlwiXFx1Mjk2Q1wiLFwiUmhvXCI6XCJcXHUwM0ExXCIsXCJyaG9cIjpcIlxcdTAzQzFcIixcInJob3ZcIjpcIlxcdTAzRjFcIixcIlJpZ2h0QW5nbGVCcmFja2V0XCI6XCJcXHUyN0U5XCIsXCJSaWdodEFycm93QmFyXCI6XCJcXHUyMUU1XCIsXCJyaWdodGFycm93XCI6XCJcXHUyMTkyXCIsXCJSaWdodEFycm93XCI6XCJcXHUyMTkyXCIsXCJSaWdodGFycm93XCI6XCJcXHUyMUQyXCIsXCJSaWdodEFycm93TGVmdEFycm93XCI6XCJcXHUyMUM0XCIsXCJyaWdodGFycm93dGFpbFwiOlwiXFx1MjFBM1wiLFwiUmlnaHRDZWlsaW5nXCI6XCJcXHUyMzA5XCIsXCJSaWdodERvdWJsZUJyYWNrZXRcIjpcIlxcdTI3RTdcIixcIlJpZ2h0RG93blRlZVZlY3RvclwiOlwiXFx1Mjk1RFwiLFwiUmlnaHREb3duVmVjdG9yQmFyXCI6XCJcXHUyOTU1XCIsXCJSaWdodERvd25WZWN0b3JcIjpcIlxcdTIxQzJcIixcIlJpZ2h0Rmxvb3JcIjpcIlxcdTIzMEJcIixcInJpZ2h0aGFycG9vbmRvd25cIjpcIlxcdTIxQzFcIixcInJpZ2h0aGFycG9vbnVwXCI6XCJcXHUyMUMwXCIsXCJyaWdodGxlZnRhcnJvd3NcIjpcIlxcdTIxQzRcIixcInJpZ2h0bGVmdGhhcnBvb25zXCI6XCJcXHUyMUNDXCIsXCJyaWdodHJpZ2h0YXJyb3dzXCI6XCJcXHUyMUM5XCIsXCJyaWdodHNxdWlnYXJyb3dcIjpcIlxcdTIxOURcIixcIlJpZ2h0VGVlQXJyb3dcIjpcIlxcdTIxQTZcIixcIlJpZ2h0VGVlXCI6XCJcXHUyMkEyXCIsXCJSaWdodFRlZVZlY3RvclwiOlwiXFx1Mjk1QlwiLFwicmlnaHR0aHJlZXRpbWVzXCI6XCJcXHUyMkNDXCIsXCJSaWdodFRyaWFuZ2xlQmFyXCI6XCJcXHUyOUQwXCIsXCJSaWdodFRyaWFuZ2xlXCI6XCJcXHUyMkIzXCIsXCJSaWdodFRyaWFuZ2xlRXF1YWxcIjpcIlxcdTIyQjVcIixcIlJpZ2h0VXBEb3duVmVjdG9yXCI6XCJcXHUyOTRGXCIsXCJSaWdodFVwVGVlVmVjdG9yXCI6XCJcXHUyOTVDXCIsXCJSaWdodFVwVmVjdG9yQmFyXCI6XCJcXHUyOTU0XCIsXCJSaWdodFVwVmVjdG9yXCI6XCJcXHUyMUJFXCIsXCJSaWdodFZlY3RvckJhclwiOlwiXFx1Mjk1M1wiLFwiUmlnaHRWZWN0b3JcIjpcIlxcdTIxQzBcIixcInJpbmdcIjpcIlxcdTAyREFcIixcInJpc2luZ2RvdHNlcVwiOlwiXFx1MjI1M1wiLFwicmxhcnJcIjpcIlxcdTIxQzRcIixcInJsaGFyXCI6XCJcXHUyMUNDXCIsXCJybG1cIjpcIlxcdTIwMEZcIixcInJtb3VzdGFjaGVcIjpcIlxcdTIzQjFcIixcInJtb3VzdFwiOlwiXFx1MjNCMVwiLFwicm5taWRcIjpcIlxcdTJBRUVcIixcInJvYW5nXCI6XCJcXHUyN0VEXCIsXCJyb2FyclwiOlwiXFx1MjFGRVwiLFwicm9icmtcIjpcIlxcdTI3RTdcIixcInJvcGFyXCI6XCJcXHUyOTg2XCIsXCJyb3BmXCI6XCJcXHVEODM1XFx1REQ2M1wiLFwiUm9wZlwiOlwiXFx1MjExRFwiLFwicm9wbHVzXCI6XCJcXHUyQTJFXCIsXCJyb3RpbWVzXCI6XCJcXHUyQTM1XCIsXCJSb3VuZEltcGxpZXNcIjpcIlxcdTI5NzBcIixcInJwYXJcIjpcIilcIixcInJwYXJndFwiOlwiXFx1Mjk5NFwiLFwicnBwb2xpbnRcIjpcIlxcdTJBMTJcIixcInJyYXJyXCI6XCJcXHUyMUM5XCIsXCJScmlnaHRhcnJvd1wiOlwiXFx1MjFEQlwiLFwicnNhcXVvXCI6XCJcXHUyMDNBXCIsXCJyc2NyXCI6XCJcXHVEODM1XFx1RENDN1wiLFwiUnNjclwiOlwiXFx1MjExQlwiLFwicnNoXCI6XCJcXHUyMUIxXCIsXCJSc2hcIjpcIlxcdTIxQjFcIixcInJzcWJcIjpcIl1cIixcInJzcXVvXCI6XCJcXHUyMDE5XCIsXCJyc3F1b3JcIjpcIlxcdTIwMTlcIixcInJ0aHJlZVwiOlwiXFx1MjJDQ1wiLFwicnRpbWVzXCI6XCJcXHUyMkNBXCIsXCJydHJpXCI6XCJcXHUyNUI5XCIsXCJydHJpZVwiOlwiXFx1MjJCNVwiLFwicnRyaWZcIjpcIlxcdTI1QjhcIixcInJ0cmlsdHJpXCI6XCJcXHUyOUNFXCIsXCJSdWxlRGVsYXllZFwiOlwiXFx1MjlGNFwiLFwicnVsdWhhclwiOlwiXFx1Mjk2OFwiLFwicnhcIjpcIlxcdTIxMUVcIixcIlNhY3V0ZVwiOlwiXFx1MDE1QVwiLFwic2FjdXRlXCI6XCJcXHUwMTVCXCIsXCJzYnF1b1wiOlwiXFx1MjAxQVwiLFwic2NhcFwiOlwiXFx1MkFCOFwiLFwiU2Nhcm9uXCI6XCJcXHUwMTYwXCIsXCJzY2Fyb25cIjpcIlxcdTAxNjFcIixcIlNjXCI6XCJcXHUyQUJDXCIsXCJzY1wiOlwiXFx1MjI3QlwiLFwic2NjdWVcIjpcIlxcdTIyN0RcIixcInNjZVwiOlwiXFx1MkFCMFwiLFwic2NFXCI6XCJcXHUyQUI0XCIsXCJTY2VkaWxcIjpcIlxcdTAxNUVcIixcInNjZWRpbFwiOlwiXFx1MDE1RlwiLFwiU2NpcmNcIjpcIlxcdTAxNUNcIixcInNjaXJjXCI6XCJcXHUwMTVEXCIsXCJzY25hcFwiOlwiXFx1MkFCQVwiLFwic2NuRVwiOlwiXFx1MkFCNlwiLFwic2Nuc2ltXCI6XCJcXHUyMkU5XCIsXCJzY3BvbGludFwiOlwiXFx1MkExM1wiLFwic2NzaW1cIjpcIlxcdTIyN0ZcIixcIlNjeVwiOlwiXFx1MDQyMVwiLFwic2N5XCI6XCJcXHUwNDQxXCIsXCJzZG90YlwiOlwiXFx1MjJBMVwiLFwic2RvdFwiOlwiXFx1MjJDNVwiLFwic2RvdGVcIjpcIlxcdTJBNjZcIixcInNlYXJoa1wiOlwiXFx1MjkyNVwiLFwic2VhcnJcIjpcIlxcdTIxOThcIixcInNlQXJyXCI6XCJcXHUyMUQ4XCIsXCJzZWFycm93XCI6XCJcXHUyMTk4XCIsXCJzZWN0XCI6XCJcXHUwMEE3XCIsXCJzZW1pXCI6XCI7XCIsXCJzZXN3YXJcIjpcIlxcdTI5MjlcIixcInNldG1pbnVzXCI6XCJcXHUyMjE2XCIsXCJzZXRtblwiOlwiXFx1MjIxNlwiLFwic2V4dFwiOlwiXFx1MjczNlwiLFwiU2ZyXCI6XCJcXHVEODM1XFx1REQxNlwiLFwic2ZyXCI6XCJcXHVEODM1XFx1REQzMFwiLFwic2Zyb3duXCI6XCJcXHUyMzIyXCIsXCJzaGFycFwiOlwiXFx1MjY2RlwiLFwiU0hDSGN5XCI6XCJcXHUwNDI5XCIsXCJzaGNoY3lcIjpcIlxcdTA0NDlcIixcIlNIY3lcIjpcIlxcdTA0MjhcIixcInNoY3lcIjpcIlxcdTA0NDhcIixcIlNob3J0RG93bkFycm93XCI6XCJcXHUyMTkzXCIsXCJTaG9ydExlZnRBcnJvd1wiOlwiXFx1MjE5MFwiLFwic2hvcnRtaWRcIjpcIlxcdTIyMjNcIixcInNob3J0cGFyYWxsZWxcIjpcIlxcdTIyMjVcIixcIlNob3J0UmlnaHRBcnJvd1wiOlwiXFx1MjE5MlwiLFwiU2hvcnRVcEFycm93XCI6XCJcXHUyMTkxXCIsXCJzaHlcIjpcIlxcdTAwQURcIixcIlNpZ21hXCI6XCJcXHUwM0EzXCIsXCJzaWdtYVwiOlwiXFx1MDNDM1wiLFwic2lnbWFmXCI6XCJcXHUwM0MyXCIsXCJzaWdtYXZcIjpcIlxcdTAzQzJcIixcInNpbVwiOlwiXFx1MjIzQ1wiLFwic2ltZG90XCI6XCJcXHUyQTZBXCIsXCJzaW1lXCI6XCJcXHUyMjQzXCIsXCJzaW1lcVwiOlwiXFx1MjI0M1wiLFwic2ltZ1wiOlwiXFx1MkE5RVwiLFwic2ltZ0VcIjpcIlxcdTJBQTBcIixcInNpbWxcIjpcIlxcdTJBOURcIixcInNpbWxFXCI6XCJcXHUyQTlGXCIsXCJzaW1uZVwiOlwiXFx1MjI0NlwiLFwic2ltcGx1c1wiOlwiXFx1MkEyNFwiLFwic2ltcmFyclwiOlwiXFx1Mjk3MlwiLFwic2xhcnJcIjpcIlxcdTIxOTBcIixcIlNtYWxsQ2lyY2xlXCI6XCJcXHUyMjE4XCIsXCJzbWFsbHNldG1pbnVzXCI6XCJcXHUyMjE2XCIsXCJzbWFzaHBcIjpcIlxcdTJBMzNcIixcInNtZXBhcnNsXCI6XCJcXHUyOUU0XCIsXCJzbWlkXCI6XCJcXHUyMjIzXCIsXCJzbWlsZVwiOlwiXFx1MjMyM1wiLFwic210XCI6XCJcXHUyQUFBXCIsXCJzbXRlXCI6XCJcXHUyQUFDXCIsXCJzbXRlc1wiOlwiXFx1MkFBQ1xcdUZFMDBcIixcIlNPRlRjeVwiOlwiXFx1MDQyQ1wiLFwic29mdGN5XCI6XCJcXHUwNDRDXCIsXCJzb2xiYXJcIjpcIlxcdTIzM0ZcIixcInNvbGJcIjpcIlxcdTI5QzRcIixcInNvbFwiOlwiL1wiLFwiU29wZlwiOlwiXFx1RDgzNVxcdURENEFcIixcInNvcGZcIjpcIlxcdUQ4MzVcXHVERDY0XCIsXCJzcGFkZXNcIjpcIlxcdTI2NjBcIixcInNwYWRlc3VpdFwiOlwiXFx1MjY2MFwiLFwic3BhclwiOlwiXFx1MjIyNVwiLFwic3FjYXBcIjpcIlxcdTIyOTNcIixcInNxY2Fwc1wiOlwiXFx1MjI5M1xcdUZFMDBcIixcInNxY3VwXCI6XCJcXHUyMjk0XCIsXCJzcWN1cHNcIjpcIlxcdTIyOTRcXHVGRTAwXCIsXCJTcXJ0XCI6XCJcXHUyMjFBXCIsXCJzcXN1YlwiOlwiXFx1MjI4RlwiLFwic3FzdWJlXCI6XCJcXHUyMjkxXCIsXCJzcXN1YnNldFwiOlwiXFx1MjI4RlwiLFwic3FzdWJzZXRlcVwiOlwiXFx1MjI5MVwiLFwic3FzdXBcIjpcIlxcdTIyOTBcIixcInNxc3VwZVwiOlwiXFx1MjI5MlwiLFwic3FzdXBzZXRcIjpcIlxcdTIyOTBcIixcInNxc3Vwc2V0ZXFcIjpcIlxcdTIyOTJcIixcInNxdWFyZVwiOlwiXFx1MjVBMVwiLFwiU3F1YXJlXCI6XCJcXHUyNUExXCIsXCJTcXVhcmVJbnRlcnNlY3Rpb25cIjpcIlxcdTIyOTNcIixcIlNxdWFyZVN1YnNldFwiOlwiXFx1MjI4RlwiLFwiU3F1YXJlU3Vic2V0RXF1YWxcIjpcIlxcdTIyOTFcIixcIlNxdWFyZVN1cGVyc2V0XCI6XCJcXHUyMjkwXCIsXCJTcXVhcmVTdXBlcnNldEVxdWFsXCI6XCJcXHUyMjkyXCIsXCJTcXVhcmVVbmlvblwiOlwiXFx1MjI5NFwiLFwic3F1YXJmXCI6XCJcXHUyNUFBXCIsXCJzcXVcIjpcIlxcdTI1QTFcIixcInNxdWZcIjpcIlxcdTI1QUFcIixcInNyYXJyXCI6XCJcXHUyMTkyXCIsXCJTc2NyXCI6XCJcXHVEODM1XFx1RENBRVwiLFwic3NjclwiOlwiXFx1RDgzNVxcdURDQzhcIixcInNzZXRtblwiOlwiXFx1MjIxNlwiLFwic3NtaWxlXCI6XCJcXHUyMzIzXCIsXCJzc3RhcmZcIjpcIlxcdTIyQzZcIixcIlN0YXJcIjpcIlxcdTIyQzZcIixcInN0YXJcIjpcIlxcdTI2MDZcIixcInN0YXJmXCI6XCJcXHUyNjA1XCIsXCJzdHJhaWdodGVwc2lsb25cIjpcIlxcdTAzRjVcIixcInN0cmFpZ2h0cGhpXCI6XCJcXHUwM0Q1XCIsXCJzdHJuc1wiOlwiXFx1MDBBRlwiLFwic3ViXCI6XCJcXHUyMjgyXCIsXCJTdWJcIjpcIlxcdTIyRDBcIixcInN1YmRvdFwiOlwiXFx1MkFCRFwiLFwic3ViRVwiOlwiXFx1MkFDNVwiLFwic3ViZVwiOlwiXFx1MjI4NlwiLFwic3ViZWRvdFwiOlwiXFx1MkFDM1wiLFwic3VibXVsdFwiOlwiXFx1MkFDMVwiLFwic3VibkVcIjpcIlxcdTJBQ0JcIixcInN1Ym5lXCI6XCJcXHUyMjhBXCIsXCJzdWJwbHVzXCI6XCJcXHUyQUJGXCIsXCJzdWJyYXJyXCI6XCJcXHUyOTc5XCIsXCJzdWJzZXRcIjpcIlxcdTIyODJcIixcIlN1YnNldFwiOlwiXFx1MjJEMFwiLFwic3Vic2V0ZXFcIjpcIlxcdTIyODZcIixcInN1YnNldGVxcVwiOlwiXFx1MkFDNVwiLFwiU3Vic2V0RXF1YWxcIjpcIlxcdTIyODZcIixcInN1YnNldG5lcVwiOlwiXFx1MjI4QVwiLFwic3Vic2V0bmVxcVwiOlwiXFx1MkFDQlwiLFwic3Vic2ltXCI6XCJcXHUyQUM3XCIsXCJzdWJzdWJcIjpcIlxcdTJBRDVcIixcInN1YnN1cFwiOlwiXFx1MkFEM1wiLFwic3VjY2FwcHJveFwiOlwiXFx1MkFCOFwiLFwic3VjY1wiOlwiXFx1MjI3QlwiLFwic3VjY2N1cmx5ZXFcIjpcIlxcdTIyN0RcIixcIlN1Y2NlZWRzXCI6XCJcXHUyMjdCXCIsXCJTdWNjZWVkc0VxdWFsXCI6XCJcXHUyQUIwXCIsXCJTdWNjZWVkc1NsYW50RXF1YWxcIjpcIlxcdTIyN0RcIixcIlN1Y2NlZWRzVGlsZGVcIjpcIlxcdTIyN0ZcIixcInN1Y2NlcVwiOlwiXFx1MkFCMFwiLFwic3VjY25hcHByb3hcIjpcIlxcdTJBQkFcIixcInN1Y2NuZXFxXCI6XCJcXHUyQUI2XCIsXCJzdWNjbnNpbVwiOlwiXFx1MjJFOVwiLFwic3VjY3NpbVwiOlwiXFx1MjI3RlwiLFwiU3VjaFRoYXRcIjpcIlxcdTIyMEJcIixcInN1bVwiOlwiXFx1MjIxMVwiLFwiU3VtXCI6XCJcXHUyMjExXCIsXCJzdW5nXCI6XCJcXHUyNjZBXCIsXCJzdXAxXCI6XCJcXHUwMEI5XCIsXCJzdXAyXCI6XCJcXHUwMEIyXCIsXCJzdXAzXCI6XCJcXHUwMEIzXCIsXCJzdXBcIjpcIlxcdTIyODNcIixcIlN1cFwiOlwiXFx1MjJEMVwiLFwic3VwZG90XCI6XCJcXHUyQUJFXCIsXCJzdXBkc3ViXCI6XCJcXHUyQUQ4XCIsXCJzdXBFXCI6XCJcXHUyQUM2XCIsXCJzdXBlXCI6XCJcXHUyMjg3XCIsXCJzdXBlZG90XCI6XCJcXHUyQUM0XCIsXCJTdXBlcnNldFwiOlwiXFx1MjI4M1wiLFwiU3VwZXJzZXRFcXVhbFwiOlwiXFx1MjI4N1wiLFwic3VwaHNvbFwiOlwiXFx1MjdDOVwiLFwic3VwaHN1YlwiOlwiXFx1MkFEN1wiLFwic3VwbGFyclwiOlwiXFx1Mjk3QlwiLFwic3VwbXVsdFwiOlwiXFx1MkFDMlwiLFwic3VwbkVcIjpcIlxcdTJBQ0NcIixcInN1cG5lXCI6XCJcXHUyMjhCXCIsXCJzdXBwbHVzXCI6XCJcXHUyQUMwXCIsXCJzdXBzZXRcIjpcIlxcdTIyODNcIixcIlN1cHNldFwiOlwiXFx1MjJEMVwiLFwic3Vwc2V0ZXFcIjpcIlxcdTIyODdcIixcInN1cHNldGVxcVwiOlwiXFx1MkFDNlwiLFwic3Vwc2V0bmVxXCI6XCJcXHUyMjhCXCIsXCJzdXBzZXRuZXFxXCI6XCJcXHUyQUNDXCIsXCJzdXBzaW1cIjpcIlxcdTJBQzhcIixcInN1cHN1YlwiOlwiXFx1MkFENFwiLFwic3Vwc3VwXCI6XCJcXHUyQUQ2XCIsXCJzd2FyaGtcIjpcIlxcdTI5MjZcIixcInN3YXJyXCI6XCJcXHUyMTk5XCIsXCJzd0FyclwiOlwiXFx1MjFEOVwiLFwic3dhcnJvd1wiOlwiXFx1MjE5OVwiLFwic3dud2FyXCI6XCJcXHUyOTJBXCIsXCJzemxpZ1wiOlwiXFx1MDBERlwiLFwiVGFiXCI6XCJcXHRcIixcInRhcmdldFwiOlwiXFx1MjMxNlwiLFwiVGF1XCI6XCJcXHUwM0E0XCIsXCJ0YXVcIjpcIlxcdTAzQzRcIixcInRicmtcIjpcIlxcdTIzQjRcIixcIlRjYXJvblwiOlwiXFx1MDE2NFwiLFwidGNhcm9uXCI6XCJcXHUwMTY1XCIsXCJUY2VkaWxcIjpcIlxcdTAxNjJcIixcInRjZWRpbFwiOlwiXFx1MDE2M1wiLFwiVGN5XCI6XCJcXHUwNDIyXCIsXCJ0Y3lcIjpcIlxcdTA0NDJcIixcInRkb3RcIjpcIlxcdTIwREJcIixcInRlbHJlY1wiOlwiXFx1MjMxNVwiLFwiVGZyXCI6XCJcXHVEODM1XFx1REQxN1wiLFwidGZyXCI6XCJcXHVEODM1XFx1REQzMVwiLFwidGhlcmU0XCI6XCJcXHUyMjM0XCIsXCJ0aGVyZWZvcmVcIjpcIlxcdTIyMzRcIixcIlRoZXJlZm9yZVwiOlwiXFx1MjIzNFwiLFwiVGhldGFcIjpcIlxcdTAzOThcIixcInRoZXRhXCI6XCJcXHUwM0I4XCIsXCJ0aGV0YXN5bVwiOlwiXFx1MDNEMVwiLFwidGhldGF2XCI6XCJcXHUwM0QxXCIsXCJ0aGlja2FwcHJveFwiOlwiXFx1MjI0OFwiLFwidGhpY2tzaW1cIjpcIlxcdTIyM0NcIixcIlRoaWNrU3BhY2VcIjpcIlxcdTIwNUZcXHUyMDBBXCIsXCJUaGluU3BhY2VcIjpcIlxcdTIwMDlcIixcInRoaW5zcFwiOlwiXFx1MjAwOVwiLFwidGhrYXBcIjpcIlxcdTIyNDhcIixcInRoa3NpbVwiOlwiXFx1MjIzQ1wiLFwiVEhPUk5cIjpcIlxcdTAwREVcIixcInRob3JuXCI6XCJcXHUwMEZFXCIsXCJ0aWxkZVwiOlwiXFx1MDJEQ1wiLFwiVGlsZGVcIjpcIlxcdTIyM0NcIixcIlRpbGRlRXF1YWxcIjpcIlxcdTIyNDNcIixcIlRpbGRlRnVsbEVxdWFsXCI6XCJcXHUyMjQ1XCIsXCJUaWxkZVRpbGRlXCI6XCJcXHUyMjQ4XCIsXCJ0aW1lc2JhclwiOlwiXFx1MkEzMVwiLFwidGltZXNiXCI6XCJcXHUyMkEwXCIsXCJ0aW1lc1wiOlwiXFx1MDBEN1wiLFwidGltZXNkXCI6XCJcXHUyQTMwXCIsXCJ0aW50XCI6XCJcXHUyMjJEXCIsXCJ0b2VhXCI6XCJcXHUyOTI4XCIsXCJ0b3Bib3RcIjpcIlxcdTIzMzZcIixcInRvcGNpclwiOlwiXFx1MkFGMVwiLFwidG9wXCI6XCJcXHUyMkE0XCIsXCJUb3BmXCI6XCJcXHVEODM1XFx1REQ0QlwiLFwidG9wZlwiOlwiXFx1RDgzNVxcdURENjVcIixcInRvcGZvcmtcIjpcIlxcdTJBREFcIixcInRvc2FcIjpcIlxcdTI5MjlcIixcInRwcmltZVwiOlwiXFx1MjAzNFwiLFwidHJhZGVcIjpcIlxcdTIxMjJcIixcIlRSQURFXCI6XCJcXHUyMTIyXCIsXCJ0cmlhbmdsZVwiOlwiXFx1MjVCNVwiLFwidHJpYW5nbGVkb3duXCI6XCJcXHUyNUJGXCIsXCJ0cmlhbmdsZWxlZnRcIjpcIlxcdTI1QzNcIixcInRyaWFuZ2xlbGVmdGVxXCI6XCJcXHUyMkI0XCIsXCJ0cmlhbmdsZXFcIjpcIlxcdTIyNUNcIixcInRyaWFuZ2xlcmlnaHRcIjpcIlxcdTI1QjlcIixcInRyaWFuZ2xlcmlnaHRlcVwiOlwiXFx1MjJCNVwiLFwidHJpZG90XCI6XCJcXHUyNUVDXCIsXCJ0cmllXCI6XCJcXHUyMjVDXCIsXCJ0cmltaW51c1wiOlwiXFx1MkEzQVwiLFwiVHJpcGxlRG90XCI6XCJcXHUyMERCXCIsXCJ0cmlwbHVzXCI6XCJcXHUyQTM5XCIsXCJ0cmlzYlwiOlwiXFx1MjlDRFwiLFwidHJpdGltZVwiOlwiXFx1MkEzQlwiLFwidHJwZXppdW1cIjpcIlxcdTIzRTJcIixcIlRzY3JcIjpcIlxcdUQ4MzVcXHVEQ0FGXCIsXCJ0c2NyXCI6XCJcXHVEODM1XFx1RENDOVwiLFwiVFNjeVwiOlwiXFx1MDQyNlwiLFwidHNjeVwiOlwiXFx1MDQ0NlwiLFwiVFNIY3lcIjpcIlxcdTA0MEJcIixcInRzaGN5XCI6XCJcXHUwNDVCXCIsXCJUc3Ryb2tcIjpcIlxcdTAxNjZcIixcInRzdHJva1wiOlwiXFx1MDE2N1wiLFwidHdpeHRcIjpcIlxcdTIyNkNcIixcInR3b2hlYWRsZWZ0YXJyb3dcIjpcIlxcdTIxOUVcIixcInR3b2hlYWRyaWdodGFycm93XCI6XCJcXHUyMUEwXCIsXCJVYWN1dGVcIjpcIlxcdTAwREFcIixcInVhY3V0ZVwiOlwiXFx1MDBGQVwiLFwidWFyclwiOlwiXFx1MjE5MVwiLFwiVWFyclwiOlwiXFx1MjE5RlwiLFwidUFyclwiOlwiXFx1MjFEMVwiLFwiVWFycm9jaXJcIjpcIlxcdTI5NDlcIixcIlVicmN5XCI6XCJcXHUwNDBFXCIsXCJ1YnJjeVwiOlwiXFx1MDQ1RVwiLFwiVWJyZXZlXCI6XCJcXHUwMTZDXCIsXCJ1YnJldmVcIjpcIlxcdTAxNkRcIixcIlVjaXJjXCI6XCJcXHUwMERCXCIsXCJ1Y2lyY1wiOlwiXFx1MDBGQlwiLFwiVWN5XCI6XCJcXHUwNDIzXCIsXCJ1Y3lcIjpcIlxcdTA0NDNcIixcInVkYXJyXCI6XCJcXHUyMUM1XCIsXCJVZGJsYWNcIjpcIlxcdTAxNzBcIixcInVkYmxhY1wiOlwiXFx1MDE3MVwiLFwidWRoYXJcIjpcIlxcdTI5NkVcIixcInVmaXNodFwiOlwiXFx1Mjk3RVwiLFwiVWZyXCI6XCJcXHVEODM1XFx1REQxOFwiLFwidWZyXCI6XCJcXHVEODM1XFx1REQzMlwiLFwiVWdyYXZlXCI6XCJcXHUwMEQ5XCIsXCJ1Z3JhdmVcIjpcIlxcdTAwRjlcIixcInVIYXJcIjpcIlxcdTI5NjNcIixcInVoYXJsXCI6XCJcXHUyMUJGXCIsXCJ1aGFyclwiOlwiXFx1MjFCRVwiLFwidWhibGtcIjpcIlxcdTI1ODBcIixcInVsY29yblwiOlwiXFx1MjMxQ1wiLFwidWxjb3JuZXJcIjpcIlxcdTIzMUNcIixcInVsY3JvcFwiOlwiXFx1MjMwRlwiLFwidWx0cmlcIjpcIlxcdTI1RjhcIixcIlVtYWNyXCI6XCJcXHUwMTZBXCIsXCJ1bWFjclwiOlwiXFx1MDE2QlwiLFwidW1sXCI6XCJcXHUwMEE4XCIsXCJVbmRlckJhclwiOlwiX1wiLFwiVW5kZXJCcmFjZVwiOlwiXFx1MjNERlwiLFwiVW5kZXJCcmFja2V0XCI6XCJcXHUyM0I1XCIsXCJVbmRlclBhcmVudGhlc2lzXCI6XCJcXHUyM0REXCIsXCJVbmlvblwiOlwiXFx1MjJDM1wiLFwiVW5pb25QbHVzXCI6XCJcXHUyMjhFXCIsXCJVb2dvblwiOlwiXFx1MDE3MlwiLFwidW9nb25cIjpcIlxcdTAxNzNcIixcIlVvcGZcIjpcIlxcdUQ4MzVcXHVERDRDXCIsXCJ1b3BmXCI6XCJcXHVEODM1XFx1REQ2NlwiLFwiVXBBcnJvd0JhclwiOlwiXFx1MjkxMlwiLFwidXBhcnJvd1wiOlwiXFx1MjE5MVwiLFwiVXBBcnJvd1wiOlwiXFx1MjE5MVwiLFwiVXBhcnJvd1wiOlwiXFx1MjFEMVwiLFwiVXBBcnJvd0Rvd25BcnJvd1wiOlwiXFx1MjFDNVwiLFwidXBkb3duYXJyb3dcIjpcIlxcdTIxOTVcIixcIlVwRG93bkFycm93XCI6XCJcXHUyMTk1XCIsXCJVcGRvd25hcnJvd1wiOlwiXFx1MjFENVwiLFwiVXBFcXVpbGlicml1bVwiOlwiXFx1Mjk2RVwiLFwidXBoYXJwb29ubGVmdFwiOlwiXFx1MjFCRlwiLFwidXBoYXJwb29ucmlnaHRcIjpcIlxcdTIxQkVcIixcInVwbHVzXCI6XCJcXHUyMjhFXCIsXCJVcHBlckxlZnRBcnJvd1wiOlwiXFx1MjE5NlwiLFwiVXBwZXJSaWdodEFycm93XCI6XCJcXHUyMTk3XCIsXCJ1cHNpXCI6XCJcXHUwM0M1XCIsXCJVcHNpXCI6XCJcXHUwM0QyXCIsXCJ1cHNpaFwiOlwiXFx1MDNEMlwiLFwiVXBzaWxvblwiOlwiXFx1MDNBNVwiLFwidXBzaWxvblwiOlwiXFx1MDNDNVwiLFwiVXBUZWVBcnJvd1wiOlwiXFx1MjFBNVwiLFwiVXBUZWVcIjpcIlxcdTIyQTVcIixcInVwdXBhcnJvd3NcIjpcIlxcdTIxQzhcIixcInVyY29yblwiOlwiXFx1MjMxRFwiLFwidXJjb3JuZXJcIjpcIlxcdTIzMURcIixcInVyY3JvcFwiOlwiXFx1MjMwRVwiLFwiVXJpbmdcIjpcIlxcdTAxNkVcIixcInVyaW5nXCI6XCJcXHUwMTZGXCIsXCJ1cnRyaVwiOlwiXFx1MjVGOVwiLFwiVXNjclwiOlwiXFx1RDgzNVxcdURDQjBcIixcInVzY3JcIjpcIlxcdUQ4MzVcXHVEQ0NBXCIsXCJ1dGRvdFwiOlwiXFx1MjJGMFwiLFwiVXRpbGRlXCI6XCJcXHUwMTY4XCIsXCJ1dGlsZGVcIjpcIlxcdTAxNjlcIixcInV0cmlcIjpcIlxcdTI1QjVcIixcInV0cmlmXCI6XCJcXHUyNUI0XCIsXCJ1dWFyclwiOlwiXFx1MjFDOFwiLFwiVXVtbFwiOlwiXFx1MDBEQ1wiLFwidXVtbFwiOlwiXFx1MDBGQ1wiLFwidXdhbmdsZVwiOlwiXFx1MjlBN1wiLFwidmFuZ3J0XCI6XCJcXHUyOTlDXCIsXCJ2YXJlcHNpbG9uXCI6XCJcXHUwM0Y1XCIsXCJ2YXJrYXBwYVwiOlwiXFx1MDNGMFwiLFwidmFybm90aGluZ1wiOlwiXFx1MjIwNVwiLFwidmFycGhpXCI6XCJcXHUwM0Q1XCIsXCJ2YXJwaVwiOlwiXFx1MDNENlwiLFwidmFycHJvcHRvXCI6XCJcXHUyMjFEXCIsXCJ2YXJyXCI6XCJcXHUyMTk1XCIsXCJ2QXJyXCI6XCJcXHUyMUQ1XCIsXCJ2YXJyaG9cIjpcIlxcdTAzRjFcIixcInZhcnNpZ21hXCI6XCJcXHUwM0MyXCIsXCJ2YXJzdWJzZXRuZXFcIjpcIlxcdTIyOEFcXHVGRTAwXCIsXCJ2YXJzdWJzZXRuZXFxXCI6XCJcXHUyQUNCXFx1RkUwMFwiLFwidmFyc3Vwc2V0bmVxXCI6XCJcXHUyMjhCXFx1RkUwMFwiLFwidmFyc3Vwc2V0bmVxcVwiOlwiXFx1MkFDQ1xcdUZFMDBcIixcInZhcnRoZXRhXCI6XCJcXHUwM0QxXCIsXCJ2YXJ0cmlhbmdsZWxlZnRcIjpcIlxcdTIyQjJcIixcInZhcnRyaWFuZ2xlcmlnaHRcIjpcIlxcdTIyQjNcIixcInZCYXJcIjpcIlxcdTJBRThcIixcIlZiYXJcIjpcIlxcdTJBRUJcIixcInZCYXJ2XCI6XCJcXHUyQUU5XCIsXCJWY3lcIjpcIlxcdTA0MTJcIixcInZjeVwiOlwiXFx1MDQzMlwiLFwidmRhc2hcIjpcIlxcdTIyQTJcIixcInZEYXNoXCI6XCJcXHUyMkE4XCIsXCJWZGFzaFwiOlwiXFx1MjJBOVwiLFwiVkRhc2hcIjpcIlxcdTIyQUJcIixcIlZkYXNobFwiOlwiXFx1MkFFNlwiLFwidmVlYmFyXCI6XCJcXHUyMkJCXCIsXCJ2ZWVcIjpcIlxcdTIyMjhcIixcIlZlZVwiOlwiXFx1MjJDMVwiLFwidmVlZXFcIjpcIlxcdTIyNUFcIixcInZlbGxpcFwiOlwiXFx1MjJFRVwiLFwidmVyYmFyXCI6XCJ8XCIsXCJWZXJiYXJcIjpcIlxcdTIwMTZcIixcInZlcnRcIjpcInxcIixcIlZlcnRcIjpcIlxcdTIwMTZcIixcIlZlcnRpY2FsQmFyXCI6XCJcXHUyMjIzXCIsXCJWZXJ0aWNhbExpbmVcIjpcInxcIixcIlZlcnRpY2FsU2VwYXJhdG9yXCI6XCJcXHUyNzU4XCIsXCJWZXJ0aWNhbFRpbGRlXCI6XCJcXHUyMjQwXCIsXCJWZXJ5VGhpblNwYWNlXCI6XCJcXHUyMDBBXCIsXCJWZnJcIjpcIlxcdUQ4MzVcXHVERDE5XCIsXCJ2ZnJcIjpcIlxcdUQ4MzVcXHVERDMzXCIsXCJ2bHRyaVwiOlwiXFx1MjJCMlwiLFwidm5zdWJcIjpcIlxcdTIyODJcXHUyMEQyXCIsXCJ2bnN1cFwiOlwiXFx1MjI4M1xcdTIwRDJcIixcIlZvcGZcIjpcIlxcdUQ4MzVcXHVERDREXCIsXCJ2b3BmXCI6XCJcXHVEODM1XFx1REQ2N1wiLFwidnByb3BcIjpcIlxcdTIyMURcIixcInZydHJpXCI6XCJcXHUyMkIzXCIsXCJWc2NyXCI6XCJcXHVEODM1XFx1RENCMVwiLFwidnNjclwiOlwiXFx1RDgzNVxcdURDQ0JcIixcInZzdWJuRVwiOlwiXFx1MkFDQlxcdUZFMDBcIixcInZzdWJuZVwiOlwiXFx1MjI4QVxcdUZFMDBcIixcInZzdXBuRVwiOlwiXFx1MkFDQ1xcdUZFMDBcIixcInZzdXBuZVwiOlwiXFx1MjI4QlxcdUZFMDBcIixcIlZ2ZGFzaFwiOlwiXFx1MjJBQVwiLFwidnppZ3phZ1wiOlwiXFx1Mjk5QVwiLFwiV2NpcmNcIjpcIlxcdTAxNzRcIixcIndjaXJjXCI6XCJcXHUwMTc1XCIsXCJ3ZWRiYXJcIjpcIlxcdTJBNUZcIixcIndlZGdlXCI6XCJcXHUyMjI3XCIsXCJXZWRnZVwiOlwiXFx1MjJDMFwiLFwid2VkZ2VxXCI6XCJcXHUyMjU5XCIsXCJ3ZWllcnBcIjpcIlxcdTIxMThcIixcIldmclwiOlwiXFx1RDgzNVxcdUREMUFcIixcIndmclwiOlwiXFx1RDgzNVxcdUREMzRcIixcIldvcGZcIjpcIlxcdUQ4MzVcXHVERDRFXCIsXCJ3b3BmXCI6XCJcXHVEODM1XFx1REQ2OFwiLFwid3BcIjpcIlxcdTIxMThcIixcIndyXCI6XCJcXHUyMjQwXCIsXCJ3cmVhdGhcIjpcIlxcdTIyNDBcIixcIldzY3JcIjpcIlxcdUQ4MzVcXHVEQ0IyXCIsXCJ3c2NyXCI6XCJcXHVEODM1XFx1RENDQ1wiLFwieGNhcFwiOlwiXFx1MjJDMlwiLFwieGNpcmNcIjpcIlxcdTI1RUZcIixcInhjdXBcIjpcIlxcdTIyQzNcIixcInhkdHJpXCI6XCJcXHUyNUJEXCIsXCJYZnJcIjpcIlxcdUQ4MzVcXHVERDFCXCIsXCJ4ZnJcIjpcIlxcdUQ4MzVcXHVERDM1XCIsXCJ4aGFyclwiOlwiXFx1MjdGN1wiLFwieGhBcnJcIjpcIlxcdTI3RkFcIixcIlhpXCI6XCJcXHUwMzlFXCIsXCJ4aVwiOlwiXFx1MDNCRVwiLFwieGxhcnJcIjpcIlxcdTI3RjVcIixcInhsQXJyXCI6XCJcXHUyN0Y4XCIsXCJ4bWFwXCI6XCJcXHUyN0ZDXCIsXCJ4bmlzXCI6XCJcXHUyMkZCXCIsXCJ4b2RvdFwiOlwiXFx1MkEwMFwiLFwiWG9wZlwiOlwiXFx1RDgzNVxcdURENEZcIixcInhvcGZcIjpcIlxcdUQ4MzVcXHVERDY5XCIsXCJ4b3BsdXNcIjpcIlxcdTJBMDFcIixcInhvdGltZVwiOlwiXFx1MkEwMlwiLFwieHJhcnJcIjpcIlxcdTI3RjZcIixcInhyQXJyXCI6XCJcXHUyN0Y5XCIsXCJYc2NyXCI6XCJcXHVEODM1XFx1RENCM1wiLFwieHNjclwiOlwiXFx1RDgzNVxcdURDQ0RcIixcInhzcWN1cFwiOlwiXFx1MkEwNlwiLFwieHVwbHVzXCI6XCJcXHUyQTA0XCIsXCJ4dXRyaVwiOlwiXFx1MjVCM1wiLFwieHZlZVwiOlwiXFx1MjJDMVwiLFwieHdlZGdlXCI6XCJcXHUyMkMwXCIsXCJZYWN1dGVcIjpcIlxcdTAwRERcIixcInlhY3V0ZVwiOlwiXFx1MDBGRFwiLFwiWUFjeVwiOlwiXFx1MDQyRlwiLFwieWFjeVwiOlwiXFx1MDQ0RlwiLFwiWWNpcmNcIjpcIlxcdTAxNzZcIixcInljaXJjXCI6XCJcXHUwMTc3XCIsXCJZY3lcIjpcIlxcdTA0MkJcIixcInljeVwiOlwiXFx1MDQ0QlwiLFwieWVuXCI6XCJcXHUwMEE1XCIsXCJZZnJcIjpcIlxcdUQ4MzVcXHVERDFDXCIsXCJ5ZnJcIjpcIlxcdUQ4MzVcXHVERDM2XCIsXCJZSWN5XCI6XCJcXHUwNDA3XCIsXCJ5aWN5XCI6XCJcXHUwNDU3XCIsXCJZb3BmXCI6XCJcXHVEODM1XFx1REQ1MFwiLFwieW9wZlwiOlwiXFx1RDgzNVxcdURENkFcIixcIllzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I0XCIsXCJ5c2NyXCI6XCJcXHVEODM1XFx1RENDRVwiLFwiWVVjeVwiOlwiXFx1MDQyRVwiLFwieXVjeVwiOlwiXFx1MDQ0RVwiLFwieXVtbFwiOlwiXFx1MDBGRlwiLFwiWXVtbFwiOlwiXFx1MDE3OFwiLFwiWmFjdXRlXCI6XCJcXHUwMTc5XCIsXCJ6YWN1dGVcIjpcIlxcdTAxN0FcIixcIlpjYXJvblwiOlwiXFx1MDE3RFwiLFwiemNhcm9uXCI6XCJcXHUwMTdFXCIsXCJaY3lcIjpcIlxcdTA0MTdcIixcInpjeVwiOlwiXFx1MDQzN1wiLFwiWmRvdFwiOlwiXFx1MDE3QlwiLFwiemRvdFwiOlwiXFx1MDE3Q1wiLFwiemVldHJmXCI6XCJcXHUyMTI4XCIsXCJaZXJvV2lkdGhTcGFjZVwiOlwiXFx1MjAwQlwiLFwiWmV0YVwiOlwiXFx1MDM5NlwiLFwiemV0YVwiOlwiXFx1MDNCNlwiLFwiemZyXCI6XCJcXHVEODM1XFx1REQzN1wiLFwiWmZyXCI6XCJcXHUyMTI4XCIsXCJaSGN5XCI6XCJcXHUwNDE2XCIsXCJ6aGN5XCI6XCJcXHUwNDM2XCIsXCJ6aWdyYXJyXCI6XCJcXHUyMUREXCIsXCJ6b3BmXCI6XCJcXHVEODM1XFx1REQ2QlwiLFwiWm9wZlwiOlwiXFx1MjEyNFwiLFwiWnNjclwiOlwiXFx1RDgzNVxcdURDQjVcIixcInpzY3JcIjpcIlxcdUQ4MzVcXHVEQ0NGXCIsXCJ6d2pcIjpcIlxcdTIwMERcIixcInp3bmpcIjpcIlxcdTIwMENcIn1cbiAgfSx7fV0sMTM6W2Z1bmN0aW9uKGR5bmFtaWNSZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHM9e1wiQWFjdXRlXCI6XCJcXHUwMEMxXCIsXCJhYWN1dGVcIjpcIlxcdTAwRTFcIixcIkFjaXJjXCI6XCJcXHUwMEMyXCIsXCJhY2lyY1wiOlwiXFx1MDBFMlwiLFwiYWN1dGVcIjpcIlxcdTAwQjRcIixcIkFFbGlnXCI6XCJcXHUwMEM2XCIsXCJhZWxpZ1wiOlwiXFx1MDBFNlwiLFwiQWdyYXZlXCI6XCJcXHUwMEMwXCIsXCJhZ3JhdmVcIjpcIlxcdTAwRTBcIixcImFtcFwiOlwiJlwiLFwiQU1QXCI6XCImXCIsXCJBcmluZ1wiOlwiXFx1MDBDNVwiLFwiYXJpbmdcIjpcIlxcdTAwRTVcIixcIkF0aWxkZVwiOlwiXFx1MDBDM1wiLFwiYXRpbGRlXCI6XCJcXHUwMEUzXCIsXCJBdW1sXCI6XCJcXHUwMEM0XCIsXCJhdW1sXCI6XCJcXHUwMEU0XCIsXCJicnZiYXJcIjpcIlxcdTAwQTZcIixcIkNjZWRpbFwiOlwiXFx1MDBDN1wiLFwiY2NlZGlsXCI6XCJcXHUwMEU3XCIsXCJjZWRpbFwiOlwiXFx1MDBCOFwiLFwiY2VudFwiOlwiXFx1MDBBMlwiLFwiY29weVwiOlwiXFx1MDBBOVwiLFwiQ09QWVwiOlwiXFx1MDBBOVwiLFwiY3VycmVuXCI6XCJcXHUwMEE0XCIsXCJkZWdcIjpcIlxcdTAwQjBcIixcImRpdmlkZVwiOlwiXFx1MDBGN1wiLFwiRWFjdXRlXCI6XCJcXHUwMEM5XCIsXCJlYWN1dGVcIjpcIlxcdTAwRTlcIixcIkVjaXJjXCI6XCJcXHUwMENBXCIsXCJlY2lyY1wiOlwiXFx1MDBFQVwiLFwiRWdyYXZlXCI6XCJcXHUwMEM4XCIsXCJlZ3JhdmVcIjpcIlxcdTAwRThcIixcIkVUSFwiOlwiXFx1MDBEMFwiLFwiZXRoXCI6XCJcXHUwMEYwXCIsXCJFdW1sXCI6XCJcXHUwMENCXCIsXCJldW1sXCI6XCJcXHUwMEVCXCIsXCJmcmFjMTJcIjpcIlxcdTAwQkRcIixcImZyYWMxNFwiOlwiXFx1MDBCQ1wiLFwiZnJhYzM0XCI6XCJcXHUwMEJFXCIsXCJndFwiOlwiPlwiLFwiR1RcIjpcIj5cIixcIklhY3V0ZVwiOlwiXFx1MDBDRFwiLFwiaWFjdXRlXCI6XCJcXHUwMEVEXCIsXCJJY2lyY1wiOlwiXFx1MDBDRVwiLFwiaWNpcmNcIjpcIlxcdTAwRUVcIixcImlleGNsXCI6XCJcXHUwMEExXCIsXCJJZ3JhdmVcIjpcIlxcdTAwQ0NcIixcImlncmF2ZVwiOlwiXFx1MDBFQ1wiLFwiaXF1ZXN0XCI6XCJcXHUwMEJGXCIsXCJJdW1sXCI6XCJcXHUwMENGXCIsXCJpdW1sXCI6XCJcXHUwMEVGXCIsXCJsYXF1b1wiOlwiXFx1MDBBQlwiLFwibHRcIjpcIjxcIixcIkxUXCI6XCI8XCIsXCJtYWNyXCI6XCJcXHUwMEFGXCIsXCJtaWNyb1wiOlwiXFx1MDBCNVwiLFwibWlkZG90XCI6XCJcXHUwMEI3XCIsXCJuYnNwXCI6XCJcXHUwMEEwXCIsXCJub3RcIjpcIlxcdTAwQUNcIixcIk50aWxkZVwiOlwiXFx1MDBEMVwiLFwibnRpbGRlXCI6XCJcXHUwMEYxXCIsXCJPYWN1dGVcIjpcIlxcdTAwRDNcIixcIm9hY3V0ZVwiOlwiXFx1MDBGM1wiLFwiT2NpcmNcIjpcIlxcdTAwRDRcIixcIm9jaXJjXCI6XCJcXHUwMEY0XCIsXCJPZ3JhdmVcIjpcIlxcdTAwRDJcIixcIm9ncmF2ZVwiOlwiXFx1MDBGMlwiLFwib3JkZlwiOlwiXFx1MDBBQVwiLFwib3JkbVwiOlwiXFx1MDBCQVwiLFwiT3NsYXNoXCI6XCJcXHUwMEQ4XCIsXCJvc2xhc2hcIjpcIlxcdTAwRjhcIixcIk90aWxkZVwiOlwiXFx1MDBENVwiLFwib3RpbGRlXCI6XCJcXHUwMEY1XCIsXCJPdW1sXCI6XCJcXHUwMEQ2XCIsXCJvdW1sXCI6XCJcXHUwMEY2XCIsXCJwYXJhXCI6XCJcXHUwMEI2XCIsXCJwbHVzbW5cIjpcIlxcdTAwQjFcIixcInBvdW5kXCI6XCJcXHUwMEEzXCIsXCJxdW90XCI6XCJcXFwiXCIsXCJRVU9UXCI6XCJcXFwiXCIsXCJyYXF1b1wiOlwiXFx1MDBCQlwiLFwicmVnXCI6XCJcXHUwMEFFXCIsXCJSRUdcIjpcIlxcdTAwQUVcIixcInNlY3RcIjpcIlxcdTAwQTdcIixcInNoeVwiOlwiXFx1MDBBRFwiLFwic3VwMVwiOlwiXFx1MDBCOVwiLFwic3VwMlwiOlwiXFx1MDBCMlwiLFwic3VwM1wiOlwiXFx1MDBCM1wiLFwic3psaWdcIjpcIlxcdTAwREZcIixcIlRIT1JOXCI6XCJcXHUwMERFXCIsXCJ0aG9yblwiOlwiXFx1MDBGRVwiLFwidGltZXNcIjpcIlxcdTAwRDdcIixcIlVhY3V0ZVwiOlwiXFx1MDBEQVwiLFwidWFjdXRlXCI6XCJcXHUwMEZBXCIsXCJVY2lyY1wiOlwiXFx1MDBEQlwiLFwidWNpcmNcIjpcIlxcdTAwRkJcIixcIlVncmF2ZVwiOlwiXFx1MDBEOVwiLFwidWdyYXZlXCI6XCJcXHUwMEY5XCIsXCJ1bWxcIjpcIlxcdTAwQThcIixcIlV1bWxcIjpcIlxcdTAwRENcIixcInV1bWxcIjpcIlxcdTAwRkNcIixcIllhY3V0ZVwiOlwiXFx1MDBERFwiLFwieWFjdXRlXCI6XCJcXHUwMEZEXCIsXCJ5ZW5cIjpcIlxcdTAwQTVcIixcInl1bWxcIjpcIlxcdTAwRkZcIn1cbiAgfSx7fV0sMTQ6W2Z1bmN0aW9uKGR5bmFtaWNSZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHM9e1wiYW1wXCI6XCImXCIsXCJhcG9zXCI6XCInXCIsXCJndFwiOlwiPlwiLFwibHRcIjpcIjxcIixcInF1b3RcIjpcIlxcXCJcIn1cblxuICB9LHt9XSxcImZhc3QtaHRtbC1wYXJzZXJcIjpbZnVuY3Rpb24oZHluYW1pY1JlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuICBkeW5hbWljUmVxdWlyZSgnYXBvbGxvanMnKTtcblxuICB2YXIgZW50aXRpZXMgPSBkeW5hbWljUmVxdWlyZSgnZW50aXRpZXMnKTtcblxuICAvKipcbiAgICogTm9kZSBDbGFzcyBhcyBiYXNlIGNsYXNzIGZvciBUZXh0Tm9kZSBhbmQgSFRNTEVsZW1lbnQuXG4gICAqL1xuICBmdW5jdGlvbiBOb2RlKCkge1xuXG4gIH1cbiAgJGRlY2xhcmUoTm9kZSwge1xuXG4gIH0pO1xuICAkZGVmZW51bShOb2RlLCB7XG4gICAgRUxFTUVOVF9OT0RFOiAgMSxcbiAgICBURVhUX05PREU6ICAgICAzXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBUZXh0Tm9kZSB0byBjb250YWluIGEgdGV4dCBlbGVtZW50IGluIERPTSB0cmVlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZnVuY3Rpb24gVGV4dE5vZGUodmFsdWUpIHtcbiAgICB0aGlzLm5vZGVWYWx1ZSA9IGVudGl0aWVzLmRlY29kZUhUTUw1KHZhbHVlKTtcbiAgICB0aGlzLm5vZGVOYW1lID0gJyN0ZXh0JztcbiAgICB0aGlzLmVsZW1lbnQgPSBwb29scy51dWlkLmdldCgpO1xuICB9XG4gICRpbmhlcml0KFRleHROb2RlLCBOb2RlLCB7XG4gICAgLyoqXG4gICAgICogTm9kZSBUeXBlIGRlY2xhcmF0aW9uLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgbm9kZVR5cGU6IE5vZGUuVEVYVF9OT0RFLFxuXG4gICAgLyoqXG4gICAgICogR2V0IHVuZXNjYXBlZCB0ZXh0IHZhbHVlIG9mIGN1cnJlbnQgbm9kZSBhbmQgaXRzIGNoaWxkcmVuLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gdGV4dCBjb250ZW50XG4gICAgICovXG4gICAgZ2V0IHRleHQoKSB7XG4gICAgICByZXR1cm4gZW50aXRpZXMuZGVjb2RlSFRNTDUodGhpcy5yYXdUZXh0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIHRoZSBub2RlIGNvbnRhaW5zIG9ubHkgd2hpdGUgc3BhY2UuXG4gICAgICogQHJldHVybiB7Ym9vbH1cbiAgICAgKi9cbiAgICBnZXQgaXNXaGl0ZXNwYWNlKCkge1xuICAgICAgcmV0dXJuIC9eKFxcc3wmbmJzcDspKiQvLnRlc3QodGhpcy5ub2RlVmFsdWUpO1xuICAgIH1cblxuICB9KTtcblxuICB2YXIga0Jsb2NrRWxlbWVudHMgPSB7XG4gICAgZGl2OiB0cnVlLFxuICAgIHA6IHRydWUsXG4gICAgLy8gdWw6IHRydWUsXG4gICAgLy8gb2w6IHRydWUsXG4gICAgbGk6IHRydWUsXG4gICAgLy8gdGFibGU6IHRydWUsXG4gICAgLy8gdHI6IHRydWUsXG4gICAgdGQ6IHRydWUsXG4gICAgc2VjdGlvbjogdHJ1ZSxcbiAgICBicjogdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBIVE1MRWxlbWVudCwgd2hpY2ggY29udGFpbnMgYSBzZXQgb2YgY2hpbGRyZW4uXG4gICAqIE5vdGU6IHRoaXMgaXMgYSBtaW5pbWFsaXN0IGltcGxlbWVudGF0aW9uLCBubyBjb21wbGV0ZSB0cmVlXG4gICAqICAgc3RydWN0dXJlIHByb3ZpZGVkIChubyBwYXJlbnROb2RlLCBuZXh0U2libGluZyxcbiAgICogICBwcmV2aW91c1NpYmxpbmcgZXRjKS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgICAgIG5vZGVOYW1lXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBrZXlBdHRycyBpZCBhbmQgY2xhc3MgYXR0cmlidXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByYXdBdHRycyBhdHRyaWJ1dGVzIGluIHN0cmluZ1xuICAgKi9cbiAgZnVuY3Rpb24gSFRNTEVsZW1lbnQobmFtZSwga2V5QXR0cnMsIHJhd0F0dHJzKSB7XG4gICAgdGhpcy5ub2RlTmFtZSA9IG5hbWU7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG5cbiAgICBpZiAocmF3QXR0cnMpIHtcbiAgICAgIHZhciByZSA9IC9cXGIoW2Etel1bYS16MC05XFwtXSopXFxzKj1cXHMqKFwiKFteXCJdKylcInwnKFteJ10rKSd8KFxcUyspKS9pZztcblxuICAgICAgZm9yICh2YXIgbWF0Y2g7IG1hdGNoID0gcmUuZXhlYyhyYXdBdHRycyk7ICkge1xuICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICBhdHRyLm5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHRyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGlzLnBhcmVudE5vZGUgPSBudWxsO1xuICAgIHRoaXMuY2hpbGROb2RlcyA9IFtdO1xuICAgIHRoaXMuZWxlbWVudCA9IHBvb2xzLnV1aWQuZ2V0KCk7XG4gIH1cbiAgJGluaGVyaXQoSFRNTEVsZW1lbnQsIE5vZGUsIHtcblxuICAgIC8qKlxuICAgICAqIE5vZGUgVHlwZSBkZWNsYXJhdGlvbi5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIG5vZGVUeXBlOiBOb2RlLkVMRU1FTlRfTk9ERSxcblxuICAgIC8qKlxuICAgICAqIEdldCB1bmVzY2FwZWQgdGV4dCB2YWx1ZSBvZiBjdXJyZW50IG5vZGUgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRleHQgY29udGVudFxuICAgICAqL1xuICAgIGdldCB0ZXh0KCkge1xuICAgICAgcmV0dXJuIGVudGl0aWVzLmRlY29kZUhUTUw1KHRoaXMucmF3VGV4dCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBlc2NwYWVkIChhcy1pdCkgdGV4dCB2YWx1ZSBvZiBjdXJyZW50IG5vZGUgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRleHQgY29udGVudFxuICAgICAqL1xuICAgIGdldCByYXdUZXh0KCkge1xuICAgICAgdmFyIHJlcyA9ICcnO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHJlcyArPSB0aGlzLmNoaWxkTm9kZXNbaV0ucmF3VGV4dDtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB3aGl0ZXNwYWNlcyBpbiB0aGlzIHN1YiB0cmVlLlxuICAgICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBwb2ludGVyIHRvIHRoaXNcbiAgICAgKi9cbiAgICByZW1vdmVXaGl0ZXNwYWNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gMCwgbyA9IDA7XG4gICAgICBmb3IgKDsgaSA8IHRoaXMuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgaWYgKG5vZGUuaXNXaGl0ZXNwYWNlKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZS50cmltKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBub2RlLnJlbW92ZVdoaXRlc3BhY2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoaWxkTm9kZXNbbysrXSA9IG5vZGU7XG4gICAgICB9XG4gICAgICB0aGlzLmNoaWxkTm9kZXMubGVuZ3RoID0gbztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSk7XG4gICRkZWZpbmUoSFRNTEVsZW1lbnQsIHtcbiAgICBfX3dyYXA6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5jaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5yYXdUZXh0KSB7XG4gICAgICAgICAgJHdyYXAobm9kZSwgVGV4dE5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICR3cmFwKG5vZGUsIEhUTUxFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogQ2FjaGUgdG8gc3RvcmUgZ2VuZXJhdGVkIG1hdGNoIGZ1bmN0aW9uc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdmFyIHBNYXRjaEZ1bmN0aW9uQ2FjaGUgPSB7fTtcblxuICAvKipcbiAgICogTWF0Y2hlciBjbGFzcyB0byBtYWtlIENTUyBtYXRjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgU2VsZWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uIE1hdGNoZXIoc2VsZWN0b3IpIHtcbiAgICB0aGlzLm1hdGNoZXJzID0gc2VsZWN0b3Iuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24obWF0Y2hlcikge1xuICAgICAgaWYgKHBNYXRjaEZ1bmN0aW9uQ2FjaGVbbWF0Y2hlcl0pXG4gICAgICAgIHJldHVybiBwTWF0Y2hGdW5jdGlvbkNhY2hlW21hdGNoZXJdO1xuICAgICAgdmFyIHBhcnRzID0gbWF0Y2hlci5zcGxpdCgnLicpO1xuICAgICAgdmFyIG5vZGVOYW1lID0gcGFydHNbMF07XG4gICAgICB2YXIgY2xhc3NlcyA9IHBhcnRzLnNsaWNlKDEpLnNvcnQoKTtcbiAgICAgIHZhciBzb3VyY2UgPSAnJztcbiAgICAgIGlmIChub2RlTmFtZSAmJiBub2RlTmFtZSAhPSAnKicpIHtcbiAgICAgICAgaWYgKG5vZGVOYW1lWzBdID09ICcjJylcbiAgICAgICAgICBzb3VyY2UgKz0gJ2lmIChlbC5pZCAhPSAnICsgSlNPTi5zdHJpbmdpZnkobm9kZU5hbWUuc3Vic3RyKDEpKSArICcpIHJldHVybiBmYWxzZTsnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc291cmNlICs9ICdpZiAoZWwubm9kZU5hbWUgIT0gJyArIEpTT04uc3RyaW5naWZ5KG5vZGVOYW1lKSArICcpIHJldHVybiBmYWxzZTsnO1xuICAgICAgfVxuICAgICAgaWYgKGNsYXNzZXMubGVuZ3RoID4gMClcbiAgICAgICAgc291cmNlICs9ICdmb3IgKHZhciBjbHMgPSAnICsgSlNPTi5zdHJpbmdpZnkoY2xhc3NlcykgKyAnLCBpID0gMDsgaSA8IGNscy5sZW5ndGg7IGkrKykgaWYgKGVsLmNsYXNzTmFtZXMuaW5kZXhPZihjbHNbaV0pID09PSAtMSkgcmV0dXJuIGZhbHNlOyc7XG4gICAgICBzb3VyY2UgKz0gJ3JldHVybiB0cnVlOyc7XG4gICAgICByZXR1cm4gcE1hdGNoRnVuY3Rpb25DYWNoZVttYXRjaGVyXSA9IG5ldyBGdW5jdGlvbignZWwnLCBzb3VyY2UpO1xuICAgIH0pO1xuICAgIHRoaXMubmV4dE1hdGNoID0gMDtcbiAgfVxuICAkZGVjbGFyZShNYXRjaGVyLCB7XG4gICAgLyoqXG4gICAgICogVHJ5aW5nIHRvIGFkdmFuY2UgbWF0Y2ggcG9pbnRlclxuICAgICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCBlbGVtZW50IHRvIG1ha2UgdGhlIG1hdGNoXG4gICAgICogQHJldHVybiB7Ym9vbH0gICAgICAgICAgIHRydWUgd2hlbiBwb2ludGVyIGFkdmFuY2VkLlxuICAgICAqL1xuICAgIGFkdmFuY2U6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAodGhpcy5uZXh0TWF0Y2ggPCB0aGlzLm1hdGNoZXJzLmxlbmd0aCAmJlxuICAgICAgICAgIHRoaXMubWF0Y2hlcnNbdGhpcy5uZXh0TWF0Y2hdKGVsKSkge1xuICAgICAgICB0aGlzLm5leHRNYXRjaCsrO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJld2luZCB0aGUgbWF0Y2ggcG9pbnRlclxuICAgICAqL1xuICAgIHJld2luZDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm5leHRNYXRjaC0tO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVHJ5aW5nIHRvIGRldGVybWluZSBpZiBtYXRjaCBtYWRlLlxuICAgICAqIEByZXR1cm4ge2Jvb2x9IHRydWUgd2hlbiB0aGUgbWF0Y2ggaXMgbWFkZVxuICAgICAqL1xuICAgIGdldCBtYXRjaGVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dE1hdGNoID09IHRoaXMubWF0Y2hlcnMubGVuZ3RoO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmVzdCBtYXRjaCBwb2ludGVyLlxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubmV4dE1hdGNoID0gMDtcbiAgICB9XG4gIH0pO1xuICAkZGVmaW5lKE1hdGNoZXIsIHtcbiAgICAvKipcbiAgICAgKiBmbHVzaCBjYWNoZSB0byBmcmVlIG1lbW9yeVxuICAgICAqL1xuICAgIGZsdXNoQ2FjaGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcE1hdGNoRnVuY3Rpb25DYWNoZSA9IHt9O1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGtNYXJrdXBQYXR0ZXJuID0gLzwhLS1bXl0qPyg/PS0tPiktLT58PChcXC8/KShbYS16XVthLXowLTldKilcXHMqKFtePl0qPykoXFwvPyk+L2lnO1xuICB2YXIga0F0dHJpYnV0ZVBhdHRlcm4gPSAvXFxiKGlkfGNsYXNzKVxccyo9XFxzKihcIihbXlwiXSspXCJ8JyhbXiddKyknfChcXFMrKSkvaWc7XG4gIHZhciBrU2VsZkNsb3NpbmdFbGVtZW50cyA9IHtcbiAgICBtZXRhOiB0cnVlLFxuICAgIGltZzogdHJ1ZSxcbiAgICBsaW5rOiB0cnVlLFxuICAgIGlucHV0OiB0cnVlLFxuICAgIGFyZWE6IHRydWUsXG4gICAgYnI6IHRydWUsXG4gICAgaHI6IHRydWVcbiAgfTtcbiAgdmFyIGtFbGVtZW50c0Nsb3NlZEJ5T3BlbmluZyA9IHtcbiAgICBsaToge2xpOiB0cnVlfSxcbiAgICBwOiB7cDogdHJ1ZSwgZGl2OiB0cnVlfSxcbiAgICB0ZDoge3RkOiB0cnVlLCB0aDogdHJ1ZX0sXG4gICAgdGg6IHt0ZDogdHJ1ZSwgdGg6IHRydWV9XG4gIH07XG4gIHZhciBrRWxlbWVudHNDbG9zZWRCeUNsb3NpbmcgPSB7XG4gICAgbGk6IHt1bDogdHJ1ZSwgb2w6IHRydWV9LFxuICAgIGE6IHtkaXY6IHRydWV9LFxuICAgIGI6IHtkaXY6IHRydWV9LFxuICAgIGk6IHtkaXY6IHRydWV9LFxuICAgIHA6IHtkaXY6IHRydWV9LFxuICAgIHRkOiB7dHI6IHRydWUsIHRhYmxlOiB0cnVlfSxcbiAgICB0aDoge3RyOiB0cnVlLCB0YWJsZTogdHJ1ZX1cbiAgfTtcbiAgdmFyIGtCbG9ja1RleHRFbGVtZW50cyA9IHtcbiAgICBzY3JpcHQ6IHRydWUsXG4gICAgbm9zY3JpcHQ6IHRydWUsXG4gICAgc3R5bGU6IHRydWUsXG4gICAgcHJlOiB0cnVlXG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBIVE1MIGFuZCByZXR1cm5zIGEgcm9vdCBlbGVtZW50XG4gICAqL1xuICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIE1hdGNoZXI6IE1hdGNoZXIsXG4gICAgTm9kZTogTm9kZSxcbiAgICBIVE1MRWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgVGV4dE5vZGU6IFRleHROb2RlLFxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYSBjaHVjayBvZiBIVE1MIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgICAgICBodG1sXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgcm9vdCBlbGVtZW50XG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uKGRhdGEsIG9wdGlvbnMpIHtcblxuICAgICAgdmFyIHJvb3QgPSBuZXcgSFRNTEVsZW1lbnQobnVsbCwge30pO1xuICAgICAgdmFyIGN1cnJlbnRQYXJlbnQgPSByb290O1xuICAgICAgdmFyIHN0YWNrID0gW3Jvb3RdO1xuICAgICAgdmFyIGxhc3RUZXh0UG9zID0gLTE7XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBmb3IgKHZhciBtYXRjaCwgdGV4dDsgbWF0Y2ggPSBrTWFya3VwUGF0dGVybi5leGVjKGRhdGEpOyApIHtcbiAgICAgICAgaWYgKGxhc3RUZXh0UG9zID4gLTEpIHtcbiAgICAgICAgICBpZiAobGFzdFRleHRQb3MgKyBtYXRjaFswXS5sZW5ndGggPCBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIGlmIGhhcyBjb250ZW50XG4gICAgICAgICAgICB0ZXh0ID0gZGF0YS5zdWJzdHJpbmcobGFzdFRleHRQb3MsIGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCAtIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICBpZiAodGV4dC50cmltKCkpIHtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnI3RleHQnLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IHBvb2xzLnV1aWQuZ2V0KCksXG4gICAgICAgICAgICAgICAgbm9kZVZhbHVlOiBlbnRpdGllcy5kZWNvZGVIVE1MNSh0ZXh0KVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXg7XG4gICAgICAgIGlmIChtYXRjaFswXVsxXSA9PSAnIScpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIGEgY29tbWVudFxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmxvd2VyQ2FzZVRhZ05hbWUpXG4gICAgICAgICAgbWF0Y2hbMl0gPSBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIW1hdGNoWzFdKSB7XG4gICAgICAgICAgLy8gbm90IDwvIHRhZ3NcbiAgICAgICAgICB2YXIgYXR0cnMgPSB7fTtcbiAgICAgICAgICBmb3IgKHZhciBhdHRNYXRjaDsgYXR0TWF0Y2ggPSBrQXR0cmlidXRlUGF0dGVybi5leGVjKG1hdGNoWzNdKTsgKVxuICAgICAgICAgICAgYXR0cnNbYXR0TWF0Y2hbMV1dID0gYXR0TWF0Y2hbM10gfHwgYXR0TWF0Y2hbNF0gfHwgYXR0TWF0Y2hbNV07XG4gICAgICAgICAgaWYgKCFtYXRjaFs0XSAmJiBrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV1bbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2suYmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMucHVzaChcbiAgICAgICAgICAgICAgbmV3IEhUTUxFbGVtZW50KG1hdGNoWzJdLCBhdHRycywgbWF0Y2hbM10pKSAtIDFdO1xuICAgICAgICAgIHN0YWNrLnB1c2goY3VycmVudFBhcmVudCk7XG4gICAgICAgICAgaWYgKGtCbG9ja1RleHRFbGVtZW50c1ttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgIC8vIGEgbGl0dGxlIHRlc3QgdG8gZmluZCBuZXh0IDwvc2NyaXB0PiBvciA8L3N0eWxlPiAuLi5cbiAgICAgICAgICAgIHZhciBjbG9zZU1hcmt1cCA9ICc8LycgKyBtYXRjaFsyXSArICc+JztcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGRhdGEuaW5kZXhPZihjbG9zZU1hcmt1cCwga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4KTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGVyZSBpcyBubyBtYXRjaGluZyBlbmRpbmcgZm9yIHRoZSB0ZXh0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgdGV4dCA9IGRhdGEuc3Vic3RyKGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGRhdGEuc3Vic3RyaW5nKGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCwgaW5kZXgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbm9kZVZhbHVlOiBlbnRpdGllcy5kZWNvZGVIVE1MNSh0ZXh0KSxcbiAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnI3RleHQnLFxuICAgICAgICAgICAgICAgICAgZWxlbWVudDogcG9vbHMudXVpZC5nZXQoKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4ID0gZGF0YS5sZW5ndGggKyAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXggPSBpbmRleCArIGNsb3NlTWFya3VwLmxlbmd0aDtcbiAgICAgICAgICAgICAgbWF0Y2hbMV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbMV0gfHwgbWF0Y2hbNF0gfHxcbiAgICAgICAgICAgIGtTZWxmQ2xvc2luZ0VsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgIC8vIDwvIG9yIC8+IG9yIDxicj4gZXRjLlxuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFBhcmVudC5ub2RlTmFtZSA9PSBtYXRjaFsyXSkge1xuICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrLmJhY2s7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIGNsb3NlIGN1cnJlbnQgdGFnLCBhbmQgbW92ZSBvblxuICAgICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtFbGVtZW50c0Nsb3NlZEJ5Q2xvc2luZ1tjdXJyZW50UGFyZW50Lm5vZGVOYW1lXVttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrLmJhY2s7XG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gVXNlIGFnZ3Jlc3NpdmUgc3RyYXRlZ3kgdG8gaGFuZGxlIHVubWF0Y2hpbmcgbWFya3Vwcy5cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb290O1xuXG4gICAgfVxuXG4gIH07XG5cbiAgfSx7XCJhcG9sbG9qc1wiOjYsXCJlbnRpdGllc1wiOjd9XX0se30sW10pKFwiZmFzdC1odG1sLXBhcnNlclwiKVxuICB9KTtcblxuICByZXR1cm4gZy5odG1sUGFyc2VyO1xufTtcbiIsInZhciBwb29scyA9IGV4cG9ydHM7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4vdXVpZCcpO1xuXG5mdW5jdGlvbiBjcmVhdGVQb29sKHNpemUsIG5hbWUsIGZpbGwpIHtcbiAgdmFyIGZyZWUgPSBbXTtcbiAgdmFyIGFsbG9jYXRlZCA9IFtdO1xuICB2YXIgaW5kZXggPSBuZXcgV2Vha01hcCgpO1xuXG4gIC8vIFByaW1lIHRoZSBjYWNoZSB3aXRoIG4gb2JqZWN0cy5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBmcmVlW2ldID0gZmlsbCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfZnJlZTogZnJlZSxcbiAgICBfYWxsb2NhdGVkOiBhbGxvY2F0ZWQsXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IG51bGw7XG4gICAgICB2YXIgZnJlZUxlbmd0aCA9IGZyZWUubGVuZ3RoO1xuICAgICAgdmFyIG1pbnVzT25lID0gZnJlZUxlbmd0aCAtIDE7XG5cbiAgICAgIGlmIChmcmVlTGVuZ3RoKSB7XG4gICAgICAgIG9iaiA9IGZyZWVbbWludXNPbmVdO1xuICAgICAgICBmcmVlLmxlbmd0aCA9IG1pbnVzT25lO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG9iaiA9IGZpbGwoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlkeCA9IGFsbG9jYXRlZC5wdXNoKG9iaik7XG5cbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgICAgICBpbmRleFtvYmpdID0gaWR4O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGluZGV4LnNldChvYmosIGlkeCAtIDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICBmcmVlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhbGxvY2F0ZWRMZW5ndGggPSBhbGxvY2F0ZWQubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbG9jYXRlZExlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBvYmogPSBhbGxvY2F0ZWRbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdmFyIGlkeCA9IGluZGV4W29ial07XG4gICAgICAgICAgZGVsZXRlIGluZGV4W29ial07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGlkeCA9IGluZGV4LmdldChvYmopO1xuICAgICAgICAgIC8vIFJlbW92ZSBmcm9tIGluZGV4IG1hcC5cbiAgICAgICAgICBpbmRleC5kZWxldGUob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlkeCA9IGlkeCB8fCAtMTtcblxuICAgICAgICAvLyBBbHJlYWR5IGZyZWVkLlxuICAgICAgICBpZiAoaWR4ID09PSAtMSkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgIC8vIENsZWFuLlxuICAgICAgICBpZiAob2JqLmxlbmd0aCkge1xuICAgICAgICAgIG9iai5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9ubHkgcHV0IGJhY2sgaW50byB0aGUgZnJlZSBxdWV1ZSBpZiB3ZSdyZSB1bmRlciB0aGUgc2l6ZS5cbiAgICAgICAgZnJlZS5wdXNoKG9iaik7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBmcmVlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgaWR4ID0gaW5kZXhbb2JqXTtcbiAgICAgICAgZGVsZXRlIGluZGV4W29ial07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGlkeCA9IGluZGV4LmdldChvYmopO1xuICAgICAgICAvLyBSZW1vdmUgZnJvbSBpbmRleCBtYXAuXG4gICAgICAgIGluZGV4LmRlbGV0ZShvYmopO1xuICAgICAgfVxuXG4gICAgICBpZHggPSBpZHggfHwgLTE7XG5cbiAgICAgIC8vIEFscmVhZHkgZnJlZWQuXG4gICAgICBpZiAoaWR4ID09PSAtMSkgeyByZXR1cm47IH1cblxuICAgICAgLy8gQ2xlYW4uXG4gICAgICBpZiAob2JqLmxlbmd0aCkge1xuICAgICAgICBvYmoubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgb2JqW2tleV0gPSB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT25seSBwdXQgYmFjayBpbnRvIHRoZSBmcmVlIHF1ZXVlIGlmIHdlJ3JlIHVuZGVyIHRoZSBzaXplLlxuICAgICAgaWYgKGZyZWUubGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgICBmcmVlLnB1c2gob2JqKTtcbiAgICAgIH1cblxuICAgICAgYWxsb2NhdGVkLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBpbml0aWFsaXplUG9vbHMoQ09VTlQpIHtcbiAgcG9vbHMub2JqZWN0ID0gY3JlYXRlUG9vbChDT1VOVCwgJ29iamVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSk7XG5cbiAgcG9vbHMuYXJyYXkgPSBjcmVhdGVQb29sKENPVU5ULCAnYXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW107XG4gIH0pO1xuXG4gIHBvb2xzLnV1aWQgPSBjcmVhdGVQb29sKENPVU5ULCAndXVpZCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB1dWlkKCk7XG4gIH0pO1xufVxuXG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZVBvb2w7XG5leHBvcnRzLmluaXRpYWxpemUgPSBpbml0aWFsaXplUG9vbHM7XG4iLCIvKipcbiAqIEdlbmVyYXRlcyBhIHV1aWQuXG4gKlxuICogQHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzLzI4MjE3NVxuICogQHJldHVybiB7c3RyaW5nfSB1dWlkXG4gKi9cbmZ1bmN0aW9uIHV1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiIsImZ1bmN0aW9uIHN0YXJ0dXAod29ya2VyKSB7XG4gIHZhciBvbGRUcmVlID0gbnVsbDtcbiAgdmFyIHBhdGNoZXMgPSBbXTtcblxuICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgIC8vY29uc29sZS50aW1lKCdyZW5kZXInKTtcbiAgICB2YXIgZGF0YSA9IGUuZGF0YTtcbiAgICB2YXIgb2Zmc2V0ID0gZGF0YS5vZmZzZXQ7XG4gICAgdmFyIHRyYW5zZmVyQnVmZmVyID0gZGF0YS5idWZmZXI7XG4gICAgdmFyIGlzSW5uZXIgPSBkYXRhLmlzSW5uZXI7XG5cbiAgICB2YXIgbmV3QnVmZmVyID0gdHJhbnNmZXJCdWZmZXIuc2xpY2UoMCwgb2Zmc2V0KTtcbiAgICB2YXIgbmV3SFRNTCA9IGJ1ZmZlclRvU3RyaW5nKG5ld0J1ZmZlcik7XG5cbiAgICBpZiAob2Zmc2V0ICYmICFvbGRUcmVlKSB7XG4gICAgICAvLyBLZWVwIGEgdmlydHVhbCB0cmVlIGluIG1lbW9yeSB0byBkaWZmIGFnYWluc3QuXG4gICAgICBvbGRUcmVlID0gZS5kYXRhLm9sZFRyZWU7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIGEgbmV3IHRyZWUuXG4gICAgLy9jb25zb2xlLnRpbWUoJ3BhcnNlJyk7XG4gICAgdmFyIG5ld1RyZWUgPSBwYXJzZUhUTUwobmV3SFRNTCk7XG4gICAgLy9jb25zb2xlLnRpbWVFbmQoJ3BhcnNlJyk7XG5cbiAgICAvLyBTeW5jaHJvbml6ZSB0aGUgb2xkIHZpcnR1YWwgdHJlZSB3aXRoIHRoZSBuZXcgdmlydHVhbCB0cmVlLiAgVGhpcyB3aWxsXG4gICAgLy8gcHJvZHVjZSBhIHNlcmllcyBvZiBwYXRjaGVzIHRoYXQgd2lsbCBiZSBleGN1dGVkIHRvIHVwZGF0ZSB0aGUgRE9NLlxuICAgIC8vY29uc29sZS50aW1lKCdzeW5jJyk7XG4gICAgc3luY05vZGUuY2FsbChwYXRjaGVzLCBvbGRUcmVlLCBuZXdUcmVlKTtcbiAgICAvL2NvbnNvbGUudGltZUVuZCgnc3luYycpO1xuXG4gICAgLy8gQXR0YWNoIGlubmVyIHN0YXRlLlxuICAgIHBhdGNoZXMuaXNJbm5lciA9IGlzSW5uZXI7XG5cbiAgICAvLyBTZW5kIHRoZSBwYXRjaGVzIGJhY2sgdG8gdGhlIHVzZXJsYW5kLlxuICAgIHdvcmtlci5wb3N0TWVzc2FnZShwYXRjaGVzKTtcblxuICAgIC8vIEZyZWUgdGhlIG5ldyB0cmVlLCBhcyB0aGlzIG5vZGUgd2lsbCBuZXZlciBjaGFuZ2UuXG4gICAgLy9jb25zb2xlLnRpbWUoJ2NsZWFuJyk7XG4gICAgLy9jb25zb2xlLmxvZyhwb29scy51dWlkLl9hbGxvY2F0ZWQubGVuZ3RoKTtcblxuICAgIC8vIENsZWFudXAgc3luYyBub2RlIGFsbG9jYXRpb25zLlxuICAgIHBvb2xzLnV1aWQuZnJlZUFsbCgpO1xuICAgIHBvb2xzLm9iamVjdC5mcmVlQWxsKCk7XG4gICAgcG9vbHMuYXJyYXkuZnJlZUFsbCgpO1xuXG4gICAgLy9jb25zb2xlLnRpbWVFbmQoJ2NsZWFuJyk7XG4gICAgLy9jb25zb2xlLmluZm8oJ09iamVjdHMgZnJlZTogJXMnLCBwb29scy5hcnJheS5fZnJlZS5sZW5ndGgpO1xuICAgIC8vY29uc29sZS5pbmZvKCdBcnJheXMgYWxsb2NhdGVkOiAlbycsIHBvb2xzLmFycmF5Ll9hbGxvY2F0ZWQpO1xuICAgIC8vY29uc29sZS5pbmZvKCdPYmplY3RzIGFsbG9jYXRlZDogJW8nLCBwb29scy5vYmplY3QuX2FsbG9jYXRlZCk7XG4gICAgLy9jb25zb2xlLmluZm8oJ1VVSURzIGFsbG9jYXRlZDogJW8nLCBwb29scy51dWlkLl9hbGxvY2F0ZWQpO1xuXG4gICAgLy8gV2lwZSBvdXQgdGhlIHBhdGNoZXMgaW4gbWVtb3J5LlxuICAgIHBhdGNoZXMubGVuZ3RoID0gMDtcbiAgICAvL2NvbnNvbGUudGltZUVuZCgncmVuZGVyJyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhcnR1cDtcbiJdfQ==
