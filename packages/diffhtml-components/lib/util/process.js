import diff from './binding';

const { Internals } = diff;

/** @type {any} */ (typeof window !== 'undefined' ? window : global).process = Internals.process;

export default Internals.process;
