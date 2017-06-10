const { readFile } = require('fs');
const { basename, extname, join } = require('path');
const { watch } = require('chokidar');
const express = require('express');
const getSocket = require('./socket');
const clientScript = require('./util/client-script');

const CWD = process.cwd();

const webServer = express();
const watcher = watch(CWD, {
  ignored: /[\/\\]\./,
  persistent: true,
});

webServer.use('/', (req, res, next) => {
  const ext = extname(req.url);
  const isRoot = req.url === '' || req.url === '/';

  if (isRoot || ext === '.html') {
    const path = isRoot ? 'index.html' : req.url;
    readFile(join(CWD, path), (err, buffer) => {
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

webServer.use(express.static(CWD));

webServer.listen(process.env.SERVER_PORT || 8000, () => {
  console.log('Listening at http://localhost:8000');

  getSocket.then(sockets => {
    console.log('Socket connection established, monitoring files...');

    watcher.on('change', path => {
      console.log(`${path} changed`);

      readFile(path, (err, buffer) => {
        sockets.forEach(socket => {
          socket.send(JSON.stringify({
            file: path.slice(CWD.length + 1),
            markup: String(buffer),
          }));
        });
      });
    });
  });
});
