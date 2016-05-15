import * as svg from '../svg';
import makeNode from '../node/make';

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

        if (typeof attribute.value === 'string')  {
          element.setAttribute(attribute.name, attribute.value);
        }
        else {
          element[attribute.name] = attribute.value;
        }
      }
    }

    // Append all the children into the element, making sure to run them
    // through this `make` function as well.
    if (descriptor.childNodes && descriptor.childNodes.length) {
      for (let i = 0; i < descriptor.childNodes.length; i++) {
        let text = descriptor.childNodes.nodeValue;

        if (text && text.trim && text.trim() === '__DIFFHTML__') {
          let value = supplemental.children.shift();

          if (Array.isArray(value)) {
            value.forEach(el => element.appendChild(make(el)));
          }
          else {
            element.appendChild(make(value));
          }
        }
        else {
          element.appendChild(make(descriptor.childNodes[i]));
        }
      }
    }
  }

  // Add to the nodes cache using the designated uuid as the lookup key.
  makeNode.nodes[descriptor.uuid] = element;

  return element;
}
