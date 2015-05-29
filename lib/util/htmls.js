var pools = require('./pools');
var parser = require('./parser').makeParser();

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
function parseHTML(newHTML) {
  return parser.parse(newHTML).childNodes[0];
}

window.parseHTML = exports.parseHTML = parseHTML;
