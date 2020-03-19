import { VTree } from "./types";

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

// Creates a pool to query new or reused values from.
const memory = { free, allocated: allocate, protected: protect };

// Prime the free memory pool with VTrees.
for (let i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
let freeValues = free.values();

// Cache VTree objects in a pool which is used to get
export default {
  size,
  memory,

  /**
   * @return {VTree}
   */
  get() {
    const { value = shape(), done } = freeValues.next();

    // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.
    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },

  /**
   * @param {VTree} vTree - Virtual Tree to protect
   */
  protect(vTree) {
    allocate.delete(vTree);
    protect.add(vTree);
  },

  /**
   * @param {VTree} vTree - Virtual Tree to unprotect
   */
  unprotect(vTree) {
    if (protect.has(vTree)) {
      protect.delete(vTree);
      free.add(vTree);
    }
  },
};
