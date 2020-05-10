const { ncp } = require('ncp');
const { join } = require('path');

const public = join(__dirname, '../public/');
const docs = join(__dirname, '../../../docs/');
const min = join(__dirname, '../../diffhtml/dist');

function copy() {
  ncp(public, docs, () => {});
  ncp(min, join(docs, 'scripts'), {
    filter: path => {
      // Only allow diffhtml.min.js
      if (path.includes('diffhtml.min.js')) {
        return true;
      }

      if (path.slice(-4) === 'dist') {
        return true;
      }
    },
  }, () => {});
}

copy();

module.exports = copy;
