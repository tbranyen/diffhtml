import { pools as _pools } from './pools';

var pools = _pools;
var parser = makeParser();

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

export function makeParser() {
  var kMarkupPattern =
    /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-][a-z0-9\-]*)\s*([^>]*?)(\/?)>/ig;
  var kAttributePattern = /\b(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;

  var kBlockElements = {
    div: true,
    p: true,
    li: true,
    td: true,
    section: true,
    br: true
  };

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
    pre: true
  };

  /**
   * Cache to store generated match functions
   * @type {Object}
   */
  var pMatchFunctionCache = {};

  /**
   * Node Class as base class for TextNode and HTMLElement.
   */
  function Node() {}

  Node.prototype.ELEMENT_NODE = 1;
  Node.prototype.TEXT_NODE = 3;

  Node.ELEMENT_NODE = 1;
  Node.TEXT_NODE = 3;

  /**
   * TextNode to contain a text element in DOM tree.
   * @param {string} value [description]
   */
  function TextNode(value) {
    var instance = pools.elementObject.get();

    instance.nodeValue = value;
    instance.nodeName = '#text';
    instance.element = pools.uuid.get();
    instance.nodeType = 3;

    return instance;
  }

  /**
   * HTMLElement, which contains a set of children.
   * Note: this is a minimalist implementation, no complete tree
   *   structure provided (no parentNode, nextSibling,
   *   previousSibling etc).
   * @param {string} name     nodeName
   * @param {Object} keyAttrs id and class attribute
   * @param {Object} rawAttrs attributes in string
   */
  function HTMLElement(name, keyAttrs, rawAttrs) {
    this.nodeName = name;
    this.attributes = pools.array.get();

    if (rawAttrs) {
      let re = /\b([a-z][a-z0-9\-]*)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;

      for (let match; match = re.exec(rawAttrs); ) {
        var attr = pools.attributeObject.get();

        attr.name = match[1];
        attr.value = match[3] || match[4] || match[5];

        this.attributes[this.attributes.length] = attr;
      }
    }

    this.childNodes = pools.array.get();
    this.element = pools.uuid.get();
  }

  HTMLElement.prototype = Object.create(Node.prototype);
  HTMLElement.prototype.nodeType = Node.ELEMENT_NODE;

  /**
   * Parses HTML and returns a root element
   */
  var htmlParser = {
    Node,
    HTMLElement,
    TextNode,

    /**
     * Parse a chuck of HTML source.
     * @param  {string} data      html
     * @return {HTMLElement}      root element
     */
    parse: function(data, options) {
      var rootObject = pools.object.get();

      var root = new HTMLElement(null, rootObject);
      var currentParent = root;
      var stack = [root];
      var lastTextPos = -1;

      options = options || pools.object.get();

      if (data.indexOf('<') === -1 && data) {
        currentParent.childNodes[currentParent.childNodes.length] = TextNode(data);
        return root;
      }

      for (var match, text; match = kMarkupPattern.exec(data); ) {
        if (lastTextPos > -1) {
          if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
            // if has content
            text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
            if (text.trim()) {
              currentParent.childNodes[currentParent.childNodes.length] = TextNode(text);
            }
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
          var attrs = pools.object.get();
          for (var attMatch; attMatch = kAttributePattern.exec(match[3]); )
            attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
          if (!match[4] && kElementsClosedByOpening[currentParent.nodeName]) {
            if (kElementsClosedByOpening[currentParent.nodeName][match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
            }
          }
          currentParent = currentParent.childNodes[currentParent.childNodes.push(
              new HTMLElement(match[2], attrs, match[3])) - 1];
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
                currentParent.childNodes[currentParent.childNodes.length] = TextNode(text);
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
          while (true && currentParent) {
            if (currentParent.nodeName == match[2]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
              break;
            } else {
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

      return root;
    }
  };

  return htmlParser;
};
