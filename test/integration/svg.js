import * as diff from '../../lib/index.js';

describe('Integration: SVG', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<svg></svg>';
    this.namespace = 'http://www.w3.org/2000/svg';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();
  });

  describe('Support', function() {
    it('can create SVG elements', function() {
      diff.innerHTML(this.fixture, '<g id="test"></g>');

      assert.equal(this.fixture.firstChild.namespaceURI, this.namespace);
    });
  });
});
