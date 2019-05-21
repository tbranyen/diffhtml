# API

The core diffHTML API was designed to be minimal and familiar if you've used
browser DOM APIs such as `innerHTML` and `addEventListener`. 

You can access any of the top-level API methods & properties by directly
importing, or deconstructing.

``` js
// Using ESM
import { innerHTML, VERSION, use } from 'diffhtml';

// Using CJS
const { innerHTML, VERSION, use } = require('diffhtml');

// Using globals
const { innerHTML, VERSION, use } = window.diff;
```

<a name="inner-html"></a>

---

## <a href="#inner-html">innerHTML</a> **`(domNode, markup, options)`**

Replaces the contents of a DOM node with the passed in markup, but will only
update changed content and structure. Works like the browser's `innerHTML` only
changing the element's children, but not the containing element. If you want to
control the entire tag, use [`outerHTML`](#outer-html).

Simple Hello world:

``` js
innerHTML(document.body, 'Hello world');
```

### Arguments

#### domNode

Reference element to reflect new markup into

#### markup

New markup to replace into the `domNode`

#### options

<a name="outer-html"></a>

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

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="html"></a>

---

## <a href="#html">html</a> **`(markup)`**

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

<a name="use"></a>

---

## <a href="#use">use</a> **`(middlewareFunction)`**

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
