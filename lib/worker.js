'use strict';

var bufferToString;
var parseHTML;
var syncNode;
var pools;

/**
 * startup
 *
 * @param worker
 * @return
 */
function startup(worker) {
  var oldTree = null;
  var patches = [];

  worker.onmessage = function(e) {
    var data = e.data;
    var offset = data.offset;
    var transferBuffer = data.buffer;
    var isInner = data.isInner;

    // Keep a virtual tree in memory to diff against.
    if (data.oldTree) {
      oldTree = data.oldTree;
    }

    var newTree = null;

    if (data.newTree) {
      newTree = data.newTree;
    }
    else {
      var newHTML = bufferToString(transferBuffer, offset);

      // Calculate a new tree.
      newTree = parseHTML(newHTML, isInner);

      if (isInner) {
        var childNodes = newTree;

        newTree = {
          childNodes,

          attributes: oldTree.attributes,
          element: oldTree.element,
          nodeName: oldTree.nodeName,
          nodeValue: oldTree.nodeValue
        };
      }
    }

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be excuted to update the DOM.
    syncNode.call(patches, oldTree, newTree);

    // Send the patches back to the userland.
    worker.postMessage(patches);

    // Cleanup sync node allocations.
    pools.object.freeAll();
    pools.array.freeAll();

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

export default startup;
