var makeNode = require('./make_node');
var svg = require('./svg');

function makeElement(descriptor) {
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

  // Add to the nodes cache using the designated id.
  makeNode.nodes[descriptor.element] = element;

  return element;
}

module.exports = makeElement;
