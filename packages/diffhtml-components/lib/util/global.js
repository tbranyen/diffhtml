/** @type {unknown} */
export default typeof global === 'object' ? global : (typeof window === 'object' ? window : self) || {};
