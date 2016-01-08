let element = document.createElement('div');

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/13091266
 * @param stringing
 * @return unescaped HTML
 */
export function decodeEntities(string) {
  element.innerHTML = string;
  return element.textContent;
}
