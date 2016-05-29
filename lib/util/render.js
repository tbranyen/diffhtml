import patchNode from '../node/patch';
import makeNode from '../node/make';
import { TreeCache } from '../node/tree';
import { cleanMemory } from '../util/memory';
import { pools } from '../util/pools';

/**
 * renderNext
 *
 * @param elementMeta
 * @return
 */
function renderNext(elementMeta) {
  let nextRender = elementMeta.renderBuffer;
  elementMeta.renderBuffer = undefined;

  // Noticing some weird performance implications with this concept.
  patchNode(nextRender.element, nextRender.newHTML, nextRender.options);
}

/**
 * When the render completes, clean up memory, and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 */
export function completeRender(element, elementMeta) {
  return function invokeRender() {
    elementMeta.previousMarkup = elementMeta.options.inner ?
      element.innerHTML : element.outerHTML;
    elementMeta._textContent = element.textContent;

    elementMeta.isRendering = false;

    // Boolean to stop operations in the TreeCache loop below.
    var stopLooping = false;

    // This is designed to handle use cases where renders are being hammered
    // or when transitions are used with Promises.
    if (elementMeta.renderBuffer) {
      renderNext(elementMeta);
    }
    else {
      TreeCache.forEach(function iterateTreeCache(elementMeta) {
        if (!stopLooping && elementMeta.renderBuffer) {
          renderNext(elementMeta);
          stopLooping = true;
        }
      });
    }

    // Clean out all the existing allocations.
    cleanMemory();

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new CustomEvent('renderComplete'));
  };
}
