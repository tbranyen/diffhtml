var patchNode = require('./diff/patch_node');

function diffhtml(element, markup, options) {
  patchNode(element, markup || '', options || {});
}

Object.defineProperty(Element.prototype, 'diffInnerHTML', {
  configurable: true,

  set: function(newHTML) {
    diffhtml(this, newHTML, { inner: true });
  }
});

Object.defineProperty(Element.prototype, 'diffOuterHTML', {
  configurable: true,

  set: function(newHTML) {
    diffhtml(this, newHTML, { inner: false });
  }
});

module.exports = diffhtml;
