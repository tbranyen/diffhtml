import { outerHTML, html, use } from 'diffhtml';
import inlineTransitions from 'diffhtml-middleware-inline-transitions';

// Components
import './components/panels';
import './components/footer';
import './components/split-view';
import './components/navigation';
import './components/transaction-row';
import './components/transaction-detail';
import './components/vtree';

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

//use(inlineTransitions());

use({
  // When dark mode is set, automatically add Semantic UI `inverted` class.
  createTreeHook(vTree) {
    if (state.theme === 'dark') {
      if (vTree.attributes && vTree.attributes.class) {
        const attributes = vTree.attributes;

        if (attributes.class === 'ui' || attributes.class.includes('ui ') || attributes.class.includes(' ui')) {
          attributes.class = `${attributes.class} inverted`;
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
  cancelAnimationFrame(timeout);
  timeout = requestAnimationFrame(render);
}));

window.state = state;
window.onhashchange = () => state.activeRoute = location.hash;

const inspect = selector => chrome.devtools.inspectedWindow.eval(
  `inspect($$('${selector}')[0])`
);

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
  ], { duration: 140 }).onfinish = resolve)
    .then(() => {
      el.style.opacity = 1;
    });
};

const render = () => outerHTML(main, html`<main id="main" data-theme=${state.theme}>
    <devtools-split-view onattached=${fadeIn}>
      ${Boolean(state.version) && html`
        <devtools-navigation
          activeRoute=${state.activeRoute}
        />
      `}

      <devtools-panels route="" activeRoute=${state.activeRoute}>
        <devtools-transactions-panel
          activeRoute=${state.activeRoute}
          inProgress=${state.inProgress}
          completed=${state.completed}
          inspect=${inspect}
          clearEntries=${clearEntries}
          onattached=${fadeIn}
        />
      </devtools-panels>

      <devtools-panels route="#mounts" activeRoute=${state.activeRoute}>
        <devtools-mounts-panel
          activeRoute=${state.activeRoute}
          mounts=${state.mounts}
          inspect=${inspect}
          theme=${state.theme}
        />
      </devtools-panels>

      <devtools-panels route="#middleware" activeRoute=${state.activeRoute}>
        <devtools-middleware-panel
          activeRoute=${state.activeRoute}
          middleware=${state.middleware}
        />
      </devtools-panels>

      <devtools-panels route="#health" activeRoute=${state.activeRoute}>
        <devtools-health-panel
          activeRoute=${state.activeRoute}
          memory=${state.memory}
        />
      </devtools-panels>

      <devtools-panels route="#settings" activeRoute=${state.activeRoute}>
        <devtools-settings-panel
          activeRoute=${state.activeRoute}
        />
      </devtools-panels>

      <devtools-panels route="#help" activeRoute=${state.activeRoute}>
        <devtools-help-panel
          activeRoute=${state.activeRoute}
          theme=${state.theme}
          version=${state.version}
        />
      </devtools-panels>
    </devtools-split-view>
  </main>`).catch(ex => {
  throw ex;
});

const clone = x => parse(stringify(x));

background.onMessage.addListener(unparsedMessage => {
  const message = parse(unparsedMessage);

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
      const inProgressData = clone(message.data);
      state.inProgress = [...state.inProgress, inProgressData];

      break;
    }

    case 'end': {
      const completeData = clone(message.data);

      state.inProgress = state.inProgress.filter(transaction => {
        return transaction.startDate !== completeData.startDate;
      });

      state.completed = [...state.completed, completeData];

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
