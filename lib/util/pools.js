import { PoolCache } from './caches';

export const size = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
export function createPool(name, fill) {
  const cache = {
    free: new Set(),
    allocated: new Set(),
    protected: new Set(),
  };

  // Prime the cache with n objects.
  for (let i = 0; i < size; i++) {
    cache.free.add(fill());
  }

  PoolCache.set(name, {
    cache,

    get() {
      const value = cache.free.values().next().value || fill();
      cache.free.delete(value);
      cache.allocated.add(value);
      return value;
    },

    protect(value) {
      cache.allocated.delete(value);
      cache.protected.add(value);
    },

    unprotect(value) {
      if (cache.protected.has(value)) {
        cache.protected.delete(value);
        cache.free.add(value);
      }
    }
  });
}

// Build the attribute pool of shared attribute objects.
createPool('attribute', () => ({
  name: '',
  value: '',
}));

// Build the element pool of shared element objects.
createPool('element', () => ({
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: [],
}));
