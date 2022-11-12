'use strict';

import assert from 'assert';
import diff from 'diffhtml';
import * as normalParser from './.__fixtures_normal__';
import * as wasmParser from './.__fixtures_wasm__';

function runTests(fixtures) {
  beforeEach(() => {
    this.fixture = document.createElement('div');
  });

  afterEach(() => {
    diff.release(this.fixture);
  });

  describe('Basics', () => {
    it('won\'t compile template literals', () => {
      const actual = fixtures.renderTemplateLiteral();
      assert.equal(actual.trim(), '<div></div>');
    });

    it('will not warn on invalid markup', () => {
      assert.doesNotThrow(() => {
        fixtures.warnsOnInvalidMarkup();
      });
    });

    it('will render a single element', () => {
      const actual = fixtures.willRenderSingleElement();
      assert.deepEqual(actual, diff.createTree('div'));
    });
  });

  describe('Quasis', () => {
    it('can render a simple quasi text', () => {
      diff.outerHTML(this.fixture, fixtures.renderSimpleQuasi());
      assert.equal(this.fixture.innerHTML.trim(), 'Hello world');
    });

    it('can render a nested quasi literal', () => {
      diff.outerHTML(this.fixture, fixtures.renderNestedQuasi());
      assert.equal(this.fixture.innerHTML.trim(), 'Hello world');
    });

    it('can render a nested quasi literal w/ concat text', () => {
      let patches = fixtures.renderNestedQuasiConcat();
      diff.innerHTML(this.fixture, patches);
      assert.equal(this.fixture.innerHTML.trim(), 'Text Node <div>Hello world</div>');
    });
  });

  describe('Expressions', () => {
    it('can render a string expression', () => {
      diff.innerHTML(this.fixture, fixtures.renderStringExpression());
      assert.equal(this.fixture.innerHTML.trim(), 'Hello world');
    });

    it('can render an interpolated string expression', () => {
      const vTree = fixtures.renderInterpolatedStringExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerHTML.trim(), 'Hello world!');
    });

    it('can render an interpolated mixed expression', () => {
      const vTree = fixtures.renderInterpolatedMixedExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerHTML.trim(), 'Hello world!');
    });

    it('can render a nested interpolated mixed expression', () => {
      const vTree = fixtures.renderNestedInterpolatedMixedExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerHTML.trim(), `<div><div>Hello world!</div></div>`);
    });

    it('can render a nested template interpolated mixed expression', () => {
      const vTree = fixtures.renderNestedTemplateInterpolatedMixedExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerHTML, '<div>\n    \n      <div>Hello world!</div>\n    \n  </div>');
    });

    it('can render a trailing interpolated mixed expression', () => {
      const vTree = fixtures.renderTrailingExpression();
      diff.outerHTML(this.fixture, vTree);

      assert.equal(this.fixture.innerHTML.trim(), '<div></div> Hello world');
    });

    it('can render a real world use case', () => {
      const vTree = fixtures.renderRealWorld();
      diff.innerHTML(this.fixture, vTree);
    });
  });

  describe('Attributes', () => {
    it('will set both a key and value dynamically', () => {
      const vTree = fixtures.dynamicKeyAndValue('id', 'test');

      assert.equal(vTree.childNodes.length, 3);
      assert.equal(vTree.childNodes[0].nodeType, 3);
      assert.equal(vTree.childNodes[1].attributes.id, 'test');
      assert.equal(vTree.childNodes[2].nodeType, 3);
    });

    it('will set a single attribute value', () => {
      const vTree = fixtures.setSingleValue('test');

      assert.equal(vTree.childNodes.length, 3);
      assert.equal(vTree.childNodes[0].nodeType, 3);
      assert.equal(vTree.childNodes[1].attributes.class, 'test');
      assert.equal(vTree.childNodes[2].nodeType, 3);
    });

    it('will set an interpolated value after static', () => {
      const vTree = fixtures.setInterpolatedValueAfter('test2');

      assert.equal(vTree.childNodes.length, 3);
      assert.equal(vTree.childNodes[0].nodeType, 3);
      assert.equal(vTree.childNodes[1].attributes.class, 'test test2');
      assert.equal(vTree.childNodes[2].nodeType, 3);
    });

    it('will set an interpolated value before static', () => {
      const vTree = fixtures.setInterpolatedValueBefore('test2');

      assert.equal(vTree.childNodes.length, 3);
      assert.equal(vTree.childNodes[0].nodeType, 3);
      assert.equal(vTree.childNodes[1].attributes.class, 'test2 test');
      assert.equal(vTree.childNodes[2].nodeType, 3);
    });

  //exports.setInterpolatedValueAfter = value => html`
  //  <div class="test ${value}" />
  //`;

  //exports.setInterpolatedValueBefore = value => html`
  //  <div class="${value} test" />
  //`;
  });

  describe('Bug Fixes', () => {
    it('will not concat neighbor nodes', () => {
      const vTree = fixtures.interpolatedValuesAreConcat();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.textContent.trim(), 'Text node second');
    });
  });

  describe('Fragments', () => {
    it('will create a fragment of elements', () => {
      const vTree = fixtures.willCreateFragments();

      assert.equal(vTree.nodeType, 11);
      assert.deepEqual(vTree.childNodes, [
        diff.createTree('div'),
        diff.createTree('span'),
      ]);
    });
  });
}

describe('diffHTML Tagged Template Babel Plugin', function() {
  return runTests.call(this, normalParser);
});
describe('diffHTML Tagged Template Babel Plugin (Using WASM)', function() {
  return runTests.call(this, wasmParser);
});
