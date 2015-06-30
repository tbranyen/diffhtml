var pools = require('../util/pools');
var poolCount = 10000;

// Initialize with a reasonable amount of objects.
pools.initialize(poolCount);

var htmls = require('../util/htmls');
var parser = require('../util/parser');
var buffers = require('../util/buffers');
var syncNode = require('./sync_node');
var makeNode = require('./make_node');
var makeElement = require('./make_element');

var hasWorker = typeof Worker === 'function';
var oldTree = null;
var isRendering = false;
var synced = false;

// Set up a WebWorker if available.
if (hasWorker) {
  // Construct the worker reusing code already organized into modules.
  var workerBlob = new Blob([
    [
      // Reusable Array methods.
      'var slice = Array.prototype.slice;',
      'var filter = Array.prototype.filter;',

      // Add a namespace to attach pool methods to.
      'var pools = {};',
      'var nodes = 0;',

      // Adds in a global `uuid` function.
      require('../util/uuid'),

      // Add in pool manipulation methods.
      pools.create,
      pools.initialize,
      'initializePools(' + poolCount + ');',

      // Add in Node manipulation.
      syncNode.filter,
      syncNode.sync,

      // Add in the ability to parseHTML.
      htmls.parseHTML,

      // Give the webworker utilities.
      buffers.stringToBuffer,
      buffers.bufferToString,

      parser.makeParser,
      'var parser = makeParser();',

      // Add in the worker source.
      require('../worker'),

      // Metaprogramming up this worker call.
      'startup(self);'
    ].join('\n')
  ], { type: 'application/javascript' });

  // Construct the worker and start it up.
  var worker = new Worker(URL.createObjectURL(workerBlob));
}

function getElement(ref) {
  var element = ref.element || ref;

  // Already created.
  if (element in makeNode.nodes) {
    return makeNode.nodes[element];
  }
  // Need to create.
  else {
    return makeElement(ref);
  }
}

/**
 * Processes an Array of patches.
 *
 * @param e
 * @return
 */
function processPatches(element, e) {
  var patches = e.data;
  var isInner = e.isInner;

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    var patch = patches[i];

    if (patch.element) {
      patch.element = getElement(patch.element);
      var elementId = patch.element;
    }

    if (patch.old) {
      patch.old = getElement(patch.old);
      var oldId = patch.old.element;
    }

    if (patch.new) {
      patch.new = getElement(patch.new);
      var newId = patch.new.element;
    }

    // Quickly empty entire childNodes.
    if (patch.__do__ === -1) {
      patch.element.innerHTML = '';
      continue;
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      var transitionEvent = new CustomEvent('transitionElement');

      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        var fragment = document.createDocumentFragment();

        patch.fragment.forEach(function(element) {
          fragment.appendChild(getElement(element));
        });

        patch.element.appendChild(fragment);

        // TODO Transition added.
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        patch.old.parentNode.removeChild(patch.old);
        makeNode.nodes[oldId] = null;
        delete makeNode.nodes[oldId];
        // TODO Transition removed.
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        transitionEvent.old = patch.old;
        transitionEvent.new = patch.new;
        transitionEvent.action = 'replaced';

        var oldEl = patch.old;
        var newEl = patch.new;

        // Append the element first, before doing the replacement.
        oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);

        element.dispatchEvent(transitionEvent);

        var removeChild = function() {
          var oldEl = patch.old;
          var newEl = patch.new;

          return function() {
            oldEl.parentNode.replaceChild(newEl, oldEl);
          };
        }();

        if (transitionEvent.promise) {
          transitionEvent.promise.then(removeChild, removeChild);
        }
        else {
          removeChild();
        }

        makeNode.nodes[oldId] = null;
        delete makeNode.nodes[oldId];
      }
    }

    // Attribute manipulation.
    else if (!isInner && patch.__do__ === 2) {
      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }
    }

    // Text node manipulation.
    else if (!isInner && patch.__do__ === 3) {
      patch.element.nodeValue = patch.value;
    }
  }
}

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML, isInner) {
  if (isRendering) { return; }

  if (typeof newHTML !== 'string') {
    throw new Error('Invalid type passed to diffHTML, expected String');
  }

  // Attach all properties here to transport.
  var transferObject = {};

  // Only calculate the parent's initial state one time.
  if (!oldTree) {
    oldTree = makeNode(element);
    transferObject.oldTree = oldTree;
  }
  // Same markup being applied, early exit.
  else if (element.__source__ === newHTML) {
    return;
  }

  // Always update the internal `__source__`.
  element.__source__ = newHTML;

  // Optionally disable workers.
  hasWorker = !Boolean(document.DISABLE_WORKER);

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (hasWorker && element.__has_rendered__) {
    // First time syncing needs the current tree.
    if (!synced) {
      transferObject.oldTree = oldTree;
    }

    synced = true;

    var start = Date.now();

    // Used to specify the outerHTML offset if passing the parent's markup.
    var offset = 0;

    // Craft a new buffer with the new contents.
    var newBuffer = buffers.stringToBuffer(newHTML);

    // Set the offset to be this byte length.
    offset = newBuffer.byteLength;

    // Calculate the bytelength for the transfer buffer, contains one extra for
    // the offset.
    var transferByteLength = newBuffer.byteLength;

    // This buffer starts with the offset and contains the data to be carried
    // to the worker.
    var transferBuffer = new Uint16Array(transferByteLength);

    // Set the newHTML payload.
    transferBuffer.set(newBuffer, 0);

    // Add properties to send to worker.
    transferObject.offset = newBuffer.byteLength;
    transferObject.buffer = transferBuffer.buffer;
    transferObject.isInner = isInner;

    // Set a render lock as to not flood the worker.
    isRendering = true;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject, [transferBuffer.buffer]);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function(e) {
      processPatches(element, e);
      isRendering = false;
    };
  }
  else if (!hasWorker || !element.__has_rendered__) {
    var newTree = htmls.parseHTML(newHTML);
    var patches = [];

    // Synchronize the tree.
    syncNode.sync.call(patches, oldTree, newTree);

    // Attach inner state.
    patches.isInner = isInner;

    // Process the patches immediately.
    processPatches(element, { data: patches });

    // Clean out this array.
    patches.length = 0;

    // Mark this element as initially rendered.
    if (!element.__has_rendered__) {
      element.__has_rendered__ = true;
    }

    // FIXME Why are these here?
    //pools.object.freeAll();
    //pools.array.freeAll();
    //pools.uuid.freeAll();
  }
}

module.exports = patch;
