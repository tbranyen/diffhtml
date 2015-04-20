var virtualDom = require('virtual-dom');
var recurseNodes = require('./lib/recurse');

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
  return parseHTML(markup).map(parseElement).join(',');
}

Object.defineProperty(Element.prototype, 'diffHTML', {
  configurable: true,
  set: function(newHTML) {
    var oldHTML = this.innerHTML;
    var newH = html2hscript(newHTML.outerHTML || newHTML);
    var newRender = new Function('h', 'return ' + newH);

    if (!this._tree) {
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
