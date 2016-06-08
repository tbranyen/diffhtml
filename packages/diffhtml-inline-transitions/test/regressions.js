const assert = require('assert');
const diff = require('diffhtml');
const inlineTransitions = require('../index');

const { innerHTML, html } = diff;

describe('Regressions', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    this.unsubscribeInlineTransitions = inlineTransitions(diff);
  });

  afterEach(() => {
    this.unsubscribeInlineTransitions();
  });

  it('does not error when non-Promises are returned', () => {
    const attached = el => {
      return undefined;
    };

    innerHTML(this.fixture, html`<div attached=${attached}>
      <div></div>
    </div>`);
  });
});
