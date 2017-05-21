'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caches = require('diffhtml/dist/cjs/util/caches');

Object.keys(_caches).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _caches[key];
    }
  });
});
