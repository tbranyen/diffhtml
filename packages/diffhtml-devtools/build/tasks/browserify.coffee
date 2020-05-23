module.exports = ->
  @loadNpmTasks 'grunt-browserify'

  @config 'browserify',
    'bridge':
      files:
        'chrome-extension/dist/extension/js/bridge.js': ['lib/scripts/bridge.js']

      options:
        transform: ['babelify', 'brfs']
        plugin: ['browserify-derequire']

        browserifyOptions:
          standalone: 'devTools'

    'chrome-extension':
      files:
        'chrome-extension/dist/extension/js/index.js': ['lib/scripts/index.js']
        'chrome-extension/dist/extension/js/contentscript.js': ['lib/scripts/contentscript.js']
        'chrome-extension/dist/extension/js/devtools.js': ['lib/scripts/devtools.js']
        'chrome-extension/dist/extension/js/background.js': ['lib/scripts/background.js']

      options:
        transform: [
          'babelify',
          'brfs',
          ["aliasify", { global: true }]
        ]

        exclude: ['fs']

        alias:
          'react': 'diffhtml-react-compat/dist/cjs/index'
          'react-dom': 'diffhtml-react-compat/dist/cjs/index'
          'diffhtml': 'diffhtml/dist/cjs/runtime'
