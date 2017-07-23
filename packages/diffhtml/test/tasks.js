import { equal, deepEqual, throws } from 'assert';
import html from '../lib/html';
import release from '../lib/release';
import Transaction from '../lib/transaction';
import reconcileTrees from '../lib/tasks/reconcile-trees';
import syncTrees from '../lib/tasks/sync-trees';
import validateMemory from './util/validateMemory';

describe('Tasks', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
  });

  afterEach(() => {
    release(this.fixture);
    validateMemory();
  });

  describe('reconcileTrees', () => {
    it('will upgrade the domNode to a Virtual Tree', () => {
      const transaction = Transaction.create(this.fixture, html`<div/>`, {});

      reconcileTrees(transaction);

      deepEqual(transaction.oldTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      });
    });

    it('will upgrade a document fragment to a Virtual Tree', () => {
      const fragment = document.createDocumentFragment();
      const transaction = Transaction.create(fragment, '<div/>', {});

      reconcileTrees(transaction);

      deepEqual(transaction.oldTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [],
        attributes: {},
      });

      release(fragment);
    });

    it('will not upgrade the domNode if it is the exact same as before', () => {
      const transaction = Transaction.create(this.fixture, html`<div/>`, {});

      reconcileTrees(transaction);

      transaction.state.previousMarkup = this.fixture.outerHTML;
      transaction.state.oldTree = transaction.oldTree;

      const { oldTree } = transaction;

      deepEqual(oldTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      });

      const secondTransaction = Transaction.create(this.fixture, html`<div/>`, {});

      reconcileTrees(secondTransaction);

      equal(oldTree, secondTransaction.oldTree);
    });

    it('will upgrade the domNode if it is not the exact same as before', () => {
      const transaction = Transaction.create(this.fixture, html`<div/>`, {});

      reconcileTrees(transaction);

      transaction.state.previousMarkup = this.fixture.outerHTML;
      transaction.state.oldTree = transaction.oldTree;

      // Change the markup slightly.
      this.fixture.appendChild(document.createElement('span'));

      const { oldTree } = transaction;

      deepEqual(oldTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      });

      const secondTransaction = Transaction.create(this.fixture, html`<div/>`, {});

      reconcileTrees(secondTransaction);

      deepEqual(secondTransaction.oldTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [{
          attributes: {},
          childNodes: [],
          key: '',
          nodeName: 'span',
          nodeType: 1,
          nodeValue: '',
          rawNodeName: 'SPAN',
        }],
        attributes: {},
      });
    });

    it('will upgrade a component and bring over attributes', () => {
      function Component() {}

      const component = html`<${Component} test="true" />`;
      const transaction = Transaction.create(this.fixture, component, {});

      reconcileTrees(transaction);

      deepEqual(transaction.newTree, {
        rawNodeName: Component,
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [],
        attributes: {
          test: 'true',
        },
      });
    });

    it('will upgrade an array literal to a fragment (innerHTML)', () => {
      const children = [
        html`<div>Hello world</div>`,
        html`<span>Cool</span>`,
      ];

      const options = { inner: true };
      const transaction = Transaction.create(this.fixture, children, options);

      reconcileTrees(transaction);

      deepEqual(transaction.newTree, {
        rawNodeName: 'div',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: children,
        attributes: {},
      });
    });

    it('will upgrade an array literal to a fragment (outerHTML)', () => {
      const children = [
        html`<div>Hello world</div>`,
        html`<span>Cool</span>`,
      ];

      const options = { inner: false };
      const transaction = Transaction.create(this.fixture, children, options);

      reconcileTrees(transaction);

      deepEqual(transaction.newTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: children,
        attributes: {},
      });
    });
  });

  describe('syncTrees', () => {
    it('will error if patches passed is not an array', () => {
      throws(() => syncTrees(null, null, 5));
    });

    it('will error if oldTree is missing', () => {
      throws(() => syncTrees(null));
    });
  });
});
