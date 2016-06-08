// Store maps of elements to handlers that are associated to transitions.
const transitionsMap = {
  attached: new Map(),
  detached: new Map(),
  replaced: new Map(),
  attributeChanged: new Map(),
  textChanged: new Map(),
};

// Internal global transition state handlers, allows us to bind once and match.
const boundHandlers = [];

/**
 * Binds inline transitions to the parent element and triggers for any matching
 * nested children.
 */
module.exports = function({ addTransitionState, removeTransitionState }) {
  const attached = function(element) {
    if (element.attached) {
      return element.attached(element, element);
    }
  };

  // Monitors whenever an element changes an attribute, if the attribute
  // is a valid state name, add this element into the related Set.
  const attributeChanged = function(element, name, oldVal, newVal) {
    const map = transitionsMap[name];

    // Abort early if not a valid transition or if the new value exists, but
    // isn't a function.
    if (!map || (newVal && typeof newVal !== 'function')) {
      return;
    }

    // Add or remove based on the value existence and type.
    map[typeof newVal === 'function' ? 'set' : 'delete'](element, newVal);
  };

  // This will unbind any internally bound transition states.
  const unsubscribe = () => {
    // Unbind all the transition states.
    removeTransitionState('attached', attached);
    removeTransitionState('attributeChanged', attributeChanged);

    // Remove all elements from the internal cache.
    Object.keys(transitionsMap).forEach(name => {
      const map = transitionsMap[name];

      // Unbind the associated global handler.
      removeTransitionState(name, boundHandlers.shift());

      // Empty the associated element set.
      map.clear();
    });

    // Empty the bound handlers.
    boundHandlers.length = 0;
  };

  // If this function gets repeatedly called, unbind the previous to avoid doubling up.
  unsubscribe();

  // Set a "global" `attributeChanged` to monitor all elements for transition
  // states being attached.
  addTransitionState('attached', attached);
  addTransitionState('attributeChanged', attributeChanged);

  // Add a transition for every type.
  Object.keys(transitionsMap).forEach(name => {
    const map = transitionsMap[name];

    const handler = (child, ...rest) => {
      // If there are no elements to match here, abort.
      if (!map.size) {
        return;
      }
      // If the child element triggered in the transition is the root element,
      // this is an easy lookup for the handler.
      else if (map.has(child)) {
        // Attached is handled special by the separate global attached handler.
        if (name !== 'attached') {
          return map.get(child).apply(child, [child].concat(rest));
        }
      }
      // The last resort is looping through all the registered elements to see
      // if the child is contained within. If so, it aggregates all the valid
      // handlers and if they return Promises return them into a `Promise.all`.
      else {
        const retVal = [];

        // Last resort check for child.
        map.forEach((fn, element) => {
          if (element.contains(child)) {
            retVal.push(fn.apply(child, [element].concat(child, rest)));
          }
        });

        const hasPromise = retVal.some(ret => Boolean(ret && ret.then));

        // This is the only time the return value matters.
        if (hasPromise) {
          return Promise.all(retVal);
        }
      }
    };

    // Save the handler for later unbinding.
    boundHandlers.push(handler);

    // Add the state handler.
    addTransitionState(name, handler);
  });

  return unsubscribe;
}
