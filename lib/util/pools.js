import _uuid from './uuid';

const uuid = _uuid;

export let pools = {};
export let count = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param opts
 * @return {Object} pool
 */
export function createPool(opts) {
  let { size, fill } = opts;
  let free = [];
  let allocated = [];
  let index = new WeakMap();

  // Prime the cache with n objects.
  for (let i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    _free: free,
    _allocated: allocated,

    get: function() {
      let obj = null;
      let freeLength = free.length;
      let minusOne = freeLength - 1;

      if (freeLength) {
        obj = free[minusOne];
        free.length = minusOne;
      }
      else {
        obj = fill();
      }

      let idx = allocated.push(obj);

      if (typeof obj === 'string') {
        index[obj] = idx;
      }
      else {
        index.set(obj, idx - 1);
      }

      return obj;
    },

    freeAll: function(except=[]) {
      let allocatedLength = allocated.length;

      for (let i = 0; i < allocatedLength; i++) {
        this.free(allocated[i]);
      }

      allocated.length = 0;
    },

    free: function(obj) {
      let idx = null;

      if (!obj) { return; }

      if (typeof obj === 'string') {
        idx = index[obj];
      }
      // Required else, because the WeakMap polyfill has an issue with
      // "invalid" keys.
      else {
        idx = index.get(obj);

        // Remove from index map.
        index.delete(obj);
      }

      idx = idx || -1;

      // Already freed.
      if (idx === -1) { return; }

      // Empty arrays.
      if (Array.isArray(obj)) {
        obj.length = 0;
      }

      // Only put back into the free queue if we're under the size.
      if (free.length < size) {
        free.push(obj);
      }

      allocated.splice(idx, 1);
    }
  };
}


export function initializePools(COUNT) {
  pools.attributeObject = createPool({
    size: COUNT,

    fill: function() {
      return { name: '', value: '' };
    }
  });

  pools.elementObject = createPool({
    size: COUNT,

    fill: function() {
      return {};
    }
  });

  pools.object = createPool({
    size: COUNT,

    fill: function() {
      return {};
    }
  });

  pools.array = createPool({
    size: COUNT,

    fill: function() {
      return [];
    }
  });

  pools.uuid = createPool({
    size: COUNT,

    fill: function() {
      return uuid();
    }
  });
}

// Create 10k items of each type.
initializePools(count);
