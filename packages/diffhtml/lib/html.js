import createTree from './tree/create';
import Internals from './util/internals';
import escape from './util/escape';
import decodeEntities from './util/decode-entities';
import { $$strict } from './util/symbols';
import { EMPTY, VTree, Supplemental } from './util/types';
import getConfig from './util/config';

// Magic token used for interpolation.
const TOKEN = '__DIFFHTML__';

const { getOwnPropertyNames } = Object;
const { isArray } = Array;
const isTagEx = /(<|\/)/;
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

  // Node name
  if (match = tokenEx.exec(childNode.rawNodeName)) {
    childNode.rawNodeName = supplemental.tags[match[1]];
    childNode.nodeName = '#document-fragment';
    childNode.nodeType = 11;
  }

  // Attributes
  for (const keyName of getOwnPropertyNames(childNode.attributes)) {
    const value = childNode.attributes[keyName];
    let newKey = keyName;
    let newValue = value;

    // Check for dynamic key
    if (match = tokenEx.exec(keyName)) {
      newKey = supplemental.attributes[match[1]];
      delete childNode.attributes[keyName];
    }

    // Check for dynamic value
    if (match = tokenEx.exec(value)) {
      newValue = supplemental.attributes[match[1]];
    }

    childNode.attributes[newKey] = newValue;
  }

  // Node value
  if (match = tokenEx.exec(childNode.nodeValue)) {
    return supplemental.children[match[1]];
  }

  // Children
  for (let i = 0; i < childNode.childNodes.length; i++) {
    // Flatten fragments.
    const vTree = interpolateAndFlatten(childNode.childNodes[i], supplemental);

    if (vTree.nodeName === '#document-fragment' && vTree.rawNodeName === vTree.nodeName) {
      childNode.childNodes.splice(i, 1, ...vTree.childNodes);
      i += vTree.childNodes.length;
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

    const strict = /** @type {boolean} */(
      getConfig(
        'strict',
        false,
        'boolean',
        {
          strict: /** @type {any} */(handleTaggedTemplate)[$$strict]
        },
      )
    );

    delete /** @type {any} */(handleTaggedTemplate)[$$strict];

    const { childNodes } = Internals.parse(strings[0], undefined, {
      parser: { strict },
    });

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
      const isAttribute = HTML.lastIndexOf('>') < HTML.lastIndexOf('<');
      const isTag = Boolean(lastCharacter.match(isTagEx));
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

  // Determine if we are in strict mode and immediately reset for the next
  // call.
  const strict = /** @type {boolean} */(getConfig('strict', false, 'boolean', {
    strict: /** @type {any} */ (handleTaggedTemplate)[$$strict],
  }));

  // Parse the instrumented markup to get the Virtual Tree.
  const { childNodes } = Internals.parse(HTML, supplemental, {
    parser: { strict },
  });

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  const retVal = createTree(childNodes.length === 1 ? childNodes[0] : childNodes);

  // Loop through all nodes and apply the dynamic attributes and flatten
  // fragments.
  return interpolateAndFlatten(retVal, supplemental);
}

// Default to loose-mode.
delete /** @type {any} */(handleTaggedTemplate)[$$strict];

/**
 * Use a strict mode similar to XHTML/JSX where tags must be properly closed
 * and malformed markup is treated as an error. The default is to silently fail
 * just like HTML.
 *
 * @param {string | string[] | TemplateStringsArray} markup
 * @param  {any[]} args
 */
function setStrictMode(markup, ...args) {
  /** @type {any} */(handleTaggedTemplate)[$$strict] = true;
  try {
    return handleTaggedTemplate(markup, ...args);
  }
  catch (e) {
    /** @type {any} */(handleTaggedTemplate)[$$strict] = false;
    throw e;
  }
}

handleTaggedTemplate.strict = setStrictMode;
