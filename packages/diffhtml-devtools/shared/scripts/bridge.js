import unique from 'unique-selector';

const cacheTask = [];
const selectors = new Map();
const { assign } = Object;
const toggleMiddleware = {};
const placeholders = new Set();

export default function devTools(Internals) {
  let extension = null;
  let interval = null;

  document.addEventListener('diffHTML:toggleMiddleware', ev => {
    const { detail } = ev;

    [...Internals.MiddlewareCache].forEach(userMiddleware => {
      const name = userMiddleware.displayName || userMiddleware.name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .split(' ').slice(0, -1).join(' ');

      if (detail.name === name) {
        if (detail.enabled && toggleMiddleware[name]) {
          Internals.MiddlewareCache.add(toggleMiddleware[name]);
          delete toggleMiddleware[name];
        }
        else if (!detail.enabled) {
          toggleMiddleware[name] = userMiddleware;

          Internals.MiddlewareCache.add(assign(() => {}, { displayName: name }));
        }

        Internals.MiddlewareCache.delete(userMiddleware);
      }
    });
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
          resolve(window.__diffHTMLDevTools);
          clearInterval(interval);
        }
      }, 2000);
    }
  });

  const getInternals = () => {
    const { VERSION, Pool, MiddlewareCache } = Internals;
    const middleware = [];

    MiddlewareCache.forEach(userMiddleware => {
      if (userMiddleware.displayName) {
        return middleware.push(userMiddleware.displayName);
      }

      const name = userMiddleware.name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .split(' ').slice(0, -1).join(' ');

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
      domNode, markup, options, state: { oldTree, newTree }, state
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

    return function(transaction) {
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
      setInterval(() => {
        extension.activate(getInternals());
      }, 2000);

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
