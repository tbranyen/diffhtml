import Transaction, { defaultTasks } from './transaction';

export default function innerHTML(domNode, markup='', options={}) {
  options.inner = true;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, markup, options).start();
}
