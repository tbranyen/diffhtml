var pools = require('../util/pools');
var htmls = require('../util/htmls');
var buffers = require('../util/buffers');
var syncNode = require('./sync_node');
var makeNode = require('./make_node');
var makeElement = require('./make_element');

// Initialize with a reasonable amount of objects.
pools.initialize(1000);

var hasWorker = typeof Worker === 'function';
var oldTree = null;
var isRendering = false;

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

      // Add in Node manipulation.
      syncNode.filter,
      syncNode.sync,

      // Add in the ability to parseHTML.
      htmls.cleanDoc,
      htmls.parseHTML,

      // Give the webworker utilities.
      buffers.stringToBuffer,
      buffers.bufferToString,

      // Testing better parsing.
      require('../util/test') + '; test();',

      'var parser = new parse5.Parser();',

      // Add in the worker source.
      require('../worker'),

      // Metaprogramming up this worker call.
      'startup(self);'
    ].join('\n')
  ], { type: 'application/javascript' });

  // Construct the worker and start it up.
  var worker = new Worker(URL.createObjectURL(workerBlob));
}

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML) {
  if (isRendering) { return; }
  // Used to specify the outerHTML offset if passing the parent's markup.
  var offset = 0;

  // Craft a new buffer with the new contents.
  var newBuffer = buffers.stringToBuffer(newHTML);

  // Only calculate the parent's initial state one time.
  if (!oldTree) {
    oldTree = makeNode(element);

    // This is untenable for large DOMs.
    var oldBuffer = buffers.stringToBuffer(JSON.stringify(oldTree));

    element.__source__ = newHTML;
  }
  // Same markup being applied, early exit.
  else if (element.__source__ === newHTML) {
    return;
  }

  // Set the offset to be this byte length.
  offset = newBuffer.byteLength;

  // Set the old byte length to 0 if it's not included.
  var oldByteLength = oldBuffer ? oldBuffer.byteLength : 0;

  // Calculate the bytelength for the transfer buffer, contains one extra for
  // the offset.
  var transferByteLength = newBuffer.byteLength + oldByteLength;

  // This buffer starts with the offset and contains the data to be carried
  // to the worker.
  var transferBuffer = new Uint16Array(transferByteLength);

  // Set the newHTML payload.
  transferBuffer.set(newBuffer, 0);

  // If the old buffer was set, place it right after the oldHTML, offset by
  // one to account for the offset.
  if (oldBuffer) {
    transferBuffer.set(oldBuffer, offset);
  }

  // Transfer this buffer to the worker, which will take over and process the
  // markup.
  worker.postMessage({
    offset: newBuffer.byteLength,
    buffer: transferBuffer.buffer
  }, [transferBuffer.buffer]);

  isRendering = true;

  // Wait for the worker to finish processing and then apply the patchset.
  worker.onmessage = processPatches;

  function getElement(ref) {
    var element = ref.element;

    // Already created.
    if (makeNode.nodes[element]) {
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
  function processPatches(e) {
    var patches = e.data;
    //console.log(patches);

    // Loop through all the patches and apply them.
    for (var i = 0; i < patches.length; i++) {
      var patch = patches[i];

      if (patch.element) {
        var elementId = patch.element.element;
        patch.element = getElement(patch.element);
      }

      if (patch.old) {
        var oldId = patch.old.element;
        patch.old = getElement(patch.old);
      }

      if (patch.new) {
        var newId = patch.new.element;
        patch.new = getElement(patch.new);
      }

      // Quickly empty entire childNodes.
      if (patch.__do__ === -1) {
        patch.element.innerHTML = '';
        continue;
      }

      // Node manip.
      else if (patch.__do__ === 1) {
        // Add.
        if (patch.element && patch.fragment && !patch.old) {
          var fragment = document.createDocumentFragment();

          patch.fragment.forEach(function(element) {
            fragment.appendChild(getElement(element));
          });

          patch.element.appendChild(fragment);
        }

        // Remove
        else if (patch.old && !patch.new) {
          if (!patch.old.parentNode) {
            throw new Error('Can\'t remove without parent, is this the' +
              'document root?');
          }

          patch.old.parentNode.removeChild(patch.old);
          makeNode.nodes[oldId] = null;
          delete makeNode.nodes[oldId];
        }

        // Replace
        else if (patch.old && patch.new) {
          if (!patch.old.parentNode) {
            throw new Error('Can\'t replace without parent, is this the ' +
              'document root?');
          }

          patch.old.parentNode.replaceChild(patch.new, patch.old);

          makeNode.nodes[oldId] = null;
          delete makeNode.nodes[oldId];
        }
      }

      // Attribute manipulation.
      else if (patch.__do__ === 2) {
        // Remove.
        if (!patch.value) { patch.element.removeAttribute(patch.name); }
        else { patch.element.setAttribute(patch.name, patch.value); }
      }

      // Text node manipulation.
      else if (patch.__do__ === 3) {
        patch.element.nodeValue = patch.value;
      }
    }

    isRendering = false;
  };
}

module.exports = patch;
