import makeNode from '../../lib/node/make';
import syncNode from '../../lib/node/sync';
import { cleanMemory } from '../../lib/util/memory';
import { registerElement } from '../../lib/index';

describe('Unit: Node', function() {
  afterEach(function() {
    cleanMemory();
  });

  describe('make', function() {
    it('can create an empty div', function() {
      var node = makeNode(document.createElement('div'));

      assert.equal(node.nodeName, 'div');
      assert.equal(node.nodeType, 1);
      assert.equal(node.childNodes.length, 0);
      assert.equal(node.attributes.length, 0);
    });

    it('can create a text node', function() {
      var node = makeNode(document.createTextNode('test'));

      assert.equal(node.nodeName, '#text');
      assert.equal(node.nodeType, 3);
      assert.equal(node.nodeValue, 'test');
      assert.equal(node.childNodes.length, 0);
      assert.equal(node.attributes.length, 0);
    });

    it('will ignore comments', function() {
      var node = makeNode(document.createComment('test'));
      assert.equal(node, false);
    });

    it('can crawl over attributes', function() {
      var fixture = document.createElement('div');
      var multiline = `
        supports
        multiline
      `;

      fixture.setAttribute('class', 'test');
      fixture.setAttribute('data-test', 'class');
      fixture.setAttribute('fake-attr', multiline);

      var node = makeNode(fixture);

      assert.equal(node.childNodes.length, 0);
      assert.equal(node.attributes.length, 3);

      assert.equal(node.attributes[0].name, 'class');
      assert.equal(node.attributes[0].value, 'test');

      assert.equal(node.attributes[1].name, 'data-test');
      assert.equal(node.attributes[1].value, 'class');

      assert.equal(node.attributes[2].name, 'fake-attr');
      assert.equal(node.attributes[2].value, multiline);
    });

    it('can nest child elements', function() {
      var fixture = document.createElement('div');

      fixture.appendChild(document.createElement('p'));

      var node = makeNode(fixture);

      assert.equal(node.childNodes.length, 1);
      assert.equal(node.childNodes[0].nodeName, 'p');
    });

    it('can convert the current documentElement', function() {
      var node = makeNode(document.documentElement);

      assert.equal(node.childNodes.length, 2);
      assert.equal(node.childNodes[0].nodeName, 'head');
      assert.equal(node.childNodes[1].nodeName, 'body');
    });

    it('can upgrade a regular element to custom element', function() {
      var fixture = document.createElement('my-fun-element');
      var createdCalled = 0;

      registerElement('my-fun-element', {
        createdCallback() {
          createdCalled += 1;
        }
      });

      var node = makeNode(fixture);

      assert.equal(createdCalled, 1);
    });

    it('can upgrade and call attachedCallback if parentNode exists', function() {
      var fixture = document.createElement('div');
      fixture.appendChild(document.createElement('my-fun-element-two'));

      var createdCalled = 0;
      var attachedCalled = 0;

      registerElement('my-fun-element-two', {
        createdCallback() {
          createdCalled += 1;
        },

        attachedCallback() {
          attachedCalled += 1;
        }
      });

      var node = makeNode(fixture);

      assert.equal(createdCalled, 1);
      assert.equal(attachedCalled, 1);
    });
  });

  describe('sync', function() {
    it('will error if patches passed is not an array', function() {
      assert.throws(function() {
        syncNode(null, null, 5);
      });
    });

    it('will error if oldTree is missing', function() {
      assert.throws(function() {
        syncNode(null);
      });
    });
  });
});
