import Transaction, { defaultTasks } from './transaction';
import { VTree } from './util/types';

/**
 *
 * @param {HTMLElement} domNode
 * @param {string | Partial<VTree> | HTMLElement} markup
 * @param {*} options
 */
export default function outerHTML(domNode, markup='', options={}) {
  options.inner = false;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, markup, options).start();
}
