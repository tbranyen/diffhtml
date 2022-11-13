import test, { describe, it, beforeEach } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { Internals, html } from 'diffhtml';
import { parse } from '../dist/parser.js';

describe('Basic', () => {
  beforeEach(() => {
    Internals.parse = parse;
  });

  it('will integrate with diffhtml', () => {
    const vTree = html`<div />`;

    deepStrictEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      key: '',
      nodeType: 1,
      nodeValue: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('will support dynamic tagName', () => {
    const obj = {};
    const vTree = html`<${obj} />`;

    deepStrictEqual(vTree, {
      rawNodeName: obj,
      nodeName: '#document-fragment',
      key: '',
      nodeType: 11,
      nodeValue: '',
      attributes: {},
      childNodes: [],
    });
  });
  
  it('will support dynamic attribute key', () => {
    const id = 'id';
    const vTree = html`<div ${id}="value" />`;

    deepStrictEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      key: '',
      nodeType: 1,
      nodeValue: '',
      attributes: { id: 'value' },
      childNodes: [],
    });
  });

  it('will support dynamic attribute value', () => {
    const id = {};
    const vTree = html`<div id=${id} />`;

    deepStrictEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      key: '',
      nodeType: 1,
      nodeValue: '',
      attributes: { id },
      childNodes: [],
    });
  });

  it('will support dynamic child nodes', () => {
    const vTree = html`<div>${html`<span />`}</div>`;

    deepStrictEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      key: '',
      nodeType: 1,
      nodeValue: '',
      attributes: {},
      childNodes: [{
        rawNodeName: 'span',
        nodeName: 'span',
        key: '',
        nodeType: 1,
        nodeValue: '',
        attributes: {},
        childNodes: [],
      }],
    });
  });

  it('will support dynamic child nodes as a fragment', () => {
    const vTree = html`<div>${html`<span /> <p></p>`}</div>`;

    deepStrictEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      key: '',
      nodeType: 1,
      nodeValue: '',
      attributes: {},
      childNodes: [{
        rawNodeName: 'span',
        nodeName: 'span',
        key: '',
        nodeType: 1,
        nodeValue: '',
        attributes: {},
        childNodes: [],
      }, {
        rawNodeName: '#text',
        nodeName: '#text',
        key: '',
        nodeType: 3,
        nodeValue: ' ',
        childNodes: [],
        attributes: {},
      }, {
        rawNodeName: 'p',
        nodeName: 'p',
        key: '',
        nodeType: 1,
        nodeValue: '',
        attributes: {},
        childNodes: [],
      }],
    });
  });

});
