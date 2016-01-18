'use strict';

// These are globally defined to avoid issues with JSHint thinking that we're
// referencing unknown identifiers.
var parseHTML;
var syncNode;
var pools;
var unprotectElement;
var protectElement;
var cleanMemory;

/**
 * This is the Web Worker source code. All globals here are defined in the
 * worker/create module. This allows code sharing and less duplication since
 * most of the logic is identical to the UI thread.
 *
 * @param worker - A worker instance
 */
export default function startup(worker) {
  var patches = [];
  var oldTree = null;

  /**
   * Triggered whenever a `postMessage` call is made on the Worker instance
   * from the UI thread. Signals that some work needs to occur. Will post back
   * to the main thread with patch and node transform results.
   *
   * @param e - The normalized event object.
   */
  worker.onmessage = function(e) {
    var data = e.data;
    var isInner = data.isInner;
    var newTree = null;

    // If an `oldTree` was provided by the UI thread, use that in place of the
    // current `oldTree`.
    if (data.oldTree) {
      if (oldTree) {
        unprotectElement(oldTree);
        cleanMemory();
      }

      oldTree = data.oldTree;
    }

    // If the `newTree` was provided to the worker, use that instead of trying
    // to create one from HTML source.
    if (data.newTree) { newTree = data.newTree; }

    // If no `newTree` was provided, we'll have to try and create one from the
    // HTML source provided.
    else if (typeof data.newHTML === 'string') {
      // Calculate a new tree.
      newTree = parseHTML(data.newHTML, isInner);

      // If the operation is for `innerHTML` then we'll retain the previous
      // tree's attributes, nodeName, and nodeValue, and only adjust the
      // childNodes.
      if (isInner) {
        var childNodes = newTree;

        newTree = {
          childNodes,
          attributes: oldTree.attributes,
          uuid: oldTree.uuid,
          nodeName: oldTree.nodeName,
          nodeValue: oldTree.nodeValue
        };
      }
    }

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be executed to update the DOM.
    syncNode(oldTree, newTree, patches);

    // Protect the current `oldTree` so that Nodes will not be accidentally
    // recycled in the cleanup process.
    protectElement(oldTree);

    // Send the patches back to the userland.
    worker.postMessage({
      // All the patches to apply to the DOM.
      patches: patches
    });

    // Recycle allocated objects back into the pool.
    cleanMemory();

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}
