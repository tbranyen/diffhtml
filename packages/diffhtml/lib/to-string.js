/**
 * @typedef {import('./util/types').ValidInput} ValidInput
 * @typedef {import('./util/types').TransactionConfig} TransactionConfig
 * @typedef {import('./util/types').VTree} VTree
 * @typedef {import('./util/types').VTreeAttributes} VTreeAttributes
 */
import createTree from './tree/create';
import Transaction, { defaultTasks, tasks } from './transaction';
import release from './release';

const { keys } = Object;

/**
 * Renders input to a string.
 *
 * Works like outerHTML by rendering a VTree and returning the source. This
 * will accept any input that `outerHTML` normally accepts. This is a true
 * render, but omits the DOM patching task.
 *
 * @param {ValidInput} input
 * @param {TransactionConfig} config
 * @return {string}
 */
export default function toString(input, config = {}) {
  const oldTree = createTree();
  const activeTasks = new Set(config.tasks || defaultTasks);

  activeTasks.delete(tasks.patchNode);
  // Replace the `endAsTransaction` task with the string return value.
  activeTasks.delete(tasks.endAsTransaction);
  activeTasks.add(function endAsString(/** @type {Transaction} */ transaction) {
    return serializeVTree(transaction.oldTree);
  });

  config.tasks = [...activeTasks];
  config.inner = true;

  let markup = '';

  try {
    markup = /** @type {string} */ (
      Transaction.create(oldTree, input, config).start()
    );
  }
  catch (e) {
    release(oldTree);
    throw e;
  }

  release(oldTree);

  return markup;
}

/**
 * serializeAttributes
 *
 * Takes in a diffHTML VTree attributes object and turns it into a key=value
 * string.
 *
 * @param {VTreeAttributes} attributes
 * @return {String}
 */
function serializeAttributes(attributes) {
  const attrs = keys(attributes);

  return attrs.length ? ' ' + attrs.map((keyName) => {
    const value = attributes[keyName];
    const isFalsy = !value;
    const isDynamic = typeof value === 'object' || typeof value === 'function';

    if (value === true) {
      return keyName;
    }

    return `${keyName}${(!isFalsy && !isDynamic) ? `="${String(value)}"` : ''}`;
  }).join(' ') : '';
}

/**
 * serializeVTree
 *
 * Takes in a diffHTML VTree object and turns it into a string of HTML.
 *
 * @param {VTree=} vTree
 * @return {String}
 */
function serializeVTree(vTree) {
  let output = '';

  if (!vTree) {
    return output;
  }

  const { childNodes, nodeType, nodeName: tag, nodeValue, attributes } = vTree;

  // Document fragment.
  if (nodeType === 11) {
    for (let i = 0; i < childNodes.length; i++) {
      output += serializeVTree(childNodes[i]);
    }
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
