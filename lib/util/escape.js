/**
 * Tiny HTML escaping function.
 *
 * @param str unescaped
 * @return {String} escaped
 */
export default function escape(str) {
  return str.replace(/["&'<>`]/g, match => `&#${match.charCodeAt(0)};`);
}
