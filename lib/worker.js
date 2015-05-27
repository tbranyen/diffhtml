function startup(worker) {
  // Initialize the pool with a reasonable amount of objects.
  initializePools(1000);
  syncNode.cleanup = pools.array.get();

  var oldTree = null;
  var patches = [];

  worker.onmessage = function(e) {
    var data = e.data;
    var offset = data.offset;
    var transferBuffer = data.buffer;
    var nodeName = e.data.nodeName;

    var newBuffer = transferBuffer.slice(0, offset);
    var newHTML = bufferToString(newBuffer);

    if (offset && !oldTree) {
      // Keep a virtual tree in memory to diff against.
      oldTree = e.data.oldTree;
    }

    // Calculate a new tree.
    var newTree = parseHTML(nodeName, newHTML);

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be excuted to update the DOM.
    syncNode.call(patches, oldTree, newTree);

    // Send the patches back to the userland.
    worker.postMessage(patches);

    // Cleanup sync node allocations.
    syncNode.cleanup.forEach(pools.array.free);
    syncNode.cleanup.length = 0;

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

module.exports = startup;
