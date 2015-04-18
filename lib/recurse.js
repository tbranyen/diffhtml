var humanizeNodeType = {
  1: 'tag',
  2: 'attribute',
  3: 'text',
  4: 'cdata',
  8: 'comment'
};

function recurse(node, i, all) {
  var entry = {};
  var nodeName = node.nodeName;
  var nodeValue = node.nodeValue;
  var childNodes = node.childNodes;

  if (nodeName === 'style') {
    entry.type = 'style';
  }
  else if (nodeName === 'script') {
    entry.type = 'script';
  }
  else {
    entry.type = humanizeNodeType[node.nodeType];
  }

  entry.name = nodeName;
  entry.text = nodeValue || null;
  entry.attribs = {};

  if (entry.type === 'text') {
    return entry;
  }

  var attrs = node.attributes;

  for (var i = 0; i < attrs.length; i++) {
    entry.attribs[attrs[i].name] = attrs[i].value;
  }

  entry.children = module.exports(childNodes);

  return entry;
}

module.exports = function(nodes) {
  return Array.prototype.map.call(nodes, recurse).filter(Boolean);
}
