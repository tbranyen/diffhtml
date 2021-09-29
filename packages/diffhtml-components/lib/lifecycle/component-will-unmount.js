import { EMPTY, ComponentTreeCache, InstanceCache, VTree } from '../util/types';
import diff from '../util/binding';
import { $$hooks } from '../util/symbols';

const { release, Internals } = diff;

/**
 * @param {any} target
 * @param {VTree} vTree
 */
const invokeRef = (target = EMPTY.OBJ, vTree) => {
  let { ref } = target.props || target;

  // Allow refs to be passed to HTML elements. When in a DOM environment
  // a Node will be passed to the ref function and assigned.
  if (!ref) {
    ref = vTree.attributes.ref;
  }

  if (typeof ref === 'function') {
    ref(null);
  }
  else if (typeof ref === 'object' && ref) {
    ref.current = null;
  }
  else if (typeof ref === 'string') {
    target.refs = { ...target.refs, [ref]: null };
  }
};

const invokeRefsForVTrees = (/** @type {(VTree | null)[]} */ ...vTrees) => {
  for (let i = 0; i < vTrees.length; i++) {
    const vTree = vTrees[i];

    if (!vTree) continue;

    const componentTree = ComponentTreeCache.get(vTree);
    const instance = InstanceCache.get(componentTree || vTree);

    if (vTree.childNodes.length) {
      invokeRefsForVTrees(...vTree.childNodes);
    }

    if (!instance) {
      invokeRef(Internals.NodeCache.get(vTree), vTree);
      continue;
    }

    // If any instances exist, loop through them and invoke the respective `ref`
    // logic.
    invokeRef(instance, vTree);
  }
}

/**
 * Called whenever a component is being removed.
 *
 * @param {VTree} vTree - The respecting tree pointing to the component
 */
export default function componentWillUnmount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);

  /** @type {VTree[]} */
  const childTrees = [];

  ComponentTreeCache.forEach((parentTree, childTree) => {
    if (parentTree === componentTree) {
      childTrees.push(childTree);
    }
  });

  invokeRefsForVTrees(vTree);

  const domNode = Internals.NodeCache.get(vTree);

  // Clean up attached Shadow DOM.
  if (domNode && /** @type {any} */ (domNode).shadowRoot) {
    release(/** @type {any} */ (domNode).shadowRoot);
  }

  if (!InstanceCache.has(componentTree)) {
    return;
  }

  const instance = InstanceCache.get(componentTree);
  InstanceCache.delete(componentTree);

  // Empty out all hooks for gc.
  instance[$$hooks].length = 0;

  ComponentTreeCache.delete(vTree);

  // If there is a parent, ensure it is called recursively.
  if (ComponentTreeCache.has(componentTree)) {
    componentWillUnmount(componentTree);
  }

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  instance && instance.componentWillUnmount && instance.componentWillUnmount();
}
