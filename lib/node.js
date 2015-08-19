import * as buffers from './util/buffers';
import { pools as _pools, initializePools, createPool } from './util/pools';
import { parseHTML, makeParser } from './util/parser';
import { uuid } from './util/uuid';
import { makeElement } from './element';
import { transitionStates } from './transitions';
import workerSource from './worker';

var pools = _pools;
var poolCount = 10000;
var nodes = makeNode.nodes = {};

// Initialize with a reasonable amount of objects.
initializePools(poolCount);

var push = Array.prototype.push;
var slice = Array.prototype.slice;
var filter = Array.prototype.filter;

/**
 * syncNode
 *
 * @param virtualNode
 * @param liveNode
 * @return
 */
export function syncNode(virtualNode, liveNode) {
  var patches = this;

  // For now always sync the children.  In the future we'll be smarter about
  // when this is necessary.
  var oldChildNodes = virtualNode.childNodes;
  var oldChildNodesLength = oldChildNodes ? oldChildNodes.length : 0;

  if (!liveNode) {
    patches.push({ __do__: -1, element: virtualNode.element });

    virtualNode.childNodes.splice(0, oldChildNodesLength);
    return;
  }

  var nodeValue = liveNode.nodeValue;

  // Filter down the childNodes to only what we care about.
  var childNodes = liveNode.childNodes;
  var newChildNodesLength = childNodes ? childNodes.length : 0;

  // If the element we're replacing is totally different from the previous
  // replace the entire element, don't bother investigating children.
  if (virtualNode.nodeName !== liveNode.nodeName) {
    return;
  }

  // Replace text node values if they are different.
  if (liveNode.nodeName === '#text' && virtualNode.nodeName === '#text') {
    // Text changed.
    if (virtualNode.nodeValue !== liveNode.nodeValue) {
      virtualNode.nodeValue = liveNode.nodeValue;

      patches.push({
        __do__: 3,
        element: virtualNode.element,
        value: nodeValue
      });
    }

    return;
  }

  // Most common additive elements.
  if (newChildNodesLength > oldChildNodesLength) {
    // Store elements in a DocumentFragment to increase performance and be
    // generally simplier to work with.
    var fragment = pools.array.get();

    for (var i = oldChildNodesLength; i < newChildNodesLength; i++) {
      // Internally add to the tree.
      virtualNode.childNodes.push(childNodes[i]);

      // Add to the document fragment.
      fragment.push(childNodes[i]);
    }

    // Assign the fragment to the patches to be injected.
    patches.push({
      __do__: 1,
      element: virtualNode.element,
      fragment: fragment
    });
  }

  // Replace elements if they are different.
  for (var i = 0; i < newChildNodesLength; i++) {
    if (virtualNode.childNodes[i].nodeName !== childNodes[i].nodeName) {
      // Add to the patches.
      patches.push({
        __do__: 1,
        old: virtualNode.childNodes[i],
        new: childNodes[i]
      });

      // Replace the internal tree's point of view of this element.
      virtualNode.childNodes[i] = childNodes[i];
    }
  }

  // Remove these elements.
  if (oldChildNodesLength > newChildNodesLength) {
    // Elements to remove.
    var toRemove = slice.call(virtualNode.childNodes, newChildNodesLength,
      oldChildNodesLength);

    for (var i = 0; i < toRemove.length; i++) {
      // Remove the element, this happens before the splice so that we still
      // have access to the element.
      patches.push({ __do__: 1, old: toRemove[i].element });
    }

    virtualNode.childNodes.splice(newChildNodesLength,
      oldChildNodesLength - newChildNodesLength);
  }

  // Synchronize attributes
  var attributes = liveNode.attributes;

  if (attributes) {
    var oldLength = virtualNode.attributes.length;
    var newLength = attributes.length;

    // Start with the most common, additive.
    if (newLength > oldLength) {
      var toAdd = slice.call(attributes, oldLength);

      for (var i = 0; i < toAdd.length; i++) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toAdd[i].name,
          value: toAdd[i].value,
        };

        // Push the change object into into the virtual tree.
        virtualNode.attributes.push({
          name: toAdd[i].name,
          value: toAdd[i].value
        });

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for removals.
    if (oldLength > newLength) {
      var toRemove = slice.call(virtualNode.attributes, newLength);

      for (var i = 0; i < toRemove.length; i++) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toRemove[i].name,
          value: undefined,
        };

        // Remove the attribute from the virtual node.
        virtualNode.attributes.splice(i, 1);

        // Add the change to the series of patches.
        patches.push(change);
      }
    }

    // Check for modifications.
    var toModify = attributes;

    for (var i = 0; i < toModify.length; i++) {
      var oldAttrValue = virtualNode.attributes[i] &&
        virtualNode.attributes[i].value;
      var newAttrValue = attributes[i] && attributes[i].value;

      // Only push in a change if the attribute or value changes.
      if (oldAttrValue !== newAttrValue) {
        var change = {
          __do__: 2,
          element: virtualNode.element,
          name: toModify[i].name,
          value: toModify[i].value,
        };

        // Replace the attribute in the virtual node.
        virtualNode.attributes[i].name = toModify[i].name;
        virtualNode.attributes[i].value = toModify[i].value;

        // Add the change to the series of patches.
        patches.push(change);
      }
    }
  }

  // Sync each current node.
  for (var i = 0; i < virtualNode.childNodes.length; i++) {
    if (virtualNode.childNodes[i] !== childNodes[i]) {
      syncNode.call(patches, virtualNode.childNodes[i], childNodes[i]);
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
  nodes[id] = node;

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
        push.call(entry.attributes, {
          name: attributes[i].name,
          value: attributes[i].value
        });
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
        entry.childNodes.push(newNode);
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
      'var filter = Array.prototype.filter;',

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
  var worker = new Worker(URL.createObjectURL(workerBlob));
}

/**
 * getElement
 *
 * @param ref
 * @return
 */
function getElement(ref) {
  var element = ref.element || ref;

  // Already created.
  if (element in makeNode.nodes) {
    return makeNode.nodes[element];
  }
  // Need to create.
  else {
    return makeElement(ref);
  }
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

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    let patch = patches[i];
    let elementId, oldId, newId;

    if (patch.element) {
      patch.element = getElement(patch.element);
      elementId = patch.element;
    }

    if (patch.old) {
      patch.old = getElement(patch.old);
      oldId = patch.old.element;
    }


    if (patch.new) {
      patch.new = getElement(patch.new);
      newId = patch.new.element;
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

        patch.fragment.forEach(function(elementDescriptor) {
          var element = getElement(elementDescriptor);

          fragment.appendChild(element);

          // Added state for transitions API.
          if (states && states.added) {
            states.added.forEach(callCallback, element);
          }
        });

        patch.element.appendChild(fragment);

        patch.fragment.forEach(function(elementDescriptor) {
          var element = getElement(elementDescriptor);

          // Ensure the title is set correctly.
          if (element.tagName === 'title') {
            element.ownerDocument.title = element.childNodes[0].nodeValue;
          }
        });
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Can\'t remove without parent, is this the ' +
            'document root?');
        }

        if (states && states.removed) {
          states.removed.forEach(callCallback, patch.old);
        }

        // Ensure the title is emptied.
        if (patch.old.tagName === 'title') {
          patch.old.ownerDocument.title = '';
        }

        patch.old.parentNode.removeChild(patch.old);
        makeNode.nodes[oldId] = null;
        delete makeNode.nodes[oldId];
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
        if (states && states.added) {
          states.added.forEach(function(callback) {
            callback(patch.new);
          });
        }

        // Removed state for transitions API.
        if (states && states.removed) {
          states.removed.forEach(function(callback) {
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
        makeNode.nodes[oldId] = null;
        delete makeNode.nodes[oldId];
      }
    }

    // Attribute manipulation.
    else if (patch.__do__ === 2) {
      // Remove.
      if (!patch.value) { patch.element.removeAttribute(patch.name); }
      else { patch.element.setAttribute(patch.name, patch.value); }
    }

    // Text node manipulation.
    else if (patch.__do__ === 3) {
      patch.element.textContent = patch.value;

      if (patch.element.parentNode === null) {
        document.title = patch.value;
      }
    }
  }
}

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

  //TODO New error here
  //if (typeof newHTML !== 'string') {
  //  throw new Error('Invalid type passed to diffHTML, expected String');
  //}

  // Only calculate the parent's initial state one time.
  if (!element.__old_tree__) {
    element.__old_tree__ = makeNode(element);
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
    var transferObject = {
      oldTree: element.__old_tree__
    };

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
        element.__is_rendering__ = false;
      };

      return;
    }

    // Used to specify the outerHTML offset if passing the parent's markup.
    var offset = 0;

    // Craft a new buffer with the new contents.
    var newBuffer = buffers.stringToBuffer(newHTML);

    // Set the offset to be this byte length.
    offset = newBuffer.byteLength;

    // Calculate the bytelength for the transfer buffer, contains one extra for
    // the offset.
    var transferByteLength = newBuffer.byteLength;

    // This buffer starts with the offset and contains the data to be carried
    // to the worker.
    var transferBuffer = new Uint16Array(transferByteLength);

    // Set the newHTML payload.
    transferBuffer.set(newBuffer, 0);

    // Add properties to send to worker.
    transferObject.offset = newBuffer.byteLength;
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
      element.__is_rendering__ = false;
    };
  }
  else if (!options.enableWorker || !hasWorker || !element.__has_rendered__) {
    var patches = [];
    var oldTree = element.__old_tree__;
    var newTree = typeof newHTML === 'string' ?
      parseHTML(newHTML, options.inner) : makeNode(newHTML);

    if (options.inner) {
      var childNodes = newTree;

      newTree = {
        attributes: oldTree.attributes,
        childNodes: childNodes,
        element: oldTree.element,
        nodeName: oldTree.nodeName,
        nodeValue: oldTree.nodeValue
      };
    }

    var oldNodeName = oldTree.nodeName || '';
    var newNodeName = newTree && newTree.nodeName;

    // If the element node types match, try and compare them.
    if (oldNodeName === newNodeName) {
      // Synchronize the tree.
      syncNode.call(patches, element.__old_tree__, newTree);
    }
    // Otherwise replace the top level elements.
    else if (newHTML) {
      patches.push({
        __do__: 0,
        old: oldTree,
        new: newTree
      });

      element.__old_tree__ = newTree;
    }

    // Process the patches immediately.
    processPatches(element, { data: patches });

    // Mark this element as initially rendered.
    if (!element.__has_rendered__) {
      element.__has_rendered__ = true;
    }

    // Element has stopped rendering.
    element.__is_rendering__ = false;

    // Clean out the patches array.
    patches.length = 0;
  }
}
