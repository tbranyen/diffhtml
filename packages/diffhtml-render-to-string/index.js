function renderAttributes(attributes) {
  const attrs = Object.keys(attributes);

  return attrs.length ? ' ' + attrs.map((keyName, i) => {
    const value = attributes[keyName];
    const isFalsy = !Boolean(value);
    const isDynamic = typeof value === 'object' || typeof value === 'function';

    return `${keyName}${(!isFalsy && !isDynamic) ? `="${String(value)}"` : ''}`;
  }).join(' ') : '';
}

function renderToString(vTree) {
  let output = '';
  const { attributes, childNodes, rawNodeName: Constructor } = vTree;

  // Component.
  if (typeof Constructor === 'function') {
    const canNew = Constructor.prototype && Constructor.prototype.render;

    attributes.children = childNodes;

    const newTree = canNew ? new Constructor(attributes).render() : Constructor(attributes);

    output += renderToString(newTree);
  }
  else if (vTree.nodeType === 11) {
    vTree.childNodes.forEach(childNode => {
      output += renderToString(childNode);
    });
  }
  // Empty element.
  else if (!(vTree.childNodes.length) && vTree.nodeType === 1) {
    output += `<${vTree.nodeName}${renderAttributes(vTree.attributes)}/>`;
  }
  // Text Nodes.
  else if (vTree.nodeType === 3) {
    output += vTree.nodeValue;
  }
  // Nest elements.
  else if (vTree.childNodes.length) {
    output += `<${vTree.nodeName}${renderAttributes(vTree.attributes)}>${vTree.childNodes.map(childNode => `${renderToString(childNode)}`).join('')}</${vTree.nodeName}>`;
  }

  return output;
}

module.exports = renderToString;
