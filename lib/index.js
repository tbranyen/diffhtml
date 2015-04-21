var virtualDom = require('virtual-dom');
var recurseNodes = require('./recurse-nodes');

var namespace = 'http://www.w3.org/1999/xhtml';
var hidden = document.implementation.createHTMLDocument(namespace, 'html');

function parseHTML(markup) {
  var frag = hidden.createElement('div');
  frag.innerHTML = markup;
  return recurseNodes(frag.childNodes);
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

Object.defineProperty(Element.prototype, 'diffHTML', {
  configurable: true,

  set: function(newHTML) {
    if (typeof newHTML !== 'string') {
      throw new Error('Invalid type passed to diffHTML, expected String');
    }

    var newH = html2hscript(newHTML);
    var newRender = new Function('h', 'return ' + newH);

    if (!this._tree) {
      var oldHTML = this.innerHTML;
      var oldH = html2hscript(oldHTML);
      var oldRender = new Function('h', 'return ' + (oldH || 'null'));

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
