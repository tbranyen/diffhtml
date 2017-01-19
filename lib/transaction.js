import { MiddlewareCache, StateCache, cleanMemory, measure } from './util';
import * as internals from './util';
import {
  schedule,
  shouldUpdate,
  reconcileTrees,
  syncTrees,
  patchNode,
  endAsPromise,
} from './tasks';

export default class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static renderNext(state) {
    // Still no next transaction, so can safely return early.
    if (!state.nextTransaction) {
      return;
    }

    // Create the next transaction.
    const { nextTransaction: { domNode, markup, options } } = state;
    state.nextTransaction = undefined;
    Transaction.create(domNode, markup, options).start();
  }

  static flow(transaction, tasks) {
    // Execute each "task" serially, passing the transaction as a baton that
    // can be used to share state across the tasks.
    return tasks.reduce((retVal, task, index) => {
      // If aborted, don't execute any more tasks.
      if (transaction.aborted) {
        return retVal;
      }

      // Continue flow, so long as there was no return value, or it matches the
      // transaction.
      if (retVal === undefined || retVal === transaction) {
        return task(transaction);
      }

      // The last `returnValue` is what gets sent to the consumer. This
      // mechanism is crucial for the `abort`, if you want to modify the "flow"
      // that's fine, but you must ensure that your last task provides a
      // mechanism to know when the transaction completes. Something like
      // callbacks or a Promise.
      return retVal;
    }, transaction);
  }

  static assert(transaction) {
    if (transaction.aborted && transaction.completed) {
      throw new Error('Transaction was previously aborted');
    }
    else if (transaction.completed) {
      throw new Error('Transaction was previously completed');
    }
  }

  static invokeMiddleware(transaction) {
    const { tasks } = transaction;

    MiddlewareCache.forEach(fn => {
      // Invoke all the middleware passing along this transaction as the only
      // argument. If they return a value (must be a function) it will be added
      // to the transaction task flow.
      const result = fn(transaction)

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
      measure: measure(domNode, markup),
      internals,
    };

    this.tasks = options.tasks || [
      schedule,
      shouldUpdate,
      reconcileTrees,
      syncTrees,
      patchNode,
      endAsPromise,
    ];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  start() {
    const { domNode, state: { measure }, tasks } = this;

    const takeLastTask = tasks.pop();

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
  abort() {
    const { state } = this;

    this.aborted = true;

    // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.
    return this.tasks[this.tasks.length - 1](this);
  }

  end() {
    const { state, domNode, options } = this;
    const { measure } = state;
    const { inner } = options;

    this.completed = true;

    let renderScheduled = false;

    StateCache.forEach(cachedState => {
      if (cachedState.isRendering && cachedState !== state) {
        renderScheduled = true;
      }
    });

    // Don't attempt to clean memory if in the middle of another render.
    if (!renderScheduled) {
      cleanMemory();
    }

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.
    state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
    state.previousText = domNode.textContent;

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    // We are no longer rendering the previous transaction so set the state to
    // `false`.
    state.isRendering = false;

    // Try and render the next transaction if one has been saved.
    Transaction.renderNext(state);

    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }
}
