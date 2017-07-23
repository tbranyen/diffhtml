const { ncp } = require('ncp');
const { join } = require('path');

const public = join(__dirname, '../public/');
const docs = join(__dirname, '../../../docs/');

function copy() {
  ncp(public, docs);
}

copy();

module.exports = copy;
