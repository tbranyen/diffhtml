const { equal, throws } = require('assert');
const { html } = require('diffhtml');
const { Component } = require('diffhtml-components');
const { renderToString } = require('../');

const whitespaceEx = /[ ]{2,}|\n/g;

describe('renderToString', function() {
  it('can render simple div string', () => {
    const actual = renderToString('<div>Hello world</div>');
    const expected = `<div>Hello world</div>`;

    equal(actual, expected);
  });

  it('can render pure text, no wrapper element', () => {
    const actual = renderToString('Hello world');
    const expected = `Hello world`;

    equal(actual, expected);
  });

  it('can support strict html parsing, throwing on error', () => {
    throws(() => {
      renderToString('<p>Hello world', { parser: { strict: true } });
    }, {
      name: 'Error',
      message: `

<p>Hello world
 ^
    Possibly invalid markup. <p> must be closed in strict mode.
            `
    });
  });

  it('can render simple vTree', () => {
    const actual = renderToString(html`<div>Hello world</div>`);
    const expected = `<div>Hello world</div>`;

    equal(actual, expected);
  });

  it('can render attributes', () => {
    const actual = renderToString(html`<div data-test="test" />`);
    const expected = `<div data-test="test"></div>`;

    equal(actual, expected);
  });

  it('can render dynamic attributes', () => {
    const actual = renderToString(html`<div data-test=${() => {}} />`);
    const expected = `<div data-test></div>`;

    equal(actual, expected);
  });

  it('can render a value-less attribute', () => {
    const actual = renderToString(html`<div disabled/>`);
    const expected = `<div disabled="disabled"></div>`;

    equal(actual, expected);
  });

  it('can render top level document fragments', () => {
    const actual = renderToString(html`<div/><p/>`);
    const expected = `<div></div><p></p>`;

    equal(actual, expected);
  });

  it('can render top level single adjacent document fragments', () => {
    const actual = renderToString(html`<div/>${html`<div/><p/>`}`);
    const expected = `<div></div><div></div><p></p>`;

    equal(actual, expected);
  });

  it('can render top level document fragments adjacent single', () => {
    const actual = renderToString(html`${html`<div/><p/>`}<div/>`);
    const expected = `<div></div><p></p><div></div>`;

    equal(actual, expected);
  });

  it('can render nested document fragments', () => {
    const actual = renderToString(html`<div>${html`<div/><p/>`}</div>`);
    const expected = `<div><div></div><p></p></div>`;

    equal(actual, expected);
  });

  it('can render components', () => {
    class MyComponent extends Component {
      render() {
        return html`
          <p>Hello world</p>
        `;
      }
    }

    const actual = renderToString(html`
      <div>
        <${MyComponent}  />
      </div>
    `);

    const expected = '<div><p>Hello world</p></div>';

    equal(actual.replace(whitespaceEx, ''), expected);
  });

  it('can render components with props', () => {
    class MyComponent extends Component {
      render({ message }) {
        return html`
          <p>${message}</p>
        `;
      }
    }

    const actual = renderToString(html`
      <div>
        <${MyComponent} message="Hello world" />
      </div>
    `);

    const expected = `<div><p>Hello world</p></div>`;

    equal(actual.replace(whitespaceEx, ''), expected);
  });

  it('can render components with dynamic props', () => {
    class MyComponent extends Component {
      render({ display }) {
        return html`
          <p>${display.message}</p>
        `;
      }
    }

    const actual = renderToString(html`
      <div>
        <${MyComponent} display=${{ message: 'Hello world' }} />
      </div>
    `);

    const expected = `<div><p>Hello world</p></div>`;

    equal(actual.replace(whitespaceEx, ''), expected);
  });

  it('can render components with nested elements', () => {
    class MyComponent extends Component {
      render() {
        return html`
          <html>
            <head>
              <title>Test</title>
            </head>

            <body>
            </body>
          </html>
        `;
      }
    }

    const actual = renderToString(html`
      <${MyComponent} />
    `);

    const expected = `<html><head><title>Test</title></head><body></body></html>`;

    equal(actual.replace(whitespaceEx, ''), expected);
  });
});
