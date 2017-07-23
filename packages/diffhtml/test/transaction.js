import { ok, deepEqual, equal, doesNotThrow, throws } from 'assert';
import { spy, stub } from 'sinon';
import Transaction from '../lib/transaction';
import use from '../lib/use';
import release from '../lib/release';
import schedule from '../lib/tasks/schedule';
import endAsPromise from '../lib/tasks/end-as-promise';
import validateMemory from './util/validateMemory';

describe('Transaction', function() {
  beforeEach(() => {
    this.domNode = document.createElement('div');
    this.markup = `
      <div>Hello world</div>
    `;
    this.options = { inner: false, tasks: [spy()] };
  });

  afterEach(() => {
    release(null);
    release(this.domNode);
    validateMemory();
  });

  describe('create', () => {
    it('will return a transaction instance', () => {
      const { domNode, markup, options } = this;
      const transaction = new Transaction(domNode, markup, options);

      ok(transaction instanceof Transaction);
    });

    it('will attach relevant properties to the transaction instance', () => {
      const { domNode, markup, options } = this;
      const transaction = new Transaction(domNode, markup, options);
      const { tasks, state, endedCallbacks } = transaction;

      deepEqual(transaction, {
        domNode, markup, options, tasks, state, endedCallbacks
      });
    });
  });

  describe('flow', () => {
    it('will set up a single function to flow', () => {
      const testFn = spy();

      Transaction.flow(this, [testFn]);

      equal(testFn.calledOnce, true);
      equal(testFn.calledWith(this), true);
    });

    it('will set up multiple functions to run', () => {
      const testFn = spy();
      const testFnTwo = spy();

      Transaction.flow(this, [testFn, testFnTwo]);

      equal(testFn.calledOnce, true);
      equal(testFnTwo.calledOnce, true);
    });

    it('will abort a flow when a function returns a value', () => {
      const testFn = spy();
      const testFnTwo = stub().returns(false);
      const testFnThree = spy();

      Transaction.flow(this, [testFn, testFnTwo, testFnThree]);

      equal(testFn.calledOnce, true);
      equal(testFnTwo.calledOnce, true);
      equal(testFnThree.calledOnce, false);
    });

    it('will throw an exception if any values are not functions', () => {
      const testFn = spy();
      const testFnTwo = undefined;

      throws(() => Transaction.flow(testFn, testFnTwo)());
    });

    it('will pass initial value as arguments to all functions', () => {
      const valueOne = {};
      const valueTwo = {};
      const testFnOne = spy();
      const testFnTwo = spy();

      Transaction.flow(this, [testFnOne, testFnTwo]);

      equal(testFnOne.calledOnce, true);
      equal(testFnOne.calledWith(this), true);

      equal(testFnTwo.calledOnce, true);
      equal(testFnTwo.calledWith(this), true);
    });

    it('will force abort the flow', () => {
      const testFnOne = transaction => transaction.abort(true);
      const testFnTwo = spy();
      const testFnThree = spy();

      const transaction = Transaction.create(null, null, {
        tasks: [testFnOne, testFnTwo, testFnThree],
      });

      transaction.start();

      equal(testFnTwo.called, false);
      equal(testFnThree.calledOnce, true);
      equal(testFnThree.calledWith(transaction), true);
    });

    it('will silently abort the flow', () => {
      const testFnOne = transaction => transaction.abort(false);
      const testFnTwo = spy();
      const testFnThree = spy();

      const transaction = Transaction.create(null, null, {
        tasks: [testFnOne, testFnTwo, testFnThree],
      });

      transaction.start();

      equal(testFnTwo.called, false);
      equal(testFnThree.calledOnce, false);
      equal(testFnThree.calledWith(transaction), false);
    });
  });

  describe('assert', () => {
    it('will not error if not aborted or completd', () => {
      const { domNode, markup } = this;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(domNode, markup, { tasks });
      transaction.aborted = false;
      transaction.completed = false;
      doesNotThrow(() => transaction.start());
      transaction.end();
    });

    it('will error if a transaction has been aborted', () => {
      const { domNode, markup } = this;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(domNode, markup, { tasks });
      transaction.aborted = true;
      transaction.completed = true;
      throws(() => transaction.start());
    });

    it('will error if a transaction has been completed', () => {
      const { domNode, markup } = this;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(domNode, markup, { tasks });
      transaction.aborted = false;
      transaction.completed = true;
      throws(() => transaction.start());
    });
  });

  describe('invokeMiddleware', () => {
    it('will not modify the task flow if not provided a function', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      const middleware = spy();
      const unsubscribe = use(middleware);

      Transaction.invokeMiddleware(transaction);

      equal(transaction.tasks.length, 1);
      unsubscribe();
    });

    it('will modify the task flow if provided a function', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      const task = spy();
      const middleware = () => task;
      const unsubscribe = use(middleware);

      Transaction.invokeMiddleware(transaction);

      equal(transaction.tasks.length, 2);
      unsubscribe();
    });
  });

  describe('start', () => {
    it('will start a transaction', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      transaction.start();

      equal(transaction.tasks[0].calledOnce, true);
    });

    it('will start a transaction with middleware', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      const task = spy();
      const middleware = () => task;
      const unsubscribe = use(middleware);

      transaction.start();

      equal(transaction.tasks.length, 2);
      unsubscribe();
    });

    it('will get the return value from the flow', () => {
      const { domNode, markup } = this;
      const token = {};
      const tasks = [() => token];
      const transaction = Transaction.create(domNode, markup, { tasks });
      const returnValue = transaction.start();

      equal(returnValue, token);
    });
  });

  describe('abort', () => {
    it('will abort a transaction flow', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      transaction.start();
      const returnValue = transaction.abort();

      equal(returnValue, undefined);
      equal(transaction.aborted, true);
    });

    it('will return the last tasks return value', () => {
      const { domNode, markup } = this;
      const token = {};
      const tasks = [() => token];
      const transaction = Transaction.create(domNode, markup, { tasks });

      transaction.start();
      const returnValue = transaction.abort(true);

      equal(returnValue, token);
      equal(transaction.aborted, true);
    });
  });

  describe('end', () => {
    it('will mark the transaction as completed', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      transaction.end();

      equal(transaction.completed, true);
    });

    it('will set the state', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);

      transaction.end();

      equal(transaction.state.previousMarkup, '<div></div>');
    });

    it('will change isRendering', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);


      transaction.start();
      equal(transaction.state.isRendering, undefined);

      transaction.end();
      equal(transaction.state.isRendering, false);
    });
  });

  describe('onceEnded', () => {
    it('will register callbacks to run after ended', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);
      const fn = () => {};

      transaction.onceEnded(fn);
      equal(transaction.endedCallbacks.size, 1);
    });

    it('will trigger onceEnded callbacks', () => {
      const { domNode, markup, options } = this;
      const transaction = Transaction.create(domNode, markup, options);
      const fn = spy();

      transaction.onceEnded(fn);
      transaction.end();
      equal(fn.calledOnce, true);
    });
  });
});
