const { readFileSync } = require('fs');
const { join } = require('path');
const escape = require('./escape');

module.exports = escape(readFileSync(join(__dirname, '../../dist/sync.js')));
