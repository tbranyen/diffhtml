(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgrade = upgrade;
/**
 * Store all Custom Element definitions in this object. The tagName is the key.
 *
 * @public
 */
var components = exports.components = {};

/**
 * Ensures the element instance matches the CustomElement's prototype.
 *
 * @param tagName - The HTML tagName to use for the Custom Element
 * @param element - The element to upgrade
 * @return {Boolean} successfully upgraded
 */
function upgrade(tagName, element) {
  var CustomElement = components[tagName];

  // If no Custom Element was registered, bail early. Don't need to upgrade
  // if the element was already processed..
  if (!CustomElement || element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  element.__proto__ = Object.create(CustomElement.prototype);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // The upgrade was successful.
  return true;
}

},{}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = get;

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _make3 = _dereq_('../element/make');

var _make4 = _interopRequireDefault(_make3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Takes in an element descriptor and resolve it to a uuid and DOM Node.
 *
 * @param descriptor - Element descriptor
 * @return {Object} containing the uuid and DOM node
 */
function get(descriptor) {
  var uuid = descriptor.uuid;
  var element = (0, _make4.default)(descriptor);

  return { uuid: uuid, element: element };
}

},{"../element/make":3,"../node/make":6}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _svg = _dereq_('../svg');

var svg = _interopRequireWildcard(_svg);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _custom = _dereq_('./custom');

var _entities = _dereq_('../util/entities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Takes in a virtual descriptor and creates an HTML element. Sets the element
 * into the cache.
 *
 * @param descriptor - Element descriptor
 * @return {Element} - The newly created DOM Node
 */
function make(descriptor) {
  var element = null;
  var isSvg = false;
  // Get the Custom Element constructor for a given element.
  var CustomElement = _custom.components[descriptor.nodeName];

  // If the element descriptor was already created, reuse the existing element.
  if (_make2.default.nodes[descriptor.uuid]) {
    return _make2.default.nodes[descriptor.uuid];
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

    // Copy all the attributes from the descriptor into the newly created DOM
    // Node.
    if (descriptor.attributes && descriptor.attributes.length) {
      for (var i = 0; i < descriptor.attributes.length; i++) {
        var attribute = descriptor.attributes[i];
        element.setAttribute(attribute.name, attribute.value);
      }
    }

    // Append all the children into the element, making sure to run them
    // through this `make` function as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (var i = 0; i < descriptor.childNodes.length; i++) {
        element.appendChild(make(descriptor.childNodes[i]));
      }
    }
  }

  // Set the text content, this should be refactored such that only text nodes
  // should ever get assigned a value.
  if (descriptor.nodeValue) {
    element.textContent = (0, _entities.decodeEntities)(descriptor.nodeValue);
  }

  // Upgrade the element after creating it.
  (0, _custom.upgrade)(descriptor.nodeName, element);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement && CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _make2.default.nodes[descriptor.uuid] = element;

  return element;
}

},{"../node/make":6,"../svg":12,"../util/entities":14,"./custom":1}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var missingStackTrace = 'Browser doesn\'t support error stack traces.';

/**
 * Identifies an error with transitions.
 */

var TransitionStateError = exports.TransitionStateError = function (_Error) {
  _inherits(TransitionStateError, _Error);

  function TransitionStateError(message) {
    var _this;

    _classCallCheck(this, TransitionStateError);

    var error = (_this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransitionStateError).call(this)), _this);

    _this.message = message;
    _this.stack = error.stack || missingStackTrace;
    return _this;
  }

  return TransitionStateError;
}(Error);

/**
 * Identifies an error with registering an element.
 */


var DOMException = exports.DOMException = function (_Error2) {
  _inherits(DOMException, _Error2);

  function DOMException(message) {
    var _this2;

    _classCallCheck(this, DOMException);

    var error = (_this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DOMException).call(this)), _this2);

    _this2.message = 'Uncaught DOMException: ' + message;
    _this2.stack = error.stack || missingStackTrace;
    return _this2;
  }

  return DOMException;
}(Error);

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMException = exports.TransitionStateError = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _errors = _dereq_('./errors');

Object.defineProperty(exports, 'TransitionStateError', {
  enumerable: true,
  get: function get() {
    return _errors.TransitionStateError;
  }
});
Object.defineProperty(exports, 'DOMException', {
  enumerable: true,
  get: function get() {
    return _errors.DOMException;
  }
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.release = release;
exports.registerElement = registerElement;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.enableProllyfill = enableProllyfill;

var _patch = _dereq_('./node/patch');

var _patch2 = _interopRequireDefault(_patch);

var _release = _dereq_('./node/release');

var _release2 = _interopRequireDefault(_release);

var _transitions = _dereq_('./transitions');

var _custom = _dereq_('./element/custom');

var _tree = _dereq_('./node/tree');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  (0, _patch2.default)(element, markup, options);
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
  (0, _patch2.default)(element, markup, options);
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

  (0, _patch2.default)(element, newElement, options);
}

/**
 * Releases the worker and memory allocated to this element. Useful for
 * cleaning up components when removed in tests and applications.
 *
 * @param element
 */
function release(element) {
  (0, _release2.default)(element);
}

// Store a reference to the real `registerElement` method if it exists.
var realRegisterElement = document.registerElement;

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
    normalizedConstructor = function NormalizedConstructor() {};
    normalizedConstructor.prototype = constructor;
  }

  // If the native web component specification is loaded, use that instead.
  if (realRegisterElement) {
    return realRegisterElement.call(document, tagName, normalizedConstructor);
  }

  // If the element has already been registered, raise an error.
  if (tagName in _custom.components) {
    throw new _errors.DOMException('\n      Failed to execute \'registerElement\' on \'Document\': Registration failed\n      for type \'' + tagName + '\'. A type with that name is already registered.\n    ');
  }

  // Assign the custom element reference to the constructor.
  _custom.components[tagName] = normalizedConstructor;
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
  if (Object.keys(_transitions.states).indexOf(state) === -1) {
    throw new _errors.TransitionStateError('Invalid state name: ' + state);
  }

  _transitions.states[state].push(callback);
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
    _transitions.states[state].length = 0;
  } else if (state && callback) {
    // Not a valid state name.
    if (Object.keys(_transitions.states).indexOf(state) === -1) {
      throw new _errors.TransitionStateError('Invalid state name ' + state);
    }

    var index = _transitions.states[state].indexOf(callback);
    _transitions.states[state].splice(index, 1);
  } else {
    for (var _state in _transitions.states) {
      _transitions.states[_state].length = 0;
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

    value: function value(newElement, options) {
      element(this, newElement, options);
    }
  });

  // Releases the retained memory and worker instance.
  Object.defineProperty(Element.prototype, 'diffRelease', {
    configurable: true,

    value: function value(newElement) {
      (0, _release2.default)(this);
    }
  });

  // Polyfill in the `registerElement` method if it doesn't already exist. This
  // requires patching `createElement` as well to ensure that the proper proto
  // chain exists.
  if (!realRegisterElement) {
    Object.defineProperty(document, 'registerElement', {
      configurable: true,

      value: function value(tagName, component) {
        registerElement(tagName, component);
      }
    });
  }

  // If HTMLElement is an object, rejigger it to work like a function so that
  // it can be extended. Specifically affects IE and Safari.
  if ((typeof Element === 'undefined' ? 'undefined' : _typeof(Element)) === 'object' || (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object') {
    // Fall back to the Element constructor if the HTMLElement does not exist.
    var realHTMLElement = HTMLElement || Element;

    // If there is no `__proto__` available, add one to the prototype.
    if (!realHTMLElement.__proto__) {
      var copy = {
        set: function set(val) {
          val = Object.keys(val).length ? val : Object.getPrototypeOf(val);

          for (var key in val) {
            if (val.hasOwnProperty(key)) {
              this[key] = val[key];
            }
          }
        }
      };

      Object.defineProperty(realHTMLElement, '__proto__', copy);
      Object.defineProperty(realHTMLElement.prototype, '__proto__', copy);
    }

    HTMLElement = function HTMLElement() {};
    HTMLElement.prototype = Object.create(realHTMLElement.prototype);
    HTMLElement.__proto__ = realHTMLElement;

    // Ensure that the global Element matches the HTMLElement.
    Element = HTMLElement;
  }

  /**
   * Will automatically activate any components found in the page automatically
   * after calling `enableProllyfill`. This is useful to simulate a real-world
   * usage of Custom Elements.
   */
  var activateComponents = function activateComponents() {
    var documentElement = document.documentElement;
    var bufferSet = false;

    // If this element is already rendering, add this new render request into
    // the buffer queue. Check and see if any element is currently rendering,
    // can only do one at a time.
    _tree.TreeCache.forEach(function iterateTreeCache(elementMeta, element) {
      if (elementMeta.isRendering) {
        bufferSet = true;
      }
    });

    // Short circuit the rest of this render.
    if (bufferSet) {
      // Remove the load event listener, since it's complete.
      return window.removeEventListener('load', activateComponents);
    }

    // After the initial render, clean up the resources, no point in lingering.
    documentElement.addEventListener('renderComplete', function render() {
      var elementMeta = _tree.TreeCache.get(documentElement) || {};

      // Release resources allocated to the element.
      if (!elementMeta.isRendering) {
        documentElement.diffRelease(documentElement);
      }

      // Remove this event listener.
      documentElement.removeEventListener('renderComplete', render);
    });

    // Diff the entire document on activation of the prollyfill.
    documentElement.diffOuterHTML = documentElement.outerHTML;

    // Remove the load event listener, since it's complete.
    window.removeEventListener('load', activateComponents);
  };

  // If the document has already loaded, immediately activate the components.
  if (document.readyState === 'complete') {
    activateComponents();
  } else {
    // This section will automatically parse out your entire page to ensure all
    // custom elements are hooked into.
    window.addEventListener('load', activateComponents);
  }
}

},{"./element/custom":1,"./errors":4,"./node/patch":7,"./node/release":8,"./node/tree":10,"./transitions":13}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _pools2 = _dereq_('../util/pools');

var _custom = _dereq_('../element/custom');

var pools = _pools2.pools;
var empty = {};

// Cache created nodes inside this object.
make.nodes = {};

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
function make(node) {
  // Default the nodeType to Element (1).
  var nodeType = 'nodeType' in node ? node.nodeType : 1;

  // Ignore attribute, comment, and CDATA nodes.
  if (nodeType === 2 || nodeType === 4 || nodeType === 8) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = pools.elementObject.get();

  // Associate this newly allocated uuid with this Node.
  make.nodes[entry.uuid] = node;

  // Set a lowercased (normalized) version of the element's nodeName.
  entry.nodeName = node.nodeName.toLowerCase();

  // Keep consistent with our internal HTML parser and set the nodeType.
  entry.nodeType = node.nodeType;

  // If the element is a text node set the nodeValue.
  if (nodeType === 3) {
    entry.nodeValue = node.textContent;
  }

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

        attr.name = attributes[i].name;
        attr.value = attributes[i].value;

        entry.attributes[entry.attributes.length] = attr;
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes ? node.childNodes : [];
  var childNodesLength = childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (entry.nodeType !== 3 && childNodesLength) {
    for (var i = 0; i < childNodesLength; i++) {
      var newNode = make(childNodes[i]);

      if (newNode) {
        entry.childNodes[entry.childNodes.length] = newNode;
      }
    }
  }

  // Prune out whitespace from between HTML tags in markup.
  if (entry.nodeName === 'html') {
    entry.childNodes = entry.childNodes.filter(function (el) {
      return el.nodeName === 'head' || el.nodeName === 'body';
    });
  }

  if (_custom.components[entry.nodeName]) {
    // Reset the prototype chain for this element. Upgrade will return `true`
    // if the element was upgraded for the first time. This is useful so we
    // don't end up in a loop when working with the same element.
    if ((0, _custom.upgrade)(entry.nodeName, node)) {
      // If the Node is in the DOM, trigger attached callback.
      if (node.parentNode && node.attachedCallback) {
        node.attachedCallback();
      }
    }
  }

  return entry;
}

},{"../element/custom":1,"../util/pools":17}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchNode;

var _create = _dereq_('../worker/create');

var _memory = _dereq_('../util/memory');

var _parser = _dereq_('../util/parser');

var _render = _dereq_('../util/render');

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _process = _dereq_('../patches/process');

var _process2 = _interopRequireDefault(_process);

var _sync = _dereq_('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _tree = _dereq_('./tree');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  // The element meta object is a location to associate metadata with the
  // currently rendering element. This prevents attaching properties to the
  // instance itself.
  var elementMeta = _tree.TreeCache.get(element) || {};

  // Last options used.
  elementMeta.options = options;

  // Always ensure the most up-to-date meta object is stored.
  _tree.TreeCache.set(element, elementMeta);

  var bufferSet = false;
  var isInner = options.inner;
  var previousMarkup = elementMeta.previousMarkup;

  // If this element is already rendering, add this new render request into the
  // buffer queue. Check and see if any element is currently rendering, can
  // only do one at a time.
  _tree.TreeCache.forEach(function iterateTreeCache(_elementMeta, _element) {
    if (_elementMeta.isRendering) {
      elementMeta.renderBuffer = { element: element, newHTML: newHTML, options: options };
      bufferSet = true;
    }
  });

  // Short circuit the rest of this render.
  if (bufferSet) {
    return;
  }

  var sameInnerHTML = isInner ? previousMarkup === element.innerHTML : true;
  var sameOuterHTML = !isInner ? previousMarkup === element.outerHTML : true;
  var sameTextContent = elementMeta._textContent === element.textContent;

  // If the contents haven't changed, abort, since there is no point in
  // continuing.
  if (elementMeta.newHTML === newHTML) {
    return;
  }

  // Associate the last markup rendered with this element.
  elementMeta.newHTML = newHTML;

  // Start with worker being a falsy value.
  var worker = null;

  // If we can use a worker and the user wants one, try and create it.
  if (options.enableWorker && _create.hasWorker) {
    // Create a worker for this element.
    worker = elementMeta.worker = elementMeta.worker || (0, _create.create)();
  }

  var rebuildTree = function rebuildTree() {
    var oldTree = elementMeta.oldTree;

    if (oldTree) {
      (0, _memory.unprotectElement)(oldTree, _make2.default);
      (0, _memory.cleanMemory)(_make2.default);
    }

    elementMeta.oldTree = (0, _memory.protectElement)((0, _make2.default)(element));
    elementMeta.updateWorkerTree = true;
  };

  // The last render was done via Worker, but now we're rendering in the UI
  // thread. This is very uncommon, but we need to ensure trees stay in sync.
  if (elementMeta.renderedViaWorker === true && !options.enableWorker) {
    rebuildTree();
  }

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && _create.hasWorker && worker) {
    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;
    elementMeta.renderedViaWorker = true;
    elementMeta.workerCache = elementMeta.workerCache || [];

    // Attach all properties here to transport.
    var transferObject = {};

    // This should only occur once, or whenever the markup changes externally
    // to diffHTML.
    if (!elementMeta.hasWorkerRendered || elementMeta.updateWorkerTree) {
      transferObject.oldTree = elementMeta.oldTree;
      elementMeta.updateWorkerTree = false;
    }

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function onmessage(ev) {
      var wrapRender = function wrapRender(cb) {
        return function () {
          elementMeta.hasWorkerRendered = true;
          cb();
        };
      };
      var invokeRender = wrapRender((0, _render.completeRender)(element, elementMeta));

      // Wait until all promises have resolved, before finishing up the patch
      // cycle.  Process the data immediately and wait until all transition
      // callbacks have completed.
      var promises = (0, _process2.default)(element, ev.data.patches);

      // Operate synchronously unless opted into a Promise-chain.
      if (promises.length) {
        Promise.all(promises).then(invokeRender, function (ex) {
          return console.log(ex);
        });
      } else {
        invokeRender();
      }
    };

    if (typeof newHTML !== 'string') {
      transferObject.newTree = (0, _make2.default)(newHTML);

      // Transfer this buffer to the worker, which will take over and process
      // the markup.
      worker.postMessage(transferObject);

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
  } else {
    if (elementMeta.renderedViaWorker && elementMeta.oldTree) {
      rebuildTree();
    }

    if (elementMeta.workerCache) {
      elementMeta.workerCache.forEach(function (x) {
        return (0, _memory.unprotectElement)(x, _make2.default);
      });
      delete elementMeta.workerCache;
    }

    // We're rendering in the UI thread.
    elementMeta.isRendering = true;

    // Whenever we render in the UI-thread, ensure that the Worker gets a
    // refreshed copy of the `oldTree`.
    elementMeta.updateWorkerTree = true;

    var newTree = null;

    if (typeof newHTML === 'string') {
      newTree = (0, _parser.parseHTML)(newHTML, options.inner);
    } else {
      newTree = (0, _make2.default)(newHTML);
    }

    if (options.inner) {
      var childNodes = Array.isArray(newTree) ? newTree : [newTree];

      newTree = {
        childNodes: childNodes,
        attributes: elementMeta.oldTree.attributes,
        uuid: elementMeta.oldTree.uuid,
        nodeName: elementMeta.oldTree.nodeName,
        nodeValue: elementMeta.oldTree.nodeValue
      };
    }

    // Synchronize the tree.
    var patches = (0, _sync2.default)(elementMeta.oldTree, newTree);
    var invokeRender = (0, _render.completeRender)(element, elementMeta);

    // Process the data immediately and wait until all transition callbacks
    // have completed.
    var promises = (0, _process2.default)(element, patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (promises.length) {
      Promise.all(promises).then(invokeRender, function (ex) {
        return console.log(ex);
      });
    } else {
      invokeRender();
    }
  }
}

},{"../patches/process":11,"../util/memory":15,"../util/parser":16,"../util/pools":17,"../util/render":18,"../worker/create":20,"./make":6,"./sync":9,"./tree":10}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = releaseNode;

var _tree = _dereq_('./tree');

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _memory = _dereq_('../util/memory');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Release's the allocated objects and recycles internal memory.
 *
 * @param element
 */
function releaseNode(element) {
  var elementMeta = _tree.TreeCache.get(element);

  // Do not remove an element that is in process of rendering. User intentions
  // come first, so if we are cleaning up an element being used by another part
  // of the code, keep it alive.
  if (elementMeta) {
    // If there is a worker associated with this element, then kill it.
    if (elementMeta.worker) {
      elementMeta.worker.terminate();
      delete elementMeta.worker;
    }

    // If there was a tree set up, recycle the memory allocated for it.
    if (elementMeta.oldTree) {
      (0, _memory.unprotectElement)(elementMeta.oldTree, _make2.default);
    }

    if (elementMeta.workerCache) {
      elementMeta.workerCache.forEach(function (x) {
        return (0, _memory.unprotectElement)(x, _make2.default);
      });
      delete elementMeta.workerCache;
    }

    // Remove this element's meta object from the cache.
    _tree.TreeCache.delete(element);
  }

  (0, _memory.cleanMemory)(_make2.default);
}

},{"../util/memory":15,"../util/pools":17,"./make":6,"./tree":10}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANGE_TEXT = exports.MODIFY_ATTRIBUTE = exports.MODIFY_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ELEMENT_CHILDREN = undefined;
exports.default = sync;

var _pools2 = _dereq_('../util/pools');

var pools = _pools2.pools;

var slice = Array.prototype.slice;
var filter = Array.prototype.filter;

// Patch actions.
var REMOVE_ELEMENT_CHILDREN = exports.REMOVE_ELEMENT_CHILDREN = -2;
var REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = -1;
var REPLACE_ENTIRE_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = 0;
var MODIFY_ELEMENT = exports.MODIFY_ELEMENT = 1;
var MODIFY_ATTRIBUTE = exports.MODIFY_ATTRIBUTE = 2;
var CHANGE_TEXT = exports.CHANGE_TEXT = 3;

/**
 * Synchronizes changes from the newTree into the oldTree.
 *
 * @param oldTree
 * @param newTree
 * @param patches - optional
 */
function sync(oldTree, newTree, patches) {
  patches = patches || [];

  if (!Array.isArray(patches)) {
    throw new Error('Missing Array to sync patches into');
  }

  if (!oldTree) {
    throw new Error('Missing existing tree to sync');
  }

  var oldNodeValue = oldTree.nodeValue;
  var oldChildNodes = oldTree.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  var oldElement = oldTree.uuid;
  var oldNodeName = oldTree.nodeName;
  var oldIsTextNode = oldNodeName === '#text';

  if (!newTree) {
    var removed = [oldTree].concat(oldChildNodes.splice(0, oldChildNodesLength));

    patches.push({
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: removed
    });

    return patches;
  }

  var nodeValue = newTree.nodeValue;
  var childNodes = newTree.childNodes;
  var childNodesLength = childNodes ? childNodes.length : 0;
  var newElement = newTree.uuid;
  var nodeName = newTree.nodeName;
  var newIsTextNode = nodeName === '#text';

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (oldTree.nodeName !== newTree.nodeName) {
    patches.push({
      __do__: REPLACE_ENTIRE_ELEMENT,
      old: oldTree,
      new: newTree
    });

    return patches;
  }

  // If the top level nodeValue has changed we should reflect it.
  if (oldIsTextNode && newIsTextNode && oldNodeValue !== nodeValue) {
    patches.push({
      __do__: CHANGE_TEXT,
      element: oldTree,
      value: newTree.nodeValue
    });

    oldTree.nodeValue = newTree.nodeValue;

    return;
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    var fragment = [];

    for (var i = oldChildNodesLength; i < childNodesLength; i++) {
      // Internally add to the tree.
      oldChildNodes.push(childNodes[i]);

      // Add to the document fragment.
      fragment.push(childNodes[i]);
    }

    oldChildNodesLength = oldChildNodes.length;

    // Assign the fragment to the patches to be injected.
    patches.push({
      __do__: MODIFY_ELEMENT,
      element: oldTree,
      fragment: fragment
    });
  }

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    // For now just splice out the end items.
    var diff = oldChildNodesLength - childNodesLength;
    var toRemove = oldChildNodes.splice(oldChildNodesLength - diff, diff);

    oldChildNodesLength = oldChildNodes.length;

    if (oldChildNodesLength === 0 && childNodesLength === 0) {
      patches.push({
        __do__: REMOVE_ELEMENT_CHILDREN,
        element: oldTree,
        toRemove: toRemove
      });
    } else {
      for (var i = 0; i < toRemove.length; i++) {
        // Remove the element, this happens before the splice so that we
        // still have access to the element.
        patches.push({
          __do__: MODIFY_ELEMENT,
          old: toRemove[i]
        });
      }
    }
  }

  // Replace elements if they are different.
  if (oldChildNodesLength >= childNodesLength) {
    for (var i = 0; i < childNodesLength; i++) {
      if (oldChildNodes[i].nodeName !== childNodes[i].nodeName) {
        // Add to the patches.
        patches.push({
          __do__: MODIFY_ELEMENT,
          old: oldChildNodes[i],
          new: childNodes[i]
        });

        // Replace the internal tree's point of view of this element.
        oldChildNodes[i] = childNodes[i];
      } else {
        sync(oldChildNodes[i], childNodes[i], patches);
      }
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
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toAdd[i].name,
          value: toAdd[i].value
        };

        var attr = pools.attributeObject.get();
        attr.name = toAdd[i].name;
        attr.value = toAdd[i].value;

        pools.attributeObject.protect(attr);

        // Push the change object into into the virtual tree.
        oldTree.attributes.push(attr);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      var toRemove = slice.call(oldTree.attributes, newLength);

      for (var i = 0; i < toRemove.length; i++) {
        var change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toRemove[i].name,
          value: undefined
        };

        // Remove the attribute from the virtual node.
        var removed = oldTree.attributes.splice(i, 1);

        for (var _i = 0; _i < removed.length; _i++) {
          pools.attributeObject.unprotect(removed[_i]);
        }

        // Add the change to the series of patches.
        patches.push(change);
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
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toModify[i].name,
          value: toModify[i].value
        };

        // Replace the attribute in the virtual node.
        var attr = oldTree.attributes[i];
        attr.name = toModify[i].name;
        attr.value = toModify[i].value;

        // Add the change to the series of patches.
        patches.push(change);
      }
    }
  }

  return patches;
}

},{"../util/pools":17}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Cache prebuilt trees and lookup by element.
var TreeCache = exports.TreeCache = new Map();

},{}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = process;

var _transitions = _dereq_('../transitions');

var transition = _interopRequireWildcard(_transitions);

var _pools = _dereq_('../util/pools');

var _get = _dereq_('../element/get');

var _get2 = _interopRequireDefault(_get);

var _custom = _dereq_('../element/custom');

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _sync = _dereq_('../node/sync');

var sync = _interopRequireWildcard(_sync);

var _tree = _dereq_('../node/tree');

var _memory = _dereq_('../util/memory');

var _entities = _dereq_('../util/entities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var blockTextElements = ['script', 'noscript', 'style', 'pre', 'template'];

/**
 * Processes an array of patches.
 *
 * @param element - Element to process patchsets on.
 * @param e - Object that contains patches.
 */
function process(element, patches) {
  var elementMeta = _tree.TreeCache.get(element);
  var promises = [];
  var triggerTransition = transition.buildTrigger(promises);

  // Trigger the attached transition state for this element and all childNodes.
  var attached = function attached(descriptor, fragment, parentNode) {
    (0, _memory.protectElement)(descriptor);

    if (elementMeta.workerCache) {
      elementMeta.workerCache.push(descriptor);
    }

    var el = (0, _get2.default)(descriptor).element;

    // If the element added was a DOM text node or SVG text element, trigger
    // the textChanged transition.
    if (descriptor.nodeName === '#text') {
      var textPromises = transition.makePromises('textChanged', [el], null, descriptor.nodeValue);

      el.textContent = (0, _entities.decodeEntities)(descriptor.nodeValue);

      if (parentNode) {
        var nodeName = parentNode.nodeName.toLowerCase();

        if (blockTextElements.indexOf(nodeName) > -1) {
          parentNode.nodeValue = (0, _entities.decodeEntities)(descriptor.nodeValue);
        }
      }

      triggerTransition('textChanged', textPromises, function (promises) {});
    }

    // Call all `childNodes` attached callbacks as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      descriptor.childNodes.forEach(function (x) {
        return attached(x, null, el);
      });
    }

    // If a document fragment was specified, append the real element into it.
    if (fragment) {
      fragment.appendChild(el);
    }

    return el;
  };

  // Loop through all the patches and apply them.

  var _loop = function _loop(i) {
    var patch = patches[i];
    var newDescriptor = undefined,
        oldDescriptor = undefined,
        elementDescriptor = undefined;
    var element = patch.new;

    if (patch.element) {
      elementDescriptor = patch.element;

      var result = (0, _get2.default)(patch.element);
      patch.element = result.element;
    }

    if (patch.old) {
      oldDescriptor = patch.old;

      var result = (0, _get2.default)(patch.old);
      patch.old = result.element;
    }

    if (patch.new) {
      newDescriptor = patch.new;

      var result = (0, _get2.default)(patch.new);
      patch.new = result.element;
    }

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === sync.REMOVE_ELEMENT_CHILDREN) {
      var childNodes = patch.element.childNodes;
      var detachPromises = transition.makePromises('detached', childNodes);

      triggerTransition('detached', detachPromises, function (promises) {
        patch.toRemove.forEach(function (x) {
          return (0, _memory.unprotectElement)(x, _make2.default);
        });
        patch.element.innerHTML = '';
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === sync.REMOVE_ENTIRE_ELEMENT) {
        var detachPromises = transition.makePromises('detached', [patch.elemnt]);

        if (patch.element.parentNode) {
          triggerTransition('detached', detachPromises, function (promises) {
            patch.element.parentNode.removeChild(patch.element);
            patch.toRemove.forEach(function (x) {
              return (0, _memory.unprotectElement)(x, _make2.default);
            });
          });
        } else {
          patch.toRemove.forEach(function (x) {
            return (0, _memory.unprotectElement)(x, _make2.default);
          });
        }
      }

      // Replace the entire Node.
      else if (patch.__do__ === sync.REPLACE_ENTIRE_ELEMENT) {
          (function () {
            var allPromises = [];
            var attachedPromises = transition.makePromises('attached', [patch.new]);
            var detachedPromises = transition.makePromises('detached', [patch.old]);
            var replacedPromises = transition.makePromises('replaced', [patch.old], patch.new);

            // Add all the transition state promises into the main array, we'll use
            // them all to decide when to alter the DOM.
            triggerTransition('detached', detachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            triggerTransition('attached', attachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
              attached(newDescriptor, null, patch.new);
            });

            triggerTransition('replaced', replacedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            (0, _memory.unprotectElement)(oldDescriptor, _make2.default);

            // Reset the tree cache.
            _tree.TreeCache.set(patch.new, {
              oldTree: newDescriptor,
              element: patch.new
            });

            // Once all the promises have completed, invoke the action, if no
            // promises were added, this will be a synchronous operation.
            if (allPromises.length) {
              Promise.all(allPromises).then(function replaceEntireElement() {
                if (!patch.old.parentNode) {
                  (0, _memory.unprotectElement)(newDescriptor, _make2.default);

                  throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                }

                patch.old.parentNode.replaceChild(patch.new, patch.old);
              }, function (ex) {
                return console.log(ex);
              });
            } else {
              if (!patch.old.parentNode) {
                (0, _memory.unprotectElement)(newDescriptor, _make2.default);

                throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
              }

              patch.old.parentNode.replaceChild(patch.new, patch.old);
            }
          })();
        }

        // Node manip.
        else if (patch.__do__ === sync.MODIFY_ELEMENT) {
            // Add.
            if (patch.element && patch.fragment && !patch.old) {
              (function () {
                var fragment = document.createDocumentFragment();

                // Loop over every element to be added and process the descriptor
                // into the real element and append into the DOM fragment.
                toAttach = patch.fragment.map(function (el) {
                  return attached(el, fragment, patch.element);
                });

                // Turn elements into childNodes of the patch element.

                patch.element.appendChild(fragment);

                // Trigger transitions.
                var makeAttached = transition.makePromises('attached', toAttach);
                triggerTransition('attached', makeAttached);
              })();
            }

            // Remove.
            else if (patch.old && !patch.new) {
                if (!patch.old.parentNode) {
                  (0, _memory.unprotectElement)(oldDescriptor, _make2.default);

                  throw new Error('Can\'t remove without parent, is this the ' + 'document root?');
                }

                var makeDetached = transition.makePromises('detached', [patch.old]);

                triggerTransition('detached', makeDetached, function () {
                  // And then empty out the entire contents.
                  patch.old.innerHTML = '';

                  if (patch.old.parentNode) {
                    patch.old.parentNode.removeChild(patch.old);
                  }

                  (0, _memory.unprotectElement)(oldDescriptor, _make2.default);
                });
              }

              // Replace.
              else if (patch.old && patch.new) {
                  (function () {
                    if (!patch.old.parentNode) {
                      (0, _memory.unprotectElement)(oldDescriptor, _make2.default);
                      (0, _memory.unprotectElement)(newDescriptor, _make2.default);

                      throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                    }

                    // Append the element first, before doing the replacement.
                    if (patch.old.nextSibling) {
                      patch.old.parentNode.insertBefore(patch.new, patch.old.nextSibling);
                    } else {
                      patch.old.parentNode.appendChild(patch.new);
                    }

                    // Removed state for transitions API.
                    var allPromises = [];
                    var attachPromises = transition.makePromises('attached', [patch.new]);
                    var detachPromises = transition.makePromises('detached', [patch.old]);
                    var replacePromises = transition.makePromises('replaced', [patch.old], patch.new);

                    triggerTransition('detached', detachPromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                    });

                    triggerTransition('attached', attachPromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                      attached(newDescriptor);
                    });

                    triggerTransition('replaced', replacePromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                    });

                    // Once all the promises have completed, invoke the action, if no
                    // promises were added, this will be a synchronous operation.
                    if (allPromises.length) {
                      Promise.all(allPromises).then(function replaceElement() {
                        patch.old.parentNode.replaceChild(patch.new, patch.old);
                        (0, _memory.unprotectElement)(oldDescriptor, _make2.default);

                        (0, _memory.protectElement)(newDescriptor);

                        if (elementMeta.workerCache) {
                          elementMeta.workerCache.push(newDescriptor);
                        }
                      }, function (ex) {
                        return console.log(ex);
                      });
                    } else {
                      if (!patch.old.parentNode) {
                        (0, _memory.unprotectElement)(oldDescriptor, _make2.default);
                        (0, _memory.unprotectElement)(newDescriptor, _make2.default);

                        throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                      }

                      patch.old.parentNode.replaceChild(patch.new, patch.old);
                      (0, _memory.unprotectElement)(oldDescriptor, _make2.default);
                      (0, _memory.protectElement)(newDescriptor);

                      if (elementMeta.workerCache) {
                        elementMeta.workerCache.push(newDescriptor);
                      }
                    }
                  })();
                }
          }

          // Attribute manipulation.
          else if (patch.__do__ === sync.MODIFY_ATTRIBUTE) {
              var attrChangePromises = transition.makePromises('attributeChanged', [patch.element], patch.name, patch.element.getAttribute(patch.name), patch.value);

              triggerTransition('attributeChanged', attrChangePromises, function (promises) {
                // Remove.
                if (patch.value === undefined) {
                  patch.element.removeAttribute(patch.name);
                }
                // Change.
                else {
                    patch.element.setAttribute(patch.name, patch.value);

                    // Support live updating of the value attribute.
                    if (patch.name === 'value') {
                      patch.element[patch.name] = patch.value;
                    }
                  }
              });
            }

            // Text node manipulation.
            else if (patch.__do__ === sync.CHANGE_TEXT) {
                var textChangePromises = transition.makePromises('textChanged', [patch.element], patch.element.nodeValue, patch.value);

                triggerTransition('textChanged', textChangePromises, function (promises) {
                  elementDescriptor.nodeValue = (0, _entities.decodeEntities)(patch.value);
                  patch.element.nodeValue = elementDescriptor.nodeValue;

                  if (patch.element.parentNode) {
                    var nodeName = patch.element.parentNode.nodeName.toLowerCase();

                    if (blockTextElements.indexOf(nodeName) > -1) {
                      patch.element.parentNode.nodeValue = elementDescriptor.nodeValue;
                    }
                  }
                });
              }
  };

  for (var i = 0; i < patches.length; i++) {
    var toAttach;

    _loop(i);
  }

  // Return the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  return promises.filter(Boolean);
}

},{"../element/custom":1,"../element/get":2,"../node/make":6,"../node/sync":9,"../node/tree":10,"../transitions":13,"../util/entities":14,"../util/memory":15,"../util/pools":17}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// List of SVG elements.
var elements = exports.elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

// Namespace.
var namespace = exports.namespace = 'http://www.w3.org/2000/svg';

},{}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.states = undefined;
exports.buildTrigger = buildTrigger;
exports.makePromises = makePromises;

var _custom = _dereq_('./element/custom');

var slice = Array.prototype.slice;
var forEach = Array.prototype.forEach;
var concat = Array.prototype.concat;
var empty = { prototype: {} };

/**
 * Contains arrays to store transition callbacks.
 *
 * attached
 * --------
 *
 * For when elements come into the DOM. The callback triggers immediately after
 * the element enters the DOM. It is called with the element as the only
 * argument.
 *
 * detached
 * --------
 *
 * For when elements are removed from the DOM. The callback triggers just
 * before the element leaves the DOM. It is called with the element as the only
 * argument.
 *
 * replaced
 * --------
 *
 * For when elements are replaced in the DOM. The callback triggers after the
 * new element enters the DOM, and before the old element leaves. It is called
 * with old and new elements as arguments, in that order.
 *
 * attributeChanged
 * ----------------
 *
 * Triggered when an element's attribute has changed. The callback triggers
 * after the attribute has changed in the DOM. It is called with the element,
 * the attribute name, old value, and current value.
 *
 * textChanged
 * -----------
 *
 * Triggered when an element's `textContent` chnages. The callback triggers
 * after the textContent has changed in the DOM. It is called with the element,
 * the old value, and current value.
 */
var states = exports.states = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: []
};

// Define the custom signatures necessary for the loop to fill in the "magic"
// methods that process the transitions consistently.
var fnSignatures = {
  attached: {
    mapFn: function mapFn(el) {
      return function (cb) {
        return cb(el);
      };
    },
    customElementsFn: function customElementsFn(el) {
      return function (cb) {
        return cb.call(el);
      };
    }
  },

  detached: {
    mapFn: function mapFn(el) {
      return function (cb) {
        return cb(el);
      };
    },
    customElementsFn: function customElementsFn(el) {
      return function (cb) {
        return cb.call(el);
      };
    }
  },

  replaced: {
    mapFn: function mapFn(oldEl, newEl) {
      return function (cb) {
        return cb(oldEl, newEl);
      };
    }
  },

  attributeChanged: {
    mapFn: function mapFn(el, name, oldVal, newVal) {
      return function (cb) {
        return cb(el, name, oldVal, newVal);
      };
    },
    customElementsFn: function customElementsFn(el, name, oldVal, newVal) {
      return function (cb) {
        return cb.call(el, name, oldVal, newVal);
      };
    }
  },

  textChanged: {
    mapFn: function mapFn(el, oldVal, newVal) {
      return function (cb) {
        return cb(el, oldVal, newVal);
      };
    }
  }
};

var make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(function iterateStates(stateName) {
  var mapFn = fnSignatures[stateName].mapFn;

  /**
   * Make's the transition promises.
   *
   * @param elements
   * @param args
   * @param promises
   */
  make[stateName] = function makeTransitionPromises(elements, args, promises) {
    forEach.call(elements, function (element) {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && element.nodeType !== 1) {
        return;
      }

      // Call the map function with each element.
      var newPromises = states[stateName].map(mapFn.apply(null, [element].concat(args))).filter(Boolean);

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](element.childNodes, args, promises);
      }
    });

    return promises;
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param stateName
 * @param nodes
 * @param callback
 * @return
 */
function buildTrigger(allPromises) {
  var addPromises = allPromises.push.apply.bind(allPromises.push, allPromises);

  // This becomes `triggerTransition` in process.js.
  return function (stateName, makePromisesCallback) {
    var callback = arguments.length <= 2 || arguments[2] === undefined ? function (x) {
      return x;
    } : arguments[2];

    if (states[stateName] && states[stateName].length) {
      // Calls into each custom hook to bind Promises into the local array,
      // these will then get merged into the main `allPromises` array.
      var promises = makePromisesCallback([]);

      // Add these promises into the global cache.
      addPromises(promises);

      if (!promises.length) {
        callback(promises);
      } else {
        Promise.all(promises).then(callback, function handleRejection(ex) {
          console.log(ex);
        });
      }
    } else {
      callback();
    }
  };
}

/**
 * Triggers the lifecycle events on an HTMLElement.
 *
 * @param stateName
 * @param elements
 * @return
 */
function triggerLifecycleEvent(stateName, args, elements) {
  // Trigger custom element
  var customElementFn = fnSignatures[stateName].customElementsFn;

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    if (element) {
      var customElement = _custom.components[element.nodeName.toLowerCase()] || empty;
      var customElementMethodName = stateName + 'Callback';

      // Call the associated CustomElement's lifecycle callback, if it exists.
      if (customElement.prototype[customElementMethodName]) {
        customElementFn.apply(null, args)(customElement.prototype[customElementMethodName].bind(element));
      }
    }
  }
}

/**
 * Make a reusable function for easy transition calling.
 *
 * @param stateName
 * @param elements
 * @return
 */
function makePromises(stateName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  // Ensure elements is always an array.
  var elements = slice.call(args[0]);

  triggerLifecycleEvent(stateName, args.slice(1), elements);

  // Accepts the local Array of promises to use.
  return function (promises) {
    return make[stateName](elements, args.slice(1), promises);
  };
}

},{"./element/custom":1}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeEntities = decodeEntities;
var element = document.createElement('div');

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/13091266
 * @param stringing
 * @return unescaped HTML
 */
function decodeEntities(string) {
  element.innerHTML = string;
  return element.textContent;
}

},{}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;
exports.cleanMemory = cleanMemory;

var _pools2 = _dereq_('../util/pools');

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pools = _pools2.pools;
var makeNode = _make2.default;

var elementObject = pools.elementObject;
var attributeObject = pools.attributeObject;

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
function protectElement(element) {
  pools.elementObject.protect(element);

  element.attributes.forEach(pools.attributeObject.protect, pools.attributeObject);

  if (element.childNodes) {
    element.childNodes.forEach(protectElement);
  }

  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */
function unprotectElement(element, makeNode) {
  elementObject.unprotect(element);
  elementObject.cache.uuid.delete(element.uuid);

  element.attributes.forEach(attributeObject.unprotect, attributeObject);

  if (element.childNodes) {
    element.childNodes.forEach(function (node) {
      return unprotectElement(node, makeNode);
    });
  }

  if (makeNode && makeNode.nodes) {
    delete makeNode.nodes[element.uuid];
  }

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
function cleanMemory(makeNode) {
  // Clean out unused elements.
  if (makeNode && makeNode.nodes) {
    for (var uuid in makeNode.nodes) {
      if (!elementObject.cache.uuid.has(uuid)) {
        delete makeNode.nodes[uuid];
      }
    }
  }

  elementObject.cache.allocated.forEach(function (v) {
    return elementObject.cache.free.push(v);
  });
  elementObject.cache.allocated.clear();
}

},{"../node/make":6,"../util/pools":17}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHTML = parseHTML;
exports.makeParser = makeParser;

var _pools2 = _dereq_('./pools');

var pools = _pools2.pools; // Code based off of:
// https://github.com/ashi009/node-fast-html-parser

var parser = makeParser();
var slice = Array.prototype.slice;

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

/**
 * makeParser
 *
 * @return
 */
function makeParser() {
  var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;

  var kAttributePattern = /\b(id|class)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  var reAttrPattern = /\b([a-z][a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

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
    template: true
  };

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
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
      for (var match; match = reAttrPattern.exec(rawAttrs);) {
        var attr = pools.attributeObject.get();

        attr.name = match[1];
        attr.value = match[6] || match[5] || match[4] || match[1];

        // Look for empty attributes.
        if (match[6] === '""') {
          attr.value = '';
        }

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
    parse: function parse(data) {
      var rootObject = {};
      var root = HTMLElement(null, rootObject);
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      if (data.indexOf('<') === -1 && data) {
        currentParent.childNodes[currentParent.childNodes.length] = TextNode(data);

        return root;
      }

      for (var match, text; match = kMarkupPattern.exec(data);) {
        if (lastTextPos > -1) {
          if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
            // if has content
            text = data.slice(lastTextPos, kMarkupPattern.lastIndex - match[0].length);

            currentParent.childNodes.push(TextNode(text));
          }
        }

        lastTextPos = kMarkupPattern.lastIndex;

        // This is a comment.
        if (match[0][1] === '!') {
          continue;
        }

        if (!match[1]) {
          // not </ tags
          var attrs = {};

          for (var attMatch; attMatch = kAttributePattern.exec(match[3]);) {
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
            // A little test to find next </script> or </style> ...
            var closeMarkup = '</' + match[2] + '>';
            var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
            var length = match[2].length;

            if (index === -1) {
              lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
            } else {
              lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
              match[1] = true;
            }

            var newText = data.slice(match.index + match[0].length, index);

            if (newText.trim()) {
              newText = slice.call(newText).map(function (ch) {
                return escapeMap[ch] || ch;
              }).join('');

              currentParent.childNodes.push(TextNode(newText));
            }
          }
        }
        if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
          // </ or /> or <br> etc.
          while (currentParent) {
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

      // This is an entire document, so only allow the HTML children to be
      // body or head.
      if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
        (function () {
          // Store elements from before body end and after body end.
          var head = { before: [], after: [] };
          var body = { after: [] };
          var beforeHead = true;
          var beforeBody = true;
          var HTML = root.childNodes[0];

          // Iterate the children and store elements in the proper array for
          // later concat, replace the current childNodes with this new array.
          HTML.childNodes = HTML.childNodes.filter(function (el) {
            // If either body or head, allow as a valid element.
            if (el.nodeName === 'body' || el.nodeName === 'head') {
              if (el.nodeName === 'head') {
                beforeHead = false;
              }

              if (el.nodeName === 'body') {
                beforeBody = false;
              }

              return true;
            }
            // Not a valid nested HTML tag element, move to respective container.
            else if (el.nodeType === 1) {
                if (beforeHead && beforeBody) {
                  head.before.push(el);
                } else if (!beforeHead && beforeBody) {
                  head.after.push(el);
                } else if (!beforeBody) {
                  body.after.push(el);
                }
              }
          });

          // Ensure the first element is the HEAD tag.
          if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
            var headInstance = pools.elementObject.get();
            headInstance.nodeName = 'head';
            headInstance.childNodes.length = 0;
            headInstance.attributes.length = 0;

            var existing = headInstance.childNodes;
            existing.unshift.apply(existing, head.before);
            existing.push.apply(existing, head.after);

            HTML.childNodes.unshift(headInstance);
          } else {
            var existing = HTML.childNodes[0].childNodes;
            existing.unshift.apply(existing, head.before);
            existing.push.apply(existing, head.after);
          }

          // Ensure the second element is the body tag.
          if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
            var bodyInstance = pools.elementObject.get();
            bodyInstance.nodeName = 'body';
            bodyInstance.childNodes.length = 0;
            bodyInstance.attributes.length = 0;

            var existing = bodyInstance.childNodes;
            existing.push.apply(existing, body.after);

            HTML.childNodes.push(bodyInstance);
          } else {
            var existing = HTML.childNodes[1].childNodes;
            existing.push.apply(existing, body.after);
          }
        })();
      }

      return root;
    }
  };

  return htmlParser;
}

},{"./pools":17}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = exports.pools = undefined;
exports.createPool = createPool;
exports.initializePools = initializePools;

var _uuid2 = _dereq_('./uuid');

var _uuid3 = _interopRequireDefault(_uuid2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = _uuid3.default;

var pools = exports.pools = {};
var count = exports.count = 10000;

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

  var cache = {
    free: [],
    allocated: new Set(),
    protected: new Set(),
    uuid: new Set()
  };

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    cache.free.push(fill());
  }

  return {
    cache: cache,

    get: function get() {
      var value = cache.free.pop() || fill();
      cache.allocated.add(value);
      return value;
    },
    protect: function protect(value) {
      cache.allocated.delete(value);
      cache.protected.add(value);

      if (name === 'elementObject') {
        cache.uuid.add(value.uuid);
      }
    },
    unprotect: function unprotect(value) {
      if (cache.protected.has(value)) {
        cache.protected.delete(value);
        cache.free.push(value);
      }
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
        uuid: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });
}

// Create 10k items of each type.
initializePools(count);

},{"./uuid":19}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completeRender = completeRender;

var _customEvent = _dereq_('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _patch = _dereq_('../node/patch');

var _patch2 = _interopRequireDefault(_patch);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _tree = _dereq_('../node/tree');

var _memory = _dereq_('../util/memory');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderNext(elementMeta) {
  var nextRender = elementMeta.renderBuffer;
  elementMeta.renderBuffer = undefined;

  // Noticing some weird performance implications with this concept.
  (0, _patch2.default)(nextRender.element, nextRender.newHTML, nextRender.options);
}

/**
 * When the UI or Worker thread completes, clean up memory and schedule the
 * next render if necessary.
 *
 * @param element
 * @param elementMeta
 */
function completeRender(element, elementMeta) {
  return function invokeRender() {
    elementMeta.previousMarkup = elementMeta.options.inner ? element.innerHTML : element.outerHTML;
    elementMeta._textContent = element.textContent;

    (0, _memory.cleanMemory)(_make2.default);

    elementMeta.isRendering = false;

    var stopLooping = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises.
    if (elementMeta.renderBuffer) {
      renderNext(elementMeta);
    } else {
      _tree.TreeCache.forEach(function iterateTreeCache(elementMeta) {
        if (!stopLooping && elementMeta.renderBuffer) {
          renderNext(elementMeta);
          stopLooping = true;
        }
      });
    }

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new _customEvent2.default('renderComplete'));
  };
}

},{"../node/make":6,"../node/patch":7,"../node/tree":10,"../util/memory":15,"../util/pools":17,"custom-event":22}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;
/**
 * Generates a uuid.
 *
 * @see http://stackoverflow.com/a/2117523/282175
 * @return {string} uuid
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

},{}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasWorker = undefined;
exports.create = create;

var _uuid = _dereq_('../util/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _pools = _dereq_('../util/pools');

var _parser = _dereq_('../util/parser');

var _memory = _dereq_('../util/memory');

var _sync = _dereq_('../node/sync');

var _sync2 = _interopRequireDefault(_sync);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _source = _dereq_('./source');

var _source2 = _interopRequireDefault(_source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tests if the browser has support for the `Worker` API.
var hasWorker = exports.hasWorker = typeof Worker === 'function';

// Find all the coverage statements and expressions.
var COV_EXP = /__cov_([^\+\+]*)\+\+/gi;

/**
 * Awful hack to remove `__cov` lines from the source before sending over to
 * the worker. Only useful while testing.
 */
function filterOutCoverage(string) {
  return string.replace(COV_EXP, 'null');
}

/**
 * Creates a new Web Worker per element that will be diffed. Allows multiple
 * concurrent diffing operations to occur simultaneously, leveraging the
 * multi-core nature of desktop and mobile devices.
 *
 * Attach any functions that could be used by the Worker inside the Blob below.
 * All functions are named so they can be accessed globally. Since we're
 * directly injecting the methods into the ES6 template string,
 * `Function.prototype.toString` will be invoked returning a representation of
 * the function's source. This comes at a cost since Babel rewrites variable
 * names when you `import` a module. This is why you'll see underscored
 * properties being imported and then reassigned to non-underscored names in
 * modules that are reused here. Isparta injects coverage function calls that
 * will error out in the Worker, which is why we strip them out.
 *
 * @return {Object} A Worker instance.
 */
function create() {
  var worker = null;
  var workerBlob = null;
  var workerSource = filterOutCoverage('\n    // Reusable Array methods.\n    var slice = Array.prototype.slice;\n    var filter = Array.prototype.filter;\n\n    // Add a namespace to attach pool methods to.\n    var pools = {};\n    var nodes = 0;\n    var REMOVE_ELEMENT_CHILDREN = -2;\n    var REMOVE_ENTIRE_ELEMENT = -1;\n    var MODIFY_ELEMENT = 1;\n    var MODIFY_ATTRIBUTE = 2;\n    var CHANGE_TEXT = 3;\n\n    ' + _uuid2.default + ';\n\n    // Add the ability to protect elements from free\'d memory.\n    ' + _memory.protectElement + ';\n    ' + _memory.unprotectElement + ';\n    ' + _memory.cleanMemory + ';\n\n    // Add in pool manipulation methods.\n    ' + _pools.createPool + ';\n    ' + _pools.initializePools + ';\n\n    initializePools(' + _pools.count + ');\n\n    // Add in Node manipulation.\n    var syncNode = ' + _sync2.default + ';\n    var makeNode = ' + _make2.default + ';\n\n    // Add in the ability to parseHTML.\n    ' + _parser.parseHTML + ';\n\n    var makeParser = ' + _parser.makeParser + ';\n    var parser = makeParser();\n\n    // Add in the worker source.\n    ' + _source2.default + ';\n\n    // Metaprogramming up this worker call.\n    startup(self);\n  ');

  // Set up a WebWorker if available.
  if (hasWorker) {
    // Construct the worker reusing code already organized into modules.  Keep
    // this code ES5 since we do not get time to pre-process it as ES6.
    workerBlob = new Blob([workerSource], { type: 'application/javascript' });

    // Construct the worker and start it up.
    try {
      worker = new Worker(URL.createObjectURL(workerBlob));
    } catch (ex) {
      if (console && console.info) {
        console.info('Failed to create diffhtml worker', ex);
      }

      // If we cannot create a Worker, then disable trying again, all work
      // will happen on the main UI thread.
      exports.hasWorker = hasWorker = false;
    }
  }

  return worker;
}

},{"../node/make":6,"../node/sync":9,"../util/memory":15,"../util/parser":16,"../util/pools":17,"../util/uuid":19,"./source":21}],21:[function(_dereq_,module,exports){
'use strict';

// These are globally defined to avoid issues with JSHint thinking that we're
// referencing unknown identifiers.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startup;
var parseHTML;
var syncNode;
var pools;
var unprotectElement;
var protectElement;
var cleanMemory;

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

  /**
   * Triggered whenever a `postMessage` call is made on the Worker instance
   * from the UI thread. Signals that some work needs to occur. Will post back
   * to the main thread with patch and node transform results.
   *
   * @param e - The normalized event object.
   */
  worker.onmessage = function onmessage(e) {
    var data = e.data;
    var isInner = data.isInner;
    var newTree = null;

    // If an `oldTree` was provided by the UI thread, use that in place of the
    // current `oldTree`.
    if (data.oldTree) {
      if (oldTree) {
        unprotectElement(oldTree);
        cleanMemory();
      }

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
            uuid: oldTree.uuid,
            nodeName: oldTree.nodeName,
            nodeValue: oldTree.nodeValue
          };
        }
      }

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be executed to update the DOM.
    syncNode(oldTree, newTree, patches);

    // Protect the current `oldTree` so that Nodes will not be accidentally
    // recycled in the cleanup process.
    protectElement(oldTree);

    // Send the patches back to the userland.
    worker.postMessage({
      // All the patches to apply to the DOM.
      patches: patches
    });

    // Recycle allocated objects back into the pool.
    cleanMemory();

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

},{}],22:[function(_dereq_,module,exports){
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