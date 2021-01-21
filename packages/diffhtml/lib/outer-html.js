import Transaction from './transaction';
import { EMPTY, ValidInput, TransactionConfig, Mount } from './util/types';

/**
 * @param {Mount} mount
 * @param {ValidInput} input
 * @param {TransactionConfig} config
 *
 * @return {Promise<Transaction> | unknown}
 */
export default function outerHTML(mount, input = EMPTY.STR, config = EMPTY.OBJ) {
  config.inner = false;
  return Transaction.create(mount, input, config).start();
}