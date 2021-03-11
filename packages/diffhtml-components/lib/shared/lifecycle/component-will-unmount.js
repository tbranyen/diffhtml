import { ComponentTreeCache, InstanceCache, VTree } from '../../util/types';
import { getBinding } from '../../util/binding';

/**
 * Called whenever a component is being removed.
 *
 * @param {VTree} vTree - The respecting tree pointing to the component
 */
export default function willUnmount(vTree) {
  const diff = getBinding();
  const componentTree = ComponentTreeCache.get(vTree);
  const instances = InstanceCache.get(componentTree);
  const domNode = diff.Internals.NodeCache.get(vTree);

  // TODO This needs to mirror component-did-mount where the refs map is
  // updated correctly.
  if (typeof vTree.attributes.ref === 'function') {
    vTree.attributes.ref(null);
  }

  if (componentTree && typeof componentTree.attributes.ref === 'function') {
    componentTree.attributes.ref(null);
  }

  instances && instances.forEach(instance => {
    // Ensure this is a stateful component. Stateless components do not get
    // lifecycle events yet.
    if (instance && instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
  });

  // Clean up Shadow DOM (TODO what if the shadow dom is detached?).
  if (domNode && domNode.shadowRoot) {
    diff.release(domNode.shadowRoot);
  }

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(componentTree);
  InstanceCache.delete(vTree);
}
