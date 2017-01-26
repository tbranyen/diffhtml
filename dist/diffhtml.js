(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.diff = global.diff || {})));
}(this, (function (exports) { 'use strict';

// Associates DOM Nodes with state objects.
var StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
var NodeCache = new Map();

// Associates Virtual Tree Elements with Component instances.
var ComponentCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
var MiddlewareCache = new Set();

// Cache transition functions.
var TransitionCache = new Map();

// A modest size.
var size = 10000;

/**
 * Creates a pool to query new or reused values from.
 *
 * @param name
 * @param opts
 * @return {Object} pool
 */
var memory$1 = {
  free: new Set(),
  allocated: new Set(),
  protected: new Set(),
};

// Prime the memory cache with n objects.
for (var i = 0; i < size; i++) {
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
var freeValues = memory$1.free.values();

// Cache VTree objects in a pool which is used to get
var Pool = {
  size: size,
  memory: memory$1,

  get: function get() {
    var value = freeValues.next().value || {
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

  protect: function protect(value) {
    memory$1.allocated.delete(value);
    memory$1.protected.add(value);
  },

  unprotect: function unprotect(value) {
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

  for (var i = 0; i < vTree.childNodes.length; i++) {
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

  for (var i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory() {
  memory.allocated.forEach(function (vTree) { return memory.free.add(vTree); });
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  NodeCache.forEach(function (node, descriptor) {
    if (!memory.protected.has(descriptor)) {
      NodeCache.delete(descriptor);
    }
  });
}

// Namespace.
var namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
var elements = [
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

var forEach = Array.prototype.forEach;

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
var states = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: [],
};

// Define the custom signatures necessary for the loop to fill in the "magic"
// methods that process the transitions consistently.
var fnSignatures = {
  attached: function (el) { return function (cb) { return cb(el); }; },
  detached: function (el) { return function (cb) { return cb(el); }; },
  replaced: function (oldEl, newEl) { return function (cb) { return cb(oldEl, newEl); }; },
  textChanged: function (el, oldVal, newVal) { return function (cb) { return cb(el, oldVal, newVal); }; },
  attributeChanged: function (el, name, oldVal, newVal) { return function (cb) { return cb(
    el, name, oldVal, newVal
  ); }; },
};

var make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(function (stateName) {
  var mapFn = fnSignatures[stateName];

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
    forEach.call(elements, function (element) {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && element.nodeType !== 1) {
        return;
      }

      // Call the map function with each element.
      var newPromises = states[stateName].map(
        mapFn.apply(null, [element].concat(args))
      );

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](element.childNodes, args, promises);
      }
    });

    return promises.filter(function (promise) { return Boolean(promise && promise.then); });
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param allPromises
 */
function buildTrigger(allPromises) {
  var addPromises = allPromises.push.apply.bind(
    allPromises.push, allPromises
  );

  // This becomes `triggerTransition` in process.js.
  return function (stateName, makePromisesCallback, callback) {
    if (states[stateName] && states[stateName].length) {
      // Calls into each custom hook to bind Promises into the local array,
      // these will then get merged into the main `allPromises` array.
      var promises = makePromisesCallback([]);

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
  var elements = [].concat(args[0]);

  // Accepts the local Array of promises to use.
  return function (promises) { return make[stateName](elements, args.slice(1), promises); };
}

// Support loading diffHTML in non-browser environments.
var g = typeof global === 'object' ? global : window;
var element = g.document ? document.createElement('div') : null;

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
  return unescaped.replace(/["&'<>`]/g, function (match) { return ("&#" + (match.charCodeAt(0)) + ";"); });
}

var marks = new Map();
var prefix = 'diffHTML';
var token = 'diff_perf';

var hasSearch = typeof location !== 'undefined' && location.search;
var hasArguments = typeof process !== 'undefined' && process.argv;
var wantsSearch = hasSearch && location.search.includes(token);
var wantsArguments = hasArguments && process.argv.includes(token);
var wantsPerfChecks = wantsSearch || wantsArguments;
var nop = function () {};

var measure = function (domNode, vTree) {
  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) { return nop; }

  return function (name) {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = (domNode.host.constructor.name) + " " + name;
    }
    else if (typeof vTree.rawNodeName === 'function') {
      name = (vTreevTree.name) + " " + name;
    }

    var endName = name + "-end";

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    }
    else {
      var totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure((prefix + " " + name + " (" + totalMs + "ms)"), name, endName);
    }
  };
};

var isArray = Array.isArray;

function createTree(input, attributes, childNodes) {
  var rest = [], len = arguments.length - 3;
  while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

  var isNode = typeof input === 'object' && 'parentNode' in input;

  if (arguments.length === 1) {
    if (!input) {
      return null;
    }

    // If the first argument is an array, we assume this is a DOM fragment and
    // the array are the childNodes.
    if (isArray(input)) {
      return createTree('#document-fragment', input.map(function (vTree) {
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

        for (var i = 0; i < input.attributes.length; i++) {
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

          for (var i$1 = 0; i$1 < input.childNodes.length; i$1++) {
            if (input.childNodes[i$1]) {
              childNodes[i$1] = createTree(input.childNodes[i$1]);
            }
          }
        }
      }

      var vTree = createTree(input.nodeName, attributes, childNodes);
      NodeCache.set(vTree, input);
      return vTree;
    }

    // Assume any object value is a valid VTree object.
    if (typeof input === 'object') {
      return input;
    }

    // Assume it is a DOM Node.
    return createTree(String(input), null, null);
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes ].concat( rest);
  }

  // Allocate a new VTree from the pool.
  var entry = Pool.get();
  var isTextNode = input === '#text';

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
    var nodes$1 = arguments.length === 2 ? attributes : childNodes;
    var nodeValue = isArray(nodes$1) ? nodes$1.join('') : nodes$1;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

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

  var useAttributes = isArray(attributes) || typeof attributes !== 'object';
  var nodes = useAttributes ? attributes : childNodes;
  var nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (var i$2 = 0; i$2 < nodeArray.length; i$2++) {
      if (typeof nodeArray[i$2] === 'object') {
        entry.childNodes[i$2] = createTree(nodeArray[i$2]);
      }
      else {
        entry.childNodes[i$2] = createTree('#text', nodeArray[i$2]);
      }
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

var empty = null;

// Reuse these maps, it's more performant to clear them than recreate.
var oldKeys = new Map();
var newKeys = new Map();

var propToAttrMap = {
  className: 'class',
  htmlFor: 'for',
};

function syncTree(oldTree, newTree, patches) {
  if (!oldTree) { throw new Error('Missing existing tree to sync from'); }
  if (!newTree) { throw new Error('Missing new tree to sync into'); }

  var oldTreeName = oldTree.nodeName;
  var newTreeName = newTree.nodeName;

  if (oldTreeName !== newTreeName) {
    throw new Error(
      ("Sync failure, cannot compare " + newTreeName + " with " + oldTreeName)
    );
  }

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    TREE_OPS: [],
    NODE_VALUE: [],
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
  };

  var TREE_OPS = patches.TREE_OPS;
  var NODE_VALUE = patches.NODE_VALUE;
  var SET_ATTRIBUTE = patches.SET_ATTRIBUTE;
  var REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;

  // Build up a patchset object to use for tree operations.
  var patchset = {
    INSERT_BEFORE: empty,
    REMOVE_CHILD: empty,
    REPLACE_CHILD: empty,
  };

  var oldChildNodes = oldTree.childNodes;
  var newChildNodes = newTree.childNodes;

  // Determines if any of the elements have a key attribute. If so, then we can
  // safely assume keys are being used here for optimization/transition
  // purposes.
  var hasOldKeys = oldChildNodes.some(function (vTree) { return vTree.key; });
  var hasNewKeys = newChildNodes.some(function (vTree) { return vTree.key; });

  // If we are working with keys, we can follow an optimized path.
  if (hasOldKeys || hasNewKeys) {
    oldKeys.clear();
    newKeys.clear();

    // Put the old `childNode` VTree's into the key cache for lookup.
    for (var i = 0; i < oldChildNodes.length; i++) {
      var vTree = oldChildNodes[i];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree.key) {
        oldKeys.set(vTree.key, vTree);
      }
    }

    // Put the new `childNode` VTree's into the key cache for lookup.
    for (var i$1 = 0; i$1 < newChildNodes.length; i$1++) {
      var vTree$1 = newChildNodes[i$1];

      // Only add references if the key exists, otherwise ignore it. This
      // allows someone to specify a single key and keep that element around.
      if (vTree$1.key) {
        newKeys.set(vTree$1.key, vTree$1);
      }
    }

    // Do a single pass over the new child nodes.
    for (var i$2 = 0; i$2 < newChildNodes.length; i$2++) {
      var oldChildNode = oldChildNodes[i$2];
      var newChildNode = newChildNodes[i$2];

      var key = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        // Prefer an existing match to a brand new element.
        var newElement = null;

        // Prefer existing to new and remove from old position.
        if (oldKeys.has(key)) {
          newElement = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(newElement), 1);
        }
        else {
          newElement = newKeys.get(key);
        }

        if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push([oldTree, newElement]);
        oldChildNodes.push(newElement);
        continue;
      }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (key !== oldChildNode.key) {
        var newElement$1 = newChildNode;

        // Prefer existing to new and remove from old position.
        if (key && oldKeys.has(key)) {
          newElement$1 = oldKeys.get(key);
          oldChildNodes.splice(oldChildNodes.indexOf(newElement$1), 1);
        }
        else if (key) {
          newElement$1 = newKeys.get(key);
        }

        if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push([oldTree, newElement$1, oldChildNode]);
        oldChildNodes.splice(i$2, 0, newElement$1);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([newChildNode, oldChildNode]);
        oldTree.childNodes[i$2] = newChildNode;
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
    // Do a single pass over the new child nodes.
    for (var i$3 = 0; i$3 < newChildNodes.length; i$3++) {
      var oldChildNode$1 = oldChildNodes[i$3];
      var newChildNode$1 = newChildNodes[i$3];

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode$1) {
        if (patchset.INSERT_BEFORE === empty) { patchset.INSERT_BEFORE = []; }
        patchset.INSERT_BEFORE.push([oldTree, newChildNode$1]);
        oldChildNodes.push(newChildNode$1);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode$1.nodeName !== newChildNode$1.nodeName) {
        if (patchset.REPLACE_CHILD === empty) { patchset.REPLACE_CHILD = []; }
        patchset.REPLACE_CHILD.push([newChildNode$1, oldChildNode$1]);
        oldTree.childNodes[i$3] = newChildNode$1;
        continue;
      }

      syncTree(oldChildNode$1, newChildNode$1, patches);
    }
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (var i$4 = newChildNodes.length; i$4 < oldChildNodes.length; i$4++) {
      if (patchset.REMOVE_CHILD === empty) { patchset.REMOVE_CHILD = []; }
      patchset.REMOVE_CHILD.push(oldChildNodes[i$4]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // If both VTrees are text nodes and the values are different, change the
  // NODE_VALUE.
  if (oldTree.nodeName === '#text' && newTree.nodeName === '#text') {
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;
      NODE_VALUE.push(oldTree, oldTree.nodeValue);

      var INSERT_BEFORE$1 = patchset.INSERT_BEFORE;
      var REMOVE_CHILD$1 = patchset.REMOVE_CHILD;
      var REPLACE_CHILD$1 = patchset.REPLACE_CHILD;

      // We want to look if anything has changed, if nothing has we won't add
      // it to the patchset.
      if (INSERT_BEFORE$1 || REMOVE_CHILD$1 || REPLACE_CHILD$1) {
        TREE_OPS.push(patchset);
      }

      return patches;
    }
  }

  // Attributes are significantly easier than elements and we ignore checking
  // them on fragments. The algorithm is the same as elements, check for
  // additions/removals based off length, and then iterate once to make
  // adjustments.
  if (newTree.nodeType === 1) {
    var setAttributes = [];
    var removeAttributes = [];
    var oldAttributes = oldTree.attributes;
    var newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (var key$1 in newAttributes) {
      var value = newAttributes[key$1];

      if (key$1 in oldAttributes && oldAttributes[key$1] === newAttributes[key$1]) {
        continue;
      }

      oldTree.attributes[key$1] = value;

      // Alias prop names to attr names for patching purposes.
      if (key$1 in propToAttrMap) {
        key$1 = propToAttrMap[key$1];
      }

      SET_ATTRIBUTE.push(oldTree, key$1, value);
    }

    // Search for removals.
    for (var key$2 in oldAttributes) {
      if (key$2 in newAttributes) { continue; }
      REMOVE_ATTRIBUTE.push(oldTree, key$2);
      delete oldAttributes[key$2];
    }
  }

  var INSERT_BEFORE = patchset.INSERT_BEFORE;
  var REMOVE_CHILD = patchset.REMOVE_CHILD;
  var REPLACE_CHILD = patchset.REPLACE_CHILD;

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE || REMOVE_CHILD || REPLACE_CHILD) {
    TREE_OPS.push(patchset);
  }

  return patches;
}

// Code based off of:
// https://github.com/ashi009/node-fast-html-parser

// This is a very special word in the diffHTML parser. It is the only way it
// can gain access to dynamic content.
var TOKEN = '__DIFFHTML__';

var hasNonWhitespaceEx = /\S/;
var doctypeEx = /<!.*>/ig;
var attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
var spaceEx = /[^ ]/;

var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var selfClosing = new Set([
  'meta',
  'img',
  'link',
  'input',
  'area',
  'br',
  'hr' ]);

var kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true },
};

var kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true },
};

var flattenFragments = function (childNodes) {
  for (var i = 0; i < childNodes.length; i++) {
    var childNode = childNodes[i];

    if (childNode && childNode.nodeType === 11) {
      childNodes.splice.apply(childNodes, [ i, 1 ].concat( childNode.childNodes ));

      // Reset the loop.
      i = 0;
    }
    else if (childNode) {
      flattenFragments(childNode.childNodes);
    }
    else {
      childNodes.splice(i, 1);
    }
  }
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
var interpolateValues = function (currentParent, string, supplemental) {
  if (string && string.includes(TOKEN)) {
    var childNodes = [];

    // Break up the incoming string into dynamic parts that are then pushed
    // into a new set of child nodes.
    string.split(TOKEN).forEach(function (value, index, array) {
      // If the first text node has relevant text, put it in, otherwise
      // discard. This mimicks how the browser works and is generally easier
      // to work with (when using tagged template tags).
      if (value && hasNonWhitespaceEx.test(value)) {
        childNodes.push(createTree('#text', value));
      }

      // If we are in the second iteration, this means the whitespace has been
      // trimmed and we can pull out dynamic interpolated values. Flatten all
      // fragments found in the tree. They are used as containers and are not
      // reflected in the DOM Tree.
      childNodes.push(supplemental.children.shift());
      flattenFragments(childNodes);
    });

    currentParent.childNodes.push.apply(currentParent.childNodes, childNodes);
  }
  // If this is text and not a doctype, add as a text node.
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
var HTMLElement = function (nodeName, rawAttrs, supplemental) {
  // Support dynamic tag names like: `<${MyComponent} />`.
  if (nodeName === TOKEN) {
    return HTMLElement(supplemental.tags.shift(), rawAttrs, supplemental);
  }

  var attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  var loop = function ( match ) {
    var name = match[1];
    var value = match[6] || match[5] || match[4] || match[1];

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (value.indexOf(TOKEN) > -1 && value !== TOKEN) {
      attributes[name] = '';

      // Break the attribute down and replace each dynamic interpolation.
      value.split(TOKEN).forEach(function (part, index, array) {
        attributes[name] += part;

        // Only interpolate up to the last element.
        if (index !== array.length - 1) {
          attributes[name] += supplemental.attributes.shift();
        }
      });
    }
    else if (name === TOKEN) {
      var nameAndValue = supplemental.attributes.shift();

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
  };

  for (var match = (void 0); match = attrEx.exec(rawAttrs || ''); ) loop( match );

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

  var root = createTree('#document-fragment', null, []);
  var stack = [root];
  var currentParent = root;
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  var tagEx =
    /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

  // Look through the HTML markup for valid tags.
  for (var match = (void 0), text = (void 0); match = tagEx.exec(html); ) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);
        interpolateValues(currentParent, text, supplemental);
      }
    }

    var matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      var string = html.slice(0, matchOffset);

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
      var attrs = {};

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
        var closeMarkup = '</' + match[2] + '>';
        var index = html.indexOf(closeMarkup, tagEx.lastIndex);
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

        var newText = html.slice(match.index + match[0].length, index);

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
        var nodeName = currentParent.rawNodeName;

        // Find a subset of the markup passed in to validate.
        var markup = html.slice(
          tagEx.lastIndex - match[0].length
        ).split('\n').slice(0, 3);

        // Position the caret next to the first non-whitespace character.
        var caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        // Craft the warning message and inject it into the markup.
        markup.splice(1, 0, (caret + "\nPossibly invalid markup. Saw " + (match[2]) + ", expected " + nodeName + "...\n        "));

        // Throw an error message if the markup isn't what we expected.
        throw new Error(("\n\n" + (markup.join('\n'))));
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
          var value = supplemental.tags.shift();

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
          var tag = kElementsClosedByClosing[currentParent.rawNodeName];

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
  var remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  interpolateValues(currentParent, remainingText, supplemental);

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    var head = { before: [], after: [] };
    var body = { after: [] };
    var HTML = root.childNodes[0];

    var beforeHead = true;
    var beforeBody = true;

    // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.
    HTML.childNodes = HTML.childNodes.filter(function (el) {
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
      var headInstance = createTree('head', null, []);
      var existing = headInstance.childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    }
    else {
      var existing$1 = HTML.childNodes[0].childNodes;

      existing$1.unshift.apply(existing$1, head.before);
      existing$1.push.apply(existing$1, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      var bodyInstance = createTree('body', null, []);
      var existing$2 = bodyInstance.childNodes;

      existing$2.push.apply(existing$2, body.after);
      HTML.childNodes.push(bodyInstance);
    }
    else {
      var existing$3 = HTML.childNodes[1].childNodes;
      existing$3.push.apply(existing$3, body.after);
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
  var sameInnerHTML = inner ? previousMarkup === domNode.innerHTML : true;
  var sameOuterHTML = inner ? true : previousMarkup === domNode.outerHTML;
  var sameTextContent = previousText === domNode.textContent;

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
  //console.log(`Making ${vTree.nodeName}${JSON.stringify(vTree.attributes)}`);

  // If the DOM Node was already created, reuse the existing node.
  if (NodeCache.has(vTree)) {
    return NodeCache.get(vTree);
  }

  var nodeName = vTree.nodeName;
  var childNodes = vTree.childNodes;
  var attributes = vTree.attributes;
  var nodeValue = vTree.nodeValue;

  // Will vary based on the properties of the VTree.
  var domNode = null;

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
  var attributeNames = keys$2(attributes);

  // Copy all the attributes from the vTree into the newly created DOM
  // Node.
  var loop = function ( i ) {
    var name = attributeNames[i];
    var value = attributes[name];

    var isString = typeof value === 'string';
    var isBoolean = typeof value === 'boolean';
    var isNumber = typeof value === 'number';
    var isObject = typeof value === 'object';

    if (isObject && name === 'style') {
      Object.keys(value).forEach(function (name) { return (domNode.style[name] = value[name]); });
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
  };

  for (var i = 0; i < attributeNames.length; i++) loop( i );

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  if (ComponentCache.has(vTree)) {
    ComponentCache.get(vTree).domNode = domNode;
  }

  // Append all the children into the domNode, making sure to run them
  // through this `make` function as well.
  for (var i$1 = 0; i$1 < childNodes.length; i$1++) {
    domNode.appendChild(makeNode(childNodes[i$1]));
  }

  return domNode;
}

var blockText$1 = new Set(['script', 'noscript', 'style', 'code', 'template']);

function patchNode$$1(patches, state) {
  var promises = [];
  var TREE_OPS = patches.TREE_OPS;
  var NODE_VALUE = patches.NODE_VALUE;
  var SET_ATTRIBUTE = patches.SET_ATTRIBUTE;
  var REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;

  // First do all DOM tree operations, and then do attribute and node value.
  for (var i = 0; i < TREE_OPS.length; i++) {
    var ref = TREE_OPS[i];
    var INSERT_BEFORE = ref.INSERT_BEFORE;
    var REMOVE_CHILD = ref.REMOVE_CHILD;
    var REPLACE_CHILD = ref.REPLACE_CHILD;

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (var i$1 = 0; i$1 < INSERT_BEFORE.length; i$1++) {
        var ref$1 = INSERT_BEFORE[i$1];
        var vTree = ref$1[0];
        var childNodes = ref$1[1];
        var referenceNode = ref$1[2];
        var domNode = NodeCache.get(vTree);
        var refNode = referenceNode ? makeNode(referenceNode) : null;
        var fragment = null;

        if (referenceNode) {
          protectVTree(referenceNode);
        }

        if (childNodes.length) {
          fragment = document.createDocumentFragment();

          for (var i$2 = 0; i$2 < childNodes.length; i$2++) {
            fragment.appendChild(makeNode(childNodes[i$2]));
            protectVTree(childNodes[i$2]);
          }
        }
        else {
          fragment = makeNode(childNodes);
          protectVTree(childNodes);
        }

        domNode.insertBefore(fragment, refNode);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (var i$3 = 0; i$3 < REMOVE_CHILD.length; i$3++) {
        var childNode = REMOVE_CHILD[i$3];
        var domNode$1 = NodeCache.get(childNode);

        if (ComponentCache.has(childNode)) {
          ComponentCache.get(childNode).componentWillUnmount();
        }

        domNode$1.parentNode.removeChild(domNode$1);
        unprotectVTree(childNode);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (var i$4 = 0; i$4 < REPLACE_CHILD.length; i$4++) {
        var ref$2 = REPLACE_CHILD[i$4];
        var newChildNode = ref$2[0];
        var oldChildNode = ref$2[1];
        var oldDomNode = NodeCache.get(oldChildNode);
        var newDomNode = makeNode(newChildNode);

        oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
        protectVTree(newChildNode);
        unprotectVTree(oldChildNode);
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (var i$5 = 0; i$5 < NODE_VALUE.length; i$5 += 2) {
      var vTree$1 = NODE_VALUE[i$5];
      var nodeValue = NODE_VALUE[i$5 + 1];

      var domNode$2 = NodeCache.get(vTree$1);
      var ref$3 = domNode$2;
      var parentNode = ref$3.parentNode;

      if (nodeValue.includes('&')) {
        domNode$2.nodeValue = decodeEntities(nodeValue);
      }
      else {
        domNode$2.nodeValue = nodeValue;
      }

      if (parentNode) {
        if (blockText$1.has(parentNode.nodeName.toLowerCase())) {
          parentNode.nodeValue = nodeValue;
        }
      }
    }
  }

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (var i$6 = 0; i$6 < SET_ATTRIBUTE.length; i$6 += 3) {
      var vTree$2 = SET_ATTRIBUTE[i$6];
      var name = SET_ATTRIBUTE[i$6 + 1];
      var value = SET_ATTRIBUTE[i$6 + 2];

      var domNode$3 = NodeCache.get(vTree$2);
      var isObject = typeof value === 'object';
      var isFunction = typeof value === 'function';

      // Support patching an object representation of the style object.
      if (!isObject && !isFunction && name) {
        domNode$3.setAttribute(name, value);
      }
      else if (isObject && name === 'style') {
        var keys = Object.keys(value);

        for (var i$7 = 0; i$7 < keys.length; i$7++) {
          domNode$3.style[keys[i$7]] = value[keys[i$7]];
        }
      }
      else if (typeof value !== 'string') {
        // Necessary to track the attribute/prop existence.
        domNode$3.setAttribute(name, '');

        // Since this is a property value it gets set directly on the node.
        domNode$3[name] = value;
      }

      // Support live updating of the `value` and `checked` attribute.
      if (name === 'value' || name === 'checked') {
        domNode$3[name] = value;
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (var i$8 = 0; i$8 < REMOVE_ATTRIBUTE.length; i$8 += 2) {
      var vTree$3 = REMOVE_ATTRIBUTE[i$8];
      var attributes = REMOVE_ATTRIBUTE[i$8 + 1];

      var domNode$4 = NodeCache.get(vTree$3);

      for (var i$9 = 0; i$9 < attributes.length; i$9++) {
        var name$1 = attributes[i$9];

        domNode$4.removeAttribute(name$1);

        if (name$1 in domNode$4) {
          domNode$4[name$1] = undefined;
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
  var promises = transaction.promises; if ( promises === void 0 ) promises = [];

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(function () { return transaction.end(); });
  }
  else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}

var Transaction = function Transaction(domNode, markup, options) {
  this.domNode = domNode;
  this.markup = markup;
  this.options = options;

  this.state = StateCache.get(domNode) || {
    measure: measure(domNode, markup),
    internals: internals,
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
};

Transaction.create = function create (domNode, markup, options) {
  return new Transaction(domNode, markup, options);
};

Transaction.renderNext = function renderNext (state) {
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
};

Transaction.flow = function flow (transaction, tasks) {
  var retVal = transaction;

  // Execute each "task" serially, passing the transaction as a baton that
  // can be used to share state across the tasks.
  for (var i = 0; i < tasks.length; i++) {
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
};

Transaction.assert = function assert (transaction) {
  if (transaction.aborted && transaction.completed) {
    throw new Error('Transaction was previously aborted');
  }
  else if (transaction.completed) {
    throw new Error('Transaction was previously completed');
  }
};

Transaction.invokeMiddleware = function invokeMiddleware (transaction) {
  var tasks = transaction.tasks;

  MiddlewareCache.forEach(function (fn) {
    // Invoke all the middleware passing along this transaction as the only
    // argument. If they return a value (must be a function) it will be added
    // to the transaction task flow.
    var result = fn(transaction);

    if (result) {
      tasks.push(result);
    }
  });
};

Transaction.prototype.start = function start () {
  var ref = this;
    var domNode = ref.domNode;
    var measure$$1 = ref.state.measure;
    var tasks = ref.tasks;
  var takeLastTask = tasks.pop();

  // Add middleware in as tasks.
  Transaction.invokeMiddleware(this);

  // Measure the render flow if the user wants to track performance.
  measure$$1('render');

  // Push back the last task as part of ending the flow.
  tasks.push(takeLastTask);

  return Transaction.flow(this, tasks);
};

// This will immediately call the last flow task and terminate the flow. We
// call the last task to ensure that the control flow completes. This should
// end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
// `return someValue` to provide the most accurate performance reading. This
// doesn't matter practically besides that.
Transaction.prototype.abort = function abort () {
  var ref = this;
    var state = ref.state;

  this.aborted = true;

  // Grab the last task in the flow and return, this task will be responsible
  // for calling `transaction.end`.
  return this.tasks[this.tasks.length - 1](this);
};

Transaction.prototype.end = function end () {
    var this$1 = this;

  var ref = this;
    var state = ref.state;
    var domNode = ref.domNode;
    var options = ref.options;
  var measure$$1 = state.measure;
  var inner = options.inner;

  this.completed = true;

  var renderScheduled = false;

  StateCache.forEach(function (cachedState) {
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
  this.endedCallbacks.forEach(function (callback) { return callback(this$1); });
  this.endedCallbacks.clear();

  // We are no longer rendering the previous transaction so set the state to
  // `false`.
  state.isRendering = false;

  // Try and render the next transaction if one has been saved.
  Transaction.renderNext(state);

  return this;
};

Transaction.prototype.onceEnded = function onceEnded (callback) {
  this.endedCallbacks.add(callback);
};

// Available transition states.
var stateNames = [
  'attached',
  'detached',
  'replaced',
  'attributeChanged',
  'textChanged' ];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(function (stateName) { return TransitionCache.set(stateName, new Set()); });

function addTransitionState(stateName, callback) {
  if (!stateName) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (stateNames.indexOf(stateName) === -1) {
    throw new Error(("Invalid state name: " + stateName));
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
      throw new Error(("Invalid state name " + stateName));
    }

    TransitionCache.get(stateName).delete(callback);
  }
  else {
    for (var stateName$1 in stateNames) {
      if (TransitionCache.has(stateName$1)) {
        TransitionCache.get(stateName$1).clear();
      }
    }
  }
}

var isAttributeEx = /(=|"|')[^><]*?$/;
var isTagEx = /(<|\/)/;
var TOKEN$1 = '__DIFFHTML__';

/**
 * Get the next value from the list. If the next value is a string, make sure
 * it is escaped.
 *
 * @param {Array} values - Values extracted from tagged template literal
 * @return {String|*} - Escaped string, otherwise any value passed
 */
var nextValue = function (values) {
  var value = values.shift();
  return typeof value === 'string' ? escape(value) : value;
};

function handleTaggedTemplate(options, strings) {
  var values = [], len = arguments.length - 2;
  while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings[0].length && !values.length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    var childNodes$1 = parse(strings[0]).childNodes;
    return childNodes$1.length > 1 ? childNodes$1 : childNodes$1[0];
  }

  // Used to store markup and tokens.
  var retVal = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  var supplemental = {
    attributes: [],
    children: [],
    tags: [],
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach(function (string, i) {
    // Always add the string, we need it to parse the markup later.
    retVal += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      var value = nextValue(values);
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isAttribute = Boolean(retVal.match(isAttributeEx));
      var isTag = Boolean(lastCharacter.match(isTagEx));

      // Injected as attribute.
      if (isAttribute) {
        supplemental.attributes.push(value);
        retVal += TOKEN$1;
      }
      // Injected as tag.
      else if (isTag && typeof value !== 'string') {
        supplemental.tags.push(value);
        retVal += TOKEN$1;
      }
      // Injected as a child node.
      else if (Array.isArray(value) || typeof value === 'object') {
        supplemental.children.push(createTree(value));
        retVal += TOKEN$1;
      }
      // Injected as something else in the markup or undefined.
      else if (value !== null && value !== undefined) {
        retVal += decodeEntities(value);
      }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  var childNodes = parse(retVal, supplemental, options).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : childNodes;
}

// Loose mode (default)
var html = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return handleTaggedTemplate.apply(void 0, [ {} ].concat( args ));
};

// Strict mode (optional enforcing closing tags)
html.strict = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return handleTaggedTemplate.apply(void 0, [ { strict: true } ].concat( args ));
};

function release(domNode) {
  // Try and find a state object for this DOM Node.
  var state = StateCache.get(domNode);

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
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    middleware.unsubscribe && middleware.unsubscribe();
  };
}

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents. Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @example
 *
 *    import { outerHTML } from 'diffhtml';
 *
 *    // Remove all attributes and set the children to be a single text node
 *    // containing the text 'Hello world',
 *    outerHTML(document.body, '<body>Hello world</body>');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function outerHTML(element, markup, options) {
  if ( markup === void 0 ) markup='';
  if ( options === void 0 ) options={};

  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents. This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @example
 *
 *    import { innerHTML } from 'diffhtml';
 *
 *    // Sets the body children to be a single text node containing the text
 *    // 'Hello world'.
 *    innerHTML(document.body, 'Hello world');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
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
exports.html = html;
exports.release = release;
exports.createTree = createTree;
exports.use = use;

Object.defineProperty(exports, '__esModule', { value: true });

})));
