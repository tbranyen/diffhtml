import createTree from './tree/create';
import parse from './util/parse';
import escape from './util/escape';
import decodeEntities from './util/decode-entities';

const { isArray } = Array;
const isTagEx = /(<|\/)/;
const TOKEN = '__DIFFHTML__';

// Get the next value from the list. If the next value is a string, make sure
// it is escaped.
const nextValue = values => {
  const value = values.shift();
  return typeof value === 'string' ? escape(decodeEntities(value)) : value;
};

export default function handleTaggedTemplate(strings, ...values) {
  // If this function is used outside of a tagged template, ensure that flat
  // strings are coerced to arrays, simulating a tagged template call.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    const strict = handleTaggedTemplate.isStrict;
    handleTaggedTemplate.isStrict = undefined;
    const { childNodes } = parse(strings[0], null, { strict });
    return childNodes.length > 1 ? createTree(childNodes) : childNodes[0];
  }

  // Used to store markup and tokens.
  let HTML = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  const supplemental = { attributes: {}, children: {}, tags: {} };

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
      const lastSegment = string.split(' ').pop();
      const lastCharacter = HTML.trim().slice(-1);
      const isAttribute = HTML.lastIndexOf('>') < HTML.lastIndexOf('<');
      const isTag = Boolean(lastCharacter.match(isTagEx));
      const isString = typeof value === 'string';
      const isObject = typeof value === 'object';
      const _isArray = isArray(value);
      const token = `${TOKEN}${i}__`;

      // Injected as a tag.
      if (isTag && !isString) {
        supplemental.tags[i] = value;
        HTML += token;
      }
      // Injected as attribute.
      else if (isAttribute) {
        supplemental.attributes[i] = value;
        HTML += token;
      }
      // Injected as a child node.
      else if (_isArray || isObject) {
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
  const strict = handleTaggedTemplate.isStrict;
  handleTaggedTemplate.isStrict = undefined;

  // Parse the instrumented markup to get the Virtual Tree.
  const { childNodes } = parse(HTML, supplemental, { strict });

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : createTree(childNodes);
}

// Use a strict mode similar to XHTML/JSX where tags must be properly closed
// and malformed markup is treated as an error. The default is to silently fail
// just like HTML.
handleTaggedTemplate.strict = (...args) => {
  handleTaggedTemplate.isStrict = true;
  return handleTaggedTemplate(...args);
};
