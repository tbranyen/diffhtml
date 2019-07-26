// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser

import createTree from '../tree/create';
import Pool from './pool';
import process from './process';

const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/i;
const spaceEx = /[^ ]/;
const tokenEx = /__DIFFHTML__([^_]*)__/;

const { assign } = Object;
const { isArray } = Array;

const blockText = new Set([
  'script',
  'noscript',
  'style',
  'code',
  'template',
]);

const selfClosing = new Set([
  'meta',
  'img',
  'link',
  'input',
  'area',
  'br',
  'hr',
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true },
};

const kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true },
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
const interpolateValues = (currentParent, string, supplemental = {}) => {
  // If this is text and not a doctype, add as a text node.
  if (string && !doctypeEx.test(string) && !tokenEx.test(string)) {
    return currentParent.childNodes.push(createTree('#text', string));
  }

  const childNodes = [];
  const parts = string.split(tokenEx);
  let { length } = parts;

  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];

    if (!value) { continue; }

    // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.
    if (i % 2 === 1) {
      const innerTree = supplemental.children[value];
      if (!innerTree) { continue; }
      const isFragment = innerTree.nodeType === 11;

      if (typeof innerTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...innerTree.childNodes);
      }
      else {
        childNodes.push(innerTree);
      }
    }
    else if (!doctypeEx.test(value)) {
      childNodes.push(createTree('#text', value));
    }
  }

  currentParent.childNodes.push(...childNodes);
};

/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {String} nodeName - DOM Node name
 * @param {Object} rawAttrs - DOM Node Attributes
 * @param {Object} supplemental - Interpolated data from a tagged template
 * @return {Object} vTree
 */
const HTMLElement = (nodeName, rawAttrs, supplemental, options) => {
  let match = null;
  const attrEx = /\b([_a-z][_a-z0-9\-:]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  // Support dynamic tag names like: `<${MyComponent} />`.
  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(
      supplemental.tags[match[1]],
      rawAttrs,
      supplemental,
      options
    );
  }

  const attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  for (let match; match = attrEx.exec(rawAttrs || ''); ) {
    const name = match[1];
    const value = match[6] || match[5] || match[4] || match[1];
    let tokenMatch = value.match(tokenEx);

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (tokenMatch && tokenMatch.length) {
      const parts = value.split(tokenEx);
      let { length } = parts;

      const hasToken = tokenEx.exec(name);
      const newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

      for (let i = 0; i < parts.length; i++) {
        const value = parts[i];

        if (!value) { continue; }

        // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.
        if (i % 2 === 1) {
          if (attributes[newName]) {
            attributes[newName] += supplemental.attributes[value];
          }
          else {
            const isObject = typeof newName === 'object';

            if (isObject && !isArray(newName) && newName) {
              assign(attributes, newName);
            }
            else if (isObject && options.strict) {
              if (process.env.NODE_ENV !== 'production') {
                throw new Error(
                  'Arrays are not allowed to be spread in strict mode'
                );
              }
            }
            else if (newName && typeof newName !== 'object') {
              attributes[newName] = supplemental.attributes[value];
            }
          }
        }
        // Otherwise this is a static iteration, simply concat in the raw value.
        else {
          if (attributes[newName]) {
            attributes[newName] += value;
          }
          else {
            attributes[newName] = value;
          }
        }
      }
    }
    else if (tokenMatch = tokenEx.exec(name)) {
      const nameAndValue = supplemental.attributes[tokenMatch[1]];
      const hasToken = tokenEx.exec(value);
      const getValue = hasToken ? supplemental.attributes[hasToken[1]] : value;

      attributes[nameAndValue] = value === '""' ? '' : getValue;
    }
    else {
      attributes[name] = value === '""' ? '' : value;
    }
  }

  return createTree(nodeName, attributes, []);
};

/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Object} supplemental - Dynamic interpolated data values
 * @param {Object} options - Contains options like silencing warnings
 * @return {Object} - Parsed Virtual Tree Element
 */
export default function parse(html, supplemental, options = {}) {
  const tagEx =
    /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;
  const attrEx = /\b([_a-z][_a-z0-9\-:]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
  const root = createTree('#document-fragment', null, []);
  const stack = [root];
  let currentParent = root;
  let lastTextPos = -1;

  if (process.env.NODE_ENV !== 'production') {
    const markup = [html];

    if (!html.includes('<') && options.strict) {
      markup.splice(1, 0, `
Possibly invalid markup. Opening tag was not properly opened.
      `);

      throw new Error(`\n\n${markup.join('\n')}`);
    }

    if (!html.includes('>') && options.strict) {
      markup.splice(1, 0, `
Possibly invalid markup. Opening tag was not properly closed.
      `);

      throw new Error(`\n\n${markup.join('\n')}`);
    }
  }

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (!html.includes('<') && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  // Look through the HTML markup for valid tags.
  for (let match, text, i=0; match = tagEx.exec(html); i++) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        if (text) {
          interpolateValues(currentParent, text, supplemental);
        }
      }
    }

    const matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      const string = html.slice(0, matchOffset);

      if (string && hasNonWhitespaceEx.test(string) && !doctypeEx.exec(string)) {
        interpolateValues(currentParent, string, supplemental);
      }
    }

    lastTextPos = tagEx.lastIndex;

    // This is a comment (TODO support these).
    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      const attrs = {};

      if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
        if (kElementsClosedByOpening[currentParent.rawNodeName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[
        currentParent.childNodes.push(
          HTMLElement(match[2], match[3], supplemental, options)
        ) - 1
      ];

      stack.push(currentParent);

      if (options.strict || blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = html.indexOf(closeMarkup, tagEx.lastIndex);
        const { length } = match[2];

        if (process.env.NODE_ENV !== 'production') {
          if (index === -1 && options.strict) {
            const nodeName = currentParent.rawNodeName;

            // Find a subset of the markup passed in to validate.
            const markup = html
              .slice(tagEx.lastIndex - match[0].length)
              .split('\n')
              .slice(0, 3);

            // Position the caret next to the first non-whitespace character.
            const caret = Array(spaceEx.exec(markup[0]).index + closeMarkup.length - 1).join(' ') + '^';

            const name = supplemental ? supplemental.tags[0].name : match[2];

            // Craft the warning message and inject it into the markup.
            markup.splice(1, 0, `${caret}
    Possibly invalid markup. <${name}> must be closed in strict mode.
            `);

            // Throw an error message if the markup isn't what we expected.
            throw new Error(`\n\n${markup.join('\n')}`);
          }
        }

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        }
        else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        const newText = html.slice(match.index + match[0].length, index);
        interpolateValues(currentParent, newText, supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (process.env.NODE_ENV !== 'production') {
        if (currentParent && match[2] !== currentParent.rawNodeName && options.strict) {
          const nodeName = currentParent.rawNodeName;

          // Find a subset of the markup passed in to validate.
          const markup = html.slice(
            tagEx.lastIndex - match[0].length
          ).split('\n').slice(0, 3);

          // Position the caret next to the first non-whitespace character.
          const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

          // Craft the warning message and inject it into the markup.
          markup.splice(1, 0, `${caret}
  Possibly invalid markup. Saw ${match[2]}, expected ${nodeName}...
          `);

          // Throw an error message if the markup isn't what we expected.
          throw new Error(`\n\n${markup.join('\n')}`);
        }
      }

      const tokenMatch = tokenEx.exec(match[2]);

      // </ or /> or <br> etc.
      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[4] === '/' && tokenMatch) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        // Not self-closing, so seek out the next match.
        else if (tokenMatch) {
          const value = supplemental.tags[tokenMatch[1]];

          if (currentParent.rawNodeName === value) {
            stack.pop();
            currentParent = stack[stack.length - 1];

            break;
          }
        }

        if (currentParent.rawNodeName === match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        else {
          const tag = kElementsClosedByClosing[currentParent.rawNodeName];

          // Trying to close current tag, and move on
          if (tag) {
            if (tag[match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              continue;
            }
          }

          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }

  // Find any last remaining text after the parsing completes over tags.
  const remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  if (process.env.NODE_ENV !== 'production') {
    if ((remainingText.includes('>') || remainingText.includes('<')) && options.strict) {
      const nodeName = currentParent.rawNodeName;

      // Find a subset of the markup passed in to validate.
      const markup = [remainingText];

      // Position the caret next to the first non-whitespace character.
      const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

      // Craft the warning message and inject it into the markup.
      if (remainingText.includes('>')) {
        markup.splice(1, 0, `${caret}
  Possibly invalid markup. Opening tag was not properly opened.
        `);
      }
      else {
        markup.splice(1, 0, `${caret}
  Possibly invalid markup. Opening tag was not properly closed.
        `);
      }

      // Throw an error message if the markup isn't what we expected.
      throw new Error(`\n\n${markup.join('\n')}`);
    }
  }

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  if (remainingText) {
    interpolateValues(currentParent, remainingText, supplemental);
  }

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    const head = { before: [], after: [] };
    const body = { after: [] };
    const HTML = root.childNodes[0];

    let beforeHead = true;
    let beforeBody = true;

    // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.
    HTML.childNodes = HTML.childNodes.filter(el => {
      // If either body or head, allow as a valid element.
      if (el.nodeName === 'body' || el.nodeName === 'head') {
        if (el.nodeName === 'head') beforeHead = false;
        if (el.nodeName === 'body') beforeBody = false;

        return true;
      }
      // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
        if (beforeHead && beforeBody) head.before.push(el);
        else if (!beforeHead && beforeBody) head.after.push(el);
        else if (!beforeBody) body.after.push(el);
      }
    });

    // Ensure the first element is the HEAD tag.
    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = createTree('head', null, []);
      const existing = headInstance.childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    }
    else {
      const existing = HTML.childNodes[0].childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      const bodyInstance = createTree('body', null, []);
      const existing = bodyInstance.childNodes;

      existing.push.apply(existing, body.after);
      HTML.childNodes.push(bodyInstance);
    }
    else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}
