import { mark } from '../util/performance';

export default function shouldUpdate(transaction) {
  const { markup, state } = transaction;

  state.mark('shouldUpdate');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  }
  else if (typeof markup === 'string') {
    state.markup = markup;
  }

  state.mark('shouldUpdate');
}
