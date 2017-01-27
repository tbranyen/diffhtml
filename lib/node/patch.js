import { makeNode } from '../node';
import {
  NodeCache,
  ComponentCache,
  protectVTree,
  unprotectVTree,
  decodeEntities,
  escape,
} from '../util';

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

export function patchNode(patches, state) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // First do all DOM tree operations, and then do attribute and node value.
  for (let i = 0; i < TREE_OPS.length; i++) {
    const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i++) {
        const [ vTree, childNodes, referenceNode ] = INSERT_BEFORE[i];
        const domNode = NodeCache.get(vTree);
        const refNode = referenceNode ? makeNode(referenceNode) : null;
        let fragment = null;

        if (referenceNode) {
          protectVTree(referenceNode);
        }

        if (childNodes.length) {
          fragment = document.createDocumentFragment();

          for (let i = 0; i < childNodes.length; i++) {
            fragment.appendChild(makeNode(childNodes[i]));
            protectVTree(childNodes[i]);
          }
        }
        else {
          fragment = makeNode(childNodes);
          protectVTree(childNodes);
        }

        domNode.insertBefore(fragment, refNode);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const childNode = REMOVE_CHILD[i];
        const domNode = NodeCache.get(childNode);

        if (ComponentCache.has(childNode)) {
          ComponentCache.get(childNode).componentWillUnmount();
        }

        domNode.parentNode.removeChild(domNode);
        unprotectVTree(childNode);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i++) {
        const [ newChildNode, oldChildNode ] = REPLACE_CHILD[i];
        const oldDomNode = NodeCache.get(oldChildNode);
        const newDomNode = makeNode(newChildNode);

        oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
        protectVTree(newChildNode);
        unprotectVTree(oldChildNode);
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (let i = 0; i < NODE_VALUE.length; i += 2) {
      const vTree = NODE_VALUE[i];
      const nodeValue = NODE_VALUE[i + 1];

      const domNode = NodeCache.get(vTree);
      const { parentNode } = domNode;

      if (nodeValue.includes('&')) {
        domNode.nodeValue = decodeEntities(escape(nodeValue));
      }
      else {
        domNode.nodeValue = escape(nodeValue);
      }

      if (parentNode) {
        if (blockText.has(parentNode.nodeName.toLowerCase())) {
          parentNode.nodeValue = escape(nodeValue);
        }
      }
    }
  }

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const name = SET_ATTRIBUTE[i + 1];
      const value = SET_ATTRIBUTE[i + 2];

      const domNode = NodeCache.get(vTree);
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // Support patching an object representation of the style object.
      if (!isObject && !isFunction && name) {
        domNode.setAttribute(name, value);
      }
      else if (isObject && name === 'style') {
        const keys = Object.keys(value);

        for (let i = 0; i < keys.length; i++) {
          domNode.style[keys[i]] = value[keys[i]];
        }
      }
      else if (typeof value !== 'string') {
        // Necessary to track the attribute/prop existence.
        domNode.setAttribute(name, '');

        // Since this is a property value it gets set directly on the node.
        domNode[name] = value;
      }

      // Support live updating of the `value` and `checked` attribute.
      if (name === 'value' || name === 'checked') {
        domNode[name] = value;
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
      const vTree = REMOVE_ATTRIBUTE[i];
      const name = REMOVE_ATTRIBUTE[i + 1];

      const domNode = NodeCache.get(vTree);

      domNode.removeAttribute(name);

      if (name in domNode) {
        domNode[name] = undefined;
      }
    }
  }

  return promises;
}
