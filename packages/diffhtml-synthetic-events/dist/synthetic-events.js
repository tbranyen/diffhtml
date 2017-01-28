(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.syntheticEvents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var useCapture = ['onload', 'onunload', 'onscroll', 'onfocus', 'onblur', 'onloadstart', 'onprogress', 'onerror', 'onabort', 'onload', 'onloadend', 'onpointerenter', 'onpointerleave'];

var eventNames = [];
var handlers = new Map();
var bounded = new Set();

// Ensure we don't get user added event/properties.
var cloneDoc = document.cloneNode();

// Fill up event names.
for (var name in cloneDoc) {
  if (name.indexOf('on') === 0) {
    eventNames.push(name);
  }
}

var SyntheticEvent = function SyntheticEvent() {
  _classCallCheck(this, SyntheticEvent);
};

var cloneEvent = function cloneEvent(ev) {
  var ov = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var newEvent = new SyntheticEvent();

  // Copy over original event getters/setters first, will need some extra
  // intelligence to ensure getters/setters work, thx @kofifus.
  for (var key in ev) {
    var desc = Object.getOwnPropertyDescriptor(ev, key);

    if (desc && (desc.get || desc.set)) {
      Object.defineProperty(newEvent, key, desc);
    } else {
      newEvent[key] = ev[key];
    }
  }

  // Copy over overrides.
  for (var _key in ov) {
    newEvent[_key] = ov[_key];
  }

  Object.setPrototypeOf(newEvent, ev);

  return newEvent;
};

var getShadowRoot = function getShadowRoot(node) {
  while (node = node.parentNode) {
    if (node.toString() === "[object ShadowRoot]") {
      return node;
    }
  }

  return false;
};

// Set up global event delegation, once clicked call the saved handlers.
var bindEventsTo = function bindEventsTo(domNode) {
  var rootNode = getShadowRoot(domNode) || domNode.ownerDocument;
  var addEventListener = rootNode.addEventListener;


  if (bounded.has(rootNode)) {
    return false;
  }

  bounded.add(rootNode);

  eventNames.forEach(function (eventName) {
    return addEventListener(eventName.slice(2), function (ev) {
      var target = ev.target;
      var eventHandler = null;

      var path = ev.path ? ev.path : ev.composedPath ? ev.composedPath() : [];

      // If we were unable to get the path via some kind of standard approach,
      // build it up manually.
      if (!path.length) {
        for (var node = target; node; node = node.parentNode) {
          path.push(node);
        }
      }

      for (var i = 0; i < path.length; i++) {
        var _node = path[i];

        if (handlers.has(_node)) {
          var hasEventHandler = handlers.get(_node)[eventName];

          if (hasEventHandler) {
            eventHandler = hasEventHandler;
          }

          break;
        }
      }

      var syntheticEvent = cloneEvent(ev, {
        stopPropagation: function stopPropagation() {},
        preventDefault: function preventDefault() {},

        nativeEvent: ev
      });
      eventHandler && eventHandler(syntheticEvent);
    }, useCapture.includes(eventName) ? true : false);
  });
};

var syntheticEvents = function syntheticEvents() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function () {
    return function (_ref) {
      var state = _ref.state,
          patches = _ref.patches;
      var NodeCache = state.internals.NodeCache;
      var SET_ATTRIBUTE = patches.SET_ATTRIBUTE,
          REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;


      if (SET_ATTRIBUTE.length) {
        for (var i = 0; i < SET_ATTRIBUTE.length; i += 3) {
          var vTree = SET_ATTRIBUTE[i];
          var _name = SET_ATTRIBUTE[i + 1];
          var value = SET_ATTRIBUTE[i + 2];

          var domNode = NodeCache.get(vTree);
          var eventName = _name.toLowerCase();

          // Remove inline event binding from element and add to handlers.
          if (eventNames.includes(eventName)) {
            var handler = domNode[_name];
            domNode[eventName] = undefined;

            var newHandlers = handlers.get(domNode) || {};

            // If the value passed is a function, that's what we're looking for.
            if (typeof handler === 'function') {
              newHandlers[eventName] = handler;
            }
            // If the value passed is a string name for a global function, use
            // that.
            else if (typeof window[handler] === 'function') {
                newHandlers[eventName] = window[handler];
              }
              // Remove the event association if the value passed was not a
              // function.
              else {
                  delete newHandlers[eventName];
                }

            handlers.set(domNode, newHandlers);
            bindEventsTo(domNode);
          }
        }
      }

      if (REMOVE_ATTRIBUTE.length) {
        for (var _i = 0; _i < REMOVE_ATTRIBUTE.length; _i += 2) {
          var _vTree = REMOVE_ATTRIBUTE[_i];
          var _name2 = REMOVE_ATTRIBUTE[_i + 1];

          var _domNode = NodeCache.get(_vTree);
          var _eventName = _name2.toLowerCase();

          // Remove event binding from element and instead add to handlers.
          if (eventNames.includes(_eventName)) {
            var _newHandlers = handlers.get(_domNode) || {};
            delete _newHandlers[_eventName];
            handlers.set(_domNode, _newHandlers);
          }
        }
      }
    };
  };
};

exports.default = syntheticEvents;
module.exports = exports['default'];

},{}]},{},[1])(1)
});