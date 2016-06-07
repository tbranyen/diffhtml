const assert = require('assert');
const diff = require('diffhtml');
const inlineTransitions = require('../index');

const { innerHTML, html } = diff;

describe('Basics', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    this.unsubscribeInlineTransitions = inlineTransitions(diff);
  });

  afterEach(() => {
    this.unsubscribeInlineTransitions();
  });

  it('can listen for changes', (done) => {
    const attached = el => {
      assert.equal(el, this.fixture.firstChild);
      done();
    };

    innerHTML(this.fixture, html`<div attached=${attached}></div>`);
  });

  it('can stop listening for hooks', () => {
    let count = 0;

    const attached = el => {
      assert.equal(el, this.fixture.firstChild);
      count++;
    };

    innerHTML(this.fixture, html`<div attached=${attached}></div>`);

    this.unsubscribeInlineTransitions();

    innerHTML(this.fixture, html`<div attached=${attached}>
      <div></div>
    </div>`);

    assert.equal(count, 1);
  });

  it('will pass through types to a hook', () => {
    const attached = true;
    innerHTML(this.fixture, html`<div attached=${attached}></div>`);
    assert.equal(this.fixture.firstChild.getAttribute('attached'), true);
  });

  it('can halt on a promise', (done) => {
    const detached = el => {
      return new Promise(resolve => setTimeout(resolve, 0));
    };

    innerHTML(this.fixture, html`<div detached=${detached}>
      <p></p>
    </div>`);

    innerHTML(this.fixture, html`<div detached=${detached}></div>`);

    assert.ok(this.fixture.querySelector('p'));

    setTimeout(() => {
      assert.ok(!this.fixture.querySelector('p'));
      done();
    }, 20);
  });
});
