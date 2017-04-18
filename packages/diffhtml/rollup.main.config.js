import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'dist/diffhtml.js',
  production: 'lib/index.js',
};

const dests = {
  min: 'dist/diffhtml.min.js',
  production: 'dist/diffhtml.js',
}

const { NODE_ENV = 'production' } = process.env;

export const exports = 'named';
export const context = 'this';
export const entry = entries[NODE_ENV];
export const sourceMap = false;
export const moduleName = 'diff';
export const targets = [{ dest: dests[NODE_ENV], format: NODE_ENV === 'production' ? 'umd' : 'es' }];
export const plugins = [
  babel(),
  nodeResolve({ jsnext: true }),
  NODE_ENV === 'production' && Visualizer({ filename: './dist/diffhtml-build-size.html' }),
];
