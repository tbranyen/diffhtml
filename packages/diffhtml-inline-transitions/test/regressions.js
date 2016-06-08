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
    var count = 0;

    const attached = el => {
      count++;
      return undefined;
    };

    innerHTML(this.fixture, html`<div attached=${attached}>
      <div></div>
    </div>`);

    assert.equal(count, 2);
  });
});
