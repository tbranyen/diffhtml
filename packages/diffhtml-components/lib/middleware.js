import {
  EMPTY,
  ComponentTreeCache,
  MountCache,
  VTree,
  Transaction,
} from './util/types';
import globalThis from './util/global';
import { $$vTree } from './util/symbols';
import diff from './util/binding';
import beforeMount from './before-mount';
import componentWillUnmount from './lifecycle/component-will-unmount';
import { invokeRef } from './lifecycle/invoke-refs';
import renderComponent from './render-component';

const { assign } = Object;
const { tasks } = diff.Internals;

/**
 * @param {VTree} oldTree
 * @param {VTree} newTree
 * @param {Transaction} transaction
 *
 * @returns {VTree | null}
 */
function render(oldTree, newTree, transaction) {
  let oldComponentTree = null;

  // When there is an oldTree and it has childNodes, attempt to look up first
  // by the top-level element, or by the first element.
  if (oldTree) {
    // First try and lookup the old tree as a component.
    oldComponentTree = ComponentTreeCache.get(oldTree);

    // If that fails, try looking up its first child.
    if (!oldComponentTree && oldTree.childNodes) {
      oldComponentTree = ComponentTreeCache.get(oldTree.childNodes[0]);
    }

    if (!oldComponentTree && typeof oldTree.rawNodeName === 'function') {
      oldComponentTree = oldTree;
    }
  }


  // If there is no old component, or if the components do not match, then we
  // are rendering a brand new component.
  if (!oldComponentTree || oldComponentTree.rawNodeName !== newTree.rawNodeName) {
    return renderComponent(newTree, transaction);
  }

  // Otherwise re-use the existing component if the constructors are the same.
  if (oldComponentTree) {

    // Update the incoming props/attrs.
    assign(oldComponentTree.attributes, newTree.attributes);

    return renderComponent(oldComponentTree, transaction);
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
 * @param {Transaction} transaction
 */
const syncTreeHook = (oldTree, newTree, transaction) => {
  // Render components during synchronization.
  if (
    // If there is an oldTree and it's not the existing component, trigger a
    // render. Or if the components match, re-render.
    (oldTree && typeof oldTree.rawNodeName === 'function') ||
    (newTree && typeof newTree.rawNodeName === 'function')
  ) {
    return render(oldTree, newTree, transaction);
  }

  if (!newTree.childNodes) {
    return oldTree;
  }

  // Loop through childNodes seeking out components to render.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const newChildTree = newTree.childNodes[i];
    const oldChildTree = (oldTree.childNodes && oldTree.childNodes[i]) || EMPTY.OBJ;
    const isNewFunction = typeof newChildTree.rawNodeName === 'function';

    // Search through the DOM tree for more components to render.
    if (isNewFunction) {
      const renderTree = render(oldChildTree, newChildTree, transaction);

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
  (/** @type {Transaction} */transaction) => {
    MountCache.set(transaction, new Set());

    // Splice after syncTrees to handle componentWillUnmount and modifying
    // attributes.
    if (transaction.tasks.includes(tasks.syncTrees)) {
      const syncTreesIndex = transaction.tasks.indexOf(tasks.syncTrees);
      transaction.tasks.splice(syncTreesIndex + 1, 0, function beforeMountLifecycle() {
        beforeMount(transaction);
        return transaction;
      });
    }

    // Splice after patchNode to handle componentDidMount and refs.
    if (transaction.tasks.includes(tasks.patchNode)) {
      const patchNodeIndex = transaction.tasks.indexOf(tasks.patchNode);

      transaction.tasks.splice(patchNodeIndex + 1, 0, function afterMountLifecycle() {
        MountCache.get(transaction)?.forEach(instance => {
          invokeRef(instance, instance[$$vTree]);

          if (typeof instance.componentDidMount === 'function') {
            instance.componentDidMount();
          }
        });
        return transaction;
      });
    }

    return (/** @type {Transaction} */ transaction) => {
      MountCache.delete(transaction);
    };
  },
  {
    displayName: 'componentTask',
    syncTreeHook,
    createNodeHook,
    createTreeHook,
    releaseHook,
  },
);
