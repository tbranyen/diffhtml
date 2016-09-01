'use strict';

const fixtures = require('./.__fixtures__');
const assert = require('assert');
const diff = require('diffhtml');

describe('diffHTML Tagged Template Babel Plugin', function() {
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

    it.skip('warns on invalid markup', () => {
      const actual = fixtures.warnsOnInvalidMarkup();
      console.log(actual);
    });
  });

  describe('Quasis', () => {
    it('can render a simple quasi text', () => {
      diff.outerHTML(this.fixture, fixtures.renderSimpleQuasi());
      assert.equal(this.fixture.innerText, 'Hello world');
    });

    it('can render a nested quasi literal', () => {
      diff.outerHTML(this.fixture, fixtures.renderNestedQuasi());
      assert.equal(this.fixture.innerText, 'Hello world');
    });

    it('can render a nested quasi literal w/ concat text', () => {
      let patches = fixtures.renderNestedQuasiConcat();
      diff.innerHTML(this.fixture, patches);
      assert.equal(this.fixture.innerText, 'Text Node Hello world');
    });
  });

  describe('Expressions', () => {
    it('can render a string expression', () => {
      diff.innerHTML(this.fixture, fixtures.renderStringExpression());
      assert.equal(this.fixture.innerText, 'Hello world');
    });

    it('can render an interpolated string expression', () => {
      const vTree = fixtures.renderInterpolatedStringExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerText, 'Hello world!');
    });

    it('can render an interpolated mixed expression', () => {
      const vTree = fixtures.renderInterpolatedMixedExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerText, 'Hello world!');
    });

    it('can render a nested interpolated mixed expression', () => {
      const vTree = fixtures.renderNestedInterpolatedMixedExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerText, 'Hello world!');
    });

    it('can render a nested template interpolated mixed expression', () => {
      const vTree = fixtures.renderNestedTemplateInterpolatedMixedExpression();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.innerText, 'Hello world!');
    });

    it('can render a trailing interpolated mixed expression', () => {
      const vTree = fixtures.renderTrailingExpression();
      diff.outerHTML(this.fixture, vTree);
      assert.equal(this.fixture.childNodes.length, 2);
      assert.equal(this.fixture.innerText, 'Hello world');
    });

    it('can render a real world use case', () => {
      const vTree = fixtures.renderRealWorld();
      diff.innerHTML(this.fixture, vTree);
    });
  });

  describe('Bug Fixes', () => {
    it('will not concat neighbor nodes', () => {
      const vTree = fixtures.interpolatedValuesAreConcat();
      diff.innerHTML(this.fixture, vTree);
      assert.equal(this.fixture.textContent, '\n      Text node second\n    ');
    });
  });
});
