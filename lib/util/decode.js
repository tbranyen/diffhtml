let element = document.createElement('div');

/**
 * Decode's HTML entities.
 *
 * @see http://stackoverflow.com/a/13091266
 * @param stringing
 * @return unescaped decoded HTML
 */
function decodeEntities(string) {
  // Escape HTML before decoding for HTML Entities
  var escaped = escape(string)
    .replace(/%26/g,'&')
    .replace(/%23/g,'#')
    .replace(/%3B/g,';');

  element.innerHTML = escaped;

  return unescape(element.textContent);
}

export default decodeEntities;
