/**
 * @typedef {import('./util/types').Middleware} Middleware
 */
import {
  MiddlewareCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
  ParseHookCache,
} from './util/types';
import internalProcess from './util/process';
import Internals from './util/internals';

const { isArray } = Array;

/**
 * Hook functions into the transaction task stack. When a function is passed it
 * will be called before any synchronization or patching has occured. When a
 * nested function is returned from that function it will be injected after
 * patching. From there code can add to the Transaction#onceEnded callbacks and
 * know exactly when a transaction has fully completed.
 *
 * These functions can, and should, the properties which can also be directly
 * passed as an object.
 *
 * - displayName - Optional, but a good idea to identify in DevTools
 *
 * - subscribe - Whenever a middleware is activated this is called with the
 *   sole argument being the diff.Internals API.
 *
 * - unsubscribe - Whenever a middleware is unsubscribed, ensure you fully clean
 *   up after it.
 *
 * - createTreeHook - Whenever a VTree is created, this hook is called.
 *
 * - createNodeHook - Whenever a DOM node is created, this hook is called.
 *
 * - syncTreeHook - Whenever two VTrees are diffed this hook is called.
 *
 * - releaseHook - Whenever a VTree/DOM node binding has been released this is
 *   called.
 *
 * @param {Middleware} middleware
 */
export default function use(middleware) {
  const isFunction = typeof middleware === 'function';
  const isObject = typeof middleware === 'object';

  if (internalProcess.env.NODE_ENV !== 'production') {
    if (!middleware || (!isFunction && !isObject) || isArray(middleware)) {
      throw new Error('Middleware must be a function or plain object');
    }
  }

  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook,
    releaseHook,
    parseHook,
  } = middleware;

  // Add the function to the set of middlewares.
  isFunction && MiddlewareCache.add(/** @type {Function} */ (middleware));

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && subscribe(Internals);

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache.add(createTreeHook);
  createNodeHook && CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache.add(syncTreeHook);
  releaseHook && ReleaseHookCache.add(releaseHook);
  parseHook && ParseHookCache.add(parseHook);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    isFunction && MiddlewareCache.delete(/** @type {Function} */ (middleware));

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe(Internals);

    // Cleanup the specific fns from their Cache.
    createTreeHook && CreateTreeHookCache.delete(createTreeHook);
    createNodeHook && CreateNodeHookCache.delete(createNodeHook);
    syncTreeHook && SyncTreeHookCache.delete(syncTreeHook);
    releaseHook && ReleaseHookCache.delete(releaseHook);
    parseHook && ParseHookCache.delete(parseHook);
  };
}
