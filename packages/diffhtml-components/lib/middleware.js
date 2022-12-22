import {
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
 * This hook determines which component to render and inject into the tree.
 * 
 * @param {VTree} oldTree
 * @param {VTree} newTree
 * @param {Transaction} transaction
 */
const syncTreeHook = (oldTree, newTree, transaction) => {
  const isOldFunction = oldTree && typeof oldTree.rawNodeName === 'function';
  const isNewFunction = newTree && typeof newTree.rawNodeName === 'function';

  // New component added (TBD what about keyed components?)
  if (!isOldFunction && isNewFunction) {
    return renderComponent(newTree, transaction);
  }
  else if (isOldFunction && isNewFunction) {
    console.log('here');
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

      // TODO Can this be implemented elsewhere?
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
