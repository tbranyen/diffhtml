import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'lib/index.js',
  umd: 'lib/index.js',
};

const dests = {
  min: 'dist/react-compat.min.js',
  umd: 'dist/react-compat.js',
}

const { NODE_ENV = 'umd' } = process.env;

export const exports = 'named';
export const context = 'this';
export const entry = entries[NODE_ENV];
export const sourceMap = false;
export const moduleName = 'React';
export const globals = { diffhtml: 'diff', 'prop-types': 'PropTypes' };
export const external = ['diffhtml', 'prop-types'];

export const targets = [{
  dest: dests[NODE_ENV],
  format: 'umd',
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel({ runtimeHelpers: true }),
  nodeResolve({ jsnext: true, main: true, skip: external }),
  commonjs({ include: 'node_modules/**', }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/build-size.html' }),
];
