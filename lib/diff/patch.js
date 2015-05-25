var pools = require('../util/pools');
var parseHTML = require('../util/parse_html');
var makeNode = require('./make_node');
var syncNode = require('./sync_node');

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML) {
  // This is called one time to produce the virtual tree representation of the
  // live element tree.  We attach this directly to the element, because we're
  // fearless like that.
  if (!element.__tree__) { element.__tree__ = makeNode(element); }

  // Nothing to do here.
  if (element.__tree__.source === newHTML) {
    return;
  }

  // Keep a copy of the source.
  element.__tree__.source = newHTML;

  var nodeName = element.nodeName;

  // Create a live representation of the new markup.
  var liveTree = parseHTML(nodeName, newHTML);
  var patches = pools.array.get();

  // Synchronize the element virtual tree with the new live element tree.  This
  // will produce a series of patches that will be excuted to update the DOM.
  syncNode.call(patches, element.__tree__, liveTree);

  // Clear out the live tree.
  liveTree = null;

  // Loop through all the patches and apply them.
  for (var i = 0; i < patches.length; i++) {
    var patch = patches[i];

    // Quickly empty entire childNodes.
    if (patch.__do__ === -1) {
      patch.element.innerHTML = '';
      continue;
    }

    // Node manip.
    else if (patch.__do__ === 1) {
      // Add.
      if (patch.element && patch.fragment && !patch.old) {
        patch.element.appendChild(patch.fragment);
      }

      // Remove
      else if (patch.old && !patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Attempting to remove element without a parentNode');
        }

        patch.old.parentNode.removeChild(patch.old);
      }

      // Replace
      else if (patch.old && patch.new) {
        if (!patch.old.parentNode) {
          throw new Error('Cannot replace the document element');
        }

        document.adoptNode(patch.new);
        patch.old.parentNode.replaceChild(patch.new, patch.old);
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
      patch.element.nodeValue = patch.value;
    }
  }

  pools.array.free(patches);
}

module.exports = patch;
