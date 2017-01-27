(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _tree = _dereq_('./tree');

var _util = _dereq_('./util');

var isAttributeEx = /(=|"|')[^><]*?$/;
var isTagEx = /(<|\/)/;
var TOKEN = '__DIFFHTML__';

/**
 * Get the next value from the list. If the next value is a string, make sure
 * it is escaped.
 *
 * @param {Array} values - Values extracted from tagged template literal
 * @return {String|*} - Escaped string, otherwise any value passed
 */
var nextValue = function nextValue(values) {
  var value = values.shift();
  return typeof value === 'string' ? (0, _util.escape)(value) : value;
};

function handleTaggedTemplate(options, strings) {
  for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    values[_key - 2] = arguments[_key];
  }

  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings[0].length && !values.length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    var _childNodes = (0, _util.parse)(strings[0]).childNodes;
    return _childNodes.length > 1 ? _childNodes : _childNodes[0];
  }

  // Used to store markup and tokens.
  var retVal = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  var supplemental = {
    attributes: [],
    children: [],
    tags: []
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach(function (string, i) {
    // Always add the string, we need it to parse the markup later.
    retVal += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      var value = nextValue(values);
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isAttribute = Boolean(retVal.match(isAttributeEx));
      var isTag = Boolean(lastCharacter.match(isTagEx));

      // Injected as attribute.
      if (isAttribute) {
        supplemental.attributes.push(value);
        retVal += TOKEN;
      }
      // Injected as tag.
      else if (isTag && typeof value !== 'string') {
          supplemental.tags.push(value);
          retVal += TOKEN;
        }
        // Injected as a child node.
        else if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            supplemental.children.push((0, _tree.createTree)(value));
            retVal += TOKEN;
          }
          // Injected as something else in the markup or undefined.
          else if (value !== null && value !== undefined) {
              retVal += value;
            }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  var childNodes = (0, _util.parse)(retVal, supplemental, options).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : childNodes;
}

// Loose mode (default)
var html = function html() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return handleTaggedTemplate.apply(undefined, [{}].concat(args));
};

// Strict mode (optional enforcing closing tags)
html.strict = function () {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return handleTaggedTemplate.apply(undefined, [{ strict: true }].concat(args));
};

exports.default = html;

},{"./tree":17,"./util":23}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.use = exports.createTree = exports.release = exports.html = exports.removeTransitionState = exports.addTransitionState = exports.__VERSION__ = undefined;

var _transition = _dereq_('./transition');

Object.defineProperty(exports, 'addTransitionState', {
  enumerable: true,
  get: function get() {
    return _transition.addTransitionState;
  }
});
Object.defineProperty(exports, 'removeTransitionState', {
  enumerable: true,
  get: function get() {
    return _transition.removeTransitionState;
  }
});

var _html = _dereq_('./html');

Object.defineProperty(exports, 'html', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_html).default;
  }
});

var _release = _dereq_('./release');

Object.defineProperty(exports, 'release', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_release).default;
  }
});

var _create = _dereq_('./tree/create');

Object.defineProperty(exports, 'createTree', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_create).default;
  }
});

var _use = _dereq_('./use');

Object.defineProperty(exports, 'use', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_use).default;
  }
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;

var _transaction = _dereq_('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Export the version based on the package.json version field value, is inlined
 * with babel.
 */
var __VERSION__ = exports.__VERSION__ = '1.0.0-beta';

/**
 * Adds a global transition listener. With many elements this could be an
 * expensive operation, so try to limit the amount of listeners added if you're
 * concerned about performance.
 *
 * Since the callback triggers with various elements, most of which you
 * probably don't care about, you'll want to filter. A good way of filtering
 * is to use the DOM `matches` method. It's fairly well supported
 * (http://caniuse.com/#feat=matchesselector) and may suit many projects. If
 * you need backwards compatibility, consider using jQuery's `is`.
 *
 * @example
 *
 *    import { addTransitionState } from 'diffhtml';
 *
 *    // Fade in all elements as they are added to the DOM.
 *    addTransitionState('attached', el => $(el).fadeIn().promise());
 *
 *    // Fade out all elements as they leave the DOM.
 *    addTransitionState('detached', el => $(el).fadeOut().promise());
 *
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */


/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents. Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @example
 *
 *    import { outerHTML } from 'diffhtml';
 *
 *    // Remove all attributes and set the children to be a single text node
 *    // containing the text 'Hello world',
 *    outerHTML(document.body, '<body>Hello world</body>');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function outerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = false;
  return _transaction2.default.create(element, markup, options).start();
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents. This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @example
 *
 *    import { innerHTML } from 'diffhtml';
 *
 *    // Sets the body children to be a single text node containing the text
 *    // 'Hello world'.
 *    innerHTML(document.body, 'Hello world');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function innerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = true;
  return _transaction2.default.create(element, markup, options).start();
}

},{"./html":1,"./release":6,"./transaction":14,"./transition":15,"./tree/create":16,"./use":19}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _make = _dereq_('./make');

Object.defineProperty(exports, 'makeNode', {
  enumerable: true,
  get: function get() {
    return _make.makeNode;
  }
});

var _patch = _dereq_('./patch');

Object.defineProperty(exports, 'patchNode', {
  enumerable: true,
  get: function get() {
    return _patch.patchNode;
  }
});

},{"./make":4,"./patch":5}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.makeNode = makeNode;

var _util = _dereq_('../util');

var keys = Object.keys;

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @return {Object} - A DOM Node matching the vTree
 */

function makeNode(vTree) {
  if (!vTree) {
    throw new Error('Missing VTree when trying to create DOM Node');
  }
  //console.log(`Making ${vTree.nodeName}${JSON.stringify(vTree.attributes)}`);

  // If the DOM Node was already created, reuse the existing node.
  if (_util.NodeCache.has(vTree)) {
    return _util.NodeCache.get(vTree);
  }

  var nodeName = vTree.nodeName,
      childNodes = vTree.childNodes,
      attributes = vTree.attributes,
      nodeValue = vTree.nodeValue;

  // Will vary based on the properties of the VTree.

  var domNode = null;

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    domNode = document.createTextNode((0, _util.decodeEntities)(nodeValue));
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
      domNode = document.createDocumentFragment();
    }
    // If the nodeName matches any of the known SVG element names, mark it as
    // SVG. The reason for doing this over detecting if nested in an <svg>
    // element, is that we do not currently have circular dependencies in the
    // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
    else if (_util.elements.indexOf(nodeName) > -1) {
        domNode = document.createElementNS(_util.namespace, nodeName);
      }
      // If not a Text or SVG Node, then create with the standard method.
      else {
          domNode = document.createElement(nodeName);
        }

  // Get an array of all the attribute names.
  var attributeNames = keys(attributes);

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.

  var _loop = function _loop(i) {
    var name = attributeNames[i];
    var value = attributes[name];

    var isString = typeof value === 'string';
    var isBoolean = typeof value === 'boolean';
    var isNumber = typeof value === 'number';
    var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';

    if (isObject && name === 'style') {
      Object.keys(value).forEach(function (name) {
        return domNode.style[name] = value[name];
      });
    }
    // If not a dynamic type, set as an attribute, since it's a valid
    // attribute value.
    else if (name && (isString || isBoolean || isNumber)) {
        domNode.setAttribute(name, (0, _util.decodeEntities)(value));
      } else if (name) {
        // Necessary to track the attribute/prop existence.
        domNode.setAttribute(name, '');

        // Since this is a dynamic value it gets set as a property.
        domNode[name] = value;
      }
  };

  for (var i = 0; i < attributeNames.length; i++) {
    _loop(i);
  }

  // Add to the domNodes cache.
  _util.NodeCache.set(vTree, domNode);

  if (_util.ComponentCache.has(vTree)) {
    _util.ComponentCache.get(vTree).domNode = domNode;
  }

  // Append all the children into the domNode, making sure to run them
  // through this `make` function as well.
  for (var i = 0; i < childNodes.length; i++) {
    domNode.appendChild(makeNode(childNodes[i]));
  }

  return domNode;
}

},{"../util":23}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.patchNode = patchNode;

var _node = _dereq_('../node');

var _util = _dereq_('../util');

var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

function patchNode(patches, state) {
  var promises = [];
  var TREE_OPS = patches.TREE_OPS,
      NODE_VALUE = patches.NODE_VALUE,
      SET_ATTRIBUTE = patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;

  // First do all DOM tree operations, and then do attribute and node value.

  for (var i = 0; i < TREE_OPS.length; i++) {
    var _TREE_OPS$i = TREE_OPS[i],
        INSERT_BEFORE = _TREE_OPS$i.INSERT_BEFORE,
        REMOVE_CHILD = _TREE_OPS$i.REMOVE_CHILD,
        REPLACE_CHILD = _TREE_OPS$i.REPLACE_CHILD;

    // Insert/append elements.

    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (var _i = 0; _i < INSERT_BEFORE.length; _i++) {
        var _INSERT_BEFORE$_i = _slicedToArray(INSERT_BEFORE[_i], 3),
            vTree = _INSERT_BEFORE$_i[0],
            childNodes = _INSERT_BEFORE$_i[1],
            referenceNode = _INSERT_BEFORE$_i[2];

        var domNode = _util.NodeCache.get(vTree);
        var refNode = referenceNode ? (0, _node.makeNode)(referenceNode) : null;
        var fragment = null;

        if (referenceNode) {
          (0, _util.protectVTree)(referenceNode);
        }

        if (childNodes.length) {
          fragment = document.createDocumentFragment();

          for (var _i2 = 0; _i2 < childNodes.length; _i2++) {
            fragment.appendChild((0, _node.makeNode)(childNodes[_i2]));
            (0, _util.protectVTree)(childNodes[_i2]);
          }
        } else {
          fragment = (0, _node.makeNode)(childNodes);
          (0, _util.protectVTree)(childNodes);
        }

        domNode.insertBefore(fragment, refNode);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (var _i3 = 0; _i3 < REMOVE_CHILD.length; _i3++) {
        var childNode = REMOVE_CHILD[_i3];
        var _domNode = _util.NodeCache.get(childNode);

        if (_util.ComponentCache.has(childNode)) {
          _util.ComponentCache.get(childNode).componentWillUnmount();
        }

        _domNode.parentNode.removeChild(_domNode);
        (0, _util.unprotectVTree)(childNode);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (var _i4 = 0; _i4 < REPLACE_CHILD.length; _i4++) {
        var _REPLACE_CHILD$_i = _slicedToArray(REPLACE_CHILD[_i4], 2),
            newChildNode = _REPLACE_CHILD$_i[0],
            oldChildNode = _REPLACE_CHILD$_i[1];

        var oldDomNode = _util.NodeCache.get(oldChildNode);
        var newDomNode = (0, _node.makeNode)(newChildNode);

        oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
        (0, _util.protectVTree)(newChildNode);
        (0, _util.unprotectVTree)(oldChildNode);
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (var _i5 = 0; _i5 < NODE_VALUE.length; _i5 += 2) {
      var vTree = NODE_VALUE[_i5];
      var nodeValue = NODE_VALUE[_i5 + 1];

      var _domNode2 = _util.NodeCache.get(vTree);
      var parentNode = _domNode2.parentNode;


      if (nodeValue.includes('&')) {
        _domNode2.nodeValue = (0, _util.decodeEntities)((0, _util.escape)(nodeValue));
      } else {
        _domNode2.nodeValue = (0, _util.escape)(nodeValue);
      }

      if (parentNode) {
        if (blockText.has(parentNode.nodeName.toLowerCase())) {
          parentNode.nodeValue = (0, _util.escape)(nodeValue);
        }
      }
    }
  }

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (var _i6 = 0; _i6 < SET_ATTRIBUTE.length; _i6 += 3) {
      var _vTree = SET_ATTRIBUTE[_i6];
      var name = SET_ATTRIBUTE[_i6 + 1];
      var value = SET_ATTRIBUTE[_i6 + 2];

      var _domNode3 = _util.NodeCache.get(_vTree);
      var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
      var isFunction = typeof value === 'function';

      // Support patching an object representation of the style object.
      if (!isObject && !isFunction && name) {
        _domNode3.setAttribute(name, value);
      } else if (isObject && name === 'style') {
        var keys = Object.keys(value);

        for (var _i7 = 0; _i7 < keys.length; _i7++) {
          _domNode3.style[keys[_i7]] = value[keys[_i7]];
        }
      } else if (typeof value !== 'string') {
        // Necessary to track the attribute/prop existence.
        _domNode3.setAttribute(name, '');

        // Since this is a property value it gets set directly on the node.
        _domNode3[name] = value;
      }

      // Support live updating of the `value` and `checked` attribute.
      if (name === 'value' || name === 'checked') {
        _domNode3[name] = value;
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (var _i8 = 0; _i8 < REMOVE_ATTRIBUTE.length; _i8 += 2) {
      var _vTree2 = REMOVE_ATTRIBUTE[_i8];
      var _name = REMOVE_ATTRIBUTE[_i8 + 1];

      var _domNode4 = _util.NodeCache.get(_vTree2);

      _domNode4.removeAttribute(_name);

      if (_name in _domNode4) {
        _domNode4[_name] = undefined;
      }
    }
  }

  return promises;
}

},{"../node":3,"../util":23}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = release;

var _util = _dereq_('./util');

function release(domNode) {
  // Try and find a state object for this DOM Node.
  var state = _util.StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    (0, _util.unprotectVTree)(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  _util.StateCache.delete(domNode);

  // Recycle all unprotected objects.
  (0, _util.cleanMemory)();
}

},{"./util":23}],7:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endAsPromise;
// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  var _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.

  if (promises.length) {
    return Promise.all(promises).then(function () {
      return transaction.end();
    });
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}

},{}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schedule = _dereq_('./schedule');

Object.defineProperty(exports, 'schedule', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_schedule).default;
  }
});

var _shouldUpdate = _dereq_('./should-update');

Object.defineProperty(exports, 'shouldUpdate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_shouldUpdate).default;
  }
});

var _reconcileTrees = _dereq_('./reconcile-trees');

Object.defineProperty(exports, 'reconcileTrees', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reconcileTrees).default;
  }
});

var _syncTrees = _dereq_('./sync-trees');

Object.defineProperty(exports, 'syncTrees', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_syncTrees).default;
  }
});

var _patchNode = _dereq_('./patch-node');

Object.defineProperty(exports, 'patchNode', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_patchNode).default;
  }
});

var _endAsPromise = _dereq_('./end-as-promise');

Object.defineProperty(exports, 'endAsPromise', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_endAsPromise).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./end-as-promise":7,"./patch-node":9,"./reconcile-trees":10,"./schedule":11,"./should-update":12,"./sync-trees":13}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _node = _dereq_('../node');

var Node = _interopRequireWildcard(_node);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  var state = transaction.state,
      measure = transaction.state.measure,
      patches = transaction.patches;


  measure('patch node');
  transaction.promises = Node.patchNode(patches, state).filter(Boolean);
  measure('patch node');
}

},{"../node":3}],10:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconcileTrees;

var _util = _dereq_('../util');

var _tree = _dereq_('../tree');

var assign = Object.assign,
    keys = Object.keys;
var isArray = Array.isArray;

//function reconcileComponents(oldTree, newTree) {
//  // Stateful components have a very limited API, designed to be fully
//  // implemented by a higher-level abstraction. The only method ever called
//  // is `render`. It is up to a higher level abstraction on how to handle the
//  // changes.
//  for (let i = 0; i < newTree.childNodes.length; i++) {
//    const oldChild = oldTree && oldTree.childNodes[i];
//    const newChild = newTree.childNodes[i];
//
//    // If incoming tree is a component, flatten down to tree for now.
//    if (newChild && typeof newChild.rawNodeName === 'function') {
//      const oldCtor = oldChild && oldChild.rawNodeName;
//      const newCtor = newChild.rawNodeName;
//      const children = newChild.childNodes;
//      const props = assign({}, newChild.attributes, { children });
//      const canNew = newCtor.prototype && newCtor.prototype.render;
//
//      // If the component has already been initialized, we can reuse it.
//      const oldInstance = oldCtor === newCtor && ComponentCache.get(oldChild);
//      const newInstance = !oldInstance && canNew && new newCtor(props);
//      const instance = oldInstance || newInstance;
//      const renderTree = createTree(
//        instance ? instance.render(props) : newCtor(props)
//      );
//
//      // Build a new tree from the render, and use this as the current tree.
//      newTree.childNodes[i] = renderTree;
//
//      // Cache this new current tree.
//      if (instance) {
//        ComponentCache.set(renderTree, instance);
//      }
//
//      // Recursively update trees.
//      reconcileComponents(oldChild, renderTree);
//    }
//    else {
//      reconcileComponents(oldChild, newChild);
//    }
//  }
//}

function reconcileTrees(transaction) {
  var state = transaction.state,
      measure = transaction.state.measure,
      domNode = transaction.domNode,
      markup = transaction.markup,
      options = transaction.options;
  var previousMarkup = state.previousMarkup,
      previousText = state.previousText;
  var inner = options.inner;


  measure('reconcile trees');

  // This looks for changes in the DOM from what we'd expect. This means we
  // need to rebuild the old Virtual Tree. This allows for keeping our tree
  // in sync with unexpected DOM changes. It's not very performant, so
  // ideally you should never change markup that diffHTML affects from
  // outside of diffHTML if performance is a concern.
  var sameInnerHTML = inner ? previousMarkup === domNode.innerHTML : true;
  var sameOuterHTML = inner ? true : previousMarkup === domNode.outerHTML;
  var sameTextContent = previousText === domNode.textContent;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    if (state.oldTree) {
      (0, _util.unprotectVTree)(state.oldTree);
    }

    // Set the `oldTree` in the state as-well-as the transaction. This allows
    // it to persist with the DOM Node and also be easily available to
    // middleware and transaction tasks.
    state.oldTree = (0, _tree.createTree)(domNode);

    // We need to keep these objects around for comparisons.
    (0, _util.protectVTree)(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // We need to ensure that our target to diff is a Virtual Tree Element. This
  // function takes in whatever `markup` is and normalizes to a tree object.
  // The callback function runs on every normalized Node to wrap childNodes
  // in the case of setting innerHTML.

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one.
    transaction.newTree = (0, _tree.createTree)((0, _util.parse)(markup, null, options).childNodes);
  }

  // Only create a document fragment for inner nodes if the user didn't already
  // pass an array. If they pass an array, `createTree` will auto convert to
  // a fragment.
  else if (options.inner) {
      var _transaction$oldTree = transaction.oldTree,
          nodeName = _transaction$oldTree.nodeName,
          attributes = _transaction$oldTree.attributes;

      transaction.newTree = (0, _tree.createTree)(nodeName, attributes, markup);
    }

    // Everything else gets passed into `createTree` to be figured out.
    else {
        transaction.newTree = (0, _tree.createTree)(markup);
      }

  // FIXME: Huge Hack at the moment to make it easier to work with components.
  //reconcileComponents(state.oldTree, transaction.newTree);

  measure('reconcile trees');
}

},{"../tree":17,"../util":23}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = schedule;

var _caches = _dereq_('../util/caches');

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  var state = transaction.state;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.

  if (state.isRendering) {
    state.nextTransaction = transaction;
    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}

},{"../util/caches":20}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUpdate;
function shouldUpdate(transaction) {
  var markup = transaction.markup,
      state = transaction.state,
      measure = transaction.state.measure;


  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

},{}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTrees;

var _tree = _dereq_('../tree');

var Tree = _interopRequireWildcard(_tree);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function syncTrees(transaction) {
  var _transaction$state = transaction.state,
      measure = _transaction$state.measure,
      oldTree = _transaction$state.oldTree,
      newTree = transaction.newTree;


  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  if (oldTree.nodeName !== newTree.nodeName) {
    transaction.patches = { TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }] };
    transaction.oldTree = transaction.state.oldTree = newTree;
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = Tree.syncTree(oldTree, newTree);
    }

  measure('sync trees');
}

},{"../tree":17}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = _dereq_('./util');

var internals = _interopRequireWildcard(_util);

var _tasks = _dereq_('./tasks');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transaction = function () {
  _createClass(Transaction, null, [{
    key: 'create',
    value: function create(domNode, markup, options) {
      return new Transaction(domNode, markup, options);
    }
  }, {
    key: 'renderNext',
    value: function renderNext(state) {
      // Still no next transaction, so can safely return early.
      if (!state.nextTransaction) {
        return;
      }

      // Create the next transaction.
      var _state$nextTransactio = state.nextTransaction,
          domNode = _state$nextTransactio.domNode,
          markup = _state$nextTransactio.markup,
          options = _state$nextTransactio.options;

      state.nextTransaction = undefined;
      Transaction.create(domNode, markup, options).start();
    }
  }, {
    key: 'flow',
    value: function flow(transaction, tasks) {
      var retVal = transaction;

      // Execute each "task" serially, passing the transaction as a baton that
      // can be used to share state across the tasks.
      for (var i = 0; i < tasks.length; i++) {
        // If aborted, don't execute any more tasks.
        if (transaction.aborted) {
          return retVal;
        }

        // Run the task.
        retVal = tasks[i](transaction);

        // The last `returnValue` is what gets sent to the consumer. This
        // mechanism is crucial for the `abort`, if you want to modify the "flow"
        // that's fine, but you must ensure that your last task provides a
        // mechanism to know when the transaction completes. Something like
        // callbacks or a Promise.
        if (retVal !== undefined && retVal !== transaction) {
          return retVal;
        }
      }
    }
  }, {
    key: 'assert',
    value: function assert(transaction) {
      if (transaction.aborted && transaction.completed) {
        throw new Error('Transaction was previously aborted');
      } else if (transaction.completed) {
        throw new Error('Transaction was previously completed');
      }
    }
  }, {
    key: 'invokeMiddleware',
    value: function invokeMiddleware(transaction) {
      var tasks = transaction.tasks;


      _util.MiddlewareCache.forEach(function (fn) {
        // Invoke all the middleware passing along this transaction as the only
        // argument. If they return a value (must be a function) it will be added
        // to the transaction task flow.
        var result = fn(transaction);

        if (result) {
          tasks.push(result);
        }
      });
    }
  }]);

  function Transaction(domNode, markup, options) {
    _classCallCheck(this, Transaction);

    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = _util.StateCache.get(domNode) || {
      measure: (0, _util.measure)(domNode, markup),
      internals: internals
    };

    this.tasks = options.tasks || [_tasks.schedule, _tasks.shouldUpdate, _tasks.reconcileTrees, _tasks.syncTrees, _tasks.patchNode, _tasks.endAsPromise];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    _util.StateCache.set(domNode, this.state);
  }

  _createClass(Transaction, [{
    key: 'start',
    value: function start() {
      var domNode = this.domNode,
          measure = this.state.measure,
          tasks = this.tasks;

      var takeLastTask = tasks.pop();

      // Add middleware in as tasks.
      Transaction.invokeMiddleware(this);

      // Measure the render flow if the user wants to track performance.
      measure('render');

      // Push back the last task as part of ending the flow.
      tasks.push(takeLastTask);

      return Transaction.flow(this, tasks);
    }

    // This will immediately call the last flow task and terminate the flow. We
    // call the last task to ensure that the control flow completes. This should
    // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
    // `return someValue` to provide the most accurate performance reading. This
    // doesn't matter practically besides that.

  }, {
    key: 'abort',
    value: function abort() {
      var state = this.state;


      this.aborted = true;

      // Grab the last task in the flow and return, this task will be responsible
      // for calling `transaction.end`.
      return this.tasks[this.tasks.length - 1](this);
    }
  }, {
    key: 'end',
    value: function end() {
      var _this = this;

      var state = this.state,
          domNode = this.domNode,
          options = this.options;
      var measure = state.measure;
      var inner = options.inner;


      this.completed = true;

      var renderScheduled = false;

      _util.StateCache.forEach(function (cachedState) {
        if (cachedState.isRendering && cachedState !== state) {
          renderScheduled = true;
        }
      });

      // Don't attempt to clean memory if in the middle of another render.
      if (!renderScheduled) {
        (0, _util.cleanMemory)();
      }

      // Mark the end to rendering.
      measure('finalize');
      measure('render');

      // Cache the markup and text for the DOM node to allow for short-circuiting
      // future render transactions.
      state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
      state.previousText = domNode.textContent;

      // Trigger all `onceEnded` callbacks, so that middleware can know the
      // transaction has ended.
      this.endedCallbacks.forEach(function (callback) {
        return callback(_this);
      });
      this.endedCallbacks.clear();

      // We are no longer rendering the previous transaction so set the state to
      // `false`.
      state.isRendering = false;

      // Try and render the next transaction if one has been saved.
      Transaction.renderNext(state);

      return this;
    }
  }, {
    key: 'onceEnded',
    value: function onceEnded(callback) {
      this.endedCallbacks.add(callback);
    }
  }]);

  return Transaction;
}();

exports.default = Transaction;

},{"./tasks":8,"./util":23}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;

var _util = _dereq_('./util');

// Available transition states.
var stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(function (stateName) {
  return _util.TransitionCache.set(stateName, new Set());
});

function addTransitionState(stateName, callback) {
  if (!stateName) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (stateNames.indexOf(stateName) === -1) {
    throw new Error('Invalid state name: ' + stateName);
  }

  _util.TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (!callback && stateName) {
    _util.TransitionCache.get(stateName).clear();
  } else if (stateName && callback) {
    // Not a valid state name.
    if (stateNames.indexOf(stateName) === -1) {
      throw new Error('Invalid state name ' + stateName);
    }

    _util.TransitionCache.get(stateName).delete(callback);
  } else {
    for (var _stateName in stateNames) {
      if (_util.TransitionCache.has(_stateName)) {
        _util.TransitionCache.get(_stateName).clear();
      }
    }
  }
}

},{"./util":23}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createTree;

var _util = _dereq_('../util');

var assign = Object.assign;
var isArray = Array.isArray;

var fragment = '#document-fragment';

function createTree(input, attributes, childNodes) {
  for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  var isNode = (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && 'parentNode' in input;

  if (arguments.length === 1) {
    if (!input) {
      return null;
    }

    // If the first argument is an array, we assume this is a DOM fragment and
    // the array are the childNodes.
    if (isArray(input)) {
      return createTree(fragment, input.map(function (vTree) {
        return createTree(vTree);
      }));
    }

    // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
    if (isNode) {
      attributes = {};
      childNodes = [];

      // When working with a text node, simply save the nodeValue as the
      // initial value.
      if (input.nodeType === 3) {
        childNodes = input.nodeValue;
      }
      // Element types are the only kind of DOM node we care about attributes
      // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
      // ignore this.
      else if (input.nodeType === 1 && input.attributes.length) {
          attributes = {};

          for (var i = 0; i < input.attributes.length; i++) {
            var _input$attributes$i = input.attributes[i],
                name = _input$attributes$i.name,
                value = _input$attributes$i.value;


            if (value === '' && name in input) {
              attributes[name] = input[name];
              continue;
            }

            attributes[name] = value;
          }
        }

      // Get the child nodes from an Element or Fragment/Shadow Root.
      if (input.nodeType === 1 || input.nodeType === 11) {
        if (input.childNodes.length) {
          childNodes = [];

          for (var _i = 0; _i < input.childNodes.length; _i++) {
            if (input.childNodes[_i]) {
              childNodes[_i] = createTree(input.childNodes[_i]);
            }
          }
        }
      }

      var vTree = createTree(input.nodeName, attributes, childNodes);
      _util.NodeCache.set(vTree, input);
      return vTree;
    }

    // Assume any object value is a valid VTree object.
    if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
      return input;
    }

    // Assume it is a DOM Node.
    return createTree(String(input), null, null);
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes].concat(rest);
  }

  // Allocate a new VTree from the pool.
  var entry = _util.Pool.get();
  var isTextNode = input === '#text';

  entry.key = '';
  entry.rawNodeName = input;
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (typeof input === 'string') {
    entry.nodeName = input.toLowerCase();
  } else {
    entry.nodeName = fragment;
  }

  if (isTextNode) {
    var _nodes = arguments.length === 2 ? attributes : childNodes;
    var nodeValue = isArray(_nodes) ? _nodes.join('') : _nodes;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

    return entry;
  }

  if (input === fragment) {
    entry.nodeType = 11;
  } else if (input === '#comment') {
    entry.nodeType = 8;
  } else {
    entry.nodeType = 1;
  }

  var useAttributes = isArray(attributes) || (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) !== 'object';
  var nodes = useAttributes ? attributes : childNodes;
  var nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (var _i2 = 0; _i2 < nodeArray.length; _i2++) {
      if (_typeof(nodeArray[_i2]) === 'object') {
        entry.childNodes[_i2] = createTree(nodeArray[_i2]);
      } else {
        entry.childNodes[_i2] = createTree('#text', nodeArray[_i2]);
      }
    }
  }

  if (attributes && (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // If is a script tag and has a src attribute, key off that.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the key prop if passed as an attr.
  if (entry.attributes && entry.attributes.key) {
    entry.key = String(entry.attributes.key);
  }

  return entry;
}

},{"../util":23}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = _dereq_('./create');

Object.defineProperty(exports, 'createTree', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_create).default;
  }
});

var _sync = _dereq_('./sync');

Object.defineProperty(exports, 'syncTree', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sync).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./create":16,"./sync":18}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTree;
var assign = Object.assign,
    keys = Object.keys;

var empty = null;

// Reuse these maps, it's more performant to clear them than recreate.
var oldKeys = new Map();
var newKeys = new Map();

var propToAttrMap = {
  className: 'class',
  htmlFor: 'for'
};

function syncTree(oldTree, newTree, patches) {
  if (!oldTree) {
    throw new Error('Missing existing tree to sync from');
  }
  if (!newTree) {
    throw new Error('Missing new tree to sync into');
  }

  var oldTreeName = oldTree.nodeName;
  var newTreeName = newTree.nodeName;


  if (oldTreeName !== newTreeName) {
    throw new Error('Sync failure, cannot compare ' + newTreeName + ' with ' + oldTreeName);
  }

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    TREE_OPS: [],
    NODE_VALUE: [],
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: []
  };

  var _patches = patches,
      TREE_OPS = _patches.TREE_OPS,
      NODE_VALUE = _patches.NODE_VALUE,
      SET_ATTRIBUTE = _patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = _patches.REMOVE_ATTRIBUTE;

  // Build up a patchset object to use for tree operations.

  var patchset = {
    INSERT_BEFORE: empty,
    REMOVE_CHILD: empty,
    REPLACE_CHILD: empty
  };

  var oldChildNodes = oldTree.childNodes;
  var newChildNodes = newTree.childNodes;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.

  var hasOldKeys = oldChildNodes.some(function (vTree) {
    return vTree.key;
  });
  var hasNewKeys = newChildNodes.some(function (vTree) {
    return vTree.key;
  });

  // If we are working with keys, we can follow an optimized path.
  if (hasOldKeys || hasNewKeys) {
    oldKeys.clear();
    newKeys.clear();

    // Put the old `childNode` VTree's into the key cache for lookup.
    for (var i = 0; i < oldChildNodes.length; i++) {
      var vTree = oldChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        oldKeys.set(vTree.key, vTree);
      }
    }

    // Put the new `childNode` VTree's into the key cache for lookup.
    for (var _i = 0; _i < newChildNodes.length; _i++) {
      var _vTree = newChildNodes[_i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (_vTree.key) {
        newKeys.set(_vTree.key, _vTree);
      }
    }

    // Do a single pass over the new child nodes.
    for (var _i2 = 0; _i2 < newChildNodes.length; _i2++) {
      var oldChildNode = oldChildNodes[_i2];
      var newChildNode = newChildNodes[_i2];

      var key = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.

      if (!oldChildNode) {
        // Prefer an existing match to a brand new element.
        var newElement = null;

        // Prefer existing to new and remove from old position.
        if (oldKeys.has(key)) {
          newElement = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(newElement), 1);
        } else {
          newElement = newKeys.get(key) || newChildNode;
        }

        if (patchset.INSERT_BEFORE === empty) {
          patchset.INSERT_BEFORE = [];
        }
        patchset.INSERT_BEFORE.push([oldTree, newElement]);
        oldChildNodes.push(newElement);
        continue;
      }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (key !== oldChildNode.key) {
        var _newElement = newChildNode;

        // Prefer existing to new and remove from old position.
        if (key && oldKeys.has(key)) {
          _newElement = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(_newElement), 1);
        } else if (key) {
          _newElement = newKeys.get(key);
        }

        if (patchset.INSERT_BEFORE === empty) {
          patchset.INSERT_BEFORE = [];
        }
        patchset.INSERT_BEFORE.push([oldTree, _newElement, oldChildNode]);
        oldChildNodes.splice(_i2, 0, _newElement);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) {
          patchset.REPLACE_CHILD = [];
        }
        patchset.REPLACE_CHILD.push([newChildNode, oldChildNode]);
        oldTree.childNodes[_i2] = newChildNode;
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
      // Do a single pass over the new child nodes.
      for (var _i3 = 0; _i3 < newChildNodes.length; _i3++) {
        var _oldChildNode = oldChildNodes[_i3];
        var _newChildNode = newChildNodes[_i3];

        // If there is no old element to compare to, this is a simple addition.
        if (!_oldChildNode) {
          if (patchset.INSERT_BEFORE === empty) {
            patchset.INSERT_BEFORE = [];
          }
          patchset.INSERT_BEFORE.push([oldTree, _newChildNode]);
          oldChildNodes.push(_newChildNode);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (_oldChildNode.nodeName !== _newChildNode.nodeName) {
          if (patchset.REPLACE_CHILD === empty) {
            patchset.REPLACE_CHILD = [];
          }
          patchset.REPLACE_CHILD.push([_newChildNode, _oldChildNode]);
          oldTree.childNodes[_i3] = _newChildNode;
          continue;
        }

        syncTree(_oldChildNode, _newChildNode, patches);
      }
    }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (var _i4 = newChildNodes.length; _i4 < oldChildNodes.length; _i4++) {
      if (patchset.REMOVE_CHILD === empty) {
        patchset.REMOVE_CHILD = [];
      }
      patchset.REMOVE_CHILD.push(oldChildNodes[_i4]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // If both VTrees are text nodes and the values are different, change the
  // NODE_VALUE.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;
      NODE_VALUE.push(oldTree, oldTree.nodeValue);

      var _INSERT_BEFORE = patchset.INSERT_BEFORE,
          _REMOVE_CHILD = patchset.REMOVE_CHILD,
          _REPLACE_CHILD = patchset.REPLACE_CHILD;

      // We want to look if anything has changed, if nothing has we won't add
      // it to the patchset.

      if (_INSERT_BEFORE || _REMOVE_CHILD || _REPLACE_CHILD) {
        TREE_OPS.push(patchset);
      }

      return patches;
    }
  }

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (newTree.nodeType === 1) {
    var setAttributes = [];
    var removeAttributes = [];
    var oldAttributes = oldTree.attributes;
    var newAttributes = newTree.attributes;

    // Search for sets and changes.

    for (var key in newAttributes) {
      var value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      oldTree.attributes[key] = value;

      // Alias prop names to attr names for patching purposes.
      if (key in propToAttrMap) {
        key = propToAttrMap[key];
      }

      SET_ATTRIBUTE.push(oldTree, key, value);
    }

    // Search for removals.
    for (var _key in oldAttributes) {
      if (_key in newAttributes) {
        continue;
      }
      REMOVE_ATTRIBUTE.push(oldTree, _key);
      delete oldAttributes[_key];
    }
  }

  var INSERT_BEFORE = patchset.INSERT_BEFORE,
      REMOVE_CHILD = patchset.REMOVE_CHILD,
      REPLACE_CHILD = patchset.REPLACE_CHILD;

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.

  if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
    TREE_OPS.push(patchset);
  }

  return patches;
}

},{}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

var _util = _dereq_('./util');

function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  _util.MiddlewareCache.add(middleware);

  // The unsubscribe method for the middleware.
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    _util.MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe();
  };
}

},{"./util":23}],20:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Associates DOM Nodes with state objects.
var StateCache = exports.StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
var NodeCache = exports.NodeCache = new Map();

// Associates Virtual Tree Elements with Component instances.
var ComponentCache = exports.ComponentCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
var MiddlewareCache = exports.MiddlewareCache = new Set();

// Cache transition functions.
var TransitionCache = exports.TransitionCache = new Map();

},{}],21:[function(_dereq_,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = decodeEntities;
// Support loading diffHTML in non-browser environments.
var g = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : window;
var element = g.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escape;
/**
 * Tiny HTML escaping function, useful to protect against things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
function escape(unescaped) {
  return unescaped.replace(/["&'<>`]/g, function (match) {
    return "&#" + match.charCodeAt(0) + ";";
  });
}

},{}],23:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caches = _dereq_('./caches');

Object.defineProperty(exports, 'StateCache', {
  enumerable: true,
  get: function get() {
    return _caches.StateCache;
  }
});
Object.defineProperty(exports, 'NodeCache', {
  enumerable: true,
  get: function get() {
    return _caches.NodeCache;
  }
});
Object.defineProperty(exports, 'ComponentCache', {
  enumerable: true,
  get: function get() {
    return _caches.ComponentCache;
  }
});
Object.defineProperty(exports, 'MiddlewareCache', {
  enumerable: true,
  get: function get() {
    return _caches.MiddlewareCache;
  }
});
Object.defineProperty(exports, 'TransitionCache', {
  enumerable: true,
  get: function get() {
    return _caches.TransitionCache;
  }
});

var _memory = _dereq_('./memory');

Object.defineProperty(exports, 'protectVTree', {
  enumerable: true,
  get: function get() {
    return _memory.protectVTree;
  }
});
Object.defineProperty(exports, 'unprotectVTree', {
  enumerable: true,
  get: function get() {
    return _memory.unprotectVTree;
  }
});
Object.defineProperty(exports, 'cleanMemory', {
  enumerable: true,
  get: function get() {
    return _memory.cleanMemory;
  }
});

var _svg = _dereq_('./svg');

Object.defineProperty(exports, 'namespace', {
  enumerable: true,
  get: function get() {
    return _svg.namespace;
  }
});
Object.defineProperty(exports, 'elements', {
  enumerable: true,
  get: function get() {
    return _svg.elements;
  }
});

var _transitions = _dereq_('./transitions');

Object.defineProperty(exports, 'states', {
  enumerable: true,
  get: function get() {
    return _transitions.states;
  }
});
Object.defineProperty(exports, 'buildTrigger', {
  enumerable: true,
  get: function get() {
    return _transitions.buildTrigger;
  }
});
Object.defineProperty(exports, 'makePromises', {
  enumerable: true,
  get: function get() {
    return _transitions.makePromises;
  }
});

var _decodeEntities = _dereq_('./decode-entities');

Object.defineProperty(exports, 'decodeEntities', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_decodeEntities).default;
  }
});

var _escape = _dereq_('./escape');

Object.defineProperty(exports, 'escape', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_escape).default;
  }
});

var _performance = _dereq_('./performance');

Object.defineProperty(exports, 'measure', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_performance).default;
  }
});

var _pool = _dereq_('./pool');

Object.defineProperty(exports, 'Pool', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pool).default;
  }
});

var _parser = _dereq_('./parser');

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_parser).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./caches":20,"./decode-entities":21,"./escape":22,"./memory":24,"./parser":25,"./performance":26,"./pool":27,"./svg":28,"./transitions":29}],24:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectVTree = protectVTree;
exports.unprotectVTree = unprotectVTree;
exports.cleanMemory = cleanMemory;

var _pool = _dereq_('./pool');

var _pool2 = _interopRequireDefault(_pool);

var _caches = _dereq_('./caches');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memory = _pool2.default.memory,
    protect = _pool2.default.protect,
    unprotect = _pool2.default.unprotect;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */

function protectVTree(vTree) {
  protect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
function unprotectVTree(vTree) {
  unprotect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory() {
  memory.allocated.forEach(function (vTree) {
    return memory.free.add(vTree);
  });
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  _caches.NodeCache.forEach(function (node, descriptor) {
    if (!memory.protected.has(descriptor)) {
      _caches.NodeCache.delete(descriptor);
    }
  });
}

},{"./caches":20,"./pool":27}],25:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _tree = _dereq_('../tree');

var _pool = _dereq_('./pool');

var _pool2 = _interopRequireDefault(_pool);

var _escape = _dereq_('./escape');

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Code based off of:
// https://github.com/ashi009/node-fast-html-parser

// This is a very special word in the diffHTML parser. It is the only way it
// can gain access to dynamic content.
var TOKEN = '__DIFFHTML__';

var hasNonWhitespaceEx = /\S/;
var doctypeEx = /<!.*>/ig;
var attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
var spaceEx = /[^ ]/;

var assign = Object.assign;


var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var selfClosing = new Set(['meta', 'img', 'link', 'input', 'area', 'br', 'hr']);

var kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};

var kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true }
};

var flattenFragments = function flattenFragments(childNodes) {
  for (var i = 0; i < childNodes.length; i++) {
    var childNode = childNodes[i];

    if (childNode && childNode.nodeType === 11) {
      childNodes.splice.apply(childNodes, [i, 1].concat(_toConsumableArray(childNode.childNodes)));

      // Reset the loop.
      i = 0;
    } else if (childNode) {
      flattenFragments(childNode.childNodes);
    } else {
      childNodes.splice(i, 1);
    }
  }
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
var interpolateValues = function interpolateValues(currentParent, string, supplemental) {
  if (string && string.includes(TOKEN)) {
    var childNodes = [];
    var parts = string.split(TOKEN);
    var length = parts.length;


    for (var i = 0; i < parts.length; i++) {
      var value = parts[i];

      if (i === 0 || value) {
        // If the first text node has relevant text, put it in, otherwise
        // discard. This mimicks how the browser works and is generally easier
        // to work with (when using tagged template tags).
        if (hasNonWhitespaceEx.test(value)) {
          childNodes.push((0, _tree.createTree)('#text', value));
        }

        // If we are in the second iteration, this means the whitespace has
        // been trimmed and we can pull out dynamic interpolated values.
        // Flatten all fragments found in the tree. They are used as containers
        // and are not reflected in the DOM Tree.
        if (--length > 0) {
          childNodes.push(supplemental.children.shift());
          flattenFragments(childNodes);
        }
      }
    }

    currentParent.childNodes.push.apply(currentParent.childNodes, childNodes);
  }
  // If this is text and not a doctype, add as a text node.
  else if (string && string.length && !doctypeEx.exec(string)) {
      currentParent.childNodes.push((0, _tree.createTree)('#text', string));
    }
};

/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {String} nodeName - DOM Node name
 * @param {Object} rawAttrs - DOM Node Attributes
 * @param {Object} supplemental - Interpolated data from a tagged template
 * @return {Object} vTree
 */
var HTMLElement = function HTMLElement(nodeName, rawAttrs, supplemental) {
  // Support dynamic tag names like: `<${MyComponent} />`.
  if (nodeName === TOKEN) {
    return HTMLElement(supplemental.tags.shift(), rawAttrs, supplemental);
  }

  var attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.

  var _loop = function _loop(match) {
    var name = match[1];
    var value = match[6] || match[5] || match[4] || match[1];

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (value.indexOf(TOKEN) > -1 && value !== TOKEN) {
      attributes[name] = '';

      // Break the attribute down and replace each dynamic interpolation.
      value.split(TOKEN).forEach(function (part, index, array) {
        attributes[name] += part;

        // Only interpolate up to the last element.
        if (index !== array.length - 1) {
          attributes[name] += supplemental.attributes.shift();
        }
      });
    } else if (name === TOKEN) {
      var nameAndValue = supplemental.attributes.shift();

      if (nameAndValue) {
        attributes[nameAndValue] = nameAndValue;
      }
    } else if (value === TOKEN) {
      attributes[name] = supplemental.attributes.shift();
    } else {
      attributes[name] = value;
    }

    // Look for empty attributes.
    if (match[6] === '""') {
      attributes[name] = '';
    }
  };

  for (var match; match = attrEx.exec(rawAttrs || '');) {
    _loop(match);
  }

  return (0, _tree.createTree)(nodeName, attributes, []);
};

/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Object} supplemental - Dynamic interpolated data values
 * @param {Object} options - Contains options like silencing warnings
 * @return {Object} - Parsed Virtual Tree Element
 */
function parse(html, supplemental) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var root = (0, _tree.createTree)('#document-fragment', null, []);
  var stack = [root];
  var currentParent = root;
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  var tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

  // Look through the HTML markup for valid tags.
  for (var match, text; match = tagEx.exec(html);) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);
        interpolateValues(currentParent, text, supplemental);
      }
    }

    var matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      var string = html.slice(0, matchOffset);

      if (string && hasNonWhitespaceEx.test(string) && !doctypeEx.exec(string)) {
        interpolateValues(currentParent, string, supplemental);
      }
    }

    lastTextPos = tagEx.lastIndex;

    // This is a comment.
    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      var attrs = {};

      if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
        if (kElementsClosedByOpening[currentParent.rawNodeName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental)) - 1];

      stack.push(currentParent);

      if (blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        var closeMarkup = '</' + match[2] + '>';
        var index = html.indexOf(closeMarkup, tagEx.lastIndex);
        var length = match[2].length;


        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        var newText = html.slice(match.index + match[0].length, index);

        // TODO Determine if a closing tag is present.
        //if (options.strict) {
        //  const nodeName = currentParent.rawNodeName;

        //  // Find a subset of the markup passed in to validate.
        //  const markup = markup.slice(
        //    tagEx.lastIndex - match[0].length
        //  ).split('\n').slice(0, 3);

        //  console.log(markup);

        //  // Position the caret next to the first non-whitespace character.
        //  const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        //  // Craft the warning message and inject it into the markup.
        //  markup.splice(1, 0, `${caret}
        //Invali markup. Saw ${match[2]}, expected ${nodeName}
        //  `);

        //  // Throw an error message if the markup isn't what we expected.
        //  throw new Error(`\n\n${markup.join('\n')}`);
        //}

        interpolateValues(currentParent, newText.trim(), supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (match[2] !== currentParent.rawNodeName && options.strict) {
        var nodeName = currentParent.rawNodeName;

        // Find a subset of the markup passed in to validate.
        var markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3);

        // Position the caret next to the first non-whitespace character.
        var caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        // Craft the warning message and inject it into the markup.
        markup.splice(1, 0, caret + '\nPossibly invalid markup. Saw ' + match[2] + ', expected ' + nodeName + '...\n        ');

        // Throw an error message if the markup isn't what we expected.
        throw new Error('\n\n' + markup.join('\n'));
      }

      // </ or /> or <br> etc.
      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[2] === TOKEN && match[4] === '/') {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        // Not self-closing, so seek out the next match.
        else if (match[2] === TOKEN) {
            var _value = supplemental.tags.shift();

            if (currentParent.nodeName === _value) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              break;
            }
          }

        if (currentParent.rawNodeName == match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        } else {
          var tag = kElementsClosedByClosing[currentParent.rawNodeName];

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

  // Find any last remaining text after the parsing completes over tags.
  var remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  interpolateValues(currentParent, remainingText, supplemental);

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    (function () {
      // Store elements from before body end and after body end.
      var head = { before: [], after: [] };
      var body = { after: [] };
      var HTML = root.childNodes[0];

      var beforeHead = true;
      var beforeBody = true;

      // Iterate the children and store elements in the proper array for
      // later concat, replace the current childNodes with this new array.
      HTML.childNodes = HTML.childNodes.filter(function (el) {
        // If either body or head, allow as a valid element.
        if (el.nodeName === 'body' || el.nodeName === 'head') {
          if (el.nodeName === 'head') beforeHead = false;
          if (el.nodeName === 'body') beforeBody = false;

          return true;
        }
        // Not a valid nested HTML tag element, move to respective container.
        else if (el.nodeType === 1) {
            if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
          }
      });

      // Ensure the first element is the HEAD tag.
      if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
        var headInstance = (0, _tree.createTree)('head', null, []);
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
        var bodyInstance = (0, _tree.createTree)('body', null, []);
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

},{"../tree":17,"./escape":22,"./pool":27}],26:[function(_dereq_,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var marks = exports.marks = new Map();
var prefix = exports.prefix = 'diffHTML';
var token = 'diff_perf';

var hasSearch = typeof location !== 'undefined' && location.search;
var hasArguments = typeof process !== 'undefined' && process.argv;
var wantsSearch = hasSearch && location.search.includes(token);
var wantsArguments = hasArguments && process.argv.includes(token);
var wantsPerfChecks = wantsSearch || wantsArguments;
var nop = function nop() {};

exports.default = function (domNode, vTree) {
  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) {
    return nop;
  }

  return function (name) {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = domNode.host.constructor.name + ' ' + name;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = vTreevTree.name + ' ' + name;
    }

    var endName = name + '-end';

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      var totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(prefix + ' ' + name + ' (' + totalMs + 'ms)', name, endName);
    }
  };
};

}).call(this,_dereq_('_process'))
},{"_process":30}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// A modest size.
var size = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
var memory = {
  free: new Set(),
  allocated: new Set(),
  protected: new Set()
};

// Prime the memory cache with n objects.
for (var i = 0; i < size; i++) {
  memory.free.add({
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: [],
    attributes: {}
  });
}

// Cache the values object.
var freeValues = memory.free.values();

// Cache VTree objects in a pool which is used to get
exports.default = {
  size: size,
  memory: memory,

  get: function get() {
    var value = freeValues.next().value || {
      rawNodeName: '',
      nodeName: '',
      nodeValue: '',
      nodeType: 1,
      key: '',
      childNodes: [],
      attributes: {}
    };
    memory.free.delete(value);
    memory.allocated.add(value);
    return value;
  },
  protect: function protect(value) {
    memory.allocated.delete(value);
    memory.protected.add(value);
  },
  unprotect: function unprotect(value) {
    if (memory.protected.has(value)) {
      memory.protected.delete(value);
      memory.free.add(value);
    }
  }
};

},{}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Namespace.
var namespace = exports.namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
var elements = exports.elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

},{}],29:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTrigger = buildTrigger;
exports.makePromises = makePromises;
var forEach = Array.prototype.forEach;

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
  attached: function attached(el) {
    return function (cb) {
      return cb(el);
    };
  },
  detached: function detached(el) {
    return function (cb) {
      return cb(el);
    };
  },
  replaced: function replaced(oldEl, newEl) {
    return function (cb) {
      return cb(oldEl, newEl);
    };
  },
  textChanged: function textChanged(el, oldVal, newVal) {
    return function (cb) {
      return cb(el, oldVal, newVal);
    };
  },
  attributeChanged: function attributeChanged(el, name, oldVal, newVal) {
    return function (cb) {
      return cb(el, name, oldVal, newVal);
    };
  }
};

var make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(function (stateName) {
  var mapFn = fnSignatures[stateName];

  /**
   * Make's the transition promises.
   *
   * @param elements
   * @param args
   * @param promises
   */
  make[stateName] = function makeTransitionPromises(elements, args, promises) {
    // Sometimes an array-like is passed so using forEach in this manner yields
    // more consistent results.
    forEach.call(elements, function (element) {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && element.nodeType !== 1) {
        return;
      }

      // Call the map function with each element.
      var newPromises = states[stateName].map(mapFn.apply(null, [element].concat(args)));

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](element.childNodes, args, promises);
      }
    });

    return promises.filter(function (promise) {
      return Boolean(promise && promise.then);
    });
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param allPromises
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

      if (callback) {
        callback(promises.length ? promises : undefined);
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
 */
function makePromises(stateName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  // Ensure elements is always an array.
  var elements = [].concat(args[0]);

  // Accepts the local Array of promises to use.
  return function (promises) {
    return make[stateName](elements, args.slice(1), promises);
  };
}

},{}],30:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
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

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[2])(2)
});