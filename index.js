// Usage:
//
// document.querySelector('main').diffHTML = '<new markup to diff/>';
//
var virtualDom = require('virtual-dom');

var hidden = document.implementation.createHTMLDocument('http://www.w3.org/1999/xhtml', 'html');

var humanizeNodeType = {
  1: 'tag',
  2: 'attribute',
  3: 'text',
  4: 'cdata',
  8: 'comment'
};

var prev = null;
var next = null;
var parent = null;

var map = new WeakMap();

function recurse(node, i, all) {
  var entry = {};
  var nodeName = node.nodeName;
  var nodeValue = node.nodeValue;
  var childNodes = node.childNodes;
  var parentNode = node.parentNode;

  map.set(node, entry);

  if (nodeName === 'style') {
    entry.type = 'style';
  }
  else if (nodeName === 'script') {
    entry.type = 'script';
  }
  else {
    entry.type = humanizeNodeType[node.nodeType];
  }

  var attrs = Array.prototype.slice.call(node.attributes || {}, 0);

  entry.attribs = {};

  for (var i = 0; i < attrs.length; i++) {
    entry.attribs[attrs[i].name] = attrs[i].value;
  }

  entry.name = nodeName;
  entry.children = recurseAll(childNodes);
  entry.text = nodeValue || null;

  return prev = entry;
}

function recurseAll(nodes) {
  var nodes = [].map.call(nodes, recurse).filter(Boolean);

  if (nodes.length) {
    nodes[0].prev = null;
  }

  return nodes;
}

function parseHTML(markup) {
  var frag = hidden.createDocumentFragment();
  frag.appendChild(document.createElement('div'));
  frag.firstChild.innerHTML = markup;

  // Find the correct element.
  return recurseAll(frag.firstChild.childNodes);
}

function parseHTML(markup) {
  var frag = hidden.createDocumentFragment();

  frag.appendChild(document.createElement('div'));
  frag.firstChild.innerHTML = markup;

  // Find the correct element.
  return recurseAll(frag.firstChild.childNodes);
}

function parseElement(elem) {
  var hasAttribs = Object.keys(elem.attribs).length;

  if (elem.name === '#text') {
    return JSON.stringify(elem.text);
  }

  if (hasAttribs) {
    var old = elem.attribs.class;
    elem.attribs.className = old;
    delete elem.attribs.class;
  }

  var inner = [
      '"' + elem.name + '"',
      hasAttribs ? JSON.stringify(elem.attribs) : null,
      '[' + elem.children.map(parseElement).join(', ') + ']'
  ]
  .filter(Boolean)
  .join(',');

  return 'h(' + inner + ')';
}

function toHScript(elements) {
  return elements.map(parseElement).join(',');
}

function html2hscript(markup) {
  return toHScript(parseHTML(markup));
}

Object.defineProperty(Element.prototype, 'diffHTML', {
  set: function(newHTML) {
    var oldHTML = this.innerHTML;
    var newH = html2hscript(newHTML);
    var newRender = new Function('h', 'return ' + newH);

    if (!this._tree) {
      var oldH = html2hscript(oldHTML);
      var oldRender = new Function('h', 'return ' + oldH);

      this._tree = oldRender(virtualDom.h);
      this._element = virtualDom.create(this._tree);

      if (!this._element) {
        this._tree = newRender(virtualDom.h);
        this._element = virtualDom.create(this._tree);
      }

      this.innerHTML = '';
      this.appendChild(this._element);
    }

    var newTree = newRender(virtualDom.h);
    var patches = virtualDom.diff(this._tree, newTree);

    this._tree = newTree;

    virtualDom.patch(this._element, patches);
  }
});
