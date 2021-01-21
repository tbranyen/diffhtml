import { ok, deepEqual, equal, doesNotThrow, throws } from 'assert';
import { spy, stub, SinonSpy } from 'sinon';
import Transaction from '../lib/transaction';
import use from '../lib/use';
import release from '../lib/release';
import validateMemory from './util/validate-memory';

describe('Transaction', function() {
  const suite = /** @type {any} */(this);

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    suite.domNode = document.createElement('div');
    suite.input = `
      <div>Hello world</div>
    `;
    suite.options = { inner: false, tasks: [spy()] };
  });

  afterEach(() => {
    release(suite.domNode);
    validateMemory();
  });

  describe('create', () => {
    it('will return a transaction instance', () => {
      const { domNode, input, options } = suite;
      const transaction = new Transaction(domNode, input, options);

      ok(transaction instanceof Transaction);
    });

    it('will attach relevant properties to the transaction instance', () => {
      const { domNode, input, options } = suite;
      const transaction = new Transaction(domNode, input, options);
      const { tasks, state, endedCallbacks } = transaction;

      deepEqual(transaction, {
        // Public.
        domNode,
        input,
        options,
        tasks,
        state,
        endedCallbacks,

        // Private
        newTree: undefined,
        oldTree: undefined,
        patches: [],
        promise: undefined,
        promises: undefined,
      });
    });
  });

  describe('flow', () => {
    it('will set up a single function to flow', () => {
      const testFn = spy();

      Transaction.flow(suite, [testFn]);

      equal(testFn.calledOnce, true);
      equal(testFn.calledWith(this), true);
    });

    it('will set up multiple functions to run', () => {
      const testFn = spy();
      const testFnTwo = spy();

      Transaction.flow(suite, [testFn, testFnTwo]);

      equal(testFn.calledOnce, true);
      equal(testFnTwo.calledOnce, true);
    });

    it('will abort a flow when a function returns a value', () => {
      const testFn = spy();
      const testFnTwo = stub().returns(false);
      const testFnThree = spy();

      Transaction.flow(suite, [testFn, testFnTwo, testFnThree]);

      equal(testFn.calledOnce, true);
      equal(testFnTwo.calledOnce, true);
      equal(testFnThree.calledOnce, false);
    });

    it('will throw an exception if any values are not functions', () => {
      const testFn = spy();
      const testFnTwo = undefined;
      const InvalidTransaction = /** @type {any} */ (Transaction);

      throws(() => InvalidTransaction.flow(testFn, testFnTwo)());
    });

    it('will pass initial value as arguments to all functions', () => {
      const testFnOne = spy();
      const testFnTwo = spy();

      Transaction.flow(suite, [testFnOne, testFnTwo]);

      equal(testFnOne.calledOnce, true);
      equal(testFnOne.calledWith(this), true);

      equal(testFnTwo.calledOnce, true);
      equal(testFnTwo.calledWith(this), true);
    });

    it('will force abort the flow, the last task will still execute', () => {
      const testFnOne = transaction => transaction.abort(true);
      const testFnTwo = spy();
      const testFnThree = spy();

      const transaction = Transaction.create(suite.domNode, null, {
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

      const transaction = Transaction.create(suite.domNode, null, {
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
      const { domNode, input } = suite;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(domNode, input, { tasks });
      transaction.aborted = false;
      transaction.completed = false;
      doesNotThrow(() => transaction.start());
      transaction.end();
    });

    it('will error if a transaction has been aborted', () => {
      const { domNode, input } = suite;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(domNode, input, { tasks });
      transaction.aborted = true;
      transaction.completed = true;
      throws(() => transaction.start());
    });

    it('will error if a transaction has been completed', () => {
      const { domNode, input } = suite;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(domNode, input, { tasks });
      transaction.aborted = false;
      transaction.completed = true;
      throws(() => transaction.start());
    });
  });

  describe('invokeMiddleware', () => {
    it('will not modify the task flow if not provided a function', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      /** @type {unknown} */
      const middleware = spy();
      const unsubscribe = use(middleware);

      Transaction.invokeMiddleware(transaction);

      equal(transaction.tasks.length, 1);
      unsubscribe();
    });

    it('will modify the task flow if provided a function', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      const task = spy();

      /** @type {unknown} */
      const middleware = () => task;
      const unsubscribe = use(middleware);

      Transaction.invokeMiddleware(transaction);

      equal(transaction.tasks.length, 2);
      unsubscribe();
    });
  });

  describe('start', () => {
    it('will not error in production if trying to start a transaction without a dom node', () => {
      process.env.NODE_ENV = 'production';
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.domNode = null;

      doesNotThrow(() => {
        transaction.start();
      });
    });

    it('will error in development if trying to start a transaction without a dom node', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.domNode = null;

      throws(() => {
        transaction.start();
      }, / /);
    });
    it('will error in development if trying to start a transaction without a dom node', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.domNode = null;

      throws(() => {
        transaction.start();
      }, / /);
    });

    it('will start a transaction', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.start();

      const firstTask = /** @type {SinonSpy} */ (transaction.tasks[0]);

      equal(firstTask.calledOnce, true);
    });

    it('will start a transaction with middleware', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      const task = spy();

      /** @type {unknown} */
      const middleware = () => task;
      const unsubscribe = use(middleware);

      transaction.start();

      equal(transaction.tasks.length, 2);
      unsubscribe();
    });

    it('will get the return value from the flow', async () => {
      const { domNode, input } = suite;
      const token = {};
      const tasks = [() => token];
      const transaction = Transaction.create(domNode, input, { tasks });
      const returnValue = await transaction.start();

      equal(returnValue, token);
    });
  });

  describe('abort', () => {
    it('will abort a transaction flow', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.start();
      const returnValue = transaction.abort();

      equal(returnValue, undefined);
      equal(transaction.aborted, true);
    });

    it('will return the last tasks return value', () => {
      const { domNode, input } = suite;
      const token = {};
      const tasks = [() => token];
      const transaction = Transaction.create(domNode, input, { tasks });

      transaction.start();
      const returnValue = transaction.abort(true);

      equal(returnValue, token);
      equal(transaction.aborted, true);
    });
  });

  describe('end', () => {
    it('will mark the transaction as completed', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.end();

      equal(transaction.completed, true);
    });

    it('will set the state', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);

      transaction.end();

      equal(transaction.state.previousMarkup, '<div></div>');
    });

    it('will change isRendering', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);


      transaction.start();
      equal(transaction.state.isRendering, undefined);

      transaction.end();
      equal(transaction.state.isRendering, false);
    });
  });

  describe('onceEnded', () => {
    it('will register callbacks to run after ended', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);
      const fn = () => {};

      transaction.onceEnded(fn);
      equal(transaction.endedCallbacks.size, 1);
    });

    it('will trigger onceEnded callbacks', () => {
      const { domNode, input, options } = suite;
      const transaction = Transaction.create(domNode, input, options);
      const fn = spy();

      transaction.onceEnded(fn);
      transaction.end();
      equal(fn.calledOnce, true);
    });
  });
});
