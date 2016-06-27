// Associates DOM Nodes with state objects.
export const StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
export const NodeCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
export const MiddlewareCache = new Set();
