const Debounce = new WeakMap();
const { freeze, assign } = Object;

exports.WebComponent = function WebComponent(observedAttributes) {
  function createProps(domNode) {
    return freeze(observedAttributes.reduce((props, attr) => assign(props, {
      [attr]: domNode.hasAttribute(attr) ? domNode.getAttribute(attr) : domNode[attr],
    }), {}));
  }

  function createState(domNode, newState) {
    return freeze(assign({}, this.state, newState));
  }

  function rerenderComponent(domNode) {
    const nextProps = createProps(domNode);
    domNode.componentWillReceiveProps(nextProps);
    domNode.props = nextProps;
    domNode.rerender();
  }

  return class extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }

    constructor() {
      super();
      this.props = createProps(this);
      this.state = createState(this);
    }

    rerender() {
      // Ensure that props are completely updated before rendering.
      this.props = createProps(this);
      diff.innerHTML(this.shadowRoot, this.render());
    }

    setState(newState) {
      this.state = newState;

      if (this.shouldComponentUpdate()) {
        this.rerender();
      }
    }

    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.rerender();
      this.componentDidMount();
    }

    attributeChangedCallback() {
      if (this.shadowRoot && !Debounce.has(this)) {
        rerenderComponent(this);

        Debounce.set(this, setTimeout(() => {
          Debounce.delete(this);
          rerenderComponent(this);
        }));
      }
    }

    disconnectedCallback() { this.componentWillUnmount(); }
    shouldComponentUpdate() { return true; }
    componentWillReceiveProps() {}
    componentDidMount() {}
    componentWillUnmount() {}
  };
}

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

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {

  }

  setState(newState) {
    this.state = freeze(assign({}, this.state, newState));

    if (this.shouldComponentUpdate()) {
      this.rerender();
    }
  }
}
