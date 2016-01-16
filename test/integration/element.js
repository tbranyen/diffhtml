import * as diff from '../../lib/index.js';

describe('Integration: element', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();
  });

  it('can not replace an element not in the dom', function() {
    var p = document.createElement('p');
    p.innerHTML = 'Hello world!';

    assert.throws(() => {
      diff.element(this.fixture, p);
    });
  });

  it('can replace the innerHTML', function() {
    var div = document.createElement('div');
    div.innerHTML = 'Hello world!';

    diff.element(this.fixture, div, { inner: true });

    assert.equal(this.fixture.outerHTML, '<div><div>Hello world!</div></div>');
  });

  it('can replace the outerHTML', function() {
    var div = document.createElement('div');
    div.innerHTML = 'Hello world!';

    diff.element(this.fixture, div);

    assert.equal(this.fixture.outerHTML, '<div>Hello world!</div>');
  });
});
