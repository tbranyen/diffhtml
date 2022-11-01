export default typeof process !== 'undefined' ? process : {
  env: /** @type {import('./types').Config} */({ NODE_ENV: 'development' }),
  argv: /** @type {string[]} */ ([]),
};