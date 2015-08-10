import { pools } from './pools';
import { makeParser } from './parser';

var parser = makeParser();

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
function parseHTML(newHTML, isInner) {
  var nodes = parser.parse(newHTML).childNodes;

  return isInner ? nodes : nodes[0];
}

export default parseHTML;
