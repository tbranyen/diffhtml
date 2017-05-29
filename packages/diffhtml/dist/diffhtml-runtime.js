(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.diff = global.diff || {})));
}(this, (function (exports) { 'use strict';

// Associates DOM Nodes with state objects.
const StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
const NodeCache$1 = new Map();

// Cache transition functions.
const TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
const MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();

// A modest size.
const size = 10000;

const free = new Set();
const allocate = new Set();
const protect = new Set();
const shape = () => ({
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: {}
});

// Creates a pool to query new or reused values from.
const memory = { free, allocated: allocate, protected: protect };

// Prime the free memory pool with VTrees.
for (let i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
let freeValues = free.values();

// Cache VTree objects in a pool which is used to get
var Pool = {
  size,
  memory,

  get() {
    const { value = shape(), done } = freeValues.next();

    // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.
    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },

  protect(value) {
    allocate.delete(value);
    protect.add(value);
  },

  unprotect(value) {
    if (protect.has(value)) {
      protect.delete(value);
      free.add(value);
    }
  }
};

const { CreateTreeHookCache } = MiddlewareCache;
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
      if (!newTree) {
        continue;
      }
      const isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...newTree.childNodes);
      } else {
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
    NodeCache$1.set(vTree, input);
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
  const isString = typeof input === 'string';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = isString ? input.toLowerCase() : '#document-fragment';
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

  if (input === fragmentName || typeof input !== 'string') {
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
  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  }

  let vTree = entry;

  CreateTreeHookCache.forEach((fn, retVal) => {
    // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.
    if (retVal = fn(vTree)) {
      vTree = retVal;
    }
  });

  return vTree;
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
    // Resolve an existing transaction that we're going to pave over in the
    // next statement.
    if (state.nextTransaction) {
      state.nextTransaction.promises[0].resolve(state.nextTransaction);
    }

    // Set a pointer to this current transaction to render immediatately after
    // the current transaction completes.
    state.nextTransaction = transaction;

    const deferred = {};
    const resolver = new Promise(resolve => deferred.resolve = resolve);

    resolver.resolve = deferred.resolve;
    transaction.promises = [resolver];

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

const normalize = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
};

Object.defineProperty({}, 'env', {
  enumerable: true,
  get: () => normalize.env
});

const { SyncTreeHookCache } = MiddlewareCache;
const empty = {};
const keyNames = ['old', 'new'];

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
function syncTree(oldTree, newTree, patches) {
  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;

  const oldNodeName = oldTree.nodeName;
  const newNodeName = newTree.nodeName;
  const isFragment = newTree.nodeType === 11;
  const isEmpty = oldTree === empty;

  // Reuse these maps, it's more efficient to clear them than to re-create.
  const keysLookup = { old: new Map(), new: new Map() };

  for (let i = 0; i < keyNames.length; i++) {
    const keyName = keyNames[i];
    const map = keysLookup[keyName];
    const vTree = arguments[i];
    const nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const vTree = nodes[i];

        if (vTree.key) {
          map.set(vTree.key, vTree);
        } else if (map.size && vTree.nodeType === 1) {
          
        }
      }
    }
  }

  // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.
  SyncTreeHookCache.forEach((fn, retVal) => {
    if (retVal = fn(oldTree, newTree, null)) {
      newTree = retVal;

      // Find attributes.
      syncTree(null, retVal, patches);
    }

    for (let i = 0; i < newTree.childNodes.length; i++) {
      const oldChildNode = isEmpty ? empty : oldTree.childNodes[i];
      const newChildNode = newTree.childNodes[i];

      if (retVal = fn(oldChildNode, newChildNode, keysLookup)) {
        newTree.childNodes[i] = retVal;
      }
    }
  });

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
    TREE_OPS: [],
    NODE_VALUE: []
  };

  const { SET_ATTRIBUTE, REMOVE_ATTRIBUTE, TREE_OPS, NODE_VALUE } = patches;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: [],
    REMOVE_CHILD: [],
    REPLACE_CHILD: []
  };

  // USED: INSERT_BEFORE: 3x, REMOVE_CHILD: 2x, REPLACE_CHILD: 3x.
  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;
  const isElement = newTree.nodeType === 1;

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newTree.nodeName === '#text') {
    // If there was no previous element to compare to, simply set the value
    // on the new node.
    if (oldTree.nodeName !== '#text') {
      NODE_VALUE.push(newTree, newTree.nodeValue, null);
    }
    // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
    else if (!isEmpty && oldTree.nodeValue !== newTree.nodeValue) {
        NODE_VALUE.push(oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
      }

    return patches;
  }

  // Seek out attribute changes first, but only from element Nodes.
  if (isElement) {
    const oldAttributes = isEmpty ? empty : oldTree.attributes;
    const newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      SET_ATTRIBUTE.push(isEmpty ? newTree : oldTree, key, value);
    }

    // Search for removals.
    if (!isEmpty) {
      for (let key in oldAttributes) {
        if (key in newAttributes) {
          continue;
        }
        REMOVE_ATTRIBUTE.push(oldTree, key);
        delete oldAttributes[key];
      }
    }
  }

  // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  if (isEmpty) {
    return patches;
  }

  const oldChildNodes = oldTree.childNodes;
  const newChildNodes = newTree.childNodes;

  // If we are working with keys, we can follow an optimized path.
  if (keysLookup.old.size || keysLookup.new.size) {
    const values = keysLookup.old.values();

    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      const oldChildNode = oldChildNodes[i];
      const newChildNode = newChildNodes[i];
      const newKey = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      const oldKey = oldChildNode.key;
      const oldInNew = keysLookup.new.has(oldKey);
      const newInOld = keysLookup.old.has(newKey);

      // Remove the old Node and insert the new node (aka replace).
      if (!oldInNew && !newInOld) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }
      // Remove the old node instead of replacing.
      else if (!oldInNew) {
          REMOVE_CHILD.push(oldChildNode);
          oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
          i = i - 1;
          continue;
        }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        let optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (newKey && newInOld) {
          optimalNewNode = keysLookup.old.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else if (newKey) {
          optimalNewNode = newChildNode;

          // Find attribute changes for this Node.
          syncTree(null, newChildNode, patches);
        }

        INSERT_BEFORE.push(oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(i, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
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
        const oldChildNode = oldChildNodes && oldChildNodes[i];
        const newChildNode = newChildNodes[i];

        // If there is no old element to compare to, this is a simple addition.
        if (!oldChildNode) {
          INSERT_BEFORE.push(oldTree, newChildNode, null);

          if (oldChildNodes) {
            oldChildNodes.push(newChildNode);
          }

          syncTree(null, newChildNode, patches);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (oldChildNode.nodeName !== newChildNode.nodeName) {
          REPLACE_CHILD.push(newChildNode, oldChildNode);
          oldTree.childNodes[i] = newChildNode;
          syncTree(null, newChildNode, patches);
          continue;
        }

        syncTree(oldChildNode, newChildNode, patches);
      }
    }

  // If there was no `oldTree` provided, we have sync'd all the attributes and
  // the node value of the `newTree` so we can early abort and not worry about
  // tree operations.
  if (isEmpty) {
    return patches;
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      REMOVE_CHILD.push(oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE.length || REMOVE_CHILD.length || REPLACE_CHILD.length) {
    // Null out the empty arrays.
    if (!INSERT_BEFORE.length) {
      patchset.INSERT_BEFORE = null;
    }
    if (!REMOVE_CHILD.length) {
      patchset.REMOVE_CHILD = null;
    }
    if (!REPLACE_CHILD.length) {
      patchset.REPLACE_CHILD = null;
    }

    TREE_OPS.push(patchset);
  }

  return patches;
}

// Namespace.
const namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
const elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

const { CreateNodeHookCache } = MiddlewareCache;

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @return {Object} - A DOM Node matching the vTree
 */
function createNode(vTree, ownerDocument = document) {
  const existingNode = NodeCache$1.get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  const { nodeName, childNodes = [] } = vTree;

  // Will vary based on the properties of the VTree.
  let domNode = null;

  CreateNodeHookCache.forEach((fn, retVal) => {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    if (retVal = fn(vTree)) {
      domNode = retVal;
    }
  });

  if (!domNode) {
    // Create empty text elements. They will get filled in during the patch
    // process.
    if (nodeName === '#text') {
      domNode = ownerDocument.createTextNode(vTree.nodeValue);
    }
    // Support dynamically creating document fragments.
    else if (nodeName === '#document-fragment') {
        domNode = ownerDocument.createDocumentFragment();
      }
      // If the nodeName matches any of the known SVG element names, mark it as
      // SVG. The reason for doing this over detecting if nested in an <svg>
      // element, is that we do not currently have circular dependencies in the
      // VTree, by avoiding parentNode, so there is no way to crawl up the
      // parents.
      else if (elements.indexOf(nodeName) > -1) {
          domNode = ownerDocument.createElementNS(namespace, nodeName);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(nodeName);
          }
  }

  // Add to the domNodes cache.
  NodeCache$1.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument));
  }

  return domNode;
}

const { memory: memory$1, protect: protect$1, unprotect } = Pool;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */
function protectVTree$1(vTree) {
  protect$1(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree$1(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
function unprotectVTree$1(vTree) {
  unprotect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree$1(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory(isBusy = false) {
  StateCache.forEach(state => isBusy = state.isRendering || isBusy);

  if (isBusy) {
    //return;
  }

  memory$1.allocated.forEach(vTree => memory$1.free.add(vTree));
  memory$1.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  NodeCache$1.forEach((node, descriptor) => {
    if (!memory$1.protected.has(descriptor)) {
      NodeCache$1.delete(descriptor);
    }
  });
}

function syncTrees(transaction) {
  const { state: { measure }, oldTree, newTree, domNode } = transaction;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    transaction.patches = {
      TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }],
      SET_ATTRIBUTE: [],
      REMOVE_ATTRIBUTE: [],
      NODE_VALUE: []
    };

    unprotectVTree$1(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    protectVTree$1(transaction.oldTree);

    // Update the StateCache since we are changing the top level element.
    StateCache.set(createNode(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = syncTree(oldTree, newTree);
    }

  measure('sync trees');
}

// Available transition states.
const stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(stateName => TransitionCache.set(stateName, new Set()));

function addTransitionState(stateName, callback) {
  TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (!callback && stateName) {
    TransitionCache.get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {
      TransitionCache.get(stateName).delete(callback);
    }
    // Remove all callbacks.
    else {
        for (let i = 0; i < stateNames.length; i++) {
          TransitionCache.get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName, ...args) {
  const set = TransitionCache.get(setName);
  const promises = [];

  if (!set.size) {
    return promises;
  }

  // Ignore text nodes.
  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  }

  // Run each transition callback, if on the attached/detached.
  set.forEach(callback => {
    const retVal = callback(...args);

    // Is a `thennable` object or Native Promise.
    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    const element = args[0];

    [...element.childNodes].forEach(childNode => {
      promises.push(...runTransitions(setName, childNode, ...args.slice(1)));
    });
  }

  return promises;
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
  return unescaped.replace(/[&<>]/g, match => `&#${match.charCodeAt(0)};`);
}

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

const removeAttribute = (domNode, name) => {
  domNode.removeAttribute(name);

  if (name in domNode) {
    domNode[name] = undefined;
  }
};

function patchNode(patches) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const _name = SET_ATTRIBUTE[i + 1];
      const value = decodeEntities(SET_ATTRIBUTE[i + 2]);

      const domNode = createNode(vTree);
      const attributeChanged = TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(_name);
      const newPromises = runTransitions('attributeChanged', domNode, _name, oldValue, value);

      // Triggered either synchronously or asynchronously depending on if a
      // transition was invoked.
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      const name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        const noValue = value === null || value === undefined;

        // Allow the user to find the real value in the DOM Node as a
        // property.
        try {
          domNode[name] = value;
        } catch (unhandledException) {}

        // Set the actual attribute, this will ensure attributes like
        // `autofocus` aren't reset by the property call above.
        domNode.setAttribute(name, noValue ? '' : value);
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

      if (newPromises.length) {
        promises.push(...newPromises);
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
      const vTree = REMOVE_ATTRIBUTE[i];
      const name = REMOVE_ATTRIBUTE[i + 1];

      const domNode = NodeCache$1.get(vTree);
      const attributeChanged = TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(name);
      const newPromises = runTransitions('attributeChanged', domNode, name, oldValue, null);

      if (newPromises.length) {
        Promise.all(newPromises).then(() => removeAttribute(domNode, name));
        promises.push(...newPromises);
      } else {
        removeAttribute(domNode, name);
      }
    }
  }

  // Once attributes have been synchronized into the DOM Nodes, assemble the
  // DOM Tree.
  for (let i = 0; i < TREE_OPS.length; i++) {
    const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
        const vTree = INSERT_BEFORE[i];
        const newTree = INSERT_BEFORE[i + 1];
        const referenceTree = INSERT_BEFORE[i + 2];

        const domNode = NodeCache$1.get(vTree);
        const referenceNode = referenceTree && createNode(referenceTree);
        const attached = TransitionCache.get('attached');

        if (referenceTree) {
          protectVTree$1(referenceTree);
        }

        const newNode = createNode(newTree);
        protectVTree$1(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        domNode.insertBefore(newNode, referenceNode);

        const attachedPromises = runTransitions('attached', newNode);

        promises.push(...attachedPromises);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const vTree = REMOVE_CHILD[i];
        const domNode = NodeCache$1.get(vTree);
        const detached = TransitionCache.get('detached');
        const detachedPromises = runTransitions('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree$1(vTree);
          });

          promises.push(...detachedPromises);
        } else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree$1(vTree);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
        const newTree = REPLACE_CHILD[i];
        const oldTree = REPLACE_CHILD[i + 1];

        const oldDomNode = NodeCache$1.get(oldTree);
        const newDomNode = createNode(newTree);
        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        protectVTree$1(newTree);

        const attachedPromises = runTransitions('attached', newDomNode);
        const detachedPromises = runTransitions('detached', oldDomNode);
        const replacedPromises = runTransitions('replaced', oldDomNode, newDomNode);
        const allPromises = [...attachedPromises, ...detachedPromises, ...replacedPromises];

        if (allPromises.length) {
          Promise.all(allPromises).then(() => {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            unprotectVTree$1(oldTree);
          });

          promises.push(...allPromises);
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          unprotectVTree$1(oldTree);
        }
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (let i = 0; i < NODE_VALUE.length; i += 3) {
      const vTree = NODE_VALUE[i];
      const nodeValue = NODE_VALUE[i + 1];
      const oldValue = NODE_VALUE[i + 2];
      const domNode = NodeCache$1.get(vTree);
      const textChanged = TransitionCache.get('textChanged');
      const textChangedPromises = runTransitions('textChanged', domNode, oldValue, nodeValue);

      const { parentNode } = domNode;

      if (nodeValue.includes('&')) {
        domNode.nodeValue = decodeEntities(nodeValue);
      } else {
        domNode.nodeValue = nodeValue;
      }

      if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = escape(decodeEntities(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push(...textChangedPromises);
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
  const { promises = [] } = transaction;

  measure('patch node');
  promises.push(...patchNode(patches, state));
  measure('patch node');

  transaction.promises = promises;
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

var parse = (() => console.log('Runtime is not built with parsing'));

function reconcileTrees$1(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup, measure } = state;
  const { inner } = options;

  measure('reconcile trees');

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      unprotectVTree$1(state.oldTree);
    }

    state.oldTree = createTree(domNode);
    NodeCache$1.set(state.oldTree, domNode);
    protectVTree$1(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    const { childNodes } = parse(markup, null, options);

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.
    transaction.newTree = createTree(inner ? childNodes : childNodes[0] || childNodes);
  }
  // Otherwise the value passed is a Virtual Tree or an Array.
  else {
      const { rawNodeName, nodeName, attributes } = transaction.oldTree;
      const newTree = createTree(markup);
      const isFragment = newTree.nodeType === 11;
      const isUnknown = typeof newTree.rawNodeName !== 'string';

      transaction.newTree = newTree;

      if (inner) {
        const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
        transaction.newTree = createTree(nodeName, attributes, children);
      }
    }

  measure('reconcile trees');
}

const marks = new Map();
const prefix = 'diffHTML';
const DIFF_PERF = 'diff_perf';

const hasSearch = typeof location !== 'undefined';
const hasArguments = typeof process !== 'undefined' && process.argv;
const nop = () => {};

var makeMeasure = ((domNode, vTree) => {
  // Check for these changes on every check.
  const wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  const wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  const wantsPerfChecks = wantsSearch || wantsArguments;

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
      name = `${vTree.rawNodeName.name} ${name}`;
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

class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static renderNext(state) {
    if (!state.nextTransaction) {
      return;
    }

    // Create the next transaction.
    const { nextTransaction, nextTransaction: { promises } } = state;
    const resolver = promises && promises[0];

    state.nextTransaction = undefined;
    nextTransaction.aborted = false;

    // Remove the last task, this has already been executed (via abort).
    nextTransaction.tasks.pop();

    // Reflow this transaction.
    Transaction.flow(nextTransaction, nextTransaction.tasks);

    // Wait for the promises to complete if they exist, otherwise resolve
    // immediately.
    if (promises && promises.length > 1) {
      Promise.all(promises.slice(1)).then(() => resolver.resolve());
    } else if (resolver) {
      resolver.resolve();
    }
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
      measure: makeMeasure(domNode, markup)
    };

    this.tasks = options.tasks || [schedule, shouldUpdate, reconcileTrees$1, syncTrees, patch, endAsPromise];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  start() {
    const { domNode, state: { measure }, tasks } = this;
    const takeLastTask = tasks.pop();

    this.aborted = false;

    // Add middleware in as tasks.
    Transaction.invokeMiddleware(this);

    // Measure the render flow if the user wants to track performance.
    measure('render');

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
    const { measure } = state;
    const { inner } = options;

    measure('finalize');

    this.completed = true;

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.
    state.previousMarkup = domNode.outerHTML;
    state.isRendering = false;

    // Clean up memory before rendering the next transaction, however if
    // another transaction is running concurrently this will be delayed until
    // the last render completes.
    cleanMemory();

    // Try and render the next transaction if one has been saved.
    Transaction.renderNext(state);

    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }
}

var bindInnerHTML = (tasks => function innerHTML(element, markup = '', options = {}) {
  options.inner = true;
  options.tasks = options.tasks || tasks;
  return Transaction.create(element, markup, options).start();
});

var bindOuterHTML = (tasks => function outerHTML(element, markup = '', options = {}) {
  options.inner = false;
  options.tasks = options.tasks || tasks;
  return Transaction.create(element, markup, options).start();
});

function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    unprotectVTree$1(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  StateCache.delete(domNode);

  // Recycle all unprotected objects.
  cleanMemory();
}

const {
  CreateTreeHookCache: CreateTreeHookCache$1,
  CreateNodeHookCache: CreateNodeHookCache$1,
  SyncTreeHookCache: SyncTreeHookCache$1
} = MiddlewareCache;

function use(middleware) {
  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook
  } = middleware;

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe(use.diff);

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache$1.add(createTreeHook);
  createNodeHook && CreateNodeHookCache$1.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache$1.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe(use.diff);

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache$1.delete(createTreeHook);
    CreateNodeHookCache$1.delete(createNodeHook);
    SyncTreeHookCache$1.delete(syncTreeHook);
  };
}

const __VERSION__ = '1.0.0-beta';

function reconcileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup, measure } = state;
  const { inner } = options;

  measure('reconcile trees');

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);
    }

    state.oldTree = createTree(domNode);
    NodeCache.set(state.oldTree, domNode);
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  const { rawNodeName, nodeName, attributes } = transaction.oldTree;
  const newTree = createTree(markup);
  const isFragment = newTree.nodeType === 11;
  const isUnknown = typeof newTree.rawNodeName !== 'string';

  transaction.newTree = newTree;

  if (inner) {
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
    transaction.newTree = createTree(nodeName, attributes, children);
  }

  measure('reconcile trees');
}

const tasks = [schedule, shouldUpdate, reconcileTrees, syncTrees, patch, endAsPromise];

const innerHTML = bindInnerHTML(tasks);
const outerHTML = bindOuterHTML(tasks);

const VERSION = `${__VERSION__}-runtime`;

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
  html: createTree,
  tasks
};

// Ensure the `diff` property is nonenumerable so it doesn't show up in logs.
if (!use.diff) {
  Object.defineProperty(use, 'diff', { value: diff, enumerable: false });
}

// Automatically hook up to DevTools if they are present.
if (typeof devTools === 'function') {
  use(devTools());
  console.info('diffHTML DevTools Found and Activated...');
}

exports.VERSION = VERSION;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.release = release;
exports.createTree = createTree;
exports.use = use;
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.html = createTree;
exports['default'] = diff;

Object.defineProperty(exports, '__esModule', { value: true });

})));
