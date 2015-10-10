(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Store all custom elements in this object.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgrade = upgrade;
var components = {};

exports.components = components;
var empty = {};

function upgrade(tagName, element) {
  var CustomElement = components[tagName] || empty;

  // No need to upgrade if already a subclass.
  if (element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  if (CustomElement !== empty) {
    element.__proto__ = CustomElement.prototype;
  }

  return true;
}

;

},{}],2:[function(_dereq_,module,exports){
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

},{"../element/make":3,"../node/make":6}],3:[function(_dereq_,module,exports){
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

var _custom = _dereq_('./custom');

var empty = { prototype: {} };

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

  if (_nodeMake2['default'].nodes[descriptor.element]) {
    return _nodeMake2['default'].nodes[descriptor.element];
  }

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

  // Always set the node's value.
  if (descriptor.nodeValue) {
    element.textContent = descriptor.nodeValue;
  }

  // Get the custom element constructor for a given element.
  var customElement = _custom.components[descriptor.nodeName] || empty;

  // Custom elements have a constructor method that should be called.
  if (customElement.prototype.constructor) {
    customElement.prototype.constructor.call(element);
  }

  // Custom elements have a createdCallback method that should be called.
  if (customElement.prototype.createdCallback) {
    customElement.prototype.createdCallback.call(element);
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _nodeMake2['default'].nodes[descriptor.element] = element;

  return element;
}

module.exports = exports['default'];

},{"../node/make":6,"../svg":11,"./custom":1}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var missingStackTrace = 'Browser doesn\'t support error stack traces.';

/**
 * Identifies an error with transitions.
 */

var TransitionStateError = (function (_Error) {
  _inherits(TransitionStateError, _Error);

  function TransitionStateError(message) {
    _classCallCheck(this, TransitionStateError);

    var error = _get(Object.getPrototypeOf(TransitionStateError.prototype), 'constructor', this).call(this);

    this.message = message;
    this.stack = error.stack || missingStackTrace;
  }

  /**
   * Identifies an error with registering an element.
   */
  return TransitionStateError;
})(Error);

exports.TransitionStateError = TransitionStateError;

var DOMException = (function (_Error2) {
  _inherits(DOMException, _Error2);

  function DOMException(message) {
    _classCallCheck(this, DOMException);

    var error = _get(Object.getPrototypeOf(DOMException.prototype), 'constructor', this).call(this);

    this.message = 'Uncaught DOMException: ' + message;
    this.stack = error.stack || missingStackTrace;
  }

  return DOMException;
})(Error);

exports.DOMException = DOMException;

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.release = release;
exports.registerElement = registerElement;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.enableProllyfill = enableProllyfill;

var _nodePatch = _dereq_('./node/patch');

var _transitions = _dereq_('./transitions');

var _elementCustom = _dereq_('./element/custom');

// We export the TransitionStateError constructor so that instanceof checks can
// be made by those publicly consuming this library.

var _errors = _dereq_('./errors');

Object.defineProperty(exports, 'TransitionStateError', {
  enumerable: true,
  get: function get() {
    return _errors.TransitionStateError;
  }
});

var realRegisterElement = document.registerElement;
var empty = {};

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
  (0, _nodePatch.patchNode)(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents.  This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @param element
 * @param markup=''
 * @param options={}
 */

function innerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = true;
  (0, _nodePatch.patchNode)(element, markup, options);
}

/**
 * Used to diff two elements.  The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior.  By default it is
 * outerHTML.
 *
 * @param element
 * @param newElement
 * @param options={}
 */

function element(element, newElement) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  (0, _nodePatch.patchNode)(element, newElement, options);
}

/**
 * Releases the worker and memory allocated to this element. Useful for
 * components to clean up when removed.
 *
 * @param element
 */

function release(element) {
  (0, _nodePatch.releaseNode)(element);
}

/**
 * Register's a constructor with an element to provide lifecycle events.
 *
 * @param tagName
 * @param constructor
 */

function registerElement(tagName, constructor) {
  // Upgrade simple objects to inherit from HTMLElement and be usable in a real
  // implementation.
  var normalizedConstructor = constructor.prototype ? constructor : null;

  if (!normalizedConstructor) {
    constructor.__proto__ = HTMLElement.prototype;
    normalizedConstructor = { prototype: constructor };
  }

  // If the native web component specification is loaded, use that instead.
  if (realRegisterElement) {
    return realRegisterElement.call(document, tagName, normalizedConstructor);
  }

  // If the element has already been registered, raise an error.
  if (tagName in _elementCustom.components) {
    throw new DOMException('\n      Failed to execute \'registerElement\' on \'Document\': Registration failed\n      for type \'' + tagName + '\'. A type with that name is already registered.\n    ');
  }

  // Assign the custom element reference to the constructor.
  _elementCustom.components[tagName] = normalizedConstructor;
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

  // Releases the retained memory and worker instance.
  Object.defineProperty(Element.prototype, 'diffRelease', {
    configurable: true,

    value: function value(newElement) {
      (0, _nodePatch.releaseNode)(this);
    }
  });

  // Polyfill in the `registerElement` method if it doesn't already exist. This
  // requires patching `createElement` as well to ensure that the proper proto
  // chain exists.
  Object.defineProperty(document, 'registerElement', {
    configurable: true,

    value: function value(tagName, component) {
      registerElement(tagName, component);
    }
  });

  // This section will automatically parse out your entire page to ensure all
  // custom elements are hooked into.
  window.addEventListener('load', function () {
    var documentElement = document.documentElement;

    // After the initial render, clean up the resources, no point in lingering.
    documentElement.addEventListener('renderComplete', function render() {
      // Release resources to the element.
      documentElement.diffRelease(documentElement);

      // Remove this event listener.
      documentElement.removeEventListener('renderComplete', render);
    });

    // Diff the entire document on activation of the prollyfill.
    documentElement.diffOuterHTML = documentElement.outerHTML;
  });
}

},{"./element/custom":1,"./errors":4,"./node/patch":7,"./transitions":12}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = make;

var _utilPools = _dereq_('../util/pools');

var _utilMemory = _dereq_('../util/memory');

var _elementCustom = _dereq_('../element/custom');

var pools = _utilPools.pools;
var protectElement = _utilMemory.protectElement;
var unprotectElement = _utilMemory.unprotectElement;
var empty = {};

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

  // Add to internal lookup.
  make.nodes[entry.element] = node;

  entry.nodeName = node.nodeName.toLowerCase();
  entry.nodeValue = nodeValue;
  entry.childNodes.length = 0;
  entry.attributes.length = 0;

  if (protect) {
    protectElement(entry);
  }

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

  // TODO Rename this to first-run, because we're calling the attach callback
  // and protecting now.
  if (protect) {
    if (_elementCustom.components[entry.nodeName]) {
      // Reset the prototype chain for this element. Upgrade will return `true`
      // if the element was upgraded for the first time. This is useful so we
      // don't end up in a loop when working with the same element.
      if ((0, _elementCustom.upgrade)(entry.nodeName, node)) {
        // If the Node is in the DOM, trigger attached callback.
        if (node.parentNode && node.attachedCallback) {
          node.attachedCallback();
        }
      }
    }
  }

  return entry;
}

module.exports = exports['default'];

},{"../element/custom":1,"../util/memory":14,"../util/pools":16}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.releaseNode = releaseNode;
exports.patchNode = patchNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _customEvent = _dereq_('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _workerCreate = _dereq_('../worker/create');

var _utilMemory = _dereq_('../util/memory');

var _utilPools = _dereq_('../util/pools');

var _utilParser = _dereq_('../util/parser');

var _patchesProcess = _dereq_('../patches/process');

var _patchesProcess2 = _interopRequireDefault(_patchesProcess);

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _elementMake = _dereq_('../element/make');

var _elementMake2 = _interopRequireDefault(_elementMake);

var _sync = _dereq_('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _tree = _dereq_('./tree');

/**
 * When the worker completes, clean up memory and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 * @return {Function}
 */
function completeWorkerRender(element, elementMeta) {
  return function (ev) {
    var nodes = ev.data.nodes;

    // Add new elements.
    if (nodes.additions.length) {
      nodes.additions.map(_utilMemory.protectElement).map(function (descriptor) {
        // Inject into the `oldTree` so it's cleaned up correctly.
        elementMeta.oldTree.childNodes.push(descriptor);
        return descriptor;
      }).forEach(_elementMake2['default']);
    }

    var completeRender = function completeRender() {
      // Remove unused elements.
      if (nodes.removals.length) {
        nodes.removals.forEach(_utilMemory.unprotectElement);
      }

      // Reset internal caches for quicker lookups in the futures.
      elementMeta._innerHTML = element.innerHTML;
      elementMeta._outerHTML = element.outerHTML;
      elementMeta._textContent = element.textContent;

      // Recycle all unprotected allocations.
      (0, _utilMemory.cleanMemory)();

      elementMeta.hasWorkerRendered = true;
      elementMeta.isRendering = false;

      // This is designed to handle use cases where renders are being hammered
      // or when transitions are used with Promises.
      if (elementMeta.renderBuffer) {
        var nextRender = elementMeta.renderBuffer;

        // Reset the buffer.
        elementMeta.renderBuffer = undefined;

        // Noticing some weird performance implications with this concept.
        patchNode(element, nextRender.newHTML, nextRender.options);
      }
      // Dispatch an event on the element once rendering has completed.
      else {
          element.dispatchEvent(new _customEvent2['default']('renderComplete'));
        }
    };

    // Wait until all promises have resolved, before finishing up the patch
    // cycle.
    // Process the data immediately and wait until all transition callbacks
    // have completed.
    var processPromise = (0, _patchesProcess2['default'])(element, ev.data.patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (processPromise) {
      processPromise.then(completeRender);
    } else {
      completeRender();
    }
  };
}

/**
 * Release's the allocated objects and recycles internal memory.
 *
 * @param element
 */

function releaseNode(element) {
  var elementMeta = _tree.TreeCache.get(element) || {};

  // If there is a worker associated with this element, then kill it.
  if (elementMeta.worker) {
    elementMeta.worker.terminate();
  }

  // If there was a tree set up, recycle the memory allocated for it.
  if (elementMeta.oldTree) {
    (0, _utilMemory.unprotectElement)(elementMeta.oldTree);
    (0, _utilMemory.cleanMemory)();
  }

  // Remove this element's meta object from the cache.
  _tree.TreeCache['delete'](element);
}

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */

function patchNode(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.enableWorker !== 'boolean') {
    options.enableWorker = document.ENABLE_WORKER;
  }

  var elementMeta = _tree.TreeCache.get(element) || {};

  // Always ensure the most up-to-date meta object is stored.
  _tree.TreeCache.set(element, elementMeta);

  if (elementMeta.isRendering) {
    // Add this new render into the buffer queue.
    elementMeta.renderBuffer = { newHTML: newHTML, options: options };
    return;
  }

  if (
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
    if (elementMeta.oldTree) {
      (0, _utilMemory.unprotectElement)(elementMeta.oldTree);
      (0, _utilMemory.cleanMemory)();
    }

    elementMeta.oldTree = (0, _make2['default'])(element, true);
    elementMeta.updateOldTree = true;
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && _workerCreate.hasWorker) {
    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;

    // Create a worker for this element.
    var worker = elementMeta.worker = elementMeta.worker || (0, _workerCreate.create)();

    // Attach all properties here to transport.
    var transferObject = {};

    // This should only occur once, or whenever the markup changes externally
    // to diffHTML.
    if (!elementMeta.hasWorkerRendered || elementMeta.updateOldTree) {
      transferObject.oldTree = elementMeta.oldTree;
      elementMeta.updateOldTree = false;
    }

    // Attach the parent element's uuid.
    transferObject.uuid = elementMeta.oldTree.element;

    if (typeof newHTML !== 'string') {
      transferObject.newTree = (0, _make2['default'])(newHTML);

      // Transfer this buffer to the worker, which will take over and process the
      // markup.
      worker.postMessage(transferObject);

      // Wait for the worker to finish processing and then apply the patchset.
      worker.onmessage = completeWorkerRender(element, elementMeta);

      return;
    }

    // Let the browser copy the HTML into the worker, converting to a
    // transferable object is too expensive.
    transferObject.newHTML = newHTML;

    // Add properties to send to worker.
    transferObject.isInner = options.inner;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = completeWorkerRender(element, elementMeta);
  } else {
    (function () {
      // We're rendering in the UI thread.
      elementMeta.isRendering = true;

      var patches = [];
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
        _sync2['default'].call(patches, elementMeta.oldTree, newTree);
      }
      // Otherwise replace the top level elements.
      else if (newHTML) {
          patches[patches.length] = {
            __do__: 0,
            old: elementMeta.oldTree,
            'new': newTree
          };

          (0, _utilMemory.unprotectElement)(elementMeta.oldTree);

          elementMeta.oldTree = newTree;
        }

      var completeRender = function completeRender() {
        // Mark that this element has initially rendered and is done rendering.
        elementMeta.isRendering = false;

        // Set the innerHTML.
        elementMeta._innerHTML = element.innerHTML;
        elementMeta._outerHTML = element.outerHTML;
        elementMeta._textContent = element.textContent;

        (0, _utilMemory.cleanMemory)();

        // Clean out the patches array.
        patches.length = 0;

        // Dispatch an event on the element once rendering has completed.
        element.dispatchEvent(new _customEvent2['default']('renderComplete'));

        // TODO Update this comment and/or refactor to use the same as the Worker.
        if (elementMeta.renderBuffer) {
          var nextRender = elementMeta.renderBuffer;
          elementMeta.renderBuffer = undefined;

          // Noticing some weird performance implications with this concept.
          patchNode(element, nextRender.newHTML, nextRender.options);
        }
      };

      // Process the data immediately and wait until all transition callbacks
      // have completed.
      var processPromise = (0, _patchesProcess2['default'])(element, patches);

      // Operate synchronously unless opted into a Promise-chain.
      if (processPromise) {
        processPromise.then(completeRender);
      } else {
        completeRender();
      }
    })();
  }
}

},{"../element/make":3,"../patches/process":10,"../util/memory":14,"../util/parser":15,"../util/pools":16,"../worker/create":18,"./make":6,"./sync":8,"./tree":9,"custom-event":20}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = sync;

var _utilPools = _dereq_('../util/pools');

var _utilMemory = _dereq_('../util/memory');

var pools = _utilPools.pools;
var protectElement = _utilMemory.protectElement;
var unprotectElement = _utilMemory.unprotectElement;

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
      // Used by the Worker to track elements removed.
      if (patches.removals) {
        patches.removals.push(removed[i]);
      }

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
      // Used by the Worker to track elements added.
      if (patches.additions) {
        patches.additions.push(childNodes[i]);
      }

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

      // Used by the Worker to track elements removed.
      if (patches.removals) {
        patches.removals.push(oldChildNodes[i]);
      }

      // Used by the Worker to track elements added.
      if (patches.additions) {
        patches.additions.push(childNodes[i]);
      }

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
      // Used by the Worker to track elements removed.
      if (patches.removals) {
        patches.removals.push(removed[i]);
      }

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

},{"../util/memory":14,"../util/pools":16}],9:[function(_dereq_,module,exports){
// Cache prebuilt trees and lookup by element.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TreeCache = new WeakMap();
exports.TreeCache = TreeCache;

},{}],10:[function(_dereq_,module,exports){
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

var _elementCustom = _dereq_('../element/custom');

var _nodeMake = _dereq_('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

var forEach = Array.prototype.forEach;
var empty = { prototype: {} };

/**
 * Processes an Array of patches.
 *
 * @param element - Element to process patchsets on.
 * @param e - Object that contains patches.
 */

function process(element, patches) {
  var states = _transitions.transitionStates;
  var promises = [];
  var addPromises = promises.push.apply.bind(promises.push, promises);

  // Trigger the attached transition state for this element and all childNodes.
  var attachedTransitionAndTitle = function attachedTransitionAndTitle(el) {
    var element = (0, _elementGet2['default'])(el).element;

    // Trigger all the text changed values.
    if (states && el.nodeName === '#text' && states.textChanged) {
      for (var x = 0; x < states.textChanged.length; x++) {
        var callback = states.textChanged[x];
        callback(element.parentNode || element, null, el.nodeValue);
      }
    }

    // Added state for transitions API.
    if (states && states.attached) {
      addPromises(states.attached.map(callCallback, element));

      // Call all `childNodes` attached callbacks as well.
      el.childNodes.forEach(attachedTransitionAndTitle);
    }

    titleCallback(el);
  };

  var callCallback = function callCallback(callback) {
    return callback(this);
  };

  var attachedCallback = function attachedCallback(elementDescriptor) {
    var el = (0, _elementGet2['default'])(elementDescriptor).element;
    var fragment = this.fragment;
    var customElement = _elementCustom.components[elementDescriptor.nodeName] || empty;

    if (customElement.prototype.attachedCallback) {
      customElement.prototype.attachedCallback.call(el);
    }

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
    var newDescriptor = undefined,
        oldDescriptor = undefined,
        elementDescriptor = undefined;
    var element = patch['new'];

    if (patch.element) {
      elementDescriptor = patch.element;

      var result = (0, _elementGet2['default'])(patch.element);
      patch.element = result.element;
    }

    if (patch.old) {
      oldDescriptor = patch.old;

      var result = (0, _elementGet2['default'])(patch.old);
      patch.old = result.element;
    }

    if (patch['new']) {
      newDescriptor = patch['new'];

      var result = (0, _elementGet2['default'])(patch['new']);
      patch['new'] = result.element;
    }

    if (element && element.nodeName === '#text') {
      patch['new'].textContent = (0, _utilDecode2['default'])(element.nodeValue);
    }

    // Replace the entire Node.
    if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch['new'], patch.old);

      var oldCustomElement = _elementCustom.components[oldDescriptor.nodeName] || empty;
      var newCustomElement = _elementCustom.components[newDescriptor.nodeName] || empty;

      if (oldCustomElement.prototype.detachedCallback) {
        oldCustomElement.prototype.detachedCallback.call(patch.old);
      }

      if (newCustomElement.prototype.attachedCallback) {
        newCustomElement.prototype.attachedCallback.call(patch['new']);
      }
    }

    // Node manip.
    else if (patch.__do__ === 1) {
        // Add.
        if (patch.element && patch.fragment && !patch.old) {
          var fragment = document.createDocumentFragment();

          patch.fragment.forEach(attachedCallback, { fragment: fragment });
          patch.element.appendChild(fragment);

          forEach.call(patch.fragment, attachedTransitionAndTitle);
        }

        // Remove.
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

            var customElement = _elementCustom.components[oldDescriptor.nodeName] || empty;

            if (customElement.prototype.detachedCallback) {
              customElement.prototype.detachedCallback.call(patch.old);
            }

            patch.old.parentNode.removeChild(patch.old);

            _nodeMake2['default'].nodes[oldDescriptor.element] = undefined;
          }

          // Replace.
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

              var oldCustomElement = _elementCustom.components[oldDescriptor.nodeName] || empty;
              var newCustomElement = _elementCustom.components[newDescriptor.nodeName] || empty;

              if (oldCustomElement.prototype.detachedCallback) {
                oldCustomElement.prototype.detachedCallback.call(patch.old);
              }

              if (newCustomElement.prototype.attachedCallback) {
                newCustomElement.prototype.attachedCallback.call(patch['new']);
              }

              // Added state for transitions API.
              if (states && states.attached) {
                states.attached.forEach(function (callback) {
                  callback(patch['new']);
                });
              }

              _nodeMake2['default'].nodes[oldDescriptor.element] = undefined;
            }
      }

      // Attribute manipulation.
      else if (patch.__do__ === 2) {
          (function () {
            var oldValue = patch.element.getAttribute(patch.name);

            // Changes the attribute on the element.
            var augmentAttribute = function augmentAttribute() {
              // Remove.
              if (!patch.value) {
                patch.element.removeAttribute(patch.name);
              }
              // Change.
              else {
                  patch.element.setAttribute(patch.name, patch.value);
                }
            };

            // Trigger all the attribute changed values.
            if (states && states.attributeChanged && states.attributeChanged.length) {
              addPromises(states.attributeChanged.map(function (callback) {
                var promise = callback(patch.element, patch.name, oldValue, patch.value);

                if (promise) {
                  promise.then(augmentAttribute);
                } else {
                  augmentAttribute();
                }

                return promise;
              }));
            } else {
              augmentAttribute();
            }

            // Trigger custom element attributeChanged events.
            var customElement = _elementCustom.components[elementDescriptor.nodeName] || empty;

            if (customElement.attributeChangedCallback) {
              customElement.prototype.attributeChangedCallback.call(patch.old, patch.name, oldValue, patch.value);
            }
          })();
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

  var activePromises = promises.filter(Boolean);

  // Wait until all transition promises have resolved.
  if (activePromises.length) {
    return Promise.all(promises.filter(Boolean));
  }
}

module.exports = exports['default'];

},{"../element/custom":1,"../element/get":2,"../node/make":6,"../transitions":12,"../util/decode":13,"../util/pools":16}],11:[function(_dereq_,module,exports){
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

},{}],12:[function(_dereq_,module,exports){
/**
 * Contains arrays to store transition callbacks.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var transitionStates = {};

exports.transitionStates = transitionStates;
/**
 * For when elements come into the DOM. The callback triggers immediately after
 * the element enters the DOM. It is called with the element as the only
 * argument.
 */
transitionStates.attached = [];

/**
 * For when elements are removed from the DOM. The callback triggers just
 * before the element leaves the DOM. It is called with the element as the only
 * argument.
 */
transitionStates.detached = [];

/*
 * For when elements are replaced in the DOM. The callback triggers after the
 * new element enters the DOM, and before the old element leaves. It is called
 * with old and new elements as arguments, in that order.
 */
transitionStates.replaced = [];

/*
 * Triggered when an element's attribute has changed. The callback triggers
 * after the attribute has changed in the DOM. It is called with the element,
 * the attribute name, old value, and current value.
 */
transitionStates.attributeChanged = [];

/*
 * Triggered when an element's `textContent` chnages. The callback triggers
 * after the textContent has changed in the DOM. It is called with the element,
 * the old value, and current value.
 */
transitionStates.textChanged = [];

},{}],13:[function(_dereq_,module,exports){
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
  element.innerHTML = string;
  return element.textContent;
}

exports['default'] = decodeEntities;
module.exports = exports['default'];

},{}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;
exports.cleanMemory = cleanMemory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilPools = _dereq_('../util/pools');

var _nodeMake = _dereq_('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

var pools = _utilPools.pools;
var makeNode = _nodeMake2['default'];

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */

function protectElement(element) {
  pools.elementObject.protect(element);

  element.childNodes.forEach(protectElement);
  element.attributes.forEach(pools.attributeObject.protect, pools.attributeObject);

  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */

function unprotectElement(element) {
  element.childNodes.forEach(unprotectElement);
  element.attributes.forEach(pools.attributeObject.unprotect, pools.attributeObject);

  pools.elementObject.unprotect(element);

  return element;
}

/**
 * Recycles all unprotected allocations.
 */

function cleanMemory() {
  // Free all memory after each iteration.
  pools.attributeObject.freeAll();
  pools.elementObject.freeAll();

  // Empty out the `make.nodes` if on main thread.
  if (typeof makeNode !== 'undefined') {
    for (var uuid in makeNode.nodes) {
      // If this is not a protected uuid, remove it.
      if (!pools.elementObject._uuid[uuid]) {
        delete makeNode.nodes[uuid];
      }
    }
  }
}

},{"../node/make":6,"../util/pools":16}],15:[function(_dereq_,module,exports){
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

    instance.nodeName = '#text';
    instance.nodeValue = value;
    instance.nodeType = 3;
    instance.childNodes.length = 0;
    instance.attributes.length = 0;

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
    instance.nodeValue = '';
    instance.nodeType = 1;
    instance.childNodes.length = 0;
    instance.attributes.length = 0;

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
      var rootObject = {};
      var root = HTMLElement(null, rootObject);
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      options = options || {};

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
          var attrs = {};

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

},{"./pools":16}],16:[function(_dereq_,module,exports){
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
 * @param name
 * @param opts
 * @return {Object} pool
 */

function createPool(name, opts) {
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
    _protected: _protect,
    _uuid: {},

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

      // Move the value out of allocated, since we need to protect this from
      // being free'd accidentally.
      if (idx !== -1) {
        _protect.push(allocated.splice(idx, 1)[0]);

        // If we're protecting an element object, push the uuid into a lookup
        // table.
        if (name === 'elementObject') {
          this._uuid[value.element] = 1;
        }
      }
      // From a worker.
      else {
          _protect.push(value);

          // If we're protecting an element object, push the uuid into a lookup
          // table.
          if (name === 'elementObject') {
            this._uuid[value.element] = 1;
          }
        }
    },

    unprotect: function unprotect(value) {
      var idx = _protect.indexOf(value);

      if (idx !== -1) {
        var obj = _protect.splice(idx, 1)[0];
        if (obj) {
          allocated.push(obj);
        }

        if (name === 'elementObject') {
          delete this._uuid[value.element];
        }
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
  pools.attributeObject = createPool('attributeObject', {
    size: COUNT,

    fill: function fill() {
      return { name: '', value: '' };
    }
  });

  pools.elementObject = createPool('elementObject', {
    size: COUNT,

    fill: function fill() {
      return {
        element: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });
}

// Create 10k items of each type.
initializePools(count);

},{"./uuid":17}],17:[function(_dereq_,module,exports){
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

},{}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilUuid = _dereq_('../util/uuid');

var _utilUuid2 = _interopRequireDefault(_utilUuid);

var _utilPools = _dereq_('../util/pools');

var _utilParser = _dereq_('../util/parser');

var _utilMemory = _dereq_('../util/memory');

var _nodeSync = _dereq_('../node/sync');

var _nodeSync2 = _interopRequireDefault(_nodeSync);

var _source = _dereq_('./source');

var _source2 = _interopRequireDefault(_source);

// Tests if the browser has support for the `Worker` API.
var hasWorker = typeof Worker === 'function';

exports.hasWorker = hasWorker;
/**
 * Creates a new Web Worker per element that will be diffed. Allows multiple
 * concurrent diffing operations to occur simultaneously, leveraging the
 * multi-core nature of desktop and mobile devices.
 *
 * Attach any functions that could be used by the Worker inside the Blob below.
 * All functions are named so they can be accessed globally. Since we're
 * directly injecting the methods into an Array and then calling `join` the
 * `toString` method will be invoked on each function and will inject a valid
 * representation of the function's source. This comes at a cost since Babel
 * rewrites variable names when you `import` a module. This is why you'll see
 * underscored properties being imported and then reassigned to non-underscored
 * names in modules that are reused here.
 *
 * @return {Object} A Worker instance.
 */

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
    _utilMemory.protectElement, _utilMemory.unprotectElement, _utilMemory.cleanMemory,

    // Add in pool manipulation methods.
    _utilPools.createPool, _utilPools.initializePools, 'initializePools(' + _utilPools.count + ');',

    // Add in Node manipulation.
    'var syncNode = ' + _nodeSync2['default'],

    // Add in the ability to parseHTML.
    _utilParser.parseHTML, 'var makeParser = ' + _utilParser.makeParser, 'var parser = makeParser();',

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

      // If we cannot create a Worker, then disable trying again, all work
      // will happen on the main UI thread.
      exports.hasWorker = hasWorker = false;
    }
  }

  return worker;
}

},{"../node/sync":8,"../util/memory":14,"../util/parser":15,"../util/pools":16,"../util/uuid":17,"./source":19}],19:[function(_dereq_,module,exports){
'use strict';

// These are globally defined to avoid issues with JSHint thinking that we're
// referencing unknown identifiers.
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = startup;
var parseHTML;
var syncNode;
var pools;

/**
 * This is the Web Worker source code. All globals here are defined in the
 * worker/create module. This allows code sharing and less duplication since
 * most of the logic is identical to the UI thread.
 *
 * @param worker - A worker instance
 */

function startup(worker) {
  var patches = [];
  var oldTree = null;

  // Create arrays to hold element additions and removals.
  patches.additions = [];
  patches.removals = [];

  /**
   * Triggered whenever a `postMessage` call is made on the Worker instance
   * from the UI thread. Signals that some work needs to occur. Will post back
   * to the main thread with patch and node transform results.
   *
   * @param e - The normalized event object.
   */
  worker.onmessage = function (e) {
    var data = e.data;
    var isInner = data.isInner;
    var newTree = null;

    // Always unprotect allocations before the start of a render cycle.
    if (oldTree) {
      unprotectElement(oldTree);
    }

    // If an `oldTree` was provided by the UI thread, use that in place of the
    // current `oldTree`.
    if (data.oldTree) {
      oldTree = data.oldTree;
    }

    // If the `newTree` was provided to the worker, use that instead of trying
    // to create one from HTML source.
    if (data.newTree) {
      newTree = data.newTree;
    }

    // If no `newTree` was provided, we'll have to try and create one from the
    // HTML source provided.
    else if (typeof data.newHTML === 'string') {
        // Calculate a new tree.
        newTree = parseHTML(data.newHTML, isInner);

        // If the operation is for `innerHTML` then we'll retain the previous
        // tree's attributes, nodeName, and nodeValue, and only adjust the
        // childNodes.
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
    // produce a series of patches that will be executed to update the DOM.
    syncNode.call(patches, oldTree, newTree);

    // Protect the current `oldTree` so that no Nodes will be accidentally
    // recycled in the
    protectElement(oldTree);

    // Send the patches back to the userland.
    worker.postMessage({
      // Node operational changes, additions and removals.
      nodes: {
        additions: patches.additions,
        removals: patches.removals
      },

      // All the patches to apply to the DOM.
      patches: patches
    });

    // Recycle allocated objects back into the pool.
    cleanMemory();

    // Wipe out the patches in memory.
    patches.length = 0;
    patches.additions.length = 0;
    patches.removals.length = 0;
  };
}

module.exports = exports['default'];

},{}],20:[function(_dereq_,module,exports){
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
},{}]},{},[5])(5)
});