import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import hypothetical from 'rollup-plugin-hypothetical';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'lib/runtime.js',
  umd: 'lib/runtime.js',
};

const dests = {
  min: 'dist/diffhtml-runtime.min.js',
  umd: 'dist/diffhtml-runtime.js',
}

const { NODE_ENV = 'umd' } = process.env;

export const exports = 'named';
export const context = 'this';
export const entry = entries[NODE_ENV];
export const sourceMap = false;
export const moduleName = 'diff';
export const targets = [{ dest: dests[NODE_ENV], format: 'umd' }];
export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({ jsnext: true }),
  hypothetical({
    allowRealFiles: true,
    files: {
      './lib/util/performance.js': `
        export default () => () => {};
      `,
    }
  }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/runtime-build-size.html' }),
];
