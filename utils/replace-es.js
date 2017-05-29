module.exports = (originalPath, filePath) => {
  const up = Array(filePath.split('/').length).fill('..').slice(1).join('/');

  if (originalPath.indexOf('diffhtml') !== 0) {
    return originalPath;
  }

  return originalPath.replace(/diffhtml(.*)\/lib\/(.*)|diffhtml(.*)?/, (full, sub, file) => {
    if (sub) {
      return `${up}/diffhtml${sub}/lib/${file}`;
    }
    else if (file) {
      return `${up}/diffhtml/lib/${file}`;
    }
    else {
      return `${up}/diffhtml`;
    }
  });
}
