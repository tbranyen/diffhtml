import { Internals } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../util/caches';
import { $$vTree } from '../../util/symbols';

const { NodeCache } = Internals;

const callRefs = (instance, vTrees) => {
  for (let i = 0; i < vTrees.length; i++) {
    const vTree = vTrees[i];

    if (!vTree) continue;

    const { ref } = vTree.attributes;
    const domNode = NodeCache.get(vTree);
    const value = typeof vTree.rawNodeName === 'string' ? domNode : instance;

    if (typeof ref === 'function') {
      ref(value);
    }
    else if (typeof ref === 'string') {
      instance.refs = { ...instance.refs, [ref]: value };
    }
  }
}

export default function componentDidMount(vTree) {
  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);

  if (instance) {
    callRefs(instance, [vTree, ...vTree.childNodes]);

    if (instance.componentDidMount) {
      instance.componentDidMount();
    }
  }

  vTree.childNodes.forEach(vTree => componentDidMount(vTree));
}
