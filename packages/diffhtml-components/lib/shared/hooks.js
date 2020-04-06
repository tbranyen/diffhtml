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
  // Only look up elements with a dash in the name.
  if (!vTree.nodeName.includes('-')) return;

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
    const renderTree = render(oldTree, newTree) || oldTree;
    return renderTree;
  }

  // Loop through childNodes seeking out components to render.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const newChildTree = newTree.childNodes[i];

    if (typeof newChildTree.rawNodeName === 'function') {
      const oldChildTree = oldTree.childNodes && oldTree.childNodes[i];
      const renderTree = render(oldChildTree, newChildTree);

      // Inject the rendered tree into the position.
      if (renderTree) {
        newTree.childNodes[i] = renderTree;

        // If the rendered tree is a fragment, splice in the children, as this
        // is simply a container for the nodes.
        if (renderTree.nodeType === 11) {
          // If a function was returned, re-run the inspection over this
          // element.
          if (typeof renderTree.rawNodeName === 'function') {
            i = i - 1;
          }
        }
      }
      else {
        return oldTree;
      }
    }
  }
};
