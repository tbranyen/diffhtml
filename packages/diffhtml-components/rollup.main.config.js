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
  min: 'dist/components.min.js',
  umd: 'dist/components.js',
}

const { NODE_ENV = 'umd' } = process.env;

export const context = 'this';
export const exports = 'named';
export const entry = entries[NODE_ENV];
export const sourceMap = false;
export const moduleName = 'components';
export const globals = { diffhtml: 'diff' };
export const external = ['diffhtml'];

export const targets = [{
  dest: dests[NODE_ENV],
  format: 'umd',
}];

export const plugins = [
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({ jsnext: true }),
  hypothetical({
    allowRealFiles: true,
    files: {
      './node_modules/prop-types/index.js': `
        var root = typeof global !== 'undefined' ? global : window;
        export default root.PropTypes || {};
      `
    }
  }),
  NODE_ENV === 'umd' && Visualizer({ filename: './dist/components-build-size.html' }),
].filter(Boolean);
