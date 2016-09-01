exports.resolve = require.resolve.bind(require);
exports.parent = module.parent.parent;

const requirePath = exports.parent.id.split('/node_modules')[0];

exports.require = (name) => {
  if (name.indexOf('.') === 0) {
    return require(`${requirePath}/${name}`);
  }
  else {
    return require(`${requirePath}/node_modules/${name}`);
  }
};
exports.require.resolve = exports.resolve;
