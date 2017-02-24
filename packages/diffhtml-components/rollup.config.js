import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export const context = 'this';
export const exports = 'named';
export const entry = 'lib/index.js';
export const sourceMap = false;
export const moduleName = 'components';
export const targets = [{ dest: 'dist/components.js', format: 'umd' }];
export const globals = { diffhtml: 'diff', proptypes: 'PropTypes' };
export const external = 'diffhtml';
export const plugins = [
  babel(),
  commonjs({
    include: 'node_modules/**',
  }),
  nodeResolve({ jsnext: true }),
];
