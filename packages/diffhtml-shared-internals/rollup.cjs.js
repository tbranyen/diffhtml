import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'lib/*.js',
  exports: 'default',
  targets: [{ dest: 'dist/cjs', format: 'cjs' }],
  plugins: [multiEntry()],
  external: [
    'diffhtml/cjs/util/caches',
    'diffhtml/cjs/util/decode-entities',
    'diffhtml/cjs/util/escape',
    'diffhtml/cjs/util/make-measure',
    'diffhtml/cjs/util/memory',
    'diffhtml/cjs/util/parser',
    'diffhtml/cjs/util/pool',
    'diffhtml/cjs/util/process',
    'diffhtml/cjs/util/svg',
  ],
};

