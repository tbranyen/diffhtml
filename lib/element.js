import { makeNode } from './node';
import * as svg from './svg';

/**
 * Takes in a virtual descriptor and creates an HTML element. Set's the element
 * into the cache.
 *
 * @param descriptor
 * @return {Element}
 */
export function makeElement(descriptor) {
  var element = null;
  var isSvg = false;

  if (descriptor.nodeName === '#text') {
    element = document.createTextNode(descriptor.nodeValue);
  }
  else {
    if (svg.elements.indexOf(descriptor.nodeName) > -1) {
      isSvg = true;
      element = document.createElementNS(svg.namespace, descriptor.nodeName);
    }
    else {
      element = document.createElement(descriptor.nodeName);
    }

    if (descriptor.attributes && descriptor.attributes.length) {
      for (var i = 0; i < descriptor.attributes.length; i++) {
        var attribute = descriptor.attributes[i];

        if (isSvg) {
          element.setAttributeNS(null, attribute.name, attribute.value);
        }
        else {
          element.setAttribute(attribute.name, attribute.value);
        }
      }
    }

    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (var i = 0; i < descriptor.childNodes.length; i++) {
        element.appendChild(makeElement(descriptor.childNodes[i]));
      }
    }
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  makeNode.nodes[descriptor.element] = element;

  return element;
}

export function copyAttribute(attribute) {
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
    newObject.attributes = descriptor.attributes.map(copyAttribute);
  }

  return newObject;
}
