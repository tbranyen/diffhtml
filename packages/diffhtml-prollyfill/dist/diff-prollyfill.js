(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diff = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableProllyfill = enableProllyfill;

var _diffhtml = require('diffhtml');

Object.keys(_diffhtml).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _diffhtml[key];
    }
  });
});


/**
 * By calling this function your browser environment is enhanced globally. This
 * project would love to hit the standards track and allow all developers to
 * benefit from the performance gains of DOM diffing.
 */
function enableProllyfill() {
  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'diffHTML', {
    configurable: true,
    value: _diffhtml.html
  });

  // Exposes the `html` tagged template helper globally so that developers
  // can trivially craft VDOMs.
  Object.defineProperty(window, 'diffUse', {
    configurable: true,
    value: _diffhtml.use
  });

  // Allows a developer to create Virtual Tree Elements.
  Object.defineProperty(document, 'createTreeElement', {
    configurable: true,
    value: function value(nodeName, attributes, childNodes) {
      return (0, _diffhtml.createElement)(nodeName, attributes, childNodes);
    }
  });

  // Allows a developer to add transition state callbacks.
  Object.defineProperty(document, 'addTransitionState', {
    configurable: true,
    value: function value(state, callback) {
      (0, _diffhtml.addTransitionState)(state, callback);
    }
  });

  // Allows a developer to remove transition state callbacks.
  Object.defineProperty(document, 'removeTransitionState', {
    configurable: true,
    value: function value(state, callback) {
      (0, _diffhtml.removeTransitionState)(state, callback);
    }
  });

  // Look for the following constructors and filter down to as many valid as
  // possible.
  var constructors = [typeof Element !== 'undefined' ? Element : undefined, typeof HTMLElement !== 'undefined' ? HTMLElement : undefined, typeof ShadowRoot !== 'undefined' ? ShadowRoot : undefined, typeof DocumentFragment !== 'undefined' ? DocumentFragment : undefined].filter(Boolean);

  // Exposes the API into the Element, ShadowDOM, and DocumentFragment
  // constructors.
  constructors.forEach(function (Ctor) {
    Object.defineProperty(Ctor.prototype, 'diffInnerHTML', {
      configurable: true,
      set: function set(newHTML) {
        (0, _diffhtml.innerHTML)(this, newHTML);
      }
    });

    // Allows a developer to set the `outerHTML` of an element.
    Object.defineProperty(Ctor.prototype, 'diffOuterHTML', {
      configurable: true,
      set: function set(newHTML) {
        (0, _diffhtml.outerHTML)(this, newHTML);
      }
    });

    // Allows a developer to diff the current element with a new element.
    Object.defineProperty(Ctor.prototype, 'diffElement', {
      configurable: true,
      value: function value(newElement, options) {
        (0, _diffhtml.element)(this, newElement, options);
      }
    });

    // Releases the retained memory.
    Object.defineProperty(Ctor.prototype, 'diffRelease', {
      configurable: true,
      value: function value() {
        (0, _diffhtml.releaseNode)(this);
      }
    });
  });
}

// Expose all diffHTML properties/methods, making this a direct drop in
// replacement.

},{"diffhtml":"diffhtml"}]},{},[1])(1)
});