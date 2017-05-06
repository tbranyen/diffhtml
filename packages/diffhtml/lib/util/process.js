const FALLBACK_ENV = 'development';
const env = typeof process !== 'undefined' ? process.env : {
  NODE_ENV: FALLBACK_ENV,
};

export default {
  env: { NODE_ENV: env.NODE_ENV || FALLBACK_ENV },
};
