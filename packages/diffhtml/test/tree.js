import {
  strictEqual,
  notStrictEqual,
  deepStrictEqual,
  throws,
  doesNotThrow,
} from 'assert';
import createTree from '../lib/tree/create';
import syncTree from '../lib/tree/sync';
import { PATCH_TYPE, SyncTreeHookCache, NodeCache } from '../lib/util/types';
import parse from '../lib/util/parse';
import html from '../lib/html';
import release from '../lib/release';
import validateMemory from './util/validate-memory';

describe('Tree', function() {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => validateMemory());

  describe('create', () => {
    it('will return an empty fragment for falsy values', () => {
      /** @type {any} */
      const invalidCreateTree = createTree;
      const fragment = createTree('#document-fragment');

      deepStrictEqual(invalidCreateTree(), fragment);
      deepStrictEqual(invalidCreateTree(null), fragment);
      deepStrictEqual(invalidCreateTree(undefined), fragment);
      deepStrictEqual(invalidCreateTree(''), fragment);
      deepStrictEqual(invalidCreateTree(0), fragment);
      deepStrictEqual(invalidCreateTree(NaN), fragment);
    });

    it('will create an empty div', () => {
      const vTree = createTree('div');

      deepStrictEqual(vTree, {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will create an empty text node', () => {
      const vTree = createTree('#text');

      deepStrictEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: '',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will create a text node with some text', () => {
      const vTree = createTree('#text', 'some text');

      deepStrictEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'some text',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will create a text node with an array of text', () => {
      const vTree = createTree('#text', ['some text', ' ', 'chunks']);

      deepStrictEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'some text chunks',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will ignore falsy values when creating fragment from an array', () => {
      const vTree = createTree([createTree('div'), null, createTree('p')]);

      deepStrictEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        attributes: {},
        childNodes: [createTree('div'), createTree('p')],
      });
    });

    it('will ignore falsy values when creating text from an array', () => {
      const vTree = createTree('#text', ['some text', null, ' ', 'chunks']);

      deepStrictEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'some text chunks',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will ignore null values', () => {
      const vTree = createTree('div', [null, createTree('#text', 'test')]);

      deepStrictEqual(vTree, {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: 'test',
          nodeType: 3,
          key: '',
          attributes: {},
          childNodes: [],
        }],
      });
    });

    it('will will merge in a nested array', () => {
      const vTree = createTree('div', [[createTree('#text', 'test')]]);

      deepStrictEqual(vTree, {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: 'test',
          nodeType: 3,
          key: '',
          attributes: {},
          childNodes: [],
        }],
      });
    });

    it('will ignore falsy values when creating children from an array', () => {
      const vTree = createTree('div', null, ['text', NaN, createTree('p')]);

      deepStrictEqual(vTree, {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: 'text',
          nodeType: 3,
          key: '',
          attributes: {},
          childNodes: [],
        }, {
          rawNodeName: 'p',
          nodeName: 'p',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: {},
          childNodes: [],
        }],
      });
    });

    it('will create a div with some text', () => {
      const vTree = createTree('div', null, 'Hello world');

      deepStrictEqual(vTree, {
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

    it('will support JSX-style children', () => {
      const vTree = createTree('div', null, createTree('li'), createTree('p'));

      deepStrictEqual(vTree, {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: 'li',
          nodeName: 'li',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: {},
          childNodes: []
        }, {
          rawNodeName: 'p',
          nodeName: 'p',
          nodeValue: '',
          nodeType: 1,
          key: '',
          attributes: {},
          childNodes: []
        }],
      });
    });

    it('will create a fragment with some nodes using an array', () => {
      const vTree = createTree([
        createTree('div'),
        createTree('h1', 'Hello world!'),
      ]);

      deepStrictEqual(vTree, {
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

    it('will not include falsy nodes using an array', () => {
      const vTree = createTree([
        createTree('div'),
        createTree('h1', 'Hello world!'),
        null,
      ]);

      deepStrictEqual(vTree, {
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

    it('will create a fragment with some nodes using nested arrays', () => {
      const vTree = createTree([
        createTree('div'),
        createTree([
          createTree('h1'),
          createTree('b'),
        ]),
      ]);

      deepStrictEqual(vTree, {
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
      });
    });

    it('will mirror a key attribute to the VTree', () => {
      const vTree = createTree('div', { key: '12345' });
      strictEqual(vTree.key, vTree.attributes.key);
    });

    it('will mirror a falsy key attribute to the VTree', () => {
      const vTree = createTree('div', { key: 0 });
      strictEqual(vTree.key, String(vTree.attributes.key));
    });

    it('will use a scripts src as key attribute', () => {
      const vTree = createTree('script', { src: '12345' });
      strictEqual(vTree.key, vTree.attributes.src);
    });

    it('will prefer the key attribute to the scripts src', () => {
      const vTree = createTree('script', { key: 'test', src: '12345' });
      notStrictEqual(vTree.key, vTree.attributes.src);
      strictEqual(vTree.key, vTree.attributes.key);
    });

    it('will associate an incoming DOM Node to the NodeCache and VTree', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      strictEqual(NodeCache.get(vTree), div);
    });

    it('will associate incoming DOM Node children to the NodeCache and VTree', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);

      const vTree = createTree(div);

      strictEqual(NodeCache.get(vTree), div);
      strictEqual(NodeCache.get(vTree.childNodes[0]), span);
    });

    it('will not disassociate incoming DOM Node children to the NodeCache and VTree if not released', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);

      const spanTree = createTree(div).childNodes[0];

      div.removeChild(span);

      const vTree = createTree(div);

      strictEqual(NodeCache.get(vTree), div);
      strictEqual(NodeCache.get(spanTree), span);
    });

    it('will disassociate incoming DOM Node children to the NodeCache and VTree if released', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);

      const spanTree = createTree(div).childNodes[0];

      release(div);

      const vTree = createTree(div);

      strictEqual(NodeCache.get(vTree), div);
      strictEqual(NodeCache.get(spanTree), undefined);
    });

    it('will mirror an empty div dom node', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      deepStrictEqual(vTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will mirror a text node', () => {
      const text = document.createTextNode('some text');
      const vTree = createTree(text);

      deepStrictEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'some text',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will mirror a document fragment', () => {
      const fragment = document.createDocumentFragment();
      fragment.appendChild(document.createElement('div'));

      const vTree = createTree(fragment);

      deepStrictEqual(vTree, {
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

    it('will represent a comment node', () => {
      const comment = document.createComment('test');
      const vTree = createTree(comment);

      deepStrictEqual(vTree, {
        rawNodeName: '#comment',
        nodeName: '#comment',
        nodeValue: '',
        nodeType: 8,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will mirror an div dom node with attributes', () => {
      const div = document.createElement('div');
      div.setAttribute('class', 'test');

      const vTree = createTree(div);

      deepStrictEqual(vTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: { class: 'test' },
        childNodes: [],
      });
    });

    it('will mirror an div dom node with property-backed attributes', () => {
      const div = document.createElement('div');
      div.setAttribute('onclick', '');
      div.onclick = () => {};

      const vTree = createTree(div);

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        attributes: { 'undefined': '' },
        childNodes: [],
      });
    });

    it('will nest child elements', () => {
      const fixture = document.createElement('div');
      fixture.appendChild(document.createElement('p'));

      const vTree = createTree(fixture);

      strictEqual(vTree.childNodes.length, 1);
      strictEqual(vTree.childNodes[0].nodeName, 'p');
    });

    it('will ignore undefined in array of text elements', () => {
      const vTree = createTree([null, 'text content']);

      deepStrictEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeType: 11,
        nodeValue: '',
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeType: 3,
          nodeValue: 'text content',
          key: '',
          attributes: {},
          childNodes: [],
        }],
      });
    });

    it('will ignore undefined in array of html elements', () => {
      const vTree = createTree([
        null,
        createTree('span', 'text content'),
      ]);

      deepStrictEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeType: 11,
        nodeValue: '',
        key: '',
        attributes: {},
        childNodes: [{
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
            nodeValue: 'text content',
            key: '',
            attributes: {},
            childNodes: [],
          }],
        }],
      });
    });
  });

  describe('sync', () => {
    it('will not throw an error if top level elements are different', () => {
      const oldTree = createTree('div');
      const newTree = createTree('h1');

      doesNotThrow(() => syncTree(oldTree, newTree));
    });

    it('will not throw an error if the new tree is not the same type', () => {
      const oldTree = createTree('div');
      const newTree = createTree('span');

      doesNotThrow(() =>  syncTree(oldTree, newTree));
    });

    it('will generate an empty patchset if there are no changes', () => {
      const oldTree = createTree('div');
      const newTree = createTree('div');

      const patches = [];
      syncTree(oldTree, newTree, patches);

      deepStrictEqual(patches, []);
    });

    it('will not error if the new tree is a document fragment', () => {
      const oldTree = createTree('div');
      const newTree = createTree('#document-fragment');

      doesNotThrow(() =>  syncTree(oldTree, newTree));
    });

    it('will support DOM Node comparisons', () => {
      const domNode = document.createElement('div');
      const domTree = createTree(domNode);
      const fixture = createTree('div');
      const firstPass = createTree('div', [domTree]);

      const firstPassPatches = [];
      syncTree(fixture, firstPass, firstPassPatches);

      deepStrictEqual(firstPassPatches, [
        PATCH_TYPE.INSERT_BEFORE,
        fixture,
        domTree,
        null,
      ]);

      const p = createTree('p', 'before');
      const secondPass = createTree('div', [p, domTree]);
      const secondPassPatches = [];
      syncTree(fixture, secondPass, secondPassPatches);

      deepStrictEqual(secondPassPatches, [
        PATCH_TYPE.NODE_VALUE,
        createTree('#text', 'before'),
        'before',
        null,

        PATCH_TYPE.REPLACE_CHILD,
        p,
        domTree,

        PATCH_TYPE.INSERT_BEFORE,
        secondPass,
        domTree,
        null,
      ]);

      const newDomTree = createTree(domNode);
      const thirdPass = createTree('div', [newDomTree, p]);
      const thirdPassPatches = [];
      syncTree(secondPass, thirdPass, thirdPassPatches);

      deepStrictEqual(thirdPassPatches, [
        PATCH_TYPE.REPLACE_CHILD,
        newDomTree,
        p,

        PATCH_TYPE.NODE_VALUE,
        createTree('#text', 'before'),
        'before',
        null,

        PATCH_TYPE.INSERT_BEFORE,
        thirdPass,
        p,
        null,
      ]);
    });

    it('will diff into changed DOM Node children', () => {
      const domNode = document.createElement('div');
      const firstTree = createTree(domNode);
      const firstFixture = createTree('div');

      const firstPass = createTree('div', [firstTree]);
      const firstPassPatches = [];

      syncTree(firstFixture, firstPass, firstPassPatches);

      deepStrictEqual(firstPassPatches, [
        PATCH_TYPE.INSERT_BEFORE,
        firstFixture,
        firstTree,
        null,
      ]);

      domNode.appendChild(document.createElement('div'));

      const secondFixture = createTree('div');

      const secondTree = createTree(domNode);
      const secondPass = createTree('div', [secondTree]);
      const secondPassPatches = [];

      syncTree(secondFixture, secondPass, secondPassPatches);

      deepStrictEqual(secondPassPatches, [
        PATCH_TYPE.INSERT_BEFORE,
        secondFixture,
        secondTree,
        null,
      ]);
    });

    it('will support dom element comparisons with whitespace, should have no diff', () => {
      const domNode = document.createElement('div');

      // Issue with text element during diff, this test will pass if the whitespace
      // is removed.
      domNode.innerHTML = `
        <h1>Element 1</h1>
        <span>Element 2</span>
      `;

      const oldTree = createTree(domNode);

      const newTree = html`
        <h1>Element 1</h1>
        <span>Element 2</span>
      `;

      const patches = [];
      syncTree(oldTree, newTree, patches);
      deepStrictEqual(patches, []);
    });

    describe('Attributes', () => {
      it('will detect attribute/prop addition', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', { id: 'test-id' });

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'id',
          'test-id',
        ]);
      });

      it('will detect multiple attribute/prop additions', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', {
          id: 'test-id',
          class: 'test-class',
        });

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'id',
          'test-id',

          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'class',
          'test-class',
        ]);
      });

      it('will detect multiple mixed type attribute/prop additions', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', {
          id: 'test-id',
          style: { fontWeight: 'bold' },
        });

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'id',
          'test-id',

          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'style',
          { fontWeight: 'bold' },
        ]);
      });

      it('will detect the key attribute and apply to the tree', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', { key: 'test-key' });

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'key',
          'test-key',
        ]);

        strictEqual(newTree.key, 'test-key');
      });

      it('will detect string attribute changes and change old attribute', () => {
        const oldTree = createTree('div', { id: 'test' });
        const newTree = createTree('div', { id: 'test-two' });

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'id',
          'test-two',
        ]);

        strictEqual(oldTree.attributes.id, 'test-two');
      });

      it('will detect object attribute changes and change old attribute', () => {
        const oldTree = createTree('div', { style: {} });
        const newTree = createTree('div', { style: { fontWeight: 'bold' } });

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'style',
          { fontWeight: 'bold' },
        ]);

        strictEqual(oldTree.attributes.style, newTree.attributes.style);
      });

      it('will detect an attribute to be removed', () => {
        const oldTree = createTree('div', { style: {} });
        const newTree = createTree('div');

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.REMOVE_ATTRIBUTE,
          oldTree,
          'style',
        ]);

        strictEqual(oldTree.attributes.hasOwnProperty('style'), false);
      });

      it('will detect many attributes to be removed', () => {
        const oldTree = createTree('div', { id: 'test-id', style: {} });
        const newTree = createTree('div');

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.REMOVE_ATTRIBUTE,
          oldTree,
          'id',

          PATCH_TYPE.REMOVE_ATTRIBUTE,
          oldTree,
          'style',
        ]);

        strictEqual(oldTree.attributes.hasOwnProperty('style'), false);
        strictEqual(oldTree.attributes.hasOwnProperty('id'), false);
      });

      it('will detect attributes with empty string values', () => {
        const oldTree = createTree('div', {});
        const newTree = createTree('div', { autofocus: '' });
        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.SET_ATTRIBUTE,
          oldTree,
          'autofocus',
          '',
        ]);
      });

      it('will not generate patches when returning old element', () => {
        const hook = (oldTree, newTree) => {
          return oldTree && oldTree.attributes && oldTree.attributes.class === 'text' ?
            oldTree :
            newTree;
          };

        SyncTreeHookCache.add(hook);

        const oldTree = parse(`
          <div class="parent"><div class="child"><span class="text">Hello world!</span></div></div>
        `).childNodes[1];
        const newTree = parse(`
          <div class="parent"><div class="child"><span class="image">Goodbye world!</span></div></div>
        `).childNodes[1];

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, []);

        SyncTreeHookCache.delete(hook);
      });
    });

    describe('Elements (keyed)', () => {
      it('will error if duplicate keys are provided in development', () => {
        const referenceNode = createTree('div', { key: '0' });
        const duplicateNode = createTree('div', { key: '0' });
        const oldTree = createTree('div', null, [referenceNode]);
        const newTree = createTree('div', null, [
          referenceNode,
          duplicateNode,
        ]);

        throws(() => syncTree(oldTree, newTree));
      });

      it('will not error if duplicate keys are provided in production', () => {
        const referenceNode = createTree('div', { key: '0' });
        const duplicateNode = createTree('div', { key: '0' });
        const oldTree = createTree('div', null, [referenceNode]);
        const newTree = createTree('div', null, [
          referenceNode,
          duplicateNode,
        ]);

        process.env.NODE_ENV = 'production';
        doesNotThrow(() => syncTree(oldTree, newTree));
      });

      describe('insertBefore', () => {
        it('will prepend an element', () => {
          const referenceNode = createTree('div', { key: '0' });
          const oldTree = createTree('div', null, [referenceNode]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '1' }),
            createTree('div', { key: '0' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            newTree.childNodes[0],
            'key',
            '1',

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            newTree.childNodes[0],
            referenceNode,
          ]);
        });

        it('will prepend elements', () => {
          const referenceNode = createTree('div', { key: '0' });
          const oldTree = createTree('div', null, [referenceNode]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '1' }),
            createTree('div', { key: '2' }),
            createTree('div', { key: '0' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            newTree.childNodes[0],
            'key',
            '1',

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            newTree.childNodes[0],
            referenceNode,

            PATCH_TYPE.SET_ATTRIBUTE,
            newTree.childNodes[1],
            'key',
            '2',

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            newTree.childNodes[1],
            referenceNode,
          ]);
        });

        it('will append an element if no reference node is available', () => {
          const oldTree = createTree('div', null, []);
          const newTree = createTree('div', null, [
            createTree('div', { key: '0' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            newTree.childNodes[0],
            'key',
            '0',

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            newTree.childNodes[0],
            null,
          ]);
        });

        it('will prepend and append elements', () => {
          const referenceNode = createTree('div', { key: 1 });
          const oldTree = createTree('div', null, [referenceNode]);
          const newTree = createTree('div', null, [
            createTree('div', { key: 0 }),
            createTree('div', { key: 1 }),
            createTree('div', { key: 2 }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            newTree.childNodes[0],
            'key',
            0,

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            newTree.childNodes[0],
            referenceNode,

            PATCH_TYPE.SET_ATTRIBUTE,
            newTree.childNodes[2],
            'key',
            2,

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            newTree.childNodes[2],
            null,
          ]);
        });
      });

      describe('replaceChild', () => {
        it('will replace elements if keys are different', () => {
          const a = createTree('div', { key: 'a' });
          const b = createTree('div', { key: 'b' });
          const oldTree = createTree('div', null, [a]);
          const newTree = createTree('div', null, [b]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            b,
            'key',
            'b',

            PATCH_TYPE.REPLACE_CHILD,
            b,
            a,
          ]);
        });

        it('will replace multiple elements if keys are different', () => {
          const a = createTree('div', { key: 'a' });
          const b = createTree('div', { key: 'b' });
          const c = createTree('div', { key: 'c' });
          const d = createTree('div', { key: 'd' });
          const oldTree = createTree('div', null, [a, b]);
          const newTree = createTree('div', null, [c, d]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            c,
            'key',
            'c',

            PATCH_TYPE.REPLACE_CHILD,
            c,
            a,

            PATCH_TYPE.SET_ATTRIBUTE,
            d,
            'key',
            'd',

            PATCH_TYPE.REPLACE_CHILD,
            d,
            b,
          ]);
        });

        it('will replace elements if they are of different types', () => {
          const a = createTree('div', { key: 'a' });
          const b = createTree('span', { key: 'a' });
          const oldTree = createTree('div', null, a);
          const newTree = createTree('div', null, b);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            b,
            'key',
            'a',

            PATCH_TYPE.REPLACE_CHILD,
            b,
            a,
          ]);
        });
      });

      describe('removeChild', () => {
        it('will remove an element from the top', () => {
          const toRemove = createTree('div', { key: '1' });
          const oldTree = createTree('div', null, [
            toRemove,
            createTree('div', { key: '2' }),
          ]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '2' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.REMOVE_CHILD,
            toRemove,
          ]);
        });

        it('will remove elements from the top', () => {
          const toRemoveOne = createTree('div', { key: '1' });
          const toRemoveTwo = createTree('div', { key: '2' });
          const oldTree = createTree('div', null, [
            toRemoveOne,
            toRemoveTwo,
            createTree('div', { key: '3' }),
          ]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '3' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.REMOVE_CHILD,
            toRemoveOne,

            PATCH_TYPE.REMOVE_CHILD,
            toRemoveTwo,
          ]);
        });

        it('will remove an element between nodes', () => {
          const toRemove = createTree('div', { key: '1' });
          const oldTree = createTree('div', null, [
            createTree('div', { key: '0' }),
            toRemove,
            createTree('div', { key: '2' }),
          ]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '0' }),
            createTree('div', { key: '2' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.REMOVE_CHILD,
            toRemove,
          ]);
        });

        it('will remove elements from between nodes', () => {
          const toRemoveOne = createTree('div', { key: '1' });
          const toRemoveTwo = createTree('div', { key: '2' });
          const oldTree = createTree('div', null, [
            createTree('div', { key: '0' }),
            toRemoveOne,
            toRemoveTwo,
            createTree('div', { key: '3' }),
          ]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '0' }),
            createTree('div', { key: '3' }),
          ]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.REMOVE_CHILD,
            toRemoveOne,

            PATCH_TYPE.REMOVE_CHILD,
            toRemoveTwo,
          ]);
        });

        it('will remove and reorder elements', () => {
          const toRemove = createTree('div', { key: '1' });
          const oldTree = createTree('div', null, [
            createTree('div', { key: '0' }),
            toRemove,
            createTree('div', { key: '2' }),
          ]);

          const first = createTree('div', { key: '2' });
          const second = createTree('div', { key: '0' });
          const newTree = createTree('div', null, [first, second]);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.SET_ATTRIBUTE,
            first,
            'key',
            '2',

            PATCH_TYPE.INSERT_BEFORE,
            oldTree,
            first,
            second,

            PATCH_TYPE.REMOVE_CHILD,
            toRemove,
          ]);
        });

        it('will remove all keyed items', () => {
          const toRemove = [
            createTree('div', { key: '0' }),
            createTree('div', { key: '1' }),
          ];

          const oldTree = createTree('div', null, toRemove);
          const newTree = createTree('div', null, []);

          const patches = [];
          syncTree(oldTree, newTree, patches);

          deepStrictEqual(patches, [
            PATCH_TYPE.REMOVE_CHILD,
            toRemove[0],

            PATCH_TYPE.REMOVE_CHILD,
            toRemove[1],
          ]);
        });
      });
    });

    describe('Elements (non-keyed)', () => {
      it('will detect a single new element', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', null, createTree('div'));

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.INSERT_BEFORE,
          oldTree,
          newTree.childNodes[0],
          null
        ]);
      });

      it('will detect multiple new elements', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', null, [
          createTree('div'),
          createTree('div'),
        ]);

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.INSERT_BEFORE,
          oldTree,
          newTree.childNodes[0],
          null,

          PATCH_TYPE.INSERT_BEFORE,
          oldTree,
          newTree.childNodes[1],
          null,
        ]);
      });

      it('will remove old elements', () => {
        const toRemove = createTree('div');
        const oldTree = createTree('div', null, [
          createTree('div'),
          toRemove,
        ]);
        const newTree = createTree('div', null, [
          createTree('div'),
        ]);

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.REMOVE_CHILD,
          toRemove,
        ]);
      });

      it('will replace changed elements', () => {
        const toReplace = createTree('div');
        const oldTree = createTree('div', null, [
          toReplace,
        ]);
        const newTree = createTree('div', null, [
          createTree('span'),
        ]);

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.REPLACE_CHILD,
          newTree.childNodes[0],
          toReplace,
        ]);
      });
    });

    describe('Text', () => {
      it('will detect node value change', () => {
        const oldTree = createTree('#text', 'test-test');
        const newTree = createTree('#text', 'test-text-two');

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.NODE_VALUE,
          oldTree,
          'test-text-two',
          'test-test',
        ]);
      });

      it('will not decode entities until patch', () => {
        const oldTree = createTree('#text', 'test-test');
        const newTree = createTree('#text', '&gla;');

        const patches = [];
        syncTree(oldTree, newTree, patches);

        deepStrictEqual(patches, [
          PATCH_TYPE.NODE_VALUE,
          oldTree,
          '&gla;',
          'test-test',
        ]);
      });
    });
  });
});
