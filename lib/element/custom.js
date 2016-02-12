/**
 * Store all Custom Element definitions in this object. The tagName is the key.
 *
 * @public
 */
export var components = {};

/**
 * Ensures the element instance matches the CustomElement's prototype.
 *
 * @param tagName - The HTML tagName to use for the Custom Element
 * @param element - The element to upgrade
 * @return {Boolean} successfully upgraded
 */
export function upgrade(tagName, element) {
  var CustomElement = components[tagName];

  // If no Custom Element was registered, bail early. Don't need to upgrade
  // if the element was already processed..
  if (element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  element.__proto__ = Object.create(CustomElement.prototype);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // The upgrade was successful.
  return true;
}
