import createTree from './tree/create';
import schedule from './tasks/schedule';
import shouldUpdate from './tasks/should-update';
import reconcileTrees from './tasks/reconcile-trees-for-runtime';
import syncTrees from './tasks/sync-trees';
import patchNode from './tasks/patch-node';
import endAsPromise from './tasks/end-as-promise';
import * as caches from './util/caches';
import bindInnerHTML from './inner-html';
import bindOuterHTML from './outer-html';
import release from './release';
import use from './use';
import { addTransitionState, removeTransitionState } from './transition';
import { __VERSION__ } from './version';

const defaultTasks = [
  schedule, shouldUpdate, reconcileTrees, syncTrees, patchNode, endAsPromise,
];

const innerHTML = bindInnerHTML(defaultTasks);
const outerHTML = bindOuterHTML(defaultTasks);
const VERSION = `${__VERSION__}-runtime`;

// Automatically hook up to DevTools if they are present.
if (typeof devTools.default === 'function') {
  use(devTools.default({
    VERSION,
    caches,
  }));

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

export default {
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
