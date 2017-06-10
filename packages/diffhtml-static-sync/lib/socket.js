const engine = require('engine.io');
const server = engine.listen(process.env.WS_PORT || 54321);

const sockets = new Set();

module.exports = new Promise(resolve => server.on('connection', socket => {
  sockets.add(socket);
  resolve(sockets);
}));

process.on('exit', () => server.close());
