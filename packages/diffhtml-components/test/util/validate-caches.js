import assert from 'assert';
import { Internals } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../../lib/util/caches';

/**
 * Validates that the caches has been successfully cleaned per render.
 */
export default function validateCaches() {
  assert.equal(ComponentTreeCache.size, 0, 'The ComponentTree cache should be empty');
  assert.equal(InstanceCache.size, 0, 'The instance cache should be empty');

  // Validate that core diffHTML is in a clean state.
  validateCore();
}

const {
  Pool: { memory },
  memory: { cleanMemory },
  StateCache,
  NodeCache,
  MiddlewareCache,
  TransitionCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
} = Internals;

function validateCore() {
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

