const states = [
  'attached',
  'detached',
  'replaced',
  'attributeChanged',
  'textChanged',
];

const transitionsMap = new WeakMap();

/**
 * Binds inline transitions to the parent element and triggers for any matching
 * nested children.
 */
export default function({ addTransitionState, removeTransitionState }) {
  // Set a "global" `attributeChanged` to monitor all elements for transition
  // states being attached.
  addTransitionState('attributeChanged', (element, name, oldVal, newVal) => {
    const internalMap = transitionsMap.get(element) || {};

    if (states.indexOf(name) === -1) {
      return;
    }

    if (newVal) {
      transitionsMap.set(element, Object.assign(internalMap, {
        [name]: (...args) => {
          if (element.contains(args[0])) {
            return newVal.apply(this, [element].concat(args));
          }
        }
      }));

      addTransitionState(name, internalMap[name])
    }
    else if (internalMap[name]) {
      removeTransitionState(name, internalMap[name])
      delete internalMap[name];
      transitionsMap.set(element, internalMap);
    }
  })
}
