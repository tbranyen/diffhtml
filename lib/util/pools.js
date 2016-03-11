import _uuid from './uuid';

const uuid = _uuid;

export const pools = {};
export const count = 10000;

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
    uuid: new Set(),
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
        cache.uuid.add(value.uuid);
      }
    },

    unprotect(value) {
      if (cache.protected.has(value)) {
        cache.protected.delete(value);
        cache.free.push(value);
      }
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
        nodeName: '',
        nodeValue: '',
        uuid: uuid(),
        childNodes: [],
        attributes: []
      };
    }
  });
}

// Create ${COUNT} items of each type.
initializePools(count);
