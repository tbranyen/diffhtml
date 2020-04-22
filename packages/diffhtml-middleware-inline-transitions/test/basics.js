const assert = require('assert');
const { use, html, innerHTML } = require('diffhtml');
const inlineTransitions = require('../lib');

describe('Basics', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    this.unsubscribeInlineTransitions = use(inlineTransitions());
  });

  afterEach(() => {
    this.unsubscribeInlineTransitions();
  });

  it('can listen for changes', (done) => {
    const attached = el => {
      assert.equal(el, this.fixture.firstChild);
      done();
    };

    innerHTML(this.fixture, html`<div onattached=${attached}></div>`);
  });

  it('can stop listening for hooks', async () => {
    let count = 0;

    const attached = el => {
      assert.equal(el, this.fixture.firstChild);
      count++;
    };

    await innerHTML(this.fixture, html`<div onattached=${attached}></div>`);

    this.unsubscribeInlineTransitions();

    await innerHTML(this.fixture, html``);
    await innerHTML(this.fixture, html`<div onattached=${attached}>
      <div></div>
    </div>`);

    assert.equal(count, 1);
  });

  it('will set literal values directly on the element', () => {
    const attached = true;
    innerHTML(this.fixture, html`<div onattached=${attached}></div>`);
    assert.equal(this.fixture.firstChild.getAttribute('onattached'), 'true');
  });

  it('can halt on a promise', (done) => {
    const ondetached = el => new Promise(resolve => setTimeout(resolve, 0));

    innerHTML(this.fixture, html`
      <div ondetached=${ondetached}>
        <p></p>
      </div>
    `);

    innerHTML(this.fixture, html`<div ondetached=${ondetached}></div>`);

    assert.ok(this.fixture.querySelector('p'));

    setTimeout(() => {
      assert.ok(!this.fixture.querySelector('p'));
      done();
    }, 20);
  });

  it('supports detached transitions on the root element', (done) => {
    const ondetached = el => {
      assert.equal(el.nodeName.toLowerCase(), 'p')
      done();
    };

    innerHTML(this.fixture, html`<p ondetached=${ondetached}/>`);
    innerHTML(this.fixture, html``);
  });
});
