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

      allocated.push(obj);

      return obj;
    },

    freeAll: function(except=[]) {
      let allocatedLength = allocated.length;

      for (let i = 0; i < allocatedLength; i++) {
        this.free(allocated[i]);
      }

      allocated.length = 0;
    },

    free: function(value) {
      let idx = allocated.indexOf(value);

      // Already freed.
      if (idx === -1) { return; }

      // Only put back into the free queue if we're under the size.
      if (free.length < size) {
        free.push(value);
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
      return {
        element: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });

  pools.object = createPool({
    size: COUNT,

    fill: function() {
      return {};
    }
  });
}

// Create 10k items of each type.
initializePools(count);
