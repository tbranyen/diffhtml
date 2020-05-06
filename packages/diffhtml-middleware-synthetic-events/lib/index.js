const useCapture = [
  'onload', 'onunload', 'onscroll', 'onfocus', 'onblur', 'onloadstart',
  'onprogress', 'onerror', 'onabort', 'onload', 'onloadend', 'onpointerenter',
  'onpointerleave',
];

const { assign, defineProperty, getOwnPropertyDescriptor } = Object;
const eventNames = [];
const handlers = new Map();
const bounded = new Set();

// Ensure we don't get user added event/properties.
const cloneDoc = typeof document !== 'undefined' ? document.cloneNode() : null;

// Fill up event names.
for (const name in cloneDoc) {
  if (name.indexOf('on') === 0) {
    eventNames.push(name);
  }
}

class SyntheticEvent {}

const cloneEvent = (ev, ov = {}) => {
  const newEvent = new SyntheticEvent();

  // Copy over original event getters/setters first, will need some extra
  // intelligence to ensure getters/setters work, thx @kofifus.
  for (let key in ev) {
    const desc = getOwnPropertyDescriptor(ev, key);

    if (key === 'isTrusted') { continue; }

    if (desc && desc.get) {
      defineProperty(newEvent, key, desc);
    }
    else {
      newEvent[key] = ev[key];
    }
  }

  // Copy over overrides.
  for (let key in ov) {
    newEvent[key] = ov[key];
  }

  return newEvent;
}

const getShadowRoot = node => {
  while (node = node.parentNode) {
    if (node.toString() === "[object ShadowRoot]") {
      return node;
    }
  }

  return false;
};

// Set up global event delegation, once clicked call the saved handlers.
const bindEventsTo = domNode => {
  const rootNode = getShadowRoot(domNode) || domNode.ownerDocument;
  const { addEventListener } = rootNode;

  if (bounded.has(rootNode)) {
    return false;
  }

  bounded.add(rootNode);

  eventNames.forEach(eventName => addEventListener(eventName.slice(2), ev => {
    let target = ev.target;
    let eventHandler = null;

    const path = ev.path ? ev.path : ev.composedPath ? ev.composedPath() : [];

    // If we were unable to get the path via some kind of standard approach,
    // build it up manually.
    if (!path.length) {
      for (let node = target; node; node = node.parentNode) {
        path.push(node);
      }
    }

    for (let i = 0; i < path.length; i++) {
      const node = path[i];

      if (handlers.has(node)) {
        const hasEventHandler = handlers.get(node)[eventName];

        if (hasEventHandler) {
          eventHandler = hasEventHandler;
        }

        break;
      }
    }

    const syntheticEvent = cloneEvent(ev, {
      stopPropagation() {
        ev.stopImmediatePropagation();
        ev.stopPropagation();
      },
      preventDefault() { ev.preventDefault(); },
      nativeEvent: ev,
    });
    eventHandler && eventHandler(syntheticEvent);
  }, useCapture.includes(eventName) ? true : false));
}

const syntheticEvents = () => {
  let Internals = null;

  function syntheticEventsTask() {
    return ({ patches }) => {
      const { length } = patches;
      const { PATCH_TYPE, decodeEntities, createNode } = Internals;

      let i = 0;

      while (true) {
        const patchType = patches[i];

        if (i === length) {
          break;
        }

        switch(patchType) {
          case PATCH_TYPE.SET_ATTRIBUTE: {
            const vTree = patches[i + 1];
            const name = patches[i + 2];
            const value = decodeEntities(patches[i + 3]);

            const domNode = createNode(vTree);
            const eventName = name.toLowerCase();

            // Remove inline event binding from element and add to handlers.
            if (eventNames.includes(eventName)) {
              const handler = value;
              domNode[eventName] = undefined;

              const newHandlers = handlers.get(domNode) || {};

              // If the value passed is a function, that's what we're looking for.
              if (typeof handler === 'function') {
                newHandlers[eventName] = handler;
              }
              // If the value passed is a string name for a global function, use
              // that.
              else if (typeof window[handler] === 'function') {
                newHandlers[eventName] = window[handler];
              }
              // Remove the event association if the value passed was not a
              // function.
              else {
                delete newHandlers[eventName];
              }

              handlers.set(domNode, newHandlers);
              bindEventsTo(domNode);
            }

            i += 4;
            break;
          }

          case PATCH_TYPE.REMOVE_ATTRIBUTE: {
            const vTree = patches[i + 1];
            const name = patches[i + 2];

            const domNode = NodeCache.get(vTree);
            const eventName = name.toLowerCase();

            // Remove event binding from element and instead add to handlers.
            if (eventNames.includes(eventName)) {
              const newHandlers = handlers.get(domNode) || {};
              delete newHandlers[eventName];
              handlers.set(domNode, newHandlers);
            }

            i += 3;
            break;
          }

          case PATCH_TYPE.NODE_VALUE:
          case PATCH_TYPE.INSERT_BEFORE: {
            i += 4;
            break;
          }

          case PATCH_TYPE.REPLACE_CHILD: {
            i += 3;
            break;
          }

          case PATCH_TYPE.REMOVE_CHILD: {
            i += 2;
            break;
          }
        }
      }
    }
  }

  return assign(syntheticEventsTask, {
    displayName: 'syntheticEventsTask',

    subscribe(_Internals) {
      Internals = _Internals;
    },
  });
};

export default syntheticEvents;
