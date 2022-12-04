import createTree from './tree/create';
import parseNewTree from './tasks/parse-new-tree';
import reconcileTrees from './tasks/reconcile-trees';
import Internals from './util/internals';
import parse from './util/parse';
import { $$diffHTML } from './util/symbols';
import globalThis from './util/global';
import innerHTML from './inner-html';
import outerHTML from './outer-html';
import toString from './to-string';
import { defaultTasks } from './transaction';
import html from './html';
import release from './release';
import use from './use';
import { __VERSION__ as VERSION } from './version';

// At startup inject the HTML parser into the default set of tasks.
defaultTasks.splice(defaultTasks.indexOf(reconcileTrees), 0, parseNewTree);

Internals['VERSION'] = VERSION;
Internals['parse'] = parse;

// Build up the full public API.
const api = {};

api['VERSION'] = VERSION;
api['release'] = release;
api['createTree'] = createTree;
api['use'] = use;
api['outerHTML'] = outerHTML;
api['innerHTML'] = innerHTML;
api['toString'] = toString;
api['html'] = html;
api['Internals'] = Internals;

// Bind the API into the global scope. Allows middleware and other code to
// reference the core API. Once import maps are more mainstream, we can
// deprecate this.
if ($$diffHTML in globalThis) {
  const existingApi = globalThis[$$diffHTML];

  if (VERSION !== existingApi['VERSION']) {
    console.log(`Loaded ${VERSION} after ${existingApi.VERSION}`);
  }
}

globalThis[$$diffHTML] = api;

// Automatically hook up to DevTools if they are present.
if (globalThis.devTools) {
  globalThis.unsubscribeDevTools = use(globalThis.devTools(Internals));
}

export {
  VERSION,
  release,
  createTree,
  use,
  outerHTML,
  innerHTML,
  toString,
  html,
  Internals,
};

export default api;
