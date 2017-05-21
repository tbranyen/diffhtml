'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parser = require('diffhtml/lib/util/parser');

Object.keys(_parser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _parser[key];
    }
  });
});