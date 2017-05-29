import createTree from './tree/create';
import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import reconcileTrees from './tasks/reconcile-trees';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';
import bindInnerHTML from './inner-html';
import bindOuterHTML from './outer-html';
import html from './html';
import release from './release';
import use from './use';
import { addTransitionState, removeTransitionState } from './transition';
import { __VERSION__ } from './version';

const tasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise
];

const innerHTML = bindInnerHTML(tasks);
const outerHTML = bindOuterHTML(tasks);

const VERSION = __VERSION__;

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
  html,
};

export default diff;
