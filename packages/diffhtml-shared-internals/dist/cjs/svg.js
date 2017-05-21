'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svg = require('diffhtml/lib/util/svg');

Object.keys(_svg).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _svg[key];
    }
  });
});