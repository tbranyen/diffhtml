import { InstanceCache, ComponentTreeCache } from '../util/caches';
import componentWillUnmount from './lifecycle/component-will-unmount';
import renderComponent from './render-component';
import getContext from './get-context';

const root = typeof window !== 'undefined' ? window : global;
const render = (oldTree, newTree) => {
  const oldComponentTree = ComponentTreeCache.get(oldTree);

  if (!oldComponentTree) {
    return renderComponent(newTree, getContext(newTree));
  }
  else if (oldComponentTree.rawNodeName === newTree.rawNodeName) {
    return renderComponent(oldComponentTree, getContext(oldTree));
  }
};

export const releaseHook = vTree => componentWillUnmount(vTree);

export const createNodeHook = vTree => {
  const { customElements } = root;
  const Constructor = customElements.get(vTree.nodeName);

  if (Constructor) {
    vTree.attributes.children = vTree.childNodes;
    return new Constructor(vTree.attributes, getContext(vTree));
  }
};

export const syncTreeHook = (oldTree, newTree) => {
  if (typeof newTree.rawNodeName === 'function') {
    return render(oldTree, newTree);
  }
  else {
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
  }
};
