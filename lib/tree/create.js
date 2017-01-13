import { NodeCache, Pool, escape } from '../util';

const { assign } = Object;
const { isArray } = Array;

export default function createTree(input, attributes, childNodes, ...rest) {
  if (arguments.length === 1) {
    if (!input) {
      return null;
    }

    // If the first argument is an array, we assume this is a DOM fragment and
    // the array are the childNodes.
    if (isArray(input)) {
      return createTree('#document-fragment', input.map(vTree => {
        return createTree(vTree);
      }));
    }

    // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
    if (typeof Node !== 'undefined' && input instanceof Node) {
      attributes = {};
      childNodes = [];

      // When working with a text node, simply save the nodeValue as the
      // initial value.
      if (input.nodeType === 3) {
        childNodes = input.nodeValue;
      }
      // Element types are the only kind of DOM node we care about attributes
      // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
      // ignore this.
      else if (input.nodeType === 1 && input.attributes.length) {
        attributes = {};

        for (let i = 0; i < input.attributes.length; i++) {
          const { name, value } = input.attributes[i];

          if (value === '' && name in input) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      }

      // Get the child nodes from an Element or Fragment/Shadow Root.
      if (input.nodeType === 1 || input.nodeType === 11) {
        if (input.childNodes.length) {
          childNodes = [];

          for (let i = 0; i < input.childNodes.length; i++) {
            if (input.childNodes[i]) {
              childNodes[i] = createTree(input.childNodes[i]);
            }
          }
        }
      }

      const vTree = createTree(input.nodeName, attributes, childNodes);
      NodeCache.set(vTree, input);
      return vTree;
    }


    // Assume any object value is a valid VTree object.
    if (typeof input === 'object') {
      return input;
    }
    // Else assume it is text.
    else {
      return createTree('#text', input);
    }
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes, ...rest];
  }

  // Allocate a new VTree from the pool.
  const entry = Pool.get();
  const isTextNode = input === '#text';

  entry.key = '';
  entry.rawNodeName = input;

  if (typeof input === 'function') {
    entry.nodeName = '#document-fragment';
  }
  else {
    entry.nodeName = String(input).toLowerCase();
  }

  if (isTextNode) {
    const getValue = (attributes, childNodes) => {
      const nodes = arguments.length === 2 ? attributes : childNodes;
      return isArray(nodes) ? nodes.join('') : nodes;
    };

    const value = getValue(attributes, childNodes);

    entry.nodeType = 3;
    entry.nodeValue = escape(String(value || ''));
    entry.attributes = {};
    entry.childNodes = [];

    return entry;
  }

  const getChildNodes = (attributes, childNodes) => {
    let nodes = null;

    if (isArray(attributes) || typeof attributes !== 'object') {
      nodes = attributes;
    }
    else {
      nodes = childNodes;
    }

    return nodes ? [].concat(nodes).map(node => {
      if (typeof node === 'string') {
        return createTree('#text', node);
      }

      if (node) {
        return node;
      }
    }).filter(Boolean) : [];
  };

  if (input === '#document-fragment') {
    entry.nodeType = 11;
  }
  else if (input === '#comment') {
    entry.nodeType = 8;
  }
  else {
    entry.nodeType = 1;
  }

  entry.nodeValue = '';
  entry.childNodes = getChildNodes(attributes, childNodes);
  entry.attributes = {};

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // Set the key prop if passed as an attr.
  if (entry.attributes && entry.attributes.key) {
    entry.key = entry.attributes.key;
  }

  return entry;
}
