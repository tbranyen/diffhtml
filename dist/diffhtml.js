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

// We export the TransitionStateError constructor so that instanceof checks can
// be made by those publicly consuming this library.

var _errors = require('./errors');

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
    normalizedConstructor = function () {};
    normalizedConstructor.prototype = constructor;
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
      // Release resources to the element.
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
        nodes.removals.map(function (uuid) {
          return _utilPools.pools.elementObject._uuid[uuid];
        }).forEach(_utilMemory.unprotectElement);
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

  var elementMeta = _tree.TreeCache.get(element) || {};

  // Always ensure the most up-to-date meta object is stored.
  _tree.TreeCache.set(element, elementMeta);

  if (elementMeta.isRendering) {
    // Add this new render into the buffer queue.
    elementMeta.renderBuffer = { newHTML: newHTML, options: options };
    return;
  }

  // If the operation is `innerHTML`, but the contents haven't changed, abort.
  var differentInnerHTML = options.inner && element.innerHTML === newHTML;
  // If the operation is `outerHTML`, but the contents haven't changed, abort.
  var differentOuterHTML = !options.inner && element.outerHTML === newHTML;

  // Start with worker being a falsy value.
  var worker = null;

  // If we can use a worker and the user wants one, try and create it.
  if (options.enableWorker && _workerCreate.hasWorker) {
    // Create a worker for this element.
    worker = elementMeta.worker = elementMeta.worker || (0, _workerCreate.create)();
  }

  // And ensure that an `oldTree` exists, otherwise this is the first render
  // potentially.
  if ((differentInnerHTML || differentOuterHTML) && elementMeta.oldTree) {
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

},{"../element/make":3,"../patches/process":10,"../util/memory":14,"../util/parser":15,"../util/pools":16,"../worker/create":18,"./make":6,"./sync":8,"./tree":9,"custom-event":20}],8:[function(require,module,exports){
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
        attr.value = match[5] || match[4] || match[1];

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9lbGVtZW50L2N1c3RvbS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2VsZW1lbnQvZ2V0LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvZWxlbWVudC9tYWtlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvZXJyb3JzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvaW5kZXguanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9ub2RlL21ha2UuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9ub2RlL3BhdGNoLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9zeW5jLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS90cmVlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvcGF0Y2hlcy9wcm9jZXNzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvc3ZnLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdHJhbnNpdGlvbnMuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL2RlY29kZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3V0aWwvbWVtb3J5LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9wYXJzZXIuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL3Bvb2xzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC91dWlkLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvd29ya2VyL2NyZWF0ZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3dvcmtlci9zb3VyY2UuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL25vZGVfbW9kdWxlcy9jdXN0b20tZXZlbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzVVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzVUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDOVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBTdG9yZSBhbGwgY3VzdG9tIGVsZW1lbnRzIGluIHRoaXMgb2JqZWN0LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudXBncmFkZSA9IHVwZ3JhZGU7XG52YXIgY29tcG9uZW50cyA9IHt9O1xuXG5leHBvcnRzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xudmFyIGVtcHR5ID0ge307XG5cbi8qKlxuICogRW5zdXJlcyB0aGUgZWxlbWVudCBpbnN0YW5jZSBtYXRjaGVzIHRoZSBDdXN0b21FbGVtZW50J3MgcHJvdG90eXBlLlxuICpcbiAqIEBwYXJhbSB0YWdOYW1lXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc2Z1bGx5IHVwZ3JhZGVkXG4gKi9cblxuZnVuY3Rpb24gdXBncmFkZSh0YWdOYW1lLCBlbGVtZW50KSB7XG4gIHZhciBDdXN0b21FbGVtZW50ID0gY29tcG9uZW50c1t0YWdOYW1lXSB8fCBlbXB0eTtcblxuICAvLyBObyBuZWVkIHRvIHVwZ3JhZGUgaWYgYWxyZWFkeSBhIHN1YmNsYXNzLlxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBDb3B5IHRoZSBwcm90b3R5cGUgaW50byB0aGUgRWxlbWVudC5cbiAgaWYgKEN1c3RvbUVsZW1lbnQgIT09IGVtcHR5KSB7XG4gICAgZWxlbWVudC5fX3Byb3RvX18gPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVsZW1lbnQucHJvdG90eXBlKTtcbiAgfVxuXG4gIC8vIEN1c3RvbSBlbGVtZW50cyBoYXZlIGEgY3JlYXRlZENhbGxiYWNrIG1ldGhvZCB0aGF0IHNob3VsZCBiZSBjYWxsZWQuXG4gIGlmIChDdXN0b21FbGVtZW50LnByb3RvdHlwZS5jcmVhdGVkQ2FsbGJhY2spIHtcbiAgICBDdXN0b21FbGVtZW50LnByb3RvdHlwZS5jcmVhdGVkQ2FsbGJhY2suY2FsbChlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2WTNWemRHOXRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenRCUVVkUExFbEJRVWtzVlVGQlZTeEhRVUZITEVWQlFVVXNRMEZCUXpzN08wRkJSVE5DTEVsQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096czdPenRCUVZOU0xGTkJRVk1zVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRlRU1zVFVGQlNTeGhRVUZoTEVkQlFVY3NWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6czdPMEZCUjJwRUxFMUJRVWtzVDBGQlR5eFpRVUZaTEdGQlFXRXNSVUZCUlR0QlFVTndReXhYUVVGUExFdEJRVXNzUTBGQlF6dEhRVU5rT3pzN1FVRkhSQ3hOUVVGSkxHRkJRV0VzUzBGQlN5eExRVUZMTEVWQlFVVTdRVUZETTBJc1YwRkJUeXhEUVVGRExGTkJRVk1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMR0ZCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU0xUkRzN08wRkJSMFFzVFVGQlNTeGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMR1ZCUVdVc1JVRkJSVHRCUVVNelF5eHBRa0ZCWVN4RFFVRkRMRk5CUVZNc1EwRkJReXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMGRCUTNaRU96dEJRVVZFTEZOQlFVOHNTVUZCU1N4RFFVRkRPME5CUTJJN08wRkJRVUVzUTBGQlF5SXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOWxiR1Z0Wlc1MEwyTjFjM1J2YlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dVM1J2Y21VZ1lXeHNJR04xYzNSdmJTQmxiR1Z0Wlc1MGN5QnBiaUIwYUdseklHOWlhbVZqZEM1Y2JpQXFMMXh1Wlhod2IzSjBJSFpoY2lCamIyMXdiMjVsYm5SeklEMGdlMzA3WEc1Y2JuWmhjaUJsYlhCMGVTQTlJSHQ5TzF4dVhHNHZLaXBjYmlBcUlFVnVjM1Z5WlhNZ2RHaGxJR1ZzWlcxbGJuUWdhVzV6ZEdGdVkyVWdiV0YwWTJobGN5QjBhR1VnUTNWemRHOXRSV3hsYldWdWRDZHpJSEJ5YjNSdmRIbHdaUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdkR0ZuVG1GdFpWeHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCeVpYUjFjbTRnZTBKdmIyeGxZVzU5SUhOMVkyTmxjM05tZFd4c2VTQjFjR2R5WVdSbFpGeHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnZFhCbmNtRmtaU2gwWVdkT1lXMWxMQ0JsYkdWdFpXNTBLU0I3WEc0Z0lIWmhjaUJEZFhOMGIyMUZiR1Z0Wlc1MElEMGdZMjl0Y0c5dVpXNTBjMXQwWVdkT1lXMWxYU0I4ZkNCbGJYQjBlVHRjYmx4dUlDQXZMeUJPYnlCdVpXVmtJSFJ2SUhWd1ozSmhaR1VnYVdZZ1lXeHlaV0ZrZVNCaElITjFZbU5zWVhOekxseHVJQ0JwWmlBb1pXeGxiV1Z1ZENCcGJuTjBZVzVqWlc5bUlFTjFjM1J2YlVWc1pXMWxiblFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dUlDQXZMeUJEYjNCNUlIUm9aU0J3Y205MGIzUjVjR1VnYVc1MGJ5QjBhR1VnUld4bGJXVnVkQzVjYmlBZ2FXWWdLRU4xYzNSdmJVVnNaVzFsYm5RZ0lUMDlJR1Z0Y0hSNUtTQjdYRzRnSUNBZ1pXeGxiV1Z1ZEM1ZlgzQnliM1J2WDE4Z1BTQlBZbXBsWTNRdVkzSmxZWFJsS0VOMWMzUnZiVVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxLVHRjYmlBZ2ZWeHVYRzRnSUM4dklFTjFjM1J2YlNCbGJHVnRaVzUwY3lCb1lYWmxJR0VnWTNKbFlYUmxaRU5oYkd4aVlXTnJJRzFsZEdodlpDQjBhR0YwSUhOb2IzVnNaQ0JpWlNCallXeHNaV1F1WEc0Z0lHbG1JQ2hEZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWpjbVZoZEdWa1EyRnNiR0poWTJzcElIdGNiaUFnSUNCRGRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVmtRMkZzYkdKaFkyc3VZMkZzYkNobGJHVnRaVzUwS1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCMGNuVmxPMXh1ZlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdldDtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX25vZGVNYWtlID0gcmVxdWlyZSgnLi4vbm9kZS9tYWtlJyk7XG5cbnZhciBfbm9kZU1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZU1ha2UpO1xuXG52YXIgX2VsZW1lbnRNYWtlID0gcmVxdWlyZSgnLi4vZWxlbWVudC9tYWtlJyk7XG5cbnZhciBfZWxlbWVudE1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudE1ha2UpO1xuXG4vKipcbiAqIFRha2VzIGluIGFuIGVsZW1lbnQgcmVmZXJlbmNlIGFuZCByZXNvbHZlIGl0IHRvIGEgdXVpZCBhbmQgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIHJlZiAtIEVsZW1lbnQgZGVzY3JpcHRvclxuICogQHJldHVybiB7T2JqZWN0fSBjb250YWluaW5nIHRoZSB1dWlkIGFuZCBET00gbm9kZS5cbiAqL1xuXG5mdW5jdGlvbiBnZXQocmVmKSB7XG4gIHZhciB1dWlkID0gcmVmLmVsZW1lbnQgfHwgcmVmO1xuICB2YXIgZWxlbWVudCA9IF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1t1dWlkXSB8fCAoMCwgX2VsZW1lbnRNYWtlMlsnZGVmYXVsdCddKShyZWYpO1xuXG4gIHJldHVybiB7IGVsZW1lbnQ6IGVsZW1lbnQsIHV1aWQ6IHV1aWQgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2WjJWMExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzNGQ1FWTjNRaXhIUVVGSE96czdPM2RDUVZST0xHTkJRV003T3pzN01rSkJRMWdzYVVKQlFXbENPenM3T3pzN096czdPenRCUVZFeFFpeFRRVUZUTEVkQlFVY3NRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRMMElzVFVGQlNTeEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRTlCUVU4c1NVRkJTU3hIUVVGSExFTkJRVU03UVVGRE9VSXNUVUZCU1N4UFFVRlBMRWRCUVVjc2MwSkJRVk1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRGhDUVVGWkxFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVjJSQ3hUUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZRTEU5QlFVOHNSVUZCUlN4SlFVRkpMRVZCUVVvc1NVRkJTU3hGUVVGRkxFTkJRVU03UTBGRE1VSWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZaV3hsYldWdWRDOW5aWFF1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ2JXRnJaVTV2WkdVZ1puSnZiU0FuTGk0dmJtOWtaUzl0WVd0bEp6dGNibWx0Y0c5eWRDQnRZV3RsUld4bGJXVnVkQ0JtY205dElDY3VMaTlsYkdWdFpXNTBMMjFoYTJVbk8xeHVYRzR2S2lwY2JpQXFJRlJoYTJWeklHbHVJR0Z1SUdWc1pXMWxiblFnY21WbVpYSmxibU5sSUdGdVpDQnlaWE52YkhabElHbDBJSFJ2SUdFZ2RYVnBaQ0JoYm1RZ1JFOU5JRzV2WkdVdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUhKbFppQXRJRVZzWlcxbGJuUWdaR1Z6WTNKcGNIUnZjbHh1SUNvZ1FISmxkSFZ5YmlCN1QySnFaV04wZlNCamIyNTBZV2x1YVc1bklIUm9aU0IxZFdsa0lHRnVaQ0JFVDAwZ2JtOWtaUzVjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z1oyVjBLSEpsWmlrZ2UxeHVJQ0JzWlhRZ2RYVnBaQ0E5SUhKbFppNWxiR1Z0Wlc1MElIeDhJSEpsWmp0Y2JpQWdiR1YwSUdWc1pXMWxiblFnUFNCdFlXdGxUbTlrWlM1dWIyUmxjMXQxZFdsa1hTQjhmQ0J0WVd0bFJXeGxiV1Z1ZENoeVpXWXBPMXh1WEc0Z0lISmxkSFZ5YmlCN0lHVnNaVzFsYm5Rc0lIVjFhV1FnZlR0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYWtlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmpbJ2RlZmF1bHQnXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbnZhciBfc3ZnID0gcmVxdWlyZSgnLi4vc3ZnJyk7XG5cbnZhciBzdmcgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfc3ZnKTtcblxudmFyIF9ub2RlTWFrZSA9IHJlcXVpcmUoJy4uL25vZGUvbWFrZScpO1xuXG52YXIgX25vZGVNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVNYWtlKTtcblxudmFyIF9jdXN0b20gPSByZXF1aXJlKCcuL2N1c3RvbScpO1xuXG52YXIgZW1wdHkgPSB7IHByb3RvdHlwZToge30gfTtcblxuLyoqXG4gKiBUYWtlcyBpbiBhIHZpcnR1YWwgZGVzY3JpcHRvciBhbmQgY3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQuIFNldCdzIHRoZSBlbGVtZW50XG4gKiBpbnRvIHRoZSBjYWNoZS5cbiAqXG4gKiBAcGFyYW0gZGVzY3JpcHRvclxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlKGRlc2NyaXB0b3IpIHtcbiAgdmFyIGVsZW1lbnQgPSBudWxsO1xuICB2YXIgaXNTdmcgPSBmYWxzZTtcbiAgLy8gR2V0IHRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvciBmb3IgYSBnaXZlbiBlbGVtZW50LlxuICB2YXIgQ3VzdG9tRWxlbWVudCA9IF9jdXN0b20uY29tcG9uZW50c1tkZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICBpZiAoX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW2Rlc2NyaXB0b3IuZWxlbWVudF0pIHtcbiAgICByZXR1cm4gX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW2Rlc2NyaXB0b3IuZWxlbWVudF07XG4gIH1cblxuICBpZiAoZGVzY3JpcHRvci5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkZXNjcmlwdG9yLm5vZGVWYWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHN2Zy5lbGVtZW50cy5pbmRleE9mKGRlc2NyaXB0b3Iubm9kZU5hbWUpID4gLTEpIHtcbiAgICAgIGlzU3ZnID0gdHJ1ZTtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnLm5hbWVzcGFjZSwgZGVzY3JpcHRvci5ub2RlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRlc2NyaXB0b3Iubm9kZU5hbWUpO1xuICAgIH1cblxuICAgIGlmIChkZXNjcmlwdG9yLmF0dHJpYnV0ZXMgJiYgZGVzY3JpcHRvci5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXNjcmlwdG9yLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IGRlc2NyaXB0b3IuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0b3IuY2hpbGROb2RlcyAmJiBkZXNjcmlwdG9yLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlc2NyaXB0b3IuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG1ha2UoZGVzY3JpcHRvci5jaGlsZE5vZGVzW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWx3YXlzIHNldCB0aGUgbm9kZSdzIHZhbHVlLlxuICBpZiAoZGVzY3JpcHRvci5ub2RlVmFsdWUpIHtcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gZGVzY3JpcHRvci5ub2RlVmFsdWU7XG4gIH1cblxuICAvLyBDdXN0b20gZWxlbWVudHMgaGF2ZSBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QgdGhhdCBzaG91bGQgYmUgY2FsbGVkLlxuICBpZiAoQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlZENhbGxiYWNrKSB7XG4gICAgQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlZENhbGxiYWNrLmNhbGwoZWxlbWVudCk7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIG5vZGVzIGNhY2hlIHVzaW5nIHRoZSBkZXNpZ25hdGVkIHV1aWQgYXMgdGhlIGxvb2t1cCBrZXkuXG4gIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tkZXNjcmlwdG9yLmVsZW1lbnRdID0gZWxlbWVudDtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2YldGclpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRmhkMElzU1VGQlNUczdPenM3TzIxQ1FXSlFMRkZCUVZFN08wbEJRV3BDTEVkQlFVYzdPM2RDUVVOTkxHTkJRV003T3pzN2MwSkJRMUlzVlVGQlZUczdRVUZGY2tNc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeFRRVUZUTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN096czdPenM3T3pzN1FVRlRaaXhUUVVGVExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVTdRVUZEZGtNc1RVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyNUNMRTFCUVVrc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6czdRVUZGYkVJc1RVRkJTU3hoUVVGaExFZEJRVWNzYlVKQlFWY3NWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6czdRVUZGTjBRc1RVRkJTU3h6UWtGQlV5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8wRkJRM1JETEZkQlFVOHNjMEpCUVZNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SFFVTXpRenM3UVVGRlJDeE5RVUZKTEZWQlFWVXNRMEZCUXl4UlFVRlJMRXRCUVVzc1QwRkJUeXhGUVVGRk8wRkJRMjVETEZkQlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNc1kwRkJZeXhEUVVGRExGVkJRVlVzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTjZSQ3hOUVVOSk8wRkJRMGdzVVVGQlNTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRVZCUVVVN1FVRkRiRVFzVjBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTmlMR0ZCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1zWlVGQlpTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzB0QlEzaEZMRTFCUTBrN1FVRkRTQ3hoUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UzBGRGRrUTdPMEZCUlVRc1VVRkJTU3hWUVVGVkxFTkJRVU1zVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM3BFTEZkQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU55UkN4WlFVRkpMRk5CUVZNc1IwRkJSeXhWUVVGVkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNwRExHVkJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdUMEZEZGtRN1MwRkRSanM3UVVGRlJDeFJRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRWxCUVVrc1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEZWtRc1YwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNKRUxHVkJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTNKRU8wdEJRMFk3UjBGRFJqczdPMEZCUjBRc1RVRkJTU3hWUVVGVkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEzaENMRmRCUVU4c1EwRkJReXhYUVVGWExFZEJRVWNzVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXp0SFFVTTFRenM3TzBGQlIwUXNUVUZCU1N4aFFVRmhMRU5CUVVNc1UwRkJVeXhEUVVGRExHVkJRV1VzUlVGQlJUdEJRVU16UXl4cFFrRkJZU3hEUVVGRExGTkJRVk1zUTBGQlF5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wZEJRM1pFT3pzN1FVRkhSQ3gzUWtGQlV5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF6czdRVUZGTjBNc1UwRkJUeXhQUVVGUExFTkJRVU03UTBGRGFFSWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZaV3hsYldWdWRDOXRZV3RsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElDb2dZWE1nYzNabklHWnliMjBnSnk0dUwzTjJaeWM3WEc1cGJYQnZjblFnYldGclpVNXZaR1VnWm5KdmJTQW5MaTR2Ym05a1pTOXRZV3RsSnp0Y2JtbHRjRzl5ZENCN0lHTnZiWEJ2Ym1WdWRITWdmU0JtY205dElDY3VMMk4xYzNSdmJTYzdYRzVjYm5aaGNpQmxiWEIwZVNBOUlIc2djSEp2ZEc5MGVYQmxPaUI3ZlNCOU8xeHVYRzR2S2lwY2JpQXFJRlJoYTJWeklHbHVJR0VnZG1seWRIVmhiQ0JrWlhOamNtbHdkRzl5SUdGdVpDQmpjbVZoZEdWeklHRnVJRWhVVFV3Z1pXeGxiV1Z1ZEM0Z1UyVjBKM01nZEdobElHVnNaVzFsYm5SY2JpQXFJR2x1ZEc4Z2RHaGxJR05oWTJobExseHVJQ3BjYmlBcUlFQndZWEpoYlNCa1pYTmpjbWx3ZEc5eVhHNGdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh1SUNvdlhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlCdFlXdGxLR1JsYzJOeWFYQjBiM0lwSUh0Y2JpQWdkbUZ5SUdWc1pXMWxiblFnUFNCdWRXeHNPMXh1SUNCMllYSWdhWE5UZG1jZ1BTQm1ZV3h6WlR0Y2JpQWdMeThnUjJWMElIUm9aU0JqZFhOMGIyMGdaV3hsYldWdWRDQmpiMjV6ZEhKMVkzUnZjaUJtYjNJZ1lTQm5hWFpsYmlCbGJHVnRaVzUwTGx4dUlDQjJZWElnUTNWemRHOXRSV3hsYldWdWRDQTlJR052YlhCdmJtVnVkSE5iWkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlYwZ2ZId2daVzF3ZEhrN1hHNWNiaUFnYVdZZ0tHMWhhMlZPYjJSbExtNXZaR1Z6VzJSbGMyTnlhWEIwYjNJdVpXeGxiV1Z1ZEYwcElIdGNiaUFnSUNCeVpYUjFjbTRnYldGclpVNXZaR1V1Ym05a1pYTmJaR1Z6WTNKcGNIUnZjaTVsYkdWdFpXNTBYVHRjYmlBZ2ZWeHVYRzRnSUdsbUlDaGtaWE5qY21sd2RHOXlMbTV2WkdWT1lXMWxJRDA5UFNBbkkzUmxlSFFuS1NCN1hHNGdJQ0FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVlJsZUhST2IyUmxLR1JsYzJOeWFYQjBiM0l1Ym05a1pWWmhiSFZsS1R0Y2JpQWdmVnh1SUNCbGJITmxJSHRjYmlBZ0lDQnBaaUFvYzNabkxtVnNaVzFsYm5SekxtbHVaR1Y0VDJZb1pHVnpZM0pwY0hSdmNpNXViMlJsVG1GdFpTa2dQaUF0TVNrZ2UxeHVJQ0FnSUNBZ2FYTlRkbWNnUFNCMGNuVmxPMXh1SUNBZ0lDQWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5ST1V5aHpkbWN1Ym1GdFpYTndZV05sTENCa1pYTmpjbWx3ZEc5eUxtNXZaR1ZPWVcxbEtUdGNiaUFnSUNCOVhHNGdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQmxiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENoa1pYTmpjbWx3ZEc5eUxtNXZaR1ZPWVcxbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9aR1Z6WTNKcGNIUnZjaTVoZEhSeWFXSjFkR1Z6SUNZbUlHUmxjMk55YVhCMGIzSXVZWFIwY21saWRYUmxjeTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnWkdWelkzSnBjSFJ2Y2k1aGRIUnlhV0oxZEdWekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQmhkSFJ5YVdKMWRHVWdQU0JrWlhOamNtbHdkRzl5TG1GMGRISnBZblYwWlhOYmFWMDdYRzRnSUNBZ0lDQWdJR1ZzWlcxbGJuUXVjMlYwUVhSMGNtbGlkWFJsS0dGMGRISnBZblYwWlM1dVlXMWxMQ0JoZEhSeWFXSjFkR1V1ZG1Gc2RXVXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2hrWlhOamNtbHdkRzl5TG1Ob2FXeGtUbTlrWlhNZ0ppWWdaR1Z6WTNKcGNIUnZjaTVqYUdsc1pFNXZaR1Z6TG14bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCa1pYTmpjbWx3ZEc5eUxtTm9hV3hrVG05a1pYTXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ1pXeGxiV1Z1ZEM1aGNIQmxibVJEYUdsc1pDaHRZV3RsS0dSbGMyTnlhWEIwYjNJdVkyaHBiR1JPYjJSbGMxdHBYU2twTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4dklFRnNkMkY1Y3lCelpYUWdkR2hsSUc1dlpHVW5jeUIyWVd4MVpTNWNiaUFnYVdZZ0tHUmxjMk55YVhCMGIzSXVibTlrWlZaaGJIVmxLU0I3WEc0Z0lDQWdaV3hsYldWdWRDNTBaWGgwUTI5dWRHVnVkQ0E5SUdSbGMyTnlhWEIwYjNJdWJtOWtaVlpoYkhWbE8xeHVJQ0I5WEc1Y2JpQWdMeThnUTNWemRHOXRJR1ZzWlcxbGJuUnpJR2hoZG1VZ1lTQmpjbVZoZEdWa1EyRnNiR0poWTJzZ2JXVjBhRzlrSUhSb1lYUWdjMmh2ZFd4a0lHSmxJR05oYkd4bFpDNWNiaUFnYVdZZ0tFTjFjM1J2YlVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTG1OeVpXRjBaV1JEWVd4c1ltRmpheWtnZTF4dUlDQWdJRU4xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtTnlaV0YwWldSRFlXeHNZbUZqYXk1allXeHNLR1ZzWlcxbGJuUXBPMXh1SUNCOVhHNWNiaUFnTHk4Z1FXUmtJSFJ2SUhSb1pTQnViMlJsY3lCallXTm9aU0IxYzJsdVp5QjBhR1VnWkdWemFXZHVZWFJsWkNCMWRXbGtJR0Z6SUhSb1pTQnNiMjlyZFhBZ2EyVjVMbHh1SUNCdFlXdGxUbTlrWlM1dWIyUmxjMXRrWlhOamNtbHdkRzl5TG1Wc1pXMWxiblJkSUQwZ1pXeGxiV1Z1ZER0Y2JseHVJQ0J5WlhSMWNtNGdaV3hsYldWdWREdGNibjFjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHsgdmFyIF9hZ2FpbiA9IHRydWU7IF9mdW5jdGlvbjogd2hpbGUgKF9hZ2FpbikgeyB2YXIgb2JqZWN0ID0gX3gsIHByb3BlcnR5ID0gX3gyLCByZWNlaXZlciA9IF94MzsgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDsgX2FnYWluID0gZmFsc2U7IGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyBfeCA9IHBhcmVudDsgX3gyID0gcHJvcGVydHk7IF94MyA9IHJlY2VpdmVyOyBfYWdhaW4gPSB0cnVlOyBjb250aW51ZSBfZnVuY3Rpb247IH0gfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgbWlzc2luZ1N0YWNrVHJhY2UgPSAnQnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBlcnJvciBzdGFjayB0cmFjZXMuJztcblxuLyoqXG4gKiBJZGVudGlmaWVzIGFuIGVycm9yIHdpdGggdHJhbnNpdGlvbnMuXG4gKi9cblxudmFyIFRyYW5zaXRpb25TdGF0ZUVycm9yID0gKGZ1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzKFRyYW5zaXRpb25TdGF0ZUVycm9yLCBfRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIFRyYW5zaXRpb25TdGF0ZUVycm9yKG1lc3NhZ2UpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNpdGlvblN0YXRlRXJyb3IpO1xuXG4gICAgdmFyIGVycm9yID0gX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoVHJhbnNpdGlvblN0YXRlRXJyb3IucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrIHx8IG1pc3NpbmdTdGFja1RyYWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXMgYW4gZXJyb3Igd2l0aCByZWdpc3RlcmluZyBhbiBlbGVtZW50LlxuICAgKi9cbiAgcmV0dXJuIFRyYW5zaXRpb25TdGF0ZUVycm9yO1xufSkoRXJyb3IpO1xuXG5leHBvcnRzLlRyYW5zaXRpb25TdGF0ZUVycm9yID0gVHJhbnNpdGlvblN0YXRlRXJyb3I7XG5cbnZhciBET01FeGNlcHRpb24gPSAoZnVuY3Rpb24gKF9FcnJvcjIpIHtcbiAgX2luaGVyaXRzKERPTUV4Y2VwdGlvbiwgX0Vycm9yMik7XG5cbiAgZnVuY3Rpb24gRE9NRXhjZXB0aW9uKG1lc3NhZ2UpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRE9NRXhjZXB0aW9uKTtcblxuICAgIHZhciBlcnJvciA9IF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKERPTUV4Y2VwdGlvbi5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5tZXNzYWdlID0gJ1VuY2F1Z2h0IERPTUV4Y2VwdGlvbjogJyArIG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrIHx8IG1pc3NpbmdTdGFja1RyYWNlO1xuICB9XG5cbiAgcmV0dXJuIERPTUV4Y2VwdGlvbjtcbn0pKEVycm9yKTtcblxuZXhwb3J0cy5ET01FeGNlcHRpb24gPSBET01FeGNlcHRpb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWeWNtOXljeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN1FVRkJRU3hKUVVGSkxHbENRVUZwUWl4SFFVRkhMRGhEUVVFNFF5eERRVUZET3pzN096czdTVUZMTVVRc2IwSkJRVzlDTzFsQlFYQkNMRzlDUVVGdlFqczdRVUZEY0VJc1YwRkVRU3h2UWtGQmIwSXNRMEZEYmtJc1QwRkJUeXhGUVVGRk96QkNRVVJXTEc5Q1FVRnZRanM3UVVGRk4wSXNVVUZCU1N4TFFVRkxMRGhDUVVaQkxHOUNRVUZ2UWl3MFEwRkZWaXhEUVVGRE96dEJRVVZ3UWl4UlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF6dEJRVU4yUWl4UlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF5eExRVUZMTEVsQlFVa3NhVUpCUVdsQ0xFTkJRVU03UjBGREwwTTdPenM3TzFOQlRsVXNiMEpCUVc5Q08wZEJRVk1zUzBGQlN6czdPenRKUVZsc1F5eFpRVUZaTzFsQlFWb3NXVUZCV1RzN1FVRkRXaXhYUVVSQkxGbEJRVmtzUTBGRFdDeFBRVUZQTEVWQlFVVTdNRUpCUkZZc1dVRkJXVHM3UVVGRmNrSXNVVUZCU1N4TFFVRkxMRGhDUVVaQkxGbEJRVmtzTkVOQlJVWXNRMEZCUXpzN1FVRkZjRUlzVVVGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4NVFrRkJlVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTTdRVUZEYmtRc1VVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTXNTMEZCU3l4SlFVRkpMR2xDUVVGcFFpeERRVUZETzBkQlF5OURPenRUUVU1VkxGbEJRVms3UjBGQlV5eExRVUZMSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWeWNtOXljeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJ0YVhOemFXNW5VM1JoWTJ0VWNtRmpaU0E5SUNkQ2NtOTNjMlZ5SUdSdlpYTnVYRnduZENCemRYQndiM0owSUdWeWNtOXlJSE4wWVdOcklIUnlZV05sY3k0bk8xeHVYRzR2S2lwY2JpQXFJRWxrWlc1MGFXWnBaWE1nWVc0Z1pYSnliM0lnZDJsMGFDQjBjbUZ1YzJsMGFXOXVjeTVjYmlBcUwxeHVaWGh3YjNKMElHTnNZWE56SUZSeVlXNXphWFJwYjI1VGRHRjBaVVZ5Y205eUlHVjRkR1Z1WkhNZ1JYSnliM0lnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjaWh0WlhOellXZGxLU0I3WEc0Z0lDQWdiR1YwSUdWeWNtOXlJRDBnYzNWd1pYSW9LVHRjYmx4dUlDQWdJSFJvYVhNdWJXVnpjMkZuWlNBOUlHMWxjM05oWjJVN1hHNGdJQ0FnZEdocGN5NXpkR0ZqYXlBOUlHVnljbTl5TG5OMFlXTnJJSHg4SUcxcGMzTnBibWRUZEdGamExUnlZV05sTzF4dUlDQjlYRzU5WEc1Y2JpOHFLbHh1SUNvZ1NXUmxiblJwWm1sbGN5QmhiaUJsY25KdmNpQjNhWFJvSUhKbFoybHpkR1Z5YVc1bklHRnVJR1ZzWlcxbGJuUXVYRzRnS2k5Y2JtVjRjRzl5ZENCamJHRnpjeUJFVDAxRmVHTmxjSFJwYjI0Z1pYaDBaVzVrY3lCRmNuSnZjaUI3WEc0Z0lHTnZibk4wY25WamRHOXlLRzFsYzNOaFoyVXBJSHRjYmlBZ0lDQnNaWFFnWlhKeWIzSWdQU0J6ZFhCbGNpZ3BPMXh1WEc0Z0lDQWdkR2hwY3k1dFpYTnpZV2RsSUQwZ0oxVnVZMkYxWjJoMElFUlBUVVY0WTJWd2RHbHZiam9nSnlBcklHMWxjM05oWjJVN1hHNGdJQ0FnZEdocGN5NXpkR0ZqYXlBOUlHVnljbTl5TG5OMFlXTnJJSHg4SUcxcGMzTnBibWRUZEdGamExUnlZV05sTzF4dUlDQjlYRzU5WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5vdXRlckhUTUwgPSBvdXRlckhUTUw7XG5leHBvcnRzLmlubmVySFRNTCA9IGlubmVySFRNTDtcbmV4cG9ydHMuZWxlbWVudCA9IGVsZW1lbnQ7XG5leHBvcnRzLnJlbGVhc2UgPSByZWxlYXNlO1xuZXhwb3J0cy5yZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckVsZW1lbnQ7XG5leHBvcnRzLmFkZFRyYW5zaXRpb25TdGF0ZSA9IGFkZFRyYW5zaXRpb25TdGF0ZTtcbmV4cG9ydHMucmVtb3ZlVHJhbnNpdGlvblN0YXRlID0gcmVtb3ZlVHJhbnNpdGlvblN0YXRlO1xuZXhwb3J0cy5lbmFibGVQcm9sbHlmaWxsID0gZW5hYmxlUHJvbGx5ZmlsbDtcblxudmFyIF9ub2RlUGF0Y2ggPSByZXF1aXJlKCcuL25vZGUvcGF0Y2gnKTtcblxudmFyIF90cmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMnKTtcblxudmFyIF9lbGVtZW50Q3VzdG9tID0gcmVxdWlyZSgnLi9lbGVtZW50L2N1c3RvbScpO1xuXG4vLyBXZSBleHBvcnQgdGhlIFRyYW5zaXRpb25TdGF0ZUVycm9yIGNvbnN0cnVjdG9yIHNvIHRoYXQgaW5zdGFuY2VvZiBjaGVja3MgY2FuXG4vLyBiZSBtYWRlIGJ5IHRob3NlIHB1YmxpY2x5IGNvbnN1bWluZyB0aGlzIGxpYnJhcnkuXG5cbnZhciBfZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdUcmFuc2l0aW9uU3RhdGVFcnJvcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3I7XG4gIH1cbn0pO1xuXG52YXIgcmVhbFJlZ2lzdGVyRWxlbWVudCA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudDtcbnZhciBlbXB0eSA9IHt9O1xuXG4vKipcbiAqIFVzZWQgdG8gZGlmZiB0aGUgb3V0ZXJIVE1MIGNvbnRlbnRzIG9mIHRoZSBwYXNzZWQgZWxlbWVudCB3aXRoIHRoZSBtYXJrdXBcbiAqIGNvbnRlbnRzLiAgVmVyeSB1c2VmdWwgZm9yIGFwcGx5aW5nIGEgZ2xvYmFsIGRpZmYgb24gdGhlXG4gKiBgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50YC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG1hcmt1cD0nJ1xuICogQHBhcmFtIG9wdGlvbnM9e31cbiAqL1xuXG5mdW5jdGlvbiBvdXRlckhUTUwoZWxlbWVudCkge1xuICB2YXIgbWFya3VwID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gJycgOiBhcmd1bWVudHNbMV07XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgb3B0aW9ucy5pbm5lciA9IGZhbHNlO1xuICAoMCwgX25vZGVQYXRjaC5wYXRjaE5vZGUpKGVsZW1lbnQsIG1hcmt1cCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogVXNlZCB0byBkaWZmIHRoZSBpbm5lckhUTUwgY29udGVudHMgb2YgdGhlIHBhc3NlZCBlbGVtZW50IHdpdGggdGhlIG1hcmt1cFxuICogY29udGVudHMuICBUaGlzIGlzIHVzZWZ1bCB3aXRoIGxpYnJhcmllcyBsaWtlIEJhY2tib25lIHRoYXQgcmVuZGVyIFZpZXdzXG4gKiBpbnRvIGVsZW1lbnQgY29udGFpbmVyLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbWFya3VwPScnXG4gKiBAcGFyYW0gb3B0aW9ucz17fVxuICovXG5cbmZ1bmN0aW9uIGlubmVySFRNTChlbGVtZW50KSB7XG4gIHZhciBtYXJrdXAgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1sxXTtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1syXTtcblxuICBvcHRpb25zLmlubmVyID0gdHJ1ZTtcbiAgKDAsIF9ub2RlUGF0Y2gucGF0Y2hOb2RlKShlbGVtZW50LCBtYXJrdXAsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gZGlmZiB0d28gZWxlbWVudHMuICBUaGUgYGlubmVyYCBCb29sZWFuIHByb3BlcnR5IGNhbiBiZSBzcGVjaWZpZWQgaW5cbiAqIHRoZSBvcHRpb25zIHRvIHNldCBpbm5lckhUTUxcXG91dGVySFRNTCBiZWhhdmlvci4gIEJ5IGRlZmF1bHQgaXQgaXNcbiAqIG91dGVySFRNTC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG5ld0VsZW1lbnRcbiAqIEBwYXJhbSBvcHRpb25zPXt9XG4gKi9cblxuZnVuY3Rpb24gZWxlbWVudChlbGVtZW50LCBuZXdFbGVtZW50KSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgKDAsIF9ub2RlUGF0Y2gucGF0Y2hOb2RlKShlbGVtZW50LCBuZXdFbGVtZW50LCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBSZWxlYXNlcyB0aGUgd29ya2VyIGFuZCBtZW1vcnkgYWxsb2NhdGVkIHRvIHRoaXMgZWxlbWVudC4gVXNlZnVsIGZvclxuICogY29tcG9uZW50cyB0byBjbGVhbiB1cCB3aGVuIHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiByZWxlYXNlKGVsZW1lbnQpIHtcbiAgKDAsIF9ub2RlUGF0Y2gucmVsZWFzZU5vZGUpKGVsZW1lbnQpO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVyJ3MgYSBjb25zdHJ1Y3RvciB3aXRoIGFuIGVsZW1lbnQgdG8gcHJvdmlkZSBsaWZlY3ljbGUgZXZlbnRzLlxuICpcbiAqIEBwYXJhbSB0YWdOYW1lXG4gKiBAcGFyYW0gY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiByZWdpc3RlckVsZW1lbnQodGFnTmFtZSwgY29uc3RydWN0b3IpIHtcbiAgLy8gVXBncmFkZSBzaW1wbGUgb2JqZWN0cyB0byBpbmhlcml0IGZyb20gSFRNTEVsZW1lbnQgYW5kIGJlIHVzYWJsZSBpbiBhIHJlYWxcbiAgLy8gaW1wbGVtZW50YXRpb24uXG4gIHZhciBub3JtYWxpemVkQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPyBjb25zdHJ1Y3RvciA6IG51bGw7XG5cbiAgaWYgKCFub3JtYWxpemVkQ29uc3RydWN0b3IpIHtcbiAgICBjb25zdHJ1Y3Rvci5fX3Byb3RvX18gPSBIVE1MRWxlbWVudC5wcm90b3R5cGU7XG4gICAgbm9ybWFsaXplZENvbnN0cnVjdG9yID0geyBwcm90b3R5cGU6IGNvbnN0cnVjdG9yIH07XG4gIH1cblxuICAvLyBJZiB0aGUgbmF0aXZlIHdlYiBjb21wb25lbnQgc3BlY2lmaWNhdGlvbiBpcyBsb2FkZWQsIHVzZSB0aGF0IGluc3RlYWQuXG4gIGlmIChyZWFsUmVnaXN0ZXJFbGVtZW50KSB7XG4gICAgcmV0dXJuIHJlYWxSZWdpc3RlckVsZW1lbnQuY2FsbChkb2N1bWVudCwgdGFnTmFtZSwgbm9ybWFsaXplZENvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCwgcmFpc2UgYW4gZXJyb3IuXG4gIGlmICh0YWdOYW1lIGluIF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHMpIHtcbiAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKCdcXG4gICAgICBGYWlsZWQgdG8gZXhlY3V0ZSBcXCdyZWdpc3RlckVsZW1lbnRcXCcgb24gXFwnRG9jdW1lbnRcXCc6IFJlZ2lzdHJhdGlvbiBmYWlsZWRcXG4gICAgICBmb3IgdHlwZSBcXCcnICsgdGFnTmFtZSArICdcXCcuIEEgdHlwZSB3aXRoIHRoYXQgbmFtZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQuXFxuICAgICcpO1xuICB9XG5cbiAgLy8gQXNzaWduIHRoZSBjdXN0b20gZWxlbWVudCByZWZlcmVuY2UgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW3RhZ05hbWVdID0gbm9ybWFsaXplZENvbnN0cnVjdG9yO1xufVxuXG4vKipcbiAqIEFkZHMgYSBnbG9iYWwgdHJhbnNpdGlvbiBsaXN0ZW5lci4gIFdpdGggbWFueSBlbGVtZW50cyB0aGlzIGNvdWxkIGJlIGFuXG4gKiBleHBlbnNpdmUgb3BlcmF0aW9uLCBzbyB0cnkgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBsaXN0ZW5lcnMgYWRkZWQgaWYgeW91J3JlXG4gKiBjb25jZXJuZWQgYWJvdXQgcGVyZm9ybWFuY2UuXG4gKlxuICogU2luY2UgdGhlIGNhbGxiYWNrIHRyaWdnZXJzIHdpdGggdmFyaW91cyBlbGVtZW50cywgbW9zdCBvZiB3aGljaCB5b3VcbiAqIHByb2JhYmx5IGRvbid0IGNhcmUgYWJvdXQsIHlvdSdsbCB3YW50IHRvIGZpbHRlci4gIEEgZ29vZCB3YXkgb2YgZmlsdGVyaW5nXG4gKiBpcyB0byB1c2UgdGhlIERPTSBgbWF0Y2hlc2AgbWV0aG9kLiAgSXQncyBmYWlybHkgd2VsbCBzdXBwb3J0ZWRcbiAqIChodHRwOi8vY2FuaXVzZS5jb20vI2ZlYXQ9bWF0Y2hlc3NlbGVjdG9yKSBhbmQgbWF5IHN1aXQgbWFueSBwcm9qZWN0cy4gIElmXG4gKiB5b3UgbmVlZCBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgY29uc2lkZXIgdXNpbmcgalF1ZXJ5J3MgYGlzYC5cbiAqXG4gKiBZb3UgY2FuIGRvIGZ1biwgaGlnaGx5IHNwZWNpZmljLCBmaWx0ZXJzOlxuICpcbiAqIGFkZFRyYW5zaXRpb25TdGF0ZSgnYXR0YWNoZWQnLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gKiAgIC8vIEZhZGUgaW4gdGhlIG1haW4gY29udGFpbmVyIGFmdGVyIGl0J3MgYWRkZWQuXG4gKiAgIGlmIChlbGVtZW50Lm1hdGNoZXMoJ2JvZHkgbWFpbi5jb250YWluZXInKSkge1xuICogICAgICQoZWxlbWVudCkuc3RvcCh0cnVlLCB0cnVlKS5mYWRlSW4oKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogQHBhcmFtIHN0YXRlIC0gU3RyaW5nIG5hbWUgdGhhdCBtYXRjaGVzIHdoYXQncyBhdmFpbGFibGUgaW4gdGhlXG4gKiBkb2N1bWVudGF0aW9uIGFib3ZlLlxuICogQHBhcmFtIGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gcmVjZWl2ZSB0aGUgbWF0Y2hpbmcgZWxlbWVudHMuXG4gKi9cblxuZnVuY3Rpb24gYWRkVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoIXN0YXRlKSB7XG4gICAgdGhyb3cgbmV3IF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3IoJ01pc3NpbmcgdHJhbnNpdGlvbiBzdGF0ZSBuYW1lJyk7XG4gIH1cblxuICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3IoJ01pc3NpbmcgdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFjaycpO1xuICB9XG5cbiAgLy8gTm90IGEgdmFsaWQgc3RhdGUgbmFtZS5cbiAgaWYgKE9iamVjdC5rZXlzKF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzKS5pbmRleE9mKHN0YXRlKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgX2Vycm9ycy5UcmFuc2l0aW9uU3RhdGVFcnJvcignSW52YWxpZCBzdGF0ZSBuYW1lOiAnICsgc3RhdGUpO1xuICB9XG5cbiAgX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLnB1c2goY2FsbGJhY2spO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYSBnbG9iYWwgdHJhbnNpdGlvbiBsaXN0ZW5lci5cbiAqXG4gKiBXaGVuIGludm9rZWQgd2l0aCBubyBhcmd1bWVudHMsIHRoaXMgbWV0aG9kIHdpbGwgcmVtb3ZlIGFsbCB0cmFuc2l0aW9uXG4gKiBjYWxsYmFja3MuICBXaGVuIGludm9rZWQgd2l0aCB0aGUgbmFtZSBhcmd1bWVudCBpdCB3aWxsIHJlbW92ZSBhbGxcbiAqIHRyYW5zaXRpb24gc3RhdGUgY2FsbGJhY2tzIG1hdGNoaW5nIHRoZSBuYW1lLCBhbmQgc28gb24gZm9yIHRoZSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0gc3RhdGUgLSBTdHJpbmcgbmFtZSB0aGF0IG1hdGNoZXMgd2hhdCdzIGF2YWlsYWJsZSBpbiB0aGVcbiAqIGRvY3VtZW50YXRpb24gYWJvdmUuXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZWNlaXZlIHRoZSBtYXRjaGluZyBlbGVtZW50cy5cbiAqL1xuXG5mdW5jdGlvbiByZW1vdmVUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gIGlmICghY2FsbGJhY2sgJiYgc3RhdGUpIHtcbiAgICBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlc1tzdGF0ZV0ubGVuZ3RoID0gMDtcbiAgfSBlbHNlIGlmIChzdGF0ZSAmJiBjYWxsYmFjaykge1xuICAgIC8vIE5vdCBhIHZhbGlkIHN0YXRlIG5hbWUuXG4gICAgaWYgKE9iamVjdC5rZXlzKF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzKS5pbmRleE9mKHN0YXRlKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yKCdJbnZhbGlkIHN0YXRlIG5hbWUgJyArIHN0YXRlKTtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlc1tzdGF0ZV0uaW5kZXhPZihjYWxsYmFjayk7XG4gICAgX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLnNwbGljZShpbmRleCwgMSk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgX3N0YXRlIGluIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzKSB7XG4gICAgICBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlc1tfc3RhdGVdLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnkgY2FsbGluZyB0aGlzIGZ1bmN0aW9uIHlvdXIgYnJvd3NlciBlbnZpcm9ubWVudCBpcyBlbmhhbmNlZCBnbG9iYWxseS4gVGhpc1xuICogcHJvamVjdCB3b3VsZCBsb3ZlIHRvIGhpdCB0aGUgc3RhbmRhcmRzIHRyYWNrIGFuZCBhbGxvdyBhbGwgZGV2ZWxvcGVycyB0b1xuICogYmVuZWZpdCBmcm9tIHRoZSBwZXJmb3JtYW5jZSBnYWlucyBvZiBET00gZGlmZmluZy5cbiAqL1xuXG5mdW5jdGlvbiBlbmFibGVQcm9sbHlmaWxsKCkge1xuICAvLyBFeHBvc2VzIHRoZSBgVHJhbnNpdGlvblN0YXRlRXJyb3JgIGNvbnN0cnVjdG9yIGdsb2JhbGx5IHNvIHRoYXQgZGV2ZWxvcGVyc1xuICAvLyBjYW4gaW5zdGFuY2VvZiBjaGVjayBleGNlcHRpb24gZXJyb3JzLlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnVHJhbnNpdGlvblN0YXRlRXJyb3InLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3JcbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIGFkZCB0cmFuc2l0aW9uIHN0YXRlIGNhbGxiYWNrcy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50LCAnYWRkVHJhbnNpdGlvblN0YXRlJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgIGFkZFRyYW5zaXRpb25TdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIHJlbW92ZSB0cmFuc2l0aW9uIHN0YXRlIGNhbGxiYWNrcy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50LCAncmVtb3ZlVHJhbnNpdGlvblN0YXRlJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25TdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIHNldCB0aGUgYGlubmVySFRNTGAgb2YgYW4gZWxlbWVudC5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnZGlmZklubmVySFRNTCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChuZXdIVE1MKSB7XG4gICAgICBpbm5lckhUTUwodGhpcywgbmV3SFRNTCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gc2V0IHRoZSBgb3V0ZXJIVE1MYCBvZiBhbiBlbGVtZW50LlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdkaWZmT3V0ZXJIVE1MJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHNldDogZnVuY3Rpb24gc2V0KG5ld0hUTUwpIHtcbiAgICAgIG91dGVySFRNTCh0aGlzLCBuZXdIVE1MKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBkaWZmIHRoZSBjdXJyZW50IGVsZW1lbnQgd2l0aCBhIG5ldyBlbGVtZW50LlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsICdkaWZmRWxlbWVudCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3RWxlbWVudCkge1xuICAgICAgZWxlbWVudCh0aGlzLCBuZXdFbGVtZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJlbGVhc2VzIHRoZSByZXRhaW5lZCBtZW1vcnkgYW5kIHdvcmtlciBpbnN0YW5jZS5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnZGlmZlJlbGVhc2UnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG5ld0VsZW1lbnQpIHtcbiAgICAgICgwLCBfbm9kZVBhdGNoLnJlbGVhc2VOb2RlKSh0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFBvbHlmaWxsIGluIHRoZSBgcmVnaXN0ZXJFbGVtZW50YCBtZXRob2QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0LiBUaGlzXG4gIC8vIHJlcXVpcmVzIHBhdGNoaW5nIGBjcmVhdGVFbGVtZW50YCBhcyB3ZWxsIHRvIGVuc3VyZSB0aGF0IHRoZSBwcm9wZXIgcHJvdG9cbiAgLy8gY2hhaW4gZXhpc3RzLlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQsICdyZWdpc3RlckVsZW1lbnQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKHRhZ05hbWUsIGNvbXBvbmVudCkge1xuICAgICAgcmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIGNvbXBvbmVudCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBUaGlzIHNlY3Rpb24gd2lsbCBhdXRvbWF0aWNhbGx5IHBhcnNlIG91dCB5b3VyIGVudGlyZSBwYWdlIHRvIGVuc3VyZSBhbGxcbiAgLy8gY3VzdG9tIGVsZW1lbnRzIGFyZSBob29rZWQgaW50by5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRvY3VtZW50RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgIC8vIEFmdGVyIHRoZSBpbml0aWFsIHJlbmRlciwgY2xlYW4gdXAgdGhlIHJlc291cmNlcywgbm8gcG9pbnQgaW4gbGluZ2VyaW5nLlxuICAgIGRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXJDb21wbGV0ZScsIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIC8vIFJlbGVhc2UgcmVzb3VyY2VzIHRvIHRoZSBlbGVtZW50LlxuICAgICAgZG9jdW1lbnRFbGVtZW50LmRpZmZSZWxlYXNlKGRvY3VtZW50RWxlbWVudCk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGlzIGV2ZW50IGxpc3RlbmVyLlxuICAgICAgZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlbmRlckNvbXBsZXRlJywgcmVuZGVyKTtcbiAgICB9KTtcblxuICAgIC8vIERpZmYgdGhlIGVudGlyZSBkb2N1bWVudCBvbiBhY3RpdmF0aW9uIG9mIHRoZSBwcm9sbHlmaWxsLlxuICAgIGRvY3VtZW50RWxlbWVudC5kaWZmT3V0ZXJIVE1MID0gZG9jdW1lbnRFbGVtZW50Lm91dGVySFRNTDtcbiAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenM3T3pzN08zbENRVUZ4UkN4alFVRmpPenN5UWtGRGJFTXNaVUZCWlRzN05rSkJRM0pDTEd0Q1FVRnJRanM3T3pzN2MwSkJTVklzVlVGQlZUczdPenM3YlVKQlEzUkRMRzlDUVVGdlFqczdPenRCUVVVM1FpeEpRVUZKTEcxQ1FVRnRRaXhIUVVGSExGRkJRVkVzUTBGQlF5eGxRVUZsTEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZET3pzN096czdPenM3T3pzN1FVRlhVaXhUUVVGVExGTkJRVk1zUTBGQlF5eFBRVUZQTEVWQlFYbENPMDFCUVhaQ0xFMUJRVTBzZVVSQlFVTXNSVUZCUlR0TlFVRkZMRTlCUVU4c2VVUkJRVU1zUlVGQlJUczdRVUZEZEVRc1UwRkJUeXhEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZEZEVJc05FSkJRVlVzVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenREUVVOeVF6czdPenM3T3pzN096czdPMEZCVjAwc1UwRkJVeXhUUVVGVExFTkJRVU1zVDBGQlR5eEZRVUY1UWp0TlFVRjJRaXhOUVVGTkxIbEVRVUZETEVWQlFVVTdUVUZCUlN4UFFVRlBMSGxFUVVGRExFVkJRVVU3TzBGQlEzUkVMRk5CUVU4c1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzSkNMRFJDUVVGVkxFOUJRVThzUlVGQlJTeE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1EwRkRja003T3pzN096czdPenM3T3p0QlFWZE5MRk5CUVZNc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJTeFZRVUZWTEVWQlFXTTdUVUZCV2l4UFFVRlBMSGxFUVVGRExFVkJRVVU3TzBGQlEzSkVMRFJDUVVGVkxFOUJRVThzUlVGQlJTeFZRVUZWTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1EwRkRla003T3pzN096czdPenRCUVZGTkxGTkJRVk1zVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTXZRaXc0UWtGQldTeFBRVUZQTEVOQlFVTXNRMEZCUXp0RFFVTjBRanM3T3pzN096czdPMEZCVVUwc1UwRkJVeXhsUVVGbExFTkJRVU1zVDBGQlR5eEZRVUZGTEZkQlFWY3NSVUZCUlRzN08wRkJSM0JFTEUxQlFVa3NjVUpCUVhGQ0xFZEJRVWNzVjBGQlZ5eERRVUZETEZOQlFWTXNSMEZCUnl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE96dEJRVVYyUlN4TlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVWQlFVVTdRVUZETVVJc1pVRkJWeXhEUVVGRExGTkJRVk1zUjBGQlJ5eFhRVUZYTEVOQlFVTXNVMEZCVXl4RFFVRkRPMEZCUXpsRExIbENRVUZ4UWl4SFFVRkhMRVZCUVVVc1UwRkJVeXhGUVVGRkxGZEJRVmNzUlVGQlJTeERRVUZETzBkQlEzQkVPenM3UVVGSFJDeE5RVUZKTEcxQ1FVRnRRaXhGUVVGRk8wRkJRM1pDTEZkQlFVOHNiVUpCUVcxQ0xFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlN4UFFVRlBMRVZCUVVVc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXp0SFFVTXpSVHM3TzBGQlIwUXNUVUZCU1N4UFFVRlBMRFpDUVVGakxFVkJRVVU3UVVGRGVrSXNWVUZCVFN4SlFVRkpMRmxCUVZrc01rZEJSVklzVDBGQlR5dzBSRUZEYmtJc1EwRkJRenRIUVVOS096czdRVUZIUkN3MFFrRkJWeXhQUVVGUExFTkJRVU1zUjBGQlJ5eHhRa0ZCY1VJc1EwRkJRenREUVVNM1F6czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN08wRkJNRUpOTEZOQlFWTXNhMEpCUVd0Q0xFTkJRVU1zUzBGQlN5eEZRVUZGTEZGQlFWRXNSVUZCUlR0QlFVTnNSQ3hOUVVGSkxFTkJRVU1zUzBGQlN5eEZRVUZGTzBGQlExWXNWVUZCVFN4cFEwRkJlVUlzSzBKQlFTdENMRU5CUVVNc1EwRkJRenRIUVVOcVJUczdRVUZGUkN4TlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRMklzVlVGQlRTeHBRMEZCZVVJc2JVTkJRVzFETEVOQlFVTXNRMEZCUXp0SFFVTnlSVHM3TzBGQlIwUXNUVUZCU1N4TlFVRk5MRU5CUVVNc1NVRkJTU3dyUWtGQmEwSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVTdRVUZEZGtRc1ZVRkJUU3hwUTBGQmVVSXNjMEpCUVhOQ0xFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTTdSMEZEYUVVN08wRkJSVVFzWjBOQlFXbENMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0RFFVTjRRenM3T3pzN096czdPenM3T3pzN1FVRmhUU3hUUVVGVExIRkNRVUZ4UWl4RFFVRkRMRXRCUVVzc1JVRkJSU3hSUVVGUkxFVkJRVVU3UVVGRGNrUXNUVUZCU1N4RFFVRkRMRkZCUVZFc1NVRkJTU3hMUVVGTExFVkJRVVU3UVVGRGRFSXNhME5CUVdsQ0xFdEJRVXNzUTBGQlF5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1IwRkRjRU1zVFVGRFNTeEpRVUZKTEV0QlFVc3NTVUZCU1N4UlFVRlJMRVZCUVVVN08wRkJSVEZDTEZGQlFVa3NUVUZCVFN4RFFVRkRMRWxCUVVrc0swSkJRV3RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlEzWkVMRmxCUVUwc2FVTkJRWGxDTEhGQ1FVRnhRaXhIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETzB0QlF5OUVPenRCUVVWRUxGRkJRVWtzUzBGQlN5eEhRVUZITERoQ1FVRnBRaXhMUVVGTExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRkRVFzYTBOQlFXbENMRXRCUVVzc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRNVU1zVFVGRFNUdEJRVU5JTEZOQlFVc3NTVUZCU1N4TlFVRkxMRzFEUVVGelFqdEJRVU5zUXl4dlEwRkJhVUlzVFVGQlN5eERRVUZETEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRMUVVOd1F6dEhRVU5HTzBOQlEwWTdPenM3T3pzN08wRkJUMDBzVTBGQlV5eG5Ra0ZCWjBJc1IwRkJSenM3TzBGQlIycERMRkZCUVUwc1EwRkJReXhqUVVGakxFTkJRVU1zVFVGQlRTeEZRVUZGTEhOQ1FVRnpRaXhGUVVGRk8wRkJRM0JFTEdkQ1FVRlpMRVZCUVVVc1NVRkJTVHM3UVVGRmJFSXNVMEZCU3l3NFFrRkJjMEk3UjBGRE5VSXNRMEZCUXl4RFFVRkRPenM3UVVGSFNDeFJRVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRkZCUVZFc1JVRkJSU3h2UWtGQmIwSXNSVUZCUlR0QlFVTndSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xGTkJRVXNzUlVGQlFTeGxRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRVZCUVVVN1FVRkRja0lzZDBKQlFXdENMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzB0QlEzSkRPMGRCUTBZc1EwRkJReXhEUVVGRE96czdRVUZIU0N4UlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExGRkJRVkVzUlVGQlJTeDFRa0ZCZFVJc1JVRkJSVHRCUVVOMlJDeG5Ra0ZCV1N4RlFVRkZMRWxCUVVrN08wRkJSV3hDTEZOQlFVc3NSVUZCUVN4bFFVRkRMRXRCUVVzc1JVRkJSU3hSUVVGUkxFVkJRVVU3UVVGRGNrSXNNa0pCUVhGQ0xFTkJRVU1zUzBGQlN5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMHRCUTNoRE8wZEJRMFlzUTBGQlF5eERRVUZET3pzN1FVRkhTQ3hSUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1pVRkJaU3hGUVVGRk8wRkJRM2hFTEdkQ1FVRlpMRVZCUVVVc1NVRkJTVHM3UVVGRmJFSXNUMEZCUnl4RlFVRkJMR0ZCUVVNc1QwRkJUeXhGUVVGRk8wRkJRMWdzWlVGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRMUVVNeFFqdEhRVU5HTEVOQlFVTXNRMEZCUXpzN08wRkJSMGdzVVVGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhGUVVGRkxHVkJRV1VzUlVGQlJUdEJRVU40UkN4blFrRkJXU3hGUVVGRkxFbEJRVWs3TzBGQlJXeENMRTlCUVVjc1JVRkJRU3hoUVVGRExFOUJRVThzUlVGQlJUdEJRVU5ZTEdWQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03UzBGRE1VSTdSMEZEUml4RFFVRkRMRU5CUVVNN096dEJRVWRJTEZGQlFVMHNRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeGhRVUZoTEVWQlFVVTdRVUZEZEVRc1owSkJRVmtzUlVGQlJTeEpRVUZKT3p0QlFVVnNRaXhUUVVGTExFVkJRVUVzWlVGQlF5eFZRVUZWTEVWQlFVVTdRVUZEYUVJc1lVRkJUeXhEUVVGRExFbEJRVWtzUlVGQlJTeFZRVUZWTEVOQlFVTXNRMEZCUXp0TFFVTXpRanRIUVVOR0xFTkJRVU1zUTBGQlF6czdPMEZCUjBnc1VVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMR0ZCUVdFc1JVRkJSVHRCUVVOMFJDeG5Ra0ZCV1N4RlFVRkZMRWxCUVVrN08wRkJSV3hDTEZOQlFVc3NSVUZCUVN4bFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVOb1FpeHJRMEZCV1N4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVOdVFqdEhRVU5HTEVOQlFVTXNRMEZCUXpzN096czdRVUZMU0N4UlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExGRkJRVkVzUlVGQlJTeHBRa0ZCYVVJc1JVRkJSVHRCUVVOcVJDeG5Ra0ZCV1N4RlFVRkZMRWxCUVVrN08wRkJSV3hDTEZOQlFVc3NSVUZCUVN4bFFVRkRMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVU3UVVGRGVFSXNjVUpCUVdVc1EwRkJReXhQUVVGUExFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdTMEZEY2tNN1IwRkRSaXhEUVVGRExFTkJRVU03T3pzN1FVRkpTQ3hSUVVGTkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1RVRkJUU3hGUVVGRkxGbEJRVmM3UVVGRGVrTXNVVUZCU1N4bFFVRmxMRWRCUVVjc1VVRkJVU3hEUVVGRExHVkJRV1VzUTBGQlF6czdPMEZCUnk5RExHMUNRVUZsTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1UwRkJVeXhOUVVGTkxFZEJRVWM3TzBGQlJXNUZMSEZDUVVGbExFTkJRVU1zVjBGQlZ5eERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRPenM3UVVGSE4wTXNjVUpCUVdVc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4blFrRkJaMElzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0TFFVTXZSQ3hEUVVGRExFTkJRVU03T3p0QlFVZElMRzFDUVVGbExFTkJRVU1zWVVGQllTeEhRVUZITEdWQlFXVXNRMEZCUXl4VFFVRlRMRU5CUVVNN1IwRkRNMFFzUTBGQlF5eERRVUZETzBOQlEwb2lMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdleUJ3WVhSamFFNXZaR1VzSUhKbGJHVmhjMlZPYjJSbExDQnlaV2RwYzNSbGNrNXZaR1VnZlNCbWNtOXRJQ2N1TDI1dlpHVXZjR0YwWTJnbk8xeHVhVzF3YjNKMElIc2dkSEpoYm5OcGRHbHZibE4wWVhSbGN5QjlJR1p5YjIwZ0p5NHZkSEpoYm5OcGRHbHZibk1uTzF4dWFXMXdiM0owSUhzZ1kyOXRjRzl1Wlc1MGN5QjlJR1p5YjIwZ0p5NHZaV3hsYldWdWRDOWpkWE4wYjIwbk8xeHVYRzR2THlCWFpTQmxlSEJ2Y25RZ2RHaGxJRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5SUdOdmJuTjBjblZqZEc5eUlITnZJSFJvWVhRZ2FXNXpkR0Z1WTJWdlppQmphR1ZqYTNNZ1kyRnVYRzR2THlCaVpTQnRZV1JsSUdKNUlIUm9iM05sSUhCMVlteHBZMng1SUdOdmJuTjFiV2x1WnlCMGFHbHpJR3hwWW5KaGNua3VYRzVwYlhCdmNuUWdleUJVY21GdWMybDBhVzl1VTNSaGRHVkZjbkp2Y2lCOUlHWnliMjBnSnk0dlpYSnliM0p6Snp0Y2JtVjRjRzl5ZENCN0lGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlJSDBnWm5KdmJTQW5MaTlsY25KdmNuTW5PMXh1WEc1MllYSWdjbVZoYkZKbFoybHpkR1Z5Uld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5KbFoybHpkR1Z5Uld4bGJXVnVkRHRjYm5aaGNpQmxiWEIwZVNBOUlIdDlPMXh1WEc0dktpcGNiaUFxSUZWelpXUWdkRzhnWkdsbVppQjBhR1VnYjNWMFpYSklWRTFNSUdOdmJuUmxiblJ6SUc5bUlIUm9aU0J3WVhOelpXUWdaV3hsYldWdWRDQjNhWFJvSUhSb1pTQnRZWEpyZFhCY2JpQXFJR052Ym5SbGJuUnpMaUFnVm1WeWVTQjFjMlZtZFd3Z1ptOXlJR0Z3Y0d4NWFXNW5JR0VnWjJ4dlltRnNJR1JwWm1ZZ2IyNGdkR2hsWEc0Z0tpQmdaRzlqZFcxbGJuUXVaRzlqZFcxbGJuUkZiR1Z0Wlc1MFlDNWNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ1pXeGxiV1Z1ZEZ4dUlDb2dRSEJoY21GdElHMWhjbXQxY0QwbkoxeHVJQ29nUUhCaGNtRnRJRzl3ZEdsdmJuTTllMzFjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHOTFkR1Z5U0ZSTlRDaGxiR1Z0Wlc1MExDQnRZWEpyZFhBOUp5Y3NJRzl3ZEdsdmJuTTllMzBwSUh0Y2JpQWdiM0IwYVc5dWN5NXBibTVsY2lBOUlHWmhiSE5sTzF4dUlDQndZWFJqYUU1dlpHVW9aV3hsYldWdWRDd2diV0Z5YTNWd0xDQnZjSFJwYjI1ektUdGNibjFjYmx4dUx5b3FYRzRnS2lCVmMyVmtJSFJ2SUdScFptWWdkR2hsSUdsdWJtVnlTRlJOVENCamIyNTBaVzUwY3lCdlppQjBhR1VnY0dGemMyVmtJR1ZzWlcxbGJuUWdkMmwwYUNCMGFHVWdiV0Z5YTNWd1hHNGdLaUJqYjI1MFpXNTBjeTRnSUZSb2FYTWdhWE1nZFhObFpuVnNJSGRwZEdnZ2JHbGljbUZ5YVdWeklHeHBhMlVnUW1GamEySnZibVVnZEdoaGRDQnlaVzVrWlhJZ1ZtbGxkM05jYmlBcUlHbHVkRzhnWld4bGJXVnVkQ0JqYjI1MFlXbHVaWEl1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCd1lYSmhiU0J0WVhKcmRYQTlKeWRjYmlBcUlFQndZWEpoYlNCdmNIUnBiMjV6UFh0OVhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJwYm01bGNraFVUVXdvWld4bGJXVnVkQ3dnYldGeWEzVndQU2NuTENCdmNIUnBiMjV6UFh0OUtTQjdYRzRnSUc5d2RHbHZibk11YVc1dVpYSWdQU0IwY25WbE8xeHVJQ0J3WVhSamFFNXZaR1VvWld4bGJXVnVkQ3dnYldGeWEzVndMQ0J2Y0hScGIyNXpLVHRjYm4xY2JseHVMeW9xWEc0Z0tpQlZjMlZrSUhSdklHUnBabVlnZEhkdklHVnNaVzFsYm5SekxpQWdWR2hsSUdCcGJtNWxjbUFnUW05dmJHVmhiaUJ3Y205d1pYSjBlU0JqWVc0Z1ltVWdjM0JsWTJsbWFXVmtJR2x1WEc0Z0tpQjBhR1VnYjNCMGFXOXVjeUIwYnlCelpYUWdhVzV1WlhKSVZFMU1YRnh2ZFhSbGNraFVUVXdnWW1Wb1lYWnBiM0l1SUNCQ2VTQmtaV1poZFd4MElHbDBJR2x6WEc0Z0tpQnZkWFJsY2toVVRVd3VYRzRnS2x4dUlDb2dRSEJoY21GdElHVnNaVzFsYm5SY2JpQXFJRUJ3WVhKaGJTQnVaWGRGYkdWdFpXNTBYRzRnS2lCQWNHRnlZVzBnYjNCMGFXOXVjejE3ZlZ4dUlDb3ZYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaV3hsYldWdWRDaGxiR1Z0Wlc1MExDQnVaWGRGYkdWdFpXNTBMQ0J2Y0hScGIyNXpQWHQ5S1NCN1hHNGdJSEJoZEdOb1RtOWtaU2hsYkdWdFpXNTBMQ0J1WlhkRmJHVnRaVzUwTENCdmNIUnBiMjV6S1R0Y2JuMWNibHh1THlvcVhHNGdLaUJTWld4bFlYTmxjeUIwYUdVZ2QyOXlhMlZ5SUdGdVpDQnRaVzF2Y25rZ1lXeHNiMk5oZEdWa0lIUnZJSFJvYVhNZ1pXeGxiV1Z1ZEM0Z1ZYTmxablZzSUdadmNseHVJQ29nWTI5dGNHOXVaVzUwY3lCMGJ5QmpiR1ZoYmlCMWNDQjNhR1Z1SUhKbGJXOTJaV1F1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhKbGJHVmhjMlVvWld4bGJXVnVkQ2tnZTF4dUlDQnlaV3hsWVhObFRtOWtaU2hsYkdWdFpXNTBLVHRjYm4xY2JseHVMeW9xWEc0Z0tpQlNaV2RwYzNSbGNpZHpJR0VnWTI5dWMzUnlkV04wYjNJZ2QybDBhQ0JoYmlCbGJHVnRaVzUwSUhSdklIQnliM1pwWkdVZ2JHbG1aV041WTJ4bElHVjJaVzUwY3k1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnZEdGblRtRnRaVnh1SUNvZ1FIQmhjbUZ0SUdOdmJuTjBjblZqZEc5eVhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ5WldkcGMzUmxja1ZzWlcxbGJuUW9kR0ZuVG1GdFpTd2dZMjl1YzNSeWRXTjBiM0lwSUh0Y2JpQWdMeThnVlhCbmNtRmtaU0J6YVcxd2JHVWdiMkpxWldOMGN5QjBieUJwYm1obGNtbDBJR1p5YjIwZ1NGUk5URVZzWlcxbGJuUWdZVzVrSUdKbElIVnpZV0pzWlNCcGJpQmhJSEpsWVd4Y2JpQWdMeThnYVcxd2JHVnRaVzUwWVhScGIyNHVYRzRnSUhaaGNpQnViM0p0WVd4cGVtVmtRMjl1YzNSeWRXTjBiM0lnUFNCamIyNXpkSEoxWTNSdmNpNXdjbTkwYjNSNWNHVWdQeUJqYjI1emRISjFZM1J2Y2lBNklHNTFiR3c3WEc1Y2JpQWdhV1lnS0NGdWIzSnRZV3hwZW1Wa1EyOXVjM1J5ZFdOMGIzSXBJSHRjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaTVmWDNCeWIzUnZYMThnUFNCSVZFMU1SV3hsYldWdWRDNXdjbTkwYjNSNWNHVTdYRzRnSUNBZ2JtOXliV0ZzYVhwbFpFTnZibk4wY25WamRHOXlJRDBnZXlCd2NtOTBiM1I1Y0dVNklHTnZibk4wY25WamRHOXlJSDA3WEc0Z0lIMWNibHh1SUNBdkx5QkpaaUIwYUdVZ2JtRjBhWFpsSUhkbFlpQmpiMjF3YjI1bGJuUWdjM0JsWTJsbWFXTmhkR2x2YmlCcGN5QnNiMkZrWldRc0lIVnpaU0IwYUdGMElHbHVjM1JsWVdRdVhHNGdJR2xtSUNoeVpXRnNVbVZuYVhOMFpYSkZiR1Z0Wlc1MEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhKbFlXeFNaV2RwYzNSbGNrVnNaVzFsYm5RdVkyRnNiQ2hrYjJOMWJXVnVkQ3dnZEdGblRtRnRaU3dnYm05eWJXRnNhWHBsWkVOdmJuTjBjblZqZEc5eUtUdGNiaUFnZlZ4dVhHNGdJQzh2SUVsbUlIUm9aU0JsYkdWdFpXNTBJR2hoY3lCaGJISmxZV1I1SUdKbFpXNGdjbVZuYVhOMFpYSmxaQ3dnY21GcGMyVWdZVzRnWlhKeWIzSXVYRzRnSUdsbUlDaDBZV2RPWVcxbElHbHVJR052YlhCdmJtVnVkSE1wSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUkU5TlJYaGpaWEIwYVc5dUtHQmNiaUFnSUNBZ0lFWmhhV3hsWkNCMGJ5QmxlR1ZqZFhSbElDZHlaV2RwYzNSbGNrVnNaVzFsYm5RbklHOXVJQ2RFYjJOMWJXVnVkQ2M2SUZKbFoybHpkSEpoZEdsdmJpQm1ZV2xzWldSY2JpQWdJQ0FnSUdadmNpQjBlWEJsSUNja2UzUmhaMDVoYldWOUp5NGdRU0IwZVhCbElIZHBkR2dnZEdoaGRDQnVZVzFsSUdseklHRnNjbVZoWkhrZ2NtVm5hWE4wWlhKbFpDNWNiaUFnSUNCZ0tUdGNiaUFnZlZ4dVhHNGdJQzh2SUVGemMybG5iaUIwYUdVZ1kzVnpkRzl0SUdWc1pXMWxiblFnY21WbVpYSmxibU5sSUhSdklIUm9aU0JqYjI1emRISjFZM1J2Y2k1Y2JpQWdZMjl0Y0c5dVpXNTBjMXQwWVdkT1lXMWxYU0E5SUc1dmNtMWhiR2w2WldSRGIyNXpkSEoxWTNSdmNqdGNibjFjYmx4dUx5b3FYRzRnS2lCQlpHUnpJR0VnWjJ4dlltRnNJSFJ5WVc1emFYUnBiMjRnYkdsemRHVnVaWEl1SUNCWGFYUm9JRzFoYm5rZ1pXeGxiV1Z1ZEhNZ2RHaHBjeUJqYjNWc1pDQmlaU0JoYmx4dUlDb2daWGh3Wlc1emFYWmxJRzl3WlhKaGRHbHZiaXdnYzI4Z2RISjVJSFJ2SUd4cGJXbDBJSFJvWlNCaGJXOTFiblFnYjJZZ2JHbHpkR1Z1WlhKeklHRmtaR1ZrSUdsbUlIbHZkU2R5WlZ4dUlDb2dZMjl1WTJWeWJtVmtJR0ZpYjNWMElIQmxjbVp2Y20xaGJtTmxMbHh1SUNwY2JpQXFJRk5wYm1ObElIUm9aU0JqWVd4c1ltRmpheUIwY21sbloyVnljeUIzYVhSb0lIWmhjbWx2ZFhNZ1pXeGxiV1Z1ZEhNc0lHMXZjM1FnYjJZZ2QyaHBZMmdnZVc5MVhHNGdLaUJ3Y205aVlXSnNlU0JrYjI0bmRDQmpZWEpsSUdGaWIzVjBMQ0I1YjNVbmJHd2dkMkZ1ZENCMGJ5Qm1hV3gwWlhJdUlDQkJJR2R2YjJRZ2QyRjVJRzltSUdacGJIUmxjbWx1WjF4dUlDb2dhWE1nZEc4Z2RYTmxJSFJvWlNCRVQwMGdZRzFoZEdOb1pYTmdJRzFsZEdodlpDNGdJRWwwSjNNZ1ptRnBjbXg1SUhkbGJHd2djM1Z3Y0c5eWRHVmtYRzRnS2lBb2FIUjBjRG92TDJOaGJtbDFjMlV1WTI5dEx5Tm1aV0YwUFcxaGRHTm9aWE56Wld4bFkzUnZjaWtnWVc1a0lHMWhlU0J6ZFdsMElHMWhibmtnY0hKdmFtVmpkSE11SUNCSlpseHVJQ29nZVc5MUlHNWxaV1FnWW1GamEzZGhjbVJ6SUdOdmJYQmhkR2xpYVd4cGRIa3NJR052Ym5OcFpHVnlJSFZ6YVc1bklHcFJkV1Z5ZVNkeklHQnBjMkF1WEc0Z0tseHVJQ29nV1c5MUlHTmhiaUJrYnlCbWRXNHNJR2hwWjJoc2VTQnpjR1ZqYVdacFl5d2dabWxzZEdWeWN6cGNiaUFxWEc0Z0tpQmhaR1JVY21GdWMybDBhVzl1VTNSaGRHVW9KMkYwZEdGamFHVmtKeXdnWm5WdVkzUnBiMjRvWld4bGJXVnVkQ2tnZTF4dUlDb2dJQ0F2THlCR1lXUmxJR2x1SUhSb1pTQnRZV2x1SUdOdmJuUmhhVzVsY2lCaFpuUmxjaUJwZENkeklHRmtaR1ZrTGx4dUlDb2dJQ0JwWmlBb1pXeGxiV1Z1ZEM1dFlYUmphR1Z6S0NkaWIyUjVJRzFoYVc0dVkyOXVkR0ZwYm1WeUp5a3BJSHRjYmlBcUlDQWdJQ0FrS0dWc1pXMWxiblFwTG5OMGIzQW9kSEoxWlN3Z2RISjFaU2t1Wm1Ga1pVbHVLQ2s3WEc0Z0tpQWdJSDFjYmlBcUlIMHBPMXh1SUNwY2JpQXFJRUJ3WVhKaGJTQnpkR0YwWlNBdElGTjBjbWx1WnlCdVlXMWxJSFJvWVhRZ2JXRjBZMmhsY3lCM2FHRjBKM01nWVhaaGFXeGhZbXhsSUdsdUlIUm9aVnh1SUNvZ1pHOWpkVzFsYm5SaGRHbHZiaUJoWW05MlpTNWNiaUFxSUVCd1lYSmhiU0JqWVd4c1ltRmpheUF0SUVaMWJtTjBhVzl1SUhSdklISmxZMlZwZG1VZ2RHaGxJRzFoZEdOb2FXNW5JR1ZzWlcxbGJuUnpMbHh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1lXUmtWSEpoYm5OcGRHbHZibE4wWVhSbEtITjBZWFJsTENCallXeHNZbUZqYXlrZ2UxeHVJQ0JwWmlBb0lYTjBZWFJsS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUZSeVlXNXphWFJwYjI1VGRHRjBaVVZ5Y205eUtDZE5hWE56YVc1bklIUnlZVzV6YVhScGIyNGdjM1JoZEdVZ2JtRnRaU2NwTzF4dUlDQjlYRzVjYmlBZ2FXWWdLQ0ZqWVd4c1ltRmpheWtnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJVY21GdWMybDBhVzl1VTNSaGRHVkZjbkp2Y2lnblRXbHpjMmx1WnlCMGNtRnVjMmwwYVc5dUlITjBZWFJsSUdOaGJHeGlZV05ySnlrN1hHNGdJSDFjYmx4dUlDQXZMeUJPYjNRZ1lTQjJZV3hwWkNCemRHRjBaU0J1WVcxbExseHVJQ0JwWmlBb1QySnFaV04wTG10bGVYTW9kSEpoYm5OcGRHbHZibE4wWVhSbGN5a3VhVzVrWlhoUFppaHpkR0YwWlNrZ1BUMDlJQzB4S1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUZSeVlXNXphWFJwYjI1VGRHRjBaVVZ5Y205eUtDZEpiblpoYkdsa0lITjBZWFJsSUc1aGJXVTZJQ2NnS3lCemRHRjBaU2s3WEc0Z0lIMWNibHh1SUNCMGNtRnVjMmwwYVc5dVUzUmhkR1Z6VzNOMFlYUmxYUzV3ZFhOb0tHTmhiR3hpWVdOcktUdGNibjFjYmx4dUx5b3FYRzRnS2lCU1pXMXZkbVZ6SUdFZ1oyeHZZbUZzSUhSeVlXNXphWFJwYjI0Z2JHbHpkR1Z1WlhJdVhHNGdLbHh1SUNvZ1YyaGxiaUJwYm5admEyVmtJSGRwZEdnZ2JtOGdZWEpuZFcxbGJuUnpMQ0IwYUdseklHMWxkR2h2WkNCM2FXeHNJSEpsYlc5MlpTQmhiR3dnZEhKaGJuTnBkR2x2Ymx4dUlDb2dZMkZzYkdKaFkydHpMaUFnVjJobGJpQnBiblp2YTJWa0lIZHBkR2dnZEdobElHNWhiV1VnWVhKbmRXMWxiblFnYVhRZ2QybHNiQ0J5WlcxdmRtVWdZV3hzWEc0Z0tpQjBjbUZ1YzJsMGFXOXVJSE4wWVhSbElHTmhiR3hpWVdOcmN5QnRZWFJqYUdsdVp5QjBhR1VnYm1GdFpTd2dZVzVrSUhOdklHOXVJR1p2Y2lCMGFHVWdZMkZzYkdKaFkyc3VYRzRnS2x4dUlDb2dRSEJoY21GdElITjBZWFJsSUMwZ1UzUnlhVzVuSUc1aGJXVWdkR2hoZENCdFlYUmphR1Z6SUhkb1lYUW5jeUJoZG1GcGJHRmliR1VnYVc0Z2RHaGxYRzRnS2lCa2IyTjFiV1Z1ZEdGMGFXOXVJR0ZpYjNabExseHVJQ29nUUhCaGNtRnRJR05oYkd4aVlXTnJJQzBnUm5WdVkzUnBiMjRnZEc4Z2NtVmpaV2wyWlNCMGFHVWdiV0YwWTJocGJtY2daV3hsYldWdWRITXVYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCeVpXMXZkbVZVY21GdWMybDBhVzl1VTNSaGRHVW9jM1JoZEdVc0lHTmhiR3hpWVdOcktTQjdYRzRnSUdsbUlDZ2hZMkZzYkdKaFkyc2dKaVlnYzNSaGRHVXBJSHRjYmlBZ0lDQjBjbUZ1YzJsMGFXOXVVM1JoZEdWelczTjBZWFJsWFM1c1pXNW5kR2dnUFNBd08xeHVJQ0I5WEc0Z0lHVnNjMlVnYVdZZ0tITjBZWFJsSUNZbUlHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0x5OGdUbTkwSUdFZ2RtRnNhV1FnYzNSaGRHVWdibUZ0WlM1Y2JpQWdJQ0JwWmlBb1QySnFaV04wTG10bGVYTW9kSEpoYm5OcGRHbHZibE4wWVhSbGN5a3VhVzVrWlhoUFppaHpkR0YwWlNrZ1BUMDlJQzB4S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1ZISmhibk5wZEdsdmJsTjBZWFJsUlhKeWIzSW9KMGx1ZG1Gc2FXUWdjM1JoZEdVZ2JtRnRaU0FuSUNzZ2MzUmhkR1VwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR3hsZENCcGJtUmxlQ0E5SUhSeVlXNXphWFJwYjI1VGRHRjBaWE5iYzNSaGRHVmRMbWx1WkdWNFQyWW9ZMkZzYkdKaFkyc3BPMXh1SUNBZ0lIUnlZVzV6YVhScGIyNVRkR0YwWlhOYmMzUmhkR1ZkTG5Od2JHbGpaU2hwYm1SbGVDd2dNU2s3WEc0Z0lIMWNiaUFnWld4elpTQjdYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2MzUmhkR1VnYVc0Z2RISmhibk5wZEdsdmJsTjBZWFJsY3lrZ2UxeHVJQ0FnSUNBZ2RISmhibk5wZEdsdmJsTjBZWFJsYzF0emRHRjBaVjB1YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0I5WEc0Z0lIMWNibjFjYmx4dUx5b3FYRzRnS2lCQ2VTQmpZV3hzYVc1bklIUm9hWE1nWm5WdVkzUnBiMjRnZVc5MWNpQmljbTkzYzJWeUlHVnVkbWx5YjI1dFpXNTBJR2x6SUdWdWFHRnVZMlZrSUdkc2IySmhiR3g1TGlCVWFHbHpYRzRnS2lCd2NtOXFaV04wSUhkdmRXeGtJR3h2ZG1VZ2RHOGdhR2wwSUhSb1pTQnpkR0Z1WkdGeVpITWdkSEpoWTJzZ1lXNWtJR0ZzYkc5M0lHRnNiQ0JrWlhabGJHOXdaWEp6SUhSdlhHNGdLaUJpWlc1bFptbDBJR1p5YjIwZ2RHaGxJSEJsY21admNtMWhibU5sSUdkaGFXNXpJRzltSUVSUFRTQmthV1ptYVc1bkxseHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWlc1aFlteGxVSEp2Ykd4NVptbHNiQ2dwSUh0Y2JpQWdMeThnUlhod2IzTmxjeUIwYUdVZ1lGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlZQ0JqYjI1emRISjFZM1J2Y2lCbmJHOWlZV3hzZVNCemJ5QjBhR0YwSUdSbGRtVnNiM0JsY25OY2JpQWdMeThnWTJGdUlHbHVjM1JoYm1ObGIyWWdZMmhsWTJzZ1pYaGpaWEIwYVc5dUlHVnljbTl5Y3k1Y2JpQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0hkcGJtUnZkeXdnSjFSeVlXNXphWFJwYjI1VGRHRjBaVVZ5Y205eUp5d2dlMXh1SUNBZ0lHTnZibVpwWjNWeVlXSnNaVG9nZEhKMVpTeGNibHh1SUNBZ0lIWmhiSFZsT2lCVWNtRnVjMmwwYVc5dVUzUmhkR1ZGY25KdmNseHVJQ0I5S1R0Y2JseHVJQ0F2THlCQmJHeHZkM01nWVNCa1pYWmxiRzl3WlhJZ2RHOGdZV1JrSUhSeVlXNXphWFJwYjI0Z2MzUmhkR1VnWTJGc2JHSmhZMnR6TGx4dUlDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWkc5amRXMWxiblFzSUNkaFpHUlVjbUZ1YzJsMGFXOXVVM1JoZEdVbkxDQjdYRzRnSUNBZ1kyOXVabWxuZFhKaFlteGxPaUIwY25WbExGeHVYRzRnSUNBZ2RtRnNkV1VvYzNSaGRHVXNJR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdJQ0JoWkdSVWNtRnVjMmwwYVc5dVUzUmhkR1VvYzNSaGRHVXNJR05oYkd4aVlXTnJLVHRjYmlBZ0lDQjlYRzRnSUgwcE8xeHVYRzRnSUM4dklFRnNiRzkzY3lCaElHUmxkbVZzYjNCbGNpQjBieUJ5WlcxdmRtVWdkSEpoYm5OcGRHbHZiaUJ6ZEdGMFpTQmpZV3hzWW1GamEzTXVYRzRnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGtiMk4xYldWdWRDd2dKM0psYlc5MlpWUnlZVzV6YVhScGIyNVRkR0YwWlNjc0lIdGNiaUFnSUNCamIyNW1hV2QxY21GaWJHVTZJSFJ5ZFdVc1hHNWNiaUFnSUNCMllXeDFaU2h6ZEdGMFpTd2dZMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJSEpsYlc5MlpWUnlZVzV6YVhScGIyNVRkR0YwWlNoemRHRjBaU3dnWTJGc2JHSmhZMnNwTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzVjYmlBZ0x5OGdRV3hzYjNkeklHRWdaR1YyWld4dmNHVnlJSFJ2SUhObGRDQjBhR1VnWUdsdWJtVnlTRlJOVEdBZ2IyWWdZVzRnWld4bGJXVnVkQzVjYmlBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLRVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxMQ0FuWkdsbVprbHVibVZ5U0ZSTlRDY3NJSHRjYmlBZ0lDQmpiMjVtYVdkMWNtRmliR1U2SUhSeWRXVXNYRzVjYmlBZ0lDQnpaWFFvYm1WM1NGUk5UQ2tnZTF4dUlDQWdJQ0FnYVc1dVpYSklWRTFNS0hSb2FYTXNJRzVsZDBoVVRVd3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaUFnTHk4Z1FXeHNiM2R6SUdFZ1pHVjJaV3h2Y0dWeUlIUnZJSE5sZENCMGFHVWdZRzkxZEdWeVNGUk5UR0FnYjJZZ1lXNGdaV3hsYldWdWRDNWNiaUFnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtFVnNaVzFsYm5RdWNISnZkRzkwZVhCbExDQW5aR2xtWms5MWRHVnlTRlJOVENjc0lIdGNiaUFnSUNCamIyNW1hV2QxY21GaWJHVTZJSFJ5ZFdVc1hHNWNiaUFnSUNCelpYUW9ibVYzU0ZSTlRDa2dlMXh1SUNBZ0lDQWdiM1YwWlhKSVZFMU1LSFJvYVhNc0lHNWxkMGhVVFV3cE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdMeThnUVd4c2IzZHpJR0VnWkdWMlpXeHZjR1Z5SUhSdklHUnBabVlnZEdobElHTjFjbkpsYm5RZ1pXeGxiV1Z1ZENCM2FYUm9JR0VnYm1WM0lHVnNaVzFsYm5RdVhHNGdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlN3Z0oyUnBabVpGYkdWdFpXNTBKeXdnZTF4dUlDQWdJR052Ym1acFozVnlZV0pzWlRvZ2RISjFaU3hjYmx4dUlDQWdJSFpoYkhWbEtHNWxkMFZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR1ZzWlcxbGJuUW9kR2hwY3l3Z2JtVjNSV3hsYldWdWRDazdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JseHVJQ0F2THlCU1pXeGxZWE5sY3lCMGFHVWdjbVYwWVdsdVpXUWdiV1Z0YjNKNUlHRnVaQ0IzYjNKclpYSWdhVzV6ZEdGdVkyVXVYRzRnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaEZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTd2dKMlJwWm1aU1pXeGxZWE5sSnl3Z2UxeHVJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JseHVJQ0FnSUhaaGJIVmxLRzVsZDBWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUhKbGJHVmhjMlZPYjJSbEtIUm9hWE1wTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzVjYmlBZ0x5OGdVRzlzZVdacGJHd2dhVzRnZEdobElHQnlaV2RwYzNSbGNrVnNaVzFsYm5SZ0lHMWxkR2h2WkNCcFppQnBkQ0JrYjJWemJpZDBJR0ZzY21WaFpIa2daWGhwYzNRdUlGUm9hWE5jYmlBZ0x5OGdjbVZ4ZFdseVpYTWdjR0YwWTJocGJtY2dZR055WldGMFpVVnNaVzFsYm5SZ0lHRnpJSGRsYkd3Z2RHOGdaVzV6ZFhKbElIUm9ZWFFnZEdobElIQnliM0JsY2lCd2NtOTBiMXh1SUNBdkx5QmphR0ZwYmlCbGVHbHpkSE11WEc0Z0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hrYjJOMWJXVnVkQ3dnSjNKbFoybHpkR1Z5Uld4bGJXVnVkQ2NzSUh0Y2JpQWdJQ0JqYjI1bWFXZDFjbUZpYkdVNklIUnlkV1VzWEc1Y2JpQWdJQ0IyWVd4MVpTaDBZV2RPWVcxbExDQmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJSEpsWjJsemRHVnlSV3hsYldWdWRDaDBZV2RPWVcxbExDQmpiMjF3YjI1bGJuUXBPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaUFnTHk4Z1ZHaHBjeUJ6WldOMGFXOXVJSGRwYkd3Z1lYVjBiMjFoZEdsallXeHNlU0J3WVhKelpTQnZkWFFnZVc5MWNpQmxiblJwY21VZ2NHRm5aU0IwYnlCbGJuTjFjbVVnWVd4c1hHNGdJQzh2SUdOMWMzUnZiU0JsYkdWdFpXNTBjeUJoY21VZ2FHOXZhMlZrSUdsdWRHOHVYRzRnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RzYjJGa0p5d2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdkbUZ5SUdSdlkzVnRaVzUwUld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1SdlkzVnRaVzUwUld4bGJXVnVkRHRjYmx4dUlDQWdJQzh2SUVGbWRHVnlJSFJvWlNCcGJtbDBhV0ZzSUhKbGJtUmxjaXdnWTJ4bFlXNGdkWEFnZEdobElISmxjMjkxY21ObGN5d2dibThnY0c5cGJuUWdhVzRnYkdsdVoyVnlhVzVuTGx4dUlDQWdJR1J2WTNWdFpXNTBSV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHlaVzVrWlhKRGIyMXdiR1YwWlNjc0lHWjFibU4wYVc5dUlISmxibVJsY2lncElIdGNiaUFnSUNBZ0lDOHZJRkpsYkdWaGMyVWdjbVZ6YjNWeVkyVnpJSFJ2SUhSb1pTQmxiR1Z0Wlc1MExseHVJQ0FnSUNBZ1pHOWpkVzFsYm5SRmJHVnRaVzUwTG1ScFptWlNaV3hsWVhObEtHUnZZM1Z0Wlc1MFJXeGxiV1Z1ZENrN1hHNWNiaUFnSUNBZ0lDOHZJRkpsYlc5MlpTQjBhR2x6SUdWMlpXNTBJR3hwYzNSbGJtVnlMbHh1SUNBZ0lDQWdaRzlqZFcxbGJuUkZiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9KM0psYm1SbGNrTnZiWEJzWlhSbEp5d2djbVZ1WkdWeUtUdGNiaUFnSUNCOUtUdGNibHh1SUNBZ0lDOHZJRVJwWm1ZZ2RHaGxJR1Z1ZEdseVpTQmtiMk4xYldWdWRDQnZiaUJoWTNScGRtRjBhVzl1SUc5bUlIUm9aU0J3Y205c2JIbG1hV3hzTGx4dUlDQWdJR1J2WTNWdFpXNTBSV3hsYldWdWRDNWthV1ptVDNWMFpYSklWRTFNSUQwZ1pHOWpkVzFsYm5SRmJHVnRaVzUwTG05MWRHVnlTRlJOVER0Y2JpQWdmU2s3WEc1OVhHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IG1ha2U7XG5cbnZhciBfdXRpbFBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xuXG52YXIgX3V0aWxNZW1vcnkgPSByZXF1aXJlKCcuLi91dGlsL21lbW9yeScpO1xuXG52YXIgX2VsZW1lbnRDdXN0b20gPSByZXF1aXJlKCcuLi9lbGVtZW50L2N1c3RvbScpO1xuXG52YXIgcG9vbHMgPSBfdXRpbFBvb2xzLnBvb2xzO1xudmFyIHByb3RlY3RFbGVtZW50ID0gX3V0aWxNZW1vcnkucHJvdGVjdEVsZW1lbnQ7XG52YXIgdW5wcm90ZWN0RWxlbWVudCA9IF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQ7XG52YXIgZW1wdHkgPSB7fTtcblxuLy8gQ2FjaGUgY3JlYXRlZCBub2RlcyBpbnNpZGUgdGhpcyBvYmplY3QuXG5tYWtlLm5vZGVzID0ge307XG5cbi8qKlxuICogQ29udmVydHMgYSBsaXZlIG5vZGUgaW50byBhIHZpcnR1YWwgbm9kZS5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHJldHVyblxuICovXG5cbmZ1bmN0aW9uIG1ha2Uobm9kZSwgcHJvdGVjdCkge1xuICB2YXIgbm9kZVR5cGUgPSBub2RlLm5vZGVUeXBlO1xuICB2YXIgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG5cbiAgaWYgKCFub2RlVHlwZSB8fCBub2RlVHlwZSA9PT0gMiB8fCBub2RlVHlwZSA9PT0gNCB8fCBub2RlVHlwZSA9PT0gOCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChub2RlVHlwZSA9PT0gMyAmJiAhbm9kZVZhbHVlLnRyaW0oKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFZpcnR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBub2RlLCBjb250YWluaW5nIG9ubHkgdGhlIGRhdGEgd2Ugd2lzaCB0b1xuICAvLyBkaWZmIGFuZCBwYXRjaC5cbiAgdmFyIGVudHJ5ID0gcG9vbHMuZWxlbWVudE9iamVjdC5nZXQoKTtcblxuICAvLyBBZGQgdG8gaW50ZXJuYWwgbG9va3VwLlxuICBtYWtlLm5vZGVzW2VudHJ5LmVsZW1lbnRdID0gbm9kZTtcblxuICBlbnRyeS5ub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgZW50cnkubm9kZVZhbHVlID0gbm9kZVZhbHVlO1xuICBlbnRyeS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gIGVudHJ5LmF0dHJpYnV0ZXMubGVuZ3RoID0gMDtcblxuICBpZiAocHJvdGVjdCkge1xuICAgIHByb3RlY3RFbGVtZW50KGVudHJ5KTtcbiAgfVxuXG4gIC8vIENvbGxlY3QgYXR0cmlidXRlcy5cbiAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIG5vIGF0dHJpYnV0ZXMsIHNraXAgb3Zlci5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgYXR0cmlidXRlc0xlbmd0aCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXNMZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cmlidXRlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyID0gcG9vbHMuYXR0cmlidXRlT2JqZWN0LmdldCgpO1xuXG4gICAgICAgIGlmIChwcm90ZWN0KSB7XG4gICAgICAgICAgcG9vbHMuYXR0cmlidXRlT2JqZWN0LnByb3RlY3QoYXR0cik7XG4gICAgICAgIH1cblxuICAgICAgICBhdHRyLm5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG4gICAgICAgIGF0dHIudmFsdWUgPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xuXG4gICAgICAgIGVudHJ5LmF0dHJpYnV0ZXNbZW50cnkuYXR0cmlidXRlcy5sZW5ndGhdID0gYXR0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb2xsZWN0IGNoaWxkTm9kZXMuXG4gIHZhciBjaGlsZE5vZGVzID0gbm9kZS5jaGlsZE5vZGVzO1xuICB2YXIgY2hpbGROb2Rlc0xlbmd0aCA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIGNoaWxkIG5vZGVzLCBjb252ZXJ0IHRoZW0gYWxsIHRvIHZpcnR1YWwgbm9kZXMuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSAzICYmIGNoaWxkTm9kZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5ld05vZGUgPSBtYWtlKGNoaWxkTm9kZXNbaV0sIHByb3RlY3QpO1xuXG4gICAgICBpZiAobmV3Tm9kZSkge1xuICAgICAgICBlbnRyeS5jaGlsZE5vZGVzW2VudHJ5LmNoaWxkTm9kZXMubGVuZ3RoXSA9IG5ld05vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyBSZW5hbWUgdGhpcyB0byBmaXJzdC1ydW4sIGJlY2F1c2Ugd2UncmUgY2FsbGluZyB0aGUgYXR0YWNoIGNhbGxiYWNrXG4gIC8vIGFuZCBwcm90ZWN0aW5nIG5vdy5cbiAgaWYgKHByb3RlY3QpIHtcbiAgICBpZiAoX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tlbnRyeS5ub2RlTmFtZV0pIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gZm9yIHRoaXMgZWxlbWVudC4gVXBncmFkZSB3aWxsIHJldHVybiBgdHJ1ZWBcbiAgICAgIC8vIGlmIHRoZSBlbGVtZW50IHdhcyB1cGdyYWRlZCBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMgaXMgdXNlZnVsIHNvIHdlXG4gICAgICAvLyBkb24ndCBlbmQgdXAgaW4gYSBsb29wIHdoZW4gd29ya2luZyB3aXRoIHRoZSBzYW1lIGVsZW1lbnQuXG4gICAgICBpZiAoKDAsIF9lbGVtZW50Q3VzdG9tLnVwZ3JhZGUpKGVudHJ5Lm5vZGVOYW1lLCBub2RlKSkge1xuICAgICAgICAvLyBJZiB0aGUgTm9kZSBpcyBpbiB0aGUgRE9NLCB0cmlnZ2VyIGF0dGFjaGVkIGNhbGxiYWNrLlxuICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUuYXR0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICAgIG5vZGUuYXR0YWNoZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmJXRnJaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096dHhRa0Z4UW5kQ0xFbEJRVWs3TzNsQ1FYSkNTU3hsUVVGbE96c3dRa0ZKZUVNc1owSkJRV2RDT3pzMlFrRkRZU3h0UWtGQmJVSTdPMEZCUlhaRUxFbEJRVWtzUzBGQlN5eHRRa0ZCVXl4RFFVRkRPMEZCUTI1Q0xFbEJRVWtzWTBGQll5dzJRa0ZCYTBJc1EwRkJRenRCUVVOeVF5eEpRVUZKTEdkQ1FVRm5RaXdyUWtGQmIwSXNRMEZCUXp0QlFVTjZReXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPenRCUVVkbUxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPenM3T3pzN096czdRVUZSUkN4VFFVRlRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlF6RkRMRTFCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZETjBJc1RVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXpzN1FVRkZMMElzVFVGQlNTeERRVUZETEZGQlFWRXNTVUZCU1N4UlFVRlJMRXRCUVVzc1EwRkJReXhKUVVGSkxGRkJRVkVzUzBGQlN5eERRVUZETEVsQlFVa3NVVUZCVVN4TFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVOdVJTeFhRVUZQTEV0QlFVc3NRMEZCUXp0SFFVTmtPenRCUVVWRUxFMUJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJUdEJRVU4yUXl4WFFVRlBMRXRCUVVzc1EwRkJRenRIUVVOa096czdPMEZCU1VRc1RVRkJTU3hMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenM3TzBGQlIzUkRMRTFCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRmFrTXNUMEZCU3l4RFFVRkRMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMEZCUXpkRExFOUJRVXNzUTBGQlF5eFRRVUZUTEVkQlFVY3NVMEZCVXl4RFFVRkRPMEZCUXpWQ0xFOUJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVNMVFpeFBRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJUVkNMRTFCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMWdzYTBKQlFXTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRIUVVOMlFqczdPMEZCUjBRc1RVRkJTU3hWUVVGVkxFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXpzN08wRkJSMnBETEUxQlFVa3NWVUZCVlN4RlFVRkZPMEZCUTJRc1VVRkJTU3huUWtGQlowSXNSMEZCUnl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRE96dEJRVVY2UXl4UlFVRkpMR2RDUVVGblFpeEZRVUZGTzBGQlEzQkNMRmRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4blFrRkJaMElzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTjZReXhaUVVGSkxFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE96dEJRVVYyUXl4WlFVRkpMRTlCUVU4c1JVRkJSVHRCUVVOWUxHVkJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xTkJRM0pET3p0QlFVVkVMRmxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNdlFpeFpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTTdPMEZCUldwRExHRkJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdUMEZEYkVRN1MwRkRSanRIUVVOR096czdRVUZIUkN4TlFVRkpMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETzBGQlEycERMRTFCUVVrc1owSkJRV2RDTEVkQlFVY3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU03T3p0QlFVYzVReXhOUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEV0QlFVc3NRMEZCUXl4SlFVRkpMRlZCUVZVc1JVRkJSVHRCUVVOeVF5eFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzWjBKQlFXZENMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRGVrTXNWVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRk0wTXNWVUZCU1N4UFFVRlBMRVZCUVVVN1FVRkRXQ3hoUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETzA5QlEzSkVPMHRCUTBZN1IwRkRSanM3T3p0QlFVbEVMRTFCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMWdzVVVGQlNTd3dRa0ZCVnl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVVU3T3pzN1FVRkpPVUlzVlVGQlNTdzBRa0ZCVVN4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eEZRVUZGT3p0QlFVVnFReXhaUVVGSkxFbEJRVWtzUTBGQlF5eFZRVUZWTEVsQlFVa3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTzBGQlF6VkRMR05CUVVrc1EwRkJReXhuUWtGQlowSXNSVUZCUlN4RFFVRkRPMU5CUTNwQ08wOUJRMFk3UzBGRFJqdEhRVU5HT3p0QlFVVkVMRk5CUVU4c1MwRkJTeXhEUVVGRE8wTkJRMlFpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2Ym05a1pTOXRZV3RsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIc2djRzl2YkhNZ1lYTWdYM0J2YjJ4eklIMGdabkp2YlNBbkxpNHZkWFJwYkM5d2IyOXNjeWM3WEc1cGJYQnZjblFnZTF4dUlDQndjbTkwWldOMFJXeGxiV1Z1ZENCaGN5QmZjSEp2ZEdWamRFVnNaVzFsYm5Rc1hHNGdJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUWdZWE1nWDNWdWNISnZkR1ZqZEVWc1pXMWxiblJjYm4wZ1puSnZiU0FuTGk0dmRYUnBiQzl0WlcxdmNua25PMXh1YVcxd2IzSjBJSHNnWTI5dGNHOXVaVzUwY3l3Z2RYQm5jbUZrWlNCOUlHWnliMjBnSnk0dUwyVnNaVzFsYm5RdlkzVnpkRzl0Snp0Y2JseHVkbUZ5SUhCdmIyeHpJRDBnWDNCdmIyeHpPMXh1ZG1GeUlIQnliM1JsWTNSRmJHVnRaVzUwSUQwZ1gzQnliM1JsWTNSRmJHVnRaVzUwTzF4dWRtRnlJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUWdQU0JmZFc1d2NtOTBaV04wUld4bGJXVnVkRHRjYm5aaGNpQmxiWEIwZVNBOUlIdDlPMXh1WEc0dkx5QkRZV05vWlNCamNtVmhkR1ZrSUc1dlpHVnpJR2x1YzJsa1pTQjBhR2x6SUc5aWFtVmpkQzVjYm0xaGEyVXVibTlrWlhNZ1BTQjdmVHRjYmx4dUx5b3FYRzRnS2lCRGIyNTJaWEowY3lCaElHeHBkbVVnYm05a1pTQnBiblJ2SUdFZ2RtbHlkSFZoYkNCdWIyUmxMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQnViMlJsWEc0Z0tpQkFjbVYwZFhKdVhHNGdLaTljYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1oxYm1OMGFXOXVJRzFoYTJVb2JtOWtaU3dnY0hKdmRHVmpkQ2tnZTF4dUlDQnNaWFFnYm05a1pWUjVjR1VnUFNCdWIyUmxMbTV2WkdWVWVYQmxPMXh1SUNCc1pYUWdibTlrWlZaaGJIVmxJRDBnYm05a1pTNXViMlJsVm1Gc2RXVTdYRzVjYmlBZ2FXWWdLQ0Z1YjJSbFZIbHdaU0I4ZkNCdWIyUmxWSGx3WlNBOVBUMGdNaUI4ZkNCdWIyUmxWSGx3WlNBOVBUMGdOQ0I4ZkNCdWIyUmxWSGx3WlNBOVBUMGdPQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2h1YjJSbFZIbHdaU0E5UFQwZ015QW1KaUFoYm05a1pWWmhiSFZsTG5SeWFXMG9LU2tnZTF4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdmVnh1WEc0Z0lDOHZJRlpwY25SMVlXd2djbVZ3Y21WelpXNTBZWFJwYjI0Z2IyWWdZU0J1YjJSbExDQmpiMjUwWVdsdWFXNW5JRzl1YkhrZ2RHaGxJR1JoZEdFZ2QyVWdkMmx6YUNCMGIxeHVJQ0F2THlCa2FXWm1JR0Z1WkNCd1lYUmphQzVjYmlBZ2JHVjBJR1Z1ZEhKNUlEMGdjRzl2YkhNdVpXeGxiV1Z1ZEU5aWFtVmpkQzVuWlhRb0tUdGNibHh1SUNBdkx5QkJaR1FnZEc4Z2FXNTBaWEp1WVd3Z2JHOXZhM1Z3TGx4dUlDQnRZV3RsTG01dlpHVnpXMlZ1ZEhKNUxtVnNaVzFsYm5SZElEMGdibTlrWlR0Y2JseHVJQ0JsYm5SeWVTNXViMlJsVG1GdFpTQTlJRzV2WkdVdWJtOWtaVTVoYldVdWRHOU1iM2RsY2tOaGMyVW9LVHRjYmlBZ1pXNTBjbmt1Ym05a1pWWmhiSFZsSUQwZ2JtOWtaVlpoYkhWbE8xeHVJQ0JsYm5SeWVTNWphR2xzWkU1dlpHVnpMbXhsYm1kMGFDQTlJREE3WEc0Z0lHVnVkSEo1TG1GMGRISnBZblYwWlhNdWJHVnVaM1JvSUQwZ01EdGNibHh1SUNCcFppQW9jSEp2ZEdWamRDa2dlMXh1SUNBZ0lIQnliM1JsWTNSRmJHVnRaVzUwS0dWdWRISjVLVHRjYmlBZ2ZWeHVYRzRnSUM4dklFTnZiR3hsWTNRZ1lYUjBjbWxpZFhSbGN5NWNiaUFnYkdWMElHRjBkSEpwWW5WMFpYTWdQU0J1YjJSbExtRjBkSEpwWW5WMFpYTTdYRzVjYmlBZ0x5OGdTV1lnZEdobElHVnNaVzFsYm5RZ2FHRnpJRzV2SUdGMGRISnBZblYwWlhNc0lITnJhWEFnYjNabGNpNWNiaUFnYVdZZ0tHRjBkSEpwWW5WMFpYTXBJSHRjYmlBZ0lDQnNaWFFnWVhSMGNtbGlkWFJsYzB4bGJtZDBhQ0E5SUdGMGRISnBZblYwWlhNdWJHVnVaM1JvTzF4dVhHNGdJQ0FnYVdZZ0tHRjBkSEpwWW5WMFpYTk1aVzVuZEdncElIdGNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dZWFIwY21saWRYUmxjMHhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0JoZEhSeUlEMGdjRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wTG1kbGRDZ3BPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHdjbTkwWldOMEtTQjdYRzRnSUNBZ0lDQWdJQ0FnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuQnliM1JsWTNRb1lYUjBjaWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmhkSFJ5TG01aGJXVWdQU0JoZEhSeWFXSjFkR1Z6VzJsZExtNWhiV1U3WEc0Z0lDQWdJQ0FnSUdGMGRISXVkbUZzZFdVZ1BTQmhkSFJ5YVdKMWRHVnpXMmxkTG5aaGJIVmxPMXh1WEc0Z0lDQWdJQ0FnSUdWdWRISjVMbUYwZEhKcFluVjBaWE5iWlc1MGNua3VZWFIwY21saWRYUmxjeTVzWlc1bmRHaGRJRDBnWVhSMGNqdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZMeUJEYjJ4c1pXTjBJR05vYVd4a1RtOWtaWE11WEc0Z0lHeGxkQ0JqYUdsc1pFNXZaR1Z6SUQwZ2JtOWtaUzVqYUdsc1pFNXZaR1Z6TzF4dUlDQnNaWFFnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ0E5SUc1dlpHVXVZMmhwYkdST2IyUmxjeTVzWlc1bmRHZzdYRzVjYmlBZ0x5OGdTV1lnZEdobElHVnNaVzFsYm5RZ2FHRnpJR05vYVd4a0lHNXZaR1Z6TENCamIyNTJaWEowSUhSb1pXMGdZV3hzSUhSdklIWnBjblIxWVd3Z2JtOWtaWE11WEc0Z0lHbG1JQ2h1YjJSbExtNXZaR1ZVZVhCbElDRTlQU0F6SUNZbUlHTm9hV3hrVG05a1pYTXBJSHRjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJR05vYVd4a1RtOWtaWE5NWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzVsZDA1dlpHVWdQU0J0WVd0bEtHTm9hV3hrVG05a1pYTmJhVjBzSUhCeWIzUmxZM1FwTzF4dVhHNGdJQ0FnSUNCcFppQW9ibVYzVG05a1pTa2dlMXh1SUNBZ0lDQWdJQ0JsYm5SeWVTNWphR2xzWkU1dlpHVnpXMlZ1ZEhKNUxtTm9hV3hrVG05a1pYTXViR1Z1WjNSb1hTQTlJRzVsZDA1dlpHVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeThnVkU5RVR5QlNaVzVoYldVZ2RHaHBjeUIwYnlCbWFYSnpkQzF5ZFc0c0lHSmxZMkYxYzJVZ2QyVW5jbVVnWTJGc2JHbHVaeUIwYUdVZ1lYUjBZV05vSUdOaGJHeGlZV05yWEc0Z0lDOHZJR0Z1WkNCd2NtOTBaV04wYVc1bklHNXZkeTVjYmlBZ2FXWWdLSEJ5YjNSbFkzUXBJSHRjYmlBZ0lDQnBaaUFvWTI5dGNHOXVaVzUwYzF0bGJuUnllUzV1YjJSbFRtRnRaVjBwSUh0Y2JpQWdJQ0FnSUM4dklGSmxjMlYwSUhSb1pTQndjbTkwYjNSNWNHVWdZMmhoYVc0Z1ptOXlJSFJvYVhNZ1pXeGxiV1Z1ZEM0Z1ZYQm5jbUZrWlNCM2FXeHNJSEpsZEhWeWJpQmdkSEoxWldCY2JpQWdJQ0FnSUM4dklHbG1JSFJvWlNCbGJHVnRaVzUwSUhkaGN5QjFjR2R5WVdSbFpDQm1iM0lnZEdobElHWnBjbk4wSUhScGJXVXVJRlJvYVhNZ2FYTWdkWE5sWm5Wc0lITnZJSGRsWEc0Z0lDQWdJQ0F2THlCa2IyNG5kQ0JsYm1RZ2RYQWdhVzRnWVNCc2IyOXdJSGRvWlc0Z2QyOXlhMmx1WnlCM2FYUm9JSFJvWlNCellXMWxJR1ZzWlcxbGJuUXVYRzRnSUNBZ0lDQnBaaUFvZFhCbmNtRmtaU2hsYm5SeWVTNXViMlJsVG1GdFpTd2dibTlrWlNrcElIdGNiaUFnSUNBZ0lDQWdMeThnU1dZZ2RHaGxJRTV2WkdVZ2FYTWdhVzRnZEdobElFUlBUU3dnZEhKcFoyZGxjaUJoZEhSaFkyaGxaQ0JqWVd4c1ltRmpheTVjYmlBZ0lDQWdJQ0FnYVdZZ0tHNXZaR1V1Y0dGeVpXNTBUbTlrWlNBbUppQnViMlJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnViMlJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnNvS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCbGJuUnllVHRjYm4xY2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucmVsZWFzZU5vZGUgPSByZWxlYXNlTm9kZTtcbmV4cG9ydHMucGF0Y2hOb2RlID0gcGF0Y2hOb2RlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfY3VzdG9tRXZlbnQgPSByZXF1aXJlKCdjdXN0b20tZXZlbnQnKTtcblxudmFyIF9jdXN0b21FdmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jdXN0b21FdmVudCk7XG5cbnZhciBfd29ya2VyQ3JlYXRlID0gcmVxdWlyZSgnLi4vd29ya2VyL2NyZWF0ZScpO1xuXG52YXIgX3V0aWxNZW1vcnkgPSByZXF1aXJlKCcuLi91dGlsL21lbW9yeScpO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsUGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbC9wYXJzZXInKTtcblxudmFyIF9wYXRjaGVzUHJvY2VzcyA9IHJlcXVpcmUoJy4uL3BhdGNoZXMvcHJvY2VzcycpO1xuXG52YXIgX3BhdGNoZXNQcm9jZXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhdGNoZXNQcm9jZXNzKTtcblxudmFyIF9tYWtlID0gcmVxdWlyZSgnLi9tYWtlJyk7XG5cbnZhciBfbWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYWtlKTtcblxudmFyIF9lbGVtZW50TWFrZSA9IHJlcXVpcmUoJy4uL2VsZW1lbnQvbWFrZScpO1xuXG52YXIgX2VsZW1lbnRNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRNYWtlKTtcblxudmFyIF9zeW5jID0gcmVxdWlyZSgnLi9zeW5jJyk7XG5cbnZhciBfc3luYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zeW5jKTtcblxudmFyIF90cmVlID0gcmVxdWlyZSgnLi90cmVlJyk7XG5cbi8qKlxuICogV2hlbiB0aGUgd29ya2VyIGNvbXBsZXRlcywgY2xlYW4gdXAgbWVtb3J5IGFuZCBzY2hlZHVsZSB0aGUgbmV4dCByZW5kZXIgaWZcbiAqIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIGVsZW1lbnRNZXRhXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChldikge1xuICAgIHZhciBub2RlcyA9IGV2LmRhdGEubm9kZXM7XG5cbiAgICAvLyBBZGQgbmV3IGVsZW1lbnRzLlxuICAgIGlmIChub2Rlcy5hZGRpdGlvbnMubGVuZ3RoKSB7XG4gICAgICBub2Rlcy5hZGRpdGlvbnMubWFwKF91dGlsTWVtb3J5LnByb3RlY3RFbGVtZW50KS5tYXAoZnVuY3Rpb24gKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgLy8gSW5qZWN0IGludG8gdGhlIGBvbGRUcmVlYCBzbyBpdCdzIGNsZWFuZWQgdXAgY29ycmVjdGx5LlxuICAgICAgICBlbGVtZW50TWV0YS5vbGRUcmVlLmNoaWxkTm9kZXMucHVzaChkZXNjcmlwdG9yKTtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICB9KS5mb3JFYWNoKF9lbGVtZW50TWFrZTJbJ2RlZmF1bHQnXSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBsZXRlUmVuZGVyID0gZnVuY3Rpb24gY29tcGxldGVSZW5kZXIoKSB7XG4gICAgICAvLyBSZW1vdmUgdW51c2VkIGVsZW1lbnRzLlxuICAgICAgaWYgKG5vZGVzLnJlbW92YWxzLmxlbmd0aCkge1xuICAgICAgICBub2Rlcy5yZW1vdmFscy5tYXAoZnVuY3Rpb24gKHV1aWQpIHtcbiAgICAgICAgICByZXR1cm4gX3V0aWxQb29scy5wb29scy5lbGVtZW50T2JqZWN0Ll91dWlkW3V1aWRdO1xuICAgICAgICB9KS5mb3JFYWNoKF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXNldCBpbnRlcm5hbCBjYWNoZXMgZm9yIHF1aWNrZXIgbG9va3VwcyBpbiB0aGUgZnV0dXJlcy5cbiAgICAgIGVsZW1lbnRNZXRhLl9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcbiAgICAgIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgPSBlbGVtZW50Lm91dGVySFRNTDtcbiAgICAgIGVsZW1lbnRNZXRhLl90ZXh0Q29udGVudCA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cbiAgICAgIC8vIFJlY3ljbGUgYWxsIHVucHJvdGVjdGVkIGFsbG9jYXRpb25zLlxuICAgICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuXG4gICAgICBlbGVtZW50TWV0YS5oYXNXb3JrZXJSZW5kZXJlZCA9IHRydWU7XG4gICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgICAvLyBUaGlzIGlzIGRlc2lnbmVkIHRvIGhhbmRsZSB1c2UgY2FzZXMgd2hlcmUgcmVuZGVycyBhcmUgYmVpbmcgaGFtbWVyZWRcbiAgICAgIC8vIG9yIHdoZW4gdHJhbnNpdGlvbnMgYXJlIHVzZWQgd2l0aCBQcm9taXNlcy5cbiAgICAgIGlmIChlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIpIHtcbiAgICAgICAgdmFyIG5leHRSZW5kZXIgPSBlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXI7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIGJ1ZmZlci5cbiAgICAgICAgZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIE5vdGljaW5nIHNvbWUgd2VpcmQgcGVyZm9ybWFuY2UgaW1wbGljYXRpb25zIHdpdGggdGhpcyBjb25jZXB0LlxuICAgICAgICBwYXRjaE5vZGUoZWxlbWVudCwgbmV4dFJlbmRlci5uZXdIVE1MLCBuZXh0UmVuZGVyLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNwYXRjaCBhbiBldmVudCBvbiB0aGUgZWxlbWVudCBvbmNlIHJlbmRlcmluZyBoYXMgY29tcGxldGVkLlxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBfY3VzdG9tRXZlbnQyWydkZWZhdWx0J10oJ3JlbmRlckNvbXBsZXRlJykpO1xuICAgIH07XG5cbiAgICAvLyBXYWl0IHVudGlsIGFsbCBwcm9taXNlcyBoYXZlIHJlc29sdmVkLCBiZWZvcmUgZmluaXNoaW5nIHVwIHRoZSBwYXRjaFxuICAgIC8vIGN5Y2xlLlxuICAgIC8vIFByb2Nlc3MgdGhlIGRhdGEgaW1tZWRpYXRlbHkgYW5kIHdhaXQgdW50aWwgYWxsIHRyYW5zaXRpb24gY2FsbGJhY2tzXG4gICAgLy8gaGF2ZSBjb21wbGV0ZWQuXG4gICAgdmFyIHByb2Nlc3NQcm9taXNlID0gKDAsIF9wYXRjaGVzUHJvY2VzczJbJ2RlZmF1bHQnXSkoZWxlbWVudCwgZXYuZGF0YS5wYXRjaGVzKTtcblxuICAgIC8vIE9wZXJhdGUgc3luY2hyb25vdXNseSB1bmxlc3Mgb3B0ZWQgaW50byBhIFByb21pc2UtY2hhaW4uXG4gICAgaWYgKHByb2Nlc3NQcm9taXNlKSB7XG4gICAgICBwcm9jZXNzUHJvbWlzZS50aGVuKGNvbXBsZXRlUmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVSZW5kZXIoKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUmVsZWFzZSdzIHRoZSBhbGxvY2F0ZWQgb2JqZWN0cyBhbmQgcmVjeWNsZXMgaW50ZXJuYWwgbWVtb3J5LlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gcmVsZWFzZU5vZGUoZWxlbWVudCkge1xuICB2YXIgZWxlbWVudE1ldGEgPSBfdHJlZS5UcmVlQ2FjaGUuZ2V0KGVsZW1lbnQpIHx8IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIGEgd29ya2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVsZW1lbnQsIHRoZW4ga2lsbCBpdC5cbiAgaWYgKGVsZW1lbnRNZXRhLndvcmtlcikge1xuICAgIGVsZW1lbnRNZXRhLndvcmtlci50ZXJtaW5hdGUoKTtcbiAgfVxuXG4gIC8vIElmIHRoZXJlIHdhcyBhIHRyZWUgc2V0IHVwLCByZWN5Y2xlIHRoZSBtZW1vcnkgYWxsb2NhdGVkIGZvciBpdC5cbiAgaWYgKGVsZW1lbnRNZXRhLm9sZFRyZWUpIHtcbiAgICAoMCwgX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudCkoZWxlbWVudE1ldGEub2xkVHJlZSk7XG4gICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoaXMgZWxlbWVudCdzIG1ldGEgb2JqZWN0IGZyb20gdGhlIGNhY2hlLlxuICBfdHJlZS5UcmVlQ2FjaGVbJ2RlbGV0ZSddKGVsZW1lbnQpO1xufVxuXG4vKipcbiAqIFBhdGNoZXMgYW4gZWxlbWVudCdzIERPTSB0byBtYXRjaCB0aGF0IG9mIHRoZSBwYXNzZWQgbWFya3VwLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gbmV3SFRNTFxuICovXG5cbmZ1bmN0aW9uIHBhdGNoTm9kZShlbGVtZW50LCBuZXdIVE1MLCBvcHRpb25zKSB7XG4gIC8vIEVuc3VyZSB0aGF0IHRoZSBkb2N1bWVudCBkaXNhYmxlIHdvcmtlciBpcyBhbHdheXMgcGlja2VkIHVwLlxuICBpZiAodHlwZW9mIG9wdGlvbnMuZW5hYmxlV29ya2VyICE9PSAnYm9vbGVhbicpIHtcbiAgICBvcHRpb25zLmVuYWJsZVdvcmtlciA9IGRvY3VtZW50LkVOQUJMRV9XT1JLRVI7XG4gIH1cblxuICB2YXIgZWxlbWVudE1ldGEgPSBfdHJlZS5UcmVlQ2FjaGUuZ2V0KGVsZW1lbnQpIHx8IHt9O1xuXG4gIC8vIEFsd2F5cyBlbnN1cmUgdGhlIG1vc3QgdXAtdG8tZGF0ZSBtZXRhIG9iamVjdCBpcyBzdG9yZWQuXG4gIF90cmVlLlRyZWVDYWNoZS5zZXQoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuXG4gIGlmIChlbGVtZW50TWV0YS5pc1JlbmRlcmluZykge1xuICAgIC8vIEFkZCB0aGlzIG5ldyByZW5kZXIgaW50byB0aGUgYnVmZmVyIHF1ZXVlLlxuICAgIGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlciA9IHsgbmV3SFRNTDogbmV3SFRNTCwgb3B0aW9uczogb3B0aW9ucyB9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLCBhYm9ydC5cbiAgdmFyIGRpZmZlcmVudElubmVySFRNTCA9IG9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudC5pbm5lckhUTUwgPT09IG5ld0hUTUw7XG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLCBhYm9ydC5cbiAgdmFyIGRpZmZlcmVudE91dGVySFRNTCA9ICFvcHRpb25zLmlubmVyICYmIGVsZW1lbnQub3V0ZXJIVE1MID09PSBuZXdIVE1MO1xuXG4gIC8vIFN0YXJ0IHdpdGggd29ya2VyIGJlaW5nIGEgZmFsc3kgdmFsdWUuXG4gIHZhciB3b3JrZXIgPSBudWxsO1xuXG4gIC8vIElmIHdlIGNhbiB1c2UgYSB3b3JrZXIgYW5kIHRoZSB1c2VyIHdhbnRzIG9uZSwgdHJ5IGFuZCBjcmVhdGUgaXQuXG4gIGlmIChvcHRpb25zLmVuYWJsZVdvcmtlciAmJiBfd29ya2VyQ3JlYXRlLmhhc1dvcmtlcikge1xuICAgIC8vIENyZWF0ZSBhIHdvcmtlciBmb3IgdGhpcyBlbGVtZW50LlxuICAgIHdvcmtlciA9IGVsZW1lbnRNZXRhLndvcmtlciA9IGVsZW1lbnRNZXRhLndvcmtlciB8fCAoMCwgX3dvcmtlckNyZWF0ZS5jcmVhdGUpKCk7XG4gIH1cblxuICAvLyBBbmQgZW5zdXJlIHRoYXQgYW4gYG9sZFRyZWVgIGV4aXN0cywgb3RoZXJ3aXNlIHRoaXMgaXMgdGhlIGZpcnN0IHJlbmRlclxuICAvLyBwb3RlbnRpYWxseS5cbiAgaWYgKChkaWZmZXJlbnRJbm5lckhUTUwgfHwgZGlmZmVyZW50T3V0ZXJIVE1MKSAmJiBlbGVtZW50TWV0YS5vbGRUcmVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKFxuICAvLyBJZiB0aGUgb3BlcmF0aW9uIGlzIGBpbm5lckhUTUxgLCBhbmQgdGhlIGN1cnJlbnQgZWxlbWVudCdzIGNvbnRlbnRzIGhhdmVcbiAgLy8gY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCByZW5kZXIgbG9vcCwgcmVjYWxjdWxhdGUgdGhlIHRyZWUuXG4gIG9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudE1ldGEuX2lubmVySFRNTCAhPT0gZWxlbWVudC5pbm5lckhUTUwgfHxcblxuICAvLyBJZiB0aGUgb3BlcmF0aW9uIGlzIGBvdXRlckhUTUxgLCBhbmQgdGhlIGN1cnJlbnQgZWxlbWVudCdzIGNvbnRlbnRzIGhhdmVcbiAgLy8gY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCByZW5kZXIgbG9vcCwgcmVjYWxjdWxhdGUgdGhlIHRyZWUuXG4gICFvcHRpb25zLmlubmVyICYmIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgIT09IGVsZW1lbnQub3V0ZXJIVE1MIHx8XG5cbiAgLy8gSWYgdGhlIHRleHQgY29udGVudCBldmVyIGNoYW5nZXMsIHJlY2FsY3VsYXRlIHRoZSB0cmVlLlxuICBlbGVtZW50TWV0YS5fdGV4dENvbnRlbnQgIT09IGVsZW1lbnQudGV4dENvbnRlbnQpIHtcbiAgICBpZiAoZWxlbWVudE1ldGEub2xkVHJlZSkge1xuICAgICAgKDAsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQpKGVsZW1lbnRNZXRhLm9sZFRyZWUpO1xuICAgICAgKDAsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5KSgpO1xuICAgIH1cblxuICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUgPSAoMCwgX21ha2UyWydkZWZhdWx0J10pKGVsZW1lbnQsIHRydWUpO1xuICAgIGVsZW1lbnRNZXRhLnVwZGF0ZU9sZFRyZWUgPSB0cnVlO1xuICB9XG5cbiAgLy8gV2lsbCB3YW50IHRvIGVuc3VyZSB0aGF0IHRoZSBmaXJzdCByZW5kZXIgd2VudCB0aHJvdWdoLCB0aGUgd29ya2VyIGNhblxuICAvLyB0YWtlIGEgYml0IHRvIHN0YXJ0dXAgYW5kIHdlIHdhbnQgdG8gc2hvdyBjaGFuZ2VzIGFzIHNvb24gYXMgcG9zc2libGUuXG4gIGlmIChvcHRpb25zLmVuYWJsZVdvcmtlciAmJiBfd29ya2VyQ3JlYXRlLmhhc1dvcmtlciAmJiB3b3JrZXIpIHtcbiAgICAvLyBTZXQgYSByZW5kZXIgbG9jayBhcyB0byBub3QgZmxvb2QgdGhlIHdvcmtlci5cbiAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IHRydWU7XG5cbiAgICAvLyBBdHRhY2ggYWxsIHByb3BlcnRpZXMgaGVyZSB0byB0cmFuc3BvcnQuXG4gICAgdmFyIHRyYW5zZmVyT2JqZWN0ID0ge307XG5cbiAgICAvLyBUaGlzIHNob3VsZCBvbmx5IG9jY3VyIG9uY2UsIG9yIHdoZW5ldmVyIHRoZSBtYXJrdXAgY2hhbmdlcyBleHRlcm5hbGx5XG4gICAgLy8gdG8gZGlmZkhUTUwuXG4gICAgaWYgKCFlbGVtZW50TWV0YS5oYXNXb3JrZXJSZW5kZXJlZCB8fCBlbGVtZW50TWV0YS51cGRhdGVPbGRUcmVlKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5vbGRUcmVlID0gZWxlbWVudE1ldGEub2xkVHJlZTtcbiAgICAgIGVsZW1lbnRNZXRhLnVwZGF0ZU9sZFRyZWUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBdHRhY2ggdGhlIHBhcmVudCBlbGVtZW50J3MgdXVpZC5cbiAgICB0cmFuc2Zlck9iamVjdC51dWlkID0gZWxlbWVudE1ldGEub2xkVHJlZS5lbGVtZW50O1xuXG4gICAgaWYgKHR5cGVvZiBuZXdIVE1MICE9PSAnc3RyaW5nJykge1xuICAgICAgdHJhbnNmZXJPYmplY3QubmV3VHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkobmV3SFRNTCk7XG5cbiAgICAgIC8vIFRyYW5zZmVyIHRoaXMgYnVmZmVyIHRvIHRoZSB3b3JrZXIsIHdoaWNoIHdpbGwgdGFrZSBvdmVyIGFuZCBwcm9jZXNzIHRoZVxuICAgICAgLy8gbWFya3VwLlxuICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHRyYW5zZmVyT2JqZWN0KTtcblxuICAgICAgLy8gV2FpdCBmb3IgdGhlIHdvcmtlciB0byBmaW5pc2ggcHJvY2Vzc2luZyBhbmQgdGhlbiBhcHBseSB0aGUgcGF0Y2hzZXQuXG4gICAgICB3b3JrZXIub25tZXNzYWdlID0gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGV0IHRoZSBicm93c2VyIGNvcHkgdGhlIEhUTUwgaW50byB0aGUgd29ya2VyLCBjb252ZXJ0aW5nIHRvIGFcbiAgICAvLyB0cmFuc2ZlcmFibGUgb2JqZWN0IGlzIHRvbyBleHBlbnNpdmUuXG4gICAgdHJhbnNmZXJPYmplY3QubmV3SFRNTCA9IG5ld0hUTUw7XG5cbiAgICAvLyBBZGQgcHJvcGVydGllcyB0byBzZW5kIHRvIHdvcmtlci5cbiAgICB0cmFuc2Zlck9iamVjdC5pc0lubmVyID0gb3B0aW9ucy5pbm5lcjtcblxuICAgIC8vIFRyYW5zZmVyIHRoaXMgYnVmZmVyIHRvIHRoZSB3b3JrZXIsIHdoaWNoIHdpbGwgdGFrZSBvdmVyIGFuZCBwcm9jZXNzIHRoZVxuICAgIC8vIG1hcmt1cC5cbiAgICB3b3JrZXIucG9zdE1lc3NhZ2UodHJhbnNmZXJPYmplY3QpO1xuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHdvcmtlciB0byBmaW5pc2ggcHJvY2Vzc2luZyBhbmQgdGhlbiBhcHBseSB0aGUgcGF0Y2hzZXQuXG4gICAgd29ya2VyLm9ubWVzc2FnZSA9IGNvbXBsZXRlV29ya2VyUmVuZGVyKGVsZW1lbnQsIGVsZW1lbnRNZXRhKTtcbiAgfSBlbHNlIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2UncmUgcmVuZGVyaW5nIGluIHRoZSBVSSB0aHJlYWQuXG4gICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IHRydWU7XG5cbiAgICAgIHZhciBwYXRjaGVzID0gW107XG4gICAgICB2YXIgbmV3VHJlZSA9IG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgbmV3SFRNTCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbmV3VHJlZSA9ICgwLCBfdXRpbFBhcnNlci5wYXJzZUhUTUwpKG5ld0hUTUwsIG9wdGlvbnMuaW5uZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkobmV3SFRNTCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmlubmVyKSB7XG4gICAgICAgIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZTtcblxuICAgICAgICBuZXdUcmVlID0ge1xuICAgICAgICAgIGNoaWxkTm9kZXM6IGNoaWxkTm9kZXMsXG5cbiAgICAgICAgICBhdHRyaWJ1dGVzOiBlbGVtZW50TWV0YS5vbGRUcmVlLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgZWxlbWVudDogZWxlbWVudE1ldGEub2xkVHJlZS5lbGVtZW50LFxuICAgICAgICAgIG5vZGVOYW1lOiBlbGVtZW50TWV0YS5vbGRUcmVlLm5vZGVOYW1lLFxuICAgICAgICAgIG5vZGVWYWx1ZTogZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlVmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9sZFRyZWVOYW1lID0gZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlTmFtZSB8fCAnJztcbiAgICAgIHZhciBuZXdOb2RlTmFtZSA9IG5ld1RyZWUgJiYgbmV3VHJlZS5ub2RlTmFtZTtcblxuICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgbm9kZSB0eXBlcyBtYXRjaCwgdHJ5IGFuZCBjb21wYXJlIHRoZW0uXG4gICAgICBpZiAob2xkVHJlZU5hbWUgPT09IG5ld05vZGVOYW1lKSB7XG4gICAgICAgIC8vIFN5bmNocm9uaXplIHRoZSB0cmVlLlxuICAgICAgICBfc3luYzJbJ2RlZmF1bHQnXS5jYWxsKHBhdGNoZXMsIGVsZW1lbnRNZXRhLm9sZFRyZWUsIG5ld1RyZWUpO1xuICAgICAgfVxuICAgICAgLy8gT3RoZXJ3aXNlIHJlcGxhY2UgdGhlIHRvcCBsZXZlbCBlbGVtZW50cy5cbiAgICAgIGVsc2UgaWYgKG5ld0hUTUwpIHtcbiAgICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgICAgICAgIF9fZG9fXzogMCxcbiAgICAgICAgICAgIG9sZDogZWxlbWVudE1ldGEub2xkVHJlZSxcbiAgICAgICAgICAgICduZXcnOiBuZXdUcmVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgICgwLCBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50KShlbGVtZW50TWV0YS5vbGRUcmVlKTtcblxuICAgICAgICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUgPSBuZXdUcmVlO1xuICAgICAgICB9XG5cbiAgICAgIHZhciBjb21wbGV0ZVJlbmRlciA9IGZ1bmN0aW9uIGNvbXBsZXRlUmVuZGVyKCkge1xuICAgICAgICAvLyBNYXJrIHRoYXQgdGhpcyBlbGVtZW50IGhhcyBpbml0aWFsbHkgcmVuZGVyZWQgYW5kIGlzIGRvbmUgcmVuZGVyaW5nLlxuICAgICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIFNldCB0aGUgaW5uZXJIVE1MLlxuICAgICAgICBlbGVtZW50TWV0YS5faW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgPSBlbGVtZW50Lm91dGVySFRNTDtcbiAgICAgICAgZWxlbWVudE1ldGEuX3RleHRDb250ZW50ID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgICAgICAoMCwgX3V0aWxNZW1vcnkuY2xlYW5NZW1vcnkpKCk7XG5cbiAgICAgICAgLy8gQ2xlYW4gb3V0IHRoZSBwYXRjaGVzIGFycmF5LlxuICAgICAgICBwYXRjaGVzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYW4gZXZlbnQgb24gdGhlIGVsZW1lbnQgb25jZSByZW5kZXJpbmcgaGFzIGNvbXBsZXRlZC5cbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBfY3VzdG9tRXZlbnQyWydkZWZhdWx0J10oJ3JlbmRlckNvbXBsZXRlJykpO1xuXG4gICAgICAgIC8vIFRPRE8gVXBkYXRlIHRoaXMgY29tbWVudCBhbmQvb3IgcmVmYWN0b3IgdG8gdXNlIHRoZSBzYW1lIGFzIHRoZSBXb3JrZXIuXG4gICAgICAgIGlmIChlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIpIHtcbiAgICAgICAgICB2YXIgbmV4dFJlbmRlciA9IGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlcjtcbiAgICAgICAgICBlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAvLyBOb3RpY2luZyBzb21lIHdlaXJkIHBlcmZvcm1hbmNlIGltcGxpY2F0aW9ucyB3aXRoIHRoaXMgY29uY2VwdC5cbiAgICAgICAgICBwYXRjaE5vZGUoZWxlbWVudCwgbmV4dFJlbmRlci5uZXdIVE1MLCBuZXh0UmVuZGVyLm9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBQcm9jZXNzIHRoZSBkYXRhIGltbWVkaWF0ZWx5IGFuZCB3YWl0IHVudGlsIGFsbCB0cmFuc2l0aW9uIGNhbGxiYWNrc1xuICAgICAgLy8gaGF2ZSBjb21wbGV0ZWQuXG4gICAgICB2YXIgcHJvY2Vzc1Byb21pc2UgPSAoMCwgX3BhdGNoZXNQcm9jZXNzMlsnZGVmYXVsdCddKShlbGVtZW50LCBwYXRjaGVzKTtcblxuICAgICAgLy8gT3BlcmF0ZSBzeW5jaHJvbm91c2x5IHVubGVzcyBvcHRlZCBpbnRvIGEgUHJvbWlzZS1jaGFpbi5cbiAgICAgIGlmIChwcm9jZXNzUHJvbWlzZSkge1xuICAgICAgICBwcm9jZXNzUHJvbWlzZS50aGVuKGNvbXBsZXRlUmVuZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRlUmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2Y0dGMFkyZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenN5UWtGQmQwSXNZMEZCWXpzN096czBRa0ZEV1N4clFrRkJhMEk3T3pCQ1FVTk9MR2RDUVVGblFqczdlVUpCUTNoRUxHVkJRV1U3T3pCQ1FVTllMR2RDUVVGblFqczdPRUpCUTJZc2IwSkJRVzlDT3pzN08yOUNRVU14UWl4UlFVRlJPenM3T3pKQ1FVTk1MR2xDUVVGcFFqczdPenR2UWtGRGNFSXNVVUZCVVRzN096dHZRa0ZEU0N4UlFVRlJPenM3T3pzN096czdPMEZCVld4RExGTkJRVk1zYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUlVGQlJUdEJRVU5zUkN4VFFVRlBMRlZCUVZNc1JVRkJSU3hGUVVGRk8wRkJRMnhDTEZGQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZET3pzN1FVRkhNVUlzVVVGQlNTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVNeFFpeFhRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc05FSkJRV2RDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1ZVRkJWU3hGUVVGSk96dEJRVVZ3UkN4dFFrRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRMmhFTEdWQlFVOHNWVUZCVlN4RFFVRkRPMDlCUTI1Q0xFTkJRVU1zUTBGQlF5eFBRVUZQTERCQ1FVRmhMRU5CUVVNN1MwRkRla0k3TzBGQlJVUXNVVUZCU1N4alFVRmpMRWRCUVVjc1UwRkJha0lzWTBGQll5eEhRVUZqT3p0QlFVVTVRaXhWUVVGSkxFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNwQ0xHRkJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1NVRkJTVHRwUWtGQlNTeHBRa0ZCVFN4aFFVRmhMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF6dFRRVUZCTEVOQlFVTXNRMEZEZUVRc1QwRkJUeXc0UWtGQmEwSXNRMEZCUXp0UFFVTTVRanM3TzBGQlIwUXNhVUpCUVZjc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXp0QlFVTXpReXhwUWtGQlZ5eERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRek5ETEdsQ1FVRlhMRU5CUVVNc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVjdlF5eHZRMEZCWVN4RFFVRkRPenRCUVVWa0xHbENRVUZYTEVOQlFVTXNhVUpCUVdsQ0xFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzSkRMR2xDUVVGWExFTkJRVU1zVjBGQlZ5eEhRVUZITEV0QlFVc3NRMEZCUXpzN096dEJRVWxvUXl4VlFVRkpMRmRCUVZjc1EwRkJReXhaUVVGWkxFVkJRVVU3UVVGRE5VSXNXVUZCU1N4VlFVRlZMRWRCUVVjc1YwRkJWeXhEUVVGRExGbEJRVmtzUTBGQlF6czdPMEZCUnpGRExHMUNRVUZYTEVOQlFVTXNXVUZCV1N4SFFVRkhMRk5CUVZNc1EwRkJRenM3TzBGQlIzSkRMR2xDUVVGVExFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFWVXNRMEZCUXl4UFFVRlBMRVZCUVVVc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzA5QlF6VkVPenM3UVVGSFJDeGhRVUZQTEVOQlFVTXNZVUZCWVN4RFFVRkRMRFpDUVVGblFpeG5Ra0ZCWjBJc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRE1VUXNRMEZCUXpzN096czdPMEZCVFVZc1VVRkJTU3hqUVVGakxFZEJRVWNzYVVOQlFXVXNUMEZCVHl4RlFVRkZMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPenRCUVVjNVJDeFJRVUZKTEdOQlFXTXNSVUZCUlR0QlFVRkZMRzlDUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMHRCUVVVc1RVRkRka1E3UVVGQlJTeHZRa0ZCWXl4RlFVRkZMRU5CUVVNN1MwRkJSVHRIUVVNelFpeERRVUZETzBOQlEwZzdPenM3T3pzN08wRkJUMDBzVTBGQlV5eFhRVUZYTEVOQlFVTXNUMEZCVHl4RlFVRkZPMEZCUTI1RExFMUJRVWtzVjBGQlZ5eEhRVUZITEdkQ1FVRlZMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdPenRCUVVjdlF5eE5RVUZKTEZkQlFWY3NRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRkRUlzWlVGQlZ5eERRVUZETEUxQlFVMHNRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRIUVVOb1F6czdPMEZCUjBRc1RVRkJTU3hYUVVGWExFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEzWkNMSE5EUVVGcFFpeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRkRU1zYTBOQlFXRXNRMEZCUXp0SFFVTm1PenM3UVVGSFJDd3lRa0ZCWjBJc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dERRVU16UWpzN096czdPenM3TzBGQlVVMHNVMEZCVXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJTeFBRVUZQTEVWQlFVVTdPMEZCUlc1RUxFMUJRVWtzVDBGQlR5eFBRVUZQTEVOQlFVTXNXVUZCV1N4TFFVRkxMRk5CUVZNc1JVRkJSVHRCUVVNM1F5eFhRVUZQTEVOQlFVTXNXVUZCV1N4SFFVRkhMRkZCUVZFc1EwRkJReXhoUVVGaExFTkJRVU03UjBGREwwTTdPMEZCUlVRc1RVRkJTU3hYUVVGWExFZEJRVWNzWjBKQlFWVXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6czdPMEZCUnk5RExHdENRVUZWTEVkQlFVY3NRMEZCUXl4UFFVRlBMRVZCUVVVc1YwRkJWeXhEUVVGRExFTkJRVU03TzBGQlJYQkRMRTFCUVVrc1YwRkJWeXhEUVVGRExGZEJRVmNzUlVGQlJUczdRVUZGTTBJc1pVRkJWeXhEUVVGRExGbEJRVmtzUjBGQlJ5eEZRVUZGTEU5QlFVOHNSVUZCVUN4UFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGUUxFOUJRVThzUlVGQlJTeERRVUZETzBGQlEyaEVMRmRCUVU4N1IwRkRVanM3TzBGQlIwUXNUVUZCU1N4clFrRkJhMElzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTMEZCU3l4SlFVRkpMRTlCUVU4c1EwRkJReXhUUVVGVExFdEJRVXNzVDBGQlR5eERRVUZET3p0QlFVVjRSU3hOUVVGSkxHdENRVUZyUWl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzU1VGQlNTeFBRVUZQTEVOQlFVTXNVMEZCVXl4TFFVRkxMRTlCUVU4c1EwRkJRenM3TzBGQlIzcEZMRTFCUVVrc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF6czdPMEZCUjJ4Q0xFMUJRVWtzVDBGQlR5eERRVUZETEZsQlFWa3NNa0pCUVdFc1JVRkJSVHM3UVVGRmNrTXNWVUZCVFN4SFFVRkhMRmRCUVZjc1EwRkJReXhOUVVGTkxFZEJRVWNzVjBGQlZ5eERRVUZETEUxQlFVMHNTVUZCU1N3eVFrRkJZeXhEUVVGRE8wZEJRM0JGT3pzN08wRkJTVVFzVFVGQlNTeERRVUZETEd0Q1FVRnJRaXhKUVVGSkxHdENRVUZyUWl4RFFVRkJMRWxCUVVzc1YwRkJWeXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU55UlN4WFFVRlBPMGRCUTFJN08wRkJSVVE3T3p0QlFVZEZMRUZCUVVNc1UwRkJUeXhEUVVGRExFdEJRVXNzU1VGQlNTeFhRVUZYTEVOQlFVTXNWVUZCVlN4TFFVRkxMRTlCUVU4c1EwRkJReXhUUVVGVE96czdPMEZCU1RkRUxFZEJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NTVUZCU1N4WFFVRlhMRU5CUVVNc1ZVRkJWU3hMUVVGTExFOUJRVThzUTBGQlF5eFRRVUZUTEVGQlFVTTdPenRCUVVjdlJDeGhRVUZYTEVOQlFVTXNXVUZCV1N4TFFVRkxMRTlCUVU4c1EwRkJReXhYUVVGWExFRkJRVU1zUlVGRGJFUTdRVUZEUVN4UlFVRkpMRmRCUVZjc1EwRkJReXhQUVVGUExFVkJRVVU3UVVGRGRrSXNkME5CUVdsQ0xGZEJRVmNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTjBReXh2UTBGQllTeERRVUZETzB0QlEyWTdPMEZCUlVRc1pVRkJWeXhEUVVGRExFOUJRVThzUjBGQlJ5eDFRa0ZCVXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE9VTXNaVUZCVnl4RFFVRkRMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU03UjBGRGJFTTdPenM3UVVGSlJDeE5RVUZKTEU5QlFVOHNRMEZCUXl4WlFVRlpMREpDUVVGaExFbEJRVWtzVFVGQlRTeEZRVUZGT3p0QlFVVXZReXhsUVVGWExFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXpzN08wRkJSeTlDTEZGQlFVa3NZMEZCWXl4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3p0QlFVbDRRaXhSUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEdsQ1FVRnBRaXhKUVVGSkxGZEJRVmNzUTBGQlF5eGhRVUZoTEVWQlFVVTdRVUZETDBRc2IwSkJRV01zUTBGQlF5eFBRVUZQTEVkQlFVY3NWMEZCVnl4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVNM1F5eHBRa0ZCVnl4RFFVRkRMR0ZCUVdFc1IwRkJSeXhMUVVGTExFTkJRVU03UzBGRGJrTTdPenRCUVVkRUxHdENRVUZqTEVOQlFVTXNTVUZCU1N4SFFVRkhMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZET3p0QlFVVnNSQ3hSUVVGSkxFOUJRVThzVDBGQlR5eExRVUZMTEZGQlFWRXNSVUZCUlR0QlFVTXZRaXh2UWtGQll5eERRVUZETEU5QlFVOHNSMEZCUnl4MVFrRkJVeXhQUVVGUExFTkJRVU1zUTBGQlF6czdPenRCUVVrelF5eFpRVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96czdRVUZIYmtNc1dVRkJUU3hEUVVGRExGTkJRVk1zUjBGQlJ5eHZRa0ZCYjBJc1EwRkJReXhQUVVGUExFVkJRVVVzVjBGQlZ5eERRVUZETEVOQlFVTTdPMEZCUlRsRUxHRkJRVTg3UzBGRFVqczdPenRCUVVsRUxHdENRVUZqTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenM3TzBGQlIycERMR3RDUVVGakxFTkJRVU1zVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNN096czdRVUZKZGtNc1ZVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXpzN08wRkJSMjVETEZWQlFVMHNRMEZCUXl4VFFVRlRMRWRCUVVjc2IwSkJRVzlDTEVOQlFVTXNUMEZCVHl4RlFVRkZMRmRCUVZjc1EwRkJReXhEUVVGRE8wZEJReTlFTEUxQlEwazdPenRCUVVWSUxHbENRVUZYTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRkwwSXNWVUZCU1N4UFFVRlBMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMnBDTEZWQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRmJrSXNWVUZCU1N4UFFVRlBMRTlCUVU4c1MwRkJTeXhSUVVGUkxFVkJRVVU3UVVGREwwSXNaVUZCVHl4SFFVRkhMREpDUVVGVkxFOUJRVThzUlVGQlJTeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVFN1QwRkROVU1zVFVGRFNUdEJRVU5JTEdWQlFVOHNSMEZCUnl4MVFrRkJVeXhQUVVGUExFTkJRVU1zUTBGQlF6dFBRVU0zUWpzN1FVRkZSQ3hWUVVGSkxFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZEYWtJc1dVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZET3p0QlFVVjZRaXhsUVVGUExFZEJRVWM3UVVGRFVpeHZRa0ZCVlN4RlFVRldMRlZCUVZVN08wRkJSVllzYjBKQlFWVXNSVUZCUlN4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlU3UVVGRE1VTXNhVUpCUVU4c1JVRkJSU3hYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEU5QlFVODdRVUZEY0VNc2EwSkJRVkVzUlVGQlJTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFN1FVRkRkRU1zYlVKQlFWTXNSVUZCUlN4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk03VTBGRGVrTXNRMEZCUXp0UFFVTklPenRCUVVWRUxGVkJRVWtzVjBGQlZ5eEhRVUZITEZkQlFWY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1VVRkJVU3hKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU55UkN4VlFVRkpMRmRCUVZjc1IwRkJSeXhQUVVGUExFbEJRVWtzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXpzN08wRkJSemxETEZWQlFVa3NWMEZCVnl4TFFVRkxMRmRCUVZjc1JVRkJSVHM3UVVGRkwwSXNNRUpCUVZNc1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJTeFhRVUZYTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wOUJRM1JFT3p0WFFVVkpMRWxCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMmhDTEdsQ1FVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITzBGQlEzaENMR3RDUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU5VTEdWQlFVY3NSVUZCUlN4WFFVRlhMRU5CUVVNc1QwRkJUenRCUVVONFFpeHRRa0ZCU3l4UFFVRlBPMWRCUTJJc1EwRkJRenM3UVVGRlJpdzBRMEZCYVVJc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZET3p0QlFVVjBReXh4UWtGQlZ5eERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNN1UwRkRMMEk3TzBGQlJVUXNWVUZCU1N4alFVRmpMRWRCUVVjc1UwRkJha0lzWTBGQll5eEhRVUZqT3p0QlFVVTVRaXh0UWtGQlZ5eERRVUZETEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNN096dEJRVWRvUXl4dFFrRkJWeXhEUVVGRExGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRPMEZCUXpORExHMUNRVUZYTEVOQlFVTXNWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU03UVVGRE0wTXNiVUpCUVZjc1EwRkJReXhaUVVGWkxFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWY3NRMEZCUXpzN1FVRkZMME1zYzBOQlFXRXNRMEZCUXpzN08wRkJSMlFzWlVGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN096dEJRVWR1UWl4bFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRExEWkNRVUZuUWl4blFrRkJaMElzUTBGQlF5eERRVUZETEVOQlFVTTdPenRCUVVkNlJDeFpRVUZKTEZkQlFWY3NRMEZCUXl4WlFVRlpMRVZCUVVVN1FVRkROVUlzWTBGQlNTeFZRVUZWTEVkQlFVY3NWMEZCVnl4RFFVRkRMRmxCUVZrc1EwRkJRenRCUVVNeFF5eHhRa0ZCVnl4RFFVRkRMRmxCUVZrc1IwRkJSeXhUUVVGVExFTkJRVU03T3p0QlFVZHlReXh0UWtGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4VlFVRlZMRU5CUVVNc1QwRkJUeXhGUVVGRkxGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0VFFVTTFSRHRQUVVOR0xFTkJRVU03T3pzN1FVRkpSaXhWUVVGSkxHTkJRV01zUjBGQlJ5eHBRMEZCWlN4UFFVRlBMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03T3p0QlFVZDBSQ3hWUVVGSkxHTkJRV01zUlVGQlJUdEJRVUZGTEhOQ1FVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzA5QlFVVXNUVUZEZGtRN1FVRkJSU3h6UWtGQll5eEZRVUZGTEVOQlFVTTdUMEZCUlRzN1IwRkRNMEk3UTBGRFJpSXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOXViMlJsTDNCaGRHTm9MbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUVOMWMzUnZiVVYyWlc1MElHWnliMjBnSjJOMWMzUnZiUzFsZG1WdWRDYzdYRzVwYlhCdmNuUWdleUJqY21WaGRHVWdZWE1nWTNKbFlYUmxWMjl5YTJWeUxDQm9ZWE5YYjNKclpYSWdmU0JtY205dElDY3VMaTkzYjNKclpYSXZZM0psWVhSbEp6dGNibWx0Y0c5eWRDQjdJR05zWldGdVRXVnRiM0o1TENCd2NtOTBaV04wUld4bGJXVnVkQ3dnZFc1d2NtOTBaV04wUld4bGJXVnVkQ0I5SUdaeWIyMGdKeTR1TDNWMGFXd3ZiV1Z0YjNKNUp6dGNibWx0Y0c5eWRDQjdJSEJ2YjJ4eklIMGdabkp2YlNBbkxpNHZkWFJwYkM5d2IyOXNjeWM3WEc1cGJYQnZjblFnZXlCd1lYSnpaVWhVVFV3Z2ZTQm1jbTl0SUNjdUxpOTFkR2xzTDNCaGNuTmxjaWM3WEc1cGJYQnZjblFnY0hKdlkyVnpjMUJoZEdOb1pYTWdabkp2YlNBbkxpNHZjR0YwWTJobGN5OXdjbTlqWlhOekp6dGNibWx0Y0c5eWRDQnRZV3RsVG05a1pTQm1jbTl0SUNjdUwyMWhhMlVuTzF4dWFXMXdiM0owSUcxaGEyVkZiR1Z0Wlc1MElHWnliMjBnSnk0dUwyVnNaVzFsYm5RdmJXRnJaU2M3WEc1cGJYQnZjblFnYzNsdVkwNXZaR1VnWm5KdmJTQW5MaTl6ZVc1akp6dGNibWx0Y0c5eWRDQjdJRlJ5WldWRFlXTm9aU0I5SUdaeWIyMGdKeTR2ZEhKbFpTYzdYRzVjYmk4cUtseHVJQ29nVjJobGJpQjBhR1VnZDI5eWEyVnlJR052YlhCc1pYUmxjeXdnWTJ4bFlXNGdkWEFnYldWdGIzSjVJR0Z1WkNCelkyaGxaSFZzWlNCMGFHVWdibVY0ZENCeVpXNWtaWElnYVdaY2JpQXFJRzVsWTJWemMyRnllUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdaV3hsYldWdWRGeHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUk5aWFJoWEc0Z0tpQkFjbVYwZFhKdUlIdEdkVzVqZEdsdmJuMWNiaUFxTDF4dVpuVnVZM1JwYjI0Z1kyOXRjR3hsZEdWWGIzSnJaWEpTWlc1a1pYSW9aV3hsYldWdWRDd2daV3hsYldWdWRFMWxkR0VwSUh0Y2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUtHVjJLU0I3WEc0Z0lDQWdkbUZ5SUc1dlpHVnpJRDBnWlhZdVpHRjBZUzV1YjJSbGN6dGNibHh1SUNBZ0lDOHZJRUZrWkNCdVpYY2daV3hsYldWdWRITXVYRzRnSUNBZ2FXWWdLRzV2WkdWekxtRmtaR2wwYVc5dWN5NXNaVzVuZEdncElIdGNiaUFnSUNBZ0lHNXZaR1Z6TG1Ga1pHbDBhVzl1Y3k1dFlYQW9jSEp2ZEdWamRFVnNaVzFsYm5RcExtMWhjQ2hrWlhOamNtbHdkRzl5SUQwK0lIdGNiaUFnSUNBZ0lDQWdMeThnU1c1cVpXTjBJR2x1ZEc4Z2RHaGxJR0J2YkdSVWNtVmxZQ0J6YnlCcGRDZHpJR05zWldGdVpXUWdkWEFnWTI5eWNtVmpkR3g1TGx4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwVFdWMFlTNXZiR1JVY21WbExtTm9hV3hrVG05a1pYTXVjSFZ6YUNoa1pYTmpjbWx3ZEc5eUtUdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHUmxjMk55YVhCMGIzSTdYRzRnSUNBZ0lDQjlLUzVtYjNKRllXTm9LRzFoYTJWRmJHVnRaVzUwS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JzWlhRZ1kyOXRjR3hsZEdWU1pXNWtaWElnUFNCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDOHZJRkpsYlc5MlpTQjFiblZ6WldRZ1pXeGxiV1Z1ZEhNdVhHNGdJQ0FnSUNCcFppQW9ibTlrWlhNdWNtVnRiM1poYkhNdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lHNXZaR1Z6TG5KbGJXOTJZV3h6TG0xaGNDaDFkV2xrSUQwK0lIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVYM1YxYVdSYmRYVnBaRjBwWEc0Z0lDQWdJQ0FnSUNBZ0xtWnZja1ZoWTJnb2RXNXdjbTkwWldOMFJXeGxiV1Z1ZENrN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRkpsYzJWMElHbHVkR1Z5Ym1Gc0lHTmhZMmhsY3lCbWIzSWdjWFZwWTJ0bGNpQnNiMjlyZFhCeklHbHVJSFJvWlNCbWRYUjFjbVZ6TGx4dUlDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdVgybHVibVZ5U0ZSTlRDQTlJR1ZzWlcxbGJuUXVhVzV1WlhKSVZFMU1PMXh1SUNBZ0lDQWdaV3hsYldWdWRFMWxkR0V1WDI5MWRHVnlTRlJOVENBOUlHVnNaVzFsYm5RdWIzVjBaWEpJVkUxTU8xeHVJQ0FnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXVYM1JsZUhSRGIyNTBaVzUwSUQwZ1pXeGxiV1Z1ZEM1MFpYaDBRMjl1ZEdWdWREdGNibHh1SUNBZ0lDQWdMeThnVW1WamVXTnNaU0JoYkd3Z2RXNXdjbTkwWldOMFpXUWdZV3hzYjJOaGRHbHZibk11WEc0Z0lDQWdJQ0JqYkdWaGJrMWxiVzl5ZVNncE8xeHVYRzRnSUNBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzVvWVhOWGIzSnJaWEpTWlc1a1pYSmxaQ0E5SUhSeWRXVTdYRzRnSUNBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzVwYzFKbGJtUmxjbWx1WnlBOUlHWmhiSE5sTzF4dVhHNGdJQ0FnSUNBdkx5QlVhR2x6SUdseklHUmxjMmxuYm1Wa0lIUnZJR2hoYm1Sc1pTQjFjMlVnWTJGelpYTWdkMmhsY21VZ2NtVnVaR1Z5Y3lCaGNtVWdZbVZwYm1jZ2FHRnRiV1Z5WldSY2JpQWdJQ0FnSUM4dklHOXlJSGRvWlc0Z2RISmhibk5wZEdsdmJuTWdZWEpsSUhWelpXUWdkMmwwYUNCUWNtOXRhWE5sY3k1Y2JpQWdJQ0FnSUdsbUlDaGxiR1Z0Wlc1MFRXVjBZUzV5Wlc1a1pYSkNkV1ptWlhJcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUc1bGVIUlNaVzVrWlhJZ1BTQmxiR1Z0Wlc1MFRXVjBZUzV5Wlc1a1pYSkNkV1ptWlhJN1hHNWNiaUFnSUNBZ0lDQWdMeThnVW1WelpYUWdkR2hsSUdKMVptWmxjaTVjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdWNtVnVaR1Z5UW5WbVptVnlJRDBnZFc1a1pXWnBibVZrTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRTV2ZEdsamFXNW5JSE52YldVZ2QyVnBjbVFnY0dWeVptOXliV0Z1WTJVZ2FXMXdiR2xqWVhScGIyNXpJSGRwZEdnZ2RHaHBjeUJqYjI1alpYQjBMbHh1SUNBZ0lDQWdJQ0J3WVhSamFFNXZaR1VvWld4bGJXVnVkQ3dnYm1WNGRGSmxibVJsY2k1dVpYZElWRTFNTENCdVpYaDBVbVZ1WkdWeUxtOXdkR2x2Ym5NcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJFYVhOd1lYUmphQ0JoYmlCbGRtVnVkQ0J2YmlCMGFHVWdaV3hsYldWdWRDQnZibU5sSUhKbGJtUmxjbWx1WnlCb1lYTWdZMjl0Y0d4bGRHVmtMbHh1SUNBZ0lDQWdaV3hsYldWdWRDNWthWE53WVhSamFFVjJaVzUwS0c1bGR5QkRkWE4wYjIxRmRtVnVkQ2duY21WdVpHVnlRMjl0Y0d4bGRHVW5LU2s3WEc0Z0lDQWdmVHRjYmx4dUlDQWdJQzh2SUZkaGFYUWdkVzUwYVd3Z1lXeHNJSEJ5YjIxcGMyVnpJR2hoZG1VZ2NtVnpiMngyWldRc0lHSmxabTl5WlNCbWFXNXBjMmhwYm1jZ2RYQWdkR2hsSUhCaGRHTm9YRzRnSUNBZ0x5OGdZM2xqYkdVdVhHNGdJQ0FnTHk4Z1VISnZZMlZ6Y3lCMGFHVWdaR0YwWVNCcGJXMWxaR2xoZEdWc2VTQmhibVFnZDJGcGRDQjFiblJwYkNCaGJHd2dkSEpoYm5OcGRHbHZiaUJqWVd4c1ltRmphM05jYmlBZ0lDQXZMeUJvWVhabElHTnZiWEJzWlhSbFpDNWNiaUFnSUNCc1pYUWdjSEp2WTJWemMxQnliMjFwYzJVZ1BTQndjbTlqWlhOelVHRjBZMmhsY3lobGJHVnRaVzUwTENCbGRpNWtZWFJoTG5CaGRHTm9aWE1wTzF4dVhHNGdJQ0FnTHk4Z1QzQmxjbUYwWlNCemVXNWphSEp2Ym05MWMyeDVJSFZ1YkdWemN5QnZjSFJsWkNCcGJuUnZJR0VnVUhKdmJXbHpaUzFqYUdGcGJpNWNiaUFnSUNCcFppQW9jSEp2WTJWemMxQnliMjFwYzJVcElIc2djSEp2WTJWemMxQnliMjFwYzJVdWRHaGxiaWhqYjIxd2JHVjBaVkpsYm1SbGNpazdJSDFjYmlBZ0lDQmxiSE5sSUhzZ1kyOXRjR3hsZEdWU1pXNWtaWElvS1RzZ2ZWeHVJQ0I5TzF4dWZWeHVYRzR2S2lwY2JpQXFJRkpsYkdWaGMyVW5jeUIwYUdVZ1lXeHNiMk5oZEdWa0lHOWlhbVZqZEhNZ1lXNWtJSEpsWTNsamJHVnpJR2x1ZEdWeWJtRnNJRzFsYlc5eWVTNWNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ1pXeGxiV1Z1ZEZ4dUlDb3ZYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdjbVZzWldGelpVNXZaR1VvWld4bGJXVnVkQ2tnZTF4dUlDQnNaWFFnWld4bGJXVnVkRTFsZEdFZ1BTQlVjbVZsUTJGamFHVXVaMlYwS0dWc1pXMWxiblFwSUh4OElIdDlPMXh1WEc0Z0lDOHZJRWxtSUhSb1pYSmxJR2x6SUdFZ2QyOXlhMlZ5SUdGemMyOWphV0YwWldRZ2QybDBhQ0IwYUdseklHVnNaVzFsYm5Rc0lIUm9aVzRnYTJsc2JDQnBkQzVjYmlBZ2FXWWdLR1ZzWlcxbGJuUk5aWFJoTG5kdmNtdGxjaWtnZTF4dUlDQWdJR1ZzWlcxbGJuUk5aWFJoTG5kdmNtdGxjaTUwWlhKdGFXNWhkR1VvS1R0Y2JpQWdmVnh1WEc0Z0lDOHZJRWxtSUhSb1pYSmxJSGRoY3lCaElIUnlaV1VnYzJWMElIVndMQ0J5WldONVkyeGxJSFJvWlNCdFpXMXZjbmtnWVd4c2IyTmhkR1ZrSUdadmNpQnBkQzVjYmlBZ2FXWWdLR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VwSUh0Y2JpQWdJQ0IxYm5CeWIzUmxZM1JGYkdWdFpXNTBLR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VwTzF4dUlDQWdJR05zWldGdVRXVnRiM0o1S0NrN1hHNGdJSDFjYmx4dUlDQXZMeUJTWlcxdmRtVWdkR2hwY3lCbGJHVnRaVzUwSjNNZ2JXVjBZU0J2WW1wbFkzUWdabkp2YlNCMGFHVWdZMkZqYUdVdVhHNGdJRlJ5WldWRFlXTm9aUzVrWld4bGRHVW9aV3hsYldWdWRDazdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1VHRjBZMmhsY3lCaGJpQmxiR1Z0Wlc1MEozTWdSRTlOSUhSdklHMWhkR05vSUhSb1lYUWdiMllnZEdobElIQmhjM05sWkNCdFlYSnJkWEF1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCd1lYSmhiU0J1WlhkSVZFMU1YRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCd1lYUmphRTV2WkdVb1pXeGxiV1Z1ZEN3Z2JtVjNTRlJOVEN3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0F2THlCRmJuTjFjbVVnZEdoaGRDQjBhR1VnWkc5amRXMWxiblFnWkdsellXSnNaU0IzYjNKclpYSWdhWE1nWVd4M1lYbHpJSEJwWTJ0bFpDQjFjQzVjYmlBZ2FXWWdLSFI1Y0dWdlppQnZjSFJwYjI1ekxtVnVZV0pzWlZkdmNtdGxjaUFoUFQwZ0oySnZiMnhsWVc0bktTQjdYRzRnSUNBZ2IzQjBhVzl1Y3k1bGJtRmliR1ZYYjNKclpYSWdQU0JrYjJOMWJXVnVkQzVGVGtGQ1RFVmZWMDlTUzBWU08xeHVJQ0I5WEc1Y2JpQWdkbUZ5SUdWc1pXMWxiblJOWlhSaElEMGdWSEpsWlVOaFkyaGxMbWRsZENobGJHVnRaVzUwS1NCOGZDQjdmVHRjYmx4dUlDQXZMeUJCYkhkaGVYTWdaVzV6ZFhKbElIUm9aU0J0YjNOMElIVndMWFJ2TFdSaGRHVWdiV1YwWVNCdlltcGxZM1FnYVhNZ2MzUnZjbVZrTGx4dUlDQlVjbVZsUTJGamFHVXVjMlYwS0dWc1pXMWxiblFzSUdWc1pXMWxiblJOWlhSaEtUdGNibHh1SUNCcFppQW9aV3hsYldWdWRFMWxkR0V1YVhOU1pXNWtaWEpwYm1jcElIdGNiaUFnSUNBdkx5QkJaR1FnZEdocGN5QnVaWGNnY21WdVpHVnlJR2x1ZEc4Z2RHaGxJR0oxWm1abGNpQnhkV1YxWlM1Y2JpQWdJQ0JsYkdWdFpXNTBUV1YwWVM1eVpXNWtaWEpDZFdabVpYSWdQU0I3SUc1bGQwaFVUVXdzSUc5d2RHbHZibk1nZlR0Y2JpQWdJQ0J5WlhSMWNtNDdYRzRnSUgxY2JseHVJQ0F2THlCSlppQjBhR1VnYjNCbGNtRjBhVzl1SUdseklHQnBibTVsY2toVVRVeGdMQ0JpZFhRZ2RHaGxJR052Ym5SbGJuUnpJR2hoZG1WdUozUWdZMmhoYm1kbFpDd2dZV0p2Y25RdVhHNGdJSFpoY2lCa2FXWm1aWEpsYm5SSmJtNWxja2hVVFV3Z1BTQnZjSFJwYjI1ekxtbHVibVZ5SUNZbUlHVnNaVzFsYm5RdWFXNXVaWEpJVkUxTUlEMDlQU0J1WlhkSVZFMU1PMXh1SUNBdkx5QkpaaUIwYUdVZ2IzQmxjbUYwYVc5dUlHbHpJR0J2ZFhSbGNraFVUVXhnTENCaWRYUWdkR2hsSUdOdmJuUmxiblJ6SUdoaGRtVnVKM1FnWTJoaGJtZGxaQ3dnWVdKdmNuUXVYRzRnSUhaaGNpQmthV1ptWlhKbGJuUlBkWFJsY2toVVRVd2dQU0FoYjNCMGFXOXVjeTVwYm01bGNpQW1KaUJsYkdWdFpXNTBMbTkxZEdWeVNGUk5UQ0E5UFQwZ2JtVjNTRlJOVER0Y2JseHVJQ0F2THlCVGRHRnlkQ0IzYVhSb0lIZHZjbXRsY2lCaVpXbHVaeUJoSUdaaGJITjVJSFpoYkhWbExseHVJQ0IyWVhJZ2QyOXlhMlZ5SUQwZ2JuVnNiRHRjYmx4dUlDQXZMeUJKWmlCM1pTQmpZVzRnZFhObElHRWdkMjl5YTJWeUlHRnVaQ0IwYUdVZ2RYTmxjaUIzWVc1MGN5QnZibVVzSUhSeWVTQmhibVFnWTNKbFlYUmxJR2wwTGx4dUlDQnBaaUFvYjNCMGFXOXVjeTVsYm1GaWJHVlhiM0pyWlhJZ0ppWWdhR0Z6VjI5eWEyVnlLU0I3WEc0Z0lDQWdMeThnUTNKbFlYUmxJR0VnZDI5eWEyVnlJR1p2Y2lCMGFHbHpJR1ZzWlcxbGJuUXVYRzRnSUNBZ2QyOXlhMlZ5SUQwZ1pXeGxiV1Z1ZEUxbGRHRXVkMjl5YTJWeUlEMGdaV3hsYldWdWRFMWxkR0V1ZDI5eWEyVnlJSHg4SUdOeVpXRjBaVmR2Y210bGNpZ3BPMXh1SUNCOVhHNWNiaUFnTHk4Z1FXNWtJR1Z1YzNWeVpTQjBhR0YwSUdGdUlHQnZiR1JVY21WbFlDQmxlR2x6ZEhNc0lHOTBhR1Z5ZDJselpTQjBhR2x6SUdseklIUm9aU0JtYVhKemRDQnlaVzVrWlhKY2JpQWdMeThnY0c5MFpXNTBhV0ZzYkhrdVhHNGdJR2xtSUNnb1pHbG1abVZ5Wlc1MFNXNXVaWEpJVkUxTUlIeDhJR1JwWm1abGNtVnVkRTkxZEdWeVNGUk5UQ2tnSmlZZ1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTa2dlMXh1SUNBZ0lISmxkSFZ5Ymp0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2hjYmlBZ0lDQXZMeUJKWmlCMGFHVWdiM0JsY21GMGFXOXVJR2x6SUdCcGJtNWxja2hVVFV4Z0xDQmhibVFnZEdobElHTjFjbkpsYm5RZ1pXeGxiV1Z1ZENkeklHTnZiblJsYm5SeklHaGhkbVZjYmlBZ0lDQXZMeUJqYUdGdVoyVmtJSE5wYm1ObElIUm9aU0JzWVhOMElISmxibVJsY2lCc2IyOXdMQ0J5WldOaGJHTjFiR0YwWlNCMGFHVWdkSEpsWlM1Y2JpQWdJQ0FvYjNCMGFXOXVjeTVwYm01bGNpQW1KaUJsYkdWdFpXNTBUV1YwWVM1ZmFXNXVaWEpJVkUxTUlDRTlQU0JsYkdWdFpXNTBMbWx1Ym1WeVNGUk5UQ2tnZkh4Y2JseHVJQ0FnSUM4dklFbG1JSFJvWlNCdmNHVnlZWFJwYjI0Z2FYTWdZRzkxZEdWeVNGUk5UR0FzSUdGdVpDQjBhR1VnWTNWeWNtVnVkQ0JsYkdWdFpXNTBKM01nWTI5dWRHVnVkSE1nYUdGMlpWeHVJQ0FnSUM4dklHTm9ZVzVuWldRZ2MybHVZMlVnZEdobElHeGhjM1FnY21WdVpHVnlJR3h2YjNBc0lISmxZMkZzWTNWc1lYUmxJSFJvWlNCMGNtVmxMbHh1SUNBZ0lDZ2hiM0IwYVc5dWN5NXBibTVsY2lBbUppQmxiR1Z0Wlc1MFRXVjBZUzVmYjNWMFpYSklWRTFNSUNFOVBTQmxiR1Z0Wlc1MExtOTFkR1Z5U0ZSTlRDa2dmSHhjYmx4dUlDQWdJQzh2SUVsbUlIUm9aU0IwWlhoMElHTnZiblJsYm5RZ1pYWmxjaUJqYUdGdVoyVnpMQ0J5WldOaGJHTjFiR0YwWlNCMGFHVWdkSEpsWlM1Y2JpQWdJQ0FvWld4bGJXVnVkRTFsZEdFdVgzUmxlSFJEYjI1MFpXNTBJQ0U5UFNCbGJHVnRaVzUwTG5SbGVIUkRiMjUwWlc1MEtWeHVJQ0FwSUh0Y2JpQWdJQ0JwWmlBb1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTa2dlMXh1SUNBZ0lDQWdkVzV3Y205MFpXTjBSV3hsYldWdWRDaGxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxLVHRjYmlBZ0lDQWdJR05zWldGdVRXVnRiM0o1S0NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlNBOUlHMWhhMlZPYjJSbEtHVnNaVzFsYm5Rc0lIUnlkV1VwTzF4dUlDQWdJR1ZzWlcxbGJuUk5aWFJoTG5Wd1pHRjBaVTlzWkZSeVpXVWdQU0IwY25WbE8xeHVJQ0I5WEc1Y2JpQWdMeThnVjJsc2JDQjNZVzUwSUhSdklHVnVjM1Z5WlNCMGFHRjBJSFJvWlNCbWFYSnpkQ0J5Wlc1a1pYSWdkMlZ1ZENCMGFISnZkV2RvTENCMGFHVWdkMjl5YTJWeUlHTmhibHh1SUNBdkx5QjBZV3RsSUdFZ1ltbDBJSFJ2SUhOMFlYSjBkWEFnWVc1a0lIZGxJSGRoYm5RZ2RHOGdjMmh2ZHlCamFHRnVaMlZ6SUdGeklITnZiMjRnWVhNZ2NHOXpjMmxpYkdVdVhHNGdJR2xtSUNodmNIUnBiMjV6TG1WdVlXSnNaVmR2Y210bGNpQW1KaUJvWVhOWGIzSnJaWElnSmlZZ2QyOXlhMlZ5S1NCN1hHNGdJQ0FnTHk4Z1UyVjBJR0VnY21WdVpHVnlJR3h2WTJzZ1lYTWdkRzhnYm05MElHWnNiMjlrSUhSb1pTQjNiM0pyWlhJdVhHNGdJQ0FnWld4bGJXVnVkRTFsZEdFdWFYTlNaVzVrWlhKcGJtY2dQU0IwY25WbE8xeHVYRzRnSUNBZ0x5OGdRWFIwWVdOb0lHRnNiQ0J3Y205d1pYSjBhV1Z6SUdobGNtVWdkRzhnZEhKaGJuTndiM0owTGx4dUlDQWdJR3hsZENCMGNtRnVjMlpsY2s5aWFtVmpkQ0E5SUh0OU8xeHVYRzRnSUNBZ0x5OGdWR2hwY3lCemFHOTFiR1FnYjI1c2VTQnZZMk4xY2lCdmJtTmxMQ0J2Y2lCM2FHVnVaWFpsY2lCMGFHVWdiV0Z5YTNWd0lHTm9ZVzVuWlhNZ1pYaDBaWEp1WVd4c2VWeHVJQ0FnSUM4dklIUnZJR1JwWm1aSVZFMU1MbHh1SUNBZ0lHbG1JQ2doWld4bGJXVnVkRTFsZEdFdWFHRnpWMjl5YTJWeVVtVnVaR1Z5WldRZ2ZId2daV3hsYldWdWRFMWxkR0V1ZFhCa1lYUmxUMnhrVkhKbFpTa2dlMXh1SUNBZ0lDQWdkSEpoYm5ObVpYSlBZbXBsWTNRdWIyeGtWSEpsWlNBOUlHVnNaVzFsYm5STlpYUmhMbTlzWkZSeVpXVTdYRzRnSUNBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzUxY0dSaGRHVlBiR1JVY21WbElEMGdabUZzYzJVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1FYUjBZV05vSUhSb1pTQndZWEpsYm5RZ1pXeGxiV1Z1ZENkeklIVjFhV1F1WEc0Z0lDQWdkSEpoYm5ObVpYSlBZbXBsWTNRdWRYVnBaQ0E5SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVdVpXeGxiV1Z1ZER0Y2JseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2JtVjNTRlJOVENBaFBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJSFJ5WVc1elptVnlUMkpxWldOMExtNWxkMVJ5WldVZ1BTQnRZV3RsVG05a1pTaHVaWGRJVkUxTUtUdGNibHh1SUNBZ0lDQWdMeThnVkhKaGJuTm1aWElnZEdocGN5QmlkV1ptWlhJZ2RHOGdkR2hsSUhkdmNtdGxjaXdnZDJocFkyZ2dkMmxzYkNCMFlXdGxJRzkyWlhJZ1lXNWtJSEJ5YjJObGMzTWdkR2hsWEc0Z0lDQWdJQ0F2THlCdFlYSnJkWEF1WEc0Z0lDQWdJQ0IzYjNKclpYSXVjRzl6ZEUxbGMzTmhaMlVvZEhKaGJuTm1aWEpQWW1wbFkzUXBPMXh1WEc0Z0lDQWdJQ0F2THlCWFlXbDBJR1p2Y2lCMGFHVWdkMjl5YTJWeUlIUnZJR1pwYm1semFDQndjbTlqWlhOemFXNW5JR0Z1WkNCMGFHVnVJR0Z3Y0d4NUlIUm9aU0J3WVhSamFITmxkQzVjYmlBZ0lDQWdJSGR2Y210bGNpNXZibTFsYzNOaFoyVWdQU0JqYjIxd2JHVjBaVmR2Y210bGNsSmxibVJsY2lobGJHVnRaVzUwTENCbGJHVnRaVzUwVFdWMFlTazdYRzVjYmlBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5Qk1aWFFnZEdobElHSnliM2R6WlhJZ1kyOXdlU0IwYUdVZ1NGUk5UQ0JwYm5SdklIUm9aU0IzYjNKclpYSXNJR052Ym5abGNuUnBibWNnZEc4Z1lWeHVJQ0FnSUM4dklIUnlZVzV6Wm1WeVlXSnNaU0J2WW1wbFkzUWdhWE1nZEc5dklHVjRjR1Z1YzJsMlpTNWNiaUFnSUNCMGNtRnVjMlpsY2s5aWFtVmpkQzV1WlhkSVZFMU1JRDBnYm1WM1NGUk5URHRjYmx4dUlDQWdJQzh2SUVGa1pDQndjbTl3WlhKMGFXVnpJSFJ2SUhObGJtUWdkRzhnZDI5eWEyVnlMbHh1SUNBZ0lIUnlZVzV6Wm1WeVQySnFaV04wTG1selNXNXVaWElnUFNCdmNIUnBiMjV6TG1sdWJtVnlPMXh1WEc0Z0lDQWdMeThnVkhKaGJuTm1aWElnZEdocGN5QmlkV1ptWlhJZ2RHOGdkR2hsSUhkdmNtdGxjaXdnZDJocFkyZ2dkMmxzYkNCMFlXdGxJRzkyWlhJZ1lXNWtJSEJ5YjJObGMzTWdkR2hsWEc0Z0lDQWdMeThnYldGeWEzVndMbHh1SUNBZ0lIZHZjbXRsY2k1d2IzTjBUV1Z6YzJGblpTaDBjbUZ1YzJabGNrOWlhbVZqZENrN1hHNWNiaUFnSUNBdkx5QlhZV2wwSUdadmNpQjBhR1VnZDI5eWEyVnlJSFJ2SUdacGJtbHphQ0J3Y205alpYTnphVzVuSUdGdVpDQjBhR1Z1SUdGd2NHeDVJSFJvWlNCd1lYUmphSE5sZEM1Y2JpQWdJQ0IzYjNKclpYSXViMjV0WlhOellXZGxJRDBnWTI5dGNHeGxkR1ZYYjNKclpYSlNaVzVrWlhJb1pXeGxiV1Z1ZEN3Z1pXeGxiV1Z1ZEUxbGRHRXBPMXh1SUNCOVhHNGdJR1ZzYzJVZ2UxeHVJQ0FnSUM4dklGZGxKM0psSUhKbGJtUmxjbWx1WnlCcGJpQjBhR1VnVlVrZ2RHaHlaV0ZrTGx4dUlDQWdJR1ZzWlcxbGJuUk5aWFJoTG1selVtVnVaR1Z5YVc1bklEMGdkSEoxWlR0Y2JseHVJQ0FnSUd4bGRDQndZWFJqYUdWeklEMGdXMTA3WEc0Z0lDQWdiR1YwSUc1bGQxUnlaV1VnUFNCdWRXeHNPMXh1WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUJ1WlhkSVZFMU1JRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ2JtVjNWSEpsWlNBOUlIQmhjbk5sU0ZSTlRDaHVaWGRJVkUxTUxDQnZjSFJwYjI1ekxtbHVibVZ5S1Z4dUlDQWdJSDFjYmlBZ0lDQmxiSE5sSUh0Y2JpQWdJQ0FnSUc1bGQxUnlaV1VnUFNCdFlXdGxUbTlrWlNodVpYZElWRTFNS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2IzQjBhVzl1Y3k1cGJtNWxjaWtnZTF4dUlDQWdJQ0FnYkdWMElHTm9hV3hrVG05a1pYTWdQU0J1WlhkVWNtVmxPMXh1WEc0Z0lDQWdJQ0J1WlhkVWNtVmxJRDBnZTF4dUlDQWdJQ0FnSUNCamFHbHNaRTV2WkdWekxGeHVYRzRnSUNBZ0lDQWdJR0YwZEhKcFluVjBaWE02SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGN5eGNiaUFnSUNBZ0lDQWdaV3hsYldWdWREb2daV3hsYldWdWRFMWxkR0V1YjJ4a1ZISmxaUzVsYkdWdFpXNTBMRnh1SUNBZ0lDQWdJQ0J1YjJSbFRtRnRaVG9nWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlM1dWIyUmxUbUZ0WlN4Y2JpQWdJQ0FnSUNBZ2JtOWtaVlpoYkhWbE9pQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMbTV2WkdWV1lXeDFaVnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnNaWFFnYjJ4a1ZISmxaVTVoYldVZ1BTQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMbTV2WkdWT1lXMWxJSHg4SUNjbk8xeHVJQ0FnSUd4bGRDQnVaWGRPYjJSbFRtRnRaU0E5SUc1bGQxUnlaV1VnSmlZZ2JtVjNWSEpsWlM1dWIyUmxUbUZ0WlR0Y2JseHVJQ0FnSUM4dklFbG1JSFJvWlNCbGJHVnRaVzUwSUc1dlpHVWdkSGx3WlhNZ2JXRjBZMmdzSUhSeWVTQmhibVFnWTI5dGNHRnlaU0IwYUdWdExseHVJQ0FnSUdsbUlDaHZiR1JVY21WbFRtRnRaU0E5UFQwZ2JtVjNUbTlrWlU1aGJXVXBJSHRjYmlBZ0lDQWdJQzh2SUZONWJtTm9jbTl1YVhwbElIUm9aU0IwY21WbExseHVJQ0FnSUNBZ2MzbHVZMDV2WkdVdVkyRnNiQ2h3WVhSamFHVnpMQ0JsYkdWdFpXNTBUV1YwWVM1dmJHUlVjbVZsTENCdVpYZFVjbVZsS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnVDNSb1pYSjNhWE5sSUhKbGNHeGhZMlVnZEdobElIUnZjQ0JzWlhabGJDQmxiR1Z0Wlc1MGN5NWNiaUFnSUNCbGJITmxJR2xtSUNodVpYZElWRTFNS1NCN1hHNGdJQ0FnSUNCd1lYUmphR1Z6VzNCaGRHTm9aWE11YkdWdVozUm9YU0E5SUh0Y2JpQWdJQ0FnSUNBZ1gxOWtiMTlmT2lBd0xGeHVJQ0FnSUNBZ0lDQnZiR1E2SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVc1hHNGdJQ0FnSUNBZ0lHNWxkem9nYm1WM1ZISmxaVnh1SUNBZ0lDQWdmVHRjYmx4dUlDQWdJQ0FnZFc1d2NtOTBaV04wUld4bGJXVnVkQ2hsYkdWdFpXNTBUV1YwWVM1dmJHUlVjbVZsS1R0Y2JseHVJQ0FnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTQTlJRzVsZDFSeVpXVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JHVjBJR052YlhCc1pYUmxVbVZ1WkdWeUlEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0F2THlCTllYSnJJSFJvWVhRZ2RHaHBjeUJsYkdWdFpXNTBJR2hoY3lCcGJtbDBhV0ZzYkhrZ2NtVnVaR1Z5WldRZ1lXNWtJR2x6SUdSdmJtVWdjbVZ1WkdWeWFXNW5MbHh1SUNBZ0lDQWdaV3hsYldWdWRFMWxkR0V1YVhOU1pXNWtaWEpwYm1jZ1BTQm1ZV3h6WlR0Y2JseHVJQ0FnSUNBZ0x5OGdVMlYwSUhSb1pTQnBibTVsY2toVVRVd3VYRzRnSUNBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzVmYVc1dVpYSklWRTFNSUQwZ1pXeGxiV1Z1ZEM1cGJtNWxja2hVVFV3N1hHNGdJQ0FnSUNCbGJHVnRaVzUwVFdWMFlTNWZiM1YwWlhKSVZFMU1JRDBnWld4bGJXVnVkQzV2ZFhSbGNraFVUVXc3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBUV1YwWVM1ZmRHVjRkRU52Ym5SbGJuUWdQU0JsYkdWdFpXNTBMblJsZUhSRGIyNTBaVzUwTzF4dVhHNGdJQ0FnSUNCamJHVmhiazFsYlc5eWVTZ3BPMXh1WEc0Z0lDQWdJQ0F2THlCRGJHVmhiaUJ2ZFhRZ2RHaGxJSEJoZEdOb1pYTWdZWEp5WVhrdVhHNGdJQ0FnSUNCd1lYUmphR1Z6TG14bGJtZDBhQ0E5SURBN1hHNWNiaUFnSUNBZ0lDOHZJRVJwYzNCaGRHTm9JR0Z1SUdWMlpXNTBJRzl1SUhSb1pTQmxiR1Z0Wlc1MElHOXVZMlVnY21WdVpHVnlhVzVuSUdoaGN5QmpiMjF3YkdWMFpXUXVYRzRnSUNBZ0lDQmxiR1Z0Wlc1MExtUnBjM0JoZEdOb1JYWmxiblFvYm1WM0lFTjFjM1J2YlVWMlpXNTBLQ2R5Wlc1a1pYSkRiMjF3YkdWMFpTY3BLVHRjYmx4dUlDQWdJQ0FnTHk4Z1ZFOUVUeUJWY0dSaGRHVWdkR2hwY3lCamIyMXRaVzUwSUdGdVpDOXZjaUJ5WldaaFkzUnZjaUIwYnlCMWMyVWdkR2hsSUhOaGJXVWdZWE1nZEdobElGZHZjbXRsY2k1Y2JpQWdJQ0FnSUdsbUlDaGxiR1Z0Wlc1MFRXVjBZUzV5Wlc1a1pYSkNkV1ptWlhJcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUc1bGVIUlNaVzVrWlhJZ1BTQmxiR1Z0Wlc1MFRXVjBZUzV5Wlc1a1pYSkNkV1ptWlhJN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5STlpYUmhMbkpsYm1SbGNrSjFabVpsY2lBOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lDQWdJQ0F2THlCT2IzUnBZMmx1WnlCemIyMWxJSGRsYVhKa0lIQmxjbVp2Y20xaGJtTmxJR2x0Y0d4cFkyRjBhVzl1Y3lCM2FYUm9JSFJvYVhNZ1kyOXVZMlZ3ZEM1Y2JpQWdJQ0FnSUNBZ2NHRjBZMmhPYjJSbEtHVnNaVzFsYm5Rc0lHNWxlSFJTWlc1a1pYSXVibVYzU0ZSTlRDd2dibVY0ZEZKbGJtUmxjaTV2Y0hScGIyNXpLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdMeThnVUhKdlkyVnpjeUIwYUdVZ1pHRjBZU0JwYlcxbFpHbGhkR1ZzZVNCaGJtUWdkMkZwZENCMWJuUnBiQ0JoYkd3Z2RISmhibk5wZEdsdmJpQmpZV3hzWW1GamEzTmNiaUFnSUNBdkx5Qm9ZWFpsSUdOdmJYQnNaWFJsWkM1Y2JpQWdJQ0JzWlhRZ2NISnZZMlZ6YzFCeWIyMXBjMlVnUFNCd2NtOWpaWE56VUdGMFkyaGxjeWhsYkdWdFpXNTBMQ0J3WVhSamFHVnpLVHRjYmx4dUlDQWdJQzh2SUU5d1pYSmhkR1VnYzNsdVkyaHliMjV2ZFhOc2VTQjFibXhsYzNNZ2IzQjBaV1FnYVc1MGJ5QmhJRkJ5YjIxcGMyVXRZMmhoYVc0dVhHNGdJQ0FnYVdZZ0tIQnliMk5sYzNOUWNtOXRhWE5sS1NCN0lIQnliMk5sYzNOUWNtOXRhWE5sTG5Sb1pXNG9ZMjl0Y0d4bGRHVlNaVzVrWlhJcE95QjlYRzRnSUNBZ1pXeHpaU0I3SUdOdmJYQnNaWFJsVW1WdVpHVnlLQ2s3SUgxY2JpQWdmVnh1ZlZ4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc3luYztcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbE1lbW9yeSA9IHJlcXVpcmUoJy4uL3V0aWwvbWVtb3J5Jyk7XG5cbnZhciBwb29scyA9IF91dGlsUG9vbHMucG9vbHM7XG52YXIgcHJvdGVjdEVsZW1lbnQgPSBfdXRpbE1lbW9yeS5wcm90ZWN0RWxlbWVudDtcbnZhciB1bnByb3RlY3RFbGVtZW50ID0gX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudDtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4vKipcbiAqIFN5bmNocm9uaXplcyBjaGFuZ2VzIGZyb20gdGhlIG5ld1RyZWUgaW50byB0aGUgb2xkVHJlZS5cbiAqXG4gKiBAcGFyYW0gb2xkVHJlZVxuICogQHBhcmFtIG5ld1RyZWVcbiAqL1xuXG5mdW5jdGlvbiBzeW5jKG9sZFRyZWUsIG5ld1RyZWUpIHtcbiAgdmFyIHBhdGNoZXMgPSB0aGlzO1xuICB2YXIgb2xkQ2hpbGROb2RlcyA9IG9sZFRyZWUuY2hpbGROb2RlcztcbiAgdmFyIG9sZENoaWxkTm9kZXNMZW5ndGggPSBvbGRDaGlsZE5vZGVzID8gb2xkQ2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuICB2YXIgb2xkRWxlbWVudCA9IG9sZFRyZWUuZWxlbWVudDtcbiAgdmFyIHRleHRFbGVtZW50cyA9IFsnc2NyaXB0JywgJ3N0eWxlJywgJ3RleHRhcmVhJywgJyN0ZXh0J107XG5cbiAgaWYgKCFuZXdUcmVlKSB7XG4gICAgdmFyIHJlbW92ZWQgPSBvbGRDaGlsZE5vZGVzLnNwbGljZSgwLCBvbGRDaGlsZE5vZGVzTGVuZ3RoKTtcblxuICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0geyBfX2RvX186IC0xLCBlbGVtZW50OiBvbGRFbGVtZW50IH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbW92ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIFVzZWQgYnkgdGhlIFdvcmtlciB0byB0cmFjayBlbGVtZW50cyByZW1vdmVkLlxuICAgICAgaWYgKHBhdGNoZXMucmVtb3ZhbHMpIHtcbiAgICAgICAgcGF0Y2hlcy5yZW1vdmFscy5wdXNoKHJlbW92ZWRbaV0uZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHVucHJvdGVjdEVsZW1lbnQocmVtb3ZlZFtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5vZGVWYWx1ZSA9IG5ld1RyZWUubm9kZVZhbHVlO1xuICB2YXIgY2hpbGROb2RlcyA9IG5ld1RyZWUuY2hpbGROb2RlcztcbiAgdmFyIGNoaWxkTm9kZXNMZW5ndGggPSBjaGlsZE5vZGVzID8gY2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuICB2YXIgbmV3RWxlbWVudCA9IG5ld1RyZWUuZWxlbWVudDtcblxuICAvLyBJZiB0aGUgZWxlbWVudCB3ZSdyZSByZXBsYWNpbmcgaXMgdG90YWxseSBkaWZmZXJlbnQgZnJvbSB0aGUgcHJldmlvdXNcbiAgLy8gcmVwbGFjZSB0aGUgZW50aXJlIGVsZW1lbnQsIGRvbid0IGJvdGhlciBpbnZlc3RpZ2F0aW5nIGNoaWxkcmVuLlxuICBpZiAob2xkVHJlZS5ub2RlTmFtZSAhPT0gbmV3VHJlZS5ub2RlTmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJlcGxhY2UgdGV4dCBub2RlIHZhbHVlcyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQuXG4gIGlmICh0ZXh0RWxlbWVudHMuaW5kZXhPZihuZXdUcmVlLm5vZGVOYW1lKSA+IC0xKSB7XG4gICAgLy8gVGV4dCBjaGFuZ2VkLlxuICAgIGlmIChvbGRUcmVlLm5vZGVWYWx1ZSAhPT0gbm9kZVZhbHVlKSB7XG4gICAgICBvbGRUcmVlLm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcblxuICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7XG4gICAgICAgIF9fZG9fXzogMyxcbiAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgdmFsdWU6IG5vZGVWYWx1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBNb3N0IGNvbW1vbiBhZGRpdGl2ZSBlbGVtZW50cy5cbiAgaWYgKGNoaWxkTm9kZXNMZW5ndGggPiBvbGRDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gU3RvcmUgZWxlbWVudHMgaW4gYSBEb2N1bWVudEZyYWdtZW50IHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGFuZCBiZVxuICAgIC8vIGdlbmVyYWxseSBzaW1wbGllciB0byB3b3JrIHdpdGguXG4gICAgdmFyIGZyYWdtZW50ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gb2xkQ2hpbGROb2Rlc0xlbmd0aDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgLy8gVXNlZCBieSB0aGUgV29ya2VyIHRvIHRyYWNrIGVsZW1lbnRzIGFkZGVkLlxuICAgICAgaWYgKHBhdGNoZXMuYWRkaXRpb25zKSB7XG4gICAgICAgIHBhdGNoZXMuYWRkaXRpb25zLnB1c2goY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHByb3RlY3RFbGVtZW50KGNoaWxkTm9kZXNbaV0pO1xuXG4gICAgICAvLyBJbnRlcm5hbGx5IGFkZCB0byB0aGUgdHJlZS5cbiAgICAgIG9sZENoaWxkTm9kZXNbb2xkQ2hpbGROb2Rlcy5sZW5ndGhdID0gY2hpbGROb2Rlc1tpXTtcblxuICAgICAgLy8gQWRkIHRvIHRoZSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgIGZyYWdtZW50W2ZyYWdtZW50Lmxlbmd0aF0gPSBjaGlsZE5vZGVzW2ldO1xuICAgIH1cblxuICAgIC8vIEFzc2lnbiB0aGUgZnJhZ21lbnQgdG8gdGhlIHBhdGNoZXMgdG8gYmUgaW5qZWN0ZWQuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7XG4gICAgICBfX2RvX186IDEsXG4gICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgZnJhZ21lbnQ6IGZyYWdtZW50XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJlcGxhY2UgZWxlbWVudHMgaWYgdGhleSBhcmUgZGlmZmVyZW50LlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgIGlmIChvbGRDaGlsZE5vZGVzW2ldLm5vZGVOYW1lICE9PSBjaGlsZE5vZGVzW2ldLm5vZGVOYW1lKSB7XG4gICAgICAvLyBBZGQgdG8gdGhlIHBhdGNoZXMuXG4gICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgICAgX19kb19fOiAxLFxuICAgICAgICBvbGQ6IG9sZENoaWxkTm9kZXNbaV0sXG4gICAgICAgICduZXcnOiBjaGlsZE5vZGVzW2ldXG4gICAgICB9O1xuXG4gICAgICAvLyBVc2VkIGJ5IHRoZSBXb3JrZXIgdG8gdHJhY2sgZWxlbWVudHMgcmVtb3ZlZC5cbiAgICAgIGlmIChwYXRjaGVzLnJlbW92YWxzKSB7XG4gICAgICAgIHBhdGNoZXMucmVtb3ZhbHMucHVzaChvbGRDaGlsZE5vZGVzW2ldLmVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBVc2VkIGJ5IHRoZSBXb3JrZXIgdG8gdHJhY2sgZWxlbWVudHMgYWRkZWQuXG4gICAgICBpZiAocGF0Y2hlcy5hZGRpdGlvbnMpIHtcbiAgICAgICAgcGF0Y2hlcy5hZGRpdGlvbnMucHVzaChjaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgdW5wcm90ZWN0RWxlbWVudChvbGRDaGlsZE5vZGVzW2ldKTtcbiAgICAgIHByb3RlY3RFbGVtZW50KGNoaWxkTm9kZXNbaV0pO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBpbnRlcm5hbCB0cmVlJ3MgcG9pbnQgb2YgdmlldyBvZiB0aGlzIGVsZW1lbnQuXG4gICAgICBvbGRDaGlsZE5vZGVzW2ldID0gY2hpbGROb2Rlc1tpXTtcbiAgICB9XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlc2UgZWxlbWVudHMuXG4gIGlmIChvbGRDaGlsZE5vZGVzTGVuZ3RoID4gY2hpbGROb2Rlc0xlbmd0aCkge1xuICAgIC8vIEVsZW1lbnRzIHRvIHJlbW92ZS5cbiAgICB2YXIgdG9SZW1vdmUgPSBzbGljZS5jYWxsKG9sZENoaWxkTm9kZXMsIGNoaWxkTm9kZXNMZW5ndGgsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b1JlbW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBlbGVtZW50LCB0aGlzIGhhcHBlbnMgYmVmb3JlIHRoZSBzcGxpY2Ugc28gdGhhdCB3ZSBzdGlsbFxuICAgICAgLy8gaGF2ZSBhY2Nlc3MgdG8gdGhlIGVsZW1lbnQuXG4gICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHsgX19kb19fOiAxLCBvbGQ6IHRvUmVtb3ZlW2ldLmVsZW1lbnQgfTtcbiAgICB9XG5cbiAgICB2YXIgcmVtb3ZlZCA9IG9sZENoaWxkTm9kZXMuc3BsaWNlKGNoaWxkTm9kZXNMZW5ndGgsIG9sZENoaWxkTm9kZXNMZW5ndGggLSBjaGlsZE5vZGVzTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gVXNlZCBieSB0aGUgV29ya2VyIHRvIHRyYWNrIGVsZW1lbnRzIHJlbW92ZWQuXG4gICAgICBpZiAocGF0Y2hlcy5yZW1vdmFscykge1xuICAgICAgICBwYXRjaGVzLnJlbW92YWxzLnB1c2gocmVtb3ZlZFtpXS5lbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgdW5wcm90ZWN0RWxlbWVudChyZW1vdmVkW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBTeW5jaHJvbml6ZSBhdHRyaWJ1dGVzXG4gIHZhciBhdHRyaWJ1dGVzID0gbmV3VHJlZS5hdHRyaWJ1dGVzO1xuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIG9sZExlbmd0aCA9IG9sZFRyZWUuYXR0cmlidXRlcy5sZW5ndGg7XG4gICAgdmFyIG5ld0xlbmd0aCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xuXG4gICAgLy8gU3RhcnQgd2l0aCB0aGUgbW9zdCBjb21tb24sIGFkZGl0aXZlLlxuICAgIGlmIChuZXdMZW5ndGggPiBvbGRMZW5ndGgpIHtcbiAgICAgIHZhciB0b0FkZCA9IHNsaWNlLmNhbGwoYXR0cmlidXRlcywgb2xkTGVuZ3RoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b0FkZC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgIF9fZG9fXzogMixcbiAgICAgICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgICAgIG5hbWU6IHRvQWRkW2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IHRvQWRkW2ldLnZhbHVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGF0dHIgPSBwb29scy5hdHRyaWJ1dGVPYmplY3QuZ2V0KCk7XG4gICAgICAgIGF0dHIubmFtZSA9IHRvQWRkW2ldLm5hbWU7XG4gICAgICAgIGF0dHIudmFsdWUgPSB0b0FkZFtpXS52YWx1ZTtcblxuICAgICAgICBwb29scy5hdHRyaWJ1dGVPYmplY3QucHJvdGVjdChhdHRyKTtcblxuICAgICAgICAvLyBQdXNoIHRoZSBjaGFuZ2Ugb2JqZWN0IGludG8gaW50byB0aGUgdmlydHVhbCB0cmVlLlxuICAgICAgICBvbGRUcmVlLmF0dHJpYnV0ZXNbb2xkVHJlZS5hdHRyaWJ1dGVzLmxlbmd0aF0gPSBhdHRyO1xuXG4gICAgICAgIC8vIEFkZCB0aGUgY2hhbmdlIHRvIHRoZSBzZXJpZXMgb2YgcGF0Y2hlcy5cbiAgICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSBjaGFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIHJlbW92YWxzLlxuICAgIGlmIChvbGRMZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgIHZhciB0b1JlbW92ZSA9IHNsaWNlLmNhbGwob2xkVHJlZS5hdHRyaWJ1dGVzLCBuZXdMZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9SZW1vdmVbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZnJvbSB0aGUgdmlydHVhbCBub2RlLlxuICAgICAgICB2YXIgcmVtb3ZlZCA9IG9sZFRyZWUuYXR0cmlidXRlcy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHJlbW92ZWQubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgcG9vbHMuYXR0cmlidXRlT2JqZWN0LnVucHJvdGVjdChyZW1vdmVkW19pXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdGhlIGNoYW5nZSB0byB0aGUgc2VyaWVzIG9mIHBhdGNoZXMuXG4gICAgICAgIHBhdGNoZXNbcGF0Y2hlcy5sZW5ndGhdID0gY2hhbmdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBtb2RpZmljYXRpb25zLlxuICAgIHZhciB0b01vZGlmeSA9IGF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvTW9kaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2xkQXR0clZhbHVlID0gb2xkVHJlZS5hdHRyaWJ1dGVzW2ldICYmIG9sZFRyZWUuYXR0cmlidXRlc1tpXS52YWx1ZTtcbiAgICAgIHZhciBuZXdBdHRyVmFsdWUgPSBhdHRyaWJ1dGVzW2ldICYmIGF0dHJpYnV0ZXNbaV0udmFsdWU7XG5cbiAgICAgIC8vIE9ubHkgcHVzaCBpbiBhIGNoYW5nZSBpZiB0aGUgYXR0cmlidXRlIG9yIHZhbHVlIGNoYW5nZXMuXG4gICAgICBpZiAob2xkQXR0clZhbHVlICE9PSBuZXdBdHRyVmFsdWUpIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b01vZGlmeVtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB0b01vZGlmeVtpXS52YWx1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGF0dHJpYnV0ZSBpbiB0aGUgdmlydHVhbCBub2RlLlxuICAgICAgICB2YXIgYXR0ciA9IG9sZFRyZWUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgYXR0ci5uYW1lID0gdG9Nb2RpZnlbaV0ubmFtZTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IHRvTW9kaWZ5W2ldLnZhbHVlO1xuXG4gICAgICAgIC8vIEFkZCB0aGUgY2hhbmdlIHRvIHRoZSBzZXJpZXMgb2YgcGF0Y2hlcy5cbiAgICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSBjaGFuZ2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gU3luYyBlYWNoIGN1cnJlbnQgbm9kZS5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRDaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9sZENoaWxkTm9kZXNbaV0uZWxlbWVudCAhPT0gY2hpbGROb2Rlc1tpXS5lbGVtZW50KSB7XG4gICAgICBzeW5jLmNhbGwocGF0Y2hlcywgb2xkVHJlZS5jaGlsZE5vZGVzW2ldLCBjaGlsZE5vZGVzW2ldKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDI1dlpHVXZjM2x1WXk1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenR4UWtGclFuZENMRWxCUVVrN08zbENRV3hDU1N4bFFVRmxPenN3UWtGSmVFTXNaMEpCUVdkQ096dEJRVVYyUWl4SlFVRkpMRXRCUVVzc2JVSkJRVk1zUTBGQlF6dEJRVU51UWl4SlFVRkpMR05CUVdNc05rSkJRV3RDTEVOQlFVTTdRVUZEY2tNc1NVRkJTU3huUWtGQlowSXNLMEpCUVc5Q0xFTkJRVU03TzBGQlJYcERMRWxCUVUwc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRPenM3T3pzN096czdRVUZSY2tJc1UwRkJVeXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlR0QlFVTTNReXhOUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEYmtJc1RVRkJTU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXp0QlFVTjJReXhOUVVGSkxHMUNRVUZ0UWl4SFFVRkhMR0ZCUVdFc1IwRkJSeXhoUVVGaExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnVSU3hOUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUTJwRExFMUJRVWtzV1VGQldTeEhRVUZITEVOQlFVTXNVVUZCVVN4RlFVRkZMRTlCUVU4c1JVRkJSU3hWUVVGVkxFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRWRUxFMUJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEV2l4UlFVRkpMRTlCUVU4c1IwRkJSeXhoUVVGaExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNSVUZCUlN4dFFrRkJiVUlzUTBGQlF5eERRVUZET3p0QlFVVXpSQ3hYUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRVZCUVVVc1RVRkJUU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZGTEU5QlFVOHNSVUZCUlN4VlFVRlZMRVZCUVVVc1EwRkJRenM3UVVGRk9VUXNVMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEU5QlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3TzBGQlJYWkRMRlZCUVVrc1QwRkJUeXhEUVVGRExGRkJRVkVzUlVGQlJUdEJRVUZGTEdWQlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRQUVVGRk96dEJRVVZ3UlN4elFrRkJaMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVNNVFqczdRVUZGUkN4WFFVRlBPMGRCUTFJN08wRkJSVVFzVFVGQlNTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVOc1F5eE5RVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRE8wRkJRM0JETEUxQlFVa3NaMEpCUVdkQ0xFZEJRVWNzVlVGQlZTeEhRVUZITEZWQlFWVXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRekZFTEUxQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03T3pzN1FVRkpha01zVFVGQlNTeFBRVUZQTEVOQlFVTXNVVUZCVVN4TFFVRkxMRTlCUVU4c1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRGVrTXNWMEZCVHp0SFFVTlNPenM3UVVGSFJDeE5RVUZKTEZsQlFWa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RlFVRkZPenRCUVVVdlF5eFJRVUZKTEU5QlFVOHNRMEZCUXl4VFFVRlRMRXRCUVVzc1UwRkJVeXhGUVVGRk8wRkJRMjVETEdGQlFVOHNRMEZCUXl4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRE96dEJRVVU1UWl4aFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITzBGQlEzaENMR05CUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzWlVGQlR5eEZRVUZGTEZWQlFWVTdRVUZEYmtJc1lVRkJTeXhGUVVGRkxGTkJRVk03VDBGRGFrSXNRMEZCUXp0TFFVTklPenRCUVVWRUxGZEJRVTg3UjBGRFVqczdPMEZCUjBRc1RVRkJTU3huUWtGQlowSXNSMEZCUnl4dFFrRkJiVUlzUlVGQlJUczdPMEZCUnpGRExGRkJRVWtzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXpzN1FVRkZiRUlzVTBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4dFFrRkJiVUlzUlVGQlJTeERRVUZETEVkQlFVY3NaMEpCUVdkQ0xFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdPMEZCUlRORUxGVkJRVWtzVDBGQlR5eERRVUZETEZOQlFWTXNSVUZCUlR0QlFVRkZMR1ZCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRVVU3TzBGQlJXcEZMRzlDUVVGakxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN096dEJRVWM1UWl4dFFrRkJZU3hEUVVGRExHRkJRV0VzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03T3p0QlFVZHdSQ3hqUVVGUkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU16UXpzN08wRkJSMFFzVjBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSenRCUVVONFFpeFpRVUZOTEVWQlFVVXNRMEZCUXp0QlFVTlVMR0ZCUVU4c1JVRkJSU3hWUVVGVk8wRkJRMjVDTEdOQlFWRXNSVUZCUlN4UlFVRlJPMHRCUTI1Q0xFTkJRVU03UjBGRFNEczdPMEZCUjBRc1QwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMR2RDUVVGblFpeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNwRExGRkJRVWtzWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1MwRkJTeXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNVVUZCVVN4RlFVRkZPenRCUVVWNFJDeGhRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSE8wRkJRM2hDTEdOQlFVMHNSVUZCUlN4RFFVRkRPMEZCUTFRc1YwRkJSeXhGUVVGRkxHRkJRV0VzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY2tJc1pVRkJTeXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETzA5QlEyNUNMRU5CUVVNN096dEJRVWRHTEZWQlFVa3NUMEZCVHl4RFFVRkRMRkZCUVZFc1JVRkJSVHRCUVVOd1FpeGxRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1QwRkRha1E3T3p0QlFVZEVMRlZCUVVrc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJUdEJRVUZGTEdWQlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUVVVN08wRkJSV3BGTEhOQ1FVRm5RaXhEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTI1RExHOUNRVUZqTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03T3p0QlFVYzVRaXh0UWtGQllTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU5zUXp0SFFVTkdPenM3UVVGSFJDeE5RVUZKTEcxQ1FVRnRRaXhIUVVGSExHZENRVUZuUWl4RlFVRkZPenRCUVVVeFF5eFJRVUZKTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUlVGQlJTeG5Ra0ZCWjBJc1JVRkRka1FzYlVKQlFXMUNMRU5CUVVNc1EwRkJRenM3UVVGRmRrSXNVMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEZGQlFWRXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3T3p0QlFVZDRReXhoUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRVZCUVVVc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEhRVUZITEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETzB0QlEyNUZPenRCUVVWRUxGRkJRVWtzVDBGQlR5eEhRVUZITEdGQlFXRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1owSkJRV2RDTEVWQlEycEVMRzFDUVVGdFFpeEhRVUZITEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03TzBGQlJURkRMRk5CUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGT3p0QlFVVjJReXhWUVVGSkxFOUJRVThzUTBGQlF5eFJRVUZSTEVWQlFVVTdRVUZCUlN4bFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03VDBGQlJUczdRVUZGY0VVc2MwSkJRV2RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRE9VSTdSMEZEUmpzN08wRkJSMFFzVFVGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJRenM3UVVGRmNFTXNUVUZCU1N4VlFVRlZMRVZCUVVVN1FVRkRaQ3hSUVVGSkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVNeFF5eFJRVUZKTEZOQlFWTXNSMEZCUnl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRE96czdRVUZIYkVNc1VVRkJTU3hUUVVGVExFZEJRVWNzVTBGQlV5eEZRVUZGTzBGQlEzcENMRlZCUVVrc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE96dEJRVVU1UXl4WFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU55UXl4WlFVRkpMRTFCUVUwc1IwRkJSenRCUVVOWUxHZENRVUZOTEVWQlFVVXNRMEZCUXp0QlFVTlVMR2xDUVVGUExFVkJRVVVzVlVGQlZUdEJRVU51UWl4alFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVazdRVUZEYmtJc1pVRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxPMU5CUTNSQ0xFTkJRVU03TzBGQlJVWXNXVUZCU1N4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTjJReXhaUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRE1VSXNXVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPenRCUVVVMVFpeGhRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6czdPMEZCUjNCRExHVkJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdPenRCUVVkeVJDeGxRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFMUJRVTBzUTBGQlF6dFBRVU5zUXp0TFFVTkdPenM3UVVGSFJDeFJRVUZKTEZOQlFWTXNSMEZCUnl4VFFVRlRMRVZCUVVVN1FVRkRla0lzVlVGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPenRCUVVWNlJDeFhRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVONFF5eFpRVUZKTEUxQlFVMHNSMEZCUnp0QlFVTllMR2RDUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU5VTEdsQ1FVRlBMRVZCUVVVc1ZVRkJWVHRCUVVOdVFpeGpRVUZKTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWs3UVVGRGRFSXNaVUZCU3l4RlFVRkZMRk5CUVZNN1UwRkRha0lzUTBGQlF6czdPMEZCUjBZc1dVRkJTU3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVTVReXhoUVVGTExFbEJRVWtzUlVGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RlFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlJTeEZRVUZETEVWQlFVVXNSVUZCUlR0QlFVTjJReXhsUVVGTExFTkJRVU1zWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1JVRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFRRVU0zUXpzN08wRkJSMFFzWlVGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU03VDBGRGJFTTdTMEZEUmpzN08wRkJSMFFzVVVGQlNTeFJRVUZSTEVkQlFVY3NWVUZCVlN4RFFVRkRPenRCUVVVeFFpeFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVONFF5eFZRVUZKTEZsQlFWa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETzBGQlEzaEZMRlZCUVVrc1dVRkJXU3hIUVVGSExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZET3pzN1FVRkhlRVFzVlVGQlNTeFpRVUZaTEV0QlFVc3NXVUZCV1N4RlFVRkZPMEZCUTJwRExGbEJRVWtzVFVGQlRTeEhRVUZITzBGQlExZ3NaMEpCUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzYVVKQlFVOHNSVUZCUlN4VlFVRlZPMEZCUTI1Q0xHTkJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTVHRCUVVOMFFpeGxRVUZMTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXM3VTBGRGVrSXNRMEZCUXpzN08wRkJSMFlzV1VGQlNTeEpRVUZKTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4WlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkROMElzV1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZET3pzN1FVRkhMMElzWlVGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU03VDBGRGJFTTdTMEZEUmp0SFFVTkdPenM3UVVGSFJDeFBRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzWVVGQllTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVNM1F5eFJRVUZKTEdGQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGUExFdEJRVXNzVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVOMFJDeFZRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlF6RkVPMGRCUTBZN1EwRkRSaUlzSW1acGJHVWlPaUl2YUc5dFpTOTBhVzB2WjJsMEwyUnBabVpvZEcxc0wyeHBZaTl1YjJSbEwzTjVibU11YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ2V5QndiMjlzY3lCaGN5QmZjRzl2YkhNZ2ZTQm1jbTl0SUNjdUxpOTFkR2xzTDNCdmIyeHpKenRjYm1sdGNHOXlkQ0I3WEc0Z0lIQnliM1JsWTNSRmJHVnRaVzUwSUdGeklGOXdjbTkwWldOMFJXeGxiV1Z1ZEN4Y2JpQWdkVzV3Y205MFpXTjBSV3hsYldWdWRDQmhjeUJmZFc1d2NtOTBaV04wUld4bGJXVnVkRnh1ZlNCbWNtOXRJQ2N1TGk5MWRHbHNMMjFsYlc5eWVTYzdYRzVjYm5aaGNpQndiMjlzY3lBOUlGOXdiMjlzY3p0Y2JuWmhjaUJ3Y205MFpXTjBSV3hsYldWdWRDQTlJRjl3Y205MFpXTjBSV3hsYldWdWREdGNiblpoY2lCMWJuQnliM1JsWTNSRmJHVnRaVzUwSUQwZ1gzVnVjSEp2ZEdWamRFVnNaVzFsYm5RN1hHNWNibU52Ym5OMElITnNhV05sSUQwZ1FYSnlZWGt1Y0hKdmRHOTBlWEJsTG5Oc2FXTmxPMXh1WEc0dktpcGNiaUFxSUZONWJtTm9jbTl1YVhwbGN5QmphR0Z1WjJWeklHWnliMjBnZEdobElHNWxkMVJ5WldVZ2FXNTBieUIwYUdVZ2IyeGtWSEpsWlM1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnYjJ4a1ZISmxaVnh1SUNvZ1FIQmhjbUZ0SUc1bGQxUnlaV1ZjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z2MzbHVZeWh2YkdSVWNtVmxMQ0J1WlhkVWNtVmxLU0I3WEc0Z0lHeGxkQ0J3WVhSamFHVnpJRDBnZEdocGN6dGNiaUFnYkdWMElHOXNaRU5vYVd4a1RtOWtaWE1nUFNCdmJHUlVjbVZsTG1Ob2FXeGtUbTlrWlhNN1hHNGdJR3hsZENCdmJHUkRhR2xzWkU1dlpHVnpUR1Z1WjNSb0lEMGdiMnhrUTJocGJHUk9iMlJsY3lBL0lHOXNaRU5vYVd4a1RtOWtaWE11YkdWdVozUm9JRG9nTUR0Y2JpQWdiR1YwSUc5c1pFVnNaVzFsYm5RZ1BTQnZiR1JVY21WbExtVnNaVzFsYm5RN1hHNGdJR3hsZENCMFpYaDBSV3hsYldWdWRITWdQU0JiSjNOamNtbHdkQ2NzSUNkemRIbHNaU2NzSUNkMFpYaDBZWEpsWVNjc0lDY2pkR1Y0ZENkZE8xeHVYRzRnSUdsbUlDZ2hibVYzVkhKbFpTa2dlMXh1SUNBZ0lHeGxkQ0J5WlcxdmRtVmtJRDBnYjJ4a1EyaHBiR1JPYjJSbGN5NXpjR3hwWTJVb01Dd2diMnhrUTJocGJHUk9iMlJsYzB4bGJtZDBhQ2s3WEc1Y2JpQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJSHNnWDE5a2IxOWZPaUF0TVN3Z1pXeGxiV1Z1ZERvZ2IyeGtSV3hsYldWdWRDQjlPMXh1WEc0Z0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0J5WlcxdmRtVmtMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBdkx5QlZjMlZrSUdKNUlIUm9aU0JYYjNKclpYSWdkRzhnZEhKaFkyc2daV3hsYldWdWRITWdjbVZ0YjNabFpDNWNiaUFnSUNBZ0lHbG1JQ2h3WVhSamFHVnpMbkpsYlc5MllXeHpLU0I3SUhCaGRHTm9aWE11Y21WdGIzWmhiSE11Y0hWemFDaHlaVzF2ZG1Wa1cybGRMbVZzWlcxbGJuUXBPeUI5WEc1Y2JpQWdJQ0FnSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFvY21WdGIzWmxaRnRwWFNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVPMXh1SUNCOVhHNWNiaUFnYkdWMElHNXZaR1ZXWVd4MVpTQTlJRzVsZDFSeVpXVXVibTlrWlZaaGJIVmxPMXh1SUNCc1pYUWdZMmhwYkdST2IyUmxjeUE5SUc1bGQxUnlaV1V1WTJocGJHUk9iMlJsY3p0Y2JpQWdiR1YwSUdOb2FXeGtUbTlrWlhOTVpXNW5kR2dnUFNCamFHbHNaRTV2WkdWeklEOGdZMmhwYkdST2IyUmxjeTVzWlc1bmRHZ2dPaUF3TzF4dUlDQnNaWFFnYm1WM1JXeGxiV1Z1ZENBOUlHNWxkMVJ5WldVdVpXeGxiV1Z1ZER0Y2JseHVJQ0F2THlCSlppQjBhR1VnWld4bGJXVnVkQ0IzWlNkeVpTQnlaWEJzWVdOcGJtY2dhWE1nZEc5MFlXeHNlU0JrYVdabVpYSmxiblFnWm5KdmJTQjBhR1VnY0hKbGRtbHZkWE5jYmlBZ0x5OGdjbVZ3YkdGalpTQjBhR1VnWlc1MGFYSmxJR1ZzWlcxbGJuUXNJR1J2YmlkMElHSnZkR2hsY2lCcGJuWmxjM1JwWjJGMGFXNW5JR05vYVd4a2NtVnVMbHh1SUNCcFppQW9iMnhrVkhKbFpTNXViMlJsVG1GdFpTQWhQVDBnYm1WM1ZISmxaUzV1YjJSbFRtRnRaU2tnZTF4dUlDQWdJSEpsZEhWeWJqdGNiaUFnZlZ4dVhHNGdJQzh2SUZKbGNHeGhZMlVnZEdWNGRDQnViMlJsSUhaaGJIVmxjeUJwWmlCMGFHVjVJR0Z5WlNCa2FXWm1aWEpsYm5RdVhHNGdJR2xtSUNoMFpYaDBSV3hsYldWdWRITXVhVzVrWlhoUFppaHVaWGRVY21WbExtNXZaR1ZPWVcxbEtTQStJQzB4S1NCN1hHNGdJQ0FnTHk4Z1ZHVjRkQ0JqYUdGdVoyVmtMbHh1SUNBZ0lHbG1JQ2h2YkdSVWNtVmxMbTV2WkdWV1lXeDFaU0FoUFQwZ2JtOWtaVlpoYkhWbEtTQjdYRzRnSUNBZ0lDQnZiR1JVY21WbExtNXZaR1ZXWVd4MVpTQTlJRzV2WkdWV1lXeDFaVHRjYmx4dUlDQWdJQ0FnY0dGMFkyaGxjMXR3WVhSamFHVnpMbXhsYm1kMGFGMGdQU0I3WEc0Z0lDQWdJQ0FnSUY5ZlpHOWZYem9nTXl4Y2JpQWdJQ0FnSUNBZ1pXeGxiV1Z1ZERvZ2IyeGtSV3hsYldWdWRDeGNiaUFnSUNBZ0lDQWdkbUZzZFdVNklHNXZaR1ZXWVd4MVpWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTQ3WEc0Z0lIMWNibHh1SUNBdkx5Qk5iM04wSUdOdmJXMXZiaUJoWkdScGRHbDJaU0JsYkdWdFpXNTBjeTVjYmlBZ2FXWWdLR05vYVd4a1RtOWtaWE5NWlc1bmRHZ2dQaUJ2YkdSRGFHbHNaRTV2WkdWelRHVnVaM1JvS1NCN1hHNGdJQ0FnTHk4Z1UzUnZjbVVnWld4bGJXVnVkSE1nYVc0Z1lTQkViMk4xYldWdWRFWnlZV2R0Wlc1MElIUnZJR2x1WTNKbFlYTmxJSEJsY21admNtMWhibU5sSUdGdVpDQmlaVnh1SUNBZ0lDOHZJR2RsYm1WeVlXeHNlU0J6YVcxd2JHbGxjaUIwYnlCM2IzSnJJSGRwZEdndVhHNGdJQ0FnYkdWMElHWnlZV2R0Wlc1MElEMGdXMTA3WEc1Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ2IyeGtRMmhwYkdST2IyUmxjMHhsYm1kMGFEc2dhU0E4SUdOb2FXeGtUbTlrWlhOTVpXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdMeThnVlhObFpDQmllU0IwYUdVZ1YyOXlhMlZ5SUhSdklIUnlZV05ySUdWc1pXMWxiblJ6SUdGa1pHVmtMbHh1SUNBZ0lDQWdhV1lnS0hCaGRHTm9aWE11WVdSa2FYUnBiMjV6S1NCN0lIQmhkR05vWlhNdVlXUmthWFJwYjI1ekxuQjFjMmdvWTJocGJHUk9iMlJsYzF0cFhTazdJSDFjYmx4dUlDQWdJQ0FnY0hKdmRHVmpkRVZzWlcxbGJuUW9ZMmhwYkdST2IyUmxjMXRwWFNrN1hHNWNiaUFnSUNBZ0lDOHZJRWx1ZEdWeWJtRnNiSGtnWVdSa0lIUnZJSFJvWlNCMGNtVmxMbHh1SUNBZ0lDQWdiMnhrUTJocGJHUk9iMlJsYzF0dmJHUkRhR2xzWkU1dlpHVnpMbXhsYm1kMGFGMGdQU0JqYUdsc1pFNXZaR1Z6VzJsZE8xeHVYRzRnSUNBZ0lDQXZMeUJCWkdRZ2RHOGdkR2hsSUdSdlkzVnRaVzUwSUdaeVlXZHRaVzUwTGx4dUlDQWdJQ0FnWm5KaFoyMWxiblJiWm5KaFoyMWxiblF1YkdWdVozUm9YU0E5SUdOb2FXeGtUbTlrWlhOYmFWMDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdRWE56YVdkdUlIUm9aU0JtY21GbmJXVnVkQ0IwYnlCMGFHVWdjR0YwWTJobGN5QjBieUJpWlNCcGJtcGxZM1JsWkM1Y2JpQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJSHRjYmlBZ0lDQWdJRjlmWkc5Zlh6b2dNU3hjYmlBZ0lDQWdJR1ZzWlcxbGJuUTZJRzlzWkVWc1pXMWxiblFzWEc0Z0lDQWdJQ0JtY21GbmJXVnVkRG9nWm5KaFoyMWxiblJjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnTHk4Z1VtVndiR0ZqWlNCbGJHVnRaVzUwY3lCcFppQjBhR1Y1SUdGeVpTQmthV1ptWlhKbGJuUXVYRzRnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z1kyaHBiR1JPYjJSbGMweGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdhV1lnS0c5c1pFTm9hV3hrVG05a1pYTmJhVjB1Ym05a1pVNWhiV1VnSVQwOUlHTm9hV3hrVG05a1pYTmJhVjB1Ym05a1pVNWhiV1VwSUh0Y2JpQWdJQ0FnSUM4dklFRmtaQ0IwYnlCMGFHVWdjR0YwWTJobGN5NWNiaUFnSUNBZ0lIQmhkR05vWlhOYmNHRjBZMmhsY3k1c1pXNW5kR2hkSUQwZ2UxeHVJQ0FnSUNBZ0lDQmZYMlJ2WDE4NklERXNYRzRnSUNBZ0lDQWdJRzlzWkRvZ2IyeGtRMmhwYkdST2IyUmxjMXRwWFN4Y2JpQWdJQ0FnSUNBZ2JtVjNPaUJqYUdsc1pFNXZaR1Z6VzJsZFhHNGdJQ0FnSUNCOU8xeHVYRzRnSUNBZ0lDQXZMeUJWYzJWa0lHSjVJSFJvWlNCWGIzSnJaWElnZEc4Z2RISmhZMnNnWld4bGJXVnVkSE1nY21WdGIzWmxaQzVjYmlBZ0lDQWdJR2xtSUNod1lYUmphR1Z6TG5KbGJXOTJZV3h6S1NCN1hHNGdJQ0FnSUNBZ0lIQmhkR05vWlhNdWNtVnRiM1poYkhNdWNIVnphQ2h2YkdSRGFHbHNaRTV2WkdWelcybGRMbVZzWlcxbGJuUXBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCVmMyVmtJR0o1SUhSb1pTQlhiM0pyWlhJZ2RHOGdkSEpoWTJzZ1pXeGxiV1Z1ZEhNZ1lXUmtaV1F1WEc0Z0lDQWdJQ0JwWmlBb2NHRjBZMmhsY3k1aFpHUnBkR2x2Ym5NcElIc2djR0YwWTJobGN5NWhaR1JwZEdsdmJuTXVjSFZ6YUNoamFHbHNaRTV2WkdWelcybGRLVHNnZlZ4dVhHNGdJQ0FnSUNCMWJuQnliM1JsWTNSRmJHVnRaVzUwS0c5c1pFTm9hV3hrVG05a1pYTmJhVjBwTzF4dUlDQWdJQ0FnY0hKdmRHVmpkRVZzWlcxbGJuUW9ZMmhwYkdST2IyUmxjMXRwWFNrN1hHNWNiaUFnSUNBZ0lDOHZJRkpsY0d4aFkyVWdkR2hsSUdsdWRHVnlibUZzSUhSeVpXVW5jeUJ3YjJsdWRDQnZaaUIyYVdWM0lHOW1JSFJvYVhNZ1pXeGxiV1Z1ZEM1Y2JpQWdJQ0FnSUc5c1pFTm9hV3hrVG05a1pYTmJhVjBnUFNCamFHbHNaRTV2WkdWelcybGRPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUZKbGJXOTJaU0IwYUdWelpTQmxiR1Z0Wlc1MGN5NWNiaUFnYVdZZ0tHOXNaRU5vYVd4a1RtOWtaWE5NWlc1bmRHZ2dQaUJqYUdsc1pFNXZaR1Z6VEdWdVozUm9LU0I3WEc0Z0lDQWdMeThnUld4bGJXVnVkSE1nZEc4Z2NtVnRiM1psTGx4dUlDQWdJR3hsZENCMGIxSmxiVzkyWlNBOUlITnNhV05sTG1OaGJHd29iMnhrUTJocGJHUk9iMlJsY3l3Z1kyaHBiR1JPYjJSbGMweGxibWQwYUN4Y2JpQWdJQ0FnSUc5c1pFTm9hV3hrVG05a1pYTk1aVzVuZEdncE8xeHVYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBiMUpsYlc5MlpTNXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnTHk4Z1VtVnRiM1psSUhSb1pTQmxiR1Z0Wlc1MExDQjBhR2x6SUdoaGNIQmxibk1nWW1WbWIzSmxJSFJvWlNCemNHeHBZMlVnYzI4Z2RHaGhkQ0IzWlNCemRHbHNiRnh1SUNBZ0lDQWdMeThnYUdGMlpTQmhZMk5sYzNNZ2RHOGdkR2hsSUdWc1pXMWxiblF1WEc0Z0lDQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJSHNnWDE5a2IxOWZPaUF4TENCdmJHUTZJSFJ2VW1WdGIzWmxXMmxkTG1Wc1pXMWxiblFnZlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JzWlhRZ2NtVnRiM1psWkNBOUlHOXNaRU5vYVd4a1RtOWtaWE11YzNCc2FXTmxLR05vYVd4a1RtOWtaWE5NWlc1bmRHZ3NYRzRnSUNBZ0lDQnZiR1JEYUdsc1pFNXZaR1Z6VEdWdVozUm9JQzBnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ2s3WEc1Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhKbGJXOTJaV1F1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lDOHZJRlZ6WldRZ1lua2dkR2hsSUZkdmNtdGxjaUIwYnlCMGNtRmpheUJsYkdWdFpXNTBjeUJ5WlcxdmRtVmtMbHh1SUNBZ0lDQWdhV1lnS0hCaGRHTm9aWE11Y21WdGIzWmhiSE1wSUhzZ2NHRjBZMmhsY3k1eVpXMXZkbUZzY3k1d2RYTm9LSEpsYlc5MlpXUmJhVjB1Wld4bGJXVnVkQ2s3SUgxY2JseHVJQ0FnSUNBZ2RXNXdjbTkwWldOMFJXeGxiV1Z1ZENoeVpXMXZkbVZrVzJsZEtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZMeUJUZVc1amFISnZibWw2WlNCaGRIUnlhV0oxZEdWelhHNGdJR3hsZENCaGRIUnlhV0oxZEdWeklEMGdibVYzVkhKbFpTNWhkSFJ5YVdKMWRHVnpPMXh1WEc0Z0lHbG1JQ2hoZEhSeWFXSjFkR1Z6S1NCN1hHNGdJQ0FnYkdWMElHOXNaRXhsYm1kMGFDQTlJRzlzWkZSeVpXVXVZWFIwY21saWRYUmxjeTVzWlc1bmRHZzdYRzRnSUNBZ2JHVjBJRzVsZDB4bGJtZDBhQ0E5SUdGMGRISnBZblYwWlhNdWJHVnVaM1JvTzF4dVhHNGdJQ0FnTHk4Z1UzUmhjblFnZDJsMGFDQjBhR1VnYlc5emRDQmpiMjF0YjI0c0lHRmtaR2wwYVhabExseHVJQ0FnSUdsbUlDaHVaWGRNWlc1bmRHZ2dQaUJ2YkdSTVpXNW5kR2dwSUh0Y2JpQWdJQ0FnSUd4bGRDQjBiMEZrWkNBOUlITnNhV05sTG1OaGJHd29ZWFIwY21saWRYUmxjeXdnYjJ4a1RHVnVaM1JvS1R0Y2JseHVJQ0FnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBiMEZrWkM1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ1kyaGhibWRsSUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJRjlmWkc5Zlh6b2dNaXhjYmlBZ0lDQWdJQ0FnSUNCbGJHVnRaVzUwT2lCdmJHUkZiR1Z0Wlc1MExGeHVJQ0FnSUNBZ0lDQWdJRzVoYldVNklIUnZRV1JrVzJsZExtNWhiV1VzWEc0Z0lDQWdJQ0FnSUNBZ2RtRnNkV1U2SUhSdlFXUmtXMmxkTG5aaGJIVmxMRnh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lHeGxkQ0JoZEhSeUlEMGdjRzl2YkhNdVlYUjBjbWxpZFhSbFQySnFaV04wTG1kbGRDZ3BPMXh1SUNBZ0lDQWdJQ0JoZEhSeUxtNWhiV1VnUFNCMGIwRmtaRnRwWFM1dVlXMWxPMXh1SUNBZ0lDQWdJQ0JoZEhSeUxuWmhiSFZsSUQwZ2RHOUJaR1JiYVYwdWRtRnNkV1U3WEc1Y2JpQWdJQ0FnSUNBZ2NHOXZiSE11WVhSMGNtbGlkWFJsVDJKcVpXTjBMbkJ5YjNSbFkzUW9ZWFIwY2lrN1hHNWNiaUFnSUNBZ0lDQWdMeThnVUhWemFDQjBhR1VnWTJoaGJtZGxJRzlpYW1WamRDQnBiblJ2SUdsdWRHOGdkR2hsSUhacGNuUjFZV3dnZEhKbFpTNWNiaUFnSUNBZ0lDQWdiMnhrVkhKbFpTNWhkSFJ5YVdKMWRHVnpXMjlzWkZSeVpXVXVZWFIwY21saWRYUmxjeTVzWlc1bmRHaGRJRDBnWVhSMGNqdGNibHh1SUNBZ0lDQWdJQ0F2THlCQlpHUWdkR2hsSUdOb1lXNW5aU0IwYnlCMGFHVWdjMlZ5YVdWeklHOW1JSEJoZEdOb1pYTXVYRzRnSUNBZ0lDQWdJSEJoZEdOb1pYTmJjR0YwWTJobGN5NXNaVzVuZEdoZElEMGdZMmhoYm1kbE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklFTm9aV05ySUdadmNpQnlaVzF2ZG1Gc2N5NWNiaUFnSUNCcFppQW9iMnhrVEdWdVozUm9JRDRnYm1WM1RHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCc1pYUWdkRzlTWlcxdmRtVWdQU0J6YkdsalpTNWpZV3hzS0c5c1pGUnlaV1V1WVhSMGNtbGlkWFJsY3l3Z2JtVjNUR1Z1WjNSb0tUdGNibHh1SUNBZ0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0IwYjFKbGJXOTJaUzVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQnNaWFFnWTJoaGJtZGxJRDBnZTF4dUlDQWdJQ0FnSUNBZ0lGOWZaRzlmWHpvZ01peGNiaUFnSUNBZ0lDQWdJQ0JsYkdWdFpXNTBPaUJ2YkdSRmJHVnRaVzUwTEZ4dUlDQWdJQ0FnSUNBZ0lHNWhiV1U2SUhSdlVtVnRiM1psVzJsZExtNWhiV1VzWEc0Z0lDQWdJQ0FnSUNBZ2RtRnNkV1U2SUhWdVpHVm1hVzVsWkN4Y2JpQWdJQ0FnSUNBZ2ZUdGNibHh1SUNBZ0lDQWdJQ0F2THlCU1pXMXZkbVVnZEdobElHRjBkSEpwWW5WMFpTQm1jbTl0SUhSb1pTQjJhWEowZFdGc0lHNXZaR1V1WEc0Z0lDQWdJQ0FnSUd4bGRDQnlaVzF2ZG1Wa0lEMGdiMnhrVkhKbFpTNWhkSFJ5YVdKMWRHVnpMbk53YkdsalpTaHBMQ0F4S1R0Y2JseHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJSEpsYlc5MlpXUXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQndiMjlzY3k1aGRIUnlhV0oxZEdWUFltcGxZM1F1ZFc1d2NtOTBaV04wS0hKbGJXOTJaV1JiYVYwcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJSFJvWlNCamFHRnVaMlVnZEc4Z2RHaGxJSE5sY21sbGN5QnZaaUJ3WVhSamFHVnpMbHh1SUNBZ0lDQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJR05vWVc1blpUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QkRhR1ZqYXlCbWIzSWdiVzlrYVdacFkyRjBhVzl1Y3k1Y2JpQWdJQ0JzWlhRZ2RHOU5iMlJwWm5rZ1BTQmhkSFJ5YVdKMWRHVnpPMXh1WEc0Z0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0IwYjAxdlpHbG1lUzVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzlzWkVGMGRISldZV3gxWlNBOUlHOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGMxdHBYU0FtSmlCdmJHUlVjbVZsTG1GMGRISnBZblYwWlhOYmFWMHVkbUZzZFdVN1hHNGdJQ0FnSUNCc1pYUWdibVYzUVhSMGNsWmhiSFZsSUQwZ1lYUjBjbWxpZFhSbGMxdHBYU0FtSmlCaGRIUnlhV0oxZEdWelcybGRMblpoYkhWbE8xeHVYRzRnSUNBZ0lDQXZMeUJQYm14NUlIQjFjMmdnYVc0Z1lTQmphR0Z1WjJVZ2FXWWdkR2hsSUdGMGRISnBZblYwWlNCdmNpQjJZV3gxWlNCamFHRnVaMlZ6TGx4dUlDQWdJQ0FnYVdZZ0tHOXNaRUYwZEhKV1lXeDFaU0FoUFQwZ2JtVjNRWFIwY2xaaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUd4bGRDQmphR0Z1WjJVZ1BTQjdYRzRnSUNBZ0lDQWdJQ0FnWDE5a2IxOWZPaUF5TEZ4dUlDQWdJQ0FnSUNBZ0lHVnNaVzFsYm5RNklHOXNaRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQWdJQ0FnYm1GdFpUb2dkRzlOYjJScFpubGJhVjB1Ym1GdFpTeGNiaUFnSUNBZ0lDQWdJQ0IyWVd4MVpUb2dkRzlOYjJScFpubGJhVjB1ZG1Gc2RXVXNYRzRnSUNBZ0lDQWdJSDA3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdVbVZ3YkdGalpTQjBhR1VnWVhSMGNtbGlkWFJsSUdsdUlIUm9aU0IyYVhKMGRXRnNJRzV2WkdVdVhHNGdJQ0FnSUNBZ0lHeGxkQ0JoZEhSeUlEMGdiMnhrVkhKbFpTNWhkSFJ5YVdKMWRHVnpXMmxkTzF4dUlDQWdJQ0FnSUNCaGRIUnlMbTVoYldVZ1BTQjBiMDF2WkdsbWVWdHBYUzV1WVcxbE8xeHVJQ0FnSUNBZ0lDQmhkSFJ5TG5aaGJIVmxJRDBnZEc5TmIyUnBabmxiYVYwdWRtRnNkV1U3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRV1JrSUhSb1pTQmphR0Z1WjJVZ2RHOGdkR2hsSUhObGNtbGxjeUJ2WmlCd1lYUmphR1Z6TGx4dUlDQWdJQ0FnSUNCd1lYUmphR1Z6VzNCaGRHTm9aWE11YkdWdVozUm9YU0E5SUdOb1lXNW5aVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2THlCVGVXNWpJR1ZoWTJnZ1kzVnljbVZ1ZENCdWIyUmxMbHh1SUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElHOXNaRU5vYVd4a1RtOWtaWE11YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNCcFppQW9iMnhrUTJocGJHUk9iMlJsYzF0cFhTNWxiR1Z0Wlc1MElDRTlQU0JqYUdsc1pFNXZaR1Z6VzJsZExtVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lITjVibU11WTJGc2JDaHdZWFJqYUdWekxDQnZiR1JVY21WbExtTm9hV3hrVG05a1pYTmJhVjBzSUdOb2FXeGtUbTlrWlhOYmFWMHBPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZWeHVJbDE5IiwiLy8gQ2FjaGUgcHJlYnVpbHQgdHJlZXMgYW5kIGxvb2t1cCBieSBlbGVtZW50LlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVHJlZUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydHMuVHJlZUNhY2hlID0gVHJlZUNhY2hlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2ZEhKbFpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN1FVRkRUeXhKUVVGTkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEU5QlFVOHNSVUZCUlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmRISmxaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRU5oWTJobElIQnlaV0oxYVd4MElIUnlaV1Z6SUdGdVpDQnNiMjlyZFhBZ1lua2daV3hsYldWdWRDNWNibVY0Y0c5eWRDQmpiMjV6ZENCVWNtVmxRMkZqYUdVZ1BTQnVaWGNnVjJWaGEwMWhjQ2dwTzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gcHJvY2VzcztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3RyYW5zaXRpb25zID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbnMnKTtcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbERlY29kZSA9IHJlcXVpcmUoJy4uL3V0aWwvZGVjb2RlJyk7XG5cbnZhciBfdXRpbERlY29kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsRGVjb2RlKTtcblxudmFyIF9lbGVtZW50R2V0ID0gcmVxdWlyZSgnLi4vZWxlbWVudC9nZXQnKTtcblxudmFyIF9lbGVtZW50R2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRHZXQpO1xuXG52YXIgX2VsZW1lbnRDdXN0b20gPSByZXF1aXJlKCcuLi9lbGVtZW50L2N1c3RvbScpO1xuXG52YXIgX25vZGVNYWtlID0gcmVxdWlyZSgnLi4vbm9kZS9tYWtlJyk7XG5cbnZhciBfbm9kZU1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZU1ha2UpO1xuXG52YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xudmFyIGVtcHR5ID0geyBwcm90b3R5cGU6IHt9IH07XG5cbi8qKlxuICogUHJvY2Vzc2VzIGFuIEFycmF5IG9mIHBhdGNoZXMuXG4gKlxuICogQHBhcmFtIGVsZW1lbnQgLSBFbGVtZW50IHRvIHByb2Nlc3MgcGF0Y2hzZXRzIG9uLlxuICogQHBhcmFtIGUgLSBPYmplY3QgdGhhdCBjb250YWlucyBwYXRjaGVzLlxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3MoZWxlbWVudCwgcGF0Y2hlcykge1xuICB2YXIgc3RhdGVzID0gX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXM7XG4gIHZhciBwcm9taXNlcyA9IFtdO1xuICB2YXIgYWRkUHJvbWlzZXMgPSBwcm9taXNlcy5wdXNoLmFwcGx5LmJpbmQocHJvbWlzZXMucHVzaCwgcHJvbWlzZXMpO1xuXG4gIC8vIFRyaWdnZXIgdGhlIGF0dGFjaGVkIHRyYW5zaXRpb24gc3RhdGUgZm9yIHRoaXMgZWxlbWVudCBhbmQgYWxsIGNoaWxkTm9kZXMuXG4gIHZhciBhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZSA9IGZ1bmN0aW9uIGF0dGFjaGVkVHJhbnNpdGlvbkFuZFRpdGxlKGVsKSB7XG4gICAgdmFyIGVsZW1lbnQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKGVsKS5lbGVtZW50O1xuXG4gICAgaWYgKGVsLm5vZGVOYW1lID09PSAnI3RleHQnIHx8IGVsLm5vZGVOYW1lID09PSAndGV4dCcpIHtcbiAgICAgIC8vIFRyaWdnZXIgYWxsIHRoZSB0ZXh0IGNoYW5nZWQgdmFsdWVzLlxuICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMudGV4dENoYW5nZWQgJiYgc3RhdGVzLnRleHRDaGFuZ2VkLmxlbmd0aCkge1xuICAgICAgICBhZGRQcm9taXNlcyhzdGF0ZXMudGV4dENoYW5nZWQubWFwKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlbGVtZW50LnBhcmVudE5vZGUgfHwgZWxlbWVudCwgbnVsbCwgZWwubm9kZVZhbHVlKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGRlZCBzdGF0ZSBmb3IgdHJhbnNpdGlvbnMgQVBJLlxuICAgIGVsc2UgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuYXR0YWNoZWQgJiYgc3RhdGVzLmF0dGFjaGVkLmxlbmd0aCkge1xuICAgICAgICBhZGRQcm9taXNlcyhzdGF0ZXMuYXR0YWNoZWQubWFwKGNhbGxDYWxsYmFjaywgZWxlbWVudCkpO1xuICAgICAgfVxuXG4gICAgLy8gQ2FsbCBhbGwgYGNoaWxkTm9kZXNgIGF0dGFjaGVkIGNhbGxiYWNrcyBhcyB3ZWxsLlxuICAgIGVsLmNoaWxkTm9kZXMuZm9yRWFjaChhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZSk7XG5cbiAgICB0aXRsZUNhbGxiYWNrKGVsKTtcbiAgfTtcblxuICB2YXIgY2FsbENhbGxiYWNrID0gZnVuY3Rpb24gY2FsbENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMpO1xuICB9O1xuXG4gIHZhciBhdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24gYXR0YWNoZWRDYWxsYmFjayhlbGVtZW50RGVzY3JpcHRvcikge1xuICAgIHZhciBlbCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkoZWxlbWVudERlc2NyaXB0b3IpLmVsZW1lbnQ7XG4gICAgdmFyIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudDtcbiAgICB2YXIgY3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbZWxlbWVudERlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuXG4gICAgaWYgKGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2suY2FsbChlbCk7XG4gICAgfVxuXG4gICAgaWYgKGVsLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9ICgwLCBfdXRpbERlY29kZTJbJ2RlZmF1bHQnXSkoZWwudGV4dENvbnRlbnQpO1xuICAgIH1cblxuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVsKTtcbiAgfTtcblxuICB2YXIgdGl0bGVDYWxsYmFjayA9IGZ1bmN0aW9uIHRpdGxlQ2FsbGJhY2soZWxlbWVudERlc2NyaXB0b3IpIHtcbiAgICB2YXIgZWwgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKGVsZW1lbnREZXNjcmlwdG9yKS5lbGVtZW50O1xuXG4gICAgLy8gRW5zdXJlIHRoZSB0aXRsZSBpcyBzZXQgY29ycmVjdGx5LlxuICAgIGlmIChlbC50YWdOYW1lID09PSAndGl0bGUnKSB7XG4gICAgICBlbC5vd25lckRvY3VtZW50LnRpdGxlID0gZWwuY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHBhdGNoZXMgYW5kIGFwcGx5IHRoZW0uXG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gKGkpIHtcbiAgICB2YXIgcGF0Y2ggPSBwYXRjaGVzW2ldO1xuICAgIHZhciBuZXdEZXNjcmlwdG9yID0gdW5kZWZpbmVkLFxuICAgICAgICBvbGREZXNjcmlwdG9yID0gdW5kZWZpbmVkLFxuICAgICAgICBlbGVtZW50RGVzY3JpcHRvciA9IHVuZGVmaW5lZDtcbiAgICB2YXIgZWxlbWVudCA9IHBhdGNoWyduZXcnXTtcblxuICAgIGlmIChwYXRjaC5lbGVtZW50KSB7XG4gICAgICBlbGVtZW50RGVzY3JpcHRvciA9IHBhdGNoLmVsZW1lbnQ7XG5cbiAgICAgIHZhciByZXN1bHQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKHBhdGNoLmVsZW1lbnQpO1xuICAgICAgcGF0Y2guZWxlbWVudCA9IHJlc3VsdC5lbGVtZW50O1xuICAgIH1cblxuICAgIGlmIChwYXRjaC5vbGQpIHtcbiAgICAgIG9sZERlc2NyaXB0b3IgPSBwYXRjaC5vbGQ7XG5cbiAgICAgIHZhciByZXN1bHQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKHBhdGNoLm9sZCk7XG4gICAgICBwYXRjaC5vbGQgPSByZXN1bHQuZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGF0Y2hbJ25ldyddKSB7XG4gICAgICBuZXdEZXNjcmlwdG9yID0gcGF0Y2hbJ25ldyddO1xuXG4gICAgICB2YXIgcmVzdWx0ID0gKDAsIF9lbGVtZW50R2V0MlsnZGVmYXVsdCddKShwYXRjaFsnbmV3J10pO1xuICAgICAgcGF0Y2hbJ25ldyddID0gcmVzdWx0LmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgcGF0Y2hbJ25ldyddLnRleHRDb250ZW50ID0gKDAsIF91dGlsRGVjb2RlMlsnZGVmYXVsdCddKShlbGVtZW50Lm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIE5vZGUuXG4gICAgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMCkge1xuICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoWyduZXcnXSwgcGF0Y2gub2xkKTtcblxuICAgICAgdmFyIG9sZEN1c3RvbUVsZW1lbnQgPSBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW29sZERlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuICAgICAgdmFyIG5ld0N1c3RvbUVsZW1lbnQgPSBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW25ld0Rlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuXG4gICAgICBpZiAob2xkQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuZGV0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICBvbGRDdXN0b21FbGVtZW50LnByb3RvdHlwZS5kZXRhY2hlZENhbGxiYWNrLmNhbGwocGF0Y2gub2xkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5ld0N1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgbmV3Q3VzdG9tRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoZWRDYWxsYmFjay5jYWxsKHBhdGNoWyduZXcnXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm9kZSBtYW5pcC5cbiAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDEpIHtcbiAgICAgICAgLy8gQWRkLlxuICAgICAgICBpZiAocGF0Y2guZWxlbWVudCAmJiBwYXRjaC5mcmFnbWVudCAmJiAhcGF0Y2gub2xkKSB7XG4gICAgICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICAgICAgcGF0Y2guZnJhZ21lbnQuZm9yRWFjaChhdHRhY2hlZENhbGxiYWNrLCB7IGZyYWdtZW50OiBmcmFnbWVudCB9KTtcbiAgICAgICAgICBwYXRjaC5lbGVtZW50LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICAgICAgICAgIGZvckVhY2guY2FsbChwYXRjaC5mcmFnbWVudCwgYXR0YWNoZWRUcmFuc2l0aW9uQW5kVGl0bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlLlxuICAgICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgIXBhdGNoWyduZXcnXSkge1xuICAgICAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgcmVtb3ZlIHdpdGhvdXQgcGFyZW50LCBpcyB0aGlzIHRoZSAnICsgJ2RvY3VtZW50IHJvb3Q/Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgdGl0bGUgaXMgZW1wdGllZC5cbiAgICAgICAgICAgIGlmIChwYXRjaC5vbGQudGFnTmFtZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAgICAgICBwYXRjaC5vbGQub3duZXJEb2N1bWVudC50aXRsZSA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbb2xkRGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG5cbiAgICAgICAgICAgIGlmIChjdXN0b21FbGVtZW50LnByb3RvdHlwZS5kZXRhY2hlZENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmRldGFjaGVkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwYXRjaC5vbGQpO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGVzICYmIHN0YXRlcy5kZXRhY2hlZCAmJiBzdGF0ZXMuZGV0YWNoZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5kZXRhY2hlZC5tYXAoY2FsbENhbGxiYWNrLCBwYXRjaC5vbGQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW29sZERlc2NyaXB0b3IuZWxlbWVudF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVwbGFjZS5cbiAgICAgICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgcGF0Y2hbJ25ldyddKSB7XG4gICAgICAgICAgICAgIGlmICghcGF0Y2gub2xkLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgcmVwbGFjZSB3aXRob3V0IHBhcmVudCwgaXMgdGhpcyB0aGUgJyArICdkb2N1bWVudCByb290PycpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBlbGVtZW50IGZpcnN0LCBiZWZvcmUgZG9pbmcgdGhlIHJlcGxhY2VtZW50LlxuICAgICAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocGF0Y2hbJ25ldyddLCBwYXRjaC5vbGQubmV4dFNpYmxpbmcpO1xuXG4gICAgICAgICAgICAgIC8vIFJlbW92ZWQgc3RhdGUgZm9yIHRyYW5zaXRpb25zIEFQSS5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuZGV0YWNoZWQgJiYgc3RhdGVzLmRldGFjaGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5kZXRhY2hlZC5tYXAoY2FsbENhbGxiYWNrLCBwYXRjaC5vbGQpKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFJlcGxhY2VkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLnJlcGxhY2VkICYmIHN0YXRlcy5yZXBsYWNlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhZGRQcm9taXNlcyhzdGF0ZXMucmVwbGFjZWQubWFwKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHBhdGNoLm9sZCwgcGF0Y2hbJ25ldyddKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHRpdGxlIGlzIHNldCBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgIGlmIChwYXRjaFsnbmV3J10udGFnTmFtZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAgICAgICAgIHBhdGNoLm9sZC5vd25lckRvY3VtZW50LnRpdGxlID0gcGF0Y2hbJ25ldyddLmNoaWxkTm9kZXNbMF0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoWyduZXcnXSwgcGF0Y2gub2xkKTtcblxuICAgICAgICAgICAgICB2YXIgb2xkQ3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbb2xkRGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG4gICAgICAgICAgICAgIHZhciBuZXdDdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tuZXdEZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICAgICAgICAgICAgICBpZiAob2xkQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuZGV0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIG9sZEN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmRldGFjaGVkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG5ld0N1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBuZXdDdXN0b21FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hlZENhbGxiYWNrLmNhbGwocGF0Y2hbJ25ldyddKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIEFkZGVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dGFjaGVkICYmIHN0YXRlcy5hdHRhY2hlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZShuZXdEZXNjcmlwdG9yKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tvbGREZXNjcmlwdG9yLmVsZW1lbnRdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBdHRyaWJ1dGUgbWFuaXB1bGF0aW9uLlxuICAgICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAyKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHBhdGNoLmVsZW1lbnQuZ2V0QXR0cmlidXRlKHBhdGNoLm5hbWUpO1xuXG4gICAgICAgICAgICAvLyBDaGFuZ2VzIHRoZSBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICB2YXIgYXVnbWVudEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIGF1Z21lbnRBdHRyaWJ1dGUoKSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZS5cbiAgICAgICAgICAgICAgaWYgKCFwYXRjaC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHBhdGNoLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHBhdGNoLm5hbWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIENoYW5nZS5cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwYXRjaC5lbGVtZW50LnNldEF0dHJpYnV0ZShwYXRjaC5uYW1lLCBwYXRjaC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBhbGwgdGhlIGF0dHJpYnV0ZSBjaGFuZ2VkIHZhbHVlcy5cbiAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQgJiYgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5hdHRyaWJ1dGVDaGFuZ2VkLm1hcChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQsIHBhdGNoLm5hbWUsIG9sZFZhbHVlLCBwYXRjaC52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGF1Z21lbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhdWdtZW50QXR0cmlidXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGF1Z21lbnRBdHRyaWJ1dGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBjdXN0b20gZWxlbWVudCBhdHRyaWJ1dGVDaGFuZ2VkIGV2ZW50cy5cbiAgICAgICAgICAgIHZhciBjdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tlbGVtZW50RGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG5cbiAgICAgICAgICAgIGlmIChjdXN0b21FbGVtZW50LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICBjdXN0b21FbGVtZW50LnByb3RvdHlwZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQsIHBhdGNoLm5hbWUsIG9sZFZhbHVlLCBwYXRjaC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRleHQgbm9kZSBtYW5pcHVsYXRpb24uXG4gICAgICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMykge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsVmFsdWUgPSBwYXRjaC5lbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgICAgICAgICAgIC8vIENoYW5nZXMgdGhlIHRleHQuXG4gICAgICAgICAgICAgIHZhciBhdWdtZW50VGV4dCA9IGZ1bmN0aW9uIGF1Z21lbnRUZXh0KCkge1xuICAgICAgICAgICAgICAgIHBhdGNoLmVsZW1lbnQudGV4dENvbnRlbnQgPSAoMCwgX3V0aWxEZWNvZGUyWydkZWZhdWx0J10pKHBhdGNoLnZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGFsbCB0aGUgdGV4dCBjaGFuZ2VkIHZhbHVlcy5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMudGV4dENoYW5nZWQgJiYgc3RhdGVzLnRleHRDaGFuZ2VkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy50ZXh0Q2hhbmdlZC5tYXAoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQucGFyZW50Tm9kZSB8fCBwYXRjaC5lbGVtZW50LCBvcmlnaW5hbFZhbHVlLCBwYXRjaC52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihhdWdtZW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhdWdtZW50VGV4dCgpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0Y2guZWxlbWVudC50ZXh0Q29udGVudCA9ICgwLCBfdXRpbERlY29kZTJbJ2RlZmF1bHQnXSkocGF0Y2gudmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBfbG9vcChpKTtcbiAgfVxuXG4gIHZhciBhY3RpdmVQcm9taXNlcyA9IHByb21pc2VzLmZpbHRlcihCb29sZWFuKTtcblxuICAvLyBXYWl0IHVudGlsIGFsbCB0cmFuc2l0aW9uIHByb21pc2VzIGhhdmUgcmVzb2x2ZWQuXG4gIGlmIChhY3RpdmVQcm9taXNlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMuZmlsdGVyKEJvb2xlYW4pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM0JoZEdOb1pYTXZjSEp2WTJWemN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRm5RbmRDTEU5QlFVODdPenM3TWtKQmFFSkZMR2RDUVVGblFqczdlVUpCUXpOQ0xHVkJRV1U3T3pCQ1FVTldMR2RDUVVGblFqczdPenN3UWtGRGNFSXNaMEpCUVdkQ096czdPelpDUVVOYUxHMUNRVUZ0UWpzN2QwSkJRM3BDTEdOQlFXTTdPenM3UVVGRmJrTXNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTTdRVUZEZEVNc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeFRRVUZUTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN096czdPenM3T3p0QlFWRm1MRk5CUVZNc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJTeFBRVUZQTEVWQlFVVTdRVUZEYUVRc1RVRkJTU3hOUVVGTkxHZERRVUZ0UWl4RFFVRkRPMEZCUXpsQ0xFMUJRVWtzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTnNRaXhOUVVGSkxGZEJRVmNzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenM3TzBGQlIzQkZMRTFCUVVrc01FSkJRVEJDTEVkQlFVY3NVMEZCTjBJc01FSkJRVEJDTEVOQlFWa3NSVUZCUlN4RlFVRkZPMEZCUXpWRExGRkJRVWtzVDBGQlR5eEhRVUZITERaQ1FVRlhMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF6czdRVUZGY2tNc1VVRkJTU3hGUVVGRkxFTkJRVU1zVVVGQlVTeExRVUZMTEU5QlFVOHNTVUZCU1N4RlFVRkZMRU5CUVVNc1VVRkJVU3hMUVVGTExFMUJRVTBzUlVGQlJUczdRVUZGY2tRc1ZVRkJTU3hOUVVGTkxFbEJRVWtzVFVGQlRTeERRVUZETEZkQlFWY3NTVUZCU1N4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU0zUkN4dFFrRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eFhRVUZYTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1VVRkJVU3hGUVVGSk8wRkJRemRETEdsQ1FVRlBMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEpRVUZKTEU5QlFVOHNSVUZCUlN4SlFVRkpMRVZCUVVVc1JVRkJSU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFOQlEzQkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRMHc3UzBGRFJqczdVMEZGU1N4SlFVRkpMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRelZFTEcxQ1FVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNXVUZCV1N4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03VDBGRGVrUTdPenRCUVVkRUxFMUJRVVVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTTdPMEZCUld4RUxHbENRVUZoTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRia0lzUTBGQlF6czdRVUZGUml4TlFVRkpMRmxCUVZrc1IwRkJSeXhUUVVGbUxGbEJRVmtzUTBGQldTeFJRVUZSTEVWQlFVVTdRVUZEY0VNc1YwRkJUeXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdSMEZEZGtJc1EwRkJRenM3UVVGRlJpeE5RVUZKTEdkQ1FVRm5RaXhIUVVGSExGTkJRVzVDTEdkQ1FVRm5RaXhEUVVGWkxHbENRVUZwUWl4RlFVRkZPMEZCUTJwRUxGRkJRVWtzUlVGQlJTeEhRVUZITERaQ1FVRlhMR2xDUVVGcFFpeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUXk5RExGRkJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkROMElzVVVGQlNTeGhRVUZoTEVkQlFVY3NNRUpCUVZjc2FVSkJRV2xDTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRE96dEJRVVZ3UlN4UlFVRkpMR0ZCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zWjBKQlFXZENMRVZCUVVVN1FVRkROVU1zYlVKQlFXRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wdEJRMjVFT3p0QlFVVkVMRkZCUVVrc1JVRkJSU3hEUVVGRExGRkJRVkVzUzBGQlN5eFBRVUZQTEVWQlFVVTdRVUZETTBJc1VVRkJSU3hEUVVGRExGZEJRVmNzUjBGQlJ5dzJRa0ZCWlN4RlFVRkZMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03UzBGRGFrUTdPMEZCUlVRc1dVRkJVU3hEUVVGRExGZEJRVmNzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTXhRaXhEUVVGRE96dEJRVVZHTEUxQlFVa3NZVUZCWVN4SFFVRkhMRk5CUVdoQ0xHRkJRV0VzUTBGQldTeHBRa0ZCYVVJc1JVRkJSVHRCUVVNNVF5eFJRVUZKTEVWQlFVVXNSMEZCUnl3MlFrRkJWeXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJRenM3TzBGQlJ5OURMRkZCUVVrc1JVRkJSU3hEUVVGRExFOUJRVThzUzBGQlN5eFBRVUZQTEVWQlFVVTdRVUZETVVJc1VVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTTdTMEZEY2tRN1IwRkRSaXhEUVVGRE96czdPM2RDUVVkUExFTkJRVU03UVVGRFVpeFJRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRrSXNVVUZCU1N4aFFVRmhMRmxCUVVFN1VVRkJSU3hoUVVGaExGbEJRVUU3VVVGQlJTeHBRa0ZCYVVJc1dVRkJRU3hEUVVGRE8wRkJRM0JFTEZGQlFVa3NUMEZCVHl4SFFVRkhMRXRCUVVzc1QwRkJTU3hEUVVGRE96dEJRVVY0UWl4UlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVU3UVVGRGFrSXNkVUpCUVdsQ0xFZEJRVWNzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXpzN1FVRkZiRU1zVlVGQlNTeE5RVUZOTEVkQlFVY3NOa0pCUVZjc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzWkRMRmRCUVVzc1EwRkJReXhQUVVGUExFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0TFFVTm9RenM3UVVGRlJDeFJRVUZKTEV0QlFVc3NRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRZaXh0UWtGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNN08wRkJSVEZDTEZWQlFVa3NUVUZCVFN4SFFVRkhMRFpDUVVGWExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnVReXhYUVVGTExFTkJRVU1zUjBGQlJ5eEhRVUZITEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNN1MwRkROVUk3TzBGQlJVUXNVVUZCU1N4TFFVRkxMRTlCUVVrc1JVRkJSVHRCUVVOaUxHMUNRVUZoTEVkQlFVY3NTMEZCU3l4UFFVRkpMRU5CUVVNN08wRkJSVEZDTEZWQlFVa3NUVUZCVFN4SFFVRkhMRFpDUVVGWExFdEJRVXNzVDBGQlNTeERRVUZETEVOQlFVTTdRVUZEYmtNc1YwRkJTeXhQUVVGSkxFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0TFFVTTFRanM3UVVGRlJDeFJRVUZKTEU5QlFVOHNTVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJVU3hMUVVGTExFOUJRVThzUlVGQlJUdEJRVU16UXl4WFFVRkxMRTlCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzTmtKQlFXVXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wdEJRek5FT3pzN1FVRkhSQ3hSUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEV0QlFVc3NRMEZCUXl4RlFVRkZPMEZCUTNSQ0xGZEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRmxCUVZrc1EwRkJReXhMUVVGTExFOUJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWGhFTEZWQlFVa3NaMEpCUVdkQ0xFZEJRVWNzTUVKQlFWY3NZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU51UlN4VlFVRkpMR2RDUVVGblFpeEhRVUZITERCQ1FVRlhMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeExRVUZMTEVOQlFVTTdPMEZCUlc1RkxGVkJRVWtzWjBKQlFXZENMRU5CUVVNc1UwRkJVeXhEUVVGRExHZENRVUZuUWl4RlFVRkZPMEZCUXk5RExIZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzA5QlF6ZEVPenRCUVVWRUxGVkJRVWtzWjBKQlFXZENMRU5CUVVNc1UwRkJVeXhEUVVGRExHZENRVUZuUWl4RlFVRkZPMEZCUXk5RExIZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGSkxFTkJRVU1zUTBGQlF6dFBRVU0zUkR0TFFVTkdPenM3VTBGSFNTeEpRVUZKTEV0QlFVc3NRMEZCUXl4TlFVRk5MRXRCUVVzc1EwRkJReXhGUVVGRk96dEJRVVV6UWl4WlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUExFbEJRVWtzUzBGQlN5eERRVUZETEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFVkJRVVU3UVVGRGFrUXNZMEZCU1N4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExITkNRVUZ6UWl4RlFVRkZMRU5CUVVNN08wRkJSV3BFTEdWQlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RlFVRkZMRVZCUVVVc1VVRkJVU3hGUVVGU0xGRkJRVkVzUlVGQlJTeERRVUZETEVOQlFVTTdRVUZEZGtRc1pVRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN08wRkJSWEJETEdsQ1FVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVWQlFVVXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dFRRVU14UkRzN08yRkJSMGtzU1VGQlNTeExRVUZMTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGSkxFVkJRVVU3UVVGRGFFTXNaMEpCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNSVUZCUlR0QlFVTjZRaXh2UWtGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl3MFEwRkJORU1zUjBGRE1VUXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dGhRVU55UWpzN08wRkJSMFFzWjBKQlFVa3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFdEJRVXNzVDBGQlR5eEZRVUZGTzBGQlEycERMRzFDUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRE8yRkJRM0JET3p0QlFVVkVMR2RDUVVGSkxHRkJRV0VzUjBGQlJ5d3dRa0ZCVnl4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZET3p0QlFVVm9SU3huUWtGQlNTeGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMR2RDUVVGblFpeEZRVUZGTzBGQlF6VkRMREpDUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1lVRkRNVVE3TzBGQlJVUXNhVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEZkQlFWY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJUVkRMR2RDUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzWkVMSGxDUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1dVRkJXU3hGUVVGRkxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMkZCUXpORU96dEJRVVZFTEd0RFFVRlRMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRPMWRCUTI1RU96czdaVUZIU1N4SlFVRkpMRXRCUVVzc1EwRkJReXhIUVVGSExFbEJRVWtzUzBGQlN5eFBRVUZKTEVWQlFVVTdRVUZETDBJc2EwSkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVONlFpeHpRa0ZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXcyUTBGQk5rTXNSMEZETTBRc1owSkJRV2RDTEVOQlFVTXNRMEZCUXp0bFFVTnlRanM3TzBGQlIwUXNiVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRTlCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPenM3UVVGSGNFVXNhMEpCUVVrc1RVRkJUU3hKUVVGSkxFMUJRVTBzUTBGQlF5eFJRVUZSTEVsQlFVa3NUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGRrUXNNa0pCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4WlFVRlpMRVZCUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdaVUZETTBRN096dEJRVWRFTEd0Q1FVRkpMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM1pFTERKQ1FVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUVN4UlFVRlJMRVZCUVVrN1FVRkRNVU1zZVVKQlFVOHNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFVkJRVVVzUzBGQlN5eFBRVUZKTEVOQlFVTXNRMEZCUXp0cFFrRkRka01zUTBGQlF5eERRVUZETEVOQlFVTTdaVUZEVERzN08wRkJSMFFzYTBKQlFVa3NTMEZCU3l4UFFVRkpMRU5CUVVNc1QwRkJUeXhMUVVGTExFOUJRVThzUlVGQlJUdEJRVU5xUXl4eFFrRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1QwRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNN1pVRkRia1U3TzBGQlJVUXNiVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRTlCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhoRUxHdENRVUZKTEdkQ1FVRm5RaXhIUVVGSExEQkNRVUZYTEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRGJrVXNhMEpCUVVrc1owSkJRV2RDTEVkQlFVY3NNRUpCUVZjc1lVRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEV0QlFVc3NRMEZCUXpzN1FVRkZia1VzYTBKQlFVa3NaMEpCUVdkQ0xFTkJRVU1zVTBGQlV5eERRVUZETEdkQ1FVRm5RaXhGUVVGRk8wRkJReTlETEdkRFFVRm5RaXhEUVVGRExGTkJRVk1zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMlZCUXpkRU96dEJRVVZFTEd0Q1FVRkpMR2RDUVVGblFpeERRVUZETEZOQlFWTXNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU12UXl4blEwRkJaMElzUTBGQlF5eFRRVUZUTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NUMEZCU1N4RFFVRkRMRU5CUVVNN1pVRkROMFE3T3p0QlFVZEVMR3RDUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzWkVMREJEUVVFd1FpeERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRPMlZCUXpORE96dEJRVVZFTEc5RFFVRlRMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRPMkZCUTI1RU8wOUJRMFk3T3p0WFFVZEpMRWxCUVVrc1MwRkJTeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVWQlFVVTdPMEZCUXpOQ0xHZENRVUZKTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN096dEJRVWQwUkN4blFrRkJTU3huUWtGQlowSXNSMEZCUnl4VFFVRnVRaXhuUWtGQlowSXNSMEZCWXpzN1FVRkZhRU1zYTBKQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wRkJRVVVzY1VKQlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0bFFVRkZPenR0UWtGRk0wUTdRVUZCUlN4MVFrRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdhVUpCUVVVN1lVRkRPVVFzUTBGQlF6czdPMEZCUjBZc1owSkJRVWtzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4blFrRkJaMElzU1VGQlNTeE5RVUZOTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzWkZMSGxDUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZCTEZGQlFWRXNSVUZCU1R0QlFVTnNSQ3h2UWtGQlNTeFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVVzUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUTNoRUxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZaaXh2UWtGQlNTeFBRVUZQTEVWQlFVVTdRVUZCUlN4NVFrRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8ybENRVUZGTEUxQlF6TkRPMEZCUVVVc2EwTkJRV2RDTEVWQlFVVXNRMEZCUXp0cFFrRkJSVHM3UVVGRk5VSXNkVUpCUVU4c1QwRkJUeXhEUVVGRE8yVkJRMmhDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMkZCUTB3c1RVRkRTVHRCUVVOSUxEaENRVUZuUWl4RlFVRkZMRU5CUVVNN1lVRkRjRUk3T3p0QlFVZEVMR2RDUVVGSkxHRkJRV0VzUjBGQlJ5d3dRa0ZCVnl4cFFrRkJhVUlzUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4TFFVRkxMRU5CUVVNN08wRkJSWEJGTEdkQ1FVRkpMR0ZCUVdFc1EwRkJReXgzUWtGQmQwSXNSVUZCUlR0QlFVTXhReXd5UWtGQllTeERRVUZETEZOQlFWTXNRMEZCUXl4M1FrRkJkMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1JVRkROMFFzUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzJGQlEzUkRPenRUUVVOR096czdZVUZIU1N4SlFVRkpMRXRCUVVzc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eEZRVUZGT3p0QlFVTXpRaXhyUWtGQlNTeGhRVUZoTEVkQlFVY3NTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVYzVReXhyUWtGQlNTeFhRVUZYTEVkQlFVY3NVMEZCWkN4WFFVRlhMRWRCUVdNN1FVRkRNMElzY1VKQlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhIUVVGSExEWkNRVUZsTEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRsUVVONlJDeERRVUZET3pzN1FVRkhSaXhyUWtGQlNTeE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMRmRCUVZjc1NVRkJTU3hOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTTNSQ3d5UWtGQlZ5eERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVUVzVVVGQlVTeEZRVUZKTzBGQlF6ZERMSE5DUVVGSkxFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFbEJRVWtzUzBGQlN5eERRVUZETEU5QlFVOHNSVUZET1VRc1lVRkJZU3hGUVVGRkxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZPVUlzYzBKQlFVa3NUMEZCVHl4RlFVRkZPMEZCUVVVc01rSkJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN2JVSkJRVVVzVFVGRGRFTTdRVUZCUlN3clFrRkJWeXhGUVVGRkxFTkJRVU03YlVKQlFVVTdPMEZCUlhaQ0xIbENRVUZQTEU5QlFVOHNRMEZCUXp0cFFrRkRhRUlzUTBGQlF5eERRVUZETEVOQlFVTTdaVUZEVEN4TlFVTkpPMEZCUTBnc2NVSkJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4SFFVRkhMRFpDUVVGbExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0bFFVTjZSRHM3VjBGRFJqczdPMEZCYmsxSUxFOUJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMVZCUVdoRExFTkJRVU03UjBGdlRWUTdPMEZCUlVRc1RVRkJTU3hqUVVGakxFZEJRVWNzVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3TzBGQlJ6bERMRTFCUVVrc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU42UWl4WFFVRlBMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRemxETzBOQlEwWWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZjR0YwWTJobGN5OXdjbTlqWlhOekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeUI5SUdaeWIyMGdKeTR1TDNSeVlXNXphWFJwYjI1ekp6dGNibWx0Y0c5eWRDQjdJSEJ2YjJ4eklIMGdabkp2YlNBbkxpNHZkWFJwYkM5d2IyOXNjeWM3WEc1cGJYQnZjblFnWkdWamIyUmxSVzUwYVhScFpYTWdabkp2YlNBbkxpNHZkWFJwYkM5a1pXTnZaR1VuTzF4dWFXMXdiM0owSUdkbGRFVnNaVzFsYm5RZ1puSnZiU0FuTGk0dlpXeGxiV1Z1ZEM5blpYUW5PMXh1YVcxd2IzSjBJSHNnWTI5dGNHOXVaVzUwY3lCOUlHWnliMjBnSnk0dUwyVnNaVzFsYm5RdlkzVnpkRzl0Snp0Y2JtbHRjRzl5ZENCdFlXdGxUbTlrWlNCbWNtOXRJQ2N1TGk5dWIyUmxMMjFoYTJVbk8xeHVYRzUyWVhJZ1ptOXlSV0ZqYUNBOUlFRnljbUY1TG5CeWIzUnZkSGx3WlM1bWIzSkZZV05vTzF4dWRtRnlJR1Z0Y0hSNUlEMGdleUJ3Y205MGIzUjVjR1U2SUh0OUlIMDdYRzVjYmk4cUtseHVJQ29nVUhKdlkyVnpjMlZ6SUdGdUlFRnljbUY1SUc5bUlIQmhkR05vWlhNdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblFnTFNCRmJHVnRaVzUwSUhSdklIQnliMk5sYzNNZ2NHRjBZMmh6WlhSeklHOXVMbHh1SUNvZ1FIQmhjbUZ0SUdVZ0xTQlBZbXBsWTNRZ2RHaGhkQ0JqYjI1MFlXbHVjeUJ3WVhSamFHVnpMbHh1SUNvdlhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlCd2NtOWpaWE56S0dWc1pXMWxiblFzSUhCaGRHTm9aWE1wSUh0Y2JpQWdkbUZ5SUhOMFlYUmxjeUE5SUhSeVlXNXphWFJwYjI1VGRHRjBaWE03WEc0Z0lIWmhjaUJ3Y205dGFYTmxjeUE5SUZ0ZE8xeHVJQ0IyWVhJZ1lXUmtVSEp2YldselpYTWdQU0J3Y205dGFYTmxjeTV3ZFhOb0xtRndjR3g1TG1KcGJtUW9jSEp2YldselpYTXVjSFZ6YUN3Z2NISnZiV2x6WlhNcE8xeHVYRzRnSUM4dklGUnlhV2RuWlhJZ2RHaGxJR0YwZEdGamFHVmtJSFJ5WVc1emFYUnBiMjRnYzNSaGRHVWdabTl5SUhSb2FYTWdaV3hsYldWdWRDQmhibVFnWVd4c0lHTm9hV3hrVG05a1pYTXVYRzRnSUhaaGNpQmhkSFJoWTJobFpGUnlZVzV6YVhScGIyNUJibVJVYVhSc1pTQTlJR1oxYm1OMGFXOXVLR1ZzS1NCN1hHNGdJQ0FnZG1GeUlHVnNaVzFsYm5RZ1BTQm5aWFJGYkdWdFpXNTBLR1ZzS1M1bGJHVnRaVzUwTzF4dVhHNGdJQ0FnYVdZZ0tHVnNMbTV2WkdWT1lXMWxJRDA5UFNBbkkzUmxlSFFuSUh4OElHVnNMbTV2WkdWT1lXMWxJRDA5UFNBbmRHVjRkQ2NwSUh0Y2JpQWdJQ0FnSUM4dklGUnlhV2RuWlhJZ1lXeHNJSFJvWlNCMFpYaDBJR05vWVc1blpXUWdkbUZzZFdWekxseHVJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVkR1Y0ZEVOb1lXNW5aV1FnSmlZZ2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0xteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVkR1Y0ZEVOb1lXNW5aV1F1YldGd0tHTmhiR3hpWVdOcklEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWTJGc2JHSmhZMnNvWld4bGJXVnVkQzV3WVhKbGJuUk9iMlJsSUh4OElHVnNaVzFsYm5Rc0lHNTFiR3dzSUdWc0xtNXZaR1ZXWVd4MVpTazdYRzRnSUNBZ0lDQWdJSDBwS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdMeThnUVdSa1pXUWdjM1JoZEdVZ1ptOXlJSFJ5WVc1emFYUnBiMjV6SUVGUVNTNWNiaUFnSUNCbGJITmxJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG1GMGRHRmphR1ZrSUNZbUlITjBZWFJsY3k1aGRIUmhZMmhsWkM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUdGa1pGQnliMjFwYzJWektITjBZWFJsY3k1aGRIUmhZMmhsWkM1dFlYQW9ZMkZzYkVOaGJHeGlZV05yTENCbGJHVnRaVzUwS1NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1EyRnNiQ0JoYkd3Z1lHTm9hV3hrVG05a1pYTmdJR0YwZEdGamFHVmtJR05oYkd4aVlXTnJjeUJoY3lCM1pXeHNMbHh1SUNBZ0lHVnNMbU5vYVd4a1RtOWtaWE11Wm05eVJXRmphQ2hoZEhSaFkyaGxaRlJ5WVc1emFYUnBiMjVCYm1SVWFYUnNaU2s3WEc1Y2JpQWdJQ0IwYVhSc1pVTmhiR3hpWVdOcktHVnNLVHRjYmlBZ2ZUdGNibHh1SUNCMllYSWdZMkZzYkVOaGJHeGlZV05ySUQwZ1puVnVZM1JwYjI0b1kyRnNiR0poWTJzcElIdGNiaUFnSUNCeVpYUjFjbTRnWTJGc2JHSmhZMnNvZEdocGN5azdYRzRnSUgwN1hHNWNiaUFnZG1GeUlHRjBkR0ZqYUdWa1EyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaGxiR1Z0Wlc1MFJHVnpZM0pwY0hSdmNpa2dlMXh1SUNBZ0lHeGxkQ0JsYkNBOUlHZGxkRVZzWlcxbGJuUW9aV3hsYldWdWRFUmxjMk55YVhCMGIzSXBMbVZzWlcxbGJuUTdYRzRnSUNBZ2JHVjBJR1p5WVdkdFpXNTBJRDBnZEdocGN5NW1jbUZuYldWdWREdGNiaUFnSUNCc1pYUWdZM1Z6ZEc5dFJXeGxiV1Z1ZENBOUlHTnZiWEJ2Ym1WdWRITmJaV3hsYldWdWRFUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1WEc0Z0lDQWdhV1lnS0dOMWMzUnZiVVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxMbUYwZEdGamFHVmtRMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJR04xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtRjBkR0ZqYUdWa1EyRnNiR0poWTJzdVkyRnNiQ2hsYkNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHVnNMbTV2WkdWT1lXMWxJRDA5UFNBbkkzUmxlSFFuS1NCN1hHNGdJQ0FnSUNCbGJDNTBaWGgwUTI5dWRHVnVkQ0E5SUdSbFkyOWtaVVZ1ZEdsMGFXVnpLR1ZzTG5SbGVIUkRiMjUwWlc1MEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbWNtRm5iV1Z1ZEM1aGNIQmxibVJEYUdsc1pDaGxiQ2s3WEc0Z0lIMDdYRzVjYmlBZ2RtRnlJSFJwZEd4bFEyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaGxiR1Z0Wlc1MFJHVnpZM0pwY0hSdmNpa2dlMXh1SUNBZ0lHeGxkQ0JsYkNBOUlHZGxkRVZzWlcxbGJuUW9aV3hsYldWdWRFUmxjMk55YVhCMGIzSXBMbVZzWlcxbGJuUTdYRzVjYmlBZ0lDQXZMeUJGYm5OMWNtVWdkR2hsSUhScGRHeGxJR2x6SUhObGRDQmpiM0p5WldOMGJIa3VYRzRnSUNBZ2FXWWdLR1ZzTG5SaFowNWhiV1VnUFQwOUlDZDBhWFJzWlNjcElIdGNiaUFnSUNBZ0lHVnNMbTkzYm1WeVJHOWpkVzFsYm5RdWRHbDBiR1VnUFNCbGJDNWphR2xzWkU1dlpHVnpXekJkTG01dlpHVldZV3gxWlR0Y2JpQWdJQ0I5WEc0Z0lIMDdYRzVjYmlBZ0x5OGdURzl2Y0NCMGFISnZkV2RvSUdGc2JDQjBhR1VnY0dGMFkyaGxjeUJoYm1RZ1lYQndiSGtnZEdobGJTNWNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCd1lYUmphR1Z6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2JHVjBJSEJoZEdOb0lEMGdjR0YwWTJobGMxdHBYVHRjYmlBZ0lDQnNaWFFnYm1WM1JHVnpZM0pwY0hSdmNpd2diMnhrUkdWelkzSnBjSFJ2Y2l3Z1pXeGxiV1Z1ZEVSbGMyTnlhWEIwYjNJN1hHNGdJQ0FnYkdWMElHVnNaVzFsYm5RZ1BTQndZWFJqYUM1dVpYYzdYRzVjYmlBZ0lDQnBaaUFvY0dGMFkyZ3VaV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdaV3hsYldWdWRFUmxjMk55YVhCMGIzSWdQU0J3WVhSamFDNWxiR1Z0Wlc1ME8xeHVYRzRnSUNBZ0lDQnNaWFFnY21WemRXeDBJRDBnWjJWMFJXeGxiV1Z1ZENod1lYUmphQzVsYkdWdFpXNTBLVHRjYmlBZ0lDQWdJSEJoZEdOb0xtVnNaVzFsYm5RZ1BTQnlaWE4xYkhRdVpXeGxiV1Z1ZER0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2NHRjBZMmd1YjJ4a0tTQjdYRzRnSUNBZ0lDQnZiR1JFWlhOamNtbHdkRzl5SUQwZ2NHRjBZMmd1YjJ4a08xeHVYRzRnSUNBZ0lDQnNaWFFnY21WemRXeDBJRDBnWjJWMFJXeGxiV1Z1ZENod1lYUmphQzV2YkdRcE8xeHVJQ0FnSUNBZ2NHRjBZMmd1YjJ4a0lEMGdjbVZ6ZFd4MExtVnNaVzFsYm5RN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIQmhkR05vTG01bGR5a2dlMXh1SUNBZ0lDQWdibVYzUkdWelkzSnBjSFJ2Y2lBOUlIQmhkR05vTG01bGR6dGNibHh1SUNBZ0lDQWdiR1YwSUhKbGMzVnNkQ0E5SUdkbGRFVnNaVzFsYm5Rb2NHRjBZMmd1Ym1WM0tUdGNiaUFnSUNBZ0lIQmhkR05vTG01bGR5QTlJSEpsYzNWc2RDNWxiR1Z0Wlc1ME8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaGxiR1Z0Wlc1MElDWW1JR1ZzWlcxbGJuUXVibTlrWlU1aGJXVWdQVDA5SUNjamRHVjRkQ2NwSUh0Y2JpQWdJQ0FnSUhCaGRHTm9MbTVsZHk1MFpYaDBRMjl1ZEdWdWRDQTlJR1JsWTI5a1pVVnVkR2wwYVdWektHVnNaVzFsYm5RdWJtOWtaVlpoYkhWbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlNaWEJzWVdObElIUm9aU0JsYm5ScGNtVWdUbTlrWlM1Y2JpQWdJQ0JwWmlBb2NHRjBZMmd1WDE5a2IxOWZJRDA5UFNBd0tTQjdYRzRnSUNBZ0lDQndZWFJqYUM1dmJHUXVjR0Z5Wlc1MFRtOWtaUzV5WlhCc1lXTmxRMmhwYkdRb2NHRjBZMmd1Ym1WM0xDQndZWFJqYUM1dmJHUXBPMXh1WEc0Z0lDQWdJQ0JzWlhRZ2IyeGtRM1Z6ZEc5dFJXeGxiV1Z1ZENBOUlHTnZiWEJ2Ym1WdWRITmJiMnhrUkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlYwZ2ZId2daVzF3ZEhrN1hHNGdJQ0FnSUNCc1pYUWdibVYzUTNWemRHOXRSV3hsYldWdWRDQTlJR052YlhCdmJtVnVkSE5iYm1WM1JHVnpZM0pwY0hSdmNpNXViMlJsVG1GdFpWMGdmSHdnWlcxd2RIazdYRzVjYmlBZ0lDQWdJR2xtSUNodmJHUkRkWE4wYjIxRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlM1a1pYUmhZMmhsWkVOaGJHeGlZV05yS1NCN1hHNGdJQ0FnSUNBZ0lHOXNaRU4xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtUmxkR0ZqYUdWa1EyRnNiR0poWTJzdVkyRnNiQ2h3WVhSamFDNXZiR1FwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9ibVYzUTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVZWFIwWVdOb1pXUkRZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0J1WlhkRGRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVoZEhSaFkyaGxaRU5oYkd4aVlXTnJMbU5oYkd3b2NHRjBZMmd1Ym1WM0tUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5Qk9iMlJsSUcxaGJtbHdMbHh1SUNBZ0lHVnNjMlVnYVdZZ0tIQmhkR05vTGw5ZlpHOWZYeUE5UFQwZ01Ta2dlMXh1SUNBZ0lDQWdMeThnUVdSa0xseHVJQ0FnSUNBZ2FXWWdLSEJoZEdOb0xtVnNaVzFsYm5RZ0ppWWdjR0YwWTJndVpuSmhaMjFsYm5RZ0ppWWdJWEJoZEdOb0xtOXNaQ2tnZTF4dUlDQWdJQ0FnSUNCc1pYUWdabkpoWjIxbGJuUWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkViMk4xYldWdWRFWnlZV2R0Wlc1MEtDazdYRzVjYmlBZ0lDQWdJQ0FnY0dGMFkyZ3VabkpoWjIxbGJuUXVabTl5UldGamFDaGhkSFJoWTJobFpFTmhiR3hpWVdOckxDQjdJR1p5WVdkdFpXNTBJSDBwTzF4dUlDQWdJQ0FnSUNCd1lYUmphQzVsYkdWdFpXNTBMbUZ3Y0dWdVpFTm9hV3hrS0daeVlXZHRaVzUwS1R0Y2JseHVJQ0FnSUNBZ0lDQm1iM0pGWVdOb0xtTmhiR3dvY0dGMFkyZ3VabkpoWjIxbGJuUXNJR0YwZEdGamFHVmtWSEpoYm5OcGRHbHZia0Z1WkZScGRHeGxLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1VtVnRiM1psTGx4dUlDQWdJQ0FnWld4elpTQnBaaUFvY0dGMFkyZ3ViMnhrSUNZbUlDRndZWFJqYUM1dVpYY3BJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tDRndZWFJqYUM1dmJHUXVjR0Z5Wlc1MFRtOWtaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblEyRnVYRnduZENCeVpXMXZkbVVnZDJsMGFHOTFkQ0J3WVhKbGJuUXNJR2x6SUhSb2FYTWdkR2hsSUNjZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSjJSdlkzVnRaVzUwSUhKdmIzUS9KeWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJGYm5OMWNtVWdkR2hsSUhScGRHeGxJR2x6SUdWdGNIUnBaV1F1WEc0Z0lDQWdJQ0FnSUdsbUlDaHdZWFJqYUM1dmJHUXVkR0ZuVG1GdFpTQTlQVDBnSjNScGRHeGxKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lIQmhkR05vTG05c1pDNXZkMjVsY2tSdlkzVnRaVzUwTG5ScGRHeGxJRDBnSnljN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JzWlhRZ1kzVnpkRzl0Uld4bGJXVnVkQ0E5SUdOdmJYQnZibVZ1ZEhOYmIyeGtSR1Z6WTNKcGNIUnZjaTV1YjJSbFRtRnRaVjBnZkh3Z1pXMXdkSGs3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLR04xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtUmxkR0ZqYUdWa1EyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lDQWdJQ0JqZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWtaWFJoWTJobFpFTmhiR3hpWVdOckxtTmhiR3dvY0dGMFkyZ3ViMnhrS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSEJoZEdOb0xtOXNaQzV3WVhKbGJuUk9iMlJsTG5KbGJXOTJaVU5vYVd4a0tIQmhkR05vTG05c1pDazdYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsY3lBbUppQnpkR0YwWlhNdVpHVjBZV05vWldRZ0ppWWdjM1JoZEdWekxtUmxkR0ZqYUdWa0xteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR0ZrWkZCeWIyMXBjMlZ6S0hOMFlYUmxjeTVrWlhSaFkyaGxaQzV0WVhBb1kyRnNiRU5oYkd4aVlXTnJMQ0J3WVhSamFDNXZiR1FwS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzFoYTJWT2IyUmxMbTV2WkdWelcyOXNaRVJsYzJOeWFYQjBiM0l1Wld4bGJXVnVkRjBnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRkpsY0d4aFkyVXVYRzRnSUNBZ0lDQmxiSE5sSUdsbUlDaHdZWFJqYUM1dmJHUWdKaVlnY0dGMFkyZ3VibVYzS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2doY0dGMFkyZ3ViMnhrTG5CaGNtVnVkRTV2WkdVcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KME5oYmx4Y0ozUWdjbVZ3YkdGalpTQjNhWFJvYjNWMElIQmhjbVZ1ZEN3Z2FYTWdkR2hwY3lCMGFHVWdKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5aRzlqZFcxbGJuUWdjbTl2ZEQ4bktUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklFRndjR1Z1WkNCMGFHVWdaV3hsYldWdWRDQm1hWEp6ZEN3Z1ltVm1iM0psSUdSdmFXNW5JSFJvWlNCeVpYQnNZV05sYldWdWRDNWNiaUFnSUNBZ0lDQWdjR0YwWTJndWIyeGtMbkJoY21WdWRFNXZaR1V1YVc1elpYSjBRbVZtYjNKbEtIQmhkR05vTG01bGR5d2djR0YwWTJndWIyeGtMbTVsZUhSVGFXSnNhVzVuS1R0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJTWlcxdmRtVmtJSE4wWVhSbElHWnZjaUIwY21GdWMybDBhVzl1Y3lCQlVFa3VYRzRnSUNBZ0lDQWdJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG1SbGRHRmphR1ZrSUNZbUlITjBZWFJsY3k1a1pYUmhZMmhsWkM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVaR1YwWVdOb1pXUXViV0Z3S0dOaGJHeERZV3hzWW1GamF5d2djR0YwWTJndWIyeGtLU2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJTWlhCc1lXTmxaQ0J6ZEdGMFpTQm1iM0lnZEhKaGJuTnBkR2x2Ym5NZ1FWQkpMbHh1SUNBZ0lDQWdJQ0JwWmlBb2MzUmhkR1Z6SUNZbUlITjBZWFJsY3k1eVpYQnNZV05sWkNBbUppQnpkR0YwWlhNdWNtVndiR0ZqWldRdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZV1JrVUhKdmJXbHpaWE1vYzNSaGRHVnpMbkpsY0d4aFkyVmtMbTFoY0NoallXeHNZbUZqYXlBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWTJGc2JHSmhZMnNvY0dGMFkyZ3ViMnhrTENCd1lYUmphQzV1WlhjcE8xeHVJQ0FnSUNBZ0lDQWdJSDBwS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVWdWMzVnlaU0IwYUdVZ2RHbDBiR1VnYVhNZ2MyVjBJR052Y25KbFkzUnNlUzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIQmhkR05vTG01bGR5NTBZV2RPWVcxbElEMDlQU0FuZEdsMGJHVW5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NHRjBZMmd1YjJ4a0xtOTNibVZ5Ukc5amRXMWxiblF1ZEdsMGJHVWdQU0J3WVhSamFDNXVaWGN1WTJocGJHUk9iMlJsYzFzd1hTNXViMlJsVm1Gc2RXVTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCd1lYUmphQzV2YkdRdWNHRnlaVzUwVG05a1pTNXlaWEJzWVdObFEyaHBiR1FvY0dGMFkyZ3VibVYzTENCd1lYUmphQzV2YkdRcE8xeHVYRzRnSUNBZ0lDQWdJR3hsZENCdmJHUkRkWE4wYjIxRmJHVnRaVzUwSUQwZ1kyOXRjRzl1Wlc1MGMxdHZiR1JFWlhOamNtbHdkRzl5TG01dlpHVk9ZVzFsWFNCOGZDQmxiWEIwZVR0Y2JpQWdJQ0FnSUNBZ2JHVjBJRzVsZDBOMWMzUnZiVVZzWlcxbGJuUWdQU0JqYjIxd2IyNWxiblJ6VzI1bGQwUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHZiR1JEZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWtaWFJoWTJobFpFTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1EzVnpkRzl0Uld4bGJXVnVkQzV3Y205MGIzUjVjR1V1WkdWMFlXTm9aV1JEWVd4c1ltRmpheTVqWVd4c0tIQmhkR05vTG05c1pDazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCcFppQW9ibVYzUTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVZWFIwWVdOb1pXUkRZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0FnSUc1bGQwTjFjM1J2YlVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnN1WTJGc2JDaHdZWFJqYUM1dVpYY3BPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRV1JrWldRZ2MzUmhkR1VnWm05eUlIUnlZVzV6YVhScGIyNXpJRUZRU1M1Y2JpQWdJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVZWFIwWVdOb1pXUWdKaVlnYzNSaGRHVnpMbUYwZEdGamFHVmtMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUdGMGRHRmphR1ZrVkhKaGJuTnBkR2x2YmtGdVpGUnBkR3hsS0c1bGQwUmxjMk55YVhCMGIzSXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2JXRnJaVTV2WkdVdWJtOWtaWE5iYjJ4a1JHVnpZM0pwY0hSdmNpNWxiR1Z0Wlc1MFhTQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJCZEhSeWFXSjFkR1VnYldGdWFYQjFiR0YwYVc5dUxseHVJQ0FnSUdWc2MyVWdhV1lnS0hCaGRHTm9MbDlmWkc5Zlh5QTlQVDBnTWlrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzlzWkZaaGJIVmxJRDBnY0dGMFkyZ3VaV3hsYldWdWRDNW5aWFJCZEhSeWFXSjFkR1VvY0dGMFkyZ3VibUZ0WlNrN1hHNWNiaUFnSUNBZ0lDOHZJRU5vWVc1blpYTWdkR2hsSUdGMGRISnBZblYwWlNCdmJpQjBhR1VnWld4bGJXVnVkQzVjYmlBZ0lDQWdJR3hsZENCaGRXZHRaVzUwUVhSMGNtbGlkWFJsSUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUZKbGJXOTJaUzVjYmlBZ0lDQWdJQ0FnYVdZZ0tDRndZWFJqYUM1MllXeDFaU2tnZXlCd1lYUmphQzVsYkdWdFpXNTBMbkpsYlc5MlpVRjBkSEpwWW5WMFpTaHdZWFJqYUM1dVlXMWxLVHNnZlZ4dUlDQWdJQ0FnSUNBdkx5QkRhR0Z1WjJVdVhHNGdJQ0FnSUNBZ0lHVnNjMlVnZXlCd1lYUmphQzVsYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNod1lYUmphQzV1WVcxbExDQndZWFJqYUM1MllXeDFaU2s3SUgxY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDOHZJRlJ5YVdkblpYSWdZV3hzSUhSb1pTQmhkSFJ5YVdKMWRHVWdZMmhoYm1kbFpDQjJZV3gxWlhNdVhHNGdJQ0FnSUNCcFppQW9jM1JoZEdWeklDWW1JSE4wWVhSbGN5NWhkSFJ5YVdKMWRHVkRhR0Z1WjJWa0lDWW1JSE4wWVhSbGN5NWhkSFJ5YVdKMWRHVkRhR0Z1WjJWa0xteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVZWFIwY21saWRYUmxRMmhoYm1kbFpDNXRZWEFvWTJGc2JHSmhZMnNnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSFpoY2lCd2NtOXRhWE5sSUQwZ1kyRnNiR0poWTJzb2NHRjBZMmd1Wld4bGJXVnVkQ3dnY0dGMFkyZ3VibUZ0WlN3Z2IyeGtWbUZzZFdVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0J3WVhSamFDNTJZV3gxWlNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2NISnZiV2x6WlNrZ2V5QndjbTl0YVhObExuUm9aVzRvWVhWbmJXVnVkRUYwZEhKcFluVjBaU2s3SUgxY2JpQWdJQ0FnSUNBZ0lDQmxiSE5sSUhzZ1lYVm5iV1Z1ZEVGMGRISnBZblYwWlNncE95QjlYRzVjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnY0hKdmJXbHpaVHRjYmlBZ0lDQWdJQ0FnZlNrcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUdGMVoyMWxiblJCZEhSeWFXSjFkR1VvS1R0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdWSEpwWjJkbGNpQmpkWE4wYjIwZ1pXeGxiV1Z1ZENCaGRIUnlhV0oxZEdWRGFHRnVaMlZrSUdWMlpXNTBjeTVjYmlBZ0lDQWdJR3hsZENCamRYTjBiMjFGYkdWdFpXNTBJRDBnWTI5dGNHOXVaVzUwYzF0bGJHVnRaVzUwUkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlYwZ2ZId2daVzF3ZEhrN1hHNWNiaUFnSUNBZ0lHbG1JQ2hqZFhOMGIyMUZiR1Z0Wlc1MExtRjBkSEpwWW5WMFpVTm9ZVzVuWldSRFlXeHNZbUZqYXlrZ2UxeHVJQ0FnSUNBZ0lDQmpkWE4wYjIxRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlM1aGRIUnlhV0oxZEdWRGFHRnVaMlZrUTJGc2JHSmhZMnN1WTJGc2JDaHdZWFJqYUM1dmJHUXNYRzRnSUNBZ0lDQWdJQ0FnY0dGMFkyZ3VibUZ0WlN3Z2IyeGtWbUZzZFdVc0lIQmhkR05vTG5aaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJVWlhoMElHNXZaR1VnYldGdWFYQjFiR0YwYVc5dUxseHVJQ0FnSUdWc2MyVWdhV1lnS0hCaGRHTm9MbDlmWkc5Zlh5QTlQVDBnTXlrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzl5YVdkcGJtRnNWbUZzZFdVZ1BTQndZWFJqYUM1bGJHVnRaVzUwTG5SbGVIUkRiMjUwWlc1ME8xeHVYRzRnSUNBZ0lDQXZMeUJEYUdGdVoyVnpJSFJvWlNCMFpYaDBMbHh1SUNBZ0lDQWdiR1YwSUdGMVoyMWxiblJVWlhoMElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhCaGRHTm9MbVZzWlcxbGJuUXVkR1Y0ZEVOdmJuUmxiblFnUFNCa1pXTnZaR1ZGYm5ScGRHbGxjeWh3WVhSamFDNTJZV3gxWlNrN1hHNGdJQ0FnSUNCOU8xeHVYRzRnSUNBZ0lDQXZMeUJVY21sbloyVnlJR0ZzYkNCMGFHVWdkR1Y0ZENCamFHRnVaMlZrSUhaaGJIVmxjeTVjYmlBZ0lDQWdJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0lDWW1JSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaQzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnWVdSa1VISnZiV2x6WlhNb2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0xtMWhjQ2hqWVd4c1ltRmpheUE5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhCeWIyMXBjMlVnUFNCallXeHNZbUZqYXlod1lYUmphQzVsYkdWdFpXNTBMbkJoY21WdWRFNXZaR1VnZkh3Z2NHRjBZMmd1Wld4bGJXVnVkQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHOXlhV2RwYm1Gc1ZtRnNkV1VzSUhCaGRHTm9MblpoYkhWbEtUdGNibHh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHdjbTl0YVhObEtTQjdJSEJ5YjIxcGMyVXVkR2hsYmloaGRXZHRaVzUwVkdWNGRDazdJSDFjYmlBZ0lDQWdJQ0FnSUNCbGJITmxJSHNnWVhWbmJXVnVkRlJsZUhRb0tUc2dmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhCeWIyMXBjMlU3WEc0Z0lDQWdJQ0FnSUgwcEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCd1lYUmphQzVsYkdWdFpXNTBMblJsZUhSRGIyNTBaVzUwSUQwZ1pHVmpiMlJsUlc1MGFYUnBaWE1vY0dGMFkyZ3VkbUZzZFdVcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIWmhjaUJoWTNScGRtVlFjbTl0YVhObGN5QTlJSEJ5YjIxcGMyVnpMbVpwYkhSbGNpaENiMjlzWldGdUtUdGNibHh1SUNBdkx5QlhZV2wwSUhWdWRHbHNJR0ZzYkNCMGNtRnVjMmwwYVc5dUlIQnliMjFwYzJWeklHaGhkbVVnY21WemIyeDJaV1F1WEc0Z0lHbG1JQ2hoWTNScGRtVlFjbTl0YVhObGN5NXNaVzVuZEdncElIdGNiaUFnSUNCeVpYUjFjbTRnVUhKdmJXbHpaUzVoYkd3b2NISnZiV2x6WlhNdVptbHNkR1Z5S0VKdmIyeGxZVzRwS1R0Y2JpQWdmVnh1ZlZ4dUlsMTkiLCIvLyBMaXN0IG9mIFNWRyBlbGVtZW50cy5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZWxlbWVudHMgPSBbJ2FsdEdseXBoJywgJ2FsdEdseXBoRGVmJywgJ2FsdEdseXBoSXRlbScsICdhbmltYXRlJywgJ2FuaW1hdGVDb2xvcicsICdhbmltYXRlTW90aW9uJywgJ2FuaW1hdGVUcmFuc2Zvcm0nLCAnY2lyY2xlJywgJ2NsaXBQYXRoJywgJ2NvbG9yLXByb2ZpbGUnLCAnY3Vyc29yJywgJ2RlZnMnLCAnZGVzYycsICdlbGxpcHNlJywgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJywgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLCAnZmVEaXNwbGFjZW1lbnRNYXAnLCAnZmVEaXN0YW50TGlnaHQnLCAnZmVGbG9vZCcsICdmZUZ1bmNBJywgJ2ZlRnVuY0InLCAnZmVGdW5jRycsICdmZUZ1bmNSJywgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZScsICdmZU1lcmdlTm9kZScsICdmZU1vcnBob2xvZ3knLCAnZmVPZmZzZXQnLCAnZmVQb2ludExpZ2h0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsICdmZVNwb3RMaWdodCcsICdmZVRpbGUnLCAnZmVUdXJidWxlbmNlJywgJ2ZpbHRlcicsICdmb250JywgJ2ZvbnQtZmFjZScsICdmb250LWZhY2UtZm9ybWF0JywgJ2ZvbnQtZmFjZS1uYW1lJywgJ2ZvbnQtZmFjZS1zcmMnLCAnZm9udC1mYWNlLXVyaScsICdmb3JlaWduT2JqZWN0JywgJ2cnLCAnZ2x5cGgnLCAnZ2x5cGhSZWYnLCAnaGtlcm4nLCAnaW1hZ2UnLCAnbGluZScsICdsaW5lYXJHcmFkaWVudCcsICdtYXJrZXInLCAnbWFzaycsICdtZXRhZGF0YScsICdtaXNzaW5nLWdseXBoJywgJ21wYXRoJywgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLCAnc2NyaXB0JywgJ3NldCcsICdzdG9wJywgJ3N0eWxlJywgJ3N2ZycsICdzd2l0Y2gnLCAnc3ltYm9sJywgJ3RleHQnLCAndGV4dFBhdGgnLCAndGl0bGUnLCAndHJlZicsICd0c3BhbicsICd1c2UnLCAndmlldycsICd2a2VybiddO1xuXG5leHBvcnRzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4vLyBOYW1lc3BhY2UuXG52YXIgbmFtZXNwYWNlID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbmV4cG9ydHMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzTjJaeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdRVUZEVHl4SlFVRkpMRkZCUVZFc1IwRkJSeXhEUVVOd1FpeFZRVUZWTEVWQlExWXNZVUZCWVN4RlFVTmlMR05CUVdNc1JVRkRaQ3hUUVVGVExFVkJRMVFzWTBGQll5eEZRVU5rTEdWQlFXVXNSVUZEWml4clFrRkJhMElzUlVGRGJFSXNVVUZCVVN4RlFVTlNMRlZCUVZVc1JVRkRWaXhsUVVGbExFVkJRMllzVVVGQlVTeEZRVU5TTEUxQlFVMHNSVUZEVGl4TlFVRk5MRVZCUTA0c1UwRkJVeXhGUVVOVUxGTkJRVk1zUlVGRFZDeGxRVUZsTEVWQlEyWXNjVUpCUVhGQ0xFVkJRM0pDTEdGQlFXRXNSVUZEWWl4clFrRkJhMElzUlVGRGJFSXNiVUpCUVcxQ0xFVkJRMjVDTEcxQ1FVRnRRaXhGUVVOdVFpeG5Ra0ZCWjBJc1JVRkRhRUlzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4VFFVRlRMRVZCUTFRc1UwRkJVeXhGUVVOVUxGTkJRVk1zUlVGRFZDeG5Ra0ZCWjBJc1JVRkRhRUlzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4aFFVRmhMRVZCUTJJc1kwRkJZeXhGUVVOa0xGVkJRVlVzUlVGRFZpeGpRVUZqTEVWQlEyUXNiMEpCUVc5Q0xFVkJRM0JDTEdGQlFXRXNSVUZEWWl4UlFVRlJMRVZCUTFJc1kwRkJZeXhGUVVOa0xGRkJRVkVzUlVGRFVpeE5RVUZOTEVWQlEwNHNWMEZCVnl4RlFVTllMR3RDUVVGclFpeEZRVU5zUWl4blFrRkJaMElzUlVGRGFFSXNaVUZCWlN4RlFVTm1MR1ZCUVdVc1JVRkRaaXhsUVVGbExFVkJRMllzUjBGQlJ5eEZRVU5JTEU5QlFVOHNSVUZEVUN4VlFVRlZMRVZCUTFZc1QwRkJUeXhGUVVOUUxFOUJRVThzUlVGRFVDeE5RVUZOTEVWQlEwNHNaMEpCUVdkQ0xFVkJRMmhDTEZGQlFWRXNSVUZEVWl4TlFVRk5MRVZCUTA0c1ZVRkJWU3hGUVVOV0xHVkJRV1VzUlVGRFppeFBRVUZQTEVWQlExQXNUVUZCVFN4RlFVTk9MRk5CUVZNc1JVRkRWQ3hUUVVGVExFVkJRMVFzVlVGQlZTeEZRVU5XTEdkQ1FVRm5RaXhGUVVOb1FpeE5RVUZOTEVWQlEwNHNVVUZCVVN4RlFVTlNMRXRCUVVzc1JVRkRUQ3hOUVVGTkxFVkJRMDRzVDBGQlR5eEZRVU5RTEV0QlFVc3NSVUZEVEN4UlFVRlJMRVZCUTFJc1VVRkJVU3hGUVVOU0xFMUJRVTBzUlVGRFRpeFZRVUZWTEVWQlExWXNUMEZCVHl4RlFVTlFMRTFCUVUwc1JVRkRUaXhQUVVGUExFVkJRMUFzUzBGQlN5eEZRVU5NTEUxQlFVMHNSVUZEVGl4UFFVRlBMRU5CUTFJc1EwRkJRenM3T3p0QlFVZExMRWxCUVVrc1UwRkJVeXhIUVVGSExEUkNRVUUwUWl4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM04yWnk1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUV4cGMzUWdiMllnVTFaSElHVnNaVzFsYm5SekxseHVaWGh3YjNKMElHeGxkQ0JsYkdWdFpXNTBjeUE5SUZ0Y2JpQWdKMkZzZEVkc2VYQm9KeXhjYmlBZ0oyRnNkRWRzZVhCb1JHVm1KeXhjYmlBZ0oyRnNkRWRzZVhCb1NYUmxiU2NzWEc0Z0lDZGhibWx0WVhSbEp5eGNiaUFnSjJGdWFXMWhkR1ZEYjJ4dmNpY3NYRzRnSUNkaGJtbHRZWFJsVFc5MGFXOXVKeXhjYmlBZ0oyRnVhVzFoZEdWVWNtRnVjMlp2Y20wbkxGeHVJQ0FuWTJseVkyeGxKeXhjYmlBZ0oyTnNhWEJRWVhSb0p5eGNiaUFnSjJOdmJHOXlMWEJ5YjJacGJHVW5MRnh1SUNBblkzVnljMjl5Snl4Y2JpQWdKMlJsWm5NbkxGeHVJQ0FuWkdWell5Y3NYRzRnSUNkbGJHeHBjSE5sSnl4Y2JpQWdKMlpsUW14bGJtUW5MRnh1SUNBblptVkRiMnh2Y2sxaGRISnBlQ2NzWEc0Z0lDZG1aVU52YlhCdmJtVnVkRlJ5WVc1elptVnlKeXhjYmlBZ0oyWmxRMjl0Y0c5emFYUmxKeXhjYmlBZ0oyWmxRMjl1ZG05c2RtVk5ZWFJ5YVhnbkxGeHVJQ0FuWm1WRWFXWm1kWE5sVEdsbmFIUnBibWNuTEZ4dUlDQW5abVZFYVhOd2JHRmpaVzFsYm5STllYQW5MRnh1SUNBblptVkVhWE4wWVc1MFRHbG5hSFFuTEZ4dUlDQW5abVZHYkc5dlpDY3NYRzRnSUNkbVpVWjFibU5CSnl4Y2JpQWdKMlpsUm5WdVkwSW5MRnh1SUNBblptVkdkVzVqUnljc1hHNGdJQ2RtWlVaMWJtTlNKeXhjYmlBZ0oyWmxSMkYxYzNOcFlXNUNiSFZ5Snl4Y2JpQWdKMlpsU1cxaFoyVW5MRnh1SUNBblptVk5aWEpuWlNjc1hHNGdJQ2RtWlUxbGNtZGxUbTlrWlNjc1hHNGdJQ2RtWlUxdmNuQm9iMnh2WjNrbkxGeHVJQ0FuWm1WUFptWnpaWFFuTEZ4dUlDQW5abVZRYjJsdWRFeHBaMmgwSnl4Y2JpQWdKMlpsVTNCbFkzVnNZWEpNYVdkb2RHbHVaeWNzWEc0Z0lDZG1aVk53YjNSTWFXZG9kQ2NzWEc0Z0lDZG1aVlJwYkdVbkxGeHVJQ0FuWm1WVWRYSmlkV3hsYm1ObEp5eGNiaUFnSjJacGJIUmxjaWNzWEc0Z0lDZG1iMjUwSnl4Y2JpQWdKMlp2Ym5RdFptRmpaU2NzWEc0Z0lDZG1iMjUwTFdaaFkyVXRabTl5YldGMEp5eGNiaUFnSjJadmJuUXRabUZqWlMxdVlXMWxKeXhjYmlBZ0oyWnZiblF0Wm1GalpTMXpjbU1uTEZ4dUlDQW5abTl1ZEMxbVlXTmxMWFZ5YVNjc1hHNGdJQ2RtYjNKbGFXZHVUMkpxWldOMEp5eGNiaUFnSjJjbkxGeHVJQ0FuWjJ4NWNHZ25MRnh1SUNBbloyeDVjR2hTWldZbkxGeHVJQ0FuYUd0bGNtNG5MRnh1SUNBbmFXMWhaMlVuTEZ4dUlDQW5iR2x1WlNjc1hHNGdJQ2RzYVc1bFlYSkhjbUZrYVdWdWRDY3NYRzRnSUNkdFlYSnJaWEluTEZ4dUlDQW5iV0Z6YXljc1hHNGdJQ2R0WlhSaFpHRjBZU2NzWEc0Z0lDZHRhWE56YVc1bkxXZHNlWEJvSnl4Y2JpQWdKMjF3WVhSb0p5eGNiaUFnSjNCaGRHZ25MRnh1SUNBbmNHRjBkR1Z5Ymljc1hHNGdJQ2R3YjJ4NVoyOXVKeXhjYmlBZ0ozQnZiSGxzYVc1bEp5eGNiaUFnSjNKaFpHbGhiRWR5WVdScFpXNTBKeXhjYmlBZ0ozSmxZM1FuTEZ4dUlDQW5jMk55YVhCMEp5eGNiaUFnSjNObGRDY3NYRzRnSUNkemRHOXdKeXhjYmlBZ0ozTjBlV3hsSnl4Y2JpQWdKM04yWnljc1hHNGdJQ2R6ZDJsMFkyZ25MRnh1SUNBbmMzbHRZbTlzSnl4Y2JpQWdKM1JsZUhRbkxGeHVJQ0FuZEdWNGRGQmhkR2duTEZ4dUlDQW5kR2wwYkdVbkxGeHVJQ0FuZEhKbFppY3NYRzRnSUNkMGMzQmhiaWNzWEc0Z0lDZDFjMlVuTEZ4dUlDQW5kbWxsZHljc1hHNGdJQ2QyYTJWeWJpY3NYRzVkTzF4dVhHNHZMeUJPWVcxbGMzQmhZMlV1WEc1bGVIQnZjblFnYkdWMElHNWhiV1Z6Y0dGalpTQTlJQ2RvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeWM3WEc0aVhYMD0iLCIvKipcbiAqIENvbnRhaW5zIGFycmF5cyB0byBzdG9yZSB0cmFuc2l0aW9uIGNhbGxiYWNrcy5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgdHJhbnNpdGlvblN0YXRlcyA9IHt9O1xuXG5leHBvcnRzLnRyYW5zaXRpb25TdGF0ZXMgPSB0cmFuc2l0aW9uU3RhdGVzO1xuLyoqXG4gKiBGb3Igd2hlbiBlbGVtZW50cyBjb21lIGludG8gdGhlIERPTS4gVGhlIGNhbGxiYWNrIHRyaWdnZXJzIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiB0aGUgZWxlbWVudCBlbnRlcnMgdGhlIERPTS4gSXQgaXMgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQgYXMgdGhlIG9ubHlcbiAqIGFyZ3VtZW50LlxuICovXG50cmFuc2l0aW9uU3RhdGVzLmF0dGFjaGVkID0gW107XG5cbi8qKlxuICogRm9yIHdoZW4gZWxlbWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnMganVzdFxuICogYmVmb3JlIHRoZSBlbGVtZW50IGxlYXZlcyB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCBhcyB0aGUgb25seVxuICogYXJndW1lbnQuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMuZGV0YWNoZWQgPSBbXTtcblxuLypcbiAqIEZvciB3aGVuIGVsZW1lbnRzIGFyZSByZXBsYWNlZCBpbiB0aGUgRE9NLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnMgYWZ0ZXIgdGhlXG4gKiBuZXcgZWxlbWVudCBlbnRlcnMgdGhlIERPTSwgYW5kIGJlZm9yZSB0aGUgb2xkIGVsZW1lbnQgbGVhdmVzLiBJdCBpcyBjYWxsZWRcbiAqIHdpdGggb2xkIGFuZCBuZXcgZWxlbWVudHMgYXMgYXJndW1lbnRzLCBpbiB0aGF0IG9yZGVyLlxuICovXG50cmFuc2l0aW9uU3RhdGVzLnJlcGxhY2VkID0gW107XG5cbi8qXG4gKiBUcmlnZ2VyZWQgd2hlbiBhbiBlbGVtZW50J3MgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnNcbiAqIGFmdGVyIHRoZSBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQgaW4gdGhlIERPTS4gSXQgaXMgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQsXG4gKiB0aGUgYXR0cmlidXRlIG5hbWUsIG9sZCB2YWx1ZSwgYW5kIGN1cnJlbnQgdmFsdWUuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMuYXR0cmlidXRlQ2hhbmdlZCA9IFtdO1xuXG4vKlxuICogVHJpZ2dlcmVkIHdoZW4gYW4gZWxlbWVudCdzIGB0ZXh0Q29udGVudGAgY2huYWdlcy4gVGhlIGNhbGxiYWNrIHRyaWdnZXJzXG4gKiBhZnRlciB0aGUgdGV4dENvbnRlbnQgaGFzIGNoYW5nZWQgaW4gdGhlIERPTS4gSXQgaXMgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQsXG4gKiB0aGUgb2xkIHZhbHVlLCBhbmQgY3VycmVudCB2YWx1ZS5cbiAqL1xudHJhbnNpdGlvblN0YXRlcy50ZXh0Q2hhbmdlZCA9IFtdO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzUnlZVzV6YVhScGIyNXpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPMEZCUjA4c1NVRkJTU3huUWtGQlowSXNSMEZCUnl4RlFVRkZMRU5CUVVNN096czdPenM3TzBGQlQycERMR2RDUVVGblFpeERRVUZETEZGQlFWRXNSMEZCUnl4RlFVRkZMRU5CUVVNN096czdPenM3UVVGUEwwSXNaMEpCUVdkQ0xFTkJRVU1zVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXpzN096czdPenRCUVU4dlFpeG5Ra0ZCWjBJc1EwRkJReXhSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZET3pzN096czdPMEZCVHk5Q0xHZENRVUZuUWl4RFFVRkRMR2RDUVVGblFpeEhRVUZITEVWQlFVVXNRMEZCUXpzN096czdPenRCUVU5MlF5eG5Ra0ZCWjBJc1EwRkJReXhYUVVGWExFZEJRVWNzUlVGQlJTeERRVUZESWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNSeVlXNXphWFJwYjI1ekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJEYjI1MFlXbHVjeUJoY25KaGVYTWdkRzhnYzNSdmNtVWdkSEpoYm5OcGRHbHZiaUJqWVd4c1ltRmphM011WEc0Z0tpOWNibVY0Y0c5eWRDQnNaWFFnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeUE5SUh0OU8xeHVYRzR2S2lwY2JpQXFJRVp2Y2lCM2FHVnVJR1ZzWlcxbGJuUnpJR052YldVZ2FXNTBieUIwYUdVZ1JFOU5MaUJVYUdVZ1kyRnNiR0poWTJzZ2RISnBaMmRsY25NZ2FXMXRaV1JwWVhSbGJIa2dZV1owWlhKY2JpQXFJSFJvWlNCbGJHVnRaVzUwSUdWdWRHVnljeUIwYUdVZ1JFOU5MaUJKZENCcGN5QmpZV3hzWldRZ2QybDBhQ0IwYUdVZ1pXeGxiV1Z1ZENCaGN5QjBhR1VnYjI1c2VWeHVJQ29nWVhKbmRXMWxiblF1WEc0Z0tpOWNiblJ5WVc1emFYUnBiMjVUZEdGMFpYTXVZWFIwWVdOb1pXUWdQU0JiWFR0Y2JseHVMeW9xWEc0Z0tpQkdiM0lnZDJobGJpQmxiR1Z0Wlc1MGN5QmhjbVVnY21WdGIzWmxaQ0JtY205dElIUm9aU0JFVDAwdUlGUm9aU0JqWVd4c1ltRmpheUIwY21sbloyVnljeUJxZFhOMFhHNGdLaUJpWldadmNtVWdkR2hsSUdWc1pXMWxiblFnYkdWaGRtVnpJSFJvWlNCRVQwMHVJRWwwSUdseklHTmhiR3hsWkNCM2FYUm9JSFJvWlNCbGJHVnRaVzUwSUdGeklIUm9aU0J2Ym14NVhHNGdLaUJoY21kMWJXVnVkQzVjYmlBcUwxeHVkSEpoYm5OcGRHbHZibE4wWVhSbGN5NWtaWFJoWTJobFpDQTlJRnRkTzF4dVhHNHZLbHh1SUNvZ1JtOXlJSGRvWlc0Z1pXeGxiV1Z1ZEhNZ1lYSmxJSEpsY0d4aFkyVmtJR2x1SUhSb1pTQkVUMDB1SUZSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWN5QmhablJsY2lCMGFHVmNiaUFxSUc1bGR5QmxiR1Z0Wlc1MElHVnVkR1Z5Y3lCMGFHVWdSRTlOTENCaGJtUWdZbVZtYjNKbElIUm9aU0J2YkdRZ1pXeGxiV1Z1ZENCc1pXRjJaWE11SUVsMElHbHpJR05oYkd4bFpGeHVJQ29nZDJsMGFDQnZiR1FnWVc1a0lHNWxkeUJsYkdWdFpXNTBjeUJoY3lCaGNtZDFiV1Z1ZEhNc0lHbHVJSFJvWVhRZ2IzSmtaWEl1WEc0Z0tpOWNiblJ5WVc1emFYUnBiMjVUZEdGMFpYTXVjbVZ3YkdGalpXUWdQU0JiWFR0Y2JseHVMeXBjYmlBcUlGUnlhV2RuWlhKbFpDQjNhR1Z1SUdGdUlHVnNaVzFsYm5RbmN5QmhkSFJ5YVdKMWRHVWdhR0Z6SUdOb1lXNW5aV1F1SUZSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWMxeHVJQ29nWVdaMFpYSWdkR2hsSUdGMGRISnBZblYwWlNCb1lYTWdZMmhoYm1kbFpDQnBiaUIwYUdVZ1JFOU5MaUJKZENCcGN5QmpZV3hzWldRZ2QybDBhQ0IwYUdVZ1pXeGxiV1Z1ZEN4Y2JpQXFJSFJvWlNCaGRIUnlhV0oxZEdVZ2JtRnRaU3dnYjJ4a0lIWmhiSFZsTENCaGJtUWdZM1Z5Y21WdWRDQjJZV3gxWlM1Y2JpQXFMMXh1ZEhKaGJuTnBkR2x2YmxOMFlYUmxjeTVoZEhSeWFXSjFkR1ZEYUdGdVoyVmtJRDBnVzEwN1hHNWNiaThxWEc0Z0tpQlVjbWxuWjJWeVpXUWdkMmhsYmlCaGJpQmxiR1Z0Wlc1MEozTWdZSFJsZUhSRGIyNTBaVzUwWUNCamFHNWhaMlZ6TGlCVWFHVWdZMkZzYkdKaFkyc2dkSEpwWjJkbGNuTmNiaUFxSUdGbWRHVnlJSFJvWlNCMFpYaDBRMjl1ZEdWdWRDQm9ZWE1nWTJoaGJtZGxaQ0JwYmlCMGFHVWdSRTlOTGlCSmRDQnBjeUJqWVd4c1pXUWdkMmwwYUNCMGFHVWdaV3hsYldWdWRDeGNiaUFxSUhSb1pTQnZiR1FnZG1Gc2RXVXNJR0Z1WkNCamRYSnlaVzUwSUhaaGJIVmxMbHh1SUNvdlhHNTBjbUZ1YzJsMGFXOXVVM1JoZEdWekxuUmxlSFJEYUdGdVoyVmtJRDBnVzEwN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbi8qKlxuICogRGVjb2RlJ3MgSFRNTCBlbnRpdGllcy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzMDkxMjY2XG4gKiBAcGFyYW0gc3RyaW5naW5nXG4gKiBAcmV0dXJuIHVuZXNjYXBlZCBkZWNvZGVkIEhUTUxcbiAqL1xuZnVuY3Rpb24gZGVjb2RlRW50aXRpZXMoc3RyaW5nKSB7XG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gc3RyaW5nO1xuICByZXR1cm4gZWxlbWVudC50ZXh0Q29udGVudDtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gZGVjb2RlRW50aXRpZXM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dlpHVmpiMlJsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hQUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenM3T3pzN096czdPMEZCVXpWRExGTkJRVk1zWTBGQll5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTTVRaXhUUVVGUExFTkJRVU1zVTBGQlV5eEhRVUZITEUxQlFVMHNRMEZCUXp0QlFVTXpRaXhUUVVGUExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdRMEZETlVJN08zRkNRVVZqTEdOQlFXTWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZkWFJwYkM5a1pXTnZaR1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnNaWFFnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcE8xeHVYRzR2S2lwY2JpQXFJRVJsWTI5a1pTZHpJRWhVVFV3Z1pXNTBhWFJwWlhNdVhHNGdLbHh1SUNvZ1FITmxaU0JvZEhSd09pOHZjM1JoWTJ0dmRtVnlabXh2ZHk1amIyMHZZUzh4TXpBNU1USTJObHh1SUNvZ1FIQmhjbUZ0SUhOMGNtbHVaMmx1WjF4dUlDb2dRSEpsZEhWeWJpQjFibVZ6WTJGd1pXUWdaR1ZqYjJSbFpDQklWRTFNWEc0Z0tpOWNibVoxYm1OMGFXOXVJR1JsWTI5a1pVVnVkR2wwYVdWektITjBjbWx1WnlrZ2UxeHVJQ0JsYkdWdFpXNTBMbWx1Ym1WeVNGUk5UQ0E5SUhOMGNtbHVaenRjYmlBZ2NtVjBkWEp1SUdWc1pXMWxiblF1ZEdWNGRFTnZiblJsYm5RN1hHNTlYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1JsWTI5a1pVVnVkR2wwYVdWek8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucHJvdGVjdEVsZW1lbnQgPSBwcm90ZWN0RWxlbWVudDtcbmV4cG9ydHMudW5wcm90ZWN0RWxlbWVudCA9IHVucHJvdGVjdEVsZW1lbnQ7XG5leHBvcnRzLmNsZWFuTWVtb3J5ID0gY2xlYW5NZW1vcnk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfbm9kZU1ha2UgPSByZXF1aXJlKCcuLi9ub2RlL21ha2UnKTtcblxudmFyIF9ub2RlTWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlTWFrZSk7XG5cbnZhciBwb29scyA9IF91dGlsUG9vbHMucG9vbHM7XG52YXIgbWFrZU5vZGUgPSBfbm9kZU1ha2UyWydkZWZhdWx0J107XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IGFuIGVsZW1lbnQgaXMgbm90IHJlY3ljbGVkIGR1cmluZyBhIHJlbmRlciBjeWNsZS5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJldHVybiBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gcHJvdGVjdEVsZW1lbnQoZWxlbWVudCkge1xuICBwb29scy5lbGVtZW50T2JqZWN0LnByb3RlY3QoZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2gocHJvdGVjdEVsZW1lbnQpO1xuICBlbGVtZW50LmF0dHJpYnV0ZXMuZm9yRWFjaChwb29scy5hdHRyaWJ1dGVPYmplY3QucHJvdGVjdCwgcG9vbHMuYXR0cmlidXRlT2JqZWN0KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBBbGxvd3MgYW4gZWxlbWVudCB0byBiZSByZWN5Y2xlZCBkdXJpbmcgYSByZW5kZXIgY3ljbGUuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEByZXR1cm5cbiAqL1xuXG5mdW5jdGlvbiB1bnByb3RlY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2godW5wcm90ZWN0RWxlbWVudCk7XG4gIGVsZW1lbnQuYXR0cmlidXRlcy5mb3JFYWNoKHBvb2xzLmF0dHJpYnV0ZU9iamVjdC51bnByb3RlY3QsIHBvb2xzLmF0dHJpYnV0ZU9iamVjdCk7XG5cbiAgcG9vbHMuZWxlbWVudE9iamVjdC51bnByb3RlY3QoZWxlbWVudCk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbi8qKlxuICogUmVjeWNsZXMgYWxsIHVucHJvdGVjdGVkIGFsbG9jYXRpb25zLlxuICovXG5cbmZ1bmN0aW9uIGNsZWFuTWVtb3J5KCkge1xuICAvLyBGcmVlIGFsbCBtZW1vcnkgYWZ0ZXIgZWFjaCBpdGVyYXRpb24uXG4gIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5mcmVlQWxsKCk7XG4gIHBvb2xzLmVsZW1lbnRPYmplY3QuZnJlZUFsbCgpO1xuXG4gIC8vIEVtcHR5IG91dCB0aGUgYG1ha2Uubm9kZXNgIGlmIG9uIG1haW4gdGhyZWFkLlxuICBpZiAodHlwZW9mIG1ha2VOb2RlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGZvciAodmFyIHV1aWQgaW4gbWFrZU5vZGUubm9kZXMpIHtcbiAgICAgIC8vIElmIHRoaXMgaXMgbm90IGEgcHJvdGVjdGVkIHV1aWQsIHJlbW92ZSBpdC5cbiAgICAgIGlmICghcG9vbHMuZWxlbWVudE9iamVjdC5fdXVpZFt1dWlkXSkge1xuICAgICAgICBkZWxldGUgbWFrZU5vZGUubm9kZXNbdXVpZF07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZiV1Z0YjNKNUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdPM2xDUVVGblF5eGxRVUZsT3p0M1FrRkRla0lzWTBGQll6czdPenRCUVVWd1F5eEpRVUZKTEV0QlFVc3NiVUpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEZGQlFWRXNkMEpCUVZrc1EwRkJRenM3T3pzN096czdPMEZCVVd4Q0xGTkJRVk1zWTBGQll5eERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTjBReXhQUVVGTExFTkJRVU1zWVVGQllTeERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRmNrTXNVMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETTBNc1UwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1EwRkJReXhQUVVGUExFVkJRM1JFTEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenM3UVVGRmVrSXNVMEZCVHl4UFFVRlBMRU5CUVVNN1EwRkRhRUk3T3pzN096czdPenRCUVZGTkxGTkJRVk1zWjBKQlFXZENMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRM2hETEZOQlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkROME1zVTBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eFRRVUZUTEVWQlEzaEVMRXRCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6czdRVUZGZWtJc1QwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSWFpETEZOQlFVOHNUMEZCVHl4RFFVRkRPME5CUTJoQ096czdPenM3UVVGTFRTeFRRVUZUTEZkQlFWY3NSMEZCUnpzN1FVRkZOVUlzVDBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenRCUVVOb1F5eFBRVUZMTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRE96czdRVUZIT1VJc1RVRkJTU3hQUVVGUExGRkJRVkVzUzBGQlN5eFhRVUZYTEVWQlFVVTdRVUZEYmtNc1UwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RlFVRkZPenRCUVVVdlFpeFZRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR0ZCUVdFc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdRVUZEY0VNc1pVRkJUeXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMDlCUXpkQ08wdEJRMFk3UjBGRFJqdERRVU5HSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZiV1Z0YjNKNUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnY0c5dmJITWdZWE1nWDNCdmIyeHpJSDBnWm5KdmJTQW5MaTR2ZFhScGJDOXdiMjlzY3ljN1hHNXBiWEJ2Y25RZ1gyMWhhMlZPYjJSbElHWnliMjBnSnk0dUwyNXZaR1V2YldGclpTYzdYRzVjYm5aaGNpQndiMjlzY3lBOUlGOXdiMjlzY3p0Y2JuWmhjaUJ0WVd0bFRtOWtaU0E5SUY5dFlXdGxUbTlrWlR0Y2JseHVMeW9xWEc0Z0tpQkZibk4xY21WeklIUm9ZWFFnWVc0Z1pXeGxiV1Z1ZENCcGN5QnViM1FnY21WamVXTnNaV1FnWkhWeWFXNW5JR0VnY21WdVpHVnlJR041WTJ4bExseHVJQ3BjYmlBcUlFQndZWEpoYlNCbGJHVnRaVzUwWEc0Z0tpQkFjbVYwZFhKdUlHVnNaVzFsYm5SY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSEJ5YjNSbFkzUkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcElIdGNiaUFnY0c5dmJITXVaV3hsYldWdWRFOWlhbVZqZEM1d2NtOTBaV04wS0dWc1pXMWxiblFwTzF4dVhHNGdJR1ZzWlcxbGJuUXVZMmhwYkdST2IyUmxjeTVtYjNKRllXTm9LSEJ5YjNSbFkzUkZiR1Z0Wlc1MEtUdGNiaUFnWld4bGJXVnVkQzVoZEhSeWFXSjFkR1Z6TG1admNrVmhZMmdvY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuQnliM1JsWTNRc1hHNGdJQ0FnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMEtUdGNibHh1SUNCeVpYUjFjbTRnWld4bGJXVnVkRHRjYm4xY2JseHVMeW9xWEc0Z0tpQkJiR3h2ZDNNZ1lXNGdaV3hsYldWdWRDQjBieUJpWlNCeVpXTjVZMnhsWkNCa2RYSnBibWNnWVNCeVpXNWtaWElnWTNsamJHVXVYRzRnS2x4dUlDb2dRSEJoY21GdElHVnNaVzFsYm5SY2JpQXFJRUJ5WlhSMWNtNWNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhWdWNISnZkR1ZqZEVWc1pXMWxiblFvWld4bGJXVnVkQ2tnZTF4dUlDQmxiR1Z0Wlc1MExtTm9hV3hrVG05a1pYTXVabTl5UldGamFDaDFibkJ5YjNSbFkzUkZiR1Z0Wlc1MEtUdGNiaUFnWld4bGJXVnVkQzVoZEhSeWFXSjFkR1Z6TG1admNrVmhZMmdvY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuVnVjSEp2ZEdWamRDeGNiaUFnSUNCd2IyOXNjeTVoZEhSeWFXSjFkR1ZQWW1wbFkzUXBPMXh1WEc0Z0lIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVkVzV3Y205MFpXTjBLR1ZzWlcxbGJuUXBPMXh1WEc0Z0lISmxkSFZ5YmlCbGJHVnRaVzUwTzF4dWZWeHVYRzR2S2lwY2JpQXFJRkpsWTNsamJHVnpJR0ZzYkNCMWJuQnliM1JsWTNSbFpDQmhiR3h2WTJGMGFXOXVjeTVjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHTnNaV0Z1VFdWdGIzSjVLQ2tnZTF4dUlDQXZMeUJHY21WbElHRnNiQ0J0WlcxdmNua2dZV1owWlhJZ1pXRmphQ0JwZEdWeVlYUnBiMjR1WEc0Z0lIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQzVtY21WbFFXeHNLQ2s3WEc0Z0lIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVabkpsWlVGc2JDZ3BPMXh1WEc0Z0lDOHZJRVZ0Y0hSNUlHOTFkQ0IwYUdVZ1lHMWhhMlV1Ym05a1pYTmdJR2xtSUc5dUlHMWhhVzRnZEdoeVpXRmtMbHh1SUNCcFppQW9kSGx3Wlc5bUlHMWhhMlZPYjJSbElDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUdadmNpQW9iR1YwSUhWMWFXUWdhVzRnYldGclpVNXZaR1V1Ym05a1pYTXBJSHRjYmlBZ0lDQWdJQzh2SUVsbUlIUm9hWE1nYVhNZ2JtOTBJR0VnY0hKdmRHVmpkR1ZrSUhWMWFXUXNJSEpsYlc5MlpTQnBkQzVjYmlBZ0lDQWdJR2xtSUNnaGNHOXZiSE11Wld4bGJXVnVkRTlpYW1WamRDNWZkWFZwWkZ0MWRXbGtYU2tnZTF4dUlDQWdJQ0FnSUNCa1pXeGxkR1VnYldGclpVNXZaR1V1Ym05a1pYTmJkWFZwWkYwN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlYRzU5WEc0aVhYMD0iLCIvLyBDb2RlIGJhc2VkIG9mZiBvZjpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2hpMDA5L25vZGUtZmFzdC1odG1sLXBhcnNlclxuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5wYXJzZUhUTUwgPSBwYXJzZUhUTUw7XG5leHBvcnRzLm1ha2VQYXJzZXIgPSBtYWtlUGFyc2VyO1xuXG52YXIgX3Bvb2xzMiA9IHJlcXVpcmUoJy4vcG9vbHMnKTtcblxudmFyIHBvb2xzID0gX3Bvb2xzMi5wb29scztcbnZhciBwYXJzZXIgPSBtYWtlUGFyc2VyKCk7XG5cbi8qKlxuICogcGFyc2VIVE1MXG4gKlxuICogQHBhcmFtIG5ld0hUTUxcbiAqIEByZXR1cm5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhUTUwobmV3SFRNTCwgaXNJbm5lcikge1xuICB2YXIgZG9jdW1lbnRFbGVtZW50ID0gcGFyc2VyLnBhcnNlKG5ld0hUTUwpO1xuICB2YXIgbm9kZXMgPSBkb2N1bWVudEVsZW1lbnQuY2hpbGROb2RlcztcblxuICByZXR1cm4gaXNJbm5lciA/IG5vZGVzIDogbm9kZXNbMF07XG59XG5cbmZ1bmN0aW9uIG1ha2VQYXJzZXIoKSB7XG4gIHZhciBrTWFya3VwUGF0dGVybiA9IC88IS0tW15dKj8oPz0tLT4pLS0+fDwoXFwvPykoW2EtelxcLV1bYS16MC05XFwtXSopXFxzKihbXj5dKj8pKFxcLz8pPi9pZztcblxuICB2YXIga0F0dHJpYnV0ZVBhdHRlcm4gPSAvXFxiKGlkfGNsYXNzKVxccyo9XFxzKihcIihbXlwiXSspXCJ8JyhbXiddKyknfChcXFMrKSkvaWc7XG5cbiAgdmFyIHJlQXR0clBhdHRlcm4gPSAvXFxiKFthLXpdW2EtejAtOVxcLV0qKVxccyo9XFxzKihcIihbXlwiXSspXCJ8JyhbXiddKyknfChcXFMrKSkvaWc7XG5cbiAgdmFyIGtCbG9ja0VsZW1lbnRzID0ge1xuICAgIGRpdjogdHJ1ZSxcbiAgICBwOiB0cnVlLFxuICAgIGxpOiB0cnVlLFxuICAgIHRkOiB0cnVlLFxuICAgIHNlY3Rpb246IHRydWUsXG4gICAgYnI6IHRydWVcbiAgfTtcblxuICB2YXIga1NlbGZDbG9zaW5nRWxlbWVudHMgPSB7XG4gICAgbWV0YTogdHJ1ZSxcbiAgICBpbWc6IHRydWUsXG4gICAgbGluazogdHJ1ZSxcbiAgICBpbnB1dDogdHJ1ZSxcbiAgICBhcmVhOiB0cnVlLFxuICAgIGJyOiB0cnVlLFxuICAgIGhyOiB0cnVlXG4gIH07XG5cbiAgdmFyIGtFbGVtZW50c0Nsb3NlZEJ5T3BlbmluZyA9IHtcbiAgICBsaToge1xuICAgICAgbGk6IHRydWVcbiAgICB9LFxuXG4gICAgcDoge1xuICAgICAgcDogdHJ1ZSwgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHRkOiB7XG4gICAgICB0ZDogdHJ1ZSwgdGg6IHRydWVcbiAgICB9LFxuXG4gICAgdGg6IHtcbiAgICAgIHRkOiB0cnVlLCB0aDogdHJ1ZVxuICAgIH1cbiAgfTtcblxuICB2YXIga0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nID0ge1xuICAgIGxpOiB7XG4gICAgICB1bDogdHJ1ZSwgb2w6IHRydWVcbiAgICB9LFxuXG4gICAgYToge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIGI6IHtcbiAgICAgIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICBpOiB7XG4gICAgICBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgcDoge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHRkOiB7XG4gICAgICB0cjogdHJ1ZSwgdGFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgdGg6IHtcbiAgICAgIHRyOiB0cnVlLCB0YWJsZTogdHJ1ZVxuICAgIH1cbiAgfTtcblxuICB2YXIga0Jsb2NrVGV4dEVsZW1lbnRzID0ge1xuICAgIHNjcmlwdDogdHJ1ZSxcbiAgICBub3NjcmlwdDogdHJ1ZSxcbiAgICBzdHlsZTogdHJ1ZSxcbiAgICBwcmU6IHRydWVcbiAgfTtcblxuICAvKipcbiAgICogVGV4dE5vZGUgdG8gY29udGFpbiBhIHRleHQgZWxlbWVudCBpbiBET00gdHJlZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGZ1bmN0aW9uIFRleHROb2RlKHZhbHVlKSB7XG4gICAgdmFyIGluc3RhbmNlID0gcG9vbHMuZWxlbWVudE9iamVjdC5nZXQoKTtcblxuICAgIGluc3RhbmNlLm5vZGVOYW1lID0gJyN0ZXh0JztcbiAgICBpbnN0YW5jZS5ub2RlVmFsdWUgPSB2YWx1ZTtcbiAgICBpbnN0YW5jZS5ub2RlVHlwZSA9IDM7XG4gICAgaW5zdGFuY2UuY2hpbGROb2Rlcy5sZW5ndGggPSAwO1xuICAgIGluc3RhbmNlLmF0dHJpYnV0ZXMubGVuZ3RoID0gMDtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIVE1MRWxlbWVudCwgd2hpY2ggY29udGFpbnMgYSBzZXQgb2YgY2hpbGRyZW4uXG4gICAqXG4gICAqIE5vdGU6IHRoaXMgaXMgYSBtaW5pbWFsaXN0IGltcGxlbWVudGF0aW9uLCBubyBjb21wbGV0ZSB0cmVlIHN0cnVjdHVyZVxuICAgKiBwcm92aWRlZCAobm8gcGFyZW50Tm9kZSwgbmV4dFNpYmxpbmcsIHByZXZpb3VzU2libGluZyBldGMpLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgbm9kZU5hbWVcbiAgICogQHBhcmFtIHtPYmplY3R9IGtleUF0dHJzIGlkIGFuZCBjbGFzcyBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHJhd0F0dHJzIGF0dHJpYnV0ZXMgaW4gc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiBIVE1MRWxlbWVudChuYW1lLCBrZXlBdHRycywgcmF3QXR0cnMpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBwb29scy5lbGVtZW50T2JqZWN0LmdldCgpO1xuXG4gICAgaW5zdGFuY2Uubm9kZU5hbWUgPSBuYW1lO1xuICAgIGluc3RhbmNlLm5vZGVWYWx1ZSA9ICcnO1xuICAgIGluc3RhbmNlLm5vZGVUeXBlID0gMTtcbiAgICBpbnN0YW5jZS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gICAgaW5zdGFuY2UuYXR0cmlidXRlcy5sZW5ndGggPSAwO1xuXG4gICAgaWYgKHJhd0F0dHJzKSB7XG4gICAgICBmb3IgKHZhciBtYXRjaCA9IHVuZGVmaW5lZDsgbWF0Y2ggPSByZUF0dHJQYXR0ZXJuLmV4ZWMocmF3QXR0cnMpOykge1xuICAgICAgICB2YXIgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcblxuICAgICAgICBhdHRyLm5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdO1xuXG4gICAgICAgIGluc3RhbmNlLmF0dHJpYnV0ZXNbaW5zdGFuY2UuYXR0cmlidXRlcy5sZW5ndGhdID0gYXR0cjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIEhUTUwgYW5kIHJldHVybnMgYSByb290IGVsZW1lbnRcbiAgICovXG4gIHZhciBodG1sUGFyc2VyID0ge1xuICAgIC8qKlxuICAgICAqIFBhcnNlIGEgY2h1Y2sgb2YgSFRNTCBzb3VyY2UuXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBkYXRhICAgICAgaHRtbFxuICAgICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgIHJvb3QgZWxlbWVudFxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbiBwYXJzZShkYXRhLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcm9vdE9iamVjdCA9IHt9O1xuICAgICAgdmFyIHJvb3QgPSBIVE1MRWxlbWVudChudWxsLCByb290T2JqZWN0KTtcbiAgICAgIHZhciBjdXJyZW50UGFyZW50ID0gcm9vdDtcbiAgICAgIHZhciBzdGFjayA9IFtyb290XTtcbiAgICAgIHZhciBsYXN0VGV4dFBvcyA9IC0xO1xuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaWYgKGRhdGEuaW5kZXhPZignPCcpID09PSAtMSAmJiBkYXRhKSB7XG4gICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoXSA9IFRleHROb2RlKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiByb290O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBtYXRjaCA9IHVuZGVmaW5lZCwgdGV4dCA9IHVuZGVmaW5lZDsgbWF0Y2ggPSBrTWFya3VwUGF0dGVybi5leGVjKGRhdGEpOykge1xuICAgICAgICBpZiAobGFzdFRleHRQb3MgPiAtMSkge1xuICAgICAgICAgIGlmIChsYXN0VGV4dFBvcyArIG1hdGNoWzBdLmxlbmd0aCA8IGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCkge1xuICAgICAgICAgICAgLy8gaWYgaGFzIGNvbnRlbnRcbiAgICAgICAgICAgIHRleHQgPSBkYXRhLnNsaWNlKGxhc3RUZXh0UG9zLCBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXggLSBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZiAodGV4dC50cmltKCkpIHtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzW2N1cnJlbnRQYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGhdID0gVGV4dE5vZGUodGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXg7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBhIGNvbW1lbnQuXG4gICAgICAgIGlmIChtYXRjaFswXVsxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5sb3dlckNhc2VUYWdOYW1lKSB7XG4gICAgICAgICAgbWF0Y2hbMl0gPSBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXRjaFsxXSkge1xuICAgICAgICAgIC8vIG5vdCA8LyB0YWdzXG4gICAgICAgICAgdmFyIGF0dHJzID0ge307XG5cbiAgICAgICAgICBmb3IgKHZhciBhdHRNYXRjaCA9IHVuZGVmaW5lZDsgYXR0TWF0Y2ggPSBrQXR0cmlidXRlUGF0dGVybi5leGVjKG1hdGNoWzNdKTspIHtcbiAgICAgICAgICAgIGF0dHJzW2F0dE1hdGNoWzFdXSA9IGF0dE1hdGNoWzNdIHx8IGF0dE1hdGNoWzRdIHx8IGF0dE1hdGNoWzVdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbWF0Y2hbNF0gJiYga0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdKSB7XG4gICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50LmNoaWxkTm9kZXNbY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLnB1c2goSFRNTEVsZW1lbnQobWF0Y2hbMl0sIGF0dHJzLCBtYXRjaFszXSkpIC0gMV07XG5cbiAgICAgICAgICBzdGFjay5wdXNoKGN1cnJlbnRQYXJlbnQpO1xuXG4gICAgICAgICAgaWYgKGtCbG9ja1RleHRFbGVtZW50c1ttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgIC8vIGEgbGl0dGxlIHRlc3QgdG8gZmluZCBuZXh0IDwvc2NyaXB0PiBvciA8L3N0eWxlPiAuLi5cbiAgICAgICAgICAgIHZhciBjbG9zZU1hcmt1cCA9ICc8LycgKyBtYXRjaFsyXSArICc+JztcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGRhdGEuaW5kZXhPZihjbG9zZU1hcmt1cCwga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnNbbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIHRoZXJlIGlzIG5vIG1hdGNoaW5nIGVuZGluZyBmb3IgdGhlIHRleHQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICB0ZXh0ID0gZGF0YS5zbGljZShrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRleHQgPSBkYXRhLnNsaWNlKGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCwgaW5kZXgpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoXSA9IFRleHROb2RlKHRleHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXggPSBkYXRhLmxlbmd0aCArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50Lm5vZGVWYWx1ZSA9IGRhdGEuc2xpY2Uoa01hcmt1cFBhdHRlcm4ubGFzdEluZGV4LCBpbmRleCk7XG4gICAgICAgICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4ID0gaW5kZXggKyBjbG9zZU1hcmt1cC5sZW5ndGg7XG4gICAgICAgICAgICAgIG1hdGNoWzFdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzFdIHx8IG1hdGNoWzRdIHx8IGtTZWxmQ2xvc2luZ0VsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgIC8vIDwvIG9yIC8+IG9yIDxicj4gZXRjLlxuICAgICAgICAgIHdoaWxlICh0cnVlICYmIGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFyZW50Lm5vZGVOYW1lID09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBUcnlpbmcgdG8gY2xvc2UgY3VycmVudCB0YWcsIGFuZCBtb3ZlIG9uXG4gICAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeUNsb3NpbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFVzZSBhZ2dyZXNzaXZlIHN0cmF0ZWd5IHRvIGhhbmRsZSB1bm1hdGNoaW5nIG1hcmt1cHMuXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGh0bWxQYXJzZXI7XG59XG5cbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmNHRnljMlZ5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN08zTkNRVWRuUXl4VFFVRlRPenRCUVVWNlF5eEpRVUZKTEV0QlFVc3NaMEpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEUxQlFVMHNSMEZCUnl4VlFVRlZMRVZCUVVVc1EwRkJRenM3T3pzN096czdPMEZCVVc1Q0xGTkJRVk1zVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRNVU1zVFVGQlNTeGxRVUZsTEVkQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU0xUXl4TlFVRkpMRXRCUVVzc1IwRkJSeXhsUVVGbExFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVjJReXhUUVVGUExFOUJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wTkJRMjVET3p0QlFVVk5MRk5CUVZNc1ZVRkJWU3hIUVVGSE8wRkJRek5DTEUxQlFVa3NZMEZCWXl4SFFVTm9RaXh0UlVGQmJVVXNRMEZCUXpzN1FVRkZkRVVzVFVGQlNTeHBRa0ZCYVVJc1IwRkJSeXhyUkVGQmEwUXNRMEZCUXpzN1FVRkZNMFVzVFVGQlNTeGhRVUZoTEVkQlEyWXNNRVJCUVRCRUxFTkJRVU03TzBGQlJUZEVMRTFCUVVrc1kwRkJZeXhIUVVGSE8wRkJRMjVDTEU5QlFVY3NSVUZCUlN4SlFVRkpPMEZCUTFRc1MwRkJReXhGUVVGRkxFbEJRVWs3UVVGRFVDeE5RVUZGTEVWQlFVVXNTVUZCU1R0QlFVTlNMRTFCUVVVc1JVRkJSU3hKUVVGSk8wRkJRMUlzVjBGQlR5eEZRVUZGTEVsQlFVazdRVUZEWWl4TlFVRkZMRVZCUVVVc1NVRkJTVHRIUVVOVUxFTkJRVU03TzBGQlJVWXNUVUZCU1N4dlFrRkJiMElzUjBGQlJ6dEJRVU42UWl4UlFVRkpMRVZCUVVVc1NVRkJTVHRCUVVOV0xFOUJRVWNzUlVGQlJTeEpRVUZKTzBGQlExUXNVVUZCU1N4RlFVRkZMRWxCUVVrN1FVRkRWaXhUUVVGTExFVkJRVVVzU1VGQlNUdEJRVU5ZTEZGQlFVa3NSVUZCUlN4SlFVRkpPMEZCUTFZc1RVRkJSU3hGUVVGRkxFbEJRVWs3UVVGRFVpeE5RVUZGTEVWQlFVVXNTVUZCU1R0SFFVTlVMRU5CUVVNN08wRkJSVVlzVFVGQlNTeDNRa0ZCZDBJc1IwRkJSenRCUVVNM1FpeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTVHRMUVVOVU96dEJRVVZFTEV0QlFVTXNSVUZCUlR0QlFVTkVMRTlCUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEVsQlFVazdTMEZEYmtJN08wRkJSVVFzVFVGQlJTeEZRVUZGTzBGQlEwWXNVVUZCUlN4RlFVRkZMRWxCUVVrc1JVRkJSU3hGUVVGRkxFVkJRVVVzU1VGQlNUdExRVU51UWpzN1FVRkZSQ3hOUVVGRkxFVkJRVVU3UVVGRFJpeFJRVUZGTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVc1JVRkJSU3hKUVVGSk8wdEJRMjVDTzBkQlEwWXNRMEZCUXpzN1FVRkZSaXhOUVVGSkxIZENRVUYzUWl4SFFVRkhPMEZCUXpkQ0xFMUJRVVVzUlVGQlJUdEJRVU5HTEZGQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1JVRkJSU3hGUVVGRkxFbEJRVWs3UzBGRGJrSTdPMEZCUlVRc1MwRkJReXhGUVVGRk8wRkJRMFFzVTBGQlJ5eEZRVUZGTEVsQlFVazdTMEZEVmpzN1FVRkZSQ3hMUVVGRExFVkJRVVU3UVVGRFJDeFRRVUZITEVWQlFVVXNTVUZCU1R0TFFVTldPenRCUVVWRUxFdEJRVU1zUlVGQlJUdEJRVU5FTEZOQlFVY3NSVUZCUlN4SlFVRkpPMHRCUTFZN08wRkJSVVFzUzBGQlF5eEZRVUZGTzBGQlEwUXNVMEZCUnl4RlFVRkZMRWxCUVVrN1MwRkRWanM3UVVGRlJDeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEpRVUZKTzB0QlEzUkNPenRCUVVWRUxFMUJRVVVzUlVGQlJUdEJRVU5HTEZGQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1MwRkJTeXhGUVVGRkxFbEJRVWs3UzBGRGRFSTdSMEZEUml4RFFVRkRPenRCUVVWR0xFMUJRVWtzYTBKQlFXdENMRWRCUVVjN1FVRkRka0lzVlVGQlRTeEZRVUZGTEVsQlFVazdRVUZEV2l4WlFVRlJMRVZCUVVVc1NVRkJTVHRCUVVOa0xGTkJRVXNzUlVGQlJTeEpRVUZKTzBGQlExZ3NUMEZCUnl4RlFVRkZMRWxCUVVrN1IwRkRWaXhEUVVGRE96czdPenM3UVVGTlJpeFhRVUZUTEZGQlFWRXNRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRka0lzVVVGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMR0ZCUVdFc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6czdRVUZGZWtNc1dVRkJVU3hEUVVGRExGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTTdRVUZETlVJc1dVRkJVU3hEUVVGRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZETTBJc1dVRkJVU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEZEVJc1dVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXk5Q0xGbEJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenM3UVVGRkwwSXNWMEZCVHl4UlFVRlJMRU5CUVVNN1IwRkRha0k3T3pzN096czdPenM3T3p0QlFWbEVMRmRCUVZNc1YwRkJWeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUXpkRExGRkJRVWtzVVVGQlVTeEhRVUZITEV0QlFVc3NRMEZCUXl4aFFVRmhMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYcERMRmxCUVZFc1EwRkJReXhSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzcENMRmxCUVZFc1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzaENMRmxCUVZFc1EwRkJReXhSUVVGUkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzUkNMRmxCUVZFc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhaUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSUzlDTEZGQlFVa3NVVUZCVVN4RlFVRkZPMEZCUTFvc1YwRkJTeXhKUVVGSkxFdEJRVXNzV1VGQlFTeEZRVUZGTEV0QlFVc3NSMEZCUnl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZKTzBGQlEzUkVMRmxCUVVrc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNN08wRkJSWFpETEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkNMRmxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGxETEdkQ1FVRlJMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wOUJRM2hFTzB0QlEwWTdPMEZCUlVRc1YwRkJUeXhSUVVGUkxFTkJRVU03UjBGRGFrSTdPenM3TzBGQlMwUXNUVUZCU1N4VlFVRlZMRWRCUVVjN096czdPenRCUVUxbUxGTkJRVXNzUlVGQlJTeGxRVUZUTEVsQlFVa3NSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkROMElzVlVGQlNTeFZRVUZWTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNCQ0xGVkJRVWtzU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGVrTXNWVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM3BDTEZWQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGJrSXNWVUZCU1N4WFFVRlhMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYSkNMR0ZCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZET3p0QlFVVjRRaXhWUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzU1VGQlNTeEZRVUZGTzBGQlEzQkRMSEZDUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVVelJTeGxRVUZQTEVsQlFVa3NRMEZCUXp0UFFVTmlPenRCUVVWRUxGZEJRVXNzU1VGQlNTeExRVUZMTEZsQlFVRXNSVUZCUlN4SlFVRkpMRmxCUVVFc1JVRkJSU3hMUVVGTExFZEJRVWNzWTBGQll5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJTVHRCUVVONlJDeFpRVUZKTEZkQlFWY3NSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVOd1FpeGpRVUZKTEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEdOQlFXTXNRMEZCUXl4VFFVRlRMRVZCUVVVN08wRkJSVFZFTEdkQ1FVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVWQlFVVXNZMEZCWXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN08wRkJSVE5GTEdkQ1FVRkpMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJUdEJRVU5tTERKQ1FVRmhMRU5CUVVNc1ZVRkJWU3hEUVVGRExHRkJRV0VzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJGQlF6VkZPMWRCUTBZN1UwRkRSanM3UVVGRlJDeHRRa0ZCVnl4SFFVRkhMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU03T3p0QlFVZDJReXhaUVVGSkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhIUVVGSExFVkJRVVU3UVVGRGRrSXNiVUpCUVZNN1UwRkRWanM3UVVGRlJDeFpRVUZKTEU5QlFVOHNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU0xUWl4bFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8xTkJRMjVET3p0QlFVVkVMRmxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdPMEZCUldJc1kwRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZET3p0QlFVVm1MR1ZCUVVzc1NVRkJTU3hSUVVGUkxGbEJRVUVzUlVGQlJTeFJRVUZSTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSk8wRkJRMmhGTEdsQ1FVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VjBGRGFFVTdPMEZCUlVRc1kwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4M1FrRkJkMElzUTBGQlF5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVN1FVRkRha1VzWjBKQlFVa3NkMEpCUVhkQ0xFTkJRVU1zWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlF6bEVMRzFDUVVGTExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEV2l3eVFrRkJZU3hIUVVGSExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRM3BETzFkQlEwWTdPMEZCUlVRc2RVSkJRV0VzUjBGQlJ5eGhRVUZoTEVOQlFVTXNWVUZCVlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVU5zUlN4WFFVRlhMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWcVJDeGxRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4alFVRkpMR3RDUVVGclFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk96dEJRVVZvUXl4blFrRkJTU3hYUVVGWExFZEJRVWNzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU03UVVGRGVFTXNaMEpCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RlFVRkZMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6czdRVUZGYUVVc1owSkJRVWtzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRM0pDTEd0Q1FVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExFTkJRVU1zUlVGQlJUczdRVUZGWml4dlFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8yVkJRemRETEUxQlEwazdRVUZEU0N4dlFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dGxRVU53UkRzN1FVRkZSQ3hyUWtGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOdVFpdzJRa0ZCWVN4RFFVRkRMRlZCUVZVc1EwRkJReXhoUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dGxRVU0xUlR0aFFVTkdPMEZCUTBRc1owSkJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTJZc2VVSkJRVmNzUjBGQlJ5eGpRVUZqTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzJGQlF6RkVMRTFCUTBrN1FVRkRTQ3d5UWtGQllTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHTkJRV01zUTBGQlF5eFRRVUZUTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRkRVVzZVVKQlFWY3NSMEZCUnl4alFVRmpMRU5CUVVNc1UwRkJVeXhIUVVGSExFdEJRVXNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNCRkxHMUNRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8yRkJSV3BDTzFkQlEwWTdVMEZEUmp0QlFVTkVMRmxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3h2UWtGQmIwSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUczdRVUZGTVVRc2FVSkJRVThzU1VGQlNTeEpRVUZKTEdGQlFXRXNSVUZCUlR0QlFVTTFRaXhuUWtGQlNTeGhRVUZoTEVOQlFVTXNVVUZCVVN4SlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUdEJRVU4wUXl4dFFrRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlExb3NNa0pCUVdFc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmVFTXNiMEpCUVUwN1lVRkRVQ3hOUVVOSk96dEJRVVZJTEd0Q1FVRkpMSGRDUVVGM1FpeERRVUZETEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJSVHRCUVVOd1JDeHZRa0ZCU1N4M1FrRkJkMElzUTBGQlF5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdRVUZET1VRc2RVSkJRVXNzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTmFMQ3RDUVVGaExFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYaERMREpDUVVGVE8ybENRVU5XTzJWQlEwWTdPenRCUVVkRUxHOUNRVUZOTzJGQlExQTdWMEZEUmp0VFFVTkdPMDlCUTBZN08wRkJSVVFzWVVGQlR5eEpRVUZKTEVOQlFVTTdTMEZEWWp0SFFVTkdMRU5CUVVNN08wRkJSVVlzVTBGQlR5eFZRVUZWTEVOQlFVTTdRMEZEYmtJN08wRkJRVUVzUTBGQlF5SXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOTFkR2xzTDNCaGNuTmxjaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRU52WkdVZ1ltRnpaV1FnYjJabUlHOW1PbHh1THk4Z2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwyRnphR2t3TURrdmJtOWtaUzFtWVhOMExXaDBiV3d0Y0dGeWMyVnlYRzVjYm1sdGNHOXlkQ0I3SUhCdmIyeHpJR0Z6SUY5d2IyOXNjeUI5SUdaeWIyMGdKeTR2Y0c5dmJITW5PMXh1WEc1MllYSWdjRzl2YkhNZ1BTQmZjRzl2YkhNN1hHNTJZWElnY0dGeWMyVnlJRDBnYldGclpWQmhjbk5sY2lncE8xeHVYRzR2S2lwY2JpQXFJSEJoY25ObFNGUk5URnh1SUNwY2JpQXFJRUJ3WVhKaGJTQnVaWGRJVkUxTVhHNGdLaUJBY21WMGRYSnVYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCd1lYSnpaVWhVVFV3b2JtVjNTRlJOVEN3Z2FYTkpibTVsY2lrZ2UxeHVJQ0JzWlhRZ1pHOWpkVzFsYm5SRmJHVnRaVzUwSUQwZ2NHRnljMlZ5TG5CaGNuTmxLRzVsZDBoVVRVd3BPMXh1SUNCc1pYUWdibTlrWlhNZ1BTQmtiMk4xYldWdWRFVnNaVzFsYm5RdVkyaHBiR1JPYjJSbGN6dGNibHh1SUNCeVpYUjFjbTRnYVhOSmJtNWxjaUEvSUc1dlpHVnpJRG9nYm05a1pYTmJNRjA3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnRZV3RsVUdGeWMyVnlLQ2tnZTF4dUlDQnNaWFFnYTAxaGNtdDFjRkJoZEhSbGNtNGdQVnh1SUNBZ0lDODhJUzB0VzE1ZEtqOG9QejB0TFQ0cExTMCtmRHdvWEZ3dlB5a29XMkV0ZWx4Y0xWMWJZUzE2TUMwNVhGd3RYU29wWEZ4ektpaGJYajVkS2o4cEtGeGNMejhwUGk5cFp6dGNibHh1SUNCc1pYUWdhMEYwZEhKcFluVjBaVkJoZEhSbGNtNGdQU0F2WEZ4aUtHbGtmR05zWVhOektWeGNjeW85WEZ4ektpaGNJaWhiWGx3aVhTc3BYQ0o4SnloYlhpZGRLeWtuZkNoY1hGTXJLU2t2YVdjN1hHNWNiaUFnYkdWMElISmxRWFIwY2xCaGRIUmxjbTRnUFZ4dUlDQWdJQzljWEdJb1cyRXRlbDFiWVMxNk1DMDVYRnd0WFNvcFhGeHpLajFjWEhNcUtGd2lLRnRlWENKZEt5bGNJbnduS0Z0ZUoxMHJLU2Q4S0Z4Y1V5c3BLUzlwWnp0Y2JseHVJQ0JzWlhRZ2EwSnNiMk5yUld4bGJXVnVkSE1nUFNCN1hHNGdJQ0FnWkdsMk9pQjBjblZsTEZ4dUlDQWdJSEE2SUhSeWRXVXNYRzRnSUNBZ2JHazZJSFJ5ZFdVc1hHNGdJQ0FnZEdRNklIUnlkV1VzWEc0Z0lDQWdjMlZqZEdsdmJqb2dkSEoxWlN4Y2JpQWdJQ0JpY2pvZ2RISjFaVnh1SUNCOU8xeHVYRzRnSUd4bGRDQnJVMlZzWmtOc2IzTnBibWRGYkdWdFpXNTBjeUE5SUh0Y2JpQWdJQ0J0WlhSaE9pQjBjblZsTEZ4dUlDQWdJR2x0WnpvZ2RISjFaU3hjYmlBZ0lDQnNhVzVyT2lCMGNuVmxMRnh1SUNBZ0lHbHVjSFYwT2lCMGNuVmxMRnh1SUNBZ0lHRnlaV0U2SUhSeWRXVXNYRzRnSUNBZ1luSTZJSFJ5ZFdVc1hHNGdJQ0FnYUhJNklIUnlkV1ZjYmlBZ2ZUdGNibHh1SUNCc1pYUWdhMFZzWlcxbGJuUnpRMnh2YzJWa1FubFBjR1Z1YVc1bklEMGdlMXh1SUNBZ0lHeHBPaUI3WEc0Z0lDQWdJQ0JzYVRvZ2RISjFaVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQndPaUI3WEc0Z0lDQWdJQ0J3T2lCMGNuVmxMQ0JrYVhZNklIUnlkV1ZjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdkR1E2SUh0Y2JpQWdJQ0FnSUhSa09pQjBjblZsTENCMGFEb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0IwYURvZ2UxeHVJQ0FnSUNBZ2RHUTZJSFJ5ZFdVc0lIUm9PaUIwY25WbFhHNGdJQ0FnZlZ4dUlDQjlPMXh1WEc0Z0lHeGxkQ0JyUld4bGJXVnVkSE5EYkc5elpXUkNlVU5zYjNOcGJtY2dQU0I3WEc0Z0lDQWdiR2s2SUh0Y2JpQWdJQ0FnSUhWc09pQjBjblZsTENCdmJEb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0JoT2lCN1hHNGdJQ0FnSUNCa2FYWTZJSFJ5ZFdWY2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnWWpvZ2UxeHVJQ0FnSUNBZ1pHbDJPaUIwY25WbFhHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdrNklIdGNiaUFnSUNBZ0lHUnBkam9nZEhKMVpWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCd09pQjdYRzRnSUNBZ0lDQmthWFk2SUhSeWRXVmNiaUFnSUNCOUxGeHVYRzRnSUNBZ2RHUTZJSHRjYmlBZ0lDQWdJSFJ5T2lCMGNuVmxMQ0IwWVdKc1pUb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0IwYURvZ2UxeHVJQ0FnSUNBZ2RISTZJSFJ5ZFdVc0lIUmhZbXhsT2lCMGNuVmxYRzRnSUNBZ2ZWeHVJQ0I5TzF4dVhHNGdJR3hsZENCclFteHZZMnRVWlhoMFJXeGxiV1Z1ZEhNZ1BTQjdYRzRnSUNBZ2MyTnlhWEIwT2lCMGNuVmxMRnh1SUNBZ0lHNXZjMk55YVhCME9pQjBjblZsTEZ4dUlDQWdJSE4wZVd4bE9pQjBjblZsTEZ4dUlDQWdJSEJ5WlRvZ2RISjFaVnh1SUNCOU8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCVVpYaDBUbTlrWlNCMGJ5QmpiMjUwWVdsdUlHRWdkR1Y0ZENCbGJHVnRaVzUwSUdsdUlFUlBUU0IwY21WbExseHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnZG1Gc2RXVWdXMlJsYzJOeWFYQjBhVzl1WFZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1ZHVjRkRTV2WkdVb2RtRnNkV1VwSUh0Y2JpQWdJQ0JzWlhRZ2FXNXpkR0Z1WTJVZ1BTQndiMjlzY3k1bGJHVnRaVzUwVDJKcVpXTjBMbWRsZENncE8xeHVYRzRnSUNBZ2FXNXpkR0Z1WTJVdWJtOWtaVTVoYldVZ1BTQW5JM1JsZUhRbk8xeHVJQ0FnSUdsdWMzUmhibU5sTG01dlpHVldZV3gxWlNBOUlIWmhiSFZsTzF4dUlDQWdJR2x1YzNSaGJtTmxMbTV2WkdWVWVYQmxJRDBnTXp0Y2JpQWdJQ0JwYm5OMFlXNWpaUzVqYUdsc1pFNXZaR1Z6TG14bGJtZDBhQ0E5SURBN1hHNGdJQ0FnYVc1emRHRnVZMlV1WVhSMGNtbGlkWFJsY3k1c1pXNW5kR2dnUFNBd08xeHVYRzRnSUNBZ2NtVjBkWEp1SUdsdWMzUmhibU5sTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFaFVUVXhGYkdWdFpXNTBMQ0IzYUdsamFDQmpiMjUwWVdsdWN5QmhJSE5sZENCdlppQmphR2xzWkhKbGJpNWNiaUFnSUNwY2JpQWdJQ29nVG05MFpUb2dkR2hwY3lCcGN5QmhJRzFwYm1sdFlXeHBjM1FnYVcxd2JHVnRaVzUwWVhScGIyNHNJRzV2SUdOdmJYQnNaWFJsSUhSeVpXVWdjM1J5ZFdOMGRYSmxYRzRnSUNBcUlIQnliM1pwWkdWa0lDaHVieUJ3WVhKbGJuUk9iMlJsTENCdVpYaDBVMmxpYkdsdVp5d2djSEpsZG1sdmRYTlRhV0pzYVc1bklHVjBZeWt1WEc0Z0lDQXFYRzRnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCdVlXMWxJQ0FnSUNCdWIyUmxUbUZ0WlZ4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdhMlY1UVhSMGNuTWdhV1FnWVc1a0lHTnNZWE56SUdGMGRISnBZblYwWlZ4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdjbUYzUVhSMGNuTWdZWFIwY21saWRYUmxjeUJwYmlCemRISnBibWRjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUVoVVRVeEZiR1Z0Wlc1MEtHNWhiV1VzSUd0bGVVRjBkSEp6TENCeVlYZEJkSFJ5Y3lrZ2UxeHVJQ0FnSUd4bGRDQnBibk4wWVc1alpTQTlJSEJ2YjJ4ekxtVnNaVzFsYm5SUFltcGxZM1F1WjJWMEtDazdYRzVjYmlBZ0lDQnBibk4wWVc1alpTNXViMlJsVG1GdFpTQTlJRzVoYldVN1hHNGdJQ0FnYVc1emRHRnVZMlV1Ym05a1pWWmhiSFZsSUQwZ0p5YzdYRzRnSUNBZ2FXNXpkR0Z1WTJVdWJtOWtaVlI1Y0dVZ1BTQXhPMXh1SUNBZ0lHbHVjM1JoYm1ObExtTm9hV3hrVG05a1pYTXViR1Z1WjNSb0lEMGdNRHRjYmlBZ0lDQnBibk4wWVc1alpTNWhkSFJ5YVdKMWRHVnpMbXhsYm1kMGFDQTlJREE3WEc1Y2JpQWdJQ0JwWmlBb2NtRjNRWFIwY25NcElIdGNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHMWhkR05vT3lCdFlYUmphQ0E5SUhKbFFYUjBjbEJoZEhSbGNtNHVaWGhsWXloeVlYZEJkSFJ5Y3lrN0lDa2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ1lYUjBjaUE5SUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDNW5aWFFvS1R0Y2JseHVJQ0FnSUNBZ0lDQmhkSFJ5TG01aGJXVWdQU0J0WVhSamFGc3hYVHRjYmlBZ0lDQWdJQ0FnWVhSMGNpNTJZV3gxWlNBOUlHMWhkR05vV3pOZElIeDhJRzFoZEdOb1d6UmRJSHg4SUcxaGRHTm9XelZkTzF4dVhHNGdJQ0FnSUNBZ0lHbHVjM1JoYm1ObExtRjBkSEpwWW5WMFpYTmJhVzV6ZEdGdVkyVXVZWFIwY21saWRYUmxjeTVzWlc1bmRHaGRJRDBnWVhSMGNqdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnYVc1emRHRnVZMlU3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1VHRnljMlZ6SUVoVVRVd2dZVzVrSUhKbGRIVnlibk1nWVNCeWIyOTBJR1ZzWlcxbGJuUmNiaUFnSUNvdlhHNGdJR3hsZENCb2RHMXNVR0Z5YzJWeUlEMGdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkJoY25ObElHRWdZMmgxWTJzZ2IyWWdTRlJOVENCemIzVnlZMlV1WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3YzNSeWFXNW5mU0JrWVhSaElDQWdJQ0FnYUhSdGJGeHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UwaFVUVXhGYkdWdFpXNTBmU0FnSUNBZ0lISnZiM1FnWld4bGJXVnVkRnh1SUNBZ0lDQXFMMXh1SUNBZ0lIQmhjbk5sT2lCbWRXNWpkR2x2Ymloa1lYUmhMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0JzWlhRZ2NtOXZkRTlpYW1WamRDQTlJSHQ5TzF4dUlDQWdJQ0FnYkdWMElISnZiM1FnUFNCSVZFMU1SV3hsYldWdWRDaHVkV3hzTENCeWIyOTBUMkpxWldOMEtUdGNiaUFnSUNBZ0lHeGxkQ0JqZFhKeVpXNTBVR0Z5Wlc1MElEMGdjbTl2ZER0Y2JpQWdJQ0FnSUd4bGRDQnpkR0ZqYXlBOUlGdHliMjkwWFR0Y2JpQWdJQ0FnSUd4bGRDQnNZWE4wVkdWNGRGQnZjeUE5SUMweE8xeHVYRzRnSUNBZ0lDQnZjSFJwYjI1eklEMGdiM0IwYVc5dWN5QjhmQ0I3ZlR0Y2JseHVJQ0FnSUNBZ2FXWWdLR1JoZEdFdWFXNWtaWGhQWmlnblBDY3BJRDA5UFNBdE1TQW1KaUJrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJR04xY25KbGJuUlFZWEpsYm5RdVkyaHBiR1JPYjJSbGMxdGpkWEp5Wlc1MFVHRnlaVzUwTG1Ob2FXeGtUbTlrWlhNdWJHVnVaM1JvWFNBOUlGUmxlSFJPYjJSbEtHUmhkR0VwTzF4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCeWIyOTBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JtYjNJZ0tHeGxkQ0J0WVhSamFDd2dkR1Y0ZERzZ2JXRjBZMmdnUFNCclRXRnlhM1Z3VUdGMGRHVnliaTVsZUdWaktHUmhkR0VwT3lBcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0d4aGMzUlVaWGgwVUc5eklENGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYkdGemRGUmxlSFJRYjNNZ0t5QnRZWFJqYUZzd1hTNXNaVzVuZEdnZ1BDQnJUV0Z5YTNWd1VHRjBkR1Z5Ymk1c1lYTjBTVzVrWlhncElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklHbG1JR2hoY3lCamIyNTBaVzUwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBaWGgwSUQwZ1pHRjBZUzV6YkdsalpTaHNZWE4wVkdWNGRGQnZjeXdnYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRJQzBnYldGMFkyaGJNRjB1YkdWdVozUm9LVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSbGVIUXVkSEpwYlNncEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHTjFjbkpsYm5SUVlYSmxiblF1WTJocGJHUk9iMlJsYzF0amRYSnlaVzUwVUdGeVpXNTBMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9YU0E5SUZSbGVIUk9iMlJsS0hSbGVIUXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHeGhjM1JVWlhoMFVHOXpJRDBnYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRPMXh1WEc0Z0lDQWdJQ0FnSUM4dklGUm9hWE1nYVhNZ1lTQmpiMjF0Wlc1MExseHVJQ0FnSUNBZ0lDQnBaaUFvYldGMFkyaGJNRjFiTVYwZ1BUMDlJQ2NoSnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5ScGJuVmxPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTXViRzkzWlhKRFlYTmxWR0ZuVG1GdFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUcxaGRHTm9XekpkSUQwZ2JXRjBZMmhiTWwwdWRHOU1iM2RsY2tOaGMyVW9LVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doYldGMFkyaGJNVjBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQXZMeUJ1YjNRZ1BDOGdkR0ZuYzF4dUlDQWdJQ0FnSUNBZ0lHeGxkQ0JoZEhSeWN5QTlJSHQ5TzF4dVhHNGdJQ0FnSUNBZ0lDQWdabTl5SUNoc1pYUWdZWFIwVFdGMFkyZzdJR0YwZEUxaGRHTm9JRDBnYTBGMGRISnBZblYwWlZCaGRIUmxjbTR1WlhobFl5aHRZWFJqYUZzelhTazdJQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZWFIwY25OYllYUjBUV0YwWTJoYk1WMWRJRDBnWVhSMFRXRjBZMmhiTTEwZ2ZId2dZWFIwVFdGMFkyaGJORjBnZkh3Z1lYUjBUV0YwWTJoYk5WMDdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0NGdFlYUmphRnMwWFNBbUppQnJSV3hsYldWdWRITkRiRzl6WldSQ2VVOXdaVzVwYm1kYlkzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFRtRnRaVjBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoclJXeGxiV1Z1ZEhORGJHOXpaV1JDZVU5d1pXNXBibWRiWTNWeWNtVnVkRkJoY21WdWRDNXViMlJsVG1GdFpWMWJiV0YwWTJoYk1sMWRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSE4wWVdOckxuQnZjQ2dwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JqZFhKeVpXNTBVR0Z5Wlc1MElEMGdjM1JoWTJ0YmMzUmhZMnN1YkdWdVozUm9JQzBnTVYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnWTNWeWNtVnVkRkJoY21WdWRDQTlJR04xY25KbGJuUlFZWEpsYm5RdVkyaHBiR1JPYjJSbGMxdGpkWEp5Wlc1MFVHRnlaVzUwTG1Ob2FXeGtUbTlrWlhNdWNIVnphQ2hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdTRlJOVEVWc1pXMWxiblFvYldGMFkyaGJNbDBzSUdGMGRISnpMQ0J0WVhSamFGc3pYU2twSUMwZ01WMDdYRzVjYmlBZ0lDQWdJQ0FnSUNCemRHRmpheTV3ZFhOb0tHTjFjbkpsYm5SUVlYSmxiblFwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0d0Q2JHOWphMVJsZUhSRmJHVnRaVzUwYzF0dFlYUmphRnN5WFYwcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklHRWdiR2wwZEd4bElIUmxjM1FnZEc4Z1ptbHVaQ0J1WlhoMElEd3ZjMk55YVhCMFBpQnZjaUE4TDNOMGVXeGxQaUF1TGk1Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCamJHOXpaVTFoY210MWNDQTlJQ2M4THljZ0t5QnRZWFJqYUZzeVhTQXJJQ2MrSnp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCcGJtUmxlQ0E5SUdSaGRHRXVhVzVrWlhoUFppaGpiRzl6WlUxaGNtdDFjQ3dnYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0c5d2RHbHZibk5iYldGMFkyaGJNbDFkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaHBibVJsZUNBOVBTQXRNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklIUm9aWEpsSUdseklHNXZJRzFoZEdOb2FXNW5JR1Z1WkdsdVp5Qm1iM0lnZEdobElIUmxlSFFnWld4bGJXVnVkQzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwWlhoMElEMGdaR0YwWVM1emJHbGpaU2hyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSbGVIUWdQU0JrWVhSaExuTnNhV05sS0d0TllYSnJkWEJRWVhSMFpYSnVMbXhoYzNSSmJtUmxlQ3dnYVc1a1pYZ3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSbGVIUXViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOMWNuSmxiblJRWVhKbGJuUXVZMmhwYkdST2IyUmxjMXRqZFhKeVpXNTBVR0Z5Wlc1MExtTm9hV3hrVG05a1pYTXViR1Z1WjNSb1hTQTlJRlJsZUhST2IyUmxLSFJsZUhRcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYVc1a1pYZ2dQVDBnTFRFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2JHRnpkRlJsZUhSUWIzTWdQU0JyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ2dQU0JrWVhSaExteGxibWQwYUNBcklERTdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFZtRnNkV1VnUFNCa1lYUmhMbk5zYVdObEtHdE5ZWEpyZFhCUVlYUjBaWEp1TG14aGMzUkpibVJsZUN3Z2FXNWtaWGdwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JzWVhOMFZHVjRkRkJ2Y3lBOUlHdE5ZWEpyZFhCUVlYUjBaWEp1TG14aGMzUkpibVJsZUNBOUlHbHVaR1Y0SUNzZ1kyeHZjMlZOWVhKcmRYQXViR1Z1WjNSb08xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCdFlYUmphRnN4WFNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdhV1lnS0cxaGRHTm9XekZkSUh4OElHMWhkR05vV3pSZElIeDhJR3RUWld4bVEyeHZjMmx1WjBWc1pXMWxiblJ6VzIxaGRHTm9XekpkWFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQzh2SUR3dklHOXlJQzgrSUc5eUlEeGljajRnWlhSakxseHVJQ0FnSUNBZ0lDQWdJSGRvYVd4bElDaDBjblZsSUNZbUlHTjFjbkpsYm5SUVlYSmxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoamRYSnlaVzUwVUdGeVpXNTBMbTV2WkdWT1lXMWxJRDA5SUcxaGRHTm9XekpkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhOMFlXTnJMbkJ2Y0NncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCamRYSnlaVzUwVUdGeVpXNTBJRDBnYzNSaFkydGJjM1JoWTJzdWJHVnVaM1JvSUMwZ01WMDdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZISjVhVzVuSUhSdklHTnNiM05sSUdOMWNuSmxiblFnZEdGbkxDQmhibVFnYlc5MlpTQnZibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYTBWc1pXMWxiblJ6UTJ4dmMyVmtRbmxEYkc5emFXNW5XMk4xY25KbGJuUlFZWEpsYm5RdWJtOWtaVTVoYldWZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0d0RmJHVnRaVzUwYzBOc2IzTmxaRUo1UTJ4dmMybHVaMXRqZFhKeVpXNTBVR0Z5Wlc1MExtNXZaR1ZPWVcxbFhWdHRZWFJqYUZzeVhWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhOMFlXTnJMbkJ2Y0NncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZM1Z5Y21WdWRGQmhjbVZ1ZENBOUlITjBZV05yVzNOMFlXTnJMbXhsYm1kMGFDQXRJREZkTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiMjUwYVc1MVpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJWYzJVZ1lXZG5jbVZ6YzJsMlpTQnpkSEpoZEdWbmVTQjBieUJvWVc1a2JHVWdkVzV0WVhSamFHbHVaeUJ0WVhKcmRYQnpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlISnZiM1E3WEc0Z0lDQWdmVnh1SUNCOU8xeHVYRzRnSUhKbGRIVnliaUJvZEcxc1VHRnljMlZ5TzF4dWZUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNyZWF0ZVBvb2wgPSBjcmVhdGVQb29sO1xuZXhwb3J0cy5pbml0aWFsaXplUG9vbHMgPSBpbml0aWFsaXplUG9vbHM7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dWlkMiA9IHJlcXVpcmUoJy4vdXVpZCcpO1xuXG52YXIgX3V1aWQzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXVpZDIpO1xuXG52YXIgdXVpZCA9IF91dWlkM1snZGVmYXVsdCddO1xudmFyIHBvb2xzID0ge307XG5leHBvcnRzLnBvb2xzID0gcG9vbHM7XG52YXIgY291bnQgPSAxMDAwMDtcblxuZXhwb3J0cy5jb3VudCA9IGNvdW50O1xuLyoqXG4gKiBDcmVhdGVzIGEgcG9vbCB0byBxdWVyeSBuZXcgb3IgcmV1c2VkIHZhbHVlcyBmcm9tLlxuICpcbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gb3B0c1xuICogQHJldHVybiB7T2JqZWN0fSBwb29sXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlUG9vbChuYW1lLCBvcHRzKSB7XG4gIHZhciBzaXplID0gb3B0cy5zaXplO1xuICB2YXIgZmlsbCA9IG9wdHMuZmlsbDtcblxuICB2YXIgX2ZyZWUgPSBbXTtcbiAgdmFyIGFsbG9jYXRlZCA9IFtdO1xuICB2YXIgX3Byb3RlY3QgPSBbXTtcblxuICAvLyBQcmltZSB0aGUgY2FjaGUgd2l0aCBuIG9iamVjdHMuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgX2ZyZWVbaV0gPSBmaWxsKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIF9mcmVlOiBfZnJlZSxcbiAgICBfYWxsb2NhdGVkOiBhbGxvY2F0ZWQsXG4gICAgX3Byb3RlY3RlZDogX3Byb3RlY3QsXG4gICAgX3V1aWQ6IHt9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgb2JqID0gbnVsbDtcbiAgICAgIHZhciBmcmVlTGVuZ3RoID0gX2ZyZWUubGVuZ3RoO1xuICAgICAgdmFyIG1pbnVzT25lID0gZnJlZUxlbmd0aCAtIDE7XG5cbiAgICAgIGlmIChmcmVlTGVuZ3RoKSB7XG4gICAgICAgIG9iaiA9IF9mcmVlW21pbnVzT25lXTtcbiAgICAgICAgX2ZyZWUubGVuZ3RoID0gbWludXNPbmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBmaWxsKCk7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5wdXNoKG9iaik7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuICAgIHByb3RlY3Q6IGZ1bmN0aW9uIHByb3RlY3QodmFsdWUpIHtcbiAgICAgIHZhciBpZHggPSBhbGxvY2F0ZWQuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgIC8vIE1vdmUgdGhlIHZhbHVlIG91dCBvZiBhbGxvY2F0ZWQsIHNpbmNlIHdlIG5lZWQgdG8gcHJvdGVjdCB0aGlzIGZyb21cbiAgICAgIC8vIGJlaW5nIGZyZWUnZCBhY2NpZGVudGFsbHkuXG4gICAgICBfcHJvdGVjdC5wdXNoKGlkeCA9PT0gLTEgPyB2YWx1ZSA6IGFsbG9jYXRlZC5zcGxpY2UoaWR4LCAxKVswXSk7XG5cbiAgICAgIC8vIElmIHdlJ3JlIHByb3RlY3RpbmcgYW4gZWxlbWVudCBvYmplY3QsIHB1c2ggdGhlIHV1aWQgaW50byBhIGxvb2t1cFxuICAgICAgLy8gdGFibGUuXG4gICAgICBpZiAobmFtZSA9PT0gJ2VsZW1lbnRPYmplY3QnKSB7XG4gICAgICAgIHRoaXMuX3V1aWRbdmFsdWUuZWxlbWVudF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5wcm90ZWN0OiBmdW5jdGlvbiB1bnByb3RlY3QodmFsdWUpIHtcbiAgICAgIHZhciBpZHggPSBfcHJvdGVjdC5pbmRleE9mKHZhbHVlKTtcblxuICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgdmFyIG9iaiA9IF9wcm90ZWN0LnNwbGljZShpZHgsIDEpWzBdO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgYWxsb2NhdGVkLnB1c2gob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuYW1lID09PSAnZWxlbWVudE9iamVjdCcpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fdXVpZFt2YWx1ZS5lbGVtZW50XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBmcmVlQWxsOiBmdW5jdGlvbiBmcmVlQWxsKCkge1xuICAgICAgdmFyIGFsbG9jYXRlZExlbmd0aCA9IGFsbG9jYXRlZC5sZW5ndGg7XG4gICAgICB2YXIgZnJlZUxlbmd0aCA9IF9mcmVlLmxlbmd0aDtcblxuICAgICAgX2ZyZWUucHVzaC5hcHBseShfZnJlZSwgYWxsb2NhdGVkLnNsaWNlKDAsIHNpemUgLSBmcmVlTGVuZ3RoKSk7XG4gICAgICBhbGxvY2F0ZWQubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgZnJlZTogZnVuY3Rpb24gZnJlZSh2YWx1ZSkge1xuICAgICAgdmFyIGlkeCA9IGFsbG9jYXRlZC5pbmRleE9mKHZhbHVlKTtcblxuICAgICAgLy8gQWxyZWFkeSBmcmVlZC5cbiAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gT25seSBwdXQgYmFjayBpbnRvIHRoZSBmcmVlIHF1ZXVlIGlmIHdlJ3JlIHVuZGVyIHRoZSBzaXplLlxuICAgICAgaWYgKF9mcmVlLmxlbmd0aCA8IHNpemUpIHtcbiAgICAgICAgX2ZyZWUucHVzaCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQb29scyhDT1VOVCkge1xuICBwb29scy5hdHRyaWJ1dGVPYmplY3QgPSBjcmVhdGVQb29sKCdhdHRyaWJ1dGVPYmplY3QnLCB7XG4gICAgc2l6ZTogQ09VTlQsXG5cbiAgICBmaWxsOiBmdW5jdGlvbiBmaWxsKCkge1xuICAgICAgcmV0dXJuIHsgbmFtZTogJycsIHZhbHVlOiAnJyB9O1xuICAgIH1cbiAgfSk7XG5cbiAgcG9vbHMuZWxlbWVudE9iamVjdCA9IGNyZWF0ZVBvb2woJ2VsZW1lbnRPYmplY3QnLCB7XG4gICAgc2l6ZTogQ09VTlQsXG5cbiAgICBmaWxsOiBmdW5jdGlvbiBmaWxsKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlbWVudDogdXVpZCgpLFxuICAgICAgICBjaGlsZE5vZGVzOiBbXSxcbiAgICAgICAgYXR0cmlidXRlczogW11cbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cblxuLy8gQ3JlYXRlIDEwayBpdGVtcyBvZiBlYWNoIHR5cGUuXG5pbml0aWFsaXplUG9vbHMoY291bnQpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2Y0c5dmJITXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenR4UWtGQmEwSXNVVUZCVVRzN096dEJRVVV4UWl4SlFVRk5MRWxCUVVrc2IwSkJRVkVzUTBGQlF6dEJRVU5hTEVsQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJRenM3UVVGRFppeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN096czdPenM3T3pzN08wRkJVMnhDTEZOQlFWTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVU3VFVGREwwSXNTVUZCU1N4SFFVRlhMRWxCUVVrc1EwRkJia0lzU1VGQlNUdE5RVUZGTEVsQlFVa3NSMEZCU3l4SlFVRkpMRU5CUVdJc1NVRkJTVHM3UVVGRGFFSXNUVUZCU1N4TFFVRkpMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMlFzVFVGQlNTeFRRVUZUTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTI1Q0xFMUJRVWtzVVVGQlR5eEhRVUZITEVWQlFVVXNRMEZCUXpzN08wRkJSMnBDTEU5QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkROMElzVTBGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1JVRkJSU3hEUVVGRE8wZEJRMnhDT3p0QlFVVkVMRk5CUVU4N1FVRkRUQ3hUUVVGTExFVkJRVVVzUzBGQlNUdEJRVU5ZTEdOQlFWVXNSVUZCUlN4VFFVRlRPMEZCUTNKQ0xHTkJRVlVzUlVGQlJTeFJRVUZQTzBGQlEyNUNMRk5CUVVzc1JVRkJSU3hGUVVGRk96dEJRVVZVTEU5QlFVY3NSVUZCUlN4bFFVRlhPMEZCUTJRc1ZVRkJTU3hIUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyWXNWVUZCU1N4VlFVRlZMRWRCUVVjc1MwRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU0zUWl4VlFVRkpMRkZCUVZFc1IwRkJSeXhWUVVGVkxFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVTVRaXhWUVVGSkxGVkJRVlVzUlVGQlJUdEJRVU5rTEZkQlFVY3NSMEZCUnl4TFFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGNrSXNZVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhSUVVGUkxFTkJRVU03VDBGRGVFSXNUVUZEU1R0QlFVTklMRmRCUVVjc1IwRkJSeXhKUVVGSkxFVkJRVVVzUTBGQlF6dFBRVU5rT3p0QlFVVkVMR1ZCUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhCQ0xHRkJRVThzUjBGQlJ5eERRVUZETzB0QlExbzdPMEZCUlVRc1YwRkJUeXhGUVVGRkxHbENRVUZUTEV0QlFVc3NSVUZCUlR0QlFVTjJRaXhWUVVGSkxFZEJRVWNzUjBGQlJ5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE96czdPMEZCU1c1RExHTkJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhIUVVGSExFdEJRVXNzUjBGQlJ5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenM3TzBGQlNTOUVMRlZCUVVrc1NVRkJTU3hMUVVGTExHVkJRV1VzUlVGQlJUdEJRVU0xUWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1QwRkRia003UzBGRFJqczdRVUZGUkN4aFFVRlRMRVZCUVVVc2JVSkJRVk1zUzBGQlN5eEZRVUZGTzBGQlEzcENMRlZCUVVrc1IwRkJSeXhIUVVGSExGRkJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSV3BETEZWQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRMlFzV1VGQlNTeEhRVUZITEVkQlFVY3NVVUZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRjRU1zV1VGQlNTeEhRVUZITEVWQlFVVTdRVUZCUlN4dFFrRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0VFFVRkZPenRCUVVWcVF5eFpRVUZKTEVsQlFVa3NTMEZCU3l4bFFVRmxMRVZCUVVVN1FVRkROVUlzYVVKQlFVOHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdVMEZEYkVNN1QwRkRSanRMUVVOR096dEJRVVZFTEZkQlFVOHNSVUZCUlN4dFFrRkJWenRCUVVOc1FpeFZRVUZKTEdWQlFXVXNSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wRkJRM1pETEZWQlFVa3NWVUZCVlN4SFFVRkhMRXRCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03TzBGQlJUZENMRmRCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUlVGQlJTeEpRVUZKTEVkQlFVY3NWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNM1JDeGxRVUZUTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRMUVVOMFFqczdRVUZGUkN4UlFVRkpMRVZCUVVVc1kwRkJVeXhMUVVGTExFVkJRVVU3UVVGRGNFSXNWVUZCU1N4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN08wRkJSMjVETEZWQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRVVVzWlVGQlR6dFBRVUZGT3pzN1FVRkhNMElzVlVGQlNTeExRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRWxCUVVrc1JVRkJSVHRCUVVOMFFpeGhRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wOUJRMnhDT3p0QlFVVkVMR1ZCUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpGQ08wZEJRMFlzUTBGQlF6dERRVU5JT3p0QlFVZE5MRk5CUVZNc1pVRkJaU3hEUVVGRExFdEJRVXNzUlVGQlJUdEJRVU55UXl4UFFVRkxMRU5CUVVNc1pVRkJaU3hIUVVGSExGVkJRVlVzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSVHRCUVVOd1JDeFJRVUZKTEVWQlFVVXNTMEZCU3pzN1FVRkZXQ3hSUVVGSkxFVkJRVVVzWjBKQlFWYzdRVUZEWml4aFFVRlBMRVZCUVVVc1NVRkJTU3hGUVVGRkxFVkJRVVVzUlVGQlJTeExRVUZMTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN1MwRkRhRU03UjBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1QwRkJTeXhEUVVGRExHRkJRV0VzUjBGQlJ5eFZRVUZWTEVOQlFVTXNaVUZCWlN4RlFVRkZPMEZCUTJoRUxGRkJRVWtzUlVGQlJTeExRVUZMT3p0QlFVVllMRkZCUVVrc1JVRkJSU3huUWtGQlZ6dEJRVU5tTEdGQlFVODdRVUZEVEN4bFFVRlBMRVZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRMllzYTBKQlFWVXNSVUZCUlN4RlFVRkZPMEZCUTJRc2EwSkJRVlVzUlVGQlJTeEZRVUZGTzA5QlEyWXNRMEZCUXp0TFFVTklPMGRCUTBZc1EwRkJReXhEUVVGRE8wTkJRMG83T3p0QlFVZEVMR1ZCUVdVc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5SXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOTFkR2xzTDNCdmIyeHpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUY5MWRXbGtJR1p5YjIwZ0p5NHZkWFZwWkNjN1hHNWNibU52Ym5OMElIVjFhV1FnUFNCZmRYVnBaRHRjYm1WNGNHOXlkQ0IyWVhJZ2NHOXZiSE1nUFNCN2ZUdGNibVY0Y0c5eWRDQjJZWElnWTI5MWJuUWdQU0F4TURBd01EdGNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJR0VnY0c5dmJDQjBieUJ4ZFdWeWVTQnVaWGNnYjNJZ2NtVjFjMlZrSUhaaGJIVmxjeUJtY205dExseHVJQ3BjYmlBcUlFQndZWEpoYlNCdVlXMWxYRzRnS2lCQWNHRnlZVzBnYjNCMGMxeHVJQ29nUUhKbGRIVnliaUI3VDJKcVpXTjBmU0J3YjI5c1hHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJqY21WaGRHVlFiMjlzS0c1aGJXVXNJRzl3ZEhNcElIdGNiaUFnZG1GeUlIc2djMmw2WlN3Z1ptbHNiQ0I5SUQwZ2IzQjBjenRjYmlBZ2RtRnlJR1p5WldVZ1BTQmJYVHRjYmlBZ2RtRnlJR0ZzYkc5allYUmxaQ0E5SUZ0ZE8xeHVJQ0IyWVhJZ2NISnZkR1ZqZENBOUlGdGRPMXh1WEc0Z0lDOHZJRkJ5YVcxbElIUm9aU0JqWVdOb1pTQjNhWFJvSUc0Z2IySnFaV04wY3k1Y2JpQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0J6YVhwbE95QnBLeXNwSUh0Y2JpQWdJQ0JtY21WbFcybGRJRDBnWm1sc2JDZ3BPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSHRjYmlBZ0lDQmZabkpsWlRvZ1puSmxaU3hjYmlBZ0lDQmZZV3hzYjJOaGRHVmtPaUJoYkd4dlkyRjBaV1FzWEc0Z0lDQWdYM0J5YjNSbFkzUmxaRG9nY0hKdmRHVmpkQ3hjYmlBZ0lDQmZkWFZwWkRvZ2UzMHNYRzVjYmlBZ0lDQm5aWFE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzlpYWlBOUlHNTFiR3c3WEc0Z0lDQWdJQ0JzWlhRZ1puSmxaVXhsYm1kMGFDQTlJR1p5WldVdWJHVnVaM1JvTzF4dUlDQWdJQ0FnYkdWMElHMXBiblZ6VDI1bElEMGdabkpsWlV4bGJtZDBhQ0F0SURFN1hHNWNiaUFnSUNBZ0lHbG1JQ2htY21WbFRHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lHOWlhaUE5SUdaeVpXVmJiV2x1ZFhOUGJtVmRPMXh1SUNBZ0lDQWdJQ0JtY21WbExteGxibWQwYUNBOUlHMXBiblZ6VDI1bE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUc5aWFpQTlJR1pwYkd3b0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZV3hzYjJOaGRHVmtMbkIxYzJnb2IySnFLVHRjYmx4dUlDQWdJQ0FnY21WMGRYSnVJRzlpYWp0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnY0hKdmRHVmpkRG9nWm5WdVkzUnBiMjRvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJR3hsZENCcFpIZ2dQU0JoYkd4dlkyRjBaV1F1YVc1a1pYaFBaaWgyWVd4MVpTazdYRzVjYmlBZ0lDQWdJQzh2SUUxdmRtVWdkR2hsSUhaaGJIVmxJRzkxZENCdlppQmhiR3h2WTJGMFpXUXNJSE5wYm1ObElIZGxJRzVsWldRZ2RHOGdjSEp2ZEdWamRDQjBhR2x6SUdaeWIyMWNiaUFnSUNBZ0lDOHZJR0psYVc1bklHWnlaV1VuWkNCaFkyTnBaR1Z1ZEdGc2JIa3VYRzRnSUNBZ0lDQndjbTkwWldOMExuQjFjMmdvYVdSNElEMDlQU0F0TVNBL0lIWmhiSFZsSURvZ1lXeHNiMk5oZEdWa0xuTndiR2xqWlNocFpIZ3NJREVwV3pCZEtUdGNibHh1SUNBZ0lDQWdMeThnU1dZZ2QyVW5jbVVnY0hKdmRHVmpkR2x1WnlCaGJpQmxiR1Z0Wlc1MElHOWlhbVZqZEN3Z2NIVnphQ0IwYUdVZ2RYVnBaQ0JwYm5SdklHRWdiRzl2YTNWd1hHNGdJQ0FnSUNBdkx5QjBZV0pzWlM1Y2JpQWdJQ0FnSUdsbUlDaHVZVzFsSUQwOVBTQW5aV3hsYldWdWRFOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmRYVnBaRnQyWVd4MVpTNWxiR1Z0Wlc1MFhTQTlJSFpoYkhWbE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCMWJuQnliM1JsWTNRNklHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJQ0FnSUNCc1pYUWdhV1I0SUQwZ2NISnZkR1ZqZEM1cGJtUmxlRTltS0haaGJIVmxLVHRjYmx4dUlDQWdJQ0FnYVdZZ0tHbGtlQ0FoUFQwZ0xURXBJSHRjYmlBZ0lDQWdJQ0FnYkdWMElHOWlhaUE5SUhCeWIzUmxZM1F1YzNCc2FXTmxLR2xrZUN3Z01TbGJNRjA3WEc0Z0lDQWdJQ0FnSUdsbUlDaHZZbW9wSUhzZ1lXeHNiMk5oZEdWa0xuQjFjMmdvYjJKcUtUc2dmVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHVZVzFsSUQwOVBTQW5aV3hsYldWdWRFOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lDQWdJQ0JrWld4bGRHVWdkR2hwY3k1ZmRYVnBaRnQyWVd4MVpTNWxiR1Z0Wlc1MFhUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQm1jbVZsUVd4c09pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJR3hsZENCaGJHeHZZMkYwWldSTVpXNW5kR2dnUFNCaGJHeHZZMkYwWldRdWJHVnVaM1JvTzF4dUlDQWdJQ0FnYkdWMElHWnlaV1ZNWlc1bmRHZ2dQU0JtY21WbExteGxibWQwYUR0Y2JseHVJQ0FnSUNBZ1puSmxaUzV3ZFhOb0xtRndjR3g1S0daeVpXVXNJR0ZzYkc5allYUmxaQzV6YkdsalpTZ3dMQ0J6YVhwbElDMGdabkpsWlV4bGJtZDBhQ2twTzF4dUlDQWdJQ0FnWVd4c2IyTmhkR1ZrTG14bGJtZDBhQ0E5SURBN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdaeVpXVTZJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQnNaWFFnYVdSNElEMGdZV3hzYjJOaGRHVmtMbWx1WkdWNFQyWW9kbUZzZFdVcE8xeHVYRzRnSUNBZ0lDQXZMeUJCYkhKbFlXUjVJR1p5WldWa0xseHVJQ0FnSUNBZ2FXWWdLR2xrZUNBOVBUMGdMVEVwSUhzZ2NtVjBkWEp1T3lCOVhHNWNiaUFnSUNBZ0lDOHZJRTl1YkhrZ2NIVjBJR0poWTJzZ2FXNTBieUIwYUdVZ1puSmxaU0J4ZFdWMVpTQnBaaUIzWlNkeVpTQjFibVJsY2lCMGFHVWdjMmw2WlM1Y2JpQWdJQ0FnSUdsbUlDaG1jbVZsTG14bGJtZDBhQ0E4SUhOcGVtVXBJSHRjYmlBZ0lDQWdJQ0FnWm5KbFpTNXdkWE5vS0haaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWVd4c2IyTmhkR1ZrTG5Od2JHbGpaU2hwWkhnc0lERXBPMXh1SUNBZ0lIMWNiaUFnZlR0Y2JuMWNibHh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnYVc1cGRHbGhiR2w2WlZCdmIyeHpLRU5QVlU1VUtTQjdYRzRnSUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDQTlJR055WldGMFpWQnZiMndvSjJGMGRISnBZblYwWlU5aWFtVmpkQ2NzSUh0Y2JpQWdJQ0J6YVhwbE9pQkRUMVZPVkN4Y2JseHVJQ0FnSUdacGJHdzZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSHNnYm1GdFpUb2dKeWNzSUhaaGJIVmxPaUFuSnlCOU8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdjRzl2YkhNdVpXeGxiV1Z1ZEU5aWFtVmpkQ0E5SUdOeVpXRjBaVkJ2YjJ3b0oyVnNaVzFsYm5SUFltcGxZM1FuTENCN1hHNGdJQ0FnYzJsNlpUb2dRMDlWVGxRc1hHNWNiaUFnSUNCbWFXeHNPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblE2SUhWMWFXUW9LU3hjYmlBZ0lDQWdJQ0FnWTJocGJHUk9iMlJsY3pvZ1cxMHNYRzRnSUNBZ0lDQWdJR0YwZEhKcFluVjBaWE02SUZ0ZFhHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1OVhHNWNiaTh2SUVOeVpXRjBaU0F4TUdzZ2FYUmxiWE1nYjJZZ1pXRmphQ0IwZVhCbExseHVhVzVwZEdsaGJHbDZaVkJ2YjJ4ektHTnZkVzUwS1R0Y2JpSmRmUT09IiwiLyoqXG4gKiBHZW5lcmF0ZXMgYSB1dWlkLlxuICpcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyMy8yODIxNzVcbiAqIEByZXR1cm4ge3N0cmluZ30gdXVpZFxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gdXVpZDtcblxuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsXG4gICAgICAgIHYgPSBjID09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2ZFhWcFpDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenR4UWtGTmQwSXNTVUZCU1RzN1FVRkJZaXhUUVVGVExFbEJRVWtzUjBGQlJ6dEJRVU0zUWl4VFFVRlBMSE5EUVVGelF5eERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1ZVRkJVeXhEUVVGRExFVkJRVVU3UVVGRGVrVXNVVUZCU1N4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZETEVWQlFVVXNSMEZCUXl4RFFVRkRPMUZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEhRVUZITEVkQlFVY3NRMEZCUXl4SFFVRkpMRU5CUVVNc1IwRkJReXhIUVVGSExFZEJRVU1zUjBGQlJ5eEJRVUZETEVOQlFVTTdRVUZETTBRc1YwRkJUeXhEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTNaQ0xFTkJRVU1zUTBGQlF6dERRVU5LSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZkWFZwWkM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dSMlZ1WlhKaGRHVnpJR0VnZFhWcFpDNWNiaUFxWEc0Z0tpQkFjMlZsSUdoMGRIQTZMeTl6ZEdGamEyOTJaWEptYkc5M0xtTnZiUzloTHpJeE1UYzFNak12TWpneU1UYzFYRzRnS2lCQWNtVjBkWEp1SUh0emRISnBibWQ5SUhWMWFXUmNiaUFxTDF4dVpYaHdiM0owSUdSbFptRjFiSFFnWm5WdVkzUnBiMjRnZFhWcFpDZ3BJSHRjYmlBZ2NtVjBkWEp1SUNkNGVIaDRlSGg0ZUMxNGVIaDRMVFI0ZUhndGVYaDRlQzE0ZUhoNGVIaDRlSGg0ZUhnbkxuSmxjR3hoWTJVb0wxdDRlVjB2Wnl3Z1puVnVZM1JwYjI0b1l5a2dlMXh1SUNBZ0lIWmhjaUJ5SUQwZ1RXRjBhQzV5WVc1a2IyMG9LU294Tm53d0xDQjJJRDBnWXlBOVBTQW5lQ2NnUHlCeUlEb2dLSEltTUhnemZEQjRPQ2s3WEc0Z0lDQWdjbVYwZFhKdUlIWXVkRzlUZEhKcGJtY29NVFlwTzF4dUlDQjlLVHRjYm4xY2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfdXRpbFV1aWQgPSByZXF1aXJlKCcuLi91dGlsL3V1aWQnKTtcblxudmFyIF91dGlsVXVpZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsVXVpZCk7XG5cbnZhciBfdXRpbFBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xuXG52YXIgX3V0aWxQYXJzZXIgPSByZXF1aXJlKCcuLi91dGlsL3BhcnNlcicpO1xuXG52YXIgX3V0aWxNZW1vcnkgPSByZXF1aXJlKCcuLi91dGlsL21lbW9yeScpO1xuXG52YXIgX25vZGVTeW5jID0gcmVxdWlyZSgnLi4vbm9kZS9zeW5jJyk7XG5cbnZhciBfbm9kZVN5bmMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZVN5bmMpO1xuXG52YXIgX3NvdXJjZSA9IHJlcXVpcmUoJy4vc291cmNlJyk7XG5cbnZhciBfc291cmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NvdXJjZSk7XG5cbi8vIFRlc3RzIGlmIHRoZSBicm93c2VyIGhhcyBzdXBwb3J0IGZvciB0aGUgYFdvcmtlcmAgQVBJLlxudmFyIGhhc1dvcmtlciA9IHR5cGVvZiBXb3JrZXIgPT09ICdmdW5jdGlvbic7XG5cbmV4cG9ydHMuaGFzV29ya2VyID0gaGFzV29ya2VyO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFdlYiBXb3JrZXIgcGVyIGVsZW1lbnQgdGhhdCB3aWxsIGJlIGRpZmZlZC4gQWxsb3dzIG11bHRpcGxlXG4gKiBjb25jdXJyZW50IGRpZmZpbmcgb3BlcmF0aW9ucyB0byBvY2N1ciBzaW11bHRhbmVvdXNseSwgbGV2ZXJhZ2luZyB0aGVcbiAqIG11bHRpLWNvcmUgbmF0dXJlIG9mIGRlc2t0b3AgYW5kIG1vYmlsZSBkZXZpY2VzLlxuICpcbiAqIEF0dGFjaCBhbnkgZnVuY3Rpb25zIHRoYXQgY291bGQgYmUgdXNlZCBieSB0aGUgV29ya2VyIGluc2lkZSB0aGUgQmxvYiBiZWxvdy5cbiAqIEFsbCBmdW5jdGlvbnMgYXJlIG5hbWVkIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGdsb2JhbGx5LiBTaW5jZSB3ZSdyZVxuICogZGlyZWN0bHkgaW5qZWN0aW5nIHRoZSBtZXRob2RzIGludG8gYW4gQXJyYXkgYW5kIHRoZW4gY2FsbGluZyBgam9pbmAgdGhlXG4gKiBgdG9TdHJpbmdgIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgb24gZWFjaCBmdW5jdGlvbiBhbmQgd2lsbCBpbmplY3QgYSB2YWxpZFxuICogcmVwcmVzZW50YXRpb24gb2YgdGhlIGZ1bmN0aW9uJ3Mgc291cmNlLiBUaGlzIGNvbWVzIGF0IGEgY29zdCBzaW5jZSBCYWJlbFxuICogcmV3cml0ZXMgdmFyaWFibGUgbmFtZXMgd2hlbiB5b3UgYGltcG9ydGAgYSBtb2R1bGUuIFRoaXMgaXMgd2h5IHlvdSdsbCBzZWVcbiAqIHVuZGVyc2NvcmVkIHByb3BlcnRpZXMgYmVpbmcgaW1wb3J0ZWQgYW5kIHRoZW4gcmVhc3NpZ25lZCB0byBub24tdW5kZXJzY29yZWRcbiAqIG5hbWVzIGluIG1vZHVsZXMgdGhhdCBhcmUgcmV1c2VkIGhlcmUuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBBIFdvcmtlciBpbnN0YW5jZS5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIHZhciB3b3JrZXJCbG9iID0gbnVsbDtcbiAgdmFyIHdvcmtlciA9IG51bGw7XG5cbiAgLy8gU2V0IHVwIGEgV2ViV29ya2VyIGlmIGF2YWlsYWJsZS5cbiAgaWYgKGhhc1dvcmtlcikge1xuICAgIC8vIENvbnN0cnVjdCB0aGUgd29ya2VyIHJldXNpbmcgY29kZSBhbHJlYWR5IG9yZ2FuaXplZCBpbnRvIG1vZHVsZXMuICBLZWVwXG4gICAgLy8gdGhpcyBjb2RlIEVTNSBzaW5jZSB3ZSBkbyBub3QgZ2V0IHRpbWUgdG8gcHJlLXByb2Nlc3MgaXQgYXMgRVM2LlxuICAgIHdvcmtlckJsb2IgPSBuZXcgQmxvYihbW1xuICAgIC8vIFJldXNhYmxlIEFycmF5IG1ldGhvZHMuXG4gICAgJ3ZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTsnLFxuXG4gICAgLy8gQWRkIGEgbmFtZXNwYWNlIHRvIGF0dGFjaCBwb29sIG1ldGhvZHMgdG8uXG4gICAgJ3ZhciBwb29scyA9IHt9OycsICd2YXIgbm9kZXMgPSAwOycsXG5cbiAgICAvLyBBZGRzIGluIGEgZ2xvYmFsIGB1dWlkYCBmdW5jdGlvbi5cbiAgICBfdXRpbFV1aWQyWydkZWZhdWx0J10sXG5cbiAgICAvLyBBZGQgdGhlIGFiaWxpdHkgdG8gcHJvdGVjdCBlbGVtZW50cyBmcm9tIGZyZWUnZCBtZW1vcnkuXG4gICAgX3V0aWxNZW1vcnkucHJvdGVjdEVsZW1lbnQsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5LFxuXG4gICAgLy8gQWRkIGluIHBvb2wgbWFuaXB1bGF0aW9uIG1ldGhvZHMuXG4gICAgX3V0aWxQb29scy5jcmVhdGVQb29sLCBfdXRpbFBvb2xzLmluaXRpYWxpemVQb29scywgJ2luaXRpYWxpemVQb29scygnICsgX3V0aWxQb29scy5jb3VudCArICcpOycsXG5cbiAgICAvLyBBZGQgaW4gTm9kZSBtYW5pcHVsYXRpb24uXG4gICAgJ3ZhciBzeW5jTm9kZSA9ICcgKyBfbm9kZVN5bmMyWydkZWZhdWx0J10sXG5cbiAgICAvLyBBZGQgaW4gdGhlIGFiaWxpdHkgdG8gcGFyc2VIVE1MLlxuICAgIF91dGlsUGFyc2VyLnBhcnNlSFRNTCwgJ3ZhciBtYWtlUGFyc2VyID0gJyArIF91dGlsUGFyc2VyLm1ha2VQYXJzZXIsICd2YXIgcGFyc2VyID0gbWFrZVBhcnNlcigpOycsXG5cbiAgICAvLyBBZGQgaW4gdGhlIHdvcmtlciBzb3VyY2UuXG4gICAgX3NvdXJjZTJbJ2RlZmF1bHQnXSxcblxuICAgIC8vIE1ldGFwcm9ncmFtbWluZyB1cCB0aGlzIHdvcmtlciBjYWxsLlxuICAgICdzdGFydHVwKHNlbGYpOyddLmpvaW4oJ1xcbicpXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIHdvcmtlciBhbmQgc3RhcnQgaXQgdXAuXG4gICAgdHJ5IHtcbiAgICAgIHdvcmtlciA9IG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTCh3b3JrZXJCbG9iKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5pbmZvKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkZhaWxlZCB0byBjcmVhdGUgZGlmZmh0bWwgd29ya2VyXCIsIGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBjYW5ub3QgY3JlYXRlIGEgV29ya2VyLCB0aGVuIGRpc2FibGUgdHJ5aW5nIGFnYWluLCBhbGwgd29ya1xuICAgICAgLy8gd2lsbCBoYXBwZW4gb24gdGhlIG1haW4gVUkgdGhyZWFkLlxuICAgICAgZXhwb3J0cy5oYXNXb3JrZXIgPSBoYXNXb3JrZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gd29ya2VyO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzZHZjbXRsY2k5amNtVmhkR1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3TzNkQ1FVRnBRaXhqUVVGak96czdPM2xDUVVOdlFpeGxRVUZsT3pzd1FrRkZOVUlzWjBKQlFXZENPenN3UWtGRFVTeG5Ra0ZCWjBJN08zZENRVU42UkN4alFVRmpPenM3TzNOQ1FVTldMRlZCUVZVN096czdPMEZCUnpWQ0xFbEJRVWtzVTBGQlV5eEhRVUZITEU5QlFVOHNUVUZCVFN4TFFVRkxMRlZCUVZVc1EwRkJRenM3T3pzN096czdPenM3T3pzN096czdPenM3UVVGclFqZERMRk5CUVZNc1RVRkJUU3hIUVVGSE8wRkJRM1pDTEUxQlFVa3NWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOMFFpeE5RVUZKTEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNN096dEJRVWRzUWl4TlFVRkpMRk5CUVZNc1JVRkJSVHM3TzBGQlIySXNZMEZCVlN4SFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExFTkJRM0JDT3p0QlFVVkZMSGREUVVGdlF6czdPMEZCUjNCRExIRkNRVUZwUWl4RlFVTnFRaXhuUWtGQlowSTdPenM3T3pzN096dDFSRUZoYUVJc2EwSkJRV3RDTEcxQ1FVRlpMRWRCUVVjc1NVRkJTVHM3TzBGQlIzSkRMSEZDUVVGcFFpeDNRa0ZCVnpzN096SkNRVXMxUWl4dFFrRkJiVUlzZVVKQlFXRXNSVUZEYUVNc05FSkJRVFJDT3pzN096czdRVUZOTlVJc2IwSkJRV2RDTEVOQlEycENMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVU5pTEVWQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc2QwSkJRWGRDTEVWQlFVVXNRMEZCUXl4RFFVRkRPenM3UVVGSGRrTXNVVUZCU1R0QlFVTkdMRmxCUVUwc1IwRkJSeXhKUVVGSkxFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNaVUZCWlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGRFUXNRMEZEUkN4UFFVRk5MRU5CUVVNc1JVRkJSVHRCUVVOUUxGVkJRVWtzVDBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVN1FVRkRNMElzWlVGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4clEwRkJhME1zUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0UFFVTnlSRHM3T3p0QlFVbEVMR05CTlVWTExGTkJRVk1zUjBFMFJXUXNVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJRenRMUVVOdVFqdEhRVU5HT3p0QlFVVkVMRk5CUVU4c1RVRkJUU3hEUVVGRE8wTkJRMllpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2ZDI5eWEyVnlMMk55WldGMFpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0IxZFdsa0lHWnliMjBnSnk0dUwzVjBhV3d2ZFhWcFpDYzdYRzVwYlhCdmNuUWdleUJ3YjI5c2N5d2dhVzVwZEdsaGJHbDZaVkJ2YjJ4ekxDQmpjbVZoZEdWUWIyOXNJSDBnWm5KdmJTQW5MaTR2ZFhScGJDOXdiMjlzY3ljN1hHNXBiWEJ2Y25RZ2V5QmpiM1Z1ZENCaGN5QndiMjlzUTI5MWJuUWdmU0JtY205dElDY3VMaTkxZEdsc0wzQnZiMnh6Snp0Y2JtbHRjRzl5ZENCN0lIQmhjbk5sU0ZSTlRDd2diV0ZyWlZCaGNuTmxjaUI5SUdaeWIyMGdKeTR1TDNWMGFXd3ZjR0Z5YzJWeUp6dGNibWx0Y0c5eWRDQjdJSEJ5YjNSbFkzUkZiR1Z0Wlc1MExDQjFibkJ5YjNSbFkzUkZiR1Z0Wlc1MExDQmpiR1ZoYmsxbGJXOXllU0I5SUdaeWIyMGdKeTR1TDNWMGFXd3ZiV1Z0YjNKNUp6dGNibWx0Y0c5eWRDQnplVzVqVG05a1pTQm1jbTl0SUNjdUxpOXViMlJsTDNONWJtTW5PMXh1YVcxd2IzSjBJSGR2Y210bGNsTnZkWEpqWlNCbWNtOXRJQ2N1TDNOdmRYSmpaU2M3WEc1Y2JpOHZJRlJsYzNSeklHbG1JSFJvWlNCaWNtOTNjMlZ5SUdoaGN5QnpkWEJ3YjNKMElHWnZjaUIwYUdVZ1lGZHZjbXRsY21BZ1FWQkpMbHh1Wlhod2IzSjBJSFpoY2lCb1lYTlhiM0pyWlhJZ1BTQjBlWEJsYjJZZ1YyOXlhMlZ5SUQwOVBTQW5ablZ1WTNScGIyNG5PMXh1WEc0dktpcGNiaUFxSUVOeVpXRjBaWE1nWVNCdVpYY2dWMlZpSUZkdmNtdGxjaUJ3WlhJZ1pXeGxiV1Z1ZENCMGFHRjBJSGRwYkd3Z1ltVWdaR2xtWm1Wa0xpQkJiR3h2ZDNNZ2JYVnNkR2x3YkdWY2JpQXFJR052Ym1OMWNuSmxiblFnWkdsbVptbHVaeUJ2Y0dWeVlYUnBiMjV6SUhSdklHOWpZM1Z5SUhOcGJYVnNkR0Z1Wlc5MWMyeDVMQ0JzWlhabGNtRm5hVzVuSUhSb1pWeHVJQ29nYlhWc2RHa3RZMjl5WlNCdVlYUjFjbVVnYjJZZ1pHVnphM1J2Y0NCaGJtUWdiVzlpYVd4bElHUmxkbWxqWlhNdVhHNGdLbHh1SUNvZ1FYUjBZV05vSUdGdWVTQm1kVzVqZEdsdmJuTWdkR2hoZENCamIzVnNaQ0JpWlNCMWMyVmtJR0o1SUhSb1pTQlhiM0pyWlhJZ2FXNXphV1JsSUhSb1pTQkNiRzlpSUdKbGJHOTNMbHh1SUNvZ1FXeHNJR1oxYm1OMGFXOXVjeUJoY21VZ2JtRnRaV1FnYzI4Z2RHaGxlU0JqWVc0Z1ltVWdZV05qWlhOelpXUWdaMnh2WW1Gc2JIa3VJRk5wYm1ObElIZGxKM0psWEc0Z0tpQmthWEpsWTNSc2VTQnBibXBsWTNScGJtY2dkR2hsSUcxbGRHaHZaSE1nYVc1MGJ5QmhiaUJCY25KaGVTQmhibVFnZEdobGJpQmpZV3hzYVc1bklHQnFiMmx1WUNCMGFHVmNiaUFxSUdCMGIxTjBjbWx1WjJBZ2JXVjBhRzlrSUhkcGJHd2dZbVVnYVc1MmIydGxaQ0J2YmlCbFlXTm9JR1oxYm1OMGFXOXVJR0Z1WkNCM2FXeHNJR2x1YW1WamRDQmhJSFpoYkdsa1hHNGdLaUJ5WlhCeVpYTmxiblJoZEdsdmJpQnZaaUIwYUdVZ1puVnVZM1JwYjI0bmN5QnpiM1Z5WTJVdUlGUm9hWE1nWTI5dFpYTWdZWFFnWVNCamIzTjBJSE5wYm1ObElFSmhZbVZzWEc0Z0tpQnlaWGR5YVhSbGN5QjJZWEpwWVdKc1pTQnVZVzFsY3lCM2FHVnVJSGx2ZFNCZ2FXMXdiM0owWUNCaElHMXZaSFZzWlM0Z1ZHaHBjeUJwY3lCM2FIa2dlVzkxSjJ4c0lITmxaVnh1SUNvZ2RXNWtaWEp6WTI5eVpXUWdjSEp2Y0dWeWRHbGxjeUJpWldsdVp5QnBiWEJ2Y25SbFpDQmhibVFnZEdobGJpQnlaV0Z6YzJsbmJtVmtJSFJ2SUc1dmJpMTFibVJsY25OamIzSmxaRnh1SUNvZ2JtRnRaWE1nYVc0Z2JXOWtkV3hsY3lCMGFHRjBJR0Z5WlNCeVpYVnpaV1FnYUdWeVpTNWNiaUFxWEc0Z0tpQkFjbVYwZFhKdUlIdFBZbXBsWTNSOUlFRWdWMjl5YTJWeUlHbHVjM1JoYm1ObExseHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWTNKbFlYUmxLQ2tnZTF4dUlDQnNaWFFnZDI5eWEyVnlRbXh2WWlBOUlHNTFiR3c3WEc0Z0lHeGxkQ0IzYjNKclpYSWdQU0J1ZFd4c08xeHVYRzRnSUM4dklGTmxkQ0IxY0NCaElGZGxZbGR2Y210bGNpQnBaaUJoZG1GcGJHRmliR1V1WEc0Z0lHbG1JQ2hvWVhOWGIzSnJaWElwSUh0Y2JpQWdJQ0F2THlCRGIyNXpkSEoxWTNRZ2RHaGxJSGR2Y210bGNpQnlaWFZ6YVc1bklHTnZaR1VnWVd4eVpXRmtlU0J2Y21kaGJtbDZaV1FnYVc1MGJ5QnRiMlIxYkdWekxpQWdTMlZsY0Z4dUlDQWdJQzh2SUhSb2FYTWdZMjlrWlNCRlV6VWdjMmx1WTJVZ2QyVWdaRzhnYm05MElHZGxkQ0IwYVcxbElIUnZJSEJ5WlMxd2NtOWpaWE56SUdsMElHRnpJRVZUTmk1Y2JpQWdJQ0IzYjNKclpYSkNiRzlpSUQwZ2JtVjNJRUpzYjJJb1cxeHVJQ0FnSUNBZ1cxeHVJQ0FnSUNBZ0lDQXZMeUJTWlhWellXSnNaU0JCY25KaGVTQnRaWFJvYjJSekxseHVJQ0FnSUNBZ0lDQW5kbUZ5SUhOc2FXTmxJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbk5zYVdObE95Y3NYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJR0VnYm1GdFpYTndZV05sSUhSdklHRjBkR0ZqYUNCd2IyOXNJRzFsZEdodlpITWdkRzh1WEc0Z0lDQWdJQ0FnSUNkMllYSWdjRzl2YkhNZ1BTQjdmVHNuTEZ4dUlDQWdJQ0FnSUNBbmRtRnlJRzV2WkdWeklEMGdNRHNuTEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkhNZ2FXNGdZU0JuYkc5aVlXd2dZSFYxYVdSZ0lHWjFibU4wYVc5dUxseHVJQ0FnSUNBZ0lDQjFkV2xrTEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkNCMGFHVWdZV0pwYkdsMGVTQjBieUJ3Y205MFpXTjBJR1ZzWlcxbGJuUnpJR1p5YjIwZ1puSmxaU2RrSUcxbGJXOXllUzVjYmlBZ0lDQWdJQ0FnY0hKdmRHVmpkRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQWdJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQWdJR05zWldGdVRXVnRiM0o1TEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkNCcGJpQndiMjlzSUcxaGJtbHdkV3hoZEdsdmJpQnRaWFJvYjJSekxseHVJQ0FnSUNBZ0lDQmpjbVZoZEdWUWIyOXNMRnh1SUNBZ0lDQWdJQ0JwYm1sMGFXRnNhWHBsVUc5dmJITXNYRzRnSUNBZ0lDQWdJQ2RwYm1sMGFXRnNhWHBsVUc5dmJITW9KeUFySUhCdmIyeERiM1Z1ZENBcklDY3BPeWNzWEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRV1JrSUdsdUlFNXZaR1VnYldGdWFYQjFiR0YwYVc5dUxseHVJQ0FnSUNBZ0lDQW5kbUZ5SUhONWJtTk9iMlJsSUQwZ0p5QXJJSE41Ym1OT2IyUmxMRnh1WEc0Z0lDQWdJQ0FnSUM4dklFRmtaQ0JwYmlCMGFHVWdZV0pwYkdsMGVTQjBieUJ3WVhKelpVaFVUVXd1WEc0Z0lDQWdJQ0FnSUhCaGNuTmxTRlJOVEN4Y2JseHVJQ0FnSUNBZ0lDQW5kbUZ5SUcxaGEyVlFZWEp6WlhJZ1BTQW5JQ3NnYldGclpWQmhjbk5sY2l4Y2JpQWdJQ0FnSUNBZ0ozWmhjaUJ3WVhKelpYSWdQU0J0WVd0bFVHRnljMlZ5S0NrN0p5eGNibHh1SUNBZ0lDQWdJQ0F2THlCQlpHUWdhVzRnZEdobElIZHZjbXRsY2lCemIzVnlZMlV1WEc0Z0lDQWdJQ0FnSUhkdmNtdGxjbE52ZFhKalpTeGNibHh1SUNBZ0lDQWdJQ0F2THlCTlpYUmhjSEp2WjNKaGJXMXBibWNnZFhBZ2RHaHBjeUIzYjNKclpYSWdZMkZzYkM1Y2JpQWdJQ0FnSUNBZ0ozTjBZWEowZFhBb2MyVnNaaWs3SjF4dUlDQWdJQ0FnWFM1cWIybHVLQ2RjWEc0bktWeHVJQ0FnSUYwc0lIc2dkSGx3WlRvZ0oyRndjR3hwWTJGMGFXOXVMMnBoZG1GelkzSnBjSFFuSUgwcE8xeHVYRzRnSUNBZ0x5OGdRMjl1YzNSeWRXTjBJSFJvWlNCM2IzSnJaWElnWVc1a0lITjBZWEowSUdsMElIVndMbHh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0IzYjNKclpYSWdQU0J1WlhjZ1YyOXlhMlZ5S0ZWU1RDNWpjbVZoZEdWUFltcGxZM1JWVWt3b2QyOXlhMlZ5UW14dllpa3BPMXh1SUNBZ0lIMWNiaUFnSUNCallYUmphQ2hsS1NCN1hHNGdJQ0FnSUNCcFppQW9ZMjl1YzI5c1pTQW1KaUJqYjI1emIyeGxMbWx1Wm04cElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNXBibVp2S0Z3aVJtRnBiR1ZrSUhSdklHTnlaV0YwWlNCa2FXWm1hSFJ0YkNCM2IzSnJaWEpjSWl3Z1pTazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUVsbUlIZGxJR05oYm01dmRDQmpjbVZoZEdVZ1lTQlhiM0pyWlhJc0lIUm9aVzRnWkdsellXSnNaU0IwY25scGJtY2dZV2RoYVc0c0lHRnNiQ0IzYjNKclhHNGdJQ0FnSUNBdkx5QjNhV3hzSUdoaGNIQmxiaUJ2YmlCMGFHVWdiV0ZwYmlCVlNTQjBhSEpsWVdRdVhHNGdJQ0FnSUNCb1lYTlhiM0pyWlhJZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnZDI5eWEyVnlPMXh1ZlZ4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbi8vIFRoZXNlIGFyZSBnbG9iYWxseSBkZWZpbmVkIHRvIGF2b2lkIGlzc3VlcyB3aXRoIEpTSGludCB0aGlua2luZyB0aGF0IHdlJ3JlXG4vLyByZWZlcmVuY2luZyB1bmtub3duIGlkZW50aWZpZXJzLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzdGFydHVwO1xudmFyIHBhcnNlSFRNTDtcbnZhciBzeW5jTm9kZTtcbnZhciBwb29scztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBXZWIgV29ya2VyIHNvdXJjZSBjb2RlLiBBbGwgZ2xvYmFscyBoZXJlIGFyZSBkZWZpbmVkIGluIHRoZVxuICogd29ya2VyL2NyZWF0ZSBtb2R1bGUuIFRoaXMgYWxsb3dzIGNvZGUgc2hhcmluZyBhbmQgbGVzcyBkdXBsaWNhdGlvbiBzaW5jZVxuICogbW9zdCBvZiB0aGUgbG9naWMgaXMgaWRlbnRpY2FsIHRvIHRoZSBVSSB0aHJlYWQuXG4gKlxuICogQHBhcmFtIHdvcmtlciAtIEEgd29ya2VyIGluc3RhbmNlXG4gKi9cblxuZnVuY3Rpb24gc3RhcnR1cCh3b3JrZXIpIHtcbiAgdmFyIHBhdGNoZXMgPSBbXTtcbiAgdmFyIG9sZFRyZWUgPSBudWxsO1xuXG4gIC8vIENyZWF0ZSBhcnJheXMgdG8gaG9sZCBlbGVtZW50IGFkZGl0aW9ucyBhbmQgcmVtb3ZhbHMuXG4gIHBhdGNoZXMuYWRkaXRpb25zID0gW107XG4gIHBhdGNoZXMucmVtb3ZhbHMgPSBbXTtcblxuICAvKipcbiAgICogVHJpZ2dlcmVkIHdoZW5ldmVyIGEgYHBvc3RNZXNzYWdlYCBjYWxsIGlzIG1hZGUgb24gdGhlIFdvcmtlciBpbnN0YW5jZVxuICAgKiBmcm9tIHRoZSBVSSB0aHJlYWQuIFNpZ25hbHMgdGhhdCBzb21lIHdvcmsgbmVlZHMgdG8gb2NjdXIuIFdpbGwgcG9zdCBiYWNrXG4gICAqIHRvIHRoZSBtYWluIHRocmVhZCB3aXRoIHBhdGNoIGFuZCBub2RlIHRyYW5zZm9ybSByZXN1bHRzLlxuICAgKlxuICAgKiBAcGFyYW0gZSAtIFRoZSBub3JtYWxpemVkIGV2ZW50IG9iamVjdC5cbiAgICovXG4gIHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBkYXRhID0gZS5kYXRhO1xuICAgIHZhciBpc0lubmVyID0gZGF0YS5pc0lubmVyO1xuICAgIHZhciBuZXdUcmVlID0gbnVsbDtcblxuICAgIC8vIEFsd2F5cyB1bnByb3RlY3QgYWxsb2NhdGlvbnMgYmVmb3JlIHRoZSBzdGFydCBvZiBhIHJlbmRlciBjeWNsZS5cbiAgICBpZiAob2xkVHJlZSkge1xuICAgICAgdW5wcm90ZWN0RWxlbWVudChvbGRUcmVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhbiBgb2xkVHJlZWAgd2FzIHByb3ZpZGVkIGJ5IHRoZSBVSSB0aHJlYWQsIHVzZSB0aGF0IGluIHBsYWNlIG9mIHRoZVxuICAgIC8vIGN1cnJlbnQgYG9sZFRyZWVgLlxuICAgIGlmIChkYXRhLm9sZFRyZWUpIHtcbiAgICAgIG9sZFRyZWUgPSBkYXRhLm9sZFRyZWU7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGBuZXdUcmVlYCB3YXMgcHJvdmlkZWQgdG8gdGhlIHdvcmtlciwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0cnlpbmdcbiAgICAvLyB0byBjcmVhdGUgb25lIGZyb20gSFRNTCBzb3VyY2UuXG4gICAgaWYgKGRhdGEubmV3VHJlZSkge1xuICAgICAgbmV3VHJlZSA9IGRhdGEubmV3VHJlZTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBgbmV3VHJlZWAgd2FzIHByb3ZpZGVkLCB3ZSdsbCBoYXZlIHRvIHRyeSBhbmQgY3JlYXRlIG9uZSBmcm9tIHRoZVxuICAgIC8vIEhUTUwgc291cmNlIHByb3ZpZGVkLlxuICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhLm5ld0hUTUwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSBhIG5ldyB0cmVlLlxuICAgICAgICBuZXdUcmVlID0gcGFyc2VIVE1MKGRhdGEubmV3SFRNTCwgaXNJbm5lcik7XG5cbiAgICAgICAgLy8gSWYgdGhlIG9wZXJhdGlvbiBpcyBmb3IgYGlubmVySFRNTGAgdGhlbiB3ZSdsbCByZXRhaW4gdGhlIHByZXZpb3VzXG4gICAgICAgIC8vIHRyZWUncyBhdHRyaWJ1dGVzLCBub2RlTmFtZSwgYW5kIG5vZGVWYWx1ZSwgYW5kIG9ubHkgYWRqdXN0IHRoZVxuICAgICAgICAvLyBjaGlsZE5vZGVzLlxuICAgICAgICBpZiAoaXNJbm5lcikge1xuICAgICAgICAgIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZTtcblxuICAgICAgICAgIG5ld1RyZWUgPSB7XG4gICAgICAgICAgICBjaGlsZE5vZGVzOiBjaGlsZE5vZGVzLFxuICAgICAgICAgICAgYXR0cmlidXRlczogb2xkVHJlZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgZWxlbWVudDogb2xkVHJlZS5lbGVtZW50LFxuICAgICAgICAgICAgbm9kZU5hbWU6IG9sZFRyZWUubm9kZU5hbWUsXG4gICAgICAgICAgICBub2RlVmFsdWU6IG9sZFRyZWUubm9kZVZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLy8gU3luY2hyb25pemUgdGhlIG9sZCB2aXJ0dWFsIHRyZWUgd2l0aCB0aGUgbmV3IHZpcnR1YWwgdHJlZS4gIFRoaXMgd2lsbFxuICAgIC8vIHByb2R1Y2UgYSBzZXJpZXMgb2YgcGF0Y2hlcyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gdXBkYXRlIHRoZSBET00uXG4gICAgc3luY05vZGUuY2FsbChwYXRjaGVzLCBvbGRUcmVlLCBuZXdUcmVlKTtcblxuICAgIC8vIFByb3RlY3QgdGhlIGN1cnJlbnQgYG9sZFRyZWVgIHNvIHRoYXQgbm8gTm9kZXMgd2lsbCBiZSBhY2NpZGVudGFsbHlcbiAgICAvLyByZWN5Y2xlZCBpbiB0aGVcbiAgICBwcm90ZWN0RWxlbWVudChvbGRUcmVlKTtcblxuICAgIC8vIFNlbmQgdGhlIHBhdGNoZXMgYmFjayB0byB0aGUgdXNlcmxhbmQuXG4gICAgd29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIC8vIE5vZGUgb3BlcmF0aW9uYWwgY2hhbmdlcywgYWRkaXRpb25zIGFuZCByZW1vdmFscy5cbiAgICAgIG5vZGVzOiB7XG4gICAgICAgIGFkZGl0aW9uczogcGF0Y2hlcy5hZGRpdGlvbnMsXG4gICAgICAgIHJlbW92YWxzOiBwYXRjaGVzLnJlbW92YWxzXG4gICAgICB9LFxuXG4gICAgICAvLyBBbGwgdGhlIHBhdGNoZXMgdG8gYXBwbHkgdG8gdGhlIERPTS5cbiAgICAgIHBhdGNoZXM6IHBhdGNoZXNcbiAgICB9KTtcblxuICAgIC8vIFJlY3ljbGUgYWxsb2NhdGVkIG9iamVjdHMgYmFjayBpbnRvIHRoZSBwb29sLlxuICAgIGNsZWFuTWVtb3J5KCk7XG5cbiAgICAvLyBXaXBlIG91dCB0aGUgcGF0Y2hlcyBpbiBtZW1vcnkuXG4gICAgcGF0Y2hlcy5sZW5ndGggPSAwO1xuICAgIHBhdGNoZXMuYWRkaXRpb25zLmxlbmd0aCA9IDA7XG4gICAgcGF0Y2hlcy5yZW1vdmFscy5sZW5ndGggPSAwO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM2R2Y210bGNpOXpiM1Z5WTJVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3pzN096czdPM0ZDUVdWWExFOUJRVTg3UVVGWUwwSXNTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxGRkJRVkVzUTBGQlF6dEJRVU5pTEVsQlFVa3NTMEZCU3l4RFFVRkRPenM3T3pzN096czdPMEZCVTBzc1UwRkJVeXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzUkRMRTFCUVVrc1QwRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU5xUWl4TlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU03T3p0QlFVZHVRaXhUUVVGUExFTkJRVU1zVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTjJRaXhUUVVGUExFTkJRVU1zVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXpzN096czdPenM3TzBGQlUzUkNMRkZCUVUwc1EwRkJReXhUUVVGVExFZEJRVWNzVlVGQlV5eERRVUZETEVWQlFVVTdRVUZETjBJc1VVRkJTU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTnNRaXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUXpOQ0xGRkJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXpzN08wRkJSMjVDTEZGQlFVa3NUMEZCVHl4RlFVRkZPMEZCUVVVc2MwSkJRV2RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkJSVHM3T3p0QlFVa3pReXhSUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZCUlN4aFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF6dExRVUZGT3pzN08wRkJTVGRETEZGQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVGRkxHRkJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPMHRCUVVVN096czdVMEZKZUVNc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF5eFBRVUZQTEV0QlFVc3NVVUZCVVN4RlFVRkZPenRCUVVWNlF5eGxRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPenM3TzBGQlN6TkRMRmxCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMWdzWTBGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRPenRCUVVWNlFpeHBRa0ZCVHl4SFFVRkhPMEZCUTFJc2MwSkJRVlVzUlVGQlZpeFZRVUZWTzBGQlExWXNjMEpCUVZVc1JVRkJSU3hQUVVGUExFTkJRVU1zVlVGQlZUdEJRVU01UWl4dFFrRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eFBRVUZQTzBGQlEzaENMRzlDUVVGUkxFVkJRVVVzVDBGQlR5eERRVUZETEZGQlFWRTdRVUZETVVJc2NVSkJRVk1zUlVGQlJTeFBRVUZQTEVOQlFVTXNVMEZCVXp0WFFVTTNRaXhEUVVGRE8xTkJRMGc3VDBGRFJqczdPenRCUVVsRUxGbEJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6czdPenRCUVVsNlF5eHJRa0ZCWXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE96czdRVUZIZUVJc1ZVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF6czdRVUZGYWtJc1YwRkJTeXhGUVVGRk8wRkJRMHdzYVVKQlFWTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1UwRkJVenRCUVVNMVFpeG5Ra0ZCVVN4RlFVRkZMRTlCUVU4c1EwRkJReXhSUVVGUk8wOUJRek5DT3pzN1FVRkhSQ3hoUVVGUExFVkJRVVVzVDBGQlR6dExRVU5xUWl4RFFVRkRMRU5CUVVNN096dEJRVWRJTEdWQlFWY3NSVUZCUlN4RFFVRkRPenM3UVVGSFpDeFhRVUZQTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOdVFpeFhRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRE4wSXNWMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBkQlF6ZENMRU5CUVVNN1EwRkRTQ0lzSW1acGJHVWlPaUl2YUc5dFpTOTBhVzB2WjJsMEwyUnBabVpvZEcxc0wyeHBZaTkzYjNKclpYSXZjMjkxY21ObExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzR2THlCVWFHVnpaU0JoY21VZ1oyeHZZbUZzYkhrZ1pHVm1hVzVsWkNCMGJ5QmhkbTlwWkNCcGMzTjFaWE1nZDJsMGFDQktVMGhwYm5RZ2RHaHBibXRwYm1jZ2RHaGhkQ0IzWlNkeVpWeHVMeThnY21WbVpYSmxibU5wYm1jZ2RXNXJibTkzYmlCcFpHVnVkR2xtYVdWeWN5NWNiblpoY2lCd1lYSnpaVWhVVFV3N1hHNTJZWElnYzNsdVkwNXZaR1U3WEc1MllYSWdjRzl2YkhNN1hHNWNiaThxS2x4dUlDb2dWR2hwY3lCcGN5QjBhR1VnVjJWaUlGZHZjbXRsY2lCemIzVnlZMlVnWTI5a1pTNGdRV3hzSUdkc2IySmhiSE1nYUdWeVpTQmhjbVVnWkdWbWFXNWxaQ0JwYmlCMGFHVmNiaUFxSUhkdmNtdGxjaTlqY21WaGRHVWdiVzlrZFd4bExpQlVhR2x6SUdGc2JHOTNjeUJqYjJSbElITm9ZWEpwYm1jZ1lXNWtJR3hsYzNNZ1pIVndiR2xqWVhScGIyNGdjMmx1WTJWY2JpQXFJRzF2YzNRZ2IyWWdkR2hsSUd4dloybGpJR2x6SUdsa1pXNTBhV05oYkNCMGJ5QjBhR1VnVlVrZ2RHaHlaV0ZrTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0IzYjNKclpYSWdMU0JCSUhkdmNtdGxjaUJwYm5OMFlXNWpaVnh1SUNvdlhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlCemRHRnlkSFZ3S0hkdmNtdGxjaWtnZTF4dUlDQjJZWElnY0dGMFkyaGxjeUE5SUZ0ZE8xeHVJQ0IyWVhJZ2IyeGtWSEpsWlNBOUlHNTFiR3c3WEc1Y2JpQWdMeThnUTNKbFlYUmxJR0Z5Y21GNWN5QjBieUJvYjJ4a0lHVnNaVzFsYm5RZ1lXUmthWFJwYjI1eklHRnVaQ0J5WlcxdmRtRnNjeTVjYmlBZ2NHRjBZMmhsY3k1aFpHUnBkR2x2Ym5NZ1BTQmJYVHRjYmlBZ2NHRjBZMmhsY3k1eVpXMXZkbUZzY3lBOUlGdGRPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlVjbWxuWjJWeVpXUWdkMmhsYm1WMlpYSWdZU0JnY0c5emRFMWxjM05oWjJWZ0lHTmhiR3dnYVhNZ2JXRmtaU0J2YmlCMGFHVWdWMjl5YTJWeUlHbHVjM1JoYm1ObFhHNGdJQ0FxSUdaeWIyMGdkR2hsSUZWSklIUm9jbVZoWkM0Z1UybG5ibUZzY3lCMGFHRjBJSE52YldVZ2QyOXlheUJ1WldWa2N5QjBieUJ2WTJOMWNpNGdWMmxzYkNCd2IzTjBJR0poWTJ0Y2JpQWdJQ29nZEc4Z2RHaGxJRzFoYVc0Z2RHaHlaV0ZrSUhkcGRHZ2djR0YwWTJnZ1lXNWtJRzV2WkdVZ2RISmhibk5tYjNKdElISmxjM1ZzZEhNdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQmxJQzBnVkdobElHNXZjbTFoYkdsNlpXUWdaWFpsYm5RZ2IySnFaV04wTGx4dUlDQWdLaTljYmlBZ2QyOXlhMlZ5TG05dWJXVnpjMkZuWlNBOUlHWjFibU4wYVc5dUtHVXBJSHRjYmlBZ0lDQjJZWElnWkdGMFlTQTlJR1V1WkdGMFlUdGNiaUFnSUNCMllYSWdhWE5KYm01bGNpQTlJR1JoZEdFdWFYTkpibTVsY2p0Y2JpQWdJQ0IyWVhJZ2JtVjNWSEpsWlNBOUlHNTFiR3c3WEc1Y2JpQWdJQ0F2THlCQmJIZGhlWE1nZFc1d2NtOTBaV04wSUdGc2JHOWpZWFJwYjI1eklHSmxabTl5WlNCMGFHVWdjM1JoY25RZ2IyWWdZU0J5Wlc1a1pYSWdZM2xqYkdVdVhHNGdJQ0FnYVdZZ0tHOXNaRlJ5WldVcElIc2dkVzV3Y205MFpXTjBSV3hsYldWdWRDaHZiR1JVY21WbEtUc2dmVnh1WEc0Z0lDQWdMeThnU1dZZ1lXNGdZRzlzWkZSeVpXVmdJSGRoY3lCd2NtOTJhV1JsWkNCaWVTQjBhR1VnVlVrZ2RHaHlaV0ZrTENCMWMyVWdkR2hoZENCcGJpQndiR0ZqWlNCdlppQjBhR1ZjYmlBZ0lDQXZMeUJqZFhKeVpXNTBJR0J2YkdSVWNtVmxZQzVjYmlBZ0lDQnBaaUFvWkdGMFlTNXZiR1JVY21WbEtTQjdJRzlzWkZSeVpXVWdQU0JrWVhSaExtOXNaRlJ5WldVN0lIMWNibHh1SUNBZ0lDOHZJRWxtSUhSb1pTQmdibVYzVkhKbFpXQWdkMkZ6SUhCeWIzWnBaR1ZrSUhSdklIUm9aU0IzYjNKclpYSXNJSFZ6WlNCMGFHRjBJR2x1YzNSbFlXUWdiMllnZEhKNWFXNW5YRzRnSUNBZ0x5OGdkRzhnWTNKbFlYUmxJRzl1WlNCbWNtOXRJRWhVVFV3Z2MyOTFjbU5sTGx4dUlDQWdJR2xtSUNoa1lYUmhMbTVsZDFSeVpXVXBJSHNnYm1WM1ZISmxaU0E5SUdSaGRHRXVibVYzVkhKbFpUc2dmVnh1WEc0Z0lDQWdMeThnU1dZZ2JtOGdZRzVsZDFSeVpXVmdJSGRoY3lCd2NtOTJhV1JsWkN3Z2QyVW5iR3dnYUdGMlpTQjBieUIwY25rZ1lXNWtJR055WldGMFpTQnZibVVnWm5KdmJTQjBhR1ZjYmlBZ0lDQXZMeUJJVkUxTUlITnZkWEpqWlNCd2NtOTJhV1JsWkM1Y2JpQWdJQ0JsYkhObElHbG1JQ2gwZVhCbGIyWWdaR0YwWVM1dVpYZElWRTFNSUQwOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdMeThnUTJGc1kzVnNZWFJsSUdFZ2JtVjNJSFJ5WldVdVhHNGdJQ0FnSUNCdVpYZFVjbVZsSUQwZ2NHRnljMlZJVkUxTUtHUmhkR0V1Ym1WM1NGUk5UQ3dnYVhOSmJtNWxjaWs3WEc1Y2JpQWdJQ0FnSUM4dklFbG1JSFJvWlNCdmNHVnlZWFJwYjI0Z2FYTWdabTl5SUdCcGJtNWxja2hVVFV4Z0lIUm9aVzRnZDJVbmJHd2djbVYwWVdsdUlIUm9aU0J3Y21WMmFXOTFjMXh1SUNBZ0lDQWdMeThnZEhKbFpTZHpJR0YwZEhKcFluVjBaWE1zSUc1dlpHVk9ZVzFsTENCaGJtUWdibTlrWlZaaGJIVmxMQ0JoYm1RZ2IyNXNlU0JoWkdwMWMzUWdkR2hsWEc0Z0lDQWdJQ0F2THlCamFHbHNaRTV2WkdWekxseHVJQ0FnSUNBZ2FXWWdLR2x6U1c1dVpYSXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHTm9hV3hrVG05a1pYTWdQU0J1WlhkVWNtVmxPMXh1WEc0Z0lDQWdJQ0FnSUc1bGQxUnlaV1VnUFNCN1hHNGdJQ0FnSUNBZ0lDQWdZMmhwYkdST2IyUmxjeXhjYmlBZ0lDQWdJQ0FnSUNCaGRIUnlhV0oxZEdWek9pQnZiR1JVY21WbExtRjBkSEpwWW5WMFpYTXNYRzRnSUNBZ0lDQWdJQ0FnWld4bGJXVnVkRG9nYjJ4a1ZISmxaUzVsYkdWdFpXNTBMRnh1SUNBZ0lDQWdJQ0FnSUc1dlpHVk9ZVzFsT2lCdmJHUlVjbVZsTG01dlpHVk9ZVzFsTEZ4dUlDQWdJQ0FnSUNBZ0lHNXZaR1ZXWVd4MVpUb2diMnhrVkhKbFpTNXViMlJsVm1Gc2RXVmNiaUFnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJUZVc1amFISnZibWw2WlNCMGFHVWdiMnhrSUhacGNuUjFZV3dnZEhKbFpTQjNhWFJvSUhSb1pTQnVaWGNnZG1seWRIVmhiQ0IwY21WbExpQWdWR2hwY3lCM2FXeHNYRzRnSUNBZ0x5OGdjSEp2WkhWalpTQmhJSE5sY21sbGN5QnZaaUJ3WVhSamFHVnpJSFJvWVhRZ2QybHNiQ0JpWlNCbGVHVmpkWFJsWkNCMGJ5QjFjR1JoZEdVZ2RHaGxJRVJQVFM1Y2JpQWdJQ0J6ZVc1alRtOWtaUzVqWVd4c0tIQmhkR05vWlhNc0lHOXNaRlJ5WldVc0lHNWxkMVJ5WldVcE8xeHVYRzRnSUNBZ0x5OGdVSEp2ZEdWamRDQjBhR1VnWTNWeWNtVnVkQ0JnYjJ4a1ZISmxaV0FnYzI4Z2RHaGhkQ0J1YnlCT2IyUmxjeUIzYVd4c0lHSmxJR0ZqWTJsa1pXNTBZV3hzZVZ4dUlDQWdJQzh2SUhKbFkzbGpiR1ZrSUdsdUlIUm9aVnh1SUNBZ0lIQnliM1JsWTNSRmJHVnRaVzUwS0c5c1pGUnlaV1VwTzF4dVhHNGdJQ0FnTHk4Z1UyVnVaQ0IwYUdVZ2NHRjBZMmhsY3lCaVlXTnJJSFJ2SUhSb1pTQjFjMlZ5YkdGdVpDNWNiaUFnSUNCM2IzSnJaWEl1Y0c5emRFMWxjM05oWjJVb2UxeHVJQ0FnSUNBZ0x5OGdUbTlrWlNCdmNHVnlZWFJwYjI1aGJDQmphR0Z1WjJWekxDQmhaR1JwZEdsdmJuTWdZVzVrSUhKbGJXOTJZV3h6TGx4dUlDQWdJQ0FnYm05a1pYTTZJSHRjYmlBZ0lDQWdJQ0FnWVdSa2FYUnBiMjV6T2lCd1lYUmphR1Z6TG1Ga1pHbDBhVzl1Y3l4Y2JpQWdJQ0FnSUNBZ2NtVnRiM1poYkhNNklIQmhkR05vWlhNdWNtVnRiM1poYkhOY2JpQWdJQ0FnSUgwc1hHNWNiaUFnSUNBZ0lDOHZJRUZzYkNCMGFHVWdjR0YwWTJobGN5QjBieUJoY0hCc2VTQjBieUIwYUdVZ1JFOU5MbHh1SUNBZ0lDQWdjR0YwWTJobGN6b2djR0YwWTJobGMxeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ0x5OGdVbVZqZVdOc1pTQmhiR3h2WTJGMFpXUWdiMkpxWldOMGN5QmlZV05ySUdsdWRHOGdkR2hsSUhCdmIyd3VYRzRnSUNBZ1kyeGxZVzVOWlcxdmNua29LVHRjYmx4dUlDQWdJQzh2SUZkcGNHVWdiM1YwSUhSb1pTQndZWFJqYUdWeklHbHVJRzFsYlc5eWVTNWNiaUFnSUNCd1lYUmphR1Z6TG14bGJtZDBhQ0E5SURBN1hHNGdJQ0FnY0dGMFkyaGxjeTVoWkdScGRHbHZibk11YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0J3WVhSamFHVnpMbkpsYlc5MllXeHpMbXhsYm1kMGFDQTlJREE3WEc0Z0lIMDdYRzU5WEc0aVhYMD0iLCJcbnZhciBOYXRpdmVDdXN0b21FdmVudCA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuZnVuY3Rpb24gdXNlTmF0aXZlICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcCA9IG5ldyBOYXRpdmVDdXN0b21FdmVudCgnY2F0JywgeyBkZXRhaWw6IHsgZm9vOiAnYmFyJyB9IH0pO1xuICAgIHJldHVybiAgJ2NhdCcgPT09IHAudHlwZSAmJiAnYmFyJyA9PT0gcC5kZXRhaWwuZm9vO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgYEN1c3RvbUV2ZW50YCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQuQ3VzdG9tRXZlbnRcbiAqXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IE5hdGl2ZUN1c3RvbUV2ZW50IDpcblxuLy8gSUUgPj0gOVxuJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID8gZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfSBlbHNlIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIGU7XG59IDpcblxuLy8gSUUgPD0gOFxuZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gIGUudHlwZSA9IHR5cGU7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmJ1YmJsZXMgPSBCb29sZWFuKHBhcmFtcy5idWJibGVzKTtcbiAgICBlLmNhbmNlbGFibGUgPSBCb29sZWFuKHBhcmFtcy5jYW5jZWxhYmxlKTtcbiAgICBlLmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gIH0gZWxzZSB7XG4gICAgZS5idWJibGVzID0gZmFsc2U7XG4gICAgZS5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgZS5kZXRhaWwgPSB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG4iXX0=
