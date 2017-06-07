import { NodeCache } from '../util/caches';
import parse from '../util/parse';
import createTree from '../tree/create';

export default function parseNewTree(transaction) {
  const { state, markup, options } = transaction;
  const { measure } = state;
  const { inner } = options;

  if (typeof markup === 'string') {
    measure('parsing markup for new tree');

    const { childNodes } = parse(markup, null, options);

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.
    transaction.newTree = createTree(
      inner ? childNodes : childNodes[0] || childNodes
    );

    measure('parsing markup for new tree');
  }
}
