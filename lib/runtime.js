import Transaction from './transaction';

export const __VERSION__ = `${__VERSION__}-runtime`;

export { addTransitionState } from './transition';
export { removeTransitionState } from './transition';
export { default as release } from './release';
export { default as createTree } from './tree/create';
export { default as use } from './use';

export function outerHTML(element, markup='', options={}) {
  options.inner = false;
  return Transaction.create(element, markup, options).start();
}

export function innerHTML(element, markup='', options={}) {
  options.inner = true;
  return Transaction.create(element, markup, options).start();
}
