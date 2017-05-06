import createTree from './tree/create';
import release from './release';
import Transaction from './transaction';
import { addTransitionState, removeTransitionState } from './transition';
import use from './use';

import {
  StateCache,
  TreePointerCache,
  NodeCache,
  TransitionCache,
  MiddlewareCache,
} from './util/caches';
import { protectVTree, unprotectVTree, cleanMemory } from './util/memory';
import { namespace, elements } from './util/svg';
import decodeEntities from './util/decode-entities';
import escape from './util/escape';
import makeMeasure from './util/performance';
import Pool from './util/pool';
import process from './util/process';

import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';

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

const internals = {
  StateCache, TreePointerCache, NodeCache, TransitionCache, MiddlewareCache,
  protectVTree, unprotectVTree, cleanMemory, namespace, elements,
  decodeEntities, escape, makeMeasure, Pool,
};

const tasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
];

const VERSION = `1.0.0-beta-runtime`;

function outerHTML(element, markup='', options={}) {
  options.inner = false;
  options.tasks = options.tasks || tasks;
  return Transaction.create(element, markup, options).start();
}

function innerHTML(element, markup='', options={}) {
  options.inner = true;
  options.tasks = options.tasks || tasks;
  return Transaction.create(element, markup, options).start();
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
  html: createTree,
  internals,
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
