'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Component {
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
        if (err) {
          throw err;
        }
      });
    }
  }

  setState(newState) {
    this.state = freeze(assign({}, this.state, newState));

    if (this.shouldComponentUpdate()) {
      this.rerender();
    }
  }

  shouldComponentUpdate() {
    return true;
  }
  componentWillReceiveProps() {}
  componentWillMount() {}
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  componentDidUnmount() {}
}
exports.default = Component;
module.exports = exports['default'];