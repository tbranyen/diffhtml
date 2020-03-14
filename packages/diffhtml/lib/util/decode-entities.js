import globalThis from './global';

// Support loading diffHTML in non-browser environments.
const element = /** @type {any} */ (globalThis).document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param {string} string - Incoming string HTML
 * @return {string} Unescaped HTML
 */
export default function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}
