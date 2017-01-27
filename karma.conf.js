const browsers = {
  OSX: {
    os: 'OS X',
    os_version: 'El Capitan',
  },

  Windows: {
    os: 'Windows',
    os_version: '7',
  },

  iOS: {
    os: 'iOS',
    os_version: '9.1',
  },

  Android: {
    os: 'android',
    os_version: '5.0',
  }
};

const createBrowser = (name, version, browser='OSX') => ({
  [`BS_${name}_${browser}`]: {
    base: 'BrowserStack',
    browser: name.toLowerCase(),
    browser_version: version,
    os: browsers[browser].os,
    os_version: browsers[browser].os_version,
  },
});

module.exports = config => config.set({
  basePath: '.',
  frameworks: ['browserify', 'mocha'],

  browserStack: {
    username: process.env.BROWSER_STACK_USERNAME,
    accessKey: process.env.BROWSER_STACK_KEY,
  },

  customLaunchers: Object.assign.apply({}, [
    // OS X Evergreen.
    createBrowser('Firefox'),
    createBrowser('Chrome'),
    createBrowser('Safari'),

    // Windows Evergreen.
    createBrowser('IE', '10', 'Windows'),
    createBrowser('Edge', null, 'Windows'),

    // Non-evergreen OS X.
    createBrowser('Opera'),

    // Non-evergreen Mobile browsers.
    createBrowser('iPhone', '9.1', 'iOS'),
    createBrowser('Nexus', '5', 'Android'),
  ]),

  files: [
    'node_modules/babel-polyfill/dist/polyfill.js',
    'lib/**/*.js',
    'test/assert.js',

    'test/unit/tree/create.js',
    'test/unit/tree/sync.js',

    //{ pattern: 'test/unit/**/*.js', watched: false },
    //{ pattern: 'test/integration/**/*.js', watched: false },
  ],

  preprocessors: {
    'lib/**/*.js': ['browserify'],
    'test/unit/**/*.js': ['browserify'],
    'test/integration/**/*.js': ['browserify'],
  },

  reporters: ['mocha', 'coverage'],

  coverageReporter: {
    type: 'lcov',
    dir: 'test/coverage'
  },

  browserify: {
    debug: true,
    transform: ['babelify'],
  },

  browsers: process.env.BROWSER_STACK ? [
    // Evergreen desktop.
    'BS_Firefox_OSX',
    'BS_Chrome_OSX',
    'BS_Safari_OSX',
    'BS_Edge_Windows',

    // Currently failing due to undocumented `renderComplete` method.
    'BS_IE_Windows',

    // Non-evergreen desktop.
    'BS_Opera_OSX',

    // Non-evergreen mobile.
    'BS_Nexus_Android',
    'BS_iPhone_iOS',
  ] : ['PhantomJS']
});
