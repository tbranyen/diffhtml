import globalThis from './global';

// Safely lookup if we have access to a SCRIPT element for testing module support.
const element = /** @type {any} */ (globalThis).document
  ? /** @type {HTMLScriptElement} */ (document.createElement('script'))
  : null;

/**
 * Determines if the executing environment supports modules or not.
 *
 * @return {Boolean} - Whether or not modules are supported.
 */
export default function hasModule() {
  return Boolean(element && 'noModule' in element);
}
