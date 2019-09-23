import assert from 'assert';
import {
  StateCache,
  NodeCache,
  MiddlewareCache,
  TransitionCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
} from '../../lib/util/caches';
import Pool from '../../lib/util/pool';
import { cleanMemory } from '../../lib/util/memory';

const { memory } = Pool;

/**
 * Validates that the memory has been successfully cleaned per render.
 */
export default function validateMemory() {
  cleanMemory();

  assert.equal(memory.protected.size, 0,
    'Should not leave leftover protected elements in memory');

  assert.equal(memory.allocated.size, 0,
    'Should not leave leftover element allocations in memory');

  assert.equal(StateCache.size, 0, 'The state cache should be empty');
  assert.equal(NodeCache.size, 0, 'The node cache should be empty');
  assert.equal(MiddlewareCache.size, 0, 'The middleware cache should be empty');

  // Ensure specific middleware caches are empty as well.
  assert.equal(CreateTreeHookCache.size, 0, 'The create tree hook cache should be empty');
  assert.equal(CreateNodeHookCache.size, 0, 'The create node hook cache should be empty');
  assert.equal(SyncTreeHookCache.size, 0, 'The sync tree hook cache should be empty');
  assert.equal(ReleaseHookCache.size, 0, 'The release hook cache should be empty');

  // Check all transition caches.
  TransitionCache.forEach((cache, name) => {
    assert.equal(cache.size, 0, `The ${name} transition cache should be empty`);
  })
}
