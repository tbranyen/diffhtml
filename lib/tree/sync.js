export default function syncTree(oldTree, newTree) {
  if (!oldTree) { throw new Error('Missing existing tree to sync from'); }
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  // Create new arrays for patches or use existing from a recursive call.
  const patches = arguments[2] || {
    ELEMENT: { INSERT: [], REMOVE: [], REPLACE: [], TEXT: [] },
    ATTRIBUTE: { SET: [], REMOVE: [] },
  };

  const { ELEMENT, ATTRIBUTE } = patches;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. The
  // exception is if the `newTree` is a document fragment / shadow dom.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // Shallow clone the `newTree` into the `oldTree`. We want to get the same
    // references/values inside here.
    Object.assign(oldTree, newTree);
    ELEMENT.REPLACE.push([oldTree, newTree]);
    return patches;
  }

  // If these trees are identical references, abort early. This will occur
  // when caching static VTrees.
  if (oldTree === newTree) {
    return patches;
  }

  // If both VTrees are text nodes then copy the value over.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    oldTree.nodeValue = newTree.nodeValue;
    ELEMENT.TEXT.push([oldTree, oldTree.nodeValue]);
    return patches;
  }

  const { childNodes: oldChildNodes } = oldTree;
  const { childNodes: newChildNodes } = newTree;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  const hasOldKeys = oldChildNodes && oldChildNodes.some(vTree => vTree.key);
  const hasNewKeys = hasOldKeys || newChildNodes.some(vTree => vTree.key);
  const keys = new Map();

  // Build up the key caches for each set of children.
  if ((hasOldKeys || hasNewKeys) && newTree.childNodes) {
    // Put the new `childNode` VTree's into the key cache for lookup.
    for (let i = 0; i < newTree.childNodes.length; i++) {
      const vTree = newTree.childNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        keys.add(vTree.key, vTree);
      }
    }
  }

  return patches;
}
