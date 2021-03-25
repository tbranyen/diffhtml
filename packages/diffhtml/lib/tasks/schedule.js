import { StateCache } from '../util/types';
import Transaction from '../transaction';

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Transaction} transaction
 * @return {Promise<Boolean> | void}
 */
export default function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  let { state, state: { isRendering } } = transaction;

  state.measure('schedule');

  // Loop through all existing mounts to ensure we properly wait.
  StateCache.forEach(val => {
    const oldMount = /** @type {HTMLElement} */ (
      val.activeTransaction && val.activeTransaction.mount
    );
    const newMount = /** @type {HTMLElement} */ (transaction.mount);

    // Only consider transactions that have mounts and are rendering.
    if (!oldMount || !newMount || !val.isRendering) {
      return;
    }

    // If the new mount point exists within an existing point that is rendering,
    // then wait for that transaction to finish.
    else if (
      oldMount.contains && oldMount.contains(newMount) ||
      newMount.contains && newMount.contains(oldMount)
    ) {
      state = val;
      isRendering = true;
    }
    // Test if the active transaction is the same as the incoming by looking at
    // the mount. Then look and see if the state is rendering.
    else if (oldMount === newMount) {
      state = val;
      isRendering = true;
    }
  });

  const { activeTransaction, nextTransaction } = state;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.
  if (isRendering) {
    const { tasks } = transaction;
    const chainTransaction = nextTransaction || activeTransaction;

    // Pave over the `nextTransaction` to chain off the previous.
    state.nextTransaction = transaction;

    // Abort the remaining tasks (but do not signal completion).
    transaction.abort();

    const promise = chainTransaction.promise || Promise.resolve();

    return transaction.promise = promise.then(() => {
      // Mark the transaction as not aborted (we are running it now). This
      // triggers a nested render.
      transaction.aborted = false;
      transaction.state.isRendering = true;
      transaction.state.activeTransaction = transaction;

      state.measure('schedule');

      return Transaction.flow(transaction, tasks.slice(1));
    });
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
  state.activeTransaction = transaction;

  state.measure('schedule');
}
