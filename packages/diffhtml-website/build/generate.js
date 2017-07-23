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

  const public = path => join(__dirname, '../', config.output_dir, path);
  const content = path => join(__dirname, '../pages', path);

  keys(config.pages).forEach(name => {
    const [ path ] = config.pages[name];

    console.log(`Rendering page ${public(path)}`);

    // Look for markdown content to inject.
    let markup = '';

    const mdPath = content(path.replace('.html', '.md'));

    if (existsSync(mdPath)) {
      markup = marked(String(readFileSync(mdPath)));
    }

    writeFileSync(public(path), renderToString(html`
      <${Layout} path=${path} pages=${pages} content=${html(markup)} />
    `));
  });
}

generate();

module.exports = generate;
