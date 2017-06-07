import assert from 'assert';
import * as diff from '../../lib/index.js';
import validateMemory from '../util/validateMemory';

describe('Integration: SVG', function() {
  beforeEach(function() {
    this.fixture = document.createElement('svg');
    this.namespace = 'http://www.w3.org/2000/svg';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  describe('Support', function() {
    it('can create SVG elements', function() {
      diff.innerHTML(this.fixture, '<g id="test"></g>');

      assert.equal(this.fixture.firstChild.namespaceURI, this.namespace);
    });
  });
});
