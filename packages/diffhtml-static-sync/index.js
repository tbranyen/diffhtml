#!/usr/bin/env node

if (require.main === module) {
  return require('./lib/watch');
}

const { readFile, readFileSync } = require('fs');
const { basename, join } = require('path');
const { watch } = require('chokidar');
const express = require('express');
const getSocket = require('./lib/socket');

exports.clientScript = require('./lib/util/client-script');

// Not an official API yet... only testing.
exports.watch = (path, file, cb) => {
  const watcher = watch(path, { ignored: /[\/\\]\./, persistent: true, });

  getSocket.then(socket => {
    watcher.on('change', path => cb(markup => socket.send(
      JSON.stringify({
        file,
        markup,
      })
    )));
  });
};
