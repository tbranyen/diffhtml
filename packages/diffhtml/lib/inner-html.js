import Transaction, { defaultTasks } from './transaction';

export default function innerHTML(element, markup='', options={}) {
  options.inner = true;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(element, markup, options).start();
}
