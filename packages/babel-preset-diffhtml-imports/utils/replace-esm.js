module.exports = (originalPath, filePath) => {
  if (originalPath.indexOf('diffhtml') !== 0) {
    return originalPath;
  }

  return originalPath.replace(/diffhtml(.*)\/lib\/(.*)|diffhtml(.*)?/, (full, sub, file, sub2) => {
    if (sub && file) {
      return `diffhtml${sub}/dist/es/${file}`;
    }
    else if (file) {
      return `diffhtml/dist/es/${file}`;
    }
    else if (sub2) {
      return `diffhtml${sub2}`;
    }
    else {
      return `diffhtml`;
    }
  });
}
