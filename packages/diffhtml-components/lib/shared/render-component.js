import { ComponentTreeCache, InstanceCache, VTree } from '../util/types';
import { $$vTree } from '../util/symbols';
import { getBinding } from '../util/binding';

const { createTree } = getBinding();

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
  const Component = vTree.rawNodeName;
  const props = vTree.attributes;
  const isNewable = Component.prototype && Component.prototype.render;

  let instances = null;
  let renderTree = null;

  // Existing component.
  if (InstanceCache.has(vTree)) {
    instances = InstanceCache.get(vTree);

    // If a component chain can early, return, bail out. This happens with
    // HoC.
    let earlyReturn = false;

    // Loop over all the instances and bail out early if possible.
    instances && instances.forEach(instance => {
      if (earlyReturn) {
        return;
      }

      if (instance.componentWillReceiveProps) {
        instance.componentWillReceiveProps(props);
      }

      // Wipe out all old references before re-rendering.
      ComponentTreeCache.forEach((_vTree, childNode) => {
        if (_vTree === vTree) {
          ComponentTreeCache.delete(childNode);
        }
      });

      if (
        instance.shouldComponentUpdate &&
        instance.shouldComponentUpdate(props, instance.state)
      ) {
        renderTree = createTree(instance.render(props, instance.state));

        if (instance.componentDidUpdate && instance.componentDidUpdate) {
          instance.componentDidUpdate(instance.props, instance.state);
        }
      }
      else {
        earlyReturn = true;
      }
    });
  }
  // New class instance.
  else if (isNewable) {
    const instance = new Component(props);

    // Associate the instance to the vTree.
    InstanceCache.set(vTree, [instance]);

    // Signal the component is about to mount.
    if (instance.componentWillMount) {
      instance.componentWillMount();
    }

    // Initial render of the class component.
    renderTree = createTree(instance.render(props, instance.state));

    // Ensure at least a single element was returned, unless this is a dynamic
    // component that needs to be rendered. If nothing usable is found, assume
    // this is an empty fragment.
    if (
      renderTree.nodeType === 11 &&
      renderTree.childNodes.length === 0 &&
      typeof renderTree.rawNodeName !== 'function'
    ) {
      renderTree = createTree([]);
    }

    const isHOC = typeof renderTree.rawNodeName === 'function';

    // If the component returned is a function, treat as a HoC and inject
    // the parent class into it (if it's newable).
    if (isHOC) {
      // Render the nested component.
      const retVal = renderComponent(renderTree);

      // Get the newly created instance, if it exists.
      const renderedInstances = InstanceCache.get(renderTree);

      // Push the parent to the front, so long as a child instance was created.
      if (renderedInstances) {
        renderedInstances.unshift(instance);
      }
      // Otherwise setup the instance cache against this VTree for the first
      // time.
      else if (retVal) {
        InstanceCache.set(retVal, [instance]);
      }

      instance[$$vTree] = vTree;
      ComponentTreeCache.set(retVal, vTree);
      return retVal;
    }
    else {
      InstanceCache.set(renderTree, [instance]);
    }

    instance[$$vTree] = vTree;
  }
  // Function component, as these are relatively stateless we can short-circut
  // the linkTrees.
  else {
    return createTree(Component(props));
  }

  /**
   * Associate the children with the parent component that rendered them, this
   * is used to trigger lifecycle events. It also allows for render functions
   * to return an array of VTree or multiple top level HTML elements.
   *
   * @param {VTree[]} childNodes
   */
  const linkTrees = childNodes => {
    for (let i = 0; i < childNodes.length; i++) {
      const newTree = childNodes[i];

      // If the newTree is not a Fragment, associate the `newTree` with the
      // originating `vTree`.
      if (newTree && newTree.nodeType !== 11) {
        ComponentTreeCache.set(newTree, vTree);
      }
    }
  };

  // Maybe this isn't necessary? For now it helps track, but this is costly
  // and perhaps can be solved in a different way.
  if (renderTree) {
    linkTrees(renderTree.nodeType === 11 ? renderTree.childNodes : [renderTree]);
  }

  return renderTree;
};
