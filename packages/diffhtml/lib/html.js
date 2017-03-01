import { createTree } from './tree';
import { parse, escape, decodeEntities } from './util';

const isAttributeEx = /(=|"|')[^><]*?$/;
const isTagEx = /(<|\/)/;
const TOKEN = '__DIFFHTML__';
let i = 0;

/**
 * Get the next value from the list. If the next value is a string, make sure
 * it is escaped.
 *
 * @param {Array} values - Values extracted from tagged template literal
 * @return {String|*} - Escaped string, otherwise any value passed
 */
const nextValue = values => {
  const value = values.shift();
  return typeof value === 'string' ? escape(decodeEntities(value)) : value;
};

function handleTaggedTemplate(options, strings, ...values) {
  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    const childNodes = parse(strings[0]).childNodes;
    return childNodes.length > 1 ? createTree(childNodes) : childNodes[0];
  }

  // Used to store markup and tokens.
  let retVal = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  const supplemental = {
    attributes: {},
    children: {},
    tags: {},
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach((string, i) => {
    // Always add the string, we need it to parse the markup later.
    retVal += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      const value = nextValue(values);
      const lastSegment = string.split(' ').pop();
      const lastCharacter = lastSegment.trim().slice(-1);
      const isAttribute = Boolean(retVal.match(isAttributeEx));
      const isTag = Boolean(lastCharacter.match(isTagEx));
      const isString = typeof value === 'string';
      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);
      const token = TOKEN + i + '__';

      // Injected as attribute.
      if (isAttribute) {
        supplemental.attributes[i] = value;
        retVal += token;
      }
      // Injected as a tag.
      else if (isTag && !isString) {
        supplemental.tags[i] = value;
        retVal += token;
      }
      // Injected as a child node.
      else if (isArray || isObject) {
        supplemental.children[i] = createTree(value);
        retVal += token;
      }
      // Injected as something else in the markup or undefined, ignore
      // obviously falsy values used with boolean operators.
      else if (value !== null && value !== undefined && value !== false) {
        retVal += value;
      }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  const childNodes = parse(retVal, supplemental, options).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : createTree(childNodes);
}

export default (...args) => handleTaggedTemplate({}, ...args);
