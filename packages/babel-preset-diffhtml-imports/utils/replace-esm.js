const { dirname, join, relative } = require('path');
const finder = require('find-package-json');

module.exports = (originalPath, filePath) => {
  // FIXME For now in ESM we need to disable loading prop-types. Now that it's
  // MIT we can fork and rebrand it as diffhtml-prop-types.
  if (originalPath.indexOf('prop-types') === 0) {
    return './fake-prop-types';
  }

  if (originalPath.indexOf('diffhtml') !== 0) {
    return originalPath;
  }

  return originalPath.replace(/diffhtml(.*)\/lib\/(.*)|diffhtml(.*)?/, (full, sub, file, sub2) => {
    const path = dirname(finder(filePath).next().value.__path);
    let newPath = null;

    if (sub && file) {
      newPath = `../../node_modules/diffhtml${sub}/dist/es/${file}`;
    }
    else if (file) {
      newPath = `../../node_modules/diffhtml/dist/es/${file}`;
    }
    else if (sub2) {
      newPath = `../../node_modules/diffhtml${sub2}`;
    }
    else {
      newPath = '../../../node_modules/diffhtml/dist/es/index';
    }

    newPath = relative(dirname(filePath), join(path, newPath));

    if (newPath[0] !== '.') {
      newPath = `./${newPath}`;
    }

    return newPath;
  });
}
