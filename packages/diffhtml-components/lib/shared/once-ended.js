const uppercaseEx = /[A-Z]/g;
import { ComponentTreeCache } from '../util/caches';
import componentDidMount from './lifecycle/component-did-mount';
import componentWillUnmount from './lifecycle/component-will-unmount';

export default transaction => {
  if (transaction.aborted) {
    return;
  }

  const { patches } = transaction;

  if (patches.TREE_OPS && patches.TREE_OPS.length) {
    const { SET_ATTRIBUTE } = patches;
    uppercaseEx.lastIndex = 0;

    if (SET_ATTRIBUTE && SET_ATTRIBUTE.length) {
      for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
        const oldTree = SET_ATTRIBUTE[i];
        let name = SET_ATTRIBUTE[i + 1];
        const value = SET_ATTRIBUTE[i + 2];

        // Normalize uppercase attributes.
        if (uppercaseEx.test(name)) {
          uppercaseEx.lastIndex = 0;

          name = name.replace(uppercaseEx, ch => `-${ch.toLowerCase()}`);

          if (value && typeof value === 'string') {
            NodeCache.get(oldTree).setAttribute(normalized, value);
          }
        }
      }
    }

    patches.TREE_OPS.forEach(({ INSERT_BEFORE, REPLACE_CHILD, REMOVE_CHILD }) => {
      if (INSERT_BEFORE) {
        for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
          componentDidMount(INSERT_BEFORE[i + 1]);
        }
      }

      if (REPLACE_CHILD) {
        for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
          const newTree = REPLACE_CHILD[i];
          const oldTree = REPLACE_CHILD[i + 1];

          if (typeof newTree.rawNodeName !== 'function' && typeof oldTree.rawNodeName !== 'function') {
            continue;
          }

          const componentTree = ComponentTreeCache.get(oldTree);

          if (InstanceCache.has(componentTree)) {
            ComponentTreeCache.delete(InstanceCache.get(oldTree));
            InstanceCache.delete(oldTree);
          }

          InstanceCache.delete(oldTree);
          componentDidMount(newTree);
        }
      }
    });
  }
};
