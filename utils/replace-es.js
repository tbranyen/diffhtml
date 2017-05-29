module.exports = originalPath => {
  if (originalPath.indexOf('diffhtml') !== 0) {
    return originalPath;
  }

  return originalPath.replace(/diffhtml(.*)\/lib\/(.*)/, (full, sub, file) => {
    return `../diffhtml${sub}/lib/${file}`;
  });
}
