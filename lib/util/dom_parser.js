/*! @source https://gist.github.com/1129031 */

var DOMParser = window.DOMParser || function() {};
var DOMParser_proto = DOMParser.prototype;
var real_parseFromString = DOMParser_proto.parseFromString;

module.exports = DOMParser;

// Firefox/Opera/IE throw errors on unsupported types
try {
  // WebKit returns null on unsupported types
  if ((new DOMParser).parseFromString("", "text/html")) {
    // text/html parsing is natively supported
    return;
  }
} catch (unhandledException) {}

DOMParser_proto.parseFromString = function(markup, type) {
  if (!/^\s*text\/html\s*(?:;|$)/i.test(type)) {
    return real_parseFromString.apply(this, arguments);
  }

  var doc = document.implementation.createHTMLDocument("");
  var doc_elt = doc.documentElement;
  var first_elt;

  doc_elt.innerHTML = markup;
  first_elt = doc_elt.firstElementChild;

  if (doc_elt.childElementCount === 1
    && first_elt.localName.toLowerCase() === "html") {
    doc.replaceChild(first_elt, doc_elt);
  }

  return doc;
};
