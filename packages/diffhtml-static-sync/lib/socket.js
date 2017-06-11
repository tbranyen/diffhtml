const engine = require('engine.io');
const server = engine.listen(process.env.WS_PORT || 54321);

const sockets = new Set();
const yellow = '\x1B[33m';
const reset = '\x1B[m';
const quiet = process.argv.includes('--quiet');

module.exports = new Promise(resolve => server.on('connection', socket => {
  if (!quiet) {
    console.log(`${yellow}Socket connection established${reset}`);
  }

  sockets.add(socket);
  resolve(sockets);
}));

process.on('exit', () => server.close());
