import * as diff from '../../lib/index.js';
import validateMemory from '../util/validateMemory';

describe('Integration: outerHTML', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture.firstChild);
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  it('can recalculate the tree if contents are unexpectedly changed', function() {
    diff.outerHTML(this.fixture, '<div><p></p></div>');
    this.fixture.innerHTML = '<span></span>';
    diff.outerHTML(this.fixture, '<div><p>this</p></div>');

    assert.equal(this.fixture.firstChild.tagName, 'P');
    assert.equal(this.fixture.firstChild.textContent, 'this');
  });

  it('can replace the documentElement', function() {
    var doc = document.implementation.createHTMLDocument();
    doc.open();
    doc.write('<html><head><title>Test</title></head></html>');

    var documentElement = doc.documentElement;
    var originalSource = documentElement.outerHTML;

    diff.outerHTML(documentElement, '<html><head></head></html>');
    assert.equal(documentElement.childNodes[0].childNodes.length, 0);

    diff.outerHTML(documentElement, originalSource);
    assert.equal(documentElement.childNodes[0].childNodes.length, 1);
    assert.equal(documentElement.childNodes[0].childNodes[0].childNodes[0].nodeValue, 'Test');

    diff.release(documentElement);
    doc.close();
  });

  it('cannot replace an element without a parent', function() {
    assert.throws(() => {
      diff.outerHTML(this.fixture, '<p></p>');
    });
  });

  it('will not error when replacing with more elements', function() {
    assert.doesNotThrow(function() {
      diff.outerHTML(this.fixture, '<div><p></p><p></p></div>');
      diff.outerHTML(this.fixture, '<div><span></span><i></i>test</div>');
    }.bind(this));
  });

  it('can replace an element with a parent', function() {
    diff.outerHTML(this.fixture.firstChild, '<p></p>');

    assert.equal(this.fixture.firstChild.tagName, 'P');
  });

  describe('Comments', function() {
    it('ignores comments', function() {
      diff.outerHTML(this.fixture, '<div><p><!-- test --></p></div>');

      assert.equal(this.fixture.innerHTML, '<p></p>');
    });
  });

  describe('Text', function() {
    it('can be updated by directly setting', function() {
      diff.outerHTML(this.fixture, '<div>test</div>');

      assert.equal(this.fixture.textContent, 'test');

      diff.outerHTML(this.fixture, '<div>this</div>');

      assert.equal(this.fixture.textContent, 'this');
    });

    it('can replace over markup', function() {
      diff.outerHTML(this.fixture, '<div><div>test div</div></div>');
      diff.outerHTML(this.fixture, '<div>this</div>');

      assert.equal(this.fixture.innerHTML, 'this');
    });

    it('will not replace a previous span', function() {
      diff.outerHTML(this.fixture, '<div><span class="test"></span></div>');
      var span = this.fixture.querySelector('.test');
      diff.outerHTML(this.fixture, '<div><span>whatever</span></div>');

      assert.equal(this.fixture.innerHTML, '<span>whatever</span>');
      assert.equal(this.fixture.firstChild, span, 'are the same element');
    });

    it('will properly escape markup being injected into script tags', function() {
      diff.outerHTML(this.fixture, `
        <div>
          <script test>
            var test = "<p></p>";
          </script>
        </div>
      `);

      assert.equal(this.fixture.querySelector('p'), null);
      assert.equal(this.fixture.childNodes[1].firstChild.textContent.trim(), `
         var test = \"<p></p>\";
      `.trim());
    });
  });

  describe('Attributes', function() {
    it('can set attributes to empty', function() {
      diff.outerHTML(this.fixture, '<div><input value="hello"></div>');
      diff.outerHTML(this.fixture, '<div></div>');
      diff.outerHTML(this.fixture, '<div><input value=""></div>');

      assert.equal(this.fixture.innerHTML, '<input value="">');
    });

    it('can change attributes', function() {
      diff.outerHTML(this.fixture, '<div class="hello"></div>');

      assert.equal(this.fixture.className, 'hello');
    });

    it('can change attributes more than once', function() {
      diff.outerHTML(this.fixture, '<div class="hello"></div>');
      diff.outerHTML(this.fixture, '<div class="hello to you"></div>');

      assert.equal(this.fixture.className, 'hello to you');
    });

    it('supports inline styles', function() {
      diff.outerHTML(this.fixture,
        '<div><p style="font-size: 11px"></p></div>');

      assert.equal(this.fixture.innerHTML, '<p style="font-size: 11px"></p>');
    });

    it('supports setting input value', function() {
      diff.outerHTML(this.fixture, '<div><input value="one"></div>');
      diff.outerHTML(this.fixture, '<div><input value="test"></div>');

      assert.equal(this.fixture.firstChild.value, 'test');
    });

    describe('Data', function() {
      it('has basic support', function() {
        diff.outerHTML(this.fixture, '<div><p data-test="test2"></p></div>');

        assert.equal(this.fixture.innerHTML, '<p data-test="test2"></p>');
      });

      it('can handle dash separated properties', function() {
        diff.outerHTML(this.fixture,
          '<div><p data-test-two="test2"></p></div>');

        assert.equal(this.fixture.innerHTML, '<p data-test-two="test2"></p>');
      });
    });
  });
});
