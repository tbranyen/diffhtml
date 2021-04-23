import { equal, deepEqual, throws } from 'assert';
import { html, innerHTML, outerHTML, use, release, Internals } from '../lib/index';
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

  it('will allow modifying a vTree when created from a DOM Node', () => {
    const domNode = document.createElement('div');

    this.createTreeHook = ({ nodeName, attributes }) => {
      if (nodeName === 'span') {
        attributes.label = 'modified';
      }
    };

    const span = document.createElement('span');

    innerHTML(domNode, html`<${span} label="Hello world" />`);
    equal(domNode.outerHTML, `<div><span label="modified"></span></div>`);
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

  it('will allow sandboxing an existing tree to avoid diffing', () => {
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

  it('will reconcile the new dom when the same markup is used', () => {
    const fixture = document.createElement('div');

    innerHTML(fixture, '<p><span></span></p>');

    fixture.querySelector('p').innerHTML = fixture.querySelector('p').innerHTML;

    innerHTML(fixture, '<p></p><p><span></span></p>');

    equal(fixture.outerHTML, '<div><p></p><p><span></span></p></div>');

    release(fixture);
  });

  it('will ignoring a dynamically added DOM Node to avoid diffing', () => {
    const fixture = document.createElement('div');

    innerHTML(fixture, '<p></p>');

    // End user is responsible for knowing what to ignore
    const elements = new Set();

    const marquee1 = document.createElement('marquee');
    const marquee2 = document.createElement('marquee');
    elements.add(marquee1);
    elements.add(marquee2);

    // Add untracked elements before and after rendered nodes
    fixture.appendChild(marquee1);
    fixture.insertBefore(marquee2, fixture.firstChild);

    let protect = true;

    // Do not compare dynamically added elements.
    this.syncTreeHook = oldTree => {
      // If this element was added by the end user, skip comparisons.
      if (protect && elements.has(Internals.NodeCache.get(oldTree))) {
        return false;
      }
    };

    innerHTML(fixture, '<p></p><span></span>');

    equal(fixture.innerHTML, `<marquee></marquee><p></p><marquee></marquee><span></span>`);

    innerHTML(fixture, '<p></p>');
    equal(fixture.innerHTML, `<marquee></marquee><p></p><marquee></marquee>`);

    protect = false;

    innerHTML(fixture, '<p></p>');
    equal(fixture.innerHTML, `<p></p>`);

    release(fixture);
  });

  it('will not diff children while sandboxing using a key', () => {
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

  it('will not diff children while sandboxing', () => {
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

  it('will call a release hook when a mounted element is released', async () => {
    const domNode = document.createElement('div');
    const releaseTrees = [];

    this.releaseHook = oldTree => releaseTrees.push(oldTree);

    const newTree = html`<h1></h1>`;
    const transaction = await innerHTML(domNode, newTree);
    const oldTree = transaction.oldTree;

    release(domNode);

    equal(releaseTrees.length, 2);
    deepEqual(releaseTrees, [
      newTree,
      oldTree,
    ]);
  });

  it('will call a release hook when an element is released', () => {
    const domNode = document.createElement('div');
    const releaseTrees = [];

    this.releaseHook = oldTree => releaseTrees.push(oldTree);

    const newTree = html`<h1>Updates</h1>`;
    const newFirstElement = newTree.childNodes[0];
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
      newFirstElement,
      newTree,
      oldTree,
    ]);
  });
});
