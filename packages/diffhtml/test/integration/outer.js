import assert from 'assert';
import * as diff from '../../lib/index';
import html from '../../lib/html';
import validateMemory from '../util/validate-memory';
import internals from '../../lib/util/internals';

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
    var doc = document.implementation.createHTMLDocument('');
    doc.open();
    doc.write('<html><head><title>Test</title></head></html>');

    // Ensure the title is actually set, seems like Firefox does not do this
    // automatically with `document.write`.
    doc.title = 'Test';

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

  it('can use a virtual dom element', function() {
    diff.outerHTML(this.fixture.firstChild, {
      nodeName: 'div',
      nodeType: 1,
      nodeValue: '',
      attributes: { id: 'test' },
      childNodes: [{
        nodeName: '#text',
        nodeValue: 'hello world',
        nodeType: 3,
        attributes: {},
        childNodes: []
      }]
    });

    assert.equal(this.fixture.firstChild.nodeName, 'DIV');
    assert.equal(this.fixture.firstChild.getAttribute('id'), 'test');
    assert.equal(this.fixture.firstChild.id, 'test');
    assert.equal(this.fixture.firstChild.textContent, 'hello world');
  });

  it('can use a tagged template function', function() {
    diff.outerHTML(this.fixture.firstChild, html
      `<div id="test">hello world</div>`
    );

    assert.equal(this.fixture.firstChild.nodeName, 'DIV');
    assert.equal(this.fixture.firstChild.getAttribute('id'), 'test');
    assert.equal(this.fixture.firstChild.id, 'test');
    assert.equal(this.fixture.firstChild.textContent, 'hello world');
  });

  it.skip('can use trimmed input to make comparing easier', function() {
    diff.Internals.globalConfig.parser = { trim: true };

    diff.outerHTML(this.fixture.firstChild, html`
      <div id="test">hello world</div>
    `);

    assert.equal(this.fixture.firstChild.nodeName, 'DIV');
    assert.equal(this.fixture.firstChild.getAttribute('id'), 'test');
    assert.equal(this.fixture.firstChild.id, 'test');
    assert.equal(this.fixture.firstChild.textContent, 'hello world');
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
      diff.outerHTML(this.fixture, `<div>
        <script test>
          var test = "<p></p>";
        </script>
      </div>`);

      assert.equal(this.fixture.querySelector('p'), null);
      assert.equal(this.fixture.childNodes[1].innerHTML.trim(), `
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

      assert.equal(this.fixture.firstChild.style.fontSize, '11px');
    });

    it('supports setting input value', function() {
      diff.outerHTML(this.fixture, '<div><input value="one"></div>');
      diff.outerHTML(this.fixture, '<div><input value="test"></div>');

      assert.equal(this.fixture.firstChild.value, 'test');
    });

    it('supports setting input value with html encoded values', function() {
      diff.outerHTML(this.fixture, `<div>
        <input value="&lt;b&gt;test&lt;/b&gt;">
      </div>`);

      assert.equal(this.fixture.querySelector('input').value, '<b>test</b>');
    });

    it('supports toggling checked attribute', function() {
      diff.outerHTML(this.fixture, '<div><input type="checkbox"></div>');

      var input = this.fixture.querySelector('input');
      var evt = document.createEvent('MouseEvent');

      evt.initMouseEvent(
        'click', true, true, window, null, 0, 0, 0, 0, false, false, false,
        false, 0, null
      );

      input.dispatchEvent(evt);
      diff.outerHTML(this.fixture, '<div><input type="checkbox" checked="checked"></div>');

      assert.equal(input.getAttribute('checked'), 'checked');
      assert.equal(input.checked, true);

      diff.outerHTML(this.fixture, '<div><input type="checkbox"></div>');

      assert.equal(input.getAttribute('checked'), null);
      assert.equal(input.checked, false);
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
