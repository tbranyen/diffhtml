var virtualDom = require('virtual-dom');
var recurseNodes = require('./recurse-nodes');
var DOMParser = require('./util/dom-parser');

var namespace = 'http://www.w3.org/1999/xhtml';
var parser = new DOMParser();

function parseHTML(markup) {
  var doc = parser.parseFromString(markup, 'text/html');
  // FIXME: This is stupid hacky, but basically since HTML documents consist
  // of a <head> and <body> element, but sometimes we only want a fragment.
  var nodes = markup.indexOf('<html') > -1 ?
    doc.documentElement : doc.body.childNodes;

  return recurseNodes(nodes);
}

function parseElement(elem) {
  var hasAttribs = Object.keys(elem.attribs).length;
  var args = ['"' + elem.name + '"'];

  if (elem.name === '#text') {
    return JSON.stringify(elem.text);
  }

  if (hasAttribs) {
    var old = elem.attribs.class;
    elem.attribs.className = old;
    delete elem.attribs.class;
  }

  args.push(hasAttribs ? JSON.stringify(elem.attribs) : null);

  if (elem.children) {
    args.push('[' + elem.children.map(parseElement).join(',') + ']');
  }

  return 'h(' + args.filter(Boolean).join(',') + ')';
}

function html2hscript(markup) {
  var elements = parseHTML(markup).map(parseElement);

  if (!elements.length) {
    return null;
  }

  if (elements.length === 1) {
    if (elements[0].slice(0, 1) !== 'h') {
      return 'h("SPAN", [' + elements[0] + '])';
    }

    return elements[0];
  }

  return 'h("DIV", [' + elements.join(', ') + '])';
}

function getPatches(newHTML, isInner) {
  if (typeof newHTML !== 'string') {
    throw new Error('Invalid type passed to diffHTML, expected String');
  }

  var newH = html2hscript(newHTML);
  var newRender = new Function('h', 'return ' + newH);

  if (!this._tree) {
    var oldHTML = (isInner ? this.innerHTML : this.outerHTML) || '<div></div>';
    var oldH = html2hscript(oldHTML);
    var oldRender = new Function('h', 'return ' + oldH);

    this._tree = oldRender(virtualDom.h);
  }

  var newTree = newRender(virtualDom.h);
  var patches = virtualDom.diff(this._tree, newTree);

  if (!newTree) { return; }

  this._tree = newTree;

  return patches;
}

Object.defineProperty(Element.prototype, 'diffHTML', {
  configurable: true,

  set: function(newHTML) {
    if (newHTML === '') {
      this.innerHTML = '';
      return;
    }

    var patches = getPatches.call(this, newHTML, true);

    this._element = this.childNodes[0];

    if (!this._element) {
      this._element = document.createElement('div');
      this.appendChild(this._element);
    }

    for (var i = 1; i < this.childNodes.length; i++) {
      this.removeChild(this.childNodes[i]);
    }

    virtualDom.patch(this._element, patches);
  }
});

Object.defineProperty(Element.prototype, 'innerDiffHTML',
  Object.getOwnPropertyDescriptor(Element.prototype, 'diffHTML'));

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    var patches = getPatches.call(this, newHTML);
    virtualDom.patch(this, patches);
  }
});

Object.defineProperty(Element.prototype, 'diffElement', {
  configurable: true,

  set: function(newElement) {
    if (!newElement.childNodes.length) { return; }
    this._element = newElement;
    var patches = getPatches.call(this._element, newElement.innerHTML);
    virtualDom.patch(this._element, patches);
    this.appendChild(newElement);
  }
});
