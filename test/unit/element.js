import makeElement from '../../lib/element/make';
import makeNode from '../../lib/node/make';
import { cleanMemory } from '../../lib/util/memory';
import validateMemory from '../util/validateMemory';

describe('Unit: Element', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  describe('make', function() {
    it('creates an element from descriptor on first access', function() {
      this.fixture = makeElement({
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      });

      assert.ok(this.fixture instanceof Element);
      assert.equal(this.fixture.textContent, 'test');
    });

    it('can get an existing element descriptor', function() {
      let descriptor = {
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      };

      makeElement(descriptor);

      var retVal = makeElement(descriptor);

      assert.ok(retVal instanceof Element);
      assert.equal(retVal.textContent, 'test');
    });

    it('can create an empty element', function() {
      var element = makeElement({
        nodeName: 'p'
      });

      assert.equal(element.childNodes.length, 0);
      assert.equal(element.attributes.length, 0);
      assert.equal(element.nodeName, 'P');
    });

    it('can set text content', function() {
      var element = makeElement({
        nodeName: 'p',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'hello'
        }]
      });

      assert.equal(element.nodeName, 'P');
      assert.equal(element.textContent, 'hello');
    });

    it('can create an element with children', function() {
      var element = makeElement({
        nodeName: 'div',
        childNodes: [{
          nodeName: 'p',
          childNodes: [{
            nodeName: '#text',
            nodeValue: 'hello'
          }]
        }]
      });

      assert.equal(element.childNodes[0].nodeName, 'P');
      assert.equal(element.childNodes[0].textContent, 'hello');
    });

    it('can create an element with attributes', function() {
      var element = makeElement({
        nodeName: 'div',
        attributes: [{ name: 'class', value: 'some_Value' }]
      });

      assert.equal(element.getAttribute('class'), 'some_Value');
    });
  });
});

