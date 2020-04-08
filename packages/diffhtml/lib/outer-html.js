import Transaction, { defaultTasks } from './transaction';
import { ValidInput, Options, Mount } from './util/types';

/**
 *
 * @param {Mount} domNode
 * @param {ValidInput} input
 * @param {Options} options
 *
 * @return {Promise<Transaction> | unknown}
 */
export default function outerHTML(domNode, input = '', options = {}) {
  options.inner = false;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, input, options).start();
}
