diffHTML Prollyfill
-------------------

Stable Version: 1.0.0-beta.3

Use directly in place of [`diffhtml`](https://github.com/tbranyen/diffhtml).
The term prollyfill means I'd like to see it be a standard some day, but is
currently not under any consideration. [*Click here for the "prollyfill"
origin tweet.*](https://twitter.com/slexaxton/status/257543702124306432)

#### Install

Assuming you want to install the latest version of diffHTML with the
prollyfill:

``` sh
npm install --save diffhtml diffhtml-prollyfill
```

This architecture makes it easy to swap out versions of diffHTML to use with
the prollyfill.

#### Documentation

Quick usage:

``` js
import enableProllyfill from 'diffhtml-prollyfill';

// Enable the prollyfill which exposes globals.
enableProllyfill();

// Diff the text contents into `<body>`.
document.body.ouerHTML = `<body>Hello world</body>`;
```

*Disclaimer: By calling this method, you are agreeing that it's okay for
diffHTML to modify your browser's `HTMLElement` constructor,
`Element.prototype`, the `document` object, and add some globals to window.*

##### `Element.prototype.outerHTML`

Overrides the default `outerHTML` behavior to automatically apply a virtual
DOM to the outer contents.

``` javascript
document.querySelector('main').outerHTML = '<new markup to diff/>';
```

##### `Element.prototype.innerHTML`

Overrides the default `innerHTML` behavior to automatically apply a virtual
DOM to the inner contents.

``` javascript
document.querySelector('main').innerHTML = '<new child markup to diff/>';
```

##### `Element.prototype.release`

Cleans up a given DOM Node's association with diffHTML.

``` javascript
const newElement = document.createElement('main');

newElement.innerHTML = '<div></div>';
newElement.release();
```
