function startup(worker) {
  var oldTree = null;
  var patches = [];

  worker.onmessage = function(e) {
    //console.time('render');
    var data = e.data;
    var offset = data.offset;
    var transferBuffer = data.buffer;
    var isInner = data.isInner;

    var newBuffer = transferBuffer.slice(0, offset);
    var newHTML = bufferToString(newBuffer);

    if (offset && !oldTree) {
      // Keep a virtual tree in memory to diff against.
      oldTree = e.data.oldTree;
    }

    // Calculate a new tree.
    //console.time('parse');
    var newTree = parseHTML(newHTML);
    //console.timeEnd('parse');

    // Synchronize the old virtual tree with the new virtual tree.  This will
    // produce a series of patches that will be excuted to update the DOM.
    //console.time('sync');
    syncNode.call(patches, oldTree, newTree);
    //console.timeEnd('sync');

    // Attach inner state.
    patches.isInner = isInner;

    // Send the patches back to the userland.
    worker.postMessage(patches);

    // Free the new tree, as this node will never change.
    //console.time('clean');
    //console.log(pools.uuid._allocated.length);

    // Cleanup sync node allocations.
    pools.uuid.freeAll();
    pools.object.freeAll();
    pools.array.freeAll();

    //console.timeEnd('clean');
    //console.info('Objects free: %s', pools.array._free.length);
    //console.info('Arrays allocated: %o', pools.array._allocated);
    //console.info('Objects allocated: %o', pools.object._allocated);
    //console.info('UUIDs allocated: %o', pools.uuid._allocated);

    // Wipe out the patches in memory.
    patches.length = 0;
    //console.timeEnd('render');
  };
}

module.exports = startup;
