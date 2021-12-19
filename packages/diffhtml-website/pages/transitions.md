# Transitions

A first-class global event system that triggers callbacks whenever nodes,
attributes, and text values are added, removed, and replaced in the DOM. All
states are described below.

You can use transitions for more than just animations. It can be useful for
modifying a DOM node based on some condition when it enters the page, such as
backfilling an unavailable/unstable API. You are operating on the actual DOM
node when it enters and leaves the page, so you can install and unhook any
code.

<a name="promises"></a>

---

## <a href="#promises">Promises</a>

You may optionally return a Promise in the transition hook to halt future
renders and pause the current operation until it resolves. This is very useful
for animating out an element before it is removed from the DOM. This API makes
it easy to integrate with [Web
Animations](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished)
and [Anime.js](https://animejs.com/documentation/#finishedPromise). This could
be used to enable serial or parallel animations.

```js
import { addTransitionState } from 'diffhtml';

// Demonstrates a transition hook that can animate any element
// that is added to the DOM.
addTransitionState('attached', domElement => {
  const frames = [
    { transform: 'translateY(-100%)' },
    { transform: 'translateY(0)' },
  ];

  // `animate` is from Web Animations and `finished` is a Promise
  // which resolves once the animation completes.
  return domElement.animate(frames, { duration: 1000 }).finished;
});
```

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
