import {
  equal,
  strictEqual,
  notEqual,
  deepEqual,
  throws,
  doesNotThrow,
} from 'assert';
import createTree from '../lib/tree/create';
import syncTree from '../lib/tree/sync';
import { MiddlewareCache } from '../lib/util/caches';
import parse from '../lib/util/parse';
import validateMemory from './util/validateMemory';

describe('Tree', function() {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => validateMemory());

  describe('create', () => {
    it('will return null for falsy values', () => {
      equal(createTree(), null);
      equal(createTree(null), null);
      equal(createTree(undefined), null);
      equal(createTree(''), null);
      equal(createTree(0), null);
      equal(createTree(NaN), null);
    });

    it('will create an empty div', () => {
      const vTree = createTree('div');

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'some text chunks',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will ignore falsy values when creating text from an array', () => {
      const vTree = createTree('#text', ['some text', null, ' ', 'chunks']);

      deepEqual(vTree, {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: 'some text chunks',
        nodeType: 3,
        key: '',
        attributes: {},
        childNodes: [],
      });
    });

    it('will ignore falsy values when creating children from an array', () => {
      const vTree = createTree('div', null, ['text', NaN, createTree('p')]);

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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
      equal(vTree.key, vTree.attributes.key);
    });

    it('will mirror a falsy key attribute to the VTree', () => {
      const vTree = createTree('div', { key: 0 });
      strictEqual(vTree.key, String(vTree.attributes.key));
    });

    it('will use a scripts src as key attribute', () => {
      const vTree = createTree('script', { src: '12345' });
      equal(vTree.key, vTree.attributes.src);
    });

    it('will prefer the key attribute to the scripts src', () => {
      const vTree = createTree('script', { key: 'test', src: '12345' });
      notEqual(vTree.key, vTree.attributes.src);
      equal(vTree.key, vTree.attributes.key);
    });

    it('will mirror an empty div dom node', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      deepEqual(vTree, {
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

      equal(vTree.childNodes.length, 1);
      equal(vTree.childNodes[0].nodeName, 'p');
    });

    it('will ignore undefined array elements', () => {
      const vTree = createTree([
        null,
        'div'
      ]);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeType: 11,
        nodeValue: '',
        key: '',
        attributes: {},
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeType: 1,
          nodeValue: '',
          key: '',
          attributes: {},
          childNodes: [],
        }],
      });
    });
  });

  describe('sync', () => {
    it('will error if missing a new tree to sync into', () => {
      const oldTree = createTree('div');
      const newTree = undefined;

      throws(() => syncTree(oldTree, newTree), /Missing new Virtual Tree/);
    });

    it('will not throw custom error if in production', () => {
      const oldTree = createTree('div');
      const newTree = undefined;

      process.env.NODE_ENV = 'production';

      throws(() => syncTree(oldTree, newTree), /Cannot read property 'length'/);
    });

    it('will throw an error if top level elements are different', () => {
      const oldTree = createTree('div');
      const newTree = createTree('h1');

      throws(() => syncTree(oldTree, newTree), /cannot compare h1 with div/);
    });

    it('will throw an error if the new tree is not the same type', () => {
      const oldTree = createTree('div');
      const newTree = createTree('span');

      throws(() =>  syncTree(oldTree, newTree));
    });

    it('will generate an empty patchset if there are no changes', () => {
      const oldTree = createTree('div');
      const newTree = createTree('div');

      const patches = syncTree(oldTree, newTree);

      deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [],
        REMOVE_ATTRIBUTE: [],
      });
    });

    it('will not error if the new tree is a document fragment', () => {
      const oldTree = createTree('div');
      const newTree = createTree('#document-fragment');

      doesNotThrow(() =>  syncTree(oldTree, newTree));
    });

    describe('Attributes', () => {
      it('will detect attribute/prop addition', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', { id: 'test-id' });

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [oldTree, 'id', 'test-id'],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will detect multiple attribute/prop additions', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', {
          id: 'test-id',
          class: 'test-class',
        });

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'id', 'test-id',
            oldTree, 'class', 'test-class',
          ],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will detect multiple mixed type attribute/prop additions', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', {
          id: 'test-id',
          style: { fontWeight: 'bold' },
        });

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'id', 'test-id',
            oldTree, 'style', { fontWeight: 'bold' },
          ],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will detect the key attribute and apply to the tree', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', { key: 'test-key' });

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'key', 'test-key',
          ],
          REMOVE_ATTRIBUTE: [],
        });

        equal(newTree.key, 'test-key');
      });

      it('will detect string attribute changes and change old attribute', () => {
        const oldTree = createTree('div', { id: 'test' });
        const newTree = createTree('div', { id: 'test-two' });

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'id', 'test-two',
          ],
          REMOVE_ATTRIBUTE: [],
        });

        equal(oldTree.attributes.id, 'test-two');
      });

      it('will detect object attribute changes and change old attribute', () => {
        const oldTree = createTree('div', { style: {} });
        const newTree = createTree('div', { style: { fontWeight: 'bold' } });

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'style', { fontWeight: 'bold' },
          ],
          REMOVE_ATTRIBUTE: [],
        });

        equal(oldTree.attributes.style, newTree.attributes.style);
      });

      it('will detect an attribute to be removed', () => {
        const oldTree = createTree('div', { style: {} });
        const newTree = createTree('div');

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [
            oldTree, 'style',
          ],
        });

        equal(oldTree.attributes.hasOwnProperty('style'), false);
      });

      it('will detect many attributes to be removed', () => {
        const oldTree = createTree('div', { id: 'test-id', style: {} });
        const newTree = createTree('div');

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [
            oldTree, 'id',
            oldTree, 'style',
          ],
        });

        equal(oldTree.attributes.hasOwnProperty('style'), false);
        equal(oldTree.attributes.hasOwnProperty('id'), false);
      });

      it('will detect attributes with empty string values', () => {
        const oldTree = createTree('div', {});
        const newTree = createTree('div', { autofocus: '' });
        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [oldTree, 'autofocus', ''],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will not generate patches when returning old element', () => {
        const hook = (oldTree, newTree) =>
          oldTree && oldTree.attributes && oldTree.attributes.class === 'text' ?
            oldTree :
            newTree;

        MiddlewareCache.SyncTreeHookCache.add(hook);

        const oldTree = parse(`
          <div class="parent"><div class="child"><span class="text">Hello world!</span></div></div>
        `).childNodes[0];
        const newTree = parse(`
          <div class="parent"><div class="child"><span class="image">Goodbye world!</span></div></div>
        `).childNodes[0];

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });

        MiddlewareCache.SyncTreeHookCache.delete(hook);
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

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: [
                oldTree, newTree.childNodes[0], referenceNode,
              ],
              REMOVE_CHILD: null,
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [
              newTree.childNodes[0], 'key', '1',
            ],
            REMOVE_ATTRIBUTE: [],
          });
        });

        it('will prepend elements', () => {
          const referenceNode = createTree('div', { key: '0' });
          const oldTree = createTree('div', null, [referenceNode]);
          const newTree = createTree('div', null, [
            createTree('div', { key: '1' }),
            createTree('div', { key: '2' }),
            createTree('div', { key: '0' }),
          ]);

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: [
                oldTree, newTree.childNodes[0], referenceNode,
                oldTree, newTree.childNodes[1], referenceNode,
              ],
              REMOVE_CHILD: null,
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [
              newTree.childNodes[0], 'key', '1',
              newTree.childNodes[1], 'key', '2',
            ],
            REMOVE_ATTRIBUTE: [],
          });
        });

        it('will append an element if no reference node is available', () => {
          const oldTree = createTree('div', null, []);
          const newTree = createTree('div', null, [
            createTree('div', { key: '0' }),
          ]);

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: [
                oldTree, newTree.childNodes[0], null,
              ],
              REMOVE_CHILD: null,
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [
              newTree.childNodes[0], 'key', '0',
            ],
            REMOVE_ATTRIBUTE: [],
          });
        });

        it('will prepend and append elements', () => {
          const referenceNode = createTree('div', { key: 1 });
          const oldTree = createTree('div', null, [referenceNode]);
          const newTree = createTree('div', null, [
            createTree('div', { key: 0 }),
            createTree('div', { key: 1 }),
            createTree('div', { key: 2 }),
          ]);

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: [
                oldTree, newTree.childNodes[0], referenceNode,
                oldTree, newTree.childNodes[2], null,
              ],
              REMOVE_CHILD: null,
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [
              newTree.childNodes[0], 'key', '0',
              newTree.childNodes[2], 'key', '2',
            ],
            REMOVE_ATTRIBUTE: [],
          });
        });
      });

      describe('replaceChild', () => {
        it('will replace elements if keys are different', () => {
          const a = createTree('div', { key: 'a' });
          const b = createTree('div', { key: 'b' });
          const oldTree = createTree('div', null, [a]);
          const newTree = createTree('div', null, [b]);

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: null,
              REPLACE_CHILD: [
                b, a,
              ],
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [
              b, 'key', 'b'
            ],
            REMOVE_ATTRIBUTE: [],
          });
        });

        it('will replace multiple elements if keys are different', () => {
          const a = createTree('div', { key: 'a' });
          const b = createTree('div', { key: 'b' });
          const c = createTree('div', { key: 'c' });
          const d = createTree('div', { key: 'd' });
          const oldTree = createTree('div', null, [a, b]);
          const newTree = createTree('div', null, [c, d]);

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: null,
              REPLACE_CHILD: [
                c, a,
                d, b,
              ],
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [
              c, 'key', 'c',
              d, 'key', 'd',
            ],
            REMOVE_ATTRIBUTE: [],
          });
        });

        it('will replace elements if they are of different types', () => {
          const a = createTree('div', { key: 'a' });
          const b = createTree('span', { key: 'a' });
          const oldTree = createTree('div', null, a);
          const newTree = createTree('div', null, b);

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: null,
              REPLACE_CHILD: [b, a],
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [b, 'key', 'a'],
            REMOVE_ATTRIBUTE: [],
          });
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

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: [toRemove],
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [],
            REMOVE_ATTRIBUTE: [],
          });
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

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: [toRemoveOne, toRemoveTwo],
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [],
            REMOVE_ATTRIBUTE: [],
          });
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

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: [toRemove],
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [],
            REMOVE_ATTRIBUTE: [],
          });
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

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: null,
              REMOVE_CHILD: [toRemoveOne, toRemoveTwo],
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [],
            REMOVE_ATTRIBUTE: [],
          });
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

          const patches = syncTree(oldTree, newTree);

          deepEqual(patches, {
            TREE_OPS: [{
              INSERT_BEFORE: [oldTree, first, second],
              REMOVE_CHILD: [toRemove],
              REPLACE_CHILD: null,
            }],
            NODE_VALUE: [],
            SET_ATTRIBUTE: [],
            REMOVE_ATTRIBUTE: [],
          });
        });
      });
    });

    describe('Elements (non-keyed)', () => {
      it('will detect a single new element', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', null, createTree('div'));

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [{
            INSERT_BEFORE: [oldTree, newTree.childNodes[0], null],
            REMOVE_CHILD: null,
            REPLACE_CHILD: null,
          }],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will detect multiple new elements', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', null, [
          createTree('div'),
          createTree('div'),
        ]);

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [{
            INSERT_BEFORE: [
              oldTree, newTree.childNodes[0], null,
              oldTree, newTree.childNodes[1], null,
            ],
            REMOVE_CHILD: null,
            REPLACE_CHILD: null,
          }],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });
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

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [{
            INSERT_BEFORE: null,
            REMOVE_CHILD: [toRemove],
            REPLACE_CHILD: null,
          }],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will replace changed elements', () => {
        const toReplace = createTree('div');
        const oldTree = createTree('div', null, [
          toReplace,
        ]);
        const newTree = createTree('div', null, [
          createTree('span'),
        ]);

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [{
            INSERT_BEFORE: null,
            REMOVE_CHILD: null,
            REPLACE_CHILD: [newTree.childNodes[0], toReplace],
          }],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });
      });
    });

    describe('Text', () => {
      it('will detect node value change', () => {
        const oldTree = createTree('#text', 'test-test');
        const newTree = createTree('#text', 'test-text-two');

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [oldTree, 'test-text-two', 'test-test'],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will not decode entities until patch', () => {
        const oldTree = createTree('#text', 'test-test');
        const newTree = createTree('#text', '&gla;');

        const patches = syncTree(oldTree, newTree);

        deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [oldTree, '&gla;', 'test-test'],
          SET_ATTRIBUTE: [],
          REMOVE_ATTRIBUTE: [],
        });
      });
    });
  });
});
