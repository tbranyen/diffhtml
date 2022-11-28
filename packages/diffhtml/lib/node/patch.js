/**
 * @typedef {import('../util/types').ValidNode} ValidNode
 * @typedef {import('../util/types').VTree} VTree
 * @typedef {import('../util/types').TransactionState} TransactionState
 */
import createNode from './create';
import { protectVTree, unprotectVTree } from '../util/memory';
import decodeEntities from '../util/decode-entities';
import { PATCH_TYPE, EMPTY, NodeCache } from '../util/types';
import { $$insertAfter } from '../util/symbols';

const { keys } = Object;
const blocklist = new Set();
const allowlist = new Set();

/**
 * Sets an attribute on an element.
 *
 * @param {VTree} vTree
 * @param {ValidNode} domNode
 * @param {string} name
 * @param {any} value
 *
 * @return {void}
 */
const setAttribute = (vTree, domNode, name, value) => {
  const isObject = typeof value === 'object' && value;
  const isFunction = typeof value === 'function';
  const isSymbol = typeof value === 'symbol';
  const isEvent = name.indexOf('on') === 0;
  const anyNode = /** @type {any} */ (domNode);

  // Events must be lowercased otherwise they will not be set correctly.
  const lowerName = isEvent ? name.toLowerCase() : name;

  // Runtime checking if the property can be set.
  const blocklistName = 's-' + vTree.nodeName + '-' + lowerName;

  /** @type {HTMLElement} */
  const htmlElement = /** @type {any} */ (domNode);

  // Since this is a property value it gets set directly on the node.
  if (allowlist.has(blocklistName)) {
    anyNode[lowerName] = value;
  }
  else if (!blocklist.has(blocklistName)) {
    try {
      anyNode[lowerName] = value;
      allowlist.add(blocklistName);
    }
    catch {
      blocklist.add(blocklistName);
    }
  }

  // If the value is not an object, function, or symbol, then attempt to
  // set as an attribute. If the value is one of the excluded types, they
  // will be set below.
  if (!isObject && !isFunction && !isSymbol) {
    // For boolean/empty attributes, do not try and set a value, just an empty
    // string.
    const emptyValue = value === null || value === undefined || value === true;
    htmlElement.setAttribute(lowerName, emptyValue ? EMPTY.STR : value);
  }
  // Support patching an object representation of the style object.
  else if (isObject && lowerName === 'style') {
    const valueKeys = /** @type {any} */ (keys(value));

    for (let i = 0; i < valueKeys.length; i++) {
      htmlElement.style[valueKeys[i]] = value[valueKeys[i]];
    }
  }
};

/**
 * Removes an attribute from an element.
 *
 * @param {VTree} vTree
 * @param {ValidNode} domNode
 * @param {string} name
 * @return {void}
 */
const removeAttribute = (vTree, domNode, name) => {
  // Runtime checking if the property can be set.
  const blocklistName = 'r-' + vTree.nodeName + '-' + name;
  const anyNode = /** @type {any} */ (domNode);

  if (allowlist.has(blocklistName)) {
    anyNode[name] = undefined;
    delete anyNode[name];
  }
  else if (!blocklist.has(blocklistName)) {
    try {
      anyNode[name] = undefined;
      delete anyNode[name];
      allowlist.add(blocklistName);
    }
    catch {
      blocklist.add(blocklistName);
    }
  }

  /** @type {HTMLElement} */ (domNode).removeAttribute(name);
};

/**
 *
 * @param {*} patches
 * @param {TransactionState=} state
 */
export default function patchNode(patches, state = EMPTY.OBJ) {
  const { ownerDocument, svgElements = new Set() } = state;
  const { length } = patches;

  let i = 0;

  while (true) {
    const patchType = patches[i];

    if (i === length) {
      break;
    }

    switch(patchType) {
      case PATCH_TYPE.REMOVE_ATTRIBUTE:
      case PATCH_TYPE.SET_ATTRIBUTE: {
        const isSet = patchType === PATCH_TYPE.SET_ATTRIBUTE;
        const vTree = patches[i + 1];
        const name = patches[i + 2];
        const value = isSet ? decodeEntities(patches[i + 3]) : null;

        i += isSet ? 4 : 3;

        const isSVG = svgElements.has(vTree);
        const domNode = /** @type {HTMLElement} */ (
          createNode(vTree, ownerDocument, isSVG)
        );

        protectVTree(vTree);

        const setOrRemove = isSet ? setAttribute : removeAttribute;

        setOrRemove(vTree, domNode, name, value);

        break;
      }

      case PATCH_TYPE.NODE_VALUE: {
        const vTree = patches[i + 1];
        const nodeValue = patches[i + 2];
        const isSVG = svgElements.has(vTree);

        i += 4;

        const domNode = /** @type {Text} */ (
          createNode(vTree, ownerDocument, isSVG)
        );

        protectVTree(vTree);

        if (nodeValue.includes('&')) {
          domNode.nodeValue = decodeEntities(nodeValue);
        }
        else {
          domNode.nodeValue = nodeValue;
        }

        break;
      }

      case PATCH_TYPE.INSERT_BEFORE: {
        const vTree = patches[i + 1];
        const newTree = patches[i + 2];
        let refTree = patches[i + 3];

        i += 4;

        if (!NodeCache.has(vTree) && vTree !== $$insertAfter) {
          continue;
        }

        // First attempt to locate a pre-existing DOM Node. If one hasn't been
        // created there could be a few reasons.
        let domNode = /** @type {HTMLElement} */ (
          NodeCache.get(vTree)
        );

        // This allows turning insertBefore into insertAfter. It is only used
        // for Components, but could be used externally as well.
        if (vTree === $$insertAfter) {
          const refNode = NodeCache.get(refTree);

          // Try and find the parentNode if it exists.
          if (refNode) {
            domNode = refNode.parentNode;

            refTree = refNode.nextSibling ? refNode.nextSibling : null;
          }
        }

        const isSVG = svgElements.has(newTree);

        protectVTree(newTree);

        const refNode = refTree && /** @type {HTMLElement} */ (
          createNode(refTree, ownerDocument, isSVG)
        );

        const newNode = /** @type {HTMLElement} */ (
          createNode(newTree, ownerDocument, isSVG)
        );

        // If refNode is `undefined` then it will simply append like
        // `appendChild`.
        domNode.insertBefore(newNode, refNode || null);

        break;
      }

      case PATCH_TYPE.REPLACE_CHILD: {
        const newTree = patches[i + 1];
        const oldTree = patches[i + 2];

        i += 3;

        const isSVG = svgElements.has(newTree);

        const oldDomNode = /** @type {HTMLElement} */ (NodeCache.get(oldTree));
        const newDomNode = /** @type {HTMLElement} */ (
          createNode(newTree, ownerDocument, isSVG)
        );

        // Patching without an existing DOM Node is a mistake, so we should not
        // attempt to do anything in this case.
        if (!oldDomNode || !oldDomNode.parentNode) {
          break;
        }

        // Ensure the `newTree` is protected before any DOM operations occur.
        // This is due to the `connectedCallback` in Web Components firing off,
        // and possibly causing a `gc()` to wipe this out.
        protectVTree(newTree);
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        oldDomNode.parentNode.removeChild(oldDomNode);
        unprotectVTree(oldTree);

        break;
      }

      case PATCH_TYPE.REMOVE_CHILD: {
        const vTree = patches[i + 1];

        i += 2;

        const domNode = /** @type {HTMLElement} */ (NodeCache.get(vTree));

        if (!domNode || !domNode.parentNode) {
          break;
        }

        domNode.parentNode.removeChild(domNode);
        unprotectVTree(vTree);

        break;
      }
    }
  }
}
