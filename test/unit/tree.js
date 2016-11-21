import makeTree from '../../lib/tree/make';
import { cleanMemory } from '../../lib/util/memory';
import validateMemory from '../util/validateMemory';

describe('Unit: Tree', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  describe('make', function() {
    it('can create an empty div', function() {
      var vTree = makeTree(document.createElement('div'));

      assert.equal(vTree.nodeName, 'div');
      assert.equal(vTree.childNodes.length, 0);
      assert.equal(vTree.attributes.length, 0);
    });

    it('can create a text node', function() {
      var vTree = makeTree(document.createTextNode('test'));

      assert.equal(vTree.nodeName, '#text');
      assert.equal(vTree.nodeValue, 'test');
      assert.equal(vTree.childNodes.length, 0);
      assert.equal(vTree.attributes.length, 0);
    });

    it('will ignore comments', function() {
      var vTree = makeTree(document.createComment('test'));
      assert.equal(vTree, false);
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

      var vTree = makeTree(fixture);

      assert.equal(vTree.childNodes.length, 0);
      assert.equal(vTree.attributes.length, 3);

      assert.equal(vTree.attributes[0].name, 'class');
      assert.equal(vTree.attributes[0].value, 'test');

      assert.equal(vTree.attributes[1].name, 'data-test');
      assert.equal(vTree.attributes[1].value, 'class');

      assert.equal(vTree.attributes[2].name, 'fake-attr');
      assert.equal(vTree.attributes[2].value, multiline);
    });

    it('can nest child elements', function() {
      var fixture = document.createElement('div');

      fixture.appendChild(document.createElement('p'));

      var vTree = makeTree(fixture);

      assert.equal(vTree.childNodes.length, 1);
      assert.equal(vTree.childNodes[0].nodeName, 'p');
    });

    it('can convert the current documentElement', function() {
      var vTree = makeTree(document.documentElement);

      assert.equal(vTree.childNodes.length, 2);
      assert.equal(vTree.childNodes[0].nodeName, 'head');
      assert.equal(vTree.childNodes[1].nodeName, 'body');
    });
  });
});
