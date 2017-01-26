import html from '../../lib/html';
import { createTree } from '../../lib/tree';
import { cleanMemory } from '../../lib/util/memory';
import validateMemory from '../util/validateMemory';

describe('Unit: HTML (Tagged template)', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  it('can interpolate a single string value in an attribute', function() {
    const foo = 'foo';

    const multipleValues = html`<span class="${foo}" />`;

    assert.equal(multipleValues.attributes.class, 'foo');
  });

  it('can interpolate multiple string values in an attribute', function() {
    const foo = 'foo';
    const bar = 'bar';

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    assert.equal(multipleValues.attributes.class, 'foo bar');
  });

  it('can interpolate multiple type values in an attribute', function() {
    const foo = 'foo';
    const bar = {};

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    assert.equal(multipleValues.attributes.class, 'foo [object Object]');
  });

  it('can space attributes on new lines', function() {
    const multipleValues = html`
      <span class="
        ${'foo'}
        ${'bar'}
      " />
    `;

    assert.equal(multipleValues.attributes.class.trim(), 'foo\n        bar');
  });

  it('can interpolate a string child', function() {
    const span = html`<span>${'foo'}</span>`;

    assert.deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: 'foo',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('can interpolate a VTree child', function() {
    const span = html`<span>${createTree('#text', 'foo')}</span>`;

    assert.deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: 'foo',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('can interpolate a DOM Node', function() {
    const span = html`<span>${document.createTextNode('foo')}</span>`;

    assert.deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: 'foo',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('can interpolate an array of children', function() {
    const fixture = [createTree('#text', 'foo'), createTree('#text', 'bar')];
    const span = html`<span>${fixture}</span>`;

    assert.deepEqual(span, {
      rawNodeName: 'span',
      nodeName: 'span',
      nodeType: 1,
      nodeValue: '',
      key: '',
      attributes: {},
      childNodes: [{
        rawNodeName: '#text',
        nodeName: '#text',
        nodeType: 3,
        nodeValue: 'foo',
        key: '',
        attributes: {},
        childNodes: [],
      }, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeType: 3,
        nodeValue: 'bar',
        key: '',
        attributes: {},
        childNodes: [],
      }],
    });
  });
});
