/**
 * Tiny HTML escaping function, useful to prevent things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
export default function escape(unescaped) {
  return unescaped.replace(/["&'<>`]/g, match => `&#${match.charCodeAt(0)};`);
}
