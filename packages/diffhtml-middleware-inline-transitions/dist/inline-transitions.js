(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.inlineTransitions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inlineTransitions;

var _transition = require('diffhtml/dist/cjs/transition');

var assign = Object.assign,
    keys = Object.keys;


var eventsToTransitionName = {
  attributechanged: 'attributeChanged',
  textchanged: 'textChanged'
};

// Store maps of elements to handlers that are associated to transitions.
var transitionsMap = {
  attached: new Map(),
  detached: new Map(),
  replaced: new Map(),
  attributechanged: new Map(),
  textchanged: new Map()
};

// Internal global transition state handlers, allows us to bind once and match.
var boundHandlers = [];

/**
 * Binds inline transitions to the parent element and triggers for any matching
 * nested children.
 */
function inlineTransitions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Monitors whenever an element changes an attribute, if the attribute is a
  // valid state name, add this element into the related Set.
  var attributeChanged = function attributeChanged(domNode, name, oldVal, newVal) {
    var prefix = name.toLowerCase().slice(0, 2);

    // Don't bother with non-events.
    if (prefix !== 'on') {
      return;
    }

    // Normalize the event name to
    name = name.toLowerCase().slice(2);

    var map = transitionsMap[name];
    var isFunction = typeof newVal === 'function';

    // Abort early if not a valid transition or if the new value exists, but
    // isn't a function.
    if (!map || newVal && !isFunction) {
      return;
    }

    // Add or remove based on the value existence and type.
    map[isFunction ? 'set' : 'delete'](domNode, newVal);
  };

  var subscribe = function subscribe() {
    (0, _transition.addTransitionState)('attributeChanged', attributeChanged);

    // Add a transition for every type.
    keys(transitionsMap).forEach(function (name) {
      var map = transitionsMap[name];
      var transitionName = eventsToTransitionName[name] || name;

      var handler = function handler(child) {
        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        // If there are no elements to match here, abort.
        if (!map.size) {
          return;
        }

        // If the child element triggered in the transition is the root
        // element, this is an easy lookup for the handler.
        if (map.has(child)) {
          return map.get(child).apply(undefined, [child, child].concat(rest));
        }
        // The last resort is looping through all the registered elements to
        // see if the child is contained within. If so, it aggregates all the
        // valid handlers and if they return Promises return them into a
        // `Promise.all`.
        else {
            var retVal = [];

            // Last resort check for child.
            map.forEach(function (fn, element) {
              if (element.contains(child)) {
                retVal.push(fn.apply(child, [element].concat(child, rest)));
              }
            });

            var hasPromise = retVal.some(function (ret) {
              return Boolean(ret && ret.then);
            });

            // This is the only time the return value matters.
            if (hasPromise) {
              return Promise.all(retVal);
            }
          }
      };

      // Save the handler for later unbinding.
      boundHandlers.push(handler);

      // Add the state handler.
      (0, _transition.addTransitionState)(transitionName, handler);
    });
  };

  // This will unbind any internally bound transition states.
  var unsubscribe = function unsubscribe() {
    // Unbind all the transition states.
    (0, _transition.removeTransitionState)('attributeChanged', attributeChanged);

    // Remove all elements from the internal cache.
    keys(transitionsMap).forEach(function (name) {
      var map = transitionsMap[name];
      var transitionName = eventsToTransitionName[name] || name;

      // Unbind the associated global handler.
      (0, _transition.removeTransitionState)(transitionName, boundHandlers.shift());

      // Empty the associated element set.
      map.clear();
    });

    // Empty the bound handlers.
    boundHandlers.length = 0;
  };

  return assign(function inlineTransitionsTask() {}, { subscribe: subscribe, unsubscribe: unsubscribe });
}
module.exports = exports['default'];

},{"diffhtml/dist/cjs/transition":3}],2:[function(require,module,exports){
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.runTransitions = runTransitions;

var _caches = require('./util/caches');

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Available transition states.
const stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(stateName => _caches.TransitionCache.set(stateName, new Set()));

function addTransitionState(stateName, callback) {
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  _caches.TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (_process2.default.env.NODE_ENV !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }
  }

  // Remove all transition callbacks from state.
  if (!callback && stateName) {
    _caches.TransitionCache.get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {
      _caches.TransitionCache.get(stateName).delete(callback);
    }
    // Remove all callbacks.
    else {
        for (let i = 0; i < stateNames.length; i++) {
          _caches.TransitionCache.get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName, ...args) {
  const set = _caches.TransitionCache.get(setName);
  const promises = [];

  if (!set.size) {
    return promises;
  }

  // Ignore text nodes.
  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  }

  // Run each transition callback, if on the attached/detached.
  set.forEach(callback => {
    const retVal = callback(...args);

    // Is a `thennable` object or Native Promise.
    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    const element = args[0];

    [...element.childNodes].forEach(childNode => {
      promises.push(...runTransitions(setName, childNode, ...args.slice(1)));
    });
  }

  return promises;
}
},{"./util/caches":4,"./util/process":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Associates DOM Nodes with state objects.
const StateCache = exports.StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
const NodeCache = exports.NodeCache = new Map();

// Cache transition functions.
const TransitionCache = exports.TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
const MiddlewareCache = exports.MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();
},{}],5:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const normalize = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
};

exports.default = Object.defineProperty({}, 'env', {
  enumerable: true,
  get: () => normalize.env
});
}).call(this,require('_process'))
},{"_process":2}]},{},[1])(1)
});