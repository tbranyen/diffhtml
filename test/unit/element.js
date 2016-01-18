import getElement from '../../lib/element/get';
import makeElement from '../../lib/element/make';
import makeNode from '../../lib/node/make';

describe('Unit: Element', function() {
  afterEach(function() {
    delete makeNode.nodes.some_uuid;
    delete makeNode.nodes.some_uuid_1;
  });

  describe('get', function() {
    it('creates an element from descriptor on first access', function() {
      var retVal = getElement({
        uuid: 'some_uuid',
        nodeName: 'div',
        nodeValue: 'test'
      });

      assert.equal(retVal.uuid, 'some_uuid');
      assert.ok(retVal.element instanceof Element);
      assert.equal(retVal.element.textContent, 'test');
    });

    it('can get an existing element descriptor', function() {
      getElement({
        uuid: 'some_uuid',
        nodeName: 'div',
        nodeValue: 'test'
      });

      var retVal = getElement({ uuid: 'some_uuid' });

      assert.equal(retVal.uuid, 'some_uuid');
      assert.ok(retVal.element instanceof Element);
      assert.equal(retVal.element.textContent, 'test');
    });
  });

  describe('make', function() {
    it('can create an empty element', function() {
      var element = makeElement({
        uuid: 'some_uuid',
        nodeName: 'p'
      });

      assert.equal(element.childNodes.length, 0);
      assert.equal(element.attributes.length, 0);
      assert.equal(element.nodeName, 'P');
    });

    it('will return the same element if same element uuid is used', function() {
      makeElement({
        uuid: 'some_uuid',
        nodeName: 'p'
      });

      var element = makeElement({
        uuid: 'some_uuid',
        nodeName: 'span'
      });

      assert.equal(element.childNodes.length, 0);
      assert.equal(element.attributes.length, 0);
      assert.equal(element.nodeName, 'P');
    });

    it('can set text content', function() {
      var element = makeElement({
        uuid: 'some_uuid',
        nodeName: 'p',
        nodeValue: 'hello'
      });

      assert.equal(element.nodeName, 'P');
      assert.equal(element.textContent, 'hello');
    });

    it('can create an element with children', function() {
      var element = makeElement({
        uuid: 'some_uuid',
        nodeName: 'div',
        childNodes: [{ uuid: 'some_uuid_1', nodeName: 'p', nodeValue: 'hello' }]
      });

      assert.equal(element.childNodes[0].nodeName, 'P');
      assert.equal(element.childNodes[0].textContent, 'hello');
    });

    it('can create an element with attributes', function() {
      var element = makeElement({
        uuid: 'some_uuid',
        nodeName: 'div',
        attributes: [{ name: 'class', value: 'some_Value' }]
      });

      assert.equal(element.getAttribute('class'), 'some_Value');
    });
  });
});

