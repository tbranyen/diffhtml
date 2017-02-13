import createTree from '../../../lib/tree/create';
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
      attributes: {},
      childNodes: [],
    });
  });

  it('can create an empty text node', () => {
    const vTree = createTree('#text');

    assert.deepEqual(vTree, {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeValue: '',
      nodeType: 3,
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('can create a text node with some text', () => {
    const vTree = createTree('#text', 'some text');

    assert.deepEqual(vTree, {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeValue: 'some text',
      nodeType: 3,
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('can create a text node with an array of text', () => {
    const vTree = createTree('#text', ['some text', ' ', 'chunks']);

    assert.deepEqual(vTree, {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeValue: 'some text chunks',
      nodeType: 3,
      key: '',
      attributes: {},
      childNodes: [],
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
      attributes: {},
      childNodes: [{
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'Hello world',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
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
      attributes: {},
      childNodes: [{
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [],
      }, {
        rawNodeName: 'h1',
        nodeName: 'h1',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: 'Hello world!',
          nodeType: 3,
          key: '',
          attributes: {},
          childNodes: [],
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
      attributes: {},
      childNodes: [{
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [],
      }, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: 'h1',
          nodeName: 'h1',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: {},
          childNodes: [],
        }, {
          rawNodeName: 'b',
          nodeName: 'b',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: {},
          childNodes: [],
        }],
      }],
    });
  });

  it('will mirror a key attribute to the VTree', () => {
    const vTree = createTree('div', { key: '12345' });
    assert.equal(vTree.key, vTree.attributes.key);
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
      attributes: {},
      childNodes: [],
    });
  });

  it('can mirror a text node', () => {
    const text = document.createTextNode('some text');
    const vTree = createTree(text);

    assert.deepEqual(vTree, {
      rawNodeName: '#text',
      nodeName: '#text',
      nodeValue: 'some text',
      nodeType: 3,
      key: '',
      attributes: {},
      childNodes: [],
    });
  });

  it('can mirror a document fragment', () => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createElement('div'));

    const vTree = createTree(fragment);

    assert.deepEqual(vTree, {
      rawNodeName: '#document-fragment',
      nodeName: '#document-fragment',
      nodeValue: '',
      nodeType: 11,
      key: '',
      attributes: {},
      childNodes: [{
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [],
      }],
    });
  });

  it('can represent a comment node', () => {
    const comment = document.createComment('test');
    const vTree = createTree(comment);

    assert.deepEqual(vTree, {
      rawNodeName: '#comment',
      nodeName: '#comment',
      nodeValue: '',
      nodeType: 8,
      key: '',
      attributes: {},
      childNodes: [],
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
      childNodes: [],
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
      childNodes: [],
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
      childNodes: [],
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
      childNodes: [],
    });
  });

  it('can nest child elements', () => {
    const fixture = document.createElement('div');
    fixture.appendChild(document.createElement('p'));

    const vTree = createTree(fixture);

    assert.equal(vTree.childNodes.length, 1);
    assert.equal(vTree.childNodes[0].nodeName, 'p');
  });
});
