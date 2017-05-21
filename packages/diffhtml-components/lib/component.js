import { use, innerHTML, outerHTML } from 'diffhtml';
import { NodeCache } from 'diffhtml-shared-internals/dist/cjs/caches';
import process from 'diffhtml-shared-internals/dist/cjs/process';
import reactLikeComponentTask from './tasks/react-like-component';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { ComponentTreeCache, InstanceCache } from './util/caches';

const { keys, assign } = Object;
const $$render = Symbol.for('diff.render');

// Registers a custom middleware to help map the diffHTML render lifecycle
// internals to React. This currently isn't necessary for the Web Component
// implementation since they inherently provide lifecycle hooks.
use(reactLikeComponentTask);

class Component {
  constructor(initialProps) {
    const props = this.props = assign({}, initialProps);
    const state = this.state = {};

    const { defaultProps = {}, propTypes = {}, name } = this.constructor;

    keys(defaultProps).forEach(prop => {
      if (prop in props) {
        return;
      }

      props[prop] = defaultProps[prop];
    });

    if (process.env.NODE_ENV !== 'production') {
      keys(propTypes).forEach(prop => {
        const err = propTypes[prop](props, prop, name, 'prop');
        if (err) { throw err; }
      });
    }
  }

  [$$render]() {
    const vTree = ComponentTreeCache.get(this);
    const domNode = NodeCache.get(vTree);
    const renderTree = this.render();

    outerHTML(domNode, renderTree);
  }
}

export default upgradeSharedClass(Component);
