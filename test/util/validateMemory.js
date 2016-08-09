import * as pools from '../../lib/util/pools';
import { StateCache, NodeCache, MiddlewareCache } from '../../lib/util/cache';

/**
 * Validates that the memory has been successfully cleaned per render.
 */
export default function validateMemory() {
  //console.log(JSON.stringify(
  //  pools.elementObject.cache.protected, null, 2
  //));

  assert.equal(pools.elementObject.cache.protected.size, 0,
    'Should not leave leftover protected elements');

  assert.equal(pools.elementObject.cache.allocated.size, 0,
    'Should not leave leftover element allocations');

  assert.equal(pools.attributeObject.cache.allocated.size, 0,
    'Should not leave leftover attribute allocations');

  assert.equal(NodeCache.size, 0, 'The node cache should be empty');
  assert.equal(MiddlewareCache.size, 0, 'The middleware cache should be empty');
}
