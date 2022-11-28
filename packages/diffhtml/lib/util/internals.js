/**
 * @typedef {import('./types').Internals} Internals
 */
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
  EMPTY,
  PATCH_TYPE,
  NODE_TYPE,
  StateCache,
  NodeCache,
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
  globalConfig,

  // Set parse to an empty function by default to avoid bundling the parser
  // here.
  parse: EMPTY.FUN,

  // Enum.
  PATCH_TYPE,
  NODE_TYPE,

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
