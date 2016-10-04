import makeTree from '../../lib/tree/make';
import syncTree from '../../lib/tree/sync';
import { createElement } from '../../lib/tree/helpers';
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

  describe('sync', function() {
    it('will error if patches passed is not an array', function() {
      assert.throws(function() {
        syncTree(null, null, 5);
      });
    });

    it('will error if oldTree is missing', function() {
      assert.throws(function() {
        syncTree(null);
      });
    });

    it('will abort if both stateful components are the same', function() {
      class Component {
        render() {
          return createElement('div', null, 'Hello world');
        }
      }

      const component1 = createElement(Component);
      const component2 = createElement(Component);

      const patches = syncTree(component1, component2);
      assert.equal(patches.length, 0);
    });

    it('will find changes if stateful components are different', function() {
      class ComponentOne {
        render() {
          return createElement('div', null, 'Hello world');
        }
      }

      class ComponentTwo {
        render() {
          return createElement('div', null, 'Hello world two');
        }
      }

      const component1 = createElement(ComponentOne);
      const component2 = createElement(ComponentTwo);

      const patches = syncTree(component1, component2);
      assert.equal(patches.length, 1);

      assert.equal(patches[0].__do__, 3);
      assert.equal(patches[0].value, 'Hello world two');
    });

    it('will abort if both components are the same', function() {
      class Component {
        render() {
          return createElement('div', null, 'Hello world');
        }
      }

      const component1 = createElement(Component);
      const component2 = createElement(Component);

      const patches = syncTree(component1, component2);
      assert.equal(patches.length, 0);
    });

    it('will replace children if component root is the same', function() {
      class Component {
        render() {
          return createElement('div', null, 'Hello world');
        }
      }

      const div = createElement('div');
      const component = createElement(Component);

      const patches = syncTree(div, component);
      assert.equal(patches.length, 1);
      assert.equal(patches[0].__do__, 1);
      assert.equal(patches[0].element, div);
      assert.deepEqual(patches[0].fragment, [createElement('#text', null, 'Hello world')]);
    });

    it('will replace parent if component root is different', function() {
      class Component {
        render() {
          return createElement('div', null, 'Hello world');
        }
      }

      const p = createElement('p');
      const component = createElement(Component);

      const patches = syncTree(p, component);
      assert.equal(patches.length, 1);
      assert.equal(patches[0].__do__, 0);
      assert.equal(patches[0].old, p);
      assert.deepEqual(patches[0].new, createElement('div', null, 'Hello world'));
    });
  });
});
