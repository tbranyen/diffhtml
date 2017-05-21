'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _escape = require('diffhtml/lib/util/escape');

Object.keys(_escape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _escape[key];
    }
  });
});