import { strictEqual, throws, doesNotThrow } from 'assert';
import * as diff from '../../lib/index';
import html from '../../lib/html';
import validateMemory from '../util/validate-memory';

describe('Integration: outerHTML', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture.firstChild);
    diff.release(this.fixture);

    validateMemory();
  });

  it('can support using whitespace', function() {
    diff.outerHTML(this.fixture, html`
      <div>
        <p>this</p>
      </div>
    `);

    strictEqual(this.fixture.firstElementChild.tagName, 'P');
    strictEqual(this.fixture.firstElementChild.textContent, 'this');
  });

  it('can support using whitespace and text', function() {
    diff.outerHTML(this.fixture, html`
      <div></div> test
    `);

    strictEqual(this.fixture.firstElementChild.tagName, 'DIV');
    strictEqual(this.fixture.innerHTML.trim(), '<div></div> test');
  });

  it('can recalculate the tree if contents are unexpectedly changed', function() {
    diff.outerHTML(this.fixture, '<div><p></p></div>');
    this.fixture.innerHTML = '<span></span>';
    diff.outerHTML(this.fixture, '<div><p>this</p></div>');

    strictEqual(this.fixture.firstChild.tagName, 'P');
    strictEqual(this.fixture.firstChild.textContent, 'this');
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
    strictEqual(documentElement.childNodes[0].childNodes.length, 0);

    diff.outerHTML(documentElement, originalSource);
    strictEqual(documentElement.childNodes[0].childNodes.length, 1);
    strictEqual(documentElement.childNodes[0].childNodes[0].childNodes[0].nodeValue, 'Test');

    diff.release(documentElement);
    doc.close();
  });

  it('can diff two fragments updating only contents', function() {
    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createElement('div'));

    const frag2 = document.createDocumentFragment();
    frag2.appendChild(document.createElement('div'));
    frag2.firstChild.appendChild(document.createTextNode('test'));

    diff.outerHTML(frag1, frag2);

    diff.release(frag1);
    diff.release(frag2);
  });

  it('cannot replace an element without a parent', function() {
    throws(() => {
      diff.outerHTML(this.fixture, '<p></p>');
    });
  });

  it('will not error when replacing with more elements', function() {
    doesNotThrow(function() {
      diff.outerHTML(this.fixture, '<div><p></p><p></p></div>');
      diff.outerHTML(this.fixture, '<div><span></span><i></i>test</div>');
    }.bind(this));
  });

  it('can replace an element with a parent', function() {
    diff.outerHTML(this.fixture.firstChild, '<p></p>');
    strictEqual(this.fixture.firstChild.tagName, 'P');
  });

  it('will respect executeScripts option', function() {
    document.body.appendChild(this.fixture);

    diff.outerHTML(this.fixture, `
      <div>
        <script>
          const script1 = document.createElement('script');
          script1.id = 'test';
          document.body.firstElementChild.appendChild(script1);
        </script>
      </div>
    `, { executeScripts: true });

    strictEqual(Boolean(document.querySelector('#test')), true);

    document.body.removeChild(this.fixture);
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

    strictEqual(this.fixture.firstChild.nodeName, 'DIV');
    strictEqual(this.fixture.firstChild.getAttribute('id'), 'test');
    strictEqual(this.fixture.firstChild.id, 'test');
    strictEqual(this.fixture.firstChild.textContent, 'hello world');
  });

  it('can use a tagged template function', function() {
    diff.outerHTML(this.fixture.firstChild, html
      `<div id="test">hello world</div>`
    );

    strictEqual(this.fixture.firstChild.nodeName, 'DIV');
    strictEqual(this.fixture.firstChild.getAttribute('id'), 'test');
    strictEqual(this.fixture.firstChild.id, 'test');
    strictEqual(this.fixture.firstChild.textContent, 'hello world');
  });

  describe('Comments', function() {
    it('ignores comments', function() {
      diff.outerHTML(this.fixture, '<div><p><!-- test --></p></div>');

      strictEqual(this.fixture.innerHTML, '<p></p>');
    });
  });

  describe('Text', function() {
    it('can be updated by directly setting', function() {
      diff.outerHTML(this.fixture, '<div>test</div>');

      strictEqual(this.fixture.textContent, 'test');

      diff.outerHTML(this.fixture, '<div>this</div>');

      strictEqual(this.fixture.textContent, 'this');
    });

    it('can replace over markup', function() {
      diff.outerHTML(this.fixture, '<div><div>test div</div></div>');
      diff.outerHTML(this.fixture, '<div>this</div>');

      strictEqual(this.fixture.innerHTML, 'this');
    });

    it('will not replace a previous span', function() {
      diff.outerHTML(this.fixture, '<div><span class="test"></span></div>');
      var span = this.fixture.querySelector('.test');
      diff.outerHTML(this.fixture, '<div><span>whatever</span></div>');

      strictEqual(this.fixture.innerHTML, '<span>whatever</span>');
      strictEqual(this.fixture.firstChild, span, 'are the same element');
    });

    it('will properly escape markup being injected into script tags', function() {
      diff.outerHTML(this.fixture, `<div>
        <script test>
          var test = "<p></p>";
        </script>
      </div>`);

      strictEqual(this.fixture.querySelector('p'), null);
      strictEqual(this.fixture.childNodes[1].innerHTML.trim(), `
         var test = \"<p></p>\";
      `.trim());
    });
  });

  describe('Attributes', function() {
    it('can set attributes to empty', function() {
      diff.outerHTML(this.fixture, '<div><input value="hello"></div>');
      diff.outerHTML(this.fixture, '<div></div>');
      diff.outerHTML(this.fixture, '<div><input value=""></div>');

      strictEqual(this.fixture.innerHTML, '<input value="">');
    });

    it('can change attributes', function() {
      diff.outerHTML(this.fixture, '<div class="hello"></div>');

      strictEqual(this.fixture.className, 'hello');
    });

    it('can change attributes more than once', function() {
      diff.outerHTML(this.fixture, '<div class="hello"></div>');
      diff.outerHTML(this.fixture, '<div class="hello to you"></div>');

      strictEqual(this.fixture.className, 'hello to you');
    });

    it('supports inline styles', function() {
      diff.outerHTML(this.fixture,
        '<div><p style="font-size: 11px"></p></div>');

      strictEqual(this.fixture.firstChild.style.fontSize, '11px');
    });

    it('supports setting input value', function() {
      diff.outerHTML(this.fixture, '<div><input value="one"></div>');
      diff.outerHTML(this.fixture, '<div><input value="test"></div>');

      strictEqual(this.fixture.firstChild.value, 'test');
    });

    it('supports setting input value with html encoded values', function() {
      diff.outerHTML(this.fixture, `<div>
        <input value="&lt;b&gt;test&lt;/b&gt;">
      </div>`);

      strictEqual(this.fixture.querySelector('input').value, '<b>test</b>');
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

      strictEqual(input.getAttribute('checked'), 'checked');
      strictEqual(input.checked, true);

      diff.outerHTML(this.fixture, '<div><input type="checkbox"></div>');

      strictEqual(input.getAttribute('checked'), null);
      strictEqual(input.checked, false);
    });

    describe('Data', function() {
      it('has basic support', function() {
        diff.outerHTML(this.fixture, '<div><p data-test="test2"></p></div>');

        strictEqual(this.fixture.innerHTML, '<p data-test="test2"></p>');
      });

      it('can handle dash separated properties', function() {
        diff.outerHTML(this.fixture,
          '<div><p data-test-two="test2"></p></div>');

        strictEqual(this.fixture.innerHTML, '<p data-test-two="test2"></p>');
      });
    });
  });
});
