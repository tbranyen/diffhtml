// Associates DOM Nodes with state objects.
export const StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
export const NodeCache = new Map();

// Cache transition functions.
export const TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
export const MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();
MiddlewareCache.ReleaseHookCache = new Set();
