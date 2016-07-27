const { readFile } = require('fs');
const { join } = require('path');
const combyne = require('combyne');
const express = require('express');
const favicon = require('serve-favicon');
const apiDox = require('diffhtml-dox');

const app = express();
const port = process.env.PORT || 8000;
const path = './template.html';

const renderResponse = version => res => {
  readFile(path, (err, result) => {
    apiDox.getApiState(version).then(state => {
      const template = combyne(String(result));
      const html = template.render({ api: state });

      res.send(html);
    });
  });
};

app.use(express.static('./'));
app.use(favicon(new Buffer(20)));
app.use('/api', apiDox.router);
app.get('/:version', (req, res) => renderResponse(req.params.version)(res));
app.get('/', (req, res) => renderResponse()(res));

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
