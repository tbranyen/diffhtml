import {
  StateCache,
  NodeCache,
  MiddlewareCache,
  PoolCache,
} from '../../lib/util/caches';

/**
 * Validates that the memory has been successfully cleaned per render.
 */
export default function validateMemory() {
  assert.equal(PoolCache.get('element').cache.protected.size, 0,
    'Should not leave leftover protected elements');

  assert.equal(PoolCache.get('element').cache.allocated.size, 0,
    'Should not leave leftover element allocations');

  assert.equal(PoolCache.get('attribute').cache.allocated.size, 0,
    'Should not leave leftover attribute allocations');

  assert.equal(NodeCache.size, 0, 'The node cache should be empty');
  assert.equal(MiddlewareCache.size, 0, 'The middleware cache should be empty');
}
