(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }/**
 * Store all custom elements in this object.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgrade = upgrade;
var components = {};

exports.components = components;
var empty = function empty() {};

/**
 * Ensures the element instance matches the CustomElement's prototype.
 *
 * @param tagName
 * @param element
 * @return {Boolean} successfully upgraded
 */

function upgrade(tagName, element) {
  var CustomElement = components[tagName] || empty;

  // No need to upgrade if already a subclass.
  if (element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  if (CustomElement !== empty) {
    element.__proto__ = Object.create(CustomElement.prototype);
  }

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  return true;
}

;

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/element/custom.js")

},{}],2:[function(require,module,exports){
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

},{"../element/make":3,"../node/make":6}],3:[function(require,module,exports){
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

var _custom = require('./custom');

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
  // Get the custom element constructor for a given element.
  var CustomElement = _custom.components[descriptor.nodeName] || empty;

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

  // Upgrade the element after creating it.
  (0, _custom.upgrade)(descriptor.nodeName, element);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  _nodeMake2['default'].nodes[descriptor.element] = element;

  return element;
}

module.exports = exports['default'];

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/element/make.js")

},{"../node/make":6,"../svg":11,"./custom":1}],4:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/errors.js")

},{}],5:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

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

var _nodePatch = require('./node/patch');

var _transitions = require('./transitions');

var _elementCustom = require('./element/custom');

var _errors = require('./errors');

// Export the custom Error constructors so that instanceof checks can be made
// by those publicly consuming this library.
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
 * cleaning up components when removed in tests and applications.
 *
 * @param element
 */

function release(element) {
  (0, _nodePatch.releaseNode)(element);
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
    normalizedConstructor = function () {};
    normalizedConstructor.prototype = constructor;
  }

  // If the native web component specification is loaded, use that instead.
  if (realRegisterElement) {
    return realRegisterElement.call(document, tagName, normalizedConstructor);
  }

  // If the element has already been registered, raise an error.
  if (tagName in _elementCustom.components) {
    throw new _errors.DOMException('\n      Failed to execute \'registerElement\' on \'Document\': Registration failed\n      for type \'' + tagName + '\'. A type with that name is already registered.\n    ');
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

    value: function value(newElement, options) {
      element(this, newElement, options);
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

  // If HTMLElement is an object, rejigger it to work like a function so that
  // it can be extended. Specifically affects IE and Safari.
  if (typeof Element === 'object' || typeof HTMLElement === 'object') {
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

    HTMLElement = function () {};
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

    // After the initial render, clean up the resources, no point in lingering.
    documentElement.addEventListener('renderComplete', function render() {
      // Release resources allocated to the element.
      documentElement.diffRelease(documentElement);

      // Remove this event listener.
      documentElement.removeEventListener('renderComplete', render);
    });

    // Diff the entire document on activation of the prollyfill.
    documentElement.diffOuterHTML = documentElement.outerHTML;

    // Remove the load event listener, since it's complete.
    window.removeEventListener('load', activateComponents);
  };

  // This section will automatically parse out your entire page to ensure all
  // custom elements are hooked into.
  window.addEventListener('load', activateComponents);

  // If the document has already loaded, immediately activate the components.
  if (document.readyState === 'complete') {
    activateComponents();
  }
}

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/index.js")

},{"./element/custom":1,"./errors":4,"./node/patch":7,"./transitions":12}],6:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = make;

var _utilPools = require('../util/pools');

var _utilMemory = require('../util/memory');

var _elementCustom = require('../element/custom');

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/make.js")

},{"../element/custom":1,"../util/memory":14,"../util/pools":16}],7:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  };var global = (function(){ return this; }).call(null);global.require['custom-event'] = require('custom-event');;var global = (function(){ return this; }).call(null);global.require['custom-event'] = require('custom-event');  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  };var global = (function(){ return this; }).call(null);global.require['custom-event'] = require('custom-event');'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.releaseNode = releaseNode;
exports.patchNode = patchNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _customEvent = require('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _workerCreate = require('../worker/create');

var _utilMemory = require('../util/memory');

var _utilPools = require('../util/pools');

var _utilParser = require('../util/parser');

var _patchesProcess = require('../patches/process');

var _patchesProcess2 = _interopRequireDefault(_patchesProcess);

var _make = require('./make');

var _make2 = _interopRequireDefault(_make);

var _elementMake = require('../element/make');

var _elementMake2 = _interopRequireDefault(_elementMake);

var _elementGet = require('../element/get');

var _elementGet2 = _interopRequireDefault(_elementGet);

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _tree = require('./tree');

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
        var els = nodes.removals.map(function (uuid) {
          return _utilPools.pools.elementObject._uuid[uuid];
        }).map(_utilMemory.unprotectElement).forEach(function (el) {
          console.log(el);
          console.log(el.parentNode);
          var idx = elementMeta.oldTree.childNodes.indexOf(el);
          elementMeta.oldTree.childNodes.splice(idx, 1);
        });
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
      element.dispatchEvent(new _customEvent2['default']('renderComplete'));
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

  // The element meta object is a location to associate metadata with the
  // currently rendering element. This prevents attaching properties to the
  // instance itself.
  var elementMeta = _tree.TreeCache.get(element) || {};

  // Always ensure the most up-to-date meta object is stored.
  _tree.TreeCache.set(element, elementMeta);

  // If this element is already rendering, add this new render request into the
  // buffer queue.
  if (elementMeta.isRendering) {
    return elementMeta.renderBuffer = { newHTML: newHTML, options: options };
  }

  // If the operation is `innerHTML`, but the contents haven't changed.
  var sameInnerHTML = options.inner && element.innerHTML === newHTML;
  // If the operation is `outerHTML`, but the contents haven't changed.
  var sameOuterHTML = !options.inner && element.outerHTML === newHTML;

  // If the contents haven't changed, abort, since there is no point in
  // continuing.
  if ((sameInnerHTML || sameOuterHTML) && elementMeta.oldTree) {
    return;
  }

  // Start with worker being a falsy value.
  var worker = null;

  // If we can use a worker and the user wants one, try and create it.
  if (options.enableWorker && _workerCreate.hasWorker) {
    // Create a worker for this element.
    worker = elementMeta.worker = elementMeta.worker || (0, _workerCreate.create)();
  }

  if (
  // If the operation is `innerHTML`, and the current element's contents have
  // changed since the last render loop, recalculate the tree.
  options.inner && elementMeta._innerHTML !== element.innerHTML ||

  // If the operation is `outerHTML`, and the current element's contents have
  // changed since the last render loop, recalculate the tree.
  !options.inner && elementMeta._outerHTML !== element.outerHTML ||

  // If the text content ever changes, recalculate the tree.
  elementMeta._textContent !== element.textContent ||

  // The last render was done via Worker, but now we're rendering in the UI
  // thread. This is very uncommon, but we need to ensure tree's stay in
  // sync.
  elementMeta.renderedViaWorker === true && !options.enableWorker) {
    if (elementMeta.oldTree) {
      (0, _utilMemory.unprotectElement)(elementMeta.oldTree);
      (0, _utilMemory.cleanMemory)();
    }

    elementMeta.oldTree = (0, _make2['default'])(element, true);
    elementMeta.updateWorkerTree = true;
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && _workerCreate.hasWorker && worker) {
    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;
    elementMeta.renderedViaWorker = true;

    // Attach all properties here to transport.
    var transferObject = {};

    // This should only occur once, or whenever the markup changes externally
    // to diffHTML.
    if (!elementMeta.hasWorkerRendered || elementMeta.updateWorkerTree) {
      transferObject.oldTree = elementMeta.oldTree;
      elementMeta.updateWorkerTree = false;
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
      // Whenever we render in the UI-thread, ensure that the Worker gets a
      // refreshed copy of the `oldTree`.
      elementMeta.updateWorkerTree = true;

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/patch.js")

},{"../element/get":2,"../element/make":3,"../patches/process":10,"../util/memory":14,"../util/parser":15,"../util/pools":16,"../worker/create":18,"./make":6,"./sync":8,"./tree":9,"custom-event":20}],8:[function(require,module,exports){
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
  var textElements = ['script', 'style', 'textarea', '#text'];

  if (!newTree) {
    var removed = oldChildNodes.splice(0, oldChildNodesLength);

    patches[patches.length] = { __do__: -1, element: oldElement };

    for (var i = 0; i < removed.length; i++) {
      // Used by the Worker to track elements removed.
      if (patches.removals) {
        patches.removals.push(removed[i].element);
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
  if (textElements.indexOf(newTree.nodeName) > -1) {
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
        patches.removals.push(oldChildNodes[i].element);
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
        patches.removals.push(removed[i].element);
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/sync.js")

},{"../util/memory":14,"../util/pools":16}],9:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }// Cache prebuilt trees and lookup by element.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TreeCache = new WeakMap();
exports.TreeCache = TreeCache;

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/node/tree.js")

},{}],10:[function(require,module,exports){
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

var _elementCustom = require('../element/custom');

var _nodeMake = require('../node/make');

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

    if (el.nodeName === '#text' || el.nodeName === 'text') {
      // Trigger all the text changed values.
      if (states && states.textChanged && states.textChanged.length) {
        addPromises(states.textChanged.map(function (callback) {
          return callback(element.parentNode || element, null, el.nodeValue);
        }));
      }
    }
    // Added state for transitions API.
    else if (states && states.attached && states.attached.length) {
        addPromises(states.attached.map(callCallback, element));
      }

    // Call all `childNodes` attached callbacks as well.
    el.childNodes.forEach(attachedTransitionAndTitle);

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

    if (elementDescriptor.childNodes) {
      elementDescriptor.childNodes.forEach(attachedCallback, {
        fragment: false
      });
    }

    if (fragment) {
      fragment.appendChild(el);
    }
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

            // Ensure the title is emptied.
            if (patch.old.tagName === 'title') {
              patch.old.ownerDocument.title = '';
            }

            var customElement = _elementCustom.components[oldDescriptor.nodeName] || empty;

            if (customElement.prototype.detachedCallback) {
              customElement.prototype.detachedCallback.call(patch.old);
            }

            patch.old.parentNode.removeChild(patch.old);

            if (states && states.detached && states.detached.length) {
              addPromises(states.detached.map(callCallback, patch.old));
            }

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
              if (states && states.detached && states.detached.length) {
                addPromises(states.detached.map(callCallback, patch.old));
              }

              // Replaced state for transitions API.
              if (states && states.replaced && states.replaced.length) {
                addPromises(states.replaced.map(function (callback) {
                  return callback(patch.old, patch['new']);
                }));
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
              if (states && states.attached && states.attached.length) {
                attachedTransitionAndTitle(newDescriptor);
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
            (function () {
              var originalValue = patch.element.textContent;

              // Changes the text.
              var augmentText = function augmentText() {
                patch.element.textContent = (0, _utilDecode2['default'])(patch.value);
              };

              // Trigger all the text changed values.
              if (states && states.textChanged && states.textChanged.length) {
                addPromises(states.textChanged.map(function (callback) {
                  var promise = callback(patch.element.parentNode || patch.element, originalValue, patch.value);

                  if (promise) {
                    promise.then(augmentText);
                  } else {
                    augmentText();
                  }

                  return promise;
                }));
              } else {
                patch.element.textContent = (0, _utilDecode2['default'])(patch.value);
              }
            })();
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/patches/process.js")

},{"../element/custom":1,"../element/get":2,"../node/make":6,"../transitions":12,"../util/decode":13,"../util/pools":16}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/memory.js")

},{"../node/make":6,"../util/pools":16}],15:[function(require,module,exports){
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

/**
 * makeParser
 *
 * @return
 */

function makeParser() {
  var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;

  var kAttributePattern = /\b(id|class)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  var reAttrPattern = /\b([a-z][a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

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
              currentParent.nodeValue = data.slice(kMarkupPattern.lastIndex, index);
              lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
              match[1] = true;
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

      return root;
    }
  };

  return htmlParser;
}

;

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/parser.js")

},{"./pools":16}],16:[function(require,module,exports){
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
      _protect.push(idx === -1 ? value : allocated.splice(idx, 1)[0]);

      // If we're protecting an element object, push the uuid into a lookup
      // table.
      if (name === 'elementObject') {
        this._uuid[value.element] = value;
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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/util/pools.js")

},{"./uuid":17}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilUuid = require('../util/uuid');

var _utilUuid2 = _interopRequireDefault(_utilUuid);

var _utilPools = require('../util/pools');

var _utilParser = require('../util/parser');

var _utilMemory = require('../util/memory');

var _nodeSync = require('../node/sync');

var _nodeSync2 = _interopRequireDefault(_nodeSync);

var _source = require('./source');

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/worker/create.js")

},{"../node/sync":8,"../util/memory":14,"../util/parser":15,"../util/pools":16,"../util/uuid":17,"./source":19}],19:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/worker/source.js")

},{}],20:[function(require,module,exports){
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

},{}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9lbGVtZW50L2N1c3RvbS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2VsZW1lbnQvZ2V0LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvZWxlbWVudC9tYWtlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvZXJyb3JzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvaW5kZXguanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9ub2RlL21ha2UuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9ub2RlL3BhdGNoLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9zeW5jLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS90cmVlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvcGF0Y2hlcy9wcm9jZXNzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvc3ZnLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdHJhbnNpdGlvbnMuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL2RlY29kZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3V0aWwvbWVtb3J5LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9wYXJzZXIuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL3Bvb2xzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC91dWlkLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvd29ya2VyL2NyZWF0ZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3dvcmtlci9zb3VyY2UuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL25vZGVfbW9kdWxlcy9jdXN0b20tZXZlbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDeFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogU3RvcmUgYWxsIGN1c3RvbSBlbGVtZW50cyBpbiB0aGlzIG9iamVjdC5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnVwZ3JhZGUgPSB1cGdyYWRlO1xudmFyIGNvbXBvbmVudHMgPSB7fTtcblxuZXhwb3J0cy5jb21wb25lbnRzID0gY29tcG9uZW50cztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uIGVtcHR5KCkge307XG5cbi8qKlxuICogRW5zdXJlcyB0aGUgZWxlbWVudCBpbnN0YW5jZSBtYXRjaGVzIHRoZSBDdXN0b21FbGVtZW50J3MgcHJvdG90eXBlLlxuICpcbiAqIEBwYXJhbSB0YWdOYW1lXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc2Z1bGx5IHVwZ3JhZGVkXG4gKi9cblxuZnVuY3Rpb24gdXBncmFkZSh0YWdOYW1lLCBlbGVtZW50KSB7XG4gIHZhciBDdXN0b21FbGVtZW50ID0gY29tcG9uZW50c1t0YWdOYW1lXSB8fCBlbXB0eTtcblxuICAvLyBObyBuZWVkIHRvIHVwZ3JhZGUgaWYgYWxyZWFkeSBhIHN1YmNsYXNzLlxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBDb3B5IHRoZSBwcm90b3R5cGUgaW50byB0aGUgRWxlbWVudC5cbiAgaWYgKEN1c3RvbUVsZW1lbnQgIT09IGVtcHR5KSB7XG4gICAgZWxlbWVudC5fX3Byb3RvX18gPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVsZW1lbnQucHJvdG90eXBlKTtcbiAgfVxuXG4gIC8vIEN1c3RvbSBlbGVtZW50cyBoYXZlIGEgY3JlYXRlZENhbGxiYWNrIG1ldGhvZCB0aGF0IHNob3VsZCBiZSBjYWxsZWQuXG4gIGlmIChDdXN0b21FbGVtZW50LnByb3RvdHlwZS5jcmVhdGVkQ2FsbGJhY2spIHtcbiAgICBDdXN0b21FbGVtZW50LnByb3RvdHlwZS5jcmVhdGVkQ2FsbGJhY2suY2FsbChlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2WTNWemRHOXRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenRCUVVkUExFbEJRVWtzVlVGQlZTeEhRVUZITEVWQlFVVXNRMEZCUXpzN08wRkJSVE5DTEVsQlFVa3NTMEZCU3l4SFFVRkhMRk5CUVZJc1MwRkJTeXhIUVVGakxFVkJRVVVzUTBGQlF6czdPenM3T3pzN096dEJRVk51UWl4VFFVRlRMRTlCUVU4c1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlEzaERMRTFCUVVrc1lVRkJZU3hIUVVGSExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4TFFVRkxMRU5CUVVNN096dEJRVWRxUkN4TlFVRkpMRTlCUVU4c1dVRkJXU3hoUVVGaExFVkJRVVU3UVVGRGNFTXNWMEZCVHl4TFFVRkxMRU5CUVVNN1IwRkRaRHM3TzBGQlIwUXNUVUZCU1N4aFFVRmhMRXRCUVVzc1MwRkJTeXhGUVVGRk8wRkJRek5DTEZkQlFVOHNRMEZCUXl4VFFVRlRMRWRCUVVjc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1IwRkROVVE3T3p0QlFVZEVMRTFCUVVrc1lVRkJZU3hEUVVGRExGTkJRVk1zUTBGQlF5eGxRVUZsTEVWQlFVVTdRVUZETTBNc2FVSkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNaVUZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEhRVU4yUkRzN1FVRkZSQ3hUUVVGUExFbEJRVWtzUTBGQlF6dERRVU5pT3p0QlFVRkJMRU5CUVVNaUxDSm1hV3hsSWpvaUwyaHZiV1V2ZEdsdEwyZHBkQzlrYVdabWFIUnRiQzlzYVdJdlpXeGxiV1Z1ZEM5amRYTjBiMjB1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlGTjBiM0psSUdGc2JDQmpkWE4wYjIwZ1pXeGxiV1Z1ZEhNZ2FXNGdkR2hwY3lCdlltcGxZM1F1WEc0Z0tpOWNibVY0Y0c5eWRDQjJZWElnWTI5dGNHOXVaVzUwY3lBOUlIdDlPMXh1WEc1MllYSWdaVzF3ZEhrZ1BTQm1kVzVqZEdsdmJpZ3BJSHQ5TzF4dVhHNHZLaXBjYmlBcUlFVnVjM1Z5WlhNZ2RHaGxJR1ZzWlcxbGJuUWdhVzV6ZEdGdVkyVWdiV0YwWTJobGN5QjBhR1VnUTNWemRHOXRSV3hsYldWdWRDZHpJSEJ5YjNSdmRIbHdaUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdkR0ZuVG1GdFpWeHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCeVpYUjFjbTRnZTBKdmIyeGxZVzU5SUhOMVkyTmxjM05tZFd4c2VTQjFjR2R5WVdSbFpGeHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnZFhCbmNtRmtaU2gwWVdkT1lXMWxMQ0JsYkdWdFpXNTBLU0I3WEc0Z0lIWmhjaUJEZFhOMGIyMUZiR1Z0Wlc1MElEMGdZMjl0Y0c5dVpXNTBjMXQwWVdkT1lXMWxYU0I4ZkNCbGJYQjBlVHRjYmx4dUlDQXZMeUJPYnlCdVpXVmtJSFJ2SUhWd1ozSmhaR1VnYVdZZ1lXeHlaV0ZrZVNCaElITjFZbU5zWVhOekxseHVJQ0JwWmlBb1pXeGxiV1Z1ZENCcGJuTjBZVzVqWlc5bUlFTjFjM1J2YlVWc1pXMWxiblFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dUlDQXZMeUJEYjNCNUlIUm9aU0J3Y205MGIzUjVjR1VnYVc1MGJ5QjBhR1VnUld4bGJXVnVkQzVjYmlBZ2FXWWdLRU4xYzNSdmJVVnNaVzFsYm5RZ0lUMDlJR1Z0Y0hSNUtTQjdYRzRnSUNBZ1pXeGxiV1Z1ZEM1ZlgzQnliM1J2WDE4Z1BTQlBZbXBsWTNRdVkzSmxZWFJsS0VOMWMzUnZiVVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxLVHRjYmlBZ2ZWeHVYRzRnSUM4dklFTjFjM1J2YlNCbGJHVnRaVzUwY3lCb1lYWmxJR0VnWTNKbFlYUmxaRU5oYkd4aVlXTnJJRzFsZEdodlpDQjBhR0YwSUhOb2IzVnNaQ0JpWlNCallXeHNaV1F1WEc0Z0lHbG1JQ2hEZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWpjbVZoZEdWa1EyRnNiR0poWTJzcElIdGNiaUFnSUNCRGRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVmtRMkZzYkdKaFkyc3VZMkZzYkNobGJHVnRaVzUwS1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCMGNuVmxPMXh1ZlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdldDtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX25vZGVNYWtlID0gcmVxdWlyZSgnLi4vbm9kZS9tYWtlJyk7XG5cbnZhciBfbm9kZU1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZU1ha2UpO1xuXG52YXIgX2VsZW1lbnRNYWtlID0gcmVxdWlyZSgnLi4vZWxlbWVudC9tYWtlJyk7XG5cbnZhciBfZWxlbWVudE1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudE1ha2UpO1xuXG4vKipcbiAqIFRha2VzIGluIGFuIGVsZW1lbnQgcmVmZXJlbmNlIGFuZCByZXNvbHZlIGl0IHRvIGEgdXVpZCBhbmQgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIHJlZiAtIEVsZW1lbnQgZGVzY3JpcHRvclxuICogQHJldHVybiB7T2JqZWN0fSBjb250YWluaW5nIHRoZSB1dWlkIGFuZCBET00gbm9kZS5cbiAqL1xuXG5mdW5jdGlvbiBnZXQocmVmKSB7XG4gIHZhciB1dWlkID0gcmVmLmVsZW1lbnQgfHwgcmVmO1xuICB2YXIgZWxlbWVudCA9IF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1t1dWlkXSB8fCAoMCwgX2VsZW1lbnRNYWtlMlsnZGVmYXVsdCddKShyZWYpO1xuXG4gIHJldHVybiB7IGVsZW1lbnQ6IGVsZW1lbnQsIHV1aWQ6IHV1aWQgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2WjJWMExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzNGQ1FWTjNRaXhIUVVGSE96czdPM2RDUVZST0xHTkJRV003T3pzN01rSkJRMWdzYVVKQlFXbENPenM3T3pzN096czdPenRCUVZFeFFpeFRRVUZUTEVkQlFVY3NRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRMMElzVFVGQlNTeEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRTlCUVU4c1NVRkJTU3hIUVVGSExFTkJRVU03UVVGRE9VSXNUVUZCU1N4UFFVRlBMRWRCUVVjc2MwSkJRVk1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRGhDUVVGWkxFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVjJSQ3hUUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZRTEU5QlFVOHNSVUZCUlN4SlFVRkpMRVZCUVVvc1NVRkJTU3hGUVVGRkxFTkJRVU03UTBGRE1VSWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZaV3hsYldWdWRDOW5aWFF1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ2JXRnJaVTV2WkdVZ1puSnZiU0FuTGk0dmJtOWtaUzl0WVd0bEp6dGNibWx0Y0c5eWRDQnRZV3RsUld4bGJXVnVkQ0JtY205dElDY3VMaTlsYkdWdFpXNTBMMjFoYTJVbk8xeHVYRzR2S2lwY2JpQXFJRlJoYTJWeklHbHVJR0Z1SUdWc1pXMWxiblFnY21WbVpYSmxibU5sSUdGdVpDQnlaWE52YkhabElHbDBJSFJ2SUdFZ2RYVnBaQ0JoYm1RZ1JFOU5JRzV2WkdVdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUhKbFppQXRJRVZzWlcxbGJuUWdaR1Z6WTNKcGNIUnZjbHh1SUNvZ1FISmxkSFZ5YmlCN1QySnFaV04wZlNCamIyNTBZV2x1YVc1bklIUm9aU0IxZFdsa0lHRnVaQ0JFVDAwZ2JtOWtaUzVjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z1oyVjBLSEpsWmlrZ2UxeHVJQ0JzWlhRZ2RYVnBaQ0E5SUhKbFppNWxiR1Z0Wlc1MElIeDhJSEpsWmp0Y2JpQWdiR1YwSUdWc1pXMWxiblFnUFNCdFlXdGxUbTlrWlM1dWIyUmxjMXQxZFdsa1hTQjhmQ0J0WVd0bFJXeGxiV1Z1ZENoeVpXWXBPMXh1WEc0Z0lISmxkSFZ5YmlCN0lHVnNaVzFsYm5Rc0lIVjFhV1FnZlR0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYWtlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmpbJ2RlZmF1bHQnXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbnZhciBfc3ZnID0gcmVxdWlyZSgnLi4vc3ZnJyk7XG5cbnZhciBzdmcgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfc3ZnKTtcblxudmFyIF9ub2RlTWFrZSA9IHJlcXVpcmUoJy4uL25vZGUvbWFrZScpO1xuXG52YXIgX25vZGVNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVNYWtlKTtcblxudmFyIF9jdXN0b20gPSByZXF1aXJlKCcuL2N1c3RvbScpO1xuXG52YXIgZW1wdHkgPSB7IHByb3RvdHlwZToge30gfTtcblxuLyoqXG4gKiBUYWtlcyBpbiBhIHZpcnR1YWwgZGVzY3JpcHRvciBhbmQgY3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQuIFNldCdzIHRoZSBlbGVtZW50XG4gKiBpbnRvIHRoZSBjYWNoZS5cbiAqXG4gKiBAcGFyYW0gZGVzY3JpcHRvclxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlKGRlc2NyaXB0b3IpIHtcbiAgdmFyIGVsZW1lbnQgPSBudWxsO1xuICB2YXIgaXNTdmcgPSBmYWxzZTtcbiAgLy8gR2V0IHRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvciBmb3IgYSBnaXZlbiBlbGVtZW50LlxuICB2YXIgQ3VzdG9tRWxlbWVudCA9IF9jdXN0b20uY29tcG9uZW50c1tkZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICBpZiAoX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW2Rlc2NyaXB0b3IuZWxlbWVudF0pIHtcbiAgICByZXR1cm4gX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW2Rlc2NyaXB0b3IuZWxlbWVudF07XG4gIH1cblxuICBpZiAoZGVzY3JpcHRvci5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkZXNjcmlwdG9yLm5vZGVWYWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHN2Zy5lbGVtZW50cy5pbmRleE9mKGRlc2NyaXB0b3Iubm9kZU5hbWUpID4gLTEpIHtcbiAgICAgIGlzU3ZnID0gdHJ1ZTtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnLm5hbWVzcGFjZSwgZGVzY3JpcHRvci5ub2RlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRlc2NyaXB0b3Iubm9kZU5hbWUpO1xuICAgIH1cblxuICAgIGlmIChkZXNjcmlwdG9yLmF0dHJpYnV0ZXMgJiYgZGVzY3JpcHRvci5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXNjcmlwdG9yLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IGRlc2NyaXB0b3IuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0b3IuY2hpbGROb2RlcyAmJiBkZXNjcmlwdG9yLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlc2NyaXB0b3IuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG1ha2UoZGVzY3JpcHRvci5jaGlsZE5vZGVzW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWx3YXlzIHNldCB0aGUgbm9kZSdzIHZhbHVlLlxuICBpZiAoZGVzY3JpcHRvci5ub2RlVmFsdWUpIHtcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gZGVzY3JpcHRvci5ub2RlVmFsdWU7XG4gIH1cblxuICAvLyBVcGdyYWRlIHRoZSBlbGVtZW50IGFmdGVyIGNyZWF0aW5nIGl0LlxuICAoMCwgX2N1c3RvbS51cGdyYWRlKShkZXNjcmlwdG9yLm5vZGVOYW1lLCBlbGVtZW50KTtcblxuICAvLyBDdXN0b20gZWxlbWVudHMgaGF2ZSBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QgdGhhdCBzaG91bGQgYmUgY2FsbGVkLlxuICBpZiAoQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlZENhbGxiYWNrKSB7XG4gICAgQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlZENhbGxiYWNrLmNhbGwoZWxlbWVudCk7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIG5vZGVzIGNhY2hlIHVzaW5nIHRoZSBkZXNpZ25hdGVkIHV1aWQgYXMgdGhlIGxvb2t1cCBrZXkuXG4gIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tkZXNjcmlwdG9yLmVsZW1lbnRdID0gZWxlbWVudDtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2YldGclpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRmhkMElzU1VGQlNUczdPenM3TzIxQ1FXSlFMRkZCUVZFN08wbEJRV3BDTEVkQlFVYzdPM2RDUVVOTkxHTkJRV003T3pzN2MwSkJRME1zVlVGQlZUczdRVUZGT1VNc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeFRRVUZUTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN096czdPenM3T3pzN1FVRlRaaXhUUVVGVExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVTdRVUZEZGtNc1RVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyNUNMRTFCUVVrc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6czdRVUZGYkVJc1RVRkJTU3hoUVVGaExFZEJRVWNzYlVKQlFWY3NWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6czdRVUZGTjBRc1RVRkJTU3h6UWtGQlV5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8wRkJRM1JETEZkQlFVOHNjMEpCUVZNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SFFVTXpRenM3UVVGRlJDeE5RVUZKTEZWQlFWVXNRMEZCUXl4UlFVRlJMRXRCUVVzc1QwRkJUeXhGUVVGRk8wRkJRMjVETEZkQlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNc1kwRkJZeXhEUVVGRExGVkJRVlVzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTjZSQ3hOUVVOSk8wRkJRMGdzVVVGQlNTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRVZCUVVVN1FVRkRiRVFzVjBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTmlMR0ZCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1zWlVGQlpTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzB0QlEzaEZMRTFCUTBrN1FVRkRTQ3hoUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UzBGRGRrUTdPMEZCUlVRc1VVRkJTU3hWUVVGVkxFTkJRVU1zVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM3BFTEZkQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU55UkN4WlFVRkpMRk5CUVZNc1IwRkJSeXhWUVVGVkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNwRExHVkJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdUMEZEZGtRN1MwRkRSanM3UVVGRlJDeFJRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRWxCUVVrc1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEZWtRc1YwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNKRUxHVkJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTNKRU8wdEJRMFk3UjBGRFJqczdPMEZCUjBRc1RVRkJTU3hWUVVGVkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEzaENMRmRCUVU4c1EwRkJReXhYUVVGWExFZEJRVWNzVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXp0SFFVTTFRenM3TzBGQlIwUXNkVUpCUVZFc1ZVRkJWU3hEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXpzN08wRkJSM1JETEUxQlFVa3NZVUZCWVN4RFFVRkRMRk5CUVZNc1EwRkJReXhsUVVGbExFVkJRVVU3UVVGRE0wTXNhVUpCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zWlVGQlpTeERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRIUVVOMlJEczdPMEZCUjBRc2QwSkJRVk1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU03TzBGQlJUZERMRk5CUVU4c1QwRkJUeXhEUVVGRE8wTkJRMmhDSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2YldGclpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0FxSUdGeklITjJaeUJtY205dElDY3VMaTl6ZG1jbk8xeHVhVzF3YjNKMElHMWhhMlZPYjJSbElHWnliMjBnSnk0dUwyNXZaR1V2YldGclpTYzdYRzVwYlhCdmNuUWdleUJqYjIxd2IyNWxiblJ6TENCMWNHZHlZV1JsSUgwZ1puSnZiU0FuTGk5amRYTjBiMjBuTzF4dVhHNTJZWElnWlcxd2RIa2dQU0I3SUhCeWIzUnZkSGx3WlRvZ2UzMGdmVHRjYmx4dUx5b3FYRzRnS2lCVVlXdGxjeUJwYmlCaElIWnBjblIxWVd3Z1pHVnpZM0pwY0hSdmNpQmhibVFnWTNKbFlYUmxjeUJoYmlCSVZFMU1JR1ZzWlcxbGJuUXVJRk5sZENkeklIUm9aU0JsYkdWdFpXNTBYRzRnS2lCcGJuUnZJSFJvWlNCallXTm9aUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdaR1Z6WTNKcGNIUnZjbHh1SUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2JpQXFMMXh1Wlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNGdiV0ZyWlNoa1pYTmpjbWx3ZEc5eUtTQjdYRzRnSUhaaGNpQmxiR1Z0Wlc1MElEMGdiblZzYkR0Y2JpQWdkbUZ5SUdselUzWm5JRDBnWm1Gc2MyVTdYRzRnSUM4dklFZGxkQ0IwYUdVZ1kzVnpkRzl0SUdWc1pXMWxiblFnWTI5dWMzUnlkV04wYjNJZ1ptOXlJR0VnWjJsMlpXNGdaV3hsYldWdWRDNWNiaUFnZG1GeUlFTjFjM1J2YlVWc1pXMWxiblFnUFNCamIyMXdiMjVsYm5SelcyUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1WEc0Z0lHbG1JQ2h0WVd0bFRtOWtaUzV1YjJSbGMxdGtaWE5qY21sd2RHOXlMbVZzWlcxbGJuUmRLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHMWhhMlZPYjJSbExtNXZaR1Z6VzJSbGMyTnlhWEIwYjNJdVpXeGxiV1Z1ZEYwN1hHNGdJSDFjYmx4dUlDQnBaaUFvWkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlNBOVBUMGdKeU4wWlhoMEp5a2dlMXh1SUNBZ0lHVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWVVpYaDBUbTlrWlNoa1pYTmpjbWx3ZEc5eUxtNXZaR1ZXWVd4MVpTazdYRzRnSUgxY2JpQWdaV3h6WlNCN1hHNGdJQ0FnYVdZZ0tITjJaeTVsYkdWdFpXNTBjeTVwYm1SbGVFOW1LR1JsYzJOeWFYQjBiM0l1Ym05a1pVNWhiV1VwSUQ0Z0xURXBJSHRjYmlBZ0lDQWdJR2x6VTNabklEMGdkSEoxWlR0Y2JpQWdJQ0FnSUdWc1pXMWxiblFnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBUbE1vYzNabkxtNWhiV1Z6Y0dGalpTd2daR1Z6WTNKcGNIUnZjaTV1YjJSbFRtRnRaU2s3WEc0Z0lDQWdmVnh1SUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9aR1Z6WTNKcGNIUnZjaTV1YjJSbFRtRnRaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dSbGMyTnlhWEIwYjNJdVlYUjBjbWxpZFhSbGN5QW1KaUJrWlhOamNtbHdkRzl5TG1GMGRISnBZblYwWlhNdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElHUmxjMk55YVhCMGIzSXVZWFIwY21saWRYUmxjeTVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQnNaWFFnWVhSMGNtbGlkWFJsSUQwZ1pHVnpZM0pwY0hSdmNpNWhkSFJ5YVdKMWRHVnpXMmxkTzF4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTaGhkSFJ5YVdKMWRHVXVibUZ0WlN3Z1lYUjBjbWxpZFhSbExuWmhiSFZsS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb1pHVnpZM0pwY0hSdmNpNWphR2xzWkU1dlpHVnpJQ1ltSUdSbGMyTnlhWEIwYjNJdVkyaHBiR1JPYjJSbGN5NXNaVzVuZEdncElIdGNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2daR1Z6WTNKcGNIUnZjaTVqYUdsc1pFNXZaR1Z6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQWdJR1ZzWlcxbGJuUXVZWEJ3Wlc1a1EyaHBiR1FvYldGclpTaGtaWE5qY21sd2RHOXlMbU5vYVd4a1RtOWtaWE5iYVYwcEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZMeUJCYkhkaGVYTWdjMlYwSUhSb1pTQnViMlJsSjNNZ2RtRnNkV1V1WEc0Z0lHbG1JQ2hrWlhOamNtbHdkRzl5TG01dlpHVldZV3gxWlNrZ2UxeHVJQ0FnSUdWc1pXMWxiblF1ZEdWNGRFTnZiblJsYm5RZ1BTQmtaWE5qY21sd2RHOXlMbTV2WkdWV1lXeDFaVHRjYmlBZ2ZWeHVYRzRnSUM4dklGVndaM0poWkdVZ2RHaGxJR1ZzWlcxbGJuUWdZV1owWlhJZ1kzSmxZWFJwYm1jZ2FYUXVYRzRnSUhWd1ozSmhaR1VvWkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlN3Z1pXeGxiV1Z1ZENrN1hHNWNiaUFnTHk4Z1EzVnpkRzl0SUdWc1pXMWxiblJ6SUdoaGRtVWdZU0JqY21WaGRHVmtRMkZzYkdKaFkyc2diV1YwYUc5a0lIUm9ZWFFnYzJodmRXeGtJR0psSUdOaGJHeGxaQzVjYmlBZ2FXWWdLRU4xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtTnlaV0YwWldSRFlXeHNZbUZqYXlrZ2UxeHVJQ0FnSUVOMWMzUnZiVVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxMbU55WldGMFpXUkRZV3hzWW1GamF5NWpZV3hzS0dWc1pXMWxiblFwTzF4dUlDQjlYRzVjYmlBZ0x5OGdRV1JrSUhSdklIUm9aU0J1YjJSbGN5QmpZV05vWlNCMWMybHVaeUIwYUdVZ1pHVnphV2R1WVhSbFpDQjFkV2xrSUdGeklIUm9aU0JzYjI5cmRYQWdhMlY1TGx4dUlDQnRZV3RsVG05a1pTNXViMlJsYzF0a1pYTmpjbWx3ZEc5eUxtVnNaVzFsYm5SZElEMGdaV3hsYldWdWREdGNibHh1SUNCeVpYUjFjbTRnWld4bGJXVnVkRHRjYm4xY2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7IHZhciBfYWdhaW4gPSB0cnVlOyBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHsgdmFyIG9iamVjdCA9IF94LCBwcm9wZXJ0eSA9IF94MiwgcmVjZWl2ZXIgPSBfeDM7IGRlc2MgPSBwYXJlbnQgPSBnZXR0ZXIgPSB1bmRlZmluZWQ7IF9hZ2FpbiA9IGZhbHNlOyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3ggPSBwYXJlbnQ7IF94MiA9IHByb3BlcnR5OyBfeDMgPSByZWNlaXZlcjsgX2FnYWluID0gdHJ1ZTsgY29udGludWUgX2Z1bmN0aW9uOyB9IH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfSB9O1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIG1pc3NpbmdTdGFja1RyYWNlID0gJ0Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZXJyb3Igc3RhY2sgdHJhY2VzLic7XG5cbi8qKlxuICogSWRlbnRpZmllcyBhbiBlcnJvciB3aXRoIHRyYW5zaXRpb25zLlxuICovXG5cbnZhciBUcmFuc2l0aW9uU3RhdGVFcnJvciA9IChmdW5jdGlvbiAoX0Vycm9yKSB7XG4gIF9pbmhlcml0cyhUcmFuc2l0aW9uU3RhdGVFcnJvciwgX0Vycm9yKTtcblxuICBmdW5jdGlvbiBUcmFuc2l0aW9uU3RhdGVFcnJvcihtZXNzYWdlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYW5zaXRpb25TdGF0ZUVycm9yKTtcblxuICAgIHZhciBlcnJvciA9IF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zaXRpb25TdGF0ZUVycm9yLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBtaXNzaW5nU3RhY2tUcmFjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIGFuIGVycm9yIHdpdGggcmVnaXN0ZXJpbmcgYW4gZWxlbWVudC5cbiAgICovXG4gIHJldHVybiBUcmFuc2l0aW9uU3RhdGVFcnJvcjtcbn0pKEVycm9yKTtcblxuZXhwb3J0cy5UcmFuc2l0aW9uU3RhdGVFcnJvciA9IFRyYW5zaXRpb25TdGF0ZUVycm9yO1xuXG52YXIgRE9NRXhjZXB0aW9uID0gKGZ1bmN0aW9uIChfRXJyb3IyKSB7XG4gIF9pbmhlcml0cyhET01FeGNlcHRpb24sIF9FcnJvcjIpO1xuXG4gIGZ1bmN0aW9uIERPTUV4Y2VwdGlvbihtZXNzYWdlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERPTUV4Y2VwdGlvbik7XG5cbiAgICB2YXIgZXJyb3IgPSBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihET01FeGNlcHRpb24ucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMubWVzc2FnZSA9ICdVbmNhdWdodCBET01FeGNlcHRpb246ICcgKyBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBtaXNzaW5nU3RhY2tUcmFjZTtcbiAgfVxuXG4gIHJldHVybiBET01FeGNlcHRpb247XG59KShFcnJvcik7XG5cbmV4cG9ydHMuRE9NRXhjZXB0aW9uID0gRE9NRXhjZXB0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyVnljbTl5Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZCUVN4SlFVRkpMR2xDUVVGcFFpeEhRVUZITERoRFFVRTRReXhEUVVGRE96czdPenM3U1VGTE1VUXNiMEpCUVc5Q08xbEJRWEJDTEc5Q1FVRnZRanM3UVVGRGNFSXNWMEZFUVN4dlFrRkJiMElzUTBGRGJrSXNUMEZCVHl4RlFVRkZPekJDUVVSV0xHOUNRVUZ2UWpzN1FVRkZOMElzVVVGQlNTeExRVUZMTERoQ1FVWkJMRzlDUVVGdlFpdzBRMEZGVml4RFFVRkRPenRCUVVWd1FpeFJRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenRCUVVOMlFpeFJRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhMUVVGTExFbEJRVWtzYVVKQlFXbENMRU5CUVVNN1IwRkRMME03T3pzN08xTkJUbFVzYjBKQlFXOUNPMGRCUVZNc1MwRkJTenM3T3p0SlFWbHNReXhaUVVGWk8xbEJRVm9zV1VGQldUczdRVUZEV2l4WFFVUkJMRmxCUVZrc1EwRkRXQ3hQUVVGUExFVkJRVVU3TUVKQlJGWXNXVUZCV1RzN1FVRkZja0lzVVVGQlNTeExRVUZMTERoQ1FVWkJMRmxCUVZrc05FTkJSVVlzUTBGQlF6czdRVUZGY0VJc1VVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eDVRa0ZCZVVJc1IwRkJSeXhQUVVGUExFTkJRVU03UVVGRGJrUXNVVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eEpRVUZKTEdsQ1FVRnBRaXhEUVVGRE8wZEJReTlET3p0VFFVNVZMRmxCUVZrN1IwRkJVeXhMUVVGTElpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyVnljbTl5Y3k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCdGFYTnphVzVuVTNSaFkydFVjbUZqWlNBOUlDZENjbTkzYzJWeUlHUnZaWE51WEZ3bmRDQnpkWEJ3YjNKMElHVnljbTl5SUhOMFlXTnJJSFJ5WVdObGN5NG5PMXh1WEc0dktpcGNiaUFxSUVsa1pXNTBhV1pwWlhNZ1lXNGdaWEp5YjNJZ2QybDBhQ0IwY21GdWMybDBhVzl1Y3k1Y2JpQXFMMXh1Wlhod2IzSjBJR05zWVhOeklGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlJR1Y0ZEdWdVpITWdSWEp5YjNJZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2lodFpYTnpZV2RsS1NCN1hHNGdJQ0FnYkdWMElHVnljbTl5SUQwZ2MzVndaWElvS1R0Y2JseHVJQ0FnSUhSb2FYTXViV1Z6YzJGblpTQTlJRzFsYzNOaFoyVTdYRzRnSUNBZ2RHaHBjeTV6ZEdGamF5QTlJR1Z5Y205eUxuTjBZV05ySUh4OElHMXBjM05wYm1kVGRHRmphMVJ5WVdObE8xeHVJQ0I5WEc1OVhHNWNiaThxS2x4dUlDb2dTV1JsYm5ScFptbGxjeUJoYmlCbGNuSnZjaUIzYVhSb0lISmxaMmx6ZEdWeWFXNW5JR0Z1SUdWc1pXMWxiblF1WEc0Z0tpOWNibVY0Y0c5eWRDQmpiR0Z6Y3lCRVQwMUZlR05sY0hScGIyNGdaWGgwWlc1a2N5QkZjbkp2Y2lCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0cxbGMzTmhaMlVwSUh0Y2JpQWdJQ0JzWlhRZ1pYSnliM0lnUFNCemRYQmxjaWdwTzF4dVhHNGdJQ0FnZEdocGN5NXRaWE56WVdkbElEMGdKMVZ1WTJGMVoyaDBJRVJQVFVWNFkyVndkR2x2YmpvZ0p5QXJJRzFsYzNOaFoyVTdYRzRnSUNBZ2RHaHBjeTV6ZEdGamF5QTlJR1Z5Y205eUxuTjBZV05ySUh4OElHMXBjM05wYm1kVGRHRmphMVJ5WVdObE8xeHVJQ0I5WEc1OVhHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMub3V0ZXJIVE1MID0gb3V0ZXJIVE1MO1xuZXhwb3J0cy5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG5leHBvcnRzLmVsZW1lbnQgPSBlbGVtZW50O1xuZXhwb3J0cy5yZWxlYXNlID0gcmVsZWFzZTtcbmV4cG9ydHMucmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJFbGVtZW50O1xuZXhwb3J0cy5hZGRUcmFuc2l0aW9uU3RhdGUgPSBhZGRUcmFuc2l0aW9uU3RhdGU7XG5leHBvcnRzLnJlbW92ZVRyYW5zaXRpb25TdGF0ZSA9IHJlbW92ZVRyYW5zaXRpb25TdGF0ZTtcbmV4cG9ydHMuZW5hYmxlUHJvbGx5ZmlsbCA9IGVuYWJsZVByb2xseWZpbGw7XG5cbnZhciBfbm9kZVBhdGNoID0gcmVxdWlyZSgnLi9ub2RlL3BhdGNoJyk7XG5cbnZhciBfdHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuL3RyYW5zaXRpb25zJyk7XG5cbnZhciBfZWxlbWVudEN1c3RvbSA9IHJlcXVpcmUoJy4vZWxlbWVudC9jdXN0b20nKTtcblxudmFyIF9lcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG4vLyBFeHBvcnQgdGhlIGN1c3RvbSBFcnJvciBjb25zdHJ1Y3RvcnMgc28gdGhhdCBpbnN0YW5jZW9mIGNoZWNrcyBjYW4gYmUgbWFkZVxuLy8gYnkgdGhvc2UgcHVibGljbHkgY29uc3VtaW5nIHRoaXMgbGlicmFyeS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVHJhbnNpdGlvblN0YXRlRXJyb3InLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnRE9NRXhjZXB0aW9uJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2Vycm9ycy5ET01FeGNlcHRpb247XG4gIH1cbn0pO1xuXG4vKipcbiAqIFVzZWQgdG8gZGlmZiB0aGUgb3V0ZXJIVE1MIGNvbnRlbnRzIG9mIHRoZSBwYXNzZWQgZWxlbWVudCB3aXRoIHRoZSBtYXJrdXBcbiAqIGNvbnRlbnRzLiAgVmVyeSB1c2VmdWwgZm9yIGFwcGx5aW5nIGEgZ2xvYmFsIGRpZmYgb24gdGhlXG4gKiBgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50YC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG1hcmt1cD0nJ1xuICogQHBhcmFtIG9wdGlvbnM9e31cbiAqL1xuXG5mdW5jdGlvbiBvdXRlckhUTUwoZWxlbWVudCkge1xuICB2YXIgbWFya3VwID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gJycgOiBhcmd1bWVudHNbMV07XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgb3B0aW9ucy5pbm5lciA9IGZhbHNlO1xuICAoMCwgX25vZGVQYXRjaC5wYXRjaE5vZGUpKGVsZW1lbnQsIG1hcmt1cCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogVXNlZCB0byBkaWZmIHRoZSBpbm5lckhUTUwgY29udGVudHMgb2YgdGhlIHBhc3NlZCBlbGVtZW50IHdpdGggdGhlIG1hcmt1cFxuICogY29udGVudHMuICBUaGlzIGlzIHVzZWZ1bCB3aXRoIGxpYnJhcmllcyBsaWtlIEJhY2tib25lIHRoYXQgcmVuZGVyIFZpZXdzXG4gKiBpbnRvIGVsZW1lbnQgY29udGFpbmVyLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbWFya3VwPScnXG4gKiBAcGFyYW0gb3B0aW9ucz17fVxuICovXG5cbmZ1bmN0aW9uIGlubmVySFRNTChlbGVtZW50KSB7XG4gIHZhciBtYXJrdXAgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1sxXTtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1syXTtcblxuICBvcHRpb25zLmlubmVyID0gdHJ1ZTtcbiAgKDAsIF9ub2RlUGF0Y2gucGF0Y2hOb2RlKShlbGVtZW50LCBtYXJrdXAsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gZGlmZiB0d28gZWxlbWVudHMuICBUaGUgYGlubmVyYCBCb29sZWFuIHByb3BlcnR5IGNhbiBiZSBzcGVjaWZpZWQgaW5cbiAqIHRoZSBvcHRpb25zIHRvIHNldCBpbm5lckhUTUxcXG91dGVySFRNTCBiZWhhdmlvci4gIEJ5IGRlZmF1bHQgaXQgaXNcbiAqIG91dGVySFRNTC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG5ld0VsZW1lbnRcbiAqIEBwYXJhbSBvcHRpb25zPXt9XG4gKi9cblxuZnVuY3Rpb24gZWxlbWVudChlbGVtZW50LCBuZXdFbGVtZW50KSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgKDAsIF9ub2RlUGF0Y2gucGF0Y2hOb2RlKShlbGVtZW50LCBuZXdFbGVtZW50LCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBSZWxlYXNlcyB0aGUgd29ya2VyIGFuZCBtZW1vcnkgYWxsb2NhdGVkIHRvIHRoaXMgZWxlbWVudC4gVXNlZnVsIGZvclxuICogY2xlYW5pbmcgdXAgY29tcG9uZW50cyB3aGVuIHJlbW92ZWQgaW4gdGVzdHMgYW5kIGFwcGxpY2F0aW9ucy5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHJlbGVhc2UoZWxlbWVudCkge1xuICAoMCwgX25vZGVQYXRjaC5yZWxlYXNlTm9kZSkoZWxlbWVudCk7XG59XG5cbi8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSByZWFsIGByZWdpc3RlckVsZW1lbnRgIG1ldGhvZCBpZiBpdCBleGlzdHMuXG52YXIgcmVhbFJlZ2lzdGVyRWxlbWVudCA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudDtcblxuLyoqXG4gKiBSZWdpc3RlcidzIGEgY29uc3RydWN0b3Igd2l0aCBhbiBlbGVtZW50IHRvIHByb3ZpZGUgbGlmZWN5Y2xlIGV2ZW50cy5cbiAqXG4gKiBAcGFyYW0gdGFnTmFtZVxuICogQHBhcmFtIGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gcmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIGNvbnN0cnVjdG9yKSB7XG4gIC8vIFVwZ3JhZGUgc2ltcGxlIG9iamVjdHMgdG8gaW5oZXJpdCBmcm9tIEhUTUxFbGVtZW50IGFuZCBiZSB1c2FibGUgaW4gYSByZWFsXG4gIC8vIGltcGxlbWVudGF0aW9uLlxuICB2YXIgbm9ybWFsaXplZENvbnN0cnVjdG9yID0gY29uc3RydWN0b3IucHJvdG90eXBlID8gY29uc3RydWN0b3IgOiBudWxsO1xuXG4gIGlmICghbm9ybWFsaXplZENvbnN0cnVjdG9yKSB7XG4gICAgY29uc3RydWN0b3IuX19wcm90b19fID0gSFRNTEVsZW1lbnQucHJvdG90eXBlO1xuICAgIG5vcm1hbGl6ZWRDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIG5vcm1hbGl6ZWRDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIC8vIElmIHRoZSBuYXRpdmUgd2ViIGNvbXBvbmVudCBzcGVjaWZpY2F0aW9uIGlzIGxvYWRlZCwgdXNlIHRoYXQgaW5zdGVhZC5cbiAgaWYgKHJlYWxSZWdpc3RlckVsZW1lbnQpIHtcbiAgICByZXR1cm4gcmVhbFJlZ2lzdGVyRWxlbWVudC5jYWxsKGRvY3VtZW50LCB0YWdOYW1lLCBub3JtYWxpemVkQ29uc3RydWN0b3IpO1xuICB9XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLCByYWlzZSBhbiBlcnJvci5cbiAgaWYgKHRhZ05hbWUgaW4gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50cykge1xuICAgIHRocm93IG5ldyBfZXJyb3JzLkRPTUV4Y2VwdGlvbignXFxuICAgICAgRmFpbGVkIHRvIGV4ZWN1dGUgXFwncmVnaXN0ZXJFbGVtZW50XFwnIG9uIFxcJ0RvY3VtZW50XFwnOiBSZWdpc3RyYXRpb24gZmFpbGVkXFxuICAgICAgZm9yIHR5cGUgXFwnJyArIHRhZ05hbWUgKyAnXFwnLiBBIHR5cGUgd2l0aCB0aGF0IG5hbWUgaXMgYWxyZWFkeSByZWdpc3RlcmVkLlxcbiAgICAnKTtcbiAgfVxuXG4gIC8vIEFzc2lnbiB0aGUgY3VzdG9tIGVsZW1lbnQgcmVmZXJlbmNlIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1t0YWdOYW1lXSA9IG5vcm1hbGl6ZWRDb25zdHJ1Y3Rvcjtcbn1cblxuLyoqXG4gKiBBZGRzIGEgZ2xvYmFsIHRyYW5zaXRpb24gbGlzdGVuZXIuICBXaXRoIG1hbnkgZWxlbWVudHMgdGhpcyBjb3VsZCBiZSBhblxuICogZXhwZW5zaXZlIG9wZXJhdGlvbiwgc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgbGlzdGVuZXJzIGFkZGVkIGlmIHlvdSdyZVxuICogY29uY2VybmVkIGFib3V0IHBlcmZvcm1hbmNlLlxuICpcbiAqIFNpbmNlIHRoZSBjYWxsYmFjayB0cmlnZ2VycyB3aXRoIHZhcmlvdXMgZWxlbWVudHMsIG1vc3Qgb2Ygd2hpY2ggeW91XG4gKiBwcm9iYWJseSBkb24ndCBjYXJlIGFib3V0LCB5b3UnbGwgd2FudCB0byBmaWx0ZXIuICBBIGdvb2Qgd2F5IG9mIGZpbHRlcmluZ1xuICogaXMgdG8gdXNlIHRoZSBET00gYG1hdGNoZXNgIG1ldGhvZC4gIEl0J3MgZmFpcmx5IHdlbGwgc3VwcG9ydGVkXG4gKiAoaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PW1hdGNoZXNzZWxlY3RvcikgYW5kIG1heSBzdWl0IG1hbnkgcHJvamVjdHMuICBJZlxuICogeW91IG5lZWQgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGNvbnNpZGVyIHVzaW5nIGpRdWVyeSdzIGBpc2AuXG4gKlxuICogWW91IGNhbiBkbyBmdW4sIGhpZ2hseSBzcGVjaWZpYywgZmlsdGVyczpcbiAqXG4gKiBhZGRUcmFuc2l0aW9uU3RhdGUoJ2F0dGFjaGVkJywgZnVuY3Rpb24oZWxlbWVudCkge1xuICogICAvLyBGYWRlIGluIHRoZSBtYWluIGNvbnRhaW5lciBhZnRlciBpdCdzIGFkZGVkLlxuICogICBpZiAoZWxlbWVudC5tYXRjaGVzKCdib2R5IG1haW4uY29udGFpbmVyJykpIHtcbiAqICAgICAkKGVsZW1lbnQpLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZUluKCk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEBwYXJhbSBzdGF0ZSAtIFN0cmluZyBuYW1lIHRoYXQgbWF0Y2hlcyB3aGF0J3MgYXZhaWxhYmxlIGluIHRoZVxuICogZG9jdW1lbnRhdGlvbiBhYm92ZS5cbiAqIEBwYXJhbSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlY2VpdmUgdGhlIG1hdGNoaW5nIGVsZW1lbnRzLlxuICovXG5cbmZ1bmN0aW9uIGFkZFRyYW5zaXRpb25TdGF0ZShzdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHRocm93IG5ldyBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yKCdNaXNzaW5nIHRyYW5zaXRpb24gc3RhdGUgbmFtZScpO1xuICB9XG5cbiAgaWYgKCFjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yKCdNaXNzaW5nIHRyYW5zaXRpb24gc3RhdGUgY2FsbGJhY2snKTtcbiAgfVxuXG4gIC8vIE5vdCBhIHZhbGlkIHN0YXRlIG5hbWUuXG4gIGlmIChPYmplY3Qua2V5cyhfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcykuaW5kZXhPZihzdGF0ZSkgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3IoJ0ludmFsaWQgc3RhdGUgbmFtZTogJyArIHN0YXRlKTtcbiAgfVxuXG4gIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5wdXNoKGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGEgZ2xvYmFsIHRyYW5zaXRpb24gbGlzdGVuZXIuXG4gKlxuICogV2hlbiBpbnZva2VkIHdpdGggbm8gYXJndW1lbnRzLCB0aGlzIG1ldGhvZCB3aWxsIHJlbW92ZSBhbGwgdHJhbnNpdGlvblxuICogY2FsbGJhY2tzLiAgV2hlbiBpbnZva2VkIHdpdGggdGhlIG5hbWUgYXJndW1lbnQgaXQgd2lsbCByZW1vdmUgYWxsXG4gKiB0cmFuc2l0aW9uIHN0YXRlIGNhbGxiYWNrcyBtYXRjaGluZyB0aGUgbmFtZSwgYW5kIHNvIG9uIGZvciB0aGUgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHN0YXRlIC0gU3RyaW5nIG5hbWUgdGhhdCBtYXRjaGVzIHdoYXQncyBhdmFpbGFibGUgaW4gdGhlXG4gKiBkb2N1bWVudGF0aW9uIGFib3ZlLlxuICogQHBhcmFtIGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gcmVjZWl2ZSB0aGUgbWF0Y2hpbmcgZWxlbWVudHMuXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrICYmIHN0YXRlKSB7XG4gICAgX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLmxlbmd0aCA9IDA7XG4gIH0gZWxzZSBpZiAoc3RhdGUgJiYgY2FsbGJhY2spIHtcbiAgICAvLyBOb3QgYSB2YWxpZCBzdGF0ZSBuYW1lLlxuICAgIGlmIChPYmplY3Qua2V5cyhfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcykuaW5kZXhPZihzdGF0ZSkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgX2Vycm9ycy5UcmFuc2l0aW9uU3RhdGVFcnJvcignSW52YWxpZCBzdGF0ZSBuYW1lICcgKyBzdGF0ZSk7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLmluZGV4T2YoY2FsbGJhY2spO1xuICAgIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIF9zdGF0ZSBpbiBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcykge1xuICAgICAgX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbX3N0YXRlXS5sZW5ndGggPSAwO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ5IGNhbGxpbmcgdGhpcyBmdW5jdGlvbiB5b3VyIGJyb3dzZXIgZW52aXJvbm1lbnQgaXMgZW5oYW5jZWQgZ2xvYmFsbHkuIFRoaXNcbiAqIHByb2plY3Qgd291bGQgbG92ZSB0byBoaXQgdGhlIHN0YW5kYXJkcyB0cmFjayBhbmQgYWxsb3cgYWxsIGRldmVsb3BlcnMgdG9cbiAqIGJlbmVmaXQgZnJvbSB0aGUgcGVyZm9ybWFuY2UgZ2FpbnMgb2YgRE9NIGRpZmZpbmcuXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlUHJvbGx5ZmlsbCgpIHtcbiAgLy8gRXhwb3NlcyB0aGUgYFRyYW5zaXRpb25TdGF0ZUVycm9yYCBjb25zdHJ1Y3RvciBnbG9iYWxseSBzbyB0aGF0IGRldmVsb3BlcnNcbiAgLy8gY2FuIGluc3RhbmNlb2YgY2hlY2sgZXhjZXB0aW9uIGVycm9ycy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ1RyYW5zaXRpb25TdGF0ZUVycm9yJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yXG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBhZGQgdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFja3MuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkb2N1bWVudCwgJ2FkZFRyYW5zaXRpb25TdGF0ZScsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICBhZGRUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byByZW1vdmUgdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFja3MuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkb2N1bWVudCwgJ3JlbW92ZVRyYW5zaXRpb25TdGF0ZScsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBzZXQgdGhlIGBpbm5lckhUTUxgIG9mIGFuIGVsZW1lbnQuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZJbm5lckhUTUwnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQobmV3SFRNTCkge1xuICAgICAgaW5uZXJIVE1MKHRoaXMsIG5ld0hUTUwpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIHNldCB0aGUgYG91dGVySFRNTGAgb2YgYW4gZWxlbWVudC5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnZGlmZk91dGVySFRNTCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChuZXdIVE1MKSB7XG4gICAgICBvdXRlckhUTUwodGhpcywgbmV3SFRNTCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gZGlmZiB0aGUgY3VycmVudCBlbGVtZW50IHdpdGggYSBuZXcgZWxlbWVudC5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnZGlmZkVsZW1lbnQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG5ld0VsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgIGVsZW1lbnQodGhpcywgbmV3RWxlbWVudCwgb3B0aW9ucyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBSZWxlYXNlcyB0aGUgcmV0YWluZWQgbWVtb3J5IGFuZCB3b3JrZXIgaW5zdGFuY2UuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZSZWxlYXNlJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdFbGVtZW50KSB7XG4gICAgICAoMCwgX25vZGVQYXRjaC5yZWxlYXNlTm9kZSkodGhpcyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBQb2x5ZmlsbCBpbiB0aGUgYHJlZ2lzdGVyRWxlbWVudGAgbWV0aG9kIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gVGhpc1xuICAvLyByZXF1aXJlcyBwYXRjaGluZyBgY3JlYXRlRWxlbWVudGAgYXMgd2VsbCB0byBlbnN1cmUgdGhhdCB0aGUgcHJvcGVyIHByb3RvXG4gIC8vIGNoYWluIGV4aXN0cy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50LCAncmVnaXN0ZXJFbGVtZW50Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSh0YWdOYW1lLCBjb21wb25lbnQpIHtcbiAgICAgIHJlZ2lzdGVyRWxlbWVudCh0YWdOYW1lLCBjb21wb25lbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gSWYgSFRNTEVsZW1lbnQgaXMgYW4gb2JqZWN0LCByZWppZ2dlciBpdCB0byB3b3JrIGxpa2UgYSBmdW5jdGlvbiBzbyB0aGF0XG4gIC8vIGl0IGNhbiBiZSBleHRlbmRlZC4gU3BlY2lmaWNhbGx5IGFmZmVjdHMgSUUgYW5kIFNhZmFyaS5cbiAgaWYgKHR5cGVvZiBFbGVtZW50ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gRmFsbCBiYWNrIHRvIHRoZSBFbGVtZW50IGNvbnN0cnVjdG9yIGlmIHRoZSBIVE1MRWxlbWVudCBkb2VzIG5vdCBleGlzdC5cbiAgICB2YXIgcmVhbEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQgfHwgRWxlbWVudDtcblxuICAgIC8vIElmIHRoZXJlIGlzIG5vIGBfX3Byb3RvX19gIGF2YWlsYWJsZSwgYWRkIG9uZSB0byB0aGUgcHJvdG90eXBlLlxuICAgIGlmICghcmVhbEhUTUxFbGVtZW50Ll9fcHJvdG9fXykge1xuICAgICAgdmFyIGNvcHkgPSB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbCkge1xuICAgICAgICAgIHZhbCA9IE9iamVjdC5rZXlzKHZhbCkubGVuZ3RoID8gdmFsIDogT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlYWxIVE1MRWxlbWVudCwgJ19fcHJvdG9fXycsIGNvcHkpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlYWxIVE1MRWxlbWVudC5wcm90b3R5cGUsICdfX3Byb3RvX18nLCBjb3B5KTtcbiAgICB9XG5cbiAgICBIVE1MRWxlbWVudCA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocmVhbEhUTUxFbGVtZW50LnByb3RvdHlwZSk7XG4gICAgSFRNTEVsZW1lbnQuX19wcm90b19fID0gcmVhbEhUTUxFbGVtZW50O1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlIGdsb2JhbCBFbGVtZW50IG1hdGNoZXMgdGhlIEhUTUxFbGVtZW50LlxuICAgIEVsZW1lbnQgPSBIVE1MRWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWxsIGF1dG9tYXRpY2FsbHkgYWN0aXZhdGUgYW55IGNvbXBvbmVudHMgZm91bmQgaW4gdGhlIHBhZ2UgYXV0b21hdGljYWxseVxuICAgKiBhZnRlciBjYWxsaW5nIGBlbmFibGVQcm9sbHlmaWxsYC4gVGhpcyBpcyB1c2VmdWwgdG8gc2ltdWxhdGUgYSByZWFsLXdvcmxkXG4gICAqIHVzYWdlIG9mIEN1c3RvbSBFbGVtZW50cy5cbiAgICovXG4gIHZhciBhY3RpdmF0ZUNvbXBvbmVudHMgPSBmdW5jdGlvbiBhY3RpdmF0ZUNvbXBvbmVudHMoKSB7XG4gICAgdmFyIGRvY3VtZW50RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgIC8vIEFmdGVyIHRoZSBpbml0aWFsIHJlbmRlciwgY2xlYW4gdXAgdGhlIHJlc291cmNlcywgbm8gcG9pbnQgaW4gbGluZ2VyaW5nLlxuICAgIGRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXJDb21wbGV0ZScsIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIC8vIFJlbGVhc2UgcmVzb3VyY2VzIGFsbG9jYXRlZCB0byB0aGUgZWxlbWVudC5cbiAgICAgIGRvY3VtZW50RWxlbWVudC5kaWZmUmVsZWFzZShkb2N1bWVudEVsZW1lbnQpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhpcyBldmVudCBsaXN0ZW5lci5cbiAgICAgIGRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdyZW5kZXJDb21wbGV0ZScsIHJlbmRlcik7XG4gICAgfSk7XG5cbiAgICAvLyBEaWZmIHRoZSBlbnRpcmUgZG9jdW1lbnQgb24gYWN0aXZhdGlvbiBvZiB0aGUgcHJvbGx5ZmlsbC5cbiAgICBkb2N1bWVudEVsZW1lbnQuZGlmZk91dGVySFRNTCA9IGRvY3VtZW50RWxlbWVudC5vdXRlckhUTUw7XG5cbiAgICAvLyBSZW1vdmUgdGhlIGxvYWQgZXZlbnQgbGlzdGVuZXIsIHNpbmNlIGl0J3MgY29tcGxldGUuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBhY3RpdmF0ZUNvbXBvbmVudHMpO1xuICB9O1xuXG4gIC8vIFRoaXMgc2VjdGlvbiB3aWxsIGF1dG9tYXRpY2FsbHkgcGFyc2Ugb3V0IHlvdXIgZW50aXJlIHBhZ2UgdG8gZW5zdXJlIGFsbFxuICAvLyBjdXN0b20gZWxlbWVudHMgYXJlIGhvb2tlZCBpbnRvLlxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFjdGl2YXRlQ29tcG9uZW50cyk7XG5cbiAgLy8gSWYgdGhlIGRvY3VtZW50IGhhcyBhbHJlYWR5IGxvYWRlZCwgaW1tZWRpYXRlbHkgYWN0aXZhdGUgdGhlIGNvbXBvbmVudHMuXG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgYWN0aXZhdGVDb21wb25lbnRzKCk7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdPenM3TzNsQ1FVRnhSQ3hqUVVGak96c3lRa0ZEYkVNc1pVRkJaVHM3TmtKQlEzSkNMR3RDUVVGclFqczdjMEpCUlUwc1ZVRkJWVHM3T3pzN096dHRRa0ZIY0VRc2IwSkJRVzlDT3pzN096czdiVUpCUVVVc1dVRkJXVHM3T3pzN096czdPenM3T3pzN1FVRlhjRU1zVTBGQlV5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RlFVRjVRanROUVVGMlFpeE5RVUZOTEhsRVFVRkRMRVZCUVVVN1RVRkJSU3hQUVVGUExIbEVRVUZETEVWQlFVVTdPMEZCUTNSRUxGTkJRVThzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMEZCUTNSQ0xEUkNRVUZWTEU5QlFVOHNSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03UTBGRGNrTTdPenM3T3pzN096czdPenRCUVZkTkxGTkJRVk1zVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCZVVJN1RVRkJka0lzVFVGQlRTeDVSRUZCUXl4RlFVRkZPMDFCUVVVc1QwRkJUeXg1UkVGQlF5eEZRVUZGT3p0QlFVTjBSQ3hUUVVGUExFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnlRaXcwUWtGQlZTeFBRVUZQTEVWQlFVVXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wTkJRM0pET3pzN096czdPenM3T3pzN1FVRlhUU3hUUVVGVExFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNWVUZCVlN4RlFVRmpPMDFCUVZvc1QwRkJUeXg1UkVGQlF5eEZRVUZGT3p0QlFVTnlSQ3cwUWtGQlZTeFBRVUZQTEVWQlFVVXNWVUZCVlN4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wTkJRM3BET3pzN096czdPenM3UVVGUlRTeFRRVUZUTEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRMMElzT0VKQlFWa3NUMEZCVHl4RFFVRkRMRU5CUVVNN1EwRkRkRUk3T3p0QlFVZEVMRWxCUVVrc2JVSkJRVzFDTEVkQlFVY3NVVUZCVVN4RFFVRkRMR1ZCUVdVc1EwRkJRenM3T3pzN096czdPMEZCVVRWRExGTkJRVk1zWlVGQlpTeERRVUZETEU5QlFVOHNSVUZCUlN4WFFVRlhMRVZCUVVVN096dEJRVWR3UkN4TlFVRkpMSEZDUVVGeFFpeEhRVUZITEZkQlFWY3NRMEZCUXl4VFFVRlRMRWRCUVVjc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF6czdRVUZGZGtVc1RVRkJTU3hEUVVGRExIRkNRVUZ4UWl4RlFVRkZPMEZCUXpGQ0xHVkJRVmNzUTBGQlF5eFRRVUZUTEVkQlFVY3NWMEZCVnl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNNVF5eDVRa0ZCY1VJc1IwRkJSeXhaUVVGWExFVkJRVVVzUTBGQlF6dEJRVU4wUXl4NVFrRkJjVUlzUTBGQlF5eFRRVUZUTEVkQlFVY3NWMEZCVnl4RFFVRkRPMGRCUXk5RE96czdRVUZIUkN4TlFVRkpMRzFDUVVGdFFpeEZRVUZGTzBGQlEzWkNMRmRCUVU4c2JVSkJRVzFDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1JVRkJSU3hQUVVGUExFVkJRVVVzY1VKQlFYRkNMRU5CUVVNc1EwRkJRenRIUVVNelJUczdPMEZCUjBRc1RVRkJTU3hQUVVGUExEWkNRVUZqTEVWQlFVVTdRVUZEZWtJc1ZVRkJUU3h0U1VGRlVTeFBRVUZQTERSRVFVTnVRaXhEUVVGRE8wZEJRMG83T3p0QlFVZEVMRFJDUVVGWExFOUJRVThzUTBGQlF5eEhRVUZITEhGQ1FVRnhRaXhEUVVGRE8wTkJRemRET3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3UVVFd1FrMHNVMEZCVXl4clFrRkJhMElzUTBGQlF5eExRVUZMTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUTJ4RUxFMUJRVWtzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZEVml4VlFVRk5MR2xEUVVGNVFpd3JRa0ZCSzBJc1EwRkJReXhEUVVGRE8wZEJRMnBGT3p0QlFVVkVMRTFCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRFlpeFZRVUZOTEdsRFFVRjVRaXh0UTBGQmJVTXNRMEZCUXl4RFFVRkRPMGRCUTNKRk96czdRVUZIUkN4TlFVRkpMRTFCUVUwc1EwRkJReXhKUVVGSkxDdENRVUZyUWl4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSVUZCUlR0QlFVTjJSQ3hWUVVGTkxHbERRVUY1UWl4elFrRkJjMElzUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXp0SFFVTm9SVHM3UVVGRlJDeG5RMEZCYVVJc1MwRkJTeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPME5CUTNoRE96czdPenM3T3pzN096czdPenRCUVdGTkxGTkJRVk1zY1VKQlFYRkNMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUlVGQlJUdEJRVU55UkN4TlFVRkpMRU5CUVVNc1VVRkJVU3hKUVVGSkxFdEJRVXNzUlVGQlJUdEJRVU4wUWl4clEwRkJhVUlzUzBGQlN5eERRVUZETEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRIUVVOd1F5eE5RVU5KTEVsQlFVa3NTMEZCU3l4SlFVRkpMRkZCUVZFc1JVRkJSVHM3UVVGRk1VSXNVVUZCU1N4TlFVRk5MRU5CUVVNc1NVRkJTU3dyUWtGQmEwSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVTdRVUZEZGtRc1dVRkJUU3hwUTBGQmVVSXNjVUpCUVhGQ0xFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTTdTMEZETDBRN08wRkJSVVFzVVVGQlNTeExRVUZMTEVkQlFVY3NPRUpCUVdsQ0xFdEJRVXNzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOMFJDeHJRMEZCYVVJc1MwRkJTeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNeFF5eE5RVU5KTzBGQlEwZ3NVMEZCU3l4SlFVRkpMRTFCUVVzc2JVTkJRWE5DTzBGQlEyeERMRzlEUVVGcFFpeE5RVUZMTEVOQlFVTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE8wdEJRM0JETzBkQlEwWTdRMEZEUmpzN096czdPenM3UVVGUFRTeFRRVUZUTEdkQ1FVRm5RaXhIUVVGSE96czdRVUZIYWtNc1VVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eE5RVUZOTEVWQlFVVXNjMEpCUVhOQ0xFVkJRVVU3UVVGRGNFUXNaMEpCUVZrc1JVRkJSU3hKUVVGSk96dEJRVVZzUWl4VFFVRkxMRGhDUVVGelFqdEhRVU0xUWl4RFFVRkRMRU5CUVVNN096dEJRVWRJTEZGQlFVMHNRMEZCUXl4alFVRmpMRU5CUVVNc1VVRkJVU3hGUVVGRkxHOUNRVUZ2UWl4RlFVRkZPMEZCUTNCRUxHZENRVUZaTEVWQlFVVXNTVUZCU1RzN1FVRkZiRUlzVTBGQlN5eEZRVUZCTEdWQlFVTXNTMEZCU3l4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVOeVFpeDNRa0ZCYTBJc1EwRkJReXhMUVVGTExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdTMEZEY2tNN1IwRkRSaXhEUVVGRExFTkJRVU03T3p0QlFVZElMRkZCUVUwc1EwRkJReXhqUVVGakxFTkJRVU1zVVVGQlVTeEZRVUZGTEhWQ1FVRjFRaXhGUVVGRk8wRkJRM1pFTEdkQ1FVRlpMRVZCUVVVc1NVRkJTVHM3UVVGRmJFSXNVMEZCU3l4RlFVRkJMR1ZCUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUlVGQlJUdEJRVU55UWl3eVFrRkJjVUlzUTBGQlF5eExRVUZMTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1MwRkRlRU03UjBGRFJpeERRVUZETEVOQlFVTTdPenRCUVVkSUxGRkJRVTBzUTBGQlF5eGpRVUZqTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSU3hsUVVGbExFVkJRVVU3UVVGRGVFUXNaMEpCUVZrc1JVRkJSU3hKUVVGSk96dEJRVVZzUWl4UFFVRkhMRVZCUVVFc1lVRkJReXhQUVVGUExFVkJRVVU3UVVGRFdDeGxRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wdEJRekZDTzBkQlEwWXNRMEZCUXl4RFFVRkRPenM3UVVGSFNDeFJRVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFVkJRVVVzWlVGQlpTeEZRVUZGTzBGQlEzaEVMR2RDUVVGWkxFVkJRVVVzU1VGQlNUczdRVUZGYkVJc1QwRkJSeXhGUVVGQkxHRkJRVU1zVDBGQlR5eEZRVUZGTzBGQlExZ3NaVUZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dExRVU14UWp0SFFVTkdMRU5CUVVNc1EwRkJRenM3TzBGQlIwZ3NVVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eEZRVUZGTEdGQlFXRXNSVUZCUlR0QlFVTjBSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xGTkJRVXNzUlVGQlFTeGxRVUZETEZWQlFWVXNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRla0lzWVVGQlR5eERRVUZETEVsQlFVa3NSVUZCUlN4VlFVRlZMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03UzBGRGNFTTdSMEZEUml4RFFVRkRMRU5CUVVNN096dEJRVWRJTEZGQlFVMHNRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeGhRVUZoTEVWQlFVVTdRVUZEZEVRc1owSkJRVmtzUlVGQlJTeEpRVUZKT3p0QlFVVnNRaXhUUVVGTExFVkJRVUVzWlVGQlF5eFZRVUZWTEVWQlFVVTdRVUZEYUVJc2EwTkJRVmtzU1VGQlNTeERRVUZETEVOQlFVTTdTMEZEYmtJN1IwRkRSaXhEUVVGRExFTkJRVU03T3pzN08wRkJTMGdzVVVGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4UlFVRlJMRVZCUVVVc2FVSkJRV2xDTEVWQlFVVTdRVUZEYWtRc1owSkJRVmtzUlVGQlJTeEpRVUZKT3p0QlFVVnNRaXhUUVVGTExFVkJRVUVzWlVGQlF5eFBRVUZQTEVWQlFVVXNVMEZCVXl4RlFVRkZPMEZCUTNoQ0xIRkNRVUZsTEVOQlFVTXNUMEZCVHl4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8wdEJRM0pETzBkQlEwWXNRMEZCUXl4RFFVRkRPenM3TzBGQlNVZ3NUVUZCU1N4UFFVRlBMRTlCUVU4c1MwRkJTeXhSUVVGUkxFbEJRVWtzVDBGQlR5eFhRVUZYTEV0QlFVc3NVVUZCVVN4RlFVRkZPenRCUVVWc1JTeFJRVUZKTEdWQlFXVXNSMEZCUnl4WFFVRlhMRWxCUVVrc1QwRkJUeXhEUVVGRE96czdRVUZITjBNc1VVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eFRRVUZUTEVWQlFVVTdRVUZET1VJc1ZVRkJTU3hKUVVGSkxFZEJRVWM3UVVGRFZDeFhRVUZITEVWQlFVVXNZVUZCVXl4SFFVRkhMRVZCUVVVN1FVRkRha0lzWVVGQlJ5eEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEVkQlFVY3NSMEZCUnl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEycEZMR1ZCUVVzc1NVRkJTU3hIUVVGSExFbEJRVWtzUjBGQlJ5eEZRVUZGTzBGQlEyNUNMR2RDUVVGSkxFZEJRVWNzUTBGQlF5eGpRVUZqTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRNMElzYTBKQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdZVUZEZEVJN1YwRkRSanRUUVVOR08wOUJRMFlzUTBGQlF6czdRVUZGUml4WlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExHVkJRV1VzUlVGQlJTeFhRVUZYTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRNVVFzV1VGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4bFFVRmxMRU5CUVVNc1UwRkJVeXhGUVVGRkxGZEJRVmNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTnlSVHM3UVVGRlJDeGxRVUZYTEVkQlFVY3NXVUZCVnl4RlFVRkZMRU5CUVVNN1FVRkROVUlzWlVGQlZ5eERRVUZETEZOQlFWTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTnFSU3hsUVVGWExFTkJRVU1zVTBGQlV5eEhRVUZITEdWQlFXVXNRMEZCUXpzN08wRkJSM2hETEZkQlFVOHNSMEZCUnl4WFFVRlhMRU5CUVVNN1IwRkRka0k3T3pzN096czdRVUZQUkN4TlFVRkpMR3RDUVVGclFpeEhRVUZITEZOQlFYSkNMR3RDUVVGclFpeEhRVUZqTzBGQlEyeERMRkZCUVVrc1pVRkJaU3hIUVVGSExGRkJRVkVzUTBGQlF5eGxRVUZsTEVOQlFVTTdPenRCUVVjdlF5eHRRa0ZCWlN4RFFVRkRMR2RDUVVGblFpeERRVUZETEdkQ1FVRm5RaXhGUVVGRkxGTkJRVk1zVFVGQlRTeEhRVUZIT3p0QlFVVnVSU3h4UWtGQlpTeERRVUZETEZkQlFWY3NRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenM3TzBGQlJ6ZERMSEZDUVVGbExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1MwRkRMMFFzUTBGQlF5eERRVUZET3pzN1FVRkhTQ3h0UWtGQlpTeERRVUZETEdGQlFXRXNSMEZCUnl4bFFVRmxMRU5CUVVNc1UwRkJVeXhEUVVGRE96czdRVUZITVVRc1ZVRkJUU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hyUWtGQmEwSXNRMEZCUXl4RFFVRkRPMGRCUTNoRUxFTkJRVU03T3pzN1FVRkpSaXhSUVVGTkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1RVRkJUU3hGUVVGRkxHdENRVUZyUWl4RFFVRkRMRU5CUVVNN096dEJRVWR3UkN4TlFVRkpMRkZCUVZFc1EwRkJReXhWUVVGVkxFdEJRVXNzVlVGQlZTeEZRVUZGTzBGQlFVVXNjMEpCUVd0Q0xFVkJRVVVzUTBGQlF6dEhRVUZGTzBOQlEyeEZJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMmx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnY0dGMFkyaE9iMlJsTENCeVpXeGxZWE5sVG05a1pTd2djbVZuYVhOMFpYSk9iMlJsSUgwZ1puSnZiU0FuTGk5dWIyUmxMM0JoZEdOb0p6dGNibWx0Y0c5eWRDQjdJSFJ5WVc1emFYUnBiMjVUZEdGMFpYTWdmU0JtY205dElDY3VMM1J5WVc1emFYUnBiMjV6Snp0Y2JtbHRjRzl5ZENCN0lHTnZiWEJ2Ym1WdWRITWdmU0JtY205dElDY3VMMlZzWlcxbGJuUXZZM1Z6ZEc5dEp6dGNibHh1YVcxd2IzSjBJSHNnVkhKaGJuTnBkR2x2YmxOMFlYUmxSWEp5YjNJc0lFUlBUVVY0WTJWd2RHbHZiaUI5SUdaeWIyMGdKeTR2WlhKeWIzSnpKenRjYmk4dklFVjRjRzl5ZENCMGFHVWdZM1Z6ZEc5dElFVnljbTl5SUdOdmJuTjBjblZqZEc5eWN5QnpieUIwYUdGMElHbHVjM1JoYm1ObGIyWWdZMmhsWTJ0eklHTmhiaUJpWlNCdFlXUmxYRzR2THlCaWVTQjBhRzl6WlNCd2RXSnNhV05zZVNCamIyNXpkVzFwYm1jZ2RHaHBjeUJzYVdKeVlYSjVMbHh1Wlhod2IzSjBJSHNnVkhKaGJuTnBkR2x2YmxOMFlYUmxSWEp5YjNJc0lFUlBUVVY0WTJWd2RHbHZiaUI5SUdaeWIyMGdKeTR2WlhKeWIzSnpKenRjYmx4dUx5b3FYRzRnS2lCVmMyVmtJSFJ2SUdScFptWWdkR2hsSUc5MWRHVnlTRlJOVENCamIyNTBaVzUwY3lCdlppQjBhR1VnY0dGemMyVmtJR1ZzWlcxbGJuUWdkMmwwYUNCMGFHVWdiV0Z5YTNWd1hHNGdLaUJqYjI1MFpXNTBjeTRnSUZabGNua2dkWE5sWm5Wc0lHWnZjaUJoY0hCc2VXbHVaeUJoSUdkc2IySmhiQ0JrYVdabUlHOXVJSFJvWlZ4dUlDb2dZR1J2WTNWdFpXNTBMbVJ2WTNWdFpXNTBSV3hsYldWdWRHQXVYRzRnS2x4dUlDb2dRSEJoY21GdElHVnNaVzFsYm5SY2JpQXFJRUJ3WVhKaGJTQnRZWEpyZFhBOUp5ZGNiaUFxSUVCd1lYSmhiU0J2Y0hScGIyNXpQWHQ5WEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnZkWFJsY2toVVRVd29aV3hsYldWdWRDd2diV0Z5YTNWd1BTY25MQ0J2Y0hScGIyNXpQWHQ5S1NCN1hHNGdJRzl3ZEdsdmJuTXVhVzV1WlhJZ1BTQm1ZV3h6WlR0Y2JpQWdjR0YwWTJoT2IyUmxLR1ZzWlcxbGJuUXNJRzFoY210MWNDd2diM0IwYVc5dWN5azdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1ZYTmxaQ0IwYnlCa2FXWm1JSFJvWlNCcGJtNWxja2hVVFV3Z1kyOXVkR1Z1ZEhNZ2IyWWdkR2hsSUhCaGMzTmxaQ0JsYkdWdFpXNTBJSGRwZEdnZ2RHaGxJRzFoY210MWNGeHVJQ29nWTI5dWRHVnVkSE11SUNCVWFHbHpJR2x6SUhWelpXWjFiQ0IzYVhSb0lHeHBZbkpoY21sbGN5QnNhV3RsSUVKaFkydGliMjVsSUhSb1lYUWdjbVZ1WkdWeUlGWnBaWGR6WEc0Z0tpQnBiblJ2SUdWc1pXMWxiblFnWTI5dWRHRnBibVZ5TGx4dUlDcGNiaUFxSUVCd1lYSmhiU0JsYkdWdFpXNTBYRzRnS2lCQWNHRnlZVzBnYldGeWEzVndQU2NuWEc0Z0tpQkFjR0Z5WVcwZ2IzQjBhVzl1Y3oxN2ZWeHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnYVc1dVpYSklWRTFNS0dWc1pXMWxiblFzSUcxaGNtdDFjRDBuSnl3Z2IzQjBhVzl1Y3oxN2ZTa2dlMXh1SUNCdmNIUnBiMjV6TG1sdWJtVnlJRDBnZEhKMVpUdGNiaUFnY0dGMFkyaE9iMlJsS0dWc1pXMWxiblFzSUcxaGNtdDFjQ3dnYjNCMGFXOXVjeWs3WEc1OVhHNWNiaThxS2x4dUlDb2dWWE5sWkNCMGJ5QmthV1ptSUhSM2J5QmxiR1Z0Wlc1MGN5NGdJRlJvWlNCZ2FXNXVaWEpnSUVKdmIyeGxZVzRnY0hKdmNHVnlkSGtnWTJGdUlHSmxJSE53WldOcFptbGxaQ0JwYmx4dUlDb2dkR2hsSUc5d2RHbHZibk1nZEc4Z2MyVjBJR2x1Ym1WeVNGUk5URnhjYjNWMFpYSklWRTFNSUdKbGFHRjJhVzl5TGlBZ1Fua2daR1ZtWVhWc2RDQnBkQ0JwYzF4dUlDb2diM1YwWlhKSVZFMU1MbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQmxiR1Z0Wlc1MFhHNGdLaUJBY0dGeVlXMGdibVYzUld4bGJXVnVkRnh1SUNvZ1FIQmhjbUZ0SUc5d2RHbHZibk05ZTMxY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1ZzWlcxbGJuUW9aV3hsYldWdWRDd2dibVYzUld4bGJXVnVkQ3dnYjNCMGFXOXVjejE3ZlNrZ2UxeHVJQ0J3WVhSamFFNXZaR1VvWld4bGJXVnVkQ3dnYm1WM1JXeGxiV1Z1ZEN3Z2IzQjBhVzl1Y3lrN1hHNTlYRzVjYmk4cUtseHVJQ29nVW1Wc1pXRnpaWE1nZEdobElIZHZjbXRsY2lCaGJtUWdiV1Z0YjNKNUlHRnNiRzlqWVhSbFpDQjBieUIwYUdseklHVnNaVzFsYm5RdUlGVnpaV1oxYkNCbWIzSmNiaUFxSUdOc1pXRnVhVzVuSUhWd0lHTnZiWEJ2Ym1WdWRITWdkMmhsYmlCeVpXMXZkbVZrSUdsdUlIUmxjM1J6SUdGdVpDQmhjSEJzYVdOaGRHbHZibk11WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhKbGJHVmhjMlVvWld4bGJXVnVkQ2tnZTF4dUlDQnlaV3hsWVhObFRtOWtaU2hsYkdWdFpXNTBLVHRjYm4xY2JseHVMeThnVTNSdmNtVWdZU0J5WldabGNtVnVZMlVnZEc4Z2RHaGxJSEpsWVd3Z1lISmxaMmx6ZEdWeVJXeGxiV1Z1ZEdBZ2JXVjBhRzlrSUdsbUlHbDBJR1Y0YVhOMGN5NWNiblpoY2lCeVpXRnNVbVZuYVhOMFpYSkZiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVjbVZuYVhOMFpYSkZiR1Z0Wlc1ME8xeHVYRzR2S2lwY2JpQXFJRkpsWjJsemRHVnlKM01nWVNCamIyNXpkSEoxWTNSdmNpQjNhWFJvSUdGdUlHVnNaVzFsYm5RZ2RHOGdjSEp2ZG1sa1pTQnNhV1psWTNsamJHVWdaWFpsYm5SekxseHVJQ3BjYmlBcUlFQndZWEpoYlNCMFlXZE9ZVzFsWEc0Z0tpQkFjR0Z5WVcwZ1kyOXVjM1J5ZFdOMGIzSmNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhKbFoybHpkR1Z5Uld4bGJXVnVkQ2gwWVdkT1lXMWxMQ0JqYjI1emRISjFZM1J2Y2lrZ2UxeHVJQ0F2THlCVmNHZHlZV1JsSUhOcGJYQnNaU0J2WW1wbFkzUnpJSFJ2SUdsdWFHVnlhWFFnWm5KdmJTQklWRTFNUld4bGJXVnVkQ0JoYm1RZ1ltVWdkWE5oWW14bElHbHVJR0VnY21WaGJGeHVJQ0F2THlCcGJYQnNaVzFsYm5SaGRHbHZiaTVjYmlBZ2RtRnlJRzV2Y20xaGJHbDZaV1JEYjI1emRISjFZM1J2Y2lBOUlHTnZibk4wY25WamRHOXlMbkJ5YjNSdmRIbHdaU0EvSUdOdmJuTjBjblZqZEc5eUlEb2diblZzYkR0Y2JseHVJQ0JwWmlBb0lXNXZjbTFoYkdsNlpXUkRiMjV6ZEhKMVkzUnZjaWtnZTF4dUlDQWdJR052Ym5OMGNuVmpkRzl5TGw5ZmNISnZkRzlmWHlBOUlFaFVUVXhGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaVHRjYmlBZ0lDQnViM0p0WVd4cGVtVmtRMjl1YzNSeWRXTjBiM0lnUFNCbWRXNWpkR2x2YmlncElIdDlPMXh1SUNBZ0lHNXZjbTFoYkdsNlpXUkRiMjV6ZEhKMVkzUnZjaTV3Y205MGIzUjVjR1VnUFNCamIyNXpkSEoxWTNSdmNqdGNiaUFnZlZ4dVhHNGdJQzh2SUVsbUlIUm9aU0J1WVhScGRtVWdkMlZpSUdOdmJYQnZibVZ1ZENCemNHVmphV1pwWTJGMGFXOXVJR2x6SUd4dllXUmxaQ3dnZFhObElIUm9ZWFFnYVc1emRHVmhaQzVjYmlBZ2FXWWdLSEpsWVd4U1pXZHBjM1JsY2tWc1pXMWxiblFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjbVZoYkZKbFoybHpkR1Z5Uld4bGJXVnVkQzVqWVd4c0tHUnZZM1Z0Wlc1MExDQjBZV2RPWVcxbExDQnViM0p0WVd4cGVtVmtRMjl1YzNSeWRXTjBiM0lwTzF4dUlDQjlYRzVjYmlBZ0x5OGdTV1lnZEdobElHVnNaVzFsYm5RZ2FHRnpJR0ZzY21WaFpIa2dZbVZsYmlCeVpXZHBjM1JsY21Wa0xDQnlZV2x6WlNCaGJpQmxjbkp2Y2k1Y2JpQWdhV1lnS0hSaFowNWhiV1VnYVc0Z1kyOXRjRzl1Wlc1MGN5a2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QkVUMDFGZUdObGNIUnBiMjRvWUZ4dUlDQWdJQ0FnUm1GcGJHVmtJSFJ2SUdWNFpXTjFkR1VnSjNKbFoybHpkR1Z5Uld4bGJXVnVkQ2NnYjI0Z0owUnZZM1Z0Wlc1MEp6b2dVbVZuYVhOMGNtRjBhVzl1SUdaaGFXeGxaRnh1SUNBZ0lDQWdabTl5SUhSNWNHVWdKeVI3ZEdGblRtRnRaWDBuTGlCQklIUjVjR1VnZDJsMGFDQjBhR0YwSUc1aGJXVWdhWE1nWVd4eVpXRmtlU0J5WldkcGMzUmxjbVZrTGx4dUlDQWdJR0FwTzF4dUlDQjlYRzVjYmlBZ0x5OGdRWE56YVdkdUlIUm9aU0JqZFhOMGIyMGdaV3hsYldWdWRDQnlaV1psY21WdVkyVWdkRzhnZEdobElHTnZibk4wY25WamRHOXlMbHh1SUNCamIyMXdiMjVsYm5SelczUmhaMDVoYldWZElEMGdibTl5YldGc2FYcGxaRU52Ym5OMGNuVmpkRzl5TzF4dWZWeHVYRzR2S2lwY2JpQXFJRUZrWkhNZ1lTQm5iRzlpWVd3Z2RISmhibk5wZEdsdmJpQnNhWE4wWlc1bGNpNGdJRmRwZEdnZ2JXRnVlU0JsYkdWdFpXNTBjeUIwYUdseklHTnZkV3hrSUdKbElHRnVYRzRnS2lCbGVIQmxibk5wZG1VZ2IzQmxjbUYwYVc5dUxDQnpieUIwY25rZ2RHOGdiR2x0YVhRZ2RHaGxJR0Z0YjNWdWRDQnZaaUJzYVhOMFpXNWxjbk1nWVdSa1pXUWdhV1lnZVc5MUozSmxYRzRnS2lCamIyNWpaWEp1WldRZ1lXSnZkWFFnY0dWeVptOXliV0Z1WTJVdVhHNGdLbHh1SUNvZ1UybHVZMlVnZEdobElHTmhiR3hpWVdOcklIUnlhV2RuWlhKeklIZHBkR2dnZG1GeWFXOTFjeUJsYkdWdFpXNTBjeXdnYlc5emRDQnZaaUIzYUdsamFDQjViM1ZjYmlBcUlIQnliMkpoWW14NUlHUnZiaWQwSUdOaGNtVWdZV0p2ZFhRc0lIbHZkU2RzYkNCM1lXNTBJSFJ2SUdacGJIUmxjaTRnSUVFZ1oyOXZaQ0IzWVhrZ2IyWWdabWxzZEdWeWFXNW5YRzRnS2lCcGN5QjBieUIxYzJVZ2RHaGxJRVJQVFNCZ2JXRjBZMmhsYzJBZ2JXVjBhRzlrTGlBZ1NYUW5jeUJtWVdseWJIa2dkMlZzYkNCemRYQndiM0owWldSY2JpQXFJQ2hvZEhSd09pOHZZMkZ1YVhWelpTNWpiMjB2STJabFlYUTliV0YwWTJobGMzTmxiR1ZqZEc5eUtTQmhibVFnYldGNUlITjFhWFFnYldGdWVTQndjbTlxWldOMGN5NGdJRWxtWEc0Z0tpQjViM1VnYm1WbFpDQmlZV05yZDJGeVpITWdZMjl0Y0dGMGFXSnBiR2wwZVN3Z1kyOXVjMmxrWlhJZ2RYTnBibWNnYWxGMVpYSjVKM01nWUdsellDNWNiaUFxWEc0Z0tpQlpiM1VnWTJGdUlHUnZJR1oxYml3Z2FHbG5hR3g1SUhOd1pXTnBabWxqTENCbWFXeDBaWEp6T2x4dUlDcGNiaUFxSUdGa1pGUnlZVzV6YVhScGIyNVRkR0YwWlNnbllYUjBZV05vWldRbkxDQm1kVzVqZEdsdmJpaGxiR1Z0Wlc1MEtTQjdYRzRnS2lBZ0lDOHZJRVpoWkdVZ2FXNGdkR2hsSUcxaGFXNGdZMjl1ZEdGcGJtVnlJR0ZtZEdWeUlHbDBKM01nWVdSa1pXUXVYRzRnS2lBZ0lHbG1JQ2hsYkdWdFpXNTBMbTFoZEdOb1pYTW9KMkp2WkhrZ2JXRnBiaTVqYjI1MFlXbHVaWEluS1NrZ2UxeHVJQ29nSUNBZ0lDUW9aV3hsYldWdWRDa3VjM1J2Y0NoMGNuVmxMQ0IwY25WbEtTNW1ZV1JsU1c0b0tUdGNiaUFxSUNBZ2ZWeHVJQ29nZlNrN1hHNGdLbHh1SUNvZ1FIQmhjbUZ0SUhOMFlYUmxJQzBnVTNSeWFXNW5JRzVoYldVZ2RHaGhkQ0J0WVhSamFHVnpJSGRvWVhRbmN5QmhkbUZwYkdGaWJHVWdhVzRnZEdobFhHNGdLaUJrYjJOMWJXVnVkR0YwYVc5dUlHRmliM1psTGx4dUlDb2dRSEJoY21GdElHTmhiR3hpWVdOcklDMGdSblZ1WTNScGIyNGdkRzhnY21WalpXbDJaU0IwYUdVZ2JXRjBZMmhwYm1jZ1pXeGxiV1Z1ZEhNdVhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJoWkdSVWNtRnVjMmwwYVc5dVUzUmhkR1VvYzNSaGRHVXNJR05oYkd4aVlXTnJLU0I3WEc0Z0lHbG1JQ2doYzNSaGRHVXBJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dWSEpoYm5OcGRHbHZibE4wWVhSbFJYSnliM0lvSjAxcGMzTnBibWNnZEhKaGJuTnBkR2x2YmlCemRHRjBaU0J1WVcxbEp5azdYRzRnSUgxY2JseHVJQ0JwWmlBb0lXTmhiR3hpWVdOcktTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlLQ2ROYVhOemFXNW5JSFJ5WVc1emFYUnBiMjRnYzNSaGRHVWdZMkZzYkdKaFkyc25LVHRjYmlBZ2ZWeHVYRzRnSUM4dklFNXZkQ0JoSUhaaGJHbGtJSE4wWVhSbElHNWhiV1V1WEc0Z0lHbG1JQ2hQWW1wbFkzUXVhMlY1Y3loMGNtRnVjMmwwYVc5dVUzUmhkR1Z6S1M1cGJtUmxlRTltS0hOMFlYUmxLU0E5UFQwZ0xURXBJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dWSEpoYm5OcGRHbHZibE4wWVhSbFJYSnliM0lvSjBsdWRtRnNhV1FnYzNSaGRHVWdibUZ0WlRvZ0p5QXJJSE4wWVhSbEtUdGNiaUFnZlZ4dVhHNGdJSFJ5WVc1emFYUnBiMjVUZEdGMFpYTmJjM1JoZEdWZExuQjFjMmdvWTJGc2JHSmhZMnNwTzF4dWZWeHVYRzR2S2lwY2JpQXFJRkpsYlc5MlpYTWdZU0JuYkc5aVlXd2dkSEpoYm5OcGRHbHZiaUJzYVhOMFpXNWxjaTVjYmlBcVhHNGdLaUJYYUdWdUlHbHVkbTlyWldRZ2QybDBhQ0J1YnlCaGNtZDFiV1Z1ZEhNc0lIUm9hWE1nYldWMGFHOWtJSGRwYkd3Z2NtVnRiM1psSUdGc2JDQjBjbUZ1YzJsMGFXOXVYRzRnS2lCallXeHNZbUZqYTNNdUlDQlhhR1Z1SUdsdWRtOXJaV1FnZDJsMGFDQjBhR1VnYm1GdFpTQmhjbWQxYldWdWRDQnBkQ0IzYVd4c0lISmxiVzkyWlNCaGJHeGNiaUFxSUhSeVlXNXphWFJwYjI0Z2MzUmhkR1VnWTJGc2JHSmhZMnR6SUcxaGRHTm9hVzVuSUhSb1pTQnVZVzFsTENCaGJtUWdjMjhnYjI0Z1ptOXlJSFJvWlNCallXeHNZbUZqYXk1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnYzNSaGRHVWdMU0JUZEhKcGJtY2dibUZ0WlNCMGFHRjBJRzFoZEdOb1pYTWdkMmhoZENkeklHRjJZV2xzWVdKc1pTQnBiaUIwYUdWY2JpQXFJR1J2WTNWdFpXNTBZWFJwYjI0Z1lXSnZkbVV1WEc0Z0tpQkFjR0Z5WVcwZ1kyRnNiR0poWTJzZ0xTQkdkVzVqZEdsdmJpQjBieUJ5WldObGFYWmxJSFJvWlNCdFlYUmphR2x1WnlCbGJHVnRaVzUwY3k1Y2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSEpsYlc5MlpWUnlZVzV6YVhScGIyNVRkR0YwWlNoemRHRjBaU3dnWTJGc2JHSmhZMnNwSUh0Y2JpQWdhV1lnS0NGallXeHNZbUZqYXlBbUppQnpkR0YwWlNrZ2UxeHVJQ0FnSUhSeVlXNXphWFJwYjI1VGRHRjBaWE5iYzNSaGRHVmRMbXhsYm1kMGFDQTlJREE3WEc0Z0lIMWNiaUFnWld4elpTQnBaaUFvYzNSaGRHVWdKaVlnWTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0F2THlCT2IzUWdZU0IyWVd4cFpDQnpkR0YwWlNCdVlXMWxMbHh1SUNBZ0lHbG1JQ2hQWW1wbFkzUXVhMlY1Y3loMGNtRnVjMmwwYVc5dVUzUmhkR1Z6S1M1cGJtUmxlRTltS0hOMFlYUmxLU0E5UFQwZ0xURXBJSHRjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJVY21GdWMybDBhVzl1VTNSaGRHVkZjbkp2Y2lnblNXNTJZV3hwWkNCemRHRjBaU0J1WVcxbElDY2dLeUJ6ZEdGMFpTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JHVjBJR2x1WkdWNElEMGdkSEpoYm5OcGRHbHZibE4wWVhSbGMxdHpkR0YwWlYwdWFXNWtaWGhQWmloallXeHNZbUZqYXlrN1hHNGdJQ0FnZEhKaGJuTnBkR2x2YmxOMFlYUmxjMXR6ZEdGMFpWMHVjM0JzYVdObEtHbHVaR1Y0TENBeEtUdGNiaUFnZlZ4dUlDQmxiSE5sSUh0Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0J6ZEdGMFpTQnBiaUIwY21GdWMybDBhVzl1VTNSaGRHVnpLU0I3WEc0Z0lDQWdJQ0IwY21GdWMybDBhVzl1VTNSaGRHVnpXM04wWVhSbFhTNXNaVzVuZEdnZ1BTQXdPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZWeHVYRzR2S2lwY2JpQXFJRUo1SUdOaGJHeHBibWNnZEdocGN5Qm1kVzVqZEdsdmJpQjViM1Z5SUdKeWIzZHpaWElnWlc1MmFYSnZibTFsYm5RZ2FYTWdaVzVvWVc1alpXUWdaMnh2WW1Gc2JIa3VJRlJvYVhOY2JpQXFJSEJ5YjJwbFkzUWdkMjkxYkdRZ2JHOTJaU0IwYnlCb2FYUWdkR2hsSUhOMFlXNWtZWEprY3lCMGNtRmpheUJoYm1RZ1lXeHNiM2NnWVd4c0lHUmxkbVZzYjNCbGNuTWdkRzljYmlBcUlHSmxibVZtYVhRZ1puSnZiU0IwYUdVZ2NHVnlabTl5YldGdVkyVWdaMkZwYm5NZ2IyWWdSRTlOSUdScFptWnBibWN1WEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmxibUZpYkdWUWNtOXNiSGxtYVd4c0tDa2dlMXh1SUNBdkx5QkZlSEJ2YzJWeklIUm9aU0JnVkhKaGJuTnBkR2x2YmxOMFlYUmxSWEp5YjNKZ0lHTnZibk4wY25WamRHOXlJR2RzYjJKaGJHeDVJSE52SUhSb1lYUWdaR1YyWld4dmNHVnljMXh1SUNBdkx5QmpZVzRnYVc1emRHRnVZMlZ2WmlCamFHVmpheUJsZUdObGNIUnBiMjRnWlhKeWIzSnpMbHh1SUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29kMmx1Wkc5M0xDQW5WSEpoYm5OcGRHbHZibE4wWVhSbFJYSnliM0luTENCN1hHNGdJQ0FnWTI5dVptbG5kWEpoWW14bE9pQjBjblZsTEZ4dVhHNGdJQ0FnZG1Gc2RXVTZJRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5WEc0Z0lIMHBPMXh1WEc0Z0lDOHZJRUZzYkc5M2N5QmhJR1JsZG1Wc2IzQmxjaUIwYnlCaFpHUWdkSEpoYm5OcGRHbHZiaUJ6ZEdGMFpTQmpZV3hzWW1GamEzTXVYRzRnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGtiMk4xYldWdWRDd2dKMkZrWkZSeVlXNXphWFJwYjI1VGRHRjBaU2NzSUh0Y2JpQWdJQ0JqYjI1bWFXZDFjbUZpYkdVNklIUnlkV1VzWEc1Y2JpQWdJQ0IyWVd4MVpTaHpkR0YwWlN3Z1kyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lHRmtaRlJ5WVc1emFYUnBiMjVUZEdGMFpTaHpkR0YwWlN3Z1kyRnNiR0poWTJzcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdMeThnUVd4c2IzZHpJR0VnWkdWMlpXeHZjR1Z5SUhSdklISmxiVzkyWlNCMGNtRnVjMmwwYVc5dUlITjBZWFJsSUdOaGJHeGlZV05yY3k1Y2JpQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dSdlkzVnRaVzUwTENBbmNtVnRiM1psVkhKaGJuTnBkR2x2YmxOMFlYUmxKeXdnZTF4dUlDQWdJR052Ym1acFozVnlZV0pzWlRvZ2RISjFaU3hjYmx4dUlDQWdJSFpoYkhWbEtITjBZWFJsTENCallXeHNZbUZqYXlrZ2UxeHVJQ0FnSUNBZ2NtVnRiM1psVkhKaGJuTnBkR2x2YmxOMFlYUmxLSE4wWVhSbExDQmpZV3hzWW1GamF5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JseHVJQ0F2THlCQmJHeHZkM01nWVNCa1pYWmxiRzl3WlhJZ2RHOGdjMlYwSUhSb1pTQmdhVzV1WlhKSVZFMU1ZQ0J2WmlCaGJpQmxiR1Z0Wlc1MExseHVJQ0JQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1JXeGxiV1Z1ZEM1d2NtOTBiM1I1Y0dVc0lDZGthV1ptU1c1dVpYSklWRTFNSnl3Z2UxeHVJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JseHVJQ0FnSUhObGRDaHVaWGRJVkUxTUtTQjdYRzRnSUNBZ0lDQnBibTVsY2toVVRVd29kR2hwY3l3Z2JtVjNTRlJOVENrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYmx4dUlDQXZMeUJCYkd4dmQzTWdZU0JrWlhabGJHOXdaWElnZEc4Z2MyVjBJSFJvWlNCZ2IzVjBaWEpJVkUxTVlDQnZaaUJoYmlCbGJHVnRaVzUwTGx4dUlDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvUld4bGJXVnVkQzV3Y205MGIzUjVjR1VzSUNka2FXWm1UM1YwWlhKSVZFMU1KeXdnZTF4dUlDQWdJR052Ym1acFozVnlZV0pzWlRvZ2RISjFaU3hjYmx4dUlDQWdJSE5sZENodVpYZElWRTFNS1NCN1hHNGdJQ0FnSUNCdmRYUmxja2hVVFV3b2RHaHBjeXdnYm1WM1NGUk5UQ2s3WEc0Z0lDQWdmVnh1SUNCOUtUdGNibHh1SUNBdkx5QkJiR3h2ZDNNZ1lTQmtaWFpsYkc5d1pYSWdkRzhnWkdsbVppQjBhR1VnWTNWeWNtVnVkQ0JsYkdWdFpXNTBJSGRwZEdnZ1lTQnVaWGNnWld4bGJXVnVkQzVjYmlBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLRVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxMQ0FuWkdsbVprVnNaVzFsYm5RbkxDQjdYRzRnSUNBZ1kyOXVabWxuZFhKaFlteGxPaUIwY25WbExGeHVYRzRnSUNBZ2RtRnNkV1VvYm1WM1JXeGxiV1Z1ZEN3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ1pXeGxiV1Z1ZENoMGFHbHpMQ0J1WlhkRmJHVnRaVzUwTENCdmNIUnBiMjV6S1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1WEc0Z0lDOHZJRkpsYkdWaGMyVnpJSFJvWlNCeVpYUmhhVzVsWkNCdFpXMXZjbmtnWVc1a0lIZHZjbXRsY2lCcGJuTjBZVzVqWlM1Y2JpQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0VWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTENBblpHbG1abEpsYkdWaGMyVW5MQ0I3WEc0Z0lDQWdZMjl1Wm1sbmRYSmhZbXhsT2lCMGNuVmxMRnh1WEc0Z0lDQWdkbUZzZFdVb2JtVjNSV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdjbVZzWldGelpVNXZaR1VvZEdocGN5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JseHVJQ0F2THlCUWIyeDVabWxzYkNCcGJpQjBhR1VnWUhKbFoybHpkR1Z5Uld4bGJXVnVkR0FnYldWMGFHOWtJR2xtSUdsMElHUnZaWE51SjNRZ1lXeHlaV0ZrZVNCbGVHbHpkQzRnVkdocGMxeHVJQ0F2THlCeVpYRjFhWEpsY3lCd1lYUmphR2x1WnlCZ1kzSmxZWFJsUld4bGJXVnVkR0FnWVhNZ2QyVnNiQ0IwYnlCbGJuTjFjbVVnZEdoaGRDQjBhR1VnY0hKdmNHVnlJSEJ5YjNSdlhHNGdJQzh2SUdOb1lXbHVJR1Y0YVhOMGN5NWNiaUFnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtHUnZZM1Z0Wlc1MExDQW5jbVZuYVhOMFpYSkZiR1Z0Wlc1MEp5d2dlMXh1SUNBZ0lHTnZibVpwWjNWeVlXSnNaVG9nZEhKMVpTeGNibHh1SUNBZ0lIWmhiSFZsS0hSaFowNWhiV1VzSUdOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUNBZ2NtVm5hWE4wWlhKRmJHVnRaVzUwS0hSaFowNWhiV1VzSUdOdmJYQnZibVZ1ZENrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYmx4dUlDQXZMeUJKWmlCSVZFMU1SV3hsYldWdWRDQnBjeUJoYmlCdlltcGxZM1FzSUhKbGFtbG5aMlZ5SUdsMElIUnZJSGR2Y21zZ2JHbHJaU0JoSUdaMWJtTjBhVzl1SUhOdklIUm9ZWFJjYmlBZ0x5OGdhWFFnWTJGdUlHSmxJR1Y0ZEdWdVpHVmtMaUJUY0dWamFXWnBZMkZzYkhrZ1lXWm1aV04wY3lCSlJTQmhibVFnVTJGbVlYSnBMbHh1SUNCcFppQW9kSGx3Wlc5bUlFVnNaVzFsYm5RZ1BUMDlJQ2R2WW1wbFkzUW5JSHg4SUhSNWNHVnZaaUJJVkUxTVJXeGxiV1Z1ZENBOVBUMGdKMjlpYW1WamRDY3BJSHRjYmlBZ0lDQXZMeUJHWVd4c0lHSmhZMnNnZEc4Z2RHaGxJRVZzWlcxbGJuUWdZMjl1YzNSeWRXTjBiM0lnYVdZZ2RHaGxJRWhVVFV4RmJHVnRaVzUwSUdSdlpYTWdibTkwSUdWNGFYTjBMbHh1SUNBZ0lHeGxkQ0J5WldGc1NGUk5URVZzWlcxbGJuUWdQU0JJVkUxTVJXeGxiV1Z1ZENCOGZDQkZiR1Z0Wlc1ME8xeHVYRzRnSUNBZ0x5OGdTV1lnZEdobGNtVWdhWE1nYm04Z1lGOWZjSEp2ZEc5ZlgyQWdZWFpoYVd4aFlteGxMQ0JoWkdRZ2IyNWxJSFJ2SUhSb1pTQndjbTkwYjNSNWNHVXVYRzRnSUNBZ2FXWWdLQ0Z5WldGc1NGUk5URVZzWlcxbGJuUXVYMTl3Y205MGIxOWZLU0I3WEc0Z0lDQWdJQ0JzWlhRZ1kyOXdlU0E5SUh0Y2JpQWdJQ0FnSUNBZ2MyVjBPaUJtZFc1amRHbHZiaWgyWVd3cElIdGNiaUFnSUNBZ0lDQWdJQ0IyWVd3Z1BTQlBZbXBsWTNRdWEyVjVjeWgyWVd3cExteGxibWQwYUNBL0lIWmhiQ0E2SUU5aWFtVmpkQzVuWlhSUWNtOTBiM1I1Y0dWUFppaDJZV3dwTzF4dUlDQWdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElHdGxlU0JwYmlCMllXd3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gyWVd3dWFHRnpUM2R1VUhKdmNHVnlkSGtvYTJWNUtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6VzJ0bGVWMGdQU0IyWVd4YmEyVjVYVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2h5WldGc1NGUk5URVZzWlcxbGJuUXNJQ2RmWDNCeWIzUnZYMThuTENCamIzQjVLVHRjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoeVpXRnNTRlJOVEVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTENBblgxOXdjbTkwYjE5Zkp5d2dZMjl3ZVNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnU0ZSTlRFVnNaVzFsYm5RZ1BTQm1kVzVqZEdsdmJpZ3BJSHQ5TzF4dUlDQWdJRWhVVFV4RmJHVnRaVzUwTG5CeWIzUnZkSGx3WlNBOUlFOWlhbVZqZEM1amNtVmhkR1VvY21WaGJFaFVUVXhGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaU2s3WEc0Z0lDQWdTRlJOVEVWc1pXMWxiblF1WDE5d2NtOTBiMTlmSUQwZ2NtVmhiRWhVVFV4RmJHVnRaVzUwTzF4dVhHNGdJQ0FnTHk4Z1JXNXpkWEpsSUhSb1lYUWdkR2hsSUdkc2IySmhiQ0JGYkdWdFpXNTBJRzFoZEdOb1pYTWdkR2hsSUVoVVRVeEZiR1Z0Wlc1MExseHVJQ0FnSUVWc1pXMWxiblFnUFNCSVZFMU1SV3hsYldWdWREdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJYYVd4c0lHRjFkRzl0WVhScFkyRnNiSGtnWVdOMGFYWmhkR1VnWVc1NUlHTnZiWEJ2Ym1WdWRITWdabTkxYm1RZ2FXNGdkR2hsSUhCaFoyVWdZWFYwYjIxaGRHbGpZV3hzZVZ4dUlDQWdLaUJoWm5SbGNpQmpZV3hzYVc1bklHQmxibUZpYkdWUWNtOXNiSGxtYVd4c1lDNGdWR2hwY3lCcGN5QjFjMlZtZFd3Z2RHOGdjMmx0ZFd4aGRHVWdZU0J5WldGc0xYZHZjbXhrWEc0Z0lDQXFJSFZ6WVdkbElHOW1JRU4xYzNSdmJTQkZiR1Z0Wlc1MGN5NWNiaUFnSUNvdlhHNGdJR3hsZENCaFkzUnBkbUYwWlVOdmJYQnZibVZ1ZEhNZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQjJZWElnWkc5amRXMWxiblJGYkdWdFpXNTBJRDBnWkc5amRXMWxiblF1Wkc5amRXMWxiblJGYkdWdFpXNTBPMXh1WEc0Z0lDQWdMeThnUVdaMFpYSWdkR2hsSUdsdWFYUnBZV3dnY21WdVpHVnlMQ0JqYkdWaGJpQjFjQ0IwYUdVZ2NtVnpiM1Z5WTJWekxDQnVieUJ3YjJsdWRDQnBiaUJzYVc1blpYSnBibWN1WEc0Z0lDQWdaRzlqZFcxbGJuUkZiR1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxibVJsY2tOdmJYQnNaWFJsSnl3Z1puVnVZM1JwYjI0Z2NtVnVaR1Z5S0NrZ2UxeHVJQ0FnSUNBZ0x5OGdVbVZzWldGelpTQnlaWE52ZFhKalpYTWdZV3hzYjJOaGRHVmtJSFJ2SUhSb1pTQmxiR1Z0Wlc1MExseHVJQ0FnSUNBZ1pHOWpkVzFsYm5SRmJHVnRaVzUwTG1ScFptWlNaV3hsWVhObEtHUnZZM1Z0Wlc1MFJXeGxiV1Z1ZENrN1hHNWNiaUFnSUNBZ0lDOHZJRkpsYlc5MlpTQjBhR2x6SUdWMlpXNTBJR3hwYzNSbGJtVnlMbHh1SUNBZ0lDQWdaRzlqZFcxbGJuUkZiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9KM0psYm1SbGNrTnZiWEJzWlhSbEp5d2djbVZ1WkdWeUtUdGNiaUFnSUNCOUtUdGNibHh1SUNBZ0lDOHZJRVJwWm1ZZ2RHaGxJR1Z1ZEdseVpTQmtiMk4xYldWdWRDQnZiaUJoWTNScGRtRjBhVzl1SUc5bUlIUm9aU0J3Y205c2JIbG1hV3hzTGx4dUlDQWdJR1J2WTNWdFpXNTBSV3hsYldWdWRDNWthV1ptVDNWMFpYSklWRTFNSUQwZ1pHOWpkVzFsYm5SRmJHVnRaVzUwTG05MWRHVnlTRlJOVER0Y2JseHVJQ0FnSUM4dklGSmxiVzkyWlNCMGFHVWdiRzloWkNCbGRtVnVkQ0JzYVhOMFpXNWxjaXdnYzJsdVkyVWdhWFFuY3lCamIyMXdiR1YwWlM1Y2JpQWdJQ0IzYVc1a2IzY3VjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWduYkc5aFpDY3NJR0ZqZEdsMllYUmxRMjl0Y0c5dVpXNTBjeWs3WEc0Z0lIMDdYRzVjYmlBZ0x5OGdWR2hwY3lCelpXTjBhVzl1SUhkcGJHd2dZWFYwYjIxaGRHbGpZV3hzZVNCd1lYSnpaU0J2ZFhRZ2VXOTFjaUJsYm5ScGNtVWdjR0ZuWlNCMGJ5Qmxibk4xY21VZ1lXeHNYRzRnSUM4dklHTjFjM1J2YlNCbGJHVnRaVzUwY3lCaGNtVWdhRzl2YTJWa0lHbHVkRzh1WEc0Z0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0Nkc2IyRmtKeXdnWVdOMGFYWmhkR1ZEYjIxd2IyNWxiblJ6S1R0Y2JseHVJQ0F2THlCSlppQjBhR1VnWkc5amRXMWxiblFnYUdGeklHRnNjbVZoWkhrZ2JHOWhaR1ZrTENCcGJXMWxaR2xoZEdWc2VTQmhZM1JwZG1GMFpTQjBhR1VnWTI5dGNHOXVaVzUwY3k1Y2JpQWdhV1lnS0dSdlkzVnRaVzUwTG5KbFlXUjVVM1JoZEdVZ1BUMDlJQ2RqYjIxd2JHVjBaU2NwSUhzZ1lXTjBhWFpoZEdWRGIyMXdiMjVsYm5SektDazdJSDFjYm4xY2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IG1ha2U7XG5cbnZhciBfdXRpbFBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xuXG52YXIgX3V0aWxNZW1vcnkgPSByZXF1aXJlKCcuLi91dGlsL21lbW9yeScpO1xuXG52YXIgX2VsZW1lbnRDdXN0b20gPSByZXF1aXJlKCcuLi9lbGVtZW50L2N1c3RvbScpO1xuXG52YXIgcG9vbHMgPSBfdXRpbFBvb2xzLnBvb2xzO1xudmFyIHByb3RlY3RFbGVtZW50ID0gX3V0aWxNZW1vcnkucHJvdGVjdEVsZW1lbnQ7XG52YXIgdW5wcm90ZWN0RWxlbWVudCA9IF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQ7XG52YXIgZW1wdHkgPSB7fTtcblxuLy8gQ2FjaGUgY3JlYXRlZCBub2RlcyBpbnNpZGUgdGhpcyBvYmplY3QuXG5tYWtlLm5vZGVzID0ge307XG5cbi8qKlxuICogQ29udmVydHMgYSBsaXZlIG5vZGUgaW50byBhIHZpcnR1YWwgbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIG1ha2Uobm9kZSwgcHJvdGVjdCkge1xuICB2YXIgbm9kZVR5cGUgPSBub2RlLm5vZGVUeXBlO1xuICB2YXIgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG5cbiAgaWYgKCFub2RlVHlwZSB8fCBub2RlVHlwZSA9PT0gMiB8fCBub2RlVHlwZSA9PT0gNCB8fCBub2RlVHlwZSA9PT0gOCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChub2RlVHlwZSA9PT0gMyAmJiAhbm9kZVZhbHVlLnRyaW0oKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFZpcnR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBub2RlLCBjb250YWluaW5nIG9ubHkgdGhlIGRhdGEgd2Ugd2lzaCB0b1xuICAvLyBkaWZmIGFuZCBwYXRjaC5cbiAgdmFyIGVudHJ5ID0gcG9vbHMuZWxlbWVudE9iamVjdC5nZXQoKTtcblxuICAvLyBBZGQgdG8gaW50ZXJuYWwgbG9va3VwLlxuICBtYWtlLm5vZGVzW2VudHJ5LmVsZW1lbnRdID0gbm9kZTtcblxuICBlbnRyeS5ub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgZW50cnkubm9kZVZhbHVlID0gbm9kZVZhbHVlO1xuICBlbnRyeS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gIGVudHJ5LmF0dHJpYnV0ZXMubGVuZ3RoID0gMDtcblxuICBpZiAocHJvdGVjdCkge1xuICAgIHByb3RlY3RFbGVtZW50KGVudHJ5KTtcbiAgfVxuXG4gIC8vIENvbGxlY3QgYXR0cmlidXRlcy5cbiAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIG5vIGF0dHJpYnV0ZXMsIHNraXAgb3Zlci5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgYXR0cmlidXRlc0xlbmd0aCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXNMZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cmlidXRlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyID0gcG9vbHMuYXR0cmlidXRlT2JqZWN0LmdldCgpO1xuXG4gICAgICAgIGlmIChwcm90ZWN0KSB7XG4gICAgICAgICAgcG9vbHMuYXR0cmlidXRlT2JqZWN0LnByb3RlY3QoYXR0cik7XG4gICAgICAgIH1cblxuICAgICAgICBhdHRyLm5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG4gICAgICAgIGF0dHIudmFsdWUgPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xuXG4gICAgICAgIGVudHJ5LmF0dHJpYnV0ZXNbZW50cnkuYXR0cmlidXRlcy5sZW5ndGhdID0gYXR0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb2xsZWN0IGNoaWxkTm9kZXMuXG4gIHZhciBjaGlsZE5vZGVzID0gbm9kZS5jaGlsZE5vZGVzO1xuICB2YXIgY2hpbGROb2Rlc0xlbmd0aCA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIGNoaWxkIG5vZGVzLCBjb252ZXJ0IHRoZW0gYWxsIHRvIHZpcnR1YWwgbm9kZXMuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSAzICYmIGNoaWxkTm9kZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5ld05vZGUgPSBtYWtlKGNoaWxkTm9kZXNbaV0sIHByb3RlY3QpO1xuXG4gICAgICBpZiAobmV3Tm9kZSkge1xuICAgICAgICBlbnRyeS5jaGlsZE5vZGVzW2VudHJ5LmNoaWxkTm9kZXMubGVuZ3RoXSA9IG5ld05vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyBSZW5hbWUgdGhpcyB0byBmaXJzdC1ydW4sIGJlY2F1c2Ugd2UncmUgY2FsbGluZyB0aGUgYXR0YWNoIGNhbGxiYWNrXG4gIC8vIGFuZCBwcm90ZWN0aW5nIG5vdy5cbiAgaWYgKHByb3RlY3QpIHtcbiAgICBpZiAoX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tlbnRyeS5ub2RlTmFtZV0pIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gZm9yIHRoaXMgZWxlbWVudC4gVXBncmFkZSB3aWxsIHJldHVybiBgdHJ1ZWBcbiAgICAgIC8vIGlmIHRoZSBlbGVtZW50IHdhcyB1cGdyYWRlZCBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMgaXMgdXNlZnVsIHNvIHdlXG4gICAgICAvLyBkb24ndCBlbmQgdXAgaW4gYSBsb29wIHdoZW4gd29ya2luZyB3aXRoIHRoZSBzYW1lIGVsZW1lbnQuXG4gICAgICBpZiAoKDAsIF9lbGVtZW50Q3VzdG9tLnVwZ3JhZGUpKGVudHJ5Lm5vZGVOYW1lLCBub2RlKSkge1xuICAgICAgICAvLyBJZiB0aGUgTm9kZSBpcyBpbiB0aGUgRE9NLCB0cmlnZ2VyIGF0dGFjaGVkIGNhbGxiYWNrLlxuICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUuYXR0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICAgIG5vZGUuYXR0YWNoZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmJXRnJaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096dHhRa0Z4UW5kQ0xFbEJRVWs3TzNsQ1FYSkNTU3hsUVVGbE96c3dRa0ZKZUVNc1owSkJRV2RDT3pzMlFrRkRZU3h0UWtGQmJVSTdPMEZCUlhaRUxFbEJRVWtzUzBGQlN5eHRRa0ZCVXl4RFFVRkRPMEZCUTI1Q0xFbEJRVWtzWTBGQll5dzJRa0ZCYTBJc1EwRkJRenRCUVVOeVF5eEpRVUZKTEdkQ1FVRm5RaXdyUWtGQmIwSXNRMEZCUXp0QlFVTjZReXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPenRCUVVkbUxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPenM3T3pzN096czdRVUZSUkN4VFFVRlRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlF6RkRMRTFCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZETjBJc1RVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXpzN1FVRkZMMElzVFVGQlNTeERRVUZETEZGQlFWRXNTVUZCU1N4UlFVRlJMRXRCUVVzc1EwRkJReXhKUVVGSkxGRkJRVkVzUzBGQlN5eERRVUZETEVsQlFVa3NVVUZCVVN4TFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVOdVJTeFhRVUZQTEV0QlFVc3NRMEZCUXp0SFFVTmtPenRCUVVWRUxFMUJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJUdEJRVU4yUXl4WFFVRlBMRXRCUVVzc1EwRkJRenRIUVVOa096czdPMEZCU1VRc1RVRkJTU3hMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenM3TzBGQlIzUkRMRTFCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRmFrTXNUMEZCU3l4RFFVRkRMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMEZCUXpkRExFOUJRVXNzUTBGQlF5eFRRVUZUTEVkQlFVY3NVMEZCVXl4RFFVRkRPMEZCUXpWQ0xFOUJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVNMVFpeFBRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJUVkNMRTFCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMWdzYTBKQlFXTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRIUVVOMlFqczdPMEZCUjBRc1RVRkJTU3hWUVVGVkxFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXpzN08wRkJSMnBETEUxQlFVa3NWVUZCVlN4RlFVRkZPMEZCUTJRc1VVRkJTU3huUWtGQlowSXNSMEZCUnl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRE96dEJRVVY2UXl4UlFVRkpMR2RDUVVGblFpeEZRVUZGTzBGQlEzQkNMRmRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4blFrRkJaMElzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTjZReXhaUVVGSkxFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE96dEJRVVYyUXl4WlFVRkpMRTlCUVU4c1JVRkJSVHRCUVVOWUxHVkJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xTkJRM0pET3p0QlFVVkVMRmxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNdlFpeFpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTTdPMEZCUldwRExHRkJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdUMEZEYkVRN1MwRkRSanRIUVVOR096czdRVUZIUkN4TlFVRkpMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETzBGQlEycERMRTFCUVVrc1owSkJRV2RDTEVkQlFVY3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU03T3p0QlFVYzVReXhOUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEV0QlFVc3NRMEZCUXl4SlFVRkpMRlZCUVZVc1JVRkJSVHRCUVVOeVF5eFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzWjBKQlFXZENMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRGVrTXNWVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRk0wTXNWVUZCU1N4UFFVRlBMRVZCUVVVN1FVRkRXQ3hoUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETzA5QlEzSkVPMHRCUTBZN1IwRkRSanM3T3p0QlFVbEVMRTFCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMWdzVVVGQlNTd3dRa0ZCVnl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVU3T3pzN1FVRkpPVUlzVlVGQlNTdzBRa0ZCVVN4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eEZRVUZGT3p0QlFVVnFReXhaUVVGSkxFbEJRVWtzUTBGQlF5eFZRVUZWTEVsQlFVa3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTzBGQlF6VkRMR05CUVVrc1EwRkJReXhuUWtGQlowSXNSVUZCUlN4RFFVRkRPMU5CUTNwQ08wOUJRMFk3UzBGRFJqdEhRVU5HT3p0QlFVVkVMRk5CUVU4c1MwRkJTeXhEUVVGRE8wTkJRMlFpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2Ym05a1pTOXRZV3RsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIc2djRzl2YkhNZ1lYTWdYM0J2YjJ4eklIMGdabkp2YlNBbkxpNHZkWFJwYkM5d2IyOXNjeWM3WEc1cGJYQnZjblFnZTF4dUlDQndjbTkwWldOMFJXeGxiV1Z1ZENCaGN5QmZjSEp2ZEdWamRFVnNaVzFsYm5Rc1hHNGdJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUWdZWE1nWDNWdWNISnZkR1ZqZEVWc1pXMWxiblJjYm4wZ1puSnZiU0FuTGk0dmRYUnBiQzl0WlcxdmNua25PMXh1YVcxd2IzSjBJSHNnWTI5dGNHOXVaVzUwY3l3Z2RYQm5jbUZrWlNCOUlHWnliMjBnSnk0dUwyVnNaVzFsYm5RdlkzVnpkRzl0Snp0Y2JseHVkbUZ5SUhCdmIyeHpJRDBnWDNCdmIyeHpPMXh1ZG1GeUlIQnliM1JsWTNSRmJHVnRaVzUwSUQwZ1gzQnliM1JsWTNSRmJHVnRaVzUwTzF4dWRtRnlJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUWdQU0JmZFc1d2NtOTBaV04wUld4bGJXVnVkRHRjYm5aaGNpQmxiWEIwZVNBOUlIdDlPMXh1WEc0dkx5QkRZV05vWlNCamNtVmhkR1ZrSUc1dlpHVnpJR2x1YzJsa1pTQjBhR2x6SUc5aWFtVmpkQzVjYm0xaGEyVXVibTlrWlhNZ1BTQjdmVHRjYmx4dUx5b3FYRzRnS2lCRGIyNTJaWEowY3lCaElHeHBkbVVnYm05a1pTQnBiblJ2SUdFZ2RtbHlkSFZoYkNCdWIyUmxMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQnViMlJsWEc0Z0tpQkFjbVYwZFhKdVhHNGdLaTljYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1oxYm1OMGFXOXVJRzFoYTJVb2JtOWtaU3dnY0hKdmRHVmpkQ2tnZTF4dUlDQnNaWFFnYm05a1pWUjVjR1VnUFNCdWIyUmxMbTV2WkdWVWVYQmxPMXh1SUNCc1pYUWdibTlrWlZaaGJIVmxJRDBnYm05a1pTNXViMlJsVm1Gc2RXVTdYRzVjYmlBZ2FXWWdLQ0Z1YjJSbFZIbHdaU0I4ZkNCdWIyUmxWSGx3WlNBOVBUMGdNaUI4ZkNCdWIyUmxWSGx3WlNBOVBUMGdOQ0I4ZkNCdWIyUmxWSGx3WlNBOVBUMGdPQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2h1YjJSbFZIbHdaU0E5UFQwZ015QW1KaUFoYm05a1pWWmhiSFZsTG5SeWFXMG9LU2tnZTF4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdmVnh1WEc0Z0lDOHZJRlpwY25SMVlXd2djbVZ3Y21WelpXNTBZWFJwYjI0Z2IyWWdZU0J1YjJSbExDQmpiMjUwWVdsdWFXNW5JRzl1YkhrZ2RHaGxJR1JoZEdFZ2QyVWdkMmx6YUNCMGIxeHVJQ0F2THlCa2FXWm1JR0Z1WkNCd1lYUmphQzVjYmlBZ2JHVjBJR1Z1ZEhKNUlEMGdjRzl2YkhNdVpXeGxiV1Z1ZEU5aWFtVmpkQzVuWlhRb0tUdGNibHh1SUNBdkx5QkJaR1FnZEc4Z2FXNTBaWEp1WVd3Z2JHOXZhM1Z3TGx4dUlDQnRZV3RsTG01dlpHVnpXMlZ1ZEhKNUxtVnNaVzFsYm5SZElEMGdibTlrWlR0Y2JseHVJQ0JsYm5SeWVTNXViMlJsVG1GdFpTQTlJRzV2WkdVdWJtOWtaVTVoYldVdWRHOU1iM2RsY2tOaGMyVW9LVHRjYmlBZ1pXNTBjbmt1Ym05a1pWWmhiSFZsSUQwZ2JtOWtaVlpoYkhWbE8xeHVJQ0JsYm5SeWVTNWphR2xzWkU1dlpHVnpMbXhsYm1kMGFDQTlJREE3WEc0Z0lHVnVkSEo1TG1GMGRISnBZblYwWlhNdWJHVnVaM1JvSUQwZ01EdGNibHh1SUNCcFppQW9jSEp2ZEdWamRDa2dlMXh1SUNBZ0lIQnliM1JsWTNSRmJHVnRaVzUwS0dWdWRISjVLVHRjYmlBZ2ZWeHVYRzRnSUM4dklFTnZiR3hsWTNRZ1lYUjBjbWxpZFhSbGN5NWNiaUFnYkdWMElHRjBkSEpwWW5WMFpYTWdQU0J1YjJSbExtRjBkSEpwWW5WMFpYTTdYRzVjYmlBZ0x5OGdTV1lnZEdobElHVnNaVzFsYm5RZ2FHRnpJRzV2SUdGMGRISnBZblYwWlhNc0lITnJhWEFnYjNabGNpNWNiaUFnYVdZZ0tHRjBkSEpwWW5WMFpYTXBJSHRjYmlBZ0lDQnNaWFFnWVhSMGNtbGlkWFJsYzB4bGJtZDBhQ0E5SUdGMGRISnBZblYwWlhNdWJHVnVaM1JvTzF4dVhHNGdJQ0FnYVdZZ0tHRjBkSEpwWW5WMFpYTk1aVzVuZEdncElIdGNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dZWFIwY21saWRYUmxjMHhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0JoZEhSeUlEMGdjRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wTG1kbGRDZ3BPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHdjbTkwWldOMEtTQjdYRzRnSUNBZ0lDQWdJQ0FnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuQnliM1JsWTNRb1lYUjBjaWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmhkSFJ5TG01aGJXVWdQU0JoZEhSeWFXSjFkR1Z6VzJsZExtNWhiV1U3WEc0Z0lDQWdJQ0FnSUdGMGRISXVkbUZzZFdVZ1BTQmhkSFJ5YVdKMWRHVnpXMmxkTG5aaGJIVmxPMXh1WEc0Z0lDQWdJQ0FnSUdWdWRISjVMbUYwZEhKcFluVjBaWE5iWlc1MGNua3VZWFIwY21saWRYUmxjeTVzWlc1bmRHaGRJRDBnWVhSMGNqdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZMeUJEYjJ4c1pXTjBJR05vYVd4a1RtOWtaWE11WEc0Z0lHeGxkQ0JqYUdsc1pFNXZaR1Z6SUQwZ2JtOWtaUzVqYUdsc1pFNXZaR1Z6TzF4dUlDQnNaWFFnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ0E5SUc1dlpHVXVZMmhwYkdST2IyUmxjeTVzWlc1bmRHZzdYRzVjYmlBZ0x5OGdTV1lnZEdobElHVnNaVzFsYm5RZ2FHRnpJR05vYVd4a0lHNXZaR1Z6TENCamIyNTJaWEowSUhSb1pXMGdZV3hzSUhSdklIWnBjblIxWVd3Z2JtOWtaWE11WEc0Z0lHbG1JQ2h1YjJSbExtNXZaR1ZVZVhCbElDRTlQU0F6SUNZbUlHTm9hV3hrVG05a1pYTXBJSHRjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJR05vYVd4a1RtOWtaWE5NWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzVsZDA1dlpHVWdQU0J0WVd0bEtHTm9hV3hrVG05a1pYTmJhVjBzSUhCeWIzUmxZM1FwTzF4dVhHNGdJQ0FnSUNCcFppQW9ibVYzVG05a1pTa2dlMXh1SUNBZ0lDQWdJQ0JsYm5SeWVTNWphR2xzWkU1dlpHVnpXMlZ1ZEhKNUxtTm9hV3hrVG05a1pYTXViR1Z1WjNSb1hTQTlJRzVsZDA1dlpHVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeThnVkU5RVR5QlNaVzVoYldVZ2RHaHBjeUIwYnlCbWFYSnpkQzF5ZFc0c0lHSmxZMkYxYzJVZ2QyVW5jbVVnWTJGc2JHbHVaeUIwYUdVZ1lYUjBZV05vSUdOaGJHeGlZV05yWEc0Z0lDOHZJR0Z1WkNCd2NtOTBaV04wYVc1bklHNXZkeTVjYmlBZ2FXWWdLSEJ5YjNSbFkzUXBJSHRjYmlBZ0lDQnBaaUFvWTI5dGNHOXVaVzUwYzF0bGJuUnllUzV1YjJSbFRtRnRaVjBwSUh0Y2JpQWdJQ0FnSUM4dklGSmxjMlYwSUhSb1pTQndjbTkwYjNSNWNHVWdZMmhoYVc0Z1ptOXlJSFJvYVhNZ1pXeGxiV1Z1ZEM0Z1ZYQm5jbUZrWlNCM2FXeHNJSEpsZEhWeWJpQmdkSEoxWldCY2JpQWdJQ0FnSUM4dklHbG1JSFJvWlNCbGJHVnRaVzUwSUhkaGN5QjFjR2R5WVdSbFpDQm1iM0lnZEdobElHWnBjbk4wSUhScGJXVXVJRlJvYVhNZ2FYTWdkWE5sWm5Wc0lITnZJSGRsWEc0Z0lDQWdJQ0F2THlCa2IyNG5kQ0JsYm1RZ2RYQWdhVzRnWVNCc2IyOXdJSGRvWlc0Z2QyOXlhMmx1WnlCM2FYUm9JSFJvWlNCellXMWxJR1ZzWlcxbGJuUXVYRzRnSUNBZ0lDQnBaaUFvZFhCbmNtRmtaU2hsYm5SeWVTNXViMlJsVG1GdFpTd2dibTlrWlNrcElIdGNiaUFnSUNBZ0lDQWdMeThnU1dZZ2RHaGxJRTV2WkdVZ2FYTWdhVzRnZEdobElFUlBUU3dnZEhKcFoyZGxjaUJoZEhSaFkyaGxaQ0JqWVd4c1ltRmpheTVjYmlBZ0lDQWdJQ0FnYVdZZ0tHNXZaR1V1Y0dGeVpXNTBUbTlrWlNBbUppQnViMlJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnViMlJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnNvS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCbGJuUnllVHRjYm4xY2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucmVsZWFzZU5vZGUgPSByZWxlYXNlTm9kZTtcbmV4cG9ydHMucGF0Y2hOb2RlID0gcGF0Y2hOb2RlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfY3VzdG9tRXZlbnQgPSByZXF1aXJlKCdjdXN0b20tZXZlbnQnKTtcblxudmFyIF9jdXN0b21FdmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jdXN0b21FdmVudCk7XG5cbnZhciBfd29ya2VyQ3JlYXRlID0gcmVxdWlyZSgnLi4vd29ya2VyL2NyZWF0ZScpO1xuXG52YXIgX3V0aWxNZW1vcnkgPSByZXF1aXJlKCcuLi91dGlsL21lbW9yeScpO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsUGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbC9wYXJzZXInKTtcblxudmFyIF9wYXRjaGVzUHJvY2VzcyA9IHJlcXVpcmUoJy4uL3BhdGNoZXMvcHJvY2VzcycpO1xuXG52YXIgX3BhdGNoZXNQcm9jZXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhdGNoZXNQcm9jZXNzKTtcblxudmFyIF9tYWtlID0gcmVxdWlyZSgnLi9tYWtlJyk7XG5cbnZhciBfbWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYWtlKTtcblxudmFyIF9lbGVtZW50TWFrZSA9IHJlcXVpcmUoJy4uL2VsZW1lbnQvbWFrZScpO1xuXG52YXIgX2VsZW1lbnRNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRNYWtlKTtcblxudmFyIF9lbGVtZW50R2V0ID0gcmVxdWlyZSgnLi4vZWxlbWVudC9nZXQnKTtcblxudmFyIF9lbGVtZW50R2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRHZXQpO1xuXG52YXIgX3N5bmMgPSByZXF1aXJlKCcuL3N5bmMnKTtcblxudmFyIF9zeW5jMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bmMpO1xuXG52YXIgX3RyZWUgPSByZXF1aXJlKCcuL3RyZWUnKTtcblxuLyoqXG4gKiBXaGVuIHRoZSB3b3JrZXIgY29tcGxldGVzLCBjbGVhbiB1cCBtZW1vcnkgYW5kIHNjaGVkdWxlIHRoZSBuZXh0IHJlbmRlciBpZlxuICogbmVjZXNzYXJ5LlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gZWxlbWVudE1ldGFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBjb21wbGV0ZVdvcmtlclJlbmRlcihlbGVtZW50LCBlbGVtZW50TWV0YSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGV2KSB7XG4gICAgdmFyIG5vZGVzID0gZXYuZGF0YS5ub2RlcztcblxuICAgIC8vIEFkZCBuZXcgZWxlbWVudHMuXG4gICAgaWYgKG5vZGVzLmFkZGl0aW9ucy5sZW5ndGgpIHtcbiAgICAgIG5vZGVzLmFkZGl0aW9ucy5tYXAoX3V0aWxNZW1vcnkucHJvdGVjdEVsZW1lbnQpLm1hcChmdW5jdGlvbiAoZGVzY3JpcHRvcikge1xuICAgICAgICAvLyBJbmplY3QgaW50byB0aGUgYG9sZFRyZWVgIHNvIGl0J3MgY2xlYW5lZCB1cCBjb3JyZWN0bHkuXG4gICAgICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUuY2hpbGROb2Rlcy5wdXNoKGRlc2NyaXB0b3IpO1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgIH0pLmZvckVhY2goX2VsZW1lbnRNYWtlMlsnZGVmYXVsdCddKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVSZW5kZXIgPSBmdW5jdGlvbiBjb21wbGV0ZVJlbmRlcigpIHtcbiAgICAgIC8vIFJlbW92ZSB1bnVzZWQgZWxlbWVudHMuXG4gICAgICBpZiAobm9kZXMucmVtb3ZhbHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBlbHMgPSBub2Rlcy5yZW1vdmFscy5tYXAoZnVuY3Rpb24gKHV1aWQpIHtcbiAgICAgICAgICByZXR1cm4gX3V0aWxQb29scy5wb29scy5lbGVtZW50T2JqZWN0Ll91dWlkW3V1aWRdO1xuICAgICAgICB9KS5tYXAoX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudCkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlbCk7XG4gICAgICAgICAgY29uc29sZS5sb2coZWwucGFyZW50Tm9kZSk7XG4gICAgICAgICAgdmFyIGlkeCA9IGVsZW1lbnRNZXRhLm9sZFRyZWUuY2hpbGROb2Rlcy5pbmRleE9mKGVsKTtcbiAgICAgICAgICBlbGVtZW50TWV0YS5vbGRUcmVlLmNoaWxkTm9kZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXNldCBpbnRlcm5hbCBjYWNoZXMgZm9yIHF1aWNrZXIgbG9va3VwcyBpbiB0aGUgZnV0dXJlcy5cbiAgICAgIGVsZW1lbnRNZXRhLl9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcbiAgICAgIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgPSBlbGVtZW50Lm91dGVySFRNTDtcbiAgICAgIGVsZW1lbnRNZXRhLl90ZXh0Q29udGVudCA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cbiAgICAgIC8vIFJlY3ljbGUgYWxsIHVucHJvdGVjdGVkIGFsbG9jYXRpb25zLlxuICAgICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuXG4gICAgICBlbGVtZW50TWV0YS5oYXNXb3JrZXJSZW5kZXJlZCA9IHRydWU7XG4gICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgICAvLyBUaGlzIGlzIGRlc2lnbmVkIHRvIGhhbmRsZSB1c2UgY2FzZXMgd2hlcmUgcmVuZGVycyBhcmUgYmVpbmcgaGFtbWVyZWRcbiAgICAgIC8vIG9yIHdoZW4gdHJhbnNpdGlvbnMgYXJlIHVzZWQgd2l0aCBQcm9taXNlcy5cbiAgICAgIGlmIChlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIpIHtcbiAgICAgICAgdmFyIG5leHRSZW5kZXIgPSBlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXI7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIGJ1ZmZlci5cbiAgICAgICAgZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIE5vdGljaW5nIHNvbWUgd2VpcmQgcGVyZm9ybWFuY2UgaW1wbGljYXRpb25zIHdpdGggdGhpcyBjb25jZXB0LlxuICAgICAgICBwYXRjaE5vZGUoZWxlbWVudCwgbmV4dFJlbmRlci5uZXdIVE1MLCBuZXh0UmVuZGVyLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNwYXRjaCBhbiBldmVudCBvbiB0aGUgZWxlbWVudCBvbmNlIHJlbmRlcmluZyBoYXMgY29tcGxldGVkLlxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBfY3VzdG9tRXZlbnQyWydkZWZhdWx0J10oJ3JlbmRlckNvbXBsZXRlJykpO1xuICAgIH07XG5cbiAgICAvLyBXYWl0IHVudGlsIGFsbCBwcm9taXNlcyBoYXZlIHJlc29sdmVkLCBiZWZvcmUgZmluaXNoaW5nIHVwIHRoZSBwYXRjaFxuICAgIC8vIGN5Y2xlLlxuICAgIC8vIFByb2Nlc3MgdGhlIGRhdGEgaW1tZWRpYXRlbHkgYW5kIHdhaXQgdW50aWwgYWxsIHRyYW5zaXRpb24gY2FsbGJhY2tzXG4gICAgLy8gaGF2ZSBjb21wbGV0ZWQuXG4gICAgdmFyIHByb2Nlc3NQcm9taXNlID0gKDAsIF9wYXRjaGVzUHJvY2VzczJbJ2RlZmF1bHQnXSkoZWxlbWVudCwgZXYuZGF0YS5wYXRjaGVzKTtcblxuICAgIC8vIE9wZXJhdGUgc3luY2hyb25vdXNseSB1bmxlc3Mgb3B0ZWQgaW50byBhIFByb21pc2UtY2hhaW4uXG4gICAgaWYgKHByb2Nlc3NQcm9taXNlKSB7XG4gICAgICBwcm9jZXNzUHJvbWlzZS50aGVuKGNvbXBsZXRlUmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVSZW5kZXIoKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUmVsZWFzZSdzIHRoZSBhbGxvY2F0ZWQgb2JqZWN0cyBhbmQgcmVjeWNsZXMgaW50ZXJuYWwgbWVtb3J5LlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gcmVsZWFzZU5vZGUoZWxlbWVudCkge1xuICB2YXIgZWxlbWVudE1ldGEgPSBfdHJlZS5UcmVlQ2FjaGUuZ2V0KGVsZW1lbnQpIHx8IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIGEgd29ya2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVsZW1lbnQsIHRoZW4ga2lsbCBpdC5cbiAgaWYgKGVsZW1lbnRNZXRhLndvcmtlcikge1xuICAgIGVsZW1lbnRNZXRhLndvcmtlci50ZXJtaW5hdGUoKTtcbiAgfVxuXG4gIC8vIElmIHRoZXJlIHdhcyBhIHRyZWUgc2V0IHVwLCByZWN5Y2xlIHRoZSBtZW1vcnkgYWxsb2NhdGVkIGZvciBpdC5cbiAgaWYgKGVsZW1lbnRNZXRhLm9sZFRyZWUpIHtcbiAgICAoMCwgX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudCkoZWxlbWVudE1ldGEub2xkVHJlZSk7XG4gICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoaXMgZWxlbWVudCdzIG1ldGEgb2JqZWN0IGZyb20gdGhlIGNhY2hlLlxuICBfdHJlZS5UcmVlQ2FjaGVbJ2RlbGV0ZSddKGVsZW1lbnQpO1xufVxuXG4vKipcbiAqIFBhdGNoZXMgYW4gZWxlbWVudCdzIERPTSB0byBtYXRjaCB0aGF0IG9mIHRoZSBwYXNzZWQgbWFya3VwLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbmV3SFRNTFxuICovXG5cbmZ1bmN0aW9uIHBhdGNoTm9kZShlbGVtZW50LCBuZXdIVE1MLCBvcHRpb25zKSB7XG4gIC8vIEVuc3VyZSB0aGF0IHRoZSBkb2N1bWVudCBkaXNhYmxlIHdvcmtlciBpcyBhbHdheXMgcGlja2VkIHVwLlxuICBpZiAodHlwZW9mIG9wdGlvbnMuZW5hYmxlV29ya2VyICE9PSAnYm9vbGVhbicpIHtcbiAgICBvcHRpb25zLmVuYWJsZVdvcmtlciA9IGRvY3VtZW50LkVOQUJMRV9XT1JLRVI7XG4gIH1cblxuICAvLyBUaGUgZWxlbWVudCBtZXRhIG9iamVjdCBpcyBhIGxvY2F0aW9uIHRvIGFzc29jaWF0ZSBtZXRhZGF0YSB3aXRoIHRoZVxuICAvLyBjdXJyZW50bHkgcmVuZGVyaW5nIGVsZW1lbnQuIFRoaXMgcHJldmVudHMgYXR0YWNoaW5nIHByb3BlcnRpZXMgdG8gdGhlXG4gIC8vIGluc3RhbmNlIGl0c2VsZi5cbiAgdmFyIGVsZW1lbnRNZXRhID0gX3RyZWUuVHJlZUNhY2hlLmdldChlbGVtZW50KSB8fCB7fTtcblxuICAvLyBBbHdheXMgZW5zdXJlIHRoZSBtb3N0IHVwLXRvLWRhdGUgbWV0YSBvYmplY3QgaXMgc3RvcmVkLlxuICBfdHJlZS5UcmVlQ2FjaGUuc2V0KGVsZW1lbnQsIGVsZW1lbnRNZXRhKTtcblxuICAvLyBJZiB0aGlzIGVsZW1lbnQgaXMgYWxyZWFkeSByZW5kZXJpbmcsIGFkZCB0aGlzIG5ldyByZW5kZXIgcmVxdWVzdCBpbnRvIHRoZVxuICAvLyBidWZmZXIgcXVldWUuXG4gIGlmIChlbGVtZW50TWV0YS5pc1JlbmRlcmluZykge1xuICAgIHJldHVybiBlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIgPSB7IG5ld0hUTUw6IG5ld0hUTUwsIG9wdGlvbnM6IG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLlxuICB2YXIgc2FtZUlubmVySFRNTCA9IG9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudC5pbm5lckhUTUwgPT09IG5ld0hUTUw7XG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLlxuICB2YXIgc2FtZU91dGVySFRNTCA9ICFvcHRpb25zLmlubmVyICYmIGVsZW1lbnQub3V0ZXJIVE1MID09PSBuZXdIVE1MO1xuXG4gIC8vIElmIHRoZSBjb250ZW50cyBoYXZlbid0IGNoYW5nZWQsIGFib3J0LCBzaW5jZSB0aGVyZSBpcyBubyBwb2ludCBpblxuICAvLyBjb250aW51aW5nLlxuICBpZiAoKHNhbWVJbm5lckhUTUwgfHwgc2FtZU91dGVySFRNTCkgJiYgZWxlbWVudE1ldGEub2xkVHJlZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN0YXJ0IHdpdGggd29ya2VyIGJlaW5nIGEgZmFsc3kgdmFsdWUuXG4gIHZhciB3b3JrZXIgPSBudWxsO1xuXG4gIC8vIElmIHdlIGNhbiB1c2UgYSB3b3JrZXIgYW5kIHRoZSB1c2VyIHdhbnRzIG9uZSwgdHJ5IGFuZCBjcmVhdGUgaXQuXG4gIGlmIChvcHRpb25zLmVuYWJsZVdvcmtlciAmJiBfd29ya2VyQ3JlYXRlLmhhc1dvcmtlcikge1xuICAgIC8vIENyZWF0ZSBhIHdvcmtlciBmb3IgdGhpcyBlbGVtZW50LlxuICAgIHdvcmtlciA9IGVsZW1lbnRNZXRhLndvcmtlciA9IGVsZW1lbnRNZXRhLndvcmtlciB8fCAoMCwgX3dvcmtlckNyZWF0ZS5jcmVhdGUpKCk7XG4gIH1cblxuICBpZiAoXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50TWV0YS5faW5uZXJIVE1MICE9PSBlbGVtZW50LmlubmVySFRNTCB8fFxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgIW9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudE1ldGEuX291dGVySFRNTCAhPT0gZWxlbWVudC5vdXRlckhUTUwgfHxcblxuICAvLyBJZiB0aGUgdGV4dCBjb250ZW50IGV2ZXIgY2hhbmdlcywgcmVjYWxjdWxhdGUgdGhlIHRyZWUuXG4gIGVsZW1lbnRNZXRhLl90ZXh0Q29udGVudCAhPT0gZWxlbWVudC50ZXh0Q29udGVudCkge1xuICAgIGlmIChlbGVtZW50TWV0YS5vbGRUcmVlKSB7XG4gICAgICAoMCwgX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudCkoZWxlbWVudE1ldGEub2xkVHJlZSk7XG4gICAgICAoMCwgX3V0aWxNZW1vcnkuY2xlYW5NZW1vcnkpKCk7XG4gICAgfVxuXG4gICAgZWxlbWVudE1ldGEub2xkVHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkoZWxlbWVudCwgdHJ1ZSk7XG4gICAgZWxlbWVudE1ldGEudXBkYXRlT2xkVHJlZSA9IHRydWU7XG4gIH1cblxuICAvLyBXaWxsIHdhbnQgdG8gZW5zdXJlIHRoYXQgdGhlIGZpcnN0IHJlbmRlciB3ZW50IHRocm91Z2gsIHRoZSB3b3JrZXIgY2FuXG4gIC8vIHRha2UgYSBiaXQgdG8gc3RhcnR1cCBhbmQgd2Ugd2FudCB0byBzaG93IGNoYW5nZXMgYXMgc29vbiBhcyBwb3NzaWJsZS5cbiAgaWYgKG9wdGlvbnMuZW5hYmxlV29ya2VyICYmIF93b3JrZXJDcmVhdGUuaGFzV29ya2VyICYmIHdvcmtlcikge1xuICAgIC8vIFNldCBhIHJlbmRlciBsb2NrIGFzIHRvIG5vdCBmbG9vZCB0aGUgd29ya2VyLlxuICAgIGVsZW1lbnRNZXRhLmlzUmVuZGVyaW5nID0gdHJ1ZTtcblxuICAgIC8vIEF0dGFjaCBhbGwgcHJvcGVydGllcyBoZXJlIHRvIHRyYW5zcG9ydC5cbiAgICB2YXIgdHJhbnNmZXJPYmplY3QgPSB7fTtcblxuICAgIC8vIFRoaXMgc2hvdWxkIG9ubHkgb2NjdXIgb25jZSwgb3Igd2hlbmV2ZXIgdGhlIG1hcmt1cCBjaGFuZ2VzIGV4dGVybmFsbHlcbiAgICAvLyB0byBkaWZmSFRNTC5cbiAgICBpZiAoIWVsZW1lbnRNZXRhLmhhc1dvcmtlclJlbmRlcmVkIHx8IGVsZW1lbnRNZXRhLnVwZGF0ZU9sZFRyZWUpIHtcbiAgICAgIHRyYW5zZmVyT2JqZWN0Lm9sZFRyZWUgPSBlbGVtZW50TWV0YS5vbGRUcmVlO1xuICAgICAgZWxlbWVudE1ldGEudXBkYXRlT2xkVHJlZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEF0dGFjaCB0aGUgcGFyZW50IGVsZW1lbnQncyB1dWlkLlxuICAgIHRyYW5zZmVyT2JqZWN0LnV1aWQgPSBlbGVtZW50TWV0YS5vbGRUcmVlLmVsZW1lbnQ7XG5cbiAgICBpZiAodHlwZW9mIG5ld0hUTUwgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5uZXdUcmVlID0gKDAsIF9tYWtlMlsnZGVmYXVsdCddKShuZXdIVE1MKTtcblxuICAgICAgLy8gVHJhbnNmZXIgdGhpcyBidWZmZXIgdG8gdGhlIHdvcmtlciwgd2hpY2ggd2lsbCB0YWtlIG92ZXIgYW5kIHByb2Nlc3MgdGhlXG4gICAgICAvLyBtYXJrdXAuXG4gICAgICB3b3JrZXIucG9zdE1lc3NhZ2UodHJhbnNmZXJPYmplY3QpO1xuXG4gICAgICAvLyBXYWl0IGZvciB0aGUgd29ya2VyIHRvIGZpbmlzaCBwcm9jZXNzaW5nIGFuZCB0aGVuIGFwcGx5IHRoZSBwYXRjaHNldC5cbiAgICAgIHdvcmtlci5vbm1lc3NhZ2UgPSBjb21wbGV0ZVdvcmtlclJlbmRlcihlbGVtZW50LCBlbGVtZW50TWV0YSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMZXQgdGhlIGJyb3dzZXIgY29weSB0aGUgSFRNTCBpbnRvIHRoZSB3b3JrZXIsIGNvbnZlcnRpbmcgdG8gYVxuICAgIC8vIHRyYW5zZmVyYWJsZSBvYmplY3QgaXMgdG9vIGV4cGVuc2l2ZS5cbiAgICB0cmFuc2Zlck9iamVjdC5uZXdIVE1MID0gbmV3SFRNTDtcblxuICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvIHNlbmQgdG8gd29ya2VyLlxuICAgIHRyYW5zZmVyT2JqZWN0LmlzSW5uZXIgPSBvcHRpb25zLmlubmVyO1xuXG4gICAgLy8gVHJhbnNmZXIgdGhpcyBidWZmZXIgdG8gdGhlIHdvcmtlciwgd2hpY2ggd2lsbCB0YWtlIG92ZXIgYW5kIHByb2Nlc3MgdGhlXG4gICAgLy8gbWFya3VwLlxuICAgIHdvcmtlci5wb3N0TWVzc2FnZSh0cmFuc2Zlck9iamVjdCk7XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgd29ya2VyIHRvIGZpbmlzaCBwcm9jZXNzaW5nIGFuZCB0aGVuIGFwcGx5IHRoZSBwYXRjaHNldC5cbiAgICB3b3JrZXIub25tZXNzYWdlID0gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuICB9IGVsc2Uge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBXZSdyZSByZW5kZXJpbmcgaW4gdGhlIFVJIHRocmVhZC5cbiAgICAgIGVsZW1lbnRNZXRhLmlzUmVuZGVyaW5nID0gdHJ1ZTtcblxuICAgICAgdmFyIHBhdGNoZXMgPSBbXTtcbiAgICAgIHZhciBuZXdUcmVlID0gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiBuZXdIVE1MID09PSAnc3RyaW5nJykge1xuICAgICAgICBuZXdUcmVlID0gKDAsIF91dGlsUGFyc2VyLnBhcnNlSFRNTCkobmV3SFRNTCwgb3B0aW9ucy5pbm5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdUcmVlID0gKDAsIF9tYWtlMlsnZGVmYXVsdCddKShuZXdIVE1MKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuaW5uZXIpIHtcbiAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSBuZXdUcmVlO1xuXG4gICAgICAgIG5ld1RyZWUgPSB7XG4gICAgICAgICAgY2hpbGROb2RlczogY2hpbGROb2RlcyxcblxuICAgICAgICAgIGF0dHJpYnV0ZXM6IGVsZW1lbnRNZXRhLm9sZFRyZWUuYXR0cmlidXRlcyxcbiAgICAgICAgICBlbGVtZW50OiBlbGVtZW50TWV0YS5vbGRUcmVlLmVsZW1lbnQsXG4gICAgICAgICAgbm9kZU5hbWU6IGVsZW1lbnRNZXRhLm9sZFRyZWUubm9kZU5hbWUsXG4gICAgICAgICAgbm9kZVZhbHVlOiBlbGVtZW50TWV0YS5vbGRUcmVlLm5vZGVWYWx1ZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB2YXIgb2xkVHJlZU5hbWUgPSBlbGVtZW50TWV0YS5vbGRUcmVlLm5vZGVOYW1lIHx8ICcnO1xuICAgICAgdmFyIG5ld05vZGVOYW1lID0gbmV3VHJlZSAmJiBuZXdUcmVlLm5vZGVOYW1lO1xuXG4gICAgICAvLyBJZiB0aGUgZWxlbWVudCBub2RlIHR5cGVzIG1hdGNoLCB0cnkgYW5kIGNvbXBhcmUgdGhlbS5cbiAgICAgIGlmIChvbGRUcmVlTmFtZSA9PT0gbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgLy8gU3luY2hyb25pemUgdGhlIHRyZWUuXG4gICAgICAgIF9zeW5jMlsnZGVmYXVsdCddLmNhbGwocGF0Y2hlcywgZWxlbWVudE1ldGEub2xkVHJlZSwgbmV3VHJlZSk7XG4gICAgICB9XG4gICAgICAvLyBPdGhlcndpc2UgcmVwbGFjZSB0aGUgdG9wIGxldmVsIGVsZW1lbnRzLlxuICAgICAgZWxzZSBpZiAobmV3SFRNTCkge1xuICAgICAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0ge1xuICAgICAgICAgICAgX19kb19fOiAwLFxuICAgICAgICAgICAgb2xkOiBlbGVtZW50TWV0YS5vbGRUcmVlLFxuICAgICAgICAgICAgJ25ldyc6IG5ld1RyZWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgKDAsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQpKGVsZW1lbnRNZXRhLm9sZFRyZWUpO1xuXG4gICAgICAgICAgZWxlbWVudE1ldGEub2xkVHJlZSA9IG5ld1RyZWU7XG4gICAgICAgIH1cblxuICAgICAgdmFyIGNvbXBsZXRlUmVuZGVyID0gZnVuY3Rpb24gY29tcGxldGVSZW5kZXIoKSB7XG4gICAgICAgIC8vIE1hcmsgdGhhdCB0aGlzIGVsZW1lbnQgaGFzIGluaXRpYWxseSByZW5kZXJlZCBhbmQgaXMgZG9uZSByZW5kZXJpbmcuXG4gICAgICAgIGVsZW1lbnRNZXRhLmlzUmVuZGVyaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBpbm5lckhUTUwuXG4gICAgICAgIGVsZW1lbnRNZXRhLl9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgZWxlbWVudE1ldGEuX291dGVySFRNTCA9IGVsZW1lbnQub3V0ZXJIVE1MO1xuICAgICAgICBlbGVtZW50TWV0YS5fdGV4dENvbnRlbnQgPSBlbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgICAgICgwLCBfdXRpbE1lbW9yeS5jbGVhbk1lbW9yeSkoKTtcblxuICAgICAgICAvLyBDbGVhbiBvdXQgdGhlIHBhdGNoZXMgYXJyYXkuXG4gICAgICAgIHBhdGNoZXMubGVuZ3RoID0gMDtcblxuICAgICAgICAvLyBEaXNwYXRjaCBhbiBldmVudCBvbiB0aGUgZWxlbWVudCBvbmNlIHJlbmRlcmluZyBoYXMgY29tcGxldGVkLlxuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IF9jdXN0b21FdmVudDJbJ2RlZmF1bHQnXSgncmVuZGVyQ29tcGxldGUnKSk7XG5cbiAgICAgICAgLy8gVE9ETyBVcGRhdGUgdGhpcyBjb21tZW50IGFuZC9vciByZWZhY3RvciB0byB1c2UgdGhlIHNhbWUgYXMgdGhlIFdvcmtlci5cbiAgICAgICAgaWYgKGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlcikge1xuICAgICAgICAgIHZhciBuZXh0UmVuZGVyID0gZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyO1xuICAgICAgICAgIGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIC8vIE5vdGljaW5nIHNvbWUgd2VpcmQgcGVyZm9ybWFuY2UgaW1wbGljYXRpb25zIHdpdGggdGhpcyBjb25jZXB0LlxuICAgICAgICAgIHBhdGNoTm9kZShlbGVtZW50LCBuZXh0UmVuZGVyLm5ld0hUTUwsIG5leHRSZW5kZXIub3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIFByb2Nlc3MgdGhlIGRhdGEgaW1tZWRpYXRlbHkgYW5kIHdhaXQgdW50aWwgYWxsIHRyYW5zaXRpb24gY2FsbGJhY2tzXG4gICAgICAvLyBoYXZlIGNvbXBsZXRlZC5cbiAgICAgIHZhciBwcm9jZXNzUHJvbWlzZSA9ICgwLCBfcGF0Y2hlc1Byb2Nlc3MyWydkZWZhdWx0J10pKGVsZW1lbnQsIHBhdGNoZXMpO1xuXG4gICAgICAvLyBPcGVyYXRlIHN5bmNocm9ub3VzbHkgdW5sZXNzIG9wdGVkIGludG8gYSBQcm9taXNlLWNoYWluLlxuICAgICAgaWYgKHByb2Nlc3NQcm9taXNlKSB7XG4gICAgICAgIHByb2Nlc3NQcm9taXNlLnRoZW4oY29tcGxldGVSZW5kZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGVSZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDI1dlpHVXZjR0YwWTJndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096c3lRa0ZCZDBJc1kwRkJZenM3T3pzMFFrRkRXU3hyUWtGQmEwSTdPekJDUVVOT0xHZENRVUZuUWpzN2VVSkJRM2hFTEdWQlFXVTdPekJDUVVOWUxHZENRVUZuUWpzN09FSkJRMllzYjBKQlFXOUNPenM3TzI5Q1FVTXhRaXhSUVVGUk96czdPekpDUVVOTUxHbENRVUZwUWpzN096c3dRa0ZEYkVJc1owSkJRV2RDT3pzN08yOUNRVU5zUWl4UlFVRlJPenM3TzI5Q1FVTklMRkZCUVZFN096czdPenM3T3pzN1FVRlZiRU1zVTBGQlV5eHZRa0ZCYjBJc1EwRkJReXhQUVVGUExFVkJRVVVzVjBGQlZ5eEZRVUZGTzBGQlEyeEVMRk5CUVU4c1ZVRkJVeXhGUVVGRkxFVkJRVVU3UVVGRGJFSXNVVUZCU1N4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdPenRCUVVjeFFpeFJRVUZKTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRekZDTEZkQlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXcwUWtGQlowSXNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJRU3hWUVVGVkxFVkJRVWs3TzBGQlJYQkVMRzFDUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGFFUXNaVUZCVHl4VlFVRlZMRU5CUVVNN1QwRkRia0lzUTBGQlF5eERRVUZETEU5QlFVOHNNRUpCUVdFc1EwRkJRenRMUVVONlFqczdRVUZGUkN4UlFVRkpMR05CUVdNc1IwRkJSeXhUUVVGcVFpeGpRVUZqTEVkQlFXTTdPMEZCUlRsQ0xGVkJRVWtzUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRla0lzV1VGQlNTeEhRVUZITEVkQlFVY3NTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlFTeEpRVUZKTzJsQ1FVRkpMR2xDUVVGTkxHRkJRV0VzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRPMU5CUVVFc1EwRkJReXhEUVVOc1JTeEhRVUZITERoQ1FVRnJRaXhEUVVOeVFpeFBRVUZQTEVOQlFVTXNWVUZCVXl4RlFVRkZMRVZCUVVVN1FVRkRjRUlzYVVKQlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03UVVGRGFFSXNhVUpCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUXpOQ0xHTkJRVWtzUjBGQlJ5eEhRVUZITEZkQlFWY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0QlFVTnlSQ3h4UWtGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0VFFVTXZReXhEUVVGRExFTkJRVU03VDBGRFRqczdPMEZCUjBRc2FVSkJRVmNzUTBGQlF5eFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNelF5eHBRa0ZCVnl4RFFVRkRMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETzBGQlF6TkRMR2xDUVVGWExFTkJRVU1zV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVWN2UXl4dlEwRkJZU3hEUVVGRE96dEJRVVZrTEdsQ1FVRlhMRU5CUVVNc2FVSkJRV2xDTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNKRExHbENRVUZYTEVOQlFVTXNWMEZCVnl4SFFVRkhMRXRCUVVzc1EwRkJRenM3T3p0QlFVbG9ReXhWUVVGSkxGZEJRVmNzUTBGQlF5eFpRVUZaTEVWQlFVVTdRVUZETlVJc1dVRkJTU3hWUVVGVkxFZEJRVWNzVjBGQlZ5eERRVUZETEZsQlFWa3NRMEZCUXpzN08wRkJSekZETEcxQ1FVRlhMRU5CUVVNc1dVRkJXU3hIUVVGSExGTkJRVk1zUTBGQlF6czdPMEZCUjNKRExHbENRVUZUTEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1EwRkJReXhQUVVGUExFVkJRVVVzVlVGQlZTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMDlCUXpWRU96czdRVUZIUkN4aFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRExEWkNRVUZuUWl4blFrRkJaMElzUTBGQlF5eERRVUZETEVOQlFVTTdTMEZETVVRc1EwRkJRenM3T3pzN08wRkJUVVlzVVVGQlNTeGpRVUZqTEVkQlFVY3NhVU5CUVdVc1QwRkJUeXhGUVVGRkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN096dEJRVWM1UkN4UlFVRkpMR05CUVdNc1JVRkJSVHRCUVVGRkxHOUNRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE8wdEJRVVVzVFVGRGRrUTdRVUZCUlN4dlFrRkJZeXhGUVVGRkxFTkJRVU03UzBGQlJUdEhRVU16UWl4RFFVRkRPME5CUTBnN096czdPenM3TzBGQlQwMHNVMEZCVXl4WFFVRlhMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRMjVETEUxQlFVa3NWMEZCVnl4SFFVRkhMR2RDUVVGVkxFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNN096dEJRVWN2UXl4TlFVRkpMRmRCUVZjc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGRFSXNaVUZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFVkJRVVVzUTBGQlF6dEhRVU5vUXpzN08wRkJSMFFzVFVGQlNTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RlFVRkZPMEZCUTNaQ0xITkRRVUZwUWl4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGRFTXNhME5CUVdFc1EwRkJRenRIUVVObU96czdRVUZIUkN3eVFrRkJaMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0RFFVTXpRanM3T3pzN096czdPMEZCVVUwc1UwRkJVeXhUUVVGVExFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN08wRkJSVzVFTEUxQlFVa3NUMEZCVHl4UFFVRlBMRU5CUVVNc1dVRkJXU3hMUVVGTExGTkJRVk1zUlVGQlJUdEJRVU0zUXl4WFFVRlBMRU5CUVVNc1dVRkJXU3hIUVVGSExGRkJRVkVzUTBGQlF5eGhRVUZoTEVOQlFVTTdSMEZETDBNN096czdPMEZCUzBRc1RVRkJTU3hYUVVGWExFZEJRVWNzWjBKQlFWVXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6czdPMEZCUnk5RExHdENRVUZWTEVkQlFVY3NRMEZCUXl4UFFVRlBMRVZCUVVVc1YwRkJWeXhEUVVGRExFTkJRVU03T3pzN1FVRkpjRU1zVFVGQlNTeFhRVUZYTEVOQlFVTXNWMEZCVnl4RlFVRkZPMEZCUXpOQ0xGZEJRVThzVjBGQlZ5eERRVUZETEZsQlFWa3NSMEZCUnl4RlFVRkZMRTlCUVU4c1JVRkJVQ3hQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZRTEU5QlFVOHNSVUZCUlN4RFFVRkRPMGRCUTNoRU96czdRVUZIUkN4TlFVRkpMR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zUzBGQlN5eEpRVUZKTEU5QlFVOHNRMEZCUXl4VFFVRlRMRXRCUVVzc1QwRkJUeXhEUVVGRE96dEJRVVZ1UlN4TlFVRkpMR0ZCUVdFc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVsQlFVa3NUMEZCVHl4RFFVRkRMRk5CUVZNc1MwRkJTeXhQUVVGUExFTkJRVU03T3pzN1FVRkpjRVVzVFVGQlNTeERRVUZETEdGQlFXRXNTVUZCU1N4aFFVRmhMRU5CUVVFc1NVRkJTeXhYUVVGWExFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlFVVXNWMEZCVHp0SFFVRkZPenM3UVVGSGVFVXNUVUZCU1N4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRE96czdRVUZIYkVJc1RVRkJTU3hQUVVGUExFTkJRVU1zV1VGQldTd3lRa0ZCWVN4RlFVRkZPenRCUVVWeVF5eFZRVUZOTEVkQlFVY3NWMEZCVnl4RFFVRkRMRTFCUVUwc1IwRkJSeXhYUVVGWExFTkJRVU1zVFVGQlRTeEpRVUZKTERKQ1FVRmpMRU5CUVVNN1IwRkRjRVU3TzBGQlJVUTdPenRCUVVkRkxFRkJRVU1zVTBGQlR5eERRVUZETEV0QlFVc3NTVUZCU1N4WFFVRlhMRU5CUVVNc1ZVRkJWU3hMUVVGTExFOUJRVThzUTBGQlF5eFRRVUZUT3pzN08wRkJTVGRFTEVkQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1NVRkJTU3hYUVVGWExFTkJRVU1zVlVGQlZTeExRVUZMTEU5QlFVOHNRMEZCUXl4VFFVRlRMRUZCUVVNN096dEJRVWN2UkN4aFFVRlhMRU5CUVVNc1dVRkJXU3hMUVVGTExFOUJRVThzUTBGQlF5eFhRVUZYTEVGQlFVTXNSVUZEYkVRN1FVRkRRU3hSUVVGSkxGZEJRVmNzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEZGtJc2QwTkJRV2xDTEZkQlFWY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOMFF5eHZRMEZCWVN4RFFVRkRPMHRCUTJZN08wRkJSVVFzWlVGQlZ5eERRVUZETEU5QlFVOHNSMEZCUnl4MVFrRkJVeXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZET1VNc1pVRkJWeXhEUVVGRExHRkJRV0VzUjBGQlJ5eEpRVUZKTEVOQlFVTTdSMEZEYkVNN096czdRVUZKUkN4TlFVRkpMRTlCUVU4c1EwRkJReXhaUVVGWkxESkNRVUZoTEVsQlFVa3NUVUZCVFN4RlFVRkZPenRCUVVVdlF5eGxRVUZYTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJRenM3TzBGQlJ5OUNMRkZCUVVrc1kwRkJZeXhIUVVGSExFVkJRVVVzUTBGQlF6czdPenRCUVVsNFFpeFJRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMR2xDUVVGcFFpeEpRVUZKTEZkQlFWY3NRMEZCUXl4aFFVRmhMRVZCUVVVN1FVRkRMMFFzYjBKQlFXTXNRMEZCUXl4UFFVRlBMRWRCUVVjc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF6dEJRVU0zUXl4cFFrRkJWeXhEUVVGRExHRkJRV0VzUjBGQlJ5eExRVUZMTEVOQlFVTTdTMEZEYmtNN096dEJRVWRFTEd0Q1FVRmpMRU5CUVVNc1NVRkJTU3hIUVVGSExGZEJRVmNzUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRPenRCUVVWc1JDeFJRVUZKTEU5QlFVOHNUMEZCVHl4TFFVRkxMRkZCUVZFc1JVRkJSVHRCUVVNdlFpeHZRa0ZCWXl4RFFVRkRMRTlCUVU4c1IwRkJSeXgxUWtGQlV5eFBRVUZQTEVOQlFVTXNRMEZCUXpzN096dEJRVWt6UXl4WlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExHTkJRV01zUTBGQlF5eERRVUZET3pzN1FVRkhia01zV1VGQlRTeERRVUZETEZOQlFWTXNSMEZCUnl4dlFrRkJiMElzUTBGQlF5eFBRVUZQTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNN08wRkJSVGxFTEdGQlFVODdTMEZEVWpzN096dEJRVWxFTEd0Q1FVRmpMRU5CUVVNc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF6czdPMEZCUjJwRExHdENRVUZqTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU03T3pzN1FVRkpka01zVlVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenM3TzBGQlIyNURMRlZCUVUwc1EwRkJReXhUUVVGVExFZEJRVWNzYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUTBGQlF5eERRVUZETzBkQlF5OUVMRTFCUTBrN096dEJRVVZJTEdsQ1FVRlhMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF6czdRVUZGTDBJc1ZVRkJTU3hQUVVGUExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEycENMRlZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF6czdRVUZGYmtJc1ZVRkJTU3hQUVVGUExFOUJRVThzUzBGQlN5eFJRVUZSTEVWQlFVVTdRVUZETDBJc1pVRkJUeXhIUVVGSExESkNRVUZWTEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVUU3VDBGRE5VTXNUVUZEU1R0QlFVTklMR1ZCUVU4c1IwRkJSeXgxUWtGQlV5eFBRVUZQTEVOQlFVTXNRMEZCUXp0UFFVTTNRanM3UVVGRlJDeFZRVUZKTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRha0lzV1VGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRPenRCUVVWNlFpeGxRVUZQTEVkQlFVYzdRVUZEVWl4dlFrRkJWU3hGUVVGV0xGVkJRVlU3TzBGQlJWWXNiMEpCUVZVc1JVRkJSU3hYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVTdRVUZETVVNc2FVSkJRVThzUlVGQlJTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4N1FVRkRjRU1zYTBKQlFWRXNSVUZCUlN4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkU3UVVGRGRFTXNiVUpCUVZNc1JVRkJSU3hYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTTdVMEZEZWtNc1EwRkJRenRQUVVOSU96dEJRVVZFTEZWQlFVa3NWMEZCVnl4SFFVRkhMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTnlSQ3hWUVVGSkxGZEJRVmNzUjBGQlJ5eFBRVUZQTEVsQlFVa3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJRenM3TzBGQlJ6bERMRlZCUVVrc1YwRkJWeXhMUVVGTExGZEJRVmNzUlVGQlJUczdRVUZGTDBJc01FSkJRVk1zU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzA5QlEzUkVPenRYUVVWSkxFbEJRVWtzVDBGQlR5eEZRVUZGTzBGQlEyaENMR2xDUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhPMEZCUTNoQ0xHdENRVUZOTEVWQlFVVXNRMEZCUXp0QlFVTlVMR1ZCUVVjc1JVRkJSU3hYUVVGWExFTkJRVU1zVDBGQlR6dEJRVU40UWl4dFFrRkJTeXhQUVVGUE8xZEJRMklzUTBGQlF6czdRVUZGUml3MFEwRkJhVUlzVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenRCUVVWMFF5eHhRa0ZCVnl4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU03VTBGREwwSTdPMEZCUlVRc1ZVRkJTU3hqUVVGakxFZEJRVWNzVTBGQmFrSXNZMEZCWXl4SFFVRmpPenRCUVVVNVFpeHRRa0ZCVnl4RFFVRkRMRmRCUVZjc1IwRkJSeXhMUVVGTExFTkJRVU03T3p0QlFVZG9ReXh0UWtGQlZ5eERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRek5ETEcxQ1FVRlhMRU5CUVVNc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZETTBNc2JVSkJRVmNzUTBGQlF5eFpRVUZaTEVkQlFVY3NUMEZCVHl4RFFVRkRMRmRCUVZjc1EwRkJRenM3UVVGRkwwTXNjME5CUVdFc1EwRkJRenM3TzBGQlIyUXNaVUZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03T3p0QlFVZHVRaXhsUVVGUExFTkJRVU1zWVVGQllTeERRVUZETERaQ1FVRm5RaXhuUWtGQlowSXNRMEZCUXl4RFFVRkRMRU5CUVVNN096dEJRVWQ2UkN4WlFVRkpMRmRCUVZjc1EwRkJReXhaUVVGWkxFVkJRVVU3UVVGRE5VSXNZMEZCU1N4VlFVRlZMRWRCUVVjc1YwRkJWeXhEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU14UXl4eFFrRkJWeXhEUVVGRExGbEJRVmtzUjBGQlJ5eFRRVUZUTEVOQlFVTTdPenRCUVVkeVF5eHRRa0ZCVXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hWUVVGVkxFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRUUVVNMVJEdFBRVU5HTEVOQlFVTTdPenM3UVVGSlJpeFZRVUZKTEdOQlFXTXNSMEZCUnl4cFEwRkJaU3hQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPenRCUVVkMFJDeFZRVUZKTEdOQlFXTXNSVUZCUlR0QlFVRkZMSE5DUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMDlCUVVVc1RVRkRka1E3UVVGQlJTeHpRa0ZCWXl4RlFVRkZMRU5CUVVNN1QwRkJSVHM3UjBGRE0wSTdRMEZEUmlJc0ltWnBiR1VpT2lJdmFHOXRaUzkwYVcwdloybDBMMlJwWm1ab2RHMXNMMnhwWWk5dWIyUmxMM0JoZEdOb0xtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRU4xYzNSdmJVVjJaVzUwSUdaeWIyMGdKMk4xYzNSdmJTMWxkbVZ1ZENjN1hHNXBiWEJ2Y25RZ2V5QmpjbVZoZEdVZ1lYTWdZM0psWVhSbFYyOXlhMlZ5TENCb1lYTlhiM0pyWlhJZ2ZTQm1jbTl0SUNjdUxpOTNiM0pyWlhJdlkzSmxZWFJsSnp0Y2JtbHRjRzl5ZENCN0lHTnNaV0Z1VFdWdGIzSjVMQ0J3Y205MFpXTjBSV3hsYldWdWRDd2dkVzV3Y205MFpXTjBSV3hsYldWdWRDQjlJR1p5YjIwZ0p5NHVMM1YwYVd3dmJXVnRiM0o1Snp0Y2JtbHRjRzl5ZENCN0lIQnZiMnh6SUgwZ1puSnZiU0FuTGk0dmRYUnBiQzl3YjI5c2N5YzdYRzVwYlhCdmNuUWdleUJ3WVhKelpVaFVUVXdnZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0JoY25ObGNpYzdYRzVwYlhCdmNuUWdjSEp2WTJWemMxQmhkR05vWlhNZ1puSnZiU0FuTGk0dmNHRjBZMmhsY3k5d2NtOWpaWE56Snp0Y2JtbHRjRzl5ZENCdFlXdGxUbTlrWlNCbWNtOXRJQ2N1TDIxaGEyVW5PMXh1YVcxd2IzSjBJRzFoYTJWRmJHVnRaVzUwSUdaeWIyMGdKeTR1TDJWc1pXMWxiblF2YldGclpTYzdYRzVwYlhCdmNuUWdaMlYwUld4bGJXVnVkQ0JtY205dElDY3VMaTlsYkdWdFpXNTBMMmRsZENjN1hHNXBiWEJ2Y25RZ2MzbHVZMDV2WkdVZ1puSnZiU0FuTGk5emVXNWpKenRjYm1sdGNHOXlkQ0I3SUZSeVpXVkRZV05vWlNCOUlHWnliMjBnSnk0dmRISmxaU2M3WEc1Y2JpOHFLbHh1SUNvZ1YyaGxiaUIwYUdVZ2QyOXlhMlZ5SUdOdmJYQnNaWFJsY3l3Z1kyeGxZVzRnZFhBZ2JXVnRiM0o1SUdGdVpDQnpZMmhsWkhWc1pTQjBhR1VnYm1WNGRDQnlaVzVrWlhJZ2FXWmNiaUFxSUc1bFkyVnpjMkZ5ZVM1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnWld4bGJXVnVkRnh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblJOWlhSaFhHNGdLaUJBY21WMGRYSnVJSHRHZFc1amRHbHZibjFjYmlBcUwxeHVablZ1WTNScGIyNGdZMjl0Y0d4bGRHVlhiM0pyWlhKU1pXNWtaWElvWld4bGJXVnVkQ3dnWld4bGJXVnVkRTFsZEdFcElIdGNiaUFnY21WMGRYSnVJR1oxYm1OMGFXOXVLR1YyS1NCN1hHNGdJQ0FnZG1GeUlHNXZaR1Z6SUQwZ1pYWXVaR0YwWVM1dWIyUmxjenRjYmx4dUlDQWdJQzh2SUVGa1pDQnVaWGNnWld4bGJXVnVkSE11WEc0Z0lDQWdhV1lnS0c1dlpHVnpMbUZrWkdsMGFXOXVjeTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJRzV2WkdWekxtRmtaR2wwYVc5dWN5NXRZWEFvY0hKdmRHVmpkRVZzWlcxbGJuUXBMbTFoY0Noa1pYTmpjbWx3ZEc5eUlEMCtJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1NXNXFaV04wSUdsdWRHOGdkR2hsSUdCdmJHUlVjbVZsWUNCemJ5QnBkQ2R6SUdOc1pXRnVaV1FnZFhBZ1kyOXljbVZqZEd4NUxseHVJQ0FnSUNBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMbU5vYVd4a1RtOWtaWE11Y0hWemFDaGtaWE5qY21sd2RHOXlLVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1JsYzJOeWFYQjBiM0k3WEc0Z0lDQWdJQ0I5S1M1bWIzSkZZV05vS0cxaGEyVkZiR1Z0Wlc1MEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCc1pYUWdZMjl0Y0d4bGRHVlNaVzVrWlhJZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJQzh2SUZKbGJXOTJaU0IxYm5WelpXUWdaV3hsYldWdWRITXVYRzRnSUNBZ0lDQnBaaUFvYm05a1pYTXVjbVZ0YjNaaGJITXViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCbGJITWdQU0J1YjJSbGN5NXlaVzF2ZG1Gc2N5NXRZWEFvZFhWcFpDQTlQaUJ3YjI5c2N5NWxiR1Z0Wlc1MFQySnFaV04wTGw5MWRXbGtXM1YxYVdSZEtWeHVJQ0FnSUNBZ0lDQWdJQzV0WVhBb2RXNXdjbTkwWldOMFJXeGxiV1Z1ZENsY2JpQWdJQ0FnSUNBZ0lDQXVabTl5UldGamFDaG1kVzVqZEdsdmJpaGxiQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvWld3cE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb1pXd3VjR0Z5Wlc1MFRtOWtaU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnYVdSNElEMGdaV3hsYldWdWRFMWxkR0V1YjJ4a1ZISmxaUzVqYUdsc1pFNXZaR1Z6TG1sdVpHVjRUMllvWld3cE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlM1amFHbHNaRTV2WkdWekxuTndiR2xqWlNocFpIZ3NJREVwTzF4dUlDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCU1pYTmxkQ0JwYm5SbGNtNWhiQ0JqWVdOb1pYTWdabTl5SUhGMWFXTnJaWElnYkc5dmEzVndjeUJwYmlCMGFHVWdablYwZFhKbGN5NWNiaUFnSUNBZ0lHVnNaVzFsYm5STlpYUmhMbDlwYm01bGNraFVUVXdnUFNCbGJHVnRaVzUwTG1sdWJtVnlTRlJOVER0Y2JpQWdJQ0FnSUdWc1pXMWxiblJOWlhSaExsOXZkWFJsY2toVVRVd2dQU0JsYkdWdFpXNTBMbTkxZEdWeVNGUk5URHRjYmlBZ0lDQWdJR1ZzWlcxbGJuUk5aWFJoTGw5MFpYaDBRMjl1ZEdWdWRDQTlJR1ZzWlcxbGJuUXVkR1Y0ZEVOdmJuUmxiblE3WEc1Y2JpQWdJQ0FnSUM4dklGSmxZM2xqYkdVZ1lXeHNJSFZ1Y0hKdmRHVmpkR1ZrSUdGc2JHOWpZWFJwYjI1ekxseHVJQ0FnSUNBZ1kyeGxZVzVOWlcxdmNua29LVHRjYmx4dUlDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdWFHRnpWMjl5YTJWeVVtVnVaR1Z5WldRZ1BTQjBjblZsTzF4dUlDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdWFYTlNaVzVrWlhKcGJtY2dQU0JtWVd4elpUdGNibHh1SUNBZ0lDQWdMeThnVkdocGN5QnBjeUJrWlhOcFoyNWxaQ0IwYnlCb1lXNWtiR1VnZFhObElHTmhjMlZ6SUhkb1pYSmxJSEpsYm1SbGNuTWdZWEpsSUdKbGFXNW5JR2hoYlcxbGNtVmtYRzRnSUNBZ0lDQXZMeUJ2Y2lCM2FHVnVJSFJ5WVc1emFYUnBiMjV6SUdGeVpTQjFjMlZrSUhkcGRHZ2dVSEp2YldselpYTXVYRzRnSUNBZ0lDQnBaaUFvWld4bGJXVnVkRTFsZEdFdWNtVnVaR1Z5UW5WbVptVnlLU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQnVaWGgwVW1WdVpHVnlJRDBnWld4bGJXVnVkRTFsZEdFdWNtVnVaR1Z5UW5WbVptVnlPMXh1WEc0Z0lDQWdJQ0FnSUM4dklGSmxjMlYwSUhSb1pTQmlkV1ptWlhJdVhHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5STlpYUmhMbkpsYm1SbGNrSjFabVpsY2lBOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lDQWdJQ0F2THlCT2IzUnBZMmx1WnlCemIyMWxJSGRsYVhKa0lIQmxjbVp2Y20xaGJtTmxJR2x0Y0d4cFkyRjBhVzl1Y3lCM2FYUm9JSFJvYVhNZ1kyOXVZMlZ3ZEM1Y2JpQWdJQ0FnSUNBZ2NHRjBZMmhPYjJSbEtHVnNaVzFsYm5Rc0lHNWxlSFJTWlc1a1pYSXVibVYzU0ZSTlRDd2dibVY0ZEZKbGJtUmxjaTV2Y0hScGIyNXpLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1JHbHpjR0YwWTJnZ1lXNGdaWFpsYm5RZ2IyNGdkR2hsSUdWc1pXMWxiblFnYjI1alpTQnlaVzVrWlhKcGJtY2dhR0Z6SUdOdmJYQnNaWFJsWkM1Y2JpQWdJQ0FnSUdWc1pXMWxiblF1WkdsemNHRjBZMmhGZG1WdWRDaHVaWGNnUTNWemRHOXRSWFpsYm5Rb0ozSmxibVJsY2tOdmJYQnNaWFJsSnlrcE8xeHVJQ0FnSUgwN1hHNWNiaUFnSUNBdkx5QlhZV2wwSUhWdWRHbHNJR0ZzYkNCd2NtOXRhWE5sY3lCb1lYWmxJSEpsYzI5c2RtVmtMQ0JpWldadmNtVWdabWx1YVhOb2FXNW5JSFZ3SUhSb1pTQndZWFJqYUZ4dUlDQWdJQzh2SUdONVkyeGxMbHh1SUNBZ0lDOHZJRkJ5YjJObGMzTWdkR2hsSUdSaGRHRWdhVzF0WldScFlYUmxiSGtnWVc1a0lIZGhhWFFnZFc1MGFXd2dZV3hzSUhSeVlXNXphWFJwYjI0Z1kyRnNiR0poWTJ0elhHNGdJQ0FnTHk4Z2FHRjJaU0JqYjIxd2JHVjBaV1F1WEc0Z0lDQWdiR1YwSUhCeWIyTmxjM05RY205dGFYTmxJRDBnY0hKdlkyVnpjMUJoZEdOb1pYTW9aV3hsYldWdWRDd2daWFl1WkdGMFlTNXdZWFJqYUdWektUdGNibHh1SUNBZ0lDOHZJRTl3WlhKaGRHVWdjM2x1WTJoeWIyNXZkWE5zZVNCMWJteGxjM01nYjNCMFpXUWdhVzUwYnlCaElGQnliMjFwYzJVdFkyaGhhVzR1WEc0Z0lDQWdhV1lnS0hCeWIyTmxjM05RY205dGFYTmxLU0I3SUhCeWIyTmxjM05RY205dGFYTmxMblJvWlc0b1kyOXRjR3hsZEdWU1pXNWtaWElwT3lCOVhHNGdJQ0FnWld4elpTQjdJR052YlhCc1pYUmxVbVZ1WkdWeUtDazdJSDFjYmlBZ2ZUdGNibjFjYmx4dUx5b3FYRzRnS2lCU1pXeGxZWE5sSjNNZ2RHaGxJR0ZzYkc5allYUmxaQ0J2WW1wbFkzUnpJR0Z1WkNCeVpXTjVZMnhsY3lCcGJuUmxjbTVoYkNCdFpXMXZjbmt1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhKbGJHVmhjMlZPYjJSbEtHVnNaVzFsYm5RcElIdGNiaUFnYkdWMElHVnNaVzFsYm5STlpYUmhJRDBnVkhKbFpVTmhZMmhsTG1kbGRDaGxiR1Z0Wlc1MEtTQjhmQ0I3ZlR0Y2JseHVJQ0F2THlCSlppQjBhR1Z5WlNCcGN5QmhJSGR2Y210bGNpQmhjM052WTJsaGRHVmtJSGRwZEdnZ2RHaHBjeUJsYkdWdFpXNTBMQ0IwYUdWdUlHdHBiR3dnYVhRdVhHNGdJR2xtSUNobGJHVnRaVzUwVFdWMFlTNTNiM0pyWlhJcElIdGNiaUFnSUNCbGJHVnRaVzUwVFdWMFlTNTNiM0pyWlhJdWRHVnliV2x1WVhSbEtDazdYRzRnSUgxY2JseHVJQ0F2THlCSlppQjBhR1Z5WlNCM1lYTWdZU0IwY21WbElITmxkQ0IxY0N3Z2NtVmplV05zWlNCMGFHVWdiV1Z0YjNKNUlHRnNiRzlqWVhSbFpDQm1iM0lnYVhRdVhHNGdJR2xtSUNobGJHVnRaVzUwVFdWMFlTNXZiR1JVY21WbEtTQjdYRzRnSUNBZ2RXNXdjbTkwWldOMFJXeGxiV1Z1ZENobGJHVnRaVzUwVFdWMFlTNXZiR1JVY21WbEtUdGNiaUFnSUNCamJHVmhiazFsYlc5eWVTZ3BPMXh1SUNCOVhHNWNiaUFnTHk4Z1VtVnRiM1psSUhSb2FYTWdaV3hsYldWdWRDZHpJRzFsZEdFZ2IySnFaV04wSUdaeWIyMGdkR2hsSUdOaFkyaGxMbHh1SUNCVWNtVmxRMkZqYUdVdVpHVnNaWFJsS0dWc1pXMWxiblFwTzF4dWZWeHVYRzR2S2lwY2JpQXFJRkJoZEdOb1pYTWdZVzRnWld4bGJXVnVkQ2R6SUVSUFRTQjBieUJ0WVhSamFDQjBhR0YwSUc5bUlIUm9aU0J3WVhOelpXUWdiV0Z5YTNWd0xseHVJQ3BjYmlBcUlFQndZWEpoYlNCbGJHVnRaVzUwWEc0Z0tpQkFjR0Z5WVcwZ2JtVjNTRlJOVEZ4dUlDb3ZYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdjR0YwWTJoT2IyUmxLR1ZzWlcxbGJuUXNJRzVsZDBoVVRVd3NJRzl3ZEdsdmJuTXBJSHRjYmlBZ0x5OGdSVzV6ZFhKbElIUm9ZWFFnZEdobElHUnZZM1Z0Wlc1MElHUnBjMkZpYkdVZ2QyOXlhMlZ5SUdseklHRnNkMkY1Y3lCd2FXTnJaV1FnZFhBdVhHNGdJR2xtSUNoMGVYQmxiMllnYjNCMGFXOXVjeTVsYm1GaWJHVlhiM0pyWlhJZ0lUMDlJQ2RpYjI5c1pXRnVKeWtnZTF4dUlDQWdJRzl3ZEdsdmJuTXVaVzVoWW14bFYyOXlhMlZ5SUQwZ1pHOWpkVzFsYm5RdVJVNUJRa3hGWDFkUFVrdEZVanRjYmlBZ2ZWeHVYRzRnSUM4dklGUm9aU0JsYkdWdFpXNTBJRzFsZEdFZ2IySnFaV04wSUdseklHRWdiRzlqWVhScGIyNGdkRzhnWVhOemIyTnBZWFJsSUcxbGRHRmtZWFJoSUhkcGRHZ2dkR2hsWEc0Z0lDOHZJR04xY25KbGJuUnNlU0J5Wlc1a1pYSnBibWNnWld4bGJXVnVkQzRnVkdocGN5QndjbVYyWlc1MGN5QmhkSFJoWTJocGJtY2djSEp2Y0dWeWRHbGxjeUIwYnlCMGFHVmNiaUFnTHk4Z2FXNXpkR0Z1WTJVZ2FYUnpaV3htTGx4dUlDQjJZWElnWld4bGJXVnVkRTFsZEdFZ1BTQlVjbVZsUTJGamFHVXVaMlYwS0dWc1pXMWxiblFwSUh4OElIdDlPMXh1WEc0Z0lDOHZJRUZzZDJGNWN5Qmxibk4xY21VZ2RHaGxJRzF2YzNRZ2RYQXRkRzh0WkdGMFpTQnRaWFJoSUc5aWFtVmpkQ0JwY3lCemRHOXlaV1F1WEc0Z0lGUnlaV1ZEWVdOb1pTNXpaWFFvWld4bGJXVnVkQ3dnWld4bGJXVnVkRTFsZEdFcE8xeHVYRzRnSUM4dklFbG1JSFJvYVhNZ1pXeGxiV1Z1ZENCcGN5QmhiSEpsWVdSNUlISmxibVJsY21sdVp5d2dZV1JrSUhSb2FYTWdibVYzSUhKbGJtUmxjaUJ5WlhGMVpYTjBJR2x1ZEc4Z2RHaGxYRzRnSUM4dklHSjFabVpsY2lCeGRXVjFaUzVjYmlBZ2FXWWdLR1ZzWlcxbGJuUk5aWFJoTG1selVtVnVaR1Z5YVc1bktTQjdYRzRnSUNBZ2NtVjBkWEp1SUdWc1pXMWxiblJOWlhSaExuSmxibVJsY2tKMVptWmxjaUE5SUhzZ2JtVjNTRlJOVEN3Z2IzQjBhVzl1Y3lCOU8xeHVJQ0I5WEc1Y2JpQWdMeThnU1dZZ2RHaGxJRzl3WlhKaGRHbHZiaUJwY3lCZ2FXNXVaWEpJVkUxTVlDd2dZblYwSUhSb1pTQmpiMjUwWlc1MGN5Qm9ZWFpsYmlkMElHTm9ZVzVuWldRdVhHNGdJSFpoY2lCellXMWxTVzV1WlhKSVZFMU1JRDBnYjNCMGFXOXVjeTVwYm01bGNpQW1KaUJsYkdWdFpXNTBMbWx1Ym1WeVNGUk5UQ0E5UFQwZ2JtVjNTRlJOVER0Y2JpQWdMeThnU1dZZ2RHaGxJRzl3WlhKaGRHbHZiaUJwY3lCZ2IzVjBaWEpJVkUxTVlDd2dZblYwSUhSb1pTQmpiMjUwWlc1MGN5Qm9ZWFpsYmlkMElHTm9ZVzVuWldRdVhHNGdJSFpoY2lCellXMWxUM1YwWlhKSVZFMU1JRDBnSVc5d2RHbHZibk11YVc1dVpYSWdKaVlnWld4bGJXVnVkQzV2ZFhSbGNraFVUVXdnUFQwOUlHNWxkMGhVVFV3N1hHNWNiaUFnTHk4Z1NXWWdkR2hsSUdOdmJuUmxiblJ6SUdoaGRtVnVKM1FnWTJoaGJtZGxaQ3dnWVdKdmNuUXNJSE5wYm1ObElIUm9aWEpsSUdseklHNXZJSEJ2YVc1MElHbHVYRzRnSUM4dklHTnZiblJwYm5WcGJtY3VYRzRnSUdsbUlDZ29jMkZ0WlVsdWJtVnlTRlJOVENCOGZDQnpZVzFsVDNWMFpYSklWRTFNS1NBbUppQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxLU0I3SUhKbGRIVnlianNnZlZ4dVhHNGdJQzh2SUZOMFlYSjBJSGRwZEdnZ2QyOXlhMlZ5SUdKbGFXNW5JR0VnWm1Gc2Mza2dkbUZzZFdVdVhHNGdJSFpoY2lCM2IzSnJaWElnUFNCdWRXeHNPMXh1WEc0Z0lDOHZJRWxtSUhkbElHTmhiaUIxYzJVZ1lTQjNiM0pyWlhJZ1lXNWtJSFJvWlNCMWMyVnlJSGRoYm5SeklHOXVaU3dnZEhKNUlHRnVaQ0JqY21WaGRHVWdhWFF1WEc0Z0lHbG1JQ2h2Y0hScGIyNXpMbVZ1WVdKc1pWZHZjbXRsY2lBbUppQm9ZWE5YYjNKclpYSXBJSHRjYmlBZ0lDQXZMeUJEY21WaGRHVWdZU0IzYjNKclpYSWdabTl5SUhSb2FYTWdaV3hsYldWdWRDNWNiaUFnSUNCM2IzSnJaWElnUFNCbGJHVnRaVzUwVFdWMFlTNTNiM0pyWlhJZ1BTQmxiR1Z0Wlc1MFRXVjBZUzUzYjNKclpYSWdmSHdnWTNKbFlYUmxWMjl5YTJWeUtDazdYRzRnSUgxY2JseHVJQ0JwWmlBb1hHNGdJQ0FnTHk4Z1NXWWdkR2hsSUc5d1pYSmhkR2x2YmlCcGN5QmdhVzV1WlhKSVZFMU1ZQ3dnWVc1a0lIUm9aU0JqZFhKeVpXNTBJR1ZzWlcxbGJuUW5jeUJqYjI1MFpXNTBjeUJvWVhabFhHNGdJQ0FnTHk4Z1kyaGhibWRsWkNCemFXNWpaU0IwYUdVZ2JHRnpkQ0J5Wlc1a1pYSWdiRzl2Y0N3Z2NtVmpZV3hqZFd4aGRHVWdkR2hsSUhSeVpXVXVYRzRnSUNBZ0tHOXdkR2x2Ym5NdWFXNXVaWElnSmlZZ1pXeGxiV1Z1ZEUxbGRHRXVYMmx1Ym1WeVNGUk5UQ0FoUFQwZ1pXeGxiV1Z1ZEM1cGJtNWxja2hVVFV3cElIeDhYRzVjYmlBZ0lDQXZMeUJKWmlCMGFHVWdiM0JsY21GMGFXOXVJR2x6SUdCdmRYUmxja2hVVFV4Z0xDQmhibVFnZEdobElHTjFjbkpsYm5RZ1pXeGxiV1Z1ZENkeklHTnZiblJsYm5SeklHaGhkbVZjYmlBZ0lDQXZMeUJqYUdGdVoyVmtJSE5wYm1ObElIUm9aU0JzWVhOMElISmxibVJsY2lCc2IyOXdMQ0J5WldOaGJHTjFiR0YwWlNCMGFHVWdkSEpsWlM1Y2JpQWdJQ0FvSVc5d2RHbHZibk11YVc1dVpYSWdKaVlnWld4bGJXVnVkRTFsZEdFdVgyOTFkR1Z5U0ZSTlRDQWhQVDBnWld4bGJXVnVkQzV2ZFhSbGNraFVUVXdwSUh4OFhHNWNiaUFnSUNBdkx5QkpaaUIwYUdVZ2RHVjRkQ0JqYjI1MFpXNTBJR1YyWlhJZ1kyaGhibWRsY3l3Z2NtVmpZV3hqZFd4aGRHVWdkR2hsSUhSeVpXVXVYRzRnSUNBZ0tHVnNaVzFsYm5STlpYUmhMbDkwWlhoMFEyOXVkR1Z1ZENBaFBUMGdaV3hsYldWdWRDNTBaWGgwUTI5dWRHVnVkQ2xjYmlBZ0tTQjdYRzRnSUNBZ2FXWWdLR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VwSUh0Y2JpQWdJQ0FnSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFvWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlNrN1hHNGdJQ0FnSUNCamJHVmhiazFsYlc5eWVTZ3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHVnNaVzFsYm5STlpYUmhMbTlzWkZSeVpXVWdQU0J0WVd0bFRtOWtaU2hsYkdWdFpXNTBMQ0IwY25WbEtUdGNiaUFnSUNCbGJHVnRaVzUwVFdWMFlTNTFjR1JoZEdWUGJHUlVjbVZsSUQwZ2RISjFaVHRjYmlBZ2ZWeHVYRzRnSUM4dklGZHBiR3dnZDJGdWRDQjBieUJsYm5OMWNtVWdkR2hoZENCMGFHVWdabWx5YzNRZ2NtVnVaR1Z5SUhkbGJuUWdkR2h5YjNWbmFDd2dkR2hsSUhkdmNtdGxjaUJqWVc1Y2JpQWdMeThnZEdGclpTQmhJR0pwZENCMGJ5QnpkR0Z5ZEhWd0lHRnVaQ0IzWlNCM1lXNTBJSFJ2SUhOb2IzY2dZMmhoYm1kbGN5QmhjeUJ6YjI5dUlHRnpJSEJ2YzNOcFlteGxMbHh1SUNCcFppQW9iM0IwYVc5dWN5NWxibUZpYkdWWGIzSnJaWElnSmlZZ2FHRnpWMjl5YTJWeUlDWW1JSGR2Y210bGNpa2dlMXh1SUNBZ0lDOHZJRk5sZENCaElISmxibVJsY2lCc2IyTnJJR0Z6SUhSdklHNXZkQ0JtYkc5dlpDQjBhR1VnZDI5eWEyVnlMbHh1SUNBZ0lHVnNaVzFsYm5STlpYUmhMbWx6VW1WdVpHVnlhVzVuSUQwZ2RISjFaVHRjYmx4dUlDQWdJQzh2SUVGMGRHRmphQ0JoYkd3Z2NISnZjR1Z5ZEdsbGN5Qm9aWEpsSUhSdklIUnlZVzV6Y0c5eWRDNWNiaUFnSUNCc1pYUWdkSEpoYm5ObVpYSlBZbXBsWTNRZ1BTQjdmVHRjYmx4dUlDQWdJQzh2SUZSb2FYTWdjMmh2ZFd4a0lHOXViSGtnYjJOamRYSWdiMjVqWlN3Z2IzSWdkMmhsYm1WMlpYSWdkR2hsSUcxaGNtdDFjQ0JqYUdGdVoyVnpJR1Y0ZEdWeWJtRnNiSGxjYmlBZ0lDQXZMeUIwYnlCa2FXWm1TRlJOVEM1Y2JpQWdJQ0JwWmlBb0lXVnNaVzFsYm5STlpYUmhMbWhoYzFkdmNtdGxjbEpsYm1SbGNtVmtJSHg4SUdWc1pXMWxiblJOWlhSaExuVndaR0YwWlU5c1pGUnlaV1VwSUh0Y2JpQWdJQ0FnSUhSeVlXNXpabVZ5VDJKcVpXTjBMbTlzWkZSeVpXVWdQU0JsYkdWdFpXNTBUV1YwWVM1dmJHUlVjbVZsTzF4dUlDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdWRYQmtZWFJsVDJ4a1ZISmxaU0E5SUdaaGJITmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRUYwZEdGamFDQjBhR1VnY0dGeVpXNTBJR1ZzWlcxbGJuUW5jeUIxZFdsa0xseHVJQ0FnSUhSeVlXNXpabVZ5VDJKcVpXTjBMblYxYVdRZ1BTQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMbVZzWlcxbGJuUTdYRzVjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JRzVsZDBoVVRVd2dJVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNCMGNtRnVjMlpsY2s5aWFtVmpkQzV1WlhkVWNtVmxJRDBnYldGclpVNXZaR1VvYm1WM1NGUk5UQ2s3WEc1Y2JpQWdJQ0FnSUM4dklGUnlZVzV6Wm1WeUlIUm9hWE1nWW5WbVptVnlJSFJ2SUhSb1pTQjNiM0pyWlhJc0lIZG9hV05vSUhkcGJHd2dkR0ZyWlNCdmRtVnlJR0Z1WkNCd2NtOWpaWE56SUhSb1pWeHVJQ0FnSUNBZ0x5OGdiV0Z5YTNWd0xseHVJQ0FnSUNBZ2QyOXlhMlZ5TG5CdmMzUk5aWE56WVdkbEtIUnlZVzV6Wm1WeVQySnFaV04wS1R0Y2JseHVJQ0FnSUNBZ0x5OGdWMkZwZENCbWIzSWdkR2hsSUhkdmNtdGxjaUIwYnlCbWFXNXBjMmdnY0hKdlkyVnpjMmx1WnlCaGJtUWdkR2hsYmlCaGNIQnNlU0IwYUdVZ2NHRjBZMmh6WlhRdVhHNGdJQ0FnSUNCM2IzSnJaWEl1YjI1dFpYTnpZV2RsSUQwZ1kyOXRjR3hsZEdWWGIzSnJaWEpTWlc1a1pYSW9aV3hsYldWdWRDd2daV3hsYldWdWRFMWxkR0VwTzF4dVhHNGdJQ0FnSUNCeVpYUjFjbTQ3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVEdWMElIUm9aU0JpY205M2MyVnlJR052Y0hrZ2RHaGxJRWhVVFV3Z2FXNTBieUIwYUdVZ2QyOXlhMlZ5TENCamIyNTJaWEowYVc1bklIUnZJR0ZjYmlBZ0lDQXZMeUIwY21GdWMyWmxjbUZpYkdVZ2IySnFaV04wSUdseklIUnZieUJsZUhCbGJuTnBkbVV1WEc0Z0lDQWdkSEpoYm5ObVpYSlBZbXBsWTNRdWJtVjNTRlJOVENBOUlHNWxkMGhVVFV3N1hHNWNiaUFnSUNBdkx5QkJaR1FnY0hKdmNHVnlkR2xsY3lCMGJ5QnpaVzVrSUhSdklIZHZjbXRsY2k1Y2JpQWdJQ0IwY21GdWMyWmxjazlpYW1WamRDNXBjMGx1Ym1WeUlEMGdiM0IwYVc5dWN5NXBibTVsY2p0Y2JseHVJQ0FnSUM4dklGUnlZVzV6Wm1WeUlIUm9hWE1nWW5WbVptVnlJSFJ2SUhSb1pTQjNiM0pyWlhJc0lIZG9hV05vSUhkcGJHd2dkR0ZyWlNCdmRtVnlJR0Z1WkNCd2NtOWpaWE56SUhSb1pWeHVJQ0FnSUM4dklHMWhjbXQxY0M1Y2JpQWdJQ0IzYjNKclpYSXVjRzl6ZEUxbGMzTmhaMlVvZEhKaGJuTm1aWEpQWW1wbFkzUXBPMXh1WEc0Z0lDQWdMeThnVjJGcGRDQm1iM0lnZEdobElIZHZjbXRsY2lCMGJ5Qm1hVzVwYzJnZ2NISnZZMlZ6YzJsdVp5QmhibVFnZEdobGJpQmhjSEJzZVNCMGFHVWdjR0YwWTJoelpYUXVYRzRnSUNBZ2QyOXlhMlZ5TG05dWJXVnpjMkZuWlNBOUlHTnZiWEJzWlhSbFYyOXlhMlZ5VW1WdVpHVnlLR1ZzWlcxbGJuUXNJR1ZzWlcxbGJuUk5aWFJoS1R0Y2JpQWdmVnh1SUNCbGJITmxJSHRjYmlBZ0lDQXZMeUJYWlNkeVpTQnlaVzVrWlhKcGJtY2dhVzRnZEdobElGVkpJSFJvY21WaFpDNWNiaUFnSUNCbGJHVnRaVzUwVFdWMFlTNXBjMUpsYm1SbGNtbHVaeUE5SUhSeWRXVTdYRzVjYmlBZ0lDQnNaWFFnY0dGMFkyaGxjeUE5SUZ0ZE8xeHVJQ0FnSUd4bGRDQnVaWGRVY21WbElEMGdiblZzYkR0Y2JseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2JtVjNTRlJOVENBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJRzVsZDFSeVpXVWdQU0J3WVhKelpVaFVUVXdvYm1WM1NGUk5UQ3dnYjNCMGFXOXVjeTVwYm01bGNpbGNiaUFnSUNCOVhHNGdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQnVaWGRVY21WbElEMGdiV0ZyWlU1dlpHVW9ibVYzU0ZSTlRDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVhVzV1WlhJcElIdGNiaUFnSUNBZ0lHeGxkQ0JqYUdsc1pFNXZaR1Z6SUQwZ2JtVjNWSEpsWlR0Y2JseHVJQ0FnSUNBZ2JtVjNWSEpsWlNBOUlIdGNiaUFnSUNBZ0lDQWdZMmhwYkdST2IyUmxjeXhjYmx4dUlDQWdJQ0FnSUNCaGRIUnlhV0oxZEdWek9pQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE1zWEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblE2SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVdVpXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ2JtOWtaVTVoYldVNklHVnNaVzFsYm5STlpYUmhMbTlzWkZSeVpXVXVibTlrWlU1aGJXVXNYRzRnSUNBZ0lDQWdJRzV2WkdWV1lXeDFaVG9nWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlM1dWIyUmxWbUZzZFdWY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYkdWMElHOXNaRlJ5WldWT1lXMWxJRDBnWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlM1dWIyUmxUbUZ0WlNCOGZDQW5KenRjYmlBZ0lDQnNaWFFnYm1WM1RtOWtaVTVoYldVZ1BTQnVaWGRVY21WbElDWW1JRzVsZDFSeVpXVXVibTlrWlU1aGJXVTdYRzVjYmlBZ0lDQXZMeUJKWmlCMGFHVWdaV3hsYldWdWRDQnViMlJsSUhSNWNHVnpJRzFoZEdOb0xDQjBjbmtnWVc1a0lHTnZiWEJoY21VZ2RHaGxiUzVjYmlBZ0lDQnBaaUFvYjJ4a1ZISmxaVTVoYldVZ1BUMDlJRzVsZDA1dlpHVk9ZVzFsS1NCN1hHNGdJQ0FnSUNBdkx5QlRlVzVqYUhKdmJtbDZaU0IwYUdVZ2RISmxaUzVjYmlBZ0lDQWdJSE41Ym1OT2IyUmxMbU5oYkd3b2NHRjBZMmhsY3l3Z1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTd2dibVYzVkhKbFpTazdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklFOTBhR1Z5ZDJselpTQnlaWEJzWVdObElIUm9aU0IwYjNBZ2JHVjJaV3dnWld4bGJXVnVkSE11WEc0Z0lDQWdaV3h6WlNCcFppQW9ibVYzU0ZSTlRDa2dlMXh1SUNBZ0lDQWdjR0YwWTJobGMxdHdZWFJqYUdWekxteGxibWQwYUYwZ1BTQjdYRzRnSUNBZ0lDQWdJRjlmWkc5Zlh6b2dNQ3hjYmlBZ0lDQWdJQ0FnYjJ4a09pQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMRnh1SUNBZ0lDQWdJQ0J1WlhjNklHNWxkMVJ5WldWY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5Rb1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTazdYRzVjYmlBZ0lDQWdJR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VnUFNCdVpYZFVjbVZsTzF4dUlDQWdJSDFjYmx4dUlDQWdJR3hsZENCamIyMXdiR1YwWlZKbGJtUmxjaUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ0x5OGdUV0Z5YXlCMGFHRjBJSFJvYVhNZ1pXeGxiV1Z1ZENCb1lYTWdhVzVwZEdsaGJHeDVJSEpsYm1SbGNtVmtJR0Z1WkNCcGN5QmtiMjVsSUhKbGJtUmxjbWx1Wnk1Y2JpQWdJQ0FnSUdWc1pXMWxiblJOWlhSaExtbHpVbVZ1WkdWeWFXNW5JRDBnWm1Gc2MyVTdYRzVjYmlBZ0lDQWdJQzh2SUZObGRDQjBhR1VnYVc1dVpYSklWRTFNTGx4dUlDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdVgybHVibVZ5U0ZSTlRDQTlJR1ZzWlcxbGJuUXVhVzV1WlhKSVZFMU1PMXh1SUNBZ0lDQWdaV3hsYldWdWRFMWxkR0V1WDI5MWRHVnlTRlJOVENBOUlHVnNaVzFsYm5RdWIzVjBaWEpJVkUxTU8xeHVJQ0FnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXVYM1JsZUhSRGIyNTBaVzUwSUQwZ1pXeGxiV1Z1ZEM1MFpYaDBRMjl1ZEdWdWREdGNibHh1SUNBZ0lDQWdZMnhsWVc1TlpXMXZjbmtvS1R0Y2JseHVJQ0FnSUNBZ0x5OGdRMnhsWVc0Z2IzVjBJSFJvWlNCd1lYUmphR1Z6SUdGeWNtRjVMbHh1SUNBZ0lDQWdjR0YwWTJobGN5NXNaVzVuZEdnZ1BTQXdPMXh1WEc0Z0lDQWdJQ0F2THlCRWFYTndZWFJqYUNCaGJpQmxkbVZ1ZENCdmJpQjBhR1VnWld4bGJXVnVkQ0J2Ym1ObElISmxibVJsY21sdVp5Qm9ZWE1nWTI5dGNHeGxkR1ZrTGx4dUlDQWdJQ0FnWld4bGJXVnVkQzVrYVhOd1lYUmphRVYyWlc1MEtHNWxkeUJEZFhOMGIyMUZkbVZ1ZENnbmNtVnVaR1Z5UTI5dGNHeGxkR1VuS1NrN1hHNWNiaUFnSUNBZ0lDOHZJRlJQUkU4Z1ZYQmtZWFJsSUhSb2FYTWdZMjl0YldWdWRDQmhibVF2YjNJZ2NtVm1ZV04wYjNJZ2RHOGdkWE5sSUhSb1pTQnpZVzFsSUdGeklIUm9aU0JYYjNKclpYSXVYRzRnSUNBZ0lDQnBaaUFvWld4bGJXVnVkRTFsZEdFdWNtVnVaR1Z5UW5WbVptVnlLU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQnVaWGgwVW1WdVpHVnlJRDBnWld4bGJXVnVkRTFsZEdFdWNtVnVaR1Z5UW5WbVptVnlPMXh1SUNBZ0lDQWdJQ0JsYkdWdFpXNTBUV1YwWVM1eVpXNWtaWEpDZFdabVpYSWdQU0IxYm1SbFptbHVaV1E3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdUbTkwYVdOcGJtY2djMjl0WlNCM1pXbHlaQ0J3WlhKbWIzSnRZVzVqWlNCcGJYQnNhV05oZEdsdmJuTWdkMmwwYUNCMGFHbHpJR052Ym1ObGNIUXVYRzRnSUNBZ0lDQWdJSEJoZEdOb1RtOWtaU2hsYkdWdFpXNTBMQ0J1WlhoMFVtVnVaR1Z5TG01bGQwaFVUVXdzSUc1bGVIUlNaVzVrWlhJdWIzQjBhVzl1Y3lrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlR0Y2JseHVJQ0FnSUM4dklGQnliMk5sYzNNZ2RHaGxJR1JoZEdFZ2FXMXRaV1JwWVhSbGJIa2dZVzVrSUhkaGFYUWdkVzUwYVd3Z1lXeHNJSFJ5WVc1emFYUnBiMjRnWTJGc2JHSmhZMnR6WEc0Z0lDQWdMeThnYUdGMlpTQmpiMjF3YkdWMFpXUXVYRzRnSUNBZ2JHVjBJSEJ5YjJObGMzTlFjbTl0YVhObElEMGdjSEp2WTJWemMxQmhkR05vWlhNb1pXeGxiV1Z1ZEN3Z2NHRjBZMmhsY3lrN1hHNWNiaUFnSUNBdkx5QlBjR1Z5WVhSbElITjVibU5vY205dWIzVnpiSGtnZFc1c1pYTnpJRzl3ZEdWa0lHbHVkRzhnWVNCUWNtOXRhWE5sTFdOb1lXbHVMbHh1SUNBZ0lHbG1JQ2h3Y205alpYTnpVSEp2YldselpTa2dleUJ3Y205alpYTnpVSEp2YldselpTNTBhR1Z1S0dOdmJYQnNaWFJsVW1WdVpHVnlLVHNnZlZ4dUlDQWdJR1ZzYzJVZ2V5QmpiMjF3YkdWMFpWSmxibVJsY2lncE95QjlYRzRnSUgxY2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzeW5jO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIHBvb2xzID0gX3V0aWxQb29scy5wb29scztcbnZhciBwcm90ZWN0RWxlbWVudCA9IF91dGlsTWVtb3J5LnByb3RlY3RFbGVtZW50O1xudmFyIHVucHJvdGVjdEVsZW1lbnQgPSBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50O1xuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8qKlxuICogU3luY2hyb25pemVzIGNoYW5nZXMgZnJvbSB0aGUgbmV3VHJlZSBpbnRvIHRoZSBvbGRUcmVlLlxuICpcbiAqIEBwYXJhbSBvbGRUcmVlXG4gKiBAcGFyYW0gbmV3VHJlZVxuICovXG5cbmZ1bmN0aW9uIHN5bmMob2xkVHJlZSwgbmV3VHJlZSkge1xuICB2YXIgcGF0Y2hlcyA9IHRoaXM7XG4gIHZhciBvbGRDaGlsZE5vZGVzID0gb2xkVHJlZS5jaGlsZE5vZGVzO1xuICB2YXIgb2xkQ2hpbGROb2Rlc0xlbmd0aCA9IG9sZENoaWxkTm9kZXMgPyBvbGRDaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG4gIHZhciBvbGRFbGVtZW50ID0gb2xkVHJlZS5lbGVtZW50O1xuICB2YXIgdGV4dEVsZW1lbnRzID0gWydzY3JpcHQnLCAnc3R5bGUnLCAndGV4dGFyZWEnLCAnI3RleHQnXTtcblxuICBpZiAoIW5ld1RyZWUpIHtcbiAgICB2YXIgcmVtb3ZlZCA9IG9sZENoaWxkTm9kZXMuc3BsaWNlKDAsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogLTEsIGVsZW1lbnQ6IG9sZEVsZW1lbnQgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gVXNlZCBieSB0aGUgV29ya2VyIHRvIHRyYWNrIGVsZW1lbnRzIHJlbW92ZWQuXG4gICAgICBpZiAocGF0Y2hlcy5yZW1vdmFscykge1xuICAgICAgICBwYXRjaGVzLnJlbW92YWxzLnB1c2gocmVtb3ZlZFtpXS5lbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgdW5wcm90ZWN0RWxlbWVudChyZW1vdmVkW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbm9kZVZhbHVlID0gbmV3VHJlZS5ub2RlVmFsdWU7XG4gIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZS5jaGlsZE5vZGVzO1xuICB2YXIgY2hpbGROb2Rlc0xlbmd0aCA9IGNoaWxkTm9kZXMgPyBjaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG4gIHZhciBuZXdFbGVtZW50ID0gbmV3VHJlZS5lbGVtZW50O1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IHdlJ3JlIHJlcGxhY2luZyBpcyB0b3RhbGx5IGRpZmZlcmVudCBmcm9tIHRoZSBwcmV2aW91c1xuICAvLyByZXBsYWNlIHRoZSBlbnRpcmUgZWxlbWVudCwgZG9uJ3QgYm90aGVyIGludmVzdGlnYXRpbmcgY2hpbGRyZW4uXG4gIGlmIChvbGRUcmVlLm5vZGVOYW1lICE9PSBuZXdUcmVlLm5vZGVOYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmVwbGFjZSB0ZXh0IG5vZGUgdmFsdWVzIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgaWYgKHRleHRFbGVtZW50cy5pbmRleE9mKG5ld1RyZWUubm9kZU5hbWUpID4gLTEpIHtcbiAgICAvLyBUZXh0IGNoYW5nZWQuXG4gICAgaWYgKG9sZFRyZWUubm9kZVZhbHVlICE9PSBub2RlVmFsdWUpIHtcbiAgICAgIG9sZFRyZWUubm9kZVZhbHVlID0gbm9kZVZhbHVlO1xuXG4gICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgICAgX19kb19fOiAzLFxuICAgICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgICB2YWx1ZTogbm9kZVZhbHVlXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIE1vc3QgY29tbW9uIGFkZGl0aXZlIGVsZW1lbnRzLlxuICBpZiAoY2hpbGROb2Rlc0xlbmd0aCA+IG9sZENoaWxkTm9kZXNMZW5ndGgpIHtcbiAgICAvLyBTdG9yZSBlbGVtZW50cyBpbiBhIERvY3VtZW50RnJhZ21lbnQgdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2UgYW5kIGJlXG4gICAgLy8gZ2VuZXJhbGx5IHNpbXBsaWVyIHRvIHdvcmsgd2l0aC5cbiAgICB2YXIgZnJhZ21lbnQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSBvbGRDaGlsZE5vZGVzTGVuZ3RoOyBpIDwgY2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBVc2VkIGJ5IHRoZSBXb3JrZXIgdG8gdHJhY2sgZWxlbWVudHMgYWRkZWQuXG4gICAgICBpZiAocGF0Y2hlcy5hZGRpdGlvbnMpIHtcbiAgICAgICAgcGF0Y2hlcy5hZGRpdGlvbnMucHVzaChjaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgcHJvdGVjdEVsZW1lbnQoY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgIC8vIEludGVybmFsbHkgYWRkIHRvIHRoZSB0cmVlLlxuICAgICAgb2xkQ2hpbGROb2Rlc1tvbGRDaGlsZE5vZGVzLmxlbmd0aF0gPSBjaGlsZE5vZGVzW2ldO1xuXG4gICAgICAvLyBBZGQgdG8gdGhlIGRvY3VtZW50IGZyYWdtZW50LlxuICAgICAgZnJhZ21lbnRbZnJhZ21lbnQubGVuZ3RoXSA9IGNoaWxkTm9kZXNbaV07XG4gICAgfVxuXG4gICAgLy8gQXNzaWduIHRoZSBmcmFnbWVudCB0byB0aGUgcGF0Y2hlcyB0byBiZSBpbmplY3RlZC5cbiAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgIF9fZG9fXzogMSxcbiAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICBmcmFnbWVudDogZnJhZ21lbnRcbiAgICB9O1xuICB9XG5cbiAgLy8gUmVwbGFjZSBlbGVtZW50cyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9sZENoaWxkTm9kZXNbaV0ubm9kZU5hbWUgIT09IGNoaWxkTm9kZXNbaV0ubm9kZU5hbWUpIHtcbiAgICAgIC8vIEFkZCB0byB0aGUgcGF0Y2hlcy5cbiAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0ge1xuICAgICAgICBfX2RvX186IDEsXG4gICAgICAgIG9sZDogb2xkQ2hpbGROb2Rlc1tpXSxcbiAgICAgICAgJ25ldyc6IGNoaWxkTm9kZXNbaV1cbiAgICAgIH07XG5cbiAgICAgIC8vIFVzZWQgYnkgdGhlIFdvcmtlciB0byB0cmFjayBlbGVtZW50cyByZW1vdmVkLlxuICAgICAgaWYgKHBhdGNoZXMucmVtb3ZhbHMpIHtcbiAgICAgICAgcGF0Y2hlcy5yZW1vdmFscy5wdXNoKG9sZENoaWxkTm9kZXNbaV0uZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVzZWQgYnkgdGhlIFdvcmtlciB0byB0cmFjayBlbGVtZW50cyBhZGRlZC5cbiAgICAgIGlmIChwYXRjaGVzLmFkZGl0aW9ucykge1xuICAgICAgICBwYXRjaGVzLmFkZGl0aW9ucy5wdXNoKGNoaWxkTm9kZXNbaV0pO1xuICAgICAgfVxuXG4gICAgICB1bnByb3RlY3RFbGVtZW50KG9sZENoaWxkTm9kZXNbaV0pO1xuICAgICAgcHJvdGVjdEVsZW1lbnQoY2hpbGROb2Rlc1tpXSk7XG5cbiAgICAgIC8vIFJlcGxhY2UgdGhlIGludGVybmFsIHRyZWUncyBwb2ludCBvZiB2aWV3IG9mIHRoaXMgZWxlbWVudC5cbiAgICAgIG9sZENoaWxkTm9kZXNbaV0gPSBjaGlsZE5vZGVzW2ldO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlbW92ZSB0aGVzZSBlbGVtZW50cy5cbiAgaWYgKG9sZENoaWxkTm9kZXNMZW5ndGggPiBjaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gRWxlbWVudHMgdG8gcmVtb3ZlLlxuICAgIHZhciB0b1JlbW92ZSA9IHNsaWNlLmNhbGwob2xkQ2hpbGROb2RlcywgY2hpbGROb2Rlc0xlbmd0aCwgb2xkQ2hpbGROb2Rlc0xlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBSZW1vdmUgdGhlIGVsZW1lbnQsIHRoaXMgaGFwcGVucyBiZWZvcmUgdGhlIHNwbGljZSBzbyB0aGF0IHdlIHN0aWxsXG4gICAgICAvLyBoYXZlIGFjY2VzcyB0byB0aGUgZWxlbWVudC5cbiAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0geyBfX2RvX186IDEsIG9sZDogdG9SZW1vdmVbaV0uZWxlbWVudCB9O1xuICAgIH1cblxuICAgIHZhciByZW1vdmVkID0gb2xkQ2hpbGROb2Rlcy5zcGxpY2UoY2hpbGROb2Rlc0xlbmd0aCwgb2xkQ2hpbGROb2Rlc0xlbmd0aCAtIGNoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZW1vdmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBVc2VkIGJ5IHRoZSBXb3JrZXIgdG8gdHJhY2sgZWxlbWVudHMgcmVtb3ZlZC5cbiAgICAgIGlmIChwYXRjaGVzLnJlbW92YWxzKSB7XG4gICAgICAgIHBhdGNoZXMucmVtb3ZhbHMucHVzaChyZW1vdmVkW2ldLmVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICB1bnByb3RlY3RFbGVtZW50KHJlbW92ZWRbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmNocm9uaXplIGF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZXMgPSBuZXdUcmVlLmF0dHJpYnV0ZXM7XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgb2xkTGVuZ3RoID0gb2xkVHJlZS5hdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICB2YXIgbmV3TGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICAvLyBTdGFydCB3aXRoIHRoZSBtb3N0IGNvbW1vbiwgYWRkaXRpdmUuXG4gICAgaWYgKG5ld0xlbmd0aCA+IG9sZExlbmd0aCkge1xuICAgICAgdmFyIHRvQWRkID0gc2xpY2UuY2FsbChhdHRyaWJ1dGVzLCBvbGRMZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9BZGRbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9BZGRbaV0udmFsdWVcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcbiAgICAgICAgYXR0ci5uYW1lID0gdG9BZGRbaV0ubmFtZTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IHRvQWRkW2ldLnZhbHVlO1xuXG4gICAgICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5wcm90ZWN0KGF0dHIpO1xuXG4gICAgICAgIC8vIFB1c2ggdGhlIGNoYW5nZSBvYmplY3QgaW50byBpbnRvIHRoZSB2aXJ0dWFsIHRyZWUuXG4gICAgICAgIG9sZFRyZWUuYXR0cmlidXRlc1tvbGRUcmVlLmF0dHJpYnV0ZXMubGVuZ3RoXSA9IGF0dHI7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IGNoYW5nZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgcmVtb3ZhbHMuXG4gICAgaWYgKG9sZExlbmd0aCA+IG5ld0xlbmd0aCkge1xuICAgICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbChvbGRUcmVlLmF0dHJpYnV0ZXMsIG5ld0xlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b1JlbW92ZVtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZSBmcm9tIHRoZSB2aXJ0dWFsIG5vZGUuXG4gICAgICAgIHZhciByZW1vdmVkID0gb2xkVHJlZS5hdHRyaWJ1dGVzLnNwbGljZShpLCAxKTtcblxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgcmVtb3ZlZC5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICBwb29scy5hdHRyaWJ1dGVPYmplY3QudW5wcm90ZWN0KHJlbW92ZWRbX2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgY2hhbmdlIHRvIHRoZSBzZXJpZXMgb2YgcGF0Y2hlcy5cbiAgICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSBjaGFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIG1vZGlmaWNhdGlvbnMuXG4gICAgdmFyIHRvTW9kaWZ5ID0gYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9Nb2RpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvbGRBdHRyVmFsdWUgPSBvbGRUcmVlLmF0dHJpYnV0ZXNbaV0gJiYgb2xkVHJlZS5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgdmFyIG5ld0F0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbaV0gJiYgYXR0cmlidXRlc1tpXS52YWx1ZTtcblxuICAgICAgLy8gT25seSBwdXNoIGluIGEgY2hhbmdlIGlmIHRoZSBhdHRyaWJ1dGUgb3IgdmFsdWUgY2hhbmdlcy5cbiAgICAgIGlmIChvbGRBdHRyVmFsdWUgIT09IG5ld0F0dHJWYWx1ZSkge1xuICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgIF9fZG9fXzogMixcbiAgICAgICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgICAgIG5hbWU6IHRvTW9kaWZ5W2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IHRvTW9kaWZ5W2ldLnZhbHVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYXR0cmlidXRlIGluIHRoZSB2aXJ0dWFsIG5vZGUuXG4gICAgICAgIHZhciBhdHRyID0gb2xkVHJlZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBhdHRyLm5hbWUgPSB0b01vZGlmeVtpXS5uYW1lO1xuICAgICAgICBhdHRyLnZhbHVlID0gdG9Nb2RpZnlbaV0udmFsdWU7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IGNoYW5nZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTeW5jIGVhY2ggY3VycmVudCBub2RlLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZENoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob2xkQ2hpbGROb2Rlc1tpXS5lbGVtZW50ICE9PSBjaGlsZE5vZGVzW2ldLmVsZW1lbnQpIHtcbiAgICAgIHN5bmMuY2FsbChwYXRjaGVzLCBvbGRUcmVlLmNoaWxkTm9kZXNbaV0sIGNoaWxkTm9kZXNbaV0pO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmMzbHVZeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096dHhRa0ZyUW5kQ0xFbEJRVWs3TzNsQ1FXeENTU3hsUVVGbE96c3dRa0ZKZUVNc1owSkJRV2RDT3p0QlFVVjJRaXhKUVVGSkxFdEJRVXNzYlVKQlFWTXNRMEZCUXp0QlFVTnVRaXhKUVVGSkxHTkJRV01zTmtKQlFXdENMRU5CUVVNN1FVRkRja01zU1VGQlNTeG5Ra0ZCWjBJc0swSkJRVzlDTEVOQlFVTTdPMEZCUlhwRExFbEJRVTBzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRE96czdPenM3T3pzN1FVRlJja0lzVTBGQlV5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVNM1F5eE5RVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRia0lzVFVGQlNTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVOMlF5eE5RVUZKTEcxQ1FVRnRRaXhIUVVGSExHRkJRV0VzUjBGQlJ5eGhRVUZoTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOdVJTeE5RVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJRMnBETEUxQlFVa3NXVUZCV1N4SFFVRkhMRU5CUVVNc1VVRkJVU3hGUVVGRkxFOUJRVThzUlVGQlJTeFZRVUZWTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVFZFTEUxQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRXaXhSUVVGSkxFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1JVRkJSU3h0UWtGQmJVSXNRMEZCUXl4RFFVRkRPenRCUVVVelJDeFhRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVVzVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RlFVRkZMRTlCUVU4c1JVRkJSU3hWUVVGVkxFVkJRVVVzUTBGQlF6czdRVUZGT1VRc1UwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdPMEZCUlhaRExGVkJRVWtzVDBGQlR5eERRVUZETEZGQlFWRXNSVUZCUlR0QlFVRkZMR1ZCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dFBRVUZGT3p0QlFVVndSU3h6UWtGQlowSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU01UWpzN1FVRkZSQ3hYUVVGUE8wZEJRMUk3TzBGQlJVUXNUVUZCU1N4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF6dEJRVU5zUXl4TlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETzBGQlEzQkRMRTFCUVVrc1owSkJRV2RDTEVkQlFVY3NWVUZCVlN4SFFVRkhMRlZCUVZVc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlF6RkVMRTFCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTTdPenM3UVVGSmFrTXNUVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJVU3hMUVVGTExFOUJRVThzUTBGQlF5eFJRVUZSTEVWQlFVVTdRVUZEZWtNc1YwRkJUenRIUVVOU096czdRVUZIUkN4TlFVRkpMRmxCUVZrc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhGUVVGRk96dEJRVVV2UXl4UlFVRkpMRTlCUVU4c1EwRkJReXhUUVVGVExFdEJRVXNzVTBGQlV5eEZRVUZGTzBGQlEyNURMR0ZCUVU4c1EwRkJReXhUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZET3p0QlFVVTVRaXhoUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhPMEZCUTNoQ0xHTkJRVTBzUlVGQlJTeERRVUZETzBGQlExUXNaVUZCVHl4RlFVRkZMRlZCUVZVN1FVRkRia0lzWVVGQlN5eEZRVUZGTEZOQlFWTTdUMEZEYWtJc1EwRkJRenRMUVVOSU96dEJRVVZFTEZkQlFVODdSMEZEVWpzN08wRkJSMFFzVFVGQlNTeG5Ra0ZCWjBJc1IwRkJSeXh0UWtGQmJVSXNSVUZCUlRzN08wRkJSekZETEZGQlFVa3NVVUZCVVN4SFFVRkhMRVZCUVVVc1EwRkJRenM3UVVGRmJFSXNVMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXh0UWtGQmJVSXNSVUZCUlN4RFFVRkRMRWRCUVVjc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN08wRkJSVE5FTEZWQlFVa3NUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVGRkxHVkJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzA5QlFVVTdPMEZCUldwRkxHOUNRVUZqTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03T3p0QlFVYzVRaXh0UWtGQllTeERRVUZETEdGQlFXRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdPenRCUVVkd1JDeGpRVUZSTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTXpRenM3TzBGQlIwUXNWMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ6dEJRVU40UWl4WlFVRk5MRVZCUVVVc1EwRkJRenRCUVVOVUxHRkJRVThzUlVGQlJTeFZRVUZWTzBGQlEyNUNMR05CUVZFc1JVRkJSU3hSUVVGUk8wdEJRMjVDTEVOQlFVTTdSMEZEU0RzN08wRkJSMFFzVDBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExHZENRVUZuUWl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRM3BETEZGQlFVa3NZVUZCWVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExGRkJRVkVzUzBGQlN5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hGUVVGRk96dEJRVVY0UkN4aFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITzBGQlEzaENMR05CUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzVjBGQlJ5eEZRVUZGTEdGQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja0lzWlVGQlN5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTI1Q0xFTkJRVU03T3p0QlFVZEdMRlZCUVVrc1QwRkJUeXhEUVVGRExGRkJRVkVzUlVGQlJUdEJRVU53UWl4bFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03VDBGRGFrUTdPenRCUVVkRUxGVkJRVWtzVDBGQlR5eERRVUZETEZOQlFWTXNSVUZCUlR0QlFVRkZMR1ZCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRVVU3TzBGQlJXcEZMSE5DUVVGblFpeERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMjVETEc5Q1FVRmpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdPenRCUVVjNVFpeHRRa0ZCWVN4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTnNRenRIUVVOR096czdRVUZIUkN4TlFVRkpMRzFDUVVGdFFpeEhRVUZITEdkQ1FVRm5RaXhGUVVGRk96dEJRVVV4UXl4UlFVRkpMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEdGQlFXRXNSVUZCUlN4blFrRkJaMElzUlVGRGRrUXNiVUpCUVcxQ0xFTkJRVU1zUTBGQlF6czdRVUZGZGtJc1UwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRkZCUVZFc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdPenRCUVVkNFF5eGhRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVVzVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4SFFVRkhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRPMHRCUTI1Rk96dEJRVVZFTEZGQlFVa3NUMEZCVHl4SFFVRkhMR0ZCUVdFc1EwRkJReXhOUVVGTkxFTkJRVU1zWjBKQlFXZENMRVZCUTJwRUxHMUNRVUZ0UWl4SFFVRkhMR2RDUVVGblFpeERRVUZETEVOQlFVTTdPMEZCUlRGRExGTkJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPenRCUVVWMlF5eFZRVUZKTEU5QlFVOHNRMEZCUXl4UlFVRlJMRVZCUVVVN1FVRkJSU3hsUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdUMEZCUlRzN1FVRkZjRVVzYzBKQlFXZENMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdTMEZET1VJN1IwRkRSanM3TzBGQlIwUXNUVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF6czdRVUZGY0VNc1RVRkJTU3hWUVVGVkxFVkJRVVU3UVVGRFpDeFJRVUZKTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU14UXl4UlFVRkpMRk5CUVZNc1IwRkJSeXhWUVVGVkxFTkJRVU1zVFVGQlRTeERRVUZET3pzN1FVRkhiRU1zVVVGQlNTeFRRVUZUTEVkQlFVY3NVMEZCVXl4RlFVRkZPMEZCUTNwQ0xGVkJRVWtzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZET3p0QlFVVTVReXhYUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTnlReXhaUVVGSkxFMUJRVTBzUjBGQlJ6dEJRVU5ZTEdkQ1FVRk5MRVZCUVVVc1EwRkJRenRCUVVOVUxHbENRVUZQTEVWQlFVVXNWVUZCVlR0QlFVTnVRaXhqUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrN1FVRkRia0lzWlVGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTE8xTkJRM1JDTEVOQlFVTTdPMEZCUlVZc1dVRkJTU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOMlF5eFpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZETVVJc1dVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRE96dEJRVVUxUWl4aFFVRkxMRU5CUVVNc1pVRkJaU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXpzN08wRkJSM0JETEdWQlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNN096dEJRVWR5UkN4bFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEUxQlFVMHNRMEZCUXp0UFFVTnNRenRMUVVOR096czdRVUZIUkN4UlFVRkpMRk5CUVZNc1IwRkJSeXhUUVVGVExFVkJRVVU3UVVGRGVrSXNWVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE96dEJRVVY2UkN4WFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU40UXl4WlFVRkpMRTFCUVUwc1IwRkJSenRCUVVOWUxHZENRVUZOTEVWQlFVVXNRMEZCUXp0QlFVTlVMR2xDUVVGUExFVkJRVVVzVlVGQlZUdEJRVU51UWl4alFVRkpMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVazdRVUZEZEVJc1pVRkJTeXhGUVVGRkxGTkJRVk03VTBGRGFrSXNRMEZCUXpzN08wRkJSMFlzV1VGQlNTeFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVVNVF5eGhRVUZMTEVsQlFVa3NSVUZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hGUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4RlFVRkRMRVZCUVVVc1JVRkJSVHRCUVVOMlF5eGxRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zUlVGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0VFFVTTNRenM3TzBGQlIwUXNaVUZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTTdUMEZEYkVNN1MwRkRSanM3TzBGQlIwUXNVVUZCU1N4UlFVRlJMRWRCUVVjc1ZVRkJWU3hEUVVGRE96dEJRVVV4UWl4VFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU40UXl4VlFVRkpMRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMEZCUTNoRkxGVkJRVWtzV1VGQldTeEhRVUZITEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPenM3UVVGSGVFUXNWVUZCU1N4WlFVRlpMRXRCUVVzc1dVRkJXU3hGUVVGRk8wRkJRMnBETEZsQlFVa3NUVUZCVFN4SFFVRkhPMEZCUTFnc1owSkJRVTBzUlVGQlJTeERRVUZETzBGQlExUXNhVUpCUVU4c1JVRkJSU3hWUVVGVk8wRkJRMjVDTEdOQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNUdEJRVU4wUWl4bFFVRkxMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVczdVMEZEZWtJc1EwRkJRenM3TzBGQlIwWXNXVUZCU1N4SlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnFReXhaUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRE4wSXNXVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPenM3UVVGSEwwSXNaVUZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTTdUMEZEYkVNN1MwRkRSanRIUVVOR096czdRVUZIUkN4UFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NZVUZCWVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU0zUXl4UlFVRkpMR0ZCUVdFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eFBRVUZQTEV0QlFVc3NWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU4wUkN4VlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJTeFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpGRU8wZEJRMFk3UTBGRFJpSXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOXViMlJsTDNONWJtTXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnZXlCd2IyOXNjeUJoY3lCZmNHOXZiSE1nZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0J2YjJ4ekp6dGNibWx0Y0c5eWRDQjdYRzRnSUhCeWIzUmxZM1JGYkdWdFpXNTBJR0Z6SUY5d2NtOTBaV04wUld4bGJXVnVkQ3hjYmlBZ2RXNXdjbTkwWldOMFJXeGxiV1Z1ZENCaGN5QmZkVzV3Y205MFpXTjBSV3hsYldWdWRGeHVmU0JtY205dElDY3VMaTkxZEdsc0wyMWxiVzl5ZVNjN1hHNWNiblpoY2lCd2IyOXNjeUE5SUY5d2IyOXNjenRjYm5aaGNpQndjbTkwWldOMFJXeGxiV1Z1ZENBOUlGOXdjbTkwWldOMFJXeGxiV1Z1ZER0Y2JuWmhjaUIxYm5CeWIzUmxZM1JGYkdWdFpXNTBJRDBnWDNWdWNISnZkR1ZqZEVWc1pXMWxiblE3WEc1Y2JtTnZibk4wSUhOc2FXTmxJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbk5zYVdObE8xeHVYRzR2S2lwY2JpQXFJRk41Ym1Ob2NtOXVhWHBsY3lCamFHRnVaMlZ6SUdaeWIyMGdkR2hsSUc1bGQxUnlaV1VnYVc1MGJ5QjBhR1VnYjJ4a1ZISmxaUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdiMnhrVkhKbFpWeHVJQ29nUUhCaGNtRnRJRzVsZDFSeVpXVmNiaUFxTDF4dVpYaHdiM0owSUdSbFptRjFiSFFnWm5WdVkzUnBiMjRnYzNsdVl5aHZiR1JVY21WbExDQnVaWGRVY21WbEtTQjdYRzRnSUd4bGRDQndZWFJqYUdWeklEMGdkR2hwY3p0Y2JpQWdiR1YwSUc5c1pFTm9hV3hrVG05a1pYTWdQU0J2YkdSVWNtVmxMbU5vYVd4a1RtOWtaWE03WEc0Z0lHeGxkQ0J2YkdSRGFHbHNaRTV2WkdWelRHVnVaM1JvSUQwZ2IyeGtRMmhwYkdST2IyUmxjeUEvSUc5c1pFTm9hV3hrVG05a1pYTXViR1Z1WjNSb0lEb2dNRHRjYmlBZ2JHVjBJRzlzWkVWc1pXMWxiblFnUFNCdmJHUlVjbVZsTG1Wc1pXMWxiblE3WEc0Z0lHeGxkQ0IwWlhoMFJXeGxiV1Z1ZEhNZ1BTQmJKM05qY21sd2RDY3NJQ2R6ZEhsc1pTY3NJQ2QwWlhoMFlYSmxZU2NzSUNjamRHVjRkQ2RkTzF4dVhHNGdJR2xtSUNnaGJtVjNWSEpsWlNrZ2UxeHVJQ0FnSUd4bGRDQnlaVzF2ZG1Wa0lEMGdiMnhrUTJocGJHUk9iMlJsY3k1emNHeHBZMlVvTUN3Z2IyeGtRMmhwYkdST2IyUmxjMHhsYm1kMGFDazdYRzVjYmlBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlIc2dYMTlrYjE5Zk9pQXRNU3dnWld4bGJXVnVkRG9nYjJ4a1JXeGxiV1Z1ZENCOU8xeHVYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQnlaVzF2ZG1Wa0xteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0F2THlCVmMyVmtJR0o1SUhSb1pTQlhiM0pyWlhJZ2RHOGdkSEpoWTJzZ1pXeGxiV1Z1ZEhNZ2NtVnRiM1psWkM1Y2JpQWdJQ0FnSUdsbUlDaHdZWFJqYUdWekxuSmxiVzkyWVd4ektTQjdJSEJoZEdOb1pYTXVjbVZ0YjNaaGJITXVjSFZ6YUNoeVpXMXZkbVZrVzJsZExtVnNaVzFsYm5RcE95QjlYRzVjYmlBZ0lDQWdJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUW9jbVZ0YjNabFpGdHBYU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdU8xeHVJQ0I5WEc1Y2JpQWdiR1YwSUc1dlpHVldZV3gxWlNBOUlHNWxkMVJ5WldVdWJtOWtaVlpoYkhWbE8xeHVJQ0JzWlhRZ1kyaHBiR1JPYjJSbGN5QTlJRzVsZDFSeVpXVXVZMmhwYkdST2IyUmxjenRjYmlBZ2JHVjBJR05vYVd4a1RtOWtaWE5NWlc1bmRHZ2dQU0JqYUdsc1pFNXZaR1Z6SUQ4Z1kyaHBiR1JPYjJSbGN5NXNaVzVuZEdnZ09pQXdPMXh1SUNCc1pYUWdibVYzUld4bGJXVnVkQ0E5SUc1bGQxUnlaV1V1Wld4bGJXVnVkRHRjYmx4dUlDQXZMeUJKWmlCMGFHVWdaV3hsYldWdWRDQjNaU2R5WlNCeVpYQnNZV05wYm1jZ2FYTWdkRzkwWVd4c2VTQmthV1ptWlhKbGJuUWdabkp2YlNCMGFHVWdjSEpsZG1sdmRYTmNiaUFnTHk4Z2NtVndiR0ZqWlNCMGFHVWdaVzUwYVhKbElHVnNaVzFsYm5Rc0lHUnZiaWQwSUdKdmRHaGxjaUJwYm5abGMzUnBaMkYwYVc1bklHTm9hV3hrY21WdUxseHVJQ0JwWmlBb2IyeGtWSEpsWlM1dWIyUmxUbUZ0WlNBaFBUMGdibVYzVkhKbFpTNXViMlJsVG1GdFpTa2dlMXh1SUNBZ0lISmxkSFZ5Ymp0Y2JpQWdmVnh1WEc0Z0lDOHZJRkpsY0d4aFkyVWdkR1Y0ZENCdWIyUmxJSFpoYkhWbGN5QnBaaUIwYUdWNUlHRnlaU0JrYVdabVpYSmxiblF1WEc0Z0lHbG1JQ2gwWlhoMFJXeGxiV1Z1ZEhNdWFXNWtaWGhQWmlodVpYZFVjbVZsTG01dlpHVk9ZVzFsS1NBK0lDMHhLU0I3WEc0Z0lDQWdMeThnVkdWNGRDQmphR0Z1WjJWa0xseHVJQ0FnSUdsbUlDaHZiR1JVY21WbExtNXZaR1ZXWVd4MVpTQWhQVDBnYm05a1pWWmhiSFZsS1NCN1hHNGdJQ0FnSUNCdmJHUlVjbVZsTG01dlpHVldZV3gxWlNBOUlHNXZaR1ZXWVd4MVpUdGNibHh1SUNBZ0lDQWdjR0YwWTJobGMxdHdZWFJqYUdWekxteGxibWQwYUYwZ1BTQjdYRzRnSUNBZ0lDQWdJRjlmWkc5Zlh6b2dNeXhjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkRG9nYjJ4a1JXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ2RtRnNkV1U2SUc1dlpHVldZV3gxWlZ4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNDdYRzRnSUgxY2JseHVJQ0F2THlCTmIzTjBJR052YlcxdmJpQmhaR1JwZEdsMlpTQmxiR1Z0Wlc1MGN5NWNiaUFnYVdZZ0tHTm9hV3hrVG05a1pYTk1aVzVuZEdnZ1BpQnZiR1JEYUdsc1pFNXZaR1Z6VEdWdVozUm9LU0I3WEc0Z0lDQWdMeThnVTNSdmNtVWdaV3hsYldWdWRITWdhVzRnWVNCRWIyTjFiV1Z1ZEVaeVlXZHRaVzUwSUhSdklHbHVZM0psWVhObElIQmxjbVp2Y20xaGJtTmxJR0Z1WkNCaVpWeHVJQ0FnSUM4dklHZGxibVZ5WVd4c2VTQnphVzF3YkdsbGNpQjBieUIzYjNKcklIZHBkR2d1WEc0Z0lDQWdiR1YwSUdaeVlXZHRaVzUwSUQwZ1cxMDdYRzVjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnYjJ4a1EyaHBiR1JPYjJSbGMweGxibWQwYURzZ2FTQThJR05vYVd4a1RtOWtaWE5NWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0x5OGdWWE5sWkNCaWVTQjBhR1VnVjI5eWEyVnlJSFJ2SUhSeVlXTnJJR1ZzWlcxbGJuUnpJR0ZrWkdWa0xseHVJQ0FnSUNBZ2FXWWdLSEJoZEdOb1pYTXVZV1JrYVhScGIyNXpLU0I3SUhCaGRHTm9aWE11WVdSa2FYUnBiMjV6TG5CMWMyZ29ZMmhwYkdST2IyUmxjMXRwWFNrN0lIMWNibHh1SUNBZ0lDQWdjSEp2ZEdWamRFVnNaVzFsYm5Rb1kyaHBiR1JPYjJSbGMxdHBYU2s3WEc1Y2JpQWdJQ0FnSUM4dklFbHVkR1Z5Ym1Gc2JIa2dZV1JrSUhSdklIUm9aU0IwY21WbExseHVJQ0FnSUNBZ2IyeGtRMmhwYkdST2IyUmxjMXR2YkdSRGFHbHNaRTV2WkdWekxteGxibWQwYUYwZ1BTQmphR2xzWkU1dlpHVnpXMmxkTzF4dVhHNGdJQ0FnSUNBdkx5QkJaR1FnZEc4Z2RHaGxJR1J2WTNWdFpXNTBJR1p5WVdkdFpXNTBMbHh1SUNBZ0lDQWdabkpoWjIxbGJuUmJabkpoWjIxbGJuUXViR1Z1WjNSb1hTQTlJR05vYVd4a1RtOWtaWE5iYVYwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1FYTnphV2R1SUhSb1pTQm1jbUZuYldWdWRDQjBieUIwYUdVZ2NHRjBZMmhsY3lCMGJ5QmlaU0JwYm1wbFkzUmxaQzVjYmlBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlIdGNiaUFnSUNBZ0lGOWZaRzlmWHpvZ01TeGNiaUFnSUNBZ0lHVnNaVzFsYm5RNklHOXNaRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQm1jbUZuYldWdWREb2dabkpoWjIxbGJuUmNiaUFnSUNCOU8xeHVJQ0I5WEc1Y2JpQWdMeThnVW1Wd2JHRmpaU0JsYkdWdFpXNTBjeUJwWmlCMGFHVjVJR0Z5WlNCa2FXWm1aWEpsYm5RdVhHNGdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnWTJocGJHUk9iMlJsYzB4bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2FXWWdLRzlzWkVOb2FXeGtUbTlrWlhOYmFWMHVibTlrWlU1aGJXVWdJVDA5SUdOb2FXeGtUbTlrWlhOYmFWMHVibTlrWlU1aGJXVXBJSHRjYmlBZ0lDQWdJQzh2SUVGa1pDQjBieUIwYUdVZ2NHRjBZMmhsY3k1Y2JpQWdJQ0FnSUhCaGRHTm9aWE5iY0dGMFkyaGxjeTVzWlc1bmRHaGRJRDBnZTF4dUlDQWdJQ0FnSUNCZlgyUnZYMTg2SURFc1hHNGdJQ0FnSUNBZ0lHOXNaRG9nYjJ4a1EyaHBiR1JPYjJSbGMxdHBYU3hjYmlBZ0lDQWdJQ0FnYm1WM09pQmphR2xzWkU1dlpHVnpXMmxkWEc0Z0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBdkx5QlZjMlZrSUdKNUlIUm9aU0JYYjNKclpYSWdkRzhnZEhKaFkyc2daV3hsYldWdWRITWdjbVZ0YjNabFpDNWNiaUFnSUNBZ0lHbG1JQ2h3WVhSamFHVnpMbkpsYlc5MllXeHpLU0I3WEc0Z0lDQWdJQ0FnSUhCaGRHTm9aWE11Y21WdGIzWmhiSE11Y0hWemFDaHZiR1JEYUdsc1pFNXZaR1Z6VzJsZExtVnNaVzFsYm5RcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJWYzJWa0lHSjVJSFJvWlNCWGIzSnJaWElnZEc4Z2RISmhZMnNnWld4bGJXVnVkSE1nWVdSa1pXUXVYRzRnSUNBZ0lDQnBaaUFvY0dGMFkyaGxjeTVoWkdScGRHbHZibk1wSUhzZ2NHRjBZMmhsY3k1aFpHUnBkR2x2Ym5NdWNIVnphQ2hqYUdsc1pFNXZaR1Z6VzJsZEtUc2dmVnh1WEc0Z0lDQWdJQ0IxYm5CeWIzUmxZM1JGYkdWdFpXNTBLRzlzWkVOb2FXeGtUbTlrWlhOYmFWMHBPMXh1SUNBZ0lDQWdjSEp2ZEdWamRFVnNaVzFsYm5Rb1kyaHBiR1JPYjJSbGMxdHBYU2s3WEc1Y2JpQWdJQ0FnSUM4dklGSmxjR3hoWTJVZ2RHaGxJR2x1ZEdWeWJtRnNJSFJ5WldVbmN5QndiMmx1ZENCdlppQjJhV1YzSUc5bUlIUm9hWE1nWld4bGJXVnVkQzVjYmlBZ0lDQWdJRzlzWkVOb2FXeGtUbTlrWlhOYmFWMGdQU0JqYUdsc1pFNXZaR1Z6VzJsZE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHZJRkpsYlc5MlpTQjBhR1Z6WlNCbGJHVnRaVzUwY3k1Y2JpQWdhV1lnS0c5c1pFTm9hV3hrVG05a1pYTk1aVzVuZEdnZ1BpQmphR2xzWkU1dlpHVnpUR1Z1WjNSb0tTQjdYRzRnSUNBZ0x5OGdSV3hsYldWdWRITWdkRzhnY21WdGIzWmxMbHh1SUNBZ0lHeGxkQ0IwYjFKbGJXOTJaU0E5SUhOc2FXTmxMbU5oYkd3b2IyeGtRMmhwYkdST2IyUmxjeXdnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ3hjYmlBZ0lDQWdJRzlzWkVOb2FXeGtUbTlrWlhOTVpXNW5kR2dwTzF4dVhHNGdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCMGIxSmxiVzkyWlM1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdMeThnVW1WdGIzWmxJSFJvWlNCbGJHVnRaVzUwTENCMGFHbHpJR2hoY0hCbGJuTWdZbVZtYjNKbElIUm9aU0J6Y0d4cFkyVWdjMjhnZEdoaGRDQjNaU0J6ZEdsc2JGeHVJQ0FnSUNBZ0x5OGdhR0YyWlNCaFkyTmxjM01nZEc4Z2RHaGxJR1ZzWlcxbGJuUXVYRzRnSUNBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlIc2dYMTlrYjE5Zk9pQXhMQ0J2YkdRNklIUnZVbVZ0YjNabFcybGRMbVZzWlcxbGJuUWdmVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnNaWFFnY21WdGIzWmxaQ0E5SUc5c1pFTm9hV3hrVG05a1pYTXVjM0JzYVdObEtHTm9hV3hrVG05a1pYTk1aVzVuZEdnc1hHNGdJQ0FnSUNCdmJHUkRhR2xzWkU1dlpHVnpUR1Z1WjNSb0lDMGdZMmhwYkdST2IyUmxjMHhsYm1kMGFDazdYRzVjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJSEpsYlc5MlpXUXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUM4dklGVnpaV1FnWW5rZ2RHaGxJRmR2Y210bGNpQjBieUIwY21GamF5QmxiR1Z0Wlc1MGN5QnlaVzF2ZG1Wa0xseHVJQ0FnSUNBZ2FXWWdLSEJoZEdOb1pYTXVjbVZ0YjNaaGJITXBJSHNnY0dGMFkyaGxjeTV5WlcxdmRtRnNjeTV3ZFhOb0tISmxiVzkyWldSYmFWMHVaV3hsYldWdWRDazdJSDFjYmx4dUlDQWdJQ0FnZFc1d2NtOTBaV04wUld4bGJXVnVkQ2h5WlcxdmRtVmtXMmxkS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdkx5QlRlVzVqYUhKdmJtbDZaU0JoZEhSeWFXSjFkR1Z6WEc0Z0lHeGxkQ0JoZEhSeWFXSjFkR1Z6SUQwZ2JtVjNWSEpsWlM1aGRIUnlhV0oxZEdWek8xeHVYRzRnSUdsbUlDaGhkSFJ5YVdKMWRHVnpLU0I3WEc0Z0lDQWdiR1YwSUc5c1pFeGxibWQwYUNBOUlHOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGN5NXNaVzVuZEdnN1hHNGdJQ0FnYkdWMElHNWxkMHhsYm1kMGFDQTlJR0YwZEhKcFluVjBaWE11YkdWdVozUm9PMXh1WEc0Z0lDQWdMeThnVTNSaGNuUWdkMmwwYUNCMGFHVWdiVzl6ZENCamIyMXRiMjRzSUdGa1pHbDBhWFpsTGx4dUlDQWdJR2xtSUNodVpYZE1aVzVuZEdnZ1BpQnZiR1JNWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR3hsZENCMGIwRmtaQ0E5SUhOc2FXTmxMbU5oYkd3b1lYUjBjbWxpZFhSbGN5d2diMnhrVEdWdVozUm9LVHRjYmx4dUlDQWdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCMGIwRmtaQzVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQnNaWFFnWTJoaGJtZGxJRDBnZTF4dUlDQWdJQ0FnSUNBZ0lGOWZaRzlmWHpvZ01peGNiaUFnSUNBZ0lDQWdJQ0JsYkdWdFpXNTBPaUJ2YkdSRmJHVnRaVzUwTEZ4dUlDQWdJQ0FnSUNBZ0lHNWhiV1U2SUhSdlFXUmtXMmxkTG01aGJXVXNYRzRnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJSFJ2UVdSa1cybGRMblpoYkhWbExGeHVJQ0FnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0FnSUd4bGRDQmhkSFJ5SUQwZ2NHOXZiSE11WVhSMGNtbGlkWFJsVDJKcVpXTjBMbWRsZENncE8xeHVJQ0FnSUNBZ0lDQmhkSFJ5TG01aGJXVWdQU0IwYjBGa1pGdHBYUzV1WVcxbE8xeHVJQ0FnSUNBZ0lDQmhkSFJ5TG5aaGJIVmxJRDBnZEc5QlpHUmJhVjB1ZG1Gc2RXVTdYRzVjYmlBZ0lDQWdJQ0FnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuQnliM1JsWTNRb1lYUjBjaWs3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdVSFZ6YUNCMGFHVWdZMmhoYm1kbElHOWlhbVZqZENCcGJuUnZJR2x1ZEc4Z2RHaGxJSFpwY25SMVlXd2dkSEpsWlM1Y2JpQWdJQ0FnSUNBZ2IyeGtWSEpsWlM1aGRIUnlhV0oxZEdWelcyOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGN5NXNaVzVuZEdoZElEMGdZWFIwY2p0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJCWkdRZ2RHaGxJR05vWVc1blpTQjBieUIwYUdVZ2MyVnlhV1Z6SUc5bUlIQmhkR05vWlhNdVhHNGdJQ0FnSUNBZ0lIQmhkR05vWlhOYmNHRjBZMmhsY3k1c1pXNW5kR2hkSUQwZ1kyaGhibWRsTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUVOb1pXTnJJR1p2Y2lCeVpXMXZkbUZzY3k1Y2JpQWdJQ0JwWmlBb2IyeGtUR1Z1WjNSb0lENGdibVYzVEdWdVozUm9LU0I3WEc0Z0lDQWdJQ0JzWlhRZ2RHOVNaVzF2ZG1VZ1BTQnpiR2xqWlM1allXeHNLRzlzWkZSeVpXVXVZWFIwY21saWRYUmxjeXdnYm1WM1RHVnVaM1JvS1R0Y2JseHVJQ0FnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBiMUpsYlc5MlpTNXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnSUNCc1pYUWdZMmhoYm1kbElEMGdlMXh1SUNBZ0lDQWdJQ0FnSUY5ZlpHOWZYem9nTWl4Y2JpQWdJQ0FnSUNBZ0lDQmxiR1Z0Wlc1ME9pQnZiR1JGYkdWdFpXNTBMRnh1SUNBZ0lDQWdJQ0FnSUc1aGJXVTZJSFJ2VW1WdGIzWmxXMmxkTG01aGJXVXNYRzRnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJSFZ1WkdWbWFXNWxaQ3hjYmlBZ0lDQWdJQ0FnZlR0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJTWlcxdmRtVWdkR2hsSUdGMGRISnBZblYwWlNCbWNtOXRJSFJvWlNCMmFYSjBkV0ZzSUc1dlpHVXVYRzRnSUNBZ0lDQWdJR3hsZENCeVpXMXZkbVZrSUQwZ2IyeGtWSEpsWlM1aGRIUnlhV0oxZEdWekxuTndiR2xqWlNocExDQXhLVHRjYmx4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElISmxiVzkyWldRdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnSUNCd2IyOXNjeTVoZEhSeWFXSjFkR1ZQWW1wbFkzUXVkVzV3Y205MFpXTjBLSEpsYlc5MlpXUmJhVjBwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnUVdSa0lIUm9aU0JqYUdGdVoyVWdkRzhnZEdobElITmxjbWxsY3lCdlppQndZWFJqYUdWekxseHVJQ0FnSUNBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlHTm9ZVzVuWlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCRGFHVmpheUJtYjNJZ2JXOWthV1pwWTJGMGFXOXVjeTVjYmlBZ0lDQnNaWFFnZEc5TmIyUnBabmtnUFNCaGRIUnlhV0oxZEdWek8xeHVYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBiMDF2WkdsbWVTNXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnYkdWMElHOXNaRUYwZEhKV1lXeDFaU0E5SUc5c1pGUnlaV1V1WVhSMGNtbGlkWFJsYzF0cFhTQW1KaUJ2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE5iYVYwdWRtRnNkV1U3WEc0Z0lDQWdJQ0JzWlhRZ2JtVjNRWFIwY2xaaGJIVmxJRDBnWVhSMGNtbGlkWFJsYzF0cFhTQW1KaUJoZEhSeWFXSjFkR1Z6VzJsZExuWmhiSFZsTzF4dVhHNGdJQ0FnSUNBdkx5QlBibXg1SUhCMWMyZ2dhVzRnWVNCamFHRnVaMlVnYVdZZ2RHaGxJR0YwZEhKcFluVjBaU0J2Y2lCMllXeDFaU0JqYUdGdVoyVnpMbHh1SUNBZ0lDQWdhV1lnS0c5c1pFRjBkSEpXWVd4MVpTQWhQVDBnYm1WM1FYUjBjbFpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJR3hsZENCamFHRnVaMlVnUFNCN1hHNGdJQ0FnSUNBZ0lDQWdYMTlrYjE5Zk9pQXlMRnh1SUNBZ0lDQWdJQ0FnSUdWc1pXMWxiblE2SUc5c1pFVnNaVzFsYm5Rc1hHNGdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ2RHOU5iMlJwWm5sYmFWMHVibUZ0WlN4Y2JpQWdJQ0FnSUNBZ0lDQjJZV3gxWlRvZ2RHOU5iMlJwWm5sYmFWMHVkbUZzZFdVc1hHNGdJQ0FnSUNBZ0lIMDdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1VtVndiR0ZqWlNCMGFHVWdZWFIwY21saWRYUmxJR2x1SUhSb1pTQjJhWEowZFdGc0lHNXZaR1V1WEc0Z0lDQWdJQ0FnSUd4bGRDQmhkSFJ5SUQwZ2IyeGtWSEpsWlM1aGRIUnlhV0oxZEdWelcybGRPMXh1SUNBZ0lDQWdJQ0JoZEhSeUxtNWhiV1VnUFNCMGIwMXZaR2xtZVZ0cFhTNXVZVzFsTzF4dUlDQWdJQ0FnSUNCaGRIUnlMblpoYkhWbElEMGdkRzlOYjJScFpubGJhVjB1ZG1Gc2RXVTdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJSFJvWlNCamFHRnVaMlVnZEc4Z2RHaGxJSE5sY21sbGN5QnZaaUJ3WVhSamFHVnpMbHh1SUNBZ0lDQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJR05vWVc1blpUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZMeUJUZVc1aklHVmhZMmdnWTNWeWNtVnVkQ0J1YjJSbExseHVJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUc5c1pFTm9hV3hrVG05a1pYTXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0JwWmlBb2IyeGtRMmhwYkdST2IyUmxjMXRwWFM1bGJHVnRaVzUwSUNFOVBTQmphR2xzWkU1dlpHVnpXMmxkTG1Wc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUhONWJtTXVZMkZzYkNod1lYUmphR1Z6TENCdmJHUlVjbVZsTG1Ob2FXeGtUbTlrWlhOYmFWMHNJR05vYVd4a1RtOWtaWE5iYVYwcE8xeHVJQ0FnSUgxY2JpQWdmVnh1ZlZ4dUlsMTkiLCIvLyBDYWNoZSBwcmVidWlsdCB0cmVlcyBhbmQgbG9va3VwIGJ5IGVsZW1lbnQuXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBUcmVlQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuZXhwb3J0cy5UcmVlQ2FjaGUgPSBUcmVlQ2FjaGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDI1dlpHVXZkSEpsWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3UVVGRFR5eEpRVUZOTEZOQlFWTXNSMEZCUnl4SlFVRkpMRTlCUVU4c1JVRkJSU3hEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2ZEhKbFpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFTmhZMmhsSUhCeVpXSjFhV3gwSUhSeVpXVnpJR0Z1WkNCc2IyOXJkWEFnWW5rZ1pXeGxiV1Z1ZEM1Y2JtVjRjRzl5ZENCamIyNXpkQ0JVY21WbFEyRmphR1VnUFNCdVpYY2dWMlZoYTAxaGNDZ3BPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBwcm9jZXNzO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfdHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuLi90cmFuc2l0aW9ucycpO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsRGVjb2RlID0gcmVxdWlyZSgnLi4vdXRpbC9kZWNvZGUnKTtcblxudmFyIF91dGlsRGVjb2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxEZWNvZGUpO1xuXG52YXIgX2VsZW1lbnRHZXQgPSByZXF1aXJlKCcuLi9lbGVtZW50L2dldCcpO1xuXG52YXIgX2VsZW1lbnRHZXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudEdldCk7XG5cbnZhciBfZWxlbWVudEN1c3RvbSA9IHJlcXVpcmUoJy4uL2VsZW1lbnQvY3VzdG9tJyk7XG5cbnZhciBfbm9kZU1ha2UgPSByZXF1aXJlKCcuLi9ub2RlL21ha2UnKTtcblxudmFyIF9ub2RlTWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlTWFrZSk7XG5cbnZhciBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG52YXIgZW1wdHkgPSB7IHByb3RvdHlwZToge30gfTtcblxuLyoqXG4gKiBQcm9jZXNzZXMgYW4gQXJyYXkgb2YgcGF0Y2hlcy5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCAtIEVsZW1lbnQgdG8gcHJvY2VzcyBwYXRjaHNldHMgb24uXG4gKiBAcGFyYW0gZSAtIE9iamVjdCB0aGF0IGNvbnRhaW5zIHBhdGNoZXMuXG4gKi9cblxuZnVuY3Rpb24gcHJvY2VzcyhlbGVtZW50LCBwYXRjaGVzKSB7XG4gIHZhciBzdGF0ZXMgPSBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcztcbiAgdmFyIHByb21pc2VzID0gW107XG4gIHZhciBhZGRQcm9taXNlcyA9IHByb21pc2VzLnB1c2guYXBwbHkuYmluZChwcm9taXNlcy5wdXNoLCBwcm9taXNlcyk7XG5cbiAgLy8gVHJpZ2dlciB0aGUgYXR0YWNoZWQgdHJhbnNpdGlvbiBzdGF0ZSBmb3IgdGhpcyBlbGVtZW50IGFuZCBhbGwgY2hpbGROb2Rlcy5cbiAgdmFyIGF0dGFjaGVkVHJhbnNpdGlvbkFuZFRpdGxlID0gZnVuY3Rpb24gYXR0YWNoZWRUcmFuc2l0aW9uQW5kVGl0bGUoZWwpIHtcbiAgICB2YXIgZWxlbWVudCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkoZWwpLmVsZW1lbnQ7XG5cbiAgICBpZiAoZWwubm9kZU5hbWUgPT09ICcjdGV4dCcgfHwgZWwubm9kZU5hbWUgPT09ICd0ZXh0Jykge1xuICAgICAgLy8gVHJpZ2dlciBhbGwgdGhlIHRleHQgY2hhbmdlZCB2YWx1ZXMuXG4gICAgICBpZiAoc3RhdGVzICYmIHN0YXRlcy50ZXh0Q2hhbmdlZCAmJiBzdGF0ZXMudGV4dENoYW5nZWQubGVuZ3RoKSB7XG4gICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy50ZXh0Q2hhbmdlZC5tYXAoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVsZW1lbnQucGFyZW50Tm9kZSB8fCBlbGVtZW50LCBudWxsLCBlbC5ub2RlVmFsdWUpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFkZGVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgZWxzZSBpZiAoc3RhdGVzICYmIHN0YXRlcy5hdHRhY2hlZCAmJiBzdGF0ZXMuYXR0YWNoZWQubGVuZ3RoKSB7XG4gICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5hdHRhY2hlZC5tYXAoY2FsbENhbGxiYWNrLCBlbGVtZW50KSk7XG4gICAgICB9XG5cbiAgICAvLyBDYWxsIGFsbCBgY2hpbGROb2Rlc2AgYXR0YWNoZWQgY2FsbGJhY2tzIGFzIHdlbGwuXG4gICAgZWwuY2hpbGROb2Rlcy5mb3JFYWNoKGF0dGFjaGVkVHJhbnNpdGlvbkFuZFRpdGxlKTtcblxuICAgIHRpdGxlQ2FsbGJhY2soZWwpO1xuICB9O1xuXG4gIHZhciBjYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICByZXR1cm4gY2FsbGJhY2sodGhpcyk7XG4gIH07XG5cbiAgdmFyIGF0dGFjaGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiBhdHRhY2hlZENhbGxiYWNrKGVsZW1lbnREZXNjcmlwdG9yKSB7XG4gICAgdmFyIGVsID0gKDAsIF9lbGVtZW50R2V0MlsnZGVmYXVsdCddKShlbGVtZW50RGVzY3JpcHRvcikuZWxlbWVudDtcbiAgICB2YXIgZnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50O1xuICAgIHZhciBjdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tlbGVtZW50RGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG5cbiAgICBpZiAoY3VzdG9tRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoZWRDYWxsYmFjaykge1xuICAgICAgY3VzdG9tRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoZWRDYWxsYmFjay5jYWxsKGVsKTtcbiAgICB9XG5cbiAgICBpZiAoZWwubm9kZU5hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gKDAsIF91dGlsRGVjb2RlMlsnZGVmYXVsdCddKShlbC50ZXh0Q29udGVudCk7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnREZXNjcmlwdG9yLmNoaWxkTm9kZXMpIHtcbiAgICAgIGVsZW1lbnREZXNjcmlwdG9yLmNoaWxkTm9kZXMuZm9yRWFjaChhdHRhY2hlZENhbGxiYWNrLCB7XG4gICAgICAgIGZyYWdtZW50OiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB0aXRsZUNhbGxiYWNrID0gZnVuY3Rpb24gdGl0bGVDYWxsYmFjayhlbGVtZW50RGVzY3JpcHRvcikge1xuICAgIHZhciBlbCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkoZWxlbWVudERlc2NyaXB0b3IpLmVsZW1lbnQ7XG5cbiAgICAvLyBFbnN1cmUgdGhlIHRpdGxlIGlzIHNldCBjb3JyZWN0bHkuXG4gICAgaWYgKGVsLnRhZ05hbWUgPT09ICd0aXRsZScpIHtcbiAgICAgIGVsLm93bmVyRG9jdW1lbnQudGl0bGUgPSBlbC5jaGlsZE5vZGVzWzBdLm5vZGVWYWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGF0Y2hlcyBhbmQgYXBwbHkgdGhlbS5cblxuICB2YXIgX2xvb3AgPSBmdW5jdGlvbiAoaSkge1xuICAgIHZhciBwYXRjaCA9IHBhdGNoZXNbaV07XG4gICAgdmFyIG5ld0Rlc2NyaXB0b3IgPSB1bmRlZmluZWQsXG4gICAgICAgIG9sZERlc2NyaXB0b3IgPSB1bmRlZmluZWQsXG4gICAgICAgIGVsZW1lbnREZXNjcmlwdG9yID0gdW5kZWZpbmVkO1xuICAgIHZhciBlbGVtZW50ID0gcGF0Y2hbJ25ldyddO1xuXG4gICAgaWYgKHBhdGNoLmVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnREZXNjcmlwdG9yID0gcGF0Y2guZWxlbWVudDtcblxuICAgICAgdmFyIHJlc3VsdCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkocGF0Y2guZWxlbWVudCk7XG4gICAgICBwYXRjaC5lbGVtZW50ID0gcmVzdWx0LmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKHBhdGNoLm9sZCkge1xuICAgICAgb2xkRGVzY3JpcHRvciA9IHBhdGNoLm9sZDtcblxuICAgICAgdmFyIHJlc3VsdCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkocGF0Y2gub2xkKTtcbiAgICAgIHBhdGNoLm9sZCA9IHJlc3VsdC5lbGVtZW50O1xuICAgIH1cblxuICAgIGlmIChwYXRjaFsnbmV3J10pIHtcbiAgICAgIG5ld0Rlc2NyaXB0b3IgPSBwYXRjaFsnbmV3J107XG5cbiAgICAgIHZhciByZXN1bHQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKHBhdGNoWyduZXcnXSk7XG4gICAgICBwYXRjaFsnbmV3J10gPSByZXN1bHQuZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBwYXRjaFsnbmV3J10udGV4dENvbnRlbnQgPSAoMCwgX3V0aWxEZWNvZGUyWydkZWZhdWx0J10pKGVsZW1lbnQubm9kZVZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIHRoZSBlbnRpcmUgTm9kZS5cbiAgICBpZiAocGF0Y2guX19kb19fID09PSAwKSB7XG4gICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0Y2hbJ25ldyddLCBwYXRjaC5vbGQpO1xuXG4gICAgICB2YXIgb2xkQ3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbb2xkRGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG4gICAgICB2YXIgbmV3Q3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbbmV3RGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG5cbiAgICAgIGlmIChvbGRDdXN0b21FbGVtZW50LnByb3RvdHlwZS5kZXRhY2hlZENhbGxiYWNrKSB7XG4gICAgICAgIG9sZEN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmRldGFjaGVkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV3Q3VzdG9tRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICBuZXdDdXN0b21FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hlZENhbGxiYWNrLmNhbGwocGF0Y2hbJ25ldyddKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb2RlIG1hbmlwLlxuICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMSkge1xuICAgICAgICAvLyBBZGQuXG4gICAgICAgIGlmIChwYXRjaC5lbGVtZW50ICYmIHBhdGNoLmZyYWdtZW50ICYmICFwYXRjaC5vbGQpIHtcbiAgICAgICAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgICBwYXRjaC5mcmFnbWVudC5mb3JFYWNoKGF0dGFjaGVkQ2FsbGJhY2ssIHsgZnJhZ21lbnQ6IGZyYWdtZW50IH0pO1xuICAgICAgICAgIHBhdGNoLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG4gICAgICAgICAgZm9yRWFjaC5jYWxsKHBhdGNoLmZyYWdtZW50LCBhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUuXG4gICAgICAgIGVsc2UgaWYgKHBhdGNoLm9sZCAmJiAhcGF0Y2hbJ25ldyddKSB7XG4gICAgICAgICAgICBpZiAoIXBhdGNoLm9sZC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCByZW1vdmUgd2l0aG91dCBwYXJlbnQsIGlzIHRoaXMgdGhlICcgKyAnZG9jdW1lbnQgcm9vdD8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRW5zdXJlIHRoZSB0aXRsZSBpcyBlbXB0aWVkLlxuICAgICAgICAgICAgaWYgKHBhdGNoLm9sZC50YWdOYW1lID09PSAndGl0bGUnKSB7XG4gICAgICAgICAgICAgIHBhdGNoLm9sZC5vd25lckRvY3VtZW50LnRpdGxlID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tvbGREZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICAgICAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmRldGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY3VzdG9tRWxlbWVudC5wcm90b3R5cGUuZGV0YWNoZWRDYWxsYmFjay5jYWxsKHBhdGNoLm9sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhdGNoLm9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBhdGNoLm9sZCk7XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmRldGFjaGVkICYmIHN0YXRlcy5kZXRhY2hlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgYWRkUHJvbWlzZXMoc3RhdGVzLmRldGFjaGVkLm1hcChjYWxsQ2FsbGJhY2ssIHBhdGNoLm9sZCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfbm9kZU1ha2UyWydkZWZhdWx0J10ubm9kZXNbb2xkRGVzY3JpcHRvci5lbGVtZW50XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZXBsYWNlLlxuICAgICAgICAgIGVsc2UgaWYgKHBhdGNoLm9sZCAmJiBwYXRjaFsnbmV3J10pIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCByZXBsYWNlIHdpdGhvdXQgcGFyZW50LCBpcyB0aGlzIHRoZSAnICsgJ2RvY3VtZW50IHJvb3Q/Jyk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIGVsZW1lbnQgZmlyc3QsIGJlZm9yZSBkb2luZyB0aGUgcmVwbGFjZW1lbnQuXG4gICAgICAgICAgICAgIHBhdGNoLm9sZC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwYXRjaFsnbmV3J10sIHBhdGNoLm9sZC5uZXh0U2libGluZyk7XG5cbiAgICAgICAgICAgICAgLy8gUmVtb3ZlZCBzdGF0ZSBmb3IgdHJhbnNpdGlvbnMgQVBJLlxuICAgICAgICAgICAgICBpZiAoc3RhdGVzICYmIHN0YXRlcy5kZXRhY2hlZCAmJiBzdGF0ZXMuZGV0YWNoZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYWRkUHJvbWlzZXMoc3RhdGVzLmRldGFjaGVkLm1hcChjYWxsQ2FsbGJhY2ssIHBhdGNoLm9sZCkpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gUmVwbGFjZWQgc3RhdGUgZm9yIHRyYW5zaXRpb25zIEFQSS5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMucmVwbGFjZWQgJiYgc3RhdGVzLnJlcGxhY2VkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5yZXBsYWNlZC5tYXAoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2socGF0Y2gub2xkLCBwYXRjaFsnbmV3J10pO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgdGl0bGUgaXMgc2V0IGNvcnJlY3RseS5cbiAgICAgICAgICAgICAgaWYgKHBhdGNoWyduZXcnXS50YWdOYW1lID09PSAndGl0bGUnKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gub2xkLm93bmVyRG9jdW1lbnQudGl0bGUgPSBwYXRjaFsnbmV3J10uY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGF0Y2hbJ25ldyddLCBwYXRjaC5vbGQpO1xuXG4gICAgICAgICAgICAgIHZhciBvbGRDdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tvbGREZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcbiAgICAgICAgICAgICAgdmFyIG5ld0N1c3RvbUVsZW1lbnQgPSBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW25ld0Rlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuXG4gICAgICAgICAgICAgIGlmIChvbGRDdXN0b21FbGVtZW50LnByb3RvdHlwZS5kZXRhY2hlZENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgb2xkQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuZGV0YWNoZWRDYWxsYmFjay5jYWxsKHBhdGNoLm9sZCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAobmV3Q3VzdG9tRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIG5ld0N1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2suY2FsbChwYXRjaFsnbmV3J10pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQWRkZWQgc3RhdGUgZm9yIHRyYW5zaXRpb25zIEFQSS5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuYXR0YWNoZWQgJiYgc3RhdGVzLmF0dGFjaGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGF0dGFjaGVkVHJhbnNpdGlvbkFuZFRpdGxlKG5ld0Rlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW29sZERlc2NyaXB0b3IuZWxlbWVudF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEF0dHJpYnV0ZSBtYW5pcHVsYXRpb24uXG4gICAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDIpIHtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gcGF0Y2guZWxlbWVudC5nZXRBdHRyaWJ1dGUocGF0Y2gubmFtZSk7XG5cbiAgICAgICAgICAgIC8vIENoYW5nZXMgdGhlIGF0dHJpYnV0ZSBvbiB0aGUgZWxlbWVudC5cbiAgICAgICAgICAgIHZhciBhdWdtZW50QXR0cmlidXRlID0gZnVuY3Rpb24gYXVnbWVudEF0dHJpYnV0ZSgpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlLlxuICAgICAgICAgICAgICBpZiAoIXBhdGNoLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2guZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUocGF0Y2gubmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gQ2hhbmdlLlxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBhdGNoLmVsZW1lbnQuc2V0QXR0cmlidXRlKHBhdGNoLm5hbWUsIHBhdGNoLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGFsbCB0aGUgYXR0cmlidXRlIGNoYW5nZWQgdmFsdWVzLlxuICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuYXR0cmlidXRlQ2hhbmdlZCAmJiBzdGF0ZXMuYXR0cmlidXRlQ2hhbmdlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgYWRkUHJvbWlzZXMoc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQubWFwKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gY2FsbGJhY2socGF0Y2guZWxlbWVudCwgcGF0Y2gubmFtZSwgb2xkVmFsdWUsIHBhdGNoLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oYXVnbWVudEF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGF1Z21lbnRBdHRyaWJ1dGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYXVnbWVudEF0dHJpYnV0ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGN1c3RvbSBlbGVtZW50IGF0dHJpYnV0ZUNoYW5nZWQgZXZlbnRzLlxuICAgICAgICAgICAgdmFyIGN1c3RvbUVsZW1lbnQgPSBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW2VsZW1lbnREZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICAgICAgICAgICAgaWYgKGN1c3RvbUVsZW1lbnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5jYWxsKHBhdGNoLm9sZCwgcGF0Y2gubmFtZSwgb2xkVmFsdWUsIHBhdGNoLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGV4dCBub2RlIG1hbmlwdWxhdGlvbi5cbiAgICAgICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxWYWx1ZSA9IHBhdGNoLmVsZW1lbnQudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgICAgICAgLy8gQ2hhbmdlcyB0aGUgdGV4dC5cbiAgICAgICAgICAgICAgdmFyIGF1Z21lbnRUZXh0ID0gZnVuY3Rpb24gYXVnbWVudFRleHQoKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2guZWxlbWVudC50ZXh0Q29udGVudCA9ICgwLCBfdXRpbERlY29kZTJbJ2RlZmF1bHQnXSkocGF0Y2gudmFsdWUpO1xuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIC8vIFRyaWdnZXIgYWxsIHRoZSB0ZXh0IGNoYW5nZWQgdmFsdWVzLlxuICAgICAgICAgICAgICBpZiAoc3RhdGVzICYmIHN0YXRlcy50ZXh0Q2hhbmdlZCAmJiBzdGF0ZXMudGV4dENoYW5nZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYWRkUHJvbWlzZXMoc3RhdGVzLnRleHRDaGFuZ2VkLm1hcChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gY2FsbGJhY2socGF0Y2guZWxlbWVudC5wYXJlbnROb2RlIHx8IHBhdGNoLmVsZW1lbnQsIG9yaWdpbmFsVmFsdWUsIHBhdGNoLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGF1Z21lbnRUZXh0KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF1Z21lbnRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXRjaC5lbGVtZW50LnRleHRDb250ZW50ID0gKDAsIF91dGlsRGVjb2RlMlsnZGVmYXVsdCddKShwYXRjaC52YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfVxuICB9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIF9sb29wKGkpO1xuICB9XG5cbiAgdmFyIGFjdGl2ZVByb21pc2VzID0gcHJvbWlzZXMuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIC8vIFdhaXQgdW50aWwgYWxsIHRyYW5zaXRpb24gcHJvbWlzZXMgaGF2ZSByZXNvbHZlZC5cbiAgaWYgKGFjdGl2ZVByb21pc2VzLmxlbmd0aCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcy5maWx0ZXIoQm9vbGVhbikpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzQmhkR05vWlhNdmNISnZZMlZ6Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenR4UWtGblFuZENMRTlCUVU4N096czdNa0pCYUVKRkxHZENRVUZuUWpzN2VVSkJRek5DTEdWQlFXVTdPekJDUVVOV0xHZENRVUZuUWpzN096c3dRa0ZEY0VJc1owSkJRV2RDT3pzN096WkNRVU5hTEcxQ1FVRnRRanM3ZDBKQlEzcENMR05CUVdNN096czdRVUZGYmtNc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNN1FVRkRkRU1zU1VGQlNTeExRVUZMTEVkQlFVY3NSVUZCUlN4VFFVRlRMRVZCUVVVc1JVRkJSU3hGUVVGRkxFTkJRVU03T3pzN096czdPenRCUVZGbUxGTkJRVk1zVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRhRVFzVFVGQlNTeE5RVUZOTEdkRFFVRnRRaXhEUVVGRE8wRkJRemxDTEUxQlFVa3NVVUZCVVN4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOc1FpeE5RVUZKTEZkQlFWY3NSMEZCUnl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6czdPMEZCUjNCRkxFMUJRVWtzTUVKQlFUQkNMRWRCUVVjc1UwRkJOMElzTUVKQlFUQkNMRU5CUVZrc1JVRkJSU3hGUVVGRk8wRkJRelZETEZGQlFVa3NUMEZCVHl4SFFVRkhMRFpDUVVGWExFVkJRVVVzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXpzN1FVRkZja01zVVVGQlNTeEZRVUZGTEVOQlFVTXNVVUZCVVN4TFFVRkxMRTlCUVU4c1NVRkJTU3hGUVVGRkxFTkJRVU1zVVVGQlVTeExRVUZMTEUxQlFVMHNSVUZCUlRzN1FVRkZja1FzVlVGQlNTeE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMRmRCUVZjc1NVRkJTU3hOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTTNSQ3h0UWtGQlZ5eERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVUVzVVVGQlVTeEZRVUZKTzBGQlF6ZERMR2xDUVVGUExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4SlFVRkpMRTlCUVU4c1JVRkJSU3hKUVVGSkxFVkJRVVVzUlVGQlJTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMU5CUTNCRkxFTkJRVU1zUTBGQlF5eERRVUZETzA5QlEwdzdTMEZEUmpzN1UwRkZTU3hKUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlF6VkVMRzFDUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1dVRkJXU3hGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTTdUMEZEZWtRN096dEJRVWRFTEUxQlFVVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExEQkNRVUV3UWl4RFFVRkRMRU5CUVVNN08wRkJSV3hFTEdsQ1FVRmhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03UjBGRGJrSXNRMEZCUXpzN1FVRkZSaXhOUVVGSkxGbEJRVmtzUjBGQlJ5eFRRVUZtTEZsQlFWa3NRMEZCV1N4UlFVRlJMRVZCUVVVN1FVRkRjRU1zVjBGQlR5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRka0lzUTBGQlF6czdRVUZGUml4TlFVRkpMR2RDUVVGblFpeEhRVUZITEZOQlFXNUNMR2RDUVVGblFpeERRVUZaTEdsQ1FVRnBRaXhGUVVGRk8wRkJRMnBFTEZGQlFVa3NSVUZCUlN4SFFVRkhMRFpDUVVGWExHbENRVUZwUWl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJReTlETEZGQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRE4wSXNVVUZCU1N4aFFVRmhMRWRCUVVjc01FSkJRVmNzYVVKQlFXbENMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZET3p0QlFVVndSU3hSUVVGSkxHRkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVU3UVVGRE5VTXNiVUpCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzB0QlEyNUVPenRCUVVWRUxGRkJRVWtzUlVGQlJTeERRVUZETEZGQlFWRXNTMEZCU3l4UFFVRlBMRVZCUVVVN1FVRkRNMElzVVVGQlJTeERRVUZETEZkQlFWY3NSMEZCUnl3MlFrRkJaU3hGUVVGRkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdTMEZEYWtRN08wRkJSVVFzVVVGQlNTeHBRa0ZCYVVJc1EwRkJReXhWUVVGVkxFVkJRVVU3UVVGRGFFTXNkVUpCUVdsQ0xFTkJRVU1zVlVGQlZTeERRVUZETEU5QlFVOHNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU55UkN4blFrRkJVU3hGUVVGRkxFdEJRVXM3VDBGRGFFSXNRMEZCUXl4RFFVRkRPMHRCUTBvN08wRkJSVVFzVVVGQlNTeFJRVUZSTEVWQlFVVTdRVUZEV2l4alFVRlJMRU5CUVVNc1YwRkJWeXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzB0QlF6RkNPMGRCUTBZc1EwRkJRenM3UVVGRlJpeE5RVUZKTEdGQlFXRXNSMEZCUnl4VFFVRm9RaXhoUVVGaExFTkJRVmtzYVVKQlFXbENMRVZCUVVVN1FVRkRPVU1zVVVGQlNTeEZRVUZGTEVkQlFVY3NOa0pCUVZjc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNN096dEJRVWN2UXl4UlFVRkpMRVZCUVVVc1EwRkJReXhQUVVGUExFdEJRVXNzVDBGQlR5eEZRVUZGTzBGQlF6RkNMRkZCUVVVc1EwRkJReXhoUVVGaExFTkJRVU1zUzBGQlN5eEhRVUZITEVWQlFVVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETzB0QlEzSkVPMGRCUTBZc1EwRkJRenM3T3p0M1FrRkhUeXhEUVVGRE8wRkJRMUlzVVVGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM1pDTEZGQlFVa3NZVUZCWVN4WlFVRkJPMUZCUVVVc1lVRkJZU3haUVVGQk8xRkJRVVVzYVVKQlFXbENMRmxCUVVFc1EwRkJRenRCUVVOd1JDeFJRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRTlCUVVrc1EwRkJRenM3UVVGRmVFSXNVVUZCU1N4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRMnBDTEhWQ1FVRnBRaXhIUVVGSExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMEZCUld4RExGVkJRVWtzVFVGQlRTeEhRVUZITERaQ1FVRlhMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU4yUXl4WFFVRkxMRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTTdTMEZEYUVNN08wRkJSVVFzVVVGQlNTeExRVUZMTEVOQlFVTXNSMEZCUnl4RlFVRkZPMEZCUTJJc2JVSkJRV0VzUjBGQlJ5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRPenRCUVVVeFFpeFZRVUZKTEUxQlFVMHNSMEZCUnl3MlFrRkJWeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEYmtNc1YwRkJTeXhEUVVGRExFZEJRVWNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRPMHRCUXpWQ096dEJRVVZFTEZGQlFVa3NTMEZCU3l4UFFVRkpMRVZCUVVVN1FVRkRZaXh0UWtGQllTeEhRVUZITEV0QlFVc3NUMEZCU1N4RFFVRkRPenRCUVVVeFFpeFZRVUZKTEUxQlFVMHNSMEZCUnl3MlFrRkJWeXhMUVVGTExFOUJRVWtzUTBGQlF5eERRVUZETzBGQlEyNURMRmRCUVVzc1QwRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTTdTMEZETlVJN08wRkJSVVFzVVVGQlNTeFBRVUZQTEVsQlFVa3NUMEZCVHl4RFFVRkRMRkZCUVZFc1MwRkJTeXhQUVVGUExFVkJRVVU3UVVGRE0wTXNWMEZCU3l4UFFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExEWkNRVUZsTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRMUVVNelJEczdPMEZCUjBRc1VVRkJTU3hMUVVGTExFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNSVUZCUlR0QlFVTjBRaXhYUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhQUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWNFJDeFZRVUZKTEdkQ1FVRm5RaXhIUVVGSExEQkNRVUZYTEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRGJrVXNWVUZCU1N4blFrRkJaMElzUjBGQlJ5d3dRa0ZCVnl4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZET3p0QlFVVnVSU3hWUVVGSkxHZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNSVUZCUlR0QlFVTXZReXgzUWtGQlowSXNRMEZCUXl4VFFVRlRMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dFBRVU0zUkRzN1FVRkZSQ3hWUVVGSkxHZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNSVUZCUlR0QlFVTXZReXgzUWtGQlowSXNRMEZCUXl4VFFVRlRMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJTU3hEUVVGRExFTkJRVU03VDBGRE4wUTdTMEZEUmpzN08xTkJSMGtzU1VGQlNTeExRVUZMTEVOQlFVTXNUVUZCVFN4TFFVRkxMRU5CUVVNc1JVRkJSVHM3UVVGRk0wSXNXVUZCU1N4TFFVRkxMRU5CUVVNc1QwRkJUeXhKUVVGSkxFdEJRVXNzUTBGQlF5eFJRVUZSTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhGUVVGRk8wRkJRMnBFTEdOQlFVa3NVVUZCVVN4SFFVRkhMRkZCUVZFc1EwRkJReXh6UWtGQmMwSXNSVUZCUlN4RFFVRkRPenRCUVVWcVJDeGxRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhuUWtGQlowSXNSVUZCUlN4RlFVRkZMRkZCUVZFc1JVRkJVaXhSUVVGUkxFVkJRVVVzUTBGQlF5eERRVUZETzBGQlEzWkVMR1ZCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVjBGQlZ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVWd1F5eHBRa0ZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTERCQ1FVRXdRaXhEUVVGRExFTkJRVU03VTBGRE1VUTdPenRoUVVkSkxFbEJRVWtzUzBGQlN5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJTU3hGUVVGRk8wRkJRMmhETEdkQ1FVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVWQlFVVTdRVUZEZWtJc2IwSkJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTXNORU5CUVRSRExFZEJRekZFTEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03WVVGRGNrSTdPenRCUVVkRUxHZENRVUZKTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhMUVVGTExFOUJRVThzUlVGQlJUdEJRVU5xUXl4dFFrRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJRenRoUVVOd1F6czdRVUZGUkN4blFrRkJTU3hoUVVGaExFZEJRVWNzTUVKQlFWY3NZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6czdRVUZGYUVVc1owSkJRVWtzWVVGQllTeERRVUZETEZOQlFWTXNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU0xUXl3eVFrRkJZU3hEUVVGRExGTkJRVk1zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMkZCUXpGRU96dEJRVVZFTEdsQ1FVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVUxUXl4blFrRkJTU3hOUVVGTkxFbEJRVWtzVFVGQlRTeERRVUZETEZGQlFWRXNTVUZCU1N4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU4yUkN4NVFrRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4RFFVRkRMRmxCUVZrc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXp0aFFVTXpSRHM3UVVGRlJDeHJRMEZCVXl4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXp0WFFVTnVSRHM3TzJWQlIwa3NTVUZCU1N4TFFVRkxMRU5CUVVNc1IwRkJSeXhKUVVGSkxFdEJRVXNzVDBGQlNTeEZRVUZGTzBGQlF5OUNMR3RDUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRVZCUVVVN1FVRkRla0lzYzBKQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc05rTkJRVFpETEVkQlF6TkVMR2RDUVVGblFpeERRVUZETEVOQlFVTTdaVUZEY2tJN096dEJRVWRFTEcxQ1FVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eFpRVUZaTEVOQlFVTXNTMEZCU3l4UFFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXpzN08wRkJSM0JGTEd0Q1FVRkpMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM1pFTERKQ1FVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNXVUZCV1N4RlFVRkZMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzJWQlF6TkVPenM3UVVGSFJDeHJRa0ZCU1N4TlFVRk5MRWxCUVVrc1RVRkJUU3hEUVVGRExGRkJRVkVzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOMlJDd3lRa0ZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVRXNVVUZCVVN4RlFVRkpPMEZCUXpGRExIbENRVUZQTEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhGUVVGRkxFdEJRVXNzVDBGQlNTeERRVUZETEVOQlFVTTdhVUpCUTNaRExFTkJRVU1zUTBGQlF5eERRVUZETzJWQlEwdzdPenRCUVVkRUxHdENRVUZKTEV0QlFVc3NUMEZCU1N4RFFVRkRMRTlCUVU4c1MwRkJTeXhQUVVGUExFVkJRVVU3UVVGRGFrTXNjVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zWVVGQllTeERRVUZETEV0QlFVc3NSMEZCUnl4TFFVRkxMRTlCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNVMEZCVXl4RFFVRkRPMlZCUTI1Rk96dEJRVVZFTEcxQ1FVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eFpRVUZaTEVOQlFVTXNTMEZCU3l4UFFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVjRSQ3hyUWtGQlNTeG5Ra0ZCWjBJc1IwRkJSeXd3UWtGQlZ5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRE8wRkJRMjVGTEd0Q1FVRkpMR2RDUVVGblFpeEhRVUZITERCQ1FVRlhMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeExRVUZMTEVOQlFVTTdPMEZCUlc1RkxHdENRVUZKTEdkQ1FVRm5RaXhEUVVGRExGTkJRVk1zUTBGQlF5eG5Ra0ZCWjBJc1JVRkJSVHRCUVVNdlF5eG5RMEZCWjBJc1EwRkJReXhUUVVGVExFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0bFFVTTNSRHM3UVVGRlJDeHJRa0ZCU1N4blFrRkJaMElzUTBGQlF5eFRRVUZUTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVU3UVVGREwwTXNaME5CUVdkQ0xFTkJRVU1zVTBGQlV5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVa3NRMEZCUXl4RFFVRkRPMlZCUXpkRU96czdRVUZIUkN4clFrRkJTU3hOUVVGTkxFbEJRVWtzVFVGQlRTeERRVUZETEZGQlFWRXNTVUZCU1N4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU4yUkN3d1EwRkJNRUlzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXp0bFFVTXpRenM3UVVGRlJDeHZRMEZCVXl4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXp0aFFVTnVSRHRQUVVOR096czdWMEZIU1N4SlFVRkpMRXRCUVVzc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eEZRVUZGT3p0QlFVTXpRaXhuUWtGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenM3UVVGSGRFUXNaMEpCUVVrc1owSkJRV2RDTEVkQlFVY3NVMEZCYmtJc1owSkJRV2RDTEVkQlFXTTdPMEZCUldoRExHdENRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1JVRkJSVHRCUVVGRkxIRkNRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMR1ZCUVdVc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdaVUZCUlRzN2JVSkJSVE5FTzBGQlFVVXNkVUpCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzJsQ1FVRkZPMkZCUXpsRUxFTkJRVU03T3p0QlFVZEdMR2RDUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNaMEpCUVdkQ0xFbEJRVWtzVFVGQlRTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU4yUlN4NVFrRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlFTeFJRVUZSTEVWQlFVazdRVUZEYkVRc2IwSkJRVWtzVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRkxFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVTjRSQ3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUldZc2IwSkJRVWtzVDBGQlR5eEZRVUZGTzBGQlFVVXNlVUpCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1EwRkJRenRwUWtGQlJTeE5RVU16UXp0QlFVRkZMR3REUVVGblFpeEZRVUZGTEVOQlFVTTdhVUpCUVVVN08wRkJSVFZDTEhWQ1FVRlBMRTlCUVU4c1EwRkJRenRsUVVOb1FpeERRVUZETEVOQlFVTXNRMEZCUXp0aFFVTk1MRTFCUTBrN1FVRkRTQ3c0UWtGQlowSXNSVUZCUlN4RFFVRkRPMkZCUTNCQ096czdRVUZIUkN4blFrRkJTU3hoUVVGaExFZEJRVWNzTUVKQlFWY3NhVUpCUVdsQ0xFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NTMEZCU3l4RFFVRkRPenRCUVVWd1JTeG5Ra0ZCU1N4aFFVRmhMRU5CUVVNc2QwSkJRWGRDTEVWQlFVVTdRVUZETVVNc01rSkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRVZCUXpkRUxFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dGhRVU4wUXpzN1UwRkRSanM3TzJGQlIwa3NTVUZCU1N4TFFVRkxMRU5CUVVNc1RVRkJUU3hMUVVGTExFTkJRVU1zUlVGQlJUczdRVUZETTBJc2EwSkJRVWtzWVVGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZIT1VNc2EwSkJRVWtzVjBGQlZ5eEhRVUZITEZOQlFXUXNWMEZCVnl4SFFVRmpPMEZCUXpOQ0xIRkNRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmRCUVZjc1IwRkJSeXcyUWtGQlpTeExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1pVRkRla1FzUTBGQlF6czdPMEZCUjBZc2EwSkJRVWtzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4WFFVRlhMRWxCUVVrc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZETjBRc01rSkJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGQkxGRkJRVkVzUlVGQlNUdEJRVU0zUXl4elFrRkJTU3hQUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFdEJRVXNzUTBGQlF5eFBRVUZQTEVWQlF6bEVMR0ZCUVdFc1JVRkJSU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlRsQ0xITkNRVUZKTEU5QlFVOHNSVUZCUlR0QlFVRkZMREpDUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMjFDUVVGRkxFMUJRM1JETzBGQlFVVXNLMEpCUVZjc1JVRkJSU3hEUVVGRE8yMUNRVUZGT3p0QlFVVjJRaXg1UWtGQlR5eFBRVUZQTEVOQlFVTTdhVUpCUTJoQ0xFTkJRVU1zUTBGQlF5eERRVUZETzJWQlEwd3NUVUZEU1R0QlFVTklMSEZDUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEZkQlFWY3NSMEZCUnl3MlFrRkJaU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdaVUZEZWtRN08xZEJRMFk3T3p0QlFXNU5TQ3hQUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0VlFVRm9ReXhEUVVGRE8wZEJiMDFVT3p0QlFVVkVMRTFCUVVrc1kwRkJZeXhIUVVGSExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN096dEJRVWM1UXl4TlFVRkpMR05CUVdNc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGVrSXNWMEZCVHl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVF6dERRVU5HSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNCaGRHTm9aWE12Y0hKdlkyVnpjeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCN0lIUnlZVzV6YVhScGIyNVRkR0YwWlhNZ2ZTQm1jbTl0SUNjdUxpOTBjbUZ1YzJsMGFXOXVjeWM3WEc1cGJYQnZjblFnZXlCd2IyOXNjeUI5SUdaeWIyMGdKeTR1TDNWMGFXd3ZjRzl2YkhNbk8xeHVhVzF3YjNKMElHUmxZMjlrWlVWdWRHbDBhV1Z6SUdaeWIyMGdKeTR1TDNWMGFXd3ZaR1ZqYjJSbEp6dGNibWx0Y0c5eWRDQm5aWFJGYkdWdFpXNTBJR1p5YjIwZ0p5NHVMMlZzWlcxbGJuUXZaMlYwSnp0Y2JtbHRjRzl5ZENCN0lHTnZiWEJ2Ym1WdWRITWdmU0JtY205dElDY3VMaTlsYkdWdFpXNTBMMk4xYzNSdmJTYzdYRzVwYlhCdmNuUWdiV0ZyWlU1dlpHVWdabkp2YlNBbkxpNHZibTlrWlM5dFlXdGxKenRjYmx4dWRtRnlJR1p2Y2tWaFkyZ2dQU0JCY25KaGVTNXdjbTkwYjNSNWNHVXVabTl5UldGamFEdGNiblpoY2lCbGJYQjBlU0E5SUhzZ2NISnZkRzkwZVhCbE9pQjdmU0I5TzF4dVhHNHZLaXBjYmlBcUlGQnliMk5sYzNObGN5QmhiaUJCY25KaGVTQnZaaUJ3WVhSamFHVnpMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQmxiR1Z0Wlc1MElDMGdSV3hsYldWdWRDQjBieUJ3Y205alpYTnpJSEJoZEdOb2MyVjBjeUJ2Ymk1Y2JpQXFJRUJ3WVhKaGJTQmxJQzBnVDJKcVpXTjBJSFJvWVhRZ1kyOXVkR0ZwYm5NZ2NHRjBZMmhsY3k1Y2JpQXFMMXh1Wlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNGdjSEp2WTJWemN5aGxiR1Z0Wlc1MExDQndZWFJqYUdWektTQjdYRzRnSUhaaGNpQnpkR0YwWlhNZ1BTQjBjbUZ1YzJsMGFXOXVVM1JoZEdWek8xeHVJQ0IyWVhJZ2NISnZiV2x6WlhNZ1BTQmJYVHRjYmlBZ2RtRnlJR0ZrWkZCeWIyMXBjMlZ6SUQwZ2NISnZiV2x6WlhNdWNIVnphQzVoY0hCc2VTNWlhVzVrS0hCeWIyMXBjMlZ6TG5CMWMyZ3NJSEJ5YjIxcGMyVnpLVHRjYmx4dUlDQXZMeUJVY21sbloyVnlJSFJvWlNCaGRIUmhZMmhsWkNCMGNtRnVjMmwwYVc5dUlITjBZWFJsSUdadmNpQjBhR2x6SUdWc1pXMWxiblFnWVc1a0lHRnNiQ0JqYUdsc1pFNXZaR1Z6TGx4dUlDQjJZWElnWVhSMFlXTm9aV1JVY21GdWMybDBhVzl1UVc1a1ZHbDBiR1VnUFNCbWRXNWpkR2x2YmlobGJDa2dlMXh1SUNBZ0lIWmhjaUJsYkdWdFpXNTBJRDBnWjJWMFJXeGxiV1Z1ZENobGJDa3VaV3hsYldWdWREdGNibHh1SUNBZ0lHbG1JQ2hsYkM1dWIyUmxUbUZ0WlNBOVBUMGdKeU4wWlhoMEp5QjhmQ0JsYkM1dWIyUmxUbUZ0WlNBOVBUMGdKM1JsZUhRbktTQjdYRzRnSUNBZ0lDQXZMeUJVY21sbloyVnlJR0ZzYkNCMGFHVWdkR1Y0ZENCamFHRnVaMlZrSUhaaGJIVmxjeTVjYmlBZ0lDQWdJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0lDWW1JSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaQzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnWVdSa1VISnZiV2x6WlhNb2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0xtMWhjQ2hqWVd4c1ltRmpheUE5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHTmhiR3hpWVdOcktHVnNaVzFsYm5RdWNHRnlaVzUwVG05a1pTQjhmQ0JsYkdWdFpXNTBMQ0J1ZFd4c0xDQmxiQzV1YjJSbFZtRnNkV1VwTzF4dUlDQWdJQ0FnSUNCOUtTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklFRmtaR1ZrSUhOMFlYUmxJR1p2Y2lCMGNtRnVjMmwwYVc5dWN5QkJVRWt1WEc0Z0lDQWdaV3h6WlNCcFppQW9jM1JoZEdWeklDWW1JSE4wWVhSbGN5NWhkSFJoWTJobFpDQW1KaUJ6ZEdGMFpYTXVZWFIwWVdOb1pXUXViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVZWFIwWVdOb1pXUXViV0Z3S0dOaGJHeERZV3hzWW1GamF5d2daV3hsYldWdWRDa3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRU5oYkd3Z1lXeHNJR0JqYUdsc1pFNXZaR1Z6WUNCaGRIUmhZMmhsWkNCallXeHNZbUZqYTNNZ1lYTWdkMlZzYkM1Y2JpQWdJQ0JsYkM1amFHbHNaRTV2WkdWekxtWnZja1ZoWTJnb1lYUjBZV05vWldSVWNtRnVjMmwwYVc5dVFXNWtWR2wwYkdVcE8xeHVYRzRnSUNBZ2RHbDBiR1ZEWVd4c1ltRmpheWhsYkNrN1hHNGdJSDA3WEc1Y2JpQWdkbUZ5SUdOaGJHeERZV3hzWW1GamF5QTlJR1oxYm1OMGFXOXVLR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHTmhiR3hpWVdOcktIUm9hWE1wTzF4dUlDQjlPMXh1WEc0Z0lIWmhjaUJoZEhSaFkyaGxaRU5oYkd4aVlXTnJJRDBnWm5WdVkzUnBiMjRvWld4bGJXVnVkRVJsYzJOeWFYQjBiM0lwSUh0Y2JpQWdJQ0JzWlhRZ1pXd2dQU0JuWlhSRmJHVnRaVzUwS0dWc1pXMWxiblJFWlhOamNtbHdkRzl5S1M1bGJHVnRaVzUwTzF4dUlDQWdJR3hsZENCbWNtRm5iV1Z1ZENBOUlIUm9hWE11Wm5KaFoyMWxiblE3WEc0Z0lDQWdiR1YwSUdOMWMzUnZiVVZzWlcxbGJuUWdQU0JqYjIxd2IyNWxiblJ6VzJWc1pXMWxiblJFWlhOamNtbHdkRzl5TG01dlpHVk9ZVzFsWFNCOGZDQmxiWEIwZVR0Y2JseHVJQ0FnSUdsbUlDaGpkWE4wYjIxRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlM1aGRIUmhZMmhsWkVOaGJHeGlZV05yS1NCN1hHNGdJQ0FnSUNCamRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVoZEhSaFkyaGxaRU5oYkd4aVlXTnJMbU5oYkd3b1pXd3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2hsYkM1dWIyUmxUbUZ0WlNBOVBUMGdKeU4wWlhoMEp5a2dlMXh1SUNBZ0lDQWdaV3d1ZEdWNGRFTnZiblJsYm5RZ1BTQmtaV052WkdWRmJuUnBkR2xsY3lobGJDNTBaWGgwUTI5dWRHVnVkQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dWc1pXMWxiblJFWlhOamNtbHdkRzl5TG1Ob2FXeGtUbTlrWlhNcElIdGNiaUFnSUNBZ0lHVnNaVzFsYm5SRVpYTmpjbWx3ZEc5eUxtTm9hV3hrVG05a1pYTXVabTl5UldGamFDaGhkSFJoWTJobFpFTmhiR3hpWVdOckxDQjdYRzRnSUNBZ0lDQWdJR1p5WVdkdFpXNTBPaUJtWVd4elpWeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR1p5WVdkdFpXNTBLU0I3WEc0Z0lDQWdJQ0JtY21GbmJXVnVkQzVoY0hCbGJtUkRhR2xzWkNobGJDazdYRzRnSUNBZ2ZWeHVJQ0I5TzF4dVhHNGdJSFpoY2lCMGFYUnNaVU5oYkd4aVlXTnJJRDBnWm5WdVkzUnBiMjRvWld4bGJXVnVkRVJsYzJOeWFYQjBiM0lwSUh0Y2JpQWdJQ0JzWlhRZ1pXd2dQU0JuWlhSRmJHVnRaVzUwS0dWc1pXMWxiblJFWlhOamNtbHdkRzl5S1M1bGJHVnRaVzUwTzF4dVhHNGdJQ0FnTHk4Z1JXNXpkWEpsSUhSb1pTQjBhWFJzWlNCcGN5QnpaWFFnWTI5eWNtVmpkR3g1TGx4dUlDQWdJR2xtSUNobGJDNTBZV2RPWVcxbElEMDlQU0FuZEdsMGJHVW5LU0I3WEc0Z0lDQWdJQ0JsYkM1dmQyNWxja1J2WTNWdFpXNTBMblJwZEd4bElEMGdaV3d1WTJocGJHUk9iMlJsYzFzd1hTNXViMlJsVm1Gc2RXVTdYRzRnSUNBZ2ZWeHVJQ0I5TzF4dVhHNGdJQzh2SUV4dmIzQWdkR2h5YjNWbmFDQmhiR3dnZEdobElIQmhkR05vWlhNZ1lXNWtJR0Z3Y0d4NUlIUm9aVzB1WEc0Z0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2djR0YwWTJobGN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJR3hsZENCd1lYUmphQ0E5SUhCaGRHTm9aWE5iYVYwN1hHNGdJQ0FnYkdWMElHNWxkMFJsYzJOeWFYQjBiM0lzSUc5c1pFUmxjMk55YVhCMGIzSXNJR1ZzWlcxbGJuUkVaWE5qY21sd2RHOXlPMXh1SUNBZ0lHeGxkQ0JsYkdWdFpXNTBJRDBnY0dGMFkyZ3VibVYzTzF4dVhHNGdJQ0FnYVdZZ0tIQmhkR05vTG1Wc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblJFWlhOamNtbHdkRzl5SUQwZ2NHRjBZMmd1Wld4bGJXVnVkRHRjYmx4dUlDQWdJQ0FnYkdWMElISmxjM1ZzZENBOUlHZGxkRVZzWlcxbGJuUW9jR0YwWTJndVpXeGxiV1Z1ZENrN1hHNGdJQ0FnSUNCd1lYUmphQzVsYkdWdFpXNTBJRDBnY21WemRXeDBMbVZzWlcxbGJuUTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSEJoZEdOb0xtOXNaQ2tnZTF4dUlDQWdJQ0FnYjJ4a1JHVnpZM0pwY0hSdmNpQTlJSEJoZEdOb0xtOXNaRHRjYmx4dUlDQWdJQ0FnYkdWMElISmxjM1ZzZENBOUlHZGxkRVZzWlcxbGJuUW9jR0YwWTJndWIyeGtLVHRjYmlBZ0lDQWdJSEJoZEdOb0xtOXNaQ0E5SUhKbGMzVnNkQzVsYkdWdFpXNTBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2h3WVhSamFDNXVaWGNwSUh0Y2JpQWdJQ0FnSUc1bGQwUmxjMk55YVhCMGIzSWdQU0J3WVhSamFDNXVaWGM3WEc1Y2JpQWdJQ0FnSUd4bGRDQnlaWE4xYkhRZ1BTQm5aWFJGYkdWdFpXNTBLSEJoZEdOb0xtNWxkeWs3WEc0Z0lDQWdJQ0J3WVhSamFDNXVaWGNnUFNCeVpYTjFiSFF1Wld4bGJXVnVkRHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvWld4bGJXVnVkQ0FtSmlCbGJHVnRaVzUwTG01dlpHVk9ZVzFsSUQwOVBTQW5JM1JsZUhRbktTQjdYRzRnSUNBZ0lDQndZWFJqYUM1dVpYY3VkR1Y0ZEVOdmJuUmxiblFnUFNCa1pXTnZaR1ZGYm5ScGRHbGxjeWhsYkdWdFpXNTBMbTV2WkdWV1lXeDFaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVW1Wd2JHRmpaU0IwYUdVZ1pXNTBhWEpsSUU1dlpHVXVYRzRnSUNBZ2FXWWdLSEJoZEdOb0xsOWZaRzlmWHlBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnY0dGMFkyZ3ViMnhrTG5CaGNtVnVkRTV2WkdVdWNtVndiR0ZqWlVOb2FXeGtLSEJoZEdOb0xtNWxkeXdnY0dGMFkyZ3ViMnhrS1R0Y2JseHVJQ0FnSUNBZ2JHVjBJRzlzWkVOMWMzUnZiVVZzWlcxbGJuUWdQU0JqYjIxd2IyNWxiblJ6VzI5c1pFUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1SUNBZ0lDQWdiR1YwSUc1bGQwTjFjM1J2YlVWc1pXMWxiblFnUFNCamIyMXdiMjVsYm5SelcyNWxkMFJsYzJOeWFYQjBiM0l1Ym05a1pVNWhiV1ZkSUh4OElHVnRjSFI1TzF4dVhHNGdJQ0FnSUNCcFppQW9iMnhrUTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVaR1YwWVdOb1pXUkRZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0J2YkdSRGRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVrWlhSaFkyaGxaRU5oYkd4aVlXTnJMbU5oYkd3b2NHRjBZMmd1YjJ4a0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0c1bGQwTjFjM1J2YlVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUNBZ2JtVjNRM1Z6ZEc5dFJXeGxiV1Z1ZEM1d2NtOTBiM1I1Y0dVdVlYUjBZV05vWldSRFlXeHNZbUZqYXk1allXeHNLSEJoZEdOb0xtNWxkeWs3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVG05a1pTQnRZVzVwY0M1Y2JpQWdJQ0JsYkhObElHbG1JQ2h3WVhSamFDNWZYMlJ2WDE4Z1BUMDlJREVwSUh0Y2JpQWdJQ0FnSUM4dklFRmtaQzVjYmlBZ0lDQWdJR2xtSUNod1lYUmphQzVsYkdWdFpXNTBJQ1ltSUhCaGRHTm9MbVp5WVdkdFpXNTBJQ1ltSUNGd1lYUmphQzV2YkdRcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUdaeVlXZHRaVzUwSUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUkc5amRXMWxiblJHY21GbmJXVnVkQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lIQmhkR05vTG1aeVlXZHRaVzUwTG1admNrVmhZMmdvWVhSMFlXTm9aV1JEWVd4c1ltRmpheXdnZXlCbWNtRm5iV1Z1ZENCOUtUdGNiaUFnSUNBZ0lDQWdjR0YwWTJndVpXeGxiV1Z1ZEM1aGNIQmxibVJEYUdsc1pDaG1jbUZuYldWdWRDazdYRzVjYmlBZ0lDQWdJQ0FnWm05eVJXRmphQzVqWVd4c0tIQmhkR05vTG1aeVlXZHRaVzUwTENCaGRIUmhZMmhsWkZSeVlXNXphWFJwYjI1QmJtUlVhWFJzWlNrN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRkpsYlc5MlpTNWNiaUFnSUNBZ0lHVnNjMlVnYVdZZ0tIQmhkR05vTG05c1pDQW1KaUFoY0dGMFkyZ3VibVYzS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2doY0dGMFkyZ3ViMnhrTG5CaGNtVnVkRTV2WkdVcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KME5oYmx4Y0ozUWdjbVZ0YjNabElIZHBkR2h2ZFhRZ2NHRnlaVzUwTENCcGN5QjBhR2x6SUhSb1pTQW5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDZGtiMk4xYldWdWRDQnliMjkwUHljcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1JXNXpkWEpsSUhSb1pTQjBhWFJzWlNCcGN5QmxiWEIwYVdWa0xseHVJQ0FnSUNBZ0lDQnBaaUFvY0dGMFkyZ3ViMnhrTG5SaFowNWhiV1VnUFQwOUlDZDBhWFJzWlNjcElIdGNiaUFnSUNBZ0lDQWdJQ0J3WVhSamFDNXZiR1F1YjNkdVpYSkViMk4xYldWdWRDNTBhWFJzWlNBOUlDY25PMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2JHVjBJR04xYzNSdmJVVnNaVzFsYm5RZ1BTQmpiMjF3YjI1bGJuUnpXMjlzWkVSbGMyTnlhWEIwYjNJdWJtOWtaVTVoYldWZElIeDhJR1Z0Y0hSNU8xeHVYRzRnSUNBZ0lDQWdJR2xtSUNoamRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVrWlhSaFkyaGxaRU5oYkd4aVlXTnJLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kzVnpkRzl0Uld4bGJXVnVkQzV3Y205MGIzUjVjR1V1WkdWMFlXTm9aV1JEWVd4c1ltRmpheTVqWVd4c0tIQmhkR05vTG05c1pDazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCd1lYUmphQzV2YkdRdWNHRnlaVzUwVG05a1pTNXlaVzF2ZG1WRGFHbHNaQ2h3WVhSamFDNXZiR1FwTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h6ZEdGMFpYTWdKaVlnYzNSaGRHVnpMbVJsZEdGamFHVmtJQ1ltSUhOMFlYUmxjeTVrWlhSaFkyaGxaQzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCaFpHUlFjbTl0YVhObGN5aHpkR0YwWlhNdVpHVjBZV05vWldRdWJXRndLR05oYkd4RFlXeHNZbUZqYXl3Z2NHRjBZMmd1YjJ4a0tTazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCdFlXdGxUbTlrWlM1dWIyUmxjMXR2YkdSRVpYTmpjbWx3ZEc5eUxtVnNaVzFsYm5SZElEMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCU1pYQnNZV05sTGx4dUlDQWdJQ0FnWld4elpTQnBaaUFvY0dGMFkyZ3ViMnhrSUNZbUlIQmhkR05vTG01bGR5a2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb0lYQmhkR05vTG05c1pDNXdZWEpsYm5ST2IyUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkRFlXNWNYQ2QwSUhKbGNHeGhZMlVnZDJsMGFHOTFkQ0J3WVhKbGJuUXNJR2x6SUhSb2FYTWdkR2hsSUNjZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSjJSdlkzVnRaVzUwSUhKdmIzUS9KeWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJCY0hCbGJtUWdkR2hsSUdWc1pXMWxiblFnWm1seWMzUXNJR0psWm05eVpTQmtiMmx1WnlCMGFHVWdjbVZ3YkdGalpXMWxiblF1WEc0Z0lDQWdJQ0FnSUhCaGRHTm9MbTlzWkM1d1lYSmxiblJPYjJSbExtbHVjMlZ5ZEVKbFptOXlaU2h3WVhSamFDNXVaWGNzSUhCaGRHTm9MbTlzWkM1dVpYaDBVMmxpYkdsdVp5azdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1VtVnRiM1psWkNCemRHRjBaU0JtYjNJZ2RISmhibk5wZEdsdmJuTWdRVkJKTGx4dUlDQWdJQ0FnSUNCcFppQW9jM1JoZEdWeklDWW1JSE4wWVhSbGN5NWtaWFJoWTJobFpDQW1KaUJ6ZEdGMFpYTXVaR1YwWVdOb1pXUXViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnWVdSa1VISnZiV2x6WlhNb2MzUmhkR1Z6TG1SbGRHRmphR1ZrTG0xaGNDaGpZV3hzUTJGc2JHSmhZMnNzSUhCaGRHTm9MbTlzWkNrcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1VtVndiR0ZqWldRZ2MzUmhkR1VnWm05eUlIUnlZVzV6YVhScGIyNXpJRUZRU1M1Y2JpQWdJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVjbVZ3YkdGalpXUWdKaVlnYzNSaGRHVnpMbkpsY0d4aFkyVmtMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUdGa1pGQnliMjFwYzJWektITjBZWFJsY3k1eVpYQnNZV05sWkM1dFlYQW9ZMkZzYkdKaFkyc2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHTmhiR3hpWVdOcktIQmhkR05vTG05c1pDd2djR0YwWTJndWJtVjNLVHRjYmlBZ0lDQWdJQ0FnSUNCOUtTazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QkZibk4xY21VZ2RHaGxJSFJwZEd4bElHbHpJSE5sZENCamIzSnlaV04wYkhrdVhHNGdJQ0FnSUNBZ0lHbG1JQ2h3WVhSamFDNXVaWGN1ZEdGblRtRnRaU0E5UFQwZ0ozUnBkR3hsSnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSEJoZEdOb0xtOXNaQzV2ZDI1bGNrUnZZM1Z0Wlc1MExuUnBkR3hsSUQwZ2NHRjBZMmd1Ym1WM0xtTm9hV3hrVG05a1pYTmJNRjB1Ym05a1pWWmhiSFZsTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdjR0YwWTJndWIyeGtMbkJoY21WdWRFNXZaR1V1Y21Wd2JHRmpaVU5vYVd4a0tIQmhkR05vTG01bGR5d2djR0YwWTJndWIyeGtLVHRjYmx4dUlDQWdJQ0FnSUNCc1pYUWdiMnhrUTNWemRHOXRSV3hsYldWdWRDQTlJR052YlhCdmJtVnVkSE5iYjJ4a1JHVnpZM0pwY0hSdmNpNXViMlJsVG1GdFpWMGdmSHdnWlcxd2RIazdYRzRnSUNBZ0lDQWdJR3hsZENCdVpYZERkWE4wYjIxRmJHVnRaVzUwSUQwZ1kyOXRjRzl1Wlc1MGMxdHVaWGRFWlhOamNtbHdkRzl5TG01dlpHVk9ZVzFsWFNCOGZDQmxiWEIwZVR0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvYjJ4a1EzVnpkRzl0Uld4bGJXVnVkQzV3Y205MGIzUjVjR1V1WkdWMFlXTm9aV1JEWVd4c1ltRmpheWtnZTF4dUlDQWdJQ0FnSUNBZ0lHOXNaRU4xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtUmxkR0ZqYUdWa1EyRnNiR0poWTJzdVkyRnNiQ2h3WVhSamFDNXZiR1FwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0c1bGQwTjFjM1J2YlVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnVaWGREZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWhkSFJoWTJobFpFTmhiR3hpWVdOckxtTmhiR3dvY0dGMFkyZ3VibVYzS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVGa1pHVmtJSE4wWVhSbElHWnZjaUIwY21GdWMybDBhVzl1Y3lCQlVFa3VYRzRnSUNBZ0lDQWdJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG1GMGRHRmphR1ZrSUNZbUlITjBZWFJsY3k1aGRIUmhZMmhsWkM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmhkSFJoWTJobFpGUnlZVzV6YVhScGIyNUJibVJVYVhSc1pTaHVaWGRFWlhOamNtbHdkRzl5S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzFoYTJWT2IyUmxMbTV2WkdWelcyOXNaRVJsYzJOeWFYQjBiM0l1Wld4bGJXVnVkRjBnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1FYUjBjbWxpZFhSbElHMWhibWx3ZFd4aGRHbHZiaTVjYmlBZ0lDQmxiSE5sSUdsbUlDaHdZWFJqYUM1ZlgyUnZYMThnUFQwOUlESXBJSHRjYmlBZ0lDQWdJR3hsZENCdmJHUldZV3gxWlNBOUlIQmhkR05vTG1Wc1pXMWxiblF1WjJWMFFYUjBjbWxpZFhSbEtIQmhkR05vTG01aGJXVXBPMXh1WEc0Z0lDQWdJQ0F2THlCRGFHRnVaMlZ6SUhSb1pTQmhkSFJ5YVdKMWRHVWdiMjRnZEdobElHVnNaVzFsYm5RdVhHNGdJQ0FnSUNCc1pYUWdZWFZuYldWdWRFRjBkSEpwWW5WMFpTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNBdkx5QlNaVzF2ZG1VdVhHNGdJQ0FnSUNBZ0lHbG1JQ2doY0dGMFkyZ3VkbUZzZFdVcElIc2djR0YwWTJndVpXeGxiV1Z1ZEM1eVpXMXZkbVZCZEhSeWFXSjFkR1VvY0dGMFkyZ3VibUZ0WlNrN0lIMWNiaUFnSUNBZ0lDQWdMeThnUTJoaGJtZGxMbHh1SUNBZ0lDQWdJQ0JsYkhObElIc2djR0YwWTJndVpXeGxiV1Z1ZEM1elpYUkJkSFJ5YVdKMWRHVW9jR0YwWTJndWJtRnRaU3dnY0dGMFkyZ3VkbUZzZFdVcE95QjlYRzRnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0F2THlCVWNtbG5aMlZ5SUdGc2JDQjBhR1VnWVhSMGNtbGlkWFJsSUdOb1lXNW5aV1FnZG1Gc2RXVnpMbHh1SUNBZ0lDQWdhV1lnS0hOMFlYUmxjeUFtSmlCemRHRjBaWE11WVhSMGNtbGlkWFJsUTJoaGJtZGxaQ0FtSmlCemRHRjBaWE11WVhSMGNtbGlkWFJsUTJoaGJtZGxaQzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnWVdSa1VISnZiV2x6WlhNb2MzUmhkR1Z6TG1GMGRISnBZblYwWlVOb1lXNW5aV1F1YldGd0tHTmhiR3hpWVdOcklEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdjSEp2YldselpTQTlJR05oYkd4aVlXTnJLSEJoZEdOb0xtVnNaVzFsYm5Rc0lIQmhkR05vTG01aGJXVXNJRzlzWkZaaGJIVmxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NHRjBZMmd1ZG1Gc2RXVXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSEJ5YjIxcGMyVXBJSHNnY0hKdmJXbHpaUzUwYUdWdUtHRjFaMjFsYm5SQmRIUnlhV0oxZEdVcE95QjlYRzRnSUNBZ0lDQWdJQ0FnWld4elpTQjdJR0YxWjIxbGJuUkJkSFJ5YVdKMWRHVW9LVHNnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIQnliMjFwYzJVN1hHNGdJQ0FnSUNBZ0lIMHBLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQmhkV2R0Wlc1MFFYUjBjbWxpZFhSbEtDazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUZSeWFXZG5aWElnWTNWemRHOXRJR1ZzWlcxbGJuUWdZWFIwY21saWRYUmxRMmhoYm1kbFpDQmxkbVZ1ZEhNdVhHNGdJQ0FnSUNCc1pYUWdZM1Z6ZEc5dFJXeGxiV1Z1ZENBOUlHTnZiWEJ2Ym1WdWRITmJaV3hsYldWdWRFUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1WEc0Z0lDQWdJQ0JwWmlBb1kzVnpkRzl0Uld4bGJXVnVkQzVoZEhSeWFXSjFkR1ZEYUdGdVoyVmtRMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJQ0FnWTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVZWFIwY21saWRYUmxRMmhoYm1kbFpFTmhiR3hpWVdOckxtTmhiR3dvY0dGMFkyZ3ViMnhrTEZ4dUlDQWdJQ0FnSUNBZ0lIQmhkR05vTG01aGJXVXNJRzlzWkZaaGJIVmxMQ0J3WVhSamFDNTJZV3gxWlNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1ZHVjRkQ0J1YjJSbElHMWhibWx3ZFd4aGRHbHZiaTVjYmlBZ0lDQmxiSE5sSUdsbUlDaHdZWFJqYUM1ZlgyUnZYMThnUFQwOUlETXBJSHRjYmlBZ0lDQWdJR3hsZENCdmNtbG5hVzVoYkZaaGJIVmxJRDBnY0dGMFkyZ3VaV3hsYldWdWRDNTBaWGgwUTI5dWRHVnVkRHRjYmx4dUlDQWdJQ0FnTHk4Z1EyaGhibWRsY3lCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ0FnSUd4bGRDQmhkV2R0Wlc1MFZHVjRkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ0lDQndZWFJqYUM1bGJHVnRaVzUwTG5SbGVIUkRiMjUwWlc1MElEMGdaR1ZqYjJSbFJXNTBhWFJwWlhNb2NHRjBZMmd1ZG1Gc2RXVXBPMXh1SUNBZ0lDQWdmVHRjYmx4dUlDQWdJQ0FnTHk4Z1ZISnBaMmRsY2lCaGJHd2dkR2hsSUhSbGVIUWdZMmhoYm1kbFpDQjJZV3gxWlhNdVhHNGdJQ0FnSUNCcFppQW9jM1JoZEdWeklDWW1JSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaQ0FtSmlCemRHRjBaWE11ZEdWNGRFTm9ZVzVuWldRdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lHRmtaRkJ5YjIxcGMyVnpLSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaQzV0WVhBb1kyRnNiR0poWTJzZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhaaGNpQndjbTl0YVhObElEMGdZMkZzYkdKaFkyc29jR0YwWTJndVpXeGxiV1Z1ZEM1d1lYSmxiblJPYjJSbElIeDhJSEJoZEdOb0xtVnNaVzFsYm5Rc1hHNGdJQ0FnSUNBZ0lDQWdJQ0J2Y21sbmFXNWhiRlpoYkhWbExDQndZWFJqYUM1MllXeDFaU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvY0hKdmJXbHpaU2tnZXlCd2NtOXRhWE5sTG5Sb1pXNG9ZWFZuYldWdWRGUmxlSFFwT3lCOVhHNGdJQ0FnSUNBZ0lDQWdaV3h6WlNCN0lHRjFaMjFsYm5SVVpYaDBLQ2s3SUgxY2JseHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQndjbTl0YVhObE8xeHVJQ0FnSUNBZ0lDQjlLU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjR0YwWTJndVpXeGxiV1Z1ZEM1MFpYaDBRMjl1ZEdWdWRDQTlJR1JsWTI5a1pVVnVkR2wwYVdWektIQmhkR05vTG5aaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0IyWVhJZ1lXTjBhWFpsVUhKdmJXbHpaWE1nUFNCd2NtOXRhWE5sY3k1bWFXeDBaWElvUW05dmJHVmhiaWs3WEc1Y2JpQWdMeThnVjJGcGRDQjFiblJwYkNCaGJHd2dkSEpoYm5OcGRHbHZiaUJ3Y205dGFYTmxjeUJvWVhabElISmxjMjlzZG1Wa0xseHVJQ0JwWmlBb1lXTjBhWFpsVUhKdmJXbHpaWE11YkdWdVozUm9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlGQnliMjFwYzJVdVlXeHNLSEJ5YjIxcGMyVnpMbVpwYkhSbGNpaENiMjlzWldGdUtTazdYRzRnSUgxY2JuMWNiaUpkZlE9PSIsIi8vIExpc3Qgb2YgU1ZHIGVsZW1lbnRzLlxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBlbGVtZW50cyA9IFsnYWx0R2x5cGgnLCAnYWx0R2x5cGhEZWYnLCAnYWx0R2x5cGhJdGVtJywgJ2FuaW1hdGUnLCAnYW5pbWF0ZUNvbG9yJywgJ2FuaW1hdGVNb3Rpb24nLCAnYW5pbWF0ZVRyYW5zZm9ybScsICdjaXJjbGUnLCAnY2xpcFBhdGgnLCAnY29sb3ItcHJvZmlsZScsICdjdXJzb3InLCAnZGVmcycsICdkZXNjJywgJ2VsbGlwc2UnLCAnZmVCbGVuZCcsICdmZUNvbG9yTWF0cml4JywgJ2ZlQ29tcG9uZW50VHJhbnNmZXInLCAnZmVDb21wb3NpdGUnLCAnZmVDb252b2x2ZU1hdHJpeCcsICdmZURpZmZ1c2VMaWdodGluZycsICdmZURpc3BsYWNlbWVudE1hcCcsICdmZURpc3RhbnRMaWdodCcsICdmZUZsb29kJywgJ2ZlRnVuY0EnLCAnZmVGdW5jQicsICdmZUZ1bmNHJywgJ2ZlRnVuY1InLCAnZmVHYXVzc2lhbkJsdXInLCAnZmVJbWFnZScsICdmZU1lcmdlJywgJ2ZlTWVyZ2VOb2RlJywgJ2ZlTW9ycGhvbG9neScsICdmZU9mZnNldCcsICdmZVBvaW50TGlnaHQnLCAnZmVTcGVjdWxhckxpZ2h0aW5nJywgJ2ZlU3BvdExpZ2h0JywgJ2ZlVGlsZScsICdmZVR1cmJ1bGVuY2UnLCAnZmlsdGVyJywgJ2ZvbnQnLCAnZm9udC1mYWNlJywgJ2ZvbnQtZmFjZS1mb3JtYXQnLCAnZm9udC1mYWNlLW5hbWUnLCAnZm9udC1mYWNlLXNyYycsICdmb250LWZhY2UtdXJpJywgJ2ZvcmVpZ25PYmplY3QnLCAnZycsICdnbHlwaCcsICdnbHlwaFJlZicsICdoa2VybicsICdpbWFnZScsICdsaW5lJywgJ2xpbmVhckdyYWRpZW50JywgJ21hcmtlcicsICdtYXNrJywgJ21ldGFkYXRhJywgJ21pc3NpbmctZ2x5cGgnLCAnbXBhdGgnLCAncGF0aCcsICdwYXR0ZXJuJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmFkaWFsR3JhZGllbnQnLCAncmVjdCcsICdzY3JpcHQnLCAnc2V0JywgJ3N0b3AnLCAnc3R5bGUnLCAnc3ZnJywgJ3N3aXRjaCcsICdzeW1ib2wnLCAndGV4dCcsICd0ZXh0UGF0aCcsICd0aXRsZScsICd0cmVmJywgJ3RzcGFuJywgJ3VzZScsICd2aWV3JywgJ3ZrZXJuJ107XG5cbmV4cG9ydHMuZWxlbWVudHMgPSBlbGVtZW50cztcbi8vIE5hbWVzcGFjZS5cbnZhciBuYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuZXhwb3J0cy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNOMlp5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN1FVRkRUeXhKUVVGSkxGRkJRVkVzUjBGQlJ5eERRVU53UWl4VlFVRlZMRVZCUTFZc1lVRkJZU3hGUVVOaUxHTkJRV01zUlVGRFpDeFRRVUZUTEVWQlExUXNZMEZCWXl4RlFVTmtMR1ZCUVdVc1JVRkRaaXhyUWtGQmEwSXNSVUZEYkVJc1VVRkJVU3hGUVVOU0xGVkJRVlVzUlVGRFZpeGxRVUZsTEVWQlEyWXNVVUZCVVN4RlFVTlNMRTFCUVUwc1JVRkRUaXhOUVVGTkxFVkJRMDRzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4bFFVRmxMRVZCUTJZc2NVSkJRWEZDTEVWQlEzSkNMR0ZCUVdFc1JVRkRZaXhyUWtGQmEwSXNSVUZEYkVJc2JVSkJRVzFDTEVWQlEyNUNMRzFDUVVGdFFpeEZRVU51UWl4blFrRkJaMElzUlVGRGFFSXNVMEZCVXl4RlFVTlVMRk5CUVZNc1JVRkRWQ3hUUVVGVExFVkJRMVFzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4blFrRkJaMElzUlVGRGFFSXNVMEZCVXl4RlFVTlVMRk5CUVZNc1JVRkRWQ3hoUVVGaExFVkJRMklzWTBGQll5eEZRVU5rTEZWQlFWVXNSVUZEVml4alFVRmpMRVZCUTJRc2IwSkJRVzlDTEVWQlEzQkNMR0ZCUVdFc1JVRkRZaXhSUVVGUkxFVkJRMUlzWTBGQll5eEZRVU5rTEZGQlFWRXNSVUZEVWl4TlFVRk5MRVZCUTA0c1YwRkJWeXhGUVVOWUxHdENRVUZyUWl4RlFVTnNRaXhuUWtGQlowSXNSVUZEYUVJc1pVRkJaU3hGUVVObUxHVkJRV1VzUlVGRFppeGxRVUZsTEVWQlEyWXNSMEZCUnl4RlFVTklMRTlCUVU4c1JVRkRVQ3hWUVVGVkxFVkJRMVlzVDBGQlR5eEZRVU5RTEU5QlFVOHNSVUZEVUN4TlFVRk5MRVZCUTA0c1owSkJRV2RDTEVWQlEyaENMRkZCUVZFc1JVRkRVaXhOUVVGTkxFVkJRMDRzVlVGQlZTeEZRVU5XTEdWQlFXVXNSVUZEWml4UFFVRlBMRVZCUTFBc1RVRkJUU3hGUVVOT0xGTkJRVk1zUlVGRFZDeFRRVUZUTEVWQlExUXNWVUZCVlN4RlFVTldMR2RDUVVGblFpeEZRVU5vUWl4TlFVRk5MRVZCUTA0c1VVRkJVU3hGUVVOU0xFdEJRVXNzUlVGRFRDeE5RVUZOTEVWQlEwNHNUMEZCVHl4RlFVTlFMRXRCUVVzc1JVRkRUQ3hSUVVGUkxFVkJRMUlzVVVGQlVTeEZRVU5TTEUxQlFVMHNSVUZEVGl4VlFVRlZMRVZCUTFZc1QwRkJUeXhGUVVOUUxFMUJRVTBzUlVGRFRpeFBRVUZQTEVWQlExQXNTMEZCU3l4RlFVTk1MRTFCUVUwc1JVRkRUaXhQUVVGUExFTkJRMUlzUTBGQlF6czdPenRCUVVkTExFbEJRVWtzVTBGQlV5eEhRVUZITERSQ1FVRTBRaXhEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzTjJaeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRXhwYzNRZ2IyWWdVMVpISUdWc1pXMWxiblJ6TGx4dVpYaHdiM0owSUd4bGRDQmxiR1Z0Wlc1MGN5QTlJRnRjYmlBZ0oyRnNkRWRzZVhCb0p5eGNiaUFnSjJGc2RFZHNlWEJvUkdWbUp5eGNiaUFnSjJGc2RFZHNlWEJvU1hSbGJTY3NYRzRnSUNkaGJtbHRZWFJsSnl4Y2JpQWdKMkZ1YVcxaGRHVkRiMnh2Y2ljc1hHNGdJQ2RoYm1sdFlYUmxUVzkwYVc5dUp5eGNiaUFnSjJGdWFXMWhkR1ZVY21GdWMyWnZjbTBuTEZ4dUlDQW5ZMmx5WTJ4bEp5eGNiaUFnSjJOc2FYQlFZWFJvSnl4Y2JpQWdKMk52Ykc5eUxYQnliMlpwYkdVbkxGeHVJQ0FuWTNWeWMyOXlKeXhjYmlBZ0oyUmxabk1uTEZ4dUlDQW5aR1Z6WXljc1hHNGdJQ2RsYkd4cGNITmxKeXhjYmlBZ0oyWmxRbXhsYm1RbkxGeHVJQ0FuWm1WRGIyeHZjazFoZEhKcGVDY3NYRzRnSUNkbVpVTnZiWEJ2Ym1WdWRGUnlZVzV6Wm1WeUp5eGNiaUFnSjJabFEyOXRjRzl6YVhSbEp5eGNiaUFnSjJabFEyOXVkbTlzZG1WTllYUnlhWGduTEZ4dUlDQW5abVZFYVdabWRYTmxUR2xuYUhScGJtY25MRnh1SUNBblptVkVhWE53YkdGalpXMWxiblJOWVhBbkxGeHVJQ0FuWm1WRWFYTjBZVzUwVEdsbmFIUW5MRnh1SUNBblptVkdiRzl2WkNjc1hHNGdJQ2RtWlVaMWJtTkJKeXhjYmlBZ0oyWmxSblZ1WTBJbkxGeHVJQ0FuWm1WR2RXNWpSeWNzWEc0Z0lDZG1aVVoxYm1OU0p5eGNiaUFnSjJabFIyRjFjM05wWVc1Q2JIVnlKeXhjYmlBZ0oyWmxTVzFoWjJVbkxGeHVJQ0FuWm1WTlpYSm5aU2NzWEc0Z0lDZG1aVTFsY21kbFRtOWtaU2NzWEc0Z0lDZG1aVTF2Y25Cb2IyeHZaM2tuTEZ4dUlDQW5abVZQWm1aelpYUW5MRnh1SUNBblptVlFiMmx1ZEV4cFoyaDBKeXhjYmlBZ0oyWmxVM0JsWTNWc1lYSk1hV2RvZEdsdVp5Y3NYRzRnSUNkbVpWTndiM1JNYVdkb2RDY3NYRzRnSUNkbVpWUnBiR1VuTEZ4dUlDQW5abVZVZFhKaWRXeGxibU5sSnl4Y2JpQWdKMlpwYkhSbGNpY3NYRzRnSUNkbWIyNTBKeXhjYmlBZ0oyWnZiblF0Wm1GalpTY3NYRzRnSUNkbWIyNTBMV1poWTJVdFptOXliV0YwSnl4Y2JpQWdKMlp2Ym5RdFptRmpaUzF1WVcxbEp5eGNiaUFnSjJadmJuUXRabUZqWlMxemNtTW5MRnh1SUNBblptOXVkQzFtWVdObExYVnlhU2NzWEc0Z0lDZG1iM0psYVdkdVQySnFaV04wSnl4Y2JpQWdKMmNuTEZ4dUlDQW5aMng1Y0dnbkxGeHVJQ0FuWjJ4NWNHaFNaV1luTEZ4dUlDQW5hR3RsY200bkxGeHVJQ0FuYVcxaFoyVW5MRnh1SUNBbmJHbHVaU2NzWEc0Z0lDZHNhVzVsWVhKSGNtRmthV1Z1ZENjc1hHNGdJQ2R0WVhKclpYSW5MRnh1SUNBbmJXRnpheWNzWEc0Z0lDZHRaWFJoWkdGMFlTY3NYRzRnSUNkdGFYTnphVzVuTFdkc2VYQm9KeXhjYmlBZ0oyMXdZWFJvSnl4Y2JpQWdKM0JoZEdnbkxGeHVJQ0FuY0dGMGRHVnliaWNzWEc0Z0lDZHdiMng1WjI5dUp5eGNiaUFnSjNCdmJIbHNhVzVsSnl4Y2JpQWdKM0poWkdsaGJFZHlZV1JwWlc1MEp5eGNiaUFnSjNKbFkzUW5MRnh1SUNBbmMyTnlhWEIwSnl4Y2JpQWdKM05sZENjc1hHNGdJQ2R6ZEc5d0p5eGNiaUFnSjNOMGVXeGxKeXhjYmlBZ0ozTjJaeWNzWEc0Z0lDZHpkMmwwWTJnbkxGeHVJQ0FuYzNsdFltOXNKeXhjYmlBZ0ozUmxlSFFuTEZ4dUlDQW5kR1Y0ZEZCaGRHZ25MRnh1SUNBbmRHbDBiR1VuTEZ4dUlDQW5kSEpsWmljc1hHNGdJQ2QwYzNCaGJpY3NYRzRnSUNkMWMyVW5MRnh1SUNBbmRtbGxkeWNzWEc0Z0lDZDJhMlZ5Ymljc1hHNWRPMXh1WEc0dkx5Qk9ZVzFsYzNCaFkyVXVYRzVsZUhCdmNuUWdiR1YwSUc1aGJXVnpjR0ZqWlNBOUlDZG9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5YzdYRzRpWFgwPSIsIi8qKlxuICogQ29udGFpbnMgYXJyYXlzIHRvIHN0b3JlIHRyYW5zaXRpb24gY2FsbGJhY2tzLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciB0cmFuc2l0aW9uU3RhdGVzID0ge307XG5cbmV4cG9ydHMudHJhbnNpdGlvblN0YXRlcyA9IHRyYW5zaXRpb25TdGF0ZXM7XG4vKipcbiAqIEZvciB3aGVuIGVsZW1lbnRzIGNvbWUgaW50byB0aGUgRE9NLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnMgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIHRoZSBlbGVtZW50IGVudGVycyB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCBhcyB0aGUgb25seVxuICogYXJndW1lbnQuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMuYXR0YWNoZWQgPSBbXTtcblxuLyoqXG4gKiBGb3Igd2hlbiBlbGVtZW50cyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIFRoZSBjYWxsYmFjayB0cmlnZ2VycyBqdXN0XG4gKiBiZWZvcmUgdGhlIGVsZW1lbnQgbGVhdmVzIHRoZSBET00uIEl0IGlzIGNhbGxlZCB3aXRoIHRoZSBlbGVtZW50IGFzIHRoZSBvbmx5XG4gKiBhcmd1bWVudC5cbiAqL1xudHJhbnNpdGlvblN0YXRlcy5kZXRhY2hlZCA9IFtdO1xuXG4vKlxuICogRm9yIHdoZW4gZWxlbWVudHMgYXJlIHJlcGxhY2VkIGluIHRoZSBET00uIFRoZSBjYWxsYmFjayB0cmlnZ2VycyBhZnRlciB0aGVcbiAqIG5ldyBlbGVtZW50IGVudGVycyB0aGUgRE9NLCBhbmQgYmVmb3JlIHRoZSBvbGQgZWxlbWVudCBsZWF2ZXMuIEl0IGlzIGNhbGxlZFxuICogd2l0aCBvbGQgYW5kIG5ldyBlbGVtZW50cyBhcyBhcmd1bWVudHMsIGluIHRoYXQgb3JkZXIuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMucmVwbGFjZWQgPSBbXTtcblxuLypcbiAqIFRyaWdnZXJlZCB3aGVuIGFuIGVsZW1lbnQncyBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQuIFRoZSBjYWxsYmFjayB0cmlnZ2Vyc1xuICogYWZ0ZXIgdGhlIGF0dHJpYnV0ZSBoYXMgY2hhbmdlZCBpbiB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCxcbiAqIHRoZSBhdHRyaWJ1dGUgbmFtZSwgb2xkIHZhbHVlLCBhbmQgY3VycmVudCB2YWx1ZS5cbiAqL1xudHJhbnNpdGlvblN0YXRlcy5hdHRyaWJ1dGVDaGFuZ2VkID0gW107XG5cbi8qXG4gKiBUcmlnZ2VyZWQgd2hlbiBhbiBlbGVtZW50J3MgYHRleHRDb250ZW50YCBjaG5hZ2VzLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnNcbiAqIGFmdGVyIHRoZSB0ZXh0Q29udGVudCBoYXMgY2hhbmdlZCBpbiB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCxcbiAqIHRoZSBvbGQgdmFsdWUsIGFuZCBjdXJyZW50IHZhbHVlLlxuICovXG50cmFuc2l0aW9uU3RhdGVzLnRleHRDaGFuZ2VkID0gW107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNSeVlXNXphWFJwYjI1ekxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN08wRkJSMDhzU1VGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhGUVVGRkxFTkJRVU03T3pzN096czdPMEZCVDJwRExHZENRVUZuUWl4RFFVRkRMRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU03T3pzN096czdRVUZQTDBJc1owSkJRV2RDTEVOQlFVTXNVVUZCVVN4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096dEJRVTh2UWl4blFrRkJaMElzUTBGQlF5eFJRVUZSTEVkQlFVY3NSVUZCUlN4RFFVRkRPenM3T3pzN08wRkJUeTlDTEdkQ1FVRm5RaXhEUVVGRExHZENRVUZuUWl4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096dEJRVTkyUXl4blFrRkJaMElzUTBGQlF5eFhRVUZYTEVkQlFVY3NSVUZCUlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1J5WVc1emFYUnBiMjV6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkRiMjUwWVdsdWN5QmhjbkpoZVhNZ2RHOGdjM1J2Y21VZ2RISmhibk5wZEdsdmJpQmpZV3hzWW1GamEzTXVYRzRnS2k5Y2JtVjRjRzl5ZENCc1pYUWdkSEpoYm5OcGRHbHZibE4wWVhSbGN5QTlJSHQ5TzF4dVhHNHZLaXBjYmlBcUlFWnZjaUIzYUdWdUlHVnNaVzFsYm5SeklHTnZiV1VnYVc1MGJ5QjBhR1VnUkU5TkxpQlVhR1VnWTJGc2JHSmhZMnNnZEhKcFoyZGxjbk1nYVcxdFpXUnBZWFJsYkhrZ1lXWjBaWEpjYmlBcUlIUm9aU0JsYkdWdFpXNTBJR1Z1ZEdWeWN5QjBhR1VnUkU5TkxpQkpkQ0JwY3lCallXeHNaV1FnZDJsMGFDQjBhR1VnWld4bGJXVnVkQ0JoY3lCMGFHVWdiMjVzZVZ4dUlDb2dZWEpuZFcxbGJuUXVYRzRnS2k5Y2JuUnlZVzV6YVhScGIyNVRkR0YwWlhNdVlYUjBZV05vWldRZ1BTQmJYVHRjYmx4dUx5b3FYRzRnS2lCR2IzSWdkMmhsYmlCbGJHVnRaVzUwY3lCaGNtVWdjbVZ0YjNabFpDQm1jbTl0SUhSb1pTQkVUMDB1SUZSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWN5QnFkWE4wWEc0Z0tpQmlaV1p2Y21VZ2RHaGxJR1ZzWlcxbGJuUWdiR1ZoZG1WeklIUm9aU0JFVDAwdUlFbDBJR2x6SUdOaGJHeGxaQ0IzYVhSb0lIUm9aU0JsYkdWdFpXNTBJR0Z6SUhSb1pTQnZibXg1WEc0Z0tpQmhjbWQxYldWdWRDNWNiaUFxTDF4dWRISmhibk5wZEdsdmJsTjBZWFJsY3k1a1pYUmhZMmhsWkNBOUlGdGRPMXh1WEc0dktseHVJQ29nUm05eUlIZG9aVzRnWld4bGJXVnVkSE1nWVhKbElISmxjR3hoWTJWa0lHbHVJSFJvWlNCRVQwMHVJRlJvWlNCallXeHNZbUZqYXlCMGNtbG5aMlZ5Y3lCaFpuUmxjaUIwYUdWY2JpQXFJRzVsZHlCbGJHVnRaVzUwSUdWdWRHVnljeUIwYUdVZ1JFOU5MQ0JoYm1RZ1ltVm1iM0psSUhSb1pTQnZiR1FnWld4bGJXVnVkQ0JzWldGMlpYTXVJRWwwSUdseklHTmhiR3hsWkZ4dUlDb2dkMmwwYUNCdmJHUWdZVzVrSUc1bGR5QmxiR1Z0Wlc1MGN5QmhjeUJoY21kMWJXVnVkSE1zSUdsdUlIUm9ZWFFnYjNKa1pYSXVYRzRnS2k5Y2JuUnlZVzV6YVhScGIyNVRkR0YwWlhNdWNtVndiR0ZqWldRZ1BTQmJYVHRjYmx4dUx5cGNiaUFxSUZSeWFXZG5aWEpsWkNCM2FHVnVJR0Z1SUdWc1pXMWxiblFuY3lCaGRIUnlhV0oxZEdVZ2FHRnpJR05vWVc1blpXUXVJRlJvWlNCallXeHNZbUZqYXlCMGNtbG5aMlZ5YzF4dUlDb2dZV1owWlhJZ2RHaGxJR0YwZEhKcFluVjBaU0JvWVhNZ1kyaGhibWRsWkNCcGJpQjBhR1VnUkU5TkxpQkpkQ0JwY3lCallXeHNaV1FnZDJsMGFDQjBhR1VnWld4bGJXVnVkQ3hjYmlBcUlIUm9aU0JoZEhSeWFXSjFkR1VnYm1GdFpTd2diMnhrSUhaaGJIVmxMQ0JoYm1RZ1kzVnljbVZ1ZENCMllXeDFaUzVjYmlBcUwxeHVkSEpoYm5OcGRHbHZibE4wWVhSbGN5NWhkSFJ5YVdKMWRHVkRhR0Z1WjJWa0lEMGdXMTA3WEc1Y2JpOHFYRzRnS2lCVWNtbG5aMlZ5WldRZ2QyaGxiaUJoYmlCbGJHVnRaVzUwSjNNZ1lIUmxlSFJEYjI1MFpXNTBZQ0JqYUc1aFoyVnpMaUJVYUdVZ1kyRnNiR0poWTJzZ2RISnBaMmRsY25OY2JpQXFJR0ZtZEdWeUlIUm9aU0IwWlhoMFEyOXVkR1Z1ZENCb1lYTWdZMmhoYm1kbFpDQnBiaUIwYUdVZ1JFOU5MaUJKZENCcGN5QmpZV3hzWldRZ2QybDBhQ0IwYUdVZ1pXeGxiV1Z1ZEN4Y2JpQXFJSFJvWlNCdmJHUWdkbUZzZFdVc0lHRnVaQ0JqZFhKeVpXNTBJSFpoYkhWbExseHVJQ292WEc1MGNtRnVjMmwwYVc5dVUzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0lEMGdXMTA3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuLyoqXG4gKiBEZWNvZGUncyBIVE1MIGVudGl0aWVzLlxuICpcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTMwOTEyNjZcbiAqIEBwYXJhbSBzdHJpbmdpbmdcbiAqIEByZXR1cm4gdW5lc2NhcGVkIGRlY29kZWQgSFRNTFxuICovXG5mdW5jdGlvbiBkZWNvZGVFbnRpdGllcyhzdHJpbmcpIHtcbiAgZWxlbWVudC5pbm5lckhUTUwgPSBzdHJpbmc7XG4gIHJldHVybiBlbGVtZW50LnRleHRDb250ZW50O1xufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBkZWNvZGVFbnRpdGllcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2WkdWamIyUmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJRVUVzU1VGQlNTeFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMR0ZCUVdFc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6czdPenM3T3pzN08wRkJVelZETEZOQlFWTXNZMEZCWXl4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVNNVFpeFRRVUZQTEVOQlFVTXNVMEZCVXl4SFFVRkhMRTFCUVUwc1EwRkJRenRCUVVNelFpeFRRVUZQTEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNN1EwRkROVUk3TzNGQ1FVVmpMR05CUVdNaUxDSm1hV3hsSWpvaUwyaHZiV1V2ZEdsdEwyZHBkQzlrYVdabWFIUnRiQzlzYVdJdmRYUnBiQzlrWldOdlpHVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKc1pYUWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyUnBkaWNwTzF4dVhHNHZLaXBjYmlBcUlFUmxZMjlrWlNkeklFaFVUVXdnWlc1MGFYUnBaWE11WEc0Z0tseHVJQ29nUUhObFpTQm9kSFJ3T2k4dmMzUmhZMnR2ZG1WeVpteHZkeTVqYjIwdllTOHhNekE1TVRJMk5seHVJQ29nUUhCaGNtRnRJSE4wY21sdVoybHVaMXh1SUNvZ1FISmxkSFZ5YmlCMWJtVnpZMkZ3WldRZ1pHVmpiMlJsWkNCSVZFMU1YRzRnS2k5Y2JtWjFibU4wYVc5dUlHUmxZMjlrWlVWdWRHbDBhV1Z6S0hOMGNtbHVaeWtnZTF4dUlDQmxiR1Z0Wlc1MExtbHVibVZ5U0ZSTlRDQTlJSE4wY21sdVp6dGNiaUFnY21WMGRYSnVJR1ZzWlcxbGJuUXVkR1Y0ZEVOdmJuUmxiblE3WEc1OVhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHUmxZMjlrWlVWdWRHbDBhV1Z6TzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5wcm90ZWN0RWxlbWVudCA9IHByb3RlY3RFbGVtZW50O1xuZXhwb3J0cy51bnByb3RlY3RFbGVtZW50ID0gdW5wcm90ZWN0RWxlbWVudDtcbmV4cG9ydHMuY2xlYW5NZW1vcnkgPSBjbGVhbk1lbW9yeTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF9ub2RlTWFrZSA9IHJlcXVpcmUoJy4uL25vZGUvbWFrZScpO1xuXG52YXIgX25vZGVNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVNYWtlKTtcblxudmFyIHBvb2xzID0gX3V0aWxQb29scy5wb29scztcbnZhciBtYWtlTm9kZSA9IF9ub2RlTWFrZTJbJ2RlZmF1bHQnXTtcblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYW4gZWxlbWVudCBpcyBub3QgcmVjeWNsZWQgZHVyaW5nIGEgcmVuZGVyIGN5Y2xlLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcmV0dXJuIGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBwcm90ZWN0RWxlbWVudChlbGVtZW50KSB7XG4gIHBvb2xzLmVsZW1lbnRPYmplY3QucHJvdGVjdChlbGVtZW50KTtcblxuICBlbGVtZW50LmNoaWxkTm9kZXMuZm9yRWFjaChwcm90ZWN0RWxlbWVudCk7XG4gIGVsZW1lbnQuYXR0cmlidXRlcy5mb3JFYWNoKHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5wcm90ZWN0LCBwb29scy5hdHRyaWJ1dGVPYmplY3QpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG4vKipcbiAqIEFsbG93cyBhbiBlbGVtZW50IHRvIGJlIHJlY3ljbGVkIGR1cmluZyBhIHJlbmRlciBjeWNsZS5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIHVucHJvdGVjdEVsZW1lbnQoZWxlbWVudCkge1xuICBlbGVtZW50LmNoaWxkTm9kZXMuZm9yRWFjaCh1bnByb3RlY3RFbGVtZW50KTtcbiAgZWxlbWVudC5hdHRyaWJ1dGVzLmZvckVhY2gocG9vbHMuYXR0cmlidXRlT2JqZWN0LnVucHJvdGVjdCwgcG9vbHMuYXR0cmlidXRlT2JqZWN0KTtcblxuICBwb29scy5lbGVtZW50T2JqZWN0LnVucHJvdGVjdChlbGVtZW50KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBSZWN5Y2xlcyBhbGwgdW5wcm90ZWN0ZWQgYWxsb2NhdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gY2xlYW5NZW1vcnkoKSB7XG4gIC8vIEZyZWUgYWxsIG1lbW9yeSBhZnRlciBlYWNoIGl0ZXJhdGlvbi5cbiAgcG9vbHMuYXR0cmlidXRlT2JqZWN0LmZyZWVBbGwoKTtcbiAgcG9vbHMuZWxlbWVudE9iamVjdC5mcmVlQWxsKCk7XG5cbiAgLy8gRW1wdHkgb3V0IHRoZSBgbWFrZS5ub2Rlc2AgaWYgb24gbWFpbiB0aHJlYWQuXG4gIGlmICh0eXBlb2YgbWFrZU5vZGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZm9yICh2YXIgdXVpZCBpbiBtYWtlTm9kZS5ub2Rlcykge1xuICAgICAgLy8gSWYgdGhpcyBpcyBub3QgYSBwcm90ZWN0ZWQgdXVpZCwgcmVtb3ZlIGl0LlxuICAgICAgaWYgKCFwb29scy5lbGVtZW50T2JqZWN0Ll91dWlkW3V1aWRdKSB7XG4gICAgICAgIGRlbGV0ZSBtYWtlTm9kZS5ub2Rlc1t1dWlkXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmJXVnRiM0o1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN08zbENRVUZuUXl4bFFVRmxPenQzUWtGRGVrSXNZMEZCWXpzN096dEJRVVZ3UXl4SlFVRkpMRXRCUVVzc2JVSkJRVk1zUTBGQlF6dEJRVU51UWl4SlFVRkpMRkZCUVZFc2QwSkJRVmtzUTBGQlF6czdPenM3T3pzN08wRkJVV3hDTEZOQlFWTXNZMEZCWXl4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVOMFF5eFBRVUZMTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGY2tNc1UwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRNME1zVTBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eFBRVUZQTEVWQlEzUkVMRXRCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6czdRVUZGZWtJc1UwRkJUeXhQUVVGUExFTkJRVU03UTBGRGFFSTdPenM3T3pzN096dEJRVkZOTEZOQlFWTXNaMEpCUVdkQ0xFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEzaERMRk5CUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVDBGQlR5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03UVVGRE4wTXNVMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4VFFVRlRMRVZCUTNoRUxFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXpzN1FVRkZla0lzVDBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJYWkRMRk5CUVU4c1QwRkJUeXhEUVVGRE8wTkJRMmhDT3pzN096czdRVUZMVFN4VFFVRlRMRmRCUVZjc1IwRkJSenM3UVVGRk5VSXNUMEZCU3l4RFFVRkRMR1ZCUVdVc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEJRVU5vUXl4UFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFOUJRVThzUlVGQlJTeERRVUZET3pzN1FVRkhPVUlzVFVGQlNTeFBRVUZQTEZGQlFWRXNTMEZCU3l4WFFVRlhMRVZCUVVVN1FVRkRia01zVTBGQlN5eEpRVUZKTEVsQlFVa3NTVUZCU1N4UlFVRlJMRU5CUVVNc1MwRkJTeXhGUVVGRk96dEJRVVV2UWl4VlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVN1FVRkRjRU1zWlVGQlR5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wOUJRemRDTzB0QlEwWTdSMEZEUmp0RFFVTkdJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmJXVnRiM0o1TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIc2djRzl2YkhNZ1lYTWdYM0J2YjJ4eklIMGdabkp2YlNBbkxpNHZkWFJwYkM5d2IyOXNjeWM3WEc1cGJYQnZjblFnWDIxaGEyVk9iMlJsSUdaeWIyMGdKeTR1TDI1dlpHVXZiV0ZyWlNjN1hHNWNiblpoY2lCd2IyOXNjeUE5SUY5d2IyOXNjenRjYm5aaGNpQnRZV3RsVG05a1pTQTlJRjl0WVd0bFRtOWtaVHRjYmx4dUx5b3FYRzRnS2lCRmJuTjFjbVZ6SUhSb1lYUWdZVzRnWld4bGJXVnVkQ0JwY3lCdWIzUWdjbVZqZVdOc1pXUWdaSFZ5YVc1bklHRWdjbVZ1WkdWeUlHTjVZMnhsTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0JsYkdWdFpXNTBYRzRnS2lCQWNtVjBkWEp1SUdWc1pXMWxiblJjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlIQnliM1JsWTNSRmJHVnRaVzUwS0dWc1pXMWxiblFwSUh0Y2JpQWdjRzl2YkhNdVpXeGxiV1Z1ZEU5aWFtVmpkQzV3Y205MFpXTjBLR1ZzWlcxbGJuUXBPMXh1WEc0Z0lHVnNaVzFsYm5RdVkyaHBiR1JPYjJSbGN5NW1iM0pGWVdOb0tIQnliM1JsWTNSRmJHVnRaVzUwS1R0Y2JpQWdaV3hsYldWdWRDNWhkSFJ5YVdKMWRHVnpMbVp2Y2tWaFkyZ29jRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wTG5CeWIzUmxZM1FzWEc0Z0lDQWdjRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wS1R0Y2JseHVJQ0J5WlhSMWNtNGdaV3hsYldWdWREdGNibjFjYmx4dUx5b3FYRzRnS2lCQmJHeHZkM01nWVc0Z1pXeGxiV1Z1ZENCMGJ5QmlaU0J5WldONVkyeGxaQ0JrZFhKcGJtY2dZU0J5Wlc1a1pYSWdZM2xqYkdVdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblJjYmlBcUlFQnlaWFIxY201Y2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUW9aV3hsYldWdWRDa2dlMXh1SUNCbGJHVnRaVzUwTG1Ob2FXeGtUbTlrWlhNdVptOXlSV0ZqYUNoMWJuQnliM1JsWTNSRmJHVnRaVzUwS1R0Y2JpQWdaV3hsYldWdWRDNWhkSFJ5YVdKMWRHVnpMbVp2Y2tWaFkyZ29jRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wTG5WdWNISnZkR1ZqZEN4Y2JpQWdJQ0J3YjI5c2N5NWhkSFJ5YVdKMWRHVlBZbXBsWTNRcE8xeHVYRzRnSUhCdmIyeHpMbVZzWlcxbGJuUlBZbXBsWTNRdWRXNXdjbTkwWldOMEtHVnNaVzFsYm5RcE8xeHVYRzRnSUhKbGRIVnliaUJsYkdWdFpXNTBPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlGSmxZM2xqYkdWeklHRnNiQ0IxYm5CeWIzUmxZM1JsWkNCaGJHeHZZMkYwYVc5dWN5NWNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdOc1pXRnVUV1Z0YjNKNUtDa2dlMXh1SUNBdkx5QkdjbVZsSUdGc2JDQnRaVzF2Y25rZ1lXWjBaWElnWldGamFDQnBkR1Z5WVhScGIyNHVYRzRnSUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDNW1jbVZsUVd4c0tDazdYRzRnSUhCdmIyeHpMbVZzWlcxbGJuUlBZbXBsWTNRdVpuSmxaVUZzYkNncE8xeHVYRzRnSUM4dklFVnRjSFI1SUc5MWRDQjBhR1VnWUcxaGEyVXVibTlrWlhOZ0lHbG1JRzl1SUcxaGFXNGdkR2h5WldGa0xseHVJQ0JwWmlBb2RIbHdaVzltSUcxaGEyVk9iMlJsSUNFOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJR1p2Y2lBb2JHVjBJSFYxYVdRZ2FXNGdiV0ZyWlU1dlpHVXVibTlrWlhNcElIdGNiaUFnSUNBZ0lDOHZJRWxtSUhSb2FYTWdhWE1nYm05MElHRWdjSEp2ZEdWamRHVmtJSFYxYVdRc0lISmxiVzkyWlNCcGRDNWNiaUFnSUNBZ0lHbG1JQ2doY0c5dmJITXVaV3hsYldWdWRFOWlhbVZqZEM1ZmRYVnBaRnQxZFdsa1hTa2dlMXh1SUNBZ0lDQWdJQ0JrWld4bGRHVWdiV0ZyWlU1dlpHVXVibTlrWlhOYmRYVnBaRjA3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNTlYRzRpWFgwPSIsIi8vIENvZGUgYmFzZWQgb2ZmIG9mOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FzaGkwMDkvbm9kZS1mYXN0LWh0bWwtcGFyc2VyXG5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnBhcnNlSFRNTCA9IHBhcnNlSFRNTDtcbmV4cG9ydHMubWFrZVBhcnNlciA9IG1ha2VQYXJzZXI7XG5cbnZhciBfcG9vbHMyID0gcmVxdWlyZSgnLi9wb29scycpO1xuXG52YXIgcG9vbHMgPSBfcG9vbHMyLnBvb2xzO1xudmFyIHBhcnNlciA9IG1ha2VQYXJzZXIoKTtcblxuLyoqXG4gKiBwYXJzZUhUTUxcbiAqXG4gKiBAcGFyYW0gbmV3SFRNTFxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSFRNTChuZXdIVE1MLCBpc0lubmVyKSB7XG4gIHZhciBkb2N1bWVudEVsZW1lbnQgPSBwYXJzZXIucGFyc2UobmV3SFRNTCk7XG4gIHZhciBub2RlcyA9IGRvY3VtZW50RWxlbWVudC5jaGlsZE5vZGVzO1xuXG4gIHJldHVybiBpc0lubmVyID8gbm9kZXMgOiBub2Rlc1swXTtcbn1cblxuLyoqXG4gKiBtYWtlUGFyc2VyXG4gKlxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIG1ha2VQYXJzZXIoKSB7XG4gIHZhciBrTWFya3VwUGF0dGVybiA9IC88IS0tW15dKj8oPz0tLT4pLS0+fDwoXFwvPykoW2EtelxcLV1bYS16MC05XFwtXSopXFxzKihbXj5dKj8pKFxcLz8pPi9pZztcblxuICB2YXIga0F0dHJpYnV0ZVBhdHRlcm4gPSAvXFxiKGlkfGNsYXNzKVxccyooPVxccyooXCIoW15cIl0rKVwifCcoW14nXSspJ3woXFxTKykpKT8vaWc7XG5cbiAgdmFyIHJlQXR0clBhdHRlcm4gPSAvXFxiKFthLXpdW2EtejAtOVxcLV0qKVxccyooPVxccyooXCIoW15cIl0rKVwifCcoW14nXSspJ3woXFxTKykpKT8vaWc7XG5cbiAgdmFyIGtCbG9ja0VsZW1lbnRzID0ge1xuICAgIGRpdjogdHJ1ZSxcbiAgICBwOiB0cnVlLFxuICAgIGxpOiB0cnVlLFxuICAgIHRkOiB0cnVlLFxuICAgIHNlY3Rpb246IHRydWUsXG4gICAgYnI6IHRydWVcbiAgfTtcblxuICB2YXIga1NlbGZDbG9zaW5nRWxlbWVudHMgPSB7XG4gICAgbWV0YTogdHJ1ZSxcbiAgICBpbWc6IHRydWUsXG4gICAgbGluazogdHJ1ZSxcbiAgICBpbnB1dDogdHJ1ZSxcbiAgICBhcmVhOiB0cnVlLFxuICAgIGJyOiB0cnVlLFxuICAgIGhyOiB0cnVlXG4gIH07XG5cbiAgdmFyIGtFbGVtZW50c0Nsb3NlZEJ5T3BlbmluZyA9IHtcbiAgICBsaToge1xuICAgICAgbGk6IHRydWVcbiAgICB9LFxuXG4gICAgcDoge1xuICAgICAgcDogdHJ1ZSwgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHRkOiB7XG4gICAgICB0ZDogdHJ1ZSwgdGg6IHRydWVcbiAgICB9LFxuXG4gICAgdGg6IHtcbiAgICAgIHRkOiB0cnVlLCB0aDogdHJ1ZVxuICAgIH1cbiAgfTtcblxuICB2YXIga0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nID0ge1xuICAgIGxpOiB7XG4gICAgICB1bDogdHJ1ZSwgb2w6IHRydWVcbiAgICB9LFxuXG4gICAgYToge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIGI6IHtcbiAgICAgIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICBpOiB7XG4gICAgICBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgcDoge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHRkOiB7XG4gICAgICB0cjogdHJ1ZSwgdGFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgdGg6IHtcbiAgICAgIHRyOiB0cnVlLCB0YWJsZTogdHJ1ZVxuICAgIH1cbiAgfTtcblxuICB2YXIga0Jsb2NrVGV4dEVsZW1lbnRzID0ge1xuICAgIHNjcmlwdDogdHJ1ZSxcbiAgICBub3NjcmlwdDogdHJ1ZSxcbiAgICBzdHlsZTogdHJ1ZSxcbiAgICBwcmU6IHRydWVcbiAgfTtcblxuICAvKipcbiAgICogVGV4dE5vZGUgdG8gY29udGFpbiBhIHRleHQgZWxlbWVudCBpbiBET00gdHJlZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGZ1bmN0aW9uIFRleHROb2RlKHZhbHVlKSB7XG4gICAgdmFyIGluc3RhbmNlID0gcG9vbHMuZWxlbWVudE9iamVjdC5nZXQoKTtcblxuICAgIGluc3RhbmNlLm5vZGVOYW1lID0gJyN0ZXh0JztcbiAgICBpbnN0YW5jZS5ub2RlVmFsdWUgPSB2YWx1ZTtcbiAgICBpbnN0YW5jZS5ub2RlVHlwZSA9IDM7XG4gICAgaW5zdGFuY2UuY2hpbGROb2Rlcy5sZW5ndGggPSAwO1xuICAgIGluc3RhbmNlLmF0dHJpYnV0ZXMubGVuZ3RoID0gMDtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIVE1MRWxlbWVudCwgd2hpY2ggY29udGFpbnMgYSBzZXQgb2YgY2hpbGRyZW4uXG4gICAqXG4gICAqIE5vdGU6IHRoaXMgaXMgYSBtaW5pbWFsaXN0IGltcGxlbWVudGF0aW9uLCBubyBjb21wbGV0ZSB0cmVlIHN0cnVjdHVyZVxuICAgKiBwcm92aWRlZCAobm8gcGFyZW50Tm9kZSwgbmV4dFNpYmxpbmcsIHByZXZpb3VzU2libGluZyBldGMpLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgbm9kZU5hbWVcbiAgICogQHBhcmFtIHtPYmplY3R9IGtleUF0dHJzIGlkIGFuZCBjbGFzcyBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHJhd0F0dHJzIGF0dHJpYnV0ZXMgaW4gc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiBIVE1MRWxlbWVudChuYW1lLCBrZXlBdHRycywgcmF3QXR0cnMpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBwb29scy5lbGVtZW50T2JqZWN0LmdldCgpO1xuXG4gICAgaW5zdGFuY2Uubm9kZU5hbWUgPSBuYW1lO1xuICAgIGluc3RhbmNlLm5vZGVWYWx1ZSA9ICcnO1xuICAgIGluc3RhbmNlLm5vZGVUeXBlID0gMTtcbiAgICBpbnN0YW5jZS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gICAgaW5zdGFuY2UuYXR0cmlidXRlcy5sZW5ndGggPSAwO1xuXG4gICAgaWYgKHJhd0F0dHJzKSB7XG4gICAgICBmb3IgKHZhciBtYXRjaCA9IHVuZGVmaW5lZDsgbWF0Y2ggPSByZUF0dHJQYXR0ZXJuLmV4ZWMocmF3QXR0cnMpOykge1xuICAgICAgICB2YXIgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcblxuICAgICAgICBhdHRyLm5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IG1hdGNoWzZdIHx8IG1hdGNoWzVdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzFdO1xuXG4gICAgICAgIC8vIExvb2sgZm9yIGVtcHR5IGF0dHJpYnV0ZXMuXG4gICAgICAgIGlmIChtYXRjaFs2XSA9PT0gJ1wiXCInKSB7XG4gICAgICAgICAgYXR0ci52YWx1ZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5zdGFuY2UuYXR0cmlidXRlc1tpbnN0YW5jZS5hdHRyaWJ1dGVzLmxlbmd0aF0gPSBhdHRyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgSFRNTCBhbmQgcmV0dXJucyBhIHJvb3QgZWxlbWVudFxuICAgKi9cbiAgdmFyIGh0bWxQYXJzZXIgPSB7XG4gICAgLyoqXG4gICAgICogUGFyc2UgYSBjaHVjayBvZiBIVE1MIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgICAgICBodG1sXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgcm9vdCBlbGVtZW50XG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByb290T2JqZWN0ID0ge307XG4gICAgICB2YXIgcm9vdCA9IEhUTUxFbGVtZW50KG51bGwsIHJvb3RPYmplY3QpO1xuICAgICAgdmFyIGN1cnJlbnRQYXJlbnQgPSByb290O1xuICAgICAgdmFyIHN0YWNrID0gW3Jvb3RdO1xuICAgICAgdmFyIGxhc3RUZXh0UG9zID0gLTE7XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAoZGF0YS5pbmRleE9mKCc8JykgPT09IC0xICYmIGRhdGEpIHtcbiAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzW2N1cnJlbnRQYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGhdID0gVGV4dE5vZGUoZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIG1hdGNoID0gdW5kZWZpbmVkLCB0ZXh0ID0gdW5kZWZpbmVkOyBtYXRjaCA9IGtNYXJrdXBQYXR0ZXJuLmV4ZWMoZGF0YSk7KSB7XG4gICAgICAgIGlmIChsYXN0VGV4dFBvcyA+IC0xKSB7XG4gICAgICAgICAgaWYgKGxhc3RUZXh0UG9zICsgbWF0Y2hbMF0ubGVuZ3RoIDwga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAvLyBpZiBoYXMgY29udGVudFxuICAgICAgICAgICAgdGV4dCA9IGRhdGEuc2xpY2UobGFzdFRleHRQb3MsIGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCAtIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGlmICh0ZXh0LnRyaW0oKSkge1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkTm9kZXNbY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aF0gPSBUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0VGV4dFBvcyA9IGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleDtcblxuICAgICAgICAvLyBUaGlzIGlzIGEgY29tbWVudC5cbiAgICAgICAgaWYgKG1hdGNoWzBdWzFdID09PSAnIScpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmxvd2VyQ2FzZVRhZ05hbWUpIHtcbiAgICAgICAgICBtYXRjaFsyXSA9IG1hdGNoWzJdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1hdGNoWzFdKSB7XG4gICAgICAgICAgLy8gbm90IDwvIHRhZ3NcbiAgICAgICAgICB2YXIgYXR0cnMgPSB7fTtcblxuICAgICAgICAgIGZvciAodmFyIGF0dE1hdGNoID0gdW5kZWZpbmVkOyBhdHRNYXRjaCA9IGtBdHRyaWJ1dGVQYXR0ZXJuLmV4ZWMobWF0Y2hbM10pOykge1xuICAgICAgICAgICAgYXR0cnNbYXR0TWF0Y2hbMV1dID0gYXR0TWF0Y2hbM10gfHwgYXR0TWF0Y2hbNF0gfHwgYXR0TWF0Y2hbNV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFtYXRjaFs0XSAmJiBrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeU9wZW5pbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV1bbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMucHVzaChIVE1MRWxlbWVudChtYXRjaFsyXSwgYXR0cnMsIG1hdGNoWzNdKSkgLSAxXTtcblxuICAgICAgICAgIHN0YWNrLnB1c2goY3VycmVudFBhcmVudCk7XG5cbiAgICAgICAgICBpZiAoa0Jsb2NrVGV4dEVsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgLy8gYSBsaXR0bGUgdGVzdCB0byBmaW5kIG5leHQgPC9zY3JpcHQ+IG9yIDwvc3R5bGU+IC4uLlxuICAgICAgICAgICAgdmFyIGNsb3NlTWFya3VwID0gJzwvJyArIG1hdGNoWzJdICsgJz4nO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gZGF0YS5pbmRleE9mKGNsb3NlTWFya3VwLCBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9uc1ttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlcmUgaXMgbm8gbWF0Y2hpbmcgZW5kaW5nIGZvciB0aGUgdGV4dCBlbGVtZW50LlxuICAgICAgICAgICAgICAgIHRleHQgPSBkYXRhLnNsaWNlKGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGRhdGEuc2xpY2Uoa01hcmt1cFBhdHRlcm4ubGFzdEluZGV4LCBpbmRleCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzW2N1cnJlbnRQYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGhdID0gVGV4dE5vZGUodGV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICBsYXN0VGV4dFBvcyA9IGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCA9IGRhdGEubGVuZ3RoICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQubm9kZVZhbHVlID0gZGF0YS5zbGljZShrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgsIGluZGV4KTtcbiAgICAgICAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXggPSBpbmRleCArIGNsb3NlTWFya3VwLmxlbmd0aDtcbiAgICAgICAgICAgICAgbWF0Y2hbMV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbMV0gfHwgbWF0Y2hbNF0gfHwga1NlbGZDbG9zaW5nRWxlbWVudHNbbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgLy8gPC8gb3IgLz4gb3IgPGJyPiBldGMuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFyZW50Lm5vZGVOYW1lID09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBUcnlpbmcgdG8gY2xvc2UgY3VycmVudCB0YWcsIGFuZCBtb3ZlIG9uXG4gICAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeUNsb3NpbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFVzZSBhZ2dyZXNzaXZlIHN0cmF0ZWd5IHRvIGhhbmRsZSB1bm1hdGNoaW5nIG1hcmt1cHMuXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGh0bWxQYXJzZXI7XG59XG5cbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmNHRnljMlZ5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN08zTkNRVWRuUXl4VFFVRlRPenRCUVVWNlF5eEpRVUZKTEV0QlFVc3NaMEpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEUxQlFVMHNSMEZCUnl4VlFVRlZMRVZCUVVVc1EwRkJRenM3T3pzN096czdPMEZCVVc1Q0xGTkJRVk1zVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRNVU1zVFVGQlNTeGxRVUZsTEVkQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU0xUXl4TlFVRkpMRXRCUVVzc1IwRkJSeXhsUVVGbExFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVjJReXhUUVVGUExFOUJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wTkJRMjVET3pzN096czdPenRCUVU5TkxGTkJRVk1zVlVGQlZTeEhRVUZITzBGQlF6TkNMRTFCUVVrc1kwRkJZeXhIUVVOb1FpeHRSVUZCYlVVc1EwRkJRenM3UVVGRmRFVXNUVUZCU1N4cFFrRkJhVUlzUjBGQlJ5eHhSRUZCY1VRc1EwRkJRenM3UVVGRk9VVXNUVUZCU1N4aFFVRmhMRWRCUTJZc05rUkJRVFpFTEVOQlFVTTdPMEZCUldoRkxFMUJRVWtzWTBGQll5eEhRVUZITzBGQlEyNUNMRTlCUVVjc1JVRkJSU3hKUVVGSk8wRkJRMVFzUzBGQlF5eEZRVUZGTEVsQlFVazdRVUZEVUN4TlFVRkZMRVZCUVVVc1NVRkJTVHRCUVVOU0xFMUJRVVVzUlVGQlJTeEpRVUZKTzBGQlExSXNWMEZCVHl4RlFVRkZMRWxCUVVrN1FVRkRZaXhOUVVGRkxFVkJRVVVzU1VGQlNUdEhRVU5VTEVOQlFVTTdPMEZCUlVZc1RVRkJTU3h2UWtGQmIwSXNSMEZCUnp0QlFVTjZRaXhSUVVGSkxFVkJRVVVzU1VGQlNUdEJRVU5XTEU5QlFVY3NSVUZCUlN4SlFVRkpPMEZCUTFRc1VVRkJTU3hGUVVGRkxFbEJRVWs3UVVGRFZpeFRRVUZMTEVWQlFVVXNTVUZCU1R0QlFVTllMRkZCUVVrc1JVRkJSU3hKUVVGSk8wRkJRMVlzVFVGQlJTeEZRVUZGTEVsQlFVazdRVUZEVWl4TlFVRkZMRVZCUVVVc1NVRkJTVHRIUVVOVUxFTkJRVU03TzBGQlJVWXNUVUZCU1N4M1FrRkJkMElzUjBGQlJ6dEJRVU0zUWl4TlFVRkZMRVZCUVVVN1FVRkRSaXhSUVVGRkxFVkJRVVVzU1VGQlNUdExRVU5VT3p0QlFVVkVMRXRCUVVNc1JVRkJSVHRCUVVORUxFOUJRVU1zUlVGQlJTeEpRVUZKTEVWQlFVVXNSMEZCUnl4RlFVRkZMRWxCUVVrN1MwRkRia0k3TzBGQlJVUXNUVUZCUlN4RlFVRkZPMEZCUTBZc1VVRkJSU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEZRVUZGTEVWQlFVVXNTVUZCU1R0TFFVTnVRanM3UVVGRlJDeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTU3hGUVVGRkxFVkJRVVVzUlVGQlJTeEpRVUZKTzB0QlEyNUNPMGRCUTBZc1EwRkJRenM3UVVGRlJpeE5RVUZKTEhkQ1FVRjNRaXhIUVVGSE8wRkJRemRDTEUxQlFVVXNSVUZCUlR0QlFVTkdMRkZCUVVVc1JVRkJSU3hKUVVGSkxFVkJRVVVzUlVGQlJTeEZRVUZGTEVsQlFVazdTMEZEYmtJN08wRkJSVVFzUzBGQlF5eEZRVUZGTzBGQlEwUXNVMEZCUnl4RlFVRkZMRWxCUVVrN1MwRkRWanM3UVVGRlJDeExRVUZETEVWQlFVVTdRVUZEUkN4VFFVRkhMRVZCUVVVc1NVRkJTVHRMUVVOV096dEJRVVZFTEV0QlFVTXNSVUZCUlR0QlFVTkVMRk5CUVVjc1JVRkJSU3hKUVVGSk8wdEJRMVk3TzBGQlJVUXNTMEZCUXl4RlFVRkZPMEZCUTBRc1UwRkJSeXhGUVVGRkxFbEJRVWs3UzBGRFZqczdRVUZGUkN4TlFVRkZMRVZCUVVVN1FVRkRSaXhSUVVGRkxFVkJRVVVzU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlN4SlFVRkpPMHRCUTNSQ096dEJRVVZFTEUxQlFVVXNSVUZCUlR0QlFVTkdMRkZCUVVVc1JVRkJSU3hKUVVGSkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVsQlFVazdTMEZEZEVJN1IwRkRSaXhEUVVGRE96dEJRVVZHTEUxQlFVa3NhMEpCUVd0Q0xFZEJRVWM3UVVGRGRrSXNWVUZCVFN4RlFVRkZMRWxCUVVrN1FVRkRXaXhaUVVGUkxFVkJRVVVzU1VGQlNUdEJRVU5rTEZOQlFVc3NSVUZCUlN4SlFVRkpPMEZCUTFnc1QwRkJSeXhGUVVGRkxFbEJRVWs3UjBGRFZpeERRVUZET3pzN096czdRVUZOUml4WFFVRlRMRkZCUVZFc1EwRkJReXhMUVVGTExFVkJRVVU3UVVGRGRrSXNVVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXpzN1FVRkZla01zV1VGQlVTeERRVUZETEZGQlFWRXNSMEZCUnl4UFFVRlBMRU5CUVVNN1FVRkROVUlzV1VGQlVTeERRVUZETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRNMElzV1VGQlVTeERRVUZETEZGQlFWRXNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRkRUlzV1VGQlVTeERRVUZETEZWQlFWVXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJReTlDTEZsQlFWRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6czdRVUZGTDBJc1YwRkJUeXhSUVVGUkxFTkJRVU03UjBGRGFrSTdPenM3T3pzN096czdPenRCUVZsRUxGZEJRVk1zVjBGQlZ5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1VVRkJVU3hGUVVGRk8wRkJRemRETEZGQlFVa3NVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUlhwRExGbEJRVkVzUTBGQlF5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNwQ0xGbEJRVkVzUTBGQlF5eFRRVUZUTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNoQ0xGbEJRVkVzUTBGQlF5eFJRVUZSTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTNSQ0xGbEJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVNdlFpeFpRVUZSTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJTOUNMRkZCUVVrc1VVRkJVU3hGUVVGRk8wRkJRMW9zVjBGQlN5eEpRVUZKTEV0QlFVc3NXVUZCUVN4RlFVRkZMRXRCUVVzc1IwRkJSeXhoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkpPMEZCUTNSRUxGbEJRVWtzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYWkRMRmxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNKQ0xGbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenM3UVVGSE1VUXNXVUZCU1N4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzU1VGQlNTeEZRVUZGTzBGQlFVVXNZMEZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhGUVVGRkxFTkJRVU03VTBGQlJUczdRVUZGTTBNc1owSkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdUMEZEZUVRN1MwRkRSanM3UVVGRlJDeFhRVUZQTEZGQlFWRXNRMEZCUXp0SFFVTnFRanM3T3pzN1FVRkxSQ3hOUVVGSkxGVkJRVlVzUjBGQlJ6czdPenM3TzBGQlRXWXNVMEZCU3l4RlFVRkZMR1ZCUVZNc1NVRkJTU3hGUVVGRkxFOUJRVThzUlVGQlJUdEJRVU0zUWl4VlFVRkpMRlZCUVZVc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGNFSXNWVUZCU1N4SlFVRkpMRWRCUVVjc1YwRkJWeXhEUVVGRExFbEJRVWtzUlVGQlJTeFZRVUZWTEVOQlFVTXNRMEZCUXp0QlFVTjZReXhWUVVGSkxHRkJRV0VzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEZWtJc1ZVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnVRaXhWUVVGSkxGZEJRVmNzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZja0lzWVVGQlR5eEhRVUZITEU5QlFVOHNTVUZCU1N4RlFVRkZMRU5CUVVNN08wRkJSWGhDTEZWQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNTVUZCU1N4SlFVRkpMRVZCUVVVN1FVRkRjRU1zY1VKQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1lVRkJZU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03TzBGQlJUTkZMR1ZCUVU4c1NVRkJTU3hEUVVGRE8wOUJRMkk3TzBGQlJVUXNWMEZCU3l4SlFVRkpMRXRCUVVzc1dVRkJRU3hGUVVGRkxFbEJRVWtzV1VGQlFTeEZRVUZGTEV0QlFVc3NSMEZCUnl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZKTzBGQlEzcEVMRmxCUVVrc1YwRkJWeXhIUVVGSExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlEzQkNMR05CUVVrc1YwRkJWeXhIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1kwRkJZeXhEUVVGRExGTkJRVk1zUlVGQlJUczdRVUZGTlVRc1owSkJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hqUVVGakxFTkJRVU1zVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6czdRVUZGTTBVc1owSkJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4RlFVRkZPMEZCUTJZc01rSkJRV0VzUTBGQlF5eFZRVUZWTEVOQlFVTXNZVUZCWVN4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1lVRkROVVU3VjBGRFJqdFRRVU5HT3p0QlFVVkVMRzFDUVVGWExFZEJRVWNzWTBGQll5eERRVUZETEZOQlFWTXNRMEZCUXpzN08wRkJSM1pETEZsQlFVa3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVkQlFVY3NSVUZCUlR0QlFVTjJRaXh0UWtGQlV6dFRRVU5XT3p0QlFVVkVMRmxCUVVrc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RlFVRkZPMEZCUXpWQ0xHVkJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdVMEZEYmtNN08wRkJSVVFzV1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSVHM3UVVGRllpeGpRVUZKTEV0QlFVc3NSMEZCUnl4RlFVRkZMRU5CUVVNN08wRkJSV1lzWlVGQlN5eEpRVUZKTEZGQlFWRXNXVUZCUVN4RlFVRkZMRkZCUVZFc1IwRkJSeXhwUWtGQmFVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVazdRVUZEYUVVc2FVSkJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WFFVTm9SVHM3UVVGRlJDeGpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxIZENRVUYzUWl4RFFVRkRMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlJUdEJRVU5xUlN4blFrRkJTU3gzUWtGQmQwSXNRMEZCUXl4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1FVRkRPVVFzYlVKQlFVc3NRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOYUxESkNRVUZoTEVkQlFVY3NTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdZVUZEZWtNN1YwRkRSanM3UVVGRlJDeDFRa0ZCWVN4SFFVRkhMR0ZCUVdFc1EwRkJReXhWUVVGVkxFTkJRVU1zWVVGQllTeERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUTJ4RkxGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1MwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJXcEVMR1ZCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTTdPMEZCUlRGQ0xHTkJRVWtzYTBKQlFXdENMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdPMEZCUldoRExHZENRVUZKTEZkQlFWY3NSMEZCUnl4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVkQlFVY3NRMEZCUXp0QlFVTjRReXhuUWtGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFVkJRVVVzWTBGQll5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPenRCUVVWb1JTeG5Ra0ZCU1N4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdRVUZEY2tJc2EwSkJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZPenRCUVVWbUxHOUNRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdaVUZETjBNc1RVRkRTVHRCUVVOSUxHOUNRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zVTBGQlV5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMlZCUTNCRU96dEJRVVZFTEd0Q1FVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEyNUNMRFpDUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMlZCUXpWRk8yRkJRMFk3UVVGRFJDeG5Ra0ZCU1N4TFFVRkxMRWxCUVVrc1EwRkJReXhEUVVGRExFVkJRVVU3UVVGRFppeDVRa0ZCVnl4SFFVRkhMR05CUVdNc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1lVRkRNVVFzVFVGRFNUdEJRVU5JTERKQ1FVRmhMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU4wUlN4NVFrRkJWeXhIUVVGSExHTkJRV01zUTBGQlF5eFRRVUZUTEVkQlFVY3NTMEZCU3l4SFFVRkhMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRGNFVXNiVUpCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdZVUZGYWtJN1YwRkRSanRUUVVOR08wRkJRMFFzV1VGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEc5Q1FVRnZRaXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZPenRCUVVVeFJDeHBRa0ZCVHl4aFFVRmhMRVZCUVVVN1FVRkRjRUlzWjBKQlFVa3NZVUZCWVN4RFFVRkRMRkZCUVZFc1NVRkJTU3hMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdRVUZEZEVNc2JVSkJRVXNzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTmFMREpDUVVGaExFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYaERMRzlDUVVGTk8yRkJRMUFzVFVGRFNUczdRVUZGU0N4clFrRkJTU3gzUWtGQmQwSXNRMEZCUXl4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVU3UVVGRGNFUXNiMEpCUVVrc2QwSkJRWGRDTEVOQlFVTXNZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUXpsRUxIVkNRVUZMTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNN1FVRkRXaXdyUWtGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVjRReXd5UWtGQlV6dHBRa0ZEVmp0bFFVTkdPenM3UVVGSFJDeHZRa0ZCVFR0aFFVTlFPMWRCUTBZN1UwRkRSanRQUVVOR096dEJRVVZFTEdGQlFVOHNTVUZCU1N4RFFVRkRPMHRCUTJJN1IwRkRSaXhEUVVGRE96dEJRVVZHTEZOQlFVOHNWVUZCVlN4RFFVRkRPME5CUTI1Q096dEJRVUZCTEVOQlFVTWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZkWFJwYkM5d1lYSnpaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZMeUJEYjJSbElHSmhjMlZrSUc5bVppQnZaanBjYmk4dklHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOWhjMmhwTURBNUwyNXZaR1V0Wm1GemRDMW9kRzFzTFhCaGNuTmxjbHh1WEc1cGJYQnZjblFnZXlCd2IyOXNjeUJoY3lCZmNHOXZiSE1nZlNCbWNtOXRJQ2N1TDNCdmIyeHpKenRjYmx4dWRtRnlJSEJ2YjJ4eklEMGdYM0J2YjJ4ek8xeHVkbUZ5SUhCaGNuTmxjaUE5SUcxaGEyVlFZWEp6WlhJb0tUdGNibHh1THlvcVhHNGdLaUJ3WVhKelpVaFVUVXhjYmlBcVhHNGdLaUJBY0dGeVlXMGdibVYzU0ZSTlRGeHVJQ29nUUhKbGRIVnlibHh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2NHRnljMlZJVkUxTUtHNWxkMGhVVFV3c0lHbHpTVzV1WlhJcElIdGNiaUFnYkdWMElHUnZZM1Z0Wlc1MFJXeGxiV1Z1ZENBOUlIQmhjbk5sY2k1d1lYSnpaU2h1WlhkSVZFMU1LVHRjYmlBZ2JHVjBJRzV2WkdWeklEMGdaRzlqZFcxbGJuUkZiR1Z0Wlc1MExtTm9hV3hrVG05a1pYTTdYRzVjYmlBZ2NtVjBkWEp1SUdselNXNXVaWElnUHlCdWIyUmxjeUE2SUc1dlpHVnpXekJkTzF4dWZWeHVYRzR2S2lwY2JpQXFJRzFoYTJWUVlYSnpaWEpjYmlBcVhHNGdLaUJBY21WMGRYSnVYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCdFlXdGxVR0Z5YzJWeUtDa2dlMXh1SUNCc1pYUWdhMDFoY210MWNGQmhkSFJsY200Z1BWeHVJQ0FnSUM4OElTMHRXMTVkS2o4b1B6MHRMVDRwTFMwK2ZEd29YRnd2UHlrb1cyRXRlbHhjTFYxYllTMTZNQzA1WEZ3dFhTb3BYRnh6S2loYlhqNWRLajhwS0Z4Y0x6OHBQaTlwWnp0Y2JseHVJQ0JzWlhRZ2EwRjBkSEpwWW5WMFpWQmhkSFJsY200Z1BTQXZYRnhpS0dsa2ZHTnNZWE56S1Z4Y2N5b29QVnhjY3lvb1hDSW9XMTVjSWwwcktWd2lmQ2NvVzE0blhTc3BKM3dvWEZ4VEt5a3BLVDh2YVdjN1hHNWNiaUFnYkdWMElISmxRWFIwY2xCaGRIUmxjbTRnUFZ4dUlDQWdJQzljWEdJb1cyRXRlbDFiWVMxNk1DMDVYRnd0WFNvcFhGeHpLaWc5WEZ4ektpaGNJaWhiWGx3aVhTc3BYQ0o4SnloYlhpZGRLeWtuZkNoY1hGTXJLU2twUHk5cFp6dGNibHh1SUNCc1pYUWdhMEpzYjJOclJXeGxiV1Z1ZEhNZ1BTQjdYRzRnSUNBZ1pHbDJPaUIwY25WbExGeHVJQ0FnSUhBNklIUnlkV1VzWEc0Z0lDQWdiR2s2SUhSeWRXVXNYRzRnSUNBZ2RHUTZJSFJ5ZFdVc1hHNGdJQ0FnYzJWamRHbHZiam9nZEhKMVpTeGNiaUFnSUNCaWNqb2dkSEoxWlZ4dUlDQjlPMXh1WEc0Z0lHeGxkQ0JyVTJWc1prTnNiM05wYm1kRmJHVnRaVzUwY3lBOUlIdGNiaUFnSUNCdFpYUmhPaUIwY25WbExGeHVJQ0FnSUdsdFp6b2dkSEoxWlN4Y2JpQWdJQ0JzYVc1ck9pQjBjblZsTEZ4dUlDQWdJR2x1Y0hWME9pQjBjblZsTEZ4dUlDQWdJR0Z5WldFNklIUnlkV1VzWEc0Z0lDQWdZbkk2SUhSeWRXVXNYRzRnSUNBZ2FISTZJSFJ5ZFdWY2JpQWdmVHRjYmx4dUlDQnNaWFFnYTBWc1pXMWxiblJ6UTJ4dmMyVmtRbmxQY0dWdWFXNW5JRDBnZTF4dUlDQWdJR3hwT2lCN1hHNGdJQ0FnSUNCc2FUb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0J3T2lCN1hHNGdJQ0FnSUNCd09pQjBjblZsTENCa2FYWTZJSFJ5ZFdWY2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnZEdRNklIdGNiaUFnSUNBZ0lIUmtPaUIwY25WbExDQjBhRG9nZEhKMVpWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCMGFEb2dlMXh1SUNBZ0lDQWdkR1E2SUhSeWRXVXNJSFJvT2lCMGNuVmxYRzRnSUNBZ2ZWeHVJQ0I5TzF4dVhHNGdJR3hsZENCclJXeGxiV1Z1ZEhORGJHOXpaV1JDZVVOc2IzTnBibWNnUFNCN1hHNGdJQ0FnYkdrNklIdGNiaUFnSUNBZ0lIVnNPaUIwY25WbExDQnZiRG9nZEhKMVpWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCaE9pQjdYRzRnSUNBZ0lDQmthWFk2SUhSeWRXVmNiaUFnSUNCOUxGeHVYRzRnSUNBZ1lqb2dlMXh1SUNBZ0lDQWdaR2wyT2lCMGNuVmxYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHazZJSHRjYmlBZ0lDQWdJR1JwZGpvZ2RISjFaVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQndPaUI3WEc0Z0lDQWdJQ0JrYVhZNklIUnlkV1ZjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdkR1E2SUh0Y2JpQWdJQ0FnSUhSeU9pQjBjblZsTENCMFlXSnNaVG9nZEhKMVpWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCMGFEb2dlMXh1SUNBZ0lDQWdkSEk2SUhSeWRXVXNJSFJoWW14bE9pQjBjblZsWEc0Z0lDQWdmVnh1SUNCOU8xeHVYRzRnSUd4bGRDQnJRbXh2WTJ0VVpYaDBSV3hsYldWdWRITWdQU0I3WEc0Z0lDQWdjMk55YVhCME9pQjBjblZsTEZ4dUlDQWdJRzV2YzJOeWFYQjBPaUIwY25WbExGeHVJQ0FnSUhOMGVXeGxPaUIwY25WbExGeHVJQ0FnSUhCeVpUb2dkSEoxWlZ4dUlDQjlPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlVaWGgwVG05a1pTQjBieUJqYjI1MFlXbHVJR0VnZEdWNGRDQmxiR1Z0Wlc1MElHbHVJRVJQVFNCMGNtVmxMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjMwZ2RtRnNkV1VnVzJSbGMyTnlhWEIwYVc5dVhWeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdWR1Y0ZEU1dlpHVW9kbUZzZFdVcElIdGNiaUFnSUNCc1pYUWdhVzV6ZEdGdVkyVWdQU0J3YjI5c2N5NWxiR1Z0Wlc1MFQySnFaV04wTG1kbGRDZ3BPMXh1WEc0Z0lDQWdhVzV6ZEdGdVkyVXVibTlrWlU1aGJXVWdQU0FuSTNSbGVIUW5PMXh1SUNBZ0lHbHVjM1JoYm1ObExtNXZaR1ZXWVd4MVpTQTlJSFpoYkhWbE8xeHVJQ0FnSUdsdWMzUmhibU5sTG01dlpHVlVlWEJsSUQwZ016dGNiaUFnSUNCcGJuTjBZVzVqWlM1amFHbHNaRTV2WkdWekxteGxibWQwYUNBOUlEQTdYRzRnSUNBZ2FXNXpkR0Z1WTJVdVlYUjBjbWxpZFhSbGN5NXNaVzVuZEdnZ1BTQXdPMXh1WEc0Z0lDQWdjbVYwZFhKdUlHbHVjM1JoYm1ObE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWhVVFV4RmJHVnRaVzUwTENCM2FHbGphQ0JqYjI1MFlXbHVjeUJoSUhObGRDQnZaaUJqYUdsc1pISmxiaTVjYmlBZ0lDcGNiaUFnSUNvZ1RtOTBaVG9nZEdocGN5QnBjeUJoSUcxcGJtbHRZV3hwYzNRZ2FXMXdiR1Z0Wlc1MFlYUnBiMjRzSUc1dklHTnZiWEJzWlhSbElIUnlaV1VnYzNSeWRXTjBkWEpsWEc0Z0lDQXFJSEJ5YjNacFpHVmtJQ2h1YnlCd1lYSmxiblJPYjJSbExDQnVaWGgwVTJsaWJHbHVaeXdnY0hKbGRtbHZkWE5UYVdKc2FXNW5JR1YwWXlrdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQnVZVzFsSUNBZ0lDQnViMlJsVG1GdFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnYTJWNVFYUjBjbk1nYVdRZ1lXNWtJR05zWVhOeklHRjBkSEpwWW5WMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnY21GM1FYUjBjbk1nWVhSMGNtbGlkWFJsY3lCcGJpQnpkSEpwYm1kY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlFaFVUVXhGYkdWdFpXNTBLRzVoYldVc0lHdGxlVUYwZEhKekxDQnlZWGRCZEhSeWN5a2dlMXh1SUNBZ0lHeGxkQ0JwYm5OMFlXNWpaU0E5SUhCdmIyeHpMbVZzWlcxbGJuUlBZbXBsWTNRdVoyVjBLQ2s3WEc1Y2JpQWdJQ0JwYm5OMFlXNWpaUzV1YjJSbFRtRnRaU0E5SUc1aGJXVTdYRzRnSUNBZ2FXNXpkR0Z1WTJVdWJtOWtaVlpoYkhWbElEMGdKeWM3WEc0Z0lDQWdhVzV6ZEdGdVkyVXVibTlrWlZSNWNHVWdQU0F4TzF4dUlDQWdJR2x1YzNSaGJtTmxMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0JwYm5OMFlXNWpaUzVoZEhSeWFXSjFkR1Z6TG14bGJtZDBhQ0E5SURBN1hHNWNiaUFnSUNCcFppQW9jbUYzUVhSMGNuTXBJSHRjYmlBZ0lDQWdJR1p2Y2lBb2JHVjBJRzFoZEdOb095QnRZWFJqYUNBOUlISmxRWFIwY2xCaGRIUmxjbTR1WlhobFl5aHlZWGRCZEhSeWN5azdJQ2tnZTF4dUlDQWdJQ0FnSUNCc1pYUWdZWFIwY2lBOUlIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQzVuWlhRb0tUdGNibHh1SUNBZ0lDQWdJQ0JoZEhSeUxtNWhiV1VnUFNCdFlYUmphRnN4WFR0Y2JpQWdJQ0FnSUNBZ1lYUjBjaTUyWVd4MVpTQTlJRzFoZEdOb1d6WmRJSHg4SUcxaGRHTm9XelZkSUh4OElHMWhkR05vV3pSZElIeDhJRzFoZEdOb1d6RmRPMXh1WEc0Z0lDQWdJQ0FnSUM4dklFeHZiMnNnWm05eUlHVnRjSFI1SUdGMGRISnBZblYwWlhNdVhHNGdJQ0FnSUNBZ0lHbG1JQ2h0WVhSamFGczJYU0E5UFQwZ0oxd2lYQ0luS1NCN0lHRjBkSEl1ZG1Gc2RXVWdQU0FuSnpzZ2ZWeHVYRzRnSUNBZ0lDQWdJR2x1YzNSaGJtTmxMbUYwZEhKcFluVjBaWE5iYVc1emRHRnVZMlV1WVhSMGNtbGlkWFJsY3k1c1pXNW5kR2hkSUQwZ1lYUjBjanRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2FXNXpkR0Z1WTJVN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVR0Z5YzJWeklFaFVUVXdnWVc1a0lISmxkSFZ5Ym5NZ1lTQnliMjkwSUdWc1pXMWxiblJjYmlBZ0lDb3ZYRzRnSUd4bGRDQm9kRzFzVUdGeWMyVnlJRDBnZTF4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZCaGNuTmxJR0VnWTJoMVkyc2diMllnU0ZSTlRDQnpiM1Z5WTJVdVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN2MzUnlhVzVuZlNCa1lYUmhJQ0FnSUNBZ2FIUnRiRnh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMGhVVFV4RmJHVnRaVzUwZlNBZ0lDQWdJSEp2YjNRZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSEJoY25ObE9pQm1kVzVqZEdsdmJpaGtZWFJoTENCdmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCc1pYUWdjbTl2ZEU5aWFtVmpkQ0E5SUh0OU8xeHVJQ0FnSUNBZ2JHVjBJSEp2YjNRZ1BTQklWRTFNUld4bGJXVnVkQ2h1ZFd4c0xDQnliMjkwVDJKcVpXTjBLVHRjYmlBZ0lDQWdJR3hsZENCamRYSnlaVzUwVUdGeVpXNTBJRDBnY205dmREdGNiaUFnSUNBZ0lHeGxkQ0J6ZEdGamF5QTlJRnR5YjI5MFhUdGNiaUFnSUNBZ0lHeGxkQ0JzWVhOMFZHVjRkRkJ2Y3lBOUlDMHhPMXh1WEc0Z0lDQWdJQ0J2Y0hScGIyNXpJRDBnYjNCMGFXOXVjeUI4ZkNCN2ZUdGNibHh1SUNBZ0lDQWdhV1lnS0dSaGRHRXVhVzVrWlhoUFppZ25QQ2NwSUQwOVBTQXRNU0FtSmlCa1lYUmhLU0I3WEc0Z0lDQWdJQ0FnSUdOMWNuSmxiblJRWVhKbGJuUXVZMmhwYkdST2IyUmxjMXRqZFhKeVpXNTBVR0Z5Wlc1MExtTm9hV3hrVG05a1pYTXViR1Z1WjNSb1hTQTlJRlJsZUhST2IyUmxLR1JoZEdFcE8xeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnliMjkwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCbWIzSWdLR3hsZENCdFlYUmphQ3dnZEdWNGREc2diV0YwWTJnZ1BTQnJUV0Z5YTNWd1VHRjBkR1Z5Ymk1bGVHVmpLR1JoZEdFcE95QXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHeGhjM1JVWlhoMFVHOXpJRDRnTFRFcElIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2JHRnpkRlJsZUhSUWIzTWdLeUJ0WVhSamFGc3dYUzVzWlc1bmRHZ2dQQ0JyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJR2xtSUdoaGN5QmpiMjUwWlc1MFhHNGdJQ0FnSUNBZ0lDQWdJQ0IwWlhoMElEMGdaR0YwWVM1emJHbGpaU2hzWVhOMFZHVjRkRkJ2Y3l3Z2EwMWhjbXQxY0ZCaGRIUmxjbTR1YkdGemRFbHVaR1Y0SUMwZ2JXRjBZMmhiTUYwdWJHVnVaM1JvS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIUmxlSFF1ZEhKcGJTZ3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUlFZWEpsYm5RdVkyaHBiR1JPYjJSbGMxdGpkWEp5Wlc1MFVHRnlaVzUwTG1Ob2FXeGtUbTlrWlhNdWJHVnVaM1JvWFNBOUlGUmxlSFJPYjJSbEtIUmxlSFFwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR3hoYzNSVVpYaDBVRzl6SUQwZ2EwMWhjbXQxY0ZCaGRIUmxjbTR1YkdGemRFbHVaR1Y0TzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRlJvYVhNZ2FYTWdZU0JqYjIxdFpXNTBMbHh1SUNBZ0lDQWdJQ0JwWmlBb2JXRjBZMmhiTUYxYk1WMGdQVDA5SUNjaEp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuUnBiblZsTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0c5d2RHbHZibk11Ykc5M1pYSkRZWE5sVkdGblRtRnRaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHMWhkR05vV3pKZElEMGdiV0YwWTJoYk1sMHVkRzlNYjNkbGNrTmhjMlVvS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR2xtSUNnaGJXRjBZMmhiTVYwcElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCdWIzUWdQQzhnZEdGbmMxeHVJQ0FnSUNBZ0lDQWdJR3hsZENCaGRIUnljeUE5SUh0OU8xeHVYRzRnSUNBZ0lDQWdJQ0FnWm05eUlDaHNaWFFnWVhSMFRXRjBZMmc3SUdGMGRFMWhkR05vSUQwZ2EwRjBkSEpwWW5WMFpWQmhkSFJsY200dVpYaGxZeWh0WVhSamFGc3pYU2s3SUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWVhSMGNuTmJZWFIwVFdGMFkyaGJNVjFkSUQwZ1lYUjBUV0YwWTJoYk0xMGdmSHdnWVhSMFRXRjBZMmhiTkYwZ2ZId2dZWFIwVFdGMFkyaGJOVjA3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tDRnRZWFJqYUZzMFhTQW1KaUJyUld4bGJXVnVkSE5EYkc5elpXUkNlVTl3Wlc1cGJtZGJZM1Z5Y21WdWRGQmhjbVZ1ZEM1dWIyUmxUbUZ0WlYwcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHJSV3hsYldWdWRITkRiRzl6WldSQ2VVOXdaVzVwYm1kYlkzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFRtRnRaVjFiYldGMFkyaGJNbDFkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhOMFlXTnJMbkJ2Y0NncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCamRYSnlaVzUwVUdGeVpXNTBJRDBnYzNSaFkydGJjM1JoWTJzdWJHVnVaM1JvSUMwZ01WMDdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZCaGNtVnVkQ0E5SUdOMWNuSmxiblJRWVhKbGJuUXVZMmhwYkdST2IyUmxjMXRqZFhKeVpXNTBVR0Z5Wlc1MExtTm9hV3hrVG05a1pYTXVjSFZ6YUNoY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnU0ZSTlRFVnNaVzFsYm5Rb2JXRjBZMmhiTWwwc0lHRjBkSEp6TENCdFlYUmphRnN6WFNrcElDMGdNVjA3WEc1Y2JpQWdJQ0FnSUNBZ0lDQnpkR0ZqYXk1d2RYTm9LR04xY25KbGJuUlFZWEpsYm5RcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHdENiRzlqYTFSbGVIUkZiR1Z0Wlc1MGMxdHRZWFJqYUZzeVhWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJR0VnYkdsMGRHeGxJSFJsYzNRZ2RHOGdabWx1WkNCdVpYaDBJRHd2YzJOeWFYQjBQaUJ2Y2lBOEwzTjBlV3hsUGlBdUxpNWNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQmpiRzl6WlUxaGNtdDFjQ0E5SUNjOEx5Y2dLeUJ0WVhSamFGc3lYU0FySUNjK0p6dGNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQnBibVJsZUNBOUlHUmhkR0V1YVc1a1pYaFBaaWhqYkc5elpVMWhjbXQxY0N3Z2EwMWhjbXQxY0ZCaGRIUmxjbTR1YkdGemRFbHVaR1Y0S1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHOXdkR2x2Ym5OYmJXRjBZMmhiTWwxZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hwYm1SbGVDQTlQU0F0TVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJSFJvWlhKbElHbHpJRzV2SUcxaGRHTm9hVzVuSUdWdVpHbHVaeUJtYjNJZ2RHaGxJSFJsZUhRZ1pXeGxiV1Z1ZEM1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMFpYaDBJRDBnWkdGMFlTNXpiR2xqWlNoclRXRnlhM1Z3VUdGMGRHVnliaTVzWVhOMFNXNWtaWGdwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUmxlSFFnUFNCa1lYUmhMbk5zYVdObEtHdE5ZWEpyZFhCUVlYUjBaWEp1TG14aGMzUkpibVJsZUN3Z2FXNWtaWGdwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIUmxlSFF1YkdWdVozUm9JRDRnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTjFjbkpsYm5SUVlYSmxiblF1WTJocGJHUk9iMlJsYzF0amRYSnlaVzUwVUdGeVpXNTBMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9YU0E5SUZSbGVIUk9iMlJsS0hSbGVIUXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2FXNWtaWGdnUFQwZ0xURXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdiR0Z6ZEZSbGVIUlFiM01nUFNCclRXRnlhM1Z3VUdGMGRHVnliaTVzWVhOMFNXNWtaWGdnUFNCa1lYUmhMbXhsYm1kMGFDQXJJREU3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZM1Z5Y21WdWRGQmhjbVZ1ZEM1dWIyUmxWbUZzZFdVZ1BTQmtZWFJoTG5Oc2FXTmxLR3ROWVhKcmRYQlFZWFIwWlhKdUxteGhjM1JKYm1SbGVDd2dhVzVrWlhncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1lYTjBWR1Y0ZEZCdmN5QTlJR3ROWVhKcmRYQlFZWFIwWlhKdUxteGhjM1JKYm1SbGVDQTlJR2x1WkdWNElDc2dZMnh2YzJWTllYSnJkWEF1YkdWdVozUm9PMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnRZWFJqYUZzeFhTQTlJSFJ5ZFdVN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnYVdZZ0tHMWhkR05vV3pGZElIeDhJRzFoZEdOb1d6UmRJSHg4SUd0VFpXeG1RMnh2YzJsdVowVnNaVzFsYm5SelcyMWhkR05vV3pKZFhTa2dlMXh1SUNBZ0lDQWdJQ0FnSUM4dklEd3ZJRzl5SUM4K0lHOXlJRHhpY2o0Z1pYUmpMbHh1SUNBZ0lDQWdJQ0FnSUhkb2FXeGxJQ2hqZFhKeVpXNTBVR0Z5Wlc1MEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9ZM1Z5Y21WdWRGQmhjbVZ1ZEM1dWIyUmxUbUZ0WlNBOVBTQnRZWFJqYUZzeVhTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnpkR0ZqYXk1d2IzQW9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZM1Z5Y21WdWRGQmhjbVZ1ZENBOUlITjBZV05yVzNOMFlXTnJMbXhsYm1kMGFDQXRJREZkTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRlJ5ZVdsdVp5QjBieUJqYkc5elpTQmpkWEp5Wlc1MElIUmhaeXdnWVc1a0lHMXZkbVVnYjI1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHdEZiR1Z0Wlc1MGMwTnNiM05sWkVKNVEyeHZjMmx1WjF0amRYSnlaVzUwVUdGeVpXNTBMbTV2WkdWT1lXMWxYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaHJSV3hsYldWdWRITkRiRzl6WldSQ2VVTnNiM05wYm1kYlkzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFRtRnRaVjFiYldGMFkyaGJNbDFkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpkR0ZqYXk1d2IzQW9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOMWNuSmxiblJRWVhKbGJuUWdQU0J6ZEdGamExdHpkR0ZqYXk1c1pXNW5kR2dnTFNBeFhUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWRHbHVkV1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZYTmxJR0ZuWjNKbGMzTnBkbVVnYzNSeVlYUmxaM2tnZEc4Z2FHRnVaR3hsSUhWdWJXRjBZMmhwYm1jZ2JXRnlhM1Z3Y3k1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJ5YjI5ME8xeHVJQ0FnSUgxY2JpQWdmVHRjYmx4dUlDQnlaWFIxY200Z2FIUnRiRkJoY25ObGNqdGNibjA3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jcmVhdGVQb29sID0gY3JlYXRlUG9vbDtcbmV4cG9ydHMuaW5pdGlhbGl6ZVBvb2xzID0gaW5pdGlhbGl6ZVBvb2xzO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfdXVpZDIgPSByZXF1aXJlKCcuL3V1aWQnKTtcblxudmFyIF91dWlkMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V1aWQyKTtcblxudmFyIHV1aWQgPSBfdXVpZDNbJ2RlZmF1bHQnXTtcbnZhciBwb29scyA9IHt9O1xuZXhwb3J0cy5wb29scyA9IHBvb2xzO1xudmFyIGNvdW50ID0gMTAwMDA7XG5cbmV4cG9ydHMuY291bnQgPSBjb3VudDtcbi8qKlxuICogQ3JlYXRlcyBhIHBvb2wgdG8gcXVlcnkgbmV3IG9yIHJldXNlZCB2YWx1ZXMgZnJvbS5cbiAqXG4gKiBAcGFyYW0gbmFtZVxuICogQHBhcmFtIG9wdHNcbiAqIEByZXR1cm4ge09iamVjdH0gcG9vbFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVBvb2wobmFtZSwgb3B0cykge1xuICB2YXIgc2l6ZSA9IG9wdHMuc2l6ZTtcbiAgdmFyIGZpbGwgPSBvcHRzLmZpbGw7XG5cbiAgdmFyIF9mcmVlID0gW107XG4gIHZhciBhbGxvY2F0ZWQgPSBbXTtcbiAgdmFyIF9wcm90ZWN0ID0gW107XG5cbiAgLy8gUHJpbWUgdGhlIGNhY2hlIHdpdGggbiBvYmplY3RzLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIF9mcmVlW2ldID0gZmlsbCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfZnJlZTogX2ZyZWUsXG4gICAgX2FsbG9jYXRlZDogYWxsb2NhdGVkLFxuICAgIF9wcm90ZWN0ZWQ6IF9wcm90ZWN0LFxuICAgIF91dWlkOiB7fSxcblxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIG9iaiA9IG51bGw7XG4gICAgICB2YXIgZnJlZUxlbmd0aCA9IF9mcmVlLmxlbmd0aDtcbiAgICAgIHZhciBtaW51c09uZSA9IGZyZWVMZW5ndGggLSAxO1xuXG4gICAgICBpZiAoZnJlZUxlbmd0aCkge1xuICAgICAgICBvYmogPSBfZnJlZVttaW51c09uZV07XG4gICAgICAgIF9mcmVlLmxlbmd0aCA9IG1pbnVzT25lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqID0gZmlsbCgpO1xuICAgICAgfVxuXG4gICAgICBhbGxvY2F0ZWQucHVzaChvYmopO1xuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICBwcm90ZWN0OiBmdW5jdGlvbiBwcm90ZWN0KHZhbHVlKSB7XG4gICAgICB2YXIgaWR4ID0gYWxsb2NhdGVkLmluZGV4T2YodmFsdWUpO1xuXG4gICAgICAvLyBNb3ZlIHRoZSB2YWx1ZSBvdXQgb2YgYWxsb2NhdGVkLCBzaW5jZSB3ZSBuZWVkIHRvIHByb3RlY3QgdGhpcyBmcm9tXG4gICAgICAvLyBiZWluZyBmcmVlJ2QgYWNjaWRlbnRhbGx5LlxuICAgICAgX3Byb3RlY3QucHVzaChpZHggPT09IC0xID8gdmFsdWUgOiBhbGxvY2F0ZWQuc3BsaWNlKGlkeCwgMSlbMF0pO1xuXG4gICAgICAvLyBJZiB3ZSdyZSBwcm90ZWN0aW5nIGFuIGVsZW1lbnQgb2JqZWN0LCBwdXNoIHRoZSB1dWlkIGludG8gYSBsb29rdXBcbiAgICAgIC8vIHRhYmxlLlxuICAgICAgaWYgKG5hbWUgPT09ICdlbGVtZW50T2JqZWN0Jykge1xuICAgICAgICB0aGlzLl91dWlkW3ZhbHVlLmVsZW1lbnRdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHVucHJvdGVjdDogZnVuY3Rpb24gdW5wcm90ZWN0KHZhbHVlKSB7XG4gICAgICB2YXIgaWR4ID0gX3Byb3RlY3QuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgIHZhciBvYmogPSBfcHJvdGVjdC5zcGxpY2UoaWR4LCAxKVswXTtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgIGFsbG9jYXRlZC5wdXNoKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ2VsZW1lbnRPYmplY3QnKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3V1aWRbdmFsdWUuZWxlbWVudF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZnJlZUFsbDogZnVuY3Rpb24gZnJlZUFsbCgpIHtcbiAgICAgIHZhciBhbGxvY2F0ZWRMZW5ndGggPSBhbGxvY2F0ZWQubGVuZ3RoO1xuICAgICAgdmFyIGZyZWVMZW5ndGggPSBfZnJlZS5sZW5ndGg7XG5cbiAgICAgIF9mcmVlLnB1c2guYXBwbHkoX2ZyZWUsIGFsbG9jYXRlZC5zbGljZSgwLCBzaXplIC0gZnJlZUxlbmd0aCkpO1xuICAgICAgYWxsb2NhdGVkLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIGZyZWU6IGZ1bmN0aW9uIGZyZWUodmFsdWUpIHtcbiAgICAgIHZhciBpZHggPSBhbGxvY2F0ZWQuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgIC8vIEFscmVhZHkgZnJlZWQuXG4gICAgICBpZiAoaWR4ID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgcHV0IGJhY2sgaW50byB0aGUgZnJlZSBxdWV1ZSBpZiB3ZSdyZSB1bmRlciB0aGUgc2l6ZS5cbiAgICAgIGlmIChfZnJlZS5sZW5ndGggPCBzaXplKSB7XG4gICAgICAgIF9mcmVlLnB1c2godmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBhbGxvY2F0ZWQuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUG9vbHMoQ09VTlQpIHtcbiAgcG9vbHMuYXR0cmlidXRlT2JqZWN0ID0gY3JlYXRlUG9vbCgnYXR0cmlidXRlT2JqZWN0Jywge1xuICAgIHNpemU6IENPVU5ULFxuXG4gICAgZmlsbDogZnVuY3Rpb24gZmlsbCgpIHtcbiAgICAgIHJldHVybiB7IG5hbWU6ICcnLCB2YWx1ZTogJycgfTtcbiAgICB9XG4gIH0pO1xuXG4gIHBvb2xzLmVsZW1lbnRPYmplY3QgPSBjcmVhdGVQb29sKCdlbGVtZW50T2JqZWN0Jywge1xuICAgIHNpemU6IENPVU5ULFxuXG4gICAgZmlsbDogZnVuY3Rpb24gZmlsbCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZW1lbnQ6IHV1aWQoKSxcbiAgICAgICAgY2hpbGROb2RlczogW10sXG4gICAgICAgIGF0dHJpYnV0ZXM6IFtdXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIENyZWF0ZSAxMGsgaXRlbXMgb2YgZWFjaCB0eXBlLlxuaW5pdGlhbGl6ZVBvb2xzKGNvdW50KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmNHOXZiSE11YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3p0eFFrRkJhMElzVVVGQlVUczdPenRCUVVVeFFpeEpRVUZOTEVsQlFVa3NiMEpCUVZFc1EwRkJRenRCUVVOYUxFbEJRVWtzUzBGQlN5eEhRVUZITEVWQlFVVXNRMEZCUXpzN1FVRkRaaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdPenM3T3pzN096czdPMEZCVTJ4Q0xGTkJRVk1zVlVGQlZTeERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVVN1RVRkRMMElzU1VGQlNTeEhRVUZYTEVsQlFVa3NRMEZCYmtJc1NVRkJTVHROUVVGRkxFbEJRVWtzUjBGQlN5eEpRVUZKTEVOQlFXSXNTVUZCU1RzN1FVRkRhRUlzVFVGQlNTeExRVUZKTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJRc1RVRkJTU3hUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEyNUNMRTFCUVVrc1VVRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6czdPMEZCUjJwQ0xFOUJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZETjBJc1UwRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NSVUZCUlN4RFFVRkRPMGRCUTJ4Q096dEJRVVZFTEZOQlFVODdRVUZEVEN4VFFVRkxMRVZCUVVVc1MwRkJTVHRCUVVOWUxHTkJRVlVzUlVGQlJTeFRRVUZUTzBGQlEzSkNMR05CUVZVc1JVRkJSU3hSUVVGUE8wRkJRMjVDTEZOQlFVc3NSVUZCUlN4RlFVRkZPenRCUVVWVUxFOUJRVWNzUlVGQlJTeGxRVUZYTzBGQlEyUXNWVUZCU1N4SFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRMllzVlVGQlNTeFZRVUZWTEVkQlFVY3NTMEZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVNM1FpeFZRVUZKTEZGQlFWRXNSMEZCUnl4VlFVRlZMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVU1UWl4VlFVRkpMRlZCUVZVc1JVRkJSVHRCUVVOa0xGZEJRVWNzUjBGQlJ5eExRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRja0lzWVVGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4UlFVRlJMRU5CUVVNN1QwRkRlRUlzVFVGRFNUdEJRVU5JTEZkQlFVY3NSMEZCUnl4SlFVRkpMRVZCUVVVc1EwRkJRenRQUVVOa096dEJRVVZFTEdWQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJYQkNMR0ZCUVU4c1IwRkJSeXhEUVVGRE8wdEJRMW83TzBGQlJVUXNWMEZCVHl4RlFVRkZMR2xDUVVGVExFdEJRVXNzUlVGQlJUdEJRVU4yUWl4VlFVRkpMRWRCUVVjc1IwRkJSeXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPenM3TzBGQlNXNURMR05CUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXl4SFFVRkhMRXRCUVVzc1IwRkJSeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZET3pzN08wRkJTUzlFTEZWQlFVa3NTVUZCU1N4TFFVRkxMR1ZCUVdVc1JVRkJSVHRCUVVNMVFpeFpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTTdUMEZEYmtNN1MwRkRSanM3UVVGRlJDeGhRVUZUTEVWQlFVVXNiVUpCUVZNc1MwRkJTeXhGUVVGRk8wRkJRM3BDTEZWQlFVa3NSMEZCUnl4SFFVRkhMRkZCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUldwRExGVkJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTJRc1dVRkJTU3hIUVVGSExFZEJRVWNzVVVGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY0VNc1dVRkJTU3hIUVVGSExFVkJRVVU3UVVGQlJTeHRRa0ZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dFRRVUZGT3p0QlFVVnFReXhaUVVGSkxFbEJRVWtzUzBGQlN5eGxRVUZsTEVWQlFVVTdRVUZETlVJc2FVSkJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03VTBGRGJFTTdUMEZEUmp0TFFVTkdPenRCUVVWRUxGZEJRVThzUlVGQlJTeHRRa0ZCVnp0QlFVTnNRaXhWUVVGSkxHVkJRV1VzUjBGQlJ5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNaRExGVkJRVWtzVlVGQlZTeEhRVUZITEV0QlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNN08wRkJSVGRDTEZkQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVWtzUlVGQlJTeFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSU3hKUVVGSkxFZEJRVWNzVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTTNSQ3hsUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0TFFVTjBRanM3UVVGRlJDeFJRVUZKTEVWQlFVVXNZMEZCVXl4TFFVRkxMRVZCUVVVN1FVRkRjRUlzVlVGQlNTeEhRVUZITEVkQlFVY3NVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6czdPMEZCUjI1RExGVkJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUVVVc1pVRkJUenRQUVVGRk96czdRVUZITTBJc1ZVRkJTU3hMUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NSVUZCUlR0QlFVTjBRaXhoUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMDlCUTJ4Q096dEJRVVZFTEdWQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzB0QlF6RkNPMGRCUTBZc1EwRkJRenREUVVOSU96dEJRVWROTEZOQlFWTXNaVUZCWlN4RFFVRkRMRXRCUVVzc1JVRkJSVHRCUVVOeVF5eFBRVUZMTEVOQlFVTXNaVUZCWlN4SFFVRkhMRlZCUVZVc1EwRkJReXhwUWtGQmFVSXNSVUZCUlR0QlFVTndSQ3hSUVVGSkxFVkJRVVVzUzBGQlN6czdRVUZGV0N4UlFVRkpMRVZCUVVVc1owSkJRVmM3UVVGRFppeGhRVUZQTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVc1JVRkJSU3hMUVVGTExFVkJRVVVzUlVGQlJTeEZRVUZGTEVOQlFVTTdTMEZEYUVNN1IwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUMEZCU3l4RFFVRkRMR0ZCUVdFc1IwRkJSeXhWUVVGVkxFTkJRVU1zWlVGQlpTeEZRVUZGTzBGQlEyaEVMRkZCUVVrc1JVRkJSU3hMUVVGTE96dEJRVVZZTEZGQlFVa3NSVUZCUlN4blFrRkJWenRCUVVObUxHRkJRVTg3UVVGRFRDeGxRVUZQTEVWQlFVVXNTVUZCU1N4RlFVRkZPMEZCUTJZc2EwSkJRVlVzUlVGQlJTeEZRVUZGTzBGQlEyUXNhMEpCUVZVc1JVRkJSU3hGUVVGRk8wOUJRMllzUTBGQlF6dExRVU5JTzBkQlEwWXNRMEZCUXl4RFFVRkRPME5CUTBvN096dEJRVWRFTEdWQlFXVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReUlzSW1acGJHVWlPaUl2YUc5dFpTOTBhVzB2WjJsMEwyUnBabVpvZEcxc0wyeHBZaTkxZEdsc0wzQnZiMnh6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGOTFkV2xrSUdaeWIyMGdKeTR2ZFhWcFpDYzdYRzVjYm1OdmJuTjBJSFYxYVdRZ1BTQmZkWFZwWkR0Y2JtVjRjRzl5ZENCMllYSWdjRzl2YkhNZ1BTQjdmVHRjYm1WNGNHOXlkQ0IyWVhJZ1kyOTFiblFnUFNBeE1EQXdNRHRjYmx4dUx5b3FYRzRnS2lCRGNtVmhkR1Z6SUdFZ2NHOXZiQ0IwYnlCeGRXVnllU0J1WlhjZ2IzSWdjbVYxYzJWa0lIWmhiSFZsY3lCbWNtOXRMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQnVZVzFsWEc0Z0tpQkFjR0Z5WVcwZ2IzQjBjMXh1SUNvZ1FISmxkSFZ5YmlCN1QySnFaV04wZlNCd2IyOXNYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCamNtVmhkR1ZRYjI5c0tHNWhiV1VzSUc5d2RITXBJSHRjYmlBZ2RtRnlJSHNnYzJsNlpTd2dabWxzYkNCOUlEMGdiM0IwY3p0Y2JpQWdkbUZ5SUdaeVpXVWdQU0JiWFR0Y2JpQWdkbUZ5SUdGc2JHOWpZWFJsWkNBOUlGdGRPMXh1SUNCMllYSWdjSEp2ZEdWamRDQTlJRnRkTzF4dVhHNGdJQzh2SUZCeWFXMWxJSFJvWlNCallXTm9aU0IzYVhSb0lHNGdiMkpxWldOMGN5NWNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCemFYcGxPeUJwS3lzcElIdGNiaUFnSUNCbWNtVmxXMmxkSUQwZ1ptbHNiQ2dwTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0JmWm5KbFpUb2dabkpsWlN4Y2JpQWdJQ0JmWVd4c2IyTmhkR1ZrT2lCaGJHeHZZMkYwWldRc1hHNGdJQ0FnWDNCeWIzUmxZM1JsWkRvZ2NISnZkR1ZqZEN4Y2JpQWdJQ0JmZFhWcFpEb2dlMzBzWEc1Y2JpQWdJQ0JuWlhRNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdiR1YwSUc5aWFpQTlJRzUxYkd3N1hHNGdJQ0FnSUNCc1pYUWdabkpsWlV4bGJtZDBhQ0E5SUdaeVpXVXViR1Z1WjNSb08xeHVJQ0FnSUNBZ2JHVjBJRzFwYm5WelQyNWxJRDBnWm5KbFpVeGxibWQwYUNBdElERTdYRzVjYmlBZ0lDQWdJR2xtSUNobWNtVmxUR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQWdJRzlpYWlBOUlHWnlaV1ZiYldsdWRYTlBibVZkTzF4dUlDQWdJQ0FnSUNCbWNtVmxMbXhsYm1kMGFDQTlJRzFwYm5WelQyNWxPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lHOWlhaUE5SUdacGJHd29LVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWVd4c2IyTmhkR1ZrTG5CMWMyZ29iMkpxS1R0Y2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUc5aWFqdGNiaUFnSUNCOUxGeHVYRzRnSUNBZ2NISnZkR1ZqZERvZ1puVnVZM1JwYjI0b2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUd4bGRDQnBaSGdnUFNCaGJHeHZZMkYwWldRdWFXNWtaWGhQWmloMllXeDFaU2s3WEc1Y2JpQWdJQ0FnSUM4dklFMXZkbVVnZEdobElIWmhiSFZsSUc5MWRDQnZaaUJoYkd4dlkyRjBaV1FzSUhOcGJtTmxJSGRsSUc1bFpXUWdkRzhnY0hKdmRHVmpkQ0IwYUdseklHWnliMjFjYmlBZ0lDQWdJQzh2SUdKbGFXNW5JR1p5WldVblpDQmhZMk5wWkdWdWRHRnNiSGt1WEc0Z0lDQWdJQ0J3Y205MFpXTjBMbkIxYzJnb2FXUjRJRDA5UFNBdE1TQS9JSFpoYkhWbElEb2dZV3hzYjJOaGRHVmtMbk53YkdsalpTaHBaSGdzSURFcFd6QmRLVHRjYmx4dUlDQWdJQ0FnTHk4Z1NXWWdkMlVuY21VZ2NISnZkR1ZqZEdsdVp5QmhiaUJsYkdWdFpXNTBJRzlpYW1WamRDd2djSFZ6YUNCMGFHVWdkWFZwWkNCcGJuUnZJR0VnYkc5dmEzVndYRzRnSUNBZ0lDQXZMeUIwWVdKc1pTNWNiaUFnSUNBZ0lHbG1JQ2h1WVcxbElEMDlQU0FuWld4bGJXVnVkRTlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZkWFZwWkZ0MllXeDFaUzVsYkdWdFpXNTBYU0E5SUhaaGJIVmxPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQjFibkJ5YjNSbFkzUTZJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQnNaWFFnYVdSNElEMGdjSEp2ZEdWamRDNXBibVJsZUU5bUtIWmhiSFZsS1R0Y2JseHVJQ0FnSUNBZ2FXWWdLR2xrZUNBaFBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJRzlpYWlBOUlIQnliM1JsWTNRdWMzQnNhV05sS0dsa2VDd2dNU2xiTUYwN1hHNGdJQ0FnSUNBZ0lHbG1JQ2h2WW1vcElIc2dZV3hzYjJOaGRHVmtMbkIxYzJnb2IySnFLVHNnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h1WVcxbElEMDlQU0FuWld4bGJXVnVkRTlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJQ0FnSUNCa1pXeGxkR1VnZEdocGN5NWZkWFZwWkZ0MllXeDFaUzVsYkdWdFpXNTBYVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0JtY21WbFFXeHNPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUd4bGRDQmhiR3h2WTJGMFpXUk1aVzVuZEdnZ1BTQmhiR3h2WTJGMFpXUXViR1Z1WjNSb08xeHVJQ0FnSUNBZ2JHVjBJR1p5WldWTVpXNW5kR2dnUFNCbWNtVmxMbXhsYm1kMGFEdGNibHh1SUNBZ0lDQWdabkpsWlM1d2RYTm9MbUZ3Y0d4NUtHWnlaV1VzSUdGc2JHOWpZWFJsWkM1emJHbGpaU2d3TENCemFYcGxJQzBnWm5KbFpVeGxibWQwYUNrcE8xeHVJQ0FnSUNBZ1lXeHNiMk5oZEdWa0xteGxibWQwYUNBOUlEQTdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHWnlaV1U2SUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0JzWlhRZ2FXUjRJRDBnWVd4c2IyTmhkR1ZrTG1sdVpHVjRUMllvZG1Gc2RXVXBPMXh1WEc0Z0lDQWdJQ0F2THlCQmJISmxZV1I1SUdaeVpXVmtMbHh1SUNBZ0lDQWdhV1lnS0dsa2VDQTlQVDBnTFRFcElIc2djbVYwZFhKdU95QjlYRzVjYmlBZ0lDQWdJQzh2SUU5dWJIa2djSFYwSUdKaFkyc2dhVzUwYnlCMGFHVWdabkpsWlNCeGRXVjFaU0JwWmlCM1pTZHlaU0IxYm1SbGNpQjBhR1VnYzJsNlpTNWNiaUFnSUNBZ0lHbG1JQ2htY21WbExteGxibWQwYUNBOElITnBlbVVwSUh0Y2JpQWdJQ0FnSUNBZ1puSmxaUzV3ZFhOb0tIWmhiSFZsS1R0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1lXeHNiMk5oZEdWa0xuTndiR2xqWlNocFpIZ3NJREVwTzF4dUlDQWdJSDFjYmlBZ2ZUdGNibjFjYmx4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2FXNXBkR2xoYkdsNlpWQnZiMnh6S0VOUFZVNVVLU0I3WEc0Z0lIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQ0E5SUdOeVpXRjBaVkJ2YjJ3b0oyRjBkSEpwWW5WMFpVOWlhbVZqZENjc0lIdGNiaUFnSUNCemFYcGxPaUJEVDFWT1ZDeGNibHh1SUNBZ0lHWnBiR3c2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhzZ2JtRnRaVG9nSnljc0lIWmhiSFZsT2lBbkp5QjlPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaUFnY0c5dmJITXVaV3hsYldWdWRFOWlhbVZqZENBOUlHTnlaV0YwWlZCdmIyd29KMlZzWlcxbGJuUlBZbXBsWTNRbkxDQjdYRzRnSUNBZ2MybDZaVG9nUTA5VlRsUXNYRzVjYmlBZ0lDQm1hV3hzT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5RNklIVjFhV1FvS1N4Y2JpQWdJQ0FnSUNBZ1kyaHBiR1JPYjJSbGN6b2dXMTBzWEc0Z0lDQWdJQ0FnSUdGMGRISnBZblYwWlhNNklGdGRYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNTlYRzVjYmk4dklFTnlaV0YwWlNBeE1Hc2dhWFJsYlhNZ2IyWWdaV0ZqYUNCMGVYQmxMbHh1YVc1cGRHbGhiR2w2WlZCdmIyeHpLR052ZFc1MEtUdGNiaUpkZlE9PSIsIi8qKlxuICogR2VuZXJhdGVzIGEgdXVpZC5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjMvMjgyMTc1XG4gKiBAcmV0dXJuIHtzdHJpbmd9IHV1aWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHV1aWQ7XG5cbmZ1bmN0aW9uIHV1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwLFxuICAgICAgICB2ID0gYyA9PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmRYVnBaQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3p0eFFrRk5kMElzU1VGQlNUczdRVUZCWWl4VFFVRlRMRWxCUVVrc1IwRkJSenRCUVVNM1FpeFRRVUZQTEhORFFVRnpReXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNWVUZCVXl4RFFVRkRMRVZCUVVVN1FVRkRla1VzVVVGQlNTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hIUVVGRExFVkJRVVVzUjBGQlF5eERRVUZETzFGQlFVVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hIUVVGSExFZEJRVWNzUTBGQlF5eEhRVUZKTEVOQlFVTXNSMEZCUXl4SFFVRkhMRWRCUVVNc1IwRkJSeXhCUVVGRExFTkJRVU03UVVGRE0wUXNWMEZCVHl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzBkQlEzWkNMRU5CUVVNc1EwRkJRenREUVVOS0lpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2ZFhWcFpDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUjJWdVpYSmhkR1Z6SUdFZ2RYVnBaQzVjYmlBcVhHNGdLaUJBYzJWbElHaDBkSEE2THk5emRHRmphMjkyWlhKbWJHOTNMbU52YlM5aEx6SXhNVGMxTWpNdk1qZ3lNVGMxWEc0Z0tpQkFjbVYwZFhKdUlIdHpkSEpwYm1kOUlIVjFhV1JjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z2RYVnBaQ2dwSUh0Y2JpQWdjbVYwZFhKdUlDZDRlSGg0ZUhoNGVDMTRlSGg0TFRSNGVIZ3RlWGg0ZUMxNGVIaDRlSGg0ZUhoNGVIZ25MbkpsY0d4aFkyVW9MMXQ0ZVYwdlp5d2dablZ1WTNScGIyNG9ZeWtnZTF4dUlDQWdJSFpoY2lCeUlEMGdUV0YwYUM1eVlXNWtiMjBvS1NveE5ud3dMQ0IySUQwZ1l5QTlQU0FuZUNjZ1B5QnlJRG9nS0hJbU1IZ3pmREI0T0NrN1hHNGdJQ0FnY21WMGRYSnVJSFl1ZEc5VGRISnBibWNvTVRZcE8xeHVJQ0I5S1R0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxVdWlkID0gcmVxdWlyZSgnLi4vdXRpbC91dWlkJyk7XG5cbnZhciBfdXRpbFV1aWQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbFV1aWQpO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsUGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbC9wYXJzZXInKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIF9ub2RlU3luYyA9IHJlcXVpcmUoJy4uL25vZGUvc3luYycpO1xuXG52YXIgX25vZGVTeW5jMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVTeW5jKTtcblxudmFyIF9zb3VyY2UgPSByZXF1aXJlKCcuL3NvdXJjZScpO1xuXG52YXIgX3NvdXJjZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zb3VyY2UpO1xuXG4vLyBUZXN0cyBpZiB0aGUgYnJvd3NlciBoYXMgc3VwcG9ydCBmb3IgdGhlIGBXb3JrZXJgIEFQSS5cbnZhciBoYXNXb3JrZXIgPSB0eXBlb2YgV29ya2VyID09PSAnZnVuY3Rpb24nO1xuXG5leHBvcnRzLmhhc1dvcmtlciA9IGhhc1dvcmtlcjtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBXZWIgV29ya2VyIHBlciBlbGVtZW50IHRoYXQgd2lsbCBiZSBkaWZmZWQuIEFsbG93cyBtdWx0aXBsZVxuICogY29uY3VycmVudCBkaWZmaW5nIG9wZXJhdGlvbnMgdG8gb2NjdXIgc2ltdWx0YW5lb3VzbHksIGxldmVyYWdpbmcgdGhlXG4gKiBtdWx0aS1jb3JlIG5hdHVyZSBvZiBkZXNrdG9wIGFuZCBtb2JpbGUgZGV2aWNlcy5cbiAqXG4gKiBBdHRhY2ggYW55IGZ1bmN0aW9ucyB0aGF0IGNvdWxkIGJlIHVzZWQgYnkgdGhlIFdvcmtlciBpbnNpZGUgdGhlIEJsb2IgYmVsb3cuXG4gKiBBbGwgZnVuY3Rpb25zIGFyZSBuYW1lZCBzbyB0aGV5IGNhbiBiZSBhY2Nlc3NlZCBnbG9iYWxseS4gU2luY2Ugd2UncmVcbiAqIGRpcmVjdGx5IGluamVjdGluZyB0aGUgbWV0aG9kcyBpbnRvIGFuIEFycmF5IGFuZCB0aGVuIGNhbGxpbmcgYGpvaW5gIHRoZVxuICogYHRvU3RyaW5nYCBtZXRob2Qgd2lsbCBiZSBpbnZva2VkIG9uIGVhY2ggZnVuY3Rpb24gYW5kIHdpbGwgaW5qZWN0IGEgdmFsaWRcbiAqIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBmdW5jdGlvbidzIHNvdXJjZS4gVGhpcyBjb21lcyBhdCBhIGNvc3Qgc2luY2UgQmFiZWxcbiAqIHJld3JpdGVzIHZhcmlhYmxlIG5hbWVzIHdoZW4geW91IGBpbXBvcnRgIGEgbW9kdWxlLiBUaGlzIGlzIHdoeSB5b3UnbGwgc2VlXG4gKiB1bmRlcnNjb3JlZCBwcm9wZXJ0aWVzIGJlaW5nIGltcG9ydGVkIGFuZCB0aGVuIHJlYXNzaWduZWQgdG8gbm9uLXVuZGVyc2NvcmVkXG4gKiBuYW1lcyBpbiBtb2R1bGVzIHRoYXQgYXJlIHJldXNlZCBoZXJlLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gQSBXb3JrZXIgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlKCkge1xuICB2YXIgd29ya2VyQmxvYiA9IG51bGw7XG4gIHZhciB3b3JrZXIgPSBudWxsO1xuXG4gIC8vIFNldCB1cCBhIFdlYldvcmtlciBpZiBhdmFpbGFibGUuXG4gIGlmIChoYXNXb3JrZXIpIHtcbiAgICAvLyBDb25zdHJ1Y3QgdGhlIHdvcmtlciByZXVzaW5nIGNvZGUgYWxyZWFkeSBvcmdhbml6ZWQgaW50byBtb2R1bGVzLiAgS2VlcFxuICAgIC8vIHRoaXMgY29kZSBFUzUgc2luY2Ugd2UgZG8gbm90IGdldCB0aW1lIHRvIHByZS1wcm9jZXNzIGl0IGFzIEVTNi5cbiAgICB3b3JrZXJCbG9iID0gbmV3IEJsb2IoW1tcbiAgICAvLyBSZXVzYWJsZSBBcnJheSBtZXRob2RzLlxuICAgICd2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7JyxcblxuICAgIC8vIEFkZCBhIG5hbWVzcGFjZSB0byBhdHRhY2ggcG9vbCBtZXRob2RzIHRvLlxuICAgICd2YXIgcG9vbHMgPSB7fTsnLCAndmFyIG5vZGVzID0gMDsnLFxuXG4gICAgLy8gQWRkcyBpbiBhIGdsb2JhbCBgdXVpZGAgZnVuY3Rpb24uXG4gICAgX3V0aWxVdWlkMlsnZGVmYXVsdCddLFxuXG4gICAgLy8gQWRkIHRoZSBhYmlsaXR5IHRvIHByb3RlY3QgZWxlbWVudHMgZnJvbSBmcmVlJ2QgbWVtb3J5LlxuICAgIF91dGlsTWVtb3J5LnByb3RlY3RFbGVtZW50LCBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50LCBfdXRpbE1lbW9yeS5jbGVhbk1lbW9yeSxcblxuICAgIC8vIEFkZCBpbiBwb29sIG1hbmlwdWxhdGlvbiBtZXRob2RzLlxuICAgIF91dGlsUG9vbHMuY3JlYXRlUG9vbCwgX3V0aWxQb29scy5pbml0aWFsaXplUG9vbHMsICdpbml0aWFsaXplUG9vbHMoJyArIF91dGlsUG9vbHMuY291bnQgKyAnKTsnLFxuXG4gICAgLy8gQWRkIGluIE5vZGUgbWFuaXB1bGF0aW9uLlxuICAgICd2YXIgc3luY05vZGUgPSAnICsgX25vZGVTeW5jMlsnZGVmYXVsdCddLFxuXG4gICAgLy8gQWRkIGluIHRoZSBhYmlsaXR5IHRvIHBhcnNlSFRNTC5cbiAgICBfdXRpbFBhcnNlci5wYXJzZUhUTUwsICd2YXIgbWFrZVBhcnNlciA9ICcgKyBfdXRpbFBhcnNlci5tYWtlUGFyc2VyLCAndmFyIHBhcnNlciA9IG1ha2VQYXJzZXIoKTsnLFxuXG4gICAgLy8gQWRkIGluIHRoZSB3b3JrZXIgc291cmNlLlxuICAgIF9zb3VyY2UyWydkZWZhdWx0J10sXG5cbiAgICAvLyBNZXRhcHJvZ3JhbW1pbmcgdXAgdGhpcyB3b3JrZXIgY2FsbC5cbiAgICAnc3RhcnR1cChzZWxmKTsnXS5qb2luKCdcXG4nKV0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXG4gICAgLy8gQ29uc3RydWN0IHRoZSB3b3JrZXIgYW5kIHN0YXJ0IGl0IHVwLlxuICAgIHRyeSB7XG4gICAgICB3b3JrZXIgPSBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwod29ya2VyQmxvYikpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmluZm8pIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdGYWlsZWQgdG8gY3JlYXRlIGRpZmZodG1sIHdvcmtlcicsIGV4KTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgY2Fubm90IGNyZWF0ZSBhIFdvcmtlciwgdGhlbiBkaXNhYmxlIHRyeWluZyBhZ2FpbiwgYWxsIHdvcmtcbiAgICAgIC8vIHdpbGwgaGFwcGVuIG9uIHRoZSBtYWluIFVJIHRocmVhZC5cbiAgICAgIGV4cG9ydHMuaGFzV29ya2VyID0gaGFzV29ya2VyID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdvcmtlcjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM2R2Y210bGNpOWpjbVZoZEdVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN08zZENRVUZwUWl4alFVRmpPenM3TzNsQ1FVTnZRaXhsUVVGbE96c3dRa0ZGTlVJc1owSkJRV2RDT3pzd1FrRkRVU3huUWtGQlowSTdPM2RDUVVONlJDeGpRVUZqT3pzN08zTkNRVU5XTEZWQlFWVTdPenM3TzBGQlJ6VkNMRWxCUVVrc1UwRkJVeXhIUVVGSExFOUJRVThzVFVGQlRTeExRVUZMTEZWQlFWVXNRMEZCUXpzN096czdPenM3T3pzN096czdPenM3T3pzN1FVRnJRamRETEZOQlFWTXNUVUZCVFN4SFFVRkhPMEZCUTNaQ0xFMUJRVWtzVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTjBRaXhOUVVGSkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTTdPenRCUVVkc1FpeE5RVUZKTEZOQlFWTXNSVUZCUlRzN08wRkJSMklzWTBGQlZTeEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRU5CUTNCQ096dEJRVVZGTEhkRFFVRnZRenM3TzBGQlIzQkRMSEZDUVVGcFFpeEZRVU5xUWl4blFrRkJaMEk3T3pzN096czdPenQxUkVGaGFFSXNhMEpCUVd0Q0xHMUNRVUZaTEVkQlFVY3NTVUZCU1RzN08wRkJSM0pETEhGQ1FVRnBRaXgzUWtGQlZ6czdPekpDUVVzMVFpeHRRa0ZCYlVJc2VVSkJRV0VzUlVGRGFFTXNORUpCUVRSQ096czdPenM3UVVGTk5VSXNiMEpCUVdkQ0xFTkJRMnBDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVOaUxFVkJRVVVzUlVGQlJTeEpRVUZKTEVWQlFVVXNkMEpCUVhkQ0xFVkJRVVVzUTBGQlF5eERRVUZET3pzN1FVRkhka01zVVVGQlNUdEJRVU5HTEZsQlFVMHNSMEZCUnl4SlFVRkpMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zWlVGQlpTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRkRVFzUTBGRFJDeFBRVUZOTEVWQlFVVXNSVUZCUlR0QlFVTlNMRlZCUVVrc1QwRkJUeXhKUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEVWQlFVVTdRVUZETTBJc1pVRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eHJRMEZCYTBNc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dFBRVU4wUkRzN096dEJRVWxFTEdOQk5VVkxMRk5CUVZNc1IwRTBSV1FzVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXp0TFFVTnVRanRIUVVOR096dEJRVVZFTEZOQlFVOHNUVUZCVFN4RFFVRkRPME5CUTJZaUxDSm1hV3hsSWpvaUwyaHZiV1V2ZEdsdEwyZHBkQzlrYVdabWFIUnRiQzlzYVdJdmQyOXlhMlZ5TDJOeVpXRjBaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCMWRXbGtJR1p5YjIwZ0p5NHVMM1YwYVd3dmRYVnBaQ2M3WEc1cGJYQnZjblFnZXlCd2IyOXNjeXdnYVc1cGRHbGhiR2w2WlZCdmIyeHpMQ0JqY21WaGRHVlFiMjlzSUgwZ1puSnZiU0FuTGk0dmRYUnBiQzl3YjI5c2N5YzdYRzVwYlhCdmNuUWdleUJqYjNWdWRDQmhjeUJ3YjI5c1EyOTFiblFnZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0J2YjJ4ekp6dGNibWx0Y0c5eWRDQjdJSEJoY25ObFNGUk5UQ3dnYldGclpWQmhjbk5sY2lCOUlHWnliMjBnSnk0dUwzVjBhV3d2Y0dGeWMyVnlKenRjYm1sdGNHOXlkQ0I3SUhCeWIzUmxZM1JGYkdWdFpXNTBMQ0IxYm5CeWIzUmxZM1JGYkdWdFpXNTBMQ0JqYkdWaGJrMWxiVzl5ZVNCOUlHWnliMjBnSnk0dUwzVjBhV3d2YldWdGIzSjVKenRjYm1sdGNHOXlkQ0J6ZVc1alRtOWtaU0JtY205dElDY3VMaTl1YjJSbEwzTjVibU1uTzF4dWFXMXdiM0owSUhkdmNtdGxjbE52ZFhKalpTQm1jbTl0SUNjdUwzTnZkWEpqWlNjN1hHNWNiaTh2SUZSbGMzUnpJR2xtSUhSb1pTQmljbTkzYzJWeUlHaGhjeUJ6ZFhCd2IzSjBJR1p2Y2lCMGFHVWdZRmR2Y210bGNtQWdRVkJKTGx4dVpYaHdiM0owSUhaaGNpQm9ZWE5YYjNKclpYSWdQU0IwZVhCbGIyWWdWMjl5YTJWeUlEMDlQU0FuWm5WdVkzUnBiMjRuTzF4dVhHNHZLaXBjYmlBcUlFTnlaV0YwWlhNZ1lTQnVaWGNnVjJWaUlGZHZjbXRsY2lCd1pYSWdaV3hsYldWdWRDQjBhR0YwSUhkcGJHd2dZbVVnWkdsbVptVmtMaUJCYkd4dmQzTWdiWFZzZEdsd2JHVmNiaUFxSUdOdmJtTjFjbkpsYm5RZ1pHbG1abWx1WnlCdmNHVnlZWFJwYjI1eklIUnZJRzlqWTNWeUlITnBiWFZzZEdGdVpXOTFjMng1TENCc1pYWmxjbUZuYVc1bklIUm9aVnh1SUNvZ2JYVnNkR2t0WTI5eVpTQnVZWFIxY21VZ2IyWWdaR1Z6YTNSdmNDQmhibVFnYlc5aWFXeGxJR1JsZG1salpYTXVYRzRnS2x4dUlDb2dRWFIwWVdOb0lHRnVlU0JtZFc1amRHbHZibk1nZEdoaGRDQmpiM1ZzWkNCaVpTQjFjMlZrSUdKNUlIUm9aU0JYYjNKclpYSWdhVzV6YVdSbElIUm9aU0JDYkc5aUlHSmxiRzkzTGx4dUlDb2dRV3hzSUdaMWJtTjBhVzl1Y3lCaGNtVWdibUZ0WldRZ2MyOGdkR2hsZVNCallXNGdZbVVnWVdOalpYTnpaV1FnWjJ4dlltRnNiSGt1SUZOcGJtTmxJSGRsSjNKbFhHNGdLaUJrYVhKbFkzUnNlU0JwYm1wbFkzUnBibWNnZEdobElHMWxkR2h2WkhNZ2FXNTBieUJoYmlCQmNuSmhlU0JoYm1RZ2RHaGxiaUJqWVd4c2FXNW5JR0JxYjJsdVlDQjBhR1ZjYmlBcUlHQjBiMU4wY21sdVoyQWdiV1YwYUc5a0lIZHBiR3dnWW1VZ2FXNTJiMnRsWkNCdmJpQmxZV05vSUdaMWJtTjBhVzl1SUdGdVpDQjNhV3hzSUdsdWFtVmpkQ0JoSUhaaGJHbGtYRzRnS2lCeVpYQnlaWE5sYm5SaGRHbHZiaUJ2WmlCMGFHVWdablZ1WTNScGIyNG5jeUJ6YjNWeVkyVXVJRlJvYVhNZ1kyOXRaWE1nWVhRZ1lTQmpiM04wSUhOcGJtTmxJRUpoWW1Wc1hHNGdLaUJ5WlhkeWFYUmxjeUIyWVhKcFlXSnNaU0J1WVcxbGN5QjNhR1Z1SUhsdmRTQmdhVzF3YjNKMFlDQmhJRzF2WkhWc1pTNGdWR2hwY3lCcGN5QjNhSGtnZVc5MUoyeHNJSE5sWlZ4dUlDb2dkVzVrWlhKelkyOXlaV1FnY0hKdmNHVnlkR2xsY3lCaVpXbHVaeUJwYlhCdmNuUmxaQ0JoYm1RZ2RHaGxiaUJ5WldGemMybG5ibVZrSUhSdklHNXZiaTExYm1SbGNuTmpiM0psWkZ4dUlDb2dibUZ0WlhNZ2FXNGdiVzlrZFd4bGN5QjBhR0YwSUdGeVpTQnlaWFZ6WldRZ2FHVnlaUzVjYmlBcVhHNGdLaUJBY21WMGRYSnVJSHRQWW1wbFkzUjlJRUVnVjI5eWEyVnlJR2x1YzNSaGJtTmxMbHh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1kzSmxZWFJsS0NrZ2UxeHVJQ0JzWlhRZ2QyOXlhMlZ5UW14dllpQTlJRzUxYkd3N1hHNGdJR3hsZENCM2IzSnJaWElnUFNCdWRXeHNPMXh1WEc0Z0lDOHZJRk5sZENCMWNDQmhJRmRsWWxkdmNtdGxjaUJwWmlCaGRtRnBiR0ZpYkdVdVhHNGdJR2xtSUNob1lYTlhiM0pyWlhJcElIdGNiaUFnSUNBdkx5QkRiMjV6ZEhKMVkzUWdkR2hsSUhkdmNtdGxjaUJ5WlhWemFXNW5JR052WkdVZ1lXeHlaV0ZrZVNCdmNtZGhibWw2WldRZ2FXNTBieUJ0YjJSMWJHVnpMaUFnUzJWbGNGeHVJQ0FnSUM4dklIUm9hWE1nWTI5a1pTQkZVelVnYzJsdVkyVWdkMlVnWkc4Z2JtOTBJR2RsZENCMGFXMWxJSFJ2SUhCeVpTMXdjbTlqWlhOeklHbDBJR0Z6SUVWVE5pNWNiaUFnSUNCM2IzSnJaWEpDYkc5aUlEMGdibVYzSUVKc2IySW9XMXh1SUNBZ0lDQWdXMXh1SUNBZ0lDQWdJQ0F2THlCU1pYVnpZV0pzWlNCQmNuSmhlU0J0WlhSb2IyUnpMbHh1SUNBZ0lDQWdJQ0FuZG1GeUlITnNhV05sSUQwZ1FYSnlZWGt1Y0hKdmRHOTBlWEJsTG5Oc2FXTmxPeWNzWEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRV1JrSUdFZ2JtRnRaWE53WVdObElIUnZJR0YwZEdGamFDQndiMjlzSUcxbGRHaHZaSE1nZEc4dVhHNGdJQ0FnSUNBZ0lDZDJZWElnY0c5dmJITWdQU0I3ZlRzbkxGeHVJQ0FnSUNBZ0lDQW5kbUZ5SUc1dlpHVnpJRDBnTURzbkxGeHVYRzRnSUNBZ0lDQWdJQzh2SUVGa1pITWdhVzRnWVNCbmJHOWlZV3dnWUhWMWFXUmdJR1oxYm1OMGFXOXVMbHh1SUNBZ0lDQWdJQ0IxZFdsa0xGeHVYRzRnSUNBZ0lDQWdJQzh2SUVGa1pDQjBhR1VnWVdKcGJHbDBlU0IwYnlCd2NtOTBaV04wSUdWc1pXMWxiblJ6SUdaeWIyMGdabkpsWlNka0lHMWxiVzl5ZVM1Y2JpQWdJQ0FnSUNBZ2NISnZkR1ZqZEVWc1pXMWxiblFzWEc0Z0lDQWdJQ0FnSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFzWEc0Z0lDQWdJQ0FnSUdOc1pXRnVUV1Z0YjNKNUxGeHVYRzRnSUNBZ0lDQWdJQzh2SUVGa1pDQnBiaUJ3YjI5c0lHMWhibWx3ZFd4aGRHbHZiaUJ0WlhSb2IyUnpMbHh1SUNBZ0lDQWdJQ0JqY21WaGRHVlFiMjlzTEZ4dUlDQWdJQ0FnSUNCcGJtbDBhV0ZzYVhwbFVHOXZiSE1zWEc0Z0lDQWdJQ0FnSUNkcGJtbDBhV0ZzYVhwbFVHOXZiSE1vSnlBcklIQnZiMnhEYjNWdWRDQXJJQ2NwT3ljc1hHNWNiaUFnSUNBZ0lDQWdMeThnUVdSa0lHbHVJRTV2WkdVZ2JXRnVhWEIxYkdGMGFXOXVMbHh1SUNBZ0lDQWdJQ0FuZG1GeUlITjVibU5PYjJSbElEMGdKeUFySUhONWJtTk9iMlJsTEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkNCcGJpQjBhR1VnWVdKcGJHbDBlU0IwYnlCd1lYSnpaVWhVVFV3dVhHNGdJQ0FnSUNBZ0lIQmhjbk5sU0ZSTlRDeGNibHh1SUNBZ0lDQWdJQ0FuZG1GeUlHMWhhMlZRWVhKelpYSWdQU0FuSUNzZ2JXRnJaVkJoY25ObGNpeGNiaUFnSUNBZ0lDQWdKM1poY2lCd1lYSnpaWElnUFNCdFlXdGxVR0Z5YzJWeUtDazdKeXhjYmx4dUlDQWdJQ0FnSUNBdkx5QkJaR1FnYVc0Z2RHaGxJSGR2Y210bGNpQnpiM1Z5WTJVdVhHNGdJQ0FnSUNBZ0lIZHZjbXRsY2xOdmRYSmpaU3hjYmx4dUlDQWdJQ0FnSUNBdkx5Qk5aWFJoY0hKdlozSmhiVzFwYm1jZ2RYQWdkR2hwY3lCM2IzSnJaWElnWTJGc2JDNWNiaUFnSUNBZ0lDQWdKM04wWVhKMGRYQW9jMlZzWmlrN0oxeHVJQ0FnSUNBZ1hTNXFiMmx1S0NkY1hHNG5LVnh1SUNBZ0lGMHNJSHNnZEhsd1pUb2dKMkZ3Y0d4cFkyRjBhVzl1TDJwaGRtRnpZM0pwY0hRbklIMHBPMXh1WEc0Z0lDQWdMeThnUTI5dWMzUnlkV04wSUhSb1pTQjNiM0pyWlhJZ1lXNWtJSE4wWVhKMElHbDBJSFZ3TGx4dUlDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNCM2IzSnJaWElnUFNCdVpYY2dWMjl5YTJWeUtGVlNUQzVqY21WaGRHVlBZbXBsWTNSVlVrd29kMjl5YTJWeVFteHZZaWtwTzF4dUlDQWdJSDFjYmlBZ0lDQmpZWFJqYUNobGVDa2dlMXh1SUNBZ0lDQWdhV1lnS0dOdmJuTnZiR1VnSmlZZ1kyOXVjMjlzWlM1cGJtWnZLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTnZiR1V1YVc1bWJ5Z25SbUZwYkdWa0lIUnZJR055WldGMFpTQmthV1ptYUhSdGJDQjNiM0pyWlhJbkxDQmxlQ2s3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklFbG1JSGRsSUdOaGJtNXZkQ0JqY21WaGRHVWdZU0JYYjNKclpYSXNJSFJvWlc0Z1pHbHpZV0pzWlNCMGNubHBibWNnWVdkaGFXNHNJR0ZzYkNCM2IzSnJYRzRnSUNBZ0lDQXZMeUIzYVd4c0lHaGhjSEJsYmlCdmJpQjBhR1VnYldGcGJpQlZTU0IwYUhKbFlXUXVYRzRnSUNBZ0lDQm9ZWE5YYjNKclpYSWdQU0JtWVd4elpUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2QyOXlhMlZ5TzF4dWZWeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGVzZSBhcmUgZ2xvYmFsbHkgZGVmaW5lZCB0byBhdm9pZCBpc3N1ZXMgd2l0aCBKU0hpbnQgdGhpbmtpbmcgdGhhdCB3ZSdyZVxuLy8gcmVmZXJlbmNpbmcgdW5rbm93biBpZGVudGlmaWVycy5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc3RhcnR1cDtcbnZhciBwYXJzZUhUTUw7XG52YXIgc3luY05vZGU7XG52YXIgcG9vbHM7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgV2ViIFdvcmtlciBzb3VyY2UgY29kZS4gQWxsIGdsb2JhbHMgaGVyZSBhcmUgZGVmaW5lZCBpbiB0aGVcbiAqIHdvcmtlci9jcmVhdGUgbW9kdWxlLiBUaGlzIGFsbG93cyBjb2RlIHNoYXJpbmcgYW5kIGxlc3MgZHVwbGljYXRpb24gc2luY2VcbiAqIG1vc3Qgb2YgdGhlIGxvZ2ljIGlzIGlkZW50aWNhbCB0byB0aGUgVUkgdGhyZWFkLlxuICpcbiAqIEBwYXJhbSB3b3JrZXIgLSBBIHdvcmtlciBpbnN0YW5jZVxuICovXG5cbmZ1bmN0aW9uIHN0YXJ0dXAod29ya2VyKSB7XG4gIHZhciBwYXRjaGVzID0gW107XG4gIHZhciBvbGRUcmVlID0gbnVsbDtcblxuICAvLyBDcmVhdGUgYXJyYXlzIHRvIGhvbGQgZWxlbWVudCBhZGRpdGlvbnMgYW5kIHJlbW92YWxzLlxuICBwYXRjaGVzLmFkZGl0aW9ucyA9IFtdO1xuICBwYXRjaGVzLnJlbW92YWxzID0gW107XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJlZCB3aGVuZXZlciBhIGBwb3N0TWVzc2FnZWAgY2FsbCBpcyBtYWRlIG9uIHRoZSBXb3JrZXIgaW5zdGFuY2VcbiAgICogZnJvbSB0aGUgVUkgdGhyZWFkLiBTaWduYWxzIHRoYXQgc29tZSB3b3JrIG5lZWRzIHRvIG9jY3VyLiBXaWxsIHBvc3QgYmFja1xuICAgKiB0byB0aGUgbWFpbiB0aHJlYWQgd2l0aCBwYXRjaCBhbmQgbm9kZSB0cmFuc2Zvcm0gcmVzdWx0cy5cbiAgICpcbiAgICogQHBhcmFtIGUgLSBUaGUgbm9ybWFsaXplZCBldmVudCBvYmplY3QuXG4gICAqL1xuICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgZGF0YSA9IGUuZGF0YTtcbiAgICB2YXIgaXNJbm5lciA9IGRhdGEuaXNJbm5lcjtcbiAgICB2YXIgbmV3VHJlZSA9IG51bGw7XG5cbiAgICAvLyBBbHdheXMgdW5wcm90ZWN0IGFsbG9jYXRpb25zIGJlZm9yZSB0aGUgc3RhcnQgb2YgYSByZW5kZXIgY3ljbGUuXG4gICAgaWYgKG9sZFRyZWUpIHtcbiAgICAgIHVucHJvdGVjdEVsZW1lbnQob2xkVHJlZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgYW4gYG9sZFRyZWVgIHdhcyBwcm92aWRlZCBieSB0aGUgVUkgdGhyZWFkLCB1c2UgdGhhdCBpbiBwbGFjZSBvZiB0aGVcbiAgICAvLyBjdXJyZW50IGBvbGRUcmVlYC5cbiAgICBpZiAoZGF0YS5vbGRUcmVlKSB7XG4gICAgICBvbGRUcmVlID0gZGF0YS5vbGRUcmVlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBgbmV3VHJlZWAgd2FzIHByb3ZpZGVkIHRvIHRoZSB3b3JrZXIsIHVzZSB0aGF0IGluc3RlYWQgb2YgdHJ5aW5nXG4gICAgLy8gdG8gY3JlYXRlIG9uZSBmcm9tIEhUTUwgc291cmNlLlxuICAgIGlmIChkYXRhLm5ld1RyZWUpIHtcbiAgICAgIG5ld1RyZWUgPSBkYXRhLm5ld1RyZWU7XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gYG5ld1RyZWVgIHdhcyBwcm92aWRlZCwgd2UnbGwgaGF2ZSB0byB0cnkgYW5kIGNyZWF0ZSBvbmUgZnJvbSB0aGVcbiAgICAvLyBIVE1MIHNvdXJjZSBwcm92aWRlZC5cbiAgICBlbHNlIGlmICh0eXBlb2YgZGF0YS5uZXdIVE1MID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBDYWxjdWxhdGUgYSBuZXcgdHJlZS5cbiAgICAgICAgbmV3VHJlZSA9IHBhcnNlSFRNTChkYXRhLm5ld0hUTUwsIGlzSW5uZXIpO1xuXG4gICAgICAgIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgZm9yIGBpbm5lckhUTUxgIHRoZW4gd2UnbGwgcmV0YWluIHRoZSBwcmV2aW91c1xuICAgICAgICAvLyB0cmVlJ3MgYXR0cmlidXRlcywgbm9kZU5hbWUsIGFuZCBub2RlVmFsdWUsIGFuZCBvbmx5IGFkanVzdCB0aGVcbiAgICAgICAgLy8gY2hpbGROb2Rlcy5cbiAgICAgICAgaWYgKGlzSW5uZXIpIHtcbiAgICAgICAgICB2YXIgY2hpbGROb2RlcyA9IG5ld1RyZWU7XG5cbiAgICAgICAgICBuZXdUcmVlID0ge1xuICAgICAgICAgICAgY2hpbGROb2RlczogY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IG9sZFRyZWUuYXR0cmlidXRlcyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IG9sZFRyZWUuZWxlbWVudCxcbiAgICAgICAgICAgIG5vZGVOYW1lOiBvbGRUcmVlLm5vZGVOYW1lLFxuICAgICAgICAgICAgbm9kZVZhbHVlOiBvbGRUcmVlLm5vZGVWYWx1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIC8vIFN5bmNocm9uaXplIHRoZSBvbGQgdmlydHVhbCB0cmVlIHdpdGggdGhlIG5ldyB2aXJ0dWFsIHRyZWUuICBUaGlzIHdpbGxcbiAgICAvLyBwcm9kdWNlIGEgc2VyaWVzIG9mIHBhdGNoZXMgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHRvIHVwZGF0ZSB0aGUgRE9NLlxuICAgIHN5bmNOb2RlLmNhbGwocGF0Y2hlcywgb2xkVHJlZSwgbmV3VHJlZSk7XG5cbiAgICAvLyBQcm90ZWN0IHRoZSBjdXJyZW50IGBvbGRUcmVlYCBzbyB0aGF0IG5vIE5vZGVzIHdpbGwgYmUgYWNjaWRlbnRhbGx5XG4gICAgLy8gcmVjeWNsZWQgaW4gdGhlXG4gICAgcHJvdGVjdEVsZW1lbnQob2xkVHJlZSk7XG5cbiAgICAvLyBTZW5kIHRoZSBwYXRjaGVzIGJhY2sgdG8gdGhlIHVzZXJsYW5kLlxuICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICAvLyBOb2RlIG9wZXJhdGlvbmFsIGNoYW5nZXMsIGFkZGl0aW9ucyBhbmQgcmVtb3ZhbHMuXG4gICAgICBub2Rlczoge1xuICAgICAgICBhZGRpdGlvbnM6IHBhdGNoZXMuYWRkaXRpb25zLFxuICAgICAgICByZW1vdmFsczogcGF0Y2hlcy5yZW1vdmFsc1xuICAgICAgfSxcblxuICAgICAgLy8gQWxsIHRoZSBwYXRjaGVzIHRvIGFwcGx5IHRvIHRoZSBET00uXG4gICAgICBwYXRjaGVzOiBwYXRjaGVzXG4gICAgfSk7XG5cbiAgICAvLyBSZWN5Y2xlIGFsbG9jYXRlZCBvYmplY3RzIGJhY2sgaW50byB0aGUgcG9vbC5cbiAgICBjbGVhbk1lbW9yeSgpO1xuXG4gICAgLy8gV2lwZSBvdXQgdGhlIHBhdGNoZXMgaW4gbWVtb3J5LlxuICAgIHBhdGNoZXMubGVuZ3RoID0gMDtcbiAgICBwYXRjaGVzLmFkZGl0aW9ucy5sZW5ndGggPSAwO1xuICAgIHBhdGNoZXMucmVtb3ZhbHMubGVuZ3RoID0gMDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNkdmNtdGxjaTl6YjNWeVkyVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96czdPenM3TzNGQ1FXVlhMRTlCUVU4N1FVRllMMElzU1VGQlNTeFRRVUZUTEVOQlFVTTdRVUZEWkN4SlFVRkpMRkZCUVZFc1EwRkJRenRCUVVOaUxFbEJRVWtzUzBGQlN5eERRVUZET3pzN096czdPenM3TzBGQlUwc3NVMEZCVXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM1JETEUxQlFVa3NUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOcVFpeE5RVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN096dEJRVWR1UWl4VFFVRlBMRU5CUVVNc1UwRkJVeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU4yUWl4VFFVRlBMRU5CUVVNc1VVRkJVU3hIUVVGSExFVkJRVVVzUTBGQlF6czdPenM3T3pzN08wRkJVM1JDTEZGQlFVMHNRMEZCUXl4VFFVRlRMRWRCUVVjc1ZVRkJVeXhEUVVGRExFVkJRVVU3UVVGRE4wSXNVVUZCU1N4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU5zUWl4UlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzBGQlF6TkNMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF6czdPMEZCUjI1Q0xGRkJRVWtzVDBGQlR5eEZRVUZGTzBGQlFVVXNjMEpCUVdkQ0xFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTMEZCUlRzN096dEJRVWt6UXl4UlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVU3UVVGQlJTeGhRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJRenRMUVVGRk96czdPMEZCU1RkRExGRkJRVWtzU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlR0QlFVRkZMR0ZCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzB0QlFVVTdPenM3VTBGSmVFTXNTVUZCU1N4UFFVRlBMRWxCUVVrc1EwRkJReXhQUVVGUExFdEJRVXNzVVVGQlVTeEZRVUZGT3p0QlFVVjZReXhsUVVGUExFZEJRVWNzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03T3pzN08wRkJTek5ETEZsQlFVa3NUMEZCVHl4RlFVRkZPMEZCUTFnc1kwRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZET3p0QlFVVjZRaXhwUWtGQlR5eEhRVUZITzBGQlExSXNjMEpCUVZVc1JVRkJWaXhWUVVGVk8wRkJRMVlzYzBKQlFWVXNSVUZCUlN4UFFVRlBMRU5CUVVNc1ZVRkJWVHRCUVVNNVFpeHRRa0ZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhQUVVGUE8wRkJRM2hDTEc5Q1FVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExGRkJRVkU3UVVGRE1VSXNjVUpCUVZNc1JVRkJSU3hQUVVGUExFTkJRVU1zVTBGQlV6dFhRVU0zUWl4RFFVRkRPMU5CUTBnN1QwRkRSanM3T3p0QlFVbEVMRmxCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenM3T3p0QlFVbDZReXhyUWtGQll5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenM3UVVGSGVFSXNWVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJRenM3UVVGRmFrSXNWMEZCU3l4RlFVRkZPMEZCUTB3c2FVSkJRVk1zUlVGQlJTeFBRVUZQTEVOQlFVTXNVMEZCVXp0QlFVTTFRaXhuUWtGQlVTeEZRVUZGTEU5QlFVOHNRMEZCUXl4UlFVRlJPMDlCUXpOQ096czdRVUZIUkN4aFFVRlBMRVZCUVVVc1QwRkJUenRMUVVOcVFpeERRVUZETEVOQlFVTTdPenRCUVVkSUxHVkJRVmNzUlVGQlJTeERRVUZET3pzN1FVRkhaQ3hYUVVGUExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnVRaXhYUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkROMElzVjBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE8wZEJRemRDTEVOQlFVTTdRMEZEU0NJc0ltWnBiR1VpT2lJdmFHOXRaUzkwYVcwdloybDBMMlJwWm1ab2RHMXNMMnhwWWk5M2IzSnJaWEl2YzI5MWNtTmxMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUozVnpaU0J6ZEhKcFkzUW5PMXh1WEc0dkx5QlVhR1Z6WlNCaGNtVWdaMnh2WW1Gc2JIa2daR1ZtYVc1bFpDQjBieUJoZG05cFpDQnBjM04xWlhNZ2QybDBhQ0JLVTBocGJuUWdkR2hwYm10cGJtY2dkR2hoZENCM1pTZHlaVnh1THk4Z2NtVm1aWEpsYm1OcGJtY2dkVzVyYm05M2JpQnBaR1Z1ZEdsbWFXVnljeTVjYm5aaGNpQndZWEp6WlVoVVRVdzdYRzUyWVhJZ2MzbHVZMDV2WkdVN1hHNTJZWElnY0c5dmJITTdYRzVjYmk4cUtseHVJQ29nVkdocGN5QnBjeUIwYUdVZ1YyVmlJRmR2Y210bGNpQnpiM1Z5WTJVZ1kyOWtaUzRnUVd4c0lHZHNiMkpoYkhNZ2FHVnlaU0JoY21VZ1pHVm1hVzVsWkNCcGJpQjBhR1ZjYmlBcUlIZHZjbXRsY2k5amNtVmhkR1VnYlc5a2RXeGxMaUJVYUdseklHRnNiRzkzY3lCamIyUmxJSE5vWVhKcGJtY2dZVzVrSUd4bGMzTWdaSFZ3YkdsallYUnBiMjRnYzJsdVkyVmNiaUFxSUcxdmMzUWdiMllnZEdobElHeHZaMmxqSUdseklHbGtaVzUwYVdOaGJDQjBieUIwYUdVZ1ZVa2dkR2h5WldGa0xseHVJQ3BjYmlBcUlFQndZWEpoYlNCM2IzSnJaWElnTFNCQklIZHZjbXRsY2lCcGJuTjBZVzVqWlZ4dUlDb3ZYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpQnpkR0Z5ZEhWd0tIZHZjbXRsY2lrZ2UxeHVJQ0IyWVhJZ2NHRjBZMmhsY3lBOUlGdGRPMXh1SUNCMllYSWdiMnhrVkhKbFpTQTlJRzUxYkd3N1hHNWNiaUFnTHk4Z1EzSmxZWFJsSUdGeWNtRjVjeUIwYnlCb2IyeGtJR1ZzWlcxbGJuUWdZV1JrYVhScGIyNXpJR0Z1WkNCeVpXMXZkbUZzY3k1Y2JpQWdjR0YwWTJobGN5NWhaR1JwZEdsdmJuTWdQU0JiWFR0Y2JpQWdjR0YwWTJobGN5NXlaVzF2ZG1Gc2N5QTlJRnRkTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJVY21sbloyVnlaV1FnZDJobGJtVjJaWElnWVNCZ2NHOXpkRTFsYzNOaFoyVmdJR05oYkd3Z2FYTWdiV0ZrWlNCdmJpQjBhR1VnVjI5eWEyVnlJR2x1YzNSaGJtTmxYRzRnSUNBcUlHWnliMjBnZEdobElGVkpJSFJvY21WaFpDNGdVMmxuYm1Gc2N5QjBhR0YwSUhOdmJXVWdkMjl5YXlCdVpXVmtjeUIwYnlCdlkyTjFjaTRnVjJsc2JDQndiM04wSUdKaFkydGNiaUFnSUNvZ2RHOGdkR2hsSUcxaGFXNGdkR2h5WldGa0lIZHBkR2dnY0dGMFkyZ2dZVzVrSUc1dlpHVWdkSEpoYm5ObWIzSnRJSEpsYzNWc2RITXVYRzRnSUNBcVhHNGdJQ0FxSUVCd1lYSmhiU0JsSUMwZ1ZHaGxJRzV2Y20xaGJHbDZaV1FnWlhabGJuUWdiMkpxWldOMExseHVJQ0FnS2k5Y2JpQWdkMjl5YTJWeUxtOXViV1Z6YzJGblpTQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2JpQWdJQ0IyWVhJZ1pHRjBZU0E5SUdVdVpHRjBZVHRjYmlBZ0lDQjJZWElnYVhOSmJtNWxjaUE5SUdSaGRHRXVhWE5KYm01bGNqdGNiaUFnSUNCMllYSWdibVYzVkhKbFpTQTlJRzUxYkd3N1hHNWNiaUFnSUNBdkx5QkJiSGRoZVhNZ2RXNXdjbTkwWldOMElHRnNiRzlqWVhScGIyNXpJR0psWm05eVpTQjBhR1VnYzNSaGNuUWdiMllnWVNCeVpXNWtaWElnWTNsamJHVXVYRzRnSUNBZ2FXWWdLRzlzWkZSeVpXVXBJSHNnZFc1d2NtOTBaV04wUld4bGJXVnVkQ2h2YkdSVWNtVmxLVHNnZlZ4dVhHNGdJQ0FnTHk4Z1NXWWdZVzRnWUc5c1pGUnlaV1ZnSUhkaGN5QndjbTkyYVdSbFpDQmllU0IwYUdVZ1ZVa2dkR2h5WldGa0xDQjFjMlVnZEdoaGRDQnBiaUJ3YkdGalpTQnZaaUIwYUdWY2JpQWdJQ0F2THlCamRYSnlaVzUwSUdCdmJHUlVjbVZsWUM1Y2JpQWdJQ0JwWmlBb1pHRjBZUzV2YkdSVWNtVmxLU0I3SUc5c1pGUnlaV1VnUFNCa1lYUmhMbTlzWkZSeVpXVTdJSDFjYmx4dUlDQWdJQzh2SUVsbUlIUm9aU0JnYm1WM1ZISmxaV0FnZDJGeklIQnliM1pwWkdWa0lIUnZJSFJvWlNCM2IzSnJaWElzSUhWelpTQjBhR0YwSUdsdWMzUmxZV1FnYjJZZ2RISjVhVzVuWEc0Z0lDQWdMeThnZEc4Z1kzSmxZWFJsSUc5dVpTQm1jbTl0SUVoVVRVd2djMjkxY21ObExseHVJQ0FnSUdsbUlDaGtZWFJoTG01bGQxUnlaV1VwSUhzZ2JtVjNWSEpsWlNBOUlHUmhkR0V1Ym1WM1ZISmxaVHNnZlZ4dVhHNGdJQ0FnTHk4Z1NXWWdibThnWUc1bGQxUnlaV1ZnSUhkaGN5QndjbTkyYVdSbFpDd2dkMlVuYkd3Z2FHRjJaU0IwYnlCMGNua2dZVzVrSUdOeVpXRjBaU0J2Ym1VZ1puSnZiU0IwYUdWY2JpQWdJQ0F2THlCSVZFMU1JSE52ZFhKalpTQndjbTkyYVdSbFpDNWNiaUFnSUNCbGJITmxJR2xtSUNoMGVYQmxiMllnWkdGMFlTNXVaWGRJVkUxTUlEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnTHk4Z1EyRnNZM1ZzWVhSbElHRWdibVYzSUhSeVpXVXVYRzRnSUNBZ0lDQnVaWGRVY21WbElEMGdjR0Z5YzJWSVZFMU1LR1JoZEdFdWJtVjNTRlJOVEN3Z2FYTkpibTVsY2lrN1hHNWNiaUFnSUNBZ0lDOHZJRWxtSUhSb1pTQnZjR1Z5WVhScGIyNGdhWE1nWm05eUlHQnBibTVsY2toVVRVeGdJSFJvWlc0Z2QyVW5iR3dnY21WMFlXbHVJSFJvWlNCd2NtVjJhVzkxYzF4dUlDQWdJQ0FnTHk4Z2RISmxaU2R6SUdGMGRISnBZblYwWlhNc0lHNXZaR1ZPWVcxbExDQmhibVFnYm05a1pWWmhiSFZsTENCaGJtUWdiMjVzZVNCaFpHcDFjM1FnZEdobFhHNGdJQ0FnSUNBdkx5QmphR2xzWkU1dlpHVnpMbHh1SUNBZ0lDQWdhV1lnS0dselNXNXVaWElwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR05vYVd4a1RtOWtaWE1nUFNCdVpYZFVjbVZsTzF4dVhHNGdJQ0FnSUNBZ0lHNWxkMVJ5WldVZ1BTQjdYRzRnSUNBZ0lDQWdJQ0FnWTJocGJHUk9iMlJsY3l4Y2JpQWdJQ0FnSUNBZ0lDQmhkSFJ5YVdKMWRHVnpPaUJ2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE1zWEc0Z0lDQWdJQ0FnSUNBZ1pXeGxiV1Z1ZERvZ2IyeGtWSEpsWlM1bGJHVnRaVzUwTEZ4dUlDQWdJQ0FnSUNBZ0lHNXZaR1ZPWVcxbE9pQnZiR1JVY21WbExtNXZaR1ZPWVcxbExGeHVJQ0FnSUNBZ0lDQWdJRzV2WkdWV1lXeDFaVG9nYjJ4a1ZISmxaUzV1YjJSbFZtRnNkV1ZjYmlBZ0lDQWdJQ0FnZlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCVGVXNWphSEp2Ym1sNlpTQjBhR1VnYjJ4a0lIWnBjblIxWVd3Z2RISmxaU0IzYVhSb0lIUm9aU0J1WlhjZ2RtbHlkSFZoYkNCMGNtVmxMaUFnVkdocGN5QjNhV3hzWEc0Z0lDQWdMeThnY0hKdlpIVmpaU0JoSUhObGNtbGxjeUJ2WmlCd1lYUmphR1Z6SUhSb1lYUWdkMmxzYkNCaVpTQmxlR1ZqZFhSbFpDQjBieUIxY0dSaGRHVWdkR2hsSUVSUFRTNWNiaUFnSUNCemVXNWpUbTlrWlM1allXeHNLSEJoZEdOb1pYTXNJRzlzWkZSeVpXVXNJRzVsZDFSeVpXVXBPMXh1WEc0Z0lDQWdMeThnVUhKdmRHVmpkQ0IwYUdVZ1kzVnljbVZ1ZENCZ2IyeGtWSEpsWldBZ2MyOGdkR2hoZENCdWJ5Qk9iMlJsY3lCM2FXeHNJR0psSUdGalkybGtaVzUwWVd4c2VWeHVJQ0FnSUM4dklISmxZM2xqYkdWa0lHbHVJSFJvWlZ4dUlDQWdJSEJ5YjNSbFkzUkZiR1Z0Wlc1MEtHOXNaRlJ5WldVcE8xeHVYRzRnSUNBZ0x5OGdVMlZ1WkNCMGFHVWdjR0YwWTJobGN5QmlZV05ySUhSdklIUm9aU0IxYzJWeWJHRnVaQzVjYmlBZ0lDQjNiM0pyWlhJdWNHOXpkRTFsYzNOaFoyVW9lMXh1SUNBZ0lDQWdMeThnVG05a1pTQnZjR1Z5WVhScGIyNWhiQ0JqYUdGdVoyVnpMQ0JoWkdScGRHbHZibk1nWVc1a0lISmxiVzkyWVd4ekxseHVJQ0FnSUNBZ2JtOWtaWE02SUh0Y2JpQWdJQ0FnSUNBZ1lXUmthWFJwYjI1ek9pQndZWFJqYUdWekxtRmtaR2wwYVc5dWN5eGNiaUFnSUNBZ0lDQWdjbVZ0YjNaaGJITTZJSEJoZEdOb1pYTXVjbVZ0YjNaaGJITmNiaUFnSUNBZ0lIMHNYRzVjYmlBZ0lDQWdJQzh2SUVGc2JDQjBhR1VnY0dGMFkyaGxjeUIwYnlCaGNIQnNlU0IwYnlCMGFHVWdSRTlOTGx4dUlDQWdJQ0FnY0dGMFkyaGxjem9nY0dGMFkyaGxjMXh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdMeThnVW1WamVXTnNaU0JoYkd4dlkyRjBaV1FnYjJKcVpXTjBjeUJpWVdOcklHbHVkRzhnZEdobElIQnZiMnd1WEc0Z0lDQWdZMnhsWVc1TlpXMXZjbmtvS1R0Y2JseHVJQ0FnSUM4dklGZHBjR1VnYjNWMElIUm9aU0J3WVhSamFHVnpJR2x1SUcxbGJXOXllUzVjYmlBZ0lDQndZWFJqYUdWekxteGxibWQwYUNBOUlEQTdYRzRnSUNBZ2NHRjBZMmhsY3k1aFpHUnBkR2x2Ym5NdWJHVnVaM1JvSUQwZ01EdGNiaUFnSUNCd1lYUmphR1Z6TG5KbGJXOTJZV3h6TG14bGJtZDBhQ0E5SURBN1hHNGdJSDA3WEc1OVhHNGlYWDA9IiwiXG52YXIgTmF0aXZlQ3VzdG9tRXZlbnQgPSBnbG9iYWwuQ3VzdG9tRXZlbnQ7XG5cbmZ1bmN0aW9uIHVzZU5hdGl2ZSAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHAgPSBuZXcgTmF0aXZlQ3VzdG9tRXZlbnQoJ2NhdCcsIHsgZGV0YWlsOiB7IGZvbzogJ2JhcicgfSB9KTtcbiAgICByZXR1cm4gICdjYXQnID09PSBwLnR5cGUgJiYgJ2JhcicgPT09IHAuZGV0YWlsLmZvbztcbiAgfSBjYXRjaCAoZSkge1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcm9zcy1icm93c2VyIGBDdXN0b21FdmVudGAgY29uc3RydWN0b3IuXG4gKlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50LkN1c3RvbUV2ZW50XG4gKlxuICogQHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdXNlTmF0aXZlKCkgPyBOYXRpdmVDdXN0b21FdmVudCA6XG5cbi8vIElFID49IDlcbidmdW5jdGlvbicgPT09IHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFdmVudCA/IGZ1bmN0aW9uIEN1c3RvbUV2ZW50ICh0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgaWYgKHBhcmFtcykge1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gIH0gZWxzZSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlLCB2b2lkIDApO1xuICB9XG4gIHJldHVybiBlO1xufSA6XG5cbi8vIElFIDw9IDhcbmZ1bmN0aW9uIEN1c3RvbUV2ZW50ICh0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICBlLnR5cGUgPSB0eXBlO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5idWJibGVzID0gQm9vbGVhbihwYXJhbXMuYnViYmxlcyk7XG4gICAgZS5jYW5jZWxhYmxlID0gQm9vbGVhbihwYXJhbXMuY2FuY2VsYWJsZSk7XG4gICAgZS5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICB9IGVsc2Uge1xuICAgIGUuYnViYmxlcyA9IGZhbHNlO1xuICAgIGUuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIGUuZGV0YWlsID0gdm9pZCAwO1xuICB9XG4gIHJldHVybiBlO1xufVxuIl19
