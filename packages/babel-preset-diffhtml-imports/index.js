const { join } = require('path');

const ModuleRewrite = require('babel-plugin-module-rewrite').default;
const ObjectRestSpread = require('@babel/plugin-proposal-object-rest-spread').default;
const ClassProperties = require('@babel/plugin-proposal-class-properties').default;
const ModulesCommonJS = require('@babel/plugin-transform-modules-commonjs').default;
const AddModuleExports = require('babel-plugin-add-module-exports');
const TransformClasses = require('@babel/plugin-transform-classes').default;
const TransformElementClasses = require('babel-plugin-transform-custom-element-classes');

const esmFunc = join(__dirname, 'utils/replace-esm.js');
const cjsFunc = join(__dirname, 'utils/replace-cjs.js');

const { NODE_ENV } = process.env;
const exportObj = {};

if (NODE_ENV === 'umd' || NODE_ENV === 'min') {
  exportObj.plugins = [
    ObjectRestSpread,
    ClassProperties,
  ];
}

if (NODE_ENV === 'cjs') {
  exportObj.plugins = [
    AddModuleExports,
    [ModuleRewrite, { replaceFunc: cjsFunc }],
    ModulesCommonJS,
    ObjectRestSpread,
    ClassProperties,
    TransformElementClasses,
    TransformClasses,
  ];
}

if (NODE_ENV === 'esm') {
  exportObj.plugins = [
    [ModuleRewrite, { replaceFunc: esmFunc }],
    ObjectRestSpread,
    ClassProperties,
    TransformElementClasses,
    TransformClasses,
  ];
}

if (NODE_ENV === 'test' || NODE_ENV === 'test+cov') {
  exportObj.plugins = [
    AddModuleExports,
    [ModuleRewrite, { replaceFunc: cjsFunc }],
    ModulesCommonJS,
    ObjectRestSpread,
    ClassProperties,
  ];
};

module.exports = () => exportObj;
