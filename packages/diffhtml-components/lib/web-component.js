import upgradeSharedClass from './shared/upgrade-shared-class';
import { $$render, $$vTree } from './util/symbols';
import { getBinding } from './util/binding';

const { defineProperty, assign, keys } = Object;
const nullFunc = function() {};
const debounce = new Set();
const root = typeof window !== 'undefined' ? window : global;

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

const $$timeout = Symbol.for('$$timeout');

class WebComponent extends root.HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  constructor(props, context) {
    if (root.HTMLElement === nullFunc) {
      throw new Error('Custom Elements require a valid browser environment');
    }

    super();

    this.attachShadow({ mode: 'open' });

    this.props = createProps(this, props);
    this.state = createState(this);

    const {
      defaultProps = {},
      propTypes = {},
      childContextTypes = {},
      contextTypes = {},
      name,
    } = this.constructor;

    keys(defaultProps).forEach(propName => {
      if (propName in this.props && this.props[propName] !== undefined) {
        return;
      }

      this.props[propName] = defaultProps[propName];
    });
  }

  connectedCallback() {
    const { propTypes = {} } = this.constructor;

    // This callback gets called during replace operations, there is no point
    // in re-rendering or creating a new shadow root due to this.

    // Always do a full render when mounting.
    // Why do we always do a full render on mount?
    this[$$render]();

    this.componentDidMount();

    // Handle properties being set after appended into the DOM, only mark those
    // set in `propTypes`.
    let timeout = null;

    keys(propTypes).forEach(propName => {
      defineProperty(this, propName, {
        get: () => this.props[propName],
        set: (value) => {
          root.clearTimeout(timeout);

          this.props[propName] = value;

          timeout = root.setTimeout(() => {
            this[$$render]();
          }, 0);
        },
      });
    });
  }

  disconnectedCallback() {
    this.componentWillUnmount();
  }

  attributeChangedCallback() {
    const nextProps = createProps(this, this.props);
    const nextState = this.state;

    this.componentWillReceiveProps(nextProps);

    if (this.shouldComponentUpdate(nextProps, nextState)) {
      root.clearTimeout(this[$$timeout]);

      this[$$timeout] = root.setTimeout(() => {
        this[$$render]();
      }, 0);
    }
  }

  [$$timeout] = null;
  [$$vTree] = null;

  [$$render]() {
    const oldProps = this.props;
    const oldState = this.state;

    this.props = createProps(this, this.props);
    getBinding().innerHTML(
      this.shadowRoot,
      this.render(this.props, this.state, this.context),
    );
    this.componentDidUpdate(oldProps, oldState);
  }
}

export default upgradeSharedClass(WebComponent);
