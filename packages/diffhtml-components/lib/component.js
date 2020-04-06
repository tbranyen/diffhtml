import process from './util/process';
import PropTypes from './util/prop-types';
import { outerHTML, createTree, Internals, release } from 'diffhtml';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { ComponentTreeCache } from './util/caches';
import { $$render, $$vTree } from './util/symbols';

const { NodeCache, createNode } = Internals;
const { from } = Array;
const { keys, assign } = Object;
const FRAGMENT = '#document-fragment';

class Component {
  [$$vTree] = null;

  [$$render]() {
    const vTree = this[$$vTree];

    // Find all previous nodes rendered by this component and remove them
    // from the cache.
    const childNodes = from(ComponentTreeCache.keys()).filter(key => {
      const rootTree = ComponentTreeCache.get(key);

      if (rootTree === vTree) {
        ComponentTreeCache.delete(key);
        return true;
      }
    });

    // By default assume a single top/root-level element, if there are multiple
    // elements returned at the root-level, then we'll do a diff and replace a
    // fragment from this root point.
    /** @type {HTMLElement | any} */
    let domNode = (NodeCache.get(childNodes[0]));

    // If there is no DOM Node association then error out.
    if (process.env.NODE_ENV !== 'production') {
      if (!domNode) {
        throw new Error('Missing DOM Node association to this component');
      }

      // Throw an error if we are not connected, cannot use stateful components
      // if they are rendered shallow.
      if (!domNode.parentNode) {
        throw new Error('Cannot use stateful features when shallow rendered');
      }
    }

    // Render directly from the Component.
    let renderTree = this.render();

    // Need to handle multiple top-level rendered elements special, this
    // requires creating two containers, one for the old children and one for
    // the new children.
    if (childNodes.length > 1) {
      // Put all the nodes together into a fragment for diffing.
      const fragment = createTree(FRAGMENT, null, childNodes);

      // Ensure a fragment is always used.
      if (renderTree.nodeType !== 11) {
        renderTree = createTree(FRAGMENT, null, renderTree);
      }

      // TODO Need to figure out how to support diffing fragment to fragment.
      const prevLength = fragment.childNodes.length;

      childNodes.slice(1).forEach(childNode => {
        const domNode = NodeCache.get(childNode);
        domNode.parentNode && domNode.parentNode.removeChild(domNode);
      });

      outerHTML(fragment, renderTree);

      domNode.parentNode.replaceChild(createNode(fragment), domNode);

      // Loop over the nodes created
      fragment.childNodes.forEach(childTree => {
        ComponentTreeCache.set(childTree, vTree);
      });

      release(fragment);
    }
    else {
      outerHTML(domNode, renderTree);
      ComponentTreeCache.set(renderTree, vTree);
    }

    this.componentDidUpdate(this.props, this.state);
  }

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
}

// Wrap this base class with shared methods.
export default upgradeSharedClass(Component);
