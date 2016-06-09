// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

import { pools } from './pools';
import makeNode from '../node/make';
import escape from './escape';

const slice = Array.prototype.slice;

const kMarkupPattern =
  /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;

const kAttributePattern =
  /\b(id|class)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

const reAttrPattern =
  /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

const kSelfClosingElements = {
  meta: true,
  img: true,
  link: true,
  input: true,
  area: true,
  br: true,
  hr: true,
};

const TOKEN = '__DIFFHTML__';

var kElementsClosedByOpening = {
  li: {
    li: true
  },

  p: {
    p: true, div: true
  },

  td: {
    td: true, th: true
  },

  th: {
    td: true, th: true
  }
};

var kElementsClosedByClosing = {
  li: {
    ul: true, ol: true
  },

  a: {
    div: true
  },

  b: {
    div: true
  },

  i: {
    div: true
  },

  p: {
    div: true
  },

  td: {
    tr: true, table: true
  },

  th: {
    tr: true, table: true
  }
};

var kBlockTextElements = {
  script: true,
  noscript: true,
  style: true,
  template: true
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
function interpolateDynamicBits(currentParent, string, supplemental) {
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
        toAdd.push(makeNode(dynamicBit));
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
  else if (string && string.length) {
    currentParent.childNodes.push(TextNode(string));
  }
}

/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
function TextNode(value) {
  var instance = pools.elementObject.get();

  instance.nodeName = '#text';
  instance.nodeValue = value;
  instance.nodeType = 3;
  instance.key = '';
  instance.childNodes.length = 0;
  instance.attributes.length = 0;

  return instance;
}

/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {string} name     nodeName
 * @param {Object} keyAttrs id and class attribute
 * @param {Object} rawAttrs attributes in string
 * @param {Object} supplemental data
 */
function HTMLElement(name, keyAttrs, rawAttrs, supplemental) {
  var instance = pools.elementObject.get();

  instance.nodeName = name;
  instance.nodeValue = '';
  instance.nodeType = 1;
  instance.key = '';
  instance.childNodes.length = 0;
  instance.attributes.length = 0;

  if (rawAttrs) {
    for (let match; match = reAttrPattern.exec(rawAttrs); ) {
      let attr = pools.attributeObject.get();

      attr.name = match[1];
      attr.value = match[6] || match[5] || match[4] || match[1];

      if (attr.value === TOKEN) {
        attr.value = supplemental.props.shift();
      }

      // If a key attribute is found attach directly to the instance.
      if (attr.name === 'key') {
        instance.key = attr.value;
      }

      // Look for empty attributes.
      if (match[6] === '""') { attr.value = ''; }

      instance.attributes.push(attr);
    }
  }

  return instance;
}

/**
 * Parses HTML and returns a root element
 *
 * @param  {string} data      html
 * @param  {array} supplemental      data
 * @return {HTMLElement}      root element
 */
export function parse(data, supplemental) {
  var rootObject = {};
  var root = HTMLElement(null, rootObject);
  var currentParent = root;
  var stack = [root];
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in data as a single
  // text node.
  if (data.indexOf('<') === -1 && data) {
    interpolateDynamicBits(currentParent, data, supplemental);
    return root;
  }

  for (let match, text; match = kMarkupPattern.exec(data); ) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        // if has content
        text = data.slice(
          lastTextPos, kMarkupPattern.lastIndex - match[0].length
        );

        interpolateDynamicBits(currentParent, text, supplemental);
      }
    }

    let matchOffset = kMarkupPattern.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      let string = data.slice(0, matchOffset);

      if (string && string.trim()) {
        root.childNodes.push(TextNode(string));
      }
    }

    lastTextPos = kMarkupPattern.lastIndex;

    // This is a comment.
    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      let attrs = {};

      for (let attMatch; attMatch = kAttributePattern.exec(match[3]); ) {
        attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
      }

      if (!match[4] && kElementsClosedByOpening[currentParent.nodeName]) {
        if (kElementsClosedByOpening[currentParent.nodeName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[
        currentParent.childNodes.push(
          HTMLElement(match[2], attrs, match[3], supplemental)
        ) - 1
      ];

      stack.push(currentParent);

      if (kBlockTextElements[match[2]]) {
        // A little test to find next </script> or </style> ...
        let closeMarkup = '</' + match[2] + '>';
        let index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        let length = match[2].length;

        if (index === -1) {
          lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
        }
        else {
          lastTextPos = index + closeMarkup.length;
          kMarkupPattern.lastIndex = lastTextPos;
          match[1] = true;
        }

        let newText = data.slice(match.index + match[0].length, index);

        if (newText.trim()) {
          currentParent.childNodes.push(TextNode(escape(newText)));
        }
      }
    }
    if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
      // </ or /> or <br> etc.
      while (currentParent) {
        if (currentParent.nodeName == match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        else {
          let tag = kElementsClosedByClosing[currentParent.nodeName];

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
  var remainingText = data.slice(lastTextPos).trim();

  // If the text exists and isn't just whitespace, push into a new TextNode.
  if (remainingText) {
    interpolateDynamicBits(currentParent, remainingText, supplemental);
  }

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    let head = { before: [], after: [] };
    let body = { after: [] };
    let beforeHead = true;
    let beforeBody = true;
    let HTML = root.childNodes[0];

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
      let headInstance = pools.elementObject.get();
      headInstance.nodeName = 'head';
      headInstance.childNodes.length = 0;
      headInstance.attributes.length = 0;

      let existing = headInstance.childNodes;
      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);

      HTML.childNodes.unshift(headInstance);
    }
    else {
      let existing = HTML.childNodes[0].childNodes;
      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      let bodyInstance = pools.elementObject.get();
      bodyInstance.nodeName = 'body';
      bodyInstance.childNodes.length = 0;
      bodyInstance.attributes.length = 0;

      let existing = bodyInstance.childNodes;
      existing.push.apply(existing, body.after);

      HTML.childNodes.push(bodyInstance);
    }
    else {
      let existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}
