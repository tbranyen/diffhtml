const { use, Internals, createTree, innerHTML } = require('diffhtml');

// Simple helper to make a DOM-like object.
const makeDomNode = (props) => ({
  ...props,

  childNodes: [],
  parentNode: {},

  appendChild(node) {
    this.childNodes.push(node);
  }
});

// Apply a transformation function against the Nodes to produce a string of
// markup.
use({
  createNodeHook(vTree) {
    return makeDomNode(vTree);
  },
});

const tasks = new Set(Internals.defaultTasks);

// Remove incompatible tasks, and replace them with serialization-compatible
// functions.
tasks.delete(Internals.tasks.reconcileTrees);
tasks.delete(Internals.tasks.syncTrees);
tasks.delete(Internals.tasks.patchNode);
tasks.delete(Internals.tasks.endAsPromise);

// Add a new reconcile trees function to ensure we are diffing against a tree
// instead of DOM Node.
tasks.add(function reconcileTrees(transaction) {
  const { domNode, markup, options } = transaction;

  // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).
  if (!transaction.newTree) {
    transaction.newTree = createTree(markup);
  }

  // Associate the old tree with this brand new transaction. Always ensure that
  // diffing happens at the root level. This avoids the unnecessary REPLACE
  // operation that would normally occur under `innerHTML`.
  transaction.oldTree = domNode;

  // Create a fake, but fast DOM node, replacing the VTree passed in.
  transaction.domNode = makeDomNode(domNode);
});

// Now that the reconcilation phase has been modified, proceed as normal.
tasks.add(Internals.tasks.syncTrees);
tasks.add(Internals.tasks.endAsPromise);

module.exports = function renderToString(vTree) {
  const oldTree = createTree(vTree.rawNodeName);

  innerHTML(oldTree, vTree, {
    tasks: [...tasks],
  });

  return serializeVTree(oldTree);
}

function serializeAttributes(attributes) {
  const attrs = Object.keys(attributes);

  return attrs.length ? ' ' + attrs.map((keyName, i) => {
    const value = attributes[keyName];
    const isFalsy = !Boolean(value);
    const isDynamic = typeof value === 'object' || typeof value === 'function';

    return `${keyName}${(!isFalsy && !isDynamic) ? `="${String(value)}"` : ''}`;
  }).join(' ') : '';
}

function serializeVTree(vTree) {
  let output = '';
  const { attributes, childNodes } = vTree;

  if (vTree.nodeType === 11) {
    vTree.childNodes.forEach(childNode => {
      output += serializeVTree(childNode);
    });
  }
  // Empty element.
  else if (!(vTree.childNodes.length) && vTree.nodeType === 1) {
    output += `<${vTree.nodeName}${serializeAttributes(vTree.attributes)}></${vTree.nodeName}>`;
  }
  // Text Nodes.
  else if (vTree.nodeType === 3) {
    output += vTree.nodeValue;
  }
  // Nest elements.
  else if (vTree.childNodes.length) {
    output += `<${vTree.nodeName}${serializeAttributes(vTree.attributes)}>${vTree.childNodes.map(childNode => `${serializeVTree(childNode)}`).join('')}</${vTree.nodeName}>`;
  }

  return output;
}
