const { Internals, createTree } = require('diffhtml');
const { keys } = Object;

// Use the same tasks for every run. Maybe in the future we'll allow for
// passing custom tasks.
const tasks = new Set(Internals.defaultTasks);

// Replace the `endAsPromise` task with the string return value.
tasks.delete(Internals.tasks.endAsPromise);
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
 * @param {any} input Can be a diffHTML VTree object or string of HTML
 * @return {String} of rendered markup representing the input rendered
 */
exports.renderToString = function renderToString(markup, options = {}) {
  const oldTree = createTree(null);
  options.tasks = options.tasks || [...tasks];
  options.inner = true;

  return /** @type {String} */ (
    Internals.Transaction.create(oldTree, markup, options).start()
  );
};

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
    const isFalsy = !value;
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
function serializeVTree(vTree = {}) {
  let output = '';
  const { childNodes, nodeType, nodeName: tag, nodeValue, attributes } = vTree;

  // Document fragment.
  if (nodeType === 11) {
    childNodes.forEach(childNode => {
      output += serializeVTree(childNode);
    });
  }
  // Empty element.
  else if (!(childNodes.length) && nodeType === 1) {
    output += `<${tag}${serializeAttributes(attributes)}></${tag}>`;
  }
  // Text Nodes.
  else if (nodeType === 3) {
    output += nodeValue;
  }
  // Presentational DOM Node.
  else if (childNodes.length) {
    const children = childNodes.map(childNode =>
      `${serializeVTree(childNode)}`
    ).join('');

    output += `<${tag}${serializeAttributes(attributes)}>${children}</${tag}>`;
  }

  return output;
}
