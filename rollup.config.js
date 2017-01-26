import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

export const entry = 'lib/index.js';
export const sourceMap = false;
export const moduleName = 'diff';
export const targets = [{ dest: 'dist/diffhtml.js', format: 'umd' }];
export const plugins = [
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  buble({ include: ['lib/**'], target: { node: '0.12' } }),
  nodeResolve({ jsnext: true }),
];
