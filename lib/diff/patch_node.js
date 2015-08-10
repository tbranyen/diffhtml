import { pools, initializePools, createPool } from '../util/pools';

var poolCount = 10000;

// Initialize with a reasonable amount of objects.
initializePools(poolCount);

import parseHTML from '../util/htmls';
import { makeParser } from '../util/parser';
import * as buffers from '../util/buffers';
import { uuid } from '../util/uuid';
import { syncNode } from './sync_node';
import makeNode from './make_node';
import makeElement from './make_element';
import workerSource from '../worker';

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
      uuid,

      // Add in pool manipulation methods.
      createPool,
      initializePools,
      'initializePools(' + poolCount + ');',

      // Add in Node manipulation.
      syncNode,

      // Add in the ability to parseHTML.
      parseHTML,

      // Give the webworker utilities.
      buffers.stringToBuffer,
      buffers.bufferToString,

      makeParser,
      'var parser = makeParser();',

      // Add in the worker source.
      workerSource,

      // Metaprogramming up this worker call.
      'startup(self);'
    ].join('\n')
  ], { type: 'application/javascript' });

  // Construct the worker and start it up.
  var worker = new Worker(URL.createObjectURL(workerBlob));
}

/**
 * getElement
 *
 * @param ref
 * @return
 */
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
  var states = element._transitionStates;

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

    // Replace the entire Node.
    if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch.new, patch.old);
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        var fragment = document.createDocumentFragment();

        patch.fragment.forEach(function(elementDescriptor) {
          var element = getElement(elementDescriptor);

          fragment.appendChild(element);

          // Added state for transitions API.
          if (states && states.added) {
            states.added.forEach(function(callback) {
              callback(element);
            });
          }
        });

        patch.element.appendChild(fragment);
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        var removeNode = function() {
          this.parentNode.removeChild(this);
          makeNode.nodes[oldId] = null;
          delete makeNode.nodes[oldId];
        }.bind(patch.old);

        var removed;

        if (states && states.removed) {
          removed = states.removed.map(function(callback) {
            return callback(patch.old);
          });
        }

        Promise.all(removed).then(removeNode);
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        // Append the element first, before doing the replacement.
        patch.old.parentNode.insertBefore(patch.new, patch.old.nextSibling);

        var removeNode = function() {
          this[0].parentNode.replaceChild(this[1], this[0]);
          makeNode.nodes[oldId] = null;
          delete makeNode.nodes[oldId];
        }.bind([patch.old, patch.new]);

        var added, removed, replaced;

        // Added state for transitions API.
        if (states && states.added) {
          added = states.added.map(function(callback) {
            return callback(patch.new);
          });
        }

        // Removed state for transitions API.
        if (states && states.removed) {
          removed = states.removed.map(function(callback) {
            return callback(patch.old);
          });
        }

        // Removed state for transitions API.
        if (states && states.replaced) {
          replaced = states.removed.map(function(callback) {
            return callback(patch.old, patch.new);
          });
        }

        // Replaced state for transitions API.
        Promise.all([].concat(added, removed, replaced)).then(removeNode);
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

  //if (typeof newHTML !== 'string') {
  //  throw new Error('Invalid type passed to diffHTML, expected String');
  //}

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

    if (typeof newHTML !== 'string') {
      transferObject.newTree = makeNode(newHTML);

      // Set a render lock as to not flood the worker.
      element.__is_rendering__ = true;

      // Transfer this buffer to the worker, which will take over and process the
      // markup.
      worker.postMessage(transferObject);

      // Wait for the worker to finish processing and then apply the patchset.
      worker.onmessage = function(e) {
        processPatches(element, e);
        element.__is_rendering__ = false;
      };

      return;
    }

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
    var patches = [];
    var oldTree = element.__old_tree__;
    var newTree = typeof newHTML === 'string'
      ? parseHTML(newHTML) : makeNode(newHTML);

    var oldNodeName = oldTree.nodeName || '';
    var newNodeName = newTree && newTree.nodeName;

    // If the element node types match, try and compare them.
    if (oldNodeName === newNodeName) {
      // Synchronize the tree.
      syncNode.call(patches, element.__old_tree__, newTree);
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
