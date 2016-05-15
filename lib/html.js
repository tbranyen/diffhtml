import { makeParser } from './util/parser';

// Make a parser.
const parser = makeParser();
const isPropEx = /(=|'|")/;

/**
 * Parses a tagged template literal into a diffHTML Virtual DOM representation.
 *
 * @param strings
 * @param ...values
 *
 * @return
 */
export function html(strings, ...values) {
  // Do not attempt to parse empty strings.
  if (!strings[0].length && !values.length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    let childNodes = parser.parse(strings[0]).childNodes;
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

      if (isProp && typeof value !== 'string') {
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

  const childNodes = parser.parse(retVal.join(''), supplemental).childNodes;
  return childNodes.length > 1 ? childNodes : childNodes[0];
}
