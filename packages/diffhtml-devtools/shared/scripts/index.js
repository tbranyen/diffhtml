import { Internals, outerHTML, html, use } from 'diffhtml';
import logger from 'diffhtml-middleware-logger';
import verifyState from 'diffhtml-middleware-verify-state';
import inlineTransitions from 'diffhtml-middleware-inline-transitions';

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
import './panels/health';
import './panels/settings';
import './panels/help';

const { stringify, parse } = JSON;
const { assign } = Object;
const background = chrome.runtime.connect({ name: 'devtools-page' });

use(inlineTransitions());
//use(logger());
//use(verifyState());

use({
  // When dark mode is set, automatically add Semantic UI `inverted` class.
  createTreeHook(vTree) {
    if (state.theme === 'dark') {
      if (vTree.attributes && vTree.attributes.class) {
        const attributes = vTree.attributes;

        if (attributes.class.includes('ui ') || attributes.class.includes(' ui')) {
          attributes.class += `${attributes.class} inverted`;
        }
      }
    }
  }
});

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
  memory: [],
  theme: chrome.devtools.panels.themeName,
  version: undefined,
};

let timeout = null;

const reactiveBinding = f => ({ set(t, p, v) { t[p] = v; f(); return !0; } });
const state = new Proxy(initialState, reactiveBinding(() => {
  clearTimeout(timeout);
  timeout = requestAnimationFrame(render);
}));

window.state = state;
window.onhashchange = () => state.activeRoute = location.hash;

const inspect = selector => chrome.devtools.inspectedWindow.eval(
  `inspect($$('${selector}')[0])`
);

const refresh = () => location.reload();

const clearEntries = () => {
  assign(state, {
    inProgress: [],
    completed: [],
  });
};

const fadeIn = el => {
  el.style.opacity = 0;

  return new Promise(resolve => el.animate([
    { opacity: 0 },
    { opacity: 1 },
  ], { duration: 240 }).onfinish = resolve)
    .then(() => {
      el.style.opacity = 1;
    });
};

const render = () => outerHTML(main, html`<main id="main" data-theme=${state.theme}>
  ${!state.version && html`
    <h1 id="not-found">Could not locate <img src="../icons/logo-48.png"> <strong>diffHTML</strong></h1>
  `}

  ${state.version && html`
    <devtools-split-view onattached=${fadeIn}>
      <devtools-navigation
        version=${state.version}
        activeRoute=${state.activeRoute}
      />

      <devtools-panels route="" activeRoute=${state.activeRoute}>
        <devtools-transactions-panel
          inProgress=${state.inProgress}
          completed=${state.completed}
          inspect=${inspect}
          clearEntries=${clearEntries}
          onattached=${fadeIn}
        />
      </devtools-panels>

      <devtools-panels route="#mounts" activeRoute=${state.activeRoute}>
        <devtools-mounts-panel mounts=${state.mounts} inspect=${inspect} />
      </devtools-panels>

      <devtools-panels route="#middleware" activeRoute=${state.activeRoute}>
        <devtools-middleware-panel middleware=${state.middleware} />
      </devtools-panels>

      <devtools-panels route="#health" activeRoute=${state.activeRoute}>
        <devtools-health-panel
          activeRoute=${state.activeRoute}
          memory=${state.memory}
        />
      </devtools-panels>

      <devtools-panels route="#settings" activeRoute=${state.activeRoute}>
        <devtools-settings-panel />
      </devtools-panels>
    </devtools-split-view>
  </main>`}
`).catch(ex => {
  throw ex;
});

const clone = x => parse(stringify(x));

background.onMessage.addListener(message => {
  switch (message.action) {
    case 'activated': {
      const clonedData = clone(message.data);

      assign(state, {
        ...clonedData,
        inProgress: clonedData.inProgress || state.inProgress,
        completed: clonedData.completed || state.completed,
        memory: state.memory.concat(clonedData.memory).filter(Boolean).slice(-1),
      });

      break;
    }

    case 'start': {
      state.inProgress = state.inProgress.concat(clone(message.data)).slice(-20);

      break;
    }

    case 'end': {
      const completeData = clone(message.data);

      state.inProgress = state.inProgress.filter(transaction => {
        return transaction.startDate !== completeData.startDate;
      });

      state.completed = state.completed.concat(completeData).slice(-20);

      break;
    }

    case 'ping': {
      const type = 'pong';

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { type }));
      });

      break;
    }
  }
});

render();
