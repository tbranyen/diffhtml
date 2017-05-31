import { Internals } from 'diffhtml';

const { NodeCache } = Internals;

export default function webComponentTask(transaction) {
  return transaction.onceEnded(() => {
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

webComponentTask.createNodeHook = (vTree) => {
  let Constructor = null;

  if (Constructor = customElements.get(vTree.nodeName)) {
    return new Constructor(vTree.attributes);
  }
};
