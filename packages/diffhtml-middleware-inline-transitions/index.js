import { addTransitionState, removeTransitionState } from 'diffhtml';

const { assign, keys } = Object;

const eventsToTransitionName = {
  attributechanged: 'attributeChanged',
  textchanged: 'textChanged',
};

// Store maps of elements to handlers that are associated to transitions.
const transitionsMap = {
  attached: new Map(),
  detached: new Map(),
  replaced: new Map(),
  attributechanged: new Map(),
  textchanged: new Map(),
};

// Internal global transition state handlers, allows us to bind once and match.
const boundHandlers = {};

/**
 * Binds inline transitions to the parent element and triggers for any matching
 * nested children.
 */
export default function inlineTransitions(options = {}) {
  // Monitors whenever an element changes an attribute, if the attribute is a
  // valid state name, add this element into the related Set.
  const attributeChanged = function(domNode, name, oldVal, newVal) {
    const prefix = name.toLowerCase().slice(0, 2);

    // Don't bother with non-events.
    if (prefix !== 'on') {
      return;
    }

    // Normalize the event name to lowercase and without `on`.
    name = name.toLowerCase().slice(2);

    const map = transitionsMap[name];
    const isFunction = typeof newVal === 'function';

    // Abort early if not a valid transition or if the new value exists, but
    // isn't a function.
    if (!map || (newVal && !isFunction)) {
      return;
    }

    // Add or remove based on the value existence and type.
    map[isFunction ? 'set' : 'delete'](domNode, newVal);
  };

  const subscribe = () => {
    addTransitionState('attributeChanged', attributeChanged);

    // Add a transition for every type.
    keys(transitionsMap).forEach(name => {
      const map = transitionsMap[name];
      const transitionName = eventsToTransitionName[name] || name;

      // This handler is bound for every possible transition to help limit the
      // amount of transitions bound.
      const handler = (childNode, ...rest) => {
        // If the child element triggered in the transition is the root
        // element, this is an easy lookup for the handler.
        if (map.has(childNode)) {
          return map.get(childNode)(childNode, childNode, ...rest);
        }
        // Text nodes are looked up on the parent.
        else if (transitionName === 'textChanged') {
          const retVal = [];
          const { parentNode } = childNode;

          if (map.has(parentNode)) {
            return map.get(parentNode)(parentNode, childNode, ...rest);
          }
        }
        // Search if a parent is bound to this.
        else {
          let promises = [];

          map.forEach((_, parentNode) => {
            if (parentNode.contains(childNode)) {
              const ret = map.get(parentNode)(parentNode, childNode, ...rest);
              ret && promises.push(ret);
            }
          });

          if (promises.length) {
            return Promise.all(promises);
          }
        }
      };

      // Save the handler for later unbinding.
      boundHandlers[transitionName] = handler;

      // Add the state handler.
      addTransitionState(transitionName, handler);
    });
  };

  // This will unbind any internally bound transition states.
  const unsubscribe = () => {
    // Unbind all the transition states.
    removeTransitionState('attributeChanged', attributeChanged);

    // Remove all elements from the internal cache.
    keys(transitionsMap).forEach(name => {
      const map = transitionsMap[name];
      const transitionName = eventsToTransitionName[name] || name;

      // Unbind the associated global handler.
      const handler = boundHandlers[transitionName];
      removeTransitionState(transitionName, handler);

      // Empty the associated element set.
      map.clear();
    });

    // Empty the bound handlers.
    boundHandlers.length = 0;
  };

  return assign(function inlineTransitionsTask() {}, { subscribe, unsubscribe });
}
