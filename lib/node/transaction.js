import patchNode from './patch';
import getFinalizeCallback from './finalize';
import makeTree from '../tree/make';
import syncTree from '../tree/sync';
import { createElement } from '../tree/helpers';
import { protectElement, unprotectElement } from '../util/memory';
import { parse } from '../util/parser';
import * as pools from '../util/pools';
import { MiddlewareCache, StateCache } from '../util/cache';

/**
 * If an existing transaction is rendering anywhere asynchronously, we need to
 * wait until it completes before this render can be executed. This buffers the
 * current transaction's arguments to be executed after the existing
 * transactions complete.
 *
 * @param {Object} transaction - The arguments necessary to create a transaction
 * @return {Boolean} - Is an existing transaction currently rendering?
 */
const setBufferState = (transaction) => {
  let isBufferSet = false;

  // If an existing render transaction state is rendering, buffer this
  // transaction.
  StateCache.forEach(state => {
    if (state.isRendering) {
      state.bufferedTransactions.push(transaction);
      isBufferSet = true;
    }
  });

  // Let the transaction scope know if it was buffered.
  return isBufferSet;
};

/**
 * Gets a Virtual Tree Element from the newHTML passed to a diff method.
 *
 * @param {String|Object} newHTML - HTML/DOM Node/Virtual Tree Element
 * @return {Object} - Virtual Tree Element
 */
const getTreeFromNewHTML = (newHTML, options, callback) => {
  // This is HTML Markup, so we need to parse it.
  if (typeof newHTML === 'string') {
    const silenceWarnings = options.silenceWarnings;
    const childNodes = parse(newHTML, null, { silenceWarnings }).childNodes;

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one.
    return callback(childNodes);
  }
  // This is a DOM Node, so we need to convert to a vTree.
  else if (newHTML.ownerDocument) {
    const newTree = makeTree(newHTML);

    if (newTree.nodeType === 11) {
      pools.elementObject.unprotect(newTree);
      return callback(newTree.childNodes);
    }

    return callback(newTree);
  }

  // This is a Virtual Tree Element, or something like it, so we can just pass
  // it along.
  return callback(newHTML);
};

/**
 * Creates a sequential render transaction on a DOM Node. This requires
 * checking for a previous render first. Since diffHTML is globally connected
 * (hopefully only running one copy...), this will prevent transitions from
 * interferring.
 *
 * @param node
 * @param newHTML
 * @param options
 */
export default function createTransaction(node, newHTML, options) {
  if (typeof node !== 'object') {
    throw new Error('Missing DOM Node object');
  }

  // Used to associate state with the currently rendering node. This
  // prevents attaching properties to the instance itself.
  const state = StateCache.get(node) || {
    // Set up an array for buffered transactions. This is used with
    // asynchronous renders using the transitions API.
    bufferedTransactions: [],
  };
  const isInner = options.inner;
  const previousMarkup = state.previousMarkup;
  const previousText = state.previousText;
  const bufferSet = setBufferState({ node, newHTML, options });

  // Associate the current render options with the DOM Node state.
  state.options = options;

  // Always ensure the most up-to-date state object is stored.
  StateCache.set(node, state);

  // Short circuit the rest of this render if we ended up having to set a
  // buffer. This happens when some other code using diffHTML is rendering
  // asynchronously (using transitions w/ Promise).
  if (bufferSet) { return; }

  // This looks for changes in the DOM from what we'd expect. This means we
  // need to rebuild the old Virtual Tree. This allows for keeping our tree in
  // sync with unexpected DOM changes. It's not very performant, so ideally you
  // should never change markup that diffHTML affects from outside of diffHTML
  // if performance is a concern.
  const sameInnerHTML = isInner ? previousMarkup === node.innerHTML : true;
  const sameOuterHTML = !isInner ? previousMarkup === node.outerHTML : true;
  const sameTextContent = previousText === node.textContent;

  // If the contents haven't changed, abort, since there is no point in
  // continuing. Only support this if the new markup is a string, otherwise
  // it's possible for our object recycling to match twice.
  if (typeof newHTML === 'string' && state.newHTML === newHTML) {
    return;
  }
  // Associate the last markup rendered with this node.
  else if (typeof newHTML === 'string') {
    state.newHTML = newHTML;
  }

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  const rebuildTree = () => {
    const oldTree = state.oldTree;

    if (oldTree) {
      unprotectElement(oldTree);
    }

    state.oldTree = protectElement(makeTree(node));
  };

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // We're rendering in the UI thread.
  state.isRendering = true;

  // Store all transaction starting middleware functions being executed here.
  const startTransactionMiddlewares = [];

  // Start off the middleware execution.
  MiddlewareCache.forEach(executeMiddleware => {
    // Pass the start transaction call with the input arguments.
    const result = executeMiddleware({ node, newHTML, options });

    if (result) {
      startTransactionMiddlewares.push(result);
    }
  });

  // Alias the `oldTree` off of state for parity.
  const oldTree = state.oldTree;

  // We need to ensure that our target to diff is a Virtual Tree Element. This
  // function takes in whatever `newHTML` is and normalizes to a tree object.
  // The callback function runs on every normalized Node to wrap childNodes
  // in the case of setting innerHTML.
  const newTree = getTreeFromNewHTML(newHTML, options, newTree => {
    if (isInner) {
      pools.elementObject.unprotect(newTree);

      const nodeName = state.oldTree.nodeName;
      const attributes = state.oldTree.attributes;

      return createElement(nodeName, attributes, newTree);
    }

    return Array.isArray(newTree) ? newTree[0] : newTree;
  });

  // Trigger any middleware with the DOM Node, old Virtual Tree Element, and
  // new Virtual Tree Element. This allows the middleware to mutate and inspect
  // the trees before they get consumed by diffHTML.
  const prePatchMiddlewares = [];

  // By exposing the internal tree synchronization and DOM Node patch methods,
  // a middleware could implement sync/patch on a separate thread.
  const transactionMethods = {
    syncTree,
    patchNode,
    protectElement,
    unprotectElement,
  };

  // Save the current transaction tree state and allow the mdidleware to
  // override the trees.
  const transactionState = {
    oldTree,
    newTree,
    transactionMethods,
  };

  // Run each middleware and pass the transaction state which contains internal
  // functions otherwise not available by the public API.
  for (let i = 0; i < startTransactionMiddlewares.length; i++) {
    // Pass the the existing Virtual Tree Element, and the new Virtual Tree
    // Element. This is triggered before the synchronization and patching has
    // occured.
    const result = startTransactionMiddlewares[i](transactionState);

    if (result) {
      prePatchMiddlewares.push(result);
    }
  }

  // Synchronize the trees, use any middleware replacements, if supplied.
  const patches = syncTree(transactionState.oldTree, transactionState.newTree);

  //console.log(JSON.stringify(patches, null, 2));

  // Apply the set of patches to the Node.
  const promises = patchNode(node, patches);

  // Trigger any middleware after syncing and patching the element. This is
  // mainly useful to get the Promises for something like devtools and patches
  // for something like logging.
  const postPatchMiddlewares = [];

  for (let i = 0; i < prePatchMiddlewares.length; i++) {
    // The DOM Node patching has finished and now we're sending the patchset
    // and the promises which can also be pushed into to do some asynchronous
    // behavior in a middleware.
    const result = prePatchMiddlewares[i]({
      patches,
      promises,
    });

    if (result) {
      postPatchMiddlewares.push(result);
    }
  }

  // Clean up and finalize this transaction. If there is another transaction,
  // get a callback to run once this completes to run it.
  const finalizeTransaction = getFinalizeCallback(node, state);

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter if
  // they are actually Promises or not, since they will all resolve eventually
  // with `Promise.all`.
  if (promises.length) {
    Promise.all(promises).then(() => finalizeTransaction(postPatchMiddlewares));
  }
  else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    finalizeTransaction(postPatchMiddlewares);
  }
}
