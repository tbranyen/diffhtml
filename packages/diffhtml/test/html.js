// @ts-nocheck
import { equal, deepEqual, doesNotThrow, throws } from 'assert';
import html from '../lib/html';
import Internals from '../lib/util/internals';
import parse from '../lib/util/parse';
import createTree from '../lib/tree/create';
import { NodeCache } from '../lib/util/types';
import validateMemory from './util/validate-memory';

describe('HTML (Tagged template)', () => {
  beforeEach(() => {
    Internals.parse = parse;
  });

  afterEach(() => validateMemory());

  it('will return an empty text node when passed a falsy value', () => {
    /** @type {any} */
    const invalidHtml = html;
    const empty = createTree('#text', '');

    deepEqual(invalidHtml``, empty);
    deepEqual(invalidHtml(), empty);
    deepEqual(invalidHtml(null), empty);
    deepEqual(invalidHtml(undefined), empty);
    deepEqual(invalidHtml(0), empty);
    deepEqual(invalidHtml(NaN), empty);
    deepEqual(invalidHtml(false), empty);
  });

  it('will support running as a standalone function', () => {
    const vTree = html('<div/>');
    equal(vTree.nodeName, 'div');
  });

  it('will interpolate a single string value in an attribute', () => {
    const foo = 'foo';
    const span = html`<span class="${foo}" />`;

    equal(span.attributes.class, 'foo');
  });

  it('will interpolate multiple string values in an attribute', () => {
    const foo = 'foo';
    const bar = 'bar';

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    equal(multipleValues.attributes.class, 'foo bar');
  });

  it('will support invalid characters in attributes', () => {
    const div = html`
      <div
        @ns@key="value"
        $ns$key="value"
        #ns#key="value"
      />
    `;

    equal(div.attributes['@ns@key'], 'value');
    equal(div.attributes['$ns$key'], 'value');
    equal(div.attributes['#ns#key'], 'value');
  });

  it('will support namespace attributes', () => {
    const div = html`<div ns:key="value" />`;

    equal(div.attributes['ns:key'], 'value');
  });

  it('will support dot attributes', () => {
    const div = html`<div ns.key="value" />`;

    equal(div.attributes['ns.key'], 'value');
  });

  it('will interpolate static value-less attributes', () => {
    const input = html`<input type="checkbox" checked>`;

    equal(input.attributes.checked, true);
  });

  it('will interpolate dynamic value-less attributes', () => {
    const checked = 'checked';
    const input = html`<input type="checkbox" ${checked}>`;

    equal(input.attributes.checked, true);
  });

  it('will interpolate multiple value-less attributes', () => {
    const checked = 'checked';
    const disabled = 'disabled'
    const input = html`<input type="checkbox" ${checked} ${disabled}>`;

    equal(input.attributes.checked, true);
    equal(input.attributes.disabled, true);
  });

  it('will interpolate multiple type values in an attribute', () => {
    const foo = 'foo';
    const bar = {};

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    equal(multipleValues.attributes.class, 'foo [object Object]');
  });

  it('will interpolate multiple type values in an attribute with toString', () => {
    const foo = 'foo';
    const bar = { toString() { return 'replacement'; } };

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    equal(multipleValues.attributes.class, 'foo replacement');
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
    const vTree = html`<div>
        ${array.map(i => html`<p>Some label</p>
          <span>${i}</span>`)}
      </div>`;

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

  it('will support aligning attributes on new lines', () => {
    const multipleValues = html`
      <span class="
        ${'foo'}
        ${'bar'}
      " />
    `;

    equal(multipleValues.childNodes[1].attributes.class.trim(), 'foo\n        bar');
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

  it('will interpolate a string child', () => {
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

  it('will interpolate a string child with html entities', () => {
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

  it('will interpolate a VTree child', () => {
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

  it('will associate a passed in DOM Node to the created VTree', () => {
    const domNode = document.createElement('div');
    const vTree = html`${domNode}`;

    equal(NodeCache.get(vTree), domNode);
  });

  it('will interpolate a Text Node', () => {
    const textNode = document.createTextNode('foo');
    const span = html`<span>${textNode}</span>`;
    const vTree = createTree(textNode);

    deepEqual(span.childNodes[0], vTree);
    equal(NodeCache.get(vTree), textNode);
  });

  it('will interpolate a DOM Node', () => {
    const domNode = document.createElement('div');
    const span = html`<span>${domNode}</span>`;
    const vTree = createTree(domNode);

    deepEqual(span.childNodes[0], {
      rawNodeName: 'DIV',
      nodeName: 'div',
      nodeType: 1,
      nodeValue: '',
      key: '',
      attributes: {},
      childNodes: [],
    });

    equal(NodeCache.get(vTree), domNode);
  });

  it('will interpolate an array of children', () => {
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
    const span = html`<!--<span>${fixtures[0]}</span>--><span>${fixtures[1]}</span>`;

    deepEqual(span, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      attributes: {},
      nodeValue: '',
      nodeType: 11,
      key: '',

      childNodes: [{
        rawNodeName: '#comment',
        nodeName: '#comment',
        nodeValue: '<span>test</span>',
        nodeType: 8,
        key: '',
        childNodes: [],
        attributes: {},
      }, {
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
      }]
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

  it('will support boolean attributes on a ctor', () => {
    const Ctor = function() {};
    const vTree = html`<${Ctor} attr />`;

    deepEqual(vTree, {
      rawNodeName: Ctor,
      nodeName: '#document-fragment',
      nodeType: 11,
      nodeValue: '',
      key: '',
      attributes: { attr: true },
      childNodes: [],
    });
  });

  it('will support interpolating object attributes on a ctor', () => {
    const Ctor = function() {};
    const rest = { id: 'test' };
    const vTree = html`<${Ctor} ${rest} />`;

    deepEqual(vTree, {
      rawNodeName: Ctor,
      nodeName: '#document-fragment',
      nodeType: 11,
      nodeValue: '',
      key: '',
      attributes: { id: 'test' },
      childNodes: [],
    });
  });

  it('supports mixing custom elements and custom components', () => {
    const React = () => {};
    const vTree = html`<${React} />
      <web-component />`;

    deepEqual(vTree, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      nodeValue: '',
      nodeType: 11,
      key: '',
      childNodes: [{
        rawNodeName: React,
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [],
        attributes: {},
      }, {
          "attributes": {},
          "childNodes": [],
          "key": "",
          "nodeName": "#text",
          "nodeType": 3,
          "nodeValue": "\n      ",
          "rawNodeName": "#text"
      }, {
        rawNodeName: 'web-component',
        nodeName: 'web-component',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      }],
      attributes: {},
    });
  });

  it('will allow the use of childNodes as a prop when there are no existing children', () => {
    const vTree = html`<a childNodes=${html`<span>test</span>`} />`;

    equal(vTree.childNodes.length, 1);
    equal(vTree.childNodes[0].nodeName, 'span');
  });

  it('will allow the use of childNodes as a prop to pave over existing children', () => {
    const vTree = html`<a childNodes=${html`<span>inner</span>`}>outer</a>`;

    equal(vTree.childNodes.length, 1);
    equal(vTree.childNodes[0].nodeName, 'span');
    equal(vTree.childNodes[0].childNodes.length, 1);
    equal(vTree.childNodes[0].childNodes[0].nodeName, '#text');
    equal(vTree.childNodes[0].childNodes[0].nodeValue, 'inner');
  });
});
