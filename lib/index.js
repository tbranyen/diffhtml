import patchNode from './diff/patch_node';

/**
 * diffhtml
 *
 * @param {Object} element - DOM element to operate on.
 * @param {string} markup - New markup to diff.
 * @param {Object} options - Options to override defaults.
 */
function diffhtml(element, markup='', options={}) {
  patchNode(element, markup, options);
}

Object.defineProperty(Element.prototype, 'transitionStates', {
  configurable: true,

  value: function(states) {
    this._states = states;
  }
});

Object.defineProperty(Element.prototype, 'diffInnerHTML', {
  configurable: true,

  set: function(newHTML) {
    diffhtml(this, newHTML, { inner: true, transitionStates: this._states });
  }
});

Object.defineProperty(Element.prototype, 'diffOuterHTML', {
  configurable: true,

  set: function(newHTML) {
    diffhtml(this, newHTML, { inner: false, transitionStates: this._states });
  }
});

export default diffhtml;
