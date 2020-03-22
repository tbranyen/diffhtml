import Transaction, { defaultTasks } from './transaction';
import { ValidInput, Options, Mount } from './util/types';

/**
 *
 * @param {Mount} domNode
 * @param {ValidInput} input
 * @param {Options} options
 */
export default function innerHTML(domNode, input = '', options = {}) {
  options.inner = true;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, input, options).start();
}