/**
 * @typedef {import('./util/types').VTree} VTree
 * @typedef {import('./util/types').Supplemental} Supplemental
 */
import createTree from './tree/create';
import Internals from './util/internals';
import escape from './util/escape';
import decodeEntities from './util/decode-entities';
import internalProcess from './util/process';
import { EMPTY, NODE_TYPE } from './util/types';

// Magic token used for interpolation.
const TOKEN = '__DIFFHTML__';

const { getOwnPropertyNames } = Object;
const { isArray } = Array;
const tokenEx = new RegExp(`${TOKEN}([^_]*)__`);

// Get the next value from the list. If the next value is a string, make sure
// it is escaped.
const nextValue = (/** @type {any[]} */ values) => {
  const value = values.shift();
  return typeof value === 'string' ? escape(decodeEntities(value)) : value;
};

/**
 * Iterates over the result from the parser and interpolates the supplemental
 * dynamic data into place. This allows parsers to only worry about strings
 * and returning minimal structures.
 *
 * This also flattens fragments.
 *
 * @param {VTree} childNode
 * @param {Supplemental} supplemental
 * @return {VTree}
 */
const interpolateAndFlatten = (childNode, supplemental) => {
  let match = null;
  let newNodeName = childNode.rawNodeName;

  // Comments
  if (childNode.nodeType === NODE_TYPE.COMMENT) {
    const parts = childNode.nodeValue.split(tokenEx);
    let newValue = '';

    for (let i = 0; i < parts.length; i++) {
      const isDynamic = i % 2 !== 0;

      if (isDynamic) {
        newValue += supplemental.attributes[parts[i]];
      }
      else {
        newValue += parts[i];
      }
    }

    childNode.nodeValue = newValue;
  }

  // Node name
  if (match = tokenEx.exec(childNode.rawNodeName)) {
    newNodeName = supplemental.tags[match[1]];

    childNode = createTree(
      newNodeName,
      childNode.attributes,
      childNode.childNodes,
    );
  }

  // Attributes
  for (const keyName of getOwnPropertyNames(childNode.attributes)) {
    keyName.split(' ').forEach(keyName => {
      const value = childNode.attributes[keyName];
      let newValue = value;
      let newKey = keyName;

      // Check for dynamic value and assign to newValue.
      if (match = tokenEx.exec(value)) {
        const parts = value.split(tokenEx);
        newValue = '';

        // A value is always split between two other elements.
        if (parts.length === 3 && parts[0] === EMPTY.STR && parts[2] === EMPTY.STR) {
          newValue = supplemental.attributes[parts[1]];
        }
        else {
          for (let i = 0; i < parts.length; i++) {
            const isDynamic = i % 2 !== 0;

            if (isDynamic) {
              newValue += supplemental.attributes[parts[i]];
            }
            else {
              newValue += parts[i];
            }
          }
        }
      }

      // Check for dynamic key and assign to newKey.
      if (match = tokenEx.exec(keyName)) {
        const parts = keyName.split(tokenEx);

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 !== 0) {
            newKey = supplemental.attributes[parts[i]];
          }
        }
      }

      if (newKey) {
        if (typeof newKey !== 'string') {
          if (Array.isArray(newKey)) {
            if (internalProcess.env.NODE_ENV !== 'production') {
              throw new Error('Arrays cannot be spread as attributes');
            }

            delete childNode.attributes[keyName];
          }
          else {
            delete childNode.attributes[keyName];
            Object.assign(childNode.attributes, newKey);
          }
        }
        else {
          delete childNode.attributes[keyName];

          if (newKey === 'childNodes') {
            childNode.childNodes.length = 0;
            if (typeof newValue !== 'string') {
              childNode.childNodes.push(createTree(newValue));
            }
            else {
              childNode.childNodes.push(createTree('#text', newValue));
            }
          }

          childNode.attributes[newKey] = newValue === undefined ? true : newValue;
        }
      }

      if (childNode.attributes.key) {
        childNode.key = childNode.attributes.key;
      }

      if (childNode.nodeName === 'script' && childNode.attributes.src) {
        childNode.key = childNode.attributes.src;
      }
    });
  }

  // Node value
  if (match = tokenEx.exec(childNode.nodeValue)) {
    const parts = childNode.nodeValue.split(tokenEx);
    const fragment = createTree();

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 !== 0) {
        fragment.childNodes.push(
          createTree(supplemental.children[parts[i]])
        );
      }
      else if (parts[i]) {
        fragment.childNodes.push(createTree('#text', parts[i]));
      }
    }

    return fragment;
  }

  // Children
  for (let i = 0; i < childNode.childNodes.length; i++) {
    // Flatten fragments.
    const vTree = interpolateAndFlatten(childNode.childNodes[i], supplemental);

    if (vTree.nodeName === '#document-fragment' && vTree.rawNodeName === vTree.nodeName) {
      childNode.childNodes.splice(i, 1, ...vTree.childNodes);
      i -= 1;
    }
    else {
      childNode.childNodes[i] = vTree;
    }
  }

  return childNode;
};

/**
 * Processes a tagged template, or process a string and interpolate
 * associated values. These values can be of any type and can be
 * put in various parts of the markup, such as tag names, attributes,
 * and node values.
 *
 * @param {string | string[] | TemplateStringsArray} strings
 * @param  {...any} values - test
 * @return {VTree} VTree object or null if no input strings
 */
export default function handleTaggedTemplate(strings, ...values) {
  const empty = createTree('#text', EMPTY.STR);

  // Do not attempt to parse empty strings.
  if (!strings) {
    return empty;
  }

  // If this function is used outside of a tagged template, ensure that flat
  // strings are coerced to arrays, simulating a tagged template call.
  else if (typeof strings === 'string') {
    strings = [strings];
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    if (!strings[0]) {
      return empty;
    }

    let { childNodes } = Internals.parse(strings[0]);

    const startNode = childNodes[0];
    const endNode = childNodes[childNodes.length - 1];
    const isStartText = startNode.nodeType === NODE_TYPE.TEXT;
    const isEndText = endNode.nodeType === NODE_TYPE.TEXT;

    // Trim surrounding text if only one single element was returned.
    if (isStartText || isEndText) {
      /** @type {VTree[]} */
      const trimmedNodes = [].concat(...childNodes);

      for (let i = 0; i < trimmedNodes.length; i++) {
        const node = trimmedNodes[i];

        if (
          (node === startNode || node === endNode) &&
          node.nodeType === NODE_TYPE.TEXT &&
          !node.nodeValue.trim()
        ) {
          trimmedNodes.splice(i, 1);
        }
      }

      if (trimmedNodes.length === 1) {
        childNodes = trimmedNodes;
      }
    }

    return createTree(childNodes.length === 1 ? childNodes[0] : childNodes);
  }

  // Used to store markup and tokens.
  let HTML = EMPTY.STR;

  // We filter the supplemental values by where they are used. Values are
  // either attributes, children, or tags (for components).
  /** @type {Supplemental} */
  const supplemental = ({
    attributes: {},
    children: {},
    tags: {},
   });

  // Loop over the static strings, each break correlates to an interpolated
  // value. As these values can be dynamic, we cannot pass them to the HTML
  // parser inline (it only accepts strings). These dynamic values are indexed
  // in an object called supplemental and keyed by a incremental string token.
  // The following loop instruments the markup with these tokens that the
  // parser then uses to assemble the correct tree.
  strings.forEach((string, i) => {
    // Always add the string, we need it to parse the markup later.
    HTML += string;

    // If there are values, figure out where in the markup they were injected.
    if (values.length) {
      const value = nextValue(values);
      const lastCharacter = HTML.trim().slice(-1);
      const lastTwoCharacters = HTML.trim().slice(-2);
      const isAttribute = HTML.lastIndexOf('>') < HTML.lastIndexOf('<');
      const isTag = Boolean(lastCharacter === '<' || lastTwoCharacters === '</');
      const isObject = typeof value === 'object';
      const token = `${TOKEN}${i}__`;

      // Injected as a tag.
      if (isTag) {
        supplemental.tags[i] = value;
        HTML += token;
      }
      // Injected as attribute.
      else if (isAttribute) {
        supplemental.attributes[i] = value;
        HTML += token;
      }
      // Injected as a child node.
      else if (isArray(value) || isObject) {
        supplemental.children[i] = createTree(value);
        HTML += token;
      }
      // Injected as something else in the markup or undefined, ignore
      // obviously falsy values used with boolean operators.
      else if (value) {
        HTML += value;
      }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  const { childNodes } = Internals.parse(HTML);

  // Pass through flatten and interpolate dynamic data.
  const vTree = interpolateAndFlatten(createTree(childNodes), supplemental);

  // Loop through all nodes and apply the dynamic attributes and flatten
  // fragments.
  if (vTree.nodeType === NODE_TYPE.FRAGMENT && vTree.childNodes.length === 1) {
    return vTree.childNodes[0];
  }

  return vTree;
}
