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
 * @param {VTree} vTree
 *
 * @returns {void}
 */
export default function componentDidMount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);

  /** @type {VTree[]} */
  const childTrees = [];

  ComponentTreeCache.forEach((parentTree, childTree) => {
    if (parentTree === componentTree) {
      childTrees.push(childTree);
    }
  });

  invokeRefsForVTrees(vTree);

  // Only trigger a mount for the first element.
  if (childTrees.length === 0 || childTrees[0] !== vTree) {
    return;
  }

  // If there is a parent, ensure it is called recursively.
  if (ComponentTreeCache.has(componentTree)) {
    componentDidMount(componentTree);
  }

  const instance = InstanceCache.get(componentTree);
  instance && instance.componentDidMount && instance.componentDidMount();
}
