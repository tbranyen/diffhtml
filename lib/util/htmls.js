var uuid = require('./uuid');
var parser = new (require('parse5').Parser);

/**
 * findChildNodes
 *
 * @param text
 * @param offset
 * @param level
 * @return
 */
function cleanDoc(node) {
  if (node.nodeName === '#documentType') { return; }

  // Remove properties we don't need.
  delete node.parentNode;
  delete node.tagName;
  delete node.namespaceURI;

  node.element = uuid();

  // Recursively process children.
  node.childNodes = node.childNodes ? node.childNodes.map(cleanDoc) : [];

  return node;
}

function parseHTML(nodeName, markup) {
  if (nodeName === 'HTML') {
    var tree = parser.parse(markup);
  }
  else {
    var tree = parser.parseFragment(markup);
  }

  // Find the right element.
  return cleanDoc(tree).childNodes.filter(Boolean)[0];
}

exports.cleanDoc = cleanDoc;
exports.parseHTML = parseHTML;
