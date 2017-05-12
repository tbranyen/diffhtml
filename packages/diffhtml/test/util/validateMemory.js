import assert from 'assert';
import { NodeCache, MiddlewareCache } from '../../lib/util/caches';
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

  assert.equal(NodeCache.size, 0, 'The node cache should be empty');
  assert.equal(MiddlewareCache.size, 0, 'The middleware cache should be empty');
}
