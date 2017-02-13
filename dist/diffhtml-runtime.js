(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.diff = global.diff || {})));
}(this, (function (exports) { 'use strict';

// Associates DOM Nodes with state objects.
const StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
const NodeCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
const MiddlewareCache = new Set();

// Cache transition functions.
const TransitionCache = new Map();

// A modest size.
const size = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
const memory$1 = {
  free: new Set(),
  allocated: new Set(),
  protected: new Set()
};

// Prime the memory cache with n objects.
for (let i = 0; i < size; i++) {
  memory$1.free.add({
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: [],
    attributes: {}
  });
}

// Cache the values object.
const freeValues = memory$1.free.values();

// Cache VTree objects in a pool which is used to get
var Pool = {
  size,
  memory: memory$1,

  get() {
    const value = freeValues.next().value || {
      rawNodeName: '',
      nodeName: '',
      nodeValue: '',
      nodeType: 1,
      key: '',
      childNodes: [],
      attributes: {}
    };
    memory$1.free.delete(value);
    memory$1.allocated.add(value);
    return value;
  },

  protect(value) {
    memory$1.allocated.delete(value);
    memory$1.protected.add(value);
  },

  unprotect(value) {
    if (memory$1.protected.has(value)) {
      memory$1.protected.delete(value);
      memory$1.free.add(value);
    }
  }
};

const { memory, protect, unprotect } = Pool;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */
function protectVTree(vTree) {
  protect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
function unprotectVTree(vTree) {
  unprotect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory() {
  memory.allocated.forEach(vTree => memory.free.add(vTree));
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  NodeCache.forEach((node, descriptor) => {
    if (!memory.protected.has(descriptor)) {
      NodeCache.delete(descriptor);
    }
  });
}

// Namespace.
const namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
const elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

// Support loading diffHTML in non-browser environments.
const g = typeof global === 'object' ? global : window;
const element = g.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}

/**
 * Tiny HTML escaping function, useful to protect against things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
function escape(unescaped) {
  return unescaped.replace(/["&'<>`]/g, match => `&#${match.charCodeAt(0)};`);
}

const marks = new Map();
const prefix = 'diffHTML';
const token = 'diff_perf';

const hasSearch = typeof location !== 'undefined' && location.search;
const hasArguments = typeof process !== 'undefined' && process.argv;
const wantsSearch = hasSearch && location.search.includes(token);
const wantsArguments = hasArguments && process.argv.includes(token);
const wantsPerfChecks = wantsSearch || wantsArguments;
const nop = () => {};

var measure = ((domNode, vTree) => {
  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) {
    return nop;
  }

  return name => {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = `${domNode.host.constructor.name} ${name}`;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = `${vTreevTree.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      const totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
  };
});

const empty = null;

// Reuse these maps, it's more performant to clear them than recreate.
const oldKeys = new Map();
const newKeys = new Map();

const propToAttrMap = {
  className: 'class',
  htmlFor: 'for'
};

function syncTree(oldTree, newTree, patches) {
  if (!newTree) {
    throw new Error('Missing new tree to sync into');
  }

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    TREE_OPS: [],
    NODE_VALUE: [],
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: []
  };

  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: empty,
    REMOVE_CHILD: empty,
    REPLACE_CHILD: empty
  };

  // Seek out attribute changes first, but only from element Nodes.
  if (newTree.nodeType === 1) {
    const setAttributes = [];
    const removeAttributes = [];
    const oldAttributes = oldTree ? oldTree.attributes : {};
    const { attributes: newAttributes } = newTree;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      oldAttributes[key] = value;

      // Alias prop names to attr names for patching purposes.
      if (key in propToAttrMap) {
        key = propToAttrMap[key];
      }

      SET_ATTRIBUTE.push(oldTree || newTree, key, value);
    }

    // Search for removals.
    for (let key in oldAttributes) {
      if (key in newAttributes) {
        continue;
      }
      REMOVE_ATTRIBUTE.push(oldTree || newTree, key);
      delete oldAttributes[key];
    }
  }

  if (!oldTree) {
    // Dig into all nested children.
    for (let i = 0; i < newTree.childNodes.length; i++) {
      syncTree(null, newTree.childNodes[i], patches);
    }

    return patches;
  }

  const { nodeName: oldTreeName } = oldTree;
  const { nodeName: newTreeName } = newTree;

  if (oldTreeName !== newTreeName) {
    throw new Error(`Sync failure, cannot compare ${newTreeName} with ${oldTreeName}`);
  }

  const { childNodes: oldChildNodes } = oldTree;
  const { childNodes: newChildNodes } = newTree;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  const hasOldKeys = oldChildNodes.some(vTree => vTree.key);
  const hasNewKeys = newChildNodes.some(vTree => vTree.key);

  // If we are working with keys, we can follow an optimized path.
  if (hasOldKeys || hasNewKeys) {
    oldKeys.clear();
    newKeys.clear();

    // Put the old `childNode` VTree's into the key cache for lookup.
    for (let i = 0; i < oldChildNodes.length; i++) {
      const vTree = oldChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        oldKeys.set(vTree.key, vTree);
      }
    }

    // Put the new `childNode` VTree's into the key cache for lookup.
    for (let i = 0; i < newChildNodes.length; i++) {
      const vTree = newChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        newKeys.set(vTree.key, vTree);
      }
    }

    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      const oldChildNode = oldChildNodes[i];
      const newChildNode = newChildNodes[i];

      const { key } = newChildNode;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        // Prefer an existing match to a brand new element.
        let optimalNewNode = null;

        // Prefer existing to new and remove from old position.
        if (oldKeys.has(key)) {
          optimalNewNode = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else {
          optimalNewNode = newKeys.get(key) || newChildNode;
        }

        if (patchset.INSERT_BEFORE === empty) {
          patchset.INSERT_BEFORE = [];
        }
        patchset.INSERT_BEFORE.push([oldTree, optimalNewNode]);
        oldChildNodes.push(optimalNewNode);
        syncTree(null, optimalNewNode, patches);
        continue;
      }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (key !== oldChildNode.key) {
        let optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (key && oldKeys.has(key)) {
          optimalNewNode = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else if (key) {
          optimalNewNode = newKeys.get(key);
        }

        if (patchset.INSERT_BEFORE === empty) {
          patchset.INSERT_BEFORE = [];
        }
        patchset.INSERT_BEFORE.push([oldTree, optimalNewNode, oldChildNode]);
        oldChildNodes.splice(i, 0, optimalNewNode);
        syncTree(null, optimalNewNode, patches);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) {
          patchset.REPLACE_CHILD = [];
        }
        patchset.REPLACE_CHILD.push([newChildNode, oldChildNode]);
        oldTree.childNodes[i] = newChildNode;
        syncTree(null, newChildNode, patches);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
      // Do a single pass over the new child nodes.
      for (let i = 0; i < newChildNodes.length; i++) {
        const oldChildNode = oldChildNodes[i];
        const newChildNode = newChildNodes[i];

        // If there is no old element to compare to, this is a simple addition.
        if (!oldChildNode) {
          if (patchset.INSERT_BEFORE === empty) {
            patchset.INSERT_BEFORE = [];
          }
          patchset.INSERT_BEFORE.push([oldTree, newChildNode]);
          oldChildNodes.push(newChildNode);
          syncTree(null, newChildNode, patches);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (oldChildNode.nodeName !== newChildNode.nodeName) {
          if (patchset.REPLACE_CHILD === empty) {
            patchset.REPLACE_CHILD = [];
          }
          patchset.REPLACE_CHILD.push([newChildNode, oldChildNode]);
          oldTree.childNodes[i] = newChildNode;
          syncTree(null, newChildNode, patches);
          continue;
        }

        syncTree(oldChildNode, newChildNode, patches);
      }
    }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      if (patchset.REMOVE_CHILD === empty) {
        patchset.REMOVE_CHILD = [];
      }
      patchset.REMOVE_CHILD.push(oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
    TREE_OPS.push(patchset);
  }

  // If both VTrees are text nodes and the values are different, change the
  // NODE_VALUE.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;
      NODE_VALUE.push(oldTree, oldTree.nodeValue);

      const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;

      // We want to look if anything has changed, if nothing has we won't add
      // it to the patchset.
      if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
        TREE_OPS.push(patchset);
      }

      return patches;
    }
  }

  return patches;
}

// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser

const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/ig;
const attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
const spaceEx = /[^ ]/;
const tokenEx = /__DIFFHTML__([^_]*)__/g;

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

const selfClosing = new Set(['meta', 'img', 'link', 'input', 'area', 'br', 'hr']);

const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};

const kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true }
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
const interpolateValues = (currentParent, string = '', supplemental = {}) => {
  // If this is text and not a doctype, add as a text node.
  if (string && !string.match(doctypeEx) && !tokenEx.test(string)) {
    return currentParent.childNodes.push(createTree('#text', string));
  }

  const childNodes = [];
  const parts = string.split(tokenEx);
  let { length } = parts;

  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];

    if (!value) {
      continue;
    }

    // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.
    if (i % 2 === 1) {
      const innerTree = supplemental.children[value];

      if (innerTree) {
        if (innerTree.nodeType === 11) {
          childNodes.push(...innerTree.childNodes);
        } else {
          childNodes.push(innerTree);
        }
      }
    } else if (!doctypeEx.test(value)) {
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
const HTMLElement = (nodeName, rawAttrs, supplemental) => {
  let match = null;

  // Support dynamic tag names like: `<${MyComponent} />`.
  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental);
  }

  const attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  for (let match; match = attrEx.exec(rawAttrs || '');) {
    const name = match[1];
    const value = match[6] || match[5] || match[4] || match[1];
    let tokenMatch = value.match(tokenEx);

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (tokenMatch && tokenMatch.length > 1) {
      attributes[name] = '';

      const parts = value.split(tokenEx);
      let { length } = parts;

      for (let i = 0; i < parts.length; i++) {
        const value = parts[i];

        if (!value) {
          continue;
        }

        // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.
        if (i % 2 === 1) {
          attributes[name] += supplemental.attributes[value];
        } else {
          attributes[name] += value;
        }
      }
    } else if (tokenMatch = tokenEx.exec(name)) {
      const nameAndValue = supplemental.attributes[tokenMatch[1]];

      if (nameAndValue) {
        attributes[nameAndValue] = nameAndValue;
      }
    } else if (tokenMatch = tokenEx.exec(value)) {
      attributes[name] = supplemental.attributes[tokenMatch[1]];
    } else {
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
function parse(html, supplemental, options = {}) {
  const root = createTree('#document-fragment', null, []);
  const stack = [root];
  let currentParent = root;
  let lastTextPos = -1;
  let preLastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  const tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

  // Look through the HTML markup for valid tags.
  for (let match, text; match = tagEx.exec(html);) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        // Do not process leading whitespace in a tagged template.
        if (preLastTextPos === -1 ? hasNonWhitespaceEx.test(text) : text) {
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

    preLastTextPos = lastTextPos;
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

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental)) - 1];

      stack.push(currentParent);

      if (blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = html.indexOf(closeMarkup, tagEx.lastIndex);
        const { length } = match[2];

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        const newText = html.slice(match.index + match[0].length, index);

        // TODO Determine if a closing tag is present.
        //if (options.strict) {
        //  const nodeName = currentParent.rawNodeName;

        //  // Find a subset of the markup passed in to validate.
        //  const markup = markup.slice(
        //    tagEx.lastIndex - match[0].length
        //  ).split('\n').slice(0, 3);

        //  console.log(markup);

        //  // Position the caret next to the first non-whitespace character.
        //  const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        //  // Craft the warning message and inject it into the markup.
        //  markup.splice(1, 0, `${caret}
        //Invali markup. Saw ${match[2]}, expected ${nodeName}
        //  `);

        //  // Throw an error message if the markup isn't what we expected.
        //  throw new Error(`\n\n${markup.join('\n')}`);
        //}

        interpolateValues(currentParent, newText.trim(), supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (match[2] !== currentParent.rawNodeName && options.strict) {
        const nodeName = currentParent.rawNodeName;

        // Find a subset of the markup passed in to validate.
        const markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3);

        // Position the caret next to the first non-whitespace character.
        const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        // Craft the warning message and inject it into the markup.
        markup.splice(1, 0, `${caret}
Possibly invalid markup. Saw ${match[2]}, expected ${nodeName}...
        `);

        // Throw an error message if the markup isn't what we expected.
        throw new Error(`\n\n${markup.join('\n')}`);
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
        } else {
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
          if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
        }
    });

    // Ensure the first element is the HEAD tag.
    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = createTree('head', null, []);
      const existing = headInstance.childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    } else {
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
    } else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}



var internals = Object.freeze({
	StateCache: StateCache,
	NodeCache: NodeCache,
	MiddlewareCache: MiddlewareCache,
	TransitionCache: TransitionCache,
	protectVTree: protectVTree,
	unprotectVTree: unprotectVTree,
	cleanMemory: cleanMemory,
	namespace: namespace,
	elements: elements,
	decodeEntities: decodeEntities,
	escape: escape,
	measure: measure,
	Pool: Pool,
	parse: parse
});

const { isArray } = Array;
const fragmentName = '#document-fragment';

function createTree(input, attributes, childNodes, ...rest) {
  // If no input was provided then we return an indication as such.
  if (!input) {
    return null;
  }

  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (isArray(input)) {
    childNodes = [];

    for (let i = 0; i < input.length; i++) {
      const newTree = createTree(input[i]);

      if (newTree) {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  const isObject = typeof input === 'object';

  // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
  if (input && isObject && 'parentNode' in input) {
    attributes = {};
    childNodes = [];

    // When working with a text node, simply save the nodeValue as the
    // initial value.
    if (input.nodeType === 3) {
      childNodes = input.nodeValue;
    }
    // Element types are the only kind of DOM node we care about attributes
    // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
    // ignore this.
    else if (input.nodeType === 1 && input.attributes.length) {
        attributes = {};

        for (let i = 0; i < input.attributes.length; i++) {
          const { name, value } = input.attributes[i];

          // If the attribute's value is empty, seek out the property instead.
          if (value === '' && name in input) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      }

    // Get the child nodes from an Element or Fragment/Shadow Root.
    if (input.nodeType === 1 || input.nodeType === 11) {
      if (input.childNodes.length) {
        childNodes = [];

        for (let i = 0; i < input.childNodes.length; i++) {
          childNodes.push(createTree(input.childNodes[i]));
        }
      }
    }

    const vTree = createTree(input.nodeName, attributes, childNodes);
    NodeCache.set(vTree, input);
    return vTree;
  }

  // Assume any object value is a valid VTree object.
  if (isObject) {
    return input;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes, ...rest];
  }

  // Allocate a new VTree from the pool.
  const entry = Pool.get();
  const isTextNode = input === '#text';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = input.toLowerCase();
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    const nodes = arguments.length === 2 ? attributes : childNodes;
    const nodeValue = isArray(nodes) ? nodes.join('') : nodes;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

    return entry;
  }

  if (input === fragmentName) {
    entry.nodeType = 11;
  } else if (input === '#comment') {
    entry.nodeType = 8;
  } else {
    entry.nodeType = 1;
  }

  const useAttributes = isArray(attributes) || typeof attributes !== 'object';
  const nodes = useAttributes ? attributes : childNodes;
  const nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (let i = 0; i < nodeArray.length; i++) {
      const newNode = nodeArray[i];

      // Assume objects are vTrees.
      if (typeof newNode === 'object') {
        entry.childNodes.push(newNode);
      }
      // Cover generate cases where a user has indicated they do not want a
      // node from appearing.
      else if (newNode) {
          entry.childNodes.push(createTree('#text', null, newNode));
        }
    }
  }

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // If is a script tag and has a src attribute, key off that.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the `key` prop if passed as an attr, overrides `script[src]`.
  if (entry.attributes && entry.attributes.key) {
    entry.key = String(entry.attributes.key);
  }

  return entry;
}

function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    unprotectVTree(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  StateCache.delete(domNode);

  // Recycle all unprotected objects.
  cleanMemory();
}

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  const { state } = transaction;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.
  if (state.isRendering) {
    state.nextTransaction = transaction;
    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}

function shouldUpdate(transaction) {
  const { markup, state, state: { measure } } = transaction;

  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

function reconcileTrees(transaction) {
  const { state, state: { measure: measure$$1 }, domNode, markup, options } = transaction;
  const { previousMarkup, previousText } = state;
  const { inner } = options;

  measure$$1('reconcile trees');

  // This looks for changes in the DOM from what we'd expect. This means we
  // need to rebuild the old Virtual Tree. This allows for keeping our tree
  // in sync with unexpected DOM changes. It's not very performant, so
  // ideally you should never change markup that diffHTML affects from
  // outside of diffHTML if performance is a concern.
  const sameInnerHTML = inner ? previousMarkup === domNode.innerHTML : true;
  const sameOuterHTML = inner ? true : previousMarkup === domNode.outerHTML;
  const sameTextContent = previousText === domNode.textContent;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);
    }

    // Set the `oldTree` in the state as-well-as the transaction. This allows
    // it to persist with the DOM Node and also be easily available to
    // middleware and transaction tasks.
    state.oldTree = createTree(domNode);

    // We need to keep these objects around for comparisons.
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // We need to ensure that our target to diff is a Virtual Tree Element. This
  // function takes in whatever `markup` is and normalizes to a tree object.
  // The callback function runs on every normalized Node to wrap childNodes
  // in the case of setting innerHTML.

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one.
    transaction.newTree = createTree(parse(markup, null, options).childNodes);
  }

  // Only create a document fragment for inner nodes if the user didn't already
  // pass an array. If they pass an array, `createTree` will auto convert to
  // a fragment.
  else if (options.inner) {
      const { nodeName, attributes } = transaction.oldTree;
      transaction.newTree = createTree(nodeName, attributes, markup);
    }

    // Everything else gets passed into `createTree` to be figured out.
    else {
        transaction.newTree = createTree(markup);
      }

  measure$$1('reconcile trees');
}

function syncTrees(transaction) {
  const { state: { measure, oldTree }, newTree } = transaction;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  if (oldTree.nodeName !== newTree.nodeName) {
    transaction.patches = { TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }] };
    transaction.oldTree = transaction.state.oldTree = newTree;
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = syncTree(oldTree, newTree);
    }

  measure('sync trees');
}

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @return {Object} - A DOM Node matching the vTree
 */
function createNode(vTree, doc = document) {
  if (!vTree) {
    throw new Error('Missing VTree when trying to create DOM Node');
  }

  const existingNode = NodeCache.get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  const { nodeName, childNodes = [], nodeValue } = vTree;

  // Will vary based on the properties of the VTree.
  let domNode = null;

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    domNode = doc.createTextNode(decodeEntities(nodeValue));
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
      domNode = doc.createDocumentFragment();
    }
    // If the nodeName matches any of the known SVG element names, mark it as
    // SVG. The reason for doing this over detecting if nested in an <svg>
    // element, is that we do not currently have circular dependencies in the
    // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
    else if (elements.indexOf(nodeName) > -1) {
        domNode = doc.createElementNS(namespace, nodeName);
      }
      // If not a Text or SVG Node, then create with the standard method.
      else {
          domNode = doc.createElement(nodeName);
        }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i]));
  }

  return domNode;
}

// Available transition states.
const stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(stateName => TransitionCache.set(stateName, new Set()));

function addTransitionState(stateName, callback) {
  if (!stateName) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (stateNames.indexOf(stateName) === -1) {
    throw new Error(`Invalid state name: ${stateName}`);
  }

  TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  // Not a valid state name.
  if (stateName && !stateNames.includes(stateName)) {
    throw new Error(`Invalid state name ${stateName}`);
  }

  // Remove all transition callbacks from state.
  if (!callback && stateName) {
    TransitionCache.get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {

      TransitionCache.get(stateName).delete(callback);
    }
    // Remove all callbacks.
    else {
        for (let stateName in stateNames) {
          TransitionCache.get(stateName).clear();
        }
      }
}

function runTransitions(set, ...args) {
  const promises = [];

  set.forEach(callback => {
    if (typeof callback === 'function') {
      const retVal = callback(...args);

      // Is a `thennable` object or Native Promise.
      if (typeof retVal === 'object' && retVal.then) {
        promises.push(retVal);
      }
    }
  });

  return promises;
}

const blockText$1 = new Set(['script', 'noscript', 'style', 'code', 'template']);

function patchNode$$1(patches, state) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    // Triggered either synchronously or asynchronously depending on if a
    // transition was invoked.
    const mutationCallback = (domNode, name, value) => {
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // FIXME Figure out why this is camel case sometimes.
      name = name.indexOf('on') === 0 ? name.toLowerCase() : name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        const noValue = value === null || value === undefined;
        domNode.setAttribute(name, noValue ? '' : value);

        // Allow the user to find the real value in the DOM Node as a
        // property.
        try {
          domNode[name] = value;
        } catch (unhandledException) {}
      }
      // Support patching an object representation of the style object.
      else if (isObject && name === 'style') {
          const keys = Object.keys(value);

          for (let i = 0; i < keys.length; i++) {
            domNode.style[keys[i]] = value[keys[i]];
          }
        } else if (typeof value !== 'string') {
          // We remove and re-add the attribute to trigger a change in a web
          // component or mutation observer. Although you could use a setter or
          // proxy, this is more natural.
          if (domNode.hasAttribute(name) && domNode[name] !== value) {
            domNode.removeAttribute(name, '');
          }

          // Necessary to track the attribute/prop existence.
          domNode.setAttribute(name, '');

          // Since this is a property value it gets set directly on the node.
          try {
            domNode[name] = value;
          } catch (unhandledException) {}
        }
    };

    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const name = SET_ATTRIBUTE[i + 1];
      const value = SET_ATTRIBUTE[i + 2];

      const domNode = createNode(vTree);

      const attributeChanged = TransitionCache.get('attributeChanged');

      if (attributeChanged.size) {
        const oldValue = domNode.getAttribute(name);

        const newPromises = runTransitions(attributeChanged, domNode, name, oldValue, value);

        if (newPromises.length) {
          Promise.all(newPromises).then(() => {
            mutationCallback(domNode, name, value);
          });
        } else {
          mutationCallback(domNode, name, value);
        }
      } else {
        mutationCallback(domNode, name, value);
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
      const vTree = REMOVE_ATTRIBUTE[i];
      const name = REMOVE_ATTRIBUTE[i + 1];

      const domNode = createNode(vTree);

      domNode.removeAttribute(name);

      if (name in domNode) {
        domNode[name] = undefined;
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (let i = 0; i < NODE_VALUE.length; i += 2) {
      const vTree = NODE_VALUE[i];
      const nodeValue = NODE_VALUE[i + 1];

      const domNode = NodeCache.get(vTree);
      const { parentNode } = domNode;

      if (nodeValue.includes('&')) {
        domNode.nodeValue = decodeEntities(escape(nodeValue));
      } else {
        domNode.nodeValue = escape(nodeValue);
      }

      if (parentNode) {
        if (blockText$1.has(parentNode.nodeName.toLowerCase())) {
          parentNode.nodeValue = escape(nodeValue);
        }
      }
    }
  }

  // First do all DOM tree operations, and then do attribute and node value.
  for (let i = 0; i < TREE_OPS.length; i++) {
    const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i++) {
        const [vTree, childNodes, referenceNode] = INSERT_BEFORE[i];
        const domNode = NodeCache.get(vTree);
        const refNode = referenceNode ? createNode(referenceNode) : null;
        let fragment = null;

        const attached = TransitionCache.get('attached');

        if (referenceNode) {
          protectVTree(referenceNode);
        }

        if (childNodes.length) {
          fragment = document.createDocumentFragment();

          for (let i = 0; i < childNodes.length; i++) {
            const newNode = createNode(childNodes[i]);
            fragment.appendChild(newNode);
            protectVTree(childNodes[i]);
          }
        } else {
          fragment = createNode(childNodes);
          protectVTree(childNodes);
        }

        domNode.insertBefore(fragment, refNode);

        if (attached.size) {
          promises.push(...runTransitions(attached, fragment));
        }
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const childNode = REMOVE_CHILD[i];
        const domNode = NodeCache.get(childNode);

        const detached = TransitionCache.get('detached');

        if (detached.size) {
          const newPromises = runTransitions(detached, domNode);

          Promise.all(newPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree(childNode);
          });

          if (newPromises.length) {
            promises.push(...newPromises);
          }
        } else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree(childNode);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i++) {
        const [newChildNode, oldChildNode] = REPLACE_CHILD[i];
        const oldDomNode = NodeCache.get(oldChildNode);
        const newDomNode = createNode(newChildNode);

        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');

        if (replaced.size) {
          const attachedPromises = runTransitions(attached, newDomNode);
          const detachedPromises = runTransitions(detached, oldDomNode);

          const replacedPromises = runTransitions(replaced, oldDomNode, newDomNode);

          const newPromises = [...attachedPromises, ...detachedPromises, ...replacedPromises];

          Promise.all(newPromises).then(() => {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            protectVTree(newChildNode);
            unprotectVTree(oldChildNode);
          });

          if (newPromises.length) {
            promises.push(...newPromises);
          }
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          protectVTree(newChildNode);
          unprotectVTree(oldChildNode);
        }
      }
    }
  }

  return promises;
}

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  const { domNode, state, state: { measure }, patches } = transaction;

  measure('patch node');
  transaction.promises = patchNode$$1(patches, state).filter(Boolean);
  measure('patch node');
}

// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  const { promises = [] } = transaction;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(() => transaction.end());
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}



var tasks = Object.freeze({
	schedule: schedule,
	shouldUpdate: shouldUpdate,
	reconcileTrees: reconcileTrees,
	syncTrees: syncTrees,
	patchNode: patch,
	endAsPromise: endAsPromise
});

class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static renderNext(state) {
    // Still no next transaction, so can safely return early.
    if (!state.nextTransaction) {
      return;
    }

    // Create the next transaction.
    const { nextTransaction: { domNode, markup, options } } = state;
    state.nextTransaction = undefined;
    Transaction.create(domNode, markup, options).start();
  }

  static flow(transaction, tasks) {
    let retVal = transaction;

    // Execute each "task" serially, passing the transaction as a baton that
    // can be used to share state across the tasks.
    for (let i = 0; i < tasks.length; i++) {
      // If aborted, don't execute any more tasks.
      if (transaction.aborted) {
        return retVal;
      }

      // Run the task.
      retVal = tasks[i](transaction);

      // The last `returnValue` is what gets sent to the consumer. This
      // mechanism is crucial for the `abort`, if you want to modify the "flow"
      // that's fine, but you must ensure that your last task provides a
      // mechanism to know when the transaction completes. Something like
      // callbacks or a Promise.
      if (retVal !== undefined && retVal !== transaction) {
        return retVal;
      }
    }
  }

  static assert(transaction) {
    if (transaction.aborted && transaction.completed) {
      throw new Error('Transaction was previously aborted');
    } else if (transaction.completed) {
      throw new Error('Transaction was previously completed');
    }
  }

  static invokeMiddleware(transaction) {
    const { tasks } = transaction;

    MiddlewareCache.forEach(fn => {
      // Invoke all the middleware passing along this transaction as the only
      // argument. If they return a value (must be a function) it will be added
      // to the transaction task flow.
      const result = fn(transaction);

      if (result) {
        tasks.push(result);
      }
    });
  }

  constructor(domNode, markup, options) {
    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = StateCache.get(domNode) || {
      measure: measure(domNode, markup),
      internals
    };

    this.tasks = options.tasks || [schedule, shouldUpdate, reconcileTrees, syncTrees, patch, endAsPromise];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  start() {
    Transaction.assert(this);

    const { domNode, state: { measure: measure$$1 }, tasks } = this;
    const takeLastTask = tasks.pop();

    this.aborted = false;

    // Add middleware in as tasks.
    Transaction.invokeMiddleware(this);

    // Measure the render flow if the user wants to track performance.
    measure$$1('render');

    // Push back the last task as part of ending the flow.
    tasks.push(takeLastTask);

    return Transaction.flow(this, tasks);
  }

  // This will immediately call the last flow task and terminate the flow. We
  // call the last task to ensure that the control flow completes. This should
  // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
  // `return someValue` to provide the most accurate performance reading. This
  // doesn't matter practically besides that.
  abort() {
    const { state } = this;

    this.aborted = true;

    // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.
    return this.tasks[this.tasks.length - 1](this);
  }

  end() {
    const { state, domNode, options } = this;
    const { measure: measure$$1 } = state;
    const { inner } = options;

    this.completed = true;

    let renderScheduled = false;

    StateCache.forEach(cachedState => {
      if (cachedState.isRendering && cachedState !== state) {
        renderScheduled = true;
      }
    });

    // Don't attempt to clean memory if in the middle of another render.
    if (!renderScheduled) {
      cleanMemory();
    }

    // Mark the end to rendering.
    measure$$1('finalize');
    measure$$1('render');

    // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.
    state.previousMarkup = domNode[inner ? 'innerHTML' : 'outerHTML'];
    state.previousText = domNode.textContent;

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    // We are no longer rendering the previous transaction so set the state to
    // `false`.
    state.isRendering = false;

    // Try and render the next transaction if one has been saved.
    Transaction.renderNext(state);

    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }
}

const isAttributeEx = /(=|"|')[^><]*?$/;
const isTagEx = /(<|\/)/;
const TOKEN = '__DIFFHTML__';
/**
 * Get the next value from the list. If the next value is a string, make sure
 * it is escaped.
 *
 * @param {Array} values - Values extracted from tagged template literal
 * @return {String|*} - Escaped string, otherwise any value passed
 */
const nextValue = values => {
  const value = values.shift();
  return typeof value === 'string' ? decodeEntities(value) : value;
};

function handleTaggedTemplate(options, strings, ...values) {
  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings || !strings[0].length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    const childNodes = parse(strings[0]).childNodes;
    return childNodes.length > 1 ? createTree(childNodes) : childNodes[0];
  }

  // Used to store markup and tokens.
  let retVal = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  const supplemental = {
    attributes: {},
    children: {},
    tags: {}
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach((string, i) => {
    // Always add the string, we need it to parse the markup later.
    retVal += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      const value = nextValue(values);
      const lastSegment = string.split(' ').pop();
      const lastCharacter = lastSegment.trim().slice(-1);
      const isAttribute = Boolean(retVal.match(isAttributeEx));
      const isTag = Boolean(lastCharacter.match(isTagEx));
      const isString = typeof value === 'string';
      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);
      const token = TOKEN + i + '__';

      // Injected as attribute.
      if (isAttribute) {
        supplemental.attributes[i] = value;
        retVal += token;
      }
      // Injected as a tag.
      else if (isTag && !isString) {
          supplemental.tags[i] = value;
          retVal += token;
        }
        // Injected as a child node.
        else if (isArray || isObject) {
            supplemental.children[i] = createTree(value);
            retVal += token;
          }
          // Injected as something else in the markup or undefined, ignore
          // obviously falsy values used with boolean operators.
          else if (value !== null && value !== undefined && value !== false) {
              retVal += value;
            }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  const childNodes = parse(retVal, supplemental, options).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length > 1 ? createTree(childNodes) : childNodes[0];
}

// Loose mode (default)
const html$1 = (...args) => handleTaggedTemplate({}, ...args);

// Strict mode (optional enforcing closing tags)
html$1.strict = (...args) => handleTaggedTemplate({ strict: true }, ...args);

function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  middleware.subscribe && middleware.subscribe(use.diff);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe(use.diff);
  };
}

const VERSION = `${__VERSION__}-runtime`;

function outerHTML(element, markup = '', options = {}) {
  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

function innerHTML(element, markup = '', options = {}) {
  options.inner = true;
  return Transaction.create(element, markup, options).start();
}

function html(...args) {
  return createTree(...args);
}

// Public API. Passed to subscribed middleware.
const diff = {
  VERSION,
  addTransitionState,
  removeTransitionState,
  release,
  createTree,
  use,
  outerHTML,
  innerHTML,
  html,
  internals,
  tasks
};

// Ensure the `diff` property is nonenumerable so it doesn't show up in logs.
if (!use.diff) {
  Object.defineProperty(use, 'diff', { value: diff, enumerable: false });
}

exports.__VERSION__ = VERSION;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.release = release;
exports.createTree = createTree;
exports.use = use;
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.html = html;
exports['default'] = diff;

Object.defineProperty(exports, '__esModule', { value: true });

})));
