import createNode from './create';
import { runTransitions } from '../transition';
import { NodeCache, TransitionCache } from '../util/caches';
import { protectVTree, unprotectVTree } from '../util/memory';
import decodeEntities from '../util/decode-entities';
import escape from '../util/escape';
import { PATCH_TYPE } from '../util/types';

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);
const blacklist = new Set();
const whitelist = new Set();

/**
 *
 * @param {unknown} domNode
 * @param {string} name
 */
const removeAttribute = (domNode, name) => {
  /** @type {HTMLElement} */ (domNode).removeAttribute(name);

  // Runtime checking if the property can be set.
  const blacklistName = /** @type {HTMLElement} */ (domNode).nodeName + '-' + name;

  if (whitelist.has(blacklistName)) {
    /** @type {object} */ (domNode)[name] = undefined;
  }
  else if (!blacklist.has(blacklistName)) {
    try {
      /** @type {object} */ (domNode)[name] = undefined;
      whitelist.add(blacklistName);
    } catch (unhandledException) {
      blacklist.add(blacklistName);
    }
  }
};

export default function patchNode(patches, state = {}) {
  const promises = [];
  const { isSVG, ownerDocument } = state;
  const { length } = patches;

  let i = 0;

  while (true) {
    const patchType = patches[i]

    if (i === length) {
      break;
    }

    switch(patchType) {
      case PATCH_TYPE.SET_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const _name = patches[i + 2];
        const value = decodeEntities(patches[i + 3]);

        i += 4;

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

        break;
      }

      case PATCH_TYPE.REMOVE_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];

        i += 3;

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

        break;
      }

      case PATCH_TYPE.NODE_VALUE: {
        const vTree = patches[i + 1];
        const nodeValue = patches[i + 2];
        const oldValue = patches[i + 3];

        i += 4;

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

        break;
      }

      case PATCH_TYPE.INSERT_BEFORE: {
        const vTree = patches[i + 1];
        const newTree = patches[i + 2];
        const refTree = patches[i + 3];

        i += 4;

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

        break;
      }

      case PATCH_TYPE.REPLACE_CHILD: {
        const newTree = patches[i + 1];
        const oldTree = patches[i + 2];

        i += 3;

        const oldDomNode = NodeCache.get(oldTree);
        const newDomNode = createNode(newTree, ownerDocument, isSVG);
        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        // FIXME only do this if transitions exist
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

        break;
      }

      case PATCH_TYPE.REMOVE_CHILD: {
        const vTree = patches[i + 1];

        i += 2;

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

        break;
      }
    }
  }

  return promises;
}
