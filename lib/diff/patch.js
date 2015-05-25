var DOMParser = require('../util/dom_parser');
var parseHTML = require('../util/parse_html');
var makeNode = require('./make_node');

var fn = require('../worker').toString();
var workerBody = fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}'));
var workerBlob = new Blob([workerBody], { type: 'text/javascript' });
var worker = new Worker(window.URL.createObjectURL(workerBlob));

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 */
function patch(element, newHTML) {
  var isNew = false;

  // This is called one time to produce the virtual tree representation of the
  // live element tree.  We attach this directly to the element, because we're
  // fearless like that.
  if (!element.__tree__) {
    isNew = true;
    element.__tree__ = makeNode(element);
  }

  // Create a live representation of the new markup.
  var liveTree = makeNode(parseHTML(newHTML));
  var syncRequest = [liveTree];

  if (isNew) {
    syncRequest.push(element.__tree__);
  }

  // Fire off a sync request.
  worker.postMessage(syncRequest);

  // Await patches.
  worker.onmessage = function(e) {
    var patches = e.data;

    // Loop through all the patches and apply them.
    for (var i = 0; i < patches.length; i++) {
      var patch = patches[i];

      // Convert ids to nodes.
      if (patch.element) {
        patch.element = makeNode.getNodeById(patch.element);
      }

      // Quickly empty entire childNodes.
      if (patch.__do__ === -1) {
        patch.element.innerHTML = '';
        continue;
      }

      // Node manip.
      else if (patch.__do__ === 1) {

        if (patch.old) {
          patch.old = makeNode.getNodeById(patch.old);
        }

        if (patch.new) {
          patch.new = makeNode.getNodeById(patch.new);
        }

        if (patch.fragment) {
          var fragment = document.createDocumentFragment();
          patch.fragment.forEach(function(id) {
            fragment.appendChild(makeNode.getNodeById(id));
          });
          patch.fragment = fragment;
        }

        // Add.
        if (patch.element && patch.fragment && !patch.old) {
          patch.element.appendChild(patch.fragment);
        }

        // Remove
        else if (patch.old && !patch.new) {
          if (!patch.old.parentNode) {
            throw new Error('Cannot remove the document element');
          }

          patch.old.parentNode.removeChild(patch.old);
        }

        // Replace
        else if (patch.old && patch.new) {
          if (!patch.old.parentNode) {
            throw new Error('Cannot replace the document element');
          }

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
  };
}

module.exports = patch;
