const { assign } = Object;

// Wipe all caches for this domain.
const clear = ({ quiet }) => caches.keys().then(cachesNames => {
  return Promise.all(cachesNames.map(cacheName => {
    return caches.delete(cacheName).then(function () {
      if (!quiet) {
        console.warn(`diffHTML ServiceWorker: Deleted cache ${cacheName}`);
      }
    });
  }))
});

// Wipe out all the service workers for this domain.
const unregister = ({ quiet }) => navigator.serviceWorker.getRegistrations().then(regs => {
  for (let reg of regs) {
    reg.unregister();

    if (!quiet) {
      console.warn('diffHTML ServiceWorker: Unregistering worker', reg);
    }
  }
});

// Simplify's creating a service worker with diffHTML.
const wrapper = ({
  // Default to the root /service-worker.js.
  url = '/service-worker.js',

  // Allow the middleware to automatically clear all caches. By default this is
  // disabled as it defeats the point of a service worker and may muck with
  // other apps running on localhost.
  autoClearCaches = location.search.includes('diff_autoclear'),

  // Useful for debugging, wipes and doesn't set. Default to the query param
  // for disable.
  disable = location.search.includes('diff_disable'),

  // Useful for debugging, logs out service worker events. Default to the query
  // param to enable.
  quiet = location.search.includes('diff_quiet'),

  // Defaults to the page root, gets set into the service worker options.
  scope = '/',

  // The remaining options to be spread into the serviceWorker configuration.
  options = {},
}) => assign(function serviceWorkerMiddleware() {}, {
  subscribe() {
    const { serviceWorker } = navigator;

    let chain = Promise.resolve();

    // If the user wants to work on the service worker, we need to clear the
    // old ones out first.
    if (autoClearCaches) {
      chain = chain.then(() => clear({ quiet }));
    }

    // If we're disabling, then clear the c
    if (disable) {
      // Iterate through all service workers and remove the old ones.
      chain = chain.then(() => unregister({ quiet }));
    }

    // If the user disables the service worker, do not attempt to re-register
    // it.
    chain = chain.then(() => {
      if (!disable) {
        return serviceWorker.register(url, { scope, ...options })
      }
    });

    // If not in quiet mode, echo out some standard messaging and give access
    // to the objects.
    if (!quiet) {
      chain
        .then(reg => reg && console.warn(
          'diffHTML ServiceWorker: Registration succeeded', reg
        ))
        .catch(err => err && console.warn(
          'diffHTML ServiceWorker: Registration failed', err
        ));
    }
  },

  unsubscribe() {
    unregister({ quiet });
  },
});

export default opts => wrapper(opts || {});
