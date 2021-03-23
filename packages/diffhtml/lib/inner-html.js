import Transaction, { defaultTasks } from './transaction';
import { EMPTY, ValidInput, TransactionConfig, Mount } from './util/types';

/**
 *
 * @param {Mount} domNode
 * @param {ValidInput} input
 * @param {TransactionConfig} config
 *
 * @return {Promise<Transaction> | unknown}
 */
export default function innerHTML(domNode, input = EMPTY.STR, config = {}) {
  config.inner = true;
  config.executeScripts = 'executeScripts' in config ? config.executeScripts : true;
  config.tasks = config.tasks || defaultTasks;

  return Transaction.create(domNode, input, config).start();
}
