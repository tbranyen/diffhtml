import { getBinding } from './binding';

const { Internals } = getBinding();

/** @type {any} */ (typeof window !== 'undefined' ? window : global).process = Internals.process;

export default Internals.process;
