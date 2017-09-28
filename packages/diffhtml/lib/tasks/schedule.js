import Transaction from '../transaction';
import { StateCache } from '../util/caches';

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
export default function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  let { state } = transaction;

  const { isRendering, activeTransaction, nextTransaction } = state;

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
      transaction.aborted = false;
      return Transaction.flow(transaction, tasks.slice(1));
    });
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
  state.activeTransaction = transaction;
}
