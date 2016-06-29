diffHTML Prollyfill
-------------------

Use directly in place of [`diffhtml`](https://github.com/tbranyen/diffhtml). The term prollyfill means I'd like to see it be a standard some day, but is currently not under any consideration.
[*Click here for the "prollyfill" origin tweet.*](https://twitter.com/slexaxton/status/257543702124306432)


#### Install

##### For npm v2:

``` sh
npm install diffhtml-prollyfill
```

##### For npm v3:

(In npm v3, `peerDependencies` are not automatically installed).

``` sh
npm install diffhtml diffhtml-prollyfill
```

#### Documentation

Quick usage:

``` js
import { enableProllyfill } from 'diffhtml-prollyfill';

// Enable the prollyfill which exposes globals.
enableProllyfill();

// Diff the text contents into `<body>`.
document.body.diffOuterHTML = `<body>Hello world</body>`;
```

*Disclaimer: By calling this method, you are agreeing that it's okay for
diffHTML to modify your browser's `HTMLElement` constructor,
`Element.prototype`, the `document` object, and run some logic on your page
load event.*

##### `Element.prototype.diffOuterHTML`

Scans for changes in attributes and text on the parent, and all child nodes.

``` javascript
document.querySelector('main').diffOuterHTML = '<new markup to diff/>';
```

##### `Element.prototype.diffInnerHTML`

Only scans for changes in child nodes.

``` javascript
document.querySelector('main').diffInnerHTML = '<new child markup to diff/>';
```

##### `Element.prototype.diffElement`

Compares the two elements for changes like `outerHTML`, if you pass `{ inner:
true }` as the second argument it will act like `innerHTML`.

``` javascript
var newElement = document.createElement('main');
newElement.innerHTML = '<div></div>';

document.querySelector('main').diffElement(newElement);
```

##### `Element.prototype.diffRelease`

Cleans up after diffHTML and removes the associated worker.

``` javascript
var newElement = document.createElement('main');
newElement.innerHTML = '<div></div>';

document.querySelector('main').diffRelease(newElement);
```
