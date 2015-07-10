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

    // Replace the entire Node.
    else if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch.new, patch.old);
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
function patch(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.disableWorker !== 'boolean') {
    options.disableWorker = document.DISABLE_WORKER;
  }

  var wantsWorker = hasWorker && !options.disableWorker;

  if (element.__is_rendering__) { return; }

  if (typeof newHTML !== 'string') {
    throw new Error('Invalid type passed to diffHTML, expected String');
  }

  // Only calculate the parent's initial state one time.
  if (!element.__old_tree__) {
    element.__old_tree__ = makeNode(element);
  }
  // InnerHTML is the same.
  else if (options.inner && element.innerHTML === newHTML) {
    return;
  }
  // OuterHTML is the same.
  else if (!options.inner && element.outerHTML === newHTML) {
    return;
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (wantsWorker && hasWorker && element.__has_rendered__) {
    // Attach all properties here to transport.
    var transferObject = {
      oldTree: element.__old_tree__
    };

    // First time syncing needs the current tree.
    if (!element.__synced__) {
      transferObject.oldTree = element.__old_tree__;
    }

    element.__synced__ = true;

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
    transferObject.isInner = options.inner;

    // Set a render lock as to not flood the worker.
    element.__is_rendering__ = true;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject, [transferBuffer.buffer]);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function(e) {
      processPatches(element, e);
      element.__is_rendering__ = false;
    };
  }
  else if (!wantsWorker || !hasWorker || !element.__has_rendered__) {
    var oldTree = element.__old_tree__;
    var newTree = htmls.parseHTML(newHTML);
    var patches = [];

    var oldNodeName = oldTree.nodeName || '';
    var newNodeName = newTree && newTree.nodeName;

    // If the element node types match, try and compare them.
    if (oldNodeName === newNodeName) {
      // Synchronize the tree.
      syncNode.sync.call(patches, element.__old_tree__, newTree);
    }
    // Otherwise replace the top level elements.
    else if (newHTML) {
      patches.push({
        __do__: 0,
        old: oldTree,
        new: newTree
      });

      element.__old_tree__ = newTree;
    }

    // Attach inner state.
    patches.isInner = options.inner;

    // Process the patches immediately.
    processPatches(element, { data: patches });

    // Mark this element as initially rendered.
    if (!element.__has_rendered__) {
      element.__has_rendered__ = true;
    }

    // Element has stopped rendering.
    element.__is_rendering__ = false;

    // Clean out the patches array.
    patches.length = 0;
  }
}

module.exports = patch;
