import { createNode } from '../node';
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

const removeAttribute = (domNode, name) => {
  domNode.removeAttribute(name);

  if (name in domNode) {
    domNode[name] = undefined;
  }
};

export default function patchNode(patches, state) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    // Triggered either synchronously or asynchronously depending on if a
    // transition was invoked.
    const mutationCallback = (domNode, name, value) => {
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      name = name.indexOf('on') === 0 ? name.toLowerCase() : name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        const noValue = value === null || value === undefined;
        domNode.setAttribute(name, noValue ? '' : value);

        // Allow the user to find the real value in the DOM Node as a
        // property.
        try {
          domNode[name] = value;
        } catch (unhandledException) {}
      }
      // Support patching an object representation of the style object.
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
        try {
          domNode[name] = value;
        } catch (unhandledException) {}
      }
    };

    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const name = SET_ATTRIBUTE[i + 1];
      const value = SET_ATTRIBUTE[i + 2];
      const domNode = createNode(vTree);
      const attributeChanged = TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(name);
      const newPromises = runTransitions(
        'attributeChanged', domNode, name, oldValue, value
      );

      if (newPromises.length) {
        Promise.all(newPromises).then(() => {
          mutationCallback(domNode, name, decodeEntities(value));
        });

        promises.push(...newPromises);
      }
      else {
        mutationCallback(domNode, name, decodeEntities(value));
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
      const vTree = REMOVE_ATTRIBUTE[i];
      const name = REMOVE_ATTRIBUTE[i + 1];
      const domNode = NodeCache.get(vTree);
      const attributeChanged = TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(name);
      const newPromises = runTransitions(
        'attributeChanged', domNode, name, oldValue, null
      );

      if (newPromises.length) {
        Promise.all(newPromises).then(() => removeAttribute(domNode, name));
        promises.push(...newPromises);
      }
      else {
        removeAttribute(domNode, name);
      }
    }
  }

  // First do all DOM tree operations, and then do attribute and node value.
  for (let i = 0; i < TREE_OPS.length; i++) {
    const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
        const vTree = INSERT_BEFORE[i];
        const childNode = INSERT_BEFORE[i + 1];
        const referenceNode = INSERT_BEFORE[i + 2];
        const domNode = NodeCache.get(vTree);
        const refNode = referenceNode && createNode(referenceNode);
        const attached = TransitionCache.get('attached');

        if (referenceNode) {
          protectVTree(referenceNode);
        }

        const newNode = createNode(childNode);
        protectVTree(childNode);

        // If refNode is `null` then it will simply append like `appendChild`.
        domNode.insertBefore(newNode, refNode);

        const attachedPromises = runTransitions('attached', newNode);

        if (attachedPromises.length) {
          promises.push(...attachedPromises);
        }
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const childNode = REMOVE_CHILD[i];
        const domNode = NodeCache.get(childNode);
        const detached = TransitionCache.get('detached');
        const detachedPromises = runTransitions('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree(childNode);
          });

          promises.push(...detachedPromises);
        }
        else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree(childNode);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
        const newTree = REPLACE_CHILD[i];
        const oldTree = REPLACE_CHILD[i + 1];
        const oldDomNode = NodeCache.get(oldTree);
        const newDomNode = createNode(newTree);
        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');
        const attachedPromises = runTransitions('attached', newDomNode);
        const detachedPromises = runTransitions('detached', oldDomNode);
        const replacedPromises = runTransitions(
          'replaced', oldDomNode, newDomNode
        );
        const allPromises = [
          ...attachedPromises,
          ...detachedPromises,
          ...replacedPromises,
        ];

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);

        if (allPromises.length) {
          promises.push(
            Promise.all(allPromises).then(() => {
              oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
              protectVTree(newTree);
              unprotectVTree(oldTree);
            })
          );
        }
        else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          protectVTree(newTree);
          unprotectVTree(oldTree);
        }
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (let i = 0; i < NODE_VALUE.length; i += 3) {
      const vTree = NODE_VALUE[i];
      const nodeValue = NODE_VALUE[i + 1];
      const oldValue = NODE_VALUE[i + 2];
      const domNode = NodeCache.get(vTree);
      const textChanged = TransitionCache.get('textChanged');
      const textChangedPromises = runTransitions(
        'textChanged', domNode, oldValue, nodeValue
      );

      const { parentNode } = domNode;

      if (nodeValue.includes('&')) {
        domNode.nodeValue = decodeEntities(nodeValue);
      }
      else {
        domNode.nodeValue = nodeValue;
      }

      if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = escape(nodeValue);
      }

      if (textChangedPromises.length) {
        promises.push(...textChangedPromises);
      }
    }
  }

  return promises;
}
