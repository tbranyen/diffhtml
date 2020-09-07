import { StateCache, NodeCache, ReleaseHookCache } from './util/caches';
import { unprotectVTree } from './util/memory';
import { Mount } from './util/types';

/**
 * Releases state and memory associated to a DOM Node.
 *
 * @param {Mount} domNode - Valid input node
 */
export default function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(domNode);

  // If this was a top-level rendered element, deallocate the VTree
  // and remove the StateCache reference.
  if (state) {
    StateCache.delete(domNode);

    // If there is a known root association that is not in the NodeCache,
    // remove this VTree.
    if (state.oldTree && !NodeCache.has(state.oldTree)) {
      unprotectVTree(state.oldTree);
      ReleaseHookCache.forEach(fn => fn(state.oldTree));
    }
  }

  // The rest of this function only pertains to real HTML element nodes. If
  // this is undefined, then it isn't one.
  if (!domNode) {
    return;
  }

  const asHTMLElement = /** @type {HTMLElement} */(domNode);

  // Crawl the childNodes if this is an HTMLElement for state trees.
  if (asHTMLElement.childNodes && asHTMLElement.childNodes.length) {
    for (let i = 0; i < asHTMLElement.childNodes.length; i++) {
      release(asHTMLElement.childNodes[i]);
    }
  }

  // If there is a shadowRoot attached to the DOM node, attempt
  // to release this as well.
  if (asHTMLElement.shadowRoot) {
    release(asHTMLElement.shadowRoot);
  }

  // Do a thorough check within the NodeCache to fully deallocate all
  // references to the associated trees.
  NodeCache.forEach((domNode, vTree) => {
    if (domNode === asHTMLElement) {
      unprotectVTree(vTree);
      ReleaseHookCache.forEach(fn => fn(vTree));
    }
  });
}
