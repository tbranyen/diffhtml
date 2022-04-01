import { EMPTY, ComponentTreeCache, InstanceCache, VTree } from '../util/types';
import diff from '../util/binding';

const { Internals } = diff;

/**
 * @param {any} target
 * @param {VTree} vTree
 */
const invokeRef = (target = EMPTY.OBJ, vTree) => {
  let { ref } = target.props || target;

  // Allow refs to be passed to HTML elements. When in a DOM environment
  // a Node will be passed to the ref function and assigned.
  if (!ref) {
    target = Internals.NodeCache.get(vTree);
    ref = vTree.attributes.ref;
  }

  if (typeof ref === 'function') {
    ref(target);
  }
  else if (typeof ref === 'object' && ref) {
    ref.current = target;
  }
  else if (typeof ref === 'string') {
    target.refs = { ...target.refs, [ref]: target };
  }
};

export const invokeRefsForVTrees = (/** @type {VTree} */ vTree) => {
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree || vTree);

  if (!instance) {
    invokeRef(Internals.NodeCache.get(vTree), vTree);
    return;
  }

  // If any instances exist, loop through them and invoke the respective `ref`
  // logic.
  invokeRef(instance, vTree);
}
