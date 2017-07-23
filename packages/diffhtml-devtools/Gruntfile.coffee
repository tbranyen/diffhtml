module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'env-middleware', -> process.env.NODE_ENV = 'middleware'
  @registerTask 'env-production', -> process.env.NODE_ENV = 'production'

  @registerTask 'default', [
    'clean:chrome-extension'
    'env-middleware'
    'browserify:bridge'
    'env-production'
    'chrome-extension'
  ]

  @registerTask 'test', [
    'default'
    'mochaTest:chrome-extension'
  ]

  @registerTask 'chrome-extension', [
    'copy:chrome-extension'
    'browserify:chrome-extension'
    'compress:chrome-extension'
    'shell:chrome-extension'
  ]
