module.exports = ->
  @loadNpmTasks 'grunt-contrib-compress'

  @config 'compress',
    'chrome-extension':
      options:
        archive: 'chrome-extension/dist/extension.zip'
        mode: 'zip'

      files: [
        { src: ['**/*'], expand: true, cwd: 'shared' }
        {
          src: [
            'key.pem'
            '_locales/**'
          ]
          expand: true
          cwd: 'chrome-extension'
        }
      ]
