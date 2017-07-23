path = require 'path'
fs = require 'fs'

module.exports = ->
  @loadNpmTasks 'grunt-shell'

  env = process.env

  chrome = 'echo Skipping Chrome'
  s3 = 'echo Skipping S3'

  # https://code.google.com/p/selenium/wiki/ChromeDriver#Requirements
  if process.platform is 'linux'
    chrome = '/usr/bin/google-chrome'
  else if process.platform is 'darwin'
    chrome = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
  else if process.platform is 'win32'
    chrome = '"' + 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' + '"'

    if not fs.existsSync chrome
      chrome = '"' + 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' + '"'

  # Only run the s3 task if Travis is building master and not in a pull
  # request.
  if env.TRAVIS_PULL_REQUEST is 'false' and env.TRAVIS_BRANCH is 'master'
    s3 = 'grunt s3-sync'

  @config 'shell',
    'chrome-extension':
      command: [
        chrome
        '--pack-extension=' + path.resolve('chrome-extension/dist/extension')
        '--pack-extension-key=' + path.resolve('chrome-extension/key.pem')
        '--no-message-box'
      ].join(' ')

    's3':
      command: s3
