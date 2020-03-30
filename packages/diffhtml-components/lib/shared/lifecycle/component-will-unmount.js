import { Internals, release } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../util/caches';

const { NodeCache } = Internals;

const hasVTree = (matchTree, vTree) => {
  if (matchTree === vTree) {
    return true;
  }

  vTree.childNodes.forEach(hasVTree.bind(null, matchTree));
};

export default function willUnmount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);
  const domNode = NodeCache.get(vTree);

  // TODO This needs to mirror component-did-mount where the refs map is
  // updated correctly.
  if (typeof vTree.attributes.ref === 'function') {
    vTree.attributes.ref(null);
  }

  if (componentTree && typeof componentTree.attributes.ref === 'function') {
    componentTree.attributes.ref(null);
  }

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }

  // Clean up Shadow DOM (TODO what if the shadow dom is detached?).
  if (domNode && domNode.shadowRoot) {
    release(domNode.shadowRoot);
  }

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(componentTree);
}