import Transaction, { defaultTasks } from './transaction';
import { VTreeLike } from './util/types';

/**
 *
 * @param {HTMLElement} domNode
 * @param {any[] | HTMLElement | string | VTreeLike | VTreeLike[]} markup
 * @param {*} options
 */
export default function outerHTML(domNode, markup='', options={}) {
  options.inner = false;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, markup, options).start();
}
