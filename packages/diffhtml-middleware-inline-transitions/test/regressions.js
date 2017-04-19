const assert = require('assert');
const { use, html, innerHTML } = require('diffhtml');
const inlineTransitions = require('../index');

describe('Regressions', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    this.unsubscribeInlineTransitions = use(inlineTransitions());
  });

  afterEach(() => {
    this.unsubscribeInlineTransitions();
  });

  it('does not error when non-Promises are returned', () => {
    var count = 0;

    const onattached = el => {
      count++;
      return undefined;
    };

    innerHTML(this.fixture, html`
      <div onattached=${onattached}>
        <div></div>
      </div>
    `);

    assert.equal(count, 2);
  });
});
