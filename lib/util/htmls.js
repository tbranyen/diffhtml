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
  if (node.nodeName === '#comment') { return; }
  if (node.nodeName === '#text' && !node.value.trim()) { return; }

  // Remove properties we don't need.
  delete node.parentNode;

  // Shame this is so slow.
  node.element = pools.uuid.get();

  if (!node.childNodes) {
    node.childNodes = pools.array.get();
    return node;
  }

  // Recursively process children.
  node.childNodes = node.childNodes.map(cleanDoc).filter(Boolean);

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
  return cleanDoc(tree).childNodes[0];
}

exports.cleanDoc = cleanDoc;
exports.parseHTML = parseHTML;
