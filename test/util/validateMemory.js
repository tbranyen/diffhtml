import { pools } from '../../lib/util/pools';
import makeNode from '../../lib/node/make';

/**
 * Validates that the memory has been successfully cleaned per render.
 */
export default function validateMemory() {
  assert.equal(pools.elementObject.cache.protected.length, 0,
    'Should not leave leftover protected elements');

  assert.equal(pools.elementObject.cache.allocated.length, 0,
    'Should not leave leftover allocations');

  assert.equal(Object.keys(pools.elementObject.cache.uuid).length, 0,
    'All UUIDs should be unprotected');

  assert.equal(Object.keys(makeNode.nodes).length, 0,
    'The node cache should be empty');
}
