import unique from 'unique-selector';

export default function devTools(Internals) {
  const cacheTask = [];
  const selectors = new Set();
  let extension = null;
  let interval = null;

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

  function devToolsTask(transaction) {
    const {
      domNode, markup, options, state: { oldTree, newTree }, state
    } = transaction;

    const selector = unique(domNode);
    selectors.add(selector);

    const startDate = performance.now();
    const start = function() {
      return extension.startTransaction({
        domNode: selector,
        markup,
        options,
        state: Object.assign({}, state, state.nextTransaction && {
          nextTransaction: undefined,
        }, {
          activeTransaction: undefined,
        }),
      });
    };

    if (extension) { start(); }

    return function() {
      const endDate = performance.now();
      const patches = JSON.parse(JSON.stringify(transaction.patches));
      const promises = transaction.promises.slice();

      transaction.onceEnded(() => {
        const { aborted, completed } = transaction;
        const stop = () => extension.endTransaction(startDate, endDate, {
          domNode: selector,
          markup,
          options,
          state: Object.assign({}, state, state.nextTransaction && {
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
    const { VERSION } = Internals;

    pollForFunction().then(devToolsExtension => {
      const MiddlewareCache = [];

      Internals.MiddlewareCache.forEach(middleware => {
        const name = middleware.name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .split(' ').slice(0, -1).join(' ');

        MiddlewareCache.push(name);
      });

      const mounts = [];

      selectors.forEach(selector => mounts.push({
        selector,
      }));

      extension = devToolsExtension().activate({
        VERSION,
        internals: {
          MiddlewareCache,
        },
        mounts,
      });

      if (cacheTask.length) {
        setTimeout(() => {
          cacheTask.forEach(cb => cb());
          cacheTask.length = 0;
        }, 250);
      }
    }).catch(console.log);
  };

  return devToolsTask;
}
