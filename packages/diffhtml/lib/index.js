import createTree from './tree/create';
import parseNewTree from './tasks/parse-new-tree';
import reconcileTrees from './tasks/reconcile-trees';
import internals from './util/internals';
import parse from './util/parse';
import globalThis from './util/global';
import innerHTML from './inner-html';
import outerHTML from './outer-html';
import { defaultTasks, tasks } from './transaction';
import html from './html';
import release from './release';
import use from './use';
import { addTransitionState, removeTransitionState } from './transition';
import { __VERSION__ as VERSION } from './version';

// At startup inject the HTML parser into the default set of tasks.
defaultTasks.splice(defaultTasks.indexOf(reconcileTrees), 0, parseNewTree);

// Exposes the Internal APIs which may change. Once this project reaches a
// stable version, this will only be able to break between major versions.
const Internals = {
  ...internals,

  parse,
  defaultTasks,
  tasks,
  VERSION,
};

// Build up the full public API.
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
api.Internals = Internals;

/** @type {any} */
const global = globalThis;

// Automatically hook up to DevTools if they are present.
if (global.devTools) {
  global.unsubscribeDevTools = use(global.devTools(Internals));
}

// Bind the API into the global scope. Allows middleware and other code to
// reference the core API.
global[Symbol.for('diffHTML')] = api;

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
