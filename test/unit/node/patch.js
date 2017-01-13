import { createTree, syncTree } from '../../../lib/tree';
import { patchNode } from '../../../lib/node';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';

describe('patchNode', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  it.skip('if elements are different replace them', () => {
    const oldTree = createTree('div');
    const newTree = createTree('h1');

    console.log(JSON.stringify(oldTree, null, 2));
  });

  describe.skip('Element inserts');
  describe.skip('Element removals');
  describe.skip('Element replacements');
  describe.skip('Element text changes');

  describe.skip('Attribute set');
  describe.skip('Attribute remove');
});
