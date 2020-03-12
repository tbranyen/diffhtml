import { Internals } from 'diffhtml';

const root = typeof global !== 'undefined' ? global : window;
const { NodeCache, decodeEntities, Pool } = Internals;

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
    debug(`[Missing DOM Node] ${vTree.nodeName} has no DOM Node association`);
  }
  else if (node.nodeName.toLowerCase() !== vTree.nodeName) {
    debug(`[Mismatched DOM Node] ${vTree.nodeName} has an invalid DOM Node association with ${node.nodeName}`);
  }
  else if (!Pool.memory.protected.has(vTree)) {
    debug(`[Unprotected DOM Node] ${vTree.nodeName} was not protected in memory`);
  }

  // Recursively search for problems.
  vTree.childNodes.forEach(verifyTreeNodeAssociation);
};

const compareTrees = (options, transaction, oldTree, newTree, verifyTree) => {
  const { promises } = transaction;

  const debug = setupDebugger(options);

  let oldAttrKeys = Object.keys(oldTree.attributes || {}).sort().filter(Boolean);
  let newAttrKeys = Object.keys(newTree.attributes || {}).sort().filter(Boolean);

  const oldTreeIsNode = oldTree instanceof Node;
  const oldLabel = oldTreeIsNode ? 'ON DOM NODE' : 'OLD';

  if (oldTreeIsNode) {
    newTree = flattenFragments(newTree);
  }

  const oldValue = decodeEntities(oldTree.nodeValue || '').replace(/\r?\n|\r/g, '');
  const newValue = decodeEntities(newTree.nodeValue || '').replace(/\r?\n|\r/g, '');

  if (oldTree.nodeName.toLowerCase() !== newTree.nodeName.toLowerCase() && newTree.nodeType !== 11) {
    debug(`[Mismatched nodeName] ${oldLabel}: ${oldTree.nodeName} NEW TREE: ${newTree.nodeName}`);
  }
  else if (oldTree.nodeValue && newTree.nodeValue && oldValue !== newValue) {
    debug(`[Mismatched nodeValue] ${oldLabel}: ${oldValue} NEW TREE: ${newValue}`);
  }
  else if (oldTree.nodeType !== newTree.nodeType && newTree.nodeType !== 11) {
    debug(`[Mismatched nodeType] ${oldLabel}: ${oldTree.nodeType} NEW TREE: ${newTree.nodeType}`);
  }
  else if (oldTree.childNodes.length !== newTree.childNodes.length) {
    debug(`[Mismatched childNodes length] ${oldLabel}: ${oldTree.childNodes.length} NEW TREE: ${newTree.childNodes.length}`);
  }

  if (oldTreeIsNode && oldTree.attributes) {
    oldAttrKeys = [...oldTree.attributes].map(s => String(s.name)).sort();
  }

  if (!oldTreeIsNode && !NodeCache.has(oldTree)) {
    debug(`Tree does not have an associated DOM Node`);
  }

  // Look for attribute differences.
  if (newTree.nodeType !== 11) {
    for (let i = 0; i < oldAttrKeys.length; i++) {
      const oldValue = getValue(oldTree, oldAttrKeys[i]) || '';
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

    for (let i = 0; i < oldTree.childNodes.length; i++) {
      if (oldTree.childNodes[i] && newTree.childNodes[i]) {
        compareTrees(options, transaction, oldTree.childNodes[i], newTree.childNodes[i], verifyTree);
      }
    }
  }

  verifyTreeNodeAssociation(verifyTree);
};

export default (options={}) => function verifyStateTask() {
  return transaction => {
    const { domNode, state } = transaction;
    const oldTree = transaction.oldTree || state.oldTree;
    const newTree = transaction.newTree;

    if (oldTree && newTree) {
      compareTrees(options, transaction, oldTree, newTree, oldTree);
    }

    transaction.onceEnded(() => {
      compareTrees(options, transaction, domNode, newTree, newTree);
    });
  };
};
