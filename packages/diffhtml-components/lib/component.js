import { use, innerHTML, outerHTML } from 'diffhtml';
import checkPropTypes from 'prop-types/checkPropTypes';
import { NodeCache } from 'diffhtml-shared-internals/lib/caches';
import process from 'diffhtml-shared-internals/lib/process';
import reactLikeComponentTask from './tasks/react-like-component';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { ComponentTreeCache, InstanceCache } from './util/caches';
import { $$render } from './util/symbols';

const { keys, assign } = Object;

// Registers a custom middleware to help map the diffHTML render lifecycle
// internals to React. This currently isn't necessary for the Web Component
// implementation since they inherently provide lifecycle hooks.
const root = (typeof global !== 'undefined' ? global : window)

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
const unsubscribeMiddleware = use(reactLikeComponentTask);

export default upgradeSharedClass(class Component {
  static unsubscribeMiddleware() {
    unsubscribeMiddleware();
  }

  [$$render]() {
    const vTree = ComponentTreeCache.get(this);
    const domNode = NodeCache.get(vTree);
    const renderTree = this.render();

    outerHTML(domNode, renderTree).then(() => {
      this.componentDidUpdate();
    });
  }

  constructor(initialProps) {
    const props = this.props = assign({}, initialProps);
    const state = this.state = {};
    const context = this.context = {};

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

    checkPropTypes(propTypes, props, 'prop', name);

    //keys(childContextTypes).forEach(prop => {
    //  if (process.env.NODE_ENV !== 'production') {
    //    const err = childContextTypes[prop](this.context, prop, name, 'context');
    //    if (err) { throw err; }
    //  }

    //  //this.context[prop] = child
    //});

    //keys(contextTypes).forEach(prop => {
    //  if (process.env.NODE_ENV !== 'production') {
    //    const err = childContextTypes[prop](this.context, prop, name, 'context');
    //    if (err) { throw err; }
    //  }

    //  this.context[prop] = child
    //});
  }
});
