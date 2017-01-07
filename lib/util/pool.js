// A modest size.
const size = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
const memory = {
  free: new Set(),
  allocated: new Set(),
  protected: new Set(),
};

// Prime the memory cache with n objects.
for (let i = 0; i < size; i++) {
  memory.free.add({
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: null,
    attributes: null,
  });
}

// Cache VTree objects in a pool which is used to get
export default {
  size,
  memory,

  get() {
    const value = memory.free.values().next().value || fill();
    memory.free.delete(value);
    memory.allocated.add(value);
    return value;
  },

  protect(value) {
    memory.allocated.delete(value);
    memory.protected.add(value);
  },

  unprotect(value) {
    if (memory.protected.has(value)) {
      memory.protected.delete(value);
      memory.free.add(value);
    }
  },
};
