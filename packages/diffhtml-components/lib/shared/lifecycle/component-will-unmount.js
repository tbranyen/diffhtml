import { Internals, release } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../util/caches';
import { releaseHook } from '../hooks';

export default vTree => {
  const { NodeCache } = Internals;
  const root = typeof window !== 'undefined' ? window : global;
  const { customElements } = root;
  const Constructor = customElements && customElements.get(vTree.nodeName);
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);

  if (instance) {
    [...ComponentTreeCache.keys()].filter(key => {
      if (NodeCache.has(key)) {
        release(NodeCache.get(key));
      }
    });
  }

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }

  // Clean up after Web Components.
  if (Constructor && NodeCache.has(vTree)) {
    release(NodeCache.get(vTree).shadowRoot);
    release(NodeCache.get(vTree));
  }

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(componentTree);
}
