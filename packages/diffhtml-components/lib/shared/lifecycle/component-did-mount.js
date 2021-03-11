import { ComponentTreeCache, InstanceCache, VTree } from '../../util/types';

/**
 * @param {VTree[]} vTrees
 */
const callRefs = vTrees => {
  for (let i = 0; i < vTrees.length; i++) {
    const vTree = vTrees[i];

    if (!vTree) continue;

    if (vTree.childNodes.length) {
      callRefs(vTree.childNodes);
    }

    const componentTree = ComponentTreeCache.get(vTree);
    const instances = InstanceCache.get(componentTree || vTree);

    // If any instances exist, loop through them and invoke the respective `ref`
    // logic.
    // FIXME: For this to work with WebComponent's the instance in that case,
    // must be pointed to the domNode.
    instances && instances.forEach(instance => {
      const { ref } = (instance.props || instance);

      if (typeof ref === 'function') {
        ref(instance);
      }
      else if (typeof ref === 'object' && ref) {
        ref.current = instance;
      }
      else if (typeof ref === 'string') {
        instance.refs = { ...instance.refs, [ref]: instance };
      }
    });
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

  callRefs([componentTree, vTree, ...childTrees.slice(1)]);

  instances && instances.forEach(instance => {
    if (instance.componentDidMount) {
      instance.componentDidMount();
    }
  });
}
