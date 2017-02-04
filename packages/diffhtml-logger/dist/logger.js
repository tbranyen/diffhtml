(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logger = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var identity = function identity(x) {
  return x;
};
var assign = Object.assign;


var humanize = function humanize(ms) {
  if (ms >= 1000) {
    return ms / 1000 + 's';
  }

  return ms + 'ms';
};

var stringToRGB = function stringToRGB(string) {
  var code = string.split('').reduce(function (hash, _, i) {
    return '' + (string.charCodeAt(i) + (hash << 5) - hash);
  }, 0);

  var hex = (code & 0x00FFFFFF).toString(16);
  return '#' + ('00000'.slice(0, 6 - hex.length) + hex);
};

var cloneTree = function cloneTree(tree) {
  return assign({}, tree, {
    attributes: assign({}, tree.attributes),
    childNodes: tree.childNodes.map(function (vTree) {
      return cloneTree(vTree);
    })
  });
};

var format = function format(patches) {
  var newPatches = {
    ELEMENT: {
      INSERT_BEFORE: [],
      REMOVE_CHILD: [],
      REPLACE_CHILD: [],
      NODE_VALUE: []
    },

    ATTRIBUTE: {
      SET: [],
      REMOVE: []
    }
  };

  var ELEMENT = newPatches.ELEMENT;
  var ATTRIBUTE = newPatches.ATTRIBUTE;


  patches.forEach(function (changeset) {
    var INSERT_BEFORE = changeset[0];
    var REMOVE_CHILD = changeset[1];
    var REPLACE_CHILD = changeset[2];
    var NODE_VALUE = changeset[3];
    var SET_ATTRIBUTE = changeset[4];
    var REMOVE_ATTRIBUTE = changeset[5];

    INSERT_BEFORE.forEach(function (patch) {
      var _patch = _slicedToArray(patch, 3);

      var vTree = _patch[0];
      var fragment = _patch[1];
      var referenceNode = _patch[2];

      ELEMENT.INSERT_BEFORE.push({ vTree: vTree, fragment: fragment, referenceNode: referenceNode });
    });

    REMOVE_CHILD.forEach(function (patch) {
      var _patch2 = _slicedToArray(patch, 2);

      var vTree = _patch2[0];
      var childNode = _patch2[1];

      ELEMENT.REMOVE_CHILD.push({ vTree: vTree, childNode: childNode });
    });

    REPLACE_CHILD.forEach(function (patch) {
      var _patch3 = _slicedToArray(patch, 3);

      var vTree = _patch3[0];
      var newChildNode = _patch3[1];
      var oldChildNode = _patch3[2];

      ELEMENT.REPLACE_CHILD.push({ vTree: vTree, newChildNode: newChildNode, oldChildNode: oldChildNode });
    });

    SET_ATTRIBUTE.forEach(function (patch) {
      var _patch4 = _slicedToArray(patch, 2);

      var vTree = _patch4[0];
      var attributesList = _patch4[1];

      var attributes = {};

      for (var i = 0; i < attributesList.length; i++) {
        var _attributesList$i = _slicedToArray(attributesList[i], 2);

        var name = _attributesList$i[0];
        var value = _attributesList$i[1];

        attributes[name] = value;
      }

      ATTRIBUTE.SET.push({ vTree: vTree, attributes: attributes });
    });

    REMOVE_ATTRIBUTE.forEach(function (patch) {
      var _patch5 = _slicedToArray(patch, 2);

      var vTree = _patch5[0];
      var attributesList = _patch5[1];

      var attributes = {};

      for (var i = 0; i < attributesList.length; i++) {
        var list = attributesList[i];

        for (var _i = 0; _i < list.length; _i++) {
          attributes[list[_i].name] = list[_i].value;
        }
      }

      ATTRIBUTE.REMOVE.push({ vTree: vTree, attributes: attributes });
    });
  });

  return newPatches;
};

/**
 * Re-usable log function. Used for during render and after render.
 *
 * @param message - Prefix for the console output.
 * @param method - Which console method to call
 * @param color - Which color styles to use
 * @param date - A date object to render
 * @param transaction - Contains: domNode, oldTree, newTree, patches, promises
 * @param options - Middleware options
 */
var log = function log(message, method, color, date, transaction, completed) {
  var domNode = transaction.domNode;
  var oldTree = transaction.oldTree;
  var newTree = transaction.newTree;
  var patches = transaction.patches;
  var promises = transaction.promises;
  var options = transaction.options;
  var markup = transaction.markup;
  var state = transaction.state;

  // Shadow DOM rendering...

  if (domNode.host) {
    var ctorName = domNode.host.constructor.name;


    console[method]('%c' + ctorName + ' render ' + (completed ? 'ended' : 'started'), 'color: ' + stringToRGB(ctorName) + (completed ? '; opacity: 0.5' : ''), completed ? completed : '');
  } else {
    console[method](message, color, completed ? completed : '');
  }

  if (!completed && domNode) {
    console.log('%cdomNode %O', 'font-weight: bold; color: #333', domNode);
  }

  if (!completed && markup) {
    console.log('%cmarkup %O', 'font-weight: bold; color: #333', markup);
  }

  if (!completed && options) {
    console.log('%coptions', 'font-weight: bold; color: #333', options);
  }

  if (oldTree || newTree) {
    console.log('%coldTree %O newTree %O', 'font-weight: bold; color: #333', transaction._cloneOldTree, cloneTree(newTree));
  }

  if (patches) {
    console.log('%cpatches %O', 'font-weight: bold; color: #333', patches);
  }

  // Don't clutter the output if there aren't any promises.
  if (promises && promises.length) {
    console.log('%ctransition promises %O', 'font-weight: bold; color: #333', promises);
  }
};

//

exports.default = function (opts) {
  return function loggerTask(transaction) {
    var start = new Date();

    log('%cdiffHTML...render transaction started', 'group', 'color: #FF0066', start, transaction);

    var oldTree = transaction.state.oldTree;


    transaction._cloneOldTree = oldTree && cloneTree(oldTree);

    /**
     * Transaction is effectively done, but we need to listen for it to actually
     * be finished.
     */
    return function () {
      // Transaction has fully completed.
      transaction.onceEnded(function () {
        console.groupEnd();

        log('%cdiffHTML...render transaction ended  ', 'group', 'color: #FF78B2', new Date(), transaction, ' >> Completed in: ' + humanize(Date.now() - start));

        console.groupEnd();
      });
    };
  };
};

module.exports = exports['default'];

},{}]},{},[1])(1)
});