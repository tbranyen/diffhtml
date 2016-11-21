import { createElement } from '../../../lib/tree/helpers';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';

describe('Unit: Tree Helpers', function() {
  afterEach(() => {
    cleanMemory();
    validateMemory();
  });

  describe('createElement', () => {
    it('can create empty text nodes', () => {
      assert.deepEqual(createElement('text'), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: '',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });

      assert.deepEqual(createElement('#text'), {
        rawNodeName: '#text',
        nodeName: '#text',
        nodeValue: '',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });
    });

    it('can create a text node with text', () => {
      assert.deepEqual(createElement('text', null, 'hello world'), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: 'hello world',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });

      assert.deepEqual(createElement('text', 'hello world'), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: 'hello world',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });
    });

    it('can create a text node with text as an array', () => {
      assert.deepEqual(createElement('text', null, ['hello world']), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: 'hello world',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });

      assert.deepEqual(createElement('text', ['hello world']), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: 'hello world',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });
    });

    it('can create a text node with multiple text as an array', () => {
      assert.deepEqual(createElement('text', null, ['hello world', 'cool']), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: 'hello worldcool',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });

      assert.deepEqual(createElement('text', ['hello world', 'cool']), {
        rawNodeName: 'text',
        nodeName: 'text',
        nodeValue: 'hello worldcool',
        nodeType: 3,
        key: '',
        childNodes: [],
        attributes: [],
      });
    });

    it('can create a div node', () => {
      assert.deepEqual(createElement('div'), {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: [],
      });
    });

    it('can create a div node with text', () => {
      assert.deepEqual(createElement('div', 'hello world'), {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [createElement('#text', 'hello world')],
        attributes: [],
      });
    });

    it('can create a div node with text', () => {
      assert.deepEqual(createElement('div', null, 'hello world'), {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [createElement('#text', null, 'hello world')],
        attributes: [],
      });

      assert.deepEqual(createElement('div', 'hello world'), {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [createElement('#text', 'hello world')],
        attributes: [],
      });
    });

    it('can convert an input array into a document fragment', () => {
      assert.deepEqual(createElement([ createElement('h1', 'test'), ]), {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'h1',
          nodeName: 'h1',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: '#text',
            nodeName: '#text',
            nodeValue: 'test',
            nodeType: 3,
            key: '',
            childNodes: [],
            attributes: [],
          }],
          attributes: [],
        }],
        attributes: [],
      });
    });
  });
});
