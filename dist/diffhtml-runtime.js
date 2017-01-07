(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = html;

var _util = _dereq_('./util');

var isAttributeEx = /(=|"|')[\w\s]?$/;
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

    if (values.length) {
      var value = nextValue(values);
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isAttribute = Boolean(retVal.match(isAttributeEx));
      var isTag = Boolean(lastCharacter.match(isTagEx));

      // Attribute
      if (isAttribute) {
        supplemental.attributes.push(value);
        retVal += TOKEN;
      }
      // Tag
      else if (isTag && typeof value === 'function') {
          supplemental.tags.push(value);
          retVal += TOKEN;
        }
        // Children
        else if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            supplemental.children.push(createTree(value));
            retVal += TOKEN;
          } else if (value !== null && value !== undefined) {
            retVal += value;
          }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  var childNodes = (0, _util.parse)(retVal, supplemental).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : childNodes;
}

},{"./util":23}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.use = exports.createTree = exports.release = exports.html = exports.removeTransitionState = exports.addTransitionState = undefined;

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
exports.element = element;

var _transaction = _dereq_('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

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
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = true;
  return _transaction2.default.create(element, markup, options).start();
}

/**
 * Used to diff two DOM Nodes. The `inner` Boolean property can be specified in
 * the options to set `innerHTML`\`outerHTML` behavior. By default it is
 * `outerHTML`.
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
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return _transaction2.default.create(element, newElement, options).start();
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

var assign = Object.assign,
    freeze = Object.freeze;

/**
 * Gets a specific type of DOM Node depending on the passed in nodeName.
 *
 * @param nodeName {String} - The nodeName to disambiguate the type
 * @param nodeValue {String} - The nodeValue to set if a Text Node
 * @return {Object} - A DOM Node matching the nodeName
 */

var createNodeFromName = function createNodeFromName(vTree) {
  var nodeName = vTree.nodeName,
      childNodes = vTree.childNodes,
      attributes = vTree.attributes,
      nodeValue = vTree.nodeValue;

  // Shorthand the lookup method.

  var lookupNode = function lookupNode(domNode) {
    return _util.NodeCache.get(domNode);
  };

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    return document.createTextNode(nodeValue);
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
      return document.createDocumentFragment();
    }
    // If the nodeName matches any of the known SVG element names, mark it as
    // SVG. The reason for doing this over detecting if nested in an <svg>
    // element, is that we do not currently have circular dependencies in the
    // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
    else if (_util.elements.indexOf(nodeName) > -1) {
        return document.createElementNS(_util.namespace, nodeName);
      }
      // Render the stateful component.
      else if (typeof nodeName === 'function') {
          // Props are an immutable object inspired by React. They always contain
          // a childNodes
          var props = freeze(assign({}, attributes, {
            children: childNodes.map(lookupNode)
          }));

          // Make the stateful component.
          var instance = new nodeName(props);

          // Initial render.
          var _vTree = instance.render();

          // Return a single Node or multiple nodes depending on the return value.
          instance.getDOMNode = function () {
            return Array.isArray(node) ? node.map(lookupNode) : lookupNode(node);
          };

          return createNodeFromName(_vTree);
        } else if ((typeof nodeName === 'undefined' ? 'undefined' : _typeof(nodeName)) === 'object') {
          // Props are an immutable object inspired by React. They always contain
          // a childNodes
          var _props = freeze(assign({}, attributes, {
            children: childNodes.map(lookupNode)
          }));

          // Initial render.
          var _vTree2 = nodeName.render(_props);

          // Return a single Node or multiple nodes depending on the return value.
          nodeName.getDOMNode = function () {
            return Array.isArray(node) ? node.map(lookupNode) : lookupNode(node);
          };

          return createNodeFromName(_vTree2);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            return document.createElement(nodeName);
          }
};

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @return {Object} - A DOM Node matching the vTree
 */
function makeNode(vTree) {
  // If no Virtual Tree Element was specified, return null.
  if (!vTree) {
    return null;
  }

  // If the DOM Node was already created, reuse the existing node.
  if (_util.NodeCache.has(vTree)) {
    return _util.NodeCache.get(vTree);
  }

  var domNode = createNodeFromName(vTree);

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.
  for (var i = 0; i < (vTree.attributes || []).length; i++) {
    var attr = vTree.attributes[i];
    var isObject = _typeof(attr.value) === 'object';
    var isFunction = typeof attr.value === 'function';

    // If not a dynamic type, set as an attribute, since it's a valid
    // attribute value.
    if (attr.name && !isObject && !isFunction) {
      domNode.setAttribute(attr.name, (0, _util.decodeEntities)(attr.value));
    } else if (attr.name && typeof attr.value !== 'string') {
      // Necessary to track the attribute/prop existence.
      domNode.setAttribute(attr.name, '');

      // Since this is a dynamic value it gets set as a property.
      domNode[attr.name] = attr.value;
    }
  }

  // Append all the children into the domNode, making sure to run them
  // through this `make` function as well.
  for (var _i = 0; _i < (vTree.childNodes || []).length; _i++) {
    domNode.appendChild(makeNode(vTree.childNodes[_i]));
  }

  // Add to the domNodes cache.
  _util.NodeCache.set(vTree, domNode);

  return domNode;
}

},{"../util":23}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.patchNode = patchNode;

var _node = _dereq_('../node');

var _util = _dereq_('../util');

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
    (0, _util.unprotectElement)(patch.old);
    (0, _util.unprotectElement)(patch.new);

    // Throw an error to stop rendering/inform the developer.
    throw new Error(('\n      Can\'t ' + verb + ' without parent, is this the document root?\n    ').trim());
  }
};

// Trigger the attached transition state for this element and all childNodes.
var attach = function attach(_ref) {
  var vTree = _ref.vTree,
      fragment = _ref.fragment,
      parentNode = _ref.parentNode,
      triggerTransition = _ref.triggerTransition,
      state = _ref.state;

  // This element has been attached, so it should definitely be marked as
  // protected.
  (0, _util.protectElement)(vTree);

  // Create a DOM Node for this Virtual Tree element.
  var node = (0, _node.makeNode)(vTree);

  // If the element added was a DOM text node or SVG text element, trigger
  // the textChanged transition.
  if (vTree.nodeName === '#text') {
    var promises = (0, _util.makePromises)('textChanged', [node], null, vTree.nodeValue);

    node.nodeValue = (0, _util.decodeEntities)(vTree.nodeValue);

    if (parentNode) {
      var nodeName = parentNode.nodeName.toLowerCase();

      if (_util.blockText.has(nodeName)) {
        parentNode.nodeValue = (0, _util.decodeEntities)(vTree.nodeValue);
      }
    }

    triggerTransition('textChanged', promises);
  }

  vTree.attributes.forEach(function (attr) {
    triggerTransition('attributeChanged', (0, _util.makePromises)('attributeChanged', [node], attr.name, null, attr.value));
  });

  // Call all `childNodes` attached callbacks as well.
  vTree.childNodes.forEach(function (vTree) {
    return attach({
      vTree: vTree, parentNode: node, triggerTransition: triggerTransition, state: state
    });
  });

  // If a Document Fragment was specified, append the DOM Node into it.
  if (fragment) {
    fragment.appendChild(node);
  }

  return node;
};

function patchNode(patches, state) {
  // Apply the set of patches to the Node.
  var promises = [];
  var triggerTransition = (0, _util.buildTrigger)(promises);

  // Loop through all the patches and apply them.

  var _loop = function _loop(i) {
    var patch = patches[i];
    var el = (0, _node.makeNode)(patch.element);
    var oldEl = (0, _node.makeNode)(patch.old);
    var newEl = (0, _node.makeNode)(patch.new);

    // Empty the Node's contents. This is an optimization, since `innerHTML`
    // will be faster than iterating over every element and manually removing.
    if (patch.__do__ === REMOVE_ELEMENT_CHILDREN) {
      var childNodes = filter.call(el.childNodes, isElementNode);
      var detachPromises = (0, _util.makePromises)('detached', childNodes);

      triggerTransition('detached', detachPromises, function (promises) {
        var callback = function callback() {
          (0, _util.unprotectElement)(patch.toRemove);
          el.innerHTML = '';
        };

        if (promises && promises.length) {
          Promise.all(promises).then(callback);
        } else {
          callback();
        }
      });
    }

    // Remove the entire Node. Only does something if the Node has a parent
    // element.
    else if (patch.__do__ === REMOVE_ENTIRE_ELEMENT) {
        var _childNodes = [el].filter(isElementNode);
        var _detachPromises = (0, _util.makePromises)('detached', _childNodes);

        if (el.parentNode) {
          triggerTransition('detached', _detachPromises, function (promises) {
            var callback = function callback() {
              el.parentNode.removeChild(el);
              (0, _util.unprotectElement)(patch.toRemove);
            };

            if (promises && promises.length) {
              Promise.all(promises).then(callback);
            } else {
              callback();
            }
          });
        } else {
          (0, _util.unprotectElement)(patch.toRemove);
        }
      }

      // Replace the entire Node.
      else if (patch.__do__ === REPLACE_ENTIRE_ELEMENT) {
          (function () {
            var allPromises = [];

            var attachedPromises = (0, _util.makePromises)('attached', [newEl].filter(isElementNode));

            var detachedPromises = (0, _util.makePromises)('detached', [oldEl].filter(isElementNode));

            var replacedPromises = (0, _util.makePromises)('replaced', [oldEl], newEl);

            // Add all the transition state promises into the main array, we'll use
            // them all to decide when to alter the DOM.
            triggerTransition('detached', detachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            triggerTransition('attached', attachedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
              attach({ vTree: patch.new, triggerTransition: triggerTransition, state: state });
            });

            triggerTransition('replaced', replacedPromises, function (promises) {
              allPromises.push.apply(allPromises, promises);
            });

            (0, _util.unprotectElement)(patch.old);

            // Reset the tree cache. TODO Look into this...
            _util.StateCache.set(newEl, {
              oldTree: patch.new,
              element: newEl
            });

            // Once all the promises have completed, invoke the action, if no
            // promises were added, this will be a synchronous operation.
            if (allPromises.length) {
              Promise.all(allPromises).then(function replaceEntireElement() {
                checkForMissingParent('replace', oldEl, patch);
                oldEl.parentNode.replaceChild(newEl, oldEl);
              }, function (ex) {
                return console.log(ex);
              });
            } else {
              checkForMissingParent('replace', oldEl, patch);

              oldEl.parentNode.replaceChild(newEl, oldEl);
            }
          })();
        }

        // Node manip.
        else if (patch.__do__ === MODIFY_ELEMENT) {
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

                if (!el.isConnected) {
                  console.warn('Rendering into a disconnected DOM node');
                }

                // Trigger transitions.
                var makeAttached = (0, _util.makePromises)('attached', toAttach);
                triggerTransition('attached', makeAttached);
              })();
            }

            // Remove.
            else if (oldEl && !newEl) {
                // Ensure we can remove the old DOM Node.
                checkForMissingParent('remove', oldEl, patch);

                var makeDetached = (0, _util.makePromises)('detached', [oldEl]);

                triggerTransition('detached', makeDetached, function (promises) {
                  var callback = function callback() {
                    if (oldEl.parentNode) {
                      oldEl.parentNode.removeChild(oldEl);
                    }

                    // And then empty out the entire contents.
                    oldEl.innerHTML = '';

                    (0, _util.unprotectElement)(patch.old);
                  };

                  if (promises && promises.length) {
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

                    // Append the element first, before doing the remove part of the
                    // replacement, this gives us the chance to animate in-and-out.
                    if (oldEl.nextSibling) {
                      oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
                    } else {
                      oldEl.parentNode.appendChild(newEl);
                    }

                    // Removed state for transitions API.
                    var allPromises = [];

                    var attachPromises = (0, _util.makePromises)('attached', [newEl].filter(isElementNode));

                    var detachPromises = (0, _util.makePromises)('detached', [oldEl].filter(isElementNode));

                    var replacePromises = (0, _util.makePromises)('replaced', [oldEl], newEl);

                    triggerTransition('replaced', replacePromises, function (promises) {
                      if (promises && promises.length) {
                        allPromises.push.apply(allPromises, promises);
                      }
                    });

                    triggerTransition('detached', detachPromises, function (promises) {
                      if (promises && promises.length) {
                        allPromises.push.apply(allPromises, promises);
                      }
                    });

                    triggerTransition('attached', attachPromises, function (promises) {
                      if (promises && promises.filter(Boolean).length) {
                        allPromises.push.apply(allPromises, promises);
                      }

                      attach({ vTree: patch.new, triggerTransition: triggerTransition, state: state });
                    });

                    // Once all the promises have completed, invoke the action, if no
                    // promises were added, this will be a synchronous operation.
                    if (allPromises.length) {
                      Promise.all(allPromises).then(function replaceElement() {
                        checkForMissingParent('replace', oldEl, patch);

                        oldEl.parentNode.replaceChild(newEl, oldEl);

                        (0, _util.unprotectElement)(patch.old);
                        (0, _util.protectElement)(patch.new);
                      }, function (ex) {
                        return console.log(ex);
                      });
                    } else {
                      checkForMissingParent('replace', oldEl, patch);

                      oldEl.parentNode.replaceChild(newEl, oldEl);

                      (0, _util.unprotectElement)(patch.old);
                      (0, _util.protectElement)(patch.new);
                    }
                  })();
                }
          }

          // Attribute manipulation.
          else if (patch.__do__ === MODIFY_ATTRIBUTE) {
              var attributes = patch.attributes;

              attributes.forEach(function (_ref2) {
                var oldAttr = _ref2.oldAttr,
                    newAttr = _ref2.newAttr;

                var name = newAttr ? newAttr.name : oldAttr.name;
                var value = (oldAttr ? oldAttr.value : undefined) || null;

                var attrChangePromises = (0, _util.makePromises)('attributeChanged', [el], name, value, newAttr ? newAttr.value : null);

                triggerTransition('attributeChanged', attrChangePromises, function (promises) {
                  var callback = function callback() {
                    // Always remove the old attribute, we never re-use it.
                    if (oldAttr) {
                      _util.PoolCache.get('attribute').unprotect(oldAttr);

                      // Remove the Virtual Tree Attribute from the element and memory.
                      if (!newAttr) {
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
                      _util.PoolCache.get('attribute').protect(newAttr);

                      // If not a dynamic type, set as an attribute, since it's a valid
                      // attribute value.
                      if (!isObject && !isFunction) {
                        if (newAttr.name) {
                          el.setAttribute(newAttr.name, (0, _util.decodeEntities)(newAttr.value));
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

                  if (promises && promises.length) {
                    Promise.all(promises).then(callback, function unhandledException() {});
                  } else {
                    callback();
                  }
                });
              });
            }

            // Text node manipulation.
            else if (patch.__do__ === CHANGE_TEXT) {
                var textChangePromises = (0, _util.makePromises)('textChanged', [el], el.nodeValue, patch.value);

                triggerTransition('textChanged', textChangePromises, function (promises) {
                  var callback = function callback() {
                    patch.element.nodeValue = (0, _util.decodeEntities)(patch.value);
                    el.nodeValue = patch.element.nodeValue;

                    if (el.parentNode) {
                      var nodeName = el.parentNode.nodeName.toLowerCase();

                      if (_util.blockText.has(nodeName)) {
                        el.parentNode.nodeValue = (0, _util.decodeEntities)(patch.element.nodeValue);
                      }
                    }
                  };

                  if (promises && promises.length) {
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

  return promises;
}

},{"../node":3,"../util":23}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = release;

var _caches = _dereq_('./util/caches');

var _memory = _dereq_('./util/memory');

function release(domNode) {
  // Try and find a state object for this DOM Node.
  var state = _caches.StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    (0, _memory.unprotectElement)(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  _caches.StateCache.delete(domNode);

  // Recycle all unprotected objects.
  (0, _memory.cleanMemory)();
}

},{"./util/caches":20,"./util/memory":24}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endAsPromise;
// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  var state = transaction.state,
      domNode = transaction.domNode,
      inner = transaction.options.inner,
      _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;

  // Cache the markup and text for the DOM node to allow for short-circuiting
  // future render transactions.

  state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
  state.previousText = domNode.textContent;

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

var _patch = _dereq_('../node/patch');

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  var state = transaction.state,
      patches = transaction.patches;


  state.mark('patch');

  // Set the Promises that were allocated so that rendering can be blocked
  // until they resolve.
  transaction.promises = (0, _patch.patchNode)(patches, state).filter(Boolean);

  state.mark('patch');
}

},{"../node/patch":5}],10:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconcileTrees;

var _memory = _dereq_('../util/memory');

var _parser = _dereq_('../util/parser');

var _tree = _dereq_('../tree');

var isArray = Array.isArray;
function reconcileTrees(transaction) {
  var state = transaction.state,
      domNode = transaction.domNode,
      markup = transaction.markup,
      options = transaction.options;
  var previousMarkup = state.previousMarkup,
      previousText = state.previousText;
  var inner = options.inner;


  state.mark('reconcile trees');

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
      (0, _memory.unprotectElement)(state.oldTree);
    }

    // Set the `oldTree` in the state as-well-as the transaction. This allows
    // it to persist with the DOM Node and also be easily available to
    // middleware and transaction tasks.
    state.oldTree = (0, _tree.createTree)(domNode);

    // We need to keep these objects around for comparisons.
    (0, _memory.protectElement)(state.oldTree);
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
    transaction.newTree = (0, _parser.parse)(markup, null, options).childNodes;
  }

  // Only create a document fragment for inner nodes if the user didn't already
  // pass an array. If they pass an array, `createTree` will auto convert to
  // a fragment.
  else if (options.inner && !isArray(newTree)) {
      transaction.newTree = (0, _tree.createTree)('#document-fragment', null, newTree);
    }

    // Everything else gets passed into `createTree` to be figured out.
    else {
        transaction.newTree = (0, _tree.createTree)(markup);
      }

  state.mark('reconcile trees');
}

},{"../tree":17,"../util/memory":24,"../util/parser":29}],11:[function(_dereq_,module,exports){
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

var _performance = _dereq_('../util/performance');

function shouldUpdate(transaction) {
  var markup = transaction.markup,
      state = transaction.state;


  state.mark('shouldUpdate');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  state.mark('shouldUpdate');
}

},{"../util/performance":25}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANGE_TEXT = exports.MODIFY_ATTRIBUTE = exports.MODIFY_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ELEMENT_CHILDREN = undefined;
exports.default = sync;

var _caches = _dereq_('../util/caches');

var _tree = _dereq_('../tree');

var _Array$prototype = Array.prototype,
    slice = _Array$prototype.slice,
    filter = _Array$prototype.filter;

// Patch actions.

var REMOVE_ELEMENT_CHILDREN = exports.REMOVE_ELEMENT_CHILDREN = -2;
var REMOVE_ENTIRE_ELEMENT = exports.REMOVE_ENTIRE_ELEMENT = -1;
var REPLACE_ENTIRE_ELEMENT = exports.REPLACE_ENTIRE_ELEMENT = 0;
var MODIFY_ELEMENT = exports.MODIFY_ELEMENT = 1;
var MODIFY_ATTRIBUTE = exports.MODIFY_ATTRIBUTE = 2;
var CHANGE_TEXT = exports.CHANGE_TEXT = 3;

var runCtor = function runCtor(vTree, oldMount) {
  var props = Object.freeze(Object.assign({}, vTree.attributes, {
    children: Object.freeze(vTree.childNodes)
  }));

  var instance = new vTree.nodeName(props);

  // Initial render.
  var newMount = instance.render();

  // Return a single Node or multiple nodes depending on the return value.
  instance.getDOMNode = function () {
    var node = oldMount || newMount;
    return Array.isArray(node) ? node.map(_caches.NodeCache.get) : _caches.NodeCache.get(node);
  };

  return Array.isArray(newMount) ? (0, _tree.createElement)('#document-fragment', null, newMount) : newMount;
};

function sync(transaction) {
  var state = transaction.state,
      newTree = transaction.newTree;


  state.mark('sync');
  transaction.patches = (0, _tree.syncTree)(state.oldTree, newTree, []);
  state.mark('sync');
}

},{"../tree":17,"../util/caches":20}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _caches = _dereq_('./util/caches');

var _memory = _dereq_('./util/memory');

var _performance = _dereq_('./util/performance');

var _tasks = _dereq_('./tasks');

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
      // Execute each "task" serially, passing the transaction as a baton that
      // can be used to share state across the tasks.
      return tasks.reduce(function (retVal, task, index) {
        // If aborted, don't execute any more tasks.
        if (transaction.aborted) {
          return retVal;
        }

        // Continue flow, so long as there was no return value, or it matches the
        // transaction.
        if (retVal === undefined || retVal === transaction) {
          return task(transaction);
        }

        // The last `returnValue` is what gets sent to the consumer. This
        // mechanism is crucial for the `abort`, if you want to modify the "flow"
        // that's fine, but you must ensure that your last task provides a
        // mechanism to know when the transaction completes. Something like
        // callbacks or a Promise.
        return retVal;
      }, transaction);
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


      _caches.MiddlewareCache.forEach(function (fn) {
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

    this.state = _caches.StateCache.get(domNode) || { mark: _performance.mark };

    this.tasks = options.tasks || [_tasks.schedule, _tasks.shouldUpdate, _tasks.reconcileTrees, _tasks.syncTrees, _tasks.patchNode, _tasks.endAsPromise];

    // Store calls to trigger after the transaction has ended.
    this._endedCallbacks = new Set();

    _caches.StateCache.set(domNode, this.state);
  }

  _createClass(Transaction, [{
    key: 'start',
    value: function start() {
      Transaction.assert(this);

      var domNode = this.domNode,
          mark = this.state.mark,
          tasks = this.tasks;


      var takeLastTask = tasks.pop();

      // Add middleware in as tasks.
      Transaction.invokeMiddleware(this);

      // Shadow DOM rendering...
      if (domNode && domNode.host) {
        mark(domNode.host.constructor.name + ' render');
      } else {
        mark('render');
      }

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
      Transaction.assert(this);

      var state = this.state;


      this.aborted = true;

      // Grab the last task in the flow and return, this task will be responsible
      // for calling `transaction.end`.
      return this.tasks[this.tasks.length - 1](this);
    }
  }, {
    key: 'end',
    value: function end() {
      Transaction.assert(this);

      var state = this.state,
          domNode = this.domNode,
          options = this.options;
      var inner = options.inner;


      this.completed = true;

      // Trigger all `onceEnded` callbacks, so that middleware can know the
      // transaction has ended.
      this._endedCallbacks.forEach(function (callback) {
        return callback();
      });
      this._endedCallbacks.clear();

      (0, _memory.cleanMemory)();

      state.mark('finalize');

      // Shadow DOM rendering...
      if (domNode && domNode.host) {
        (0, _performance.mark)(domNode.host.constructor.name + ' render');
      } else {
        (0, _performance.mark)('render');
      }

      // We are no longer rendering the previous transaction so set the state to
      // `false`.
      state.isRendering = false;

      // Try and render the next transaction if one has been saved.
      Transaction.renderNext(state);
    }
  }, {
    key: 'onceEnded',
    value: function onceEnded(callback) {
      this._endedCallbacks.add(callback);
    }
  }]);

  return Transaction;
}();

exports.default = Transaction;

},{"./tasks":8,"./util/caches":20,"./util/memory":24,"./util/performance":25}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;

var _caches = _dereq_('./util/caches');

// Available transition states.
var stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(function (stateName) {
  return _caches.TransitionCache.set(stateName, new Set());
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

  _caches.TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (!callback && stateName) {
    _caches.TransitionCache.get(stateName).clear();
  } else if (stateName && callback) {
    // Not a valid state name.
    if (stateNames.indexOf(stateName) === -1) {
      throw new Error('Invalid state name ' + stateName);
    }

    _caches.TransitionCache.get(stateName).delete(callback);
  } else {
    for (var _stateName in stateNames) {
      if (_caches.TransitionCache.has(_stateName)) {
        _caches.TransitionCache.get(_stateName).clear();
      }
    }
  }
}

},{"./util/caches":20}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createTree;

var _util = _dereq_('../util');

var assign = Object.assign;
var isArray = Array.isArray;
function createTree(input, attributes, childNodes) {
  var _arguments = arguments;

  if (arguments.length === 1) {
    // If the first argument is an array, we assume this is a DOM fragment and
    // the array are the childNodes.
    if (isArray(input)) {
      return createTree('#document-fragment', input.map(function (vTree) {
        return createTree(vTree);
      }));
    }

    // Crawl an HTML or SVG Element for attributes and children.
    if (typeof Element !== 'undefined' && input instanceof Element) {
      attributes = null;
      childNodes = null;

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
            childNodes[_i] = createTree(input.childNodes[_i]);
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
  }

  var entry = _util.Pool.get();
  var isTextNode = input === '#text';

  entry.key = '';
  entry.nodeName = String(input).toLowerCase();
  entry.rawNodeName = input;

  if (isTextNode) {
    var getValue = function getValue(attributes, childNodes) {
      var nodes = _arguments.length === 2 ? attributes : childNodes;
      return isArray(nodes) ? nodes.join('') : nodes;
    };

    var value = getValue(attributes, childNodes);

    entry.nodeType = 3;
    entry.nodeValue = (0, _util.escape)(String(value || ''));
    entry.attributes = null;
    entry.childNodes = null;

    return entry;
  }

  var getChildNodes = function getChildNodes(attributes, childNodes) {
    var nodes = _arguments.length === 2 ? attributes : childNodes;
    return nodes ? [].concat(nodes).map(function (node) {
      if (typeof node === 'string') {
        return createTree('#text', node);
      }

      return node;
    }) : null;
  };

  // Support Document Fragments and Shadow Roots, everything else is Element.
  entry.nodeType = input === '#document-fragment' ? 11 : 1;
  entry.nodeValue = '';
  entry.attributes = arguments.length === 2 ? null : attributes || null;
  entry.childNodes = getChildNodes(attributes, childNodes);

  // Set the key prop if passed as an attr.
  if (entry.attributes && entry.attributes.key) {
    entry.key = entry.attributes.key;
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
function syncTree(oldTree, newTree) {
  if (!oldTree) {
    throw new Error('Missing existing tree to sync from');
  }
  if (!newTree) {
    throw new Error('Missing new tree to sync into');
  }

  // Create new arrays for patches or use existing from a recursive call.
  var patches = arguments[2] || {
    ELEMENT: { INSERT: [], REMOVE: [], REPLACE: [], TEXT: [] },
    ATTRIBUTE: { SET: [], REMOVE: [] }
  };

  var ELEMENT = patches.ELEMENT,
      ATTRIBUTE = patches.ATTRIBUTE;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. The
  // exception is if the `newTree` is a document fragment / shadow dom.

  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // Shallow clone the `newTree` into the `oldTree`. We want to get the same
    // references/values inside here.
    Object.assign(oldTree, newTree);
    ELEMENT.REPLACE.push([oldTree, newTree]);
    return patches;
  }

  // If these trees are identical references, abort early. This will occur
  // when caching static VTrees.
  if (oldTree === newTree) {
    return patches;
  }

  // If both VTrees are text nodes then copy the value over.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    oldTree.nodeValue = newTree.nodeValue;
    ELEMENT.TEXT.push([oldTree, oldTree.nodeValue]);
    return patches;
  }

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  var hasOldKeys = oldTree.childNodes.some(function (vTree) {
    return vTree.key;
  });
  var hasNewKeys = hasOldKeys || newTree.childNodes.some(function (vTree) {
    return vTree.key;
  });
  var keys = new Map();

  // Build up the key caches for each set of children.
  if (hasOldKeys || hasNewKeys) {
    // Put the new `childNode` VTree's into the key cache for lookup.
    for (var i = 0; i < newTree.childNodes.length; i++) {
      var vTree = newTree.childNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        keys.add(vTree.key, vTree);
      }
    }
  }

  //

  return patches;
}

},{}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

var _caches = _dereq_('./util/caches');

function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  _caches.MiddlewareCache.add(middleware);

  // The unsubscribe method for the middleware.
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    _caches.MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe();
  };
}

},{"./util/caches":20}],20:[function(_dereq_,module,exports){
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

// Cache transition functions.
var TransitionCache = exports.TransitionCache = new Map();

},{}],21:[function(_dereq_,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decodeEntities;
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

Object.defineProperty(exports, 'protectElement', {
  enumerable: true,
  get: function get() {
    return _memory.protectElement;
  }
});
Object.defineProperty(exports, 'unprotectElement', {
  enumerable: true,
  get: function get() {
    return _memory.unprotectElement;
  }
});
Object.defineProperty(exports, 'cleanMemory', {
  enumerable: true,
  get: function get() {
    return _memory.cleanMemory;
  }
});

var _parser = _dereq_('./parser');

Object.defineProperty(exports, 'blockText', {
  enumerable: true,
  get: function get() {
    return _parser.blockText;
  }
});
Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _parser.parse;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./caches":20,"./decode-entities":21,"./escape":22,"./memory":24,"./parser":29,"./performance":25,"./pool":26,"./svg":27,"./transitions":28}],24:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;
exports.cleanMemory = cleanMemory;

var _pool = _dereq_('./pool');

var _pool2 = _interopRequireDefault(_pool);

var _caches = _dereq_('./caches');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memory = _pool2.default.memory,
    protect = _pool2.default.protect,
    unprotect = _pool2.default.unprotect;

/**
 * Ensures that an element is not recycled during a render cycle.
 *
 * @param element
 * @return element
 */

function protectElement(element) {
  protect(element);
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
  unprotect(element);
  element.childNodes.forEach(unprotectElement);
  _caches.NodeCache.delete(element);
  return element;
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
  // have a backing VTree, we can safely remove it from the cache.
  _caches.NodeCache.forEach(function (node, descriptor) {
    if (!memory.protected.has(descriptor)) {
      _caches.NodeCache.delete(descriptor);
    }
  });
}

},{"./caches":20,"./pool":26}],25:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = measure;
var marks = exports.marks = new Map();
var prefix = exports.prefix = 'diffHTML';

var wantsPerfChecks = location.search.includes('diff_perf');

function measure(name) {
  if (!wantsPerfChecks) {
    return;
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
}

},{}],26:[function(_dereq_,module,exports){
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
    childNodes: null,
    attributes: null
  });
}

// Cache VTree objects in a pool which is used to get
exports.default = {
  size: size,
  memory: memory,

  get: function get() {
    var value = memory.free.values().next().value || fill();
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

},{}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Namespace.
var namespace = exports.namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
var elements = exports.elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

},{}],28:[function(_dereq_,module,exports){
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

},{}],29:[function(_dereq_,module,exports){

},{}]},{},[2])(2)
});