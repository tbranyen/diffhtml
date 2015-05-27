var patchNode = require('./diff/patch_node');

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patchNode(this, newHTML);
  }
});
