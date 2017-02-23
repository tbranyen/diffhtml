import { equal, deepEqual } from 'assert';
import html from '../lib/html';
import { createTree } from '../lib/tree';
import validateMemory from './util/validateMemory';

describe('HTML (Tagged template)', function() {
  afterEach(() => validateMemory());

  it('will return null when passed a falsy value', () => {
    equal(html(), null);
    equal(html(null), null);
    equal(html(undefined), null);
    equal(html(0), null);
    equal(html(NaN), null);
    equal(html(false), null);
  });

  it('will support running as a standalone function', () => {
    equal(html('<div/>').nodeName, 'div');
  });

  it('will interpolate a single string value in an attribute', function() {
    const foo = 'foo';
    const span = html`<span class="${foo}" />`;

    equal(span.attributes.class, 'foo');
  });

  it('will interpolate multiple string values in an attribute', function() {
    const foo = 'foo';
    const bar = 'bar';

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    equal(multipleValues.attributes.class, 'foo bar');
  });

  it('will interpolate value-less attributes', function() {
    const checked = 'checked';
    const input = html`<input type="checkbox" ${checked}>`;

    equal(input.attributes.checked, 'checked');
  });

  it('will interpolate multiple type values in an attribute', function() {
    const foo = 'foo';
    const bar = {};

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    equal(multipleValues.attributes.class, 'foo [object Object]');
  });

  it('will interpolate attribute values with text', () => {
    const icon = 'some-icon';
    const vTree = html`<i class="${icon} icon" />`

    deepEqual(vTree, {
      rawNodeName: 'i',
      nodeName: 'i',
      nodeValue: '',
      nodeType: 1,
      key: '',
      childNodes: [],
      attributes: {
        class: 'some-icon icon'
      },
    });
  });

  it('will flatten nested fragments', () => {
    const array = [1];
    const vTree = html`
      <div>
        ${array.map(i => html`
          <p>Some label</p>
          <span>${i}</span>
        `)}
      </div>
    `;

    deepEqual(vTree, {
      rawNodeName: 'div',
      nodeName: "div",
      nodeValue: "",
      nodeType: 1,
      key: "",
      childNodes: [{
        rawNodeName: "#text",
        nodeName: "#text",
        nodeValue: "\n        ",
        nodeType: 3,
        key: "",
        childNodes: [],
        attributes: {},
      }, {
        rawNodeName: "p",
        nodeName: "p",
        nodeValue: "",
        nodeType: 1,
        key: "",
        childNodes: [{
          rawNodeName: "#text",
          nodeName: "#text",
          nodeValue: "Some label",
          nodeType: 3,
          key: "",
          childNodes: [],
          attributes: {},
        }],
        attributes: {},
      }, {
        rawNodeName: "#text",
        nodeName: "#text",
        nodeValue: "\n          ",
        nodeType: 3,
        key: "",
        childNodes: [],
        attributes: {},
      }, {
        rawNodeName: "span",
        nodeName: "span",
        nodeValue: "",
        nodeType: 1,
        key: "",
        childNodes: [{
          rawNodeName: "#text",
          nodeName: "#text",
          nodeValue: "1",
          nodeType: 3,
          key: "",
          childNodes: [],
          attributes: {},
        }],
        attributes: {},
      }, {
        rawNodeName: "#text",
        nodeName: "#text",
        nodeValue: "\n      ",
        nodeType: 3,
        key: "",
        childNodes: [],
        attributes: {},
      }],
      attributes: {},
    });
  });

  it('will return a fragment with multiple top level elements w/o values', () => {
    const vTree = html`<span class="has-class" /><span />`;

    deepEqual(vTree, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      nodeValue: '',
      nodeType: 11,
      key: '',
      childNodes: [{
        rawNodeName: 'span',
        nodeName: 'span',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {
          class: 'has-class',
        },
      }, {
        rawNodeName: 'span',
        nodeName: 'span',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      }],
      attributes: {},
    });
  });

  it('will return a fragment with multiple top level elements w/ values', () => {
    const className = 'has-class';
    const vTree = html`<span class="${className}" /><span />`;

    deepEqual(vTree, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      nodeValue: '',
      nodeType: 11,
      key: '',
      childNodes: [{
        rawNodeName: 'span',
        nodeName: 'span',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {
          class: 'has-class',
        },
      }, {
        rawNodeName: 'span',
        nodeName: 'span',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      }],
      attributes: {},
    });
  });

  it('will support aligning attributes on new lines', function() {
    const multipleValues = html`
      <span class="
        ${'foo'}
        ${'bar'}
      " />
    `;

    equal(multipleValues.attributes.class.trim(), 'foo\n        bar');
  });

  it('will support empty string attributes', () => {
    const span = html`<span href="" />`;

    deepEqual(span, {
      rawNodeName: 'span',
      nodeName: 'span',
      nodeType: 1,
      nodeValue: '',
      key: '',
      attributes: { href: '' },
      childNodes: [],
    });
  });

  it('will interpolate a string child', function() {
    const span = html`<span>${'foo'}</span>`;

    deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: 'foo',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('will interpolate a string child with html entities', function() {
    const span = html`<span>${'&infin;'}</span>`;

    deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: '∞',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('will interpolate a VTree child', function() {
    const span = html`<span>${createTree('#text', 'foo')}</span>`;

    deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: 'foo',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('will interpolate a DOM Node', function() {
    const span = html`<span>${document.createTextNode('foo')}</span>`;

    deepEqual(span.childNodes[0], {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeType: 3,
      nodeValue: 'foo',
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('will interpolate an array of children', function() {
    const fixture = [createTree('#text', 'foo'), createTree('#text', 'bar')];
    const span = html`<span>${fixture}</span>`;

    deepEqual(span, {
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

  it('will not mess up interpolation if HTML comments are used', () => {
    const fixtures = ['test', 'this'];
    const span = html`
      <!--
      <span>${fixtures[0]}</span>
      -->
      <span>${fixtures[1]}</span>
    `;

    deepEqual(span, {
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
        nodeValue: 'this',
        key: '',
        attributes: {},
        childNodes: [],
      }],
    });
  });

  it('will support a custom tag name', () => {
    const Ctor = function() {};
    const vTree = html`<${Ctor} attr="value" />`;

    deepEqual(vTree, {
      rawNodeName: Ctor,
      nodeName: '#document-fragment',
      nodeType: 11,
      nodeValue: '',
      key: '',
      attributes: { attr: 'value' },
      childNodes: [],
    });
  });
});
