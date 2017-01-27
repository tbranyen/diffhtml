const { createTree, innerHTML, outerHTML } = require('diffhtml');

const { assign, freeze } = Object;

exports.createElement = (...args) => {
  const tree = createTree(...args);

  tree.$$typeof = Symbol.for('react.element');

  const attributes = Object.keys(tree.attributes);

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

    if (process.env.NODE_ENV !== 'production') {
      Object.keys(defaultProps).forEach(prop => {
        if (this.props[prop] === undefined) {
          this.props[prop] = defaultProps[prop];
        }
      });

      Object.keys(propTypes).forEach(prop => {
        const err = propTypes[prop](this.props, prop, constructor.name, 'prop');
        if (err) { throw err; }
      });
    }
  }

  setState(newState) {
    this.state = freeze(assign({}, this.state, newState));

    if (this.shouldComponentUpdate()) {
      outerHTML(this.domNode, this.render(this.props, this.state));
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {}
};
exports.PropTypes = require('proptypes');
exports.render = (component, mount) => innerHTML(mount, component);
