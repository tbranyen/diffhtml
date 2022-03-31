import {
  ComponentTreeCache,
  ActiveRenderState,
  InstanceCache,
  VTree,
} from './util/types';
import { $$vTree } from './util/symbols';
import diff from './util/binding';
import Component from './component';

const { createTree } = diff;

/**
 * Used during a synchronization flow. Takes in a vTree and a context object
 * and renders the component as a class or a function. Calls standard lifecycle
 * methods.
 *
 * @param {VTree} vTree - tree to render
 *
 * @returns {VTree | null}
 */
export default function renderComponent(vTree) {
  const RawComponent = vTree.rawNodeName;
  const props = vTree.attributes;
  const isNewable = RawComponent.prototype && RawComponent.prototype.render;

  /** @type {VTree|null} */
  let renderedTree = (null);

  // Existing class component rerender.
  if (InstanceCache.has(vTree)) {
    const instance = InstanceCache.get(vTree);

    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(props);
    }

    if (
      instance.shouldComponentUpdate &&
      instance.shouldComponentUpdate(props, instance.state)
    ) {
      // Wipe out all old references before re-rendering.
      ComponentTreeCache.forEach((parentTree, childTree) => {
        if (parentTree === vTree) {
          ComponentTreeCache.delete(childTree);
        }
      });

      ActiveRenderState.push(instance);
      renderedTree = createTree(instance.render(props, instance.state));
      ActiveRenderState.length = 0;

      if (instance.componentDidUpdate && instance.componentDidUpdate) {
        instance.componentDidUpdate(instance.props, instance.state);
      }
    }
    else {
      return null;
    }
  }
  // New class instance.
  else if (isNewable) {
    const instance = new RawComponent(props);

    // Associate the instance to the vTree.
    InstanceCache.set(vTree, instance);

    // Signal the component is about to mount.
    if (instance.componentWillMount) {
      instance.componentWillMount();
    }

    ActiveRenderState.push(instance);

    // Initial render of the class component, this should not be called again
    // for the same component in the same position. It will be picked up
    // automatically as a class component and rendered via its own Transaction.
    const renderRetVal = instance.render(props, instance.state);

    ActiveRenderState.length = 0;

    renderedTree = createTree(renderRetVal || '#text');

    if (
      typeof renderedTree.rawNodeName !== 'function' &&
      renderedTree.nodeType === 11 &&
      !renderedTree.childNodes.length
    ) {
      renderedTree = createTree('#text');
    }

    // Set up the HoC parent/child relationship.
    if (typeof renderedTree.rawNodeName === 'function') {
      ComponentTreeCache.set(renderedTree, vTree);
    }

    // Associate the instance with the vTree.
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
      [$$vTree] = null;
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
      throw e;
    }

    ActiveRenderState.length = 0;

    renderedTree = createTree(renderRetVal || '#text');

    // If the rendered return value is an empty fragment, default to an empty
    // text value.
    if (
      typeof renderedTree.rawNodeName !== 'function' &&
      renderedTree.nodeType === 11 &&
      !renderedTree.childNodes.length
    ) {
      renderedTree = createTree('#text');
    }

    // Set up the HoC parent/child relationship.
    if (typeof renderedTree.rawNodeName === 'function') {
      ComponentTreeCache.set(renderedTree, vTree);
    }

    // Associate the instance with the vTree.
    instance[$$vTree] = vTree;
  }

  if (renderedTree !== vTree) {
    // Map all top-level fragment elements to this parent node.
    if (renderedTree.nodeType === 11) {
      renderedTree.childNodes.forEach(childNode => {
        ComponentTreeCache.set(childNode, vTree);
      });
    }
    // Otherwise directly map the rendered VTree to the component tree.
    else {
      ComponentTreeCache.set(renderedTree, vTree);
    }
  }

  return renderedTree;
};
