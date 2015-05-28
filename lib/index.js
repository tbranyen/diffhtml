var patchNode = require('./diff/patch_node');

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML);
  }
});

Object.defineProperty(Element.prototype, 'innerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML, true);
  }
});
