# Transitions

A unique concept to diffHTML, these transitions are activated as first class
events whenever elements are added, removed, changed, and when attributes or
text have changed.

By returning promises you can halt rendering until they have completed. This
could allow you to easily build keyframe based animations or integrate tools
like [anime.js](https://animejs.com/documentation/#finishedPromise) that
support Promises.

<a name="states"></a>

---

## <a href="#states">States</a>

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

<a name="attached"></a>

---

### <a href="#attached">Attached</a>

This triggers whenever an element gets added into the DOM. Text and comment
nodes are not included.

```js
addTransitionState('attached', (element) => {
  console.log(element);
});
```

<a name="detached"></a>

---

### <a href="#detached">Detached</a>

For when an element leaves the DOM.

```js
addTransitionState('detached', (element) => {
  console.log(element);
});
```

<a name="replaced"></a>

---

### <a href="#replaced">Replaced</a>

Whenever two elements are replaced at render time this is called with the old
and new elements.

```js
addTransitionState('replaced', (oldElement, newElement) => {
  console.log(oldElement, newElement);
});
```

<a name="attribute-changed"></a>

---

### <a href="#attribute-changed">Attribute changed</a>

For when attributes have changed.

```js
addTransitionState('attributeChanged', (element, attrName, oldValue, newValue) => {
  console.log(element, attrName, oldValue, newValue);
});
```

<a name="text-changed"></a>

---

### <a href="#text-changed">Text changed</a>

For when text has changed in either TextNodes or SVG text elements.

```js
addTransitionState('textChanged', (element, oldValue, newValue) => {
  console.log(element, oldValue, newValue);
});
```

---
