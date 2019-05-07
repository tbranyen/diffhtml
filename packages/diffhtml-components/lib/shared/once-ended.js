import { Internals } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../util/caches';
import componentDidMount from './lifecycle/component-did-mount';
import componentWillUnmount from './lifecycle/component-will-unmount';

const { NodeCache } = Internals;
const uppercaseEx = /[A-Z]/g;
const blacklist = new Set();
const whitelist = new Set();
const root = typeof window !== 'undefined' ? window : global;

export default transaction => {
  if (transaction.aborted) {
    return;
  }

  const { patches } = transaction;
  const { SET_ATTRIBUTE, TREE_OPS } = patches;

  if (SET_ATTRIBUTE && SET_ATTRIBUTE.length) {
    uppercaseEx.lastIndex = 0;

    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const oldTree = SET_ATTRIBUTE[i];
      let name = SET_ATTRIBUTE[i + 1];
      const value = SET_ATTRIBUTE[i + 2];

      // Normalize uppercase attributes.
      if (uppercaseEx.test(name)) {
        uppercaseEx.lastIndex = 0;

        name = name.replace(uppercaseEx, ch => `-${ch.toLowerCase()}`);

        if (value && typeof value === 'string') {
          NodeCache.get(oldTree).setAttribute(name, value);
        }
      }
    }
  }

  if (TREE_OPS && TREE_OPS.length) {
    TREE_OPS.forEach(({ INSERT_BEFORE, REPLACE_CHILD, REMOVE_CHILD }) => {
      if (INSERT_BEFORE) {
        for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
          componentDidMount(INSERT_BEFORE[i + 1]);
        }
      }

      if (REPLACE_CHILD) {
        for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
          const newTree = REPLACE_CHILD[i];
          const oldTree = REPLACE_CHILD[i + 1];
          const oldComponentTree = ComponentTreeCache.has(oldTree);
          const newComponentTree = ComponentTreeCache.has(newTree);

          if (oldComponentTree) {
            componentWillUnmount(oldTree);
          }
          if (newComponentTree) {
            componentDidMount(newTree);
          }
        }
      }

      if (REMOVE_CHILD) {
        for (let i = 0; i < REMOVE_CHILD.length; i++) {
          if (ComponentTreeCache.has(REMOVE_CHILD[i])) {
            componentWillUnmount(REMOVE_CHILD[i]);
          }
        }
      }
    });
  }
};
