import { innerHTML, html, use } from 'diffhtml';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';
import logger from 'diffhtml-middleware-logger';
//import verifyState from 'diffhtml-middleware-verify-state';

// Components
import './components/panels';
import './components/footer';
import './components/split-view';
import './components/navigation';
import './components/transaction-row';

// Panels
import './panels/transactions';
import './panels/mounts';
import './panels/middleware';
import './panels/resources';
import './panels/help';
import './panels/settings';

const { assign } = Object;
const background = chrome.runtime.connect({ name: 'devtools-page' });

// Chrome extensions don't allow inline event handlers, so this middleware
// makes it easy to leverage event delegation instead.
use(syntheticEvents());
//use(verifyState({ debug: true }));

// Relay the tab ID to the background page
background.postMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: 'scripts/contentscript.js',
  name: 'init',
});

const initialState = {
  activeRoute: location.hash,
  inProgress: [],
  completed: [],
  middleware: [],
};

const reactiveBinding = f => ({ set(t, p, v) { t[p] = v; f(); return !0; } });
const state = new Proxy(initialState, reactiveBinding(() => render()));

window.onhashchange = () => state.activeRoute = location.hash;

const inspect = selector => chrome.devtools.inspectedWindow.eval(
  `inspect($$('${selector}')[0])`
);

const render = () => innerHTML(document.body, html`
  ${!state.version && html`
    <h1 id="not-found">&lt;/&gt; diffHTML middleware was <span class="not">not</span> found</h1>
  `}

  ${state.version && html`
    <devtools-split-view>
      <devtools-navigation activeRoute=${state.activeRoute} />

      <devtools-panels route="" activeRoute=${state.activeRoute}>
        <devtools-transactions-panel
          inProgress=${state.inProgress}
          completed=${state.completed}
          inspect=${inspect}
        />
      </devtools-panels>

      <devtools-panels route="#mounts" activeRoute=${state.activeRoute}>
        <devtools-mounts-panel mounts=${state.mounts} />
      </devtools-panels>

      <devtools-panels route="#middleware" activeRoute=${state.activeRoute}>
        <devtools-middleware-panel middleware=${state.middleware} />
      </devtools-panels>

      <devtools-panels route="#resources" activeRoute=${state.activeRoute}>
        <devtools-resources-panel />
      </devtools-panels>

      <devtools-panels route="#help" activeRoute=${state.activeRoute}>
        <devtools-help-panel />
      </devtools-panels>

      <devtools-panels route="#settings" activeRoute=${state.activeRoute}>
        <devtools-settings-panel />
      </devtools-panels>
    </devtools-split-view>

    <devtools-footer>Detected diffHTML version: ${state.version}</devtools-footer>
  `}
`)
.catch(ex => { throw ex; });

background.onMessage.addListener(message => {
  switch (message.action) {
    case 'activated': {
      assign(state, {
        inProgress: [],
        completed: [],
        version: message.data.VERSION,
        middleware: message.data.internals.MiddlewareCache,
        mounts: message.data.mounts,
      });

      break;
    }

    case 'start': {
      state.inProgress = state.inProgress.concat(message.data);
      break;
    }

    case 'end': {
      state.inProgress.shift();
      state.completed = state.completed.concat(message.data);
      break;
    }
  }
});

render();
