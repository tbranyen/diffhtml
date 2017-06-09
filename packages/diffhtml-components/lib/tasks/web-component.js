import { Internals } from 'diffhtml';

const { NodeCache } = Internals;
const { assign } = Object;

export default function webComponentTask(transaction) {
  return transaction.onceEnded(() => {
    if (transaction.aborted) {
      return;
    }

    const { patches } = transaction;

    if (patches.TREE_OPS && patches.TREE_OPS.length) {
      patches.TREE_OPS.forEach(({
        INSERT_BEFORE,
        REPLACE_CHILD,
        REMOVE_CHILD,
      }) => {
        if (INSERT_BEFORE) {
          for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
            const newTree = INSERT_BEFORE[i + 1];
            const instance = NodeCache.get(newTree);

            if (instance && instance.componentDidMount) {
              instance.componentDidMount();
            }
          }
        }

        if (REPLACE_CHILD) {
          for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
            const newTree = REPLACE_CHILD[i];
            const instance = NodeCache.get(newTree);

            if (instance && instance.componentDidMount) {
              instance.componentDidMount();
            }
          }
        }

        if (REMOVE_CHILD) {
          for (let i = 0; i < REMOVE_CHILD.length; i += 1) {
            const oldTree = REMOVE_CHILD[i];
            const instance = NodeCache.get(oldTree);

            if (instance && instance.componentDidUnmount) {
              instance.componentDidUnmount();
            }
          }
        }
      });
    }
  });
}

webComponentTask.syncTreeHook = (oldTree, newTree) => {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  if (!newTree || !newTree.childNodes) {
    return newTree;
  }

  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If incoming tree is a web component, flatten down to tree for now.
    if (newChild && customElements.get(newChild.nodeName)) {
      Object.defineProperty(newChild.attributes, 'children', {
        get: () => newChild.childNodes,
      });
    }
  }

  return newTree;
};

webComponentTask.createNodeHook = (vTree) => {
  let Constructor = null;

  if (Constructor = customElements.get(vTree.nodeName)) {
    return new Constructor(vTree.attributes);
  }
};
