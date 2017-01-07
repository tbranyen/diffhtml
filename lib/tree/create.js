import { NodeCache, Pool, escape } from '../util';

const { assign } = Object;
const { isArray } = Array;

export default function createTree(input, attributes, childNodes) {
  if (arguments.length === 1) {
    // If the first argument is an array, we assume this is a DOM fragment and
    // the array are the childNodes.
    if (isArray(input)) {
      return createTree('#document-fragment', input.map(vTree => {
        return createTree(vTree);
      }));
    }

    // Crawl an HTML or SVG Element for attributes and children.
    if (typeof Element !== 'undefined' && input instanceof Element) {
      attributes = null;
      childNodes = null;

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
            childNodes[i] = createTree(input.childNodes[i]);
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
  }

  const entry = Pool.get();
  const isTextNode = input === '#text';

  entry.key = '';
  entry.nodeName = String(input).toLowerCase();
  entry.rawNodeName = input;

  if (isTextNode) {
    const getValue = (attributes, childNodes) => {
      const nodes = arguments.length === 2 ? attributes : childNodes;
      return isArray(nodes) ? nodes.join('') : nodes;
    };

    const value = getValue(attributes, childNodes);

    entry.nodeType = 3;
    entry.nodeValue = escape(String(value || ''));
    entry.attributes = null;
    entry.childNodes = null;

    return entry;
  }

  const getChildNodes = (attributes, childNodes) => {
    const nodes = arguments.length === 2 ? attributes : childNodes;
    return nodes ? [].concat(nodes).map(node => {
      if (typeof node === 'string') {
        return createTree('#text', node);
      }

      return node;
    }) : null;
  };

  // Support Document Fragments and Shadow Roots, everything else is Element.
  entry.nodeType = input === '#document-fragment' ? 11 : 1;
  entry.nodeValue = '';
  entry.attributes = arguments.length === 2 ? null : attributes || null;
  entry.childNodes = getChildNodes(attributes, childNodes);

  // Set the key prop if passed as an attr.
  if (entry.attributes && entry.attributes.key) {
    entry.key = entry.attributes.key;
  }

  return entry;
}