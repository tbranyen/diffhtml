import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'lib/index.js',
  umd: 'lib/index.js',
};

const dests = {
  min: 'dist/diffhtml.min.js',
  umd: 'dist/diffhtml.js',
};

const { NODE_ENV = 'umd' } = process.env;

export const exports = 'named';
export const context = 'this';
export const entry = entries[NODE_ENV];
export const sourceMap = false;
export const moduleName = 'diff';

export const targets = [{
  dest: dests[NODE_ENV],
  format: 'umd',
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({ jsnext: true }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/main-build-size.html' }),
];
