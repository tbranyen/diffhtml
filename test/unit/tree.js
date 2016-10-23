import makeTree from '../../lib/tree/make';
import syncTree, {
  REPLACE_ELEMENT,
  REMOVE_ELEMENT,
  APPEND_ELEMENT,
  PREPEND_ELEMENT,

  MODIFY_ATTRIBUTE,
  CHANGE_TEXT,
} from '../../lib/tree/sync';
import { createElement } from '../../lib/tree/helpers';
import { cleanMemory } from '../../lib/util/memory';
import { html as createTreeFromMarkup } from '../../lib/util/tagged-template';
import validateMemory from '../util/validateMemory';

describe('Unit: Tree', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  describe('helpers', function() {
    it('will remove the entire root element if there is no new tree', function() {
      var fixture = createElement('div', null,
        createElement('img', { src: 'avatar.png', className: 'profile' }),
        createElement('h3', null, 'Test')
      );

      assert.equal(fixture.nodeName, 'div');
      assert.equal(fixture.childNodes.length, 2);
      assert.equal(fixture.childNodes[0].nodeName, 'img');
      assert.equal(fixture.childNodes[0].attributes.length, 2);
      assert.equal(fixture.childNodes[0].attributes[0].name, 'src');
      assert.equal(fixture.childNodes[1].nodeName, 'h3');
      assert.equal(fixture.childNodes[1].attributes.length, 0);
      assert.equal(fixture.childNodes[1].childNodes.length, 1);
      assert.equal(fixture.childNodes[1].childNodes[0].nodeValue, 'Test');
    });

    it('can create a #document-fragment of elements', function() {
      var fixture = createElement('#document-fragment', null, [
        createElement('p'),
        createElement('span'),
        createElement('div'),
      ]);

      assert.equal(fixture.nodeName, '#document-fragment');
      assert.equal(fixture.childNodes.length, 3);
      assert.equal(fixture.childNodes[0].nodeName, 'p');
      assert.equal(fixture.childNodes[1].nodeName, 'span');
      assert.equal(fixture.childNodes[2].nodeName, 'div');
    });

    it('can return a container of elements', function() {
      var fixture = createElement('', null, [
        createElement('p'),
        createElement('span'),
        createElement('div'),
      ]);

      assert.equal(fixture.length, 3);
      assert.equal(fixture[0].nodeName, 'p');
      assert.equal(fixture[1].nodeName, 'span');
      assert.equal(fixture[2].nodeName, 'div');
    });

    it('can return a dom node in a container of elements', function() {
      var span = document.createElement('span');
      var fixture = createElement('', null, [
        createElement('p'),
        span,
      ]);

      assert.equal(fixture.length, 2);
      assert.equal(fixture[0].nodeName, 'p');
      assert.equal(fixture[1].nodeName, 'span');
      assert.notEqual(fixture[1], span);
    });

    it('can render a stateless component', function() {
      var fixture = createElement({
        render: props => createTreeFromMarkup`
          <span>Hello ${props.msg}</span>
        `
      });

      assert.equal(fixture.nodeName, 'span');
      assert.equal(fixture.childNodes[0].nodeName, '#text');
    });

    it('can render a stateful component', function() {
      var onclick = ev => {};

      class Component {
        onclick(ev) {
          /* Event handler */
        }

        render(props) {
          return createTreeFromMarkup`
            <span onclick=${this.onclick}>Hello ${props.msg}</span>
          `;
        }
      }

      var fixture = createElement(Component);

      assert.equal(fixture.nodeName, 'span');
      assert.equal(fixture.attributes.length, 1);
      assert.equal(fixture.attributes[0].name, 'onclick');
      assert.equal(fixture.attributes[0].value, Component.prototype.onclick);
      assert.equal(fixture.childNodes[0].nodeName, '#text');
    });

    it('will error when createElement is called without an argument', function() {
      assert.throws(() => {
        createElement();
      });
    });
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

    it('will set the key property directly', function() {
      var div = document.createElement('div');
      div.setAttribute('key', 'test');
      var vTree = makeTree(div);

      assert.equal(vTree.key, 'test');
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

    it('will remove the entire root element if there is no new tree', function() {
      var oldTree = createElement('div');
      var newTree = null;
      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 1);
      assert.equal(patches[0].type, REMOVE_ELEMENT);
      assert.equal(patches[0].oldTree.nodeName, 'div');
    });

    it('will replace the root node if the nodeNames are different', function() {
      var oldTree = createElement('div');
      var newTree = createElement('p');
      var patches = syncTree(oldTree, newTree);

      assert.equal(patches[0].type, REPLACE_ELEMENT);
      assert.equal(patches[0].oldTree.nodeName, 'div');
      assert.equal(patches[0].newTree.nodeName, 'p');
    });

    it('can diff two text nodes together', function() {
      var oldTree = createElement('#text', null, 'Hello');
      var newTree = createElement('#text', null, 'World');
      var patches = syncTree(oldTree, newTree);

      assert.equal(patches[0].type, CHANGE_TEXT);
      assert.equal(patches[0].element.nodeValue, 'World');
      assert.equal(patches[0].element, oldTree);
      assert.equal(patches[0].value, 'World');
      assert.equal(patches[0].newTree, newTree);
    });

    it('will not change anything if the text is the same', function() {
      var oldTree = createElement('#text', null, 'Hello');
      var newTree = createElement('#text', null, 'Hello');
      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 0);
    });

    it('can append elements to an empty parent', function() {
      var oldTree = createTreeFromMarkup(`<ul></ul>`);
      var newTree = createTreeFromMarkup(`<ul>
        <li>Hello</li>
        <li>World</li>
      </ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 1);
      assert.equal(patches[0].type, APPEND_ELEMENT);
      assert.equal(patches[0].element.nodeName, 'ul');
      assert.equal(patches[0].fragment.length, 5);

      assert.deepEqual(patches[0].fragment, [
        createElement('#text', null, '\n        '),
        createElement('li', null, 'Hello'),
        createElement('#text', null, '\n        '),
        createElement('li', null, 'World'),
        createElement('#text', null, '\n      '),
      ]);
    });

    it('can append elements to a parent with children', function() {
      var oldTree = createTreeFromMarkup(`<ul>
        <li>Hello</li>
      </ul>`);
      var newTree = createTreeFromMarkup(`<ul>
        <li>Hello</li>
        <li>World</li>
      </ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 2);
      assert.equal(patches[0].type, CHANGE_TEXT);
      assert.equal(patches[1].type, APPEND_ELEMENT);
      assert.equal(patches[1].element.nodeName, 'ul');
      assert.equal(patches[1].fragment.length, 2);

      assert.deepEqual(patches[1].fragment, [
        createElement('li', null, 'World'),
        createElement('#text', null, '\n      '),
      ]);
    });

    it('can append elements to a parent with children using keys', function() {
      var oldTree = createTreeFromMarkup(`<ul>
        <li key=1>Hello</li>
      </ul>`);

      var newTree = createTreeFromMarkup(`<ul>
        <li key=1>Hello</li>
        <li key=2>World</li>
      </ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 2);
      assert.equal(patches[0].type, CHANGE_TEXT);
      assert.equal(patches[1].type, APPEND_ELEMENT);
      assert.equal(patches[1].element.nodeName, 'ul');
      assert.equal(patches[1].fragment.length, 2);

      assert.deepEqual(patches[1].fragment, [
        createElement('li', { key: 2 }, 'World'),
        createElement('#text', null, '\n      '),
      ]);
    });

    it('can prepend elements with between whitespace', function() {
      var oldTree = createTreeFromMarkup(`<ul>
        <li key=1>Hello</li>
      </ul>`);
      var newTree = createTreeFromMarkup(`<ul>
        <li key=2>World</li>
        <li key=1>Hello</li>
      </ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 1);
      assert.equal(patches[0].type, PREPEND_ELEMENT);
      assert.equal(patches[0].element.nodeName, 'ul');
      assert.equal(patches[0].element, oldTree);
      assert.equal(patches[0].fragment.length, 2);

      assert.deepEqual(patches[0].fragment, [
        createElement('li', { key: 2 }, 'World'),
        createElement('#text', null, '\n        '),
      ]);
    });

    it('can prepend elements without between whitespace', function() {
      var oldTree = createTreeFromMarkup(`<ul><li key=1>Hello</li></ul>`);
      var newTree = createTreeFromMarkup(`<ul><li key=2>World</li><li key=1>Hello</li></ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 1);
      assert.equal(patches[0].type, PREPEND_ELEMENT);
      assert.equal(patches[0].element.nodeName, 'ul');
      assert.equal(patches[0].element, oldTree);
      assert.equal(patches[0].fragment.length, 1);

      assert.deepEqual(patches[0].fragment, [
        createElement('li', { key: 2 }, 'World'),
      ]);
    });

    it('can replace a single element', function() {
      var oldTree = createTreeFromMarkup(`<ul>
        <li key=1>Hello</li>
        <li key=2>World</li>
      </ul>`);
      var newTree = createTreeFromMarkup(`<ul>
        <li key=2>World</li>
      </ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 2);
      assert.equal(patches[0].type, CHANGE_TEXT);
      assert.equal(patches[1].type, REPLACE_ELEMENT);
      assert.equal(patches[1].oldTree.nodeName, 'li');
      assert.equal(patches[1].newTree.key, 2);

      assert.deepEqual(
        patches[1].newTree,
        createElement('li', { key: 2 }, 'World'),
      );
    });

    it('can remove and replace multiple elements', function() {
      var oldTree = createTreeFromMarkup(`<ul>
        <li key=1>Hello</li>
        <li key=2>World</li>
        <li key=3>!</li>
      </ul>`);
      var newTree = createTreeFromMarkup(`<ul>
        <li key=3>!</li>
      </ul>`);

      var patches = syncTree(oldTree, newTree);

      assert.equal(patches.length, 3);
      assert.equal(patches[0].type, CHANGE_TEXT);
      assert.equal(patches[1].type, REPLACE_ELEMENT);
      assert.equal(patches[1].oldTree.nodeName, 'li');

      assert.deepEqual(
        patches[1].newTree,
        createElement('li', { key: '3' }, '!'),
      );

      assert.equal(patches[2].type, REMOVE_ELEMENT);
      assert.equal(patches[2].fragment.length, 2);

      assert.deepEqual(patches[2].fragment, [
        createElement('li', { key: 2 }, 'World'),
        createElement('#text', null, '\n        '),
      ]);
    });

    it('can reuse the same element to speed up comparisons', function() {
      var oldTree = createTreeFromMarkup('<p></p>');
      var patches = syncTree(oldTree, oldTree);

      assert.equal(patches.length, 0);
    });
  });
});
