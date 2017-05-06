import { use, innerHTML, createTree } from '../../../diffhtml';
import { NodeCache } from '../../../diffhtml/lib/util/caches';

const ComponentCache = new Map();
const Debounce = new WeakMap();
const { assign } = Object;

function reactLikeComponentTask() {}

reactLikeComponentTask.syncTreeHook = (oldTree, newTree) => {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const oldCtor = oldChild && oldChild.rawNodeName;
      const newCtor = newChild.rawNodeName;
      const children = newChild.childNodes;
      const props = assign({}, newChild.attributes, { children });
      const canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldCtor === newCtor && ComponentCache.get(oldChild);
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;
      const renderTree = createTree(
        instance ? instance.render(props) : newCtor(props)
      );

      if (!renderTree) {
        continue;
      }

      if (renderTree.nodeType === 11) {
        throw new Error('Top level render must return single Node');
      }

      // Build a new tree from the render, and use this as the current tree.
      newTree.childNodes[i] = renderTree;

      // Cache this new current tree.
      if (instance) {
        ComponentCache.set(renderTree, instance);
        ComponentCache.set(instance, renderTree);
      }

      // Recursively update trees.
      return newTree;
    }
  }
};

use(reactLikeComponentTask);

// Creates the `component.state` object.
const createState = (instance, state) => assign({}, instance.state, state);

export default class Component {
  // Facilities a component re-render.
  static rerenderComponent(instance) {
    const domNode = NodeCache.get(ComponentCache.get(instance));
    innerHTML(domNode, instance.render());
    instance.componentDidUpdate();
  }

  constructor(props) {
    this.props = props;
    this.state = createState(this);
    this.componentWillMount();

    const { defaultProps = {}, propTypes = {} } = this.constructor;

    Object.keys(defaultProps).forEach(prop => {
      if (this.props[prop] === undefined) {
        this.props[prop] = defaultProps[prop];
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      Object.keys(propTypes).forEach(prop => {
        const err = propTypes[prop](this.props, prop, constructor.name, 'prop');
        if (err) { throw err; }
      });
    }
  }
}
