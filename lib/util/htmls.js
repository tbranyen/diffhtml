import { pools } from './pools';
import { makeParser } from './parser';

var parser = makeParser();

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
function parseHTML(newHTML) {
  return parser.parse(newHTML).childNodes[0];
}

export default parseHTML;
