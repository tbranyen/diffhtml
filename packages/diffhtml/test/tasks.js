import { strictEqual, deepStrictEqual, notStrictEqual, throws } from 'assert';
import html from '../lib/html';
import release from '../lib/release';
import Transaction from '../lib/transaction';
import reconcileTrees from '../lib/tasks/reconcile-trees';
import schedule from '../lib/tasks/schedule';
import syncTrees from '../lib/tasks/sync-trees';
import validateMemory from './util/validate-memory';

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

      deepStrictEqual(transaction.oldTree, {
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

      deepStrictEqual(transaction.oldTree, {
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

      transaction.state.oldTree = transaction.oldTree;

      const { oldTree } = transaction;

      deepStrictEqual(oldTree, {
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

      deepStrictEqual(oldTree, secondTransaction.oldTree);
    });

    it('will upgrade the domNode if it is not the exact same as before', () => {
      const transaction = Transaction.create(this.fixture, html`<div/>`, {});

      reconcileTrees(transaction);

      transaction.state.oldTree = transaction.oldTree;

      deepStrictEqual(transaction.oldTree, {
        rawNodeName: 'DIV',
        nodeName: 'div',
        nodeValue: '',
        nodeType: 1,
        key: '',
        childNodes: [],
        attributes: {},
      });

      // Start mutation observer for changes.
      transaction.end();

      // Change the markup slightly.
      this.fixture.appendChild(document.createElement('span'));

      const secondTransaction = Transaction.create(this.fixture, html`<div/>`, {});
      reconcileTrees(secondTransaction);

      deepStrictEqual(secondTransaction.oldTree, {
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

      deepStrictEqual(transaction.newTree, {
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

      deepStrictEqual(transaction.newTree, {
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

      deepStrictEqual(transaction.newTree, {
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

  describe('schedule', () => {
    it('will mark a transaction as rendering', () => {
      const options = { inner: false };
      const transaction = Transaction.create(this.fixture, [], options);

      schedule(transaction);

      const { state } = transaction;

      strictEqual(state.isRendering, true);
      strictEqual(state.activeTransaction, transaction);
    });

    it('will make a subsequent transaction wait for an existing element', async () => {
      const options = { inner: false };
      const transaction1 = Transaction.create(this.fixture, [], options);
      const transaction2 = Transaction.create(this.fixture, [], options);
      transaction1.tasks = [];
      transaction2.tasks = [];

      // First "render".
      schedule(transaction1);

      // Second "render"
      const promise = schedule(transaction2);
      const { state } = transaction1;

      strictEqual(typeof transaction2.promise.then, 'function');
      strictEqual(state.nextTransaction, transaction2);
      strictEqual(transaction2.aborted, true);

      // Wait for the promise to complete.
      await promise;

      strictEqual(transaction2.aborted, false);
      strictEqual(state.activeTransaction, transaction2);
    });

    it('will make a new transaction wait for an existing parent element transaction', async () => {
      const options = { inner: false };
      this.child = document.createElement('div');
      this.fixture.appendChild(this.child);

      // Parent
      const transaction1 = Transaction.create(this.fixture, [], options);

      // Child
      const transaction2 = Transaction.create(this.child, [], options);

      transaction1.tasks = [];
      transaction2.tasks = [];

      // First "render" (parent)
      schedule(transaction1);

      // Second "render" (child)
      const promise = schedule(transaction2);
      const state1 = transaction1.state;
      const state2 = transaction2.state;

      // States are different per element
      notStrictEqual(state1, state2);

      strictEqual(typeof transaction2.promise.then, 'function');
      strictEqual(state1.nextTransaction, transaction2);
      strictEqual(transaction2.aborted, true);

      // Wait for the promise to complete.
      await promise;

      strictEqual(transaction2.aborted, false);
      strictEqual(state2.activeTransaction, transaction2);
    });

    it('will make a new transaction wait for an existing child element render', async () => {
      const options = { inner: false };
      this.child = document.createElement('div');
      this.fixture.appendChild(this.child);

      // Parent
      const transaction1 = Transaction.create(this.child, [], options);

      // Child
      const transaction2 = Transaction.create(this.fixture, [], options);

      transaction1.tasks = [];
      transaction2.tasks = [];

      // First "render" (parent)
      schedule(transaction1);

      // Second "render" (child)
      const promise = schedule(transaction2);
      const state1 = transaction1.state;
      const state2 = transaction2.state;

      // States are different per element
      notStrictEqual(state1, state2);

      strictEqual(typeof transaction2.promise.then, 'function');
      strictEqual(state1.nextTransaction, transaction2);
      strictEqual(transaction2.aborted, true);

      // Wait for the promise to complete.
      await promise;

      strictEqual(transaction2.aborted, false);
      strictEqual(state2.activeTransaction, transaction2);
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
