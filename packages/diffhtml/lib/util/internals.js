import createNode from '../node/create';
import syncTree from '../tree/sync';
import * as caches from './caches';
import decodeEntities from './decode-entities';
import escape from './escape';
import makeMeasure from './make-measure';
import * as memory from './memory';
import Pool from './pool';
import process from './process';
import { PATCH_TYPE } from './types';

export default {
  // Utils.
  decodeEntities,
  escape,
  makeMeasure,
  memory,
  Pool,
  process,
  PATCH_TYPE,

  // Core.
  createNode,
  syncTree,

  // Merge in caches.
  ...caches,
};
