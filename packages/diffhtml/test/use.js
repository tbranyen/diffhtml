import { equal, throws } from 'assert';
import { html, innerHTML, outerHTML, use, release } from '../lib/index';
import validateMemory from './util/validateMemory';

const { assign } = Object;

describe('Use (Middleware)', function() {
  beforeEach(() => {
    this.unsubscribe = use(assign(() => {}, {
      syncTreeHook: (...args) => {
        if (this.syncTreeHook) {
          return this.syncTreeHook.apply(this, args);
        }
      }
    }));
  });

  afterEach(() => {
    this.unsubscribe();
    validateMemory();
  });

  it('will error if a value is passed that is not a function', () => {
    throws(() => use());
    throws(() => use(null));
    throws(() => use(undefined));
    throws(() => use(0));
    throws(() => use(NaN));
    throws(() => use(false));
    throws(() => use({}));
    throws(() => use([]));
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
});
