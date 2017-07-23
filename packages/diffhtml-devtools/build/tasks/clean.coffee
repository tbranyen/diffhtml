module.exports = ->
  @loadNpmTasks 'grunt-contrib-clean'

  @config 'clean',
    'chrome-extension': ['chrome-extension/dist']
