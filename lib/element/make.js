import * as svg from '../svg';
import makeNode from '../node/make';
import { components, upgrade } from './custom';

/**
 * Takes in a virtual descriptor and creates an HTML element. Sets the element
 * into the cache.
 *
 * @param descriptor - Element descriptor
 * @return {Element} - The newly created DOM Node
 */
export default function make(descriptor) {
  var element = null;
  var isSvg = false;
  // Get the Custom Element constructor for a given element.
  var CustomElement = components[descriptor.nodeName];

  // If the element descriptor was already created, reuse the existing element.
  if (makeNode.nodes[descriptor.uuid]) {
    return makeNode.nodes[descriptor.uuid];
  }

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

    // Copy all the attributes from the descriptor into the newly created DOM
    // Node.
    if (descriptor.attributes && descriptor.attributes.length) {
      for (let i = 0; i < descriptor.attributes.length; i++) {
        let attribute = descriptor.attributes[i];
        element.setAttribute(attribute.name, attribute.value);
      }
    }

    // Append all the children into the element, making sure to run them
    // through this `make` function as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (let i = 0; i < descriptor.childNodes.length; i++) {
        element.appendChild(make(descriptor.childNodes[i]));
      }
    }
  }

  // Set the text content, this should be refactored such that only text nodes
  // should ever get assigned a value.
  if (descriptor.nodeValue) {
    element.textContent = descriptor.nodeValue;
  }

  // Upgrade the element after creating it.
  upgrade(descriptor.nodeName, element);

  // Custom elements have a createdCallback method that should be called.
  if (CustomElement && CustomElement.prototype.createdCallback) {
    CustomElement.prototype.createdCallback.call(element);
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  makeNode.nodes[descriptor.uuid] = element;

  return element;
}
