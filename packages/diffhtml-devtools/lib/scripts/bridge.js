import unique from 'unique-selector';

const { stringify, parse } = JSON;
const cacheTask = [];
const selectors = new Map();
const { assign } = Object;
const toggleMiddleware = {};
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
  let schedule = null;
  let interval = null;
  let ackTimeout = null;
  let scheduleTimeout = null;
  let pollingForDiffHTML = false;

  // Toggle if a middleware is enabled/disabled.
  document.addEventListener('diffHTML:toggleMiddleware', ev => {
    const detail = typeof ev.detail === 'string' ? parse(ev.detail) : ev.detail;

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
          userMiddleware.unsubscribe(Internals);
        }
      }
    });
  });

  document.addEventListener('diffHTML:gc', () => {
    Internals.memory.gc();
    extension.activate(getInternals());
  });

  const filterVTree = vTree => {
    if (!vTree) { return vTree; }

    if (typeof vTree.rawNodeName === 'function') {
      vTree.nodeName = vTree.rawNodeName.displayName || vTree.rawNodeName.name;
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
      clearInterval(interval);
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
      const [ __unused, name ] = getMiddlewareName(userMiddleware);
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
      mount, input, config, newTree, state
    } = transaction;

    const isFunction = typeof mount.rawNodeName === 'function';
    const selector = unique(mount) ||
      `${isFunction ? mount.rawNodeName.displayName || mount.rawNodeName.name : mount.rawNodeName}`;
    const startDate = performance.now();

    const start = () => {
      selectors.set(selector, input);

      return extension.startTransaction(startDate, {
        mount: selector,
        markup: input,
        config: {
          ...config,
          tasks: config.tasks.map(task => task.displayName || task.name),
        },
        state,
      });
    };

    // Start task.
    if (!extension) {
      // FIXME Comment this out if it's causing issues... and figure out why
      // issues are being caused.
      //cacheTask.push(() => start());
    } else {
      start();
    }

    return function() {
      // TODO Make patches a separate asynchronous operation, and only
      // aggregate when completed.
      const patches = parse(stringify(transaction.patches));

      transaction.onceEnded(() => {
        const endDate = performance.now();
        const { aborted, completed } = transaction;
        const stop = () => extension.endTransaction(startDate, endDate, {
          mount: selector,
          markup: input,
          config: {
            ...config,
            tasks: config.tasks.map(task => task.displayName || task.name),
          },
          state,
          patches,
          completed,
          aborted,
        });

        if (!extension) {
          cacheTask.push(() => stop());
        } else {
          stop();
        }
      });
    };
  }

  async function setExtension(initial) {
    pollingForDiffHTML = true;
    const devToolsExtension = await pollForFunction();
    pollingForDiffHTML = false;

    extension = devToolsExtension().activate({
      // Reset counts per unique activation.
      inProgress: initial ? [] : null,
      completed: initial ? [] : null,

      ...getInternals(),
    });
  }

  // Send a ping every 4 seconds. If we do not receive a response and time out,
  // reconnect.
  function keepAlive() {
    // Clear timeouts every time this is called.
    clearTimeout(scheduleTimeout);
    clearTimeout(ackTimeout);

    // Send ping on every keepAlive call.
    extension.ping();

    // After a successful ping, schedule another keepAlive after 5 seconds..
    schedule = () => {
      clearTimeout(ackTimeout);
      scheduleTimeout = setTimeout(keepAlive, 1000);
      !pollingForDiffHTML && setExtension();
    };

    // If we do not receive a response after 1 second, try and reconnect after
    // another second.
    ackTimeout = setTimeout(() => {
      document.removeEventListener('diffHTML:pong', schedule);
      clearTimeout(scheduleTimeout);
      scheduleTimeout = setTimeout(keepAlive, 1000);
    }, 1000);

    document.removeEventListener('diffHTML:pong', schedule);
    document.addEventListener('diffHTML:pong', schedule, { once: true });
  }

  devToolsTask.subscribe = async () => {
    await setExtension(true);

    // Start keep-alive in case we disconnect.
    keepAlive();

    // Call existing cached tasks.
    if (cacheTask.length) {
      setTimeout(() => {
        cacheTask.forEach(cb => cb());
        cacheTask.length = 0;
      }, 1000);
    }
  };

  devToolsTask.unsubscribe = async () => {
    clearInterval(interval);
    clearTimeout(ackTimeout);
    clearTimeout(scheduleTimeout);

    document.removeEventListener('diffHTML:pong', schedule);
  };

  return devToolsTask;
}
