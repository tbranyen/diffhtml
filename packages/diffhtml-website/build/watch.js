const { watch } = require('chokidar');
const generate = require('./generate');

const watcher = watch(process.cwd(), {
  ignored: /[\/\\]\./,
  persistent: true,
});

watcher.on('change', path => generate());
