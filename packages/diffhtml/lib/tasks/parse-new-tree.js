import parse from '../util/parse';
import createTree from '../tree/create';
import Transaction from '../transaction';

/**
 * @param {Transaction} transaction
 */
export default function parseNewTree(transaction) {
  const { state, input, options } = transaction;
  const { measure } = state;
  const { inner } = options;

  if (typeof input === 'string') {
    measure('parsing input for new tree');

    const { childNodes } = parse(input, undefined, options);

    let vTree;

    // If we are dealing with innerHTML, use all the Nodes.
    if (inner) {
      vTree = createTree(childNodes);
    }
    // If we are dealing with outerHTML, use the first element or the element
    // itself.
    else {
      vTree = createTree(childNodes[0] || childNodes);
    }

    if (vTree) {
      transaction.newTree = vTree;
    }

    measure('parsing input for new tree');
  }
}
