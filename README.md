diffHTML
--------

Latest stable: 0.8.1

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)
[![Coverage
Status](https://coveralls.io/repos/tbranyen/diffhtml/badge.svg?branch=master&service=github)](https://coveralls.io/github/tbranyen/diffhtml?branch=master) 
[![Join the chat at https://gitter.im/tbranyen/diffhtml](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/tbranyen/diffhtml)

Inspired by React and motivated by the Web, this is a low-level tool which aims
to help web developers write components for the web. By focusing on the markup
representing how your application state should look, diffHTML will figure out
how to modify the page with a minimal amount of operations.

It works by parsing your HTML markup into a lightweight JSON-serializable
Virtual DOM heirarchy. I refer to these as Virtual Trees or *VTree*. These
element (and attribute) objects are pooled to provide consistent memory
management and garbage collection. diffHTML maintains a single VTree root that
mirrors a mounted element in the DOM, it reconciles all future renders into
this tree and the DOM.

#### Features

- Intelligent virtual DOM diffing and patching of HTML text and elements.
- Transitions API to hook into element and attribute state changes. 
- Tagged template string helper to build a VTree with dynamic content. 
- Object pooling to avoid GC thrashing and expensive uuid generation.

#### Install

The latest built version is available for quick download from the [master
branch](https://raw.githubusercontent.com/tbranyen/diffhtml/master/dist/diffhtml.js).

``` sh
npm install diffhtml
```

The module can be required via Node or browser environments. It is exported as
a global named `diff` unless loaded as a module.

#### Quick start

Before diving into all the API details, the easiest way to understand using
diffHTML is to replace the usage of `innerHTML`.

For example, the following example destroys and recreates the span every time
the render method is called:

Assume the following markup:

``` html
<body>
  <span></span>
</body>
```

The following code:

``` javascript
function render(string) {
  document.querySelector('span').innerHTML = string;
}

render('Hello world!');
render('Foo bar baz!');
```

We could rewrite this with diffHTML to leverage the Virtual DOM like this:

``` javascript
function render(string) {
  diff.innerHTML(document.querySelector('span'), string);
}
```

#### API

The exposed API provides the following methods:

- [outerHTML(element, markup, options)](#user-content-diff-an-element-with-markup)
- [innerHTML(element, markup, options)](#user-content-diff-an-elements-children-with-markup)
- [element(oldElement, newElement, options)](#user-content-diff-an-element-to-another-element)
- [release(element)](#user-content-release-element)
- [addTransitionState(name, callback)](#user-content-add-a-transition-state-callback)
- [removeTransitionState(name, callback)](#user-content-remove-a-transition-state-callback)
- [html\`markup\`](#user-content-html)
- [enableProllyfill()](#user-content-prollyfill)

The follow error types are exposed:

- TransitionStateError - Happens when errors occur during transitions.
- DOMException - Happens whenever a DOM manipulation fails.

##### Options

This is an optional argument that can be passed to any diff method. The `inner`
property can only be used with the element method.

- `inner` - Boolean that determines if `innerHTML` is used.

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

##### Release element

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element.

``` javascript
var h1 = document.createElement('h1');

h1.innerHTML = 'Hello world!';

diff.element(document.body, h1, { inner: true });
diff.release(document.body);
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

##### A note about detached/replaced element accuracy

When rendering Nodes that contain lists of identical elements, you may not
receive the elements you expect in the detached and replaced transition state
hooks. This is a known limitation of string diffing and allows for better
performance. By default if no key is specified, the last element will be
removed and the subsequent elements from the one that was removed will be
mutated via replace.

This isn't really ideal. **At all.**

What you should do here is add a `key` attribute with a unique `value` that
persists between renders.

For example, when the following markup...

``` html
<ul>
  <li>Test</li>
  <li>This</li>
  <li>Out</li>
</ul>
```

...is changed into...

``` html
<ul>
  <li>Test</li>
  <li>Out</li>
</ul>
```

The transformative operations are:

1. Remove the last element
2. Replace the text of the second element to 'out'

What we intended, however, was to simply remove the second item. And to achieve
that, decorate your markup like so...

``` html
<ul>
  <li key="1">Test</li>
  <li key="2">This</li>
  <li key="3">Out</li>
</ul>
```

...and update with matching attributes...

``` html
<ul>
  <li key="1">Test</li>
  <li key="3">Out</li>
</ul>
```

Now the transformative operations are:

1. Remove the second element

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

#### HTML

You can use the `diff.html` tagged template helper to build up dynamic trees in
a way that looks very similar to JSX.

For instance the following example:

``` javascript
const fixture = document.createElement('div');

function showUnixTime() {
  fixture.querySelector('span').innerHTML = Date.now();
}

diff.outerHTML(fixture, `
  <div>
    <button>Show current unix time</button>
    <span>${Date.now()}</span>
  </div>
`);

fixture.addEventListener('click', showUnixTime);
```

Could be rebuilt as:

``` javascript
const fixture = document.createElement('div');

function showUnixTime() {
  fixture.querySelector('span').innerHTML = Date.now();
}

diff.outerHTML(fixture, html`
  <div onclick=${showUnixTime}>
    <button>Show current unix time</button>
    <span>${Date.now()}</span>
  </div>
`);
```

So this feature allows for inline binding of any DOM event, sending complex
property data to any element.

#### [Prollyfill](https://twitter.com/slexaxton/status/257543702124306432)

*Click above to learn what prollyfill "means".*

I'd love to see this project become a browser standard in the future.  To
enable how I'd envision it working, simply invoke the following method on the
diff object:

``` javascript
diff.enableProllyfill();
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

[More information and a demo are available on http://www.diffhtml.org/](http://www.diffhtml.org/)
