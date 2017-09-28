// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
export default function endAsPromise(transaction) {
  const { promises = [] } = transaction;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return transaction.promise = Promise.all(promises).then(() => transaction.end());
  }

  // Pass off the remaining middleware to allow users to dive into the
  // transaction completed lifecycle event.
  return transaction.promise = Promise.resolve(transaction.end());
}
