import { ComponentTreeCache, InstanceCache } from '../util/caches';
import { $$vTree } from '../util/symbols';

export default function renderComponent(vTree, context = {}) {
  const Component = vTree.rawNodeName;
  const props = vTree.attributes;
  const isNewable = Component.prototype && Component.prototype.render;

  let instance = null;
  let renderTree = null;

  if (InstanceCache.has(vTree)) {
    instance = InstanceCache.get(vTree);
    instance.componentWillReceiveProps(props);

    // TODO Find a better way of accomplishing this...
    // Wipe out all old references before re-rendering.
    ComponentTreeCache.forEach((_vTree, childNode) => {
      if (_vTree === vTree) {
        ComponentTreeCache.delete(childNode);
      }
    });

    if (instance.shouldComponentUpdate()) {
      renderTree = instance.render(props, instance.state, context);

      if (instance.componentDidUpdate) {
        instance.componentDidUpdate();
      }
    }
    else {
      renderTree = oldTree;
    }
  }
  // New class instance.
  else if (isNewable) {
    instance = new Component(props, context);
    InstanceCache.set(vTree, instance);
    instance[$$vTree] = vTree;

    renderTree = instance.render(props, instance.state, context);
  }
  else {
    renderTree = Component(props, context)
  }

  // Associate the children with the parent component that rendered them, this
  // is used to trigger lifecycle events.
  const linkTrees = childNodes => {
    for (let i = 0; i < childNodes.length; i++) {
      const newTree = childNodes[i];

      if (newTree.nodeType !== 11) {
        ComponentTreeCache.set(newTree, vTree);
      }
      else {
        linkTrees(newTree.childNodes);
      }
    }
  };

  linkTrees([].concat(renderTree));

  return renderTree;
};
