import { Internals } from 'diffhtml';

(typeof window !== 'undefined' ? window : global).process = Internals.process;

export default Internals.process;
