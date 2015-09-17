export function elementAttribute(attribute) {
  return { name: attribute.name, value: attribute.value };
}

export function element(descriptor) {
  var newObject = {
    element: descriptor.element,
    nodeName: descriptor.nodeName,
    nodeValue: descriptor.nodeValue,
  };

  if (descriptor.childNodes) {
    newObject.childNodes = descriptor.childNodes.map(element);
  }

  if (descriptor.attributes) {
    newObject.attributes = descriptor.attributes.map(elementAttribute);
  }

  return newObject;
}
