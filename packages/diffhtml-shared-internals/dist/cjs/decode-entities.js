'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _decodeEntities = require('diffhtml/lib/util/decode-entities');

Object.keys(_decodeEntities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decodeEntities[key];
    }
  });
});