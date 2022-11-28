/**
 * @typedef {import('./types').VTree} VTree
 */
import { EMPTY, NODE_TYPE } from './types';
import getConfig from './config';

const size = /** @type {Number} */ (getConfig('initialPoolSize', 5000));
const free = new Set();
const allocate = new Set();
const protect = new Set();

const shape = () => ({
  rawNodeName: EMPTY.STR,
  nodeName: EMPTY.STR,
  nodeValue: EMPTY.STR,
  nodeType: NODE_TYPE.ELEMENT,
  key: EMPTY.STR,
  childNodes: [],
  attributes: {},
});

// Creates a pool to query new or reused values from.
const memory = { free, allocated: allocate, protected: protect };

// Cache the values object, we'll refer to this iterator which is faster than
// calling it every single time. It gets replaced once exhausted.
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
   *
   * Moves a VTree from the "free" state to the "allocated" state. If the pool
   * is empty, it creates a new object.
   *
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
   * Moves a VTree from "allocated" state to "protected" state. This means that
   * the VTrees will persist between transactions.
   *
   * @param {VTree} vTree - Virtual Tree to protect
   */
  protect(vTree) {
    allocate.delete(vTree);
    protect.add(vTree);
  },

  /**
   * Moves a VTree from "protected" state to "allocated" state. They will be
   * brought back into "free" circulation during a GC.
   *
   * @param {VTree} vTree - Virtual Tree to unprotect and deallocate
   */
  unprotect(vTree) {
    if (protect.has(vTree) || allocate.has(vTree)) {
      protect.delete(vTree);
      allocate.add(vTree);
    }
  },
};

// Fill the pool.
Pool.fill();

export default Pool;
