import { VTree, ValidInput, Mount, Options, TransactionState, EMPTY } from './util/types';
import { MiddlewareCache, StateCache, NodeCache } from './util/caches';
import { gc } from './util/memory';
import Pool from './util/pool';
import makeMeasure from './util/make-measure';
import process from './util/process';
import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import reconcileTrees from './tasks/reconcile-trees';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';
import release from './release';

export const defaultTasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
];

export const tasks = {
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
};

export default class Transaction {
  /**
   *
   * @param {Mount} domNode
   * @param {ValidInput} input
   * @param {Options} options
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
    // TODO: Rename this to mount.
    this.domNode = domNode;
    this.input = input;
    this.options = options;

    /** @type {TransactionState} */
    this.state = StateCache.get(domNode) || {
      measure: makeMeasure(domNode, input),
      svgElements: new Set(),
      scriptsToExecute: new Map(),
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
    const { state, domNode, options } = this;
    const { measure, svgElements, scriptsToExecute } = state;

    measure('finalize');

    this.completed = true;

    // Clean up SVG element list.
    svgElements.clear();

    // Rendering is complete.
    state.isRendering = false;

    scriptsToExecute.forEach((type = EMPTY.STR, vTree) => {
      const oldNode = /** @type {HTMLElement} */ (NodeCache.get(vTree));

      // Reset the type value.
      if (type) oldNode.setAttribute('type', type);
      else oldNode.removeAttribute('type');
    });

    // Save the markup immediately after patching.
    state.previousMarkup = 'outerHTML' in /** @type {any} */ (domNode) ? domNode.outerHTML : EMPTY.STR;

    // Only execute scripts if the configuration is set. By default this is set
    // to true. You can toggle this behavior for your app to disable script
    // execution.
    if (options.executeScripts) {
      // Execute deferred scripts.
      scriptsToExecute.forEach((_, vTree)=> {
        const oldNode = NodeCache.get(vTree);
        const newNode = /** @type {any} */ (oldNode).cloneNode(true);

        if (!oldNode) {
          return;
        }

        // If the script is now the root element, make sure we cleanup and
        // re-assign.
        if (StateCache.has(oldNode)) {
          release(oldNode);
          StateCache.set(newNode, state);
        }

        // Replace the node association.
        NodeCache.set(vTree, newNode);

        // Replace the scripts to trigger default browser behavior.
        oldNode.parentNode && oldNode.parentNode.replaceChild(newNode, oldNode);
      });
    }

    // Empty the scripts to execute.
    scriptsToExecute.clear();

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Clean up memory before rendering the next transaction, however if
    // another transaction is running concurrently this will be delayed until
    // the last render completes.
    //
    // Defer garbage collection if the current size is more than double the
    // current allocation.
    if (Pool.memory.free.size < Pool.memory.allocated.size * 2) {
      /** @type {any} */(global).cancelIdleCallback(this._idleCallback);
      this._idleCallback = /** @type {any} */(global).requestIdleCallback(gc);
    }

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
  domNode = EMPTY.STR;

  /** @type {ValidInput} */
  input = EMPTY.STR;

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
