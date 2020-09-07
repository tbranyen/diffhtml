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

export const input = entries[NODE_ENV];
export const context = 'this';

export const output = [{
  file: dests[NODE_ENV],
  format: 'umd',
  exports: 'named',
  name: 'diff',
  sourcemap: false,
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel({ comments: false }),
  nodeResolve({ mainFields: ['module'] }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/main-build-size.html' }),
];
