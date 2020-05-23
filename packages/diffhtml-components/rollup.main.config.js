import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'lib/index.js',
  umd: 'lib/index.js',
};

const dests = {
  min: 'dist/components.min.js',
  umd: 'dist/components.js',
}

const { NODE_ENV = 'umd' } = process.env;

export const input = entries[NODE_ENV];
export const context = 'this';
export const external = ['diffhtml'];

export const output = [{
  file: dests[NODE_ENV],
  format: 'umd',
  name: 'components',
  globals: { diffhtml: 'diff' },
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({ mainFields: ['main', 'module'] }),
  commonjs({ include: 'node_modules/**' }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/components-build-size.html' }),
].filter(Boolean);
