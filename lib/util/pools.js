import _uuid from './uuid';

const uuid = _uuid;
export var pools = {};
export var count = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
export function createPool(name, opts) {
  var { size, fill } = opts;
  var free = [];
  var allocated = [];
  var protect = [];

  // Prime the cache with n objects.
  for (let i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    _free: free,
    _allocated: allocated,
    _protected: protect,
    _uuid: {},

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

      // Move the value out of allocated, since we need to protect this from
      // being free'd accidentally.
      if (protect.indexOf(value) === -1) {
        protect.push(idx === -1 ? value : allocated.splice(idx, 1)[0]);
      }

      // If we're protecting an element object, push the uuid into a lookup
      // table.
      if (name === 'elementObject') {
        this._uuid[value.uuid] = value;
      }
    },

    unprotect: function(value) {
      let idx = protect.indexOf(value);

      if (idx !== -1) {
        let obj = protect.splice(idx, 1)[0];

        if (obj) {
          free.push(obj);
        }

        if (name === 'elementObject') {
          delete this._uuid[value.uuid];
        }
      }
    },

    freeAll: function() {
      let allocatedLength = allocated.length;
      let freeLength = free.length;
      let reAlloc = allocated.slice(0, size - freeLength);

      free.push.apply(free, reAlloc);
      allocated.length = 0;

      if (name === 'elementObject') {
        reAlloc.forEach(element => delete this._uuid[element.uuid]);
      }
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
  pools.attributeObject = createPool('attributeObject', {
    size: COUNT,

    fill: function() {
      return { name: '', value: '' };
    }
  });

  pools.elementObject = createPool('elementObject', {
    size: COUNT,

    fill: function() {
      return {
        uuid: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });
}

// Create 10k items of each type.
initializePools(count);
