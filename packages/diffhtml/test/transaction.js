import { ok, deepStrictEqual, strictEqual, doesNotThrow, throws } from 'assert';
import { spy, stub, SinonSpy } from 'sinon';
import Transaction from '../lib/transaction';
import use from '../lib/use';
import release from '../lib/release';
import validateMemory from './util/validate-memory';
import { EMPTY } from '../lib/util/types';

describe('Transaction', function() {
  const suite = /** @type {any} */(this);

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    suite.mount = document.createElement('div');
    suite.input = `
      <div>Hello world</div>
    `;
    suite.config = { inner: false, tasks: [spy()] };
  });

  afterEach(() => {
    release(suite.mount);
    validateMemory();
  });

  describe('create', () => {
    it('will return a transaction instance', () => {
      const { mount, input, config } = suite;
      const transaction = new Transaction(mount, input, config);

      ok(transaction instanceof Transaction);
    });

    it('will attach relevant properties to the transaction instance', () => {
      const { mount, input, config } = suite;
      const transaction = new Transaction(mount, input, config);
      const { tasks, state, endedCallbacks } = transaction;

      deepStrictEqual({ ...transaction }, {
        // Public.
        mount,
        input,
        config,
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

      strictEqual(testFn.calledOnce, true);
      strictEqual(testFn.calledWith(this), true);
    });

    it('will set up multiple functions to run', () => {
      const testFn = spy();
      const testFnTwo = spy();

      Transaction.flow(suite, [testFn, testFnTwo]);

      strictEqual(testFn.calledOnce, true);
      strictEqual(testFnTwo.calledOnce, true);
    });

    it('will abort a flow when a function returns a value', () => {
      const testFn = spy();
      const testFnTwo = stub().returns(false);
      const testFnThree = spy();

      Transaction.flow(suite, [testFn, testFnTwo, testFnThree]);

      strictEqual(testFn.calledOnce, true);
      strictEqual(testFnTwo.calledOnce, true);
      strictEqual(testFnThree.calledOnce, false);
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

      strictEqual(testFnOne.calledOnce, true);
      strictEqual(testFnOne.calledWith(this), true);

      strictEqual(testFnTwo.calledOnce, true);
      strictEqual(testFnTwo.calledWith(this), true);
    });

    it('will force abort the flow, the last task will still execute', () => {
      const testFnOne = transaction => transaction.abort(true);
      const testFnTwo = spy();
      const testFnThree = spy();

      const transaction = Transaction.create(suite.mount, null, {
        tasks: [testFnOne, testFnTwo, testFnThree],
      });

      transaction.start();

      strictEqual(testFnTwo.called, false);
      strictEqual(testFnThree.calledOnce, true);
      strictEqual(testFnThree.calledWith(transaction), true);
    });

    it('will silently abort the flow', () => {
      const testFnOne = transaction => transaction.abort(false);
      const testFnTwo = spy();
      const testFnThree = spy();

      const transaction = Transaction.create(suite.mount, null, {
        tasks: [testFnOne, testFnTwo, testFnThree],
      });

      transaction.start();

      strictEqual(testFnTwo.called, false);
      strictEqual(testFnThree.calledOnce, false);
      strictEqual(testFnThree.calledWith(transaction), false);
    });
  });

  describe('assert', () => {
    it('will not error if not aborted or completd', () => {
      const { mount, input } = suite;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(mount, input, { tasks });
      transaction.aborted = false;
      transaction.completed = false;
      doesNotThrow(() => transaction.start());
      transaction.end();
    });

    it('will error if a transaction has been aborted', () => {
      const { mount, input } = suite;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(mount, input, { tasks });
      transaction.aborted = true;
      transaction.completed = true;
      throws(() => transaction.start());
    });

    it('will error if a transaction has been completed', () => {
      const { mount, input } = suite;
      const tasks = [
        transaction => transaction.abort(),
        spy(),
      ];

      const transaction = Transaction.create(mount, input, { tasks });
      transaction.aborted = false;
      transaction.completed = true;
      throws(() => transaction.start());
    });
  });

  describe('invokeMiddleware', () => {
    it('will not modify the task flow if not provided a function', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      /** @type {unknown} */
      const middleware = spy();
      const unsubscribe = use(middleware);

      Transaction.invokeMiddleware(transaction);

      strictEqual(transaction.tasks.length, 1);
      unsubscribe();
    });

    it('will modify the task flow if provided a function', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      const task = spy();

      /** @type {unknown} */
      const middleware = () => task;
      const unsubscribe = use(middleware);

      Transaction.invokeMiddleware(transaction);

      strictEqual(transaction.tasks.length, 2);
      unsubscribe();
    });
  });

  describe('start', () => {
    it('will not error in production if trying to start a transaction without a dom node', () => {
      process.env.NODE_ENV = 'production';
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      transaction.mount = null;

      doesNotThrow(() => {
        transaction.start();
      });
    });

    it('will error in development if trying to start a transaction without a dom node', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      transaction.mount = null;

      throws(() => {
        transaction.start();
      }, / /);
    });
    it('will error in development if trying to start a transaction without a dom node', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      transaction.mount = null;

      throws(() => {
        transaction.start();
      }, / /);
    });

    it('will start a transaction', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      transaction.start();

      const firstTask = /** @type {SinonSpy} */ (transaction.tasks[0]);

      strictEqual(firstTask.calledOnce, true);
    });

    it('will start a transaction with middleware', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      const task = spy();

      /** @type {unknown} */
      const middleware = () => task;
      const unsubscribe = use(middleware);

      transaction.start();

      strictEqual(transaction.tasks.length, 2);
      unsubscribe();
    });

    it('will get the return value from the flow', async () => {
      const { mount, input } = suite;
      const token = {};
      const tasks = [() => token];
      const transaction = Transaction.create(mount, input, { tasks });
      const returnValue = await transaction.start();

      strictEqual(returnValue, token);
    });
  });

  describe('abort', () => {
    it('will abort a transaction flow', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      transaction.start();
      const returnValue = transaction.abort();

      strictEqual(returnValue, undefined);
      strictEqual(transaction.aborted, true);
    });

    it('will return the last tasks return value', () => {
      const { mount, input } = suite;
      const token = {};
      const tasks = [() => token];
      const transaction = Transaction.create(mount, input, { tasks });

      transaction.start();
      const returnValue = transaction.abort(true);

      strictEqual(returnValue, token);
      strictEqual(transaction.aborted, true);
    });
  });

  describe('end', () => {
    it('will mark the transaction as completed', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);

      transaction.end();

      strictEqual(transaction.completed, true);
    });

    it('will change isRendering', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);


      transaction.start();
      strictEqual(transaction.state.isRendering, undefined);

      transaction.end();
      strictEqual(transaction.state.isRendering, false);
    });
  });

  describe('onceEnded', () => {
    it('will register callbacks to run after ended', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);
      const fn = () => {};

      transaction.onceEnded(fn);
      strictEqual(transaction.endedCallbacks.size, 1);
    });

    it('will trigger onceEnded callbacks', () => {
      const { mount, input, config } = suite;
      const transaction = Transaction.create(mount, input, config);
      const fn = spy();

      transaction.onceEnded(fn);
      transaction.end();
      strictEqual(fn.calledOnce, true);
    });
  });
});
