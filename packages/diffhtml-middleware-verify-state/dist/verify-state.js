(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.verifyState = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getValue = function getValue(vTree, keyName) {
  if (vTree instanceof Node && vTree.attributes) {
    return vTree.attributes[keyName].value || vTree[keyName];
  } else {
    return vTree.attributes[keyName];
  }
};

var setupDebugger = function setupDebugger(options) {
  return function (message) {
    if (options.debug) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  };
};

var cloneTree = exports.cloneTree = function cloneTree(tree) {
  return tree ? assign({}, tree, {
    attributes: assign({}, tree.attributes),
    childNodes: tree.childNodes.map(function (vTree) {
      return cloneTree(vTree);
    })
  }) : null;
};

// Support loading diffHTML in non-browser environments.
var element = global.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
var decodeEntities = exports.decodeEntities = function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || string.indexOf('&') === -1) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
};

var flattenFragments = function flattenFragments(vTree) {
  vTree.childNodes.forEach(function (childNode, i) {
    if (childNode.nodeType === 11) {
      // Flatten the nodes into the position.
      vTree.childNodes.splice.apply(vTree.childNodes, [i, 1].concat(_toConsumableArray(childNode.childNodes)));
      childNode.childNodes.forEach(function (childNode) {
        return flattenFragments(childNode);
      });
      return;
    }

    flattenFragments(childNode);
  });

  return vTree;
};

var compareTrees = exports.compareTrees = function compareTrees(options, transaction, oldTree, newTree) {
  var promises = transaction.promises,
      NodeCache = transaction.state.internals.NodeCache;


  var debug = setupDebugger(options);

  var oldAttrKeys = Object.keys(oldTree.attributes || {}).sort();
  var newAttrKeys = Object.keys(newTree.attributes || {}).sort();

  var oldTreeIsNode = oldTree instanceof Node;
  var oldLabel = oldTreeIsNode ? 'ON DOM NODE' : 'OLD';

  if (oldTreeIsNode) {
    newTree = flattenFragments(newTree);
  }

  var oldValue = decodeEntities(oldTree.nodeValue || '').replace(/\r?\n|\r/g, '');
  var newValue = decodeEntities(newTree.nodeValue || '').replace(/\r?\n|\r/g, '');

  if (oldTree.nodeName.toLowerCase() !== newTree.nodeName.toLowerCase() && newTree.nodeType !== 11) {
    debug('[Mismatched nodeName] ' + oldLabel + ': ' + oldTree.nodeName + ' NEW TREE: ' + newTree.nodeName);
  } else if (oldTree.nodeValue && newTree.nodeValue && oldValue !== newValue) {
    debug('[Mismatched nodeValue] ' + oldLabel + ': ' + oldValue + ' NEW TREE: ' + newValue);
  } else if (oldTree.nodeType !== newTree.nodeType && newTree.nodeType !== 11) {
    debug('[Mismatched nodeType] ' + oldLabel + ': ' + oldTree.nodeType + ' NEW TREE: ' + newTree.nodeType);
  } else if (oldTree.childNodes.length !== newTree.childNodes.length) {
    debug('[Mismatched childNodes length] ' + oldLabel + ': ' + oldTree.childNodes.length + ' NEW TREE: ' + newTree.childNodes.length);
  }

  if (oldTreeIsNode && oldTree.attributes) {
    oldAttrKeys = [].concat(_toConsumableArray(oldTree.attributes)).map(function (s) {
      return String(s.name);
    }).sort();
  }

  if (!oldTreeIsNode && !NodeCache.has(oldTree)) {
    debug('Tree does not have an associated DOM Node');
  }

  // Look for attribute differences.
  if (newTree.nodeType !== 11) {
    for (var i = 0; i < oldAttrKeys.length; i++) {
      var _oldValue = getValue(oldTree, oldAttrKeys[i]) || '';
      var _newValue = getValue(newTree, newAttrKeys[i]) || '';

      // If names are different report it out.
      if (oldAttrKeys[i].toLowerCase() !== newAttrKeys[i].toLowerCase()) {
        if (!newAttrKeys[i]) {
          debug('[Unexpected attribute] ' + oldLabel + ': ' + oldAttrKeys[i] + '="' + _oldValue + '"');
        } else if (!oldAttrKeys[i]) {
          debug('[Unexpected attribute] IN NEW TREE: ' + newAttrKeys[i] + '="' + _newValue + '"');
        } else {
          debug('[Unexpected attribute] ' + oldLabel + ': ' + oldAttrKeys[i] + '="' + _oldValue + '" IN NEW TREE: ' + newAttrKeys[i] + '="' + _newValue + '"');
        }
      }
      // If values are different
      else if (!oldTreeIsNode && _oldValue !== _newValue) {
          debug('[Unexpected attribute] ' + oldLabel + ': ' + oldAttrKeys[i] + '="' + _oldValue + '" IN NEW TREE: ' + newAttrKeys[i] + '="' + _newValue + '"');
        }
    }

    for (var _i = 0; _i < oldTree.childNodes.length; _i++) {
      if (oldTree.childNodes[_i] && newTree.childNodes[_i]) {
        compareTrees(options, transaction, oldTree.childNodes[_i], newTree.childNodes[_i]);
      }
    }
  }
};

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function verifyStateTask() {
    return function (transaction) {
      var domNode = transaction.domNode,
          state = transaction.state;

      var oldTree = transaction.oldTree || state.oldTree;
      var newTree = transaction.newTree;

      if (oldTree && newTree) {
        compareTrees(options, transaction, oldTree, newTree);
      }

      transaction.onceEnded(function () {
        compareTrees(options, transaction, domNode, newTree);
      });
    };
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});