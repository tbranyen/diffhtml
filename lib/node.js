import * as buffers from './util/buffers';
import { pools as _pools, initializePools, createPool } from './util/pools';
import { count as poolCount } from './util/pools';
import { parseHTML, makeParser } from './util/parser';
import { uuid } from './util/uuid';
import { makeElement, copyElement, copyAttribute } from './element';
import { transitionStates } from './transitions';
import workerSource from './worker';

var pools = _pools;

// Cache created nodes inside this object.
makeNode.nodes = {};

var slice = Array.prototype.slice;
var forEach = Array.prototype.forEach;

/**
 * Synchronizes changes from the newTree into the oldTree.
 *
 * @param oldTree
 * @param newTree
 */
export function syncNode(oldTree, newTree) {
  var patches = this;
  var oldChildNodes = oldTree.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;
  var oldElement = oldTree.element;

  if (!newTree) {
    patches[patches.length] = { __do__: -1, element: oldElement };
    oldChildNodes.splice(0, oldChildNodesLength);

    return;
  }

  var nodeValue = newTree.nodeValue;
  var childNodes = newTree.childNodes;
  var childNodesLength = childNodes ? childNodes.length : 0;
  var newElement = newTree.element;

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
  var attributes = newTree.attributes;

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
      syncNode.call(patches, oldTree.childNodes[i], childNodes[i]);
    }
  }
}

/**
 * Converts a live node into a virtual node.
 *
 * @param node
 * @return
 */
export function makeNode(node) {
  // If this node has already been converted, do not attempt to convert again.
  if (node && node.__node__) {
    return node.__node__;
  }

  var nodeType = node.nodeType;
  var nodeValue = node.nodeValue;

  if (!nodeType || nodeType === 2 || nodeType === 4 || nodeType === 8) {
    return false;
  }

  if (nodeType === 3 && !nodeValue.trim()) {
    return false;
  }

  // Virtual representation of a node, containing only the data we wish to
  // diff and patch.
  var entry = {};

  // Cache the element in the ids.
  var id = pools.uuid.get();

  // Add to internal lookup.
  makeNode.nodes[id] = node;

  // Save a reference to this object.
  node.__node__ = entry;

  entry.element = id;
  entry.nodeName = node.nodeName.toLowerCase();
  entry.nodeValue = nodeValue;
  entry.childNodes = [];
  entry.attributes = [];

  // Collect attributes.
  var attributes = node.attributes;

  // If the element has no attributes, skip over.
  if (attributes) {
    var attributesLength = attributes.length;

    if (attributesLength) {
      for (var i = 0; i < attributesLength; i++) {
        entry.attributes[entry.attributes] = {
          name: attributes[i].name,
          value: attributes[i].value
        };
      }
    }
  }

  // Collect childNodes.
  var childNodes = node.childNodes;
  var childNodesLength = node.childNodes.length;
  var newNode = null;

  // If the element has child nodes, convert them all to virtual nodes.
  if (node.nodeType !== 3 && childNodes) {
    for (var i = 0; i < childNodesLength; i++) {
      newNode = makeNode(childNodes[i]);

      if (newNode) {
        entry.childNodes[entry.childNodes.length] = newNode;
      }
    }
  }

  return entry;
}

var hasWorker = typeof Worker === 'function';

// Set up a WebWorker if available.
if (hasWorker) {
  // Construct the worker reusing code already organized into modules.
  var workerBlob = new Blob([
    [
      // Reusable Array methods.
      'var slice = Array.prototype.slice;',

      // Add a namespace to attach pool methods to.
      'var pools = {};',
      'var nodes = 0;',

      // Adds in a global `uuid` function.
      uuid,

      // Add in pool manipulation methods.
      createPool,
      initializePools,
      'initializePools(' + poolCount + ');',

      // Add in Node manipulation.
      syncNode,

      // Add in the ability to parseHTML.
      parseHTML,

      // Give the webworker utilities.
      buffers.stringToBuffer,
      buffers.bufferToString,

      makeParser,
      'var parser = makeParser();',

      // Add in the worker source.
      workerSource,

      // Metaprogramming up this worker call.
      'startup(self);'
    ].join('\n')
  ], { type: 'application/javascript' });


  // Construct the worker and start it up.
  try {
    var worker = new Worker(URL.createObjectURL(workerBlob));
  } catch(e) {
    if (console && console.info) {
      console.info("Failed to create diffhtml worker",e);
    }
    hasWorker = false;
  }
}

/**
 * getElement
 *
 * @param ref
 * @return
 */
function getElement(ref) {
  var uuid = ref.element || ref;
  var element = makeNode.nodes[uuid] || makeElement(ref);

  return { element, uuid };
}

/**
 * Processes an Array of patches.
 *
 * @param e
 * @return
 */
function processPatches(element, e) {
  var patches = e.data;
  var states = transitionStates;

  var callCallback = function(callback) {
    callback(this);
  };

  var attachedCallback = function(elementDescriptor) {
    var el = getElement(elementDescriptor).element;

    this.fragment.appendChild(el);

    // Trigger all the text changed values.
    if (states && el.nodeName === '#text' && states.textChanged) {
      for (var x = 0; x < states.textChanged.length; x++) {
        var callback = states.textChanged[x];
        callback(fragment.parentNode || element, null, fragment.textContent);
      }
    }

    // Added state for transitions API.
    if (states && states.attached) {
      states.attached.forEach(callCallback, el);
    }
  };

  var titleCallback = function(elementDescriptor) {
    var el = getElement(elementDescriptor).element;

    // Ensure the title is set correctly.
    if (el.tagName === 'title') {
      el.ownerDocument.title = el.childNodes[0].nodeValue;
    }
  };

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    let patch = patches[i];
    let elementId, oldId, newId, result;

    if (patch.element) {
      result = getElement(patch.element);
      patch.element = result.element;
      elementId = result.uuid;
    }

    if (patch.old) {
      result = getElement(patch.old);
      patch.old = result.element;
      oldId = result.uuid;
    }

    if (patch.new) {
      result = getElement(patch.new);
      patch.new = result.element;
      newId = result.uuid;
    }

    // Replace the entire Node.
    if (patch.__do__ === 0) {
      patch.old.parentNode.replaceChild(patch.new, patch.old);
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        var fragment = document.createDocumentFragment();

        patch.fragment.forEach(attachedCallback, { fragment });
        patch.element.appendChild(fragment);
        patch.fragment.forEach(titleCallback);
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        if (states && states.detached) {
          states.detached.forEach(callCallback, patch.old);
        }

        // Ensure the title is emptied.
        if (patch.old.tagName === 'title') {
          patch.old.ownerDocument.title = '';
        }

        patch.old.parentNode.removeChild(patch.old);

        pools.uuid.free(oldId);

        makeNode.nodes[oldId] = undefined;
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t replace without parent, is this the ' +
            'document root?');
        }

        // Append the element first, before doing the replacement.
        patch.old.parentNode.insertBefore(patch.new, patch.old.nextSibling);

        // Added state for transitions API.
        if (states && states.attached) {
          states.attached.forEach(function(callback) {
            callback(patch.new);
          });
        }

        // Removed state for transitions API.
        if (states && states.detached) {
          states.detached.forEach(function(callback) {
            callback(patch.old);
          });
        }

        // Replaced state for transitions API.
        if (states && states.replaced) {
          states.replaced.forEach(function(callback) {
            callback(patch.old, patch.new);
          });
        }

        // Ensure the title is set correctly.
        if (patch.new.tagName === 'title') {
          patch.old.ownerDocument.title = patch.new.childNodes[0].nodeValue;
        }

        patch.old.parentNode.replaceChild(patch.new, patch.old);

        pools.uuid.free(oldId);

        makeNode.nodes[oldId] = undefined;
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === 2) {
      var originalValue = patch.element.getAttribute(patch.name);

      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }

      // Trigger all the attribute changed values.
      if (states && states.attributeChanged) {
        for (var x = 0; x < states.attributeChanged.length; x++) {
          var callback = states.attributeChanged[x];
          callback(patch.element, patch.name, originalValue, patch.value);
        }
      }
    }

    // Text node manipulation.
    else if (patch.__do__ === 3) {
      var originalValue = patch.element.textContent;

      patch.element.textContent = patch.value;

      if (patch.element.parentNode === null) {
        document.title = patch.value;
      }
      else {
        // Trigger all the text changed values.
        if (states && states.textChanged) {
          for (var x = 0; x < states.textChanged.length; x++) {
            var callback = states.textChanged[x];
            callback(patch.element.parentNode, originalValue, patch.value);
          }
        }
      }
    }
  }
}

// Only calculate the parent's initial state one time.
var oldTree = null;

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
export function patchNode(element, newHTML, options) {
  // Ensure that the document disable worker is always picked up.
  if (typeof options.enableWorker !== 'boolean') {
    options.enableWorker = document.ENABLE_WORKER;
  }

  if (element.__is_rendering__) { return; }

  if (options.inner && element._innerHTML !== element.innerHTML) {
    oldTree = makeNode(element);
  }
  else if (!options.inner && element._outerHTML !== element.outerHTML) {
    oldTree = makeNode(element);
  }
  else if (element._textContent !== element.textContent) {
    oldTree = makeNode(element);
  }
  // InnerHTML is the same.
  else if (options.inner && element.innerHTML === newHTML) {
    return;
  }
  // OuterHTML is the same.
  else if (!options.inner && element.outerHTML === newHTML) {
    return;
  }

  // Will want to ensure that the first render went through, the worker can
  // take a bit to startup and we want to show changes as soon as possible.
  if (options.enableWorker && hasWorker && element.__has_rendered__) {
    // Attach all properties here to transport.
    let transferObject = {};

    if (oldTree) { transferObject.oldTree = oldTree; }

    if (typeof newHTML !== 'string') {
      transferObject.newTree = makeNode(newHTML);

      // Set a render lock as to not flood the worker.
      element.__is_rendering__ = true;

      // Transfer this buffer to the worker, which will take over and process the
      // markup.
      worker.postMessage(transferObject);

      // Wait for the worker to finish processing and then apply the patchset.
      worker.onmessage = function(e) {
        processPatches(element, e);

        element._innerHTML = element.innerHTML;
        element._outerHTML = element.outerHTML;
        element._textContent = element.textContent;

        element.__is_rendering__ = false;
      };

      return;
    }

    // Used to specify the outerHTML offset if passing the parent's markup.
    let offset = 0;

    // Craft a new buffer with the new contents.
    let newBuffer = buffers.stringToBuffer(newHTML);

    // Set the offset to be this byte length.
    offset = newHTML.length;

    // Calculate the bytelength for the transfer buffer, contains one extra for
    // the offset.
    let transferByteLength = newBuffer.byteLength;

    // This buffer starts with the offset and contains the data to be carried
    // to the worker.
    let transferBuffer = new Uint16Array(transferByteLength);

    // Set the newHTML payload.
    transferBuffer.set(newBuffer, 0);

    // Add properties to send to worker.
    transferObject.offset = offset;
    transferObject.buffer = transferBuffer.buffer;
    transferObject.isInner = options.inner;

    // Set a render lock as to not flood the worker.
    element.__is_rendering__ = true;

    // Transfer this buffer to the worker, which will take over and process the
    // markup.
    worker.postMessage(transferObject, [transferBuffer.buffer]);

    // Wait for the worker to finish processing and then apply the patchset.
    worker.onmessage = function(e) {
      processPatches(element, e);

      element._innerHTML = element.innerHTML;
      element._outerHTML = element.outerHTML;
      element._textContent = element.textContent;

      element.__is_rendering__ = false;
    };
  }
  else if (!options.enableWorker || !hasWorker || !element.__has_rendered__) {
    let data = [];
    let newTree = typeof newHTML === 'string' ?
      parseHTML(newHTML, options.inner) : makeNode(newHTML);

    if (options.inner) {
      let childNodes = newTree;

      newTree = {
        childNodes,

        attributes: oldTree.attributes,
        element: oldTree.element,
        nodeName: oldTree.nodeName,
        nodeValue: oldTree.nodeValue
      };
    }

    let oldTreeName = oldTree.nodeName || '';
    let newNodeName = newTree && newTree.nodeName;

    // If the element node types match, try and compare them.
    if (oldTreeName === newNodeName) {
      // Synchronize the tree.
      syncNode.call(data, oldTree, newTree);
    }
    // Otherwise replace the top level elements.
    else if (newHTML) {
      data[data.length] = {
        __do__: 0,
        old: oldTree,
        new: newTree
      };

      oldTree = newTree;
    }

    // Process the data immediately.
    processPatches(element, { data });

    // Mark this element as initially rendered.
    if (!element.__has_rendered__) {
      element.__has_rendered__ = true;
    }

    // Set the innerHTML.
    element._innerHTML = element.innerHTML;
    element._outerHTML = element.outerHTML;
    element._textContent = element.textContent;

    // Element has stopped rendering.
    element.__is_rendering__ = false;

    // Free all memory after each iteration.
    pools.object.freeAll();
    pools.array.freeAll();

    // Clean out the patches array.
    data.length = 0;
  }
}
