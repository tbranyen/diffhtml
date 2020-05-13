import assert from 'assert';
import * as diff from '../../lib/index.js';
import validateMemory from '../util/validate-memory';

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

      assert.equal(this.fixture.querySelector('g').namespaceURI, this.namespace);
    });

    it('can insert complete SVG documents', function() {
      const container = document.createElement('div');

      diff.innerHTML(container, '<svg><g id="test"></g></svg>');

      assert.equal(container.querySelector('g').namespaceURI, this.namespace);

      diff.release(container);
    });

    it('can diff complete SVG documents', function() {
      const container = document.createElement('div');

      diff.innerHTML(container, '<svg><g id="test"></g></svg>');
      assert.equal(container.querySelector('g').namespaceURI, this.namespace);

      diff.innerHTML(container, '<svg><rect id="test2" /></svg>');
      assert.equal(container.querySelector('rect').namespaceURI, this.namespace);

      diff.release(container);
    });

    it('can replace element with complete SVG document', function() {
      const container = document.createElement('div');

      diff.innerHTML(container, '<div></div>>');
      diff.innerHTML(container, '<svg><rect id="test2" /></svg>');
      assert.equal(container.querySelector('svg').namespaceURI, this.namespace);
      assert.equal(container.querySelector('rect').namespaceURI, this.namespace);

      diff.release(container);
    });
  });
});
