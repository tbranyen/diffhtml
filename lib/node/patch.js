import { create as createWorker, hasWorker } from '../worker/create';
import { cleanMemory, protectElement, unprotectElement } from '../util/memory';
import { parseHTML } from '../util/parser';
import { completeRender } from '../util/render';
import makeNode from './make';
import processPatches from '../patches/process';
import syncNode from './sync';
import { TreeCache } from './tree';
import { pools } from '../util/pools';

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
export default function patchNode(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.enableWorker !== 'boolean') {
    options.enableWorker = document.ENABLE_WORKER;
  }

  // The element meta object is a location to associate metadata with the
  // currently rendering element. This prevents attaching properties to the
  // instance itself.
  var elementMeta = TreeCache.get(element) || {};

  // Last options used.
  elementMeta.options = options;

  // Always ensure the most up-to-date meta object is stored.
  TreeCache.set(element, elementMeta);

  var bufferSet = false;
  var isInner = options.inner;
  var previousMarkup = elementMeta.previousMarkup;

  // If this element is already rendering, add this new render request into the
  // buffer queue. Check and see if any element is currently rendering, can
  // only do one at a time.
  TreeCache.forEach(function(_elementMeta, _element) {
    if (_elementMeta.isRendering) {
      elementMeta.renderBuffer = { element, newHTML, options };
      bufferSet = true;
    }
  });

  // Short circuit the rest of this render.
  if (bufferSet) { return; }

  var sameInnerHTML = isInner ? previousMarkup === element.innerHTML : true;
  var sameOuterHTML = !isInner ? previousMarkup === element.outerHTML : true;
  var sameTextContent = elementMeta._textContent === element.textContent;

  // If the contents haven't changed, abort, since there is no point in
  // continuing.
  if (elementMeta.newHTML === newHTML) {
    elementMeta.isRendering = false;
    return;
  }

  // Associate the last markup rendered with this element.
  elementMeta.newHTML = newHTML;

  // Start with worker being a falsy value.
  var worker = null;

  // If we can use a worker and the user wants one, try and create it.
  if (options.enableWorker && hasWorker) {
    // Create a worker for this element.
    worker = elementMeta.worker = elementMeta.worker || createWorker();
  }

  var rebuildTree = function() {
    var oldTree = elementMeta.oldTree;

    if (oldTree) {
      unprotectElement(oldTree, makeNode);
      cleanMemory(makeNode);
    }

    elementMeta.oldTree = protectElement(makeNode(element));
    elementMeta.updateWorkerTree = true;
  };

  // The last render was done via Worker, but now we're rendering in the UI
  // thread. This is very uncommon, but we need to ensure trees stay in sync.
  if (elementMeta.renderedViaWorker === true && !options.enableWorker) {
    rebuildTree();
  }

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && hasWorker && worker) {
    // Set a render lock as to not flood the worker.
    elementMeta.isRendering = true;
    elementMeta.renderedViaWorker = true;
    elementMeta.workerCache = elementMeta.workerCache || [];

    // Attach all properties here to transport.
    let transferObject = {};

    // This should only occur once, or whenever the markup changes externally
    // to diffHTML.
    if (!elementMeta.hasWorkerRendered || elementMeta.updateWorkerTree) {
      transferObject.oldTree = elementMeta.oldTree;
      elementMeta.updateWorkerTree = false;
    }

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function(ev) {
      var wrapRender = cb => () => {
        elementMeta.hasWorkerRendered = true;
        cb();
      };
      // Wait until all promises have resolved, before finishing up the patch
      // cycle.
      // Process the data immediately and wait until all transition callbacks
      // have completed.
      var processPromise = processPatches(element, ev.data.patches);
      var invokeRender = wrapRender(completeRender(element, elementMeta));

      // Operate synchronously unless opted into a Promise-chain.
      if (processPromise) {
        processPromise.then(invokeRender).catch(ex => console.log(ex));
      } else {
        invokeRender();
      }
    };

    if (typeof newHTML !== 'string') {
      transferObject.newTree = makeNode(newHTML);

      // Transfer this buffer to the worker, which will take over and process the
      // markup.
      worker.postMessage(transferObject);

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
  }
  else {
    if (elementMeta.renderedViaWorker && elementMeta.oldTree) {
      rebuildTree();
    }

    if (elementMeta.workerCache) {
      elementMeta.workerCache.forEach(x => unprotectElement(x, makeNode));
      delete elementMeta.workerCache;
    }

    // We're rendering in the UI thread.
    elementMeta.isRendering = true;

    // Whenever we render in the UI-thread, ensure that the Worker gets a
    // refreshed copy of the `oldTree`.
    elementMeta.updateWorkerTree = true;

    let newTree = null;

    if (typeof newHTML === 'string') {
      newTree = parseHTML(newHTML, options.inner);
    }
    else {
      newTree = makeNode(newHTML);
    }

    if (options.inner) {
      let childNodes = Array.isArray(newTree) ? newTree : [newTree];

      newTree = {
        childNodes,
        attributes: elementMeta.oldTree.attributes,
        uuid: elementMeta.oldTree.uuid,
        nodeName: elementMeta.oldTree.nodeName,
        nodeValue: elementMeta.oldTree.nodeValue
      };
    }

    // Synchronize the tree.
    let patches = syncNode(elementMeta.oldTree, newTree);
    let invokeRender = completeRender(element, elementMeta);

    // Process the data immediately and wait until all transition callbacks
    // have completed.
    let processPromise = processPatches(element, patches);

    // Operate synchronously unless opted into a Promise-chain.
    if (processPromise) {
      processPromise.then(invokeRender).catch(ex => console.log(ex));
    }
    else {
      invokeRender();
    }
  }
}
