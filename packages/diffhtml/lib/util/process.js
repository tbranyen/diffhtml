const NODE_ENV = 'development';
const _process = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV },
};

export default Object.defineProperty({}, 'env', { get: () => _process.env });
