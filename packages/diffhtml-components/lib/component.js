import process from './util/process';
import PropTypes from './util/prop-types';
import { outerHTML, createTree, Internals, release } from 'diffhtml';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { ComponentTreeCache } from './util/caches';
import { $$render, $$vTree } from './util/symbols';

const { NodeCache, createNode, memory } = Internals;
const { from } = Array;
const { keys, assign } = Object;
const FRAGMENT = '#document-fragment';

/**
 * Represents a Component
 */
class Component {
  constructor(initialProps, initialContext) {
    initialProps && (initialProps.refs || (initialProps.refs = {}));

    const props = this.props = assign({}, initialProps);
    this.state = {};
    const context = this.context = assign({}, initialContext);

    if (props.refs) {
      this.refs = props.refs;
    }

    const {
      defaultProps = {},
      propTypes = {},
      contextTypes = {},
      name,
    } = this.constructor;

    // Merge default props into props object.
    keys(defaultProps).forEach(prop => {
      if (prop in props && props[prop] !== undefined) {
        return;
      }

      this.props[prop] = defaultProps[prop];
    });

    if (process.env.NODE_ENV !== 'production') {
      if (PropTypes && PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, props, 'prop', name);
        PropTypes.checkPropTypes(contextTypes, context, 'context', name);
      }
    }
  }

  [$$vTree] = null;

  /**
   * Stateful render. Used when a component changes and needs to re-render
   * itself. This is triggered on `setState` and `forceUpdate` calls.
   *
   * @return {void}
   */
  [$$render]() {
    // Get the fragment tree associated with this component. This is used to
    // lookup rendered children.
    const vTree = this[$$vTree];

    // Find all previously rendered top-level children associated to this
    // component. This will be used to diff against the newly rendered
    // elements.
    const childTrees = from(ComponentTreeCache.keys()).filter(key => {
      const rootTree = ComponentTreeCache.get(key);

      if (rootTree === vTree) {
        // Remove from the cache, since these elements may be removed or
        // replaced.
        ComponentTreeCache.delete(key);
        return true;
      }
    });

    // Map all the childnodes.
    const childNodes = childTrees.map(x => NodeCache.get(x));

    /**
     * By default assume a single top/root-level element, if there are multiple
     * elements returned at the root-level, then we'll do a diff and replace a
     * fragment from this root point.
     *
     * @type {HTMLElement | any}
     */
    const domNode = (childNodes[0]);

    // Do not attempt to re-render if we do not have prior children.
    // TODO This is cheating until there is a better way to determine if a
    // component has rendered or not.
    if (!domNode || !domNode.parentNode) {
      return;
    }

    // If there is no DOM Node association then error out.
    //if (process.env.NODE_ENV !== 'production') {
    //  if (!domNode) {
    //    throw new Error('Missing DOM Node association to this component');
    //  }

    //  // Throw an error if we are not connected, cannot use stateful components
    //  // if they are rendered shallow.
    //  if (!domNode.parentNode) {
    //    throw new Error('Cannot use stateful features when shallow rendered');
    //  }
    //}

    const { parentNode } = domNode;

    // Render directly from the Component.
    let renderTree = this.render(this.props, this.state, this.context);

    // Do not render.
    if (!renderTree) {
      return;
    }

    // Put all the nodes together into a fragment for diffing.
    const fragment = createTree(this.constructor, null, childTrees);

    // Always compare a fragment to a fragment. If the renderTree was not
    // wrapped, ensure it is here.
    if (renderTree.nodeType !== 11) {
      renderTree = createTree(this.constructor, null, renderTree);
    }

    // Compare the existing component node(s) to the new node(s).
    const promise = outerHTML(fragment, renderTree)

    // Track the last known node so when insertions happen they are easily
    // executed adjacent to this element.
    let lastNode = domNode;

    // Reconcile all top-level replacements and additions.
    fragment.childNodes.forEach((childTree, i) => {
      const newNode = createNode(childTree);
      NodeCache.set(childTree, newNode);
      const oldNode = NodeCache.get(childTrees[i]);

      // Replace if the nodes are different.
      if (newNode && oldNode && childTrees[i] !== childTree) {
        parentNode.replaceChild(
          newNode,
          oldNode,
        );

        // Reset last node, since it has been replaced.
        lastNode = newNode;

        ComponentTreeCache.set(childTree, vTree);
        memory.protectVTree(childTree);
      }
      // Add if there is no missing Node.
      else if (!oldNode) {
        lastNode.after(newNode);
        lastNode = newNode;

        ComponentTreeCache.set(childTree, vTree);
        memory.protectVTree(childTree);
      }
      // Keep the old node.
      else {
        ComponentTreeCache.set(childTrees[i], vTree);
        lastNode = oldNode;
        memory.protectVTree(childTrees[i]);
      }
    });

    promise.then(() => {
      // Empty the fragment after using.
      fragment.childNodes.length = 0;
      release(fragment);

      this.componentDidUpdate(this.props, this.state);
    });
  }
}

// Wrap this base class with shared methods.
export default upgradeSharedClass(Component);
