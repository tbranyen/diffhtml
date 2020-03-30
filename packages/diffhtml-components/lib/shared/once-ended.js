import { Internals } from 'diffhtml';
import componentDidMount from './lifecycle/component-did-mount';
import componentWillUnmount from './lifecycle/component-will-unmount';

const { NodeCache, PATCH_TYPE, decodeEntities } = Internals;
const uppercaseEx = /[A-Z]/g;

export default transaction => {
  if (transaction.aborted) {
    return;
  }

  const { patches } = transaction;
  const { length } = patches;

  let i = 0;

  while (true) {
    const patchType = patches[i];

    if (i === length) {
      break;
    }

    switch(patchType) {
      case PATCH_TYPE.SET_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];
        const value = decodeEntities(patches[i + 3]);

        uppercaseEx.lastIndex = 0;

        // Normalize uppercase attributes.
        if (uppercaseEx.test(name)) {
          uppercaseEx.lastIndex = 0;

          const newName = name.replace(
            uppercaseEx,
            ch => `-${ch.toLowerCase()}`,
          );

          if (value && typeof value === 'string') {
            NodeCache.get(vTree).setAttribute(newName, value);
          }
        }

        i += 4;
        break;
      }

      case PATCH_TYPE.REMOVE_ATTRIBUTE: {
        i += 3;
        break;
      }

      case PATCH_TYPE.NODE_VALUE: {
        i += 4;
        break;
      }

      case PATCH_TYPE.INSERT_BEFORE: {
        const newTree = patches[i + 2];

        componentDidMount(newTree);

        i += 4;
        break;
      }

      case PATCH_TYPE.REPLACE_CHILD: {
        const newTree = patches[i + 1];
        const oldTree = patches[i + 2];

        componentWillUnmount(oldTree);
        componentDidMount(newTree);

        i += 3;
        break;
      }

      case PATCH_TYPE.REMOVE_CHILD: {
        const vTree = patches[i + 1];

        componentWillUnmount(vTree);

        i += 2;
        break;
      }
    }
  }
};