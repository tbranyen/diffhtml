import { Internals } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../util/caches';

const { NodeCache } = Internals;

const callRefs = vTrees => {
  for (let i = 0; i < vTrees.length; i++) {
    const vTree = vTrees[i];

    if (!vTree) continue;

    if (vTree.childNodes.length) {
      callRefs(vTree.childNodes);
    }

    const componentTree = ComponentTreeCache.get(vTree);
    const instances = InstanceCache.get(componentTree || vTree);

    // Pull the ref off the componentTree, or fall back to the DOM tree. This
    // allows DOM nodes to have refs called.
    const domNode = NodeCache.get(vTree);

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

    // Support web components/dom elements.
    if (!instances || !instances.length) {
      const { ref } = vTree.attributes;
      const value = domNode;

      if (typeof ref === 'function') {
        ref(value);
      }
      else if (typeof ref === 'object' && ref) {
        ref.current = instance;
      }
      else if (typeof ref === 'string') {
        instance.refs = { ...instance.refs, [ref]: value };
      }
    }
  }
}

export default function componentDidMount(vTree) {
  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  const componentTree = ComponentTreeCache.get(vTree);
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

  instances && instances.forEach((instance, i) => {
    if (instance.componentDidMount) {
      instance.componentDidMount();
    }
  });
}
