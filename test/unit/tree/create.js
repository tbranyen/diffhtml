import { createTree } from '../../../lib/tree';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';

describe.only('createTree', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  it('can create an empty div', () => {
    const vTree = createTree('div');

    assert.deepEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: null,
      childNodes: null,
    });
  });

  it('can create a div with some text', () => {
    const vTree = createTree('div', null, 'Hello world');

    assert.deepEqual(vTree, {
      rawNodeName: 'div',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: null,
      childNodes: [{
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'Hello world',
        nodeType: 3,
        key: '',
        attributes: null,
        childNodes: null,
      }],
    });
  });

  it('can create a fragment with some nodes using an array', () => {
    const vTree = createTree([
      createTree('div'),
      createTree('h1', 'Hello world!'),
    ]);

    assert.deepEqual(vTree, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      nodeValue: '',
      nodeType: 11,
      key: '',
      attributes: null,
      childNodes: [{
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: null,
        childNodes: null,
      }, {
        rawNodeName: 'h1',
        nodeName: 'h1',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: null,
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: 'Hello world!',
          nodeType: 3,
          key: '',
          attributes: null,
          childNodes: null,
        }],
      }],
    });
  });

  it('can create a fragment with some nodes using nested arrays', () => {
    const vTree = createTree([
      createTree('div'),
      createTree([
        createTree('h1'),
        createTree('b'),
      ]),
    ]);

    assert.deepEqual(vTree, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      nodeValue: '',
      nodeType: 11,
      key: '',
      attributes: null,
      childNodes: [{
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: null,
        childNodes: null,
      }, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        attributes: null,
        childNodes: [{
          rawNodeName: 'h1',
          nodeName: 'h1',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: null,
          childNodes: null,
        }, {
          rawNodeName: 'b',
          nodeName: 'b',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: null,
          childNodes: null,
        }],
      }],
    });
  });

  it('can mirror an empty div dom node', () => {
    const div = document.createElement('div');
    const vTree = createTree(div);

    assert.deepEqual(vTree, {
      rawNodeName: 'DIV',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: null,
      childNodes: null,
    });
  });

  it('can mirror an div dom node with attributes', () => {
    const div = document.createElement('div');
    div.setAttribute('class', 'test');

    const vTree = createTree(div);

    assert.deepEqual(vTree, {
      rawNodeName: 'DIV',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: { class: 'test' },
      childNodes: null,
    });
  });

  it('can mirror an div dom node with property-backed attributes', () => {
    const div = document.createElement('div');
    div.setAttribute('onclick', '');
    div.onclick = () => {};

    const vTree = createTree(div);

    assert.deepEqual(vTree, {
      rawNodeName: 'DIV',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: { onclick: div.onclick },
      childNodes: null,
    });
  });

  it('will find browser-generated event handlers', () => {
    const div = document.createElement('div');
    div.setAttribute('onclick', '');

    const vTree = createTree(div);

    assert.deepEqual(vTree, {
      rawNodeName: 'DIV',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: { onclick: div.onclick },
      childNodes: null,
    });
  });

  it('will not use properties unless they exist on the node', () => {
    const div = document.createElement('div');
    div.setAttribute('undefined', '');

    const vTree = createTree(div);

    assert.deepEqual(vTree, {
      rawNodeName: 'DIV',
      nodeName: 'div',
      nodeValue: '',
      nodeType: 1,
      key: '',
      attributes: { 'undefined': '' },
      childNodes: null,
    });
  });
});
