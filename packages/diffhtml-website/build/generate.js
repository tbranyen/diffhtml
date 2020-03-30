const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const { html, renderToString } = require('diffhtml-render-to-string');
const marked = require('marked');
const flattenPages = require('./util/flatten-pages');
const { keys } = Object;

// Ensure Components middleware is loaded since Layout is a class
// component and render-to-string will pick it up automatically.
require('diffhtml-components');

// Do some marked magic to fix the target="blank" security issue.
const renderer = new marked.Renderer();

// Patch the renderer to allow for better anchor tags to be generated.
renderer.link = (href, title = text, text) => {
  if (href.indexOf('http') === 0) {
    return `
      <a
        href="${href}"
        target="_blank"
        rel="noopener noreferrer"
        title="${title}"
      >${text}</a>
    `;
  }

  return `
    <a href="${href}" title="${title}">${text}</a>
  `;
};

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
      markup = marked(String(readFileSync(mdPath)), { renderer });
    }

    const contents = renderToString(html`
      <${Layout}
        path=${path}
        page=${name}
        pages=${pages}
        content=${html(markup)}
      />
    `);

    const publicPath = toPublic(path);
    let existingContents = '';

    try { existingContents = String(readFileSync(publicPath)); } catch(ex) {}

    // Only write out if the contents have changed.
    if (contents !== existingContents) {
      console.log(`${toPublic(path)} changed, writing to disk`);
      writeFileSync(publicPath, contents);
    }
  });
}

generate();

module.exports = generate;
