(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{"../element/make":2,"../node/make":6}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _svg = _dereq_('../svg');

var svg = _interopRequireWildcard(_svg);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

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

        if (typeof attribute.value === 'string') {
          element.setAttribute(attribute.name, attribute.value);
        } else {
          element[attribute.name] = attribute.value;
        }
      }
    }

    // Append all the children into the element, making sure to run them
    // through this `make` function as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (var _i = 0; _i < descriptor.childNodes.length; _i++) {
        var text = descriptor.childNodes.nodeValue;

        if (text && text.trim && text.trim() === '__DIFFHTML__') {
          var value = supplemental.children.shift();

          if (Array.isArray(value)) {
            value.forEach(function (el) {
              return element.appendChild(make(el));
            });
          } else {
            element.appendChild(make(value));
          }
        } else {
          element.appendChild(make(descriptor.childNodes[_i]));
        }
      }
    }
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _make2.default.nodes[descriptor.uuid] = element;

  return element;
}

},{"../node/make":6,"../svg":12}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.html = html;

var _parser = _dereq_('./util/parser');

// Make a parser.
var isPropEx = /(=|'|")/;

/**
 * Parses a tagged template literal into a diffHTML Virtual DOM representation.
 *
 * @param strings
 * @param ...values
 *
 * @return
 */
function html(strings) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  // Do not attempt to parse empty strings.
  if (!strings[0].length && !values.length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    var _childNodes = (0, _parser.parse)(strings[0]).childNodes;
    return _childNodes.length > 1 ? _childNodes : _childNodes[0];
  }

  var retVal = [];
  var supplemental = {
    props: [],
    children: []
  };

  // Loop over the strings and interpolate the values.
  strings.forEach(function (string) {
    retVal.push(string);

    if (values.length) {
      var value = values.shift();
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isProp = Boolean(lastCharacter.match(isPropEx));

      if (isProp && typeof value !== 'string') {
        supplemental.props.push(value);
        retVal.push('__DIFFHTML__');
      } else if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        supplemental.children.push(value);
        retVal.push('__DIFFHTML__');
      } else {
        retVal.push(String(value));
      }
    }
  });

  var childNodes = (0, _parser.parse)(retVal.join(''), supplemental).childNodes;
  return childNodes.length > 1 ? childNodes : childNodes[0];
}

},{"./util/parser":16}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = exports.DOMException = exports.TransitionStateError = undefined;

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

var _html = _dereq_('./html');

Object.defineProperty(exports, 'html', {
  enumerable: true,
  get: function get() {
    return _html.html;
  }
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.release = release;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.enableProllyfill = enableProllyfill;

var _patch = _dereq_('./node/patch');

var _patch2 = _interopRequireDefault(_patch);

var _release = _dereq_('./node/release');

var _release2 = _interopRequireDefault(_release);

var _make = _dereq_('./node/make');

var _make2 = _interopRequireDefault(_make);

var _tree = _dereq_('./node/tree');

var _transitions = _dereq_('./transitions');

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
 * Releases the memory allocated to this element. Useful for cleaning up
 * components when removed in tests and applications.
 *
 * @param element
 */
function release(element) {
  (0, _release2.default)(element);
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
  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'html', {
    configurable: true,

    value: _html.html
  });

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

  // Exposes the API into the Element, ShadowDOM, and DocumentFragment
  // constructors.
  [typeof Element !== 'undefined' ? Element : undefined, typeof HTMLElement !== 'undefined' ? HTMLElement : undefined, typeof ShadowRoot !== 'undefined' ? ShadowRoot : undefined, typeof DocumentFragment !== 'undefined' ? DocumentFragment : undefined].filter(Boolean).forEach(function (Ctor) {
    Object.defineProperty(Ctor.prototype, 'diffInnerHTML', {
      configurable: true,

      set: function set(newHTML) {
        innerHTML(this, newHTML);
      }
    });

    // Allows a developer to set the `outerHTML` of an element.
    Object.defineProperty(Ctor.prototype, 'diffOuterHTML', {
      configurable: true,

      set: function set(newHTML) {
        outerHTML(this, newHTML);
      }
    });

    // Allows a developer to diff the current element with a new element.
    Object.defineProperty(Ctor.prototype, 'diffElement', {
      configurable: true,

      value: function value(newElement, options) {
        element(this, newElement, options);
      }
    });

    // Releases the retained memory.
    Object.defineProperty(Ctor.prototype, 'diffRelease', {
      configurable: true,

      value: function value() {
        (0, _release2.default)(this);
      }
    });
  });
}

},{"./errors":3,"./html":4,"./node/make":6,"./node/patch":7,"./node/release":8,"./node/tree":10,"./transitions":13}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _pools = _dereq_('../util/pools');

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
  var nodeType = node.nodeType;

  // Whitelist: Elements, TextNodes, and Shadow Root.
  if (nodeType !== 1 && nodeType !== 3 && nodeType !== 11) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = _pools.pools.elementObject.get();

  // Associate this newly allocated uuid with this Node.
  make.nodes[entry.uuid] = node;

  // Set a lowercased (normalized) version of the element's nodeName.
  entry.nodeName = node.nodeName.toLowerCase();

  // If the element is a text node set the nodeValue.
  if (nodeType === 3) {
    entry.nodeValue = node.textContent;
    entry.nodeType = 3;
  } else {
    entry.nodeValue = '';
    entry.nodeType = 1;
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
        var attr = _pools.pools.attributeObject.get();

        attr.name = attributes[i].name;
        attr.value = attributes[i].value;

        if (attr.name === 'key') {
          entry.key = attr.value;
        }

        entry.attributes[entry.attributes.length] = attr;
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes ? node.childNodes : [];
  var childNodesLength = childNodes.length;

  // If the element has child nodes, convert them all to virtual nodes.
  if (nodeType !== 3 && childNodesLength) {
    for (var _i = 0; _i < childNodesLength; _i++) {
      var newNode = make(childNodes[_i]);

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

  return entry;
}

},{"../util/pools":17}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchNode;

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
 * @param options
 */
function patchNode(element, newHTML, options) {
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
  // continuing. Only support this if the new markup is a string, otherwise
  // it's possible for our object recycling to match twice.
  if (typeof newHTML === 'string' && elementMeta.newHTML === newHTML) {
    return;
  }
  // Associate the last markup rendered with this element.
  else if (typeof newHTML === 'string') {
      elementMeta.newHTML = newHTML;
    }

  var rebuildTree = function rebuildTree() {
    var oldTree = elementMeta.oldTree;

    if (oldTree) {
      (0, _memory.unprotectElement)(oldTree, _make2.default);
    }

    elementMeta.oldTree = (0, _memory.protectElement)((0, _make2.default)(element));
  };

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // We're rendering in the UI thread.
  elementMeta.isRendering = true;

  var newTree = null;

  if (typeof newHTML === 'string') {
    newTree = (0, _parser.parse)(newHTML);
    newTree = options.inner ? newTree : newTree[0];
  } else if (newHTML.ownerDocument) {
    newTree = (0, _make2.default)(newHTML);
  } else {
    newTree = newHTML;
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

},{"../patches/process":11,"../util/memory":15,"../util/parser":16,"../util/pools":17,"../util/render":18,"./make":6,"./sync":9,"./tree":10}],8:[function(_dereq_,module,exports){
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
    // If there was a tree set up, recycle the memory allocated for it.
    if (elementMeta.oldTree) {
      (0, _memory.unprotectElement)(elementMeta.oldTree, _make2.default);
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

var _pools = _dereq_('../util/pools');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  var oldIsFragment = oldTree.nodeName === '#document-fragment';
  var newIsFragment = newTree.nodeName === '#document-fragment';
  var skipAttributeCompare = false;

  // Replace the key attributes.
  oldTree.key = newTree.key;

  // Fragments should not compare attributes.
  if (oldIsFragment || newIsFragment) {
    skipAttributeCompare = true;
  }
  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  else if (oldTree.nodeName !== newTree.nodeName) {
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

    return patches;
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
    (function () {
      // For now just splice out the end items.
      var diff = oldChildNodesLength - childNodesLength;
      var shallowClone = [].concat(_toConsumableArray(oldChildNodes));
      var offset = 0;
      var toRemove = null;

      // Ensure keys exist for all the old & new elements.
      var newHasKeys = childNodes.some(function (childNode) {
        return !childNode.is;
      });

      // There needs to be keys to diff, if not, there's no point in checking.
      if (!newHasKeys) {
        toRemove = oldChildNodes.splice(oldChildNodesLength - diff, diff);
      }
      // This is an expensive operation so we do the above check to ensure that a
      // key was specified.
      else {
          // If the original childNodes contain a key attribute, use this to
          // compare over the naive method below.
          toRemove = shallowClone.reduce(function (toRemove, oldChildNode, index) {
            var newChildNode = childNodes[index + offset];
            var oldIndex = oldChildNodes.indexOf(oldChildNode);

            // We've found all the removals.
            if (toRemove.length === diff) {
              return toRemove;
            }
            // If we're still iterating and ran out of items.
            else if (!newChildNode) {
                offset += 1;
                toRemove.push(oldChildNode);
                oldChildNodes.splice(oldIndex, 1);
              }
              // The keys do not match.
              else if (oldChildNode.key !== newChildNode.key) {
                  offset += 1;
                  toRemove.push(oldChildNode);
                  oldChildNodes.splice(oldIndex, 1);
                }

            return toRemove;
          }, []);
        }

      oldChildNodesLength = oldChildNodes.length;

      if (childNodesLength === 0) {
        patches.push({
          __do__: REMOVE_ELEMENT_CHILDREN,
          element: oldTree,
          toRemove: toRemove
        });
      } else {
        // Remove the element, this happens before the splice so that we still
        // have access to the element.
        toRemove.forEach(function (old) {
          return patches.push({
            __do__: MODIFY_ELEMENT,
            old: old
          });
        });
      }
    })();
  }

  // Replace elements if they are different.
  if (oldChildNodesLength >= childNodesLength) {
    for (var _i = 0; _i < childNodesLength; _i++) {
      if (oldChildNodes[_i].nodeName !== childNodes[_i].nodeName) {
        // Add to the patches.
        patches.push({
          __do__: MODIFY_ELEMENT,
          old: oldChildNodes[_i],
          new: childNodes[_i]
        });

        // Replace the internal tree's point of view of this element.
        oldChildNodes[_i] = childNodes[_i];
      } else {
        sync(oldChildNodes[_i], childNodes[_i], patches);
      }
    }
  }

  // Synchronize attributes
  var attributes = newTree.attributes;

  if (attributes && !skipAttributeCompare) {
    var oldLength = oldTree.attributes.length;
    var newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      var toAdd = slice.call(attributes, oldLength);

      for (var _i2 = 0; _i2 < toAdd.length; _i2++) {
        var change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toAdd[_i2].name,
          value: toAdd[_i2].value
        };

        var attr = _pools.pools.attributeObject.get();
        attr.name = toAdd[_i2].name;
        attr.value = toAdd[_i2].value;

        _pools.pools.attributeObject.protect(attr);

        // Push the change object into into the virtual tree.
        oldTree.attributes.push(attr);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      var _toRemove = slice.call(oldTree.attributes, newLength);

      for (var _i3 = 0; _i3 < _toRemove.length; _i3++) {
        var _change = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: _toRemove[_i3].name,
          value: undefined
        };

        // Remove the attribute from the virtual node.
        var _removed = oldTree.attributes.splice(_i3, 1);

        for (var _i4 = 0; _i4 < _removed.length; _i4++) {
          _pools.pools.attributeObject.unprotect(_removed[_i4]);
        }

        // Add the change to the series of patches.
        patches.push(_change);
      }
    }

    // Check for modifications.
    var toModify = attributes;

    for (var _i5 = 0; _i5 < toModify.length; _i5++) {
      var oldAttrValue = oldTree.attributes[_i5] && oldTree.attributes[_i5].value;
      var newAttrValue = attributes[_i5] && attributes[_i5].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        var _change2 = {
          __do__: MODIFY_ATTRIBUTE,
          element: oldTree,
          name: toModify[_i5].name,
          value: toModify[_i5].value
        };

        // Replace the attribute in the virtual node.
        var _attr = oldTree.attributes[_i5];
        _attr.name = toModify[_i5].name;
        _attr.value = toModify[_i5].value;

        // Add the change to the series of patches.
        patches.push(_change2);
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
 * @param patches - Array that contains patch objects.
 */
function process(element, patches) {
  var elementMeta = _tree.TreeCache.get(element);
  var promises = [];
  var triggerTransition = transition.buildTrigger(promises);

  // Trigger the attached transition state for this element and all childNodes.
  var attached = function attached(descriptor, fragment, parentNode) {
    (0, _memory.protectElement)(descriptor);

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

    if (descriptor.attributes && descriptor.attributes.length) {
      descriptor.attributes.forEach(function (attr) {
        var attrChangePromises = transition.makePromises('attributeChanged', [el], attr.name, null, attr.value);

        triggerTransition('attributeChanged', attrChangePromises, function (promises) {});
      });
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
    var el = patch.element ? (0, _get2.default)(patch.element).element : null;
    var oldEl = patch.old ? (0, _get2.default)(patch.old).element : null;
    var newEl = patch.new ? (0, _get2.default)(patch.new).element : null;

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === sync.REMOVE_ELEMENT_CHILDREN) {
      var childNodes = el.childNodes;
      var detachPromises = transition.makePromises('detached', childNodes);

      triggerTransition('detached', detachPromises, function (promises) {
        patch.toRemove.forEach(function (x) {
          return (0, _memory.unprotectElement)(x, _make2.default);
        });
        el.innerHTML = '';
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === sync.REMOVE_ENTIRE_ELEMENT) {
        var _detachPromises = transition.makePromises('detached', [el]);

        if (el.parentNode) {
          triggerTransition('detached', _detachPromises, function (promises) {
            el.parentNode.removeChild(el);
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
            var attachedPromises = transition.makePromises('attached', [newEl]);
            var detachedPromises = transition.makePromises('detached', [oldEl]);
            var replacedPromises = transition.makePromises('replaced', [oldEl], newEl);

            // Add all the transition state promises into the main array, we'll use
            // them all to decide when to alter the DOM.
            triggerTransition('detached', detachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            triggerTransition('attached', attachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
              attached(patch.new, null, newEl);
            });

            triggerTransition('replaced', replacedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            (0, _memory.unprotectElement)(patch.old, _make2.default);

            // Reset the tree cache.
            _tree.TreeCache.set(newEl, {
              oldTree: patch.new,
              element: newEl
            });

            // Once all the promises have completed, invoke the action, if no
            // promises were added, this will be a synchronous operation.
            if (allPromises.length) {
              Promise.all(allPromises).then(function replaceEntireElement() {
                if (!oldEl.parentNode) {
                  (0, _memory.unprotectElement)(patch.new, _make2.default);

                  throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                }

                oldEl.parentNode.replaceChild(newEl, oldEl);
              }, function (ex) {
                return console.log(ex);
              });
            } else {
              if (!oldEl.parentNode) {
                (0, _memory.unprotectElement)(patch.new, _make2.default);

                throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
              }

              oldEl.parentNode.replaceChild(newEl, oldEl);
            }
          })();
        }

        // Node manip.
        else if (patch.__do__ === sync.MODIFY_ELEMENT) {
            // Add.
            if (el && patch.fragment && !oldEl) {
              (function () {
                var fragment = document.createDocumentFragment();

                // Loop over every element to be added and process the descriptor
                // into the real element and append into the DOM fragment.
                toAttach = patch.fragment.map(function (el) {
                  return attached(el, fragment, el);
                });

                // Turn elements into childNodes of the patch element.

                el.appendChild(fragment);

                // Trigger transitions.
                var makeAttached = transition.makePromises('attached', toAttach);
                triggerTransition('attached', makeAttached);
              })();
            }

            // Remove.
            else if (oldEl && !newEl) {
                if (!oldEl.parentNode) {
                  (0, _memory.unprotectElement)(patch.old, _make2.default);

                  throw new Error('Can\'t remove without parent, is this the ' + 'document root?');
                }

                var makeDetached = transition.makePromises('detached', [oldEl]);

                triggerTransition('detached', makeDetached, function () {
                  if (oldEl.parentNode) {
                    oldEl.parentNode.removeChild(oldEl);
                  }

                  // And then empty out the entire contents.
                  oldEl.innerHTML = '';

                  (0, _memory.unprotectElement)(patch.old, _make2.default);
                });
              }

              // Replace.
              else if (oldEl && newEl) {
                  (function () {
                    if (!oldEl.parentNode) {
                      (0, _memory.unprotectElement)(patch.old, _make2.default);
                      (0, _memory.unprotectElement)(patch.new, _make2.default);

                      throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                    }

                    // Append the element first, before doing the replacement.
                    if (oldEl.nextSibling) {
                      oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
                    } else {
                      oldEl.parentNode.appendChild(newEl);
                    }

                    // Removed state for transitions API.
                    var allPromises = [];
                    var attachPromises = transition.makePromises('attached', [newEl]);
                    var detachPromises = transition.makePromises('detached', [oldEl]);
                    var replacePromises = transition.makePromises('replaced', [oldEl], newEl);

                    triggerTransition('replaced', replacePromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                    });

                    triggerTransition('detached', detachPromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                    });

                    triggerTransition('attached', attachPromises, function (promises) {
                      allPromises.push.apply(allPromises, promises);
                      attached(patch.new);
                    });

                    // Once all the promises have completed, invoke the action, if no
                    // promises were added, this will be a synchronous operation.
                    if (allPromises.length) {
                      Promise.all(allPromises).then(function replaceElement() {
                        if (oldEl.parentNode) {
                          oldEl.parentNode.replaceChild(newEl, oldEl);
                        }

                        (0, _memory.unprotectElement)(patch.old, _make2.default);

                        (0, _memory.protectElement)(patch.new);
                      }, function (ex) {
                        return console.log(ex);
                      });
                    } else {
                      if (!oldEl.parentNode) {
                        (0, _memory.unprotectElement)(patch.old, _make2.default);
                        (0, _memory.unprotectElement)(patch.new, _make2.default);

                        throw new Error('Can\'t replace without parent, is this the ' + 'document root?');
                      }

                      oldEl.parentNode.replaceChild(newEl, oldEl);
                      (0, _memory.unprotectElement)(patch.old, _make2.default);
                      (0, _memory.protectElement)(patch.new);
                    }
                  })();
                }
          }

          // Attribute manipulation.
          else if (patch.__do__ === sync.MODIFY_ATTRIBUTE) {
              var attrChangePromises = transition.makePromises('attributeChanged', [el], patch.name, el.getAttribute(patch.name), patch.value);

              triggerTransition('attributeChanged', attrChangePromises, function (promises) {
                // Remove.
                if (patch.value === undefined) {
                  el.removeAttribute(patch.name);

                  if (patch.name in el) {
                    el[patch.name] = undefined;
                  }
                }
                // Change.
                else {
                    // Is an attribute.
                    if (typeof patch.value === 'string') {
                      el.setAttribute(patch.name, patch.value);
                    }
                    // Is a property.
                    else {
                        // Necessary to track the attribute/prop existence.
                        el.setAttribute(patch.name, '');
                        el[patch.name] = patch.value;
                      }

                    // Support live updating of the value attribute.
                    // Support live updating of the value attribute.
                    if (patch.name === 'value' || patch.name === 'checked') {
                      el[patch.name] = patch.value;
                    }
                  }
              });
            }

            // Text node manipulation.
            else if (patch.__do__ === sync.CHANGE_TEXT) {
                var textChangePromises = transition.makePromises('textChanged', [el], el.nodeValue, patch.value);

                triggerTransition('textChanged', textChangePromises, function (promises) {
                  patch.element.nodeValue = (0, _entities.decodeEntities)(patch.value);
                  el.nodeValue = patch.element.nodeValue;

                  if (el.parentNode) {
                    var nodeName = el.parentNode.nodeName.toLowerCase();

                    if (blockTextElements.indexOf(nodeName) > -1) {
                      el.parentNode.nodeValue = patch.element.nodeValue;
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

},{"../element/get":1,"../node/make":6,"../node/sync":9,"../node/tree":10,"../transitions":13,"../util/entities":14,"../util/memory":15,"../util/pools":17}],12:[function(_dereq_,module,exports){
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

var _make = _dereq_('./node/make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    }
  },

  detached: {
    mapFn: function mapFn(el) {
      return function (cb) {
        return cb(el);
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
  return function (stateName, makePromisesCallback, callback) {
    if (states[stateName] && states[stateName].length) {
      // Calls into each custom hook to bind Promises into the local array,
      // these will then get merged into the main `allPromises` array.
      var promises = makePromisesCallback([]);

      // Add these promises into the global cache.
      addPromises(promises);

      if (!promises.length && callback) {
        callback(promises);
      } else {
        Promise.all(promises).then(callback, function handleRejection(ex) {
          console.log(ex);
        });
      }
    } else if (callback) {
      callback();
    }
  };
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

  // Accepts the local Array of promises to use.
  return function (promises) {
    return make[stateName](elements, args.slice(1), promises);
  };
}

},{"./node/make":6}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeEntities = decodeEntities;
var element = document.createElement('div');

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
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

var _pools = _dereq_('../util/pools');

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
function protectElement(element) {
  var elementObject = _pools.pools.elementObject;
  var attributeObject = _pools.pools.attributeObject;

  elementObject.protect(element);

  element.attributes.forEach(attributeObject.protect, attributeObject);
  element.childNodes.forEach(protectElement);

  return element;
}

/**
 * Allows an element to be recycled during a render cycle.
 *
 * @param element
 * @return
 */
function unprotectElement(element, makeNode) {
  var elementObject = _pools.pools.elementObject;
  var attributeObject = _pools.pools.attributeObject;

  elementObject.unprotect(element);
  elementObject.cache.uuid.delete(element.uuid);

  element.attributes.forEach(attributeObject.unprotect, attributeObject);
  element.childNodes.forEach(function (node) {
    return unprotectElement(node, makeNode);
  });

  if (makeNode && makeNode.nodes) {
    delete makeNode.nodes[element.uuid];
  }

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
function cleanMemory(makeNode) {
  var elementObject = _pools.pools.elementObject;
  var attributeObject = _pools.pools.attributeObject;

  // Clean out unused elements.
  if (makeNode && makeNode.nodes) {
    for (var uuid in makeNode.nodes) {
      if (!elementObject.cache.uuid.has(uuid)) {
        delete makeNode.nodes[uuid];
      }
    }
  }

  // Empty all element allocations.
  elementObject.cache.allocated.forEach(function (v) {
    elementObject.cache.free.push(v);
  });

  elementObject.cache.allocated.clear();

  // Empty all attribute allocations.
  attributeObject.cache.allocated.forEach(function (v) {
    attributeObject.cache.free.push(v);
  });

  attributeObject.cache.allocated.clear();
}

},{"../node/make":6,"../util/pools":17}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

var _pools = _dereq_('./pools');

var slice = Array.prototype.slice; // Code based off of:
// https://github.com/ashi009/node-fast-html-parser

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
  var instance = _pools.pools.elementObject.get();

  instance.nodeName = '#text';
  instance.nodeValue = value;
  instance.nodeType = 3;
  instance.key = '';
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
 * @param {Object} supplemental data
 */
function HTMLElement(name, keyAttrs, rawAttrs, supplemental) {
  var instance = _pools.pools.elementObject.get();

  instance.nodeName = name;
  instance.nodeValue = '';
  instance.nodeType = 1;
  instance.key = '';
  instance.childNodes.length = 0;
  instance.attributes.length = 0;

  if (rawAttrs) {
    for (var match; match = reAttrPattern.exec(rawAttrs);) {
      var attr = _pools.pools.attributeObject.get();

      attr.name = match[1];
      attr.value = match[6] || match[5] || match[4] || match[1];

      if (attr.value === '__DIFFHTML__') {
        attr.value = supplemental.props.shift();
      }

      // If a key attribute is found attach directly to the instance.
      if (attr.name === 'key') {
        instance.key = attr.value;
      }

      // Look for empty attributes.
      if (match[6] === '""') {
        attr.value = '';
      }

      instance.attributes.push(attr);
    }
  }

  return instance;
}

/**
 * Parses HTML and returns a root element
 *
 * @param  {string} data      html
 * @param  {array} supplemental      data
 * @return {HTMLElement}      root element
 */
function parse(data, supplemental) {
  var rootObject = {};
  var root = HTMLElement(null, rootObject);
  var currentParent = root;
  var stack = [root];
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in data as a single
  // text node.
  if (data.indexOf('<') === -1 && data) {
    currentParent.childNodes.push(TextNode(data));
    return root;
  }

  for (var match, text; match = kMarkupPattern.exec(data);) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        // if has content
        text = data.slice(lastTextPos, kMarkupPattern.lastIndex - match[0].length);

        if (text && text.trim && text.trim() === '__DIFFHTML__') {
          var value = supplemental.children.shift();
          var childrenToAdd = [].concat(value);

          currentParent.childNodes.push.apply(currentParent.childNodes, childrenToAdd);
        } else {
          currentParent.childNodes.push(TextNode(text));
        }
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

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], attrs, match[3], supplemental)) - 1];

      stack.push(currentParent);

      if (kBlockTextElements[match[2]]) {
        // A little test to find next </script> or </style> ...
        var closeMarkup = '</' + match[2] + '>';
        var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        var length = match[2].length;

        if (index === -1) {
          lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          kMarkupPattern.lastIndex = lastTextPos;
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
          var tag = kElementsClosedByClosing[currentParent.nodeName];

          // Trying to close current tag, and move on
          if (tag) {
            if (tag[match[2]]) {
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
        var headInstance = _pools.pools.elementObject.get();
        headInstance.nodeName = 'head';
        headInstance.childNodes.length = 0;
        headInstance.attributes.length = 0;

        var existing = headInstance.childNodes;
        existing.unshift.apply(existing, head.before);
        existing.push.apply(existing, head.after);

        HTML.childNodes.unshift(headInstance);
      } else {
        var _existing = HTML.childNodes[0].childNodes;
        _existing.unshift.apply(_existing, head.before);
        _existing.push.apply(_existing, head.after);
      }

      // Ensure the second element is the body tag.
      if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
        var bodyInstance = _pools.pools.elementObject.get();
        bodyInstance.nodeName = 'body';
        bodyInstance.childNodes.length = 0;
        bodyInstance.attributes.length = 0;

        var _existing2 = bodyInstance.childNodes;
        _existing2.push.apply(_existing2, body.after);

        HTML.childNodes.push(bodyInstance);
      } else {
        var _existing3 = HTML.childNodes[1].childNodes;
        _existing3.push.apply(_existing3, body.after);
      }
    })();
  }

  return root;
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
        nodeName: '',
        nodeValue: '',
        nodeType: 1,
        key: '',
        uuid: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });
}

// Create ${COUNT} items of each type.
initializePools(count);

},{"./uuid":19}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completeRender = completeRender;

var _patch = _dereq_('../node/patch');

var _patch2 = _interopRequireDefault(_patch);

var _make = _dereq_('../node/make');

var _make2 = _interopRequireDefault(_make);

var _tree = _dereq_('../node/tree');

var _memory = _dereq_('../util/memory');

var _pools = _dereq_('../util/pools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * renderNext
 *
 * @param elementMeta
 * @return
 */
function renderNext(elementMeta) {
  var nextRender = elementMeta.renderBuffer;
  elementMeta.renderBuffer = undefined;

  // Noticing some weird performance implications with this concept.
  (0, _patch2.default)(nextRender.element, nextRender.newHTML, nextRender.options);
}

/**
 * When the render completes, clean up memory, and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 */
function completeRender(element, elementMeta) {
  return function invokeRender() {
    elementMeta.previousMarkup = elementMeta.options.inner ? element.innerHTML : element.outerHTML;
    elementMeta._textContent = element.textContent;

    elementMeta.isRendering = false;

    // Boolean to stop operations in the TreeCache loop below.
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

    // Clean out all the existing allocations.
    (0, _memory.cleanMemory)(_make2.default);

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new CustomEvent('renderComplete'));
  };
}

},{"../node/make":6,"../node/patch":7,"../node/tree":10,"../util/memory":15,"../util/pools":17}],19:[function(_dereq_,module,exports){
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

},{}]},{},[5])(5)
});