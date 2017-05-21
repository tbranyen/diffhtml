const normalize = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' },
};

export default Object.defineProperty({}, 'env', {
  enumerable: true,
  get: () => normalize.env,
});
