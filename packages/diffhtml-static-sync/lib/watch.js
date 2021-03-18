const { readFile } = require('fs');
const { extname, join } = require('path');
const { Spinner } = require('cli-spinner');
const { watch } = require('chokidar');
const marked = require('marked');
const express = require('express');
const getSocket = require('./socket');
const clientScript = require('./util/client-script');
const { Socket } = require('engine.io');

const { argv } = process;
let userDir = '.';

// Find the new path to use
argv.slice(2).some(arg => {
  if (!arg.includes('--')) {
    userDir = arg;

    // Absolute paths are not allowed.
    if (userDir[0] === '/') {
      throw new Error('No absolute paths are allowed with this tool');
    }

    // Directory must be relative to this folder (no global).
    if (userDir[0] !== '.') {
      userDir = `./${userDir}`;
    }
  }
});

const CWD = join(process.cwd(), userDir);

// CLI Colors
const gray = '\x1B[37m';
const green = '\x1B[32m';
const reset = '\x1B[m';
const quiet = argv.includes('--quiet');

argv.forEach(arg => {
  if (arg.includes('--hook')) {
    const path = arg.split('=')[1];
    require(join(process.cwd(), path));
  }
});

const webServer = express();
const watcher = watch(CWD, {
  ignored: /([\/\\]\.)|(node_modules)/,
  persistent: true,
  alwaysStat: true,
});

const read = (/** @type {string} */ path) => new Promise((res, rej) => {
  readFile(join(CWD, path), (err, buffer) => {
    err ? rej(err) : res(buffer);
  });
});

const formatMarkdown = (/** @type {string} */ markup) => `<html>
  <body>
    ${marked(String(markup))}
  </body>
</html>`;

webServer.use((req, res, next) => {
  const url = req.url.split('?')[0];
  const ext = extname(url);
  const isRoot = url === '' || url.slice(-1) === '/';
  const path = (/** @type {string} */ newExt) => {
    // If the path has an extension pass through.
    if (ext && ext !== '.html') {
      throw null;
    }

    // If dealing with HTML, send the client script.
    if (ext === '.html') {
      return url;
    }

    return `${isRoot ? 'index' : url}.${newExt}`;
  };

  // TODO This area needs some work with regards to extension handling.
  return new Promise((resolve, reject) => read(path('html')).then(resolve, reject))
    .catch(() => read(path('md')).then(formatMarkdown))
    .catch(() => read(path('markdown')).then(formatMarkdown))
    .then(buffer => res.send(`
      ${String(buffer)}
      <script>${clientScript}</script>
    `))
    .catch(() => res.sendFile(join(CWD, url)))
    .catch(() => next());
});

const port = Number(process.env.SERVER_PORT) || 8000;
const host = process.env.SERVER_HOST || '0.0.0.0';

webServer.listen(port, host, () => {
  if (!quiet) {
    console.log(`Open http://localhost:8000\n`);
  }

  watcher.on('change', path => {
    readFile(path, { encoding: 'utf8' }, (_err, markup) => {
      getSocket.then(sockets => {
        if (!quiet) {
          console.log(`${green}${path} changed${reset}`);
        }
        sockets.forEach((/** @type {Socket} */socket) => {
          const file = path.slice(CWD.length + 1);
          const state = { file, markup, quiet };
          if (state.file.includes('.md') || state.file.includes('.markdown')) {
            state.file = state.file.replace(/(\.md|\.markdown|\.html)/g, '');
            state.markup = formatMarkdown(state.markup);
          }
          socket.send(JSON.stringify(state));
        });
      });
    });
  });
});

const spinner = new Spinner(`${gray}Watching ${userDir} for changes %s${reset} `);

spinner.setSpinnerString(27);
spinner.start();
