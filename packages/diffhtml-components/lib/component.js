import process from './util/process';
import PropTypes from 'prop-types';
import { use, innerHTML, outerHTML, Internals } from 'diffhtml';
import reactLikeComponentTask from './tasks/react-like-component';
import upgradeSharedClass from './shared/upgrade-shared-class';
import {
  ChildParentCache,
  ComponentTreeCache,
  InstanceCache,
} from './util/caches';
import { $$render } from './util/symbols';

const { NodeCache } = Internals;
const { keys, assign } = Object;

// Registers a custom middleware to help map the diffHTML render lifecycle
// internals to React. This currently isn't necessary for the Web Component
// implementation since they inherently provide lifecycle hooks.
const root = (typeof global !== 'undefined' ? global : window)

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
let unsubscribe = null;

// Looks up the Component tree for context.
const getContext = instance => {
  const path = [];
  let parentTree = ComponentTreeCache.get(instance);

  while (parentTree = ChildParentCache.get(parentTree)) {
    if (!InstanceCache.has(parentTree)) {
      continue;
    }

    path.push(InstanceCache.get(vTree).getChildContext());
  }

  // Merge least specific to most specific.
  return assign({}, ...path.reverse());
};

class Component {
  static subscribeMiddleware() {
    unsubscribe = use(reactLikeComponentTask);
  }

  static unsubscribeMiddleware() {
    unsubscribe();

    ChildParentCache.clear();
    ComponentTreeCache.clear();
    InstanceCache.clear();
  }

  [$$render]() {
    const vTree = ComponentTreeCache.get(this);
    const domNode = NodeCache.get(vTree);
    const renderTree = this.render();

    outerHTML(domNode, renderTree).then(() => {
      this.componentDidUpdate();
    });
  }

  constructor(initialProps, initialContext) {
    const props = this.props = assign({}, initialProps);
    const state = this.state = {};
    const context = this.context = assign({}, initialContext);

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

      props[prop] = defaultProps[prop];
    });

    if (process.env.NODE_ENV !== 'production') {
      if (PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, props, 'prop', name);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      keys(childContextTypes).forEach(prop => {
        const err = childContextTypes[prop](this.context, prop, name, 'context');
        if (err) { throw err; }
      });
    }

    keys(contextTypes).forEach(prop => {
      if (process.env.NODE_ENV !== 'production') {
        const err = childContextTypes[prop](this.context, prop, name, 'context');
        if (err) { throw err; }
      }

      this.context[prop] = child
    });
  }
}

// Automatically subscribe the React Component middleware.
Component.subscribeMiddleware();

// Wrap this base class with shared methods.
export default upgradeSharedClass(Component);
