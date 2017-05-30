const { readFile } = require('fs');
const { basename, extname, join } = require('path');
const { watch } = require('chokidar');
const express = require('express');
const getSocket = require('./socket');
const clientScript = require('./util/client-script');

const webServer = express();
const watcher = watch(process.cwd(), {
  ignored: /[\/\\]\./,
  persistent: true,
});

webServer.use('/', (req, res, next) => {
  const ext = extname(req.url);
  const isRoot = req.url === '' || req.url === '/';

  if (isRoot || ext === '.html') {
    const path = isRoot ? 'index.html' : req.url;
    readFile(join(process.cwd(), req.url), (err, buffer) => {
      res.send(`
        ${String(buffer)}
        <script>${clientScript}</script>
      `);
    });
  }
  else {
    next();
  }
});

webServer.use(express.static(process.cwd()));

webServer.listen(process.env.SERVER_PORT || 8000, () => {
  console.log('Listening at http://localhost:8000');

  getSocket.then(socket => {
    console.log('Socket connection established, monitoring files...');

    watcher.on('change', path => readFile(path, (err, buffer) => socket.send(
      JSON.stringify({ file: basename(path), markup: String(buffer) })
    )));
  });
});
