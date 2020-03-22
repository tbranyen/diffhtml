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

      './lib/util/types.js': `
        export const PATCH_TYPE = {
          'SET_ATTRIBUTE': 0,
          'REMOVE_ATTRIBUTE': 1,
          'NODE_VALUE': 2,
          'INSERT_BEFORE': 3,
          'REPLACE_CHILD': 4,
          'REMOVE_CHILD': 5,
        };

        export const VTree = 0;
        export const VTreeLike = 0;
        export const Mount = 0;
        export const ValidInput = 0;
        export const Options = 0;
        export const Middleware = 0;
      `,

      './lib/util/process.js': `
        export default {
          env: { NODE_ENV: 'production' },
        };
      `,
    }
  }),
  NODE_ENV === 'umd' && Visualizer({
    filename: './dist/runtime-build-size.html'
  }),
];
