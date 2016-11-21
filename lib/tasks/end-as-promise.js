// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
export default function endAsPromise(transaction) {
  const { state, domNode, options: { inner }, promises=[] } = transaction;

  // Cache the markup and text for the DOM node to allow for short-circuiting
  // future render transactions.
  state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
  state.previousText = domNode.textContent;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(() => transaction.end());
  }
  else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}
