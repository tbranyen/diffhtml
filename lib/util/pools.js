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
  var cache = {
    free: [],
    allocated: [],
    protected: [],
    uuid: {}
  };

  // Prime the cache with n objects.
  for (let i = 0; i < size; i++) {
    cache.free.push(fill());
  }

  return {
    cache,

    get() {
      var obj = null;
      var freeLength = cache.free.length;
      var minusOne = freeLength - 1;

      if (freeLength) {
        obj = cache.free[minusOne];
        cache.free.length = minusOne;
      }
      else {
        obj = fill();
      }

      cache.allocated.push(obj);

      return obj;
    },

    protect(value) {
      let idx = cache.allocated.indexOf(value);

      // Move the value out of allocated, since we need to protect this from
      // being free'd accidentally.
      if (cache.protected.indexOf(value) === -1) {
        cache.protected.push(
          idx === -1 ? value : cache.allocated.splice(idx, 1)[0]
        );
      }

      // If we're protecting an element object, push the uuid into a lookup
      // table.
      if (name === 'elementObject') {
        cache.uuid[value.uuid] = value;
      }
    },

    unprotect(value) {
      let idx = cache.protected.indexOf(value);

      if (idx !== -1) {
        let obj = cache.protected.splice(idx, 1)[0];

        if (obj) {
          cache.free.push(obj);
        }

        if (name === 'elementObject') {
          delete cache.uuid[value.uuid];
        }
      }
    },

    freeAll() {
      let freeLength = cache.free.length;
      let minusOne = freeLength - 1;
      let reAlloc = cache.allocated.slice(0, size - minusOne);

      cache.free.push.apply(cache.free, reAlloc);
      cache.allocated.length = 0;

      if (name === 'elementObject') {
        reAlloc.forEach(element => delete cache.uuid[element.uuid]);
      }
    },

    free(value) {
      let idx = cache.allocated.indexOf(value);

      // Already freed.
      if (idx === -1) { return; }

      // Only put back into the free queue if we're under the size.
      if (cache.free.length < size) {
        cache.free.push(value);
      }

      cache.allocated.splice(idx, 1);
    }
  };
}


export function initializePools(COUNT) {
  pools.attributeObject = createPool('attributeObject', {
    size: COUNT,

    fill() {
      return { name: '', value: '' };
    }
  });

  pools.elementObject = createPool('elementObject', {
    size: COUNT,

    fill() {
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
