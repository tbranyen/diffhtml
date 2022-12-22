import { InstanceCache, VTree } from '../util/types';
import diff from '../util/binding';
import { $$children, $$hooks } from '../util/symbols';

const { release, Internals } = diff;

/**
 * This is called whenever a component is removed or in the case of a function
 * component is called whenever a component is updated.
 *
 * @param {VTree} vTree - The respecting tree pointing to the component
 */
export default function componentWillUnmount(vTree) {
  const domNode = Internals.NodeCache.get(vTree);

  // Clean up attached Shadow DOM.
  if (domNode && /** @type {any} */ (domNode).shadowRoot) {
    release(/** @type {any} */ (domNode).shadowRoot);
  }

  for (let i = 0; i < vTree.childNodes.length; i++) {
    componentWillUnmount(vTree.childNodes[i]);
  }

  if (!InstanceCache.has(vTree)) {
    return;
  }

  const instance = InstanceCache.get(vTree);
  InstanceCache.delete(vTree);

  // Empty out all hooks for gc. If using a stateless class or function, they
  // may not have this value set.
  if (instance[$$hooks]) {
    instance[$$hooks].fns.length = 0;
    instance[$$hooks].i = 0;
  }

  // Ensure children are released as well.
  release(instance[$$children]);

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  instance && instance.componentWillUnmount && instance.componentWillUnmount();
}
