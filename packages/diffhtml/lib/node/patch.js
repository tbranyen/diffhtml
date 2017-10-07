import createNode from './create';
import { runTransitions } from '../transition';
import { NodeCache, TransitionCache } from '../util/caches';
import { protectVTree, unprotectVTree } from '../util/memory';
import decodeEntities from '../util/decode-entities';
import escape from '../util/escape';

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);
const blacklist = new Set();
const whitelist = new Set();

const removeAttribute = (domNode, name) => {
  domNode.removeAttribute(name);

  // Runtime checking if the property can be set.
  const blacklistName = domNode.nodeName + '-' + name;

  if (whitelist.has(blacklistName)) {
    domNode[name] = undefined;
  }
  else if (!blacklist.has(blacklistName)) {
    try {
      domNode[name] = undefined;
      whitelist.add(blacklistName);
    } catch (unhandledException) {
      blacklist.add(blacklistName);
    }
  }
};

export default function patchNode(patches, state = {}) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;
  const { isSVG, ownerDocument } = state;

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const _name = SET_ATTRIBUTE[i + 1];
      const value = decodeEntities(SET_ATTRIBUTE[i + 2]);

      const domNode = createNode(vTree, ownerDocument, isSVG);
      const oldValue = domNode.getAttribute(_name);
      const newPromises = runTransitions(
        'attributeChanged', domNode, _name, oldValue, value
      );

      // Triggered either synchronously or asynchronously depending on if a
      // transition was invoked.
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      const name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name;

      // Runtime checking if the property can be set.
      const blacklistName = vTree.nodeName + '-' + name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        const noValue = value === null || value === undefined;

        if (whitelist.has(blacklistName)) {
          domNode[name] = value;
        }
        else if (!blacklist.has(blacklistName)) {
          try {
            domNode[name] = value;
            whitelist.add(blacklistName);
          } catch (unhandledException) {
            blacklist.add(blacklistName);
          }
        }

        // Set the actual attribute, this will ensure attributes like
        // `autofocus` aren't reset by the property call above.
        domNode.setAttribute(name, noValue ? '' : value);
      }
      // Support patching an object representation of the style object.
      else if (isObject && name === 'style') {
        const keys = Object.keys(value);

        for (let i = 0; i < keys.length; i++) {
          domNode.style[keys[i]] = value[keys[i]];
        }
      }
      else if (typeof value !== 'string') {
        // Since this is a property value it gets set directly on the node.
        if (whitelist.has(blacklistName)) {
          domNode[name] = value;
        }
        else if (!blacklist.has(blacklistName)) {
          try {
            domNode[name] = value;
            whitelist.add(blacklistName);
          } catch (unhandledException) {
            blacklist.add(blacklistName);
          }
        }
      }

      if (newPromises.length) {
        promises.push(...newPromises);
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

  // Once attributes have been synchronized into the DOM Nodes, assemble the
  // DOM Tree.
  for (let i = 0; i < TREE_OPS.length; i++) {
    const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
        const vTree = INSERT_BEFORE[i];
        const newTree = INSERT_BEFORE[i + 1];
        const refTree = INSERT_BEFORE[i + 2];

        const domNode = NodeCache.get(vTree);
        const refNode = refTree && createNode(refTree, ownerDocument, isSVG);
        const attached = TransitionCache.get('attached');

        if (refTree) {
          protectVTree(refTree);
        }

        const newNode = createNode(newTree, ownerDocument, isSVG);
        protectVTree(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        domNode.insertBefore(newNode, refNode);

        const attachedPromises = runTransitions('attached', newNode);

        promises.push(...attachedPromises);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const vTree = REMOVE_CHILD[i];
        const domNode = NodeCache.get(vTree);
        const detached = TransitionCache.get('detached');
        const detachedPromises = runTransitions('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree(vTree);
          });

          promises.push(...detachedPromises);
        }
        else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree(vTree);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
        const newTree = REPLACE_CHILD[i];
        const oldTree = REPLACE_CHILD[i + 1];

        const oldDomNode = NodeCache.get(oldTree);
        const newDomNode = createNode(newTree, ownerDocument, isSVG);
        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        protectVTree(newTree);

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

        if (allPromises.length) {
          Promise.all(allPromises).then(() => {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            unprotectVTree(oldTree);
          });

          promises.push(...allPromises);
        }
        else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
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
      const domNode = createNode(vTree);
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
        parentNode.nodeValue = escape(decodeEntities(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push(...textChangedPromises);
      }
    }
  }

  return promises;
}
