import { InstanceCache, VTree } from '../util/types';

const { assign } = Object;

/**
 * @param {VTree} vTree - tree to lookup component from
 */
export default function getContext(vTree) {
  const context = {};

  if (InstanceCache.has(vTree)) {
    const instances = InstanceCache.get(vTree);

    // If instances were set and the length is not zero, process all of the
    // getChildContext functions.
    if (instances && instances.length) {
      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        const child = instance.getChildContext && instance.getChildContext();

        if (child) {
          assign(context, child);
        }
      }
    }
  }

  return context;
}
