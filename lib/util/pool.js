// A modest size.
const size = 10000;

const free = new Set();
const allocate = new Set();
const protect = new Set();
const shape = () => ({
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: {},
});

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
const memory = { free, allocated: allocate, protected: protect };

// Prime the free memory pool with VTrees.
for (let i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, this is a live reference.
const freeValues = free.values();

// Cache VTree objects in a pool which is used to get
export default {
  size,
  memory,

  get() {
    const value = freeValues.next().value || shape();
    free.delete(value);
    allocate.add(value);
    return value;
  },

  protect(value) {
    allocate.delete(value);
    protect.add(value);
  },

  unprotect(value) {
    if (protect.has(value)) {
      protect.delete(value);
      free.add(value);
    }
  },
};
