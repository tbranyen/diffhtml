import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

export const entry = 'lib/runtime.js';
export const sourceMap = false;
export const moduleName = 'diff';
export const targets = [{ dest: 'dist/diffhtml-runtime.js', format: 'umd' }];
export const plugins = [
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({ jsnext: true }),
];
