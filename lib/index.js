var patch = require('./diff/patch');

Object.defineProperty(Element.prototype, 'outerDiffHTML', {
  configurable: true,

  set: function(newHTML) {
    patch(this, newHTML);
  }
});
