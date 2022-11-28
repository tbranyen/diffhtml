/**
 * @typedef {import('./types').TransactionConfig} TransactionConfig
 * @typedef {import('./types').ParserConfig} ParserConfig
 * @typedef {import('./types').VTree} VTree
 */
import createTree from '../tree/create';
import getConfig from './config';
import { NODE_TYPE, EMPTY } from './types';

const rawElementsDefaults = [
  'script',
  'noscript',
  'style',
  'template',
];

/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Void_element
 */
const voidElementsDefaults = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

/**
 * These are elements that support omitting a closing tag when certain criteria
 * are met.
 *
 * @see https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission
 * @type {any}
 */
const endTagOmissionRules = {
  li: { li: EMPTY.NUM },
  dt: { dt: EMPTY.NUM, dd: EMPTY.NUM },
  dd: { dt: EMPTY.NUM, dd: EMPTY.NUM },
  td: { td: EMPTY.NUM, th: EMPTY.NUM },
  th: { td: EMPTY.NUM, th: EMPTY.NUM },
  tbody: { tbody: EMPTY.NUM, tfoot: EMPTY.NUM },
  tfoot: { tbody: EMPTY.NUM, tfoot: EMPTY.NUM },
};

// List of regular expressions to match various HTML features.
export const openComment = /<!--/g;
export const closeComment = /-->/g;

// Extract the tagName from an opening tag. There must not be any whitespace
// between the opening angle bracket and the word/namespace.
export const openTag = /<([^\s\\/>]*)\s?/g;
export const closeTag = /\s?(\/>)|(<\/(.*?)>)/g;

// Find all values within quotes and up to `>`. Support interpolated values
// with __DIFFHTML_TOKEN__ format.
export const attribute = /([^>\/\n ])*?(["'])(?:(?=(\\?))\3.)*?\2|.*?(?=\/>|>|\n| )/gsm;
export const parseAttr = /([^=]*)=(.*)|([^>])/gsm;

// Text nodes are anything that isn't <.
export const text = /([^<]*)/g;

/**
 * Removes "", '', or `` wrapping quotes from attributes when they are
 * parsed directly from the markup.
 *
 * @param {string} value
 * @return {string}
 */
function removeQuotes(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const quotes = ['"', '\''];
  const rootQuote = quotes.indexOf(value[0]);
  const hasRootQuote = rootQuote !== -1;
  const trailingQuote = hasRootQuote && quotes.indexOf(value[value.length - 1]);

  if (rootQuote !== -1 && trailingQuote === rootQuote) {
    return value.slice(1, value.length - 1);
  }

  return value;
}

/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {TransactionConfig=} options - Contains additional options
 * @return {VTree} - Parsed Virtual Tree Element
 */
export default function parse(html, options = {}) {
  // Always start with a fragment container when parsing.
  const root = createTree('#document-fragment', null, []);

  // If no markup is provided, return an empty text node. This is a fast path
  // to circumvent extra work in this case.
  if (!html) {
    root.childNodes.push(createTree('#text', EMPTY.STR));
    return root;
  }

  // If there are no parser configuration options passed, use an empty object.
  if (!options.parser) {
    /** @type {ParserConfig} */
    options.parser = EMPTY.OBJ;
  }

  // Elements that have all nested children converted into text, like script
  // and style tags.
  const blockText = new Set(
    /** @type {string[]} */(
      getConfig(
        'rawElements',
        rawElementsDefaults,
        'array',
        options.parser,
      )
    ),
  );

  // Elements that are automatically self closed, and never contain children.
  const voidElements = new Set(
    /** @type {string[]} */(
      getConfig(
        'voidElements',
        voidElementsDefaults,
        'array',
        options.parser,
      )
    ),
  );

  // If there are no brackets, we can avoid some extra work by treating this as
  // text. This is a fast path for text.
  if (!html.includes('<') && !html.includes('>')) {
    const newTree = createTree('#text', html);
    root.childNodes.push(newTree);
    return root;
  }

  // Contains the active hierarchy, its length will be that of the deepest
  // element crawled.
  const stack = [root];

  // Cursor into the markup that we use when parsing.
  let i = 0;

  /**
   * The active element being crawled.
   * @type {VTree}
   */
  let pointer = root;

  // The pointer is open when looking for attributes, self closing, or open
  // tag closing.
  let isOpen = false;

  /**
   * Allow short-circuiting if never found.
   * @type {number|null}
   */
  let lastCommentIndex = html.indexOf('<!--');

  // Closes the current element and calls createTree to allow middleware to tap
  // into it. Resets the pointer to the parent. This function should never be
  // called with the root element, otherwise it will set a null pointer.
  const resetPointer = () => {
    // Create tree is called to normalize the stack into VTree and allow
    // middleware to hook into the parser.
    const newTree = createTree(stack.pop());

    // Reset the pointer to the parent.
    pointer = stack[stack.length - 1];
    pointer.childNodes.push(newTree);
  };

  // This loop treats the `i` as a cursor into the markup determining what is
  // being parsed. This is useful for setting the `lastIndex` values of the
  // regular expressions defined above. Once this value matches the length of
  // the input markup, we know we have finished parsing.
  while (i < html.length) {
    // Set the lastIndex for all stateful regexes to avoid slicing the html
    // string and getting the latest match each time.
    openComment.lastIndex = i;
    closeComment.lastIndex = i;
    openTag.lastIndex = i;
    closeTag.lastIndex = i;
    attribute.lastIndex = i;
    text.lastIndex = i;

    // Reset parseAttr for each iteration.
    parseAttr.lastIndex = 0;

    /**
     * First check for open comments this allows bypassing any other parsing
     * if a comment has been opened.
     * @type {Boolean}
     */
    const shouldSeekComment = Boolean(
      lastCommentIndex !== null && lastCommentIndex <= i
    );

    const {
      // @ts-ignore
      index: openCommentIndex,
    } = shouldSeekComment && openComment.exec(html) || EMPTY.OBJ;

    // There are no remaining comments, so skip this check. This is very
    // important for performance reasons, otherwise on every loop tick we are
    // crawling the entire markup for something we know isn't there.
    if (shouldSeekComment) {
      lastCommentIndex = openCommentIndex;
    }
    if (openCommentIndex === -1) {
      lastCommentIndex = null;
    }

    const isNotRoot = pointer !== root;

    // If an element is a block text element (such as script) we should not
    // parse anything under it, except as text.
    const isBlockElement = pointer && blockText.has(pointer.nodeName);

    // If a comment exists, search for the close and treat everything between
    // as a string. There may be dynamic supplemental values to interpolate,
    // these will be toString'd before injection.
    if (openCommentIndex === i) {
      // Find the first close comment instance.
      let { index: closeCommentIndex } = closeComment.exec(html) || EMPTY.OBJ;

      // Default to the end of the markup if no end comment is found.
      if (closeCommentIndex === -1) {
        closeCommentIndex = html.length;
      }

      const comment = createTree('#comment');
      comment.nodeValue = html.slice(i + 4, closeCommentIndex);
      pointer.childNodes.push(comment);

      i = closeCommentIndex + 3;
      continue;
    }

    // Open tags.
    const {
      0: fullOpenTagMatch,
      1: tagName,
      index: openTagIndex,
    } = openTag.exec(html) || EMPTY.OBJ;

    // Only open a tag if it contains a tag name.
    if (openTagIndex === i && tagName && !isBlockElement) {
      // If a doctype, skip to the end, we don't parse these.
      if (tagName[0] === '!') {
        // Find the next > since the open tag.
        i = html.indexOf('>', openTagIndex) + 1;
        continue;
      }

      // Don't call createTree yet, otherwise we won't have access to the
      // completed element. So create a fake VTree, to build up the object
      // until we have attributes and child nodes.
      const newTree = {
        rawNodeName: tagName,
        nodeName: tagName,
        childNodes: [],
        attributes: {},
        nodeType: EMPTY.NUM,
        nodeValue: EMPTY.STR,
        key: EMPTY.STR,
      };
      const supportsEndTagOmission = endTagOmissionRules[tagName];

      // We can't nested a div inside a p, we can't nest an li inside an li
      if (supportsEndTagOmission && supportsEndTagOmission[pointer.nodeName]) {
        resetPointer();
      }

      pointer = newTree;
      stack.push(pointer);

      isOpen = true;
      i = openTagIndex + fullOpenTagMatch.length;
      continue;
    }

    // Attributes.
    const {
      0: fullAttributeMatch,
      index: attributeIndex,
    } = attribute.exec(html) || EMPTY.OBJ;

    const attributeMatchTrim = attributeIndex === i && fullAttributeMatch.trim();

    if (isOpen && attributeIndex === i) {
      // Skip whitespace
      if (!attributeMatchTrim) {
        i = i + fullAttributeMatch.length + 1;

        // TBD Refactor this so its not duplicated
        if (html[i - 1] === '>') {
          const isEnd = i === html.length;

          // Self closing
          if (html[i - 2] === '/' || voidElements.has(pointer.nodeName) || isEnd) {
            resetPointer();
          }

          isOpen = false;
        }

        continue;
      }

      const {
        1: key = fullAttributeMatch,
        2: value = fullAttributeMatch,
      } = parseAttr.exec(attributeMatchTrim) || EMPTY.OBJ;

      const isBoolean = key === value || value === undefined;
      const trimKey = key.trim();

      pointer.attributes[trimKey] = isBoolean ? Boolean(value) : removeQuotes(value);

      i = attributeIndex + fullAttributeMatch.length;
      continue;
    }

    // When in a block element, find the nearest closing element, otherwise
    // use the entire input.
    if (isBlockElement) {
      const closeTag = `</${pointer.nodeName}>`;
      let closeTagIndex = html.indexOf(closeTag, i);

      if (closeTagIndex === -1) {
        closeTagIndex = html.length;
      }

      const innerText = html.slice(i, closeTagIndex);

      if (innerText) {
        pointer.childNodes.push(createTree('#text', innerText));
      }

      i = closeTagIndex + closeTag.length;
      isOpen = false;
      resetPointer();
      continue;
    }

    // Close opened tags.
    if (html[i] === '>') {
      isOpen = false;
      i = i + 1;

      // Automatically close void elements.
      if (voidElements.has(pointer.nodeName)) {
        resetPointer();
      }

      continue;
    }

    // Close tags.
    const {
      0: fullCloseTagMatch,
      3: closeTagName,
      index: closeTagIndex,
    } = closeTag.exec(html) || EMPTY.OBJ;

    // Look for closing tags
    if (closeTagIndex === i && fullCloseTagMatch) {
      const isVoidElement = voidElements.has(closeTagName);
      if (fullCloseTagMatch[1] === '/' && isNotRoot && !isVoidElement) {
        resetPointer();
      }
      isOpen = false;

      i = closeTagIndex + fullCloseTagMatch.length;
      continue;
    }

    // Text.
    const {
      0: fullTextMatch,
      index: textIndex,
    } = text.exec(html) || EMPTY.OBJ;

    if (!isOpen && textIndex === i && fullTextMatch.length) {
      const newTree = createTree('#text', fullTextMatch);
      pointer.childNodes.push(newTree);
      i = textIndex + fullTextMatch.length;

      if (i === html.length && isNotRoot) {
        resetPointer();
      }

      continue;
    }

    // Use remaining values as text
    pointer.childNodes.push(createTree('#text', html.slice(i, html.length)));
    i = html.length;
  }

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    /** @type {{ [name: string]: VTree[] }} */
    const head = { before: [], after: [] };
    /** @type {{ [name: string]: VTree[] }} */
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
      else if (el.nodeType === NODE_TYPE.ELEMENT) {
        if (beforeHead && beforeBody) head.before.push(el);
        else if (!beforeHead && beforeBody) head.after.push(el);
        else if (!beforeBody) body.after.push(el);
      }
    });

    // Ensure the first element is the HEAD tag.
    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = createTree('head', null, []);

      if (headInstance) {
        const existing = headInstance.childNodes;

        existing.unshift.apply(existing, head.before);
        existing.push.apply(existing, head.after);
        HTML.childNodes.unshift(headInstance);
      }
    }
    else {
      const existing = HTML.childNodes[0].childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      const bodyInstance = createTree('body', null, []);

      if (bodyInstance) {
        const existing = bodyInstance.childNodes;

        existing.push.apply(existing, body.after);
        HTML.childNodes.push(bodyInstance);
      }
    }
    else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}
