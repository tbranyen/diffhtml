const { use, html, Internals, createTree, outerHTML } = require('diffhtml');
const { makeDOMNode } = require('quick-dom-node');
const { keys } = Object;

// Apply a transformation function against the Nodes to produce a string of
// markup.
use({ createNodeHook: vTree => makeDOMNode(vTree) });

// Use the same tasks for every run. Maybe in the future we'll allow for
// passing custom tasks.
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
  transaction.domNode = makeDOMNode(domNode);
});

// Now that the reconcilation phase has been modified, proceed as normal.
tasks.add(Internals.tasks.syncTrees);

// Return the string.
tasks.add(function endAsString(transaction) {
  return serializeVTree(transaction.oldTree);
});

/**
 * renderToString
 *
 * Works like outerHTML by rendering a VTree and returning the source. This
 * will accept any input that `outerHTML` normally accepts. This is a true
 * render, but omits the DOM patching task.
 *
 * @param {any} markup Can be a diffHTML VTree object or string of HTML
 * @return {String} of rendered markup representing the input rendered
 */
exports.renderToString = function renderToString(markup, options = {}) {
  const parseHTML = options.strict ? html.strict : html;
  const newTree = typeof markup === 'string' ? parseHTML(markup) : markup;
  const oldTree = createTree(newTree.rawNodeName);

  return outerHTML(oldTree, newTree, { tasks: [...tasks], options });
}

/**
 * serializeAttributes
 *
 * Takes in a diffHTML VTree attributes object and turns it into a key=value
 * string.
 *
 * @param {Object} attributes
 * @return {String}
 */
function serializeAttributes(attributes) {
  const attrs = keys(attributes);

  return attrs.length ? ' ' + attrs.map((keyName, i) => {
    const value = attributes[keyName];
    const isFalsy = !Boolean(value);
    const isDynamic = typeof value === 'object' || typeof value === 'function';

    return `${keyName}${(!isFalsy && !isDynamic) ? `="${String(value)}"` : ''}`;
  }).join(' ') : '';
}

/**
 * serializeVTree
 *
 * Takes in a diffHTML VTree object and turns it into a string of HTML.
 *
 * @param {Object} vTree
 * @return {String}
 */
function serializeVTree(vTree) {
  const { attributes, childNodes } = vTree;

  let output = '';

  // Document fragment.
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
  // Presentational DOM Node.
  else if (vTree.childNodes.length) {
    output += `<${vTree.nodeName}${serializeAttributes(vTree.attributes)}>${vTree.childNodes.map(childNode => `${serializeVTree(childNode)}`).join('')}</${vTree.nodeName}>`;
  }

  return output;
}
