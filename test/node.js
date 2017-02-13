import { ok, equal } from 'assert';
import { createNode } from '../lib/node';
import validateMemory from './util/validateMemory';

describe('Node', function() {
  afterEach(() => validateMemory());

  describe('create', () => {
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
  });
});
