import { ComponentTreeCache, InstanceCache, VTree } from '../util/types';
import { invokeRefsForVTrees } from './invoke-refs';

/**
 * @param {VTree} vTree
 *
 * @returns {void}
 */
export default function componentDidMount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);

  /** @type {VTree[]} */
  const childTrees = [];

  ComponentTreeCache.forEach((parentTree, childTree) => {
    if (parentTree === componentTree) {
      childTrees.push(childTree);
    }
  });

  invokeRefsForVTrees(vTree);

  // Only trigger a mount for the first element.
  if (childTrees.length === 0 || childTrees[0] !== vTree) {
    return;
  }

  for (let i = 0; i < childTrees.length; i++) {
    const childTree = childTrees[i];

    if (childTree.childNodes.length) {
      childTree.childNodes.forEach(componentDidMount);
    }
  }

  // If there is a parent, ensure it is called recursively.
  if (ComponentTreeCache.has(componentTree)) {
    componentDidMount(componentTree);
  }

  const instance = InstanceCache.get(componentTree);
  instance && instance.componentDidMount && instance.componentDidMount();
}
