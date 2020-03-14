import Transaction, { defaultTasks } from './transaction';
import { VTree } from './util/types';

/**
 *
 * @param {HTMLElement} domNode
 * @param {string | VTree} markup
 * @param {*} options
 */
export default function innerHTML(domNode, markup = '', options = {}) {
  options.inner = true;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, markup, options).start();
}
