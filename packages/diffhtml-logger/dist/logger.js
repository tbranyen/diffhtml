(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logger = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var identity = function identity(x) {
  return x;
};

/**
 * Re-usable log function. Used for during render and after render.
 *
 * @param message - Prefix for the console output.
 * @param method - Which console method to call
 * @param color - Which color styles to use
 * @param date - A date object to render
 * @param args - Contains: node, oldTree, newTree, patches, promises
 * @param options - Middleware options
 */
var log = function log(message, method, color, date, args, options) {
  var node = args.node;
  var oldTree = args.oldTree;
  var newTree = args.newTree;
  var patches = args.patches;
  var promises = args.promises;


  console[method](message, color, date.toLocaleString(), date.getMilliseconds() + 'ms');

  console.log('%cnode %O', 'font-weight: bold; color: #333', node);
  console.log('%coldTree %O newTree %O', 'font-weight: bold; color: #333', oldTree, newTree);

  if (patches) {
    var filtered = patches.filter(options.filterPatches || identity);

    console.log('%cpatches %O', 'font-weight: bold; color: #333', filtered);
  }

  // Don't clutter the output if there aren't any promises.
  if (promises && promises.length) {
    console.log('%ctransition promises %O', 'font-weight: bold; color: #333', promises);
  }

  console.groupEnd();
};

/**
 * Called when rendering starts.
 *
 * @param {Object} start - A JavaScript Date for the start of rendering
 * @return {Function} - A closure to dig into the middleware flow more
 */

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return function (opts) {
    var start = new Date();

    /**
     * Digs into the middleware methods.
     *
     * @param {Object} args - Arguments to be passed to log rendering.
     * @return {Function} - One final closure indicating rendering has completed
     */
    return function (args) {
      log('%c</diffHTML> render transaction started', 'groupCollapsed', 'color: #FF0066', start, Object.assign(args, opts), options);

      /**
       * Rendering has completed so render out another group.
       */
      return function (end) {
        return log('%c</diffHTML> render transaction ended  ', 'group', 'color: #FF78B2', new Date(), Object.assign(args, end, opts), options);
      };
    };
  };
};

module.exports = exports['default'];

},{}]},{},[1])(1)
});