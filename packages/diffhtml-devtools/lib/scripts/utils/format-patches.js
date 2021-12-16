import { Internals } from 'diffhtml';

const { PATCH_TYPE } = Internals;

export default function formatPatches(patches) {
  const simplified = [];

  let i = 0;

  while (true) {
    const patchType = patches[i];

    if (i === patches.length) {
      break;
    }

    switch(patchType) {
      case PATCH_TYPE.SET_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];
        const newValue = patches[i + 3];

        simplified.push({
          type: 'setAttribute',
          vTree,
          name,
          newValue,
        });

        i += 4;
        break;
      }

      case PATCH_TYPE.REMOVE_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];

        simplified.push({
          type: 'removeAttribute',
          vTree,
          name,
        });

        i += 3;
        break;
      }

      case PATCH_TYPE.NODE_VALUE: {
        const vTree = patches[i + 1];
        const newValue = patches[i + 2];
        const oldValue = patches[i + 3];

        simplified.push({
          type: 'nodeValue',
          vTree,
          newValue,
          oldValue,
        });

        i += 4;
        break;
      }

      case PATCH_TYPE.INSERT_BEFORE: {
        const vTree = patches[i + 1];
        const newTree = patches[i + 2];
        const refTree = patches[i + 3];

        simplified.push({
          type: 'insertBefore',
          vTree,
          newTree,
          refTree,
        });

        i += 4;
        break;
      }

      case PATCH_TYPE.REPLACE_CHILD: {
        const newTree = patches[i + 1];
        const oldTree = patches[i + 2];

        simplified.push({
          type: 'replaceChild',
          newTree,
          oldTree,
        });

        i += 3;
        break;
      }

      case PATCH_TYPE.REMOVE_CHILD: {
        const vTree = patches[i + 1];

        simplified.push({
          type: 'removeChild',
          vTree,
        });

        i += 2;
        break;
      }
    }
  }

  return simplified;
}
