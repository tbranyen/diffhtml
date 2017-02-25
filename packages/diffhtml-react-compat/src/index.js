import { createTree, innerHTML, outerHTML, use, html } = require('diffhtml');
import syntheticEvents from 'diffhtml-synthetic-events';

const { assign, freeze, keys } = Object;

let NodeCache = null;
let ComponentCache = new Map();
let reactFlow = [];

const reconcileComponents = (oldTree, newTree) => {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called
  // is `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If no new child return.
    if (!newChild) {
      newTree.childNodes.splice(i, 1);
      i--;
      continue;
    }

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const oldChildNodes = oldTree && oldTree.childNodes;
      const oldCtor = oldChild && oldChild.rawNodeName;
      const newCtor = newChild.rawNodeName;
      const children = newChild.childNodes.length ? newChild.childNodes.filter(Boolean) : null;
      const props = assign({}, newChild.attributes, { children });
      const canNew = newCtor.prototype && newCtor.prototype.render;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldCtor === newCtor && ComponentCache.get(oldChild);
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;

      // See if we should update.
      const shouldUpdate = instance && instance.shouldComponentUpdate(
        instance.props, instance.state
      );

      const renderTree = createTree(
        instance ? (shouldUpdate ? instance.render(props, instance.state) : ComponentCache.get(instance)) : newCtor(props)
      );

      console.log(renderTree && renderTree.nodeName);

      if (!renderTree) { continue; }

      renderTree.rawNodeName = newCtor;

      // Remove any missing children.
      renderTree.childNodes = renderTree.childNodes.filter(Boolean);

      // Build a new tree from the render, and use this as the current tree.
      newTree.childNodes[i] = renderTree;

      // Cache this new current tree in both directions.
      if (instance) {
        ComponentCache.set(instance, renderTree);
        ComponentCache.set(renderTree, instance);
      }

      // Recursively update trees.
      reconcileComponents(oldChild, renderTree);
    }
    else if (newChild) {
      reconcileComponents(oldChild, newChild);
    }
  }
};

function reactCompatibility(options = {}) {
  const startReconcileComponents = transaction => {
    reconcileComponents(transaction.state.oldTree, transaction.newTree);
  };

  let diffHTMLTasks = null;

  function reactCompatibilityTask(transaction) {
    // Use React Flow.
    const { tasks } = transaction;
    const index = tasks.indexOf(diffHTMLTasks.reconcileTrees);

    // Inject after tree reconcilation.
    transaction.tasks = tasks.splice(index + 1, 0, startReconcileComponents);

    return () => {
      ComponentCache.forEach((key, value) => {
        value.componentDidMount && value.componentDidMount();
        value.componentDidUpdate && value.componentDidUpdate(value.props, value.state);
      });
    };
  }

  const subscribe = ({ internals, tasks }) => {
    diffHTMLTasks = tasks;
    NodeCache = internals.NodeCache;
  };

  return assign(reactCompatibilityTask, { subscribe });
}

use(reactCompatibility());
use(syntheticEvents());

exports.createElement = (...args) => {
  const tree = createTree(...args);

  tree.$$typeof = Symbol.for('react.element');

  const attributes = keys(tree.attributes);

  if (attributes.includes('className')) {
    tree.attributes.class = tree.attributes.className;
  }

  attributes.forEach(name => {
    if (name.indexOf('on') === 0) {
      tree.attributes[name.toLowerCase()] = tree.attributes[name];
    }
  });

  return tree;
};

exports.Component = class Component {
  constructor(props) {
    const { constructor } = this;
    const { defaultProps = {}, propTypes = {} } = constructor;

    this.props = assign({}, props);
    this.state = {};

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

  setState(newState) {
    this.state = freeze(assign({}, this.state, newState));

    if (this.shouldComponentUpdate()) {
      outerHTML(
        NodeCache.get(ComponentCache.get(this)),
        this.render(this.props, this.state),
        {
          flow: reactFlow,
        }
      );
    }
  }

  componentWillReceiveProps() {}
  shouldComponentUpdate() { return true; }
  componentWillUpdate() {}
  componentDidUpdate() {}
  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
};

exports.PropTypes = require('proptypes');
exports.html = html;
exports.render = (component, mount) => innerHTML(mount, component, );
exports.isValidElement = function(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === Symbol.for('react.element')
  );
};
