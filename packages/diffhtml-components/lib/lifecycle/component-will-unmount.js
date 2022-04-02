import { ComponentTreeCache, InstanceCache, VTree } from '../util/types';
import diff from '../util/binding';
import { $$hooks } from '../util/symbols';

const { release, Internals } = diff;

/**
 * Called whenever a component is being removed.
 *
 * @param {VTree} vTree - The respecting tree pointing to the component
 */
export default function componentWillUnmount(vTree) {
  const componentTree = ComponentTreeCache.get(vTree);

  /** @type {VTree[]} */
  const childTrees = [];

  ComponentTreeCache.forEach((parentTree, childTree) => {
    if (parentTree === componentTree) {
      childTrees.push(childTree);
    }
  });

  const domNode = Internals.NodeCache.get(vTree);

  // Clean up attached Shadow DOM.
  if (domNode && /** @type {any} */ (domNode).shadowRoot) {
    release(/** @type {any} */ (domNode).shadowRoot);
  }

  vTree.childNodes.forEach(componentWillUnmount);

  if (!InstanceCache.has(componentTree)) {
    return;
  }

  const instance = InstanceCache.get(componentTree);
  InstanceCache.delete(componentTree);

  // Empty out all hooks for gc. If using a stateless class or function, they
  // may not have this value set.
  if (instance[$$hooks]) {
    instance[$$hooks].fns.length = 0;
    instance[$$hooks].i = 0;
  }

  ComponentTreeCache.delete(vTree);

  // If there is a parent, ensure it is called recursively.
  if (ComponentTreeCache.has(componentTree)) {
    componentWillUnmount(componentTree);
  }

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  instance && instance.componentWillUnmount && instance.componentWillUnmount();
}
