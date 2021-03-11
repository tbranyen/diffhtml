import globalThis from './global';
import { DIFF_BINDING } from './types';

/**
 * @returns {DIFF_BINDING}
 */
export function getBinding() {
  return /** @type {DIFF_BINDING} */ (
    /** @type {any} */ (globalThis)[Symbol.for('diffHTML')]
  );
}
