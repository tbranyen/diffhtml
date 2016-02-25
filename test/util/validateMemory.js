import { pools } from '../../lib/util/pools';
import makeNode from '../../lib/node/make';

/**
 * Validates that the memory has been successfully cleaned per render.
 */
export default function validateMemory() {
  assert.equal(pools.elementObject.cache.protected.size, 0,
    'Should not leave leftover protected elements');

  assert.equal(pools.elementObject.cache.allocated.size, 0,
    'Should not leave leftover element allocations');

  assert.equal(pools.attributeObject.cache.allocated.size, 0,
    'Should not leave leftover attribute allocations');

  assert.equal(pools.elementObject.cache.uuid.size, 0,
    'All element UUIDs should be unprotected');

  assert.equal(Object.keys(makeNode.nodes).length, 0,
    'The node cache should be empty');
}
