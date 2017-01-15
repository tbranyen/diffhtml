import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';

export const entry = 'lib/index.js';
export const sourceMap = false;
export const moduleName = 'diff';
export const targets = [{ dest: 'dist/diffhtml.js', format: 'umd' }];
export const plugins = [
  buble({ include: ['lib/**'], target: { node: '4' } }),
  nodeResolve({ jsnext: true }),
];
