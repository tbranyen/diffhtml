const { join } = require('path');

const ModuleRewrite = require('babel-plugin-module-rewrite').default;
const OptionalChaining = require('@babel/plugin-proposal-optional-chaining').default;
const ObjectRestSpread = require('@babel/plugin-proposal-object-rest-spread').default;
const ClassProperties = require('@babel/plugin-proposal-class-properties').default;
const ModulesCommonJS = require('@babel/plugin-transform-modules-commonjs').default;
const AddModuleExports = require('babel-plugin-add-module-exports');
const Classes = require('@babel/plugin-transform-classes').default;
const BlockScoping = require('@babel/plugin-transform-block-scoping').default;
const ArrowFunctions = require('@babel/plugin-transform-arrow-functions').default;
const ShorthandProperties = require('@babel/plugin-transform-shorthand-properties').default;
const ObjectDestructuring = require('@babel/plugin-transform-destructuring').default;
const Parameters = require('@babel/plugin-transform-parameters').default;
const Spread = require('@babel/plugin-transform-spread').default;
const TemplateLiterals = require('@babel/plugin-transform-template-literals').default;
const ForOf = require('@babel/plugin-transform-for-of').default;
const ComputedProperties = require('@babel/plugin-transform-computed-properties').default;
const ElementClasses = require('babel-plugin-transform-custom-element-classes');
const NewTarget = require('@babel/plugin-transform-new-target');
const OptionalCatchBinding = require('@babel/plugin-proposal-optional-catch-binding').default;


const esmFunc = join(__dirname, 'utils/replace-esm.js');
const cjsFunc = join(__dirname, 'utils/replace-cjs.js');

const { NODE_ENV } = process.env;
const exportObj = {};

if (NODE_ENV === 'umd' || NODE_ENV === 'min') {
  exportObj.plugins = [
  ];
  exportObj.minified = true;
}

if (NODE_ENV === 'cjs') {
  exportObj.plugins = [
    AddModuleExports,
    [ModuleRewrite, { replaceFunc: cjsFunc }],
    ModulesCommonJS,
    ObjectRestSpread,
    ClassProperties,
    ElementClasses,
    OptionalChaining,
    OptionalCatchBinding,
  ];
  exportObj.minified = true;
}

if (NODE_ENV === 'esm') {
  exportObj.plugins = [
    [ModuleRewrite, { replaceFunc: esmFunc }],
    ObjectRestSpread,
    ClassProperties,
  ];
  exportObj.minified = true;
}

if (NODE_ENV === 'test' || NODE_ENV === 'test+cov') {
  exportObj.plugins = [
    AddModuleExports,
    [ModuleRewrite, { replaceFunc: cjsFunc }],
    ModulesCommonJS,
    ObjectRestSpread,
    ClassProperties,
    OptionalChaining,
    OptionalCatchBinding,
  ];
};

module.exports = () => exportObj;
