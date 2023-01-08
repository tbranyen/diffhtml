import {
  MountCache,
  ActiveRenderState,
  InstanceCache,
  VTree,
  Transaction,
} from './util/types';
import { $$hooks, $$vTree } from './util/symbols';
import diff from './util/binding';
import Component from './component';

const { createTree, Internals } = diff;

/**
 * Used during a synchronization flow. Takes in a vTree and a context object
 * and renders the component as a class or a function. Calls standard lifecycle
 * methods.
 *
 * This is a recursive function and will continue to render until all components
 * are done or a non-component VTree is hit.
 *
 * @param {VTree} vTree - VTree to render
 * @param {Transaction} transaction - used to key mounts to a transaction
 *
 * @returns {VTree | null}
 */
export default function renderComponent(vTree, transaction) {
  const props = vTree.attributes;
  const RawComponent = vTree.rawNodeName;
  const isNewable = RawComponent.prototype && RawComponent.prototype.render;
  const isInstance = InstanceCache.has(vTree);

  /** @type {VTree|null} */
  let renderedTree = (null);

  // Existing class component rerender.
  if (isInstance) {
    const instance = InstanceCache.get(vTree);

    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(props);
    }

    if (
      instance.shouldComponentUpdate &&
      instance.shouldComponentUpdate(props, instance.state)
    ) {
      ActiveRenderState.push(instance);

      // Reset the hooks iterator.
      instance[$$hooks].i = 0;
      renderedTree = createTree(instance.render(props, instance.state));

      ActiveRenderState.length = 0;

      if (instance.componentDidUpdate && instance.componentDidUpdate) {
        instance.componentDidUpdate(instance.props, instance.state);
      }

      instance[$$vTree] = vTree;
      vTree.childNodes.length = 0;
      vTree.childNodes.push(renderedTree);
    }
    else {
      return renderedTree;
    }
  }
  // New class instance.
  else if (isNewable) {
    /** @type {Component} */
    const instance = new RawComponent(props);

    // Associate the instance to the vTree.
    InstanceCache.set(vTree, instance);

    ActiveRenderState.push(instance);

    // Initial render of the class component, this should not be called again
    // for the same component in the same position. It will be picked up
    // automatically as a class component and rendered via its own Transaction.
    const renderRetVal = instance.render(props, instance.state);

    ActiveRenderState.length = 0;
    MountCache.get(transaction)?.add(instance);

    renderedTree = createTree(renderRetVal || '#text');

    if (
      typeof renderedTree.rawNodeName !== 'function' &&
      renderedTree.nodeType === Internals.NODE_TYPE.FRAGMENT &&
      !renderedTree.childNodes.length
    ) {
      renderedTree = createTree('#text');
    }

    // Replace the VTree with the rendered component
    if (renderedTree.nodeType === Internals.NODE_TYPE.FRAGMENT) {
      vTree.childNodes.push(...renderedTree.childNodes);
    }
    else {
      vTree.childNodes.push(renderedTree);
    }

    InstanceCache.set(renderedTree, instance);
    instance[$$vTree] = vTree;
  }
  // Function component, upgrade to a class to make it reactive.
  else {
    class FunctionComponent extends Component {
      /**
       * @param {any} props
       */
      constructor(props) {
        super(props);
      }

      /**
       * @param {any} props
       * @param {any} state
       */
      render(props, state) {
        return createTree(RawComponent(props, state));
      }

      /** @type {VTree | null} */
      [$$vTree] = vTree;
    }

    const instance = new FunctionComponent(props)

    // Associate the instance to the vTree.
    InstanceCache.set(vTree, instance);

    // Allow hooks to "hook" into the active rendering component.
    ActiveRenderState.push(instance);

    let renderRetVal = null;

    try {
      renderRetVal = instance.render(props, instance.state);
    }
    catch (e) {
      // Clean up after a potential failure.
      ActiveRenderState.length = 0;
      MountCache.delete(transaction);
      throw e;
    }

    ActiveRenderState.length = 0;

    MountCache.get(transaction)?.add(instance);

    renderedTree = createTree(renderRetVal || '#text');

    // If the rendered return value is an empty fragment, default to an empty
    // text value.
    if (
      typeof renderedTree.rawNodeName !== 'function' &&
      renderedTree.nodeType === Internals.NODE_TYPE.FRAGMENT &&
      !renderedTree.childNodes.length
    ) {
      renderedTree = createTree('#text');
    }

    // Associate the instance with the vTree.
    // Replace the VTree with the rendered component
    instance[$$vTree] = renderedTree;
    vTree.childNodes.push(renderedTree);

    InstanceCache.set(renderedTree, instance);
  }

  Internals.memory.protectVTree(vTree);

  // If a new component was rendered instead of a DOM node, we need to continue
  // rendering until we reach the end.
  if (typeof renderedTree.rawNodeName === 'function') {
    vTree.childNodes.length = 0;
    vTree.childNodes.push(renderComponent(renderedTree, transaction));
  }

  return renderedTree;
};
