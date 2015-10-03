(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = get;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodeMake = require('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

var _elementMake = require('../element/make');

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/element/get.js")

},{"../element/make":2,"../node/make":5}],2:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = make;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _svg = require('../svg');

var svg = _interopRequireWildcard(_svg);

var _nodeMake = require('../node/make');

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

  // Always set the node's value.
  if (descriptor.nodeValue) {
    element.textContent = descriptor.nodeValue;
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _nodeMake2['default'].nodes[descriptor.element] = element;

  return element;
}

module.exports = exports['default'];

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/element/make.js")

},{"../node/make":5,"../svg":9}],3:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }/**
 * Identifies an error with transitions.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TransitionStateError = (function (_Error) {
  _inherits(TransitionStateError, _Error);

  function TransitionStateError(message) {
    _classCallCheck(this, TransitionStateError);

    var error = _get(Object.getPrototypeOf(TransitionStateError.prototype), 'constructor', this).call(this);

    this.message = message;
    this.stack = error.stack || 'Browser doesn\'t support error stack traces.';
  }

  return TransitionStateError;
})(Error);

exports.TransitionStateError = TransitionStateError;

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/errors.js")

},{}],4:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.element = element;
exports.release = release;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.enableProllyfill = enableProllyfill;

var _nodePatch = require('./node/patch');

var _transitions = require('./transitions');

// We export the TransitionStateError constructor so that instanceof checks can
// be made by those publicly consuming this library.

var _errors = require('./errors');

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
 * @return
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
 * @return
 */

function element(element, newElement) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  (0, _nodePatch.patchNode)(element, newElement, options);
}

function release(element) {
  (0, _nodePatch.releaseNode)(element);
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
}

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/index.js")

},{"./errors":3,"./node/patch":6,"./transitions":10}],5:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = make;

var _utilPools = require('../util/pools');

var _utilMemory = require('../util/memory');

var pools = _utilPools.pools;
var protectElement = _utilMemory.protectElement;
var unprotectElement = _utilMemory.unprotectElement;

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/make.js")

},{"../util/memory":13,"../util/pools":15}],6:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  };var global = (function(){ return this; }).call(null);global.require['custom-event'] = require('custom-event');;var global = (function(){ return this; }).call(null);global.require['custom-event'] = require('custom-event');  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  };var global = (function(){ return this; }).call(null);global.require['custom-event'] = require('custom-event');'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.releaseNode = releaseNode;
exports.patchNode = patchNode;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _customEvent = require('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _workerCreate = require('../worker/create');

var _utilMemory = require('../util/memory');

var _make = require('./make');

var _make2 = _interopRequireDefault(_make);

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _utilPools = require('../util/pools');

var _utilParser = require('../util/parser');

var _utilBuffers = require('../util/buffers');

var buffers = _interopRequireWildcard(_utilBuffers);

var _patchesProcess = require('../patches/process');

var _patchesProcess2 = _interopRequireDefault(_patchesProcess);

// Cache prebuilt trees and lookup by element.
var TreeCache = new WeakMap();

/**
 * When the worker completes, clean up memory and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 * @return
 */
function completeWorkerRender(element, elementMeta) {
  return function (ev) {
    (0, _patchesProcess2['default'])(element, ev);

    elementMeta._innerHTML = element.innerHTML;
    elementMeta._outerHTML = element.outerHTML;
    elementMeta._textContent = element.textContent;

    (0, _utilMemory.cleanMemory)();

    elementMeta.isRendering = false;
    elementMeta.hasRenderedViaWorker = true;

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new _customEvent2['default']('renderComplete'));

    if (elementMeta.renderBuffer) {
      var nextRender = elementMeta.renderBuffer;
      elementMeta.renderBuffer = undefined;

      patchNode(element, nextRender.newHTML, nextRender.options);
    }
  };
}

/**
 * Release's the allocated objects and recycles internal memory.
 *
 * @param element
 */

function releaseNode(element) {
  var elementMeta = TreeCache.get(element) || {};

  // If there is a worker associated with this element, then kill it.
  if (elementMeta.worker) {
    elementMeta.worker.terminate();
  }

  // If there was a tree set up, recycle the memory allocated for it.
  if (elementMeta.oldTree) {
    (0, _utilMemory.unprotectElement)(elementMeta.oldTree);
    (0, _utilMemory.cleanMemory)();
  }

  TreeCache['delete'](element);
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

  var elementMeta = TreeCache.get(element) || {};
  var newOld = false;

  // Always ensure the most up-to-date meta object is stored.
  TreeCache.set(element, elementMeta);

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
    newOld = true;

    if (elementMeta.oldTree) {
      (0, _utilMemory.unprotectElement)(elementMeta.oldTree);
      (0, _utilMemory.cleanMemory)();
    }

    elementMeta.oldTree = (0, _make2['default'])(element, true);
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && _workerCreate.hasWorker && elementMeta.hasRendered) {
    // Create a worker for this element.
    var worker = elementMeta.worker = elementMeta.worker || (0, _workerCreate.create)();

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

        (0, _utilMemory.unprotectElement)(elementMeta.oldTree);

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

    (0, _utilMemory.cleanMemory)();

    // Clean out the patches array.
    data.length = 0;

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new _customEvent2['default']('renderComplete'));
  }
}

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/patch.js")

},{"../patches/process":8,"../util/buffers":11,"../util/memory":13,"../util/parser":14,"../util/pools":15,"../worker/create":17,"./make":5,"./sync":7,"custom-event":19}],7:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = sync;

var _utilPools = require('../util/pools');

var _utilMemory = require('../util/memory');

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/sync.js")

},{"../util/memory":13,"../util/pools":15}],8:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = process;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _transitions = require('../transitions');

var _utilPools = require('../util/pools');

var _utilDecode = require('../util/decode');

var _utilDecode2 = _interopRequireDefault(_utilDecode);

var _elementGet = require('../element/get');

var _elementGet2 = _interopRequireDefault(_elementGet);

var _nodeMake = require('../node/make');

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/patches/process.js")

},{"../element/get":1,"../node/make":5,"../transitions":10,"../util/decode":12,"../util/pools":15}],9:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }// List of SVG elements.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];

exports.elements = elements;
// Namespace.
var namespace = 'http://www.w3.org/2000/svg';
exports.namespace = namespace;

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/svg.js")

},{}],10:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }/**
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/transitions.js")

},{}],11:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }// Create a default buffer at length 1024.
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/buffers.js")

},{}],12:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/decode.js")

},{}],13:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.protectElement = protectElement;
exports.unprotectElement = unprotectElement;
exports.cleanMemory = cleanMemory;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilPools = require('../util/pools');

var _nodeMake = require('../node/make');

var _nodeMake2 = _interopRequireDefault(_nodeMake);

var pools = _utilPools.pools;
var makeNode = _nodeMake2['default'];

function protectElement(element) {
  pools.elementObject.protect(element);

  element.childNodes.forEach(protectElement);
  element.attributes.forEach(pools.attributeObject.protect, pools.attributeObject);
}

function unprotectElement(element) {
  element.childNodes.forEach(unprotectElement);
  element.attributes.forEach(pools.attributeObject.unprotect, pools.attributeObject);

  pools.elementObject.unprotect(element);
}

function cleanMemory() {
  // Free all memory after each iteration.
  pools.attributeObject.freeAll();
  pools.elementObject.freeAll();

  // Empty out the `make.nodes` if on main thread.
  if (typeof makeNode !== 'undefined') {
    for (var uuid in makeNode.nodes) {
      // If this is not a protected uuid, remove it.
      if (!pools.elementObject._uuid[uuid]) {
        makeNode.nodes[uuid] = undefined;
      }
    }
  }
}

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/memory.js")

},{"../node/make":5,"../util/pools":15}],14:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parseHTML = parseHTML;
exports.makeParser = makeParser;

var _pools2 = require('./pools');

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/parser.js")

},{"./pools":15}],15:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createPool = createPool;
exports.initializePools = initializePools;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _uuid2 = require('./uuid');

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
    },

    unprotect: function unprotect(value) {
      var idx = _protect.indexOf(value);
      var freeLength = _free.length;

      if (idx !== -1) {
        if (freeLength < size) {
          var obj = _protect.splice(idx, 1)[0];

          if (obj) {
            _free.push(obj);
          }
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/pools.js")

},{"./uuid":16}],16:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }/**
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/uuid.js")

},{}],17:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilUuid = require('../util/uuid');

var _utilUuid2 = _interopRequireDefault(_utilUuid);

var _utilBuffers = require('../util/buffers');

var buffers = _interopRequireWildcard(_utilBuffers);

var _utilPools = require('../util/pools');

var _utilParser = require('../util/parser');

var _utilMemory = require('../util/memory');

var _nodeSync = require('../node/sync');

var _nodeSync2 = _interopRequireDefault(_nodeSync);

var _source = require('./source');

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
    _utilMemory.protectElement, _utilMemory.unprotectElement, _utilMemory.cleanMemory,

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/worker/create.js")

},{"../node/sync":7,"../util/buffers":11,"../util/memory":13,"../util/parser":14,"../util/pools":15,"../util/uuid":16,"./source":18}],18:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

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
    cleanMemory();

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

module.exports = exports['default'];

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/worker/source.js")

},{}],19:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }
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
;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/node_modules/custom-event/index.js")

},{}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9lbGVtZW50L2dldC5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2VsZW1lbnQvbWFrZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2Vycm9ycy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2luZGV4LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9tYWtlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9wYXRjaC5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL25vZGUvc3luYy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3BhdGNoZXMvcHJvY2Vzcy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3N2Zy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3RyYW5zaXRpb25zLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9idWZmZXJzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9kZWNvZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL21lbW9yeS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3V0aWwvcGFyc2VyLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9wb29scy5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3V0aWwvdXVpZC5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3dvcmtlci9jcmVhdGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi93b3JrZXIvc291cmNlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9ub2RlX21vZHVsZXMvY3VzdG9tLWV2ZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzdSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdldDtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX25vZGVNYWtlID0gcmVxdWlyZSgnLi4vbm9kZS9tYWtlJyk7XG5cbnZhciBfbm9kZU1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZU1ha2UpO1xuXG52YXIgX2VsZW1lbnRNYWtlID0gcmVxdWlyZSgnLi4vZWxlbWVudC9tYWtlJyk7XG5cbnZhciBfZWxlbWVudE1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudE1ha2UpO1xuXG4vKipcbiAqIFRha2VzIGluIGFuIGVsZW1lbnQgcmVmZXJlbmNlIGFuZCByZXNvbHZlIGl0IHRvIGEgdXVpZCBhbmQgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIHJlZiAtIEVsZW1lbnQgZGVzY3JpcHRvclxuICogQHJldHVybiB7T2JqZWN0fSBjb250YWluaW5nIHRoZSB1dWlkIGFuZCBET00gbm9kZS5cbiAqL1xuXG5mdW5jdGlvbiBnZXQocmVmKSB7XG4gIHZhciB1dWlkID0gcmVmLmVsZW1lbnQgfHwgcmVmO1xuICB2YXIgZWxlbWVudCA9IF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1t1dWlkXSB8fCAoMCwgX2VsZW1lbnRNYWtlMlsnZGVmYXVsdCddKShyZWYpO1xuXG4gIHJldHVybiB7IGVsZW1lbnQ6IGVsZW1lbnQsIHV1aWQ6IHV1aWQgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2WjJWMExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzNGQ1FWTjNRaXhIUVVGSE96czdPM2RDUVZST0xHTkJRV003T3pzN01rSkJRMWdzYVVKQlFXbENPenM3T3pzN096czdPenRCUVZFeFFpeFRRVUZUTEVkQlFVY3NRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRMMElzVFVGQlNTeEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRTlCUVU4c1NVRkJTU3hIUVVGSExFTkJRVU03UVVGRE9VSXNUVUZCU1N4UFFVRlBMRWRCUVVjc2MwSkJRVk1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRGhDUVVGWkxFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVjJSQ3hUUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZRTEU5QlFVOHNSVUZCUlN4SlFVRkpMRVZCUVVvc1NVRkJTU3hGUVVGRkxFTkJRVU03UTBGRE1VSWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZaV3hsYldWdWRDOW5aWFF1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ2JXRnJaVTV2WkdVZ1puSnZiU0FuTGk0dmJtOWtaUzl0WVd0bEp6dGNibWx0Y0c5eWRDQnRZV3RsUld4bGJXVnVkQ0JtY205dElDY3VMaTlsYkdWdFpXNTBMMjFoYTJVbk8xeHVYRzR2S2lwY2JpQXFJRlJoYTJWeklHbHVJR0Z1SUdWc1pXMWxiblFnY21WbVpYSmxibU5sSUdGdVpDQnlaWE52YkhabElHbDBJSFJ2SUdFZ2RYVnBaQ0JoYm1RZ1JFOU5JRzV2WkdVdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUhKbFppQXRJRVZzWlcxbGJuUWdaR1Z6WTNKcGNIUnZjbHh1SUNvZ1FISmxkSFZ5YmlCN1QySnFaV04wZlNCamIyNTBZV2x1YVc1bklIUm9aU0IxZFdsa0lHRnVaQ0JFVDAwZ2JtOWtaUzVjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z1oyVjBLSEpsWmlrZ2UxeHVJQ0JzWlhRZ2RYVnBaQ0E5SUhKbFppNWxiR1Z0Wlc1MElIeDhJSEpsWmp0Y2JpQWdiR1YwSUdWc1pXMWxiblFnUFNCdFlXdGxUbTlrWlM1dWIyUmxjMXQxZFdsa1hTQjhmQ0J0WVd0bFJXeGxiV1Z1ZENoeVpXWXBPMXh1WEc0Z0lISmxkSFZ5YmlCN0lHVnNaVzFsYm5Rc0lIVjFhV1FnZlR0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYWtlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmpbJ2RlZmF1bHQnXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbnZhciBfc3ZnID0gcmVxdWlyZSgnLi4vc3ZnJyk7XG5cbnZhciBzdmcgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfc3ZnKTtcblxudmFyIF9ub2RlTWFrZSA9IHJlcXVpcmUoJy4uL25vZGUvbWFrZScpO1xuXG52YXIgX25vZGVNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVNYWtlKTtcblxuLyoqXG4gKiBUYWtlcyBpbiBhIHZpcnR1YWwgZGVzY3JpcHRvciBhbmQgY3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQuIFNldCdzIHRoZSBlbGVtZW50XG4gKiBpbnRvIHRoZSBjYWNoZS5cbiAqXG4gKiBAcGFyYW0gZGVzY3JpcHRvclxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlKGRlc2NyaXB0b3IpIHtcbiAgdmFyIGVsZW1lbnQgPSBudWxsO1xuICB2YXIgaXNTdmcgPSBmYWxzZTtcblxuICBpZiAoZGVzY3JpcHRvci5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkZXNjcmlwdG9yLm5vZGVWYWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHN2Zy5lbGVtZW50cy5pbmRleE9mKGRlc2NyaXB0b3Iubm9kZU5hbWUpID4gLTEpIHtcbiAgICAgIGlzU3ZnID0gdHJ1ZTtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnLm5hbWVzcGFjZSwgZGVzY3JpcHRvci5ub2RlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRlc2NyaXB0b3Iubm9kZU5hbWUpO1xuICAgIH1cblxuICAgIGlmIChkZXNjcmlwdG9yLmF0dHJpYnV0ZXMgJiYgZGVzY3JpcHRvci5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXNjcmlwdG9yLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IGRlc2NyaXB0b3IuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0b3IuY2hpbGROb2RlcyAmJiBkZXNjcmlwdG9yLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlc2NyaXB0b3IuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG1ha2UoZGVzY3JpcHRvci5jaGlsZE5vZGVzW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWx3YXlzIHNldCB0aGUgbm9kZSdzIHZhbHVlLlxuICBpZiAoZGVzY3JpcHRvci5ub2RlVmFsdWUpIHtcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gZGVzY3JpcHRvci5ub2RlVmFsdWU7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIG5vZGVzIGNhY2hlIHVzaW5nIHRoZSBkZXNpZ25hdGVkIHV1aWQgYXMgdGhlIGxvb2t1cCBrZXkuXG4gIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tkZXNjcmlwdG9yLmVsZW1lbnRdID0gZWxlbWVudDtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2YldGclpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRlZkMElzU1VGQlNUczdPenM3TzIxQ1FWWlFMRkZCUVZFN08wbEJRV3BDTEVkQlFVYzdPM2RDUVVOTkxHTkJRV003T3pzN096czdPenM3T3p0QlFWTndRaXhUUVVGVExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVTdRVUZEZGtNc1RVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyNUNMRTFCUVVrc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6czdRVUZGYkVJc1RVRkJTU3hWUVVGVkxFTkJRVU1zVVVGQlVTeExRVUZMTEU5QlFVOHNSVUZCUlR0QlFVTnVReXhYUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UjBGRGVrUXNUVUZEU1R0QlFVTklMRkZCUVVrc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlEyeEVMRmRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRFlpeGhRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMR1ZCUVdVc1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eEZRVUZGTEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRMUVVONFJTeE5RVU5KTzBGQlEwZ3NZVUZCVHl4SFFVRkhMRkZCUVZFc1EwRkJReXhoUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMHRCUTNaRU96dEJRVVZFTEZGQlFVa3NWVUZCVlN4RFFVRkRMRlZCUVZVc1NVRkJTU3hWUVVGVkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTjZSQ3hYUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRja1FzV1VGQlNTeFRRVUZUTEVkQlFVY3NWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU42UXl4bFFVRlBMRU5CUVVNc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wOUJRM1pFTzB0QlEwWTdPMEZCUlVRc1VVRkJTU3hWUVVGVkxFTkJRVU1zVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM3BFTEZkQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU55UkN4bFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFBRVU55UkR0TFFVTkdPMGRCUTBZN096dEJRVWRFTEUxQlFVa3NWVUZCVlN4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVONFFpeFhRVUZQTEVOQlFVTXNWMEZCVnl4SFFVRkhMRlZCUVZVc1EwRkJReXhUUVVGVExFTkJRVU03UjBGRE5VTTdPenRCUVVkRUxIZENRVUZUTEV0QlFVc3NRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZET3p0QlFVVTNReXhUUVVGUExFOUJRVThzUTBGQlF6dERRVU5vUWlJc0ltWnBiR1VpT2lJdmFHOXRaUzkwYVcwdloybDBMMlJwWm1ab2RHMXNMMnhwWWk5bGJHVnRaVzUwTDIxaGEyVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnS2lCaGN5QnpkbWNnWm5KdmJTQW5MaTR2YzNabkp6dGNibWx0Y0c5eWRDQnRZV3RsVG05a1pTQm1jbTl0SUNjdUxpOXViMlJsTDIxaGEyVW5PMXh1WEc0dktpcGNiaUFxSUZSaGEyVnpJR2x1SUdFZ2RtbHlkSFZoYkNCa1pYTmpjbWx3ZEc5eUlHRnVaQ0JqY21WaGRHVnpJR0Z1SUVoVVRVd2daV3hsYldWdWRDNGdVMlYwSjNNZ2RHaGxJR1ZzWlcxbGJuUmNiaUFxSUdsdWRHOGdkR2hsSUdOaFkyaGxMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQmtaWE5qY21sd2RHOXlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4dUlDb3ZYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpQnRZV3RsS0dSbGMyTnlhWEIwYjNJcElIdGNiaUFnYkdWMElHVnNaVzFsYm5RZ1BTQnVkV3hzTzF4dUlDQnNaWFFnYVhOVGRtY2dQU0JtWVd4elpUdGNibHh1SUNCcFppQW9aR1Z6WTNKcGNIUnZjaTV1YjJSbFRtRnRaU0E5UFQwZ0p5TjBaWGgwSnlrZ2UxeHVJQ0FnSUdWc1pXMWxiblFnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZVWlhoMFRtOWtaU2hrWlhOamNtbHdkRzl5TG01dlpHVldZV3gxWlNrN1hHNGdJSDFjYmlBZ1pXeHpaU0I3WEc0Z0lDQWdhV1lnS0hOMlp5NWxiR1Z0Wlc1MGN5NXBibVJsZUU5bUtHUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVXBJRDRnTFRFcElIdGNiaUFnSUNBZ0lHbHpVM1puSUQwZ2RISjFaVHRjYmlBZ0lDQWdJR1ZzWlcxbGJuUWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MFRsTW9jM1puTG01aGJXVnpjR0ZqWlN3Z1pHVnpZM0pwY0hSdmNpNXViMlJsVG1GdFpTazdYRzRnSUNBZ2ZWeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb1pHVnpZM0pwY0hSdmNpNXViMlJsVG1GdFpTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR1JsYzJOeWFYQjBiM0l1WVhSMGNtbGlkWFJsY3lBbUppQmtaWE5qY21sd2RHOXlMbUYwZEhKcFluVjBaWE11YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUdSbGMyTnlhWEIwYjNJdVlYUjBjbWxpZFhSbGN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnSUNCc1pYUWdZWFIwY21saWRYUmxJRDBnWkdWelkzSnBjSFJ2Y2k1aGRIUnlhV0oxZEdWelcybGRPMXh1SUNBZ0lDQWdJQ0JsYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNoaGRIUnlhV0oxZEdVdWJtRnRaU3dnWVhSMGNtbGlkWFJsTG5aaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvWkdWelkzSnBjSFJ2Y2k1amFHbHNaRTV2WkdWeklDWW1JR1JsYzJOeWFYQjBiM0l1WTJocGJHUk9iMlJsY3k1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z1pHVnpZM0pwY0hSdmNpNWphR2xzWkU1dlpHVnpMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5RdVlYQndaVzVrUTJocGJHUW9iV0ZyWlNoa1pYTmpjbWx3ZEc5eUxtTm9hV3hrVG05a1pYTmJhVjBwS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdkx5QkJiSGRoZVhNZ2MyVjBJSFJvWlNCdWIyUmxKM01nZG1Gc2RXVXVYRzRnSUdsbUlDaGtaWE5qY21sd2RHOXlMbTV2WkdWV1lXeDFaU2tnZTF4dUlDQWdJR1ZzWlcxbGJuUXVkR1Y0ZEVOdmJuUmxiblFnUFNCa1pYTmpjbWx3ZEc5eUxtNXZaR1ZXWVd4MVpUdGNiaUFnZlZ4dVhHNGdJQzh2SUVGa1pDQjBieUIwYUdVZ2JtOWtaWE1nWTJGamFHVWdkWE5wYm1jZ2RHaGxJR1JsYzJsbmJtRjBaV1FnZFhWcFpDQmhjeUIwYUdVZ2JHOXZhM1Z3SUd0bGVTNWNiaUFnYldGclpVNXZaR1V1Ym05a1pYTmJaR1Z6WTNKcGNIUnZjaTVsYkdWdFpXNTBYU0E5SUdWc1pXMWxiblE3WEc1Y2JpQWdjbVYwZFhKdUlHVnNaVzFsYm5RN1hHNTlYRzRpWFgwPSIsIi8qKlxuICogSWRlbnRpZmllcyBhbiBlcnJvciB3aXRoIHRyYW5zaXRpb25zLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHsgdmFyIF9hZ2FpbiA9IHRydWU7IF9mdW5jdGlvbjogd2hpbGUgKF9hZ2FpbikgeyB2YXIgb2JqZWN0ID0gX3gsIHByb3BlcnR5ID0gX3gyLCByZWNlaXZlciA9IF94MzsgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDsgX2FnYWluID0gZmFsc2U7IGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyBfeCA9IHBhcmVudDsgX3gyID0gcHJvcGVydHk7IF94MyA9IHJlY2VpdmVyOyBfYWdhaW4gPSB0cnVlOyBjb250aW51ZSBfZnVuY3Rpb247IH0gfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgVHJhbnNpdGlvblN0YXRlRXJyb3IgPSAoZnVuY3Rpb24gKF9FcnJvcikge1xuICBfaW5oZXJpdHMoVHJhbnNpdGlvblN0YXRlRXJyb3IsIF9FcnJvcik7XG5cbiAgZnVuY3Rpb24gVHJhbnNpdGlvblN0YXRlRXJyb3IobWVzc2FnZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc2l0aW9uU3RhdGVFcnJvcik7XG5cbiAgICB2YXIgZXJyb3IgPSBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihUcmFuc2l0aW9uU3RhdGVFcnJvci5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgJ0Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZXJyb3Igc3RhY2sgdHJhY2VzLic7XG4gIH1cblxuICByZXR1cm4gVHJhbnNpdGlvblN0YXRlRXJyb3I7XG59KShFcnJvcik7XG5cbmV4cG9ydHMuVHJhbnNpdGlvblN0YXRlRXJyb3IgPSBUcmFuc2l0aW9uU3RhdGVFcnJvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMlZ5Y205eWN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN1NVRkhZU3h2UWtGQmIwSTdXVUZCY0VJc2IwSkJRVzlDT3p0QlFVTndRaXhYUVVSQkxHOUNRVUZ2UWl4RFFVTnVRaXhQUVVGUExFVkJRVVU3TUVKQlJGWXNiMEpCUVc5Q096dEJRVVUzUWl4UlFVRkpMRXRCUVVzc09FSkJSa0VzYjBKQlFXOUNMRFJEUVVWV0xFTkJRVU03TzBGQlJYQkNMRkZCUVVrc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETzBGQlEzWkNMRkZCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NTVUZCU1N3NFEwRkJPRU1zUTBGQlF6dEhRVU0xUlRzN1UwRk9WU3h2UWtGQmIwSTdSMEZCVXl4TFFVRkxJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMlZ5Y205eWN5NXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nU1dSbGJuUnBabWxsY3lCaGJpQmxjbkp2Y2lCM2FYUm9JSFJ5WVc1emFYUnBiMjV6TGx4dUlDb3ZYRzVsZUhCdmNuUWdZMnhoYzNNZ1ZISmhibk5wZEdsdmJsTjBZWFJsUlhKeWIzSWdaWGgwWlc1a2N5QkZjbkp2Y2lCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0cxbGMzTmhaMlVwSUh0Y2JpQWdJQ0JzWlhRZ1pYSnliM0lnUFNCemRYQmxjaWdwTzF4dVhHNGdJQ0FnZEdocGN5NXRaWE56WVdkbElEMGdiV1Z6YzJGblpUdGNiaUFnSUNCMGFHbHpMbk4wWVdOcklEMGdaWEp5YjNJdWMzUmhZMnNnZkh3Z0owSnliM2R6WlhJZ1pHOWxjMjVjWENkMElITjFjSEJ2Y25RZ1pYSnliM0lnYzNSaFkyc2dkSEpoWTJWekxpYzdYRzRnSUgxY2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm91dGVySFRNTCA9IG91dGVySFRNTDtcbmV4cG9ydHMuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuZXhwb3J0cy5lbGVtZW50ID0gZWxlbWVudDtcbmV4cG9ydHMucmVsZWFzZSA9IHJlbGVhc2U7XG5leHBvcnRzLmFkZFRyYW5zaXRpb25TdGF0ZSA9IGFkZFRyYW5zaXRpb25TdGF0ZTtcbmV4cG9ydHMucmVtb3ZlVHJhbnNpdGlvblN0YXRlID0gcmVtb3ZlVHJhbnNpdGlvblN0YXRlO1xuZXhwb3J0cy5lbmFibGVQcm9sbHlmaWxsID0gZW5hYmxlUHJvbGx5ZmlsbDtcblxudmFyIF9ub2RlUGF0Y2ggPSByZXF1aXJlKCcuL25vZGUvcGF0Y2gnKTtcblxudmFyIF90cmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMnKTtcblxuLy8gV2UgZXhwb3J0IHRoZSBUcmFuc2l0aW9uU3RhdGVFcnJvciBjb25zdHJ1Y3RvciBzbyB0aGF0IGluc3RhbmNlb2YgY2hlY2tzIGNhblxuLy8gYmUgbWFkZSBieSB0aG9zZSBwdWJsaWNseSBjb25zdW1pbmcgdGhpcyBsaWJyYXJ5LlxuXG52YXIgX2Vycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVHJhbnNpdGlvblN0YXRlRXJyb3InLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yO1xuICB9XG59KTtcblxuLyoqXG4gKiBVc2VkIHRvIGRpZmYgdGhlIG91dGVySFRNTCBjb250ZW50cyBvZiB0aGUgcGFzc2VkIGVsZW1lbnQgd2l0aCB0aGUgbWFya3VwXG4gKiBjb250ZW50cy4gIFZlcnkgdXNlZnVsIGZvciBhcHBseWluZyBhIGdsb2JhbCBkaWZmIG9uIHRoZVxuICogYGRvY3VtZW50LmRvY3VtZW50RWxlbWVudGAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBtYXJrdXA9JydcbiAqIEBwYXJhbSBvcHRpb25zPXt9XG4gKi9cblxuZnVuY3Rpb24gb3V0ZXJIVE1MKGVsZW1lbnQpIHtcbiAgdmFyIG1hcmt1cCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/ICcnIDogYXJndW1lbnRzWzFdO1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG4gIG9wdGlvbnMuaW5uZXIgPSBmYWxzZTtcbiAgKDAsIF9ub2RlUGF0Y2gucGF0Y2hOb2RlKShlbGVtZW50LCBtYXJrdXAsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gZGlmZiB0aGUgaW5uZXJIVE1MIGNvbnRlbnRzIG9mIHRoZSBwYXNzZWQgZWxlbWVudCB3aXRoIHRoZSBtYXJrdXBcbiAqIGNvbnRlbnRzLiAgVGhpcyBpcyB1c2VmdWwgd2l0aCBsaWJyYXJpZXMgbGlrZSBCYWNrYm9uZSB0aGF0IHJlbmRlciBWaWV3c1xuICogaW50byBlbGVtZW50IGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG1hcmt1cD0nJ1xuICogQHBhcmFtIG9wdGlvbnM9e31cbiAqIEByZXR1cm5cbiAqL1xuXG5mdW5jdGlvbiBpbm5lckhUTUwoZWxlbWVudCkge1xuICB2YXIgbWFya3VwID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gJycgOiBhcmd1bWVudHNbMV07XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgb3B0aW9ucy5pbm5lciA9IHRydWU7XG4gICgwLCBfbm9kZVBhdGNoLnBhdGNoTm9kZSkoZWxlbWVudCwgbWFya3VwLCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIGRpZmYgdHdvIGVsZW1lbnRzLiAgVGhlIGBpbm5lcmAgQm9vbGVhbiBwcm9wZXJ0eSBjYW4gYmUgc3BlY2lmaWVkIGluXG4gKiB0aGUgb3B0aW9ucyB0byBzZXQgaW5uZXJIVE1MXFxvdXRlckhUTUwgYmVoYXZpb3IuICBCeSBkZWZhdWx0IGl0IGlzXG4gKiBvdXRlckhUTUwuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBuZXdFbGVtZW50XG4gKiBAcGFyYW0gb3B0aW9ucz17fVxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIGVsZW1lbnQoZWxlbWVudCwgbmV3RWxlbWVudCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG4gICgwLCBfbm9kZVBhdGNoLnBhdGNoTm9kZSkoZWxlbWVudCwgbmV3RWxlbWVudCwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbGVhc2UoZWxlbWVudCkge1xuICAoMCwgX25vZGVQYXRjaC5yZWxlYXNlTm9kZSkoZWxlbWVudCk7XG59XG5cbi8qKlxuICogQWRkcyBhIGdsb2JhbCB0cmFuc2l0aW9uIGxpc3RlbmVyLiAgV2l0aCBtYW55IGVsZW1lbnRzIHRoaXMgY291bGQgYmUgYW5cbiAqIGV4cGVuc2l2ZSBvcGVyYXRpb24sIHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGxpc3RlbmVycyBhZGRlZCBpZiB5b3UncmVcbiAqIGNvbmNlcm5lZCBhYm91dCBwZXJmb3JtYW5jZS5cbiAqXG4gKiBTaW5jZSB0aGUgY2FsbGJhY2sgdHJpZ2dlcnMgd2l0aCB2YXJpb3VzIGVsZW1lbnRzLCBtb3N0IG9mIHdoaWNoIHlvdVxuICogcHJvYmFibHkgZG9uJ3QgY2FyZSBhYm91dCwgeW91J2xsIHdhbnQgdG8gZmlsdGVyLiAgQSBnb29kIHdheSBvZiBmaWx0ZXJpbmdcbiAqIGlzIHRvIHVzZSB0aGUgRE9NIGBtYXRjaGVzYCBtZXRob2QuICBJdCdzIGZhaXJseSB3ZWxsIHN1cHBvcnRlZFxuICogKGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD1tYXRjaGVzc2VsZWN0b3IpIGFuZCBtYXkgc3VpdCBtYW55IHByb2plY3RzLiAgSWZcbiAqIHlvdSBuZWVkIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCBjb25zaWRlciB1c2luZyBqUXVlcnkncyBgaXNgLlxuICpcbiAqIFlvdSBjYW4gZG8gZnVuLCBoaWdobHkgc3BlY2lmaWMsIGZpbHRlcnM6XG4gKlxuICogYWRkVHJhbnNpdGlvblN0YXRlKCdhdHRhY2hlZCcsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAqICAgLy8gRmFkZSBpbiB0aGUgbWFpbiBjb250YWluZXIgYWZ0ZXIgaXQncyBhZGRlZC5cbiAqICAgaWYgKGVsZW1lbnQubWF0Y2hlcygnYm9keSBtYWluLmNvbnRhaW5lcicpKSB7XG4gKiAgICAgJChlbGVtZW50KS5zdG9wKHRydWUsIHRydWUpLmZhZGVJbigpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAcGFyYW0gc3RhdGUgLSBTdHJpbmcgbmFtZSB0aGF0IG1hdGNoZXMgd2hhdCdzIGF2YWlsYWJsZSBpbiB0aGVcbiAqIGRvY3VtZW50YXRpb24gYWJvdmUuXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZWNlaXZlIHRoZSBtYXRjaGluZyBlbGVtZW50cy5cbiAqL1xuXG5mdW5jdGlvbiBhZGRUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gIGlmICghc3RhdGUpIHtcbiAgICB0aHJvdyBuZXcgX2Vycm9ycy5UcmFuc2l0aW9uU3RhdGVFcnJvcignTWlzc2luZyB0cmFuc2l0aW9uIHN0YXRlIG5hbWUnKTtcbiAgfVxuXG4gIGlmICghY2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgX2Vycm9ycy5UcmFuc2l0aW9uU3RhdGVFcnJvcignTWlzc2luZyB0cmFuc2l0aW9uIHN0YXRlIGNhbGxiYWNrJyk7XG4gIH1cblxuICAvLyBOb3QgYSB2YWxpZCBzdGF0ZSBuYW1lLlxuICBpZiAoT2JqZWN0LmtleXMoX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXMpLmluZGV4T2Yoc3RhdGUpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yKCdJbnZhbGlkIHN0YXRlIG5hbWU6ICcgKyBzdGF0ZSk7XG4gIH1cblxuICBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlc1tzdGF0ZV0ucHVzaChjYWxsYmFjayk7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhIGdsb2JhbCB0cmFuc2l0aW9uIGxpc3RlbmVyLlxuICpcbiAqIFdoZW4gaW52b2tlZCB3aXRoIG5vIGFyZ3VtZW50cywgdGhpcyBtZXRob2Qgd2lsbCByZW1vdmUgYWxsIHRyYW5zaXRpb25cbiAqIGNhbGxiYWNrcy4gIFdoZW4gaW52b2tlZCB3aXRoIHRoZSBuYW1lIGFyZ3VtZW50IGl0IHdpbGwgcmVtb3ZlIGFsbFxuICogdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFja3MgbWF0Y2hpbmcgdGhlIG5hbWUsIGFuZCBzbyBvbiBmb3IgdGhlIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSBzdGF0ZSAtIFN0cmluZyBuYW1lIHRoYXQgbWF0Y2hlcyB3aGF0J3MgYXZhaWxhYmxlIGluIHRoZVxuICogZG9jdW1lbnRhdGlvbiBhYm92ZS5cbiAqIEBwYXJhbSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlY2VpdmUgdGhlIG1hdGNoaW5nIGVsZW1lbnRzLlxuICovXG5cbmZ1bmN0aW9uIHJlbW92ZVRyYW5zaXRpb25TdGF0ZShzdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFjYWxsYmFjayAmJiBzdGF0ZSkge1xuICAgIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5sZW5ndGggPSAwO1xuICB9IGVsc2UgaWYgKHN0YXRlICYmIGNhbGxiYWNrKSB7XG4gICAgLy8gTm90IGEgdmFsaWQgc3RhdGUgbmFtZS5cbiAgICBpZiAoT2JqZWN0LmtleXMoX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXMpLmluZGV4T2Yoc3RhdGUpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3IoJ0ludmFsaWQgc3RhdGUgbmFtZSAnICsgc3RhdGUpO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlc1tzdGF0ZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBfc3RhdGUgaW4gX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXMpIHtcbiAgICAgIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW19zdGF0ZV0ubGVuZ3RoID0gMDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBCeSBjYWxsaW5nIHRoaXMgZnVuY3Rpb24geW91ciBicm93c2VyIGVudmlyb25tZW50IGlzIGVuaGFuY2VkIGdsb2JhbGx5LiBUaGlzXG4gKiBwcm9qZWN0IHdvdWxkIGxvdmUgdG8gaGl0IHRoZSBzdGFuZGFyZHMgdHJhY2sgYW5kIGFsbG93IGFsbCBkZXZlbG9wZXJzIHRvXG4gKiBiZW5lZml0IGZyb20gdGhlIHBlcmZvcm1hbmNlIGdhaW5zIG9mIERPTSBkaWZmaW5nLlxuICovXG5cbmZ1bmN0aW9uIGVuYWJsZVByb2xseWZpbGwoKSB7XG4gIC8vIEV4cG9zZXMgdGhlIGBUcmFuc2l0aW9uU3RhdGVFcnJvcmAgY29uc3RydWN0b3IgZ2xvYmFsbHkgc28gdGhhdCBkZXZlbG9wZXJzXG4gIC8vIGNhbiBpbnN0YW5jZW9mIGNoZWNrIGV4Y2VwdGlvbiBlcnJvcnMuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdUcmFuc2l0aW9uU3RhdGVFcnJvcicsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogX2Vycm9ycy5UcmFuc2l0aW9uU3RhdGVFcnJvclxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gYWRkIHRyYW5zaXRpb24gc3RhdGUgY2FsbGJhY2tzLlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQsICdhZGRUcmFuc2l0aW9uU3RhdGUnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgYWRkVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gcmVtb3ZlIHRyYW5zaXRpb24gc3RhdGUgY2FsbGJhY2tzLlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQsICdyZW1vdmVUcmFuc2l0aW9uU3RhdGUnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgcmVtb3ZlVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gc2V0IHRoZSBgaW5uZXJIVE1MYCBvZiBhbiBlbGVtZW50LlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdkaWZmSW5uZXJIVE1MJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHNldDogZnVuY3Rpb24gc2V0KG5ld0hUTUwpIHtcbiAgICAgIGlubmVySFRNTCh0aGlzLCBuZXdIVE1MKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBzZXQgdGhlIGBvdXRlckhUTUxgIG9mIGFuIGVsZW1lbnQuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZPdXRlckhUTUwnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQobmV3SFRNTCkge1xuICAgICAgb3V0ZXJIVE1MKHRoaXMsIG5ld0hUTUwpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIGRpZmYgdGhlIGN1cnJlbnQgZWxlbWVudCB3aXRoIGEgbmV3IGVsZW1lbnQuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZFbGVtZW50Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdFbGVtZW50KSB7XG4gICAgICBlbGVtZW50KHRoaXMsIG5ld0VsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gUmVsZWFzZXMgdGhlIHJldGFpbmVkIG1lbW9yeSBhbmQgd29ya2VyIGluc3RhbmNlLlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdkaWZmUmVsZWFzZScsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3RWxlbWVudCkge1xuICAgICAgKDAsIF9ub2RlUGF0Y2gucmVsZWFzZU5vZGUpKHRoaXMpO1xuICAgIH1cbiAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenM3T3pzN2VVSkJRWFZETEdOQlFXTTdPekpDUVVOd1FpeGxRVUZsT3pzN096dHpRa0ZKV0N4VlFVRlZPenM3T3p0dFFrRkRkRU1zYjBKQlFXOUNPenM3T3pzN096czdPenM3T3p0QlFWZDBRaXhUUVVGVExGTkJRVk1zUTBGQlF5eFBRVUZQTEVWQlFYbENPMDFCUVhaQ0xFMUJRVTBzZVVSQlFVTXNSVUZCUlR0TlFVRkZMRTlCUVU4c2VVUkJRVU1zUlVGQlJUczdRVUZEZEVRc1UwRkJUeXhEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZEZEVJc05FSkJRVlVzVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenREUVVOeVF6czdPenM3T3pzN096czdPenRCUVZsTkxGTkJRVk1zVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCZVVJN1RVRkJka0lzVFVGQlRTeDVSRUZCUXl4RlFVRkZPMDFCUVVVc1QwRkJUeXg1UkVGQlF5eEZRVUZGT3p0QlFVTjBSQ3hUUVVGUExFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnlRaXcwUWtGQlZTeFBRVUZQTEVWQlFVVXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wTkJRM0pET3pzN096czdPenM3T3pzN08wRkJXVTBzVTBGQlV5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1JVRkJZenROUVVGYUxFOUJRVThzZVVSQlFVTXNSVUZCUlRzN1FVRkRja1FzTkVKQlFWVXNUMEZCVHl4RlFVRkZMRlZCUVZVc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dERRVU42UXpzN1FVRkZUU3hUUVVGVExFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZETDBJc09FSkJRVmtzVDBGQlR5eERRVUZETEVOQlFVTTdRMEZEZEVJN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3p0QlFUQkNUU3hUUVVGVExHdENRVUZyUWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hSUVVGUkxFVkJRVVU3UVVGRGJFUXNUVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSVHRCUVVOV0xGVkJRVTBzYVVOQlFYbENMQ3RDUVVFclFpeERRVUZETEVOQlFVTTdSMEZEYWtVN08wRkJSVVFzVFVGQlNTeERRVUZETEZGQlFWRXNSVUZCUlR0QlFVTmlMRlZCUVUwc2FVTkJRWGxDTEcxRFFVRnRReXhEUVVGRExFTkJRVU03UjBGRGNrVTdPenRCUVVkRUxFMUJRVWtzVFVGQlRTeERRVUZETEVsQlFVa3NLMEpCUVd0Q0xFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRM1pFTEZWQlFVMHNhVU5CUVhsQ0xITkNRVUZ6UWl4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRE8wZEJRMmhGT3p0QlFVVkVMR2REUVVGcFFpeExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UTBGRGVFTTdPenM3T3pzN096czdPenM3TzBGQllVMHNVMEZCVXl4eFFrRkJjVUlzUTBGQlF5eExRVUZMTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUTNKRUxFMUJRVWtzUTBGQlF5eFJRVUZSTEVsQlFVa3NTMEZCU3l4RlFVRkZPMEZCUTNSQ0xHdERRVUZwUWl4TFFVRkxMRU5CUVVNc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBkQlEzQkRMRTFCUTBrc1NVRkJTU3hMUVVGTExFbEJRVWtzVVVGQlVTeEZRVUZGT3p0QlFVVXhRaXhSUVVGSkxFMUJRVTBzUTBGQlF5eEpRVUZKTEN0Q1FVRnJRaXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVOMlJDeFpRVUZOTEdsRFFVRjVRaXh4UWtGQmNVSXNSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJRenRMUVVNdlJEczdRVUZGUkN4UlFVRkpMRXRCUVVzc1IwRkJSeXc0UWtGQmFVSXNTMEZCU3l4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzUkVMR3REUVVGcFFpeExRVUZMTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzBkQlF6RkRMRTFCUTBrN1FVRkRTQ3hUUVVGTExFbEJRVWtzVFVGQlN5eHRRMEZCYzBJN1FVRkRiRU1zYjBOQlFXbENMRTFCUVVzc1EwRkJReXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdTMEZEY0VNN1IwRkRSanREUVVOR096czdPenM3T3p0QlFVOU5MRk5CUVZNc1owSkJRV2RDTEVkQlFVYzdPenRCUVVkcVF5eFJRVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRTFCUVUwc1JVRkJSU3h6UWtGQmMwSXNSVUZCUlR0QlFVTndSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xGTkJRVXNzT0VKQlFYTkNPMGRCUXpWQ0xFTkJRVU1zUTBGQlF6czdPMEZCUjBnc1VVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eFJRVUZSTEVWQlFVVXNiMEpCUVc5Q0xFVkJRVVU3UVVGRGNFUXNaMEpCUVZrc1JVRkJSU3hKUVVGSk96dEJRVVZzUWl4VFFVRkxMRVZCUVVFc1pVRkJReXhMUVVGTExFVkJRVVVzVVVGQlVTeEZRVUZGTzBGQlEzSkNMSGRDUVVGclFpeERRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRMUVVOeVF6dEhRVU5HTEVOQlFVTXNRMEZCUXpzN08wRkJSMGdzVVVGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4UlFVRlJMRVZCUVVVc2RVSkJRWFZDTEVWQlFVVTdRVUZEZGtRc1owSkJRVmtzUlVGQlJTeEpRVUZKT3p0QlFVVnNRaXhUUVVGTExFVkJRVUVzWlVGQlF5eExRVUZMTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUTNKQ0xESkNRVUZ4UWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dExRVU40UXp0SFFVTkdMRU5CUVVNc1EwRkJRenM3TzBGQlIwZ3NVVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eEZRVUZGTEdWQlFXVXNSVUZCUlR0QlFVTjRSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xFOUJRVWNzUlVGQlFTeGhRVUZETEU5QlFVOHNSVUZCUlR0QlFVTllMR1ZCUVZNc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdTMEZETVVJN1IwRkRSaXhEUVVGRExFTkJRVU03T3p0QlFVZElMRkZCUVUwc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNSVUZCUlN4bFFVRmxMRVZCUVVVN1FVRkRlRVFzWjBKQlFWa3NSVUZCUlN4SlFVRkpPenRCUVVWc1FpeFBRVUZITEVWQlFVRXNZVUZCUXl4UFFVRlBMRVZCUVVVN1FVRkRXQ3hsUVVGVExFTkJRVU1zU1VGQlNTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMHRCUXpGQ08wZEJRMFlzUTBGQlF5eERRVUZET3pzN1FVRkhTQ3hSUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1lVRkJZU3hGUVVGRk8wRkJRM1JFTEdkQ1FVRlpMRVZCUVVVc1NVRkJTVHM3UVVGRmJFSXNVMEZCU3l4RlFVRkJMR1ZCUVVNc1ZVRkJWU3hGUVVGRk8wRkJRMmhDTEdGQlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVc1ZVRkJWU3hEUVVGRExFTkJRVU03UzBGRE0wSTdSMEZEUml4RFFVRkRMRU5CUVVNN096dEJRVWRJTEZGQlFVMHNRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeGhRVUZoTEVWQlFVVTdRVUZEZEVRc1owSkJRVmtzUlVGQlJTeEpRVUZKT3p0QlFVVnNRaXhUUVVGTExFVkJRVUVzWlVGQlF5eFZRVUZWTEVWQlFVVTdRVUZEYUVJc2EwTkJRVmtzU1VGQlNTeERRVUZETEVOQlFVTTdTMEZEYmtJN1IwRkRSaXhEUVVGRExFTkJRVU03UTBGRFNpSXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOXBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQjdJSEJoZEdOb1RtOWtaU3dnY21Wc1pXRnpaVTV2WkdVZ2ZTQm1jbTl0SUNjdUwyNXZaR1V2Y0dGMFkyZ25PMXh1YVcxd2IzSjBJSHNnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeUI5SUdaeWIyMGdKeTR2ZEhKaGJuTnBkR2x2Ym5Nbk8xeHVYRzR2THlCWFpTQmxlSEJ2Y25RZ2RHaGxJRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5SUdOdmJuTjBjblZqZEc5eUlITnZJSFJvWVhRZ2FXNXpkR0Z1WTJWdlppQmphR1ZqYTNNZ1kyRnVYRzR2THlCaVpTQnRZV1JsSUdKNUlIUm9iM05sSUhCMVlteHBZMng1SUdOdmJuTjFiV2x1WnlCMGFHbHpJR3hwWW5KaGNua3VYRzVwYlhCdmNuUWdleUJVY21GdWMybDBhVzl1VTNSaGRHVkZjbkp2Y2lCOUlHWnliMjBnSnk0dlpYSnliM0p6Snp0Y2JtVjRjRzl5ZENCN0lGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlJSDBnWm5KdmJTQW5MaTlsY25KdmNuTW5PMXh1WEc0dktpcGNiaUFxSUZWelpXUWdkRzhnWkdsbVppQjBhR1VnYjNWMFpYSklWRTFNSUdOdmJuUmxiblJ6SUc5bUlIUm9aU0J3WVhOelpXUWdaV3hsYldWdWRDQjNhWFJvSUhSb1pTQnRZWEpyZFhCY2JpQXFJR052Ym5SbGJuUnpMaUFnVm1WeWVTQjFjMlZtZFd3Z1ptOXlJR0Z3Y0d4NWFXNW5JR0VnWjJ4dlltRnNJR1JwWm1ZZ2IyNGdkR2hsWEc0Z0tpQmdaRzlqZFcxbGJuUXVaRzlqZFcxbGJuUkZiR1Z0Wlc1MFlDNWNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ1pXeGxiV1Z1ZEZ4dUlDb2dRSEJoY21GdElHMWhjbXQxY0QwbkoxeHVJQ29nUUhCaGNtRnRJRzl3ZEdsdmJuTTllMzFjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHOTFkR1Z5U0ZSTlRDaGxiR1Z0Wlc1MExDQnRZWEpyZFhBOUp5Y3NJRzl3ZEdsdmJuTTllMzBwSUh0Y2JpQWdiM0IwYVc5dWN5NXBibTVsY2lBOUlHWmhiSE5sTzF4dUlDQndZWFJqYUU1dlpHVW9aV3hsYldWdWRDd2diV0Z5YTNWd0xDQnZjSFJwYjI1ektUdGNibjFjYmx4dUx5b3FYRzRnS2lCVmMyVmtJSFJ2SUdScFptWWdkR2hsSUdsdWJtVnlTRlJOVENCamIyNTBaVzUwY3lCdlppQjBhR1VnY0dGemMyVmtJR1ZzWlcxbGJuUWdkMmwwYUNCMGFHVWdiV0Z5YTNWd1hHNGdLaUJqYjI1MFpXNTBjeTRnSUZSb2FYTWdhWE1nZFhObFpuVnNJSGRwZEdnZ2JHbGljbUZ5YVdWeklHeHBhMlVnUW1GamEySnZibVVnZEdoaGRDQnlaVzVrWlhJZ1ZtbGxkM05jYmlBcUlHbHVkRzhnWld4bGJXVnVkQ0JqYjI1MFlXbHVaWEl1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCd1lYSmhiU0J0WVhKcmRYQTlKeWRjYmlBcUlFQndZWEpoYlNCdmNIUnBiMjV6UFh0OVhHNGdLaUJBY21WMGRYSnVYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGJtNWxja2hVVFV3b1pXeGxiV1Z1ZEN3Z2JXRnlhM1Z3UFNjbkxDQnZjSFJwYjI1elBYdDlLU0I3WEc0Z0lHOXdkR2x2Ym5NdWFXNXVaWElnUFNCMGNuVmxPMXh1SUNCd1lYUmphRTV2WkdVb1pXeGxiV1Z1ZEN3Z2JXRnlhM1Z3TENCdmNIUnBiMjV6S1R0Y2JuMWNibHh1THlvcVhHNGdLaUJWYzJWa0lIUnZJR1JwWm1ZZ2RIZHZJR1ZzWlcxbGJuUnpMaUFnVkdobElHQnBibTVsY21BZ1FtOXZiR1ZoYmlCd2NtOXdaWEowZVNCallXNGdZbVVnYzNCbFkybG1hV1ZrSUdsdVhHNGdLaUIwYUdVZ2IzQjBhVzl1Y3lCMGJ5QnpaWFFnYVc1dVpYSklWRTFNWEZ4dmRYUmxja2hVVFV3Z1ltVm9ZWFpwYjNJdUlDQkNlU0JrWldaaGRXeDBJR2wwSUdselhHNGdLaUJ2ZFhSbGNraFVUVXd1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCd1lYSmhiU0J1WlhkRmJHVnRaVzUwWEc0Z0tpQkFjR0Z5WVcwZ2IzQjBhVzl1Y3oxN2ZWeHVJQ29nUUhKbGRIVnlibHh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1pXeGxiV1Z1ZENobGJHVnRaVzUwTENCdVpYZEZiR1Z0Wlc1MExDQnZjSFJwYjI1elBYdDlLU0I3WEc0Z0lIQmhkR05vVG05a1pTaGxiR1Z0Wlc1MExDQnVaWGRGYkdWdFpXNTBMQ0J2Y0hScGIyNXpLVHRjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlISmxiR1ZoYzJVb1pXeGxiV1Z1ZENrZ2UxeHVJQ0J5Wld4bFlYTmxUbTlrWlNobGJHVnRaVzUwS1R0Y2JuMWNibHh1THlvcVhHNGdLaUJCWkdSeklHRWdaMnh2WW1Gc0lIUnlZVzV6YVhScGIyNGdiR2x6ZEdWdVpYSXVJQ0JYYVhSb0lHMWhibmtnWld4bGJXVnVkSE1nZEdocGN5QmpiM1ZzWkNCaVpTQmhibHh1SUNvZ1pYaHdaVzV6YVhabElHOXdaWEpoZEdsdmJpd2djMjhnZEhKNUlIUnZJR3hwYldsMElIUm9aU0JoYlc5MWJuUWdiMllnYkdsemRHVnVaWEp6SUdGa1pHVmtJR2xtSUhsdmRTZHlaVnh1SUNvZ1kyOXVZMlZ5Ym1Wa0lHRmliM1YwSUhCbGNtWnZjbTFoYm1ObExseHVJQ3BjYmlBcUlGTnBibU5sSUhSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWN5QjNhWFJvSUhaaGNtbHZkWE1nWld4bGJXVnVkSE1zSUcxdmMzUWdiMllnZDJocFkyZ2dlVzkxWEc0Z0tpQndjbTlpWVdKc2VTQmtiMjRuZENCallYSmxJR0ZpYjNWMExDQjViM1VuYkd3Z2QyRnVkQ0IwYnlCbWFXeDBaWEl1SUNCQklHZHZiMlFnZDJGNUlHOW1JR1pwYkhSbGNtbHVaMXh1SUNvZ2FYTWdkRzhnZFhObElIUm9aU0JFVDAwZ1lHMWhkR05vWlhOZ0lHMWxkR2h2WkM0Z0lFbDBKM01nWm1GcGNteDVJSGRsYkd3Z2MzVndjRzl5ZEdWa1hHNGdLaUFvYUhSMGNEb3ZMMk5oYm1sMWMyVXVZMjl0THlObVpXRjBQVzFoZEdOb1pYTnpaV3hsWTNSdmNpa2dZVzVrSUcxaGVTQnpkV2wwSUcxaGJua2djSEp2YW1WamRITXVJQ0JKWmx4dUlDb2dlVzkxSUc1bFpXUWdZbUZqYTNkaGNtUnpJR052YlhCaGRHbGlhV3hwZEhrc0lHTnZibk5wWkdWeUlIVnphVzVuSUdwUmRXVnllU2R6SUdCcGMyQXVYRzRnS2x4dUlDb2dXVzkxSUdOaGJpQmtieUJtZFc0c0lHaHBaMmhzZVNCemNHVmphV1pwWXl3Z1ptbHNkR1Z5Y3pwY2JpQXFYRzRnS2lCaFpHUlVjbUZ1YzJsMGFXOXVVM1JoZEdVb0oyRjBkR0ZqYUdWa0p5d2dablZ1WTNScGIyNG9aV3hsYldWdWRDa2dlMXh1SUNvZ0lDQXZMeUJHWVdSbElHbHVJSFJvWlNCdFlXbHVJR052Ym5SaGFXNWxjaUJoWm5SbGNpQnBkQ2R6SUdGa1pHVmtMbHh1SUNvZ0lDQnBaaUFvWld4bGJXVnVkQzV0WVhSamFHVnpLQ2RpYjJSNUlHMWhhVzR1WTI5dWRHRnBibVZ5SnlrcElIdGNiaUFxSUNBZ0lDQWtLR1ZzWlcxbGJuUXBMbk4wYjNBb2RISjFaU3dnZEhKMVpTa3VabUZrWlVsdUtDazdYRzRnS2lBZ0lIMWNiaUFxSUgwcE8xeHVJQ3BjYmlBcUlFQndZWEpoYlNCemRHRjBaU0F0SUZOMGNtbHVaeUJ1WVcxbElIUm9ZWFFnYldGMFkyaGxjeUIzYUdGMEozTWdZWFpoYVd4aFlteGxJR2x1SUhSb1pWeHVJQ29nWkc5amRXMWxiblJoZEdsdmJpQmhZbTkyWlM1Y2JpQXFJRUJ3WVhKaGJTQmpZV3hzWW1GamF5QXRJRVoxYm1OMGFXOXVJSFJ2SUhKbFkyVnBkbVVnZEdobElHMWhkR05vYVc1bklHVnNaVzFsYm5SekxseHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWVdSa1ZISmhibk5wZEdsdmJsTjBZWFJsS0hOMFlYUmxMQ0JqWVd4c1ltRmpheWtnZTF4dUlDQnBaaUFvSVhOMFlYUmxLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5S0NkTmFYTnphVzVuSUhSeVlXNXphWFJwYjI0Z2MzUmhkR1VnYm1GdFpTY3BPMXh1SUNCOVhHNWNiaUFnYVdZZ0tDRmpZV3hzWW1GamF5a2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QlVjbUZ1YzJsMGFXOXVVM1JoZEdWRmNuSnZjaWduVFdsemMybHVaeUIwY21GdWMybDBhVzl1SUhOMFlYUmxJR05oYkd4aVlXTnJKeWs3WEc0Z0lIMWNibHh1SUNBdkx5Qk9iM1FnWVNCMllXeHBaQ0J6ZEdGMFpTQnVZVzFsTGx4dUlDQnBaaUFvVDJKcVpXTjBMbXRsZVhNb2RISmhibk5wZEdsdmJsTjBZWFJsY3lrdWFXNWtaWGhQWmloemRHRjBaU2tnUFQwOUlDMHhLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5S0NkSmJuWmhiR2xrSUhOMFlYUmxJRzVoYldVNklDY2dLeUJ6ZEdGMFpTazdYRzRnSUgxY2JseHVJQ0IwY21GdWMybDBhVzl1VTNSaGRHVnpXM04wWVhSbFhTNXdkWE5vS0dOaGJHeGlZV05yS1R0Y2JuMWNibHh1THlvcVhHNGdLaUJTWlcxdmRtVnpJR0VnWjJ4dlltRnNJSFJ5WVc1emFYUnBiMjRnYkdsemRHVnVaWEl1WEc0Z0tseHVJQ29nVjJobGJpQnBiblp2YTJWa0lIZHBkR2dnYm04Z1lYSm5kVzFsYm5SekxDQjBhR2x6SUcxbGRHaHZaQ0IzYVd4c0lISmxiVzkyWlNCaGJHd2dkSEpoYm5OcGRHbHZibHh1SUNvZ1kyRnNiR0poWTJ0ekxpQWdWMmhsYmlCcGJuWnZhMlZrSUhkcGRHZ2dkR2hsSUc1aGJXVWdZWEpuZFcxbGJuUWdhWFFnZDJsc2JDQnlaVzF2ZG1VZ1lXeHNYRzRnS2lCMGNtRnVjMmwwYVc5dUlITjBZWFJsSUdOaGJHeGlZV05yY3lCdFlYUmphR2x1WnlCMGFHVWdibUZ0WlN3Z1lXNWtJSE52SUc5dUlHWnZjaUIwYUdVZ1kyRnNiR0poWTJzdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUhOMFlYUmxJQzBnVTNSeWFXNW5JRzVoYldVZ2RHaGhkQ0J0WVhSamFHVnpJSGRvWVhRbmN5QmhkbUZwYkdGaWJHVWdhVzRnZEdobFhHNGdLaUJrYjJOMWJXVnVkR0YwYVc5dUlHRmliM1psTGx4dUlDb2dRSEJoY21GdElHTmhiR3hpWVdOcklDMGdSblZ1WTNScGIyNGdkRzhnY21WalpXbDJaU0IwYUdVZ2JXRjBZMmhwYm1jZ1pXeGxiV1Z1ZEhNdVhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ5WlcxdmRtVlVjbUZ1YzJsMGFXOXVVM1JoZEdVb2MzUmhkR1VzSUdOaGJHeGlZV05yS1NCN1hHNGdJR2xtSUNnaFkyRnNiR0poWTJzZ0ppWWdjM1JoZEdVcElIdGNiaUFnSUNCMGNtRnVjMmwwYVc5dVUzUmhkR1Z6VzNOMFlYUmxYUzVzWlc1bmRHZ2dQU0F3TzF4dUlDQjlYRzRnSUdWc2MyVWdhV1lnS0hOMFlYUmxJQ1ltSUdOaGJHeGlZV05yS1NCN1hHNGdJQ0FnTHk4Z1RtOTBJR0VnZG1Gc2FXUWdjM1JoZEdVZ2JtRnRaUzVjYmlBZ0lDQnBaaUFvVDJKcVpXTjBMbXRsZVhNb2RISmhibk5wZEdsdmJsTjBZWFJsY3lrdWFXNWtaWGhQWmloemRHRjBaU2tnUFQwOUlDMHhLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnVkhKaGJuTnBkR2x2YmxOMFlYUmxSWEp5YjNJb0owbHVkbUZzYVdRZ2MzUmhkR1VnYm1GdFpTQW5JQ3NnYzNSaGRHVXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHeGxkQ0JwYm1SbGVDQTlJSFJ5WVc1emFYUnBiMjVUZEdGMFpYTmJjM1JoZEdWZExtbHVaR1Y0VDJZb1kyRnNiR0poWTJzcE8xeHVJQ0FnSUhSeVlXNXphWFJwYjI1VGRHRjBaWE5iYzNSaGRHVmRMbk53YkdsalpTaHBibVJsZUN3Z01TazdYRzRnSUgxY2JpQWdaV3h6WlNCN1hHNGdJQ0FnWm05eUlDaHNaWFFnYzNSaGRHVWdhVzRnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeWtnZTF4dUlDQWdJQ0FnZEhKaGJuTnBkR2x2YmxOMFlYUmxjMXR6ZEdGMFpWMHViR1Z1WjNSb0lEMGdNRHRjYmlBZ0lDQjlYRzRnSUgxY2JuMWNibHh1THlvcVhHNGdLaUJDZVNCallXeHNhVzVuSUhSb2FYTWdablZ1WTNScGIyNGdlVzkxY2lCaWNtOTNjMlZ5SUdWdWRtbHliMjV0Wlc1MElHbHpJR1Z1YUdGdVkyVmtJR2RzYjJKaGJHeDVMaUJVYUdselhHNGdLaUJ3Y205cVpXTjBJSGR2ZFd4a0lHeHZkbVVnZEc4Z2FHbDBJSFJvWlNCemRHRnVaR0Z5WkhNZ2RISmhZMnNnWVc1a0lHRnNiRzkzSUdGc2JDQmtaWFpsYkc5d1pYSnpJSFJ2WEc0Z0tpQmlaVzVsWm1sMElHWnliMjBnZEdobElIQmxjbVp2Y20xaGJtTmxJR2RoYVc1eklHOW1JRVJQVFNCa2FXWm1hVzVuTGx4dUlDb3ZYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaVzVoWW14bFVISnZiR3g1Wm1sc2JDZ3BJSHRjYmlBZ0x5OGdSWGh3YjNObGN5QjBhR1VnWUZSeVlXNXphWFJwYjI1VGRHRjBaVVZ5Y205eVlDQmpiMjV6ZEhKMVkzUnZjaUJuYkc5aVlXeHNlU0J6YnlCMGFHRjBJR1JsZG1Wc2IzQmxjbk5jYmlBZ0x5OGdZMkZ1SUdsdWMzUmhibU5sYjJZZ1kyaGxZMnNnWlhoalpYQjBhVzl1SUdWeWNtOXljeTVjYmlBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSGRwYm1SdmR5d2dKMVJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5Snl3Z2UxeHVJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JseHVJQ0FnSUhaaGJIVmxPaUJVY21GdWMybDBhVzl1VTNSaGRHVkZjbkp2Y2x4dUlDQjlLVHRjYmx4dUlDQXZMeUJCYkd4dmQzTWdZU0JrWlhabGJHOXdaWElnZEc4Z1lXUmtJSFJ5WVc1emFYUnBiMjRnYzNSaGRHVWdZMkZzYkdKaFkydHpMbHh1SUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aRzlqZFcxbGJuUXNJQ2RoWkdSVWNtRnVjMmwwYVc5dVUzUmhkR1VuTENCN1hHNGdJQ0FnWTI5dVptbG5kWEpoWW14bE9pQjBjblZsTEZ4dVhHNGdJQ0FnZG1Gc2RXVW9jM1JoZEdVc0lHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQmhaR1JVY21GdWMybDBhVzl1VTNSaGRHVW9jM1JoZEdVc0lHTmhiR3hpWVdOcktUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dVhHNGdJQzh2SUVGc2JHOTNjeUJoSUdSbGRtVnNiM0JsY2lCMGJ5QnlaVzF2ZG1VZ2RISmhibk5wZEdsdmJpQnpkR0YwWlNCallXeHNZbUZqYTNNdVhHNGdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoa2IyTjFiV1Z1ZEN3Z0ozSmxiVzkyWlZSeVlXNXphWFJwYjI1VGRHRjBaU2NzSUh0Y2JpQWdJQ0JqYjI1bWFXZDFjbUZpYkdVNklIUnlkV1VzWEc1Y2JpQWdJQ0IyWVd4MVpTaHpkR0YwWlN3Z1kyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lISmxiVzkyWlZSeVlXNXphWFJwYjI1VGRHRjBaU2h6ZEdGMFpTd2dZMkZzYkdKaFkyc3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaUFnTHk4Z1FXeHNiM2R6SUdFZ1pHVjJaV3h2Y0dWeUlIUnZJSE5sZENCMGFHVWdZR2x1Ym1WeVNGUk5UR0FnYjJZZ1lXNGdaV3hsYldWdWRDNWNiaUFnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtFVnNaVzFsYm5RdWNISnZkRzkwZVhCbExDQW5aR2xtWmtsdWJtVnlTRlJOVENjc0lIdGNiaUFnSUNCamIyNW1hV2QxY21GaWJHVTZJSFJ5ZFdVc1hHNWNiaUFnSUNCelpYUW9ibVYzU0ZSTlRDa2dlMXh1SUNBZ0lDQWdhVzV1WlhKSVZFMU1LSFJvYVhNc0lHNWxkMGhVVFV3cE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdMeThnUVd4c2IzZHpJR0VnWkdWMlpXeHZjR1Z5SUhSdklITmxkQ0IwYUdVZ1lHOTFkR1Z5U0ZSTlRHQWdiMllnWVc0Z1pXeGxiV1Z1ZEM1Y2JpQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0VWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTENBblpHbG1aazkxZEdWeVNGUk5UQ2NzSUh0Y2JpQWdJQ0JqYjI1bWFXZDFjbUZpYkdVNklIUnlkV1VzWEc1Y2JpQWdJQ0J6WlhRb2JtVjNTRlJOVENrZ2UxeHVJQ0FnSUNBZ2IzVjBaWEpJVkUxTUtIUm9hWE1zSUc1bGQwaFVUVXdwTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzVjYmlBZ0x5OGdRV3hzYjNkeklHRWdaR1YyWld4dmNHVnlJSFJ2SUdScFptWWdkR2hsSUdOMWNuSmxiblFnWld4bGJXVnVkQ0IzYVhSb0lHRWdibVYzSUdWc1pXMWxiblF1WEc0Z0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaU3dnSjJScFptWkZiR1Z0Wlc1MEp5d2dlMXh1SUNBZ0lHTnZibVpwWjNWeVlXSnNaVG9nZEhKMVpTeGNibHh1SUNBZ0lIWmhiSFZsS0c1bGQwVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHVnNaVzFsYm5Rb2RHaHBjeXdnYm1WM1JXeGxiV1Z1ZENrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYmx4dUlDQXZMeUJTWld4bFlYTmxjeUIwYUdVZ2NtVjBZV2x1WldRZ2JXVnRiM0o1SUdGdVpDQjNiM0pyWlhJZ2FXNXpkR0Z1WTJVdVhHNGdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlN3Z0oyUnBabVpTWld4bFlYTmxKeXdnZTF4dUlDQWdJR052Ym1acFozVnlZV0pzWlRvZ2RISjFaU3hjYmx4dUlDQWdJSFpoYkhWbEtHNWxkMFZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJSEpsYkdWaGMyVk9iMlJsS0hSb2FYTXBPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNTlYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYWtlO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIHBvb2xzID0gX3V0aWxQb29scy5wb29scztcbnZhciBwcm90ZWN0RWxlbWVudCA9IF91dGlsTWVtb3J5LnByb3RlY3RFbGVtZW50O1xudmFyIHVucHJvdGVjdEVsZW1lbnQgPSBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50O1xuXG4vLyBDYWNoZSBjcmVhdGVkIG5vZGVzIGluc2lkZSB0aGlzIG9iamVjdC5cbm1ha2Uubm9kZXMgPSB7fTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGxpdmUgbm9kZSBpbnRvIGEgdmlydHVhbCBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlXG4gKiBAcmV0dXJuXG4gKi9cblxuZnVuY3Rpb24gbWFrZShub2RlLCBwcm90ZWN0KSB7XG4gIHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGU7XG4gIHZhciBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZTtcblxuICBpZiAoIW5vZGVUeXBlIHx8IG5vZGVUeXBlID09PSAyIHx8IG5vZGVUeXBlID09PSA0IHx8IG5vZGVUeXBlID09PSA4KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG5vZGVUeXBlID09PSAzICYmICFub2RlVmFsdWUudHJpbSgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVmlydHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIG5vZGUsIGNvbnRhaW5pbmcgb25seSB0aGUgZGF0YSB3ZSB3aXNoIHRvXG4gIC8vIGRpZmYgYW5kIHBhdGNoLlxuICB2YXIgZW50cnkgPSBwb29scy5lbGVtZW50T2JqZWN0LmdldCgpO1xuXG4gIGlmIChwcm90ZWN0KSB7XG4gICAgcHJvdGVjdEVsZW1lbnQoZW50cnkpO1xuICB9XG5cbiAgLy8gQWRkIHRvIGludGVybmFsIGxvb2t1cC5cbiAgbWFrZS5ub2Rlc1tlbnRyeS5lbGVtZW50XSA9IG5vZGU7XG5cbiAgZW50cnkubm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGVudHJ5Lm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcbiAgZW50cnkuY2hpbGROb2Rlcy5sZW5ndGggPSAwO1xuICBlbnRyeS5hdHRyaWJ1dGVzLmxlbmd0aCA9IDA7XG5cbiAgLy8gQ29sbGVjdCBhdHRyaWJ1dGVzLlxuICB2YXIgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAvLyBJZiB0aGUgZWxlbWVudCBoYXMgbm8gYXR0cmlidXRlcywgc2tpcCBvdmVyLlxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBhdHRyaWJ1dGVzTGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICBpZiAoYXR0cmlidXRlc0xlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0dHIgPSBwb29scy5hdHRyaWJ1dGVPYmplY3QuZ2V0KCk7XG5cbiAgICAgICAgaWYgKHByb3RlY3QpIHtcbiAgICAgICAgICBwb29scy5hdHRyaWJ1dGVPYmplY3QucHJvdGVjdChhdHRyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF0dHIubmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IGF0dHJpYnV0ZXNbaV0udmFsdWU7XG5cbiAgICAgICAgZW50cnkuYXR0cmlidXRlc1tlbnRyeS5hdHRyaWJ1dGVzLmxlbmd0aF0gPSBhdHRyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbGxlY3QgY2hpbGROb2Rlcy5cbiAgdmFyIGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG4gIHZhciBjaGlsZE5vZGVzTGVuZ3RoID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAvLyBJZiB0aGUgZWxlbWVudCBoYXMgY2hpbGQgbm9kZXMsIGNvbnZlcnQgdGhlbSBhbGwgdG8gdmlydHVhbCBub2Rlcy5cbiAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDMgJiYgY2hpbGROb2Rlcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmV3Tm9kZSA9IG1ha2UoY2hpbGROb2Rlc1tpXSwgcHJvdGVjdCk7XG5cbiAgICAgIGlmIChuZXdOb2RlKSB7XG4gICAgICAgIGVudHJ5LmNoaWxkTm9kZXNbZW50cnkuY2hpbGROb2Rlcy5sZW5ndGhdID0gbmV3Tm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZW50cnk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2YldGclpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRnRRbmRDTEVsQlFVazdPM2xDUVc1Q1NTeGxRVUZsT3pzd1FrRkplRU1zWjBKQlFXZENPenRCUVVWMlFpeEpRVUZKTEV0QlFVc3NiVUpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEdOQlFXTXNOa0pCUVd0Q0xFTkJRVU03UVVGRGNrTXNTVUZCU1N4blFrRkJaMElzSzBKQlFXOUNMRU5CUVVNN096dEJRVWQ2UXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF6czdPenM3T3pzN08wRkJVVVFzVTBGQlV5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVNeFF5eE5RVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRemRDTEUxQlFVa3NVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU03TzBGQlJTOUNMRTFCUVVrc1EwRkJReXhSUVVGUkxFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNTVUZCU1N4UlFVRlJMRXRCUVVzc1EwRkJReXhKUVVGSkxGRkJRVkVzUzBGQlN5eERRVUZETEVWQlFVVTdRVUZEYmtVc1YwRkJUeXhMUVVGTExFTkJRVU03UjBGRFpEczdRVUZGUkN4TlFVRkpMRkZCUVZFc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRVZCUVVVN1FVRkRka01zVjBGQlR5eExRVUZMTEVOQlFVTTdSMEZEWkRzN096dEJRVWxFTEUxQlFVa3NTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUlhSRExFMUJRVWtzVDBGQlR5eEZRVUZGTzBGQlFVVXNhMEpCUVdNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVUZGT3pzN1FVRkhka01zVFVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZET3p0QlFVVnFReXhQUVVGTExFTkJRVU1zVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03UVVGRE4wTXNUMEZCU3l4RFFVRkRMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRE5VSXNUMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlF6VkNMRTlCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXpzN08wRkJSelZDTEUxQlFVa3NWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU03T3p0QlFVZHFReXhOUVVGSkxGVkJRVlVzUlVGQlJUdEJRVU5rTEZGQlFVa3NaMEpCUVdkQ0xFZEJRVWNzVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXpzN1FVRkZla01zVVVGQlNTeG5Ra0ZCWjBJc1JVRkJSVHRCUVVOd1FpeFhRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzWjBKQlFXZENMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRGVrTXNXVUZCU1N4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXpzN1FVRkZka01zV1VGQlNTeFBRVUZQTEVWQlFVVTdRVUZEV0N4bFFVRkxMRU5CUVVNc1pVRkJaU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0VFFVTnlRenM3UVVGRlJDeFpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZETDBJc1dVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRE96dEJRVVZxUXl4aFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wOUJRMnhFTzB0QlEwWTdSMEZEUmpzN08wRkJSMFFzVFVGQlNTeFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVOcVF5eE5RVUZKTEdkQ1FVRm5RaXhIUVVGSExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPenM3UVVGSE9VTXNUVUZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hMUVVGTExFTkJRVU1zU1VGQlNTeFZRVUZWTEVWQlFVVTdRVUZEY2tNc1UwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMR2RDUVVGblFpeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNwRExGVkJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRORExGVkJRVWtzVDBGQlR5eEZRVUZGTzBGQlExZ3NZVUZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJRenRQUVVOeVJEdExRVU5HTzBkQlEwWTdPMEZCUlVRc1UwRkJUeXhMUVVGTExFTkJRVU03UTBGRFpDSXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOXViMlJsTDIxaGEyVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnZXlCd2IyOXNjeUJoY3lCZmNHOXZiSE1nZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0J2YjJ4ekp6dGNibWx0Y0c5eWRDQjdYRzRnSUhCeWIzUmxZM1JGYkdWdFpXNTBJR0Z6SUY5d2NtOTBaV04wUld4bGJXVnVkQ3hjYmlBZ2RXNXdjbTkwWldOMFJXeGxiV1Z1ZENCaGN5QmZkVzV3Y205MFpXTjBSV3hsYldWdWRGeHVmU0JtY205dElDY3VMaTkxZEdsc0wyMWxiVzl5ZVNjN1hHNWNibXhsZENCd2IyOXNjeUE5SUY5d2IyOXNjenRjYm14bGRDQndjbTkwWldOMFJXeGxiV1Z1ZENBOUlGOXdjbTkwWldOMFJXeGxiV1Z1ZER0Y2JteGxkQ0IxYm5CeWIzUmxZM1JGYkdWdFpXNTBJRDBnWDNWdWNISnZkR1ZqZEVWc1pXMWxiblE3WEc1Y2JpOHZJRU5oWTJobElHTnlaV0YwWldRZ2JtOWtaWE1nYVc1emFXUmxJSFJvYVhNZ2IySnFaV04wTGx4dWJXRnJaUzV1YjJSbGN5QTlJSHQ5TzF4dVhHNHZLaXBjYmlBcUlFTnZiblpsY25SeklHRWdiR2wyWlNCdWIyUmxJR2x1ZEc4Z1lTQjJhWEowZFdGc0lHNXZaR1V1WEc0Z0tseHVJQ29nUUhCaGNtRnRJRzV2WkdWY2JpQXFJRUJ5WlhSMWNtNWNiaUFxTDF4dVpYaHdiM0owSUdSbFptRjFiSFFnWm5WdVkzUnBiMjRnYldGclpTaHViMlJsTENCd2NtOTBaV04wS1NCN1hHNGdJR3hsZENCdWIyUmxWSGx3WlNBOUlHNXZaR1V1Ym05a1pWUjVjR1U3WEc0Z0lHeGxkQ0J1YjJSbFZtRnNkV1VnUFNCdWIyUmxMbTV2WkdWV1lXeDFaVHRjYmx4dUlDQnBaaUFvSVc1dlpHVlVlWEJsSUh4OElHNXZaR1ZVZVhCbElEMDlQU0F5SUh4OElHNXZaR1ZVZVhCbElEMDlQU0EwSUh4OElHNXZaR1ZVZVhCbElEMDlQU0E0S1NCN1hHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0c1dlpHVlVlWEJsSUQwOVBTQXpJQ1ltSUNGdWIyUmxWbUZzZFdVdWRISnBiU2dwS1NCN1hHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdMeThnVm1seWRIVmhiQ0J5WlhCeVpYTmxiblJoZEdsdmJpQnZaaUJoSUc1dlpHVXNJR052Ym5SaGFXNXBibWNnYjI1c2VTQjBhR1VnWkdGMFlTQjNaU0IzYVhOb0lIUnZYRzRnSUM4dklHUnBabVlnWVc1a0lIQmhkR05vTGx4dUlDQnNaWFFnWlc1MGNua2dQU0J3YjI5c2N5NWxiR1Z0Wlc1MFQySnFaV04wTG1kbGRDZ3BPMXh1WEc0Z0lHbG1JQ2h3Y205MFpXTjBLU0I3SUhCeWIzUmxZM1JGYkdWdFpXNTBLR1Z1ZEhKNUtUc2dmVnh1WEc0Z0lDOHZJRUZrWkNCMGJ5QnBiblJsY201aGJDQnNiMjlyZFhBdVhHNGdJRzFoYTJVdWJtOWtaWE5iWlc1MGNua3VaV3hsYldWdWRGMGdQU0J1YjJSbE8xeHVYRzRnSUdWdWRISjVMbTV2WkdWT1lXMWxJRDBnYm05a1pTNXViMlJsVG1GdFpTNTBiMHh2ZDJWeVEyRnpaU2dwTzF4dUlDQmxiblJ5ZVM1dWIyUmxWbUZzZFdVZ1BTQnViMlJsVm1Gc2RXVTdYRzRnSUdWdWRISjVMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9JRDBnTUR0Y2JpQWdaVzUwY25rdVlYUjBjbWxpZFhSbGN5NXNaVzVuZEdnZ1BTQXdPMXh1WEc0Z0lDOHZJRU52Ykd4bFkzUWdZWFIwY21saWRYUmxjeTVjYmlBZ2JHVjBJR0YwZEhKcFluVjBaWE1nUFNCdWIyUmxMbUYwZEhKcFluVjBaWE03WEc1Y2JpQWdMeThnU1dZZ2RHaGxJR1ZzWlcxbGJuUWdhR0Z6SUc1dklHRjBkSEpwWW5WMFpYTXNJSE5yYVhBZ2IzWmxjaTVjYmlBZ2FXWWdLR0YwZEhKcFluVjBaWE1wSUh0Y2JpQWdJQ0JzWlhRZ1lYUjBjbWxpZFhSbGMweGxibWQwYUNBOUlHRjBkSEpwWW5WMFpYTXViR1Z1WjNSb08xeHVYRzRnSUNBZ2FXWWdLR0YwZEhKcFluVjBaWE5NWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnWVhSMGNtbGlkWFJsYzB4bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQWdJR3hsZENCaGRIUnlJRDBnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExtZGxkQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h3Y205MFpXTjBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NHOXZiSE11WVhSMGNtbGlkWFJsVDJKcVpXTjBMbkJ5YjNSbFkzUW9ZWFIwY2lrN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JoZEhSeUxtNWhiV1VnUFNCaGRIUnlhV0oxZEdWelcybGRMbTVoYldVN1hHNGdJQ0FnSUNBZ0lHRjBkSEl1ZG1Gc2RXVWdQU0JoZEhSeWFXSjFkR1Z6VzJsZExuWmhiSFZsTzF4dVhHNGdJQ0FnSUNBZ0lHVnVkSEo1TG1GMGRISnBZblYwWlhOYlpXNTBjbmt1WVhSMGNtbGlkWFJsY3k1c1pXNW5kR2hkSUQwZ1lYUjBjanRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2THlCRGIyeHNaV04wSUdOb2FXeGtUbTlrWlhNdVhHNGdJR3hsZENCamFHbHNaRTV2WkdWeklEMGdibTlrWlM1amFHbHNaRTV2WkdWek8xeHVJQ0JzWlhRZ1kyaHBiR1JPYjJSbGMweGxibWQwYUNBOUlHNXZaR1V1WTJocGJHUk9iMlJsY3k1c1pXNW5kR2c3WEc1Y2JpQWdMeThnU1dZZ2RHaGxJR1ZzWlcxbGJuUWdhR0Z6SUdOb2FXeGtJRzV2WkdWekxDQmpiMjUyWlhKMElIUm9aVzBnWVd4c0lIUnZJSFpwY25SMVlXd2dibTlrWlhNdVhHNGdJR2xtSUNodWIyUmxMbTV2WkdWVWVYQmxJQ0U5UFNBeklDWW1JR05vYVd4a1RtOWtaWE1wSUh0Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUdOb2FXeGtUbTlrWlhOTVpXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdiR1YwSUc1bGQwNXZaR1VnUFNCdFlXdGxLR05vYVd4a1RtOWtaWE5iYVYwc0lIQnliM1JsWTNRcE8xeHVYRzRnSUNBZ0lDQnBaaUFvYm1WM1RtOWtaU2tnZTF4dUlDQWdJQ0FnSUNCbGJuUnllUzVqYUdsc1pFNXZaR1Z6VzJWdWRISjVMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9YU0E5SUc1bGQwNXZaR1U3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJR1Z1ZEhKNU8xeHVmVnh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJlbGVhc2VOb2RlID0gcmVsZWFzZU5vZGU7XG5leHBvcnRzLnBhdGNoTm9kZSA9IHBhdGNoTm9kZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09ialsnZGVmYXVsdCddID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2N1c3RvbUV2ZW50ID0gcmVxdWlyZSgnY3VzdG9tLWV2ZW50Jyk7XG5cbnZhciBfY3VzdG9tRXZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3VzdG9tRXZlbnQpO1xuXG52YXIgX3dvcmtlckNyZWF0ZSA9IHJlcXVpcmUoJy4uL3dvcmtlci9jcmVhdGUnKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIF9tYWtlID0gcmVxdWlyZSgnLi9tYWtlJyk7XG5cbnZhciBfbWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYWtlKTtcblxudmFyIF9zeW5jID0gcmVxdWlyZSgnLi9zeW5jJyk7XG5cbnZhciBfc3luYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zeW5jKTtcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbFBhcnNlciA9IHJlcXVpcmUoJy4uL3V0aWwvcGFyc2VyJyk7XG5cbnZhciBfdXRpbEJ1ZmZlcnMgPSByZXF1aXJlKCcuLi91dGlsL2J1ZmZlcnMnKTtcblxudmFyIGJ1ZmZlcnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdXRpbEJ1ZmZlcnMpO1xuXG52YXIgX3BhdGNoZXNQcm9jZXNzID0gcmVxdWlyZSgnLi4vcGF0Y2hlcy9wcm9jZXNzJyk7XG5cbnZhciBfcGF0Y2hlc1Byb2Nlc3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGF0Y2hlc1Byb2Nlc3MpO1xuXG4vLyBDYWNoZSBwcmVidWlsdCB0cmVlcyBhbmQgbG9va3VwIGJ5IGVsZW1lbnQuXG52YXIgVHJlZUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxuLyoqXG4gKiBXaGVuIHRoZSB3b3JrZXIgY29tcGxldGVzLCBjbGVhbiB1cCBtZW1vcnkgYW5kIHNjaGVkdWxlIHRoZSBuZXh0IHJlbmRlciBpZlxuICogbmVjZXNzYXJ5LlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gZWxlbWVudE1ldGFcbiAqIEByZXR1cm5cbiAqL1xuZnVuY3Rpb24gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChldikge1xuICAgICgwLCBfcGF0Y2hlc1Byb2Nlc3MyWydkZWZhdWx0J10pKGVsZW1lbnQsIGV2KTtcblxuICAgIGVsZW1lbnRNZXRhLl9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcbiAgICBlbGVtZW50TWV0YS5fb3V0ZXJIVE1MID0gZWxlbWVudC5vdXRlckhUTUw7XG4gICAgZWxlbWVudE1ldGEuX3RleHRDb250ZW50ID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgICgwLCBfdXRpbE1lbW9yeS5jbGVhbk1lbW9yeSkoKTtcblxuICAgIGVsZW1lbnRNZXRhLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgZWxlbWVudE1ldGEuaGFzUmVuZGVyZWRWaWFXb3JrZXIgPSB0cnVlO1xuXG4gICAgLy8gRGlzcGF0Y2ggYW4gZXZlbnQgb24gdGhlIGVsZW1lbnQgb25jZSByZW5kZXJpbmcgaGFzIGNvbXBsZXRlZC5cbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IF9jdXN0b21FdmVudDJbJ2RlZmF1bHQnXSgncmVuZGVyQ29tcGxldGUnKSk7XG5cbiAgICBpZiAoZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyKSB7XG4gICAgICB2YXIgbmV4dFJlbmRlciA9IGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlcjtcbiAgICAgIGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlciA9IHVuZGVmaW5lZDtcblxuICAgICAgcGF0Y2hOb2RlKGVsZW1lbnQsIG5leHRSZW5kZXIubmV3SFRNTCwgbmV4dFJlbmRlci5vcHRpb25zKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUmVsZWFzZSdzIHRoZSBhbGxvY2F0ZWQgb2JqZWN0cyBhbmQgcmVjeWNsZXMgaW50ZXJuYWwgbWVtb3J5LlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gcmVsZWFzZU5vZGUoZWxlbWVudCkge1xuICB2YXIgZWxlbWVudE1ldGEgPSBUcmVlQ2FjaGUuZ2V0KGVsZW1lbnQpIHx8IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIGEgd29ya2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVsZW1lbnQsIHRoZW4ga2lsbCBpdC5cbiAgaWYgKGVsZW1lbnRNZXRhLndvcmtlcikge1xuICAgIGVsZW1lbnRNZXRhLndvcmtlci50ZXJtaW5hdGUoKTtcbiAgfVxuXG4gIC8vIElmIHRoZXJlIHdhcyBhIHRyZWUgc2V0IHVwLCByZWN5Y2xlIHRoZSBtZW1vcnkgYWxsb2NhdGVkIGZvciBpdC5cbiAgaWYgKGVsZW1lbnRNZXRhLm9sZFRyZWUpIHtcbiAgICAoMCwgX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudCkoZWxlbWVudE1ldGEub2xkVHJlZSk7XG4gICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuICB9XG5cbiAgVHJlZUNhY2hlWydkZWxldGUnXShlbGVtZW50KTtcbn1cblxuLyoqXG4gKiBQYXRjaGVzIGFuIGVsZW1lbnQncyBET00gdG8gbWF0Y2ggdGhhdCBvZiB0aGUgcGFzc2VkIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG5ld0hUTUxcbiAqL1xuXG5mdW5jdGlvbiBwYXRjaE5vZGUoZWxlbWVudCwgbmV3SFRNTCwgb3B0aW9ucykge1xuICAvLyBFbnN1cmUgdGhhdCB0aGUgZG9jdW1lbnQgZGlzYWJsZSB3b3JrZXIgaXMgYWx3YXlzIHBpY2tlZCB1cC5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmVuYWJsZVdvcmtlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0aW9ucy5lbmFibGVXb3JrZXIgPSBkb2N1bWVudC5FTkFCTEVfV09SS0VSO1xuICB9XG5cbiAgdmFyIGVsZW1lbnRNZXRhID0gVHJlZUNhY2hlLmdldChlbGVtZW50KSB8fCB7fTtcbiAgdmFyIG5ld09sZCA9IGZhbHNlO1xuXG4gIC8vIEFsd2F5cyBlbnN1cmUgdGhlIG1vc3QgdXAtdG8tZGF0ZSBtZXRhIG9iamVjdCBpcyBzdG9yZWQuXG4gIFRyZWVDYWNoZS5zZXQoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuXG4gIGlmIChlbGVtZW50TWV0YS5pc1JlbmRlcmluZykge1xuICAgIC8vIEFkZCB0aGlzIG5ldyByZW5kZXIgaW50byB0aGUgYnVmZmVyIHF1ZXVlLlxuICAgIGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlciA9IHsgbmV3SFRNTDogbmV3SFRNTCwgb3B0aW9uczogb3B0aW9ucyB9O1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLFxuICAvLyBhYm9ydC5cbiAgb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50LmlubmVySFRNTCA9PT0gbmV3SFRNTCB8fFxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLFxuICAvLyBhYm9ydC5cbiAgIW9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudC5vdXRlckhUTUwgPT09IG5ld0hUTUwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50TWV0YS5faW5uZXJIVE1MICE9PSBlbGVtZW50LmlubmVySFRNTCB8fFxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgIW9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudE1ldGEuX291dGVySFRNTCAhPT0gZWxlbWVudC5vdXRlckhUTUwgfHxcblxuICAvLyBJZiB0aGUgdGV4dCBjb250ZW50IGV2ZXIgY2hhbmdlcywgcmVjYWxjdWxhdGUgdGhlIHRyZWUuXG4gIGVsZW1lbnRNZXRhLl90ZXh0Q29udGVudCAhPT0gZWxlbWVudC50ZXh0Q29udGVudCkge1xuICAgIG5ld09sZCA9IHRydWU7XG5cbiAgICBpZiAoZWxlbWVudE1ldGEub2xkVHJlZSkge1xuICAgICAgKDAsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQpKGVsZW1lbnRNZXRhLm9sZFRyZWUpO1xuICAgICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuICAgIH1cblxuICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUgPSAoMCwgX21ha2UyWydkZWZhdWx0J10pKGVsZW1lbnQsIHRydWUpO1xuICB9XG5cbiAgLy8gV2lsbCB3YW50IHRvIGVuc3VyZSB0aGF0IHRoZSBmaXJzdCByZW5kZXIgd2VudCB0aHJvdWdoLCB0aGUgd29ya2VyIGNhblxuICAvLyB0YWtlIGEgYml0IHRvIHN0YXJ0dXAgYW5kIHdlIHdhbnQgdG8gc2hvdyBjaGFuZ2VzIGFzIHNvb24gYXMgcG9zc2libGUuXG4gIGlmIChvcHRpb25zLmVuYWJsZVdvcmtlciAmJiBfd29ya2VyQ3JlYXRlLmhhc1dvcmtlciAmJiBlbGVtZW50TWV0YS5oYXNSZW5kZXJlZCkge1xuICAgIC8vIENyZWF0ZSBhIHdvcmtlciBmb3IgdGhpcyBlbGVtZW50LlxuICAgIHZhciB3b3JrZXIgPSBlbGVtZW50TWV0YS53b3JrZXIgPSBlbGVtZW50TWV0YS53b3JrZXIgfHwgKDAsIF93b3JrZXJDcmVhdGUuY3JlYXRlKSgpO1xuXG4gICAgLy8gQXR0YWNoIGFsbCBwcm9wZXJ0aWVzIGhlcmUgdG8gdHJhbnNwb3J0LlxuICAgIHZhciB0cmFuc2Zlck9iamVjdCA9IHt9O1xuXG4gICAgLy8gQXR0YWNoIHRoZSBwYXJlbnQgZWxlbWVudCdzIHV1aWQuXG4gICAgdHJhbnNmZXJPYmplY3QudXVpZCA9IGVsZW1lbnRNZXRhLm9sZFRyZWUuZWxlbWVudDtcblxuICAgIGlmIChuZXdPbGQgfHwgIWVsZW1lbnRNZXRhLmhhc1JlbmRlcmVkVmlhV29ya2VyKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5vbGRUcmVlID0gZWxlbWVudE1ldGEub2xkVHJlZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5ld0hUTUwgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5uZXdUcmVlID0gKDAsIF9tYWtlMlsnZGVmYXVsdCddKShuZXdIVE1MKTtcblxuICAgICAgLy8gU2V0IGEgcmVuZGVyIGxvY2sgYXMgdG8gbm90IGZsb29kIHRoZSB3b3JrZXIuXG4gICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IHRydWU7XG5cbiAgICAgIC8vIFRyYW5zZmVyIHRoaXMgYnVmZmVyIHRvIHRoZSB3b3JrZXIsIHdoaWNoIHdpbGwgdGFrZSBvdmVyIGFuZCBwcm9jZXNzIHRoZVxuICAgICAgLy8gbWFya3VwLlxuICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHRyYW5zZmVyT2JqZWN0KTtcblxuICAgICAgLy8gV2FpdCBmb3IgdGhlIHdvcmtlciB0byBmaW5pc2ggcHJvY2Vzc2luZyBhbmQgdGhlbiBhcHBseSB0aGUgcGF0Y2hzZXQuXG4gICAgICB3b3JrZXIub25tZXNzYWdlID0gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXNlZCB0byBzcGVjaWZ5IHRoZSBvdXRlckhUTUwgb2Zmc2V0IGlmIHBhc3NpbmcgdGhlIHBhcmVudCdzIG1hcmt1cC5cbiAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgIC8vIENyYWZ0IGEgbmV3IGJ1ZmZlciB3aXRoIHRoZSBuZXcgY29udGVudHMuXG4gICAgdmFyIG5ld0J1ZmZlciA9IGJ1ZmZlcnMuc3RyaW5nVG9CdWZmZXIobmV3SFRNTCk7XG5cbiAgICAvLyBTZXQgdGhlIG9mZnNldCB0byBiZSB0aGlzIGJ5dGUgbGVuZ3RoLlxuICAgIG9mZnNldCA9IG5ld0hUTUwubGVuZ3RoO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBieXRlbGVuZ3RoIGZvciB0aGUgdHJhbnNmZXIgYnVmZmVyLCBjb250YWlucyBvbmUgZXh0cmEgZm9yXG4gICAgLy8gdGhlIG9mZnNldC5cbiAgICB2YXIgdHJhbnNmZXJCeXRlTGVuZ3RoID0gbmV3QnVmZmVyLmJ5dGVMZW5ndGg7XG5cbiAgICAvLyBUaGlzIGJ1ZmZlciBzdGFydHMgd2l0aCB0aGUgb2Zmc2V0IGFuZCBjb250YWlucyB0aGUgZGF0YSB0byBiZSBjYXJyaWVkXG4gICAgLy8gdG8gdGhlIHdvcmtlci5cbiAgICB2YXIgdHJhbnNmZXJCdWZmZXIgPSBuZXdCdWZmZXI7XG5cbiAgICAvLyBTZXQgdGhlIG5ld0hUTUwgcGF5bG9hZC5cbiAgICAvL3RyYW5zZmVyQnVmZmVyLnNldChuZXdCdWZmZXIsIDApO1xuXG4gICAgLy8gQWRkIHByb3BlcnRpZXMgdG8gc2VuZCB0byB3b3JrZXIuXG4gICAgdHJhbnNmZXJPYmplY3Qub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIHRyYW5zZmVyT2JqZWN0LmJ1ZmZlciA9IHRyYW5zZmVyQnVmZmVyLmJ1ZmZlcjtcbiAgICB0cmFuc2Zlck9iamVjdC5pc0lubmVyID0gb3B0aW9ucy5pbm5lcjtcblxuICAgIC8vIFNldCBhIHJlbmRlciBsb2NrIGFzIHRvIG5vdCBmbG9vZCB0aGUgd29ya2VyLlxuICAgIGVsZW1lbnRNZXRhLmlzUmVuZGVyaW5nID0gdHJ1ZTtcblxuICAgIC8vIFRyYW5zZmVyIHRoaXMgYnVmZmVyIHRvIHRoZSB3b3JrZXIsIHdoaWNoIHdpbGwgdGFrZSBvdmVyIGFuZCBwcm9jZXNzIHRoZVxuICAgIC8vIG1hcmt1cC5cbiAgICB3b3JrZXIucG9zdE1lc3NhZ2UodHJhbnNmZXJPYmplY3QsIFt0cmFuc2ZlckJ1ZmZlci5idWZmZXJdKTtcblxuICAgIC8vIFdhaXQgZm9yIHRoZSB3b3JrZXIgdG8gZmluaXNoIHByb2Nlc3NpbmcgYW5kIHRoZW4gYXBwbHkgdGhlIHBhdGNoc2V0LlxuICAgIHdvcmtlci5vbm1lc3NhZ2UgPSBjb21wbGV0ZVdvcmtlclJlbmRlcihlbGVtZW50LCBlbGVtZW50TWV0YSk7XG4gIH0gZWxzZSBpZiAoIW9wdGlvbnMuZW5hYmxlV29ya2VyIHx8ICFfd29ya2VyQ3JlYXRlLmhhc1dvcmtlciB8fCAhZWxlbWVudE1ldGEuaGFzUmVuZGVyZWQpIHtcbiAgICB2YXIgZGF0YSA9IFtdO1xuICAgIHZhciBuZXdUcmVlID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbmV3SFRNTCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5ld1RyZWUgPSAoMCwgX3V0aWxQYXJzZXIucGFyc2VIVE1MKShuZXdIVE1MLCBvcHRpb25zLmlubmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3VHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkobmV3SFRNTCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaW5uZXIpIHtcbiAgICAgIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZTtcblxuICAgICAgbmV3VHJlZSA9IHtcbiAgICAgICAgY2hpbGROb2RlczogY2hpbGROb2RlcyxcblxuICAgICAgICBhdHRyaWJ1dGVzOiBlbGVtZW50TWV0YS5vbGRUcmVlLmF0dHJpYnV0ZXMsXG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRNZXRhLm9sZFRyZWUuZWxlbWVudCxcbiAgICAgICAgbm9kZU5hbWU6IGVsZW1lbnRNZXRhLm9sZFRyZWUubm9kZU5hbWUsXG4gICAgICAgIG5vZGVWYWx1ZTogZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlVmFsdWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIG9sZFRyZWVOYW1lID0gZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlTmFtZSB8fCAnJztcbiAgICB2YXIgbmV3Tm9kZU5hbWUgPSBuZXdUcmVlICYmIG5ld1RyZWUubm9kZU5hbWU7XG5cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBub2RlIHR5cGVzIG1hdGNoLCB0cnkgYW5kIGNvbXBhcmUgdGhlbS5cbiAgICBpZiAob2xkVHJlZU5hbWUgPT09IG5ld05vZGVOYW1lKSB7XG4gICAgICAvLyBTeW5jaHJvbml6ZSB0aGUgdHJlZS5cbiAgICAgIF9zeW5jMlsnZGVmYXVsdCddLmNhbGwoZGF0YSwgZWxlbWVudE1ldGEub2xkVHJlZSwgbmV3VHJlZSk7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSByZXBsYWNlIHRoZSB0b3AgbGV2ZWwgZWxlbWVudHMuXG4gICAgZWxzZSBpZiAobmV3SFRNTCkge1xuICAgICAgICBkYXRhW2RhdGEubGVuZ3RoXSA9IHtcbiAgICAgICAgICBfX2RvX186IDAsXG4gICAgICAgICAgb2xkOiBlbGVtZW50TWV0YS5vbGRUcmVlLFxuICAgICAgICAgICduZXcnOiBuZXdUcmVlXG4gICAgICAgIH07XG5cbiAgICAgICAgKDAsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQpKGVsZW1lbnRNZXRhLm9sZFRyZWUpO1xuXG4gICAgICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUgPSBuZXdUcmVlO1xuICAgICAgfVxuXG4gICAgLy8gUHJvY2VzcyB0aGUgZGF0YSBpbW1lZGlhdGVseS5cbiAgICAoMCwgX3BhdGNoZXNQcm9jZXNzMlsnZGVmYXVsdCddKShlbGVtZW50LCB7IGRhdGE6IGRhdGEgfSk7XG5cbiAgICAvLyBNYXJrIHRoYXQgdGhpcyBlbGVtZW50IGhhcyBpbml0aWFsbHkgcmVuZGVyZWQgYW5kIGlzIGRvbmUgcmVuZGVyaW5nLlxuICAgIGVsZW1lbnRNZXRhLmhhc1JlbmRlcmVkID0gdHJ1ZTtcbiAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgLy8gU2V0IHRoZSBpbm5lckhUTUwuXG4gICAgZWxlbWVudE1ldGEuX2lubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xuICAgIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgPSBlbGVtZW50Lm91dGVySFRNTDtcbiAgICBlbGVtZW50TWV0YS5fdGV4dENvbnRlbnQgPSBlbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuXG4gICAgLy8gQ2xlYW4gb3V0IHRoZSBwYXRjaGVzIGFycmF5LlxuICAgIGRhdGEubGVuZ3RoID0gMDtcblxuICAgIC8vIERpc3BhdGNoIGFuIGV2ZW50IG9uIHRoZSBlbGVtZW50IG9uY2UgcmVuZGVyaW5nIGhhcyBjb21wbGV0ZWQuXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBfY3VzdG9tRXZlbnQyWydkZWZhdWx0J10oJ3JlbmRlckNvbXBsZXRlJykpO1xuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDI1dlpHVXZjR0YwWTJndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPekpDUVVGM1FpeGpRVUZqT3pzN096UkNRVU5aTEd0Q1FVRnJRanM3TUVKQlEzUkNMR2RDUVVGblFqczdiMEpCUTNwRExGRkJRVkU3T3pzN2IwSkJRMUlzVVVGQlVUczdPenQ1UWtGRFVDeGxRVUZsT3pzd1FrRkRXQ3huUWtGQlowSTdPekpDUVVOcVFpeHBRa0ZCYVVJN08wbEJRVGxDTEU5QlFVODdPemhDUVVOUkxHOUNRVUZ2UWpzN096czdRVUZITDBNc1NVRkJUU3hUUVVGVExFZEJRVWNzU1VGQlNTeFBRVUZQTEVWQlFVVXNRMEZCUXpzN096czdPenM3T3p0QlFWVm9ReXhUUVVGVExHOUNRVUZ2UWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hYUVVGWExFVkJRVVU3UVVGRGJFUXNVMEZCVHl4VlFVRlRMRVZCUVVVc1JVRkJSVHRCUVVOc1FpeHhRMEZCWlN4UFFVRlBMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03TzBGQlJUVkNMR1ZCUVZjc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXp0QlFVTXpReXhsUVVGWExFTkJRVU1zVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNN1FVRkRNME1zWlVGQlZ5eERRVUZETEZsQlFWa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRE96dEJRVVV2UXl4clEwRkJZU3hEUVVGRE96dEJRVVZrTEdWQlFWY3NRMEZCUXl4WFFVRlhMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRMmhETEdWQlFWY3NRMEZCUXl4dlFrRkJiMElzUjBGQlJ5eEpRVUZKTEVOQlFVTTdPenRCUVVkNFF5eFhRVUZQTEVOQlFVTXNZVUZCWVN4RFFVRkRMRFpDUVVGblFpeG5Ra0ZCWjBJc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYcEVMRkZCUVVrc1YwRkJWeXhEUVVGRExGbEJRVmtzUlVGQlJUdEJRVU0xUWl4VlFVRkpMRlZCUVZVc1IwRkJSeXhYUVVGWExFTkJRVU1zV1VGQldTeERRVUZETzBGQlF6RkRMR2xDUVVGWExFTkJRVU1zV1VGQldTeEhRVUZITEZOQlFWTXNRMEZCUXpzN1FVRkZja01zWlVGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4VlFVRlZMRU5CUVVNc1QwRkJUeXhGUVVGRkxGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0TFFVTTFSRHRIUVVOR0xFTkJRVU03UTBGRFNEczdPenM3T3pzN1FVRlBUU3hUUVVGVExGZEJRVmNzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEYmtNc1RVRkJTU3hYUVVGWExFZEJRVWNzVTBGQlV5eERRVUZETEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03T3p0QlFVY3ZReXhOUVVGSkxGZEJRVmNzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEZEVJc1pVRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXp0SFFVTm9RenM3TzBGQlIwUXNUVUZCU1N4WFFVRlhMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRM1pDTEhORFFVRnBRaXhYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZEVNc2EwTkJRV0VzUTBGQlF6dEhRVU5tT3p0QlFVVkVMRmRCUVZNc1ZVRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBOQlF6TkNPenM3T3pzN096czdRVUZSVFN4VFFVRlRMRk5CUVZNc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlRzN1FVRkZia1FzVFVGQlNTeFBRVUZQTEU5QlFVOHNRMEZCUXl4WlFVRlpMRXRCUVVzc1UwRkJVeXhGUVVGRk8wRkJRemRETEZkQlFVOHNRMEZCUXl4WlFVRlpMRWRCUVVjc1VVRkJVU3hEUVVGRExHRkJRV0VzUTBGQlF6dEhRVU12UXpzN1FVRkZSQ3hOUVVGSkxGZEJRVmNzUjBGQlJ5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU12UXl4TlFVRkpMRTFCUVUwc1IwRkJSeXhMUVVGTExFTkJRVU03T3p0QlFVZHVRaXhYUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRenM3UVVGRmNFTXNUVUZCU1N4WFFVRlhMRU5CUVVNc1YwRkJWeXhGUVVGRk96dEJRVVV6UWl4bFFVRlhMRU5CUVVNc1dVRkJXU3hIUVVGSExFVkJRVVVzVDBGQlR5eEZRVUZRTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVZBc1QwRkJUeXhGUVVGRkxFTkJRVU03UVVGRGFFUXNWMEZCVHp0SFFVTlNPMEZCUTBRN096dEJRVWRGTEZOQlFVOHNRMEZCUXl4TFFVRkxMRWxCUVVrc1QwRkJUeXhEUVVGRExGTkJRVk1zUzBGQlN5eFBRVUZQT3pzN08wRkJTVGxETEVkQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1NVRkJTU3hQUVVGUExFTkJRVU1zVTBGQlV5eExRVUZMTEU5QlFVOHNSVUZETDBNN1FVRkJSU3hYUVVGUE8wZEJRVVU3TzBGQlJXSTdPenRCUVVkRkxFRkJRVU1zVTBGQlR5eERRVUZETEV0QlFVc3NTVUZCU1N4WFFVRlhMRU5CUVVNc1ZVRkJWU3hMUVVGTExFOUJRVThzUTBGQlF5eFRRVUZUT3pzN08wRkJTVGRFTEVkQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1NVRkJTU3hYUVVGWExFTkJRVU1zVlVGQlZTeExRVUZMTEU5QlFVOHNRMEZCUXl4VFFVRlRMRUZCUVVNN096dEJRVWN2UkN4aFFVRlhMRU5CUVVNc1dVRkJXU3hMUVVGTExFOUJRVThzUTBGQlF5eFhRVUZYTEVGQlFVTXNSVUZEYkVRN1FVRkRRU3hWUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZET3p0QlFVVmtMRkZCUVVrc1YwRkJWeXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU4yUWl4M1EwRkJhVUlzVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNSRExHOURRVUZoTEVOQlFVTTdTMEZEWmpzN1FVRkZSQ3hsUVVGWExFTkJRVU1zVDBGQlR5eEhRVUZITEhWQ1FVRlRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU12UXpzN096dEJRVWxFTEUxQlFVa3NUMEZCVHl4RFFVRkRMRmxCUVZrc01rSkJRV0VzU1VGQlNTeFhRVUZYTEVOQlFVTXNWMEZCVnl4RlFVRkZPenRCUVVWb1JTeFJRVUZKTEUxQlFVMHNSMEZCUnl4WFFVRlhMRU5CUVVNc1RVRkJUU3hIUVVGSExGZEJRVmNzUTBGQlF5eE5RVUZOTEVsQlFVa3NNa0pCUVdNc1EwRkJRenM3TzBGQlIzWkZMRkZCUVVrc1kwRkJZeXhIUVVGSExFVkJRVVVzUTBGQlF6czdPMEZCUjNoQ0xHdENRVUZqTEVOQlFVTXNTVUZCU1N4SFFVRkhMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZET3p0QlFVVnNSQ3hSUVVGSkxFMUJRVTBzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4dlFrRkJiMElzUlVGQlJUdEJRVU12UXl4dlFrRkJZeXhEUVVGRExFOUJRVThzUjBGQlJ5eFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRPMHRCUXpsRE96dEJRVVZFTEZGQlFVa3NUMEZCVHl4UFFVRlBMRXRCUVVzc1VVRkJVU3hGUVVGRk8wRkJReTlDTEc5Q1FVRmpMRU5CUVVNc1QwRkJUeXhIUVVGSExIVkNRVUZUTEU5QlFVOHNRMEZCUXl4RFFVRkRPenM3UVVGSE0wTXNhVUpCUVZjc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZET3pzN08wRkJTUzlDTEZsQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03T3p0QlFVZHVReXhaUVVGTkxFTkJRVU1zVTBGQlV5eEhRVUZITEc5Q1FVRnZRaXhEUVVGRExFOUJRVThzUlVGQlJTeFhRVUZYTEVOQlFVTXNRMEZCUXpzN1FVRkZPVVFzWVVGQlR6dExRVU5TT3pzN1FVRkhSQ3hSUVVGSkxFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdPenRCUVVkbUxGRkJRVWtzVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03T3p0QlFVZG9SQ3hWUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXpzN096dEJRVWw0UWl4UlFVRkpMR3RDUVVGclFpeEhRVUZITEZOQlFWTXNRMEZCUXl4VlFVRlZMRU5CUVVNN096czdRVUZKT1VNc1VVRkJTU3hqUVVGakxFZEJRVWNzVTBGQlV5eERRVUZET3pzN096czdRVUZOTDBJc2EwSkJRV01zUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUXk5Q0xHdENRVUZqTEVOQlFVTXNUVUZCVFN4SFFVRkhMR05CUVdNc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRE9VTXNhMEpCUVdNc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXpzN08wRkJSM1pETEdWQlFWY3NRMEZCUXl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE96czdPMEZCU1M5Q0xGVkJRVTBzUTBGQlF5eFhRVUZYTEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVOQlFVTTdPenRCUVVjMVJDeFZRVUZOTEVOQlFVTXNVMEZCVXl4SFFVRkhMRzlDUVVGdlFpeERRVUZETEU5QlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRenRIUVVNdlJDeE5RVU5KTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1dVRkJXU3hKUVVGSkxIZENRVUZWTEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1YwRkJWeXhGUVVGRk8wRkJRM2hGTEZGQlFVa3NTVUZCU1N4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOa0xGRkJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXpzN1FVRkZia0lzVVVGQlNTeFBRVUZQTEU5QlFVOHNTMEZCU3l4UlFVRlJMRVZCUVVVN1FVRkRMMElzWVVGQlR5eEhRVUZITERKQ1FVRlZMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVRTdTMEZETlVNc1RVRkRTVHRCUVVOSUxHRkJRVThzUjBGQlJ5eDFRa0ZCVXl4UFFVRlBMRU5CUVVNc1EwRkJRenRMUVVNM1FqczdRVUZGUkN4UlFVRkpMRTlCUVU4c1EwRkJReXhMUVVGTExFVkJRVVU3UVVGRGFrSXNWVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRE96dEJRVVY2UWl4aFFVRlBMRWRCUVVjN1FVRkRVaXhyUWtGQlZTeEZRVUZXTEZWQlFWVTdPMEZCUlZZc2EwSkJRVlVzUlVGQlJTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVN1FVRkRNVU1zWlVGQlR5eEZRVUZGTEZkQlFWY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUenRCUVVOd1F5eG5Ra0ZCVVN4RlFVRkZMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVUdEJRVU4wUXl4cFFrRkJVeXhGUVVGRkxGZEJRVmNzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXp0UFFVTjZReXhEUVVGRE8wdEJRMGc3TzBGQlJVUXNVVUZCU1N4WFFVRlhMRWRCUVVjc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eFJRVUZSTEVsQlFVa3NSVUZCUlN4RFFVRkRPMEZCUTNKRUxGRkJRVWtzVjBGQlZ5eEhRVUZITEU5QlFVOHNTVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRE96czdRVUZIT1VNc1VVRkJTU3hYUVVGWExFdEJRVXNzVjBGQlZ5eEZRVUZGT3p0QlFVVXZRaXgzUWtGQlV5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRmRCUVZjc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdTMEZEYmtRN08xTkJSVWtzU1VGQlNTeFBRVUZQTEVWQlFVVTdRVUZEYUVJc1dVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnp0QlFVTnNRaXhuUWtGQlRTeEZRVUZGTEVOQlFVTTdRVUZEVkN4aFFVRkhMRVZCUVVVc1YwRkJWeXhEUVVGRExFOUJRVTg3UVVGRGVFSXNhVUpCUVVzc1QwRkJUenRUUVVOaUxFTkJRVU03TzBGQlJVWXNNRU5CUVdsQ0xGZEJRVmNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXpzN1FVRkZkRU1zYlVKQlFWY3NRMEZCUXl4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRE8wOUJReTlDT3pzN1FVRkhSQ3h4UTBGQlpTeFBRVUZQTEVWQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVvc1NVRkJTU3hGUVVGRkxFTkJRVU1zUTBGQlF6czdPMEZCUjJ4RExHVkJRVmNzUTBGQlF5eFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUXk5Q0xHVkJRVmNzUTBGQlF5eFhRVUZYTEVkQlFVY3NTMEZCU3l4RFFVRkRPenM3UVVGSGFFTXNaVUZCVnl4RFFVRkRMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETzBGQlF6TkRMR1ZCUVZjc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXp0QlFVTXpReXhsUVVGWExFTkJRVU1zV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN08wRkJSUzlETEd0RFFVRmhMRU5CUVVNN096dEJRVWRrTEZGQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE96czdRVUZIYUVJc1YwRkJUeXhEUVVGRExHRkJRV0VzUTBGQlF5dzJRa0ZCWjBJc1owSkJRV2RDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUXpGRU8wTkJRMFlpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2Ym05a1pTOXdZWFJqYUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQkRkWE4wYjIxRmRtVnVkQ0JtY205dElDZGpkWE4wYjIwdFpYWmxiblFuTzF4dWFXMXdiM0owSUhzZ1kzSmxZWFJsSUdGeklHTnlaV0YwWlZkdmNtdGxjaXdnYUdGelYyOXlhMlZ5SUgwZ1puSnZiU0FuTGk0dmQyOXlhMlZ5TDJOeVpXRjBaU2M3WEc1cGJYQnZjblFnZXlCamJHVmhiazFsYlc5eWVTd2dkVzV3Y205MFpXTjBSV3hsYldWdWRDQjlJR1p5YjIwZ0p5NHVMM1YwYVd3dmJXVnRiM0o1Snp0Y2JtbHRjRzl5ZENCdFlXdGxUbTlrWlNCbWNtOXRJQ2N1TDIxaGEyVW5PMXh1YVcxd2IzSjBJSE41Ym1OT2IyUmxJR1p5YjIwZ0p5NHZjM2x1WXljN1hHNXBiWEJ2Y25RZ2V5QndiMjlzY3lCOUlHWnliMjBnSnk0dUwzVjBhV3d2Y0c5dmJITW5PMXh1YVcxd2IzSjBJSHNnY0dGeWMyVklWRTFNSUgwZ1puSnZiU0FuTGk0dmRYUnBiQzl3WVhKelpYSW5PMXh1YVcxd2IzSjBJQ29nWVhNZ1luVm1abVZ5Y3lCbWNtOXRJQ2N1TGk5MWRHbHNMMkoxWm1abGNuTW5PMXh1YVcxd2IzSjBJSEJ5YjJObGMzTlFZWFJqYUdWeklHWnliMjBnSnk0dUwzQmhkR05vWlhNdmNISnZZMlZ6Y3ljN1hHNWNiaTh2SUVOaFkyaGxJSEJ5WldKMWFXeDBJSFJ5WldWeklHRnVaQ0JzYjI5cmRYQWdZbmtnWld4bGJXVnVkQzVjYm1OdmJuTjBJRlJ5WldWRFlXTm9aU0E5SUc1bGR5QlhaV0ZyVFdGd0tDazdYRzVjYmk4cUtseHVJQ29nVjJobGJpQjBhR1VnZDI5eWEyVnlJR052YlhCc1pYUmxjeXdnWTJ4bFlXNGdkWEFnYldWdGIzSjVJR0Z1WkNCelkyaGxaSFZzWlNCMGFHVWdibVY0ZENCeVpXNWtaWElnYVdaY2JpQXFJRzVsWTJWemMyRnllUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdaV3hsYldWdWRGeHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUk5aWFJoWEc0Z0tpQkFjbVYwZFhKdVhHNGdLaTljYm1aMWJtTjBhVzl1SUdOdmJYQnNaWFJsVjI5eWEyVnlVbVZ1WkdWeUtHVnNaVzFsYm5Rc0lHVnNaVzFsYm5STlpYUmhLU0I3WEc0Z0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlobGRpa2dlMXh1SUNBZ0lIQnliMk5sYzNOUVlYUmphR1Z6S0dWc1pXMWxiblFzSUdWMktUdGNibHh1SUNBZ0lHVnNaVzFsYm5STlpYUmhMbDlwYm01bGNraFVUVXdnUFNCbGJHVnRaVzUwTG1sdWJtVnlTRlJOVER0Y2JpQWdJQ0JsYkdWdFpXNTBUV1YwWVM1ZmIzVjBaWEpJVkUxTUlEMGdaV3hsYldWdWRDNXZkWFJsY2toVVRVdzdYRzRnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXVYM1JsZUhSRGIyNTBaVzUwSUQwZ1pXeGxiV1Z1ZEM1MFpYaDBRMjl1ZEdWdWREdGNibHh1SUNBZ0lHTnNaV0Z1VFdWdGIzSjVLQ2s3WEc1Y2JpQWdJQ0JsYkdWdFpXNTBUV1YwWVM1cGMxSmxibVJsY21sdVp5QTlJR1poYkhObE8xeHVJQ0FnSUdWc1pXMWxiblJOWlhSaExtaGhjMUpsYm1SbGNtVmtWbWxoVjI5eWEyVnlJRDBnZEhKMVpUdGNibHh1SUNBZ0lDOHZJRVJwYzNCaGRHTm9JR0Z1SUdWMlpXNTBJRzl1SUhSb1pTQmxiR1Z0Wlc1MElHOXVZMlVnY21WdVpHVnlhVzVuSUdoaGN5QmpiMjF3YkdWMFpXUXVYRzRnSUNBZ1pXeGxiV1Z1ZEM1a2FYTndZWFJqYUVWMlpXNTBLRzVsZHlCRGRYTjBiMjFGZG1WdWRDZ25jbVZ1WkdWeVEyOXRjR3hsZEdVbktTazdYRzVjYmlBZ0lDQnBaaUFvWld4bGJXVnVkRTFsZEdFdWNtVnVaR1Z5UW5WbVptVnlLU0I3WEc0Z0lDQWdJQ0JzWlhRZ2JtVjRkRkpsYm1SbGNpQTlJR1ZzWlcxbGJuUk5aWFJoTG5KbGJtUmxja0oxWm1abGNqdGNiaUFnSUNBZ0lHVnNaVzFsYm5STlpYUmhMbkpsYm1SbGNrSjFabVpsY2lBOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lDQWdjR0YwWTJoT2IyUmxLR1ZzWlcxbGJuUXNJRzVsZUhSU1pXNWtaWEl1Ym1WM1NGUk5UQ3dnYm1WNGRGSmxibVJsY2k1dmNIUnBiMjV6S1R0Y2JpQWdJQ0I5WEc0Z0lIMDdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1VtVnNaV0Z6WlNkeklIUm9aU0JoYkd4dlkyRjBaV1FnYjJKcVpXTjBjeUJoYm1RZ2NtVmplV05zWlhNZ2FXNTBaWEp1WVd3Z2JXVnRiM0o1TGx4dUlDcGNiaUFxSUVCd1lYSmhiU0JsYkdWdFpXNTBYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCeVpXeGxZWE5sVG05a1pTaGxiR1Z0Wlc1MEtTQjdYRzRnSUd4bGRDQmxiR1Z0Wlc1MFRXVjBZU0E5SUZSeVpXVkRZV05vWlM1blpYUW9aV3hsYldWdWRDa2dmSHdnZTMwN1hHNWNiaUFnTHk4Z1NXWWdkR2hsY21VZ2FYTWdZU0IzYjNKclpYSWdZWE56YjJOcFlYUmxaQ0IzYVhSb0lIUm9hWE1nWld4bGJXVnVkQ3dnZEdobGJpQnJhV3hzSUdsMExseHVJQ0JwWmlBb1pXeGxiV1Z1ZEUxbGRHRXVkMjl5YTJWeUtTQjdYRzRnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXVkMjl5YTJWeUxuUmxjbTFwYm1GMFpTZ3BPMXh1SUNCOVhHNWNiaUFnTHk4Z1NXWWdkR2hsY21VZ2QyRnpJR0VnZEhKbFpTQnpaWFFnZFhBc0lISmxZM2xqYkdVZ2RHaGxJRzFsYlc5eWVTQmhiR3h2WTJGMFpXUWdabTl5SUdsMExseHVJQ0JwWmlBb1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTa2dlMXh1SUNBZ0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5Rb1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTazdYRzRnSUNBZ1kyeGxZVzVOWlcxdmNua29LVHRjYmlBZ2ZWeHVYRzRnSUZSeVpXVkRZV05vWlM1a1pXeGxkR1VvWld4bGJXVnVkQ2s3WEc1OVhHNWNiaThxS2x4dUlDb2dVR0YwWTJobGN5QmhiaUJsYkdWdFpXNTBKM01nUkU5TklIUnZJRzFoZEdOb0lIUm9ZWFFnYjJZZ2RHaGxJSEJoYzNObFpDQnRZWEpyZFhBdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblJjYmlBcUlFQndZWEpoYlNCdVpYZElWRTFNWEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQndZWFJqYUU1dlpHVW9aV3hsYldWdWRDd2dibVYzU0ZSTlRDd2diM0IwYVc5dWN5a2dlMXh1SUNBdkx5QkZibk4xY21VZ2RHaGhkQ0IwYUdVZ1pHOWpkVzFsYm5RZ1pHbHpZV0pzWlNCM2IzSnJaWElnYVhNZ1lXeDNZWGx6SUhCcFkydGxaQ0IxY0M1Y2JpQWdhV1lnS0hSNWNHVnZaaUJ2Y0hScGIyNXpMbVZ1WVdKc1pWZHZjbXRsY2lBaFBUMGdKMkp2YjJ4bFlXNG5LU0I3WEc0Z0lDQWdiM0IwYVc5dWN5NWxibUZpYkdWWGIzSnJaWElnUFNCa2IyTjFiV1Z1ZEM1RlRrRkNURVZmVjA5U1MwVlNPMXh1SUNCOVhHNWNiaUFnYkdWMElHVnNaVzFsYm5STlpYUmhJRDBnVkhKbFpVTmhZMmhsTG1kbGRDaGxiR1Z0Wlc1MEtTQjhmQ0I3ZlR0Y2JpQWdiR1YwSUc1bGQwOXNaQ0E5SUdaaGJITmxPMXh1WEc0Z0lDOHZJRUZzZDJGNWN5Qmxibk4xY21VZ2RHaGxJRzF2YzNRZ2RYQXRkRzh0WkdGMFpTQnRaWFJoSUc5aWFtVmpkQ0JwY3lCemRHOXlaV1F1WEc0Z0lGUnlaV1ZEWVdOb1pTNXpaWFFvWld4bGJXVnVkQ3dnWld4bGJXVnVkRTFsZEdFcE8xeHVYRzRnSUdsbUlDaGxiR1Z0Wlc1MFRXVjBZUzVwYzFKbGJtUmxjbWx1WnlrZ2UxeHVJQ0FnSUM4dklFRmtaQ0IwYUdseklHNWxkeUJ5Wlc1a1pYSWdhVzUwYnlCMGFHVWdZblZtWm1WeUlIRjFaWFZsTGx4dUlDQWdJR1ZzWlcxbGJuUk5aWFJoTG5KbGJtUmxja0oxWm1abGNpQTlJSHNnYm1WM1NGUk5UQ3dnYjNCMGFXOXVjeUI5TzF4dUlDQWdJSEpsZEhWeWJqdGNiaUFnZlZ4dUlDQnBaaUFvWEc0Z0lDQWdMeThnU1dZZ2RHaGxJRzl3WlhKaGRHbHZiaUJwY3lCZ2FXNXVaWEpJVkUxTVlDd2dZblYwSUhSb1pTQmpiMjUwWlc1MGN5Qm9ZWFpsYmlkMElHTm9ZVzVuWldRc1hHNGdJQ0FnTHk4Z1lXSnZjblF1WEc0Z0lDQWdiM0IwYVc5dWN5NXBibTVsY2lBbUppQmxiR1Z0Wlc1MExtbHVibVZ5U0ZSTlRDQTlQVDBnYm1WM1NGUk5UQ0I4ZkZ4dVhHNGdJQ0FnTHk4Z1NXWWdkR2hsSUc5d1pYSmhkR2x2YmlCcGN5QmdiM1YwWlhKSVZFMU1ZQ3dnWW5WMElIUm9aU0JqYjI1MFpXNTBjeUJvWVhabGJpZDBJR05vWVc1blpXUXNYRzRnSUNBZ0x5OGdZV0p2Y25RdVhHNGdJQ0FnSVc5d2RHbHZibk11YVc1dVpYSWdKaVlnWld4bGJXVnVkQzV2ZFhSbGNraFVUVXdnUFQwOUlHNWxkMGhVVFV4Y2JpQWdLU0I3SUhKbGRIVnlianNnZlZ4dVhHNGdJR2xtSUNoY2JpQWdJQ0F2THlCSlppQjBhR1VnYjNCbGNtRjBhVzl1SUdseklHQnBibTVsY2toVVRVeGdMQ0JoYm1RZ2RHaGxJR04xY25KbGJuUWdaV3hsYldWdWRDZHpJR052Ym5SbGJuUnpJR2hoZG1WY2JpQWdJQ0F2THlCamFHRnVaMlZrSUhOcGJtTmxJSFJvWlNCc1lYTjBJSEpsYm1SbGNpQnNiMjl3TENCeVpXTmhiR04xYkdGMFpTQjBhR1VnZEhKbFpTNWNiaUFnSUNBb2IzQjBhVzl1Y3k1cGJtNWxjaUFtSmlCbGJHVnRaVzUwVFdWMFlTNWZhVzV1WlhKSVZFMU1JQ0U5UFNCbGJHVnRaVzUwTG1sdWJtVnlTRlJOVENrZ2ZIeGNibHh1SUNBZ0lDOHZJRWxtSUhSb1pTQnZjR1Z5WVhScGIyNGdhWE1nWUc5MWRHVnlTRlJOVEdBc0lHRnVaQ0IwYUdVZ1kzVnljbVZ1ZENCbGJHVnRaVzUwSjNNZ1kyOXVkR1Z1ZEhNZ2FHRjJaVnh1SUNBZ0lDOHZJR05vWVc1blpXUWdjMmx1WTJVZ2RHaGxJR3hoYzNRZ2NtVnVaR1Z5SUd4dmIzQXNJSEpsWTJGc1kzVnNZWFJsSUhSb1pTQjBjbVZsTGx4dUlDQWdJQ2doYjNCMGFXOXVjeTVwYm01bGNpQW1KaUJsYkdWdFpXNTBUV1YwWVM1ZmIzVjBaWEpJVkUxTUlDRTlQU0JsYkdWdFpXNTBMbTkxZEdWeVNGUk5UQ2tnZkh4Y2JseHVJQ0FnSUM4dklFbG1JSFJvWlNCMFpYaDBJR052Ym5SbGJuUWdaWFpsY2lCamFHRnVaMlZ6TENCeVpXTmhiR04xYkdGMFpTQjBhR1VnZEhKbFpTNWNiaUFnSUNBb1pXeGxiV1Z1ZEUxbGRHRXVYM1JsZUhSRGIyNTBaVzUwSUNFOVBTQmxiR1Z0Wlc1MExuUmxlSFJEYjI1MFpXNTBLVnh1SUNBcElIdGNiaUFnSUNCdVpYZFBiR1FnUFNCMGNuVmxPMXh1WEc0Z0lDQWdhV1lnS0dWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVcElIdGNiaUFnSUNBZ0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5Rb1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTazdYRzRnSUNBZ0lDQmpiR1ZoYmsxbGJXOXllU2dwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VnUFNCdFlXdGxUbTlrWlNobGJHVnRaVzUwTENCMGNuVmxLVHRjYmlBZ2ZWeHVYRzRnSUM4dklGZHBiR3dnZDJGdWRDQjBieUJsYm5OMWNtVWdkR2hoZENCMGFHVWdabWx5YzNRZ2NtVnVaR1Z5SUhkbGJuUWdkR2h5YjNWbmFDd2dkR2hsSUhkdmNtdGxjaUJqWVc1Y2JpQWdMeThnZEdGclpTQmhJR0pwZENCMGJ5QnpkR0Z5ZEhWd0lHRnVaQ0IzWlNCM1lXNTBJSFJ2SUhOb2IzY2dZMmhoYm1kbGN5QmhjeUJ6YjI5dUlHRnpJSEJ2YzNOcFlteGxMbHh1SUNCcFppQW9iM0IwYVc5dWN5NWxibUZpYkdWWGIzSnJaWElnSmlZZ2FHRnpWMjl5YTJWeUlDWW1JR1ZzWlcxbGJuUk5aWFJoTG1oaGMxSmxibVJsY21Wa0tTQjdYRzRnSUNBZ0x5OGdRM0psWVhSbElHRWdkMjl5YTJWeUlHWnZjaUIwYUdseklHVnNaVzFsYm5RdVhHNGdJQ0FnYkdWMElIZHZjbXRsY2lBOUlHVnNaVzFsYm5STlpYUmhMbmR2Y210bGNpQTlJR1ZzWlcxbGJuUk5aWFJoTG5kdmNtdGxjaUI4ZkNCamNtVmhkR1ZYYjNKclpYSW9LVHRjYmx4dUlDQWdJQzh2SUVGMGRHRmphQ0JoYkd3Z2NISnZjR1Z5ZEdsbGN5Qm9aWEpsSUhSdklIUnlZVzV6Y0c5eWRDNWNiaUFnSUNCc1pYUWdkSEpoYm5ObVpYSlBZbXBsWTNRZ1BTQjdmVHRjYmx4dUlDQWdJQzh2SUVGMGRHRmphQ0IwYUdVZ2NHRnlaVzUwSUdWc1pXMWxiblFuY3lCMWRXbGtMbHh1SUNBZ0lIUnlZVzV6Wm1WeVQySnFaV04wTG5WMWFXUWdQU0JsYkdWdFpXNTBUV1YwWVM1dmJHUlVjbVZsTG1Wc1pXMWxiblE3WEc1Y2JpQWdJQ0JwWmlBb2JtVjNUMnhrSUh4OElDRmxiR1Z0Wlc1MFRXVjBZUzVvWVhOU1pXNWtaWEpsWkZacFlWZHZjbXRsY2lrZ2UxeHVJQ0FnSUNBZ2RISmhibk5tWlhKUFltcGxZM1F1YjJ4a1ZISmxaU0E5SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCdVpYZElWRTFNSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdkSEpoYm5ObVpYSlBZbXBsWTNRdWJtVjNWSEpsWlNBOUlHMWhhMlZPYjJSbEtHNWxkMGhVVFV3cE8xeHVYRzRnSUNBZ0lDQXZMeUJUWlhRZ1lTQnlaVzVrWlhJZ2JHOWpheUJoY3lCMGJ5QnViM1FnWm14dmIyUWdkR2hsSUhkdmNtdGxjaTVjYmlBZ0lDQWdJR1ZzWlcxbGJuUk5aWFJoTG1selVtVnVaR1Z5YVc1bklEMGdkSEoxWlR0Y2JseHVJQ0FnSUNBZ0x5OGdWSEpoYm5ObVpYSWdkR2hwY3lCaWRXWm1aWElnZEc4Z2RHaGxJSGR2Y210bGNpd2dkMmhwWTJnZ2QybHNiQ0IwWVd0bElHOTJaWElnWVc1a0lIQnliMk5sYzNNZ2RHaGxYRzRnSUNBZ0lDQXZMeUJ0WVhKcmRYQXVYRzRnSUNBZ0lDQjNiM0pyWlhJdWNHOXpkRTFsYzNOaFoyVW9kSEpoYm5ObVpYSlBZbXBsWTNRcE8xeHVYRzRnSUNBZ0lDQXZMeUJYWVdsMElHWnZjaUIwYUdVZ2QyOXlhMlZ5SUhSdklHWnBibWx6YUNCd2NtOWpaWE56YVc1bklHRnVaQ0IwYUdWdUlHRndjR3g1SUhSb1pTQndZWFJqYUhObGRDNWNiaUFnSUNBZ0lIZHZjbXRsY2k1dmJtMWxjM05oWjJVZ1BTQmpiMjF3YkdWMFpWZHZjbXRsY2xKbGJtUmxjaWhsYkdWdFpXNTBMQ0JsYkdWdFpXNTBUV1YwWVNrN1hHNWNiaUFnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCVmMyVmtJSFJ2SUhOd1pXTnBabmtnZEdobElHOTFkR1Z5U0ZSTlRDQnZabVp6WlhRZ2FXWWdjR0Z6YzJsdVp5QjBhR1VnY0dGeVpXNTBKM01nYldGeWEzVndMbHh1SUNBZ0lHeGxkQ0J2Wm1aelpYUWdQU0F3TzF4dVhHNGdJQ0FnTHk4Z1EzSmhablFnWVNCdVpYY2dZblZtWm1WeUlIZHBkR2dnZEdobElHNWxkeUJqYjI1MFpXNTBjeTVjYmlBZ0lDQnNaWFFnYm1WM1FuVm1abVZ5SUQwZ1luVm1abVZ5Y3k1emRISnBibWRVYjBKMVptWmxjaWh1WlhkSVZFMU1LVHRjYmx4dUlDQWdJQzh2SUZObGRDQjBhR1VnYjJabWMyVjBJSFJ2SUdKbElIUm9hWE1nWW5sMFpTQnNaVzVuZEdndVhHNGdJQ0FnYjJabWMyVjBJRDBnYm1WM1NGUk5UQzVzWlc1bmRHZzdYRzVjYmlBZ0lDQXZMeUJEWVd4amRXeGhkR1VnZEdobElHSjVkR1ZzWlc1bmRHZ2dabTl5SUhSb1pTQjBjbUZ1YzJabGNpQmlkV1ptWlhJc0lHTnZiblJoYVc1eklHOXVaU0JsZUhSeVlTQm1iM0pjYmlBZ0lDQXZMeUIwYUdVZ2IyWm1jMlYwTGx4dUlDQWdJR3hsZENCMGNtRnVjMlpsY2tKNWRHVk1aVzVuZEdnZ1BTQnVaWGRDZFdabVpYSXVZbmwwWlV4bGJtZDBhRHRjYmx4dUlDQWdJQzh2SUZSb2FYTWdZblZtWm1WeUlITjBZWEowY3lCM2FYUm9JSFJvWlNCdlptWnpaWFFnWVc1a0lHTnZiblJoYVc1eklIUm9aU0JrWVhSaElIUnZJR0psSUdOaGNuSnBaV1JjYmlBZ0lDQXZMeUIwYnlCMGFHVWdkMjl5YTJWeUxseHVJQ0FnSUd4bGRDQjBjbUZ1YzJabGNrSjFabVpsY2lBOUlHNWxkMEoxWm1abGNqdGNibHh1SUNBZ0lDOHZJRk5sZENCMGFHVWdibVYzU0ZSTlRDQndZWGxzYjJGa0xseHVJQ0FnSUM4dmRISmhibk5tWlhKQ2RXWm1aWEl1YzJWMEtHNWxkMEoxWm1abGNpd2dNQ2s3WEc1Y2JpQWdJQ0F2THlCQlpHUWdjSEp2Y0dWeWRHbGxjeUIwYnlCelpXNWtJSFJ2SUhkdmNtdGxjaTVjYmlBZ0lDQjBjbUZ1YzJabGNrOWlhbVZqZEM1dlptWnpaWFFnUFNCdlptWnpaWFE3WEc0Z0lDQWdkSEpoYm5ObVpYSlBZbXBsWTNRdVluVm1abVZ5SUQwZ2RISmhibk5tWlhKQ2RXWm1aWEl1WW5WbVptVnlPMXh1SUNBZ0lIUnlZVzV6Wm1WeVQySnFaV04wTG1selNXNXVaWElnUFNCdmNIUnBiMjV6TG1sdWJtVnlPMXh1WEc0Z0lDQWdMeThnVTJWMElHRWdjbVZ1WkdWeUlHeHZZMnNnWVhNZ2RHOGdibTkwSUdac2IyOWtJSFJvWlNCM2IzSnJaWEl1WEc0Z0lDQWdaV3hsYldWdWRFMWxkR0V1YVhOU1pXNWtaWEpwYm1jZ1BTQjBjblZsTzF4dVhHNGdJQ0FnTHk4Z1ZISmhibk5tWlhJZ2RHaHBjeUJpZFdabVpYSWdkRzhnZEdobElIZHZjbXRsY2l3Z2QyaHBZMmdnZDJsc2JDQjBZV3RsSUc5MlpYSWdZVzVrSUhCeWIyTmxjM01nZEdobFhHNGdJQ0FnTHk4Z2JXRnlhM1Z3TGx4dUlDQWdJSGR2Y210bGNpNXdiM04wVFdWemMyRm5aU2gwY21GdWMyWmxjazlpYW1WamRDd2dXM1J5WVc1elptVnlRblZtWm1WeUxtSjFabVpsY2wwcE8xeHVYRzRnSUNBZ0x5OGdWMkZwZENCbWIzSWdkR2hsSUhkdmNtdGxjaUIwYnlCbWFXNXBjMmdnY0hKdlkyVnpjMmx1WnlCaGJtUWdkR2hsYmlCaGNIQnNlU0IwYUdVZ2NHRjBZMmh6WlhRdVhHNGdJQ0FnZDI5eWEyVnlMbTl1YldWemMyRm5aU0E5SUdOdmJYQnNaWFJsVjI5eWEyVnlVbVZ1WkdWeUtHVnNaVzFsYm5Rc0lHVnNaVzFsYm5STlpYUmhLVHRjYmlBZ2ZWeHVJQ0JsYkhObElHbG1JQ2doYjNCMGFXOXVjeTVsYm1GaWJHVlhiM0pyWlhJZ2ZId2dJV2hoYzFkdmNtdGxjaUI4ZkNBaFpXeGxiV1Z1ZEUxbGRHRXVhR0Z6VW1WdVpHVnlaV1FwSUh0Y2JpQWdJQ0JzWlhRZ1pHRjBZU0E5SUZ0ZE8xeHVJQ0FnSUd4bGRDQnVaWGRVY21WbElEMGdiblZzYkR0Y2JseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2JtVjNTRlJOVENBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJRzVsZDFSeVpXVWdQU0J3WVhKelpVaFVUVXdvYm1WM1NGUk5UQ3dnYjNCMGFXOXVjeTVwYm01bGNpbGNiaUFnSUNCOVhHNGdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQnVaWGRVY21WbElEMGdiV0ZyWlU1dlpHVW9ibVYzU0ZSTlRDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVhVzV1WlhJcElIdGNiaUFnSUNBZ0lHeGxkQ0JqYUdsc1pFNXZaR1Z6SUQwZ2JtVjNWSEpsWlR0Y2JseHVJQ0FnSUNBZ2JtVjNWSEpsWlNBOUlIdGNiaUFnSUNBZ0lDQWdZMmhwYkdST2IyUmxjeXhjYmx4dUlDQWdJQ0FnSUNCaGRIUnlhV0oxZEdWek9pQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE1zWEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblE2SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVdVpXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ2JtOWtaVTVoYldVNklHVnNaVzFsYm5STlpYUmhMbTlzWkZSeVpXVXVibTlrWlU1aGJXVXNYRzRnSUNBZ0lDQWdJRzV2WkdWV1lXeDFaVG9nWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlM1dWIyUmxWbUZzZFdWY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYkdWMElHOXNaRlJ5WldWT1lXMWxJRDBnWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlM1dWIyUmxUbUZ0WlNCOGZDQW5KenRjYmlBZ0lDQnNaWFFnYm1WM1RtOWtaVTVoYldVZ1BTQnVaWGRVY21WbElDWW1JRzVsZDFSeVpXVXVibTlrWlU1aGJXVTdYRzVjYmlBZ0lDQXZMeUJKWmlCMGFHVWdaV3hsYldWdWRDQnViMlJsSUhSNWNHVnpJRzFoZEdOb0xDQjBjbmtnWVc1a0lHTnZiWEJoY21VZ2RHaGxiUzVjYmlBZ0lDQnBaaUFvYjJ4a1ZISmxaVTVoYldVZ1BUMDlJRzVsZDA1dlpHVk9ZVzFsS1NCN1hHNGdJQ0FnSUNBdkx5QlRlVzVqYUhKdmJtbDZaU0IwYUdVZ2RISmxaUzVjYmlBZ0lDQWdJSE41Ym1OT2IyUmxMbU5oYkd3b1pHRjBZU3dnWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlN3Z2JtVjNWSEpsWlNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUU5MGFHVnlkMmx6WlNCeVpYQnNZV05sSUhSb1pTQjBiM0FnYkdWMlpXd2daV3hsYldWdWRITXVYRzRnSUNBZ1pXeHpaU0JwWmlBb2JtVjNTRlJOVENrZ2UxeHVJQ0FnSUNBZ1pHRjBZVnRrWVhSaExteGxibWQwYUYwZ1BTQjdYRzRnSUNBZ0lDQWdJRjlmWkc5Zlh6b2dNQ3hjYmlBZ0lDQWdJQ0FnYjJ4a09pQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMRnh1SUNBZ0lDQWdJQ0J1WlhjNklHNWxkMVJ5WldWY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5Rb1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTazdYRzVjYmlBZ0lDQWdJR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VnUFNCdVpYZFVjbVZsTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUZCeWIyTmxjM01nZEdobElHUmhkR0VnYVcxdFpXUnBZWFJsYkhrdVhHNGdJQ0FnY0hKdlkyVnpjMUJoZEdOb1pYTW9aV3hsYldWdWRDd2dleUJrWVhSaElIMHBPMXh1WEc0Z0lDQWdMeThnVFdGeWF5QjBhR0YwSUhSb2FYTWdaV3hsYldWdWRDQm9ZWE1nYVc1cGRHbGhiR3g1SUhKbGJtUmxjbVZrSUdGdVpDQnBjeUJrYjI1bElISmxibVJsY21sdVp5NWNiaUFnSUNCbGJHVnRaVzUwVFdWMFlTNW9ZWE5TWlc1a1pYSmxaQ0E5SUhSeWRXVTdYRzRnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXVhWE5TWlc1a1pYSnBibWNnUFNCbVlXeHpaVHRjYmx4dUlDQWdJQzh2SUZObGRDQjBhR1VnYVc1dVpYSklWRTFNTGx4dUlDQWdJR1ZzWlcxbGJuUk5aWFJoTGw5cGJtNWxja2hVVFV3Z1BTQmxiR1Z0Wlc1MExtbHVibVZ5U0ZSTlREdGNiaUFnSUNCbGJHVnRaVzUwVFdWMFlTNWZiM1YwWlhKSVZFMU1JRDBnWld4bGJXVnVkQzV2ZFhSbGNraFVUVXc3WEc0Z0lDQWdaV3hsYldWdWRFMWxkR0V1WDNSbGVIUkRiMjUwWlc1MElEMGdaV3hsYldWdWRDNTBaWGgwUTI5dWRHVnVkRHRjYmx4dUlDQWdJR05zWldGdVRXVnRiM0o1S0NrN1hHNWNiaUFnSUNBdkx5QkRiR1ZoYmlCdmRYUWdkR2hsSUhCaGRHTm9aWE1nWVhKeVlYa3VYRzRnSUNBZ1pHRjBZUzVzWlc1bmRHZ2dQU0F3TzF4dVhHNGdJQ0FnTHk4Z1JHbHpjR0YwWTJnZ1lXNGdaWFpsYm5RZ2IyNGdkR2hsSUdWc1pXMWxiblFnYjI1alpTQnlaVzVrWlhKcGJtY2dhR0Z6SUdOdmJYQnNaWFJsWkM1Y2JpQWdJQ0JsYkdWdFpXNTBMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0NkeVpXNWtaWEpEYjIxd2JHVjBaU2NwS1R0Y2JpQWdmVnh1ZlZ4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc3luYztcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbE1lbW9yeSA9IHJlcXVpcmUoJy4uL3V0aWwvbWVtb3J5Jyk7XG5cbnZhciBwb29scyA9IF91dGlsUG9vbHMucG9vbHM7XG52YXIgcHJvdGVjdEVsZW1lbnQgPSBfdXRpbE1lbW9yeS5wcm90ZWN0RWxlbWVudDtcbnZhciB1bnByb3RlY3RFbGVtZW50ID0gX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudDtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4vKipcbiAqIFN5bmNocm9uaXplcyBjaGFuZ2VzIGZyb20gdGhlIG5ld1RyZWUgaW50byB0aGUgb2xkVHJlZS5cbiAqXG4gKiBAcGFyYW0gb2xkVHJlZVxuICogQHBhcmFtIG5ld1RyZWVcbiAqL1xuXG5mdW5jdGlvbiBzeW5jKG9sZFRyZWUsIG5ld1RyZWUpIHtcbiAgdmFyIHBhdGNoZXMgPSB0aGlzO1xuICB2YXIgb2xkQ2hpbGROb2RlcyA9IG9sZFRyZWUuY2hpbGROb2RlcztcbiAgdmFyIG9sZENoaWxkTm9kZXNMZW5ndGggPSBvbGRDaGlsZE5vZGVzID8gb2xkQ2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuICB2YXIgb2xkRWxlbWVudCA9IG9sZFRyZWUuZWxlbWVudDtcblxuICBpZiAoIW5ld1RyZWUpIHtcbiAgICB2YXIgcmVtb3ZlZCA9IG9sZENoaWxkTm9kZXMuc3BsaWNlKDAsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogLTEsIGVsZW1lbnQ6IG9sZEVsZW1lbnQgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdW5wcm90ZWN0RWxlbWVudChyZW1vdmVkW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbm9kZVZhbHVlID0gbmV3VHJlZS5ub2RlVmFsdWU7XG4gIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZS5jaGlsZE5vZGVzO1xuICB2YXIgY2hpbGROb2Rlc0xlbmd0aCA9IGNoaWxkTm9kZXMgPyBjaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG4gIHZhciBuZXdFbGVtZW50ID0gbmV3VHJlZS5lbGVtZW50O1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IHdlJ3JlIHJlcGxhY2luZyBpcyB0b3RhbGx5IGRpZmZlcmVudCBmcm9tIHRoZSBwcmV2aW91c1xuICAvLyByZXBsYWNlIHRoZSBlbnRpcmUgZWxlbWVudCwgZG9uJ3QgYm90aGVyIGludmVzdGlnYXRpbmcgY2hpbGRyZW4uXG4gIGlmIChvbGRUcmVlLm5vZGVOYW1lICE9PSBuZXdUcmVlLm5vZGVOYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmVwbGFjZSB0ZXh0IG5vZGUgdmFsdWVzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgaWYgKG5ld1RyZWUubm9kZU5hbWUgPT09ICcjdGV4dCcgJiYgb2xkVHJlZS5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuXG4gICAgLy8gVGV4dCBjaGFuZ2VkLlxuICAgIGlmIChvbGRUcmVlLm5vZGVWYWx1ZSAhPT0gbm9kZVZhbHVlKSB7XG4gICAgICBvbGRUcmVlLm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcblxuICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7XG4gICAgICAgIF9fZG9fXzogMyxcbiAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgdmFsdWU6IG5vZGVWYWx1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBNb3N0IGNvbW1vbiBhZGRpdGl2ZSBlbGVtZW50cy5cbiAgaWYgKGNoaWxkTm9kZXNMZW5ndGggPiBvbGRDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gU3RvcmUgZWxlbWVudHMgaW4gYSBEb2N1bWVudEZyYWdtZW50IHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGFuZCBiZVxuICAgIC8vIGdlbmVyYWxseSBzaW1wbGllciB0byB3b3JrIHdpdGguXG4gICAgdmFyIGZyYWdtZW50ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gb2xkQ2hpbGROb2Rlc0xlbmd0aDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgcHJvdGVjdEVsZW1lbnQoY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgIC8vIEludGVybmFsbHkgYWRkIHRvIHRoZSB0cmVlLlxuICAgICAgb2xkQ2hpbGROb2Rlc1tvbGRDaGlsZE5vZGVzLmxlbmd0aF0gPSBjaGlsZE5vZGVzW2ldO1xuXG4gICAgICAvLyBBZGQgdG8gdGhlIGRvY3VtZW50IGZyYWdtZW50LlxuICAgICAgZnJhZ21lbnRbZnJhZ21lbnQubGVuZ3RoXSA9IGNoaWxkTm9kZXNbaV07XG4gICAgfVxuXG4gICAgLy8gQXNzaWduIHRoZSBmcmFnbWVudCB0byB0aGUgcGF0Y2hlcyB0byBiZSBpbmplY3RlZC5cbiAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgIF9fZG9fXzogMSxcbiAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICBmcmFnbWVudDogZnJhZ21lbnRcbiAgICB9O1xuICB9XG5cbiAgLy8gUmVwbGFjZSBlbGVtZW50cyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9sZENoaWxkTm9kZXNbaV0ubm9kZU5hbWUgIT09IGNoaWxkTm9kZXNbaV0ubm9kZU5hbWUpIHtcbiAgICAgIC8vIEFkZCB0byB0aGUgcGF0Y2hlcy5cbiAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0ge1xuICAgICAgICBfX2RvX186IDEsXG4gICAgICAgIG9sZDogb2xkQ2hpbGROb2Rlc1tpXSxcbiAgICAgICAgJ25ldyc6IGNoaWxkTm9kZXNbaV1cbiAgICAgIH07XG5cbiAgICAgIHVucHJvdGVjdEVsZW1lbnQob2xkQ2hpbGROb2Rlc1tpXSk7XG4gICAgICBwcm90ZWN0RWxlbWVudChjaGlsZE5vZGVzW2ldKTtcblxuICAgICAgLy8gUmVwbGFjZSB0aGUgaW50ZXJuYWwgdHJlZSdzIHBvaW50IG9mIHZpZXcgb2YgdGhpcyBlbGVtZW50LlxuICAgICAgb2xkQ2hpbGROb2Rlc1tpXSA9IGNoaWxkTm9kZXNbaV07XG4gICAgfVxuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZXNlIGVsZW1lbnRzLlxuICBpZiAob2xkQ2hpbGROb2Rlc0xlbmd0aCA+IGNoaWxkTm9kZXNMZW5ndGgpIHtcbiAgICAvLyBFbGVtZW50cyB0byByZW1vdmUuXG4gICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbChvbGRDaGlsZE5vZGVzLCBjaGlsZE5vZGVzTGVuZ3RoLCBvbGRDaGlsZE5vZGVzTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZWxlbWVudCwgdGhpcyBoYXBwZW5zIGJlZm9yZSB0aGUgc3BsaWNlIHNvIHRoYXQgd2Ugc3RpbGxcbiAgICAgIC8vIGhhdmUgYWNjZXNzIHRvIHRoZSBlbGVtZW50LlxuICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogMSwgb2xkOiB0b1JlbW92ZVtpXS5lbGVtZW50IH07XG4gICAgfVxuXG4gICAgdmFyIHJlbW92ZWQgPSBvbGRDaGlsZE5vZGVzLnNwbGljZShjaGlsZE5vZGVzTGVuZ3RoLCBvbGRDaGlsZE5vZGVzTGVuZ3RoIC0gY2hpbGROb2Rlc0xlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbW92ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHVucHJvdGVjdEVsZW1lbnQocmVtb3ZlZFtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gU3luY2hyb25pemUgYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlcyA9IG5ld1RyZWUuYXR0cmlidXRlcztcblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIHZhciBvbGRMZW5ndGggPSBvbGRUcmVlLmF0dHJpYnV0ZXMubGVuZ3RoO1xuICAgIHZhciBuZXdMZW5ndGggPSBhdHRyaWJ1dGVzLmxlbmd0aDtcblxuICAgIC8vIFN0YXJ0IHdpdGggdGhlIG1vc3QgY29tbW9uLCBhZGRpdGl2ZS5cbiAgICBpZiAobmV3TGVuZ3RoID4gb2xkTGVuZ3RoKSB7XG4gICAgICB2YXIgdG9BZGQgPSBzbGljZS5jYWxsKGF0dHJpYnV0ZXMsIG9sZExlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9BZGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b0FkZFtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB0b0FkZFtpXS52YWx1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhdHRyID0gcG9vbHMuYXR0cmlidXRlT2JqZWN0LmdldCgpO1xuICAgICAgICBhdHRyLm5hbWUgPSB0b0FkZFtpXS5uYW1lO1xuICAgICAgICBhdHRyLnZhbHVlID0gdG9BZGRbaV0udmFsdWU7XG5cbiAgICAgICAgcG9vbHMuYXR0cmlidXRlT2JqZWN0LnByb3RlY3QoYXR0cik7XG5cbiAgICAgICAgLy8gUHVzaCB0aGUgY2hhbmdlIG9iamVjdCBpbnRvIGludG8gdGhlIHZpcnR1YWwgdHJlZS5cbiAgICAgICAgb2xkVHJlZS5hdHRyaWJ1dGVzW29sZFRyZWUuYXR0cmlidXRlcy5sZW5ndGhdID0gYXR0cjtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0gY2hhbmdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciByZW1vdmFscy5cbiAgICBpZiAob2xkTGVuZ3RoID4gbmV3TGVuZ3RoKSB7XG4gICAgICB2YXIgdG9SZW1vdmUgPSBzbGljZS5jYWxsKG9sZFRyZWUuYXR0cmlidXRlcywgbmV3TGVuZ3RoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b1JlbW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgIF9fZG9fXzogMixcbiAgICAgICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgICAgIG5hbWU6IHRvUmVtb3ZlW2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgdmFyIHJlbW92ZWQgPSBvbGRUcmVlLmF0dHJpYnV0ZXMuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCByZW1vdmVkLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC51bnByb3RlY3QocmVtb3ZlZFtfaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IGNoYW5nZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbW9kaWZpY2F0aW9ucy5cbiAgICB2YXIgdG9Nb2RpZnkgPSBhdHRyaWJ1dGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b01vZGlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9sZEF0dHJWYWx1ZSA9IG9sZFRyZWUuYXR0cmlidXRlc1tpXSAmJiBvbGRUcmVlLmF0dHJpYnV0ZXNbaV0udmFsdWU7XG4gICAgICB2YXIgbmV3QXR0clZhbHVlID0gYXR0cmlidXRlc1tpXSAmJiBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xuXG4gICAgICAvLyBPbmx5IHB1c2ggaW4gYSBjaGFuZ2UgaWYgdGhlIGF0dHJpYnV0ZSBvciB2YWx1ZSBjaGFuZ2VzLlxuICAgICAgaWYgKG9sZEF0dHJWYWx1ZSAhPT0gbmV3QXR0clZhbHVlKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9Nb2RpZnlbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9Nb2RpZnlbaV0udmFsdWVcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBhdHRyaWJ1dGUgaW4gdGhlIHZpcnR1YWwgbm9kZS5cbiAgICAgICAgdmFyIGF0dHIgPSBvbGRUcmVlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGF0dHIubmFtZSA9IHRvTW9kaWZ5W2ldLm5hbWU7XG4gICAgICAgIGF0dHIudmFsdWUgPSB0b01vZGlmeVtpXS52YWx1ZTtcblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0gY2hhbmdlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmMgZWFjaCBjdXJyZW50IG5vZGUuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkQ2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvbGRDaGlsZE5vZGVzW2ldLmVsZW1lbnQgIT09IGNoaWxkTm9kZXNbaV0uZWxlbWVudCkge1xuICAgICAgc3luYy5jYWxsKHBhdGNoZXMsIG9sZFRyZWUuY2hpbGROb2Rlc1tpXSwgY2hpbGROb2Rlc1tpXSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2YzNsdVl5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRnJRbmRDTEVsQlFVazdPM2xDUVd4Q1NTeGxRVUZsT3pzd1FrRkplRU1zWjBKQlFXZENPenRCUVVWMlFpeEpRVUZKTEV0QlFVc3NiVUpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEdOQlFXTXNOa0pCUVd0Q0xFTkJRVU03UVVGRGNrTXNTVUZCU1N4blFrRkJaMElzSzBKQlFXOUNMRU5CUVVNN08wRkJSWHBETEVsQlFVMHNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZET3pzN096czdPenM3UVVGUmNrSXNVMEZCVXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJUdEJRVU0zUXl4TlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGJrSXNUVUZCU1N4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF6dEJRVU4yUXl4TlFVRkpMRzFDUVVGdFFpeEhRVUZITEdGQlFXRXNSMEZCUnl4aFFVRmhMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU51UlN4TlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZET3p0QlFVVnFReXhOUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlExb3NVVUZCU1N4UFFVRlBMRWRCUVVjc1lVRkJZU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU1zUTBGQlF6czdRVUZGTTBRc1YwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1JVRkJSU3hEUVVGRExFTkJRVU1zUlVGQlJTeFBRVUZQTEVWQlFVVXNWVUZCVlN4RlFVRkZMRU5CUVVNN08wRkJSVGxFTEZOQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRM1pETEhOQ1FVRm5RaXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpsQ096dEJRVVZFTEZkQlFVODdSMEZEVWpzN1FVRkZSQ3hOUVVGSkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRPMEZCUTJ4RExFMUJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNN1FVRkRjRU1zVFVGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhWUVVGVkxFZEJRVWNzVlVGQlZTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRNVVFzVFVGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJRenM3T3p0QlFVbHFReXhOUVVGSkxFOUJRVThzUTBGQlF5eFJRVUZSTEV0QlFVc3NUMEZCVHl4RFFVRkRMRkZCUVZFc1JVRkJSVHRCUVVONlF5eFhRVUZQTzBkQlExSTdPenRCUVVkRUxFMUJRVWtzVDBGQlR5eERRVUZETEZGQlFWRXNTMEZCU3l4UFFVRlBMRWxCUVVrc1QwRkJUeXhEUVVGRExGRkJRVkVzUzBGQlN5eFBRVUZQTEVWQlFVVTdPenRCUVVkb1JTeFJRVUZKTEU5QlFVOHNRMEZCUXl4VFFVRlRMRXRCUVVzc1UwRkJVeXhGUVVGRk8wRkJRMjVETEdGQlFVOHNRMEZCUXl4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRE96dEJRVVU1UWl4aFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITzBGQlEzaENMR05CUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzWlVGQlR5eEZRVUZGTEZWQlFWVTdRVUZEYmtJc1lVRkJTeXhGUVVGRkxGTkJRVk03VDBGRGFrSXNRMEZCUXp0TFFVTklPenRCUVVWRUxGZEJRVTg3UjBGRFVqczdPMEZCUjBRc1RVRkJTU3huUWtGQlowSXNSMEZCUnl4dFFrRkJiVUlzUlVGQlJUczdPMEZCUnpGRExGRkJRVWtzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXpzN1FVRkZiRUlzVTBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4dFFrRkJiVUlzUlVGQlJTeERRVUZETEVkQlFVY3NaMEpCUVdkQ0xFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZETTBRc2IwSkJRV01zUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenM3TzBGQlJ6bENMRzFDUVVGaExFTkJRVU1zWVVGQllTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6czdPMEZCUjNCRUxHTkJRVkVzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlF6TkRPenM3UVVGSFJDeFhRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSE8wRkJRM2hDTEZsQlFVMHNSVUZCUlN4RFFVRkRPMEZCUTFRc1lVRkJUeXhGUVVGRkxGVkJRVlU3UVVGRGJrSXNZMEZCVVN4RlFVRkZMRkZCUVZFN1MwRkRia0lzUTBGQlF6dEhRVU5JT3pzN1FVRkhSQ3hQUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRla01zVVVGQlNTeGhRVUZoTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hMUVVGTExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4UlFVRlJMRVZCUVVVN08wRkJSWGhFTEdGQlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWM3UVVGRGVFSXNZMEZCVFN4RlFVRkZMRU5CUVVNN1FVRkRWQ3hYUVVGSExFVkJRVVVzWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnlRaXhsUVVGTExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTTdUMEZEYmtJc1EwRkJRenM3UVVGRlJpeHpRa0ZCWjBJc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnVReXh2UWtGQll5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96czdRVUZIT1VJc2JVSkJRV0VzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGJFTTdSMEZEUmpzN08wRkJSMFFzVFVGQlNTeHRRa0ZCYlVJc1IwRkJSeXhuUWtGQlowSXNSVUZCUlRzN1FVRkZNVU1zVVVGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRVVVzWjBKQlFXZENMRVZCUTNaRUxHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN08wRkJSWFpDTEZOQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk96czdRVUZIZUVNc1lVRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUjBGQlJ5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dExRVU51UlRzN1FVRkZSQ3hSUVVGSkxFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTXNUVUZCVFN4RFFVRkRMR2RDUVVGblFpeEZRVU5xUkN4dFFrRkJiVUlzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE96dEJRVVV4UXl4VFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU4yUXl4elFrRkJaMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVNNVFqdEhRVU5HT3pzN1FVRkhSQ3hOUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRPenRCUVVWd1F5eE5RVUZKTEZWQlFWVXNSVUZCUlR0QlFVTmtMRkZCUVVrc1UwRkJVeXhIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUXpGRExGRkJRVWtzVTBGQlV5eEhRVUZITEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNN096dEJRVWRzUXl4UlFVRkpMRk5CUVZNc1IwRkJSeXhUUVVGVExFVkJRVVU3UVVGRGVrSXNWVUZCU1N4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wRkJSVGxETEZkQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRM0pETEZsQlFVa3NUVUZCVFN4SFFVRkhPMEZCUTFnc1owSkJRVTBzUlVGQlJTeERRVUZETzBGQlExUXNhVUpCUVU4c1JVRkJSU3hWUVVGVk8wRkJRMjVDTEdOQlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNUdEJRVU51UWl4bFFVRkxMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVczdVMEZEZEVJc1EwRkJRenM3UVVGRlJpeFpRVUZKTEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1pVRkJaU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzWkRMRmxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNeFFpeFpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTTdPMEZCUlRWQ0xHRkJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE96czdRVUZIY0VNc1pVRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF6czdPMEZCUjNKRUxHVkJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1RVRkJUU3hEUVVGRE8wOUJRMnhETzB0QlEwWTdPenRCUVVkRUxGRkJRVWtzVTBGQlV5eEhRVUZITEZOQlFWTXNSVUZCUlR0QlFVTjZRaXhWUVVGSkxGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdPMEZCUlhwRUxGZEJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNoRExGbEJRVWtzVFVGQlRTeEhRVUZITzBGQlExZ3NaMEpCUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzYVVKQlFVOHNSVUZCUlN4VlFVRlZPMEZCUTI1Q0xHTkJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTVHRCUVVOMFFpeGxRVUZMTEVWQlFVVXNVMEZCVXp0VFFVTnFRaXhEUVVGRE96czdRVUZIUml4WlFVRkpMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJUbERMR0ZCUVVzc1NVRkJTU3hGUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVWQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFVkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEzWkRMR1ZCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xTkJRemRET3pzN1FVRkhSQ3hsUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRTFCUVUwc1EwRkJRenRQUVVOc1F6dExRVU5HT3pzN1FVRkhSQ3hSUVVGSkxGRkJRVkVzUjBGQlJ5eFZRVUZWTEVOQlFVTTdPMEZCUlRGQ0xGTkJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNoRExGVkJRVWtzV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03UVVGRGVFVXNWVUZCU1N4WlFVRlpMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03T3p0QlFVZDRSQ3hWUVVGSkxGbEJRVmtzUzBGQlN5eFpRVUZaTEVWQlFVVTdRVUZEYWtNc1dVRkJTU3hOUVVGTkxFZEJRVWM3UVVGRFdDeG5Ra0ZCVFN4RlFVRkZMRU5CUVVNN1FVRkRWQ3hwUWtGQlR5eEZRVUZGTEZWQlFWVTdRVUZEYmtJc1kwRkJTU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpPMEZCUTNSQ0xHVkJRVXNzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTenRUUVVONlFpeERRVUZET3pzN1FVRkhSaXhaUVVGSkxFbEJRVWtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMnBETEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTTNRaXhaUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03T3p0QlFVY3ZRaXhsUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRTFCUVUwc1EwRkJRenRQUVVOc1F6dExRVU5HTzBkQlEwWTdPenRCUVVkRUxFOUJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhoUVVGaExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUXpkRExGRkJRVWtzWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRTlCUVU4c1MwRkJTeXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUMEZCVHl4RlFVRkZPMEZCUTNSRUxGVkJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRE1VUTdSMEZEUmp0RFFVTkdJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmMzbHVZeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCN0lIQnZiMnh6SUdGeklGOXdiMjlzY3lCOUlHWnliMjBnSnk0dUwzVjBhV3d2Y0c5dmJITW5PMXh1YVcxd2IzSjBJSHRjYmlBZ2NISnZkR1ZqZEVWc1pXMWxiblFnWVhNZ1gzQnliM1JsWTNSRmJHVnRaVzUwTEZ4dUlDQjFibkJ5YjNSbFkzUkZiR1Z0Wlc1MElHRnpJRjkxYm5CeWIzUmxZM1JGYkdWdFpXNTBYRzU5SUdaeWIyMGdKeTR1TDNWMGFXd3ZiV1Z0YjNKNUp6dGNibHh1YkdWMElIQnZiMnh6SUQwZ1gzQnZiMnh6TzF4dWJHVjBJSEJ5YjNSbFkzUkZiR1Z0Wlc1MElEMGdYM0J5YjNSbFkzUkZiR1Z0Wlc1ME8xeHViR1YwSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFnUFNCZmRXNXdjbTkwWldOMFJXeGxiV1Z1ZER0Y2JseHVZMjl1YzNRZ2MyeHBZMlVnUFNCQmNuSmhlUzV3Y205MGIzUjVjR1V1YzJ4cFkyVTdYRzVjYmk4cUtseHVJQ29nVTNsdVkyaHliMjVwZW1WeklHTm9ZVzVuWlhNZ1puSnZiU0IwYUdVZ2JtVjNWSEpsWlNCcGJuUnZJSFJvWlNCdmJHUlVjbVZsTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0J2YkdSVWNtVmxYRzRnS2lCQWNHRnlZVzBnYm1WM1ZISmxaVnh1SUNvdlhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlCemVXNWpLRzlzWkZSeVpXVXNJRzVsZDFSeVpXVXBJSHRjYmlBZ2JHVjBJSEJoZEdOb1pYTWdQU0IwYUdsek8xeHVJQ0JzWlhRZ2IyeGtRMmhwYkdST2IyUmxjeUE5SUc5c1pGUnlaV1V1WTJocGJHUk9iMlJsY3p0Y2JpQWdiR1YwSUc5c1pFTm9hV3hrVG05a1pYTk1aVzVuZEdnZ1BTQnZiR1JEYUdsc1pFNXZaR1Z6SUQ4Z2IyeGtRMmhwYkdST2IyUmxjeTVzWlc1bmRHZ2dPaUF3TzF4dUlDQnNaWFFnYjJ4a1JXeGxiV1Z1ZENBOUlHOXNaRlJ5WldVdVpXeGxiV1Z1ZER0Y2JseHVJQ0JwWmlBb0lXNWxkMVJ5WldVcElIdGNiaUFnSUNCc1pYUWdjbVZ0YjNabFpDQTlJRzlzWkVOb2FXeGtUbTlrWlhNdWMzQnNhV05sS0RBc0lHOXNaRU5vYVd4a1RtOWtaWE5NWlc1bmRHZ3BPMXh1WEc0Z0lDQWdjR0YwWTJobGMxdHdZWFJqYUdWekxteGxibWQwYUYwZ1BTQjdJRjlmWkc5Zlh6b2dMVEVzSUdWc1pXMWxiblE2SUc5c1pFVnNaVzFsYm5RZ2ZUdGNibHh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2djbVZ0YjNabFpDNXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnZFc1d2NtOTBaV04wUld4bGJXVnVkQ2h5WlcxdmRtVmtXMmxkS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNDdYRzRnSUgxY2JseHVJQ0JzWlhRZ2JtOWtaVlpoYkhWbElEMGdibVYzVkhKbFpTNXViMlJsVm1Gc2RXVTdYRzRnSUd4bGRDQmphR2xzWkU1dlpHVnpJRDBnYm1WM1ZISmxaUzVqYUdsc1pFNXZaR1Z6TzF4dUlDQnNaWFFnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ0E5SUdOb2FXeGtUbTlrWlhNZ1B5QmphR2xzWkU1dlpHVnpMbXhsYm1kMGFDQTZJREE3WEc0Z0lHeGxkQ0J1WlhkRmJHVnRaVzUwSUQwZ2JtVjNWSEpsWlM1bGJHVnRaVzUwTzF4dVhHNGdJQzh2SUVsbUlIUm9aU0JsYkdWdFpXNTBJSGRsSjNKbElISmxjR3hoWTJsdVp5QnBjeUIwYjNSaGJHeDVJR1JwWm1abGNtVnVkQ0JtY205dElIUm9aU0J3Y21WMmFXOTFjMXh1SUNBdkx5QnlaWEJzWVdObElIUm9aU0JsYm5ScGNtVWdaV3hsYldWdWRDd2daRzl1SjNRZ1ltOTBhR1Z5SUdsdWRtVnpkR2xuWVhScGJtY2dZMmhwYkdSeVpXNHVYRzRnSUdsbUlDaHZiR1JVY21WbExtNXZaR1ZPWVcxbElDRTlQU0J1WlhkVWNtVmxMbTV2WkdWT1lXMWxLU0I3WEc0Z0lDQWdjbVYwZFhKdU8xeHVJQ0I5WEc1Y2JpQWdMeThnVW1Wd2JHRmpaU0IwWlhoMElHNXZaR1VnZG1Gc2RXVnpJR2xtSUhSb1pYa2dZWEpsSUdScFptWmxjbVZ1ZEM1Y2JpQWdhV1lnS0c1bGQxUnlaV1V1Ym05a1pVNWhiV1VnUFQwOUlDY2pkR1Y0ZENjZ0ppWWdiMnhrVkhKbFpTNXViMlJsVG1GdFpTQTlQVDBnSnlOMFpYaDBKeWtnZTF4dVhHNGdJQ0FnTHk4Z1ZHVjRkQ0JqYUdGdVoyVmtMbHh1SUNBZ0lHbG1JQ2h2YkdSVWNtVmxMbTV2WkdWV1lXeDFaU0FoUFQwZ2JtOWtaVlpoYkhWbEtTQjdYRzRnSUNBZ0lDQnZiR1JVY21WbExtNXZaR1ZXWVd4MVpTQTlJRzV2WkdWV1lXeDFaVHRjYmx4dUlDQWdJQ0FnY0dGMFkyaGxjMXR3WVhSamFHVnpMbXhsYm1kMGFGMGdQU0I3WEc0Z0lDQWdJQ0FnSUY5ZlpHOWZYem9nTXl4Y2JpQWdJQ0FnSUNBZ1pXeGxiV1Z1ZERvZ2IyeGtSV3hsYldWdWRDeGNiaUFnSUNBZ0lDQWdkbUZzZFdVNklHNXZaR1ZXWVd4MVpWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTQ3WEc0Z0lIMWNibHh1SUNBdkx5Qk5iM04wSUdOdmJXMXZiaUJoWkdScGRHbDJaU0JsYkdWdFpXNTBjeTVjYmlBZ2FXWWdLR05vYVd4a1RtOWtaWE5NWlc1bmRHZ2dQaUJ2YkdSRGFHbHNaRTV2WkdWelRHVnVaM1JvS1NCN1hHNGdJQ0FnTHk4Z1UzUnZjbVVnWld4bGJXVnVkSE1nYVc0Z1lTQkViMk4xYldWdWRFWnlZV2R0Wlc1MElIUnZJR2x1WTNKbFlYTmxJSEJsY21admNtMWhibU5sSUdGdVpDQmlaVnh1SUNBZ0lDOHZJR2RsYm1WeVlXeHNlU0J6YVcxd2JHbGxjaUIwYnlCM2IzSnJJSGRwZEdndVhHNGdJQ0FnYkdWMElHWnlZV2R0Wlc1MElEMGdXMTA3WEc1Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ2IyeGtRMmhwYkdST2IyUmxjMHhsYm1kMGFEc2dhU0E4SUdOb2FXeGtUbTlrWlhOTVpXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdjSEp2ZEdWamRFVnNaVzFsYm5Rb1kyaHBiR1JPYjJSbGMxdHBYU2s3WEc1Y2JpQWdJQ0FnSUM4dklFbHVkR1Z5Ym1Gc2JIa2dZV1JrSUhSdklIUm9aU0IwY21WbExseHVJQ0FnSUNBZ2IyeGtRMmhwYkdST2IyUmxjMXR2YkdSRGFHbHNaRTV2WkdWekxteGxibWQwYUYwZ1BTQmphR2xzWkU1dlpHVnpXMmxkTzF4dVhHNGdJQ0FnSUNBdkx5QkJaR1FnZEc4Z2RHaGxJR1J2WTNWdFpXNTBJR1p5WVdkdFpXNTBMbHh1SUNBZ0lDQWdabkpoWjIxbGJuUmJabkpoWjIxbGJuUXViR1Z1WjNSb1hTQTlJR05vYVd4a1RtOWtaWE5iYVYwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1FYTnphV2R1SUhSb1pTQm1jbUZuYldWdWRDQjBieUIwYUdVZ2NHRjBZMmhsY3lCMGJ5QmlaU0JwYm1wbFkzUmxaQzVjYmlBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlIdGNiaUFnSUNBZ0lGOWZaRzlmWHpvZ01TeGNiaUFnSUNBZ0lHVnNaVzFsYm5RNklHOXNaRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQm1jbUZuYldWdWREb2dabkpoWjIxbGJuUmNiaUFnSUNCOU8xeHVJQ0I5WEc1Y2JpQWdMeThnVW1Wd2JHRmpaU0JsYkdWdFpXNTBjeUJwWmlCMGFHVjVJR0Z5WlNCa2FXWm1aWEpsYm5RdVhHNGdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnWTJocGJHUk9iMlJsYzB4bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2FXWWdLRzlzWkVOb2FXeGtUbTlrWlhOYmFWMHVibTlrWlU1aGJXVWdJVDA5SUdOb2FXeGtUbTlrWlhOYmFWMHVibTlrWlU1aGJXVXBJSHRjYmlBZ0lDQWdJQzh2SUVGa1pDQjBieUIwYUdVZ2NHRjBZMmhsY3k1Y2JpQWdJQ0FnSUhCaGRHTm9aWE5iY0dGMFkyaGxjeTVzWlc1bmRHaGRJRDBnZTF4dUlDQWdJQ0FnSUNCZlgyUnZYMTg2SURFc1hHNGdJQ0FnSUNBZ0lHOXNaRG9nYjJ4a1EyaHBiR1JPYjJSbGMxdHBYU3hjYmlBZ0lDQWdJQ0FnYm1WM09pQmphR2xzWkU1dlpHVnpXMmxkWEc0Z0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNCMWJuQnliM1JsWTNSRmJHVnRaVzUwS0c5c1pFTm9hV3hrVG05a1pYTmJhVjBwTzF4dUlDQWdJQ0FnY0hKdmRHVmpkRVZzWlcxbGJuUW9ZMmhwYkdST2IyUmxjMXRwWFNrN1hHNWNiaUFnSUNBZ0lDOHZJRkpsY0d4aFkyVWdkR2hsSUdsdWRHVnlibUZzSUhSeVpXVW5jeUJ3YjJsdWRDQnZaaUIyYVdWM0lHOW1JSFJvYVhNZ1pXeGxiV1Z1ZEM1Y2JpQWdJQ0FnSUc5c1pFTm9hV3hrVG05a1pYTmJhVjBnUFNCamFHbHNaRTV2WkdWelcybGRPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUZKbGJXOTJaU0IwYUdWelpTQmxiR1Z0Wlc1MGN5NWNiaUFnYVdZZ0tHOXNaRU5vYVd4a1RtOWtaWE5NWlc1bmRHZ2dQaUJqYUdsc1pFNXZaR1Z6VEdWdVozUm9LU0I3WEc0Z0lDQWdMeThnUld4bGJXVnVkSE1nZEc4Z2NtVnRiM1psTGx4dUlDQWdJR3hsZENCMGIxSmxiVzkyWlNBOUlITnNhV05sTG1OaGJHd29iMnhrUTJocGJHUk9iMlJsY3l3Z1kyaHBiR1JPYjJSbGMweGxibWQwYUN4Y2JpQWdJQ0FnSUc5c1pFTm9hV3hrVG05a1pYTk1aVzVuZEdncE8xeHVYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBiMUpsYlc5MlpTNXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnTHk4Z1VtVnRiM1psSUhSb1pTQmxiR1Z0Wlc1MExDQjBhR2x6SUdoaGNIQmxibk1nWW1WbWIzSmxJSFJvWlNCemNHeHBZMlVnYzI4Z2RHaGhkQ0IzWlNCemRHbHNiRnh1SUNBZ0lDQWdMeThnYUdGMlpTQmhZMk5sYzNNZ2RHOGdkR2hsSUdWc1pXMWxiblF1WEc0Z0lDQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJSHNnWDE5a2IxOWZPaUF4TENCdmJHUTZJSFJ2VW1WdGIzWmxXMmxkTG1Wc1pXMWxiblFnZlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JzWlhRZ2NtVnRiM1psWkNBOUlHOXNaRU5vYVd4a1RtOWtaWE11YzNCc2FXTmxLR05vYVd4a1RtOWtaWE5NWlc1bmRHZ3NYRzRnSUNBZ0lDQnZiR1JEYUdsc1pFNXZaR1Z6VEdWdVozUm9JQzBnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ2s3WEc1Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhKbGJXOTJaV1F1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5Rb2NtVnRiM1psWkZ0cFhTazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeThnVTNsdVkyaHliMjVwZW1VZ1lYUjBjbWxpZFhSbGMxeHVJQ0JzWlhRZ1lYUjBjbWxpZFhSbGN5QTlJRzVsZDFSeVpXVXVZWFIwY21saWRYUmxjenRjYmx4dUlDQnBaaUFvWVhSMGNtbGlkWFJsY3lrZ2UxeHVJQ0FnSUd4bGRDQnZiR1JNWlc1bmRHZ2dQU0J2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE11YkdWdVozUm9PMXh1SUNBZ0lHeGxkQ0J1WlhkTVpXNW5kR2dnUFNCaGRIUnlhV0oxZEdWekxteGxibWQwYUR0Y2JseHVJQ0FnSUM4dklGTjBZWEowSUhkcGRHZ2dkR2hsSUcxdmMzUWdZMjl0Ylc5dUxDQmhaR1JwZEdsMlpTNWNiaUFnSUNCcFppQW9ibVYzVEdWdVozUm9JRDRnYjJ4a1RHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCc1pYUWdkRzlCWkdRZ1BTQnpiR2xqWlM1allXeHNLR0YwZEhKcFluVjBaWE1zSUc5c1pFeGxibWQwYUNrN1hHNWNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkRzlCWkdRdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnYkdWMElHTm9ZVzVuWlNBOUlIdGNiaUFnSUNBZ0lDQWdJQ0JmWDJSdlgxODZJRElzWEc0Z0lDQWdJQ0FnSUNBZ1pXeGxiV1Z1ZERvZ2IyeGtSV3hsYldWdWRDeGNiaUFnSUNBZ0lDQWdJQ0J1WVcxbE9pQjBiMEZrWkZ0cFhTNXVZVzFsTEZ4dUlDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCMGIwRmtaRnRwWFM1MllXeDFaU3hjYmlBZ0lDQWdJQ0FnZlR0Y2JseHVJQ0FnSUNBZ0lDQnNaWFFnWVhSMGNpQTlJSEJ2YjJ4ekxtRjBkSEpwWW5WMFpVOWlhbVZqZEM1blpYUW9LVHRjYmlBZ0lDQWdJQ0FnWVhSMGNpNXVZVzFsSUQwZ2RHOUJaR1JiYVYwdWJtRnRaVHRjYmlBZ0lDQWdJQ0FnWVhSMGNpNTJZV3gxWlNBOUlIUnZRV1JrVzJsZExuWmhiSFZsTzF4dVhHNGdJQ0FnSUNBZ0lIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQzV3Y205MFpXTjBLR0YwZEhJcE8xeHVYRzRnSUNBZ0lDQWdJQzh2SUZCMWMyZ2dkR2hsSUdOb1lXNW5aU0J2WW1wbFkzUWdhVzUwYnlCcGJuUnZJSFJvWlNCMmFYSjBkV0ZzSUhSeVpXVXVYRzRnSUNBZ0lDQWdJRzlzWkZSeVpXVXVZWFIwY21saWRYUmxjMXR2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE11YkdWdVozUm9YU0E5SUdGMGRISTdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJSFJvWlNCamFHRnVaMlVnZEc4Z2RHaGxJSE5sY21sbGN5QnZaaUJ3WVhSamFHVnpMbHh1SUNBZ0lDQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJR05vWVc1blpUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QkRhR1ZqYXlCbWIzSWdjbVZ0YjNaaGJITXVYRzRnSUNBZ2FXWWdLRzlzWkV4bGJtZDBhQ0ErSUc1bGQweGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ2JHVjBJSFJ2VW1WdGIzWmxJRDBnYzJ4cFkyVXVZMkZzYkNodmJHUlVjbVZsTG1GMGRISnBZblYwWlhNc0lHNWxkMHhsYm1kMGFDazdYRzVjYmlBZ0lDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnZEc5U1pXMXZkbVV1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUdOb1lXNW5aU0E5SUh0Y2JpQWdJQ0FnSUNBZ0lDQmZYMlJ2WDE4NklESXNYRzRnSUNBZ0lDQWdJQ0FnWld4bGJXVnVkRG9nYjJ4a1JXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ0lDQnVZVzFsT2lCMGIxSmxiVzkyWlZ0cFhTNXVZVzFsTEZ4dUlDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNBZ0lIMDdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1VtVnRiM1psSUhSb1pTQmhkSFJ5YVdKMWRHVWdabkp2YlNCMGFHVWdkbWx5ZEhWaGJDQnViMlJsTGx4dUlDQWdJQ0FnSUNCc1pYUWdjbVZ0YjNabFpDQTlJRzlzWkZSeVpXVXVZWFIwY21saWRYUmxjeTV6Y0d4cFkyVW9hU3dnTVNrN1hHNWNiaUFnSUNBZ0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0J5WlcxdmRtVmtMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wTG5WdWNISnZkR1ZqZENoeVpXMXZkbVZrVzJsZEtUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklFRmtaQ0IwYUdVZ1kyaGhibWRsSUhSdklIUm9aU0J6WlhKcFpYTWdiMllnY0dGMFkyaGxjeTVjYmlBZ0lDQWdJQ0FnY0dGMFkyaGxjMXR3WVhSamFHVnpMbXhsYm1kMGFGMGdQU0JqYUdGdVoyVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdRMmhsWTJzZ1ptOXlJRzF2WkdsbWFXTmhkR2x2Ym5NdVhHNGdJQ0FnYkdWMElIUnZUVzlrYVdaNUlEMGdZWFIwY21saWRYUmxjenRjYmx4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnZEc5TmIyUnBabmt1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lHeGxkQ0J2YkdSQmRIUnlWbUZzZFdVZ1BTQnZiR1JVY21WbExtRjBkSEpwWW5WMFpYTmJhVjBnSmlZZ2IyeGtWSEpsWlM1aGRIUnlhV0oxZEdWelcybGRMblpoYkhWbE8xeHVJQ0FnSUNBZ2JHVjBJRzVsZDBGMGRISldZV3gxWlNBOUlHRjBkSEpwWW5WMFpYTmJhVjBnSmlZZ1lYUjBjbWxpZFhSbGMxdHBYUzUyWVd4MVpUdGNibHh1SUNBZ0lDQWdMeThnVDI1c2VTQndkWE5vSUdsdUlHRWdZMmhoYm1kbElHbG1JSFJvWlNCaGRIUnlhV0oxZEdVZ2IzSWdkbUZzZFdVZ1kyaGhibWRsY3k1Y2JpQWdJQ0FnSUdsbUlDaHZiR1JCZEhSeVZtRnNkV1VnSVQwOUlHNWxkMEYwZEhKV1lXeDFaU2tnZTF4dUlDQWdJQ0FnSUNCc1pYUWdZMmhoYm1kbElEMGdlMXh1SUNBZ0lDQWdJQ0FnSUY5ZlpHOWZYem9nTWl4Y2JpQWdJQ0FnSUNBZ0lDQmxiR1Z0Wlc1ME9pQnZiR1JGYkdWdFpXNTBMRnh1SUNBZ0lDQWdJQ0FnSUc1aGJXVTZJSFJ2VFc5a2FXWjVXMmxkTG01aGJXVXNYRzRnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJSFJ2VFc5a2FXWjVXMmxkTG5aaGJIVmxMRnh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRkpsY0d4aFkyVWdkR2hsSUdGMGRISnBZblYwWlNCcGJpQjBhR1VnZG1seWRIVmhiQ0J1YjJSbExseHVJQ0FnSUNBZ0lDQnNaWFFnWVhSMGNpQTlJRzlzWkZSeVpXVXVZWFIwY21saWRYUmxjMXRwWFR0Y2JpQWdJQ0FnSUNBZ1lYUjBjaTV1WVcxbElEMGdkRzlOYjJScFpubGJhVjB1Ym1GdFpUdGNiaUFnSUNBZ0lDQWdZWFIwY2k1MllXeDFaU0E5SUhSdlRXOWthV1o1VzJsZExuWmhiSFZsTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkNCMGFHVWdZMmhoYm1kbElIUnZJSFJvWlNCelpYSnBaWE1nYjJZZ2NHRjBZMmhsY3k1Y2JpQWdJQ0FnSUNBZ2NHRjBZMmhsYzF0d1lYUmphR1Z6TG14bGJtZDBhRjBnUFNCamFHRnVaMlU3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHk4Z1UzbHVZeUJsWVdOb0lHTjFjbkpsYm5RZ2JtOWtaUzVjYmlBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQnZiR1JEYUdsc1pFNXZaR1Z6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2FXWWdLRzlzWkVOb2FXeGtUbTlrWlhOYmFWMHVaV3hsYldWdWRDQWhQVDBnWTJocGJHUk9iMlJsYzF0cFhTNWxiR1Z0Wlc1MEtTQjdYRzRnSUNBZ0lDQnplVzVqTG1OaGJHd29jR0YwWTJobGN5d2diMnhrVkhKbFpTNWphR2xzWkU1dlpHVnpXMmxkTENCamFHbHNaRTV2WkdWelcybGRLVHRjYmlBZ0lDQjlYRzRnSUgxY2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBwcm9jZXNzO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfdHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuLi90cmFuc2l0aW9ucycpO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsRGVjb2RlID0gcmVxdWlyZSgnLi4vdXRpbC9kZWNvZGUnKTtcblxudmFyIF91dGlsRGVjb2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxEZWNvZGUpO1xuXG52YXIgX2VsZW1lbnRHZXQgPSByZXF1aXJlKCcuLi9lbGVtZW50L2dldCcpO1xuXG52YXIgX2VsZW1lbnRHZXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudEdldCk7XG5cbnZhciBfbm9kZU1ha2UgPSByZXF1aXJlKCcuLi9ub2RlL21ha2UnKTtcblxudmFyIF9ub2RlTWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlTWFrZSk7XG5cbnZhciBwb29scyA9IF91dGlsUG9vbHMucG9vbHM7XG52YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xuXG4vKipcbiAqIFByb2Nlc3NlcyBhbiBBcnJheSBvZiBwYXRjaGVzLlxuICpcbiAqIEBwYXJhbSBlXG4gKiBAcmV0dXJuXG4gKi9cblxuZnVuY3Rpb24gcHJvY2VzcyhlbGVtZW50LCBlKSB7XG4gIHZhciBwYXRjaGVzID0gZS5kYXRhO1xuICB2YXIgc3RhdGVzID0gX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXM7XG5cbiAgdmFyIGNhbGxDYWxsYmFjayA9IGZ1bmN0aW9uIGNhbGxDYWxsYmFjayhjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKHRoaXMpO1xuICB9O1xuXG4gIHZhciBhdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24gYXR0YWNoZWRDYWxsYmFjayhlbGVtZW50RGVzY3JpcHRvcikge1xuICAgIHZhciBlbCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkoZWxlbWVudERlc2NyaXB0b3IpLmVsZW1lbnQ7XG4gICAgdmFyIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudDtcblxuICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSAoMCwgX3V0aWxEZWNvZGUyWydkZWZhdWx0J10pKGVsLnRleHRDb250ZW50KTtcbiAgICB9XG5cbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbCk7XG4gIH07XG5cbiAgdmFyIHRpdGxlQ2FsbGJhY2sgPSBmdW5jdGlvbiB0aXRsZUNhbGxiYWNrKGVsZW1lbnREZXNjcmlwdG9yKSB7XG4gICAgdmFyIGVsID0gKDAsIF9lbGVtZW50R2V0MlsnZGVmYXVsdCddKShlbGVtZW50RGVzY3JpcHRvcikuZWxlbWVudDtcblxuICAgIC8vIEVuc3VyZSB0aGUgdGl0bGUgaXMgc2V0IGNvcnJlY3RseS5cbiAgICBpZiAoZWwudGFnTmFtZSA9PT0gJ3RpdGxlJykge1xuICAgICAgZWwub3duZXJEb2N1bWVudC50aXRsZSA9IGVsLmNoaWxkTm9kZXNbMF0ubm9kZVZhbHVlO1xuICAgIH1cbiAgfTtcblxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBwYXRjaGVzIGFuZCBhcHBseSB0aGVtLlxuXG4gIHZhciBfbG9vcCA9IGZ1bmN0aW9uIChpKSB7XG4gICAgdmFyIHBhdGNoID0gcGF0Y2hlc1tpXTtcbiAgICB2YXIgZWxlbWVudElkID0gdW5kZWZpbmVkLFxuICAgICAgICBvbGRJZCA9IHVuZGVmaW5lZCxcbiAgICAgICAgbmV3SWQgPSB1bmRlZmluZWQsXG4gICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICB2YXIgZWxlbWVudCA9IHBhdGNoWyduZXcnXTtcblxuICAgIGlmIChwYXRjaC5lbGVtZW50KSB7XG4gICAgICByZXN1bHQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKHBhdGNoLmVsZW1lbnQpO1xuICAgICAgcGF0Y2guZWxlbWVudCA9IHJlc3VsdC5lbGVtZW50O1xuICAgICAgZWxlbWVudElkID0gcmVzdWx0LnV1aWQ7XG4gICAgfVxuXG4gICAgaWYgKHBhdGNoLm9sZCkge1xuICAgICAgcmVzdWx0ID0gKDAsIF9lbGVtZW50R2V0MlsnZGVmYXVsdCddKShwYXRjaC5vbGQpO1xuICAgICAgcGF0Y2gub2xkID0gcmVzdWx0LmVsZW1lbnQ7XG4gICAgICBvbGRJZCA9IHJlc3VsdC51dWlkO1xuICAgIH1cblxuICAgIGlmIChwYXRjaFsnbmV3J10pIHtcbiAgICAgIHJlc3VsdCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkocGF0Y2hbJ25ldyddKTtcbiAgICAgIHBhdGNoWyduZXcnXSA9IHJlc3VsdC5lbGVtZW50O1xuICAgICAgbmV3SWQgPSByZXN1bHQudXVpZDtcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBwYXRjaFsnbmV3J10udGV4dENvbnRlbnQgPSAoMCwgX3V0aWxEZWNvZGUyWydkZWZhdWx0J10pKGVsZW1lbnQubm9kZVZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIHRoZSBlbnRpcmUgTm9kZS5cbiAgICBpZiAocGF0Y2guX19kb19fID09PSAwKSB7XG4gICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0Y2hbJ25ldyddLCBwYXRjaC5vbGQpO1xuICAgIH1cblxuICAgIC8vIE5vZGUgbWFuaXAuXG4gICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAxKSB7XG4gICAgICAgIC8vIEFkZC5cbiAgICAgICAgaWYgKHBhdGNoLmVsZW1lbnQgJiYgcGF0Y2guZnJhZ21lbnQgJiYgIXBhdGNoLm9sZCkge1xuICAgICAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgICAgIHBhdGNoLmZyYWdtZW50LmZvckVhY2goYXR0YWNoZWRDYWxsYmFjaywgeyBmcmFnbWVudDogZnJhZ21lbnQgfSk7XG4gICAgICAgICAgcGF0Y2guZWxlbWVudC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG5cbiAgICAgICAgICBmb3JFYWNoLmNhbGwocGF0Y2guZnJhZ21lbnQsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKGVsKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBhbGwgdGhlIHRleHQgY2hhbmdlZCB2YWx1ZXMuXG4gICAgICAgICAgICBpZiAoc3RhdGVzICYmIGVsLm5vZGVOYW1lID09PSAnI3RleHQnICYmIHN0YXRlcy50ZXh0Q2hhbmdlZCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHN0YXRlcy50ZXh0Q2hhbmdlZC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YXRlcy50ZXh0Q2hhbmdlZFt4XTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbGVtZW50LnBhcmVudE5vZGUgfHwgZWxlbWVudCwgbnVsbCwgZWwubm9kZVZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGRlZCBzdGF0ZSBmb3IgdHJhbnNpdGlvbnMgQVBJLlxuICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuYXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgc3RhdGVzLmF0dGFjaGVkLmZvckVhY2goY2FsbENhbGxiYWNrLCBlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpdGxlQ2FsbGJhY2soZWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlXG4gICAgICAgIGVsc2UgaWYgKHBhdGNoLm9sZCAmJiAhcGF0Y2hbJ25ldyddKSB7XG4gICAgICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCByZW1vdmUgd2l0aG91dCBwYXJlbnQsIGlzIHRoaXMgdGhlICcgKyAnZG9jdW1lbnQgcm9vdD8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuZGV0YWNoZWQpIHtcbiAgICAgICAgICAgICAgc3RhdGVzLmRldGFjaGVkLmZvckVhY2goY2FsbENhbGxiYWNrLCBwYXRjaC5vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHRpdGxlIGlzIGVtcHRpZWQuXG4gICAgICAgICAgICBpZiAocGF0Y2gub2xkLnRhZ05hbWUgPT09ICd0aXRsZScpIHtcbiAgICAgICAgICAgICAgcGF0Y2gub2xkLm93bmVyRG9jdW1lbnQudGl0bGUgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGF0Y2gub2xkKTtcblxuICAgICAgICAgICAgX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW29sZElkXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZXBsYWNlXG4gICAgICAgICAgZWxzZSBpZiAocGF0Y2gub2xkICYmIHBhdGNoWyduZXcnXSkge1xuICAgICAgICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHJlcGxhY2Ugd2l0aG91dCBwYXJlbnQsIGlzIHRoaXMgdGhlICcgKyAnZG9jdW1lbnQgcm9vdD8nKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgZWxlbWVudCBmaXJzdCwgYmVmb3JlIGRvaW5nIHRoZSByZXBsYWNlbWVudC5cbiAgICAgICAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBhdGNoWyduZXcnXSwgcGF0Y2gub2xkLm5leHRTaWJsaW5nKTtcblxuICAgICAgICAgICAgICAvLyBSZW1vdmVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmRldGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVzLmRldGFjaGVkLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhwYXRjaC5vbGQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gUmVwbGFjZWQgc3RhdGUgZm9yIHRyYW5zaXRpb25zIEFQSS5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMucmVwbGFjZWQpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZXMucmVwbGFjZWQuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhdGNoLm9sZCwgcGF0Y2hbJ25ldyddKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgdGl0bGUgaXMgc2V0IGNvcnJlY3RseS5cbiAgICAgICAgICAgICAgaWYgKHBhdGNoWyduZXcnXS50YWdOYW1lID09PSAndGl0bGUnKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gub2xkLm93bmVyRG9jdW1lbnQudGl0bGUgPSBwYXRjaFsnbmV3J10uY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0Y2hbJ25ldyddLCBwYXRjaC5vbGQpO1xuXG4gICAgICAgICAgICAgIC8vIEFkZGVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVzLmF0dGFjaGVkLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhwYXRjaFsnbmV3J10pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW29sZElkXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQXR0cmlidXRlIG1hbmlwdWxhdGlvbi5cbiAgICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMikge1xuICAgICAgICAgIHZhciBvcmlnaW5hbFZhbHVlID0gcGF0Y2guZWxlbWVudC5nZXRBdHRyaWJ1dGUocGF0Y2gubmFtZSk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUuXG4gICAgICAgICAgaWYgKCFwYXRjaC52YWx1ZSkge1xuICAgICAgICAgICAgcGF0Y2guZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUocGF0Y2gubmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGNoLmVsZW1lbnQuc2V0QXR0cmlidXRlKHBhdGNoLm5hbWUsIHBhdGNoLnZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUcmlnZ2VyIGFsbCB0aGUgYXR0cmlidXRlIGNoYW5nZWQgdmFsdWVzLlxuICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWRbeF07XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQsIHBhdGNoLm5hbWUsIG9yaWdpbmFsVmFsdWUsIHBhdGNoLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUZXh0IG5vZGUgbWFuaXB1bGF0aW9uLlxuICAgICAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDMpIHtcbiAgICAgICAgICAgIHZhciBvcmlnaW5hbFZhbHVlID0gcGF0Y2guZWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgICAgICAgICAgcGF0Y2guZWxlbWVudC50ZXh0Q29udGVudCA9ICgwLCBfdXRpbERlY29kZTJbJ2RlZmF1bHQnXSkocGF0Y2gudmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGFsbCB0aGUgdGV4dCBjaGFuZ2VkIHZhbHVlcy5cbiAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLnRleHRDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc3RhdGVzLnRleHRDaGFuZ2VkLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gc3RhdGVzLnRleHRDaGFuZ2VkW3hdO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQucGFyZW50Tm9kZSwgb3JpZ2luYWxWYWx1ZSwgcGF0Y2gudmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICB9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIF9sb29wKGkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzQmhkR05vWlhNdmNISnZZMlZ6Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenR4UWtGbGQwSXNUMEZCVHpzN096c3lRa0ZtUlN4blFrRkJaMEk3TzNsQ1FVTnFRaXhsUVVGbE96c3dRa0ZEY0VJc1owSkJRV2RDT3pzN096QkNRVU53UWl4blFrRkJaMEk3T3pzN2QwSkJRMnhDTEdOQlFXTTdPenM3UVVGRmJrTXNTVUZCU1N4TFFVRkxMRzFDUVVGVExFTkJRVU03UVVGRGJrSXNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTTdPenM3T3pzN096dEJRVkYyUWl4VFFVRlRMRTlCUVU4c1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF5eEZRVUZGTzBGQlF6RkRMRTFCUVVrc1QwRkJUeXhIUVVGSExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEY2tJc1RVRkJTU3hOUVVGTkxHZERRVUZ0UWl4RFFVRkRPenRCUVVVNVFpeE5RVUZKTEZsQlFWa3NSMEZCUnl4VFFVRm1MRmxCUVZrc1EwRkJXU3hSUVVGUkxFVkJRVVU3UVVGRGNFTXNXVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wZEJRMmhDTEVOQlFVTTdPMEZCUlVZc1RVRkJTU3huUWtGQlowSXNSMEZCUnl4VFFVRnVRaXhuUWtGQlowSXNRMEZCV1N4cFFrRkJhVUlzUlVGQlJUdEJRVU5xUkN4UlFVRkpMRVZCUVVVc1IwRkJSeXcyUWtGQlZ5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF6dEJRVU12UXl4UlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZET3p0QlFVVTNRaXhSUVVGSkxFVkJRVVVzUTBGQlF5eFJRVUZSTEV0QlFVc3NUMEZCVHl4RlFVRkZPMEZCUXpOQ0xGRkJRVVVzUTBGQlF5eFhRVUZYTEVkQlFVY3NOa0pCUVdVc1JVRkJSU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETzB0QlEycEVPenRCUVVWRUxGbEJRVkVzUTBGQlF5eFhRVUZYTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRNVUlzUTBGQlF6czdRVUZGUml4TlFVRkpMR0ZCUVdFc1IwRkJSeXhUUVVGb1FpeGhRVUZoTEVOQlFWa3NhVUpCUVdsQ0xFVkJRVVU3UVVGRE9VTXNVVUZCU1N4RlFVRkZMRWRCUVVjc05rSkJRVmNzYVVKQlFXbENMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU03T3p0QlFVY3ZReXhSUVVGSkxFVkJRVVVzUTBGQlF5eFBRVUZQTEV0QlFVc3NUMEZCVHl4RlFVRkZPMEZCUXpGQ0xGRkJRVVVzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNVMEZCVXl4RFFVRkRPMHRCUTNKRU8wZEJRMFlzUTBGQlF6czdPenQzUWtGSFR5eERRVUZETzBGQlExSXNVVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzWkNMRkZCUVVrc1UwRkJVeXhaUVVGQk8xRkJRVVVzUzBGQlN5eFpRVUZCTzFGQlFVVXNTMEZCU3l4WlFVRkJPMUZCUVVVc1RVRkJUU3haUVVGQkxFTkJRVU03UVVGRGNFTXNVVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhQUVVGSkxFTkJRVU03TzBGQlJYaENMRkZCUVVrc1MwRkJTeXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU5xUWl4WlFVRk5MRWRCUVVjc05rSkJRVmNzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTI1RExGZEJRVXNzUTBGQlF5eFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVNdlFpeGxRVUZUTEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRMUVVONlFqczdRVUZGUkN4UlFVRkpMRXRCUVVzc1EwRkJReXhIUVVGSExFVkJRVVU3UVVGRFlpeFpRVUZOTEVkQlFVY3NOa0pCUVZjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlF5OUNMRmRCUVVzc1EwRkJReXhIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0QlFVTXpRaXhYUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0TFFVTnlRanM3UVVGRlJDeFJRVUZKTEV0QlFVc3NUMEZCU1N4RlFVRkZPMEZCUTJJc1dVRkJUU3hIUVVGSExEWkNRVUZYTEV0QlFVc3NUMEZCU1N4RFFVRkRMRU5CUVVNN1FVRkRMMElzVjBGQlN5eFBRVUZKTEVkQlFVY3NUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVNelFpeFhRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRMUVVOeVFqczdRVUZGUkN4UlFVRkpMRTlCUVU4c1NVRkJTU3hQUVVGUExFTkJRVU1zVVVGQlVTeExRVUZMTEU5QlFVOHNSVUZCUlR0QlFVTXpReXhYUVVGTExFOUJRVWtzUTBGQlF5eFhRVUZYTEVkQlFVY3NOa0pCUVdVc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzB0QlF6TkVPenM3UVVGSFJDeFJRVUZKTEV0QlFVc3NRMEZCUXl4TlFVRk5MRXRCUVVzc1EwRkJReXhGUVVGRk8wRkJRM1JDTEZkQlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEU5QlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UzBGRGVrUTdPenRUUVVkSkxFbEJRVWtzUzBGQlN5eERRVUZETEUxQlFVMHNTMEZCU3l4RFFVRkRMRVZCUVVVN08wRkJSVE5DTEZsQlFVa3NTMEZCU3l4RFFVRkRMRTlCUVU4c1NVRkJTU3hMUVVGTExFTkJRVU1zVVVGQlVTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1JVRkJSVHRCUVVOcVJDeGpRVUZKTEZGQlFWRXNSMEZCUnl4UlFVRlJMRU5CUVVNc2MwSkJRWE5DTEVWQlFVVXNRMEZCUXpzN1FVRkZha1FzWlVGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNSVUZCUlN4UlFVRlJMRVZCUVZJc1VVRkJVU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEJRVU4yUkN4bFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExGZEJRVmNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZjRU1zYVVKQlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUlVGQlJTeFZRVUZUTEVWQlFVVXNSVUZCUlR0QlFVTjRReXhuUWtGQlNTeFBRVUZQTEVkQlFVY3NOa0pCUVZjc1JVRkJSU3hEUVVGRExFTkJRVU03T3p0QlFVYzNRaXhuUWtGQlNTeE5RVUZOTEVsQlFVa3NSVUZCUlN4RFFVRkRMRkZCUVZFc1MwRkJTeXhQUVVGUExFbEJRVWtzVFVGQlRTeERRVUZETEZkQlFWY3NSVUZCUlR0QlFVTXpSQ3h0UWtGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFMUJRVTBzUTBGQlF5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRMnhFTEc5Q1FVRkpMRkZCUVZFc1IwRkJSeXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNKRExIZENRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1NVRkJTU3hQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVWQlFVVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRsUVVNM1JEdGhRVU5HT3pzN1FVRkhSQ3huUWtGQlNTeE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMRkZCUVZFc1JVRkJSVHRCUVVNM1FpeHZRa0ZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMkZCUXpORE96dEJRVVZFTEhsQ1FVRmhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03VjBGRGJrSXNRMEZCUXl4RFFVRkRPMU5CUTBvN096dGhRVWRKTEVsQlFVa3NTMEZCU3l4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlNTeEZRVUZGTzBGQlEyaERMR2RDUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRVZCUVVVN1FVRkRla0lzYjBKQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc05FTkJRVFJETEVkQlF6RkVMR2RDUVVGblFpeERRVUZETEVOQlFVTTdZVUZEY2tJN08wRkJSVVFzWjBKQlFVa3NUVUZCVFN4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRE4wSXNiMEpCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEZsQlFWa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03WVVGRGJFUTdPenRCUVVkRUxHZENRVUZKTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhMUVVGTExFOUJRVThzUlVGQlJUdEJRVU5xUXl4dFFrRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJRenRoUVVOd1F6czdRVUZGUkN4cFFrRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNWMEZCVnl4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6czdRVUZGTlVNc2EwTkJRVk1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRk5CUVZNc1EwRkJRenRYUVVOdVF6czdPMlZCUjBrc1NVRkJTU3hMUVVGTExFTkJRVU1zUjBGQlJ5eEpRVUZKTEV0QlFVc3NUMEZCU1N4RlFVRkZPMEZCUXk5Q0xHdENRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFVkJRVVU3UVVGRGVrSXNjMEpCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zTmtOQlFUWkRMRWRCUXpORUxHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1pVRkRja0k3T3p0QlFVZEVMRzFDUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhQUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenM3TzBGQlIzQkZMR3RDUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4RlFVRkZPMEZCUXpkQ0xITkNRVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVExGRkJRVkVzUlVGQlJUdEJRVU42UXl3d1FrRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0cFFrRkRja0lzUTBGQlF5eERRVUZETzJWQlEwbzdPenRCUVVkRUxHdENRVUZKTEUxQlFVMHNTVUZCU1N4TlFVRk5MRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRemRDTEhOQ1FVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZUTEZGQlFWRXNSVUZCUlR0QlFVTjZReXd3UWtGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRVZCUVVVc1MwRkJTeXhQUVVGSkxFTkJRVU1zUTBGQlF6dHBRa0ZEYUVNc1EwRkJReXhEUVVGRE8yVkJRMG83T3p0QlFVZEVMR3RDUVVGSkxFdEJRVXNzVDBGQlNTeERRVUZETEU5QlFVOHNTMEZCU3l4UFFVRlBMRVZCUVVVN1FVRkRha01zY1VKQlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1lVRkJZU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEU5QlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETzJWQlEyNUZPenRCUVVWRUxHMUNRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1EwRkJReXhaUVVGWkxFTkJRVU1zUzBGQlN5eFBRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96czdRVUZIZUVRc2EwSkJRVWtzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRVZCUVVVN1FVRkROMElzYzBKQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVk1zVVVGQlVTeEZRVUZGTzBGQlEzcERMREJDUVVGUkxFTkJRVU1zUzBGQlN5eFBRVUZKTEVOQlFVTXNRMEZCUXp0cFFrRkRja0lzUTBGQlF5eERRVUZETzJWQlEwbzdPMEZCUlVRc2IwTkJRVk1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRk5CUVZNc1EwRkJRenRoUVVOdVF6dFBRVU5HT3pzN1YwRkhTU3hKUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEV0QlFVc3NRMEZCUXl4RlFVRkZPMEZCUXpOQ0xHTkJRVWtzWVVGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1dVRkJXU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN08wRkJSek5FTEdOQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wRkJRVVVzYVVKQlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0WFFVRkZMRTFCUXpORU8wRkJRVVVzYVVKQlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1dVRkJXU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8xZEJRVVU3T3p0QlFVYzNSQ3hqUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVU3UVVGRGNrTXNhVUpCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRM1pFTEd0Q1FVRkpMRkZCUVZFc1IwRkJSeXhOUVVGTkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE1VTXNjMEpCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEZRVUZGTEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVVc1lVRkJZU3hGUVVGRkxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0aFFVTnFSVHRYUVVOR08xTkJRMFk3T3p0aFFVZEpMRWxCUVVrc1MwRkJTeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVWQlFVVTdRVUZETTBJc1owSkJRVWtzWVVGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRE96dEJRVVU1UXl4cFFrRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVkQlFVY3NOa0pCUVdVc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3pzN1FVRkhlRVFzWjBKQlFVa3NUVUZCVFN4SlFVRkpMRTFCUVUwc1EwRkJReXhYUVVGWExFVkJRVVU3UVVGRGFFTXNiVUpCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTnNSQ3h2UWtGQlNTeFJRVUZSTEVkQlFVY3NUVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UXl4M1FrRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RlFVRkZMR0ZCUVdFc1JVRkJSU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdaVUZEYUVVN1lVRkRSanRYUVVOR096czdRVUV4U2tnc1QwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdWVUZCYUVNc1EwRkJRenRIUVRKS1ZEdERRVU5HSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNCaGRHTm9aWE12Y0hKdlkyVnpjeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCN0lIUnlZVzV6YVhScGIyNVRkR0YwWlhNZ2ZTQm1jbTl0SUNjdUxpOTBjbUZ1YzJsMGFXOXVjeWM3WEc1cGJYQnZjblFnZXlCd2IyOXNjeUJoY3lCZmNHOXZiSE1nZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0J2YjJ4ekp6dGNibWx0Y0c5eWRDQmtaV052WkdWRmJuUnBkR2xsY3lCbWNtOXRJQ2N1TGk5MWRHbHNMMlJsWTI5a1pTYzdYRzVwYlhCdmNuUWdaMlYwUld4bGJXVnVkQ0JtY205dElDY3VMaTlsYkdWdFpXNTBMMmRsZENjN1hHNXBiWEJ2Y25RZ2JXRnJaVTV2WkdVZ1puSnZiU0FuTGk0dmJtOWtaUzl0WVd0bEp6dGNibHh1YkdWMElIQnZiMnh6SUQwZ1gzQnZiMnh6TzF4dWJHVjBJR1p2Y2tWaFkyZ2dQU0JCY25KaGVTNXdjbTkwYjNSNWNHVXVabTl5UldGamFEdGNibHh1THlvcVhHNGdLaUJRY205alpYTnpaWE1nWVc0Z1FYSnlZWGtnYjJZZ2NHRjBZMmhsY3k1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnWlZ4dUlDb2dRSEpsZEhWeWJseHVJQ292WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JtZFc1amRHbHZiaUJ3Y205alpYTnpLR1ZzWlcxbGJuUXNJR1VwSUh0Y2JpQWdiR1YwSUhCaGRHTm9aWE1nUFNCbExtUmhkR0U3WEc0Z0lHeGxkQ0J6ZEdGMFpYTWdQU0IwY21GdWMybDBhVzl1VTNSaGRHVnpPMXh1WEc0Z0lHeGxkQ0JqWVd4c1EyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lHTmhiR3hpWVdOcktIUm9hWE1wTzF4dUlDQjlPMXh1WEc0Z0lHeGxkQ0JoZEhSaFkyaGxaRU5oYkd4aVlXTnJJRDBnWm5WdVkzUnBiMjRvWld4bGJXVnVkRVJsYzJOeWFYQjBiM0lwSUh0Y2JpQWdJQ0JzWlhRZ1pXd2dQU0JuWlhSRmJHVnRaVzUwS0dWc1pXMWxiblJFWlhOamNtbHdkRzl5S1M1bGJHVnRaVzUwTzF4dUlDQWdJR3hsZENCbWNtRm5iV1Z1ZENBOUlIUm9hWE11Wm5KaFoyMWxiblE3WEc1Y2JpQWdJQ0JwWmlBb1pXd3VibTlrWlU1aGJXVWdQVDA5SUNjamRHVjRkQ2NwSUh0Y2JpQWdJQ0FnSUdWc0xuUmxlSFJEYjI1MFpXNTBJRDBnWkdWamIyUmxSVzUwYVhScFpYTW9aV3d1ZEdWNGRFTnZiblJsYm5RcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdaeVlXZHRaVzUwTG1Gd2NHVnVaRU5vYVd4a0tHVnNLVHRjYmlBZ2ZUdGNibHh1SUNCc1pYUWdkR2wwYkdWRFlXeHNZbUZqYXlBOUlHWjFibU4wYVc5dUtHVnNaVzFsYm5SRVpYTmpjbWx3ZEc5eUtTQjdYRzRnSUNBZ2JHVjBJR1ZzSUQwZ1oyVjBSV3hsYldWdWRDaGxiR1Z0Wlc1MFJHVnpZM0pwY0hSdmNpa3VaV3hsYldWdWREdGNibHh1SUNBZ0lDOHZJRVZ1YzNWeVpTQjBhR1VnZEdsMGJHVWdhWE1nYzJWMElHTnZjbkpsWTNSc2VTNWNiaUFnSUNCcFppQW9aV3d1ZEdGblRtRnRaU0E5UFQwZ0ozUnBkR3hsSnlrZ2UxeHVJQ0FnSUNBZ1pXd3ViM2R1WlhKRWIyTjFiV1Z1ZEM1MGFYUnNaU0E5SUdWc0xtTm9hV3hrVG05a1pYTmJNRjB1Ym05a1pWWmhiSFZsTzF4dUlDQWdJSDFjYmlBZ2ZUdGNibHh1SUNBdkx5Qk1iMjl3SUhSb2NtOTFaMmdnWVd4c0lIUm9aU0J3WVhSamFHVnpJR0Z1WkNCaGNIQnNlU0IwYUdWdExseHVJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhCaGRHTm9aWE11YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNCc1pYUWdjR0YwWTJnZ1BTQndZWFJqYUdWelcybGRPMXh1SUNBZ0lHeGxkQ0JsYkdWdFpXNTBTV1FzSUc5c1pFbGtMQ0J1WlhkSlpDd2djbVZ6ZFd4ME8xeHVJQ0FnSUd4bGRDQmxiR1Z0Wlc1MElEMGdjR0YwWTJndWJtVjNPMXh1WEc0Z0lDQWdhV1lnS0hCaGRHTm9MbVZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJSEpsYzNWc2RDQTlJR2RsZEVWc1pXMWxiblFvY0dGMFkyZ3VaV3hsYldWdWRDazdYRzRnSUNBZ0lDQndZWFJqYUM1bGJHVnRaVzUwSUQwZ2NtVnpkV3gwTG1Wc1pXMWxiblE3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBTV1FnUFNCeVpYTjFiSFF1ZFhWcFpEdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jR0YwWTJndWIyeGtLU0I3WEc0Z0lDQWdJQ0J5WlhOMWJIUWdQU0JuWlhSRmJHVnRaVzUwS0hCaGRHTm9MbTlzWkNrN1hHNGdJQ0FnSUNCd1lYUmphQzV2YkdRZ1BTQnlaWE4xYkhRdVpXeGxiV1Z1ZER0Y2JpQWdJQ0FnSUc5c1pFbGtJRDBnY21WemRXeDBMblYxYVdRN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIQmhkR05vTG01bGR5a2dlMXh1SUNBZ0lDQWdjbVZ6ZFd4MElEMGdaMlYwUld4bGJXVnVkQ2h3WVhSamFDNXVaWGNwTzF4dUlDQWdJQ0FnY0dGMFkyZ3VibVYzSUQwZ2NtVnpkV3gwTG1Wc1pXMWxiblE3WEc0Z0lDQWdJQ0J1WlhkSlpDQTlJSEpsYzNWc2RDNTFkV2xrTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNobGJHVnRaVzUwSUNZbUlHVnNaVzFsYm5RdWJtOWtaVTVoYldVZ1BUMDlJQ2NqZEdWNGRDY3BJSHRjYmlBZ0lDQWdJSEJoZEdOb0xtNWxkeTUwWlhoMFEyOXVkR1Z1ZENBOUlHUmxZMjlrWlVWdWRHbDBhV1Z6S0dWc1pXMWxiblF1Ym05a1pWWmhiSFZsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCU1pYQnNZV05sSUhSb1pTQmxiblJwY21VZ1RtOWtaUzVjYmlBZ0lDQnBaaUFvY0dGMFkyZ3VYMTlrYjE5ZklEMDlQU0F3S1NCN1hHNGdJQ0FnSUNCd1lYUmphQzV2YkdRdWNHRnlaVzUwVG05a1pTNXlaWEJzWVdObFEyaHBiR1FvY0dGMFkyZ3VibVYzTENCd1lYUmphQzV2YkdRcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklFNXZaR1VnYldGdWFYQXVYRzRnSUNBZ1pXeHpaU0JwWmlBb2NHRjBZMmd1WDE5a2IxOWZJRDA5UFNBeEtTQjdYRzRnSUNBZ0lDQXZMeUJCWkdRdVhHNGdJQ0FnSUNCcFppQW9jR0YwWTJndVpXeGxiV1Z1ZENBbUppQndZWFJqYUM1bWNtRm5iV1Z1ZENBbUppQWhjR0YwWTJndWIyeGtLU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQm1jbUZuYldWdWRDQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVUnZZM1Z0Wlc1MFJuSmhaMjFsYm5Rb0tUdGNibHh1SUNBZ0lDQWdJQ0J3WVhSamFDNW1jbUZuYldWdWRDNW1iM0pGWVdOb0tHRjBkR0ZqYUdWa1EyRnNiR0poWTJzc0lIc2dabkpoWjIxbGJuUWdmU2s3WEc0Z0lDQWdJQ0FnSUhCaGRHTm9MbVZzWlcxbGJuUXVZWEJ3Wlc1a1EyaHBiR1FvWm5KaFoyMWxiblFwTzF4dVhHNGdJQ0FnSUNBZ0lHWnZja1ZoWTJndVkyRnNiQ2h3WVhSamFDNW1jbUZuYldWdWRDd2dablZ1WTNScGIyNG9aV3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnWld4bGJXVnVkQ0E5SUdkbGRFVnNaVzFsYm5Rb1pXd3BPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdWSEpwWjJkbGNpQmhiR3dnZEdobElIUmxlSFFnWTJoaGJtZGxaQ0IyWVd4MVpYTXVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsY3lBbUppQmxiQzV1YjJSbFRtRnRaU0E5UFQwZ0p5TjBaWGgwSnlBbUppQnpkR0YwWlhNdWRHVjRkRU5vWVc1blpXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElIZ2dQU0F3T3lCNElEd2djM1JoZEdWekxuUmxlSFJEYUdGdVoyVmtMbXhsYm1kMGFEc2dlQ3NyS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUd4bGRDQmpZV3hzWW1GamF5QTlJSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaRnQ0WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnWTJGc2JHSmhZMnNvWld4bGJXVnVkQzV3WVhKbGJuUk9iMlJsSUh4OElHVnNaVzFsYm5Rc0lHNTFiR3dzSUdWc0xtNXZaR1ZXWVd4MVpTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdRV1JrWldRZ2MzUmhkR1VnWm05eUlIUnlZVzV6YVhScGIyNXpJRUZRU1M1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYzNSaGRHVnpJQ1ltSUhOMFlYUmxjeTVoZEhSaFkyaGxaQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjM1JoZEdWekxtRjBkR0ZqYUdWa0xtWnZja1ZoWTJnb1kyRnNiRU5oYkd4aVlXTnJMQ0JsYkNrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2RHbDBiR1ZEWVd4c1ltRmpheWhsYkNrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCU1pXMXZkbVZjYmlBZ0lDQWdJR1ZzYzJVZ2FXWWdLSEJoZEdOb0xtOXNaQ0FtSmlBaGNHRjBZMmd1Ym1WM0tTQjdYRzRnSUNBZ0lDQWdJR2xtSUNnaGNHRjBZMmd1YjJ4a0xuQmhjbVZ1ZEU1dlpHVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjBOaGJseGNKM1FnY21WdGIzWmxJSGRwZEdodmRYUWdjR0Z5Wlc1MExDQnBjeUIwYUdseklIUm9aU0FuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2RrYjJOMWJXVnVkQ0J5YjI5MFB5Y3BPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVaR1YwWVdOb1pXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCemRHRjBaWE11WkdWMFlXTm9aV1F1Wm05eVJXRmphQ2hqWVd4c1EyRnNiR0poWTJzc0lIQmhkR05vTG05c1pDazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QkZibk4xY21VZ2RHaGxJSFJwZEd4bElHbHpJR1Z0Y0hScFpXUXVYRzRnSUNBZ0lDQWdJR2xtSUNod1lYUmphQzV2YkdRdWRHRm5UbUZ0WlNBOVBUMGdKM1JwZEd4bEp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUhCaGRHTm9MbTlzWkM1dmQyNWxja1J2WTNWdFpXNTBMblJwZEd4bElEMGdKeWM3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQndZWFJqYUM1dmJHUXVjR0Z5Wlc1MFRtOWtaUzV5WlcxdmRtVkRhR2xzWkNod1lYUmphQzV2YkdRcE8xeHVYRzRnSUNBZ0lDQWdJRzFoYTJWT2IyUmxMbTV2WkdWelcyOXNaRWxrWFNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnVW1Wd2JHRmpaVnh1SUNBZ0lDQWdaV3h6WlNCcFppQW9jR0YwWTJndWIyeGtJQ1ltSUhCaGRHTm9MbTVsZHlrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvSVhCaGRHTm9MbTlzWkM1d1lYSmxiblJPYjJSbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2REWVc1Y1hDZDBJSEpsY0d4aFkyVWdkMmwwYUc5MWRDQndZWEpsYm5Rc0lHbHpJSFJvYVhNZ2RHaGxJQ2NnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKMlJ2WTNWdFpXNTBJSEp2YjNRL0p5azdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QkJjSEJsYm1RZ2RHaGxJR1ZzWlcxbGJuUWdabWx5YzNRc0lHSmxabTl5WlNCa2IybHVaeUIwYUdVZ2NtVndiR0ZqWlcxbGJuUXVYRzRnSUNBZ0lDQWdJSEJoZEdOb0xtOXNaQzV3WVhKbGJuUk9iMlJsTG1sdWMyVnlkRUpsWm05eVpTaHdZWFJqYUM1dVpYY3NJSEJoZEdOb0xtOXNaQzV1WlhoMFUybGliR2x1WnlrN1hHNWNiaUFnSUNBZ0lDQWdMeThnVW1WdGIzWmxaQ0J6ZEdGMFpTQm1iM0lnZEhKaGJuTnBkR2x2Ym5NZ1FWQkpMbHh1SUNBZ0lDQWdJQ0JwWmlBb2MzUmhkR1Z6SUNZbUlITjBZWFJsY3k1a1pYUmhZMmhsWkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSE4wWVhSbGN5NWtaWFJoWTJobFpDNW1iM0pGWVdOb0tHWjFibU4wYVc5dUtHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCallXeHNZbUZqYXlod1lYUmphQzV2YkdRcE8xeHVJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnVW1Wd2JHRmpaV1FnYzNSaGRHVWdabTl5SUhSeVlXNXphWFJwYjI1eklFRlFTUzVjYmlBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsY3lBbUppQnpkR0YwWlhNdWNtVndiR0ZqWldRcElIdGNiaUFnSUNBZ0lDQWdJQ0J6ZEdGMFpYTXVjbVZ3YkdGalpXUXVabTl5UldGamFDaG1kVzVqZEdsdmJpaGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRnNiR0poWTJzb2NHRjBZMmd1YjJ4a0xDQndZWFJqYUM1dVpYY3BPMXh1SUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1JXNXpkWEpsSUhSb1pTQjBhWFJzWlNCcGN5QnpaWFFnWTI5eWNtVmpkR3g1TGx4dUlDQWdJQ0FnSUNCcFppQW9jR0YwWTJndWJtVjNMblJoWjA1aGJXVWdQVDA5SUNkMGFYUnNaU2NwSUh0Y2JpQWdJQ0FnSUNBZ0lDQndZWFJqYUM1dmJHUXViM2R1WlhKRWIyTjFiV1Z1ZEM1MGFYUnNaU0E5SUhCaGRHTm9MbTVsZHk1amFHbHNaRTV2WkdWeld6QmRMbTV2WkdWV1lXeDFaVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIQmhkR05vTG05c1pDNXdZWEpsYm5ST2IyUmxMbkpsY0d4aFkyVkRhR2xzWkNod1lYUmphQzV1Wlhjc0lIQmhkR05vTG05c1pDazdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtaV1FnYzNSaGRHVWdabTl5SUhSeVlXNXphWFJwYjI1eklFRlFTUzVjYmlBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsY3lBbUppQnpkR0YwWlhNdVlYUjBZV05vWldRcElIdGNiaUFnSUNBZ0lDQWdJQ0J6ZEdGMFpYTXVZWFIwWVdOb1pXUXVabTl5UldGamFDaG1kVzVqZEdsdmJpaGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRnNiR0poWTJzb2NHRjBZMmd1Ym1WM0tUdGNiaUFnSUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzFoYTJWT2IyUmxMbTV2WkdWelcyOXNaRWxrWFNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QkJkSFJ5YVdKMWRHVWdiV0Z1YVhCMWJHRjBhVzl1TGx4dUlDQWdJR1ZzYzJVZ2FXWWdLSEJoZEdOb0xsOWZaRzlmWHlBOVBUMGdNaWtnZTF4dUlDQWdJQ0FnYkdWMElHOXlhV2RwYm1Gc1ZtRnNkV1VnUFNCd1lYUmphQzVsYkdWdFpXNTBMbWRsZEVGMGRISnBZblYwWlNod1lYUmphQzV1WVcxbEtUdGNibHh1SUNBZ0lDQWdMeThnVW1WdGIzWmxMbHh1SUNBZ0lDQWdhV1lnS0NGd1lYUmphQzUyWVd4MVpTa2dleUJ3WVhSamFDNWxiR1Z0Wlc1MExuSmxiVzkyWlVGMGRISnBZblYwWlNod1lYUmphQzV1WVcxbEtUc2dmVnh1SUNBZ0lDQWdaV3h6WlNCN0lIQmhkR05vTG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtIQmhkR05vTG01aGJXVXNJSEJoZEdOb0xuWmhiSFZsS1RzZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJVY21sbloyVnlJR0ZzYkNCMGFHVWdZWFIwY21saWRYUmxJR05vWVc1blpXUWdkbUZzZFdWekxseHVJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVZWFIwY21saWRYUmxRMmhoYm1kbFpDa2dlMXh1SUNBZ0lDQWdJQ0JtYjNJZ0tHeGxkQ0I0SUQwZ01Ec2dlQ0E4SUhOMFlYUmxjeTVoZEhSeWFXSjFkR1ZEYUdGdVoyVmtMbXhsYm1kMGFEc2dlQ3NyS1NCN1hHNGdJQ0FnSUNBZ0lDQWdiR1YwSUdOaGJHeGlZV05ySUQwZ2MzUmhkR1Z6TG1GMGRISnBZblYwWlVOb1lXNW5aV1JiZUYwN1hHNGdJQ0FnSUNBZ0lDQWdZMkZzYkdKaFkyc29jR0YwWTJndVpXeGxiV1Z1ZEN3Z2NHRjBZMmd1Ym1GdFpTd2diM0pwWjJsdVlXeFdZV3gxWlN3Z2NHRjBZMmd1ZG1Gc2RXVXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVkdWNGRDQnViMlJsSUcxaGJtbHdkV3hoZEdsdmJpNWNiaUFnSUNCbGJITmxJR2xtSUNod1lYUmphQzVmWDJSdlgxOGdQVDA5SURNcElIdGNiaUFnSUNBZ0lHeGxkQ0J2Y21sbmFXNWhiRlpoYkhWbElEMGdjR0YwWTJndVpXeGxiV1Z1ZEM1MFpYaDBRMjl1ZEdWdWREdGNibHh1SUNBZ0lDQWdjR0YwWTJndVpXeGxiV1Z1ZEM1MFpYaDBRMjl1ZEdWdWRDQTlJR1JsWTI5a1pVVnVkR2wwYVdWektIQmhkR05vTG5aaGJIVmxLVHRjYmx4dUlDQWdJQ0FnTHk4Z1ZISnBaMmRsY2lCaGJHd2dkR2hsSUhSbGVIUWdZMmhoYm1kbFpDQjJZV3gxWlhNdVhHNGdJQ0FnSUNCcFppQW9jM1JoZEdWeklDWW1JSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaQ2tnZTF4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCNElEMGdNRHNnZUNBOElITjBZWFJsY3k1MFpYaDBRMmhoYm1kbFpDNXNaVzVuZEdnN0lIZ3JLeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHeGxkQ0JqWVd4c1ltRmpheUE5SUhOMFlYUmxjeTUwWlhoMFEyaGhibWRsWkZ0NFhUdGNiaUFnSUNBZ0lDQWdJQ0JqWVd4c1ltRmpheWh3WVhSamFDNWxiR1Z0Wlc1MExuQmhjbVZ1ZEU1dlpHVXNJRzl5YVdkcGJtRnNWbUZzZFdVc0lIQmhkR05vTG5aaGJIVmxLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ2ZWeHVmVnh1SWwxOSIsIi8vIExpc3Qgb2YgU1ZHIGVsZW1lbnRzLlxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBlbGVtZW50cyA9IFsnYWx0R2x5cGgnLCAnYWx0R2x5cGhEZWYnLCAnYWx0R2x5cGhJdGVtJywgJ2FuaW1hdGUnLCAnYW5pbWF0ZUNvbG9yJywgJ2FuaW1hdGVNb3Rpb24nLCAnYW5pbWF0ZVRyYW5zZm9ybScsICdjaXJjbGUnLCAnY2xpcFBhdGgnLCAnY29sb3ItcHJvZmlsZScsICdjdXJzb3InLCAnZGVmcycsICdkZXNjJywgJ2VsbGlwc2UnLCAnZmVCbGVuZCcsICdmZUNvbG9yTWF0cml4JywgJ2ZlQ29tcG9uZW50VHJhbnNmZXInLCAnZmVDb21wb3NpdGUnLCAnZmVDb252b2x2ZU1hdHJpeCcsICdmZURpZmZ1c2VMaWdodGluZycsICdmZURpc3BsYWNlbWVudE1hcCcsICdmZURpc3RhbnRMaWdodCcsICdmZUZsb29kJywgJ2ZlRnVuY0EnLCAnZmVGdW5jQicsICdmZUZ1bmNHJywgJ2ZlRnVuY1InLCAnZmVHYXVzc2lhbkJsdXInLCAnZmVJbWFnZScsICdmZU1lcmdlJywgJ2ZlTWVyZ2VOb2RlJywgJ2ZlTW9ycGhvbG9neScsICdmZU9mZnNldCcsICdmZVBvaW50TGlnaHQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJywgJ2ZlU3BvdExpZ2h0JywgJ2ZlVGlsZScsICdmZVR1cmJ1bGVuY2UnLCAnZmlsdGVyJywgJ2ZvbnQnLCAnZm9udC1mYWNlJywgJ2ZvbnQtZmFjZS1mb3JtYXQnLCAnZm9udC1mYWNlLW5hbWUnLCAnZm9udC1mYWNlLXNyYycsICdmb250LWZhY2UtdXJpJywgJ2ZvcmVpZ25PYmplY3QnLCAnZycsICdnbHlwaCcsICdnbHlwaFJlZicsICdoa2VybicsICdpbWFnZScsICdsaW5lJywgJ2xpbmVhckdyYWRpZW50JywgJ21hcmtlcicsICdtYXNrJywgJ21ldGFkYXRhJywgJ21pc3NpbmctZ2x5cGgnLCAnbXBhdGgnLCAncGF0aCcsICdwYXR0ZXJuJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmFkaWFsR3JhZGllbnQnLCAncmVjdCcsICdzY3JpcHQnLCAnc2V0JywgJ3N0b3AnLCAnc3R5bGUnLCAnc3ZnJywgJ3N3aXRjaCcsICdzeW1ib2wnLCAndGV4dCcsICd0ZXh0UGF0aCcsICd0aXRsZScsICd0cmVmJywgJ3RzcGFuJywgJ3VzZScsICd2aWV3JywgJ3ZrZXJuJ107XG5cbmV4cG9ydHMuZWxlbWVudHMgPSBlbGVtZW50cztcbi8vIE5hbWVzcGFjZS5cbnZhciBuYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuZXhwb3J0cy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNOMlp5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN1FVRkRUeXhKUVVGSkxGRkJRVkVzUjBGQlJ5eERRVU53UWl4VlFVRlZMRVZCUTFZc1lVRkJZU3hGUVVOaUxHTkJRV01zUlVGRFpDeFRRVUZUTEVWQlExUXNZMEZCWXl4RlFVTmtMR1ZCUVdVc1JVRkRaaXhyUWtGQmEwSXNSVUZEYkVJc1VVRkJVU3hGUVVOU0xGVkJRVlVzUlVGRFZpeGxRVUZsTEVWQlEyWXNVVUZCVVN4RlFVTlNMRTFCUVUwc1JVRkRUaXhOUVVGTkxFVkJRMDRzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4bFFVRmxMRVZCUTJZc2NVSkJRWEZDTEVWQlEzSkNMR0ZCUVdFc1JVRkRZaXhyUWtGQmEwSXNSVUZEYkVJc2JVSkJRVzFDTEVWQlEyNUNMRzFDUVVGdFFpeEZRVU51UWl4blFrRkJaMElzUlVGRGFFSXNVMEZCVXl4RlFVTlVMRk5CUVZNc1JVRkRWQ3hUUVVGVExFVkJRMVFzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4blFrRkJaMElzUlVGRGFFSXNVMEZCVXl4RlFVTlVMRk5CUVZNc1JVRkRWQ3hoUVVGaExFVkJRMklzWTBGQll5eEZRVU5rTEZWQlFWVXNSVUZEVml4alFVRmpMRVZCUTJRc2IwSkJRVzlDTEVWQlEzQkNMR0ZCUVdFc1JVRkRZaXhSUVVGUkxFVkJRMUlzWTBGQll5eEZRVU5rTEZGQlFWRXNSVUZEVWl4TlFVRk5MRVZCUTA0c1YwRkJWeXhGUVVOWUxHdENRVUZyUWl4RlFVTnNRaXhuUWtGQlowSXNSVUZEYUVJc1pVRkJaU3hGUVVObUxHVkJRV1VzUlVGRFppeGxRVUZsTEVWQlEyWXNSMEZCUnl4RlFVTklMRTlCUVU4c1JVRkRVQ3hWUVVGVkxFVkJRMVlzVDBGQlR5eEZRVU5RTEU5QlFVOHNSVUZEVUN4TlFVRk5MRVZCUTA0c1owSkJRV2RDTEVWQlEyaENMRkZCUVZFc1JVRkRVaXhOUVVGTkxFVkJRMDRzVlVGQlZTeEZRVU5XTEdWQlFXVXNSVUZEWml4UFFVRlBMRVZCUTFBc1RVRkJUU3hGUVVOT0xGTkJRVk1zUlVGRFZDeFRRVUZUTEVWQlExUXNWVUZCVlN4RlFVTldMR2RDUVVGblFpeEZRVU5vUWl4TlFVRk5MRVZCUTA0c1VVRkJVU3hGUVVOU0xFdEJRVXNzUlVGRFRDeE5RVUZOTEVWQlEwNHNUMEZCVHl4RlFVTlFMRXRCUVVzc1JVRkRUQ3hSUVVGUkxFVkJRMUlzVVVGQlVTeEZRVU5TTEUxQlFVMHNSVUZEVGl4VlFVRlZMRVZCUTFZc1QwRkJUeXhGUVVOUUxFMUJRVTBzUlVGRFRpeFBRVUZQTEVWQlExQXNTMEZCU3l4RlFVTk1MRTFCUVUwc1JVRkRUaXhQUVVGUExFTkJRMUlzUTBGQlF6czdPenRCUVVkTExFbEJRVWtzVTBGQlV5eEhRVUZITERSQ1FVRTBRaXhEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzTjJaeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRXhwYzNRZ2IyWWdVMVpISUdWc1pXMWxiblJ6TGx4dVpYaHdiM0owSUd4bGRDQmxiR1Z0Wlc1MGN5QTlJRnRjYmlBZ0oyRnNkRWRzZVhCb0p5eGNiaUFnSjJGc2RFZHNlWEJvUkdWbUp5eGNiaUFnSjJGc2RFZHNlWEJvU1hSbGJTY3NYRzRnSUNkaGJtbHRZWFJsSnl4Y2JpQWdKMkZ1YVcxaGRHVkRiMnh2Y2ljc1hHNGdJQ2RoYm1sdFlYUmxUVzkwYVc5dUp5eGNiaUFnSjJGdWFXMWhkR1ZVY21GdWMyWnZjbTBuTEZ4dUlDQW5ZMmx5WTJ4bEp5eGNiaUFnSjJOc2FYQlFZWFJvSnl4Y2JpQWdKMk52Ykc5eUxYQnliMlpwYkdVbkxGeHVJQ0FuWTNWeWMyOXlKeXhjYmlBZ0oyUmxabk1uTEZ4dUlDQW5aR1Z6WXljc1hHNGdJQ2RsYkd4cGNITmxKeXhjYmlBZ0oyWmxRbXhsYm1RbkxGeHVJQ0FuWm1WRGIyeHZjazFoZEhKcGVDY3NYRzRnSUNkbVpVTnZiWEJ2Ym1WdWRGUnlZVzV6Wm1WeUp5eGNiaUFnSjJabFEyOXRjRzl6YVhSbEp5eGNiaUFnSjJabFEyOXVkbTlzZG1WTllYUnlhWGduTEZ4dUlDQW5abVZFYVdabWRYTmxUR2xuYUhScGJtY25MRnh1SUNBblptVkVhWE53YkdGalpXMWxiblJOWVhBbkxGeHVJQ0FuWm1WRWFYTjBZVzUwVEdsbmFIUW5MRnh1SUNBblptVkdiRzl2WkNjc1hHNGdJQ2RtWlVaMWJtTkJKeXhjYmlBZ0oyWmxSblZ1WTBJbkxGeHVJQ0FuWm1WR2RXNWpSeWNzWEc0Z0lDZG1aVVoxYm1OU0p5eGNiaUFnSjJabFIyRjFjM05wWVc1Q2JIVnlKeXhjYmlBZ0oyWmxTVzFoWjJVbkxGeHVJQ0FuWm1WTlpYSm5aU2NzWEc0Z0lDZG1aVTFsY21kbFRtOWtaU2NzWEc0Z0lDZG1aVTF2Y25Cb2IyeHZaM2tuTEZ4dUlDQW5abVZQWm1aelpYUW5MRnh1SUNBblptVlFiMmx1ZEV4cFoyaDBKeXhjYmlBZ0oyWmxVM0JsWTNWc1lYSk1hV2RvZEdsdVp5Y3NYRzRnSUNkbVpWTndiM1JNYVdkb2RDY3NYRzRnSUNkbVpWUnBiR1VuTEZ4dUlDQW5abVZVZFhKaWRXeGxibU5sSnl4Y2JpQWdKMlpwYkhSbGNpY3NYRzRnSUNkbWIyNTBKeXhjYmlBZ0oyWnZiblF0Wm1GalpTY3NYRzRnSUNkbWIyNTBMV1poWTJVdFptOXliV0YwSnl4Y2JpQWdKMlp2Ym5RdFptRmpaUzF1WVcxbEp5eGNiaUFnSjJadmJuUXRabUZqWlMxemNtTW5MRnh1SUNBblptOXVkQzFtWVdObExYVnlhU2NzWEc0Z0lDZG1iM0psYVdkdVQySnFaV04wSnl4Y2JpQWdKMmNuTEZ4dUlDQW5aMng1Y0dnbkxGeHVJQ0FuWjJ4NWNHaFNaV1luTEZ4dUlDQW5hR3RsY200bkxGeHVJQ0FuYVcxaFoyVW5MRnh1SUNBbmJHbHVaU2NzWEc0Z0lDZHNhVzVsWVhKSGNtRmthV1Z1ZENjc1hHNGdJQ2R0WVhKclpYSW5MRnh1SUNBbmJXRnpheWNzWEc0Z0lDZHRaWFJoWkdGMFlTY3NYRzRnSUNkdGFYTnphVzVuTFdkc2VYQm9KeXhjYmlBZ0oyMXdZWFJvSnl4Y2JpQWdKM0JoZEdnbkxGeHVJQ0FuY0dGMGRHVnliaWNzWEc0Z0lDZHdiMng1WjI5dUp5eGNiaUFnSjNCdmJIbHNhVzVsSnl4Y2JpQWdKM0poWkdsaGJFZHlZV1JwWlc1MEp5eGNiaUFnSjNKbFkzUW5MRnh1SUNBbmMyTnlhWEIwSnl4Y2JpQWdKM05sZENjc1hHNGdJQ2R6ZEc5d0p5eGNiaUFnSjNOMGVXeGxKeXhjYmlBZ0ozTjJaeWNzWEc0Z0lDZHpkMmwwWTJnbkxGeHVJQ0FuYzNsdFltOXNKeXhjYmlBZ0ozUmxlSFFuTEZ4dUlDQW5kR1Y0ZEZCaGRHZ25MRnh1SUNBbmRHbDBiR1VuTEZ4dUlDQW5kSEpsWmljc1hHNGdJQ2QwYzNCaGJpY3NYRzRnSUNkMWMyVW5MRnh1SUNBbmRtbGxkeWNzWEc0Z0lDZDJhMlZ5Ymljc1hHNWRPMXh1WEc0dkx5Qk9ZVzFsYzNCaFkyVXVYRzVsZUhCdmNuUWdiR1YwSUc1aGJXVnpjR0ZqWlNBOUlDZG9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5YzdYRzRpWFgwPSIsIi8qKlxuICogQ29udGFpbnMgYXJyYXlzIHRvIHN0b3JlIHRyYW5zaXRpb24gY2FsbGJhY2tzLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciB0cmFuc2l0aW9uU3RhdGVzID0ge307XG5cbmV4cG9ydHMudHJhbnNpdGlvblN0YXRlcyA9IHRyYW5zaXRpb25TdGF0ZXM7XG4vKipcbiAqIEZvciB3aGVuIGVsZW1lbnRzIGNvbWUgaW50byB0aGUgRE9NLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnMgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIHRoZSBlbGVtZW50IGVudGVycyB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCBhcyB0aGUgb25seVxuICogYXJndW1lbnQuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMuYXR0YWNoZWQgPSBbXTtcblxuLyoqXG4gKiBGb3Igd2hlbiBlbGVtZW50cyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIFRoZSBjYWxsYmFjayB0cmlnZ2VycyBqdXN0XG4gKiBiZWZvcmUgdGhlIGVsZW1lbnQgbGVhdmVzIHRoZSBET00uIEl0IGlzIGNhbGxlZCB3aXRoIHRoZSBlbGVtZW50IGFzIHRoZSBvbmx5XG4gKiBhcmd1bWVudC5cbiAqL1xudHJhbnNpdGlvblN0YXRlcy5kZXRhY2hlZCA9IFtdO1xuXG4vKlxuICogRm9yIHdoZW4gZWxlbWVudHMgYXJlIHJlcGxhY2VkIGluIHRoZSBET00uIFRoZSBjYWxsYmFjayB0cmlnZ2VycyBhZnRlciB0aGVcbiAqIG5ldyBlbGVtZW50IGVudGVycyB0aGUgRE9NLCBhbmQgYmVmb3JlIHRoZSBvbGQgZWxlbWVudCBsZWF2ZXMuIEl0IGlzIGNhbGxlZFxuICogd2l0aCBvbGQgYW5kIG5ldyBlbGVtZW50cyBhcyBhcmd1bWVudHMsIGluIHRoYXQgb3JkZXIuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMucmVwbGFjZWQgPSBbXTtcblxuLypcbiAqIFRyaWdnZXJlZCB3aGVuIGFuIGVsZW1lbnQncyBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQuIFRoZSBjYWxsYmFjayB0cmlnZ2Vyc1xuICogYWZ0ZXIgdGhlIGF0dHJpYnV0ZSBoYXMgY2hhbmdlZCBpbiB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCxcbiAqIHRoZSBhdHRyaWJ1dGUgbmFtZSwgb2xkIHZhbHVlLCBhbmQgY3VycmVudCB2YWx1ZS5cbiAqL1xudHJhbnNpdGlvblN0YXRlcy5hdHRyaWJ1dGVDaGFuZ2VkID0gW107XG5cbi8qXG4gKiBUcmlnZ2VyZWQgd2hlbiBhbiBlbGVtZW50J3MgYHRleHRDb250ZW50YCBjaG5hZ2VzLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnNcbiAqIGFmdGVyIHRoZSB0ZXh0Q29udGVudCBoYXMgY2hhbmdlZCBpbiB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCxcbiAqIHRoZSBvbGQgdmFsdWUsIGFuZCBjdXJyZW50IHZhbHVlLlxuICovXG50cmFuc2l0aW9uU3RhdGVzLnRleHRDaGFuZ2VkID0gW107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNSeVlXNXphWFJwYjI1ekxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN08wRkJSMDhzU1VGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhGUVVGRkxFTkJRVU03T3pzN096czdPMEZCVDJwRExHZENRVUZuUWl4RFFVRkRMRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU03T3pzN096czdRVUZQTDBJc1owSkJRV2RDTEVOQlFVTXNVVUZCVVN4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096dEJRVTh2UWl4blFrRkJaMElzUTBGQlF5eFJRVUZSTEVkQlFVY3NSVUZCUlN4RFFVRkRPenM3T3pzN08wRkJUeTlDTEdkQ1FVRm5RaXhEUVVGRExHZENRVUZuUWl4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096dEJRVTkyUXl4blFrRkJaMElzUTBGQlF5eFhRVUZYTEVkQlFVY3NSVUZCUlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1J5WVc1emFYUnBiMjV6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkRiMjUwWVdsdWN5QmhjbkpoZVhNZ2RHOGdjM1J2Y21VZ2RISmhibk5wZEdsdmJpQmpZV3hzWW1GamEzTXVYRzRnS2k5Y2JtVjRjRzl5ZENCc1pYUWdkSEpoYm5OcGRHbHZibE4wWVhSbGN5QTlJSHQ5TzF4dVhHNHZLaXBjYmlBcUlFWnZjaUIzYUdWdUlHVnNaVzFsYm5SeklHTnZiV1VnYVc1MGJ5QjBhR1VnUkU5TkxpQlVhR1VnWTJGc2JHSmhZMnNnZEhKcFoyZGxjbk1nYVcxdFpXUnBZWFJsYkhrZ1lXWjBaWEpjYmlBcUlIUm9aU0JsYkdWdFpXNTBJR1Z1ZEdWeWN5QjBhR1VnUkU5TkxpQkpkQ0JwY3lCallXeHNaV1FnZDJsMGFDQjBhR1VnWld4bGJXVnVkQ0JoY3lCMGFHVWdiMjVzZVZ4dUlDb2dZWEpuZFcxbGJuUXVYRzRnS2k5Y2JuUnlZVzV6YVhScGIyNVRkR0YwWlhNdVlYUjBZV05vWldRZ1BTQmJYVHRjYmx4dUx5b3FYRzRnS2lCR2IzSWdkMmhsYmlCbGJHVnRaVzUwY3lCaGNtVWdjbVZ0YjNabFpDQm1jbTl0SUhSb1pTQkVUMDB1SUZSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWN5QnFkWE4wWEc0Z0tpQmlaV1p2Y21VZ2RHaGxJR1ZzWlcxbGJuUWdiR1ZoZG1WeklIUm9aU0JFVDAwdUlFbDBJR2x6SUdOaGJHeGxaQ0IzYVhSb0lIUm9aU0JsYkdWdFpXNTBJR0Z6SUhSb1pTQnZibXg1WEc0Z0tpQmhjbWQxYldWdWRDNWNiaUFxTDF4dWRISmhibk5wZEdsdmJsTjBZWFJsY3k1a1pYUmhZMmhsWkNBOUlGdGRPMXh1WEc0dktseHVJQ29nUm05eUlIZG9aVzRnWld4bGJXVnVkSE1nWVhKbElISmxjR3hoWTJWa0lHbHVJSFJvWlNCRVQwMHVJRlJvWlNCallXeHNZbUZqYXlCMGNtbG5aMlZ5Y3lCaFpuUmxjaUIwYUdWY2JpQXFJRzVsZHlCbGJHVnRaVzUwSUdWdWRHVnljeUIwYUdVZ1JFOU5MQ0JoYm1RZ1ltVm1iM0psSUhSb1pTQnZiR1FnWld4bGJXVnVkQ0JzWldGMlpYTXVJRWwwSUdseklHTmhiR3hsWkZ4dUlDb2dkMmwwYUNCdmJHUWdZVzVrSUc1bGR5QmxiR1Z0Wlc1MGN5QmhjeUJoY21kMWJXVnVkSE1zSUdsdUlIUm9ZWFFnYjNKa1pYSXVYRzRnS2k5Y2JuUnlZVzV6YVhScGIyNVRkR0YwWlhNdWNtVndiR0ZqWldRZ1BTQmJYVHRjYmx4dUx5cGNiaUFxSUZSeWFXZG5aWEpsWkNCM2FHVnVJR0Z1SUdWc1pXMWxiblFuY3lCaGRIUnlhV0oxZEdVZ2FHRnpJR05vWVc1blpXUXVJRlJvWlNCallXeHNZbUZqYXlCMGNtbG5aMlZ5YzF4dUlDb2dZV1owWlhJZ2RHaGxJR0YwZEhKcFluVjBaU0JvWVhNZ1kyaGhibWRsWkNCcGJpQjBhR1VnUkU5TkxpQkpkQ0JwY3lCallXeHNaV1FnZDJsMGFDQjBhR1VnWld4bGJXVnVkQ3hjYmlBcUlIUm9aU0JoZEhSeWFXSjFkR1VnYm1GdFpTd2diMnhrSUhaaGJIVmxMQ0JoYm1RZ1kzVnljbVZ1ZENCMllXeDFaUzVjYmlBcUwxeHVkSEpoYm5OcGRHbHZibE4wWVhSbGN5NWhkSFJ5YVdKMWRHVkRhR0Z1WjJWa0lEMGdXMTA3WEc1Y2JpOHFYRzRnS2lCVWNtbG5aMlZ5WldRZ2QyaGxiaUJoYmlCbGJHVnRaVzUwSjNNZ1lIUmxlSFJEYjI1MFpXNTBZQ0JqYUc1aFoyVnpMaUJVYUdVZ1kyRnNiR0poWTJzZ2RISnBaMmRsY25OY2JpQXFJR0ZtZEdWeUlIUm9aU0IwWlhoMFEyOXVkR1Z1ZENCb1lYTWdZMmhoYm1kbFpDQnBiaUIwYUdVZ1JFOU5MaUJKZENCcGN5QmpZV3hzWldRZ2QybDBhQ0IwYUdVZ1pXeGxiV1Z1ZEN4Y2JpQXFJSFJvWlNCdmJHUWdkbUZzZFdVc0lHRnVaQ0JqZFhKeVpXNTBJSFpoYkhWbExseHVJQ292WEc1MGNtRnVjMmwwYVc5dVUzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0lEMGdXMTA3WEc0aVhYMD0iLCIvLyBDcmVhdGUgYSBkZWZhdWx0IGJ1ZmZlciBhdCBsZW5ndGggMTAyNC5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnN0cmluZ1RvQnVmZmVyID0gc3RyaW5nVG9CdWZmZXI7XG5leHBvcnRzLmJ1ZmZlclRvU3RyaW5nID0gYnVmZmVyVG9TdHJpbmc7XG52YXIgYnVmZmVyID0gbmV3IFVpbnQxNkFycmF5KDApO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIHRvIGEgYnVmZmVyLiBBdHRlbXB0cyB0byByZXVzZSB0aGUgcHJldmlvdXMgYnVmZmVyLCB1bmxlc3NcbiAqIHRoZSBuZXcgSFRNTCBoYXMgYSBsb25nZXIgbGVuZ3RoLlxuICpcbiAqIEBwYXJhbSBzdHJpbmdcbiAqIEByZXR1cm4ge1VpbnQxNkFycmF5fVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvQnVmZmVyKHN0cmluZykge1xuICBpZiAoc3RyaW5nLmxlbmd0aCA+IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBidWZmZXIgPSBuZXcgVWludDE2QXJyYXkoc3RyaW5nLmxlbmd0aCk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgIGJ1ZmZlcltpXSA9IHN0cmluZy5jb2RlUG9pbnRBdChpKTtcbiAgfVxuXG4gIHJldHVybiBidWZmZXI7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBVaW50MTZBcnJheSB0byBhIFN0cmluZy5cbiAqXG4gKiBAcGFyYW0gYnVmZmVyIC0gQSBVaW50MTZBcnJheSBidWZmZXIgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBidWZmZXJUb1N0cmluZyhidWZmZXIsIG9mZnNldCkge1xuICB2YXIgdG1wQnVmZmVyID0gbmV3IFVpbnQxNkFycmF5KGJ1ZmZlciwgMCwgb2Zmc2V0KTtcbiAgdmFyIHN0cmluZyA9ICcnO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG1wQnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgc3RyaW5nICs9IFN0cmluZy5mcm9tQ29kZVBvaW50KHRtcEJ1ZmZlcltpXSk7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2WW5WbVptVnljeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenRCUVVOQkxFbEJRVWtzVFVGQlRTeEhRVUZITEVsQlFVa3NWMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96czdPenM3T3pzN08wRkJVM3BDTEZOQlFWTXNZMEZCWXl4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOeVF5eE5RVUZKTEUxQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVjc1RVRkJUU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5xUXl4VlFVRk5MRWRCUVVjc1NVRkJTU3hYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGRCUTNwRE96dEJRVVZFTEU5QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRM1JETEZWQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTI1RE96dEJRVVZFTEZOQlFVOHNUVUZCVFN4RFFVRkRPME5CUTJZN096czdPenM3T3p0QlFWRk5MRk5CUVZNc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJTeE5RVUZOTEVWQlFVVTdRVUZETjBNc1RVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeFhRVUZYTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU51UkN4TlFVRkpMRTFCUVUwc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJXaENMRTlCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEzcERMRlZCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zWVVGQllTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRemxET3p0QlFVVkVMRk5CUVU4c1RVRkJUU3hEUVVGRE8wTkJRMllpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2ZFhScGJDOWlkV1ptWlhKekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHk4Z1EzSmxZWFJsSUdFZ1pHVm1ZWFZzZENCaWRXWm1aWElnWVhRZ2JHVnVaM1JvSURFd01qUXVYRzVzWlhRZ1luVm1abVZ5SUQwZ2JtVjNJRlZwYm5ReE5rRnljbUY1S0RBcE8xeHVYRzR2S2lwY2JpQXFJRU52Ym5abGNuUnpJR0VnYzNSeWFXNW5JSFJ2SUdFZ1luVm1abVZ5TGlCQmRIUmxiWEIwY3lCMGJ5QnlaWFZ6WlNCMGFHVWdjSEpsZG1sdmRYTWdZblZtWm1WeUxDQjFibXhsYzNOY2JpQXFJSFJvWlNCdVpYY2dTRlJOVENCb1lYTWdZU0JzYjI1blpYSWdiR1Z1WjNSb0xseHVJQ3BjYmlBcUlFQndZWEpoYlNCemRISnBibWRjYmlBcUlFQnlaWFIxY200Z2UxVnBiblF4TmtGeWNtRjVmVnh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2MzUnlhVzVuVkc5Q2RXWm1aWElvYzNSeWFXNW5LU0I3WEc0Z0lHbG1JQ2h6ZEhKcGJtY3ViR1Z1WjNSb0lENGdZblZtWm1WeUxteGxibWQwYUNrZ2UxeHVJQ0FnSUdKMVptWmxjaUE5SUc1bGR5QlZhVzUwTVRaQmNuSmhlU2h6ZEhKcGJtY3ViR1Z1WjNSb0tUdGNiaUFnZlZ4dVhHNGdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnYzNSeWFXNW5MbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnWW5WbVptVnlXMmxkSUQwZ2MzUnlhVzVuTG1OdlpHVlFiMmx1ZEVGMEtHa3BPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJR0oxWm1abGNqdGNibjFjYmx4dUx5b3FYRzRnS2lCRGIyNTJaWEowY3lCaElGVnBiblF4TmtGeWNtRjVJSFJ2SUdFZ1UzUnlhVzVuTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0JpZFdabVpYSWdMU0JCSUZWcGJuUXhOa0Z5Y21GNUlHSjFabVpsY2lCMGJ5QmpiMjUyWlhKMExseHVJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1luVm1abVZ5Vkc5VGRISnBibWNvWW5WbVptVnlMQ0J2Wm1aelpYUXBJSHRjYmlBZ2JHVjBJSFJ0Y0VKMVptWmxjaUE5SUc1bGR5QlZhVzUwTVRaQmNuSmhlU2hpZFdabVpYSXNJREFzSUc5bVpuTmxkQ2s3WEc0Z0lHeGxkQ0J6ZEhKcGJtY2dQU0FuSnp0Y2JseHVJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhSdGNFSjFabVpsY2k1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lITjBjbWx1WnlBclBTQlRkSEpwYm1jdVpuSnZiVU52WkdWUWIybHVkQ2gwYlhCQ2RXWm1aWEpiYVYwcE8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlITjBjbWx1Wnp0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4vKipcbiAqIERlY29kZSdzIEhUTUwgZW50aXRpZXMuXG4gKlxuICogQHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzA5MTI2NlxuICogQHBhcmFtIHN0cmluZ2luZ1xuICogQHJldHVybiB1bmVzY2FwZWQgZGVjb2RlZCBIVE1MXG4gKi9cbmZ1bmN0aW9uIGRlY29kZUVudGl0aWVzKHN0cmluZykge1xuICBlbGVtZW50LmlubmVySFRNTCA9IHN0cmluZztcbiAgcmV0dXJuIGVsZW1lbnQudGV4dENvbnRlbnQ7XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRlY29kZUVudGl0aWVzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZaR1ZqYjJSbExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzBGQlFVRXNTVUZCU1N4UFFVRlBMRWRCUVVjc1VVRkJVU3hEUVVGRExHRkJRV0VzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN096czdPenM3TzBGQlV6VkRMRk5CUVZNc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU01UWl4VFFVRlBMRU5CUVVNc1UwRkJVeXhIUVVGSExFMUJRVTBzUTBGQlF6dEJRVU16UWl4VFFVRlBMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU03UTBGRE5VSTdPM0ZDUVVWakxHTkJRV01pTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2ZFhScGJDOWtaV052WkdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpzWlhRZ1pXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BPMXh1WEc0dktpcGNiaUFxSUVSbFkyOWtaU2R6SUVoVVRVd2daVzUwYVhScFpYTXVYRzRnS2x4dUlDb2dRSE5sWlNCb2RIUndPaTh2YzNSaFkydHZkbVZ5Wm14dmR5NWpiMjB2WVM4eE16QTVNVEkyTmx4dUlDb2dRSEJoY21GdElITjBjbWx1WjJsdVoxeHVJQ29nUUhKbGRIVnliaUIxYm1WelkyRndaV1FnWkdWamIyUmxaQ0JJVkUxTVhHNGdLaTljYm1aMWJtTjBhVzl1SUdSbFkyOWtaVVZ1ZEdsMGFXVnpLSE4wY21sdVp5a2dlMXh1SUNCbGJHVnRaVzUwTG1sdWJtVnlTRlJOVENBOUlITjBjbWx1Wnp0Y2JpQWdjbVYwZFhKdUlHVnNaVzFsYm5RdWRHVjRkRU52Ym5SbGJuUTdYRzU5WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdSbFkyOWtaVVZ1ZEdsMGFXVnpPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnByb3RlY3RFbGVtZW50ID0gcHJvdGVjdEVsZW1lbnQ7XG5leHBvcnRzLnVucHJvdGVjdEVsZW1lbnQgPSB1bnByb3RlY3RFbGVtZW50O1xuZXhwb3J0cy5jbGVhbk1lbW9yeSA9IGNsZWFuTWVtb3J5O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfdXRpbFBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xuXG52YXIgX25vZGVNYWtlID0gcmVxdWlyZSgnLi4vbm9kZS9tYWtlJyk7XG5cbnZhciBfbm9kZU1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZU1ha2UpO1xuXG52YXIgcG9vbHMgPSBfdXRpbFBvb2xzLnBvb2xzO1xudmFyIG1ha2VOb2RlID0gX25vZGVNYWtlMlsnZGVmYXVsdCddO1xuXG5mdW5jdGlvbiBwcm90ZWN0RWxlbWVudChlbGVtZW50KSB7XG4gIHBvb2xzLmVsZW1lbnRPYmplY3QucHJvdGVjdChlbGVtZW50KTtcblxuICBlbGVtZW50LmNoaWxkTm9kZXMuZm9yRWFjaChwcm90ZWN0RWxlbWVudCk7XG4gIGVsZW1lbnQuYXR0cmlidXRlcy5mb3JFYWNoKHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5wcm90ZWN0LCBwb29scy5hdHRyaWJ1dGVPYmplY3QpO1xufVxuXG5mdW5jdGlvbiB1bnByb3RlY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2godW5wcm90ZWN0RWxlbWVudCk7XG4gIGVsZW1lbnQuYXR0cmlidXRlcy5mb3JFYWNoKHBvb2xzLmF0dHJpYnV0ZU9iamVjdC51bnByb3RlY3QsIHBvb2xzLmF0dHJpYnV0ZU9iamVjdCk7XG5cbiAgcG9vbHMuZWxlbWVudE9iamVjdC51bnByb3RlY3QoZWxlbWVudCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuTWVtb3J5KCkge1xuICAvLyBGcmVlIGFsbCBtZW1vcnkgYWZ0ZXIgZWFjaCBpdGVyYXRpb24uXG4gIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5mcmVlQWxsKCk7XG4gIHBvb2xzLmVsZW1lbnRPYmplY3QuZnJlZUFsbCgpO1xuXG4gIC8vIEVtcHR5IG91dCB0aGUgYG1ha2Uubm9kZXNgIGlmIG9uIG1haW4gdGhyZWFkLlxuICBpZiAodHlwZW9mIG1ha2VOb2RlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGZvciAodmFyIHV1aWQgaW4gbWFrZU5vZGUubm9kZXMpIHtcbiAgICAgIC8vIElmIHRoaXMgaXMgbm90IGEgcHJvdGVjdGVkIHV1aWQsIHJlbW92ZSBpdC5cbiAgICAgIGlmICghcG9vbHMuZWxlbWVudE9iamVjdC5fdXVpZFt1dWlkXSkge1xuICAgICAgICBtYWtlTm9kZS5ub2Rlc1t1dWlkXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmJXVnRiM0o1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN08zbENRVUZuUXl4bFFVRmxPenQzUWtGRGVrSXNZMEZCWXpzN096dEJRVVZ3UXl4SlFVRkpMRXRCUVVzc2JVSkJRVk1zUTBGQlF6dEJRVU51UWl4SlFVRkpMRkZCUVZFc2QwSkJRVmtzUTBGQlF6czdRVUZGYkVJc1UwRkJVeXhqUVVGakxFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEzUkRMRTlCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenRCUVVWeVF5eFRRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU16UXl4VFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRTlCUVU4c1JVRkRkRVFzUzBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRPME5CUXpGQ096dEJRVVZOTEZOQlFWTXNaMEpCUVdkQ0xFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEzaERMRk5CUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVDBGQlR5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03UVVGRE4wTXNVMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4VFFVRlRMRVZCUTNoRUxFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXpzN1FVRkZla0lzVDBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UTBGRGVFTTdPMEZCUlUwc1UwRkJVeXhYUVVGWExFZEJRVWM3TzBGQlJUVkNMRTlCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zVDBGQlR5eEZRVUZGTEVOQlFVTTdRVUZEYUVNc1QwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXpzN08wRkJSemxDTEUxQlFVa3NUMEZCVHl4UlFVRlJMRXRCUVVzc1YwRkJWeXhGUVVGRk8wRkJRMjVETEZOQlFVc3NTVUZCU1N4SlFVRkpMRWxCUVVrc1VVRkJVU3hEUVVGRExFdEJRVXNzUlVGQlJUczdRVUZGTDBJc1ZVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRk8wRkJRM0JETEdkQ1FVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXp0UFFVTnNRenRMUVVOR08wZEJRMFk3UTBGRFJpSXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOTFkR2xzTDIxbGJXOXllUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCN0lIQnZiMnh6SUdGeklGOXdiMjlzY3lCOUlHWnliMjBnSnk0dUwzVjBhV3d2Y0c5dmJITW5PMXh1YVcxd2IzSjBJRjl0WVd0bFRtOWtaU0JtY205dElDY3VMaTl1YjJSbEwyMWhhMlVuTzF4dVhHNXNaWFFnY0c5dmJITWdQU0JmY0c5dmJITTdYRzVzWlhRZ2JXRnJaVTV2WkdVZ1BTQmZiV0ZyWlU1dlpHVTdYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ3Y205MFpXTjBSV3hsYldWdWRDaGxiR1Z0Wlc1MEtTQjdYRzRnSUhCdmIyeHpMbVZzWlcxbGJuUlBZbXBsWTNRdWNISnZkR1ZqZENobGJHVnRaVzUwS1R0Y2JseHVJQ0JsYkdWdFpXNTBMbU5vYVd4a1RtOWtaWE11Wm05eVJXRmphQ2h3Y205MFpXTjBSV3hsYldWdWRDazdYRzRnSUdWc1pXMWxiblF1WVhSMGNtbGlkWFJsY3k1bWIzSkZZV05vS0hCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDNXdjbTkwWldOMExGeHVJQ0FnSUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDazdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCMWJuQnliM1JsWTNSRmJHVnRaVzUwS0dWc1pXMWxiblFwSUh0Y2JpQWdaV3hsYldWdWRDNWphR2xzWkU1dlpHVnpMbVp2Y2tWaFkyZ29kVzV3Y205MFpXTjBSV3hsYldWdWRDazdYRzRnSUdWc1pXMWxiblF1WVhSMGNtbGlkWFJsY3k1bWIzSkZZV05vS0hCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDNTFibkJ5YjNSbFkzUXNYRzRnSUNBZ2NHOXZiSE11WVhSMGNtbGlkWFJsVDJKcVpXTjBLVHRjYmx4dUlDQndiMjlzY3k1bGJHVnRaVzUwVDJKcVpXTjBMblZ1Y0hKdmRHVmpkQ2hsYkdWdFpXNTBLVHRjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHTnNaV0Z1VFdWdGIzSjVLQ2tnZTF4dUlDQXZMeUJHY21WbElHRnNiQ0J0WlcxdmNua2dZV1owWlhJZ1pXRmphQ0JwZEdWeVlYUnBiMjR1WEc0Z0lIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQzVtY21WbFFXeHNLQ2s3WEc0Z0lIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVabkpsWlVGc2JDZ3BPMXh1WEc0Z0lDOHZJRVZ0Y0hSNUlHOTFkQ0IwYUdVZ1lHMWhhMlV1Ym05a1pYTmdJR2xtSUc5dUlHMWhhVzRnZEdoeVpXRmtMbHh1SUNCcFppQW9kSGx3Wlc5bUlHMWhhMlZPYjJSbElDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUdadmNpQW9iR1YwSUhWMWFXUWdhVzRnYldGclpVNXZaR1V1Ym05a1pYTXBJSHRjYmlBZ0lDQWdJQzh2SUVsbUlIUm9hWE1nYVhNZ2JtOTBJR0VnY0hKdmRHVmpkR1ZrSUhWMWFXUXNJSEpsYlc5MlpTQnBkQzVjYmlBZ0lDQWdJR2xtSUNnaGNHOXZiSE11Wld4bGJXVnVkRTlpYW1WamRDNWZkWFZwWkZ0MWRXbGtYU2tnZTF4dUlDQWdJQ0FnSUNCdFlXdGxUbTlrWlM1dWIyUmxjMXQxZFdsa1hTQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JuMWNiaUpkZlE9PSIsIi8vIENvZGUgYmFzZWQgb2ZmIG9mOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FzaGkwMDkvbm9kZS1mYXN0LWh0bWwtcGFyc2VyXG5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnBhcnNlSFRNTCA9IHBhcnNlSFRNTDtcbmV4cG9ydHMubWFrZVBhcnNlciA9IG1ha2VQYXJzZXI7XG5cbnZhciBfcG9vbHMyID0gcmVxdWlyZSgnLi9wb29scycpO1xuXG52YXIgcG9vbHMgPSBfcG9vbHMyLnBvb2xzO1xudmFyIHBhcnNlciA9IG1ha2VQYXJzZXIoKTtcblxuLyoqXG4gKiBwYXJzZUhUTUxcbiAqXG4gKiBAcGFyYW0gbmV3SFRNTFxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSFRNTChuZXdIVE1MLCBpc0lubmVyKSB7XG4gIHZhciBkb2N1bWVudEVsZW1lbnQgPSBwYXJzZXIucGFyc2UobmV3SFRNTCk7XG4gIHZhciBub2RlcyA9IGRvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzO1xuXG4gIHJldHVybiBpc0lubmVyID8gbm9kZXMgOiBub2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gbWFrZVBhcnNlcigpIHtcbiAgdmFyIGtNYXJrdXBQYXR0ZXJuID0gLzwhLS1bXl0qPyg/PS0tPiktLT58PChcXC8/KShbYS16XFwtXVthLXowLTlcXC1dKilcXHMqKFtePl0qPykoXFwvPyk+L2lnO1xuXG4gIHZhciBrQXR0cmlidXRlUGF0dGVybiA9IC9cXGIoaWR8Y2xhc3MpXFxzKj1cXHMqKFwiKFteXCJdKylcInwnKFteJ10rKSd8KFxcUyspKS9pZztcblxuICB2YXIgcmVBdHRyUGF0dGVybiA9IC9cXGIoW2Etel1bYS16MC05XFwtXSopXFxzKj1cXHMqKFwiKFteXCJdKylcInwnKFteJ10rKSd8KFxcUyspKS9pZztcblxuICB2YXIga0Jsb2NrRWxlbWVudHMgPSB7XG4gICAgZGl2OiB0cnVlLFxuICAgIHA6IHRydWUsXG4gICAgbGk6IHRydWUsXG4gICAgdGQ6IHRydWUsXG4gICAgc2VjdGlvbjogdHJ1ZSxcbiAgICBicjogdHJ1ZVxuICB9O1xuXG4gIHZhciBrU2VsZkNsb3NpbmdFbGVtZW50cyA9IHtcbiAgICBtZXRhOiB0cnVlLFxuICAgIGltZzogdHJ1ZSxcbiAgICBsaW5rOiB0cnVlLFxuICAgIGlucHV0OiB0cnVlLFxuICAgIGFyZWE6IHRydWUsXG4gICAgYnI6IHRydWUsXG4gICAgaHI6IHRydWVcbiAgfTtcblxuICB2YXIga0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nID0ge1xuICAgIGxpOiB7XG4gICAgICBsaTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwOiB7XG4gICAgICBwOiB0cnVlLCBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgdGQ6IHtcbiAgICAgIHRkOiB0cnVlLCB0aDogdHJ1ZVxuICAgIH0sXG5cbiAgICB0aDoge1xuICAgICAgdGQ6IHRydWUsIHRoOiB0cnVlXG4gICAgfVxuICB9O1xuXG4gIHZhciBrRWxlbWVudHNDbG9zZWRCeUNsb3NpbmcgPSB7XG4gICAgbGk6IHtcbiAgICAgIHVsOiB0cnVlLCBvbDogdHJ1ZVxuICAgIH0sXG5cbiAgICBhOiB7XG4gICAgICBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgYjoge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIGk6IHtcbiAgICAgIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICBwOiB7XG4gICAgICBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgdGQ6IHtcbiAgICAgIHRyOiB0cnVlLCB0YWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICB0aDoge1xuICAgICAgdHI6IHRydWUsIHRhYmxlOiB0cnVlXG4gICAgfVxuICB9O1xuXG4gIHZhciBrQmxvY2tUZXh0RWxlbWVudHMgPSB7XG4gICAgc2NyaXB0OiB0cnVlLFxuICAgIG5vc2NyaXB0OiB0cnVlLFxuICAgIHN0eWxlOiB0cnVlLFxuICAgIHByZTogdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBUZXh0Tm9kZSB0byBjb250YWluIGEgdGV4dCBlbGVtZW50IGluIERPTSB0cmVlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZnVuY3Rpb24gVGV4dE5vZGUodmFsdWUpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBwb29scy5lbGVtZW50T2JqZWN0LmdldCgpO1xuXG4gICAgaW5zdGFuY2Uubm9kZU5hbWUgPSAnI3RleHQnO1xuICAgIGluc3RhbmNlLm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgIGluc3RhbmNlLm5vZGVUeXBlID0gMztcbiAgICBpbnN0YW5jZS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gICAgaW5zdGFuY2UuYXR0cmlidXRlcy5sZW5ndGggPSAwO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEhUTUxFbGVtZW50LCB3aGljaCBjb250YWlucyBhIHNldCBvZiBjaGlsZHJlbi5cbiAgICpcbiAgICogTm90ZTogdGhpcyBpcyBhIG1pbmltYWxpc3QgaW1wbGVtZW50YXRpb24sIG5vIGNvbXBsZXRlIHRyZWUgc3RydWN0dXJlXG4gICAqIHByb3ZpZGVkIChubyBwYXJlbnROb2RlLCBuZXh0U2libGluZywgcHJldmlvdXNTaWJsaW5nIGV0YykuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICAgICBub2RlTmFtZVxuICAgKiBAcGFyYW0ge09iamVjdH0ga2V5QXR0cnMgaWQgYW5kIGNsYXNzIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gcmF3QXR0cnMgYXR0cmlidXRlcyBpbiBzdHJpbmdcbiAgICovXG4gIGZ1bmN0aW9uIEhUTUxFbGVtZW50KG5hbWUsIGtleUF0dHJzLCByYXdBdHRycykge1xuICAgIHZhciBpbnN0YW5jZSA9IHBvb2xzLmVsZW1lbnRPYmplY3QuZ2V0KCk7XG5cbiAgICBpbnN0YW5jZS5ub2RlTmFtZSA9IG5hbWU7XG4gICAgaW5zdGFuY2Uubm9kZVZhbHVlID0gJyc7XG4gICAgaW5zdGFuY2Uubm9kZVR5cGUgPSAxO1xuICAgIGluc3RhbmNlLmNoaWxkTm9kZXMubGVuZ3RoID0gMDtcbiAgICBpbnN0YW5jZS5hdHRyaWJ1dGVzLmxlbmd0aCA9IDA7XG5cbiAgICBpZiAocmF3QXR0cnMpIHtcbiAgICAgIGZvciAodmFyIG1hdGNoID0gdW5kZWZpbmVkOyBtYXRjaCA9IHJlQXR0clBhdHRlcm4uZXhlYyhyYXdBdHRycyk7KSB7XG4gICAgICAgIHZhciBhdHRyID0gcG9vbHMuYXR0cmlidXRlT2JqZWN0LmdldCgpO1xuXG4gICAgICAgIGF0dHIubmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICBhdHRyLnZhbHVlID0gbWF0Y2hbM10gfHwgbWF0Y2hbNF0gfHwgbWF0Y2hbNV07XG5cbiAgICAgICAgaW5zdGFuY2UuYXR0cmlidXRlc1tpbnN0YW5jZS5hdHRyaWJ1dGVzLmxlbmd0aF0gPSBhdHRyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgSFRNTCBhbmQgcmV0dXJucyBhIHJvb3QgZWxlbWVudFxuICAgKi9cbiAgdmFyIGh0bWxQYXJzZXIgPSB7XG4gICAgLyoqXG4gICAgICogUGFyc2UgYSBjaHVjayBvZiBIVE1MIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgICAgICBodG1sXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgcm9vdCBlbGVtZW50XG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByb290T2JqZWN0ID0ge307XG4gICAgICB2YXIgcm9vdCA9IEhUTUxFbGVtZW50KG51bGwsIHJvb3RPYmplY3QpO1xuICAgICAgdmFyIGN1cnJlbnRQYXJlbnQgPSByb290O1xuICAgICAgdmFyIHN0YWNrID0gW3Jvb3RdO1xuICAgICAgdmFyIGxhc3RUZXh0UG9zID0gLTE7XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAoZGF0YS5pbmRleE9mKCc8JykgPT09IC0xICYmIGRhdGEpIHtcbiAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzW2N1cnJlbnRQYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGhdID0gVGV4dE5vZGUoZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIG1hdGNoID0gdW5kZWZpbmVkLCB0ZXh0ID0gdW5kZWZpbmVkOyBtYXRjaCA9IGtNYXJrdXBQYXR0ZXJuLmV4ZWMoZGF0YSk7KSB7XG4gICAgICAgIGlmIChsYXN0VGV4dFBvcyA+IC0xKSB7XG4gICAgICAgICAgaWYgKGxhc3RUZXh0UG9zICsgbWF0Y2hbMF0ubGVuZ3RoIDwga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAvLyBpZiBoYXMgY29udGVudFxuICAgICAgICAgICAgdGV4dCA9IGRhdGEuc2xpY2UobGFzdFRleHRQb3MsIGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCAtIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGlmICh0ZXh0LnRyaW0oKSkge1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkTm9kZXNbY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aF0gPSBUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0VGV4dFBvcyA9IGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleDtcblxuICAgICAgICAvLyBUaGlzIGlzIGEgY29tbWVudC5cbiAgICAgICAgaWYgKG1hdGNoWzBdWzFdID09PSAnIScpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmxvd2VyQ2FzZVRhZ05hbWUpIHtcbiAgICAgICAgICBtYXRjaFsyXSA9IG1hdGNoWzJdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1hdGNoWzFdKSB7XG4gICAgICAgICAgLy8gbm90IDwvIHRhZ3NcbiAgICAgICAgICB2YXIgYXR0cnMgPSB7fTtcblxuICAgICAgICAgIGZvciAodmFyIGF0dE1hdGNoID0gdW5kZWZpbmVkOyBhdHRNYXRjaCA9IGtBdHRyaWJ1dGVQYXR0ZXJuLmV4ZWMobWF0Y2hbM10pOykge1xuICAgICAgICAgICAgYXR0cnNbYXR0TWF0Y2hbMV1dID0gYXR0TWF0Y2hbM10gfHwgYXR0TWF0Y2hbNF0gfHwgYXR0TWF0Y2hbNV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFtYXRjaFs0XSAmJiBrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV1bbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMucHVzaChIVE1MRWxlbWVudChtYXRjaFsyXSwgYXR0cnMsIG1hdGNoWzNdKSkgLSAxXTtcblxuICAgICAgICAgIHN0YWNrLnB1c2goY3VycmVudFBhcmVudCk7XG5cbiAgICAgICAgICBpZiAoa0Jsb2NrVGV4dEVsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgLy8gYSBsaXR0bGUgdGVzdCB0byBmaW5kIG5leHQgPC9zY3JpcHQ+IG9yIDwvc3R5bGU+IC4uLlxuICAgICAgICAgICAgdmFyIGNsb3NlTWFya3VwID0gJzwvJyArIG1hdGNoWzJdICsgJz4nO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gZGF0YS5pbmRleE9mKGNsb3NlTWFya3VwLCBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9uc1ttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlcmUgaXMgbm8gbWF0Y2hpbmcgZW5kaW5nIGZvciB0aGUgdGV4dCBlbGVtZW50LlxuICAgICAgICAgICAgICAgIHRleHQgPSBkYXRhLnNsaWNlKGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGRhdGEuc2xpY2Uoa01hcmt1cFBhdHRlcm4ubGFzdEluZGV4LCBpbmRleCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzW2N1cnJlbnRQYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGhdID0gVGV4dE5vZGUodGV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICBsYXN0VGV4dFBvcyA9IGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCA9IGRhdGEubGVuZ3RoICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4ID0gaW5kZXggKyBjbG9zZU1hcmt1cC5sZW5ndGg7XG4gICAgICAgICAgICAgIG1hdGNoWzFdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzFdIHx8IG1hdGNoWzRdIHx8IGtTZWxmQ2xvc2luZ0VsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgIC8vIDwvIG9yIC8+IG9yIDxicj4gZXRjLlxuICAgICAgICAgIHdoaWxlICh0cnVlICYmIGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFyZW50Lm5vZGVOYW1lID09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBUcnlpbmcgdG8gY2xvc2UgY3VycmVudCB0YWcsIGFuZCBtb3ZlIG9uXG4gICAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeUNsb3NpbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFVzZSBhZ2dyZXNzaXZlIHN0cmF0ZWd5IHRvIGhhbmRsZSB1bm1hdGNoaW5nIG1hcmt1cHMuXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGh0bWxQYXJzZXI7XG59XG5cbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmNHRnljMlZ5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN08zTkNRVWRuUXl4VFFVRlRPenRCUVVWNlF5eEpRVUZKTEV0QlFVc3NaMEpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEUxQlFVMHNSMEZCUnl4VlFVRlZMRVZCUVVVc1EwRkJRenM3T3pzN096czdPMEZCVVc1Q0xGTkJRVk1zVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRNVU1zVFVGQlNTeGxRVUZsTEVkQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU0xUXl4TlFVRkpMRXRCUVVzc1IwRkJSeXhsUVVGbExFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVjJReXhUUVVGUExFOUJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wTkJRMjVET3p0QlFVVk5MRk5CUVZNc1ZVRkJWU3hIUVVGSE8wRkJRek5DTEUxQlFVa3NZMEZCWXl4SFFVTm9RaXh0UlVGQmJVVXNRMEZCUXpzN1FVRkZkRVVzVFVGQlNTeHBRa0ZCYVVJc1IwRkJSeXhyUkVGQmEwUXNRMEZCUXpzN1FVRkZNMFVzVFVGQlNTeGhRVUZoTEVkQlEyWXNNRVJCUVRCRUxFTkJRVU03TzBGQlJUZEVMRTFCUVVrc1kwRkJZeXhIUVVGSE8wRkJRMjVDTEU5QlFVY3NSVUZCUlN4SlFVRkpPMEZCUTFRc1MwRkJReXhGUVVGRkxFbEJRVWs3UVVGRFVDeE5RVUZGTEVWQlFVVXNTVUZCU1R0QlFVTlNMRTFCUVVVc1JVRkJSU3hKUVVGSk8wRkJRMUlzVjBGQlR5eEZRVUZGTEVsQlFVazdRVUZEWWl4TlFVRkZMRVZCUVVVc1NVRkJTVHRIUVVOVUxFTkJRVU03TzBGQlJVWXNUVUZCU1N4dlFrRkJiMElzUjBGQlJ6dEJRVU42UWl4UlFVRkpMRVZCUVVVc1NVRkJTVHRCUVVOV0xFOUJRVWNzUlVGQlJTeEpRVUZKTzBGQlExUXNVVUZCU1N4RlFVRkZMRWxCUVVrN1FVRkRWaXhUUVVGTExFVkJRVVVzU1VGQlNUdEJRVU5ZTEZGQlFVa3NSVUZCUlN4SlFVRkpPMEZCUTFZc1RVRkJSU3hGUVVGRkxFbEJRVWs3UVVGRFVpeE5RVUZGTEVWQlFVVXNTVUZCU1R0SFFVTlVMRU5CUVVNN08wRkJSVVlzVFVGQlNTeDNRa0ZCZDBJc1IwRkJSenRCUVVNM1FpeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTVHRMUVVOVU96dEJRVVZFTEV0QlFVTXNSVUZCUlR0QlFVTkVMRTlCUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEVsQlFVazdTMEZEYmtJN08wRkJSVVFzVFVGQlJTeEZRVUZGTzBGQlEwWXNVVUZCUlN4RlFVRkZMRWxCUVVrc1JVRkJSU3hGUVVGRkxFVkJRVVVzU1VGQlNUdExRVU51UWpzN1FVRkZSQ3hOUVVGRkxFVkJRVVU3UVVGRFJpeFJRVUZGTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVc1JVRkJSU3hKUVVGSk8wdEJRMjVDTzBkQlEwWXNRMEZCUXpzN1FVRkZSaXhOUVVGSkxIZENRVUYzUWl4SFFVRkhPMEZCUXpkQ0xFMUJRVVVzUlVGQlJUdEJRVU5HTEZGQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1JVRkJSU3hGUVVGRkxFbEJRVWs3UzBGRGJrSTdPMEZCUlVRc1MwRkJReXhGUVVGRk8wRkJRMFFzVTBGQlJ5eEZRVUZGTEVsQlFVazdTMEZEVmpzN1FVRkZSQ3hMUVVGRExFVkJRVVU3UVVGRFJDeFRRVUZITEVWQlFVVXNTVUZCU1R0TFFVTldPenRCUVVWRUxFdEJRVU1zUlVGQlJUdEJRVU5FTEZOQlFVY3NSVUZCUlN4SlFVRkpPMHRCUTFZN08wRkJSVVFzUzBGQlF5eEZRVUZGTzBGQlEwUXNVMEZCUnl4RlFVRkZMRWxCUVVrN1MwRkRWanM3UVVGRlJDeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEpRVUZKTzB0QlEzUkNPenRCUVVWRUxFMUJRVVVzUlVGQlJUdEJRVU5HTEZGQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1MwRkJTeXhGUVVGRkxFbEJRVWs3UzBGRGRFSTdSMEZEUml4RFFVRkRPenRCUVVWR0xFMUJRVWtzYTBKQlFXdENMRWRCUVVjN1FVRkRka0lzVlVGQlRTeEZRVUZGTEVsQlFVazdRVUZEV2l4WlFVRlJMRVZCUVVVc1NVRkJTVHRCUVVOa0xGTkJRVXNzUlVGQlJTeEpRVUZKTzBGQlExZ3NUMEZCUnl4RlFVRkZMRWxCUVVrN1IwRkRWaXhEUVVGRE96czdPenM3UVVGTlJpeFhRVUZUTEZGQlFWRXNRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRka0lzVVVGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMR0ZCUVdFc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6czdRVUZGZWtNc1dVRkJVU3hEUVVGRExGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTTdRVUZETlVJc1dVRkJVU3hEUVVGRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZETTBJc1dVRkJVU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEZEVJc1dVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXk5Q0xGbEJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenM3UVVGRkwwSXNWMEZCVHl4UlFVRlJMRU5CUVVNN1IwRkRha0k3T3pzN096czdPenM3T3p0QlFWbEVMRmRCUVZNc1YwRkJWeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUXpkRExGRkJRVWtzVVVGQlVTeEhRVUZITEV0QlFVc3NRMEZCUXl4aFFVRmhMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYcERMRmxCUVZFc1EwRkJReXhSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzcENMRmxCUVZFc1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzaENMRmxCUVZFc1EwRkJReXhSUVVGUkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzUkNMRmxCUVZFc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhaUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSUzlDTEZGQlFVa3NVVUZCVVN4RlFVRkZPMEZCUTFvc1YwRkJTeXhKUVVGSkxFdEJRVXNzV1VGQlFTeEZRVUZGTEV0QlFVc3NSMEZCUnl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZKTzBGQlEzUkVMRmxCUVVrc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNN08wRkJSWFpETEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkNMRmxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGxETEdkQ1FVRlJMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wOUJRM2hFTzB0QlEwWTdPMEZCUlVRc1YwRkJUeXhSUVVGUkxFTkJRVU03UjBGRGFrSTdPenM3TzBGQlMwUXNUVUZCU1N4VlFVRlZMRWRCUVVjN096czdPenRCUVUxbUxGTkJRVXNzUlVGQlJTeGxRVUZUTEVsQlFVa3NSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkROMElzVlVGQlNTeFZRVUZWTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNCQ0xGVkJRVWtzU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGVrTXNWVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM3BDTEZWQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGJrSXNWVUZCU1N4WFFVRlhMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYSkNMR0ZCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZET3p0QlFVVjRRaXhWUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzU1VGQlNTeEZRVUZGTzBGQlEzQkRMSEZDUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVVelJTeGxRVUZQTEVsQlFVa3NRMEZCUXp0UFFVTmlPenRCUVVWRUxGZEJRVXNzU1VGQlNTeExRVUZMTEZsQlFVRXNSVUZCUlN4SlFVRkpMRmxCUVVFc1JVRkJSU3hMUVVGTExFZEJRVWNzWTBGQll5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJTVHRCUVVONlJDeFpRVUZKTEZkQlFWY3NSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVOd1FpeGpRVUZKTEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEdOQlFXTXNRMEZCUXl4VFFVRlRMRVZCUVVVN08wRkJSVFZFTEdkQ1FVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVWQlFVVXNZMEZCWXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN08wRkJSVE5GTEdkQ1FVRkpMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJUdEJRVU5tTERKQ1FVRmhMRU5CUVVNc1ZVRkJWU3hEUVVGRExHRkJRV0VzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJGQlF6VkZPMWRCUTBZN1UwRkRSanM3UVVGRlJDeHRRa0ZCVnl4SFFVRkhMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU03T3p0QlFVZDJReXhaUVVGSkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhIUVVGSExFVkJRVVU3UVVGRGRrSXNiVUpCUVZNN1UwRkRWanM3UVVGRlJDeFpRVUZKTEU5QlFVOHNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU0xUWl4bFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8xTkJRMjVET3p0QlFVVkVMRmxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdPMEZCUldJc1kwRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZET3p0QlFVVm1MR1ZCUVVzc1NVRkJTU3hSUVVGUkxGbEJRVUVzUlVGQlJTeFJRVUZSTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSk8wRkJRMmhGTEdsQ1FVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VjBGRGFFVTdPMEZCUlVRc1kwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4M1FrRkJkMElzUTBGQlF5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVN1FVRkRha1VzWjBKQlFVa3NkMEpCUVhkQ0xFTkJRVU1zWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlF6bEVMRzFDUVVGTExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEV2l3eVFrRkJZU3hIUVVGSExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRM3BETzFkQlEwWTdPMEZCUlVRc2RVSkJRV0VzUjBGQlJ5eGhRVUZoTEVOQlFVTXNWVUZCVlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVU5zUlN4WFFVRlhMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWcVJDeGxRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4alFVRkpMR3RDUVVGclFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk96dEJRVVZvUXl4blFrRkJTU3hYUVVGWExFZEJRVWNzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU03UVVGRGVFTXNaMEpCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RlFVRkZMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6czdRVUZGYUVVc1owSkJRVWtzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRM0pDTEd0Q1FVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExFTkJRVU1zUlVGQlJUczdRVUZGWml4dlFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8yVkJRemRETEUxQlEwazdRVUZEU0N4dlFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dGxRVU53UkRzN1FVRkZSQ3hyUWtGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOdVFpdzJRa0ZCWVN4RFFVRkRMRlZCUVZVc1EwRkJReXhoUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dGxRVU0xUlR0aFFVTkdPMEZCUTBRc1owSkJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTJZc2VVSkJRVmNzUjBGQlJ5eGpRVUZqTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzJGQlF6RkVMRTFCUTBrN1FVRkRTQ3g1UWtGQlZ5eEhRVUZITEdOQlFXTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1MwRkJTeXhIUVVGSExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTTdRVUZEY0VVc2JVSkJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1lVRkRha0k3VjBGRFJqdFRRVU5HTzBGQlEwUXNXVUZCU1N4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRzlDUVVGdlFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk96dEJRVVV4UkN4cFFrRkJUeXhKUVVGSkxFbEJRVWtzWVVGQllTeEZRVUZGTzBGQlF6VkNMR2RDUVVGSkxHRkJRV0VzUTBGQlF5eFJRVUZSTEVsQlFVa3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRM1JETEcxQ1FVRkxMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRFdpd3lRa0ZCWVN4SFFVRkhMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWNFF5eHZRa0ZCVFR0aFFVTlFMRTFCUTBrN08wRkJSVWdzYTBKQlFVa3NkMEpCUVhkQ0xFTkJRVU1zWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkZPMEZCUTNCRUxHOUNRVUZKTEhkQ1FVRjNRaXhEUVVGRExHRkJRV0VzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUdEJRVU01UkN4MVFrRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlExb3NLMEpCUVdFc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmVFTXNNa0pCUVZNN2FVSkJRMVk3WlVGRFJqczdPMEZCUjBRc2IwSkJRVTA3WVVGRFVEdFhRVU5HTzFOQlEwWTdUMEZEUmpzN1FVRkZSQ3hoUVVGUExFbEJRVWtzUTBGQlF6dExRVU5pTzBkQlEwWXNRMEZCUXpzN1FVRkZSaXhUUVVGUExGVkJRVlVzUTBGQlF6dERRVU51UWpzN1FVRkJRU3hEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2Y0dGeWMyVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5OGdRMjlrWlNCaVlYTmxaQ0J2Wm1ZZ2IyWTZYRzR2THlCb2RIUndjem92TDJkcGRHaDFZaTVqYjIwdllYTm9hVEF3T1M5dWIyUmxMV1poYzNRdGFIUnRiQzF3WVhKelpYSmNibHh1YVcxd2IzSjBJSHNnY0c5dmJITWdZWE1nWDNCdmIyeHpJSDBnWm5KdmJTQW5MaTl3YjI5c2N5YzdYRzVjYm14bGRDQndiMjlzY3lBOUlGOXdiMjlzY3p0Y2JteGxkQ0J3WVhKelpYSWdQU0J0WVd0bFVHRnljMlZ5S0NrN1hHNWNiaThxS2x4dUlDb2djR0Z5YzJWSVZFMU1YRzRnS2x4dUlDb2dRSEJoY21GdElHNWxkMGhVVFV4Y2JpQXFJRUJ5WlhSMWNtNWNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhCaGNuTmxTRlJOVENodVpYZElWRTFNTENCcGMwbHVibVZ5S1NCN1hHNGdJR3hsZENCa2IyTjFiV1Z1ZEVWc1pXMWxiblFnUFNCd1lYSnpaWEl1Y0dGeWMyVW9ibVYzU0ZSTlRDazdYRzRnSUd4bGRDQnViMlJsY3lBOUlHUnZZM1Z0Wlc1MFJXeGxiV1Z1ZEM1amFHbHNaRTV2WkdWek8xeHVYRzRnSUhKbGRIVnliaUJwYzBsdWJtVnlJRDhnYm05a1pYTWdPaUJ1YjJSbGMxc3dYVHRjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHMWhhMlZRWVhKelpYSW9LU0I3WEc0Z0lHeGxkQ0JyVFdGeWEzVndVR0YwZEdWeWJpQTlYRzRnSUNBZ0x6d2hMUzFiWGwwcVB5Zy9QUzB0UGlrdExUNThQQ2hjWEM4L0tTaGJZUzE2WEZ3dFhWdGhMWG93TFRsY1hDMWRLaWxjWEhNcUtGdGVQbDBxUHlrb1hGd3ZQeWsrTDJsbk8xeHVYRzRnSUd4bGRDQnJRWFIwY21saWRYUmxVR0YwZEdWeWJpQTlJQzljWEdJb2FXUjhZMnhoYzNNcFhGeHpLajFjWEhNcUtGd2lLRnRlWENKZEt5bGNJbnduS0Z0ZUoxMHJLU2Q4S0Z4Y1V5c3BLUzlwWnp0Y2JseHVJQ0JzWlhRZ2NtVkJkSFJ5VUdGMGRHVnliaUE5WEc0Z0lDQWdMMXhjWWloYllTMTZYVnRoTFhvd0xUbGNYQzFkS2lsY1hITXFQVnhjY3lvb1hDSW9XMTVjSWwwcktWd2lmQ2NvVzE0blhTc3BKM3dvWEZ4VEt5a3BMMmxuTzF4dVhHNGdJR3hsZENCclFteHZZMnRGYkdWdFpXNTBjeUE5SUh0Y2JpQWdJQ0JrYVhZNklIUnlkV1VzWEc0Z0lDQWdjRG9nZEhKMVpTeGNiaUFnSUNCc2FUb2dkSEoxWlN4Y2JpQWdJQ0IwWkRvZ2RISjFaU3hjYmlBZ0lDQnpaV04wYVc5dU9pQjBjblZsTEZ4dUlDQWdJR0p5T2lCMGNuVmxYRzRnSUgwN1hHNWNiaUFnYkdWMElHdFRaV3htUTJ4dmMybHVaMFZzWlcxbGJuUnpJRDBnZTF4dUlDQWdJRzFsZEdFNklIUnlkV1VzWEc0Z0lDQWdhVzFuT2lCMGNuVmxMRnh1SUNBZ0lHeHBibXM2SUhSeWRXVXNYRzRnSUNBZ2FXNXdkWFE2SUhSeWRXVXNYRzRnSUNBZ1lYSmxZVG9nZEhKMVpTeGNiaUFnSUNCaWNqb2dkSEoxWlN4Y2JpQWdJQ0JvY2pvZ2RISjFaVnh1SUNCOU8xeHVYRzRnSUd4bGRDQnJSV3hsYldWdWRITkRiRzl6WldSQ2VVOXdaVzVwYm1jZ1BTQjdYRzRnSUNBZ2JHazZJSHRjYmlBZ0lDQWdJR3hwT2lCMGNuVmxYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lIQTZJSHRjYmlBZ0lDQWdJSEE2SUhSeWRXVXNJR1JwZGpvZ2RISjFaVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQjBaRG9nZTF4dUlDQWdJQ0FnZEdRNklIUnlkV1VzSUhSb09pQjBjblZsWEc0Z0lDQWdmU3hjYmx4dUlDQWdJSFJvT2lCN1hHNGdJQ0FnSUNCMFpEb2dkSEoxWlN3Z2RHZzZJSFJ5ZFdWY2JpQWdJQ0I5WEc0Z0lIMDdYRzVjYmlBZ2JHVjBJR3RGYkdWdFpXNTBjME5zYjNObFpFSjVRMnh2YzJsdVp5QTlJSHRjYmlBZ0lDQnNhVG9nZTF4dUlDQWdJQ0FnZFd3NklIUnlkV1VzSUc5c09pQjBjblZsWEc0Z0lDQWdmU3hjYmx4dUlDQWdJR0U2SUh0Y2JpQWdJQ0FnSUdScGRqb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0JpT2lCN1hHNGdJQ0FnSUNCa2FYWTZJSFJ5ZFdWY2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnYVRvZ2UxeHVJQ0FnSUNBZ1pHbDJPaUIwY25WbFhHNGdJQ0FnZlN4Y2JseHVJQ0FnSUhBNklIdGNiaUFnSUNBZ0lHUnBkam9nZEhKMVpWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCMFpEb2dlMXh1SUNBZ0lDQWdkSEk2SUhSeWRXVXNJSFJoWW14bE9pQjBjblZsWEc0Z0lDQWdmU3hjYmx4dUlDQWdJSFJvT2lCN1hHNGdJQ0FnSUNCMGNqb2dkSEoxWlN3Z2RHRmliR1U2SUhSeWRXVmNiaUFnSUNCOVhHNGdJSDA3WEc1Y2JpQWdiR1YwSUd0Q2JHOWphMVJsZUhSRmJHVnRaVzUwY3lBOUlIdGNiaUFnSUNCelkzSnBjSFE2SUhSeWRXVXNYRzRnSUNBZ2JtOXpZM0pwY0hRNklIUnlkV1VzWEc0Z0lDQWdjM1I1YkdVNklIUnlkV1VzWEc0Z0lDQWdjSEpsT2lCMGNuVmxYRzRnSUgwN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUZSbGVIUk9iMlJsSUhSdklHTnZiblJoYVc0Z1lTQjBaWGgwSUdWc1pXMWxiblFnYVc0Z1JFOU5JSFJ5WldVdVhHNGdJQ0FxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IyWVd4MVpTQmJaR1Z6WTNKcGNIUnBiMjVkWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCVVpYaDBUbTlrWlNoMllXeDFaU2tnZTF4dUlDQWdJR3hsZENCcGJuTjBZVzVqWlNBOUlIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVaMlYwS0NrN1hHNWNiaUFnSUNCcGJuTjBZVzVqWlM1dWIyUmxUbUZ0WlNBOUlDY2pkR1Y0ZENjN1hHNGdJQ0FnYVc1emRHRnVZMlV1Ym05a1pWWmhiSFZsSUQwZ2RtRnNkV1U3WEc0Z0lDQWdhVzV6ZEdGdVkyVXVibTlrWlZSNWNHVWdQU0F6TzF4dUlDQWdJR2x1YzNSaGJtTmxMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0JwYm5OMFlXNWpaUzVoZEhSeWFXSjFkR1Z6TG14bGJtZDBhQ0E5SURBN1hHNWNiaUFnSUNCeVpYUjFjbTRnYVc1emRHRnVZMlU3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1NGUk5URVZzWlcxbGJuUXNJSGRvYVdOb0lHTnZiblJoYVc1eklHRWdjMlYwSUc5bUlHTm9hV3hrY21WdUxseHVJQ0FnS2x4dUlDQWdLaUJPYjNSbE9pQjBhR2x6SUdseklHRWdiV2x1YVcxaGJHbHpkQ0JwYlhCc1pXMWxiblJoZEdsdmJpd2dibThnWTI5dGNHeGxkR1VnZEhKbFpTQnpkSEoxWTNSMWNtVmNiaUFnSUNvZ2NISnZkbWxrWldRZ0tHNXZJSEJoY21WdWRFNXZaR1VzSUc1bGVIUlRhV0pzYVc1bkxDQndjbVYyYVc5MWMxTnBZbXhwYm1jZ1pYUmpLUzVjYmlBZ0lDcGNiaUFnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUc1aGJXVWdJQ0FnSUc1dlpHVk9ZVzFsWEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQnJaWGxCZEhSeWN5QnBaQ0JoYm1RZ1kyeGhjM01nWVhSMGNtbGlkWFJsWEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQnlZWGRCZEhSeWN5QmhkSFJ5YVdKMWRHVnpJR2x1SUhOMGNtbHVaMXh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnU0ZSTlRFVnNaVzFsYm5Rb2JtRnRaU3dnYTJWNVFYUjBjbk1zSUhKaGQwRjBkSEp6S1NCN1hHNGdJQ0FnYkdWMElHbHVjM1JoYm1ObElEMGdjRzl2YkhNdVpXeGxiV1Z1ZEU5aWFtVmpkQzVuWlhRb0tUdGNibHh1SUNBZ0lHbHVjM1JoYm1ObExtNXZaR1ZPWVcxbElEMGdibUZ0WlR0Y2JpQWdJQ0JwYm5OMFlXNWpaUzV1YjJSbFZtRnNkV1VnUFNBbkp6dGNiaUFnSUNCcGJuTjBZVzVqWlM1dWIyUmxWSGx3WlNBOUlERTdYRzRnSUNBZ2FXNXpkR0Z1WTJVdVkyaHBiR1JPYjJSbGN5NXNaVzVuZEdnZ1BTQXdPMXh1SUNBZ0lHbHVjM1JoYm1ObExtRjBkSEpwWW5WMFpYTXViR1Z1WjNSb0lEMGdNRHRjYmx4dUlDQWdJR2xtSUNoeVlYZEJkSFJ5Y3lrZ2UxeHVJQ0FnSUNBZ1ptOXlJQ2hzWlhRZ2JXRjBZMmc3SUcxaGRHTm9JRDBnY21WQmRIUnlVR0YwZEdWeWJpNWxlR1ZqS0hKaGQwRjBkSEp6S1RzZ0tTQjdYRzRnSUNBZ0lDQWdJR3hsZENCaGRIUnlJRDBnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExtZGxkQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lHRjBkSEl1Ym1GdFpTQTlJRzFoZEdOb1d6RmRPMXh1SUNBZ0lDQWdJQ0JoZEhSeUxuWmhiSFZsSUQwZ2JXRjBZMmhiTTEwZ2ZId2diV0YwWTJoYk5GMGdmSHdnYldGMFkyaGJOVjA3WEc1Y2JpQWdJQ0FnSUNBZ2FXNXpkR0Z1WTJVdVlYUjBjbWxpZFhSbGMxdHBibk4wWVc1alpTNWhkSFJ5YVdKMWRHVnpMbXhsYm1kMGFGMGdQU0JoZEhSeU8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUJwYm5OMFlXNWpaVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCUVlYSnpaWE1nU0ZSTlRDQmhibVFnY21WMGRYSnVjeUJoSUhKdmIzUWdaV3hsYldWdWRGeHVJQ0FnS2k5Y2JpQWdiR1YwSUdoMGJXeFFZWEp6WlhJZ1BTQjdYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dVR0Z5YzJVZ1lTQmphSFZqYXlCdlppQklWRTFNSUhOdmRYSmpaUzVjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHR6ZEhKcGJtZDlJR1JoZEdFZ0lDQWdJQ0JvZEcxc1hHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1NGUk5URVZzWlcxbGJuUjlJQ0FnSUNBZ2NtOXZkQ0JsYkdWdFpXNTBYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2NHRnljMlU2SUdaMWJtTjBhVzl1S0dSaGRHRXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJR3hsZENCeWIyOTBUMkpxWldOMElEMGdlMzA3WEc0Z0lDQWdJQ0JzWlhRZ2NtOXZkQ0E5SUVoVVRVeEZiR1Z0Wlc1MEtHNTFiR3dzSUhKdmIzUlBZbXBsWTNRcE8xeHVJQ0FnSUNBZ2JHVjBJR04xY25KbGJuUlFZWEpsYm5RZ1BTQnliMjkwTzF4dUlDQWdJQ0FnYkdWMElITjBZV05ySUQwZ1czSnZiM1JkTzF4dUlDQWdJQ0FnYkdWMElHeGhjM1JVWlhoMFVHOXpJRDBnTFRFN1hHNWNiaUFnSUNBZ0lHOXdkR2x2Ym5NZ1BTQnZjSFJwYjI1eklIeDhJSHQ5TzF4dVhHNGdJQ0FnSUNCcFppQW9aR0YwWVM1cGJtUmxlRTltS0NjOEp5a2dQVDA5SUMweElDWW1JR1JoZEdFcElIdGNiaUFnSUNBZ0lDQWdZM1Z5Y21WdWRGQmhjbVZ1ZEM1amFHbHNaRTV2WkdWelcyTjFjbkpsYm5SUVlYSmxiblF1WTJocGJHUk9iMlJsY3k1c1pXNW5kR2hkSUQwZ1ZHVjRkRTV2WkdVb1pHRjBZU2s3WEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhKdmIzUTdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR1p2Y2lBb2JHVjBJRzFoZEdOb0xDQjBaWGgwT3lCdFlYUmphQ0E5SUd0TllYSnJkWEJRWVhSMFpYSnVMbVY0WldNb1pHRjBZU2s3SUNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvYkdGemRGUmxlSFJRYjNNZ1BpQXRNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hzWVhOMFZHVjRkRkJ2Y3lBcklHMWhkR05vV3pCZExteGxibWQwYUNBOElHdE5ZWEpyZFhCUVlYUjBaWEp1TG14aGMzUkpibVJsZUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2FXWWdhR0Z6SUdOdmJuUmxiblJjYmlBZ0lDQWdJQ0FnSUNBZ0lIUmxlSFFnUFNCa1lYUmhMbk5zYVdObEtHeGhjM1JVWlhoMFVHOXpMQ0JyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ2dMU0J0WVhSamFGc3dYUzVzWlc1bmRHZ3BPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdWNGRDNTBjbWx0S0NrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZCaGNtVnVkQzVqYUdsc1pFNXZaR1Z6VzJOMWNuSmxiblJRWVhKbGJuUXVZMmhwYkdST2IyUmxjeTVzWlc1bmRHaGRJRDBnVkdWNGRFNXZaR1VvZEdWNGRDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2JHRnpkRlJsZUhSUWIzTWdQU0JyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZzdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1ZHaHBjeUJwY3lCaElHTnZiVzFsYm5RdVhHNGdJQ0FnSUNBZ0lHbG1JQ2h0WVhSamFGc3dYVnN4WFNBOVBUMGdKeUVuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl1ZEdsdWRXVTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCcFppQW9iM0IwYVc5dWN5NXNiM2RsY2tOaGMyVlVZV2RPWVcxbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYldGMFkyaGJNbDBnUFNCdFlYUmphRnN5WFM1MGIweHZkMlZ5UTJGelpTZ3BPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0Z0WVhSamFGc3hYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJRzV2ZENBOEx5QjBZV2R6WEc0Z0lDQWdJQ0FnSUNBZ2JHVjBJR0YwZEhKeklEMGdlMzA3WEc1Y2JpQWdJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQmhkSFJOWVhSamFEc2dZWFIwVFdGMFkyZ2dQU0JyUVhSMGNtbGlkWFJsVUdGMGRHVnliaTVsZUdWaktHMWhkR05vV3pOZEtUc2dLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhkSFJ5YzF0aGRIUk5ZWFJqYUZzeFhWMGdQU0JoZEhSTllYUmphRnN6WFNCOGZDQmhkSFJOWVhSamFGczBYU0I4ZkNCaGRIUk5ZWFJqYUZzMVhUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvSVcxaGRHTm9XelJkSUNZbUlHdEZiR1Z0Wlc1MGMwTnNiM05sWkVKNVQzQmxibWx1WjF0amRYSnlaVzUwVUdGeVpXNTBMbTV2WkdWT1lXMWxYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0d0RmJHVnRaVzUwYzBOc2IzTmxaRUo1VDNCbGJtbHVaMXRqZFhKeVpXNTBVR0Z5Wlc1MExtNXZaR1ZPWVcxbFhWdHRZWFJqYUZzeVhWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdjM1JoWTJzdWNHOXdLQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUlFZWEpsYm5RZ1BTQnpkR0ZqYTF0emRHRmpheTVzWlc1bmRHZ2dMU0F4WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0JqZFhKeVpXNTBVR0Z5Wlc1MElEMGdZM1Z5Y21WdWRGQmhjbVZ1ZEM1amFHbHNaRTV2WkdWelcyTjFjbkpsYm5SUVlYSmxiblF1WTJocGJHUk9iMlJsY3k1d2RYTm9LRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQklWRTFNUld4bGJXVnVkQ2h0WVhSamFGc3lYU3dnWVhSMGNuTXNJRzFoZEdOb1d6TmRLU2tnTFNBeFhUdGNibHh1SUNBZ0lDQWdJQ0FnSUhOMFlXTnJMbkIxYzJnb1kzVnljbVZ1ZEZCaGNtVnVkQ2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYTBKc2IyTnJWR1Y0ZEVWc1pXMWxiblJ6VzIxaGRHTm9XekpkWFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1lTQnNhWFIwYkdVZ2RHVnpkQ0IwYnlCbWFXNWtJRzVsZUhRZ1BDOXpZM0pwY0hRK0lHOXlJRHd2YzNSNWJHVStJQzR1TGx4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUdOc2IzTmxUV0Z5YTNWd0lEMGdKend2SnlBcklHMWhkR05vV3pKZElDc2dKejRuTzF4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUdsdVpHVjRJRDBnWkdGMFlTNXBibVJsZUU5bUtHTnNiM05sVFdGeWEzVndMQ0JyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ3BPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYjNCMGFXOXVjMXR0WVhSamFGc3lYVjBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHbHVaR1Y0SUQwOUlDMHhLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2RHaGxjbVVnYVhNZ2JtOGdiV0YwWTJocGJtY2daVzVrYVc1bklHWnZjaUIwYUdVZ2RHVjRkQ0JsYkdWdFpXNTBMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJsZUhRZ1BTQmtZWFJoTG5Oc2FXTmxLR3ROWVhKcmRYQlFZWFIwWlhKdUxteGhjM1JKYm1SbGVDazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdWNGRDQTlJR1JoZEdFdWMyeHBZMlVvYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRMQ0JwYm1SbGVDazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdWNGRDNXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTNWeWNtVnVkRkJoY21WdWRDNWphR2xzWkU1dlpHVnpXMk4xY25KbGJuUlFZWEpsYm5RdVkyaHBiR1JPYjJSbGN5NXNaVzVuZEdoZElEMGdWR1Y0ZEU1dlpHVW9kR1Y0ZENrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hwYm1SbGVDQTlQU0F0TVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1lYTjBWR1Y0ZEZCdmN5QTlJR3ROWVhKcmRYQlFZWFIwWlhKdUxteGhjM1JKYm1SbGVDQTlJR1JoZEdFdWJHVnVaM1JvSUNzZ01UdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1lYTjBWR1Y0ZEZCdmN5QTlJR3ROWVhKcmRYQlFZWFIwWlhKdUxteGhjM1JKYm1SbGVDQTlJR2x1WkdWNElDc2dZMnh2YzJWTllYSnJkWEF1YkdWdVozUm9PMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnRZWFJqYUZzeFhTQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJR2xtSUNodFlYUmphRnN4WFNCOGZDQnRZWFJqYUZzMFhTQjhmQ0JyVTJWc1prTnNiM05wYm1kRmJHVnRaVzUwYzF0dFlYUmphRnN5WFYwcElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlBOEx5QnZjaUF2UGlCdmNpQThZbkkrSUdWMFl5NWNiaUFnSUNBZ0lDQWdJQ0IzYUdsc1pTQW9kSEoxWlNBbUppQmpkWEp5Wlc1MFVHRnlaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1kzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFRtRnRaU0E5UFNCdFlYUmphRnN5WFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCemRHRmpheTV3YjNBb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZCaGNtVnVkQ0E5SUhOMFlXTnJXM04wWVdOckxteGxibWQwYUNBdElERmRPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklGUnllV2x1WnlCMGJ5QmpiRzl6WlNCamRYSnlaVzUwSUhSaFp5d2dZVzVrSUcxdmRtVWdiMjVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0d0RmJHVnRaVzUwYzBOc2IzTmxaRUo1UTJ4dmMybHVaMXRqZFhKeVpXNTBVR0Z5Wlc1MExtNXZaR1ZPWVcxbFhTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoclJXeGxiV1Z1ZEhORGJHOXpaV1JDZVVOc2IzTnBibWRiWTNWeWNtVnVkRkJoY21WdWRDNXViMlJsVG1GdFpWMWJiV0YwWTJoYk1sMWRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCemRHRmpheTV3YjNBb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUlFZWEpsYm5RZ1BTQnpkR0ZqYTF0emRHRmpheTVzWlc1bmRHZ2dMU0F4WFR0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZMjl1ZEdsdWRXVTdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnVlhObElHRm5aM0psYzNOcGRtVWdjM1J5WVhSbFoza2dkRzhnYUdGdVpHeGxJSFZ1YldGMFkyaHBibWNnYldGeWEzVndjeTVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQnliMjkwTzF4dUlDQWdJSDFjYmlBZ2ZUdGNibHh1SUNCeVpYUjFjbTRnYUhSdGJGQmhjbk5sY2p0Y2JuMDdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNyZWF0ZVBvb2wgPSBjcmVhdGVQb29sO1xuZXhwb3J0cy5pbml0aWFsaXplUG9vbHMgPSBpbml0aWFsaXplUG9vbHM7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dWlkMiA9IHJlcXVpcmUoJy4vdXVpZCcpO1xuXG52YXIgX3V1aWQzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXVpZDIpO1xuXG52YXIgdXVpZCA9IF91dWlkM1snZGVmYXVsdCddO1xudmFyIHBvb2xzID0ge307XG5leHBvcnRzLnBvb2xzID0gcG9vbHM7XG52YXIgY291bnQgPSAxMDAwMDtcblxuZXhwb3J0cy5jb3VudCA9IGNvdW50O1xuLyoqXG4gKiBDcmVhdGVzIGEgcG9vbCB0byBxdWVyeSBuZXcgb3IgcmV1c2VkIHZhbHVlcyBmcm9tLlxuICpcbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gb3B0c1xuICogQHJldHVybiB7T2JqZWN0fSBwb29sXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlUG9vbChuYW1lLCBvcHRzKSB7XG4gIHZhciBzaXplID0gb3B0cy5zaXplO1xuICB2YXIgZmlsbCA9IG9wdHMuZmlsbDtcblxuICB2YXIgX2ZyZWUgPSBbXTtcbiAgdmFyIGFsbG9jYXRlZCA9IFtdO1xuICB2YXIgX3Byb3RlY3QgPSBbXTtcblxuICAvLyBQcmltZSB0aGUgY2FjaGUgd2l0aCBuIG9iamVjdHMuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgX2ZyZWVbaV0gPSBmaWxsKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIF9mcmVlOiBfZnJlZSxcbiAgICBfYWxsb2NhdGVkOiBhbGxvY2F0ZWQsXG4gICAgX3Byb3RlY3RlZDogX3Byb3RlY3QsXG4gICAgX3V1aWQ6IHt9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgb2JqID0gbnVsbDtcbiAgICAgIHZhciBmcmVlTGVuZ3RoID0gX2ZyZWUubGVuZ3RoO1xuICAgICAgdmFyIG1pbnVzT25lID0gZnJlZUxlbmd0aCAtIDE7XG5cbiAgICAgIGlmIChmcmVlTGVuZ3RoKSB7XG4gICAgICAgIG9iaiA9IF9mcmVlW21pbnVzT25lXTtcbiAgICAgICAgX2ZyZWUubGVuZ3RoID0gbWludXNPbmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBmaWxsKCk7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5wdXNoKG9iaik7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuICAgIHByb3RlY3Q6IGZ1bmN0aW9uIHByb3RlY3QodmFsdWUpIHtcbiAgICAgIHZhciBpZHggPSBhbGxvY2F0ZWQuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgIC8vIE1vdmUgdGhlIHZhbHVlIG91dCBvZiBhbGxvY2F0ZWQsIHNpbmNlIHdlIG5lZWQgdG8gcHJvdGVjdCB0aGlzIGZyb21cbiAgICAgIC8vIGJlaW5nIGZyZWUnZCBhY2NpZGVudGFsbHkuXG4gICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICBfcHJvdGVjdC5wdXNoKGFsbG9jYXRlZC5zcGxpY2UoaWR4LCAxKVswXSk7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgcHJvdGVjdGluZyBhbiBlbGVtZW50IG9iamVjdCwgcHVzaCB0aGUgdXVpZCBpbnRvIGEgbG9va3VwXG4gICAgICAgIC8vIHRhYmxlLlxuICAgICAgICBpZiAobmFtZSA9PT0gJ2VsZW1lbnRPYmplY3QnKSB7XG4gICAgICAgICAgdGhpcy5fdXVpZFt2YWx1ZS5lbGVtZW50XSA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5wcm90ZWN0OiBmdW5jdGlvbiB1bnByb3RlY3QodmFsdWUpIHtcbiAgICAgIHZhciBpZHggPSBfcHJvdGVjdC5pbmRleE9mKHZhbHVlKTtcbiAgICAgIHZhciBmcmVlTGVuZ3RoID0gX2ZyZWUubGVuZ3RoO1xuXG4gICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICBpZiAoZnJlZUxlbmd0aCA8IHNpemUpIHtcbiAgICAgICAgICB2YXIgb2JqID0gX3Byb3RlY3Quc3BsaWNlKGlkeCwgMSlbMF07XG5cbiAgICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICBfZnJlZS5wdXNoKG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgPT09ICdlbGVtZW50T2JqZWN0Jykge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl91dWlkW3ZhbHVlLmVsZW1lbnRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZyZWVBbGw6IGZ1bmN0aW9uIGZyZWVBbGwoKSB7XG4gICAgICB2YXIgYWxsb2NhdGVkTGVuZ3RoID0gYWxsb2NhdGVkLmxlbmd0aDtcbiAgICAgIHZhciBmcmVlTGVuZ3RoID0gX2ZyZWUubGVuZ3RoO1xuXG4gICAgICBfZnJlZS5wdXNoLmFwcGx5KF9mcmVlLCBhbGxvY2F0ZWQuc2xpY2UoMCwgc2l6ZSAtIGZyZWVMZW5ndGgpKTtcbiAgICAgIGFsbG9jYXRlZC5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBmcmVlOiBmdW5jdGlvbiBmcmVlKHZhbHVlKSB7XG4gICAgICB2YXIgaWR4ID0gYWxsb2NhdGVkLmluZGV4T2YodmFsdWUpO1xuXG4gICAgICAvLyBBbHJlYWR5IGZyZWVkLlxuICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IHB1dCBiYWNrIGludG8gdGhlIGZyZWUgcXVldWUgaWYgd2UncmUgdW5kZXIgdGhlIHNpemUuXG4gICAgICBpZiAoX2ZyZWUubGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgICBfZnJlZS5wdXNoKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgYWxsb2NhdGVkLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVBvb2xzKENPVU5UKSB7XG4gIHBvb2xzLmF0dHJpYnV0ZU9iamVjdCA9IGNyZWF0ZVBvb2woJ2F0dHJpYnV0ZU9iamVjdCcsIHtcbiAgICBzaXplOiBDT1VOVCxcblxuICAgIGZpbGw6IGZ1bmN0aW9uIGZpbGwoKSB7XG4gICAgICByZXR1cm4geyBuYW1lOiAnJywgdmFsdWU6ICcnIH07XG4gICAgfVxuICB9KTtcblxuICBwb29scy5lbGVtZW50T2JqZWN0ID0gY3JlYXRlUG9vbCgnZWxlbWVudE9iamVjdCcsIHtcbiAgICBzaXplOiBDT1VOVCxcblxuICAgIGZpbGw6IGZ1bmN0aW9uIGZpbGwoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVtZW50OiB1dWlkKCksXG4gICAgICAgIGNoaWxkTm9kZXM6IFtdLFxuICAgICAgICBhdHRyaWJ1dGVzOiBbXVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBDcmVhdGUgMTBrIGl0ZW1zIG9mIGVhY2ggdHlwZS5cbmluaXRpYWxpemVQb29scyhjb3VudCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZjRzl2YkhNdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096dHhRa0ZCYTBJc1VVRkJVVHM3T3p0QlFVVXhRaXhKUVVGTkxFbEJRVWtzYjBKQlFWRXNRMEZCUXp0QlFVTmFMRWxCUVVrc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF6czdRVUZEWml4SlFVRkpMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU03T3pzN096czdPenM3TzBGQlUyeENMRk5CUVZNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdUVUZETDBJc1NVRkJTU3hIUVVGWExFbEJRVWtzUTBGQmJrSXNTVUZCU1R0TlFVRkZMRWxCUVVrc1IwRkJTeXhKUVVGSkxFTkJRV0lzU1VGQlNUczdRVUZEYUVJc1RVRkJTU3hMUVVGSkxFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEyUXNUVUZCU1N4VFFVRlRMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMjVDTEUxQlFVa3NVVUZCVHl4SFFVRkhMRVZCUVVVc1EwRkJRenM3TzBGQlIycENMRTlCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRE4wSXNVMEZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFbEJRVWtzUlVGQlJTeERRVUZETzBkQlEyeENPenRCUVVWRUxGTkJRVTg3UVVGRFRDeFRRVUZMTEVWQlFVVXNTMEZCU1R0QlFVTllMR05CUVZVc1JVRkJSU3hUUVVGVE8wRkJRM0pDTEdOQlFWVXNSVUZCUlN4UlFVRlBPMEZCUTI1Q0xGTkJRVXNzUlVGQlJTeEZRVUZGT3p0QlFVVlVMRTlCUVVjc1JVRkJSU3hsUVVGWE8wRkJRMlFzVlVGQlNTeEhRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTJZc1ZVRkJTU3hWUVVGVkxFZEJRVWNzUzBGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTTNRaXhWUVVGSkxGRkJRVkVzUjBGQlJ5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVVNVFpeFZRVUZKTEZWQlFWVXNSVUZCUlR0QlFVTmtMRmRCUVVjc1IwRkJSeXhMUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY2tJc1lVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTTdUMEZEZUVJc1RVRkRTVHRCUVVOSUxGZEJRVWNzUjBGQlJ5eEpRVUZKTEVWQlFVVXNRMEZCUXp0UFFVTmtPenRCUVVWRUxHVkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWEJDTEdGQlFVOHNSMEZCUnl4RFFVRkRPMHRCUTFvN08wRkJSVVFzVjBGQlR5eEZRVUZGTEdsQ1FVRlRMRXRCUVVzc1JVRkJSVHRCUVVOMlFpeFZRVUZKTEVkQlFVY3NSMEZCUnl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3pzN08wRkJTVzVETEZWQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRMlFzWjBKQlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6czdPenRCUVVreFF5eFpRVUZKTEVsQlFVa3NTMEZCU3l4bFFVRmxMRVZCUVVVN1FVRkROVUlzWTBGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFOQlF5OUNPMDlCUTBZN1MwRkRSanM3UVVGRlJDeGhRVUZUTEVWQlFVVXNiVUpCUVZNc1MwRkJTeXhGUVVGRk8wRkJRM3BDTEZWQlFVa3NSMEZCUnl4SFFVRkhMRkZCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEYWtNc1ZVRkJTU3hWUVVGVkxFZEJRVWNzUzBGQlNTeERRVUZETEUxQlFVMHNRMEZCUXpzN1FVRkZOMElzVlVGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRVZCUVVVN1FVRkRaQ3haUVVGSkxGVkJRVlVzUjBGQlJ5eEpRVUZKTEVWQlFVVTdRVUZEY2tJc1kwRkJTU3hIUVVGSExFZEJRVWNzVVVGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlhCRExHTkJRVWtzUjBGQlJ5eEZRVUZGTzBGQlFVVXNhVUpCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdWMEZCUlR0VFFVTTNRanM3UVVGRlJDeFpRVUZKTEVsQlFVa3NTMEZCU3l4bFFVRmxMRVZCUVVVN1FVRkROVUlzYVVKQlFVOHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdVMEZEYkVNN1QwRkRSanRMUVVOR096dEJRVVZFTEZkQlFVOHNSVUZCUlN4dFFrRkJWenRCUVVOc1FpeFZRVUZKTEdWQlFXVXNSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wRkJRM1pETEZWQlFVa3NWVUZCVlN4SFFVRkhMRXRCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJUZENMRmRCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJTeEpRVUZKTEVkQlFVY3NWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNM1JDeGxRVUZUTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRMUVVOMFFqczdRVUZGUkN4UlFVRkpMRVZCUVVVc1kwRkJVeXhMUVVGTExFVkJRVVU3UVVGRGNFSXNWVUZCU1N4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN08wRkJSMjVETEZWQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRVVVzWlVGQlR6dFBRVUZGT3pzN1FVRkhNMElzVlVGQlNTeExRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRWxCUVVrc1JVRkJSVHRCUVVOMFFpeGhRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wOUJRMnhDT3p0QlFVVkVMR1ZCUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpGQ08wZEJRMFlzUTBGQlF6dERRVU5JT3p0QlFVZE5MRk5CUVZNc1pVRkJaU3hEUVVGRExFdEJRVXNzUlVGQlJUdEJRVU55UXl4UFFVRkxMRU5CUVVNc1pVRkJaU3hIUVVGSExGVkJRVlVzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSVHRCUVVOd1JDeFJRVUZKTEVWQlFVVXNTMEZCU3pzN1FVRkZXQ3hSUVVGSkxFVkJRVVVzWjBKQlFWYzdRVUZEWml4aFFVRlBMRVZCUVVVc1NVRkJTU3hGUVVGRkxFVkJRVVVzUlVGQlJTeExRVUZMTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN1MwRkRhRU03UjBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1QwRkJTeXhEUVVGRExHRkJRV0VzUjBGQlJ5eFZRVUZWTEVOQlFVTXNaVUZCWlN4RlFVRkZPMEZCUTJoRUxGRkJRVWtzUlVGQlJTeExRVUZMT3p0QlFVVllMRkZCUVVrc1JVRkJSU3huUWtGQlZ6dEJRVU5tTEdGQlFVODdRVUZEVEN4bFFVRlBMRVZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRMllzYTBKQlFWVXNSVUZCUlN4RlFVRkZPMEZCUTJRc2EwSkJRVlVzUlVGQlJTeEZRVUZGTzA5QlEyWXNRMEZCUXp0TFFVTklPMGRCUTBZc1EwRkJReXhEUVVGRE8wTkJRMG83T3p0QlFVZEVMR1ZCUVdVc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5SXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOTFkR2xzTDNCdmIyeHpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUY5MWRXbGtJR1p5YjIwZ0p5NHZkWFZwWkNjN1hHNWNibU52Ym5OMElIVjFhV1FnUFNCZmRYVnBaRHRjYm1WNGNHOXlkQ0JzWlhRZ2NHOXZiSE1nUFNCN2ZUdGNibVY0Y0c5eWRDQnNaWFFnWTI5MWJuUWdQU0F4TURBd01EdGNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJR0VnY0c5dmJDQjBieUJ4ZFdWeWVTQnVaWGNnYjNJZ2NtVjFjMlZrSUhaaGJIVmxjeUJtY205dExseHVJQ3BjYmlBcUlFQndZWEpoYlNCdVlXMWxYRzRnS2lCQWNHRnlZVzBnYjNCMGMxeHVJQ29nUUhKbGRIVnliaUI3VDJKcVpXTjBmU0J3YjI5c1hHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJqY21WaGRHVlFiMjlzS0c1aGJXVXNJRzl3ZEhNcElIdGNiaUFnYkdWMElIc2djMmw2WlN3Z1ptbHNiQ0I5SUQwZ2IzQjBjenRjYmlBZ2JHVjBJR1p5WldVZ1BTQmJYVHRjYmlBZ2JHVjBJR0ZzYkc5allYUmxaQ0E5SUZ0ZE8xeHVJQ0JzWlhRZ2NISnZkR1ZqZENBOUlGdGRPMXh1WEc0Z0lDOHZJRkJ5YVcxbElIUm9aU0JqWVdOb1pTQjNhWFJvSUc0Z2IySnFaV04wY3k1Y2JpQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0J6YVhwbE95QnBLeXNwSUh0Y2JpQWdJQ0JtY21WbFcybGRJRDBnWm1sc2JDZ3BPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSHRjYmlBZ0lDQmZabkpsWlRvZ1puSmxaU3hjYmlBZ0lDQmZZV3hzYjJOaGRHVmtPaUJoYkd4dlkyRjBaV1FzWEc0Z0lDQWdYM0J5YjNSbFkzUmxaRG9nY0hKdmRHVmpkQ3hjYmlBZ0lDQmZkWFZwWkRvZ2UzMHNYRzVjYmlBZ0lDQm5aWFE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzlpYWlBOUlHNTFiR3c3WEc0Z0lDQWdJQ0JzWlhRZ1puSmxaVXhsYm1kMGFDQTlJR1p5WldVdWJHVnVaM1JvTzF4dUlDQWdJQ0FnYkdWMElHMXBiblZ6VDI1bElEMGdabkpsWlV4bGJtZDBhQ0F0SURFN1hHNWNiaUFnSUNBZ0lHbG1JQ2htY21WbFRHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lHOWlhaUE5SUdaeVpXVmJiV2x1ZFhOUGJtVmRPMXh1SUNBZ0lDQWdJQ0JtY21WbExteGxibWQwYUNBOUlHMXBiblZ6VDI1bE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUc5aWFpQTlJR1pwYkd3b0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZV3hzYjJOaGRHVmtMbkIxYzJnb2IySnFLVHRjYmx4dUlDQWdJQ0FnY21WMGRYSnVJRzlpYWp0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnY0hKdmRHVmpkRG9nWm5WdVkzUnBiMjRvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJR3hsZENCcFpIZ2dQU0JoYkd4dlkyRjBaV1F1YVc1a1pYaFBaaWgyWVd4MVpTazdYRzVjYmlBZ0lDQWdJQzh2SUUxdmRtVWdkR2hsSUhaaGJIVmxJRzkxZENCdlppQmhiR3h2WTJGMFpXUXNJSE5wYm1ObElIZGxJRzVsWldRZ2RHOGdjSEp2ZEdWamRDQjBhR2x6SUdaeWIyMWNiaUFnSUNBZ0lDOHZJR0psYVc1bklHWnlaV1VuWkNCaFkyTnBaR1Z1ZEdGc2JIa3VYRzRnSUNBZ0lDQnBaaUFvYVdSNElDRTlQU0F0TVNrZ2UxeHVJQ0FnSUNBZ0lDQndjbTkwWldOMExuQjFjMmdvWVd4c2IyTmhkR1ZrTG5Od2JHbGpaU2hwWkhnc0lERXBXekJkS1R0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJKWmlCM1pTZHlaU0J3Y205MFpXTjBhVzVuSUdGdUlHVnNaVzFsYm5RZ2IySnFaV04wTENCd2RYTm9JSFJvWlNCMWRXbGtJR2x1ZEc4Z1lTQnNiMjlyZFhCY2JpQWdJQ0FnSUNBZ0x5OGdkR0ZpYkdVdVhHNGdJQ0FnSUNBZ0lHbG1JQ2h1WVcxbElEMDlQU0FuWld4bGJXVnVkRTlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbDkxZFdsa1czWmhiSFZsTG1Wc1pXMWxiblJkSUQwZ01UdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQjFibkJ5YjNSbFkzUTZJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQnNaWFFnYVdSNElEMGdjSEp2ZEdWamRDNXBibVJsZUU5bUtIWmhiSFZsS1R0Y2JpQWdJQ0FnSUd4bGRDQm1jbVZsVEdWdVozUm9JRDBnWm5KbFpTNXNaVzVuZEdnN1hHNWNiaUFnSUNBZ0lHbG1JQ2hwWkhnZ0lUMDlJQzB4S1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2htY21WbFRHVnVaM1JvSUR3Z2MybDZaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHeGxkQ0J2WW1vZ1BTQndjbTkwWldOMExuTndiR2xqWlNocFpIZ3NJREVwV3pCZE8xeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHOWlhaWtnZXlCbWNtVmxMbkIxYzJnb2IySnFLVHNnZlZ4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0c1aGJXVWdQVDA5SUNkbGJHVnRaVzUwVDJKcVpXTjBKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHUmxiR1YwWlNCMGFHbHpMbDkxZFdsa1czWmhiSFZsTG1Wc1pXMWxiblJkTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdaeVpXVkJiR3c2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2JHVjBJR0ZzYkc5allYUmxaRXhsYm1kMGFDQTlJR0ZzYkc5allYUmxaQzVzWlc1bmRHZzdYRzRnSUNBZ0lDQnNaWFFnWm5KbFpVeGxibWQwYUNBOUlHWnlaV1V1YkdWdVozUm9PMXh1WEc0Z0lDQWdJQ0JtY21WbExuQjFjMmd1WVhCd2JIa29abkpsWlN3Z1lXeHNiMk5oZEdWa0xuTnNhV05sS0RBc0lITnBlbVVnTFNCbWNtVmxUR1Z1WjNSb0tTazdYRzRnSUNBZ0lDQmhiR3h2WTJGMFpXUXViR1Z1WjNSb0lEMGdNRHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdabkpsWlRvZ1puVnVZM1JwYjI0b2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUd4bGRDQnBaSGdnUFNCaGJHeHZZMkYwWldRdWFXNWtaWGhQWmloMllXeDFaU2s3WEc1Y2JpQWdJQ0FnSUM4dklFRnNjbVZoWkhrZ1puSmxaV1F1WEc0Z0lDQWdJQ0JwWmlBb2FXUjRJRDA5UFNBdE1Ta2dleUJ5WlhSMWNtNDdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1QyNXNlU0J3ZFhRZ1ltRmpheUJwYm5SdklIUm9aU0JtY21WbElIRjFaWFZsSUdsbUlIZGxKM0psSUhWdVpHVnlJSFJvWlNCemFYcGxMbHh1SUNBZ0lDQWdhV1lnS0daeVpXVXViR1Z1WjNSb0lEd2djMmw2WlNrZ2UxeHVJQ0FnSUNBZ0lDQm1jbVZsTG5CMWMyZ29kbUZzZFdVcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmhiR3h2WTJGMFpXUXVjM0JzYVdObEtHbGtlQ3dnTVNrN1hHNGdJQ0FnZlZ4dUlDQjlPMXh1ZlZ4dVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnBibWwwYVdGc2FYcGxVRzl2YkhNb1EwOVZUbFFwSUh0Y2JpQWdjRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wSUQwZ1kzSmxZWFJsVUc5dmJDZ25ZWFIwY21saWRYUmxUMkpxWldOMEp5d2dlMXh1SUNBZ0lITnBlbVU2SUVOUFZVNVVMRnh1WEc0Z0lDQWdabWxzYkRvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2V5QnVZVzFsT2lBbkp5d2dkbUZzZFdVNklDY25JSDA3WEc0Z0lDQWdmVnh1SUNCOUtUdGNibHh1SUNCd2IyOXNjeTVsYkdWdFpXNTBUMkpxWldOMElEMGdZM0psWVhSbFVHOXZiQ2duWld4bGJXVnVkRTlpYW1WamRDY3NJSHRjYmlBZ0lDQnphWHBsT2lCRFQxVk9WQ3hjYmx4dUlDQWdJR1pwYkd3NklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lDQWdaV3hsYldWdWREb2dkWFZwWkNncExGeHVJQ0FnSUNBZ0lDQmphR2xzWkU1dlpHVnpPaUJiWFN4Y2JpQWdJQ0FnSUNBZ1lYUjBjbWxpZFhSbGN6b2dXMTFjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmVnh1SUNCOUtUdGNibjFjYmx4dUx5OGdRM0psWVhSbElERXdheUJwZEdWdGN5QnZaaUJsWVdOb0lIUjVjR1V1WEc1cGJtbDBhV0ZzYVhwbFVHOXZiSE1vWTI5MWJuUXBPMXh1SWwxOSIsIi8qKlxuICogR2VuZXJhdGVzIGEgdXVpZC5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjMvMjgyMTc1XG4gKiBAcmV0dXJuIHtzdHJpbmd9IHV1aWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHV1aWQ7XG5cbmZ1bmN0aW9uIHV1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwLFxuICAgICAgICB2ID0gYyA9PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmRYVnBaQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3p0eFFrRk5kMElzU1VGQlNUczdRVUZCWWl4VFFVRlRMRWxCUVVrc1IwRkJSenRCUVVNM1FpeFRRVUZQTEhORFFVRnpReXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNWVUZCVXl4RFFVRkRMRVZCUVVVN1FVRkRla1VzVVVGQlNTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hIUVVGRExFVkJRVVVzUjBGQlF5eERRVUZETzFGQlFVVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hIUVVGSExFZEJRVWNzUTBGQlF5eEhRVUZKTEVOQlFVTXNSMEZCUXl4SFFVRkhMRWRCUVVNc1IwRkJSeXhCUVVGRExFTkJRVU03UVVGRE0wUXNWMEZCVHl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzBkQlEzWkNMRU5CUVVNc1EwRkJRenREUVVOS0lpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2ZFhWcFpDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUjJWdVpYSmhkR1Z6SUdFZ2RYVnBaQzVjYmlBcVhHNGdLaUJBYzJWbElHaDBkSEE2THk5emRHRmphMjkyWlhKbWJHOTNMbU52YlM5aEx6SXhNVGMxTWpNdk1qZ3lNVGMxWEc0Z0tpQkFjbVYwZFhKdUlIdHpkSEpwYm1kOUlIVjFhV1JjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z2RYVnBaQ2dwSUh0Y2JpQWdjbVYwZFhKdUlDZDRlSGg0ZUhoNGVDMTRlSGg0TFRSNGVIZ3RlWGg0ZUMxNGVIaDRlSGg0ZUhoNGVIZ25MbkpsY0d4aFkyVW9MMXQ0ZVYwdlp5d2dablZ1WTNScGIyNG9ZeWtnZTF4dUlDQWdJR3hsZENCeUlEMGdUV0YwYUM1eVlXNWtiMjBvS1NveE5ud3dMQ0IySUQwZ1l5QTlQU0FuZUNjZ1B5QnlJRG9nS0hJbU1IZ3pmREI0T0NrN1hHNGdJQ0FnY21WMGRYSnVJSFl1ZEc5VGRISnBibWNvTVRZcE8xeHVJQ0I5S1R0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09ialsnZGVmYXVsdCddID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxVdWlkID0gcmVxdWlyZSgnLi4vdXRpbC91dWlkJyk7XG5cbnZhciBfdXRpbFV1aWQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbFV1aWQpO1xuXG52YXIgX3V0aWxCdWZmZXJzID0gcmVxdWlyZSgnLi4vdXRpbC9idWZmZXJzJyk7XG5cbnZhciBidWZmZXJzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3V0aWxCdWZmZXJzKTtcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbFBhcnNlciA9IHJlcXVpcmUoJy4uL3V0aWwvcGFyc2VyJyk7XG5cbnZhciBfdXRpbE1lbW9yeSA9IHJlcXVpcmUoJy4uL3V0aWwvbWVtb3J5Jyk7XG5cbnZhciBfbm9kZVN5bmMgPSByZXF1aXJlKCcuLi9ub2RlL3N5bmMnKTtcblxudmFyIF9ub2RlU3luYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlU3luYyk7XG5cbnZhciBfc291cmNlID0gcmVxdWlyZSgnLi9zb3VyY2UnKTtcblxudmFyIF9zb3VyY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc291cmNlKTtcblxudmFyIHBvb2xzID0gX3V0aWxQb29scy5wb29scztcblxudmFyIGhhc1dvcmtlciA9IHR5cGVvZiBXb3JrZXIgPT09ICdmdW5jdGlvbic7XG5cbmV4cG9ydHMuaGFzV29ya2VyID0gaGFzV29ya2VyO1xuXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIHZhciB3b3JrZXJCbG9iID0gbnVsbDtcbiAgdmFyIHdvcmtlciA9IG51bGw7XG5cbiAgLy8gU2V0IHVwIGEgV2ViV29ya2VyIGlmIGF2YWlsYWJsZS5cbiAgaWYgKGhhc1dvcmtlcikge1xuICAgIC8vIENvbnN0cnVjdCB0aGUgd29ya2VyIHJldXNpbmcgY29kZSBhbHJlYWR5IG9yZ2FuaXplZCBpbnRvIG1vZHVsZXMuICBLZWVwXG4gICAgLy8gdGhpcyBjb2RlIEVTNSBzaW5jZSB3ZSBkbyBub3QgZ2V0IHRpbWUgdG8gcHJlLXByb2Nlc3MgaXQgYXMgRVM2LlxuICAgIHdvcmtlckJsb2IgPSBuZXcgQmxvYihbW1xuICAgIC8vIFJldXNhYmxlIEFycmF5IG1ldGhvZHMuXG4gICAgJ3ZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTsnLFxuXG4gICAgLy8gQWRkIGEgbmFtZXNwYWNlIHRvIGF0dGFjaCBwb29sIG1ldGhvZHMgdG8uXG4gICAgJ3ZhciBwb29scyA9IHt9OycsICd2YXIgbm9kZXMgPSAwOycsXG5cbiAgICAvLyBBZGRzIGluIGEgZ2xvYmFsIGB1dWlkYCBmdW5jdGlvbi5cbiAgICBfdXRpbFV1aWQyWydkZWZhdWx0J10sXG5cbiAgICAvLyBBZGQgdGhlIGFiaWxpdHkgdG8gcHJvdGVjdCBlbGVtZW50cyBmcm9tIGZyZWUnZCBtZW1vcnkuXG4gICAgX3V0aWxNZW1vcnkucHJvdGVjdEVsZW1lbnQsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5LFxuXG4gICAgLy8gQWRkIGluIHBvb2wgbWFuaXB1bGF0aW9uIG1ldGhvZHMuXG4gICAgX3V0aWxQb29scy5jcmVhdGVQb29sLCBfdXRpbFBvb2xzLmluaXRpYWxpemVQb29scywgJ2luaXRpYWxpemVQb29scygnICsgX3V0aWxQb29scy5jb3VudCArICcpOycsXG5cbiAgICAvLyBBZGQgaW4gTm9kZSBtYW5pcHVsYXRpb24uXG4gICAgJ3ZhciBzeW5jTm9kZSA9ICcgKyBfbm9kZVN5bmMyWydkZWZhdWx0J10sXG5cbiAgICAvLyBBZGQgaW4gdGhlIGFiaWxpdHkgdG8gcGFyc2VIVE1MLlxuICAgIF91dGlsUGFyc2VyLnBhcnNlSFRNTCxcblxuICAgIC8vIEdpdmUgdGhlIHdlYndvcmtlciB1dGlsaXRpZXMuXG4gICAgYnVmZmVycy5zdHJpbmdUb0J1ZmZlciwgYnVmZmVycy5idWZmZXJUb1N0cmluZywgJ3ZhciBtYWtlUGFyc2VyID0gJyArIF91dGlsUGFyc2VyLm1ha2VQYXJzZXIsICd2YXIgcGFyc2VyID0gbWFrZVBhcnNlcigpOycsXG5cbiAgICAvLyBBZGQgaW4gdGhlIHdvcmtlciBzb3VyY2UuXG4gICAgX3NvdXJjZTJbJ2RlZmF1bHQnXSxcblxuICAgIC8vIE1ldGFwcm9ncmFtbWluZyB1cCB0aGlzIHdvcmtlciBjYWxsLlxuICAgICdzdGFydHVwKHNlbGYpOyddLmpvaW4oJ1xcbicpXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIHdvcmtlciBhbmQgc3RhcnQgaXQgdXAuXG4gICAgdHJ5IHtcbiAgICAgIHdvcmtlciA9IG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTCh3b3JrZXJCbG9iKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5pbmZvKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkZhaWxlZCB0byBjcmVhdGUgZGlmZmh0bWwgd29ya2VyXCIsIGUpO1xuICAgICAgfVxuXG4gICAgICBleHBvcnRzLmhhc1dvcmtlciA9IGhhc1dvcmtlciA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3b3JrZXI7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNkdmNtdGxjaTlqY21WaGRHVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenM3ZDBKQlFXbENMR05CUVdNN096czdNa0pCUTA0c2FVSkJRV2xDT3p0SlFVRTVRaXhQUVVGUE96dDVRa0ZETUVNc1pVRkJaVHM3TUVKQlJYUkRMR2RDUVVGblFqczdNRUpCUTFFc1owSkJRV2RDT3p0M1FrRkRla1FzWTBGQll6czdPenR6UWtGRFZpeFZRVUZWT3pzN08wRkJSVzVETEVsQlFVa3NTMEZCU3l4dFFrRkJVeXhEUVVGRE96dEJRVVZhTEVsQlFVa3NVMEZCVXl4SFFVRkhMRTlCUVU4c1RVRkJUU3hMUVVGTExGVkJRVlVzUTBGQlF6czdPenRCUVVVM1F5eFRRVUZUTEUxQlFVMHNSMEZCUnp0QlFVTjJRaXhOUVVGSkxGVkJRVlVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEZEVJc1RVRkJTU3hOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZET3pzN1FVRkhiRUlzVFVGQlNTeFRRVUZUTEVWQlFVVTdPenRCUVVkaUxHTkJRVlVzUjBGQlJ5eEpRVUZKTEVsQlFVa3NRMEZCUXl4RFFVTndRanM3UVVGRlJTeDNRMEZCYjBNN096dEJRVWR3UXl4eFFrRkJhVUlzUlVGRGFrSXNaMEpCUVdkQ096czdPenM3T3pzN2RVUkJZV2hDTEd0Q1FVRnJRaXh0UWtGQldTeEhRVUZITEVsQlFVazdPenRCUVVkeVF5eHhRa0ZCYVVJc2QwSkJRVmM3T3pzN096dEJRVTAxUWl4WFFVRlBMRU5CUVVNc1kwRkJZeXhGUVVOMFFpeFBRVUZQTEVOQlFVTXNZMEZCWXl4RlFVVjBRaXh0UWtGQmJVSXNlVUpCUVdFc1JVRkRhRU1zTkVKQlFUUkNPenM3T3pzN1FVRk5OVUlzYjBKQlFXZENMRU5CUTJwQ0xFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVTmlMRVZCUVVVc1JVRkJSU3hKUVVGSkxFVkJRVVVzZDBKQlFYZENMRVZCUVVVc1EwRkJReXhEUVVGRE96czdRVUZIZGtNc1VVRkJTVHRCUVVOR0xGbEJRVTBzUjBGQlJ5eEpRVUZKTEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1pVRkJaU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTTdTMEZEZEVRc1EwRkRSQ3hQUVVGTkxFTkJRVU1zUlVGQlJUdEJRVU5RTEZWQlFVa3NUMEZCVHl4SlFVRkpMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVU3UVVGRE0wSXNaVUZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhyUTBGQmEwTXNSVUZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRQUVVOd1JEczdRVUZGUkN4alFUbEVTeXhUUVVGVExFZEJPRVJrTEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1MwRkRia0k3UjBGRFJqczdRVUZGUkN4VFFVRlBMRTFCUVUwc1EwRkJRenREUVVObUlpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzZHZjbXRsY2k5amNtVmhkR1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ2RYVnBaQ0JtY205dElDY3VMaTkxZEdsc0wzVjFhV1FuTzF4dWFXMXdiM0owSUNvZ1lYTWdZblZtWm1WeWN5Qm1jbTl0SUNjdUxpOTFkR2xzTDJKMVptWmxjbk1uTzF4dWFXMXdiM0owSUhzZ2NHOXZiSE1nWVhNZ1gzQnZiMnh6TENCcGJtbDBhV0ZzYVhwbFVHOXZiSE1zSUdOeVpXRjBaVkJ2YjJ3Z2ZTQm1jbTl0SUNjdUxpOTFkR2xzTDNCdmIyeHpKenRjYm1sdGNHOXlkQ0I3SUdOdmRXNTBJR0Z6SUhCdmIyeERiM1Z1ZENCOUlHWnliMjBnSnk0dUwzVjBhV3d2Y0c5dmJITW5PMXh1YVcxd2IzSjBJSHNnY0dGeWMyVklWRTFNTENCdFlXdGxVR0Z5YzJWeUlIMGdabkp2YlNBbkxpNHZkWFJwYkM5d1lYSnpaWEluTzF4dWFXMXdiM0owSUhzZ2NISnZkR1ZqZEVWc1pXMWxiblFzSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFzSUdOc1pXRnVUV1Z0YjNKNUlIMGdabkp2YlNBbkxpNHZkWFJwYkM5dFpXMXZjbmtuTzF4dWFXMXdiM0owSUhONWJtTk9iMlJsSUdaeWIyMGdKeTR1TDI1dlpHVXZjM2x1WXljN1hHNXBiWEJ2Y25RZ2QyOXlhMlZ5VTI5MWNtTmxJR1p5YjIwZ0p5NHZjMjkxY21ObEp6dGNibHh1YkdWMElIQnZiMnh6SUQwZ1gzQnZiMnh6TzF4dVhHNWxlSEJ2Y25RZ2JHVjBJR2hoYzFkdmNtdGxjaUE5SUhSNWNHVnZaaUJYYjNKclpYSWdQVDA5SUNkbWRXNWpkR2x2YmljN1hHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmpjbVZoZEdVb0tTQjdYRzRnSUd4bGRDQjNiM0pyWlhKQ2JHOWlJRDBnYm5Wc2JEdGNiaUFnYkdWMElIZHZjbXRsY2lBOUlHNTFiR3c3WEc1Y2JpQWdMeThnVTJWMElIVndJR0VnVjJWaVYyOXlhMlZ5SUdsbUlHRjJZV2xzWVdKc1pTNWNiaUFnYVdZZ0tHaGhjMWR2Y210bGNpa2dlMXh1SUNBZ0lDOHZJRU52Ym5OMGNuVmpkQ0IwYUdVZ2QyOXlhMlZ5SUhKbGRYTnBibWNnWTI5a1pTQmhiSEpsWVdSNUlHOXlaMkZ1YVhwbFpDQnBiblJ2SUcxdlpIVnNaWE11SUNCTFpXVndYRzRnSUNBZ0x5OGdkR2hwY3lCamIyUmxJRVZUTlNCemFXNWpaU0IzWlNCa2J5QnViM1FnWjJWMElIUnBiV1VnZEc4Z2NISmxMWEJ5YjJObGMzTWdhWFFnWVhNZ1JWTTJMbHh1SUNBZ0lIZHZjbXRsY2tKc2IySWdQU0J1WlhjZ1FteHZZaWhiWEc0Z0lDQWdJQ0JiWEc0Z0lDQWdJQ0FnSUM4dklGSmxkWE5oWW14bElFRnljbUY1SUcxbGRHaHZaSE11WEc0Z0lDQWdJQ0FnSUNkMllYSWdjMnhwWTJVZ1BTQkJjbkpoZVM1d2NtOTBiM1I1Y0dVdWMyeHBZMlU3Snl4Y2JseHVJQ0FnSUNBZ0lDQXZMeUJCWkdRZ1lTQnVZVzFsYzNCaFkyVWdkRzhnWVhSMFlXTm9JSEJ2YjJ3Z2JXVjBhRzlrY3lCMGJ5NWNiaUFnSUNBZ0lDQWdKM1poY2lCd2IyOXNjeUE5SUh0OU95Y3NYRzRnSUNBZ0lDQWdJQ2QyWVhJZ2JtOWtaWE1nUFNBd095Y3NYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtjeUJwYmlCaElHZHNiMkpoYkNCZ2RYVnBaR0FnWm5WdVkzUnBiMjR1WEc0Z0lDQWdJQ0FnSUhWMWFXUXNYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJSFJvWlNCaFltbHNhWFI1SUhSdklIQnliM1JsWTNRZ1pXeGxiV1Z1ZEhNZ1puSnZiU0JtY21WbEoyUWdiV1Z0YjNKNUxseHVJQ0FnSUNBZ0lDQndjbTkwWldOMFJXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ2RXNXdjbTkwWldOMFJXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ1kyeGxZVzVOWlcxdmNua3NYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJR2x1SUhCdmIyd2diV0Z1YVhCMWJHRjBhVzl1SUcxbGRHaHZaSE11WEc0Z0lDQWdJQ0FnSUdOeVpXRjBaVkJ2YjJ3c1hHNGdJQ0FnSUNBZ0lHbHVhWFJwWVd4cGVtVlFiMjlzY3l4Y2JpQWdJQ0FnSUNBZ0oybHVhWFJwWVd4cGVtVlFiMjlzY3lnbklDc2djRzl2YkVOdmRXNTBJQ3NnSnlrN0p5eGNibHh1SUNBZ0lDQWdJQ0F2THlCQlpHUWdhVzRnVG05a1pTQnRZVzVwY0hWc1lYUnBiMjR1WEc0Z0lDQWdJQ0FnSUNkMllYSWdjM2x1WTA1dlpHVWdQU0FuSUNzZ2MzbHVZMDV2WkdVc1hHNWNiaUFnSUNBZ0lDQWdMeThnUVdSa0lHbHVJSFJvWlNCaFltbHNhWFI1SUhSdklIQmhjbk5sU0ZSTlRDNWNiaUFnSUNBZ0lDQWdjR0Z5YzJWSVZFMU1MRnh1WEc0Z0lDQWdJQ0FnSUM4dklFZHBkbVVnZEdobElIZGxZbmR2Y210bGNpQjFkR2xzYVhScFpYTXVYRzRnSUNBZ0lDQWdJR0oxWm1abGNuTXVjM1J5YVc1blZHOUNkV1ptWlhJc1hHNGdJQ0FnSUNBZ0lHSjFabVpsY25NdVluVm1abVZ5Vkc5VGRISnBibWNzWEc1Y2JpQWdJQ0FnSUNBZ0ozWmhjaUJ0WVd0bFVHRnljMlZ5SUQwZ0p5QXJJRzFoYTJWUVlYSnpaWElzWEc0Z0lDQWdJQ0FnSUNkMllYSWdjR0Z5YzJWeUlEMGdiV0ZyWlZCaGNuTmxjaWdwT3ljc1hHNWNiaUFnSUNBZ0lDQWdMeThnUVdSa0lHbHVJSFJvWlNCM2IzSnJaWElnYzI5MWNtTmxMbHh1SUNBZ0lDQWdJQ0IzYjNKclpYSlRiM1Z5WTJVc1hHNWNiaUFnSUNBZ0lDQWdMeThnVFdWMFlYQnliMmR5WVcxdGFXNW5JSFZ3SUhSb2FYTWdkMjl5YTJWeUlHTmhiR3d1WEc0Z0lDQWdJQ0FnSUNkemRHRnlkSFZ3S0hObGJHWXBPeWRjYmlBZ0lDQWdJRjB1YW05cGJpZ25YRnh1SnlsY2JpQWdJQ0JkTENCN0lIUjVjR1U2SUNkaGNIQnNhV05oZEdsdmJpOXFZWFpoYzJOeWFYQjBKeUI5S1R0Y2JseHVJQ0FnSUM4dklFTnZibk4wY25WamRDQjBhR1VnZDI5eWEyVnlJR0Z1WkNCemRHRnlkQ0JwZENCMWNDNWNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdkMjl5YTJWeUlEMGdibVYzSUZkdmNtdGxjaWhWVWt3dVkzSmxZWFJsVDJKcVpXTjBWVkpNS0hkdmNtdGxja0pzYjJJcEtUdGNiaUFnSUNCOVhHNGdJQ0FnWTJGMFkyZ29aU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHTnZibk52YkdVZ0ppWWdZMjl1YzI5c1pTNXBibVp2S1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk52YkdVdWFXNW1ieWhjSWtaaGFXeGxaQ0IwYnlCamNtVmhkR1VnWkdsbVptaDBiV3dnZDI5eWEyVnlYQ0lzWlNrN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHaGhjMWR2Y210bGNpQTlJR1poYkhObE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCM2IzSnJaWEk3WEc1OVhHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN0YXJ0dXA7XG52YXIgYnVmZmVyVG9TdHJpbmc7XG52YXIgcGFyc2VIVE1MO1xudmFyIHN5bmNOb2RlO1xudmFyIHBvb2xzO1xuXG4vKipcbiAqIHN0YXJ0dXBcbiAqXG4gKiBAcGFyYW0gd29ya2VyXG4gKiBAcmV0dXJuXG4gKi9cblxuZnVuY3Rpb24gc3RhcnR1cCh3b3JrZXIpIHtcbiAgdmFyIFRyZWVzID0ge307XG4gIHZhciBwYXRjaGVzID0gW107XG5cbiAgd29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGRhdGEgPSBlLmRhdGE7XG4gICAgdmFyIG9mZnNldCA9IGRhdGEub2Zmc2V0O1xuICAgIHZhciB0cmFuc2ZlckJ1ZmZlciA9IGRhdGEuYnVmZmVyO1xuICAgIHZhciBpc0lubmVyID0gZGF0YS5pc0lubmVyO1xuXG4gICAgdmFyIG9sZFRyZWUgPSBUcmVlc1tlLmRhdGEudXVpZF0gfHwgZGF0YS5vbGRUcmVlO1xuICAgIHZhciBuZXdUcmVlID0gbnVsbDtcblxuICAgIFRyZWVzW2UuZGF0YS51dWlkXSA9IG9sZFRyZWU7XG5cbiAgICBpZiAoZGF0YS5uZXdUcmVlKSB7XG4gICAgICBuZXdUcmVlID0gZGF0YS5uZXdUcmVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmV3SFRNTCA9IGJ1ZmZlclRvU3RyaW5nKHRyYW5zZmVyQnVmZmVyLCBvZmZzZXQpO1xuXG4gICAgICAvLyBDYWxjdWxhdGUgYSBuZXcgdHJlZS5cbiAgICAgIG5ld1RyZWUgPSBwYXJzZUhUTUwobmV3SFRNTCwgaXNJbm5lcik7XG5cbiAgICAgIGlmIChpc0lubmVyKSB7XG4gICAgICAgIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZTtcblxuICAgICAgICBuZXdUcmVlID0ge1xuICAgICAgICAgIGNoaWxkTm9kZXM6IGNoaWxkTm9kZXMsXG5cbiAgICAgICAgICBhdHRyaWJ1dGVzOiBvbGRUcmVlLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgZWxlbWVudDogb2xkVHJlZS5lbGVtZW50LFxuICAgICAgICAgIG5vZGVOYW1lOiBvbGRUcmVlLm5vZGVOYW1lLFxuICAgICAgICAgIG5vZGVWYWx1ZTogb2xkVHJlZS5ub2RlVmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTeW5jaHJvbml6ZSB0aGUgb2xkIHZpcnR1YWwgdHJlZSB3aXRoIHRoZSBuZXcgdmlydHVhbCB0cmVlLiAgVGhpcyB3aWxsXG4gICAgLy8gcHJvZHVjZSBhIHNlcmllcyBvZiBwYXRjaGVzIHRoYXQgd2lsbCBiZSBleGN1dGVkIHRvIHVwZGF0ZSB0aGUgRE9NLlxuICAgIHN5bmNOb2RlLmNhbGwocGF0Y2hlcywgb2xkVHJlZSwgbmV3VHJlZSk7XG5cbiAgICAvLyBTZW5kIHRoZSBwYXRjaGVzIGJhY2sgdG8gdGhlIHVzZXJsYW5kLlxuICAgIHdvcmtlci5wb3N0TWVzc2FnZShwYXRjaGVzKTtcblxuICAgIC8vIFJlbGVhc2UgYWxsb2NhdGVkIG9iamVjdHMgYmFjayBpbnRvIHRoZSBwb29sLlxuICAgIGNsZWFuTWVtb3J5KCk7XG5cbiAgICAvLyBXaXBlIG91dCB0aGUgcGF0Y2hlcyBpbiBtZW1vcnkuXG4gICAgcGF0Y2hlcy5sZW5ndGggPSAwO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM2R2Y210bGNpOXpiM1Z5WTJVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3pzN096dHhRa0ZoVnl4UFFVRlBPMEZCV0M5Q0xFbEJRVWtzWTBGQll5eERRVUZETzBGQlEyNUNMRWxCUVVrc1UwRkJVeXhEUVVGRE8wRkJRMlFzU1VGQlNTeFJRVUZSTEVOQlFVTTdRVUZEWWl4SlFVRkpMRXRCUVVzc1EwRkJRenM3T3pzN096czdPMEZCVVVzc1UwRkJVeXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzUkRMRTFCUVVrc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU5tTEUxQlFVa3NUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJRenM3UVVGRmFrSXNVVUZCVFN4RFFVRkRMRk5CUVZNc1IwRkJSeXhWUVVGVExFTkJRVU1zUlVGQlJUdEJRVU0zUWl4UlFVRkpMRWxCUVVrc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETzBGQlEyeENMRkZCUVVrc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTTdRVUZEZWtJc1VVRkJTU3hqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTnFReXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPenRCUVVVelFpeFJRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJRMnBFTEZGQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRmJrSXNVMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRPenRCUVVVM1FpeFJRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRhRUlzWVVGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN1MwRkRlRUlzVFVGRFNUdEJRVU5JTEZWQlFVa3NUMEZCVHl4SFFVRkhMR05CUVdNc1EwRkJReXhqUVVGakxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdPenRCUVVkeVJDeGhRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGZEVNc1ZVRkJTU3hQUVVGUExFVkJRVVU3UVVGRFdDeFpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNN08wRkJSWHBDTEdWQlFVOHNSMEZCUnp0QlFVTlNMRzlDUVVGVkxFVkJRVllzVlVGQlZUczdRVUZGVml4dlFrRkJWU3hGUVVGRkxFOUJRVThzUTBGQlF5eFZRVUZWTzBGQlF6bENMR2xDUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVODdRVUZEZUVJc2EwSkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNVVUZCVVR0QlFVTXhRaXh0UWtGQlV5eEZRVUZGTEU5QlFVOHNRMEZCUXl4VFFVRlRPMU5CUXpkQ0xFTkJRVU03VDBGRFNEdExRVU5HT3pzN08wRkJTVVFzV1VGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZET3pzN1FVRkhla01zVlVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3TzBGQlJ6VkNMR1ZCUVZjc1JVRkJSU3hEUVVGRE96czdRVUZIWkN4WFFVRlBMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEhRVU53UWl4RFFVRkRPME5CUTBnaUxDSm1hV3hsSWpvaUwyaHZiV1V2ZEdsdEwyZHBkQzlrYVdabWFIUnRiQzlzYVdJdmQyOXlhMlZ5TDNOdmRYSmpaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJR0oxWm1abGNsUnZVM1J5YVc1bk8xeHVkbUZ5SUhCaGNuTmxTRlJOVER0Y2JuWmhjaUJ6ZVc1alRtOWtaVHRjYm5aaGNpQndiMjlzY3p0Y2JseHVMeW9xWEc0Z0tpQnpkR0Z5ZEhWd1hHNGdLbHh1SUNvZ1FIQmhjbUZ0SUhkdmNtdGxjbHh1SUNvZ1FISmxkSFZ5Ymx4dUlDb3ZYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpQnpkR0Z5ZEhWd0tIZHZjbXRsY2lrZ2UxeHVJQ0IyWVhJZ1ZISmxaWE1nUFNCN2ZUdGNiaUFnZG1GeUlIQmhkR05vWlhNZ1BTQmJYVHRjYmx4dUlDQjNiM0pyWlhJdWIyNXRaWE56WVdkbElEMGdablZ1WTNScGIyNG9aU2tnZTF4dUlDQWdJSFpoY2lCa1lYUmhJRDBnWlM1a1lYUmhPMXh1SUNBZ0lIWmhjaUJ2Wm1aelpYUWdQU0JrWVhSaExtOW1abk5sZER0Y2JpQWdJQ0IyWVhJZ2RISmhibk5tWlhKQ2RXWm1aWElnUFNCa1lYUmhMbUoxWm1abGNqdGNiaUFnSUNCMllYSWdhWE5KYm01bGNpQTlJR1JoZEdFdWFYTkpibTVsY2p0Y2JseHVJQ0FnSUhaaGNpQnZiR1JVY21WbElEMGdWSEpsWlhOYlpTNWtZWFJoTG5WMWFXUmRJSHg4SUdSaGRHRXViMnhrVkhKbFpUdGNiaUFnSUNCMllYSWdibVYzVkhKbFpTQTlJRzUxYkd3N1hHNWNiaUFnSUNCVWNtVmxjMXRsTG1SaGRHRXVkWFZwWkYwZ1BTQnZiR1JVY21WbE8xeHVYRzRnSUNBZ2FXWWdLR1JoZEdFdWJtVjNWSEpsWlNrZ2UxeHVJQ0FnSUNBZ2JtVjNWSEpsWlNBOUlHUmhkR0V1Ym1WM1ZISmxaVHRjYmlBZ0lDQjlYRzRnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0IyWVhJZ2JtVjNTRlJOVENBOUlHSjFabVpsY2xSdlUzUnlhVzVuS0hSeVlXNXpabVZ5UW5WbVptVnlMQ0J2Wm1aelpYUXBPMXh1WEc0Z0lDQWdJQ0F2THlCRFlXeGpkV3hoZEdVZ1lTQnVaWGNnZEhKbFpTNWNiaUFnSUNBZ0lHNWxkMVJ5WldVZ1BTQndZWEp6WlVoVVRVd29ibVYzU0ZSTlRDd2dhWE5KYm01bGNpazdYRzVjYmlBZ0lDQWdJR2xtSUNocGMwbHVibVZ5S1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJqYUdsc1pFNXZaR1Z6SUQwZ2JtVjNWSEpsWlR0Y2JseHVJQ0FnSUNBZ0lDQnVaWGRVY21WbElEMGdlMXh1SUNBZ0lDQWdJQ0FnSUdOb2FXeGtUbTlrWlhNc1hHNWNiaUFnSUNBZ0lDQWdJQ0JoZEhSeWFXSjFkR1Z6T2lCdmJHUlVjbVZsTG1GMGRISnBZblYwWlhNc1hHNGdJQ0FnSUNBZ0lDQWdaV3hsYldWdWREb2diMnhrVkhKbFpTNWxiR1Z0Wlc1MExGeHVJQ0FnSUNBZ0lDQWdJRzV2WkdWT1lXMWxPaUJ2YkdSVWNtVmxMbTV2WkdWT1lXMWxMRnh1SUNBZ0lDQWdJQ0FnSUc1dlpHVldZV3gxWlRvZ2IyeGtWSEpsWlM1dWIyUmxWbUZzZFdWY2JpQWdJQ0FnSUNBZ2ZUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlRlVzVqYUhKdmJtbDZaU0IwYUdVZ2IyeGtJSFpwY25SMVlXd2dkSEpsWlNCM2FYUm9JSFJvWlNCdVpYY2dkbWx5ZEhWaGJDQjBjbVZsTGlBZ1ZHaHBjeUIzYVd4c1hHNGdJQ0FnTHk4Z2NISnZaSFZqWlNCaElITmxjbWxsY3lCdlppQndZWFJqYUdWeklIUm9ZWFFnZDJsc2JDQmlaU0JsZUdOMWRHVmtJSFJ2SUhWd1pHRjBaU0IwYUdVZ1JFOU5MbHh1SUNBZ0lITjVibU5PYjJSbExtTmhiR3dvY0dGMFkyaGxjeXdnYjJ4a1ZISmxaU3dnYm1WM1ZISmxaU2s3WEc1Y2JpQWdJQ0F2THlCVFpXNWtJSFJvWlNCd1lYUmphR1Z6SUdKaFkyc2dkRzhnZEdobElIVnpaWEpzWVc1a0xseHVJQ0FnSUhkdmNtdGxjaTV3YjNOMFRXVnpjMkZuWlNod1lYUmphR1Z6S1R0Y2JseHVJQ0FnSUM4dklGSmxiR1ZoYzJVZ1lXeHNiMk5oZEdWa0lHOWlhbVZqZEhNZ1ltRmpheUJwYm5SdklIUm9aU0J3YjI5c0xseHVJQ0FnSUdOc1pXRnVUV1Z0YjNKNUtDazdYRzVjYmlBZ0lDQXZMeUJYYVhCbElHOTFkQ0IwYUdVZ2NHRjBZMmhsY3lCcGJpQnRaVzF2Y25rdVhHNGdJQ0FnY0dGMFkyaGxjeTVzWlc1bmRHZ2dQU0F3TzF4dUlDQjlPMXh1ZlZ4dUlsMTkiLCJcbnZhciBOYXRpdmVDdXN0b21FdmVudCA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuZnVuY3Rpb24gdXNlTmF0aXZlICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcCA9IG5ldyBOYXRpdmVDdXN0b21FdmVudCgnY2F0JywgeyBkZXRhaWw6IHsgZm9vOiAnYmFyJyB9IH0pO1xuICAgIHJldHVybiAgJ2NhdCcgPT09IHAudHlwZSAmJiAnYmFyJyA9PT0gcC5kZXRhaWwuZm9vO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgYEN1c3RvbUV2ZW50YCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQuQ3VzdG9tRXZlbnRcbiAqXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IE5hdGl2ZUN1c3RvbUV2ZW50IDpcblxuLy8gSUUgPj0gOVxuJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID8gZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfSBlbHNlIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIGU7XG59IDpcblxuLy8gSUUgPD0gOFxuZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gIGUudHlwZSA9IHR5cGU7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmJ1YmJsZXMgPSBCb29sZWFuKHBhcmFtcy5idWJibGVzKTtcbiAgICBlLmNhbmNlbGFibGUgPSBCb29sZWFuKHBhcmFtcy5jYW5jZWxhYmxlKTtcbiAgICBlLmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gIH0gZWxzZSB7XG4gICAgZS5idWJibGVzID0gZmFsc2U7XG4gICAgZS5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgZS5kZXRhaWwgPSB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG4iXX0=
