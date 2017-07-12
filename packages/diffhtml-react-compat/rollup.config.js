import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import hypothetical from 'rollup-plugin-hypothetical';
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

export const targets = [{
  dest: dests[NODE_ENV],
  format: 'umd',
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel({ runtimeHelpers: true }),
  nodeResolve({ jsnext: true }),
  hypothetical({
    allowRealFiles: true,
    files: {
      '../diffhtml-components/node_modules/prop-types/index.js': `
        var root = typeof global !== 'undefined' ? global : window;
        export default root.PropTypes || {};
      `
    }
  }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/build-size.html' }),
];
