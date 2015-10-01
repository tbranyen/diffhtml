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
  let protect = [];

  // Prime the cache with n objects.
  for (let i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    _free: free,
    _allocated: allocated,
    _uuid: [],

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

    protect: function(value) {
      let idx = allocated.indexOf(value);
      protect.push(allocated.splice(idx, 1)[0]);

      // FIXME this isn't specific enough, we need a better way to cache the
      // currently used uuids.
      if (value && value.element) {
        this._uuid.push(value.element);
      }
    },

    unprotect: function(value) {
      let idx = protect.indexOf(value);
      let freeLength = free.length;

      if (freeLength < size) {
        let obj = protect.splice(idx, 1)[0];

        if (obj) { free.push(obj); }
      }

      // FIXME Read above FIXME
      if (value && value.element) {
        this._uuid.splice(this._uuid.indexOf(value.element), 1);
      }
    },

    freeAll: function() {
      let allocatedLength = allocated.length;
      let freeLength = free.length;

      free.push.apply(free, allocated.slice(0, size - freeLength));

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
