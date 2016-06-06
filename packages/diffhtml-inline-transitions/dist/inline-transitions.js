(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.inlineTransitions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var _this = this;

  var

  /**
   * Binds inline transitions to the parent element and triggers for any matching
   * nested children.
   */
  addTransitionState = _ref.addTransitionState;
  var removeTransitionState = _ref.removeTransitionState;

  // Set a "global" `attributeChanged` to monitor all elements for transition
  // states being attached.
  addTransitionState('attributeChanged', function (element, name, oldVal, newVal) {
    var internalMap = transitionsMap.get(element) || {};

    if (states.indexOf(name) === -1) {
      return;
    }

    if (newVal) {
      transitionsMap.set(element, Object.assign(internalMap, _defineProperty({}, name, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (element.contains(args[0])) {
          return newVal.apply(_this, [element].concat(args));
        }
      })));

      addTransitionState(name, transitionsMap[name]);
    } else if (transitionsMap[name]) {
      removeTransitionState(name, transitionsMap[name]);
    }
  });
};

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var states = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

var transitionsMap = new WeakMap();module.exports = exports['default'];

},{}]},{},[1])(1)
});