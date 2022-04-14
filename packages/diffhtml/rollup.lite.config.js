import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import hypothetical from 'rollup-plugin-hypothetical';
import Visualizer from 'rollup-plugin-visualizer';

const { stringify } = JSON;
const { NODE_ENV = 'umd' } = process.env;

const entries = {
  min: 'lib/lite.js',
  umd: 'lib/lite.js',
};

const dests = {
  min: 'dist/diffhtml-lite.min.js',
  umd: 'dist/diffhtml-lite.js',
}

export default {
  input: entries[NODE_ENV],
  context: 'this',

  output: [{
    file: dests[NODE_ENV],
    format: 'umd',
    exports: 'named',
    name: 'diff',
    sourcemap: false,
  }],

  plugins: [
    babel({ comments: false }),
    replace({
      'internalProcess.env.NODE_ENV': stringify('production')
    }),
    nodeResolve({ mainFields: ['module'] }),
    hypothetical({
      allowFallthrough: true,
      files: {
        './lib/util/performance.js': `
          export default () => () => {};
        `,

        './lib/util/process.js': `
          export default {
            env: { NODE_ENV: 'production' },
          };
        `,
      }
    }),
    NODE_ENV === 'umd' && Visualizer({
      filename: './dist/lite-build-size.html'
    }),
  ],
};
