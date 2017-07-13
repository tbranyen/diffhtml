import {
  ChildParentCache,
  ComponentTreeCache,
  InstanceCache,
} from './caches';

const { assign } = Object;

export default parentTree => {
  const path = [];
  const instance = InstanceCache.get(parentTree);

  if (instance) {
    path.push(instance.getChildContext());
  }

  const { rawNodeName } = parentTree;

  while (parentTree = ChildParentCache.get(parentTree)) {
    if (!InstanceCache.has(parentTree)) {
      path.push(null);
      continue;
    }

    path.push(InstanceCache.get(parentTree).getChildContext());
  }

  // Merge least specific to most specific.
  return assign({}, ...path);
};
