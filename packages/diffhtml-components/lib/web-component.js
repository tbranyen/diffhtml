import process from './util/process';
import { createTree, innerHTML, use } from 'diffhtml';
import PropTypes from 'prop-types';
import upgradeSharedClass from './shared/upgrade-shared-class';
import webComponentTask from './tasks/web-component';
import { $$render } from './util/symbols';

const Debounce = new WeakMap();
const { setPrototypeOf, assign, keys } = Object;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = domNode => {
  const observedAttributes = getObserved(domNode.constructor);
  const initialProps = {
    children: [].map.call(domNode.childNodes, createTree),
  };

  return observedAttributes.reduce((props, attr) => assign(props, {
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr) || undefined,
  }), initialProps);
};

// Creates the `component.state` object.
const createState = (domNode, newState) => {
  return assign({}, domNode.state, newState);
};

// Creates the `component.contxt` object.
const createContext = (domNode) => {

};

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
const subscribeMiddleware = () => use(webComponentTask);
const unsubscribeMiddleware = subscribeMiddleware();

export default upgradeSharedClass(class WebComponent extends HTMLElement {
  static subscribeMiddleware() {
    return subscribeMiddleware();
  }

  static unsubscribeMiddleware() {
    unsubscribeMiddleware();
    return subscribeMiddleware;
  }

  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  [$$render]() {
    this.props = createProps(this);
    if (this.shadowRoot) {
      innerHTML(this.shadowRoot, this.render(this.props, this.state));
    }
    else {
      innerHTML(this, this.render(this.props, this.state));
    }
    this.componentDidUpdate();
  }

  constructor() {
    super();

    this.props = createProps(this);
    this.state = createState(this);
    this.context = createContext(this);

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
    this.attachShadow({ mode: 'open' });
    this[$$render]();
    this.componentDidMount();
  }

  disconnectedCallback() {
    // TODO Figure out a better place for `willUnmount`, use the detached
    // transition to determine if a Node is removed would be very accurate
    // as this fires just before an element is removed, also if the user
    // is using a detached animation this would allow them to do something
    // before the animation completes, giving you two nice callbacks to use
    // for detaching.
    this.componentWillUnmount();
    this.componentDidUnmount();
  }

  attributeChangedCallback() {
    if (this.shadowRoot && !Debounce.has(this)) {
      const nextProps = createProps(this);
      this.componentWillReceiveProps(nextProps);
      this.props = nextProps;
      this[$$render]();

      Debounce.set(this, setTimeout(() => {
        Debounce.delete(this);
        this[$$render]();
      }));
    }
  }
});
