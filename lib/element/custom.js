/**
 * Store all custom elements in this object.
 */
export var components = {};

var empty = function() {};

/**
 * Ensures the element instance matches the CustomElement's prototype.
 *
 * @param tagName
 * @param element
 * @return {Boolean} successfully upgraded
 */
export function upgrade(tagName, element) {
  var CustomElement = components[tagName] || empty;

  // No need to upgrade if already a subclass.
  if (element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  if (CustomElement !== empty) {
    element.__proto__ = Object.create(CustomElement.prototype);
  }

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  return true;
}
