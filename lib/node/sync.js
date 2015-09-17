import {
  copyElement as _copyElement,
  copyElementAttribute as _copyElementAttribute
} from '../element/copy';

let copyElement = _copyElement;
let copyElementAttribute = _copyElementAttribute;

const slice = Array.prototype.slice;

/**
 * Synchronizes changes from the newTree into the oldTree.
 *
 * @param oldTree
 * @param newTree
 */
export default function sync(oldTree, newTree) {
  let patches = this;
  let oldChildNodes = oldTree.childNodes;
  let oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  let oldElement = oldTree.element;

  if (!newTree) {
    patches[patches.length] = { __do__: -1, element: oldElement };
    oldChildNodes.splice(0, oldChildNodesLength);

    return;
  }

  let nodeValue = newTree.nodeValue;
  let childNodes = newTree.childNodes;
  let childNodesLength = childNodes ? childNodes.length : 0;
  let newElement = newTree.element;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (oldTree.nodeName !== newTree.nodeName) {
    return;
  }

  // Replace text node values if they are different.
  if (newTree.nodeName === '#text' && oldTree.nodeName === '#text') {
    // Text changed.
    if (oldTree.nodeValue !== newTree.nodeValue) {
      oldTree.nodeValue = newTree.nodeValue;

      patches[patches.length] = {
        __do__: 3,
        element: oldElement,
        value: nodeValue
      };
    }

    return;
  }

  // Most common additive elements.
  if (childNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    let fragment = [];

    for (let i = oldChildNodesLength; i < childNodesLength; i++) {
      childNodes[i] = copyElement(childNodes[i]);

      // Internally add to the tree.
      oldChildNodes[oldChildNodes.length] = childNodes[i];

      // Add to the document fragment.
      fragment[fragment.length] = childNodes[i];
    }

    // Assign the fragment to the patches to be injected.
    patches[patches.length] = {
      __do__: 1,
      element: oldElement,
      fragment: fragment
    };
  }

  // Replace elements if they are different.
  for (let i = 0; i < childNodesLength; i++) {
    if (oldTree.childNodes[i].nodeName !== childNodes[i].nodeName) {
      // Add to the patches.
      patches[patches.length] = {
        __do__: 1,
        old: oldTree.childNodes[i],
        new: childNodes[i]
      };

      // Replace the internal tree's point of view of this element.
      oldTree.childNodes[i] = copyElement(childNodes[i]);
    }
  }

  // Remove these elements.
  if (oldChildNodesLength > childNodesLength) {
    // Elements to remove.
    let toRemove = slice.call(oldChildNodes, childNodesLength,
      oldChildNodesLength);

    for (let i = 0; i < toRemove.length; i++) {
      // Remove the element, this happens before the splice so that we still
      // have access to the element.
      patches[patches.length] = { __do__: 1, old: toRemove[i].element };
    }

    oldChildNodes.splice(childNodesLength,
      oldChildNodesLength - childNodesLength);
  }

  // Synchronize attributes
  let attributes = newTree.attributes;

  if (attributes) {
    let oldLength = oldTree.attributes.length;
    let newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      let toAdd = slice.call(attributes, oldLength);

      for (let i = 0; i < toAdd.length; i++) {
        let change = {
          __do__: 2,
          element: oldElement,
          name: toAdd[i].name,
          value: toAdd[i].value,
        };

        // Push the change object into into the virtual tree.
        oldTree.attributes[oldTree.attributes.length] = {
          name: toAdd[i].name,
          value: toAdd[i].value
        };

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      let toRemove = slice.call(oldTree.attributes, newLength);

      for (let i = 0; i < toRemove.length; i++) {
        let change = {
          __do__: 2,
          element: oldElement,
          name: toRemove[i].name,
          value: undefined,
        };

        // Remove the attribute from the virtual node.
        oldTree.attributes.splice(i, 1);

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }

    // Check for modifications.
    let toModify = attributes;

    for (let i = 0; i < toModify.length; i++) {
      let oldAttrValue = oldTree.attributes[i] &&
        oldTree.attributes[i].value;
      let newAttrValue = attributes[i] && attributes[i].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        let change = {
          __do__: 2,
          element: oldElement,
          name: toModify[i].name,
          value: toModify[i].value,
        };

        // Replace the attribute in the virtual node.
        oldTree.attributes[i].name = toModify[i].name;
        oldTree.attributes[i].value = toModify[i].value;

        // Add the change to the series of patches.
        patches[patches.length] = change;
      }
    }
  }

  // Sync each current node.
  for (let i = 0; i < oldChildNodes.length; i++) {
    if (oldChildNodes[i].element !== childNodes[i].element) {
      sync.call(patches, oldTree.childNodes[i], childNodes[i]);
    }
  }
}
