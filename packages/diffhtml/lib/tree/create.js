import { NodeCache, CreateTreeHookCache } from '../util/caches';
import Pool from '../util/pool';
import { VTree, VTreeLike, ValidInput } from '../util/types';

const { assign } = Object;
const { isArray } = Array;
const { memory } = Pool;
const fragmentName = '#document-fragment';

/**
 * Typically passed either a single or list of DOM Nodes or a VTreeLike object.
 *
 * @param {ValidInput} input
 * @param {any=} attributes
 * @param {any=} childNodes
 * @param  {...any} rest
 *
 * @return {VTree}
 */
export default function createTree(input, attributes, childNodes, ...rest) {
  // Reuse a VTree if it has already been created and in the pool. This
  // is an optimization to make it safer to call `createTree` whenever
  // necessary.
  if (memory.protected.has(input) || memory.allocated.has(input)) {
    return /** @type {VTree} */ (input);
  }

  // If no input was provided, return an empty fragment.
  if (!input) {
    return createTree(fragmentName, null, []);
  }

  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (isArray(input)) {
    childNodes = [];

    for (let i = 0; i < input.length; i++) {
      const newTree = createTree(input[i]);
      const isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...newTree.childNodes);
      }
      else {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  const isObject = typeof input === 'object';
  const inputAsHTMLEl = /** @type {HTMLElement} */ (input);

  // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
  if (input && isObject && 'ownerDocument' in /** @type {HTMLElement} */ (input)) {
    attributes = {};
    childNodes = [];

    const inputAttributes = inputAsHTMLEl.attributes;

    // When working with a text node, simply save the nodeValue as the
    // initial value.
    if (input.nodeType === 3) {
      childNodes = input.nodeValue;
    }
    // Element types are the only kind of DOM node we care about attributes
    // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
    // ignore this.
    else if (input.nodeType === 1 && inputAttributes && inputAttributes.length) {
      attributes = {};

      for (let i = 0; i < inputAttributes.length; i++) {
        const { name, value } = inputAttributes[i];

        // If the attribute's value is empty, seek out the property instead.
        if (value === '' && name in input) {
          attributes[name] = /** @type {any} */ (input)[name];
          continue;
        }

        attributes[name] = value;
      }
    }

    // Get the child nodes from an Element or Fragment/Shadow Root.
    if (input.nodeType === 1 || input.nodeType === 11) {
      if (input.childNodes.length) {
        childNodes = [];

        for (let i = 0; i < input.childNodes.length; i++) {
          // Strip out leading and trailing empty text nodes.
          if (
            (i === 0 || i === input.childNodes.length - 1) &&
            input.childNodes[i] &&
            input.childNodes[i].nodeName === '#text' &&
            !(input.childNodes[i].nodeValue || '').trim()
          ) continue;

          /** @type {HTMLElement} */
          const childNodeElement = (input.childNodes[i]);
          const vTree = createTree(childNodeElement);
          NodeCache.set(vTree, childNodeElement);
          childNodes.push(vTree);
        }
      }
    }

    const vTree = createTree(input.nodeName, attributes, childNodes);
    NodeCache.set(vTree, input);
    return vTree;
  }

  // Assume any object value is a valid VTree object.
  if (isObject) {
    const inputAsVTreeLike = /** @type {VTreeLike} */ (input);
    const nodeName = String(inputAsVTreeLike.nodeName || inputAsVTreeLike.elementName);

    // The priority of a VTreeLike input is nodeValue above all else. If this value is
    // present, we assume a text-based element and that the intentions are setting the
    // children to this value.
    const vTree = createTree(
      nodeName,
      inputAsVTreeLike.attributes || null,
      inputAsVTreeLike.children || inputAsVTreeLike.childNodes,
    );

    // Ensure nodeValue is properly copied over.
    if (inputAsVTreeLike.nodeValue) {
      vTree.nodeValue = inputAsVTreeLike.nodeValue;
    }

    return vTree;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes, ...rest];
  }

  // Allocate a new VTree from the pool.
  const entry = Pool.get();
  const isTextNode = input === '#text';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = typeof input === 'string' ? input.toLowerCase() : fragmentName
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    const nodes = arguments.length === 2 ? attributes : childNodes;
    const nodeValue = isArray(nodes) ? nodes.join('') : nodes;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

    return entry;
  }

  if (input === fragmentName || typeof input !== 'string') {
    entry.nodeType = 11;
  }
  else if (input === '#comment') {
    entry.nodeType = 8;
  }
  else {
    entry.nodeType = 1;
  }

  const useAttributes = isArray(attributes) || typeof attributes !== 'object';
  const nodes = useAttributes ? attributes : childNodes;
  const nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (let i = 0; i < nodeArray.length; i++) {
      const newNode = nodeArray[i];
      const isNodeArray = isArray(newNode);

      // Merge in arrays.
      if (isNodeArray) {
        for (let i = 0; i < newNode.length; i++) {
          entry.childNodes.push(newNode[i]);
        }
      }
      // Skip over `null` nodes.
      else if (!newNode) {
        continue;
      }
      // Merge in fragments.
      else if (newNode.nodeType === 11 && typeof newNode.rawNodeName === 'string') {
        for (let i = 0; i < newNode.childNodes.length; i++) {
          entry.childNodes.push(newNode.childNodes[i]);
        }
      }
      // Assume objects are vTrees.
      else if (newNode && typeof newNode === 'object') {
        entry.childNodes.push(createTree(newNode));
      }
      // Cover generate cases where a user has indicated they do not want a
      // node from appearing.
      else if (newNode) {
        entry.childNodes.push(/** @type {VTree} **/ (createTree('#text', null, newNode)));
      }
    }
  }

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // If is a script tag and has a src attribute, key off that.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the `key` prop if passed as an attr, overrides `script[src]`.
  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  }

  // Only pass a vTree through once.
  const visited = new Set();

  CreateTreeHookCache.forEach((fn, retVal) => {
    if (visited.has(entry)) {
      return;
    }

    // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.
    if (retVal = fn(entry)) {
      assign(entry, retVal);
    }

    visited.add(entry);
  });

  return entry;
}
