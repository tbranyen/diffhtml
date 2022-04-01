import { $$hooks } from './util/symbols';
import { ActiveRenderState } from './util/types';

/**
 * Allow a function component to hook into lifecycle methods in a manner
 * consistent with class components. Meaning you can leverage existing lifecycle
 * events in a function component.
 *
 * @param {Function=} didMountOrUpdate - A function that is called whenever the
 * component is mounted. To hook into component updates, return a function. This
 * returned function will be called whenever the component updates.
 *
 * @param {Function=} unMount - A function that is called whenever a component
 * is unmounted.
 *
 * @returns {void}
 */
export function createSideEffect(didMountOrUpdate, unMount) {
  if (ActiveRenderState.length === 0) {
    throw new Error('Cannot create side effect unless in render function');
  }

  if (typeof didMountOrUpdate !== 'function' && typeof unMount !== 'function') {
    throw new Error('Missing function for side effect');
  }

  const [ activeComponent ] = ActiveRenderState;
  const hooks = activeComponent[$$hooks];
  const isSet = Boolean(hooks.fns[hooks.i]);

  // Indicate this hook has been installed.
  hooks.fns[hooks.i] = true;

  // Increment the hooks count.
  activeComponent[$$hooks].i += 1;

  // Short-circuit if effects are already installed.
  if (isSet) {
    return;
  }

  // Schedule a componentDidMount if a function was provided
  if (typeof didMountOrUpdate === 'function') {
    const oldDidMount = activeComponent.componentDidMount;

    // Install the componentDidMount lifecycle hook.
    activeComponent.componentDidMount = () => {
      if (typeof oldDidMount === 'function') {
        oldDidMount();
      }

      // Install the componentDidUpdate lifecycle hook.
      const didUpdate = didMountOrUpdate();
      const oldComponentDidUpdate = activeComponent.componentDidUpdate;

      // Then if the user specifies a return function, use that as didUpdate
      if (typeof didUpdate === 'function') {
        activeComponent.componentDidUpdate = () => {
          if (typeof oldComponentDidUpdate === 'function') {
            oldComponentDidUpdate();
          }

          didUpdate();
        };
      }
    };
  }

  // Install the componentWillUnmount lifecycle hook.
  if (typeof unMount === 'function') {
    const oldWillUnmount = activeComponent.componentWillUnmount;

    activeComponent.componentWillUnmount = () => {
      if (typeof oldWillUnmount === 'function') {
        oldWillUnmount();
      }

      unMount();
    };
  }
}
