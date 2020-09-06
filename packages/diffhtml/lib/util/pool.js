import { VTree } from "./types";

let size = 10000;
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

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
let freeValues = free.values();

// A pool contains Virtual Tree objects which are a deterministic, pre-created
// shape that is used internally by diffHTML. Since diffHTML constantly creates
// and recycles objects, this helps avoid unwanted and unexpected garbage
// collection and improves performance.
const Pool = {
  size,
  memory,

  /**
   * As the Pool size is configurable, this method can be used to fill up the
   * pool after making it larger.
   */
  fill() {
    // Increase the pool size.
    for (let i = free.size; i < this.size; i++) {
      free.add(shape());
    }

    // Decrease the pool size.
    if (this.size < free.size) {
      // Loop the set until pruning has completed.
      free.forEach(value => {
        if (free.size !== this.size) {
          free.delete(value);
        }
      });
    }
  },

  /**
   * @return {VTree}
   */
  get() {
    // This will create a new VTree and add to the pool if
    // we do not get one from the freeValues.
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
   * @param {VTree} vTree - Virtual Tree to unprotect and deallocate
   */
  unprotect(vTree) {
    if (protect.has(vTree)) {
      protect.delete(vTree);
      free.add(vTree);
    }
    else if (allocate.has(vTree)) {
      allocate.delete(vTree);
      free.add(vTree);
    }
  },
};

// Fill the pool.
Pool.fill();

export default Pool;
