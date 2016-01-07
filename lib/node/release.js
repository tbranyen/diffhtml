import { TreeCache } from './tree';
import { cleanMemory, unprotectElement } from '../util/memory';

/**
 * Release's the allocated objects and recycles internal memory.
 *
 * @param element
 */
export default function releaseNode(element) {
  let elementMeta = TreeCache.get(element);

  if (elementMeta) {
    // If there is a worker associated with this element, then kill it.
    if (elementMeta.worker) {
      elementMeta.worker.terminate();
    }

    // If there was a tree set up, recycle the memory allocated for it.
    if (elementMeta.oldTree) {
      unprotectElement(elementMeta.oldTree, makeNode);
    }

    // Remove this element's meta object from the cache.
    TreeCache.delete(element);
  }

  cleanMemory();
}
