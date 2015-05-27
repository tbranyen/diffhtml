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
//function findChildNodes(text, offset, level) {
//  var childNodes = this;
//
//  while (level) {
//    var open = text.indexOf('<', offset);
//    var afterOpen = text[open + 1];
//    var close = text.indexOf('>', open);
//    var beforeClose = text[close - 1];
//    var afterClose = text[close + 1];
//
//    if (afterOpen === '!') { offset = close; continue; }
//    if (afterOpen !== '/') {
//      var entry = {};
//      var parts = text.slice(open + 1, close).split(' ');
//
//      // Set the element to be false so that the primary thread knows to
//      // create one.
//      entry.element = uuid();
//      entry.nodeName = parts[0].toUpperCase();
//      entry.nodeType = 1;
//      entry.attributes = parts.slice(1).reduce(function(attrs, current, i, all) {
//        var quotes = current.match(/([\'])|([\"])/g);
//        var linebreak = current.match(/([\n])/g);
//        var hasAssignment = current.indexOf('=') !== -1;
//
//        if (hasAssignment) {
//          var parts = current.split('=');
//          if (parts.length === 2 && parts[1] !== '\n') {
//            attrs.push(current);
//            return attrs;
//          }
//          else {
//            attrs.push(parts[0] + '=');
//            return attrs;
//          }
//        }
//
//        else if (hasAssignment && (!linebreak || linebreak.length === 1) && (!quotes || quotes.length === 2)) {
//          attrs.push(current);
//          return attrs;
//        }
//
//        // Join to the previous.
//        attrs[attrs.length - 1] += current;
//
//        return attrs;
//      }, []).map(function(attrs) {
//        console.log(attrs);
//        var parts = attrs.split('=');
//        var value = parts[1] || parts[0];
//
//        if (parts[1]) {
//          value = parts.slice(1).join('=');
//        }
//
//        // Strip off quotes.
//        if (value[0] === '\'' || value[0] === '\"') {
//          value = value.slice(1);
//        }
//
//        if (value[value.length -1] === '\'' || value[value.length -1] === '\"') {
//          value = value.slice(0, -1);
//        }
//
//        return { name: parts[0], value: value };
//      });
//
//      // Add to global child nodes.
//      childNodes.push(entry);
//
//      // Reduce the level always if an HR.
//      if (parts[0] === 'hr' || parts[0] === 'meta' || parts[0] === 'link') {
//        offset = close;
//        --level;
//        continue;
//      }
//
//      console.log(level);
//
//      ++level;
//
//      // Find more children.
//      entry.childNodes = [];
//
//      // Find text node between elements
//      var textContent = null;
//
//      if (textContent = text.slice(close + 1, text.indexOf('<', close)).trim()) {
//        entry.childNodes.push({
//          element: uuid(),
//          nodeName: '#text',
//          nodeType: 3,
//          nodeValue: textContent,
//          attribute: [],
//          childNodes: []
//        });
//
//        offset = text.indexOf('<', close);
//      }
//
//      offset = findChildNodes.call(entry.childNodes, text, close, 1);
//    }
//
//    if (beforeClose === '/' || afterOpen === '/') {
//      --level;
//    }
//
//    // Clear out the textContent per loop.
//    textContent = null;
//  }
//
//  return close;
//}

function cleanDoc(node) {
  // Rename to attributes.
  node.attributes = node.attrs || [];

  // Ensure childNodes exists.
  node.childNodes = node.childNodes || [];

  if (node.nodeName === '#documentType') { return; }
  if (node.nodeName === '#comment') { return; }

  // If value convert to nodeValue
  if ('value' in node) {
    node.nodeValue = node.value.trim();
    node.nodeType = 3;
    node.element = uuid();
    return node.nodeValue ? node : undefined;
  }
  else {
    // All elements are node 1 by default.
    node.nodeType = 1;

    // Remove nodeName.
    node.nodeName = node.nodeName.toUpperCase();
  }

  // Set the element.
  node.element = uuid();

  // Remove properties we don't need.
  delete node.attrs;
  delete node.parentNode;
  delete node.tagName;
  delete node.namespaceURI;
  delete node.value;

  var childNodeLength = node.childNodes.length;

  // Recursively process children.
  node.childNodes = node.childNodes.map(cleanDoc).filter(Boolean);

  return node;
}

function parseHTML(markup) {
  var tree = parser.parse(markup);
  console.time('clean');
  var document = cleanDoc(tree);
  console.timeEnd('clean');
  return document.childNodes[0];
}

exports.cleanDoc = cleanDoc;
exports.parseHTML = parseHTML;
