import assert from 'assert';
import * as Sinon from 'sinon';
import * as diff from '../../lib/index';
import validateMemory from '../util/validate-memory';

// To appease nodejs
const { spy, SinonSpy } = Sinon.default;

describe('Integration: Basics', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(undefined);
    diff.release(this.fixture);

    validateMemory();
  });

  describe('Expose API', function() {
    it('will expose the diffhtml global', function() {
      assert.equal(typeof diff, 'object');
    });

    it('will use the last core version loaded', async function() {
      delete global[Symbol.for('diffHTML')];
      const testBinding = { VERSION: 'test' };
      global[Symbol.for('diffHTML')] = testBinding;
      const { default: api } = await import('../../lib/index?' + Date.now());

      assert.strictEqual(global[Symbol.for('diffHTML')], api);
    });

    it('will use the last lite version loaded', async function() {
      delete global[Symbol.for('diffHTML')];
      const testBinding = { VERSION: 'test' };
      global[Symbol.for('diffHTML')] = testBinding;
      const { default: api } = await import('../../lib/lite?' + Date.now());

      assert.strictEqual(global[Symbol.for('diffHTML')], api);
    });

    it('will support disabling MutationObserver', async function() {
      const oldMutationObserver = global.window.MutationObserver;
      global.window.MutationObserver = spy(oldMutationObserver);
      const { innerHTML } = await import('../../lib/index?' + Date.now());

      innerHTML(this.fixture, 'Hello world', { disableMutationObserver: true });

      assert.strictEqual(/** @type {SinonSpy} */(global.window.MutationObserver).called, false);
      global.window.MutationObserver = oldMutationObserver;
    });
  });

  describe('Call API', function() {
    it('will error if element is missing', function() {
      assert.throws(function() {
        /** @type {any} */ (diff).innerHTML();
      });

      assert.throws(function() {
        /** @type {any} */ (diff).outerHTML();
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

  describe('Properties and Attributes Handling', () => {
    it('can "spread" inline objects into empty trees', function() {
      const vTree = diff.html`
        <div ${{ a: 1, b: false }} />
      `;

      assert.equal(vTree.childNodes[1].attributes.a, 1);
      assert.equal(vTree.childNodes[1].attributes.b, false);
    });

    it('can "spread" inline objects into attributes', function() {
      const vTree = diff.html`
        <div
          class="test"
          ${{ a: 1, b: false }}
          id="example"
        />
      `;

      assert.equal(vTree.childNodes[1].attributes.class, 'test');
      assert.equal(vTree.childNodes[1].attributes.a, 1);
      assert.equal(vTree.childNodes[1].attributes.b, false);
      assert.equal(vTree.childNodes[1].attributes.id, 'example');
    });

    it('can use a dynamic tag name', function() {
      const tagName = 'div';
      const vTree = diff.html`
        <${tagName}
          class="test"
        >
          <span></span>
        </${tagName}>
      `;

      assert.equal(vTree.childNodes[1].nodeName, 'div');
      assert.equal(vTree.childNodes[1].attributes.class, 'test');
      assert.equal(vTree.childNodes[1].childNodes[1].nodeName, 'span');
    });

    it('can "spread" objects into attributes', function() {
      const obj = { a: 1, b: false };
      const vTree = diff.html`
        <div
          class="test"
          ${obj}
          id="example"
        />
      `;

      assert.equal(vTree.childNodes[1].attributes.class, 'test');
      assert.equal(vTree.childNodes[1].attributes.a, 1);
      assert.equal(vTree.childNodes[1].attributes.b, false);
      assert.equal(vTree.childNodes[1].attributes.id, 'example');
    });

    it('will silently ignore arrays that are attempted to be spread in production', function() {
      process.env.NODE_ENV = 'production';

      const obj = [1, false];
      const vTree = diff.html`
        <div
          class="test"
          ${obj}
          id="example"
        />
      `;

      process.env.NODE_ENV = 'development';

      assert.deepEqual(vTree.childNodes[1].attributes, {
        class: 'test',
        id: 'example',
      });
    });

    it('will error if arrays are attempted to be spread in strict mode', function() {
      const obj = [1, false];

      assert.throws(() => diff.html.strict`
        <div
          class="test"
          ${obj}
          id="example"
        />
      `, /Arrays cannot be spread as attributes/);

      diff.Internals.memory.gc();
    });

    it('will support safely removing properties with delete disabled', function() {
      const element = new Proxy(document.createElement('div'), {
        deleteProperty() {
          throw new Error('Should not cause uncaught failure');
        }
      });

      assert.doesNotThrow(() => {
        diff.outerHTML(element, diff.html`<div of="true" />`);
        diff.outerHTML(element, diff.html`<div />`);
        diff.release(element);
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

      assert.equal(fragment.childNodes[1].nodeName.toLowerCase(), 'p');
      assert.equal(fragment.childNodes[1].childNodes[0].nodeValue, 'Supports DocumentFragments');

      diff.release(fragment);
    });

    // Temporarily removed this function, saving this test until a suitable
    // replacement is created. This test will be migrated then.
    it('can diff a fragment into an element', function() {
      var fragment = document.createDocumentFragment();

      diff.innerHTML(fragment, `
        <h1>It works</h1>
      `);

      diff.innerHTML(this.fixture, fragment);

      assert.equal(this.fixture.childNodes[1].nodeName.toLowerCase(), 'h1');
      assert.equal(this.fixture.childNodes[1].childNodes[0].nodeValue, 'It works');

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
