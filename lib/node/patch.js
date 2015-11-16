import CustomEvent from 'custom-event';
import { create as createWorker, hasWorker } from '../worker/create';
import { cleanMemory, protectElement, unprotectElement } from '../util/memory';
import { pools } from '../util/pools';
import { parseHTML } from '../util/parser';
import processPatches from '../patches/process';
import makeNode from './make';
import makeElement from '../element/make';
import getElement from '../element/get';
import syncNode from './sync';
import { TreeCache } from './tree';

/**
 * When the worker completes, clean up memory and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 * @return {Function}
 */
function completeWorkerRender(element, elementMeta) {
  return function(ev) {
    var nodes = ev.data.nodes;

    // Add new elements.
    if (nodes.additions.length) {
      nodes.additions.map(protectElement).map(descriptor => {
        // Inject into the `oldTree` so it's cleaned up correctly.
        elementMeta.oldTree.childNodes.push(descriptor);
        return descriptor;
      }).forEach(makeElement);
    }

    let completeRender = function() {
      // Remove unused elements.
      if (nodes.removals.length) {
        var els = nodes.removals.map(uuid => pools.elementObject._uuid[uuid])
          .map(unprotectElement)
          .forEach(function(el) {
            console.log(el);
            console.log(el.parentNode);
            var idx = elementMeta.oldTree.childNodes.indexOf(el);
            elementMeta.oldTree.childNodes.splice(idx, 1);
          });
      }

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
    let processPromise = processPatches(element, ev.data.patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (processPromise) { processPromise.then(completeRender); }
    else { completeRender(); }
  };
}

/**
 * Release's the allocated objects and recycles internal memory.
 *
 * @param element
 */
export function releaseNode(element) {
  let elementMeta = TreeCache.get(element) || {};

  // If there is a worker associated with this element, then kill it.
  if (elementMeta.worker) {
    elementMeta.worker.terminate();
  }

  // If there was a tree set up, recycle the memory allocated for it.
  if (elementMeta.oldTree) {
    unprotectElement(elementMeta.oldTree);
    cleanMemory();
  }

  // Remove this element's meta object from the cache.
  TreeCache.delete(element);
}

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
export function patchNode(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.enableWorker !== 'boolean') {
    options.enableWorker = document.ENABLE_WORKER;
  }

  // The element meta object is a location to associate metadata with the
  // currently rendering element. This prevents attaching properties to the
  // instance itself.
  var elementMeta = TreeCache.get(element) || {};

  // Always ensure the most up-to-date meta object is stored.
  TreeCache.set(element, elementMeta);

  // If this element is already rendering, add this new render request into the
  // buffer queue.
  if (elementMeta.isRendering) {
    return elementMeta.renderBuffer = { newHTML, options };
  }

  // If the operation is `innerHTML`, but the contents haven't changed.
  var sameInnerHTML = options.inner && element.innerHTML === newHTML;
  // If the operation is `outerHTML`, but the contents haven't changed.
  var sameOuterHTML = !options.inner && element.outerHTML === newHTML;

  // If the contents haven't changed, abort, since there is no point in
  // continuing.
  if ((sameInnerHTML || sameOuterHTML) && elementMeta.oldTree) { return; }

  // Start with worker being a falsy value.
  var worker = null;

  // If we can use a worker and the user wants one, try and create it.
  if (options.enableWorker && hasWorker) {
    // Create a worker for this element.
    worker = elementMeta.worker = elementMeta.worker || createWorker();
  }

  if (
    // If the operation is `innerHTML`, and the current element's contents have
    // changed since the last render loop, recalculate the tree.
    (options.inner && elementMeta._innerHTML !== element.innerHTML) ||

    // If the operation is `outerHTML`, and the current element's contents have
    // changed since the last render loop, recalculate the tree.
    (!options.inner && elementMeta._outerHTML !== element.outerHTML) ||

    // If the text content ever changes, recalculate the tree.
    (elementMeta._textContent !== element.textContent) ||

    // The last render was done via Worker, but now we're rendering in the UI
    // thread. This is very uncommon, but we need to ensure tree's stay in
    // sync.
    (elementMeta.renderedViaWorker === true && !options.enableWorker)
  ) {
    if (elementMeta.oldTree) {
      unprotectElement(elementMeta.oldTree);
      cleanMemory();
    }

    elementMeta.oldTree = makeNode(element, true);
    elementMeta.updateWorkerTree = true;
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && hasWorker && worker) {
    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;
    elementMeta.renderedViaWorker = true;

    // Attach all properties here to transport.
    let transferObject = {};

    // This should only occur once, or whenever the markup changes externally
    // to diffHTML.
    if (!elementMeta.hasWorkerRendered || elementMeta.updateWorkerTree) {
      transferObject.oldTree = elementMeta.oldTree;
      elementMeta.updateWorkerTree = false;
    }

    // Attach the parent element's uuid.
    transferObject.uuid = elementMeta.oldTree.element;

    if (typeof newHTML !== 'string') {
      transferObject.newTree = makeNode(newHTML);

      // Transfer this buffer to the worker, which will take over and process the
      // markup.
      worker.postMessage(transferObject);

      // Wait for the worker to finish processing and then apply the patchset.
      worker.onmessage = completeWorkerRender(element, elementMeta);

      return;
    }

    // Let the browser copy the HTML into the worker, converting to a
    // transferable object is too expensive.
    transferObject.newHTML = newHTML;

    // Add properties to send to worker.
    transferObject.isInner = options.inner;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = completeWorkerRender(element, elementMeta);
  }
  else {
    // We're rendering in the UI thread.
    elementMeta.isRendering = true;
    // Whenever we render in the UI-thread, ensure that the Worker gets a
    // refreshed copy of the `oldTree`.
    elementMeta.updateWorkerTree = true;

    let patches = [];
    let newTree = null;

    if (typeof newHTML === 'string') {
      newTree = parseHTML(newHTML, options.inner)
    }
    else {
      newTree = makeNode(newHTML);
    }

    if (options.inner) {
      let childNodes = newTree;

      newTree = {
        childNodes,

        attributes: elementMeta.oldTree.attributes,
        element: elementMeta.oldTree.element,
        nodeName: elementMeta.oldTree.nodeName,
        nodeValue: elementMeta.oldTree.nodeValue
      };
    }

    let oldTreeName = elementMeta.oldTree.nodeName || '';
    let newNodeName = newTree && newTree.nodeName;

    // If the element node types match, try and compare them.
    if (oldTreeName === newNodeName) {
      // Synchronize the tree.
      syncNode.call(patches, elementMeta.oldTree, newTree);
    }
    // Otherwise replace the top level elements.
    else if (newHTML) {
      patches[patches.length] = {
        __do__: 0,
        old: elementMeta.oldTree,
        new: newTree
      };

      unprotectElement(elementMeta.oldTree);

      elementMeta.oldTree = newTree;
    }

    let completeRender = function() {
      // Mark that this element has initially rendered and is done rendering.
      elementMeta.isRendering = false;

      // Set the innerHTML.
      elementMeta._innerHTML = element.innerHTML;
      elementMeta._outerHTML = element.outerHTML;
      elementMeta._textContent = element.textContent;

      cleanMemory();

      // Clean out the patches array.
      patches.length = 0;

      // Dispatch an event on the element once rendering has completed.
      element.dispatchEvent(new CustomEvent('renderComplete'));

      // TODO Update this comment and/or refactor to use the same as the Worker.
      if (elementMeta.renderBuffer) {
        let nextRender = elementMeta.renderBuffer;
        elementMeta.renderBuffer = undefined;

        // Noticing some weird performance implications with this concept.
        patchNode(element, nextRender.newHTML, nextRender.options);
      }
    };

    // Process the data immediately and wait until all transition callbacks
    // have completed.
    let processPromise = processPatches(element, patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (processPromise) { processPromise.then(completeRender); }
    else { completeRender(); }
  }
}
