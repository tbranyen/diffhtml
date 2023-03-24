/**
 * @typedef {import('./util/types').ValidInput} ValidInput
 * @typedef {import('./util/types').TransactionConfig} TransactionConfig
 * @typedef {import('./util/types').TransactionState} TransactionState
 * @typedef {import('./util/types').VTree} VTree
 * @typedef {import('./util/types').Mount} Mount
 */
import { MiddlewareCache, StateCache, NodeCache, EMPTY } from './util/types';
import makeMeasure from './util/make-measure';
import internalProcess from './util/process';
import { protectVTree } from './util/memory';
import globalThis from './util/global';
import shouldUpdate from './tasks/should-update';
import reconcileTrees from './tasks/reconcile-trees';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsTransaction from './tasks/end-as-transaction';
import release from './release';
import getConfig from './util/config';
import hasModule from './util/has-module';

const { assign } = Object;

export const defaultTasks = [
  shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsTransaction,
];

export const tasks = {
  shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsTransaction,
};

export default class Transaction {
  /**
   * This abstracts away the concept of `new` in case in the future we want
   * to migrate a Transaction off of a class.
   *
   * @param {Mount} mount
   * @param {ValidInput} input
   * @param {TransactionConfig} options
   */
  static create(mount, input, options) {
    return new Transaction(mount, input, options);
  }

  /**
   * @param {Transaction} transaction
   * @param {any} tasks
   *
   * @return {Transaction}
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
    if (internalProcess.env.NODE_ENV !== 'production') {
      if (typeof transaction.mount !== 'object' || !transaction.mount) {
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
    const { state: { measure }, tasks } = transaction;

    MiddlewareCache.forEach(fn => {
      const label = `invoke ${fn.name || 'anon'}`;
      measure(label);

      // Invoke all the middleware passing along this transaction as the only
      // argument. If they return a value (must be a function) it will be added
      // to the transaction task flow.
      const result = fn(transaction);

      if (result) {
        tasks.push(result);
      }

      measure(label);
    });
  }

  /**
   * @constructor
   * @param {Mount} mount
   * @param {ValidInput} input
   * @param {TransactionConfig} config
   */
  constructor(mount, input, config) {
    this.mount = mount;
    this.input = input;
    this.config = config;

    const useObserver = !config.disableMutationObserver && 'MutationObserver' in (globalThis.window || EMPTY.OBJ);

    this.state = StateCache.get(mount) || /** @type {TransactionState} */ ({
      measure: makeMeasure(this),
      svgElements: new Set(),
      scriptsToExecute: new Map(),
      mutationObserver: useObserver && new globalThis.window.MutationObserver(() => {
        this.state.isDirty = true;
      }),
    });

    this.tasks = /** @type {Function[]} */ (
      getConfig('tasks', defaultTasks, undefined, config)
    ).slice();

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(mount, this.state);
  }

  /**
   * @return {Transaction | unknown}
   */
  start() {
    if (internalProcess.env.NODE_ENV !== 'production') {
      Transaction.assert(this);
    }

    const { state: { measure }, tasks } = this;
    const takeLastTask = tasks.pop();

    // Start measuring a render for performance tracing.
    measure('render');

    this.aborted = false;

    // Add middleware in as tasks.
    Transaction.invokeMiddleware(this);

    // Push back the last task as part of ending the flow.
    takeLastTask && tasks.push(takeLastTask);

    return Transaction.flow(this, tasks);
  }

  /**
   * This will immediately call the last flow task and terminate the flow. We
   * call the last task to ensure that the control flow completes. This should
   * end pseudo-synchronously. Think `Promise.resolve()`, `callback()`, and
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
    const { state, config, mount } = this;
    const { mutationObserver, measure, svgElements, scriptsToExecute } = state;

    const mountAsHTMLEl = /** @type {HTMLElement} */ (mount);

    measure('finalize');

    this.completed = true;

    // Clean up SVG element list.
    svgElements.clear();

    // Rendering is complete.
    state.isRendering = false;
    state.isDirty = false;

    // After a transaction ends, clear out all mutation observer's to avoid
    // issues where parent components are triggered from child renders.
    StateCache.forEach(state => {
      if (state.mutationObserver) {
        state.mutationObserver.takeRecords();
      }
    });

    // If MutationObserver is available, look for changes.
    if (mountAsHTMLEl.ownerDocument && mutationObserver) {
      mutationObserver.observe(mountAsHTMLEl, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
    }
    // If there is no MutationObserver, then the DOM is dirty by default and
    // rescanned every time.
    //
    // FIXME This should be smarter for NodeJS, otherwise this is dirty every
    // re-render.
    else {
      state.isDirty = true;
    }

    // Only execute scripts if the configuration is set. By default this is set
    // to true. You can toggle this behavior for your app to disable script
    // execution.
    // Execute deferred scripts by cloning them and reattaching into the same
    // position.
    scriptsToExecute.forEach((type, vTree)=> {
      const oldNode = NodeCache.get(vTree);

      // Reset the type attribute back to the original.
      oldNode.type = type;

      if (!config.executeScripts || (hasModule() && type === 'nomodule')) {
        return;
      }

      // Copy over properties to the new script element.
      const newNode = assign(
        oldNode.ownerDocument.createElement('script'),
        oldNode,
      );

      // Copy over attributes.
      for (let key in vTree.attributes) {
        const value = vTree.attributes[key];
        newNode.setAttribute(key, value);
      }

      // Copy over body.
      newNode.textContent = oldNode.textContent;

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

    // Empty the scripts to execute.
    scriptsToExecute.clear();

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Ensure the tree is fully protected before ending the transaction.
    if (state.oldTree) protectVTree(state.oldTree);

    return this;
  }

  /**
   * @param {Function} callback
   */
  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }

  /** @type {TransactionState} */
  state = EMPTY.OBJ;

  /** @type {Mount} */
  mount = EMPTY.OBJ;

  /** @type {ValidInput} */
  input = EMPTY.OBJ;

  /** @type {VTree=} */
  oldTree = undefined;

  /** @type {VTree=} */
  newTree = undefined;

  /** @type {Function[]} */
  tasks = []

  /** @type any */
  patches = []
}
