const server = require('express')();
const port = process.env.PORT || 8000;

server.use(require('../index').router);
server.listen(port, () => console.log(`http://localhost:${port}/`));
