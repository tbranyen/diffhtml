import componentWillUnmount from './lifecycle/component-will-unmount';
import { invokeRef, invokeRefsForVTree } from './lifecycle/invoke-refs';
import diff from './util/binding';
import { Transaction } from './util/types';

const { createNode, NodeCache, PATCH_TYPE, decodeEntities } = diff.Internals;
const uppercaseEx = /[A-Z]/g;

/**
 * @param {Transaction} transaction
 */
export default transaction => {
  if (transaction.aborted) {
    return;
  }

  const { patches } = transaction;
  const { length } = patches;

  let i = 0;

  while (true) {
    const patchType = patches[i];

    // Exhausted remaining patches.
    if (i === length) {
      break;
    }

    switch(patchType) {
      case PATCH_TYPE.SET_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];
        const value = patches[i + 3];

        uppercaseEx.lastIndex = 0;

        // Normalize uppercase attributes.
        if (uppercaseEx.test(name)) {
          uppercaseEx.lastIndex = 0;

          const newName = name.replace(
            uppercaseEx,
            (/** @type {string} */ ch) => `-${ch.toLowerCase()}`,
          );

          if (value && typeof value === 'string') {
            const decodedValue = decodeEntities(value);

            if (NodeCache.has(vTree)) {
              /** @type {HTMLElement} */(NodeCache.get(vTree)).setAttribute(newName, decodedValue);
            }
          }
        }

        if (name === 'ref') {
          invokeRef(createNode(vTree), vTree);
        }

        i += 4;
        break;
      }

      case PATCH_TYPE.REMOVE_ATTRIBUTE: {
        i += 3;
        break;
      }

      case PATCH_TYPE.REPLACE_CHILD: {
        const oldTree = patches[i + 2];

        componentWillUnmount(oldTree);

        i += 3;
        break;
      }

      case PATCH_TYPE.NODE_VALUE:
      case PATCH_TYPE.INSERT_BEFORE: {
        i += 4;
        break;
      }

      case PATCH_TYPE.REMOVE_CHILD: {
        const vTree = patches[i + 1];
        invokeRefsForVTree(vTree, null);
        componentWillUnmount(vTree);

        i += 2;
        break;
      }
    }
  }
};
