import Transaction, { defaultTasks } from './transaction';

export default function outerHTML(domNode, markup='', options={}) {
  options.inner = false;
  options.tasks = options.tasks || defaultTasks;
  return Transaction.create(domNode, markup, options).start();
}
