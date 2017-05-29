const engine = require('engine.io');
const server = engine.listen(54321);

module.exports = new Promise(resolve => server.on('connection', resolve));
