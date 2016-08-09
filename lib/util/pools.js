export const pools = {};
export const count = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param {Function} fill - A function that creates the virtual object type
 * @return {Object} - Contains cache information and memory protection
 */
function createPool(fill) {
  const cache = {
    free: [],
    allocated: new Set(),
    protected: new Set(),
  };

  // Prime the cache with n objects.
  for (let i = 0; i < count; i++) {
    cache.free.push(fill());
  }

  return {
    cache,

    get() {
      const value = cache.free.pop() || fill();
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
        cache.free.push(value);
      }
    },
  };
}

// Creates Virtual Tree Attribute objects.
export const attributeObject = createPool(() => ({
  name: '',
  value: '',
}));

// Creates Virtual Tree Element objects.
export const elementObject = createPool(() => ({
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: [],
}));
