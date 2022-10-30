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

const pluginDynamicImports = (options = {}) => ({
  name: 'dynamic-imports',
  transform(code, filename) {
    const transformedCode = code.replace(/import\(['"`](?![\.\/])(.*?)['"`]\)/gi, (match, request) => {
      return 'Promise.resolve(null)';
      if (request in options.globals) {
        return `Promise.resolve(global["${options.globals[request]}"])`;
      }

      return 'Promise.resolve(null)';
    });

    return transformedCode;
  },
  moduleParsed(moduleInfo) {
    console.log('here', moduleInfo);
  },
});

export const plugins = [
  pluginDynamicImports({
    globals: {
      'fs': 'NodeFS',
      'path': 'NodePath',
      'worker_threads': 'NodeWorkerThreads',
    }
  }),
  NODE_ENV === 'min' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(),
  nodeResolve({
    preferBuiltins: true,
    mainFields: ['module'],
  }),
  hypothetical({
    allowFallthrough: true,
    files: {
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
