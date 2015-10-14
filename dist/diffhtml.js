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
var empty = {};

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

;  var global = (function(){ return this; }).call(null);  if(typeof __filename !== 'undefined'){    var moduleName = __filename.slice(0, __filename.lastIndexOf('.')).replace(/\\/g, '/');    global.require[moduleName] = module.exports;  }

}).call(this,"/lib/element/make.js")

},{"../node/make":6,"../svg":11,"./custom":1}],4:[function(require,module,exports){
(function (__filename){
  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }  var global = (function(){ return this; }).call(null);  if(!global.require){    global.require = function require(key){        return global.require[key.replace(/\\/g, '/')];    };    (function(){    var require = global.require;    var ret = global.require;    Object.defineProperty(global, 'require', {        get: function(){          return ret;        },        set: function(newRequire){            ret = function(key){                key = key.replace(/\\/g, '/');                if(require[key]){                  return require[key];                }else if(require[key + '/index']){                  return require[key + '/index'];                }else{                  var temp = ret;                  var module;                  ret = newRequire;                  try {                    module = newRequire(key);                  }                  catch(e){                    ret = temp;                    throw e;                  }                  ret = temp;                  return module;                }            };            for(var key in require){              ret[key] = require[key];            }        }    });    })();  }'use strict';

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
              currentParent.nodeValue = data.slice(kMarkupPattern.lastIndex, index);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9lbGVtZW50L2N1c3RvbS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL2VsZW1lbnQvZ2V0LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvZWxlbWVudC9tYWtlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvZXJyb3JzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvaW5kZXguanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9ub2RlL21ha2UuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi9ub2RlL3BhdGNoLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS9zeW5jLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvbm9kZS90cmVlLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvcGF0Y2hlcy9wcm9jZXNzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvc3ZnLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdHJhbnNpdGlvbnMuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL2RlY29kZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3V0aWwvbWVtb3J5LmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC9wYXJzZXIuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL2xpYi91dGlsL3Bvb2xzLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvdXRpbC91dWlkLmpzIiwiL2hvbWUvdGltL2dpdC9kaWZmaHRtbC9saWIvd29ya2VyL2NyZWF0ZS5qcyIsIi9ob21lL3RpbS9naXQvZGlmZmh0bWwvbGliL3dvcmtlci9zb3VyY2UuanMiLCIvaG9tZS90aW0vZ2l0L2RpZmZodG1sL25vZGVfbW9kdWxlcy9jdXN0b20tZXZlbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3JVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzVUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDOVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBTdG9yZSBhbGwgY3VzdG9tIGVsZW1lbnRzIGluIHRoaXMgb2JqZWN0LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudXBncmFkZSA9IHVwZ3JhZGU7XG52YXIgY29tcG9uZW50cyA9IHt9O1xuXG5leHBvcnRzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xudmFyIGVtcHR5ID0ge307XG5cbi8qKlxuICogRW5zdXJlcyB0aGUgZWxlbWVudCBpbnN0YW5jZSBtYXRjaGVzIHRoZSBDdXN0b21FbGVtZW50J3MgcHJvdG90eXBlLlxuICpcbiAqIEBwYXJhbSB0YWdOYW1lXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc2Z1bGx5IHVwZ3JhZGVkXG4gKi9cblxuZnVuY3Rpb24gdXBncmFkZSh0YWdOYW1lLCBlbGVtZW50KSB7XG4gIHZhciBDdXN0b21FbGVtZW50ID0gY29tcG9uZW50c1t0YWdOYW1lXSB8fCBlbXB0eTtcblxuICAvLyBObyBuZWVkIHRvIHVwZ3JhZGUgaWYgYWxyZWFkeSBhIHN1YmNsYXNzLlxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBDb3B5IHRoZSBwcm90b3R5cGUgaW50byB0aGUgRWxlbWVudC5cbiAgaWYgKEN1c3RvbUVsZW1lbnQgIT09IGVtcHR5KSB7XG4gICAgZWxlbWVudC5fX3Byb3RvX18gPSBPYmplY3QuY3JlYXRlKEN1c3RvbUVsZW1lbnQucHJvdG90eXBlKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2WTNWemRHOXRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenRCUVVkUExFbEJRVWtzVlVGQlZTeEhRVUZITEVWQlFVVXNRMEZCUXpzN08wRkJSVE5DTEVsQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJRenM3T3pzN096czdPenRCUVZOU0xGTkJRVk1zVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRlRU1zVFVGQlNTeGhRVUZoTEVkQlFVY3NWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6czdPMEZCUjJwRUxFMUJRVWtzVDBGQlR5eFpRVUZaTEdGQlFXRXNSVUZCUlR0QlFVTndReXhYUVVGUExFdEJRVXNzUTBGQlF6dEhRVU5rT3pzN1FVRkhSQ3hOUVVGSkxHRkJRV0VzUzBGQlN5eExRVUZMTEVWQlFVVTdRVUZETTBJc1YwRkJUeXhEUVVGRExGTkJRVk1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMR0ZCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU0xUkRzN1FVRkZSQ3hUUVVGUExFbEJRVWtzUTBGQlF6dERRVU5pT3p0QlFVRkJMRU5CUVVNaUxDSm1hV3hsSWpvaUwyaHZiV1V2ZEdsdEwyZHBkQzlrYVdabWFIUnRiQzlzYVdJdlpXeGxiV1Z1ZEM5amRYTjBiMjB1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlGTjBiM0psSUdGc2JDQmpkWE4wYjIwZ1pXeGxiV1Z1ZEhNZ2FXNGdkR2hwY3lCdlltcGxZM1F1WEc0Z0tpOWNibVY0Y0c5eWRDQjJZWElnWTI5dGNHOXVaVzUwY3lBOUlIdDlPMXh1WEc1MllYSWdaVzF3ZEhrZ1BTQjdmVHRjYmx4dUx5b3FYRzRnS2lCRmJuTjFjbVZ6SUhSb1pTQmxiR1Z0Wlc1MElHbHVjM1JoYm1ObElHMWhkR05vWlhNZ2RHaGxJRU4xYzNSdmJVVnNaVzFsYm5RbmN5QndjbTkwYjNSNWNHVXVYRzRnS2x4dUlDb2dRSEJoY21GdElIUmhaMDVoYldWY2JpQXFJRUJ3WVhKaGJTQmxiR1Z0Wlc1MFhHNGdLaUJBY21WMGRYSnVJSHRDYjI5c1pXRnVmU0J6ZFdOalpYTnpablZzYkhrZ2RYQm5jbUZrWldSY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSFZ3WjNKaFpHVW9kR0ZuVG1GdFpTd2daV3hsYldWdWRDa2dlMXh1SUNCMllYSWdRM1Z6ZEc5dFJXeGxiV1Z1ZENBOUlHTnZiWEJ2Ym1WdWRITmJkR0ZuVG1GdFpWMGdmSHdnWlcxd2RIazdYRzVjYmlBZ0x5OGdUbThnYm1WbFpDQjBieUIxY0dkeVlXUmxJR2xtSUdGc2NtVmhaSGtnWVNCemRXSmpiR0Z6Y3k1Y2JpQWdhV1lnS0dWc1pXMWxiblFnYVc1emRHRnVZMlZ2WmlCRGRYTjBiMjFGYkdWdFpXNTBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQjlYRzVjYmlBZ0x5OGdRMjl3ZVNCMGFHVWdjSEp2ZEc5MGVYQmxJR2x1ZEc4Z2RHaGxJRVZzWlcxbGJuUXVYRzRnSUdsbUlDaERkWE4wYjIxRmJHVnRaVzUwSUNFOVBTQmxiWEIwZVNrZ2UxeHVJQ0FnSUdWc1pXMWxiblF1WDE5d2NtOTBiMTlmSUQwZ1QySnFaV04wTG1OeVpXRjBaU2hEZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTazdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JuMDdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXQ7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9ub2RlTWFrZSA9IHJlcXVpcmUoJy4uL25vZGUvbWFrZScpO1xuXG52YXIgX25vZGVNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25vZGVNYWtlKTtcblxudmFyIF9lbGVtZW50TWFrZSA9IHJlcXVpcmUoJy4uL2VsZW1lbnQvbWFrZScpO1xuXG52YXIgX2VsZW1lbnRNYWtlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRNYWtlKTtcblxuLyoqXG4gKiBUYWtlcyBpbiBhbiBlbGVtZW50IHJlZmVyZW5jZSBhbmQgcmVzb2x2ZSBpdCB0byBhIHV1aWQgYW5kIERPTSBub2RlLlxuICpcbiAqIEBwYXJhbSByZWYgLSBFbGVtZW50IGRlc2NyaXB0b3JcbiAqIEByZXR1cm4ge09iamVjdH0gY29udGFpbmluZyB0aGUgdXVpZCBhbmQgRE9NIG5vZGUuXG4gKi9cblxuZnVuY3Rpb24gZ2V0KHJlZikge1xuICB2YXIgdXVpZCA9IHJlZi5lbGVtZW50IHx8IHJlZjtcbiAgdmFyIGVsZW1lbnQgPSBfbm9kZU1ha2UyWydkZWZhdWx0J10ubm9kZXNbdXVpZF0gfHwgKDAsIF9lbGVtZW50TWFrZTJbJ2RlZmF1bHQnXSkocmVmKTtcblxuICByZXR1cm4geyBlbGVtZW50OiBlbGVtZW50LCB1dWlkOiB1dWlkIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyVnNaVzFsYm5RdloyVjBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08zRkNRVk4zUWl4SFFVRkhPenM3TzNkQ1FWUk9MR05CUVdNN096czdNa0pCUTFnc2FVSkJRV2xDT3pzN096czdPenM3T3p0QlFWRXhRaXhUUVVGVExFZEJRVWNzUTBGQlF5eEhRVUZITEVWQlFVVTdRVUZETDBJc1RVRkJTU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eERRVUZETEU5QlFVOHNTVUZCU1N4SFFVRkhMRU5CUVVNN1FVRkRPVUlzVFVGQlNTeFBRVUZQTEVkQlFVY3NjMEpCUVZNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTERoQ1FVRlpMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVYyUkN4VFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGUUxFOUJRVThzUlVGQlJTeEpRVUZKTEVWQlFVb3NTVUZCU1N4RlFVRkZMRU5CUVVNN1EwRkRNVUlpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2Wld4bGJXVnVkQzluWlhRdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdiV0ZyWlU1dlpHVWdabkp2YlNBbkxpNHZibTlrWlM5dFlXdGxKenRjYm1sdGNHOXlkQ0J0WVd0bFJXeGxiV1Z1ZENCbWNtOXRJQ2N1TGk5bGJHVnRaVzUwTDIxaGEyVW5PMXh1WEc0dktpcGNiaUFxSUZSaGEyVnpJR2x1SUdGdUlHVnNaVzFsYm5RZ2NtVm1aWEpsYm1ObElHRnVaQ0J5WlhOdmJIWmxJR2wwSUhSdklHRWdkWFZwWkNCaGJtUWdSRTlOSUc1dlpHVXVYRzRnS2x4dUlDb2dRSEJoY21GdElISmxaaUF0SUVWc1pXMWxiblFnWkdWelkzSnBjSFJ2Y2x4dUlDb2dRSEpsZEhWeWJpQjdUMkpxWldOMGZTQmpiMjUwWVdsdWFXNW5JSFJvWlNCMWRXbGtJR0Z1WkNCRVQwMGdibTlrWlM1Y2JpQXFMMXh1Wlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNGdaMlYwS0hKbFppa2dlMXh1SUNCc1pYUWdkWFZwWkNBOUlISmxaaTVsYkdWdFpXNTBJSHg4SUhKbFpqdGNiaUFnYkdWMElHVnNaVzFsYm5RZ1BTQnRZV3RsVG05a1pTNXViMlJsYzF0MWRXbGtYU0I4ZkNCdFlXdGxSV3hsYldWdWRDaHlaV1lwTzF4dVhHNGdJSEpsZEhWeWJpQjdJR1ZzWlcxbGJuUXNJSFYxYVdRZ2ZUdGNibjFjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWFrZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqWydkZWZhdWx0J10gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG52YXIgX3N2ZyA9IHJlcXVpcmUoJy4uL3N2ZycpO1xuXG52YXIgc3ZnID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3N2Zyk7XG5cbnZhciBfbm9kZU1ha2UgPSByZXF1aXJlKCcuLi9ub2RlL21ha2UnKTtcblxudmFyIF9ub2RlTWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlTWFrZSk7XG5cbnZhciBfY3VzdG9tID0gcmVxdWlyZSgnLi9jdXN0b20nKTtcblxudmFyIGVtcHR5ID0geyBwcm90b3R5cGU6IHt9IH07XG5cbi8qKlxuICogVGFrZXMgaW4gYSB2aXJ0dWFsIGRlc2NyaXB0b3IgYW5kIGNyZWF0ZXMgYW4gSFRNTCBlbGVtZW50LiBTZXQncyB0aGUgZWxlbWVudFxuICogaW50byB0aGUgY2FjaGUuXG4gKlxuICogQHBhcmFtIGRlc2NyaXB0b3JcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cblxuZnVuY3Rpb24gbWFrZShkZXNjcmlwdG9yKSB7XG4gIHZhciBlbGVtZW50ID0gbnVsbDtcbiAgdmFyIGlzU3ZnID0gZmFsc2U7XG5cbiAgaWYgKF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tkZXNjcmlwdG9yLmVsZW1lbnRdKSB7XG4gICAgcmV0dXJuIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tkZXNjcmlwdG9yLmVsZW1lbnRdO1xuICB9XG5cbiAgaWYgKGRlc2NyaXB0b3Iubm9kZU5hbWUgPT09ICcjdGV4dCcpIHtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGVzY3JpcHRvci5ub2RlVmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChzdmcuZWxlbWVudHMuaW5kZXhPZihkZXNjcmlwdG9yLm5vZGVOYW1lKSA+IC0xKSB7XG4gICAgICBpc1N2ZyA9IHRydWU7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Zy5uYW1lc3BhY2UsIGRlc2NyaXB0b3Iubm9kZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkZXNjcmlwdG9yLm5vZGVOYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRvci5hdHRyaWJ1dGVzICYmIGRlc2NyaXB0b3IuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzY3JpcHRvci5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyaWJ1dGUgPSBkZXNjcmlwdG9yLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkZXNjcmlwdG9yLmNoaWxkTm9kZXMgJiYgZGVzY3JpcHRvci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXNjcmlwdG9yLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChtYWtlKGRlc2NyaXB0b3IuY2hpbGROb2Rlc1tpXSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEFsd2F5cyBzZXQgdGhlIG5vZGUncyB2YWx1ZS5cbiAgaWYgKGRlc2NyaXB0b3Iubm9kZVZhbHVlKSB7XG4gICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGRlc2NyaXB0b3Iubm9kZVZhbHVlO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvciBmb3IgYSBnaXZlbiBlbGVtZW50LlxuICB2YXIgY3VzdG9tRWxlbWVudCA9IF9jdXN0b20uY29tcG9uZW50c1tkZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICAvLyBDdXN0b20gZWxlbWVudHMgaGF2ZSBhIGNvbnN0cnVjdG9yIG1ldGhvZCB0aGF0IHNob3VsZCBiZSBjYWxsZWQuXG4gIGlmIChjdXN0b21FbGVtZW50LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwoZWxlbWVudCk7XG4gIH1cblxuICAvLyBDdXN0b20gZWxlbWVudHMgaGF2ZSBhIGNyZWF0ZWRDYWxsYmFjayBtZXRob2QgdGhhdCBzaG91bGQgYmUgY2FsbGVkLlxuICBpZiAoY3VzdG9tRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlZENhbGxiYWNrKSB7XG4gICAgY3VzdG9tRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlZENhbGxiYWNrLmNhbGwoZWxlbWVudCk7XG4gIH1cblxuICAvLyBBZGQgdG8gdGhlIG5vZGVzIGNhY2hlIHVzaW5nIHRoZSBkZXNpZ25hdGVkIHV1aWQgYXMgdGhlIGxvb2t1cCBrZXkuXG4gIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tkZXNjcmlwdG9yLmVsZW1lbnRdID0gZWxlbWVudDtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDJWc1pXMWxiblF2YldGclpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRmhkMElzU1VGQlNUczdPenM3TzIxQ1FXSlFMRkZCUVZFN08wbEJRV3BDTEVkQlFVYzdPM2RDUVVOTkxHTkJRV003T3pzN2MwSkJRMUlzVlVGQlZUczdRVUZGY2tNc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeFRRVUZUTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN096czdPenM3T3pzN1FVRlRaaXhUUVVGVExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVTdRVUZEZGtNc1RVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyNUNMRTFCUVVrc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6czdRVUZGYkVJc1RVRkJTU3h6UWtGQlV5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhGUVVGRk8wRkJRM1JETEZkQlFVOHNjMEpCUVZNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SFFVTXpRenM3UVVGRlJDeE5RVUZKTEZWQlFWVXNRMEZCUXl4UlFVRlJMRXRCUVVzc1QwRkJUeXhGUVVGRk8wRkJRMjVETEZkQlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNc1kwRkJZeXhEUVVGRExGVkJRVlVzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTjZSQ3hOUVVOSk8wRkJRMGdzVVVGQlNTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRVZCUVVVN1FVRkRiRVFzVjBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTmlMR0ZCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1zWlVGQlpTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRVZCUVVVc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzB0QlEzaEZMRTFCUTBrN1FVRkRTQ3hoUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UzBGRGRrUTdPMEZCUlVRc1VVRkJTU3hWUVVGVkxFTkJRVU1zVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM3BFTEZkQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU55UkN4WlFVRkpMRk5CUVZNc1IwRkJSeXhWUVVGVkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNwRExHVkJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdUMEZEZGtRN1MwRkRSanM3UVVGRlJDeFJRVUZKTEZWQlFWVXNRMEZCUXl4VlFVRlZMRWxCUVVrc1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEZWtRc1YwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNKRUxHVkJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTNKRU8wdEJRMFk3UjBGRFJqczdPMEZCUjBRc1RVRkJTU3hWUVVGVkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEzaENMRmRCUVU4c1EwRkJReXhYUVVGWExFZEJRVWNzVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXp0SFFVTTFRenM3TzBGQlIwUXNUVUZCU1N4aFFVRmhMRWRCUVVjc2JVSkJRVmNzVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRXRCUVVzc1EwRkJRenM3TzBGQlJ6ZEVMRTFCUVVrc1lVRkJZU3hEUVVGRExGTkJRVk1zUTBGQlF5eFhRVUZYTEVWQlFVVTdRVUZEZGtNc2FVSkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEhRVU51UkRzN08wRkJSMFFzVFVGQlNTeGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMR1ZCUVdVc1JVRkJSVHRCUVVNelF5eHBRa0ZCWVN4RFFVRkRMRk5CUVZNc1EwRkJReXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMGRCUTNaRU96czdRVUZIUkN4M1FrRkJVeXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJRenM3UVVGRk4wTXNVMEZCVHl4UFFVRlBMRU5CUVVNN1EwRkRhRUlpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2Wld4bGJXVnVkQzl0WVd0bExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJQ29nWVhNZ2MzWm5JR1p5YjIwZ0p5NHVMM04yWnljN1hHNXBiWEJ2Y25RZ2JXRnJaVTV2WkdVZ1puSnZiU0FuTGk0dmJtOWtaUzl0WVd0bEp6dGNibWx0Y0c5eWRDQjdJR052YlhCdmJtVnVkSE1nZlNCbWNtOXRJQ2N1TDJOMWMzUnZiU2M3WEc1Y2JuWmhjaUJsYlhCMGVTQTlJSHNnY0hKdmRHOTBlWEJsT2lCN2ZTQjlPMXh1WEc0dktpcGNiaUFxSUZSaGEyVnpJR2x1SUdFZ2RtbHlkSFZoYkNCa1pYTmpjbWx3ZEc5eUlHRnVaQ0JqY21WaGRHVnpJR0Z1SUVoVVRVd2daV3hsYldWdWRDNGdVMlYwSjNNZ2RHaGxJR1ZzWlcxbGJuUmNiaUFxSUdsdWRHOGdkR2hsSUdOaFkyaGxMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQmtaWE5qY21sd2RHOXlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4dUlDb3ZYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpQnRZV3RsS0dSbGMyTnlhWEIwYjNJcElIdGNiaUFnZG1GeUlHVnNaVzFsYm5RZ1BTQnVkV3hzTzF4dUlDQjJZWElnYVhOVGRtY2dQU0JtWVd4elpUdGNibHh1SUNCcFppQW9iV0ZyWlU1dlpHVXVibTlrWlhOYlpHVnpZM0pwY0hSdmNpNWxiR1Z0Wlc1MFhTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCdFlXdGxUbTlrWlM1dWIyUmxjMXRrWlhOamNtbHdkRzl5TG1Wc1pXMWxiblJkTzF4dUlDQjlYRzVjYmlBZ2FXWWdLR1JsYzJOeWFYQjBiM0l1Ym05a1pVNWhiV1VnUFQwOUlDY2pkR1Y0ZENjcElIdGNiaUFnSUNCbGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsVkdWNGRFNXZaR1VvWkdWelkzSnBjSFJ2Y2k1dWIyUmxWbUZzZFdVcE8xeHVJQ0I5WEc0Z0lHVnNjMlVnZTF4dUlDQWdJR2xtSUNoemRtY3VaV3hsYldWdWRITXVhVzVrWlhoUFppaGtaWE5qY21sd2RHOXlMbTV2WkdWT1lXMWxLU0ErSUMweEtTQjdYRzRnSUNBZ0lDQnBjMU4yWnlBOUlIUnlkV1U3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRFNVRLSE4yWnk1dVlXMWxjM0JoWTJVc0lHUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVXBPMXh1SUNBZ0lIMWNiaUFnSUNCbGJITmxJSHRjYmlBZ0lDQWdJR1ZzWlcxbGJuUWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtHUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2hrWlhOamNtbHdkRzl5TG1GMGRISnBZblYwWlhNZ0ppWWdaR1Z6WTNKcGNIUnZjaTVoZEhSeWFXSjFkR1Z6TG14bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCa1pYTmpjbWx3ZEc5eUxtRjBkSEpwWW5WMFpYTXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJR0YwZEhKcFluVjBaU0E5SUdSbGMyTnlhWEIwYjNJdVlYUjBjbWxpZFhSbGMxdHBYVHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQzV6WlhSQmRIUnlhV0oxZEdVb1lYUjBjbWxpZFhSbExtNWhiV1VzSUdGMGRISnBZblYwWlM1MllXeDFaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dSbGMyTnlhWEIwYjNJdVkyaHBiR1JPYjJSbGN5QW1KaUJrWlhOamNtbHdkRzl5TG1Ob2FXeGtUbTlrWlhNdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElHUmxjMk55YVhCMGIzSXVZMmhwYkdST2IyUmxjeTVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQmxiR1Z0Wlc1MExtRndjR1Z1WkVOb2FXeGtLRzFoYTJVb1pHVnpZM0pwY0hSdmNpNWphR2xzWkU1dlpHVnpXMmxkS1NrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5OGdRV3gzWVhseklITmxkQ0IwYUdVZ2JtOWtaU2R6SUhaaGJIVmxMbHh1SUNCcFppQW9aR1Z6WTNKcGNIUnZjaTV1YjJSbFZtRnNkV1VwSUh0Y2JpQWdJQ0JsYkdWdFpXNTBMblJsZUhSRGIyNTBaVzUwSUQwZ1pHVnpZM0pwY0hSdmNpNXViMlJsVm1Gc2RXVTdYRzRnSUgxY2JseHVJQ0F2THlCSFpYUWdkR2hsSUdOMWMzUnZiU0JsYkdWdFpXNTBJR052Ym5OMGNuVmpkRzl5SUdadmNpQmhJR2RwZG1WdUlHVnNaVzFsYm5RdVhHNGdJSFpoY2lCamRYTjBiMjFGYkdWdFpXNTBJRDBnWTI5dGNHOXVaVzUwYzF0a1pYTmpjbWx3ZEc5eUxtNXZaR1ZPWVcxbFhTQjhmQ0JsYlhCMGVUdGNibHh1SUNBdkx5QkRkWE4wYjIwZ1pXeGxiV1Z1ZEhNZ2FHRjJaU0JoSUdOdmJuTjBjblZqZEc5eUlHMWxkR2h2WkNCMGFHRjBJSE5vYjNWc1pDQmlaU0JqWVd4c1pXUXVYRzRnSUdsbUlDaGpkWE4wYjIxRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlM1amIyNXpkSEoxWTNSdmNpa2dlMXh1SUNBZ0lHTjFjM1J2YlVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTG1OdmJuTjBjblZqZEc5eUxtTmhiR3dvWld4bGJXVnVkQ2s3WEc0Z0lIMWNibHh1SUNBdkx5QkRkWE4wYjIwZ1pXeGxiV1Z1ZEhNZ2FHRjJaU0JoSUdOeVpXRjBaV1JEWVd4c1ltRmpheUJ0WlhSb2IyUWdkR2hoZENCemFHOTFiR1FnWW1VZ1kyRnNiR1ZrTGx4dUlDQnBaaUFvWTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVZM0psWVhSbFpFTmhiR3hpWVdOcktTQjdYRzRnSUNBZ1kzVnpkRzl0Uld4bGJXVnVkQzV3Y205MGIzUjVjR1V1WTNKbFlYUmxaRU5oYkd4aVlXTnJMbU5oYkd3b1pXeGxiV1Z1ZENrN1hHNGdJSDFjYmx4dUlDQXZMeUJCWkdRZ2RHOGdkR2hsSUc1dlpHVnpJR05oWTJobElIVnphVzVuSUhSb1pTQmtaWE5wWjI1aGRHVmtJSFYxYVdRZ1lYTWdkR2hsSUd4dmIydDFjQ0JyWlhrdVhHNGdJRzFoYTJWT2IyUmxMbTV2WkdWelcyUmxjMk55YVhCMGIzSXVaV3hsYldWdWRGMGdQU0JsYkdWdFpXNTBPMXh1WEc0Z0lISmxkSFZ5YmlCbGJHVnRaVzUwTzF4dWZWeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7IHZhciBfYWdhaW4gPSB0cnVlOyBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHsgdmFyIG9iamVjdCA9IF94LCBwcm9wZXJ0eSA9IF94MiwgcmVjZWl2ZXIgPSBfeDM7IGRlc2MgPSBwYXJlbnQgPSBnZXR0ZXIgPSB1bmRlZmluZWQ7IF9hZ2FpbiA9IGZhbHNlOyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3ggPSBwYXJlbnQ7IF94MiA9IHByb3BlcnR5OyBfeDMgPSByZWNlaXZlcjsgX2FnYWluID0gdHJ1ZTsgY29udGludWUgX2Z1bmN0aW9uOyB9IH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfSB9O1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIG1pc3NpbmdTdGFja1RyYWNlID0gJ0Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZXJyb3Igc3RhY2sgdHJhY2VzLic7XG5cbi8qKlxuICogSWRlbnRpZmllcyBhbiBlcnJvciB3aXRoIHRyYW5zaXRpb25zLlxuICovXG5cbnZhciBUcmFuc2l0aW9uU3RhdGVFcnJvciA9IChmdW5jdGlvbiAoX0Vycm9yKSB7XG4gIF9pbmhlcml0cyhUcmFuc2l0aW9uU3RhdGVFcnJvciwgX0Vycm9yKTtcblxuICBmdW5jdGlvbiBUcmFuc2l0aW9uU3RhdGVFcnJvcihtZXNzYWdlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYW5zaXRpb25TdGF0ZUVycm9yKTtcblxuICAgIHZhciBlcnJvciA9IF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFRyYW5zaXRpb25TdGF0ZUVycm9yLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBtaXNzaW5nU3RhY2tUcmFjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIGFuIGVycm9yIHdpdGggcmVnaXN0ZXJpbmcgYW4gZWxlbWVudC5cbiAgICovXG4gIHJldHVybiBUcmFuc2l0aW9uU3RhdGVFcnJvcjtcbn0pKEVycm9yKTtcblxuZXhwb3J0cy5UcmFuc2l0aW9uU3RhdGVFcnJvciA9IFRyYW5zaXRpb25TdGF0ZUVycm9yO1xuXG52YXIgRE9NRXhjZXB0aW9uID0gKGZ1bmN0aW9uIChfRXJyb3IyKSB7XG4gIF9pbmhlcml0cyhET01FeGNlcHRpb24sIF9FcnJvcjIpO1xuXG4gIGZ1bmN0aW9uIERPTUV4Y2VwdGlvbihtZXNzYWdlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERPTUV4Y2VwdGlvbik7XG5cbiAgICB2YXIgZXJyb3IgPSBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihET01FeGNlcHRpb24ucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMubWVzc2FnZSA9ICdVbmNhdWdodCBET01FeGNlcHRpb246ICcgKyBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBtaXNzaW5nU3RhY2tUcmFjZTtcbiAgfVxuXG4gIHJldHVybiBET01FeGNlcHRpb247XG59KShFcnJvcik7XG5cbmV4cG9ydHMuRE9NRXhjZXB0aW9uID0gRE9NRXhjZXB0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyVnljbTl5Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdRVUZCUVN4SlFVRkpMR2xDUVVGcFFpeEhRVUZITERoRFFVRTRReXhEUVVGRE96czdPenM3U1VGTE1VUXNiMEpCUVc5Q08xbEJRWEJDTEc5Q1FVRnZRanM3UVVGRGNFSXNWMEZFUVN4dlFrRkJiMElzUTBGRGJrSXNUMEZCVHl4RlFVRkZPekJDUVVSV0xHOUNRVUZ2UWpzN1FVRkZOMElzVVVGQlNTeExRVUZMTERoQ1FVWkJMRzlDUVVGdlFpdzBRMEZGVml4RFFVRkRPenRCUVVWd1FpeFJRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenRCUVVOMlFpeFJRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhMUVVGTExFbEJRVWtzYVVKQlFXbENMRU5CUVVNN1IwRkRMME03T3pzN08xTkJUbFVzYjBKQlFXOUNPMGRCUVZNc1MwRkJTenM3T3p0SlFWbHNReXhaUVVGWk8xbEJRVm9zV1VGQldUczdRVUZEV2l4WFFVUkJMRmxCUVZrc1EwRkRXQ3hQUVVGUExFVkJRVVU3TUVKQlJGWXNXVUZCV1RzN1FVRkZja0lzVVVGQlNTeExRVUZMTERoQ1FVWkJMRmxCUVZrc05FTkJSVVlzUTBGQlF6czdRVUZGY0VJc1VVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eDVRa0ZCZVVJc1IwRkJSeXhQUVVGUExFTkJRVU03UVVGRGJrUXNVVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eEpRVUZKTEdsQ1FVRnBRaXhEUVVGRE8wZEJReTlET3p0VFFVNVZMRmxCUVZrN1IwRkJVeXhMUVVGTElpd2labWxzWlNJNklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyVnljbTl5Y3k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCdGFYTnphVzVuVTNSaFkydFVjbUZqWlNBOUlDZENjbTkzYzJWeUlHUnZaWE51WEZ3bmRDQnpkWEJ3YjNKMElHVnljbTl5SUhOMFlXTnJJSFJ5WVdObGN5NG5PMXh1WEc0dktpcGNiaUFxSUVsa1pXNTBhV1pwWlhNZ1lXNGdaWEp5YjNJZ2QybDBhQ0IwY21GdWMybDBhVzl1Y3k1Y2JpQXFMMXh1Wlhod2IzSjBJR05zWVhOeklGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlJR1Y0ZEdWdVpITWdSWEp5YjNJZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2lodFpYTnpZV2RsS1NCN1hHNGdJQ0FnYkdWMElHVnljbTl5SUQwZ2MzVndaWElvS1R0Y2JseHVJQ0FnSUhSb2FYTXViV1Z6YzJGblpTQTlJRzFsYzNOaFoyVTdYRzRnSUNBZ2RHaHBjeTV6ZEdGamF5QTlJR1Z5Y205eUxuTjBZV05ySUh4OElHMXBjM05wYm1kVGRHRmphMVJ5WVdObE8xeHVJQ0I5WEc1OVhHNWNiaThxS2x4dUlDb2dTV1JsYm5ScFptbGxjeUJoYmlCbGNuSnZjaUIzYVhSb0lISmxaMmx6ZEdWeWFXNW5JR0Z1SUdWc1pXMWxiblF1WEc0Z0tpOWNibVY0Y0c5eWRDQmpiR0Z6Y3lCRVQwMUZlR05sY0hScGIyNGdaWGgwWlc1a2N5QkZjbkp2Y2lCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0cxbGMzTmhaMlVwSUh0Y2JpQWdJQ0JzWlhRZ1pYSnliM0lnUFNCemRYQmxjaWdwTzF4dVhHNGdJQ0FnZEdocGN5NXRaWE56WVdkbElEMGdKMVZ1WTJGMVoyaDBJRVJQVFVWNFkyVndkR2x2YmpvZ0p5QXJJRzFsYzNOaFoyVTdYRzRnSUNBZ2RHaHBjeTV6ZEdGamF5QTlJR1Z5Y205eUxuTjBZV05ySUh4OElHMXBjM05wYm1kVGRHRmphMVJ5WVdObE8xeHVJQ0I5WEc1OVhHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMub3V0ZXJIVE1MID0gb3V0ZXJIVE1MO1xuZXhwb3J0cy5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG5leHBvcnRzLmVsZW1lbnQgPSBlbGVtZW50O1xuZXhwb3J0cy5yZWxlYXNlID0gcmVsZWFzZTtcbmV4cG9ydHMucmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJFbGVtZW50O1xuZXhwb3J0cy5hZGRUcmFuc2l0aW9uU3RhdGUgPSBhZGRUcmFuc2l0aW9uU3RhdGU7XG5leHBvcnRzLnJlbW92ZVRyYW5zaXRpb25TdGF0ZSA9IHJlbW92ZVRyYW5zaXRpb25TdGF0ZTtcbmV4cG9ydHMuZW5hYmxlUHJvbGx5ZmlsbCA9IGVuYWJsZVByb2xseWZpbGw7XG5cbnZhciBfbm9kZVBhdGNoID0gcmVxdWlyZSgnLi9ub2RlL3BhdGNoJyk7XG5cbnZhciBfdHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuL3RyYW5zaXRpb25zJyk7XG5cbnZhciBfZWxlbWVudEN1c3RvbSA9IHJlcXVpcmUoJy4vZWxlbWVudC9jdXN0b20nKTtcblxuLy8gV2UgZXhwb3J0IHRoZSBUcmFuc2l0aW9uU3RhdGVFcnJvciBjb25zdHJ1Y3RvciBzbyB0aGF0IGluc3RhbmNlb2YgY2hlY2tzIGNhblxuLy8gYmUgbWFkZSBieSB0aG9zZSBwdWJsaWNseSBjb25zdW1pbmcgdGhpcyBsaWJyYXJ5LlxuXG52YXIgX2Vycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnVHJhbnNpdGlvblN0YXRlRXJyb3InLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yO1xuICB9XG59KTtcblxudmFyIHJlYWxSZWdpc3RlckVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQ7XG52YXIgZW1wdHkgPSB7fTtcblxuLyoqXG4gKiBVc2VkIHRvIGRpZmYgdGhlIG91dGVySFRNTCBjb250ZW50cyBvZiB0aGUgcGFzc2VkIGVsZW1lbnQgd2l0aCB0aGUgbWFya3VwXG4gKiBjb250ZW50cy4gIFZlcnkgdXNlZnVsIGZvciBhcHBseWluZyBhIGdsb2JhbCBkaWZmIG9uIHRoZVxuICogYGRvY3VtZW50LmRvY3VtZW50RWxlbWVudGAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBtYXJrdXA9JydcbiAqIEBwYXJhbSBvcHRpb25zPXt9XG4gKi9cblxuZnVuY3Rpb24gb3V0ZXJIVE1MKGVsZW1lbnQpIHtcbiAgdmFyIG1hcmt1cCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/ICcnIDogYXJndW1lbnRzWzFdO1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG4gIG9wdGlvbnMuaW5uZXIgPSBmYWxzZTtcbiAgKDAsIF9ub2RlUGF0Y2gucGF0Y2hOb2RlKShlbGVtZW50LCBtYXJrdXAsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gZGlmZiB0aGUgaW5uZXJIVE1MIGNvbnRlbnRzIG9mIHRoZSBwYXNzZWQgZWxlbWVudCB3aXRoIHRoZSBtYXJrdXBcbiAqIGNvbnRlbnRzLiAgVGhpcyBpcyB1c2VmdWwgd2l0aCBsaWJyYXJpZXMgbGlrZSBCYWNrYm9uZSB0aGF0IHJlbmRlciBWaWV3c1xuICogaW50byBlbGVtZW50IGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG1hcmt1cD0nJ1xuICogQHBhcmFtIG9wdGlvbnM9e31cbiAqL1xuXG5mdW5jdGlvbiBpbm5lckhUTUwoZWxlbWVudCkge1xuICB2YXIgbWFya3VwID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gJycgOiBhcmd1bWVudHNbMV07XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgb3B0aW9ucy5pbm5lciA9IHRydWU7XG4gICgwLCBfbm9kZVBhdGNoLnBhdGNoTm9kZSkoZWxlbWVudCwgbWFya3VwLCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIGRpZmYgdHdvIGVsZW1lbnRzLiAgVGhlIGBpbm5lcmAgQm9vbGVhbiBwcm9wZXJ0eSBjYW4gYmUgc3BlY2lmaWVkIGluXG4gKiB0aGUgb3B0aW9ucyB0byBzZXQgaW5uZXJIVE1MXFxvdXRlckhUTUwgYmVoYXZpb3IuICBCeSBkZWZhdWx0IGl0IGlzXG4gKiBvdXRlckhUTUwuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBuZXdFbGVtZW50XG4gKiBAcGFyYW0gb3B0aW9ucz17fVxuICovXG5cbmZ1bmN0aW9uIGVsZW1lbnQoZWxlbWVudCwgbmV3RWxlbWVudCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG4gICgwLCBfbm9kZVBhdGNoLnBhdGNoTm9kZSkoZWxlbWVudCwgbmV3RWxlbWVudCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogUmVsZWFzZXMgdGhlIHdvcmtlciBhbmQgbWVtb3J5IGFsbG9jYXRlZCB0byB0aGlzIGVsZW1lbnQuIFVzZWZ1bCBmb3JcbiAqIGNvbXBvbmVudHMgdG8gY2xlYW4gdXAgd2hlbiByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gcmVsZWFzZShlbGVtZW50KSB7XG4gICgwLCBfbm9kZVBhdGNoLnJlbGVhc2VOb2RlKShlbGVtZW50KTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlcidzIGEgY29uc3RydWN0b3Igd2l0aCBhbiBlbGVtZW50IHRvIHByb3ZpZGUgbGlmZWN5Y2xlIGV2ZW50cy5cbiAqXG4gKiBAcGFyYW0gdGFnTmFtZVxuICogQHBhcmFtIGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gcmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIGNvbnN0cnVjdG9yKSB7XG4gIC8vIFVwZ3JhZGUgc2ltcGxlIG9iamVjdHMgdG8gaW5oZXJpdCBmcm9tIEhUTUxFbGVtZW50IGFuZCBiZSB1c2FibGUgaW4gYSByZWFsXG4gIC8vIGltcGxlbWVudGF0aW9uLlxuICB2YXIgbm9ybWFsaXplZENvbnN0cnVjdG9yID0gY29uc3RydWN0b3IucHJvdG90eXBlID8gY29uc3RydWN0b3IgOiBudWxsO1xuXG4gIGlmICghbm9ybWFsaXplZENvbnN0cnVjdG9yKSB7XG4gICAgY29uc3RydWN0b3IuX19wcm90b19fID0gSFRNTEVsZW1lbnQucHJvdG90eXBlO1xuICAgIG5vcm1hbGl6ZWRDb25zdHJ1Y3RvciA9IHsgcHJvdG90eXBlOiBjb25zdHJ1Y3RvciB9O1xuICB9XG5cbiAgLy8gSWYgdGhlIG5hdGl2ZSB3ZWIgY29tcG9uZW50IHNwZWNpZmljYXRpb24gaXMgbG9hZGVkLCB1c2UgdGhhdCBpbnN0ZWFkLlxuICBpZiAocmVhbFJlZ2lzdGVyRWxlbWVudCkge1xuICAgIHJldHVybiByZWFsUmVnaXN0ZXJFbGVtZW50LmNhbGwoZG9jdW1lbnQsIHRhZ05hbWUsIG5vcm1hbGl6ZWRDb25zdHJ1Y3Rvcik7XG4gIH1cblxuICAvLyBJZiB0aGUgZWxlbWVudCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQsIHJhaXNlIGFuIGVycm9yLlxuICBpZiAodGFnTmFtZSBpbiBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzKSB7XG4gICAgdGhyb3cgbmV3IERPTUV4Y2VwdGlvbignXFxuICAgICAgRmFpbGVkIHRvIGV4ZWN1dGUgXFwncmVnaXN0ZXJFbGVtZW50XFwnIG9uIFxcJ0RvY3VtZW50XFwnOiBSZWdpc3RyYXRpb24gZmFpbGVkXFxuICAgICAgZm9yIHR5cGUgXFwnJyArIHRhZ05hbWUgKyAnXFwnLiBBIHR5cGUgd2l0aCB0aGF0IG5hbWUgaXMgYWxyZWFkeSByZWdpc3RlcmVkLlxcbiAgICAnKTtcbiAgfVxuXG4gIC8vIEFzc2lnbiB0aGUgY3VzdG9tIGVsZW1lbnQgcmVmZXJlbmNlIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1t0YWdOYW1lXSA9IG5vcm1hbGl6ZWRDb25zdHJ1Y3Rvcjtcbn1cblxuLyoqXG4gKiBBZGRzIGEgZ2xvYmFsIHRyYW5zaXRpb24gbGlzdGVuZXIuICBXaXRoIG1hbnkgZWxlbWVudHMgdGhpcyBjb3VsZCBiZSBhblxuICogZXhwZW5zaXZlIG9wZXJhdGlvbiwgc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgbGlzdGVuZXJzIGFkZGVkIGlmIHlvdSdyZVxuICogY29uY2VybmVkIGFib3V0IHBlcmZvcm1hbmNlLlxuICpcbiAqIFNpbmNlIHRoZSBjYWxsYmFjayB0cmlnZ2VycyB3aXRoIHZhcmlvdXMgZWxlbWVudHMsIG1vc3Qgb2Ygd2hpY2ggeW91XG4gKiBwcm9iYWJseSBkb24ndCBjYXJlIGFib3V0LCB5b3UnbGwgd2FudCB0byBmaWx0ZXIuICBBIGdvb2Qgd2F5IG9mIGZpbHRlcmluZ1xuICogaXMgdG8gdXNlIHRoZSBET00gYG1hdGNoZXNgIG1ldGhvZC4gIEl0J3MgZmFpcmx5IHdlbGwgc3VwcG9ydGVkXG4gKiAoaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PW1hdGNoZXNzZWxlY3RvcikgYW5kIG1heSBzdWl0IG1hbnkgcHJvamVjdHMuICBJZlxuICogeW91IG5lZWQgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGNvbnNpZGVyIHVzaW5nIGpRdWVyeSdzIGBpc2AuXG4gKlxuICogWW91IGNhbiBkbyBmdW4sIGhpZ2hseSBzcGVjaWZpYywgZmlsdGVyczpcbiAqXG4gKiBhZGRUcmFuc2l0aW9uU3RhdGUoJ2F0dGFjaGVkJywgZnVuY3Rpb24oZWxlbWVudCkge1xuICogICAvLyBGYWRlIGluIHRoZSBtYWluIGNvbnRhaW5lciBhZnRlciBpdCdzIGFkZGVkLlxuICogICBpZiAoZWxlbWVudC5tYXRjaGVzKCdib2R5IG1haW4uY29udGFpbmVyJykpIHtcbiAqICAgICAkKGVsZW1lbnQpLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZUluKCk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEBwYXJhbSBzdGF0ZSAtIFN0cmluZyBuYW1lIHRoYXQgbWF0Y2hlcyB3aGF0J3MgYXZhaWxhYmxlIGluIHRoZVxuICogZG9jdW1lbnRhdGlvbiBhYm92ZS5cbiAqIEBwYXJhbSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIHJlY2VpdmUgdGhlIG1hdGNoaW5nIGVsZW1lbnRzLlxuICovXG5cbmZ1bmN0aW9uIGFkZFRyYW5zaXRpb25TdGF0ZShzdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHRocm93IG5ldyBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yKCdNaXNzaW5nIHRyYW5zaXRpb24gc3RhdGUgbmFtZScpO1xuICB9XG5cbiAgaWYgKCFjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yKCdNaXNzaW5nIHRyYW5zaXRpb24gc3RhdGUgY2FsbGJhY2snKTtcbiAgfVxuXG4gIC8vIE5vdCBhIHZhbGlkIHN0YXRlIG5hbWUuXG4gIGlmIChPYmplY3Qua2V5cyhfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcykuaW5kZXhPZihzdGF0ZSkgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IF9lcnJvcnMuVHJhbnNpdGlvblN0YXRlRXJyb3IoJ0ludmFsaWQgc3RhdGUgbmFtZTogJyArIHN0YXRlKTtcbiAgfVxuXG4gIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5wdXNoKGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGEgZ2xvYmFsIHRyYW5zaXRpb24gbGlzdGVuZXIuXG4gKlxuICogV2hlbiBpbnZva2VkIHdpdGggbm8gYXJndW1lbnRzLCB0aGlzIG1ldGhvZCB3aWxsIHJlbW92ZSBhbGwgdHJhbnNpdGlvblxuICogY2FsbGJhY2tzLiAgV2hlbiBpbnZva2VkIHdpdGggdGhlIG5hbWUgYXJndW1lbnQgaXQgd2lsbCByZW1vdmUgYWxsXG4gKiB0cmFuc2l0aW9uIHN0YXRlIGNhbGxiYWNrcyBtYXRjaGluZyB0aGUgbmFtZSwgYW5kIHNvIG9uIGZvciB0aGUgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHN0YXRlIC0gU3RyaW5nIG5hbWUgdGhhdCBtYXRjaGVzIHdoYXQncyBhdmFpbGFibGUgaW4gdGhlXG4gKiBkb2N1bWVudGF0aW9uIGFib3ZlLlxuICogQHBhcmFtIGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gcmVjZWl2ZSB0aGUgbWF0Y2hpbmcgZWxlbWVudHMuXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvblN0YXRlKHN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrICYmIHN0YXRlKSB7XG4gICAgX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLmxlbmd0aCA9IDA7XG4gIH0gZWxzZSBpZiAoc3RhdGUgJiYgY2FsbGJhY2spIHtcbiAgICAvLyBOb3QgYSB2YWxpZCBzdGF0ZSBuYW1lLlxuICAgIGlmIChPYmplY3Qua2V5cyhfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcykuaW5kZXhPZihzdGF0ZSkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgX2Vycm9ycy5UcmFuc2l0aW9uU3RhdGVFcnJvcignSW52YWxpZCBzdGF0ZSBuYW1lICcgKyBzdGF0ZSk7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbc3RhdGVdLmluZGV4T2YoY2FsbGJhY2spO1xuICAgIF90cmFuc2l0aW9ucy50cmFuc2l0aW9uU3RhdGVzW3N0YXRlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIF9zdGF0ZSBpbiBfdHJhbnNpdGlvbnMudHJhbnNpdGlvblN0YXRlcykge1xuICAgICAgX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXNbX3N0YXRlXS5sZW5ndGggPSAwO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ5IGNhbGxpbmcgdGhpcyBmdW5jdGlvbiB5b3VyIGJyb3dzZXIgZW52aXJvbm1lbnQgaXMgZW5oYW5jZWQgZ2xvYmFsbHkuIFRoaXNcbiAqIHByb2plY3Qgd291bGQgbG92ZSB0byBoaXQgdGhlIHN0YW5kYXJkcyB0cmFjayBhbmQgYWxsb3cgYWxsIGRldmVsb3BlcnMgdG9cbiAqIGJlbmVmaXQgZnJvbSB0aGUgcGVyZm9ybWFuY2UgZ2FpbnMgb2YgRE9NIGRpZmZpbmcuXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlUHJvbGx5ZmlsbCgpIHtcbiAgLy8gRXhwb3NlcyB0aGUgYFRyYW5zaXRpb25TdGF0ZUVycm9yYCBjb25zdHJ1Y3RvciBnbG9iYWxseSBzbyB0aGF0IGRldmVsb3BlcnNcbiAgLy8gY2FuIGluc3RhbmNlb2YgY2hlY2sgZXhjZXB0aW9uIGVycm9ycy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ1RyYW5zaXRpb25TdGF0ZUVycm9yJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBfZXJyb3JzLlRyYW5zaXRpb25TdGF0ZUVycm9yXG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBhZGQgdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFja3MuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkb2N1bWVudCwgJ2FkZFRyYW5zaXRpb25TdGF0ZScsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICBhZGRUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byByZW1vdmUgdHJhbnNpdGlvbiBzdGF0ZSBjYWxsYmFja3MuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkb2N1bWVudCwgJ3JlbW92ZVRyYW5zaXRpb25TdGF0ZScsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFsbG93cyBhIGRldmVsb3BlciB0byBzZXQgdGhlIGBpbm5lckhUTUxgIG9mIGFuIGVsZW1lbnQuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZJbm5lckhUTUwnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQobmV3SFRNTCkge1xuICAgICAgaW5uZXJIVE1MKHRoaXMsIG5ld0hUTUwpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWxsb3dzIGEgZGV2ZWxvcGVyIHRvIHNldCB0aGUgYG91dGVySFRNTGAgb2YgYW4gZWxlbWVudC5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnZGlmZk91dGVySFRNTCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG5cbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChuZXdIVE1MKSB7XG4gICAgICBvdXRlckhUTUwodGhpcywgbmV3SFRNTCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBbGxvd3MgYSBkZXZlbG9wZXIgdG8gZGlmZiB0aGUgY3VycmVudCBlbGVtZW50IHdpdGggYSBuZXcgZWxlbWVudC5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnQucHJvdG90eXBlLCAnZGlmZkVsZW1lbnQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG5ld0VsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQodGhpcywgbmV3RWxlbWVudCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBSZWxlYXNlcyB0aGUgcmV0YWluZWQgbWVtb3J5IGFuZCB3b3JrZXIgaW5zdGFuY2UuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RpZmZSZWxlYXNlJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdFbGVtZW50KSB7XG4gICAgICAoMCwgX25vZGVQYXRjaC5yZWxlYXNlTm9kZSkodGhpcyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBQb2x5ZmlsbCBpbiB0aGUgYHJlZ2lzdGVyRWxlbWVudGAgbWV0aG9kIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gVGhpc1xuICAvLyByZXF1aXJlcyBwYXRjaGluZyBgY3JlYXRlRWxlbWVudGAgYXMgd2VsbCB0byBlbnN1cmUgdGhhdCB0aGUgcHJvcGVyIHByb3RvXG4gIC8vIGNoYWluIGV4aXN0cy5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50LCAncmVnaXN0ZXJFbGVtZW50Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSh0YWdOYW1lLCBjb21wb25lbnQpIHtcbiAgICAgIHJlZ2lzdGVyRWxlbWVudCh0YWdOYW1lLCBjb21wb25lbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gVGhpcyBzZWN0aW9uIHdpbGwgYXV0b21hdGljYWxseSBwYXJzZSBvdXQgeW91ciBlbnRpcmUgcGFnZSB0byBlbnN1cmUgYWxsXG4gIC8vIGN1c3RvbSBlbGVtZW50cyBhcmUgaG9va2VkIGludG8uXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAvLyBBZnRlciB0aGUgaW5pdGlhbCByZW5kZXIsIGNsZWFuIHVwIHRoZSByZXNvdXJjZXMsIG5vIHBvaW50IGluIGxpbmdlcmluZy5cbiAgICBkb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVuZGVyQ29tcGxldGUnLCBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAvLyBSZWxlYXNlIHJlc291cmNlcyB0byB0aGUgZWxlbWVudC5cbiAgICAgIGRvY3VtZW50RWxlbWVudC5kaWZmUmVsZWFzZShkb2N1bWVudEVsZW1lbnQpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhpcyBldmVudCBsaXN0ZW5lci5cbiAgICAgIGRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdyZW5kZXJDb21wbGV0ZScsIHJlbmRlcik7XG4gICAgfSk7XG5cbiAgICAvLyBEaWZmIHRoZSBlbnRpcmUgZG9jdW1lbnQgb24gYWN0aXZhdGlvbiBvZiB0aGUgcHJvbGx5ZmlsbC5cbiAgICBkb2N1bWVudEVsZW1lbnQuZGlmZk91dGVySFRNTCA9IGRvY3VtZW50RWxlbWVudC5vdXRlckhUTUw7XG4gIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096czdPM2xDUVVGeFJDeGpRVUZqT3pzeVFrRkRiRU1zWlVGQlpUczdOa0pCUTNKQ0xHdENRVUZyUWpzN096czdjMEpCU1ZJc1ZVRkJWVHM3T3pzN2JVSkJRM1JETEc5Q1FVRnZRanM3T3p0QlFVVTNRaXhKUVVGSkxHMUNRVUZ0UWl4SFFVRkhMRkZCUVZFc1EwRkJReXhsUVVGbExFTkJRVU03UVVGRGJrUXNTVUZCU1N4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRE96czdPenM3T3pzN096czdRVUZYVWl4VFFVRlRMRk5CUVZNc1EwRkJReXhQUVVGUExFVkJRWGxDTzAxQlFYWkNMRTFCUVUwc2VVUkJRVU1zUlVGQlJUdE5RVUZGTEU5QlFVOHNlVVJCUVVNc1JVRkJSVHM3UVVGRGRFUXNVMEZCVHl4RFFVRkRMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU03UVVGRGRFSXNORUpCUVZVc1QwRkJUeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0RFFVTnlRenM3T3pzN096czdPenM3TzBGQlYwMHNVMEZCVXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhGUVVGNVFqdE5RVUYyUWl4TlFVRk5MSGxFUVVGRExFVkJRVVU3VFVGQlJTeFBRVUZQTEhsRVFVRkRMRVZCUVVVN08wRkJRM1JFTEZOQlFVOHNRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM0pDTERSQ1FVRlZMRTlCUVU4c1JVRkJSU3hOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRMEZEY2tNN096czdPenM3T3pzN096dEJRVmROTEZOQlFWTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hWUVVGVkxFVkJRV003VFVGQldpeFBRVUZQTEhsRVFVRkRMRVZCUVVVN08wRkJRM0pFTERSQ1FVRlZMRTlCUVU4c1JVRkJSU3hWUVVGVkxFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRMEZEZWtNN096czdPenM3T3p0QlFWRk5MRk5CUVZNc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU12UWl3NFFrRkJXU3hQUVVGUExFTkJRVU1zUTBGQlF6dERRVU4wUWpzN096czdPenM3TzBGQlVVMHNVMEZCVXl4bFFVRmxMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUlVGQlJUczdPMEZCUjNCRUxFMUJRVWtzY1VKQlFYRkNMRWRCUVVjc1YwRkJWeXhEUVVGRExGTkJRVk1zUjBGQlJ5eFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRPenRCUVVWMlJTeE5RVUZKTEVOQlFVTXNjVUpCUVhGQ0xFVkJRVVU3UVVGRE1VSXNaVUZCVnl4RFFVRkRMRk5CUVZNc1IwRkJSeXhYUVVGWExFTkJRVU1zVTBGQlV5eERRVUZETzBGQlF6bERMSGxDUVVGeFFpeEhRVUZITEVWQlFVVXNVMEZCVXl4RlFVRkZMRmRCUVZjc1JVRkJSU3hEUVVGRE8wZEJRM0JFT3pzN1FVRkhSQ3hOUVVGSkxHMUNRVUZ0UWl4RlFVRkZPMEZCUTNaQ0xGZEJRVThzYlVKQlFXMUNMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVWQlFVVXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6dEhRVU16UlRzN08wRkJSMFFzVFVGQlNTeFBRVUZQTERaQ1FVRmpMRVZCUVVVN1FVRkRla0lzVlVGQlRTeEpRVUZKTEZsQlFWa3NNa2RCUlZJc1QwRkJUeXcwUkVGRGJrSXNRMEZCUXp0SFFVTktPenM3UVVGSFJDdzBRa0ZCVnl4UFFVRlBMRU5CUVVNc1IwRkJSeXh4UWtGQmNVSXNRMEZCUXp0RFFVTTNRenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPMEZCTUVKTkxGTkJRVk1zYTBKQlFXdENMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUlVGQlJUdEJRVU5zUkN4TlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRk8wRkJRMVlzVlVGQlRTeHBRMEZCZVVJc0swSkJRU3RDTEVOQlFVTXNRMEZCUXp0SFFVTnFSVHM3UVVGRlJDeE5RVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZPMEZCUTJJc1ZVRkJUU3hwUTBGQmVVSXNiVU5CUVcxRExFTkJRVU1zUTBGQlF6dEhRVU55UlRzN08wRkJSMFFzVFVGQlNTeE5RVUZOTEVOQlFVTXNTVUZCU1N3clFrRkJhMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVU3UVVGRGRrUXNWVUZCVFN4cFEwRkJlVUlzYzBKQlFYTkNMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU03UjBGRGFFVTdPMEZCUlVRc1owTkJRV2xDTEV0QlFVc3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dERRVU40UXpzN096czdPenM3T3pzN096czdRVUZoVFN4VFFVRlRMSEZDUVVGeFFpeERRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRVZCUVVVN1FVRkRja1FzVFVGQlNTeERRVUZETEZGQlFWRXNTVUZCU1N4TFFVRkxMRVZCUVVVN1FVRkRkRUlzYTBOQlFXbENMRXRCUVVzc1EwRkJReXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdSMEZEY0VNc1RVRkRTU3hKUVVGSkxFdEJRVXNzU1VGQlNTeFJRVUZSTEVWQlFVVTdPMEZCUlRGQ0xGRkJRVWtzVFVGQlRTeERRVUZETEVsQlFVa3NLMEpCUVd0Q0xFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRM1pFTEZsQlFVMHNhVU5CUVhsQ0xIRkNRVUZ4UWl4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRE8wdEJReTlFT3p0QlFVVkVMRkZCUVVrc1MwRkJTeXhIUVVGSExEaENRVUZwUWl4TFFVRkxMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEZEVRc2EwTkJRV2xDTEV0QlFVc3NRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZETVVNc1RVRkRTVHRCUVVOSUxGTkJRVXNzU1VGQlNTeE5RVUZMTEcxRFFVRnpRanRCUVVOc1F5eHZRMEZCYVVJc1RVRkJTeXhEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0TFFVTndRenRIUVVOR08wTkJRMFk3T3pzN096czdPMEZCVDAwc1UwRkJVeXhuUWtGQlowSXNSMEZCUnpzN08wRkJSMnBETEZGQlFVMHNRMEZCUXl4alFVRmpMRU5CUVVNc1RVRkJUU3hGUVVGRkxITkNRVUZ6UWl4RlFVRkZPMEZCUTNCRUxHZENRVUZaTEVWQlFVVXNTVUZCU1RzN1FVRkZiRUlzVTBGQlN5dzRRa0ZCYzBJN1IwRkROVUlzUTBGQlF5eERRVUZET3pzN1FVRkhTQ3hSUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEZGQlFWRXNSVUZCUlN4dlFrRkJiMElzUlVGQlJUdEJRVU53UkN4blFrRkJXU3hGUVVGRkxFbEJRVWs3TzBGQlJXeENMRk5CUVVzc1JVRkJRU3hsUVVGRExFdEJRVXNzUlVGQlJTeFJRVUZSTEVWQlFVVTdRVUZEY2tJc2QwSkJRV3RDTEVOQlFVTXNTMEZCU3l4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8wdEJRM0pETzBkQlEwWXNRMEZCUXl4RFFVRkRPenM3UVVGSFNDeFJRVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRkZCUVZFc1JVRkJSU3gxUWtGQmRVSXNSVUZCUlR0QlFVTjJSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xGTkJRVXNzUlVGQlFTeGxRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRVZCUVVVN1FVRkRja0lzTWtKQlFYRkNMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzB0QlEzaERPMGRCUTBZc1EwRkJReXhEUVVGRE96czdRVUZIU0N4UlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVWQlFVVXNaVUZCWlN4RlFVRkZPMEZCUTNoRUxHZENRVUZaTEVWQlFVVXNTVUZCU1RzN1FVRkZiRUlzVDBGQlJ5eEZRVUZCTEdGQlFVTXNUMEZCVHl4RlFVRkZPMEZCUTFnc1pVRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0TFFVTXhRanRIUVVOR0xFTkJRVU1zUTBGQlF6czdPMEZCUjBnc1VVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMR1ZCUVdVc1JVRkJSVHRCUVVONFJDeG5Ra0ZCV1N4RlFVRkZMRWxCUVVrN08wRkJSV3hDTEU5QlFVY3NSVUZCUVN4aFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVOWUxHVkJRVk1zUTBGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkRNVUk3UjBGRFJpeERRVUZETEVOQlFVTTdPenRCUVVkSUxGRkJRVTBzUTBGQlF5eGpRVUZqTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSU3hoUVVGaExFVkJRVVU3UVVGRGRFUXNaMEpCUVZrc1JVRkJSU3hKUVVGSk96dEJRVVZzUWl4VFFVRkxMRVZCUVVFc1pVRkJReXhWUVVGVkxFVkJRVVU3UVVGRGFFSXNZVUZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hWUVVGVkxFTkJRVU1zUTBGQlF6dExRVU16UWp0SFFVTkdMRU5CUVVNc1EwRkJRenM3TzBGQlIwZ3NVVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eEZRVUZGTEdGQlFXRXNSVUZCUlR0QlFVTjBSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xGTkJRVXNzUlVGQlFTeGxRVUZETEZWQlFWVXNSVUZCUlR0QlFVTm9RaXhyUTBGQldTeEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTnVRanRIUVVOR0xFTkJRVU1zUTBGQlF6czdPenM3UVVGTFNDeFJRVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRkZCUVZFc1JVRkJSU3hwUWtGQmFVSXNSVUZCUlR0QlFVTnFSQ3huUWtGQldTeEZRVUZGTEVsQlFVazdPMEZCUld4Q0xGTkJRVXNzUlVGQlFTeGxRVUZETEU5QlFVOHNSVUZCUlN4VFFVRlRMRVZCUVVVN1FVRkRlRUlzY1VKQlFXVXNRMEZCUXl4UFFVRlBMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03UzBGRGNrTTdSMEZEUml4RFFVRkRMRU5CUVVNN096czdRVUZKU0N4UlFVRk5MRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNUVUZCVFN4RlFVRkZMRmxCUVZjN1FVRkRla01zVVVGQlNTeGxRVUZsTEVkQlFVY3NVVUZCVVN4RFFVRkRMR1ZCUVdVc1EwRkJRenM3TzBGQlJ5OURMRzFDUVVGbExFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNVMEZCVXl4TlFVRk5MRWRCUVVjN08wRkJSVzVGTEhGQ1FVRmxMRU5CUVVNc1YwRkJWeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZET3pzN1FVRkhOME1zY1VKQlFXVXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eG5Ra0ZCWjBJc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dExRVU12UkN4RFFVRkRMRU5CUVVNN096dEJRVWRJTEcxQ1FVRmxMRU5CUVVNc1lVRkJZU3hIUVVGSExHVkJRV1VzUTBGQlF5eFRRVUZUTEVOQlFVTTdSMEZETTBRc1EwRkJReXhEUVVGRE8wTkJRMG9pTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2YVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnZXlCd1lYUmphRTV2WkdVc0lISmxiR1ZoYzJWT2IyUmxMQ0J5WldkcGMzUmxjazV2WkdVZ2ZTQm1jbTl0SUNjdUwyNXZaR1V2Y0dGMFkyZ25PMXh1YVcxd2IzSjBJSHNnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeUI5SUdaeWIyMGdKeTR2ZEhKaGJuTnBkR2x2Ym5Nbk8xeHVhVzF3YjNKMElIc2dZMjl0Y0c5dVpXNTBjeUI5SUdaeWIyMGdKeTR2Wld4bGJXVnVkQzlqZFhOMGIyMG5PMXh1WEc0dkx5QlhaU0JsZUhCdmNuUWdkR2hsSUZSeVlXNXphWFJwYjI1VGRHRjBaVVZ5Y205eUlHTnZibk4wY25WamRHOXlJSE52SUhSb1lYUWdhVzV6ZEdGdVkyVnZaaUJqYUdWamEzTWdZMkZ1WEc0dkx5QmlaU0J0WVdSbElHSjVJSFJvYjNObElIQjFZbXhwWTJ4NUlHTnZibk4xYldsdVp5QjBhR2x6SUd4cFluSmhjbmt1WEc1cGJYQnZjblFnZXlCVWNtRnVjMmwwYVc5dVUzUmhkR1ZGY25KdmNpQjlJR1p5YjIwZ0p5NHZaWEp5YjNKekp6dGNibVY0Y0c5eWRDQjdJRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5SUgwZ1puSnZiU0FuTGk5bGNuSnZjbk1uTzF4dVhHNTJZWElnY21WaGJGSmxaMmx6ZEdWeVJXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExuSmxaMmx6ZEdWeVJXeGxiV1Z1ZER0Y2JuWmhjaUJsYlhCMGVTQTlJSHQ5TzF4dVhHNHZLaXBjYmlBcUlGVnpaV1FnZEc4Z1pHbG1aaUIwYUdVZ2IzVjBaWEpJVkUxTUlHTnZiblJsYm5SeklHOW1JSFJvWlNCd1lYTnpaV1FnWld4bGJXVnVkQ0IzYVhSb0lIUm9aU0J0WVhKcmRYQmNiaUFxSUdOdmJuUmxiblJ6TGlBZ1ZtVnllU0IxYzJWbWRXd2dabTl5SUdGd2NHeDVhVzVuSUdFZ1oyeHZZbUZzSUdScFptWWdiMjRnZEdobFhHNGdLaUJnWkc5amRXMWxiblF1Wkc5amRXMWxiblJGYkdWdFpXNTBZQzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdaV3hsYldWdWRGeHVJQ29nUUhCaGNtRnRJRzFoY210MWNEMG5KMXh1SUNvZ1FIQmhjbUZ0SUc5d2RHbHZibk05ZTMxY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJRzkxZEdWeVNGUk5UQ2hsYkdWdFpXNTBMQ0J0WVhKcmRYQTlKeWNzSUc5d2RHbHZibk05ZTMwcElIdGNiaUFnYjNCMGFXOXVjeTVwYm01bGNpQTlJR1poYkhObE8xeHVJQ0J3WVhSamFFNXZaR1VvWld4bGJXVnVkQ3dnYldGeWEzVndMQ0J2Y0hScGIyNXpLVHRjYm4xY2JseHVMeW9xWEc0Z0tpQlZjMlZrSUhSdklHUnBabVlnZEdobElHbHVibVZ5U0ZSTlRDQmpiMjUwWlc1MGN5QnZaaUIwYUdVZ2NHRnpjMlZrSUdWc1pXMWxiblFnZDJsMGFDQjBhR1VnYldGeWEzVndYRzRnS2lCamIyNTBaVzUwY3k0Z0lGUm9hWE1nYVhNZ2RYTmxablZzSUhkcGRHZ2diR2xpY21GeWFXVnpJR3hwYTJVZ1FtRmphMkp2Ym1VZ2RHaGhkQ0J5Wlc1a1pYSWdWbWxsZDNOY2JpQXFJR2x1ZEc4Z1pXeGxiV1Z1ZENCamIyNTBZV2x1WlhJdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblJjYmlBcUlFQndZWEpoYlNCdFlYSnJkWEE5SnlkY2JpQXFJRUJ3WVhKaGJTQnZjSFJwYjI1elBYdDlYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGJtNWxja2hVVFV3b1pXeGxiV1Z1ZEN3Z2JXRnlhM1Z3UFNjbkxDQnZjSFJwYjI1elBYdDlLU0I3WEc0Z0lHOXdkR2x2Ym5NdWFXNXVaWElnUFNCMGNuVmxPMXh1SUNCd1lYUmphRTV2WkdVb1pXeGxiV1Z1ZEN3Z2JXRnlhM1Z3TENCdmNIUnBiMjV6S1R0Y2JuMWNibHh1THlvcVhHNGdLaUJWYzJWa0lIUnZJR1JwWm1ZZ2RIZHZJR1ZzWlcxbGJuUnpMaUFnVkdobElHQnBibTVsY21BZ1FtOXZiR1ZoYmlCd2NtOXdaWEowZVNCallXNGdZbVVnYzNCbFkybG1hV1ZrSUdsdVhHNGdLaUIwYUdVZ2IzQjBhVzl1Y3lCMGJ5QnpaWFFnYVc1dVpYSklWRTFNWEZ4dmRYUmxja2hVVFV3Z1ltVm9ZWFpwYjNJdUlDQkNlU0JrWldaaGRXeDBJR2wwSUdselhHNGdLaUJ2ZFhSbGNraFVUVXd1WEc0Z0tseHVJQ29nUUhCaGNtRnRJR1ZzWlcxbGJuUmNiaUFxSUVCd1lYSmhiU0J1WlhkRmJHVnRaVzUwWEc0Z0tpQkFjR0Z5WVcwZ2IzQjBhVzl1Y3oxN2ZWeHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWld4bGJXVnVkQ2hsYkdWdFpXNTBMQ0J1WlhkRmJHVnRaVzUwTENCdmNIUnBiMjV6UFh0OUtTQjdYRzRnSUhCaGRHTm9UbTlrWlNobGJHVnRaVzUwTENCdVpYZEZiR1Z0Wlc1MExDQnZjSFJwYjI1ektUdGNibjFjYmx4dUx5b3FYRzRnS2lCU1pXeGxZWE5sY3lCMGFHVWdkMjl5YTJWeUlHRnVaQ0J0WlcxdmNua2dZV3hzYjJOaGRHVmtJSFJ2SUhSb2FYTWdaV3hsYldWdWRDNGdWWE5sWm5Wc0lHWnZjbHh1SUNvZ1kyOXRjRzl1Wlc1MGN5QjBieUJqYkdWaGJpQjFjQ0IzYUdWdUlISmxiVzkyWldRdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblJjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlISmxiR1ZoYzJVb1pXeGxiV1Z1ZENrZ2UxeHVJQ0J5Wld4bFlYTmxUbTlrWlNobGJHVnRaVzUwS1R0Y2JuMWNibHh1THlvcVhHNGdLaUJTWldkcGMzUmxjaWR6SUdFZ1kyOXVjM1J5ZFdOMGIzSWdkMmwwYUNCaGJpQmxiR1Z0Wlc1MElIUnZJSEJ5YjNacFpHVWdiR2xtWldONVkyeGxJR1YyWlc1MGN5NWNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ2RHRm5UbUZ0WlZ4dUlDb2dRSEJoY21GdElHTnZibk4wY25WamRHOXlYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCeVpXZHBjM1JsY2tWc1pXMWxiblFvZEdGblRtRnRaU3dnWTI5dWMzUnlkV04wYjNJcElIdGNiaUFnTHk4Z1ZYQm5jbUZrWlNCemFXMXdiR1VnYjJKcVpXTjBjeUIwYnlCcGJtaGxjbWwwSUdaeWIyMGdTRlJOVEVWc1pXMWxiblFnWVc1a0lHSmxJSFZ6WVdKc1pTQnBiaUJoSUhKbFlXeGNiaUFnTHk4Z2FXMXdiR1Z0Wlc1MFlYUnBiMjR1WEc0Z0lIWmhjaUJ1YjNKdFlXeHBlbVZrUTI5dWMzUnlkV04wYjNJZ1BTQmpiMjV6ZEhKMVkzUnZjaTV3Y205MGIzUjVjR1VnUHlCamIyNXpkSEoxWTNSdmNpQTZJRzUxYkd3N1hHNWNiaUFnYVdZZ0tDRnViM0p0WVd4cGVtVmtRMjl1YzNSeWRXTjBiM0lwSUh0Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2k1ZlgzQnliM1J2WDE4Z1BTQklWRTFNUld4bGJXVnVkQzV3Y205MGIzUjVjR1U3WEc0Z0lDQWdibTl5YldGc2FYcGxaRU52Ym5OMGNuVmpkRzl5SUQwZ2V5QndjbTkwYjNSNWNHVTZJR052Ym5OMGNuVmpkRzl5SUgwN1hHNGdJSDFjYmx4dUlDQXZMeUJKWmlCMGFHVWdibUYwYVhabElIZGxZaUJqYjIxd2IyNWxiblFnYzNCbFkybG1hV05oZEdsdmJpQnBjeUJzYjJGa1pXUXNJSFZ6WlNCMGFHRjBJR2x1YzNSbFlXUXVYRzRnSUdsbUlDaHlaV0ZzVW1WbmFYTjBaWEpGYkdWdFpXNTBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlISmxZV3hTWldkcGMzUmxja1ZzWlcxbGJuUXVZMkZzYkNoa2IyTjFiV1Z1ZEN3Z2RHRm5UbUZ0WlN3Z2JtOXliV0ZzYVhwbFpFTnZibk4wY25WamRHOXlLVHRjYmlBZ2ZWeHVYRzRnSUM4dklFbG1JSFJvWlNCbGJHVnRaVzUwSUdoaGN5QmhiSEpsWVdSNUlHSmxaVzRnY21WbmFYTjBaWEpsWkN3Z2NtRnBjMlVnWVc0Z1pYSnliM0l1WEc0Z0lHbG1JQ2gwWVdkT1lXMWxJR2x1SUdOdmJYQnZibVZ1ZEhNcElIdGNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JFOU5SWGhqWlhCMGFXOXVLR0JjYmlBZ0lDQWdJRVpoYVd4bFpDQjBieUJsZUdWamRYUmxJQ2R5WldkcGMzUmxja1ZzWlcxbGJuUW5JRzl1SUNkRWIyTjFiV1Z1ZENjNklGSmxaMmx6ZEhKaGRHbHZiaUJtWVdsc1pXUmNiaUFnSUNBZ0lHWnZjaUIwZVhCbElDY2tlM1JoWjA1aGJXVjlKeTRnUVNCMGVYQmxJSGRwZEdnZ2RHaGhkQ0J1WVcxbElHbHpJR0ZzY21WaFpIa2djbVZuYVhOMFpYSmxaQzVjYmlBZ0lDQmdLVHRjYmlBZ2ZWeHVYRzRnSUM4dklFRnpjMmxuYmlCMGFHVWdZM1Z6ZEc5dElHVnNaVzFsYm5RZ2NtVm1aWEpsYm1ObElIUnZJSFJvWlNCamIyNXpkSEoxWTNSdmNpNWNiaUFnWTI5dGNHOXVaVzUwYzF0MFlXZE9ZVzFsWFNBOUlHNXZjbTFoYkdsNlpXUkRiMjV6ZEhKMVkzUnZjanRjYm4xY2JseHVMeW9xWEc0Z0tpQkJaR1J6SUdFZ1oyeHZZbUZzSUhSeVlXNXphWFJwYjI0Z2JHbHpkR1Z1WlhJdUlDQlhhWFJvSUcxaGJua2daV3hsYldWdWRITWdkR2hwY3lCamIzVnNaQ0JpWlNCaGJseHVJQ29nWlhod1pXNXphWFpsSUc5d1pYSmhkR2x2Yml3Z2MyOGdkSEo1SUhSdklHeHBiV2wwSUhSb1pTQmhiVzkxYm5RZ2IyWWdiR2x6ZEdWdVpYSnpJR0ZrWkdWa0lHbG1JSGx2ZFNkeVpWeHVJQ29nWTI5dVkyVnlibVZrSUdGaWIzVjBJSEJsY21admNtMWhibU5sTGx4dUlDcGNiaUFxSUZOcGJtTmxJSFJvWlNCallXeHNZbUZqYXlCMGNtbG5aMlZ5Y3lCM2FYUm9JSFpoY21sdmRYTWdaV3hsYldWdWRITXNJRzF2YzNRZ2IyWWdkMmhwWTJnZ2VXOTFYRzRnS2lCd2NtOWlZV0pzZVNCa2IyNG5kQ0JqWVhKbElHRmliM1YwTENCNWIzVW5iR3dnZDJGdWRDQjBieUJtYVd4MFpYSXVJQ0JCSUdkdmIyUWdkMkY1SUc5bUlHWnBiSFJsY21sdVoxeHVJQ29nYVhNZ2RHOGdkWE5sSUhSb1pTQkVUMDBnWUcxaGRHTm9aWE5nSUcxbGRHaHZaQzRnSUVsMEozTWdabUZwY214NUlIZGxiR3dnYzNWd2NHOXlkR1ZrWEc0Z0tpQW9hSFIwY0RvdkwyTmhibWwxYzJVdVkyOXRMeU5tWldGMFBXMWhkR05vWlhOelpXeGxZM1J2Y2lrZ1lXNWtJRzFoZVNCemRXbDBJRzFoYm5rZ2NISnZhbVZqZEhNdUlDQkpabHh1SUNvZ2VXOTFJRzVsWldRZ1ltRmphM2RoY21SeklHTnZiWEJoZEdsaWFXeHBkSGtzSUdOdmJuTnBaR1Z5SUhWemFXNW5JR3BSZFdWeWVTZHpJR0JwYzJBdVhHNGdLbHh1SUNvZ1dXOTFJR05oYmlCa2J5Qm1kVzRzSUdocFoyaHNlU0J6Y0dWamFXWnBZeXdnWm1sc2RHVnljenBjYmlBcVhHNGdLaUJoWkdSVWNtRnVjMmwwYVc5dVUzUmhkR1VvSjJGMGRHRmphR1ZrSnl3Z1puVnVZM1JwYjI0b1pXeGxiV1Z1ZENrZ2UxeHVJQ29nSUNBdkx5QkdZV1JsSUdsdUlIUm9aU0J0WVdsdUlHTnZiblJoYVc1bGNpQmhablJsY2lCcGRDZHpJR0ZrWkdWa0xseHVJQ29nSUNCcFppQW9aV3hsYldWdWRDNXRZWFJqYUdWektDZGliMlI1SUcxaGFXNHVZMjl1ZEdGcGJtVnlKeWtwSUh0Y2JpQXFJQ0FnSUNBa0tHVnNaVzFsYm5RcExuTjBiM0FvZEhKMVpTd2dkSEoxWlNrdVptRmtaVWx1S0NrN1hHNGdLaUFnSUgxY2JpQXFJSDBwTzF4dUlDcGNiaUFxSUVCd1lYSmhiU0J6ZEdGMFpTQXRJRk4wY21sdVp5QnVZVzFsSUhSb1lYUWdiV0YwWTJobGN5QjNhR0YwSjNNZ1lYWmhhV3hoWW14bElHbHVJSFJvWlZ4dUlDb2daRzlqZFcxbGJuUmhkR2x2YmlCaFltOTJaUzVjYmlBcUlFQndZWEpoYlNCallXeHNZbUZqYXlBdElFWjFibU4wYVc5dUlIUnZJSEpsWTJWcGRtVWdkR2hsSUcxaGRHTm9hVzVuSUdWc1pXMWxiblJ6TGx4dUlDb3ZYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdZV1JrVkhKaGJuTnBkR2x2YmxOMFlYUmxLSE4wWVhSbExDQmpZV3hzWW1GamF5a2dlMXh1SUNCcFppQW9JWE4wWVhSbEtTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlLQ2ROYVhOemFXNW5JSFJ5WVc1emFYUnBiMjRnYzNSaGRHVWdibUZ0WlNjcE8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0NGallXeHNZbUZqYXlrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCVWNtRnVjMmwwYVc5dVUzUmhkR1ZGY25KdmNpZ25UV2x6YzJsdVp5QjBjbUZ1YzJsMGFXOXVJSE4wWVhSbElHTmhiR3hpWVdOckp5azdYRzRnSUgxY2JseHVJQ0F2THlCT2IzUWdZU0IyWVd4cFpDQnpkR0YwWlNCdVlXMWxMbHh1SUNCcFppQW9UMkpxWldOMExtdGxlWE1vZEhKaGJuTnBkR2x2YmxOMFlYUmxjeWt1YVc1a1pYaFBaaWh6ZEdGMFpTa2dQVDA5SUMweEtTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlLQ2RKYm5aaGJHbGtJSE4wWVhSbElHNWhiV1U2SUNjZ0t5QnpkR0YwWlNrN1hHNGdJSDFjYmx4dUlDQjBjbUZ1YzJsMGFXOXVVM1JoZEdWelczTjBZWFJsWFM1d2RYTm9LR05oYkd4aVlXTnJLVHRjYm4xY2JseHVMeW9xWEc0Z0tpQlNaVzF2ZG1WeklHRWdaMnh2WW1Gc0lIUnlZVzV6YVhScGIyNGdiR2x6ZEdWdVpYSXVYRzRnS2x4dUlDb2dWMmhsYmlCcGJuWnZhMlZrSUhkcGRHZ2dibThnWVhKbmRXMWxiblJ6TENCMGFHbHpJRzFsZEdodlpDQjNhV3hzSUhKbGJXOTJaU0JoYkd3Z2RISmhibk5wZEdsdmJseHVJQ29nWTJGc2JHSmhZMnR6TGlBZ1YyaGxiaUJwYm5admEyVmtJSGRwZEdnZ2RHaGxJRzVoYldVZ1lYSm5kVzFsYm5RZ2FYUWdkMmxzYkNCeVpXMXZkbVVnWVd4c1hHNGdLaUIwY21GdWMybDBhVzl1SUhOMFlYUmxJR05oYkd4aVlXTnJjeUJ0WVhSamFHbHVaeUIwYUdVZ2JtRnRaU3dnWVc1a0lITnZJRzl1SUdadmNpQjBhR1VnWTJGc2JHSmhZMnN1WEc0Z0tseHVJQ29nUUhCaGNtRnRJSE4wWVhSbElDMGdVM1J5YVc1bklHNWhiV1VnZEdoaGRDQnRZWFJqYUdWeklIZG9ZWFFuY3lCaGRtRnBiR0ZpYkdVZ2FXNGdkR2hsWEc0Z0tpQmtiMk4xYldWdWRHRjBhVzl1SUdGaWIzWmxMbHh1SUNvZ1FIQmhjbUZ0SUdOaGJHeGlZV05ySUMwZ1JuVnVZM1JwYjI0Z2RHOGdjbVZqWldsMlpTQjBhR1VnYldGMFkyaHBibWNnWld4bGJXVnVkSE11WEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnlaVzF2ZG1WVWNtRnVjMmwwYVc5dVUzUmhkR1VvYzNSaGRHVXNJR05oYkd4aVlXTnJLU0I3WEc0Z0lHbG1JQ2doWTJGc2JHSmhZMnNnSmlZZ2MzUmhkR1VwSUh0Y2JpQWdJQ0IwY21GdWMybDBhVzl1VTNSaGRHVnpXM04wWVhSbFhTNXNaVzVuZEdnZ1BTQXdPMXh1SUNCOVhHNGdJR1ZzYzJVZ2FXWWdLSE4wWVhSbElDWW1JR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdMeThnVG05MElHRWdkbUZzYVdRZ2MzUmhkR1VnYm1GdFpTNWNiaUFnSUNCcFppQW9UMkpxWldOMExtdGxlWE1vZEhKaGJuTnBkR2x2YmxOMFlYUmxjeWt1YVc1a1pYaFBaaWh6ZEdGMFpTa2dQVDA5SUMweEtTQjdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dWSEpoYm5OcGRHbHZibE4wWVhSbFJYSnliM0lvSjBsdWRtRnNhV1FnYzNSaGRHVWdibUZ0WlNBbklDc2djM1JoZEdVcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUd4bGRDQnBibVJsZUNBOUlIUnlZVzV6YVhScGIyNVRkR0YwWlhOYmMzUmhkR1ZkTG1sdVpHVjRUMllvWTJGc2JHSmhZMnNwTzF4dUlDQWdJSFJ5WVc1emFYUnBiMjVUZEdGMFpYTmJjM1JoZEdWZExuTndiR2xqWlNocGJtUmxlQ3dnTVNrN1hHNGdJSDFjYmlBZ1pXeHpaU0I3WEc0Z0lDQWdabTl5SUNoc1pYUWdjM1JoZEdVZ2FXNGdkSEpoYm5OcGRHbHZibE4wWVhSbGN5a2dlMXh1SUNBZ0lDQWdkSEpoYm5OcGRHbHZibE4wWVhSbGMxdHpkR0YwWlYwdWJHVnVaM1JvSUQwZ01EdGNiaUFnSUNCOVhHNGdJSDFjYm4xY2JseHVMeW9xWEc0Z0tpQkNlU0JqWVd4c2FXNW5JSFJvYVhNZ1puVnVZM1JwYjI0Z2VXOTFjaUJpY205M2MyVnlJR1Z1ZG1seWIyNXRaVzUwSUdseklHVnVhR0Z1WTJWa0lHZHNiMkpoYkd4NUxpQlVhR2x6WEc0Z0tpQndjbTlxWldOMElIZHZkV3hrSUd4dmRtVWdkRzhnYUdsMElIUm9aU0J6ZEdGdVpHRnlaSE1nZEhKaFkyc2dZVzVrSUdGc2JHOTNJR0ZzYkNCa1pYWmxiRzl3WlhKeklIUnZYRzRnS2lCaVpXNWxabWwwSUdaeWIyMGdkR2hsSUhCbGNtWnZjbTFoYm1ObElHZGhhVzV6SUc5bUlFUlBUU0JrYVdabWFXNW5MbHh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1pXNWhZbXhsVUhKdmJHeDVabWxzYkNncElIdGNiaUFnTHk4Z1JYaHdiM05sY3lCMGFHVWdZRlJ5WVc1emFYUnBiMjVUZEdGMFpVVnljbTl5WUNCamIyNXpkSEoxWTNSdmNpQm5iRzlpWVd4c2VTQnpieUIwYUdGMElHUmxkbVZzYjNCbGNuTmNiaUFnTHk4Z1kyRnVJR2x1YzNSaGJtTmxiMllnWTJobFkyc2daWGhqWlhCMGFXOXVJR1Z5Y205eWN5NWNiaUFnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIZHBibVJ2ZHl3Z0oxUnlZVzV6YVhScGIyNVRkR0YwWlVWeWNtOXlKeXdnZTF4dUlDQWdJR052Ym1acFozVnlZV0pzWlRvZ2RISjFaU3hjYmx4dUlDQWdJSFpoYkhWbE9pQlVjbUZ1YzJsMGFXOXVVM1JoZEdWRmNuSnZjbHh1SUNCOUtUdGNibHh1SUNBdkx5QkJiR3h2ZDNNZ1lTQmtaWFpsYkc5d1pYSWdkRzhnWVdSa0lIUnlZVzV6YVhScGIyNGdjM1JoZEdVZ1kyRnNiR0poWTJ0ekxseHVJQ0JQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pHOWpkVzFsYm5Rc0lDZGhaR1JVY21GdWMybDBhVzl1VTNSaGRHVW5MQ0I3WEc0Z0lDQWdZMjl1Wm1sbmRYSmhZbXhsT2lCMGNuVmxMRnh1WEc0Z0lDQWdkbUZzZFdVb2MzUmhkR1VzSUdOaGJHeGlZV05yS1NCN1hHNGdJQ0FnSUNCaFpHUlVjbUZ1YzJsMGFXOXVVM1JoZEdVb2MzUmhkR1VzSUdOaGJHeGlZV05yS1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1WEc0Z0lDOHZJRUZzYkc5M2N5QmhJR1JsZG1Wc2IzQmxjaUIwYnlCeVpXMXZkbVVnZEhKaGJuTnBkR2x2YmlCemRHRjBaU0JqWVd4c1ltRmphM011WEc0Z0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hrYjJOMWJXVnVkQ3dnSjNKbGJXOTJaVlJ5WVc1emFYUnBiMjVUZEdGMFpTY3NJSHRjYmlBZ0lDQmpiMjVtYVdkMWNtRmliR1U2SUhSeWRXVXNYRzVjYmlBZ0lDQjJZV3gxWlNoemRHRjBaU3dnWTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUhKbGJXOTJaVlJ5WVc1emFYUnBiMjVUZEdGMFpTaHpkR0YwWlN3Z1kyRnNiR0poWTJzcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdMeThnUVd4c2IzZHpJR0VnWkdWMlpXeHZjR1Z5SUhSdklITmxkQ0IwYUdVZ1lHbHVibVZ5U0ZSTlRHQWdiMllnWVc0Z1pXeGxiV1Z1ZEM1Y2JpQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0VWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTENBblpHbG1aa2x1Ym1WeVNGUk5UQ2NzSUh0Y2JpQWdJQ0JqYjI1bWFXZDFjbUZpYkdVNklIUnlkV1VzWEc1Y2JpQWdJQ0J6WlhRb2JtVjNTRlJOVENrZ2UxeHVJQ0FnSUNBZ2FXNXVaWEpJVkUxTUtIUm9hWE1zSUc1bGQwaFVUVXdwTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzVjYmlBZ0x5OGdRV3hzYjNkeklHRWdaR1YyWld4dmNHVnlJSFJ2SUhObGRDQjBhR1VnWUc5MWRHVnlTRlJOVEdBZ2IyWWdZVzRnWld4bGJXVnVkQzVjYmlBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLRVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxMQ0FuWkdsbVprOTFkR1Z5U0ZSTlRDY3NJSHRjYmlBZ0lDQmpiMjVtYVdkMWNtRmliR1U2SUhSeWRXVXNYRzVjYmlBZ0lDQnpaWFFvYm1WM1NGUk5UQ2tnZTF4dUlDQWdJQ0FnYjNWMFpYSklWRTFNS0hSb2FYTXNJRzVsZDBoVVRVd3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaUFnTHk4Z1FXeHNiM2R6SUdFZ1pHVjJaV3h2Y0dWeUlIUnZJR1JwWm1ZZ2RHaGxJR04xY25KbGJuUWdaV3hsYldWdWRDQjNhWFJvSUdFZ2JtVjNJR1ZzWlcxbGJuUXVYRzRnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaEZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTd2dKMlJwWm1aRmJHVnRaVzUwSnl3Z2UxeHVJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dkSEoxWlN4Y2JseHVJQ0FnSUhaaGJIVmxLRzVsZDBWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblFvZEdocGN5d2dibVYzUld4bGJXVnVkQ2s3WEc0Z0lDQWdmVnh1SUNCOUtUdGNibHh1SUNBdkx5QlNaV3hsWVhObGN5QjBhR1VnY21WMFlXbHVaV1FnYldWdGIzSjVJR0Z1WkNCM2IzSnJaWElnYVc1emRHRnVZMlV1WEc0Z0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaU3dnSjJScFptWlNaV3hsWVhObEp5d2dlMXh1SUNBZ0lHTnZibVpwWjNWeVlXSnNaVG9nZEhKMVpTeGNibHh1SUNBZ0lIWmhiSFZsS0c1bGQwVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lISmxiR1ZoYzJWT2IyUmxLSFJvYVhNcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdMeThnVUc5c2VXWnBiR3dnYVc0Z2RHaGxJR0J5WldkcGMzUmxja1ZzWlcxbGJuUmdJRzFsZEdodlpDQnBaaUJwZENCa2IyVnpiaWQwSUdGc2NtVmhaSGtnWlhocGMzUXVJRlJvYVhOY2JpQWdMeThnY21WeGRXbHlaWE1nY0dGMFkyaHBibWNnWUdOeVpXRjBaVVZzWlcxbGJuUmdJR0Z6SUhkbGJHd2dkRzhnWlc1emRYSmxJSFJvWVhRZ2RHaGxJSEJ5YjNCbGNpQndjbTkwYjF4dUlDQXZMeUJqYUdGcGJpQmxlR2x6ZEhNdVhHNGdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoa2IyTjFiV1Z1ZEN3Z0ozSmxaMmx6ZEdWeVJXeGxiV1Z1ZENjc0lIdGNiaUFnSUNCamIyNW1hV2QxY21GaWJHVTZJSFJ5ZFdVc1hHNWNiaUFnSUNCMllXeDFaU2gwWVdkT1lXMWxMQ0JqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0FnSUhKbFoybHpkR1Z5Uld4bGJXVnVkQ2gwWVdkT1lXMWxMQ0JqYjIxd2IyNWxiblFwTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzVjYmlBZ0x5OGdWR2hwY3lCelpXTjBhVzl1SUhkcGJHd2dZWFYwYjIxaGRHbGpZV3hzZVNCd1lYSnpaU0J2ZFhRZ2VXOTFjaUJsYm5ScGNtVWdjR0ZuWlNCMGJ5Qmxibk4xY21VZ1lXeHNYRzRnSUM4dklHTjFjM1J2YlNCbGJHVnRaVzUwY3lCaGNtVWdhRzl2YTJWa0lHbHVkRzh1WEc0Z0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0Nkc2IyRmtKeXdnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnZG1GeUlHUnZZM1Z0Wlc1MFJXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExtUnZZM1Z0Wlc1MFJXeGxiV1Z1ZER0Y2JseHVJQ0FnSUM4dklFRm1kR1Z5SUhSb1pTQnBibWwwYVdGc0lISmxibVJsY2l3Z1kyeGxZVzRnZFhBZ2RHaGxJSEpsYzI5MWNtTmxjeXdnYm04Z2NHOXBiblFnYVc0Z2JHbHVaMlZ5YVc1bkxseHVJQ0FnSUdSdlkzVnRaVzUwUld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R5Wlc1a1pYSkRiMjF3YkdWMFpTY3NJR1oxYm1OMGFXOXVJSEpsYm1SbGNpZ3BJSHRjYmlBZ0lDQWdJQzh2SUZKbGJHVmhjMlVnY21WemIzVnlZMlZ6SUhSdklIUm9aU0JsYkdWdFpXNTBMbHh1SUNBZ0lDQWdaRzlqZFcxbGJuUkZiR1Z0Wlc1MExtUnBabVpTWld4bFlYTmxLR1J2WTNWdFpXNTBSV3hsYldWdWRDazdYRzVjYmlBZ0lDQWdJQzh2SUZKbGJXOTJaU0IwYUdseklHVjJaVzUwSUd4cGMzUmxibVZ5TGx4dUlDQWdJQ0FnWkc5amRXMWxiblJGYkdWdFpXNTBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvSjNKbGJtUmxja052YlhCc1pYUmxKeXdnY21WdVpHVnlLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJQzh2SUVScFptWWdkR2hsSUdWdWRHbHlaU0JrYjJOMWJXVnVkQ0J2YmlCaFkzUnBkbUYwYVc5dUlHOW1JSFJvWlNCd2NtOXNiSGxtYVd4c0xseHVJQ0FnSUdSdlkzVnRaVzUwUld4bGJXVnVkQzVrYVdabVQzVjBaWEpJVkUxTUlEMGdaRzlqZFcxbGJuUkZiR1Z0Wlc1MExtOTFkR1Z5U0ZSTlREdGNiaUFnZlNrN1hHNTlYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYWtlO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIF9lbGVtZW50Q3VzdG9tID0gcmVxdWlyZSgnLi4vZWxlbWVudC9jdXN0b20nKTtcblxudmFyIHBvb2xzID0gX3V0aWxQb29scy5wb29scztcbnZhciBwcm90ZWN0RWxlbWVudCA9IF91dGlsTWVtb3J5LnByb3RlY3RFbGVtZW50O1xudmFyIHVucHJvdGVjdEVsZW1lbnQgPSBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50O1xudmFyIGVtcHR5ID0ge307XG5cbi8vIENhY2hlIGNyZWF0ZWQgbm9kZXMgaW5zaWRlIHRoaXMgb2JqZWN0LlxubWFrZS5ub2RlcyA9IHt9O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgbGl2ZSBub2RlIGludG8gYSB2aXJ0dWFsIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGVcbiAqIEByZXR1cm5cbiAqL1xuXG5mdW5jdGlvbiBtYWtlKG5vZGUsIHByb3RlY3QpIHtcbiAgdmFyIG5vZGVUeXBlID0gbm9kZS5ub2RlVHlwZTtcbiAgdmFyIG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xuXG4gIGlmICghbm9kZVR5cGUgfHwgbm9kZVR5cGUgPT09IDIgfHwgbm9kZVR5cGUgPT09IDQgfHwgbm9kZVR5cGUgPT09IDgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobm9kZVR5cGUgPT09IDMgJiYgIW5vZGVWYWx1ZS50cmltKCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBWaXJ0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgbm9kZSwgY29udGFpbmluZyBvbmx5IHRoZSBkYXRhIHdlIHdpc2ggdG9cbiAgLy8gZGlmZiBhbmQgcGF0Y2guXG4gIHZhciBlbnRyeSA9IHBvb2xzLmVsZW1lbnRPYmplY3QuZ2V0KCk7XG5cbiAgLy8gQWRkIHRvIGludGVybmFsIGxvb2t1cC5cbiAgbWFrZS5ub2Rlc1tlbnRyeS5lbGVtZW50XSA9IG5vZGU7XG5cbiAgZW50cnkubm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGVudHJ5Lm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcbiAgZW50cnkuY2hpbGROb2Rlcy5sZW5ndGggPSAwO1xuICBlbnRyeS5hdHRyaWJ1dGVzLmxlbmd0aCA9IDA7XG5cbiAgaWYgKHByb3RlY3QpIHtcbiAgICBwcm90ZWN0RWxlbWVudChlbnRyeSk7XG4gIH1cblxuICAvLyBDb2xsZWN0IGF0dHJpYnV0ZXMuXG4gIHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBubyBhdHRyaWJ1dGVzLCBza2lwIG92ZXIuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIGF0dHJpYnV0ZXNMZW5ndGggPSBhdHRyaWJ1dGVzLmxlbmd0aDtcblxuICAgIGlmIChhdHRyaWJ1dGVzTGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXNMZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcblxuICAgICAgICBpZiAocHJvdGVjdCkge1xuICAgICAgICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5wcm90ZWN0KGF0dHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXR0ci5uYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuICAgICAgICBhdHRyLnZhbHVlID0gYXR0cmlidXRlc1tpXS52YWx1ZTtcblxuICAgICAgICBlbnRyeS5hdHRyaWJ1dGVzW2VudHJ5LmF0dHJpYnV0ZXMubGVuZ3RoXSA9IGF0dHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29sbGVjdCBjaGlsZE5vZGVzLlxuICB2YXIgY2hpbGROb2RlcyA9IG5vZGUuY2hpbGROb2RlcztcbiAgdmFyIGNoaWxkTm9kZXNMZW5ndGggPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gIC8vIElmIHRoZSBlbGVtZW50IGhhcyBjaGlsZCBub2RlcywgY29udmVydCB0aGVtIGFsbCB0byB2aXJ0dWFsIG5vZGVzLlxuICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMyAmJiBjaGlsZE5vZGVzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuZXdOb2RlID0gbWFrZShjaGlsZE5vZGVzW2ldLCBwcm90ZWN0KTtcblxuICAgICAgaWYgKG5ld05vZGUpIHtcbiAgICAgICAgZW50cnkuY2hpbGROb2Rlc1tlbnRyeS5jaGlsZE5vZGVzLmxlbmd0aF0gPSBuZXdOb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8gUmVuYW1lIHRoaXMgdG8gZmlyc3QtcnVuLCBiZWNhdXNlIHdlJ3JlIGNhbGxpbmcgdGhlIGF0dGFjaCBjYWxsYmFja1xuICAvLyBhbmQgcHJvdGVjdGluZyBub3cuXG4gIGlmIChwcm90ZWN0KSB7XG4gICAgaWYgKF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbZW50cnkubm9kZU5hbWVdKSB7XG4gICAgICAvLyBSZXNldCB0aGUgcHJvdG90eXBlIGNoYWluIGZvciB0aGlzIGVsZW1lbnQuIFVwZ3JhZGUgd2lsbCByZXR1cm4gYHRydWVgXG4gICAgICAvLyBpZiB0aGUgZWxlbWVudCB3YXMgdXBncmFkZWQgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGlzIHVzZWZ1bCBzbyB3ZVxuICAgICAgLy8gZG9uJ3QgZW5kIHVwIGluIGEgbG9vcCB3aGVuIHdvcmtpbmcgd2l0aCB0aGUgc2FtZSBlbGVtZW50LlxuICAgICAgaWYgKCgwLCBfZWxlbWVudEN1c3RvbS51cGdyYWRlKShlbnRyeS5ub2RlTmFtZSwgbm9kZSkpIHtcbiAgICAgICAgLy8gSWYgdGhlIE5vZGUgaXMgaW4gdGhlIERPTSwgdHJpZ2dlciBhdHRhY2hlZCBjYWxsYmFjay5cbiAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSAmJiBub2RlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICBub2RlLmF0dGFjaGVkQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnRyeTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDI1dlpHVXZiV0ZyWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenR4UWtGeFFuZENMRWxCUVVrN08zbENRWEpDU1N4bFFVRmxPenN3UWtGSmVFTXNaMEpCUVdkQ096czJRa0ZEWVN4dFFrRkJiVUk3TzBGQlJYWkVMRWxCUVVrc1MwRkJTeXh0UWtGQlV5eERRVUZETzBGQlEyNUNMRWxCUVVrc1kwRkJZeXcyUWtGQmEwSXNRMEZCUXp0QlFVTnlReXhKUVVGSkxHZENRVUZuUWl3clFrRkJiMElzUTBGQlF6dEJRVU42UXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhGUVVGRkxFTkJRVU03T3p0QlFVZG1MRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZET3pzN096czdPenM3UVVGUlJDeFRRVUZUTEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1QwRkJUeXhGUVVGRk8wRkJRekZETEUxQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRE4wSXNUVUZCU1N4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF6czdRVUZGTDBJc1RVRkJTU3hEUVVGRExGRkJRVkVzU1VGQlNTeFJRVUZSTEV0QlFVc3NRMEZCUXl4SlFVRkpMRkZCUVZFc1MwRkJTeXhEUVVGRExFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNSVUZCUlR0QlFVTnVSU3hYUVVGUExFdEJRVXNzUTBGQlF6dEhRVU5rT3p0QlFVVkVMRTFCUVVrc1VVRkJVU3hMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1JVRkJSVHRCUVVOMlF5eFhRVUZQTEV0QlFVc3NRMEZCUXp0SFFVTmtPenM3TzBGQlNVUXNUVUZCU1N4TFFVRkxMRWRCUVVjc1MwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXpzN08wRkJSM1JETEUxQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXpzN1FVRkZha01zVDBGQlN5eERRVUZETEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBGQlF6ZERMRTlCUVVzc1EwRkJReXhUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETzBGQlF6VkNMRTlCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTTFRaXhQUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSVFZDTEUxQlFVa3NUMEZCVHl4RlFVRkZPMEZCUTFnc2EwSkJRV01zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SFFVTjJRanM3TzBGQlIwUXNUVUZCU1N4VlFVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF6czdPMEZCUjJwRExFMUJRVWtzVlVGQlZTeEZRVUZGTzBGQlEyUXNVVUZCU1N4blFrRkJaMElzUjBGQlJ5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPenRCUVVWNlF5eFJRVUZKTEdkQ1FVRm5RaXhGUVVGRk8wRkJRM0JDTEZkQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eG5Ra0ZCWjBJc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU42UXl4WlFVRkpMRWxCUVVrc1IwRkJSeXhMUVVGTExFTkJRVU1zWlVGQlpTeERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRPenRCUVVWMlF5eFpRVUZKTEU5QlFVOHNSVUZCUlR0QlFVTllMR1ZCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMU5CUTNKRE96dEJRVVZFTEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTXZRaXhaUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03TzBGQlJXcERMR0ZCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU03VDBGRGJFUTdTMEZEUmp0SFFVTkdPenM3UVVGSFJDeE5RVUZKTEZWQlFWVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRE8wRkJRMnBETEUxQlFVa3NaMEpCUVdkQ0xFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNN096dEJRVWM1UXl4TlFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFdEJRVXNzUTBGQlF5eEpRVUZKTEZWQlFWVXNSVUZCUlR0QlFVTnlReXhUUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRla01zVlVGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXpzN1FVRkZNME1zVlVGQlNTeFBRVUZQTEVWQlFVVTdRVUZEV0N4aFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRE8wOUJRM0pFTzB0QlEwWTdSMEZEUmpzN096dEJRVWxFTEUxQlFVa3NUMEZCVHl4RlFVRkZPMEZCUTFnc1VVRkJTU3d3UWtGQlZ5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVN096czdRVUZKT1VJc1ZVRkJTU3cwUWtGQlVTeExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhGUVVGRk96dEJRVVZxUXl4WlFVRkpMRWxCUVVrc1EwRkJReXhWUVVGVkxFbEJRVWtzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhGUVVGRk8wRkJRelZETEdOQlFVa3NRMEZCUXl4blFrRkJaMElzUlVGQlJTeERRVUZETzFOQlEzcENPMDlCUTBZN1MwRkRSanRIUVVOR096dEJRVVZFTEZOQlFVOHNTMEZCU3l4RFFVRkRPME5CUTJRaUxDSm1hV3hsSWpvaUwyaHZiV1V2ZEdsdEwyZHBkQzlrYVdabWFIUnRiQzlzYVdJdmJtOWtaUzl0WVd0bExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnY0c5dmJITWdZWE1nWDNCdmIyeHpJSDBnWm5KdmJTQW5MaTR2ZFhScGJDOXdiMjlzY3ljN1hHNXBiWEJ2Y25RZ2UxeHVJQ0J3Y205MFpXTjBSV3hsYldWdWRDQmhjeUJmY0hKdmRHVmpkRVZzWlcxbGJuUXNYRzRnSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFnWVhNZ1gzVnVjSEp2ZEdWamRFVnNaVzFsYm5SY2JuMGdabkp2YlNBbkxpNHZkWFJwYkM5dFpXMXZjbmtuTzF4dWFXMXdiM0owSUhzZ1kyOXRjRzl1Wlc1MGN5d2dkWEJuY21Ga1pTQjlJR1p5YjIwZ0p5NHVMMlZzWlcxbGJuUXZZM1Z6ZEc5dEp6dGNibHh1ZG1GeUlIQnZiMnh6SUQwZ1gzQnZiMnh6TzF4dWRtRnlJSEJ5YjNSbFkzUkZiR1Z0Wlc1MElEMGdYM0J5YjNSbFkzUkZiR1Z0Wlc1ME8xeHVkbUZ5SUhWdWNISnZkR1ZqZEVWc1pXMWxiblFnUFNCZmRXNXdjbTkwWldOMFJXeGxiV1Z1ZER0Y2JuWmhjaUJsYlhCMGVTQTlJSHQ5TzF4dVhHNHZMeUJEWVdOb1pTQmpjbVZoZEdWa0lHNXZaR1Z6SUdsdWMybGtaU0IwYUdseklHOWlhbVZqZEM1Y2JtMWhhMlV1Ym05a1pYTWdQU0I3ZlR0Y2JseHVMeW9xWEc0Z0tpQkRiMjUyWlhKMGN5QmhJR3hwZG1VZ2JtOWtaU0JwYm5SdklHRWdkbWx5ZEhWaGJDQnViMlJsTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0J1YjJSbFhHNGdLaUJBY21WMGRYSnVYRzRnS2k5Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdaMWJtTjBhVzl1SUcxaGEyVW9ibTlrWlN3Z2NISnZkR1ZqZENrZ2UxeHVJQ0JzWlhRZ2JtOWtaVlI1Y0dVZ1BTQnViMlJsTG01dlpHVlVlWEJsTzF4dUlDQnNaWFFnYm05a1pWWmhiSFZsSUQwZ2JtOWtaUzV1YjJSbFZtRnNkV1U3WEc1Y2JpQWdhV1lnS0NGdWIyUmxWSGx3WlNCOGZDQnViMlJsVkhsd1pTQTlQVDBnTWlCOGZDQnViMlJsVkhsd1pTQTlQVDBnTkNCOGZDQnViMlJsVkhsd1pTQTlQVDBnT0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnZlZ4dVhHNGdJR2xtSUNodWIyUmxWSGx3WlNBOVBUMGdNeUFtSmlBaGJtOWtaVlpoYkhWbExuUnlhVzBvS1NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnZlZ4dVhHNGdJQzh2SUZacGNuUjFZV3dnY21Wd2NtVnpaVzUwWVhScGIyNGdiMllnWVNCdWIyUmxMQ0JqYjI1MFlXbHVhVzVuSUc5dWJIa2dkR2hsSUdSaGRHRWdkMlVnZDJsemFDQjBiMXh1SUNBdkx5QmthV1ptSUdGdVpDQndZWFJqYUM1Y2JpQWdiR1YwSUdWdWRISjVJRDBnY0c5dmJITXVaV3hsYldWdWRFOWlhbVZqZEM1blpYUW9LVHRjYmx4dUlDQXZMeUJCWkdRZ2RHOGdhVzUwWlhKdVlXd2diRzl2YTNWd0xseHVJQ0J0WVd0bExtNXZaR1Z6VzJWdWRISjVMbVZzWlcxbGJuUmRJRDBnYm05a1pUdGNibHh1SUNCbGJuUnllUzV1YjJSbFRtRnRaU0E5SUc1dlpHVXVibTlrWlU1aGJXVXVkRzlNYjNkbGNrTmhjMlVvS1R0Y2JpQWdaVzUwY25rdWJtOWtaVlpoYkhWbElEMGdibTlrWlZaaGJIVmxPMXh1SUNCbGJuUnllUzVqYUdsc1pFNXZaR1Z6TG14bGJtZDBhQ0E5SURBN1hHNGdJR1Z1ZEhKNUxtRjBkSEpwWW5WMFpYTXViR1Z1WjNSb0lEMGdNRHRjYmx4dUlDQnBaaUFvY0hKdmRHVmpkQ2tnZTF4dUlDQWdJSEJ5YjNSbFkzUkZiR1Z0Wlc1MEtHVnVkSEo1S1R0Y2JpQWdmVnh1WEc0Z0lDOHZJRU52Ykd4bFkzUWdZWFIwY21saWRYUmxjeTVjYmlBZ2JHVjBJR0YwZEhKcFluVjBaWE1nUFNCdWIyUmxMbUYwZEhKcFluVjBaWE03WEc1Y2JpQWdMeThnU1dZZ2RHaGxJR1ZzWlcxbGJuUWdhR0Z6SUc1dklHRjBkSEpwWW5WMFpYTXNJSE5yYVhBZ2IzWmxjaTVjYmlBZ2FXWWdLR0YwZEhKcFluVjBaWE1wSUh0Y2JpQWdJQ0JzWlhRZ1lYUjBjbWxpZFhSbGMweGxibWQwYUNBOUlHRjBkSEpwWW5WMFpYTXViR1Z1WjNSb08xeHVYRzRnSUNBZ2FXWWdLR0YwZEhKcFluVjBaWE5NWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnWVhSMGNtbGlkWFJsYzB4bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQWdJR3hsZENCaGRIUnlJRDBnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExtZGxkQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h3Y205MFpXTjBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NHOXZiSE11WVhSMGNtbGlkWFJsVDJKcVpXTjBMbkJ5YjNSbFkzUW9ZWFIwY2lrN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JoZEhSeUxtNWhiV1VnUFNCaGRIUnlhV0oxZEdWelcybGRMbTVoYldVN1hHNGdJQ0FnSUNBZ0lHRjBkSEl1ZG1Gc2RXVWdQU0JoZEhSeWFXSjFkR1Z6VzJsZExuWmhiSFZsTzF4dVhHNGdJQ0FnSUNBZ0lHVnVkSEo1TG1GMGRISnBZblYwWlhOYlpXNTBjbmt1WVhSMGNtbGlkWFJsY3k1c1pXNW5kR2hkSUQwZ1lYUjBjanRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2THlCRGIyeHNaV04wSUdOb2FXeGtUbTlrWlhNdVhHNGdJR3hsZENCamFHbHNaRTV2WkdWeklEMGdibTlrWlM1amFHbHNaRTV2WkdWek8xeHVJQ0JzWlhRZ1kyaHBiR1JPYjJSbGMweGxibWQwYUNBOUlHNXZaR1V1WTJocGJHUk9iMlJsY3k1c1pXNW5kR2c3WEc1Y2JpQWdMeThnU1dZZ2RHaGxJR1ZzWlcxbGJuUWdhR0Z6SUdOb2FXeGtJRzV2WkdWekxDQmpiMjUyWlhKMElIUm9aVzBnWVd4c0lIUnZJSFpwY25SMVlXd2dibTlrWlhNdVhHNGdJR2xtSUNodWIyUmxMbTV2WkdWVWVYQmxJQ0U5UFNBeklDWW1JR05vYVd4a1RtOWtaWE1wSUh0Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUdOb2FXeGtUbTlrWlhOTVpXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdiR1YwSUc1bGQwNXZaR1VnUFNCdFlXdGxLR05vYVd4a1RtOWtaWE5iYVYwc0lIQnliM1JsWTNRcE8xeHVYRzRnSUNBZ0lDQnBaaUFvYm1WM1RtOWtaU2tnZTF4dUlDQWdJQ0FnSUNCbGJuUnllUzVqYUdsc1pFNXZaR1Z6VzJWdWRISjVMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9YU0E5SUc1bGQwNXZaR1U3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHk4Z1ZFOUVUeUJTWlc1aGJXVWdkR2hwY3lCMGJ5Qm1hWEp6ZEMxeWRXNHNJR0psWTJGMWMyVWdkMlVuY21VZ1kyRnNiR2x1WnlCMGFHVWdZWFIwWVdOb0lHTmhiR3hpWVdOclhHNGdJQzh2SUdGdVpDQndjbTkwWldOMGFXNW5JRzV2ZHk1Y2JpQWdhV1lnS0hCeWIzUmxZM1FwSUh0Y2JpQWdJQ0JwWmlBb1kyOXRjRzl1Wlc1MGMxdGxiblJ5ZVM1dWIyUmxUbUZ0WlYwcElIdGNiaUFnSUNBZ0lDOHZJRkpsYzJWMElIUm9aU0J3Y205MGIzUjVjR1VnWTJoaGFXNGdabTl5SUhSb2FYTWdaV3hsYldWdWRDNGdWWEJuY21Ga1pTQjNhV3hzSUhKbGRIVnliaUJnZEhKMVpXQmNiaUFnSUNBZ0lDOHZJR2xtSUhSb1pTQmxiR1Z0Wlc1MElIZGhjeUIxY0dkeVlXUmxaQ0JtYjNJZ2RHaGxJR1pwY25OMElIUnBiV1V1SUZSb2FYTWdhWE1nZFhObFpuVnNJSE52SUhkbFhHNGdJQ0FnSUNBdkx5QmtiMjRuZENCbGJtUWdkWEFnYVc0Z1lTQnNiMjl3SUhkb1pXNGdkMjl5YTJsdVp5QjNhWFJvSUhSb1pTQnpZVzFsSUdWc1pXMWxiblF1WEc0Z0lDQWdJQ0JwWmlBb2RYQm5jbUZrWlNobGJuUnllUzV1YjJSbFRtRnRaU3dnYm05a1pTa3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1NXWWdkR2hsSUU1dlpHVWdhWE1nYVc0Z2RHaGxJRVJQVFN3Z2RISnBaMmRsY2lCaGRIUmhZMmhsWkNCallXeHNZbUZqYXk1Y2JpQWdJQ0FnSUNBZ2FXWWdLRzV2WkdVdWNHRnlaVzUwVG05a1pTQW1KaUJ1YjJSbExtRjBkR0ZqYUdWa1EyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lDQWdJQ0J1YjJSbExtRjBkR0ZqYUdWa1EyRnNiR0poWTJzb0tUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQmxiblJ5ZVR0Y2JuMWNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJlbGVhc2VOb2RlID0gcmVsZWFzZU5vZGU7XG5leHBvcnRzLnBhdGNoTm9kZSA9IHBhdGNoTm9kZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2N1c3RvbUV2ZW50ID0gcmVxdWlyZSgnY3VzdG9tLWV2ZW50Jyk7XG5cbnZhciBfY3VzdG9tRXZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3VzdG9tRXZlbnQpO1xuXG52YXIgX3dvcmtlckNyZWF0ZSA9IHJlcXVpcmUoJy4uL3dvcmtlci9jcmVhdGUnKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbFBhcnNlciA9IHJlcXVpcmUoJy4uL3V0aWwvcGFyc2VyJyk7XG5cbnZhciBfcGF0Y2hlc1Byb2Nlc3MgPSByZXF1aXJlKCcuLi9wYXRjaGVzL3Byb2Nlc3MnKTtcblxudmFyIF9wYXRjaGVzUHJvY2VzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYXRjaGVzUHJvY2Vzcyk7XG5cbnZhciBfbWFrZSA9IHJlcXVpcmUoJy4vbWFrZScpO1xuXG52YXIgX21ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFrZSk7XG5cbnZhciBfZWxlbWVudE1ha2UgPSByZXF1aXJlKCcuLi9lbGVtZW50L21ha2UnKTtcblxudmFyIF9lbGVtZW50TWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lbGVtZW50TWFrZSk7XG5cbnZhciBfc3luYyA9IHJlcXVpcmUoJy4vc3luYycpO1xuXG52YXIgX3N5bmMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3luYyk7XG5cbnZhciBfdHJlZSA9IHJlcXVpcmUoJy4vdHJlZScpO1xuXG4vKipcbiAqIFdoZW4gdGhlIHdvcmtlciBjb21wbGV0ZXMsIGNsZWFuIHVwIG1lbW9yeSBhbmQgc2NoZWR1bGUgdGhlIG5leHQgcmVuZGVyIGlmXG4gKiBuZWNlc3NhcnkuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBlbGVtZW50TWV0YVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGNvbXBsZXRlV29ya2VyUmVuZGVyKGVsZW1lbnQsIGVsZW1lbnRNZXRhKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXYpIHtcbiAgICB2YXIgbm9kZXMgPSBldi5kYXRhLm5vZGVzO1xuXG4gICAgLy8gQWRkIG5ldyBlbGVtZW50cy5cbiAgICBpZiAobm9kZXMuYWRkaXRpb25zLmxlbmd0aCkge1xuICAgICAgbm9kZXMuYWRkaXRpb25zLm1hcChfdXRpbE1lbW9yeS5wcm90ZWN0RWxlbWVudCkubWFwKGZ1bmN0aW9uIChkZXNjcmlwdG9yKSB7XG4gICAgICAgIC8vIEluamVjdCBpbnRvIHRoZSBgb2xkVHJlZWAgc28gaXQncyBjbGVhbmVkIHVwIGNvcnJlY3RseS5cbiAgICAgICAgZWxlbWVudE1ldGEub2xkVHJlZS5jaGlsZE5vZGVzLnB1c2goZGVzY3JpcHRvcik7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgICAgfSkuZm9yRWFjaChfZWxlbWVudE1ha2UyWydkZWZhdWx0J10pO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZVJlbmRlciA9IGZ1bmN0aW9uIGNvbXBsZXRlUmVuZGVyKCkge1xuICAgICAgLy8gUmVtb3ZlIHVudXNlZCBlbGVtZW50cy5cbiAgICAgIGlmIChub2Rlcy5yZW1vdmFscy5sZW5ndGgpIHtcbiAgICAgICAgbm9kZXMucmVtb3ZhbHMuZm9yRWFjaChfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVzZXQgaW50ZXJuYWwgY2FjaGVzIGZvciBxdWlja2VyIGxvb2t1cHMgaW4gdGhlIGZ1dHVyZXMuXG4gICAgICBlbGVtZW50TWV0YS5faW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgICBlbGVtZW50TWV0YS5fb3V0ZXJIVE1MID0gZWxlbWVudC5vdXRlckhUTUw7XG4gICAgICBlbGVtZW50TWV0YS5fdGV4dENvbnRlbnQgPSBlbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgICAvLyBSZWN5Y2xlIGFsbCB1bnByb3RlY3RlZCBhbGxvY2F0aW9ucy5cbiAgICAgICgwLCBfdXRpbE1lbW9yeS5jbGVhbk1lbW9yeSkoKTtcblxuICAgICAgZWxlbWVudE1ldGEuaGFzV29ya2VyUmVuZGVyZWQgPSB0cnVlO1xuICAgICAgZWxlbWVudE1ldGEuaXNSZW5kZXJpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gVGhpcyBpcyBkZXNpZ25lZCB0byBoYW5kbGUgdXNlIGNhc2VzIHdoZXJlIHJlbmRlcnMgYXJlIGJlaW5nIGhhbW1lcmVkXG4gICAgICAvLyBvciB3aGVuIHRyYW5zaXRpb25zIGFyZSB1c2VkIHdpdGggUHJvbWlzZXMuXG4gICAgICBpZiAoZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyKSB7XG4gICAgICAgIHZhciBuZXh0UmVuZGVyID0gZWxlbWVudE1ldGEucmVuZGVyQnVmZmVyO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBidWZmZXIuXG4gICAgICAgIGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBOb3RpY2luZyBzb21lIHdlaXJkIHBlcmZvcm1hbmNlIGltcGxpY2F0aW9ucyB3aXRoIHRoaXMgY29uY2VwdC5cbiAgICAgICAgcGF0Y2hOb2RlKGVsZW1lbnQsIG5leHRSZW5kZXIubmV3SFRNTCwgbmV4dFJlbmRlci5vcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8vIERpc3BhdGNoIGFuIGV2ZW50IG9uIHRoZSBlbGVtZW50IG9uY2UgcmVuZGVyaW5nIGhhcyBjb21wbGV0ZWQuXG4gICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IF9jdXN0b21FdmVudDJbJ2RlZmF1bHQnXSgncmVuZGVyQ29tcGxldGUnKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gV2FpdCB1bnRpbCBhbGwgcHJvbWlzZXMgaGF2ZSByZXNvbHZlZCwgYmVmb3JlIGZpbmlzaGluZyB1cCB0aGUgcGF0Y2hcbiAgICAvLyBjeWNsZS5cbiAgICAvLyBQcm9jZXNzIHRoZSBkYXRhIGltbWVkaWF0ZWx5IGFuZCB3YWl0IHVudGlsIGFsbCB0cmFuc2l0aW9uIGNhbGxiYWNrc1xuICAgIC8vIGhhdmUgY29tcGxldGVkLlxuICAgIHZhciBwcm9jZXNzUHJvbWlzZSA9ICgwLCBfcGF0Y2hlc1Byb2Nlc3MyWydkZWZhdWx0J10pKGVsZW1lbnQsIGV2LmRhdGEucGF0Y2hlcyk7XG5cbiAgICAvLyBPcGVyYXRlIHN5bmNocm9ub3VzbHkgdW5sZXNzIG9wdGVkIGludG8gYSBQcm9taXNlLWNoYWluLlxuICAgIGlmIChwcm9jZXNzUHJvbWlzZSkge1xuICAgICAgcHJvY2Vzc1Byb21pc2UudGhlbihjb21wbGV0ZVJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBsZXRlUmVuZGVyKCk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFJlbGVhc2UncyB0aGUgYWxsb2NhdGVkIG9iamVjdHMgYW5kIHJlY3ljbGVzIGludGVybmFsIG1lbW9yeS5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHJlbGVhc2VOb2RlKGVsZW1lbnQpIHtcbiAgdmFyIGVsZW1lbnRNZXRhID0gX3RyZWUuVHJlZUNhY2hlLmdldChlbGVtZW50KSB8fCB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBhIHdvcmtlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbGVtZW50LCB0aGVuIGtpbGwgaXQuXG4gIGlmIChlbGVtZW50TWV0YS53b3JrZXIpIHtcbiAgICBlbGVtZW50TWV0YS53b3JrZXIudGVybWluYXRlKCk7XG4gIH1cblxuICAvLyBJZiB0aGVyZSB3YXMgYSB0cmVlIHNldCB1cCwgcmVjeWNsZSB0aGUgbWVtb3J5IGFsbG9jYXRlZCBmb3IgaXQuXG4gIGlmIChlbGVtZW50TWV0YS5vbGRUcmVlKSB7XG4gICAgKDAsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQpKGVsZW1lbnRNZXRhLm9sZFRyZWUpO1xuICAgICgwLCBfdXRpbE1lbW9yeS5jbGVhbk1lbW9yeSkoKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSB0aGlzIGVsZW1lbnQncyBtZXRhIG9iamVjdCBmcm9tIHRoZSBjYWNoZS5cbiAgX3RyZWUuVHJlZUNhY2hlWydkZWxldGUnXShlbGVtZW50KTtcbn1cblxuLyoqXG4gKiBQYXRjaGVzIGFuIGVsZW1lbnQncyBET00gdG8gbWF0Y2ggdGhhdCBvZiB0aGUgcGFzc2VkIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIG5ld0hUTUxcbiAqL1xuXG5mdW5jdGlvbiBwYXRjaE5vZGUoZWxlbWVudCwgbmV3SFRNTCwgb3B0aW9ucykge1xuICAvLyBFbnN1cmUgdGhhdCB0aGUgZG9jdW1lbnQgZGlzYWJsZSB3b3JrZXIgaXMgYWx3YXlzIHBpY2tlZCB1cC5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmVuYWJsZVdvcmtlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0aW9ucy5lbmFibGVXb3JrZXIgPSBkb2N1bWVudC5FTkFCTEVfV09SS0VSO1xuICB9XG5cbiAgdmFyIGVsZW1lbnRNZXRhID0gX3RyZWUuVHJlZUNhY2hlLmdldChlbGVtZW50KSB8fCB7fTtcblxuICAvLyBBbHdheXMgZW5zdXJlIHRoZSBtb3N0IHVwLXRvLWRhdGUgbWV0YSBvYmplY3QgaXMgc3RvcmVkLlxuICBfdHJlZS5UcmVlQ2FjaGUuc2V0KGVsZW1lbnQsIGVsZW1lbnRNZXRhKTtcblxuICBpZiAoZWxlbWVudE1ldGEuaXNSZW5kZXJpbmcpIHtcbiAgICAvLyBBZGQgdGhpcyBuZXcgcmVuZGVyIGludG8gdGhlIGJ1ZmZlciBxdWV1ZS5cbiAgICBlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIgPSB7IG5ld0hUTUw6IG5ld0hUTUwsIG9wdGlvbnM6IG9wdGlvbnMgfTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLFxuICAvLyBhYm9ydC5cbiAgb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50LmlubmVySFRNTCA9PT0gbmV3SFRNTCB8fFxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGJ1dCB0aGUgY29udGVudHMgaGF2ZW4ndCBjaGFuZ2VkLFxuICAvLyBhYm9ydC5cbiAgIW9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudC5vdXRlckhUTUwgPT09IG5ld0hUTUwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYGlubmVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgb3B0aW9ucy5pbm5lciAmJiBlbGVtZW50TWV0YS5faW5uZXJIVE1MICE9PSBlbGVtZW50LmlubmVySFRNTCB8fFxuXG4gIC8vIElmIHRoZSBvcGVyYXRpb24gaXMgYG91dGVySFRNTGAsIGFuZCB0aGUgY3VycmVudCBlbGVtZW50J3MgY29udGVudHMgaGF2ZVxuICAvLyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHJlbmRlciBsb29wLCByZWNhbGN1bGF0ZSB0aGUgdHJlZS5cbiAgIW9wdGlvbnMuaW5uZXIgJiYgZWxlbWVudE1ldGEuX291dGVySFRNTCAhPT0gZWxlbWVudC5vdXRlckhUTUwgfHxcblxuICAvLyBJZiB0aGUgdGV4dCBjb250ZW50IGV2ZXIgY2hhbmdlcywgcmVjYWxjdWxhdGUgdGhlIHRyZWUuXG4gIGVsZW1lbnRNZXRhLl90ZXh0Q29udGVudCAhPT0gZWxlbWVudC50ZXh0Q29udGVudCkge1xuICAgIGlmIChlbGVtZW50TWV0YS5vbGRUcmVlKSB7XG4gICAgICAoMCwgX3V0aWxNZW1vcnkudW5wcm90ZWN0RWxlbWVudCkoZWxlbWVudE1ldGEub2xkVHJlZSk7XG4gICAgICAoMCwgX3V0aWxNZW1vcnkuY2xlYW5NZW1vcnkpKCk7XG4gICAgfVxuXG4gICAgZWxlbWVudE1ldGEub2xkVHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkoZWxlbWVudCwgdHJ1ZSk7XG4gICAgZWxlbWVudE1ldGEudXBkYXRlT2xkVHJlZSA9IHRydWU7XG4gIH1cblxuICAvLyBXaWxsIHdhbnQgdG8gZW5zdXJlIHRoYXQgdGhlIGZpcnN0IHJlbmRlciB3ZW50IHRocm91Z2gsIHRoZSB3b3JrZXIgY2FuXG4gIC8vIHRha2UgYSBiaXQgdG8gc3RhcnR1cCBhbmQgd2Ugd2FudCB0byBzaG93IGNoYW5nZXMgYXMgc29vbiBhcyBwb3NzaWJsZS5cbiAgaWYgKG9wdGlvbnMuZW5hYmxlV29ya2VyICYmIF93b3JrZXJDcmVhdGUuaGFzV29ya2VyKSB7XG4gICAgLy8gU2V0IGEgcmVuZGVyIGxvY2sgYXMgdG8gbm90IGZsb29kIHRoZSB3b3JrZXIuXG4gICAgZWxlbWVudE1ldGEuaXNSZW5kZXJpbmcgPSB0cnVlO1xuXG4gICAgLy8gQ3JlYXRlIGEgd29ya2VyIGZvciB0aGlzIGVsZW1lbnQuXG4gICAgdmFyIHdvcmtlciA9IGVsZW1lbnRNZXRhLndvcmtlciA9IGVsZW1lbnRNZXRhLndvcmtlciB8fCAoMCwgX3dvcmtlckNyZWF0ZS5jcmVhdGUpKCk7XG5cbiAgICAvLyBBdHRhY2ggYWxsIHByb3BlcnRpZXMgaGVyZSB0byB0cmFuc3BvcnQuXG4gICAgdmFyIHRyYW5zZmVyT2JqZWN0ID0ge307XG5cbiAgICAvLyBUaGlzIHNob3VsZCBvbmx5IG9jY3VyIG9uY2UsIG9yIHdoZW5ldmVyIHRoZSBtYXJrdXAgY2hhbmdlcyBleHRlcm5hbGx5XG4gICAgLy8gdG8gZGlmZkhUTUwuXG4gICAgaWYgKCFlbGVtZW50TWV0YS5oYXNXb3JrZXJSZW5kZXJlZCB8fCBlbGVtZW50TWV0YS51cGRhdGVPbGRUcmVlKSB7XG4gICAgICB0cmFuc2Zlck9iamVjdC5vbGRUcmVlID0gZWxlbWVudE1ldGEub2xkVHJlZTtcbiAgICAgIGVsZW1lbnRNZXRhLnVwZGF0ZU9sZFRyZWUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBdHRhY2ggdGhlIHBhcmVudCBlbGVtZW50J3MgdXVpZC5cbiAgICB0cmFuc2Zlck9iamVjdC51dWlkID0gZWxlbWVudE1ldGEub2xkVHJlZS5lbGVtZW50O1xuXG4gICAgaWYgKHR5cGVvZiBuZXdIVE1MICE9PSAnc3RyaW5nJykge1xuICAgICAgdHJhbnNmZXJPYmplY3QubmV3VHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkobmV3SFRNTCk7XG5cbiAgICAgIC8vIFRyYW5zZmVyIHRoaXMgYnVmZmVyIHRvIHRoZSB3b3JrZXIsIHdoaWNoIHdpbGwgdGFrZSBvdmVyIGFuZCBwcm9jZXNzIHRoZVxuICAgICAgLy8gbWFya3VwLlxuICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHRyYW5zZmVyT2JqZWN0KTtcblxuICAgICAgLy8gV2FpdCBmb3IgdGhlIHdvcmtlciB0byBmaW5pc2ggcHJvY2Vzc2luZyBhbmQgdGhlbiBhcHBseSB0aGUgcGF0Y2hzZXQuXG4gICAgICB3b3JrZXIub25tZXNzYWdlID0gY29tcGxldGVXb3JrZXJSZW5kZXIoZWxlbWVudCwgZWxlbWVudE1ldGEpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGV0IHRoZSBicm93c2VyIGNvcHkgdGhlIEhUTUwgaW50byB0aGUgd29ya2VyLCBjb252ZXJ0aW5nIHRvIGFcbiAgICAvLyB0cmFuc2ZlcmFibGUgb2JqZWN0IGlzIHRvbyBleHBlbnNpdmUuXG4gICAgdHJhbnNmZXJPYmplY3QubmV3SFRNTCA9IG5ld0hUTUw7XG5cbiAgICAvLyBBZGQgcHJvcGVydGllcyB0byBzZW5kIHRvIHdvcmtlci5cbiAgICB0cmFuc2Zlck9iamVjdC5pc0lubmVyID0gb3B0aW9ucy5pbm5lcjtcblxuICAgIC8vIFRyYW5zZmVyIHRoaXMgYnVmZmVyIHRvIHRoZSB3b3JrZXIsIHdoaWNoIHdpbGwgdGFrZSBvdmVyIGFuZCBwcm9jZXNzIHRoZVxuICAgIC8vIG1hcmt1cC5cbiAgICB3b3JrZXIucG9zdE1lc3NhZ2UodHJhbnNmZXJPYmplY3QpO1xuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHdvcmtlciB0byBmaW5pc2ggcHJvY2Vzc2luZyBhbmQgdGhlbiBhcHBseSB0aGUgcGF0Y2hzZXQuXG4gICAgd29ya2VyLm9ubWVzc2FnZSA9IGNvbXBsZXRlV29ya2VyUmVuZGVyKGVsZW1lbnQsIGVsZW1lbnRNZXRhKTtcbiAgfSBlbHNlIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2UncmUgcmVuZGVyaW5nIGluIHRoZSBVSSB0aHJlYWQuXG4gICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IHRydWU7XG5cbiAgICAgIHZhciBwYXRjaGVzID0gW107XG4gICAgICB2YXIgbmV3VHJlZSA9IG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgbmV3SFRNTCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbmV3VHJlZSA9ICgwLCBfdXRpbFBhcnNlci5wYXJzZUhUTUwpKG5ld0hUTUwsIG9wdGlvbnMuaW5uZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VHJlZSA9ICgwLCBfbWFrZTJbJ2RlZmF1bHQnXSkobmV3SFRNTCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmlubmVyKSB7XG4gICAgICAgIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZTtcblxuICAgICAgICBuZXdUcmVlID0ge1xuICAgICAgICAgIGNoaWxkTm9kZXM6IGNoaWxkTm9kZXMsXG5cbiAgICAgICAgICBhdHRyaWJ1dGVzOiBlbGVtZW50TWV0YS5vbGRUcmVlLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgZWxlbWVudDogZWxlbWVudE1ldGEub2xkVHJlZS5lbGVtZW50LFxuICAgICAgICAgIG5vZGVOYW1lOiBlbGVtZW50TWV0YS5vbGRUcmVlLm5vZGVOYW1lLFxuICAgICAgICAgIG5vZGVWYWx1ZTogZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlVmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9sZFRyZWVOYW1lID0gZWxlbWVudE1ldGEub2xkVHJlZS5ub2RlTmFtZSB8fCAnJztcbiAgICAgIHZhciBuZXdOb2RlTmFtZSA9IG5ld1RyZWUgJiYgbmV3VHJlZS5ub2RlTmFtZTtcblxuICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgbm9kZSB0eXBlcyBtYXRjaCwgdHJ5IGFuZCBjb21wYXJlIHRoZW0uXG4gICAgICBpZiAob2xkVHJlZU5hbWUgPT09IG5ld05vZGVOYW1lKSB7XG4gICAgICAgIC8vIFN5bmNocm9uaXplIHRoZSB0cmVlLlxuICAgICAgICBfc3luYzJbJ2RlZmF1bHQnXS5jYWxsKHBhdGNoZXMsIGVsZW1lbnRNZXRhLm9sZFRyZWUsIG5ld1RyZWUpO1xuICAgICAgfVxuICAgICAgLy8gT3RoZXJ3aXNlIHJlcGxhY2UgdGhlIHRvcCBsZXZlbCBlbGVtZW50cy5cbiAgICAgIGVsc2UgaWYgKG5ld0hUTUwpIHtcbiAgICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgICAgICAgIF9fZG9fXzogMCxcbiAgICAgICAgICAgIG9sZDogZWxlbWVudE1ldGEub2xkVHJlZSxcbiAgICAgICAgICAgICduZXcnOiBuZXdUcmVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgICgwLCBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50KShlbGVtZW50TWV0YS5vbGRUcmVlKTtcblxuICAgICAgICAgIGVsZW1lbnRNZXRhLm9sZFRyZWUgPSBuZXdUcmVlO1xuICAgICAgICB9XG5cbiAgICAgIHZhciBjb21wbGV0ZVJlbmRlciA9IGZ1bmN0aW9uIGNvbXBsZXRlUmVuZGVyKCkge1xuICAgICAgICAvLyBNYXJrIHRoYXQgdGhpcyBlbGVtZW50IGhhcyBpbml0aWFsbHkgcmVuZGVyZWQgYW5kIGlzIGRvbmUgcmVuZGVyaW5nLlxuICAgICAgICBlbGVtZW50TWV0YS5pc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIFNldCB0aGUgaW5uZXJIVE1MLlxuICAgICAgICBlbGVtZW50TWV0YS5faW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgIGVsZW1lbnRNZXRhLl9vdXRlckhUTUwgPSBlbGVtZW50Lm91dGVySFRNTDtcbiAgICAgICAgZWxlbWVudE1ldGEuX3RleHRDb250ZW50ID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgICAgICAoMCwgX3V0aWxNZW1vcnkuY2xlYW5NZW1vcnkpKCk7XG5cbiAgICAgICAgLy8gQ2xlYW4gb3V0IHRoZSBwYXRjaGVzIGFycmF5LlxuICAgICAgICBwYXRjaGVzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggYW4gZXZlbnQgb24gdGhlIGVsZW1lbnQgb25jZSByZW5kZXJpbmcgaGFzIGNvbXBsZXRlZC5cbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBfY3VzdG9tRXZlbnQyWydkZWZhdWx0J10oJ3JlbmRlckNvbXBsZXRlJykpO1xuXG4gICAgICAgIC8vIFRPRE8gVXBkYXRlIHRoaXMgY29tbWVudCBhbmQvb3IgcmVmYWN0b3IgdG8gdXNlIHRoZSBzYW1lIGFzIHRoZSBXb3JrZXIuXG4gICAgICAgIGlmIChlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIpIHtcbiAgICAgICAgICB2YXIgbmV4dFJlbmRlciA9IGVsZW1lbnRNZXRhLnJlbmRlckJ1ZmZlcjtcbiAgICAgICAgICBlbGVtZW50TWV0YS5yZW5kZXJCdWZmZXIgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAvLyBOb3RpY2luZyBzb21lIHdlaXJkIHBlcmZvcm1hbmNlIGltcGxpY2F0aW9ucyB3aXRoIHRoaXMgY29uY2VwdC5cbiAgICAgICAgICBwYXRjaE5vZGUoZWxlbWVudCwgbmV4dFJlbmRlci5uZXdIVE1MLCBuZXh0UmVuZGVyLm9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBQcm9jZXNzIHRoZSBkYXRhIGltbWVkaWF0ZWx5IGFuZCB3YWl0IHVudGlsIGFsbCB0cmFuc2l0aW9uIGNhbGxiYWNrc1xuICAgICAgLy8gaGF2ZSBjb21wbGV0ZWQuXG4gICAgICB2YXIgcHJvY2Vzc1Byb21pc2UgPSAoMCwgX3BhdGNoZXNQcm9jZXNzMlsnZGVmYXVsdCddKShlbGVtZW50LCBwYXRjaGVzKTtcblxuICAgICAgLy8gT3BlcmF0ZSBzeW5jaHJvbm91c2x5IHVubGVzcyBvcHRlZCBpbnRvIGEgUHJvbWlzZS1jaGFpbi5cbiAgICAgIGlmIChwcm9jZXNzUHJvbWlzZSkge1xuICAgICAgICBwcm9jZXNzUHJvbWlzZS50aGVuKGNvbXBsZXRlUmVuZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRlUmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2Y0dGMFkyZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenN5UWtGQmQwSXNZMEZCWXpzN096czBRa0ZEV1N4clFrRkJhMEk3T3pCQ1FVTk9MR2RDUVVGblFqczdlVUpCUTNoRUxHVkJRV1U3T3pCQ1FVTllMR2RDUVVGblFqczdPRUpCUTJZc2IwSkJRVzlDT3pzN08yOUNRVU14UWl4UlFVRlJPenM3T3pKQ1FVTk1MR2xDUVVGcFFqczdPenR2UWtGRGNFSXNVVUZCVVRzN096dHZRa0ZEU0N4UlFVRlJPenM3T3pzN096czdPMEZCVld4RExGTkJRVk1zYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUlVGQlJUdEJRVU5zUkN4VFFVRlBMRlZCUVZNc1JVRkJSU3hGUVVGRk8wRkJRMnhDTEZGQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZET3pzN1FVRkhNVUlzVVVGQlNTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVNeFFpeFhRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc05FSkJRV2RDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1ZVRkJWU3hGUVVGSk96dEJRVVZ3UkN4dFFrRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRMmhFTEdWQlFVOHNWVUZCVlN4RFFVRkRPMDlCUTI1Q0xFTkJRVU1zUTBGQlF5eFBRVUZQTERCQ1FVRmhMRU5CUVVNN1MwRkRla0k3TzBGQlJVUXNVVUZCU1N4alFVRmpMRWRCUVVjc1UwRkJha0lzWTBGQll5eEhRVUZqT3p0QlFVVTVRaXhWUVVGSkxFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNwQ0xHRkJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNUMEZCVHl3NFFrRkJhMElzUTBGQlF6dFBRVU14UXpzN08wRkJSMFFzYVVKQlFWY3NRMEZCUXl4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF6dEJRVU16UXl4cFFrRkJWeXhEUVVGRExGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRPMEZCUXpORExHbENRVUZYTEVOQlFVTXNXVUZCV1N4SFFVRkhMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVY3ZReXh2UTBGQllTeERRVUZET3p0QlFVVmtMR2xDUVVGWExFTkJRVU1zYVVKQlFXbENMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM0pETEdsQ1FVRlhMRU5CUVVNc1YwRkJWeXhIUVVGSExFdEJRVXNzUTBGQlF6czdPenRCUVVsb1F5eFZRVUZKTEZkQlFWY3NRMEZCUXl4WlFVRlpMRVZCUVVVN1FVRkROVUlzV1VGQlNTeFZRVUZWTEVkQlFVY3NWMEZCVnl4RFFVRkRMRmxCUVZrc1EwRkJRenM3TzBGQlJ6RkRMRzFDUVVGWExFTkJRVU1zV1VGQldTeEhRVUZITEZOQlFWTXNRMEZCUXpzN08wRkJSM0pETEdsQ1FVRlRMRU5CUVVNc1QwRkJUeXhGUVVGRkxGVkJRVlVzUTBGQlF5eFBRVUZQTEVWQlFVVXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wOUJRelZFT3p0WFFVVkpPMEZCUTBnc2FVSkJRVThzUTBGQlF5eGhRVUZoTEVOQlFVTXNOa0pCUVdkQ0xHZENRVUZuUWl4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVNeFJEdExRVU5HTEVOQlFVTTdPenM3T3p0QlFVMUdMRkZCUVVrc1kwRkJZeXhIUVVGSExHbERRVUZsTEU5QlFVOHNSVUZCUlN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZET3pzN1FVRkhPVVFzVVVGQlNTeGpRVUZqTEVWQlFVVTdRVUZCUlN4dlFrRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0TFFVRkZMRTFCUTNaRU8wRkJRVVVzYjBKQlFXTXNSVUZCUlN4RFFVRkRPMHRCUVVVN1IwRkRNMElzUTBGQlF6dERRVU5JT3pzN096czdPenRCUVU5TkxGTkJRVk1zVjBGQlZ5eERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTnVReXhOUVVGSkxGZEJRVmNzUjBGQlJ5eG5Ra0ZCVlN4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZET3pzN1FVRkhMME1zVFVGQlNTeFhRVUZYTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNSQ0xHVkJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNN1IwRkRhRU03T3p0QlFVZEVMRTFCUVVrc1YwRkJWeXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU4yUWl4elEwRkJhVUlzVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNSRExHdERRVUZoTEVOQlFVTTdSMEZEWmpzN08wRkJSMFFzTWtKQlFXZENMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UTBGRE0wSTdPenM3T3pzN096dEJRVkZOTEZOQlFWTXNVMEZCVXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGT3p0QlFVVnVSQ3hOUVVGSkxFOUJRVThzVDBGQlR5eERRVUZETEZsQlFWa3NTMEZCU3l4VFFVRlRMRVZCUVVVN1FVRkROME1zVjBGQlR5eERRVUZETEZsQlFWa3NSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJZU3hEUVVGRE8wZEJReTlET3p0QlFVVkVMRTFCUVVrc1YwRkJWeXhIUVVGSExHZENRVUZWTEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03T3p0QlFVY3ZReXhyUWtGQlZTeEhRVUZITEVOQlFVTXNUMEZCVHl4RlFVRkZMRmRCUVZjc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4TlFVRkpMRmRCUVZjc1EwRkJReXhYUVVGWExFVkJRVVU3TzBGQlJUTkNMR1ZCUVZjc1EwRkJReXhaUVVGWkxFZEJRVWNzUlVGQlJTeFBRVUZQTEVWQlFWQXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJVQ3hQUVVGUExFVkJRVVVzUTBGQlF6dEJRVU5vUkN4WFFVRlBPMGRCUTFJN08wRkJSVVE3T3p0QlFVZEZMRk5CUVU4c1EwRkJReXhMUVVGTExFbEJRVWtzVDBGQlR5eERRVUZETEZOQlFWTXNTMEZCU3l4UFFVRlBPenM3TzBGQlNUbERMRWRCUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzU1VGQlNTeFBRVUZQTEVOQlFVTXNVMEZCVXl4TFFVRkxMRTlCUVU4c1JVRkRMME03UVVGQlJTeFhRVUZQTzBkQlFVVTdPMEZCUldJN096dEJRVWRGTEVGQlFVTXNVMEZCVHl4RFFVRkRMRXRCUVVzc1NVRkJTU3hYUVVGWExFTkJRVU1zVlVGQlZTeExRVUZMTEU5QlFVOHNRMEZCUXl4VFFVRlRPenM3TzBGQlNUZEVMRWRCUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzU1VGQlNTeFhRVUZYTEVOQlFVTXNWVUZCVlN4TFFVRkxMRTlCUVU4c1EwRkJReXhUUVVGVExFRkJRVU03T3p0QlFVY3ZSQ3hoUVVGWExFTkJRVU1zV1VGQldTeExRVUZMTEU5QlFVOHNRMEZCUXl4WFFVRlhMRUZCUVVNc1JVRkRiRVE3UVVGRFFTeFJRVUZKTEZkQlFWY3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRka0lzZDBOQlFXbENMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU4wUXl4dlEwRkJZU3hEUVVGRE8wdEJRMlk3TzBGQlJVUXNaVUZCVnl4RFFVRkRMRTlCUVU4c1IwRkJSeXgxUWtGQlV5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRPVU1zWlVGQlZ5eERRVUZETEdGQlFXRXNSMEZCUnl4SlFVRkpMRU5CUVVNN1IwRkRiRU03T3pzN1FVRkpSQ3hOUVVGSkxFOUJRVThzUTBGQlF5eFpRVUZaTERKQ1FVRmhMRVZCUVVVN08wRkJSWEpETEdWQlFWY3NRMEZCUXl4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRE96czdRVUZITDBJc1VVRkJTU3hOUVVGTkxFZEJRVWNzVjBGQlZ5eERRVUZETEUxQlFVMHNSMEZCUnl4WFFVRlhMRU5CUVVNc1RVRkJUU3hKUVVGSkxESkNRVUZqTEVOQlFVTTdPenRCUVVkMlJTeFJRVUZKTEdOQlFXTXNSMEZCUnl4RlFVRkZMRU5CUVVNN096czdRVUZKZUVJc1VVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eHBRa0ZCYVVJc1NVRkJTU3hYUVVGWExFTkJRVU1zWVVGQllTeEZRVUZGTzBGQlF5OUVMRzlDUVVGakxFTkJRVU1zVDBGQlR5eEhRVUZITEZkQlFWY3NRMEZCUXl4UFFVRlBMRU5CUVVNN1FVRkROME1zYVVKQlFWY3NRMEZCUXl4aFFVRmhMRWRCUVVjc1MwRkJTeXhEUVVGRE8wdEJRMjVET3pzN1FVRkhSQ3hyUWtGQll5eERRVUZETEVsQlFVa3NSMEZCUnl4WFFVRlhMRU5CUVVNc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF6czdRVUZGYkVRc1VVRkJTU3hQUVVGUExFOUJRVThzUzBGQlN5eFJRVUZSTEVWQlFVVTdRVUZETDBJc2IwSkJRV01zUTBGQlF5eFBRVUZQTEVkQlFVY3NkVUpCUVZNc1QwRkJUeXhEUVVGRExFTkJRVU03T3pzN1FVRkpNME1zV1VGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenM3TzBGQlIyNURMRmxCUVUwc1EwRkJReXhUUVVGVExFZEJRVWNzYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUTBGQlF5eERRVUZET3p0QlFVVTVSQ3hoUVVGUE8wdEJRMUk3T3pzN1FVRkpSQ3hyUWtGQll5eERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNN096dEJRVWRxUXl4clFrRkJZeXhEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRPenM3TzBGQlNYWkRMRlZCUVUwc1EwRkJReXhYUVVGWExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPenRCUVVkdVF5eFZRVUZOTEVOQlFVTXNVMEZCVXl4SFFVRkhMRzlDUVVGdlFpeERRVUZETEU5QlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRenRIUVVNdlJDeE5RVU5KT3pzN1FVRkZTQ3hwUWtGQlZ5eERRVUZETEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNN08wRkJSUzlDTEZWQlFVa3NUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOcVFpeFZRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN08wRkJSVzVDTEZWQlFVa3NUMEZCVHl4UFFVRlBMRXRCUVVzc1VVRkJVU3hGUVVGRk8wRkJReTlDTEdWQlFVOHNSMEZCUnl3eVFrRkJWU3hQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkJPMDlCUXpWRExFMUJRMGs3UVVGRFNDeGxRVUZQTEVkQlFVY3NkVUpCUVZNc1QwRkJUeXhEUVVGRExFTkJRVU03VDBGRE4wSTdPMEZCUlVRc1ZVRkJTU3hQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTzBGQlEycENMRmxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF6czdRVUZGZWtJc1pVRkJUeXhIUVVGSE8wRkJRMUlzYjBKQlFWVXNSVUZCVml4VlFVRlZPenRCUVVWV0xHOUNRVUZWTEVWQlFVVXNWMEZCVnl4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVk8wRkJRekZETEdsQ1FVRlBMRVZCUVVVc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTzBGQlEzQkRMR3RDUVVGUkxFVkJRVVVzVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4UlFVRlJPMEZCUTNSRExHMUNRVUZUTEVWQlFVVXNWMEZCVnl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVE8xTkJRM3BETEVOQlFVTTdUMEZEU0RzN1FVRkZSQ3hWUVVGSkxGZEJRVmNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRGNrUXNWVUZCU1N4WFFVRlhMRWRCUVVjc1QwRkJUeXhKUVVGSkxFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTTdPenRCUVVjNVF5eFZRVUZKTEZkQlFWY3NTMEZCU3l4WFFVRlhMRVZCUVVVN08wRkJSUzlDTERCQ1FVRlRMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVjBGQlZ5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRQUVVOMFJEczdWMEZGU1N4SlFVRkpMRTlCUVU4c1JVRkJSVHRCUVVOb1FpeHBRa0ZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ6dEJRVU40UWl4clFrRkJUU3hGUVVGRkxFTkJRVU03UVVGRFZDeGxRVUZITEVWQlFVVXNWMEZCVnl4RFFVRkRMRTlCUVU4N1FVRkRlRUlzYlVKQlFVc3NUMEZCVHp0WFFVTmlMRU5CUVVNN08wRkJSVVlzTkVOQlFXbENMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGZEVNc2NVSkJRVmNzUTBGQlF5eFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRPMU5CUXk5Q096dEJRVVZFTEZWQlFVa3NZMEZCWXl4SFFVRkhMRk5CUVdwQ0xHTkJRV01zUjBGQll6czdRVUZGT1VJc2JVSkJRVmNzUTBGQlF5eFhRVUZYTEVkQlFVY3NTMEZCU3l4RFFVRkRPenM3UVVGSGFFTXNiVUpCUVZjc1EwRkJReXhWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXp0QlFVTXpReXh0UWtGQlZ5eERRVUZETEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRek5ETEcxQ1FVRlhMRU5CUVVNc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdPMEZCUlM5RExITkRRVUZoTEVOQlFVTTdPenRCUVVka0xHVkJRVThzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPenM3UVVGSGJrSXNaVUZCVHl4RFFVRkRMR0ZCUVdFc1EwRkJReXcyUWtGQlowSXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF5eERRVUZET3pzN1FVRkhla1FzV1VGQlNTeFhRVUZYTEVOQlFVTXNXVUZCV1N4RlFVRkZPMEZCUXpWQ0xHTkJRVWtzVlVGQlZTeEhRVUZITEZkQlFWY3NRMEZCUXl4WlFVRlpMRU5CUVVNN1FVRkRNVU1zY1VKQlFWY3NRMEZCUXl4WlFVRlpMRWRCUVVjc1UwRkJVeXhEUVVGRE96czdRVUZIY2tNc2JVSkJRVk1zUTBGQlF5eFBRVUZQTEVWQlFVVXNWVUZCVlN4RFFVRkRMRTlCUVU4c1JVRkJSU3hWUVVGVkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdVMEZETlVRN1QwRkRSaXhEUVVGRE96czdPMEZCU1VZc1ZVRkJTU3hqUVVGakxFZEJRVWNzYVVOQlFXVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE96czdRVUZIZEVRc1ZVRkJTU3hqUVVGakxFVkJRVVU3UVVGQlJTeHpRa0ZCWXl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dFBRVUZGTEUxQlEzWkVPMEZCUVVVc2MwSkJRV01zUlVGQlJTeERRVUZETzA5QlFVVTdPMGRCUXpOQ08wTkJRMFlpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2Ym05a1pTOXdZWFJqYUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQkRkWE4wYjIxRmRtVnVkQ0JtY205dElDZGpkWE4wYjIwdFpYWmxiblFuTzF4dWFXMXdiM0owSUhzZ1kzSmxZWFJsSUdGeklHTnlaV0YwWlZkdmNtdGxjaXdnYUdGelYyOXlhMlZ5SUgwZ1puSnZiU0FuTGk0dmQyOXlhMlZ5TDJOeVpXRjBaU2M3WEc1cGJYQnZjblFnZXlCamJHVmhiazFsYlc5eWVTd2djSEp2ZEdWamRFVnNaVzFsYm5Rc0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5RZ2ZTQm1jbTl0SUNjdUxpOTFkR2xzTDIxbGJXOXllU2M3WEc1cGJYQnZjblFnZXlCd2IyOXNjeUI5SUdaeWIyMGdKeTR1TDNWMGFXd3ZjRzl2YkhNbk8xeHVhVzF3YjNKMElIc2djR0Z5YzJWSVZFMU1JSDBnWm5KdmJTQW5MaTR2ZFhScGJDOXdZWEp6WlhJbk8xeHVhVzF3YjNKMElIQnliMk5sYzNOUVlYUmphR1Z6SUdaeWIyMGdKeTR1TDNCaGRHTm9aWE12Y0hKdlkyVnpjeWM3WEc1cGJYQnZjblFnYldGclpVNXZaR1VnWm5KdmJTQW5MaTl0WVd0bEp6dGNibWx0Y0c5eWRDQnRZV3RsUld4bGJXVnVkQ0JtY205dElDY3VMaTlsYkdWdFpXNTBMMjFoYTJVbk8xeHVhVzF3YjNKMElITjVibU5PYjJSbElHWnliMjBnSnk0dmMzbHVZeWM3WEc1cGJYQnZjblFnZXlCVWNtVmxRMkZqYUdVZ2ZTQm1jbTl0SUNjdUwzUnlaV1VuTzF4dVhHNHZLaXBjYmlBcUlGZG9aVzRnZEdobElIZHZjbXRsY2lCamIyMXdiR1YwWlhNc0lHTnNaV0Z1SUhWd0lHMWxiVzl5ZVNCaGJtUWdjMk5vWldSMWJHVWdkR2hsSUc1bGVIUWdjbVZ1WkdWeUlHbG1YRzRnS2lCdVpXTmxjM05oY25rdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblJjYmlBcUlFQndZWEpoYlNCbGJHVnRaVzUwVFdWMFlWeHVJQ29nUUhKbGRIVnliaUI3Um5WdVkzUnBiMjU5WEc0Z0tpOWNibVoxYm1OMGFXOXVJR052YlhCc1pYUmxWMjl5YTJWeVVtVnVaR1Z5S0dWc1pXMWxiblFzSUdWc1pXMWxiblJOWlhSaEtTQjdYRzRnSUhKbGRIVnliaUJtZFc1amRHbHZiaWhsZGlrZ2UxeHVJQ0FnSUhaaGNpQnViMlJsY3lBOUlHVjJMbVJoZEdFdWJtOWtaWE03WEc1Y2JpQWdJQ0F2THlCQlpHUWdibVYzSUdWc1pXMWxiblJ6TGx4dUlDQWdJR2xtSUNodWIyUmxjeTVoWkdScGRHbHZibk11YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0J1YjJSbGN5NWhaR1JwZEdsdmJuTXViV0Z3S0hCeWIzUmxZM1JGYkdWdFpXNTBLUzV0WVhBb1pHVnpZM0pwY0hSdmNpQTlQaUI3WEc0Z0lDQWdJQ0FnSUM4dklFbHVhbVZqZENCcGJuUnZJSFJvWlNCZ2IyeGtWSEpsWldBZ2MyOGdhWFFuY3lCamJHVmhibVZrSUhWd0lHTnZjbkpsWTNSc2VTNWNiaUFnSUNBZ0lDQWdaV3hsYldWdWRFMWxkR0V1YjJ4a1ZISmxaUzVqYUdsc1pFNXZaR1Z6TG5CMWMyZ29aR1Z6WTNKcGNIUnZjaWs3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJrWlhOamNtbHdkRzl5TzF4dUlDQWdJQ0FnZlNrdVptOXlSV0ZqYUNodFlXdGxSV3hsYldWdWRDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JHVjBJR052YlhCc1pYUmxVbVZ1WkdWeUlEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0F2THlCU1pXMXZkbVVnZFc1MWMyVmtJR1ZzWlcxbGJuUnpMbHh1SUNBZ0lDQWdhV1lnS0c1dlpHVnpMbkpsYlc5MllXeHpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0J1YjJSbGN5NXlaVzF2ZG1Gc2N5NW1iM0pGWVdOb0tIVnVjSEp2ZEdWamRFVnNaVzFsYm5RcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJTWlhObGRDQnBiblJsY201aGJDQmpZV05vWlhNZ1ptOXlJSEYxYVdOclpYSWdiRzl2YTNWd2N5QnBiaUIwYUdVZ1puVjBkWEpsY3k1Y2JpQWdJQ0FnSUdWc1pXMWxiblJOWlhSaExsOXBibTVsY2toVVRVd2dQU0JsYkdWdFpXNTBMbWx1Ym1WeVNGUk5URHRjYmlBZ0lDQWdJR1ZzWlcxbGJuUk5aWFJoTGw5dmRYUmxja2hVVFV3Z1BTQmxiR1Z0Wlc1MExtOTFkR1Z5U0ZSTlREdGNiaUFnSUNBZ0lHVnNaVzFsYm5STlpYUmhMbDkwWlhoMFEyOXVkR1Z1ZENBOUlHVnNaVzFsYm5RdWRHVjRkRU52Ym5SbGJuUTdYRzVjYmlBZ0lDQWdJQzh2SUZKbFkzbGpiR1VnWVd4c0lIVnVjSEp2ZEdWamRHVmtJR0ZzYkc5allYUnBiMjV6TGx4dUlDQWdJQ0FnWTJ4bFlXNU5aVzF2Y25rb0tUdGNibHh1SUNBZ0lDQWdaV3hsYldWdWRFMWxkR0V1YUdGelYyOXlhMlZ5VW1WdVpHVnlaV1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdaV3hsYldWdWRFMWxkR0V1YVhOU1pXNWtaWEpwYm1jZ1BTQm1ZV3h6WlR0Y2JseHVJQ0FnSUNBZ0x5OGdWR2hwY3lCcGN5QmtaWE5wWjI1bFpDQjBieUJvWVc1a2JHVWdkWE5sSUdOaGMyVnpJSGRvWlhKbElISmxibVJsY25NZ1lYSmxJR0psYVc1bklHaGhiVzFsY21Wa1hHNGdJQ0FnSUNBdkx5QnZjaUIzYUdWdUlIUnlZVzV6YVhScGIyNXpJR0Z5WlNCMWMyVmtJSGRwZEdnZ1VISnZiV2x6WlhNdVhHNGdJQ0FnSUNCcFppQW9aV3hsYldWdWRFMWxkR0V1Y21WdVpHVnlRblZtWm1WeUtTQjdYRzRnSUNBZ0lDQWdJR3hsZENCdVpYaDBVbVZ1WkdWeUlEMGdaV3hsYldWdWRFMWxkR0V1Y21WdVpHVnlRblZtWm1WeU8xeHVYRzRnSUNBZ0lDQWdJQzh2SUZKbGMyVjBJSFJvWlNCaWRXWm1aWEl1WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblJOWlhSaExuSmxibVJsY2tKMVptWmxjaUE5SUhWdVpHVm1hVzVsWkR0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJPYjNScFkybHVaeUJ6YjIxbElIZGxhWEprSUhCbGNtWnZjbTFoYm1ObElHbHRjR3hwWTJGMGFXOXVjeUIzYVhSb0lIUm9hWE1nWTI5dVkyVndkQzVjYmlBZ0lDQWdJQ0FnY0dGMFkyaE9iMlJsS0dWc1pXMWxiblFzSUc1bGVIUlNaVzVrWlhJdWJtVjNTRlJOVEN3Z2JtVjRkRkpsYm1SbGNpNXZjSFJwYjI1ektUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJRVJwYzNCaGRHTm9JR0Z1SUdWMlpXNTBJRzl1SUhSb1pTQmxiR1Z0Wlc1MElHOXVZMlVnY21WdVpHVnlhVzVuSUdoaGN5QmpiMjF3YkdWMFpXUXVYRzRnSUNBZ0lDQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ1pXeGxiV1Z1ZEM1a2FYTndZWFJqYUVWMlpXNTBLRzVsZHlCRGRYTjBiMjFGZG1WdWRDZ25jbVZ1WkdWeVEyOXRjR3hsZEdVbktTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lDOHZJRmRoYVhRZ2RXNTBhV3dnWVd4c0lIQnliMjFwYzJWeklHaGhkbVVnY21WemIyeDJaV1FzSUdKbFptOXlaU0JtYVc1cGMyaHBibWNnZFhBZ2RHaGxJSEJoZEdOb1hHNGdJQ0FnTHk4Z1kzbGpiR1V1WEc0Z0lDQWdMeThnVUhKdlkyVnpjeUIwYUdVZ1pHRjBZU0JwYlcxbFpHbGhkR1ZzZVNCaGJtUWdkMkZwZENCMWJuUnBiQ0JoYkd3Z2RISmhibk5wZEdsdmJpQmpZV3hzWW1GamEzTmNiaUFnSUNBdkx5Qm9ZWFpsSUdOdmJYQnNaWFJsWkM1Y2JpQWdJQ0JzWlhRZ2NISnZZMlZ6YzFCeWIyMXBjMlVnUFNCd2NtOWpaWE56VUdGMFkyaGxjeWhsYkdWdFpXNTBMQ0JsZGk1a1lYUmhMbkJoZEdOb1pYTXBPMXh1WEc0Z0lDQWdMeThnVDNCbGNtRjBaU0J6ZVc1amFISnZibTkxYzJ4NUlIVnViR1Z6Y3lCdmNIUmxaQ0JwYm5SdklHRWdVSEp2YldselpTMWphR0ZwYmk1Y2JpQWdJQ0JwWmlBb2NISnZZMlZ6YzFCeWIyMXBjMlVwSUhzZ2NISnZZMlZ6YzFCeWIyMXBjMlV1ZEdobGJpaGpiMjF3YkdWMFpWSmxibVJsY2lrN0lIMWNiaUFnSUNCbGJITmxJSHNnWTI5dGNHeGxkR1ZTWlc1a1pYSW9LVHNnZlZ4dUlDQjlPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlGSmxiR1ZoYzJVbmN5QjBhR1VnWVd4c2IyTmhkR1ZrSUc5aWFtVmpkSE1nWVc1a0lISmxZM2xqYkdWeklHbHVkR1Z5Ym1Gc0lHMWxiVzl5ZVM1Y2JpQXFYRzRnS2lCQWNHRnlZVzBnWld4bGJXVnVkRnh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2NtVnNaV0Z6WlU1dlpHVW9aV3hsYldWdWRDa2dlMXh1SUNCc1pYUWdaV3hsYldWdWRFMWxkR0VnUFNCVWNtVmxRMkZqYUdVdVoyVjBLR1ZzWlcxbGJuUXBJSHg4SUh0OU8xeHVYRzRnSUM4dklFbG1JSFJvWlhKbElHbHpJR0VnZDI5eWEyVnlJR0Z6YzI5amFXRjBaV1FnZDJsMGFDQjBhR2x6SUdWc1pXMWxiblFzSUhSb1pXNGdhMmxzYkNCcGRDNWNiaUFnYVdZZ0tHVnNaVzFsYm5STlpYUmhMbmR2Y210bGNpa2dlMXh1SUNBZ0lHVnNaVzFsYm5STlpYUmhMbmR2Y210bGNpNTBaWEp0YVc1aGRHVW9LVHRjYmlBZ2ZWeHVYRzRnSUM4dklFbG1JSFJvWlhKbElIZGhjeUJoSUhSeVpXVWdjMlYwSUhWd0xDQnlaV041WTJ4bElIUm9aU0J0WlcxdmNua2dZV3hzYjJOaGRHVmtJR1p2Y2lCcGRDNWNiaUFnYVdZZ0tHVnNaVzFsYm5STlpYUmhMbTlzWkZSeVpXVXBJSHRjYmlBZ0lDQjFibkJ5YjNSbFkzUkZiR1Z0Wlc1MEtHVnNaVzFsYm5STlpYUmhMbTlzWkZSeVpXVXBPMXh1SUNBZ0lHTnNaV0Z1VFdWdGIzSjVLQ2s3WEc0Z0lIMWNibHh1SUNBdkx5QlNaVzF2ZG1VZ2RHaHBjeUJsYkdWdFpXNTBKM01nYldWMFlTQnZZbXBsWTNRZ1puSnZiU0IwYUdVZ1kyRmphR1V1WEc0Z0lGUnlaV1ZEWVdOb1pTNWtaV3hsZEdVb1pXeGxiV1Z1ZENrN1hHNTlYRzVjYmk4cUtseHVJQ29nVUdGMFkyaGxjeUJoYmlCbGJHVnRaVzUwSjNNZ1JFOU5JSFJ2SUcxaGRHTm9JSFJvWVhRZ2IyWWdkR2hsSUhCaGMzTmxaQ0J0WVhKcmRYQXVYRzRnS2x4dUlDb2dRSEJoY21GdElHVnNaVzFsYm5SY2JpQXFJRUJ3WVhKaGJTQnVaWGRJVkUxTVhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ3WVhSamFFNXZaR1VvWld4bGJXVnVkQ3dnYm1WM1NGUk5UQ3dnYjNCMGFXOXVjeWtnZTF4dUlDQXZMeUJGYm5OMWNtVWdkR2hoZENCMGFHVWdaRzlqZFcxbGJuUWdaR2x6WVdKc1pTQjNiM0pyWlhJZ2FYTWdZV3gzWVhseklIQnBZMnRsWkNCMWNDNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCdmNIUnBiMjV6TG1WdVlXSnNaVmR2Y210bGNpQWhQVDBnSjJKdmIyeGxZVzRuS1NCN1hHNGdJQ0FnYjNCMGFXOXVjeTVsYm1GaWJHVlhiM0pyWlhJZ1BTQmtiMk4xYldWdWRDNUZUa0ZDVEVWZlYwOVNTMFZTTzF4dUlDQjlYRzVjYmlBZ2JHVjBJR1ZzWlcxbGJuUk5aWFJoSUQwZ1ZISmxaVU5oWTJobExtZGxkQ2hsYkdWdFpXNTBLU0I4ZkNCN2ZUdGNibHh1SUNBdkx5QkJiSGRoZVhNZ1pXNXpkWEpsSUhSb1pTQnRiM04wSUhWd0xYUnZMV1JoZEdVZ2JXVjBZU0J2WW1wbFkzUWdhWE1nYzNSdmNtVmtMbHh1SUNCVWNtVmxRMkZqYUdVdWMyVjBLR1ZzWlcxbGJuUXNJR1ZzWlcxbGJuUk5aWFJoS1R0Y2JseHVJQ0JwWmlBb1pXeGxiV1Z1ZEUxbGRHRXVhWE5TWlc1a1pYSnBibWNwSUh0Y2JpQWdJQ0F2THlCQlpHUWdkR2hwY3lCdVpYY2djbVZ1WkdWeUlHbHVkRzhnZEdobElHSjFabVpsY2lCeGRXVjFaUzVjYmlBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzV5Wlc1a1pYSkNkV1ptWlhJZ1BTQjdJRzVsZDBoVVRVd3NJRzl3ZEdsdmJuTWdmVHRjYmlBZ0lDQnlaWFIxY200N1hHNGdJSDFjYmx4dUlDQnBaaUFvWEc0Z0lDQWdMeThnU1dZZ2RHaGxJRzl3WlhKaGRHbHZiaUJwY3lCZ2FXNXVaWEpJVkUxTVlDd2dZblYwSUhSb1pTQmpiMjUwWlc1MGN5Qm9ZWFpsYmlkMElHTm9ZVzVuWldRc1hHNGdJQ0FnTHk4Z1lXSnZjblF1WEc0Z0lDQWdiM0IwYVc5dWN5NXBibTVsY2lBbUppQmxiR1Z0Wlc1MExtbHVibVZ5U0ZSTlRDQTlQVDBnYm1WM1NGUk5UQ0I4ZkZ4dVhHNGdJQ0FnTHk4Z1NXWWdkR2hsSUc5d1pYSmhkR2x2YmlCcGN5QmdiM1YwWlhKSVZFMU1ZQ3dnWW5WMElIUm9aU0JqYjI1MFpXNTBjeUJvWVhabGJpZDBJR05vWVc1blpXUXNYRzRnSUNBZ0x5OGdZV0p2Y25RdVhHNGdJQ0FnSVc5d2RHbHZibk11YVc1dVpYSWdKaVlnWld4bGJXVnVkQzV2ZFhSbGNraFVUVXdnUFQwOUlHNWxkMGhVVFV4Y2JpQWdLU0I3SUhKbGRIVnlianNnZlZ4dVhHNGdJR2xtSUNoY2JpQWdJQ0F2THlCSlppQjBhR1VnYjNCbGNtRjBhVzl1SUdseklHQnBibTVsY2toVVRVeGdMQ0JoYm1RZ2RHaGxJR04xY25KbGJuUWdaV3hsYldWdWRDZHpJR052Ym5SbGJuUnpJR2hoZG1WY2JpQWdJQ0F2THlCamFHRnVaMlZrSUhOcGJtTmxJSFJvWlNCc1lYTjBJSEpsYm1SbGNpQnNiMjl3TENCeVpXTmhiR04xYkdGMFpTQjBhR1VnZEhKbFpTNWNiaUFnSUNBb2IzQjBhVzl1Y3k1cGJtNWxjaUFtSmlCbGJHVnRaVzUwVFdWMFlTNWZhVzV1WlhKSVZFMU1JQ0U5UFNCbGJHVnRaVzUwTG1sdWJtVnlTRlJOVENrZ2ZIeGNibHh1SUNBZ0lDOHZJRWxtSUhSb1pTQnZjR1Z5WVhScGIyNGdhWE1nWUc5MWRHVnlTRlJOVEdBc0lHRnVaQ0IwYUdVZ1kzVnljbVZ1ZENCbGJHVnRaVzUwSjNNZ1kyOXVkR1Z1ZEhNZ2FHRjJaVnh1SUNBZ0lDOHZJR05vWVc1blpXUWdjMmx1WTJVZ2RHaGxJR3hoYzNRZ2NtVnVaR1Z5SUd4dmIzQXNJSEpsWTJGc1kzVnNZWFJsSUhSb1pTQjBjbVZsTGx4dUlDQWdJQ2doYjNCMGFXOXVjeTVwYm01bGNpQW1KaUJsYkdWdFpXNTBUV1YwWVM1ZmIzVjBaWEpJVkUxTUlDRTlQU0JsYkdWdFpXNTBMbTkxZEdWeVNGUk5UQ2tnZkh4Y2JseHVJQ0FnSUM4dklFbG1JSFJvWlNCMFpYaDBJR052Ym5SbGJuUWdaWFpsY2lCamFHRnVaMlZ6TENCeVpXTmhiR04xYkdGMFpTQjBhR1VnZEhKbFpTNWNiaUFnSUNBb1pXeGxiV1Z1ZEUxbGRHRXVYM1JsZUhSRGIyNTBaVzUwSUNFOVBTQmxiR1Z0Wlc1MExuUmxlSFJEYjI1MFpXNTBLVnh1SUNBcElIdGNiaUFnSUNCcFppQW9aV3hsYldWdWRFMWxkR0V1YjJ4a1ZISmxaU2tnZTF4dUlDQWdJQ0FnZFc1d2NtOTBaV04wUld4bGJXVnVkQ2hsYkdWdFpXNTBUV1YwWVM1dmJHUlVjbVZsS1R0Y2JpQWdJQ0FnSUdOc1pXRnVUV1Z0YjNKNUtDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTQTlJRzFoYTJWT2IyUmxLR1ZzWlcxbGJuUXNJSFJ5ZFdVcE8xeHVJQ0FnSUdWc1pXMWxiblJOWlhSaExuVndaR0YwWlU5c1pGUnlaV1VnUFNCMGNuVmxPMXh1SUNCOVhHNWNiaUFnTHk4Z1YybHNiQ0IzWVc1MElIUnZJR1Z1YzNWeVpTQjBhR0YwSUhSb1pTQm1hWEp6ZENCeVpXNWtaWElnZDJWdWRDQjBhSEp2ZFdkb0xDQjBhR1VnZDI5eWEyVnlJR05oYmx4dUlDQXZMeUIwWVd0bElHRWdZbWwwSUhSdklITjBZWEowZFhBZ1lXNWtJSGRsSUhkaGJuUWdkRzhnYzJodmR5QmphR0Z1WjJWeklHRnpJSE52YjI0Z1lYTWdjRzl6YzJsaWJHVXVYRzRnSUdsbUlDaHZjSFJwYjI1ekxtVnVZV0pzWlZkdmNtdGxjaUFtSmlCb1lYTlhiM0pyWlhJcElIdGNiaUFnSUNBdkx5QlRaWFFnWVNCeVpXNWtaWElnYkc5amF5QmhjeUIwYnlCdWIzUWdabXh2YjJRZ2RHaGxJSGR2Y210bGNpNWNiaUFnSUNCbGJHVnRaVzUwVFdWMFlTNXBjMUpsYm1SbGNtbHVaeUE5SUhSeWRXVTdYRzVjYmlBZ0lDQXZMeUJEY21WaGRHVWdZU0IzYjNKclpYSWdabTl5SUhSb2FYTWdaV3hsYldWdWRDNWNiaUFnSUNCc1pYUWdkMjl5YTJWeUlEMGdaV3hsYldWdWRFMWxkR0V1ZDI5eWEyVnlJRDBnWld4bGJXVnVkRTFsZEdFdWQyOXlhMlZ5SUh4OElHTnlaV0YwWlZkdmNtdGxjaWdwTzF4dVhHNGdJQ0FnTHk4Z1FYUjBZV05vSUdGc2JDQndjbTl3WlhKMGFXVnpJR2hsY21VZ2RHOGdkSEpoYm5Od2IzSjBMbHh1SUNBZ0lHeGxkQ0IwY21GdWMyWmxjazlpYW1WamRDQTlJSHQ5TzF4dVhHNGdJQ0FnTHk4Z1ZHaHBjeUJ6YUc5MWJHUWdiMjVzZVNCdlkyTjFjaUJ2Ym1ObExDQnZjaUIzYUdWdVpYWmxjaUIwYUdVZ2JXRnlhM1Z3SUdOb1lXNW5aWE1nWlhoMFpYSnVZV3hzZVZ4dUlDQWdJQzh2SUhSdklHUnBabVpJVkUxTUxseHVJQ0FnSUdsbUlDZ2haV3hsYldWdWRFMWxkR0V1YUdGelYyOXlhMlZ5VW1WdVpHVnlaV1FnZkh3Z1pXeGxiV1Z1ZEUxbGRHRXVkWEJrWVhSbFQyeGtWSEpsWlNrZ2UxeHVJQ0FnSUNBZ2RISmhibk5tWlhKUFltcGxZM1F1YjJ4a1ZISmxaU0E5SUdWc1pXMWxiblJOWlhSaExtOXNaRlJ5WldVN1hHNGdJQ0FnSUNCbGJHVnRaVzUwVFdWMFlTNTFjR1JoZEdWUGJHUlVjbVZsSUQwZ1ptRnNjMlU3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnUVhSMFlXTm9JSFJvWlNCd1lYSmxiblFnWld4bGJXVnVkQ2R6SUhWMWFXUXVYRzRnSUNBZ2RISmhibk5tWlhKUFltcGxZM1F1ZFhWcFpDQTlJR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1V1Wld4bGJXVnVkRHRjYmx4dUlDQWdJR2xtSUNoMGVYQmxiMllnYm1WM1NGUk5UQ0FoUFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lIUnlZVzV6Wm1WeVQySnFaV04wTG01bGQxUnlaV1VnUFNCdFlXdGxUbTlrWlNodVpYZElWRTFNS1R0Y2JseHVJQ0FnSUNBZ0x5OGdWSEpoYm5ObVpYSWdkR2hwY3lCaWRXWm1aWElnZEc4Z2RHaGxJSGR2Y210bGNpd2dkMmhwWTJnZ2QybHNiQ0IwWVd0bElHOTJaWElnWVc1a0lIQnliMk5sYzNNZ2RHaGxYRzRnSUNBZ0lDQXZMeUJ0WVhKcmRYQXVYRzRnSUNBZ0lDQjNiM0pyWlhJdWNHOXpkRTFsYzNOaFoyVW9kSEpoYm5ObVpYSlBZbXBsWTNRcE8xeHVYRzRnSUNBZ0lDQXZMeUJYWVdsMElHWnZjaUIwYUdVZ2QyOXlhMlZ5SUhSdklHWnBibWx6YUNCd2NtOWpaWE56YVc1bklHRnVaQ0IwYUdWdUlHRndjR3g1SUhSb1pTQndZWFJqYUhObGRDNWNiaUFnSUNBZ0lIZHZjbXRsY2k1dmJtMWxjM05oWjJVZ1BTQmpiMjF3YkdWMFpWZHZjbXRsY2xKbGJtUmxjaWhsYkdWdFpXNTBMQ0JsYkdWdFpXNTBUV1YwWVNrN1hHNWNiaUFnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCTVpYUWdkR2hsSUdKeWIzZHpaWElnWTI5d2VTQjBhR1VnU0ZSTlRDQnBiblJ2SUhSb1pTQjNiM0pyWlhJc0lHTnZiblpsY25ScGJtY2dkRzhnWVZ4dUlDQWdJQzh2SUhSeVlXNXpabVZ5WVdKc1pTQnZZbXBsWTNRZ2FYTWdkRzl2SUdWNGNHVnVjMmwyWlM1Y2JpQWdJQ0IwY21GdWMyWmxjazlpYW1WamRDNXVaWGRJVkUxTUlEMGdibVYzU0ZSTlREdGNibHh1SUNBZ0lDOHZJRUZrWkNCd2NtOXdaWEowYVdWeklIUnZJSE5sYm1RZ2RHOGdkMjl5YTJWeUxseHVJQ0FnSUhSeVlXNXpabVZ5VDJKcVpXTjBMbWx6U1c1dVpYSWdQU0J2Y0hScGIyNXpMbWx1Ym1WeU8xeHVYRzRnSUNBZ0x5OGdWSEpoYm5ObVpYSWdkR2hwY3lCaWRXWm1aWElnZEc4Z2RHaGxJSGR2Y210bGNpd2dkMmhwWTJnZ2QybHNiQ0IwWVd0bElHOTJaWElnWVc1a0lIQnliMk5sYzNNZ2RHaGxYRzRnSUNBZ0x5OGdiV0Z5YTNWd0xseHVJQ0FnSUhkdmNtdGxjaTV3YjNOMFRXVnpjMkZuWlNoMGNtRnVjMlpsY2s5aWFtVmpkQ2s3WEc1Y2JpQWdJQ0F2THlCWFlXbDBJR1p2Y2lCMGFHVWdkMjl5YTJWeUlIUnZJR1pwYm1semFDQndjbTlqWlhOemFXNW5JR0Z1WkNCMGFHVnVJR0Z3Y0d4NUlIUm9aU0J3WVhSamFITmxkQzVjYmlBZ0lDQjNiM0pyWlhJdWIyNXRaWE56WVdkbElEMGdZMjl0Y0d4bGRHVlhiM0pyWlhKU1pXNWtaWElvWld4bGJXVnVkQ3dnWld4bGJXVnVkRTFsZEdFcE8xeHVJQ0I5WEc0Z0lHVnNjMlVnZTF4dUlDQWdJQzh2SUZkbEozSmxJSEpsYm1SbGNtbHVaeUJwYmlCMGFHVWdWVWtnZEdoeVpXRmtMbHh1SUNBZ0lHVnNaVzFsYm5STlpYUmhMbWx6VW1WdVpHVnlhVzVuSUQwZ2RISjFaVHRjYmx4dUlDQWdJR3hsZENCd1lYUmphR1Z6SUQwZ1cxMDdYRzRnSUNBZ2JHVjBJRzVsZDFSeVpXVWdQU0J1ZFd4c08xeHVYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQnVaWGRJVkUxTUlEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnYm1WM1ZISmxaU0E5SUhCaGNuTmxTRlJOVENodVpYZElWRTFNTENCdmNIUnBiMjV6TG1sdWJtVnlLVnh1SUNBZ0lIMWNiaUFnSUNCbGJITmxJSHRjYmlBZ0lDQWdJRzVsZDFSeVpXVWdQU0J0WVd0bFRtOWtaU2h1WlhkSVZFMU1LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvYjNCMGFXOXVjeTVwYm01bGNpa2dlMXh1SUNBZ0lDQWdiR1YwSUdOb2FXeGtUbTlrWlhNZ1BTQnVaWGRVY21WbE8xeHVYRzRnSUNBZ0lDQnVaWGRVY21WbElEMGdlMXh1SUNBZ0lDQWdJQ0JqYUdsc1pFNXZaR1Z6TEZ4dVhHNGdJQ0FnSUNBZ0lHRjBkSEpwWW5WMFpYTTZJR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1V1WVhSMGNtbGlkWFJsY3l4Y2JpQWdJQ0FnSUNBZ1pXeGxiV1Z1ZERvZ1pXeGxiV1Z1ZEUxbGRHRXViMnhrVkhKbFpTNWxiR1Z0Wlc1MExGeHVJQ0FnSUNBZ0lDQnViMlJsVG1GdFpUb2daV3hsYldWdWRFMWxkR0V1YjJ4a1ZISmxaUzV1YjJSbFRtRnRaU3hjYmlBZ0lDQWdJQ0FnYm05a1pWWmhiSFZsT2lCbGJHVnRaVzUwVFdWMFlTNXZiR1JVY21WbExtNXZaR1ZXWVd4MVpWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNWNiaUFnSUNCc1pYUWdiMnhrVkhKbFpVNWhiV1VnUFNCbGJHVnRaVzUwVFdWMFlTNXZiR1JVY21WbExtNXZaR1ZPWVcxbElIeDhJQ2NuTzF4dUlDQWdJR3hsZENCdVpYZE9iMlJsVG1GdFpTQTlJRzVsZDFSeVpXVWdKaVlnYm1WM1ZISmxaUzV1YjJSbFRtRnRaVHRjYmx4dUlDQWdJQzh2SUVsbUlIUm9aU0JsYkdWdFpXNTBJRzV2WkdVZ2RIbHdaWE1nYldGMFkyZ3NJSFJ5ZVNCaGJtUWdZMjl0Y0dGeVpTQjBhR1Z0TGx4dUlDQWdJR2xtSUNodmJHUlVjbVZsVG1GdFpTQTlQVDBnYm1WM1RtOWtaVTVoYldVcElIdGNiaUFnSUNBZ0lDOHZJRk41Ym1Ob2NtOXVhWHBsSUhSb1pTQjBjbVZsTGx4dUlDQWdJQ0FnYzNsdVkwNXZaR1V1WTJGc2JDaHdZWFJqYUdWekxDQmxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxMQ0J1WlhkVWNtVmxLVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdUM1JvWlhKM2FYTmxJSEpsY0d4aFkyVWdkR2hsSUhSdmNDQnNaWFpsYkNCbGJHVnRaVzUwY3k1Y2JpQWdJQ0JsYkhObElHbG1JQ2h1WlhkSVZFMU1LU0I3WEc0Z0lDQWdJQ0J3WVhSamFHVnpXM0JoZEdOb1pYTXViR1Z1WjNSb1hTQTlJSHRjYmlBZ0lDQWdJQ0FnWDE5a2IxOWZPaUF3TEZ4dUlDQWdJQ0FnSUNCdmJHUTZJR1ZzWlcxbGJuUk5aWFJoTG05c1pGUnlaV1VzWEc0Z0lDQWdJQ0FnSUc1bGR6b2dibVYzVkhKbFpWeHVJQ0FnSUNBZ2ZUdGNibHh1SUNBZ0lDQWdkVzV3Y205MFpXTjBSV3hsYldWdWRDaGxiR1Z0Wlc1MFRXVjBZUzV2YkdSVWNtVmxLVHRjYmx4dUlDQWdJQ0FnWld4bGJXVnVkRTFsZEdFdWIyeGtWSEpsWlNBOUlHNWxkMVJ5WldVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYkdWMElHTnZiWEJzWlhSbFVtVnVaR1Z5SUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQXZMeUJOWVhKcklIUm9ZWFFnZEdocGN5QmxiR1Z0Wlc1MElHaGhjeUJwYm1sMGFXRnNiSGtnY21WdVpHVnlaV1FnWVc1a0lHbHpJR1J2Ym1VZ2NtVnVaR1Z5YVc1bkxseHVJQ0FnSUNBZ1pXeGxiV1Z1ZEUxbGRHRXVhWE5TWlc1a1pYSnBibWNnUFNCbVlXeHpaVHRjYmx4dUlDQWdJQ0FnTHk4Z1UyVjBJSFJvWlNCcGJtNWxja2hVVFV3dVhHNGdJQ0FnSUNCbGJHVnRaVzUwVFdWMFlTNWZhVzV1WlhKSVZFMU1JRDBnWld4bGJXVnVkQzVwYm01bGNraFVUVXc3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBUV1YwWVM1ZmIzVjBaWEpJVkUxTUlEMGdaV3hsYldWdWRDNXZkWFJsY2toVVRVdzdYRzRnSUNBZ0lDQmxiR1Z0Wlc1MFRXVjBZUzVmZEdWNGRFTnZiblJsYm5RZ1BTQmxiR1Z0Wlc1MExuUmxlSFJEYjI1MFpXNTBPMXh1WEc0Z0lDQWdJQ0JqYkdWaGJrMWxiVzl5ZVNncE8xeHVYRzRnSUNBZ0lDQXZMeUJEYkdWaGJpQnZkWFFnZEdobElIQmhkR05vWlhNZ1lYSnlZWGt1WEc0Z0lDQWdJQ0J3WVhSamFHVnpMbXhsYm1kMGFDQTlJREE3WEc1Y2JpQWdJQ0FnSUM4dklFUnBjM0JoZEdOb0lHRnVJR1YyWlc1MElHOXVJSFJvWlNCbGJHVnRaVzUwSUc5dVkyVWdjbVZ1WkdWeWFXNW5JR2hoY3lCamIyMXdiR1YwWldRdVhHNGdJQ0FnSUNCbGJHVnRaVzUwTG1ScGMzQmhkR05vUlhabGJuUW9ibVYzSUVOMWMzUnZiVVYyWlc1MEtDZHlaVzVrWlhKRGIyMXdiR1YwWlNjcEtUdGNibHh1SUNBZ0lDQWdMeThnVkU5RVR5QlZjR1JoZEdVZ2RHaHBjeUJqYjIxdFpXNTBJR0Z1WkM5dmNpQnlaV1poWTNSdmNpQjBieUIxYzJVZ2RHaGxJSE5oYldVZ1lYTWdkR2hsSUZkdmNtdGxjaTVjYmlBZ0lDQWdJR2xtSUNobGJHVnRaVzUwVFdWMFlTNXlaVzVrWlhKQ2RXWm1aWElwSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJRzVsZUhSU1pXNWtaWElnUFNCbGJHVnRaVzUwVFdWMFlTNXlaVzVrWlhKQ2RXWm1aWEk3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblJOWlhSaExuSmxibVJsY2tKMVptWmxjaUE5SUhWdVpHVm1hVzVsWkR0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJPYjNScFkybHVaeUJ6YjIxbElIZGxhWEprSUhCbGNtWnZjbTFoYm1ObElHbHRjR3hwWTJGMGFXOXVjeUIzYVhSb0lIUm9hWE1nWTI5dVkyVndkQzVjYmlBZ0lDQWdJQ0FnY0dGMFkyaE9iMlJsS0dWc1pXMWxiblFzSUc1bGVIUlNaVzVrWlhJdWJtVjNTRlJOVEN3Z2JtVjRkRkpsYm1SbGNpNXZjSFJwYjI1ektUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOU8xeHVYRzRnSUNBZ0x5OGdVSEp2WTJWemN5QjBhR1VnWkdGMFlTQnBiVzFsWkdsaGRHVnNlU0JoYm1RZ2QyRnBkQ0IxYm5ScGJDQmhiR3dnZEhKaGJuTnBkR2x2YmlCallXeHNZbUZqYTNOY2JpQWdJQ0F2THlCb1lYWmxJR052YlhCc1pYUmxaQzVjYmlBZ0lDQnNaWFFnY0hKdlkyVnpjMUJ5YjIxcGMyVWdQU0J3Y205alpYTnpVR0YwWTJobGN5aGxiR1Z0Wlc1MExDQndZWFJqYUdWektUdGNibHh1SUNBZ0lDOHZJRTl3WlhKaGRHVWdjM2x1WTJoeWIyNXZkWE5zZVNCMWJteGxjM01nYjNCMFpXUWdhVzUwYnlCaElGQnliMjFwYzJVdFkyaGhhVzR1WEc0Z0lDQWdhV1lnS0hCeWIyTmxjM05RY205dGFYTmxLU0I3SUhCeWIyTmxjM05RY205dGFYTmxMblJvWlc0b1kyOXRjR3hsZEdWU1pXNWtaWElwT3lCOVhHNGdJQ0FnWld4elpTQjdJR052YlhCc1pYUmxVbVZ1WkdWeUtDazdJSDFjYmlBZ2ZWeHVmVnh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzeW5jO1xuXG52YXIgX3V0aWxQb29scyA9IHJlcXVpcmUoJy4uL3V0aWwvcG9vbHMnKTtcblxudmFyIF91dGlsTWVtb3J5ID0gcmVxdWlyZSgnLi4vdXRpbC9tZW1vcnknKTtcblxudmFyIHBvb2xzID0gX3V0aWxQb29scy5wb29scztcbnZhciBwcm90ZWN0RWxlbWVudCA9IF91dGlsTWVtb3J5LnByb3RlY3RFbGVtZW50O1xudmFyIHVucHJvdGVjdEVsZW1lbnQgPSBfdXRpbE1lbW9yeS51bnByb3RlY3RFbGVtZW50O1xuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8qKlxuICogU3luY2hyb25pemVzIGNoYW5nZXMgZnJvbSB0aGUgbmV3VHJlZSBpbnRvIHRoZSBvbGRUcmVlLlxuICpcbiAqIEBwYXJhbSBvbGRUcmVlXG4gKiBAcGFyYW0gbmV3VHJlZVxuICovXG5cbmZ1bmN0aW9uIHN5bmMob2xkVHJlZSwgbmV3VHJlZSkge1xuICB2YXIgcGF0Y2hlcyA9IHRoaXM7XG4gIHZhciBvbGRDaGlsZE5vZGVzID0gb2xkVHJlZS5jaGlsZE5vZGVzO1xuICB2YXIgb2xkQ2hpbGROb2Rlc0xlbmd0aCA9IG9sZENoaWxkTm9kZXMgPyBvbGRDaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG4gIHZhciBvbGRFbGVtZW50ID0gb2xkVHJlZS5lbGVtZW50O1xuICB2YXIgdGV4dEVsZW1lbnRzID0gWydzY3JpcHQnLCAnc3R5bGUnLCAndGV4dGFyZWEnLCAnI3RleHQnXTtcblxuICBpZiAoIW5ld1RyZWUpIHtcbiAgICB2YXIgcmVtb3ZlZCA9IG9sZENoaWxkTm9kZXMuc3BsaWNlKDAsIG9sZENoaWxkTm9kZXNMZW5ndGgpO1xuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogLTEsIGVsZW1lbnQ6IG9sZEVsZW1lbnQgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3ZlZC5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gVXNlZCBieSB0aGUgV29ya2VyIHRvIHRyYWNrIGVsZW1lbnRzIHJlbW92ZWQuXG4gICAgICBpZiAocGF0Y2hlcy5yZW1vdmFscykge1xuICAgICAgICBwYXRjaGVzLnJlbW92YWxzLnB1c2gocmVtb3ZlZFtpXSk7XG4gICAgICB9XG5cbiAgICAgIHVucHJvdGVjdEVsZW1lbnQocmVtb3ZlZFtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5vZGVWYWx1ZSA9IG5ld1RyZWUubm9kZVZhbHVlO1xuICB2YXIgY2hpbGROb2RlcyA9IG5ld1RyZWUuY2hpbGROb2RlcztcbiAgdmFyIGNoaWxkTm9kZXNMZW5ndGggPSBjaGlsZE5vZGVzID8gY2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuICB2YXIgbmV3RWxlbWVudCA9IG5ld1RyZWUuZWxlbWVudDtcblxuICAvLyBJZiB0aGUgZWxlbWVudCB3ZSdyZSByZXBsYWNpbmcgaXMgdG90YWxseSBkaWZmZXJlbnQgZnJvbSB0aGUgcHJldmlvdXNcbiAgLy8gcmVwbGFjZSB0aGUgZW50aXJlIGVsZW1lbnQsIGRvbid0IGJvdGhlciBpbnZlc3RpZ2F0aW5nIGNoaWxkcmVuLlxuICBpZiAob2xkVHJlZS5ub2RlTmFtZSAhPT0gbmV3VHJlZS5ub2RlTmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJlcGxhY2UgdGV4dCBub2RlIHZhbHVlcyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQuXG4gIGlmICh0ZXh0RWxlbWVudHMuaW5kZXhPZihuZXdUcmVlLm5vZGVOYW1lKSA+IC0xKSB7XG4gICAgLy8gVGV4dCBjaGFuZ2VkLlxuICAgIGlmIChvbGRUcmVlLm5vZGVWYWx1ZSAhPT0gbm9kZVZhbHVlKSB7XG4gICAgICBvbGRUcmVlLm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcblxuICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7XG4gICAgICAgIF9fZG9fXzogMyxcbiAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgdmFsdWU6IG5vZGVWYWx1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBNb3N0IGNvbW1vbiBhZGRpdGl2ZSBlbGVtZW50cy5cbiAgaWYgKGNoaWxkTm9kZXNMZW5ndGggPiBvbGRDaGlsZE5vZGVzTGVuZ3RoKSB7XG4gICAgLy8gU3RvcmUgZWxlbWVudHMgaW4gYSBEb2N1bWVudEZyYWdtZW50IHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGFuZCBiZVxuICAgIC8vIGdlbmVyYWxseSBzaW1wbGllciB0byB3b3JrIHdpdGguXG4gICAgdmFyIGZyYWdtZW50ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gb2xkQ2hpbGROb2Rlc0xlbmd0aDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgICAgLy8gVXNlZCBieSB0aGUgV29ya2VyIHRvIHRyYWNrIGVsZW1lbnRzIGFkZGVkLlxuICAgICAgaWYgKHBhdGNoZXMuYWRkaXRpb25zKSB7XG4gICAgICAgIHBhdGNoZXMuYWRkaXRpb25zLnB1c2goY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHByb3RlY3RFbGVtZW50KGNoaWxkTm9kZXNbaV0pO1xuXG4gICAgICAvLyBJbnRlcm5hbGx5IGFkZCB0byB0aGUgdHJlZS5cbiAgICAgIG9sZENoaWxkTm9kZXNbb2xkQ2hpbGROb2Rlcy5sZW5ndGhdID0gY2hpbGROb2Rlc1tpXTtcblxuICAgICAgLy8gQWRkIHRvIHRoZSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgIGZyYWdtZW50W2ZyYWdtZW50Lmxlbmd0aF0gPSBjaGlsZE5vZGVzW2ldO1xuICAgIH1cblxuICAgIC8vIEFzc2lnbiB0aGUgZnJhZ21lbnQgdG8gdGhlIHBhdGNoZXMgdG8gYmUgaW5qZWN0ZWQuXG4gICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7XG4gICAgICBfX2RvX186IDEsXG4gICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgZnJhZ21lbnQ6IGZyYWdtZW50XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJlcGxhY2UgZWxlbWVudHMgaWYgdGhleSBhcmUgZGlmZmVyZW50LlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXNMZW5ndGg7IGkrKykge1xuICAgIGlmIChvbGRDaGlsZE5vZGVzW2ldLm5vZGVOYW1lICE9PSBjaGlsZE5vZGVzW2ldLm5vZGVOYW1lKSB7XG4gICAgICAvLyBBZGQgdG8gdGhlIHBhdGNoZXMuXG4gICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IHtcbiAgICAgICAgX19kb19fOiAxLFxuICAgICAgICBvbGQ6IG9sZENoaWxkTm9kZXNbaV0sXG4gICAgICAgICduZXcnOiBjaGlsZE5vZGVzW2ldXG4gICAgICB9O1xuXG4gICAgICAvLyBVc2VkIGJ5IHRoZSBXb3JrZXIgdG8gdHJhY2sgZWxlbWVudHMgcmVtb3ZlZC5cbiAgICAgIGlmIChwYXRjaGVzLnJlbW92YWxzKSB7XG4gICAgICAgIHBhdGNoZXMucmVtb3ZhbHMucHVzaChvbGRDaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgLy8gVXNlZCBieSB0aGUgV29ya2VyIHRvIHRyYWNrIGVsZW1lbnRzIGFkZGVkLlxuICAgICAgaWYgKHBhdGNoZXMuYWRkaXRpb25zKSB7XG4gICAgICAgIHBhdGNoZXMuYWRkaXRpb25zLnB1c2goY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHVucHJvdGVjdEVsZW1lbnQob2xkQ2hpbGROb2Rlc1tpXSk7XG4gICAgICBwcm90ZWN0RWxlbWVudChjaGlsZE5vZGVzW2ldKTtcblxuICAgICAgLy8gUmVwbGFjZSB0aGUgaW50ZXJuYWwgdHJlZSdzIHBvaW50IG9mIHZpZXcgb2YgdGhpcyBlbGVtZW50LlxuICAgICAgb2xkQ2hpbGROb2Rlc1tpXSA9IGNoaWxkTm9kZXNbaV07XG4gICAgfVxuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZXNlIGVsZW1lbnRzLlxuICBpZiAob2xkQ2hpbGROb2Rlc0xlbmd0aCA+IGNoaWxkTm9kZXNMZW5ndGgpIHtcbiAgICAvLyBFbGVtZW50cyB0byByZW1vdmUuXG4gICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbChvbGRDaGlsZE5vZGVzLCBjaGlsZE5vZGVzTGVuZ3RoLCBvbGRDaGlsZE5vZGVzTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZWxlbWVudCwgdGhpcyBoYXBwZW5zIGJlZm9yZSB0aGUgc3BsaWNlIHNvIHRoYXQgd2Ugc3RpbGxcbiAgICAgIC8vIGhhdmUgYWNjZXNzIHRvIHRoZSBlbGVtZW50LlxuICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSB7IF9fZG9fXzogMSwgb2xkOiB0b1JlbW92ZVtpXS5lbGVtZW50IH07XG4gICAgfVxuXG4gICAgdmFyIHJlbW92ZWQgPSBvbGRDaGlsZE5vZGVzLnNwbGljZShjaGlsZE5vZGVzTGVuZ3RoLCBvbGRDaGlsZE5vZGVzTGVuZ3RoIC0gY2hpbGROb2Rlc0xlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbW92ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIFVzZWQgYnkgdGhlIFdvcmtlciB0byB0cmFjayBlbGVtZW50cyByZW1vdmVkLlxuICAgICAgaWYgKHBhdGNoZXMucmVtb3ZhbHMpIHtcbiAgICAgICAgcGF0Y2hlcy5yZW1vdmFscy5wdXNoKHJlbW92ZWRbaV0pO1xuICAgICAgfVxuXG4gICAgICB1bnByb3RlY3RFbGVtZW50KHJlbW92ZWRbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN5bmNocm9uaXplIGF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZXMgPSBuZXdUcmVlLmF0dHJpYnV0ZXM7XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICB2YXIgb2xkTGVuZ3RoID0gb2xkVHJlZS5hdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICB2YXIgbmV3TGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XG5cbiAgICAvLyBTdGFydCB3aXRoIHRoZSBtb3N0IGNvbW1vbiwgYWRkaXRpdmUuXG4gICAgaWYgKG5ld0xlbmd0aCA+IG9sZExlbmd0aCkge1xuICAgICAgdmFyIHRvQWRkID0gc2xpY2UuY2FsbChhdHRyaWJ1dGVzLCBvbGRMZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB7XG4gICAgICAgICAgX19kb19fOiAyLFxuICAgICAgICAgIGVsZW1lbnQ6IG9sZEVsZW1lbnQsXG4gICAgICAgICAgbmFtZTogdG9BZGRbaV0ubmFtZSxcbiAgICAgICAgICB2YWx1ZTogdG9BZGRbaV0udmFsdWVcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcbiAgICAgICAgYXR0ci5uYW1lID0gdG9BZGRbaV0ubmFtZTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IHRvQWRkW2ldLnZhbHVlO1xuXG4gICAgICAgIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5wcm90ZWN0KGF0dHIpO1xuXG4gICAgICAgIC8vIFB1c2ggdGhlIGNoYW5nZSBvYmplY3QgaW50byBpbnRvIHRoZSB2aXJ0dWFsIHRyZWUuXG4gICAgICAgIG9sZFRyZWUuYXR0cmlidXRlc1tvbGRUcmVlLmF0dHJpYnV0ZXMubGVuZ3RoXSA9IGF0dHI7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IGNoYW5nZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgcmVtb3ZhbHMuXG4gICAgaWYgKG9sZExlbmd0aCA+IG5ld0xlbmd0aCkge1xuICAgICAgdmFyIHRvUmVtb3ZlID0gc2xpY2UuY2FsbChvbGRUcmVlLmF0dHJpYnV0ZXMsIG5ld0xlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHtcbiAgICAgICAgICBfX2RvX186IDIsXG4gICAgICAgICAgZWxlbWVudDogb2xkRWxlbWVudCxcbiAgICAgICAgICBuYW1lOiB0b1JlbW92ZVtpXS5uYW1lLFxuICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZSBmcm9tIHRoZSB2aXJ0dWFsIG5vZGUuXG4gICAgICAgIHZhciByZW1vdmVkID0gb2xkVHJlZS5hdHRyaWJ1dGVzLnNwbGljZShpLCAxKTtcblxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgcmVtb3ZlZC5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICBwb29scy5hdHRyaWJ1dGVPYmplY3QudW5wcm90ZWN0KHJlbW92ZWRbX2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgY2hhbmdlIHRvIHRoZSBzZXJpZXMgb2YgcGF0Y2hlcy5cbiAgICAgICAgcGF0Y2hlc1twYXRjaGVzLmxlbmd0aF0gPSBjaGFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIG1vZGlmaWNhdGlvbnMuXG4gICAgdmFyIHRvTW9kaWZ5ID0gYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9Nb2RpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvbGRBdHRyVmFsdWUgPSBvbGRUcmVlLmF0dHJpYnV0ZXNbaV0gJiYgb2xkVHJlZS5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgdmFyIG5ld0F0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbaV0gJiYgYXR0cmlidXRlc1tpXS52YWx1ZTtcblxuICAgICAgLy8gT25seSBwdXNoIGluIGEgY2hhbmdlIGlmIHRoZSBhdHRyaWJ1dGUgb3IgdmFsdWUgY2hhbmdlcy5cbiAgICAgIGlmIChvbGRBdHRyVmFsdWUgIT09IG5ld0F0dHJWYWx1ZSkge1xuICAgICAgICB2YXIgY2hhbmdlID0ge1xuICAgICAgICAgIF9fZG9fXzogMixcbiAgICAgICAgICBlbGVtZW50OiBvbGRFbGVtZW50LFxuICAgICAgICAgIG5hbWU6IHRvTW9kaWZ5W2ldLm5hbWUsXG4gICAgICAgICAgdmFsdWU6IHRvTW9kaWZ5W2ldLnZhbHVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYXR0cmlidXRlIGluIHRoZSB2aXJ0dWFsIG5vZGUuXG4gICAgICAgIHZhciBhdHRyID0gb2xkVHJlZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBhdHRyLm5hbWUgPSB0b01vZGlmeVtpXS5uYW1lO1xuICAgICAgICBhdHRyLnZhbHVlID0gdG9Nb2RpZnlbaV0udmFsdWU7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjaGFuZ2UgdG8gdGhlIHNlcmllcyBvZiBwYXRjaGVzLlxuICAgICAgICBwYXRjaGVzW3BhdGNoZXMubGVuZ3RoXSA9IGNoYW5nZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTeW5jIGVhY2ggY3VycmVudCBub2RlLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZENoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob2xkQ2hpbGROb2Rlc1tpXS5lbGVtZW50ICE9PSBjaGlsZE5vZGVzW2ldLmVsZW1lbnQpIHtcbiAgICAgIHN5bmMuY2FsbChwYXRjaGVzLCBvbGRUcmVlLmNoaWxkTm9kZXNbaV0sIGNoaWxkTm9kZXNbaV0pO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmMzbHVZeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096dHhRa0ZyUW5kQ0xFbEJRVWs3TzNsQ1FXeENTU3hsUVVGbE96c3dRa0ZKZUVNc1owSkJRV2RDT3p0QlFVVjJRaXhKUVVGSkxFdEJRVXNzYlVKQlFWTXNRMEZCUXp0QlFVTnVRaXhKUVVGSkxHTkJRV01zTmtKQlFXdENMRU5CUVVNN1FVRkRja01zU1VGQlNTeG5Ra0ZCWjBJc0swSkJRVzlDTEVOQlFVTTdPMEZCUlhwRExFbEJRVTBzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRE96czdPenM3T3pzN1FVRlJja0lzVTBGQlV5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVNM1F5eE5RVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRia0lzVFVGQlNTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVOMlF5eE5RVUZKTEcxQ1FVRnRRaXhIUVVGSExHRkJRV0VzUjBGQlJ5eGhRVUZoTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOdVJTeE5RVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJRMnBETEUxQlFVa3NXVUZCV1N4SFFVRkhMRU5CUVVNc1VVRkJVU3hGUVVGRkxFOUJRVThzUlVGQlJTeFZRVUZWTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVFZFTEUxQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRXaXhSUVVGSkxFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1JVRkJSU3h0UWtGQmJVSXNRMEZCUXl4RFFVRkRPenRCUVVVelJDeFhRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVVzVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RlFVRkZMRTlCUVU4c1JVRkJSU3hWUVVGVkxFVkJRVVVzUTBGQlF6czdRVUZGT1VRc1UwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdPMEZCUlhaRExGVkJRVWtzVDBGQlR5eERRVUZETEZGQlFWRXNSVUZCUlR0QlFVRkZMR1ZCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRVVU3TzBGQlJUVkVMSE5DUVVGblFpeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRemxDT3p0QlFVVkVMRmRCUVU4N1IwRkRVanM3UVVGRlJDeE5RVUZKTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRMnhETEUxQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU03UVVGRGNFTXNUVUZCU1N4blFrRkJaMElzUjBGQlJ5eFZRVUZWTEVkQlFVY3NWVUZCVlN4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRE1VUXNUVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF6czdPenRCUVVscVF5eE5RVUZKTEU5QlFVOHNRMEZCUXl4UlFVRlJMRXRCUVVzc1QwRkJUeXhEUVVGRExGRkJRVkVzUlVGQlJUdEJRVU42UXl4WFFVRlBPMGRCUTFJN096dEJRVWRFTEUxQlFVa3NXVUZCV1N4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRVZCUVVVN08wRkJSUzlETEZGQlFVa3NUMEZCVHl4RFFVRkRMRk5CUVZNc1MwRkJTeXhUUVVGVExFVkJRVVU3UVVGRGJrTXNZVUZCVHl4RFFVRkRMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU03TzBGQlJUbENMR0ZCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVYzdRVUZEZUVJc1kwRkJUU3hGUVVGRkxFTkJRVU03UVVGRFZDeGxRVUZQTEVWQlFVVXNWVUZCVlR0QlFVTnVRaXhoUVVGTExFVkJRVVVzVTBGQlV6dFBRVU5xUWl4RFFVRkRPMHRCUTBnN08wRkJSVVFzVjBGQlR6dEhRVU5TT3pzN1FVRkhSQ3hOUVVGSkxHZENRVUZuUWl4SFFVRkhMRzFDUVVGdFFpeEZRVUZGT3pzN1FVRkhNVU1zVVVGQlNTeFJRVUZSTEVkQlFVY3NSVUZCUlN4RFFVRkRPenRCUVVWc1FpeFRRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNSMEZCUnl4blFrRkJaMElzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlRzN1FVRkZNMFFzVlVGQlNTeFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZPMEZCUVVVc1pVRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VDBGQlJUczdRVUZGYWtVc2IwSkJRV01zUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenM3TzBGQlJ6bENMRzFDUVVGaExFTkJRVU1zWVVGQllTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6czdPMEZCUjNCRUxHTkJRVkVzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlF6TkRPenM3UVVGSFJDeFhRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSE8wRkJRM2hDTEZsQlFVMHNSVUZCUlN4RFFVRkRPMEZCUTFRc1lVRkJUeXhGUVVGRkxGVkJRVlU3UVVGRGJrSXNZMEZCVVN4RlFVRkZMRkZCUVZFN1MwRkRia0lzUTBGQlF6dEhRVU5JT3pzN1FVRkhSQ3hQUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRla01zVVVGQlNTeGhRVUZoTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hMUVVGTExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4UlFVRlJMRVZCUVVVN08wRkJSWGhFTEdGQlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWM3UVVGRGVFSXNZMEZCVFN4RlFVRkZMRU5CUVVNN1FVRkRWQ3hYUVVGSExFVkJRVVVzWVVGQllTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnlRaXhsUVVGTExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTTdUMEZEYmtJc1EwRkJRenM3TzBGQlIwWXNWVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRVVVzWlVGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdUMEZCUlRzN08wRkJSMnhGTEZWQlFVa3NUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVGRkxHVkJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzA5QlFVVTdPMEZCUldwRkxITkNRVUZuUWl4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEyNURMRzlDUVVGakxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN096dEJRVWM1UWl4dFFrRkJZU3hEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVOc1F6dEhRVU5HT3pzN1FVRkhSQ3hOUVVGSkxHMUNRVUZ0UWl4SFFVRkhMR2RDUVVGblFpeEZRVUZGT3p0QlFVVXhReXhSUVVGSkxGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1JVRkJSU3huUWtGQlowSXNSVUZEZGtRc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXpzN1FVRkZka0lzVTBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExGRkJRVkVzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN096dEJRVWQ0UXl4aFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVWQlFVVXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hIUVVGSExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRE8wdEJRMjVGT3p0QlFVVkVMRkZCUVVrc1QwRkJUeXhIUVVGSExHRkJRV0VzUTBGQlF5eE5RVUZOTEVOQlFVTXNaMEpCUVdkQ0xFVkJRMnBFTEcxQ1FVRnRRaXhIUVVGSExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN08wRkJSVEZETEZOQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk96dEJRVVYyUXl4VlFVRkpMRTlCUVU4c1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGQlJTeGxRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UFFVRkZPenRCUVVVMVJDeHpRa0ZCWjBJc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTTVRanRIUVVOR096czdRVUZIUkN4TlFVRkpMRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVndReXhOUVVGSkxGVkJRVlVzUlVGQlJUdEJRVU5rTEZGQlFVa3NVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeERRVUZETzBGQlF6RkRMRkZCUVVrc1UwRkJVeXhIUVVGSExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTTdPenRCUVVkc1F5eFJRVUZKTEZOQlFWTXNSMEZCUnl4VFFVRlRMRVZCUVVVN1FVRkRla0lzVlVGQlNTeExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdPMEZCUlRsRExGZEJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNKRExGbEJRVWtzVFVGQlRTeEhRVUZITzBGQlExZ3NaMEpCUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzYVVKQlFVOHNSVUZCUlN4VlFVRlZPMEZCUTI1Q0xHTkJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTVHRCUVVOdVFpeGxRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXM3VTBGRGRFSXNRMEZCUXpzN1FVRkZSaXhaUVVGSkxFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRM1pETEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTXhRaXhaUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03TzBGQlJUVkNMR0ZCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenM3UVVGSGNFTXNaVUZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJRenM3TzBGQlIzSkVMR1ZCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NUVUZCVFN4RFFVRkRPMDlCUTJ4RE8wdEJRMFk3T3p0QlFVZEVMRkZCUVVrc1UwRkJVeXhIUVVGSExGTkJRVk1zUlVGQlJUdEJRVU42UWl4VlFVRkpMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlZMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03TzBGQlJYcEVMRmRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEzaERMRmxCUVVrc1RVRkJUU3hIUVVGSE8wRkJRMWdzWjBKQlFVMHNSVUZCUlN4RFFVRkRPMEZCUTFRc2FVSkJRVThzUlVGQlJTeFZRVUZWTzBGQlEyNUNMR05CUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1R0QlFVTjBRaXhsUVVGTExFVkJRVVVzVTBGQlV6dFRRVU5xUWl4RFFVRkRPenM3UVVGSFJpeFpRVUZKTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGxETEdGQlFVc3NTVUZCU1N4RlFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFVkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZMRVZCUVVNc1JVRkJSU3hGUVVGRk8wRkJRM1pETEdWQlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMU5CUXpkRE96czdRVUZIUkN4bFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEUxQlFVMHNRMEZCUXp0UFFVTnNRenRMUVVOR096czdRVUZIUkN4UlFVRkpMRkZCUVZFc1IwRkJSeXhWUVVGVkxFTkJRVU03TzBGQlJURkNMRk5CUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEzaERMRlZCUVVrc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRlRVVzVlVGQlNTeFpRVUZaTEVkQlFVY3NWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNN096dEJRVWQ0UkN4VlFVRkpMRmxCUVZrc1MwRkJTeXhaUVVGWkxFVkJRVVU3UVVGRGFrTXNXVUZCU1N4TlFVRk5MRWRCUVVjN1FVRkRXQ3huUWtGQlRTeEZRVUZGTEVOQlFVTTdRVUZEVkN4cFFrRkJUeXhGUVVGRkxGVkJRVlU3UVVGRGJrSXNZMEZCU1N4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTzBGQlEzUkNMR1ZCUVVzc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3p0VFFVTjZRaXhEUVVGRE96czdRVUZIUml4WlFVRkpMRWxCUVVrc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTJwRExGbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU0zUWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNN096dEJRVWN2UWl4bFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEUxQlFVMHNRMEZCUXp0UFFVTnNRenRMUVVOR08wZEJRMFk3T3p0QlFVZEVMRTlCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4aFFVRmhMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlF6ZERMRkZCUVVrc1lVRkJZU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEU5QlFVOHNTMEZCU3l4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEzUkVMRlZCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRNVVE3UjBGRFJqdERRVU5HSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDI1dlpHVXZjM2x1WXk1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQjdJSEJ2YjJ4eklHRnpJRjl3YjI5c2N5QjlJR1p5YjIwZ0p5NHVMM1YwYVd3dmNHOXZiSE1uTzF4dWFXMXdiM0owSUh0Y2JpQWdjSEp2ZEdWamRFVnNaVzFsYm5RZ1lYTWdYM0J5YjNSbFkzUkZiR1Z0Wlc1MExGeHVJQ0IxYm5CeWIzUmxZM1JGYkdWdFpXNTBJR0Z6SUY5MWJuQnliM1JsWTNSRmJHVnRaVzUwWEc1OUlHWnliMjBnSnk0dUwzVjBhV3d2YldWdGIzSjVKenRjYmx4dWRtRnlJSEJ2YjJ4eklEMGdYM0J2YjJ4ek8xeHVkbUZ5SUhCeWIzUmxZM1JGYkdWdFpXNTBJRDBnWDNCeWIzUmxZM1JGYkdWdFpXNTBPMXh1ZG1GeUlIVnVjSEp2ZEdWamRFVnNaVzFsYm5RZ1BTQmZkVzV3Y205MFpXTjBSV3hsYldWdWREdGNibHh1WTI5dWMzUWdjMnhwWTJVZ1BTQkJjbkpoZVM1d2NtOTBiM1I1Y0dVdWMyeHBZMlU3WEc1Y2JpOHFLbHh1SUNvZ1UzbHVZMmh5YjI1cGVtVnpJR05vWVc1blpYTWdabkp2YlNCMGFHVWdibVYzVkhKbFpTQnBiblJ2SUhSb1pTQnZiR1JVY21WbExseHVJQ3BjYmlBcUlFQndZWEpoYlNCdmJHUlVjbVZsWEc0Z0tpQkFjR0Z5WVcwZ2JtVjNWSEpsWlZ4dUlDb3ZYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpQnplVzVqS0c5c1pGUnlaV1VzSUc1bGQxUnlaV1VwSUh0Y2JpQWdiR1YwSUhCaGRHTm9aWE1nUFNCMGFHbHpPMXh1SUNCc1pYUWdiMnhrUTJocGJHUk9iMlJsY3lBOUlHOXNaRlJ5WldVdVkyaHBiR1JPYjJSbGN6dGNiaUFnYkdWMElHOXNaRU5vYVd4a1RtOWtaWE5NWlc1bmRHZ2dQU0J2YkdSRGFHbHNaRTV2WkdWeklEOGdiMnhrUTJocGJHUk9iMlJsY3k1c1pXNW5kR2dnT2lBd08xeHVJQ0JzWlhRZ2IyeGtSV3hsYldWdWRDQTlJRzlzWkZSeVpXVXVaV3hsYldWdWREdGNiaUFnYkdWMElIUmxlSFJGYkdWdFpXNTBjeUE5SUZzbmMyTnlhWEIwSnl3Z0ozTjBlV3hsSnl3Z0ozUmxlSFJoY21WaEp5d2dKeU4wWlhoMEoxMDdYRzVjYmlBZ2FXWWdLQ0Z1WlhkVWNtVmxLU0I3WEc0Z0lDQWdiR1YwSUhKbGJXOTJaV1FnUFNCdmJHUkRhR2xzWkU1dlpHVnpMbk53YkdsalpTZ3dMQ0J2YkdSRGFHbHNaRTV2WkdWelRHVnVaM1JvS1R0Y2JseHVJQ0FnSUhCaGRHTm9aWE5iY0dGMFkyaGxjeTVzWlc1bmRHaGRJRDBnZXlCZlgyUnZYMTg2SUMweExDQmxiR1Z0Wlc1ME9pQnZiR1JGYkdWdFpXNTBJSDA3WEc1Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhKbGJXOTJaV1F1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lDOHZJRlZ6WldRZ1lua2dkR2hsSUZkdmNtdGxjaUIwYnlCMGNtRmpheUJsYkdWdFpXNTBjeUJ5WlcxdmRtVmtMbHh1SUNBZ0lDQWdhV1lnS0hCaGRHTm9aWE11Y21WdGIzWmhiSE1wSUhzZ2NHRjBZMmhsY3k1eVpXMXZkbUZzY3k1d2RYTm9LSEpsYlc5MlpXUmJhVjBwT3lCOVhHNWNiaUFnSUNBZ0lIVnVjSEp2ZEdWamRFVnNaVzFsYm5Rb2NtVnRiM1psWkZ0cFhTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1TzF4dUlDQjlYRzVjYmlBZ2JHVjBJRzV2WkdWV1lXeDFaU0E5SUc1bGQxUnlaV1V1Ym05a1pWWmhiSFZsTzF4dUlDQnNaWFFnWTJocGJHUk9iMlJsY3lBOUlHNWxkMVJ5WldVdVkyaHBiR1JPYjJSbGN6dGNiaUFnYkdWMElHTm9hV3hrVG05a1pYTk1aVzVuZEdnZ1BTQmphR2xzWkU1dlpHVnpJRDhnWTJocGJHUk9iMlJsY3k1c1pXNW5kR2dnT2lBd08xeHVJQ0JzWlhRZ2JtVjNSV3hsYldWdWRDQTlJRzVsZDFSeVpXVXVaV3hsYldWdWREdGNibHh1SUNBdkx5QkpaaUIwYUdVZ1pXeGxiV1Z1ZENCM1pTZHlaU0J5WlhCc1lXTnBibWNnYVhNZ2RHOTBZV3hzZVNCa2FXWm1aWEpsYm5RZ1puSnZiU0IwYUdVZ2NISmxkbWx2ZFhOY2JpQWdMeThnY21Wd2JHRmpaU0IwYUdVZ1pXNTBhWEpsSUdWc1pXMWxiblFzSUdSdmJpZDBJR0p2ZEdobGNpQnBiblpsYzNScFoyRjBhVzVuSUdOb2FXeGtjbVZ1TGx4dUlDQnBaaUFvYjJ4a1ZISmxaUzV1YjJSbFRtRnRaU0FoUFQwZ2JtVjNWSEpsWlM1dWIyUmxUbUZ0WlNrZ2UxeHVJQ0FnSUhKbGRIVnlianRjYmlBZ2ZWeHVYRzRnSUM4dklGSmxjR3hoWTJVZ2RHVjRkQ0J1YjJSbElIWmhiSFZsY3lCcFppQjBhR1Y1SUdGeVpTQmthV1ptWlhKbGJuUXVYRzRnSUdsbUlDaDBaWGgwUld4bGJXVnVkSE11YVc1a1pYaFBaaWh1WlhkVWNtVmxMbTV2WkdWT1lXMWxLU0ErSUMweEtTQjdYRzRnSUNBZ0x5OGdWR1Y0ZENCamFHRnVaMlZrTGx4dUlDQWdJR2xtSUNodmJHUlVjbVZsTG01dlpHVldZV3gxWlNBaFBUMGdibTlrWlZaaGJIVmxLU0I3WEc0Z0lDQWdJQ0J2YkdSVWNtVmxMbTV2WkdWV1lXeDFaU0E5SUc1dlpHVldZV3gxWlR0Y2JseHVJQ0FnSUNBZ2NHRjBZMmhsYzF0d1lYUmphR1Z6TG14bGJtZDBhRjBnUFNCN1hHNGdJQ0FnSUNBZ0lGOWZaRzlmWHpvZ015eGNiaUFnSUNBZ0lDQWdaV3hsYldWdWREb2diMnhrUld4bGJXVnVkQ3hjYmlBZ0lDQWdJQ0FnZG1Gc2RXVTZJRzV2WkdWV1lXeDFaVnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200N1hHNGdJSDFjYmx4dUlDQXZMeUJOYjNOMElHTnZiVzF2YmlCaFpHUnBkR2wyWlNCbGJHVnRaVzUwY3k1Y2JpQWdhV1lnS0dOb2FXeGtUbTlrWlhOTVpXNW5kR2dnUGlCdmJHUkRhR2xzWkU1dlpHVnpUR1Z1WjNSb0tTQjdYRzRnSUNBZ0x5OGdVM1J2Y21VZ1pXeGxiV1Z1ZEhNZ2FXNGdZU0JFYjJOMWJXVnVkRVp5WVdkdFpXNTBJSFJ2SUdsdVkzSmxZWE5sSUhCbGNtWnZjbTFoYm1ObElHRnVaQ0JpWlZ4dUlDQWdJQzh2SUdkbGJtVnlZV3hzZVNCemFXMXdiR2xsY2lCMGJ5QjNiM0pySUhkcGRHZ3VYRzRnSUNBZ2JHVjBJR1p5WVdkdFpXNTBJRDBnVzEwN1hHNWNiaUFnSUNCbWIzSWdLR3hsZENCcElEMGdiMnhrUTJocGJHUk9iMlJsYzB4bGJtZDBhRHNnYVNBOElHTm9hV3hrVG05a1pYTk1aVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnTHk4Z1ZYTmxaQ0JpZVNCMGFHVWdWMjl5YTJWeUlIUnZJSFJ5WVdOcklHVnNaVzFsYm5SeklHRmtaR1ZrTGx4dUlDQWdJQ0FnYVdZZ0tIQmhkR05vWlhNdVlXUmthWFJwYjI1ektTQjdJSEJoZEdOb1pYTXVZV1JrYVhScGIyNXpMbkIxYzJnb1kyaHBiR1JPYjJSbGMxdHBYU2s3SUgxY2JseHVJQ0FnSUNBZ2NISnZkR1ZqZEVWc1pXMWxiblFvWTJocGJHUk9iMlJsYzF0cFhTazdYRzVjYmlBZ0lDQWdJQzh2SUVsdWRHVnlibUZzYkhrZ1lXUmtJSFJ2SUhSb1pTQjBjbVZsTGx4dUlDQWdJQ0FnYjJ4a1EyaHBiR1JPYjJSbGMxdHZiR1JEYUdsc1pFNXZaR1Z6TG14bGJtZDBhRjBnUFNCamFHbHNaRTV2WkdWelcybGRPMXh1WEc0Z0lDQWdJQ0F2THlCQlpHUWdkRzhnZEdobElHUnZZM1Z0Wlc1MElHWnlZV2R0Wlc1MExseHVJQ0FnSUNBZ1puSmhaMjFsYm5SYlpuSmhaMjFsYm5RdWJHVnVaM1JvWFNBOUlHTm9hV3hrVG05a1pYTmJhVjA3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnUVhOemFXZHVJSFJvWlNCbWNtRm5iV1Z1ZENCMGJ5QjBhR1VnY0dGMFkyaGxjeUIwYnlCaVpTQnBibXBsWTNSbFpDNWNiaUFnSUNCd1lYUmphR1Z6VzNCaGRHTm9aWE11YkdWdVozUm9YU0E5SUh0Y2JpQWdJQ0FnSUY5ZlpHOWZYem9nTVN4Y2JpQWdJQ0FnSUdWc1pXMWxiblE2SUc5c1pFVnNaVzFsYm5Rc1hHNGdJQ0FnSUNCbWNtRm5iV1Z1ZERvZ1puSmhaMjFsYm5SY2JpQWdJQ0I5TzF4dUlDQjlYRzVjYmlBZ0x5OGdVbVZ3YkdGalpTQmxiR1Z0Wlc1MGN5QnBaaUIwYUdWNUlHRnlaU0JrYVdabVpYSmxiblF1WEc0Z0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dZMmhwYkdST2IyUmxjMHhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnYVdZZ0tHOXNaRU5vYVd4a1RtOWtaWE5iYVYwdWJtOWtaVTVoYldVZ0lUMDlJR05vYVd4a1RtOWtaWE5iYVYwdWJtOWtaVTVoYldVcElIdGNiaUFnSUNBZ0lDOHZJRUZrWkNCMGJ5QjBhR1VnY0dGMFkyaGxjeTVjYmlBZ0lDQWdJSEJoZEdOb1pYTmJjR0YwWTJobGN5NXNaVzVuZEdoZElEMGdlMXh1SUNBZ0lDQWdJQ0JmWDJSdlgxODZJREVzWEc0Z0lDQWdJQ0FnSUc5c1pEb2diMnhrUTJocGJHUk9iMlJsYzF0cFhTeGNiaUFnSUNBZ0lDQWdibVYzT2lCamFHbHNaRTV2WkdWelcybGRYRzRnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0F2THlCVmMyVmtJR0o1SUhSb1pTQlhiM0pyWlhJZ2RHOGdkSEpoWTJzZ1pXeGxiV1Z1ZEhNZ2NtVnRiM1psWkM1Y2JpQWdJQ0FnSUdsbUlDaHdZWFJqYUdWekxuSmxiVzkyWVd4ektTQjdJSEJoZEdOb1pYTXVjbVZ0YjNaaGJITXVjSFZ6YUNodmJHUkRhR2xzWkU1dlpHVnpXMmxkS1RzZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJWYzJWa0lHSjVJSFJvWlNCWGIzSnJaWElnZEc4Z2RISmhZMnNnWld4bGJXVnVkSE1nWVdSa1pXUXVYRzRnSUNBZ0lDQnBaaUFvY0dGMFkyaGxjeTVoWkdScGRHbHZibk1wSUhzZ2NHRjBZMmhsY3k1aFpHUnBkR2x2Ym5NdWNIVnphQ2hqYUdsc1pFNXZaR1Z6VzJsZEtUc2dmVnh1WEc0Z0lDQWdJQ0IxYm5CeWIzUmxZM1JGYkdWdFpXNTBLRzlzWkVOb2FXeGtUbTlrWlhOYmFWMHBPMXh1SUNBZ0lDQWdjSEp2ZEdWamRFVnNaVzFsYm5Rb1kyaHBiR1JPYjJSbGMxdHBYU2s3WEc1Y2JpQWdJQ0FnSUM4dklGSmxjR3hoWTJVZ2RHaGxJR2x1ZEdWeWJtRnNJSFJ5WldVbmN5QndiMmx1ZENCdlppQjJhV1YzSUc5bUlIUm9hWE1nWld4bGJXVnVkQzVjYmlBZ0lDQWdJRzlzWkVOb2FXeGtUbTlrWlhOYmFWMGdQU0JqYUdsc1pFNXZaR1Z6VzJsZE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHZJRkpsYlc5MlpTQjBhR1Z6WlNCbGJHVnRaVzUwY3k1Y2JpQWdhV1lnS0c5c1pFTm9hV3hrVG05a1pYTk1aVzVuZEdnZ1BpQmphR2xzWkU1dlpHVnpUR1Z1WjNSb0tTQjdYRzRnSUNBZ0x5OGdSV3hsYldWdWRITWdkRzhnY21WdGIzWmxMbHh1SUNBZ0lHeGxkQ0IwYjFKbGJXOTJaU0E5SUhOc2FXTmxMbU5oYkd3b2IyeGtRMmhwYkdST2IyUmxjeXdnWTJocGJHUk9iMlJsYzB4bGJtZDBhQ3hjYmlBZ0lDQWdJRzlzWkVOb2FXeGtUbTlrWlhOTVpXNW5kR2dwTzF4dVhHNGdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCMGIxSmxiVzkyWlM1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdMeThnVW1WdGIzWmxJSFJvWlNCbGJHVnRaVzUwTENCMGFHbHpJR2hoY0hCbGJuTWdZbVZtYjNKbElIUm9aU0J6Y0d4cFkyVWdjMjhnZEdoaGRDQjNaU0J6ZEdsc2JGeHVJQ0FnSUNBZ0x5OGdhR0YyWlNCaFkyTmxjM01nZEc4Z2RHaGxJR1ZzWlcxbGJuUXVYRzRnSUNBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlIc2dYMTlrYjE5Zk9pQXhMQ0J2YkdRNklIUnZVbVZ0YjNabFcybGRMbVZzWlcxbGJuUWdmVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnNaWFFnY21WdGIzWmxaQ0E5SUc5c1pFTm9hV3hrVG05a1pYTXVjM0JzYVdObEtHTm9hV3hrVG05a1pYTk1aVzVuZEdnc1hHNGdJQ0FnSUNCdmJHUkRhR2xzWkU1dlpHVnpUR1Z1WjNSb0lDMGdZMmhwYkdST2IyUmxjMHhsYm1kMGFDazdYRzVjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJSEpsYlc5MlpXUXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUM4dklGVnpaV1FnWW5rZ2RHaGxJRmR2Y210bGNpQjBieUIwY21GamF5QmxiR1Z0Wlc1MGN5QnlaVzF2ZG1Wa0xseHVJQ0FnSUNBZ2FXWWdLSEJoZEdOb1pYTXVjbVZ0YjNaaGJITXBJSHNnY0dGMFkyaGxjeTV5WlcxdmRtRnNjeTV3ZFhOb0tISmxiVzkyWldSYmFWMHBPeUI5WEc1Y2JpQWdJQ0FnSUhWdWNISnZkR1ZqZEVWc1pXMWxiblFvY21WdGIzWmxaRnRwWFNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5OGdVM2x1WTJoeWIyNXBlbVVnWVhSMGNtbGlkWFJsYzF4dUlDQnNaWFFnWVhSMGNtbGlkWFJsY3lBOUlHNWxkMVJ5WldVdVlYUjBjbWxpZFhSbGN6dGNibHh1SUNCcFppQW9ZWFIwY21saWRYUmxjeWtnZTF4dUlDQWdJR3hsZENCdmJHUk1aVzVuZEdnZ1BTQnZiR1JVY21WbExtRjBkSEpwWW5WMFpYTXViR1Z1WjNSb08xeHVJQ0FnSUd4bGRDQnVaWGRNWlc1bmRHZ2dQU0JoZEhSeWFXSjFkR1Z6TG14bGJtZDBhRHRjYmx4dUlDQWdJQzh2SUZOMFlYSjBJSGRwZEdnZ2RHaGxJRzF2YzNRZ1kyOXRiVzl1TENCaFpHUnBkR2wyWlM1Y2JpQWdJQ0JwWmlBb2JtVjNUR1Z1WjNSb0lENGdiMnhrVEdWdVozUm9LU0I3WEc0Z0lDQWdJQ0JzWlhRZ2RHOUJaR1FnUFNCemJHbGpaUzVqWVd4c0tHRjBkSEpwWW5WMFpYTXNJRzlzWkV4bGJtZDBhQ2s3WEc1Y2JpQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z2RHOUJaR1F1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUdOb1lXNW5aU0E5SUh0Y2JpQWdJQ0FnSUNBZ0lDQmZYMlJ2WDE4NklESXNYRzRnSUNBZ0lDQWdJQ0FnWld4bGJXVnVkRG9nYjJ4a1JXeGxiV1Z1ZEN4Y2JpQWdJQ0FnSUNBZ0lDQnVZVzFsT2lCMGIwRmtaRnRwWFM1dVlXMWxMRnh1SUNBZ0lDQWdJQ0FnSUhaaGJIVmxPaUIwYjBGa1pGdHBYUzUyWVd4MVpTeGNiaUFnSUNBZ0lDQWdmVHRjYmx4dUlDQWdJQ0FnSUNCc1pYUWdZWFIwY2lBOUlIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQzVuWlhRb0tUdGNiaUFnSUNBZ0lDQWdZWFIwY2k1dVlXMWxJRDBnZEc5QlpHUmJhVjB1Ym1GdFpUdGNiaUFnSUNBZ0lDQWdZWFIwY2k1MllXeDFaU0E5SUhSdlFXUmtXMmxkTG5aaGJIVmxPMXh1WEc0Z0lDQWdJQ0FnSUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDNXdjbTkwWldOMEtHRjBkSElwTzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRkIxYzJnZ2RHaGxJR05vWVc1blpTQnZZbXBsWTNRZ2FXNTBieUJwYm5SdklIUm9aU0IyYVhKMGRXRnNJSFJ5WldVdVhHNGdJQ0FnSUNBZ0lHOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGMxdHZiR1JVY21WbExtRjBkSEpwWW5WMFpYTXViR1Z1WjNSb1hTQTlJR0YwZEhJN1hHNWNiaUFnSUNBZ0lDQWdMeThnUVdSa0lIUm9aU0JqYUdGdVoyVWdkRzhnZEdobElITmxjbWxsY3lCdlppQndZWFJqYUdWekxseHVJQ0FnSUNBZ0lDQndZWFJqYUdWelczQmhkR05vWlhNdWJHVnVaM1JvWFNBOUlHTm9ZVzVuWlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCRGFHVmpheUJtYjNJZ2NtVnRiM1poYkhNdVhHNGdJQ0FnYVdZZ0tHOXNaRXhsYm1kMGFDQStJRzVsZDB4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnYkdWMElIUnZVbVZ0YjNabElEMGdjMnhwWTJVdVkyRnNiQ2h2YkdSVWNtVmxMbUYwZEhKcFluVjBaWE1zSUc1bGQweGxibWQwYUNrN1hHNWNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkRzlTWlcxdmRtVXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJR05vWVc1blpTQTlJSHRjYmlBZ0lDQWdJQ0FnSUNCZlgyUnZYMTg2SURJc1hHNGdJQ0FnSUNBZ0lDQWdaV3hsYldWdWREb2diMnhrUld4bGJXVnVkQ3hjYmlBZ0lDQWdJQ0FnSUNCdVlXMWxPaUIwYjFKbGJXOTJaVnRwWFM1dVlXMWxMRnh1SUNBZ0lDQWdJQ0FnSUhaaGJIVmxPaUIxYm1SbFptbHVaV1FzWEc0Z0lDQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDQWdMeThnVW1WdGIzWmxJSFJvWlNCaGRIUnlhV0oxZEdVZ1puSnZiU0IwYUdVZ2RtbHlkSFZoYkNCdWIyUmxMbHh1SUNBZ0lDQWdJQ0JzWlhRZ2NtVnRiM1psWkNBOUlHOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGN5NXpjR3hwWTJVb2FTd2dNU2s3WEc1Y2JpQWdJQ0FnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQnlaVzF2ZG1Wa0xteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NHOXZiSE11WVhSMGNtbGlkWFJsVDJKcVpXTjBMblZ1Y0hKdmRHVmpkQ2h5WlcxdmRtVmtXMmxkS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVGa1pDQjBhR1VnWTJoaGJtZGxJSFJ2SUhSb1pTQnpaWEpwWlhNZ2IyWWdjR0YwWTJobGN5NWNiaUFnSUNBZ0lDQWdjR0YwWTJobGMxdHdZWFJqYUdWekxteGxibWQwYUYwZ1BTQmphR0Z1WjJVN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1EyaGxZMnNnWm05eUlHMXZaR2xtYVdOaGRHbHZibk11WEc0Z0lDQWdiR1YwSUhSdlRXOWthV1o1SUQwZ1lYUjBjbWxpZFhSbGN6dGNibHh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkRzlOYjJScFpua3ViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0FnSUd4bGRDQnZiR1JCZEhSeVZtRnNkV1VnUFNCdmJHUlVjbVZsTG1GMGRISnBZblYwWlhOYmFWMGdKaVlnYjJ4a1ZISmxaUzVoZEhSeWFXSjFkR1Z6VzJsZExuWmhiSFZsTzF4dUlDQWdJQ0FnYkdWMElHNWxkMEYwZEhKV1lXeDFaU0E5SUdGMGRISnBZblYwWlhOYmFWMGdKaVlnWVhSMGNtbGlkWFJsYzF0cFhTNTJZV3gxWlR0Y2JseHVJQ0FnSUNBZ0x5OGdUMjVzZVNCd2RYTm9JR2x1SUdFZ1kyaGhibWRsSUdsbUlIUm9aU0JoZEhSeWFXSjFkR1VnYjNJZ2RtRnNkV1VnWTJoaGJtZGxjeTVjYmlBZ0lDQWdJR2xtSUNodmJHUkJkSFJ5Vm1Gc2RXVWdJVDA5SUc1bGQwRjBkSEpXWVd4MVpTa2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ1kyaGhibWRsSUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJRjlmWkc5Zlh6b2dNaXhjYmlBZ0lDQWdJQ0FnSUNCbGJHVnRaVzUwT2lCdmJHUkZiR1Z0Wlc1MExGeHVJQ0FnSUNBZ0lDQWdJRzVoYldVNklIUnZUVzlrYVdaNVcybGRMbTVoYldVc1hHNGdJQ0FnSUNBZ0lDQWdkbUZzZFdVNklIUnZUVzlrYVdaNVcybGRMblpoYkhWbExGeHVJQ0FnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0FnSUM4dklGSmxjR3hoWTJVZ2RHaGxJR0YwZEhKcFluVjBaU0JwYmlCMGFHVWdkbWx5ZEhWaGJDQnViMlJsTGx4dUlDQWdJQ0FnSUNCc1pYUWdZWFIwY2lBOUlHOXNaRlJ5WldVdVlYUjBjbWxpZFhSbGMxdHBYVHRjYmlBZ0lDQWdJQ0FnWVhSMGNpNXVZVzFsSUQwZ2RHOU5iMlJwWm5sYmFWMHVibUZ0WlR0Y2JpQWdJQ0FnSUNBZ1lYUjBjaTUyWVd4MVpTQTlJSFJ2VFc5a2FXWjVXMmxkTG5aaGJIVmxPMXh1WEc0Z0lDQWdJQ0FnSUM4dklFRmtaQ0IwYUdVZ1kyaGhibWRsSUhSdklIUm9aU0J6WlhKcFpYTWdiMllnY0dGMFkyaGxjeTVjYmlBZ0lDQWdJQ0FnY0dGMFkyaGxjMXR3WVhSamFHVnpMbXhsYm1kMGFGMGdQU0JqYUdGdVoyVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeThnVTNsdVl5QmxZV05vSUdOMWNuSmxiblFnYm05a1pTNWNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCdmJHUkRhR2xzWkU1dlpHVnpMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnYVdZZ0tHOXNaRU5vYVd4a1RtOWtaWE5iYVYwdVpXeGxiV1Z1ZENBaFBUMGdZMmhwYkdST2IyUmxjMXRwWFM1bGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCemVXNWpMbU5oYkd3b2NHRjBZMmhsY3l3Z2IyeGtWSEpsWlM1amFHbHNaRTV2WkdWelcybGRMQ0JqYUdsc1pFNXZaR1Z6VzJsZEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4xY2JpSmRmUT09IiwiLy8gQ2FjaGUgcHJlYnVpbHQgdHJlZXMgYW5kIGxvb2t1cCBieSBlbGVtZW50LlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVHJlZUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydHMuVHJlZUNhY2hlID0gVHJlZUNhY2hlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwyNXZaR1V2ZEhKbFpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN1FVRkRUeXhKUVVGTkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEU5QlFVOHNSVUZCUlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMMjV2WkdVdmRISmxaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRU5oWTJobElIQnlaV0oxYVd4MElIUnlaV1Z6SUdGdVpDQnNiMjlyZFhBZ1lua2daV3hsYldWdWRDNWNibVY0Y0c5eWRDQmpiMjV6ZENCVWNtVmxRMkZqYUdVZ1BTQnVaWGNnVjJWaGEwMWhjQ2dwTzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gcHJvY2VzcztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3RyYW5zaXRpb25zID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbnMnKTtcblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfdXRpbERlY29kZSA9IHJlcXVpcmUoJy4uL3V0aWwvZGVjb2RlJyk7XG5cbnZhciBfdXRpbERlY29kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsRGVjb2RlKTtcblxudmFyIF9lbGVtZW50R2V0ID0gcmVxdWlyZSgnLi4vZWxlbWVudC9nZXQnKTtcblxudmFyIF9lbGVtZW50R2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRHZXQpO1xuXG52YXIgX2VsZW1lbnRDdXN0b20gPSByZXF1aXJlKCcuLi9lbGVtZW50L2N1c3RvbScpO1xuXG52YXIgX25vZGVNYWtlID0gcmVxdWlyZSgnLi4vbm9kZS9tYWtlJyk7XG5cbnZhciBfbm9kZU1ha2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZU1ha2UpO1xuXG52YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xudmFyIGVtcHR5ID0geyBwcm90b3R5cGU6IHt9IH07XG5cbi8qKlxuICogUHJvY2Vzc2VzIGFuIEFycmF5IG9mIHBhdGNoZXMuXG4gKlxuICogQHBhcmFtIGVsZW1lbnQgLSBFbGVtZW50IHRvIHByb2Nlc3MgcGF0Y2hzZXRzIG9uLlxuICogQHBhcmFtIGUgLSBPYmplY3QgdGhhdCBjb250YWlucyBwYXRjaGVzLlxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3MoZWxlbWVudCwgcGF0Y2hlcykge1xuICB2YXIgc3RhdGVzID0gX3RyYW5zaXRpb25zLnRyYW5zaXRpb25TdGF0ZXM7XG4gIHZhciBwcm9taXNlcyA9IFtdO1xuICB2YXIgYWRkUHJvbWlzZXMgPSBwcm9taXNlcy5wdXNoLmFwcGx5LmJpbmQocHJvbWlzZXMucHVzaCwgcHJvbWlzZXMpO1xuXG4gIC8vIFRyaWdnZXIgdGhlIGF0dGFjaGVkIHRyYW5zaXRpb24gc3RhdGUgZm9yIHRoaXMgZWxlbWVudCBhbmQgYWxsIGNoaWxkTm9kZXMuXG4gIHZhciBhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZSA9IGZ1bmN0aW9uIGF0dGFjaGVkVHJhbnNpdGlvbkFuZFRpdGxlKGVsKSB7XG4gICAgdmFyIGVsZW1lbnQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKGVsKS5lbGVtZW50O1xuXG4gICAgaWYgKGVsLm5vZGVOYW1lID09PSAnI3RleHQnIHx8IGVsLm5vZGVOYW1lID09PSAndGV4dCcpIHtcbiAgICAgIC8vIFRyaWdnZXIgYWxsIHRoZSB0ZXh0IGNoYW5nZWQgdmFsdWVzLlxuICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMudGV4dENoYW5nZWQgJiYgc3RhdGVzLnRleHRDaGFuZ2VkLmxlbmd0aCkge1xuICAgICAgICBhZGRQcm9taXNlcyhzdGF0ZXMudGV4dENoYW5nZWQubWFwKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlbGVtZW50LnBhcmVudE5vZGUgfHwgZWxlbWVudCwgbnVsbCwgZWwubm9kZVZhbHVlKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGRlZCBzdGF0ZSBmb3IgdHJhbnNpdGlvbnMgQVBJLlxuICAgIGVsc2UgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuYXR0YWNoZWQgJiYgc3RhdGVzLmF0dGFjaGVkLmxlbmd0aCkge1xuICAgICAgICBhZGRQcm9taXNlcyhzdGF0ZXMuYXR0YWNoZWQubWFwKGNhbGxDYWxsYmFjaywgZWxlbWVudCkpO1xuICAgICAgfVxuXG4gICAgLy8gQ2FsbCBhbGwgYGNoaWxkTm9kZXNgIGF0dGFjaGVkIGNhbGxiYWNrcyBhcyB3ZWxsLlxuICAgIGVsLmNoaWxkTm9kZXMuZm9yRWFjaChhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZSk7XG5cbiAgICB0aXRsZUNhbGxiYWNrKGVsKTtcbiAgfTtcblxuICB2YXIgY2FsbENhbGxiYWNrID0gZnVuY3Rpb24gY2FsbENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMpO1xuICB9O1xuXG4gIHZhciBhdHRhY2hlZENhbGxiYWNrID0gZnVuY3Rpb24gYXR0YWNoZWRDYWxsYmFjayhlbGVtZW50RGVzY3JpcHRvcikge1xuICAgIHZhciBlbCA9ICgwLCBfZWxlbWVudEdldDJbJ2RlZmF1bHQnXSkoZWxlbWVudERlc2NyaXB0b3IpLmVsZW1lbnQ7XG4gICAgdmFyIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudDtcbiAgICB2YXIgY3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbZWxlbWVudERlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuXG4gICAgaWYgKGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2suY2FsbChlbCk7XG4gICAgfVxuXG4gICAgaWYgKGVsLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9ICgwLCBfdXRpbERlY29kZTJbJ2RlZmF1bHQnXSkoZWwudGV4dENvbnRlbnQpO1xuICAgIH1cblxuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVsKTtcbiAgfTtcblxuICB2YXIgdGl0bGVDYWxsYmFjayA9IGZ1bmN0aW9uIHRpdGxlQ2FsbGJhY2soZWxlbWVudERlc2NyaXB0b3IpIHtcbiAgICB2YXIgZWwgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKGVsZW1lbnREZXNjcmlwdG9yKS5lbGVtZW50O1xuXG4gICAgLy8gRW5zdXJlIHRoZSB0aXRsZSBpcyBzZXQgY29ycmVjdGx5LlxuICAgIGlmIChlbC50YWdOYW1lID09PSAndGl0bGUnKSB7XG4gICAgICBlbC5vd25lckRvY3VtZW50LnRpdGxlID0gZWwuY2hpbGROb2Rlc1swXS5ub2RlVmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHBhdGNoZXMgYW5kIGFwcGx5IHRoZW0uXG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gKGkpIHtcbiAgICB2YXIgcGF0Y2ggPSBwYXRjaGVzW2ldO1xuICAgIHZhciBuZXdEZXNjcmlwdG9yID0gdW5kZWZpbmVkLFxuICAgICAgICBvbGREZXNjcmlwdG9yID0gdW5kZWZpbmVkLFxuICAgICAgICBlbGVtZW50RGVzY3JpcHRvciA9IHVuZGVmaW5lZDtcbiAgICB2YXIgZWxlbWVudCA9IHBhdGNoWyduZXcnXTtcblxuICAgIGlmIChwYXRjaC5lbGVtZW50KSB7XG4gICAgICBlbGVtZW50RGVzY3JpcHRvciA9IHBhdGNoLmVsZW1lbnQ7XG5cbiAgICAgIHZhciByZXN1bHQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKHBhdGNoLmVsZW1lbnQpO1xuICAgICAgcGF0Y2guZWxlbWVudCA9IHJlc3VsdC5lbGVtZW50O1xuICAgIH1cblxuICAgIGlmIChwYXRjaC5vbGQpIHtcbiAgICAgIG9sZERlc2NyaXB0b3IgPSBwYXRjaC5vbGQ7XG5cbiAgICAgIHZhciByZXN1bHQgPSAoMCwgX2VsZW1lbnRHZXQyWydkZWZhdWx0J10pKHBhdGNoLm9sZCk7XG4gICAgICBwYXRjaC5vbGQgPSByZXN1bHQuZWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGF0Y2hbJ25ldyddKSB7XG4gICAgICBuZXdEZXNjcmlwdG9yID0gcGF0Y2hbJ25ldyddO1xuXG4gICAgICB2YXIgcmVzdWx0ID0gKDAsIF9lbGVtZW50R2V0MlsnZGVmYXVsdCddKShwYXRjaFsnbmV3J10pO1xuICAgICAgcGF0Y2hbJ25ldyddID0gcmVzdWx0LmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgcGF0Y2hbJ25ldyddLnRleHRDb250ZW50ID0gKDAsIF91dGlsRGVjb2RlMlsnZGVmYXVsdCddKShlbGVtZW50Lm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSB0aGUgZW50aXJlIE5vZGUuXG4gICAgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMCkge1xuICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoWyduZXcnXSwgcGF0Y2gub2xkKTtcblxuICAgICAgdmFyIG9sZEN1c3RvbUVsZW1lbnQgPSBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW29sZERlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuICAgICAgdmFyIG5ld0N1c3RvbUVsZW1lbnQgPSBfZWxlbWVudEN1c3RvbS5jb21wb25lbnRzW25ld0Rlc2NyaXB0b3Iubm9kZU5hbWVdIHx8IGVtcHR5O1xuXG4gICAgICBpZiAob2xkQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuZGV0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICBvbGRDdXN0b21FbGVtZW50LnByb3RvdHlwZS5kZXRhY2hlZENhbGxiYWNrLmNhbGwocGF0Y2gub2xkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5ld0N1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgbmV3Q3VzdG9tRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoZWRDYWxsYmFjay5jYWxsKHBhdGNoWyduZXcnXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm9kZSBtYW5pcC5cbiAgICBlbHNlIGlmIChwYXRjaC5fX2RvX18gPT09IDEpIHtcbiAgICAgICAgLy8gQWRkLlxuICAgICAgICBpZiAocGF0Y2guZWxlbWVudCAmJiBwYXRjaC5mcmFnbWVudCAmJiAhcGF0Y2gub2xkKSB7XG4gICAgICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICAgICAgcGF0Y2guZnJhZ21lbnQuZm9yRWFjaChhdHRhY2hlZENhbGxiYWNrLCB7IGZyYWdtZW50OiBmcmFnbWVudCB9KTtcbiAgICAgICAgICBwYXRjaC5lbGVtZW50LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICAgICAgICAgIGZvckVhY2guY2FsbChwYXRjaC5mcmFnbWVudCwgYXR0YWNoZWRUcmFuc2l0aW9uQW5kVGl0bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlLlxuICAgICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgIXBhdGNoWyduZXcnXSkge1xuICAgICAgICAgICAgaWYgKCFwYXRjaC5vbGQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgcmVtb3ZlIHdpdGhvdXQgcGFyZW50LCBpcyB0aGlzIHRoZSAnICsgJ2RvY3VtZW50IHJvb3Q/Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgdGl0bGUgaXMgZW1wdGllZC5cbiAgICAgICAgICAgIGlmIChwYXRjaC5vbGQudGFnTmFtZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAgICAgICBwYXRjaC5vbGQub3duZXJEb2N1bWVudC50aXRsZSA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbb2xkRGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG5cbiAgICAgICAgICAgIGlmIChjdXN0b21FbGVtZW50LnByb3RvdHlwZS5kZXRhY2hlZENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmRldGFjaGVkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwYXRjaC5vbGQpO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGVzICYmIHN0YXRlcy5kZXRhY2hlZCAmJiBzdGF0ZXMuZGV0YWNoZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5kZXRhY2hlZC5tYXAoY2FsbENhbGxiYWNrLCBwYXRjaC5vbGQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX25vZGVNYWtlMlsnZGVmYXVsdCddLm5vZGVzW29sZERlc2NyaXB0b3IuZWxlbWVudF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVwbGFjZS5cbiAgICAgICAgICBlbHNlIGlmIChwYXRjaC5vbGQgJiYgcGF0Y2hbJ25ldyddKSB7XG4gICAgICAgICAgICAgIGlmICghcGF0Y2gub2xkLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgcmVwbGFjZSB3aXRob3V0IHBhcmVudCwgaXMgdGhpcyB0aGUgJyArICdkb2N1bWVudCByb290PycpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBlbGVtZW50IGZpcnN0LCBiZWZvcmUgZG9pbmcgdGhlIHJlcGxhY2VtZW50LlxuICAgICAgICAgICAgICBwYXRjaC5vbGQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocGF0Y2hbJ25ldyddLCBwYXRjaC5vbGQubmV4dFNpYmxpbmcpO1xuXG4gICAgICAgICAgICAgIC8vIFJlbW92ZWQgc3RhdGUgZm9yIHRyYW5zaXRpb25zIEFQSS5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMuZGV0YWNoZWQgJiYgc3RhdGVzLmRldGFjaGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5kZXRhY2hlZC5tYXAoY2FsbENhbGxiYWNrLCBwYXRjaC5vbGQpKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFJlcGxhY2VkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLnJlcGxhY2VkICYmIHN0YXRlcy5yZXBsYWNlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhZGRQcm9taXNlcyhzdGF0ZXMucmVwbGFjZWQubWFwKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHBhdGNoLm9sZCwgcGF0Y2hbJ25ldyddKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHRpdGxlIGlzIHNldCBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgIGlmIChwYXRjaFsnbmV3J10udGFnTmFtZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAgICAgICAgIHBhdGNoLm9sZC5vd25lckRvY3VtZW50LnRpdGxlID0gcGF0Y2hbJ25ldyddLmNoaWxkTm9kZXNbMF0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcGF0Y2gub2xkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBhdGNoWyduZXcnXSwgcGF0Y2gub2xkKTtcblxuICAgICAgICAgICAgICB2YXIgb2xkQ3VzdG9tRWxlbWVudCA9IF9lbGVtZW50Q3VzdG9tLmNvbXBvbmVudHNbb2xkRGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG4gICAgICAgICAgICAgIHZhciBuZXdDdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tuZXdEZXNjcmlwdG9yLm5vZGVOYW1lXSB8fCBlbXB0eTtcblxuICAgICAgICAgICAgICBpZiAob2xkQ3VzdG9tRWxlbWVudC5wcm90b3R5cGUuZGV0YWNoZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIG9sZEN1c3RvbUVsZW1lbnQucHJvdG90eXBlLmRldGFjaGVkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG5ld0N1c3RvbUVsZW1lbnQucHJvdG90eXBlLmF0dGFjaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBuZXdDdXN0b21FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hlZENhbGxiYWNrLmNhbGwocGF0Y2hbJ25ldyddKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIEFkZGVkIHN0YXRlIGZvciB0cmFuc2l0aW9ucyBBUEkuXG4gICAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dGFjaGVkICYmIHN0YXRlcy5hdHRhY2hlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hlZFRyYW5zaXRpb25BbmRUaXRsZShuZXdEZXNjcmlwdG9yKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9ub2RlTWFrZTJbJ2RlZmF1bHQnXS5ub2Rlc1tvbGREZXNjcmlwdG9yLmVsZW1lbnRdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBdHRyaWJ1dGUgbWFuaXB1bGF0aW9uLlxuICAgICAgZWxzZSBpZiAocGF0Y2guX19kb19fID09PSAyKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHBhdGNoLmVsZW1lbnQuZ2V0QXR0cmlidXRlKHBhdGNoLm5hbWUpO1xuXG4gICAgICAgICAgICAvLyBDaGFuZ2VzIHRoZSBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICB2YXIgYXVnbWVudEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIGF1Z21lbnRBdHRyaWJ1dGUoKSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZS5cbiAgICAgICAgICAgICAgaWYgKCFwYXRjaC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHBhdGNoLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHBhdGNoLm5hbWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIENoYW5nZS5cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwYXRjaC5lbGVtZW50LnNldEF0dHJpYnV0ZShwYXRjaC5uYW1lLCBwYXRjaC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBhbGwgdGhlIGF0dHJpYnV0ZSBjaGFuZ2VkIHZhbHVlcy5cbiAgICAgICAgICAgIGlmIChzdGF0ZXMgJiYgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQgJiYgc3RhdGVzLmF0dHJpYnV0ZUNoYW5nZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy5hdHRyaWJ1dGVDaGFuZ2VkLm1hcChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQsIHBhdGNoLm5hbWUsIG9sZFZhbHVlLCBwYXRjaC52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGF1Z21lbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhdWdtZW50QXR0cmlidXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGF1Z21lbnRBdHRyaWJ1dGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBjdXN0b20gZWxlbWVudCBhdHRyaWJ1dGVDaGFuZ2VkIGV2ZW50cy5cbiAgICAgICAgICAgIHZhciBjdXN0b21FbGVtZW50ID0gX2VsZW1lbnRDdXN0b20uY29tcG9uZW50c1tlbGVtZW50RGVzY3JpcHRvci5ub2RlTmFtZV0gfHwgZW1wdHk7XG5cbiAgICAgICAgICAgIGlmIChjdXN0b21FbGVtZW50LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICBjdXN0b21FbGVtZW50LnByb3RvdHlwZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbChwYXRjaC5vbGQsIHBhdGNoLm5hbWUsIG9sZFZhbHVlLCBwYXRjaC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRleHQgbm9kZSBtYW5pcHVsYXRpb24uXG4gICAgICAgIGVsc2UgaWYgKHBhdGNoLl9fZG9fXyA9PT0gMykge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsVmFsdWUgPSBwYXRjaC5lbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgICAgICAgICAgIC8vIENoYW5nZXMgdGhlIHRleHQuXG4gICAgICAgICAgICAgIHZhciBhdWdtZW50VGV4dCA9IGZ1bmN0aW9uIGF1Z21lbnRUZXh0KCkge1xuICAgICAgICAgICAgICAgIHBhdGNoLmVsZW1lbnQudGV4dENvbnRlbnQgPSAoMCwgX3V0aWxEZWNvZGUyWydkZWZhdWx0J10pKHBhdGNoLnZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGFsbCB0aGUgdGV4dCBjaGFuZ2VkIHZhbHVlcy5cbiAgICAgICAgICAgICAgaWYgKHN0YXRlcyAmJiBzdGF0ZXMudGV4dENoYW5nZWQgJiYgc3RhdGVzLnRleHRDaGFuZ2VkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFkZFByb21pc2VzKHN0YXRlcy50ZXh0Q2hhbmdlZC5tYXAoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGNhbGxiYWNrKHBhdGNoLmVsZW1lbnQucGFyZW50Tm9kZSB8fCBwYXRjaC5lbGVtZW50LCBvcmlnaW5hbFZhbHVlLCBwYXRjaC52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihhdWdtZW50VGV4dCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhdWdtZW50VGV4dCgpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0Y2guZWxlbWVudC50ZXh0Q29udGVudCA9ICgwLCBfdXRpbERlY29kZTJbJ2RlZmF1bHQnXSkocGF0Y2gudmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBfbG9vcChpKTtcbiAgfVxuXG4gIHZhciBhY3RpdmVQcm9taXNlcyA9IHByb21pc2VzLmZpbHRlcihCb29sZWFuKTtcblxuICAvLyBXYWl0IHVudGlsIGFsbCB0cmFuc2l0aW9uIHByb21pc2VzIGhhdmUgcmVzb2x2ZWQuXG4gIGlmIChhY3RpdmVQcm9taXNlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMuZmlsdGVyKEJvb2xlYW4pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM0JoZEdOb1pYTXZjSEp2WTJWemN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0eFFrRm5RbmRDTEU5QlFVODdPenM3TWtKQmFFSkZMR2RDUVVGblFqczdlVUpCUXpOQ0xHVkJRV1U3T3pCQ1FVTldMR2RDUVVGblFqczdPenN3UWtGRGNFSXNaMEpCUVdkQ096czdPelpDUVVOYUxHMUNRVUZ0UWpzN2QwSkJRM3BDTEdOQlFXTTdPenM3UVVGRmJrTXNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTTdRVUZEZEVNc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeFRRVUZUTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNN096czdPenM3T3p0QlFWRm1MRk5CUVZNc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJTeFBRVUZQTEVWQlFVVTdRVUZEYUVRc1RVRkJTU3hOUVVGTkxHZERRVUZ0UWl4RFFVRkRPMEZCUXpsQ0xFMUJRVWtzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTnNRaXhOUVVGSkxGZEJRVmNzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenM3TzBGQlIzQkZMRTFCUVVrc01FSkJRVEJDTEVkQlFVY3NVMEZCTjBJc01FSkJRVEJDTEVOQlFWa3NSVUZCUlN4RlFVRkZPMEZCUXpWRExGRkJRVWtzVDBGQlR5eEhRVUZITERaQ1FVRlhMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF6czdRVUZGY2tNc1VVRkJTU3hGUVVGRkxFTkJRVU1zVVVGQlVTeExRVUZMTEU5QlFVOHNTVUZCU1N4RlFVRkZMRU5CUVVNc1VVRkJVU3hMUVVGTExFMUJRVTBzUlVGQlJUczdRVUZGY2tRc1ZVRkJTU3hOUVVGTkxFbEJRVWtzVFVGQlRTeERRVUZETEZkQlFWY3NTVUZCU1N4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU0zUkN4dFFrRkJWeXhEUVVGRExFMUJRVTBzUTBGQlF5eFhRVUZYTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1VVRkJVU3hGUVVGSk8wRkJRemRETEdsQ1FVRlBMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEpRVUZKTEU5QlFVOHNSVUZCUlN4SlFVRkpMRVZCUVVVc1JVRkJSU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFOQlEzQkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRMHc3UzBGRFJqczdVMEZGU1N4SlFVRkpMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRelZFTEcxQ1FVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNXVUZCV1N4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03VDBGRGVrUTdPenRCUVVkRUxFMUJRVVVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTTdPMEZCUld4RUxHbENRVUZoTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRia0lzUTBGQlF6czdRVUZGUml4TlFVRkpMRmxCUVZrc1IwRkJSeXhUUVVGbUxGbEJRVmtzUTBGQldTeFJRVUZSTEVWQlFVVTdRVUZEY0VNc1YwRkJUeXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdSMEZEZGtJc1EwRkJRenM3UVVGRlJpeE5RVUZKTEdkQ1FVRm5RaXhIUVVGSExGTkJRVzVDTEdkQ1FVRm5RaXhEUVVGWkxHbENRVUZwUWl4RlFVRkZPMEZCUTJwRUxGRkJRVWtzUlVGQlJTeEhRVUZITERaQ1FVRlhMR2xDUVVGcFFpeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUXk5RExGRkJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkROMElzVVVGQlNTeGhRVUZoTEVkQlFVY3NNRUpCUVZjc2FVSkJRV2xDTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRE96dEJRVVZ3UlN4UlFVRkpMR0ZCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zWjBKQlFXZENMRVZCUVVVN1FVRkROVU1zYlVKQlFXRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wdEJRMjVFT3p0QlFVVkVMRkZCUVVrc1JVRkJSU3hEUVVGRExGRkJRVkVzUzBGQlN5eFBRVUZQTEVWQlFVVTdRVUZETTBJc1VVRkJSU3hEUVVGRExGZEJRVmNzUjBGQlJ5dzJRa0ZCWlN4RlFVRkZMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03UzBGRGFrUTdPMEZCUlVRc1dVRkJVU3hEUVVGRExGZEJRVmNzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTXhRaXhEUVVGRE96dEJRVVZHTEUxQlFVa3NZVUZCWVN4SFFVRkhMRk5CUVdoQ0xHRkJRV0VzUTBGQldTeHBRa0ZCYVVJc1JVRkJSVHRCUVVNNVF5eFJRVUZKTEVWQlFVVXNSMEZCUnl3MlFrRkJWeXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJRenM3TzBGQlJ5OURMRkZCUVVrc1JVRkJSU3hEUVVGRExFOUJRVThzUzBGQlN5eFBRVUZQTEVWQlFVVTdRVUZETVVJc1VVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTTdTMEZEY2tRN1IwRkRSaXhEUVVGRE96czdPM2RDUVVkUExFTkJRVU03UVVGRFVpeFJRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRrSXNVVUZCU1N4aFFVRmhMRmxCUVVFN1VVRkJSU3hoUVVGaExGbEJRVUU3VVVGQlJTeHBRa0ZCYVVJc1dVRkJRU3hEUVVGRE8wRkJRM0JFTEZGQlFVa3NUMEZCVHl4SFFVRkhMRXRCUVVzc1QwRkJTU3hEUVVGRE96dEJRVVY0UWl4UlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVU3UVVGRGFrSXNkVUpCUVdsQ0xFZEJRVWNzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXpzN1FVRkZiRU1zVlVGQlNTeE5RVUZOTEVkQlFVY3NOa0pCUVZjc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzWkRMRmRCUVVzc1EwRkJReXhQUVVGUExFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0TFFVTm9RenM3UVVGRlJDeFJRVUZKTEV0QlFVc3NRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRZaXh0UWtGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNN08wRkJSVEZDTEZWQlFVa3NUVUZCVFN4SFFVRkhMRFpDUVVGWExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnVReXhYUVVGTExFTkJRVU1zUjBGQlJ5eEhRVUZITEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNN1MwRkROVUk3TzBGQlJVUXNVVUZCU1N4TFFVRkxMRTlCUVVrc1JVRkJSVHRCUVVOaUxHMUNRVUZoTEVkQlFVY3NTMEZCU3l4UFFVRkpMRU5CUVVNN08wRkJSVEZDTEZWQlFVa3NUVUZCVFN4SFFVRkhMRFpDUVVGWExFdEJRVXNzVDBGQlNTeERRVUZETEVOQlFVTTdRVUZEYmtNc1YwRkJTeXhQUVVGSkxFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0TFFVTTFRanM3UVVGRlJDeFJRVUZKTEU5QlFVOHNTVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJVU3hMUVVGTExFOUJRVThzUlVGQlJUdEJRVU16UXl4WFFVRkxMRTlCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzTmtKQlFXVXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wdEJRek5FT3pzN1FVRkhSQ3hSUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEV0QlFVc3NRMEZCUXl4RlFVRkZPMEZCUTNSQ0xGZEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRmxCUVZrc1EwRkJReXhMUVVGTExFOUJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWGhFTEZWQlFVa3NaMEpCUVdkQ0xFZEJRVWNzTUVKQlFWY3NZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU51UlN4VlFVRkpMR2RDUVVGblFpeEhRVUZITERCQ1FVRlhMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeExRVUZMTEVOQlFVTTdPMEZCUlc1RkxGVkJRVWtzWjBKQlFXZENMRU5CUVVNc1UwRkJVeXhEUVVGRExHZENRVUZuUWl4RlFVRkZPMEZCUXk5RExIZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzA5QlF6ZEVPenRCUVVWRUxGVkJRVWtzWjBKQlFXZENMRU5CUVVNc1UwRkJVeXhEUVVGRExHZENRVUZuUWl4RlFVRkZPMEZCUXk5RExIZENRVUZuUWl4RFFVRkRMRk5CUVZNc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGSkxFTkJRVU1zUTBGQlF6dFBRVU0zUkR0TFFVTkdPenM3VTBGSFNTeEpRVUZKTEV0QlFVc3NRMEZCUXl4TlFVRk5MRXRCUVVzc1EwRkJReXhGUVVGRk96dEJRVVV6UWl4WlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUExFbEJRVWtzUzBGQlN5eERRVUZETEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFVkJRVVU3UVVGRGFrUXNZMEZCU1N4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExITkNRVUZ6UWl4RlFVRkZMRU5CUVVNN08wRkJSV3BFTEdWQlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RlFVRkZMRVZCUVVVc1VVRkJVU3hGUVVGU0xGRkJRVkVzUlVGQlJTeERRVUZETEVOQlFVTTdRVUZEZGtRc1pVRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN08wRkJSWEJETEdsQ1FVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVWQlFVVXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dFRRVU14UkRzN08yRkJSMGtzU1VGQlNTeExRVUZMTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGSkxFVkJRVVU3UVVGRGFFTXNaMEpCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNSVUZCUlR0QlFVTjZRaXh2UWtGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl3MFEwRkJORU1zUjBGRE1VUXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dGhRVU55UWpzN08wRkJSMFFzWjBKQlFVa3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFdEJRVXNzVDBGQlR5eEZRVUZGTzBGQlEycERMRzFDUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRE8yRkJRM0JET3p0QlFVVkVMR2RDUVVGSkxHRkJRV0VzUjBGQlJ5d3dRa0ZCVnl4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZET3p0QlFVVm9SU3huUWtGQlNTeGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMR2RDUVVGblFpeEZRVUZGTzBGQlF6VkRMREpDUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1lVRkRNVVE3TzBGQlJVUXNhVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEZkQlFWY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJUVkRMR2RDUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzWkVMSGxDUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1dVRkJXU3hGUVVGRkxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMkZCUXpORU96dEJRVVZFTEd0RFFVRlRMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRPMWRCUTI1RU96czdaVUZIU1N4SlFVRkpMRXRCUVVzc1EwRkJReXhIUVVGSExFbEJRVWtzUzBGQlN5eFBRVUZKTEVWQlFVVTdRVUZETDBJc2EwSkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVONlFpeHpRa0ZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXcyUTBGQk5rTXNSMEZETTBRc1owSkJRV2RDTEVOQlFVTXNRMEZCUXp0bFFVTnlRanM3TzBGQlIwUXNiVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRTlCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPenM3UVVGSGNFVXNhMEpCUVVrc1RVRkJUU3hKUVVGSkxFMUJRVTBzUTBGQlF5eFJRVUZSTEVsQlFVa3NUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGRrUXNNa0pCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4WlFVRlpMRVZCUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdaVUZETTBRN096dEJRVWRFTEd0Q1FVRkpMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeEpRVUZKTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM1pFTERKQ1FVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUVN4UlFVRlJMRVZCUVVrN1FVRkRNVU1zZVVKQlFVOHNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFVkJRVVVzUzBGQlN5eFBRVUZKTEVOQlFVTXNRMEZCUXp0cFFrRkRka01zUTBGQlF5eERRVUZETEVOQlFVTTdaVUZEVERzN08wRkJSMFFzYTBKQlFVa3NTMEZCU3l4UFFVRkpMRU5CUVVNc1QwRkJUeXhMUVVGTExFOUJRVThzUlVGQlJUdEJRVU5xUXl4eFFrRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eGhRVUZoTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1QwRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNN1pVRkRia1U3TzBGQlJVUXNiVUpCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRTlCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhoRUxHdENRVUZKTEdkQ1FVRm5RaXhIUVVGSExEQkNRVUZYTEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRGJrVXNhMEpCUVVrc1owSkJRV2RDTEVkQlFVY3NNRUpCUVZjc1lVRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEV0QlFVc3NRMEZCUXpzN1FVRkZia1VzYTBKQlFVa3NaMEpCUVdkQ0xFTkJRVU1zVTBGQlV5eERRVUZETEdkQ1FVRm5RaXhGUVVGRk8wRkJReTlETEdkRFFVRm5RaXhEUVVGRExGTkJRVk1zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMlZCUXpkRU96dEJRVVZFTEd0Q1FVRkpMR2RDUVVGblFpeERRVUZETEZOQlFWTXNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU12UXl4blEwRkJaMElzUTBGQlF5eFRRVUZUTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NUMEZCU1N4RFFVRkRMRU5CUVVNN1pVRkROMFE3T3p0QlFVZEVMR3RDUVVGSkxFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4SlFVRkpMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzWkVMREJEUVVFd1FpeERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRPMlZCUXpORE96dEJRVVZFTEc5RFFVRlRMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRPMkZCUTI1RU8wOUJRMFk3T3p0WFFVZEpMRWxCUVVrc1MwRkJTeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVWQlFVVTdPMEZCUXpOQ0xHZENRVUZKTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN096dEJRVWQwUkN4blFrRkJTU3huUWtGQlowSXNSMEZCUnl4VFFVRnVRaXhuUWtGQlowSXNSMEZCWXpzN1FVRkZhRU1zYTBKQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wRkJRVVVzY1VKQlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0bFFVRkZPenR0UWtGRk0wUTdRVUZCUlN4MVFrRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdhVUpCUVVVN1lVRkRPVVFzUTBGQlF6czdPMEZCUjBZc1owSkJRVWtzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4blFrRkJaMElzU1VGQlNTeE5RVUZOTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzWkZMSGxDUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZCTEZGQlFWRXNSVUZCU1R0QlFVTnNSQ3h2UWtGQlNTeFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVVzUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUTNoRUxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZaaXh2UWtGQlNTeFBRVUZQTEVWQlFVVTdRVUZCUlN4NVFrRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8ybENRVUZGTEUxQlF6TkRPMEZCUVVVc2EwTkJRV2RDTEVWQlFVVXNRMEZCUXp0cFFrRkJSVHM3UVVGRk5VSXNkVUpCUVU4c1QwRkJUeXhEUVVGRE8yVkJRMmhDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMkZCUTB3c1RVRkRTVHRCUVVOSUxEaENRVUZuUWl4RlFVRkZMRU5CUVVNN1lVRkRjRUk3T3p0QlFVZEVMR2RDUVVGSkxHRkJRV0VzUjBGQlJ5d3dRa0ZCVnl4cFFrRkJhVUlzUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4TFFVRkxMRU5CUVVNN08wRkJSWEJGTEdkQ1FVRkpMR0ZCUVdFc1EwRkJReXgzUWtGQmQwSXNSVUZCUlR0QlFVTXhReXd5UWtGQllTeERRVUZETEZOQlFWTXNRMEZCUXl4M1FrRkJkMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1JVRkROMFFzUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzJGQlEzUkRPenRUUVVOR096czdZVUZIU1N4SlFVRkpMRXRCUVVzc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eEZRVUZGT3p0QlFVTXpRaXhyUWtGQlNTeGhRVUZoTEVkQlFVY3NTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVYzVReXhyUWtGQlNTeFhRVUZYTEVkQlFVY3NVMEZCWkN4WFFVRlhMRWRCUVdNN1FVRkRNMElzY1VKQlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhIUVVGSExEWkNRVUZsTEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRsUVVONlJDeERRVUZET3pzN1FVRkhSaXhyUWtGQlNTeE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMRmRCUVZjc1NVRkJTU3hOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTTNSQ3d5UWtGQlZ5eERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVUVzVVVGQlVTeEZRVUZKTzBGQlF6ZERMSE5DUVVGSkxFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFbEJRVWtzUzBGQlN5eERRVUZETEU5QlFVOHNSVUZET1VRc1lVRkJZU3hGUVVGRkxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZPVUlzYzBKQlFVa3NUMEZCVHl4RlFVRkZPMEZCUVVVc01rSkJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN2JVSkJRVVVzVFVGRGRFTTdRVUZCUlN3clFrRkJWeXhGUVVGRkxFTkJRVU03YlVKQlFVVTdPMEZCUlhaQ0xIbENRVUZQTEU5QlFVOHNRMEZCUXp0cFFrRkRhRUlzUTBGQlF5eERRVUZETEVOQlFVTTdaVUZEVEN4TlFVTkpPMEZCUTBnc2NVSkJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4SFFVRkhMRFpDUVVGbExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0bFFVTjZSRHM3VjBGRFJqczdPMEZCYmsxSUxFOUJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMVZCUVdoRExFTkJRVU03UjBGdlRWUTdPMEZCUlVRc1RVRkJTU3hqUVVGakxFZEJRVWNzVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3TzBGQlJ6bERMRTFCUVVrc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU42UWl4WFFVRlBMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRemxETzBOQlEwWWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZjR0YwWTJobGN5OXdjbTlqWlhOekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeUI5SUdaeWIyMGdKeTR1TDNSeVlXNXphWFJwYjI1ekp6dGNibWx0Y0c5eWRDQjdJSEJ2YjJ4eklIMGdabkp2YlNBbkxpNHZkWFJwYkM5d2IyOXNjeWM3WEc1cGJYQnZjblFnWkdWamIyUmxSVzUwYVhScFpYTWdabkp2YlNBbkxpNHZkWFJwYkM5a1pXTnZaR1VuTzF4dWFXMXdiM0owSUdkbGRFVnNaVzFsYm5RZ1puSnZiU0FuTGk0dlpXeGxiV1Z1ZEM5blpYUW5PMXh1YVcxd2IzSjBJSHNnWTI5dGNHOXVaVzUwY3lCOUlHWnliMjBnSnk0dUwyVnNaVzFsYm5RdlkzVnpkRzl0Snp0Y2JtbHRjRzl5ZENCdFlXdGxUbTlrWlNCbWNtOXRJQ2N1TGk5dWIyUmxMMjFoYTJVbk8xeHVYRzUyWVhJZ1ptOXlSV0ZqYUNBOUlFRnljbUY1TG5CeWIzUnZkSGx3WlM1bWIzSkZZV05vTzF4dWRtRnlJR1Z0Y0hSNUlEMGdleUJ3Y205MGIzUjVjR1U2SUh0OUlIMDdYRzVjYmk4cUtseHVJQ29nVUhKdlkyVnpjMlZ6SUdGdUlFRnljbUY1SUc5bUlIQmhkR05vWlhNdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUdWc1pXMWxiblFnTFNCRmJHVnRaVzUwSUhSdklIQnliMk5sYzNNZ2NHRjBZMmh6WlhSeklHOXVMbHh1SUNvZ1FIQmhjbUZ0SUdVZ0xTQlBZbXBsWTNRZ2RHaGhkQ0JqYjI1MFlXbHVjeUJ3WVhSamFHVnpMbHh1SUNvdlhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlCd2NtOWpaWE56S0dWc1pXMWxiblFzSUhCaGRHTm9aWE1wSUh0Y2JpQWdkbUZ5SUhOMFlYUmxjeUE5SUhSeVlXNXphWFJwYjI1VGRHRjBaWE03WEc0Z0lIWmhjaUJ3Y205dGFYTmxjeUE5SUZ0ZE8xeHVJQ0IyWVhJZ1lXUmtVSEp2YldselpYTWdQU0J3Y205dGFYTmxjeTV3ZFhOb0xtRndjR3g1TG1KcGJtUW9jSEp2YldselpYTXVjSFZ6YUN3Z2NISnZiV2x6WlhNcE8xeHVYRzRnSUM4dklGUnlhV2RuWlhJZ2RHaGxJR0YwZEdGamFHVmtJSFJ5WVc1emFYUnBiMjRnYzNSaGRHVWdabTl5SUhSb2FYTWdaV3hsYldWdWRDQmhibVFnWVd4c0lHTm9hV3hrVG05a1pYTXVYRzRnSUhaaGNpQmhkSFJoWTJobFpGUnlZVzV6YVhScGIyNUJibVJVYVhSc1pTQTlJR1oxYm1OMGFXOXVLR1ZzS1NCN1hHNGdJQ0FnZG1GeUlHVnNaVzFsYm5RZ1BTQm5aWFJGYkdWdFpXNTBLR1ZzS1M1bGJHVnRaVzUwTzF4dVhHNGdJQ0FnYVdZZ0tHVnNMbTV2WkdWT1lXMWxJRDA5UFNBbkkzUmxlSFFuSUh4OElHVnNMbTV2WkdWT1lXMWxJRDA5UFNBbmRHVjRkQ2NwSUh0Y2JpQWdJQ0FnSUM4dklGUnlhV2RuWlhJZ1lXeHNJSFJvWlNCMFpYaDBJR05vWVc1blpXUWdkbUZzZFdWekxseHVJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVkR1Y0ZEVOb1lXNW5aV1FnSmlZZ2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0xteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVkR1Y0ZEVOb1lXNW5aV1F1YldGd0tHTmhiR3hpWVdOcklEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWTJGc2JHSmhZMnNvWld4bGJXVnVkQzV3WVhKbGJuUk9iMlJsSUh4OElHVnNaVzFsYm5Rc0lHNTFiR3dzSUdWc0xtNXZaR1ZXWVd4MVpTazdYRzRnSUNBZ0lDQWdJSDBwS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdMeThnUVdSa1pXUWdjM1JoZEdVZ1ptOXlJSFJ5WVc1emFYUnBiMjV6SUVGUVNTNWNiaUFnSUNCbGJITmxJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG1GMGRHRmphR1ZrSUNZbUlITjBZWFJsY3k1aGRIUmhZMmhsWkM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUdGa1pGQnliMjFwYzJWektITjBZWFJsY3k1aGRIUmhZMmhsWkM1dFlYQW9ZMkZzYkVOaGJHeGlZV05yTENCbGJHVnRaVzUwS1NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1EyRnNiQ0JoYkd3Z1lHTm9hV3hrVG05a1pYTmdJR0YwZEdGamFHVmtJR05oYkd4aVlXTnJjeUJoY3lCM1pXeHNMbHh1SUNBZ0lHVnNMbU5vYVd4a1RtOWtaWE11Wm05eVJXRmphQ2hoZEhSaFkyaGxaRlJ5WVc1emFYUnBiMjVCYm1SVWFYUnNaU2s3WEc1Y2JpQWdJQ0IwYVhSc1pVTmhiR3hpWVdOcktHVnNLVHRjYmlBZ2ZUdGNibHh1SUNCMllYSWdZMkZzYkVOaGJHeGlZV05ySUQwZ1puVnVZM1JwYjI0b1kyRnNiR0poWTJzcElIdGNiaUFnSUNCeVpYUjFjbTRnWTJGc2JHSmhZMnNvZEdocGN5azdYRzRnSUgwN1hHNWNiaUFnZG1GeUlHRjBkR0ZqYUdWa1EyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaGxiR1Z0Wlc1MFJHVnpZM0pwY0hSdmNpa2dlMXh1SUNBZ0lHeGxkQ0JsYkNBOUlHZGxkRVZzWlcxbGJuUW9aV3hsYldWdWRFUmxjMk55YVhCMGIzSXBMbVZzWlcxbGJuUTdYRzRnSUNBZ2JHVjBJR1p5WVdkdFpXNTBJRDBnZEdocGN5NW1jbUZuYldWdWREdGNiaUFnSUNCc1pYUWdZM1Z6ZEc5dFJXeGxiV1Z1ZENBOUlHTnZiWEJ2Ym1WdWRITmJaV3hsYldWdWRFUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1WEc0Z0lDQWdhV1lnS0dOMWMzUnZiVVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxMbUYwZEdGamFHVmtRMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJR04xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtRjBkR0ZqYUdWa1EyRnNiR0poWTJzdVkyRnNiQ2hsYkNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHVnNMbTV2WkdWT1lXMWxJRDA5UFNBbkkzUmxlSFFuS1NCN1hHNGdJQ0FnSUNCbGJDNTBaWGgwUTI5dWRHVnVkQ0E5SUdSbFkyOWtaVVZ1ZEdsMGFXVnpLR1ZzTG5SbGVIUkRiMjUwWlc1MEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbWNtRm5iV1Z1ZEM1aGNIQmxibVJEYUdsc1pDaGxiQ2s3WEc0Z0lIMDdYRzVjYmlBZ2RtRnlJSFJwZEd4bFEyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaGxiR1Z0Wlc1MFJHVnpZM0pwY0hSdmNpa2dlMXh1SUNBZ0lHeGxkQ0JsYkNBOUlHZGxkRVZzWlcxbGJuUW9aV3hsYldWdWRFUmxjMk55YVhCMGIzSXBMbVZzWlcxbGJuUTdYRzVjYmlBZ0lDQXZMeUJGYm5OMWNtVWdkR2hsSUhScGRHeGxJR2x6SUhObGRDQmpiM0p5WldOMGJIa3VYRzRnSUNBZ2FXWWdLR1ZzTG5SaFowNWhiV1VnUFQwOUlDZDBhWFJzWlNjcElIdGNiaUFnSUNBZ0lHVnNMbTkzYm1WeVJHOWpkVzFsYm5RdWRHbDBiR1VnUFNCbGJDNWphR2xzWkU1dlpHVnpXekJkTG01dlpHVldZV3gxWlR0Y2JpQWdJQ0I5WEc0Z0lIMDdYRzVjYmlBZ0x5OGdURzl2Y0NCMGFISnZkV2RvSUdGc2JDQjBhR1VnY0dGMFkyaGxjeUJoYm1RZ1lYQndiSGtnZEdobGJTNWNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCd1lYUmphR1Z6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2JHVjBJSEJoZEdOb0lEMGdjR0YwWTJobGMxdHBYVHRjYmlBZ0lDQnNaWFFnYm1WM1JHVnpZM0pwY0hSdmNpd2diMnhrUkdWelkzSnBjSFJ2Y2l3Z1pXeGxiV1Z1ZEVSbGMyTnlhWEIwYjNJN1hHNGdJQ0FnYkdWMElHVnNaVzFsYm5RZ1BTQndZWFJqYUM1dVpYYzdYRzVjYmlBZ0lDQnBaaUFvY0dGMFkyZ3VaV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdaV3hsYldWdWRFUmxjMk55YVhCMGIzSWdQU0J3WVhSamFDNWxiR1Z0Wlc1ME8xeHVYRzRnSUNBZ0lDQnNaWFFnY21WemRXeDBJRDBnWjJWMFJXeGxiV1Z1ZENod1lYUmphQzVsYkdWdFpXNTBLVHRjYmlBZ0lDQWdJSEJoZEdOb0xtVnNaVzFsYm5RZ1BTQnlaWE4xYkhRdVpXeGxiV1Z1ZER0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2NHRjBZMmd1YjJ4a0tTQjdYRzRnSUNBZ0lDQnZiR1JFWlhOamNtbHdkRzl5SUQwZ2NHRjBZMmd1YjJ4a08xeHVYRzRnSUNBZ0lDQnNaWFFnY21WemRXeDBJRDBnWjJWMFJXeGxiV1Z1ZENod1lYUmphQzV2YkdRcE8xeHVJQ0FnSUNBZ2NHRjBZMmd1YjJ4a0lEMGdjbVZ6ZFd4MExtVnNaVzFsYm5RN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIQmhkR05vTG01bGR5a2dlMXh1SUNBZ0lDQWdibVYzUkdWelkzSnBjSFJ2Y2lBOUlIQmhkR05vTG01bGR6dGNibHh1SUNBZ0lDQWdiR1YwSUhKbGMzVnNkQ0E5SUdkbGRFVnNaVzFsYm5Rb2NHRjBZMmd1Ym1WM0tUdGNiaUFnSUNBZ0lIQmhkR05vTG01bGR5QTlJSEpsYzNWc2RDNWxiR1Z0Wlc1ME8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaGxiR1Z0Wlc1MElDWW1JR1ZzWlcxbGJuUXVibTlrWlU1aGJXVWdQVDA5SUNjamRHVjRkQ2NwSUh0Y2JpQWdJQ0FnSUhCaGRHTm9MbTVsZHk1MFpYaDBRMjl1ZEdWdWRDQTlJR1JsWTI5a1pVVnVkR2wwYVdWektHVnNaVzFsYm5RdWJtOWtaVlpoYkhWbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlNaWEJzWVdObElIUm9aU0JsYm5ScGNtVWdUbTlrWlM1Y2JpQWdJQ0JwWmlBb2NHRjBZMmd1WDE5a2IxOWZJRDA5UFNBd0tTQjdYRzRnSUNBZ0lDQndZWFJqYUM1dmJHUXVjR0Z5Wlc1MFRtOWtaUzV5WlhCc1lXTmxRMmhwYkdRb2NHRjBZMmd1Ym1WM0xDQndZWFJqYUM1dmJHUXBPMXh1WEc0Z0lDQWdJQ0JzWlhRZ2IyeGtRM1Z6ZEc5dFJXeGxiV1Z1ZENBOUlHTnZiWEJ2Ym1WdWRITmJiMnhrUkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlYwZ2ZId2daVzF3ZEhrN1hHNGdJQ0FnSUNCc1pYUWdibVYzUTNWemRHOXRSV3hsYldWdWRDQTlJR052YlhCdmJtVnVkSE5iYm1WM1JHVnpZM0pwY0hSdmNpNXViMlJsVG1GdFpWMGdmSHdnWlcxd2RIazdYRzVjYmlBZ0lDQWdJR2xtSUNodmJHUkRkWE4wYjIxRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlM1a1pYUmhZMmhsWkVOaGJHeGlZV05yS1NCN1hHNGdJQ0FnSUNBZ0lHOXNaRU4xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtUmxkR0ZqYUdWa1EyRnNiR0poWTJzdVkyRnNiQ2h3WVhSamFDNXZiR1FwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9ibVYzUTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVZWFIwWVdOb1pXUkRZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0J1WlhkRGRYTjBiMjFGYkdWdFpXNTBMbkJ5YjNSdmRIbHdaUzVoZEhSaFkyaGxaRU5oYkd4aVlXTnJMbU5oYkd3b2NHRjBZMmd1Ym1WM0tUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5Qk9iMlJsSUcxaGJtbHdMbHh1SUNBZ0lHVnNjMlVnYVdZZ0tIQmhkR05vTGw5ZlpHOWZYeUE5UFQwZ01Ta2dlMXh1SUNBZ0lDQWdMeThnUVdSa0xseHVJQ0FnSUNBZ2FXWWdLSEJoZEdOb0xtVnNaVzFsYm5RZ0ppWWdjR0YwWTJndVpuSmhaMjFsYm5RZ0ppWWdJWEJoZEdOb0xtOXNaQ2tnZTF4dUlDQWdJQ0FnSUNCc1pYUWdabkpoWjIxbGJuUWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkViMk4xYldWdWRFWnlZV2R0Wlc1MEtDazdYRzVjYmlBZ0lDQWdJQ0FnY0dGMFkyZ3VabkpoWjIxbGJuUXVabTl5UldGamFDaGhkSFJoWTJobFpFTmhiR3hpWVdOckxDQjdJR1p5WVdkdFpXNTBJSDBwTzF4dUlDQWdJQ0FnSUNCd1lYUmphQzVsYkdWdFpXNTBMbUZ3Y0dWdVpFTm9hV3hrS0daeVlXZHRaVzUwS1R0Y2JseHVJQ0FnSUNBZ0lDQm1iM0pGWVdOb0xtTmhiR3dvY0dGMFkyZ3VabkpoWjIxbGJuUXNJR0YwZEdGamFHVmtWSEpoYm5OcGRHbHZia0Z1WkZScGRHeGxLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1VtVnRiM1psTGx4dUlDQWdJQ0FnWld4elpTQnBaaUFvY0dGMFkyZ3ViMnhrSUNZbUlDRndZWFJqYUM1dVpYY3BJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tDRndZWFJqYUM1dmJHUXVjR0Z5Wlc1MFRtOWtaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblEyRnVYRnduZENCeVpXMXZkbVVnZDJsMGFHOTFkQ0J3WVhKbGJuUXNJR2x6SUhSb2FYTWdkR2hsSUNjZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSjJSdlkzVnRaVzUwSUhKdmIzUS9KeWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJGYm5OMWNtVWdkR2hsSUhScGRHeGxJR2x6SUdWdGNIUnBaV1F1WEc0Z0lDQWdJQ0FnSUdsbUlDaHdZWFJqYUM1dmJHUXVkR0ZuVG1GdFpTQTlQVDBnSjNScGRHeGxKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lIQmhkR05vTG05c1pDNXZkMjVsY2tSdlkzVnRaVzUwTG5ScGRHeGxJRDBnSnljN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JzWlhRZ1kzVnpkRzl0Uld4bGJXVnVkQ0E5SUdOdmJYQnZibVZ1ZEhOYmIyeGtSR1Z6WTNKcGNIUnZjaTV1YjJSbFRtRnRaVjBnZkh3Z1pXMXdkSGs3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLR04xYzNSdmJVVnNaVzFsYm5RdWNISnZkRzkwZVhCbExtUmxkR0ZqYUdWa1EyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lDQWdJQ0JqZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWtaWFJoWTJobFpFTmhiR3hpWVdOckxtTmhiR3dvY0dGMFkyZ3ViMnhrS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSEJoZEdOb0xtOXNaQzV3WVhKbGJuUk9iMlJsTG5KbGJXOTJaVU5vYVd4a0tIQmhkR05vTG05c1pDazdYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsY3lBbUppQnpkR0YwWlhNdVpHVjBZV05vWldRZ0ppWWdjM1JoZEdWekxtUmxkR0ZqYUdWa0xteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR0ZrWkZCeWIyMXBjMlZ6S0hOMFlYUmxjeTVrWlhSaFkyaGxaQzV0WVhBb1kyRnNiRU5oYkd4aVlXTnJMQ0J3WVhSamFDNXZiR1FwS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzFoYTJWT2IyUmxMbTV2WkdWelcyOXNaRVJsYzJOeWFYQjBiM0l1Wld4bGJXVnVkRjBnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRkpsY0d4aFkyVXVYRzRnSUNBZ0lDQmxiSE5sSUdsbUlDaHdZWFJqYUM1dmJHUWdKaVlnY0dGMFkyZ3VibVYzS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2doY0dGMFkyZ3ViMnhrTG5CaGNtVnVkRTV2WkdVcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KME5oYmx4Y0ozUWdjbVZ3YkdGalpTQjNhWFJvYjNWMElIQmhjbVZ1ZEN3Z2FYTWdkR2hwY3lCMGFHVWdKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5aRzlqZFcxbGJuUWdjbTl2ZEQ4bktUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklFRndjR1Z1WkNCMGFHVWdaV3hsYldWdWRDQm1hWEp6ZEN3Z1ltVm1iM0psSUdSdmFXNW5JSFJvWlNCeVpYQnNZV05sYldWdWRDNWNiaUFnSUNBZ0lDQWdjR0YwWTJndWIyeGtMbkJoY21WdWRFNXZaR1V1YVc1elpYSjBRbVZtYjNKbEtIQmhkR05vTG01bGR5d2djR0YwWTJndWIyeGtMbTVsZUhSVGFXSnNhVzVuS1R0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJTWlcxdmRtVmtJSE4wWVhSbElHWnZjaUIwY21GdWMybDBhVzl1Y3lCQlVFa3VYRzRnSUNBZ0lDQWdJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG1SbGRHRmphR1ZrSUNZbUlITjBZWFJsY3k1a1pYUmhZMmhsWkM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVaR1YwWVdOb1pXUXViV0Z3S0dOaGJHeERZV3hzWW1GamF5d2djR0YwWTJndWIyeGtLU2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJTWlhCc1lXTmxaQ0J6ZEdGMFpTQm1iM0lnZEhKaGJuTnBkR2x2Ym5NZ1FWQkpMbHh1SUNBZ0lDQWdJQ0JwWmlBb2MzUmhkR1Z6SUNZbUlITjBZWFJsY3k1eVpYQnNZV05sWkNBbUppQnpkR0YwWlhNdWNtVndiR0ZqWldRdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZV1JrVUhKdmJXbHpaWE1vYzNSaGRHVnpMbkpsY0d4aFkyVmtMbTFoY0NoallXeHNZbUZqYXlBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWTJGc2JHSmhZMnNvY0dGMFkyZ3ViMnhrTENCd1lYUmphQzV1WlhjcE8xeHVJQ0FnSUNBZ0lDQWdJSDBwS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVWdWMzVnlaU0IwYUdVZ2RHbDBiR1VnYVhNZ2MyVjBJR052Y25KbFkzUnNlUzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIQmhkR05vTG01bGR5NTBZV2RPWVcxbElEMDlQU0FuZEdsMGJHVW5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NHRjBZMmd1YjJ4a0xtOTNibVZ5Ukc5amRXMWxiblF1ZEdsMGJHVWdQU0J3WVhSamFDNXVaWGN1WTJocGJHUk9iMlJsYzFzd1hTNXViMlJsVm1Gc2RXVTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCd1lYUmphQzV2YkdRdWNHRnlaVzUwVG05a1pTNXlaWEJzWVdObFEyaHBiR1FvY0dGMFkyZ3VibVYzTENCd1lYUmphQzV2YkdRcE8xeHVYRzRnSUNBZ0lDQWdJR3hsZENCdmJHUkRkWE4wYjIxRmJHVnRaVzUwSUQwZ1kyOXRjRzl1Wlc1MGMxdHZiR1JFWlhOamNtbHdkRzl5TG01dlpHVk9ZVzFsWFNCOGZDQmxiWEIwZVR0Y2JpQWdJQ0FnSUNBZ2JHVjBJRzVsZDBOMWMzUnZiVVZzWlcxbGJuUWdQU0JqYjIxd2IyNWxiblJ6VzI1bGQwUmxjMk55YVhCMGIzSXVibTlrWlU1aGJXVmRJSHg4SUdWdGNIUjVPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHZiR1JEZFhOMGIyMUZiR1Z0Wlc1MExuQnliM1J2ZEhsd1pTNWtaWFJoWTJobFpFTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1EzVnpkRzl0Uld4bGJXVnVkQzV3Y205MGIzUjVjR1V1WkdWMFlXTm9aV1JEWVd4c1ltRmpheTVqWVd4c0tIQmhkR05vTG05c1pDazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCcFppQW9ibVYzUTNWemRHOXRSV3hsYldWdWRDNXdjbTkwYjNSNWNHVXVZWFIwWVdOb1pXUkRZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0FnSUc1bGQwTjFjM1J2YlVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsTG1GMGRHRmphR1ZrUTJGc2JHSmhZMnN1WTJGc2JDaHdZWFJqYUM1dVpYY3BPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRV1JrWldRZ2MzUmhkR1VnWm05eUlIUnlZVzV6YVhScGIyNXpJRUZRU1M1Y2JpQWdJQ0FnSUNBZ2FXWWdLSE4wWVhSbGN5QW1KaUJ6ZEdGMFpYTXVZWFIwWVdOb1pXUWdKaVlnYzNSaGRHVnpMbUYwZEdGamFHVmtMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUdGMGRHRmphR1ZrVkhKaGJuTnBkR2x2YmtGdVpGUnBkR3hsS0c1bGQwUmxjMk55YVhCMGIzSXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2JXRnJaVTV2WkdVdWJtOWtaWE5iYjJ4a1JHVnpZM0pwY0hSdmNpNWxiR1Z0Wlc1MFhTQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJCZEhSeWFXSjFkR1VnYldGdWFYQjFiR0YwYVc5dUxseHVJQ0FnSUdWc2MyVWdhV1lnS0hCaGRHTm9MbDlmWkc5Zlh5QTlQVDBnTWlrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzlzWkZaaGJIVmxJRDBnY0dGMFkyZ3VaV3hsYldWdWRDNW5aWFJCZEhSeWFXSjFkR1VvY0dGMFkyZ3VibUZ0WlNrN1hHNWNiaUFnSUNBZ0lDOHZJRU5vWVc1blpYTWdkR2hsSUdGMGRISnBZblYwWlNCdmJpQjBhR1VnWld4bGJXVnVkQzVjYmlBZ0lDQWdJR3hsZENCaGRXZHRaVzUwUVhSMGNtbGlkWFJsSUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUZKbGJXOTJaUzVjYmlBZ0lDQWdJQ0FnYVdZZ0tDRndZWFJqYUM1MllXeDFaU2tnZXlCd1lYUmphQzVsYkdWdFpXNTBMbkpsYlc5MlpVRjBkSEpwWW5WMFpTaHdZWFJqYUM1dVlXMWxLVHNnZlZ4dUlDQWdJQ0FnSUNBdkx5QkRhR0Z1WjJVdVhHNGdJQ0FnSUNBZ0lHVnNjMlVnZXlCd1lYUmphQzVsYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNod1lYUmphQzV1WVcxbExDQndZWFJqYUM1MllXeDFaU2s3SUgxY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDOHZJRlJ5YVdkblpYSWdZV3hzSUhSb1pTQmhkSFJ5YVdKMWRHVWdZMmhoYm1kbFpDQjJZV3gxWlhNdVhHNGdJQ0FnSUNCcFppQW9jM1JoZEdWeklDWW1JSE4wWVhSbGN5NWhkSFJ5YVdKMWRHVkRhR0Z1WjJWa0lDWW1JSE4wWVhSbGN5NWhkSFJ5YVdKMWRHVkRhR0Z1WjJWa0xteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQmhaR1JRY205dGFYTmxjeWh6ZEdGMFpYTXVZWFIwY21saWRYUmxRMmhoYm1kbFpDNXRZWEFvWTJGc2JHSmhZMnNnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSFpoY2lCd2NtOXRhWE5sSUQwZ1kyRnNiR0poWTJzb2NHRjBZMmd1Wld4bGJXVnVkQ3dnY0dGMFkyZ3VibUZ0WlN3Z2IyeGtWbUZzZFdVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0J3WVhSamFDNTJZV3gxWlNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2NISnZiV2x6WlNrZ2V5QndjbTl0YVhObExuUm9aVzRvWVhWbmJXVnVkRUYwZEhKcFluVjBaU2s3SUgxY2JpQWdJQ0FnSUNBZ0lDQmxiSE5sSUhzZ1lYVm5iV1Z1ZEVGMGRISnBZblYwWlNncE95QjlYRzVjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnY0hKdmJXbHpaVHRjYmlBZ0lDQWdJQ0FnZlNrcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUdGMVoyMWxiblJCZEhSeWFXSjFkR1VvS1R0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdWSEpwWjJkbGNpQmpkWE4wYjIwZ1pXeGxiV1Z1ZENCaGRIUnlhV0oxZEdWRGFHRnVaMlZrSUdWMlpXNTBjeTVjYmlBZ0lDQWdJR3hsZENCamRYTjBiMjFGYkdWdFpXNTBJRDBnWTI5dGNHOXVaVzUwYzF0bGJHVnRaVzUwUkdWelkzSnBjSFJ2Y2k1dWIyUmxUbUZ0WlYwZ2ZId2daVzF3ZEhrN1hHNWNiaUFnSUNBZ0lHbG1JQ2hqZFhOMGIyMUZiR1Z0Wlc1MExtRjBkSEpwWW5WMFpVTm9ZVzVuWldSRFlXeHNZbUZqYXlrZ2UxeHVJQ0FnSUNBZ0lDQmpkWE4wYjIxRmJHVnRaVzUwTG5CeWIzUnZkSGx3WlM1aGRIUnlhV0oxZEdWRGFHRnVaMlZrUTJGc2JHSmhZMnN1WTJGc2JDaHdZWFJqYUM1dmJHUXNYRzRnSUNBZ0lDQWdJQ0FnY0dGMFkyZ3VibUZ0WlN3Z2IyeGtWbUZzZFdVc0lIQmhkR05vTG5aaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJVWlhoMElHNXZaR1VnYldGdWFYQjFiR0YwYVc5dUxseHVJQ0FnSUdWc2MyVWdhV1lnS0hCaGRHTm9MbDlmWkc5Zlh5QTlQVDBnTXlrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzl5YVdkcGJtRnNWbUZzZFdVZ1BTQndZWFJqYUM1bGJHVnRaVzUwTG5SbGVIUkRiMjUwWlc1ME8xeHVYRzRnSUNBZ0lDQXZMeUJEYUdGdVoyVnpJSFJvWlNCMFpYaDBMbHh1SUNBZ0lDQWdiR1YwSUdGMVoyMWxiblJVWlhoMElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhCaGRHTm9MbVZzWlcxbGJuUXVkR1Y0ZEVOdmJuUmxiblFnUFNCa1pXTnZaR1ZGYm5ScGRHbGxjeWh3WVhSamFDNTJZV3gxWlNrN1hHNGdJQ0FnSUNCOU8xeHVYRzRnSUNBZ0lDQXZMeUJVY21sbloyVnlJR0ZzYkNCMGFHVWdkR1Y0ZENCamFHRnVaMlZrSUhaaGJIVmxjeTVjYmlBZ0lDQWdJR2xtSUNoemRHRjBaWE1nSmlZZ2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0lDWW1JSE4wWVhSbGN5NTBaWGgwUTJoaGJtZGxaQzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnWVdSa1VISnZiV2x6WlhNb2MzUmhkR1Z6TG5SbGVIUkRhR0Z1WjJWa0xtMWhjQ2hqWVd4c1ltRmpheUE5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhCeWIyMXBjMlVnUFNCallXeHNZbUZqYXlod1lYUmphQzVsYkdWdFpXNTBMbkJoY21WdWRFNXZaR1VnZkh3Z2NHRjBZMmd1Wld4bGJXVnVkQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHOXlhV2RwYm1Gc1ZtRnNkV1VzSUhCaGRHTm9MblpoYkhWbEtUdGNibHh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHdjbTl0YVhObEtTQjdJSEJ5YjIxcGMyVXVkR2hsYmloaGRXZHRaVzUwVkdWNGRDazdJSDFjYmlBZ0lDQWdJQ0FnSUNCbGJITmxJSHNnWVhWbmJXVnVkRlJsZUhRb0tUc2dmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhCeWIyMXBjMlU3WEc0Z0lDQWdJQ0FnSUgwcEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCd1lYUmphQzVsYkdWdFpXNTBMblJsZUhSRGIyNTBaVzUwSUQwZ1pHVmpiMlJsUlc1MGFYUnBaWE1vY0dGMFkyZ3VkbUZzZFdVcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIWmhjaUJoWTNScGRtVlFjbTl0YVhObGN5QTlJSEJ5YjIxcGMyVnpMbVpwYkhSbGNpaENiMjlzWldGdUtUdGNibHh1SUNBdkx5QlhZV2wwSUhWdWRHbHNJR0ZzYkNCMGNtRnVjMmwwYVc5dUlIQnliMjFwYzJWeklHaGhkbVVnY21WemIyeDJaV1F1WEc0Z0lHbG1JQ2hoWTNScGRtVlFjbTl0YVhObGN5NXNaVzVuZEdncElIdGNiaUFnSUNCeVpYUjFjbTRnVUhKdmJXbHpaUzVoYkd3b2NISnZiV2x6WlhNdVptbHNkR1Z5S0VKdmIyeGxZVzRwS1R0Y2JpQWdmVnh1ZlZ4dUlsMTkiLCIvLyBMaXN0IG9mIFNWRyBlbGVtZW50cy5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZWxlbWVudHMgPSBbJ2FsdEdseXBoJywgJ2FsdEdseXBoRGVmJywgJ2FsdEdseXBoSXRlbScsICdhbmltYXRlJywgJ2FuaW1hdGVDb2xvcicsICdhbmltYXRlTW90aW9uJywgJ2FuaW1hdGVUcmFuc2Zvcm0nLCAnY2lyY2xlJywgJ2NsaXBQYXRoJywgJ2NvbG9yLXByb2ZpbGUnLCAnY3Vyc29yJywgJ2RlZnMnLCAnZGVzYycsICdlbGxpcHNlJywgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJywgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLCAnZmVEaXNwbGFjZW1lbnRNYXAnLCAnZmVEaXN0YW50TGlnaHQnLCAnZmVGbG9vZCcsICdmZUZ1bmNBJywgJ2ZlRnVuY0InLCAnZmVGdW5jRycsICdmZUZ1bmNSJywgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZScsICdmZU1lcmdlTm9kZScsICdmZU1vcnBob2xvZ3knLCAnZmVPZmZzZXQnLCAnZmVQb2ludExpZ2h0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsICdmZVNwb3RMaWdodCcsICdmZVRpbGUnLCAnZmVUdXJidWxlbmNlJywgJ2ZpbHRlcicsICdmb250JywgJ2ZvbnQtZmFjZScsICdmb250LWZhY2UtZm9ybWF0JywgJ2ZvbnQtZmFjZS1uYW1lJywgJ2ZvbnQtZmFjZS1zcmMnLCAnZm9udC1mYWNlLXVyaScsICdmb3JlaWduT2JqZWN0JywgJ2cnLCAnZ2x5cGgnLCAnZ2x5cGhSZWYnLCAnaGtlcm4nLCAnaW1hZ2UnLCAnbGluZScsICdsaW5lYXJHcmFkaWVudCcsICdtYXJrZXInLCAnbWFzaycsICdtZXRhZGF0YScsICdtaXNzaW5nLWdseXBoJywgJ21wYXRoJywgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLCAnc2NyaXB0JywgJ3NldCcsICdzdG9wJywgJ3N0eWxlJywgJ3N2ZycsICdzd2l0Y2gnLCAnc3ltYm9sJywgJ3RleHQnLCAndGV4dFBhdGgnLCAndGl0bGUnLCAndHJlZicsICd0c3BhbicsICd1c2UnLCAndmlldycsICd2a2VybiddO1xuXG5leHBvcnRzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4vLyBOYW1lc3BhY2UuXG52YXIgbmFtZXNwYWNlID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbmV4cG9ydHMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzTjJaeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdRVUZEVHl4SlFVRkpMRkZCUVZFc1IwRkJSeXhEUVVOd1FpeFZRVUZWTEVWQlExWXNZVUZCWVN4RlFVTmlMR05CUVdNc1JVRkRaQ3hUUVVGVExFVkJRMVFzWTBGQll5eEZRVU5rTEdWQlFXVXNSVUZEWml4clFrRkJhMElzUlVGRGJFSXNVVUZCVVN4RlFVTlNMRlZCUVZVc1JVRkRWaXhsUVVGbExFVkJRMllzVVVGQlVTeEZRVU5TTEUxQlFVMHNSVUZEVGl4TlFVRk5MRVZCUTA0c1UwRkJVeXhGUVVOVUxGTkJRVk1zUlVGRFZDeGxRVUZsTEVWQlEyWXNjVUpCUVhGQ0xFVkJRM0pDTEdGQlFXRXNSVUZEWWl4clFrRkJhMElzUlVGRGJFSXNiVUpCUVcxQ0xFVkJRMjVDTEcxQ1FVRnRRaXhGUVVOdVFpeG5Ra0ZCWjBJc1JVRkRhRUlzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4VFFVRlRMRVZCUTFRc1UwRkJVeXhGUVVOVUxGTkJRVk1zUlVGRFZDeG5Ra0ZCWjBJc1JVRkRhRUlzVTBGQlV5eEZRVU5VTEZOQlFWTXNSVUZEVkN4aFFVRmhMRVZCUTJJc1kwRkJZeXhGUVVOa0xGVkJRVlVzUlVGRFZpeGpRVUZqTEVWQlEyUXNiMEpCUVc5Q0xFVkJRM0JDTEdGQlFXRXNSVUZEWWl4UlFVRlJMRVZCUTFJc1kwRkJZeXhGUVVOa0xGRkJRVkVzUlVGRFVpeE5RVUZOTEVWQlEwNHNWMEZCVnl4RlFVTllMR3RDUVVGclFpeEZRVU5zUWl4blFrRkJaMElzUlVGRGFFSXNaVUZCWlN4RlFVTm1MR1ZCUVdVc1JVRkRaaXhsUVVGbExFVkJRMllzUjBGQlJ5eEZRVU5JTEU5QlFVOHNSVUZEVUN4VlFVRlZMRVZCUTFZc1QwRkJUeXhGUVVOUUxFOUJRVThzUlVGRFVDeE5RVUZOTEVWQlEwNHNaMEpCUVdkQ0xFVkJRMmhDTEZGQlFWRXNSVUZEVWl4TlFVRk5MRVZCUTA0c1ZVRkJWU3hGUVVOV0xHVkJRV1VzUlVGRFppeFBRVUZQTEVWQlExQXNUVUZCVFN4RlFVTk9MRk5CUVZNc1JVRkRWQ3hUUVVGVExFVkJRMVFzVlVGQlZTeEZRVU5XTEdkQ1FVRm5RaXhGUVVOb1FpeE5RVUZOTEVWQlEwNHNVVUZCVVN4RlFVTlNMRXRCUVVzc1JVRkRUQ3hOUVVGTkxFVkJRMDRzVDBGQlR5eEZRVU5RTEV0QlFVc3NSVUZEVEN4UlFVRlJMRVZCUTFJc1VVRkJVU3hGUVVOU0xFMUJRVTBzUlVGRFRpeFZRVUZWTEVWQlExWXNUMEZCVHl4RlFVTlFMRTFCUVUwc1JVRkRUaXhQUVVGUExFVkJRMUFzUzBGQlN5eEZRVU5NTEUxQlFVMHNSVUZEVGl4UFFVRlBMRU5CUTFJc1EwRkJRenM3T3p0QlFVZExMRWxCUVVrc1UwRkJVeXhIUVVGSExEUkNRVUUwUWl4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM04yWnk1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUV4cGMzUWdiMllnVTFaSElHVnNaVzFsYm5SekxseHVaWGh3YjNKMElHeGxkQ0JsYkdWdFpXNTBjeUE5SUZ0Y2JpQWdKMkZzZEVkc2VYQm9KeXhjYmlBZ0oyRnNkRWRzZVhCb1JHVm1KeXhjYmlBZ0oyRnNkRWRzZVhCb1NYUmxiU2NzWEc0Z0lDZGhibWx0WVhSbEp5eGNiaUFnSjJGdWFXMWhkR1ZEYjJ4dmNpY3NYRzRnSUNkaGJtbHRZWFJsVFc5MGFXOXVKeXhjYmlBZ0oyRnVhVzFoZEdWVWNtRnVjMlp2Y20wbkxGeHVJQ0FuWTJseVkyeGxKeXhjYmlBZ0oyTnNhWEJRWVhSb0p5eGNiaUFnSjJOdmJHOXlMWEJ5YjJacGJHVW5MRnh1SUNBblkzVnljMjl5Snl4Y2JpQWdKMlJsWm5NbkxGeHVJQ0FuWkdWell5Y3NYRzRnSUNkbGJHeHBjSE5sSnl4Y2JpQWdKMlpsUW14bGJtUW5MRnh1SUNBblptVkRiMnh2Y2sxaGRISnBlQ2NzWEc0Z0lDZG1aVU52YlhCdmJtVnVkRlJ5WVc1elptVnlKeXhjYmlBZ0oyWmxRMjl0Y0c5emFYUmxKeXhjYmlBZ0oyWmxRMjl1ZG05c2RtVk5ZWFJ5YVhnbkxGeHVJQ0FuWm1WRWFXWm1kWE5sVEdsbmFIUnBibWNuTEZ4dUlDQW5abVZFYVhOd2JHRmpaVzFsYm5STllYQW5MRnh1SUNBblptVkVhWE4wWVc1MFRHbG5hSFFuTEZ4dUlDQW5abVZHYkc5dlpDY3NYRzRnSUNkbVpVWjFibU5CSnl4Y2JpQWdKMlpsUm5WdVkwSW5MRnh1SUNBblptVkdkVzVqUnljc1hHNGdJQ2RtWlVaMWJtTlNKeXhjYmlBZ0oyWmxSMkYxYzNOcFlXNUNiSFZ5Snl4Y2JpQWdKMlpsU1cxaFoyVW5MRnh1SUNBblptVk5aWEpuWlNjc1hHNGdJQ2RtWlUxbGNtZGxUbTlrWlNjc1hHNGdJQ2RtWlUxdmNuQm9iMnh2WjNrbkxGeHVJQ0FuWm1WUFptWnpaWFFuTEZ4dUlDQW5abVZRYjJsdWRFeHBaMmgwSnl4Y2JpQWdKMlpsVTNCbFkzVnNZWEpNYVdkb2RHbHVaeWNzWEc0Z0lDZG1aVk53YjNSTWFXZG9kQ2NzWEc0Z0lDZG1aVlJwYkdVbkxGeHVJQ0FuWm1WVWRYSmlkV3hsYm1ObEp5eGNiaUFnSjJacGJIUmxjaWNzWEc0Z0lDZG1iMjUwSnl4Y2JpQWdKMlp2Ym5RdFptRmpaU2NzWEc0Z0lDZG1iMjUwTFdaaFkyVXRabTl5YldGMEp5eGNiaUFnSjJadmJuUXRabUZqWlMxdVlXMWxKeXhjYmlBZ0oyWnZiblF0Wm1GalpTMXpjbU1uTEZ4dUlDQW5abTl1ZEMxbVlXTmxMWFZ5YVNjc1hHNGdJQ2RtYjNKbGFXZHVUMkpxWldOMEp5eGNiaUFnSjJjbkxGeHVJQ0FuWjJ4NWNHZ25MRnh1SUNBbloyeDVjR2hTWldZbkxGeHVJQ0FuYUd0bGNtNG5MRnh1SUNBbmFXMWhaMlVuTEZ4dUlDQW5iR2x1WlNjc1hHNGdJQ2RzYVc1bFlYSkhjbUZrYVdWdWRDY3NYRzRnSUNkdFlYSnJaWEluTEZ4dUlDQW5iV0Z6YXljc1hHNGdJQ2R0WlhSaFpHRjBZU2NzWEc0Z0lDZHRhWE56YVc1bkxXZHNlWEJvSnl4Y2JpQWdKMjF3WVhSb0p5eGNiaUFnSjNCaGRHZ25MRnh1SUNBbmNHRjBkR1Z5Ymljc1hHNGdJQ2R3YjJ4NVoyOXVKeXhjYmlBZ0ozQnZiSGxzYVc1bEp5eGNiaUFnSjNKaFpHbGhiRWR5WVdScFpXNTBKeXhjYmlBZ0ozSmxZM1FuTEZ4dUlDQW5jMk55YVhCMEp5eGNiaUFnSjNObGRDY3NYRzRnSUNkemRHOXdKeXhjYmlBZ0ozTjBlV3hsSnl4Y2JpQWdKM04yWnljc1hHNGdJQ2R6ZDJsMFkyZ25MRnh1SUNBbmMzbHRZbTlzSnl4Y2JpQWdKM1JsZUhRbkxGeHVJQ0FuZEdWNGRGQmhkR2duTEZ4dUlDQW5kR2wwYkdVbkxGeHVJQ0FuZEhKbFppY3NYRzRnSUNkMGMzQmhiaWNzWEc0Z0lDZDFjMlVuTEZ4dUlDQW5kbWxsZHljc1hHNGdJQ2QyYTJWeWJpY3NYRzVkTzF4dVhHNHZMeUJPWVcxbGMzQmhZMlV1WEc1bGVIQnZjblFnYkdWMElHNWhiV1Z6Y0dGalpTQTlJQ2RvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeWM3WEc0aVhYMD0iLCIvKipcbiAqIENvbnRhaW5zIGFycmF5cyB0byBzdG9yZSB0cmFuc2l0aW9uIGNhbGxiYWNrcy5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgdHJhbnNpdGlvblN0YXRlcyA9IHt9O1xuXG5leHBvcnRzLnRyYW5zaXRpb25TdGF0ZXMgPSB0cmFuc2l0aW9uU3RhdGVzO1xuLyoqXG4gKiBGb3Igd2hlbiBlbGVtZW50cyBjb21lIGludG8gdGhlIERPTS4gVGhlIGNhbGxiYWNrIHRyaWdnZXJzIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiB0aGUgZWxlbWVudCBlbnRlcnMgdGhlIERPTS4gSXQgaXMgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQgYXMgdGhlIG9ubHlcbiAqIGFyZ3VtZW50LlxuICovXG50cmFuc2l0aW9uU3RhdGVzLmF0dGFjaGVkID0gW107XG5cbi8qKlxuICogRm9yIHdoZW4gZWxlbWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnMganVzdFxuICogYmVmb3JlIHRoZSBlbGVtZW50IGxlYXZlcyB0aGUgRE9NLiBJdCBpcyBjYWxsZWQgd2l0aCB0aGUgZWxlbWVudCBhcyB0aGUgb25seVxuICogYXJndW1lbnQuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMuZGV0YWNoZWQgPSBbXTtcblxuLypcbiAqIEZvciB3aGVuIGVsZW1lbnRzIGFyZSByZXBsYWNlZCBpbiB0aGUgRE9NLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnMgYWZ0ZXIgdGhlXG4gKiBuZXcgZWxlbWVudCBlbnRlcnMgdGhlIERPTSwgYW5kIGJlZm9yZSB0aGUgb2xkIGVsZW1lbnQgbGVhdmVzLiBJdCBpcyBjYWxsZWRcbiAqIHdpdGggb2xkIGFuZCBuZXcgZWxlbWVudHMgYXMgYXJndW1lbnRzLCBpbiB0aGF0IG9yZGVyLlxuICovXG50cmFuc2l0aW9uU3RhdGVzLnJlcGxhY2VkID0gW107XG5cbi8qXG4gKiBUcmlnZ2VyZWQgd2hlbiBhbiBlbGVtZW50J3MgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLiBUaGUgY2FsbGJhY2sgdHJpZ2dlcnNcbiAqIGFmdGVyIHRoZSBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQgaW4gdGhlIERPTS4gSXQgaXMgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQsXG4gKiB0aGUgYXR0cmlidXRlIG5hbWUsIG9sZCB2YWx1ZSwgYW5kIGN1cnJlbnQgdmFsdWUuXG4gKi9cbnRyYW5zaXRpb25TdGF0ZXMuYXR0cmlidXRlQ2hhbmdlZCA9IFtdO1xuXG4vKlxuICogVHJpZ2dlcmVkIHdoZW4gYW4gZWxlbWVudCdzIGB0ZXh0Q29udGVudGAgY2huYWdlcy4gVGhlIGNhbGxiYWNrIHRyaWdnZXJzXG4gKiBhZnRlciB0aGUgdGV4dENvbnRlbnQgaGFzIGNoYW5nZWQgaW4gdGhlIERPTS4gSXQgaXMgY2FsbGVkIHdpdGggdGhlIGVsZW1lbnQsXG4gKiB0aGUgb2xkIHZhbHVlLCBhbmQgY3VycmVudCB2YWx1ZS5cbiAqL1xudHJhbnNpdGlvblN0YXRlcy50ZXh0Q2hhbmdlZCA9IFtdO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzUnlZVzV6YVhScGIyNXpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPMEZCUjA4c1NVRkJTU3huUWtGQlowSXNSMEZCUnl4RlFVRkZMRU5CUVVNN096czdPenM3TzBGQlQycERMR2RDUVVGblFpeERRVUZETEZGQlFWRXNSMEZCUnl4RlFVRkZMRU5CUVVNN096czdPenM3UVVGUEwwSXNaMEpCUVdkQ0xFTkJRVU1zVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXpzN096czdPenRCUVU4dlFpeG5Ra0ZCWjBJc1EwRkJReXhSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZET3pzN096czdPMEZCVHk5Q0xHZENRVUZuUWl4RFFVRkRMR2RDUVVGblFpeEhRVUZITEVWQlFVVXNRMEZCUXpzN096czdPenRCUVU5MlF5eG5Ra0ZCWjBJc1EwRkJReXhYUVVGWExFZEJRVWNzUlVGQlJTeERRVUZESWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNSeVlXNXphWFJwYjI1ekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJEYjI1MFlXbHVjeUJoY25KaGVYTWdkRzhnYzNSdmNtVWdkSEpoYm5OcGRHbHZiaUJqWVd4c1ltRmphM011WEc0Z0tpOWNibVY0Y0c5eWRDQnNaWFFnZEhKaGJuTnBkR2x2YmxOMFlYUmxjeUE5SUh0OU8xeHVYRzR2S2lwY2JpQXFJRVp2Y2lCM2FHVnVJR1ZzWlcxbGJuUnpJR052YldVZ2FXNTBieUIwYUdVZ1JFOU5MaUJVYUdVZ1kyRnNiR0poWTJzZ2RISnBaMmRsY25NZ2FXMXRaV1JwWVhSbGJIa2dZV1owWlhKY2JpQXFJSFJvWlNCbGJHVnRaVzUwSUdWdWRHVnljeUIwYUdVZ1JFOU5MaUJKZENCcGN5QmpZV3hzWldRZ2QybDBhQ0IwYUdVZ1pXeGxiV1Z1ZENCaGN5QjBhR1VnYjI1c2VWeHVJQ29nWVhKbmRXMWxiblF1WEc0Z0tpOWNiblJ5WVc1emFYUnBiMjVUZEdGMFpYTXVZWFIwWVdOb1pXUWdQU0JiWFR0Y2JseHVMeW9xWEc0Z0tpQkdiM0lnZDJobGJpQmxiR1Z0Wlc1MGN5QmhjbVVnY21WdGIzWmxaQ0JtY205dElIUm9aU0JFVDAwdUlGUm9aU0JqWVd4c1ltRmpheUIwY21sbloyVnljeUJxZFhOMFhHNGdLaUJpWldadmNtVWdkR2hsSUdWc1pXMWxiblFnYkdWaGRtVnpJSFJvWlNCRVQwMHVJRWwwSUdseklHTmhiR3hsWkNCM2FYUm9JSFJvWlNCbGJHVnRaVzUwSUdGeklIUm9aU0J2Ym14NVhHNGdLaUJoY21kMWJXVnVkQzVjYmlBcUwxeHVkSEpoYm5OcGRHbHZibE4wWVhSbGN5NWtaWFJoWTJobFpDQTlJRnRkTzF4dVhHNHZLbHh1SUNvZ1JtOXlJSGRvWlc0Z1pXeGxiV1Z1ZEhNZ1lYSmxJSEpsY0d4aFkyVmtJR2x1SUhSb1pTQkVUMDB1SUZSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWN5QmhablJsY2lCMGFHVmNiaUFxSUc1bGR5QmxiR1Z0Wlc1MElHVnVkR1Z5Y3lCMGFHVWdSRTlOTENCaGJtUWdZbVZtYjNKbElIUm9aU0J2YkdRZ1pXeGxiV1Z1ZENCc1pXRjJaWE11SUVsMElHbHpJR05oYkd4bFpGeHVJQ29nZDJsMGFDQnZiR1FnWVc1a0lHNWxkeUJsYkdWdFpXNTBjeUJoY3lCaGNtZDFiV1Z1ZEhNc0lHbHVJSFJvWVhRZ2IzSmtaWEl1WEc0Z0tpOWNiblJ5WVc1emFYUnBiMjVUZEdGMFpYTXVjbVZ3YkdGalpXUWdQU0JiWFR0Y2JseHVMeXBjYmlBcUlGUnlhV2RuWlhKbFpDQjNhR1Z1SUdGdUlHVnNaVzFsYm5RbmN5QmhkSFJ5YVdKMWRHVWdhR0Z6SUdOb1lXNW5aV1F1SUZSb1pTQmpZV3hzWW1GamF5QjBjbWxuWjJWeWMxeHVJQ29nWVdaMFpYSWdkR2hsSUdGMGRISnBZblYwWlNCb1lYTWdZMmhoYm1kbFpDQnBiaUIwYUdVZ1JFOU5MaUJKZENCcGN5QmpZV3hzWldRZ2QybDBhQ0IwYUdVZ1pXeGxiV1Z1ZEN4Y2JpQXFJSFJvWlNCaGRIUnlhV0oxZEdVZ2JtRnRaU3dnYjJ4a0lIWmhiSFZsTENCaGJtUWdZM1Z5Y21WdWRDQjJZV3gxWlM1Y2JpQXFMMXh1ZEhKaGJuTnBkR2x2YmxOMFlYUmxjeTVoZEhSeWFXSjFkR1ZEYUdGdVoyVmtJRDBnVzEwN1hHNWNiaThxWEc0Z0tpQlVjbWxuWjJWeVpXUWdkMmhsYmlCaGJpQmxiR1Z0Wlc1MEozTWdZSFJsZUhSRGIyNTBaVzUwWUNCamFHNWhaMlZ6TGlCVWFHVWdZMkZzYkdKaFkyc2dkSEpwWjJkbGNuTmNiaUFxSUdGbWRHVnlJSFJvWlNCMFpYaDBRMjl1ZEdWdWRDQm9ZWE1nWTJoaGJtZGxaQ0JwYmlCMGFHVWdSRTlOTGlCSmRDQnBjeUJqWVd4c1pXUWdkMmwwYUNCMGFHVWdaV3hsYldWdWRDeGNiaUFxSUhSb1pTQnZiR1FnZG1Gc2RXVXNJR0Z1WkNCamRYSnlaVzUwSUhaaGJIVmxMbHh1SUNvdlhHNTBjbUZ1YzJsMGFXOXVVM1JoZEdWekxuUmxlSFJEYUdGdVoyVmtJRDBnVzEwN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbi8qKlxuICogRGVjb2RlJ3MgSFRNTCBlbnRpdGllcy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzMDkxMjY2XG4gKiBAcGFyYW0gc3RyaW5naW5nXG4gKiBAcmV0dXJuIHVuZXNjYXBlZCBkZWNvZGVkIEhUTUxcbiAqL1xuZnVuY3Rpb24gZGVjb2RlRW50aXRpZXMoc3RyaW5nKSB7XG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gc3RyaW5nO1xuICByZXR1cm4gZWxlbWVudC50ZXh0Q29udGVudDtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gZGVjb2RlRW50aXRpZXM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dlpHVmpiMlJsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hQUVVGUExFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenM3T3pzN096czdPMEZCVXpWRExGTkJRVk1zWTBGQll5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTTVRaXhUUVVGUExFTkJRVU1zVTBGQlV5eEhRVUZITEUxQlFVMHNRMEZCUXp0QlFVTXpRaXhUUVVGUExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdRMEZETlVJN08zRkNRVVZqTEdOQlFXTWlMQ0ptYVd4bElqb2lMMmh2YldVdmRHbHRMMmRwZEM5a2FXWm1hSFJ0YkM5c2FXSXZkWFJwYkM5a1pXTnZaR1V1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnNaWFFnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcE8xeHVYRzR2S2lwY2JpQXFJRVJsWTI5a1pTZHpJRWhVVFV3Z1pXNTBhWFJwWlhNdVhHNGdLbHh1SUNvZ1FITmxaU0JvZEhSd09pOHZjM1JoWTJ0dmRtVnlabXh2ZHk1amIyMHZZUzh4TXpBNU1USTJObHh1SUNvZ1FIQmhjbUZ0SUhOMGNtbHVaMmx1WjF4dUlDb2dRSEpsZEhWeWJpQjFibVZ6WTJGd1pXUWdaR1ZqYjJSbFpDQklWRTFNWEc0Z0tpOWNibVoxYm1OMGFXOXVJR1JsWTI5a1pVVnVkR2wwYVdWektITjBjbWx1WnlrZ2UxeHVJQ0JsYkdWdFpXNTBMbWx1Ym1WeVNGUk5UQ0E5SUhOMGNtbHVaenRjYmlBZ2NtVjBkWEp1SUdWc1pXMWxiblF1ZEdWNGRFTnZiblJsYm5RN1hHNTlYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1JsWTI5a1pVVnVkR2wwYVdWek8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucHJvdGVjdEVsZW1lbnQgPSBwcm90ZWN0RWxlbWVudDtcbmV4cG9ydHMudW5wcm90ZWN0RWxlbWVudCA9IHVucHJvdGVjdEVsZW1lbnQ7XG5leHBvcnRzLmNsZWFuTWVtb3J5ID0gY2xlYW5NZW1vcnk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dGlsUG9vbHMgPSByZXF1aXJlKCcuLi91dGlsL3Bvb2xzJyk7XG5cbnZhciBfbm9kZU1ha2UgPSByZXF1aXJlKCcuLi9ub2RlL21ha2UnKTtcblxudmFyIF9ub2RlTWFrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ub2RlTWFrZSk7XG5cbnZhciBwb29scyA9IF91dGlsUG9vbHMucG9vbHM7XG52YXIgbWFrZU5vZGUgPSBfbm9kZU1ha2UyWydkZWZhdWx0J107XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IGFuIGVsZW1lbnQgaXMgbm90IHJlY3ljbGVkIGR1cmluZyBhIHJlbmRlciBjeWNsZS5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJldHVybiBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gcHJvdGVjdEVsZW1lbnQoZWxlbWVudCkge1xuICBwb29scy5lbGVtZW50T2JqZWN0LnByb3RlY3QoZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2gocHJvdGVjdEVsZW1lbnQpO1xuICBlbGVtZW50LmF0dHJpYnV0ZXMuZm9yRWFjaChwb29scy5hdHRyaWJ1dGVPYmplY3QucHJvdGVjdCwgcG9vbHMuYXR0cmlidXRlT2JqZWN0KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBBbGxvd3MgYW4gZWxlbWVudCB0byBiZSByZWN5Y2xlZCBkdXJpbmcgYSByZW5kZXIgY3ljbGUuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEByZXR1cm5cbiAqL1xuXG5mdW5jdGlvbiB1bnByb3RlY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2godW5wcm90ZWN0RWxlbWVudCk7XG4gIGVsZW1lbnQuYXR0cmlidXRlcy5mb3JFYWNoKHBvb2xzLmF0dHJpYnV0ZU9iamVjdC51bnByb3RlY3QsIHBvb2xzLmF0dHJpYnV0ZU9iamVjdCk7XG5cbiAgcG9vbHMuZWxlbWVudE9iamVjdC51bnByb3RlY3QoZWxlbWVudCk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbi8qKlxuICogUmVjeWNsZXMgYWxsIHVucHJvdGVjdGVkIGFsbG9jYXRpb25zLlxuICovXG5cbmZ1bmN0aW9uIGNsZWFuTWVtb3J5KCkge1xuICAvLyBGcmVlIGFsbCBtZW1vcnkgYWZ0ZXIgZWFjaCBpdGVyYXRpb24uXG4gIHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5mcmVlQWxsKCk7XG4gIHBvb2xzLmVsZW1lbnRPYmplY3QuZnJlZUFsbCgpO1xuXG4gIC8vIEVtcHR5IG91dCB0aGUgYG1ha2Uubm9kZXNgIGlmIG9uIG1haW4gdGhyZWFkLlxuICBpZiAodHlwZW9mIG1ha2VOb2RlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGZvciAodmFyIHV1aWQgaW4gbWFrZU5vZGUubm9kZXMpIHtcbiAgICAgIC8vIElmIHRoaXMgaXMgbm90IGEgcHJvdGVjdGVkIHV1aWQsIHJlbW92ZSBpdC5cbiAgICAgIGlmICghcG9vbHMuZWxlbWVudE9iamVjdC5fdXVpZFt1dWlkXSkge1xuICAgICAgICBkZWxldGUgbWFrZU5vZGUubm9kZXNbdXVpZF07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZiV1Z0YjNKNUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdPM2xDUVVGblF5eGxRVUZsT3p0M1FrRkRla0lzWTBGQll6czdPenRCUVVWd1F5eEpRVUZKTEV0QlFVc3NiVUpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEZGQlFWRXNkMEpCUVZrc1EwRkJRenM3T3pzN096czdPMEZCVVd4Q0xGTkJRVk1zWTBGQll5eERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTjBReXhQUVVGTExFTkJRVU1zWVVGQllTeERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRmNrTXNVMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETTBNc1UwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1EwRkJReXhQUVVGUExFVkJRM1JFTEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenM3UVVGRmVrSXNVMEZCVHl4UFFVRlBMRU5CUVVNN1EwRkRhRUk3T3pzN096czdPenRCUVZGTkxGTkJRVk1zWjBKQlFXZENMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRM2hETEZOQlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkROME1zVTBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eFRRVUZUTEVWQlEzaEVMRXRCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6czdRVUZGZWtJc1QwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSWFpETEZOQlFVOHNUMEZCVHl4RFFVRkRPME5CUTJoQ096czdPenM3UVVGTFRTeFRRVUZUTEZkQlFWY3NSMEZCUnpzN1FVRkZOVUlzVDBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenRCUVVOb1F5eFBRVUZMTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRE96czdRVUZIT1VJc1RVRkJTU3hQUVVGUExGRkJRVkVzUzBGQlN5eFhRVUZYTEVWQlFVVTdRVUZEYmtNc1UwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RlFVRkZPenRCUVVVdlFpeFZRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR0ZCUVdFc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdRVUZEY0VNc1pVRkJUeXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMDlCUXpkQ08wdEJRMFk3UjBGRFJqdERRVU5HSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZiV1Z0YjNKNUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnY0c5dmJITWdZWE1nWDNCdmIyeHpJSDBnWm5KdmJTQW5MaTR2ZFhScGJDOXdiMjlzY3ljN1hHNXBiWEJ2Y25RZ1gyMWhhMlZPYjJSbElHWnliMjBnSnk0dUwyNXZaR1V2YldGclpTYzdYRzVjYm5aaGNpQndiMjlzY3lBOUlGOXdiMjlzY3p0Y2JuWmhjaUJ0WVd0bFRtOWtaU0E5SUY5dFlXdGxUbTlrWlR0Y2JseHVMeW9xWEc0Z0tpQkZibk4xY21WeklIUm9ZWFFnWVc0Z1pXeGxiV1Z1ZENCcGN5QnViM1FnY21WamVXTnNaV1FnWkhWeWFXNW5JR0VnY21WdVpHVnlJR041WTJ4bExseHVJQ3BjYmlBcUlFQndZWEpoYlNCbGJHVnRaVzUwWEc0Z0tpQkFjbVYwZFhKdUlHVnNaVzFsYm5SY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSEJ5YjNSbFkzUkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcElIdGNiaUFnY0c5dmJITXVaV3hsYldWdWRFOWlhbVZqZEM1d2NtOTBaV04wS0dWc1pXMWxiblFwTzF4dVhHNGdJR1ZzWlcxbGJuUXVZMmhwYkdST2IyUmxjeTVtYjNKRllXTm9LSEJ5YjNSbFkzUkZiR1Z0Wlc1MEtUdGNiaUFnWld4bGJXVnVkQzVoZEhSeWFXSjFkR1Z6TG1admNrVmhZMmdvY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuQnliM1JsWTNRc1hHNGdJQ0FnY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMEtUdGNibHh1SUNCeVpYUjFjbTRnWld4bGJXVnVkRHRjYm4xY2JseHVMeW9xWEc0Z0tpQkJiR3h2ZDNNZ1lXNGdaV3hsYldWdWRDQjBieUJpWlNCeVpXTjVZMnhsWkNCa2RYSnBibWNnWVNCeVpXNWtaWElnWTNsamJHVXVYRzRnS2x4dUlDb2dRSEJoY21GdElHVnNaVzFsYm5SY2JpQXFJRUJ5WlhSMWNtNWNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhWdWNISnZkR1ZqZEVWc1pXMWxiblFvWld4bGJXVnVkQ2tnZTF4dUlDQmxiR1Z0Wlc1MExtTm9hV3hrVG05a1pYTXVabTl5UldGamFDaDFibkJ5YjNSbFkzUkZiR1Z0Wlc1MEtUdGNiaUFnWld4bGJXVnVkQzVoZEhSeWFXSjFkR1Z6TG1admNrVmhZMmdvY0c5dmJITXVZWFIwY21saWRYUmxUMkpxWldOMExuVnVjSEp2ZEdWamRDeGNiaUFnSUNCd2IyOXNjeTVoZEhSeWFXSjFkR1ZQWW1wbFkzUXBPMXh1WEc0Z0lIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVkVzV3Y205MFpXTjBLR1ZzWlcxbGJuUXBPMXh1WEc0Z0lISmxkSFZ5YmlCbGJHVnRaVzUwTzF4dWZWeHVYRzR2S2lwY2JpQXFJRkpsWTNsamJHVnpJR0ZzYkNCMWJuQnliM1JsWTNSbFpDQmhiR3h2WTJGMGFXOXVjeTVjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHTnNaV0Z1VFdWdGIzSjVLQ2tnZTF4dUlDQXZMeUJHY21WbElHRnNiQ0J0WlcxdmNua2dZV1owWlhJZ1pXRmphQ0JwZEdWeVlYUnBiMjR1WEc0Z0lIQnZiMnh6TG1GMGRISnBZblYwWlU5aWFtVmpkQzVtY21WbFFXeHNLQ2s3WEc0Z0lIQnZiMnh6TG1Wc1pXMWxiblJQWW1wbFkzUXVabkpsWlVGc2JDZ3BPMXh1WEc0Z0lDOHZJRVZ0Y0hSNUlHOTFkQ0IwYUdVZ1lHMWhhMlV1Ym05a1pYTmdJR2xtSUc5dUlHMWhhVzRnZEdoeVpXRmtMbHh1SUNCcFppQW9kSGx3Wlc5bUlHMWhhMlZPYjJSbElDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUdadmNpQW9iR1YwSUhWMWFXUWdhVzRnYldGclpVNXZaR1V1Ym05a1pYTXBJSHRjYmlBZ0lDQWdJQzh2SUVsbUlIUm9hWE1nYVhNZ2JtOTBJR0VnY0hKdmRHVmpkR1ZrSUhWMWFXUXNJSEpsYlc5MlpTQnBkQzVjYmlBZ0lDQWdJR2xtSUNnaGNHOXZiSE11Wld4bGJXVnVkRTlpYW1WamRDNWZkWFZwWkZ0MWRXbGtYU2tnZTF4dUlDQWdJQ0FnSUNCa1pXeGxkR1VnYldGclpVNXZaR1V1Ym05a1pYTmJkWFZwWkYwN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlYRzU5WEc0aVhYMD0iLCIvLyBDb2RlIGJhc2VkIG9mZiBvZjpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2hpMDA5L25vZGUtZmFzdC1odG1sLXBhcnNlclxuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5wYXJzZUhUTUwgPSBwYXJzZUhUTUw7XG5leHBvcnRzLm1ha2VQYXJzZXIgPSBtYWtlUGFyc2VyO1xuXG52YXIgX3Bvb2xzMiA9IHJlcXVpcmUoJy4vcG9vbHMnKTtcblxudmFyIHBvb2xzID0gX3Bvb2xzMi5wb29scztcbnZhciBwYXJzZXIgPSBtYWtlUGFyc2VyKCk7XG5cbi8qKlxuICogcGFyc2VIVE1MXG4gKlxuICogQHBhcmFtIG5ld0hUTUxcbiAqIEByZXR1cm5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhUTUwobmV3SFRNTCwgaXNJbm5lcikge1xuICB2YXIgZG9jdW1lbnRFbGVtZW50ID0gcGFyc2VyLnBhcnNlKG5ld0hUTUwpO1xuICB2YXIgbm9kZXMgPSBkb2N1bWVudEVsZW1lbnQuY2hpbGROb2RlcztcblxuICByZXR1cm4gaXNJbm5lciA/IG5vZGVzIDogbm9kZXNbMF07XG59XG5cbmZ1bmN0aW9uIG1ha2VQYXJzZXIoKSB7XG4gIHZhciBrTWFya3VwUGF0dGVybiA9IC88IS0tW15dKj8oPz0tLT4pLS0+fDwoXFwvPykoW2EtelxcLV1bYS16MC05XFwtXSopXFxzKihbXj5dKj8pKFxcLz8pPi9pZztcblxuICB2YXIga0F0dHJpYnV0ZVBhdHRlcm4gPSAvXFxiKGlkfGNsYXNzKVxccyo9XFxzKihcIihbXlwiXSspXCJ8JyhbXiddKyknfChcXFMrKSkvaWc7XG5cbiAgdmFyIHJlQXR0clBhdHRlcm4gPSAvXFxiKFthLXpdW2EtejAtOVxcLV0qKVxccyo9XFxzKihcIihbXlwiXSspXCJ8JyhbXiddKyknfChcXFMrKSkvaWc7XG5cbiAgdmFyIGtCbG9ja0VsZW1lbnRzID0ge1xuICAgIGRpdjogdHJ1ZSxcbiAgICBwOiB0cnVlLFxuICAgIGxpOiB0cnVlLFxuICAgIHRkOiB0cnVlLFxuICAgIHNlY3Rpb246IHRydWUsXG4gICAgYnI6IHRydWVcbiAgfTtcblxuICB2YXIga1NlbGZDbG9zaW5nRWxlbWVudHMgPSB7XG4gICAgbWV0YTogdHJ1ZSxcbiAgICBpbWc6IHRydWUsXG4gICAgbGluazogdHJ1ZSxcbiAgICBpbnB1dDogdHJ1ZSxcbiAgICBhcmVhOiB0cnVlLFxuICAgIGJyOiB0cnVlLFxuICAgIGhyOiB0cnVlXG4gIH07XG5cbiAgdmFyIGtFbGVtZW50c0Nsb3NlZEJ5T3BlbmluZyA9IHtcbiAgICBsaToge1xuICAgICAgbGk6IHRydWVcbiAgICB9LFxuXG4gICAgcDoge1xuICAgICAgcDogdHJ1ZSwgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHRkOiB7XG4gICAgICB0ZDogdHJ1ZSwgdGg6IHRydWVcbiAgICB9LFxuXG4gICAgdGg6IHtcbiAgICAgIHRkOiB0cnVlLCB0aDogdHJ1ZVxuICAgIH1cbiAgfTtcblxuICB2YXIga0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nID0ge1xuICAgIGxpOiB7XG4gICAgICB1bDogdHJ1ZSwgb2w6IHRydWVcbiAgICB9LFxuXG4gICAgYToge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIGI6IHtcbiAgICAgIGRpdjogdHJ1ZVxuICAgIH0sXG5cbiAgICBpOiB7XG4gICAgICBkaXY6IHRydWVcbiAgICB9LFxuXG4gICAgcDoge1xuICAgICAgZGl2OiB0cnVlXG4gICAgfSxcblxuICAgIHRkOiB7XG4gICAgICB0cjogdHJ1ZSwgdGFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgdGg6IHtcbiAgICAgIHRyOiB0cnVlLCB0YWJsZTogdHJ1ZVxuICAgIH1cbiAgfTtcblxuICB2YXIga0Jsb2NrVGV4dEVsZW1lbnRzID0ge1xuICAgIHNjcmlwdDogdHJ1ZSxcbiAgICBub3NjcmlwdDogdHJ1ZSxcbiAgICBzdHlsZTogdHJ1ZSxcbiAgICBwcmU6IHRydWVcbiAgfTtcblxuICAvKipcbiAgICogVGV4dE5vZGUgdG8gY29udGFpbiBhIHRleHQgZWxlbWVudCBpbiBET00gdHJlZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGZ1bmN0aW9uIFRleHROb2RlKHZhbHVlKSB7XG4gICAgdmFyIGluc3RhbmNlID0gcG9vbHMuZWxlbWVudE9iamVjdC5nZXQoKTtcblxuICAgIGluc3RhbmNlLm5vZGVOYW1lID0gJyN0ZXh0JztcbiAgICBpbnN0YW5jZS5ub2RlVmFsdWUgPSB2YWx1ZTtcbiAgICBpbnN0YW5jZS5ub2RlVHlwZSA9IDM7XG4gICAgaW5zdGFuY2UuY2hpbGROb2Rlcy5sZW5ndGggPSAwO1xuICAgIGluc3RhbmNlLmF0dHJpYnV0ZXMubGVuZ3RoID0gMDtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIVE1MRWxlbWVudCwgd2hpY2ggY29udGFpbnMgYSBzZXQgb2YgY2hpbGRyZW4uXG4gICAqXG4gICAqIE5vdGU6IHRoaXMgaXMgYSBtaW5pbWFsaXN0IGltcGxlbWVudGF0aW9uLCBubyBjb21wbGV0ZSB0cmVlIHN0cnVjdHVyZVxuICAgKiBwcm92aWRlZCAobm8gcGFyZW50Tm9kZSwgbmV4dFNpYmxpbmcsIHByZXZpb3VzU2libGluZyBldGMpLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgbm9kZU5hbWVcbiAgICogQHBhcmFtIHtPYmplY3R9IGtleUF0dHJzIGlkIGFuZCBjbGFzcyBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHJhd0F0dHJzIGF0dHJpYnV0ZXMgaW4gc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiBIVE1MRWxlbWVudChuYW1lLCBrZXlBdHRycywgcmF3QXR0cnMpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBwb29scy5lbGVtZW50T2JqZWN0LmdldCgpO1xuXG4gICAgaW5zdGFuY2Uubm9kZU5hbWUgPSBuYW1lO1xuICAgIGluc3RhbmNlLm5vZGVWYWx1ZSA9ICcnO1xuICAgIGluc3RhbmNlLm5vZGVUeXBlID0gMTtcbiAgICBpbnN0YW5jZS5jaGlsZE5vZGVzLmxlbmd0aCA9IDA7XG4gICAgaW5zdGFuY2UuYXR0cmlidXRlcy5sZW5ndGggPSAwO1xuXG4gICAgaWYgKHJhd0F0dHJzKSB7XG4gICAgICBmb3IgKHZhciBtYXRjaCA9IHVuZGVmaW5lZDsgbWF0Y2ggPSByZUF0dHJQYXR0ZXJuLmV4ZWMocmF3QXR0cnMpOykge1xuICAgICAgICB2YXIgYXR0ciA9IHBvb2xzLmF0dHJpYnV0ZU9iamVjdC5nZXQoKTtcblxuICAgICAgICBhdHRyLm5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgYXR0ci52YWx1ZSA9IG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdO1xuXG4gICAgICAgIGluc3RhbmNlLmF0dHJpYnV0ZXNbaW5zdGFuY2UuYXR0cmlidXRlcy5sZW5ndGhdID0gYXR0cjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIEhUTUwgYW5kIHJldHVybnMgYSByb290IGVsZW1lbnRcbiAgICovXG4gIHZhciBodG1sUGFyc2VyID0ge1xuICAgIC8qKlxuICAgICAqIFBhcnNlIGEgY2h1Y2sgb2YgSFRNTCBzb3VyY2UuXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBkYXRhICAgICAgaHRtbFxuICAgICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgIHJvb3QgZWxlbWVudFxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbiBwYXJzZShkYXRhLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcm9vdE9iamVjdCA9IHt9O1xuICAgICAgdmFyIHJvb3QgPSBIVE1MRWxlbWVudChudWxsLCByb290T2JqZWN0KTtcbiAgICAgIHZhciBjdXJyZW50UGFyZW50ID0gcm9vdDtcbiAgICAgIHZhciBzdGFjayA9IFtyb290XTtcbiAgICAgIHZhciBsYXN0VGV4dFBvcyA9IC0xO1xuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaWYgKGRhdGEuaW5kZXhPZignPCcpID09PSAtMSAmJiBkYXRhKSB7XG4gICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoXSA9IFRleHROb2RlKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiByb290O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBtYXRjaCA9IHVuZGVmaW5lZCwgdGV4dCA9IHVuZGVmaW5lZDsgbWF0Y2ggPSBrTWFya3VwUGF0dGVybi5leGVjKGRhdGEpOykge1xuICAgICAgICBpZiAobGFzdFRleHRQb3MgPiAtMSkge1xuICAgICAgICAgIGlmIChsYXN0VGV4dFBvcyArIG1hdGNoWzBdLmxlbmd0aCA8IGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCkge1xuICAgICAgICAgICAgLy8gaWYgaGFzIGNvbnRlbnRcbiAgICAgICAgICAgIHRleHQgPSBkYXRhLnNsaWNlKGxhc3RUZXh0UG9zLCBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXggLSBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZiAodGV4dC50cmltKCkpIHtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZE5vZGVzW2N1cnJlbnRQYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGhdID0gVGV4dE5vZGUodGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXg7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBhIGNvbW1lbnQuXG4gICAgICAgIGlmIChtYXRjaFswXVsxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5sb3dlckNhc2VUYWdOYW1lKSB7XG4gICAgICAgICAgbWF0Y2hbMl0gPSBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXRjaFsxXSkge1xuICAgICAgICAgIC8vIG5vdCA8LyB0YWdzXG4gICAgICAgICAgdmFyIGF0dHJzID0ge307XG5cbiAgICAgICAgICBmb3IgKHZhciBhdHRNYXRjaCA9IHVuZGVmaW5lZDsgYXR0TWF0Y2ggPSBrQXR0cmlidXRlUGF0dGVybi5leGVjKG1hdGNoWzNdKTspIHtcbiAgICAgICAgICAgIGF0dHJzW2F0dE1hdGNoWzFdXSA9IGF0dE1hdGNoWzNdIHx8IGF0dE1hdGNoWzRdIHx8IGF0dE1hdGNoWzVdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbWF0Y2hbNF0gJiYga0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdKSB7XG4gICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlPcGVuaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50LmNoaWxkTm9kZXNbY3VycmVudFBhcmVudC5jaGlsZE5vZGVzLnB1c2goSFRNTEVsZW1lbnQobWF0Y2hbMl0sIGF0dHJzLCBtYXRjaFszXSkpIC0gMV07XG5cbiAgICAgICAgICBzdGFjay5wdXNoKGN1cnJlbnRQYXJlbnQpO1xuXG4gICAgICAgICAgaWYgKGtCbG9ja1RleHRFbGVtZW50c1ttYXRjaFsyXV0pIHtcbiAgICAgICAgICAgIC8vIGEgbGl0dGxlIHRlc3QgdG8gZmluZCBuZXh0IDwvc2NyaXB0PiBvciA8L3N0eWxlPiAuLi5cbiAgICAgICAgICAgIHZhciBjbG9zZU1hcmt1cCA9ICc8LycgKyBtYXRjaFsyXSArICc+JztcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGRhdGEuaW5kZXhPZihjbG9zZU1hcmt1cCwga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnNbbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIHRoZXJlIGlzIG5vIG1hdGNoaW5nIGVuZGluZyBmb3IgdGhlIHRleHQgZWxlbWVudC5cbiAgICAgICAgICAgICAgICB0ZXh0ID0gZGF0YS5zbGljZShrTWFya3VwUGF0dGVybi5sYXN0SW5kZXgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRleHQgPSBkYXRhLnNsaWNlKGtNYXJrdXBQYXR0ZXJuLmxhc3RJbmRleCwgaW5kZXgpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGROb2Rlc1tjdXJyZW50UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoXSA9IFRleHROb2RlKHRleHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgbGFzdFRleHRQb3MgPSBrTWFya3VwUGF0dGVybi5sYXN0SW5kZXggPSBkYXRhLmxlbmd0aCArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50Lm5vZGVWYWx1ZSA9IGRhdGEuc2xpY2Uoa01hcmt1cFBhdHRlcm4ubGFzdEluZGV4LCBpbmRleCk7XG4gICAgICAgICAgICAgIGxhc3RUZXh0UG9zID0ga01hcmt1cFBhdHRlcm4ubGFzdEluZGV4ID0gaW5kZXggKyBjbG9zZU1hcmt1cC5sZW5ndGg7XG4gICAgICAgICAgICAgIG1hdGNoWzFdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzFdIHx8IG1hdGNoWzRdIHx8IGtTZWxmQ2xvc2luZ0VsZW1lbnRzW21hdGNoWzJdXSkge1xuICAgICAgICAgIC8vIDwvIG9yIC8+IG9yIDxicj4gZXRjLlxuICAgICAgICAgIHdoaWxlICh0cnVlICYmIGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFyZW50Lm5vZGVOYW1lID09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBUcnlpbmcgdG8gY2xvc2UgY3VycmVudCB0YWcsIGFuZCBtb3ZlIG9uXG4gICAgICAgICAgICAgIGlmIChrRWxlbWVudHNDbG9zZWRCeUNsb3NpbmdbY3VycmVudFBhcmVudC5ub2RlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoa0VsZW1lbnRzQ2xvc2VkQnlDbG9zaW5nW2N1cnJlbnRQYXJlbnQubm9kZU5hbWVdW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFVzZSBhZ2dyZXNzaXZlIHN0cmF0ZWd5IHRvIGhhbmRsZSB1bm1hdGNoaW5nIG1hcmt1cHMuXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGh0bWxQYXJzZXI7XG59XG5cbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM1YwYVd3dmNHRnljMlZ5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN08zTkNRVWRuUXl4VFFVRlRPenRCUVVWNlF5eEpRVUZKTEV0QlFVc3NaMEpCUVZNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEUxQlFVMHNSMEZCUnl4VlFVRlZMRVZCUVVVc1EwRkJRenM3T3pzN096czdPMEZCVVc1Q0xGTkJRVk1zVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRNVU1zVFVGQlNTeGxRVUZsTEVkQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU0xUXl4TlFVRkpMRXRCUVVzc1IwRkJSeXhsUVVGbExFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVjJReXhUUVVGUExFOUJRVThzUjBGQlJ5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wTkJRMjVET3p0QlFVVk5MRk5CUVZNc1ZVRkJWU3hIUVVGSE8wRkJRek5DTEUxQlFVa3NZMEZCWXl4SFFVTm9RaXh0UlVGQmJVVXNRMEZCUXpzN1FVRkZkRVVzVFVGQlNTeHBRa0ZCYVVJc1IwRkJSeXhyUkVGQmEwUXNRMEZCUXpzN1FVRkZNMFVzVFVGQlNTeGhRVUZoTEVkQlEyWXNNRVJCUVRCRUxFTkJRVU03TzBGQlJUZEVMRTFCUVVrc1kwRkJZeXhIUVVGSE8wRkJRMjVDTEU5QlFVY3NSVUZCUlN4SlFVRkpPMEZCUTFRc1MwRkJReXhGUVVGRkxFbEJRVWs3UVVGRFVDeE5RVUZGTEVWQlFVVXNTVUZCU1R0QlFVTlNMRTFCUVVVc1JVRkJSU3hKUVVGSk8wRkJRMUlzVjBGQlR5eEZRVUZGTEVsQlFVazdRVUZEWWl4TlFVRkZMRVZCUVVVc1NVRkJTVHRIUVVOVUxFTkJRVU03TzBGQlJVWXNUVUZCU1N4dlFrRkJiMElzUjBGQlJ6dEJRVU42UWl4UlFVRkpMRVZCUVVVc1NVRkJTVHRCUVVOV0xFOUJRVWNzUlVGQlJTeEpRVUZKTzBGQlExUXNVVUZCU1N4RlFVRkZMRWxCUVVrN1FVRkRWaXhUUVVGTExFVkJRVVVzU1VGQlNUdEJRVU5ZTEZGQlFVa3NSVUZCUlN4SlFVRkpPMEZCUTFZc1RVRkJSU3hGUVVGRkxFbEJRVWs3UVVGRFVpeE5RVUZGTEVWQlFVVXNTVUZCU1R0SFFVTlVMRU5CUVVNN08wRkJSVVlzVFVGQlNTeDNRa0ZCZDBJc1IwRkJSenRCUVVNM1FpeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTVHRMUVVOVU96dEJRVVZFTEV0QlFVTXNSVUZCUlR0QlFVTkVMRTlCUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEVsQlFVazdTMEZEYmtJN08wRkJSVVFzVFVGQlJTeEZRVUZGTzBGQlEwWXNVVUZCUlN4RlFVRkZMRWxCUVVrc1JVRkJSU3hGUVVGRkxFVkJRVVVzU1VGQlNUdExRVU51UWpzN1FVRkZSQ3hOUVVGRkxFVkJRVVU3UVVGRFJpeFJRVUZGTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUVVVc1JVRkJSU3hKUVVGSk8wdEJRMjVDTzBkQlEwWXNRMEZCUXpzN1FVRkZSaXhOUVVGSkxIZENRVUYzUWl4SFFVRkhPMEZCUXpkQ0xFMUJRVVVzUlVGQlJUdEJRVU5HTEZGQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1JVRkJSU3hGUVVGRkxFbEJRVWs3UzBGRGJrSTdPMEZCUlVRc1MwRkJReXhGUVVGRk8wRkJRMFFzVTBGQlJ5eEZRVUZGTEVsQlFVazdTMEZEVmpzN1FVRkZSQ3hMUVVGRExFVkJRVVU3UVVGRFJDeFRRVUZITEVWQlFVVXNTVUZCU1R0TFFVTldPenRCUVVWRUxFdEJRVU1zUlVGQlJUdEJRVU5FTEZOQlFVY3NSVUZCUlN4SlFVRkpPMHRCUTFZN08wRkJSVVFzUzBGQlF5eEZRVUZGTzBGQlEwUXNVMEZCUnl4RlFVRkZMRWxCUVVrN1MwRkRWanM3UVVGRlJDeE5RVUZGTEVWQlFVVTdRVUZEUml4UlFVRkZMRVZCUVVVc1NVRkJTU3hGUVVGRkxFdEJRVXNzUlVGQlJTeEpRVUZKTzB0QlEzUkNPenRCUVVWRUxFMUJRVVVzUlVGQlJUdEJRVU5HTEZGQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc1MwRkJTeXhGUVVGRkxFbEJRVWs3UzBGRGRFSTdSMEZEUml4RFFVRkRPenRCUVVWR0xFMUJRVWtzYTBKQlFXdENMRWRCUVVjN1FVRkRka0lzVlVGQlRTeEZRVUZGTEVsQlFVazdRVUZEV2l4WlFVRlJMRVZCUVVVc1NVRkJTVHRCUVVOa0xGTkJRVXNzUlVGQlJTeEpRVUZKTzBGQlExZ3NUMEZCUnl4RlFVRkZMRWxCUVVrN1IwRkRWaXhEUVVGRE96czdPenM3UVVGTlJpeFhRVUZUTEZGQlFWRXNRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRka0lzVVVGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMR0ZCUVdFc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6czdRVUZGZWtNc1dVRkJVU3hEUVVGRExGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTTdRVUZETlVJc1dVRkJVU3hEUVVGRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZETTBJc1dVRkJVU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEZEVJc1dVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXk5Q0xGbEJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenM3UVVGRkwwSXNWMEZCVHl4UlFVRlJMRU5CUVVNN1IwRkRha0k3T3pzN096czdPenM3T3p0QlFWbEVMRmRCUVZNc1YwRkJWeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RlFVRkZPMEZCUXpkRExGRkJRVWtzVVVGQlVTeEhRVUZITEV0QlFVc3NRMEZCUXl4aFFVRmhMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYcERMRmxCUVZFc1EwRkJReXhSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzcENMRmxCUVZFc1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzaENMRmxCUVZFc1EwRkJReXhSUVVGUkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzUkNMRmxCUVZFc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhaUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSUzlDTEZGQlFVa3NVVUZCVVN4RlFVRkZPMEZCUTFvc1YwRkJTeXhKUVVGSkxFdEJRVXNzV1VGQlFTeEZRVUZGTEV0QlFVc3NSMEZCUnl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZKTzBGQlEzUkVMRmxCUVVrc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNN08wRkJSWFpETEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkNMRmxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGxETEdkQ1FVRlJMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wOUJRM2hFTzB0QlEwWTdPMEZCUlVRc1YwRkJUeXhSUVVGUkxFTkJRVU03UjBGRGFrSTdPenM3TzBGQlMwUXNUVUZCU1N4VlFVRlZMRWRCUVVjN096czdPenRCUVUxbUxGTkJRVXNzUlVGQlJTeGxRVUZUTEVsQlFVa3NSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkROMElzVlVGQlNTeFZRVUZWTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNCQ0xGVkJRVWtzU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGVrTXNWVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM3BDTEZWQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGJrSXNWVUZCU1N4WFFVRlhMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYSkNMR0ZCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZET3p0QlFVVjRRaXhWUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzU1VGQlNTeEZRVUZGTzBGQlEzQkRMSEZDUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEdGQlFXRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVVelJTeGxRVUZQTEVsQlFVa3NRMEZCUXp0UFFVTmlPenRCUVVWRUxGZEJRVXNzU1VGQlNTeExRVUZMTEZsQlFVRXNSVUZCUlN4SlFVRkpMRmxCUVVFc1JVRkJSU3hMUVVGTExFZEJRVWNzWTBGQll5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJTVHRCUVVONlJDeFpRVUZKTEZkQlFWY3NSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVOd1FpeGpRVUZKTEZkQlFWY3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEdOQlFXTXNRMEZCUXl4VFFVRlRMRVZCUVVVN08wRkJSVFZFTEdkQ1FVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVWQlFVVXNZMEZCWXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN08wRkJSVE5GTEdkQ1FVRkpMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJUdEJRVU5tTERKQ1FVRmhMRU5CUVVNc1ZVRkJWU3hEUVVGRExHRkJRV0VzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJGQlF6VkZPMWRCUTBZN1UwRkRSanM3UVVGRlJDeHRRa0ZCVnl4SFFVRkhMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU03T3p0QlFVZDJReXhaUVVGSkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhIUVVGSExFVkJRVVU3UVVGRGRrSXNiVUpCUVZNN1UwRkRWanM3UVVGRlJDeFpRVUZKTEU5QlFVOHNRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU0xUWl4bFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8xTkJRMjVET3p0QlFVVkVMRmxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdPMEZCUldJc1kwRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZET3p0QlFVVm1MR1ZCUVVzc1NVRkJTU3hSUVVGUkxGbEJRVUVzUlVGQlJTeFJRVUZSTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSk8wRkJRMmhGTEdsQ1FVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VjBGRGFFVTdPMEZCUlVRc1kwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4M1FrRkJkMElzUTBGQlF5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVN1FVRkRha1VzWjBKQlFVa3NkMEpCUVhkQ0xFTkJRVU1zWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlF6bEVMRzFDUVVGTExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEV2l3eVFrRkJZU3hIUVVGSExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRM3BETzFkQlEwWTdPMEZCUlVRc2RVSkJRV0VzUjBGQlJ5eGhRVUZoTEVOQlFVTXNWVUZCVlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVU5zUlN4WFFVRlhMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWcVJDeGxRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4alFVRkpMR3RDUVVGclFpeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk96dEJRVVZvUXl4blFrRkJTU3hYUVVGWExFZEJRVWNzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU03UVVGRGVFTXNaMEpCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RlFVRkZMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6czdRVUZGYUVVc1owSkJRVWtzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRM0pDTEd0Q1FVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExFTkJRVU1zUlVGQlJUczdRVUZGWml4dlFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8yVkJRemRETEUxQlEwazdRVUZEU0N4dlFrRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNZMEZCWXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dGxRVU53UkRzN1FVRkZSQ3hyUWtGQlNTeEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVOdVFpdzJRa0ZCWVN4RFFVRkRMRlZCUVZVc1EwRkJReXhoUVVGaExFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dGxRVU0xUlR0aFFVTkdPMEZCUTBRc1owSkJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTJZc2VVSkJRVmNzUjBGQlJ5eGpRVUZqTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzJGQlF6RkVMRTFCUTBrN1FVRkRTQ3d5UWtGQllTeERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHTkJRV01zUTBGQlF5eFRRVUZUTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRkRVVzZVVKQlFWY3NSMEZCUnl4alFVRmpMRU5CUVVNc1UwRkJVeXhIUVVGSExFdEJRVXNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNCRkxHMUNRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8yRkJSV3BDTzFkQlEwWTdVMEZEUmp0QlFVTkVMRmxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3h2UWtGQmIwSXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUczdRVUZGTVVRc2FVSkJRVThzU1VGQlNTeEpRVUZKTEdGQlFXRXNSVUZCUlR0QlFVTTFRaXhuUWtGQlNTeGhRVUZoTEVOQlFVTXNVVUZCVVN4SlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUdEJRVU4wUXl4dFFrRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlExb3NNa0pCUVdFc1IwRkJSeXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmVFTXNiMEpCUVUwN1lVRkRVQ3hOUVVOSk96dEJRVVZJTEd0Q1FVRkpMSGRDUVVGM1FpeERRVUZETEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJSVHRCUVVOd1JDeHZRa0ZCU1N4M1FrRkJkMElzUTBGQlF5eGhRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdRVUZET1VRc2RVSkJRVXNzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTmFMQ3RDUVVGaExFZEJRVWNzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYaERMREpDUVVGVE8ybENRVU5XTzJWQlEwWTdPenRCUVVkRUxHOUNRVUZOTzJGQlExQTdWMEZEUmp0VFFVTkdPMDlCUTBZN08wRkJSVVFzWVVGQlR5eEpRVUZKTEVOQlFVTTdTMEZEWWp0SFFVTkdMRU5CUVVNN08wRkJSVVlzVTBGQlR5eFZRVUZWTEVOQlFVTTdRMEZEYmtJN08wRkJRVUVzUTBGQlF5SXNJbVpwYkdVaU9pSXZhRzl0WlM5MGFXMHZaMmwwTDJScFptWm9kRzFzTDJ4cFlpOTFkR2xzTDNCaGNuTmxjaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRU52WkdVZ1ltRnpaV1FnYjJabUlHOW1PbHh1THk4Z2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwyRnphR2t3TURrdmJtOWtaUzFtWVhOMExXaDBiV3d0Y0dGeWMyVnlYRzVjYm1sdGNHOXlkQ0I3SUhCdmIyeHpJR0Z6SUY5d2IyOXNjeUI5SUdaeWIyMGdKeTR2Y0c5dmJITW5PMXh1WEc1MllYSWdjRzl2YkhNZ1BTQmZjRzl2YkhNN1hHNTJZWElnY0dGeWMyVnlJRDBnYldGclpWQmhjbk5sY2lncE8xeHVYRzR2S2lwY2JpQXFJSEJoY25ObFNGUk5URnh1SUNwY2JpQXFJRUJ3WVhKaGJTQnVaWGRJVkUxTVhHNGdLaUJBY21WMGRYSnVYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCd1lYSnpaVWhVVFV3b2JtVjNTRlJOVEN3Z2FYTkpibTVsY2lrZ2UxeHVJQ0JzWlhRZ1pHOWpkVzFsYm5SRmJHVnRaVzUwSUQwZ2NHRnljMlZ5TG5CaGNuTmxLRzVsZDBoVVRVd3BPMXh1SUNCc1pYUWdibTlrWlhNZ1BTQmtiMk4xYldWdWRFVnNaVzFsYm5RdVkyaHBiR1JPYjJSbGN6dGNibHh1SUNCeVpYUjFjbTRnYVhOSmJtNWxjaUEvSUc1dlpHVnpJRG9nYm05a1pYTmJNRjA3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnRZV3RsVUdGeWMyVnlLQ2tnZTF4dUlDQnNaWFFnYTAxaGNtdDFjRkJoZEhSbGNtNGdQVnh1SUNBZ0lDODhJUzB0VzE1ZEtqOG9QejB0TFQ0cExTMCtmRHdvWEZ3dlB5a29XMkV0ZWx4Y0xWMWJZUzE2TUMwNVhGd3RYU29wWEZ4ektpaGJYajVkS2o4cEtGeGNMejhwUGk5cFp6dGNibHh1SUNCc1pYUWdhMEYwZEhKcFluVjBaVkJoZEhSbGNtNGdQU0F2WEZ4aUtHbGtmR05zWVhOektWeGNjeW85WEZ4ektpaGNJaWhiWGx3aVhTc3BYQ0o4SnloYlhpZGRLeWtuZkNoY1hGTXJLU2t2YVdjN1hHNWNiaUFnYkdWMElISmxRWFIwY2xCaGRIUmxjbTRnUFZ4dUlDQWdJQzljWEdJb1cyRXRlbDFiWVMxNk1DMDVYRnd0WFNvcFhGeHpLajFjWEhNcUtGd2lLRnRlWENKZEt5bGNJbnduS0Z0ZUoxMHJLU2Q4S0Z4Y1V5c3BLUzlwWnp0Y2JseHVJQ0JzWlhRZ2EwSnNiMk5yUld4bGJXVnVkSE1nUFNCN1hHNGdJQ0FnWkdsMk9pQjBjblZsTEZ4dUlDQWdJSEE2SUhSeWRXVXNYRzRnSUNBZ2JHazZJSFJ5ZFdVc1hHNGdJQ0FnZEdRNklIUnlkV1VzWEc0Z0lDQWdjMlZqZEdsdmJqb2dkSEoxWlN4Y2JpQWdJQ0JpY2pvZ2RISjFaVnh1SUNCOU8xeHVYRzRnSUd4bGRDQnJVMlZzWmtOc2IzTnBibWRGYkdWdFpXNTBjeUE5SUh0Y2JpQWdJQ0J0WlhSaE9pQjBjblZsTEZ4dUlDQWdJR2x0WnpvZ2RISjFaU3hjYmlBZ0lDQnNhVzVyT2lCMGNuVmxMRnh1SUNBZ0lHbHVjSFYwT2lCMGNuVmxMRnh1SUNBZ0lHRnlaV0U2SUhSeWRXVXNYRzRnSUNBZ1luSTZJSFJ5ZFdVc1hHNGdJQ0FnYUhJNklIUnlkV1ZjYmlBZ2ZUdGNibHh1SUNCc1pYUWdhMFZzWlcxbGJuUnpRMnh2YzJWa1FubFBjR1Z1YVc1bklEMGdlMXh1SUNBZ0lHeHBPaUI3WEc0Z0lDQWdJQ0JzYVRvZ2RISjFaVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQndPaUI3WEc0Z0lDQWdJQ0J3T2lCMGNuVmxMQ0JrYVhZNklIUnlkV1ZjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdkR1E2SUh0Y2JpQWdJQ0FnSUhSa09pQjBjblZsTENCMGFEb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0IwYURvZ2UxeHVJQ0FnSUNBZ2RHUTZJSFJ5ZFdVc0lIUm9PaUIwY25WbFhHNGdJQ0FnZlZ4dUlDQjlPMXh1WEc0Z0lHeGxkQ0JyUld4bGJXVnVkSE5EYkc5elpXUkNlVU5zYjNOcGJtY2dQU0I3WEc0Z0lDQWdiR2s2SUh0Y2JpQWdJQ0FnSUhWc09pQjBjblZsTENCdmJEb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0JoT2lCN1hHNGdJQ0FnSUNCa2FYWTZJSFJ5ZFdWY2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnWWpvZ2UxeHVJQ0FnSUNBZ1pHbDJPaUIwY25WbFhHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdrNklIdGNiaUFnSUNBZ0lHUnBkam9nZEhKMVpWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCd09pQjdYRzRnSUNBZ0lDQmthWFk2SUhSeWRXVmNiaUFnSUNCOUxGeHVYRzRnSUNBZ2RHUTZJSHRjYmlBZ0lDQWdJSFJ5T2lCMGNuVmxMQ0IwWVdKc1pUb2dkSEoxWlZ4dUlDQWdJSDBzWEc1Y2JpQWdJQ0IwYURvZ2UxeHVJQ0FnSUNBZ2RISTZJSFJ5ZFdVc0lIUmhZbXhsT2lCMGNuVmxYRzRnSUNBZ2ZWeHVJQ0I5TzF4dVhHNGdJR3hsZENCclFteHZZMnRVWlhoMFJXeGxiV1Z1ZEhNZ1BTQjdYRzRnSUNBZ2MyTnlhWEIwT2lCMGNuVmxMRnh1SUNBZ0lHNXZjMk55YVhCME9pQjBjblZsTEZ4dUlDQWdJSE4wZVd4bE9pQjBjblZsTEZ4dUlDQWdJSEJ5WlRvZ2RISjFaVnh1SUNCOU8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCVVpYaDBUbTlrWlNCMGJ5QmpiMjUwWVdsdUlHRWdkR1Y0ZENCbGJHVnRaVzUwSUdsdUlFUlBUU0IwY21WbExseHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnZG1Gc2RXVWdXMlJsYzJOeWFYQjBhVzl1WFZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1ZHVjRkRTV2WkdVb2RtRnNkV1VwSUh0Y2JpQWdJQ0JzWlhRZ2FXNXpkR0Z1WTJVZ1BTQndiMjlzY3k1bGJHVnRaVzUwVDJKcVpXTjBMbWRsZENncE8xeHVYRzRnSUNBZ2FXNXpkR0Z1WTJVdWJtOWtaVTVoYldVZ1BTQW5JM1JsZUhRbk8xeHVJQ0FnSUdsdWMzUmhibU5sTG01dlpHVldZV3gxWlNBOUlIWmhiSFZsTzF4dUlDQWdJR2x1YzNSaGJtTmxMbTV2WkdWVWVYQmxJRDBnTXp0Y2JpQWdJQ0JwYm5OMFlXNWpaUzVqYUdsc1pFNXZaR1Z6TG14bGJtZDBhQ0E5SURBN1hHNGdJQ0FnYVc1emRHRnVZMlV1WVhSMGNtbGlkWFJsY3k1c1pXNW5kR2dnUFNBd08xeHVYRzRnSUNBZ2NtVjBkWEp1SUdsdWMzUmhibU5sTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFaFVUVXhGYkdWdFpXNTBMQ0IzYUdsamFDQmpiMjUwWVdsdWN5QmhJSE5sZENCdlppQmphR2xzWkhKbGJpNWNiaUFnSUNwY2JpQWdJQ29nVG05MFpUb2dkR2hwY3lCcGN5QmhJRzFwYm1sdFlXeHBjM1FnYVcxd2JHVnRaVzUwWVhScGIyNHNJRzV2SUdOdmJYQnNaWFJsSUhSeVpXVWdjM1J5ZFdOMGRYSmxYRzRnSUNBcUlIQnliM1pwWkdWa0lDaHVieUJ3WVhKbGJuUk9iMlJsTENCdVpYaDBVMmxpYkdsdVp5d2djSEpsZG1sdmRYTlRhV0pzYVc1bklHVjBZeWt1WEc0Z0lDQXFYRzRnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCdVlXMWxJQ0FnSUNCdWIyUmxUbUZ0WlZ4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdhMlY1UVhSMGNuTWdhV1FnWVc1a0lHTnNZWE56SUdGMGRISnBZblYwWlZ4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdjbUYzUVhSMGNuTWdZWFIwY21saWRYUmxjeUJwYmlCemRISnBibWRjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUVoVVRVeEZiR1Z0Wlc1MEtHNWhiV1VzSUd0bGVVRjBkSEp6TENCeVlYZEJkSFJ5Y3lrZ2UxeHVJQ0FnSUd4bGRDQnBibk4wWVc1alpTQTlJSEJ2YjJ4ekxtVnNaVzFsYm5SUFltcGxZM1F1WjJWMEtDazdYRzVjYmlBZ0lDQnBibk4wWVc1alpTNXViMlJsVG1GdFpTQTlJRzVoYldVN1hHNGdJQ0FnYVc1emRHRnVZMlV1Ym05a1pWWmhiSFZsSUQwZ0p5YzdYRzRnSUNBZ2FXNXpkR0Z1WTJVdWJtOWtaVlI1Y0dVZ1BTQXhPMXh1SUNBZ0lHbHVjM1JoYm1ObExtTm9hV3hrVG05a1pYTXViR1Z1WjNSb0lEMGdNRHRjYmlBZ0lDQnBibk4wWVc1alpTNWhkSFJ5YVdKMWRHVnpMbXhsYm1kMGFDQTlJREE3WEc1Y2JpQWdJQ0JwWmlBb2NtRjNRWFIwY25NcElIdGNiaUFnSUNBZ0lHWnZjaUFvYkdWMElHMWhkR05vT3lCdFlYUmphQ0E5SUhKbFFYUjBjbEJoZEhSbGNtNHVaWGhsWXloeVlYZEJkSFJ5Y3lrN0lDa2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ1lYUjBjaUE5SUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDNW5aWFFvS1R0Y2JseHVJQ0FnSUNBZ0lDQmhkSFJ5TG01aGJXVWdQU0J0WVhSamFGc3hYVHRjYmlBZ0lDQWdJQ0FnWVhSMGNpNTJZV3gxWlNBOUlHMWhkR05vV3pOZElIeDhJRzFoZEdOb1d6UmRJSHg4SUcxaGRHTm9XelZkTzF4dVhHNGdJQ0FnSUNBZ0lHbHVjM1JoYm1ObExtRjBkSEpwWW5WMFpYTmJhVzV6ZEdGdVkyVXVZWFIwY21saWRYUmxjeTVzWlc1bmRHaGRJRDBnWVhSMGNqdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnYVc1emRHRnVZMlU3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1VHRnljMlZ6SUVoVVRVd2dZVzVrSUhKbGRIVnlibk1nWVNCeWIyOTBJR1ZzWlcxbGJuUmNiaUFnSUNvdlhHNGdJR3hsZENCb2RHMXNVR0Z5YzJWeUlEMGdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkJoY25ObElHRWdZMmgxWTJzZ2IyWWdTRlJOVENCemIzVnlZMlV1WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3YzNSeWFXNW5mU0JrWVhSaElDQWdJQ0FnYUhSdGJGeHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UwaFVUVXhGYkdWdFpXNTBmU0FnSUNBZ0lISnZiM1FnWld4bGJXVnVkRnh1SUNBZ0lDQXFMMXh1SUNBZ0lIQmhjbk5sT2lCbWRXNWpkR2x2Ymloa1lYUmhMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0JzWlhRZ2NtOXZkRTlpYW1WamRDQTlJSHQ5TzF4dUlDQWdJQ0FnYkdWMElISnZiM1FnUFNCSVZFMU1SV3hsYldWdWRDaHVkV3hzTENCeWIyOTBUMkpxWldOMEtUdGNiaUFnSUNBZ0lHeGxkQ0JqZFhKeVpXNTBVR0Z5Wlc1MElEMGdjbTl2ZER0Y2JpQWdJQ0FnSUd4bGRDQnpkR0ZqYXlBOUlGdHliMjkwWFR0Y2JpQWdJQ0FnSUd4bGRDQnNZWE4wVkdWNGRGQnZjeUE5SUMweE8xeHVYRzRnSUNBZ0lDQnZjSFJwYjI1eklEMGdiM0IwYVc5dWN5QjhmQ0I3ZlR0Y2JseHVJQ0FnSUNBZ2FXWWdLR1JoZEdFdWFXNWtaWGhQWmlnblBDY3BJRDA5UFNBdE1TQW1KaUJrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJR04xY25KbGJuUlFZWEpsYm5RdVkyaHBiR1JPYjJSbGMxdGpkWEp5Wlc1MFVHRnlaVzUwTG1Ob2FXeGtUbTlrWlhNdWJHVnVaM1JvWFNBOUlGUmxlSFJPYjJSbEtHUmhkR0VwTzF4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCeWIyOTBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JtYjNJZ0tHeGxkQ0J0WVhSamFDd2dkR1Y0ZERzZ2JXRjBZMmdnUFNCclRXRnlhM1Z3VUdGMGRHVnliaTVsZUdWaktHUmhkR0VwT3lBcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0d4aGMzUlVaWGgwVUc5eklENGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYkdGemRGUmxlSFJRYjNNZ0t5QnRZWFJqYUZzd1hTNXNaVzVuZEdnZ1BDQnJUV0Z5YTNWd1VHRjBkR1Z5Ymk1c1lYTjBTVzVrWlhncElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklHbG1JR2hoY3lCamIyNTBaVzUwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBaWGgwSUQwZ1pHRjBZUzV6YkdsalpTaHNZWE4wVkdWNGRGQnZjeXdnYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRJQzBnYldGMFkyaGJNRjB1YkdWdVozUm9LVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSbGVIUXVkSEpwYlNncEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHTjFjbkpsYm5SUVlYSmxiblF1WTJocGJHUk9iMlJsYzF0amRYSnlaVzUwVUdGeVpXNTBMbU5vYVd4a1RtOWtaWE11YkdWdVozUm9YU0E5SUZSbGVIUk9iMlJsS0hSbGVIUXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHeGhjM1JVWlhoMFVHOXpJRDBnYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRPMXh1WEc0Z0lDQWdJQ0FnSUM4dklGUm9hWE1nYVhNZ1lTQmpiMjF0Wlc1MExseHVJQ0FnSUNBZ0lDQnBaaUFvYldGMFkyaGJNRjFiTVYwZ1BUMDlJQ2NoSnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5ScGJuVmxPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTXViRzkzWlhKRFlYTmxWR0ZuVG1GdFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUcxaGRHTm9XekpkSUQwZ2JXRjBZMmhiTWwwdWRHOU1iM2RsY2tOaGMyVW9LVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doYldGMFkyaGJNVjBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQXZMeUJ1YjNRZ1BDOGdkR0ZuYzF4dUlDQWdJQ0FnSUNBZ0lHeGxkQ0JoZEhSeWN5QTlJSHQ5TzF4dVhHNGdJQ0FnSUNBZ0lDQWdabTl5SUNoc1pYUWdZWFIwVFdGMFkyZzdJR0YwZEUxaGRHTm9JRDBnYTBGMGRISnBZblYwWlZCaGRIUmxjbTR1WlhobFl5aHRZWFJqYUZzelhTazdJQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZWFIwY25OYllYUjBUV0YwWTJoYk1WMWRJRDBnWVhSMFRXRjBZMmhiTTEwZ2ZId2dZWFIwVFdGMFkyaGJORjBnZkh3Z1lYUjBUV0YwWTJoYk5WMDdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0NGdFlYUmphRnMwWFNBbUppQnJSV3hsYldWdWRITkRiRzl6WldSQ2VVOXdaVzVwYm1kYlkzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFRtRnRaVjBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoclJXeGxiV1Z1ZEhORGJHOXpaV1JDZVU5d1pXNXBibWRiWTNWeWNtVnVkRkJoY21WdWRDNXViMlJsVG1GdFpWMWJiV0YwWTJoYk1sMWRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSE4wWVdOckxuQnZjQ2dwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JqZFhKeVpXNTBVR0Z5Wlc1MElEMGdjM1JoWTJ0YmMzUmhZMnN1YkdWdVozUm9JQzBnTVYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnWTNWeWNtVnVkRkJoY21WdWRDQTlJR04xY25KbGJuUlFZWEpsYm5RdVkyaHBiR1JPYjJSbGMxdGpkWEp5Wlc1MFVHRnlaVzUwTG1Ob2FXeGtUbTlrWlhNdWNIVnphQ2hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdTRlJOVEVWc1pXMWxiblFvYldGMFkyaGJNbDBzSUdGMGRISnpMQ0J0WVhSamFGc3pYU2twSUMwZ01WMDdYRzVjYmlBZ0lDQWdJQ0FnSUNCemRHRmpheTV3ZFhOb0tHTjFjbkpsYm5SUVlYSmxiblFwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0d0Q2JHOWphMVJsZUhSRmJHVnRaVzUwYzF0dFlYUmphRnN5WFYwcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklHRWdiR2wwZEd4bElIUmxjM1FnZEc4Z1ptbHVaQ0J1WlhoMElEd3ZjMk55YVhCMFBpQnZjaUE4TDNOMGVXeGxQaUF1TGk1Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCamJHOXpaVTFoY210MWNDQTlJQ2M4THljZ0t5QnRZWFJqYUZzeVhTQXJJQ2MrSnp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCcGJtUmxlQ0E5SUdSaGRHRXVhVzVrWlhoUFppaGpiRzl6WlUxaGNtdDFjQ3dnYTAxaGNtdDFjRkJoZEhSbGNtNHViR0Z6ZEVsdVpHVjRLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0c5d2RHbHZibk5iYldGMFkyaGJNbDFkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaHBibVJsZUNBOVBTQXRNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklIUm9aWEpsSUdseklHNXZJRzFoZEdOb2FXNW5JR1Z1WkdsdVp5Qm1iM0lnZEdobElIUmxlSFFnWld4bGJXVnVkQzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwWlhoMElEMGdaR0YwWVM1emJHbGpaU2hyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSbGVIUWdQU0JrWVhSaExuTnNhV05sS0d0TllYSnJkWEJRWVhSMFpYSnVMbXhoYzNSSmJtUmxlQ3dnYVc1a1pYZ3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSbGVIUXViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOMWNuSmxiblJRWVhKbGJuUXVZMmhwYkdST2IyUmxjMXRqZFhKeVpXNTBVR0Z5Wlc1MExtTm9hV3hrVG05a1pYTXViR1Z1WjNSb1hTQTlJRlJsZUhST2IyUmxLSFJsZUhRcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYVc1a1pYZ2dQVDBnTFRFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2JHRnpkRlJsZUhSUWIzTWdQU0JyVFdGeWEzVndVR0YwZEdWeWJpNXNZWE4wU1c1a1pYZ2dQU0JrWVhSaExteGxibWQwYUNBcklERTdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZCaGNtVnVkQzV1YjJSbFZtRnNkV1VnUFNCa1lYUmhMbk5zYVdObEtHdE5ZWEpyZFhCUVlYUjBaWEp1TG14aGMzUkpibVJsZUN3Z2FXNWtaWGdwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JzWVhOMFZHVjRkRkJ2Y3lBOUlHdE5ZWEpyZFhCUVlYUjBaWEp1TG14aGMzUkpibVJsZUNBOUlHbHVaR1Y0SUNzZ1kyeHZjMlZOWVhKcmRYQXViR1Z1WjNSb08xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCdFlYUmphRnN4WFNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdhV1lnS0cxaGRHTm9XekZkSUh4OElHMWhkR05vV3pSZElIeDhJR3RUWld4bVEyeHZjMmx1WjBWc1pXMWxiblJ6VzIxaGRHTm9XekpkWFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQzh2SUR3dklHOXlJQzgrSUc5eUlEeGljajRnWlhSakxseHVJQ0FnSUNBZ0lDQWdJSGRvYVd4bElDaDBjblZsSUNZbUlHTjFjbkpsYm5SUVlYSmxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoamRYSnlaVzUwVUdGeVpXNTBMbTV2WkdWT1lXMWxJRDA5SUcxaGRHTm9XekpkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhOMFlXTnJMbkJ2Y0NncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCamRYSnlaVzUwVUdGeVpXNTBJRDBnYzNSaFkydGJjM1JoWTJzdWJHVnVaM1JvSUMwZ01WMDdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZISjVhVzVuSUhSdklHTnNiM05sSUdOMWNuSmxiblFnZEdGbkxDQmhibVFnYlc5MlpTQnZibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYTBWc1pXMWxiblJ6UTJ4dmMyVmtRbmxEYkc5emFXNW5XMk4xY25KbGJuUlFZWEpsYm5RdWJtOWtaVTVoYldWZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0d0RmJHVnRaVzUwYzBOc2IzTmxaRUo1UTJ4dmMybHVaMXRqZFhKeVpXNTBVR0Z5Wlc1MExtNXZaR1ZPWVcxbFhWdHRZWFJqYUZzeVhWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhOMFlXTnJMbkJ2Y0NncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZM1Z5Y21WdWRGQmhjbVZ1ZENBOUlITjBZV05yVzNOMFlXTnJMbXhsYm1kMGFDQXRJREZkTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiMjUwYVc1MVpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJWYzJVZ1lXZG5jbVZ6YzJsMlpTQnpkSEpoZEdWbmVTQjBieUJvWVc1a2JHVWdkVzV0WVhSamFHbHVaeUJ0WVhKcmRYQnpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlISnZiM1E3WEc0Z0lDQWdmVnh1SUNCOU8xeHVYRzRnSUhKbGRIVnliaUJvZEcxc1VHRnljMlZ5TzF4dWZUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNyZWF0ZVBvb2wgPSBjcmVhdGVQb29sO1xuZXhwb3J0cy5pbml0aWFsaXplUG9vbHMgPSBpbml0aWFsaXplUG9vbHM7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dWlkMiA9IHJlcXVpcmUoJy4vdXVpZCcpO1xuXG52YXIgX3V1aWQzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXVpZDIpO1xuXG52YXIgdXVpZCA9IF91dWlkM1snZGVmYXVsdCddO1xudmFyIHBvb2xzID0ge307XG5leHBvcnRzLnBvb2xzID0gcG9vbHM7XG52YXIgY291bnQgPSAxMDAwMDtcblxuZXhwb3J0cy5jb3VudCA9IGNvdW50O1xuLyoqXG4gKiBDcmVhdGVzIGEgcG9vbCB0byBxdWVyeSBuZXcgb3IgcmV1c2VkIHZhbHVlcyBmcm9tLlxuICpcbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gb3B0c1xuICogQHJldHVybiB7T2JqZWN0fSBwb29sXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlUG9vbChuYW1lLCBvcHRzKSB7XG4gIHZhciBzaXplID0gb3B0cy5zaXplO1xuICB2YXIgZmlsbCA9IG9wdHMuZmlsbDtcblxuICB2YXIgX2ZyZWUgPSBbXTtcbiAgdmFyIGFsbG9jYXRlZCA9IFtdO1xuICB2YXIgX3Byb3RlY3QgPSBbXTtcblxuICAvLyBQcmltZSB0aGUgY2FjaGUgd2l0aCBuIG9iamVjdHMuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgX2ZyZWVbaV0gPSBmaWxsKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIF9mcmVlOiBfZnJlZSxcbiAgICBfYWxsb2NhdGVkOiBhbGxvY2F0ZWQsXG4gICAgX3Byb3RlY3RlZDogX3Byb3RlY3QsXG4gICAgX3V1aWQ6IHt9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgb2JqID0gbnVsbDtcbiAgICAgIHZhciBmcmVlTGVuZ3RoID0gX2ZyZWUubGVuZ3RoO1xuICAgICAgdmFyIG1pbnVzT25lID0gZnJlZUxlbmd0aCAtIDE7XG5cbiAgICAgIGlmIChmcmVlTGVuZ3RoKSB7XG4gICAgICAgIG9iaiA9IF9mcmVlW21pbnVzT25lXTtcbiAgICAgICAgX2ZyZWUubGVuZ3RoID0gbWludXNPbmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBmaWxsKCk7XG4gICAgICB9XG5cbiAgICAgIGFsbG9jYXRlZC5wdXNoKG9iaik7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuICAgIHByb3RlY3Q6IGZ1bmN0aW9uIHByb3RlY3QodmFsdWUpIHtcbiAgICAgIHZhciBpZHggPSBhbGxvY2F0ZWQuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgIC8vIE1vdmUgdGhlIHZhbHVlIG91dCBvZiBhbGxvY2F0ZWQsIHNpbmNlIHdlIG5lZWQgdG8gcHJvdGVjdCB0aGlzIGZyb21cbiAgICAgIC8vIGJlaW5nIGZyZWUnZCBhY2NpZGVudGFsbHkuXG4gICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICBfcHJvdGVjdC5wdXNoKGFsbG9jYXRlZC5zcGxpY2UoaWR4LCAxKVswXSk7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgcHJvdGVjdGluZyBhbiBlbGVtZW50IG9iamVjdCwgcHVzaCB0aGUgdXVpZCBpbnRvIGEgbG9va3VwXG4gICAgICAgIC8vIHRhYmxlLlxuICAgICAgICBpZiAobmFtZSA9PT0gJ2VsZW1lbnRPYmplY3QnKSB7XG4gICAgICAgICAgdGhpcy5fdXVpZFt2YWx1ZS5lbGVtZW50XSA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEZyb20gYSB3b3JrZXIuXG4gICAgICBlbHNlIHtcbiAgICAgICAgICBfcHJvdGVjdC5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgIC8vIElmIHdlJ3JlIHByb3RlY3RpbmcgYW4gZWxlbWVudCBvYmplY3QsIHB1c2ggdGhlIHV1aWQgaW50byBhIGxvb2t1cFxuICAgICAgICAgIC8vIHRhYmxlLlxuICAgICAgICAgIGlmIChuYW1lID09PSAnZWxlbWVudE9iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMuX3V1aWRbdmFsdWUuZWxlbWVudF0gPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1bnByb3RlY3Q6IGZ1bmN0aW9uIHVucHJvdGVjdCh2YWx1ZSkge1xuICAgICAgdmFyIGlkeCA9IF9wcm90ZWN0LmluZGV4T2YodmFsdWUpO1xuXG4gICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICB2YXIgb2JqID0gX3Byb3RlY3Quc3BsaWNlKGlkeCwgMSlbMF07XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICBhbGxvY2F0ZWQucHVzaChvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgPT09ICdlbGVtZW50T2JqZWN0Jykge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl91dWlkW3ZhbHVlLmVsZW1lbnRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZyZWVBbGw6IGZ1bmN0aW9uIGZyZWVBbGwoKSB7XG4gICAgICB2YXIgYWxsb2NhdGVkTGVuZ3RoID0gYWxsb2NhdGVkLmxlbmd0aDtcbiAgICAgIHZhciBmcmVlTGVuZ3RoID0gX2ZyZWUubGVuZ3RoO1xuXG4gICAgICBfZnJlZS5wdXNoLmFwcGx5KF9mcmVlLCBhbGxvY2F0ZWQuc2xpY2UoMCwgc2l6ZSAtIGZyZWVMZW5ndGgpKTtcbiAgICAgIGFsbG9jYXRlZC5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBmcmVlOiBmdW5jdGlvbiBmcmVlKHZhbHVlKSB7XG4gICAgICB2YXIgaWR4ID0gYWxsb2NhdGVkLmluZGV4T2YodmFsdWUpO1xuXG4gICAgICAvLyBBbHJlYWR5IGZyZWVkLlxuICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IHB1dCBiYWNrIGludG8gdGhlIGZyZWUgcXVldWUgaWYgd2UncmUgdW5kZXIgdGhlIHNpemUuXG4gICAgICBpZiAoX2ZyZWUubGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgICBfZnJlZS5wdXNoKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgYWxsb2NhdGVkLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVBvb2xzKENPVU5UKSB7XG4gIHBvb2xzLmF0dHJpYnV0ZU9iamVjdCA9IGNyZWF0ZVBvb2woJ2F0dHJpYnV0ZU9iamVjdCcsIHtcbiAgICBzaXplOiBDT1VOVCxcblxuICAgIGZpbGw6IGZ1bmN0aW9uIGZpbGwoKSB7XG4gICAgICByZXR1cm4geyBuYW1lOiAnJywgdmFsdWU6ICcnIH07XG4gICAgfVxuICB9KTtcblxuICBwb29scy5lbGVtZW50T2JqZWN0ID0gY3JlYXRlUG9vbCgnZWxlbWVudE9iamVjdCcsIHtcbiAgICBzaXplOiBDT1VOVCxcblxuICAgIGZpbGw6IGZ1bmN0aW9uIGZpbGwoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVtZW50OiB1dWlkKCksXG4gICAgICAgIGNoaWxkTm9kZXM6IFtdLFxuICAgICAgICBhdHRyaWJ1dGVzOiBbXVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBDcmVhdGUgMTBrIGl0ZW1zIG9mIGVhY2ggdHlwZS5cbmluaXRpYWxpemVQb29scyhjb3VudCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZjRzl2YkhNdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096dHhRa0ZCYTBJc1VVRkJVVHM3T3p0QlFVVXhRaXhKUVVGTkxFbEJRVWtzYjBKQlFWRXNRMEZCUXp0QlFVTmFMRWxCUVVrc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF6czdRVUZEWml4SlFVRkpMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU03T3pzN096czdPenM3TzBGQlUyeENMRk5CUVZNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdUVUZETDBJc1NVRkJTU3hIUVVGWExFbEJRVWtzUTBGQmJrSXNTVUZCU1R0TlFVRkZMRWxCUVVrc1IwRkJTeXhKUVVGSkxFTkJRV0lzU1VGQlNUczdRVUZEYUVJc1RVRkJTU3hMUVVGSkxFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEyUXNUVUZCU1N4VFFVRlRMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMjVDTEUxQlFVa3NVVUZCVHl4SFFVRkhMRVZCUVVVc1EwRkJRenM3TzBGQlIycENMRTlCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRE4wSXNVMEZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFbEJRVWtzUlVGQlJTeERRVUZETzBkQlEyeENPenRCUVVWRUxGTkJRVTg3UVVGRFRDeFRRVUZMTEVWQlFVVXNTMEZCU1R0QlFVTllMR05CUVZVc1JVRkJSU3hUUVVGVE8wRkJRM0pDTEdOQlFWVXNSVUZCUlN4UlFVRlBPMEZCUTI1Q0xGTkJRVXNzUlVGQlJTeEZRVUZGT3p0QlFVVlVMRTlCUVVjc1JVRkJSU3hsUVVGWE8wRkJRMlFzVlVGQlNTeEhRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTJZc1ZVRkJTU3hWUVVGVkxFZEJRVWNzUzBGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTTNRaXhWUVVGSkxGRkJRVkVzUjBGQlJ5eFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVVNVFpeFZRVUZKTEZWQlFWVXNSVUZCUlR0QlFVTmtMRmRCUVVjc1IwRkJSeXhMUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY2tJc1lVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTTdUMEZEZUVJc1RVRkRTVHRCUVVOSUxGZEJRVWNzUjBGQlJ5eEpRVUZKTEVWQlFVVXNRMEZCUXp0UFFVTmtPenRCUVVWRUxHVkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWEJDTEdGQlFVOHNSMEZCUnl4RFFVRkRPMHRCUTFvN08wRkJSVVFzVjBGQlR5eEZRVUZGTEdsQ1FVRlRMRXRCUVVzc1JVRkJSVHRCUVVOMlFpeFZRVUZKTEVkQlFVY3NSMEZCUnl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3pzN08wRkJTVzVETEZWQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRMlFzWjBKQlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6czdPenRCUVVreFF5eFpRVUZKTEVsQlFVa3NTMEZCU3l4bFFVRmxMRVZCUVVVN1FVRkROVUlzWTBGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFOQlF5OUNPMDlCUTBZN08xZEJSVWs3UVVGRFNDeHJRa0ZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6czdPenRCUVVsd1FpeGpRVUZKTEVsQlFVa3NTMEZCU3l4bFFVRmxMRVZCUVVVN1FVRkROVUlzWjBKQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0WFFVTXZRanRUUVVOR08wdEJRMFk3TzBGQlJVUXNZVUZCVXl4RlFVRkZMRzFDUVVGVExFdEJRVXNzUlVGQlJUdEJRVU42UWl4VlFVRkpMRWRCUVVjc1IwRkJSeXhSUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVWcVF5eFZRVUZKTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVOa0xGbEJRVWtzUjBGQlJ5eEhRVUZITEZGQlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNCRExGbEJRVWtzUjBGQlJ5eEZRVUZGTzBGQlFVVXNiVUpCUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdVMEZCUlRzN1FVRkZha01zV1VGQlNTeEpRVUZKTEV0QlFVc3NaVUZCWlN4RlFVRkZPMEZCUXpWQ0xHbENRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFOQlEyeERPMDlCUTBZN1MwRkRSanM3UVVGRlJDeFhRVUZQTEVWQlFVVXNiVUpCUVZjN1FVRkRiRUlzVlVGQlNTeGxRVUZsTEVkQlFVY3NVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVOMlF5eFZRVUZKTEZWQlFWVXNSMEZCUnl4TFFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE96dEJRVVUzUWl4WFFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZKTEVWQlFVVXNVMEZCVXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFVkJRVVVzU1VGQlNTeEhRVUZITEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkROMFFzWlVGQlV5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1MwRkRkRUk3TzBGQlJVUXNVVUZCU1N4RlFVRkZMR05CUVZNc1MwRkJTeXhGUVVGRk8wRkJRM0JDTEZWQlFVa3NSMEZCUnl4SFFVRkhMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPenRCUVVkdVF5eFZRVUZKTEVkQlFVY3NTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVGRkxHVkJRVTg3VDBGQlJUczdPMEZCUnpOQ0xGVkJRVWtzUzBGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRVZCUVVVN1FVRkRkRUlzWVVGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRQUVVOc1FqczdRVUZGUkN4bFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTXhRanRIUVVOR0xFTkJRVU03UTBGRFNEczdRVUZIVFN4VFFVRlRMR1ZCUVdVc1EwRkJReXhMUVVGTExFVkJRVVU3UVVGRGNrTXNUMEZCU3l4RFFVRkRMR1ZCUVdVc1IwRkJSeXhWUVVGVkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVN1FVRkRjRVFzVVVGQlNTeEZRVUZGTEV0QlFVczdPMEZCUlZnc1VVRkJTU3hGUVVGRkxHZENRVUZYTzBGQlEyWXNZVUZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSU3hGUVVGRkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVWQlFVVXNSVUZCUlN4RFFVRkRPMHRCUTJoRE8wZEJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRTlCUVVzc1EwRkJReXhoUVVGaExFZEJRVWNzVlVGQlZTeERRVUZETEdWQlFXVXNSVUZCUlR0QlFVTm9SQ3hSUVVGSkxFVkJRVVVzUzBGQlN6czdRVUZGV0N4UlFVRkpMRVZCUVVVc1owSkJRVmM3UVVGRFppeGhRVUZQTzBGQlEwd3NaVUZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVObUxHdENRVUZWTEVWQlFVVXNSVUZCUlR0QlFVTmtMR3RDUVVGVkxFVkJRVVVzUlVGQlJUdFBRVU5tTEVOQlFVTTdTMEZEU0R0SFFVTkdMRU5CUVVNc1EwRkJRenREUVVOS096czdRVUZIUkN4bFFVRmxMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1pTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2ZFhScGJDOXdiMjlzY3k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQmZkWFZwWkNCbWNtOXRJQ2N1TDNWMWFXUW5PMXh1WEc1amIyNXpkQ0IxZFdsa0lEMGdYM1YxYVdRN1hHNWxlSEJ2Y25RZ2RtRnlJSEJ2YjJ4eklEMGdlMzA3WEc1bGVIQnZjblFnZG1GeUlHTnZkVzUwSUQwZ01UQXdNREE3WEc1Y2JpOHFLbHh1SUNvZ1EzSmxZWFJsY3lCaElIQnZiMndnZEc4Z2NYVmxjbmtnYm1WM0lHOXlJSEpsZFhObFpDQjJZV3gxWlhNZ1puSnZiUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdibUZ0WlZ4dUlDb2dRSEJoY21GdElHOXdkSE5jYmlBcUlFQnlaWFIxY200Z2UwOWlhbVZqZEgwZ2NHOXZiRnh1SUNvdlhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1kzSmxZWFJsVUc5dmJDaHVZVzFsTENCdmNIUnpLU0I3WEc0Z0lIWmhjaUI3SUhOcGVtVXNJR1pwYkd3Z2ZTQTlJRzl3ZEhNN1hHNGdJSFpoY2lCbWNtVmxJRDBnVzEwN1hHNGdJSFpoY2lCaGJHeHZZMkYwWldRZ1BTQmJYVHRjYmlBZ2RtRnlJSEJ5YjNSbFkzUWdQU0JiWFR0Y2JseHVJQ0F2THlCUWNtbHRaU0IwYUdVZ1kyRmphR1VnZDJsMGFDQnVJRzlpYW1WamRITXVYRzRnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z2MybDZaVHNnYVNzcktTQjdYRzRnSUNBZ1puSmxaVnRwWFNBOUlHWnBiR3dvS1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCN1hHNGdJQ0FnWDJaeVpXVTZJR1p5WldVc1hHNGdJQ0FnWDJGc2JHOWpZWFJsWkRvZ1lXeHNiMk5oZEdWa0xGeHVJQ0FnSUY5d2NtOTBaV04wWldRNklIQnliM1JsWTNRc1hHNGdJQ0FnWDNWMWFXUTZJSHQ5TEZ4dVhHNGdJQ0FnWjJWME9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJR3hsZENCdlltb2dQU0J1ZFd4c08xeHVJQ0FnSUNBZ2JHVjBJR1p5WldWTVpXNW5kR2dnUFNCbWNtVmxMbXhsYm1kMGFEdGNiaUFnSUNBZ0lHeGxkQ0J0YVc1MWMwOXVaU0E5SUdaeVpXVk1aVzVuZEdnZ0xTQXhPMXh1WEc0Z0lDQWdJQ0JwWmlBb1puSmxaVXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0J2WW1vZ1BTQm1jbVZsVzIxcGJuVnpUMjVsWFR0Y2JpQWdJQ0FnSUNBZ1puSmxaUzVzWlc1bmRHZ2dQU0J0YVc1MWMwOXVaVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnZZbW9nUFNCbWFXeHNLQ2s3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdGc2JHOWpZWFJsWkM1d2RYTm9LRzlpYWlrN1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCdlltbzdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lIQnliM1JsWTNRNklHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJQ0FnSUNCc1pYUWdhV1I0SUQwZ1lXeHNiMk5oZEdWa0xtbHVaR1Y0VDJZb2RtRnNkV1VwTzF4dVhHNGdJQ0FnSUNBdkx5Qk5iM1psSUhSb1pTQjJZV3gxWlNCdmRYUWdiMllnWVd4c2IyTmhkR1ZrTENCemFXNWpaU0IzWlNCdVpXVmtJSFJ2SUhCeWIzUmxZM1FnZEdocGN5Qm1jbTl0WEc0Z0lDQWdJQ0F2THlCaVpXbHVaeUJtY21WbEoyUWdZV05qYVdSbGJuUmhiR3g1TGx4dUlDQWdJQ0FnYVdZZ0tHbGtlQ0FoUFQwZ0xURXBJSHRjYmlBZ0lDQWdJQ0FnY0hKdmRHVmpkQzV3ZFhOb0tHRnNiRzlqWVhSbFpDNXpjR3hwWTJVb2FXUjRMQ0F4S1Zzd1hTazdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1NXWWdkMlVuY21VZ2NISnZkR1ZqZEdsdVp5QmhiaUJsYkdWdFpXNTBJRzlpYW1WamRDd2djSFZ6YUNCMGFHVWdkWFZwWkNCcGJuUnZJR0VnYkc5dmEzVndYRzRnSUNBZ0lDQWdJQzh2SUhSaFlteGxMbHh1SUNBZ0lDQWdJQ0JwWmlBb2JtRnRaU0E5UFQwZ0oyVnNaVzFsYm5SUFltcGxZM1FuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmRYVnBaRnQyWVd4MVpTNWxiR1Z0Wlc1MFhTQTlJREU3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklFWnliMjBnWVNCM2IzSnJaWEl1WEc0Z0lDQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjSEp2ZEdWamRDNXdkWE5vS0haaGJIVmxLVHRjYmx4dUlDQWdJQ0FnSUNBdkx5QkpaaUIzWlNkeVpTQndjbTkwWldOMGFXNW5JR0Z1SUdWc1pXMWxiblFnYjJKcVpXTjBMQ0J3ZFhOb0lIUm9aU0IxZFdsa0lHbHVkRzhnWVNCc2IyOXJkWEJjYmlBZ0lDQWdJQ0FnTHk4Z2RHRmliR1V1WEc0Z0lDQWdJQ0FnSUdsbUlDaHVZVzFsSUQwOVBTQW5aV3hsYldWdWRFOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxsOTFkV2xrVzNaaGJIVmxMbVZzWlcxbGJuUmRJRDBnTVR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwc1hHNWNiaUFnSUNCMWJuQnliM1JsWTNRNklHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJQ0FnSUNCc1pYUWdhV1I0SUQwZ2NISnZkR1ZqZEM1cGJtUmxlRTltS0haaGJIVmxLVHRjYmx4dUlDQWdJQ0FnYVdZZ0tHbGtlQ0FoUFQwZ0xURXBJSHRjYmlBZ0lDQWdJQ0FnYkdWMElHOWlhaUE5SUhCeWIzUmxZM1F1YzNCc2FXTmxLR2xrZUN3Z01TbGJNRjA3WEc0Z0lDQWdJQ0FnSUdsbUlDaHZZbW9wSUhzZ1lXeHNiMk5oZEdWa0xuQjFjMmdvYjJKcUtUc2dmVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHVZVzFsSUQwOVBTQW5aV3hsYldWdWRFOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lDQWdJQ0JrWld4bGRHVWdkR2hwY3k1ZmRYVnBaRnQyWVd4MVpTNWxiR1Z0Wlc1MFhUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHNYRzVjYmlBZ0lDQm1jbVZsUVd4c09pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJR3hsZENCaGJHeHZZMkYwWldSTVpXNW5kR2dnUFNCaGJHeHZZMkYwWldRdWJHVnVaM1JvTzF4dUlDQWdJQ0FnYkdWMElHWnlaV1ZNWlc1bmRHZ2dQU0JtY21WbExteGxibWQwYUR0Y2JseHVJQ0FnSUNBZ1puSmxaUzV3ZFhOb0xtRndjR3g1S0daeVpXVXNJR0ZzYkc5allYUmxaQzV6YkdsalpTZ3dMQ0J6YVhwbElDMGdabkpsWlV4bGJtZDBhQ2twTzF4dUlDQWdJQ0FnWVd4c2IyTmhkR1ZrTG14bGJtZDBhQ0E5SURBN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdaeVpXVTZJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQnNaWFFnYVdSNElEMGdZV3hzYjJOaGRHVmtMbWx1WkdWNFQyWW9kbUZzZFdVcE8xeHVYRzRnSUNBZ0lDQXZMeUJCYkhKbFlXUjVJR1p5WldWa0xseHVJQ0FnSUNBZ2FXWWdLR2xrZUNBOVBUMGdMVEVwSUhzZ2NtVjBkWEp1T3lCOVhHNWNiaUFnSUNBZ0lDOHZJRTl1YkhrZ2NIVjBJR0poWTJzZ2FXNTBieUIwYUdVZ1puSmxaU0J4ZFdWMVpTQnBaaUIzWlNkeVpTQjFibVJsY2lCMGFHVWdjMmw2WlM1Y2JpQWdJQ0FnSUdsbUlDaG1jbVZsTG14bGJtZDBhQ0E4SUhOcGVtVXBJSHRjYmlBZ0lDQWdJQ0FnWm5KbFpTNXdkWE5vS0haaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWVd4c2IyTmhkR1ZrTG5Od2JHbGpaU2hwWkhnc0lERXBPMXh1SUNBZ0lIMWNiaUFnZlR0Y2JuMWNibHh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnYVc1cGRHbGhiR2w2WlZCdmIyeHpLRU5QVlU1VUtTQjdYRzRnSUhCdmIyeHpMbUYwZEhKcFluVjBaVTlpYW1WamRDQTlJR055WldGMFpWQnZiMndvSjJGMGRISnBZblYwWlU5aWFtVmpkQ2NzSUh0Y2JpQWdJQ0J6YVhwbE9pQkRUMVZPVkN4Y2JseHVJQ0FnSUdacGJHdzZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSHNnYm1GdFpUb2dKeWNzSUhaaGJIVmxPaUFuSnlCOU8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdjRzl2YkhNdVpXeGxiV1Z1ZEU5aWFtVmpkQ0E5SUdOeVpXRjBaVkJ2YjJ3b0oyVnNaVzFsYm5SUFltcGxZM1FuTENCN1hHNGdJQ0FnYzJsNlpUb2dRMDlWVGxRc1hHNWNiaUFnSUNCbWFXeHNPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblE2SUhWMWFXUW9LU3hjYmlBZ0lDQWdJQ0FnWTJocGJHUk9iMlJsY3pvZ1cxMHNYRzRnSUNBZ0lDQWdJR0YwZEhKcFluVjBaWE02SUZ0ZFhHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1OVhHNWNiaTh2SUVOeVpXRjBaU0F4TUdzZ2FYUmxiWE1nYjJZZ1pXRmphQ0IwZVhCbExseHVhVzVwZEdsaGJHbDZaVkJ2YjJ4ektHTnZkVzUwS1R0Y2JpSmRmUT09IiwiLyoqXG4gKiBHZW5lcmF0ZXMgYSB1dWlkLlxuICpcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyMy8yODIxNzVcbiAqIEByZXR1cm4ge3N0cmluZ30gdXVpZFxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gdXVpZDtcblxuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsXG4gICAgICAgIHYgPSBjID09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzVjBhV3d2ZFhWcFpDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenR4UWtGTmQwSXNTVUZCU1RzN1FVRkJZaXhUUVVGVExFbEJRVWtzUjBGQlJ6dEJRVU0zUWl4VFFVRlBMSE5EUVVGelF5eERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1ZVRkJVeXhEUVVGRExFVkJRVVU3UVVGRGVrVXNVVUZCU1N4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZETEVWQlFVVXNSMEZCUXl4RFFVRkRPMUZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEhRVUZITEVkQlFVY3NRMEZCUXl4SFFVRkpMRU5CUVVNc1IwRkJReXhIUVVGSExFZEJRVU1zUjBGQlJ5eEJRVUZETEVOQlFVTTdRVUZETTBRc1YwRkJUeXhEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTNaQ0xFTkJRVU1zUTBGQlF6dERRVU5LSWl3aVptbHNaU0k2SWk5b2IyMWxMM1JwYlM5bmFYUXZaR2xtWm1oMGJXd3ZiR2xpTDNWMGFXd3ZkWFZwWkM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dSMlZ1WlhKaGRHVnpJR0VnZFhWcFpDNWNiaUFxWEc0Z0tpQkFjMlZsSUdoMGRIQTZMeTl6ZEdGamEyOTJaWEptYkc5M0xtTnZiUzloTHpJeE1UYzFNak12TWpneU1UYzFYRzRnS2lCQWNtVjBkWEp1SUh0emRISnBibWQ5SUhWMWFXUmNiaUFxTDF4dVpYaHdiM0owSUdSbFptRjFiSFFnWm5WdVkzUnBiMjRnZFhWcFpDZ3BJSHRjYmlBZ2NtVjBkWEp1SUNkNGVIaDRlSGg0ZUMxNGVIaDRMVFI0ZUhndGVYaDRlQzE0ZUhoNGVIaDRlSGg0ZUhnbkxuSmxjR3hoWTJVb0wxdDRlVjB2Wnl3Z1puVnVZM1JwYjI0b1l5a2dlMXh1SUNBZ0lIWmhjaUJ5SUQwZ1RXRjBhQzV5WVc1a2IyMG9LU294Tm53d0xDQjJJRDBnWXlBOVBTQW5lQ2NnUHlCeUlEb2dLSEltTUhnemZEQjRPQ2s3WEc0Z0lDQWdjbVYwZFhKdUlIWXVkRzlUZEhKcGJtY29NVFlwTzF4dUlDQjlLVHRjYm4xY2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfdXRpbFV1aWQgPSByZXF1aXJlKCcuLi91dGlsL3V1aWQnKTtcblxudmFyIF91dGlsVXVpZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsVXVpZCk7XG5cbnZhciBfdXRpbFBvb2xzID0gcmVxdWlyZSgnLi4vdXRpbC9wb29scycpO1xuXG52YXIgX3V0aWxQYXJzZXIgPSByZXF1aXJlKCcuLi91dGlsL3BhcnNlcicpO1xuXG52YXIgX3V0aWxNZW1vcnkgPSByZXF1aXJlKCcuLi91dGlsL21lbW9yeScpO1xuXG52YXIgX25vZGVTeW5jID0gcmVxdWlyZSgnLi4vbm9kZS9zeW5jJyk7XG5cbnZhciBfbm9kZVN5bmMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbm9kZVN5bmMpO1xuXG52YXIgX3NvdXJjZSA9IHJlcXVpcmUoJy4vc291cmNlJyk7XG5cbnZhciBfc291cmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NvdXJjZSk7XG5cbi8vIFRlc3RzIGlmIHRoZSBicm93c2VyIGhhcyBzdXBwb3J0IGZvciB0aGUgYFdvcmtlcmAgQVBJLlxudmFyIGhhc1dvcmtlciA9IHR5cGVvZiBXb3JrZXIgPT09ICdmdW5jdGlvbic7XG5cbmV4cG9ydHMuaGFzV29ya2VyID0gaGFzV29ya2VyO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFdlYiBXb3JrZXIgcGVyIGVsZW1lbnQgdGhhdCB3aWxsIGJlIGRpZmZlZC4gQWxsb3dzIG11bHRpcGxlXG4gKiBjb25jdXJyZW50IGRpZmZpbmcgb3BlcmF0aW9ucyB0byBvY2N1ciBzaW11bHRhbmVvdXNseSwgbGV2ZXJhZ2luZyB0aGVcbiAqIG11bHRpLWNvcmUgbmF0dXJlIG9mIGRlc2t0b3AgYW5kIG1vYmlsZSBkZXZpY2VzLlxuICpcbiAqIEF0dGFjaCBhbnkgZnVuY3Rpb25zIHRoYXQgY291bGQgYmUgdXNlZCBieSB0aGUgV29ya2VyIGluc2lkZSB0aGUgQmxvYiBiZWxvdy5cbiAqIEFsbCBmdW5jdGlvbnMgYXJlIG5hbWVkIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGdsb2JhbGx5LiBTaW5jZSB3ZSdyZVxuICogZGlyZWN0bHkgaW5qZWN0aW5nIHRoZSBtZXRob2RzIGludG8gYW4gQXJyYXkgYW5kIHRoZW4gY2FsbGluZyBgam9pbmAgdGhlXG4gKiBgdG9TdHJpbmdgIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgb24gZWFjaCBmdW5jdGlvbiBhbmQgd2lsbCBpbmplY3QgYSB2YWxpZFxuICogcmVwcmVzZW50YXRpb24gb2YgdGhlIGZ1bmN0aW9uJ3Mgc291cmNlLiBUaGlzIGNvbWVzIGF0IGEgY29zdCBzaW5jZSBCYWJlbFxuICogcmV3cml0ZXMgdmFyaWFibGUgbmFtZXMgd2hlbiB5b3UgYGltcG9ydGAgYSBtb2R1bGUuIFRoaXMgaXMgd2h5IHlvdSdsbCBzZWVcbiAqIHVuZGVyc2NvcmVkIHByb3BlcnRpZXMgYmVpbmcgaW1wb3J0ZWQgYW5kIHRoZW4gcmVhc3NpZ25lZCB0byBub24tdW5kZXJzY29yZWRcbiAqIG5hbWVzIGluIG1vZHVsZXMgdGhhdCBhcmUgcmV1c2VkIGhlcmUuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBBIFdvcmtlciBpbnN0YW5jZS5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIHZhciB3b3JrZXJCbG9iID0gbnVsbDtcbiAgdmFyIHdvcmtlciA9IG51bGw7XG5cbiAgLy8gU2V0IHVwIGEgV2ViV29ya2VyIGlmIGF2YWlsYWJsZS5cbiAgaWYgKGhhc1dvcmtlcikge1xuICAgIC8vIENvbnN0cnVjdCB0aGUgd29ya2VyIHJldXNpbmcgY29kZSBhbHJlYWR5IG9yZ2FuaXplZCBpbnRvIG1vZHVsZXMuICBLZWVwXG4gICAgLy8gdGhpcyBjb2RlIEVTNSBzaW5jZSB3ZSBkbyBub3QgZ2V0IHRpbWUgdG8gcHJlLXByb2Nlc3MgaXQgYXMgRVM2LlxuICAgIHdvcmtlckJsb2IgPSBuZXcgQmxvYihbW1xuICAgIC8vIFJldXNhYmxlIEFycmF5IG1ldGhvZHMuXG4gICAgJ3ZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTsnLFxuXG4gICAgLy8gQWRkIGEgbmFtZXNwYWNlIHRvIGF0dGFjaCBwb29sIG1ldGhvZHMgdG8uXG4gICAgJ3ZhciBwb29scyA9IHt9OycsICd2YXIgbm9kZXMgPSAwOycsXG5cbiAgICAvLyBBZGRzIGluIGEgZ2xvYmFsIGB1dWlkYCBmdW5jdGlvbi5cbiAgICBfdXRpbFV1aWQyWydkZWZhdWx0J10sXG5cbiAgICAvLyBBZGQgdGhlIGFiaWxpdHkgdG8gcHJvdGVjdCBlbGVtZW50cyBmcm9tIGZyZWUnZCBtZW1vcnkuXG4gICAgX3V0aWxNZW1vcnkucHJvdGVjdEVsZW1lbnQsIF91dGlsTWVtb3J5LnVucHJvdGVjdEVsZW1lbnQsIF91dGlsTWVtb3J5LmNsZWFuTWVtb3J5LFxuXG4gICAgLy8gQWRkIGluIHBvb2wgbWFuaXB1bGF0aW9uIG1ldGhvZHMuXG4gICAgX3V0aWxQb29scy5jcmVhdGVQb29sLCBfdXRpbFBvb2xzLmluaXRpYWxpemVQb29scywgJ2luaXRpYWxpemVQb29scygnICsgX3V0aWxQb29scy5jb3VudCArICcpOycsXG5cbiAgICAvLyBBZGQgaW4gTm9kZSBtYW5pcHVsYXRpb24uXG4gICAgJ3ZhciBzeW5jTm9kZSA9ICcgKyBfbm9kZVN5bmMyWydkZWZhdWx0J10sXG5cbiAgICAvLyBBZGQgaW4gdGhlIGFiaWxpdHkgdG8gcGFyc2VIVE1MLlxuICAgIF91dGlsUGFyc2VyLnBhcnNlSFRNTCwgJ3ZhciBtYWtlUGFyc2VyID0gJyArIF91dGlsUGFyc2VyLm1ha2VQYXJzZXIsICd2YXIgcGFyc2VyID0gbWFrZVBhcnNlcigpOycsXG5cbiAgICAvLyBBZGQgaW4gdGhlIHdvcmtlciBzb3VyY2UuXG4gICAgX3NvdXJjZTJbJ2RlZmF1bHQnXSxcblxuICAgIC8vIE1ldGFwcm9ncmFtbWluZyB1cCB0aGlzIHdvcmtlciBjYWxsLlxuICAgICdzdGFydHVwKHNlbGYpOyddLmpvaW4oJ1xcbicpXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIHdvcmtlciBhbmQgc3RhcnQgaXQgdXAuXG4gICAgdHJ5IHtcbiAgICAgIHdvcmtlciA9IG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTCh3b3JrZXJCbG9iKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5pbmZvKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkZhaWxlZCB0byBjcmVhdGUgZGlmZmh0bWwgd29ya2VyXCIsIGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBjYW5ub3QgY3JlYXRlIGEgV29ya2VyLCB0aGVuIGRpc2FibGUgdHJ5aW5nIGFnYWluLCBhbGwgd29ya1xuICAgICAgLy8gd2lsbCBoYXBwZW4gb24gdGhlIG1haW4gVUkgdGhyZWFkLlxuICAgICAgZXhwb3J0cy5oYXNXb3JrZXIgPSBoYXNXb3JrZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gd29ya2VyO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNScGJTOW5hWFF2WkdsbVptaDBiV3d2YkdsaUwzZHZjbXRsY2k5amNtVmhkR1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3TzNkQ1FVRnBRaXhqUVVGak96czdPM2xDUVVOdlFpeGxRVUZsT3pzd1FrRkZOVUlzWjBKQlFXZENPenN3UWtGRFVTeG5Ra0ZCWjBJN08zZENRVU42UkN4alFVRmpPenM3TzNOQ1FVTldMRlZCUVZVN096czdPMEZCUnpWQ0xFbEJRVWtzVTBGQlV5eEhRVUZITEU5QlFVOHNUVUZCVFN4TFFVRkxMRlZCUVZVc1EwRkJRenM3T3pzN096czdPenM3T3pzN096czdPenM3UVVGclFqZERMRk5CUVZNc1RVRkJUU3hIUVVGSE8wRkJRM1pDTEUxQlFVa3NWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOMFFpeE5RVUZKTEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNN096dEJRVWRzUWl4TlFVRkpMRk5CUVZNc1JVRkJSVHM3TzBGQlIySXNZMEZCVlN4SFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExFTkJRM0JDT3p0QlFVVkZMSGREUVVGdlF6czdPMEZCUjNCRExIRkNRVUZwUWl4RlFVTnFRaXhuUWtGQlowSTdPenM3T3pzN096dDFSRUZoYUVJc2EwSkJRV3RDTEcxQ1FVRlpMRWRCUVVjc1NVRkJTVHM3TzBGQlIzSkRMSEZDUVVGcFFpeDNRa0ZCVnpzN096SkNRVXMxUWl4dFFrRkJiVUlzZVVKQlFXRXNSVUZEYUVNc05FSkJRVFJDT3pzN096czdRVUZOTlVJc2IwSkJRV2RDTEVOQlEycENMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVU5pTEVWQlFVVXNSVUZCUlN4SlFVRkpMRVZCUVVVc2QwSkJRWGRDTEVWQlFVVXNRMEZCUXl4RFFVRkRPenM3UVVGSGRrTXNVVUZCU1R0QlFVTkdMRmxCUVUwc1IwRkJSeXhKUVVGSkxFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNaVUZCWlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGRFUXNRMEZEUkN4UFFVRk5MRU5CUVVNc1JVRkJSVHRCUVVOUUxGVkJRVWtzVDBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVN1FVRkRNMElzWlVGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4clEwRkJhME1zUlVGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UFFVTndSRHM3T3p0QlFVbEVMR05CTlVWTExGTkJRVk1zUjBFMFJXUXNVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJRenRMUVVOdVFqdEhRVU5HT3p0QlFVVkVMRk5CUVU4c1RVRkJUU3hEUVVGRE8wTkJRMllpTENKbWFXeGxJam9pTDJodmJXVXZkR2x0TDJkcGRDOWthV1ptYUhSdGJDOXNhV0l2ZDI5eWEyVnlMMk55WldGMFpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0IxZFdsa0lHWnliMjBnSnk0dUwzVjBhV3d2ZFhWcFpDYzdYRzVwYlhCdmNuUWdleUJ3YjI5c2N5d2dhVzVwZEdsaGJHbDZaVkJ2YjJ4ekxDQmpjbVZoZEdWUWIyOXNJSDBnWm5KdmJTQW5MaTR2ZFhScGJDOXdiMjlzY3ljN1hHNXBiWEJ2Y25RZ2V5QmpiM1Z1ZENCaGN5QndiMjlzUTI5MWJuUWdmU0JtY205dElDY3VMaTkxZEdsc0wzQnZiMnh6Snp0Y2JtbHRjRzl5ZENCN0lIQmhjbk5sU0ZSTlRDd2diV0ZyWlZCaGNuTmxjaUI5SUdaeWIyMGdKeTR1TDNWMGFXd3ZjR0Z5YzJWeUp6dGNibWx0Y0c5eWRDQjdJSEJ5YjNSbFkzUkZiR1Z0Wlc1MExDQjFibkJ5YjNSbFkzUkZiR1Z0Wlc1MExDQmpiR1ZoYmsxbGJXOXllU0I5SUdaeWIyMGdKeTR1TDNWMGFXd3ZiV1Z0YjNKNUp6dGNibWx0Y0c5eWRDQnplVzVqVG05a1pTQm1jbTl0SUNjdUxpOXViMlJsTDNONWJtTW5PMXh1YVcxd2IzSjBJSGR2Y210bGNsTnZkWEpqWlNCbWNtOXRJQ2N1TDNOdmRYSmpaU2M3WEc1Y2JpOHZJRlJsYzNSeklHbG1JSFJvWlNCaWNtOTNjMlZ5SUdoaGN5QnpkWEJ3YjNKMElHWnZjaUIwYUdVZ1lGZHZjbXRsY21BZ1FWQkpMbHh1Wlhod2IzSjBJSFpoY2lCb1lYTlhiM0pyWlhJZ1BTQjBlWEJsYjJZZ1YyOXlhMlZ5SUQwOVBTQW5ablZ1WTNScGIyNG5PMXh1WEc0dktpcGNiaUFxSUVOeVpXRjBaWE1nWVNCdVpYY2dWMlZpSUZkdmNtdGxjaUJ3WlhJZ1pXeGxiV1Z1ZENCMGFHRjBJSGRwYkd3Z1ltVWdaR2xtWm1Wa0xpQkJiR3h2ZDNNZ2JYVnNkR2x3YkdWY2JpQXFJR052Ym1OMWNuSmxiblFnWkdsbVptbHVaeUJ2Y0dWeVlYUnBiMjV6SUhSdklHOWpZM1Z5SUhOcGJYVnNkR0Z1Wlc5MWMyeDVMQ0JzWlhabGNtRm5hVzVuSUhSb1pWeHVJQ29nYlhWc2RHa3RZMjl5WlNCdVlYUjFjbVVnYjJZZ1pHVnphM1J2Y0NCaGJtUWdiVzlpYVd4bElHUmxkbWxqWlhNdVhHNGdLbHh1SUNvZ1FYUjBZV05vSUdGdWVTQm1kVzVqZEdsdmJuTWdkR2hoZENCamIzVnNaQ0JpWlNCMWMyVmtJR0o1SUhSb1pTQlhiM0pyWlhJZ2FXNXphV1JsSUhSb1pTQkNiRzlpSUdKbGJHOTNMbHh1SUNvZ1FXeHNJR1oxYm1OMGFXOXVjeUJoY21VZ2JtRnRaV1FnYzI4Z2RHaGxlU0JqWVc0Z1ltVWdZV05qWlhOelpXUWdaMnh2WW1Gc2JIa3VJRk5wYm1ObElIZGxKM0psWEc0Z0tpQmthWEpsWTNSc2VTQnBibXBsWTNScGJtY2dkR2hsSUcxbGRHaHZaSE1nYVc1MGJ5QmhiaUJCY25KaGVTQmhibVFnZEdobGJpQmpZV3hzYVc1bklHQnFiMmx1WUNCMGFHVmNiaUFxSUdCMGIxTjBjbWx1WjJBZ2JXVjBhRzlrSUhkcGJHd2dZbVVnYVc1MmIydGxaQ0J2YmlCbFlXTm9JR1oxYm1OMGFXOXVJR0Z1WkNCM2FXeHNJR2x1YW1WamRDQmhJSFpoYkdsa1hHNGdLaUJ5WlhCeVpYTmxiblJoZEdsdmJpQnZaaUIwYUdVZ1puVnVZM1JwYjI0bmN5QnpiM1Z5WTJVdUlGUm9hWE1nWTI5dFpYTWdZWFFnWVNCamIzTjBJSE5wYm1ObElFSmhZbVZzWEc0Z0tpQnlaWGR5YVhSbGN5QjJZWEpwWVdKc1pTQnVZVzFsY3lCM2FHVnVJSGx2ZFNCZ2FXMXdiM0owWUNCaElHMXZaSFZzWlM0Z1ZHaHBjeUJwY3lCM2FIa2dlVzkxSjJ4c0lITmxaVnh1SUNvZ2RXNWtaWEp6WTI5eVpXUWdjSEp2Y0dWeWRHbGxjeUJpWldsdVp5QnBiWEJ2Y25SbFpDQmhibVFnZEdobGJpQnlaV0Z6YzJsbmJtVmtJSFJ2SUc1dmJpMTFibVJsY25OamIzSmxaRnh1SUNvZ2JtRnRaWE1nYVc0Z2JXOWtkV3hsY3lCMGFHRjBJR0Z5WlNCeVpYVnpaV1FnYUdWeVpTNWNiaUFxWEc0Z0tpQkFjbVYwZFhKdUlIdFBZbXBsWTNSOUlFRWdWMjl5YTJWeUlHbHVjM1JoYm1ObExseHVJQ292WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWTNKbFlYUmxLQ2tnZTF4dUlDQnNaWFFnZDI5eWEyVnlRbXh2WWlBOUlHNTFiR3c3WEc0Z0lHeGxkQ0IzYjNKclpYSWdQU0J1ZFd4c08xeHVYRzRnSUM4dklGTmxkQ0IxY0NCaElGZGxZbGR2Y210bGNpQnBaaUJoZG1GcGJHRmliR1V1WEc0Z0lHbG1JQ2hvWVhOWGIzSnJaWElwSUh0Y2JpQWdJQ0F2THlCRGIyNXpkSEoxWTNRZ2RHaGxJSGR2Y210bGNpQnlaWFZ6YVc1bklHTnZaR1VnWVd4eVpXRmtlU0J2Y21kaGJtbDZaV1FnYVc1MGJ5QnRiMlIxYkdWekxpQWdTMlZsY0Z4dUlDQWdJQzh2SUhSb2FYTWdZMjlrWlNCRlV6VWdjMmx1WTJVZ2QyVWdaRzhnYm05MElHZGxkQ0IwYVcxbElIUnZJSEJ5WlMxd2NtOWpaWE56SUdsMElHRnpJRVZUTmk1Y2JpQWdJQ0IzYjNKclpYSkNiRzlpSUQwZ2JtVjNJRUpzYjJJb1cxeHVJQ0FnSUNBZ1cxeHVJQ0FnSUNBZ0lDQXZMeUJTWlhWellXSnNaU0JCY25KaGVTQnRaWFJvYjJSekxseHVJQ0FnSUNBZ0lDQW5kbUZ5SUhOc2FXTmxJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbk5zYVdObE95Y3NYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXUmtJR0VnYm1GdFpYTndZV05sSUhSdklHRjBkR0ZqYUNCd2IyOXNJRzFsZEdodlpITWdkRzh1WEc0Z0lDQWdJQ0FnSUNkMllYSWdjRzl2YkhNZ1BTQjdmVHNuTEZ4dUlDQWdJQ0FnSUNBbmRtRnlJRzV2WkdWeklEMGdNRHNuTEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkhNZ2FXNGdZU0JuYkc5aVlXd2dZSFYxYVdSZ0lHWjFibU4wYVc5dUxseHVJQ0FnSUNBZ0lDQjFkV2xrTEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkNCMGFHVWdZV0pwYkdsMGVTQjBieUJ3Y205MFpXTjBJR1ZzWlcxbGJuUnpJR1p5YjIwZ1puSmxaU2RrSUcxbGJXOXllUzVjYmlBZ0lDQWdJQ0FnY0hKdmRHVmpkRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQWdJSFZ1Y0hKdmRHVmpkRVZzWlcxbGJuUXNYRzRnSUNBZ0lDQWdJR05zWldGdVRXVnRiM0o1TEZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRUZrWkNCcGJpQndiMjlzSUcxaGJtbHdkV3hoZEdsdmJpQnRaWFJvYjJSekxseHVJQ0FnSUNBZ0lDQmpjbVZoZEdWUWIyOXNMRnh1SUNBZ0lDQWdJQ0JwYm1sMGFXRnNhWHBsVUc5dmJITXNYRzRnSUNBZ0lDQWdJQ2RwYm1sMGFXRnNhWHBsVUc5dmJITW9KeUFySUhCdmIyeERiM1Z1ZENBcklDY3BPeWNzWEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRV1JrSUdsdUlFNXZaR1VnYldGdWFYQjFiR0YwYVc5dUxseHVJQ0FnSUNBZ0lDQW5kbUZ5SUhONWJtTk9iMlJsSUQwZ0p5QXJJSE41Ym1OT2IyUmxMRnh1WEc0Z0lDQWdJQ0FnSUM4dklFRmtaQ0JwYmlCMGFHVWdZV0pwYkdsMGVTQjBieUJ3WVhKelpVaFVUVXd1WEc0Z0lDQWdJQ0FnSUhCaGNuTmxTRlJOVEN4Y2JseHVJQ0FnSUNBZ0lDQW5kbUZ5SUcxaGEyVlFZWEp6WlhJZ1BTQW5JQ3NnYldGclpWQmhjbk5sY2l4Y2JpQWdJQ0FnSUNBZ0ozWmhjaUJ3WVhKelpYSWdQU0J0WVd0bFVHRnljMlZ5S0NrN0p5eGNibHh1SUNBZ0lDQWdJQ0F2THlCQlpHUWdhVzRnZEdobElIZHZjbXRsY2lCemIzVnlZMlV1WEc0Z0lDQWdJQ0FnSUhkdmNtdGxjbE52ZFhKalpTeGNibHh1SUNBZ0lDQWdJQ0F2THlCTlpYUmhjSEp2WjNKaGJXMXBibWNnZFhBZ2RHaHBjeUIzYjNKclpYSWdZMkZzYkM1Y2JpQWdJQ0FnSUNBZ0ozTjBZWEowZFhBb2MyVnNaaWs3SjF4dUlDQWdJQ0FnWFM1cWIybHVLQ2RjWEc0bktWeHVJQ0FnSUYwc0lIc2dkSGx3WlRvZ0oyRndjR3hwWTJGMGFXOXVMMnBoZG1GelkzSnBjSFFuSUgwcE8xeHVYRzRnSUNBZ0x5OGdRMjl1YzNSeWRXTjBJSFJvWlNCM2IzSnJaWElnWVc1a0lITjBZWEowSUdsMElIVndMbHh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0IzYjNKclpYSWdQU0J1WlhjZ1YyOXlhMlZ5S0ZWU1RDNWpjbVZoZEdWUFltcGxZM1JWVWt3b2QyOXlhMlZ5UW14dllpa3BPMXh1SUNBZ0lIMWNiaUFnSUNCallYUmphQ2hsS1NCN1hHNGdJQ0FnSUNCcFppQW9ZMjl1YzI5c1pTQW1KaUJqYjI1emIyeGxMbWx1Wm04cElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNXBibVp2S0Z3aVJtRnBiR1ZrSUhSdklHTnlaV0YwWlNCa2FXWm1hSFJ0YkNCM2IzSnJaWEpjSWl4bEtUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnU1dZZ2QyVWdZMkZ1Ym05MElHTnlaV0YwWlNCaElGZHZjbXRsY2l3Z2RHaGxiaUJrYVhOaFlteGxJSFJ5ZVdsdVp5QmhaMkZwYml3Z1lXeHNJSGR2Y210Y2JpQWdJQ0FnSUM4dklIZHBiR3dnYUdGd2NHVnVJRzl1SUhSb1pTQnRZV2x1SUZWSklIUm9jbVZoWkM1Y2JpQWdJQ0FnSUdoaGMxZHZjbXRsY2lBOUlHWmhiSE5sTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUIzYjNKclpYSTdYRzU5WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRoZXNlIGFyZSBnbG9iYWxseSBkZWZpbmVkIHRvIGF2b2lkIGlzc3VlcyB3aXRoIEpTSGludCB0aGlua2luZyB0aGF0IHdlJ3JlXG4vLyByZWZlcmVuY2luZyB1bmtub3duIGlkZW50aWZpZXJzLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzdGFydHVwO1xudmFyIHBhcnNlSFRNTDtcbnZhciBzeW5jTm9kZTtcbnZhciBwb29scztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBXZWIgV29ya2VyIHNvdXJjZSBjb2RlLiBBbGwgZ2xvYmFscyBoZXJlIGFyZSBkZWZpbmVkIGluIHRoZVxuICogd29ya2VyL2NyZWF0ZSBtb2R1bGUuIFRoaXMgYWxsb3dzIGNvZGUgc2hhcmluZyBhbmQgbGVzcyBkdXBsaWNhdGlvbiBzaW5jZVxuICogbW9zdCBvZiB0aGUgbG9naWMgaXMgaWRlbnRpY2FsIHRvIHRoZSBVSSB0aHJlYWQuXG4gKlxuICogQHBhcmFtIHdvcmtlciAtIEEgd29ya2VyIGluc3RhbmNlXG4gKi9cblxuZnVuY3Rpb24gc3RhcnR1cCh3b3JrZXIpIHtcbiAgdmFyIHBhdGNoZXMgPSBbXTtcbiAgdmFyIG9sZFRyZWUgPSBudWxsO1xuXG4gIC8vIENyZWF0ZSBhcnJheXMgdG8gaG9sZCBlbGVtZW50IGFkZGl0aW9ucyBhbmQgcmVtb3ZhbHMuXG4gIHBhdGNoZXMuYWRkaXRpb25zID0gW107XG4gIHBhdGNoZXMucmVtb3ZhbHMgPSBbXTtcblxuICAvKipcbiAgICogVHJpZ2dlcmVkIHdoZW5ldmVyIGEgYHBvc3RNZXNzYWdlYCBjYWxsIGlzIG1hZGUgb24gdGhlIFdvcmtlciBpbnN0YW5jZVxuICAgKiBmcm9tIHRoZSBVSSB0aHJlYWQuIFNpZ25hbHMgdGhhdCBzb21lIHdvcmsgbmVlZHMgdG8gb2NjdXIuIFdpbGwgcG9zdCBiYWNrXG4gICAqIHRvIHRoZSBtYWluIHRocmVhZCB3aXRoIHBhdGNoIGFuZCBub2RlIHRyYW5zZm9ybSByZXN1bHRzLlxuICAgKlxuICAgKiBAcGFyYW0gZSAtIFRoZSBub3JtYWxpemVkIGV2ZW50IG9iamVjdC5cbiAgICovXG4gIHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBkYXRhID0gZS5kYXRhO1xuICAgIHZhciBpc0lubmVyID0gZGF0YS5pc0lubmVyO1xuICAgIHZhciBuZXdUcmVlID0gbnVsbDtcblxuICAgIC8vIEFsd2F5cyB1bnByb3RlY3QgYWxsb2NhdGlvbnMgYmVmb3JlIHRoZSBzdGFydCBvZiBhIHJlbmRlciBjeWNsZS5cbiAgICBpZiAob2xkVHJlZSkge1xuICAgICAgdW5wcm90ZWN0RWxlbWVudChvbGRUcmVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhbiBgb2xkVHJlZWAgd2FzIHByb3ZpZGVkIGJ5IHRoZSBVSSB0aHJlYWQsIHVzZSB0aGF0IGluIHBsYWNlIG9mIHRoZVxuICAgIC8vIGN1cnJlbnQgYG9sZFRyZWVgLlxuICAgIGlmIChkYXRhLm9sZFRyZWUpIHtcbiAgICAgIG9sZFRyZWUgPSBkYXRhLm9sZFRyZWU7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGBuZXdUcmVlYCB3YXMgcHJvdmlkZWQgdG8gdGhlIHdvcmtlciwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0cnlpbmdcbiAgICAvLyB0byBjcmVhdGUgb25lIGZyb20gSFRNTCBzb3VyY2UuXG4gICAgaWYgKGRhdGEubmV3VHJlZSkge1xuICAgICAgbmV3VHJlZSA9IGRhdGEubmV3VHJlZTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBgbmV3VHJlZWAgd2FzIHByb3ZpZGVkLCB3ZSdsbCBoYXZlIHRvIHRyeSBhbmQgY3JlYXRlIG9uZSBmcm9tIHRoZVxuICAgIC8vIEhUTUwgc291cmNlIHByb3ZpZGVkLlxuICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhLm5ld0hUTUwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSBhIG5ldyB0cmVlLlxuICAgICAgICBuZXdUcmVlID0gcGFyc2VIVE1MKGRhdGEubmV3SFRNTCwgaXNJbm5lcik7XG5cbiAgICAgICAgLy8gSWYgdGhlIG9wZXJhdGlvbiBpcyBmb3IgYGlubmVySFRNTGAgdGhlbiB3ZSdsbCByZXRhaW4gdGhlIHByZXZpb3VzXG4gICAgICAgIC8vIHRyZWUncyBhdHRyaWJ1dGVzLCBub2RlTmFtZSwgYW5kIG5vZGVWYWx1ZSwgYW5kIG9ubHkgYWRqdXN0IHRoZVxuICAgICAgICAvLyBjaGlsZE5vZGVzLlxuICAgICAgICBpZiAoaXNJbm5lcikge1xuICAgICAgICAgIHZhciBjaGlsZE5vZGVzID0gbmV3VHJlZTtcblxuICAgICAgICAgIG5ld1RyZWUgPSB7XG4gICAgICAgICAgICBjaGlsZE5vZGVzOiBjaGlsZE5vZGVzLFxuICAgICAgICAgICAgYXR0cmlidXRlczogb2xkVHJlZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgZWxlbWVudDogb2xkVHJlZS5lbGVtZW50LFxuICAgICAgICAgICAgbm9kZU5hbWU6IG9sZFRyZWUubm9kZU5hbWUsXG4gICAgICAgICAgICBub2RlVmFsdWU6IG9sZFRyZWUubm9kZVZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLy8gU3luY2hyb25pemUgdGhlIG9sZCB2aXJ0dWFsIHRyZWUgd2l0aCB0aGUgbmV3IHZpcnR1YWwgdHJlZS4gIFRoaXMgd2lsbFxuICAgIC8vIHByb2R1Y2UgYSBzZXJpZXMgb2YgcGF0Y2hlcyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gdXBkYXRlIHRoZSBET00uXG4gICAgc3luY05vZGUuY2FsbChwYXRjaGVzLCBvbGRUcmVlLCBuZXdUcmVlKTtcblxuICAgIC8vIFByb3RlY3QgdGhlIGN1cnJlbnQgYG9sZFRyZWVgIHNvIHRoYXQgbm8gTm9kZXMgd2lsbCBiZSBhY2NpZGVudGFsbHlcbiAgICAvLyByZWN5Y2xlZCBpbiB0aGVcbiAgICBwcm90ZWN0RWxlbWVudChvbGRUcmVlKTtcblxuICAgIC8vIFNlbmQgdGhlIHBhdGNoZXMgYmFjayB0byB0aGUgdXNlcmxhbmQuXG4gICAgd29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIC8vIE5vZGUgb3BlcmF0aW9uYWwgY2hhbmdlcywgYWRkaXRpb25zIGFuZCByZW1vdmFscy5cbiAgICAgIG5vZGVzOiB7XG4gICAgICAgIGFkZGl0aW9uczogcGF0Y2hlcy5hZGRpdGlvbnMsXG4gICAgICAgIHJlbW92YWxzOiBwYXRjaGVzLnJlbW92YWxzXG4gICAgICB9LFxuXG4gICAgICAvLyBBbGwgdGhlIHBhdGNoZXMgdG8gYXBwbHkgdG8gdGhlIERPTS5cbiAgICAgIHBhdGNoZXM6IHBhdGNoZXNcbiAgICB9KTtcblxuICAgIC8vIFJlY3ljbGUgYWxsb2NhdGVkIG9iamVjdHMgYmFjayBpbnRvIHRoZSBwb29sLlxuICAgIGNsZWFuTWVtb3J5KCk7XG5cbiAgICAvLyBXaXBlIG91dCB0aGUgcGF0Y2hlcyBpbiBtZW1vcnkuXG4gICAgcGF0Y2hlcy5sZW5ndGggPSAwO1xuICAgIHBhdGNoZXMuYWRkaXRpb25zLmxlbmd0aCA9IDA7XG4gICAgcGF0Y2hlcy5yZW1vdmFscy5sZW5ndGggPSAwO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwzUnBiUzluYVhRdlpHbG1abWgwYld3dmJHbGlMM2R2Y210bGNpOXpiM1Z5WTJVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3pzN096czdPM0ZDUVdWWExFOUJRVTg3UVVGWUwwSXNTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxGRkJRVkVzUTBGQlF6dEJRVU5pTEVsQlFVa3NTMEZCU3l4RFFVRkRPenM3T3pzN096czdPMEZCVTBzc1UwRkJVeXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzUkRMRTFCUVVrc1QwRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU5xUWl4TlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU03T3p0QlFVZHVRaXhUUVVGUExFTkJRVU1zVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTjJRaXhUUVVGUExFTkJRVU1zVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXpzN096czdPenM3TzBGQlUzUkNMRkZCUVUwc1EwRkJReXhUUVVGVExFZEJRVWNzVlVGQlV5eERRVUZETEVWQlFVVTdRVUZETjBJc1VVRkJTU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTnNRaXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUXpOQ0xGRkJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXpzN08wRkJSMjVDTEZGQlFVa3NUMEZCVHl4RlFVRkZPMEZCUVVVc2MwSkJRV2RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkJSVHM3T3p0QlFVa3pReXhSUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZCUlN4aFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF6dExRVUZGT3pzN08wRkJTVGRETEZGQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVGRkxHRkJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRPMHRCUVVVN096czdVMEZKZUVNc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF5eFBRVUZQTEV0QlFVc3NVVUZCVVN4RlFVRkZPenRCUVVWNlF5eGxRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPenM3TzBGQlN6TkRMRmxCUVVrc1QwRkJUeXhGUVVGRk8wRkJRMWdzWTBGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRPenRCUVVWNlFpeHBRa0ZCVHl4SFFVRkhPMEZCUTFJc2MwSkJRVlVzUlVGQlZpeFZRVUZWTzBGQlExWXNjMEpCUVZVc1JVRkJSU3hQUVVGUExFTkJRVU1zVlVGQlZUdEJRVU01UWl4dFFrRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eFBRVUZQTzBGQlEzaENMRzlDUVVGUkxFVkJRVVVzVDBGQlR5eERRVUZETEZGQlFWRTdRVUZETVVJc2NVSkJRVk1zUlVGQlJTeFBRVUZQTEVOQlFVTXNVMEZCVXp0WFFVTTNRaXhEUVVGRE8xTkJRMGc3VDBGRFJqczdPenRCUVVsRUxGbEJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6czdPenRCUVVsNlF5eHJRa0ZCWXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE96czdRVUZIZUVJc1ZVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF6czdRVUZGYWtJc1YwRkJTeXhGUVVGRk8wRkJRMHdzYVVKQlFWTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1UwRkJVenRCUVVNMVFpeG5Ra0ZCVVN4RlFVRkZMRTlCUVU4c1EwRkJReXhSUVVGUk8wOUJRek5DT3pzN1FVRkhSQ3hoUVVGUExFVkJRVVVzVDBGQlR6dExRVU5xUWl4RFFVRkRMRU5CUVVNN096dEJRVWRJTEdWQlFWY3NSVUZCUlN4RFFVRkRPenM3UVVGSFpDeFhRVUZQTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOdVFpeFhRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRE4wSXNWMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBkQlF6ZENMRU5CUVVNN1EwRkRTQ0lzSW1acGJHVWlPaUl2YUc5dFpTOTBhVzB2WjJsMEwyUnBabVpvZEcxc0wyeHBZaTkzYjNKclpYSXZjMjkxY21ObExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzR2THlCVWFHVnpaU0JoY21VZ1oyeHZZbUZzYkhrZ1pHVm1hVzVsWkNCMGJ5QmhkbTlwWkNCcGMzTjFaWE1nZDJsMGFDQktVMGhwYm5RZ2RHaHBibXRwYm1jZ2RHaGhkQ0IzWlNkeVpWeHVMeThnY21WbVpYSmxibU5wYm1jZ2RXNXJibTkzYmlCcFpHVnVkR2xtYVdWeWN5NWNiblpoY2lCd1lYSnpaVWhVVFV3N1hHNTJZWElnYzNsdVkwNXZaR1U3WEc1MllYSWdjRzl2YkhNN1hHNWNiaThxS2x4dUlDb2dWR2hwY3lCcGN5QjBhR1VnVjJWaUlGZHZjbXRsY2lCemIzVnlZMlVnWTI5a1pTNGdRV3hzSUdkc2IySmhiSE1nYUdWeVpTQmhjbVVnWkdWbWFXNWxaQ0JwYmlCMGFHVmNiaUFxSUhkdmNtdGxjaTlqY21WaGRHVWdiVzlrZFd4bExpQlVhR2x6SUdGc2JHOTNjeUJqYjJSbElITm9ZWEpwYm1jZ1lXNWtJR3hsYzNNZ1pIVndiR2xqWVhScGIyNGdjMmx1WTJWY2JpQXFJRzF2YzNRZ2IyWWdkR2hsSUd4dloybGpJR2x6SUdsa1pXNTBhV05oYkNCMGJ5QjBhR1VnVlVrZ2RHaHlaV0ZrTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0IzYjNKclpYSWdMU0JCSUhkdmNtdGxjaUJwYm5OMFlXNWpaVnh1SUNvdlhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlCemRHRnlkSFZ3S0hkdmNtdGxjaWtnZTF4dUlDQjJZWElnY0dGMFkyaGxjeUE5SUZ0ZE8xeHVJQ0IyWVhJZ2IyeGtWSEpsWlNBOUlHNTFiR3c3WEc1Y2JpQWdMeThnUTNKbFlYUmxJR0Z5Y21GNWN5QjBieUJvYjJ4a0lHVnNaVzFsYm5RZ1lXUmthWFJwYjI1eklHRnVaQ0J5WlcxdmRtRnNjeTVjYmlBZ2NHRjBZMmhsY3k1aFpHUnBkR2x2Ym5NZ1BTQmJYVHRjYmlBZ2NHRjBZMmhsY3k1eVpXMXZkbUZzY3lBOUlGdGRPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlVjbWxuWjJWeVpXUWdkMmhsYm1WMlpYSWdZU0JnY0c5emRFMWxjM05oWjJWZ0lHTmhiR3dnYVhNZ2JXRmtaU0J2YmlCMGFHVWdWMjl5YTJWeUlHbHVjM1JoYm1ObFhHNGdJQ0FxSUdaeWIyMGdkR2hsSUZWSklIUm9jbVZoWkM0Z1UybG5ibUZzY3lCMGFHRjBJSE52YldVZ2QyOXlheUJ1WldWa2N5QjBieUJ2WTJOMWNpNGdWMmxzYkNCd2IzTjBJR0poWTJ0Y2JpQWdJQ29nZEc4Z2RHaGxJRzFoYVc0Z2RHaHlaV0ZrSUhkcGRHZ2djR0YwWTJnZ1lXNWtJRzV2WkdVZ2RISmhibk5tYjNKdElISmxjM1ZzZEhNdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3WVhKaGJTQmxJQzBnVkdobElHNXZjbTFoYkdsNlpXUWdaWFpsYm5RZ2IySnFaV04wTGx4dUlDQWdLaTljYmlBZ2QyOXlhMlZ5TG05dWJXVnpjMkZuWlNBOUlHWjFibU4wYVc5dUtHVXBJSHRjYmlBZ0lDQjJZWElnWkdGMFlTQTlJR1V1WkdGMFlUdGNiaUFnSUNCMllYSWdhWE5KYm01bGNpQTlJR1JoZEdFdWFYTkpibTVsY2p0Y2JpQWdJQ0IyWVhJZ2JtVjNWSEpsWlNBOUlHNTFiR3c3WEc1Y2JpQWdJQ0F2THlCQmJIZGhlWE1nZFc1d2NtOTBaV04wSUdGc2JHOWpZWFJwYjI1eklHSmxabTl5WlNCMGFHVWdjM1JoY25RZ2IyWWdZU0J5Wlc1a1pYSWdZM2xqYkdVdVhHNGdJQ0FnYVdZZ0tHOXNaRlJ5WldVcElIc2dkVzV3Y205MFpXTjBSV3hsYldWdWRDaHZiR1JVY21WbEtUc2dmVnh1WEc0Z0lDQWdMeThnU1dZZ1lXNGdZRzlzWkZSeVpXVmdJSGRoY3lCd2NtOTJhV1JsWkNCaWVTQjBhR1VnVlVrZ2RHaHlaV0ZrTENCMWMyVWdkR2hoZENCcGJpQndiR0ZqWlNCdlppQjBhR1ZjYmlBZ0lDQXZMeUJqZFhKeVpXNTBJR0J2YkdSVWNtVmxZQzVjYmlBZ0lDQnBaaUFvWkdGMFlTNXZiR1JVY21WbEtTQjdJRzlzWkZSeVpXVWdQU0JrWVhSaExtOXNaRlJ5WldVN0lIMWNibHh1SUNBZ0lDOHZJRWxtSUhSb1pTQmdibVYzVkhKbFpXQWdkMkZ6SUhCeWIzWnBaR1ZrSUhSdklIUm9aU0IzYjNKclpYSXNJSFZ6WlNCMGFHRjBJR2x1YzNSbFlXUWdiMllnZEhKNWFXNW5YRzRnSUNBZ0x5OGdkRzhnWTNKbFlYUmxJRzl1WlNCbWNtOXRJRWhVVFV3Z2MyOTFjbU5sTGx4dUlDQWdJR2xtSUNoa1lYUmhMbTVsZDFSeVpXVXBJSHNnYm1WM1ZISmxaU0E5SUdSaGRHRXVibVYzVkhKbFpUc2dmVnh1WEc0Z0lDQWdMeThnU1dZZ2JtOGdZRzVsZDFSeVpXVmdJSGRoY3lCd2NtOTJhV1JsWkN3Z2QyVW5iR3dnYUdGMlpTQjBieUIwY25rZ1lXNWtJR055WldGMFpTQnZibVVnWm5KdmJTQjBhR1ZjYmlBZ0lDQXZMeUJJVkUxTUlITnZkWEpqWlNCd2NtOTJhV1JsWkM1Y2JpQWdJQ0JsYkhObElHbG1JQ2gwZVhCbGIyWWdaR0YwWVM1dVpYZElWRTFNSUQwOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdMeThnUTJGc1kzVnNZWFJsSUdFZ2JtVjNJSFJ5WldVdVhHNGdJQ0FnSUNCdVpYZFVjbVZsSUQwZ2NHRnljMlZJVkUxTUtHUmhkR0V1Ym1WM1NGUk5UQ3dnYVhOSmJtNWxjaWs3WEc1Y2JpQWdJQ0FnSUM4dklFbG1JSFJvWlNCdmNHVnlZWFJwYjI0Z2FYTWdabTl5SUdCcGJtNWxja2hVVFV4Z0lIUm9aVzRnZDJVbmJHd2djbVYwWVdsdUlIUm9aU0J3Y21WMmFXOTFjMXh1SUNBZ0lDQWdMeThnZEhKbFpTZHpJR0YwZEhKcFluVjBaWE1zSUc1dlpHVk9ZVzFsTENCaGJtUWdibTlrWlZaaGJIVmxMQ0JoYm1RZ2IyNXNlU0JoWkdwMWMzUWdkR2hsWEc0Z0lDQWdJQ0F2THlCamFHbHNaRTV2WkdWekxseHVJQ0FnSUNBZ2FXWWdLR2x6U1c1dVpYSXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHTm9hV3hrVG05a1pYTWdQU0J1WlhkVWNtVmxPMXh1WEc0Z0lDQWdJQ0FnSUc1bGQxUnlaV1VnUFNCN1hHNGdJQ0FnSUNBZ0lDQWdZMmhwYkdST2IyUmxjeXhjYmlBZ0lDQWdJQ0FnSUNCaGRIUnlhV0oxZEdWek9pQnZiR1JVY21WbExtRjBkSEpwWW5WMFpYTXNYRzRnSUNBZ0lDQWdJQ0FnWld4bGJXVnVkRG9nYjJ4a1ZISmxaUzVsYkdWdFpXNTBMRnh1SUNBZ0lDQWdJQ0FnSUc1dlpHVk9ZVzFsT2lCdmJHUlVjbVZsTG01dlpHVk9ZVzFsTEZ4dUlDQWdJQ0FnSUNBZ0lHNXZaR1ZXWVd4MVpUb2diMnhrVkhKbFpTNXViMlJsVm1Gc2RXVmNiaUFnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJUZVc1amFISnZibWw2WlNCMGFHVWdiMnhrSUhacGNuUjFZV3dnZEhKbFpTQjNhWFJvSUhSb1pTQnVaWGNnZG1seWRIVmhiQ0IwY21WbExpQWdWR2hwY3lCM2FXeHNYRzRnSUNBZ0x5OGdjSEp2WkhWalpTQmhJSE5sY21sbGN5QnZaaUJ3WVhSamFHVnpJSFJvWVhRZ2QybHNiQ0JpWlNCbGVHVmpkWFJsWkNCMGJ5QjFjR1JoZEdVZ2RHaGxJRVJQVFM1Y2JpQWdJQ0J6ZVc1alRtOWtaUzVqWVd4c0tIQmhkR05vWlhNc0lHOXNaRlJ5WldVc0lHNWxkMVJ5WldVcE8xeHVYRzRnSUNBZ0x5OGdVSEp2ZEdWamRDQjBhR1VnWTNWeWNtVnVkQ0JnYjJ4a1ZISmxaV0FnYzI4Z2RHaGhkQ0J1YnlCT2IyUmxjeUIzYVd4c0lHSmxJR0ZqWTJsa1pXNTBZV3hzZVZ4dUlDQWdJQzh2SUhKbFkzbGpiR1ZrSUdsdUlIUm9aVnh1SUNBZ0lIQnliM1JsWTNSRmJHVnRaVzUwS0c5c1pGUnlaV1VwTzF4dVhHNGdJQ0FnTHk4Z1UyVnVaQ0IwYUdVZ2NHRjBZMmhsY3lCaVlXTnJJSFJ2SUhSb1pTQjFjMlZ5YkdGdVpDNWNiaUFnSUNCM2IzSnJaWEl1Y0c5emRFMWxjM05oWjJVb2UxeHVJQ0FnSUNBZ0x5OGdUbTlrWlNCdmNHVnlZWFJwYjI1aGJDQmphR0Z1WjJWekxDQmhaR1JwZEdsdmJuTWdZVzVrSUhKbGJXOTJZV3h6TGx4dUlDQWdJQ0FnYm05a1pYTTZJSHRjYmlBZ0lDQWdJQ0FnWVdSa2FYUnBiMjV6T2lCd1lYUmphR1Z6TG1Ga1pHbDBhVzl1Y3l4Y2JpQWdJQ0FnSUNBZ2NtVnRiM1poYkhNNklIQmhkR05vWlhNdWNtVnRiM1poYkhOY2JpQWdJQ0FnSUgwc1hHNWNiaUFnSUNBZ0lDOHZJRUZzYkNCMGFHVWdjR0YwWTJobGN5QjBieUJoY0hCc2VTQjBieUIwYUdVZ1JFOU5MbHh1SUNBZ0lDQWdjR0YwWTJobGN6b2djR0YwWTJobGMxeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ0x5OGdVbVZqZVdOc1pTQmhiR3h2WTJGMFpXUWdiMkpxWldOMGN5QmlZV05ySUdsdWRHOGdkR2hsSUhCdmIyd3VYRzRnSUNBZ1kyeGxZVzVOWlcxdmNua29LVHRjYmx4dUlDQWdJQzh2SUZkcGNHVWdiM1YwSUhSb1pTQndZWFJqYUdWeklHbHVJRzFsYlc5eWVTNWNiaUFnSUNCd1lYUmphR1Z6TG14bGJtZDBhQ0E5SURBN1hHNGdJQ0FnY0dGMFkyaGxjeTVoWkdScGRHbHZibk11YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0J3WVhSamFHVnpMbkpsYlc5MllXeHpMbXhsYm1kMGFDQTlJREE3WEc0Z0lIMDdYRzU5WEc0aVhYMD0iLCJcbnZhciBOYXRpdmVDdXN0b21FdmVudCA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuZnVuY3Rpb24gdXNlTmF0aXZlICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcCA9IG5ldyBOYXRpdmVDdXN0b21FdmVudCgnY2F0JywgeyBkZXRhaWw6IHsgZm9vOiAnYmFyJyB9IH0pO1xuICAgIHJldHVybiAgJ2NhdCcgPT09IHAudHlwZSAmJiAnYmFyJyA9PT0gcC5kZXRhaWwuZm9vO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgYEN1c3RvbUV2ZW50YCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQuQ3VzdG9tRXZlbnRcbiAqXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IE5hdGl2ZUN1c3RvbUV2ZW50IDpcblxuLy8gSUUgPj0gOVxuJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID8gZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfSBlbHNlIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIGU7XG59IDpcblxuLy8gSUUgPD0gOFxuZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gIGUudHlwZSA9IHR5cGU7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmJ1YmJsZXMgPSBCb29sZWFuKHBhcmFtcy5idWJibGVzKTtcbiAgICBlLmNhbmNlbGFibGUgPSBCb29sZWFuKHBhcmFtcy5jYW5jZWxhYmxlKTtcbiAgICBlLmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gIH0gZWxzZSB7XG4gICAgZS5idWJibGVzID0gZmFsc2U7XG4gICAgZS5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgZS5kZXRhaWwgPSB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG4iXX0=
