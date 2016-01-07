import processPatches from '../patches/process';
import { patchNode } from '../node/patch';
import { cleanMemory } from '../util/memory';

/**
 * When the worker completes, clean up memory and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 * @return {Function}
 */
export function completeWorkerRender(element, elementMeta) {
  return function(ev) {
    var nodes = ev.data.nodes;

    var completeRender = function() {
      // Reset internal caches for quicker lookups in the futures.
      elementMeta._innerHTML = element.innerHTML;
      elementMeta._outerHTML = element.outerHTML;
      elementMeta._textContent = element.textContent;

      // Recycle all unprotected allocations.
      cleanMemory();

      elementMeta.hasWorkerRendered = true;
      elementMeta.isRendering = false;

      // This is designed to handle use cases where renders are being hammered
      // or when transitions are used with Promises.
      if (elementMeta.renderBuffer) {
        let nextRender = elementMeta.renderBuffer;

        // Reset the buffer.
        elementMeta.renderBuffer = undefined;

        // Noticing some weird performance implications with this concept.
        patchNode(element, nextRender.newHTML, nextRender.options);
      }

      // Dispatch an event on the element once rendering has completed.
      element.dispatchEvent(new CustomEvent('renderComplete'));
    };

    // Wait until all promises have resolved, before finishing up the patch
    // cycle.
    // Process the data immediately and wait until all transition callbacks
    // have completed.
    var processPromise = processPatches(element, ev.data.patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (processPromise) { processPromise.then(completeRender); }
    else { completeRender(); }
  };
}
