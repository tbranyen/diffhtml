/**
 * Store all Custom Element definitions in this object. The tagName is the key.
 *
 * @public
 */
export const components = {};

/**
 * Ensures the element instance matches the CustomElement's prototype.
 *
 * @param nodeName - The HTML nodeName to use for the Custom Element
 * @param element - The element to upgrade
 * @param descriptor - The virtual node backing the element
 * @return {Boolean} successfully upgraded
 */
export function upgrade(nodeName, element, descriptor) {
  // Value of the `is` attribute, if it exists.
  var isAttr = null;

  // Check for the `is` attribute. It has a known bug where it cannot be
  // applied dynamically.
  if (!components[nodeName] && Array.isArray(descriptor.attributes)) {
    descriptor.attributes.some((attr, idx) => {
      if (attr.name === 'is') {
        isAttr = attr.value;
        return true;
      }
    });
  }

  // Hack around the `is` attribute being unable to be set dynamically.
  if (isAttr && components[isAttr]) {
    nodeName = isAttr;
  }

  var CustomElement = components[nodeName];

  if (!CustomElement) {
    return false;
  }

  if (CustomElement.extends && CustomElement.extends !== descriptor.nodeName) {
    return false;
  }

  // If no Custom Element was registered, bail early. Don't need to upgrade
  // if the element was already processed..
  if (typeof CustomElement === 'function' && element instanceof CustomElement) {
    return false;
  }

  // Copy the prototype into the Element.
  element.__proto__ = Object.create(CustomElement.prototype);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // Is the element existing in the DOM?
  var inDOM = element.ownerDocument.contains(element);

  // If the Node is in the DOM, trigger attached callback.
  if (inDOM && CustomElement.prototype.attachedCallback) {
    element.attachedCallback();
  }

  // The upgrade was successful.
  return true;
}
