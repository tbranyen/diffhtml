import { parse } from './util/parser';

// Make a parser.
const isPropEx = /(=|'|")/;

/**
 * Tiny HTML escaping function.
 *
 * @param str unescaped
 * @return {String} escaped
 */
function encode(str) {
  return str.replace(/["&'<>`]/g, match => `&#${match.charCodeAt(0)};`);
}

/**
 * Parses a tagged template literal into a diffHTML Virtual DOM representation.
 *
 * @param strings
 * @param ...values
 *
 * @return
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
    let childNodes = parse(strings[0]).childNodes;
    return childNodes.length > 1 ? childNodes : childNodes[0];
  }

  var retVal = [];
  var supplemental = {
    props: [],
    children: [],
  };

  // Loop over the strings and interpolate the values.
  strings.forEach(string => {
    retVal.push(string);

    if (values.length) {
      let value = values.shift();
      let lastSegment = string.split(' ').pop();
      let lastCharacter = lastSegment.trim().slice(-1);
      let isProp = Boolean(lastCharacter.match(isPropEx));

      if (typeof value === 'string') {
        value = encode(value);
      }

      if (isProp) {
        supplemental.props.push(value);
        retVal.push('__DIFFHTML__');
      }
      else if (Array.isArray(value) || typeof value === 'object') {
        supplemental.children.push(value);
        retVal.push('__DIFFHTML__');
      }
      else {
        retVal.push(String(value));
      }
    }
  });

  const childNodes = parse(retVal.join(''), supplemental).childNodes;
  return childNodes.length > 1 ? childNodes : childNodes[0];
}
