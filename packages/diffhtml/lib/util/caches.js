import { VTree, ValidNode } from "./types";

// Associates DOM Nodes with state objects.
export const StateCache = new Map();

/**
 * Associates Virtual Tree Elements with DOM Nodes.
 *
 * @type {Map<VTree, ValidNode>}
 */
export const NodeCache = new Map();

// Cache transition functions.
export const TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
export const MiddlewareCache = new Set();

// Very specific caches used by middleware.
export const CreateTreeHookCache = new Set();
export const CreateNodeHookCache = new Set();
export const SyncTreeHookCache = new Set();
export const ReleaseHookCache = new Set();
export const ParserHookCache = new Set();