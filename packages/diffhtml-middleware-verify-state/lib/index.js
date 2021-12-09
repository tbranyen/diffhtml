const root = typeof global !== 'undefined' ? global : window;
const { assign } = Object;
const binding = globalThis[Symbol.for('diffHTML')]

const { NodeCache, decodeEntities, Pool } = binding.Internals;
const { createTree } = binding;

const getValue = (vTree, keyName) => {
  if (vTree instanceof Node && vTree.attributes) {
    return vTree.attributes[keyName].value || vTree[keyName];
  }
  else {
    return vTree.attributes[keyName];
  }
};

const setupDebugger = options => message => {
  if (options.debug) {
    debugger;
    throw new Error(message);
  }
  else {
    console.warn(message);
  }
};

const cloneTree = tree => tree ? assign({}, tree, {
  attributes: assign({}, tree.attributes),
  childNodes: tree.childNodes.map(vTree => cloneTree(vTree)),
}) : null;

// Support loading diffHTML in non-browser environments.
const element = root.document ? document.createElement('div') : null;

const flattenFragments = vTree => {
  vTree.childNodes.forEach((childNode, i) => {
    if (childNode.nodeType === 11) {
      // Flatten the nodes into the position.
      vTree.childNodes.splice.apply(vTree.childNodes, [i, 1, ...childNode.childNodes]);
      childNode.childNodes.forEach(childNode => flattenFragments(childNode));
      return;
    }

    flattenFragments(childNode);
  });

  return vTree;
};

// Verify that a VTree matches what the NodeCache has associated.
const verifyTreeNodeAssociation = (debug, vTree) => {
  const node = NodeCache.get(vTree);

  if (!node) {
    //debug(`[Missing DOM Node] ${vTree.nodeName} has no DOM Node association`);
  }
  else if (node.nodeName.toLowerCase() !== vTree.nodeName) {
    debug(`[Mismatched DOM Node] ${vTree.nodeName} has an invalid DOM Node association with ${node.nodeName}`);
  }
  else if (!Pool.memory.protected.has(vTree)) {
    debug(`[Unprotected DOM Node] ${vTree.nodeName} was not protected in memory`);
  }

  // Recursively search for problems.
  vTree.childNodes.forEach(_vTree => verifyTreeNodeAssociation(debug, _vTree));
};

const compareTrees = (options, transaction, mount, newTree, verifyTree) => {
  const { promises } = transaction; const debug = setupDebugger(options);

  let oldAttrKeys = Object.keys(verifyTree.attributes || {}).sort().filter(Boolean);
  let newAttrKeys = Object.keys(newTree.attributes || {}).sort().filter(Boolean);

  const oldTreeIsNode = verifyTree instanceof Node;
  const oldLabel = oldTreeIsNode ? 'ON DOM NODE' : 'OLD';

  if (oldTreeIsNode) {
    newTree = flattenFragments(newTree);
  }

  const oldValue = decodeEntities(verifyTree.nodeValue || '').replace(/\r?\n|\r/g, '');
  const newValue = decodeEntities(newTree.nodeValue || '').replace(/\r?\n|\r/g, '');

  if (verifyTree.nodeName.toLowerCase() !== newTree.nodeName.toLowerCase() && newTree.nodeType !== 11) {
    debug(`[Mismatched nodeName] ${oldLabel}: ${verifyTree.nodeName} NEW TREE: ${newTree.nodeName}`);
  }
  else if (verifyTree.nodeValue && newTree.nodeValue && oldValue !== newValue) {
    debug(`[Mismatched nodeValue] ${oldLabel}: ${oldValue} NEW TREE: ${newValue}`);
  }
  else if (verifyTree.nodeType !== newTree.nodeType && newTree.nodeType !== 11) {
    debug(`[Mismatched nodeType] ${oldLabel}: ${verifyTree.nodeType} NEW TREE: ${newTree.nodeType}`);
  }
  else if (verifyTree.childNodes.length !== newTree.childNodes.length) {
    debug(`[Mismatched childNodes length] ${oldLabel}: ${verifyTree.childNodes.length} NEW TREE: ${newTree.childNodes.length}`);
  }

  if (oldTreeIsNode && oldTree.attributes) {
    oldAttrKeys = [...verifyTree.attributes].map(s => String(s.name)).sort();
  }

  //if (!oldTreeIsNode && !NodeCache.has(oldTree)) {
  //  debug(`Tree does not have an associated DOM Node`);
  //}

  // Look for attribute differences.
  if (newTree.nodeType !== 11) {
    for (let i = 0; i < oldAttrKeys.length; i++) {
      const oldValue = getValue(verifyTree, oldAttrKeys[i]) || '';
      const newValue = getValue(newTree, newAttrKeys[i]) || '';

      // If names are different report it out.
      if (oldAttrKeys[i].toLowerCase() !== newAttrKeys[i].toLowerCase()) {
        if (!newAttrKeys[i]) {
          debug(`[Unexpected attribute] ${oldLabel}: ${oldAttrKeys[i]}="${oldValue}"`);
        }
        else if (!oldAttrKeys[i]) {
          debug(`[Unexpected attribute] IN NEW TREE: ${newAttrKeys[i]}="${newValue}"`);
        }
        else {
          debug(`[Unexpected attribute] ${oldLabel}: ${oldAttrKeys[i]}="${oldValue}" IN NEW TREE: ${newAttrKeys[i]}="${newValue}"`);
        }
      }
      // If values are different
      else if (!oldTreeIsNode && oldValue !== newValue) {
        debug(`[Unexpected attribute] ${oldLabel}: ${oldAttrKeys[i]}="${oldValue}" IN NEW TREE: ${newAttrKeys[i]}="${newValue}"`);
      }
    }

    for (let i = 0; i < verifyTree.childNodes.length; i++) {
      if (verifyTree.childNodes[i] && newTree.childNodes[i]) {
        compareTrees(
          options,
          transaction,
          verifyTree.childNodes[i],
          newTree.childNodes[i],
          verifyTree.childNodes[i],
        );
      }
    }
  }

  verifyTreeNodeAssociation(debug, verifyTree);
};

function reduceEntry(inputAsVTree) {
  /** @type {VTree[]} */
  let foundElements = [];

  for (let i = 0; i < inputAsVTree.childNodes.length; i++) {
    const value = inputAsVTree.childNodes[i];
    const isText = value.nodeType === 3;

    // This is most likely the element that is requested to compare to. Will
    // need to keep checking or more input though to be totally sure.
    if (!isText || value.nodeValue.trim()) {
      foundElements.push(value);
    }
  }

  // If only one element is found, we can use this directly.
  if (foundElements.length === 1) {
    return foundElements[0];
  }
  // Otherwise consider the entire fragment.
  else if (foundElements.length > 1) {
    return createTree(inputAsVTree.childNodes);
  }
  else {
    return createTree(inputAsVTree);
  }
}

export default (options={}) => function verifyStateTask() {
  return transaction => {
    const { mount, state } = transaction;
    const oldTree = reduceEntry(transaction.oldTree || state.oldTree);
    const newTree = reduceEntry(transaction.newTree);

    if (oldTree && newTree) {
      compareTrees(options, transaction, oldTree, newTree, oldTree);
    }

    transaction.onceEnded(() => {
      //compareTrees(options, transaction, mount, newTree, newTree);
      compareTrees(options, transaction, mount, newTree, oldTree);
    });
  };
};
