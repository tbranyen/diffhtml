/**
 * @typedef {import('../transaction').default} Transaction
 */

/**
 * Allows the transaction to terminate early if no contents have changed.
 *
 * @param {Transaction} transaction
 */
export default function shouldUpdate(transaction) {
  const { mount, input, state: { measure }, config: options } = transaction;
  const prop = options.inner ? 'innerHTML' : 'outerHTML';

  measure('should update');

  const mountAsHTMLEl = /** @type {HTMLElement} */ (mount);

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof input === 'string' && mountAsHTMLEl[prop]=== input) {
    return transaction.abort(true);
  }

  measure('should update');
}
