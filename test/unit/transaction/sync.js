import { syncTree } from '../../../lib/tree';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';

describe('Unit: Tree', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  describe('sync', function() {
    it('will error if patches passed is not an array', function() {
      assert.throws(function() {
        syncTree(null, null, 5);
      });
    });

    it('will error if oldTree is missing', function() {
      assert.throws(function() {
        syncTree(null);
      });
    });
  });
});
