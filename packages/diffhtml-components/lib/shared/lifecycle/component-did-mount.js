import { Internals } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../util/caches';

const { NodeCache } = Internals;

export default function componentDidMount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);

  let ref = null;

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentDidMount) {
    instance.componentDidMount();
    ref = componentTree.attributes.ref;
    ref && ref(instance);
  }
  else {
    ref = vTree.attributes.ref;
    ref && ref(NodeCache.get(vTree));
  }

  vTree.childNodes.forEach(componentDidMount);
}
