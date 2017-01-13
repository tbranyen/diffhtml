import { makeNode } from '../node';
import {
  NodeCache,
  ComponentCache,
  protectVTree,
  unprotectVTree,
  decodeEntities,
} from '../util';

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

export function patchNode(patches, state) {
  // Apply the set of patches to the Node.
  const promises = [];

  // Loop through all the patches and changesets to apply them.
  for (let i = 0; i < patches.length; i++) {
    const changeset = patches[i];

    const INSERT_BEFORE = changeset[0];
    const REMOVE_CHILD = changeset[1];
    const REPLACE_CHILD = changeset[2];
    const NODE_VALUE = changeset[3];
    const SET_ATTRIBUTE = changeset[4];
    const REMOVE_ATTRIBUTE = changeset[5];

    // Insert/append elements.
    for (let i = 0; i < INSERT_BEFORE.length; i++) {
      const [ vTree, childNodes, referenceNode ] = INSERT_BEFORE[i];
      const domNode = NodeCache.get(vTree);
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < childNodes.length; i++) {
        const newNode = makeNode(childNodes[i]);
        fragment.appendChild(newNode);
      }

      protectVTree(vTree);
      domNode.insertBefore(fragment, referenceNode);
    }

    // Remove elements.
    for (let i = 0; i < REMOVE_CHILD.length; i++) {
      const [ vTree, childNode ] = REMOVE_CHILD[i];
      const domNode = NodeCache.get(vTree);

      if (ComponentCache.has(childNode)) {
        ComponentCache.get(childNode).componentWillUnmount();
      }

      domNode.removeChild(NodeCache.get(childNode));
      unprotectVTree(childNode);
    }

    // Replace elements.
    for (let i = 0; i < REPLACE_CHILD.length; i++) {
      const [ vTree, newChildNode, oldChildNode ] = REPLACE_CHILD[i];
      const domNode = NodeCache.get(vTree);
      const oldDomNode = NodeCache.get(oldChildNode)
      const newDomNode = makeNode(newChildNode);

      domNode.replaceChild(newDomNode, oldDomNode);
      protectVTree(newChildNode);
      unprotectVTree(oldChildNode);
    }

    // Change nodeValue.
    for (let i = 0; i < NODE_VALUE.length; i++) {
      const [ vTree, nodeValue ] = NODE_VALUE[i];
      const domNode = NodeCache.get(vTree);
      const { parentNode } = domNode;

      domNode.nodeValue = nodeValue;

      if (parentNode) {
        const { nodeName } = parentNode;

        if (blockText.has(nodeName.toLowerCase())) {
          parentNode.nodeValue = nodeValue;
        }
      }
    }

    // Set attributes.
    for (let i = 0; i < SET_ATTRIBUTE.length; i++) {
      const [ vTree, attributes ] = SET_ATTRIBUTE[i];
      const domNode = NodeCache.get(vTree);

      for (let i = 0; i < attributes.length; i++) {
        const [ name, value ] = attributes[i];
        const isObject = typeof value === 'object';
        const isFunction = typeof value === 'function';

        if (isObject && name === 'style') {
          Object.keys(value).forEach(name => {
            domNode.style.setProperty(name, value[name])
          });
        }
        else if (!isObject && !isFunction && name) {
          domNode.setAttribute(name, decodeEntities(value));
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
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i++) {
      const [ vTree, attributes ] = REMOVE_ATTRIBUTE[i];
      const domNode = NodeCache.get(vTree);

      for (let i = 0; i < attributes.length; i++) {
        const name = attributes[i];

        domNode.removeAttribute(name);

        if (name in domNode) {
          domNode[name] = undefined;
        }
      }
    }
  }

  return promises;
}
