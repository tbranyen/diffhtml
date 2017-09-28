module.exports = ->
  @loadNpmTasks 'grunt-contrib-watch'

  @config 'watch',
    'chrome-extension':
      files: [
        'chrome-extension/**/*'
        '!chrome-extension/dist/**/*'
        'shared/**/*'
      ]

      tasks: [
        'browserify:bridge'
        'chrome-extension'
      ]
