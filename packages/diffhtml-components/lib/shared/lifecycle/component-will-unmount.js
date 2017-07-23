import { Internals, release } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../util/caches';
import { releaseHook } from '../hooks';

export default vTree => {
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);

  if (instance) {
    [...ComponentTreeCache.keys()].filter(key => {
      if (Internals.NodeCache.has(key)) {
        release(Internals.NodeCache.get(key));
      }
    });
  }

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(componentTree);
}
