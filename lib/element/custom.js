/**
 * Store all custom elements in this object.
 */
export var components = {};

var empty = {};

export function upgrade(tagName, element) {
  var CustomElement = components[tagName] || empty;

  // No need to upgrade if already a subclass.
  if (element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  if (CustomElement !== empty) {
    element.__proto__ = CustomElement.prototype;
  }

  return true;
};
