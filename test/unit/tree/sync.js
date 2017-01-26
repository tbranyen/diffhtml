import { createTree, syncTree } from '../../../lib/tree';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';

describe('syncTree', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  it('if top level elements are different throw an error', () => {
    const oldTree = createTree('div');
    const newTree = createTree('h1');

    assert.throws(() => syncTree(oldTree, newTree));
  });

  it('if there are no changes, patchset should be empty', () => {
    const oldTree = createTree('div');
    const newTree = createTree('div');

    const patches = syncTree(oldTree, newTree);

    assert.deepEqual(patches, {
      TREE_OPS: [],
      NODE_VALUE: [],
      SET_ATTRIBUTE: [],
      REMOVE_ATTRIBUTE: [],
    });
  });

  describe('Text', () => {
    it('can detect node value change', () => {
      const oldTree = createTree('#text', 'test-test');
      const newTree = createTree('#text', 'test-text-two');

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [[oldTree, 'test-text-two']],
        SET_ATTRIBUTE: [],
        REMOVE_ATTRIBUTE: [],
      });
    });

    it('will not decode entities until patch', () => {
      const oldTree = createTree('#text', 'test-test');
      const newTree = createTree('#text', '&gla;');

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [[oldTree, '&gla;']],
        SET_ATTRIBUTE: [],
        REMOVE_ATTRIBUTE: [],
      });
    });
  });

  describe('Attributes', () => {
    it('can detect attribute/prop addition', () => {
      const oldTree = createTree('div');
      const newTree = createTree('div', { id: 'test-id' });

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [oldTree, 'id', 'test-id'],
        REMOVE_ATTRIBUTE: [],
      });
    });

    it('can detect multiple attribute/prop additions', () => {
      const oldTree = createTree('div');
      const newTree = createTree('div', {
        id: 'test-id',
        class: 'test-class',
      });

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [
          oldTree, 'id', 'test-id',
          oldTree, 'class', 'test-class',
        ],
        REMOVE_ATTRIBUTE: [],
      });
    });

    it('can detect multiple mixed type attribute/prop additions', () => {
      const oldTree = createTree('div');
      const newTree = createTree('div', {
        id: 'test-id',
        style: { fontWeight: 'bold' },
      });

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [
          oldTree, 'id', 'test-id',
          oldTree, 'style', { fontWeight: 'bold' },
        ],
        REMOVE_ATTRIBUTE: [],
      });
    });

    it('can detect the key attribute and apply to the tree', () => {
      const oldTree = createTree('div');
      const newTree = createTree('div', { key: 'test-key' });

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [
          oldTree, 'key', 'test-key',
        ],
        REMOVE_ATTRIBUTE: [],
      });

      assert.equal(newTree.key, 'test-key');
    });

    it('can detect string attribute changes and change old attribute', () => {
      const oldTree = createTree('div', { id: 'test' });
      const newTree = createTree('div', { id: 'test-two' });

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [
          oldTree, 'id', 'test-two',
        ],
        REMOVE_ATTRIBUTE: [],
      });

      assert.equal(oldTree.attributes.id, 'test-two');
    });

    it('can detect object attribute changes and change old attribute', () => {
      const oldTree = createTree('div', { style: {} });
      const newTree = createTree('div', { style: { fontWeight: 'bold' } });

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [
          oldTree, 'style', { fontWeight: 'bold' },
        ],
        REMOVE_ATTRIBUTE: [],
      });

      assert.equal(oldTree.attributes.style, newTree.attributes.style);
    });

    it('can detect an attribute to be removed', () => {
      const oldTree = createTree('div', { style: {} });
      const newTree = createTree('div');

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [],
        REMOVE_ATTRIBUTE: [
          oldTree, 'style',
        ],
      });

      assert.equal(oldTree.attributes.hasOwnProperty('style'), false);
    });

    it('can detect many attributes to be removed', () => {
      const oldTree = createTree('div', { id: 'test-id', style: {} });
      const newTree = createTree('div');

      const patches = syncTree(oldTree, newTree);

      assert.deepEqual(patches, {
        TREE_OPS: [],
        NODE_VALUE: [],
        SET_ATTRIBUTE: [],
        REMOVE_ATTRIBUTE: [
          oldTree, 'id',
          oldTree, 'style',
        ],
      });

      assert.equal(oldTree.attributes.hasOwnProperty('style'), false);
      assert.equal(oldTree.attributes.hasOwnProperty('id'), false);
    });

    describe('Attribute & Property Differences', () => {
      it('will convert className to class', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', { className: 'test-class' });

        const patches = syncTree(oldTree, newTree);

        assert.deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'class', 'test-class',
          ],
          REMOVE_ATTRIBUTE: [],
        });
      });

      it('will convert htmlFor to for', () => {
        const oldTree = createTree('div');
        const newTree = createTree('div', { htmlFor: 'test-for' });

        const patches = syncTree(oldTree, newTree);

        assert.deepEqual(patches, {
          TREE_OPS: [],
          NODE_VALUE: [],
          SET_ATTRIBUTE: [
            oldTree, 'for', 'test-for',
          ],
          REMOVE_ATTRIBUTE: [],
        });
      });
    });
  });
});
