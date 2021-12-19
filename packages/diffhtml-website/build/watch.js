const { watch } = require('chokidar');
const copy = require('./copy');
const generate = require('./generate');

const watcher = watch(process.cwd(), {
  ignored: /([\/\\]\.)|(node_modules)/,
  persistent: true,
});

watcher.on('change', path => {
  //copy();
  generate()
});
