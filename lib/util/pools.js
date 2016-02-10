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
    allocated: new Set(),
    protected: new Set(),
    uuid: {}
  };

  // Prime the cache with n objects.
  for (let i = 0; i < size; i++) {
    cache.free.push(fill());
  }

  return {
    cache,

    get() {
      var value = cache.free.pop() || fill();
      cache.allocated.add(value);
      return value;
    },

    protect(value) {
      cache.allocated.delete(value);
      cache.protected.add(value);

      if (name === 'elementObject') {
        cache.uuid[value.uuid] = value;
      }
    },

    unprotect(value) {
      if (cache.protected.has(value)) {
        cache.protected.delete(value);
        cache.free.push(value);
      }

      if (name === 'elementObject') {
        delete cache.uuid[value.uuid];
      }
    },

    freeAll() {
      let freeLength = cache.free.length;
      let minusOne = freeLength - 1;

      // All of this could go away if we could figure out `Array.from` within
      // a PhantomJS web-worker.
      let reAlloc = [];
      cache.allocated.forEach(v => reAlloc.push(v));
      reAlloc = reAlloc.slice(0, size - minusOne);

      cache.free.push.apply(cache.free, reAlloc);
      cache.allocated.clear();

      if (name === 'elementObject') {
        reAlloc.forEach(element => delete cache.uuid[element.uuid]);
      }
    },

    free(value) {
      // Already freed.
      if (!cache.allocated.has(value)) { return; }

      // Only put back into the free queue if we're under the size.
      if (cache.free.length < size) {
        cache.free.push(value);
      }

      cache.allocated.delete(value);
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
