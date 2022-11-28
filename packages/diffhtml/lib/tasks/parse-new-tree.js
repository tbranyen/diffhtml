/**
 * @typedef {import('../transaction').default} Transaction
 */
import Internals from '../util/internals';
import createTree from '../tree/create';

/**
 * @param {Transaction} transaction
 */
export default function parseNewTree(transaction) {
  const { state, input, config: options } = transaction;
  const { measure } = state;

  if (typeof input === 'string') {
    measure('parsing input for new tree');

    const { childNodes } = Internals.parse(input, options);
    const vTree = createTree(childNodes);

    if (vTree) {
      transaction.newTree = vTree;
    }

    measure('parsing input for new tree');
  }
}
