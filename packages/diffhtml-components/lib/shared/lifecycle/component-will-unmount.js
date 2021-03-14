import { EMPTY, ComponentTreeCache, InstanceCache, VTree } from '../../util/types';
import { getBinding } from '../../util/binding';

const { release, Internals } = getBinding();

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
    const instances = InstanceCache.get(componentTree || vTree);

    if (vTree.childNodes.length) {
      invokeRefsForVTrees(...vTree.childNodes);
    }

    if (!instances) {
      invokeRef(Internals.NodeCache.get(vTree), vTree);
      continue;
    }

    // If any instances exist, loop through them and invoke the respective `ref`
    // logic.
    instances.forEach(instance => invokeRef(instance, vTree));
  }
}

/**
 * Called whenever a component is being removed.
 *
 * @param {VTree} vTree - The respecting tree pointing to the component
 */
export default function willUnmount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);
  const instances = InstanceCache.get(componentTree);
  const domNode = Internals.NodeCache.get(vTree);

  invokeRefsForVTrees(vTree);

  instances && instances.forEach(instance => {
    // Ensure this is a stateful component. Stateless components do not get
    // lifecycle events yet.
    if (instance && instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
  });

  // Clean up attached Shadow DOM.
  if (domNode && /** @type {any} */ (domNode).shadowRoot) {
    release(/** @type {any} */ (domNode).shadowRoot);
  }

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(componentTree);
  InstanceCache.delete(vTree);
}
