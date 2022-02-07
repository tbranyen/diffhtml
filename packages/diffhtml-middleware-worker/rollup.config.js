import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import hypothetical from 'rollup-plugin-hypothetical';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'lib/index.js',
  umd: 'lib/index.js',
};

const dests = {
  min: 'dist/worker.min.js',
  umd: 'dist/worker.js',
}

const { NODE_ENV = 'umd' } = process.env;

export const input = entries[NODE_ENV];
export const context = 'this';
export const external = ['diffhtml'];

export const output = [{
  file: dests[NODE_ENV],
  format: 'umd',
  exports: 'named',
  name: 'worker',
  sourcemap: false,
  globals: { diffhtml: 'diff' },
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({
    preferBuiltins: true,
    mainFields: ['module'],
  }),
  hypothetical({
    allowFallthrough: true,
    files: {
      './lib/create-node-worker.js': `
        export const createNodeWorker = () => {};
      `,
      './lib/util/node-buffer.js': `
        export default undefined;
      `,
      './lib/util/node-worker-threads.js': `
        export default undefined;
      `,
    }
  }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/build-size.html' }),
];
