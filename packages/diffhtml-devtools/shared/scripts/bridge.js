import unique from 'unique-selector';

const cacheTask = [];
const selectors = new Map();
const { assign } = Object;
const toggleMiddleware = {};
const placeholders = new Set();
const anon = 'anonymous_';

function getMiddlewareName(userMiddleware, i) {
  const raw = userMiddleware.displayName || userMiddleware.name || anon + i;

  return [raw, raw
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .split(' ').slice(0, -1).join(' ')];
}

// Called by diffHTML index/runtime entry points.
export default function devTools(Internals) {
  let extension = null;
  let interval = null;

  // Toggle if a middleware is enabled/disabled.
  document.addEventListener('diffHTML:toggleMiddleware', ev => {
    const { detail } = ev;

    Internals.MiddlewareCache.forEach((userMiddleware, i) => {
      const [ raw, name ] = getMiddlewareName(userMiddleware);

      // Ignore Middleware names that don't match.
      if (detail.name !== name) {
        return;
      }

      // If we are enabling, and have previously disabled, remove the
      // placeholder and add back the original.
      if (detail.enabled && toggleMiddleware[name]) {
        const middleware = toggleMiddleware[name];
        Internals.MiddlewareCache.delete(userMiddleware);
        Internals.MiddlewareCache.add(middleware);
        delete toggleMiddleware[name];

        if (middleware.subscribe) {
          middleware.subscribe(Internals);
        }
      }
      // Otherwise if we are disabling, and have not previously disabled, cache
      // the current middleware, and replace with a placeholder.
      else if (!detail.enabled && !toggleMiddleware[name]) {
        Internals.MiddlewareCache.delete(userMiddleware);
        toggleMiddleware[name] = userMiddleware;
        Internals.MiddlewareCache.add(assign(() => {}, { displayName: raw }));

        if (userMiddleware.unsubscribe) {
          userMiddleware.unsubscribe();
        }
      }
    });
  });

  document.addEventListener('diffHTML:gc', () => {
    Internals.memory.gc();
  });

  const filterVTree = vTree => {
    if (!vTree) { return vTree; }

    if (typeof vTree.rawNodeName === 'function') {
      vTree.nodeName = vTree.rawNodeName.name;
    }

    vTree.childNodes = vTree.childNodes.map(filterVTree);
    return vTree;
  };

  const pollForFunction = () => new Promise(resolve => {
    if (window.__diffHTMLDevTools) {
      resolve(window.__diffHTMLDevTools);
    }
    else {
      // Polling interval that looks for the diffHTML devtools hook.
      interval = setInterval(() => {
        if (window.__diffHTMLDevTools) {
          clearInterval(interval);
          resolve(window.__diffHTMLDevTools);
        }
      }, 2000);
    }
  });

  const getInternals = () => {
    const { VERSION, Pool, MiddlewareCache } = Internals;
    const middleware = [];

    MiddlewareCache.forEach(userMiddleware => {
      const [ raw, name ] = getMiddlewareName(userMiddleware);

      middleware.push(name);
    });

    const mounts = [];

    selectors.forEach((tree, selector) => mounts.push({
      selector,
      tree: filterVTree(tree),
    }));

    const memory = {
      time: Date.now(),
      free: Pool.memory.free.size,
      allocated: Pool.memory.allocated.size,
      protected: Pool.memory.protected.size,
    };

    return {
      version: VERSION,
      middleware,
      mounts,
      memory,
    };
  };

  function devToolsTask(transaction) {
    const {
      domNode, markup, options, state: { newTree }, state
    } = transaction;

    const selector = unique(domNode);
    const startDate = performance.now();
    const start = function() {
      return extension.startTransaction({
        domNode: selector,
        markup,
        options,
        state: assign({}, state, state.nextTransaction && {
          nextTransaction: undefined,
        }, {
          activeTransaction: undefined,
        }),
      });
    };

    if (extension) {
      start();
    }

    selectors.set(selector, newTree);

    return function() {
      const endDate = performance.now();
      const patches = JSON.parse(JSON.stringify(transaction.patches));
      const promises = transaction.promises.slice();

      transaction.onceEnded(() => {
        // Update with the newTree after a render has completed.
        selectors.set(selector, transaction.oldTree);

        const { aborted, completed } = transaction;
        const stop = () => extension.endTransaction(startDate, endDate, {
          domNode: selector,
          markup,
          options,
          state: assign({}, state, state.nextTransaction && {
            nextTransaction: undefined,
          }, {
            activeTransaction: undefined,
          }),
          patches,
          promises,
          completed,
          aborted,
        });

        if (!extension) { cacheTask.push(() => stop()); } else { stop(); }
      });
    };
  }

  devToolsTask.subscribe = () => {
    pollForFunction().then(devToolsExtension => {
      extension = devToolsExtension().activate({
        inProgress: [],
        completed: [],
        ...getInternals()
      });

      // Every two seconds refresh the internal state.
      // FIXME This is so that internals are properly updated over time, but
      // should probably be updated to only trigger when necessary.
      //setInterval(() => {
      //  extension.activate(getInternals());
      //}, 1000);

      if (cacheTask.length) {
        setTimeout(() => {
          cacheTask.forEach(cb => cb());
          cacheTask.length = 0;
        }, 250);
      }
    })
    .catch(console.log);
  };

  return devToolsTask;
}
