import makeNode from '../../lib/node/make';
import { cleanMemory } from '../../lib/util/memory';
import validateMemory from '../util/validateMemory';

describe('Unit: Node', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  describe('make', function() {
    it('creates a DOM Node from vTree on first access', function() {
      this.fixture = makeNode({
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      });

      assert.ok(this.fixture instanceof Element);
      assert.equal(this.fixture.textContent, 'test');
    });

    it('can get a DOM Node from existing vTree', function() {
      let descriptor = {
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      };

      makeNode(descriptor);

      var retVal = makeNode(descriptor);

      assert.ok(retVal instanceof Element);
      assert.equal(retVal.textContent, 'test');
    });

    it('can create an empty DOM Node', function() {
      var node = makeNode({
        nodeName: 'p'
      });

      assert.equal(node.childNodes.length, 0);
      assert.equal(node.attributes.length, 0);
      assert.equal(node.nodeName, 'P');
    });

    it('can set text content', function() {
      var node = makeNode({
        nodeName: 'p',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'hello'
        }]
      });

      assert.equal(node.nodeName, 'P');
      assert.equal(node.textContent, 'hello');
    });

    it('can create a DOM Node with children', function() {
      var node = makeNode({
        nodeName: 'div',
        childNodes: [{
          nodeName: 'p',
          childNodes: [{
            nodeName: '#text',
            nodeValue: 'hello'
          }]
        }]
      });

      assert.equal(node.childNodes[0].nodeName, 'P');
      assert.equal(node.childNodes[0].textContent, 'hello');
    });

    it('can create a DOM Node with attributes', function() {
      var node = makeNode({
        nodeName: 'div',
        attributes: [{ name: 'class', value: 'some_Value' }]
      });

      assert.equal(node.getAttribute('class'), 'some_Value');
    });

    it('can set dynamic values', function() {
      var obj = {};
      var node = makeNode({
        nodeName: 'div',
        attributes: [{ name: 'tmp', value: obj }]
      });

      assert.equal(node.getAttribute('tmp'), '');
      assert.equal(node.tmp, obj);
    });
  });
});

