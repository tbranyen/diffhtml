/**
 * @typedef {import('../util/types').ValidInput} ValidInput
 * @typedef {import('../util/types').VTree} VTree
 * @typedef {import('../util/types').VTreeLike} VTreeLike
 */
import Pool from '../util/pool';
import {
  EMPTY,
  NODE_TYPE,
  NodeCache,
  CreateTreeHookCache,
} from '../util/types';

const { isArray } = Array;
const { memory } = Pool;
const fragmentName = '#document-fragment';
const textName = '#text';

/**
 * Will flatten fragments that should remain invisible. If a fragment was
 * intentionally created to be diffed, such as a component, the rawNodeName
 * will not match and will be preserved.
 *
 * @param {VTree[]} vTrees
 * @param {VTree[]} retVal
 *
 * @return {VTree[]}
 */
function flatten(vTrees, retVal = []) {
  for (let i = 0; i < vTrees.length; i++) {
    const vTree = vTrees[i];

    if (vTree && vTree.rawNodeName === fragmentName) {
      flatten(vTree.childNodes, retVal);
    }
    else if (vTree) {
      retVal.push(vTree);
    }
  }

  return retVal;
}

/**
 * Typically passed either a single or list of DOM Nodes or a VTreeLike object.
 *
 * @param {ValidInput=} input
 * @param {any=} attributes
 * @param {any=} childNodes
 * @param  {...any} rest
 *
 * @return {VTree}
 */
export default function createTree(input, attributes, childNodes, ...rest) {
  /** @type {VTree | null} */
  let entry = null;

  // Reuse a VTree if it has already been created and in the pool. This is an
  // optimization and reliability check to ensure repeated calls to this
  // function with the same reference produces consistent results.
  if (memory.protected.has(input) || memory.allocated.has(input)) {
    entry = /** @type {VTree } */ (input);
  }

  // A fragment is used whenever an array is passed directly into createTree.
  // This is also what is returned when no input is passed.
  else if (!input || isArray(input)) {
    const length = input ? input.length : 0;

    childNodes = [];

    // When using an Array copy the Nodes in and ensure a valid top-level tree.
    for (let i = 0; i < length; i++) {
      const hasInput = input && !input[i];
      if (hasInput) continue;
      input && childNodes.push(input[i]);
    }

    entry = createTree(fragmentName, null, childNodes);
  }

  // If a return value was found, end this function early.
  if (entry) {
    return entry;
  }

  const isObject = typeof input === 'object';
  const inputAsHTMLEl = /** @type {HTMLElement} */ (input);

  // If the input passed has an 'ownerDocument' property, then assume it is a
  // DOM-like Node object. This means we need to synchronize the DOM and this is
  // an expensive operation.
  if (input && isObject && 'ownerDocument' in inputAsHTMLEl) {
    const { nodeType } = inputAsHTMLEl;

    // When passed a text node, simply migrate the value over into the new VTree
    // associate in the NodeCache.
    if (nodeType === NODE_TYPE.TEXT) {
      const vTree = createTree(textName, inputAsHTMLEl.nodeValue);
      NodeCache.set(vTree, inputAsHTMLEl);
      return vTree;
    }

    attributes = {};
    childNodes = [];

    const inputAttrs = inputAsHTMLEl.attributes;

    // We only scrape attributes from element nodes if they are available.
    if (inputAsHTMLEl.nodeType === NODE_TYPE.ELEMENT && inputAttrs && inputAttrs.length) {
      for (let i = 0; i < inputAttrs.length; i++) {
        const { name, value } = inputAttrs[i];

        // If the attribute's value is empty, seek out the property instead.
        if (value === EMPTY.STR && name in inputAsHTMLEl) {
          attributes[name] = /** @type {any} */ (input)[name];
          continue;
        }

        attributes[name] = value;
      }
    }

    // Get the child nodes from an Element or Fragment/Shadow Root.
    if (inputAsHTMLEl.nodeType === NODE_TYPE.ELEMENT || inputAsHTMLEl.nodeType === NODE_TYPE.FRAGMENT) {
      childNodes = [];

      for (let i = 0; i < inputAsHTMLEl.childNodes.length; i++) {
        /** @type {ValidInput} */
        const childNodeElement = (inputAsHTMLEl.childNodes[i]);
        childNodes.push(createTree(childNodeElement));
      }
    }

    // FIXME This is going to hurt performance. Is there a better way to find a
    // VTree from a DOM Node?
    NodeCache.forEach((domNode, vTree) => {
      if (domNode === input) {
        entry = vTree;
      }
    });

    /**
     * If no VTree was previously bound this to DOM Node, create a brand new
     * tree.
     *
     * @type {VTree} */
    entry = entry || createTree(
      inputAsHTMLEl.nodeName,
      attributes,
      childNodes,
    );

    entry.attributes = { ...entry.attributes, ...attributes };

    // Use childNodes that are passed in, otherwise keep the existing nodes.
    entry.childNodes = childNodes;

    NodeCache.set(entry, inputAsHTMLEl);
    return entry;
  }

  // Assume any remaining objects are VTree-like.
  if (isObject && !attributes) {
    /** @type {VTreeLike} */
    const {
      rawNodeName,
      nodeName,
      nodeValue,
      attributes,
      childNodes,
      children,
    } = (/** @type {any} */(input));

    const treeName = rawNodeName || nodeName;

    // The priority of a VTreeLike input is nodeValue above all else. If this
    // value is present, we assume a text-based element and that the intentions
    // are setting the children to this value.
    const vTree = createTree(
      treeName,
      attributes || null,
      children || childNodes,
    );

    // Ensure nodeValue is properly copied over.
    if (nodeValue) {
      vTree.nodeValue = nodeValue;
    }

    return vTree;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes, ...rest];
  }

  // Allocate a new VTree from the pool.
  entry = Pool.get();

  const isTextNode = input === textName;
  const isString = typeof input === 'string';

  // This is a standard HTML element.
  if (isString) {
    entry.rawNodeName = input;
    entry.nodeName = entry.rawNodeName.toLowerCase();
  }
  // Otherwise treat this as a fragment, since we have no idea what type of
  // element it is.
  else {
    entry.rawNodeName = input;
    entry.nodeName = fragmentName;
  }

  // Clear out and reset the remaining VTree attributes.
  entry.nodeValue = EMPTY.STR;
  entry.key = EMPTY.STR;
  entry.childNodes.length = 0;
  entry.attributes = {};

  // Were childNodes passed as attributes? If so, use the attributes parameter
  // instead.
  const useAttributes = isArray(attributes) || typeof attributes !== 'object';
  const useNodes = useAttributes ? attributes : childNodes;
  const allNodes = flatten(isArray(useNodes) ? useNodes : [useNodes]);

  // Ensure nodeType is set correctly, and if this is a text node, return early.
  if (isTextNode) {
    const nodeValue = allNodes.join(EMPTY.STR);

    entry.nodeType = NODE_TYPE.TEXT;
    entry.nodeValue = String(nodeValue);

    return entry;
  }
  else if (entry.nodeName === fragmentName) {
    entry.nodeType = NODE_TYPE.FRAGMENT;
  }
  else if (input === '#comment') {
    entry.nodeType = NODE_TYPE.COMMENT;
  }
  else {
    entry.nodeType = NODE_TYPE.ELEMENT;
  }

  // Parse out the child nodes if they exist and are not overwritten by an
  // attribute.
  if (useNodes && allNodes.length && (!attributes || !attributes.childNodes)) {
    for (let i = 0; i < allNodes.length; i++) {
      const newNode = allNodes[i];

      // Merge in arrays.
      if (isArray(newNode)) {
        entry.childNodes.push(...newNode);
      }
      // Skip over `null` nodes.
      else if (!newNode) {
        continue;
      }
      // Merge in true fragments, but not components or unknowns.
      else if (newNode.nodeType === NODE_TYPE.FRAGMENT && typeof newNode.rawNodeName === 'string') {
        entry.childNodes.push(...newNode.childNodes);
      }
      // Assume objects are vTrees.
      else if (newNode && typeof newNode === 'object') {
        entry.childNodes.push(createTree(newNode));
      }
      // Last resort treat as text.
      else {
        entry.childNodes.push(createTree(textName, null, newNode));
      }
    }
  }

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = { ...attributes };

    // Use childNodes directly from the attributes.
    if (attributes.childNodes) {
      const isObject = typeof attributes.childNodes === 'object';
      entry.childNodes.push(isObject ? createTree(attributes.childNodes) : createTree(textName, attributes.childNodes));
    }
  }

  // If is a script tag and has a src attribute, key off that. We have a special
  // handling of scripts to avoid accidentally re-executing a script when
  // shifting position.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the `key` prop if passed as an attr, overrides `script[src]`.
  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  }

  // Only run the `forEach` if there are hooks to run.
  if (CreateTreeHookCache.size) {
    CreateTreeHookCache.forEach((fn, retVal) => {
      // If the hook returns a value, replace the active entry.
      if (retVal = fn(entry)) {
        entry = createTree(retVal);
      }
    });
  }

  return entry;
}
