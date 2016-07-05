// This code is adapted from:
// https://github.com/ashi009/node-fast-html-parser

import * as pools from './pools';
import makeTree from '../tree/make';
import { createElement, createAttribute } from '../tree/helpers';
import escape from './escape';

const TOKEN = '__DIFFHTML__';

const doctypeEx = /<!.*>/ig;
const attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
const tagEx =
  /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;
const spaceEx = /[^ ]/;

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
const interpolateDynamicBits = (currentParent, string, supplemental) => {
  if (string && string.indexOf(TOKEN) > -1) {
    const toAdd = [];

    // Break up the incoming string into dynamic parts that are then pushed
    // into a new set of child nodes.
    string.split(TOKEN).forEach((value, index) => {
      if (index === 0) {
        // We trim here to allow for newlines before and after markup starts.
        if (value && value.trim()) {
          toAdd.push(TextNode(value));
        }

        // The first item does not mean there was dynamic content.
        return;
      }

      // If we are in the second iteration, this
      const dynamicBit = supplemental.children.shift();

      if (typeof dynamicBit === 'string') {
        toAdd.push(TextNode(dynamicBit));
      }
      else if (Array.isArray(dynamicBit)) {
        toAdd.push.apply(toAdd, dynamicBit);
      }
      else if (dynamicBit.ownerDocument) {
        toAdd.push(makeTree(dynamicBit));
      }
      else {
        toAdd.push(dynamicBit);
      }

      // This is a useful Text Node.
      if (value && value.trim()) {
        toAdd.push(TextNode(value));
      }
    });

    currentParent.childNodes.push.apply(currentParent.childNodes, toAdd);
  }
  else if (string && string.length && !doctypeEx.exec(string)) {
    currentParent.childNodes.push(TextNode(string));
  }
};

/**
 * TextNode to contain a text element in DOM tree.
 *
 * @param {String} nodeValue - A value to set in the text,, set unescaped
 * @return {Object} - A Virtual Tree element representing the Text Node
 */
const TextNode = (value) => {
  const vTree = createElement('#text', [], []);
  vTree.nodeValue = value;
  return vTree;
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
  const vTree = createElement(nodeName, [], []);

  for (let match; match = attrEx.exec(rawAttrs || ''); ) {
    const name = match[1];
    const value = match[6] || match[5] || match[4] || match[1];
    const attr = createAttribute(name, value);

    if (attr.value === TOKEN) {
      attr.value = supplemental.props.shift();
    }

    // If a key attribute is found attach directly to the vTree.
    if (attr.name === 'key') {
      vTree.key = attr.value;
    }

    // Look for empty attributes.
    if (match[6] === '""') { attr.value = ''; }

    vTree.attributes.push(attr);
  }

  return vTree;
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
  const root = HTMLElement('#document-fragment');
  const stack = [root];

  var currentParent = root;
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateDynamicBits(currentParent, html, supplemental);
    return root;
  }

  // Look through the HTML markup for valid tags.
  for (let match, text; match = tagEx.exec(html); ) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        // if has content
        text = html.slice(
          lastTextPos, tagEx.lastIndex - match[0].length
        );

        interpolateDynamicBits(currentParent, text, supplemental);
      }
    }

    const matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      const string = html.slice(0, matchOffset);

      if (string && string.trim() && !doctypeEx.exec(string)) {
        interpolateDynamicBits(currentParent, string, supplemental);
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
        const length = match[2].length;

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        }
        else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        let newText = html.slice(match.index + match[0].length, index);
        interpolateDynamicBits(currentParent, newText.trim(), supplemental);
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
        throw new Error(`${markup.join('\n')}`);
      }

      // </ or /> or <br> etc.
      while (currentParent) {
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

  // If the text exists and isn't just whitespace, push into a new TextNode.
  interpolateDynamicBits(currentParent, remainingText, supplemental);

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
    HTML.childNodes = HTML.childNodes.filter(function(el) {
      // If either body or head, allow as a valid element.
      if (el.nodeName === 'body' || el.nodeName === 'head') {
        if (el.nodeName === 'head') {
          beforeHead = false;
        }

        if (el.nodeName === 'body') {
          beforeBody = false;
        }

        return true;
      }
      // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
        if (beforeHead && beforeBody) {
          head.before.push(el);
        }
        else if (!beforeHead && beforeBody) {
          head.after.push(el);
        }
        else if (!beforeBody) {
          body.after.push(el);
        }
      }
    });

    // Ensure the first element is the HEAD tag.
    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = pools.elementObject.get();
      const existing = [...headInstance.childNodes];

      headInstance.nodeName = 'head';
      headInstance.childNodes.length = 0;
      headInstance.attributes.length = 0;

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
      const bodyInstance = pools.elementObject.get();

      bodyInstance.nodeName = 'body';
      bodyInstance.childNodes.length = 0;
      bodyInstance.attributes.length = 0;
      bodyInstance.childNodes.push.apply(existing, body.after);

      HTML.childNodes.push(bodyInstance);
    }
    else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}
