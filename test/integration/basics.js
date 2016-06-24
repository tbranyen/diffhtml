import * as diff from '../../lib/index';
import validateMemory from '../util/validateMemory';

describe('Integration: Basics', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  describe('Expose API', function() {
    it('exposes diffhtml global', function() {
      assert.equal(typeof diff, 'object');
    });

    it('exists on Element prototype', function() {
      assert(!('diffInnerHTML' in Element.prototype));
      assert(!('diffOuterHTML' in Element.prototype));

      diff.enableProllyfill();

      assert('diffInnerHTML' in Element.prototype);
      assert('diffOuterHTML' in Element.prototype);
    });
  });

  describe('Call API', function() {
    it('will error if element is missing', function() {
      assert.throws(function() {
        diff.innerHTML();
      });

      assert.throws(function() {
        diff.outerHTML();
      });
    });

    it('will not error if markup is missing', function() {
      var test = this;

      assert.doesNotThrow(function() {
        diff.outerHTML(test.fixture, '');
      });

      assert.doesNotThrow(function() {
        diff.innerHTML(test.fixture, '');
      });
    });

    it('will not error if options are missing', function() {
      var test = this;

      assert.doesNotThrow(function() {
        diff.outerHTML(test.fixture, '<div></div>');
      });

      assert.doesNotThrow(function() {
        diff.innerHTML(test.fixture, '<div></div>');
      });
    });
  });

  describe('Special features', function() {
    it('can modify the document\'s title', function() {
      var doc = document.implementation.createHTMLDocument('');

      doc.open();
      doc.write('<html><head><title></title></head></html>');

      var documentElement = doc.documentElement;
      diff.outerHTML(documentElement, '<html><head><title>Test</title></head></html>');

      assert.equal(doc.title, 'Test');

      diff.release(documentElement);
      doc.close();
    });
  });

  describe('DocumentFragment', function() {
    it('can diff elements into a fragment', function() {
      var fragment = document.createDocumentFragment();

      diff.innerHTML(fragment, `
        <p>Supports DocumentFragments</p>
      `);

      assert.equal(fragment.childNodes[0].nodeName.toLowerCase(), 'p');
      assert.equal(fragment.childNodes[0].childNodes[0].nodeValue, 'Supports DocumentFragments');

      diff.release(fragment);
    });

    it('can diff a fragment into an element', function() {
      var fragment = document.createDocumentFragment();

      diff.innerHTML(fragment, `
        <h1>It works</h1>
      `);

      diff.element(this.fixture, fragment, { inner: true });

      assert.equal(this.fixture.childNodes[0].nodeName.toLowerCase(), 'h1');
      assert.equal(this.fixture.childNodes[0].childNodes[0].nodeValue, 'It works');

      diff.release(fragment);
    });
  });

  describe('Custom elements', function() {
    it('supports the use of custom elements', function() {
      diff.innerHTML(this.fixture, '<custom-element></custom-element>');

      assert.ok(this.fixture.querySelector('custom-element'));
    });
  });
});
