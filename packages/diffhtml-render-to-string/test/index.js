const { equal } = require('assert');
const { html } = require('diffhtml');
const renderToString = require('../');

describe('renderToString', function() {
  it('can render simple vTree', () => {
    const actual = renderToString(html`<div>Hello world</div>`);
    const expected = `<div>Hello world</div>`;

    equal(actual, expected);
  });

  it('can render attributes', () => {
    const actual = renderToString(html`<div data-test="test" />`);
    const expected = `<div data-test="test"/>`;

    equal(actual, expected);
  });

  it('can render dynamic attributes', () => {
    const actual = renderToString(html`<div data-test=${() => {}} />`);
    const expected = `<div data-test/>`;

    equal(actual, expected);
  });

  it('can render a value-less attribute', () => {
    const actual = renderToString(html`<div disabled/>`);
    const expected = `<div disabled="disabled"/>`;

    equal(actual, expected);
  });

  it('can render components', () => {
    class Component {
      render() {
        return html`
          <p>Hello world</p>
        `;
      }
    }

    const actual = renderToString(html`
      <div>
        <${Component}  />
      </div>
    `);

    const expected = `<div><p>Hello world</p>
      </div>`;

    equal(actual, expected);
  });
});
