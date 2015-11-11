diffhtml
--------

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)
[![Join the chat at https://gitter.im/tbranyen/diffhtml](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/tbranyen/diffhtml)

Inspired by React and motivated by the Web, this is a low-level tool which aims
to help web developers write applications. By focusing on the markup
representing how your application state should look, diffhtml will figure out
how to modify the page with the fewest amount of operations.

**Features:**

- Intelligent virtual DOM diffing and patching of HTML text and elements.
- Transitions API to hook into element and attribute state changes. 
- Custom Elements in browsers without native support.
- Offloading diff to Web Workers which provides better rendering performance.
  * Considered experimental, may not work 100% to your liking.
- Object pooling to avoid GC thrashing and expensive uuid generation.

#### Install

``` sh
npm install diffhtml
```

The module can be required via Node or browser environments.  It is exported as
a global named `diff`.

#### API

The exposed API provides the following methods:

- [outerHTML(element, markup, options)](#user-content-diff-an-element-with-markup)
- [innerHTML(element, markup, options)](#user-content-diff-an-elements-children-with-markup)
- [element(oldElement, newElement, options)](#user-content-diff-an-element-to-another-element)
- [addTransitionState(name, callback)](#user-content-add-a-transition-state-callback)
- [removeTransitionState(name, callback)](#user-content-remove-a-transition-state-callback)
- [enableProllyfill()](#user-content-prollyfill)

##### Options

This is an optional argument that can be passed to any diff method.  Here you
can specify if you'd like to opt into the WebWorker to offload calculates to
increase performance.  The `inner` property can only be used with the element
method.

- `inner` - Boolean that determines if `innerHTML` is used.
- `enableWorker` - Boolean that determines if the WebWorker is utilized.

##### Diff an element with markup

This method will take in a string of markup that matches the element root you
are diffing against.  This allows you to change attributes and text on the
main element.  This also allows you to change the `document.documentElement`.

You cannot override the `inner` options property here.


``` javascript
diff.outerHTML(document.body, '<body class="test"><h1>Hello world!</h1></body>');
```

##### Diff an element's children with markup

This method also takes in a string of markup, but unlike `outerHTML` this is
children-only markup that will be nested inside the element passed.

You cannot override the `inner` options property here.


``` javascript
diff.innerHTML(document.body, '<h1>Hello world!</h1>');
```

##### Diff an element to another element

Unlike the previous two methods, this will take in two elements and diff them
together.

The `inner` options property can be set here to change between inner/outerHTML.


``` javascript
var newBody = document.createElement('body');

newBody.innerHTML = '<h1>Hello world!</h1>';
newBody.setAttribute('class', 'test');

diff.element(document.body, newBody);
```

With `inner` set:

``` javascript
var h1 = document.createElement('h1');

h1.innerHTML = 'Hello world!';

diff.element(document.body, h1, { inner: true });
```

##### Add a transition state callback

Adds a global transition listener.  With many elements this could be an
expensive operation, so try to limit the amount of listeners added if you're
concerned about performance.

Since the callback triggers with various elements, most of which you probably
don't care about, you'll want to filter.  A good way of filtering is to use the
DOM `matches` method.  It's fairly well supported
(http://caniuse.com/#feat=matchesselector) and may suit many projects.  If you
need backwards compatibility, consider using jQuery's `is`.

You can do fun, highly specific, filters:

``` javascript
addTransitionState('attached', function(element) {
 // Fade in the main container after it's attached into the DOM.
 if (element.matches('body main.container')) {
   $(element).stop(true, true).fadeIn();
 }
});
```

**Available states**

Format is: `name[callbackArgs]`

- `attached[element]`
  For when an element is attached to the DOM.
- `detached[element]`
  For when an element leaves the DOM.
- `replaced[oldElement, newElement]`
  For when elements are swapped
- `attributeChanged[element, attributeName, oldValue, newValue]` 
  For when attributes are changed.
- `textChanged[element, oldValue, newValue]`
  For when text has changed in either TextNodes or SVG text elements.

##### Remove a transition state callback

Removes a global transition listener.

When invoked with no arguments, this method will remove all transition
callbacks.  When invoked with the name argument it will remove all transition
state callbacks matching the name, and so on for the callback.

``` javascript
// Removes all registered transition states.
diff.removeTransitionState();

// Removes states by name.
diff.removeTransitionState('attached');

// Removes states by name and callback reference.
diff.removeTransitionState('attached', callbackReference);
```

#### [Prollyfill](https://twitter.com/slexaxton/status/257543702124306432)

*Click above to learn what prollyfill "means".*

I'd love to see this project become a browser standard in the future.  To
enable how I'd envision it working, simply invoke the following method on the
diff object:

``` javascript
diff.enableProllyfill();
```

*Disclaimer: By calling this method, you are agreeing that it's okay for
diffhtml to modify your browser's `HTMLElement` constructor,
`Element.prototype`, the `document` object, and run some logic on your page
load event.*

If you have already loaded the page (meaning the load event has fired),
diffhtml will immediately search the page for Custom Elements and automatically
initialize them. If the page has not yet loaded, it will wait before invoking
which gives you time to register your elements first.

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

Cleans up after diffhtml and removes the associated worker.

``` javascript
var newElement = document.createElement('main');
newElement.innerHTML = '<div></div>';

document.querySelector('main').diffRelease(newElement);
```

[More information and a demo are available on http://www.diffhtml.org/](http://www.diffhtml.org/)
