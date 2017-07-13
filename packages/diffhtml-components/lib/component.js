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
import getContext from './util/get-context';
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

    const prevProps = this.props;
    const prevState = this.state;

    outerHTML(domNode, renderTree).then(() => {
      this.componentDidUpdate(prevProps, prevState);
    });
  }

  constructor(initialProps, initialContext) {
    const props = this.props = assign({}, initialProps);
    const state = this.state = {};
    const context = this.context = assign({}, initialContext);

    this.refs = {};
    this.props.refs = this.refs;

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
      if (PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, props, 'prop', name);
        PropTypes.checkPropTypes(contextTypes, context, 'context', name);
      }
    }
  }
}

// Automatically subscribe the React Component middleware.
Component.subscribeMiddleware();

// Wrap this base class with shared methods.
export default upgradeSharedClass(Component);
