const { readFileSync } = require('fs');
const { join } = require('path');
const escape = require('./escape');

Object.defineProperty(module, 'exports', {
  get() {
    return escape(readFileSync(join(__dirname, '../../dist/sync.js')));
  }
});
