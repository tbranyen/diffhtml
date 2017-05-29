import Transaction from './transaction';

export default tasks => function outerHTML(element, markup='', options={}) {
  options.inner = false;
  options.tasks = options.tasks || [...tasks];
  return Transaction.create(element, markup, options).start();
}
