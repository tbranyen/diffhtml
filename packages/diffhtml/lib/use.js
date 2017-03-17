import html from './html';
import {
  MiddlewareCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
} from './util';

export default function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook,
  } = middleware;

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe(use.diff);

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache.add(createTreeHook);
  createNodeHook && CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe(use.diff);

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache.delete(createTreeHook);
    CreateNodeHookCache.delete(createNodeHook);
    SyncTreeHookCache.delete(syncTreeHook);
  };
}
