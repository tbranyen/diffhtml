import { ComponentTreeCache } from '../util/caches';
import componentWillUnmount from './lifecycle/component-will-unmount';
import renderComponent from './render-component';
import getContext from './get-context';

const { assign } = Object;

function render(oldTree, newTree) {
  const oldComponentTree = ComponentTreeCache.get(oldTree);

  if (!oldComponentTree) {
    return renderComponent(newTree, getContext(newTree));
  }
  else if (oldComponentTree.rawNodeName === newTree.rawNodeName) {
    assign(oldComponentTree.attributes, newTree.attributes);

    return renderComponent(oldComponentTree, getContext(oldTree));
  }
}

export const releaseHook = vTree => componentWillUnmount(vTree);

export const createNodeHook = vTree => {
  const root = typeof window !== 'undefined' ? window : global;
  const { customElements } = root;
  const Constructor = customElements && customElements.get(vTree.nodeName);

  if (Constructor) {
    vTree.attributes.children = vTree.childNodes;
    return new Constructor(vTree.attributes, getContext(vTree));
  }
};

export const syncTreeHook = (oldTree, newTree) => {
  // Render components during synchronization.
  if (
    // When child is a Component
    typeof newTree.rawNodeName === 'function' &&
    // If there is an oldTree and it's not the existing element, trigger a
    // render.
    (oldTree ? newTree.rawNodeName !== oldTree.rawNodeName : true)
  ) {
    return render(oldTree, newTree);
  }

  // When child is a VTree or DOM Node that has children.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const newChildNode = newTree.childNodes[i];

    if (typeof newChildNode.rawNodeName === 'function') {
      const oldChildNode = oldTree.childNodes && oldTree.childNodes[i];
      const renderTree = render(oldChildNode, newChildNode);

      if (renderTree && renderTree !== newChildNode) {
        newTree.childNodes[i] = renderTree;
      }
    }
  }
};
