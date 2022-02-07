import diff from './util/binding';

const { Internals } = diff;

const { assign } = Object;
const { stringify } = JSON;
const linker = new Map();

export const mainTask = ({
  // TODO Merge socket and worker args together into one named bridge
  // or something similar.
  //
  // WebSocket connection for the main thread.
  socket = null,
  worker = null,
} = {}) => assign(function webWorkerTask(transaction) {
  const currentTasks = transaction.tasks;
  const indexOfSyncTrees = currentTasks.indexOf(Internals.tasks.syncTrees);

  // Only run this middleware when patches are present.
  if (!('patches' in transaction.config)) {
    return;
  }

  const link = vTree => {
    if (vTree && vTree.childNodes) {
      Internals.Pool.memory.protected.add(vTree);
      linker.set(vTree.__link, vTree);
      vTree.childNodes.forEach(x => link(x));
    }
  };

  // Replace syncTrees with injectPatches
  currentTasks.splice(indexOfSyncTrees, 1, function injectPatches() {
    transaction.patches = transaction.config.patches.map(x => {
      // Handle dom events, custom element properties, etc. Any time you need
      // a function, we proxy the call and the arguments.
      if (x && x.__caller) {
        return function(e) {
          // TODO handled by synthetic events middleware
          e.preventDefault();
          e.stopPropagation();

          if (socket) {
            socket.send(stringify({ type: 'event', ...x }));
          }
          else {
            worker.postMessage({ type: 'event', ...x });
          }
        };
      }

      if (!x || typeof x !== 'object' || !('__link' in x)) {
        return x;
      }

      let vTree = x;

      if (linker.has(x.__link)) {
        vTree = linker.get(x.__link);
        return vTree;
      }
      else if (x.__link === 'mount') {
        vTree = transaction.oldTree;
      }
      else {
        link(vTree);
      }

      if (((x && x.isSvg) || (vTree && vTree.isSvg)) && vTree) {
        transaction.state.svgElements.add(vTree);
      }

      return vTree;
    });
  });
}, {
  releaseHook: vTree => {
    if (vTree && vTree.__link) {
      linker.delete(vTree.__link);
    }
  },
});
