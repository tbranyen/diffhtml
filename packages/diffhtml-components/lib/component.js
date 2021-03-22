import {
  EMPTY,
  ComponentTreeCache,
  InstanceCache,
  Props,
  Transaction,
  VTree,
  State,
} from './util/types';
import { $$render, $$vTree, $$unsubscribe, $$type } from './util/symbols';
import diff from './util/binding';
import middleware from './middleware';

const { outerHTML, innerHTML, createTree, release, Internals } = diff;
const { NodeCache, memory, createNode } = Internals;
const { isArray } = Array;
const { setPrototypeOf, defineProperty, keys, assign } = Object;
const RenderDebounce = new WeakMap();

/**
 * @param {Props} defaultProps
 */
const getObserved = ({ defaultProps }) => defaultProps ? keys(defaultProps) : [];

/**
 * Creates the `component.props` object.
 *
 * @param {any} domNode
 * @param {Props} newProps
 */
const createProps = (domNode, newProps = {}) => {
  const observedAttributes = getObserved(domNode.constructor);
  /** @type {any} */const initialProps = {};

  const incoming = observedAttributes.reduce((props, attr) => ({
    [attr]: (
      domNode.hasAttribute(attr) ? domNode.getAttribute(attr) : domNode[attr]
    ) || initialProps[attr],
    ...props,
  }), initialProps);

  return assign({}, newProps, incoming);
};

/**
 * Creates the `component.state` object.
 *
 * @param {Component} domNode
 * @param {State} newState
 */
const createState = (domNode, newState) => assign({}, domNode.state, newState);

/**
 * @param {VTree[]} childTrees
 * @param {VTree} vTree
 */
const getChildTrees = (childTrees, vTree) => {
  ComponentTreeCache.forEach((parentTree, childTree) => {
    if (parentTree === vTree) {
      ComponentTreeCache.delete(childTree);

      if (typeof childTree.rawNodeName !== 'function') {
        childTrees.push(childTree);
      }
      else {
        getChildTrees(childTrees, childTree);
      }
    }
  });
};

/**
 * Represents a vanilla JavaScript Component. This is a lightweight version of
 * what you'd find in most modern web application libraries. It provides a
 * React-inspired API.
 */
export default class Component {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  /**
   * Allow tests to unbind this task, you would not typically need to do this in
   * a web application, as this code loads once and is not reloaded.
   *
   * @type {Function | null}
   */
  static [$$unsubscribe] = null;

  /**
   * Adds the Component middleware, but first unregisters any previous
   * Component middleware.
   *
   * @returns {void}
   */
  static subscribeMiddleware() {
    const unsubscribe = Component[$$unsubscribe];
    unsubscribe && unsubscribe();
    Component[$$unsubscribe] = diff.use(middleware());
  }

  /**
   * Removes the Component middleware and clears the internal caches.
   *
   * @returns {void}
   */
  static unsubscribeMiddleware() {
    const unsubscribe = Component[$$unsubscribe];
    unsubscribe && unsubscribe();
    ComponentTreeCache.clear();
    InstanceCache.clear();
  }

  /**
   * Creates a lightweight stateful JavaScript component. Takes the static
   * default props and applies them to the incoming initial props.
   *
   * @param {Props} initialProps
   */
  constructor(initialProps) {
    let instance = this;

    // This is how we detect if this is a Web Component or not. The class
    // must be registered ahead of time within the customElements global
    // registry. This will allow us to construct the HTMLElement and attach the
    // shadow root.
    try {
      instance = Reflect.construct(HTMLElement, [], new.target);

      /** @type {any} */ (instance).attachShadow({ mode: 'open' });
      /** @type {any} */ (instance)[$$type] = 'web';

    } catch (e) {
      // Not a Web Component.
      /** @type {any} */ (instance)[$$type] = 'class';
    }

    const props = instance.props = assign({}, initialProps);
    const { defaultProps = EMPTY.OBJ } = /** @type {any} */ (instance.constructor);

    // Merge default props into props object.
    if (typeof defaultProps === 'object' && !isArray(defaultProps)) {
      keys(defaultProps || EMPTY.OBJ).forEach(prop => {
        if (prop in props && props[prop] !== undefined) {
          return;
        }

        instance.props[prop] = defaultProps[prop];
      });
    }

    return instance;
  }

  /**
   * @param {Props} props
   * @param {State} state
   *
   * @returns {VTree[] | VTree | undefined}
   */
  // @ts-ignore
  render(props, state) {
    return undefined;
  }

  /**
   * Changes the component state synchronously by shallow merging the incoming
   * state into the previous state. Rendering will then be scheduled to the
   * next reachable tick. If this is called multiple times on a single tick
   * all that will happen is the state will be updated by no rendering will
   * occur until the next tick.
   *
   * You can await this method to know when rendering has completed.
   *
   * @param {State} state
   */
  setState(state) {
    this.state = assign({}, this.state, state);

    if (!RenderDebounce.has(this)) {
      RenderDebounce.set(this, new Promise(resolve => setTimeout(() => {
        RenderDebounce.delete(this);

        this.componentWillReceiveProps(this.props, this.state);

        if (this.shouldComponentUpdate(this.props, this.state)) {
          this[$$render]()?.then(resolve);
        }
        else {
          resolve(null);
        }
      })));
    }

    return RenderDebounce.get(this);
  }

  /**
   * Schedule a render to happen, bypassing shouldComponentUpdate. Bound to the
   * same tick logic as setState, allowing this to be called as many times as
   * you want.
   */
  forceUpdate() {
    if (!RenderDebounce.has(this)) {
      RenderDebounce.set(this, new Promise(resolve => setTimeout(() => {
        RenderDebounce.delete(this);

        this.componentWillReceiveProps(this.props, this.state);

        this[$$render]()?.then(resolve);
      })));
    }

    return RenderDebounce.get(this);
  }

  /** @type {State} */
  state = {};

  /** @type {'web'|'class'} */
  [$$type] = 'class';

  /** @type {VTree | null} */
  [$$vTree] = null;

  /**
   * Stateful render. Used when a component changes and needs to re-render
   * itself. This is triggered on `setState` and `forceUpdate` calls.
   *
   * @return {Promise<Transaction> | undefined}
   */
  [$$render]() {
    // This is a WebComponent, so do something different.
    if (this[$$type] === 'web') {
      const oldProps = this.props;
      const oldState = this.state;

      this.props = createProps(this, this.props);
      this.state = createState(this, this.state);

      /** @type {Promise<Transaction>} */
      const promise = (innerHTML(
        /** @type {any} */ (this).shadowRoot,
        this.render(this.props, this.state),
      ));

      this.componentDidUpdate(oldProps, oldState);
      return promise;
    }

    // Get the fragment tree associated with this component. This is used to
    // lookup rendered children.
    let vTree = this[$$vTree];

    /**
     * Find all previously rendered top-level children associated to this
     * component. This will be used to diff against the newly rendered
     * elements.
     *
     * @type {VTree[]}
     */
    const childTrees = [];

    // Lookup all DOM nodes that were associated at the top level with this
    // component.
    vTree && getChildTrees(childTrees, vTree);

    // Map all VTree's into DOM Nodes.
    const childNodes = childTrees.map(x => NodeCache.get(x));

    /**
     * By default assume a single top/root-level element, if there are multiple
     * elements returned at the root-level, then we'll do a diff and replace a
     * fragment from this root point.
     *
     * @type {HTMLElement | any}
     */
    const domNode = (childNodes[0]);

    // Do not attempt to re-render if we do not have prior children.
    // TODO This is cheating until there is a better way to determine if a
    // component has rendered or not.
    if (!domNode || !domNode.parentNode) {
      return;
    }

    const { parentNode } = domNode;

    // Render directly from the Component.
    let renderTree = this.render(this.props, this.state);

    // Do not render.
    if (!renderTree) {
      return;
    }

    const renderTreeAsVTree = /** @type {VTree} */ (renderTree);

    // Always compare a fragment to a fragment. If the renderTree was not
    // wrapped, ensure it is here.
    if (renderTreeAsVTree.nodeType !== 11) {
      const isList = 'length' in renderTree;
      const renderTreeAsList = /** @type {VTree[]} */ (renderTree);

      renderTree = createTree(isList ? renderTreeAsList : [renderTreeAsVTree]);
    }

    // Put all the nodes together into a fragment for diffing.
    const fragment = createTree(childTrees);

    /**
     * Compare the existing component node(s) to the new node(s).
     *
     * @type {Promise<Transaction>}
     */
    const promise = (outerHTML(fragment, renderTree));

    // Track the last known node so when insertions happen they are easily
    // executed adjacent to this element.
    let lastNode = domNode;

    // Reconcile all top-level replacements and additions.
    fragment.childNodes.forEach((childTree, i) => {
      const newNode = createNode(childTree);
      const oldNode = NodeCache.get(childTrees[i]);

      // Replace if the nodes are different.
      if (newNode && oldNode && childTrees[i] !== childTree) {
        parentNode.replaceChild(newNode, oldNode);

        // Reset last node, since it has been replaced.
        lastNode = newNode;

        ComponentTreeCache.set(childTree, vTree);
        memory.protectVTree(childTree);
      }
      // Add if there is no old Node.
      else if (lastNode && !oldNode) {
        lastNode.after(newNode);
        lastNode = newNode;

        ComponentTreeCache.set(childTree, vTree);
        memory.protectVTree(childTree);
      }
      // Keep the old node.
      else {
        ComponentTreeCache.set(childTree, vTree);
        memory.protectVTree(childTree);
        lastNode = oldNode;
      }
    });

    return promise.then(transaction => {
      // Empty the fragment after using.
      fragment.childNodes.length = 0;
      release(fragment);

      this.componentDidUpdate(this.props, this.state);
      return transaction;
    });
  }

  connectedCallback() {
    const { defaultProps = {} } = /** @type {any} */ (this).constructor;

    // This callback gets called during replace operations, there is no point
    // in re-rendering or creating a new shadow root due to this.

    // Always do a full render when mounting, so that something is visible.
    this[$$render]();

    this.componentDidMount();

    keys(defaultProps).forEach(propName => {
      defineProperty(this, propName, {
        get: () => this.props[propName],
        set: (value) => {
          this.props[propName] = value;

          this.componentWillReceiveProps(this.props, this.state);

          if (this.shouldComponentUpdate(this.props, this.state)) {
            this[$$render]();
          }
        },
      });
    });
  }

  disconnectedCallback() {
    this.componentWillUnmount();
  }

  attributeChangedCallback() {
    const nextProps = createProps(this, this.props);
    const nextState = createState(this, this.state);

    this.componentWillReceiveProps(nextProps, nextState);

    if (this.shouldComponentUpdate(nextProps, nextState)) {
      this[$$render]();
    }
  }

  /**
   * @param {Props} props
   * @param {State} state
   *
   * @returns {boolean}
   */
  // @ts-ignore
  shouldComponentUpdate(props, state) { return true; }

  componentWillMount() {}
  componentDidMount() {}

  /**
   * @param {Props} props
   * @param {State} state
   */
  // @ts-ignore
  componentWillReceiveProps(props, state) {}

  /**
   * @param {Props} props
   * @param {State} state
   *
   * @returns {void}
   */
  // @ts-ignore
  componentDidUpdate(props, state) {}

  componentWillUnmount() {}
}

// TODO: Can this be done inside the constructor so that class components do not
// need to inherit from HTMLElement?
try {
  setPrototypeOf(Component.prototype, HTMLElement.prototype);
} catch {}

// Automatically subscribe the Component middleware.
Component.subscribeMiddleware();