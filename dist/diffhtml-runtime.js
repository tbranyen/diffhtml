(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.diff = global.diff || {})));
}(this, (function (exports) { 'use strict';

// Associates DOM Nodes with state objects.
const StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
const NodeCache = new Map();

// Associates Virtual Tree Elements with Component instances.
const ComponentCache = new Map();

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
  protected: new Set(),
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
    attributes: {},
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
      attributes: {},
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
  },
};

var memory = Pool.memory;
var protect = Pool.protect;
var unprotect = Pool.unprotect;

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

  NodeCache.delete(vTree);
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
const elements = [
  'altGlyph',
  'altGlyphDef',
  'altGlyphItem',
  'animate',
  'animateColor',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'color-profile',
  'cursor',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'font',
  'font-face',
  'font-face-format',
  'font-face-name',
  'font-face-src',
  'font-face-uri',
  'foreignObject',
  'g',
  'glyph',
  'glyphRef',
  'hkern',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'missing-glyph',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'set',
  'stop',
  'svg',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tref',
  'tspan',
  'use',
  'view',
  'vkern' ];

const forEach = Array.prototype.forEach;

/**
 * Contains arrays to store transition callbacks.
 *
 * attached
 * --------
 *
 * For when elements come into the DOM. The callback triggers immediately after
 * the element enters the DOM. It is called with the element as the only
 * argument.
 *
 * detached
 * --------
 *
 * For when elements are removed from the DOM. The callback triggers just
 * before the element leaves the DOM. It is called with the element as the only
 * argument.
 *
 * replaced
 * --------
 *
 * For when elements are replaced in the DOM. The callback triggers after the
 * new element enters the DOM, and before the old element leaves. It is called
 * with old and new elements as arguments, in that order.
 *
 * attributeChanged
 * ----------------
 *
 * Triggered when an element's attribute has changed. The callback triggers
 * after the attribute has changed in the DOM. It is called with the element,
 * the attribute name, old value, and current value.
 *
 * textChanged
 * -----------
 *
 * Triggered when an element's `textContent` chnages. The callback triggers
 * after the textContent has changed in the DOM. It is called with the element,
 * the old value, and current value.
 */
const states = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: [],
};

// Define the custom signatures necessary for the loop to fill in the "magic"
// methods that process the transitions consistently.
const fnSignatures = {
  attached: el => cb => cb(el),
  detached: el => cb => cb(el),
  replaced: (oldEl, newEl) => cb => cb(oldEl, newEl),
  textChanged: (el, oldVal, newVal) => cb => cb(el, oldVal, newVal),
  attributeChanged: (el, name, oldVal, newVal) => cb => cb(
    el, name, oldVal, newVal
  ),
};

const make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(stateName => {
  const mapFn = fnSignatures[stateName];

  /**
   * Make's the transition promises.
   *
   * @param elements
   * @param args
   * @param promises
   */
  make[stateName] = function makeTransitionPromises(elements, args, promises) {
    // Sometimes an array-like is passed so using forEach in this manner yields
    // more consistent results.
    forEach.call(elements, element => {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && element.nodeType !== 1) {
        return;
      }

      // Call the map function with each element.
      const newPromises = states[stateName].map(
        mapFn.apply(null, [element].concat(args))
      );

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](element.childNodes, args, promises);
      }
    });

    return promises.filter(promise => Boolean(promise && promise.then));
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param allPromises
 */
function buildTrigger(allPromises) {
  const addPromises = allPromises.push.apply.bind(
    allPromises.push, allPromises
  );

  // This becomes `triggerTransition` in process.js.
  return (stateName, makePromisesCallback, callback) => {
    if (states[stateName] && states[stateName].length) {
      // Calls into each custom hook to bind Promises into the local array,
      // these will then get merged into the main `allPromises` array.
      const promises = makePromisesCallback([]);

      // Add these promises into the global cache.
      addPromises(promises);

      if (callback) {
        callback(promises.length ? promises : undefined);
      }
    }
    else if (callback) {
      callback();
    }
  };
}

/**
 * Make a reusable function for easy transition calling.
 *
 * @param stateName
 */
function makePromises(stateName) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  // Ensure elements is always an array.
  const elements = [].concat(args[0]);

  // Accepts the local Array of promises to use.
  return promises => make[stateName](elements, args.slice(1), promises);
}

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
  if (!element || !string || !string.indexOf || string.indexOf('&') === -1) {
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

var measure = (domNode, vTree) => {
  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) { return nop; }

  return name => {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = `${domNode.host.constructor.name} ${name}`;
    }
    else if (typeof vTree.rawNodeName === 'function') {
      name = `${vTreevTree.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    }
    else {
      const totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
  };
};

var isArray = Array.isArray;

function createTree(input, attributes, childNodes) {
  var rest = [], len = arguments.length - 3;
  while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

  const isNode = typeof input === 'object' && 'parentNode' in input;

  if (arguments.length === 1) {
    if (!input) {
      return null;
    }

    // If the first argument is an array, we assume this is a DOM fragment and
    // the array are the childNodes.
    if (isArray(input)) {
      return createTree('#document-fragment', input.map(vTree => {
        return createTree(vTree);
      }));
    }

    // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
    if (isNode) {
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
          var ref = input.attributes[i];
          var name = ref.name;
          var value = ref.value;

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
            if (input.childNodes[i]) {
              childNodes[i] = createTree(input.childNodes[i]);
            }
          }
        }
      }

      const vTree = createTree(input.nodeName, attributes, childNodes);
      NodeCache.set(vTree, input);
      return vTree;
    }

    // Assume any object value is a valid VTree object.
    if (typeof input === 'object') {
      return input;
    }

    // Assume it is text.
    return createTree('#text', String(input));
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes ].concat( rest);
  }

  // Allocate a new VTree from the pool.
  const entry = Pool.get();
  const isTextNode = input === '#text';

  entry.key = '';
  entry.rawNodeName = input;
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (typeof input === 'string') {
    entry.nodeName = input.toLowerCase();
  }
  else {
    entry.nodeName = '#document-fragment';
  }

  if (isTextNode) {
    const nodes = arguments.length === 2 ? attributes : childNodes;
    const nodeValue = isArray(nodes) ? nodes.join('') : nodes;

    entry.nodeType = 3;
    entry.nodeValue = escape(String(nodeValue || ''));

    return entry;
  }

  if (input === '#document-fragment') {
    entry.nodeType = 11;
  }
  else if (input === '#comment') {
    entry.nodeType = 8;
  }
  else {
    entry.nodeType = 1;
  }

  const useAttributes = isArray(attributes) || typeof attributes !== 'object';
  const nodes = useAttributes ? attributes : childNodes;
  const nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (let i = 0; i < nodeArray.length; i++) {
      entry.childNodes[i] = createTree(nodeArray[i]);
    }
  }

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // Set the key prop if passed as an attr.
  if (entry.attributes && entry.attributes.key) {
    entry.key = entry.attributes.key;
  }

  return entry;
}

const empty = null;
const oldKeys = new Map();
const newKeys = new Map();

function syncTree(oldTree, newTree) {
  if (!oldTree) { throw new Error('Missing existing tree to sync from'); }
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children. The
  // exception is if the `newTree` is a document fragment / shadow dom.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // Shallow clone the `newTree` into the `oldTree`. We want to get the same
    // references/values inside here.
    throw new Error('Unable to replace top level elements');
  }

  // Create new arrays for patches or use existing from a recursive call.
  const patches = arguments[2] || {
    TREE_OPERATIONS: [],
    NODE_VALUE: [],
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
  };

  var TREE_OPERATIONS = patches.TREE_OPERATIONS;
  var NODE_VALUE = patches.NODE_VALUE;
  var SET_ATTRIBUTE = patches.SET_ATTRIBUTE;
  var REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: empty,
    REMOVE_CHILD: empty,
    REPLACE_CHILD: empty,
  };

  var oldChildNodes = oldTree.childNodes;
  var newChildNodes = newTree.childNodes;

  debugger;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  const hasOldKeys = oldChildNodes.some(vTree => vTree.key);
  const hasNewKeys = newChildNodes.some(vTree => vTree.key);

  // Build up the key caches for each set of children.
  if (hasOldKeys && hasNewKeys) {
    oldKeys.clear();
    newKeys.clear();

    // Put the old `childNode` VTree's into the key cache for lookup.
    if (oldChildNodes.length) {
      for (let i = 0; i < oldChildNodes.length; i++) {
        const vTree = oldChildNodes[i];

        // Only add references if the key exists, otherwise ignore it. This
        // allows someone to specify a single key and keep that element around.
        if (vTree.key) {
          oldKeys.set(vTree.key, vTree);
        }
      }
    }

    // Put the new `childNode` VTree's into the key cache for lookup.
    if (newChildNodes.length) {
      for (let i = 0; i < newChildNodes.length; i++) {
        const vTree = newChildNodes[i];

        // Only add references if the key exists, otherwise ignore it. This
        // allows someone to specify a single key and keep that element around.
        if (vTree.key) {
          newKeys.set(vTree.key, vTree);
        }
      }
    }
  }

  // First check for new elements to add, this is the most common in my
  // experience.
  if (newChildNodes.length > oldChildNodes.length) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    const fragment = [];

    if (newChildNodes.length) {
      for (let i = oldChildNodes.length; i < newChildNodes.length; i++) {
        // Internally add to the tree.
        oldChildNodes.push(newChildNodes[i]);

        // Add to the document fragment.
        fragment.push(newChildNodes[i]);
      }
    }

    if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }

    // Assign the fragment to the patches to be injected.
    patchset.INSERT_BEFORE.push([oldTree, fragment]);
  }

  // Find elements to replace and remove.
  for (let i = 0; i < oldChildNodes.length; i++) {
    const oldChildNode = oldChildNodes[i];
    const newChildNode = newChildNodes[i];

    // If there was no new child to compare to, remove from the childNodes.
    if (!newChildNode) {
      if (patchset.REMOVE_CHILD === empty) { patchset.REMOVE_CHILD = []; }
      patchset.REMOVE_CHILD.push([oldTree, oldChildNode]);
      oldTree.childNodes.splice(i, 1);
      i--;
      continue;
    }

    const isOldInNewSet = newKeys.has(oldChildNode.key);
    const isNewInOldSet = oldKeys.has(newChildNode.key);
    const keyedNewChildNode = isOldInNewSet && newKeys.get(oldChildNode.key);
    const keyedOldChildNode = isNewInOldSet && oldKeys.get(newChildNode.key);
    const hasNoKeys = !hasOldKeys && !hasNewKeys;

    if (hasNoKeys && oldChildNode.nodeName !== newChildNode.nodeName) {
      if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
      patchset.REPLACE_CHILD.push([oldTree, newChildNode, oldChildNode]);
      oldTree.childNodes.splice(i, 1, newChildNode);
      continue;
    }

    // If using `keys` and this node exists in the new set, and is located at
    // the same index.
    if (!hasNoKeys && newChildNodes.indexOf(keyedNewChildNode) === i) {
      syncTree(oldChildNode, newChildNode, patches);
    }
    // If not using `keys` but the nodeNames match, sync the trees.
    else if (oldChildNode.nodeName === newChildNode.nodeName) {
      // Do not synchronize text nodes.
      syncTree(oldChildNode, newChildNode, patches);
    }
    // Replace the remaining elements, do not traverse further.
    else {
      // If we're using keys and we found a matching new node using the old key
      // we can do a direct replacement.
      if (keyedNewChildNode) {
        const newIndex = newChildNodes.indexOf(keyedNewChildNode);
        const prevTree = oldChildNodes[newIndex];

        oldChildNodes[i] = prevTree;
        oldChildNodes[newIndex] = oldChildNode;

        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([oldTree, oldChildNode, prevTree]);
        continue;
      }

      // If we're using keys and found a matching old node using the new key
      // we can do a direct replacement.
      if (keyedOldChildNode) {
        // Remove from old position.
        oldChildNodes.splice(oldChildNodes.indexOf(keyedOldChildNode), 1);

        const oldChildNode = oldChildNodes[i];

        // Assign to the new position.
        oldChildNodes[i] = keyedOldChildNode;

        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([oldTree, keyedOldChildNode, oldChildNode]);
      }

      if (!hasOldKeys && !hasNewKeys && oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([oldTree, newChildNode, oldChildNode]);
        oldTree.childNodes[i] = newChildNode;
        newChildNodes.splice(newChildNodes.indexOf(newChildNode), 1);
      }
    }
  }

  // If both VTrees are text nodes then copy the value over.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;
      NODE_VALUE.push([oldTree, decodeEntities(oldTree.nodeValue)]);
      TREE_OPERATIONS.push(patchset);
      return patches;
    }
  }

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (newTree.nodeType === 1) {
    const setAttributes = [];
    const removeAttributes = [];
    var oldAttributes = oldTree.attributes;
    var newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      oldTree.attributes[key] = value;
      setAttributes.push([key, value]);
    }

    // Search for removals.
    for (let key in oldAttributes) {
      if (key in newAttributes) { continue; }
      removeAttributes.push(key);
      delete oldAttributes[key];
    }

    if (setAttributes.length) {
      SET_ATTRIBUTE.push([oldTree, setAttributes]);
    }

    if (removeAttributes.length) {
      REMOVE_ATTRIBUTE.push([oldTree, removeAttributes]);
    }
  }

  // We want to look if anything has changed, if nothing has we'll splice out
  // the array to clean up the aptches array.
  var INSERT_BEFORE = patchset.INSERT_BEFORE;
  var REMOVE_CHILD = patchset.REMOVE_CHILD;
  var REPLACE_CHILD = patchset.REPLACE_CHILD;
  const treeHasChanged = INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD;

  // Remove the patch set if nothing changed.
  if (treeHasChanged) { TREE_OPERATIONS.push(patchset); }

  return patches;
}

// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

// This is a very special word in the diffHTML parser. It is the only way it
// can gain access to dynamic content.
const TOKEN = '__DIFFHTML__';

const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/ig;
const attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
const spaceEx = /[^ ]/;

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

const selfClosing = new Set([
  'meta',
  'img',
  'link',
  'input',
  'area',
  'br',
  'hr' ]);

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
    else if (name === TOKEN) {
      const nameAndValue = supplemental.attributes.shift();

      if (nameAndValue) {
        attributes[nameAndValue] = nameAndValue;
      }
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
function parse(html, supplemental, options) {
  if ( options === void 0 ) options = {};

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
        var ref = match[2];
        var length = ref.length;

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        }
        else {
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
        if (el.nodeName === 'head') { beforeHead = false; }
        if (el.nodeName === 'body') { beforeBody = false; }

        return true;
      }
      // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
        if (beforeHead && beforeBody) { head.before.push(el); }
        else if (!beforeHead && beforeBody) { head.after.push(el); }
        else if (!beforeBody) { body.after.push(el); }
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



var internals = Object.freeze({
	StateCache: StateCache,
	NodeCache: NodeCache,
	ComponentCache: ComponentCache,
	MiddlewareCache: MiddlewareCache,
	TransitionCache: TransitionCache,
	protectVTree: protectVTree,
	unprotectVTree: unprotectVTree,
	cleanMemory: cleanMemory,
	namespace: namespace,
	elements: elements,
	states: states,
	buildTrigger: buildTrigger,
	makePromises: makePromises,
	decodeEntities: decodeEntities,
	escape: escape,
	measure: measure,
	Pool: Pool,
	parse: parse
});

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
  var state = transaction.state;

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
  var markup = transaction.markup;
  var state = transaction.state;
  var measure = transaction.state.measure;

  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  }
  else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

//function reconcileComponents(oldTree, newTree) {
//  // Stateful components have a very limited API, designed to be fully
//  // implemented by a higher-level abstraction. The only method ever called
//  // is `render`. It is up to a higher level abstraction on how to handle the
//  // changes.
//  for (let i = 0; i < newTree.childNodes.length; i++) {
//    const oldChild = oldTree && oldTree.childNodes[i];
//    const newChild = newTree.childNodes[i];
//
//    // If incoming tree is a component, flatten down to tree for now.
//    if (newChild && typeof newChild.rawNodeName === 'function') {
//      const oldCtor = oldChild && oldChild.rawNodeName;
//      const newCtor = newChild.rawNodeName;
//      const children = newChild.childNodes;
//      const props = assign({}, newChild.attributes, { children });
//      const canNew = newCtor.prototype && newCtor.prototype.render;
//
//      // If the component has already been initialized, we can reuse it.
//      const oldInstance = oldCtor === newCtor && ComponentCache.get(oldChild);
//      const newInstance = !oldInstance && canNew && new newCtor(props);
//      const instance = oldInstance || newInstance;
//      const renderTree = createTree(
//        instance ? instance.render(props) : newCtor(props)
//      );
//
//      // Build a new tree from the render, and use this as the current tree.
//      newTree.childNodes[i] = renderTree;
//
//      // Cache this new current tree.
//      if (instance) {
//        ComponentCache.set(renderTree, instance);
//      }
//
//      // Recursively update trees.
//      reconcileComponents(oldChild, renderTree);
//    }
//    else {
//      reconcileComponents(oldChild, newChild);
//    }
//  }
//}

function reconcileTrees(transaction) {
  var state = transaction.state;
  var measure$$1 = transaction.state.measure;
  var domNode = transaction.domNode;
  var markup = transaction.markup;
  var options = transaction.options;
  var previousMarkup = state.previousMarkup;
  var previousText = state.previousText;
  var inner = options.inner;

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
    var ref = transaction.oldTree;
    var nodeName = ref.nodeName;
    var attributes = ref.attributes;
    transaction.newTree = createTree(nodeName, attributes, markup);
  }

  // Everything else gets passed into `createTree` to be figured out.
  else {
    transaction.newTree = createTree(markup);
  }

  // FIXME: Huge Hack at the moment to make it easier to work with components.
  //reconcileComponents(state.oldTree, transaction.newTree);

  measure$$1('reconcile trees');
}

function syncTrees(transaction) {
  var transaction_state = transaction.state;
  var measure = transaction_state.measure;
  var oldTree = transaction_state.oldTree;
  var newTree = transaction.newTree;

  measure('sync trees');
  transaction.patches = syncTree(oldTree, newTree);
  measure('sync trees');
}

var keys$2 = Object.keys;

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @return {Object} - A DOM Node matching the vTree
 */
function makeNode(vTree) {
  if (!vTree) {
    throw new Error('Missing VTree when trying to create DOM Node');
  }

  // If the DOM Node was already created, reuse the existing node.
  if (NodeCache.has(vTree)) {
    return NodeCache.get(vTree);
  }

  var nodeName = vTree.nodeName;
  var childNodes = vTree.childNodes;
  var attributes = vTree.attributes;
  var nodeValue = vTree.nodeValue;

  // Will vary based on the properties of the VTree.
  let domNode = null;

  // If we're dealing with a Text Node, we need to use the special DOM method,
  // since createElement does not understand the nodeName '#text'.
  // All other nodes can be created through createElement.
  if (nodeName === '#text') {
    domNode = document.createTextNode(decodeEntities(nodeValue));
  }
  // Support dynamically creating document fragments.
  else if (nodeName === '#document-fragment') {
    domNode = document.createDocumentFragment();
  }
  // If the nodeName matches any of the known SVG element names, mark it as
  // SVG. The reason for doing this over detecting if nested in an <svg>
  // element, is that we do not currently have circular dependencies in the
  // VTree, by avoiding parentNode, so there is no way to crawl up the parents.
  else if (elements.indexOf(nodeName) > -1) {
    domNode = document.createElementNS(namespace, nodeName);
  }
  // If not a Text or SVG Node, then create with the standard method.
  else {
    domNode = document.createElement(nodeName);
  }

  // Get an array of all the attribute names.
  const attributeNames = keys$2(attributes);

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.
  for (let i = 0; i < attributeNames.length; i++) {
    const name = attributeNames[i];
    const value = attributes[name];

    const isString = typeof value === 'string';
    const isBoolean = typeof value === 'boolean';
    const isNumber = typeof value === 'number';
    const isObject = typeof value === 'object';

    if (isObject && name === 'style') {
      Object.keys(value).forEach(name => (domNode.style[name] = value[name]));
    }
    // If not a dynamic type, set as an attribute, since it's a valid
    // attribute value.
    else if (name && (isString || isBoolean || isNumber)) {
      domNode.setAttribute(name, decodeEntities(value));
    }
    else if (name) {
      // Necessary to track the attribute/prop existence.
      domNode.setAttribute(name, '');

      // Since this is a dynamic value it gets set as a property.
      domNode[name] = value;
    }
  }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  if (ComponentCache.has(vTree)) {
    ComponentCache.get(vTree).domNode = domNode;
  }

  // Append all the children into the domNode, making sure to run them
  // through this `make` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(makeNode(childNodes[i]));
  }

  return domNode;
}

const blockText$1 = new Set(['script', 'noscript', 'style', 'code', 'template']);

function patchNode$$1(patches, state) {
  const promises = [];
  var NODE_VALUE = patches.NODE_VALUE;
  var SET_ATTRIBUTE = patches.SET_ATTRIBUTE;
  var REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;
  var TREE_OPERATIONS = patches.TREE_OPERATIONS;

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (let i = 0; i < NODE_VALUE.length; i++) {
      var ref = NODE_VALUE[i];
      var vTree = ref[0];
      var nodeValue = ref[1];
      const domNode = NodeCache.get(vTree);
      var parentNode = domNode.parentNode;

      domNode.nodeValue = nodeValue;

      if (parentNode) {
        var nodeName = parentNode.nodeName;

        if (blockText$1.has(nodeName.toLowerCase())) {
          parentNode.nodeValue = nodeValue;
        }
      }
    }
  }

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (let i = 0; i < SET_ATTRIBUTE.length; i++) {
      var ref$1 = SET_ATTRIBUTE[i];
      var vTree = ref$1[0];
      var attributes = ref$1[1];
      const domNode = NodeCache.get(vTree);

      for (let i = 0; i < attributes.length; i++) {
        var ref$2 = attributes[i];
        var name = ref$2[0];
        var value = ref$2[1];
        const isObject = typeof value === 'object';
        const isFunction = typeof value === 'function';

        if (isObject && name === 'style') {
          const keys = Object.keys(value);

          for (let i = 0; i < keys.length; i++) {
            domNode.style[keys[i]] = value[keys[i]];
          }
        }
        else if (!isObject && !isFunction && name) {
          domNode.setAttribute(name, decodeEntities(value));
        }
        else if (typeof value !== 'string') {
          // Necessary to track the attribute/prop existence.
          domNode.setAttribute(name, '');

          // Since this is a property value it gets set directly on the node.
          domNode[name] = value;
        }

        // Support live updating of the `value` and `checked` attribute.
        if (name === 'value' || name === 'checked') {
          domNode[name] = value;
        }
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i++) {
      var ref$3 = REMOVE_ATTRIBUTE[i];
      var vTree = ref$3[0];
      var attributes = ref$3[1];
      const domNode = NodeCache.get(vTree);

      for (let i = 0; i < attributes.length; i++) {
        const name = attributes[i];

        domNode.removeAttribute(name);

        if (name in domNode) {
          domNode[name] = undefined;
        }
      }
    }
  }

  // First do all DOM tree operations, and then do attribute and node value.
  for (let i = 0; i < TREE_OPERATIONS.length; i++) {
    var ref$4 = TREE_OPERATIONS[i];
    var INSERT_BEFORE = ref$4.INSERT_BEFORE;
    var REMOVE_CHILD = ref$4.REMOVE_CHILD;
    var REPLACE_CHILD = ref$4.REPLACE_CHILD;

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i++) {
        var ref$5 = INSERT_BEFORE[i];
        var vTree = ref$5[0];
        var childNodes = ref$5[1];
        var referenceNode = ref$5[2];
        const domNode = NodeCache.get(vTree);
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < childNodes.length; i++) {
          fragment.appendChild(makeNode(childNodes[i]));
        }

        protectVTree(vTree);
        domNode.insertBefore(fragment, referenceNode);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        var ref$6 = REMOVE_CHILD[i];
        var vTree = ref$6[0];
        var childNode = ref$6[1];
        const domNode = NodeCache.get(vTree);

        if (ComponentCache.has(childNode)) {
          ComponentCache.get(childNode).componentWillUnmount();
        }

        domNode.removeChild(NodeCache.get(childNode));
        unprotectVTree(childNode);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i++) {
        var ref$7 = REPLACE_CHILD[i];
        var vTree = ref$7[0];
        var newChildNode = ref$7[1];
        var oldChildNode = ref$7[2];
        const domNode = NodeCache.get(vTree);
        const oldDomNode = NodeCache.get(oldChildNode);
        const newDomNode = makeNode(newChildNode);

        domNode.replaceChild(newDomNode, oldDomNode);
        protectVTree(newChildNode);
        unprotectVTree(oldChildNode);
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
  var state = transaction.state;
  var measure = transaction.state.measure;
  var patches = transaction.patches;

  measure('patch node');
  transaction.promises = patchNode$$1(patches, state).filter(Boolean);
  measure('patch node');
}

// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  var promises = transaction.promises;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(() => transaction.end());
  }
  else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}

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
    var state_nextTransaction = state.nextTransaction;
    var domNode = state_nextTransaction.domNode;
    var markup = state_nextTransaction.markup;
    var options = state_nextTransaction.options;
    state.nextTransaction = undefined;
    Transaction.create(domNode, markup, options).start();
  }

  static flow(transaction, tasks) {
    // Execute each "task" serially, passing the transaction as a baton that
    // can be used to share state across the tasks.
    return tasks.reduce((retVal, task, index) => {
      // If aborted, don't execute any more tasks.
      if (transaction.aborted) {
        return retVal;
      }

      // Continue flow, so long as there was no return value, or it matches the
      // transaction.
      if (retVal === undefined || retVal === transaction) {
        return task(transaction);
      }

      // The last `returnValue` is what gets sent to the consumer. This
      // mechanism is crucial for the `abort`, if you want to modify the "flow"
      // that's fine, but you must ensure that your last task provides a
      // mechanism to know when the transaction completes. Something like
      // callbacks or a Promise.
      return retVal;
    }, transaction);
  }

  static assert(transaction) {
    if (transaction.aborted && transaction.completed) {
      throw new Error('Transaction was previously aborted');
    }
    else if (transaction.completed) {
      throw new Error('Transaction was previously completed');
    }
  }

  static invokeMiddleware(transaction) {
    var tasks = transaction.tasks;

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
      internals,
    };

    this.tasks = options.tasks || [
      schedule,
      shouldUpdate,
      reconcileTrees,
      syncTrees,
      patch,
      endAsPromise ];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  start() {
    var ref = this;
    var domNode = ref.domNode;
    var measure$$1 = ref.state.measure;
    var tasks = ref.tasks;

    const takeLastTask = tasks.pop();

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
    var ref = this;
    var state = ref.state;

    this.aborted = true;

    // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.
    return this.tasks[this.tasks.length - 1](this);
  }

  end() {
    var ref = this;
    var state = ref.state;
    var domNode = ref.domNode;
    var options = ref.options;
    var measure$$1 = state.measure;
    var inner = options.inner;

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

// Available transition states.
const stateNames = [
  'attached',
  'detached',
  'replaced',
  'attributeChanged',
  'textChanged' ];

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
  if (!callback && stateName) {
    TransitionCache.get(stateName).clear();
  }
  else if (stateName && callback) {
    // Not a valid state name.
    if (stateNames.indexOf(stateName) === -1) {
      throw new Error(`Invalid state name ${stateName}`);
    }

    TransitionCache.get(stateName).delete(callback);
  }
  else {
    for (let stateName in stateNames) {
      if (TransitionCache.has(stateName)) {
        TransitionCache.get(stateName).clear();
      }
    }
  }
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

function use(middleware) {
  if (typeof middleware !== 'function') {
    throw new Error('Middleware must be a function');
  }

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe();
  };
}

function outerHTML(element, markup, options) {
  if ( markup === void 0 ) markup='';
  if ( options === void 0 ) options={};

  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

function innerHTML(element, markup, options) {
  if ( markup === void 0 ) markup='';
  if ( options === void 0 ) options={};

  options.inner = true;
  return Transaction.create(element, markup, options).start();
}

exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.release = release;
exports.createTree = createTree;
exports.use = use;

Object.defineProperty(exports, '__esModule', { value: true });

})));
