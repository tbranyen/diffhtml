import { strictEqual } from 'assert';
import diff from '../../lib/util/binding';
import {
  ActiveRenderState,
  InstanceCache,
  MountCache,
} from '../../lib/util/types';

/**
 * Validates that the caches has been successfully cleaned per render.
 */
export default function validateCaches() {
  strictEqual(ActiveRenderState.length, 0, 'The ActiveRenderState global should be empty');
  strictEqual(InstanceCache.size, 0, 'The Instance cache should be empty');
  strictEqual(MountCache.size, 0, 'The Mount cache should be empty');

  // Validate that core diffHTML is in a clean state.
   validateMemory();
}

const {
  Pool: { memory, size },
  memory: { gc },
  StateCache,
  NodeCache,
  MiddlewareCache,
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
} = diff.Internals;

function validateMemory() {
  // Run garbage collection after each test.
  gc();

  /*
  strictEqual(memory.protected.size, 0,
    'Should not leave leftover protected elements in memory');

  strictEqual(memory.allocated.size, 0,
    'Should not leave leftover element allocations in memory');

  strictEqual(memory.free.size, size,
    'Should bring the free pool size back to the default');

  strictEqual(StateCache.size, 0, 'The state cache should be empty');
  strictEqual(NodeCache.size, 0, 'The node cache should be empty');
  strictEqual(MiddlewareCache.size, 0, 'The middleware cache should be empty');

  // Ensure specific middleware caches are empty as well.
  strictEqual(CreateTreeHookCache.size, 0, 'The create tree hook cache should be empty');
  strictEqual(CreateNodeHookCache.size, 0, 'The create node hook cache should be empty');
  strictEqual(SyncTreeHookCache.size, 0, 'The sync tree hook cache should be empty');
  strictEqual(ReleaseHookCache.size, 0, 'The release hook cache should be empty');
  */
}
