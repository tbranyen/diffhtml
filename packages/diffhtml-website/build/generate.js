const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const { html } = require('diffhtml');
const renderToString = require('diffhtml-render-to-string');
const marked = require('marked');
const flattenPages = require('./util/flatten-pages');
const { keys } = Object;

function generate() {
  delete require.cache[require.resolve('../components/layout')];
  delete require.cache[require.resolve('../config.json')];

  const Layout = require('../components/layout');
  const config = require('../config.json');
  const pages = flattenPages(config.pages);

  const toPublic = path => join(__dirname, '../', config.output_dir, path);
  const toPages = path => join(__dirname, '../pages', path);

  keys(config.pages).forEach(name => {
    const [ path ] = config.pages[name];

    // Look for markdown content to inject.
    let markup = '';

    const mdPath = toPages(path.replace('.html', '.md'));

    if (existsSync(mdPath)) {
      markup = marked(String(readFileSync(mdPath)));
    }

    const contents = renderToString(html`
      <${Layout} path=${path} pages=${pages} content=${html(markup)} />
    `);

    const publicPath = toPublic(path);
    const existingContents = String(readFileSync(publicPath));

    // Only write out if the contents have changed.
    if (contents !== existingContents) {
      console.log(`${toPublic(path)} changed, writing to disk`);
      writeFileSync(publicPath, contents);
    }
  });
}

generate();

module.exports = generate;
