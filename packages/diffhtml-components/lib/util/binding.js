import globalThis from './global';
import { DIFF_BINDING } from './types';

/**
 * @returns {DIFF_BINDING}
 */
export default /** @type {DIFF_BINDING} */ (
  /** @type {any} */ (globalThis)[Symbol.for('diffHTML')]
);