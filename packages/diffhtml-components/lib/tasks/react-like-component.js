import createTree from 'diffhtml/lib/tree/create';
import { ComponentTreeCache, InstanceCache } from '../util/caches';

const { assign } = Object;

export default function reactLikeComponentTask(transaction) {
  return transaction.onceEnded(() => {
    const { patches } = transaction;

    if (patches.TREE_OPS && patches.TREE_OPS.length) {
      patches.TREE_OPS.forEach(({ INSERT_BEFORE, REPLACE_CHILD }) => {
        if (INSERT_BEFORE) {
          for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
            const newTree = INSERT_BEFORE[i + 1];

            if (InstanceCache.has(newTree)) {
              InstanceCache.get(newTree).componentDidMount();
            }
          }
        }

        if (REPLACE_CHILD) {
          for (let i = 0; i < REPLACE_CHILD.length; i += 3) {
            const newTree = REPLACE_CHILD[i + 1];

            if (InstanceCache.has(newTree)) {
              InstanceCache.get(newTree).componentDidMount();
            }
          }
        }
      });
    }
  });
}

reactLikeComponentTask.syncTreeHook = (oldTree, newTree) => {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const oldCtor = oldChild && oldChild.rawNodeName;
      const newCtor = newChild.rawNodeName;
      const children = newChild.childNodes;
      const props = assign({}, newChild.attributes, { children });
      const canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldCtor === newCtor && InstanceCache.get(oldChild);
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;
      const renderTree = createTree(instance ? instance.render(props) : newCtor(props));

      if (!renderTree) {
        continue;
      }

      if (renderTree.nodeType === 11) {
        throw new Error('Top level render must return single Node');
      }

      // Build a new tree from the render, and use this as the current tree.
      newTree.childNodes[i] = renderTree;

      // Cache this new current tree.
      if (instance) {
        ComponentTreeCache.set(instance, renderTree);
        InstanceCache.set(renderTree, instance);
      }

      // Recursively update trees.
      return newTree;
    }
  }
};
