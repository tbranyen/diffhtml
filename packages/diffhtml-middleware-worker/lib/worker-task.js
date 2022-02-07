import diff from './util/binding';
import globalThis from './util/global';
import nodeWorkerThread from './util/node-worker-threads';
import { getUUID } from './get-uuid.js';

const { Internals } = diff;
const { assign } = Object;
const { wait, exchange } = Atomics;

const linker = new WeakMap();
const reloadable = new Map();
let isNode = false;
let parentPort;
let workerData;
let view = null;

// Support Node.js
if (nodeWorkerThread) {
  parentPort = nodeWorkerThread.parentPort;
  workerData = nodeWorkerThread.workerData;
  isNode = true;
}

export const workerTask = ({
  send,
  callers = new Map(),
  live,
} = {}) => assign(function workerTask(transaction) {
  const createEventProxy = () => new Proxy({}, {
    get(target, keyName) {
      console.log('get event property', keyName);
    },
  });

  if (!isNode) {
    send = postMessage;

    self.addEventListener('message', e => {
      const { type, ...rest } = e.data;

      // Handle function call
      if (type === 'event') {
        const { __caller } = rest;

        if (callers.has(__caller)) {
          const eventProxy = createEventProxy();
          callers.get(__caller)(eventProxy);
        }
      }
    });
  }
  else {
    // Don't let a thread last longer than 12 hours, they will be
    // killed earlier in most cases.
    const MAX_TTL = 12 * 60 * 60 * 1000;

    // Kill a thread if it lives longer than TTL, this also acts as a
    // keep-alive for node threads that run out of work.
    setTimeout(() => { process.exit(); }, MAX_TTL);

    send = message => parentPort.postMessage(message);

    // Listen for incoming bi-directional messages.
    parentPort.on('message', e  => {
      const { type, ...rest } = JSON.parse(Buffer.from(e).toString());

      // Handle function call
      if (type === 'event') {
        const { __caller } = rest;

        if (callers.has(__caller)) {
          const eventProxy = createEventProxy();
          callers.get(__caller)(eventProxy);
        }
      }
    });

    if (live) {
      async function reload(url) {
        return (await import(`${url}#${Math.random()}`)).default;
      }

      if (live.watch) {
        (async () => {
          const { watch, statSync } = await import('fs');
          const { join } = await import('path');

          const rewatch = (dir) => watch(dir, {}, async (type, fileName) => {
            // Only handle change events and real files.
            if (type !== 'change' || (
              !fileName.includes('.') && !fileName.includes('/')
            )) return;

            // breathing room for rename to compelte
            const ReloadableComponent = await reload(join(live.watch, fileName));

            reloadable.forEach((displayName, vTree) => {
              if (displayName === (ReloadableComponent.displayName || ReloadableComponent.name)) {
                if (live.InstanceCache.has(vTree)) {
                  const component = live.InstanceCache.get(vTree);
                  const $$vTree = component[Symbol.for('diff.vTree')];
                  $$vTree.rawNodeName = ReloadableComponent;
                  component.forceUpdate();
                  //Object.assign(component, ReloadableComponent);
                }
              }
            });
          });

          rewatch(live.watch);
        })();
      }
    }
  }

  if (transaction.config.skipWorker) {
    return undefined;
  }

  // Use a shared array buffer and atomics to facilitate synchronous
  // communication within a worker.
  const buffer = new SharedArrayBuffer(1024);
  view = new Int32Array(buffer);

  // Always generate a SharedArrayBuffer first. As our worker needs to be able
  // to immediately execute synchronous code and be safely blocked.
  send({ type: 'sab', buffer });

  const currentTasks = transaction.tasks;
  const indexOfPatchNode = currentTasks.indexOf(Internals.tasks.patchNode);

  const link = patches => patches.map(x => {
    // Already found, return.
    if (linker.has(x)) {
      return linker.get(x);
    }

    if (x && x.__caller) {
      return { __caller: x.__caller };
    }

    if (typeof x === 'function') {
      const __caller = x.__caller || getUUID();
      callers.set(__caller, x);
      x.__caller = __caller;
      return { __caller };
    }

    // If x is a protected VTree (meaning it's used)
    if (Internals.Pool.memory.protected.has(x) || Internals.Pool.memory.allocated.has(x)) {
      // Needs a link added.
      const __link = x === transaction.oldTree ? 'mount' : getUUID();
      const isSvg = transaction.state.svgElements.has(x) || x.nodeName === 'svg';
      const retVal = {
        __link,
        isSvg,
      };

      for (const attrName in x.attributes) {
        const val = x.attributes[attrName];

        if (typeof val === 'function') {
          const __caller = val.__caller || getUUID();
          callers.set(__caller, val);
          val.__caller = __caller;
          x.attributes[attrName] = { __caller };
        }
      }

      linker.set(x, retVal);
      x.isSvg = isSvg;
      x.__link = __link;
      return x;
    }

    return x;
  });

  // Replace patchNode with skipPatch and return array of patches
  // synchronously
  currentTasks.splice(indexOfPatchNode, 1, function skipPatch() {
    const patches = link(transaction.patches);
    const { uuid } = transaction.config;

    send({ type: 'patches', uuid, patches });
    transaction.end();

    return patches;
  });
}, {
  subscribe: () => {
    /**
     *
     * @param {string} target
     */
    const trackGlobal = (target) => {
      const cacheMap = new Map();

      globalThis[target] = new Proxy({}, {
        set: (_target, keyName, value) => {
          let newValue = null;

          // Generate a caller for the function.
          if (typeof value === 'function') {
            const __caller = value.__caller || getUUID();
            callers.set(__caller, value);
            value.__caller = __caller;
            newValue = { __caller };
          }

          send({
            type: 'set',
            target,
            keyName,
            value: newValue,
          });

          wait(view, 0, 0);
          exchange(view, 0, 0);

          return true;
        },

        get: (_target, keyName) => {
          const id = target+':'+keyName;

          // If fetched in the same tick, reuse the cache value.
          if (cacheMap.has(id)) {
            return cacheMap.get(id);
          }

          send({ type: 'get', target, keyName });
          wait(view, 0, 0);
          exchange(view, 0, 0);

          // On next tick clear out the cache.
          setTimeout(() => cacheMap.delete(id));

          cacheMap.set(id, view[1]);

          return view[1];
        },
      });
    };

    trackGlobal('window');
    trackGlobal('document');

    const oldLog = console.log;

    console.log = (message, ...rest) => {
      send({ type: 'log', level: 'log', message: [message].concat(rest) });
      return oldLog.apply(null, [message].concat(rest));
    };
  },

  createTreeHook: (vTree) => {
    if (live && typeof vTree.rawNodeName === 'function') {
      reloadable.set(
        vTree,
        vTree.rawNodeName.displayName || vTree.rawNodeName.name,
      );

      //console.log('Should reload', vTree.nodeName);
      // Whenever we find a component, run new Error().stack to
      // find the file it came from. Use this to create a mapping
      // to share whenever live is looking up which component
      // changed.
      //
      // From there we can get the component to forceUpdate using
      // the latest component.
    }

    for (const attrName in vTree.attributes) {
      const val = vTree.attributes[attrName];

      if (val.__caller) {
        vTree.attributes[attrName] = { __caller: val.__caller };
      }
      else if (typeof val === 'function') {
        const __caller = getUUID();
        const fn = vTree.attributes[attrName];
        vTree.attributes[attrName] = { __caller };
        val.__caller = __caller;
        callers.set(__caller, fn);
      }
    }
  },

  workerData,

  releaseHook: vTree => linker.delete(vTree),
});
