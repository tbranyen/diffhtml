import assert from 'assert';
import { spy, stub } from 'sinon';
import Transaction from '../lib/transaction';

describe('Transaction', function() {
  beforeEach(() => {
    this.domNode = document.createElement('div');
    this.markup = `
      <div>Hello world</div>
    `;
    this.options = { inner: false, tasks: [spy()] };
  });

  describe('create', () => {
    it('will return a transaction instance', () => {
      const { domNode, markup, options } = this;
      const transaction = new Transaction(domNode, markup, options);

      assert.ok(transaction instanceof Transaction);
    });

    it('will attach relevant properties to the transaction instance', () => {
      const { domNode, markup, options } = this;
      const transaction = new Transaction(domNode, markup, options);
      const { tasks, state, endedCallbacks } = transaction;

      assert.deepEqual(transaction, {
        domNode, markup, options, tasks, state, endedCallbacks
      });
    });
  });

  describe('invokeMiddleware', () => {
    it.skip('will');
  });

  describe('renderNext', () => {
    it('will render the next transaction in the queue', () => {
      const { domNode, markup, options } = this;
      const newMarkup = '<div>Next test</div>';
      const nextTransaction = { domNode, markup: newMarkup, options: {
        tasks: [spy()]
      }};

      const transaction = Transaction.create(domNode, markup, options);
      transaction.state.nextTransaction = nextTransaction;
      transaction.start();

      assert.ok(transaction instanceof Transaction);
      assert.ok(transaction.tasks[0].calledOnce);

      transaction.end();

      assert.equal(nextTransaction.options.tasks[0].calledOnce, true);
    });

    it.skip('will schedule a transaction if a previous transaction is active', () => {
      const { domNode, markup, options } = this;
      const newMarkup = '<div>Next test</div>';
      const nextTransaction = { domNode, markup: newMarkup, options: {
        tasks: [spy()]
      }};

      const transaction = Transaction.create(domNode, markup, options);
      transaction.state.nextTransaction = nextTransaction;
      transaction.start();

      assert.ok(transaction instanceof Transaction);
      assert.ok(transaction.tasks[0].calledOnce);

      transaction.end();

      assert.equal(nextTransaction.options.tasks[0].calledOnce, true);
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
      assert.doesNotThrow(() => transaction.start());
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
      assert.throws(() => transaction.start());
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
      assert.throws(() => transaction.start());
    });
  });

  describe('flow', () => {
    it('will set up a single function to flow', () => {
      const testFn = spy();

      Transaction.flow(this, [testFn]);

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFn.calledWith(this), true);
    });

    it('will set up multiple functions to run', () => {
      const testFn = spy();
      const testFnTwo = spy();

      Transaction.flow(this, [testFn, testFnTwo]);

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFnTwo.calledOnce, true);
    });

    it('will abort a flow when a function returns a value', () => {
      const testFn = spy();
      const testFnTwo = stub().returns(false);
      const testFnThree = spy();

      Transaction.flow(this, [testFn, testFnTwo, testFnThree]);

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFnTwo.calledOnce, true);
      assert.equal(testFnThree.calledOnce, false);
    });

    it('will throw an exception if any values are not functions', () => {
      const testFn = spy();
      const testFnTwo = undefined;

      assert.throws(() => Transaction.flow(testFn, testFnTwo)());
    });

    it('will pass initial value as arguments to all functions', () => {
      const valueOne = {};
      const valueTwo = {};
      const testFnOne = spy();
      const testFnTwo = spy();

      Transaction.flow(this, [testFnOne, testFnTwo]);

      assert.equal(testFnOne.calledOnce, true);
      assert.equal(testFnOne.calledWith(this), true);

      assert.equal(testFnTwo.calledOnce, true);
      assert.equal(testFnTwo.calledWith(this), true);
    });

    it('will abort the flow', () => {
      const testFnOne = transaction => transaction.abort();
      const testFnTwo = spy();
      const testFnThree = spy();

      const transaction = Transaction.create(null, null, {
        tasks: [testFnOne, testFnTwo, testFnThree],
      });

      transaction.start();

      assert.equal(testFnTwo.called, false);
      assert.equal(testFnThree.calledOnce, true);
      assert.equal(testFnThree.calledWith(transaction), true);
    });
  });

  describe('start', () => {
    it.skip('will start', () => {});

    //start() {
    //  Transaction.assert(this);

    //  const { domNode, state: { measure }, tasks } = this;
    //  const takeLastTask = tasks.pop();

    //  this.aborted = false;

    //  // Add middleware in as tasks.
    //  Transaction.invokeMiddleware(this);

    //  // Measure the render flow if the user wants to track performance.
    //  measure('render');

    //  // Push back the last task as part of ending the flow.
    //  tasks.push(takeLastTask);

    //  return Transaction.flow(this, tasks);
    //}
  });

  describe.skip('abort', () => {
    //const { state } = this;

    //this.aborted = true;

    //// Grab the last task in the flow and return, this task will be responsible
    //// for calling `transaction.end`.
    //return this.tasks[this.tasks.length - 1](this);
  });

  describe.skip('end', () => {
    //const { state, domNode, options } = this;
    //const { measure } = state;
    //const { inner } = options;

    //this.completed = true;

    //let renderScheduled = false;

    //StateCache.forEach(cachedState => {
    //  if (cachedState.isRendering && cachedState !== state) {
    //    renderScheduled = true;
    //  }
    //});

    //// Don't attempt to clean memory if in the middle of another render.
    //if (!renderScheduled) {
    //  cleanMemory();
    //}

    //// Mark the end to rendering.
    //measure('finalize');
    //measure('render');

    //// Cache the markup and text for the DOM node to allow for short-circuiting
    //// future render transactions.
    //state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
    //state.previousText = domNode.textContent;

    //// Trigger all `onceEnded` callbacks, so that middleware can know the
    //// transaction has ended.
    //this.endedCallbacks.forEach(callback => callback(this));
    //this.endedCallbacks.clear();

    //// We are no longer rendering the previous transaction so set the state to
    //// `false`.
    //state.isRendering = false;

    //// Try and render the next transaction if one has been saved.
    //Transaction.renderNext(state);

    //return this;
  });

  describe.skip('onceEnded', () => {
    //this.endedCallbacks.add(callback);
  });
});
