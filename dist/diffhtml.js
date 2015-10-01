(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = get;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodeMake = _dereq_('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

var _elementMake = _dereq_('../element/make');

var _elementMake2 = _interopRequireDefault(_elementMake);

/**
 * Takes in an element reference and resolve it to a uuid and DOM node.
 *
 * @param ref - Element descriptor
 * @return {Object} containing the uuid and DOM node.
 */

function get(ref) {
  var uuid = ref.element || ref;
  var element = _nodeMake2['default'].nodes[uuid] || (0, _elementMake2['default'])(ref);

  return { element: element, uuid: uuid };
}

module.exports = exports['default'];

},{"../element/make":2,"../node/make":5}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = make;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _svg = _dereq_('../svg');

var svg = _interopRequireWildcard(_svg);

var _nodeMake = _dereq_('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

/**
 * Takes in a virtual descriptor and creates an HTML element. Set's the element
 * into the cache.
 *
 * @param descriptor
 * @return {Element}
 */

function make(descriptor) {
  var element = null;
  var isSvg = false;

  if (descriptor.nodeName === '#text') {
    element = document.createTextNode(descriptor.nodeValue);
  } else {
    if (svg.elements.indexOf(descriptor.nodeName) > -1) {
      isSvg = true;
      element = document.createElementNS(svg.namespace, descriptor.nodeName);
    } else {
      element = document.createElement(descriptor.nodeName);
    }

    if (descriptor.attributes && descriptor.attributes.length) {
      for (var i = 0; i < descriptor.attributes.length; i++) {
        var attribute = descriptor.attributes[i];
        element.setAttribute(attribute.name, attribute.value);
      }
    }

    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (var i = 0; i < descriptor.childNodes.length; i++) {
        element.appendChild(make(descriptor.childNodes[i]));
      }
    }
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _nodeMake2['default'].nodes[descriptor.element] = element;

  return element;
}

module.exports = exports['default'];

},{"../node/make":5,"../svg":9}],3:[function(_dereq_,module,exports){
/**
 * Identifies an error with transitions.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TransitionStateError = (function (_Error) {
  _inherits(TransitionStateError, _Error);

  function TransitionStateError(message) {
    _classCallCheck(this, TransitionStateError);

    _get(Object.getPrototypeOf(TransitionStateError.prototype), "constructor", this).call(this);

    this.message = message;
  }

  return TransitionStateError;
})(Error);

exports.TransitionStateError = TransitionStateError;

},{}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.enableProllyfill = enableProllyfill;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodePatch = _dereq_('./node/patch');

var _nodePatch2 = _interopRequireDefault(_nodePatch);

var _transitions = _dereq_('./transitions');

// We export the TransitionStateError constructor so that instanceof checks can
// be made by those publicly consuming this library.

var _errors = _dereq_('./errors');

Object.defineProperty(exports, 'TransitionStateError', {
  enumerable: true,
  get: function get() {
    return _errors.TransitionStateError;
  }
});

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents.  Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @param element
 * @param markup=''
 * @param options={}
 */

function outerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = false;
  (0, _nodePatch2['default'])(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents.  This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @param element
 * @param markup=''
 * @param options={}
 * @return
 */

function innerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = true;
  (0, _nodePatch2['default'])(element, markup, options);
}

/**
 * Used to diff two elements.  The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior.  By default it is
 * outerHTML.
 *
 * @param element
 * @param newElement
 * @param options={}
 * @return
 */

function element(element, newElement) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  (0, _nodePatch2['default'])(element, newElement, options);
}

/**
 * Adds a global transition listener.  With many elements this could be an
 * expensive operation, so try to limit the amount of listeners added if you're
 * concerned about performance.
 *
 * Since the callback triggers with various elements, most of which you
 * probably don't care about, you'll want to filter.  A good way of filtering
 * is to use the DOM `matches` method.  It's fairly well supported
 * (http://caniuse.com/#feat=matchesselector) and may suit many projects.  If
 * you need backwards compatibility, consider using jQuery's `is`.
 *
 * You can do fun, highly specific, filters:
 *
 * addTransitionState('attached', function(element) {
 *   // Fade in the main container after it's added.
 *   if (element.matches('body main.container')) {
 *     $(element).stop(true, true).fadeIn();
 *   }
 * });
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */

function addTransitionState(state, callback) {
  if (!state) {
    throw new _errors.TransitionStateError('Missing transition state name');
  }

  if (!callback) {
    throw new _errors.TransitionStateError('Missing transition state callback');
  }

  // Not a valid state name.
  if (Object.keys(_transitions.transitionStates).indexOf(state) === -1) {
    throw new _errors.TransitionStateError('Invalid state name: ' + state);
  }

  _transitions.transitionStates[state].push(callback);
}

/**
 * Removes a global transition listener.
 *
 * When invoked with no arguments, this method will remove all transition
 * callbacks.  When invoked with the name argument it will remove all
 * transition state callbacks matching the name, and so on for the callback.
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */

function removeTransitionState(state, callback) {
  if (!callback && state) {
    _transitions.transitionStates[state].length = 0;
  } else if (state && callback) {
    // Not a valid state name.
    if (Object.keys(_transitions.transitionStates).indexOf(state) === -1) {
      throw new _errors.TransitionStateError('Invalid state name ' + state);
    }

    var index = _transitions.transitionStates[state].indexOf(callback);
    _transitions.transitionStates[state].splice(index, 1);
  } else {
    for (var _state in _transitions.transitionStates) {
      _transitions.transitionStates[_state].length = 0;
    }
  }
}

/**
 * By calling this function your browser environment is enhanced globally. This
 * project would love to hit the standards track and allow all developers to
 * benefit from the performance gains of DOM diffing.
 */

function enableProllyfill() {
  // Exposes the `TransitionStateError` constructor globally so that developers
  // can instanceof check exception errors.
  Object.defineProperty(window, 'TransitionStateError', {
    configurable: true,

    value: _errors.TransitionStateError
  });

  // Allows a developer to add transition state callbacks.
  Object.defineProperty(document, 'addTransitionState', {
    configurable: true,

    value: function value(state, callback) {
      addTransitionState(state, callback);
    }
  });

  // Allows a developer to remove transition state callbacks.
  Object.defineProperty(document, 'removeTransitionState', {
    configurable: true,

    value: function value(state, callback) {
      removeTransitionState(state, callback);
    }
  });

  // Allows a developer to set the `innerHTML` of an element.
  Object.defineProperty(Element.prototype, 'diffInnerHTML', {
    configurable: true,

    set: function set(newHTML) {
      innerHTML(this, newHTML);
    }
  });

  // Allows a developer to set the `outerHTML` of an element.
  Object.defineProperty(Element.prototype, 'diffOuterHTML', {
    configurable: true,

    set: function set(newHTML) {
      outerHTML(this, newHTML);
    }
  });

  // Allows a developer to diff the current element with a new element.
  Object.defineProperty(Element.prototype, 'diffElement', {
    configurable: true,

    value: function value(newElement) {
      element(this, newElement);
    }
  });
}

},{"./errors":3,"./node/patch":6,"./transitions":10}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = make;

var _utilPools = _dereq_('../util/pools');

var _utilProtect = _dereq_('../util/protect');

var pools = _utilPools.pools;
var protectElement = _utilProtect.protectElement;
var unprotectElement = _utilProtect.unprotectElement;

// Cache created nodes inside this object.
make.nodes = {};

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */

function make(node, protect) {
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
  var entry = pools.elementObject.get();

  if (protect) {
    protectElement(entry);
  }

  // Add to internal lookup.
  make.nodes[entry.element] = node;

  entry.nodeName = node.nodeName.toLowerCase();
  entry.nodeValue = nodeValue;
  entry.childNodes.length = 0;
  entry.attributes.length = 0;

  // Collect attributes.
  var attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    var attributesLength = attributes.length;

    if (attributesLength) {
      for (var i = 0; i < attributesLength; i++) {
        var attr = pools.attributeObject.get();

        if (protect) {
          pools.attributeObject.protect(attr);
        }

        attr.name = attributes[i].name;
        attr.value = attributes[i].value;

        entry.attributes[entry.attributes.length] = attr;
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes;
  var childNodesLength = node.childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (node.nodeType !== 3 && childNodes) {
    for (var i = 0; i < childNodesLength; i++) {
      var newNode = make(childNodes[i], protect);

      if (newNode) {
        entry.childNodes[entry.childNodes.length] = newNode;
      }
    }
  }

  return entry;
}

module.exports = exports['default'];

},{"../util/pools":14,"../util/protect":15}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patch;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _customEvent = _dereq_('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _workerCreate = _dereq_('../worker/create');

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _sync = _dereq_('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _utilPools = _dereq_('../util/pools');

var _utilParser = _dereq_('../util/parser');

var _utilBuffers = _dereq_('../util/buffers');

var buffers = _interopRequireWildcard(_utilBuffers);

var _patchesProcess = _dereq_('../patches/process');

var _patchesProcess2 = _interopRequireDefault(_patchesProcess);

var pools = _utilPools.pools;

// Cache prebuilt trees and lookup by element.
var TreeCache = new WeakMap();

function completeWorkerRender(element, elementMeta) {
  return function (ev) {
    (0, _patchesProcess2['default'])(element, ev);

    elementMeta._innerHTML = element.innerHTML;
    elementMeta._outerHTML = element.outerHTML;
    elementMeta._textContent = element.textContent;

    elementMeta.isRendering = false;
    elementMeta.hasRenderedViaWorker = true;

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new _customEvent2['default']('renderComplete'));

    if (elementMeta.renderBuffer) {
      var nextRender = elementMeta.renderBuffer;
      elementMeta.renderBuffer = undefined;
      patch(element, nextRender.newHTML, nextRender.options);
    }
  };
}

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */

function patch(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.enableWorker !== 'boolean') {
    options.enableWorker = document.ENABLE_WORKER;
  }

  var elementMeta = TreeCache.get(element) || {};
  var newOld = false;

  // Always ensure the most up-to-date meta object is stored.
  TreeCache.set(element, elementMeta);

  var worker = elementMeta.worker = elementMeta.worker || (0, _workerCreate.create)();

  if (element.isRendering) {
    elementMeta.renderBuffer = { newHTML: newHTML, options: options };
  }

  if (
  // If already rendering, abort this loop.
  elementMeta.isRendering ||

  // If the operation is `innerHTML`, but the contents haven't changed,
  // abort.
  options.inner && element.innerHTML === newHTML ||

  // If the operation is `outerHTML`, but the contents haven't changed,
  // abort.
  !options.inner && element.outerHTML === newHTML) {
    return;
  }

  if (
  // If the operation is `innerHTML`, and the current element's contents have
  // changed since the last render loop, recalculate the tree.
  options.inner && elementMeta._innerHTML !== element.innerHTML ||

  // If the operation is `outerHTML`, and the current element's contents have
  // changed since the last render loop, recalculate the tree.
  !options.inner && elementMeta._outerHTML !== element.outerHTML ||

  // If the text content ever changes, recalculate the tree.
  elementMeta._textContent !== element.textContent) {
    newOld = true;
    elementMeta.oldTree = (0, _make2['default'])(element, true);
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && _workerCreate.hasWorker && elementMeta.hasRendered) {
    // Attach all properties here to transport.
    var transferObject = {};

    // Attach the parent element's uuid.
    transferObject.uuid = elementMeta.oldTree.element;

    if (newOld || !elementMeta.hasRenderedViaWorker) {
      transferObject.oldTree = elementMeta.oldTree;
    }

    if (typeof newHTML !== 'string') {
      transferObject.newTree = (0, _make2['default'])(newHTML);

      // Set a render lock as to not flood the worker.
      elementMeta.isRendering = true;

      // Transfer this buffer to the worker, which will take over and process the
      // markup.
      worker.postMessage(transferObject);

      // Wait for the worker to finish processing and then apply the patchset.
      worker.onmessage = completeWorkerRender(element, elementMeta);

      return;
    }

    // Used to specify the outerHTML offset if passing the parent's markup.
    var offset = 0;

    // Craft a new buffer with the new contents.
    var newBuffer = buffers.stringToBuffer(newHTML);

    // Set the offset to be this byte length.
    offset = newHTML.length;

    // Calculate the bytelength for the transfer buffer, contains one extra for
    // the offset.
    var transferByteLength = newBuffer.byteLength;

    // This buffer starts with the offset and contains the data to be carried
    // to the worker.
    var transferBuffer = newBuffer;

    // Set the newHTML payload.
    //transferBuffer.set(newBuffer, 0);

    // Add properties to send to worker.
    transferObject.offset = offset;
    transferObject.buffer = transferBuffer.buffer;
    transferObject.isInner = options.inner;

    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject, [transferBuffer.buffer]);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = completeWorkerRender(element, elementMeta);
  } else if (!options.enableWorker || !_workerCreate.hasWorker || !elementMeta.hasRendered) {
    var data = [];
    var newTree = null;

    if (typeof newHTML === 'string') {
      newTree = (0, _utilParser.parseHTML)(newHTML, options.inner);
    } else {
      newTree = (0, _make2['default'])(newHTML);
    }

    if (options.inner) {
      var childNodes = newTree;

      newTree = {
        childNodes: childNodes,

        attributes: elementMeta.oldTree.attributes,
        element: elementMeta.oldTree.element,
        nodeName: elementMeta.oldTree.nodeName,
        nodeValue: elementMeta.oldTree.nodeValue
      };
    }

    var oldTreeName = elementMeta.oldTree.nodeName || '';
    var newNodeName = newTree && newTree.nodeName;

    // If the element node types match, try and compare them.
    if (oldTreeName === newNodeName) {
      // Synchronize the tree.
      _sync2['default'].call(data, elementMeta.oldTree, newTree);
    }
    // Otherwise replace the top level elements.
    else if (newHTML) {
        data[data.length] = {
          __do__: 0,
          old: elementMeta.oldTree,
          'new': newTree
        };

        elementMeta.oldTree = newTree;
      }

    // Process the data immediately.
    (0, _patchesProcess2['default'])(element, { data: data });

    // Mark that this element has initially rendered and is done rendering.
    elementMeta.hasRendered = true;
    elementMeta.isRendering = false;

    // Set the innerHTML.
    elementMeta._innerHTML = element.innerHTML;
    elementMeta._outerHTML = element.outerHTML;
    elementMeta._textContent = element.textContent;

    // Free all memory after each iteration.
    pools.object.freeAll();
    pools.attributeObject.freeAll();
    pools.elementObject.freeAll();

    // Empty out the `make.nodes`.
    for (var uuid in _make2['default'].nodes) {
      // If this is not a protected uuid, remove it.
      if (pools.elementObject._uuid.indexOf(uuid) === -1) {
        delete _make2['default'].nodes[uuid];
      }
    }

    // Clean out the patches array.
    data.length = 0;

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new _customEvent2['default']('renderComplete'));
  }
}

module.exports = exports['default'];

},{"../patches/process":8,"../util/buffers":11,"../util/parser":13,"../util/pools":14,"../worker/create":17,"./make":5,"./sync":7,"custom-event":19}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = sync;

var _utilPools = _dereq_('../util/pools');

var _utilProtect = _dereq_('../util/protect');

var pools = _utilPools.pools;
var protectElement = _utilProtect.protectElement;
var unprotectElement = _utilProtect.unprotectElement;

var slice = Array.prototype.slice;

/**
 * Synchronizes changes from the newTree into the oldTree.
 *
 * @param oldTree
 * @param newTree
 */

function sync(oldTree, newTree) {
  var patches = this;
  var oldChildNodes = oldTree.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  var oldElement = oldTree.element;

  if (!newTree) {
    var removed = oldChildNodes.splice(0, oldChildNodesLength);

    patches[patches.length] = { __do__: -1, element: oldElement };

    for (var i = 0; i < removed.length; i++) {
      unprotectElement(removed[i]);
    }

    return;
  }

  var nodeValue = newTree.nodeValue;
  var childNodes = newTree.childNodes;
  var childNodesLength = childNodes ? childNodes.length : 0;
  var newElement = newTree.element;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (oldTree.nodeName !== newTree.nodeName) {
    return;
  }

  // Replace text node values if they are different.
  if (newTree.nodeName === '#text' && oldTree.nodeName === '#text') {
    // Text changed.
    if (oldTree.nodeValue !== nodeValue) {
      oldTree.nodeValue = nodeValue;

      patches[patches.length] = {
        __do__: 3,
        element: oldElement,
        value: nodeValue
      };
    }

    return;
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    var fragment = [];

    for (var i = oldChildNodesLength; i < childNodesLength; i++) {
      protectElement(childNodes[i]);

      // Internally add to the tree.
      oldChildNodes[oldChildNodes.length] = childNodes[i];

      // Add to the document fragment.
      fragment[fragment.length] = childNodes[i];
    }

    // Assign the fragment to the patches to be injected.
    patches[patches.length] = {
      __do__: 1,
      element: oldElement,
      fragment: fragment
    };
  }

  // Replace elements if they are different.
  for (var i = 0; i < childNodesLength; i++) {
    if (oldChildNodes[i].nodeName !== childNodes[i].nodeName) {
      // Add to the patches.
      patches[patches.length] = {
        __do__: 1,
        old: oldChildNodes[i],
        'new': childNodes[i]
      };

      unprotectElement(oldChildNodes[i]);
      protectElement(childNodes[i]);

      // Replace the internal tree's point of view of this element.
      oldChildNodes[i] = childNodes[i];
    }
  }

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    // Elements to remove.
    var toRemove = slice.call(oldChildNodes, childNodesLength, oldChildNodesLength);

    for (var i = 0; i < toRemove.length; i++) {
      // Remove the element, this happens before the splice so that we still
      // have access to the element.
      patches[patches.length] = { __do__: 1, old: toRemove[i].element };
    }

    var removed = oldChildNodes.splice(childNodesLength, oldChildNodesLength - childNodesLength);

    for (var i = 0; i < removed.length; i++) {
      unprotectElement(removed[i]);
    }
  }

  // Synchronize attributes
  var attributes = newTree.attributes;

  if (attributes) {
    var oldLength = oldTree.attributes.length;
    var newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      var toAdd = slice.call(attributes, oldLength);

      for (var i = 0; i < toAdd.length; i++) {
        var change = {
          __do__: 2,
          element: oldElement,
          name: toAdd[i].name,
          value: toAdd[i].value
        };

        var attr = pools.attributeObject.get();
        attr.name = toAdd[i].name;
        attr.value = toAdd[i].value;

        pools.attributeObject.protect(attr);

        // Push the change object into into the virtual tree.
        oldTree.attributes[oldTree.attributes.length] = attr;

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      var toRemove = slice.call(oldTree.attributes, newLength);

      for (var i = 0; i < toRemove.length; i++) {
        var change = {
          __do__: 2,
          element: oldElement,
          name: toRemove[i].name,
          value: undefined
        };

        // Remove the attribute from the virtual node.
        var removed = oldTree.attributes.splice(i, 1);

        for (var _i = 0; _i < removed.length; _i++) {
          pools.attributeObject.unprotect(removed[_i]);
        }

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }

    // Check for modifications.
    var toModify = attributes;

    for (var i = 0; i < toModify.length; i++) {
      var oldAttrValue = oldTree.attributes[i] && oldTree.attributes[i].value;
      var newAttrValue = attributes[i] && attributes[i].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        var change = {
          __do__: 2,
          element: oldElement,
          name: toModify[i].name,
          value: toModify[i].value
        };

        // Replace the attribute in the virtual node.
        var attr = oldTree.attributes[i];
        attr.name = toModify[i].name;
        attr.value = toModify[i].value;

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }
  }

  // Sync each current node.
  for (var i = 0; i < oldChildNodes.length; i++) {
    if (oldChildNodes[i].element !== childNodes[i].element) {
      sync.call(patches, oldTree.childNodes[i], childNodes[i]);
    }
  }
}

module.exports = exports['default'];

},{"../util/pools":14,"../util/protect":15}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = process;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _transitions = _dereq_('../transitions');

var _utilPools = _dereq_('../util/pools');

var _utilDecode = _dereq_('../util/decode');

var _utilDecode2 = _interopRequireDefault(_utilDecode);

var _elementGet = _dereq_('../element/get');

var _elementGet2 = _interopRequireDefault(_elementGet);

var _nodeMake = _dereq_('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

var pools = _utilPools.pools;
var forEach = Array.prototype.forEach;

/**
 * Processes an Array of patches.
 *
 * @param e
 * @return
 */

function process(element, e) {
  var patches = e.data;
  var states = _transitions.transitionStates;

  var callCallback = function callCallback(callback) {
    callback(this);
  };

  var attachedCallback = function attachedCallback(elementDescriptor) {
    var el = (0, _elementGet2['default'])(elementDescriptor).element;
    var fragment = this.fragment;

    if (el.nodeName === '#text') {
      el.textContent = (0, _utilDecode2['default'])(el.textContent);
    }

    fragment.appendChild(el);
  };

  var titleCallback = function titleCallback(elementDescriptor) {
    var el = (0, _elementGet2['default'])(elementDescriptor).element;

    // Ensure the title is set correctly.
    if (el.tagName === 'title') {
      el.ownerDocument.title = el.childNodes[0].nodeValue;
    }
  };

  // Loop through all the patches and apply them.

  var _loop = function (i) {
    var patch = patches[i];
    var elementId = undefined,
        oldId = undefined,
        newId = undefined,
        result = undefined;
    var element = patch['new'];

    if (patch.element) {
      result = (0, _elementGet2['default'])(patch.element);
      patch.element = result.element;
      elementId = result.uuid;
    }

    if (patch.old) {
      result = (0, _elementGet2['default'])(patch.old);
      patch.old = result.element;
      oldId = result.uuid;
    }

    if (patch['new']) {
      result = (0, _elementGet2['default'])(patch['new']);
      patch['new'] = result.element;
      newId = result.uuid;
    }

    if (element && element.nodeName === '#text') {
      patch['new'].textContent = (0, _utilDecode2['default'])(element.nodeValue);
    }

    // Replace the entire Node.
    if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch['new'], patch.old);
    }

    // Node manip.
    else if (patch.__do__ === 1) {
        // Add.
        if (patch.element && patch.fragment && !patch.old) {
          var fragment = document.createDocumentFragment();

          patch.fragment.forEach(attachedCallback, { fragment: fragment });
          patch.element.appendChild(fragment);

          forEach.call(patch.fragment, function (el) {
            var element = (0, _elementGet2['default'])(el);

            // Trigger all the text changed values.
            if (states && el.nodeName === '#text' && states.textChanged) {
              for (var x = 0; x < states.textChanged.length; x++) {
                var callback = states.textChanged[x];
                callback(element.parentNode || element, null, el.nodeValue);
              }
            }

            // Added state for transitions API.
            if (states && states.attached) {
              states.attached.forEach(callCallback, el);
            }

            titleCallback(el);
          });
        }

        // Remove
        else if (patch.old && !patch['new']) {
            if (!patch.old.parentNode) {
              throw new Error('Can\'t remove without parent, is this the ' + 'document root?');
            }

            if (states && states.detached) {
              states.detached.forEach(callCallback, patch.old);
            }

            // Ensure the title is emptied.
            if (patch.old.tagName === 'title') {
              patch.old.ownerDocument.title = '';
            }

            patch.old.parentNode.removeChild(patch.old);

            _nodeMake2['default'].nodes[oldId] = undefined;
          }

          // Replace
          else if (patch.old && patch['new']) {
              if (!patch.old.parentNode) {
                throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
              }

              // Append the element first, before doing the replacement.
              patch.old.parentNode.insertBefore(patch['new'], patch.old.nextSibling);

              // Removed state for transitions API.
              if (states && states.detached) {
                states.detached.forEach(function (callback) {
                  callback(patch.old);
                });
              }

              // Replaced state for transitions API.
              if (states && states.replaced) {
                states.replaced.forEach(function (callback) {
                  callback(patch.old, patch['new']);
                });
              }

              // Ensure the title is set correctly.
              if (patch['new'].tagName === 'title') {
                patch.old.ownerDocument.title = patch['new'].childNodes[0].nodeValue;
              }

              patch.old.parentNode.replaceChild(patch['new'], patch.old);

              // Added state for transitions API.
              if (states && states.attached) {
                states.attached.forEach(function (callback) {
                  callback(patch['new']);
                });
              }

              _nodeMake2['default'].nodes[oldId] = undefined;
            }
      }

      // Attribute manipulation.
      else if (patch.__do__ === 2) {
          var originalValue = patch.element.getAttribute(patch.name);

          // Remove.
          if (!patch.value) {
            patch.element.removeAttribute(patch.name);
          } else {
            patch.element.setAttribute(patch.name, patch.value);
          }

          // Trigger all the attribute changed values.
          if (states && states.attributeChanged) {
            for (var x = 0; x < states.attributeChanged.length; x++) {
              var callback = states.attributeChanged[x];
              callback(patch.element, patch.name, originalValue, patch.value);
            }
          }
        }

        // Text node manipulation.
        else if (patch.__do__ === 3) {
            var originalValue = patch.element.textContent;

            patch.element.textContent = (0, _utilDecode2['default'])(patch.value);

            // Trigger all the text changed values.
            if (states && states.textChanged) {
              for (var x = 0; x < states.textChanged.length; x++) {
                var callback = states.textChanged[x];
                callback(patch.element.parentNode, originalValue, patch.value);
              }
            }
          }
  };

  for (var i = 0; i < patches.length; i++) {
    _loop(i);
  }
}

module.exports = exports['default'];

},{"../element/get":1,"../node/make":5,"../transitions":10,"../util/decode":12,"../util/pools":14}],9:[function(_dereq_,module,exports){
// List of SVG elements.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];

exports.elements = elements;
// Namespace.
var namespace = 'http://www.w3.org/2000/svg';
exports.namespace = namespace;

},{}],10:[function(_dereq_,module,exports){
/**
 * Transition states
 * =================
 *
 * - attached - For when elements come into the DOM. The callback triggers
 * ------------ immediately after the element enters the DOM. It is called with
 *              the element as the only argument.
 *
 * - detached - For when elements are removed from the DOM. The callback
 * ------------ triggers just before the element leaves the DOM. It is called
 *              with the element as the only argument.
 *
 * - replaced - For when elements are replaced in the DOM. The callback
 * ------------ triggers after the new element enters the DOM, and before the
 *              old element leaves. It is called with old and new elements as
 *              arguments, in that order.
 *
 * - attributeChanged - Triggered when an element's attribute has changed. The
 * -------------------- callback triggers after the attribute has changed in
 *                      the DOM. It is called with the element, the attribute
 *                      name, old value, and current value.
 *
 * - textChanged - Triggered when an element's `textContent` chnages. The
 * --------------- callback triggers after the textContent has changed in the
 *                 DOM. It is called with the element, the old value, and
 *                 current value.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var transitionStates = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: []
};
exports.transitionStates = transitionStates;

},{}],11:[function(_dereq_,module,exports){
// Create a default buffer at length 1024.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.stringToBuffer = stringToBuffer;
exports.bufferToString = bufferToString;
var buffer = new Uint16Array(0);

/**
 * Converts a string to a buffer. Attempts to reuse the previous buffer, unless
 * the new HTML has a longer length.
 *
 * @param string
 * @return {Uint16Array}
 */

function stringToBuffer(string) {
  if (string.length > buffer.length) {
    buffer = new Uint16Array(string.length);
  }

  for (var i = 0; i < string.length; i++) {
    buffer[i] = string.codePointAt(i);
  }

  return buffer;
}

/**
 * Converts a Uint16Array to a String.
 *
 * @param buffer - A Uint16Array buffer to convert.
 * @return {String}
 */

function bufferToString(buffer, offset) {
  var tmpBuffer = new Uint16Array(buffer, 0, offset);
  var string = '';

  for (var i = 0; i < tmpBuffer.length; i++) {
    string += String.fromCodePoint(tmpBuffer[i]);
  }

  return string;
}

},{}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var element = document.createElement('div');

/**
 * Decode's HTML entities.
 *
 * @see http://stackoverflow.com/a/13091266
 * @param stringing
 * @return unescaped decoded HTML
 */
function decodeEntities(string) {
  // Escape HTML before decoding for HTML Entities
  var escaped = escape(string).replace(/%26/g, '&').replace(/%23/g, '#').replace(/%3B/g, ';');

  element.innerHTML = escaped;

  return unescape(element.textContent);
}

exports['default'] = decodeEntities;
module.exports = exports['default'];

},{}],13:[function(_dereq_,module,exports){
// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parseHTML = parseHTML;
exports.makeParser = makeParser;

var _pools2 = _dereq_('./pools');

var pools = _pools2.pools;
var parser = makeParser();

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */

function parseHTML(newHTML, isInner) {
  var documentElement = parser.parse(newHTML);
  var nodes = documentElement.childNodes;

  return isInner ? nodes : nodes[0];
}

function makeParser() {
  var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;

  var kAttributePattern = /\b(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;

  var reAttrPattern = /\b([a-z][a-z0-9\-]*)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;

  var kBlockElements = {
    div: true,
    p: true,
    li: true,
    td: true,
    section: true,
    br: true
  };

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
    li: {
      li: true
    },

    p: {
      p: true, div: true
    },

    td: {
      td: true, th: true
    },

    th: {
      td: true, th: true
    }
  };

  var kElementsClosedByClosing = {
    li: {
      ul: true, ol: true
    },

    a: {
      div: true
    },

    b: {
      div: true
    },

    i: {
      div: true
    },

    p: {
      div: true
    },

    td: {
      tr: true, table: true
    },

    th: {
      tr: true, table: true
    }
  };

  var kBlockTextElements = {
    script: true,
    noscript: true,
    style: true,
    pre: true
  };

  /**
   * TextNode to contain a text element in DOM tree.
   * @param {string} value [description]
   */
  function TextNode(value) {
    var instance = pools.elementObject.get();

    instance.nodeValue = value;
    instance.nodeName = '#text';
    instance.nodeType = 3;
    instance.childNodes.length = 0;

    return instance;
  }

  /**
   * HTMLElement, which contains a set of children.
   *
   * Note: this is a minimalist implementation, no complete tree structure
   * provided (no parentNode, nextSibling, previousSibling etc).
   *
   * @param {string} name     nodeName
   * @param {Object} keyAttrs id and class attribute
   * @param {Object} rawAttrs attributes in string
   */
  function HTMLElement(name, keyAttrs, rawAttrs) {
    var instance = pools.elementObject.get();

    instance.nodeName = name;
    instance.nodeType = 1;
    instance.attributes.length = 0;
    instance.childNodes.length = 0;

    if (rawAttrs) {
      for (var match = undefined; match = reAttrPattern.exec(rawAttrs);) {
        var attr = pools.attributeObject.get();

        attr.name = match[1];
        attr.value = match[3] || match[4] || match[5];

        instance.attributes[instance.attributes.length] = attr;
      }
    }

    return instance;
  }

  /**
   * Parses HTML and returns a root element
   */
  var htmlParser = {
    /**
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    parse: function parse(data, options) {
      var rootObject = pools.object.get();
      var root = HTMLElement(null, rootObject);
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      options = options || pools.object.get();

      if (data.indexOf('<') === -1 && data) {
        currentParent.childNodes[currentParent.childNodes.length] = TextNode(data);

        return root;
      }

      for (var match = undefined, text = undefined; match = kMarkupPattern.exec(data);) {
        if (lastTextPos > -1) {
          if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
            // if has content
            text = data.slice(lastTextPos, kMarkupPattern.lastIndex - match[0].length);

            if (text.trim()) {
              currentParent.childNodes[currentParent.childNodes.length] = TextNode(text);
            }
          }
        }

        lastTextPos = kMarkupPattern.lastIndex;

        // This is a comment.
        if (match[0][1] === '!') {
          continue;
        }

        if (options.lowerCaseTagName) {
          match[2] = match[2].toLowerCase();
        }

        if (!match[1]) {
          // not </ tags
          var attrs = pools.object.get();

          for (var attMatch = undefined; attMatch = kAttributePattern.exec(match[3]);) {
            attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
          }

          if (!match[4] && kElementsClosedByOpening[currentParent.nodeName]) {
            if (kElementsClosedByOpening[currentParent.nodeName][match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
            }
          }

          currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], attrs, match[3])) - 1];

          stack.push(currentParent);

          if (kBlockTextElements[match[2]]) {
            // a little test to find next </script> or </style> ...
            var closeMarkup = '</' + match[2] + '>';
            var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);

            if (options[match[2]]) {
              if (index == -1) {
                // there is no matching ending for the text element.
                text = data.slice(kMarkupPattern.lastIndex);
              } else {
                text = data.slice(kMarkupPattern.lastIndex, index);
              }

              if (text.length > 0) {
                currentParent.childNodes[currentParent.childNodes.length] = TextNode(text);
              }
            }
            if (index == -1) {
              lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
            } else {
              lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
              match[1] = true;
            }
          }
        }
        if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
          // </ or /> or <br> etc.
          while (true && currentParent) {
            if (currentParent.nodeName == match[2]) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              break;
            } else {
              // Trying to close current tag, and move on
              if (kElementsClosedByClosing[currentParent.nodeName]) {
                if (kElementsClosedByClosing[currentParent.nodeName][match[2]]) {
                  stack.pop();
                  currentParent = stack[stack.length - 1];

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

  return htmlParser;
}

;

},{"./pools":14}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createPool = createPool;
exports.initializePools = initializePools;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _uuid2 = _dereq_('./uuid');

var _uuid3 = _interopRequireDefault(_uuid2);

var uuid = _uuid3['default'];
var pools = {};
exports.pools = pools;
var count = 10000;

exports.count = count;
/**
 * Creates a pool to query new or reused values from.
 *
 * @param opts
 * @return {Object} pool
 */

function createPool(opts) {
  var size = opts.size;
  var fill = opts.fill;

  var _free = [];
  var allocated = [];
  var _protect = [];

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    _free[i] = fill();
  }

  return {
    _free: _free,
    _allocated: allocated,
    _uuid: [],

    get: function get() {
      var obj = null;
      var freeLength = _free.length;
      var minusOne = freeLength - 1;

      if (freeLength) {
        obj = _free[minusOne];
        _free.length = minusOne;
      } else {
        obj = fill();
      }

      allocated.push(obj);

      return obj;
    },

    protect: function protect(value) {
      var idx = allocated.indexOf(value);
      _protect.push(allocated.splice(idx, 1)[0]);

      // FIXME this isn't specific enough, we need a better way to cache the
      // currently used uuids.
      if (value && value.element) {
        this._uuid.push(value.element);
      }
    },

    unprotect: function unprotect(value) {
      var idx = _protect.indexOf(value);
      var freeLength = _free.length;

      if (freeLength < size) {
        var obj = _protect.splice(idx, 1)[0];

        if (obj) {
          _free.push(obj);
        }
      }

      // FIXME Read above FIXME
      if (value && value.element) {
        this._uuid.splice(this._uuid.indexOf(value.element), 1);
      }
    },

    freeAll: function freeAll() {
      var allocatedLength = allocated.length;
      var freeLength = _free.length;

      _free.push.apply(_free, allocated.slice(0, size - freeLength));

      allocated.length = 0;
    },

    free: function free(value) {
      var idx = allocated.indexOf(value);

      // Already freed.
      if (idx === -1) {
        return;
      }

      // Only put back into the free queue if we're under the size.
      if (_free.length < size) {
        _free.push(value);
      }

      allocated.splice(idx, 1);
    }
  };
}

function initializePools(COUNT) {
  pools.attributeObject = createPool({
    size: COUNT,

    fill: function fill() {
      return { name: '', value: '' };
    }
  });

  pools.elementObject = createPool({
    size: COUNT,

    fill: function fill() {
      return {
        element: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });

  pools.object = createPool({
    size: COUNT,

    fill: function fill() {
      return {};
    }
  });
}

// Create 10k items of each type.
initializePools(count);

},{"./uuid":16}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;

var _utilPools = _dereq_('../util/pools');

var pools = _utilPools.pools;

function protectElement(element) {
  pools.elementObject.protect(element);

  element.childNodes.forEach(protectElement);
  element.attributes.forEach(pools.attributeObject.protect, pools.attributeObject);
}

function unprotectElement(element) {
  pools.elementObject.unprotect(element);

  element.childNodes.forEach(unprotectElement);
  element.attributes.forEach(pools.attributeObject.unprotect, pools.attributeObject);
}

},{"../util/pools":14}],16:[function(_dereq_,module,exports){
/**
 * Generates a uuid.
 *
 * @see http://stackoverflow.com/a/2117523/282175
 * @return {string} uuid
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = uuid;

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

module.exports = exports['default'];

},{}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilUuid = _dereq_('../util/uuid');

var _utilUuid2 = _interopRequireDefault(_utilUuid);

var _utilBuffers = _dereq_('../util/buffers');

var buffers = _interopRequireWildcard(_utilBuffers);

var _utilPools = _dereq_('../util/pools');

var _utilParser = _dereq_('../util/parser');

var _utilProtect = _dereq_('../util/protect');

var _nodeSync = _dereq_('../node/sync');

var _nodeSync2 = _interopRequireDefault(_nodeSync);

var _source = _dereq_('./source');

var _source2 = _interopRequireDefault(_source);

var pools = _utilPools.pools;

var hasWorker = typeof Worker === 'function';

exports.hasWorker = hasWorker;

function create() {
  var workerBlob = null;
  var worker = null;

  // Set up a WebWorker if available.
  if (hasWorker) {
    // Construct the worker reusing code already organized into modules.  Keep
    // this code ES5 since we do not get time to pre-process it as ES6.
    workerBlob = new Blob([[
    // Reusable Array methods.
    'var slice = Array.prototype.slice;',

    // Add a namespace to attach pool methods to.
    'var pools = {};', 'var nodes = 0;',

    // Adds in a global `uuid` function.
    _utilUuid2['default'],

    // Add the ability to protect elements from free'd memory.
    _utilProtect.protectElement, _utilProtect.unprotectElement,

    // Add in pool manipulation methods.
    _utilPools.createPool, _utilPools.initializePools, 'initializePools(' + _utilPools.count + ');',

    // Add in Node manipulation.
    'var syncNode = ' + _nodeSync2['default'],

    // Add in the ability to parseHTML.
    _utilParser.parseHTML,

    // Give the webworker utilities.
    buffers.stringToBuffer, buffers.bufferToString, 'var makeParser = ' + _utilParser.makeParser, 'var parser = makeParser();',

    // Add in the worker source.
    _source2['default'],

    // Metaprogramming up this worker call.
    'startup(self);'].join('\n')], { type: 'application/javascript' });

    // Construct the worker and start it up.
    try {
      worker = new Worker(URL.createObjectURL(workerBlob));
    } catch (e) {
      if (console && console.info) {
        console.info("Failed to create diffhtml worker", e);
      }

      exports.hasWorker = hasWorker = false;
    }
  }

  return worker;
}

},{"../node/sync":7,"../util/buffers":11,"../util/parser":13,"../util/pools":14,"../util/protect":15,"../util/uuid":16,"./source":18}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = startup;
var bufferToString;
var parseHTML;
var syncNode;
var pools;

/**
 * startup
 *
 * @param worker
 * @return
 */

function startup(worker) {
  var Trees = {};
  var patches = [];

  worker.onmessage = function (e) {
    var data = e.data;
    var offset = data.offset;
    var transferBuffer = data.buffer;
    var isInner = data.isInner;

    var oldTree = Trees[e.data.uuid] || data.oldTree;
    var newTree = null;

    Trees[e.data.uuid] = oldTree;

    if (data.newTree) {
      newTree = data.newTree;
    } else {
      var newHTML = bufferToString(transferBuffer, offset);

      // Calculate a new tree.
      newTree = parseHTML(newHTML, isInner);

      if (isInner) {
        var childNodes = newTree;

        newTree = {
          childNodes: childNodes,

          attributes: oldTree.attributes,
          element: oldTree.element,
          nodeName: oldTree.nodeName,
          nodeValue: oldTree.nodeValue
        };
      }
    }

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be excuted to update the DOM.
    syncNode.call(patches, oldTree, newTree);

    // Send the patches back to the userland.
    worker.postMessage(patches);

    // Release allocated objects back into the pool.
    pools.object.freeAll();
    pools.attributeObject.freeAll();
    pools.elementObject.freeAll();

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

module.exports = exports['default'];

},{}],19:[function(_dereq_,module,exports){
(function (global){

var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9lbGVtZW50L2dldC5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2VsZW1lbnQvbWFrZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2Vycm9ycy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2luZGV4LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9tYWtlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9wYXRjaC5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL25vZGUvc3luYy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3BhdGNoZXMvcHJvY2Vzcy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3N2Zy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3RyYW5zaXRpb25zLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9idWZmZXJzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9kZWNvZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL3BhcnNlci5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3V0aWwvcG9vbHMuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL3Byb3RlY3QuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL3V1aWQuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi93b3JrZXIvY3JlYXRlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvd29ya2VyL3NvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9jdXN0b20tZXZlbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgbWFrZU5vZGUgZnJvbSAnLi4vbm9kZS9tYWtlJztcbmltcG9ydCBtYWtlRWxlbWVudCBmcm9tICcuLi9lbGVtZW50L21ha2UnO1xuXG4vKipcbiAqIFRha2VzIGluIGFuIGVsZW1lbnQgcmVmZXJlbmNlIGFuZCByZXNvbHZlIGl0IHRvIGEgdXVpZCBhbmQgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIHJlZiAtIEVsZW1lbnQgZGVzY3JpcHRvclxuICogQHJldHVybiB7T2JqZWN0fSBjb250YWluaW5nIHRoZSB1dWlkIGFuZCBET00gbm9kZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0KHJlZikge1xuICBsZXQgdXVpZCA9IHJlZi5lbGVtZW50IHx8IHJlZjtcbiAgbGV0IGVsZW1lbnQgPSBtYWtlTm9kZS5ub2Rlc1t1dWlkXSB8fCBtYWtlRWxlbWVudChyZWYpO1xuXG4gIHJldHVybiB7IGVsZW1lbnQsIHV1aWQgfTtcbn1cbiIsImltcG9ydCAqIGFzIHN2ZyBmcm9tICcuLi9zdmcnO1xuaW1wb3J0IG1ha2VOb2RlIGZyb20gJy4uL25vZGUvbWFrZSc7XG5cbi8qKlxuICogVGFrZXMgaW4gYSB2aXJ0dWFsIGRlc2NyaXB0b3IgYW5kIGNyZWF0ZXMgYW4gSFRNTCBlbGVtZW50LiBTZXQncyB0aGUgZWxlbWVudFxuICogaW50byB0aGUgY2FjaGUuXG4gKlxuICogQHBhcmFtIGRlc2NyaXB0b3JcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2UoZGVzY3JpcHRvcikge1xuICBsZXQgZWxlbWVudCA9IG51bGw7XG4gIGxldCBpc1N2ZyA9IGZhbHNlO1xuXG4gIGlmIChkZXNjcmlwdG9yLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRlc2NyaXB0b3Iubm9kZVZhbHVlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoc3ZnLmVsZW1lbnRzLmluZGV4T2YoZGVzY3JpcHRvci5ub2RlTmFtZSkgPiAtMSkge1xuICAgICAgaXNTdmcgPSB0cnVlO1xuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmcubmFtZXNwYWNlLCBkZXNjcmlwdG9yLm5vZGVOYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkZXNjcmlwdG9yLm5vZGVOYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRvci5hdHRyaWJ1dGVzICYmIGRlc2NyaXB0b3IuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVzY3JpcHRvci5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGUgPSBkZXNjcmlwdG9yLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkZXNjcmlwdG9yLmNoaWxkTm9kZXMgJiYgZGVzY3JpcHRvci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXNjcmlwdG9yLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChtYWtlKGRlc2NyaXB0b3IuY2hpbGROb2Rlc1tpXSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCB0byB0aGUgbm9kZXMgY2FjaGUgdXNpbmcgdGhlIGRlc2lnbmF0ZWQgdXVpZCBhcyB0aGUgbG9va3VwIGtleS5cbiAgbWFrZU5vZGUubm9kZXNbZGVzY3JpcHRvci5lbGVtZW50XSA9IGVsZW1lbnQ7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG4iLCIvKipcbiAqIElkZW50aWZpZXMgYW4gZXJyb3Igd2l0aCB0cmFuc2l0aW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zaXRpb25TdGF0ZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH1cbn1cbiIsImltcG9ydCBwYXRjaE5vZGUgZnJvbSAnLi9ub2RlL3BhdGNoJztcbmltcG9ydCB7IHRyYW5zaXRpb25TdGF0ZXMgfSBmcm9tICcuL3RyYW5zaXRpb25zJztcblxuLy8gV2UgZXhwb3J0IHRoZSBUcmFuc2l0aW9uU3RhdGVFcnJvciBjb25zdHJ1Y3RvciBzbyB0aGF0IGluc3RhbmNlb2YgY2hlY2tzIGNhblxuLy8gYmUgbWFkZSBieSB0aG9zZSBwdWJsaWNseSBjb25zdW1pbmcgdGhpcyBsaWJyYXJ5LlxuaW1wb3J0IHsgVHJhbnNpdGlvblN0YXRlRXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5leHBvcnQgeyBUcmFuc2l0aW9uU3RhdGVFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuLyoqXG4gKiBVc2VkIHRvIGRpZmYgdGhlIG91dGVySFRNTCBjb250ZW50cyBvZiB0aGUgcGFzc2VkIGVsZW1lbnQgd2l0aCB0aGUgbWFya3VwXG4gKiBjb250ZW50cy4gIFZlcnkgdXNlZnVsIGZvciBhcHBseWluZyBhIGdsb2JhbCBkaWZmIG9uIHRoZVxuICogYGRvY3VtZW50LmRvY3VtZW50RWxlbWVudGAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBtYXJrdXA9JydcbiAqIEBwYXJhbSBvcHRpb25zPXt9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdXRlckhUTUwoZWxlbWVudCwgbWFya3VwPScnLCBvcHRpb25zPXt9KSB7XG4gIG9wdGlvbnMuaW5uZXIgPSBmYWxzZTtcbiAgcGF0Y2hOb2RlKGVsZW1lbnQsIG1hcmt1cCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogVXNlZCB0byBkaWZmIHRoZSBpbm5lckhUTUwgY29udGVudHMgb2YgdGhlIHBhc3NlZCBlbGVtZW50IHdpdGggdGhlIG1hcmt1cFxuICogY29udGVudHMuICBUaGlzIGlzIHVzZWZ1bCB3aXRoIGxpYnJhcmllcyBsaWtlIEJhY2tib25lIHRoYXQgcmVuZGVyIFZpZXdzXG4gKiBpbnRvIGVsZW1lbnQgY29udGFpbmVyLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbWFya3VwPScnXG4gKiBAcGFyYW0gb3B0aW9ucz17fVxuICogQHJldHVyblxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5uZXJIVE1MKGVsZW1lbnQsIG1hcmt1cD0nJywgb3B0aW9ucz17fSkge1xuICBvcHRpb25zLmlubmVyID0gdHJ1ZTtcbiAgcGF0Y2hOb2RlKGVsZW1lbnQsIG1hcmt1cCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogVXNlZCB0byBkaWZmIHR3byBlbGVtZW50cy4gIFRoZSBgaW5uZXJgIEJvb2xlYW4gcHJvcGVydHkgY2FuIGJlIHNwZWNpZmllZCBpblxuICogdGhlIG9wdGlvbnMgdG8gc2V0IGlubmVySFRNTFxcb3V0ZXJIVE1MIGJlaGF2aW9yLiAgQnkgZGVmYXVsdCBpdCBpc1xuICogb3V0ZXJIVE1MLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbmV3RWxlbWVudFxuICogQHBhcmFtIG9wdGlvbnM9e31cbiAqIEByZXR1cm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnQoZWxlbWVudCwgbmV3RWxlbWVudCwgb3B0aW9ucz17fSkge1xuICBwYXRjaE5vZGUoZWxlbWVudCwgbmV3RWxlbWVudCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogQWRkcyBhIGdsb2JhbCB0cmFuc2l0aW9uIGxpc3RlbmVyLiAgV2l0aCBtYW55IGVsZW1lbnRzIHRoaXMgY291bGQgYmUgYW5cbiAqIGV4cGVuc2l2ZSBvcGVyYXRpb24sIHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGxpc3RlbmVycyBhZGRlZCBpZiB5b3UncmVcbiAqIGNvbmNlcm5lZCBhYm91dCBwZXJmb3JtYW5jZS5cbiAqXG4gKiBTaW5jZSB0aGUgY2FsbGJhY2sgdHJpZ2dlcnMgd2l0aCB2YXJpb3VzIGVsZW1lbnRzLCBtb3N0IG9mIHdoaWNoIHlvdVxuICogcHJvYmFibHkgZG9uJ3QgY2FyZSBhYm91dCwgeW91J2xsIHdhbnQgdG8gZmlsdGVyLiAgQSBnb29kIHdheSBvZiBmaWx0ZXJpbmdcbiAqIGlzIHRvIHVzZSB0aGUgRE9NIGBtYXRjaGVzYCBtZXRob2QuICBJdCdzIGZhaXJseSB3ZWxsIHN1cHBvcnRlZFxuICogKGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD1tYXRjaGVzc2VsZWN0b3IpIGFuZCBtYXkgc3VpdCBtYW55IHByb2plY3RzLiAgSWZcbiAqIHlvdSBuZWVkIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCBjb25zaWRlciB1c2luZyBqUXVlcnkncyBgaXNgLlxuICpcbiAqIFlvdSBjYW4gZG8gZnVuLCBoaWdobHkgc3BlY2lmaWMsIGZpbHRlcnM6XG4gKlxuICogYWRkVHJhbnNpdGlvblN0YXRlKCdhdHRhY2hlZCcsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAqICAgLy8gRmFkZSBpbiB0aGUgbWFpbiBjb250YWluZXIgYWZ0ZXIgaXQncyBhZGRlZC5cbiAqICAgaWYgKGVsZW1lbnQubWF0Y2hlcygnYm9keSBtYWluLmNvbnRhaW5lcicpKSB7XG4gKiAgICAgJChlbGVtZW50KS5zdG9wKHRydWUsIHRydWUpLmZhZGVJbigpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAcGFyYW0gc3RhdGUgLSBTdHJpbmcgbmFtZSB0aGF0IG1hdGNoZXMgd2hhdCdzIGF2YWlsYWJsZSBpbiB0aGVcbiAqIGRvY3VtZW50YXRpb24gYWJvdmUuXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZWNlaXZlIHRoZSBtYXRjaGluZyBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFRyYW5zaXRpb25TdGF0ZShzdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHRocm93IG5ldyBUcmFuc2l0aW9uU3RhdGVFcnJvcignTWlzc2luZyB0cmFuc2l0aW9uIHN0YXRlIG5hbWUnKTtcbiAgfVxuXG4gIGlmICghY2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgVHJhbnNpdGlvblN0YXRlRXJyb3IoJ01pc3NpbmcgdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFjaycpO1xuICB9XG5cbiAgLy8gTm90IGEgdmFsaWQgc3RhdGUgbmFtZS5cbiAgaWYgKE9iamVjdC5rZXlzKHRyYW5zaXRpb25TdGF0ZXMpLmluZGV4T2Yoc3RhdGUpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBUcmFuc2l0aW9uU3RhdGVFcnJvcignSW52YWxpZCBzdGF0ZSBuYW1lOiAnICsgc3RhdGUpO1xuICB9XG5cbiAgdHJhbnNpdGlvblN0YXRlc1tzdGF0ZV0ucHVzaChjYWxsYmFjayk7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhIGdsb2JhbCB0cmFuc2l0aW9uIGxpc3RlbmVyLlxuICpcbiAqIFdoZW4gaW52b2tlZCB3aXRoIG5vIGFyZ3VtZW50cywgdGhpcyBtZXRob2Qgd2lsbCByZW1vdmUgYWxsIHRyYW5zaXRpb25cbiAqIGNhbGxiYWNrcy4gIFdoZW4gaW52b2tlZCB3aXRoIHRoZSBuYW1lIGFyZ3VtZW50IGl0IHdpbGwgcmVtb3ZlIGFsbFxuICogdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFja3MgbWF0Y2hpbmcgdGhlIG5hbWUsIGFuZCBzbyBvbiBmb3IgdGhlIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSBzdGF0ZSAtIFN0cmluZyBuYW1lIHRoYXQgbWF0Y2hlcyB3aGF0J3MgYXZhaWxhYmxlIGluIHRoZVxuICogZG9jdW1lbnRhdGlvbiBhYm92ZS5cbiAqIEBwYXJhbSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlY2VpdmUgdGhlIG1hdGNoaW5nIGVsZW1lbnRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrICYmIHN0YXRlKSB7XG4gICAgdHJhbnNpdGlvblN0YXRlc1tzdGF0ZV0ubGVuZ3RoID0gMDtcbiAgfVxuICBlbHNlIGlmIChzdGF0ZSAmJiBjYWxsYmFjaykge1xuICAgIC8vIE5vdCBhIHZhbGlkIHN0YXRlIG5hbWUuXG4gICAgaWYgKE9iamVjdC5rZXlzKHRyYW5zaXRpb25TdGF0ZXMpLmluZGV4T2Yoc3RhdGUpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFRyYW5zaXRpb25TdGF0ZUVycm9yKCdJbnZhbGlkIHN0YXRlIG5hbWUgJyArIHN0YXRlKTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSB0cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICB0cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAobGV0IHN0YXRlIGluIHRyYW5zaXRpb25TdGF0ZXMpIHtcbiAgICAgIHRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnkgY2FsbGluZyB0aGlzIGZ1bmN0aW9uIHlvdXIgYnJvd3NlciBlbnZpcm9ubWVudCBpcyBlbmhhbmNlZCBnbG9iYWxseS4gVGhpc1xuICogcHJvamVjdCB3b3VsZCBsb3ZlIHRvIGhpdCB0aGUgc3RhbmRhcmRzIHRyYWNrIGFuZCBhbGxvdyBhbGwgZGV2ZWxvcGVycyB0b1xuICogYmVuZWZpdCBmcm9tIHRoZSBwZXJmb3JtYW5jZSBnYWlucyBvZiBET00gZGlmZmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZVByb2xseWZpbGwoKSB7XG4gIC8vIEV4cG9zZXMgdGhlIGBUcmFuc2l0aW9uU3RhdGVFcnJvcmAgY29uc3RydWN0b3IgZ2xvYmFsbHkgc28gdGhhdCBkZXZlbG9wZXJzXG4gIC8vIGNhbiBpbnN0YW5jZW9mIGNoZWNrIGV4Y2VwdGlvbiBlcnJvcnMuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdUcmFuc2l0aW9uU3RhdGVFcnJvcicsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogVHJhbnNpdGlvblN0YXRlRXJyb3JcbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIGFkZCB0cmFuc2l0aW9uIHN0YXRlIGNhbGxiYWNrcy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50LCAnYWRkVHJhbnNpdGlvblN0YXRlJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgYWRkVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gcmVtb3ZlIHRyYW5zaXRpb24gc3RhdGUgY2FsbGJhY2tzLlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQsICdyZW1vdmVUcmFuc2l0aW9uU3RhdGUnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBzZXQgdGhlIGBpbm5lckhUTUxgIG9mIGFuIGVsZW1lbnQuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZJbm5lckhUTUwnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgc2V0KG5ld0hUTUwpIHtcbiAgICAgIGlubmVySFRNTCh0aGlzLCBuZXdIVE1MKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBzZXQgdGhlIGBvdXRlckhUTUxgIG9mIGFuIGVsZW1lbnQuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZPdXRlckhUTUwnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgc2V0KG5ld0hUTUwpIHtcbiAgICAgIG91dGVySFRNTCh0aGlzLCBuZXdIVE1MKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBkaWZmIHRoZSBjdXJyZW50IGVsZW1lbnQgd2l0aCBhIG5ldyBlbGVtZW50LlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdkaWZmRWxlbWVudCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZShuZXdFbGVtZW50KSB7XG4gICAgICBlbGVtZW50KHRoaXMsIG5ld0VsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBwb29scyBhcyBfcG9vbHMgfSBmcm9tICcuLi91dGlsL3Bvb2xzJztcbmltcG9ydCB7XG4gIHByb3RlY3RFbGVtZW50IGFzIF9wcm90ZWN0RWxlbWVudCxcbiAgdW5wcm90ZWN0RWxlbWVudCBhcyBfdW5wcm90ZWN0RWxlbWVudFxufSBmcm9tICcuLi91dGlsL3Byb3RlY3QnO1xuXG5sZXQgcG9vbHMgPSBfcG9vbHM7XG5sZXQgcHJvdGVjdEVsZW1lbnQgPSBfcHJvdGVjdEVsZW1lbnQ7XG5sZXQgdW5wcm90ZWN0RWxlbWVudCA9IF91bnByb3RlY3RFbGVtZW50O1xuXG4vLyBDYWNoZSBjcmVhdGVkIG5vZGVzIGluc2lkZSB0aGlzIG9iamVjdC5cbm1ha2Uubm9kZXMgPSB7fTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGxpdmUgbm9kZSBpbnRvIGEgdmlydHVhbCBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlXG4gKiBAcmV0dXJuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2Uobm9kZSwgcHJvdGVjdCkge1xuICBsZXQgbm9kZVR5cGUgPSBub2RlLm5vZGVUeXBlO1xuICBsZXQgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG5cbiAgaWYgKCFub2RlVHlwZSB8fCBub2RlVHlwZSA9PT0gMiB8fCBub2RlVHlwZSA9PT0gNCB8fCBub2RlVHlwZSA9PT0gOCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChub2RlVHlwZSA9PT0gMyAmJiAhbm9kZVZhbHVlLnRyaW0oKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFZpcnR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBub2RlLCBjb250YWluaW5nIG9ubHkgdGhlIGRhdGEgd2Ugd2lzaCB0b1xuICAvLyBkaWZmIGFuZCBwYXRjaC5cbiAgbGV0IGVudHJ5ID0gcG9vbHMuZWxlbWVudE9iamVjdC5nZXQoKTtcblxuICBpZiAocHJvdGVjdCkgeyBwcm90ZWN0RWxlbWVudChlbnRyeSk7IH1cblxuICAvLyBBZGQgdG8gaW50ZXJuYWwgbG9va3VwLlxuICBtYWtlLm5vZGVzW2VudHJ5LmVsZW1lbnRdID0gbm9kZTtcblxuICBlbnRyeS5ub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgZW50cnkubm9kZVZhbHVlID0gbm9kZVZhbHVlO1xuICBlbnRyeS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gIGVudHJ5LmF0dHJpYnV0ZXMubGVuZ3RoID0gMDtcblxuICAvLyBDb2xsZWN0IGF0dHJpYnV0ZXMuXG4gIGxldCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBubyBhdHRyaWJ1dGVzLCBza2lwIG92ZXIuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgbGV0IGF0dHJpYnV0ZXNMZW5ndGggPSBhdHRyaWJ1dGVzLmxlbmd0aDtcblxuICAgIGlmIChhdHRyaWJ1dGVzTGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXNMZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcblxuICAgICAgICBpZiAocHJvdGVjdCkge1xuICAgICAgICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5wcm90ZWN0KGF0dHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXR0ci5uYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuICAgICAgICBhdHRyLnZhbHVlID0gYXR0cmlidXRlc1tpXS52YWx1ZTtcblxuICAgICAgICBlbnRyeS5hdHRyaWJ1dGVzW2VudHJ5LmF0dHJpYnV0ZXMubGVuZ3RoXSA9IGF0dHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29sbGVjdCBjaGlsZE5vZGVzLlxuICBsZXQgY2hpbGROb2RlcyA9IG5vZGUuY2hpbGROb2RlcztcbiAgbGV0IGNoaWxkTm9kZXNMZW5ndGggPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBjaGlsZCBub2RlcywgY29udmVydCB0aGVtIGFsbCB0byB2aXJ0dWFsIG5vZGVzLlxuICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMyAmJiBjaGlsZE5vZGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBuZXdOb2RlID0gbWFrZShjaGlsZE5vZGVzW2ldLCBwcm90ZWN0KTtcblxuICAgICAgaWYgKG5ld05vZGUpIHtcbiAgICAgICAgZW50cnkuY2hpbGROb2Rlc1tlbnRyeS5jaGlsZE5vZGVzLmxlbmd0aF0gPSBuZXdOb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnRyeTtcbn1cbiIsImltcG9ydCBDdXN0b21FdmVudCBmcm9tICdjdXN0b20tZXZlbnQnO1xuaW1wb3J0IHsgY3JlYXRlIGFzIGNyZWF0ZVdvcmtlciwgaGFzV29ya2VyIH0gZnJvbSAnLi4vd29ya2VyL2NyZWF0ZSc7XG5pbXBvcnQgbWFrZU5vZGUgZnJvbSAnLi9tYWtlJztcbmltcG9ydCBzeW5jTm9kZSBmcm9tICcuL3N5bmMnO1xuaW1wb3J0IHsgcG9vbHMgYXMgX3Bvb2xzIH0gZnJvbSAnLi4vdXRpbC9wb29scyc7XG5pbXBvcnQgeyBwYXJzZUhUTUwgfSBmcm9tICcuLi91dGlsL3BhcnNlcic7XG5pbXBvcnQgKiBhcyBidWZmZXJzIGZyb20gJy4uL3V0aWwvYnVmZmVycyc7XG5pbXBvcnQgcHJvY2Vzc1BhdGNoZXMgZnJvbSAnLi4vcGF0Y2hlcy9wcm9jZXNzJztcblxubGV0IHBvb2xzID0gX3Bvb2xzO1xuXG4vLyBDYWNoZSBwcmVidWlsdCB0cmVlcyBhbmQgbG9va3VwIGJ5IGVsZW1lbnQuXG5jb25zdCBUcmVlQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG5mdW5jdGlvbiBjb21wbGV0ZVdvcmtlclJlbmRlcihlbGVtZW50LCBlbGVtZW50TWV0YSkge1xuICByZXR1cm4gZnVuY3Rpb24oZXYpIHtcbiAgICBwcm9jZXNzUGF0Y2hlcyhlbGVtZW50LCBldik7XG5cbiAgICBlbGVtZW50TWV0YS5faW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgZWxlbWVudE1ldGEuX291dGVySFRNTCA9IGVsZW1lbnQub3V0ZXJIVE1MO1xuICAgIGVsZW1lbnRNZXRhLl90ZXh0Q29udGVudCA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cbiAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgIGVsZW1lbnRNZXRhLmhhc1JlbmRlcmVkVmlhV29ya2VyID0gdHJ1ZTtcblxuICAgIC8vIERpc3BhdGNoIGFuIGV2ZW50IG9uIHRoZSBlbGVtZW50IG9uY2UgcmVuZGVyaW5nIGhhcyBjb21wbGV0ZWQuXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVuZGVyQ29tcGxldGUnKSk7XG5cbiAgICBpZiAoZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyKSB7XG4gICAgICBsZXQgbmV4dFJlbmRlciA9IGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlcjtcbiAgICAgIGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlciA9IHVuZGVmaW5lZDtcbiAgICAgIHBhdGNoKGVsZW1lbnQsIG5leHRSZW5kZXIubmV3SFRNTCwgbmV4dFJlbmRlci5vcHRpb25zKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUGF0Y2hlcyBhbiBlbGVtZW50J3MgRE9NIHRvIG1hdGNoIHRoYXQgb2YgdGhlIHBhc3NlZCBtYXJrdXAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBuZXdIVE1MXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhdGNoKGVsZW1lbnQsIG5ld0hUTUwsIG9wdGlvbnMpIHtcbiAgLy8gRW5zdXJlIHRoYXQgdGhlIGRvY3VtZW50IGRpc2FibGUgd29ya2VyIGlzIGFsd2F5cyBwaWNrZWQgdXAuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5lbmFibGVXb3JrZXIgIT09ICdib29sZWFuJykge1xuICAgIG9wdGlvbnMuZW5hYmxlV29ya2VyID0gZG9jdW1lbnQuRU5BQkxFX1dPUktFUjtcbiAgfVxuXG4gIGxldCBlbGVtZW50TWV0YSA9IFRyZWVDYWNoZS5nZXQoZWxlbWVudCkgfHwge307XG4gIGxldCBuZXdPbGQgPSBmYWxzZTtcblxuICAvLyBBbHdheXMgZW5zdXJlIHRoZSBtb3N0IHVwLXRvLWRhdGUgbWV0YSBvYmplY3QgaXMgc3RvcmVkLlxuICBUcmVlQ2FjaGUuc2V0KGVsZW1lbnQsIGVsZW1lbnRNZXRhKTtcblxuICBsZXQgd29ya2VyID0gZWxlbWVudE1ldGEud29ya2VyID0gZWxlbWVudE1ldGEud29ya2VyIHx8IGNyZWF0ZVdvcmtlcigpO1xuXG4gIGlmIChlbGVtZW50LmlzUmVuZGVyaW5nKSB7XG4gICAgZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyID0geyBuZXdIVE1MLCBvcHRpb25zIH07XG4gIH1cblxuICBpZiAoXG4gICAgLy8gSWYgYWxyZWFkeSByZW5kZXJpbmcsIGFib3J0IHRoaXMgbG9vcC5cbiAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyB8fFxuXG4gICAgLy8gSWYgdGhlIG9wZXJhdGlvbiBpcyBgaW5uZXJIVE1MYCwgYnV0IHRoZSBjb250ZW50cyBoYXZlbid0IGNoYW5nZWQsXG4gICAgLy8gYWJvcnQuXG4gICAgb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50LmlubmVySFRNTCA9PT0gbmV3SFRNTCB8fFxuXG4gICAgLy8gSWYgdGhlIG9wZXJhdGlvbiBpcyBgb3V0ZXJIVE1MYCwgYnV0IHRoZSBjb250ZW50cyBoYXZlbid0IGNoYW5nZWQsXG4gICAgLy8gYWJvcnQuXG4gICAgIW9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudC5vdXRlckhUTUwgPT09IG5ld0hUTUxcbiAgKSB7IHJldHVybjsgfVxuXG4gIGlmIChcbiAgICAvLyBJZiB0aGUgb3BlcmF0aW9uIGlzIGBpbm5lckhUTUxgLCBhbmQgdGhlIGN1cnJlbnQgZWxlbWVudCdzIGNvbnRlbnRzIGhhdmVcbiAgICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgICAob3B0aW9ucy5pbm5lciAmJiBlbGVtZW50TWV0YS5faW5uZXJIVE1MICE9PSBlbGVtZW50LmlubmVySFRNTCkgfHxcblxuICAgIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAgIC8vIGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgcmVuZGVyIGxvb3AsIHJlY2FsY3VsYXRlIHRoZSB0cmVlLlxuICAgICghb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50TWV0YS5fb3V0ZXJIVE1MICE9PSBlbGVtZW50Lm91dGVySFRNTCkgfHxcblxuICAgIC8vIElmIHRoZSB0ZXh0IGNvbnRlbnQgZXZlciBjaGFuZ2VzLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgICAoZWxlbWVudE1ldGEuX3RleHRDb250ZW50ICE9PSBlbGVtZW50LnRleHRDb250ZW50KVxuICApIHtcbiAgICBuZXdPbGQgPSB0cnVlO1xuICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUgPSBtYWtlTm9kZShlbGVtZW50LCB0cnVlKTtcbiAgfVxuXG4gIC8vIFdpbGwgd2FudCB0byBlbnN1cmUgdGhhdCB0aGUgZmlyc3QgcmVuZGVyIHdlbnQgdGhyb3VnaCwgdGhlIHdvcmtlciBjYW5cbiAgLy8gdGFrZSBhIGJpdCB0byBzdGFydHVwIGFuZCB3ZSB3YW50IHRvIHNob3cgY2hhbmdlcyBhcyBzb29uIGFzIHBvc3NpYmxlLlxuICBpZiAob3B0aW9ucy5lbmFibGVXb3JrZXIgJiYgaGFzV29ya2VyICYmIGVsZW1lbnRNZXRhLmhhc1JlbmRlcmVkKSB7XG4gICAgLy8gQXR0YWNoIGFsbCBwcm9wZXJ0aWVzIGhlcmUgdG8gdHJhbnNwb3J0LlxuICAgIGxldCB0cmFuc2Zlck9iamVjdCA9IHt9O1xuXG4gICAgLy8gQXR0YWNoIHRoZSBwYXJlbnQgZWxlbWVudCdzIHV1aWQuXG4gICAgdHJhbnNmZXJPYmplY3QudXVpZCA9IGVsZW1lbnRNZXRhLm9sZFRyZWUuZWxlbWVudDtcblxuICAgIGlmIChuZXdPbGQgfHwgIWVsZW1lbnRNZXRhLmhhc1JlbmRlcmVkVmlhV29ya2VyKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5vbGRUcmVlID0gZWxlbWVudE1ldGEub2xkVHJlZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5ld0hUTUwgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5uZXdUcmVlID0gbWFrZU5vZGUobmV3SFRNTCk7XG5cbiAgICAgIC8vIFNldCBhIHJlbmRlciBsb2NrIGFzIHRvIG5vdCBmbG9vZCB0aGUgd29ya2VyLlxuICAgICAgZWxlbWVudE1ldGEuaXNSZW5kZXJpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBUcmFuc2ZlciB0aGlzIGJ1ZmZlciB0byB0aGUgd29ya2VyLCB3aGljaCB3aWxsIHRha2Ugb3ZlciBhbmQgcHJvY2VzcyB0aGVcbiAgICAgIC8vIG1hcmt1cC5cbiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh0cmFuc2Zlck9iamVjdCk7XG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSB3b3JrZXIgdG8gZmluaXNoIHByb2Nlc3NpbmcgYW5kIHRoZW4gYXBwbHkgdGhlIHBhdGNoc2V0LlxuICAgICAgd29ya2VyLm9ubWVzc2FnZSA9IGNvbXBsZXRlV29ya2VyUmVuZGVyKGVsZW1lbnQsIGVsZW1lbnRNZXRhKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFVzZWQgdG8gc3BlY2lmeSB0aGUgb3V0ZXJIVE1MIG9mZnNldCBpZiBwYXNzaW5nIHRoZSBwYXJlbnQncyBtYXJrdXAuXG4gICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICAvLyBDcmFmdCBhIG5ldyBidWZmZXIgd2l0aCB0aGUgbmV3IGNvbnRlbnRzLlxuICAgIGxldCBuZXdCdWZmZXIgPSBidWZmZXJzLnN0cmluZ1RvQnVmZmVyKG5ld0hUTUwpO1xuXG4gICAgLy8gU2V0IHRoZSBvZmZzZXQgdG8gYmUgdGhpcyBieXRlIGxlbmd0aC5cbiAgICBvZmZzZXQgPSBuZXdIVE1MLmxlbmd0aDtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgYnl0ZWxlbmd0aCBmb3IgdGhlIHRyYW5zZmVyIGJ1ZmZlciwgY29udGFpbnMgb25lIGV4dHJhIGZvclxuICAgIC8vIHRoZSBvZmZzZXQuXG4gICAgbGV0IHRyYW5zZmVyQnl0ZUxlbmd0aCA9IG5ld0J1ZmZlci5ieXRlTGVuZ3RoO1xuXG4gICAgLy8gVGhpcyBidWZmZXIgc3RhcnRzIHdpdGggdGhlIG9mZnNldCBhbmQgY29udGFpbnMgdGhlIGRhdGEgdG8gYmUgY2FycmllZFxuICAgIC8vIHRvIHRoZSB3b3JrZXIuXG4gICAgbGV0IHRyYW5zZmVyQnVmZmVyID0gbmV3QnVmZmVyO1xuXG4gICAgLy8gU2V0IHRoZSBuZXdIVE1MIHBheWxvYWQuXG4gICAgLy90cmFuc2ZlckJ1ZmZlci5zZXQobmV3QnVmZmVyLCAwKTtcblxuICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvIHNlbmQgdG8gd29ya2VyLlxuICAgIHRyYW5zZmVyT2JqZWN0Lm9mZnNldCA9IG9mZnNldDtcbiAgICB0cmFuc2Zlck9iamVjdC5idWZmZXIgPSB0cmFuc2ZlckJ1ZmZlci5idWZmZXI7XG4gICAgdHJhbnNmZXJPYmplY3QuaXNJbm5lciA9IG9wdGlvbnMuaW5uZXI7XG5cbiAgICAvLyBTZXQgYSByZW5kZXIgbG9jayBhcyB0byBub3QgZmxvb2QgdGhlIHdvcmtlci5cbiAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IHRydWU7XG5cbiAgICAvLyBUcmFuc2ZlciB0aGlzIGJ1ZmZlciB0byB0aGUgd29ya2VyLCB3aGljaCB3aWxsIHRha2Ugb3ZlciBhbmQgcHJvY2VzcyB0aGVcbiAgICAvLyBtYXJrdXAuXG4gICAgd29ya2VyLnBvc3RNZXNzYWdlKHRyYW5zZmVyT2JqZWN0LCBbdHJhbnNmZXJCdWZmZXIuYnVmZmVyXSk7XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgd29ya2VyIHRvIGZpbmlzaCBwcm9jZXNzaW5nIGFuZCB0aGVuIGFwcGx5IHRoZSBwYXRjaHNldC5cbiAgICB3b3JrZXIub25tZXNzYWdlID0gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuICB9XG4gIGVsc2UgaWYgKCFvcHRpb25zLmVuYWJsZVdvcmtlciB8fCAhaGFzV29ya2VyIHx8ICFlbGVtZW50TWV0YS5oYXNSZW5kZXJlZCkge1xuICAgIGxldCBkYXRhID0gW107XG4gICAgbGV0IG5ld1RyZWUgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBuZXdIVE1MID09PSAnc3RyaW5nJykge1xuICAgICAgbmV3VHJlZSA9IHBhcnNlSFRNTChuZXdIVE1MLCBvcHRpb25zLmlubmVyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5ld1RyZWUgPSBtYWtlTm9kZShuZXdIVE1MKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pbm5lcikge1xuICAgICAgbGV0IGNoaWxkTm9kZXMgPSBuZXdUcmVlO1xuXG4gICAgICBuZXdUcmVlID0ge1xuICAgICAgICBjaGlsZE5vZGVzLFxuXG4gICAgICAgIGF0dHJpYnV0ZXM6IGVsZW1lbnRNZXRhLm9sZFRyZWUuYXR0cmlidXRlcyxcbiAgICAgICAgZWxlbWVudDogZWxlbWVudE1ldGEub2xkVHJlZS5lbGVtZW50LFxuICAgICAgICBub2RlTmFtZTogZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlTmFtZSxcbiAgICAgICAgbm9kZVZhbHVlOiBlbGVtZW50TWV0YS5vbGRUcmVlLm5vZGVWYWx1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgb2xkVHJlZU5hbWUgPSBlbGVtZW50TWV0YS5vbGRUcmVlLm5vZGVOYW1lIHx8ICcnO1xuICAgIGxldCBuZXdOb2RlTmFtZSA9IG5ld1RyZWUgJiYgbmV3VHJlZS5ub2RlTmFtZTtcblxuICAgIC8vIElmIHRoZSBlbGVtZW50IG5vZGUgdHlwZXMgbWF0Y2gsIHRyeSBhbmQgY29tcGFyZSB0aGVtLlxuICAgIGlmIChvbGRUcmVlTmFtZSA9PT0gbmV3Tm9kZU5hbWUpIHtcbiAgICAgIC8vIFN5bmNocm9uaXplIHRoZSB0cmVlLlxuICAgICAgc3luY05vZGUuY2FsbChkYXRhLCBlbGVtZW50TWV0YS5vbGRUcmVlLCBuZXdUcmVlKTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIHJlcGxhY2UgdGhlIHRvcCBsZXZlbCBlbGVtZW50cy5cbiAgICBlbHNlIGlmIChuZXdIVE1MKSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoXSA9IHtcbiAgICAgICAgX19kb19fOiAwLFxuICAgICAgICBvbGQ6IGVsZW1lbnRNZXRhLm9sZFRyZWUsXG4gICAgICAgIG5ldzogbmV3VHJlZVxuICAgICAgfTtcblxuICAgICAgZWxlbWVudE1ldGEub2xkVHJlZSA9IG5ld1RyZWU7XG4gICAgfVxuXG4gICAgLy8gUHJvY2VzcyB0aGUgZGF0YSBpbW1lZGlhdGVseS5cbiAgICBwcm9jZXNzUGF0Y2hlcyhlbGVtZW50LCB7IGRhdGEgfSk7XG5cbiAgICAvLyBNYXJrIHRoYXQgdGhpcyBlbGVtZW50IGhhcyBpbml0aWFsbHkgcmVuZGVyZWQgYW5kIGlzIGRvbmUgcmVuZGVyaW5nLlxuICAgIGVsZW1lbnRNZXRhLmhhc1JlbmRlcmVkID0gdHJ1ZTtcbiAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgLy8gU2V0IHRoZSBpbm5lckhUTUwuXG4gICAgZWxlbWVudE1ldGEuX2lubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xuICAgIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgPSBlbGVtZW50Lm91dGVySFRNTDtcbiAgICBlbGVtZW50TWV0YS5fdGV4dENvbnRlbnQgPSBlbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgLy8gRnJlZSBhbGwgbWVtb3J5IGFmdGVyIGVhY2ggaXRlcmF0aW9uLlxuICAgIHBvb2xzLm9iamVjdC5mcmVlQWxsKCk7XG4gICAgcG9vbHMuYXR0cmlidXRlT2JqZWN0LmZyZWVBbGwoKTtcbiAgICBwb29scy5lbGVtZW50T2JqZWN0LmZyZWVBbGwoKTtcblxuICAgIC8vIEVtcHR5IG91dCB0aGUgYG1ha2Uubm9kZXNgLlxuICAgIGZvciAobGV0IHV1aWQgaW4gbWFrZU5vZGUubm9kZXMpIHtcbiAgICAgIC8vIElmIHRoaXMgaXMgbm90IGEgcHJvdGVjdGVkIHV1aWQsIHJlbW92ZSBpdC5cbiAgICAgIGlmIChwb29scy5lbGVtZW50T2JqZWN0Ll91dWlkLmluZGV4T2YodXVpZCkgPT09IC0xKSB7XG4gICAgICAgIGRlbGV0ZSBtYWtlTm9kZS5ub2Rlc1t1dWlkXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDbGVhbiBvdXQgdGhlIHBhdGNoZXMgYXJyYXkuXG4gICAgZGF0YS5sZW5ndGggPSAwO1xuXG4gICAgLy8gRGlzcGF0Y2ggYW4gZXZlbnQgb24gdGhlIGVsZW1lbnQgb25jZSByZW5kZXJpbmcgaGFzIGNvbXBsZXRlZC5cbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZW5kZXJDb21wbGV0ZScpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcG9vbHMgYXMgX3Bvb2xzIH0gZnJvbSAnLi4vdXRpbC9wb29scyc7XG5pbXBvcnQge1xuICBwcm90ZWN0RWxlbWVudCBhcyBfcHJvdGVjdEVsZW1lbnQsXG4gIHVucHJvdGVjdEVsZW1lbnQgYXMgX3VucHJvdGVjdEVsZW1lbnRcbn0gZnJvbSAnLi4vdXRpbC9wcm90ZWN0JztcblxubGV0IHBvb2xzID0gX3Bvb2xzO1xubGV0IHByb3RlY3RFbGVtZW50ID0gX3Byb3RlY3RFbGVtZW50O1xubGV0IHVucHJvdGVjdEVsZW1lbnQgPSBfdW5wcm90ZWN0RWxlbWVudDtcblxuY29uc3Qgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8qKlxuICogU3luY2hyb25pemVzIGNoYW5nZXMgZnJvbSB0aGUgbmV3VHJlZSBpbnRvIHRoZSBvbGRUcmVlLlxuICpcbiAqIEBwYXJhbSBvbGRUcmVlXG4gKiBAcGFyYW0gbmV3VHJlZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzeW5jKG9sZFRyZWUsIG5ld1RyZWUpIHtcbiAgbGV0IHBhdGNoZXMgPSB0aGlzO1xuICBsZXQgb2xkQ2hpbGROb2RlcyA9IG9sZFRyZWUuY2hpbGROb2RlcztcbiAgbGV0IG9sZENoaWxkTm9kZXNMZW5ndGggPSBvbGRDaGlsZE5vZGVzID8gb2xkQ2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuICBsZXQgb2xkRWxlbWVudCA9IG9sZFRyZWUuZWxlbWVudDtcblxuICBpZiAoIW5ld1RyZWUpIHtcbiAgICBsZXQgcmVtb3ZlZCA9IG9sZENoaWxkTm9kZXMuc3BsaWNlKDAsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogLTEsIGVsZW1lbnQ6IG9sZEVsZW1lbnQgfTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdW5wcm90ZWN0RWxlbWVudChyZW1vdmVkW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgbm9kZVZhbHVlID0gbmV3VHJlZS5ub2RlVmFsdWU7XG4gIGxldCBjaGlsZE5vZGVzID0gbmV3VHJlZS5jaGlsZE5vZGVzO1xuICBsZXQgY2hpbGROb2Rlc0xlbmd0aCA9IGNoaWxkTm9kZXMgPyBjaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG4gIGxldCBuZXdFbGVtZW50ID0gbmV3VHJlZS5lbGVtZW50O1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IHdlJ3JlIHJlcGxhY2luZyBpcyB0b3RhbGx5IGRpZmZlcmVudCBmcm9tIHRoZSBwcmV2aW91c1xuICAvLyByZXBsYWNlIHRoZSBlbnRpcmUgZWxlbWVudCwgZG9uJ3QgYm90aGVyIGludmVzdGlnYXRpbmcgY2hpbGRyZW4uXG4gIGlmIChvbGRUcmVlLm5vZGVOYW1lICE9PSBuZXdUcmVlLm5vZGVOYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmVwbGFjZSB0ZXh0IG5vZGUgdmFsdWVzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgaWYgKG5ld1RyZWUubm9kZU5hbWUgPT09ICcjdGV4dCcgJiYgb2xkVHJlZS5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgIC8vIFRleHQgY2hhbmdlZC5cbiAgICBpZiAob2xkVHJlZS5ub2RlVmFsdWUgIT09IG5vZGVWYWx1ZSkge1xuICAgICAgb2xkVHJlZS5ub2RlVmFsdWUgPSBub2RlVmFsdWU7XG5cbiAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0ge1xuICAgICAgICBfX2RvX186IDMsXG4gICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgIHZhbHVlOiBub2RlVmFsdWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gTW9zdCBjb21tb24gYWRkaXRpdmUgZWxlbWVudHMuXG4gIGlmIChjaGlsZE5vZGVzTGVuZ3RoID4gb2xkQ2hpbGROb2Rlc0xlbmd0aCkge1xuICAgIC8vIFN0b3JlIGVsZW1lbnRzIGluIGEgRG9jdW1lbnRGcmFnbWVudCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZSBhbmQgYmVcbiAgICAvLyBnZW5lcmFsbHkgc2ltcGxpZXIgdG8gd29yayB3aXRoLlxuICAgIGxldCBmcmFnbWVudCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IG9sZENoaWxkTm9kZXNMZW5ndGg7IGkgPCBjaGlsZE5vZGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb3RlY3RFbGVtZW50KGNoaWxkTm9kZXNbaV0pO1xuXG4gICAgICAvLyBJbnRlcm5hbGx5IGFkZCB0byB0aGUgdHJlZS5cbiAgICAgIG9sZENoaWxkTm9kZXNbb2xkQ2hpbGROb2Rlcy5sZW5ndGhdID0gY2hpbGROb2Rlc1tpXTtcblxuICAgICAgLy8gQWRkIHRvIHRoZSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgIGZyYWdtZW50W2ZyYWdtZW50Lmxlbmd0aF0gPSBjaGlsZE5vZGVzW2ldO1xuICAgIH1cblxuICAgIC8vIEFzc2lnbiB0aGUgZnJhZ21lbnQgdG8gdGhlIHBhdGNoZXMgdG8gYmUgaW5qZWN0ZWQuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7XG4gICAgICBfX2RvX186IDEsXG4gICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgZnJhZ21lbnQ6IGZyYWdtZW50XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJlcGxhY2UgZWxlbWVudHMgaWYgdGhleSBhcmUgZGlmZmVyZW50LlxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgIGlmIChvbGRDaGlsZE5vZGVzW2ldLm5vZGVOYW1lICE9PSBjaGlsZE5vZGVzW2ldLm5vZGVOYW1lKSB7XG4gICAgICAvLyBBZGQgdG8gdGhlIHBhdGNoZXMuXG4gICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgICAgX19kb19fOiAxLFxuICAgICAgICBvbGQ6IG9sZENoaWxkTm9kZXNbaV0sXG4gICAgICAgIG5ldzogY2hpbGROb2Rlc1tpXVxuICAgICAgfTtcblxuICAgICAgdW5wcm90ZWN0RWxlbWVudChvbGRDaGlsZE5vZGVzW2ldKTtcbiAgICAgIHByb3RlY3RFbGVtZW50KGNoaWxkTm9kZXNbaV0pO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBpbnRlcm5hbCB0cmVlJ3MgcG9pbnQgb2YgdmlldyBvZiB0aGlzIGVsZW1lbnQuXG4gICAgICBvbGRDaGlsZE5vZGVzW2ldID0gY2hpbGROb2Rlc1tpXTtcbiAgICB9XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlc2UgZWxlbWVudHMuXG4gIGlmIChvbGRDaGlsZE5vZGVzTGVuZ3RoID4gY2hpbGROb2Rlc0xlbmd0aCkge1xuICAgIC8vIEVsZW1lbnRzIHRvIHJlbW92ZS5cbiAgICBsZXQgdG9SZW1vdmUgPSBzbGljZS5jYWxsKG9sZENoaWxkTm9kZXMsIGNoaWxkTm9kZXNMZW5ndGgsXG4gICAgICBvbGRDaGlsZE5vZGVzTGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZWxlbWVudCwgdGhpcyBoYXBwZW5zIGJlZm9yZSB0aGUgc3BsaWNlIHNvIHRoYXQgd2Ugc3RpbGxcbiAgICAgIC8vIGhhdmUgYWNjZXNzIHRvIHRoZSBlbGVtZW50LlxuICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogMSwgb2xkOiB0b1JlbW92ZVtpXS5lbGVtZW50IH07XG4gICAgfVxuXG4gICAgbGV0IHJlbW92ZWQgPSBvbGRDaGlsZE5vZGVzLnNwbGljZShjaGlsZE5vZGVzTGVuZ3RoLFxuICAgICAgb2xkQ2hpbGROb2Rlc0xlbmd0aCAtIGNoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB1bnByb3RlY3RFbGVtZW50KHJlbW92ZWRbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmNocm9uaXplIGF0dHJpYnV0ZXNcbiAgbGV0IGF0dHJpYnV0ZXMgPSBuZXdUcmVlLmF0dHJpYnV0ZXM7XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBsZXQgb2xkTGVuZ3RoID0gb2xkVHJlZS5hdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICBsZXQgbmV3TGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICAvLyBTdGFydCB3aXRoIHRoZSBtb3N0IGNvbW1vbiwgYWRkaXRpdmUuXG4gICAgaWYgKG5ld0xlbmd0aCA+IG9sZExlbmd0aCkge1xuICAgICAgbGV0IHRvQWRkID0gc2xpY2UuY2FsbChhdHRyaWJ1dGVzLCBvbGRMZW5ndGgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9BZGRbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9BZGRbaV0udmFsdWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGF0dHIgPSBwb29scy5hdHRyaWJ1dGVPYmplY3QuZ2V0KCk7XG4gICAgICAgIGF0dHIubmFtZSA9IHRvQWRkW2ldLm5hbWU7XG4gICAgICAgIGF0dHIudmFsdWUgPSB0b0FkZFtpXS52YWx1ZTtcblxuICAgICAgICBwb29scy5hdHRyaWJ1dGVPYmplY3QucHJvdGVjdChhdHRyKTtcblxuICAgICAgICAvLyBQdXNoIHRoZSBjaGFuZ2Ugb2JqZWN0IGludG8gaW50byB0aGUgdmlydHVhbCB0cmVlLlxuICAgICAgICBvbGRUcmVlLmF0dHJpYnV0ZXNbb2xkVHJlZS5hdHRyaWJ1dGVzLmxlbmd0aF0gPSBhdHRyO1xuXG4gICAgICAgIC8vIEFkZCB0aGUgY2hhbmdlIHRvIHRoZSBzZXJpZXMgb2YgcGF0Y2hlcy5cbiAgICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSBjaGFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIHJlbW92YWxzLlxuICAgIGlmIChvbGRMZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgIGxldCB0b1JlbW92ZSA9IHNsaWNlLmNhbGwob2xkVHJlZS5hdHRyaWJ1dGVzLCBuZXdMZW5ndGgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9SZW1vdmVbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgbGV0IHJlbW92ZWQgPSBvbGRUcmVlLmF0dHJpYnV0ZXMuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC51bnByb3RlY3QocmVtb3ZlZFtpXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0gY2hhbmdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBtb2RpZmljYXRpb25zLlxuICAgIGxldCB0b01vZGlmeSA9IGF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvTW9kaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgb2xkQXR0clZhbHVlID0gb2xkVHJlZS5hdHRyaWJ1dGVzW2ldICYmIG9sZFRyZWUuYXR0cmlidXRlc1tpXS52YWx1ZTtcbiAgICAgIGxldCBuZXdBdHRyVmFsdWUgPSBhdHRyaWJ1dGVzW2ldICYmIGF0dHJpYnV0ZXNbaV0udmFsdWU7XG5cbiAgICAgIC8vIE9ubHkgcHVzaCBpbiBhIGNoYW5nZSBpZiB0aGUgYXR0cmlidXRlIG9yIHZhbHVlIGNoYW5nZXMuXG4gICAgICBpZiAob2xkQXR0clZhbHVlICE9PSBuZXdBdHRyVmFsdWUpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b01vZGlmeVtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB0b01vZGlmeVtpXS52YWx1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBhdHRyaWJ1dGUgaW4gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgbGV0IGF0dHIgPSBvbGRUcmVlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGF0dHIubmFtZSA9IHRvTW9kaWZ5W2ldLm5hbWU7XG4gICAgICAgIGF0dHIudmFsdWUgPSB0b01vZGlmeVtpXS52YWx1ZTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0gY2hhbmdlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmMgZWFjaCBjdXJyZW50IG5vZGUuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb2xkQ2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvbGRDaGlsZE5vZGVzW2ldLmVsZW1lbnQgIT09IGNoaWxkTm9kZXNbaV0uZWxlbWVudCkge1xuICAgICAgc3luYy5jYWxsKHBhdGNoZXMsIG9sZFRyZWUuY2hpbGROb2Rlc1tpXSwgY2hpbGROb2Rlc1tpXSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyB0cmFuc2l0aW9uU3RhdGVzIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnO1xuaW1wb3J0IHsgcG9vbHMgYXMgX3Bvb2xzIH0gZnJvbSAnLi4vdXRpbC9wb29scyc7XG5pbXBvcnQgZGVjb2RlRW50aXRpZXMgZnJvbSAnLi4vdXRpbC9kZWNvZGUnO1xuaW1wb3J0IGdldEVsZW1lbnQgZnJvbSAnLi4vZWxlbWVudC9nZXQnO1xuaW1wb3J0IG1ha2VOb2RlIGZyb20gJy4uL25vZGUvbWFrZSc7XG5cbmxldCBwb29scyA9IF9wb29scztcbmxldCBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG5cbi8qKlxuICogUHJvY2Vzc2VzIGFuIEFycmF5IG9mIHBhdGNoZXMuXG4gKlxuICogQHBhcmFtIGVcbiAqIEByZXR1cm5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJvY2VzcyhlbGVtZW50LCBlKSB7XG4gIGxldCBwYXRjaGVzID0gZS5kYXRhO1xuICBsZXQgc3RhdGVzID0gdHJhbnNpdGlvblN0YXRlcztcblxuICBsZXQgY2FsbENhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0aGlzKTtcbiAgfTtcblxuICBsZXQgYXR0YWNoZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGVsZW1lbnREZXNjcmlwdG9yKSB7XG4gICAgbGV0IGVsID0gZ2V0RWxlbWVudChlbGVtZW50RGVzY3JpcHRvcikuZWxlbWVudDtcbiAgICBsZXQgZnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50O1xuXG4gICAgaWYgKGVsLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IGRlY29kZUVudGl0aWVzKGVsLnRleHRDb250ZW50KTtcbiAgICB9XG5cbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbCk7XG4gIH07XG5cbiAgbGV0IHRpdGxlQ2FsbGJhY2sgPSBmdW5jdGlvbihlbGVtZW50RGVzY3JpcHRvcikge1xuICAgIGxldCBlbCA9IGdldEVsZW1lbnQoZWxlbWVudERlc2NyaXB0b3IpLmVsZW1lbnQ7XG5cbiAgICAvLyBFbnN1cmUgdGhlIHRpdGxlIGlzIHNldCBjb3JyZWN0bHkuXG4gICAgaWYgKGVsLnRhZ05hbWUgPT09ICd0aXRsZScpIHtcbiAgICAgIGVsLm93bmVyRG9jdW1lbnQudGl0bGUgPSBlbC5jaGlsZE5vZGVzWzBdLm5vZGVWYWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGF0Y2hlcyBhbmQgYXBwbHkgdGhlbS5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHBhdGNoID0gcGF0Y2hlc1tpXTtcbiAgICBsZXQgZWxlbWVudElkLCBvbGRJZCwgbmV3SWQsIHJlc3VsdDtcbiAgICBsZXQgZWxlbWVudCA9IHBhdGNoLm5ldztcblxuICAgIGlmIChwYXRjaC5lbGVtZW50KSB7XG4gICAgICByZXN1bHQgPSBnZXRFbGVtZW50KHBhdGNoLmVsZW1lbnQpO1xuICAgICAgcGF0Y2guZWxlbWVudCA9IHJlc3VsdC5lbGVtZW50O1xuICAgICAgZWxlbWVudElkID0gcmVzdWx0LnV1aWQ7XG4gICAgfVxuXG4gICAgaWYgKHBhdGNoLm9sZCkge1xuICAgICAgcmVzdWx0ID0gZ2V0RWxlbWVudChwYXRjaC5vbGQpO1xuICAgICAgcGF0Y2gub2xkID0gcmVzdWx0LmVsZW1lbnQ7XG4gICAgICBvbGRJZCA9IHJlc3VsdC51dWlkO1xuICAgIH1cblxuICAgIGlmIChwYXRjaC5uZXcpIHtcbiAgICAgIHJlc3VsdCA9IGdldEVsZW1lbnQocGF0Y2gubmV3KTtcbiAgICAgIHBhdGNoLm5ldyA9IHJlc3VsdC5lbGVtZW50O1xuICAgICAgbmV3SWQgPSByZXN1bHQudXVpZDtcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBwYXRjaC5uZXcudGV4dENvbnRlbnQgPSBkZWNvZGVFbnRpdGllcyhlbGVtZW50Lm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIE5vZGUuXG4gICAgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMCkge1xuICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoLm5ldywgcGF0Y2gub2xkKTtcbiAgICB9XG5cbiAgICAvLyBOb2RlIG1hbmlwLlxuICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMSkge1xuICAgICAgLy8gQWRkLlxuICAgICAgaWYgKHBhdGNoLmVsZW1lbnQgJiYgcGF0Y2guZnJhZ21lbnQgJiYgIXBhdGNoLm9sZCkge1xuICAgICAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgcGF0Y2guZnJhZ21lbnQuZm9yRWFjaChhdHRhY2hlZENhbGxiYWNrLCB7IGZyYWdtZW50IH0pO1xuICAgICAgICBwYXRjaC5lbGVtZW50LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICAgICAgICBmb3JFYWNoLmNhbGwocGF0Y2guZnJhZ21lbnQsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBnZXRFbGVtZW50KGVsKTtcblxuICAgICAgICAgIC8vIFRyaWdnZXIgYWxsIHRoZSB0ZXh0IGNoYW5nZWQgdmFsdWVzLlxuICAgICAgICAgIGlmIChzdGF0ZXMgJiYgZWwubm9kZU5hbWUgPT09ICcjdGV4dCcgJiYgc3RhdGVzLnRleHRDaGFuZ2VkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHN0YXRlcy50ZXh0Q2hhbmdlZC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSBzdGF0ZXMudGV4dENoYW5nZWRbeF07XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnQucGFyZW50Tm9kZSB8fCBlbGVtZW50LCBudWxsLCBlbC5ub2RlVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFkZGVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuYXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHN0YXRlcy5hdHRhY2hlZC5mb3JFYWNoKGNhbGxDYWxsYmFjaywgZWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRpdGxlQ2FsbGJhY2soZWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlXG4gICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgIXBhdGNoLm5ldykge1xuICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHJlbW92ZSB3aXRob3V0IHBhcmVudCwgaXMgdGhpcyB0aGUgJyArXG4gICAgICAgICAgICAnZG9jdW1lbnQgcm9vdD8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmRldGFjaGVkKSB7XG4gICAgICAgICAgc3RhdGVzLmRldGFjaGVkLmZvckVhY2goY2FsbENhbGxiYWNrLCBwYXRjaC5vbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5zdXJlIHRoZSB0aXRsZSBpcyBlbXB0aWVkLlxuICAgICAgICBpZiAocGF0Y2gub2xkLnRhZ05hbWUgPT09ICd0aXRsZScpIHtcbiAgICAgICAgICBwYXRjaC5vbGQub3duZXJEb2N1bWVudC50aXRsZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGF0Y2gub2xkKTtcblxuICAgICAgICBtYWtlTm9kZS5ub2Rlc1tvbGRJZF0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcGxhY2VcbiAgICAgIGVsc2UgaWYgKHBhdGNoLm9sZCAmJiBwYXRjaC5uZXcpIHtcbiAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCByZXBsYWNlIHdpdGhvdXQgcGFyZW50LCBpcyB0aGlzIHRoZSAnICtcbiAgICAgICAgICAgICdkb2N1bWVudCByb290PycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kIHRoZSBlbGVtZW50IGZpcnN0LCBiZWZvcmUgZG9pbmcgdGhlIHJlcGxhY2VtZW50LlxuICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocGF0Y2gubmV3LCBwYXRjaC5vbGQubmV4dFNpYmxpbmcpO1xuXG4gICAgICAgIC8vIFJlbW92ZWQgc3RhdGUgZm9yIHRyYW5zaXRpb25zIEFQSS5cbiAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuZGV0YWNoZWQpIHtcbiAgICAgICAgICBzdGF0ZXMuZGV0YWNoZWQuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2socGF0Y2gub2xkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlcGxhY2VkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLnJlcGxhY2VkKSB7XG4gICAgICAgICAgc3RhdGVzLnJlcGxhY2VkLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHBhdGNoLm9sZCwgcGF0Y2gubmV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGUgdGl0bGUgaXMgc2V0IGNvcnJlY3RseS5cbiAgICAgICAgaWYgKHBhdGNoLm5ldy50YWdOYW1lID09PSAndGl0bGUnKSB7XG4gICAgICAgICAgcGF0Y2gub2xkLm93bmVyRG9jdW1lbnQudGl0bGUgPSBwYXRjaC5uZXcuY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0Y2gubmV3LCBwYXRjaC5vbGQpO1xuXG4gICAgICAgIC8vIEFkZGVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dGFjaGVkKSB7XG4gICAgICAgICAgc3RhdGVzLmF0dGFjaGVkLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHBhdGNoLm5ldyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlTm9kZS5ub2Rlc1tvbGRJZF0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXR0cmlidXRlIG1hbmlwdWxhdGlvbi5cbiAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDIpIHtcbiAgICAgIGxldCBvcmlnaW5hbFZhbHVlID0gcGF0Y2guZWxlbWVudC5nZXRBdHRyaWJ1dGUocGF0Y2gubmFtZSk7XG5cbiAgICAgIC8vIFJlbW92ZS5cbiAgICAgIGlmICghcGF0Y2gudmFsdWUpIHsgcGF0Y2guZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUocGF0Y2gubmFtZSk7IH1cbiAgICAgIGVsc2UgeyBwYXRjaC5lbGVtZW50LnNldEF0dHJpYnV0ZShwYXRjaC5uYW1lLCBwYXRjaC52YWx1ZSk7IH1cblxuICAgICAgLy8gVHJpZ2dlciBhbGwgdGhlIGF0dHJpYnV0ZSBjaGFuZ2VkIHZhbHVlcy5cbiAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzdGF0ZXMuYXR0cmlidXRlQ2hhbmdlZC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgIGxldCBjYWxsYmFjayA9IHN0YXRlcy5hdHRyaWJ1dGVDaGFuZ2VkW3hdO1xuICAgICAgICAgIGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQsIHBhdGNoLm5hbWUsIG9yaWdpbmFsVmFsdWUsIHBhdGNoLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRleHQgbm9kZSBtYW5pcHVsYXRpb24uXG4gICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAzKSB7XG4gICAgICBsZXQgb3JpZ2luYWxWYWx1ZSA9IHBhdGNoLmVsZW1lbnQudGV4dENvbnRlbnQ7XG5cbiAgICAgIHBhdGNoLmVsZW1lbnQudGV4dENvbnRlbnQgPSBkZWNvZGVFbnRpdGllcyhwYXRjaC52YWx1ZSk7XG5cbiAgICAgIC8vIFRyaWdnZXIgYWxsIHRoZSB0ZXh0IGNoYW5nZWQgdmFsdWVzLlxuICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMudGV4dENoYW5nZWQpIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzdGF0ZXMudGV4dENoYW5nZWQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2sgPSBzdGF0ZXMudGV4dENoYW5nZWRbeF07XG4gICAgICAgICAgY2FsbGJhY2socGF0Y2guZWxlbWVudC5wYXJlbnROb2RlLCBvcmlnaW5hbFZhbHVlLCBwYXRjaC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIExpc3Qgb2YgU1ZHIGVsZW1lbnRzLlxuZXhwb3J0IGxldCBlbGVtZW50cyA9IFtcbiAgJ2FsdEdseXBoJyxcbiAgJ2FsdEdseXBoRGVmJyxcbiAgJ2FsdEdseXBoSXRlbScsXG4gICdhbmltYXRlJyxcbiAgJ2FuaW1hdGVDb2xvcicsXG4gICdhbmltYXRlTW90aW9uJyxcbiAgJ2FuaW1hdGVUcmFuc2Zvcm0nLFxuICAnY2lyY2xlJyxcbiAgJ2NsaXBQYXRoJyxcbiAgJ2NvbG9yLXByb2ZpbGUnLFxuICAnY3Vyc29yJyxcbiAgJ2RlZnMnLFxuICAnZGVzYycsXG4gICdlbGxpcHNlJyxcbiAgJ2ZlQmxlbmQnLFxuICAnZmVDb2xvck1hdHJpeCcsXG4gICdmZUNvbXBvbmVudFRyYW5zZmVyJyxcbiAgJ2ZlQ29tcG9zaXRlJyxcbiAgJ2ZlQ29udm9sdmVNYXRyaXgnLFxuICAnZmVEaWZmdXNlTGlnaHRpbmcnLFxuICAnZmVEaXNwbGFjZW1lbnRNYXAnLFxuICAnZmVEaXN0YW50TGlnaHQnLFxuICAnZmVGbG9vZCcsXG4gICdmZUZ1bmNBJyxcbiAgJ2ZlRnVuY0InLFxuICAnZmVGdW5jRycsXG4gICdmZUZ1bmNSJyxcbiAgJ2ZlR2F1c3NpYW5CbHVyJyxcbiAgJ2ZlSW1hZ2UnLFxuICAnZmVNZXJnZScsXG4gICdmZU1lcmdlTm9kZScsXG4gICdmZU1vcnBob2xvZ3knLFxuICAnZmVPZmZzZXQnLFxuICAnZmVQb2ludExpZ2h0JyxcbiAgJ2ZlU3BlY3VsYXJMaWdodGluZycsXG4gICdmZVNwb3RMaWdodCcsXG4gICdmZVRpbGUnLFxuICAnZmVUdXJidWxlbmNlJyxcbiAgJ2ZpbHRlcicsXG4gICdmb250JyxcbiAgJ2ZvbnQtZmFjZScsXG4gICdmb250LWZhY2UtZm9ybWF0JyxcbiAgJ2ZvbnQtZmFjZS1uYW1lJyxcbiAgJ2ZvbnQtZmFjZS1zcmMnLFxuICAnZm9udC1mYWNlLXVyaScsXG4gICdmb3JlaWduT2JqZWN0JyxcbiAgJ2cnLFxuICAnZ2x5cGgnLFxuICAnZ2x5cGhSZWYnLFxuICAnaGtlcm4nLFxuICAnaW1hZ2UnLFxuICAnbGluZScsXG4gICdsaW5lYXJHcmFkaWVudCcsXG4gICdtYXJrZXInLFxuICAnbWFzaycsXG4gICdtZXRhZGF0YScsXG4gICdtaXNzaW5nLWdseXBoJyxcbiAgJ21wYXRoJyxcbiAgJ3BhdGgnLFxuICAncGF0dGVybicsXG4gICdwb2x5Z29uJyxcbiAgJ3BvbHlsaW5lJyxcbiAgJ3JhZGlhbEdyYWRpZW50JyxcbiAgJ3JlY3QnLFxuICAnc2NyaXB0JyxcbiAgJ3NldCcsXG4gICdzdG9wJyxcbiAgJ3N0eWxlJyxcbiAgJ3N2ZycsXG4gICdzd2l0Y2gnLFxuICAnc3ltYm9sJyxcbiAgJ3RleHQnLFxuICAndGV4dFBhdGgnLFxuICAndGl0bGUnLFxuICAndHJlZicsXG4gICd0c3BhbicsXG4gICd1c2UnLFxuICAndmlldycsXG4gICd2a2VybicsXG5dO1xuXG4vLyBOYW1lc3BhY2UuXG5leHBvcnQgbGV0IG5hbWVzcGFjZSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4iLCIvKipcbiAqIFRyYW5zaXRpb24gc3RhdGVzXG4gKiA9PT09PT09PT09PT09PT09PVxuICpcbiAqIC0gYXR0YWNoZWQgLSBGb3Igd2hlbiBlbGVtZW50cyBjb21lIGludG8gdGhlIERPTS4gVGhlIGNhbGxiYWNrIHRyaWdnZXJzXG4gKiAtLS0tLS0tLS0tLS0gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGVsZW1lbnQgZW50ZXJzIHRoZSBET00uIEl0IGlzIGNhbGxlZCB3aXRoXG4gKiAgICAgICAgICAgICAgdGhlIGVsZW1lbnQgYXMgdGhlIG9ubHkgYXJndW1lbnQuXG4gKlxuICogLSBkZXRhY2hlZCAtIEZvciB3aGVuIGVsZW1lbnRzIGFyZSByZW1vdmVkIGZyb20gdGhlIERPTS4gVGhlIGNhbGxiYWNrXG4gKiAtLS0tLS0tLS0tLS0gdHJpZ2dlcnMganVzdCBiZWZvcmUgdGhlIGVsZW1lbnQgbGVhdmVzIHRoZSBET00uIEl0IGlzIGNhbGxlZFxuICogICAgICAgICAgICAgIHdpdGggdGhlIGVsZW1lbnQgYXMgdGhlIG9ubHkgYXJndW1lbnQuXG4gKlxuICogLSByZXBsYWNlZCAtIEZvciB3aGVuIGVsZW1lbnRzIGFyZSByZXBsYWNlZCBpbiB0aGUgRE9NLiBUaGUgY2FsbGJhY2tcbiAqIC0tLS0tLS0tLS0tLSB0cmlnZ2VycyBhZnRlciB0aGUgbmV3IGVsZW1lbnQgZW50ZXJzIHRoZSBET00sIGFuZCBiZWZvcmUgdGhlXG4gKiAgICAgICAgICAgICAgb2xkIGVsZW1lbnQgbGVhdmVzLiBJdCBpcyBjYWxsZWQgd2l0aCBvbGQgYW5kIG5ldyBlbGVtZW50cyBhc1xuICogICAgICAgICAgICAgIGFyZ3VtZW50cywgaW4gdGhhdCBvcmRlci5cbiAqXG4gKiAtIGF0dHJpYnV0ZUNoYW5nZWQgLSBUcmlnZ2VyZWQgd2hlbiBhbiBlbGVtZW50J3MgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLiBUaGVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tIGNhbGxiYWNrIHRyaWdnZXJzIGFmdGVyIHRoZSBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQgaW5cbiAqICAgICAgICAgICAgICAgICAgICAgIHRoZSBET00uIEl0IGlzIGNhbGxlZCB3aXRoIHRoZSBlbGVtZW50LCB0aGUgYXR0cmlidXRlXG4gKiAgICAgICAgICAgICAgICAgICAgICBuYW1lLCBvbGQgdmFsdWUsIGFuZCBjdXJyZW50IHZhbHVlLlxuICpcbiAqIC0gdGV4dENoYW5nZWQgLSBUcmlnZ2VyZWQgd2hlbiBhbiBlbGVtZW50J3MgYHRleHRDb250ZW50YCBjaG5hZ2VzLiBUaGVcbiAqIC0tLS0tLS0tLS0tLS0tLSBjYWxsYmFjayB0cmlnZ2VycyBhZnRlciB0aGUgdGV4dENvbnRlbnQgaGFzIGNoYW5nZWQgaW4gdGhlXG4gKiAgICAgICAgICAgICAgICAgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCwgdGhlIG9sZCB2YWx1ZSwgYW5kXG4gKiAgICAgICAgICAgICAgICAgY3VycmVudCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGxldCB0cmFuc2l0aW9uU3RhdGVzID0ge1xuICBhdHRhY2hlZDogW10sXG4gIGRldGFjaGVkOiBbXSxcbiAgcmVwbGFjZWQ6IFtdLFxuICBhdHRyaWJ1dGVDaGFuZ2VkOiBbXSxcbiAgdGV4dENoYW5nZWQ6IFtdXG59O1xuIiwiLy8gQ3JlYXRlIGEgZGVmYXVsdCBidWZmZXIgYXQgbGVuZ3RoIDEwMjQuXG5sZXQgYnVmZmVyID0gbmV3IFVpbnQxNkFycmF5KDApO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIHRvIGEgYnVmZmVyLiBBdHRlbXB0cyB0byByZXVzZSB0aGUgcHJldmlvdXMgYnVmZmVyLCB1bmxlc3NcbiAqIHRoZSBuZXcgSFRNTCBoYXMgYSBsb25nZXIgbGVuZ3RoLlxuICpcbiAqIEBwYXJhbSBzdHJpbmdcbiAqIEByZXR1cm4ge1VpbnQxNkFycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9CdWZmZXIoc3RyaW5nKSB7XG4gIGlmIChzdHJpbmcubGVuZ3RoID4gYnVmZmVyLmxlbmd0aCkge1xuICAgIGJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShzdHJpbmcubGVuZ3RoKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgYnVmZmVyW2ldID0gc3RyaW5nLmNvZGVQb2ludEF0KGkpO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIFVpbnQxNkFycmF5IHRvIGEgU3RyaW5nLlxuICpcbiAqIEBwYXJhbSBidWZmZXIgLSBBIFVpbnQxNkFycmF5IGJ1ZmZlciB0byBjb252ZXJ0LlxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVG9TdHJpbmcoYnVmZmVyLCBvZmZzZXQpIHtcbiAgbGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShidWZmZXIsIDAsIG9mZnNldCk7XG4gIGxldCBzdHJpbmcgPSAnJztcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcEJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgIHN0cmluZyArPSBTdHJpbmcuZnJvbUNvZGVQb2ludCh0bXBCdWZmZXJbaV0pO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZztcbn1cbiIsImxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbi8qKlxuICogRGVjb2RlJ3MgSFRNTCBlbnRpdGllcy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzMDkxMjY2XG4gKiBAcGFyYW0gc3RyaW5naW5nXG4gKiBAcmV0dXJuIHVuZXNjYXBlZCBkZWNvZGVkIEhUTUxcbiAqL1xuZnVuY3Rpb24gZGVjb2RlRW50aXRpZXMoc3RyaW5nKSB7XG4gIC8vIEVzY2FwZSBIVE1MIGJlZm9yZSBkZWNvZGluZyBmb3IgSFRNTCBFbnRpdGllc1xuICBsZXQgZXNjYXBlZCA9IGVzY2FwZShzdHJpbmcpXG4gICAgLnJlcGxhY2UoLyUyNi9nLCcmJylcbiAgICAucmVwbGFjZSgvJTIzL2csJyMnKVxuICAgIC5yZXBsYWNlKC8lM0IvZywnOycpO1xuXG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gZXNjYXBlZDtcblxuICByZXR1cm4gdW5lc2NhcGUoZWxlbWVudC50ZXh0Q29udGVudCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29kZUVudGl0aWVzO1xuIiwiLy8gQ29kZSBiYXNlZCBvZmYgb2Y6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vYXNoaTAwOS9ub2RlLWZhc3QtaHRtbC1wYXJzZXJcblxuaW1wb3J0IHsgcG9vbHMgYXMgX3Bvb2xzIH0gZnJvbSAnLi9wb29scyc7XG5cbmxldCBwb29scyA9IF9wb29scztcbmxldCBwYXJzZXIgPSBtYWtlUGFyc2VyKCk7XG5cbi8qKlxuICogcGFyc2VIVE1MXG4gKlxuICogQHBhcmFtIG5ld0hUTUxcbiAqIEByZXR1cm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSFRNTChuZXdIVE1MLCBpc0lubmVyKSB7XG4gIGxldCBkb2N1bWVudEVsZW1lbnQgPSBwYXJzZXIucGFyc2UobmV3SFRNTCk7XG4gIGxldCBub2RlcyA9IGRvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzO1xuXG4gIHJldHVybiBpc0lubmVyID8gbm9kZXMgOiBub2Rlc1swXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQYXJzZXIoKSB7XG4gIGxldCBrTWFya3VwUGF0dGVybiA9XG4gICAgLzwhLS1bXl0qPyg/PS0tPiktLT58PChcXC8/KShbYS16XFwtXVthLXowLTlcXC1dKilcXHMqKFtePl0qPykoXFwvPyk+L2lnO1xuXG4gIGxldCBrQXR0cmlidXRlUGF0dGVybiA9IC9cXGIoaWR8Y2xhc3MpXFxzKj1cXHMqKFwiKFteXCJdKylcInwnKFteJ10rKSd8KFxcUyspKS9pZztcblxuICBsZXQgcmVBdHRyUGF0dGVybiA9XG4gICAgL1xcYihbYS16XVthLXowLTlcXC1dKilcXHMqPVxccyooXCIoW15cIl0rKVwifCcoW14nXSspJ3woXFxTKykpL2lnO1xuXG4gIGxldCBrQmxvY2tFbGVtZW50cyA9IHtcbiAgICBkaXY6IHRydWUsXG4gICAgcDogdHJ1ZSxcbiAgICBsaTogdHJ1ZSxcbiAgICB0ZDogdHJ1ZSxcbiAgICBzZWN0aW9uOiB0cnVlLFxuICAgIGJyOiB0cnVlXG4gIH07XG5cbiAgbGV0IGtTZWxmQ2xvc2luZ0VsZW1lbnRzID0ge1xuICAgIG1ldGE6IHRydWUsXG4gICAgaW1nOiB0cnVlLFxuICAgIGxpbms6IHRydWUsXG4gICAgaW5wdXQ6IHRydWUsXG4gICAgYXJlYTogdHJ1ZSxcbiAgICBicjogdHJ1ZSxcbiAgICBocjogdHJ1ZVxuICB9O1xuXG4gIGxldCBrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmcgPSB7XG4gICAgbGk6IHtcbiAgICAgIGxpOiB0cnVlXG4gICAgfSxcblxuICAgIHA6IHtcbiAgICAgIHA6IHRydWUsIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICB0ZDoge1xuICAgICAgdGQ6IHRydWUsIHRoOiB0cnVlXG4gICAgfSxcblxuICAgIHRoOiB7XG4gICAgICB0ZDogdHJ1ZSwgdGg6IHRydWVcbiAgICB9XG4gIH07XG5cbiAgbGV0IGtFbGVtZW50c0Nsb3NlZEJ5Q2xvc2luZyA9IHtcbiAgICBsaToge1xuICAgICAgdWw6IHRydWUsIG9sOiB0cnVlXG4gICAgfSxcblxuICAgIGE6IHtcbiAgICAgIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICBiOiB7XG4gICAgICBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgaToge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHA6IHtcbiAgICAgIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICB0ZDoge1xuICAgICAgdHI6IHRydWUsIHRhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIHRoOiB7XG4gICAgICB0cjogdHJ1ZSwgdGFibGU6IHRydWVcbiAgICB9XG4gIH07XG5cbiAgbGV0IGtCbG9ja1RleHRFbGVtZW50cyA9IHtcbiAgICBzY3JpcHQ6IHRydWUsXG4gICAgbm9zY3JpcHQ6IHRydWUsXG4gICAgc3R5bGU6IHRydWUsXG4gICAgcHJlOiB0cnVlXG4gIH07XG5cbiAgLyoqXG4gICAqIFRleHROb2RlIHRvIGNvbnRhaW4gYSB0ZXh0IGVsZW1lbnQgaW4gRE9NIHRyZWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBmdW5jdGlvbiBUZXh0Tm9kZSh2YWx1ZSkge1xuICAgIGxldCBpbnN0YW5jZSA9IHBvb2xzLmVsZW1lbnRPYmplY3QuZ2V0KCk7XG5cbiAgICBpbnN0YW5jZS5ub2RlVmFsdWUgPSB2YWx1ZTtcbiAgICBpbnN0YW5jZS5ub2RlTmFtZSA9ICcjdGV4dCc7XG4gICAgaW5zdGFuY2Uubm9kZVR5cGUgPSAzO1xuICAgIGluc3RhbmNlLmNoaWxkTm9kZXMubGVuZ3RoID0gMDtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIVE1MRWxlbWVudCwgd2hpY2ggY29udGFpbnMgYSBzZXQgb2YgY2hpbGRyZW4uXG4gICAqXG4gICAqIE5vdGU6IHRoaXMgaXMgYSBtaW5pbWFsaXN0IGltcGxlbWVudGF0aW9uLCBubyBjb21wbGV0ZSB0cmVlIHN0cnVjdHVyZVxuICAgKiBwcm92aWRlZCAobm8gcGFyZW50Tm9kZSwgbmV4dFNpYmxpbmcsIHByZXZpb3VzU2libGluZyBldGMpLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgbm9kZU5hbWVcbiAgICogQHBhcmFtIHtPYmplY3R9IGtleUF0dHJzIGlkIGFuZCBjbGFzcyBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHJhd0F0dHJzIGF0dHJpYnV0ZXMgaW4gc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiBIVE1MRWxlbWVudChuYW1lLCBrZXlBdHRycywgcmF3QXR0cnMpIHtcbiAgICBsZXQgaW5zdGFuY2UgPSBwb29scy5lbGVtZW50T2JqZWN0LmdldCgpO1xuXG4gICAgaW5zdGFuY2Uubm9kZU5hbWUgPSBuYW1lO1xuICAgIGluc3RhbmNlLm5vZGVUeXBlID0gMTtcbiAgICBpbnN0YW5jZS5hdHRyaWJ1dGVzLmxlbmd0aCA9IDA7XG4gICAgaW5zdGFuY2UuY2hpbGROb2Rlcy5sZW5ndGggPSAwO1xuXG4gICAgaWYgKHJhd0F0dHJzKSB7XG4gICAgICBmb3IgKGxldCBtYXRjaDsgbWF0Y2ggPSByZUF0dHJQYXR0ZXJuLmV4ZWMocmF3QXR0cnMpOyApIHtcbiAgICAgICAgbGV0IGF0dHIgPSBwb29scy5hdHRyaWJ1dGVPYmplY3QuZ2V0KCk7XG5cbiAgICAgICAgYXR0ci5uYW1lID0gbWF0Y2hbMV07XG4gICAgICAgIGF0dHIudmFsdWUgPSBtYXRjaFszXSB8fCBtYXRjaFs0XSB8fCBtYXRjaFs1XTtcblxuICAgICAgICBpbnN0YW5jZS5hdHRyaWJ1dGVzW2luc3RhbmNlLmF0dHJpYnV0ZXMubGVuZ3RoXSA9IGF0dHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBIVE1MIGFuZCByZXR1cm5zIGEgcm9vdCBlbGVtZW50XG4gICAqL1xuICBsZXQgaHRtbFBhcnNlciA9IHtcbiAgICAvKipcbiAgICAgKiBQYXJzZSBhIGNodWNrIG9mIEhUTUwgc291cmNlLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZGF0YSAgICAgIGh0bWxcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICByb290IGVsZW1lbnRcbiAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24oZGF0YSwgb3B0aW9ucykge1xuICAgICAgbGV0IHJvb3RPYmplY3QgPSBwb29scy5vYmplY3QuZ2V0KCk7XG4gICAgICBsZXQgcm9vdCA9IEhUTUxFbGVtZW50KG51bGwsIHJvb3RPYmplY3QpO1xuICAgICAgbGV0IGN1cnJlbnRQYXJlbnQgPSByb290O1xuICAgICAgbGV0IHN0YWNrID0gW3Jvb3RdO1xuICAgICAgbGV0IGxhc3RUZXh0UG9zID0gLTE7XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHBvb2xzLm9iamVjdC5nZXQoKTtcblxuICAgICAgaWYgKGRhdGEuaW5kZXhPZignPCcpID09PSAtMSAmJiBkYXRhKSB7XG4gICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoXSA9IFRleHROb2RlKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiByb290O1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBtYXRjaCwgdGV4dDsgbWF0Y2ggPSBrTWFya3VwUGF0dGVybi5leGVjKGRhdGEpOyApIHtcbiAgICAgICAgaWYgKGxhc3RUZXh0UG9zID4gLTEpIHtcbiAgICAgICAgICBpZiAobGFzdFRleHRQb3MgKyBtYXRjaFswXS5sZW5ndGggPCBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIGlmIGhhcyBjb250ZW50XG4gICAgICAgICAgICB0ZXh0ID0gZGF0YS5zbGljZShsYXN0VGV4dFBvcywga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4IC0gbWF0Y2hbMF0ubGVuZ3RoKTtcblxuICAgICAgICAgICAgaWYgKHRleHQudHJpbSgpKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoXSA9IFRleHROb2RlKHRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4O1xuXG4gICAgICAgIC8vIFRoaXMgaXMgYSBjb21tZW50LlxuICAgICAgICBpZiAobWF0Y2hbMF1bMV0gPT09ICchJykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubG93ZXJDYXNlVGFnTmFtZSkge1xuICAgICAgICAgIG1hdGNoWzJdID0gbWF0Y2hbMl0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWF0Y2hbMV0pIHtcbiAgICAgICAgICAvLyBub3QgPC8gdGFnc1xuICAgICAgICAgIGxldCBhdHRycyA9IHBvb2xzLm9iamVjdC5nZXQoKTtcblxuICAgICAgICAgIGZvciAobGV0IGF0dE1hdGNoOyBhdHRNYXRjaCA9IGtBdHRyaWJ1dGVQYXR0ZXJuLmV4ZWMobWF0Y2hbM10pOyApIHtcbiAgICAgICAgICAgIGF0dHJzW2F0dE1hdGNoWzFdXSA9IGF0dE1hdGNoWzNdIHx8IGF0dE1hdGNoWzRdIHx8IGF0dE1hdGNoWzVdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbWF0Y2hbNF0gJiYga0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdKSB7XG4gICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50LmNoaWxkTm9kZXNbY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLnB1c2goXG4gICAgICAgICAgICAgIEhUTUxFbGVtZW50KG1hdGNoWzJdLCBhdHRycywgbWF0Y2hbM10pKSAtIDFdO1xuXG4gICAgICAgICAgc3RhY2sucHVzaChjdXJyZW50UGFyZW50KTtcblxuICAgICAgICAgIGlmIChrQmxvY2tUZXh0RWxlbWVudHNbbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAvLyBhIGxpdHRsZSB0ZXN0IHRvIGZpbmQgbmV4dCA8L3NjcmlwdD4gb3IgPC9zdHlsZT4gLi4uXG4gICAgICAgICAgICBsZXQgY2xvc2VNYXJrdXAgPSAnPC8nICsgbWF0Y2hbMl0gKyAnPic7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBkYXRhLmluZGV4T2YoY2xvc2VNYXJrdXAsIGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGVyZSBpcyBubyBtYXRjaGluZyBlbmRpbmcgZm9yIHRoZSB0ZXh0IGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgdGV4dCA9IGRhdGEuc2xpY2Uoa01hcmt1cFBhdHRlcm4ubGFzdEluZGV4KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gZGF0YS5zbGljZShrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgsIGluZGV4KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkTm9kZXNbY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aF0gPSBUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4ID0gZGF0YS5sZW5ndGggKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4ID0gaW5kZXggKyBjbG9zZU1hcmt1cC5sZW5ndGg7XG4gICAgICAgICAgICAgIG1hdGNoWzFdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzFdIHx8IG1hdGNoWzRdIHx8IGtTZWxmQ2xvc2luZ0VsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgIC8vIDwvIG9yIC8+IG9yIDxicj4gZXRjLlxuICAgICAgICAgIHdoaWxlICh0cnVlICYmIGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFyZW50Lm5vZGVOYW1lID09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIGNsb3NlIGN1cnJlbnQgdGFnLCBhbmQgbW92ZSBvblxuICAgICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtFbGVtZW50c0Nsb3NlZEJ5Q2xvc2luZ1tjdXJyZW50UGFyZW50Lm5vZGVOYW1lXVttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBVc2UgYWdncmVzc2l2ZSBzdHJhdGVneSB0byBoYW5kbGUgdW5tYXRjaGluZyBtYXJrdXBzLlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBodG1sUGFyc2VyO1xufTtcbiIsImltcG9ydCBfdXVpZCBmcm9tICcuL3V1aWQnO1xuXG5jb25zdCB1dWlkID0gX3V1aWQ7XG5leHBvcnQgbGV0IHBvb2xzID0ge307XG5leHBvcnQgbGV0IGNvdW50ID0gMTAwMDA7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHBvb2wgdG8gcXVlcnkgbmV3IG9yIHJldXNlZCB2YWx1ZXMgZnJvbS5cbiAqXG4gKiBAcGFyYW0gb3B0c1xuICogQHJldHVybiB7T2JqZWN0fSBwb29sXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQb29sKG9wdHMpIHtcbiAgbGV0IHsgc2l6ZSwgZmlsbCB9ID0gb3B0cztcbiAgbGV0IGZyZWUgPSBbXTtcbiAgbGV0IGFsbG9jYXRlZCA9IFtdO1xuICBsZXQgcHJvdGVjdCA9IFtdO1xuXG4gIC8vIFByaW1lIHRoZSBjYWNoZSB3aXRoIG4gb2JqZWN0cy5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBmcmVlW2ldID0gZmlsbCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfZnJlZTogZnJlZSxcbiAgICBfYWxsb2NhdGVkOiBhbGxvY2F0ZWQsXG4gICAgX3V1aWQ6IFtdLFxuXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBvYmogPSBudWxsO1xuICAgICAgbGV0IGZyZWVMZW5ndGggPSBmcmVlLmxlbmd0aDtcbiAgICAgIGxldCBtaW51c09uZSA9IGZyZWVMZW5ndGggLSAxO1xuXG4gICAgICBpZiAoZnJlZUxlbmd0aCkge1xuICAgICAgICBvYmogPSBmcmVlW21pbnVzT25lXTtcbiAgICAgICAgZnJlZS5sZW5ndGggPSBtaW51c09uZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBvYmogPSBmaWxsKCk7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5wdXNoKG9iaik7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuICAgIHByb3RlY3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBsZXQgaWR4ID0gYWxsb2NhdGVkLmluZGV4T2YodmFsdWUpO1xuICAgICAgcHJvdGVjdC5wdXNoKGFsbG9jYXRlZC5zcGxpY2UoaWR4LCAxKVswXSk7XG5cbiAgICAgIC8vIEZJWE1FIHRoaXMgaXNuJ3Qgc3BlY2lmaWMgZW5vdWdoLCB3ZSBuZWVkIGEgYmV0dGVyIHdheSB0byBjYWNoZSB0aGVcbiAgICAgIC8vIGN1cnJlbnRseSB1c2VkIHV1aWRzLlxuICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fdXVpZC5wdXNoKHZhbHVlLmVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB1bnByb3RlY3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBsZXQgaWR4ID0gcHJvdGVjdC5pbmRleE9mKHZhbHVlKTtcbiAgICAgIGxldCBmcmVlTGVuZ3RoID0gZnJlZS5sZW5ndGg7XG5cbiAgICAgIGlmIChmcmVlTGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgICBsZXQgb2JqID0gcHJvdGVjdC5zcGxpY2UoaWR4LCAxKVswXTtcblxuICAgICAgICBpZiAob2JqKSB7IGZyZWUucHVzaChvYmopOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIEZJWE1FIFJlYWQgYWJvdmUgRklYTUVcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5lbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3V1aWQuc3BsaWNlKHRoaXMuX3V1aWQuaW5kZXhPZih2YWx1ZS5lbGVtZW50KSwgMSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZyZWVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGFsbG9jYXRlZExlbmd0aCA9IGFsbG9jYXRlZC5sZW5ndGg7XG4gICAgICBsZXQgZnJlZUxlbmd0aCA9IGZyZWUubGVuZ3RoO1xuXG4gICAgICBmcmVlLnB1c2guYXBwbHkoZnJlZSwgYWxsb2NhdGVkLnNsaWNlKDAsIHNpemUgLSBmcmVlTGVuZ3RoKSk7XG5cbiAgICAgIGFsbG9jYXRlZC5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBmcmVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgbGV0IGlkeCA9IGFsbG9jYXRlZC5pbmRleE9mKHZhbHVlKTtcblxuICAgICAgLy8gQWxyZWFkeSBmcmVlZC5cbiAgICAgIGlmIChpZHggPT09IC0xKSB7IHJldHVybjsgfVxuXG4gICAgICAvLyBPbmx5IHB1dCBiYWNrIGludG8gdGhlIGZyZWUgcXVldWUgaWYgd2UncmUgdW5kZXIgdGhlIHNpemUuXG4gICAgICBpZiAoZnJlZS5sZW5ndGggPCBzaXplKSB7XG4gICAgICAgIGZyZWUucHVzaCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVQb29scyhDT1VOVCkge1xuICBwb29scy5hdHRyaWJ1dGVPYmplY3QgPSBjcmVhdGVQb29sKHtcbiAgICBzaXplOiBDT1VOVCxcblxuICAgIGZpbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgbmFtZTogJycsIHZhbHVlOiAnJyB9O1xuICAgIH1cbiAgfSk7XG5cbiAgcG9vbHMuZWxlbWVudE9iamVjdCA9IGNyZWF0ZVBvb2woe1xuICAgIHNpemU6IENPVU5ULFxuXG4gICAgZmlsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVtZW50OiB1dWlkKCksXG4gICAgICAgIGNoaWxkTm9kZXM6IFtdLFxuICAgICAgICBhdHRyaWJ1dGVzOiBbXVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuXG4gIHBvb2xzLm9iamVjdCA9IGNyZWF0ZVBvb2woe1xuICAgIHNpemU6IENPVU5ULFxuXG4gICAgZmlsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuLy8gQ3JlYXRlIDEwayBpdGVtcyBvZiBlYWNoIHR5cGUuXG5pbml0aWFsaXplUG9vbHMoY291bnQpO1xuIiwiaW1wb3J0IHsgcG9vbHMgYXMgX3Bvb2xzIH0gZnJvbSAnLi4vdXRpbC9wb29scyc7XG5cbmxldCBwb29scyA9IF9wb29scztcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3RlY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgcG9vbHMuZWxlbWVudE9iamVjdC5wcm90ZWN0KGVsZW1lbnQpO1xuXG4gIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKHByb3RlY3RFbGVtZW50KTtcbiAgZWxlbWVudC5hdHRyaWJ1dGVzLmZvckVhY2gocG9vbHMuYXR0cmlidXRlT2JqZWN0LnByb3RlY3QsXG4gICAgcG9vbHMuYXR0cmlidXRlT2JqZWN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucHJvdGVjdEVsZW1lbnQoZWxlbWVudCkge1xuICBwb29scy5lbGVtZW50T2JqZWN0LnVucHJvdGVjdChlbGVtZW50KTtcblxuICBlbGVtZW50LmNoaWxkTm9kZXMuZm9yRWFjaCh1bnByb3RlY3RFbGVtZW50KTtcbiAgZWxlbWVudC5hdHRyaWJ1dGVzLmZvckVhY2gocG9vbHMuYXR0cmlidXRlT2JqZWN0LnVucHJvdGVjdCxcbiAgICBwb29scy5hdHRyaWJ1dGVPYmplY3QpO1xufVxuIiwiLyoqXG4gKiBHZW5lcmF0ZXMgYSB1dWlkLlxuICpcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyMy8yODIxNzVcbiAqIEByZXR1cm4ge3N0cmluZ30gdXVpZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpKjE2fDAsIHYgPSBjID09ICd4JyA/IHIgOiAociYweDN8MHg4KTtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHV1aWQgZnJvbSAnLi4vdXRpbC91dWlkJztcbmltcG9ydCAqIGFzIGJ1ZmZlcnMgZnJvbSAnLi4vdXRpbC9idWZmZXJzJztcbmltcG9ydCB7IHBvb2xzIGFzIF9wb29scywgaW5pdGlhbGl6ZVBvb2xzLCBjcmVhdGVQb29sIH0gZnJvbSAnLi4vdXRpbC9wb29scyc7XG5pbXBvcnQgeyBjb3VudCBhcyBwb29sQ291bnQgfSBmcm9tICcuLi91dGlsL3Bvb2xzJztcbmltcG9ydCB7IHBhcnNlSFRNTCwgbWFrZVBhcnNlciB9IGZyb20gJy4uL3V0aWwvcGFyc2VyJztcbmltcG9ydCB7IHByb3RlY3RFbGVtZW50LCB1bnByb3RlY3RFbGVtZW50IH0gZnJvbSAnLi4vdXRpbC9wcm90ZWN0JztcbmltcG9ydCBzeW5jTm9kZSBmcm9tICcuLi9ub2RlL3N5bmMnO1xuaW1wb3J0IHdvcmtlclNvdXJjZSBmcm9tICcuL3NvdXJjZSc7XG5cbmxldCBwb29scyA9IF9wb29scztcblxuZXhwb3J0IGxldCBoYXNXb3JrZXIgPSB0eXBlb2YgV29ya2VyID09PSAnZnVuY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCkge1xuICBsZXQgd29ya2VyQmxvYiA9IG51bGw7XG4gIGxldCB3b3JrZXIgPSBudWxsO1xuXG4gIC8vIFNldCB1cCBhIFdlYldvcmtlciBpZiBhdmFpbGFibGUuXG4gIGlmIChoYXNXb3JrZXIpIHtcbiAgICAvLyBDb25zdHJ1Y3QgdGhlIHdvcmtlciByZXVzaW5nIGNvZGUgYWxyZWFkeSBvcmdhbml6ZWQgaW50byBtb2R1bGVzLiAgS2VlcFxuICAgIC8vIHRoaXMgY29kZSBFUzUgc2luY2Ugd2UgZG8gbm90IGdldCB0aW1lIHRvIHByZS1wcm9jZXNzIGl0IGFzIEVTNi5cbiAgICB3b3JrZXJCbG9iID0gbmV3IEJsb2IoW1xuICAgICAgW1xuICAgICAgICAvLyBSZXVzYWJsZSBBcnJheSBtZXRob2RzLlxuICAgICAgICAndmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlOycsXG5cbiAgICAgICAgLy8gQWRkIGEgbmFtZXNwYWNlIHRvIGF0dGFjaCBwb29sIG1ldGhvZHMgdG8uXG4gICAgICAgICd2YXIgcG9vbHMgPSB7fTsnLFxuICAgICAgICAndmFyIG5vZGVzID0gMDsnLFxuXG4gICAgICAgIC8vIEFkZHMgaW4gYSBnbG9iYWwgYHV1aWRgIGZ1bmN0aW9uLlxuICAgICAgICB1dWlkLFxuXG4gICAgICAgIC8vIEFkZCB0aGUgYWJpbGl0eSB0byBwcm90ZWN0IGVsZW1lbnRzIGZyb20gZnJlZSdkIG1lbW9yeS5cbiAgICAgICAgcHJvdGVjdEVsZW1lbnQsXG4gICAgICAgIHVucHJvdGVjdEVsZW1lbnQsXG5cbiAgICAgICAgLy8gQWRkIGluIHBvb2wgbWFuaXB1bGF0aW9uIG1ldGhvZHMuXG4gICAgICAgIGNyZWF0ZVBvb2wsXG4gICAgICAgIGluaXRpYWxpemVQb29scyxcbiAgICAgICAgJ2luaXRpYWxpemVQb29scygnICsgcG9vbENvdW50ICsgJyk7JyxcblxuICAgICAgICAvLyBBZGQgaW4gTm9kZSBtYW5pcHVsYXRpb24uXG4gICAgICAgICd2YXIgc3luY05vZGUgPSAnICsgc3luY05vZGUsXG5cbiAgICAgICAgLy8gQWRkIGluIHRoZSBhYmlsaXR5IHRvIHBhcnNlSFRNTC5cbiAgICAgICAgcGFyc2VIVE1MLFxuXG4gICAgICAgIC8vIEdpdmUgdGhlIHdlYndvcmtlciB1dGlsaXRpZXMuXG4gICAgICAgIGJ1ZmZlcnMuc3RyaW5nVG9CdWZmZXIsXG4gICAgICAgIGJ1ZmZlcnMuYnVmZmVyVG9TdHJpbmcsXG5cbiAgICAgICAgJ3ZhciBtYWtlUGFyc2VyID0gJyArIG1ha2VQYXJzZXIsXG4gICAgICAgICd2YXIgcGFyc2VyID0gbWFrZVBhcnNlcigpOycsXG5cbiAgICAgICAgLy8gQWRkIGluIHRoZSB3b3JrZXIgc291cmNlLlxuICAgICAgICB3b3JrZXJTb3VyY2UsXG5cbiAgICAgICAgLy8gTWV0YXByb2dyYW1taW5nIHVwIHRoaXMgd29ya2VyIGNhbGwuXG4gICAgICAgICdzdGFydHVwKHNlbGYpOydcbiAgICAgIF0uam9pbignXFxuJylcbiAgICBdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblxuICAgIC8vIENvbnN0cnVjdCB0aGUgd29ya2VyIGFuZCBzdGFydCBpdCB1cC5cbiAgICB0cnkge1xuICAgICAgd29ya2VyID0gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKHdvcmtlckJsb2IpKTtcbiAgICB9XG4gICAgY2F0Y2goZSkge1xuICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5pbmZvKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkZhaWxlZCB0byBjcmVhdGUgZGlmZmh0bWwgd29ya2VyXCIsZSk7XG4gICAgICB9XG5cbiAgICAgIGhhc1dvcmtlciA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3b3JrZXI7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBidWZmZXJUb1N0cmluZztcbnZhciBwYXJzZUhUTUw7XG52YXIgc3luY05vZGU7XG52YXIgcG9vbHM7XG5cbi8qKlxuICogc3RhcnR1cFxuICpcbiAqIEBwYXJhbSB3b3JrZXJcbiAqIEByZXR1cm5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnR1cCh3b3JrZXIpIHtcbiAgdmFyIFRyZWVzID0ge307XG4gIHZhciBwYXRjaGVzID0gW107XG5cbiAgd29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZGF0YSA9IGUuZGF0YTtcbiAgICB2YXIgb2Zmc2V0ID0gZGF0YS5vZmZzZXQ7XG4gICAgdmFyIHRyYW5zZmVyQnVmZmVyID0gZGF0YS5idWZmZXI7XG4gICAgdmFyIGlzSW5uZXIgPSBkYXRhLmlzSW5uZXI7XG5cbiAgICB2YXIgb2xkVHJlZSA9IFRyZWVzW2UuZGF0YS51dWlkXSB8fCBkYXRhLm9sZFRyZWU7XG4gICAgdmFyIG5ld1RyZWUgPSBudWxsO1xuXG4gICAgVHJlZXNbZS5kYXRhLnV1aWRdID0gb2xkVHJlZTtcblxuICAgIGlmIChkYXRhLm5ld1RyZWUpIHtcbiAgICAgIG5ld1RyZWUgPSBkYXRhLm5ld1RyZWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld0hUTUwgPSBidWZmZXJUb1N0cmluZyh0cmFuc2ZlckJ1ZmZlciwgb2Zmc2V0KTtcblxuICAgICAgLy8gQ2FsY3VsYXRlIGEgbmV3IHRyZWUuXG4gICAgICBuZXdUcmVlID0gcGFyc2VIVE1MKG5ld0hUTUwsIGlzSW5uZXIpO1xuXG4gICAgICBpZiAoaXNJbm5lcikge1xuICAgICAgICB2YXIgY2hpbGROb2RlcyA9IG5ld1RyZWU7XG5cbiAgICAgICAgbmV3VHJlZSA9IHtcbiAgICAgICAgICBjaGlsZE5vZGVzLFxuXG4gICAgICAgICAgYXR0cmlidXRlczogb2xkVHJlZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZFRyZWUuZWxlbWVudCxcbiAgICAgICAgICBub2RlTmFtZTogb2xkVHJlZS5ub2RlTmFtZSxcbiAgICAgICAgICBub2RlVmFsdWU6IG9sZFRyZWUubm9kZVZhbHVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3luY2hyb25pemUgdGhlIG9sZCB2aXJ0dWFsIHRyZWUgd2l0aCB0aGUgbmV3IHZpcnR1YWwgdHJlZS4gIFRoaXMgd2lsbFxuICAgIC8vIHByb2R1Y2UgYSBzZXJpZXMgb2YgcGF0Y2hlcyB0aGF0IHdpbGwgYmUgZXhjdXRlZCB0byB1cGRhdGUgdGhlIERPTS5cbiAgICBzeW5jTm9kZS5jYWxsKHBhdGNoZXMsIG9sZFRyZWUsIG5ld1RyZWUpO1xuXG4gICAgLy8gU2VuZCB0aGUgcGF0Y2hlcyBiYWNrIHRvIHRoZSB1c2VybGFuZC5cbiAgICB3b3JrZXIucG9zdE1lc3NhZ2UocGF0Y2hlcyk7XG5cbiAgICAvLyBSZWxlYXNlIGFsbG9jYXRlZCBvYmplY3RzIGJhY2sgaW50byB0aGUgcG9vbC5cbiAgICBwb29scy5vYmplY3QuZnJlZUFsbCgpO1xuICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5mcmVlQWxsKCk7XG4gICAgcG9vbHMuZWxlbWVudE9iamVjdC5mcmVlQWxsKCk7XG5cbiAgICAvLyBXaXBlIG91dCB0aGUgcGF0Y2hlcyBpbiBtZW1vcnkuXG4gICAgcGF0Y2hlcy5sZW5ndGggPSAwO1xuICB9O1xufVxuIiwiXG52YXIgTmF0aXZlQ3VzdG9tRXZlbnQgPSBnbG9iYWwuQ3VzdG9tRXZlbnQ7XG5cbmZ1bmN0aW9uIHVzZU5hdGl2ZSAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHAgPSBuZXcgTmF0aXZlQ3VzdG9tRXZlbnQoJ2NhdCcsIHsgZGV0YWlsOiB7IGZvbzogJ2JhcicgfSB9KTtcbiAgICByZXR1cm4gICdjYXQnID09PSBwLnR5cGUgJiYgJ2JhcicgPT09IHAuZGV0YWlsLmZvbztcbiAgfSBjYXRjaCAoZSkge1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcm9zcy1icm93c2VyIGBDdXN0b21FdmVudGAgY29uc3RydWN0b3IuXG4gKlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50LkN1c3RvbUV2ZW50XG4gKlxuICogQHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdXNlTmF0aXZlKCkgPyBOYXRpdmVDdXN0b21FdmVudCA6XG5cbi8vIElFID49IDlcbidmdW5jdGlvbicgPT09IHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFdmVudCA/IGZ1bmN0aW9uIEN1c3RvbUV2ZW50ICh0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgaWYgKHBhcmFtcykge1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gIH0gZWxzZSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlLCB2b2lkIDApO1xuICB9XG4gIHJldHVybiBlO1xufSA6XG5cbi8vIElFIDw9IDhcbmZ1bmN0aW9uIEN1c3RvbUV2ZW50ICh0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICBlLnR5cGUgPSB0eXBlO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5idWJibGVzID0gQm9vbGVhbihwYXJhbXMuYnViYmxlcyk7XG4gICAgZS5jYW5jZWxhYmxlID0gQm9vbGVhbihwYXJhbXMuY2FuY2VsYWJsZSk7XG4gICAgZS5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICB9IGVsc2Uge1xuICAgIGUuYnViYmxlcyA9IGZhbHNlO1xuICAgIGUuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIGUuZGV0YWlsID0gdm9pZCAwO1xuICB9XG4gIHJldHVybiBlO1xufVxuIl19
