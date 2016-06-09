import makeNode from '../../lib/node/make';
import syncNode from '../../lib/node/sync';
import { cleanMemory } from '../../lib/util/memory';
import validateMemory from '../util/validateMemory';

describe('Unit: Node', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  describe('make', function() {
    it('can create an empty div', function() {
      var node = makeNode(document.createElement('div'));

      assert.equal(node.nodeName, 'div');
      assert.equal(node.childNodes.length, 0);
      assert.equal(node.attributes.length, 0);
    });

    it('can create a text node', function() {
      var node = makeNode(document.createTextNode('test'));

      assert.equal(node.nodeName, '#text');
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
