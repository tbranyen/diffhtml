export {
  StateCache,
  NodeCache,
  MiddlewareCache,
  TransitionCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
} from './caches';

export { protectVTree, unprotectVTree, cleanMemory } from './memory';
export { namespace, elements } from './svg';
export { default as decodeEntities } from './decode-entities';
export { default as escape } from './escape';
export { default as makeMeasure } from './performance';
export { default as Pool } from './pool';
export { default as parse } from './parser';
