const { extname, dirname, join, relative } = require('path');
const finder = require('find-package-json');

module.exports = (originalPath, filePath) => {
  // FIXME For now in ESM we need to disable loading prop-types. Now that it's
  // MIT we can fork and rebrand it as diffhtml-prop-types.
  if (originalPath.indexOf('prop-types') === 0) {
    return './fake-prop-types.js';
  }

  if (originalPath.indexOf('diffhtml') !== 0) {
    // Ensure this path has a trailing extension.
    if (!extname(originalPath)) {
      originalPath += '.js';
    }

    return originalPath;
  }

  return originalPath.replace(/diffhtml(.*)\/lib\/(.*)|diffhtml(.*)?/, (full, sub, file, sub2) => {
    const path = dirname(finder(filePath).next().value.__path);
    let newPath = null;

    if (sub && file) {
      newPath = `../../../../diffhtml${sub}/${file}`;
    }
    else if (file) {
      newPath = `../../../../diffhtml/${file}`;
    }
    else if (sub2) {
      const [ name, ...path ] = sub2.split('/');
      newPath = `../../../../diffhtml${name}/${path.length ? path.join('/') : ''}`;
    }
    else {
      newPath = '../../../../diffhtml/index';
    }

    newPath = relative(dirname(filePath), join(path, newPath));

    if (newPath[0] !== '.') {
      newPath = `./${newPath}`;
    }

    // Ensure folders get a trailing slash.
    if (!newPath.includes('.js') && newPath[--newPath.length] !== '/' && newPath.slice(-5) !== 'index') {
      newPath += '/index.js';
    }

    // Lastly ensure an extension has been added or is a path.
    if (!extname(newPath)) {
      newPath += '.js';
    }

    return newPath;
  });
}
