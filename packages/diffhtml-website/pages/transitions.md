# Transitions

A first-class global event system that triggers whenever Node operations are
patched into the DOM. You can bind to several states, such as attached or
detached. All states are described below.

Returning a Promise from the callback will halt future renders until it is
fulfilled. This could allow you to easily build keyframe based animations or
integrate tools like
[anime.js](https://animejs.com/documentation/#finishedPromise) which support
Promises.

You can use transitions for more than just animations. It can be useful for
modifying a DOM node based on some condition when it enters the page, such as
backfilling an unavailable/unstable API.

<a name="states"></a>

---

## <a href="#states">States</a>

The following states are available to hook into through the Virtual DOM
operations.

- [**attached**](#attached)
- [**detached**](#detached)
- [**replaced**](#replaced)
- [**attributeChanged**](#attribute-changed)
- [**textChanged**](#text-changed)

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
