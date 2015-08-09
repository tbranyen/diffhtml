import patchNode from './diff/patch_node';

/**
 * outer
 *
 * @param element
 * @param markup=''
 * @param options={}
 * @return
 */
export function outerHTML(element, markup='', options={}) {
  options.inner = false;
  patchNode(element, markup, options);
}

/**
 * inner
 *
 * @param element
 * @param markup=''
 * @param options={}
 * @return
 */
export function innerHTML(element, markup='', options={}) {
  options.inner = true;
  patchNode(element, markup, options);
}

/**
 * element
 *
 * @return
 */
export function element(element, newElement, options={}) {
  options.inner = false;
  patchNode(element, newElement, options);
}

/**
 * enableProllyfill
 *
 * @return
 */
export function enableProllyfill() {
  Object.defineProperty(Element.prototype, 'transitionStates', {
    configurable: true,

    value: function(states) {
      this._states = states;
    }
  });

  Object.defineProperty(Element.prototype, 'diffInnerHTML', {
    configurable: true,

    set: function(newHTML) {
      patchNode(this, newHTML, { inner: true });
    }
  });

  Object.defineProperty(Element.prototype, 'diffOuterHTML', {
    configurable: true,

    set: function(newHTML) {
      patchNode(this, newHTML, { inner: false });
    }
  });
}
