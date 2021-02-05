import { strictEqual, throws } from 'assert';
import { html, toString } from '../lib/index';
import { Component } from 'diffhtml-components';
import validateMemory from './util/validate-memory';

Component.unsubscribeMiddleware();

const whitespaceEx = /[ ]{2,}|\n/g;

describe('toString', function() {
  beforeEach(() => {
    Component.subscribeMiddleware();
  });

  afterEach(() => {
    Component.unsubscribeMiddleware();
    validateMemory();
  });

  it('can render simple div string', () => {
    const actual = toString('<div>Hello world</div>');
    const expected = `<div>Hello world</div>`;

    strictEqual(actual, expected);
  });

  it('can render pure text, no wrapper element', () => {
    const actual = toString('Hello world');
    const expected = `Hello world`;

    strictEqual(actual, expected);
  });

  it('can support strict html parsing, throwing on error', () => {
    throws(() => {
      toString('<p>Hello world', { parser: { strict: true } });
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
    const actual = toString(html`<div>Hello world</div>`);
    const expected = `<div>Hello world</div>`;

    strictEqual(actual, expected);
  });

  it('can render attributes', () => {
    const actual = toString(html`<div data-test="test" />`);
    const expected = `<div data-test="test"></div>`;

    strictEqual(actual, expected);
  });

  it('can render dynamic attributes', () => {
    const actual = toString(html`<div data-test=${() => {}} />`);
    const expected = `<div data-test></div>`;

    strictEqual(actual, expected);
  });

  it('can render a value-less attribute', () => {
    const actual = toString(html`<div disabled/>`);
    const expected = `<div disabled="disabled"></div>`;

    strictEqual(actual, expected);
  });

  it('can render top level document fragments', () => {
    const actual = toString(html`<div/><p/>`);
    const expected = `<div></div><p></p>`;

    strictEqual(actual, expected);
  });

  it('can render top level single adjacent document fragments', () => {
    const actual = toString(html`<div/>${html`<div/><p/>`}`);
    const expected = `<div></div><div></div><p></p>`;

    strictEqual(actual, expected);
  });

  it('can render top level document fragments adjacent single', () => {
    const actual = toString(html`${html`<div/><p/>`}<div/>`);
    const expected = `<div></div><p></p><div></div>`;

    strictEqual(actual, expected);
  });

  it('can render nested document fragments', () => {
    const actual = toString(html`<div>${html`<div/><p/>`}</div>`);
    const expected = `<div><div></div><p></p></div>`;

    strictEqual(actual, expected);
  });

  it('can render components', () => {
    class MyComponent extends Component {
      render() {
        return html`
          <p>Hello world</p>
        `;
      }
    }

    const actual = toString(html`
      <div>
        <${MyComponent}  />
      </div>
    `);

    const expected = '<div><p>Hello world</p></div>';

    strictEqual(actual.replace(whitespaceEx, ''), expected);
  });

  it('can render components with props', () => {
    class MyComponent extends Component {
      render({ message }) {
        return html`
          <p>${message}</p>
        `;
      }
    }

    const actual = toString(html`
      <div>
        <${MyComponent} message="Hello world" />
      </div>
    `);

    const expected = `<div><p>Hello world</p></div>`;

    strictEqual(actual.replace(whitespaceEx, ''), expected);
  });

  it('can render components with dynamic props', () => {
    class MyComponent extends Component {
      render({ display }) {
        return html`
          <p>${display.message}</p>
        `;
      }
    }

    const actual = toString(html`
      <div>
        <${MyComponent} display=${{ message: 'Hello world' }} />
      </div>
    `);

    const expected = `<div><p>Hello world</p></div>`;

    strictEqual(actual.replace(whitespaceEx, ''), expected);
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

    const actual = toString(html`
      <${MyComponent} />
    `);

    const expected = `<html><head><title>Test</title></head><body></body></html>`;

    strictEqual(actual.replace(whitespaceEx, ''), expected);
  });
});
