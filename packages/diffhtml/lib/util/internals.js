import Transaction, { defaultTasks, tasks } from '../transaction';
import createNode from '../node/create';
import syncTree from '../tree/sync';
import decodeEntities from './decode-entities';
import escape from './escape';
import makeMeasure from './make-measure';
import * as memory from './memory';
import Pool from './pool';
import internalProcess from './process';
import { globalConfig } from './config';
import {
  PATCH_TYPE,
  Internals,
  StateCache,
  NodeCache,
  TransitionCache,
  MiddlewareCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
  ParseHookCache,
} from './types';

const caches = {
  StateCache,
  NodeCache,
  TransitionCache,
  MiddlewareCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
  ParseHookCache,
};

export default /** @type {Internals} */ ({
  // Utils.
  decodeEntities,
  escape,
  makeMeasure,
  memory,
  Pool,
  process: internalProcess,
  PATCH_TYPE,
  globalConfig,

  // Core.
  createNode,
  syncTree,

  // Tasks.
  Transaction,
  defaultTasks,
  tasks,

  // Merge in caches.
  ...caches,
});
