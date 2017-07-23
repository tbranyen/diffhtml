module.exports = ->
  @loadNpmTasks 'grunt-mocha-test'

  @config 'mochaTest',
    options:
      clearRequireCache: true

    'chrome-extension':
      src: [
        'test/integration/setup.js'
        'test/integration/extension-driver.js'
        'chrome-extension/test/configure.js'
        'test/integration/tests/**/*.js'
      ]

    'shared':
      src: [
        'test/unit/runner.js'
        'test/unit/tests/**/*.js'
      ]
