(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAttribute = exports.createElement = exports.release = exports.html = undefined;

var _taggedTemplate = _dereq_('./util/tagged-template');

Object.defineProperty(exports, 'html', {
  enumerable: true,
  get: function get() {
    return _taggedTemplate.html;
  }
});

var _release = _dereq_('./node/release');

Object.defineProperty(exports, 'release', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_release).default;
  }
});

var _helpers = _dereq_('./tree/helpers');

Object.defineProperty(exports, 'createElement', {
  enumerable: true,
  get: function get() {
    return _helpers.createElement;
  }
});
Object.defineProperty(exports, 'createAttribute', {
  enumerable: true,
  get: function get() {
    return _helpers.createAttribute;
  }
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.use = use;

var _transaction = _dereq_('./node/transaction');

var _transaction2 = _interopRequireDefault(_transaction);

var _transitions = _dereq_('./util/transitions');

var _cache = _dereq_('./util/cache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents. Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @example
 *
 *    import { outerHTML } from 'diffhtml'
 *
 *    // Remove all attributes and set the children to be a single text node
 *    // containing the text 'Hello world',
 *    outerHTML(document.body, '<body>Hello world</body>')
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function outerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = false;
  (0, _transaction2.default)(element, markup, options);
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents. This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @example
 *
 *    import { innerHTML } from 'diffhtml'
 *
 *    // Sets the body children to be a single text node containing the text
 *    // 'Hello world'.
 *    innerHTML(document.body, 'Hello world')
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function innerHTML(element) {
  var markup = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options.inner = true;
  (0, _transaction2.default)(element, markup, options);
}

/**
 * Used to diff two elements. The `inner` Boolean property can be specified in
 * the options to set innerHTML\outerHTML behavior. By default it is
 * outerHTML.
 *
 * @example
 *
 *    // It is usually better to rename this method to something descriptive.
 *    import { element as diffElement } from 'diffhtml'
 *
 *    // Create a new body tag.
 *    const newBody = $(`<body>
 *      <strong>Hello world!</strong>
 *    </body>`).get();
 *
 *
 *    diffElement(document.body, newBody);
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {Object} newElement - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function element(element, newElement) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  (0, _transaction2.default)(element, newElement, options);
}

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
 *    import { addTransitionState } from 'diffhtml'
 *
 *    // Fade in all elements as they are added to the DOM.
 *    addTransitionState('attached', el => $(el).fadeIn().promise())
 *
 *    // Fade out all elements as they leave the DOM.
 *    addTransitionState('detached', el => $(el).fadeOut().promise())
 *
 *
 * @param state - String name that matches what's available in the
 * documentation above.
 * @param callback - Function to receive the matching elements.
 */
function addTransitionState(state, callback) {
  if (!state) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (Object.keys(_transitions.states).indexOf(state) === -1) {
    throw new Error('Invalid state name: ' + state);
  }

  _transitions.states[state].push(callback);
}

/**
 * Removes a global transition listener.
 *
 * When invoked with no arguments, this method will remove all transition
 * callbacks. When invoked with the name argument it will remove all transition
 * state callbacks matching the name, and so on for the callback.
 *
 * @example
 *
 *    import { removeTransitionState } from 'diffhtml'
 *
 *    // Remove all transition state handlers.
 *    removeTransitionState()
 *
 *    // Remove all `attached` state handlers.
 *    removeTransitionState('attached')
 *
 * @param {String =} state - Name that matches what's available in the
 * documentation above
 * @param {Function =} callback - Callback to receive the matching elements
 */
function removeTransitionState(state, callback) {
  // Not a valid state name.
  if (state && Object.keys(_transitions.states).indexOf(state) === -1) {
    throw new Error('Invalid state name: ' + state);
  }

  if (!callback && state) {
    _transitions.states[state].length = 0;
  } else if (state && callback) {
    var index = _transitions.states[state].indexOf(callback);
    _transitions.states[state].splice(index, 1);
  } else {
    for (var _state in _transitions.states) {
      _transitions.states[_state].length = 0;
    }
  }
}

/**
 * Registers middleware functions which are called during the render
 * transaction flow. These should be very fast and ideally asynchronous to
 * avoid blocking the render.
 *
 * @example
 *
 *    import { use } from 'diffhtml'
 *    import logger from 'diffhtml-logger'
 *
 *    // Add the diffHTML logger middleware, to console out render information.
 *    use(logger)
 *
 *
 * @param {Function} middleware - A function that gets passed internals
 * @return {Function} - When invoked removes and deactivates the middleware
 */
function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  _cache.MiddlewareCache.add(middleware);

  // The unsubscribe method for the middleware.
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    _cache.MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe();
  };
}

},{"./node/release":5,"./node/transaction":6,"./tree/helpers":7,"./util/cache":10,"./util/tagged-template":16,"./util/transitions":17}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFinalizeCallback;

var _transaction = _dereq_('../node/transaction');

var _transaction2 = _interopRequireDefault(_transaction);

var _cache = _dereq_('../util/cache');

var _memory = _dereq_('../util/memory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pulls the next transaction arguments and invokes the next transaction.
 *
 * @param {Object} state - The current rendered transaction state.
 */
var renderNextTransaction = function renderNextTransaction(state) {
  var next = state.bufferedTransactions.shift();
  (0, _transaction2.default)(next.node, next.newHTML, next.options);
};

/**
 * Returns a callback that finalizes the transaction, setting the isRendering
 * flag to false. This allows us to pick off and invoke the next available
 * transaction to render. This code recyles the unprotected allocated pool
 * objects and triggers a `renderComplete` event.
 *
 * @param {Object} node - A DOM Node that has just had patches applied
 * @param {Object} state - The current state object associated with the Node
 * @return {Function} - Closure that when called completes the transaction
 */
function getFinalizeCallback(node, state) {
  // When the render completes, clean up memory, and schedule the next render
  // if necessary.
  return function finalizeTransaction() {
    var remainingMiddleware = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var isInner = state.options.inner;

    state.previousMarkup = isInner ? node.innerHTML : node.outerHTML;
    state.previousText = node.textContent;
    state.isRendering = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises. If this element has a next
    // render state, trigger it first as priority.
    if (state.bufferedTransactions.length) {
      renderNextTransaction(state);
    }

    // Clean out all the existing allocations.
    (0, _memory.cleanMemory)();

    // Call the remaining middleware signaling the render is complete.
    for (var i = 0; i < remainingMiddleware.length; i++) {
      remainingMiddleware[i]();
    }
  };
}

},{"../node/transaction":6,"../util/cache":10,"../util/memory":13}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = make;

var _cache = _dereq_('../util/cache');

var _svg = _dereq_('../util/svg');

var svg = _interopRequireWildcard(_svg);

var _entities = _dereq_('../util/entities');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Gets a specific type of DOM Node depending on the passed in nodeName.
 *
 * @param nodeName {String} - The nodeName to disambiguate the type
 * @param nodeValue {String} - The nodeValue to set if a Text Node
 * @return {Object} - A DOM Node matching the nodeName
 */
var createNodeFromName = function createNodeFromName(_ref) {
  var nodeName = _ref.nodeName;
  var nodeValue = _ref.nodeValue;

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    return document.createTextNode(nodeValue);
  }
  // If the nodeName matches any of the known SVG element names, mark it as
  // SVG. The reason for doing this over detecting if nested in an <svg>
  // element, is that we do not currently have circular dependencies in the
  // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
  else if (svg.elements.indexOf(nodeName) > -1) {
      return document.createElementNS(svg.namespace, nodeName);
    }
    // If not a Text or SVG Node, then create with the standard method.
    else {
        return document.createElement(nodeName);
      }
};

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that. VTree's that are passed in do not need
 * to be well formed.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @return {Object} - A DOM Node matching the vTree
 */
function make(vTree) {
  // If no Virtual Tree Element was specified, return null.
  if (!vTree) {
    return null;
  }

  // If the DOM Node was already created, reuse the existing node.
  if (_cache.NodeCache.has(vTree)) {
    return _cache.NodeCache.get(vTree);
  }

  var node = createNodeFromName(vTree);

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.
  for (var i = 0; i < (vTree.attributes || []).length; i++) {
    var attr = vTree.attributes[i];
    var isObject = _typeof(attr.value) === 'object';
    var isFunction = typeof attr.value === 'function';

    // If not a dynamic type, set as an attribute, since it's a valid
    // attribute value.
    if (attr.name && !isObject && !isFunction) {
      node.setAttribute(attr.name, (0, _entities.decodeEntities)(attr.value));
    } else if (attr.name && typeof attr.value !== 'string') {
      // Necessary to track the attribute/prop existence.
      node.setAttribute(attr.name, '');

      // Since this is a dynamic value it gets set as a property.
      node[attr.name] = attr.value;
    }
  }

  // Append all the children into the node, making sure to run them
  // through this `make` function as well.
  for (var _i = 0; _i < (vTree.childNodes || []).length; _i++) {
    node.appendChild(make(vTree.childNodes[_i]));
  }

  // Add to the nodes cache.
  _cache.NodeCache.set(vTree, node);

  return node;
}

},{"../util/cache":10,"../util/entities":11,"../util/svg":15}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = patchNode;

var _make = _dereq_('./make');

var _make2 = _interopRequireDefault(_make);

var _transitions = _dereq_('../util/transitions');

var _parser = _dereq_('../util/parser');

var _cache = _dereq_('../util/cache');

var _pools = _dereq_('../util/pools');

var pools = _interopRequireWildcard(_pools);

var _memory = _dereq_('../util/memory');

var _entities = _dereq_('../util/entities');

var _sync = _dereq_('../tree/sync');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isElementNode = function isElementNode(node) {
  return node.nodeType === 1;
};
var filter = Array.prototype.filter;

/**
 * Looks to see if an element can be replaced. It must have a parentNode to do
 * so. This will trigger an error when the element does not have a parentNode.
 * This typically happens when trying to replace a disconnected DOM Node or the
 * documentElement.
 *
 * @param {String} verb - Verb to replace in the template string
 * @param {Object} oldNode - Old DOM Node to check if able to be replaced
 * @param {Object} patch - Used to clean up vTree references
 */
var checkForMissingParent = function checkForMissingParent(verb, oldNode, patch) {
  if (!oldNode.parentNode) {
    // Clean up these elements to keep memory consistent.
    (0, _memory.unprotectElement)(patch.old);
    (0, _memory.unprotectElement)(patch.new);
    (0, _memory.unprotectElement)(patch.element);
    (0, _memory.unprotectElement)(patch.toRemove);

    if (_cache.StateCache.has(patch.old)) {
      _cache.StateCache.delete(patch.old);
    }
    if (_cache.StateCache.has(patch.new)) {
      _cache.StateCache.delete(patch.new);
    }
    if (_cache.StateCache.has(patch.element)) {
      _cache.StateCache.delete(patch.element);
    }

    // Throw an error to stop rendering/inform the developer.
    throw new Error(('\n      Can\'t ' + verb + ' without parent, is this the document root?\n    ').trim());
  }
};

// Trigger the attached transition state for this element and all childNodes.
var attach = function attach(_ref) {
  var vTree = _ref.vTree;
  var fragment = _ref.fragment;
  var parentNode = _ref.parentNode;
  var triggerTransition = _ref.triggerTransition;
  var state = _ref.state;

  // This element has been attached, so it should definitely be marked as
  // protected.
  (0, _memory.protectElement)(vTree);

  // Create a DOM Node for this Virtual Tree element.
  var node = (0, _make2.default)(vTree);

  // If the element added was a DOM text node or SVG text element, trigger
  // the textChanged transition.
  if (vTree.nodeName === '#text') {
    var promises = (0, _transitions.makePromises)('textChanged', [node], null, vTree.nodeValue);

    node.nodeValue = (0, _entities.decodeEntities)(vTree.nodeValue);

    if (parentNode) {
      var nodeName = parentNode.nodeName.toLowerCase();

      if (_parser.blockText.has(nodeName)) {
        parentNode.nodeValue = (0, _entities.decodeEntities)(vTree.nodeValue);
      }
    }

    triggerTransition('textChanged', promises, function () {});
  }

  vTree.attributes.forEach(function (attr) {
    triggerTransition('attributeChanged', (0, _transitions.makePromises)('attributeChanged', [node], attr.name, null, attr.value), function () {});
  });

  // Call all `childNodes` attached callbacks as well.
  vTree.childNodes.forEach(function (vTree) {
    return attach({
      vTree: vTree, parentNode: node, triggerTransition: triggerTransition, state: state
    });
  });

  // If a Document Fragment was specified, append the DOM Node into it.
  if (fragment) {
    fragment.innerHTML = '';
    fragment.appendChild(node);
  }

  return node;
};

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patchNode(node, patches) {
  var state = _cache.StateCache.get(node);
  var promises = [];
  var triggerTransition = (0, _transitions.buildTrigger)(promises);

  // Loop through all the patches and apply them.

  var _loop = function _loop(i) {
    var patch = patches[i];
    var el = (0, _make2.default)(patch.element);
    var oldEl = (0, _make2.default)(patch.old);
    var newEl = (0, _make2.default)(patch.new);

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === _sync.REMOVE_ELEMENT_CHILDREN) {
      var childNodes = filter.call(el.childNodes, isElementNode);
      var detachPromises = (0, _transitions.makePromises)('detached', childNodes);

      triggerTransition('detached', detachPromises, function (promises) {
        var callback = function callback() {
          (0, _memory.unprotectElement)(patch.toRemove);
          el.innerHTML = '';
        };

        if (promises.length) {
          Promise.all(promises).then(callback);
        } else {
          callback();
        }
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === _sync.REMOVE_ENTIRE_ELEMENT) {
        var _childNodes = [el].filter(isElementNode);
        var _detachPromises = (0, _transitions.makePromises)('detached', _childNodes);

        checkForMissingParent('remove', el, patch);

        if (el.parentNode) {
          triggerTransition('detached', _detachPromises, function (promises) {
            var callback = function callback() {
              el.parentNode.removeChild(el);
              (0, _memory.unprotectElement)(patch.toRemove);
            };

            if (promises.length) {
              Promise.all(promises).then(callback);
            } else {
              callback();
            }
          });
        } else {
          (0, _memory.unprotectElement)(patch.toRemove);
        }
      }

      // Replace the entire Node.
      else if (patch.__do__ === _sync.REPLACE_ENTIRE_ELEMENT) {
          (function () {
            var allPromises = [];

            var attached = (0, _transitions.makePromises)('attached', [newEl].filter(isElementNode));
            var detached = (0, _transitions.makePromises)('detached', [oldEl].filter(isElementNode));
            var replaced = (0, _transitions.makePromises)('replaced', [oldEl], newEl);

            // Add all the transition state promises into the main array, we'll use
            // them all to decide when to alter the DOM.
            triggerTransition('detached', detached, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            triggerTransition('attached', attached, function (promises) {
              allPromises.push.apply(allPromises, promises);
              attach({ vTree: patch.new, triggerTransition: triggerTransition, state: state });
            });

            triggerTransition('replaced', replaced, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            // Reset the tree cache.
            _cache.StateCache.set(newEl, {
              oldTree: patch.new,
              element: newEl,
              bufferedTransactions: []
            });

            var callback = function callback() {
              checkForMissingParent('replace', oldEl, patch);
              (0, _memory.unprotectElement)(patch.old);
              (0, _memory.protectElement)(patch.new);
              oldEl.parentNode.replaceChild(newEl, oldEl);
            };

            // Once all the promises have completed, invoke the action, if no
            // promises were added, this will be a synchronous operation.
            if (allPromises.length) {
              Promise.all(allPromises).then(callback);
            } else {
              callback();
            }
          })();
        }

        // Node manip.
        else if (patch.__do__ === _sync.MODIFY_ELEMENT) {
            // Add.
            if (el && patch.fragment && !oldEl) {
              (function () {
                var fragment = document.createDocumentFragment();

                // Loop over every element to be added and process the Virtual Tree
                // element into the DOM Node and append into the DOM fragment.
                var toAttach = patch.fragment.map(function (vTree) {
                  return attach({
                    vTree: vTree, fragment: fragment, triggerTransition: triggerTransition, state: state
                  });
                }).filter(isElementNode);

                // Turn elements into childNodes of the patch element.
                el.appendChild(fragment);

                // Trigger transitions.
                var makeAttached = (0, _transitions.makePromises)('attached', toAttach);
                triggerTransition('attached', makeAttached, function () {});
              })();
            }

            // Remove.
            else if (oldEl && !newEl) {
                // Ensure we can remove the old DOM Node.
                checkForMissingParent('remove', oldEl, patch);

                var makeDetached = (0, _transitions.makePromises)('detached', [oldEl]);

                triggerTransition('detached', makeDetached, function (promises) {
                  var callback = function callback() {
                    if (oldEl.parentNode) {
                      oldEl.parentNode.removeChild(oldEl);
                    }

                    // And then empty out the entire contents.
                    oldEl.innerHTML = '';

                    (0, _memory.unprotectElement)(patch.old);
                  };

                  if (promises.length) {
                    Promise.all(promises).then(callback);
                  } else {
                    callback();
                  }
                });
              }

              // Replace.
              else if (oldEl && newEl) {
                  (function () {
                    // Ensure we can replace the old DOM Node.
                    checkForMissingParent('replace', oldEl, patch);

                    // Append the element first, before doing the replacement.
                    if (oldEl.nextSibling) {
                      oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
                    } else {
                      oldEl.parentNode.appendChild(newEl);
                    }

                    // Removed state for transitions API.
                    var allPromises = [];

                    var attachPromises = (0, _transitions.makePromises)('attached', [newEl].filter(isElementNode));

                    var detachPromises = (0, _transitions.makePromises)('detached', [oldEl].filter(isElementNode));

                    var replacePromises = (0, _transitions.makePromises)('replaced', [oldEl], newEl);

                    triggerTransition('replaced', replacePromises, function (promises) {
                      if (promises.length) {
                        allPromises.push.apply(allPromises, promises);
                      }
                    });

                    triggerTransition('detached', detachPromises, function (promises) {
                      if (promises.length) {
                        allPromises.push.apply(allPromises, promises);
                      }
                    });

                    triggerTransition('attached', attachPromises, function (promises) {
                      if (promises.length) {
                        allPromises.push.apply(allPromises, promises);
                      }

                      attach({ vTree: patch.new, triggerTransition: triggerTransition, state: state });
                    });

                    var callback = function callback() {
                      checkForMissingParent('replace', oldEl, patch);

                      (0, _memory.unprotectElement)(patch.old);
                      (0, _memory.protectElement)(patch.new);

                      oldEl.parentNode.replaceChild(newEl, oldEl);
                    };

                    // Once all the promises have completed, invoke the action, if no
                    // promises were added, this will be a synchronous operation.
                    if (allPromises.length) {
                      Promise.all(allPromises).then(callback);
                    } else {
                      callback();
                    }
                  })();
                }
          }

          // Attribute manipulation.
          else if (patch.__do__ === _sync.MODIFY_ATTRIBUTE) {
              var attributes = patch.attributes;

              attributes.forEach(function (_ref2) {
                var oldAttr = _ref2.oldAttr;
                var newAttr = _ref2.newAttr;

                var name = newAttr ? newAttr.name : oldAttr.name;
                var value = (oldAttr ? oldAttr.value : undefined) || null;

                var attrChangePromises = (0, _transitions.makePromises)('attributeChanged', [el], name, value, newAttr ? newAttr.value : null);

                triggerTransition('attributeChanged', attrChangePromises, function (promises) {
                  var callback = function callback() {
                    // Always remove the old attribute, we never re-use it.
                    if (oldAttr) {
                      pools.attributeObject.unprotect(oldAttr);

                      // Remove the Virtual Tree Attribute from the element and memory.
                      if (!newAttr || !newAttr.name) {
                        el.removeAttribute(oldAttr.name);

                        if (oldAttr.name in el) {
                          el[oldAttr.name] = undefined;
                        }
                      }
                    }

                    // Add/Change the attribute or property.
                    if (newAttr) {
                      var isObject = _typeof(newAttr.value) === 'object';
                      var isFunction = typeof newAttr.value === 'function';

                      // Protect the Virtual Attribute object.
                      pools.attributeObject.protect(newAttr);

                      // If not a dynamic type, set as an attribute, since it's a valid
                      // attribute value.
                      if (!isObject && !isFunction) {
                        if (newAttr.name) {
                          el.setAttribute(newAttr.name, (0, _entities.decodeEntities)(newAttr.value));
                        }
                      } else if (typeof newAttr.value !== 'string') {
                        // Necessary to track the attribute/prop existence.
                        el.setAttribute(newAttr.name, '');

                        // Since this is a dynamic value it gets set as a property.
                        el[newAttr.name] = newAttr.value;
                      }

                      // Support live updating of the value attribute.
                      if (newAttr.name === 'value' || newAttr.name === 'checked') {
                        el[newAttr.name] = newAttr.value;
                      }
                    }
                  };

                  if (promises.length) {
                    Promise.all(promises).then(callback, function unhandledException() {});
                  } else {
                    callback();
                  }
                });
              });
            }

            // Text node manipulation.
            else if (patch.__do__ === _sync.CHANGE_TEXT) {
                var textChangePromises = (0, _transitions.makePromises)('textChanged', [el], el.nodeValue, patch.value);

                triggerTransition('textChanged', textChangePromises, function (promises) {
                  var callback = function callback() {
                    patch.element.nodeValue = (0, _entities.decodeEntities)(patch.value);
                    el.nodeValue = patch.element.nodeValue;

                    if (el.parentNode) {
                      var nodeName = el.parentNode.nodeName.toLowerCase();

                      if (_parser.blockText.has(nodeName)) {
                        el.parentNode.nodeValue = (0, _entities.decodeEntities)(patch.element.nodeValue);
                      }
                    }
                  };

                  if (promises.length) {
                    Promise.all(promises).then(callback);
                  } else {
                    callback();
                  }
                });
              }
  };

  for (var i = 0; i < patches.length; i++) {
    _loop(i);
  }

  // Return the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  return promises;
}

},{"../tree/sync":9,"../util/cache":10,"../util/entities":11,"../util/memory":13,"../util/parser":18,"../util/pools":14,"../util/transitions":17,"./make":3}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = releaseNode;

var _cache = _dereq_('../util/cache');

var _memory = _dereq_('../util/memory');

/**
 * Releases state and recycles internal memory.
 *
 * @param node {Object} - A DOM Node to lookup state from
 */
function releaseNode(node) {
  // Try and find a state object for this DOM Node.
  var state = _cache.StateCache.get(node);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    (0, _memory.unprotectElement)(state.oldTree);
  }

  // Remove the Node's state object from the cache.
  _cache.StateCache.delete(node);

  // Recycle all unprotected objects.
  (0, _memory.cleanMemory)();
}

},{"../util/cache":10,"../util/memory":13}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = createTransaction;

var _patch = _dereq_('./patch');

var _patch2 = _interopRequireDefault(_patch);

var _finalize = _dereq_('./finalize');

var _finalize2 = _interopRequireDefault(_finalize);

var _make = _dereq_('../tree/make');

var _make2 = _interopRequireDefault(_make);

var _sync = _dereq_('../tree/sync');

var _sync2 = _interopRequireDefault(_sync);

var _helpers = _dereq_('../tree/helpers');

var _memory = _dereq_('../util/memory');

var _parser = _dereq_('../util/parser');

var _pools = _dereq_('../util/pools');

var pools = _interopRequireWildcard(_pools);

var _cache = _dereq_('../util/cache');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * If an existing transaction is rendering anywhere asynchronously, we need to
 * wait until it completes before this render can be executed. This buffers the
 * current transaction's arguments to be executed after the existing
 * transactions complete.
 *
 * @param {Object} transaction - The arguments necessary to create a transaction
 * @return {Boolean} - Is an existing transaction currently rendering?
 */
var setBufferState = function setBufferState(transaction) {
  var isBufferSet = false;

  // If an existing render transaction state is rendering, buffer this
  // transaction.
  _cache.StateCache.forEach(function (state) {
    if (state.isRendering) {
      state.bufferedTransactions.push(transaction);
      isBufferSet = true;
    }
  });

  // Let the transaction scope know if it was buffered.
  return isBufferSet;
};

/**
 * Gets a Virtual Tree Element from the newHTML passed to a diff method.
 *
 * @param {String|Object} newHTML - HTML/DOM Node/Virtual Tree Element
 * @return {Object} - Virtual Tree Element
 */
var getTreeFromNewHTML = function getTreeFromNewHTML(newHTML, options, callback) {
  // This is HTML Markup, so we need to parse it.
  if (typeof newHTML === 'string') {
    var silenceWarnings = options.silenceWarnings;
    var childNodes = (0, _parser.parse)(newHTML, null, { silenceWarnings: silenceWarnings }).childNodes;

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one.
    return callback(childNodes);
  }
  // This is a DOM Node, so we need to convert to a vTree.
  else if (newHTML.ownerDocument) {
      var newTree = (0, _make2.default)(newHTML);

      if (newTree.nodeType === 11) {
        pools.elementObject.unprotect(newTree);
        return callback(newTree.childNodes);
      }

      return callback(newTree);
    }

  // This is a Virtual Tree Element, or something like it, so we can just pass
  // it along.
  return callback(newHTML);
};

/**
 * Creates a sequential render transaction on a DOM Node. This requires
 * checking for a previous render first. Since diffHTML is globally connected
 * (hopefully only running one copy...), this will prevent transitions from
 * interferring.
 *
 * @param node
 * @param newHTML
 * @param options
 */
function createTransaction(node, newHTML, options) {
  if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') {
    throw new Error('Missing DOM Node object');
  }

  // Used to associate state with the currently rendering node. This
  // prevents attaching properties to the instance itself.
  var state = _cache.StateCache.get(node) || {
    // Set up an array for buffered transactions. This is used with
    // asynchronous renders using the transitions API.
    bufferedTransactions: []
  };
  var isInner = options.inner;
  var previousMarkup = state.previousMarkup;
  var previousText = state.previousText;
  var bufferSet = setBufferState({ node: node, newHTML: newHTML, options: options });

  // Associate the current render options with the DOM Node state.
  state.options = options;

  // Always ensure the most up-to-date state object is stored.
  _cache.StateCache.set(node, state);

  // Short circuit the rest of this render if we ended up having to set a
  // buffer. This happens when some other code using diffHTML is rendering
  // asynchronously (using transitions w/ Promise).
  if (bufferSet) {
    return;
  }

  // This looks for changes in the DOM from what we'd expect. This means we
  // need to rebuild the old Virtual Tree. This allows for keeping our tree in
  // sync with unexpected DOM changes. It's not very performant, so ideally you
  // should never change markup that diffHTML affects from outside of diffHTML
  // if performance is a concern.
  var sameInnerHTML = isInner ? previousMarkup === node.innerHTML : true;
  var sameOuterHTML = !isInner ? previousMarkup === node.outerHTML : true;
  var sameTextContent = previousText === node.textContent;

  // If the contents haven't changed, abort, since there is no point in
  // continuing. Only support this if the new markup is a string, otherwise
  // it's possible for our object recycling to match twice.
  if (typeof newHTML === 'string' && state.newHTML === newHTML) {
    return;
  }
  // Associate the last markup rendered with this node.
  else if (typeof newHTML === 'string') {
      state.newHTML = newHTML;
    }

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  var rebuildTree = function rebuildTree() {
    var oldTree = state.oldTree;

    if (oldTree) {
      (0, _memory.unprotectElement)(oldTree);
    }

    state.oldTree = (0, _memory.protectElement)((0, _make2.default)(node));
  };

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // We're rendering in the UI thread.
  state.isRendering = true;

  // Store all transaction starting middleware functions being executed here.
  var startTransactionMiddlewares = [];

  // Start off the middleware execution.
  _cache.MiddlewareCache.forEach(function (executeMiddleware) {
    // Pass the start transaction call with the input arguments.
    var result = executeMiddleware({ node: node, newHTML: newHTML, options: options });

    if (result) {
      startTransactionMiddlewares.push(result);
    }
  });

  // Alias the `oldTree` off of state for parity.
  var oldTree = state.oldTree;

  // We need to ensure that our target to diff is a Virtual Tree Element. This
  // function takes in whatever `newHTML` is and normalizes to a tree object.
  // The callback function runs on every normalized Node to wrap childNodes
  // in the case of setting innerHTML.
  var newTree = getTreeFromNewHTML(newHTML, options, function (newTree) {
    if (isInner) {
      pools.elementObject.unprotect(newTree);

      var nodeName = state.oldTree.nodeName;
      var attributes = state.oldTree.attributes;

      return (0, _helpers.createElement)(nodeName, attributes, newTree);
    }

    return Array.isArray(newTree) ? newTree[0] : newTree;
  });

  // Trigger any middleware with the DOM Node, old Virtual Tree Element, and
  // new Virtual Tree Element. This allows the middleware to mutate and inspect
  // the trees before they get consumed by diffHTML.
  var prePatchMiddlewares = [];

  // By exposing the internal tree synchronization and DOM Node patch methods,
  // a middleware could implement sync/patch on a separate thread.
  var transactionMethods = {
    syncTree: _sync2.default,
    patchNode: _patch2.default,
    protectElement: _memory.protectElement,
    unprotectElement: _memory.unprotectElement
  };

  // Save the current transaction tree state and allow the mdidleware to
  // override the trees.
  var transactionState = {
    oldTree: oldTree,
    newTree: newTree,
    transactionMethods: transactionMethods
  };

  // Run each middleware and pass the transaction state which contains internal
  // functions otherwise not available by the public API.
  for (var i = 0; i < startTransactionMiddlewares.length; i++) {
    // Pass the the existing Virtual Tree Element, and the new Virtual Tree
    // Element. This is triggered before the synchronization and patching has
    // occured.
    var result = startTransactionMiddlewares[i](transactionState);

    if (result) {
      prePatchMiddlewares.push(result);
    }
  }

  // Synchronize the trees, use any middleware replacements, if supplied.
  var patches = (0, _sync2.default)(transactionState.oldTree, transactionState.newTree);

  // Apply the set of patches to the Node.
  var promises = (0, _patch2.default)(node, patches);

  // Trigger any middleware after syncing and patching the element. This is
  // mainly useful to get the Promises for something like devtools and patches
  // for something like logging.
  var postPatchMiddlewares = [];

  for (var _i = 0; _i < prePatchMiddlewares.length; _i++) {
    // The DOM Node patching has finished and now we're sending the patchset
    // and the promises which can also be pushed into to do some asynchronous
    // behavior in a middleware.
    var _result = prePatchMiddlewares[_i]({
      patches: patches,
      promises: promises
    });

    if (_result) {
      postPatchMiddlewares.push(_result);
    }
  }

  // Clean up and finalize this transaction. If there is another transaction,
  // get a callback to run once this completes to run it.
  var finalizeTransaction = (0, _finalize2.default)(node, state);

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter if
  // they are actually Promises or not, since they will all resolve eventually
  // with `Promise.all`.
  if (promises.length) {
    Promise.all(promises).then(function () {
      return finalizeTransaction(postPatchMiddlewares);
    });
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    finalizeTransaction(postPatchMiddlewares);
  }
}

},{"../tree/helpers":7,"../tree/make":8,"../tree/sync":9,"../util/cache":10,"../util/memory":13,"../util/parser":18,"../util/pools":14,"./finalize":2,"./patch":4}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.createElement = createElement;
exports.createAttribute = createAttribute;

var _pools = _dereq_('../util/pools');

var pools = _interopRequireWildcard(_pools);

var _escape = _dereq_('../util/escape');

var _escape2 = _interopRequireDefault(_escape);

var _make = _dereq_('../tree/make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Normalizes items that are not Virtual Tree Elements.
 *
 * @api private
 * @return {Array} of childNodes
 */
var normalize = function normalize(childNodes) {
  return childNodes.reduce(function (newChildNodes, childNode) {
    // Is a text Node.
    if ((typeof childNode === 'undefined' ? 'undefined' : _typeof(childNode)) !== 'object') {
      newChildNodes.push(createElement('#text', null, String(childNode)));
    }
    // Is a NodeList or HTMLCollection or array-like.
    else if ('length' in childNode) {
        for (var _i = 0; _i < childNode.length; _i++) {
          newChildNodes.push((0, _make2.default)(childNode[_i]));
        }
      }
      // Is a DOM Node.
      else if (childNode.ownerDocument) {
          newChildNodes.push((0, _make2.default)(childNode[i]));
        }
        // Is a Virtual Tree Element.
        else {
            newChildNodes.push(childNode);
          }

    return newChildNodes;
  }, []);
};

/**
 * Creates a virtual element used in or as a virtual tree.
 *
 * @api public
 * @param nodeName
 * @param attributes
 * @param childNodes
 * @return {Object} element
 */
function createElement(nodeName, attributes) {
  for (var _len = arguments.length, childNodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    childNodes[_key - 2] = arguments[_key];
  }

  if (nodeName === '') {
    return normalize(childNodes);
  }

  if (typeof nodeName === 'function') {
    var props = attributes;
    props.children = childNodes;
    return new nodeName(props).render(props);
  } else if ((typeof nodeName === 'undefined' ? 'undefined' : _typeof(nodeName)) === 'object') {
    var _props = attributes;
    _props.children = childNodes;
    return nodeName.render(_props);
  }

  // Convert an attributes Object into an Array.
  if (attributes && !Array.isArray(attributes)) {
    attributes = Object.keys(attributes).map(function (name) {
      return createAttribute(name, attributes[name]);
    });
  }

  var entry = pools.elementObject.get();
  var isTextNode = nodeName === 'text' || nodeName === '#text';

  entry.key = '';
  entry.nodeName = nodeName.toLowerCase();
  entry.rawNodeName = nodeName;

  if (!isTextNode) {
    entry.nodeType = 1;
    entry.nodeValue = '';
    entry.attributes = attributes || [];
    entry.childNodes = normalize(childNodes);

    // Set the key prop if passed as an attr.
    entry.attributes.some(function (attr) {
      if (attr.name === 'key') {
        entry.key = attr.value;
        return true;
      }
    });
  } else {
    entry.nodeType = nodeName === '#document-fragment' ? 11 : 3;
    entry.nodeValue = (0, _escape2.default)(String(childNodes.join('')));
    entry.attributes.length = 0;
    entry.childNodes.length = 0;
  }

  return entry;
}

/**
 * Creates a virtual attribute used in a virtual element.
 *
 * @param name
 * @param value
 * @return {Object} attribute
 */
function createAttribute(name, value) {
  var entry = pools.attributeObject.get();

  entry.name = name;
  entry.value = value;

  return entry;
}

},{"../tree/make":8,"../util/escape":12,"../util/pools":14}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeNode;

var _helpers = _dereq_('./helpers');

var _pools = _dereq_('../util/pools');

var pools = _interopRequireWildcard(_pools);

var _cache = _dereq_('../util/cache');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Converts a DOM Node into a Virtual Tree Element.
 *
 * @param {Object} node - A DOM Node
 * @return {Object} - A Virtual Tree Element
 */
function makeNode(node) {
  // These are the only DOM Node properties we care about.
  var nodeName = node.nodeName.toLowerCase();
  var nodeType = node.nodeType;
  var nodeValue = node.nodeValue;
  var attributes = node.attributes || [];
  var childNodes = node.childNodes || [];

  // We ignore any DOM Node that isn't an: Element, Text, Document Fragment, or
  // Shadow Root.
  if (nodeType !== 1 && nodeType !== 3 && nodeType !== 11) {
    return false;
  }

  // We can consider either of these DOM Nodes as Text Nodes.
  var isTextNode = nodeName === '#text' || nodeName === 'text';

  // In the case of Text Node's we can have the createElement function set
  // the nodeValue for us.
  var initialValue = isTextNode ? nodeValue : [];

  // Creates a Virtual Tree Element based off this nodeName. We aren't going
  // to set the attributes right away since we want to set the key on the vTree
  // and push directly into the pre-existing array.
  var vTree = (0, _helpers.createElement)(node.nodeName, [], initialValue);

  // Creates Virtual Tree Attributes for each attribute in the DOM Node.
  for (var i = 0; i < attributes.length; i++) {
    var attr = (0, _helpers.createAttribute)(attributes[i].name, attributes[i].value);

    // If the `key` attribute is found, set the respective value on the vTree.
    if (attr.name === 'key') {
      vTree.key = attr.value;
    }

    vTree.attributes.push(attr);
  }

  // Associate this newly allocated vTree with this DOM Node.
  _cache.NodeCache.set(vTree, node);

  // If the element has child nodes, convert them all to virtual nodes.
  for (var _i = 0; _i < childNodes.length; _i++) {
    var newNode = makeNode(childNodes[_i]);

    // We may get a falsy value back if we pass in a Comment Node or other
    // DOM Nodes that we intentionally ignore.
    if (newNode) {
      vTree.childNodes.push(newNode);
    }
  }

  // Prune out whitespace/everything from between tags nested under the HTML
  // tag, since this behavior can be observed in browsers and specification.
  if (vTree.nodeName === 'html') {
    vTree.childNodes = vTree.childNodes.filter(function (childNode) {
      return childNode.nodeName === 'head' || childNode.nodeName === 'body';
    });
  }

  return vTree;
}

},{"../util/cache":10,"../util/pools":14,"./helpers":7}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sync;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Export the patch action type constants.
var REMOVE_ELEMENT_CHILDREN = exports.REMOVE_ELEMENT_CHILDREN = -2;
var REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = -1;
var REPLACE_ENTIRE_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = 0;
var MODIFY_ELEMENT = exports.MODIFY_ELEMENT = 1;
var MODIFY_ATTRIBUTE = exports.MODIFY_ATTRIBUTE = 2;
var CHANGE_TEXT = exports.CHANGE_TEXT = 3;

/**
 * Synchronizes changes from the newTree into the oldTree. This is a rather
 * naive implement that could be greatly improved over time. The goal is
 * currently to be accurate first, performant second. This logic should be as
 * simple as possible, therefore no memory management occurs here. This means
 * that every patch must contain all references to be cleaned up along with the
 * references necessary to apply the patch.
 *
 * @param {Object} oldTree - The original Virtual Tree Element
 * @param {Object} newTree -  The new Virtual Tree Element
 */
function sync(oldTree, newTree) {
  // If there is no old Virtual Tree Element to reconcile changes into, throw
  // an error.
  if (!oldTree) {
    throw new Error('Missing existing tree to sync');
  }

  // Automatically create the patches array internally. It's the last argument
  // here, because we want to provide in each recursive iteration.
  var patches = arguments[2] || [];

  // Short-hand the common old Virtual Tree Element properties.
  var oldNodeName = oldTree.nodeName;
  var oldNodeValue = oldTree.nodeValue;
  var oldChildNodes = oldTree.childNodes;
  var oldAttributes = oldTree.attributes;
  var oldIsTextNode = oldNodeName === '#text';

  // If there is no new Virtual Tree Element to sync from, remove the entire
  // DOM Node.
  if (!newTree) {
    patches.push({
      __do__: REMOVE_ENTIRE_ELEMENT,
      element: oldTree,
      toRemove: oldChildNodes
    });

    return patches;
  }

  // Short-hand the common new Virtual Tree Element properties.
  var newNodeName = newTree.nodeName;
  var newNodeValue = newTree.nodeValue;
  var newChildNodes = newTree.childNodes;
  var newAttributes = newTree.attributes;
  var newIsTextNode = newNodeName === '#text';
  var newIsFragment = newNodeName === '#document-fragment';

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. This will
  // fail during the DOM Node patching if the associated DOM Node does not have
  // a parentNode (since the DOM requires that to do a replaceChild).
  if (oldNodeName !== newNodeName) {
    var toRemove = oldTree.childNodes;

    // Shallow clone is fine here, we just need to merge the newTree into the
    // oldTree.
    Object.assign(oldTree, newTree);

    patches.push({
      __do__: REPLACE_ENTIRE_ELEMENT,
      old: oldTree,
      new: newTree,
      toRemove: toRemove
    });

    return patches;
  }
  // This element never changes.
  else if (oldTree === newTree) {
      return patches;
    }

  // If the top level nodeValue has changed we should reflect it.
  if (oldIsTextNode && newIsTextNode && oldNodeValue !== newNodeValue) {
    patches.push({
      __do__: CHANGE_TEXT,
      element: oldTree,
      value: newNodeValue
    });

    oldTree.nodeValue = newNodeValue;

    return patches;
  }

  // Ensure keys exist for all the old & new elements.
  var noOldKeys = !oldChildNodes.some(function (oldChildNode) {
    return oldChildNode.key;
  });

  // Find all the old keys.
  var oldKeys = noOldKeys || new Set(oldChildNodes.map(function (vTree) {
    return String(vTree.key);
  }));

  // Find all the new keys.
  var newKeys = noOldKeys || new Set(newChildNodes.map(function (vTree) {
    return String(vTree.key);
  }));

  // We merge the addition and replacement of Nodes into the same operation.
  // This trick is supported by the awesome utility of Document Fragments.
  if (newChildNodes.length >= oldChildNodes.length) {
    // Store elements in a Document Fragment to increase performance and be
    // generally simplier to work with. We can add and replace DOM Nodes in
    // this container trivially.
    var fragment = [];

    // If these elements are not using keys to track position, we simply need
    // to add the new elements into the fragment.
    if (noOldKeys) {
      for (var i = 0; i < newChildNodes.length; i++) {
        var _oldTree = oldChildNodes[i];
        var _newTree = newChildNodes[i];

        oldChildNodes.push(_newTree);
        fragment.push(_newTree);

        if (_oldTree) {
          sync(_oldTree, _newTree, patches);
        }
      }
    }
    // Handle key attribute special to position offset.
    else {
        // Find the keys in the sets to remove.
        for (var _i = 0; _i < newChildNodes.length; _i++) {
          var _oldTree2 = oldChildNodes[_i];
          var _newTree2 = newChildNodes[_i];
          var key = String(_newTree2.key);

          // If there is an existing element in this position, we're dealing with
          // a key'd new element, and it is brand new.
          if (_oldTree2 && key && !oldKeys.has(key) && newKeys.has(key)) {
            oldChildNodes.splice(_i, 0, _newTree2);

            var nextChildNode = newChildNodes[_i + 1];

            if (nextChildNode && nextChildNode.nodeName === '#text') {
              oldChildNodes.splice(_i + 1, 0, newChildNodes[_i + 1]);
            }
          } else if (!_oldTree2) {
            oldChildNodes.splice(_i, 0, _newTree2);
          }

          fragment.push(_newTree2);

          // Synchronize each new tree against the previous recursively.
          sync(_oldTree2, _newTree2, patches);
        }
      }

    // Assign the fragment to the patches to be injected.
    if (fragment.length) {
      patches.push({
        __do__: MODIFY_ELEMENT,
        element: oldTree,
        fragment: fragment
      });
    }
  }

  // Remove these elements.
  if (oldChildNodes.length > newChildNodes.length) {
    (function () {
      // For now just splice out the end items.
      var diff = oldChildNodes.length - newChildNodes.length;
      var shallowClone = [].concat(_toConsumableArray(oldChildNodes));

      var toRemove = [];

      // There needs to be keys to diff, if not, there's no point in checking.
      if (noOldKeys) {
        toRemove = oldChildNodes.splice(oldChildNodes.length - diff, diff);
      }
      // This is an expensive operation so we do the above check to ensure that a
      // key was specified.
      else {
          (function () {
            var keysToRemove = new Set();

            // Find the keys in the sets to remove.
            oldKeys.forEach(function (key) {
              return !newKeys.has(key) && keysToRemove.add(key);
            });

            // If the original childNodes contain a key attribute, use this to
            // compare over the naive method below.
            shallowClone.forEach(function (oldChildNode, i) {
              if (keysToRemove.has(String(oldChildNode.key))) {
                var nextChild = oldChildNodes[i + 1];
                var nextIsTextNode = nextChild && nextChild.nodeType === 3;
                var removeText = nextIsTextNode && toRemove.length + 2 <= diff;
                var start = oldChildNodes.indexOf(oldChildNode);
                var end = removeText ? 2 : 1;

                toRemove.push.apply(toRemove, oldChildNodes.splice(start, end));
              }
            });
          })();
        }

      // Ensure we don't remove too many elements by accident;
      toRemove.length = diff;

      if (newChildNodes.length === 0) {
        oldChildNodes.length = 0;

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

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (!newIsFragment && newAttributes) {
    // Cache the lengths for performance and readability.
    var oldLength = oldAttributes.length;
    var newLength = newAttributes.length;

    // Construct a single patch for the entire changeset.
    var patch = {
      __do__: MODIFY_ATTRIBUTE,
      element: oldTree,
      attributes: []
    };

    // Find additions.
    if (newLength > oldLength) {
      for (var _i2 = oldLength; _i2 < newLength; _i2++) {
        var oldAttr = oldAttributes[_i2];
        var newAttr = newAttributes[_i2];

        patch.attributes.push({ oldAttr: oldAttr, newAttr: newAttr });
        oldAttributes.push(newAttr);
      }
    }

    // Find removals.
    if (oldLength > newLength) {
      for (var _i3 = newLength; _i3 < oldLength; _i3++) {
        var _oldAttr = oldAttributes[_i3];
        var _newAttr = newAttributes[_i3];

        patch.attributes.push({ oldAttr: _oldAttr, newAttr: _newAttr });
      }

      oldAttributes.length = newLength;
    }

    // Find changes.
    for (var _i4 = 0; _i4 < newAttributes.length; _i4++) {
      var _oldAttr2 = oldAttributes[_i4];
      var _newAttr2 = newAttributes[_i4];
      var oldAttrName = _oldAttr2 ? _oldAttr2.name : undefined;
      var oldAttrValue = _oldAttr2 ? _oldAttr2.value : undefined;
      var newAttrName = _newAttr2 ? _newAttr2.name : undefined;
      var newAttrValue = _newAttr2 ? _newAttr2.value : undefined;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        // Add the attribute items to add and remove.
        patch.attributes.push({
          oldAttr: _oldAttr2,
          newAttr: _newAttr2
        });

        oldAttributes[_i4] = _newAttr2;
      }
    }

    // Add the attribute changes patch to the series of patches, unless there
    // are no attributes to change.
    if (patch.attributes.length) {
      patches.push(patch);
    }
  }

  return patches;
}

},{}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Associates DOM Nodes with state objects.
var StateCache = exports.StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
var NodeCache = exports.NodeCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
var MiddlewareCache = exports.MiddlewareCache = new Set();

},{}],11:[function(_dereq_,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeEntities = decodeEntities;
// Support loading diffHTML in non-browser environments.
var element = global.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || string.indexOf('&') === -1) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escape;
/**
 * Tiny HTML escaping function, useful to prevent things like XSS and
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

},{}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;
exports.cleanMemory = cleanMemory;

var _pools = _dereq_('../util/pools');

var pools = _interopRequireWildcard(_pools);

var _cache = _dereq_('./cache');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */
function protectElement(element) {
  if (!element) {
    return;
  } else if (Array.isArray(element)) {
    return element.forEach(protectElement);
  }

  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

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
function unprotectElement(element) {
  if (!element) {
    return;
  } else if (Array.isArray(element)) {
    return element.forEach(unprotectElement);
  }

  var elementObject = pools.elementObject;
  var attributeObject = pools.attributeObject;

  elementObject.unprotect(element);

  element.attributes.forEach(attributeObject.unprotect, attributeObject);
  element.childNodes.forEach(unprotectElement);

  _cache.NodeCache.delete(element);

  return element;
}

/**
 * Recycles all unprotected allocations.
 */
function cleanMemory() {
  var elementCache = pools.elementObject.cache;
  var attributeCache = pools.attributeObject.cache;

  // Empty all element allocations.
  elementCache.allocated.forEach(function (v) {
    if (elementCache.free.length < pools.count) {
      elementCache.free.push(v);
    }
  });

  elementCache.allocated.clear();

  // Clean out unused elements.
  _cache.NodeCache.forEach(function (node, descriptor) {
    if (!elementCache.protected.has(descriptor)) {
      _cache.NodeCache.delete(descriptor);
    }
  });

  // Empty all attribute allocations.
  attributeCache.allocated.forEach(function (v) {
    if (attributeCache.free.length < pools.count) {
      attributeCache.free.push(v);
    }
  });

  attributeCache.allocated.clear();
}

},{"../util/pools":14,"./cache":10}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pools = exports.pools = {};
var count = exports.count = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param {Function} fill - A function that creates the virtual object type
 * @return {Object} - Contains cache information and memory protection
 */
function createPool(fill) {
  var cache = {
    free: [],
    allocated: new Set(),
    protected: new Set()
  };

  // Prime the cache with n objects.
  for (var i = 0; i < count; i++) {
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
    },
    unprotect: function unprotect(value) {
      if (cache.protected.has(value)) {
        cache.protected.delete(value);
        cache.free.push(value);
      }
    }
  };
}

// Creates Virtual Tree Attribute objects.
var attributeObject = exports.attributeObject = createPool(function () {
  return {
    name: '',
    value: ''
  };
});

// Creates Virtual Tree Element objects.
var elementObject = exports.elementObject = createPool(function () {
  return {
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: [],
    attributes: []
  };
});

},{}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// List of SVG elements.
var elements = exports.elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

// Namespace.
var namespace = exports.namespace = 'http://www.w3.org/2000/svg';

},{}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.html = html;

var _parser = _dereq_('./parser');

var _escape = _dereq_('./escape');

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isPropEx = /(=|'|")/;
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
  return typeof value === 'string' ? (0, _escape2.default)(value) : value;
};

/**
 * Parses tagged template contents into a Virtual Tree. These tagged templates
 * separate static strings from values, so we need to do some special token
 * work
 *
 * @param {Array} strings - A list of static strings, split by value
 * @param {Array} ...values - A list of interpolated values
 * @return {Object|Array} - A Virtual Tree Element or array of elements
 */
function html(strings) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    var _childNodes = (0, _parser.parse)(strings[0]).childNodes;
    return _childNodes.length > 1 ? _childNodes : _childNodes[0];
  }

  // Used to store markup and tokens.
  var retVal = [];

  // We filter the supplemental values by where they are used. Values are
  // either props or children.
  var supplemental = {
    props: [],
    children: []
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach(function (string) {
    // Always add the string, we need it to parse the markup later.
    retVal.push(string);

    if (values.length) {
      var value = nextValue(values);
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isProp = Boolean(lastCharacter.match(isPropEx));

      if (isProp) {
        supplemental.props.push(value);
        retVal.push(TOKEN);
      } else if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        supplemental.children.push(value);
        retVal.push(TOKEN);
      } else {
        retVal.push(value);
      }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  var childNodes = (0, _parser.parse)(retVal.join(''), supplemental).childNodes;

  // This makes it easier to work with a single element as a root, instead of
  // always return an array.
  return childNodes.length > 1 ? childNodes : childNodes[0];
}

},{"./escape":12,"./parser":18}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTrigger = buildTrigger;
exports.makePromises = makePromises;
var empty = [];

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
    for (var i = 0; i < elements.length; i++) {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && elements[i].nodeType !== 1) {
        continue;
      }

      // Call the map function with each element.
      var newPromises = states[stateName].map(mapFn.apply(null, [elements[i]].concat(args)));

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](elements[i].childNodes, args, promises);
      }
    }

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
    if (!states[stateName] || !states[stateName].length) {
      return callback(empty);
    }

    // Calls into each custom hook to bind Promises into the local array,
    // these will then get merged into the main `allPromises` array.
    var promises = makePromisesCallback([]);

    // Add these promises into the global cache.
    addPromises(promises);

    // Send back the promise values.
    return callback(promises.length ? promises : empty);
  };
}

/**
 * Make a reusable function for easy transition calling. Becomes the
 * `makePromiseCallback` in the buildTrigger method.
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

},{}],18:[function(_dereq_,module,exports){

},{}]},{},[1])(1)
});