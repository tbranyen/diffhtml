var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['browserify', 'mocha'],

    files: [
      'node_modules/promise-polyfill/Promise.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'node_modules/weakmap/weakmap.js',
      'lib/**/*.js',
      'test/assert.js',
      { pattern: 'test/unit/**/*.js', watched: false },
      { pattern: 'test/integration/**/*.js', watched: false }
    ],

    preprocessors: {
      '{lib/**/*, lib/worker/!source}.js': ['browserify'],
      'test/unit/**/*.js': ['browserify'],
      'test/integration/**/*.js': ['browserify'],
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage',

      instrumenters: { isparta: isparta },
      instrumenter: { '**/*.js': 'isparta' }
    },

    browserify: {
      debug: true,

      transform: [
        [istanbul({
          instrumenter: isparta,
          instrumenterConfig: {
            babel: {
              presets: ['es2015']
            }
          }
        })],
        ['babelify', {
          presets: ['es2015']
        }]
      ]
    },

    browsers: [
      'PhantomJS'
    ]
  });
};

