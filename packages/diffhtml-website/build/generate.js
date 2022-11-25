const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');
const { html, toString, use, Internals } = require('diffhtml');
const { marked } = require('marked');
const mermaid = require('mermaid');
const flattenPages = require('./util/flatten-pages');
const { assign, keys } = Object;

// Ensure Components middleware is loaded since Layout is a class
// component and toString will pick it up automatically.
require('diffhtml-components');
//use(require('diffhtml-middleware-linter')());

// Create a jsdom and svgdom merged environment for Mermaid to work.
const SVG = require('svgdom');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');

// Patch the Element constructor which is inherited by SVGElement to contain
// the getBBox method to avoid runtime errors with mermaid.
window.Element.prototype.getBBox = SVG.SVGGraphicsElement.prototype.getBBox;

// Unfortunately this patching has to occur in order for the sanitize method
// to return the input and not break under mermaid. Would be great to have
// a fix that didn't involve this.
Object.prototype.sanitize = x => x;

assign(globalThis, {
  document: window.document,
  window,
});

// Mermaid parsing
use({
  createTreeHook({ nodeName, childNodes }) {
    if (nodeName === 'mermaid') {
      if (childNodes[0].nodeType === Internals.NODE_TYPE.TEXT) {
        try {
          mermaid.render('mermaid', childNodes[0].nodeValue.trim(), svg => {
            // Replace with the newly rendered SVG
            childNodes[0] = html(svg);
          });
        } catch (e) {
          childNodes[0] = html`<pre>${e.stack}</pre>`;
        }
      }
    }
  },
});

const renderer = {};

// Patch the renderer to allow for better anchor tags to be generated.
renderer.link = (href, title, text) => {
  title = title || text;

  // External URLs
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

  // Local URLs
  return `
    <a href="${href}" title="${title}">${text}</a>
  `;
};

marked.use({ renderer });

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
      markup = marked.parse(String(readFileSync(mdPath)));
    }

    const contents = toString(html`
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

      // Ensure directory exists, otherwise create it.
      mkdirSync(dirname(publicPath), { recursive: true });

      writeFileSync(publicPath, contents);
    }
  });
}

generate();

module.exports = generate;
