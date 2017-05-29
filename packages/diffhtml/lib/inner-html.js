import Transaction from './transaction';

export default tasks => function innerHTML(element, markup='', options={}) {
  options.inner = true;
  options.tasks = [].concat(options.tasks || tasks);
  return Transaction.create(element, markup, options).start();
}
