/**
 * Node Class as base class for TextNode and HTMLElement.
 */
function Node() {}

Node.ELEMENT_NODE = 1;
Node.TEXT_NODE = 3;

/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
function TextNode(value) {
  this.rawText = value;
}

TextNode.prototype = Object.create(Node);

/**
 * Node Type declaration.
 * @type {Number}
 */
TextNode.prototype.nodeType = Node.TEXT_NODE;

var kBlockElements = {
  div: true,
  p: true,
  // ul: true,
  // ol: true,
  li: true,
  // table: true,
  // tr: true,
  td: true,
  section: true,
  br: true
};

/**
 * HTMLElement, which contains a set of children.
 * Note: this is a minimalist implementation, no complete tree
 *   structure provided (no parentNode, nextSibling,
 *   previousSibling etc).
 * @param {string} name     tagName
 * @param {Object} keyAttrs id and class attribute
 * @param {Object} rawAttrs attributes in string
 */
function HTMLElement(name, keyAttrs, rawAttrs) {
  this.tagName = name;
  this.rawAttrs = rawAttrs || '';
  this.childNodes = [];
}

HTMLElement.prototype = Object.create(Node);

/**
 * Node Type declaration.
 * @type {Number}
 */
HTMLElement.prototype.nodeType = Node.ELEMENT_NODE;

/**
 * Append a child node to childNodes
 * @param  {Node} node node to append
 * @return {Node}      node appended
 */
HTMLElement.prototype.appendChild = function(node) {
  // node.parentNode = this;
  this.childNodes.push(node);
  return node;
};

/**
 * Get attributes
 * @return {Object} parsed and unescaped attributes
 */
Object.defineProperty(HTMLElement.prototype, 'attributes', {
  get: function() {
    if (this._attrs)
      return this._attrs;
    this._attrs = {};
    var attrs = this.rawAttributes;
    for (var key in attrs) {
      this._attrs[key] = attrs[key];
    }
    return this._attrs;
  }
});

//$define(HTMLElement, {
//  __wrap: function(el) {
//    el.childNodes.forEach(function(node) {
//      if (node.rawText) {
//        $wrap(node, TextNode);
//      } else {
//        $wrap(node, HTMLElement);
//      }
//    });
//  }
//});

/**
 * Cache to store generated match functions
 * @type {Object}
 */
var pMatchFunctionCache = {};


var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/ig;
var kAttributePattern = /\b(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
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
  li: {li: true},
  p: {p: true, div: true},
  td: {td: true, th: true},
  th: {td: true, th: true}
};
var kElementsClosedByClosing = {
  li: {ul: true, ol: true},
  a: {div: true},
  b: {div: true},
  i: {div: true},
  p: {div: true},
  td: {tr: true, table: true},
  th: {tr: true, table: true}
};
var kBlockTextElements = {
  script: true,
  noscript: true,
  style: true,
  pre: true
};

/**
 * Parses HTML and returns a root element
 */
module.exports = {

  Node: Node,
  HTMLElement: HTMLElement,
  TextNode: TextNode,

  /**
   * Parse a chuck of HTML source.
   * @param  {string} data      html
   * @return {HTMLElement}      root element
   */
  parse: function(data, options) {

    var root = new HTMLElement(null, {});
    var currentParent = root;
    var stack = [root];
    var lastTextPos = -1;

    options = options || {};

    for (var match, text; match = kMarkupPattern.exec(data); ) {
      if (lastTextPos > -1) {
        if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
          // if has content
          text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
          currentParent.appendChild(new TextNode(text));
        }
      }
      lastTextPos = kMarkupPattern.lastIndex;
      if (match[0][1] == '!') {
        // this is a comment
        continue;
      }
      if (options.lowerCaseTagName)
        match[2] = match[2].toLowerCase();
      if (!match[1]) {
        // not </ tags
        var attrs = {};
        for (var attMatch; attMatch = kAttributePattern.exec(match[3]); )
          attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
        // console.log(attrs);
        if (!match[4] && kElementsClosedByOpening[currentParent.tagName]) {
          if (kElementsClosedByOpening[currentParent.tagName][match[2]]) {
            stack.pop();
            currentParent = stack.back;
          }
        }
        currentParent = currentParent.appendChild(
            new HTMLElement(match[2], attrs, match[3]));
        stack.push(currentParent);
        if (kBlockTextElements[match[2]]) {
          // a little test to find next </script> or </style> ...
          var closeMarkup = '</' + match[2] + '>';
          var index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
          if (options[match[2]]) {
            if (index == -1) {
              // there is no matching ending for the text element.
              text = data.substr(kMarkupPattern.lastIndex);
            } else {
              text = data.substring(kMarkupPattern.lastIndex, index);
            }
            if (text.length > 0)
              currentParent.appendChild(new TextNode(text));
          }
          if (index == -1) {
            lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
          } else {
            lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
            match[1] = true;
          }
        }
      }
      if (match[1] || match[4] ||
          kSelfClosingElements[match[2]]) {
        // </ or /> or <br> etc.
        while (true) {
          if (currentParent.tagName == match[2]) {
            stack.pop();
            currentParent = stack.back;
            break;
          } else {
            // Trying to close current tag, and move on
            if (kElementsClosedByClosing[currentParent.tagName]) {
              if (kElementsClosedByClosing[currentParent.tagName][match[2]]) {
                stack.pop();
                currentParent = stack.back;
                continue;
              }
            }
            // Use aggressive strategy to handle unmatching markups.
            break;
          }
        }
      }
    }

    return root;

  }

};
