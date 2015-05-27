function startup(worker) {
  // Initialize the pool with a reasonable amount of objects.
  initializePools(1000);

  var oldTree = null;
  var patches = [];

  worker.onmessage = function(e) {
    var data = e.data;
    var offset = data.offset;
    var transferBuffer = data.buffer;

    var newBuffer = transferBuffer.slice(0, offset);
    var newHTML = bufferToString(newBuffer);

    if (offset && !oldTree) {
      var oldBuffer = transferBuffer.slice(offset, transferBuffer.byteLength);

      // Keep a virtual tree in memory to diff against.
      oldTree = JSON.parse(bufferToString(oldBuffer));
    }

    // Calculate a new tree.
    var newTree = parseHTML(newHTML);

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be excuted to update the DOM.
    syncNode.call(patches, oldTree, newTree);

    // Send the patches back to the userland.
    worker.postMessage(patches);

    // Wipe out the patches in memory.
    patches.length = 0;
  };
}

module.exports = startup;
