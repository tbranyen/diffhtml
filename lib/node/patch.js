import { protectElement, unprotectElement } from '../util/memory';
import { parse } from '../util/parser';
import { completeRender } from '../util/render';
import makeNode from './make';
import processPatches from '../patches/process';
import syncNode from './sync';
import { TreeCache } from './tree';
import { pools } from '../util/pools';

/**
 * Patches an element's DOM to match that of the passed markup.
 *
 * @param element
 * @param newHTML
 * @param options
 */
export default function patchNode(element, newHTML, options) {
  // The element meta object is a location to associate metadata with the
  // currently rendering element. This prevents attaching properties to the
  // instance itself.
  var elementMeta = TreeCache.get(element) || {};

  // Last options used.
  elementMeta.options = options;

  // Always ensure the most up-to-date meta object is stored.
  TreeCache.set(element, elementMeta);

  var bufferSet = false;
  var isInner = options.inner;
  var previousMarkup = elementMeta.previousMarkup;

  // If this element is already rendering, add this new render request into the
  // buffer queue. Check and see if any element is currently rendering, can
  // only do one at a time.
  TreeCache.forEach(function iterateTreeCache(_elementMeta, _element) {
    if (_elementMeta.isRendering) {
      elementMeta.renderBuffer = { element, newHTML, options };
      bufferSet = true;
    }
  });

  // Short circuit the rest of this render.
  if (bufferSet) { return; }

  var sameInnerHTML = isInner ? previousMarkup === element.innerHTML : true;
  var sameOuterHTML = !isInner ? previousMarkup === element.outerHTML : true;
  var sameTextContent = elementMeta._textContent === element.textContent;

  // If the contents haven't changed, abort, since there is no point in
  // continuing. Only support this if the new markup is a string, otherwise
  // it's possible for our object recycling to match twice.
  if (typeof newHTML === 'string' && elementMeta.newHTML === newHTML) {
    return;
  }
  // Associate the last markup rendered with this element.
  else if (typeof newHTML === 'string') {
    elementMeta.newHTML = newHTML;
  }

  var rebuildTree = function rebuildTree() {
    var oldTree = elementMeta.oldTree;

    if (oldTree) {
      unprotectElement(oldTree);
    }

    elementMeta.oldTree = protectElement(makeNode(element));
  };

  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    rebuildTree();
  }

  // We're rendering in the UI thread.
  elementMeta.isRendering = true;

  let newTree = null;

  if (typeof newHTML === 'string') {
    let childNodes = parse(newHTML).childNodes;
    newTree = isInner ? childNodes : childNodes[0];
  }
  else if (newHTML.ownerDocument) {
    let vTree = makeNode(newHTML);
    newTree = vTree.nodeType === 11 ? vTree.childNodes : vTree;
  }
  else {
    newTree = newHTML;
  }

  if (options.inner) {
    newTree = {
      childNodes: [].concat(newTree),
      attributes: elementMeta.oldTree.attributes,
      nodeName: elementMeta.oldTree.nodeName,
      nodeValue: elementMeta.oldTree.nodeValue
    };
  }

  // Synchronize the tree.
  let patches = syncNode(elementMeta.oldTree, newTree);
  let invokeRender = completeRender(element, elementMeta);

  // Process the data immediately and wait until all transition callbacks
  // have completed.
  let promises = processPatches(element, patches);

  // Operate synchronously unless opted into a Promise-chain.
  if (promises.length) {
    Promise.all(promises).then(invokeRender, ex => console.log(ex));
  }
  else {
    invokeRender();
  }
}
