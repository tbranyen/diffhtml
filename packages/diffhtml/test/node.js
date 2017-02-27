import { ok, equal, throws } from 'assert';
import { createNode, patchNode } from '../lib/node';
import html from '../lib/html';
import validateMemory from './util/validateMemory';

describe('Node', function() {
  afterEach(() => validateMemory());

  describe('create', () => {
    it('will throw an error if called without a vTree', () => {
      throws(() => createNode());
      throws(() => createNode(null));
      throws(() => createNode(undefined));
      throws(() => createNode(false));
      throws(() => createNode(''));
    });

    it('will create a DOM Node from a vTree', () => {
      const domNode = createNode({
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      });

      ok(domNode instanceof Element);
      equal(domNode.textContent, 'test');
    });

    it('will get a DOM Node from existing vTree', () => {
      let descriptor = {
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      };

      createNode(descriptor);

      var retVal = createNode(descriptor);

      ok(retVal instanceof Element);
      equal(retVal.textContent, 'test');
    });

    it('will create an empty DOM Node', () => {
      const domNode = createNode({
        nodeName: 'p'
      });

      equal(domNode.childNodes.length, 0);
      equal(domNode.attributes.length, 0);
      equal(domNode.nodeName, 'P');
    });

    it('will set text content', () => {
      const domNode = createNode({
        nodeName: 'p',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'hello'
        }]
      });

      equal(domNode.nodeName, 'P');
      equal(domNode.textContent, 'hello');
    });

    it('will create a DOM Node with children', () => {
      const domNode = createNode({
        nodeName: 'div',
        childNodes: [{
          nodeName: 'p',
          childNodes: [{
            nodeName: '#text',
            nodeValue: 'hello'
          }]
        }]
      });

      equal(domNode.childNodes[0].nodeName, 'P');
      equal(domNode.childNodes[0].textContent, 'hello');
    });

    it('will not set attributes, they are applied during patch', () => {
      const domNode = createNode({
        nodeName: 'div',
        attributes: { class: 'some_Value' },
      });

      equal(domNode.getAttribute('class'), null);
    });

    it('will create document fragments', () => {
      const domNode = createNode({
        nodeName: '#document-fragment',
        childNodes: [{ nodeName: '#text', nodeValue: 'test' }],
      });

      equal(domNode.nodeName, '#document-fragment');
      equal(domNode.childNodes[0].nodeName, '#text');
      equal(domNode.childNodes[0].nodeValue, 'test');
    });
  });

  describe('patch', () => {
    it('will set attributes with no string values', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [vTree, 'autofocus', ''],
        REMOVE_ATTRIBUTE: [],
      };

      patchNode(patches);

      equal(domNode.hasAttribute('autofocus'), true);
      equal(domNode.getAttribute('autofocus'), '');
    });
  });
});
