import diff from '../util/binding';
import { EMPTY, ComponentTreeCache, InstanceCache, VTree } from '../util/types';

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
 * @param {VTree} vTree
 */
export default function componentDidMount(vTree) {
  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  const componentTree = ComponentTreeCache.get(vTree);

  /** @type {VTree[]} */
  const childTrees = [];

  ComponentTreeCache.forEach((rootTree, vTree) => {
    if (rootTree === componentTree) {
      childTrees.push(vTree);
    }
  });

  // Only trigger a mount for the first element.
  if (childTrees.length > 1 && childTrees.indexOf(vTree) !== 0) {
    return;
  }

  const instances = InstanceCache.get(componentTree || vTree);

  // Invoke any function refs and set the current node for this component or
  // element.
  invokeRefsForVTrees(vTree, ...childTrees.slice(1));

  instances && instances.forEach(instance => {
    if (instance.componentDidMount) {
      instance.componentDidMount();
    }
  });
}
