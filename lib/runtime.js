import createTree from './tree/create';
import release from './release';
import Transaction from './transaction';
import { addTransitionState, removeTransitionState } from './transition';
import use from './use';

const VERSION = `${__VERSION__}-runtime`;

function outerHTML(element, markup='', options={}) {
  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

function innerHTML(element, markup='', options={}) {
  options.inner = true;
  return Transaction.create(element, markup, options).start();
}

function html(...args) {
  return createTree(...args);
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
};

// Ensure the `diff` property is nonenumerable so it doesn't show up in logs.
if (!use.diff) {
  Object.defineProperty(use, 'diff', { value: diff, enumerable: false });
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
