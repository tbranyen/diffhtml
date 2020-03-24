import assert from 'assert';
import * as diff from '../../lib/index';
import validateMemory from '../util/validateMemory';
import release from '../../lib/release';

const { html } = diff;

describe('Integration: innerHTML', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  it('can recalculate the tree if contents are unexpectedly changed', function() {
    diff.innerHTML(this.fixture, '<p></p>');
    this.fixture.innerHTML = '<span></span>';
    diff.innerHTML(this.fixture, '<p>this</p>');

    assert.equal(this.fixture.firstChild.tagName, 'P');
    assert.equal(this.fixture.firstChild.textContent, 'this');
  });

  it('can swap out style text', function() {
    diff.innerHTML(this.fixture, '<style>h1 { color: red; }</style>');
    diff.innerHTML(this.fixture, '<style>h1 { color: blue; }</style>');

    assert.equal(this.fixture.querySelector('style').textContent, 'h1 { color: blue; }');
  });

  it('can render multiple top level elements from a single element', function() {
    diff.innerHTML(this.fixture, html`
      <div></div>
    `);

    assert.equal(this.fixture.outerHTML, `<div>
      <div></div>
    </div>`);

    diff.innerHTML(this.fixture, html`
      <h1></h1>

      <h3></h3>

      <input />
    `);

    assert.equal(this.fixture.outerHTML, `<div>
      <h1></h1>

      <h3></h3>

      <input>
    </div>`);

    diff.innerHTML(this.fixture, html`<div></div>`);

    assert.equal(this.fixture.outerHTML, `<div><div></div></div>`);
  });

  describe('DOM Nodes', function() {
    it('will use the existing Node if the elements do not change', function() {
      const domNode = document.createElement('div');
      const fixtureFirstChild = this.fixture.firstChild;

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<div></div>');
      assert.equal(this.fixture.firstChild, fixtureFirstChild);
    });

    it('will replace the existing Node if the elements share a tag name, but the new one has a key', function() {
      const domNode = document.createElement('div');
      domNode.setAttribute('key', 'test');

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<div key="test"></div>');
      assert.equal(this.fixture.firstChild, domNode);
    });

    it('will render a dom node with a different tagName', function() {
      const domNode = document.createElement('p');

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<p></p>');
      assert.equal(this.fixture.firstChild, domNode);
    });

    it('will support a nested tag name DOM node value', function() {
      const domNode = document.createElement('p');

      diff.innerHTML(this.fixture, diff.html`${diff.html`${domNode}`}`);

      assert.equal(this.fixture.innerHTML, '<p></p>');
      assert.equal(this.fixture.firstChild, domNode);
    });

    it('will support updating nested elements with a top-level key', function() {
      const domNode = document.createElement('div');
      domNode.setAttribute('key', 'test');
      const nestedNode = document.createElement('video');

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<div key="test"></div>');

      domNode.appendChild(nestedNode);

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<div key="test"><video></video></div>');
      assert.equal(this.fixture.querySelector('video'), nestedNode);

      nestedNode.setAttribute('src', 'test');

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<div key="test"><video src="test"></video></div>');
      assert.equal(this.fixture.querySelector('video'), nestedNode);
    });

    it('will keep updated dom children the same', function() {
      const domNode = document.createElement('div');
      domNode.setAttribute('key', 'test');
      const nestedNode = document.createElement('video');

      domNode.appendChild(nestedNode);

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, '<div key="test"><video></video></div>');
      assert.equal(this.fixture.querySelector('video'), nestedNode);

      nestedNode.setAttribute('src', 'test');

      diff.innerHTML(this.fixture, diff.html`${domNode}`);

      assert.equal(this.fixture.innerHTML, `<div key="test"><video src="test"></video></div>`);
      assert.equal(this.fixture.querySelector('video'), nestedNode);
    });

    it('will keep updated dom children the same when using a nested tag name DOM Node value', function() {
      const domNode = document.createElement('div');
      const nestedNode = document.createElement('video');
      const originalFixtureFirstChild = this.fixture.firstChild;

      domNode.appendChild(nestedNode);

      diff.innerHTML(this.fixture, diff.html`${diff.html`${domNode}`}`);

      assert.equal(this.fixture.innerHTML, '<div><video></video></div>');
      assert.notEqual(originalFixtureFirstChild, domNode);
      assert.equal(this.fixture.firstChild, originalFixtureFirstChild);
      assert.equal(this.fixture.querySelector('video'), nestedNode);

      diff.innerHTML(this.fixture, diff.html`${diff.html`${domNode}`}`);

      assert.equal(this.fixture.innerHTML, `<div></div>`);
    });

    it('will keep updated dom children the same when using a nested tag name DOM Node value with a key', function() {
      const domNode = document.createElement('div');
      const nestedNode = document.createElement('video');

      domNode.setAttribute('key', 'keep');

      domNode.appendChild(nestedNode);

      diff.innerHTML(this.fixture, diff.html`${diff.html`${domNode}`}`);

      assert.equal(this.fixture.innerHTML, '<div key="keep"><video></video></div>');
      assert.equal(this.fixture.firstChild, domNode);
      assert.equal(this.fixture.querySelector('video'), nestedNode);

      nestedNode.setAttribute('src', 'test');

      diff.innerHTML(this.fixture, diff.html`${diff.html`${domNode}`}`);

      assert.equal(this.fixture.innerHTML, `<div key="keep"><video src="test"></video></div>`);
      assert.equal(this.fixture.querySelector('video'), nestedNode);
    });

    it('will re-render a dom node multiple times when interpolated', function() {
      const domNode = document.createElement('div');
      domNode.textContent = 'test';

      const vTree = diff.html`${domNode}`;
      diff.innerHTML(this.fixture, vTree);

      assert.equal(this.fixture.innerHTML, '<div>test</div>');

      // The text node has been removed so re-add it.
      domNode.textContent = 'test';

      diff.innerHTML(this.fixture, diff.html`<p>before</p>${domNode}`);
      assert.equal(this.fixture.innerHTML, '<p>before</p><div>test</div>');

      diff.innerHTML(this.fixture, diff.html`${domNode}<p>after</p>`);
      assert.equal(this.fixture.innerHTML, '<div>test</div><p>after</p>');
    });

    it('will re-render a wrapped dom node multiple times when interpolated', function() {
      const domNode = document.createElement('div');
      domNode.textContent = 'test';

      diff.innerHTML(this.fixture, diff.html`<div>${domNode}</div>`);
      assert.equal(this.fixture.innerHTML, '<div><div>test</div></div>');

      diff.innerHTML(this.fixture, diff.html`<div><p>before</p><div>${domNode}</div></div>`);
      assert.equal(this.fixture.innerHTML, '<div><p>before</p><div><div>test</div></div></div>');

      diff.innerHTML(this.fixture, diff.html`<div>${domNode}<p>after</p></div>`);
      assert.equal(this.fixture.innerHTML, '<div><div>test</div><p>after</p></div>');
    });
  });

  describe('Comments', function() {
    it('ignores comments', function() {
      diff.innerHTML(this.fixture, '<div><p><!-- test --></p></div>');

      assert.equal(this.fixture.firstChild.innerHTML, '<p></p>');
    });
  });

  describe('Text', function() {
    it('can decode HTML entities', function() {
      diff.innerHTML(this.fixture, '<div>&lt;</div>');
      assert.equal(this.fixture.firstChild.textContent, '<');
    });

    it('can be override existing content', function() {
      diff.innerHTML(this.fixture, 'test');

      assert.equal(this.fixture.firstChild.textContent, 'test');
    });

    it('can be updated by directly setting', function() {
      diff.innerHTML(this.fixture, '<div>test</div>');

      assert.equal(this.fixture.firstChild.textContent, 'test');

      diff.innerHTML(this.fixture, '<div>this</div>');

      assert.equal(this.fixture.firstChild.textContent, 'this');
    });

    it('can replace over markup', function() {
      diff.innerHTML(this.fixture, '<div><div>test div</div></div>');
      diff.innerHTML(this.fixture, '<div>this</div>');

      assert.equal(this.fixture.firstChild.innerHTML, 'this');
    });

    it('will not replace a previous span', function() {
      diff.innerHTML(this.fixture, '<div><span class="test"></span></div>');
      var span = this.fixture.querySelector('.test');
      diff.innerHTML(this.fixture, '<div><span>whatever</span></div>');

      assert.equal(this.fixture.firstChild.innerHTML, '<span>whatever</span>');
      assert.equal(this.fixture.firstChild.firstChild, span, 'are the same element');
    });

    it('supports HTML5 entities', function() {
      diff.innerHTML(this.fixture, '<div>&gla;</div>');

      assert.equal(this.fixture.firstChild.textContent, '⪥');
    });
  });

  describe('Attributes', function() {
    it('can change attributes', function() {
      diff.innerHTML(this.fixture, '<div class="hello"></div>');

      assert.equal(this.fixture.firstChild.className, 'hello');
    });

    it('can change attributes more than once', function() {
      diff.innerHTML(this.fixture, '<div class="hello"></div>');
      diff.innerHTML(this.fixture, '<div class="hello to you"></div>');

      assert.equal(this.fixture.firstChild.className, 'hello to you');
    });

    it('supports inline styles', function() {
      diff.innerHTML(this.fixture,
        '<div><p style="font-size: 11px"></p></div>');

      assert.equal(this.fixture.firstChild.firstChild.style.fontSize, '11px');
    });

    it('can toggle boolean attributes like checked', function() {
      diff.innerHTML(this.fixture, '<input checked>');
      assert.equal(this.fixture.firstChild.checked, true);
      diff.innerHTML(this.fixture, '<input>');
      assert.equal(this.fixture.firstChild.checked, false);
    });

    describe('Data', function() {
      it('has basic support', function() {
        diff.innerHTML(this.fixture, '<div><p data-test="test2"></p></div>');

        assert.equal(this.fixture.firstChild.innerHTML, '<p data-test="test2"></p>');
      });

      it('can handle dash separated properties', function() {
        diff.innerHTML(this.fixture,
          '<div><p data-test-two="test2"></p></div>');

        assert.equal(this.fixture.firstChild.innerHTML, '<p data-test-two="test2"></p>');
      });
    });
  });

  describe('Fragments', () => {
    it('can remove appended dom nodes', () => {
      const fragment = document.createDocumentFragment();

      diff.innerHTML(fragment, '<div></div><p></p>');
      fragment.appendChild(document.createElement('span'));

      diff.use(t => () => console.log(t.patches));
      diff.innerHTML(fragment, '<div></div><p></p>');

      assert.equal(fragment.childNodes[2], undefined);
      diff.release(fragment);
    });
  });
});
