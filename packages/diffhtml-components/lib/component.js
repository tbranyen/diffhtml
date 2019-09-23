import process from './util/process';
import PropTypes from './util/prop-types';
import { use, outerHTML, createTree, release, Internals } from 'diffhtml';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { ComponentTreeCache } from './util/caches';
import { $$render, $$vTree } from './util/symbols';

const { NodeCache, createNode, syncTree } = Internals;
const { keys, assign } = Object;
const FRAGMENT = '#document-fragment';

class Component {
  [$$vTree] = null;

  [$$render]() {
    const vTree = this[$$vTree];

    // Find all previous nodes rendered by this component.
    const childNodes = [...ComponentTreeCache.keys()].filter(key => {
      const rootTree = ComponentTreeCache.get(key);

      if (rootTree === vTree) {
        ComponentTreeCache.delete(key);
        return true;
      }
    });

    // By default assume a single top/root-level element, if there are multiple
    // elements returned at the root-level, then we'll do a diff and replace a
    // fragment from this root point.
    const domNode = NodeCache.get(childNodes[0]);

    // If there is no DOM Node association then error out.
    if (process.env.NODE_ENV !== 'production') {
      if (!domNode) {
        throw new Error('Missing DOM Node association to this component');
      }

      // Throw an error if we are not connected, cannot use stateful components
      // if they are rendered shallow.
      if (!domNode.parentNode) {
        throw new Error('Cannot use stateful features when rendered shallow');
      }
    }

    let renderTree = this.render();

    // Need to handle multiple top-level rendered elements special, this
    // requires creating two containers, one for the old children and one for
    // the new children.
    if (childNodes.length > 1) {
      // Create a placeholder to mark where the elements were as we rip them
      // from the connected DOM and into a fragment to work on.
      const placeholder = document.createComment('');

      // Replace one of the original references with the placeholder, so that
      // when elements are taken out of the page (with a fragment below) we'll
      // know where to put the new elements.
      domNode.parentNode.replaceChild(placeholder, domNode);

      // Pull the previously rendered DOM nodes out of the page and into a
      // container fragment for diffing.
      const fragment = createNode({ nodeName: FRAGMENT, childNodes });

      // Ensure a fragment is always used.
      if (renderTree.nodeType !== 11) {
        renderTree = createTree(FRAGMENT, null, renderTree);
      }

      // Diff the fragments together.
      outerHTML(fragment, renderTree);

      // Remap the new elements into the system.
      [].slice.apply(fragment.childNodes).forEach(childNode => {
        ComponentTreeCache.set(createTree(childNode), vTree);
      });

      // Replace the fragments back in.
      placeholder.parentNode.replaceChild(fragment, placeholder);
    }
    else {
      outerHTML(domNode, renderTree);

      // FIXME Does `renderTree` we need to be here? Is this association
      // necessary?
      [renderTree, ...renderTree.childNodes].forEach(childTree => {
        ComponentTreeCache.set(childTree, vTree);
      });
    }

    this.componentDidUpdate(this.props, this.state);
  }

  constructor(initialProps, initialContext) {
    initialProps && (initialProps.refs || (initialProps.refs = {}));

    const props = this.props = assign({}, initialProps);
    const state = this.state = {};
    const context = this.context = assign({}, initialContext);

    if (props.refs) {
      this.refs = props.refs;
    }

    const {
      defaultProps = {},
      propTypes = {},
      childContextTypes = {},
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
