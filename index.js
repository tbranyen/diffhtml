// Usage:
//
// document.querySelector('main').diffHTML = '<new markup to diff/>';
//
var virtualDom = require('virtual-dom');
var html2hscript = require('html2hyperscript');

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
