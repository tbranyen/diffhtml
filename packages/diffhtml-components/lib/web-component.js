import process from './util/process';
import PropTypes from './util/prop-types';
import { createTree, innerHTML, use } from 'diffhtml';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { $$render } from './util/symbols';

const { setPrototypeOf, assign, keys } = Object;
const root = typeof window !== 'undefined' ? window : global;
const nullFunc = function() {};

root.HTMLElement = root.HTMLElement || nullFunc;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = (domNode, props = {}) => {
  const observedAttributes = getObserved(domNode.constructor);
  const initialProps = {
    children: [].map.call(domNode.childNodes, createTree),
  };

  const incoming = observedAttributes.reduce((props, attr) => ({
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr) || initialProps[attr],
    ...props,
  }), initialProps);

  return assign({}, props, incoming);
};

// Creates the `component.state` object.
const createState = (domNode, newState) => assign({}, domNode.state, newState);

class WebComponent extends HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  [$$render]() {
    const oldProps = this.props;
    const oldState = this.state;
    this.props = createProps(this, this.props);
    innerHTML(this.shadowRoot, this.render(this.props, this.state));
    this.componentDidUpdate(oldProps, oldState);
  }

  constructor(props, context) {
    if (HTMLElement === nullFunc) {
      throw new Error('Custom Elements require a valid browser environment');
    }

    super();

    this.props = createProps(this, props);
    this.state = createState(this);

    const {
      defaultProps = {},
      propTypes = {},
      childContextTypes = {},
      contextTypes = {},
      name,
    } = this.constructor;

    keys(defaultProps).forEach(prop => {
      if (prop in this.props && this.props[prop] !== undefined) {
        return;
      }

      this.props[prop] = defaultProps[prop];
    });

    if (process.env.NODE_ENV !== 'production') {
      if (PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, this.props, 'prop', name);
      }
    }
  }

  connectedCallback() {
    // This callback gets called during replace operations, there is no point
    // in re-rendering or creating a new shadow root due to this.
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this[$$render]();
      this.componentDidMount();
    }
  }

  disconnectedCallback() {
    // TODO Figure out a better place for `willUnmount`, use the detached
    // transition to determine if a Node is removed would be very accurate
    // as this fires just before an element is removed, also if the user
    // is using a detached animation this would allow them to do something
    // before the animation completes, giving you two nice callbacks to use
    // for detaching.
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
}

export default upgradeSharedClass(WebComponent);
