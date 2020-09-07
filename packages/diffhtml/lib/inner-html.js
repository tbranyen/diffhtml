import Transaction, { defaultTasks } from './transaction';
import { EMPTY, ValidInput, Options, Mount } from './util/types';

/**
 *
 * @param {Mount} domNode
 * @param {ValidInput} input
 * @param {Options} options
 *
 * @return {Promise<Transaction> | unknown}
 */
export default function innerHTML(domNode, input = EMPTY.STR, options = EMPTY.OBJ) {
  options.inner = true;
  options.executeScripts = 'executeScripts' in options ? options.executeScripts : true;
  options.tasks = options.tasks || defaultTasks;

  return Transaction.create(domNode, input, options).start();
}