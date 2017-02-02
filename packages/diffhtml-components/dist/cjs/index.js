'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webcomponent = require('./webcomponent');

Object.defineProperty(exports, 'WebComponent', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_webcomponent).default;
  }
});

var _proptypes = require('proptypes');

Object.defineProperty(exports, 'PropTypes', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_proptypes).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }