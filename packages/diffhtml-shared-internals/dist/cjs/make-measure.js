'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _makeMeasure = require('diffhtml/lib/util/make-measure');

Object.keys(_makeMeasure).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _makeMeasure[key];
    }
  });
});