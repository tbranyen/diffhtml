'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _memory = require('diffhtml/lib/util/memory');

Object.keys(_memory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _memory[key];
    }
  });
});