/** @type {any} */
export default (
  typeof global === 'object'
    ? global
    : (typeof window === 'object' ? window : self) || {}
);