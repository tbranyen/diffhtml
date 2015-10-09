describe('Unit: Element', function() {
  describe('get', function() {
    var getElement = require('/lib/element/get');

    it('creates an element from descriptor on first access', function() {
      var retVal = getElement({
        element: 'some_uuid',
        nodeName: 'div',
        nodeValue: 'test'
      });

      assert.equal(retVal.uuid, 'some_uuid');
      assert.ok(retVal.element instanceof Element);
      assert.equal(retVal.element.textContent, 'test');
    });

    it('can get an existing element descriptor', function() {
      getElement({
        element: 'some_uuid',
        nodeName: 'div',
        nodeValue: 'test'
      });

      var retVal = getElement({ element: 'some_uuid' });

      assert.equal(retVal.uuid, 'some_uuid');
      assert.ok(retVal.element instanceof Element);
      assert.equal(retVal.element.textContent, 'test');
    });
  });

  describe('make', function() {
    var makeElement = require('/lib/element/make');

    it('can create an empty element', function() {
      var element = makeElement({
        element: 'some_uuid_0',
        nodeName: 'p'
      });

      assert.equal(element.childNodes.length, 0);
      assert.equal(element.attributes.length, 0);
      assert.equal(element.nodeName, 'P');
    });

    it('will return the same element if same element uuid is used', function() {
      var element = makeElement({
        element: 'some_uuid_0',
        nodeName: 'span'
      });

      assert.equal(element.childNodes.length, 0);
      assert.equal(element.attributes.length, 0);
      assert.equal(element.nodeName, 'P');
    });

    it('can set text content', function() {
      var element = makeElement({
        element: 'some_uuid_1',
        nodeName: 'p',
        nodeValue: 'hello'
      });

      assert.equal(element.nodeName, 'P');
      assert.equal(element.textContent, 'hello');
    });

    it('can create an element with children', function() {
      var element = makeElement({
        element: 'some_uuid_2',
        nodeName: 'div',
        childNodes: [{ nodeName: 'p', nodeValue: 'hello' }]
      });

      assert.equal(element.childNodes[0].nodeName, 'P');
      assert.equal(element.childNodes[0].textContent, 'hello');
    });

    it('can create an element with attributes', function() {
      var element = makeElement({
        element: 'some_uuid_3',
        nodeName: 'div',
        attributes: [{ name: 'class', value: 'some_Value' }]
      });

      assert.equal(element.getAttribute('class'), 'some_Value');
    });
  });
});

