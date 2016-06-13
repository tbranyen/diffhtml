import { parse } from './parser';
import escape from './escape';

const isPropEx = /(=|'|")/;
const TOKEN = '__DIFFHTML__';

/**
 * Get the next value from the list. If the next value is a string, make sure
 * it is escaped.
 *
 * @param {Array} values - Values extracted from tagged template literal
 * @return {String|*} - Escaped string, otherwise any value passed
 */
const nextValue = (values) => {
  const value = values.shift();
  return typeof value === 'string' ? escape(value) : value;
};

/**
 * Parses tagged template contents into a Virtual Tree. These tagged templates
 * separate static strings from values, so we need to do some special token
 * work
 *
 * @param {Array} strings - A list of static strings, split by value
 * @param {Array} ...values - A list of interpolated values
 * @return {Object|Array} - A Virtual Tree Element or array of elements
 */
export function html(strings, ...values) {
  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings[0].length && !values.length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    const childNodes = parse(strings[0]).childNodes;
    return childNodes.length > 1 ? childNodes : childNodes[0];
  }

  // Used to store markup and tokens.
  const retVal = [];

  // We filter the supplemental values by where they are used. Values are
  // either props or children.
  const supplemental = {
    props: [],
    children: [],
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach(string => {
    // Always add the string, we need it to parse the markup later.
    retVal.push(string);

    if (values.length) {
      const value = nextValue(values);
      const lastSegment = string.split(' ').pop();
      const lastCharacter = lastSegment.trim().slice(-1);
      const isProp = Boolean(lastCharacter.match(isPropEx));

      if (isProp) {
        supplemental.props.push(value);
        retVal.push(TOKEN);
      }
      else if (Array.isArray(value) || typeof value === 'object') {
        supplemental.children.push(value);
        retVal.push(TOKEN);
      }
      else {
        retVal.push(value);
      }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  const childNodes = parse(retVal.join(''), supplemental).childNodes;

  // This makes it easier to work with a single element as a root, instead of
  // always return an array.
  return childNodes.length > 1 ? childNodes : childNodes[0];
}
