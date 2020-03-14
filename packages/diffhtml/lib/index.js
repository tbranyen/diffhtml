import createTree from './tree/create';
import syncTree from './tree/sync';
import createNode from './node/create';
import parseNewTree from './tasks/parse-new-tree';
import reconcileTrees from './tasks/reconcile-trees';
import internals from './util/internals';
import parse from './util/parse';
import { PATCH_TYPE } from './util/types';
import innerHTML from './inner-html';
import outerHTML from './outer-html';
import { defaultTasks, tasks } from './transaction';
import html from './html';
import release from './release';
import use from './use';
import { addTransitionState, removeTransitionState } from './transition';
import { __VERSION__ as VERSION } from './version';

const { assign } = Object;

// At startup inject the HTML parser into the default set of tasks.
defaultTasks.splice(defaultTasks.indexOf(reconcileTrees), 0, parseNewTree);

// This is an internal API exported purely for middleware and extensions to
// leverage internal APIs that are not part of the public API. There are no
// promises that this will not break in the future. We will attempt to minimize
// changes and will supply fallbacks when APIs change.
//
// Note: The HTML parser is only available in this mode.
const Internals = assign(internals, {
  parse,
  defaultTasks,
  tasks,
  createNode,
  syncTree,
  PATCH_TYPE,
});

const api = {};

api.VERSION = VERSION;
api.addTransitionState = addTransitionState;
api.removeTransitionState = removeTransitionState;
api.release = release;
api.createTree = createTree;
api.use = use;
api.outerHTML = outerHTML;
api.innerHTML = innerHTML;
api.html = html;

// Attach a circular reference to `Internals` for ES/CJS builds.
api.Internals = Internals;

// Automatically hook up to DevTools if they are present.
/** @type {any} */
const global = window;

if (typeof global !== 'undefined' && typeof global.devTools !== 'undefined') {
  use(global.devTools(Internals));
  console.warn('diffHTML DevTools: Found and activated!');
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
  Internals,
};

export default api;
