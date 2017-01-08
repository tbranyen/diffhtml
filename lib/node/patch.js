import { makeNode } from '../node';
import {
  blockText,
  protectElement,
  unprotectElement,
  decodeEntities,
} from '../util';

export function patchNode(patches, state) {
  // Apply the set of patches to the Node.
  const promises = [];

  // Loop through all the patches and changesets to apply them.
  for (let i = 0; i < patches.length; i++) {
    const changeset = patches[i];

    const INSERT_BEFORE = changeset[0];
    const APPEND_CHILD = changeset[1];
    const REMOVE_CHILD = changeset[2];
    const REPLACE_CHILD = changeset[3];
    const NODE_VALUE = changeset[4];
    const SET_ATTRIBUTE = changeset[5];
    const REMOVE_ATTRIBUTE = changeset[6];

    // Append elements.
    for (let i = 0; i < APPEND_CHILD.length; i++) {
      const [ vTree, childNodes ] = APPEND_CHILD[i];
      const domNode = makeNode(vTree);
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < childNodes.length; i++) {
        fragment.appendChild(makeNode(childNodes[i]));
      }

      domNode.appendChild(fragment);
    }

    // Change nodeValue.
    for (let i = 0; i < NODE_VALUE.length; i++) {
      const [ vTree, nodeValue ] = NODE_VALUE[i];
      const domNode = makeNode(vTree);
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
      const domNode = makeNode(vTree);

      for (let i = 0; i < attributes.length; i++) {
        const [ name, value ] = attributes[i];
        const isObject = typeof value === 'object';
        const isFunction = typeof value === 'function';

        if (!isObject && !isFunction && name) {
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
      const domNode = makeNode(vTree);

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
