var isparta = require('isparta');
var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['browserify', 'mocha'],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'lib/**/*.js',
      'test/assert.js',

      { pattern: 'test/unit/**/*.js', watched: false },
      { pattern: 'test/integration/**/*.js', watched: false }
    ],

    client: {
      mocha: {
        bail: true
      }
    },

    preprocessors: {
      'lib/**/*.js': ['browserify'],
      'test/unit/**/*.js': ['browserify'],
      'test/integration/**/*.js': ['browserify'],
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage'
    },

    browserify: {
      debug: true,

      transform: [
        !process.env.SKIP_COV ? [istanbul({
          instrumenter: isparta,
          instrumenterConfig: {
            babel: {
              presets: ['es2015']
            }
          }
        })] : undefined,
        ['babelify', {
          presets: ['es2015']
        }]
      ].filter(Boolean)
    },

    browsers: [
      'PhantomJS'
    ]
  });
};
