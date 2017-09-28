import { StateCache, MiddlewareCache } from './util/caches';
import { cleanMemory, protectVTree } from './util/memory';
import makeMeasure from './util/make-measure';
import process from './util/process';
import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import reconcileTrees from './tasks/reconcile-trees';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';

export const defaultTasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
];

export const tasks = {
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise
};

export default class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

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
  }

  static assert(transaction) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof transaction.domNode !== 'object') {
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

  constructor(domNode, markup, options) {
    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = StateCache.get(domNode) || {
      measure: makeMeasure(domNode, markup),
    };

    this.tasks = [].concat(options.tasks);

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  start() {
    if (process.env.NODE_ENV !== 'production') {
      Transaction.assert(this);
    }

    const { domNode, state: { measure }, tasks } = this;
    const takeLastTask = tasks.pop();

    this.aborted = false;

    // Add middleware in as tasks.
    Transaction.invokeMiddleware(this);

    // Measure the render flow if the user wants to track performance.
    measure('render');

    // Push back the last task as part of ending the flow.
    tasks.push(takeLastTask);

    return Transaction.flow(this, tasks);
  }

  // This will immediately call the last flow task and terminate the flow. We
  // call the last task to ensure that the control flow completes. This should
  // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
  // `return someValue` to provide the most accurate performance reading. This
  // doesn't matter practically besides that.
  abort(isReturn) {
    const { state } = this;

    this.aborted = true;

    // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.
    if (isReturn) {
      return this.tasks[this.tasks.length - 1](this);
    }
  }

  end() {
    const { state, domNode, options } = this;
    const { measure } = state;
    const { inner } = options;

    measure('finalize');

    this.completed = true;

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.
    state.previousMarkup = domNode.outerHTML;
    state.isRendering = false;

    // Clean up memory before rendering the next transaction, however if
    // another transaction is running concurrently this will be delayed until
    // the last render completes.
    cleanMemory();

    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }
}
