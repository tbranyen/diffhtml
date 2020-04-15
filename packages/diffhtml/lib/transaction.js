import { StateCache, MiddlewareCache } from './util/caches';
import { gc } from './util/memory';
import makeMeasure from './util/make-measure';
import process from './util/process';
import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import reconcileTrees from './tasks/reconcile-trees';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';
import { VTree, VTreeLike, ValidInput, Mount, Options } from './util/types';

export const defaultTasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
];

export const tasks = {
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise
};

export default class Transaction {
  /**
   *
   * @param {Mount} domNode
   * @param {ValidInput} input
   * @param {*} options
   */
  static create(domNode, input, options) {
    return new Transaction(domNode, input, options);
  }

  /**
   * @param {Transaction} transaction
   * @param {any} tasks
   *
   * @return {Promise<Transaction> | unknown}
   */
  static flow(transaction, tasks) {
    let retVal = transaction;

    // Execute each "task" serially, passing the transaction as a baton that
    // can be used to share state across the tasks.
    for (let i = 0; i < tasks.length; i++) {
      // If aborted, don't execute any more tasks.
      if (transaction.aborted) {
        return retVal;
      }

      // Run the task.
      retVal = tasks[i](transaction);

      // The last `returnValue` is what gets sent to the consumer. This
      // mechanism is crucial for the `abort`, if you want to modify the "flow"
      // that's fine, but you must ensure that your last task provides a
      // mechanism to know when the transaction completes. Something like
      // callbacks or a Promise.
      if (retVal !== undefined && retVal !== transaction) {
        return retVal;
      }
    }

    return retVal;
  }

  /**
   *
   * @param {Transaction} transaction
   */
  static assert(transaction) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof transaction.domNode !== 'object' || !transaction.domNode) {
        throw new Error('Transaction requires a DOM Node mount point');
      }

      if (transaction.aborted && transaction.completed) {
        throw new Error('Transaction was previously aborted');
      }

      if (transaction.completed) {
        throw new Error('Transaction was previously completed');
      }
    }
  }

  /**
   *
   * @param {Transaction} transaction
   */
  static invokeMiddleware(transaction) {
    const { tasks } = transaction;

    MiddlewareCache.forEach(fn => {
      // Invoke all the middleware passing along this transaction as the only
      // argument. If they return a value (must be a function) it will be added
      // to the transaction task flow.
      const result = fn(transaction);

      if (result) {
        tasks.push(result);
      }
    });
  }

  /**
   * @constructor
   * @param {Mount} domNode
   * @param {ValidInput} input
   * @param {Options} options
   */
  constructor(domNode, input, options) {
    this.domNode = domNode;
    // TODO: Rename this to input.
    this.markup = input;
    this.options = options;

    this.state = StateCache.get(domNode) || {
      measure: makeMeasure(domNode, input),
    };

    if (options.tasks && options.tasks.length) {
      this.tasks = [...options.tasks];
    }

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  /**
   * @return {Promise<Transaction> | unknown}
   */
  start() {
    if (process.env.NODE_ENV !== 'production') {
      Transaction.assert(this);
    }

    const { state: { measure }, tasks } = this;
    const takeLastTask = tasks.pop();

    this.aborted = false;

    // Add middleware in as tasks.
    Transaction.invokeMiddleware(this);

    // Measure the render flow if the user wants to track performance.
    measure('render');

    // Push back the last task as part of ending the flow.
    takeLastTask && tasks.push(takeLastTask);

    return Transaction.flow(this, tasks);
  }

  /**
   * This will immediately call the last flow task and terminate the flow. We
   * call the last task to ensure that the control flow completes. This should
   * end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
   * `return someValue` to provide the most accurate performance reading. This
   * doesn't matter practically besides that.
   *
   * @param {boolean=} isReturn
   */
  abort(isReturn) {
    this.aborted = true;

    // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.
    if (isReturn) {
      return this.tasks[this.tasks.length - 1](this);
    }
  }

  /**
   * @return {Transaction}
   */
  end() {
    const { state, domNode } = this;
    const { measure } = state;

    measure('finalize');

    this.completed = true;

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.
    state.previousMarkup = 'outerHTML' in /** @type {any} */ (domNode) ? domNode.outerHTML : '';

    // Rendering is complete.
    state.isRendering = false;

    // Clean up memory before rendering the next transaction, however if
    // another transaction is running concurrently this will be delayed until
    // the last render completes.
    gc();

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    return this;
  }

  /**
   * @param {Function} callback
   */
  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }

  /** @type {Mount} */
  domNode = '';

  /** @type {ValidInput} */
  markup = '';

  /** @type {VTree=} */
  oldTree = undefined;

  /** @type {VTree=} */
  newTree = undefined;

  /** @type {Promise<any>=} */
  promise = undefined

  /** @type {Promise<any>[]=} */
  promises = undefined

  /** @type {Function[]} */
  tasks = []

  /** @type any */
  patches = []
}
