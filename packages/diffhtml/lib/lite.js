import createTree from './tree/create';
import internals from './util/internals';
import { $$diffHTML } from './util/symbols';
import globalThis from './util/global';
import innerHTML from './inner-html';
import outerHTML from './outer-html';
import release from './release';
import use from './use';
import { __VERSION__ } from './version';

const { assign } = Object;
const VERSION = `${__VERSION__}-lite`;

// Exposes the Internal APIs which may change. Once this project reaches a
// stable version, this will only be able to break between major versions.
assign(internals, {
  VERSION,
});

const api = {};

api.VERSION = VERSION;
api.release = release;
api.createTree = createTree;
api.use = use;
api.outerHTML = outerHTML;
api.innerHTML = innerHTML;
api.html = createTree;
api.Internals = internals;

// Bind the API into the global scope. Allows middleware and other code to
// reference the core API.
if ($$diffHTML in globalThis) {
  const existingApi = globalThis[$$diffHTML];

  if (VERSION !== existingApi.VERSION) {
    console.log(`Loaded ${VERSION} after ${existingApi.VERSION}`);
  }
}

globalThis[$$diffHTML] = api;

// Automatically hook up to DevTools if they are present.
if (globalThis.devTools) {
  globalThis.unsubscribeDevTools = use(globalThis.devTools(internals));
}

export {
  VERSION,
  release,
  createTree,
  use,
  outerHTML,
  innerHTML,
  createTree as html,
  internals as Internals,
};

export default api;
