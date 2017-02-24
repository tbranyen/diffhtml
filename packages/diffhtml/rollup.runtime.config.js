import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import hypothetical from 'rollup-plugin-hypothetical';
import Visualizer from 'rollup-plugin-visualizer';

const entries = {
  min: 'dist/diffhtml-runtime.js',
  production: 'lib/runtime.js',
};

const dests = {
  min: 'dist/diffhtml-runtime.min.js',
  production: 'dist/diffhtml-runtime.js',
}

const { NODE_ENV = 'production' } = process.env;

export const exports = 'named';
export const context = 'this';
export const entry = entries[NODE_ENV];
export const sourceMap = false;
export const moduleName = 'diff';
export const targets = [{ dest: dests[NODE_ENV], format: NODE_ENV === 'production' ? 'umd' : 'es' }];
export const plugins = [
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({ jsnext: true }),
  hypothetical({
    allowRealFiles: true,
    files: {
      './lib/html.js': `
        import createTree from './tree/create';

        export default function html(...args) {
          return createTree(...args);
        }
      `,
      './lib/util/parser.js': `
        export default () => console.log('Runtime is not built with parsing');
      `,
      './lib/util/performance.js': `
        export default () => () => {};
      `,
    }
  }),
  NODE_ENV === 'production' && Visualizer({ filename: './dist/diffhtml-runtime-build-size.html' }),
];
