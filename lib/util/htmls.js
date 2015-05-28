var pools = require('./pools');
var parser = require('./parser').makeParser();

function processNode(node) {
  node.element = pools.uuid.get();
  node.attributes = pools.array.get();

  var attrsObject = node.attrsAsObject;

  for (var key in attrsObject) {
    node.attributes.push({ name: key, value: attrsObject[key] });
  }

  delete node._attrs;
  delete node._rawAttrs;
  delete node.rawAttrs;
  delete node.rawText;

  if (node.childNodes) {
    node.childNodes.forEach(processNode);
  }
}

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
function parseHTML(newHTML) {
  var documentElement = parser.parse(newHTML).childNodes[0];
  documentElement.removeWhitespace();
  processNode(documentElement);
  return documentElement;
}

exports.processNode = processNode;
exports.parseHTML = parseHTML;
