module.exports = ->
  @loadNpmTasks 'grunt-contrib-copy'

  chromeDest = 'chrome-extension/dist/extension'
  assetsDest = 'chrome-extension/dist/extension/styles/'

  npmDeps = [
    'node_modules/diffhtml/dist/diffhtml.js'
    'node_modules/diffhtml-logger/dist/logger.js'
    'node_modules/diffhtml-components/dist/cjs/*.js'
    'node_modules/diffhtml-synthetic-events/dist/synthetic-events.js'
    'node_modules/semantic-ui-css/semantic.min.css'
    'node_modules/chartist/dist/*'
  ]

  icons = [
    'assets/**/*'
  ]

  @config 'copy',
    'chrome-extension':
      files: [
        {
          src: icons
          expand: true
          cwd: 'node_modules/semantic-ui-icon'
          dest: assetsDest
        }
        {
          src: npmDeps
          expand: true
          dest: chromeDest
        }
        {
          src: [
            '**/*'
          ]
          expand: true
          cwd: 'module'
          dest: chromeDest
        }
        {
          src: [
            '**/*'
            '!_assets/**'
          ]
          expand: true
          cwd: 'lib'
          dest: chromeDest
        }
        {
          src: [
            'manifest.json'
            '_locales/**'
          ]
          expand: true
          cwd: 'chrome-extension'
          dest: chromeDest
        }
      ]
