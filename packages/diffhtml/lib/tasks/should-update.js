export default function shouldUpdate(transaction) {
  const { markup, state, state: { measure } } = transaction;

  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort(true);
  }
  else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}
