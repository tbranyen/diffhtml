const { equal } = require('assert');
const { use, html, innerHTML } = require('diffhtml');
const inlineTransitions = require('../lib');

const whitespaceEx = /[ ]{2,}|\n/g;

describe('Regressions', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    this.unsubscribeInlineTransitions = use(inlineTransitions());
  });

  afterEach(() => {
    this.unsubscribeInlineTransitions();
  });

  it('will not error when non-Promises are returned', () => {
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

    equal(count, 2);
  });

  it('will support nested text changes', async () => {
    var count = 0;

    const ontextchanged = el => {
      count++;
      return Promise.resolve();
    };

    await innerHTML(this.fixture, html`
      <div>
        <div ontextchanged=${ontextchanged}>test</div>
      </div>
    `);

    await innerHTML(this.fixture, html`
      <div>
        <div ontextchanged=${ontextchanged}>test this</div>
      </div>
    `);

    equal(
      this.fixture.innerHTML.replace(whitespaceEx, ''),
      '<div><div>test this</div></div>',
    );

    equal(count, 2);
  });
});
