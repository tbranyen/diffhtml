import { spy, stub } from 'sinon';
import Transaction from '../../lib/transaction';

describe('Unit: Transaction', function() {
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
  });

  describe('renderNext', () => {
    it('can render the next transaction in the queue', () => {
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

    });
  });

  describe('assert', () => {
    it('can assert if a transaction has been aborted', () => {
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

    it('can assert if a transaction has been completed', () => {
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
    it('can set up a single function to flow', () => {
      const testFn = spy();

      Transaction.flow(this, [testFn]);

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFn.calledWith(this), true);
    });

    it('can set up multiple functions to run', () => {
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

    it('can abort the flow', () => {
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
});
