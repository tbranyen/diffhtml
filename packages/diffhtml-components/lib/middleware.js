import { ComponentTreeCache, VTree, Transaction } from './util/types';
import globalThis from './util/global';
import onceEnded from './once-ended';
import componentWillUnmount from './lifecycle/component-will-unmount';
import renderComponent from './render-component';

const { assign } = Object;

/**
 * @param {VTree} oldTree
 * @param {VTree} newTree
 *
 * @returns {VTree | null}
 */
function render(oldTree, newTree) {
  let oldComponentTree = null;

  // When there is an oldTree and it has childNodes, attempt to look up first
  // by the top-level element, or by the first element.
  if (oldTree && oldTree.childNodes) {
    // First try and lookup the old tree as a component.
    oldComponentTree = ComponentTreeCache.get(oldTree);

    // If that fails, try looking up it's first child.
    if (!oldComponentTree) {
      oldComponentTree = ComponentTreeCache.get(oldTree.childNodes[0]);
    }
  }

  // If there is no old component, or if the components do not match, then we
  // are rendering a brand new component.
  if (!oldComponentTree || oldComponentTree.rawNodeName !== newTree.rawNodeName) {
    return renderComponent(newTree);
  }

  // Otherwise re-use the existing component if the constructors are the same.
  if (oldComponentTree) {
    // Update the incoming props/attrs.
    assign(oldComponentTree.attributes, newTree.attributes);

    return renderComponent(oldComponentTree);
  }

  return oldTree;
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
    (oldTree && oldTree.rawNodeName ? oldTree.rawNodeName !== newTree.rawNodeName : false)
  ) {
    return render(oldTree, newTree);
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

      // If nothing was rendered, return the oldTree.
      if (!renderTree) {
        return oldTree;
      }

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
          // Replace the fragment with the rendered elements. This reduces and
          // flattens the fragments into their respective nodes. If there are
          // none, then they are removed from the DOM and nothing is rendered.
          else {
            newTree.childNodes.splice(i, 1, ...renderTree.childNodes);
          }
        }
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
