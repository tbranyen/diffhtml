# API

The core diffHTML API was designed to be minimal and familiar if you've used
browser DOM APIs such as `innerHTML` and `addEventListener`. 

You can access any of the top-level API methods & properties by directly
importing, or deconstructing.

**Using ES modules**

``` js
import { innerHTML, VERSION, use } from 'diffhtml';
// or
import diff from 'diffhtml';
```

**Using CommonJS**

``` js
const { innerHTML, VERSION, use } = require('diffhtml');
// or
const diff = require('diffhtml');
```

**Using browser globals**

``` js
const { innerHTML, VERSION, use } = window.diff;
// or
const { diff } = window;
```

<a name="inner-html"></a>

---

## <a href="#inner-html">innerHTML</a> **`(domNode, markup, options)`**

Replaces the contents of a DOM node with the passed in markup, but will only
update changed content and structure. Works like the browser's `innerHTML` only
changing the element's children, but not the containing element. If you want to
control the entire tag, use [`outerHTML`](#outer-html).

### Arguments

| Name        | Description
| ----------- | -----------
| **domNode** | The root DOM Node to change the child contents of, but not the element itself.
| **markup**  | New markup to replace into the `domNode`. 
| **options** | <ul><li><b>- tasks:</b> An array of tasks to run. Can swap these out completely to run custom logic instead.</li></ul>

<a name="outer-html"></a>

### Examples

---

## <a href="#outer-html">outerHTML</a> **`(domNode, markup, options)`**

Replaces the contents of a DOM node with the passed in markup, only updates
what has changed. Additionally updates the attributes of the parent. If the
element you're modifying has a parent, you may also change the element type,
but this isn't really recommended.

Example:

``` js
outerHTML(document.body, '<body>Hello world</body>');
```

### Arguments

| Name        | Description
| ----------- | -----------
| **domNode** | A DOM Node to change.
| **markup**  | New markup to replace the entire `domNode` with. 
| **options** | <ul><li><b>- tasks:</b> An array of tasks to run. Can swap these out completely to run custom logic instead.</li></ul>


<a name="html"></a>

---

## <a href="#html">html</a> **`(markup)`**

A [tagged
template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
function that parses HTML and creates VTree's under-the-hood. Can also be used
like a normal function. Effectively creates the manual `createTree(nodeName,
attributes, children)` calls automatically by parsing the HTML. You are allowed
to "interpolate" or mix dynamic values with the HTML string content. This is
useful when working with Web Components, DOM events,

When you pass a single element and provide newlines and whitespace before and
after it, like the example below, it will be automatically trimmed. If you
provide multiple elements, the whitespace becomes 

A simple example of its usage along with interpolation.

``` js
html`
  <body>
    <center style=${{ fontSize: '11px' }}>Hello world</center>
  </body>
`;
```

Will basically convert to:

``` js
createTree('body', null, [
  createTree('center', { style: { fontSize: '11px' } }, ['Hello world']),
]);
```

To see how to run this example yourself see the [Examples](#examples) section
below.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="use"></a>

---

## <a href="#use">use</a> **`(middlewareFunction or middlewareObject)`**

Can be used to mount pre-existing middleware or you can write your own.
Middleware are effectively hooks that execute in various areas of the
reconciler during a render call such as `innerHTML` or `outerHTML`.

A function is useful when you want to follow the transactions (which are
started and run a series of tasks), and passing an object can be cleaner when
you want to modify the Virtual Tree or automatically add properties.

### Arguments

| Name        | Description
| ----------- | -----------
| **middlewareFunction** | Use this when you want total control over the task flow. Return inner functions to delve deeper into the flow. Any of the middleware object properties may be attached the function and used together.
| **middlewareObject** | Use this when you don't care about the transaction start/stop, and want a cleaner way to monitor the VTree lifecycle. <p><b>- createTreeHook</b></p><p><b>- syncTreeHook</b></p> <p><b>- releaseHook</b></p>

### Examples

#### Logging the start of a render transaction

``` js
function someTask(transaction) {
  console.log('Start of render transaction:', transaction);
}

use(someTask);
```

#### Logging the end of a render transaction

``` js
function someTask(transaction) {
  console.log('Start of render transaction:', transaction);

  return () => {
    console.log('End of render transaction scheduled');

    // Must wait until all transitions complete to know for sure that the
    // render action has completed.
    transaction.onceEnded(() => {
      console.log('End of render transaction completed');
    });
  };
}

use(someTask);
```

<a name="add-transition-state"></a>

---

## <a href="#add-transition-state">addTransitionState</a> **`(stateName, callback)`**

Replaces the contents of a DOM node with the passed in markup, only updates
what has changed.

Example:

``` js
outerHTML(document.body, 'Hello world');
```

To see how to run this example yourself see the [Examples](#examples) section
below.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="remove-transition-state"></a>

---

## <a href="#remove-transition-state">removeTransitionState</a> **`(stateName, callback)`**

Replaces the contents of a DOM node with the passed in markup, only updates
what has changed.

Example:

``` js
outerHTML(document.body, 'Hello world');
```

To see how to run this example yourself see the [Examples](#examples) section
below.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="create-tree"></a>

---

## <a href="#create-tree">createTree</a> **`(nodeName, attributes, childNodes)`**

Replaces the contents of a DOM node with the passed in markup, only updates
what has changed.

Example:

``` js
outerHTML(document.body, 'Hello world');
```

To see how to run this example yourself see the [Examples](#examples) section
below.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="release"></a>

---

## <a href="#release">release</a> **`(domNode)`**

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

#### domNode

*Reference element.*

This argument is overloaded. Can be one of many types:

- HTML Element / DOM Node (Used interchangeably)
- Virtual Tree Element (produced from `diff.html`)

<a name="internals"></a>

---

## <a href="#internals">Internals</a>

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

#### domNode

*Reference element.*

This argument is overloaded. Can be one of many types:

- HTML Element / DOM Node (Used interchangeably)
- Virtual Tree Element (produced from `diff.html`)

<a name="version"></a>

---

## <a href="#version">VERSION</a>

Property which indicates the current running version of diffHTML.

### Example

``` js
console.log(VERSION);
```

---
