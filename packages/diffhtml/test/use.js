import { equal, deepEqual, throws } from 'assert';
import { html, innerHTML, outerHTML, use, release, createTree, Internals } from '../lib/index';
import validateMemory from './util/validate-memory';

describe('Use (Middleware)', function() {
  beforeEach(() => {
    this.unsubscribe = use({
      createNodeHook: (...args) => {
        if (this.createNodeHook) {
          return this.createNodeHook(...args);
        }
      },

      createTreeHook: (...args) => {
        if (this.createTreeHook) {
          return this.createTreeHook(...args);
        }
      },

      syncTreeHook: (...args) => {
        if (this.syncTreeHook) {
          return this.syncTreeHook(...args);
        }
      },

      releaseHook: (...args) => {
        if (this.releaseHook) {
          return this.releaseHook(...args);
        }
      },
    });
  });

  afterEach(() => {
    this.createNodeHook = undefined;
    this.createTreeHook = undefined;
    this.syncTreeHook = undefined;
    this.releaseHook = undefined;
    this.unsubscribe();
    validateMemory();
  });

  it('will error if a value is passed that is not a function or object', () => {
    throws(() => use());
    throws(() => use(null));
    throws(() => use(undefined));
    throws(() => use(0));
    throws(() => use(NaN));
    throws(() => use(false));
    throws(() => use([]));
  });

  it('will call subscribe', () => {
  });

  it('will call unsubscribe', () => {
  });

  it('will allow swapping out what node gets created', () => {
    const domNode = document.createElement('div');
    const span = document.createElement('span');

    this.createNodeHook = ({ nodeName, attributes }) => {
      if (nodeName === 'div') {
        return span;
      }
    };

    innerHTML(domNode, html`
      <div></div>
    `);

    equal(domNode.innerHTML.trim(), '<span></span>');
    equal(domNode.childNodes[1], span);

    release(domNode);
  });

  it('will allow modifying a vTree during creation', () => {
    const Fn = ({ message }) => html`<marquee>${message}</marquee>`;
    const domNode = document.createElement('div');

    let i = 0;

    this.createTreeHook = ({ rawNodeName, attributes }) => {
      if (i === 4) {
        return;
      }

      if (typeof rawNodeName === 'function') {
        i++;
        return rawNodeName(attributes);
      }
    };

    innerHTML(domNode, html`
      <${Fn} message="Hello world" />
    `);

    equal(domNode.outerHTML, `<div>
      <marquee>Hello world</marquee>
    </div>`);

    release(domNode);
  });

  it('will allow modifying a nested vTree during creation', () => {
    this.createTreeHook = vTree => {
      if (typeof vTree.rawNodeName === 'function') {
        return vTree.rawNodeName(vTree.attributes);
      }
    };

    const Fn = ({ message }) => html`<marquee>${message}</marquee>`;

    const domNode = document.createElement('div');
    const newTree = html`<div><${Fn} message="Hello world" /></div>`;

    innerHTML(domNode, newTree);

    equal(domNode.outerHTML, `<div><div><marquee>Hello world</marquee></div></div>`);

    release(domNode);
  });

  it('will allow modifying the newTree during sync', () => {
    const oldTree = document.createElement('div');
    const newTree = html`<div class="test" />`;

    this.syncTreeHook = () => {
      newTree.attributes['data-track'] = 'some-new-value';
    };

    innerHTML(oldTree, newTree);

    equal(oldTree.outerHTML, `<div><div class="test" data-track="some-new-value"></div></div>`);

    release(oldTree);
  });

  it('will allow replacing the newTree during sync', () => {
    const oldTree = document.createElement('div');
    const newTree = html`<div class="test" />`;

    this.syncTreeHook = (oldTree, newTree) => {
      newTree.childNodes.forEach((childNode, i) => {
        if (childNode.attributes.class === 'test') {
          newTree.childNodes[i] =  html`<div data-track="some-new-value" />`;
        }
      });
    };

    innerHTML(oldTree, newTree);

    equal(oldTree.innerHTML, `<div data-track="some-new-value"></div>`);

    release(oldTree);
  });

  it('will allow blackboxing an existing tree to avoid diffing', () => {
    const oldTree = document.createElement('div');
    const newTree = html`<div class="test" />`;

    this.syncTreeHook = (oldTree, newTree) => {
      if (newTree.attributes.class === 'test') {
        return oldTree;
      }
    };

    outerHTML(oldTree, newTree);

    equal(oldTree.outerHTML, `<div></div>`);

    release(oldTree);
  });

  it('will not diff children during blackboxing using a key', () => {
    const oldTree = document.createElement('div');

    // Issue with text element during diff, this test will pass if the whitespace
    // is removed.
    oldTree.innerHTML = `
      <h1>Updates</h1>
      <span key="immutable">Does not update: ever</span>
    `;

    this.syncTreeHook = (oldTree, newTree) => {
      return newTree.nodeName === 'span' ? oldTree : undefined;
    };

    innerHTML(oldTree, html`
      <h1>Updates</h1>
      <span key="immutable">Does not update: ${new Date().getSeconds()}</span>
    `);

    equal(oldTree.innerHTML, `
      <h1>Updates</h1>
      <span key="immutable">Does not update: ever</span>
    `);

    release(oldTree);
  });

  it('will not diff children during blackboxing', () => {
    const oldTree = document.createElement('div');

    // Issue with text element during diff, this test will pass if the whitespace
    // is removed.
    oldTree.innerHTML = `
      <h1>Updates</h1>
      <span>Does not update: ever</span>
    `;

    this.syncTreeHook = (oldTree, newTree) => {
      return newTree.nodeName === 'span' ? oldTree : undefined;
    };

    innerHTML(oldTree, html`
      <h1>Updates</h1>
      <span>Does not update: ${new Date().getSeconds()}</span>
    `);

    equal(oldTree.innerHTML, `
      <h1>Updates</h1>
      <span>Does not update: ever</span>
    `);

    release(oldTree);
  });

  it('will call a release hook when an element is released', () => {
    const domNode = document.createElement('div');
    const releaseTrees = [];

    this.releaseHook = oldTree => releaseTrees.push(oldTree);

    const newTree = html`<h1>Updates</h1>`;
    innerHTML(domNode, newTree);

    let oldTree = null;

    Internals.NodeCache.forEach((value, vTree) => {
      if (value === domNode) {
        oldTree = vTree;
      }
    });

    release(domNode);

    equal(releaseTrees.length, 3);
    deepEqual(releaseTrees, [
      newTree.childNodes[0],
      newTree,
      oldTree,
    ]);
  });
});
