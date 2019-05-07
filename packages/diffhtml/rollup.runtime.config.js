import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import hypothetical from 'rollup-plugin-hypothetical';
import Visualizer from 'rollup-plugin-visualizer';

const { stringify } = JSON;
const { NODE_ENV = 'umd' } = process.env;

const entries = {
  min: 'lib/runtime.js',
  umd: 'lib/runtime.js',
};

const dests = {
  min: 'dist/diffhtml-runtime.min.js',
  umd: 'dist/diffhtml-runtime.js',
}

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
  NODE_ENV === 'min' && replace({
    'process.env.NODE_ENV': stringify('production')
  }),
  babel(),
  nodeResolve({ mainFields: ['module'] }),
  hypothetical({
    allowFallthrough: true,
    files: {
      './lib/util/performance.js': `
        export default () => () => {};
      `,
    }
  }),
  NODE_ENV === 'umd' && Visualizer({
    filename: './dist/runtime-build-size.html'
  }),
];
