import { throws } from 'assert';
import { syncTrees } from '../lib/tasks';
import validateMemory from './util/validateMemory';

describe('Tasks', function() {
  afterEach(() => validateMemory());

  describe('syncTrees', () => {
    it('will error if patches passed is not an array', () => {
      throws(() => syncTrees(null, null, 5));
    });

    it('will error if oldTree is missing', () => {
      throws(() => syncTrees(null));
    });
  });
});
