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

  // Schedule a componentDidMount if a function was provided
  if (typeof didMountOrUpdate === 'function') {
    activeComponent.componentDidMount = () => {
      const didUpdate = didMountOrUpdate();

      // Then if the user specifies a return function, use that as didUpdate
      if (typeof didUpdate === 'function') {
        activeComponent.componentDidUpdate = () => {
          didUpdate();
        };
      }

    };
  }

  // Schedule a componentWillUnmount if a function is provided
  if (typeof unMount === 'function') {
    activeComponent.componentWillUnmount = () => unMount();
  }

  // Increment the hooks count.
  activeComponent[$$hooks].i += 1;
}
