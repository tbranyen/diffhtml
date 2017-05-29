import createTree from './tree/create';
import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';
import bindInnerHTML from './inner-html';
import bindOuterHTML from './outer-html';
import release from './release';
import use from './use';
import { addTransitionState, removeTransitionState } from './transition';
import { __VERSION__ } from './version';

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

const tasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
];

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
  tasks,
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

export {
  VERSION,
  addTransitionState,
  removeTransitionState,
  release,
  createTree,
  use,
  outerHTML,
  innerHTML,
  createTree as html,
};

export default diff;
