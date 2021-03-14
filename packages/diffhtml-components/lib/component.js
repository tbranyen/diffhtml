import {
  EMPTY,
  ComponentTreeCache,
  InstanceCache,
  Props,
  Transaction,
  VTree,
  State,
} from './util/types';
import { $$render, $$vTree, $$unsubscribe } from './util/symbols';
import { getBinding } from './util/binding';
import middleware from './shared/middleware';

const { outerHTML, createTree, release, Internals } = getBinding();
const { NodeCache, memory, createNode } = Internals;
const { from, isArray } = Array;
const { keys, assign } = Object;
const RenderDebounce = new WeakMap();

/**
 * Represents a vanilla JavaScript Component. This is a lightweight version of
 * what you'd find in most modern web application libraries. It provides a
 * React-inspired API.
 */
export default class Component {
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
    Component[$$unsubscribe] = getBinding().use(middleware());
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
    const props = this.props = assign({}, initialProps);
    const { defaultProps = EMPTY.OBJ } = /** @type {any} */ (this.constructor);

    // Merge default props into props object.
    if (typeof defaultProps === 'object' && !isArray(defaultProps)) {
      keys(defaultProps || EMPTY.OBJ).forEach(prop => {
        if (prop in props && props[prop] !== undefined) {
          return;
        }

        this.props[prop] = defaultProps[prop];
      });
    }
  }

  /**
   * @param {Props} props
   * @param {State} state
   *
   * @returns {VTree[] | VTree | null | undefined}
   */
  // @ts-ignore
  render(props, state) {
    return null;
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

  /** @type {VTree | null} */
  [$$vTree] = null;

  /**
   * Stateful render. Used when a component changes and needs to re-render
   * itself. This is triggered on `setState` and `forceUpdate` calls.
   *
   * @return {Promise<void> | undefined}
   */
  [$$render]() {
    // Get the fragment tree associated with this component. This is used to
    // lookup rendered children.
    const vTree = this[$$vTree];

    // Find all previously rendered top-level children associated to this
    // component. This will be used to diff against the newly rendered
    // elements.
    const childTrees = from(ComponentTreeCache.keys()).filter(key => {
      const rootTree = ComponentTreeCache.get(key);

      if (rootTree === vTree) {
        // Remove from the cache, since these elements may be removed or
        // replaced.
        ComponentTreeCache.delete(key);
        return true;
      }
    });

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
      else if (lastNode) {
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

    return promise.then(() => {
      // Empty the fragment after using.
      fragment.childNodes.length = 0;
      release(fragment);

      this.componentDidUpdate(this.props, this.state);
    });
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

// Automatically subscribe the Component middleware.
Component.subscribeMiddleware();
