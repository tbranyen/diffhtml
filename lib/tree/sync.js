const { assign, keys } = Object;

export default function syncTree(oldTree, newTree) {
  if (!oldTree) { throw new Error('Missing existing tree to sync from'); }
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  // Create new arrays for patches or use existing from a recursive call.
  const patches = arguments[2] || [];

  const changeset = Array(7).fill(null).map(() => []);

  const INSERT_BEFORE = changeset[0];
  const APPEND_CHILD = changeset[1];
  const REMOVE_CHILD = changeset[2];
  const REPLACE_CHILD = changeset[3];
  const NODE_VALUE = changeset[4];
  const SET_ATTRIBUTE = changeset[5];
  const REMOVE_ATTRIBUTE = changeset[6];

  // Immdiately push the changeset into the patches.
  patches.push(changeset);

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. The
  // exception is if the `newTree` is a document fragment / shadow dom.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // Shallow clone the `newTree` into the `oldTree`. We want to get the same
    // references/values inside here.
    assign(oldTree, newTree);
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
  const hasOldKeys = oldChildNodes.some(vTree => vTree.key);
  const hasNewKeys = hasOldKeys || newChildNodes.some(vTree => vTree.key);
  const keys = new Map();

  // Build up the key caches for each set of children.
  if ((hasOldKeys || hasNewKeys) && newChildNodes) {
    // Put the new `childNode` VTree's into the key cache for lookup.
    for (let i = 0; i < newChildNodes.length; i++) {
      const vTree = newChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        keys.add(vTree.key, vTree);
      }
    }
  }

  // First check for new elements to add, this is the most common in my
  // experience.
  if (newChildNodes.length > oldChildNodes.length) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    const fragment = [];

    for (let i = oldChildNodes.length; i < newChildNodes.length; i++) {
      // Internally add to the tree.
      oldChildNodes.push(newChildNodes[i]);

      // Add to the document fragment.
      fragment.push(newChildNodes[i]);
    }

    // Assign the fragment to the patches to be injected.
    APPEND_CHILD.push([oldTree, fragment]);
  }

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (newTree.nodeType === 1 && newTree.attributes.length) {
    // Cache the lengths for performance and readability.
    const oldNames = keys(oldTree.attributes);
    const newNames = keys(newTree.attributes);
    const setAttributes = [];
    const removeAttributes = [];

    for (let i = 0; i < newNames.length; i++) {
      const name = newNames[i];
      const value = newTree.attributes[name];

      if (oldNames.indexOf(name) < 0 || oldTree.attributes[name] !== value) {
        oldTree.attributes[name] = value;
        setAttributes.push([name, value]);
      }
    }

    for (let i = 0; i < oldNames.length; i++) {
      const name = oldNames[i];

      if (newNames.indexOf(name) < 0) {
        delete oldTree.attributes[name];
        removeAttributes.push(name);
      }
    }

    if (setAttributes.length) {
      SET_ATTRIBUTE.push([oldTree, setAttributes]);
    }

    if (removeAttributes.length) {
      REMOVE_ATTRIBUTE.push([oldTree, removeAttributes]);
    }
  }

  return patches;
}
