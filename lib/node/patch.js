import { makeNode } from '../node';
import { runTransitions } from '../transition';
import {
  NodeCache,
  TransitionCache,
  protectVTree,
  unprotectVTree,
  decodeEntities,
  escape,
} from '../util';

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

export function patchNode(patches, state) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    // Triggered either synchronously or asynchronously depending on if a
    // transition was invoked.
    const mutationCallback = (domNode, name, value) => {
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // Support patching an object representation of the style object.
      if (!isObject && !isFunction && name) {
        const noValue = value === null || value === undefined;
        domNode.setAttribute(name, noValue ? '' : value);

        // Allow the user to find the real value in the DOM Node as a
        // property.
        domNode[name] = value;
      }
      else if (isObject && name === 'style') {
        const keys = Object.keys(value);

        for (let i = 0; i < keys.length; i++) {
          domNode.style[keys[i]] = value[keys[i]];
        }
      }
      else if (typeof value !== 'string') {
        // We remove and re-add the attribute to trigger a change in a web
        // component or mutation observer. Although you could use a setter or
        // proxy, this is more natural.
        if (domNode.hasAttribute(name) && domNode[name] !== value) {
          domNode.removeAttribute(name, '');
        }

        // Necessary to track the attribute/prop existence.
        domNode.setAttribute(name, '');

        // Since this is a property value it gets set directly on the node.
        domNode[name] = value;
      }
    };

    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const name = SET_ATTRIBUTE[i + 1];
      const value = SET_ATTRIBUTE[i + 2];

      const domNode = makeNode(vTree);

      const attributeChanged = TransitionCache.get('attributeChanged');

      if (attributeChanged.size) {
        const oldValue = domNode.getAttribute(name);

        const newPromises = runTransitions(
          attributeChanged, domNode, name, oldValue, value
        );

        if (newPromises.length) {
          Promise.all(newPromises).then(() => {
            mutationCallback(domNode, name, value);
          });
        }
        else {
          mutationCallback(domNode, name, value);
        }
      }
      else {
        mutationCallback(domNode, name, value);
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
      const vTree = REMOVE_ATTRIBUTE[i];
      const name = REMOVE_ATTRIBUTE[i + 1];

      const domNode = makeNode(vTree);

      domNode.removeAttribute(name);

      if (name in domNode) {
        domNode[name] = undefined;
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

        const attached = TransitionCache.get('attached');

        if (referenceNode) {
          protectVTree(referenceNode);
        }

        if (childNodes.length) {
          fragment = document.createDocumentFragment();

          for (let i = 0; i < childNodes.length; i++) {
            const newNode = makeNode(childNodes[i]);
            fragment.appendChild(newNode);
            protectVTree(childNodes[i]);
          }
        }
        else {
          fragment = makeNode(childNodes);
          protectVTree(childNodes);
        }

        domNode.insertBefore(fragment, refNode);

        if (attached.size) {
          promises.push(...runTransitions(attached, fragment));
        }
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const childNode = REMOVE_CHILD[i];
        const domNode = NodeCache.get(childNode);

        const detached = TransitionCache.get('detached');

        if (detached.size) {
          const newPromises = runTransitions(detached, domNode);

          Promise.all(newPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree(childNode);
          });

          if (newPromises.length) {
            promises.push(...newPromises);
          }
        }
        else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree(childNode);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i++) {
        const [ newChildNode, oldChildNode ] = REPLACE_CHILD[i];
        const oldDomNode = NodeCache.get(oldChildNode);
        const newDomNode = makeNode(newChildNode);

        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');

        if (replaced.size) {
          const attachedPromises = runTransitions(attached, newDomNode);
          const detachedPromises = runTransitions(detached, oldDomNode);

          const replacedPromises = runTransitions(
            replaced, oldDomNode, newDomNode
          );

          const newPromises = [
            ...attachedPromises,
            ...detachedPromises,
            ...replacedPromises,
          ];

          Promise.all(newPromises).then(() => {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            protectVTree(newChildNode);
            unprotectVTree(oldChildNode);
          });

          if (newPromises.length) {
            promises.push(...newPromises);
          }
        }
        else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          protectVTree(newChildNode);
          unprotectVTree(oldChildNode);
        }
      }
    }
  }

  return promises;
}
