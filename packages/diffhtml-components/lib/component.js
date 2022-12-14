import {
  EMPTY,
  ComponentTreeCache,
  InstanceCache,
  Props,
  Transaction,
  VTree,
  State,
  ActiveRenderState,
} from './util/types';
import {
  $$render,
  $$vTree,
  $$unsubscribe,
  $$type,
  $$hooks,
  $$insertAfter,
} from './util/symbols';
import diff from './util/binding';
import middleware from './middleware';

const { outerHTML, innerHTML, createTree, release, Internals } = diff;
const { isArray } = Array;
const { setPrototypeOf, defineProperty, keys, assign } = Object;
const RenderDebounce = new WeakMap();

/**
 * @param {Props} defaultProps
 * @returns {string[]}
 */
const getObserved = ({ defaultProps }) =>
  defaultProps ? keys(defaultProps) : EMPTY.ARR;

/**
 * Creates the `component.props` object.
 *
 * @param {any} domNode
 * @param {Props} existingProps
 */
const createProps = (domNode, existingProps = {}) => {
  return getObserved(domNode.constructor).reduce((props, attr) => ({
    [attr]: (
      domNode.hasAttribute(attr) ? domNode.getAttribute(attr) : domNode[attr]
    ) || props[attr] || domNode.constructor.defaultProps[attr],
    ...props,
  }), existingProps);
};

/**
 * Creates the `component.state` object.
 *
 * @param {Component} domNode
 * @param {State} newState
 */
const createState = (domNode, newState) => assign({}, domNode.state, newState);

/**
 * Recreates the VTree used for diffing a stateful component.
 *
 * @param {VTree} vTree - vTree to seed the recreation process
 * @return {VTree} Recreated VTree including component references
 */
const recreateVTree = vTree => {
  // Sucks that we need to loop this entire cache every time we re-render. This
  // information should be more easily attained.
  ComponentTreeCache.forEach((parentTree, childTree) => {
    if (parentTree === vTree) {
      ComponentTreeCache.delete(childTree);
      vTree.childNodes.push(childTree);
    }
  });

  return vTree;
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
          resolve(this[$$render]());
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

        resolve(this[$$render]());
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

  /** @type {{ fns: Function[], i: number }} */
  [$$hooks] = { fns: [], i: 0 };

  /**
   * Stateful render. Used when a component changes and needs to re-render
   * itself and the trees it contains. This is triggered on `setState` and
   * `forceUpdate` calls with class components and createState updates with
   * function components.
   *
   * Web Components are easy to implement using the Shadow DOM to encapsulate
   * the mount point using `innerHTML`.
   *
   * React-like components are supported by recreating the previous component
   * tree and comparing this to the new tree using `outerHTML`.
   *
   * @return {Transaction | unknown | undefined}
   */
  [$$render]() {
    // This is a WebComponent, which allows for simplified logic.
    if (this[$$type] === 'web') {
      const oldProps = this.props;
      const oldState = this.state;

      this.props = createProps(this, this.props);
      this.state = createState(this, this.state);

      ActiveRenderState.push(this);

      if ($$hooks in this) {
        this[$$hooks].i = 0;
      }

      const transaction = /** @type {Transaction} */(innerHTML(
        /** @type {any} */ (this).shadowRoot,
        this.render(this.props, this.state),
      ));

      ActiveRenderState.length = 0;

      this.componentDidUpdate(oldProps, oldState);
      return transaction;
    }

    /**
     * Get the vTree associated with this component.
     *
     * @type {VTree | null}
     */
    const vTree = this[$$vTree];

    console.log('Recreating tree for', vTree.rawNodeName.name);

    /**
     * Recreate the existing tree including this component. This is not
     * directly stored anywhere, as the VDOM tree is flattened, and must be
     * recreated per render.
     *
     * @type {VTree}
     */
    const fragment = recreateVTree(vTree); //tbd
    const childTrees = [].concat(fragment.childNodes);
    const tasks = [...Internals.defaultTasks];
    const syncTreesIndex = tasks.indexOf(Internals.tasks.syncTrees);

    // Ensure this fragment isn't cleaned up until we are done rendering.
    Internals.memory.protectVTree(fragment);

    // Inject a custom task after syncing has finished, but before patching has
    // occured. This gives us time to add additional patch logic per render to
    // support multiple top level elements.
    tasks.splice(
      syncTreesIndex + 1, 0,
      function componentReconciler(/** @type {Transaction} */transaction) {
        let lastTree = null;

        console.log('>>', transaction.patches);
        // Reconcile all top-level replacements and additions.
        for (let i = 0; i < fragment.childNodes.length; i++) {
          const childTree = fragment.childNodes[i];

          // Replace if the nodes are different.
          if (childTree && fragment.childNodes[i] && childTrees[i] !== childTree) {
            transaction.patches.push(
              Internals.PATCH_TYPE.REPLACE_CHILD,
              childTree,
              childTrees[i],
            );

            lastTree = childTree;
          }
          // Add if there is no old Node.
          else if (lastTree && !childTrees[i]) {
            transaction.patches.push(
              Internals.PATCH_TYPE.INSERT_BEFORE,
              $$insertAfter,
              childTree,
              lastTree,
            );

            lastTree = childTree;
          }
          // Keep the old node.
          else {
            lastTree = childTrees[i];
          }

          ComponentTreeCache.set(childTree, vTree);
        }

        return transaction;
      },
    );

    console.log('compare', fragment, 'with', vTree);

    // Compare the existing component node(s) to the new node(s).
    const transaction = /** @type {Transaction} */(
      outerHTML(fragment, vTree, { tasks })
    );

    console.log('here', fragment);

    // Empty the fragment after using.
    //fragment.childNodes.length = 0;
    release(fragment);

    this.componentDidUpdate(this.props, this.state);
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
