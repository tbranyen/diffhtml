# API

While the core API has been designed to be minimalist, it was done so in an
extensible and revealing way. New users can jump right in and start creating,
while experienced developers wanting more can dip into the internals for more
flexibility.

<a name="inner-html" />

## innerHTML **`(domNode, markup, options)`**

### Purpose

Replaces the contents of a DOM node with the passed in markup, but only updates
what has changed. Works like the browser's `innerHTML` feature, where it only
updates the children, but not the root tag. If you want to control the entire
tag, use `outerHTML`.

Simple Hello world:

``` js
innerHTML(document.body, 'Hello world');
```

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="outer-html" />

## outerHTML **`(domNode, markup, options)`**

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

<a name="html" />

## html **`(markup)`**

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

<a name="use" />

## use **`(middlewareFunction)`**

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

<a name="add-transition-state" />

## addTransitionState **`(stateName, callback)`**

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

<a name="remove-transition-state" />

## removeTransitionState **`(stateName, callback)`**

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

<a name="create-tree" />

## createTree **`(nodeName, attributes, childNodes)`**

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

<a name="release" />

<a name="release" />

## release **`(domNode)`**

### Purpose

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

### Example (UMD)

A common way to access `innerHTML` is via
[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
from the globally exported `diff` object. Remember to wrap your code in a block
`{}` to prevent leaking the variables globally.

``` js
{
  const { release } = diff
  release(document.body)
}
```

Or if you prefer you can access the property directly.

``` js
diff.innerHTML(document.body, '<span>Hello world</span>')
```

### Example (Latest ES Specification)

