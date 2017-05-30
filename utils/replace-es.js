module.exports = (originalPath, filePath) => {
  if (originalPath.indexOf('diffhtml') !== 0) {
    return originalPath;
  }

  return originalPath.replace(/diffhtml(.*)\/lib\/(.*)|diffhtml(.*)?/, (full, sub, file) => {
    if (sub) {
      return `diffhtml${sub}/dist/es/${file}`;
    }
    else if (file) {
      return `diffhtml/dist/es/${file}`;
    }
    else {
      return `diffhtml`;
    }
  });
}
