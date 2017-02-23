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
  const { state } = transaction;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.
  if (state.isRendering) {
    // Resolve an existing transaction that we're going to pave over in the
    // next statement.
    if (state.nextTransaction) {
      state.nextTransaction.promises[0].resolve(state.nextTransaction);
    }

    // Set a pointer to this current transaction to render immediatately after
    // the current transaction completes.
    state.nextTransaction = transaction;

    const deferred = {};
    const resolver = new Promise(resolve => (deferred.resolve = resolve));

    resolver.resolve = deferred.resolve;
    transaction.promises = [resolver];

    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}
