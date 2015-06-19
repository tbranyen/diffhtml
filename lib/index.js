var patchNode = require('./diff/patch_node');

Object.defineProperty(Element.prototype, 'diffInnerHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML, true);
  }
});

Object.defineProperty(Element.prototype, 'diffOuterHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML);
  }
});
