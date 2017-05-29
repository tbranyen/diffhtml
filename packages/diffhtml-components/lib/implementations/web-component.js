import { innerHTML } from '../../../diffhtml';

const Debounce = new WeakMap();
const { setPrototypeOf, freeze, assign, keys } = Object;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = domNode => {
  const observedAttributes = getObserved(domNode.constructor);

  return freeze(observedAttributes.reduce((props, attr) => assign(props, {
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr) || undefined,
  }), {}));
};

// Creates the `component.state` object.
const createState = (domNode, newState) => {
  return freeze(assign({}, domNode.state, newState));
};

export default class WebComponent extends HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  // Facilities a component re-render.
  static rerenderComponent(domNode) {
    const nextProps = createProps(domNode);

    domNode.props = nextProps;
    innerHTML(domNode.shadowRoot, domNode.render());
    domNode.componentDidUpdate();
  }

  constructor() {
    super();

    this.props = createProps(this);
    this.state = createState(this);
    this.componentWillMount();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    WebComponent.rerenderComponent(this);
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
      WebComponent.rerenderComponent(this);

      Debounce.set(this, setTimeout(() => {
        Debounce.delete(this);
        WebComponent.rerenderComponent(this);
      }));
    }
  }
};
