import { ComponentTreeCache, VTree, Transaction } from './util/types';
import globalThis from './util/global';
import onceEnded from './once-ended';
import componentWillUnmount from './lifecycle/component-will-unmount';
import renderComponent from './render-component';

const { assign } = Object;

/**
 * @param {VTree} oldTree
 * @param {VTree} newTree
 */
function render(oldTree, newTree) {
  let oldComponentTree = null;

  if (oldTree && oldTree.childNodes) {
    // First try and lookup the old tree as a component.
    oldComponentTree = ComponentTreeCache.get(oldTree);

    // If that fails, try looking up it's first child.
    if (!oldComponentTree) {
      oldComponentTree = ComponentTreeCache.get(oldTree.childNodes[0]);
    }
  }

  if (!oldComponentTree) {
    return renderComponent(newTree);
  }
  else if (oldComponentTree.rawNodeName === newTree.rawNodeName) {
    assign(oldComponentTree.attributes, newTree.attributes);

    return renderComponent(oldComponentTree);
  }
}

/**
 * @param {VTree} vTree
 */
const releaseHook = vTree => componentWillUnmount(vTree);

/**
 * @param {VTree} vTree
 */
const createTreeHook = vTree => {
  const { customElements } = globalThis;
  const Constructor = customElements && customElements.get(vTree.nodeName);

  if (typeof vTree.rawNodeName === 'function' || Constructor) {
    vTree.attributes.children = vTree.attributes.children || vTree.childNodes;
  }
};

/**
 * @param {VTree} vTree
 */
const createNodeHook = vTree => {
  // Only look up elements with a dash in the name.
  if (!vTree.nodeName.includes('-')) return;

  // Convert this to globalThis
  const { customElements } = globalThis;
  const Constructor = customElements && customElements.get(vTree.nodeName);

  if (Constructor) {
    return new Constructor(vTree.attributes);
  }
};

/**
 * @param {VTree} oldTree
 * @param {VTree} newTree
 */
const syncTreeHook = (oldTree, newTree) => {
  // Render components during synchronization.
  if (
    // When child is a Component
    typeof newTree.rawNodeName === 'function' &&
    // If there is an oldTree and it's not the existing component, trigger a
    // render.
    (oldTree ? newTree.rawNodeName !== oldTree.rawNodeName : true)
  ) {
    return render(oldTree, newTree) || oldTree;
  }

  if (!newTree.childNodes) {
    return oldTree;
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
          // Replace the fragment with the rendered elements. Maybe in the
          // future this could remain a fragment and seamlessly patch into the
          // DOM.
          else {
            newTree.childNodes.splice(i, 1, ...renderTree.childNodes);
          }
        }
      }
      // Nothing rendered, so return the oldTree.
      else {
        newTree.childNodes[i] = newChildTree;

        // FIXME Determine why this is necessary, it is most likely wrong.
        return oldTree;
      }
    }
  }
};

export default () => assign(
  (/** @type {Transaction} */transaction) => transaction.onceEnded(onceEnded),
  {
    displayName: 'componentTask',
    syncTreeHook,
    createNodeHook,
    createTreeHook,
    releaseHook,
  },
);
