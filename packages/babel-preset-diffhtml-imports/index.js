const { join } = require('path');

const ES2015 = require('babel-preset-es2015');
const ES2015Rollup = require('babel-preset-es2015-rollup');
const ModuleRewrite = require('babel-plugin-module-rewrite').default;
const ObjectRestSpread = require('babel-plugin-transform-object-rest-spread');
const ClassProperties = require('babel-plugin-transform-class-properties');
const ModulesCommonJS = require('babel-plugin-transform-es2015-modules-commonjs');
const AddModuleExports = require('babel-plugin-add-module-exports');

const esmFunc = join(__dirname, 'utils/replace-esm.js');
const cjsFunc = join(__dirname, 'utils/replace-cjs.js');

const { NODE_ENV } = process.env;

module.exports = {};

if (NODE_ENV === 'umd' || NODE_ENV === 'min') {
  module.exports.presets = [
    ES2015Rollup,
  ];

  module.exports.plugins = [
    ObjectRestSpread,
    ClassProperties,
  ];
}

if (NODE_ENV === 'cjs') {
  module.exports.presets = [];

  module.exports.plugins = [
    AddModuleExports,
    [ModuleRewrite, { replaceFunc: cjsFunc }],
    ModulesCommonJS,
    ObjectRestSpread,
    ClassProperties,
  ];
}

if (NODE_ENV === 'esm') {
  module.exports.presets = [];

  module.exports.plugins = [
    [ModuleRewrite, { replaceFunc: esmFunc }],
    ObjectRestSpread,
    ClassProperties,
  ];
}

if (NODE_ENV === 'test' || NODE_ENV === 'test+cov') {
  module.exports.plugins = [
    AddModuleExports,
    [ModuleRewrite, { replaceFunc: cjsFunc }],
    ModulesCommonJS,
    ObjectRestSpread,
    ClassProperties,
  ];
};
