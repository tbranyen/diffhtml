import { EMPTY, InstanceCache, VTree } from '../util/types';
import diff from '../util/binding';

const { Internals } = diff;

/**
 * @param {any} target
 * @param {VTree} vTree
 * @param {HTMLElement | VTree | null=} value
 */
export const invokeRef = (target = EMPTY.OBJ, vTree, value) => {
  let { ref } = target.props || target;

  // Allow refs to be passed to HTML elements. When in a DOM environment
  // a Node will be passed to the ref function and assigned.
  if (!ref && vTree) {
    target = Internals.NodeCache.get(vTree);
    ref = vTree.attributes.ref;
  }

  // Only backfill the value with target if no value was provided (either null
  // or a truthy value).
  if (value === undefined) {
    value = target;
  }

  if (typeof ref === 'function') {
    ref(value);
  }
  else if (typeof ref === 'object' && ref) {
    ref.current = value;
  }
  else if (typeof ref === 'string') {
    target.refs = { ...target.refs, [ref]: value };
  }
};

/**
 * @param {VTree} vTree - Element to start search, crawl for refs to invoke
 * @param {HTMLElement | VTree | null} value - Value to populate ref with
 */
export function invokeRefsForVTree(vTree, value) {
  if (vTree.childNodes.length) {
    vTree.childNodes.filter(Boolean).forEach(childNode => {
      invokeRefsForVTree(childNode, value);
    });
  }

  const instance = InstanceCache.get(vTree);

  if (!instance) {
    invokeRef(Internals.NodeCache.get(vTree), vTree, value);
    return;
  }

  // If any instances exist, loop through them and invoke the respective `ref`
  // logic.
  invokeRef(instance, vTree, value);
}
