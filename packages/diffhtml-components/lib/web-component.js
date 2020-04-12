import { createTree, innerHTML } from 'diffhtml';
import process from './util/process';
import PropTypes from './util/prop-types';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { $$render, $$vTree } from './util/symbols';

const { defineProperty, assign, keys } = Object;
const root = typeof window !== 'undefined' ? window : global;
const nullFunc = function() {};

root.HTMLElement = root.HTMLElement || nullFunc;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = (domNode, props = {}) => {
  const observedAttributes = getObserved(domNode.constructor);
  const initialProps = {
    //children: [].map.call(domNode.childNodes, createTree),
  };

  const incoming = observedAttributes.reduce((props, attr) => ({
    [attr]: (
      (domNode.hasAttribute(attr) ? domNode.getAttribute(attr) : domNode[attr]) || initialProps[attr]),
    ...props,
  }), initialProps);

  return assign({}, props, incoming);
};

// Creates the `component.state` object.
const createState = (domNode, newState) => assign({}, domNode.state, newState);

class WebComponent extends root.HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  constructor(props, context) {
    if (root.HTMLElement === nullFunc) {
      throw new Error('Custom Elements require a valid browser environment');
    }

    super();

    this.props = createProps(this, props);
    this.state = createState(this);

    const {
      defaultProps = {},
      propTypes = {},
      //childContextTypes = {},
      //contextTypes = {},
      name,
    } = this.constructor;

    keys(defaultProps).forEach(propName => {
      if (propName in this.props && this.props[propName] !== undefined) {
        return;
      }

      this.props[propName] = defaultProps[propName];
    });

    if (process.env.NODE_ENV !== 'production') {
      if (PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, this.props, 'prop', name);
      }
    }
  }

  connectedCallback() {
    const { propTypes = {} } = this.constructor;

    // Handle properties being set after appended into the DOM, only mark those
    // set in `propTypes`.
    keys(propTypes).forEach(propName => {
      defineProperty(this, propName, {
        get: () => this.props[propName],
        set: (value) => {
          this.props[propName] = value;
          this[$$render]();
        },
      });
    });

    // This callback gets called during replace operations, there is no point
    // in re-rendering or creating a new shadow root due to this.
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      // fixme
      // this nested render calls gc() which removes the parent reference
      // must protect before it happens
      this[$$render]();
      this.componentDidMount();
    }
  }

  disconnectedCallback() {
    this.componentWillUnmount();
  }

  attributeChangedCallback(name, value) {
    if (value !== null) {
      const nextProps = createProps(this, this.props);
      const nextState = this.state;

      this.componentWillReceiveProps(nextProps);

      if (this.shouldComponentUpdate(nextProps, nextState)) {
        this[$$render]();
      }
    }
  }

  [$$vTree] = null;

  [$$render]() {
    const oldProps = this.props;
    const oldState = this.state;

    this.props = createProps(this, this.props);
    innerHTML(this.shadowRoot, this.render(this.props, this.state, this.context));
    this.componentDidUpdate(oldProps, oldState);
  }
}

export default upgradeSharedClass(WebComponent);
