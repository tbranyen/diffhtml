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

export const cloneTree = tree => tree ? assign({}, tree, {
  attributes: assign({}, tree.attributes),
  childNodes: tree.childNodes.map(vTree => cloneTree(vTree))
}) : null;

// Support loading diffHTML in non-browser environments.
const element = global.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
export const decodeEntities = string => {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || string.indexOf('&') === -1) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
};

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

export const compareTrees = (options, transaction, oldTree, newTree) => {
  const { state: { internals: { NodeCache } } } = transaction;
  const debug = setupDebugger(options);

  let oldAttrKeys = Object.keys(oldTree.attributes || {}).sort();
  let newAttrKeys = Object.keys(newTree.attributes || {}).sort();

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
        compareTrees(options, transaction, oldTree.childNodes[i], newTree.childNodes[i]);
      }
    }
  }
};

export default (options={}) => () => transaction => {
  const { domNode, state } = transaction;
  const oldTree = transaction.oldTree || state.oldTree;
  const newTree = transaction.newTree;

  if (oldTree && newTree) {
    compareTrees(options, transaction, oldTree, newTree);
  }

  transaction.onceEnded(() => compareTrees(options, transaction, domNode, newTree));
};
