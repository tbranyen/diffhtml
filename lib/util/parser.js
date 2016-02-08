// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

import { pools as _pools } from './pools';

var pools = _pools;
var parser = makeParser();
var slice = Array.prototype.slice;

/**
 * parseHTML
 *
 * @param newHTML
 * @return
 */
export function parseHTML(newHTML, isInner) {
  var documentElement = parser.parse(newHTML);
  var nodes = documentElement.childNodes;

  return isInner ? nodes : nodes[0];
}

/**
 * makeParser
 *
 * @return
 */
export function makeParser() {
  var kMarkupPattern =
    /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;

  var kAttributePattern = /\b(id|class)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  var reAttrPattern =
    /\b([a-z][a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

  var kSelfClosingElements = {
    meta: true,
    img: true,
    link: true,
    input: true,
    area: true,
    br: true,
    hr: true
  };

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

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  /**
   * TextNode to contain a text element in DOM tree.
   * @param {string} value [description]
   */
  function TextNode(value) {
    var instance = pools.elementObject.get();

    instance.nodeName = '#text';
    instance.nodeValue = value;
    instance.nodeType = 3;
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
   */
  function HTMLElement(name, keyAttrs, rawAttrs) {
    var instance = pools.elementObject.get();

    instance.nodeName = name;
    instance.nodeValue = '';
    instance.nodeType = 1;
    instance.childNodes.length = 0;
    instance.attributes.length = 0;

    if (rawAttrs) {
      for (let match; match = reAttrPattern.exec(rawAttrs); ) {
        let attr = pools.attributeObject.get();

        attr.name = match[1];
        attr.value = match[6] || match[5] || match[4] || match[1];

        // Look for empty attributes.
        if (match[6] === '""') { attr.value = ''; }

        instance.attributes[instance.attributes.length] = attr;
      }
    }

    return instance;
  }

  /**
   * Parses HTML and returns a root element
   */
  var htmlParser = {
    /**
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    parse: function(data) {
      var rootObject = {};
      var root = HTMLElement(null, rootObject);
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      if (data.indexOf('<') === -1 && data) {
        currentParent.childNodes[currentParent.childNodes.length] = TextNode(data);

        return root;
      }

      for (let match, text; match = kMarkupPattern.exec(data); ) {
        if (lastTextPos > -1) {
          if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
            // if has content
            text = data.slice(lastTextPos, kMarkupPattern.lastIndex - match[0].length);

            currentParent.childNodes.push(TextNode(text));
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
              HTMLElement(match[2], attrs, match[3])
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
              lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
              match[1] = true;
            }

            let newText = data.slice(match.index + match[0].length, index);

            if (newText.trim()) {
              newText = slice.call(newText).map(ch => {
                return escapeMap[ch] || ch;
              }).join('');

              currentParent.childNodes.push(TextNode(newText));
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
              // Trying to close current tag, and move on
              if (kElementsClosedByClosing[currentParent.nodeName]) {
                if (kElementsClosedByClosing[currentParent.nodeName][match[2]]) {
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
  };

  return htmlParser;
}
