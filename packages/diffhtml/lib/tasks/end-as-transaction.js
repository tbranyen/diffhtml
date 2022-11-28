/**
 * @typedef {import('../transaction').default} Transaction
 */

/**
 * End flow, this terminates the transaction and returns itself when completed.
 * If you want to make diffHTML return streams or callbacks replace this function.
 * @param {Transaction} transaction 
 * @returns 
 */
export default function endAsTransaction(transaction) {
  // Pass off the remaining middleware to allow users to dive into the
  // transaction completed lifecycle event.
  return transaction.end();
}
