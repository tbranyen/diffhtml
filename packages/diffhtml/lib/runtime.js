import createTree from './tree/create';
import release from './release';
import Transaction from './transaction';
import { addTransitionState, removeTransitionState } from './transition';
import use from './use';
import html from './html';
import * as internals from './util';
import * as tasks from './tasks';

const VERSION = `${__VERSION__}-runtime`;

function outerHTML(element, markup='', options={}) {
  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

function innerHTML(element, markup='', options={}) {
  options.inner = true;
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
  html,
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
  VERSION as __VERSION__,
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
