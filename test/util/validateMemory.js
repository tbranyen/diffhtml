import {
  StateCache,
  NodeCache,
  MiddlewareCache,
  Pool,
} from '../../lib/util';

/**
 * Validates that the memory has been successfully cleaned per render.
 */
export default function validateMemory() {
  const { memory } = Pool;

  assert.equal(memory.protected.size, 0,
    'Should not leave leftover protected elements in memory');

  assert.equal(memory.allocated.size, 0,
    'Should not leave leftover element allocations in memory');

  assert.equal(NodeCache.size, 0, 'The node cache should be empty');
  assert.equal(MiddlewareCache.size, 0, 'The middleware cache should be empty');
}
