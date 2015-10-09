import CustomEvent from 'custom-event';
import { create as createWorker, hasWorker } from '../worker/create';
import { cleanMemory, unprotectElement } from '../util/memory';
import { pools } from '../util/pools';
import { parseHTML } from '../util/parser';
import processPatches from '../patches/process';
import makeNode from './make';
import syncNode from './sync';
import { TreeCache } from './tree';

/**
 * When the worker completes, clean up memory and schedule the next render if
 * necessary.
 *
 * @param element
 * @param elementMeta
 * @return
 */
function completeWorkerRender(element, elementMeta) {
  return function(ev) {
    processPatches(element, ev);

    elementMeta._innerHTML = element.innerHTML;
    elementMeta._outerHTML = element.outerHTML;
    elementMeta._textContent = element.textContent;

    cleanMemory();

    elementMeta.isRendering = false;
    elementMeta.hasRenderedViaWorker = true;

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new CustomEvent('renderComplete'));

    if (elementMeta.renderBuffer) {
      let nextRender = elementMeta.renderBuffer;
      elementMeta.renderBuffer = undefined;

      // Noticing some weird performance implications with this concept.
      patchNode(element, nextRender.newHTML, nextRender.options);
    }
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

  let elementMeta = TreeCache.get(element) || {};
  let newOld = false;

  // Always ensure the most up-to-date meta object is stored.
  TreeCache.set(element, elementMeta);

  if (elementMeta.isRendering) {
    // Add this new render into the buffer queue.
    elementMeta.renderBuffer = { newHTML, options };
    return;
  }

  if (
    // If the operation is `innerHTML`, but the contents haven't changed,
    // abort.
    options.inner && element.innerHTML === newHTML ||

    // If the operation is `outerHTML`, but the contents haven't changed,
    // abort.
    !options.inner && element.outerHTML === newHTML
  ) { return; }

  if (
    // If the operation is `innerHTML`, and the current element's contents have
    // changed since the last render loop, recalculate the tree.
    (options.inner && elementMeta._innerHTML !== element.innerHTML) ||

    // If the operation is `outerHTML`, and the current element's contents have
    // changed since the last render loop, recalculate the tree.
    (!options.inner && elementMeta._outerHTML !== element.outerHTML) ||

    // If the text content ever changes, recalculate the tree.
    (elementMeta._textContent !== element.textContent)
  ) {
    newOld = true;

    if (elementMeta.oldTree) {
      unprotectElement(elementMeta.oldTree);
      cleanMemory();
    }

    elementMeta.oldTree = makeNode(element, true);
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && hasWorker && elementMeta.hasRendered) {
    // Create a worker for this element.
    let worker = elementMeta.worker = elementMeta.worker || createWorker();

    // Attach all properties here to transport.
    let transferObject = {};

    // Attach the parent element's uuid.
    transferObject.uuid = elementMeta.oldTree.element;

    if (newOld || !elementMeta.hasRenderedViaWorker) {
      transferObject.oldTree = elementMeta.oldTree;
    }

    if (typeof newHTML !== 'string') {
      transferObject.newTree = makeNode(newHTML);

      // Set a render lock as to not flood the worker.
      elementMeta.isRendering = true;

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

    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = completeWorkerRender(element, elementMeta);
  }
  else if (!options.enableWorker || !hasWorker || !elementMeta.hasRendered) {
    let data = [];
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
      syncNode.call(data, elementMeta.oldTree, newTree);
    }
    // Otherwise replace the top level elements.
    else if (newHTML) {
      data[data.length] = {
        __do__: 0,
        old: elementMeta.oldTree,
        new: newTree
      };

      unprotectElement(elementMeta.oldTree);

      elementMeta.oldTree = newTree;
    }

    // Process the data immediately.
    processPatches(element, { data });

    // Mark that this element has initially rendered and is done rendering.
    elementMeta.hasRendered = true;
    elementMeta.isRendering = false;

    // Set the innerHTML.
    elementMeta._innerHTML = element.innerHTML;
    elementMeta._outerHTML = element.outerHTML;
    elementMeta._textContent = element.textContent;

    cleanMemory();

    // Clean out the patches array.
    data.length = 0;

    // Dispatch an event on the element once rendering has completed.
    element.dispatchEvent(new CustomEvent('renderComplete'));
  }
}
