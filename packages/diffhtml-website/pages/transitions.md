# Transitions

A unique concept to diffHTML, these transitions are activated as first class
events whenever elements are added, removed, changed, and when attributes or
text have changed.

By returning promises you can halt rendering until they have completed. This
could allow you to easily build keyframe based animations or integrate tools
like [anime.js](https://animejs.com/documentation/#finishedPromise) that
support Promises.

<a name="available-states"></a>

---

## <a href="#available-states">Available states</a>

- [**attached**](#attached)
- [**detached**](#detached)
- [**replaced**](#replaced)
- [**attributeChanged**](#attribute-changed)
- [**textChanged**](#text-changed)

There are many states you can listen to, they get added globally and allow you
to do filtering. You add them using the `addTransitionState` method.

```js
import { addTransitionState } from 'diffhtml';
```

### <a name="attached" href="#attached">Attached</a>

For when an element is attached to the DOM.

```js
addTransitionState('attached', (element) => {
  console.log(element);
});
```

### <a name="detached" href="#detached">Detached</a>

For when an element leaves the DOM.

```js
addTransitionState('detached', (element) => {
  console.log(element);
});
```

### <a name="replaced" href="#replaced">Replaced</a>

Whenever two elements are replaced at render time this is called with the old
and new elements.

```js
addTransitionState('replaced', (oldElement, newElement) => {
  console.log(oldElement, newElement);
});
```

### <a name="attribute-changed" href="#attribute-changed">Attribute changed</a>

For when attributes have changed.

```js
addTransitionState('attributeChanged', (element, attrName, oldValue, newValue) => {
  console.log(element, attrName, oldValue, newValue);
});
```

### <a name="text-changed" href="#text-changed">Text changed</a>

For when text has changed in either TextNodes or SVG text elements.

```js
addTransitionState('textChanged', (element, oldValue, newValue) => {
  console.log(element, oldValue, newValue);
});
```

<a name="add-transition"></a>

---

## <a href="#add-transition">Add transition</a>

<a name="remove-transition"></a>

---

## <a href="#remove-transition">Remove transition</a>

Removes a global transition listener. When invoked with no arguments, this
method will remove all transition callbacks. When invoked with the name
argument it will remove all transition state callbacks matching the name, and
so on for the callback.

``` javascript
// Removes all registered transition states.
diff.removeTransitionState();

// Removes states by name.
diff.removeTransitionState('attached');

// Removes states by name and callback reference.
diff.removeTransitionState('attached', callbackReference);
```

---
