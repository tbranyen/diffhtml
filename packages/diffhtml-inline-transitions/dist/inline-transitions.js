(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.inlineTransitions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// Store maps of elements to handlers that are associated to transitions.
var transitionsMap = {
  attached: new Map(),
  detached: new Map(),
  replaced: new Map(),
  attributeChanged: new Map(),
  textChanged: new Map()
};

// Internal global transition state handlers, allows us to bind once and match.
var boundHandlers = [];

/**
 * Binds inline transitions to the parent element and triggers for any matching
 * nested children.
 */
module.exports = function (_ref) {
  var addTransitionState = _ref.addTransitionState;
  var removeTransitionState = _ref.removeTransitionState;

  // Monitors whenever an element changes an attribute, if the attribute
  // is a valid state name, add this element into the related Set.
  var attributeChanged = function attributeChanged(element, name, oldVal, newVal) {
    var map = transitionsMap[name];

    // Abort early if not a valid transition or if the new value exists, but
    // isn't a function.
    if (!map || newVal && typeof newVal !== 'function') {
      return;
    }

    // Add or remove based on the value existence and type.
    map[typeof newVal === 'function' ? 'set' : 'delete'](element, newVal);
  };

  // This will unbind any internally bound transition states.
  var unsubscribe = function unsubscribe() {
    // Unbind all the transition states.
    removeTransitionState('attributeChanged', attributeChanged);

    // Remove all elements from the internal cache.
    Object.keys(transitionsMap).forEach(function (name) {
      var map = transitionsMap[name];

      // Unbind the associated global handler.
      removeTransitionState(name, boundHandlers.shift());

      // Empty the associated element set.
      map.clear();
    });

    // Empty the bound handlers.
    boundHandlers.length = 0;
  };

  // If this function gets repeatedly called, unbind the previous to avoid doubling up.
  unsubscribe();

  // Set a "global" `attributeChanged` to monitor all elements for transition
  // states being attached.
  addTransitionState('attributeChanged', attributeChanged);

  // Add a transition for every type.
  Object.keys(transitionsMap).forEach(function (name) {
    var map = transitionsMap[name];

    var handler = function handler(child) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      // If there are no elements to match here, abort.
      if (!map.size) {
        return;
      }
      // If the child element triggered in the transition is the root element,
      // this is an easy lookup for the handler.
      else if (map.has(child)) {
          return map.get(child).apply(child, [child].concat(rest));
        }
        // The last resort is looping through all the registered elements to see
        // if the child is contained within. If so, it aggregates all the valid
        // handlers and if they return Promises return them into a `Promise.all`.
        else {
            var _ret = function () {
              var retVal = [];

              // Last resort check for child.
              map.forEach(function (fn, element) {
                if (element.contains(child)) {
                  retVal.push(fn.apply(child, [element].concat(child, rest)));
                }
              });

              var hasPromise = retVal.some(function (ret) {
                return Boolean(ret.then);
              });

              // This is the only time the return value matters.
              if (hasPromise) {
                return {
                  v: Promise.all(retVal)
                };
              }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
    };

    // Save the handler for later unbinding.
    boundHandlers.push(handler);

    // Add the state handler.
    addTransitionState(name, handler);
  });

  return unsubscribe;
};

},{}]},{},[1])(1)
});