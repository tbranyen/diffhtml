import Transaction from "../transaction";

/**
 * Allows the transaction to terminate early if no contents have changed.
 *
 * @param {Transaction} transaction
 */
export default function shouldUpdate(transaction) {
  const { domNode, input, state, state: { measure }, options } = transaction;
  const prop = options.inner ? 'innerHTML' : 'outerHTML';

  measure('should update');

  const domNodeAsEl = /** @type {HTMLElement} */ (domNode);

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof input === 'string' && domNodeAsEl[prop]=== input) {
    return transaction.abort(true);
  }
  else if (typeof input === 'string') {
    state.markup = input;
  }

  measure('should update');
}
