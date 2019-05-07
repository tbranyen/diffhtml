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

export const context = 'this';
export const input = entries[NODE_ENV];
export const external = ['diffhtml', 'prop-types'];

export const output = {
  file: dests[NODE_ENV],
  format: 'umd',
  exports: 'named',
  globals: { diffhtml: 'diff', 'prop-types': 'PropTypes' },
  sourcemap: false,
  name: 'React',
};

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel({ runtimeHelpers: true }),
  (NODE_ENV !== 'umd' && NODE_ENV !== 'min') && nodeResolve({ jsnext: true, main: true, skip: external }),
  commonjs({ include: 'node_modules/**', }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/build-size.html' }),
];
