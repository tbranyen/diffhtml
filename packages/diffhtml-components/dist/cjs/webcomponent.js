'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _diffhtml = require('diffhtml');

const Debounce = new WeakMap();
const { setPrototypeOf, freeze, assign, keys } = Object;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = domNode => {
  const observedAttributes = getObserved(domNode.constructor);

  return freeze(observedAttributes.reduce((props, attr) => assign(props, {
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr)
  }), {}));
};

// Creates the `component.state` object.
const createState = (domNode, newState) => {
  return freeze(assign({}, domNode.state, newState));
};

// Facilities a component re-render.
const rerenderComponent = domNode => {
  const nextProps = createProps(domNode);

  domNode.props = nextProps;
  (0, _diffhtml.innerHTML)(domNode.shadowRoot, domNode.render());
  domNode.componentDidUpdate();
};

class WebComponent extends HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  constructor() {
    super();

    this.props = createProps(this);
    this.state = createState(this);
    this.componentWillMount();
  }

  setState(newState) {
    this.state = assign({}, this.state, newState);

    if (!Debounce.has(this) && this.shouldComponentUpdate()) {
      rerenderComponent(this);

      Debounce.set(this, setTimeout(() => {
        Debounce.delete(this);
        rerenderComponent(this);
      }));
    }
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const nextProps = createProps(this);
    this.componentWillReceiveProps(nextProps);
    rerenderComponent(this);
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
      rerenderComponent(this);

      Debounce.set(this, setTimeout(() => {
        Debounce.delete(this);
        rerenderComponent(this);
      }));
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
}exports.default = WebComponent;
;
module.exports = exports['default'];