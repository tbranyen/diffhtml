import {
  ChildParentCache,
  ComponentTreeCache,
  InstanceCache,
} from './caches';

const { assign } = Object;

export default parentTree => {
  const path = [];
  const instance = InstanceCache.get(parentTree);

  if (!parentTree) {
    return {};
  }

  if (instance && instance.getChildContext) {
    path.push(instance.getChildContext());
  }

  const { rawNodeName } = parentTree;

  while (parentTree = ChildParentCache.get(parentTree)) {
    if (!InstanceCache.has(parentTree)) {
      path.push(null);
      continue;
    }


    const instance = InstanceCache.get(parentTree);

    if (instance && instance.getChildContext) {
      path.push(instance.getChildContext());
    }
  }

  // Merge least specific to most specific.
  return assign({}, ...path);
};
