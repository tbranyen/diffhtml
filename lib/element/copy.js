export function copyElementAttribute(attribute) {
  return { name: attribute.name, value: attribute.value };
}

export function copyElement(descriptor) {
  var newObject = {
    element: descriptor.element,
    nodeName: descriptor.nodeName,
    nodeValue: descriptor.nodeValue,
  };

  if (descriptor.childNodes) {
    newObject.childNodes = descriptor.childNodes.map(copyElement);
  }

  if (descriptor.attributes) {
    newObject.attributes = descriptor.attributes.map(copyElementAttribute);
  }

  return newObject;
}
