'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pool = require('diffhtml/lib/util/pool');

Object.keys(_pool).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pool[key];
    }
  });
});