const { watch } = require('chokidar');
const copy = require('./copy');
const generate = require('./generate');

const watcher = watch(process.cwd(), {
  ignored: /[\/\\]\./,
  persistent: true,
});

watcher.on('change', path => {
  copy();
  generate()
});
