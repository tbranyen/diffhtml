import { InstanceCache, ComponentTreeCache } from '../util/caches';

const { assign } = Object;
const ContextCache = new Map();

export default function getContext(vTree) {
  if (ContextCache.has(vTree)) {
    return ContextCache.get(vTree);
  }
  else if (ComponentTreeCache.has(vTree)) {
    const componentTree = ComponentTreeCache.get(vTree);
    const instance = InstanceCache.get(componentTree);
    const context = getContext(componentTree);

    if (instance) {
      const child = instance.getChildContext && instance.getChildContext();
      assign(context, child);
    }

    return context;
  }

  const context = {};
  ContextCache.set(vTree, context);
  return context;
}
