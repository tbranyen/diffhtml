/** @type {unknown} */
export default typeof global === 'object' ? global : window || {};

export const bindingSymbol = Symbol.for('diffHTML');
