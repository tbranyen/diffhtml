import Transaction, { defaultTasks } from './transaction';

export default function outerHTML(element, markup='', options={}) {
  options.inner = false;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(element, markup, options).start();
}
