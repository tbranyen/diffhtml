// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

import { createTree } from '../tree';
import Pool from './pool';
import escape from './escape';

// This is a very special word in the diffHTML parser. It is the only way it
// can gain access to dynamic content.
const TOKEN = '__DIFFHTML__';

const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/ig;
const attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
const spaceEx = /[^ ]/;

const { assign } = Object;

// We use this Set in the node/patch module so marking it exported.
export const blockText = new Set([
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
const interpolateValues = (currentParent, string, supplemental) => {
  if (string && string.indexOf(TOKEN) > -1) {
    const childNodes = [];

    // Break up the incoming string into dynamic parts that are then pushed
    // into a new set of child nodes.
    string.split(TOKEN).forEach((value, index, array) => {
      // If the first text node has relevant text, put it in, otherwise
      // discard. This mimicks how the browser works and is generally easier
      // to work with (when using tagged template tags).
      if (value && hasNonWhitespaceEx.test(value)) {
        childNodes.push(createTree('#text', value));
      }

      // If we are in the second iteration, this means the whitespace has been
      // trimmed and we can pull out dynamic interpolated values. We do not
      // want to grab a childNode by accident for the last one.
      if (index !== array.length - 1) {
        childNodes.push(supplemental.children.shift());
      }
    });

    currentParent.childNodes.push.apply(currentParent.childNodes, childNodes);
  }
  else if (string && string.length && !doctypeEx.exec(string)) {
    currentParent.childNodes.push(createTree('#text', string));
  }
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
const HTMLElement = (nodeName, rawAttrs, supplemental) => {
  // Support dynamic tag names like: `<${MyComponent} />`.
  if (nodeName === TOKEN) {
    return HTMLElement(supplemental.tags.shift(), rawAttrs, supplemental);
  }

  const attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  for (let match; match = attrEx.exec(rawAttrs || ''); ) {
    const name = match[1];
    const value = match[6] || match[5] || match[4] || match[1];

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (value.indexOf(TOKEN) > -1 && value !== TOKEN) {
      attributes[name] = '';

      // Break the attribute down and replace each dynamic interpolation.
      value.split(TOKEN).forEach((part, index, array) => {
        attributes[name] += part;

        // Only interpolate up to the last element.
        if (index !== array.length - 1) {
          attributes[name] += supplemental.attributes.shift();
        }
      });
    }
    else if (value === TOKEN) {
      attributes[name] = supplemental.attributes.shift();
    }
    else {
      attributes[name] = value;
    }

    // Look for empty attributes.
    if (match[6] === '""') {
      attributes[name] = '';
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
export function parse(html, supplemental, options = {}) {
  const root = createTree('#document-fragment', null, []);
  const stack = [root];
  let currentParent = root;
  let lastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  const tagEx =
    /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

  // Look through the HTML markup for valid tags.
  for (let match, text; match = tagEx.exec(html); ) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        // if has content
        text = html.slice(
          lastTextPos, tagEx.lastIndex - match[0].length
        );

        interpolateValues(currentParent, text, supplemental);
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

    // This is a comment.
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
          HTMLElement(match[2], match[3], supplemental)
        ) - 1
      ];

      stack.push(currentParent);

      if (blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = html.indexOf(closeMarkup, tagEx.lastIndex);
        const { length } = match[2];

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        }
        else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        const newText = html.slice(match.index + match[0].length, index);
        interpolateValues(currentParent, newText.trim(), supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (match[2] !== currentParent.rawNodeName && options.strict) {
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

      // </ or /> or <br> etc.
      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[2] === TOKEN && match[4] === '/') {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        // Not self-closing, so seek out the next match.
        else if (match[2] === TOKEN) {
          const value = supplemental.tags.shift();

          if (currentParent.nodeName === value) {
            stack.pop();
            currentParent = stack[stack.length - 1];

            break;
          }
        }

        if (currentParent.rawNodeName == match[2]) {
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

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  interpolateValues(currentParent, remainingText, supplemental);

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
