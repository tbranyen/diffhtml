var counter = 0;

/**
 * Generates a unique id.
 *
 * @return {string} uuid
 */
export function uuid() {
  return String(++counter);
}
