export default {
  entry: 'index.js',
  exports: 'named',
  moduleName: 'sharedInternals',
  targets: [{ dest: 'dist/shared-internals.js', format: 'umd' }],
  globals: { diffhtml: 'diff' },
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
