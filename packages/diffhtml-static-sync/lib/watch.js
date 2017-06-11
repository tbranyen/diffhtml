const { readFile } = require('fs');
const { basename, extname, join } = require('path');
const { Spinner } = require('cli-spinner');
const { watch } = require('chokidar');
const marked = require('marked');
const express = require('express');
const getSocket = require('./socket');
const clientScript = require('./util/client-script');

const CWD = process.cwd();

// CLI Colors
const yellow = '\x1B[33m';
const blue = '\x1B[34m';
const gray = '\x1B[37m';
const green = '\x1B[32m';
const reset = '\x1B[m';
const quiet = process.argv.includes('--quiet');

const webServer = express();
const watcher = watch(CWD, {
  ignored: /[\/\\]\./,
  persistent: true,
});

const read = path => new Promise((res, rej) => readFile(path, (err, buffer) => {
  if (err) { rej(err); } else { res(buffer); }
}));

const formatMarkdown = markup => `<html>
  <body>
    ${marked(String(markup))}
  </body>
</html>`;

webServer.use('/', (req, res, next) => {
  const ext = extname(req.url);
  const isRoot = req.url === '' || req.url.slice(-1) === '/';
  const path = root => isRoot ? root : req.url;

  if (isRoot || ext === '.html' || ext === 'md' || ext === 'markdown') {
    read(path('index.html'))
      .catch(() => read('index.md').then(formatMarkdown))
      .catch(() => read('index.markdown').then(formatMarkdown))
      .then(buffer => res.send(`
        ${String(buffer)}
        <script>${clientScript}</script>
      `));
  }
  else {
    next();
  }
});

webServer.use(express.static(CWD));

webServer.listen(process.env.SERVER_PORT || 8000, () => {
  if (!quiet) {
    console.log(`Open http://localhost:8000\n`);
  }

  getSocket.then(sockets => {
    watcher.on('change', path => {
      if (!quiet) {
        console.log(`${green}${path} changed${reset}`);
      }

      readFile(path, (err, buffer) => {
        sockets.forEach(socket => {
          const state = {
            file: path.slice(CWD.length + 1),
            markup: String(buffer),
            quiet,
          };

          if (state.file.includes('.md') || state.file.includes('.markdown')) {
            state.file = state.file.replace(/(\.md|\.markdown)/g, '.html');
            state.markup = formatMarkdown(state.markup);
          }

          socket.send(JSON.stringify(state));
        });
      });
    });
  });
});

const spinner = new Spinner(`${gray}Waiting for changes %s${reset} `);

spinner.setSpinnerString(27);
spinner.start();
