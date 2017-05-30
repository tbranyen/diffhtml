const engine = require('engine.io');
const server = engine.listen(process.env.WS_PORT || 54321);

module.exports = new Promise(resolve => server.on('connection', resolve));

process.on('exit', () => server.close());
