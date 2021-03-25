import Transaction, { defaultTasks } from './transaction';
import { EMPTY, ValidInput, TransactionConfig, Mount } from './util/types';

/**
 *
 * @param {Mount} mount
 * @param {ValidInput} input
 * @param {TransactionConfig} config
 *
 * @return {Promise<Transaction> | unknown}
 */
export default function innerHTML(mount, input = EMPTY.STR, config = {}) {
  config.inner = true;
  config.executeScripts = 'executeScripts' in config ? config.executeScripts : true;
  config.tasks = config.tasks || defaultTasks;

  return Transaction.create(mount, input, config).start();
}
