import globalThis from './global';

const { Internals } = globalThis[Symbol.for('diffHTML')];

(typeof window !== 'undefined' ? window : global).process = Internals.process;

export default Internals.process;
